const fs = require('fs');
const axios = require('axios');
const path = require('path');

async function syncInstagramApify() {
    const apiToken = process.env.APIFY_API_TOKEN;
    if (!apiToken) {
        console.error('APIFY_API_TOKEN is not set in environment variables');
        process.exit(1);
    }

    console.log('Starting Instagram sync via Apify...');

    // We use the official apify/instagram-scraper which handles profile posts well
    const actorId = 'apify~instagram-scraper';
    const apiUrl = `https://api.apify.com/v2/acts/${actorId}/runs?token=${apiToken}`;

    const payload = {
        addParentData: false,
        directUrls: ["https://www.instagram.com/lofi_sat/"],
        enhanceUserSearchWithFacebookPage: false,
        isUserTaggedFeedURL: false,
        resultsLimit: 12, // Get up to 12 latest posts/reels
        resultsType: "posts",
        searchLimit: 1,
        searchType: "hashtag"
    };

    try {
        console.log('Triggering Apify Actor...');
        
        let runResponse;
        try {
            runResponse = await axios.post(apiUrl, payload);
        } catch (err) {
            console.error('Failed to trigger Apify Actor. Error:', err.message);
            if (err.response) {
                console.error('Response data:', err.response.data);
            }
            process.exit(1);
        }

        const runId = runResponse.data.data.id;
        const defaultDatasetId = runResponse.data.data.defaultDatasetId;
        
        console.log(`Run started with ID: ${runId}. Waiting for completion...`);

        let status = runResponse.data.data.status;
        
        // Poll for completion (timeout after 10 minutes)
        let attempts = 0;
        const maxAttempts = 60; // 60 * 10 seconds = 10 minutes

        while (status !== 'SUCCEEDED' && status !== 'FAILED' && status !== 'ABORTED' && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
            attempts++;
            
            const statusUrl = `https://api.apify.com/v2/acts/${actorId}/runs/${runId}?token=${apiToken}`;
            const statusResponse = await axios.get(statusUrl);
            status = statusResponse.data.data.status;
            console.log(`Attempt ${attempts}: Run status is ${status}`);
        }

        if (status !== 'SUCCEEDED') {
            console.error(`Apify run did not succeed within timeframe. Final status: ${status}`);
            process.exit(1);
        }

        console.log('Fetching results from dataset...');
        // Get dataset items
        const datasetUrl = `https://api.apify.com/v2/datasets/${defaultDatasetId}/items?token=${apiToken}`;
        const datasetResponse = await axios.get(datasetUrl);
        const rawItems = datasetResponse.data;

        if (!rawItems || rawItems.length === 0) {
            console.log('No items found in dataset. Ensure the profile has posts.');
            process.exit(0);
        }

        const formattedPosts = rawItems.map(item => {
            // Safely extract data based on standard Apify Instagram Scraper output
            const permalink = item.url || '';
            const thumbnail = item.displayUrl || (item.images && item.images.length > 0 ? item.images[0] : '');
            const caption = item.caption || '';
            const timestamp = item.timestamp || new Date().toISOString();

            return {
                permalink,
                thumbnail,
                caption,
                timestamp
            };
        });

        // Ensure output directory exists
        const outputDir = path.join(__dirname, '..', 'data');
        if (!fs.existsSync(outputDir)){
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputPath = path.join(outputDir, 'instagram_news.json');
        fs.writeFileSync(outputPath, JSON.stringify(formattedPosts, null, 2));
        console.log(`Successfully saved ${formattedPosts.length} posts to data/instagram_news.json`);

    } catch (error) {
        console.error('Error during Apify sync:', error.message);
        process.exit(1);
    }
}

syncInstagramApify();
