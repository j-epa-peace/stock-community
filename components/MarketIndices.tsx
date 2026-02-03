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
  data: { time: number; value: number }[]
}

type TabType = 'domestic' | 'global' | 'exchange' | 'crypto'

// Sub-component for Lazy Loading & Animation
const MarketIndexCard = ({ index }: { index: MarketIndex }) => {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Safety Check
  if (!index || !index.data) return null

  const isUp = index.change >= 0
  const color = isUp ? '#ef4444' : '#3b82f6'

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const dataPoints = isMobile ? index.data.filter((_, i) => i % 5 === 0) : index.data
  // Moved ticks calculation to after domain logic
  const safeId = (index.symbol || 'unknown').replace(/[^a-zA-Z0-9]/g, '')

  // 1. Determine Market Config & Timezone
  let timeZone = 'Asia/Seoul'
  let openHour = 9
  let openMinute = 0
  let durationHours = 6.5 // Default KR 09:00 - 15:30

  if (['NASDAQ', 'S&P 500'].some(s => index.name.includes(s))) {
    timeZone = 'America/New_York'
    openHour = 9
    openMinute = 30
    durationHours = 6.5
  } else if (['Nikkei'].some(s => index.name.includes(s))) {
    timeZone = 'Asia/Tokyo'
    openHour = 9
    openMinute = 0
    durationHours = 6.0
  } else if (['Shanghai'].some(s => index.name.includes(s))) {
    timeZone = 'Asia/Shanghai'
    openHour = 9
    openMinute = 30
    durationHours = 5.5
  }

  // 2. Calculate Domain based on "Last Data Point's Date" + Market Hours
  let domainStart: number | 'dataMin' = 'dataMin'
  let domainEnd: number | 'dataMax' = 'dataMax'

  const isCrypto = ['Bitcoin', 'Ethereum'].some(s => index.name.includes(s))

  if (index.data.length > 0 && !isCrypto) {
    const lastPoint = index.data[index.data.length - 1].time
    try {
      // Use Intl to parse the Last Point time in the target Timezone
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
      })

      const parts = formatter.formatToParts(new Date(lastPoint))
      const getPart = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0')

      const currentHour = getPart('hour')
      const currentMinute = getPart('minute')
      const currentSecond = getPart('second')

      // Calculate midnight offset for that specific day
      const msSinceMidnight = (currentHour * 3600 + currentMinute * 60 + currentSecond) * 1000
      const openMsFromMidnight = (openHour * 3600 + openMinute * 60) * 1000

      // Backtrack to Open Time
      const marketOpenTimestamp = lastPoint - (msSinceMidnight - openMsFromMidnight)

      domainStart = marketOpenTimestamp
      domainEnd = marketOpenTimestamp + (durationHours * 3600 * 1000)
    } catch (e) {
      console.error("Domain Calc Error", e)
      // Fallback
      domainStart = index.data[0].time
      domainEnd = index.data[0].time + (durationHours * 3600 * 1000)
    }
  }

  // 3. Helper: Format Time (Uses the SAME timeZone variable)
  const formatTime = (timestamp: number) => {
    try {
      if (!timestamp) return ''
      return new Intl.DateTimeFormat('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone
      }).format(new Date(timestamp))
    } catch { return '' }
  }

  // 4. Helper: Generate Hourly Ticks
  const ticks = generateHourlyTicks(
    index.data,
    typeof domainStart === 'number' ? domainStart : undefined,
    typeof domainEnd === 'number' ? domainEnd : undefined
  )





  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="min-w-[85vw] md:min-w-full flex-shrink-0 snap-center bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-glass relative overflow-hidden"
    >
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
                tickFormatter={formatTime}
                tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis hide domain={['auto', 'auto']} />

              <Area
                type="monotone"
                dataKey="value"
                stroke="none"
                fill={`url(#fillGradient-${safeId})`}
                isAnimationActive={true}
                animationDuration={2000}
                animationEasing="ease-out"
                connectNulls={true}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2.5}
                fill="none"
                isAnimationActive={true}
                animationDuration={2000}
                animationEasing="ease-out"
                connectNulls={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="absolute left-6 right-6 top-1/2 border-t border-dashed border-gray-600/30 pointer-events-none opacity-0" />

    </motion.div>
  )
}

const generateHourlyTicks = (data: { time: number }[], start?: number, end?: number) => {
  if (!data.length && (!start || !end)) return []

  const startTime = start ?? data[0].time
  const endTime = end ?? data[data.length - 1].time

  const ticks = []

  // 1. Add Start Time
  ticks.push(startTime)

  // 2. Add Hourly Ticks (Aligned to 1 Hour boundary)
  let nextHour = Math.ceil((startTime + 1) / 3600000) * 3600000

  while (nextHour < endTime) {
    ticks.push(nextHour)
    nextHour += 3600000
    if (ticks.length > 24) break
  }

  return ticks
}

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
