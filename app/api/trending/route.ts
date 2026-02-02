import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getRealTimeQuote } from '@/lib/stock-service'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const marketParam = searchParams.get('market') // 'KR', 'US', or null

        let marketFilter: any = {}
        if (marketParam === 'KR') {
            marketFilter = { market: { in: ['KOSPI', 'KOSDAQ', 'KONEX'] } }
        } else if (marketParam === 'US') {
            // Adjust based on your actual Market enum/string values in DB
            marketFilter = { market: { in: ['NASDAQ', 'NYSE', 'AMEX', 'SP500'] } }
        }

        // Trending Stocks: Top 100 Candidates from DB
        const candidateStocks = await prisma.stock.findMany({
            where: marketFilter,
            orderBy: {
                changePercent: 'desc'
            },
            take: 100,
            select: {
                id: true,
                symbol: true,
                name: true,
                price: true,
                change: true,
                changePercent: true,
                marketCap: true,
                market: true,
                createdAt: true
            }
        })

        // Refresh data for these stocks
        const refreshedStocks = await Promise.all(candidateStocks.map(async (stock) => {
            try {
                return await getRealTimeQuote(stock as any)
            } catch (e) {
                return stock
            }
        }))

        // Sort by Real-time ChangePercent DESC and Filter only Positive
        const topGainers = refreshedStocks
            .filter(stock => stock.changePercent > 0) // Only positive gainers
            .sort((a, b) => b.changePercent - a.changePercent)
            .slice(0, 5)

        // Hot Posts
        const hotPosts = await prisma.post.findMany({
            orderBy: {
                viewCount: 'desc'
            },
            take: 5,
            include: {
                user: {
                    select: { name: true }
                },
                stock: {
                    select: { symbol: true, name: true }
                }
            }
        })

        const serializedStocks = topGainers.map(stock => ({
            ...stock,
            marketCap: stock.marketCap ? stock.marketCap.toString() : null
        }))

        return NextResponse.json({
            success: true,
            stocks: serializedStocks,
            posts: hotPosts
        })
    } catch (error) {
        console.error('Trending API Error:', error)
        return NextResponse.json({ error: 'Failed to fetch trending data' }, { status: 500 })
    }
}
