'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X, Check } from 'lucide-react'
import { topCompanies } from '@/lib/mock-data'
import toast from 'react-hot-toast'

export default function AddWatchlistPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string } | null>(null)
  const [currentWatchlist, setCurrentWatchlist] = useState<{ symbol: string, name: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userRes = await fetch('/api/auth/me')
        const userData = await userRes.json()

        if (!userData.user) {
          router.push('/auth/login')
          return
        }

        setUser(userData.user)

        // Fetch current watchlist
        const watchlistRes = await fetch('/api/watchlist')
        const watchlistData = await watchlistRes.json()

        if (watchlistData.success) {
          setCurrentWatchlist(watchlistData.watchlist.map((item: any) => ({
            symbol: item.stockSymbol,
            name: item.stockName
          })))
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleStockToggle = async (company: typeof topCompanies[0]) => {
    const isInWatchlist = currentWatchlist.some(item => item.symbol === company.symbol)

    if (isInWatchlist) {
      // 관심종목에서 제거
      try {
        const response = await fetch('/api/watchlist', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            stockSymbol: company.symbol
          })
        })

        const data = await response.json()

        if (data.success) {
          setCurrentWatchlist(prev => prev.filter(item => item.symbol !== company.symbol))
          toast.success(`${company.name}이(가) 관심종목에서 제거되었습니다`)
        } else {
          throw new Error(data.error || 'Failed to remove stock')
        }
      } catch (error) {
        console.error('Error removing from watchlist:', error)
        toast.error('관심종목 제거에 실패했습니다')
      }
    } else {
      // 관심종목에 추가
      if (currentWatchlist.length >= 5) {
        toast.error('관심종목은 최대 5개까지 추가할 수 있습니다')
        return
      }

      try {
        const response = await fetch('/api/watchlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            stockSymbol: company.symbol,
            stockName: company.name
          })
        })

        const data = await response.json()

        if (data.success) {
          setCurrentWatchlist(prev => [...prev, { symbol: company.symbol, name: company.name }])
          toast.success(`${company.name}이(가) 관심종목에 추가되었습니다`)
        } else {
          throw new Error(data.error || 'Failed to add stock')
        }
      } catch (error) {
        console.error('Error adding to watchlist:', error)
        toast.error('관심종목 추가에 실패했습니다')
      }
    }
  }

  const handleRemoveSelected = async (symbol: string) => {
    const company = topCompanies.find(c => c.symbol === symbol)
    if (!company) return

    try {
      const response = await fetch('/api/watchlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stockSymbol: symbol
        })
      })

      const data = await response.json()

      if (data.success) {
        setCurrentWatchlist(prev => prev.filter(item => item.symbol !== symbol))
        toast.success(`${company.name}이(가) 관심종목에서 제거되었습니다`)
      } else {
        throw new Error(data.error || 'Failed to remove stock')
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error)
      toast.error('관심종목 제거에 실패했습니다')
    }
  }

  const totalSelected = currentWatchlist.length // selectedStocks 제거, currentWatchlist만 사용
  const maxSelectable = 5

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-6">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-700 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 섹션 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">관심종목 추가</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
            세계 최고의 기업들을 관심종목에 추가하고 실시간으로 추적해보세요
          </p>

          {/* 동적 선택 카운터 */}
          <div className="inline-flex items-center bg-gray-800 rounded-full px-6 py-3 border border-gray-600">
            <div className="flex items-center space-x-3">
              <div className="text-2xl font-bold text-primary-400">
                {totalSelected}
              </div>
              <div className="text-gray-400">/</div>
              <div className="text-2xl font-bold text-gray-300">
                {maxSelectable}
              </div>
              <div className="text-gray-300 ml-2">선택됨</div>
            </div>
          </div>
        </div>

        {/* 선택된 종목 바 */}
        {currentWatchlist.length > 0 && (
          <div className="bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-600">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-primary-500 rounded-full mr-3"></div>
              <h2 className="text-xl font-semibold text-white">
                현재 관심종목 ({currentWatchlist.length}개)
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {currentWatchlist.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex items-center bg-gray-700 text-white px-4 py-2 rounded-full text-sm font-medium border border-gray-600"
                >
                  <span>{stock.name}</span>
                  <button
                    onClick={() => handleRemoveSelected(stock.symbol)}
                    className="ml-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 기업 그리드 */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-8 text-center">글로벌 TOP 15 기업</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {topCompanies.map((company) => {
              const isInWatchlist = currentWatchlist.some(item => item.symbol === company.symbol)

              return (
                <div key={company.symbol} className="relative group flex flex-col items-center">
                  <button
                    onClick={() => handleStockToggle(company)}
                    className={`
                      relative w-24 h-24 rounded-full flex items-center justify-center
                      transition-all duration-300 transform hover:scale-110 hover:shadow-2xl
                      ${isInWatchlist
                        ? 'bg-primary-600 shadow-xl shadow-primary-500/25 ring-4 ring-primary-400/30'
                        : 'bg-white hover:bg-gray-100 shadow-lg'
                      }
                      border-4 ${isInWatchlist ? 'border-primary-400' : 'border-transparent'}
                    `}
                  >
                    {/* Flip 애니메이션을 위한 컨테이너 */}
                    <div className="flip-container w-full h-full">
                      <div className="flip-card w-full h-full">
                        {/* 앞면: 기업 로고 */}
                        <div className="flip-front w-full h-full flex items-center justify-center bg-white rounded-full p-3">
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              const parent = target.parentElement
                              if (parent) {
                                parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-xs font-bold text-gray-800 bg-gray-200 rounded-full">${company.symbol}</div>`
                              }
                            }}
                          />
                        </div>
                        {/* 뒷면: 한국어 이름 */}
                        <div className="flip-back w-full h-full flex items-center justify-center">
                          <span className="text-sm font-bold text-center px-2 leading-tight">
                            {isInWatchlist ? (
                              <span className="text-white">{company.name}</span>
                            ) : (
                              <span className="text-gray-800">{company.name}</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 체크박스 완전 제거 */}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .flip-container {
          perspective: 1000px;
        }
        
        .flip-card {
          position: relative;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        
        .group:hover .flip-card {
          transform: rotateY(180deg);
        }
        
        .flip-front, .flip-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 50%;
        }
        
        .flip-back {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}