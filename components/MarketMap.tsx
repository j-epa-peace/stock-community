'use client'

import { useState, useEffect } from 'react'
import { Treemap, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import { Maximize2, Minimize2, Globe, Building2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

const COLORS = {
    up: '#ef4444',   // Red 500
    down: '#3b82f6', // Blue 500
    flat: '#1f2937', // Gray 800 (Very Dark for background blend)
};

const getColor = (change: number) => {
    if (change > 0) return COLORS.up;
    if (change < 0) return COLORS.down;
    return COLORS.flat;
};

export default function MarketMap() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [marketType, setMarketType] = useState<'domestic' | 'global'>('domestic');
    const [mapData, setMapData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/market-map?type=${marketType}`);
                const json = await res.json();
                if (json.success) {
                    setMapData(json.data);
                }
            } catch (error) {
                console.error('Failed to fetch market map:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        // Refresh every 1 minute
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, [marketType]);

    const handleNodeClick = (data: any) => {
        if (data.symbol) {
            router.push(`/stocks/${data.symbol}`);
        }
    };

    const CustomizedContent = (props: any) => {
        const { root, depth, x, y, width, height, index, payload, colors, rank, name, change, symbol } = props;

        // Depth 1: Sector (Category)
        // Depth 2: Stock (Item)

        if (depth === 1) {
            // Sector Label
            return (
                <g>
                    <text
                        x={x + 4}
                        y={y + 14}
                        textAnchor="start"
                        fill="#fff"
                        fontSize={12}
                        fontWeight="bold"
                        className="pointer-events-none opacity-40 drop-shadow-glow-white"
                    >
                        {name}
                    </text>
                </g>
            )
        }

        if (depth === 2) {
            // Stock Box
            const fillColor = getColor(change);
            const fontSize = Math.min(width / 5, 14);
            const percentFontSize = Math.min(width / 6, 12);

            // Calculate opacity based on magnitude of change (0.3 to 1.0)
            // Cap at 5% change for max opacity
            const opacity = change === 0 ? 1 : Math.min(Math.abs(change) / 3 + 0.3, 0.9);

            return (
                <g onClick={() => handleNodeClick(props)}>
                    <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        style={{
                            fill: fillColor,
                            fillOpacity: opacity,
                            stroke: 'rgba(0,0,0,0.5)', // slightly transparent black stroke
                            strokeWidth: 1,
                            cursor: 'pointer',
                            transition: 'opacity 0.2s',
                        }}
                        className="hover:brightness-125 transition-all duration-300"
                    />
                    <text
                        x={x + width / 2}
                        y={y + height / 2 - 2}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize={fontSize}
                        fontWeight="bold"
                        style={{ pointerEvents: 'none' }}
                        className="drop-shadow-[0_0_4px_rgba(0,0,0,0.8)]"
                    >
                        {name}
                    </text>
                    <text
                        x={x + width / 2}
                        y={y + height / 2 + 14}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize={percentFontSize}
                        style={{ pointerEvents: 'none' }}
                        className="drop-shadow-[0_0_4px_rgba(0,0,0,0.8)] opacity-90"
                    >
                        {change > 0 ? '+' : ''}{change}%
                    </text>
                </g>
            );
        }

        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`bg-black/40 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/10 mb-8 overflow-hidden transition-all duration-500 flex flex-col
        ${isExpanded ? 'fixed inset-4 z-50 h-auto' : 'relative h-[500px]'}`}
        >
            <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                        마켓 맵
                    </h2>

                    <div className="flex bg-black/40 rounded-lg p-1 ml-4">
                        <button
                            onClick={() => setMarketType('domestic')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold transition-all ${marketType === 'domestic'
                                ? 'bg-gray-700 text-white shadow-lg'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Building2 className="w-3.5 h-3.5" /> 국내
                        </button>
                        <button
                            onClick={() => setMarketType('global')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold transition-all ${marketType === 'global'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Globe className="w-3.5 h-3.5" /> 해외
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                >
                    {isExpanded ? <Minimize2 /> : <Maximize2 />}
                </button>
            </div>

            <div className="w-full flex-1 p-4 min-h-0 bg-gray-900/50">
                {isLoading ? (
                    <div className="flex h-full items-center justify-center text-gray-400 gap-2">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        데이터 불러오는 중...
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <Treemap
                            width={400}
                            height={200}
                            data={mapData}
                            dataKey="size"
                            stroke="transparent"
                            fill="#1f2937"
                            content={<CustomizedContent />}
                        >
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        // Only show tooltip for stock nodes (depth 2)
                                        if (!data.change) return null;

                                        return (
                                            <div className="bg-gray-900/95 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-xl z-50">
                                                <p className="text-gray-400 text-xs mb-1">{data.parent?.name || data.category}</p>
                                                <p className="font-bold text-white text-lg flex items-center gap-2">
                                                    {data.name}
                                                    {data.symbol && <span className="text-xs text-gray-500 font-normal">({data.symbol})</span>}
                                                </p>
                                                <div className={`mt-2 font-bold text-lg ${data.change > 0 ? 'text-red-400' : 'text-blue-400'}`}>
                                                    {data.change > 0 ? '▲' : '▼'} {Math.abs(data.change)}%
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">시가총액: {(data.size / 100000000).toFixed(0)}억</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </Treemap>
                    </ResponsiveContainer>
                )}
            </div>

            {isExpanded && (
                <div className="absolute bottom-6 right-6 text-xs text-gray-500 pointer-events-none">
                    * Powered by Shinhan AI Analytics (Real-time Data)
                </div>
            )}
        </motion.div>
    )
}
