let chars = '';
let rainbowMode = false;

let clicks = [];
const CLICK_WINDOW = 600;
const CLICK_RADIUS = 60;

function showMatrixMessage(text) {
    const el = document.createElement('div');
    el.textContent = text;
    Object.assign(el.style, {
        position: 'fixed',
        bottom: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '1rem',
        color: '#00e639',
        textShadow: '0 0 10px #00e639, 0 0 20px #00e639',
        zIndex: '9999',
        pointerEvents: 'none',
        opacity: '0',
        transition: 'opacity 0.5s ease',
        whiteSpace: 'nowrap'
    });
    document.body.appendChild(el);
    requestAnimationFrame(() => { el.style.opacity = '1'; });
    setTimeout(() => {
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 500);
    }, 3000);
}

window.addEventListener('keydown', event => {
    chars += event.key.toLowerCase();
    if (chars.length > 10) chars = chars.slice(-10);

    if (chars.endsWith('neo')) {
        chars = '';
        rainbowMode = !rainbowMode;
        document.querySelectorAll('h1, p, span, a').forEach(el => {
            el.style.filter = rainbowMode ? 'hue-rotate(360deg)' : '';
        });
        showMatrixMessage('Follow the white rabbit.');
        return;
    }
});

window.addEventListener('click', event => {
    const now = Date.now();
    clicks.push({ x: event.clientX, y: event.clientY, t: now });
    clicks = clicks.filter(c => now - c.t < CLICK_WINDOW);

    if (clicks.length >= 3) {
        const xs = clicks.map(c => c.x);
        const ys = clicks.map(c => c.y);
        const spread = Math.max(...xs) - Math.min(...xs);
        const spreadY = Math.max(...ys) - Math.min(...ys);

        if (spread < CLICK_RADIUS && spreadY < CLICK_RADIUS) {
            clicks = [];
            spawnRabbitParticles(event.clientX, event.clientY);
        }
    }
});

function spawnRabbitParticles(x, y) {
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.textContent = '🐇';
        const angle = (Math.PI * 2 / 12) * i;
        const distance = 40 + Math.random() * 60;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance - 80 - Math.random() * 60;

        Object.assign(particle.style, {
            position: 'fixed',
            left: x + 'px',
            top: y + 'px',
            fontSize: '1rem',
            zIndex: '9999',
            pointerEvents: 'none',
            transition: 'all 1s ease-out',
            opacity: '1'
        });
        document.body.appendChild(particle);
        requestAnimationFrame(() => {
            particle.style.transform = `translate(${tx}px, ${ty}px)`;
            particle.style.opacity = '0';
        });
        setTimeout(() => particle.remove(), 1200);
    }
}
