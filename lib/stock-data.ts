export type StockMarket = 'KOSPI' | 'KOSDAQ' | 'SP500' | 'NASDAQ'

export type StockSeed = {
  symbol: string
  name: string
  market: StockMarket
  price: number
  change: number
  changePercent: number
  sector?: string
  marketCap?: number
}

const hashSymbol = (symbol: string) => {
  let hash = 0
  for (let i = 0; i < symbol.length; i++) {
    hash = (hash * 31 + symbol.charCodeAt(i)) >>> 0
  }
  return hash
}

const makeDeterministicNumbers = (
  symbol: string,
  priceMin: number,
  priceMax: number,
  changePercentRange = 4
) => {
  const hash = hashSymbol(symbol)
  const span = Math.max(1, Math.floor(priceMax - priceMin))
  const price = priceMin + (hash % span)
  const changePercent =
    ((hash % (changePercentRange * 200 + 1)) - changePercentRange * 100) / 100
  const change = Math.round(((price * changePercent) / 100) * 100) / 100
  return { price, changePercent, change }
}

const generateIndexedStocks = (
  startIndex: number,
  count: number,
  pad: number,
  market: StockMarket,
  namePrefix: string,
  priceMin: number,
  priceMax: number
): StockSeed[] => {
  return Array.from({ length: count }, (_, i) => {
    const idx = startIndex + i
    const symbol =
      market === 'SP500'
        ? `SP${String(idx).padStart(pad, '0')}`
        : market === 'NASDAQ'
          ? `NQ${String(idx).padStart(pad, '0')}`
          : String(idx).padStart(pad, '0')

    const { price, change, changePercent } = makeDeterministicNumbers(
      symbol,
      priceMin,
      priceMax,
      4
    )

    return {
      symbol,
      name: `${namePrefix}${idx}`,
      market,
      price,
      change,
      changePercent
    }
  })
}

const kospiBase: StockSeed[] = [
  { symbol: '005930', name: '삼성전자', price: 71800, change: 900, changePercent: 1.27, market: 'KOSPI' },
  { symbol: '000660', name: 'SK하이닉스', price: 128500, change: -2500, changePercent: -1.91, market: 'KOSPI' },
  { symbol: '373220', name: 'LG에너지솔루션', price: 412000, change: 8000, changePercent: 1.98, market: 'KOSPI' },
  { symbol: '207940', name: '삼성바이오로직스', price: 789000, change: -15000, changePercent: -1.87, market: 'KOSPI' },
  { symbol: '005490', name: 'POSCO홀딩스', price: 389000, change: 12000, changePercent: 3.18, market: 'KOSPI' },
  { symbol: '035420', name: 'NAVER', price: 189500, change: 3500, changePercent: 1.88, market: 'KOSPI' },
  { symbol: '006400', name: '삼성SDI', price: 456000, change: -8000, changePercent: -1.72, market: 'KOSPI' },
  { symbol: '051910', name: 'LG화학', price: 398000, change: 15000, changePercent: 3.93, market: 'KOSPI' },
  { symbol: '068270', name: '셀트리온', price: 178900, change: -2100, changePercent: -1.16, market: 'KOSPI' },
  { symbol: '035720', name: '카카오', price: 45650, change: 850, changePercent: 1.90, market: 'KOSPI' },
  { symbol: '005380', name: '현대차', price: 198500, change: 4500, changePercent: 2.32, market: 'KOSPI' },
  { symbol: '000270', name: '기아', price: 89400, change: 1800, changePercent: 2.05, market: 'KOSPI' },
  { symbol: '012330', name: '현대모비스', price: 234000, change: -3000, changePercent: -1.27, market: 'KOSPI' },
  { symbol: '028260', name: '삼성물산', price: 123000, change: 2000, changePercent: 1.65, market: 'KOSPI' },
  { symbol: '066570', name: 'LG전자', price: 89700, change: 1200, changePercent: 1.36, market: 'KOSPI' },
  { symbol: '003670', name: '포스코퓨처엠', price: 298000, change: -5000, changePercent: -1.65, market: 'KOSPI' },
  { symbol: '096770', name: 'SK이노베이션', price: 145600, change: 3400, changePercent: 2.39, market: 'KOSPI' },
  { symbol: '017670', name: 'SK텔레콤', price: 52300, change: -800, changePercent: -1.51, market: 'KOSPI' },
  { symbol: '030200', name: 'KT', price: 34850, change: 450, changePercent: 1.31, market: 'KOSPI' },
  { symbol: '003550', name: 'LG', price: 78900, change: 1100, changePercent: 1.41, market: 'KOSPI' },
  { symbol: '015760', name: '한국전력', price: 19850, change: -250, changePercent: -1.24, market: 'KOSPI' },
  { symbol: '018260', name: '삼성에스디에스', price: 156000, change: 2000, changePercent: 1.30, market: 'KOSPI' },
  { symbol: '032830', name: '삼성생명', price: 67800, change: -900, changePercent: -1.31, market: 'KOSPI' },
  { symbol: '010950', name: 'S-Oil', price: 89600, change: 2100, changePercent: 2.40, market: 'KOSPI' },
  { symbol: '009150', name: '삼성전기', price: 156000, change: -2000, changePercent: -1.27, market: 'KOSPI' },
  { symbol: '011200', name: 'HMM', price: 23450, change: 650, changePercent: 2.85, market: 'KOSPI' },
  { symbol: '251270', name: '넷마블', price: 67800, change: -1200, changePercent: -1.74, market: 'KOSPI' },
  { symbol: '105560', name: 'KB금융', price: 56700, change: 800, changePercent: 1.43, market: 'KOSPI' },
  { symbol: '055550', name: '신한지주', price: 38950, change: 550, changePercent: 1.43, market: 'KOSPI' },
  { symbol: '086790', name: '하나금융지주', price: 45600, change: 700, changePercent: 1.56, market: 'KOSPI' }
]

const kosdaqBase: StockSeed[] = [
  { symbol: '091990', name: '셀트리온헬스케어', price: 89400, change: -1600, changePercent: -1.76, market: 'KOSDAQ' },
  { symbol: '196170', name: '알테오젠', price: 78900, change: 2100, changePercent: 2.73, market: 'KOSDAQ' },
  { symbol: '068760', name: '셀트리온제약', price: 156000, change: -3000, changePercent: -1.89, market: 'KOSDAQ' },
  { symbol: '263750', name: '펄어비스', price: 45600, change: 800, changePercent: 1.79, market: 'KOSDAQ' },
  { symbol: '039030', name: '이오테크닉스', price: 234000, change: 12000, changePercent: 5.41, market: 'KOSDAQ' },
  { symbol: '112040', name: '위메이드', price: 67800, change: -2100, changePercent: -3.00, market: 'KOSDAQ' },
  { symbol: '214150', name: '클래시스', price: 34500, change: 1200, changePercent: 3.60, market: 'KOSDAQ' },
  { symbol: '293490', name: '카카오게임즈', price: 23450, change: -450, changePercent: -1.88, market: 'KOSDAQ' },
  { symbol: '357780', name: '솔브레인', price: 298000, change: 15000, changePercent: 5.30, market: 'KOSDAQ' },
  { symbol: '086520', name: '에코프로', price: 456000, change: -18000, changePercent: -3.80, market: 'KOSDAQ' },
  { symbol: '247540', name: '에코프로비엠', price: 189000, change: 8000, changePercent: 4.42, market: 'KOSDAQ' },
  { symbol: '121600', name: '나노신소재', price: 123000, change: -2000, changePercent: -1.60, market: 'KOSDAQ' },
  { symbol: '348370', name: '엔켐', price: 78900, change: 3400, changePercent: 4.50, market: 'KOSDAQ' },
  { symbol: '066970', name: '엘앤에프', price: 234000, change: -8000, changePercent: -3.31, market: 'KOSDAQ' },
  { symbol: '058470', name: '리노공업', price: 156000, change: 6000, changePercent: 4.00, market: 'KOSDAQ' },
  { symbol: '095340', name: 'ISC', price: 89700, change: -1800, changePercent: -1.97, market: 'KOSDAQ' },
  { symbol: '240810', name: '원익IPS', price: 45600, change: 1200, changePercent: 2.70, market: 'KOSDAQ' },
  { symbol: '067310', name: '하나마이크론', price: 67800, change: -900, changePercent: -1.31, market: 'KOSDAQ' },
  { symbol: '108860', name: '셀바스AI', price: 23450, change: 650, changePercent: 2.85, market: 'KOSDAQ' },
  { symbol: '322000', name: 'HD현대미포', price: 89600, change: 2100, changePercent: 2.40, market: 'KOSDAQ' },
  { symbol: '036930', name: '주성엔지니어링', price: 34850, change: -450, changePercent: -1.27, market: 'KOSDAQ' },
  { symbol: '078600', name: '대주전자재료', price: 156000, change: 4000, changePercent: 2.63, market: 'KOSDAQ' },
  { symbol: '131970', name: '두산테스나', price: 78900, change: -1100, changePercent: -1.37, market: 'KOSDAQ' },
  { symbol: '145020', name: '휴젤', price: 234000, change: 8000, changePercent: 3.54, market: 'KOSDAQ' },
  { symbol: '196490', name: '디에이테크놀로지', price: 45600, change: -800, changePercent: -1.72, market: 'KOSDAQ' },
  { symbol: '900140', name: '엘브이엠씨홀딩스', price: 23450, change: 350, changePercent: 1.52, market: 'KOSDAQ' },
  { symbol: '214370', name: '케어젠', price: 298000, change: -12000, changePercent: -3.87, market: 'KOSDAQ' },
  { symbol: '278280', name: '천보', price: 89700, change: 2400, changePercent: 2.75, market: 'KOSDAQ' },
  { symbol: '950140', name: '잉글우드랩', price: 67800, change: 1800, changePercent: 2.73, market: 'KOSDAQ' },
  { symbol: '041510', name: '에스엠', price: 156000, change: -3000, changePercent: -1.89, market: 'KOSDAQ' }
]

const sp500Base: StockSeed[] = [
  { symbol: 'AAPL', name: '애플', price: 185.42, change: 2.15, changePercent: 1.17, market: 'SP500' },
  { symbol: 'MSFT', name: '마이크로소프트', price: 378.91, change: -1.23, changePercent: -0.32, market: 'SP500' },
  { symbol: 'GOOGL', name: '알파벳 A', price: 142.56, change: 3.78, changePercent: 2.72, market: 'SP500' },
  { symbol: 'AMZN', name: '아마존', price: 151.23, change: -0.89, changePercent: -0.58, market: 'SP500' },
  { symbol: 'NVDA', name: '엔비디아', price: 456.78, change: 8.92, changePercent: 1.99, market: 'SP500' },
  { symbol: 'TSLA', name: '테슬라', price: 248.67, change: 12.45, changePercent: 5.27, market: 'SP500' },
  { symbol: 'META', name: '메타', price: 334.12, change: 4.56, changePercent: 1.38, market: 'SP500' },
  { symbol: 'BRK.B', name: '버크셔 해서웨이 B', price: 367.89, change: -2.34, changePercent: -0.63, market: 'SP500' },
  { symbol: 'UNH', name: '유나이티드헬스', price: 523.45, change: 6.78, changePercent: 1.31, market: 'SP500' },
  { symbol: 'JNJ', name: '존슨앤존슨', price: 167.45, change: -0.67, changePercent: -0.40, market: 'SP500' },
  { symbol: 'V', name: '비자', price: 267.89, change: 0.45, changePercent: 0.17, market: 'SP500' },
  { symbol: 'XOM', name: '엑손모빌', price: 112.34, change: 2.89, changePercent: 2.64, market: 'SP500' },
  { symbol: 'WMT', name: '월마트', price: 156.78, change: 1.23, changePercent: 0.79, market: 'SP500' },
  { symbol: 'JPM', name: 'JP모건체이스', price: 156.78, change: 2.34, changePercent: 1.51, market: 'SP500' },
  { symbol: 'PG', name: '프록터앤갬블', price: 145.67, change: -0.89, changePercent: -0.61, market: 'SP500' },
  { symbol: 'MA', name: '마스터카드', price: 389.45, change: 3.21, changePercent: 0.83, market: 'SP500' },
  { symbol: 'HD', name: '홈디포', price: 334.56, change: -1.78, changePercent: -0.53, market: 'SP500' },
  { symbol: 'CVX', name: '셰브론', price: 156.89, change: 4.12, changePercent: 2.70, market: 'SP500' },
  { symbol: 'ABBV', name: '애브비', price: 145.23, change: -2.45, changePercent: -1.66, market: 'SP500' },
  { symbol: 'BAC', name: '뱅크오브아메리카', price: 34.67, change: 0.78, changePercent: 2.30, market: 'SP500' },
  { symbol: 'KO', name: '코카콜라', price: 58.90, change: -0.34, changePercent: -0.57, market: 'SP500' },
  { symbol: 'AVGO', name: '브로드컴', price: 1234.56, change: 23.45, changePercent: 1.94, market: 'SP500' },
  { symbol: 'PEP', name: '펩시코', price: 167.89, change: 1.45, changePercent: 0.87, market: 'SP500' },
  { symbol: 'TMO', name: '써모피셔', price: 567.23, change: -8.90, changePercent: -1.54, market: 'SP500' },
  { symbol: 'COST', name: '코스트코', price: 789.45, change: 12.34, changePercent: 1.59, market: 'SP500' },
  { symbol: 'LLY', name: '일라이릴리', price: 456.78, change: -5.67, changePercent: -1.23, market: 'SP500' },
  { symbol: 'MRK', name: '머크', price: 123.45, change: 2.10, changePercent: 1.73, market: 'SP500' },
  { symbol: 'ABT', name: '애보트', price: 98.76, change: -1.23, changePercent: -1.23, market: 'SP500' },
  { symbol: 'ACN', name: '액센츄어', price: 345.67, change: 4.56, changePercent: 1.34, market: 'SP500' },
  { symbol: 'NFLX', name: '넷플릭스', price: 423.89, change: -2.34, changePercent: -0.55, market: 'SP500' }
]

const nasdaqBase: StockSeed[] = [
  { symbol: 'AAPL', name: '애플', price: 185.42, change: 2.15, changePercent: 1.17, market: 'NASDAQ' },
  { symbol: 'MSFT', name: '마이크로소프트', price: 378.91, change: -1.23, changePercent: -0.32, market: 'NASDAQ' },
  { symbol: 'GOOGL', name: '알파벳 A', price: 142.56, change: 3.78, changePercent: 2.72, market: 'NASDAQ' },
  { symbol: 'GOOG', name: '알파벳 C', price: 141.23, change: 3.65, changePercent: 2.65, market: 'NASDAQ' },
  { symbol: 'AMZN', name: '아마존', price: 151.23, change: -0.89, changePercent: -0.58, market: 'NASDAQ' },
  { symbol: 'NVDA', name: '엔비디아', price: 456.78, change: 8.92, changePercent: 1.99, market: 'NASDAQ' },
  { symbol: 'TSLA', name: '테슬라', price: 248.67, change: 12.45, changePercent: 5.27, market: 'NASDAQ' },
  { symbol: 'META', name: '메타', price: 334.12, change: 4.56, changePercent: 1.38, market: 'NASDAQ' },
  { symbol: 'AVGO', name: '브로드컴', price: 1234.56, change: 23.45, changePercent: 1.94, market: 'NASDAQ' },
  { symbol: 'NFLX', name: '넷플릭스', price: 423.89, change: -2.34, changePercent: -0.55, market: 'NASDAQ' },
  { symbol: 'ADBE', name: '어도비', price: 567.23, change: 1.67, changePercent: 0.30, market: 'NASDAQ' },
  { symbol: 'CRM', name: '세일즈포스', price: 234.56, change: -3.21, changePercent: -1.35, market: 'NASDAQ' },
  { symbol: 'ORCL', name: '오라클', price: 123.45, change: 2.89, changePercent: 2.40, market: 'NASDAQ' },
  { symbol: 'CSCO', name: '시스코', price: 56.78, change: 0.89, changePercent: 1.59, market: 'NASDAQ' },
  { symbol: 'INTC', name: '인텔', price: 45.67, change: -1.23, changePercent: -2.62, market: 'NASDAQ' },
  { symbol: 'AMD', name: 'AMD', price: 134.56, change: 4.78, changePercent: 3.68, market: 'NASDAQ' },
  { symbol: 'QCOM', name: '퀄컴', price: 167.89, change: 2.34, changePercent: 1.41, market: 'NASDAQ' },
  { symbol: 'TXN', name: '텍사스인스트루먼트', price: 189.45, change: -1.67, changePercent: -0.87, market: 'NASDAQ' },
  { symbol: 'INTU', name: '인튜이트', price: 567.89, change: 8.90, changePercent: 1.59, market: 'NASDAQ' },
  { symbol: 'ISRG', name: '인튜이티브서지컬', price: 345.67, change: -4.56, changePercent: -1.30, market: 'NASDAQ' },
  { symbol: 'CMCSA', name: '컴캐스트', price: 43.21, change: 0.67, changePercent: 1.58, market: 'NASDAQ' },
  { symbol: 'BKNG', name: '부킹홀딩스', price: 2345.67, change: -23.45, changePercent: -0.99, market: 'NASDAQ' },
  { symbol: 'AMGN', name: '암젠', price: 267.89, change: 3.45, changePercent: 1.31, market: 'NASDAQ' },
  { symbol: 'HON', name: '허니웰', price: 198.76, change: -2.34, changePercent: -1.16, market: 'NASDAQ' },
  { symbol: 'VRTX', name: '버텍스', price: 389.45, change: 6.78, changePercent: 1.77, market: 'NASDAQ' },
  { symbol: 'ADP', name: 'ADP', price: 234.56, change: 1.89, changePercent: 0.81, market: 'NASDAQ' },
  { symbol: 'GILD', name: '길리어드', price: 78.90, change: -0.89, changePercent: -1.12, market: 'NASDAQ' },
  { symbol: 'SBUX', name: '스타벅스', price: 98.76, change: 2.34, changePercent: 2.43, market: 'NASDAQ' },
  { symbol: 'MU', name: '마이크론', price: 89.45, change: 3.21, changePercent: 3.72, market: 'NASDAQ' },
  { symbol: 'ADI', name: '아날로그디바이스', price: 189.34, change: -1.45, changePercent: -0.76, market: 'NASDAQ' },
  { symbol: 'BABA', name: '알리바바', price: 74.32, change: -1.25, changePercent: -1.65, market: 'NASDAQ' }
]

const kospiGenerated: StockSeed[] = [
  { symbol: '323410', name: '카카오뱅크', price: 28400, change: 150, changePercent: 0.53, market: 'KOSPI' },
  { symbol: '377300', name: '카카오페이', price: 48900, change: -1100, changePercent: -2.20, market: 'KOSPI' },
  { symbol: '352820', name: '하이브', price: 215000, change: 3000, changePercent: 1.42, market: 'KOSPI' },
  { symbol: '302440', name: 'SK바이오사이언스', price: 68900, change: -500, changePercent: -0.72, market: 'KOSPI' },
  { symbol: '403870', name: 'HPSP', price: 42300, change: 1200, changePercent: 2.92, market: 'KOSPI' },
  { symbol: '010130', name: '고려아연', price: 489000, change: 2000, changePercent: 0.41, market: 'KOSPI' },
  { symbol: '009540', name: 'HD한국조선해양', price: 112500, change: -1500, changePercent: -1.32, market: 'KOSPI' },
  { symbol: '011070', name: 'LG이노텍', price: 234000, change: 4500, changePercent: 1.96, market: 'KOSPI' },
  { symbol: '034020', name: '두산에너빌리티', price: 15600, change: 200, changePercent: 1.30, market: 'KOSPI' },
  { symbol: '024110', name: '기업은행', price: 11850, change: 50, changePercent: 0.42, market: 'KOSPI' },
  { symbol: '033780', name: 'KT&G', price: 89500, change: -600, changePercent: -0.67, market: 'KOSPI' },
  { symbol: '090430', name: '아모레퍼시픽', price: 124500, change: 3500, changePercent: 2.89, market: 'KOSPI' },
  { symbol: '010140', name: '삼성중공업', price: 7890, change: -40, changePercent: -0.50, market: 'KOSPI' },
  { symbol: '000810', name: '삼성화재', price: 245000, change: 4000, changePercent: 1.66, market: 'KOSPI' },
  { symbol: '012450', name: '한화에어로스페이스', price: 123500, change: 2500, changePercent: 2.07, market: 'KOSPI' },
  { symbol: '042660', name: '한화오션', price: 24500, change: -300, changePercent: -1.21, market: 'KOSPI' },
  { symbol: '326030', name: 'SK바이오팜', price: 89600, change: 1200, changePercent: 1.36, market: 'KOSPI' },
  { symbol: '034730', name: 'SK', price: 167500, change: -2500, changePercent: -1.47, market: 'KOSPI' },
  { symbol: '086280', name: '현대글로비스', price: 189000, change: 3000, changePercent: 1.61, market: 'KOSPI' },
  { symbol: '004020', name: '현대제철', price: 34500, change: 450, changePercent: 1.32, market: 'KOSPI' }
]

const kosdaqGenerated: StockSeed[] = [
  { symbol: '041510', name: '에스엠', price: 156000, change: -3000, changePercent: -1.89, market: 'KOSDAQ' },
  { symbol: '035900', name: 'JYP Ent.', price: 104500, change: 1500, changePercent: 1.46, market: 'KOSDAQ' },
  { symbol: '122870', name: '와이지엔터테인먼트', price: 54300, change: -800, changePercent: -1.45, market: 'KOSDAQ' },
  { symbol: '068240', name: '다원시스', price: 15600, change: 200, changePercent: 1.30, market: 'KOSDAQ' },
  { symbol: '290650', name: '엘앤씨바이오', price: 32400, change: 550, changePercent: 1.73, market: 'KOSDAQ' },
  { symbol: '214450', name: '파마리서치', price: 123000, change: -2000, changePercent: -1.60, market: 'KOSDAQ' },
  { symbol: '042700', name: '한미반도체', price: 62300, change: 1800, changePercent: 2.98, market: 'KOSDAQ' },
  { symbol: '005290', name: '동진쎄미켐', price: 38900, change: -400, changePercent: -1.02, market: 'KOSDAQ' },
  { symbol: '237690', name: '에스티팜', price: 89600, change: 2100, changePercent: 2.40, market: 'KOSDAQ' },
  { symbol: '213420', name: '덕산네오룩스', price: 45600, change: 1200, changePercent: 2.70, market: 'KOSDAQ' },
  { symbol: '402340', name: 'SK스퀘어', price: 56700, change: -800, changePercent: -1.39, market: 'KOSDAQ' }
]

const sp500Generated: StockSeed[] = [
  { symbol: 'DIS', name: '월트 디즈니', price: 92.50, change: -1.20, changePercent: -1.28, market: 'SP500' },
  { symbol: 'NKE', name: '나이키', price: 105.67, change: 2.34, changePercent: 2.26, market: 'SP500' },
  { symbol: 'PFE', name: '화이자', price: 28.45, change: -0.45, changePercent: -1.56, market: 'SP500' },
  { symbol: 'CSCO', name: '시스코', price: 50.12, change: 0.34, changePercent: 0.68, market: 'SP500' },
  { symbol: 'VZ', name: '버라이즌', price: 38.90, change: 0.56, changePercent: 1.46, market: 'SP500' },
  { symbol: 'MCD', name: '맥도날드', price: 290.45, change: -2.10, changePercent: -0.72, market: 'SP500' },
  { symbol: 'ADBE', name: '어도비', price: 590.34, change: 8.90, changePercent: 1.53, market: 'SP500' },
  { symbol: 'WFC', name: '웰스파고', price: 49.67, change: 1.23, changePercent: 2.54, market: 'SP500' },
  { symbol: 'TMUS', name: 'T-모바일', price: 160.78, change: 1.45, changePercent: 0.91, market: 'SP500' },
  { symbol: 'INTC', name: '인텔', price: 45.67, change: -1.23, changePercent: -2.62, market: 'SP500' }
]

const nasdaqGenerated: StockSeed[] = [
  { symbol: 'PYPL', name: '페이팔', price: 62.34, change: -0.56, changePercent: -0.89, market: 'NASDAQ' },
  { symbol: 'MDLZ', name: '몬델리즈', price: 72.45, change: 1.23, changePercent: 1.73, market: 'NASDAQ' },
  { symbol: 'REGN', name: '리제네론', price: 890.12, change: 15.67, changePercent: 1.79, market: 'NASDAQ' },
  { symbol: 'PANW', name: '팔로알토', price: 305.67, change: 12.34, changePercent: 4.21, market: 'NASDAQ' },
  { symbol: 'SNPS', name: '시놉시스', price: 512.34, change: -5.67, changePercent: -1.09, market: 'NASDAQ' },
  { symbol: 'KLAC', name: 'KLA', price: 589.45, change: 10.12, changePercent: 1.75, market: 'NASDAQ' },
  { symbol: 'CDNS', name: '케이던스', price: 289.56, change: 4.56, changePercent: 1.60, market: 'NASDAQ' },
  { symbol: 'MELI', name: '메르카도리브레', price: 1678.90, change: 45.67, changePercent: 2.80, market: 'NASDAQ' },
  { symbol: 'MAR', name: '메리어트', price: 223.45, change: 2.34, changePercent: 1.06, market: 'NASDAQ' },
  { symbol: 'CTAS', name: '신타스', price: 601.23, change: 5.67, changePercent: 0.95, market: 'NASDAQ' }
]

export const stockSeedData: StockSeed[] = [
  ...kospiBase,
  ...kospiGenerated,
  ...kosdaqBase,
  ...kosdaqGenerated,
  ...sp500Base,
  ...sp500Generated,
  ...nasdaqBase,
  ...nasdaqGenerated
]

export const stockSeedMap = new Map<string, StockSeed>(
  stockSeedData.map((s) => [s.symbol, s])
)
export const buildStockResponse = (symbols?: string[], market?: StockMarket) => {
  let data = stockSeedData
  if (symbols && symbols.length > 0) {
    const lookup = new Set(symbols)
    data = data.filter((s) => lookup.has(s.symbol))
  }
  if (market) {
    data = data.filter((s) => s.market === market)
  }
  return data
}

