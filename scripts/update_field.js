const fs = require('fs');
const axios = require('axios');

async function syncFieldWork() {
    const jsonUrl = 'https://rss.app/feeds/v1.1/G9mWxuK3iJIoFhIA.json';
    console.log(`Fetching JSON feed from ${jsonUrl}...`);

    try {
        const response = await axios.get(jsonUrl);
        const data = response.data;

        if (!data || !data.items) {
            console.log("No items found in the feed.");
            return;
        }

        // Keywords to include (Field Work)
        const includeKeywords = [
            'terreno', 'campaña', 'antártica', 'oceanografía', 'muestreo',
            'expedición', 'buque', 'embarque', 'mediciones', 'lanzamiento',
            'instrumento', 'malla', 'estación', 'fiordos', 'patagonia',
            'seals', 'falkor', 'lofisat', 'costar', 'ciencia'
        ];

        // Keywords to exclude (Personal/Family)
        const excludeKeywords = [
            'familia', 'cumpleaños', 'vacaciones', 'niño', 'hijo',
            'asado', 'playa', 'almuerzo', 'descanso', 'personal'
        ];

        const filteredItems = data.items.filter(item => {
            const text = (item.content_text || item.title || '').toLowerCase();

            // Inclusion criteria: must have at least one field keyword
            const hasInclude = includeKeywords.some(kw => text.includes(kw));

            // Exclusion criteria: must not have any personal keyword
            const hasExclude = excludeKeywords.some(kw => text.includes(kw));

            return hasInclude && !hasExclude;
        }).slice(0, 5); // Limit to 5 items to match the layout

        if (filteredItems.length > 0) {
            // Simplified structure for the frontend
            const simplifiedItems = filteredItems.map(item => ({
                id: item.id,
                thumbnail: item.image || (item.attachments && item.attachments[0] ? item.attachments[0].url : ''),
                permalink: item.url,
                caption: item.content_text || item.title || '',
                timestamp: item.date_published
            }));

            fs.writeFileSync('./data/field_posts.json', JSON.stringify(simplifiedItems, null, 2));
            console.log(`Successfully synced ${simplifiedItems.length} field work items.`);
        } else {
            console.log("No items matched the filtering criteria.");
        }

    } catch (error) {
        console.error('Error syncing Field Work JSON:', error.message);
        process.exit(1);
    }
}

syncFieldWork();
