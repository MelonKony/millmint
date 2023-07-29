/* DICTIONARY.JS // @author: Jip Frijlink // Dictionary script for millmint.net */

document.addEventListener("touchstart", function() {}, true);

let dictionary = {};

function addDictionaryTooltips() {
	document.querySelectorAll("p, .content li:not(.card), blockquote").forEach((el) => {
		if(el.closest('.page-meta')) return
		for (const phrase of Object.keys(dictionary)) {
			const m = new RegExp(`(?=^|\\s+|\\(|>|‘|“|"|\\b)(${phrase})(?=\\s+|$|\\)|<|,|\\.|"|”|’|\\b)`, "gi"); // Don't ask please

			if (el.innerHTML.match(m)) {
				el.innerHTML = el.innerHTML.replace(
					m,
					`<span class="dfn">$1${tooltip(phrase, dictionary[phrase])}</span>`
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