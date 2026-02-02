export type Stock = {
    symbol: string
    name: string
    market: string
    price: number
    change: number
    changePercent: number
}

export type User = {
    id: string
    name: string
    email: string
    reputation: number
}

export type Comment = {
    id: string
    content: string
    parentId: string | null
    createdAt: string
    user: {
        id: string
        name: string
        reputation: number
    }
    likes: number
    isLiked: boolean
}

export type Post = {
    id: string
    title: string
    content: string
    createdAt: string
    user: {
        id: string
        name: string
        reputation: number
    }
    likes: number
    comments: Comment[]
    isLiked: boolean
}
