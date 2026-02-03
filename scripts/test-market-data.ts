
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new (YahooFinance as any)();

async function testFetch(symbolString: string, name: string) {
    console.log(`\n--- Testing ${name} (${symbolString}) ---`);
    const period1 = new Date();
    period1.setDate(period1.getDate() - 7);

    const queryOptions = {
        period1: period1.toISOString(),
        interval: '1m',
        includePrePost: false
    };

    try {
        console.log(`Fetching data from ${period1.toISOString()}...`);
        const result = await yahooFinance.chart(symbolString, queryOptions);

        if (!result.quotes || result.quotes.length === 0) {
            console.log("No quotes found.");
            return;
        }

        const quotes = result.quotes;
        console.log(`Total quotes fetched: ${quotes.length}`);

        const lastQuoteDate = new Date(quotes[quotes.length - 1].date);
        console.log(`Last Quote Date (Raw): ${quotes[quotes.length - 1].date}`);
        console.log(`Last Quote Date (UTC): ${lastQuoteDate.toUTCString()}`);

        const lastDateStr = `${lastQuoteDate.getUTCFullYear()}-${lastQuoteDate.getUTCMonth()}-${lastQuoteDate.getUTCDate()}`;
        console.log(`Filter Date Str: ${lastDateStr}`);

        const history = quotes.filter((item: any) => {
            const d = new Date(item.date);
            const dStr = `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
            return dStr === lastDateStr;
        });

        console.log(`Filtered quotes count: ${history.length}`);
        if (history.length > 0) {
            const first = history[0];
            const last = history[history.length - 1];
            console.log(`First Point: ${new Date(first.date).toISOString()} (${first.close})`);
            console.log(`Last Point:  ${new Date(last.date).toISOString()} (${last.close})`);

            // Check Time Range
            const durationMs = new Date(last.date).getTime() - new Date(first.date).getTime();
            console.log(`Duration: ${durationMs / 1000 / 3600} hours`);
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

async function run() {
    await testFetch('^IXIC', 'NASDAQ'); // US
    await testFetch('000001.SS', 'Shanghai'); // CN
}

run();
