import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'domestic'

    let query = '주식 시장 when:7d'
    if (category === 'domestic') query = '코스피 OR 삼성전자 OR 국내증시 when:3d' // 국내는 더 최신으로 (3일)
    else if (category === 'global') query = '미국증시 OR 나스닥 OR 엔비디아 OR 테슬라 when:3d'
    else if (category === 'crypto') query = '비트코인 OR 이더리움 OR 암호화폐 when:3d'

    // Google News RSS URL (Korean)
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ko&gl=KR&ceid=KR:ko`

    try {
        const response = await fetch(rssUrl)
        const xmlText = await response.text()

        // Simple XML Parser using Regex (to avoid huge dependencies for simple RSS)
        const items = []
        const itemRegex = /<item>([\s\S]*?)<\/item>/g
        let match

        while ((match = itemRegex.exec(xmlText)) !== null) {
            const itemContent = match[1]

            const titleMatch = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || itemContent.match(/<title>(.*?)<\/title>/)
            const linkMatch = itemContent.match(/<link>(.*?)<\/link>/)
            const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/)
            const sourceMatch = itemContent.match(/<source url=".*?">(.*?)<\/source>/)

            if (titleMatch && linkMatch) {
                items.push({
                    title: titleMatch[1],
                    link: linkMatch[1],
                    time: pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString(),
                    provider: sourceMatch ? sourceMatch[1] : 'Google News'
                })
            }

            if (items.length >= 6) break // Limit to 6 items
        }

        return NextResponse.json(items)
    } catch (error) {
        console.error('News fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
    }
}
