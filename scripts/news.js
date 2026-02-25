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
                // Higher opacity for the card background to pop against the section background
                card.style.cssText = 'background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px); display: flex; flex-direction: column; height: 100%; min-height: 480px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);';

                const caption = post.caption ? (post.caption.length > 150 ? post.caption.substring(0, 150) + '...' : post.caption) : 'Nueva publicación';
                const date = post.timestamp ? new Date(post.timestamp).toLocaleDateString() : 'Reciente';

                const originalUrl = post.thumbnail;
                const proxiedUrl = originalUrl ? `https://images.weserv.nl/?url=${encodeURIComponent(originalUrl)}&w=600&h=400&fit=cover&default=images/logo_lofisat.jpg` : 'images/logo_lofisat.jpg';

                card.innerHTML = `
                    <div class="news-image-wrapper" style="margin: -30px -30px 20px -30px; height: 240px; overflow: hidden; border-radius: 15px 15px 0 0; position: relative; background: #fff; display: flex; align-items: center; justify-content: center;">
                        <img src="${proxiedUrl}" 
                             alt="Noticia LOFISAT" 
                             style="width: 100%; height: 100%; object-fit: cover;" 
                             onerror="this.src='images/logo_lofisat.jpg'; this.style.objectFit='contain';">
                        <div style="position: absolute; top: 15px; left: 15px; width: 45px; height: 45px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.5); overflow: hidden; background: white; z-index: 10;">
                            <img src="images/logo_lofisat.jpg" alt="Logo LOFISAT" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    </div>
                    <div class="news-content" style="flex-grow: 1; display: flex; flex-direction: column;">
                        <div class="news-date" style="font-size: 0.9em; color: #00E5FF; margin-bottom: 8px; font-weight: 700;">${date}</div>
                        <h3 style="font-size: 1.25em; margin-bottom: 12px; color: #FFFFFF; font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">@lofi_sat</h3>
                        <p style="margin-bottom: 25px; color: #FFFFFF; font-size: 1.05em; line-height: 1.6; flex-grow: 1; font-weight: 400; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">${caption}</p>
                        <a href="${post.permalink}" target="_blank" class="btn" 
                           style="background: #00E5FF; color: #000; align-self: flex-start; padding: 10px 24px; font-size: 0.9em; font-weight: 800; border-radius: 30px; text-transform: none; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(0, 229, 255, 0.4);">
                            <i class="fa-brands fa-instagram"></i> Ver publicación
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
                followCard.style.cssText = 'background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px); display: flex; flex-direction: column; height: 100%; min-height: 480px;';
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
