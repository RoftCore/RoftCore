import { elements } from './elements.js';

const { redDot, yellowDot, greenDot, visualBody, nebworkTitle } = elements

function bindPress(element, handler) {
    if (!element) return;

    element.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) return;
        handler(event);
    });

    element.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handler(event);
        }
    });
}

bindPress(greenDot, () => {
    visualBody.style.visibility = 'visible';
    visualBody.innerHTML = `<pre><code><span class="code-keyword">const</span> <span class="code-variable">RoftCore</span> = {
  <span class="code-property">focus</span>: <span class="code-string">"Innovation"</span>,
  <span class="code-property">state</span>: <span class="code-string">"Building"</span>,
  <span class="code-property">projects</span>: [<span class="code-string">"NebWork"</span>, <span class="code-string">"NextGen"</span>]
};</code></pre>`;
});

bindPress(yellowDot, () => {
    console.log('Yellow dot clicked');
    visualBody.style.visibility = 'visible';
    visualBody.innerHTML = `<pre><code><span class="code-keyword">function</span> <span class="code-variable">launchProject</span>(<span class="code-variable">name</span>) {
        <span class="code-keyword">console</span>.log(<span class="code-string">\`Launching Nebwork...\`</span>);
    };</code></pre>`;
});

bindPress(redDot, () => {
    visualBody.style.visibility = 'hidden';
    visualBody.innerHTML = '';
});

nebworkTitle?.addEventListener('click', () => {
    window.open('https://nebwork.roftcore.work', '_blank');
});
