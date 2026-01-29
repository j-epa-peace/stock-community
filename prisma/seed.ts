import { PrismaClient } from '@prisma/client'
import { stockSeedData } from '../lib/stock-data'

const prisma = new PrismaClient()

async function main() {
  // Ensure Samsung's ".KS" symbol exists since some UI uses it.
  const extra = {
    symbol: '005930.KS',
    name: '삼성전자',
    market: 'KOSPI' as const,
    price: 71800,
    change: 900,
    changePercent: 1.27,
    sector: 'Technology',
    marketCap: 400000
  }

  const all = [...stockSeedData, extra]

  // Clear existing stocks to remove dummy data
  await prisma.stock.deleteMany({})

  for (const s of all) {
    await prisma.stock.upsert({
      where: { symbol: s.symbol },
      create: {
        symbol: s.symbol,
        name: s.name,
        market: s.market,
        sector: s.sector ?? null,
        marketCap: s.marketCap ? BigInt(s.marketCap) : null,
        price: s.price,
        change: s.change,
        changePercent: s.changePercent
      },
      update: {
        name: s.name,
        market: s.market,
        sector: s.sector ?? null,
        marketCap: s.marketCap ? BigInt(s.marketCap) : null,
        price: s.price,
        change: s.change,
        changePercent: s.changePercent
      }
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

