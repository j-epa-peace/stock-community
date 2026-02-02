import { NextResponse } from 'next/server'
import YahooFinance from 'yahoo-finance2'

const yahooFinance = new (YahooFinance as any)()

// Suppress notices on the instance
if (yahooFinance.suppressNotices) {
    yahooFinance.suppressNotices(['yahooSurvey'])
}

export async function GET() {

    try {
        const symbols = [
            { ticker: '^KS11', name: 'KOSPI' },
            { ticker: '^KQ11', name: 'KOSDAQ' },
            { ticker: '^IXIC', name: 'NASDAQ' },
            { ticker: '^GSPC', name: 'S&P 500' },
            { ticker: '^N225', name: 'Nikkei 225' },
            { ticker: '000001.SS', name: 'Shanghai' },
            { ticker: 'KRW=X', name: 'USD/KRW' },
            { ticker: 'JPYKRW=X', name: 'JPY/KRW' },
            { ticker: 'CNYKRW=X', name: 'CNY/KRW' },
            { ticker: 'BTC-KRW', name: 'Bitcoin' },
            { ticker: 'ETH-KRW', name: 'Ethereum' }


        ]

        const results = await Promise.all(
            symbols.map(async (symbol) => {
                try {
                    // 1. 현재가 정보 가져오기 (Quote)
                    // 2. 당일 차트 데이터 가져오기 (1일, 1분 간격)
                    // 2. 당일 차트 데이터 가져오기 (1일, 1분 간격)
                    // 'range' 옵션 유효성 검사 실패 시 'period1' 사용
                    const period1 = new Date()
                    period1.setDate(period1.getDate() - 7) // 7일 전 (주말/휴일 고려 넉넉하게)

                    const queryOptions = {
                        period1: period1.toISOString(),
                        interval: '1m',
                        includePrePost: true
                    } as any
                    // Fetch both Chart and Quote for accuracy
                    const [chartData, quoteData] = await Promise.all([
                        yahooFinance.chart(symbol.ticker, queryOptions) as any,
                        yahooFinance.quote(symbol.ticker)
                    ])

                    const quote = chartData.meta
                    const realPreviousClose = quoteData.regularMarketPreviousClose || quote.chartPreviousClose || quote.previousClose

                    // 데이터 매핑 및 최신 거래일 하루치만 필터링
                    const quotes = chartData.quotes || []

                    // 1. 데이터가 있는 날짜들 확인
                    const dates = quotes.map((q: any) => new Date(q.date).toDateString())
                    const uniqueDates = Array.from(new Set(dates))
                    const latestDate = uniqueDates[uniqueDates.length - 1] // 가장 최근 날짜

                    // 최근 날짜가 없으면 빈 배열
                    if (!latestDate) {
                        return {
                            name: symbol.name,
                            symbol: symbol.ticker,
                            value: quoteData.regularMarketPrice || quote.regularMarketPrice,
                            change: quoteData.regularMarketChange || quote.regularMarketChange,
                            changePercent: quoteData.regularMarketChangePercent || quote.regularMarketChangePercent,
                            previousClose: realPreviousClose,
                            data: []
                        }
                    }

                    // 2. 가장 최근 날짜의 데이터만 필터링 (장중이면 오픈~현재)
                    const history = quotes
                        .filter((item: any) => new Date(item.date).toDateString() === latestDate)
                        .map((item: any) => ({
                            time: new Date(item.date).getTime(),
                            value: item.close
                        }))
                        .filter((item: any) => item.value !== null && item.value !== undefined)

                    return {
                        name: symbol.name,
                        symbol: symbol.ticker,
                        value: quoteData.regularMarketPrice || quote.regularMarketPrice,
                        change: quoteData.regularMarketChange || quote.regularMarketChange,
                        changePercent: quoteData.regularMarketChangePercent || quote.regularMarketChangePercent,
                        previousClose: realPreviousClose,
                        data: history
                    }
                } catch (error) {
                    console.error(`Failed to fetch data for ${symbol.name}:`, error)
                    return null
                }
            })
        )

        // 실패한 요청 필터링
        const validResults = results.filter(item => item !== null)

        return NextResponse.json(validResults)
    } catch (error) {
        console.error('Market indices fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch market indices', details: String(error) },
            { status: 500 }
        )
    }
}
