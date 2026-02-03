export interface MarketConfig {
    timeZone: string
    locale: string
    openHour: number
    openMinute: number
    durationHours: number
    label: string
}

export const getMarketConfig = (name: string, symbol: string): MarketConfig => {
    const n = name.toUpperCase()
    const s = symbol.toUpperCase()

    if (n.includes('NASDAQ') || s === '^IXIC' || s === 'NQ=F') {
        return { timeZone: 'America/New_York', locale: 'en-US', openHour: 9, openMinute: 30, durationHours: 6.5, label: 'EST' }
    }
    if (n.includes('S&P') || s === '^GSPC' || s === 'ES=F') {
        return { timeZone: 'America/New_York', locale: 'en-US', openHour: 9, openMinute: 30, durationHours: 6.5, label: 'EST' }
    }
    if (n.includes('NIKKEI') || s === '^N225') {
        return { timeZone: 'Asia/Tokyo', locale: 'ja-JP', openHour: 9, openMinute: 0, durationHours: 6.0, label: 'JST' }
    }
    if (n.includes('SHANGHAI') || s === '000001.SS') {
        return { timeZone: 'Asia/Shanghai', locale: 'zh-CN', openHour: 9, openMinute: 30, durationHours: 5.5, label: 'CST' }
    }
    if (n.includes('BITCOIN') || n.includes('ETHEREUM') || s.includes('BTC') || s.includes('ETH')) {
        return { timeZone: 'UTC', locale: 'en-US', openHour: 0, openMinute: 0, durationHours: 24, label: 'UTC' }
    }
    // FX
    if (n.includes('KRW')) {
        return { timeZone: 'Asia/Seoul', locale: 'ko-KR', openHour: 9, openMinute: 0, durationHours: 24, label: 'KST' }
    }
    // Default Domestic
    return { timeZone: 'Asia/Seoul', locale: 'ko-KR', openHour: 9, openMinute: 0, durationHours: 6.5, label: 'KST' }
}
