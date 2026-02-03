import { NextResponse } from 'next/server'
import YahooFinance from 'yahoo-finance2'

const yahooFinance = new (YahooFinance as any)()

// Suppress notices
if (yahooFinance.suppressNotices) {
    yahooFinance.suppressNotices(['yahooSurvey'])
}

export async function GET() {
    try {
        const symbols = [
            { ticker: '^KS11', name: 'KOSPI' },
            { ticker: '^KQ11', name: 'KOSDAQ' },
            { ticker: '^IXIC', name: 'NASDAQ' },
            { ticker: '^GSPC', name: 'S&P 500' },
            { ticker: '^N225', name: 'Nikkei 225' },
            { ticker: '000001.SS', name: 'Shanghai' },
            { ticker: 'KRW=X', name: 'USD/KRW' },
            { ticker: 'JPYKRW=X', name: 'JPY/KRW' },
            { ticker: 'CNYKRW=X', name: 'CNY/KRW' },
            { ticker: 'BTC-KRW', name: 'Bitcoin' },
            { ticker: 'ETH-KRW', name: 'Ethereum' }
        ]

        const results = await Promise.all(
            symbols.map(async (symbol) => {
                try {
                    const period1 = new Date()
                    period1.setDate(period1.getDate() - 7) // 7 days lookback

                    const fetchWithInterval = async (interval: '1m' | '5m' | '15m' | '60m') => {
                        const queryOptions = {
                            period1: period1.toISOString(),
                            interval: interval,
                            includePrePost: false
                        } as any
                        return yahooFinance.chart(symbol.ticker, queryOptions).catch(() => ({ quotes: [], meta: {} })) as any
                    }

                    const getLatestDayQuotes = (quotes: any[]) => {
                        if (!quotes || quotes.length === 0) return []
                        const lastQuoteDate = new Date(quotes[quotes.length - 1].date)
                        const lastDateStr = `${lastQuoteDate.getUTCFullYear()}-${lastQuoteDate.getUTCMonth()}-${lastQuoteDate.getUTCDate()}`

                        return quotes.filter((item: any) => {
                            const d = new Date(item.date)
                            const dStr = `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`
                            return dStr === lastDateStr
                        })
                    }

                    // Helper: Filter nulls
                    const getValidQuotes = (quotes: any[]) => quotes.filter((q: any) => q.close !== null && q.close !== undefined)

                    // Strategy:
                    // 1. Fetch 5m (Base Standard)
                    // 2. Determine Active vs Closed
                    // 3. If Active (Today) -> Try 1m. If good, use it. Else use 5m.
                    // 4. If Closed (Past) -> Use 5m (Standard).

                    let bestQuotes: any[] = []
                    let chartMeta = {}
                    let usedInterval = '5m'
                    const now = new Date()

                    // Step 1: Fetch Base 5m
                    let res5m = await fetchWithInterval('5m')
                    let candidates5m = getLatestDayQuotes(res5m.quotes)
                    let valid5m = getValidQuotes(candidates5m)

                    chartMeta = res5m.meta || {}
                    usedInterval = '5m'

                    const lastPointDate = candidates5m.length > 0 ? new Date(candidates5m[candidates5m.length - 1].date) : new Date(0)
                    const isSameDayUTC = lastPointDate.getUTCDate() === now.getUTCDate() && lastPointDate.getUTCMonth() === now.getUTCMonth()

                    if (isSameDayUTC) {
                        // === ACTIVE MARKET ===
                        // Try higher resolution (1m)
                        let res1m = await fetchWithInterval('1m')
                        let valid1m = getValidQuotes(getLatestDayQuotes(res1m.quotes))

                        if (valid1m.length >= 30) { // If we have > 30 mins of 1m data, prefer it
                            bestQuotes = valid1m
                            usedInterval = '1m'
                            chartMeta = res1m.meta || chartMeta
                        } else {
                            // Fallback to 5m (already fetched)
                            bestQuotes = valid5m
                            usedInterval = '5m'
                        }
                    } else {
                        // === CLOSED MARKET ===
                        // Standardize on 5m as requested
                        bestQuotes = valid5m
                        usedInterval = '5m'

                        // Fallback logic for EXTREME edge cases (virtually no data)
                        if (bestQuotes.length === 0) {
                            let res15m = await fetchWithInterval('15m')
                            bestQuotes = getValidQuotes(getLatestDayQuotes(res15m.quotes))
                            usedInterval = '15m'
                            chartMeta = res15m.meta || chartMeta
                        }
                    }

                    const quoteData = await yahooFinance.quote(symbol.ticker)
                    const quote = chartMeta as any
                    const realPreviousClose = quoteData.regularMarketPreviousClose || quote.chartPreviousClose || quote.previousClose

                    if (bestQuotes.length === 0) {
                        return {
                            name: symbol.name,
                            symbol: symbol.ticker,
                            value: quoteData.regularMarketPrice || quote.regularMarketPrice || 0,
                            change: quoteData.regularMarketChange || quote.regularMarketChange || 0,
                            changePercent: quoteData.regularMarketChangePercent || quote.regularMarketChangePercent || 0,
                            previousClose: realPreviousClose || 0,
                            data: [],
                            interval: usedInterval
                        }
                    }

                    const history = bestQuotes.map((item: any) => ({
                        time: new Date(item.date).getTime(),
                        value: item.close
                    }))

                    return {
                        name: symbol.name,
                        symbol: symbol.ticker,
                        value: quoteData.regularMarketPrice || quote.regularMarketPrice,
                        change: quoteData.regularMarketChange || quote.regularMarketChange,
                        changePercent: quoteData.regularMarketChangePercent || quote.regularMarketChangePercent,
                        previousClose: realPreviousClose,
                        data: history,
                        interval: usedInterval
                    }
                } catch (error) {
                    console.error(`Failed to fetch data for ${symbol.name}:`, error)
                    return null
                }
            })
        )

        const validResults = results.filter(item => item !== null)
        return NextResponse.json(validResults)
    } catch (error) {
        console.error('Market indices fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch market indices', details: String(error) },
            { status: 500 }
        )
    }
}
