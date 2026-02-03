'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, ArrowRightLeft } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

import { Stock } from '@/types'

import { formatStockPrice } from '@/lib/utils'

interface WatchlistItem {
  id: string
  stockSymbol: string
  stockName: string
}

export default function WatchlistSection() {
  const { user, loading: authLoading } = useAuth()
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [stockData, setStockData] = useState<Record<string, Stock>>({})
  const [dataLoading, setDataLoading] = useState(true)
  const [isKrw, setIsKrw] = useState(true)


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
              const fromDb: Record<string, Stock> = {}
                ; (stocksData.stocks as Stock[]).forEach((s) => {
                  // Index by both original and normalized symbol
                  fromDb[s.symbol] = {
                    symbol: s.symbol,
                    name: s.name,
                    price: s.price,
                    change: s.change,
                    changePercent: s.changePercent,
                    market: s.market // Ensure market is passed
                  }
                  if (s.symbol.includes('.KS')) {
                    fromDb[s.symbol.replace('.KS', '')] = fromDb[s.symbol]
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
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">내 관심종목</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsKrw(!isKrw)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all font-medium"
          >
            <ArrowRightLeft className="w-3 h-3" />
            {isKrw ? '원화' : 'USD'}
          </button>
          <Link
            href="/watchlist/add"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all font-medium ml-2"
          >
            + 관리
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {watchlist.slice(0, 5).map((item) => {
          const stock = stockData[item.stockSymbol]

          // Fallback if stock data is missing/loading
          const price = stock ? stock.price : 0
          const change = stock ? stock.change : 0
          const changePercent = stock ? stock.changePercent : 0
          const isLoading = !stock

          return (
            <Link
              href={`/stocks/${item.stockSymbol}`}
              key={item.id}
              className="block"
            >
              <div className="flex flex-col md:flex-row justify-between items-center p-4 border border-white/5 rounded-2xl hover:bg-white/10 bg-white/5 transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                <div className="mb-3 md:mb-0 text-center md:text-left">
                  <h3 className="font-bold text-white transition-colors">{item.stockName}</h3>
                  <p className="text-sm text-gray-500 font-medium">{item.stockSymbol.replace('.KS', '')}</p>
                </div>
                <div className="text-center md:text-right">
                  {isLoading ? (
                    <div className="h-8 w-24 bg-white/10 animate-pulse rounded mx-auto md:mx-0" />
                  ) : (
                    <>
                      <p className="font-bold text-white text-lg tracking-tight">
                        {formatStockPrice(price, stock?.market || 'KOSPI', isKrw ? 'KRW' : 'USD')}
                      </p>
                      <div className="flex items-center justify-center md:justify-end space-x-2">
                        <span className={`text-sm font-bold ${change >= 0 ? 'text-red-400' : 'text-blue-400'}`}>
                          {change >= 0 ? '+' : ''}
                          {formatStockPrice(Math.abs(change), stock?.market || 'KOSPI', isKrw ? 'KRW' : 'USD').replace(/[^0-9.,]/g, '')}
                        </span>
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded bg-opacity-20 ${changePercent >= 0 ? 'bg-red-500 text-red-500' : 'bg-blue-500 text-blue-500'}`}>
                          {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}