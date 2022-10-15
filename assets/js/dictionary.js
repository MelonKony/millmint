let dictionary = {};

function addDictionaryTooltips() {
	document.querySelectorAll("p, li, blockquote").forEach((el) => {
		
		for (const phrase of Object.keys(dictionary)) {
			const m = new RegExp(`(^|\\s+|\\(|>|“|")(${phrase})(?=\\s+|$|\\)|<|,|"|”)`, "gi"); // Don't ask please

			if (el.innerHTML.match(m)) {
				el.innerHTML = el.innerHTML.replace(
					m,
					`$1<dfn>$2${tooltip(phrase, dictionary[phrase])}</dfn>`
				);
			}
		}

	});
}

function tooltip(title, text) {
	return `<div class="tooltip ${
		text.length > 40 ? "tooltip-long" : "tooltip-short"
	}">
		<h4>${title}</h4>
		<p>${text}</p>
	</div>`;
}

async function initDictionary() {
	const dictionaryTxt = await fetch("/dictionary.txt").then((d) => d.text());
	const dictArr = dictionaryTxt.split("\n").filter((t) => t && t.includes(":"));

	for (const entry of dictArr) {
		const [phrase, definition] = entry.split(":").map((v) => v.trim());
		dictionary[phrase] = definition;
	}

	console.log(dictionary);

	addDictionaryTooltips();
}

window.addEventListener("load", initDictionary);
