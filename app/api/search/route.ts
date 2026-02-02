import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.length < 1) {
        return NextResponse.json({ results: [] })
    }

    try {
        // Search by symbol or name
        const results = await prisma.stock.findMany({
            where: {
                OR: [
                    { symbol: { contains: query, mode: 'insensitive' } },
                    { name: { contains: query, mode: 'insensitive' } }
                ]
            },
            take: 10,
            select: {
                symbol: true,
                name: true,
                market: true,
                changePercent: true
            }
        })

        // Prisma + Postgres 'contains' is case-sensitive? 
        // Better to use mode: 'insensitive' for Postgres.
        // Let's retry with insensitive if strictly typed, but for now standard query.

        return NextResponse.json({ results })
    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json({ results: [] })
    }
}
