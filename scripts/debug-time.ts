
function testDomainLogic(lastPoint: number, market: string) {
    console.log(`\nTesting ${market} with lastPoint: ${new Date(lastPoint).toISOString()} (${lastPoint})`);

    let timeZone = 'Asia/Seoul';
    let openHour = 9;
    let openMinute = 0;
    let durationHours = 6.5;

    if (market === 'NASDAQ') {
        timeZone = 'America/New_York';
        openHour = 9;
        openMinute = 30;
        durationHours = 6.5;
    } else if (market === 'Shanghai') {
        timeZone = 'Asia/Shanghai';
        openHour = 9;
        openMinute = 30;
        durationHours = 5.5;
    }

    try {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone,
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false
        });

        const parts = formatter.formatToParts(new Date(lastPoint));
        const getPart = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0');

        const currentHour = getPart('hour');
        const currentMinute = getPart('minute');
        const currentSecond = getPart('second');

        console.log(`Current Market Time: ${currentHour}:${currentMinute}:${currentSecond}`);

        const msSinceMidnight = (currentHour * 3600 + currentMinute * 60 + currentSecond) * 1000;
        const openMsFromMidnight = (openHour * 3600 + openMinute * 60) * 1000;

        const marketOpenTimestamp = lastPoint - (msSinceMidnight - openMsFromMidnight);

        console.log(`Calculated Start: ${new Date(marketOpenTimestamp).toISOString()} (${marketOpenTimestamp})`);

        // Verify in Zone
        const startParts = formatter.formatToParts(new Date(marketOpenTimestamp));
        const startH = startParts.find(p => p.type === 'hour')?.value;
        const startM = startParts.find(p => p.type === 'minute')?.value;
        console.log(`Start Time in Zone: ${startH}:${startM}`);

    } catch (e) {
        console.error(e);
    }
}

// Use timestamps from previous step
const nasdaqLast = 1770066000000; // 2026-02-02T21:00:00.000Z
const shanghaiLast = 1770015600000; // 2026-02-02T07:00:00.000Z

testDomainLogic(nasdaqLast, 'NASDAQ');
testDomainLogic(shanghaiLast, 'Shanghai');
