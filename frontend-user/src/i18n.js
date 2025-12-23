import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from '../public/locales/en.json';
import bnTranslations from '../public/locales/bn.json';

const savedLanguage = localStorage.getItem('language') || 'en';

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: enTranslations },
        bn: { translation: bnTranslations },
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});

// Persist language choice
i18n.on('languageChanged', (lng) => {
    localStorage.setItem('language', lng);
    document.documentElement.lang = lng;
});

export default i18n;
