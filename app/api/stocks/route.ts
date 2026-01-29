import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const market = searchParams.get('market') || undefined
    const symbolsParam = searchParams.get('symbols') || undefined
    const symbols = symbolsParam
      ? symbolsParam
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined

    const stocks = await prisma.stock.findMany({
      where: {
        ...(market ? { market } : {}),
        ...(symbols && symbols.length > 0 ? { symbol: { in: symbols } } : {})
      },
      orderBy: [{ market: 'asc' }, { symbol: 'asc' }],
      select: {
        symbol: true,
        name: true,
        market: true,
        sector: true,
        marketCap: true,
        price: true,
        change: true,
        changePercent: true
      }
    })

    return NextResponse.json({ success: true, stocks })
  } catch (error) {
    console.error('Get stocks error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stocks' },
      { status: 500 }
    )
  }
}

