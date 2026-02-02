import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// GET: Get stats and user's vote
export async function GET(
    request: Request,
    props: { params: Promise<{ symbol: string }> }
) {
    try {
        const params = await props.params
        const symbol = params.symbol
        const user = await getCurrentUser()

        const stock = await prisma.stock.findUnique({ where: { symbol } })
        if (!stock) return NextResponse.json({ error: 'Stock not found' }, { status: 404 })

        // 1. Get stats (last 24h only? Let's do last 24h)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

        const votes = await prisma.vote.groupBy({
            by: ['type'],
            where: {
                stockId: stock.id,
                updatedAt: { gte: oneDayAgo }
            },
            _count: {
                type: true
            }
        })

        let bullish = 0
        let bearish = 0

        votes.forEach(v => {
            if (v.type === 'BULLISH') bullish = v._count.type
            if (v.type === 'BEARISH') bearish = v._count.type
        })

        const total = bullish + bearish
        const bullishPercent = total > 0 ? Math.round((bullish / total) * 100) : 50 // default 50
        const bearishPercent = total > 0 ? Math.round((bearish / total) * 100) : 50

        // 2. Get User's Vote
        let userVote = null
        if (user) {
            const myVote = await prisma.vote.findUnique({
                where: {
                    userId_stockId: {
                        userId: user.userId,
                        stockId: stock.id
                    }
                }
            })
            if (myVote) userVote = myVote.type
        }

        return NextResponse.json({
            success: true,
            stats: { bullish, bearish, total, bullishPercent, bearishPercent },
            userVote
        })

    } catch (error) {
        console.error('Vote GET Error:', error)
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}

// POST: Cast/Update Vote
export async function POST(
    request: Request,
    props: { params: Promise<{ symbol: string }> }
) {
    try {
        const params = await props.params
        const symbol = params.symbol
        const user = await getCurrentUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const body = await request.json()
        const { type } = body // BULLISH or BEARISH

        if (!['BULLISH', 'BEARISH'].includes(type)) {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
        }

        const stock = await prisma.stock.findUnique({ where: { symbol } })
        if (!stock) return NextResponse.json({ error: 'Stock not found' }, { status: 404 })

        const vote = await prisma.vote.upsert({
            where: {
                userId_stockId: {
                    userId: user.userId,
                    stockId: stock.id
                }
            },
            update: {
                type,
                updatedAt: new Date()
            },
            create: {
                userId: user.userId,
                stockId: stock.id,
                type,
                updatedAt: new Date()
            }
        })

        return NextResponse.json({ success: true, vote })
    } catch (error) {
        console.error('Vote POST Error:', error)
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}
