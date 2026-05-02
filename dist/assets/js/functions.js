import { elements } from './elements.js';

const { redDot, yellowDot, greenDot, visualBody, nebworkTitle } = elements

greenDot.addEventListener('click', () => {
    visualBody.style.visibility = 'visible';
    visualBody.innerHTML = `<pre><code><span class="code-keyword">const</span> <span class="code-variable">RoftCore</span> = {
  <span class="code-property">focus</span>: <span class="code-string">"Innovation"</span>,
  <span class="code-property">state</span>: <span class="code-string">"Building"</span>,
  <span class="code-property">projects</span>: [<span class="code-string">"NebWork"</span>, <span class="code-string">"NextGen"</span>]
};</code></pre>`;
});

yellowDot.addEventListener('click', () => {
    visualBody.style.visibility = 'visible';
    visualBody.innerHTML = `<pre><code><span class="code-keyword">function</span> <span class="code-variable">launchProject</span>(<span class="code-variable">name</span>) {
        <span class="code-keyword">console</span>.log(<span class="code-string">\`Launching Nebwork...\`</span>);
    };</code></pre>`;
});

redDot.addEventListener('click', () => {
    visualBody.style.visibility = 'hidden';
    visualBody.innerHTML = '';
});

nebworkTitle.addEventListener('click', () => {
    window.open('https://nebwork.roftcore.work', '_blank');
});