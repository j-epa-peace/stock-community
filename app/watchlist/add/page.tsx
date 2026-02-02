'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X, Search, Plus, Globe, Building2, Check } from 'lucide-react'
import { recommendedDomestic, recommendedGlobal } from '@/lib/mock-data'
import toast from 'react-hot-toast'

export default function AddWatchlistPage() {
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, setUser] = useState<{ name: string } | null>(null)
  const [currentWatchlist, setCurrentWatchlist] = useState<{ symbol: string, name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'domestic' | 'global'>('domestic')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const maxSelectable = 5
  const totalSelected = currentWatchlist.length

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

  // API Search Logic with Debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchTerm.trim()) {
        setSearchResults([])
        setIsSearching(false)
        return
      }

      setIsSearching(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`)
        const data = await res.json()
        setSearchResults(data.results || [])
      } catch (e) {
        console.error('Search error:', e)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleStockToggle = async (stock: { symbol: string, name: string }) => {
    const isInWatchlist = currentWatchlist.some(item => item.symbol === stock.symbol)

    if (isInWatchlist) {
      // Remove from watchlist
      await handleRemoveSelected(stock.symbol)
    } else {
      // Add to watchlist
      if (currentWatchlist.length >= maxSelectable) {
        toast.error(`관심종목은 최대 ${maxSelectable}개까지 추가할 수 있습니다`)
        return
      }

      try {
        const response = await fetch('/api/watchlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            stockSymbol: stock.symbol,
            stockName: stock.name
          })
        })

        const data = await response.json()

        if (data.success) {
          setCurrentWatchlist(prev => [...prev, { symbol: stock.symbol, name: stock.name }])
          toast.success(`${stock.name}이(가) 관심종목에 추가되었습니다`)
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
    const stock = currentWatchlist.find(s => s.symbol === symbol)
    const stockName = stock ? stock.name : symbol

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
        toast.success(`${stockName}이(가) 관심종목에서 제거되었습니다`)
      } else {
        throw new Error(data.error || 'Failed to remove stock')
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error)
      toast.error('관심종목 제거에 실패했습니다')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  // Determine which stocks to show for recommended grid
  const recommendedStocks = activeTab === 'domestic' ? recommendedDomestic : recommendedGlobal

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black py-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight relative z-10">관심종목 추가</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-6 relative z-10">
            원하는 종목을 검색하거나 추천 목록에서 선택하세요
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mb-8 z-20">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-4 bg-white/10 border border-white/10 rounded-2xl leading-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/20 transition-all text-lg"
              placeholder="전체 종목 검색 (예: 삼성전자, DIS)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Dynamic Selection Counter */}
          <div className="inline-flex items-center bg-white/5 backdrop-blur-md rounded-full px-6 py-3 border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="text-2xl font-bold text-white">
                {totalSelected}
              </div>
              <div className="text-gray-500">/</div>
              <div className="text-2xl font-bold text-gray-500">
                {maxSelectable}
              </div>
              <div className="text-gray-400 ml-2 text-sm font-medium">선택됨</div>
            </div>
          </div>
        </div>

        {/* Selected Stocks Bar */}
        {currentWatchlist.length > 0 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-glass p-6 mb-8 border border-white/10">
            <div className="flex items-center mb-4">
              <div className="w-2 h-2 bg-white rounded-full mr-3 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
              <h2 className="text-xl font-semibold text-white tracking-tight">
                현재 관심종목 ({currentWatchlist.length}개)
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {currentWatchlist.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex items-center bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium border border-white/10 hover:bg-white/20 transition-all"
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

        {/* Main Content Area */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-glass p-8 border border-white/10 min-h-[500px]">

          {searchTerm ? (
            // Search Results List View
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-6">검색 결과 ({searchResults.length})</h2>
              {isSearching && <div className="text-gray-400 text-center py-4">검색중...</div>}

              {!isSearching && searchResults.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>일치하는 종목이 없습니다</p>
                </div>
              )}

              {!isSearching && searchResults.map((stock) => {
                const isInWatchlist = currentWatchlist.some(item => item.symbol === stock.symbol)
                const changeP = stock.changePercent || 0

                return (
                  <div key={stock.symbol} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold border border-white/10 shadow-inner">
                        {stock.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{stock.name}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-2">
                          <span>{stock.symbol}</span>
                          <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                          <span>{stock.market || 'KRX'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {stock.changePercent !== undefined && (
                        <span className={`text-sm font-bold ${changeP > 0 ? 'text-red-400' : 'text-blue-400'}`}>
                          {changeP > 0 ? '+' : ''}{Number(changeP).toFixed(2)}%
                        </span>
                      )}

                      <button
                        onClick={() => handleStockToggle(stock)}
                        className={`
                                    px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                                    ${isInWatchlist
                            ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20'
                            : 'bg-white/10 text-white border border-white/10 hover:bg-white/20'
                          }
                                `}
                      >
                        {isInWatchlist ? (
                          <>
                            <span>삭제</span>
                            <X className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            <span>추가</span>
                            <Plus className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            // Recommended Grid View
            <>
              <div className="flex justify-center mb-8">
                <div className="bg-black/40 p-1 rounded-xl flex gap-1">
                  <button
                    onClick={() => setActiveTab('domestic')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'domestic'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <Building2 className="w-4 h-4" /> 국내 인기도
                  </button>
                  <button
                    onClick={() => setActiveTab('global')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'global'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <Globe className="w-4 h-4" /> 해외 인기도
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {recommendedStocks.map((stock) => {
                  const isInWatchlist = currentWatchlist.some(item => item.symbol === stock.symbol)
                  const logoUrl = stock.logo

                  return (
                    <div key={stock.symbol} className="relative group flex flex-col items-center">
                      <button
                        onClick={() => handleStockToggle(stock)}
                        className={`
                            relative w-28 h-28 rounded-full flex items-center justify-center overflow-hidden
                            transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) transform hover:scale-110
                            ${isInWatchlist
                            ? 'bg-white shadow-[0_0_40px_rgba(255,255,255,0.6)] ring-4 ring-white/30 scale-105'
                            : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                          }
                            `}
                      >
                        <div className={`absolute inset-0 rounded-full transition-opacity duration-500 ${isInWatchlist ? 'opacity-100 bg-white/10' : 'opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-white/0 to-white/10'}`} />

                        <div className={`w-full h-full p-6 flex items-center justify-center transition-all duration-500 ${isInWatchlist ? 'scale-90' : 'scale-75 group-hover:scale-90'}`}>
                          {logoUrl ? (
                            <img
                              src={logoUrl}
                              alt={stock.name}
                              className={`w-full h-full object-contain transition-all duration-500 ${isInWatchlist ? 'filter-none opacity-100 drop-shadow-md' : 'filter grayscale opacity-50 group-hover:filter-none group-hover:opacity-100'
                                }`}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                e.currentTarget.nextElementSibling?.classList.remove('hidden')
                              }}
                            />
                          ) : (
                            <div className={`text-2xl font-bold ${isInWatchlist ? 'text-black' : 'text-gray-500 group-hover:text-white'}`}>
                              {stock.name.slice(0, 2)}
                            </div>
                          )}

                          <div className="hidden absolute inset-0 flex items-center justify-center text-2xl font-bold">
                            <span className={isInWatchlist ? 'text-black' : 'text-gray-500'}>{stock.name.slice(0, 2)}</span>
                          </div>
                        </div>
                      </button>

                      <div className="mt-4 text-center w-full px-2 transition-all duration-300">
                        <p className={`text-sm font-bold truncate transition-colors ${isInWatchlist ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}>
                          {stock.name}
                        </p>
                        <p className="text-[10px] uppercase tracking-wider opacity-60 text-gray-500 font-medium truncate">
                          {stock.symbol.replace('.KS', '')}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

        </div>
      </div>

    </div>
  )
}