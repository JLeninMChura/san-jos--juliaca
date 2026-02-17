// ========================================
// SLIDER FUNCTIONALITY
// ========================================
class HeroSlider {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prevSlide');
        this.nextBtn = document.getElementById('nextSlide');
        this.dotsContainer = document.getElementById('sliderDots');
        this.autoplayInterval = null;
        this.autoplayDelay = 5000; // 5 seconds

        this.init();
    }

    init() {
        // Create dots
        this.createDots();

        // Event listeners
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Touch events for mobile swipe
        this.addTouchEvents();

        // Start autoplay
        this.startAutoplay();

        // Pause autoplay on hover
        const sliderContainer = document.querySelector('.slider-container');
        sliderContainer.addEventListener('mouseenter', () => this.stopAutoplay());
        sliderContainer.addEventListener('mouseleave', () => this.startAutoplay());
    }

    createDots() {
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
    }

    goToSlide(index) {
        // Remove active class from current slide and dot
        this.slides[this.currentSlide].classList.remove('active');
        const dots = document.querySelectorAll('.slider-dot');
        dots[this.currentSlide].classList.remove('active');

        // Update current slide
        this.currentSlide = index;

        // Add active class to new slide and dot
        this.slides[this.currentSlide].classList.add('active');
        dots[this.currentSlide].classList.add('active');

        // Reset autoplay
        this.resetAutoplay();
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoplayDelay);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }

    addTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;
        const sliderContainer = document.querySelector('.slider-container');

        sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });

        this.handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        };
    }
}

// ========================================
// NAVIGATION
// ========================================
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.menuToggle = document.getElementById('menuToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');

        this.init();
    }

    init() {
        // Scroll effect
        window.addEventListener('scroll', () => this.handleScroll());

        // Mobile menu toggle
        this.menuToggle.addEventListener('click', () => this.toggleMenu());

        // Dropdown toggle for mobile
        this.handleDropdownToggle();

        // Close menu when clicking on a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 1024) {
                    this.closeMenu();
                }
                this.updateActiveLink(link);
            });
        });

        // Smooth scroll
        this.smoothScroll();
    }

    handleScroll() {
        if (window.scrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        // Update active link based on scroll position
        this.updateActiveOnScroll();
    }

    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.menuToggle.classList.toggle('active');
    }

    closeMenu() {
        this.navMenu.classList.remove('active');
        this.menuToggle.classList.remove('active');
        // Close any open mobile dropdowns
        document.querySelectorAll('.nav-item.dropdown').forEach(drop => drop.classList.remove('active'));
    }

    handleDropdownToggle() {
        const dropdowns = document.querySelectorAll('.nav-item.dropdown');
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 1024) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        });
    }

    updateActiveLink(clickedLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        clickedLink.classList.add('active');
    }

    updateActiveOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (link && scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                this.navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    }

    smoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const navHeight = this.navbar.offsetHeight;
                        const targetPosition = target.offsetTop - navHeight;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
}

// ========================================
// STATS COUNTER
// ========================================
class StatsCounter {
    constructor() {
        this.stats = document.querySelectorAll('.stat-number');
        this.animated = false;

        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.checkPosition());
        this.checkPosition();
    }

    checkPosition() {
        if (this.animated) return;

        const statsSection = document.querySelector('.stats-section');
        if (!statsSection) return;

        const sectionTop = statsSection.offsetTop;
        const sectionHeight = statsSection.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight;

        if (scrollPosition > sectionTop + sectionHeight / 2) {
            this.animateStats();
            this.animated = true;
        }
    }

    animateStats() {
        this.stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target;
                }
            };

            updateCounter();
        });
    }
}

// ========================================
// FORM HANDLER
// ========================================
class FormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');

        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Simulate form submission
        this.showLoading();

        setTimeout(() => {
            this.showSuccess();
            this.form.reset();
        }, 1500);
    }

    showLoading() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
    }

    showSuccess() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        submitBtn.textContent = '✓ Enviado';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

        setTimeout(() => {
            submitBtn.textContent = 'Enviar solicitud';
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 3000);
    }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll(
            '.level-card, .news-card, .about-content, .feature-item'
        );

        this.init();
    }

    init() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }
}

// ========================================
// LAZY LOADING IMAGES
// ========================================
class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');

        if (this.images.length > 0) {
            this.init();
        }
    }

    init() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        this.images.forEach(img => imageObserver.observe(img));
    }
}

// ========================================
// PARALLAX EFFECT
// ========================================
class ParallaxEffect {
    constructor() {
        this.parallaxElements = document.querySelectorAll('.about-image img');

        if (this.parallaxElements.length > 0) {
            this.init();
        }
    }

    init() {
        window.addEventListener('scroll', () => {
            this.parallaxElements.forEach(element => {
                const speed = 0.5;
                const rect = element.getBoundingClientRect();
                const scrolled = window.pageYOffset;
                const rate = scrolled * speed;

                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    element.style.transform = `translateY(${rate * 0.1}px)`;
                }
            });
        });
    }
}

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// ========================================
// HYMN MODAL LOGIC
// ========================================
const hymnData = {
    colegio: {
        title: "Himno del Colegio",
        chorus: "CORO",
        chorusText: "Elena de Santa María\nnuestro Colegio sin igual;\nElena de Santa María\nseguimos fieles a tu ideal;\nsiempre seremos en gratitud,\nfaros perennes de la virtud.",
        stanzas: [
            {
                num: "I",
                text: "En tus aulas amado colegio\nnos enseñan la ciencia y virtud\ny nos place que noble y egregio\nresplandezcas por tu rectitud.\nNos instruyen y educan con tino,\nnuestras madres en diaria labor,\nmodelando con fuego divino\nnuestras almas sedientas de amor."
            },
            {
                num: "II",
                text: "Jubilosas cantamos la historia\nde tus sendas brillantes de luz,\ny queremos que aumente tu gloria\nnuestras vidas en pos de la Cruz.\nCon Jesús y María en las almas\nno tememos la saña infernal\nllegaremos portando las palmas\nA la Corte del Rey Celestial."
            }
        ],
        authors: "Autora letra: Sor Rosa María Muñoz O.P.<br>Autora música: Madre Estela Rumi O.P."
    },
    juliaca: {
        title: "Himno de Juliaca",
        chorus: "CORO",
        chorusText: "¡Oh! ciudad de los vientos, Juliaca,\nde los andes hermoso balcón,\nen tus manos la patria destaca,\ncomo un límpido y gran corazón.",
        stanzas: [
            {
                num: "I",
                text: "Cante el pueblo su himno de gloria\ncon el alma vibrante de fe,\nes Juliaca la luz de la historia\nque el destino en sus manos le dio.\nSu grandeza es el fruto bendito\nde su esfuerzo, su fe y su labor,\ntodo en ella es un himno infinito\nde esperanza, de paz y de amor."
            },
            {
                num: "II",
                text: "En tus pampas de sol y de frío\nel progreso levanta su altar,\ny en tus calles el noble gentío\ncanta un himno de fe sin igual.\nEres libre, Juliaca, y pujante\ncon el ritmo de tu actividad,\ntu camino es un reto vibrante\nde justicia, de paz y verdad."
            }
        ],
        authors: "Letra: Luis Rodríguez Ortiz<br>Música: Jorge Rivera del Mar"
    }
};

function openHymnModal(type) {
    const modal = document.getElementById('hymnModal');
    const modalBody = document.getElementById('modal-body');
    const data = hymnData[type];

    if (!data) return;

    let html = `
        <h2 class="hymn-modal-title">${data.title}</h2>
        <div class="hymn-lyrics-container">
            <div class="hymn-chorus">
                <span class="hymn-stanza-num">${data.chorus}</span>
                ${data.chorusText.replace(/\n/g, '<br>')}
            </div>
            ${data.stanzas.map(stanza => `
                <div class="hymn-stanza">
                    <span class="hymn-stanza-num">${stanza.num}</span>
                    ${stanza.text.replace(/\n/g, '<br>')}
                </div>
            `).join('')}
            <div class="hymn-authors">
                ${data.authors}
            </div>
        </div>
    `;

    modalBody.innerHTML = html;
    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Prevent scrolling
}

function closeHymnModal() {
    const modal = document.getElementById('hymnModal');
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Restore scrolling
}

// Event Listeners for Hymn Modal
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('hymnModal');
    const closeBtn = document.querySelector('.close-modal');

    if (closeBtn) {
        closeBtn.onclick = closeHymnModal;
    }

    window.onclick = (event) => {
        if (event.target == modal) {
            closeHymnModal();
        }
    };
});

/**
 * VIRTUAL ASSISTANT CHATBOT (ROBOT)
 */
class ChatbotAssistant {
    constructor() {
        this.container = document.getElementById('chatbot-container');
        if (!this.container) return;

        this.trigger = document.getElementById('chatbot-trigger');
        this.window = document.getElementById('chatbot-window');
        this.closeBtn = document.getElementById('close-chat');
        this.messagesArea = document.getElementById('chat-messages');
        this.optionsContainer = this.messagesArea.querySelector('.chat-options');
        this.badge = this.container.querySelector('.chat-badge');

        this.faqData = {
            admision: "¡Hola! El proceso de **Admisión 2026** ya está disponible. Contamos con vacantes para Inicial, Primaria y Secundaria. ¿Te gustaría agendar una visita o ver los requisitos?",
            niveles: "En el San José Juliaca ofrecemos una formación integral en **Inicial**, **Primaria** y **Secundaria**, con talleres de robótica, música y deportes.",
            ubicacion: "Nuesto colegio está ubicado en la ciudad de **Juliaca**. Atendemos consultas presenciales de lunes a viernes de 8:00 AM a 1:00 PM."
        };

        this.init();
    }

    init() {
        this.trigger.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleChat(false);
        });

        // Setup FAQ options
        const options = this.container.querySelectorAll('.chat-option[data-answer]');
        options.forEach(opt => {
            opt.addEventListener('click', () => {
                const answerKey = opt.getAttribute('data-answer');
                const questionText = opt.innerText;
                this.handleUserAction(questionText, answerKey);
            });
        });
    }

    toggleChat(force) {
        const isOpen = force !== undefined ? force : !this.window.classList.contains('active');
        this.window.classList.toggle('active', isOpen);

        if (isOpen) {
            this.badge.style.display = 'none';
        }
    }

    handleUserAction(question, answerKey) {
        this.addMessage(question, 'user');

        // Typing effect
        setTimeout(() => {
            this.addMessage(this.faqData[answerKey], 'bot');

            // Bring options back to bottom
            this.messagesArea.appendChild(this.optionsContainer);
            this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
        }, 600);
    }

    addMessage(text, type) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${type}`;
        msgDiv.innerHTML = text;
        this.messagesArea.appendChild(msgDiv);
        this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
    }
}

// ========================================
// INITIALIZE ALL
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new HeroSlider();
    new Navigation();
    new StatsCounter();
    new FormHandler();
    new ScrollAnimations();
    new LazyLoader();
    new ParallaxEffect();
    new ChatbotAssistant();

    // Add fade-in animation to hero content
    const heroContent = document.querySelector('.slide-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease';
            heroContent.style.opacity = '1';
        }, 100);
    }

    // Console styling
    console.log(
        '%c¡Bienvenido a Tu Colegio! 🎓',
        'color: #0A2463; font-size: 20px; font-weight: bold; padding: 10px;'
    );
    console.log(
        '%cSitio web desarrollado con las últimas tecnologías web',
        'color: #D62828; font-size: 12px;'
    );
});

// ========================================
// PERFORMANCE MONITORING
// ========================================
window.addEventListener('load', () => {
    // Log performance metrics
    if ('performance' in window) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Página cargada en ${pageLoadTime}ms`);
    }

    // Remove loading states
    document.body.classList.add('loaded');
});

// ========================================
// ERROR HANDLING
// ========================================
window.addEventListener('error', (e) => {
    console.error('Error detectado:', e.error);
});

// ========================================
// UTILITY FUNCTIONS
// ========================================
const Utils = {
    // Scroll to top
    scrollToTop: () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    },

    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Format number with commas
    formatNumber: (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    // Generate random ID
    generateId: () => {
        return Math.random().toString(36).substr(2, 9);
    }
};

// Export utilities to global scope
window.Utils = Utils;