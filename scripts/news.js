/**
 * news.js - Dynamically loads Instagram posts from a JSON file
 */

async function loadInstagramNews() {
    const container = document.getElementById('news-container');
    if (!container) return;

    try {
        const response = await fetch(`./data/instagram_news.json?v=${new Date().getTime()}`);
        if (!response.ok) throw new Error('News file not found');

        const posts = await response.json();
        if (posts && posts.length > 0) {
            const topPosts = posts.slice(0, 3);
            const staticCard = container.querySelector('.news-card');
            const staticCardHTML = staticCard ? staticCard.outerHTML : '';

            container.innerHTML = '';

            topPosts.forEach((post) => {
                const card = document.createElement('div');
                card.className = 'news-card animate-on-scroll';
                card.style.cssText = 'background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px); display: flex; flex-direction: column; height: 100%;';

                const caption = post.caption ? (post.caption.length > 100 ? post.caption.substring(0, 100) + '...' : post.caption) : 'Nueva publicación';
                const date = post.timestamp ? new Date(post.timestamp).toLocaleDateString() : 'Reciente';

                card.innerHTML = `
                    <div class="news-image-wrapper" style="margin: -30px -30px 20px -30px; height: 220px; overflow: hidden; border-radius: 15px 15px 0 0; position: relative; background: #fff; display: flex; align-items: center; justify-content: center;">
                        <!-- Primary Post Image (Should be the Instagram Post) -->
                        <img src="${post.thumbnail}" alt="LOFISAT News" 
                             style="width: 100%; height: 100%; object-fit: cover; display: block;" 
                             onerror="this.src='images/logo_lofisat.jpg'; this.style.objectFit='contain';">
                        
                        <!-- Mini Logo Overlay (CORRECTED Position: TOP-LEFT) -->
                        <div style="position: absolute; top: 12px; left: 12px; width: 40px; height: 40px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); overflow: hidden; background: white; z-index: 10;">
                            <img src="images/logo_lofisat.jpg" alt="Logo LOFISAT" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    </div>
                    <div class="news-content" style="flex-grow: 1; display: flex; flex-direction: column;">
                        <div class="news-date" style="font-size: 0.8em; color: var(--ocean-blue); margin-bottom: 8px;">${date}</div>
                        <h3 style="font-size: 1.1em; margin-bottom: 12px; color: #fff;">@lofi_sat</h3>
                        <p style="margin-bottom: 20px; color: rgba(255,255,255,0.7); font-size: 0.9em; line-height: 1.5;">${caption}</p>
                        <a href="${post.permalink}" target="_blank" class="btn btn-outline" 
                           style="border-color: rgba(255,255,255,0.2); color: white; align-self: flex-start; margin-top: auto; padding: 8px 16px; font-size: 0.9em;">
                            Ver en Instagram
                        </a>
                    </div>
                `;
                container.appendChild(card);
            });

            if (staticCardHTML) {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = staticCardHTML;
                container.appendChild(wrapper.firstChild);
            }
        }
    } catch (error) {
        console.error('Error loading news:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadInstagramNews);
if (document.readyState !== 'loading') loadInstagramNews();
