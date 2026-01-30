'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { Heart, MessageCircle, Send, MoreVertical, Trash2, Edit, ChevronDown, ChevronUp } from 'lucide-react'
import { createPost, getPosts, toggleLike, deletePost, updatePost } from '@/app/actions/post'
import { createComment, getComments, deleteComment, updateComment } from '@/app/actions/comment'
import toast from 'react-hot-toast'

type Stock = {
  symbol: string
  name: string
  market: string
  price: number
  change: number
  changePercent: number
}

type User = {
  id: string
  name: string
  email: string
}

type Comment = {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string
  }
}

type Post = {
  id: string
  title: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string
  }
  likes: number
  comments: Comment[]
  isLiked: boolean
}

const isUsdMarket = (market: string) => market === 'SP500' || market === 'NASDAQ'

// Helper for relative time
function timeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return '방금 전'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}일 전`
  return date.toLocaleDateString('ko-KR')
}

export default function StockDetailClient({ symbol, stock }: { symbol: string; stock: Stock }) {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState({ title: '', content: '' })
  const [user, setUser] = useState<User | null>(null)

  // Chart State
  const [chartData, setChartData] = useState<any[]>([])
  const [timeRange, setTimeRange] = useState('1d')
  const [isLoadingChart, setIsLoadingChart] = useState(true)

  // Comment Visibility State (Set of post IDs linked to opened comments)
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())

  // States for editing/deleting
  const [editingPost, setEditingPost] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ title: '', content: '' })
  const [newComment, setNewComment] = useState<Record<string, string>>({})
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editCommentForm, setEditCommentForm] = useState('')

  const usd = isUsdMarket(stock.market)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user)
      })
      .catch(() => { })

    fetchPosts()
    fetchStockChart('1d')
  }, [symbol])

  const fetchStockChart = async (range: string) => {
    setIsLoadingChart(true)
    setTimeRange(range)
    try {
      // mapping range to interval
      let interval = '5m'
      if (range === '1d') interval = '5m'
      else if (range === '1w') interval = '1h'
      else if (range === '1mo') interval = '1d'
      else if (range === '1y') interval = '1wk'

      const res = await fetch(`/api/stocks/${symbol}/chart?range=${range}&interval=${interval}&market=${stock.market}`)
      const data = await res.json()
      if (data.success) {
        setChartData(data.data)
      }
    } catch (error) {
      console.error('Failed to load chart', error)
      toast.error('차트 데이터를 불러오는데 실패했습니다.')
    } finally {
      setIsLoadingChart(false)
    }
  }

  const fetchPosts = async () => {
    const result = await getPosts(symbol)
    if (result.success && result.posts) {
      // Sort posts by createdAt desc (Newest first)
      const sorted = (result.posts as any).sort((a: Post, b: Post) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setPosts(sorted)
    }
  }

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => {
      const next = new Set(prev)
      if (next.has(postId)) next.delete(postId)
      else next.add(postId)
      return next
    })
  }

  const handleLike = async (postId: string) => {
    const result = await toggleLike(postId)
    if (result.success) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked } : post
        )
      )
    } else {
      toast.error(result.error || '오류가 발생했습니다')
    }
  }

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newPost.title.trim() || !newPost.content.trim()) return

    const result = await createPost({
      title: newPost.title,
      content: newPost.content,
      stockSymbol: stock.symbol,
      stockName: stock.name,
      market: stock.market,
      price: stock.price,
      change: stock.change,
      changePercent: stock.changePercent
    })

    if (result.success && result.post) {
      toast.success('게시글이 작성되었습니다')
      setNewPost({ title: '', content: '' })
      fetchPosts()
    } else {
      toast.error(result.error || '게시글 작성 실패')
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    const result = await deletePost(postId)
    if (result.success) {
      toast.success('게시글이 삭제되었습니다')
      setPosts(prev => prev.filter(p => p.id !== postId))
    } else {
      toast.error(result.error || '삭제 실패')
    }
  }

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPost) return
    const result = await updatePost(editingPost, editForm)
    if (result.success) {
      toast.success('게시글이 수정되었습니다')
      setEditingPost(null)
      fetchPosts()
    } else {
      toast.error(result.error || '수정 실패')
    }
  }

  const startEditPost = (post: Post) => {
    setEditingPost(post.id)
    setEditForm({ title: post.title, content: post.content })
  }

  const handleSubmitComment = async (e: React.FormEvent, postId: string) => {
    e.preventDefault()
    const content = newComment[postId]
    if (!content?.trim()) return
    const result = await createComment({ postId, content })
    if (result.success && result.comment) {
      toast.success('댓글이 작성되었습니다')
      setNewComment(prev => ({ ...prev, [postId]: '' }))
      fetchPosts()
      // Auto-expand comments when adding a new one
      setExpandedComments(prev => new Set(prev).add(postId))
    } else {
      toast.error(result.error || '댓글 작성 실패')
    }
  }

  const handleDeleteComment = async (commentId: string, postId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    const result = await deleteComment(commentId)
    if (result.success) {
      toast.success('댓글이 삭제되었습니다')
      fetchPosts()
    } else {
      toast.error(result.error || '삭제 실패')
    }
  }

  const handleUpdateComment = async (e: React.FormEvent, commentId: string) => {
    e.preventDefault()
    if (!editingComment || !editCommentForm.trim()) return
    const result = await updateComment(commentId, editCommentForm)
    if (result.success) {
      toast.success('댓글이 수정되었습니다')
      setEditingComment(null)
      fetchPosts()
    } else {
      toast.error(result.error || '수정 실패')
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start">

        {/* Left Column: Sticky Stock Info & Chart (Desktop: 7 cols, Mobile: full) */}
        <div className="w-full lg:col-span-7 lg:sticky lg:top-24 space-y-6">
          <div className="bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-glass overflow-hidden p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl md:text-3xl font-bold text-white tracking-tight">{stock.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-gray-300">
                    {stock.symbol}
                  </span>
                </div>
                <p className="text-gray-400 font-medium text-sm">{stock.market} Market</p>
              </div>
              <div className="text-right">
                <h2 className="text-4xl font-bold text-white tracking-tight mb-1">
                  {usd ? `$${stock.price.toFixed(2)}` : `${stock.price.toLocaleString()}원`}
                </h2>
                <div className={`flex items-center justify-end space-x-2 text-lg font-semibold ${stock.change >= 0 ? 'text-red-400' : 'text-blue-400'}`}>
                  <span>{stock.change > 0 ? '▲' : '▼'}{Math.abs(stock.change).toLocaleString()}</span>
                  <span>({Math.abs(stock.changePercent).toFixed(2)}%)</span>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="h-[350px] w-full relative">
              {isLoadingChart ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={stock.change >= 0 ? '#f87171' : '#60a5fa'} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={stock.change >= 0 ? '#f87171' : '#60a5fa'} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="time"
                      hide={true}
                      padding={{ left: 10, right: 10 }}
                    />
                    <YAxis
                      hide={true}
                      domain={['auto', 'auto']}
                      padding={{ top: 20, bottom: 20 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="close"
                      stroke={stock.change >= 0 ? '#f87171' : '#60a5fa'}
                      strokeWidth={2}
                      fill="url(#chartGradient)"
                      activeDot={{ r: 6, fill: '#fff', strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Time Range Selector */}
            <div className="flex justify-center gap-2 mt-6">
              {['1d', '1w', '1mo', '1y'].map((range) => (
                <button
                  key={range}
                  onClick={() => fetchStockChart(range)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${timeRange === range
                    ? 'bg-white text-black font-bold'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Discussion Input Form (Desktop Sticky Area) */}
          <div className="hidden lg:block bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-glass p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-white" />
              의견 남기기
            </h3>
            {user ? (
              <form onSubmit={handleSubmitPost} className="space-y-4">
                <input
                  type="text"
                  placeholder="제목을 입력하세요"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-all text-sm"
                />
                <textarea
                  placeholder="종목에 대한 의견을 자유롭게 나눠보세요"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-all resize-none custom-scrollbar text-sm"
                />
                <button
                  type="submit"
                  disabled={!newPost.title || !newPost.content}
                  className="w-full bg-white text-black py-2.5 rounded-xl font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm"
                >
                  게시글 등록
                </button>
              </form>
            ) : (
              <div className="text-center py-6">
                <Link href="/auth/login" className="text-sm text-blue-400 hover:underline">로그인하여 참여하기</Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Scrollable Discussion (Desktop: 5 cols) */}
        <div className="w-full lg:col-span-5 space-y-6">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-6 bg-white rounded-full inline-block"></span>
              토론 <span className="text-gray-500 text-base font-normal">({posts.length})</span>
            </h3>
          </div>

          {/* Mobile Input Form (Visible only on mobile) */}
          <div className="lg:hidden bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">의견 남기기</h3>
            {user ? (
              <form onSubmit={handleSubmitPost} className="space-y-4">
                <input
                  type="text"
                  placeholder="제목"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white/30"
                />
                <textarea
                  placeholder="내용"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white/30 resize-none"
                />
                <button type="submit" className="w-full bg-white text-black py-3 rounded-xl font-bold text-sm">등록</button>
              </form>
            ) : (
              <Link href="/auth/login" className="block text-center text-blue-400 py-2">로그인하기</Link>
            )}
          </div>

          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 overflow-hidden shadow-glass hover:border-white/20 transition-colors">
                <div className="p-5 md:p-6">
                  {/* Post Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white leading-snug">{post.title}</h3>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <span className="text-gray-300 font-medium">{post.user.name}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                        <span>{timeAgo(post.createdAt)}</span>
                      </div>
                    </div>
                    {user && user.id === post.user.id && (
                      <div className="flex space-x-1">
                        <button onClick={() => handleDeletePost(post.id)} className="p-1.5 text-gray-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-300 mb-4 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleLike(post.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${post.isLiked ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-white/5 border-white/5 text-gray-400'}`}>
                        <Heart className={`h-3.5 w-3.5 ${post.isLiked ? 'fill-current' : ''}`} />
                        {post.likes}
                      </button>
                      <button onClick={() => toggleComments(post.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all text-xs font-bold">
                        <MessageCircle className="h-3.5 w-3.5" />
                        {post.comments ? post.comments.length : 0}
                        {expandedComments.has(post.id) ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Collapsible Comments Section */}
                {expandedComments.has(post.id) && (
                  <div className="bg-black/20 border-t border-white/5 p-5 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-4">
                      {post.comments && post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-300 border border-white/10">
                            {comment.user.name.charAt(0)}
                          </div>
                          <div className="flex-1 text-sm">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-gray-300 text-xs">{comment.user.name}</span>
                              <span className="text-[10px] text-gray-500">{timeAgo(comment.createdAt)}</span>
                            </div>
                            <p className="text-gray-400 leading-relaxed text-xs md:text-sm">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Comment Input */}
                    {user && (
                      <form onSubmit={(e) => handleSubmitComment(e, post.id)} className="relative mt-4">
                        <input
                          type="text"
                          placeholder="댓글 입력..."
                          value={newComment[post.id] || ''}
                          onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                          className="w-full pl-4 pr-10 py-2.5 bg-black/40 border border-white/10 rounded-full text-xs text-white focus:border-white/30 outline-none"
                        />
                        <button type="submit" disabled={!newComment[post.id]?.trim()} className="absolute right-1.5 top-1.5 p-1 bg-white/10 text-white rounded-full hover:bg-white/20">
                          <Send className="h-3 w-3" />
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
