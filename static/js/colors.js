window.addEventListener("load", () => {
	if(location.href.includes('/posts/') && !document.querySelector('.list-item')) {
		const img = document.querySelector("img");

		// Make sure image is finished loading
		if (img.complete) {
			getColors(img)
		} else {
			image.addEventListener("load", function () {
				getColors(image)
			});
		}
	}
});

function getColors(img) {
	var vibrant = new Vibrant(img, 10);
    var swatches = vibrant.swatches()

	const key = "Vibrant"
    setBackgroundColor(swatches[key].rgb)
}

function setBackgroundColor(rgb) {

	const bodyBg = rgba(...rgb, 0.1);
	const bg = `rgba(${rgb.join(', ')}, 0.1)`
	const gray100 = `rgba(${rgb.join(', ')}, 0.1)`
	const colorGray = `rgba(${rgb.map(v => Math.max(v, 0)).join(', ')}, 1)`

	console.log(rgba(...rgb, 0.1))

	document.body.setAttribute('style', `--bg: ${bg}; --body-background: ${bodyBg}; --gray-100: ${gray100}; --color-gray: ${colorGray}`);

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