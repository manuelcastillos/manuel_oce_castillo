const fs = require('fs');
const axios = require('axios');

async function syncInstagram() {
    const rssUrl = 'https://rss.app/feeds/Izc71vq3Wly9kcqV.xml';
    console.log(`Fetching RSS feed from ${rssUrl}...`);

    try {
        const response = await axios.get(rssUrl);
        const xml = response.data;

        // Simple regex-based parsing for RSS items
        const items = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;

        while ((match = itemRegex.exec(xml)) !== null && items.length < 5) {
            const content = match[1];

            const titleMatch = content.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/);
            const linkMatch = content.match(/<link>([\s\S]*?)<\/link>/);
            const dateMatch = content.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
            const mediaMatch = content.match(/<media:content[\s\S]*?url="([\s\S]*?)"/);

            // For description (caption), we take it from CDATA in description tag
            const descMatch = content.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/);
            let caption = '';
            if (descMatch) {
                // Remove HTML tags from description
                caption = descMatch[1].replace(/<[^>]*>?/gm, '').trim();
            }

            items.push({
                id: linkMatch ? linkMatch[1].split('/').pop() : Math.random().toString(36).substr(2, 9),
                thumbnail: mediaMatch ? mediaMatch[1].replace(/&amp;/g, '&') : '',
                permalink: linkMatch ? linkMatch[1] : '',
                caption: caption || (titleMatch ? titleMatch[1] : ''),
                timestamp: dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString()
            });
        }

        if (items.length > 0) {
            fs.writeFileSync('./data/instagram_news.json', JSON.stringify(items, null, 2));
            console.log(`Successfully synced ${items.length} news items.`);
        } else {
            console.log("No news items found in the feed.");
        }

    } catch (error) {
        console.error('Error syncing Instagram RSS:', error.message);
        process.exit(1);
    }
}

syncInstagram();
