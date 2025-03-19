/* COLORS.JS // @author: Jip Frijlink // Script that themes articles with colour */

// Add color parser helper
function parseColor(color) {
  // Add null check
  if (!color) return null;
  
  if (Array.isArray(color)) return color;
  
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b];
  }
  
  // Handle space/comma-separated RGB
  if (typeof color === 'string') {
    return color.split(/[\s,]+/).map(v => parseInt(v));
  }
  
  return color;
}

// Use CSS custom properties for colors
function getCSSColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`);
}

// Helper function to get CSS color variable and convert to RGB array
function getCSSColorAsRGB(name) {
  const color = getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`).trim();
  return parseColor(color);
}

// Initialize colors object dynamically from CSS variables
function initializeColors() {
  const colors = {};
  
  const styles = getComputedStyle(document.documentElement);
  const cssVars = Array.from(styles).filter(prop => prop.startsWith('--color-'));
  
  cssVars.forEach(prop => {
    const name = prop.replace('--color-', '');
    const value = styles.getPropertyValue(prop).trim();
    if (value) {
      colors[name] = parseColor(value);
    }
  });
  
  window._colors = colors;
  console.log('Initialized colors:', colors);
  return colors;
}

// Add this new function to ensure colors are loaded
function ensureColorsLoaded() {
  if (!window._colors) {
    window._colors = initializeColors();
  }
  return window._colors;
}

// Modify colorsMain to use ensureColorsLoaded
function colorsMain() {
    const currentColors = ensureColorsLoaded();
    console.log('Available colors:', currentColors); // Debug log
    
    window._currentColorSource = window._currentColorSource || {};

    if(document.querySelector('[data-color]')) {
        const color = document.querySelector("[data-color]").getAttribute("data-color");
        const rgbArray = currentColors[color];
        console.log('Attempting to use color:', color, 'Value:', rgbArray); // Debug log
        if(!rgbArray) {
            console.error('Color not found:', color);
            return;
        }
        window._currentColorSource.rgb = rgbArray;
        setColors(rgbArray, false);
    } else if (document.querySelector("[data-page-color]")) {
        const rgbArray = document
            .querySelector("[data-page-color]")
            .getAttribute("data-page-color")
            .split(",")
            .map((v) => Number(v));
        window._currentColorSource.rgb = rgbArray;
        setColors(rgbArray);
    } else if (
        location.href.includes("/stories/") &&
        !document.querySelector(".list-item")
    ) {
        const img = document.querySelector(".page img");
        window._currentColorSource.img = img;

        if (img.complete) {
            getColors(img);
        } else {
            img.addEventListener("load", () => {
                getColors(img);
            });
        }
    } else if (window._currentColorSource.rgb) {
        // Reuse existing colors if available
        setColors(window._currentColorSource.rgb);
    } else {
        // Use default "millmint" color when no other color is specified
        const defaultColor = currentColors["millmint"];
        if (defaultColor) {
            console.log('Using default millmint color:', defaultColor);
            window._currentColorSource.rgb = defaultColor;
            setColors(defaultColor);
        } else {
            // Fallback to a hardcoded millmint color if not found in CSS variables
            // This is useful for Hugo sites where CSS variables might be processed differently
            const fallbackMillmint = [0, 123, 255]; // Example blue color - replace with your brand color
            console.log('Using fallback millmint color:', fallbackMillmint);
            window._currentColorSource.rgb = fallbackMillmint;
            setColors(fallbackMillmint);
        }
    }
}

// Add system theme change listener to reapply colors
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.theme === 'auto') {
        colorsMain(); // Reapply colors with current source
    }
});

console.log(localStorage.theme)

if (localStorage.theme === 'light' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches)) {
  window.addEventListener("load", () => {
    updatePostGrid()
  });

  function updatePostGrid() {
    if (document.querySelector(".postcard-grid")) {
      document.querySelectorAll("ul.postcard-grid > li").forEach((card) => {
        const img = card.querySelector("img");

        function setCardBackground(rgb) {
          const bodyBg = rgba(...rgb, 0.08);
          const bodyDarker = rgba(...rgb, 0.2);

          const styles = `${card.getAttribute("style")}; --card-bg: ${bodyBg}; --card-darker: ${bodyDarker}`;
          card.setAttribute("style", styles);
          card.classList.add("has-color");
        }

        // Make sure image is finished loading
        if (card.querySelector("[data-card-color]")) {
          const rgbArray = card
            .querySelector("[data-card-color]")
            .getAttribute("data-card-color")
            .split(",")
            .map((v) => Number(v));
          setCardBackground(rgbArray);
        } else {
          if (img.complete) {
            getColors(img, 0, setCardBackground);
          } else {
            img.addEventListener("load", function () {
              getColors(img, 0, setCardBackground);
            });
          }
        }
      });
    }
  }
}

async function getColors(img, retryCount = 0, callback = setColors) {
  try {
    img.crossOrigin = 'anonymous';
    const vibrant = new Vibrant(img, 11);
    const swatches = vibrant.swatches();

    const key = "Vibrant";
    if (!swatches[key]) {
      console.error("No Vibrant color found");
      return;
    }
    const rgb = swatches[key].rgb;

    if (callback) callback(rgb);
    return rgb;
  } catch (e) {
    console.log(retryCount, img, e);
    if (retryCount <= 3) {
      setTimeout(() => getColors(img, retryCount + 1, callback), 30);
      console.log("Retrying Vibrant");
    }
  }
}


function setColors(color, doBackground = true, el = document.body) {
  const rgb = parseColor(color);
  
  if (!rgb || rgb.length !== 3) {
    console.error("Invalid color value:", color);
    return;
  }

  // Set theme-color
  document
    .querySelectorAll(`[name="theme-color"]`)
    .forEach((el) => el.remove());
  const meta = document.createElement("meta");
  meta.setAttribute("name", "theme-color");
  meta.setAttribute("content", rgba(...rgb, 0.4));
  document.head.appendChild(meta);

  // Check if we should use dark mode - either explicit dark theme or auto with system dark preference
  const shouldUseDarkMode =
    localStorage.theme === "dark" ||
    (localStorage.theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches) ||
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);

  if (shouldUseDarkMode) {
    // Define all dark colors
    const bodyBg = rgba(...rgb.map(v => Math.floor(v * 0.07)), 1);
    const darkerText = rgba(161, 161, 166, 1);
    const titleText = rgba(...rgb, 0.25, "black");
    const bg = rgba(...rgb.map(v => Math.floor(v * 0.05)), 1);
    const gray100 = `rgba(${rgb.join(", ")}, 0.08)`;
    const highlight = `rgba(${rgb.map((v) => Math.max(v, 0)).join(", ")}, 1)`;
    const highlightBackground = `rgba(${rgb.join(", ")}, 0.08)`;
    const colorGray = `rgba(${rgb.map((v) => Math.max(v, 0)).join(", ")}, 1)`;
    const darkerColor = `rgba(${rgb.map((v) => Math.max(v - 100, 0)).join(", ")}, 1)`;

    const classes = [
      `--title-text: ${titleText}`,
      `--highlight: ${highlight}`,
      `--highlight-background: ${highlightBackground}`,
      `--darker-text: ${darkerText}`,
      `a: ${colorGray}`,
      `--color-gray: ${colorGray}`,
      `--color-text: ${colorGray}`,
      `--body-background: ${bodyBg}`,
      `--bg-alt: ${bg}`,
    ];
    if (doBackground) {
      classes.push(
        `--bg: ${bg}`,
        `background-color: ${bg}`,
        `--color-placeholder: var(--color-gray)`
      );
    }
    classes.push(doBackground ? `--logo-color: var(--color-gray)` : `--logo-color: ${darkerColor}`);

    // Inject colors into DOM
    el.setAttribute("style", classes.join(";"));
  } else {
    // Define all colors for light mode
    const bodyBg = rgba(...rgb, 0.08);
    const darkerText = rgba(...rgb, 0.35, "black");
    const titleText = rgba(...rgb, 0.25, "black");
    const bg = `rgba(${rgb.join(", ")}, 0.08)`;
    const gray100 = `rgba(${rgb.join(", ")}, 0.08)`;
    const highlight = `rgba(${rgb.map((v) => Math.max(v, 0)).join(", ")}, 1)`;
    const highlightBackground = `rgba(${rgb.join(", ")}, 0.08)`;
    const colorGray = `rgba(${rgb.map((v) => Math.max(v, 0)).join(", ")}, 1)`;
    const darkerColor = `rgba(${rgb.map((v) => Math.max(v - 100, 0)).join(", ")}, 1)`;

    const classes = [
      `--title-text: ${titleText}`,
      `--highlight: ${highlight}`,
      `--highlight-background: ${highlightBackground}`,
      `--darker-text: ${darkerText}`,
      `a: ${colorGray}`,
      `--color-gray: ${colorGray}`,
      `--color-text: ${colorGray}`,
      `--body-background: ${bodyBg}`,
      `--bg-alt: ${bg}`,
    ];
    
    if (doBackground) {
      classes.push(
        `--bg: ${bg}`,
        `background-color: ${bg}`,
        `--color-placeholder: var(--color-gray)`
      );
    }
    classes.push(doBackground ? `--logo-color: var(--color-gray)` : `--logo-color: ${darkerColor}`);

    // Inject colors into DOM
    el.setAttribute("style", classes.join(";"));
  }
}

function rgba(r, g, b, a, base = "white") {
  const color = `rgba(${r}, ${g}, ${b}, ${a})`;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 1;
  canvas.height = 1;

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 1, 1);

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);

  const [r2, g2, b2] = Array.from(ctx.getImageData(0, 0, 1, 1).data).slice(
    0,
    3
  );
  return `rgb(${r2}, ${g2}, ${b2})`;
}

// Add this to ensure colors are initialized when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeColors();
    colorsMain();
});