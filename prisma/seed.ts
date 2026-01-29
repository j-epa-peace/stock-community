import { PrismaClient } from '@prisma/client'
import { stockSeedData } from '../lib/stock-data'

const prisma = new PrismaClient()

async function main() {
  // Create Users
  const users = [
    { id: '1', name: '투자왕김씨', email: 'kim@example.com', password: 'password123' },
    { id: '2', name: '주식고수', email: 'master@example.com', password: 'password123' },
    { id: '3', name: '코스피러버', email: 'kospi@example.com', password: 'password123' },
    { id: '4', name: '나스닥킹', email: 'nasdaq@example.com', password: 'password123' },
    { id: '5', name: '가치투자자', email: 'value@example.com', password: 'password123' },
    { id: '6', name: '성장주헌터', email: 'growth@example.com', password: 'password123' },
    { id: '7', name: '배당주좋아', email: 'dividend@example.com', password: 'password123' },
    { id: '8', name: '테크주매니아', email: 'tech@example.com', password: 'password123' },
    { id: '9', name: '바이오투자', email: 'bio@example.com', password: 'password123' },
    { id: '10', name: '반도체왕', email: 'semi@example.com', password: 'password123' }
  ]

  // Clear existing users
  await prisma.user.deleteMany({})

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      create: user,
      update: user,
    })
  }

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

