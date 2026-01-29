// Mock data for market indices
export const marketIndices = [
  {
    name: 'KOSPI',
    value: 2456.78,
    change: 12.34,
    changePercent: 0.51,
    timezone: 'KST',
    data: [
      { time: '09:00', value: 2444.44 },
      { time: '09:30', value: 2448.12 },
      { time: '10:00', value: 2452.67 },
      { time: '10:30', value: 2449.23 },
      { time: '11:00', value: 2453.89 },
      { time: '11:30', value: 2451.45 },
      { time: '12:00', value: 2455.12 },
      { time: '12:30', value: 2458.34 },
      { time: '13:00', value: 2454.67 },
      { time: '13:30', value: 2459.23 },
      { time: '14:00', value: 2456.78 },
    ]
  },
  {
    name: 'KOSDAQ',
    value: 789.45,
    change: -3.21,
    changePercent: -0.41,
    timezone: 'KST',
    data: [
      { time: '09:00', value: 792.66 },
      { time: '09:30', value: 791.23 },
      { time: '10:00', value: 788.90 },
      { time: '10:30', value: 790.12 },
      { time: '11:00', value: 787.34 },
      { time: '11:30', value: 789.67 },
      { time: '12:00', value: 785.23 },
      { time: '12:30', value: 788.45 },
      { time: '13:00', value: 791.12 },
      { time: '13:30', value: 787.89 },
      { time: '14:00', value: 789.45 },
    ]
  },
  {
    name: 'S&P 500',
    value: 4567.89,
    change: 23.45,
    changePercent: 0.52,
    timezone: 'KST',
    data: [
      { time: '23:30', value: 4544.44 }, // 미국 시장을 한국 시간으로 변환
      { time: '00:00', value: 4551.23 },
      { time: '00:30', value: 4558.67 },
      { time: '01:00', value: 4562.12 },
      { time: '01:30', value: 4565.34 },
      { time: '02:00', value: 4559.78 },
      { time: '02:30', value: 4563.45 },
      { time: '03:00', value: 4568.12 },
      { time: '03:30', value: 4571.23 },
      { time: '04:00', value: 4569.67 },
      { time: '04:30', value: 4567.89 },
    ]
  },
  {
    name: 'NASDAQ',
    value: 14234.56,
    change: -45.67,
    changePercent: -0.32,
    timezone: 'KST',
    data: [
      { time: '23:30', value: 14280.23 }, // 미국 시장을 한국 시간으로 변환
      { time: '00:00', value: 14267.89 },
      { time: '00:30', value: 14245.12 },
      { time: '01:00', value: 14251.34 },
      { time: '01:30', value: 14238.90 },
      { time: '02:00', value: 14242.67 },
      { time: '02:30', value: 14235.45 },
      { time: '03:00', value: 14248.78 },
      { time: '03:30', value: 14241.23 },
      { time: '04:00', value: 14237.89 },
      { time: '04:30', value: 14234.56 },
    ]
  }
]

// Top 15 companies for watchlist selection
export const topCompanies = [
  {
    symbol: 'AAPL',
    name: '애플',
    englishName: 'Apple Inc.',
    logo: '/images/aapl.svg?v=1',
    color: '#000000'
  },
  {
    symbol: 'MSFT',
    name: '마이크로소프트',
    englishName: 'Microsoft Corporation',
    logo: '/images/msft.svg?v=1',
    color: '#00BCF2'
  },
  {
    symbol: 'GOOGL',
    name: '구글',
    englishName: 'Alphabet Inc.',
    logo: '/images/googl.svg?v=1',
    color: '#4285F4'
  },
  {
    symbol: 'AMZN',
    name: '아마존',
    englishName: 'Amazon.com Inc.',
    logo: '/images/amzn.svg?v=1',
    color: '#FF9900'
  },
  {
    symbol: 'TSLA',
    name: '테슬라',
    englishName: 'Tesla Inc.',
    logo: '/images/tsla.svg?v=1',
    color: '#CC0000'
  },
  {
    symbol: 'META',
    name: '메타',
    englishName: 'Meta Platforms Inc.',
    logo: '/images/meta.svg?v=1',
    color: '#1877F2'
  },
  {
    symbol: 'NVDA',
    name: '엔비디아',
    englishName: 'NVIDIA Corporation',
    logo: '/images/nvda.svg?v=1',
    color: '#76B900'
  },
  {
    symbol: 'NFLX',
    name: '넷플릭스',
    englishName: 'Netflix Inc.',
    logo: '/images/nflx.svg?v=1',
    color: '#E50914'
  },
  {
    symbol: 'ADBE',
    name: '어도비',
    englishName: 'Adobe Inc.',
    logo: '/images/adbe.svg?v=1',
    color: '#FF0000'
  },
  {
    symbol: 'CRM',
    name: '세일즈포스',
    englishName: 'Salesforce Inc.',
    logo: '/images/crm.svg?v=1',
    color: '#00A1E0'
  },
  {
    symbol: '005930.KS',
    name: '삼성전자',
    englishName: 'Samsung Electronics',
    logo: '/images/samsung.svg?v=1',
    color: '#1428A0'
  },
  {
    symbol: 'BABA',
    name: '알리바바',
    englishName: 'Alibaba Group',
    logo: '/images/baba.svg?v=1',
    color: '#FF6A00'
  },
  {
    symbol: 'V',
    name: '비자',
    englishName: 'Visa Inc.',
    logo: '/images/v.svg?v=1',
    color: '#1A1F71'
  },
  {
    symbol: 'JPM',
    name: 'JP모건',
    englishName: 'JPMorgan Chase',
    logo: '/images/jpm.svg?v=1',
    color: '#0066B2'
  },
  {
    symbol: 'JNJ',
    name: '존슨앤존슨',
    englishName: 'Johnson & Johnson',
    logo: '/images/jnj.svg?v=1',
    color: '#CC0000'
  }
]

// Mock stock prices for watchlist - 고정된 가격 정보
export const fixedStockPrices: Record<string, { price: number; change: number; changePercent: number }> = {
  'AAPL': { price: 185.42, change: 2.15, changePercent: 1.17 },
  'MSFT': { price: 378.91, change: -1.23, changePercent: -0.32 },
  'GOOGL': { price: 142.56, change: 3.78, changePercent: 2.72 },
  'AMZN': { price: 151.23, change: -0.89, changePercent: -0.58 },
  'TSLA': { price: 248.67, change: 12.45, changePercent: 5.27 },
  'META': { price: 334.12, change: 4.56, changePercent: 1.38 },
  'NVDA': { price: 456.78, change: 8.92, changePercent: 1.99 },
  'NFLX': { price: 423.89, change: -2.34, changePercent: -0.55 },
  'ADBE': { price: 567.23, change: 1.67, changePercent: 0.30 },
  'CRM': { price: 234.56, change: -3.21, changePercent: -1.35 },
  '005930.KS': { price: 71800, change: 900, changePercent: 1.27 },
  'BABA': { price: 89.45, change: -1.78, changePercent: -1.95 },
  'V': { price: 267.89, change: 0.45, changePercent: 0.17 },
  'JPM': { price: 156.78, change: 2.34, changePercent: 1.51 },
  'JNJ': { price: 167.45, change: -0.67, changePercent: -0.40 }
}

export const getStockPrice = (symbol: string) => {
  return fixedStockPrices[symbol] || { price: 100, change: 0, changePercent: 0 }
}

// KOSPI 상위 100개 종목 (시가총액 기준)
export const kospiStocks = [
  { symbol: '005930', name: '삼성전자', price: 71800, change: 900, changePercent: 1.27 },
  { symbol: '000660', name: 'SK하이닉스', price: 128500, change: -2500, changePercent: -1.91 },
  { symbol: '373220', name: 'LG에너지솔루션', price: 412000, change: 8000, changePercent: 1.98 },
  { symbol: '207940', name: '삼성바이오로직스', price: 789000, change: -15000, changePercent: -1.87 },
  { symbol: '005490', name: 'POSCO홀딩스', price: 389000, change: 12000, changePercent: 3.18 },
  { symbol: '035420', name: 'NAVER', price: 189500, change: 3500, changePercent: 1.88 },
  { symbol: '006400', name: '삼성SDI', price: 456000, change: -8000, changePercent: -1.72 },
  { symbol: '051910', name: 'LG화학', price: 398000, change: 15000, changePercent: 3.93 },
  { symbol: '068270', name: '셀트리온', price: 178900, change: -2100, changePercent: -1.16 },
  { symbol: '035720', name: '카카오', price: 45650, change: 850, changePercent: 1.90 },
  { symbol: '005380', name: '현대차', price: 198500, change: 4500, changePercent: 2.32 },
  { symbol: '000270', name: '기아', price: 89400, change: 1800, changePercent: 2.05 },
  { symbol: '012330', name: '현대모비스', price: 234000, change: -3000, changePercent: -1.27 },
  { symbol: '028260', name: '삼성물산', price: 123000, change: 2000, changePercent: 1.65 },
  { symbol: '066570', name: 'LG전자', price: 89700, change: 1200, changePercent: 1.36 },
  { symbol: '003670', name: '포스코퓨처엠', price: 298000, change: -5000, changePercent: -1.65 },
  { symbol: '096770', name: 'SK이노베이션', price: 145600, change: 3400, changePercent: 2.39 },
  { symbol: '017670', name: 'SK텔레콤', price: 52300, change: -800, changePercent: -1.51 },
  { symbol: '030200', name: 'KT', price: 34850, change: 450, changePercent: 1.31 },
  { symbol: '003550', name: 'LG', price: 78900, change: 1100, changePercent: 1.41 },
  { symbol: '015760', name: '한국전력', price: 19850, change: -250, changePercent: -1.24 },
  { symbol: '018260', name: '삼성에스디에스', price: 156000, change: 2000, changePercent: 1.30 },
  { symbol: '032830', name: '삼성생명', price: 67800, change: -900, changePercent: -1.31 },
  { symbol: '010950', name: 'S-Oil', price: 89600, change: 2100, changePercent: 2.40 },
  { symbol: '009150', name: '삼성전기', price: 156000, change: -2000, changePercent: -1.27 },
  { symbol: '011200', name: 'HMM', price: 23450, change: 650, changePercent: 2.85 },
  { symbol: '251270', name: '넷마블', price: 67800, change: -1200, changePercent: -1.74 },
  { symbol: '105560', name: 'KB금융', price: 56700, change: 800, changePercent: 1.43 },
  { symbol: '055550', name: '신한지주', price: 38950, change: 550, changePercent: 1.43 },
  { symbol: '086790', name: '하나금융지주', price: 45600, change: 700, changePercent: 1.56 },
  { symbol: '323410', name: '카카오뱅크', price: 28400, change: 150, changePercent: 0.53 },
  { symbol: '377300', name: '카카오페이', price: 48900, change: -1100, changePercent: -2.20 },
  { symbol: '352820', name: '하이브', price: 215000, change: 3000, changePercent: 1.42 },
  { symbol: '302440', name: 'SK바이오사이언스', price: 68900, change: -500, changePercent: -0.72 },
  { symbol: '403870', name: 'HPSP', price: 42300, change: 1200, changePercent: 2.92 },
  { symbol: '010130', name: '고려아연', price: 489000, change: 2000, changePercent: 0.41 },
  { symbol: '009540', name: 'HD한국조선해양', price: 112500, change: -1500, changePercent: -1.32 },
  { symbol: '011070', name: 'LG이노텍', price: 234000, change: 4500, changePercent: 1.96 },
  { symbol: '034020', name: '두산에너빌리티', price: 15600, change: 200, changePercent: 1.30 },
  { symbol: '024110', name: '기업은행', price: 11850, change: 50, changePercent: 0.42 },
  { symbol: '033780', name: 'KT&G', price: 89500, change: -600, changePercent: -0.67 },
  { symbol: '090430', name: '아모레퍼시픽', price: 124500, change: 3500, changePercent: 2.89 },
  { symbol: '010140', name: '삼성중공업', price: 7890, change: -40, changePercent: -0.50 },
  { symbol: '000810', name: '삼성화재', price: 245000, change: 4000, changePercent: 1.66 },
  { symbol: '012450', name: '한화에어로스페이스', price: 123500, change: 2500, changePercent: 2.07 },
  { symbol: '042660', name: '한화오션', price: 24500, change: -300, changePercent: -1.21 },
  { symbol: '326030', name: 'SK바이오팜', price: 89600, change: 1200, changePercent: 1.36 },
  { symbol: '034730', name: 'SK', price: 167500, change: -2500, changePercent: -1.47 },
  { symbol: '086280', name: '현대글로비스', price: 189000, change: 3000, changePercent: 1.61 },
  { symbol: '004020', name: '현대제철', price: 34500, change: 450, changePercent: 1.32 }
]

// KOSDAQ 상위 100개 종목 (시가총액 기준)
export const kosdaqStocks = [
  { symbol: '091990', name: '셀트리온헬스케어', price: 89400, change: -1600, changePercent: -1.76 },
  { symbol: '196170', name: '알테오젠', price: 78900, change: 2100, changePercent: 2.73 },
  { symbol: '068760', name: '셀트리온제약', price: 156000, change: -3000, changePercent: -1.89 },
  { symbol: '263750', name: '펄어비스', price: 45600, change: 800, changePercent: 1.79 },
  { symbol: '039030', name: '이오테크닉스', price: 234000, change: 12000, changePercent: 5.41 },
  { symbol: '112040', name: '위메이드', price: 67800, change: -2100, changePercent: -3.00 },
  { symbol: '214150', name: '클래시스', price: 34500, change: 1200, changePercent: 3.60 },
  { symbol: '293490', name: '카카오게임즈', price: 23450, change: -450, changePercent: -1.88 },
  { symbol: '357780', name: '솔브레인', price: 298000, change: 15000, changePercent: 5.30 },
  { symbol: '086520', name: '에코프로', price: 456000, change: -18000, changePercent: -3.80 },
  { symbol: '247540', name: '에코프로비엠', price: 189000, change: 8000, changePercent: 4.42 },
  { symbol: '121600', name: '나노신소재', price: 123000, change: -2000, changePercent: -1.60 },
  { symbol: '348370', name: '엔켐', price: 78900, change: 3400, changePercent: 4.50 },
  { symbol: '066970', name: '엘앤에프', price: 234000, change: -8000, changePercent: -3.31 },
  { symbol: '058470', name: '리노공업', price: 156000, change: 6000, changePercent: 4.00 },
  { symbol: '095340', name: 'ISC', price: 89700, change: -1800, changePercent: -1.97 },
  { symbol: '240810', name: '원익IPS', price: 45600, change: 1200, changePercent: 2.70 },
  { symbol: '067310', name: '하나마이크론', price: 67800, change: -900, changePercent: -1.31 },
  { symbol: '108860', name: '셀바스AI', price: 23450, change: 650, changePercent: 2.85 },
  { symbol: '322000', name: 'HD현대미포', price: 89600, change: 2100, changePercent: 2.40 },
  { symbol: '036930', name: '주성엔지니어링', price: 34850, change: -450, changePercent: -1.27 },
  { symbol: '078600', name: '대주전자재료', price: 156000, change: 4000, changePercent: 2.63 },
  { symbol: '131970', name: '두산테스나', price: 78900, change: -1100, changePercent: -1.37 },
  { symbol: '145020', name: '휴젤', price: 234000, change: 8000, changePercent: 3.54 },
  { symbol: '196490', name: '디에이테크놀로지', price: 45600, change: -800, changePercent: -1.72 },
  { symbol: '900140', name: '엘브이엠씨홀딩스', price: 23450, change: 350, changePercent: 1.52 },
  { symbol: '214370', name: '케어젠', price: 298000, change: -12000, changePercent: -3.87 },
  { symbol: '278280', name: '천보', price: 89700, change: 2400, changePercent: 2.75 },
  { symbol: '950140', name: '잉글우드랩', price: 67800, change: 1800, changePercent: 2.73 },
  { symbol: '041510', name: '에스엠', price: 156000, change: -3000, changePercent: -1.89 },
  { symbol: '035900', name: 'JYP Ent.', price: 104500, change: 1500, changePercent: 1.46 },
  { symbol: '122870', name: '와이지엔터테인먼트', price: 54300, change: -800, changePercent: -1.45 },
  { symbol: '068240', name: '다원시스', price: 15600, change: 200, changePercent: 1.30 },
  { symbol: '290650', name: '엘앤씨바이오', price: 32400, change: 550, changePercent: 1.73 },
  { symbol: '214450', name: '파마리서치', price: 123000, change: -2000, changePercent: -1.60 },
  { symbol: '042700', name: '한미반도체', price: 62300, change: 1800, changePercent: 2.98 },
  { symbol: '005290', name: '동진쎄미켐', price: 38900, change: -400, changePercent: -1.02 },
  { symbol: '237690', name: '에스티팜', price: 89600, change: 2100, changePercent: 2.40 },
  { symbol: '213420', name: '덕산네오룩스', price: 45600, change: 1200, changePercent: 2.70 },
  { symbol: '402340', name: 'SK스퀘어', price: 56700, change: -800, changePercent: -1.39 }
]

// Mock news data
export const mockNews = [
  {
    id: 1,
    title: "연준, 인플레이션 둔화로 금리 인하 신호",
    url: "https://example.com/news/1"
  },
  {
    id: 2,
    title: "테크 주식, 강력한 실적 발표로 랠리 지속",
    url: "https://example.com/news/2"
  },
  {
    id: 3,
    title: "공급망 우려로 유가 급등",
    url: "https://example.com/news/3"
  },
  {
    id: 4,
    title: "암호화폐 시장, 회복 조짐 보여",
    url: "https://example.com/news/4"
  },
  {
    id: 5,
    title: "무역 협정 소식에 글로벌 시장 반응",
    url: "https://example.com/news/5"
  }
]
// S&P 500 상위 100개 종목 (시가총액 기준)
export const sp500Stocks = [
  { symbol: 'AAPL', name: '애플', price: 185.42, change: 2.15, changePercent: 1.17 },
  { symbol: 'MSFT', name: '마이크로소프트', price: 378.91, change: -1.23, changePercent: -0.32 },
  { symbol: 'GOOGL', name: '알파벳 A', price: 142.56, change: 3.78, changePercent: 2.72 },
  { symbol: 'AMZN', name: '아마존', price: 151.23, change: -0.89, changePercent: -0.58 },
  { symbol: 'NVDA', name: '엔비디아', price: 456.78, change: 8.92, changePercent: 1.99 },
  { symbol: 'TSLA', name: '테슬라', price: 248.67, change: 12.45, changePercent: 5.27 },
  { symbol: 'META', name: '메타', price: 334.12, change: 4.56, changePercent: 1.38 },
  { symbol: 'BRK.B', name: '버크셔 해서웨이 B', price: 367.89, change: -2.34, changePercent: -0.63 },
  { symbol: 'UNH', name: '유나이티드헬스', price: 523.45, change: 6.78, changePercent: 1.31 },
  { symbol: 'JNJ', name: '존슨앤존슨', price: 167.45, change: -0.67, changePercent: -0.40 },
  { symbol: 'V', name: '비자', price: 267.89, change: 0.45, changePercent: 0.17 },
  { symbol: 'XOM', name: '엑손모빌', price: 112.34, change: 2.89, changePercent: 2.64 },
  { symbol: 'WMT', name: '월마트', price: 156.78, change: 1.23, changePercent: 0.79 },
  { symbol: 'JPM', name: 'JP모건체이스', price: 156.78, change: 2.34, changePercent: 1.51 },
  { symbol: 'PG', name: '프록터앤갬블', price: 145.67, change: -0.89, changePercent: -0.61 },
  { symbol: 'MA', name: '마스터카드', price: 389.45, change: 3.21, changePercent: 0.83 },
  { symbol: 'HD', name: '홈디포', price: 334.56, change: -1.78, changePercent: -0.53 },
  { symbol: 'CVX', name: '셰브론', price: 156.89, change: 4.12, changePercent: 2.70 },
  { symbol: 'ABBV', name: '애브비', price: 145.23, change: -2.45, changePercent: -1.66 },
  { symbol: 'BAC', name: '뱅크오브아메리카', price: 34.67, change: 0.78, changePercent: 2.30 },
  { symbol: 'KO', name: '코카콜라', price: 58.90, change: -0.34, changePercent: -0.57 },
  { symbol: 'AVGO', name: '브로드컴', price: 1234.56, change: 23.45, changePercent: 1.94 },
  { symbol: 'PEP', name: '펩시코', price: 167.89, change: 1.45, changePercent: 0.87 },
  { symbol: 'TMO', name: '써모피셔', price: 567.23, change: -8.90, changePercent: -1.54 },
  { symbol: 'COST', name: '코스트코', price: 789.45, change: 12.34, changePercent: 1.59 },
  { symbol: 'LLY', name: '일라이릴리', price: 456.78, change: -5.67, changePercent: -1.23 },
  { symbol: 'MRK', name: '머크', price: 123.45, change: 2.10, changePercent: 1.73 },
  { symbol: 'ABT', name: '애보트', price: 98.76, change: -1.23, changePercent: -1.23 },
  { symbol: 'ACN', name: '액센츄어', price: 345.67, change: 4.56, changePercent: 1.34 },
  { symbol: 'NFLX', name: '넷플릭스', price: 423.89, change: -2.34, changePercent: -0.55 },
  { symbol: 'DIS', name: '월트 디즈니', price: 92.50, change: -1.20, changePercent: -1.28 },
  { symbol: 'NKE', name: '나이키', price: 105.67, change: 2.34, changePercent: 2.26 },
  { symbol: 'PFE', name: '화이자', price: 28.45, change: -0.45, changePercent: -1.56 },
  { symbol: 'CSCO', name: '시스코', price: 50.12, change: 0.34, changePercent: 0.68 },
  { symbol: 'VZ', name: '버라이즌', price: 38.90, change: 0.56, changePercent: 1.46 },
  { symbol: 'MCD', name: '맥도날드', price: 290.45, change: -2.10, changePercent: -0.72 },
  { symbol: 'ADBE', name: '어도비', price: 590.34, change: 8.90, changePercent: 1.53 },
  { symbol: 'WFC', name: '웰스파고', price: 49.67, change: 1.23, changePercent: 2.54 },
  { symbol: 'TMUS', name: 'T-모바일', price: 160.78, change: 1.45, changePercent: 0.91 },
  { symbol: 'INTC', name: '인텔', price: 45.67, change: -1.23, changePercent: -2.62 }
]

// NASDAQ 상위 100개 종목 (시가총액 기준)
export const nasdaqStocks = [
  { symbol: 'AAPL', name: '애플', price: 185.42, change: 2.15, changePercent: 1.17 },
  { symbol: 'MSFT', name: '마이크로소프트', price: 378.91, change: -1.23, changePercent: -0.32 },
  { symbol: 'GOOGL', name: '알파벳 A', price: 142.56, change: 3.78, changePercent: 2.72 },
  { symbol: 'GOOG', name: '알파벳 C', price: 141.23, change: 3.65, changePercent: 2.65 },
  { symbol: 'AMZN', name: '아마존', price: 151.23, change: -0.89, changePercent: -0.58 },
  { symbol: 'NVDA', name: '엔비디아', price: 456.78, change: 8.92, changePercent: 1.99 },
  { symbol: 'TSLA', name: '테슬라', price: 248.67, change: 12.45, changePercent: 5.27 },
  { symbol: 'META', name: '메타', price: 334.12, change: 4.56, changePercent: 1.38 },
  { symbol: 'AVGO', name: '브로드컴', price: 1234.56, change: 23.45, changePercent: 1.94 },
  { symbol: 'NFLX', name: '넷플릭스', price: 423.89, change: -2.34, changePercent: -0.55 },
  { symbol: 'ADBE', name: '어도비', price: 567.23, change: 1.67, changePercent: 0.30 },
  { symbol: 'CRM', name: '세일즈포스', price: 234.56, change: -3.21, changePercent: -1.35 },
  { symbol: 'ORCL', name: '오라클', price: 123.45, change: 2.89, changePercent: 2.40 },
  { symbol: 'CSCO', name: '시스코', price: 56.78, change: 0.89, changePercent: 1.59 },
  { symbol: 'INTC', name: '인텔', price: 45.67, change: -1.23, changePercent: -2.62 },
  { symbol: 'AMD', name: 'AMD', price: 134.56, change: 4.78, changePercent: 3.68 },
  { symbol: 'QCOM', name: '퀄컴', price: 167.89, change: 2.34, changePercent: 1.41 },
  { symbol: 'TXN', name: '텍사스인스트루먼트', price: 189.45, change: -1.67, changePercent: -0.87 },
  { symbol: 'INTU', name: '인튜이트', price: 567.89, change: 8.90, changePercent: 1.59 },
  { symbol: 'ISRG', name: '인튜이티브서지컬', price: 345.67, change: -4.56, changePercent: -1.30 },
  { symbol: 'CMCSA', name: '컴캐스트', price: 43.21, change: 0.67, changePercent: 1.58 },
  { symbol: 'BKNG', name: '부킹홀딩스', price: 2345.67, change: -23.45, changePercent: -0.99 },
  { symbol: 'AMGN', name: '암젠', price: 267.89, change: 3.45, changePercent: 1.31 },
  { symbol: 'HON', name: '허니웰', price: 198.76, change: -2.34, changePercent: -1.16 },
  { symbol: 'VRTX', name: '버텍스', price: 389.45, change: 6.78, changePercent: 1.77 },
  { symbol: 'ADP', name: 'ADP', price: 234.56, change: 1.89, changePercent: 0.81 },
  { symbol: 'GILD', name: '길리어드', price: 78.90, change: -0.89, changePercent: -1.12 },
  { symbol: 'SBUX', name: '스타벅스', price: 98.76, change: 2.34, changePercent: 2.43 },
  { symbol: 'MU', name: '마이크론', price: 89.45, change: 3.21, changePercent: 3.72 },
  { symbol: 'ADI', name: '아날로그디바이스', price: 189.34, change: -1.45, changePercent: -0.76 },
  { symbol: 'PYPL', name: '페이팔', price: 62.34, change: -0.56, changePercent: -0.89 },
  { symbol: 'MDLZ', name: '몬델리즈', price: 72.45, change: 1.23, changePercent: 1.73 },
  { symbol: 'REGN', name: '리제네론', price: 890.12, change: 15.67, changePercent: 1.79 },
  { symbol: 'PANW', name: '팔로알토', price: 305.67, change: 12.34, changePercent: 4.21 },
  { symbol: 'SNPS', name: '시놉시스', price: 512.34, change: -5.67, changePercent: -1.09 },
  { symbol: 'KLAC', name: 'KLA', price: 589.45, change: 10.12, changePercent: 1.75 },
  { symbol: 'CDNS', name: '케이던스', price: 289.56, change: 4.56, changePercent: 1.60 },
  { symbol: 'MELI', name: '메르카도리브레', price: 1678.90, change: 45.67, changePercent: 2.80 },
  { symbol: 'MAR', name: '메리어트', price: 223.45, change: 2.34, changePercent: 1.06 },
  { symbol: 'CTAS', name: '신타스', price: 601.23, change: 5.67, changePercent: 0.95 }
]
// 모든 주식 데이터를 하나로 합치는 함수
export const getAllStocks = () => {
  return [
    ...kospiStocks.map(stock => ({ ...stock, market: 'KOSPI' })),
    ...kosdaqStocks.map(stock => ({ ...stock, market: 'KOSDAQ' })),
    ...sp500Stocks.map(stock => ({ ...stock, market: 'SP500' })),
    ...nasdaqStocks.map(stock => ({ ...stock, market: 'NASDAQ' }))
  ]
}

// 더미 사용자 데이터
export const getDummyUsers = () => [
  { id: '1', name: '투자왕김씨', email: 'kim@example.com' },
  { id: '2', name: '주식고수', email: 'master@example.com' },
  { id: '3', name: '코스피러버', email: 'kospi@example.com' },
  { id: '4', name: '나스닥킹', email: 'nasdaq@example.com' },
  { id: '5', name: '가치투자자', email: 'value@example.com' },
  { id: '6', name: '성장주헌터', email: 'growth@example.com' },
  { id: '7', name: '배당주좋아', email: 'dividend@example.com' },
  { id: '8', name: '테크주매니아', email: 'tech@example.com' },
  { id: '9', name: '바이오투자', email: 'bio@example.com' },
  { id: '10', name: '반도체왕', email: 'semi@example.com' }
]

// 종목별 게시글 생성 함수
export const getStockPosts = (symbol: string) => {
  const users = getDummyUsers()
  const allStocks = getAllStocks()
  const stock = allStocks.find(s => s.symbol === symbol)

  if (!stock) return []

  // 상위 50% 종목은 활발한 토론, 하위 50%는 적은 토론
  const stockIndex = allStocks.findIndex(s => s.symbol === symbol)
  const isTopStock = stockIndex < allStocks.length / 2

  const postTemplates = [
    {
      title: `${stock.name} 오늘 상승세 어떻게 보시나요?`,
      content: `${stock.name}이 오늘 ${stock.changePercent > 0 ? '상승' : '하락'}하고 있는데, 여러분은 어떻게 생각하시나요? 앞으로의 전망이 궁금합니다.`,
      type: 'neutral'
    },
    {
      title: `${stock.name} 매수 타이밍인가요?`,
      content: `${stock.name}을 관심있게 보고 있는데, 지금이 매수 타이밍일까요? 기술적 분석으로는 어떻게 보이시나요?`,
      type: 'positive'
    },
    {
      title: `${stock.name} 실적 발표 후 전망`,
      content: `최근 실적 발표를 보니 ${stock.changePercent > 0 ? '기대보다 좋았습니다' : '아쉬운 부분이 있네요'}. 다음 분기 전망은 어떻게 보시나요?`,
      type: 'analysis'
    },
    {
      title: `${stock.name} 장기 투자 관점에서`,
      content: `${stock.name}을 장기 투자 관점에서 보면 어떨까요? 5년 후를 생각하면 지금 가격이 매력적인지 의견 부탁드립니다.`,
      type: 'longterm'
    },
    {
      title: `${stock.name} 리스크 요인들`,
      content: `${stock.name}에 투자할 때 주의해야 할 리스크 요인들이 무엇이 있을까요? 경험 있으신 분들의 조언 부탁드립니다.`,
      type: 'risk'
    },
    {
      title: `${stock.name} 수익 인증합니다!`,
      content: `${stock.name}으로 좋은 수익을 봤습니다! 여러분도 좋은 결과 있으시길 바랍니다. 다음 목표가는 어디로 보시나요?`,
      type: 'profit'
    },
    {
      title: `${stock.name} 주의하세요`,
      content: `${stock.name}에 대해 부정적인 뉴스들이 나오고 있는 것 같은데, 투자하시는 분들은 주의하시기 바랍니다.`,
      type: 'warning'
    },
    {
      title: `${stock.name} 관련 뉴스 공유`,
      content: `${stock.name} 관련해서 흥미로운 뉴스를 봤는데, 이게 주가에 어떤 영향을 줄지 궁금하네요. 어떻게 생각하시나요?`,
      type: 'news'
    }
  ]

  const numPosts = isTopStock ? Math.floor(Math.random() * 8) + 5 : Math.floor(Math.random() * 3) + 1
  const posts = []

  for (let i = 0; i < numPosts; i++) {
    const template = postTemplates[Math.floor(Math.random() * postTemplates.length)]
    const user = users[Math.floor(Math.random() * users.length)]
    const daysAgo = Math.floor(Math.random() * 7)
    const createdAt = new Date()
    createdAt.setDate(createdAt.getDate() - daysAgo)

    posts.push({
      id: `${symbol}-${i}`,
      title: template.title,
      content: template.content,
      author: user.name,
      createdAt: createdAt.toISOString(),
      likes: Math.floor(Math.random() * (isTopStock ? 50 : 10)),
      comments: Math.floor(Math.random() * (isTopStock ? 20 : 5)),
      isLiked: false
    })
  }

  return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}