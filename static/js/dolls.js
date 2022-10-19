const imgs = {};
let dollAssets = [];
let uniqueGroups = [...new Set(dollAssets.map((t) => t.group))];
let currentGroup;
const groups = {
	background: {
		label: "Background",
		emoji: "v",
	},
	skintone: {
		label: "Skin tone",
		emoji: "←",
	},
	shirt: {
		label: "Shirts",
		emoji: "V",
	},
	outerwear: {
		label: "Outerwear",
		emoji: "X",
	},
};

function defineAssets() {
	dollAssets = [
		{
			group: "background",
		},
		{
			group: "skintone",
			name: "Brown shoes",
			layers: [
				{
					layer: 10,
					img: img("https://jipfr.nl/jip.jpg"),
					gender: "m",
				},
				{
					layer: 10,
					img: img("https://jipfr.nl/jip.jpg"),
					gender: "f",
				},
			],
		},
		{
			group: "skintone",
		},
		{
			group: "shirt",
		},
		{
			group: "outerwear",
		},
	];
	uniqueGroups = [...new Set(dollAssets.map((t) => t.group))];
	if (!currentGroup) currentGroup = uniqueGroups[0];
}

function renderNav() {
	// Populate navigation
	const nav = document.querySelector(".dolls-nav");
	nav.innerHTML = "";
	for (const groupId of uniqueGroups) {
		// Create new node
		const el = document
			.importNode(
				document.querySelector(".dolls-nav-item-template").content,
				true
			)
			.querySelector("*");

		// Provide labels
		const group = groups[groupId];

		el.querySelector(".text").textContent = group?.label ?? groupId;
		if (group?.emoji) el.querySelector(".emoji").textContent = group.emoji;

		// Add event listeners
		el.addEventListener("click", () => {
			currentGroup = groupId;
			renderNav();
		});

		// Add active class
		if (groupId === currentGroup) el.classList.add("active");
		nav.appendChild(el);
	}
}

function drawCharacter() {
	const canvas = document.querySelector(".dolls-canvas");
	const ctx = canvas.getContext("2d");
	canvas.width = canvas.scrollWidth;
	canvas.height = canvas.scrollHeight
}

function dollsMain() {
	defineAssets();
	renderNav();
	drawCharacter();
}

function img(src) {
	if (imgs[src]) return imgs[src];
	const img = new Image();
	img.src = src;
	imgs[src] = img;
	return img;
}

// Wait for all images to load, then remove the loading screen and seed the nav and stuff
const allImages = Object.values(imgs);
const promises = allImages.map((img) => {
	return new Promise((resolve) => {
		if (img.loaded) return true;
		img.addEventListener("load", resolve);
	});
});
Promise.all(promises).then(() => {
	dollsMain();
	document.querySelector(".dolls").classList.add("loaded");
});
