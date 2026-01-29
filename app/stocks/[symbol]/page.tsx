import { prisma } from '@/lib/prisma'
import StockDetailClient from './StockDetailClient'

export default async function StockDetailPage({ params }: { params: { symbol: string } }) {
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

  return <StockDetailClient symbol={params.symbol} stock={stock} />
}