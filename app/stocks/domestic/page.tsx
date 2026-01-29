import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function DomesticStocksPage() {
  const [kospiStocks, kosdaqStocks] = await Promise.all([
    prisma.stock.findMany({
      where: { market: 'KOSPI' },
      orderBy: { symbol: 'asc' },
      take: 100,
      select: {
        symbol: true,
        name: true,
        price: true,
        change: true,
        changePercent: true
      }
    }),
    prisma.stock.findMany({
      where: { market: 'KOSDAQ' },
      orderBy: { symbol: 'asc' },
      take: 100,
      select: {
        symbol: true,
        name: true,
        price: true,
        change: true,
        changePercent: true
      }
    })
  ])

  return (
    <div className="min-h-screen bg-gray-900 py-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/stocks" className="text-primary-400 hover:text-primary-300 mb-4 inline-block">
            ← 종목 목록으로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">국내 주식</h1>
          <p className="text-gray-400">KOSPI와 KOSDAQ 상위 종목들을 확인하고 토론에 참여해보세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* KOSPI */}
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-2">KOSPI</h2>
              <p className="text-gray-400">시가총액 상위 100개 종목</p>
            </div>
            <div className="p-4">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {kospiStocks.map((stock, index) => (
                  <Link 
                    key={stock.symbol} 
                    href={`/stocks/${stock.symbol}`}
                    className="block p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 w-6">#{index + 1}</span>
                          <span className="font-medium text-white">{stock.name}</span>
                        </div>
                        <span className="text-xs text-gray-400">{stock.symbol}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">
                          {Math.round(stock.price).toLocaleString()}원
                        </div>
                        <div className={`text-xs ${
                          stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* KOSDAQ */}
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-2">KOSDAQ</h2>
              <p className="text-gray-400">시가총액 상위 100개 종목</p>
            </div>
            <div className="p-4">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {kosdaqStocks.map((stock, index) => (
                  <Link 
                    key={stock.symbol} 
                    href={`/stocks/${stock.symbol}`}
                    className="block p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 w-6">#{index + 1}</span>
                          <span className="font-medium text-white">{stock.name}</span>
                        </div>
                        <span className="text-xs text-gray-400">{stock.symbol}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">
                          {Math.round(stock.price).toLocaleString()}원
                        </div>
                        <div className={`text-xs ${
                          stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}