document.addEventListener('DOMContentLoaded', function () {
    const grid = document.getElementById('illustration-grid');
    if (!grid) return;
    // Global variables
    let currentPage = 1;
    let loading = false;
    let storyData = [];
    let allTaxonomyData = {
        tags: new Set(),
        characters: new Set(),
        categories: new Set()
    };
    let activeFilters = {
        tag: new Set(),
        character: new Set(),
        category: new Set()
    };
    let viewMode = localStorage.getItem('viewMode') || 'infinite';

    // --- Preselect filters based on URL ---
    (function preselectFiltersFromURL() {
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        // Example: /characters/tzipora
        if (pathParts.length === 2) {
            const [taxonomy, value] = pathParts;
            // Map URL taxonomy to filter type
            const taxonomyMap = {
                'characters': 'character',
                'tags': 'tag',
                'categories': 'category'
            };
            const filterType = taxonomyMap[taxonomy];
            if (filterType && value) {
                activeFilters[filterType].add(decodeURIComponent(value));
            }
        }
    })();

    // DOM elements and initialization - moved to the top
    const loadingSpinner = document.getElementById('loading-spinner');
    const pagination = document.getElementById('pagination');
    const viewToggle = document.getElementById('view-toggle');
    let filtersContainer = document.getElementById('taxonomy-filters-container');

    // Function definitions
    // Add event listener for pill clicks
    function updatePillSection(containerId, values, filterType, title) {
        const taxonomyKey = filterType === 'category' ? 'categories' : `${filterType}s`;
        const taxonomyValues = Array.from(allTaxonomyData[taxonomyKey] || [])
            .map(value => value.trim())
            .sort();
    
        let section = document.getElementById(`${filterType}-section`);
        if (!section) {
            section = document.createElement('div');
            section.id = `${filterType}-section`;
            section.className = 'filter-section note panel';
    
            const heading = document.createElement('h4');
            heading.textContent = title;
            heading.className = 'filter-title';
            section.appendChild(heading);
    
            const container = document.createElement('div');
            container.id = containerId;
            container.className = 'taxonomy-pills-container';
            section.appendChild(container);
    
            if (filtersContainer) {
                filtersContainer.appendChild(section);
            }
        }
    
        const container = document.getElementById(containerId);
        if (!container) {
            console.debug(`Container ${containerId} not found, skipping`);
            return;
        }
        container.innerHTML = '';
    
        taxonomyValues.forEach(value => {
            const pill = document.createElement('button');
            pill.className = `taxonomy-pill ${activeFilters[filterType].has(value) ? 'active' : ''}`;
            pill.dataset.filter = filterType;
            pill.dataset.value = value;
            pill.textContent = value.replace(/&amp;/g, '&');
    
            pill.addEventListener('click', function() {
                const normalizedValue = value.trim();
                if (activeFilters[filterType].has(normalizedValue)) {
                    activeFilters[filterType].delete(normalizedValue);
                    this.classList.remove('active');
                } else {
                    activeFilters[filterType].add(normalizedValue);
                    this.classList.add('active');
                }
                updateTaxonomyPills();
                applyFilters();
            });
    
            container.appendChild(pill);
        });
    }

    function updateTaxonomyPills() {
        updatePillSection('tag-filters', [], 'tag', 'Tags');
        updatePillSection('character-filters', [], 'character', 'Characters');
        updatePillSection('category-filters', [], 'category', 'Categories');






        updateActiveFiltersBar();
    }

    function updateActiveFiltersBar() {
        const bar = document.getElementById('active-filters-bar');
        const list = document.getElementById('active-filters-list');
    
        // Skip if elements don't exist
        if (!bar || !list) {
            console.debug('Active filters bar or list not found, skipping');
            return;
        }
    
        list.innerHTML = '';
        let hasActive = false;
        for (const [type, set] of Object.entries(activeFilters)) {
            set.forEach(value => {
                hasActive = true;
                const pill = document.createElement('button');
                pill.className = 'taxonomy-pill active active-filter-pill';
                pill.textContent = `${value}`;
                pill.addEventListener('click', function() {
                    activeFilters[type].delete(value);
                    updateTaxonomyPills();
                    applyFilters();
                });
                list.appendChild(pill);
            });
        }
        if (hasActive) {
            bar.style.display = '';
        } else {
            bar.style.display = 'none';
        }
    }

    async function loadPageContent(pageNumber) {
        console.log('loadPageContent called with page:', pageNumber);
        if (!grid) {
            console.debug('Grid element not found, skipping loadPageContent');
            return;
        }
        loading = true;
        if (loadingSpinner) loadingSpinner.style.display = 'block';
    
        try {
            const itemsPerPage = 12;
            const startIndex = (pageNumber - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const pageStories = storyData.slice(startIndex, endIndex);
    
            grid.innerHTML = '';
    
            for (const story of pageStories) {
                const card = createStoryCard(story);
                grid.appendChild(card);
            }
    
            currentPage = pageNumber;
            console.log('Page content updated successfully');
        } catch (err) {
            console.error('Error in loadPageContent:', err);
            throw err;
        } finally {
            loading = false;
            if (loadingSpinner) loadingSpinner.style.display = 'none';
        }
    }

    async function loadMore(isInitialLoad = false) {
        console.log('loadMore called, isInitialLoad:', isInitialLoad);
        if (!grid || loading || window.currentFilteredStories) return; // Don't load if grid doesn't exist or we're in filtered mode
        loading = true;
        if (loadingSpinner) loadingSpinner.style.display = 'block';
    
        try {
            const itemsPerPage = 12;
            const pageToLoad = isInitialLoad ? 1 : currentPage + 1;
            const startIndex = (pageToLoad - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const pageStories = storyData.slice(startIndex, endIndex);
    
            if (pageStories.length === 0) {
                window.removeEventListener('scroll', handleScroll);
                return;
            }
    
            if (isInitialLoad) {
                grid.innerHTML = '';
            }
    
            for (const story of pageStories) {
                const card = createStoryCard(story);
                grid.appendChild(card);
            }
    
            currentPage = pageToLoad;
        } catch (err) {
            console.error('Error in loadMore:', err);
        } finally {
            loading = false;
            if (loadingSpinner) loadingSpinner.style.display = 'none';
        }
    }

    // Helper function to create story cards
    function createStoryCard(story) {
        const li = document.createElement('li');
        li.className = 'card';
        if (story.rgb) {
            li.style.backgroundColor = `rgb(${story.rgb})`;
        }
        li.dataset.tags = story.tags || '';
        li.dataset.characters = story.characters || '';
        li.dataset.categories = story.categories || '';

        const link = document.createElement('a');
        link.href = story.href;

        const meta = document.createElement('div');
        meta.className = 'postcard-meta';

        const title = document.createElement('h2');
        title.className = 'title';
        title.textContent = story.title;
        if (story.rgb) {
            title.style.cssText = 'color: #ececf4!important;';
        }
        meta.appendChild(title);

        if (story.date) {
            const date = document.createElement('div');
            date.className = 'date';
            const dateObj = new Date(story.date);
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const formattedDate = `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
            date.textContent = formattedDate;
            if (story.rgb) {
                date.style.cssText = 'color: #ececf4!important;';
            }
            meta.appendChild(date);
        }

        link.appendChild(meta);

        const figure = document.createElement('figure');
        figure.className = 'postcard-image';

        if (story.image && story.image.webp) {
            const img = document.createElement('img');
            img.className = 'page';
            img.src = story.image.webp;
            img.alt = story.title;
            img.loading = 'lazy';
            figure.appendChild(img);
        }

        link.appendChild(figure);
        li.appendChild(link);
        return li;
    }

    async function initializeTaxonomies() {
        try {
            const response = await fetch('/data.small.json');
            const rawData = await response.json();

            storyData = rawData
                .filter(item => {
                    return item.type === 'story' && 
                           item.href && 
                           !item.categories?.includes('millmint') && 
                           item.date &&
                           // Only include items that have at least one taxonomy
                           (item.tags || item.characters || item.categories);
                })
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            ['tags', 'characters', 'categories'].forEach(field => {
                storyData.forEach(item => {
                    if (!item[field]) return;

                    let values;
                    if (Array.isArray(item[field])) {
                        values = item[field];
                    } else if (typeof item[field] === 'string') {
                        values = item[field].split(',');
                    } else {
                        values = [item[field]];
                    }

                    values
                        .map(v => v.trim().replace(/^"|"$/g, ''))
                        .filter(v => v && v !== 'millmint')
                        .forEach(value => allTaxonomyData[field].add(value));
                });
            });

            // Only update taxonomy pills if the container exists
            if (filtersContainer) {
                updateTaxonomyPills();
            } else {
                console.debug('Filters container not found, skipping taxonomy pills update');
            }
        } catch (error) {
            console.error('Taxonomy initialization failed:', error);
        }
    }

    // Keep only this version of handleViewToggle and fix the infinite scroll handling
    function handleViewToggle() {
        const newMode = this.checked ? 'pagination' : 'infinite';
        if (newMode === viewMode) return;
    
        console.debug('View toggle:', { 
            newMode, 
            hasFilters: !!window.currentFilteredStories,
            storiesCount: window.currentFilteredStories?.length || storyData.length 
        });
    
        viewMode = newMode;
        localStorage.setItem('viewMode', viewMode);
        currentPage = 1;
    
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('scroll', handleFilteredScroll);
    
        const stories = window.currentFilteredStories || storyData;
    
        if (!grid) {
            console.debug('Grid element not found, skipping view toggle actions');
            return;
        }
    
        if (viewMode === 'pagination') {
            const totalPages = Math.ceil(stories.length / 12);
            loadFilteredContent(stories, null, 1);
            updatePagination(totalPages, 1, stories);
        } else {
            if (pagination) pagination.style.display = 'none';
            grid.innerHTML = '';
            if (window.currentFilteredStories) {
                console.debug('Loading filtered infinite content:', {
                    storiesCount: stories.length,
                    currentPage
                });
                loadFilteredContent(stories, null, 1);
                const boundHandler = () => handleFilteredScroll(stories);
                window.addEventListener('scroll', boundHandler);
            } else {
                loadMore(true).then(() => {
                    window.addEventListener('scroll', handleScroll);
                });
            }
        }
    }

    function loadFilteredContent(matchingStories, templateCard, page = 1) {
        if (!grid || loading || !matchingStories?.length) return;
        // Remove this line that was preventing pagination from working
        // if (viewMode === 'pagination' && page > 1) return;
    
        loading = true;
        if (loadingSpinner) loadingSpinner.style.display = 'block';
    
        try {
            const itemsPerPage = 12;
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const pageStories = matchingStories.slice(startIndex, endIndex);
            const totalPages = Math.ceil(matchingStories.length / itemsPerPage);
    
            if (pageStories.length === 0 || page > totalPages) {
                window.removeEventListener('scroll', handleScroll);
                window.removeEventListener('scroll', handleFilteredScroll);
                return;
            }
    
            if (viewMode === 'pagination' || page === 1) {
                grid.innerHTML = '';
            }
    
            for (const story of pageStories) {
                const card = createStoryCard(story);
                grid.appendChild(card);
            }
    
            if (viewMode === 'pagination' && pagination) {
                pagination.style.display = 'flex';
                updatePagination(totalPages, page, matchingStories);
                window.removeEventListener('scroll', handleScroll);
                window.removeEventListener('scroll', handleFilteredScroll);
            }
    
            currentPage = page;
    
        } finally {
            loading = false;
            if (loadingSpinner) loadingSpinner.style.display = 'none';
        }
    }

    function applyFilters() {
        const hasActiveFilters = Object.values(activeFilters).some(filterSet => filterSet.size > 0);
    
        if (!hasActiveFilters) {
            console.log('No active filters, resetting to initial state');
            currentPage = 1;
            // Clear all scroll handlers and state
            window.removeEventListener('scroll', handleFilteredScroll);
            window.removeEventListener('scroll', handleScroll);
            window.currentFilteredStories = null;
    
    
    
            grid.innerHTML = '';
    
            if (viewMode === 'pagination') {
                console.log('Loading paginated content');
                if (pagination) pagination.style.display = 'flex';
                loadPageContent(1);
            } else {
                console.log('Loading infinite scroll content');
                if (pagination) pagination.style.display = 'none';
                loadMore(true).then(() => {
                    window.addEventListener('scroll', handleScroll);
                });
            }
            return;
        }
    
        // Find all matching stories from the full dataset
        let matchingStories = storyData;
    
        if (hasActiveFilters) {
            matchingStories = storyData.filter(story => {
                return ['tag', 'character', 'category'].every(filterType => {
                    if (activeFilters[filterType].size === 0) return true;
    
                    // Fix the field mapping to match updatePillSection
                    const field = filterType === 'category' ? 'categories' :
                                `${filterType}s`;
    
                    let itemValues = new Set();
                    if (story[field]) {
                        const valueArray = typeof story[field] === 'string' 
                            ? story[field].split(',').map(v => v.trim().replace(/^"|"\$/g, ''))
                            : Array.isArray(story[field]) 
                                ? story[field] 
                                : [];
    
                        valueArray.forEach(v => {
                            if (v) itemValues.add(v);
                        });
                    }
    
                    return Array.from(activeFilters[filterType]).every(value => itemValues.has(value));
                });
            });
        }
    
        // Always ensure stories are sorted by date
        matchingStories = matchingStories.sort((a, b) => new Date(b.date) - new Date(a.date));
    
        console.log(`Found ${matchingStories.length} matching stories in the full dataset`);
    
        // Clear the current grid
    
    
    
            grid.innerHTML = '';
    
            if (matchingStories.length === 0) {
                const noResults = document.createElement('div');
                noResults.className = 'no-results';
                noResults.textContent = 'No stories match the selected filters';
                grid.appendChild(noResults);
                return;
            }
    
            // Store the filtered stories in a global variable
            window.currentFilteredStories = matchingStories;
    
            if (viewMode === 'pagination') {
                loadFilteredContent(matchingStories, null, 1);
            } else {
                // Fix for infinite scroll with filters
                currentPage = 1;
                loadFilteredContent(matchingStories, null, 1);
                // Remove any existing scroll handlers before adding new one
                window.removeEventListener('scroll', handleScroll);
                window.removeEventListener('scroll', handleFilteredScroll);
                window.addEventListener('scroll', () => handleFilteredScroll(matchingStories));
            }
        }

    // Update the initialization function
    (async function init() {
        const controlsRow = document.querySelector('.controls-row.note');
        if (controlsRow) {
            // Convert controls row to details element
            const details = document.createElement('details');
            details.className = 'controls-details';
            const summary = document.createElement('summary');
            summary.textContent = 'Filters';

            // Move controls row content into details
            const content = document.createElement('div');
            content.className = 'controls-content';
            while (controlsRow.firstChild) {
                content.appendChild(controlsRow.firstChild);
            }

            details.appendChild(summary);
            details.appendChild(content);
            controlsRow.appendChild(details);

            // Create toggle container
            const toggleContainer = document.createElement('div');
            toggleContainer.className = 'view-toggle-container';
            if (viewToggle) {
                viewToggle.parentElement.classList.add('view-toggle-wrapper');
                toggleContainer.appendChild(viewToggle.parentElement);
            }
            summary.appendChild(toggleContainer);

            // Create filters container
            filtersContainer = document.createElement('div');
            filtersContainer.id = 'taxonomy-filters-container';
            content.appendChild(filtersContainer);
        }

        await initializeTaxonomies();

        // Always update pills and apply filters after taxonomy initialization
        updateTaxonomyPills();
        applyFilters();

        if (viewToggle) {
            viewToggle.checked = viewMode === 'pagination';
            pagination.style.display = viewMode === 'pagination' ? 'flex' : 'none';
            viewToggle.addEventListener('change', handleViewToggle);

            // Initial load
            if (viewMode === 'pagination') {
                const totalPages = Math.ceil(storyData.length / 12);
                await loadPageContent(1);
                updatePagination(totalPages, 1, storyData);
            } else {
                await loadMore(true);
                window.addEventListener('scroll', handleScroll);
            }
        }
    })();

    function handleFilteredScroll(matchingStories) {
        if (!grid || loading || !window.currentFilteredStories) return;  // Only proceed if grid exists and we have filtered stories
        const lastCard = grid.lastElementChild;
        if (!lastCard || !lastCard.classList.contains('card')) return;  // Check if it's a valid card
        const lastCardOffset = lastCard.offsetTop + lastCard.clientHeight;
        const pageOffset = window.pageYOffset + window.innerHeight;
        if (pageOffset > lastCardOffset - 20) {
            loadFilteredContent(window.currentFilteredStories || matchingStories, null, currentPage + 1);
        }
    }

    const hugoPagination = document.querySelector('.hugo-pagination');
    const jsPagination = document.querySelector('.js-pagination');

    // Hide Hugo pagination when JS is enabled
    if (hugoPagination) {
        hugoPagination.style.display = 'none';
    }

    function updatePagination(totalPages, currentPage, matchingStories) {
        if (!jsPagination) return;

        console.log('Updating pagination:', { totalPages, currentPage, hasMatchingStories: !!matchingStories });
        jsPagination.innerHTML = '';
        pagination.style.display = 'flex';

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = `page-number ${i === currentPage ? 'active' : ''}`;
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => {
                console.log('Page button clicked:', { 
                    requestedPage: i, 
                    currentPage, 
                    hasMatchingStories: !!matchingStories,
                    viewMode
                });

                if (matchingStories) {
                    loadFilteredContent(matchingStories, null, i);
                } else {
                    const totalPages = Math.ceil(storyData.length / 12);
                    loadPageContent(i);
                    updatePagination(totalPages, i, null);
                }
                grid.scrollIntoView({ behavior: 'smooth' });
            });
            jsPagination.appendChild(pageButton);
        }
    }

    function handleScroll() {
        if (loading || window.currentFilteredStories) return;
        const lastCard = grid.lastElementChild;
        if (!lastCard || !lastCard.classList.contains('card')) return;  // Check if it's a valid card
        const lastCardOffset = lastCard.offsetTop + lastCard.clientHeight;
        const pageOffset = window.pageYOffset + window.innerHeight;
        if (pageOffset > lastCardOffset - 20) {
            loadMore();
        }
    }
});