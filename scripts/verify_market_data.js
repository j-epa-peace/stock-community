const yahooFinance = require('yahoo-finance2').default;

(async () => {
    try {
        const symbol = '^KQ11'; // KOSDAQ
        const queryOptions = { range: '2d', interval: '1m', includePrePost: false };
        const result = await yahooFinance.chart(symbol, queryOptions);

        const meta = result.meta;
        const previousClose = meta.chartPreviousClose || meta.previousClose;
        const regularMarketPrice = meta.regularMarketPrice;

        const quotes = result.quotes || [];
        // Filter for latest date
        const dates = quotes.map(q => new Date(q.date).toDateString());
        const uniqueDates = Array.from(new Set(dates));
        const latestDate = uniqueDates[uniqueDates.length - 1];
        const history = quotes.filter(item => new Date(item.date).toDateString() === latestDate);

        console.log('--- KOSDAQ Data Check ---');
        console.log(`Current Price (Meta): ${regularMarketPrice}`);
        console.log(`Previous Close (Meta): ${previousClose}`);
        console.log(`Chart Previous Close: ${meta.chartPreviousClose}`);
        console.log(`Regular Market Previous Close: ${meta.previousClose}`);

        if (history.length > 0) {
            const first = history[0].close;
            const last = history[history.length - 1].close;
            console.log(`First point of day: ${first}`);
            console.log(`Last point of day: ${last}`);

            // Simulation
            const isRed = last >= previousClose;
            console.log(`Should be Red? ${isRed} (Last ${last} >= Prev ${previousClose})`);

            const redPoints = history.filter(h => h.close >= previousClose).length;
            const bluePoints = history.filter(h => h.close < previousClose).length;

            console.log(`Red Points: ${redPoints}`);
            console.log(`Blue Points: ${bluePoints}`);
            console.log(`Ratio: ${(redPoints / history.length * 100).toFixed(1)}% Red`);
        } else {
            console.log('No history data found for latest date');
        }

    } catch (error) {
        console.error('Error fetching data:', error);
    }
})();
