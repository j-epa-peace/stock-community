import { prisma } from '@/lib/prisma'
import StockDetailClient from './StockDetailClient'
import { getRealTimeQuote } from '@/lib/stock-service'
import AiInsightCard from '@/components/stock-detail/AiInsightCard'

export default async function StockDetailPage(props: { params: Promise<{ symbol: string }> }) {
  const params = await props.params
  let stock = await prisma.stock.findUnique({
    where: { symbol: params.symbol },
    select: {
      symbol: true,
      name: true,
      market: true,
      price: true,
      change: true,
      changePercent: true
    }
  })

  // Fallback for Korean stocks (e.g. 005930 -> 005930.KS)
  if (!stock && /^\d{6}$/.test(params.symbol)) {
    stock = await prisma.stock.findUnique({
      where: { symbol: `${params.symbol}.KS` },
      select: {
        symbol: true,
        name: true,
        market: true,
        price: true,
        change: true,
        changePercent: true
      }
    })
  }

  if (!stock) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">종목을 찾을 수 없습니다.</div>
      </div>
    )
  }

  // Fetch real-time data
  const realTimeStock = await getRealTimeQuote(stock as any)

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AiInsightCard stock={realTimeStock as any} />
      </div>
      <StockDetailClient symbol={params.symbol} stock={realTimeStock} />
    </>
  )
}