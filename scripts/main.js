// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !e.target.closest('.nav-links') && 
        !e.target.closest('.menu-toggle')) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        body.style.overflow = '';
    }
});

// Close menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        body.style.overflow = '';
    });
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');
const animateElements = document.querySelectorAll('.animate');
const animateStaggerElements = document.querySelectorAll('.animate-stagger');

function checkReveal() {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;

    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('active');
        }
    });
}

// Initialize animations
function initAnimations() {
    animateElements.forEach(element => {
        element.style.opacity = '0';
    });

    animateStaggerElements.forEach(container => {
        Array.from(container.children).forEach(child => {
            child.style.opacity = '0';
        });
    });

    // Trigger initial reveal check
    checkReveal();
}

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Close mobile menu if open
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            
            // Smooth scroll to target
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Page Transition
function handlePageTransition(url) {
    const transition = document.createElement('div');
    transition.className = 'page-transition';
    document.body.appendChild(transition);
    
    // Trigger transition
    requestAnimationFrame(() => {
        transition.classList.add('active');
    });
    
    // Navigate after transition
    setTimeout(() => {
        window.location.href = url;
    }, 600);
}

// Handle handbook navigation
document.querySelectorAll('a[href^="handbook.html"]').forEach(link => {
    link.addEventListener('click', (e) => {
        if (!link.getAttribute('href').includes('#')) {
            e.preventDefault();
            handlePageTransition(link.href);
        }
    });
});

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    
    // Add animation classes to elements
    document.querySelectorAll('section h2').forEach(h2 => h2.classList.add('animate'));
    document.querySelector('.hero-content')?.classList.add('animate');
    document.querySelector('.hero-buttons')?.classList.add('animate');
    document.querySelector('.about-content')?.classList.add('animate');
    document.querySelector('.profile-image')?.classList.add('animate');
    document.querySelector('.handbook-cards .cards-grid')?.classList.add('animate-stagger');
    document.querySelector('.learn-section .info-cards')?.classList.add('animate-stagger');
});

// Add styles for mobile menu button
const style = document.createElement('style');
style.textContent = `
    .mobile-menu-btn {
        display: none;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        z-index: 1000;
    }

    .mobile-menu-btn span {
        display: block;
        width: 24px;
        height: 2px;
        background: var(--text-color);
        margin: 4px 0;
        transition: transform 0.3s ease;
    }

    .mobile-menu-btn.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }

    .mobile-menu-btn.active span:nth-child(2) {
        opacity: 0;
    }

    .mobile-menu-btn.active span:nth-child(3) {
        transform: rotate(-45deg) translate(5px, -5px);
    }

    @media (max-width: 768px) {
        .mobile-menu-btn {
            display: block;
        }

        .nav-links {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            // max-width: 300px;
            background: var(--background-color);
            padding: 5rem 2rem 2rem;
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: var(--shadow-lg);
            z-index: 999;
        }

        .nav-links.active {
            transform: translateX(0);
        }

        .nav-links a {
            display: block;
            padding: 1rem 0;
            font-size: 1.2rem;
        }
    }
`;

document.head.appendChild(style); 