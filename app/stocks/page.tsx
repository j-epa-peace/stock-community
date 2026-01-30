'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function StocksPage() {
  return (
    <div className="min-h-screen pt-4 pb-10 md:pt-16 md:pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">종목 토론방</h1>
          <p className="text-gray-400 text-lg">
            관심 있는 종목을 선택하여
            <br className="md:hidden" /> 다른 투자자들과 소통해보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* 국내 주식 */}
          <Link href="/stocks/domestic" className="group">
            <div className="bg-white/5 backdrop-blur-3xl rounded-3xl p-6 md:p-8 border border-white/10 hover:border-white/30 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:bg-white/10">
              <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-4 [perspective:1000px]">
                  <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    {/* Front: Flag */}
                    <div className="absolute inset-0 w-full h-full bg-gray-800 rounded-full flex items-center justify-center [backface-visibility:hidden] overflow-hidden">
                      <Image
                        src="/icons/flag-kr.svg"
                        alt="Korea Flag"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Back: Text */}
                    <div className="absolute inset-0 w-full h-full bg-gray-700 rounded-full flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <span className="text-xl font-bold text-white">KR</span>
                    </div>
                  </div>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">국내 주식</h2>
                <p className="text-gray-400 mb-4">KOSPI • KOSDAQ</p>
                <div className="flex justify-center space-x-2 md:space-x-4 text-xs md:text-sm text-gray-500">
                  <span>KOSPI 30개</span>
                  <span>•</span>
                  <span>KOSDAQ 30개</span>
                </div>
              </div>
            </div>
          </Link>

          {/* 해외 주식 */}
          <Link href="/stocks/international" className="group">
            <div className="bg-white/5 backdrop-blur-3xl rounded-3xl p-6 md:p-8 border border-white/10 hover:border-white/30 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:bg-white/10">
              <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-4 [perspective:1000px]">
                  <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    {/* Front: Flag */}
                    <div className="absolute inset-0 w-full h-full bg-gray-800 rounded-full flex items-center justify-center [backface-visibility:hidden] overflow-hidden">
                      <Image
                        src="/icons/flag-us.svg"
                        alt="USA Flag"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Back: Text */}
                    <div className="absolute inset-0 w-full h-full bg-gray-700 rounded-full flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <span className="text-xl font-bold text-white">US</span>
                    </div>
                  </div>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">해외 주식</h2>
                <p className="text-gray-400 mb-4">S&P 500 • NASDAQ</p>
                <div className="flex justify-center space-x-2 md:space-x-4 text-xs md:text-sm text-gray-500">
                  <span>S&P 500 30개</span>
                  <span>•</span>
                  <span>NASDAQ 30개</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}