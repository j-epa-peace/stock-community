'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { ArrowRightLeft, Clock, History } from 'lucide-react'

// Mock constant - ideally shared or fetched
const EXCHANGE_RATE = 1450

export default function MyStocksTab() {
    const { user } = useAuth()
    const [watchlist, setWatchlist] = useState<any[]>([])
    const [recentlyViewed, setRecentlyViewed] = useState<any[]>([])
    const [stockData, setStockData] = useState<Record<string, any>>({})
    const [isKrw, setIsKrw] = useState(true)

    // Load Watchlist & Recently Viewed
    useEffect(() => {
        const loadData = async () => {
            // Load Recently Viewed from LocalStorage
            const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
            setRecentlyViewed(recent)

            // Load Watchlist from API
            if (user) {
                try {
                    const res = await fetch('/api/watchlist')
                    const data = await res.json()
                    if (data.success) {
                        setWatchlist(data.watchlist)

                        // Fetch real-time prices for watchlist
                        const symbols = data.watchlist.map((w: any) => w.stockSymbol)
                        // Also fetch for recent if we want live updates, but recent might have frozen data.
                        // Let's rely on recent data being slightly stale or refetch if we want.
                        // For simplicity, let's just use what we have or fetch if needed.
                        // Actually, 'recentlyViewed' has price data saved at view time. 
                        // It's better to show that snapshot or update it? 
                        // User expects "History" so snapshot is okay, but "Watchlist" needs live.

                        if (symbols.length > 0) {
                            const stockRes = await fetch(`/api/stocks?symbols=${encodeURIComponent(symbols.join(','))}`)
                            const stockJson = await stockRes.json()
                            if (stockJson.success) {
                                const map: any = {}
                                stockJson.stocks.forEach((s: any) => {
                                    map[s.symbol] = s
                                    if (s.symbol.includes('.KS')) {
                                        map[s.symbol.replace('.KS', '')] = s
                                    }
                                })
                                setStockData(map)
                            }
                        }
                    }
                } catch (e) {
                    console.error(e)
                }
            }
        }
        loadData()
    }, [user])

    const formatPrice = (symbol: string, price: number) => {
        const isKorean = symbol.includes('.KS') || symbol.includes('.KQ') || /^\d{6}$/.test(symbol)
        const isUsStock = !isKorean

        if (isKrw) {
            if (isUsStock) return `${Math.round(price * EXCHANGE_RATE).toLocaleString()}원`
            return `${price.toLocaleString()}원`
        } else {
            if (isUsStock) return `$${price.toFixed(2)}`
            return `$${(price / EXCHANGE_RATE).toFixed(2)}`
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Watchlist Section */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-glass">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="p-2 rounded-lg bg-yellow-500/20 text-yellow-500">
                            ⭐
                        </span>
                        내 관심종목
                    </h3>
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
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all font-medium"
                        >
                            + 관리
                        </Link>
                    </div>
                </div>

                {watchlist.length === 0 ? (
                    <div className="py-12 text-center bg-white/5 rounded-2xl border border-white/5 border-dashed">
                        <p className="text-gray-500 text-sm mb-4">아직 관심종목이 없습니다.</p>
                        <Link href="/" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs font-bold text-white transition-colors">
                            종목 찾아보기
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {watchlist.map(item => {
                            const stock = stockData[item.stockSymbol]
                            const price = stock ? stock.price : 0
                            const change = stock ? stock.change : 0
                            const changePercent = stock ? stock.changePercent : 0
                            const isUp = change >= 0
                            const isLoading = !stock

                            return (
                                <Link
                                    key={item.id}
                                    href={`/stocks/${item.stockSymbol}`}
                                    className="flex justify-between items-center p-4 border border-white/5 rounded-2xl hover:bg-white/10 bg-white/5 transition-all duration-300 hover:border-white/20 hover:shadow-lg group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center font-bold text-white text-xs border border-white/10">
                                            {item.stockName[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{item.stockName}</div>
                                            <div className="text-xs text-gray-500 font-mono">{item.stockSymbol.replace('.KS', '')}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {isLoading ? (
                                            <div className="h-8 w-20 bg-white/10 animate-pulse rounded" />
                                        ) : (
                                            <>
                                                <div className="font-bold text-white text-lg tracking-tight">{formatPrice(item.stockSymbol, price)}</div>
                                                <div className={`text-xs font-bold ${isUp ? 'text-red-400' : 'text-blue-400'} flex items-center justify-end gap-1`}>
                                                    <span>{isUp ? '▲' : '▼'} {Math.abs(changePercent).toFixed(2)}%</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Recently Viewed Section */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-glass">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                            <History className="w-4 h-4" />
                        </span>
                        최근 본 종목
                    </h3>
                </div>

                {recentlyViewed.length === 0 ? (
                    <div className="py-12 text-center bg-white/5 rounded-2xl border border-white/5 border-dashed text-gray-500 text-sm">
                        최근 본 내역이 없습니다.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentlyViewed.map((stock: any) => {
                            const isUp = stock.change >= 0
                            const viewedTime = new Date(stock.viewedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })

                            return (
                                <Link
                                    key={stock.symbol}
                                    href={`/stocks/${stock.symbol}`}
                                    className="flex justify-between items-center p-3 border border-white/5 rounded-xl hover:bg-white/10 transition-all opacity-80 hover:opacity-100 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <div className="font-bold text-gray-200 group-hover:text-white text-sm">{stock.name}</div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-gray-500 font-mono">{stock.symbol}</span>
                                                <span className="text-[10px] text-gray-600 flex items-center gap-0.5">
                                                    <Clock className="w-2.5 h-2.5" /> {viewedTime}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium text-gray-300 text-sm">{formatPrice(stock.symbol, stock.price)}</div>
                                        <div className={`text-[10px] ${isUp ? 'text-red-400/90' : 'text-blue-400/90'}`}>
                                            {stock.changePercent.toFixed(2)}%
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
