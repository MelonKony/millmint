/* COLORS.JS // @author: Jip Frijlink // Script that themes articles with colour */

// Add color parser helper
function parseColor(color) {
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
  
  // Get all CSS variables that start with --color-
  const styles = getComputedStyle(document.documentElement);
  const cssVars = Array.from(styles).filter(prop => prop.startsWith('--color-'));
  
  cssVars.forEach(prop => {
    const name = prop.replace('--color-', '');
    const value = styles.getPropertyValue(prop).trim();
    colors[name] = value;
  });
  
  return colors;
}

const colors = initializeColors();

function setColors(color, doBackground = true, el = document.body) {
  const rgb = parseColor(color);
  
  if (!rgb || rgb.length !== 3) {
    console.error("Invalid color value:", color);
    return;
  }

  const isDark = localStorage.theme === "dark" || 
                (!("theme" in localStorage) && 
                 window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Set theme-color meta tag
  const meta = document.createElement("meta");
  meta.setAttribute("name", "theme-color");
  meta.setAttribute("content", rgba(...rgb, 0.4));
  document.querySelector('[name="theme-color"]')?.remove();
  document.head.appendChild(meta);

  // Calculate colors based on theme
  const colors = {
    background: isDark ? 'rgba(18, 18, 25, 1)' : rgba(...rgb, 0.08),
    text: isDark ? rgba(...rgb, 0.25, "black") : rgba(...rgb, 0.25, "black"),
    highlight: rgba(...rgb, 1),
    highlightBg: rgba(...rgb, 0.08),
    border: rgba(...rgb, isDark ? 0.25 : 0.08)
  };

  // Apply colors
  const styles = [
    `--title-text: ${colors.text}`,
    `--highlight: ${colors.highlight}`,
    `--highlight-background: ${colors.highlightBg}`,
    `--color-border: ${colors.border}`,
    `--color-text: ${colors.highlight}`
  ];

  if (doBackground) {
    styles.push(
      `--bg: ${colors.background}`,
      `background-color: ${colors.background}`
    );
  }

  el.setAttribute("style", styles.join(";"));
}

function colorsMain() {
    // Store the current image and its colors for reuse
    window._currentColorSource = window._currentColorSource || {};

    if(document.querySelector('[data-color]')) {
        const color = document.querySelector("[data-color]").getAttribute("data-color");
        const rgbArray = colors[color];
        if(!rgbArray) console.log('Color not supported');
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
    const bodyBg = `rgba(18, 18, 25, 1)`;
    const darkerText = rgba(161, 161, 166, 1);
    const titleText = rgba(...rgb, 0.25, "black");
    const bg = rgba(14, 14, 14, 1);
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