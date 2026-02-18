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
        this.topBar = document.querySelector('.top-bar'); // New Top Bar
        this.menuToggle = document.getElementById('menuToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');

        if (this.navbar && this.menuToggle && this.navMenu) {
            this.init();
        }
    }

    init() {
        // Scroll effect
        window.addEventListener('scroll', () => this.handleScroll());

        // Mobile menu toggle
        this.menuToggle.addEventListener('click', () => this.toggleMenu());

        // Dropdown toggle for mobile
        this.handleDropdownToggle();

        // Close menu when clicking on a link (BUT NOT dropdown toggles)
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // If it's a dropdown toggle, don't close the menu
                if (link.classList.contains('dropdown-toggle')) {
                    return;
                }

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
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
            if (this.topBar) this.topBar.classList.add('hidden');
        } else {
            this.navbar.classList.remove('scrolled');
            if (this.topBar) this.topBar.classList.remove('hidden');
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

        if (this.stats.length > 0) {
            this.init();
        }
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
        this.whatsappNumber = '51949373659'; // Número del colegio

        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();

        const nombre = this.form.querySelector('[name="nombre"]').value.trim();
        const telefono = this.form.querySelector('[name="telefono"]').value.trim();
        const alumno = this.form.querySelector('[name="alumno"]').value.trim();
        const nivel = this.form.querySelector('[name="nivel"]').value;
        const mensajeExtra = this.form.querySelector('[name="mensaje"]').value.trim();

        const mensaje =
            `🏫 *Solicitud de Información - Colegio San José Juliaca*\n\n` +
            `👤 *Apoderado:* ${nombre}\n` +
            `📞 *Teléfono:* ${telefono}\n` +
            `🎒 *Alumno:* ${alumno}\n` +
            `📚 *Nivel de interés:* ${nivel}\n` +
            (mensajeExtra ? `💬 *Mensaje:* ${mensajeExtra}\n` : '') +
            `\n_Enviado desde el sitio web del Colegio San José Juliaca._`;

        const url = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(mensaje)}`;

        // Feedback visual
        const submitBtn = this.form.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Abriendo WhatsApp...';
        submitBtn.disabled = true;

        setTimeout(() => {
            window.open(url, '_blank');
            this.form.reset();
            submitBtn.innerHTML = '<i class="fab fa-whatsapp"></i> ✓ ¡Listo!';
            submitBtn.style.background = 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)';

            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Enviar por WhatsApp';
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
        }, 500);
    }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
class ScrollAnimations {
    constructor() {
        this.revealElements = document.querySelectorAll('.reveal');

        if (this.revealElements.length > 0) {
            this.init();
        }
    }

    init() {
        const observerOptions = {
            threshold: 0.1, // Lower threshold for better mobile detection
            rootMargin: '0px 0px -50px 0px' // Tighter margin
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // We don't unobserve if we want animations to replay (optional)
                    // observer.unobserve(entry.target); 
                }
            });
        }, observerOptions);

        this.revealElements.forEach(element => {
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
        title: "HIMNO AL COLEGIO SAN JOSÉ JULIACA",
        sections: [
            {
                type: "stanza",
                text: "En la perla del altiplano,\nHuaynaroque y ciudad de los vientos.\nEntonemos a nuestro colegio,\nQue enciende las luces de eterna lección."
            },
            {
                type: "chorus",
                label: "CORO:",
                text: "San José Juliaca es el mejor,\nFormación integral y valores.\nEnseñando con sabiduría,\nCon ejemplo y laboriosidad.\n\nSan José Juliaca es innovación,\nCultivando aprendizaje y ciencia.\nEnseñando con sabiduría,\nCon ejemplo y la verdad."
            },
            {
                type: "stanza",
                label: "CODA:",
                text: "Enseñando con sabiduría,\nCon ejemplo y la verdad."
            }
        ],
        authors: "Letra y música:\nJulio César LEONARDOTURPO"
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
            ${data.sections ? data.sections.map(section => `
                <div class="hymn-section ${section.type}">
                    ${section.label ? `<span class="hymn-section-label">${section.label}</span>` : ''}
                    <div class="hymn-text-block">${section.text.replace(/\n/g, '<br>')}</div>
                </div>
            `).join('') : `
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
            `}
            <div class="hymn-authors">
                ${data.authors.replace(/\n/g, '<br>')}
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
// REGISTRATION POPUP MODAL
// ========================================
class RegistrationModal {
    constructor() {
        this.modal = document.getElementById('registrationModal');
        this.closeBtn = document.getElementById('closeRegistrationModal');

        if (this.modal && this.closeBtn) {
            this.init();
        }
    }

    init() {
        // Show modal on page load
        window.addEventListener('load', () => {
            // Small delay for better visual presentation
            setTimeout(() => {
                this.openModal();
            }, 1200);
        });

        // Close button functionality
        this.closeBtn.onclick = () => this.closeModal();

        // Click outside to close
        window.addEventListener('click', (event) => {
            if (event.target == this.modal) {
                this.closeModal();
            }
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    openModal() {
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ========================================
// INTERACTIVE GALLERY (LIGHTBOX)
// ========================================
class InteractiveGallery {
    constructor() {
        this.galleryItems = document.querySelectorAll('.gallery-card');
        this.lightbox = document.getElementById('galleryLightbox');
        this.lightboxImg = document.getElementById('lightboxImg');
        this.lightboxCaption = document.getElementById('lightboxCaption');
        this.closeBtn = document.querySelector('.lightbox-close');
        this.prevBtn = document.getElementById('lightboxPrev');
        this.nextBtn = document.getElementById('lightboxNext');
        this.currentIndex = 0;

        if (this.galleryItems.length > 0 && this.lightbox) {
            this.init();
        }
    }

    init() {
        this.galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.currentIndex = index;
                this.updateLightbox();
                this.openLightbox();
            });
        });

        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeLightbox());
        }

        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.prevImage();
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.nextImage();
            });
        }

        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });

        // ESC and Arrows for navigation
        document.addEventListener('keydown', (e) => {
            if (this.lightbox.style.display === 'block') {
                if (e.key === 'Escape') this.closeLightbox();
                if (e.key === 'ArrowLeft') this.prevImage();
                if (e.key === 'ArrowRight') this.nextImage();
            }
        });
    }

    updateLightbox() {
        const item = this.galleryItems[this.currentIndex];
        const src = item.getAttribute('data-full');
        const alt = item.querySelector('img').alt;
        this.lightboxImg.src = src;
        this.lightboxCaption.textContent = alt;
    }

    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.galleryItems.length;
        this.updateLightbox();
    }

    prevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.galleryItems.length) % this.galleryItems.length;
        this.updateLightbox();
    }

    openLightbox() {
        this.lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

/**
 * TESTIMONIALS CAROUSEL
 */
class TestimonialsCarousel {
    constructor() {
        this.track = document.getElementById('testimonialsTrack');
        if (!this.track) return;

        this.cards = Array.from(this.track.children);
        this.nextBtn = document.getElementById('nextTestimonial');
        this.prevBtn = document.getElementById('prevTestimonial');
        this.dotsContainer = document.getElementById('testimonialDots');
        this.currentIndex = 0;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000; // 5 seconds

        this.init();
    }

    init() {
        if (!this.cards.length) return;

        // Create dots
        this.cards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('testimonial-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetAutoplay();
            });
            this.dotsContainer.appendChild(dot);
        });

        // Event listeners
        this.nextBtn.addEventListener('click', () => {
            this.nextSlide();
            this.resetAutoplay();
        });
        this.prevBtn.addEventListener('click', () => {
            this.prevSlide();
            this.resetAutoplay();
        });

        // Swipe support
        this.addTouchEvents();

        // Start autoplay
        this.startAutoplay();

        // Pause on hover
        const container = document.querySelector('.testimonials-carousel-container');
        container.addEventListener('mouseenter', () => this.stopAutoplay());
        container.addEventListener('mouseleave', () => this.startAutoplay());
    }

    goToSlide(index) {
        this.currentIndex = index;
        const cardWidth = this.cards[0].offsetWidth;
        const gap = 30; // Matches CSS gap
        const offset = -this.currentIndex * (cardWidth + gap);

        this.track.style.transform = `translateX(${offset}px)`;

        // Update dots
        const dots = Array.from(this.dotsContainer.children);
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentIndex);
        });
    }

    nextSlide() {
        // Only slide if there are more cards to show
        const visibleCards = window.innerWidth > 1024 ? 3 : (window.innerWidth > 768 ? 2 : 1);
        if (this.currentIndex < this.cards.length - visibleCards) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0; // Loop back
        }
        this.goToSlide(this.currentIndex);
    }

    prevSlide() {
        const visibleCards = window.innerWidth > 1024 ? 3 : (window.innerWidth > 768 ? 2 : 1);
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.cards.length - visibleCards; // Go to end
        }
        this.goToSlide(this.currentIndex);
    }

    startAutoplay() {
        this.stopAutoplay();
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
        let startX = 0;
        let endX = 0;

        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        this.track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) this.nextSlide();
                else this.prevSlide();
                this.resetAutoplay();
            }
        }, { passive: true });
    }
}

// ========================================
// INITIALIZE ALL
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    const initComponent = (ComponentClass) => {
        try {
            new ComponentClass();
        } catch (e) {
            console.warn(`Error initializing ${ComponentClass.name}:`, e.message);
        }
    };

    initComponent(HeroSlider);
    initComponent(Navigation);
    initComponent(StatsCounter);
    initComponent(FormHandler);
    initComponent(ScrollAnimations);
    initComponent(LazyLoader);
    initComponent(ParallaxEffect);
    initComponent(ChatbotAssistant);
    initComponent(RegistrationModal);
    initComponent(InteractiveGallery);

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
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('preloader-hidden');
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 800);
    } else {
        document.body.classList.add('loaded');
    }
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