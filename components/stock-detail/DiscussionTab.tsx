'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { getPosts } from '@/app/actions/post'
import { Post, User } from '@/types'
import PostItem from '@/components/stock-detail/PostItem'
import PostForm from '@/components/stock-detail/PostForm'
import { AlignLeft, ThumbsUp, ChevronDown } from 'lucide-react'

interface DiscussionTabProps {
    symbol: string
    user: User | null
}

export default function DiscussionTab({ symbol, user }: DiscussionTabProps) {
    const searchParams = useSearchParams()
    const targetPostId = searchParams.get('postId')

    // Discussion State
    const [posts, setPosts] = useState<Post[]>([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(false)
    const [isLoadingPosts, setIsLoadingPosts] = useState(false)
    const [sortOption, setSortOption] = useState<'latest' | 'likes'>('latest')

    // Initial Fetch & Reset
    useEffect(() => {
        // Reset posts on symbol change
        setPosts([])
        setPage(1)
        fetchPosts(1, 'latest', true)
    }, [symbol])

    // Auto-scroll Effect
    useEffect(() => {
        if (targetPostId && posts.length > 0) {
            const element = document.getElementById(`post-${targetPostId}`)
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    element.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2', 'ring-offset-gray-900')
                    setTimeout(() => element.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2', 'ring-offset-gray-900'), 2000)
                }, 500)
            }
        }
    }, [targetPostId, posts])

    const fetchPosts = async (pageNum: number = 1, sort: 'latest' | 'likes' = sortOption, reset: boolean = false) => {
        setIsLoadingPosts(true)
        const result = await getPosts(symbol, pageNum, 10, sort)
        if (result.success && result.posts) {
            const newPosts = result.posts as any
            if (reset) {
                setPosts(newPosts)
            } else {
                setPosts(prev => [...prev, ...newPosts])
            }
            setHasMore(result.hasMore || false)
            setPage(pageNum)
        }
        setIsLoadingPosts(false)
    }

    const handleSortChange = (newSort: 'latest' | 'likes') => {
        if (newSort === sortOption) return
        setSortOption(newSort)
        setPage(1)
        fetchPosts(1, newSort, true)
    }

    const handleLoadMore = () => {
        if (!isLoadingPosts && hasMore) {
            fetchPosts(page + 1, sortOption, false)
        }
    }

    return (
        <div className="relative">
            <PostForm
                user={user}
                symbol={symbol}
                onRefresh={() => fetchPosts(1, sortOption, true)}
                className="mb-8"
            />

            {/* Sort Controls */}
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-white font-bold text-lg">토론방</h3>
                <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                    <button
                        onClick={() => handleSortChange('latest')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${sortOption === 'latest' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <AlignLeft className="w-3 h-3" /> 최신순
                    </button>
                    <button
                        onClick={() => handleSortChange('likes')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${sortOption === 'likes' ? 'bg-red-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <ThumbsUp className="w-3 h-3" /> 좋아요순
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {posts.map((post) => (
                    <div id={`post-${post.id}`} key={post.id} className="transition-all duration-500 rounded-3xl">
                        <PostItem
                            post={post}
                            user={user}
                            onRefresh={() => fetchPosts(page, sortOption, true)}
                        />
                    </div>
                ))}

                {posts.length === 0 && !isLoadingPosts && (
                    <div className="text-center py-10 text-gray-500 bg-white/5 rounded-3xl border border-white/5">
                        <p>아직 게시글이 없습니다.</p>
                        <p className="text-sm mt-1">첫 번째 의견을 남겨보세요!</p>
                    </div>
                )}

                {hasMore && (
                    <button
                        onClick={handleLoadMore}
                        disabled={isLoadingPosts}
                        className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-blue-400 font-bold border border-white/5 hover:border-white/20 transition-all flex items-center justify-center gap-2"
                    >
                        {isLoadingPosts ? (
                            <span className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <ChevronDown className="w-4 h-4" />
                                더 보기
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}
