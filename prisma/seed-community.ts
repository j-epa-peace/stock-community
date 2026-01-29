import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting community data seeding...')

    // 1. Get existing users (created in seed.ts)
    const users = await prisma.user.findMany()
    if (users.length === 0) {
        console.log('No users found. Please run regular seed first.')
        return
    }
    console.log(`Found ${users.length} users.`)

    // 2. Get key stocks
    const targetSymbols = ['005930.KS', 'TSLA', 'AAPL', 'MSFT', 'JNJ', '000660', '035420']
    const stocks = await prisma.stock.findMany({
        where: { symbol: { in: targetSymbols } }
    })

    // 3. Post Templates
    const templates = [
        { title: '오늘 주가 흐름 분석', content: '차트를 보니 20일 이평선을 지지하고 반등하는 모습입니다. 매수 관점 유효해 보이네요.', type: 'analysis' },
        { title: '실적 발표 언제인가요?', content: '이번 분기 실적 컨센서스가 궁금합니다. 아시는 분 계신가요?', type: 'question' },
        { title: '장기 투자는 역시...', content: '단기 변동성에 일희일비 하지 맙시다. 5년 뒤를 보고 가는거죠. 🚀', type: 'positive' },
        { title: '배당금 입금되었습니다', content: '쏠쏠하네요. 재투자 하러 갑니다.', type: 'chat' },
        { title: '매도 고민입니다', content: '수익률 30% 도달했는데 차익 실현 할까요 아니면 더 들고 갈까요?', type: 'question' },
        { title: '뉴스 공유합니다', content: '업계 동향 관련 흥미로운 기사가 떴네요. 참고하세요. (링크 생략)', type: 'info' },
        { title: '떨어질 때 줍줍', content: '공포에 매수하라는 말이 있죠. 지금이 기회입니다.', type: 'positive' },
        { title: '기관 매도세가 거세네요', content: '당분간 조정이 올 수도 있겠네요. 리스크 관리 필요합니다.', type: 'warning' },
        { title: '목표가 1차 달성', content: '감사합니다. 성투하세요!', type: 'chat' },
        { title: '이 종목 왜 이러나요?', content: '특별한 악재도 없는데 계속 흐르네요 ㅠㅠ', type: 'sad' },
    ]

    const commentTemplates = [
        '동감합니다.',
        '좋은 정보 감사합니다!',
        '저도 그렇게 생각해요.',
        '지금은 관망하는 게 좋을 것 같네요.',
        '화이팅입니다!',
        '부럽네요 ㅠㅠ',
        '성투하세요!',
        '일리 있는 분석이네요.',
        '풀매수 가즈아~',
        '조심하는게 좋을듯요.'
    ]

    // 4. Create Posts & Comments
    for (const stock of stocks) {
        // 5-10 posts per stock
        const numPosts = Math.floor(Math.random() * 6) + 5

        for (let i = 0; i < numPosts; i++) {
            const template = templates[Math.floor(Math.random() * templates.length)]
            const author = users[Math.floor(Math.random() * users.length)]

            // Random create date within last 3 days
            const createdAt = new Date()
            createdAt.setHours(createdAt.getHours() - Math.floor(Math.random() * 72))

            const post = await prisma.post.create({
                data: {
                    title: template.title,
                    content: template.content,
                    stockId: stock.id,
                    userId: author.id,
                    createdAt: createdAt
                }
            })

            // Add 0-5 comments
            const numComments = Math.floor(Math.random() * 6)
            for (let j = 0; j < numComments; j++) {
                const commenter = users[Math.floor(Math.random() * users.length)]
                const commentContent = commentTemplates[Math.floor(Math.random() * commentTemplates.length)]

                await prisma.comment.create({
                    data: {
                        content: commentContent,
                        postId: post.id,
                        userId: commenter.id,
                        createdAt: new Date(createdAt.getTime() + 1000 * 60 * (j + 1) * 30) // comments after post
                    }
                })
            }

            // Add random likes
            const numLikes = Math.floor(Math.random() * 10)
            for (let k = 0; k < numLikes; k++) {
                const liker = users[Math.floor(Math.random() * users.length)]
                // Use upsert to avoid duplicate key errors if random picks same user
                try {
                    await prisma.like.create({
                        data: {
                            userId: liker.id,
                            postId: post.id
                        }
                    })
                } catch (e) {
                    // ignore duplicate likes
                }
            }
        }
    }

    console.log('✅ Community data seeded successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
