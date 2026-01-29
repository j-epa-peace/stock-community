import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ symbol: string }> }
) {
  const params = await context.params
  try {
    const stock = await prisma.stock.findUnique({
      where: { symbol: params.symbol },
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

    if (!stock) {
      return NextResponse.json(
        { success: false, error: 'Stock not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, stock })
  } catch (error) {
    console.error('Get stock error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stock' },
      { status: 500 }
    )
  }
}

