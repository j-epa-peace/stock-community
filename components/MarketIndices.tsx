'use client'

import { useState, useEffect, useRef } from 'react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface MarketIndex {
  name: string
  symbol: string
  value: number
  change: number
  changePercent: number
  previousClose?: number
  data: { time: number; value: number }[] // Changed to number
}

type TabType = 'domestic' | 'global' | 'exchange' | 'crypto'

// Sub-component for Lazy Loading & Animation
const MarketIndexCard = ({ index }: { index: MarketIndex }) => {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Toggle visibility based on intersection for re-animation
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 } // Low threshold to trigger early
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const isUp = index.change >= 0
  const color = isUp ? '#ef4444' : '#3b82f6'

  // 모바일 최적화 (데이터 포인트 샘플링)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const dataPoints = isMobile ? index.data.filter((_, i) => i % 5 === 0) : index.data
  const ticks = generateHourlyTicks(index.data) // Assuming this function is available or moved
  const safeId = index.symbol.replace(/[^a-zA-Z0-9]/g, '')

  // Calculate Fixed Domain for "Live" feel
  let domainStart: number | 'dataMin' = 'dataMin'
  let domainEnd: number | 'dataMax' = 'dataMax'

  if (index.data.length > 0) {
    const lastPoint = index.data[index.data.length - 1].time
    const date = new Date(lastPoint) // Base date from the data

    const isCrypto = ['Bitcoin', 'Ethereum'].some(s => index.name.includes(s))
    const isUS = ['NASDAQ', 'S&P 500'].some(s => index.name.includes(s))
    const isKR = ['KOSPI', 'KOSDAQ'].some(s => index.name.includes(s)) || index.name.includes('KRW')
    const isCN = ['Shanghai', 'CNY'].some(s => index.name.includes(s))
    const isJP = ['Nikkei'].some(s => index.name.includes(s))

    if (!isCrypto) {
      if (isKR) {
        // KR: 09:00 - 15:30 KST
        const open = new Date(lastPoint)
        open.setHours(9, 0, 0, 0)
        const close = new Date(lastPoint)
        close.setHours(15, 30, 0, 0)

        // Handle case where specific data date might be different day due to timezone, 
        // essentially we trust the 'lastPoint' is the correct "Day" in local time.
        // But 'new Date(timestamp)' uses Local Device Time. This is a CLIENT COMPONENT.
        // To be safe, we just want the span to be 6.5 hours.
        // We anchor 'domainStart' to the first data point's "Floor to Hour" or explicitly reset hours if we can.
        // Best approach for client side: Use the first data point of the day as 'Open' approximation for start?
        // No, user wants FIXED axis.

        // Use the Data's Start as 09:00 (if it's close enough)
        // Simplest fixed visual: 
        // Just take the Start timestamp of the day (09:00 KST) and End (15:30 KST).
        // Problem: 'new Date()' on client might be EST.
        // We need to work with relative offsets or timestamps.

        // Let's assume the data is correct.
        // We want the chart to start at [FirstDataPoint (Open)] and end at [FirstDataPoint + MarketDuration]
        const firstData = index.data[0].time
        domainStart = firstData
        domainEnd = firstData + (6.5 * 60 * 60 * 1000) // 6.5 Hours fixed width
      } else if (isUS) {
        // US: 09:30 - 16:00 (6.5 Hours)
        const firstData = index.data[0].time
        domainStart = firstData
        domainEnd = firstData + (6.5 * 60 * 60 * 1000)
      } else if (isCN) {
        // CN: 09:30 - 15:00 (5.5 Hours) - often has lunch break but we ignore valid empty gap
        const firstData = index.data[0].time
        domainStart = firstData
        domainEnd = firstData + (5.5 * 60 * 60 * 1000)
      } else if (isJP) {
        // JP: 09:00 - 15:00 (6 Hours)
        const firstData = index.data[0].time
        domainStart = firstData
        domainEnd = firstData + (6 * 60 * 60 * 1000)
      }
    }
  }

  // Format Time Helper (Moved from parent or duplicated if simple)
  const formatTime = (timestamp: number, name: string) => {
    try {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      let timeZone = 'Asia/Seoul'
      if (name.includes('NASDAQ') || name.includes('S&P')) timeZone = 'America/New_York'
      else if (name.includes('Nikkei') || name.includes('JPY')) timeZone = 'Asia/Tokyo'
      else if (name.includes('Shanghai') || name.includes('CNY')) timeZone = 'Asia/Shanghai'
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone })
    } catch { return '' }
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="min-w-[85vw] md:min-w-full flex-shrink-0 snap-center bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-glass relative overflow-hidden"
    >
      {/* Card Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-gray-400 font-medium text-sm">{index.name}</h3>
            <span className="text-[10px] bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded">
              {['KOSPI', 'KOSDAQ', 'USD/KRW'].some(s => index.name.includes(s)) ? 'KST' :
                ['NASDAQ', 'S&P 500', 'Bitcoin', 'Ethereum'].some(s => index.name.includes(s)) ? 'EST' :
                  ['Nikkei'].some(s => index.name.includes(s)) ? 'JST' :
                    ['Shanghai', 'CNY'].some(s => index.name.includes(s)) ? 'CST' : 'Local'}
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-white tracking-tighter">
              {index.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
        <div className={`text-right px-3 py-1.5 rounded-lg bg-opacity-10 ${isUp ? 'bg-red-500' : 'bg-blue-500'}`}>
          <div className={`text-sm font-bold ${isUp ? 'text-red-400' : 'text-blue-400'}`}>
            {isUp ? '▲' : '▼'} {Math.abs(index.change).toFixed(2)}
          </div>
          <div className={`text-xs font-medium opacity-80 ${isUp ? 'text-red-400' : 'text-blue-400'}`}>
            {index.changePercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-28 -mx-2">
        {isVisible && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dataPoints}>
              <defs>
                <linearGradient id={`fillGradient-${safeId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="time"
                type="number"
                domain={[domainStart, domainEnd]}
                ticks={ticks}
                tickFormatter={(t) => formatTime(t, index.name)}
                tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis hide domain={['auto', 'auto']} />

              {/* Layer 1: Fill with Fade Gradient (Animated Sync) */}
              <Area
                type="monotone"
                dataKey="value"
                stroke="none"
                fill={`url(#fillGradient-${safeId})`}
                isAnimationActive={true} // Animation Enabled
                animationDuration={2000} // Slower for effect
                animationEasing="ease-out"
                connectNulls={false}
              />

              {/* Layer 2: Solid Stroke (Animated Sync) */}
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2.5}
                fill="none"
                isAnimationActive={true} // Animation Enabled
                animationDuration={2000}
                animationEasing="ease-out"
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Reference Line (Optional/Visual) */}
      <div className="absolute left-6 right-6 top-1/2 border-t border-dashed border-gray-600/30 pointer-events-none opacity-0" />
    </motion.div>
  )
}

// Helpers needed outside if not passed
const generateHourlyTicks = (data: { time: number }[]) => {
  if (!data.length) return []
  const startTime = data[0].time
  const endTime = data[data.length - 1].time
  const ticks = []
  let current = new Date(startTime)
  current.setMinutes(0, 0, 0)
  if (current.getTime() < startTime) current.setHours(current.getHours() + 1)
  while (current.getTime() <= endTime) {
    ticks.push(current.getTime())
    current.setHours(current.getHours() + 1)
  }
  return ticks
}

export default function MarketIndices() {
  const [indices, setIndices] = useState<MarketIndex[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('domestic') // Moved up
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      // Tolerance for browser subpixel rendering
      setShowLeft(scrollLeft > 2)
      setShowRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2)
    }
  }

  // Initial Check
  useEffect(() => {
    // Check frequently
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

  // Reset scroll position when tab changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' })
      setTimeout(checkScroll, 350)
    }
  }, [activeTab])

  // Fetch Real Data
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

  // Filter Indices for Tabs
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

  if (error) return null

  return (
    <div className="mb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-2xl font-bold text-white tracking-tight">시장 지수</h2>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-medium border border-green-500/20 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          LIVE
        </span>
      </div>

      {/* Tabs */}
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

      {/* Carousel Container (Desktop & Mobile) */}
      <div className="relative group">
        {/* Desktop Navigation Buttons */}
        {/* Desktop Navigation Buttons */}
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

