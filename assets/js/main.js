import { translations } from './translations/translation.js';

await applyTranslations();

function getUserLang() {
    const lang = navigator.language || navigator.userLanguage;
    return lang;
}


async function applyTranslations() {
    const lang = getUserLang();

    const res = await fetch(`/translations/${lang.substring(0, 2)}/landing.json`);
    const dict = await res.json();

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.innerHTML = dict[key];
        }
    });
}