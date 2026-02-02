import { TOP_STOCKS } from '../lib/real-stock-data'
import yahooFinance from 'yahoo-finance2'

const yf = new (yahooFinance as any)()
if (yf.suppressNotices) {
    yf.suppressNotices(['yahooSurvey'])
}

async function main() {
    console.log('🔍 Starting Stock Data Audit...')
    console.log('---------------------------------------------------')
    console.log('Code\t| Market | Configured Name\t| Yahoo Short Name')
    console.log('---------------------------------------------------')

    const markets = Object.keys(TOP_STOCKS) as (keyof typeof TOP_STOCKS)[]

    for (const market of markets) {
        const stocks = TOP_STOCKS[market]
        if (!stocks) continue

        for (const stock of stocks) {
            let symbol = stock.symbol
            if (market === 'KOSPI' && !symbol.includes('.')) symbol += '.KS'
            if (market === 'KOSDAQ' && !symbol.includes('.')) symbol += '.KQ'

            try {
                const quote = await yf.quote(symbol, {}, { validateResult: false })
                if (!quote) {
                    console.log(`${stock.symbol}\t| ${market}\t| ${stock.name}\t| ❌ NOT FOUND`)
                    continue
                }

                const yahooName = quote.shortName || quote.longName || 'Unknown'
                const matchStatus = '✅' // We just log, manual review needed for "Samsung" vs "Samsung Electronics"

                // Simple length check or keyword check? 
                // Hard to automate "Rainbow" == "Rainbow Robotics" perfect match without fuzzy logic.
                // Just printing it is enough for me to spot "Leeno" vs "Rainbow".

                console.log(`${stock.symbol}\t| ${market}\t| ${stock.name}\t| ${yahooName}`)

            } catch (error) {
                console.log(`${stock.symbol}\t| ${market}\t| ${stock.name}\t| ❌ ERROR`)
            }

            // tiny delay
            await new Promise(r => setTimeout(r, 100))
        }
    }
    console.log('---------------------------------------------------')
    console.log('Audit Complete.')
}

main()
