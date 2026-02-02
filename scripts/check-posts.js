
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const stocks = await prisma.stock.findMany({
        include: {
            _count: {
                select: { posts: true }
            }
        }
    })

    console.log('Stock Post Counts:')
    stocks.forEach(stock => {
        console.log(`${stock.name} (${stock.symbol}): ${stock._count.posts}`)
    })
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
