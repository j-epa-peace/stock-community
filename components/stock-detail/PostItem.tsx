'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Send, Trash2, ChevronDown, ChevronUp, Pencil, Check, X } from 'lucide-react'
import { Post, User } from '@/types'
import { timeAgo, getReputationBadge } from '@/lib/utils'
import { createComment, deleteComment, toggleCommentLike } from '@/app/actions/comment'
import CommentItem from '@/components/stock-detail/CommentItem'
import { toggleLike, deletePost, updatePost } from '@/app/actions/post'
import toast from 'react-hot-toast'

interface PostItemProps {
    post: Post
    user: User | null
    onRefresh: () => void
}

export default function PostItem({ post, user, onRefresh }: PostItemProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [newComment, setNewComment] = useState('')

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false)
    const [editTitle, setEditTitle] = useState(post.title)
    const [editContent, setEditContent] = useState(post.content)

    // Optimistic UI State
    const [localLikes, setLocalLikes] = useState(post.likes)
    const [localIsLiked, setLocalIsLiked] = useState(post.isLiked)

    const handleLike = async () => {
        if (!user) {
            toast.error('로그인이 필요합니다')
            return
        }

        // Optimistic Update
        const prevLikse = localLikes
        const prevIsLiked = localIsLiked

        setLocalLikes(prev => prevIsLiked ? prev - 1 : prev + 1)
        setLocalIsLiked(!prevIsLiked)

        const result = await toggleLike(post.id)
        if (result.success) {
            onRefresh()
        } else {
            // Revert on failure
            setLocalLikes(prevLikse)
            setLocalIsLiked(prevIsLiked)
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

    const handleUpdatePost = async () => {
        if (!editTitle.trim() || !editContent.trim()) {
            toast.error('제목과 내용을 모두 입력해주세요')
            return
        }

        const result = await updatePost(post.id, { title: editTitle, content: editContent })
        if (result.success) {
            toast.success('게시글이 수정되었습니다')
            setIsEditing(false)
            onRefresh()
        } else {
            toast.error(result.error || '수정 실패')
        }
    }

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment?.trim()) return

        const result = await createComment({ postId: post.id, content: newComment })
        if (result.success) {
            toast.success('댓글이 작성되었습니다')
            setNewComment('')
            setIsExpanded(true)
            onRefresh()
        } else {
            toast.error(result.error || '댓글 작성 실패')
        }
    }

    return (
        <div className="bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 overflow-hidden shadow-glass hover:border-white/20 transition-colors">
            <div className="p-5 md:p-6">
                {/* Post Header */}
                <div className="flex justify-between items-start mb-3">
                    <div className="space-y-1 flex-1 mr-4">
                        {isEditing ? (
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-bold text-lg focus:border-white/30 outline-none"
                            />
                        ) : (
                            <h3 className="text-lg font-bold text-white leading-snug">{post.title}</h3>
                        )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-400 shrink-0">
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
                        {user && user.id === post.user.id && !isEditing && (
                            <>
                                <button onClick={() => setIsEditing(true)} className="ml-2 p-1 text-gray-500 hover:text-blue-400" title="게시글 수정">
                                    <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={handleDeletePost} className="p-1 text-gray-500 hover:text-red-400" title="게시글 삭제">
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {isEditing ? (
                <div className="px-5 md:px-6 mb-4 space-y-3">
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full h-32 bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-gray-300 focus:border-white/30 outline-none resize-none leading-relaxed"
                    />
                    <div className="flex justify-end gap-2">
                        <button onClick={() => { setIsEditing(false); setEditTitle(post.title); setEditContent(post.content); }} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 flex items-center gap-1">
                            <X className="w-3.5 h-3.5" /> 취소
                        </button>
                        <button onClick={handleUpdatePost} className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-xs hover:bg-green-500/20 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> 저장
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-gray-300 mb-4 px-5 md:px-6 text-sm leading-relaxed whitespace-pre-wrap break-words">{post.content}</p>
            )}

            {/* Post Actions */}
            <div className="flex items-center justify-between border-t border-white/5 pt-3 px-5 md:px-6 pb-4">
                <div className="flex items-center gap-2">
                    <button onClick={handleLike} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${localIsLiked ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-white/5 border-white/5 text-gray-400'}`}>
                        <Heart className={`h-3.5 w-3.5 ${localIsLiked ? 'fill-current' : ''}`} />
                        {localLikes}
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
                            <div key={comment.id}>
                                <CommentItem
                                    comment={comment}
                                    user={user}
                                    onRefresh={onRefresh}
                                />

                                {/* Nested Replies */}
                                {post.comments.filter(reply => reply.parentId === comment.id).map(reply => (
                                    <div key={reply.id} className="pl-4 md:pl-6 border-l md:border-l-2 border-white/10 ml-2 md:ml-4">
                                        <CommentItem
                                            comment={reply}
                                            user={user}
                                            onRefresh={onRefresh}
                                            isReply={true}
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Comment Input */}
                    {user && (
                        <form onSubmit={(e) => handleSubmitComment(e)} className="relative mt-6 pt-4 border-t border-white/5">
                            <input
                                type="text"
                                placeholder="댓글 입력..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="w-full pl-4 pr-10 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:border-white/30 outline-none"
                            />
                            <button type="submit" disabled={!newComment.trim()} className="absolute right-2 top-[22px] p-1.5 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                                <Send className="h-3 w-3" />
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    )
}
