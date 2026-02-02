import { PrismaClient } from '@prisma/client'
import yahooFinance from 'yahoo-finance2'

const prisma = new PrismaClient()
const yf = new (yahooFinance as any)()

async function main() {
    console.log('🔧 Fixing Stock Data Mismatches...')

    // 1. Rename 058470 to '리노공업' (Leeno Industrial)
    // Currently mistaken as '레인보우로보틱스'
    try {
        const leeno = await prisma.stock.findUnique({ where: { symbol: '058470' } })
        if (leeno) {
            console.log(`Found 058470: ${leeno.name}. Renaming to '리노공업'...`)
            await prisma.stock.update({
                where: { symbol: '058470' },
                data: { name: '리노공업' }
            })
            console.log('✅ Updated 058470 to 리노공업')
        }
    } catch (e) {
        console.error('Error updating Leeno:', e)
    }

    // 2. Add/Ensure Rainbow Robotics (277810) exists
    // The user wants Rainbow Robotics, so we must add it properly.
    const rainbowSymbol = '277810'
    const rainbowName = '레인보우로보틱스'
    try {
        console.log(`Fetching data for ${rainbowName} (${rainbowSymbol})...`)
        // Fetch real data from Yahoo to populate initial fields
        const quote = await yf.quote(rainbowSymbol + '.KQ')

        if (quote) {
            const data = {
                symbol: rainbowSymbol,
                name: rainbowName,
                market: 'KOSDAQ',
                price: quote.regularMarketPrice || 0,
                change: quote.regularMarketChange || 0,
                changePercent: quote.regularMarketChangePercent || 0,
                marketCap: quote.marketCap ? BigInt(quote.marketCap) : null,
                sector: 'Technology'
            }

            await prisma.stock.upsert({
                where: { symbol: rainbowSymbol },
                update: data,
                create: data
            })
            console.log(`✅ Upserted ${rainbowName} (${rainbowSymbol})`)
        } else {
            console.log('Failed to fetch Yahoo data for Rainbow Robotics')
        }

    } catch (e) {
        console.error('Error adding Rainbow Robotics:', e)
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
