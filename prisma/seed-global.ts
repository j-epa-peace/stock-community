import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Consolidated fixed prices + meta data
const globalStocks = [
    { symbol: 'AAPL', name: '애플', market: 'NASDAQ', price: 185.42, change: 2.15, changePercent: 1.17 },
    { symbol: 'MSFT', name: '마이크로소프트', market: 'NASDAQ', price: 378.91, change: -1.23, changePercent: -0.32 },
    { symbol: 'GOOGL', name: '알파벳(구글)', market: 'NASDAQ', price: 142.56, change: 3.78, changePercent: 2.72 },
    { symbol: 'AMZN', name: '아마존', market: 'NASDAQ', price: 151.23, change: -0.89, changePercent: -0.58 },
    { symbol: 'TSLA', name: '테슬라', market: 'NASDAQ', price: 248.67, change: 12.45, changePercent: 5.27 },
    { symbol: 'META', name: '메타', market: 'NASDAQ', price: 334.12, change: 4.56, changePercent: 1.38 },
    { symbol: 'NVDA', name: '엔비디아', market: 'NASDAQ', price: 456.78, change: 8.92, changePercent: 1.99 },
    { symbol: 'NFLX', name: '넷플릭스', market: 'NASDAQ', price: 423.89, change: -2.34, changePercent: -0.55 },
    { symbol: 'ADBE', name: '어도비', market: 'NASDAQ', price: 567.23, change: 1.67, changePercent: 0.30 },
    { symbol: 'CRM', name: '세일즈포스', market: 'NYSE', price: 234.56, change: -3.21, changePercent: -1.35 },
    { symbol: 'BABA', name: '알리바바', market: 'NYSE', price: 89.45, change: -1.78, changePercent: -1.95 },
    { symbol: 'V', name: '비자', market: 'NYSE', price: 267.89, change: 0.45, changePercent: 0.17 },
    { symbol: 'JPM', name: 'JP모건', market: 'NYSE', price: 156.78, change: 2.34, changePercent: 1.51 },
    { symbol: 'JNJ', name: '존슨앤존슨', market: 'NYSE', price: 167.45, change: -0.67, changePercent: -0.40 },
    { symbol: 'AMD', name: 'AMD', market: 'NASDAQ', price: 134.56, change: 4.78, changePercent: 3.68 },
    { symbol: 'DIS', name: '월트 디즈니', market: 'NYSE', price: 92.50, change: -1.20, changePercent: -1.28 },
    { symbol: 'KO', name: '코카콜라', market: 'NYSE', price: 58.90, change: -0.34, changePercent: -0.57 },
    { symbol: 'PEP', name: '펩시코', market: 'NASDAQ', price: 167.89, change: 1.45, changePercent: 0.87 },
    { symbol: 'INTC', name: '인텔', market: 'NASDAQ', price: 45.67, change: -1.23, changePercent: -2.62 },
    { symbol: 'TSM', name: 'TSMC', market: 'NYSE', price: 103.45, change: 1.56, changePercent: 1.53 }
]

async function main() {
    console.log('Seeding global stocks...')

    for (const stock of globalStocks) {
        await prisma.stock.upsert({
            where: { symbol: stock.symbol },
            update: {
                price: stock.price,
                change: stock.change,
                changePercent: stock.changePercent
            },
            create: {
                symbol: stock.symbol,
                name: stock.name,
                market: stock.market,
                price: stock.price,
                change: stock.change,
                changePercent: stock.changePercent
            }
        })
    }

    console.log('Done.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
