'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { Heart, MessageCircle, Send, MoreVertical, Trash2, Edit } from 'lucide-react'
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
}

type Comment = {
  id: string
  content: string
  createdAt: string
  user: User
}

type Post = {
  id: string
  title: string
  content: string
  createdAt: string
  user: User
  likes: number
  comments: number
  isLiked: boolean
}

const hashSymbol = (symbol: string) => {
  let hash = 0
  for (let i = 0; i < symbol.length; i++) {
    hash = (hash * 31 + symbol.charCodeAt(i)) >>> 0
  }
  return hash
}

const makeDaySeries = (symbol: string, base: number, isUsd: boolean) => {
  const seed = hashSymbol(symbol)
  const points = 24
  const amplitude = isUsd ? Math.max(1, base * 0.02) : Math.max(50, base * 0.01)
  const step = isUsd ? 0.05 : 1

  const round = (v: number) => (isUsd ? Math.round(v / step) * step : Math.round(v / step) * step)

  return Array.from({ length: points }, (_, i) => {
    const t = i / (points - 1)
    const wave = Math.sin((t * Math.PI * 2) + (seed % 10))
    const jitter = (((seed >> (i % 16)) & 0xff) - 128) / 128 // [-1, 1] deterministic
    const value = base + wave * amplitude * 0.6 + jitter * amplitude * 0.25
    return { time: `${String(i).padStart(2, '0')}:00`, value: round(value) }
  })
}

const isUsdMarket = (market: string) => market === 'SP500' || market === 'NASDAQ'

export default function StockDetailClient({ symbol, stock }: { symbol: string; stock: Stock }) {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState({ title: '', content: '' })
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null)

  // States for editing/deleting
  // States for editing/deleting
  const [editingPost, setEditingPost] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ title: '', content: '' })
  const [newComment, setNewComment] = useState<Record<string, string>>({})
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editCommentForm, setEditCommentForm] = useState('')

  const usd = isUsdMarket(stock.market)
  const dayData = useMemo(() => makeDaySeries(stock.symbol, stock.price, usd), [stock.symbol, stock.price, usd])

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user)
      })
      .catch(() => { })

    fetchPosts()
  }, [symbol])

  const fetchPosts = async () => {
    const result = await getPosts(symbol)
    if (result.success && result.posts) {
      setPosts(result.posts as any)
    }
  }

  const handleLike = async (postId: string) => {
    const result = await toggleLike(postId)
    if (result.success) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked
            }
            : post
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
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{stock.name} ({stock.symbol})</h1>
            <p className="text-gray-400">{stock.market} Market</p>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-bold text-white mb-2">
              {usd ? `$${stock.price.toFixed(2)}` : `${stock.price.toLocaleString()}원`}
            </h2>
            <div className={`flex items-center justify-end space-x-2 text-lg font-medium ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
              <span>{stock.change > 0 ? '+' : ''}{stock.change.toLocaleString()}</span>
              <span>({stock.changePercent.toFixed(2)}%)</span>
            </div>
          </div>
        </div>

        <div className="h-[400px] w-full mt-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dayData}>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                width={60}
                domain={['auto', 'auto']}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={stock.change >= 0 ? '#4ade80' : '#f87171'}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 sticky top-24">
            <h3 className="text-lg font-bold text-white mb-4">토론 참여하기</h3>
            {user ? (
              <form onSubmit={handleSubmitPost} className="space-y-4">
                <input
                  type="text"
                  placeholder="제목"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
                <textarea
                  placeholder="종목에 대한 의견을 자유롭게 나눠보세요"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white resize-none"
                />
                <button
                  type="submit"
                  disabled={!newPost.title || !newPost.content}
                  className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                >
                  게시글 등록
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">로그인이 필요합니다</p>
                <Link href="/auth/login" className="bg-primary-600 text-white px-6 py-2 rounded-lg">로그인</Link>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-2/3 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-bold text-white">최신 토론 ({posts.length})</h3>
          </div>

          {posts.length === 0 ? (
            <div className="bg-gray-800 p-12 rounded-lg text-center border border-gray-700">
              <MessageCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">아직 등록된 게시글이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                  <div className="p-6">
                    {editingPost === post.id ? (
                      <form onSubmit={handleUpdatePost} className="space-y-4">
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <textarea
                          value={editForm.content}
                          onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white resize-none"
                        />
                        <div className="flex justify-end space-x-2">
                          <button type="button" onClick={() => setEditingPost(null)} className="px-3 py-1 text-gray-400">취소</button>
                          <button type="submit" className="px-3 py-1 bg-primary-600 text-white rounded">저장</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1">{post.title}</h3>
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                              <span className="text-gray-300">{post.user.name}</span>
                              <span>•</span>
                              <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
                            </div>
                          </div>
                          {user && user.id === post.user.id && (
                            <div className="flex space-x-1">
                              <button onClick={() => startEditPost(post)} className="p-1.5 text-gray-400 hover:text-white"><Edit className="h-4 w-4" /></button>
                              <button onClick={() => handleDeletePost(post.id)} className="p-1.5 text-gray-400 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                            </div>
                          )}
                        </div>

                        <p className="text-gray-300 mb-6 leading-relaxed whitespace-pre-wrap">{post.content}</p>

                        <div className="flex items-center space-x-4 border-t border-gray-700 pt-4">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-colors ${post.isLiked ? 'bg-red-500/10 text-red-400' : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                              }`}
                          >
                            <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                            <span className="text-sm font-medium">{post.likes}</span>
                          </button>

                          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gray-700/50 text-gray-400">
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">{post.comments ? post.comments.length : 0}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Always Visible Comments */}
                  <div className="bg-gray-900/30 border-t border-gray-700 p-6">
                    {post.comments && post.comments.length > 0 ? (
                      <div className="space-y-4 mb-5">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-3 group">
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300 flex-shrink-0">
                              {comment.user.name.charAt(0)}
                            </div>

                            <div className="flex-1">
                              {editingComment === comment.id ? (
                                <form onSubmit={(e) => handleUpdateComment(e, comment.id)} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={editCommentForm}
                                    onChange={(e) => setEditCommentForm(e.target.value)}
                                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-white"
                                  />
                                  <button type="submit" className="text-xs bg-primary-600 text-white px-3 py-2 rounded">저장</button>
                                </form>
                              ) : (
                                <div className="bg-gray-800 p-3 rounded-lg">
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="text-sm font-semibold text-gray-200">{comment.user.name}</span>
                                    <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString('ko-KR')}</span>
                                  </div>
                                  <p className="text-gray-300 text-sm">{comment.content}</p>
                                </div>
                              )}

                              {!editingComment && user && user.id === comment.user.id && (
                                <div className="flex space-x-3 mt-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => { setEditingComment(comment.id); setEditCommentForm(comment.content); }} className="text-xs text-gray-500 hover:text-white">수정</button>
                                  <button onClick={() => handleDeleteComment(comment.id, post.id)} className="text-xs text-gray-500 hover:text-red-400">삭제</button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mb-4 ml-1">첫 번째 댓글을 남겨주세요.</p>
                    )}

                    {user ? (
                      <form onSubmit={(e) => handleSubmitComment(e, post.id)} className="relative">
                        <input
                          type="text"
                          placeholder="댓글을 입력하세요..."
                          value={newComment[post.id] || ''}
                          onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                          className="w-full pl-4 pr-12 py-3 bg-gray-800 border border-gray-600 rounded-full text-sm text-white focus:border-primary-500 outline-none"
                        />
                        <button
                          type="submit"
                          disabled={!newComment[post.id]?.trim()}
                          className="absolute right-2 top-1.5 p-1.5 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </form>
                    ) : (
                      <Link href="/auth/login" className="text-sm text-primary-400 hover:underline block text-center">로그인하여 댓글 달기</Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

