/**
 * update_calendar.js
 * Fetches the Outlook public ICS calendar and writes events to JSON.
 * Run by GitHub Actions on a schedule.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const ICS_URL = 'https://outlook.office365.com/owa/calendar/059f58253820411286047bf197467719@uv.cl/e1ace145710a4e07bc1f95f0f09437da15098587006899194286/calendar.ics';
const OUT_PATH = path.join(__dirname, '..', 'data', 'calendar_events.json');

// ---- Minimal ICS parser (no external deps) -------------------------
function parseICS(icsText) {
    const events = [];
    const blocks = icsText.split('BEGIN:VEVENT');

    for (let i = 1; i < blocks.length; i++) {
        const block = blocks[i].split('END:VEVENT')[0];

        const get = (key) => {
            // Handles LINE FOLDING (continuation lines start with space/tab)
            const unfolded = block.replace(/\r?\n[ \t]/g, '');
            const match = unfolded.match(new RegExp(`${key}(?:;[^:]*)?:(.*?)(?:\r?\n|$)`, 'i'));
            return match ? match[1].trim() : '';
        };

        const parseDate = (raw) => {
            if (!raw) return null;
            // All-day: YYYYMMDD  |  DateTime: YYYYMMDDTHHMMSSZ
            const clean = raw.replace(/Z$/, '');
            if (clean.length === 8) {
                // All-day
                return `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)}`;
            }
            return new Date(
                clean.slice(0, 4), clean.slice(4, 6) - 1, clean.slice(6, 8),
                clean.slice(9, 11) || 0, clean.slice(11, 13) || 0
            ).toISOString();
        };

        // Extract DTSTART value ignoring parameters (e.g. DTSTART;TZID=...)
        const dtStartRaw = get('DTSTART').split(';').pop().split(':').pop() || get('DTSTART');
        const dtEndRaw = get('DTEND').split(';').pop().split(':').pop() || get('DTEND');

        const summary = get('SUMMARY').replace(/\\,/g, ',').replace(/\\n/g, '\n');
        const location = get('LOCATION').replace(/\\,/g, ',');
        const desc = get('DESCRIPTION').replace(/\\,/g, ',').replace(/\\n/g, ' ');

        const start = parseDate(dtStartRaw || get('DTSTART'));
        const end = parseDate(dtEndRaw || get('DTEND'));

        if (!start || !summary) continue;

        events.push({ summary, start, end, location, description: desc.slice(0, 200) });
    }

    // Sort ascending
    events.sort((a, b) => new Date(a.start) - new Date(b.start));
    return events;
}

// ---- Fetch & save --------------------------------------------------
function fetchICS() {
    console.log('Fetching Outlook ICS from:', ICS_URL);

    const req = https.get(ICS_URL, (res) => {
        if (res.statusCode !== 200) {
            console.error('HTTP error:', res.statusCode);
            process.exit(1);
        }

        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const events = parseICS(data);
                fs.writeFileSync(OUT_PATH, JSON.stringify(events, null, 2), 'utf8');
                console.log(`Saved ${events.length} events to ${OUT_PATH}`);
            } catch (err) {
                console.error('Parse error:', err.message);
                process.exit(1);
            }
        });
    });

    req.on('error', (err) => {
        console.error('Network error:', err.message);
        process.exit(1);
    });
}

fetchICS();
