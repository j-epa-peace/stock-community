'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getUserActivity } from '@/app/actions/post'
import { MessageCircle, FileText, Calendar } from 'lucide-react'

export default function MyActivityTab() {
    const [activity, setActivity] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchActivity = async () => {
            const result = await getUserActivity()
            if (result.success && result.activity) {
                setActivity(result.activity)
            }
            setLoading(false)
        }
        fetchActivity()
    }, [])

    if (loading) return <div className="text-center py-20 text-gray-500">로딩 중...</div>

    if (activity.length === 0) {
        return (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                <p className="text-gray-400 mb-2">아직 활동 내역이 없습니다</p>
                <Link href="/stocks" className="text-blue-400 hover:text-blue-300 text-sm font-bold">
                    토론방 구경가기
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {activity.map((item) => (
                <Link
                    href={item.type === 'post'
                        ? `/stocks/${item.stock.symbol}`
                        : `/stocks/${item.post.stock.symbol}`}
                    key={`${item.type}-${item.id}`}
                    className="block group"
                >
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:border-white/20">
                        <div className="flex items-center gap-2 mb-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.type === 'post'
                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                    : 'bg-green-500/10 text-green-400 border-green-500/20'
                                }`}>
                                {item.type === 'post' ? '게시글' : '댓글'}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-gray-400 font-medium ml-auto">
                                {item.type === 'post' ? item.stock.name : item.post.stock.name}
                            </span>
                        </div>

                        {item.type === 'post' ? (
                            <>
                                <h3 className="font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-400 line-clamp-2">{item.content}</p>
                            </>
                        ) : (
                            <>
                                <p className="text-sm text-gray-300 mb-2">
                                    "{item.content}"
                                </p>
                                <div className="text-xs text-gray-500 pl-3 border-l-2 border-white/10">
                                    원글: {item.post.title}
                                </div>
                            </>
                        )}
                    </div>
                </Link>
            ))}
        </div>
    )
}
