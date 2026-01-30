import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import StockListClient from '@/components/StockListClient'
import { getRealTimeQuotes } from '@/lib/stock-service'

export default async function DomesticStocksPage() {
  const [kospiStocks, kosdaqStocks] = await Promise.all([
    prisma.stock.findMany({
      where: { market: 'KOSPI' },
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
      where: { market: 'KOSDAQ' },
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
  const [realTimeKospi, realTimeKosdaq] = await Promise.all([
    getRealTimeQuotes(kospiStocks),
    getRealTimeQuotes(kosdaqStocks)
  ])

  const stockGroups = [
    {
      id: 'kospi',
      title: 'KOSPI',
      description: '시가총액 상위 30개 종목',
      stocks: realTimeKospi
    },
    {
      id: 'kosdaq',
      title: 'KOSDAQ',
      description: '시가총액 상위 30개 종목',
      stocks: realTimeKosdaq
    }
  ]

  return (
    <div className="min-h-screen py-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/stocks" className="text-gray-400 hover:text-white mb-4 inline-flex items-center transition-colors">
            <span className="mr-2">←</span> 종목 목록으로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">국내 주식 (Top 30)</h1>
          <p className="text-gray-400">KOSPI와 KOSDAQ 시가총액 상위 30개 종목들을 확인하고 토론에 참여해보세요</p>
        </div>

        <StockListClient groups={stockGroups} />
      </div>
    </div>
  )
}