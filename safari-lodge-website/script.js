/**
 * SAVANNA WILD LODGE & MUKOMBE BAR
 * Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPreloader();
    initNavigation();
    initParallax();
    initStats();
    initTestimonials();
    initGallery();
    initLightbox();
    initBookingForm();
    initScrollAnimations();
    initParticles();
});

/**
 * Preloader
 */
function initPreloader() {
    const preloader = document.getElementById('preloader');

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1000);
    });

    // Fallback - hide preloader after 3 seconds regardless
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 3000);
}

/**
 * Navigation
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const links = navLinks.querySelectorAll('a');

    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Parallax Effect
 */
function initParallax() {
    const hero = document.querySelector('.hero');
    const barParallax = document.querySelector('.bar-parallax');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        // Hero parallax
        if (hero) {
            hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
        }

        // Bar section parallax
        if (barParallax && isInViewport(barParallax.parentElement)) {
            const rect = barParallax.parentElement.getBoundingClientRect();
            const offset = (window.innerHeight - rect.top) * 0.3;
            barParallax.style.transform = `translateY(${offset}px)`;
        }
    });
}

/**
 * Animated Statistics Counter
 */
function initStats() {
    const stats = document.querySelectorAll('.stat-number');
    let animated = false;

    function animateStats() {
        if (animated) return;

        const statsSection = document.querySelector('.stats');
        if (!statsSection) return;

        if (isInViewport(statsSection)) {
            animated = true;
            stats.forEach(stat => {
                const target = parseInt(stat.dataset.target);
                animateNumber(stat, 0, target, 2000);
            });
        }
    }

    function animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        const format = (num) => {
            if (num >= 1000) {
                return num.toLocaleString();
            }
            return num.toString();
        };

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease out cubic)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (end - start) * easeOut);

            element.textContent = format(current);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = format(end);
            }
        }

        requestAnimationFrame(update);
    }

    window.addEventListener('scroll', animateStats);
    animateStats(); // Check on load
}

/**
 * Testimonials Slider
 */
function initTestimonials() {
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    let currentIndex = 0;
    let autoSlideInterval;

    function showTestimonial(index) {
        cards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        cards[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }

    function nextTestimonial() {
        const next = (currentIndex + 1) % cards.length;
        showTestimonial(next);
    }

    // Auto slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextTestimonial, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
            stopAutoSlide();
            startAutoSlide();
        });
    });

    // Start auto slide
    startAutoSlide();

    // Pause on hover
    const slider = document.querySelector('.testimonials-slider');
    if (slider) {
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);
    }
}

/**
 * Gallery Filtering & Hover Effects
 */
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.zIndex = '10';
        });

        item.addEventListener('mouseleave', () => {
            item.style.zIndex = '1';
        });
    });
}

/**
 * Lightbox
 */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const galleryItems = document.querySelectorAll('.gallery-item');

    let currentImageIndex = 0;
    const images = Array.from(galleryItems).map(item => item.querySelector('img').src);

    function openLightbox(index) {
        currentImageIndex = index;
        lightboxImage.src = images[index];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrev() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        lightboxImage.src = images[currentImageIndex];
    }

    function showNext() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        lightboxImage.src = images[currentImageIndex];
    }

    // Event listeners
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}

/**
 * Booking Form
 */
function initBookingForm() {
    const form = document.getElementById('bookingForm');
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    if (checkinInput) checkinInput.min = today;
    if (checkoutInput) checkoutInput.min = today;

    // Update checkout min when checkin changes
    if (checkinInput) {
        checkinInput.addEventListener('change', () => {
            checkoutInput.min = checkinInput.value;
            if (checkoutInput.value && checkoutInput.value < checkinInput.value) {
                checkoutInput.value = checkinInput.value;
            }
        });
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Collect form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Simulate submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                alert('Thank you for your reservation request! Our team will contact you within 24 hours to confirm your booking.');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            if (input.value) {
                alert('Thank you for subscribing to our safari updates!');
                input.value = '';
            }
        });
    }
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.room-card, .experience-card, .bar-feature, .drink-card, .feature, .gallery-item'
    );

    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
        observer.observe(el);
    });

    // Add CSS for animated state
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Floating Particles Effect
 */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    const size = Math.random() * 4 + 2;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 10;

    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(212, 168, 83, ${Math.random() * 0.5 + 0.2});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: float ${duration}s ease-in-out ${delay}s infinite;
        pointer-events: none;
    `;

    container.appendChild(particle);
}

// Add float animation
const floatStyle = document.createElement('style');
floatStyle.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        50% {
            transform: translate(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 100}px, -${Math.random() * 200 + 100}px) rotate(${Math.random() * 360}deg);
        }
    }
`;
document.head.appendChild(floatStyle);

/**
 * Utility Functions
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

/**
 * Smooth reveal for sections
 */
function initSectionReveal() {
    const sections = document.querySelectorAll('section');

    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-revealed');
            }
        });
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.15
    });

    sections.forEach(section => {
        section.classList.add('section-hidden');
        sectionObserver.observe(section);
    });
}

/**
 * Dynamic Room Pricing (example feature)
 */
function updateRoomPricing() {
    const rooms = document.querySelectorAll('.room-card');
    const isHighSeason = new Date().getMonth() >= 5 && new Date().getMonth() <= 9;

    rooms.forEach(room => {
        const priceEl = room.querySelector('.room-price');
        if (priceEl && isHighSeason) {
            const originalText = priceEl.innerHTML;
            if (!originalText.includes('High Season')) {
                priceEl.innerHTML += ' <small style="color: var(--color-terracotta);">(High Season)</small>';
            }
        }
    });
}

// Initialize on load
window.addEventListener('load', updateRoomPricing);

/**
 * Add ripple effect to buttons
 */
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

console.log('🦁 Savanna Wild Lodge & Mukombe Bar - Website Initialized');
console.log('🍸 Welcome to Mukombe Bar - Where Stories Flow Like the Zambezi');
