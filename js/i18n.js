class I18n {
    constructor() {
        this.translations = {};
        this.supportedLanguages = ['ko','en','zh','hi','ru','ja','es','pt','id','tr','de','fr'];
        this.currentLang = this.detectLanguage();
    }
    detectLanguage() {
        const saved = localStorage.getItem('preferredLanguage');
        if (saved && this.supportedLanguages.includes(saved)) return saved;
        const browserLang = navigator.language.split('-')[0];
        return this.supportedLanguages.includes(browserLang) ? browserLang : 'ko';
    }
    async loadTranslations(lang) {
        try {
            const response = await fetch(`js/locales/${lang}.json`);
            if (!response.ok) throw new Error('Failed to load');
            this.translations = await response.json();
            this.currentLang = lang;
        } catch (e) {
            if (lang !== 'ko') {
                return this.loadTranslations('ko');
            }
        }
    }
    t(key, defaultValue = '') {
        const keys = key.split('.');
        let value = this.translations;
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return defaultValue || key;
            }
        }
        return value || defaultValue || key;
    }
    async setLanguage(lang) {
        await this.loadTranslations(lang);
        localStorage.setItem('preferredLanguage', lang);
        this.updateUI();
        document.documentElement.lang = lang;
    }
    updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = this.t(key);
            if (text && text !== key) {
                if (el.tagName === 'INPUT' && el.type !== 'submit') {
                    el.placeholder = text;
                } else {
                    el.textContent = text;
                }
            }
        });
    }
    getCurrentLanguage() { return this.currentLang; }
    getLanguageName(lang) {
        const names = {
            'ko': '\u{1F1F0}\u{1F1F7} \uD55C\uAD6D\uC5B4', 'en': '\u{1F1FA}\u{1F1F8} English', 'zh': '\u{1F1E8}\u{1F1F3} \u4E2D\u6587',
            'hi': '\u{1F1EE}\u{1F1F3} \u0939\u093F\u0928\u094D\u0926\u0940', 'ru': '\u{1F1F7}\u{1F1FA} \u0420\u0443\u0441\u0441\u043A\u0438\u0439', 'ja': '\u{1F1EF}\u{1F1F5} \u65E5\u672C\u8A9E',
            'es': '\u{1F1EA}\u{1F1F8} Espa\u00F1ol', 'pt': '\u{1F1E7}\u{1F1F7} Portugu\u00EAs', 'id': '\u{1F1EE}\u{1F1E9} Indonesia',
            'tr': '\u{1F1F9}\u{1F1F7} T\u00FCrk\u00E7e', 'de': '\u{1F1E9}\u{1F1EA} Deutsch', 'fr': '\u{1F1EB}\u{1F1F7} Fran\u00E7ais'
        };
        return names[lang] || lang;
    }
}
window.i18n = new I18n();
