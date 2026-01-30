import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import StockListClient from '@/components/StockListClient'
import { getRealTimeQuotes } from '@/lib/stock-service'

export default async function InternationalStocksPage() {
  const [sp500Stocks, nasdaqStocks] = await Promise.all([
    prisma.stock.findMany({
      where: { market: 'SP500' },
      orderBy: { marketCap: 'desc' },
      take: 100,
      select: {
        symbol: true,
        name: true,
        market: true,
        price: true,
        change: true,
        changePercent: true
      }
    }),
    prisma.stock.findMany({
      where: { market: 'NASDAQ' },
      orderBy: { marketCap: 'desc' },
      take: 100,
      select: {
        symbol: true,
        name: true,
        market: true,
        price: true,
        change: true,
        changePercent: true
      }
    })
  ])

  // Fetch real-time data
  const [realTimeSp500, realTimeNasdaq] = await Promise.all([
    getRealTimeQuotes(sp500Stocks),
    getRealTimeQuotes(nasdaqStocks)
  ])

  const stockGroups = [
    {
      id: 'sp500',
      title: 'S&P 500',
      description: '시가총액 상위 30개 종목',
      stocks: realTimeSp500
    },
    {
      id: 'nasdaq',
      title: 'NASDAQ',
      description: '시가총액 상위 30개 종목',
      stocks: realTimeNasdaq
    }
  ]

  return (
    <div className="min-h-screen py-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/stocks" className="text-gray-400 hover:text-white mb-4 inline-flex items-center transition-colors">
            <span className="mr-2">←</span> 종목 목록으로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">해외 주식 (Top 30)</h1>
          <p className="text-gray-400">S&P 500과 NASDAQ 시가총액 상위 30개 종목들을 확인하고 토론에 참여해보세요</p>
        </div>

        <StockListClient groups={stockGroups} />
      </div>
    </div>
  )
}