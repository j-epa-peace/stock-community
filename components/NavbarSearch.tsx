'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function NavbarSearch() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length > 0) {
                setLoading(true)
                try {
                    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
                    const data = await res.json()
                    setResults(data.results || [])
                    setIsOpen(true)
                } catch (e) {
                    console.error(e)
                } finally {
                    setLoading(false)
                }
            } else {
                setResults([])
                setIsOpen(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    const handleSelect = (symbol: string) => {
        router.push(`/stocks/${symbol}`)
        setQuery('')
        setIsOpen(false)
    }

    return (
        <div className="relative" ref={containerRef}>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="종목명 또는 심볼 검색 (예: 삼성전자, 005930)"
                    className="bg-white/5 border border-white/10 text-white text-sm rounded-full block w-full pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 transition-all w-[180px] md:w-[240px] focus:w-[280px]"
                />
                {query && (
                    <button
                        onClick={() => { setQuery(''); setIsOpen(false); }}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                        <X className="h-4 w-4 text-gray-400 hover:text-white" />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isOpen && (results.length > 0 || loading) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full mt-2 w-[300px] bg-[#1a1b26] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 right-0 md:right-auto md:left-0"
                    >
                        {loading ? (
                            <div className="p-4 text-center text-gray-400 text-xs">Looking up...</div>
                        ) : (
                            <ul>
                                {results.length > 0 ? (
                                    results.map((stock) => (
                                        <li key={stock.symbol}>
                                            <button
                                                onClick={() => handleSelect(stock.symbol)}
                                                className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center justify-between group transition-colors"
                                            >
                                                <div>
                                                    <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{stock.name}</div>
                                                    <div className="text-xs text-gray-400">{stock.symbol} | {stock.market}</div>
                                                </div>
                                                <div className={`text-xs font-bold ${stock.changePercent >= 0 ? 'text-red-400' : 'text-blue-400'}`}>
                                                    {stock.changePercent > 0 ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                                                </div>
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <li className="p-4 text-center text-gray-500 text-xs">No matches found</li>
                                )}
                            </ul>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
