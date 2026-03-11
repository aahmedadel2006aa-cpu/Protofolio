/**
 * AWARD-WINNING PORTFOLIO - ULTRA-PREMIUM JAVASCRIPT
 * Custom Cursor | Lenis Smooth Scroll | GSAP | Vanilla-tilt | Typewriter | Magnetic | Theme
 */

// =====================================================
// 1. LENIS SMOOTH SCROLL - Buttery smooth scrolling
// =====================================================
let lenis;

async function initLenis() {
    try {
        const { default: Lenis } = await import('lenis');
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
        });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
    } catch (e) {
        lenis = null;
    }
}

// =====================================================
// 2. CUSTOM MAGNETIC CURSOR - Expands & snaps to links
// =====================================================
function initCursor() {
    if (window.matchMedia('(max-width: 1024px)').matches) {
        document.body.classList.add('no-cursor');
        return;
    }

    const cursor = document.getElementById('cursor');
    const cursorDot = document.getElementById('cursorDot');
    const magneticTargets = document.querySelectorAll('.magnetic-trigger, a, button');

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        // Dot follows cursor with fast lerp
        dotX += (mouseX - dotX) * 0.35;
        dotY += (mouseY - dotY) * 0.35;
        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;

        // Main cursor with magnetic smooth follow
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    magneticTargets.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// Magnetic pull effect for buttons
function initMagnetic() {
    document.querySelectorAll('.magnetic-trigger').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
            el.style.transform = `translate(${x}px, ${y}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });
}

// =====================================================
// 3. TYPEWRITER EFFECT - Hero bio
// =====================================================
function initTypewriter() {
    const text = "A 2nd year CS student passionate about coding and building practical projects. I love turning ideas into working software.";
    const element = document.getElementById('typewriter');
    let i = 0;

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, 40);
        }
    }
    setTimeout(type, 1500); // Start after name animation
}

// =====================================================
// 4. GSAP SCROLL ANIMATIONS - Staggered reveals
// =====================================================
function initGSAP() {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Hero name stagger reveal
    gsap.to('.hero-name .char', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power3.out',
        delay: 0.3,
    });

    // Section titles split animation
    gsap.utils.toArray('[data-split]').forEach((el) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
            },
            y: 80,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
        });
    });

    // About section entrance
    gsap.from('.about-stats .stat-item', {
        scrollTrigger: {
            trigger: '#about',
            start: 'top 70%',
            toggleActions: 'play none none reverse',
        },
        x: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
    });

    // About stats counter animation (runs once)
    document.querySelectorAll('.stat-num[data-count]').forEach((el) => {
        const target = parseInt(el.dataset.count, 10);
        let animated = false;
        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            onEnter: () => {
                if (animated) return;
                animated = true;
                let current = 0;
                const step = target / 40;
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) { el.textContent = target; clearInterval(timer); }
                    else el.textContent = Math.floor(current);
                }, 40);
            },
        });
    });

    // About story - Karaoke line-by-line highlight
    const lines = document.querySelectorAll('.about-story .line');
    lines.forEach((line, i) => {
        ScrollTrigger.create({
            trigger: line,
            start: 'top 85%',
            end: 'top 50%',
            onEnter: () => line.classList.add('active'),
            onLeaveBack: () => line.classList.remove('active'),
        });
    });

    // Education timeline fill
    ScrollTrigger.create({
        trigger: '.education-timeline',
        start: 'top 60%',
        end: 'bottom 20%',
        onUpdate: (self) => {
            document.getElementById('timelineFill').style.height = `${self.progress * 100}%`;
        },
    });

    // Experience parallax background
    gsap.to('.parallax-bg', {
        scrollTrigger: {
            trigger: '#experience',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
        },
        y: -100,
        ease: 'none',
    });

    // Skills entrance & logic
    gsap.utils.toArray('.skill-card-pro').forEach((card) => {
        ScrollTrigger.create({
            trigger: card,
            start: 'top 85%',
            onEnter: () => card.classList.add('in-view'),
            onLeaveBack: () => card.classList.remove('in-view'),
        });
    });

    gsap.from('.skills-footer .skills-tag', {
        scrollTrigger: {
            trigger: '.skills-footer',
            start: 'top 90%',
            toggleActions: 'play none none reverse',
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
    });
    gsap.from('.skill-card-pro', {
        scrollTrigger: {
            trigger: '#skills',
            start: 'top 70%',
            toggleActions: 'play none none reverse',
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
    });

    // Featured project entrance
    gsap.from('.project-featured', {
        scrollTrigger: {
            trigger: '#projects',
            start: 'top 70%',
            toggleActions: 'play none none reverse',
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
    });
    // Projects cards
    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '#projects',
            start: 'top 70%',
            toggleActions: 'play none none reverse',
        },
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
    });

    // Navbar background on scroll
    ScrollTrigger.create({
        trigger: 'main',
        start: 'top -80',
        onUpdate: (self) => {
            document.getElementById('navbar').classList.toggle('scrolled', self.direction === 1 && self.progress > 0.05);
        },
    });
}

// =====================================================
// 5. VANILLA-TILT - 3D tilt on hero image & project cards
// =====================================================
function initTilt() {
    const tiltElements = document.querySelectorAll('.tilt-wrap');
    if (typeof VanillaTilt !== 'undefined') {
        tiltElements.forEach((el) => {
            VanillaTilt.init(el, {
                max: 8,
                speed: 800,
                glare: el.dataset.tiltGlare === 'true',
                'max-glare': 0.3,
            });
        });
    }
}

// =====================================================
// 6. EXPERIENCE - Hover image follow cursor
// =====================================================
function initExpPreview() {
    const items = document.querySelectorAll('[data-exp-image]');
    const preview = document.getElementById('expPreview');
    if (!preview) return;

    items.forEach((item) => {
        const imgUrl = item.dataset.expImage;
        item.addEventListener('mouseenter', (e) => {
            preview.innerHTML = `<img src="${imgUrl}" alt="">`;
            preview.style.left = `${e.clientX + 20}px`;
            preview.style.top = `${e.clientY + 20}px`;
            preview.classList.add('visible');
        });
        item.addEventListener('mousemove', (e) => {
            preview.style.left = `${e.clientX + 20}px`;
            preview.style.top = `${e.clientY + 20}px`;
        });
        item.addEventListener('mouseleave', () => {
            preview.classList.remove('visible');
        });
    });
}

// =====================================================
// 7. SERVICES ACCORDION - Expand on click
// =====================================================
function initServices() {
    document.querySelectorAll('[data-service]').forEach((item) => {
        const header = item.querySelector('.service-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            document.querySelectorAll('[data-service]').forEach((i) => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });
}

// =====================================================
// 8. CONTACT FORM - Floating labels & submit morph
// =====================================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form?.querySelector('.submit-btn');

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        submitBtn.classList.add('sent');
        submitBtn.disabled = true;
        setTimeout(() => {
            form.reset();
            submitBtn.classList.remove('sent');
            submitBtn.disabled = false;
        }, 2000);
    });
}

// =====================================================
// 9. THEME TOGGLE - Dark/Light mode
// =====================================================
function initTheme() {
    const toggle = document.getElementById('themeToggle');
    const saved = localStorage.getItem('portfolio-theme');

    if (saved) document.documentElement.setAttribute('data-theme', saved);

    toggle?.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('portfolio-theme', next);
    });
}

// =====================================================
// 10. SMOOTH ANCHOR SCROLL
// =====================================================
function initSmoothLinks() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                if (lenis) lenis.scrollTo(target, { offset: -80 });
                else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// =====================================================
// 11. MOBILE MENU TOGGLE
// =====================================================
function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    toggle?.addEventListener('click', () => {
        navLinks?.classList.toggle('active');
        toggle.classList.toggle('active');
    });
    navLinks?.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks?.classList.remove('active');
            toggle?.classList.remove('active');
        });
    });
}

// =====================================================
// INIT - Load order matters for GSAP + Lenis
// =====================================================
document.addEventListener('DOMContentLoaded', async () => {
    initTheme();
    initCursor();
    initMagnetic();
    initTypewriter();
    initTilt();
    initExpPreview();
    initServices();
    initContactForm();
    initMobileMenu();

    await initLenis();
    initGSAP();
    initSmoothLinks();

    document.body.classList.add('loaded');
});
