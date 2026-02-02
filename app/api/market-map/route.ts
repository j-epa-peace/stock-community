import { NextResponse } from 'next/server'
import yahooFinance from 'yahoo-finance2'

// Interface for Yahoo Finance Quote
interface YahooQuote {
    symbol: string;
    shortName?: string;
    longName?: string;
    regularMarketPrice?: number;
    regularMarketChange?: number;
    regularMarketChangePercent?: number;
    marketCap?: number;
}

// Instance with suppressed notices
const yf = new (yahooFinance as any)()
if (yf.suppressNotices) {
    yf.suppressNotices(['yahooSurvey'])
}

// Define the static structure of the market map
const domesticMapStructure = [
    {
        name: '반도체/IT',
        symbols: ['005930.KS', '000660.KS', '000990.KS', '066570.KS'] // Samsung, SK Hynix, DB Hitech, LG Elec
    },
    {
        name: '플랫폼/서비스',
        symbols: ['035420.KS', '035720.KS', '352820.KS', '251270.KS'] // Naver, Kakao, Hybe, Netmarble
    },
    {
        name: '자동차/2차전지',
        symbols: ['373220.KS', '005380.KS', '000270.KS', '247540.KQ', '005490.KS'] // LG Energy, Hyundai, Kia, EcoproBM, POSCO
    },
    {
        name: '바이오/헬스',
        symbols: ['207940.KS', '068270.KS', '000100.KS'] // Samsung Biologics, Celltrion, Yuhan
    },
    {
        name: '금융',
        symbols: ['105560.KS', '055550.KS', '323410.KS'] // KB, Shinhan, KakaoBank
    }
]

const globalMapStructure = [
    {
        name: 'Big Tech',
        symbols: ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META']
    },
    {
        name: 'EV/Auto',
        symbols: ['TSLA', 'TM', 'F']
    },
    {
        name: 'Semiconductor',
        symbols: ['TSM', 'AVGO', 'AMD', 'INTC']
    },
    {
        name: 'Consumer',
        symbols: ['KO', 'PEP', 'MCD', 'DIS']
    },
    {
        name: 'Finance',
        symbols: ['JPM', 'V', 'BRK-B'] // Yahoo uses BRK-B for Berkshire
    }
]

// Manual Name Mapping for better UX
const koreanNameMap: Record<string, string> = {
    '005930.KS': '삼성전자',
    '000660.KS': 'SK하이닉스',
    '000990.KS': 'DB하이텍',
    '066570.KS': 'LG전자',
    '035420.KS': 'NAVER',
    '035720.KS': '카카오',
    '352820.KS': '하이브',
    '251270.KS': '넷마블',
    '373220.KS': 'LG에너지솔루션',
    '005380.KS': '현대차',
    '000270.KS': '기아',
    '247540.KQ': '에코프로비엠',
    '005490.KS': 'POSCO홀딩스',
    '207940.KS': '삼성바이오로직스',
    '068270.KS': '셀트리온',
    '000100.KS': '유한양행',
    '105560.KS': 'KB금융',
    '055550.KS': '신한지주',
    '323410.KS': '카카오뱅크'
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type') || 'domestic'

        const structure = type === 'domestic' ? domesticMapStructure : globalMapStructure
        const allSymbols = structure.flatMap(s => s.symbols)

        // Fetch quotes with typing
        const quotes = await yf.quote(allSymbols) as unknown as YahooQuote[]
        const quoteMap = new Map(quotes.map(q => [q.symbol, q]))

        const finalData = structure.map(sector => ({
            name: sector.name,
            children: sector.symbols.map(symbol => {
                const quote = quoteMap.get(symbol)
                let displayName = quote?.shortName || symbol

                // Use manual Korean name if available for domestic
                if (type === 'domestic' && koreanNameMap[symbol]) {
                    displayName = koreanNameMap[symbol]
                }

                return {
                    name: displayName,
                    size: quote?.marketCap || 1000000000,
                    change: Number((quote?.regularMarketChangePercent || 0).toFixed(2)),
                    symbol: symbol.replace('.KS', '').replace('.KQ', ''),
                    price: quote?.regularMarketPrice || 0
                }
            })
        }))

        return NextResponse.json({ success: true, data: finalData })

    } catch (error) {
        console.error('Market Map API Error:', error)
        return NextResponse.json({ success: false, error: 'Failed to fetch market map' }, { status: 500 })
    }
}
