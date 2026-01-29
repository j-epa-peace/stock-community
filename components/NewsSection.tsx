'use client'

import { ExternalLink } from 'lucide-react'
import { mockNews } from '@/lib/mock-data'

export default function NewsSection() {
  return (
    <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6">시장 뉴스</h2>
      
      <div className="space-y-4">
        {mockNews.map((news) => (
          <div key={news.id} className="border-b border-gray-600 pb-4 last:border-b-0">
            <a
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start justify-between hover:bg-primary-900/10 p-3 rounded-lg transition-all duration-200"
            >
              <h3 className="text-white group-hover:text-primary-200 font-medium flex-1 pr-4 transition-colors duration-200">
                {news.title}
              </h3>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-primary-300 flex-shrink-0 mt-1 transition-colors duration-200" />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}