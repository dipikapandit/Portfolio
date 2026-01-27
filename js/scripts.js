
// Responsive nav toggle
// Consolidated, cleaned JS for site interactions
// - Responsive nav toggle
// - Logo hover animation
// - Slant items click feedback
// - Portrait tilt (self-contained IIFE)
// - Typewriter rotator

// Portrait tilt / parallax interaction (kept as IIFE)
(function() {
    const wrap = document.getElementById('portraitWrap');
    if (!wrap) return;
    let frame;
    const state = { rx: 0, ry: 0, scale: 1 };
    let cachedRect;
    let lastCacheTime = 0;
    const CACHE_DURATION = 100; // Cache rect for 100ms to reduce layout thrashing

    function applyTransform() {
        wrap.style.transform = `perspective(800px) rotateX(${state.rx}deg) rotateY(${state.ry}deg) scale(${state.scale})`;
    }

    function getCachedRect() {
        const now = Date.now();
        if (!cachedRect || (now - lastCacheTime) > CACHE_DURATION) {
            cachedRect = wrap.getBoundingClientRect();
            lastCacheTime = now;
        }
        return cachedRect;
    }

    function onMove(e) {
        const rect = getCachedRect();
        const x = (e.clientX ?? (e.touches && e.touches[0].clientX)) - rect.left;
        const y = (e.clientY ?? (e.touches && e.touches[0].clientY)) - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const dx = (x - cx) / cx; // -1 .. 1
        const dy = (y - cy) / cy;

        const maxTilt = 8; // degrees
        state.ry = Math.max(Math.min(dx * maxTilt, maxTilt), -maxTilt);
        state.rx = Math.max(Math.min(-dy * maxTilt, maxTilt), -maxTilt);
        state.scale = 1.03;

        if (!frame) frame = requestAnimationFrame(() => {
            applyTransform();
            frame = null;
        });
    }

    function onLeave() {
        state.rx = 0; state.ry = 0; state.scale = 1;
        cachedRect = null; // Clear cache
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => { applyTransform(); frame = null; });
    }

    wrap.addEventListener('mousemove', onMove);
    wrap.addEventListener('touchmove', onMove, { passive: true });
    wrap.addEventListener('mouseleave', onLeave);
    wrap.addEventListener('touchend', onLeave);
    wrap.addEventListener('touchcancel', onLeave);
})();

// Main DOM-ready setup
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const navToggle = document.querySelector('.nav-toggle');

    // Responsive nav toggle
    if (navToggle && header) {
        navToggle.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', String(!expanded));
            header.classList.toggle('nav-open');
            this.setAttribute('aria-label', expanded ? 'Open menu' : 'Close menu');
        });

        // Close menu when a nav link is clicked (mobile)
        const links = header.querySelectorAll('nav a');
        links.forEach(link => link.addEventListener('click', () => {
            header.classList.remove('nav-open');
            navToggle.setAttribute('aria-expanded', 'false');
        }));

        // Close when clicking outside the nav
        document.addEventListener('click', function(e) {
            if (!header.classList.contains('nav-open')) return;
            if (!e.composedPath().includes(header)) {
                header.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Logo hover effects - moved to CSS for better performance
    // CSS handles: .logo-item:hover { transform: scale(1.25); }

    // Slant items click feedback using event delegation for better performance
    const slantParent = document.querySelector('.slanted-gallery');
    if (slantParent) {
        slantParent.addEventListener('click', function(e) {
            const slantItem = e.target.closest('.slant-item');
            if (slantItem) {
                slantItem.style.transform = 'scale(0.9)';
                slantItem.style.transition = 'transform 0.35s ease';
                setTimeout(() => {
                    slantItem.style.transform = 'scale(1)';
                }, 350);
            }
        });
    }

    // Typewriter rotator
    const phrases = ['<Clean Visuals>', '<Strong Hierarchy>', '<Thoughtful Storytelling>'];
    const el = document.querySelector('.rotating-phrase');
    if (el) {
        const typingSpeed = 70;
        const deletingSpeed = 35;
        const pauseAfterTyped = 1100;
        const pauseBetween = 300;

        function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

        async function typeText(text) {
            for (let i = 1; i <= text.length; i++) {
                el.textContent = text.slice(0, i);
                await sleep(typingSpeed);
            }
        }

        async function deleteText() {
            let current = el.textContent;
            while (current.length > 0) {
                current = current.slice(0, -1);
                el.textContent = current;
                await sleep(deletingSpeed);
            }
        }

        (async function loop() {
            let idx = 0;
            el.textContent = '';
            while (true) {
                const phrase = phrases[idx];
                await typeText(phrase);
                await sleep(pauseAfterTyped);
                await deleteText();
                await sleep(pauseBetween);
                idx = (idx + 1) % phrases.length;
            }
        })();
    }
});