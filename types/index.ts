export type StockMarket = 'KOSPI' | 'KOSDAQ' | 'SP500' | 'NASDAQ' | string

export type Stock = {
    // id field is optional in some contexts (like API responses from yahoo), but required in DB. 
    // The centralized type has 'symbol' which is unique enough for UI? 
    // Let's keep it compatible.
    // The previous definition in types.ts did NOT have id?
    // Let's check step 1374.
    // Step 1374: Stock { symbol, name, market, price, change, changePercent }
    // No ID.
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
