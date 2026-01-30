const yahooFinance = require('yahoo-finance2').default;

(async () => {
    try {
        const symbol = '^KQ11'; // KOSDAQ
        const queryOptions = { range: '2d', interval: '1m', includePrePost: false };
        const result = await yahooFinance.chart(symbol, queryOptions);

        const meta = result.meta;
        const previousClose = meta.chartPreviousClose || meta.previousClose;
        const quotes = result.quotes || [];

        // 1. Filter for latest trading day (same logic as API)
        const dates = quotes.map(q => new Date(q.date).toDateString());
        const uniqueDates = Array.from(new Set(dates));
        const latestDate = uniqueDates[uniqueDates.length - 1];

        const history = quotes.filter(item => new Date(item.date).toDateString() === latestDate && item.close !== null);

        // 2. Statistics
        const total = history.length;
        const downCount = history.filter(h => h.close < previousClose).length;
        const upCount = history.filter(h => h.close >= previousClose).length;
        const downPercent = (downCount / total) * 100;

        console.log('--- KOSDAQ (Avg Analysis) ---');
        console.log(`Previous Close: ${previousClose}`);
        console.log(`Target Date: ${latestDate}`);
        console.log(`Total Points: ${total}`);
        console.log(`Blue (Down) Points: ${downCount} (${downPercent.toFixed(2)}%)`);
        console.log(`Red (Up) Points: ${upCount} (${(100 - downPercent).toFixed(2)}%)`);

    } catch (error) {
        console.error('Error fetching data:', error);
    }
})();
