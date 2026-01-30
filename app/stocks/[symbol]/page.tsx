import { prisma } from '@/lib/prisma'
import StockDetailClient from './StockDetailClient'
import { getRealTimeQuote } from '@/lib/stock-service'

export default async function StockDetailPage(props: { params: Promise<{ symbol: string }> }) {
  const params = await props.params
  const stock = await prisma.stock.findUnique({
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

  if (!stock) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">종목을 찾을 수 없습니다.</div>
      </div>
    )
  }

  // Fetch real-time data
  const realTimeStock = await getRealTimeQuote(stock)

  return <StockDetailClient symbol={params.symbol} stock={realTimeStock} />
}