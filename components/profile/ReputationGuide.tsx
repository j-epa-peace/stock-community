'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, Star, Shield, Crown } from 'lucide-react'

interface ReputationGuideProps {
    isOpen: boolean
    onClose: () => void
    currentReputation: number
}

const GRADES = [
    { min: 0, max: 10, title: '입문자', icon: Star, color: 'text-gray-400', bg: 'bg-gray-400/10' },
    { min: 11, max: 50, title: '주니어', icon: Shield, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { min: 51, max: 200, title: '프로', icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { min: 201, max: 1000, title: '마스터', icon: Crown, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { min: 1001, max: 999999, title: '레전드', icon: Crown, color: 'text-red-500', bg: 'bg-red-500/10' },
]

export default function ReputationGuide({ isOpen, onClose, currentReputation }: ReputationGuideProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#1a1b1e] border border-white/10 w-full max-w-md rounded-3xl overflow-hidden pointer-events-auto shadow-2xl"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-yellow-400" />
                                    활동 등급 가이드
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                <div className="text-center mb-6">
                                    <p className="text-gray-400 text-sm mb-2">현재 나의 활동 점수</p>
                                    <div className="text-4xl font-bold text-white mb-1">{currentReputation}</div>
                                    <p className="text-xs text-gray-500">게시글 작성 +5 / 댓글 작성 +2 / 좋아요 받음 +1</p>
                                </div>

                                <div className="space-y-3">
                                    {GRADES.map((grade) => {
                                        const isCurrent = currentReputation >= grade.min && currentReputation <= grade.max
                                        const Icon = grade.icon

                                        return (
                                            <div
                                                key={grade.title}
                                                className={`flex items-center gap-4 p-4 rounded-2xl border ${isCurrent
                                                    ? 'bg-white/10 border-white/20 ring-1 ring-white/20'
                                                    : 'bg-white/5 border-transparent opacity-60'
                                                    }`}
                                            >
                                                <div className={`p-3 rounded-full ${grade.bg} ${grade.color}`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className={`font-bold ${grade.color}`}>{grade.title}</h3>
                                                    <p className="text-xs text-gray-400">{grade.min} ~ {grade.max === 999999 ? '∞' : grade.max} 점</p>
                                                </div>
                                                {isCurrent && (
                                                    <div className="px-3 py-1 bg-white text-black text-xs font-bold rounded-full">
                                                        현재 등급
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}
