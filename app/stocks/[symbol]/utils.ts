
export function timeAgo(dateString: string) {
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

export function getReputationBadge(reputation: number = 0) {
    if (reputation > 100) return { icon: '👑', label: '숲', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' }
    if (reputation > 50) return { icon: '🌳', label: '나무', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' }
    if (reputation > 10) return { icon: '🌿', label: '새싹', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' }
    return { icon: '🌱', label: '씨앗', color: 'text-gray-400', bg: 'bg-gray-400/10 border-gray-400/20' }
}
