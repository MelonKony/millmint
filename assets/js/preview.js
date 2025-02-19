document.addEventListener('DOMContentLoaded', function () {
	let tooltipsEnabled = localStorage.getItem('tooltipsEnabled');
	if (tooltipsEnabled === null) {
	  tooltipsEnabled = true;
	  localStorage.setItem('tooltipsEnabled', 'true');
	} else {
	  tooltipsEnabled = tooltipsEnabled === 'true';
	}
  
	const tooltipToggle = document.getElementById('tooltip-toggle');
	tooltipToggle.checked = tooltipsEnabled;
	tooltipToggle.style.opacity = tooltipsEnabled ? '1' : '0.5';
  
	tooltipToggle.addEventListener('click', function () {
	  tooltipsEnabled = tooltipToggle.checked;
	  tooltipToggle.style.opacity = tooltipsEnabled ? '1' : '0.5';
	  localStorage.setItem('tooltipsEnabled', tooltipsEnabled.toString());
	});
  
	const previewContainer = document.getElementById('preview-container');
	let searchData = [];
	let isTooltipAllowed = window.innerWidth >= 500;
  
	function updateTooltipState() {
	  isTooltipAllowed = window.innerWidth >= 500;
	  if (!isTooltipAllowed) previewContainer.style.display = 'none';
	}
  
	window.addEventListener('resize', updateTooltipState);
  
	function debounce(func, wait) {
	  let timeout;
	  return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), wait);
	  };
	}
  
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
  
	fetch('/en.search-data.json')
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
  
	function createResponsiveImage(imageData, title) {
	  if (!imageData) return '';
	  
	  // Handle both new and old format
	  const imageSrc = typeof imageData === 'string' ? imageData : imageData.src;
	  const webpSrc = typeof imageData === 'string' ? null : imageData.webp;
	  
	  if (webpSrc) {
		return `<img 
		  src="${webpSrc}"
		  alt="${title}"
		  style="max-width: 100%; margin-top: 0.5rem;"
		  loading="lazy"
		>`;
	  } else {
		// Fallback for old format or when processing failed
		return `<img 
		  src="${imageSrc}"
		  alt="${title}"
		  style="max-width: 100%; margin-top: 0.5rem;"
		  loading="lazy"
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
  
	function showPreview(event) {
	  if (!tooltipsEnabled || !isTooltipAllowed) return;
	  const url = this.href;
	  prefetch(url);
	  const pageData = findPageData(url);
  
	  if (pageData) {
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
	  }
	}
  
	function hidePreview() {
	  previewContainer.style.display = 'none';
	}
  
	document.querySelectorAll('article p, article figcaption, article div, article li, article blockquote, article table, article details').forEach(article => {
	  article.querySelectorAll('a').forEach(link => {
		link.addEventListener('mouseenter', debounce(showPreview, 0));
		link.addEventListener('mouseleave', hidePreview);
	  });
	});
  });