const palette = ["#A74553", "#494DCB", "#8C533C", "#D99E52", "#8F9A6B"];
const dataUrls = {};
const imgs = {};
let groupColors = {};
let dollAssets = [];
let uniqueGroups = [...new Set(dollAssets.map((t) => t.group))];
let currentGroup;
let gender = "f";
let redrawDebounce;
let colorDebounce;

// Base doll
const groupSelections = {
	skintone: ["1a"],
	face: ["Zelda"],
	shoes: ["Sandals"],
	bottoms: ["Pleated skirt"],
	jumper: ["Color jumper"],
	socks: ["Folded socks"],
	top: ["Pleated shirt"],
	hair: ["Bluey"],
};

// All groups
const groups = {
	background: {
		label: "Background",
		icon: "🌲",
		noColor: true,
	},
	skintone: {
		label: "Skin tone",
		icon: "🎨",
		forceOne: true,
		noColor: true,
	},
	shirt: {
		label: "Shirts",
		icon: "V",
	},
	outerwear: {
		label: "Outerwear",
		icon: "🧥",
	},
	bottoms: {
		label: "Bottoms",
		icon: "👖",
	},
	top: {
		label: "Shirts",
		icon: "👚",
	},
	socks: {
		label: "Socks",
		icon: "🧦",
	},
	shoes: {
		label: "Shoes",
		icon: "👞",
	},
	hair: {
		label: "Hair",
		icon: "✂️",
	},
	face: {
		label: "Face",
		icon: "☺️",
		forceOne: true,
		noColor: true,
	},
	accessories: {
		label: "Accessories",
		icon: "👒",
		multiple: true,
	},
	jumper: {
		label: "Jumpers",
		icon: "🧣",
	},
	outfits: {
		label: "Outfits",
		icon: "👗",
	},
};

function defineAssets() {
	dollAssets = [
		{
			group: "background",
			name: "Beach",
			layers: [
				{
					layer: 1,
					img: img("/doll-assets/bg/beach.jpg"),
				},
			],
		},
		{
			group: "background",
			name: "Country",
			layers: [
				{
					layer: 1,
					img: img("/doll-assets/bg/country.jpg"),
				},
			],
		},
		{
			group: "skintone",
			name: "1a",
			layers: [
				{
					layer: 10,
					img: maskImg("/doll-assets/f/1.figure/1a/"),
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
					img: maskImg("/doll-assets/f/1.figure/1b/"),
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
					img: maskImg("/doll-assets/f/1.figure/1c/"),
					gender: "f",
				},
			],
		},
		{
			group: "face",
			name: "Zelda",
			layers: [
				{
					layer: 11,
					img: maskImg("/doll-assets/f/2.face/2a/"),
					gender: "f",
				},
			],
		},
		{
			group: "face",
			name: "Cobian",
			layers: [
				{
					layer: 11,
					img: maskImg("/doll-assets/f/2.face/2b/"),
					gender: "f",
				},
			],
		},
		{
			group: "face",
			name: "Mora",
			layers: [
				{
					layer: 11,
					img: maskImg("/doll-assets/f/2.face/2c/"),
					gender: "f",
				},
			],
		},
		{
			group: "face",
			name: "Tzafi",
			layers: [
				{
					layer: 11,
					img: maskImg("/doll-assets/f/2.face/2d/"),
					gender: "f",
				},
			],
		},
		{
			group: "face",
			name: "Gemma",
			layers: [
				{
					layer: 11,
					img: maskImg("/doll-assets/f/2.face/2e/"),
					gender: "f",
				},
			],
		},
		{
			group: "face",
			name: "Vo",
			layers: [
				{
					layer: 11,
					img: maskImg("/doll-assets/f/2.face/2f/"),
					gender: "f",
				},
			],
		},
		{
			group: "face",
			name: "Zhi",
			layers: [
				{
					layer: 11,
					img: maskImg("/doll-assets/f/2.face/2g/"),
					gender: "f",
				},
			],
		},
		{
			group: "hair",
			name: "Bluey",
			layers: [
				{
					layer: 12,
					img: maskImg("/doll-assets/f/3.hair/3a/"),
					gender: "f",
				},
			],
		},
		{
			group: "hair",
			name: "Prim",
			layers: [
				{
					layer: 12,
					img: maskImg("/doll-assets/f/3.hair/3b/"),
					gender: "f",
				},
			],
		},
		{
			group: "hair",
			name: "Curly",
			layers: [
				{
					layer: 12,
					img: maskImg("/doll-assets/f/3.hair/3c/"),
					gender: "f",
				},
			],
		},
		{
			group: "hair",
			name: "Braids",
			layers: [
				{
					layer: 12,
					img: maskImg("/doll-assets/f/3.hair/3d/"),
					gender: "f",
				},
			],
		},
		{
			group: "hair",
			name: "Clipped",
			layers: [
				{
					layer: 12,
					img: maskImg("/doll-assets/f/3.hair/3e/"),
					gender: "f",
				},
			],
		},
		{
			group: "hair",
			name: "Alternative",
			layers: [
				{
					layer: 12,
					img: maskImg("/doll-assets/f/3.hair/3f/"),
					gender: "f",
				},
			],
		},
		{
			group: "hair",
			name: "Locks",
			layers: [
				{
					layer: 12,
					img: maskImg("/doll-assets/f/3.hair/3g/"),
					gender: "f",
				},
			],
		},
		{
			group: "hair",
			name: "Princeling",
			layers: [
				{
					layer: 12,
					img: maskImg("/doll-assets/f/3.hair/3h/"),
					gender: "f",
				},
			],
		},
		{
			group: "socks",
			name: "Folded socks",
			layers: [
				{
					layer: 13,
					img: maskImg("/doll-assets/f/4.socks/4a/"),
					gender: "f",
				},
			],
		},
		{
			group: "socks",
			name: "Athletic socks",
			layers: [
				{
					layer: 13,
					img: maskImg("/doll-assets/f/4.socks/4b/"),
					gender: "f",
				},
			],
		},
		{
			group: "socks",
			name: "Everyday socks",
			layers: [
				{
					layer: 13,
					img: maskImg("/doll-assets/f/4.socks/4c/"),
					gender: "f",
				},
			],
		},
		{
			group: "socks",
			name: "Knee Socks",
			layers: [
				{
					layer: 13,
					img: maskImg("/doll-assets/f/4.socks/4d/"),
					gender: "f",
				},
			],
		},
		{
			group: "socks",
			name: "Nylon Socks",
			layers: [
				{
					layer: 13,
					img: maskImg("/doll-assets/f/4.socks/4e/"),
					gender: "f",
				},
			],
		},
		{
			group: "socks",
			name: "Nylons",
			layers: [
				{
					layer: 13,
					img: maskImg("/doll-assets/f/4.socks/4f/"),
					gender: "f",
				},
			],
		},
		{
			group: "shoes",
			name: "Penny loafers",
			layers: [
				{
					layer: 14,
					img: maskImg("/doll-assets/f/5.shoes/5a/"),
					gender: "f",
				},
			],
		},
		{
			group: "shoes",
			name: "Sandals",
			layers: [
				{
					layer: 2,
					img: img("/doll-assets/f/0.bg/mask.5b.bg.png"),
					gender: "f",
				},
				{
					layer: 14,
					img: maskImg("/doll-assets/f/5.shoes/5b/"),
					gender: "f",
				},
			],
		},
		{
			group: "shoes",
			name: "Strap shoes",
			layers: [
				{
					layer: 14,
					img: maskImg("/doll-assets/f/5.shoes/5c/"),
					gender: "f",
				},
			],
		},
		{
			group: "shoes",
			name: "Trainers",
			layers: [
				{
					layer: 14,
					img: maskImg("/doll-assets/f/5.shoes/5d/"),
					gender: "f",
				},
			],
		},
		{
			group: "shoes",
			name: "School Shoes",
			layers: [
				{
					layer: 14,
					img: maskImg("/doll-assets/f/5.shoes/5e/"),
					gender: "f",
				},
			],
		},
		{
			group: "shoes",
			name: "Nurse Shoes",
			layers: [
				{
					layer: 14,
					img: maskImg("/doll-assets/f/5.shoes/5f/"),
					gender: "f",
				},
			],
		},
		{
			group: "bottoms",
			name: "Pleated skirt",
			layers: [
				{
					layer: 15,
					img: maskImg("/doll-assets/f/6.bottom/6a/"),
					gender: "f",
				},
			],
		},
		{
			group: "bottoms",
			name: "Trousers",
			layers: [
				{
					layer: 15,
					img: maskImg("/doll-assets/f/6.bottom/6b/"),
					gender: "f",
				},
			],
		},
		{
			group: "bottoms",
			name: "Pencil skirt",
			layers: [
				{
					layer: 15,
					img: maskImg("/doll-assets/f/6.bottom/6c/"),
					gender: "f",
				},
			],
		},
		{
			group: "bottoms",
			name: "Shorts",
			layers: [
				{
					layer: 15,
					img: maskImg("/doll-assets/f/6.bottom/6d/"),
					gender: "f",
				},
			],
		},
		{
			group: "bottoms",
			name: "Short Trousers",
			layers: [
				{
					layer: 15,
					img: maskImg("/doll-assets/f/6.bottom/6e/"),
					gender: "f",
				},
			],
		},
		{
			group: "bottoms",
			name: "Rouisha Pants",
			layers: [
				{
					layer: 15,
					img: maskImg("/doll-assets/f/6.bottom/6f/"),
					gender: "f",
				},
			],
		},
		{
			group: "top",
			name: "Pleated shirt",
			layers: [
				{
					layer: 16,
					img: maskImg("/doll-assets/f/7.top/7a/"),
					gender: "f",
				},
			],
		},
		{
			group: "top",
			name: "Prissy Shirt",
			layers: [
				{
					layer: 16,
					img: maskImg("/doll-assets/f/7.top/7b/"),
					gender: "f",
				},
			],
		},
		{
			group: "top",
			name: "Tee Shirt",
			layers: [
				{
					layer: 16,
					img: maskImg("/doll-assets/f/7.top/7c/"),
					gender: "f",
				},
			],
		},
		{
			group: "top",
			name: "Hanfu shirt",
			layers: [
				{
					layer: 16,
					img: maskImg("/doll-assets/f/7.top/7d/"),
					gender: "f",
				},
			],
		},
		{
			group: "outfits",
			name: "Gymslip",
			layers: [
				{
					layer: 20,
					img: maskImg("/doll-assets/f/8.outfits/8a/"),
					gender: "f",
				},
			],
		},
		{
			group: "outfits",
			name: "Nurse Uniform",
			layers: [
				{
					layer: 20,
					img: maskImg("/doll-assets/f/8.outfits/8b/", undefined, "maska"),
					gender: "f",
				},
				{
					layer: 20,
					img: maskImg("/doll-assets/f/8.outfits/8b/", undefined, "maskb"),
					gender: "f",
				},
			],
		},
		{
			group: "jumper",
			name: "Jumper",
			layers: [
				{
					layer: 21,
					img: maskImg("/doll-assets/f/9.jumpers/9a/"),
					gender: "f",
				},
			],
		},
		{
			group: "jumper",
			name: "Revolutionary Coat",
			layers: [
				{
					layer: 21,
					img: maskImg("/doll-assets/f/9.jumpers/9b/"),
					gender: "f",
				},
			],
		},
		{
			group: "accessories",
			name: "Spectacles",
			noColor: true,
			layers: [
				{
					layer: 22,
					img: maskImg("/doll-assets/f/10.accessories/10a/", undefined, null),
					gender: "f",
				},
			],
		},
		{
			group: "accessories",
			name: "School Armband",
			noColor: true,
			layers: [
				{
					layer: 22,
					img: maskImg("/doll-assets/f/10.accessories/10b/"),
					gender: "f",
				},
			],
		},
		{
			group: "accessories",
			name: "School Beret",
			layers: [
				{
					layer: 22,
					img: maskImg("/doll-assets/f/10.accessories/10c/"),
					gender: "f",
				},
			],
		},
		{
			group: "accessories",
			name: "School Tie",
			layers: [
				{
					layer: 17,
					img: maskImg("/doll-assets/f/10.accessories/10d/"),
					gender: "f",
				},
			],
		},
		{
			group: "accessories",
			name: "Red Tie",
			layers: [
				{
					layer: 17,
					img: maskImg("/doll-assets/f/10.accessories/10e/"),
					gender: "f",
				},
			],
		},
		{
			group: "accessories",
			name: "Girls' Tie",
			layers: [
				{
					layer: 17,
					img: maskImg("/doll-assets/f/10.accessories/10f/"),
					gender: "f",
				},
			],
		},
		{
			group: "accessories",
			name: "School Badge",
			layers: [
				{
					layer: 17,
					img: maskImg("/doll-assets/f/10.accessories/10g/"),
					gender: "f",
				},
			],
		},
		{
			group: "accessories",
			name: "Red Guard Hat",
			layers: [
				{
					layer: 17,
					img: maskImg("/doll-assets/f/10.accessories/10h/"),
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
	nav.querySelector(".nav-inner").innerHTML = "";

	for (const groupName of uniqueGroups) {
		// Create new node
		const el = document
			.importNode(
				document.querySelector(".dolls-nav-item-template").content,
				true
			)
			.querySelector("*");

		// Provide labels
		const group = groups[groupName];

		el.querySelector(".text").textContent = group?.label ?? groupId;
		if (group?.icon) el.querySelector(".icon").textContent = group.icon;

		// Add event listeners
		el.addEventListener("click", () => {
			currentGroup = groupName;
			dollsMain();
		});

		// Add active class
		if (groupName === currentGroup) el.classList.add("active");
		nav.querySelector(".nav-inner").appendChild(el);
	}

	// Set tab title
	document.querySelector(".current-page").innerText =
		groups[currentGroup]?.label ?? currentGroup;

	// Determine active states for next/previous buttons
	const currentIndex = uniqueGroups.indexOf(currentGroup);
	document
		.querySelector(".nav-nav-button.nav-previous")
		.classList[currentIndex > 0 ? "remove" : "add"]("disabled");
	document
		.querySelector(".nav-nav-button.nav-next")
		.classList[currentIndex < uniqueGroups.length - 1 ? "remove" : "add"](
			"disabled"
		);

	// Draw colors
	const colorWrapper = document.querySelector(".color-options");
	colorWrapper.classList.remove("color-hidden");
	colorWrapper
		.querySelectorAll(".color-circle[style]")
		.forEach((el) => el.remove());
	document.querySelector(".reset-circle").classList.remove("active");

	// Add a circle for each color
	for (const color of palette) {
		const circle = document.createElement("div");
		circle.classList.add("color-circle");
		circle.setAttribute("style", `--color: ${color}`);

		circle.addEventListener("click", () => {
			setColor(color);
		});

		if (groupColors[currentGroup] === color) {
			circle.classList.add("active");
		}

		colorWrapper.appendChild(circle);
	}

	// Add it to the reset button if there isn't an active color
	if (!colorWrapper.querySelector(".active"))
		document.querySelector(".reset-circle").classList.add("active");

	// Check if the color editor should be visible
	if (groups[currentGroup]?.noColor) colorWrapper.classList.add("color-hidden");
}

function nextNav() {
	let newIndex = uniqueGroups.indexOf(currentGroup) + 1;
	if (uniqueGroups[newIndex]) {
		currentGroup = uniqueGroups[newIndex];
		dollsMain();
	}
}

function previousNav() {
	let newIndex = uniqueGroups.indexOf(currentGroup) - 1;
	if (uniqueGroups[newIndex]) {
		currentGroup = uniqueGroups[newIndex];
		dollsMain();
	}
}

function setColor(color) {
	groupColors[currentGroup] = color;
	if (color === null) delete groupColors[currentGroup];
	renderNav();

	// Update visible components
	if (groupSelections[currentGroup]) {
		for (const assetName of groupSelections[currentGroup]) {
			setMaskColor(assetName, color);
		}
	}

	updateColors();
}

function updateColors() {
	if (colorDebounce) clearTimeout(colorDebounce);

	colorDebounce = setTimeout(() => {
		for (const asset of dollAssets) {
			const color = groupColors[asset.group] || undefined;
			setMaskColor(asset.name, color);
		}
		drawCharacter();
	}, 100);
}

function setMaskColor(name = "Color jumper", newColor, layer = 0) {
	const item = dollAssets.find((a) => a.name === name);
	if (item) item.layers[layer]?.img?.setColor?.(newColor);
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
		div.innerText = asset.name;

		// Add click event
		div.addEventListener("click", () => {
			// Depending on whether the group allows multiple or not,
			// add or remove it from the list, or set the list to be the single item
			const group = groups[asset.group];
			if (!groupSelections[asset.group]) groupSelections[asset.group] = [];

			// TODO: clean this up
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
	render();
}

function downloadDoll() {
	render();

	const downloadText = document.querySelector(".download-link .text");
	downloadText.innerText = "Downloading...";

	// Make "canvas" super wide, download image
	// document.querySelector(".dolls-canvas").style.width = "1000px";
	requestAnimationFrame(() => {
		const node = document.querySelector(".dolls-canvas-inner");
		const desiredWidth = 1000;
		const scale = desiredWidth / node.clientWidth;

		domtoimage
			.toPng(node, {
				width: node.clientWidth * scale,
				height: node.clientHeight * scale,
				style: {
					transform: "scale(" + scale + ")",
					transformOrigin: "top left",
				},
			})
			.then((dataUrl) => {
				// Download imnage
				const a = document.createElement("a");
				a.href = dataUrl;
				a.download = "character.png";
				a.click();

				// Reset button label
				downloadText.innerText = "Download Image";
			});

		// html2canvas(document.querySelector(".dolls-canvas-inner"), {
		// 	backgroundColor: null,
		// }).then((canvas) => {
		// 	// Download imnage
		// 	const a = document.createElement("a");
		// 	a.href = canvas.toDataURL();
		// 	a.download = "character.png";
		// 	a.click();

		// 	// Reset button label
		// 	downloadText.innerText = "Download Image";
		// });
		document.querySelector(".dolls-canvas").removeAttribute("style");
	});
}

function getLayers() {
	const layers = Object.entries(groupSelections)
		.flatMap(([group, itemNames]) => {
			const allItems = dollAssets.filter(
				(asset) => asset.group === group && itemNames.includes(asset.name)
			);
			return allItems.flatMap((t) =>
				t.layers.map((layer) => {
					return {
						...layer,
						...t,
						layers: undefined,
					};
				})
			);
		})
		.filter(Boolean)
		.sort((a, b) => a.layer - b.layer);

	return layers;
}

function render() {
	// Find all layers for every single selected asset and sort them by their z-index
	const allLayers = getLayers();

	// Clear "canvas"
	const wrapper = document.querySelector(".dolls-canvas-inner");
	wrapper.innerHTML = "";

	// Draw all layers
	for (const asset of allLayers) {
		const layer = document.createElement("div");
		layer.classList.add("layer");

		const layers = asset.img.layers ? asset.img.layers : [asset.img];

		for (const img of layers) {
			if (groupColors[asset.group] && !img.noColor) {
				const d = document.createElement("div");
				d.classList.add("mask");

				// Convert mask image to data url
				const dataUrl = getDataUrl(img);

				// Define the URL and mask in general
				d.setAttribute(
					"style",
					`
					--url: url('${dataUrl}');
					background: ${asset.img.mask};
				`
				);

				layer.appendChild(d);
			} else {
				layer.appendChild(img);
			}
		}

		// console.log(layer, asset);
		wrapper.appendChild(layer);
	}
}

function getDataUrl(img) {
	if (dataUrls[img.src]) return dataUrls[img.src];
	// Get data URL from image
	const canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;

	const ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);

	const dataUrl = canvas.toDataURL();
	console.log("AAA");
	dataUrls[img.src] = dataUrl;

	// Clean up canvas
	canvas.width = 1;
	canvas.height = 1;
	ctx.clearRect(0, 0, 1, 1);

	return dataUrl;
}

function dollsMain(redraw = true) {
	renderNav();
	renderOptions();
	if (redraw) drawCharacter();
}

function maskImg(path, mask, maskName = "mask") {
	path = `${path}${path.endsWith("/") ? "" : "/"}`;

	const layers = [];
	if (maskName) layers.push(img(`${path}${maskName}.png`, false));
	layers.push(img(`${path}outline.png`));

	return {
		layers,
		mask,
		setColor(t) {
			this.mask = t;
		},
	};
}

function img(src, noColor = true) {
	if (imgs[src]) return imgs[src];
	const img = new Image();
	img.src = src;
	img.setAttribute("no-color", noColor);
	img.noColor = noColor;

	imgs[src] = img;

	return imgs[src];
}

function promiseify(img) {
	return new Promise((resolve) => {
		if (img.complete && img.src) resolve(img);
		img.addEventListener("load", () => {
			resolve(img);
		});
	});
}

window.addEventListener("load", () => {
	defineAssets();
	dollsMain();
});
