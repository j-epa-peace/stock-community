'use client'

import { useState, useEffect, useRef } from 'react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import { getMarketConfig } from '@/lib/market'

// Define local interface if not global
export interface MarketIndexInfo {
    name: string
    symbol: string
    value: number
    change: number
    changePercent: number
    previousClose?: number
    data: { time: number; value: number }[]
    interval?: string
    debug?: any
}

export default function MarketIndexCard({ index }: { index: MarketIndexInfo }) {
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

    const safeId = (index.symbol || 'unknown').replace(/[^a-zA-Z0-9]/g, '')

    const config = getMarketConfig(index.name, index.symbol || '')
    const { timeZone, locale, openHour, openMinute, durationHours, label } = config

    // 2. Calculate Domain based on "Last Data Point's Date" + Market Hours
    let domainStart: number | 'dataMin' = 'dataMin'
    let domainEnd: number | 'dataMax' = 'dataMax'

    const isCrypto = ['BITCOIN', 'ETHEREUM'].some(s => index.name.toUpperCase().includes(s))
    const isUS = ['NASDAQ', 'S&P'].some(s => index.name.toUpperCase().includes(s))

    if (index.data.length > 0 && !isCrypto) {
        const lastPoint = index.data[index.data.length - 1].time
        try {
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

            // Calculate how many milliseconds have passed since Midnight in that Local Timezone
            const msSinceMidnight = (currentHour * 3600 + currentMinute * 60 + currentSecond) * 1000
            const openMsFromMidnight = (openHour * 3600 + openMinute * 60) * 1000

            // Backtrack from Last Point to find the Market Open Timestamp (Absolute UTC)
            // Formula: LastPointUTC - (LocalTimeElapsed - OpenTimeElapsed)
            const marketOpenTimestamp = lastPoint - (msSinceMidnight - openMsFromMidnight)

            domainStart = marketOpenTimestamp
            domainEnd = marketOpenTimestamp + (durationHours * 3600 * 1000)
        } catch (e) {
            console.error("Domain Calc Error", e)
            domainStart = index.data[0].time
            domainEnd = index.data[0].time + (durationHours * 3600 * 1000)
        }
    }

    // 3. Helper: Format Time (Uses the SAME timeZone variable)
    const formatTime = (timestamp: number) => {
        try {
            if (!timestamp) return ''
            return new Intl.DateTimeFormat(locale, {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone
            }).format(new Date(timestamp))
        } catch { return '' }
    }

    // 4. Helper: Generate Hourly Ticks
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


    const ticks = generateHourlyTicks(
        index.data,
        typeof domainStart === 'number' ? domainStart : undefined,
        typeof domainEnd === 'number' ? domainEnd : undefined
    )

    // DEBUG: Time strings
    const debugStart = typeof domainStart === 'number' ? new Date(domainStart).toLocaleString(locale, { timeZone }) : 'Auto'
    const debugEnd = typeof domainEnd === 'number' ? new Date(domainEnd).toLocaleString(locale, { timeZone }) : 'Auto'
    const debugFirstData = index.data[0] ? new Date(index.data[0].time).toLocaleString(locale, { timeZone }) : 'No Data'
    const debugLastData = index.data.length > 0 ? new Date(index.data[index.data.length - 1].time).toLocaleString(locale, { timeZone }) : 'No Data'

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
                            {label}
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
                                padding={{ left: 0, right: 0 }}
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
