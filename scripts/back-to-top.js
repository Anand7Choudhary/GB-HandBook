// Back to Top Button Functionality
class BackToTop {
    constructor() {
        console.log('[BackToTop] Initializing...');
        try {
            this.button = document.createElement('a');
            this.button.href = '#';
            this.button.className = 'back-to-top';
            this.button.innerHTML = '<span>↑</span>';
            this.button.setAttribute('aria-label', 'Back to top');
            console.log('[BackToTop] Button element created successfully');
            
            this.init();
        } catch (error) {
            console.error('[BackToTop] Error in constructor:', error);
        }
    }

    init() {
        console.log('[BackToTop] Starting initialization...');
        try {
            // Add button to the page
            document.body.appendChild(this.button);
            console.log('[BackToTop] Button added to page successfully');

            // Add scroll event listener
            window.addEventListener('scroll', () => {
                console.log('[BackToTop] Scroll event triggered');
                this.toggleVisibility();
            });
            console.log('[BackToTop] Scroll event listener added');

            // Add click event listener
            this.button.addEventListener('click', (e) => {
                console.log('[BackToTop] Button clicked');
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            console.log('[BackToTop] Click event listener added');

            // Initial check
            this.toggleVisibility();
            console.log('[BackToTop] Initial visibility check complete');
        } catch (error) {
            console.error('[BackToTop] Error in init:', error);
        }
    }

    toggleVisibility() {
        try {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const threshold = windowHeight * 1;
            
            console.log('[BackToTop] Toggle visibility check -', {
                scrollPosition,
                windowHeight,
                threshold,
                shouldBeVisible: scrollPosition > threshold
            });
            
            // Show button when scrolled past 2 viewport heights
            if (scrollPosition > threshold) {
                if (!this.button.classList.contains('visible')) {
                    console.log('[BackToTop] Adding visible class');
                    this.button.classList.add('visible');
                }
            } else {
                if (this.button.classList.contains('visible')) {
                    console.log('[BackToTop] Removing visible class');
                    this.button.classList.remove('visible');
                }
            }
        } catch (error) {
            console.error('[BackToTop] Error in toggleVisibility:', error);
        }
    }
}

// Initialize back to top button when DOM is loaded
console.log('[BackToTop] Script loaded, waiting for DOM...');
document.addEventListener('DOMContentLoaded', () => {
    console.log('[BackToTop] DOM loaded, creating instance...');
    try {
        new BackToTop();
        console.log('[BackToTop] Instance created successfully');
    } catch (error) {
        console.error('[BackToTop] Error creating instance:', error);
    }
}); 