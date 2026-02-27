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
    const closeLightbox = document.getElementById('close-lightbox');
    const galleryImages = document.querySelectorAll('.gallery-img');

    if (lightbox && lightboxImg) {
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
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
});
