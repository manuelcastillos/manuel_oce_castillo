/**
 * field.js - Dynamically loads Instagram posts from a JSON file
 * to populate the "En Terreno" section.
 */

async function loadFieldPosts() {
    const container = document.getElementById('field-grid');
    if (!container) return;

    try {
        // Cache busting to ensure we always get the latest news
        const response = await fetch(`./data/field_posts.json?v=${new Date().getTime()}`);
        if (!response.ok) throw new Error('Field posts file not found');

        const posts = await response.json();

        if (posts && posts.length > 0) {
            // Get all existing gallery items
            const items = container.querySelectorAll('.gallery-item');

            posts.forEach((post, index) => {
                if (index < items.length) {
                    const item = items[index];
                    const imgUrl = post.thumbnail ? `https://images.weserv.nl/?url=${encodeURIComponent(post.thumbnail)}&w=400&h=400&fit=cover` : '';

                    // Clear existing content and replace with image and caption
                    item.innerHTML = '';
                    item.style.backgroundImage = `url('${imgUrl}')`;
                    item.style.backgroundSize = 'cover';
                    item.style.backgroundPosition = 'center';
                    item.style.cursor = 'pointer';
                    item.style.position = 'relative';
                    item.style.overflow = 'hidden';
                    item.classList.add('animate-on-scroll');

                    // Create overlay for caption
                    const overlay = document.createElement('div');
                    overlay.className = 'field-overlay';
                    overlay.style.cssText = 'position: absolute; bottom: 0; left: 0; width: 100%; padding: 15px; background: rgba(0,0,0,0.7); color: white; transition: 0.3s; transform: translateY(100%);';

                    const captionText = post.caption ? (post.caption.length > 60 ? post.caption.substring(0, 57) + '...' : post.caption) : 'Ver en Instagram';
                    overlay.innerHTML = `<p style="font-size: 0.85rem; margin: 0; line-height: 1.2;">${captionText}</p>`;

                    item.appendChild(overlay);

                    // Hover effect
                    item.addEventListener('mouseenter', () => {
                        overlay.style.transform = 'translateY(0)';
                    });
                    item.addEventListener('mouseleave', () => {
                        overlay.style.transform = 'translateY(100%)';
                    });

                    // Click to go to Instagram
                    item.addEventListener('click', () => {
                        window.open(post.permalink, '_blank');
                    });
                }
            });
        }
    } catch (error) {
        console.error('Error loading field posts:', error);
    }
}

// Execute on load
window.addEventListener('load', loadFieldPosts);
if (document.readyState === 'complete') loadFieldPosts();
