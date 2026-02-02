'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Newspaper, ChevronLeft, ChevronRight } from 'lucide-react'

export default function NewsCarousel({ symbol }: { symbol: string }) {
    const [news, setNews] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Fetch News
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch(`/api/news?symbols=${symbol}`)
                const data = await res.json()
                if (data.news) {
                    setNews(data.news)
                    // If API fails to return enough news, we handle empty check below
                }
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        fetchNews()
    }, [symbol])

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef
            const scrollAmount = 340 // card width (320) + gap (20) roughly
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
            }
        }
    }

    if (loading) return <div className="h-48 bg-white/5 rounded-2xl animate-pulse mb-8" />

    if (news.length === 0) return null

    return (
        <div className="mb-8 relative group">
            <div className="flex items-center gap-2 mb-4 px-1">
                <Newspaper className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-bold text-white">관련 뉴스</h3>
                <div className="flex-1" />
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 transition-all border border-white/10"
                    >
                        <ChevronLeft className="w-4 h-4 text-white" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 transition-all border border-white/10"
                    >
                        <ChevronRight className="w-4 h-4 text-white" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {news.map((item, i) => (
                    <motion.a
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-w-[280px] md:min-w-[320px] bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all snap-start flex flex-col justify-between h-40 group/card relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-0 group-hover/card:opacity-100 transition-opacity">
                            <ExternalLink className="w-4 h-4 text-white" />
                        </div>

                        <div>
                            <h4 className="font-bold text-white leading-snug line-clamp-2 max-w-[90%] mb-2">
                                {item.title}
                            </h4>
                            <p className="text-xs text-gray-400 line-clamp-1">{item.publisher}</p>
                        </div>

                        <div className="text-xs text-gray-500 mt-2">
                            {new Date(item.providerPublishTime * 1000).toLocaleDateString()}
                        </div>
                    </motion.a>
                ))}
            </div>
        </div>
    )
}
