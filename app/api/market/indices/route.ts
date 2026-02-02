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
                    // 1m data is usually available for last 7 days.
                    // We need max range to cover long holidays (like Lunar New Year).
                    period1.setDate(period1.getDate() - 7)

                    // Helper to fetch data with specific interval
                    const fetchWithInterval = async (interval: '1m' | '5m' | '60m') => {
                        const queryOptions = {
                            period1: period1.toISOString(),
                            interval: interval,
                            includePrePost: false
                        } as any
                        return yahooFinance.chart(symbol.ticker, queryOptions).catch(() => ({ quotes: [], meta: {} })) as any
                    }

                    // 1. Try 1m interval first (Best Resolution)
                    let chartDataResult = await fetchWithInterval('1m')

                    // 2. Fallback to 5m if 1m returns empty
                    if (!chartDataResult.quotes || chartDataResult.quotes.length === 0) {
                        // console.log(`Fallback to 5m for ${symbol.ticker}`)
                        chartDataResult = await fetchWithInterval('5m')
                    }

                    // 3. Fallback to 60m (1h) if 5m also fails (Maximum Robustness)
                    if (!chartDataResult.quotes || chartDataResult.quotes.length === 0) {
                        // console.log(`Fallback to 60m for ${symbol.ticker}`)
                        chartDataResult = await fetchWithInterval('60m')
                    }

                    const quoteData = await yahooFinance.quote(symbol.ticker)

                    // Handle case where chart fetch returned fallback object
                    const chartData = chartDataResult || { quotes: [], meta: {} }
                    const quote = chartData.meta || {}
                    const realPreviousClose = quoteData.regularMarketPreviousClose || quote.chartPreviousClose || quote.previousClose

                    // 데이터 매핑 및 최신 거래일 하루치만 필터링
                    const quotes = chartData.quotes || []

                    // 1. 가장 마지막 데이터의 날짜를 기준으로 필터링 (UTC 기준 날짜 비교)
                    // Server Timezone Issue 방지를 위해 toDateString() 대신 YYYY-MM-DD 문자열 직접 비교
                    if (quotes.length === 0) {
                        // Return valid quote even if chart is empty
                        return {
                            name: symbol.name,
                            symbol: symbol.ticker,
                            value: quoteData.regularMarketPrice || quote.regularMarketPrice || 0,
                            change: quoteData.regularMarketChange || quote.regularMarketChange || 0,
                            changePercent: quoteData.regularMarketChangePercent || quote.regularMarketChangePercent || 0,
                            previousClose: realPreviousClose || 0,
                            data: []
                        }
                    }

                    const lastQuoteDate = new Date(quotes[quotes.length - 1].date)
                    const lastDateStr = `${lastQuoteDate.getUTCFullYear()}-${lastQuoteDate.getUTCMonth()}-${lastQuoteDate.getUTCDate()}`

                    // 2. 가장 최근 날짜의 데이터만 필터링 (장중이면 오픈~현재)
                    const history = quotes
                        .filter((item: any) => {
                            const d = new Date(item.date)
                            const dStr = `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`
                            return dStr === lastDateStr
                        })
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
