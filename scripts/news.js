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
                // Using a slightly different style to ensure the image container is prominent
                card.style.cssText = 'background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px); display: flex; flex-direction: column; height: 100%;';

                const caption = post.caption ? (post.caption.length > 100 ? post.caption.substring(0, 100) + '...' : post.caption) : 'Nueva publicación';
                const date = post.timestamp ? new Date(post.timestamp).toLocaleDateString() : 'Reciente';

                card.innerHTML = `
                    <div class="news-image-wrapper" style="margin: -30px -30px 20px -30px; height: 220px; overflow: hidden; border-radius: 15px 15px 0 0; position: relative; background: #000;">
                        <!-- Primary Post Image -->
                        <img src="${post.thumbnail}" alt="LOFISAT News" 
                             style="width: 100%; height: 100%; object-fit: cover; display: block;" 
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        
                        <!-- Fallback if Image fails -->
                        <div class="image-fallback" style="display: none; width: 100%; height: 100%; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%); color: rgba(255,255,255,0.5);">
                            <i class="fa-brands fa-instagram" style="font-size: 3em; margin-bottom: 10px;"></i>
                            <span>Ver en Instagram</span>
                        </div>

                        <!-- Mini Logo Overlay (Top-Left) -->
                        <div style="position: absolute; top: 12px; left: 12px; width: 38px; height: 38px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.8); box-shadow: 0 4px 10px rgba(0,0,0,0.5); overflow: hidden; background: white; z-index: 5;">
                            <img src="images/logo_lofisat.jpg" alt="Logo LOFISAT" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    </div>
                    <div class="news-content" style="flex-grow: 1; display: flex; flex-direction: column;">
                        <div class="news-date" style="font-size: 0.85em; color: var(--ocean-blue); margin-bottom: 8px; font-weight: 500;">${date}</div>
                        <h3 style="font-size: 1.1em; margin-bottom: 12px; color: #fff;">@lofi_sat</h3>
                        <p style="margin-bottom: 20px; color: rgba(255,255,255,0.7); font-size: 0.9em; line-height: 1.5;">${caption}</p>
                        <a href="${post.permalink}" target="_blank" class="btn btn-outline" 
                           style="border-color: rgba(255,255,255,0.2); color: white; align-self: flex-start; margin-top: auto; padding: 8px 16px; font-size: 0.9em; transition: all 0.3s ease;">
                            <i class="fa-brands fa-instagram"></i> Ver publicación
                        </a>
                    </div>
                `;
                container.appendChild(card);
            });

            // Re-add static "Follow Us" card
            if (staticCardHTML) {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = staticCardHTML;
                container.appendChild(wrapper.firstChild);
            }

            console.log('Rendering complete.');
        }
    } catch (error) {
        console.error('Error loading news:', error);
    }
}

// Initial load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadInstagramNews);
} else {
    loadInstagramNews();
}
