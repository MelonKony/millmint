const palette = ["#A74553", "#494DCB", "#8C533C", "#D99E52", "#8F9A6B"];
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
		emoji: "v",
	},
	skintone: {
		label: "Skin tone",
		emoji: "←",
		forceOne: true,
		noColor: true,
	},
	shirt: {
		label: "Shirts",
		emoji: "V",
	},
	outerwear: {
		label: "Outerwear",
		emoji: "X",
	},
	bottoms: {
		label: "Bottoms",
		emoji: "M",
	},
	top: {
		label: "Shirts",
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
		noColor: true,
	},
	accessories: {
		label: "Accessories",
		emoji: "U",
		multiple: true,
	},
	jumper: {
		label: "Jumpers",
		emoji: "T",
	},
	outfits: {
		label: "Outfits",
		emoji: "j",
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
					layer: 0,
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
			name: "Prissy shirt",
			layers: [
				{
					layer: 16,
					img: maskImg("/doll-assets/f/7.top/7b/"),
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
		if (group?.emoji) el.querySelector(".emoji").textContent = group.emoji;

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
	let hideColors = true;
	for (const assetName of groupSelections[currentGroup] || []) {
		const asset = dollAssets.find((asset) => asset.name === assetName);
		if (!asset?.noColor) hideColors = false;
	}
	if (hideColors) colorWrapper.classList.add("color-hidden");
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
	for (const assetName of groupSelections[currentGroup]) {
		setMaskColor(assetName, color);
	}

	updateColors();
}

function updateColors() {
	if (colorDebounce) clearTimeout(colorDebounce);

	colorDebounce = setTimeout(() => {
		for (const asset of dollAssets) {
			if (!asset.noColor && !groups[asset.group].noColor) {
				const color = groupColors[asset.group] || undefined;
				setMaskColor(asset.name, color);
			}
		}
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
		div.innerHTML = `<!--<img src="https://c.tenor.com/jQfmNt7bNyoAAAAd/squirrel.gif">--><span>${asset.name}</span>`;

		// Lazy loading
		div.addEventListener("mouseenter", () => {
			for (const layer of asset.layers) {
				layer.img.load();
			}
		});

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
	console.time("drawing");
	// Real canvas
	const canvas = document.querySelector(".dolls-canvas");
	canvas.width = (canvas.scrollWidth || 230) * 3;
	canvas.height = (canvas.scrollHeight || 345) * 3;
	render(canvas);
	console.timeEnd("drawing");
}

function downloadDoll() {
	// Download link canvas:
	const downloadableCanvas = document.createElement("canvas");
	const img = dollAssets[0].layers[0].img;
	downloadableCanvas.width = img.full.width / 2;
	downloadableCanvas.height = img.full.height / 2;
	render(downloadableCanvas, true);

	const a = document.createElement("a");
	a.href = downloadableCanvas.toDataURL();
	a.download = "character.png";
	a.click();
}

function getLayers() {
	const layers = Object.entries(groupSelections)
		.flatMap(([group, itemNames]) => {
			const allItems = dollAssets.filter(
				(asset) => asset.group === group && itemNames.includes(asset.name)
			);
			return allItems.flatMap((t) => t.layers);
		})
		.filter(Boolean)
		.sort((a, b) => a.layer - b.layer);

	return layers;
}

function render(canvas, fullRes = false) {
	const ctx = canvas.getContext("2d");

	// Find all layers for every single selected asset and sort them by their z-index
	const allLayers = getLayers();

	// Draw all layers
	for (const layer of allLayers) {
		ctx.drawImage(
			layer.img[fullRes ? "full" : "resized"],
			0,
			0,
			canvas.width,
			canvas.height
		);
	}
}

function loadVisibleAssets() {
	const layers = getLayers();
	for (const layer of layers) {
		layer.img.load();
	}
}

function dollsMain(redraw = true) {
	loadVisibleAssets();
	renderNav();
	renderOptions();
	if (redraw) drawCharacter();
}

function maskImg(path, color, maskName = "mask") {
	path = `${path}${path.endsWith("/") ? "" : "/"}`;
	const outline = img(`${path}outline.png`);
	const mask = maskName !== null ? img(`${path}${maskName}.png`) : outline;

	const canvasSmall = document.createElement("canvas");
	canvasSmall.width = (canvasSmall.scrollWidth || 230) * 3;
	canvasSmall.height = (canvasSmall.scrollHeight || 345) * 3;

	Promise.all([promiseify(outline.full), promiseify(mask.full)]).then(() => {
		let m = maskName !== null ? mask : undefined;
		maskImgSize(canvasSmall, color, outline, m, false);
	});

	return {
		src: path,
		full: canvasSmall,
		resized: canvasSmall,
		load() {
			outline.load();
			mask.load();
		},
		setColor(newColor) {
			console.log("C");
			if (color === newColor && color && newColor) return;

			let m = maskName !== null ? mask : undefined;
			maskImgSize(canvasSmall, newColor, outline, m, false);

			drawCharacter();
		},
	};
}

function maskImgSize(canvas, color, outline, mask, full) {
	const ctx = canvas.getContext("2d");

	if (mask) {
		ctx.drawImage(
			mask[full ? "full" : "resized"],
			0,
			0,
			canvas.width,
			canvas.height
		);
	}

	if (color) {
		// Draw desired background
		ctx.globalCompositeOperation = "source-in";
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	// Add outline
	ctx.globalCompositeOperation = "source-over";
	ctx.drawImage(
		outline[full ? "full" : "resized"],
		0,
		0,
		canvas.width,
		canvas.height
	);
}

function img(src) {
	if (imgs[src]) return imgs[src];
	const img = new Image();

	const offscreenCanvas = document.createElement("canvas");

	promiseify(img).then(() => {
		// Re-scale image on offscreen canvas for future use
		const canvas = document.querySelector(".dolls-canvas");
		const offscreenCtx = offscreenCanvas.getContext("2d");
		offscreenCanvas.width = canvas.width;
		offscreenCanvas.height = canvas.height;
		offscreenCtx.drawImage(img, 0, 0, canvas.width, canvas.height);

		// Set a debounce for re-drawing after image load
		if (redrawDebounce) clearTimeout(redrawDebounce);
		redrawDebounce = setTimeout(() => {
			// Update color on single asset
			const asset = dollAssets.find((a) =>
				a.layers.find((l) => src.startsWith(l.img.src))
			);
			const color = groupColors[asset.group] || undefined;
			setMaskColor(asset.name, color);

			drawCharacter();
		}, 100);
	});

	imgs[src] = {
		src,
		full: img,
		resized: offscreenCanvas,
		load() {
			if (!img.src) console.log("Loading", src);
			img.src = src;
		},
	};

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

window.addEventListener("beforeunload", (evt) => {
	clearCanvases(imgs);
});

function clearCanvases(imgs) {
	for (const asset of dollAssets) {
		for (const layer of asset.layers) {
			let c;
			if (layer.img.setColor) c = [layer.img.full, layer.img.resized];
			else c = [layer.img.resized];

			for (const ca of c) clearCanvas(ca);
		}
	}
	for (const key of Object.keys(imgs)) {
		clearCanvas(imgs[key].resized);
	}
}

function clearCanvas(canvas) {
	console.log(canvas)
	canvas.width = 1;
	canvas.height = 1;
	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, 1, 1);
}
