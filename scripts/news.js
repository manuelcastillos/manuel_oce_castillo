/**
 * news.js - Professional interactive Instagram news gallery
 */

async function loadInstagramNews() {
    const container = document.getElementById('news-container');
    if (!container) return;

    // Create News Modal if not exists
    if (!document.getElementById('news-modal')) {
        const modalHTML = `
            <div id="news-modal" class="news-modal-overlay">
                <div class="news-modal-content">
                    <span class="news-modal-close">&times;</span>
                    <div class="news-modal-body">
                        <div class="modal-image-col">
                            <img src="" id="modal-news-img" alt="Newsletter Image">
                        </div>
                        <div class="modal-text-col">
                            <div class="modal-date" id="modal-news-date"></div>
                            <h3 class="modal-handle">@lofi_sat</h3>
                            <div class="modal-caption" id="modal-news-caption"></div>
                            <a href="" id="modal-news-link" target="_blank" class="btn-insta">
                                <i class="fa-brands fa-instagram"></i> Ver en Instagram
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Modal logic
        const modal = document.getElementById('news-modal');
        const closeBtn = document.querySelector('.news-modal-close');

        closeBtn.onclick = () => modal.classList.remove('active');
        window.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };
    }

    try {
        const response = await fetch(`./data/instagram_news.json?v=${new Date().getTime()}`);
        if (!response.ok) throw new Error('News file not found');
        const posts = await response.json();

        if (posts && posts.length > 0) {
            // Sort posts by timestamp descending to ensure newest are first
            posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            container.innerHTML = '';

            posts.forEach((post, index) => {
                const card = document.createElement('div');
                card.className = 'interactive-news-card';
                card.style.animationDelay = `${index * 0.1}s`;

                const date = post.timestamp ? new Date(post.timestamp).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Reciente';
                const shortCaption = post.caption ? (post.caption.length > 100 ? post.caption.substring(0, 100) + '...' : post.caption) : '';

                // Use a reliable proxy for IG images (weserv)
                const imgUrl = post.thumbnail ? `https://images.weserv.nl/?url=${encodeURIComponent(post.thumbnail)}&w=600&fit=cover` : 'images/logo_lofisat.jpg';

                card.innerHTML = `
                    <div class="card-inner">
                        <div class="card-image">
                            <img src="${imgUrl}" alt="News" onerror="this.src='images/logo_lofisat.jpg'">
                            <div class="card-date-badge">${date}</div>
                            <div class="card-watermark">
                                <img src="images/logo_lofisat.jpg" alt="Logo LOFISAT">
                            </div>
                        </div>
                        <div class="card-info">
                            <span class="card-tag">LOFISAT News</span>
                            <h3>${shortCaption}</h3>
                            <div class="card-footer">
                                <span>@lofi_sat</span>
                                <i class="fa-solid fa-plus-circle"></i>
                            </div>
                        </div>
                    </div>
                `;

                card.onclick = () => {
                    const modal = document.getElementById('news-modal');
                    document.getElementById('modal-news-img').src = imgUrl;
                    document.getElementById('modal-news-date').textContent = date;
                    document.getElementById('modal-news-caption').textContent = post.caption;
                    document.getElementById('modal-news-link').href = post.permalink;
                    modal.classList.add('active');
                };

                container.appendChild(card);
            });

            // Add the "Follow us" card at the end
            const followCard = document.createElement('div');
            followCard.className = 'interactive-news-card follow-us-card';
            followCard.innerHTML = `
                <div class="card-inner">
                    <div class="follow-content">
                        <i class="fa-brands fa-instagram"></i>
                        <h3>Sigue nuestras expediciones</h3>
                        <p>Día a día del LOFISAT en tiempo real.</p>
                        <a href="https://www.instagram.com/lofi_sat/" target="_blank" class="btn-mini">@lofi_sat</a>
                    </div>
                </div>
            `;
            container.appendChild(followCard);
        }
    } catch (error) {
        console.error('Error loading news:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadInstagramNews);
