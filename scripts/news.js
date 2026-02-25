/**
 * news.js - Dynamically loads Instagram posts from a JSON file
 * to populate the "Noticias del Laboratorio" section.
 */

async function loadInstagramNews() {
    const container = document.getElementById('news-container');
    if (!container) return;

    try {
        // Cache busting to ensure we always get the latest news
        const response = await fetch(`./data/instagram_news.json?v=${new Date().getTime()}`);
        if (!response.ok) throw new Error('News file not found');

        const posts = await response.json();

        if (posts && posts.length > 0) {
            const topPosts = posts.slice(0, 5);

            // Capture the static Follow Us card
            const staticCard = container.querySelector('.news-card');
            const staticCardHTML = staticCard ? staticCard.outerHTML : '';

            container.innerHTML = '';

            topPosts.forEach((post) => {
                const card = document.createElement('div');
                card.className = 'news-card animate-on-scroll';
                card.style.cssText = 'background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); padding: 20px; border-radius: 15px; backdrop-filter: blur(10px); display: flex; flex-direction: row; gap: 25px; align-items: stretch; margin-bottom: 25px; min-height: 220px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);';

                const caption = post.caption ? (post.caption.length > 120 ? post.caption.substring(0, 120) + '...' : post.caption) : 'Nueva publicación';
                const date = post.timestamp ? new Date(post.timestamp).toLocaleDateString() : 'Reciente';

                // We try direct URL first, then proxied if needed (proxies can be blocked too)
                // For Instagram CDN, often they work better with a simple proxy that hides the referrer
                const originalUrl = post.thumbnail;
                const proxiedUrl = originalUrl ? `https://images.weserv.nl/?url=${encodeURIComponent(originalUrl)}&w=600&h=400&fit=cover&default=images/logo_lofisat.jpg` : 'images/logo_lofisat.jpg';

                card.innerHTML = `
                    <div class="news-image-wrapper" style="width: 280px; height: 180px; flex-shrink: 0; overflow: hidden; border-radius: 12px; position: relative; background: #fff; display: flex; align-items: center; justify-content: center;">
                        <img src="${proxiedUrl}" 
                             alt="Noticia LOFISAT" 
                             style="width: 100%; height: 100%; object-fit: cover;" 
                             onerror="this.src='images/logo_lofisat.jpg'; this.style.objectFit='contain';">
                        <div style="position: absolute; top: 10px; left: 10px; width: 35px; height: 35px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); overflow: hidden; background: white; z-index: 10;">
                            <img src="images/logo_lofisat.jpg" alt="Logo LOFISAT" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    </div>
                    <div class="news-content" style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center; padding-right: 15px;">
                        <div class="news-date" style="font-size: 0.9em; color: #FFF; background: rgba(0, 229, 255, 0.35); padding: 4px 12px; border-radius: 20px; display: inline-block; width: fit-content; margin-bottom: 12px; font-weight: 700; border: 1px solid rgba(0, 229, 255, 0.4); text-shadow: 0 1px 2px rgba(0,0,0,0.3);">${date}</div>
                        <h3 style="font-size: 1.4em; margin-bottom: 8px; color: #00E5FF; font-weight: 800; text-shadow: 2px 2px 4px rgba(0,0,0,0.4);">@lofi_sat</h3>
                        <p style="margin-bottom: 18px; color: #FFFFFF; font-size: 1.1em; line-height: 1.5; font-weight: 500; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">${caption}</p>
                        <a href="${post.permalink}" target="_blank" class="btn" 
                           style="background: #00E5FF; color: #000; align-self: flex-start; padding: 10px 24px; font-size: 0.95em; font-weight: 800; border-radius: 30px; text-transform: none; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(0, 229, 255, 0.3); transition: all 0.3s ease;">
                            <i class="fa-brands fa-instagram"></i> Ir al post
                        </a>
                    </div>
                `;
                container.appendChild(card);
            });

            // Re-add static card
            if (staticCardHTML) {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = staticCardHTML;
                const followCard = wrapper.firstChild;
                followCard.style.cssText = 'background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); padding: 20px; border-radius: 15px; backdrop-filter: blur(10px); display: flex; flex-direction: row; gap: 25px; align-items: center; margin-bottom: 25px; min-height: 220px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);';

                // Adjust static card inner structure to match horizontal layout if needed
                // But generally keep it as is if it's already a flex container with icon or text.
                container.appendChild(followCard);
            }
        }
    } catch (error) {
        console.error('Error loading news:', error);
    }
}

// Execute on load
window.addEventListener('load', loadInstagramNews);
// Immediate check for fast networks
if (document.readyState === 'complete') loadInstagramNews();
