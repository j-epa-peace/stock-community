
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const symbol = '005930' // Samsung Electronics
    const stock = await prisma.stock.findUnique({ where: { symbol } })

    if (!stock) {
        console.error('Stock not found')
        return
    }

    // Get a user to be the author (or first user)
    const user = await prisma.user.findFirst()
    if (!user) {
        console.error('No user found to author posts')
        return
    }

    console.log(`Seeding 15 posts for ${stock.name}...`)

    const sentiments = ['BULLISH', 'BEARISH', null]
    const categories = ['FREE', 'ANALYSIS', 'HUMOR']

    for (let i = 0; i < 15; i++) {
        await prisma.post.create({
            data: {
                title: `더보기 테스트용 게시글 ${i + 1}`,
                content: `이 게시글은 페이징 기능을 테스트하기 위해 생성되었습니다. 데이터 번호: ${Date.now()}-${i}`,
                stockId: stock.id,
                userId: user.id,
                sentiment: sentiments[i % 3], // Cycle sentiments
                category: categories[i % 3],
                viewCount: Math.floor(Math.random() * 100),
                createdAt: new Date(Date.now() - i * 1000 * 60 * 60) // Different timestamps
            }
        })
    }

    console.log('Seeding complete.')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
