const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const i18nDir = path.join(rootDir, 'i18n');
const assetsDir = path.join(rootDir, 'assets');
const templatePath = path.join(__dirname, 'template.html');
const rootIndexBtn = path.join(rootDir, 'index.html');

// Helper para copiado recursivo (compatible con versiones antiguas de Node)
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

// 1. Limpiar y preparar carpeta dist
console.log('🚀 Iniciando build de producción...');
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir);

// 2. Copiar assets a dist
console.log('📦 Copiando assets...');
if (fs.existsSync(assetsDir)) {
    copyFolderRecursiveSync(assetsDir, path.join(distDir, 'assets'));
}

// 3. Copiar index.html raíz (selector)
console.log('🎛️ Preparando selector de idioma...');
if (fs.existsSync(rootIndexBtn)) {
    fs.copyFileSync(rootIndexBtn, path.join(distDir, 'index.html'));
}

// 4. Copiar CNAME si existe
const cnamePath = path.join(rootDir, 'CNAME');
if (fs.existsSync(cnamePath)) {
    fs.copyFileSync(cnamePath, path.join(distDir, 'CNAME'));
}

// 5. Generar versiones localizadas
console.log('🌍 Generando versiones por idioma...');
const template = fs.readFileSync(templatePath, 'utf8');
const languages = ['en', 'es'];

languages.forEach(lang => {
    const jsonPath = path.join(i18nDir, `${lang}.json`);
    const langOutputDir = path.join(distDir, lang);
    const outputPath = path.join(langOutputDir, 'index.html');

    if (!fs.existsSync(langOutputDir)) {
        fs.mkdirSync(langOutputDir, { recursive: true });
    }

    if (fs.existsSync(jsonPath)) {
        const translations = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        let output = template;

        // Reemplazar lang
        output = output.replace(/{{lang}}/g, lang);

        // Reemplazar llaves de traducción
        Object.keys(translations).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            output = output.replace(regex, translations[key]);
        });

        fs.writeFileSync(outputPath, output);
        console.log(` ✅ Generado: /${lang}/index.html`);
    } else {
        console.warn(` ⚠️ No se encontró traducción para: ${lang}`);
    }
});

console.log('\n✨ Build completada con éxito en la carpeta /dist/');
