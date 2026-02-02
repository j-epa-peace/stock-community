'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createPost } from '@/app/actions/post'
import toast from 'react-hot-toast'
import { User } from '@/types'

interface PostFormProps {
    user: User | null
    symbol: string
    onRefresh: () => void
    className?: string
}

export default function PostForm({ user, symbol, onRefresh, className = '' }: PostFormProps) {
    const [newPost, setNewPost] = useState<{ title: string; content: string }>({ title: '', content: '' })

    const handleSubmitPost = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user || !newPost.title.trim() || !newPost.content.trim()) return

        const result = await createPost({
            symbol,
            title: newPost.title,
            content: newPost.content
        })

        if (result.success) {
            toast.success('게시글이 작성되었습니다')
            setNewPost({ title: '', content: '' })
            onRefresh()
        } else {
            toast.error(result.error || '작성 실패')
        }
    }

    return (
        <div className={`bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 p-6 ${className}`}>
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
    )
}
