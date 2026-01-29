'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MessageSquare, Heart, User, LogOut, LogIn, UserPlus } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import HotStockLogo from './HotStockLogo'

export default function Navbar() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .catch(() => {
        // User not logged in
      })
  }, [])

  const handleLogout = async () => {
    await logout()
    setUser(null)
    window.location.href = '/'
  }

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname.startsWith(path)) return true
    return false
  }

  return (
    <>
      {/* 데스크톱 네비게이션 */}
      <nav className="hidden md:block sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <HotStockLogo size="md" showText={true} />
              </Link>
            </div>

            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors ${isActive('/')
                    ? 'text-primary-400'
                    : 'text-gray-400 hover:text-white'
                  }`}
              >
                홈
              </Link>
              <Link
                href="/stocks"
                className={`text-sm font-medium transition-colors ${isActive('/stocks')
                    ? 'text-primary-400'
                    : 'text-gray-400 hover:text-white'
                  }`}
              >
                종목 토론방
              </Link>
              {user && (
                <Link
                  href="/watchlist/add"
                  className={`text-sm font-medium transition-colors ${isActive('/watchlist')
                      ? 'text-primary-400'
                      : 'text-gray-400 hover:text-white'
                    }`}
                >
                  관심종목
                </Link>
              )}

              <div className="h-4 w-px bg-gray-700 mx-2"></div>

              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800/50 rounded-full border border-gray-700/50">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-sm text-gray-200 font-medium">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/auth/login"
                    className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-500 transition-all shadow-lg shadow-primary-900/20"
                  >
                    회원가입
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 모바일 상단 헤더 */}
      <div className="md:hidden sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 transition-all">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link href="/">
            <HotStockLogo size="sm" showText={true} />
          </Link>
          {user && (
            <div className="flex items-center space-x-3">
              <span className="text-sm font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 모바일 하단 네비게이션 - 더 예쁘게 디자인 */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700 z-50">
        <div className="grid grid-cols-4 h-16 px-2">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 rounded-lg mx-1 my-2 ${isActive('/')
                ? 'text-primary-400 bg-primary-500/10 shadow-lg'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
              }`}
          >
            <div className={`p-1 rounded-full transition-all duration-200 ${isActive('/') ? 'bg-primary-500/20' : ''
              }`}>
              <Home className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium">홈</span>
          </Link>

          <Link
            href="/stocks"
            className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 rounded-lg mx-1 my-2 ${isActive('/stocks')
                ? 'text-primary-400 bg-primary-500/10 shadow-lg'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
              }`}
          >
            <div className={`p-1 rounded-full transition-all duration-200 ${isActive('/stocks') ? 'bg-primary-500/20' : ''
              }`}>
              <MessageSquare className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium">토론방</span>
          </Link>

          {user ? (
            <Link
              href="/watchlist/add"
              className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 rounded-lg mx-1 my-2 ${isActive('/watchlist')
                  ? 'text-primary-400 bg-primary-500/10 shadow-lg'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                }`}
            >
              <div className={`p-1 rounded-full transition-all duration-200 ${isActive('/watchlist') ? 'bg-primary-500/20' : ''
                }`}>
                <Heart className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">관심종목</span>
            </Link>
          ) : (
            <Link
              href="/auth/signup"
              className="flex flex-col items-center justify-center space-y-1 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 transition-all duration-200 rounded-lg mx-1 my-2"
            >
              <div className="p-1 rounded-full">
                <UserPlus className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">회원가입</span>
            </Link>
          )}

          {user ? (
            <div className="flex flex-col items-center justify-center space-y-1 text-gray-400 rounded-lg mx-1 my-2">
              <div className="p-1 rounded-full">
                <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                  <User className="h-3 w-3 text-white" />
                </div>
              </div>
              <span className="text-xs font-medium">내정보</span>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="flex flex-col items-center justify-center space-y-1 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 transition-all duration-200 rounded-lg mx-1 my-2"
            >
              <div className="p-1 rounded-full">
                <LogIn className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">로그인</span>
            </Link>
          )}
        </div>
      </div>

      {/* 모바일에서 하단 네비게이션 공간 확보 */}
      <div className="md:hidden h-16"></div>
    </>
  )
}