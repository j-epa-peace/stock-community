'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

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
  const { user, loading: authLoading } = useAuth()
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [stockData, setStockData] = useState<Record<string, StockData>>({})
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      // If auth is still loading, do nothing yet
      if (authLoading) return

      // If no user, stop loading data
      if (!user) {
        setDataLoading(false)
        return
      }

      try {
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
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setDataLoading(false)
      }
    }

    fetchData()
  }, [user, authLoading])

  if (authLoading || dataLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-glass p-6 mb-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">내 관심종목</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-white/10 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-white/5 rounded-2xl border border-white/5"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-glass p-6 mb-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">내 관심종목</h2>
        <div className="text-center py-10">
          <p className="text-gray-400 mb-6">관심 종목을 추적하려면 회원가입하세요</p>
          <Link
            href="/auth/signup"
            className="bg-white/10 text-white px-8 py-3 rounded-full hover:bg-white/20 transition-all border border-white/20 shadow-glow-white font-bold"
          >
            회원가입
          </Link>
        </div>
      </div>
    )
  }

  if (watchlist.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-glass p-6 mb-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">내 관심종목</h2>
        <div className="text-center py-10">
          <p className="text-gray-400 mb-6">관심종목이 비어있습니다</p>
          <Link
            href="/watchlist/add"
            className="inline-flex items-center bg-white/10 text-white px-8 py-3 rounded-full hover:bg-white/20 transition-all border border-white/20 shadow-glow-white font-bold"
          >
            <Plus className="h-5 w-5 mr-2" />
            종목 추가
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-glass p-6 mb-8 border border-white/10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">내 관심종목</h2>
        <Link
          href="/watchlist/add"
          className="inline-flex items-center text-gray-400 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border border-transparent hover:border-white/10 hover:shadow-glow-white"
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
              <div className="flex justify-between items-center p-4 border border-white/5 rounded-2xl hover:bg-white/10 bg-white/5 transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                <div>
                  <h3 className="font-bold text-white transition-colors">{item.stockName}</h3>
                  <p className="text-sm text-gray-500 font-medium">{item.stockSymbol}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white text-lg tracking-tight">
                    {item.stockSymbol.includes('.') || item.stockSymbol.length <= 4
                      ? `$${stock.price.toFixed(2)}`
                      : `${stock.price.toLocaleString()}원`}
                  </p>
                  <div className="flex items-center justify-end space-x-2">
                    <span className={`text-sm font-bold ${stock.change >= 0 ? 'text-red-400' : 'text-blue-400'
                      }`}>
                      {stock.change >= 0 ? '+' : ''}
                      {item.stockSymbol.includes('.') || item.stockSymbol.length <= 4
                        ? stock.change.toFixed(2)
                        : Math.round(stock.change).toLocaleString()}
                    </span>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded bg-opacity-20 ${stock.changePercent >= 0 ? 'bg-red-500 text-red-500' : 'bg-blue-500 text-blue-500'
                      }`}>
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
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