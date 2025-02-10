function updateActiveToc() {
	const titles = [...document.querySelectorAll('article h2, article h3')];
	const minDistanceFromTop = 150;

	// Get all titles with their position relative to the top of the viewport
	const visibleTitles = titles.filter(titleEl => {
		const rect = titleEl.getBoundingClientRect();
		return rect.top >= 0 && rect.top <= window.innerHeight - minDistanceFromTop; // Titles in view
	});

	const currentTitle = visibleTitles[visibleTitles.length - 1]; // Last visible title

	// Remove all active classes
	document.querySelectorAll('.toc-active').forEach(a => a.classList.remove('toc-active'));

	// Add active class to corresponding TOC link
	if (currentTitle) {
		const anchor = document.querySelector(`#TOC a[href="#${currentTitle.id}"]`);
		if (anchor) {
			anchor.classList.add('toc-active');
		}
	}
}

// Ensure TOC is visible on button click
var button = document.getElementById('toc-button');
if (button) {
	button.onclick = function() {
		var div = document.getElementById('desktop-toc');
		div.style.display = (div.style.display === 'none' || div.style.display === '') ? 'block' : 'none';
	};
}

updateActiveToc();
window.addEventListener('scroll', updateActiveToc);