// Gestionnaire de traductions i18n
let translations = {};
let currentLang = localStorage.getItem('preferredLanguage') || 'fr';

// Initialiser le système de traductions
async function initI18n(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        translations = await response.json();
        
        applyTranslations();
        console.log('✅ Traductions chargées avec succès');
    } catch (error) {
        console.error('❌ Erreur lors du chargement des traductions:', error);
    }
}

// Appliquer les traductions au DOM
function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const text = t(key);
        if (text) {
            element.textContent = text;
        }
    });

    // Traiter les placeholders
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const placeholder = t(key);
        if (placeholder) {
            element.placeholder = placeholder;
        }
    });

    // Mettre à jour le drapeau et l'affichage de la langue
    updateLanguageDisplay();

    // Déclencher un événement personnalisé
    document.dispatchEvent(new Event('languageChanged'));
}

// Obtenir une traduction
function t(key) {
    const keys = key.split('.');
    let value = translations[currentLang];
    
    for (const k of keys) {
        if (value && typeof value === 'object') {
            value = value[k];
        } else {
            return key; // Retourner la clé si non trouvée
        }
    }
    
    return value || key;
}

// Changer la langue
function setLanguage(lang) {
    if (translations[lang]) {
        currentLang = lang;
        localStorage.setItem('preferredLanguage', lang);
        applyTranslations();
    }
}

// Basculer entre les langues
function toggleLanguage() {
    const newLang = currentLang === 'fr' ? 'en' : 'fr';
    setLanguage(newLang);
}

// Mettre à jour l'affichage de la langue
function updateLanguageDisplay() {
    const langDisplay = document.getElementById('lang-display');
    const flagElement = document.getElementById('flag');
    
    if (langDisplay) {
        langDisplay.textContent = currentLang.toUpperCase();
    }
    if (flagElement) {
        flagElement.textContent = currentLang === 'fr' ? '🇫🇷' : '🇬🇧';
    }
}

// Obtenir la langue actuelle
function getCurrentLanguage() {
    return currentLang;
}
