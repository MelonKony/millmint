const imgs = {};
let dollAssets = [];
let uniqueGroups = [...new Set(dollAssets.map((t) => t.group))];
let currentGroup;
let gender = "f";

// Base doll
const groupSelections = {
	skintone: ["1a"],
	face: ["Zelda"],
	shoes: ["Brown shoes"],
	legwear: ["Long Skirt"],
	socks: ["White socks"],
	top: ["Shirt"],
	hair: ["Dark blue"],
};

// All groups
const groups = {
	figure: {
		label: "Figure",
		emoji: "W",
	},
	background: {
		label: "Background",
		emoji: "v",
	},
	skintone: {
		label: "Skin tone",
		emoji: "←",
		forceOne: true,
	},
	shirt: {
		label: "Shirts",
		emoji: "V",
	},
	outerwear: {
		label: "Outerwear",
		emoji: "X",
	},
	legwear: {
		label: "Legwear",
		emoji: "M",
	},
	top: {
		label: "Top",
		emoji: "B",
	},
	socks: {
		label: "Socks",
		emoji: "P",
	},
	shoes: {
		label: "Shoes",
		emoji: "y",
	},
	hair: {
		label: "Hair",
		emoji: "h",
	},
	face: {
		label: "Face",
		emoji: "H",
		forceOne: true,
	},
	accessories: {
		label: "Accessories",
		emoji: "U",
	},
	jumper: {
		label: "Jumpers",
		emoji: "T",
	},
};

function defineAssets() {
	dollAssets = [
		{
			group: "skintone",
			name: "1a",
			layers: [
				{
					layer: 10,
					img: img("/doll-assets/f/1.figure/1a.png"),
					gender: "f",
				},
			],
		},
		{
			group: "skintone",
			name: "1b",
			layers: [
				{
					layer: 10,
					img: img("/doll-assets/f/1.figure/1b.png"),
					gender: "f",
				},
			],
		},
		{
			group: "skintone",
			name: "1c",
			layers: [
				{
					layer: 10,
					img: img("/doll-assets/f/1.figure/1c.png"),
					gender: "f",
				},
			],
		},
		{
			group: "hair",
			name: "Dark blue",
			layers: [
				{
					layer: 35,
					img: img("/doll-assets/f/3.hair/3a.png"),
					gender: "f",
				},
			],
		},
		{
			group: "hair",
			name: "Pony",
			layers: [
				{
					layer: 35,
					img: img("/doll-assets/f/3.hair/3b.png"),
					gender: "f",
				},
			],
		},
		{
			group: "face",
			name: "Zelda",
			layers: [
				{
					layer: 32,
					img: img("/doll-assets/f/2.face/2a.png"),
					gender: "f",
				},
			],
		},
		{
			group: "face",
			name: "Cobian",
			layers: [
				{
					layer: 32,
					img: img("/doll-assets/f/2.face/2b.png"),
					gender: "f",
				},
			],
		},
		{
			group: "top",
			name: "Shirt",
			layers: [
				{
					layer: 25,
					img: img("/doll-assets/f/7.top/7a.png"),
					gender: "f",
				},
			],
		},
		{
			group: "top",
			name: "Cobian's top",
			layers: [
				{
					layer: 25,
					img: img("/doll-assets/f/7.top/7b.png"),
					gender: "f",
				},
			],
		},
		{
			group: "jumper",
			name: "Jumper",
			layers: [
				{
					layer: 27,
					img: img("/doll-assets/f/8.jumpers/8a.png"),
					gender: "f",
				},
			],
		},
		{
			group: "legwear",
			name: "Long Skirt",
			layers: [
				{
					layer: 20,
					img: img("/doll-assets/f/6.bottom/6a.png"),
					gender: "f",
				},
			],
		},
		{
			group: "shoes",
			name: "Brown shoes",
			layers: [
				{
					layer: 30,
					img: img("/doll-assets/f/5.shoes/5a.png"),
					gender: "f",
				},
			],
		},
		{
			group: "shoes",
			name: "Grey shoes",
			layers: [
				{
					layer: 30,
					img: img("/doll-assets/f/5.shoes/5c.png"),
					gender: "f",
				},
			],
		},
		{
			group: "shoes",
			name: "Sandals",
			layers: [
				{
					layer: 0,
					img: img("/doll-assets/f/0.bg/5b.bg.png"),
					gender: "f",
				},
				{
					layer: 30,
					img: img("/doll-assets/f/5.shoes/5b.png"),
					gender: "f",
				},
			],
		},
		{
			group: "socks",
			name: "White socks",
			layers: [
				{
					layer: 25,
					img: img("/doll-assets/f/4.socks/4a.png"),
					gender: "f",
				},
			],
		},
		{
			group: "socks",
			name: "Striped socks",
			layers: [
				{
					layer: 25,
					img: img("/doll-assets/f/4.socks/4b.png"),
					gender: "f",
				},
			],
		},
		{
			group: "accessories",
			name: "Cobian's glasses",
			layers: [
				{
					layer: 33,
					img: img("/doll-assets/f/9.accessories/9a.png"),
					gender: "f",
				},
			],
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
			dollsMain(false);
		});

		// Add active class
		if (groupId === currentGroup) el.classList.add("active");
		nav.appendChild(el);
	}
}

function renderOptions() {
	const wrapper = document.querySelector(".doll-options");
	wrapper.innerHTML = "";

	const assetsInGroup = dollAssets.filter(
		(asset) => asset.group === currentGroup
	);
	for (const asset of assetsInGroup) {
		// TODO: turn this into a nice template :)
		const div = document.createElement("div");
		div.classList.add("doll-option");

		// Add active class if appropriate
		if (groupSelections[asset.group]?.includes?.(asset.name))
			div.classList.add("active");

		// Add content
		div.innerHTML = `<img src="https://c.tenor.com/jQfmNt7bNyoAAAAd/squirrel.gif"><span>${asset.name}</span>`;

		// Add click event
		div.addEventListener("click", () => {
			// Depending on whether the group allows multiple or not,
			// add or remove it from the list, or set the list to be the single item
			const group = groups[asset.group];
			if (!groupSelections[asset.group]) groupSelections[asset.group] = [];

			if (group?.multiple) {
				if (groupSelections[asset.group].includes(asset.name)) {
					groupSelections[asset.group] = groupSelections[asset.group].filter(
						(a) => a !== asset.name
					);
				} else {
					groupSelections[asset.group].push(asset.name);
				}
			} else {
				if (
					groupSelections[asset.group].length === 1 &&
					groupSelections[asset.group][0] === asset.name &&
					!group?.forceOne
				)
					groupSelections[asset.group] = [];
				else groupSelections[asset.group] = [asset.name];
			}
			dollsMain(true);
		});

		wrapper.appendChild(div);
	}
}

function drawCharacter() {
	// Real canvas
	const canvas = document.querySelector(".dolls-canvas");
	canvas.width = canvas.scrollWidth * 2;
	canvas.height = canvas.scrollHeight * 2;
	render(canvas);
}

function downloadDoll() {
	// Download link canvas:
	const downloadableCanvas = document.createElement("canvas");
	const img = dollAssets[0].layers[0].img;
	downloadableCanvas.width = img.width / 2;
	downloadableCanvas.height = img.height / 2;
	render(downloadableCanvas);

	const a = document.createElement("a");
	a.href = downloadableCanvas.toDataURL();
	a.download = "Vekllei character.png";
	a.click();
}

function render(canvas) {
	const ctx = canvas.getContext("2d");

	// Find all layers for every single selected asset and sort them by their z-index
	const allLayers = Object.entries(groupSelections)
		.flatMap(([group, itemNames]) => {
			const allItems = dollAssets.filter(
				(asset) => asset.group === group && itemNames.includes(asset.name)
			);
			return allItems.flatMap((t) => t.layers);
		})
		.filter(Boolean)
		.sort((a, b) => a.layer - b.layer);

	// Draw all layers
	for (const layer of allLayers) {
		ctx.drawImage(layer.img, 0, 0, canvas.width, canvas.height);
	}
}

function dollsMain(redraw = true) {
	renderNav();
	renderOptions();
	if (redraw) drawCharacter();
}

function img(src) {
	if (imgs[src]) return imgs[src];
	const img = new Image();
	img.src = src;
	imgs[src] = img;
	img.addEventListener("load", drawCharacter);
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

window.addEventListener("load", () => {
	document.querySelector(".dolls").classList.add("loaded");
	defineAssets();
	dollsMain();
});
