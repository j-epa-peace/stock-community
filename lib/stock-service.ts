import yahooFinance from 'yahoo-finance2'

// Instance with suppressed notices
const yf = new (yahooFinance as any)()
if (yf.suppressNotices) {
    yf.suppressNotices(['yahooSurvey'])
}

interface Stock {
    symbol: string
    name: string
    market: string
    price: number
    change: number
    changePercent: number
}

// Helper to get Yahoo Finance symbol
function getYahooSymbol(symbol: string, market?: string | null) {
    // If already suffixed, return as is
    if (symbol.includes('.')) return symbol

    if (market === 'KOSPI') return `${symbol}.KS`
    if (market === 'KOSDAQ') return `${symbol}.KQ`
    if (market === 'SP500' || market === 'NASDAQ') return symbol // US stocks usually don't have suffix or use ticker directly

    // Default fallback
    return symbol
}

export async function getRealTimeQuotes(stocks: Stock[]) {
    if (stocks.length === 0) return []

    const symbolMap = new Map<string, Stock>()
    const yahooSymbols = stocks.map(stock => {
        const ySymbol = getYahooSymbol(stock.symbol, stock.market)
        symbolMap.set(ySymbol, stock)
        return ySymbol
    })

    try {
        const quotes = await yf.quote(yahooSymbols)

        // quotes is array of results
        return quotes.map((quote: any) => {
            // Find original stock object
            // Note: Yahoo might return symbol in slightly different case, so matching can be tricky.
            // But usually it returns the requested symbol.
            const originalStock = symbolMap.get(quote.symbol) ||
                Array.from(symbolMap.values()).find(s => getYahooSymbol(s.symbol, s.market) === quote.symbol)

            if (!originalStock) return null

            return {
                ...originalStock,
                price: quote.regularMarketPrice ?? originalStock.price ?? 0,
                change: quote.regularMarketChange ?? originalStock.change ?? 0,
                changePercent: quote.regularMarketChangePercent ?? originalStock.changePercent ?? 0,
                // Optional: Update name if available and better? Maybe not.
            }
        }).filter(Boolean) as Stock[]

    } catch (error) {
        console.error('Error fetching real-time quotes:', error)
        // Fallback to original data if fetch fails
        return stocks
    }
}

export async function getRealTimeQuote(stock: Stock) {
    const result = await getRealTimeQuotes([stock])
    return result[0] || stock
}
