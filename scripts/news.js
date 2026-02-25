/**
 * news.js - Dynamically loads Instagram posts from a JSON file
 * to populate the "Noticias del Laboratorio" section.
 */

async function loadInstagramNews() {
    const container = document.getElementById('news-container');
    if (!container) return;

    try {
        // We fetch the JSON relative to the root
        const response = await fetch('./data/instagram_news.json');
        if (!response.ok) throw new Error('News file not found');

        const posts = await response.json();

        // Clear container (keep the default card if you want, or replace it)
        // For now, we prepend new posts to the container

        if (posts && posts.length > 0) {
            // Take the first 3 posts
            const topPosts = posts.slice(0, 3);

            // Clear or keep static card? Let's clear and re-add static card at the end
            const staticCard = container.querySelector('.news-card').outerHTML;
            container.innerHTML = '';

            topPosts.forEach(post => {
                const card = document.createElement('div');
                card.className = 'news-card animate-on-scroll';
                card.style.cssText = 'background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px); display: flex; flex-direction: column;';

                // Truncate caption
                const caption = post.caption ? (post.caption.length > 120 ? post.caption.substring(0, 120) + '...' : post.caption) : 'Nueva publicación';
                const date = new Date(post.timestamp).toLocaleDateString();

                card.innerHTML = `
                    <div class="news-image" style="margin: -30px -30px 20px -30px; height: 200px; overflow: hidden; border-radius: 15px 15px 0 0;">
                        <img src="${post.thumbnail}" alt="Instagram post" style="width: 100%; height: 100%; object-fit: cover;">
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

            // Re-add the original "Follow" card
            const wrapper = document.createElement('div');
            wrapper.innerHTML = staticCard;
            container.appendChild(wrapper.firstChild);
        }
    } catch (error) {
        console.log('Automated news not available yet. Showing default card.', error);
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', loadInstagramNews);
