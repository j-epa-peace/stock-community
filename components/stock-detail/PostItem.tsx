'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Send, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { Post, User } from '@/types'
import { timeAgo, getReputationBadge } from '@/lib/utils'
import { createComment, deleteComment, toggleCommentLike } from '@/app/actions/comment'
import { toggleLike, deletePost } from '@/app/actions/post'
import toast from 'react-hot-toast'

interface PostItemProps {
    post: Post
    user: User | null
    onRefresh: () => void
}

export default function PostItem({ post, user, onRefresh }: PostItemProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [newComment, setNewComment] = useState('')
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const [replyForm, setReplyForm] = useState('')

    const handleLike = async () => {
        const result = await toggleLike(post.id)
        if (result.success) {
            onRefresh() // Ideally optimistic update, but refresh is safe
        } else {
            toast.error(result.error || '오류가 발생했습니다')
        }
    }

    const handleDeletePost = async () => {
        if (!confirm('정말 삭제하시겠습니까?')) return
        const result = await deletePost(post.id)
        if (result.success) {
            toast.success('게시글이 삭제되었습니다')
            onRefresh()
        } else {
            toast.error(result.error || '삭제 실패')
        }
    }

    const handleSubmitComment = async (e: React.FormEvent, parentId?: string) => {
        e.preventDefault()
        const content = parentId ? replyForm : newComment
        if (!content?.trim()) return

        const result = await createComment({ postId: post.id, content, parentId })
        if (result.success) {
            toast.success('댓글이 작성되었습니다')
            if (parentId) {
                setReplyForm('')
                setReplyingTo(null)
            } else {
                setNewComment('')
                setIsExpanded(true)
            }
            onRefresh()
        } else {
            toast.error(result.error || '댓글 작성 실패')
        }
    }

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return
        const result = await deleteComment(commentId)
        if (result.success) {
            toast.success('댓글이 삭제되었습니다')
            onRefresh()
        } else {
            toast.error(result.error || '삭제 실패')
        }
    }

    const handleCommentLike = async (commentId: string) => {
        const result = await toggleCommentLike(commentId)
        if (result.success) {
            onRefresh()
        } else {
            toast.error(result.error || '오류가 발생했습니다')
        }
    }

    return (
        <div className="bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 overflow-hidden shadow-glass hover:border-white/20 transition-colors">
            <div className="p-5 md:p-6">
                {/* Post Header */}
                <div className="flex justify-between items-start mb-3">
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white leading-snug">{post.title}</h3>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <span className="text-gray-300 font-medium">{post.user.name}</span>
                        {(() => {
                            const badge = getReputationBadge(post.user.reputation)
                            return (
                                <span className={`px-1.5 py-0.5 rounded text-[10px] border ${badge.bg} ${badge.color} flex items-center gap-1`}>
                                    <span>{badge.icon}</span> {badge.label}
                                </span>
                            )
                        })()}
                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                        <span>{timeAgo(post.createdAt)}</span>
                    </div>
                </div>
                {user && user.id === post.user.id && (
                    <div className="flex space-x-1">
                        <button onClick={handleDeletePost} className="p-1.5 text-gray-500 hover:text-red-400">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>

            <p className="text-gray-300 mb-4 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>

            {/* Post Actions */}
            <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <div className="flex items-center gap-2">
                    <button onClick={handleLike} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${post.isLiked ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-white/5 border-white/5 text-gray-400'}`}>
                        <Heart className={`h-3.5 w-3.5 ${post.isLiked ? 'fill-current' : ''}`} />
                        {post.likes}
                    </button>
                    <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all text-xs font-bold">
                        <MessageCircle className="h-3.5 w-3.5" />
                        {post.comments ? post.comments.length : 0}
                        {isExpanded ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                    </button>
                </div>
            </div>

            {/* Collapsible Comments Section */}
            {isExpanded && (
                <div className="bg-black/20 border-t border-white/5 p-5 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-4">
                        {post.comments && post.comments.filter(c => !c.parentId).map((comment) => (
                            <div key={comment.id} className="space-y-3">
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-300 border border-white/10 shrink-0">
                                        {comment.user.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 text-sm">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-gray-300 text-xs">{comment.user.name}</span>
                                                {(() => {
                                                    const badge = getReputationBadge(comment.user.reputation)
                                                    return (
                                                        <span className={`px-1.5 py-0.5 rounded text-[10px] border ${badge.bg} ${badge.color} flex items-center gap-1`}>
                                                            <span>{badge.icon}</span> {badge.label}
                                                        </span>
                                                    )
                                                })()}
                                            </div>
                                            <span className="text-[10px] text-gray-500">{timeAgo(comment.createdAt)}</span>
                                        </div>
                                        <p className="text-gray-400 leading-relaxed text-xs md:text-sm">{comment.content}</p>

                                        <div className="flex items-center gap-3 mt-2">
                                            <button onClick={() => handleCommentLike(comment.id)} className={`flex items-center gap-1 text-[10px] font-bold transition-colors ${comment.isLiked ? 'text-red-400' : 'text-gray-500 hover:text-gray-300'}`}>
                                                <Heart className={`w-3 h-3 ${comment.isLiked ? 'fill-current' : ''}`} />
                                                {comment.likes}
                                            </button>
                                            <button onClick={() => { setReplyingTo(comment.id); setReplyForm(''); }} className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors">
                                                답글 쓰기
                                            </button>
                                            {user && user.id === comment.user.id && (
                                                <button onClick={() => handleDeleteComment(comment.id)} className="text-[10px] text-gray-500 hover:text-red-400">삭제</button>
                                            )}
                                        </div>

                                        {/* Reply Input */}
                                        {replyingTo === comment.id && (
                                            <form onSubmit={(e) => handleSubmitComment(e, comment.id)} className="mt-3 flex gap-2">
                                                <input
                                                    type="text"
                                                    value={replyForm}
                                                    onChange={(e) => setReplyForm(e.target.value)}
                                                    placeholder="답글을 입력하세요..."
                                                    className="flex-1 px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:border-white/30 outline-none"
                                                    autoFocus
                                                />
                                                <button type="button" onClick={() => setReplyingTo(null)} className="px-3 py-1.5 text-xs text-gray-400 hover:text-white">취소</button>
                                                <button type="submit" className="px-3 py-1.5 bg-white/10 text-white rounded-lg text-xs hover:bg-white/20">등록</button>
                                            </form>
                                        )}
                                    </div>
                                </div>

                                {/* Nested Replies */}
                                {post.comments.filter(reply => reply.parentId === comment.id).map(reply => (
                                    <div key={reply.id} className="flex gap-3 pl-9 border-l-2 border-white/5 ml-3">
                                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-[8px] font-bold text-gray-300 border border-white/10 shrink-0">
                                            {reply.user.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 text-sm">
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-300 text-xs">{reply.user.name}</span>
                                                    {(() => {
                                                        const badge = getReputationBadge(reply.user.reputation)
                                                        return (
                                                            <span className={`px-1.5 py-0.5 rounded text-[10px] border ${badge.bg} ${badge.color} flex items-center gap-1`}>
                                                                <span>{badge.icon}</span> {badge.label}
                                                            </span>
                                                        )
                                                    })()}
                                                </div>
                                                <span className="text-[10px] text-gray-500">{timeAgo(reply.createdAt)}</span>
                                            </div>
                                            <p className="text-gray-400 leading-relaxed text-xs md:text-sm">{reply.content}</p>

                                            <div className="flex items-center gap-3 mt-2">
                                                <button onClick={() => handleCommentLike(reply.id)} className={`flex items-center gap-1 text-[10px] font-bold transition-colors ${reply.isLiked ? 'text-red-400' : 'text-gray-500 hover:text-gray-300'}`}>
                                                    <Heart className={`w-3 h-3 ${reply.isLiked ? 'fill-current' : ''}`} />
                                                    {reply.likes}
                                                </button>
                                                {user && user.id === reply.user.id && (
                                                    <button onClick={() => handleDeleteComment(reply.id)} className="text-[10px] text-gray-500 hover:text-red-400">삭제</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Comment Input */}
                    {user && (
                        <form onSubmit={(e) => handleSubmitComment(e)} className="relative mt-4">
                            <input
                                type="text"
                                placeholder="댓글 입력..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="w-full pl-4 pr-10 py-2.5 bg-black/40 border border-white/10 rounded-full text-xs text-white focus:border-white/30 outline-none"
                            />
                            <button type="submit" disabled={!newComment.trim()} className="absolute right-1.5 top-1.5 p-1 bg-white/10 text-white rounded-full hover:bg-white/20">
                                <Send className="h-3 w-3" />
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    )
}
