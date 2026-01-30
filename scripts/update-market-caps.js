const { PrismaClient } = require('@prisma/client')
const YahooFinance = require('yahoo-finance2').default
const yahooFinance = new YahooFinance()
const prisma = new PrismaClient()

// Helper to get Yahoo symbol
function getYahooSymbol(symbol, market) {
    if (symbol.includes('.')) return symbol
    if (market === 'KOSPI') return `${symbol}.KS`
    if (market === 'KOSDAQ') return `${symbol}.KQ`
    return symbol
}

async function updateMarketCaps() {
    console.log('Starting market cap update...')

    const stocks = await prisma.stock.findMany()
    console.log(`Found ${stocks.length} stocks to update.`)

    const BATCH_SIZE = 50
    for (let i = 0; i < stocks.length; i += BATCH_SIZE) {
        const batch = stocks.slice(i, i + BATCH_SIZE)
        console.log(`Processing batch ${i / BATCH_SIZE + 1}...`)

        const symbolMap = {}
        const yahooSymbols = batch.map(stock => {
            const ySymbol = getYahooSymbol(stock.symbol, stock.market)
            symbolMap[ySymbol] = stock.id
            return ySymbol
        })

        try {
            const quotes = await yahooFinance.quote(yahooSymbols, {}, { validateResult: false })

            for (const quote of quotes) {
                if (quote.marketCap) {
                    // Find the original stock ID
                    // Try exact match or match by symbol part if needed, but here we mapped ySymbol directly
                    let stockId = symbolMap[quote.symbol]

                    if (!stockId) {
                        // Fallback lookup if yahoo returns slightly diff symbol (e.g. casing)
                        const key = Object.keys(symbolMap).find(k => k.toLowerCase() === quote.symbol.toLowerCase())
                        if (key) stockId = symbolMap[key]
                    }

                    if (stockId) {
                        await prisma.stock.update({
                            where: { id: stockId },
                            data: { marketCap: BigInt(quote.marketCap) }
                        })
                    }
                }
            }
            console.log(`Batch ${i / BATCH_SIZE + 1} completed.`)
        } catch (error) {
            console.error(`Error processing batch ${i / BATCH_SIZE + 1}:`, error.message)
        }

        // Slight delay to be nice to API
        await new Promise(resolve => setTimeout(resolve, 1000))
    }

    console.log('Market cap update complete!')
}

updateMarketCaps()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
