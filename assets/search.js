// MillMint search

'use strict';

{{ $searchDataFile := printf "%s.search-data.json" .Language.Lang }}
{{ $searchData := resources.Get "search-data.json" | resources.ExecuteAsTemplate $searchDataFile . | resources.Minify | resources.Fingerprint }}
{{ $searchConfig := i18n "bookSearchConfig" | default "{}" }}

(function () {
  const searchDataURL = '{{ $searchData.RelPermalink }}';
  const indexConfig = Object.assign({{ $searchConfig }}, {
    doc: {
      id: 'id',
      field: ['title', 'content', 'logo'],
      store: ['title', 'href', 'section','content', 'logo', 'rgb', 'color']
    }
  });

  const input = document.querySelector('#search-input');
  const results = document.querySelector('#search-results');

  if (!input) {
    return
  }

  input.addEventListener('focus', init);
  input.addEventListener('keyup', search);

  document.addEventListener('keypress', focusSearchFieldOnKeyPress);

  /**
   * @param {Event} event
   */
  function focusSearchFieldOnKeyPress(event) {
    // exit if input is already focused
    if (input === document.activeElement) {
      return;
    }

    // exit if user is already focused on an input (like typing a comment)
    if (inputIsFocused()) {
      return;
    }

    // exit if keypress is not a hotkey
    const characterPressed = String.fromCharCode(event.charCode);
    if (!isHotkey(characterPressed)) {
      return;
    }

    // focus searchbox and prevent hotkey key from being typed
    input.focus();
    event.preventDefault();
  }

  function init() {
    input.removeEventListener('focus', init); // init once
    input.required = true;

    fetch(searchDataURL)
      .then(pages => pages.json())
      .then(pages => {
        window.bookSearchIndex = FlexSearch.create('balance', indexConfig);
        window.bookSearchIndex.add(pages);
      })
      .then(() => input.required = false)
      .then(search);
  }

  function search() {
    while (results.firstChild) {
      results.removeChild(results.firstChild);
    }

    if (!input.value) {
      return;
    }

    const searchHits = window.bookSearchIndex.search(input.value, 10)
    searchHits.forEach(function (page) {
      const li = element('<li><a href></a><small></small><span class="found"></span></li>');
      const a = li.querySelector('a'), small = li.querySelector('small'), span = li.querySelector('span');

      // Add logo
      if(page.logo) {
        const logo = element('<img src="" class="logo visible-img">');
        logo.src = page.logo;
        a.appendChild(logo);
      }

      // Add colors
      if(page.rgb) {
        const rgb = page.rgb.split(',');
        setColors(rgb, false, li)
      }

      if(page.color && colors[page.color]) {
        setColors(colors[page.color], false, li)
      }

      // Set texts
      a.href = page.href;
      a.innerHTML += page.title;
      small.textContent = page.section;

      function clean(str) {
        return str.toLowerCase()
      }

      // Try finding the input's value in the content
      const cleanedContent = clean(page.content)
      const cleanedQuery = clean(input.value)

      if (cleanedContent.includes(cleanedQuery)) {
        const index = cleanedContent.indexOf(cleanedQuery)

        // Get 20 characters before the word and 30 characters after the word
        // That way it looks better and provides context. These numbers can be tweaked
        const startIndex = Math.max(index - 20, 0) // Make sure we don't go before the beginning of the string
        const endIndex = Math.min(index + input.value.length + 30, cleanedContent.length) // Make sure we don't go past the end of the string

        // Find the relevant text and make it a bit prettier by removing the letters at the start and end
        const relevantText = page.content
          .slice(startIndex, endIndex) // Get some text around the search term
          .split(' ') // Split it into words
          // Remove "non-words" (words that might just be part of a word, or dots, or whatever)
          // Also take account of the indices so we don't remove the first or last word if the match starts or ends there
          .slice(startIndex > 0 ? 1 : 0, endIndex < page.content.length - 30 ? -1 : undefined)
          .join(' ') // Rejoin the words

        span.innerHTML = relevantText.replace(new RegExp(cleanedQuery, 'gi'), '<mark>$&</mark>') + '...';
      }

      results.appendChild(li);
    });
  }

  /**
   * @param {String} content
   * @returns {Node}
   */
  function element(content) {
    const div = document.createElement('div');
    div.innerHTML = content;
    return div.firstChild;
  }

  /**
   * check if any input or textarea if focused on the page
   */
  function inputIsFocused() {
    return document.activeElement instanceof HTMLInputElement
      || document.activeElement instanceof HTMLTextAreaElement;
  }
})();
