let dictionary = {};

function addDictionaryTooltips() {
	document.querySelectorAll("p, li, blockquote").forEach((el) => {
		
		for (const phrase of Object.keys(dictionary)) {
			const m = new RegExp(`(^|\\s+|\\(|>|“|")(${phrase})(?=\\s+|$|\\)|<|,|"|”)`, "gi"); // Don't ask please

			if (el.innerHTML.match(m)) {
				el.innerHTML = el.innerHTML.replace(
					m,
					`$1<span class="dfn">$2${tooltip(phrase, dictionary[phrase])}</span>`
				);
			}
		}

	});
}

function tooltip(title, text) {
	return `<span class="tooltip ${
		text.length > 40 ? "tooltip-long" : "tooltip-short"
	}">
		<span class="title">${title}</span>
		<span class="description">${text}</span>
	</span>`;
}

async function initDictionary() {
	const dictionaryTxt = await fetch("/dictionary.txt").then((d) => d.text());
	const dictArr = dictionaryTxt.split("\n").filter((t) => t && t.includes(":"));

	for (const entry of dictArr) {
		const [phrases, definition] = entry.split(":").map((v) => v.trim());
		for(const phrase of phrases.split(", ").map(t => t.trim())) {
			dictionary[phrase] = definition;
		}
	}

	console.log(dictionary);

	addDictionaryTooltips();
}

window.addEventListener("load", initDictionary);
