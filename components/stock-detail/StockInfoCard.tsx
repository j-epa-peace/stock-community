'use client'

import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { Stock } from '@/types'
import { formatStockPrice } from '@/lib/utils'

interface StockInfoCardProps {
    stock: Stock
    chartData: any[]
    timeRange: string
    setTimeRange: (range: string) => void
    isLoadingChart: boolean
}

export default function StockInfoCard({ stock, chartData, timeRange, setTimeRange, isLoadingChart }: StockInfoCardProps) {
    const isUsMarket = ['NASDAQ', 'SP500', 'NYSE', 'AMEX'].includes(stock.market)
    const currencyMode = isUsMarket ? 'USD' : 'KRW'

    return (
        <div className="bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-glass overflow-hidden p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl md:text-3xl font-bold text-white tracking-tight">{stock.name}</h1>
                        <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-gray-300">
                            {stock.symbol}
                        </span>
                    </div>
                    <p className="text-gray-400 font-medium text-sm">{stock.market} Market</p>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-bold text-white tracking-tight mb-1">
                        {formatStockPrice(stock.price, stock.market, currencyMode)}
                    </h2>
                    <div className={`flex items-center justify-end space-x-2 text-lg font-semibold ${stock.change >= 0 ? 'text-red-400' : 'text-blue-400'}`}>
                        <span>{stock.change > 0 ? '▲' : '▼'}{formatStockPrice(Math.abs(stock.change), stock.market, currencyMode).replace(/[^0-9.,]/g, '')}</span>
                        <span>({Math.abs(stock.changePercent).toFixed(2)}%)</span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[350px] w-full relative">
                {isLoadingChart ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={stock.change >= 0 ? '#f87171' : '#60a5fa'} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={stock.change >= 0 ? '#f87171' : '#60a5fa'} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="time"
                                hide={true}
                                padding={{ left: 10, right: 10 }}
                            />
                            <YAxis
                                hide={true}
                                domain={['auto', 'auto']}
                                padding={{ top: 20, bottom: 20 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={stock.change >= 0 ? '#f87171' : '#60a5fa'}
                                strokeWidth={2}
                                fill="url(#chartGradient)"
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Time Range Selector */}
            <div className="flex justify-center flex-wrap gap-2 mt-6">
                {['1d', '1w', '1mo', '1y'].map((range) => (
                    <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${timeRange === range
                            ? 'bg-white text-black shadow-lg scale-105'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {range === '1d' ? '1일' : range === '1w' ? '1주' : range === '1mo' ? '1달' : '1년'}
                    </button>
                ))}
            </div>

            {/* Disclaimer */}
            <div className="mt-4 text-center space-y-1">
                {chartData && chartData.length > 0 && (
                    <p className="text-[11px] text-gray-400 font-semibold mb-1">
                        기준: {new Date(chartData[chartData.length - 1].time).toLocaleString('ko-KR', {
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        })}
                    </p>
                )}
                <p className="text-[10px] text-gray-500 font-medium">
                    ※ 제공된 데이터는 Yahoo Finance 기준이며, 실시간 시세와 15~20분 이상 차이가 발생할 수 있습니다.
                </p>
            </div>
        </div>
    )
}
