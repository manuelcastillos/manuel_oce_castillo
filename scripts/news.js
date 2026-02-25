/**
 * news.js - Dynamically loads Instagram posts from a JSON file
 * to populate the "Noticias del Laboratorio" section.
 */

console.log('news.js script loaded');

async function loadInstagramNews() {
    const container = document.getElementById('news-container');

    if (!container) {
        console.error('CRITICAL: Element #news-container not found in the page.');
        return;
    }

    try {
        console.log('Fetching news data from: ./data/instagram_news.json');
        // Cache busting to ensure we always get the latest news
        const response = await fetch(`./data/instagram_news.json?v=${new Date().getTime()}`);

        if (!response.ok) {
            throw new Error(`Failed to load news file. HTTP Status: ${response.status}`);
        }

        const posts = await response.json();
        console.log('Successfully fetched posts:', posts);

        if (posts && posts.length > 0) {
            // Take the first 3 posts
            const topPosts = posts.slice(0, 3);

            // Capture the static "Follow Us" card if it exists
            const staticCard = container.querySelector('.news-card');
            const staticCardHTML = staticCard ? staticCard.outerHTML : '';

            // Clear container
            container.innerHTML = '';

            topPosts.forEach((post) => {
                const card = document.createElement('div');
                card.className = 'news-card animate-on-scroll';
                card.style.cssText = 'background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px); display: flex; flex-direction: column; height: 100%; min-height: 480px;';

                const caption = post.caption ? (post.caption.length > 120 ? post.caption.substring(0, 120) + '...' : post.caption) : 'Nueva publicación de LOFISAT';
                const date = post.timestamp ? new Date(post.timestamp).toLocaleDateString() : 'Reciente';

                // Use an image proxy to bypass CORS/Hotlinking and ensure caching
                // We encode the URL correctly
                const proxiedThumbnail = post.thumbnail ? `https://images.weserv.nl/?url=${encodeURIComponent(post.thumbnail.split('?')[0])}&w=600&h=400&fit=cover` : 'images/logo_lofisat.jpg';

                card.innerHTML = `
                    <div class="news-image-wrapper" style="margin: -30px -30px 20px -30px; height: 240px; overflow: hidden; border-radius: 15px 15px 0 0; position: relative; background: #FFF; display: flex; align-items: center; justify-content: center;">
                        
                        <!-- Main Post Image with specialized error handling -->
                        <img src="${proxiedThumbnail}" 
                             alt="LOFISAT News" 
                             style="width: 100%; height: 100%; object-fit: cover;" 
                             onload="this.parentElement.style.background='#000';"
                             onerror="this.src='images/logo_lofisat.jpg'; this.style.objectFit='contain'; this.parentElement.style.background='#FFF';">
                        
                        <!-- Subtle Mini Logo Overlay (Always on TOP-LEFT) -->
                        <div style="position: absolute; top: 15px; left: 15px; width: 42px; height: 42px; border-radius: 50%; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4); overflow: hidden; background: white; z-index: 10; display: flex; align-items: center; justify-content: center;">
                            <img src="images/logo_lofisat.jpg" alt="Logo LOFISAT" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    </div>
                    <div class="news-content" style="flex-grow: 1; display: flex; flex-direction: column;">
                        <div class="news-date" style="font-size: 0.85em; color: var(--ocean-blue); margin-bottom: 8px; font-weight: 500;">${date}</div>
                        <h3 style="font-size: 1.15em; margin-bottom: 12px; color: #fff;">LOFISAT</h3>
                        <p style="margin-bottom: 25px; color: rgba(255,255,255,0.8); font-size: 0.95em; line-height: 1.6; flex-grow: 1;">${caption}</p>
                        <a href="${post.permalink}" target="_blank" class="btn btn-outline" 
                           style="border-color: rgba(255,255,255,0.3); color: white; align-self: flex-start; padding: 10px 20px; font-size: 0.9em; transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 8px;">
                            <i class="fa-brands fa-instagram"></i> Ver en Instagram
                        </a>
                    </div>
                `;
                container.appendChild(card);
            });

            // Add the "Follow Us" static card at the end
            if (staticCardHTML) {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = staticCardHTML;
                const followCard = wrapper.firstChild;
                // Match the style of dynamic cards
                followCard.style.cssText = 'background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px); display: flex; flex-direction: column; height: 100%; min-height: 480px;';
                container.appendChild(followCard);
            }

            console.log('News rendering complete.');
        }
    } catch (error) {
        console.error('FAILED to load automated news:', error);
    }
}

// Ensure the news load after everything else to avoid container issues
window.addEventListener('load', loadInstagramNews);

// Fallback for slower connections
setTimeout(() => {
    const container = document.getElementById('news-container');
    if (container && container.children.length <= 1) {
        loadInstagramNews();
    }
}, 2000);
