// MillMint search

'use strict';

{{ $searchDataFile := printf "%s.search-data.json" .Language.Lang }}
{{ $searchData := resources.Get "search-data.json" | resources.ExecuteAsTemplate $searchDataFile . }}
{{ $searchConfig := i18n "bookSearchConfig" | default "{}" }}

(function () {
  const searchDataURL = '{{ $searchData.RelPermalink }}';
  const indexConfig = Object.assign({{ $searchConfig }}, {
    preset: 'balance',
    doc: {
      id: 'id',
      field: ['title', 'content', 'logo'],
      store: ['title', 'href', 'section','content', 'logo', 'rgb', 'color', 'image']
    }
  });

  // Define a simplified setColors function for search results
  function setColors(rgb, element) {
    if (!rgb || !element) return;
    
    try {
      // Apply color to the element's text
      if (Array.isArray(rgb) && rgb.length >= 3) {
        element.style.color = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
      } else if (typeof rgb === 'string') {
        element.style.color = rgb;
      }
    } catch (e) {
      console.error('Error setting colors:', e);
    }
  }

  // Get colors from CSS variables
  function getColorsFromCSS() {
    const colors = {};
    const styles = getComputedStyle(document.documentElement);
    
    // Look for color variables like --color-labour
    for (let i = 0; i < styles.length; i++) {
      const prop = styles[i];
      if (prop.startsWith('--color-')) {
        const name = prop.replace('--color-', '');
        const value = styles.getPropertyValue(prop).trim();
        if (value) {
          colors[name] = value;
        }
      }
    }
    
    return colors;
  }

  // Initialize colors
  const colors = getColorsFromCSS();
  console.log('Available colors:', colors);

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

    // More robust FlexSearch check
    if (typeof FlexSearch === 'undefined' || !FlexSearch.Document) {
      console.error('FlexSearch or FlexSearch.Document is not available');
      setTimeout(init, 100); // Retry after a short delay
      return;
    }

    fetch(searchDataURL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(pages => {
        if (!Array.isArray(pages)) {
          throw new Error('Search data is not in the expected format');
        }
        console.log('Pages loaded:', pages.length);
        try {
          // Create the search index
          window.bookSearchIndex = new FlexSearch.Document({
            document: {
              id: 'id',
              index: ['title', 'content', 'logo'],
              store: ['title', 'href', 'section', 'content', 'logo', 'rgb', 'color', 'image']
            },
            tokenize: 'forward',
            threshold: 0,
            resolution: 9,
            depth: 3,
            preset: 'balance'
          });
          
          // Add each page individually to ensure proper indexing
          pages.forEach(page => {
            window.bookSearchIndex.add(page);
          });
          console.log('Search index created');
        } catch (error) {
          console.error('Error creating search index:', error);
          throw error;
        }
      })
      .then(() => input.required = false)
      .then(search)
      .catch(error => {
        console.error('Search initialization failed:', error);
        input.required = false;
      });
  }

  function search() {
    while (results.firstChild) {
      results.removeChild(results.firstChild);
    }

    if (!input.value) {
      results.style.display = 'none'; // Hide when input is empty
      return;
    }

    console.log('Searching for:', input.value);
    
    try {
      // Update search options for more flexible matching
      const searchResults = window.bookSearchIndex.search(input.value, { 
        limit: 20,           // Increase limit to show more results
        enrich: true,
        suggest: true,       // Enable suggestions for partial matches
        bool: 'or'           // Use OR logic for more inclusive results
      });
      
      console.log('Search results:', searchResults);
      
      // Extract the actual results
      const searchHits = [];
      if (searchResults && searchResults.length) {
        searchResults.forEach(result => {
          if (result && result.result) {
            result.result.forEach(item => {
              if (item && item.doc) {
                searchHits.push(item.doc); // Extract the document from the result
              }
            });
          }
        });
      }
      
      console.log('Processed hits:', searchHits);
      
      if (searchHits.length === 0) {
        results.style.display = 'none'; // Hide when no results
        return;
      }

      results.style.display = 'block'; // Show when we have results
      searchHits.forEach(function (page) {
        // Add null checks to prevent errors
        if (!page || typeof page !== 'object') return;
        
        const li = element('<li><a href></a><small></small><span class="found"></span></li>');
        const a = li.querySelector('a'), small = li.querySelector('small'), span = li.querySelector('span');

        // Add logo
        if(page.logo) {
          const logo = element('<img src="" class="logo visible-img">');
          logo.src = page.logo;
          a.appendChild(logo);
        }

        // Handle RGB values directly from the page data
        if(page.rgb) {
          // RGB values are stored as strings like "155, 67, 199"
          const rgb = page.rgb.split(',').map(num => parseInt(num.trim()));
          if (rgb.length >= 3) {
            setColors(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`, a);
          }
        }
        // Handle color names by looking up CSS variables
        else if(page.color) {
          const colorVar = `var(--color-${page.color})`;
          setColors(colorVar, a);
        }

        // Set texts
        a.href = page.href || '#';
        a.innerHTML += page.title || '';
        small.textContent = page.section || '';

        function clean(str) {
          return (str || '').toLowerCase();
        }

        // Try finding the input's value in the content
        const cleanedContent = clean(page.content || '')
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
    } catch (error) {
      console.error('Search error:', error);
      results.style.display = 'none';
    }
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
