'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MessageCircle, Heart, User, LogOut, LogIn, UserPlus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import HotStockLogo from './HotStockLogo'
import NavbarSearch from './NavbarSearch'

export default function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const handleLogout = async () => {
    await logout()
  }

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname.startsWith(path)) return true
    return false
  }

  return (
    <>
      {/* 데스크톱 네비게이션 */}
      <nav className="hidden md:block sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
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
                className={`text-sm font-bold transition-all duration-300 ${isActive('/')
                  ? 'text-white drop-shadow-glow-white scale-105'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                홈
              </Link>
              <Link
                href="/stocks"
                className={`text-sm font-bold transition-all duration-300 ${isActive('/stocks')
                  ? 'text-white drop-shadow-glow-white scale-105'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                종목 토론방
              </Link>
              {user && (
                <Link
                  href="/watchlist/add"
                  className={`text-sm font-bold transition-all duration-300 ${isActive('/watchlist')
                    ? 'text-white drop-shadow-glow-white scale-105'
                    : 'text-gray-400 hover:text-white'
                    }`}
                >
                </Link>
              )}

              <NavbarSearch />

              <div className="h-4 w-px bg-gray-700 mx-2"></div>

              {user ? (
                <div className="flex items-center space-x-4">
                  <Link href="/profile" className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white uppercase border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-sm text-gray-200 font-medium">{user.name}</span>
                  </Link>
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
                    className="bg-white/5 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/15 transition-all border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
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
              <Link href="/profile" className="text-sm font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                {user.name}
              </Link>
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

      {/* 모바일 하단 네비게이션 - Framer Motion 적용 */}
      {/* Ultra Glass Style: Transparent background with Heavy Blur, Attached to Bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#020617]/80 backdrop-blur-xl border-t border-white/10 z-50 flex items-center justify-around px-2 pb-safe">
        {[
          { href: '/', icon: Home, label: '홈' },
          { href: '/stocks', icon: MessageCircle, label: '토론방' },
          ...(user
            ? [
              { href: '/watchlist/add', icon: Heart, label: '관심종목' },
              { href: '/profile', icon: User, label: '내정보' }
            ]
            : [
              { href: '/auth/signup', icon: UserPlus, label: '회원가입' },
              { href: '/auth/login', icon: LogIn, label: '로그인' }
            ]
          )
        ].map((item) => {
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center relative w-12 h-12"
            >
              <div className="relative z-10 p-2">
                <motion.div
                  animate={active ? {
                    scale: 1.15,
                    filter: "drop-shadow(0 0 8px rgba(255,255,255,0.6))"
                  } : {
                    scale: 1,
                    filter: "drop-shadow(0 0 0px rgba(0,0,0,0))"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <item.icon
                    className={`h-7 w-7 transition-colors duration-300 ${active
                      ? 'text-white stroke-[2.5px]'
                      : 'text-gray-500 group-hover:text-gray-300 stroke-2'
                      }`}
                  />
                </motion.div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* 모바일에서 하단 네비게이션 공간 확보 */}
      <div className="md:hidden h-16"></div>
    </>
  )
}