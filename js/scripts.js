// Logo hover effect

function hoverEffect(element) {
    element.style.transform = "scale(1.25)";
    element.style.transition = "transform 0.3s ease";
}

function removeHoverEffect(element) {
    element.style.transform = "scale(1)";
}   

document.addEventListener("DOMContentLoaded", function() {
    const logos = document.querySelectorAll('.logo-item');
    logos.forEach(function(logo) {
        logo.addEventListener('mouseover', function() {
            hoverEffect(logo);
        });
        logo.addEventListener('mouseout', function() {
            removeHoverEffect(logo);
        });
    });
});



// Slant items click effect

function handleClick(event) {
    event.style.transform = 'scale(0.9)';
    event.style.transition = 'transform 1s ease';
}
function resetClick(event) {
    event.style.transform = 'scale(1)';
}

const slantItems = document.getElementsByClassName('slant-item');
for (let i = 0; i < slantItems.length; i++) {
    slantItems[i].onclick = function() {
        handleClick(this);
    }
    slantItems[i].ontransitionend = function() {
        resetClick(this);
    }
}

// Responsive nav toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const header = document.querySelector('header');
    const siteNav = document.getElementById('site-nav') || document.getElementById('site-nav');

    if (!navToggle || !header) return;

    navToggle.addEventListener('click', function(e) {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', String(!expanded));
        header.classList.toggle('nav-open');
        this.setAttribute('aria-label', expanded ? 'Open menu' : 'Close menu');
    });

    // Close menu when a nav link is clicked (mobile)
    const links = header.querySelectorAll('nav a');
    links.forEach(link => link.addEventListener('click', () => {
        header.classList.remove('nav-open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    }));

    // Close when clicking outside the nav
    document.addEventListener('click', function(e) {
        if (!header.classList.contains('nav-open')) return;
        const withinHeader = e.composedPath().includes(header);
        if (!withinHeader) {
            header.classList.remove('nav-open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

// Portrait tilt / parallax interaction
(function() {
    const wrap = document.getElementById('portraitWrap');
    if (!wrap) return;
    let frame;
    const state = { rx: 0, ry: 0, scale: 1 };

    function applyTransform() {
        wrap.style.transform = `perspective(800px) rotateX(${state.rx}deg) rotateY(${state.ry}deg) scale(${state.scale})`;
    }

    function onMove(e) {
        const rect = wrap.getBoundingClientRect();
        const x = (e.clientX ?? (e.touches && e.touches[0].clientX)) - rect.left;
        const y = (e.clientY ?? (e.touches && e.touches[0].clientY)) - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const dx = (x - cx) / cx; // -1 .. 1
        const dy = (y - cy) / cy;

        // limit rotation
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
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => { applyTransform(); frame = null; });
    }

    wrap.addEventListener('mousemove', onMove);
    wrap.addEventListener('touchmove', onMove, { passive: true });
    wrap.addEventListener('mouseleave', onLeave);
    wrap.addEventListener('touchend', onLeave);
    wrap.addEventListener('touchcancel', onLeave);
})();