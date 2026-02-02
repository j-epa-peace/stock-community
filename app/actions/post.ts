'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createPost(data: {
    title: string
    content: string
    symbol?: string      // From PostForm
    stockSymbol?: string // Alternate
    stockName?: string
    market?: string
    price?: number
    change?: number
    changePercent?: number
}) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
            return { error: '로그인이 필요합니다' }
        }

        const targetSymbol = data.stockSymbol || data.symbol
        if (!targetSymbol) return { error: '종목 정보가 없습니다' }

        // 1. Try to find stock in DB
        let stock = await prisma.stock.findFirst({
            where: {
                OR: [
                    { symbol: targetSymbol },
                    { symbol: `${targetSymbol}.KS` }
                ]
            }
        })

        // 2. If not found, check if we have enough info to create it
        if (!stock) {
            if (data.stockName && data.market && data.price !== undefined) {
                stock = await prisma.stock.create({
                    data: {
                        symbol: targetSymbol, // Use as provided
                        name: data.stockName,
                        market: data.market,
                        price: data.price,
                        change: data.change || 0,
                        changePercent: data.changePercent || 0
                    }
                })
            } else {
                return { error: '종목 정보를 찾을 수 없습니다. (DB 미등록)' }
            }
        }
        // 3. If found and we have new data, update it (optional, but good for keeping price fresh)
        else if (data.price !== undefined) {
            await prisma.stock.update({
                where: { id: stock.id },
                data: {
                    price: data.price,
                    change: data.change,
                    changePercent: data.changePercent
                }
            })
        }

        const post = await prisma.post.create({
            data: {
                title: data.title,
                content: data.content,
                userId: currentUser.userId,
                stockId: stock!.id
            }
        })

        revalidatePath(`/stocks/${targetSymbol}`)
        return {
            success: true,
            post: {
                ...post,
                createdAt: post.createdAt.toISOString(),
                updatedAt: post.updatedAt.toISOString()
            }
        }
    } catch (error) {
        console.error('Create post error:', error)
        return { error: '게시글 작성에 실패했습니다' }
    }
}

export async function getPosts(
    symbol: string,
    page: number = 1,
    limit: number = 10,
    sort: 'latest' | 'likes' = 'latest'
) {
    try {
        const currentUser = await getCurrentUser()

        // Find stock first to get ID
        const stock = await prisma.stock.findUnique({
            where: { symbol }
        })

        if (!stock) return { success: true, posts: [], hasMore: false }

        const skip = (page - 1) * limit

        const posts = await prisma.post.findMany({
            where: { stockId: stock.id },
            orderBy: sort === 'likes'
                ? { likes: { _count: 'desc' } }
                : { createdAt: 'desc' },
            skip,
            take: limit,
            include: {
                user: {
                    select: { name: true, id: true, reputation: true }
                },
                likes: true,
                comments: {
                    include: {
                        user: {
                            select: { name: true, id: true, reputation: true }
                        },
                        likes: true
                    },
                    orderBy: { createdAt: 'asc' }
                },
                _count: {
                    select: { likes: true }
                }
            }
        })

        // Check if there are more
        const totalPosts = await prisma.post.count({ where: { stockId: stock.id } })
        const hasMore = totalPosts > skip + limit

        // Process posts to add isLiked flag
        const processedPosts = posts.map(post => ({
            ...post,
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
            isLiked: currentUser ? post.likes.some((like: any) => like.userId === currentUser.userId) : false,
            likes: post._count.likes,
            comments: post.comments.map((comment: any) => ({
                ...comment,
                createdAt: comment.createdAt.toISOString(),
                updatedAt: comment.updatedAt.toISOString(),
                isLiked: currentUser ? comment.likes.some((like: any) => like.userId === currentUser.userId) : false,
                likes: comment.likes.length
            }))
        }))

        return { success: true, posts: processedPosts, hasMore }
    } catch (error) {
        console.error('Get posts error:', error)
        return { error: '게시글을 불러오는데 실패했습니다', hasMore: false }
    }
}

export async function updatePost(postId: string, data: { title: string; content: string }) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return { error: '로그인이 필요합니다' }

        const post = await prisma.post.findUnique({
            where: { id: postId }
        })

        if (!post) return { error: '게시글을 찾을 수 없습니다' }
        if (post.userId !== currentUser.userId) return { error: '권한이 없습니다' }

        await prisma.post.update({
            where: { id: postId },
            data: {
                title: data.title,
                content: data.content
            }
        })

        // We need to find the stock symbol to revalidate, but we don't have it easily here without a join.
        // However, the client usually refreshes the list or we can revalidate the specific path if passed.
        // For now, return success and let client handle UI update or refresh.
        return { success: true }
    } catch (error) {
        console.error('Update post error:', error)
        return { error: '게시글 수정에 실패했습니다' }
    }
}

export async function deletePost(postId: string) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return { error: '로그인이 필요합니다' }

        const post = await prisma.post.findUnique({
            where: { id: postId }
        })

        if (!post) return { error: '게시글을 찾을 수 없습니다' }
        if (post.userId !== currentUser.userId) return { error: '권한이 없습니다' }

        await prisma.post.delete({
            where: { id: postId }
        })

        return { success: true }
    } catch (error) {
        console.error('Delete post error:', error)
        return { error: '게시글 삭제에 실패했습니다' }
    }
}

export async function toggleLike(postId: string) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return { error: '로그인이 필요합니다' }

        // Use findFirst to safely handle nullable commentId in query
        const existingLike = await prisma.like.findFirst({
            where: {
                userId: currentUser.userId,
                postId: postId,
                commentId: null
            }
        })

        if (existingLike) {
            await prisma.like.delete({
                where: {
                    id: existingLike.id
                }
            })
            // Decrease reputation
            const post = await prisma.post.findUnique({ where: { id: postId } })
            if (post && post.userId !== currentUser.userId) {
                await prisma.user.update({
                    where: { id: post.userId },
                    data: { reputation: { decrement: 1 } }
                })
            }
        } else {
            await prisma.like.create({
                data: {
                    userId: currentUser.userId,
                    postId
                }
            })
            // Increase reputation
            const post = await prisma.post.findUnique({ where: { id: postId } })
            if (post && post.userId !== currentUser.userId) {
                await prisma.user.update({
                    where: { id: post.userId },
                    data: { reputation: { increment: 1 } }
                })
            }
        }

        return { success: true }
    } catch (error) {
        console.error('Toggle like error:', error)
        return { error: '좋아요 처리에 실패했습니다' }
    }
}

export async function getUserActivity() {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return { error: '로그인이 필요합니다' }

        const posts = await prisma.post.findMany({
            where: { userId: currentUser.userId },
            include: {
                stock: true,
                _count: { select: { likes: true, comments: true } }
            },
            orderBy: { createdAt: 'desc' }
        })

        const comments = await prisma.comment.findMany({
            where: { userId: currentUser.userId },
            include: {
                post: {
                    include: { stock: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        // Combine and label them
        const activity = [
            ...posts.map(p => ({
                ...p,
                type: 'post' as const,
                createdAt: p.createdAt.toISOString(),
                updatedAt: p.updatedAt.toISOString()
            })),
            ...comments.map(c => ({
                ...c,
                type: 'comment' as const,
                createdAt: c.createdAt.toISOString(),
                updatedAt: c.updatedAt.toISOString()
            }))
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

        return { success: true, activity }
    } catch (error) {
        console.error('Get user activity error:', error)
        return { error: '활동 내역을 불러오는데 실패했습니다' }
    }
}
