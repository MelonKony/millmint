document.addEventListener('DOMContentLoaded', function() {
	let loading = false;
	const grid = document.getElementById('illustration-grid');
	const loadingSpinner = document.getElementById('loading-spinner');
	const pagination = document.getElementById('pagination');
	const viewToggle = document.getElementById('view-toggle');
	const toggleLabel = document.getElementById('toggle-label');

	// Initialize view mode from localStorage
	const viewMode = localStorage.getItem('viewMode') || 'infinite';
	viewToggle.checked = viewMode === 'pagination';
	pagination.style.display = viewMode === 'pagination' ? 'flex' : 'none';
	toggleLabel.textContent = viewMode === 'pagination' ? 'Pagination' : 'Pagination';

	if (viewMode === 'infinite') {
		window.addEventListener('scroll', handleScroll);
	}

	// Toggle between infinite scroll and pagination
	viewToggle.addEventListener('change', function() {
		const newMode = this.checked ? 'pagination' : 'infinite';
		localStorage.setItem('viewMode', newMode);

		// Reset to top or reload /stories/
		if (newMode === 'pagination') {
			// Keep the first 10 posts and clear any additional ones
			const posts = grid.querySelectorAll('.card');
			const first10Posts = Array.from(posts).slice(0, 10);
			grid.innerHTML = '';  // Clear all posts
			first10Posts.forEach(post => grid.appendChild(post));  // Retain the first 10 posts

			pagination.style.display = 'flex';
			toggleLabel.textContent = 'Pagination';
			window.removeEventListener('scroll', handleScroll);
			window.scrollTo(0, 0);  // Scroll back to the top

			// Load the first page of posts (pagination mode)
			loadPageContent(1);
		} else {
			pagination.style.display = 'none';
			toggleLabel.textContent = 'Pagination';
			window.addEventListener('scroll', handleScroll);
			// Optionally, you can redirect to the /stories/ URL for a full reset
			window.location.href = '/stories/';  // Redirect to the /stories/ page
		}
	});

	function handleScroll() {
		if (loading) return;

		const lastCard = grid.lastElementChild;
		if (!lastCard) return;

		const lastCardOffset = lastCard.offsetTop + lastCard.clientHeight;
		const pageOffset = window.pageYOffset + window.innerHeight;

		if (pageOffset > lastCardOffset - 20) {
			loadMore();
		}
	}

	async function loadPageContent(pageNumber) {
		loading = true;
		loadingSpinner.style.display = 'block';

		try {
			const response = await fetch(`/stories/page/${pageNumber}`);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.text();
			const parser = new DOMParser();
			const doc = parser.parseFromString(data, 'text/html');
			const newCards = doc.querySelectorAll('.card');

			if (newCards.length === 0) {
				// No more cards to load
				window.removeEventListener('scroll', handleScroll);
				return;
			}

			newCards.forEach(card => {
				const clone = card.cloneNode(true);
				grid.appendChild(clone);
			});

			currentPage = pageNumber;
			updateTaxonomyPills();
		} catch (error) {
			console.error('Error loading page content:', error);
		} finally {
			loading = false;
			loadingSpinner.style.display = 'none';
		}
	}

	async function loadMore() {
		loading = true;
		loadingSpinner.style.display = 'block';

		try {
			const response = await fetch(`/stories/page/${currentPage + 1}`);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.text();
			const parser = new DOMParser();
			const doc = parser.parseFromString(data, 'text/html');
			const newCards = doc.querySelectorAll('.card');

			if (newCards.length === 0) {
				// No more cards to load
				window.removeEventListener('scroll', handleScroll);
				return;
			}

			newCards.forEach(card => {
				const clone = card.cloneNode(true);
				grid.appendChild(clone);
			});

			currentPage++;
			updateTaxonomyPills();
		} catch (error) {
			console.error('Error loading more content:', error);
		} finally {
			loading = false;
			loadingSpinner.style.display = 'none';
		}
	}

	function updateTaxonomyPills() {
		const cards = document.querySelectorAll('.card');

		function getUniqueValues(attribute) {
			const values = new Set();
			cards.forEach(card => {
				const data = card.dataset[attribute];
				if (data) {
					data.split(',').forEach(value => values.add(value.trim()));
				}
			});
			return Array.from(values).sort();
		}

		function updatePillSection(containerId, values, filterType) {
			const container = document.getElementById(containerId);
			if (!container) return;

			container.innerHTML = values.map(value =>
				`<button class="taxonomy-pill" data-filter="${filterType}" data-value="${value}">${value}</button>`
			).join('');

			// Reattach event listeners if needed
			container.querySelectorAll('.taxonomy-pill').forEach(pill => {
				pill.addEventListener('click', function() {
					this.classList.toggle('active');
					// Add your filtering logic here
				});
			});
		}

		updatePillSection('tag-filters', getUniqueValues('tags'), 'tag');
		updatePillSection('character-filters', getUniqueValues('characters'), 'character');
		updatePillSection('category-filters', getUniqueValues('categories'), 'category');
	}

	// Initialize infinite scroll if in infinite mode
	let currentPage = 1;
	if (viewMode === 'infinite') {
		window.addEventListener('scroll', handleScroll);
	}

	// Handle taxonomy pill clicks
	document.querySelectorAll('.taxonomy-pill').forEach(pill => {
		pill.addEventListener('click', function() {
			this.classList.toggle('active');
			// Add your filtering logic here
		});
	});

	// Handle responsive grid
	function updateGridLayout() {
		const cards = document.querySelectorAll('.card');
		cards.forEach(card => {
			const image = card.querySelector('img');
			if (image) {
				image.style.height = `${image.offsetWidth}px`;
			}
		});
	}

	// Update layout on load and resize
	window.addEventListener('load', updateGridLayout);
	window.addEventListener('resize', updateGridLayout);
});