'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface Stock {
    symbol: string
    name: string
    price: number
    change: number
    changePercent: number
}

interface StockListGroup {
    id: string
    title: string
    description: string
    stocks: Stock[]
}

interface StockListClientProps {
    groups: StockListGroup[]
}

export default function StockListClient({ groups }: StockListClientProps) {
    const [activeTab, setActiveTab] = useState(groups[0].id)

    return (
        <div>
            {/* Mobile Tabs */}
            <div className="lg:hidden flex space-x-2 mb-6 p-1 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                {groups.map((group) => (
                    <button
                        key={group.id}
                        onClick={() => setActiveTab(group.id)}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 relative ${activeTab === group.id ? "text-white" : "text-gray-400 hover:text-gray-200"
                            }`}
                    >
                        {activeTab === group.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-white/10 rounded-lg shadow-sm"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">{group.title}</span>
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-8">
                {/* Desktop View (Grid) */}
                {groups.map((group) => (
                    <StockListCard key={group.id} group={group} />
                ))}
            </div>

            <div className="lg:hidden">
                {/* Mobile View (Tabbed) */}
                <AnimatePresence mode="wait">
                    {groups.map((group) => (
                        activeTab === group.id ? (
                            <motion.div
                                key={group.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <StockListCard group={group} />
                            </motion.div>
                        ) : null
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
}

function StockListCard({ group }: { group: StockListGroup }) {
    return (
        <div className="bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-glass overflow-hidden h-full">
            <div className="p-6 border-b border-white/10 bg-white/5">
                <h2 className="text-2xl font-bold text-white mb-1">{group.title}</h2>
                <p className="text-gray-400 text-sm">{group.description}</p>
            </div>
            <div className="p-4">
                <div className="space-y-1 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {group.stocks.map((stock, index) => (
                        <Link
                            key={stock.symbol}
                            href={`/stocks/${stock.symbol}`}
                            className="block p-3 rounded-xl hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-white/5 group"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-xs font-medium text-gray-500 w-6 group-hover:text-white/50 transition-colors">#{index + 1}</span>
                                        <span className="font-bold text-white tracking-tight">{stock.name}</span>
                                    </div>
                                    <span className="text-xs text-gray-500 ml-9">{stock.symbol}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-white font-medium tracking-tight">
                                        {group.id === 'sp500' || group.id === 'nasdaq'
                                            ? `$${stock.price.toFixed(2)}`
                                            : `${Math.round(stock.price).toLocaleString()}원`}
                                    </div>
                                    <div className={`text-xs font-semibold ${stock.change >= 0 ? 'text-red-400' : 'text-blue-400'
                                        }`}>
                                        {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.changePercent).toFixed(2)}%
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
