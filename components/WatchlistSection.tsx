'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'

interface WatchlistItem {
  id: string
  stockSymbol: string
  stockName: string
}

interface StockData {
  symbol: string
  price: number
  change: number
  changePercent: number
}

export default function WatchlistSection() {
  const [user, setUser] = useState<{ name: string } | null>(null)
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [stockData, setStockData] = useState<Record<string, StockData>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is logged in
        const userRes = await fetch('/api/auth/me')
        const userData = await userRes.json()

        if (userData.user) {
          setUser(userData.user)

          // Fetch watchlist
          const watchlistRes = await fetch('/api/watchlist')
          const watchlistData = await watchlistRes.json()

          if (watchlistData.success) {
            setWatchlist(watchlistData.watchlist)

            // Fetch stock prices from DB (read-only)
            const symbols = (watchlistData.watchlist as WatchlistItem[]).map(
              (item) => item.stockSymbol
            )

            if (symbols.length > 0) {
              const stocksRes = await fetch(
                `/api/stocks?symbols=${encodeURIComponent(symbols.join(','))}`
              )
              const stocksData = await stocksRes.json()

              if (stocksData.success) {
                const fromDb: Record<string, StockData> = {}
                  ; (stocksData.stocks as StockData[]).forEach((s) => {
                    fromDb[s.symbol] = {
                      symbol: s.symbol,
                      price: s.price,
                      change: s.change,
                      changePercent: s.changePercent
                    }
                  })
                setStockData(fromDb)
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">내 관심종목</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-600 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-600 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">내 관심종목</h2>
        <div className="text-center py-8">
          <p className="text-gray-300 mb-4">관심 종목을 추적하려면 회원가입하세요</p>
          <Link
            href="/auth/signup"
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            회원가입
          </Link>
        </div>
      </div>
    )
  }

  if (watchlist.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">내 관심종목</h2>
        <div className="text-center py-8">
          <p className="text-gray-300 mb-4">관심종목이 비어있습니다</p>
          <Link
            href="/watchlist/add"
            className="inline-flex items-center bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            종목 추가
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-8 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">내 관심종목</h2>
        <Link
          href="/watchlist/add"
          className="inline-flex items-center text-gray-300 hover:text-primary-300 hover:bg-primary-900/20 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-1" />
          더 추가
        </Link>
      </div>

      <div className="space-y-4">
        {watchlist.slice(0, 5).map((item) => {
          const stock = stockData[item.stockSymbol]
          if (!stock) return null

          return (
            <Link
              href={`/stocks/${item.stockSymbol}`}
              key={item.id}
              className="block"
            >
              <div className="flex justify-between items-center p-4 border border-gray-600 rounded-lg hover:bg-gray-700 bg-gray-750 transition-colors">
                <div>
                  <h3 className="font-semibold text-white">{item.stockName}</h3>
                  <p className="text-sm text-gray-400">{item.stockSymbol}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">
                    {item.stockSymbol.includes('.') || item.stockSymbol.length <= 4
                      ? `$${stock.price.toFixed(2)}`
                      : `${stock.price.toLocaleString()}원`}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                      {stock.change >= 0 ? '+' : ''}
                      {item.stockSymbol.includes('.') || item.stockSymbol.length <= 4
                        ? stock.change.toFixed(2)
                        : Math.round(stock.change).toLocaleString()}
                    </span>
                    <span className={`text-sm ${stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                      ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}