document.addEventListener('DOMContentLoaded', function () {
	let tooltipsEnabled = localStorage.getItem('tooltipsEnabled');
	if (tooltipsEnabled === null) {
		tooltipsEnabled = true;
		localStorage.setItem('tooltipsEnabled', 'true');
	} else {
		tooltipsEnabled = tooltipsEnabled === 'true';
	}

	const tooltipToggle = document.getElementById('tooltip-toggle');
	tooltipToggle.setAttribute('aria-pressed', tooltipsEnabled);
	tooltipToggle.style.opacity = tooltipsEnabled ? '1' : '0.5';

	tooltipToggle.addEventListener('click', function () {
		tooltipsEnabled = !tooltipsEnabled;
		tooltipToggle.setAttribute('aria-pressed', tooltipsEnabled);
		tooltipToggle.style.opacity = tooltipsEnabled ? '1' : '0.5';
		localStorage.setItem('tooltipsEnabled', tooltipsEnabled.toString());
	});

	const previewContainer = document.getElementById('preview-container');

	// Add safety check
	if (!previewContainer) {
		console.log('Preview container element not found');
		return;
	}

	let searchData = [];
	let isTooltipAllowed = window.innerWidth >= 500;

	// Track active tooltip state
	let activeTooltipUrl = null;
	let isProcessingTooltip = false;

	function updateTooltipState() {
		isTooltipAllowed = window.innerWidth >= 500;
		if (!isTooltipAllowed) previewContainer.style.display = 'none';
	}

	window.addEventListener('resize', updateTooltipState);

	function normalizeUrl(url) {
		return url.endsWith('/') ? url : url + '/';
	}

	function prefetch(url) {
		setTimeout(() => {
			const link = document.createElement('link');
			link.rel = 'prefetch';
			link.href = url;
			document.head.appendChild(link);
		}, 500);
	}

	fetch('/data.small.json')  // Update to use the new data.json endpoint
		.then(response => response.json())
		.then(data => { searchData = data; })
		.catch(error => console.error('Error fetching search data:', error));

	function findPageData(url) {
		const normalizedUrl = normalizeUrl(url);
		return searchData.find(page => {
			const pageHref = normalizeUrl(page.href);
			const aliasMatch = page.aliases && page.aliases.some(alias =>
				normalizedUrl.endsWith(normalizeUrl(alias))
			);
			return normalizedUrl.endsWith(pageHref) || aliasMatch;
		});
	}

	// Cache for preloaded images
	const imageCache = {};

	function preloadImage(url) {
		if (!url || imageCache[url]) return Promise.resolve();

		return new Promise((resolve) => {
			const img = new Image();
			img.onload = () => {
				imageCache[url] = true;
				resolve();
			};
			img.onerror = () => {
				resolve(); // Resolve anyway to prevent hanging
			};
			img.src = url;
		});
	}

	function createResponsiveImage(imageData, title) {
		if (!imageData) return '';

		const imageSrc = typeof imageData === 'string' ? imageData : imageData.src;
		const webpSrc = typeof imageData === 'string' ? null : imageData.webp;
		const displaySrc = webpSrc || imageSrc;

		if (displaySrc) {
			preloadImage(displaySrc);
		}

		if (webpSrc) {
			return `<img 
        src="${webpSrc}"
        alt="${title}"
        style="max-width: 100%; margin-top: 0.5rem;"
        loading="eager"
        class="no-lazyload"
      >`;
		} else {
			return `<img 
        src="${imageSrc}"
        alt="${title}"
        style="max-width: 100%; margin-top: 0.5rem;"
        loading="eager"
        class="no-lazyload"
      >`;
		}
	}

	// Create an overlay color element to sample from CSS variables if needed
	const colorSampleElement = document.createElement('div');
	colorSampleElement.style.visibility = 'hidden';
	colorSampleElement.style.position = 'absolute';
	colorSampleElement.style.pointerEvents = 'none';
	document.body.appendChild(colorSampleElement);

	function getComputedColor(colorValue) {
		// For direct RGB values
		if (typeof colorValue === 'string' && colorValue.startsWith('rgb')) {
			return colorValue;
		}

		// For CSS variables
		if (typeof colorValue === 'string' && colorValue.startsWith('var(')) {
			colorSampleElement.style.color = colorValue;
			return window.getComputedStyle(colorSampleElement).color;
		}

		// Fallback
		return colorValue;
	}

	function showPreview(event, linkElement) {
		if (!tooltipsEnabled || !isTooltipAllowed || isProcessingTooltip) return;

		// Check if the link or any of its ancestors have the no-preview class
		if (linkElement.classList.contains('no-preview') || linkElement.closest('.no-preview')) {
			return;
		}

		const url = linkElement.href;

		// If we're already showing this tooltip, don't do anything
		if (activeTooltipUrl === url) return;

		// Mark that we're processing a tooltip to prevent concurrent processing
		isProcessingTooltip = true;
		activeTooltipUrl = url;

		prefetch(url);
		const pageData = findPageData(url);

		if (pageData) {
			// If there's an image, preload it first to avoid flickering during rendering
			let imageUrl = null;
			if (pageData.image) {
				if (typeof pageData.image === 'string') {
					imageUrl = pageData.image;
				} else if (pageData.image.webp) {
					imageUrl = pageData.image.webp;
				} else if (pageData.image.src) {
					imageUrl = pageData.image.src;
				}
			}

			// Create a promise that will resolve with either the preloaded image or immediately
			const prepareData = imageUrl ? preloadImage(imageUrl) : Promise.resolve();

			prepareData.then(() => {
				// Force immediate load by removing any lazy loading classes
				if (typeof lazySizes !== 'undefined') {
					const lazyElements = previewContainer.getElementsByClassName('lazyload');
					Array.from(lazyElements).forEach(element => {
						element.classList.remove('lazyload');
						element.classList.add('no-lazyload');
					});
				}

				let content = pageData.description || pageData.content || "";
				content = content.replace(/(\[\[.*?\]\]|\{\{.*?\}\})/g, "");
				const truncatedContent = content.substring(0, 200);

				const colorStyle = pageData.rgb
					? `rgb(${Array.isArray(pageData.rgb) ? pageData.rgb.join(",") : pageData.rgb})`
					: pageData.color
						? `var(--color-${pageData.color.replace(/^--/, "")})`
						: "var(--font-color)";

				const logoOrIcon = pageData.logo
					? `<img src="${pageData.logo}" alt="${pageData.title}" style="padding: 0; border-radius: 2.5px; height: 30px; margin: auto;">`
					: pageData.icon
						? `<span class="navicon" style="font-size: 1.5rem; width: 30px;">${pageData.icon}</span>`
						: "";

				const previewContent = `
			<div class="tooltip-header" style="color: ${colorStyle}; display: grid; grid-template-columns: auto 1fr; column-gap: 0.5rem; align-items: center; margin: 0.5rem;">
			  <div style="grid-row: span 2; display: flex; align-items: center; justify-content: center;">
				${logoOrIcon}
			  </div>
			  <b style="grid-column: 2;">${pageData.title}</b>
			  ${pageData.section ? `<span style="grid-column: 2;"><i>${pageData.section}</i></span>` : ""}
			</div>
			${createResponsiveImage(pageData.image, pageData.title)}
			<p style="padding: 0; margin: 0.5rem;">${truncatedContent}</p>
		  `;

				// Create the tooltip with proper dimensions from the start
				previewContainer.innerHTML = previewContent;
				previewContainer.style.display = "block";

				// Get the actual computed color value if it's a CSS variable
				const computedColor = getComputedColor(colorStyle);

				// Set a solid background color as the base (site's background color)
				previewContainer.style.backgroundColor = "var(--main-background)";

				// For RGB values, add a subtle, uniform tint
				if (computedColor.startsWith('rgb')) {
					const rgbMatch = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
					if (rgbMatch) {
						// Create a very light, uniform tint (5% opacity)
						const tintColor = `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, 0.05)`;
						// Apply a solid, uniform tint over the background
						previewContainer.style.backgroundImage = `linear-gradient(to right, ${tintColor}, ${tintColor})`;
					}
				} else {
					// For CSS variables or other cases where we couldn't compute RGB
					// Create a semi-transparent overlay of the theme color
					previewContainer.style.backgroundImage = `linear-gradient(to right, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02))`;
				}

				previewContainer.style.border = `1px solid ${colorStyle}`;
				previewContainer.style.borderLeft = `4px solid ${colorStyle}`;
				previewContainer.style.borderRadius = "4px";

				const viewportHeight = window.innerHeight;
				const tooltipHeight = previewContainer.offsetHeight;
				const positionAbove = event.clientY > viewportHeight / 2;

				previewContainer.style.left = `${event.pageX - 10}px`;
				previewContainer.style.top = positionAbove
					? `${event.pageY - tooltipHeight - 10}px`
					: `${event.pageY + 10}px`;

				// Set z-index high to ensure it's above other elements
				previewContainer.style.zIndex = "9999";

				// After tooltip is fully ready, mark processing as complete
				isProcessingTooltip = false;
			});
		} else {
			isProcessingTooltip = false;
		}
	}

	function hidePreview() {
		previewContainer.style.display = 'none';
		activeTooltipUrl = null;
	}

	// Prevents the mousemove handler from firing too frequently
	let lastMoveTime = 0;
	const moveDelay = 50; // ms between allowable mousemove events

	// Use event delegation for efficiency
	document.addEventListener('mouseover', function (event) {
		// Find the closest link element
		const linkElement = event.target.closest('article p a, article figcaption a, article div a, article li a, article blockquote a, article table a, article details a');
		if (!linkElement) return;

		showPreview(event, linkElement);
	});

	document.addEventListener('mouseout', function (event) {
		// Only process if we're leaving an element that contains our current active link
		const linkElement = event.target.closest('a');
		if (!linkElement || !activeTooltipUrl || linkElement.href !== activeTooltipUrl) return;

		// Check if we're moving to a child of the same link (in which case don't hide)
		const relatedTarget = event.relatedTarget;
		if (relatedTarget && linkElement.contains(relatedTarget)) {
			return;
		}

		hidePreview();
	});

	// Make sure tooltip container is properly set up
	previewContainer.style.position = "absolute";
	previewContainer.style.width = "300px";
	previewContainer.style.display = "none";
	previewContainer.style.pointerEvents = "none"; // Don't allow mouse events on the tooltip
	previewContainer.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
	previewContainer.style.zIndex = "9999";
});