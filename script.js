function initSite() {
    console.log('Iniciando scripts do Mídia Informal...');

    // --- 1. Real-time Weather and Dollar Logic ---
    const weatherElement = document.getElementById('weather-info');
    const dollarElement = document.getElementById('dollar-info');

    async function fetchWeather() {
        if (!weatherElement) return;
        try {
            const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-22.9068&longitude=-43.1729&current_weather=true');
            const data = await response.json();
            if (data && data.current_weather) {
                const temp = Math.round(data.current_weather.temperature);
                weatherElement.textContent = `Rio de Janeiro ${temp}°C`;
            }
        } catch (error) {
            weatherElement.textContent = 'Clima indisponível';
        }
    }

    async function fetchDollarValue() {
        if (!dollarElement) return;
        try {
            const response = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL');
            const data = await response.json();
            if (data && data.USDBRL) {
                const value = parseFloat(data.USDBRL.bid).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                dollarElement.textContent = `Dólar R$ ${value}`;
            }
        } catch (error) {
            dollarElement.textContent = 'Dólar indisponível';
        }
    }

    fetchWeather();
    fetchDollarValue();

    // --- 2. Current Date Logic ---
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        let dateString = today.toLocaleDateString('pt-BR', options);
        dateString = dateString.charAt(0).toUpperCase() + dateString.slice(1);
        dateElement.textContent = dateString;
    }

    // --- 3. Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.onclick = () => mobileMenu.classList.toggle('hidden');
    }

    // --- 4. News Filtering and Pagination Logic ---
    const newsItems = document.querySelectorAll('.news-item');
    const paginationContainer = document.getElementById('pagination-controls');
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (newsItems.length > 0) {
        let currentFilter = 'all';
        let currentPage = 1;
        const itemsPerPage = 12;

        function updateDisplay() {
            const filtered = Array.from(newsItems).filter(item => {
                const cat = item.getAttribute('data-category');
                return currentFilter === 'all' || cat === currentFilter;
            });

            const totalPages = Math.ceil(filtered.length / itemsPerPage);
            if (currentPage > totalPages) currentPage = totalPages || 1;

            // Hide all
            newsItems.forEach(item => {
                item.style.display = 'none';
                item.classList.remove('animate-fade-in');
            });

            // Show current page
            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            filtered.slice(start, end).forEach(item => {
                item.style.display = 'flex'; // Ensure flex layout
                setTimeout(() => item.classList.add('animate-fade-in'), 10);
            });

            renderControls(totalPages);
        }

        function renderControls(totalPages) {
            if (!paginationContainer) return;
            paginationContainer.innerHTML = '';
            if (totalPages <= 1) return;

            // Previous
            const prev = document.createElement('button');
            prev.className = `pagination-btn pagination-nav-btn ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`;
            prev.innerHTML = '← Anterior';
            prev.onclick = () => { if (currentPage > 1) { currentPage--; updateDisplay(); window.scrollTo({top: 200, behavior: 'smooth'}); } };
            paginationContainer.appendChild(prev);

            // Pages
            for (let i = 1; i <= totalPages; i++) {
                const btn = document.createElement('button');
                btn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
                btn.textContent = i;
                btn.onclick = () => { currentPage = i; updateDisplay(); window.scrollTo({top: 200, behavior: 'smooth'}); };
                paginationContainer.appendChild(btn);
            }

            // Next
            const next = document.createElement('button');
            next.className = `pagination-btn pagination-nav-btn ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`;
            next.innerHTML = 'Próximo →';
            next.onclick = () => { if (currentPage < totalPages) { currentPage++; updateDisplay(); window.scrollTo({top: 200, behavior: 'smooth'}); } };
            paginationContainer.appendChild(next);
        }

        // Filter events
        filterButtons.forEach(btn => {
            btn.onclick = () => {
                currentFilter = btn.getAttribute('data-filter');
                currentPage = 1;
                filterButtons.forEach(b => b.classList.remove('active', 'border-brand-blue', 'text-brand-blue'));
                btn.classList.add('active', 'border-brand-blue', 'text-brand-blue');
                updateDisplay();
            };
        });

        updateDisplay();
    }

    // --- 5. Gallery Lightbox Logic ---
    const galleryImages = document.querySelectorAll('.gallery-img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxDesc = document.getElementById('lightbox-description');
    const lightboxAuthor = document.getElementById('lightbox-author');
    const lightboxDescContainer = document.getElementById('lightbox-description-container');
    const closeLightbox = document.getElementById('close-lightbox');

    if (galleryImages.length > 0 && lightbox) {
        galleryImages.forEach(img => {
            img.onclick = (e) => {
                e.preventDefault();
                const src = img.getAttribute('src');
                const desc = img.getAttribute('data-description');
                const author = img.getAttribute('data-author');

                lightboxImg.src = src;
                if (desc) {
                    lightboxDesc.textContent = desc;
                    lightboxDescContainer.classList.remove('hidden');
                } else {
                    lightboxDescContainer.classList.add('hidden');
                }
                if (author) {
                    lightboxAuthor.textContent = `Foto: ${author}`;
                }

                lightbox.classList.add('active');
                lightbox.classList.remove('hidden');
                document.body.style.overflow = 'hidden'; // Prevent scroll
            };
        });

        const closeFunc = () => {
            lightbox.classList.remove('active');
            lightbox.classList.add('hidden');
            document.body.style.overflow = ''; // Restore scroll
        };

        if (closeLightbox) closeLightbox.onclick = closeFunc;
        lightbox.onclick = (e) => {
            if (e.target === lightbox || e.target === lightbox.querySelector('.relative')) {
                closeFunc();
            }
        };

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeFunc();
        });
    }
}

// Inicia imediatamente ou quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSite);
} else {
    initSite();
}
