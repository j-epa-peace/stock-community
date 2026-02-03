'use client'

import { useState, useEffect, useRef } from 'react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MarketIndexCard, { MarketIndexInfo as MarketIndex } from './MarketIndexCard'

type TabType = 'domestic' | 'global' | 'exchange' | 'crypto'

export default function MarketIndices() {
  const [indices, setIndices] = useState<MarketIndex[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('domestic')
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeft(scrollLeft > 2)
      setShowRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2)
    }
  }

  useEffect(() => {
    checkScroll()
    const t1 = setTimeout(checkScroll, 100)
    const t2 = setTimeout(checkScroll, 300)
    window.addEventListener('resize', checkScroll)
    return () => {
      window.removeEventListener('resize', checkScroll)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [indices, activeTab])

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' })
      setTimeout(checkScroll, 350)
    }
  }, [activeTab])

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const response = await fetch('/api/market/indices')
        if (!response.ok) throw new Error('Failed to fetch market data')
        const data = await response.json()
        setIndices(data)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setError('시장 데이터를 불러오는데 실패했습니다.')
        setLoading(false)
      }
    }

    fetchIndices()
    const interval = setInterval(fetchIndices, 60000)
    return () => clearInterval(interval)
  }, [])

  const domesticIndices = indices.filter(i => ['KOSPI', 'KOSDAQ'].includes(i.name))
  const globalIndices = indices.filter(i => ['NASDAQ', 'S&P 500', 'Nikkei 225', 'Shanghai'].includes(i.name))
  const exchangeIndices = indices.filter(i => ['USD/KRW', 'JPY/KRW', 'CNY/KRW'].includes(i.name))
  const cryptoIndices = indices.filter(i => ['Bitcoin', 'Ethereum'].includes(i.name))

  let visibleIndices: MarketIndex[] = []
  switch (activeTab) {
    case 'domestic': visibleIndices = domesticIndices; break;
    case 'global': visibleIndices = globalIndices; break;
    case 'exchange': visibleIndices = exchangeIndices; break;
    case 'crypto': visibleIndices = cryptoIndices; break;
  }

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-8 border border-gray-700 animate-pulse h-96"></div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-8 text-center">
        <p className="text-red-400 text-sm font-medium mb-2">시장 데이터를 불러올 수 없습니다</p>
        <p className="text-red-500/50 text-xs">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs rounded transition-colors"
        >
          재시도
        </button>
      </div>
    )
  }

  return (
    <div className="mb-4">
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-2xl font-bold text-white tracking-tight">시장 지수</h2>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-medium border border-green-500/20 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          LIVE
        </span>
      </div>

      <div className="flex overflow-x-auto gap-2 mb-6 pb-2 hide-scrollbar">
        {[
          { id: 'domestic', label: '국내증시' },
          { id: 'global', label: '해외증시' },
          { id: 'crypto', label: '디지털자산' },
          { id: 'exchange', label: '환율' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
              ? 'bg-gray-700 text-white shadow-lg ring-1 ring-gray-600'
              : 'bg-gray-800/50 text-gray-500 hover:text-gray-300 hover:bg-gray-800'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative group">
        <AnimatePresence>
          {showLeft && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.1 } }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                scrollContainerRef.current?.scrollBy({ left: -300, behavior: 'smooth' })
                setTimeout(checkScroll, 100)
                setTimeout(checkScroll, 300)
              }}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full items-center justify-center border border-white/20 text-white transition-colors hover:bg-black/70 shadow-glow-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showRight && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.1 } }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                scrollContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' })
                setTimeout(checkScroll, 100)
                setTimeout(checkScroll, 300)
              }}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full items-center justify-center border border-white/20 text-white transition-colors hover:bg-black/70 shadow-glow-white"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>

        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 hide-scrollbar scroll-smooth"
        >
          <AnimatePresence mode='popLayout'>
            {visibleIndices.map((index) => (
              <MarketIndexCard key={index.symbol} index={index} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div >
  )
}
