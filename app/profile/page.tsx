'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { User, Settings, Clock, Star, Newspaper, LogOut } from 'lucide-react'
import ReputationGuide from '@/components/profile/ReputationGuide'
import MyActivityTab from '@/components/profile/MyActivityTab'
import MyStocksTab from '@/components/profile/MyStocksTab'
import MyNewsTab from '@/components/profile/MyNewsTab'

export default function ProfilePage() {
    const { user, loading, logout } = useAuth()
    const router = useRouter()

    const [activeTab, setActiveTab] = useState<'activity' | 'stocks' | 'news'>('stocks')
    const [showGuide, setShowGuide] = useState(false)

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/login')
        }
    }, [user, loading, router])

    if (loading || !user) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
    }

    // Determine current grade
    const getGrade = (rep: number) => {
        if (rep > 1000) return { title: '레전드', color: 'text-red-500' }
        if (rep > 200) return { title: '마스터', color: 'text-purple-400' }
        if (rep > 50) return { title: '프로', color: 'text-yellow-400' }
        if (rep > 10) return { title: '주니어', color: 'text-blue-400' }
        return { title: '입문자', color: 'text-gray-400' }
    }

    const grade = getGrade(user.reputation || 0)

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
            <ReputationGuide
                isOpen={showGuide}
                onClose={() => setShowGuide(false)}
                currentReputation={user.reputation || 0}
            />

            {/* Profile Header */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 z-10">
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        로그아웃
                    </button>
                </div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl ring-4 ring-white/5">
                        {user.name[0]}
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                            <span className={`px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-bold ${grade.color}`}>
                                {grade.title}
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">{user.email}</p>

                        <div className="flex items-center justify-center md:justify-start gap-6">
                            <div
                                onClick={() => setShowGuide(true)}
                                className="cursor-pointer group flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-all border border-white/5 hover:border-white/20"
                            >
                                <div className="text-left">
                                    <p className="text-[10px] text-gray-500 font-medium group-hover:text-gray-400">활동 점수</p>
                                    <p className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{user.reputation || 0}점</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                    <Star className="w-4 h-4 fill-current" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-50 blur-3xl -z-0" />
            </div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto gap-4 mb-8 pb-2 hide-scrollbar">
                {[
                    { id: 'stocks', label: '관심 & 최근 종목', icon: Star },
                    { id: 'activity', label: '내 활동', icon: Clock },
                    { id: 'news', label: '맞춤형 뉴스', icon: Newspaper },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-white text-black shadow-glow-white scale-105'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content Area */}
            <div className="min-h-[400px]">
                {activeTab === 'stocks' && <MyStocksTab />}
                {activeTab === 'activity' && <MyActivityTab />}
                {activeTab === 'news' && <MyNewsTab />}
            </div>
        </div>
    )
}
