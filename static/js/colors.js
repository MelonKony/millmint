if(document.querySelector("[data-page-color]")) {

	// Page color override
	const rbgArray = document.querySelector("[data-page-color]").getAttribute("data-page-color").split(",").map(v => Number(v))
	setBackgroundColor(rbgArray)

} else if(location.href.includes('/posts/') && !document.querySelector('.list-item')) {
	window.addEventListener("load", () => {
		// Get story's color from image
		const img = document.querySelector("img");

		// Make sure image is finished loading
		if (img.complete) {
			getColors(img)
		} else {
			image.addEventListener("load", function () {
				getColors(image)
			});
		}

		initColorEditor()
	});
}

// Initialise the color editor used to change the main color
function initColorEditor() {

	const keyword = "coloroverride"
	const keyhistory = []

	document.addEventListener("keyup", evt => {
		keyhistory.push(evt.key.toLowerCase())

		// See if the user entered the secret keyword
		let valid = true
		for(let i = keyword.length; i > 0; i--) {
			if(keyhistory[keyhistory.length - i] !== keyword[keyword.length - i]) {
				valid = false
			}
		}

		if(valid) {
			alert("Color override editor is now shown in the top right")
			document.querySelector(".color-editor").classList.remove("hidden")
		}
	});


	// Get the color picker
	const wrapper = document.querySelector(".color-editor")

	// Method to convert hex string (from input's value) to rgb array
	function hexToRgb(hex) {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? [
		  parseInt(result[1], 16),
		  parseInt(result[2], 16),
		  parseInt(result[3], 16)
	 	] : null;
	  }

	wrapper.querySelector("input").addEventListener("input", evt => {
		const rgb = hexToRgb(evt.currentTarget.value)
		wrapper.querySelector("p").innerText = rgb.join(', ')
		if(rgb) setBackgroundColor(rgb)
	});
}

async function getColors(img, retryCount = 0) {
	try {
		const vibrant = new Vibrant(img, 11);
		const swatches = vibrant.swatches();

		const key = "Vibrant"
		setBackgroundColor(swatches[key].rgb)
	} catch(e) {
		console.log(retryCount)
		if(retryCount <= 3) {
			setTimeout(() => getColors(img, retryCount + 1), 10)
			console.log('Retrying Vibrant')
		// } else {
		//	alert('Vibrant.js is unable to provide the colors we need.')
		// }
	}

}

function setBackgroundColor(rgb) {

	// Set theme-color
	document.querySelectorAll(`[name="theme-color"]`).forEach(el => el.remove())
	const meta = document.createElement("meta");
	meta.setAttribute("name", "theme-color");
	meta.setAttribute("content", rgba(...rgb, 0.4));
	document.head.appendChild(meta);

	// Define all colors
	const bodyBg = rgba(...rgb, 0.1);
	const bg = `rgba(${rgb.join(', ')}, 0.1)`;
	const gray100 = `rgba(${rgb.join(', ')}, 0.1)`;
	const colorGray = `rgba(${rgb.map(v => Math.max(v, 0)).join(', ')}, 1)`;

	// Inject colors into DOM
	document.body.setAttribute('style', `--bg: ${bg}; --body-background: ${bodyBg}; --gray-100: ${gray100}; --color-gray: ${colorGray}`);

	// Force titles to take the color
	document.querySelectorAll("h1").forEach(title => {
		title.style.color = `rgb(${rgb.join(', ')})`
	});
}

function rgba(r, g, b, a) {
	const color = `rgba(${r}, ${g}, ${b}, ${a})`;
	const canvas = document.createElement("canvas")
	const ctx = canvas.getContext("2d");
	canvas.width = 1;
	canvas.height = 1;

	ctx.fillStyle = "white"
	ctx.fillRect(0, 0, 1, 1)

	ctx.fillStyle = color;
	ctx.fillRect(0, 0, 1, 1);

	const [r2,g2,b2] = Array.from(ctx.getImageData(0, 0, 1, 1).data).slice(0, 3)
	return `rgb(${r2}, ${g2}, ${b2})`;
}
