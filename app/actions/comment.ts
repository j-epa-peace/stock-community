'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function createComment(data: { postId: string; content: string; parentId?: string }) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
            return { error: '로그인이 필요합니다' }
        }

        const comment = await prisma.comment.create({
            data: {
                content: data.content,
                postId: data.postId,
                userId: currentUser.userId,
                parentId: data.parentId || null
            },
            include: {
                user: {
                    select: { name: true, id: true, reputation: true }
                }
            }
        })

        // Increase reputation by 2 for creating a comment
        await prisma.user.update({
            where: { id: currentUser.userId },
            data: { reputation: { increment: 2 } }
        })

        return {
            success: true,
            comment: {
                ...comment,
                createdAt: comment.createdAt.toISOString(),
                updatedAt: comment.updatedAt.toISOString()
            }
        }
    } catch (error) {
        console.error('Create comment error:', error)
        return { error: '댓글 작성에 실패했습니다' }
    }
}

export async function getComments(postId: string) {
    try {
        const comments = await prisma.comment.findMany({
            where: { postId },
            orderBy: { createdAt: 'asc' },
            include: {
                user: {
                    select: { name: true, id: true, reputation: true }
                },
                likes: true
            }
        })

        const serializedComments = comments.map(comment => ({
            ...comment,
            createdAt: comment.createdAt.toISOString(),
            updatedAt: comment.updatedAt.toISOString()
        }))

        return { success: true, comments: serializedComments }
    } catch (error) {
        console.error('Get comments error:', error)
        return { error: '댓글을 불러오는데 실패했습니다' }
    }
}

export async function updateComment(commentId: string, content: string) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return { error: '로그인이 필요합니다' }

        const comment = await prisma.comment.findUnique({
            where: { id: commentId }
        })

        if (!comment) return { error: '댓글을 찾을 수 없습니다' }
        if (comment.userId !== currentUser.userId) return { error: '권한이 없습니다' }

        await prisma.comment.update({
            where: { id: commentId },
            data: { content }
        })

        return { success: true }
    } catch (error) {
        console.error('Update comment error:', error)
        return { error: '댓글 수정에 실패했습니다' }
    }
}

export async function deleteComment(commentId: string) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return { error: '로그인이 필요합니다' }

        const comment = await prisma.comment.findUnique({
            where: { id: commentId }
        })

        if (!comment) return { error: '댓글을 찾을 수 없습니다' }
        if (comment.userId !== currentUser.userId) return { error: '권한이 없습니다' }

        await prisma.comment.delete({
            where: { id: commentId }
        })

        return { success: true }
    } catch (error) {
        console.error('Delete comment error:', error)
        return { error: '댓글 삭제에 실패했습니다' }
    }
}

export async function toggleCommentLike(commentId: string) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return { error: '로그인이 필요합니다' }

        const existingLike = await prisma.like.findFirst({
            where: {
                userId: currentUser.userId,
                commentId: commentId
            }
        })

        if (existingLike) {
            await prisma.like.delete({
                where: {
                    id: existingLike.id
                }
            })
            // Decrease reputation
            const comment = await prisma.comment.findUnique({ where: { id: commentId } })
            if (comment && comment.userId !== currentUser.userId) {
                await prisma.user.update({
                    where: { id: comment.userId },
                    data: { reputation: { decrement: 1 } }
                })
            }
        } else {
            await prisma.like.create({
                data: {
                    userId: currentUser.userId,
                    commentId: commentId
                }
            })
            // Increase reputation
            const comment = await prisma.comment.findUnique({ where: { id: commentId } })
            if (comment && comment.userId !== currentUser.userId) {
                await prisma.user.update({
                    where: { id: comment.userId },
                    data: { reputation: { increment: 1 } }
                })
            }
        }

        return { success: true }
    } catch (error) {
        console.error('Toggle comment like error:', error)
        return { error: '좋아요 처리에 실패했습니다' }
    }
}
