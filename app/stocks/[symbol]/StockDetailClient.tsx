'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Stock, User } from '@/types'
import StockInfoCard from '@/components/stock-detail/StockInfoCard'
import DiscussionTab from '@/components/stock-detail/DiscussionTab'
import NewsCarousel from '@/components/stock-detail/NewsCarousel'
import SentimentBanner from '@/components/stock-detail/SentimentBanner'

export default function StockDetailClient({ symbol, stock }: { symbol: string; stock: Stock }) {
  // Router unused for now but keep if needed for navigation
  const router = useRouter()
  // searchParams unused in this file now (moved to DiscussionTab)
  const searchParams = useSearchParams()

  const [user, setUser] = useState<User | null>(null)

  // Chart State
  const [chartData, setChartData] = useState<any[]>([])
  const [timeRange, setTimeRange] = useState('1d')
  const [isLoadingChart, setIsLoadingChart] = useState(true)

  // Fetch User
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user)
      })
      .catch(() => { })
  }, [])

  // Initial Data Fetch
  useEffect(() => {
    fetchStockChart('1d')
    const intervalId = setInterval(() => {
      if (!document.hidden) {
        fetchStockChart(timeRange)
      }
    }, 60000)

    return () => clearInterval(intervalId)
  }, [symbol, timeRange])

  // Save to Recently Viewed
  useEffect(() => {
    if (stock) {
      const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
      const newEntry = {
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        change: stock.change,
        changePercent: stock.changePercent,
        market: stock.market,
        viewedAt: new Date().toISOString()
      }

      const filtered = recent.filter((r: any) => r.symbol !== stock.symbol)
      const updated = [newEntry, ...filtered].slice(0, 10)

      localStorage.setItem('recentlyViewed', JSON.stringify(updated))
    }
  }, [symbol, stock])

  const fetchStockChart = async (range: string) => {
    if (!chartData.length || range !== timeRange) setIsLoadingChart(true)
    setTimeRange(range)
    try {
      let interval = '5m'
      if (range === '1d') interval = '5m'
      else if (range === '1w') interval = '1h'
      else if (range === '1mo') interval = '1d'
      else if (range === '1y') interval = '1wk'

      const res = await fetch(`/api/stocks/${symbol}/chart?range=${range}&interval=${interval}&market=${stock.market}`)
      const data = await res.json()
      if (data.success) {
        setChartData(data.data)
      }
    } catch (error) {
      console.error('Failed to load chart', error)
    } finally {
      setIsLoadingChart(false)
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start">

        {/* Left Column: Stock Info & Chart */}
        <div className="w-full lg:col-span-7 lg:sticky lg:top-24 space-y-6">
          <StockInfoCard
            stock={stock}
            chartData={chartData}
            timeRange={timeRange}
            setTimeRange={fetchStockChart}
            isLoadingChart={isLoadingChart}
          />
        </div>

        {/* Right Column: Posts & Form */}
        <div className="w-full lg:col-span-5 relative">
          <NewsCarousel symbol={symbol} />
          <SentimentBanner symbol={symbol} />
          <DiscussionTab symbol={symbol} user={user} />
        </div>
      </div>
    </div>
  )
}
