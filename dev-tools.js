async function loadTranslation() {
    try {
        const lang = 'en';
        const res = await fetch(`/i18n/${lang}.json`);
        var data = await res.json();
        

        const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        const regex = /{{(.*?)}}/g;
        let node;
        document.querySelectorAll("*").forEach(el => {
        if (el.children.length === 0) { // solo nodos simples
            let html = el.innerHTML;

            if (html.includes("{{")) {
            html = html.replace(regex, (_, key) => data[key.trim()] || "");
            el.innerHTML = html;
            }
        }
        });
        
        const elementsWithAttributes = document.querySelectorAll('[placeholder], [alt], [title]');
        elementsWithAttributes.forEach(el => {
            ['placeholder', 'alt', 'title'].forEach(attr => {
                if (el.hasAttribute(attr)) {
                    let val = el.getAttribute(attr);
                    if (val.includes('{{')) {
                        Object.keys(data).forEach(key => {
                            const regex = new RegExp(`{{${key}}}`, 'g');
                            val = val.replace(regex, data[key]);
                        });
                        el.setAttribute(attr, val);
                    }
                }
            });
        });
    } catch (e) {
        console.error('Translation error:', e);
    }
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

loadTranslation();