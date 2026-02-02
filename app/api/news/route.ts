import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const symbols = searchParams.get('symbols')?.split(',') || []

    if (symbols.length === 0) {
        return NextResponse.json({ news: [] })
    }

    // Construct Query: "Name1 OR Name2 OR Name3 ..."
    // We expect symbols to optionally contain names or we just use symbols.
    // "005930.KS OR TSLA OR AAPL"
    const query = symbols.map(s => s.replace('.T', '').replace('.KS', '')).join(' OR ') + ' when:3d'

    // Google News RSS URL (Korean)
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ko&gl=KR&ceid=KR:ko`

    try {
        const response = await fetch(rssUrl)
        const xmlText = await response.text()

        // Simple XML Parser using Regex
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
                    provider: sourceMatch ? sourceMatch[1] : 'Google News',
                    // Normalize for MyNewsTab (unix timestamp in seconds)
                    providerPublishTime: pubDateMatch ? Math.floor(new Date(pubDateMatch[1]).getTime() / 1000) : Math.floor(Date.now() / 1000),
                    publisher: sourceMatch ? sourceMatch[1] : 'Google News'
                })
            }

            if (items.length >= 20) break // Limit
        }

        return NextResponse.json({ news: items })
    } catch (error) {
        console.error('News API Error:', error)
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
    }
}
