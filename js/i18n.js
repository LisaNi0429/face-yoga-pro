/**
 * Face Yoga Pro - Internationalization (i18n) System
 * Supports 11 languages with automatic detection and persistent storage
 */

class I18n {
    constructor() {
        this.currentLang = 'zh';
        this.translations = {};
        this.supportedLangs = {
            'zh': { name: '中文', dir: 'ltr' },
            'en': { name: 'English', dir: 'ltr' },
            'ja': { name: '日本語', dir: 'ltr' },
            'ko': { name: '한국어', dir: 'ltr' },
            'es': { name: 'Español', dir: 'ltr' },
            'fr': { name: 'Français', dir: 'ltr' },
            'de': { name: 'Deutsch', dir: 'ltr' },
            'pt': { name: 'Português', dir: 'ltr' },
            'ru': { name: 'Русский', dir: 'ltr' },
            'ar': { name: 'العربية', dir: 'rtl' },
            'hi': { name: 'हिन्दी', dir: 'ltr' }
        };
    }

    /**
     * Initialize the i18n system
     */
    async init() {
        // Detect language from URL, localStorage, or browser
        const urlLang = this.getLangFromURL();
        const storedLang = localStorage.getItem('faceyoga_lang');
        const browserLang = this.getBrowserLang();
        
        this.currentLang = urlLang || storedLang || browserLang || 'zh';
        
        // Load translations
        await this.loadTranslations(this.currentLang);
        
        // Apply translations
        this.applyTranslations();
        
        // Update language selector
        this.updateLangSelector();
        
        // Update HTML attributes
        this.updateHTMLAttributes();
        
        return this;
    }

    /**
     * Get language from URL parameters
     */
    getLangFromURL() {
        const params = new URLSearchParams(window.location.search);
        const lang = params.get('lang');
        return this.supportedLangs[lang] ? lang : null;
    }

    /**
     * Get browser language
     */
    getBrowserLang() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];
        return this.supportedLangs[langCode] ? langCode : null;
    }

    /**
     * Load translations for a specific language
     */
    async loadTranslations(lang) {
        try {
            const response = await fetch(`lang/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${lang} translations`);
            }
            this.translations = await response.json();
        } catch (error) {
            console.error('Error loading translations:', error);
            // Fallback to Chinese if loading fails
            if (lang !== 'zh') {
                await this.loadTranslations('zh');
            }
        }
    }

    /**
     * Get translation by key path (e.g., 'nav.home')
     */
    t(keyPath, fallback = '') {
        const keys = keyPath.split('.');
        let value = this.translations;
        
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return fallback || keyPath;
            }
        }
        
        return typeof value === 'string' ? value : fallback || keyPath;
    }

    /**
     * Apply translations to all elements with data-i18n attribute
     */
    applyTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (translation) {
                // Check if it's an input or textarea
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Update page title if exists
        const titleKey = document.querySelector('title')?.getAttribute('data-i18n');
        if (titleKey) {
            document.title = this.t(titleKey) + ' - Face Yoga Pro';
        }

        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', this.t('meta.description', metaDesc.getAttribute('content')));
        }
    }

    /**
     * Update language selector UI
     */
    updateLangSelector() {
        const currentLangEl = document.querySelector('.current-lang');
        if (currentLangEl) {
            currentLangEl.textContent = this.supportedLangs[this.currentLang].name;
        }

        // Update aria-selected
        const langOptions = document.querySelectorAll('.lang-dropdown li');
        langOptions.forEach(option => {
            const lang = option.getAttribute('data-lang');
            option.setAttribute('aria-selected', lang === this.currentLang);
        });
    }

    /**
     * Update HTML attributes for language and direction
     */
    updateHTMLAttributes() {
        const langInfo = this.supportedLangs[this.currentLang];
        document.documentElement.lang = this.currentLang;
        document.documentElement.dir = langInfo.dir;
    }

    /**
     * Change language
     */
    async setLanguage(lang) {
        if (!this.supportedLangs[lang] || lang === this.currentLang) {
            return;
        }

        this.currentLang = lang;
        
        // Save to localStorage
        localStorage.setItem('faceyoga_lang', lang);
        
        // Update URL without reload
        const url = new URL(window.location);
        url.searchParams.set('lang', lang);
        window.history.replaceState({}, '', url);
        
        // Load and apply new translations
        await this.loadTranslations(lang);
        this.applyTranslations();
        this.updateLangSelector();
        this.updateHTMLAttributes();

        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }

    /**
     * Get current language
     */
    getLang() {
        return this.currentLang;
    }

    /**
     * Get all supported languages
     */
    getSupportedLangs() {
        return this.supportedLangs;
    }
}

// Create global instance
window.i18n = new I18n();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
}
