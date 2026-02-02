'use client'

import { useEffect, useState } from 'react'
import { Stock, Post } from '@/types'
import { formatStockPrice } from '@/lib/utils'
import Link from 'next/link'
import { TrendingUp, MessageCircle, Heart, Eye, ArrowRightLeft } from 'lucide-react'

// Extend Stock to include id which comes from DB
type TrendingStock = Stock & { id: string }

// Define Post shape specific to this component's API response
type TrendingPost = {
    id: string
    title: string
    viewCount: number
    stock: { symbol: string; name: string }
    user: { name: string }
    likes: any[]
}

export default function TrendingSection() {
    const [trendingStocks, setTrendingStocks] = useState<TrendingStock[]>([])
    const [hotPosts, setHotPosts] = useState<TrendingPost[]>([])
    const [loadingStocks, setLoadingStocks] = useState(true)
    const [loadingPosts, setLoadingPosts] = useState(true)
    const [isKrw, setIsKrw] = useState(true)
    const [selectedMarket, setSelectedMarket] = useState<'KR' | 'US'>('KR')

    // Fetch Stocks when market changes
    useEffect(() => {
        async function fetchStocks() {
            setLoadingStocks(true) // ... rest of logic
            try {
                const query = `?market=${selectedMarket}`
                const res = await fetch(`/api/trending${query}`)
                const json = await res.json()
                if (json.success) {
                    setTrendingStocks(json.stocks)
                    if (hotPosts.length === 0) {
                        setHotPosts(json.posts)
                        setLoadingPosts(false)
                    }
                }
            } catch (e) {
                console.error(e)
            } finally {
                setLoadingStocks(false)
                setLoadingPosts(false)
            }
        }
        fetchStocks()
    }, [selectedMarket])


    return (
        <section className="mb-8">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Trending Stocks */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                            <TrendingUp className="w-5 h-5 text-red-400" />
                            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">실시간 급상승</span>
                        </h2>

                        <div className="flex items-center gap-2">
                            {/* Market Tabs */}
                            <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10 mr-2">
                                {(['KR', 'US'] as const).map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setSelectedMarket(m)}
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${selectedMarket === m
                                            ? 'bg-white text-black shadow-sm'
                                            : 'text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        {m === 'KR' ? '국내' : '해외'}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setIsKrw(!isKrw)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all font-medium"
                            >
                                <ArrowRightLeft className="w-3 h-3" />
                                {isKrw ? '원화' : 'USD'}
                            </button>
                        </div>
                    </div>
                    {loadingStocks ? (
                        <div className="animate-pulse h-40 bg-white/5 rounded-2xl mb-6"></div>
                    ) : (
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden p-4">
                            <div className="space-y-3">
                                {trendingStocks.map((stock, i) => (
                                    <Link href={`/stocks/${stock.symbol}`} key={stock.id} className="flex items-center justify-between group hover:bg-white/5 p-2 rounded-lg transition-colors">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-sm font-bold w-4 text-center ${i < 3 ? 'text-red-400' : 'text-gray-500'}`}>{i + 1}</span>
                                            <div>
                                                <div className="font-bold text-gray-200 text-sm group-hover:text-white transition-colors">{stock.name}</div>
                                                <div className="text-xs text-gray-500">{stock.symbol.replace('.KS', '')}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-sm font-bold text-gray-200 group-hover:text-white transition-colors`}>
                                                {formatStockPrice(stock.price, stock.market, isKrw ? 'KRW' : 'USD')}
                                            </div>
                                            <div className={`text-xs font-bold ${stock.change >= 0 ? 'text-red-400' : 'text-blue-400'}`}>
                                                {stock.change > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Hot Discussions */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4 h-9">
                        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                            <MessageCircle className="w-5 h-5 text-orange-400" />
                            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">화제의 토론</span>
                        </h2>
                    </div>
                    {loadingPosts && hotPosts.length === 0 ? (
                        <div className="animate-pulse h-40 bg-white/5 rounded-2xl mb-6"></div>
                    ) : (
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden p-4">
                            <div className="space-y-3">
                                {hotPosts.map((post, i) => (
                                    <Link href={`/stocks/${post.stock.symbol}?postId=${post.id}`} key={post.id} className="block group hover:bg-white/5 p-2 rounded-lg transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-sm font-bold w-4 text-center ${i < 3 ? 'text-orange-400' : 'text-gray-500'}`}>{i + 1}</span>
                                                <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-gray-400 font-medium">{post.stock.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-[10px] text-gray-500">
                                                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.viewCount}</span>
                                                <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {post.likes ? post.likes.length : 0}</span>
                                            </div>
                                        </div>
                                        <div className="pl-6">
                                            <div className="text-sm text-gray-200 font-medium truncate group-hover:text-white transition-colors">{post.title}</div>
                                            <div className="text-[11px] text-gray-500 mt-0.5">{post.user.name}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
