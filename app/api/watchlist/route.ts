import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const watchlist = await prisma.watchlist.findMany({
      where: { userId: currentUser.userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, watchlist })
  } catch (error) {
    console.error('Get watchlist error:', error)
    return NextResponse.json({ error: 'Failed to fetch watchlist' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { stockSymbol, stockName } = await request.json()

    if (!stockSymbol || !stockName) {
      return NextResponse.json({ error: 'Stock symbol and name are required' }, { status: 400 })
    }

    // Check if already in watchlist
    const existing = await prisma.watchlist.findUnique({
      where: {
        userId_stockSymbol: {
          userId: currentUser.userId,
          stockSymbol
        }
      }
    })

    if (existing) {
      return NextResponse.json({ error: 'Stock already in watchlist' }, { status: 400 })
    }

    // Check watchlist limit (5 stocks)
    const count = await prisma.watchlist.count({
      where: { userId: currentUser.userId }
    })

    if (count >= 5) {
      return NextResponse.json({ error: 'Maximum 5 stocks allowed in watchlist' }, { status: 400 })
    }

    const watchlistItem = await prisma.watchlist.create({
      data: {
        userId: currentUser.userId,
        stockSymbol,
        stockName
      }
    })

    return NextResponse.json({ success: true, watchlistItem })
  } catch (error) {
    console.error('Add to watchlist error:', error)
    return NextResponse.json({ error: 'Failed to add to watchlist' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { stockSymbol } = await request.json()

    if (!stockSymbol) {
      return NextResponse.json({ error: 'Stock symbol is required' }, { status: 400 })
    }

    await prisma.watchlist.delete({
      where: {
        userId_stockSymbol: {
          userId: currentUser.userId,
          stockSymbol
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Remove from watchlist error:', error)
    return NextResponse.json({ error: 'Failed to remove from watchlist' }, { status: 500 })
  }
}