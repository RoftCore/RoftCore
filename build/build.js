const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const i18nDir = path.join(rootDir, 'i18n');
const assetsDir = path.join(rootDir, 'assets');
const templatePath = path.join(__dirname, 'template.html');

function copyFolderRecursiveSync(source, target) {
    if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });
    const files = fs.readdirSync(source);
    files.forEach(file => {
        const curSource = path.join(source, file);
        const curTarget = path.join(target, file);
        if (fs.lstatSync(curSource).isDirectory()) {
            copyFolderRecursiveSync(curSource, curTarget);
        } else {
            fs.copyFileSync(curSource, curTarget);
        }
    });
}

console.log('🚀 Iniciando build SEO-Friendly...');

if (fs.existsSync(distDir)) fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir);

if (fs.existsSync(assetsDir)) copyFolderRecursiveSync(assetsDir, path.join(distDir, 'assets'));

const cnamePath = path.join(rootDir, 'CNAME');
if (fs.existsSync(cnamePath)) fs.copyFileSync(cnamePath, path.join(distDir, 'CNAME'));

const template = fs.readFileSync(templatePath, 'utf8');
const languages = ['en', 'es'];

languages.forEach(lang => {
    const jsonPath = path.join(i18nDir, `${lang}.json`);
    const langOutputDir = path.join(distDir, lang);
    const translations = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    let output = template;
    
    // 1. Manejo de URLs Canónicas ANTES de inyectar el idioma en el resto
    const baseUrl = "https://roftcore.work";
    const canonical = lang === 'en' ? `${baseUrl}/` : `${baseUrl}/${lang}/`;
    
    // Reemplazamos la URL base con la específica del idioma en el template
    // Buscamos específicamente las etiquetas que tienen {{lang}} en la URL
    output = output.replace(/https:\/\/roftcore.work\/{{lang}}\//g, canonical);

    // 2. Reemplazos de idioma y estado activo
    output = output.replace(/{{lang}}/g, lang);
    output = output.replace(/{{lang-en-active}}/g, lang === 'en' ? 'active' : '');
    output = output.replace(/{{lang-es-active}}/g, lang === 'es' ? 'active' : '');

    // 3. Reemplazar llaves de traducción
    Object.keys(translations).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        output = output.replace(regex, translations[key]);
    });

    // Guardar versión en subdirectorio /en/ o /es/
    if (!fs.existsSync(langOutputDir)) fs.mkdirSync(langOutputDir, { recursive: true });
    fs.writeFileSync(path.join(langOutputDir, 'index.html'), output);
    console.log(` ✅ Generado: /${lang}/index.html`);

    // Si es inglés, también es la Home Principal en la raíz
    if (lang === 'en') {
        fs.writeFileSync(path.join(distDir, 'index.html'), output);
        console.log(` 🏠 Generado Home Principal: /index.html (English)`);
    }
});

console.log('\n✨ Build completa. Estructura SEO perfecta lista en /dist/');
