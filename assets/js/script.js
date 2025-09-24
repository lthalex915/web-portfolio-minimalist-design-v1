// Language toggle functionality
let currentLang = 'zh';

function toggleLanguage() {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    const elements = document.querySelectorAll('[data-en][data-zh]');

    elements.forEach((element) => {
        const text = currentLang === 'en'
            ? element.getAttribute('data-en')
            : element.getAttribute('data-zh');

        if (element.tagName === 'A' || element.tagName === 'BUTTON') {
            element.textContent = text;
        } else {
            element.innerHTML = text;
        }
    });

    document.documentElement.lang = currentLang === 'zh' ? 'zh-TW' : 'en';
}

/**
 * Navigation functionality
 * Use classes instead of style.display to allow CSS transitions if needed.
 */
function showSection(sectionId) {
    const sections = ['home', 'gallery', 'about', 'contact'];
    const hero = document.querySelector('.hero-section');

    sections.forEach((id) => {
        const section = document.getElementById(id);
        if (!section) return;

        if (id === sectionId) {
            section.classList.add('is-visible');
            section.classList.remove('is-hidden');
            section.style.display = id === 'home' && hero ? 'flex' : 'block';
        } else {
            section.classList.remove('is-visible');
            section.classList.add('is-hidden');
            section.style.display = 'none';
        }
    });

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach((link) => link.classList.remove('active'));
    const activeLink = document.querySelector(`[href="#${sectionId}"]`);
    if (activeLink) activeLink.classList.add('active');
}

// Mobile menu toggle
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

/**
 * Smooth scroll indicator with rAF to avoid layout thrash
 */
let scrollRafId = null;
function updateScrollIndicator() {
    if (scrollRafId) return; // coalesce multiple scroll events
    scrollRafId = requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset;
        const docHeight = Math.max(1, document.body.scrollHeight - window.innerHeight);
        const scrollPercent = scrollTop / docHeight;
        const indicator = document.querySelector('.scroll-indicator');
        if (indicator) {
            indicator.style.transform = `scaleX(${scrollPercent})`;
        }
        scrollRafId = null;
    });
}

// Initialize interactions once DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Navigation click handlers
    document.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            showSection(sectionId);

            // Close mobile menu if open
            if (window.innerWidth <= 1024) {
                const sidebar = document.getElementById('sidebar');
                if (sidebar) {
                    sidebar.classList.remove('open');
                }
            }
        });
    });

    // Menu toggle button
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            toggleMenu();
        });
    }

    // Language toggle button
    const languageToggle = document.querySelector('.language-toggle');
    if (languageToggle) {
        languageToggle.addEventListener('click', () => {
            toggleLanguage();
        });
    }

    // CTA button click handler - navigate to gallery.html
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            window.location.href = 'gallery.html';
        });
    }

    // Scroll indicator updates
    window.addEventListener('scroll', updateScrollIndicator, { passive: true });
    updateScrollIndicator();

    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.querySelector('.menu-toggle');

        if (
            window.innerWidth <= 1024 &&
            sidebar &&
            menuToggle &&
            !sidebar.contains(event.target) &&
            !menuToggle.contains(event.target) &&
            sidebar.classList.contains('open')
        ) {
            sidebar.classList.remove('open');
        }
    });

    // Gallery item hover effects (prefer CSS, fallback JS keeps to transform only)
    document.querySelectorAll('.gallery-item').forEach((item) => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translate3d(0, -10px, 0) scale(1.02)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translate3d(0, 0, 0) scale(1)';
        });
    });

    // Parallax effect for floating elements (rAF)
    let parallaxRaf = null;
    window.addEventListener('scroll', () => {
        if (parallaxRaf) return;
        parallaxRaf = requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelectorAll('.floating-element');
            parallax.forEach((element, index) => {
                const speed = 0.5 + index * 0.2;
                element.style.transform = `translate3d(0, ${scrolled * speed}px, 0) rotate(${scrolled * 0.1}deg)`;
            });
            parallaxRaf = null;
        });
    }, { passive: true });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
    };

    // Add a CSS class when intersecting; let CSS handle actual animation for smoother compositing
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.gallery-item, .hero-description');
    animatedElements.forEach((element) => observer.observe(element));

    showSection('home');
});
