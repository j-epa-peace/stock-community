import { PrismaClient } from '@prisma/client'
import yahooFinance from 'yahoo-finance2'
import { TOP_STOCKS } from '../lib/real-stock-data'

// Suppress notices
const yf = new (yahooFinance as any)()
if (yf.suppressNotices) {
  yf.suppressNotices(['yahooSurvey'])
}

const prisma = new PrismaClient()

// Helper to get Yahoo symbol
function getYahooSymbol(symbol: string, market: string) {
  if (symbol.includes('.')) return symbol
  // Check strict suffixes
  if (market === 'KOSPI') return `${symbol}.KS`
  if (market === 'KOSDAQ') return `${symbol}.KQ`
  return symbol
}

async function main() {
  console.log('Starting clear and seed process...')

  // 1. Clear Data
  console.log('Clearing existing data...')
  await prisma.comment.deleteMany({})
  await prisma.post.deleteMany({})
  await prisma.watchlist.deleteMany({})
  await prisma.stock.deleteMany({})
  await prisma.user.deleteMany({})
  console.log('Data cleared.')

  // 2. Seed Users
  console.log('Seeding users...')
  const users = [
    { id: '1', username: 'kim123', name: '투자왕김씨', email: 'kim@example.com', password: 'password123' },
    { id: '2', username: 'master', name: '주식고수', email: 'master@example.com', password: 'password123' },
    { id: '3', username: 'kospi_lover', name: '코스피러버', email: 'kospi@example.com', password: 'password123' },
    { id: '4', username: 'nasdaq_king', name: '나스닥킹', email: 'nasdaq@example.com', password: 'password123' },
    { id: '5', username: 'value_invest', name: '가치투자자', email: 'value@example.com', password: 'password123' },
  ]

  for (const user of users) {
    await prisma.user.create({ data: user })
  }
  console.log('Users seeded.')

  // 3. Seed Stocks (Fetch from Yahoo)
  console.log('Seeding stocks from Yahoo Finance...')

  const markets = ['KOSPI', 'KOSDAQ', 'SP500', 'NASDAQ'] as const

  for (const market of markets) {
    const stockList = TOP_STOCKS[market] || []
    if (stockList.length === 0) continue

    console.log(`Fetching data for ${market} (${stockList.length} stocks)...`)

    // Map raw symbol to Yahoo symbol and keep track of localized name
    const yahooSymbolMap: Record<string, string> = {} // ySymbol -> rawSymbol
    const nameMap: Record<string, string> = {} // rawSymbol -> localizedName

    const yahooSymbols = stockList.map(item => {
      const ySym = getYahooSymbol(item.symbol, market)
      yahooSymbolMap[ySym] = item.symbol
      nameMap[item.symbol] = item.name
      return ySym
    })

    try {
      const quotes = await yf.quote(yahooSymbols, {}, { validateResult: false })

      for (const quote of quotes) {
        // Skip if critical data missing
        if (!quote.regularMarketPrice) continue

        const rawSymbol = yahooSymbolMap[quote.symbol] || yahooSymbolMap[quote.symbol.toUpperCase()]
        if (!rawSymbol) continue

        // Use localized name if available, otherwise fallback to Yahoo
        const name = nameMap[rawSymbol] || quote.shortName || quote.longName || rawSymbol

        // Ensure numeric 
        const price = quote.regularMarketPrice || 0
        const change = quote.regularMarketChange || 0
        const changePercent = quote.regularMarketChangePercent || 0
        const marketCap = quote.marketCap ? BigInt(quote.marketCap) : null

        const data = {
          name: name,
          market: market,
          price: price,
          change: change,
          changePercent: changePercent,
          marketCap: marketCap,
          sector: 'Unknown'
        }

        await prisma.stock.upsert({
          where: { symbol: rawSymbol },
          update: data,
          create: {
            symbol: rawSymbol,
            ...data
          }
        })
      }
      console.log(`Seeded ${quotes.length} stocks for ${market}.`)
    } catch (error) {
      console.error(`Error fetching for ${market}:`, error)
    }

    // Slight pause to avoid rate limits
    await new Promise(r => setTimeout(r, 1000))
  }


  // 4. Seed Posts & Comments
  console.log('Seeding community content...')

  // Reload users and stocks to get IDs
  const allUsers = await prisma.user.findMany()
  if (allUsers.length === 0) { // Should not happen
    console.log('No users found to seed content.')
    return
  }

  // Get all seeded stocks
  const allStocks = await prisma.stock.findMany()

  const { COMMON_POSTS, STOCK_SPECIFIC_POSTS, COMMENTS } = await import('../lib/community-seed-data')

  for (const stock of allStocks) {
    // Determine how many posts to create for this stock (3 to 8)
    const postCount = Math.floor(Math.random() * 6) + 3
    const stockPosts = STOCK_SPECIFIC_POSTS[stock.symbol] || []

    for (let i = 0; i < postCount; i++) {
      // Choose a user randomly
      const author = allUsers[Math.floor(Math.random() * allUsers.length)]

      // Choose content: Prioritize stock-specific, then mix common
      let postData
      if (i < stockPosts.length) {
        postData = stockPosts[i]
      } else {
        postData = COMMON_POSTS[Math.floor(Math.random() * COMMON_POSTS.length)]
      }

      // Randomize time within last 3 days
      const createdAt = new Date(Date.now() - Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000))

      const post = await prisma.post.create({
        data: {
          title: postData.title,
          content: postData.content,
          category: postData.category === 'Unspecified' ? 'FREE' : postData.category,
          userId: author.id,
          stockId: stock.id,
          createdAt: createdAt,
          viewCount: Math.floor(Math.random() * 100) + 10,
        }
      })

      // Mock Likes
      const likeCount = Math.floor(Math.random() * 10)
      for (let k = 0; k < likeCount; k++) {
        const liker = allUsers[Math.floor(Math.random() * allUsers.length)]
        // Check uniqueness blindly (might fail if duplicate, ignore error)
        try {
          await prisma.like.create({
            data: {
              userId: liker.id,
              postId: post.id
            }
          })
        } catch (e) {
          // Ignore duplicate likes
        }
      }

      // Add Comments (1 to 5)
      const commentCount = Math.floor(Math.random() * 5) + 1
      for (let j = 0; j < commentCount; j++) {
        const commentAuthor = allUsers[Math.floor(Math.random() * allUsers.length)]
        const commentText = COMMENTS[Math.floor(Math.random() * COMMENTS.length)]
        // Randomize time after post creation
        const commentTime = new Date(post.createdAt.getTime() + Math.floor(Math.random() * 10000000))

        await prisma.comment.create({
          data: {
            content: commentText,
            userId: commentAuthor.id,
            postId: post.id,
            createdAt: commentTime
          }
        })
      }
    }
  }
  console.log('Community content seeded.')

  console.log('Seeding complete!')
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

