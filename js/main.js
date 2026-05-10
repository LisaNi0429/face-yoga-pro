/**
 * Face Yoga Pro - Main JavaScript
 * Handles navigation, animations, and interactive features
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize i18n
    await window.i18n.init();
    
    // Initialize all components
    initNavigation();
    initLanguageSelector();
    initScrollEffects();
    initAnimations();
    initAccessibility();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');

    // Mobile menu toggle
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar') && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu when pressing Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.focus();
            }
        });
    }

    // Navbar scroll effect
    if (navbar) {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }

    // Active link highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Language selector functionality
 */
function initLanguageSelector() {
    const langBtn = document.querySelector('.lang-btn');
    const langDropdown = document.querySelector('.lang-dropdown');
    const langOptions = document.querySelectorAll('.lang-dropdown li');

    if (!langBtn || !langDropdown) return;

    // Toggle dropdown
    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = langDropdown.classList.toggle('open');
        langBtn.setAttribute('aria-expanded', isOpen);
        
        if (isOpen) {
            // Focus first option
            const firstOption = langDropdown.querySelector('li');
            if (firstOption) firstOption.focus();
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        langDropdown.classList.remove('open');
        langBtn.setAttribute('aria-expanded', 'false');
    });

    // Language selection
    langOptions.forEach(option => {
        option.addEventListener('click', async () => {
            const lang = option.getAttribute('data-lang');
            await window.i18n.setLanguage(lang);
            
            langDropdown.classList.remove('open');
            langBtn.setAttribute('aria-expanded', 'false');
        });

        // Keyboard navigation
        option.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const lang = option.getAttribute('data-lang');
                await window.i18n.setLanguage(lang);
                
                langDropdown.classList.remove('open');
                langBtn.setAttribute('aria-expanded', 'false');
                langBtn.focus();
            }
        });
    });
}

/**
 * Scroll effects and animations
 */
function initScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with fade-in class
    document.querySelectorAll('.feature-card, .exercise-card, .step').forEach(el => {
        el.classList.add('fade-in');
        fadeObserver.observe(el);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Initialize SVG animations
 */
function initAnimations() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Add animation classes when elements come into view
    const animatedElements = document.querySelectorAll('.exercise-svg');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.5 });

    animatedElements.forEach(el => animationObserver.observe(el));
}

/**
 * Accessibility enhancements
 */
function initAccessibility() {
    // Add skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const mainContent = document.querySelector('main, #main-content, .hero');
            if (mainContent) {
                mainContent.setAttribute('tabindex', '-1');
                mainContent.focus();
            }
        });
    }

    // Handle focus for dynamically shown content
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target.matches('.exercise-link, .cta-btn, .view-all-btn')) {
            // Add focus indicator for keyboard users
            target.classList.add('focus-visible');
        }
    });

    // Announce language changes to screen readers
    window.addEventListener('languageChanged', (e) => {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = `Language changed to ${window.i18n.getSupportedLangs()[e.detail.lang].name}`;
        document.body.appendChild(announcement);
        
        setTimeout(() => announcement.remove(), 1000);
    });
}

/**
 * Exercise animation controls (for exercise pages)
 */
function initExerciseControls() {
    const playBtns = document.querySelectorAll('.animation-play-btn');
    
    playBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const animationContainer = btn.closest('.exercise-animation-container');
            const svg = animationContainer?.querySelector('.exercise-svg');
            
            if (svg) {
                const isPaused = svg.classList.toggle('paused');
                btn.setAttribute('aria-pressed', isPaused);
                btn.textContent = isPaused ? window.i18n.t('animation.play') : window.i18n.t('animation.pause');
            }
        });
    });
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility: Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add CSS for fade-in animation
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .fade-in-visible {
        opacity: 1;
        transform: translateY(0);
    }
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
`;
document.head.appendChild(style);

// Export functions for use in other scripts
window.FaceYogaPro = {
    initExerciseControls,
    debounce,
    throttle
};
