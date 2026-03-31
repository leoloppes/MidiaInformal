document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Real-time Weather and Dollar Logic ---
    const weatherElement = document.getElementById('weather-info');
    const dollarElement = document.getElementById('dollar-info');

    async function fetchWeather() {
        if (!weatherElement) return;
        console.log('Iniciando busca de clima...');
        try {
            // Rio de Janeiro coordinates: -22.9068, -43.1729
            const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-22.9068&longitude=-43.1729&current_weather=true');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            console.log('Dados de clima recebidos:', data);

            if (data && data.current_weather) {
                const temp = Math.round(data.current_weather.temperature);
                weatherElement.textContent = `Rio de Janeiro ${temp}°C`;
            } else {
                throw new Error('Estrutura de dados do clima inválida');
            }
        } catch (error) {
            console.error('Erro ao buscar clima:', error);
            weatherElement.textContent = 'Clima indisponível';
        }
    }

    async function fetchDollarValue() {
        if (!dollarElement) return;
        console.log('Iniciando busca do dólar...');
        try {
            const response = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            console.log('Dados do dólar recebidos:', data);

            if (data && data.USDBRL) {
                const value = parseFloat(data.USDBRL.bid).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                dollarElement.textContent = `Dólar R$ ${value}`;
            } else {
                throw new Error('Estrutura de dados do dólar inválida');
            }
        } catch (error) {
            console.error('Erro ao buscar dólar:', error);
            dollarElement.textContent = 'Dólar indisponível';
        }
    }

    // Initial fetch
    fetchWeather();
    fetchDollarValue();

    // Update every 30 minutes
    setInterval(() => {
        fetchWeather();
        fetchDollarValue();
    }, 30 * 60 * 1000);

    // --- 2. Current Date Logic (G1 Style) ---
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        // Capitalize first letter
        let dateString = today.toLocaleDateString('pt-BR', options);
        dateString = dateString.charAt(0).toUpperCase() + dateString.slice(1);
        dateElement.textContent = dateString;
    }

    // --- 2. Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Close mobile menu when clicking a link
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // --- 3. Contact Form Submission (Formspree Integration) ---
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Loading state
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'ENVIANDO...';

            const formData = new FormData(contactForm);

            try {
                const response = await fetch('https://formspree.io/f/xbdazeon', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    alert('Obrigado! Sua pauta/mensagem foi enviada para nossa redação.');
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        alert(data["errors"].map(error => error["message"]).join(", "));
                    } else {
                        alert('Ops! Ocorreu um problema ao enviar seu formulário.');
                    }
                }
            } catch (error) {
                alert('Ops! Ocorreu um erro de conexão.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }

    // --- 4. Gallery Lightbox Logic ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxAuthor = document.getElementById('lightbox-author');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxDescContainer = document.getElementById('lightbox-description-container');
    const closeLightbox = document.getElementById('close-lightbox');
    const galleryImages = document.querySelectorAll('.gallery-img');

    if (lightbox && lightboxImg) {
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                
                const author = img.getAttribute('data-author');
                const description = img.getAttribute('data-description');
                
                let hasContent = false;
                
                if (lightboxDescription && description) {
                    lightboxDescription.textContent = description;
                    hasContent = true;
                }
                
                if (lightboxAuthor && author) {
                    lightboxAuthor.textContent = `Foto: ${author}`;
                    hasContent = true;
                }
                
                if (lightboxDescContainer) {
                    if (hasContent) {
                        lightboxDescContainer.classList.remove('hidden');
                    } else {
                        lightboxDescContainer.classList.add('hidden');
                    }
                }
                
                lightbox.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLightboxModal = () => {
            lightbox.classList.add('hidden');
            lightboxImg.src = '';
            document.body.style.overflow = '';
        };

        if (closeLightbox) {
            closeLightbox.addEventListener('click', closeLightboxModal);
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightboxModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
                closeLightboxModal();
            }
        });
    }

    // --- 5. News Filtering and Pagination Logic ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const newsItems = document.querySelectorAll('.news-item');
    const paginationContainer = document.getElementById('pagination-controls');

    let currentFilter = 'all';
    let currentPage = 1;
    const itemsPerPage = 12;

    function getFilteredItems() {
        return Array.from(newsItems).filter(item => {
            const category = item.getAttribute('data-category');
            return currentFilter === 'all' || category === currentFilter;
        });
    }

    function updateNewsDisplay() {
        if (!newsItems.length) return;

        const filteredItems = getFilteredItems();
        const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

        // Clamp currentPage to valid range
        if (currentPage > totalPages) currentPage = totalPages || 1;

        // Hide ALL items first
        newsItems.forEach(item => {
            item.style.display = 'none';
            item.classList.remove('animate-fade-in');
        });

        // Show only the items for the current page
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        filteredItems.slice(start, end).forEach(item => {
            item.style.display = '';
            item.classList.add('animate-fade-in');
        });

        renderPaginationControls(totalPages);
    }

    function renderPaginationControls(totalPages) {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = '';

        if (totalPages <= 1) return;

        // Previous Button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn pagination-nav-btn';
        prevBtn.innerHTML = '← Anterior';
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                updateNewsDisplay();
                window.scrollTo({ top: 200, behavior: 'smooth' });
            }
        };
        paginationContainer.appendChild(prevBtn);

        // Page number buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.onclick = () => {
                currentPage = i;
                updateNewsDisplay();
                window.scrollTo({ top: 200, behavior: 'smooth' });
            };
            paginationContainer.appendChild(pageBtn);
        }

        // Next Button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn pagination-nav-btn';
        nextBtn.innerHTML = 'Próximo →';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                updateNewsDisplay();
                window.scrollTo({ top: 200, behavior: 'smooth' });
            }
        };
        paginationContainer.appendChild(nextBtn);
    }

    if (newsItems.length > 0) {
        // Initial load
        updateNewsDisplay();

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                currentFilter = btn.getAttribute('data-filter');
                currentPage = 1;

                // Update active button UI
                filterButtons.forEach(b => {
                    b.classList.remove('active', 'border-brand-blue', 'text-brand-blue');
                });
                btn.classList.add('active', 'border-brand-blue', 'text-brand-blue');

                updateNewsDisplay();
            });
        });
    }
});
