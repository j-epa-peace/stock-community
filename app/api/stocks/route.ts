import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getRealTimeQuote } from '@/lib/stock-service'

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
        ...(symbols && symbols.length > 0
          ? {
            symbol: {
              in: symbols.flatMap(s => /^\d{6}$/.test(s) ? [s, `${s}.KS`] : [s])
            }
          }
          : {})
      },
      orderBy: [{ market: 'asc' }, { symbol: 'asc' }],
      select: {
        id: true, // Needed for getRealTimeQuote if it uses ID? It accepts partial stock usually.
        symbol: true,
        name: true,
        market: true,
        sector: true,
        marketCap: true,
        price: true,
        change: true,
        changePercent: true,
        createdAt: true
      }
    })

    // If specific symbols requested (Watchlist), refresh them
    let finalStocks: any[] = stocks
    if (symbols && symbols.length > 0) {
      finalStocks = await Promise.all(stocks.map(async (stock) => {
        try {
          return await getRealTimeQuote(stock as any)
        } catch (e) {
          console.error(`Failed to refresh stock ${stock.symbol}`, e)
          return stock
        }
      }))
    }

    const serializedStocks = finalStocks.map(stock => ({
      ...stock,
      marketCap: stock.marketCap ? stock.marketCap.toString() : null
    }))

    return NextResponse.json({ success: true, stocks: serializedStocks })
  } catch (error) {
    console.error('Get stocks error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stocks' },
      { status: 500 }
    )
  }
}

