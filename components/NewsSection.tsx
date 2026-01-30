'use client'

import { useState, useEffect } from 'react'
import { Newspaper, ExternalLink, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface NewsItem {
  title: string
  link: string
  time: string
  provider: string
}

type TabType = 'domestic' | 'global' | 'crypto'

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('domestic')

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/market/news?category=${activeTab}`)
        if (response.ok) {
          const data = await response.json()
          setNews(data)
        }
      } catch (error) {
        console.error('News fetch failed', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [activeTab])

  // Time formatter (e.g. "2 hours ago")
  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const past = new Date(dateString)
    const diffMs = now.getTime() - past.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)

    if (diffMins < 60) return `${diffMins}분 전`
    if (diffHours < 24) return `${diffHours}시간 전`
    return past.toLocaleDateString('ko-KR')
  }

  return (
    <div className="mb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-blue-400" />
          관련 뉴스
        </h2>

        {/* Tabs */}
        <div className="flex bg-gray-800 p-1 rounded-xl w-full sm:w-auto overflow-x-auto hide-scrollbar">
          {[
            { id: 'domestic', label: '국내' },
            { id: 'global', label: '해외' },
            { id: 'crypto', label: '디지털자산' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                ? 'bg-gray-700 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse border border-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode='wait'>
            {news.map((item, index) => (
              <motion.a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group block bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all duration-300 relative overflow-hidden shadow-glass hover:shadow-glow-white"
              >
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-4 h-4 text-blue-400" />
                </div>

                <div className="flex flex-col h-full justify-between">
                  <h3 className="text-white font-medium mb-3 line-clamp-2 leading-relaxed group-hover:text-blue-300 transition-colors">
                    {item.title.replace(/ - .*$/, '')} {/* 언론사명 제거하고 제목만 깔끔하게 */}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                    <span className="flex items-center gap-1.5 bg-gray-900/50 px-2 py-1 rounded text-gray-400">
                      {item.provider}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(item.time)}
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </div>
      )}

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}