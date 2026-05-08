const fs = require('fs');
const axios = require('axios');
const path = require('path');
const crypto = require('crypto');

async function downloadImage(url, filename) {
    const imagesDir = path.join(__dirname, '..', 'images', 'news');
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
    }

    const filePath = path.join(imagesDir, filename);
    
    // Check if image already exists to avoid redundant downloads
    if (fs.existsSync(filePath)) {
        return `images/news/${filename}`;
    }

    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            timeout: 10000
        });

        return new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
            writer.on('finish', () => resolve(`images/news/${filename}`));
            writer.on('error', (err) => {
                fs.unlinkSync(filePath); // Delete partial file
                reject(err);
            });
        });
    } catch (error) {
        console.error(`Failed to download image ${url}:`, error.message);
        return null;
    }
}

async function syncInstagramApify() {
    const apiToken = process.env.APIFY_API_TOKEN;
    if (!apiToken) {
        console.error('APIFY_API_TOKEN is not set in environment variables');
        process.exit(1);
    }

    console.log('Starting Instagram sync via Apify...');

    const actorId = 'apify~instagram-scraper';
    const apiUrl = `https://api.apify.com/v2/acts/${actorId}/runs?token=${apiToken}`;

    const payload = {
        addParentData: false,
        directUrls: ["https://www.instagram.com/lofi_sat/"],
        enhanceUserSearchWithFacebookPage: false,
        isUserTaggedFeedURL: false,
        resultsLimit: 12,
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
        let attempts = 0;
        const maxAttempts = 60;

        while (status !== 'SUCCEEDED' && status !== 'FAILED' && status !== 'ABORTED' && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 10000));
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
        const datasetUrl = `https://api.apify.com/v2/datasets/${defaultDatasetId}/items?token=${apiToken}`;
        const datasetResponse = await axios.get(datasetUrl);
        const rawItems = datasetResponse.data;

        if (!rawItems || rawItems.length === 0) {
            console.log('No items found in dataset.');
            process.exit(0);
        }

        console.log(`Processing ${rawItems.length} items and downloading images...`);
        const formattedPosts = [];

        for (const item of rawItems) {
            const permalink = item.url || '';
            const originalThumbnail = item.displayUrl || (item.images && item.images.length > 0 ? item.images[0] : '');
            const caption = item.caption || '';
            const timestamp = item.timestamp || new Date().toISOString();

            if (originalThumbnail && permalink) {
                // Generate a unique filename based on the permalink
                const hash = crypto.createHash('md5').update(permalink).digest('hex');
                const filename = `ig_${hash}.jpg`;
                
                const localThumbnail = await downloadImage(originalThumbnail, filename);
                
                formattedPosts.push({
                    permalink,
                    thumbnail: localThumbnail || originalThumbnail, // Fallback to original if download fails
                    caption,
                    timestamp
                });
            }
        }

        const outputDir = path.join(__dirname, '..', 'data');
        if (!fs.existsSync(outputDir)){
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputPath = path.join(outputDir, 'instagram_news.json');
        fs.writeFileSync(outputPath, JSON.stringify(formattedPosts, null, 2));
        console.log(`Successfully saved ${formattedPosts.length} posts to data/instagram_news.json`);

    } catch (error) {
        console.error('CRITICAL ERROR during Apify sync:');
        console.error('Message:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        }
        if (error.config) {
            console.error('Failed URL:', error.config.url);
        }
        process.exit(1);
    }
}

syncInstagramApify();

