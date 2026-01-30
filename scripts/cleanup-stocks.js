const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function cleanUp() {
    console.log('Starting cleanup...')

    // 1. Delete .KS / .KQ duplicates
    // We assume '005930' is good, '005930.KS' is bad.
    const suffixedStocks = await prisma.stock.findMany({
        where: {
            OR: [
                { symbol: { endsWith: '.KS' } },
                { symbol: { endsWith: '.KQ' } }
            ]
        }
    })

    console.log(`Found ${suffixedStocks.length} suffixed stocks to delete.`)
    for (const stock of suffixedStocks) {
        // Check if raw symbol exists
        const rawSymbol = stock.symbol.replace(/\.K[SQ]$/, '')
        const rawStock = await prisma.stock.findUnique({ where: { symbol: rawSymbol } })

        if (rawStock) {
            console.log(`Deleting duplicate ${stock.symbol} (keeping ${rawSymbol})`)
            // Delete relation data if necessary? Cascade should handle it?
            // Check schema: User-Post-Stock relations cascade? 
            // Post->Stock has OnDelete: Cascade. Good.
            await prisma.stock.delete({ where: { id: stock.id } })
        } else {
            console.warn(`Warning: ${stock.symbol} only exists with suffix! Renaming to ${rawSymbol} instead of deleting.`)
            await prisma.stock.update({
                where: { id: stock.id },
                data: { symbol: rawSymbol }
            })
        }
    }

    // 2. Fix Market Assignments
    const corrections = [
        { name: 'HPSP', correctMarket: 'KOSDAQ' },
        { name: 'HD현대미포', correctMarket: 'KOSPI' } // Name might be 'HD현대미포' or '현대미포조선'
    ]

    for (const fix of corrections) {
        const stock = await prisma.stock.findFirst({ where: { name: { contains: fix.name } } })
        if (stock) {
            console.log(`Fixing ${stock.name} (${stock.symbol}): ${stock.market} -> ${fix.correctMarket}`)
            await prisma.stock.update({
                where: { id: stock.id },
                data: { market: fix.correctMarket, marketCap: null } // Reset cap to force re-fetch
            })
        } else {
            console.log(`Stock matching ${fix.name} not found.`)
        }
    }

    console.log('Cleanup complete.')
}

cleanUp()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
