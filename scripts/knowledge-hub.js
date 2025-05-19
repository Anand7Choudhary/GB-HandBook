// Knowledge Hub Functionality
class KnowledgeHub {
    constructor() {
        this.cards = [];
        this.tags = [];
        this.activeFilters = new Set();
        this.searchTerm = '';
        this.grid = document.getElementById('knowledgeGrid');
        this.searchInput = document.getElementById('knowledgeSearch');
        this.filterContainer = document.getElementById('filterTags');
        this.template = document.getElementById('cardTemplate');
        this.modal = document.getElementById('comingSoonModal');
        
        this.init();
        this.setupModal();
    }

    async init() {
        try {
            const response = await fetch('/data/knowledge-hub.json');
            const data = await response.json();
            this.cards = data.cards;
            this.tags = data.tags;
            
            this.setupSearch();
            this.setupFilters();
            this.renderCards();
        } catch (error) {
            console.error('Error loading knowledge hub data:', error);
        }
    }

    setupSearch() {
        let debounceTimer;
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.searchTerm = e.target.value.toLowerCase();
                this.renderCards();
            }, 300);
        });
    }

    setupFilters() {
        this.tags.forEach(tag => {
            const button = document.createElement('button');
            button.className = 'filter-tag';
            button.textContent = tag;
            button.addEventListener('click', () => {
                button.classList.toggle('active');
                if (button.classList.contains('active')) {
                    this.activeFilters.add(tag);
                } else {
                    this.activeFilters.delete(tag);
                }
                this.renderCards();
            });
            this.filterContainer.appendChild(button);
        });

        // Add scrollable indicator for mobile
        if (window.innerWidth <= 500) {
            this.checkScrollable();
            window.addEventListener('resize', () => {
                if (window.innerWidth <= 500) {
                    this.checkScrollable();
                } else {
                    this.filterContainer.classList.remove('scrollable');
                }
            });
        }
    }

    checkScrollable() {
        if (!this.filterContainer) return; // Guard against null
        const isScrollable = this.filterContainer.scrollWidth > this.filterContainer.clientWidth;
        this.filterContainer.parentElement.classList.toggle('scrollable', isScrollable);
    }

    renderCards() {
        this.grid.innerHTML = '';
        
        const filteredCards = this.cards.filter(card => {
            const matchesSearch = this.searchTerm === '' || 
                card.title.toLowerCase().includes(this.searchTerm) ||
                card.description.toLowerCase().includes(this.searchTerm) ||
                card.tags.some(tag => tag.toLowerCase().includes(this.searchTerm));
            
            const matchesFilters = this.activeFilters.size === 0 ||
                card.tags.some(tag => this.activeFilters.has(tag));
            
            return matchesSearch && matchesFilters;
        });

        if (filteredCards.length === 0) {
            const noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'no-results';
            noResultsDiv.innerHTML = `
                <div class="no-results__icon">🔍</div>
                <h3>Oops! Nothing Found</h3>
                <p>Looks like our knowledge bubble is empty! Maybe the insights are taking a coffee break? ☕</p>
                <p class="no-results__subtext">Try adjusting your search or filters - we promise we have some great content hiding somewhere!</p>
            `;
            this.grid.appendChild(noResultsDiv);
            return;
        }

        filteredCards.forEach(card => {
            const cardElement = this.createCard(card);
            this.grid.appendChild(cardElement);
        });
    }

    setupModal() {
        // Close modal when clicking the close button or overlay
        const closeModal = () => {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        this.modal.querySelector('.modal__close').addEventListener('click', closeModal);
        this.modal.querySelector('.modal__overlay').addEventListener('click', closeModal);
        this.modal.querySelector('.modal__button').addEventListener('click', closeModal);

        // Close modal when pressing Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    showComingSoonModal() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    createCard(card) {
        const clone = this.template.content.cloneNode(true);
        const cardElement = clone.querySelector('.knowledge-card');
        const link = clone.querySelector('.knowledge-card__link');
        const icon = clone.querySelector('.knowledge-card__icon');
        const title = clone.querySelector('.knowledge-card__title');
        const description = clone.querySelector('.knowledge-card__description');
        const tagsContainer = clone.querySelector('.knowledge-card__tags');
        const date = clone.querySelector('.knowledge-card__date');

        // Set card content
        link.href = card.link;
        icon.innerHTML = this.getIconSVG(card.icon);
        title.textContent = card.title;
        description.textContent = card.description;
        date.textContent = new Date(card.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        // Set card status attributes
        cardElement.dataset.published = card.published;
        cardElement.dataset.comingSoon = card.comingSoon;

        // Add click handler for coming soon cards
        if (card.comingSoon) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showComingSoonModal();
            });
        }

        // Add tags
        card.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'knowledge-card__tag';
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });

        return clone;
    }

    getIconSVG(iconName) {
        const icons = {
            'chart-line': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 3v18h18"></path>
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
            </svg>`,
            'rocket': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
            </svg>`,
            'lightbulb': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18h6"></path>
                <path d="M10 22h4"></path>
                <path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8z"></path>
            </svg>`,
            'chart-pie': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
            </svg>`
        };

        return icons[iconName] || icons['chart-line'];
    }
}

// Initialize Knowledge Hub when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new KnowledgeHub();
}); 