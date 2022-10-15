const dictionary = {
	Tzipora: {
		text: "Also known as Zelda",
	},
	Vekllei: {
		text: "This is a way longer piece of text bla bla bla This is a way longer piece of text bla bla bla This is a way longer piece of text bla bla bla ",
	},
};

function handleDictionary() {
	document.querySelectorAll("p, li, blockquote").forEach((el) => {
		for (const phrase of Object.keys(dictionary)) {
			const m = new RegExp(`(^|\\s+|\\(|>)(${phrase})(?=\\s+|$|\\)|<)`, "gi"); // Don't ask please
			if (el.innerHTML.match(m)) {
				el.innerHTML = el.innerHTML.replace(
					m,
					`$1<dfn>$2${tooltip(dictionary[phrase].text)}</dfn>`
				);
			}
		}
	});
}

function tooltip(text) {
	return `<div class="tooltip ${
		text.length > 100 ? "tooltip-long" : "tooltip-short"
	}">${text}</div>`;
}

window.addEventListener("load", handleDictionary);
