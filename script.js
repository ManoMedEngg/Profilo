// script.js

document.addEventListener('DOMContentLoaded', () => {
    const html = document.documentElement;
    const bg = document.getElementById('background-container');
    const themeSwitcher = document.querySelector('.theme-switcher');

    if (!bg) return;

    const IMAGES = { dark: './darktheme.png', light: './lighttheme.png' };
    // preload images
    Object.values(IMAGES).forEach(src => { const i = new Image(); i.src = src; });

    // create toggle if not present inside .theme-switcher
    let checkbox = document.getElementById('theme-toggle-checkbox');
    if (!checkbox && themeSwitcher) {
        checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'theme-toggle-checkbox';
        checkbox.className = 'hidden';

        const slider = document.createElement('label');
        slider.className = 'slider';
        slider.setAttribute('for', checkbox.id);

        const wrapper = document.createElement('span');
        wrapper.className = 'switch';
        wrapper.appendChild(checkbox);
        wrapper.appendChild(slider);

        themeSwitcher.appendChild(wrapper);
    }

    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        bg.style.backgroundImage = `url("${IMAGES[theme]}")`;
        if (checkbox) checkbox.checked = theme === 'dark';
        try { localStorage.setItem('theme', theme); } catch (e) {}
    }

    // initial theme: saved > html[data-theme] > light
    const saved = (() => { try { return localStorage.getItem('theme'); } catch { return null; } })();
    const initial = saved || html.getAttribute('data-theme') || 'light';
    applyTheme(initial);

    if (checkbox) {
        checkbox.addEventListener('change', () => {
            applyTheme(checkbox.checked ? 'dark' : 'light');
        });
    }


    // --- Smooth Scrolling & Active Nav Link ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.4 // 40% of the section must be visible
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Scroll to Top Button ---
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Scroll-triggered Animations ---
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        animationObserver.observe(el);
    });

});