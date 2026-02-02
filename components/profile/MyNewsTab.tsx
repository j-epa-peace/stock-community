'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext' // Assuming user context is needed or just localstorage
import Link from 'next/link'
import { ExternalLink, Newspaper } from 'lucide-react'

export default function MyNewsTab() {
    const [news, setNews] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadNews = async () => {
            // 1. Gather symbols from Watchlist + Recent
            let symbols = new Set<string>()

            // From LocalStorage
            try {
                const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
                recent.forEach((r: any) => symbols.add(r.symbol))
            } catch { }

            // From Watchlist API (if needed, but maybe just skip if no user? We are likely logged in)
            // Ideally we pass watchlist props, but fetching is fine.
            try {
                const res = await fetch('/api/watchlist')
                const data = await res.json()
                if (data.success && data.watchlist) {
                    data.watchlist.forEach((w: any) => symbols.add(w.stockSymbol))
                }
            } catch { }

            // If no symbols, fallback to some defaults?
            if (symbols.size === 0) {
                // Add defaults: KOSPI, Samsung, Tesla
                ['^KS11', '005930.KS', 'TSLA'].forEach(s => symbols.add(s))
            }

            // 2. Fetch News
            const symbolList = Array.from(symbols).slice(0, 10).join(',') // Limit to 10 stocks
            try {
                const newsRes = await fetch(`/api/news?symbols=${encodeURIComponent(symbolList)}`)
                const newsData = await newsRes.json()
                if (newsData.news) {
                    setNews(newsData.news)
                }
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }

        loadNews()
    }, [])

    if (loading) return <div className="text-center py-20 text-gray-500">뉴스를 불러오는 중...</div>

    if (news.length === 0) {
        return (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                <p className="text-gray-400">관련 뉴스가 없습니다.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {news.map((item) => (
                <Link
                    key={item.uuid || item.link}
                    href={item.link}
                    target="_blank"
                    className="block group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all"
                >
                    <div className="p-5 h-full flex flex-col">
                        <div className="flex justify-between items-start mb-3 gap-4">
                            <h3 className="font-bold text-white leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors">
                                {item.title}
                            </h3>
                            <ExternalLink className="w-4 h-4 text-gray-500 flex-shrink-0 group-hover:text-white" />
                        </div>

                        <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
                            <span className="font-medium text-gray-400 truncate max-w-[120px]">{item.publisher}</span>
                            <span>{new Date(item.providerPublishTime * 1000).toLocaleDateString()}</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}
