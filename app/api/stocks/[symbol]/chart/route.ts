import { NextResponse } from 'next/server'
import YahooFinance from 'yahoo-finance2'

const yahooFinance = new (YahooFinance as any)()

export async function GET(
    request: Request,
    props: { params: Promise<{ symbol: string }> }
) {
    const params = await props.params
    try {
        const { searchParams } = new URL(request.url)
        const range = searchParams.get('range') || '1d'
        const interval = searchParams.get('interval') || '1m'
        const market = searchParams.get('market') || ''
        let symbol = params.symbol

        // Append suffix for Korean stocks if needed
        if (market === 'KOSPI' && !symbol.endsWith('.KS')) {
            symbol += '.KS'
        } else if (market === 'KOSDAQ' && !symbol.endsWith('.KQ')) {
            symbol += '.KQ'
        }

        // Calculate period1 based on range
        const now = new Date()
        let period1 = new Date()

        switch (range) {
            case '1d':
                period1.setDate(now.getDate() - 7) // 7 days ago to cover weekends/holidays securely
                break
            case '1w':
                period1.setDate(now.getDate() - 7)
                break
            case '1mo':
                period1.setMonth(now.getMonth() - 1)
                break
            case '1y':
                period1.setFullYear(now.getFullYear() - 1)
                break
            default:
                period1.setDate(now.getDate() - 2) // Default to 1d behavior
        }

        // Use yahooFinance.chart for best results (especially intraday 1d)
        const queryOptions: any = {
            period1: period1.toISOString(),
            interval: interval,
            includePrePost: true
        }

        const chartResult = await yahooFinance.chart(symbol, queryOptions)
        let quotes = (chartResult as any).quotes || []

        // Intraday Logic: Filter for the LATEST trading day only
        if (range === '1d' && quotes.length > 0) {
            const latestDateStr = new Date(quotes[quotes.length - 1].date).toDateString()
            quotes = quotes.filter((q: any) => new Date(q.date).toDateString() === latestDateStr)
        }

        const formattedQuotes = quotes.map((q: any) => ({
            time: new Date(q.date).getTime(),
            value: q.close,
            open: q.open,
            high: q.high,
            low: q.low,
            close: q.close,
            volume: q.volume
        }))

        return NextResponse.json({ success: true, data: formattedQuotes })

        return NextResponse.json({ success: true, data: quotes })
    } catch (error: any) {
        console.error('Stock Chart API Error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch stock chart data' },
            { status: 500 }
        )
    }
}
