'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signup } from '@/app/actions/auth'
import toast from 'react-hot-toast'
import { ArrowRight, Mail, Lock, User } from 'lucide-react'

export default function SignupPage() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    try {
      const result = await signup(formData)
      if (result?.error) {
        toast.error(result.error)
      } else if (result?.success) {
        toast.success('회원가입이 완료되었습니다!')
        setTimeout(() => {
          window.location.href = '/'
        }, 1500) // 1.5초 후 리다이렉션
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black text-white relative overflow-hidden">
      {/* Background Gradient matching main layout */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#111827_0%,_#000000_100%)] pointer-events-none" />

      {/* Background Effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="max-w-md w-full relative z-10 glass-effect p-8 rounded-2xl border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">
            계정 만들기
          </h2>
          <p className="text-gray-400 text-sm">
            투자 커뮤니티의 일원이 되어보세요
          </p>
        </div>

        <form className="space-y-6" action={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="id" className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider">
                아이디
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input
                  id="id"
                  name="id"
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all hover:bg-white/10"
                  placeholder="아이디를 입력하세요"
                />
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider">
                이름
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all hover:bg-white/10"
                  placeholder="이름을 입력하세요"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider">
                이메일 (선택)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all hover:bg-white/10"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider">
                비밀번호
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all hover:bg-white/10"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group w-full flex items-center justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 transition-all shadow-lg shadow-blue-500/25 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center">
              {loading ? '계정 생성 중...' : '회원가입'}
              {!loading && <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />}
            </span>
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          이미 계정이 있으신가요?{' '}
          <Link href="/auth/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
            로그인하기
          </Link>
        </p>
      </div>
    </div>
  )
}