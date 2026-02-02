'use client'

import { useState, useEffect } from 'react'
import { Sparkles, TrendingUp, TrendingDown, AlertCircle, Bot } from 'lucide-react'
import { motion } from 'framer-motion'
import { Stock } from '@/types'

// Mock AI Logic
const generateInsight = (stock: Stock) => {
    const isUp = stock.changePercent > 0;
    const absChange = Math.abs(stock.changePercent);

    let summary = "";
    let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    let keywords = [];

    if (stock.changePercent > 3) {
        summary = `${stock.name}은(는) 오늘 강한 매수세가 유입되며 섹터 평균을 상회하는 상승 흐름을 보이고 있습니다. 거래량 급증은 기관 및 외국인의 매수 참여를 시사하며, 기술적으로 주요 저항선을 돌파할 가능성이 높습니다.`;
        sentiment = 'bullish';
        keywords = ['#강력매수', '#신고가갱신', '#거래량급증'];
    } else if (stock.changePercent > 0) {
        summary = `${stock.name}은(는) 안정적인 상승 흐름을 유지하며 약세장 속에서도 견고한 모습을 보입니다. 실적 기대감이 유효하며, 단기 지지선이 굳건하여 추가 상승 여력이 충분합니다.`;
        sentiment = 'bullish';
        keywords = ['#견고한흐름', '#실적기대', '#매집신호'];
    } else if (stock.changePercent > -3) {
        summary = `${stock.name}은(는) 최근 상승에 따른 차익 실현 매물로 인해 소폭 조정을 받고 있습니다. 기업 펀더멘털은 여전히 견고하며, 장기 투자자에게는 매수 기회가 될 수 있는 건전한 조정으로 분석됩니다.`;
        sentiment = 'neutral';
        keywords = ['#건전한조정', '#저점매수기회', '#눌림목'];
    } else {
        summary = `${stock.name}은(는) 오늘 시장 전반의 약세 또는 개별 악재로 인해 강한 매도 압력을 받고 있습니다. 주요 지지선 이탈 여부를 주의 깊게 관찰해야 하며, 단기적으로는 보수적인 접근이 필요합니다.`;
        sentiment = 'bearish';
        keywords = ['#약세주의', '#관망필요', '#지지선이탈'];
    }

    return { summary, sentiment, keywords };
}

export default function AiInsightCard({ stock }: { stock: Stock }) {
    const [insight, setInsight] = useState<{ summary: string, sentiment: string, keywords: string[] } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate AI Generation Delay
        const timer = setTimeout(() => {
            setInsight(generateInsight(stock));
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, [stock]);

    return (
        <div className="relative bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-black/40 backdrop-blur-xl rounded-3xl p-6 border border-indigo-500/30 shadow-[0_0_30px_rgba(79,70,229,0.15)] overflow-hidden">

            {/* Background Animated Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full animate-pulse pointer-events-none" />

            {/* Header */}
            <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                    <Bot className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">AI Analyst Insight</h3>
                {loading && (
                    <span className="text-xs font-mono text-indigo-300 animate-pulse ml-auto flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        분석 중...
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-[120px]">
                {loading ? (
                    <div className="space-y-3 animate-pulse">
                        <div className="h-4 bg-indigo-500/10 rounded w-full"></div>
                        <div className="h-4 bg-indigo-500/10 rounded w-5/6"></div>
                        <div className="h-4 bg-indigo-500/10 rounded w-4/6"></div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-start gap-3 mb-4">
                            {insight?.sentiment === 'bullish' && <TrendingUp className="w-5 h-5 text-red-400 mt-1 shrink-0" />}
                            {insight?.sentiment === 'bearish' && <TrendingDown className="w-5 h-5 text-blue-400 mt-1 shrink-0" />}
                            {insight?.sentiment === 'neutral' && <AlertCircle className="w-5 h-5 text-gray-400 mt-1 shrink-0" />}

                            <p className="text-gray-200 leading-relaxed text-sm md:text-base break-keep">
                                {insight?.summary}
                            </p>
                        </div>

                        {/* Keywords */}
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
                            {insight?.keywords.map((kw, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors cursor-default"
                                >
                                    {kw}
                                </span>
                            ))}
                            <span className="ml-auto text-[10px] text-gray-500 self-center">방금 업데이트됨</span>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
