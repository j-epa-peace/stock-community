'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createPost(data: {
    title: string
    content: string
    stockSymbol: string
    stockName: string
    market: string
    price: number
    change: number
    changePercent: number
}) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
            return { error: '로그인이 필요합니다' }
        }

        // Ensure stock exists in DB (sync with latest data from client if needed, or just find)
        // For simplicity, we assume the stock is already seeded or we upsert it.
        // Since we did a seed, finding by symbol should work. 
        // However, to be safe and robust (if we add new stocks dynamically), we can upsert.
        // The client sends price info, so let's update the stock price while we are at it.

        // Note: In a real app, price updates might happen via a separate background worker, 
        // but here we can ensure the stock record exists.
        const stock = await prisma.stock.upsert({
            where: { symbol: data.stockSymbol },
            create: {
                symbol: data.stockSymbol,
                name: data.stockName,
                market: data.market,
                price: data.price,
                change: data.change,
                changePercent: data.changePercent
            },
            update: {
                // Update price info if needed, or keep latest
                price: data.price,
                change: data.change,
                changePercent: data.changePercent
            }
        })

        const post = await prisma.post.create({
            data: {
                title: data.title,
                content: data.content,
                userId: currentUser.userId,
                stockId: stock.id
            }
        })

        revalidatePath(`/stocks/${data.stockSymbol}`)
        return { success: true, post }
    } catch (error) {
        console.error('Create post error:', error)
        return { error: '게시글 작성에 실패했습니다' }
    }
}

export async function getPosts(symbol: string) {
    try {
        const currentUser = await getCurrentUser()

        // Find stock first to get ID
        const stock = await prisma.stock.findUnique({
            where: { symbol }
        })

        if (!stock) return { success: true, posts: [] }

        const posts = await prisma.post.findMany({
            where: { stockId: stock.id },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true, id: true }
                },
                likes: true,
                comments: {
                    include: {
                        user: {
                            select: { name: true, id: true }
                        }
                    },
                    orderBy: { createdAt: 'asc' }
                },
                _count: {
                    select: { likes: true }
                }
            }
        })

        // Process posts to add isLiked flag
        const processedPosts = posts.map(post => ({
            ...post,
            isLiked: currentUser ? post.likes.some(like => like.userId === currentUser.userId) : false,
            likes: post._count.likes,
            // comments are now the actual array
        }))

        return { success: true, posts: processedPosts }
    } catch (error) {
        console.error('Get posts error:', error)
        return { error: '게시글을 불러오는데 실패했습니다' }
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

        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId: currentUser.userId,
                    postId
                }
            }
        })

        if (existingLike) {
            await prisma.like.delete({
                where: {
                    userId_postId: {
                        userId: currentUser.userId,
                        postId
                    }
                }
            })
        } else {
            await prisma.like.create({
                data: {
                    userId: currentUser.userId,
                    postId
                }
            })
        }

        return { success: true }
    } catch (error) {
        console.error('Toggle like error:', error)
        return { error: '좋아요 처리에 실패했습니다' }
    }
}
