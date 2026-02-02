import { useState, useEffect } from 'react'
import { Heart, Send, Pencil, X, Check } from 'lucide-react'
import { Comment, User } from '@/types'
import { timeAgo, getReputationBadge } from '@/lib/utils'
import { toggleCommentLike, deleteComment, createComment, updateComment } from '@/app/actions/comment'
import toast from 'react-hot-toast'

interface CommentItemProps {
    comment: Comment
    user: User | null
    onRefresh: () => void
    isReply?: boolean
}

export default function CommentItem({ comment, user, onRefresh, isReply = false }: CommentItemProps) {
    const [isReplying, setIsReplying] = useState(false)
    const [replyContent, setReplyContent] = useState('')

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(comment.content)

    // Optimistic UI State
    const [localLikes, setLocalLikes] = useState(comment.likes)
    const [localIsLiked, setLocalIsLiked] = useState(comment.isLiked)

    // Sync state with props when parent refreshes
    useEffect(() => {
        setLocalLikes(comment.likes)
        setLocalIsLiked(comment.isLiked)
    }, [comment.likes, comment.isLiked])

    const handleLike = async () => {
        if (!user) {
            toast.error('로그인이 필요합니다')
            return
        }

        const prevLikes = localLikes
        const prevIsLiked = localIsLiked
        setLocalLikes(prev => prevIsLiked ? prev - 1 : prev + 1)
        setLocalIsLiked(!prevIsLiked)

        const result = await toggleCommentLike(comment.id)
        if (result.success) {
            onRefresh()
        } else {
            setLocalLikes(prevLikes)
            setLocalIsLiked(prevIsLiked)
            toast.error(result.error || '오류가 발생했습니다')
        }
    }

    const handleDelete = async () => {
        if (!confirm('정말 삭제하시겠습니까?')) return
        const result = await deleteComment(comment.id)
        if (result.success) {
            toast.success('댓글이 삭제되었습니다')
            onRefresh()
        } else {
            toast.error(result.error || '삭제 실패')
        }
    }

    const handleUpdate = async () => {
        if (!editContent.trim()) return

        const result = await updateComment(comment.id, editContent)
        if (result.success) {
            toast.success('댓글이 수정되었습니다')
            setIsEditing(false)
            onRefresh()
        } else {
            toast.error(result.error || '수정 실패')
        }
    }

    const handleSubmitReply = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!replyContent.trim()) return

        const result = await createComment({
            postId: comment.postId,
            content: replyContent,
            parentId: comment.id
        })

        if (result.success) {
            toast.success('답글이 작성되었습니다')
            setReplyContent('')
            setIsReplying(false)
            onRefresh()
        } else {
            toast.error(result.error || '작성 실패')
        }
    }

    return (
        <div className={`space-y-3 ${isReply ? 'mt-3' : ''}`}>
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

                    {isEditing ? (
                        <div className="flex gap-2 mt-1 mb-2">
                            <input
                                type="text"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="flex-1 px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-start text-white focus:border-white/30 outline-none"
                                autoFocus
                            />
                            <button onClick={handleUpdate} className="p-1.5 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20">
                                <Check className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => { setIsEditing(false); setEditContent(comment.content); }} className="p-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ) : (
                        <p className="text-gray-400 leading-relaxed text-xs md:text-sm break-words">{comment.content}</p>
                    )}

                    <div className="flex items-center gap-3 mt-2">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-1 text-[10px] font-bold transition-colors ${localIsLiked ? 'text-red-400' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <Heart className={`w-3 h-3 ${localIsLiked ? 'fill-current' : ''}`} />
                            {localLikes}
                        </button>
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors"
                        >
                            답글 쓰기
                        </button>
                        {user && user.id === comment.user.id && !isEditing && (
                            <>
                                <button onClick={() => setIsEditing(true)} className="text-[10px] text-gray-500 hover:text-blue-400 flex items-center gap-1">
                                    수정
                                </button>
                                <button onClick={handleDelete} className="text-[10px] text-gray-500 hover:text-red-400">삭제</button>
                            </>
                        )}
                    </div>

                    {/* Reply Input */}
                    {isReplying && (
                        <form onSubmit={handleSubmitReply} className="mt-3 flex gap-2 animate-in fade-in duration-200">
                            <input
                                type="text"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="답글을 입력하세요..."
                                className="flex-1 px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:border-white/30 outline-none"
                                autoFocus
                            />
                            <button type="button" onClick={() => setIsReplying(false)} className="px-3 py-1.5 text-xs text-gray-400 hover:text-white">취소</button>
                            <button type="submit" className="px-3 py-1.5 bg-white/10 text-white rounded-lg text-xs hover:bg-white/20">등록</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
