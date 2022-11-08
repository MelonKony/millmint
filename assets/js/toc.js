/* TOC.JS // @author: Jip Frijlink // Table of contents for millmint.net */

function updateActiveToc() {
	const titles = [...document.querySelectorAll('article h2, article h3')];

	const minDistanceFromTop = 150;

	// Get all titles with their offset, then remove ones that are too far down
	const visibleTitles = titles.map(titleEl => {
		return {
			el: titleEl, 
			top: titleEl.getBoundingClientRect().top
		}
	}).filter(t => t.top < minDistanceFromTop).map(t => t.el)
	const currentTitle = visibleTitles[visibleTitles.length - 1];

	// Remove all other active classes
	document.querySelectorAll('.toc-active').forEach(a => a.classList.remove('toc-active'))

	// Add active class to anchor
	let anchors = document.querySelectorAll(`#TableOfContents a[href="#${currentTitle?.id}"]`)
	
	if(anchors.length === 0) {
		anchors = document.querySelectorAll('.toc-title')	
	}

	for(const a of anchors) {
		a.classList.add('toc-active')
	}
}

updateActiveToc()
window.addEventListener('scroll', updateActiveToc);

/* TOC button */

var button = document.getElementById('toc-button');

button.onclick = function() {
	var div = document.getElementById('desktop-toc');
	if (div.style.display !== 'block') {
		div.style.display = 'block';
	}
	else {
		div.style.display = 'none';
	}
};