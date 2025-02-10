document.addEventListener('DOMContentLoaded', function () {
  // Ensure tooltips are enabled by default unless explicitly disabled
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

  tooltipToggle.addEventListener('click', function() {
	tooltipsEnabled = tooltipToggle.checked;
	tooltipToggle.style.opacity = tooltipsEnabled ? '1' : '0.5';
	localStorage.setItem('tooltipsEnabled', tooltipsEnabled.toString());
	console.log('Tooltips enabled:', tooltipsEnabled);
  });

  const previewContainer = document.getElementById('preview-container');
  let searchData = [];

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

  function showPreview(event) {
	if (!tooltipsEnabled) return;
	const url = this.href;
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
		${pageData.image ? `<img src="${pageData.image}" alt="${pageData.title}" style="max-width: 100%; margin-top: 0.5rem;">` : ""}
		<p style="padding: 0; margin: 0.5rem;">${truncatedContent}</p>
	  `;

	  previewContainer.innerHTML = previewContent;
	  previewContainer.style.display = "block";

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