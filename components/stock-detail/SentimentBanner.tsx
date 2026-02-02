'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users } from 'lucide-react'

interface VoteStats {
    bullish: number
    bearish: number
    total: number
    bullishPercent: number
    bearishPercent: number
}

export default function SentimentBanner({ symbol }: { symbol: string }) {
    const [stats, setStats] = useState<VoteStats | null>(null)
    const [userVote, setUserVote] = useState<'BULLISH' | 'BEARISH' | null>(null)
    const [loading, setLoading] = useState(true)
    const [voting, setVoting] = useState(false)

    useEffect(() => {
        fetchStats()
    }, [symbol])

    const fetchStats = async () => {
        try {
            const res = await fetch(`/api/stocks/${symbol}/vote`)
            const data = await res.json()
            if (data.success) {
                setStats(data.stats)
                setUserVote(data.userVote)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const handleVote = async (type: 'BULLISH' | 'BEARISH') => {
        if (voting) return // Prevent spam

        // Save previous state for rollback
        const previousVote = userVote
        // Optimistic Update
        setUserVote(type)
        setVoting(true)

        try {
            const res = await fetch(`/api/stocks/${symbol}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type })
            })
            const data = await res.json()
            if (data.success) {
                // Refetch stats to get accurate counts
                fetchStats()
            } else {
                // Revert
                setUserVote(previousVote)
                alert('투표에 실패했습니다.')
            }
        } catch (e) {
            console.error(e)
            setUserVote(previousVote)
        } finally {
            setVoting(false)
        }
    }

    if (loading) return <div className="h-24 bg-white/5 rounded-2xl animate-pulse mb-8" />

    // UI Logic: Prevent 100% width from blocking the other option
    // Minimum visual width 15%
    let displayBullish = 50
    let displayBearish = 50

    if (stats && stats.total > 0) {
        displayBullish = Math.max(15, Math.min(85, stats.bullishPercent))
        displayBearish = 100 - displayBullish
    }

    return (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 relative overflow-hidden">
            {/* Background Gradient Glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-red-500/5 via-transparent to-blue-500/5 pointer-events-none" />

            <div className="relative z-10">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-gray-400" />
                            오늘의 투자 심리
                        </h3>
                        {stats && (
                            <p className="text-xs text-gray-500 mt-1">
                                지난 24시간: {stats.total.toLocaleString()}명 참여
                            </p>
                        )}
                    </div>
                </div>

                {/* Vote Buttons / Bar Area */}
                <div className="relative h-14 bg-gray-800/50 rounded-xl flex overflow-hidden border border-white/5">
                    {/* Bullish Bar */}
                    <motion.div
                        initial={{ width: '50%' }}
                        animate={{ width: `${displayBullish}%` }}
                        transition={{ type: 'spring', stiffness: 60 }}
                        className="h-full bg-gradient-to-r from-red-600 to-red-500 relative group cursor-pointer"
                        onClick={() => handleVote('BULLISH')}
                    >
                        <div className="absolute inset-0 flex items-center justify-start px-4 gap-2">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-lg shadow-sm transition-all ${userVote === 'BULLISH' ? 'bg-white scale-110' : 'bg-white/20 grayscale group-hover:grayscale-0'}`}>
                                <motion.span
                                    animate={userVote === 'BULLISH' ? { y: [0, -5, 0], rotate: [0, -5, 5, 0] } : { y: 0, rotate: 0 }}
                                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                                    className="inline-block"
                                >
                                    🚀
                                </motion.span>
                            </div>
                            <div className="flex flex-col overflow-hidden whitespace-nowrap">
                                <span className={`text-xs md:text-sm font-bold text-white transition-opacity ${userVote === 'BULLISH' ? 'opacity-100' : 'opacity-80'}`}>
                                    오를 것 같아요
                                </span>
                                {stats && stats.total > 0 && (
                                    <span className="text-xs text-white/80 font-mono">{stats.bullishPercent}%</span>
                                )}
                            </div>
                        </div>
                        {userVote === 'BULLISH' && (
                            <motion.div layoutId="vote-highlight" className="absolute inset-0 border-2 border-white rounded-l-xl z-20 pointer-events-none" />
                        )}
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>

                    {/* Divider */}
                    <div className="w-0.5 bg-black/20 z-10" />

                    {/* Bearish Bar */}
                    <motion.div
                        initial={{ width: '50%' }}
                        animate={{ width: `${displayBearish}%` }}
                        transition={{ type: 'spring', stiffness: 60 }}
                        className="h-full bg-gradient-to-l from-blue-600 to-blue-500 relative group cursor-pointer"
                        onClick={() => handleVote('BEARISH')}
                    >
                        {/* Content aligned to right */}
                        <div className="absolute inset-0 flex items-center justify-end px-4 gap-2">
                            <div className="flex flex-col items-end overflow-hidden whitespace-nowrap">
                                <span className={`text-xs md:text-sm font-bold text-white transition-opacity ${userVote === 'BEARISH' ? 'opacity-100' : 'opacity-80'}`}>
                                    내릴 것 같아요
                                </span>
                                {stats && stats.total > 0 && (
                                    <span className="text-xs text-white/80 font-mono">{stats.bearishPercent}%</span>
                                )}
                            </div>
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-lg shadow-sm transition-all ${userVote === 'BEARISH' ? 'bg-white scale-110' : 'bg-white/20 grayscale group-hover:grayscale-0'}`}>
                                <motion.span
                                    animate={userVote === 'BEARISH' ? { y: [0, 5, 0], scaleY: [1, 1.1, 1] } : { y: 0, scaleY: 1 }}
                                    transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut" }}
                                    className="inline-block"
                                >
                                    💧
                                </motion.span>
                            </div>
                        </div>
                        {userVote === 'BEARISH' && (
                            <motion.div layoutId="vote-highlight" className="absolute inset-0 border-2 border-white rounded-r-xl z-20 pointer-events-none" />
                        )}
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                </div>

                {stats && stats.total === 0 && (
                    <p className="text-center text-xs text-gray-500 mt-2">
                        어떻게 될까요? 첫 번째로 투표해보세요!
                    </p>
                )}
            </div>
        </div>
    )
}
