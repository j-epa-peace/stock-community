import yahooFinance from 'yahoo-finance2'

const yf = new (yahooFinance as any)()
if (yf.suppressNotices) yf.suppressNotices(['yahooSurvey'])

async function main() {
    const symbol = '277810.KQ'
    console.log(`Fetching chart for ${symbol}...`)

    // Mimic the route.ts logic
    const period1 = new Date()
    period1.setDate(period1.getDate() - 5) // 5 days ago

    try {
        const result = await yf.chart(symbol, {
            period1: period1.toISOString(),
            interval: '5m',
            includePrePost: true
        })

        const quotes = (result as any).quotes || []
        console.log(`Total quotes fetched: ${quotes.length}`)

        if (quotes.length > 0) {
            const lastQuote = quotes[quotes.length - 1]
            console.log('Last Quote:', lastQuote)
            console.log('Last Quote Date Object:', new Date(lastQuote.date).toString())

            // Check unique days
            const days = new Set(quotes.map((q: any) => new Date(q.date).toDateString()))
            console.log('Days present in data:', Array.from(days))

            // Simulating API logic
            const latestDateStr = new Date(lastQuote.date).toDateString()
            console.log('Filter Target Date:', latestDateStr)

            const filtered = quotes.filter((q: any) => new Date(q.date).toDateString() === latestDateStr)
            console.log(`Filtered count for ${latestDateStr}: ${filtered.length}`)
            console.log('First filtered quote:', filtered[0])
            console.log('Last filtered quote:', filtered[filtered.length - 1])
        }

        // Also check Quote Summary for regularMarketPrice
        const quoteSummary = await yf.quote(symbol)
        console.log('Regular Market Price from Quote:', quoteSummary.regularMarketPrice)
        console.log('Market State:', quoteSummary.marketState)

    } catch (e) {
        console.error(e)
    }
}

main()
