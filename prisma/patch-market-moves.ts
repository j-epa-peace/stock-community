import { PrismaClient } from '@prisma/client'
import yahooFinance from 'yahoo-finance2'

const prisma = new PrismaClient()
const yf = new (yahooFinance as any)()

async function main() {
    console.log('🔧 Fixing Stock Market Moves & Golfzon...')

    // 1. Golfzon: 036930 -> 215000
    // If we have 036930 labeled as '골프존', we change its symbol to 215000.
    const oldGolfzon = await prisma.stock.findUnique({ where: { symbol: '036930' } })
    if (oldGolfzon) {
        console.log('Changing Golfzon symbol 036930 -> 215000')
        try {
            await prisma.stock.update({
                where: { symbol: '036930' },
                data: { symbol: '215000', market: 'KOSDAQ' } // Make sure it is KOSDAQ
            })
            console.log('✅ Updated Golfzon symbol.')
        } catch (e) {
            console.error('Failed to update Golfzon symbol (maybe 215000 already exists?):', e)
        }
    }

    // 2. Refetch and Update Market for Moved Stocks
    // Posco DX (022100), L&F (066970) moved to KOSPI
    // Golfzon (215000) is KOSDAQ
    const targets = [
        { symbol: '022100', market: 'KOSPI' },
        { symbol: '066970', market: 'KOSPI' },
        { symbol: '215000', market: 'KOSDAQ' }
    ]

    for (const target of targets) {
        try {
            const ySymbol = target.market === 'KOSPI' ? `${target.symbol}.KS` : `${target.symbol}.KQ`
            console.log(`Fetching ${ySymbol}...`)
            const quote = await yf.quote(ySymbol)

            if (quote) {
                await prisma.stock.upsert({
                    where: { symbol: target.symbol },
                    update: {
                        market: target.market,
                        price: quote.regularMarketPrice || 0,
                        change: quote.regularMarketChange || 0,
                        changePercent: quote.regularMarketChangePercent || 0,
                        marketCap: quote.marketCap ? BigInt(quote.marketCap) : null,
                    },
                    create: {
                        symbol: target.symbol,
                        name: quote.shortName || target.symbol,
                        market: target.market,
                        price: quote.regularMarketPrice || 0,
                        change: quote.regularMarketChange || 0,
                        changePercent: quote.regularMarketChangePercent || 0,
                        marketCap: quote.marketCap ? BigInt(quote.marketCap) : null,
                        sector: 'Unknown'
                    }
                })
                console.log(`✅ Updated/Upserted ${target.symbol} (${quote.shortName}) to ${target.market}`)
            } else {
                console.log(`❌ Failed to fetch ${ySymbol}`)
            }

        } catch (e) {
            console.error(`Error processing ${target.symbol}:`, e)
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
