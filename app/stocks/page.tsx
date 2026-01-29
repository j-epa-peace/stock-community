'use client'

import Link from 'next/link'

export default function StocksPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-8 pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">종목 토론방</h1>
          <p className="text-gray-400 text-lg">관심 있는 종목을 선택하여 다른 투자자들과 소통해보세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* 국내 주식 */}
          <Link href="/stocks/domestic" className="group">
            <div className="bg-gray-800 rounded-xl p-6 md:p-8 border border-gray-700 hover:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/20">
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl md:text-2xl font-bold text-white">🇰🇷</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">국내 주식</h2>
                <p className="text-gray-400 mb-4">KOSPI • KOSDAQ</p>
                <div className="flex justify-center space-x-2 md:space-x-4 text-xs md:text-sm text-gray-500">
                  <span>KOSPI 100개</span>
                  <span>•</span>
                  <span>KOSDAQ 100개</span>
                </div>
              </div>
            </div>
          </Link>


          

          {/* 해외 주식 */}
          <Link href="/stocks/international" className="group">
            <div className="bg-gray-800 rounded-xl p-6 md:p-8 border border-gray-700 hover:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/20">
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl md:text-2xl font-bold text-white">🇺🇸</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">해외 주식</h2>
                <p className="text-gray-400 mb-4">S&P 500 • NASDAQ</p>
                <div className="flex justify-center space-x-2 md:space-x-4 text-xs md:text-sm text-gray-500">
                  <span>S&P 500 100개</span>
                  <span>•</span>
                  <span>NASDAQ 100개</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}