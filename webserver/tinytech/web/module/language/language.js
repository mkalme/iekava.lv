import { FloatingWindow } from '../style.js';

class Language {
     constructor(data) {
        this.id = data["pack.id"];
        this.name = data["pack.name"];
        this.translations = {};
        
        // Store all translations except the pack metadata
        Object.keys(data).forEach(key => {
            if (!key.startsWith("pack.")) {
                this.translations[key] = data[key];
            }
        });
    }

    get(key) {
        return this.translations[key] || key;
    }

    has(key) {
        return key in this.translations;
    }
}

class LanguagePack {
    constructor(files){
        this.files = files;
        this.languages = new Map();
        this.customTranslations = new Map();
        this.loaded = false;
        this.currentLanguageId = "";
    }

    async load() {
        try {
            const promises = this.files.map(async (file) => {
                const response = await fetch(file);
                const data = await response.json();
                return new Language(data);
            });

            const languageInstances = await Promise.all(promises);
            
            languageInstances.forEach(language => {
                this.languages.set(language.id, language);
            });

            this.loaded = true;
            return this.languages;
        } catch (error) {
            console.error('Error loading language packs:', error);
            throw error;
        }
    }

    getLanguage(id) {
        if (!this.loaded) {
            console.warn('Language packs not loaded yet. Call load() first.');
            return null;
        }
        return this.languages.get(id);
    }

    getAllLanguages() {
        return this.languages;
    }

    setUiLanguage(id){
        if (!this.loaded) {
            console.warn('Language packs not loaded yet.');
            return;
        }

        if (!this.languages.has(id)) {
            console.error(`Language '${id}' not found.`);
            return;
        }

        this.currentLanguageId = id;
        const language = this.languages.get(id);

        document.title = language.get("home.title")

        const allElements = document.querySelectorAll('[language-code]');
        allElements.forEach(element => {
            const elementId = element.getAttribute('language-code');
            
            if (language.has(elementId)) {
                const translation = language.get(elementId);
                
                if (this.customTranslations.has(elementId)){
                    const lambda = this.customTranslations.get(elementId);
                    lambda(element, translation);
                    return;
                }

                if (element.tagName === 'INPUT' && (element.type === 'button' || element.type === 'submit')) {
                    element.value = translation;
                } else if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
    }

    addCustomTranslation(id, lambda){
        this.customTranslations.set(id, lambda);
    }
}

const response = await fetch('./module/language/index.json');
const fileArray = await response.json();
const languagePack = new LanguagePack(fileArray);
const ready = languagePack.load();

var languageWindow = new FloatingWindow(
    document,
    document.getElementById('language-button'),
    document.getElementById('language-window')
);

ready.then(() => {
    var languageWindowDiv = document.getElementById("language-window");
    languageWindowDiv.innerHTML = '';

    const languages = languagePack.getAllLanguages();
    languages.forEach(language => {
        const button = document.createElement('button');
        button.className = 'language-button';
        button.value = language.id;
        button.textContent = language.name;
        button.onclick = function () {
            languagePack.setUiLanguage(language.id)
            languageWindow.closeFloatingWindow();
        };

        languageWindowDiv.appendChild(button);
    });

    languagePack.setUiLanguage("en");
});

export { Language, LanguagePack, languagePack, ready };