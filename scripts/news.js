/**
 * news.js - Dynamically loads Instagram posts from a JSON file
 * to populate the "Noticias del Laboratorio" section.
 */

console.log('news.js script loaded');

async function loadInstagramNews() {
    const container = document.getElementById('news-container');
    console.log('LOFISAT News Container search result:', container);

    if (!container) {
        console.error('CRITICAL: Element #news-container not found in the page.');
        return;
    }

    try {
        console.log('Fetching news data from: ./data/instagram_news.json');
        // Cache busting to ensure we always get the latest news
        const response = await fetch(`./data/instagram_news.json?v=${new Date().getTime()}`);
        console.log('Fetch response received. Status:', response.status);

        if (!response.ok) {
            throw new Error(`Failed to load news file. HTTP Status: ${response.status}`);
        }

        const posts = await response.json();
        console.log('JSON Data parsed successfully:', posts);

        if (posts && posts.length > 0) {
            console.log(`Found ${posts.length} posts. Preparing to render top 3...`);

            // Take the first 3 posts
            const topPosts = posts.slice(0, 3);

            // Capture the static card (Follow US) if it exists
            const staticCardContent = container.querySelector('.news-card') ? container.querySelector('.news-card').outerHTML : '';
            console.log('Static card captured:', staticCardContent ? 'Yes' : 'No (Container was empty)');

            // Clear container
            container.innerHTML = '';

            topPosts.forEach((post, index) => {
                console.log(`Rendering post ${index + 1}...`);
                const card = document.createElement('div');
                card.className = 'news-card animate-on-scroll';
                card.style.cssText = 'background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px); display: flex; flex-direction: column;';

                // Truncate caption
                const caption = post.caption ? (post.caption.length > 120 ? post.caption.substring(0, 120) + '...' : post.caption) : 'Nueva publicación';
                const date = post.timestamp ? new Date(post.timestamp).toLocaleDateString() : 'Reciente';

                card.innerHTML = `
                    <div class="news-image" style="margin: -30px -30px 20px -30px; height: 200px; overflow: hidden; border-radius: 15px 15px 0 0; position: relative;">
                        <img src="${post.thumbnail}" alt="Instagram post" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='images/logo_lofisat.jpg'; this.style.objectFit='contain';">
                        <img src="images/logo_lofisat.jpg" alt="Logo LOFISAT" style="position: absolute; top: 10px; right: 10px; width: 40px; height: 40px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); background: white;">
                    </div>
                    <div class="news-date" style="font-size: 0.8em; color: var(--ocean-blue); margin-bottom: 10px;">${date}</div>
                    <h3 style="font-size: 1.1em; margin-bottom: 15px;">LOFISAT Post</h3>
                    <p style="margin-bottom: 25px; color: rgba(255,255,255,0.8); font-size: 0.9em; flex-grow: 1;">${caption}</p>
                    <a href="${post.permalink}" target="_blank" class="btn btn-outline" style="border-color: rgba(255,255,255,0.3); color: white; align-self: flex-start;">
                        Ver en Instagram
                    </a>
                `;
                container.appendChild(card);
            });

            // Re-add the original "Follow" card if we captured it
            if (staticCardContent) {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = staticCardContent;
                if (wrapper.firstChild) {
                    container.appendChild(wrapper.firstChild);
                    console.log('Static card re-appended successfully.');
                }
            }
        } else {
            console.log('No posts found in the array. Leaving static content.');
        }
    } catch (error) {
        console.error('FAILED to load automated news:', error);
        console.log('The section will remain with the default content.');
    }
}

// Ensure the DOM is fully loaded before running
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadInstagramNews);
} else {
    loadInstagramNews();
}
