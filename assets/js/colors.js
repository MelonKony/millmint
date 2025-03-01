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
  
  // Handle space-separated RGB
  if (typeof color === 'string' && color.includes(' ')) {
    return color.split(' ').map(v => parseInt(v));
  }
  
  // Handle comma-separated RGB
  if (typeof color === 'string' && color.includes(',')) {
    return color.split(',').map(v => parseInt(v));
  }
  
  return color;
}

const colors = {
  blue: '#1C7BCD',
  brown: '#A2845E',
  cyan: '#32ADE6',
  gray: '#5F5F69',
  green: '#5CB955',
  indigo: '#5856D6',
  mint: '#00C7BE',
  orange: '#ED7A45',
  pink: '#E11C6E',
  purple: '#9B43C7',
  red: '#DD3447',
  teal: '#30B0C7',
  yellow: '#EA9365',

  millmint: '#E11C6E',
  vekllei: '#EE7742',
  vnr: '#FF564F',
  mail: '#DD4C56',
  gr: '#1FCD58',

  commerce: [228, 160, 14],
  commons: [255, 86, 79],
  commonwealth: [229, 56, 143],
  culture: [31, 167, 82],
  defence: [237, 34, 13],
  foreignaffairs: [100, 34, 222],
  industry: [37, 89, 167],
  labour: [161, 43, 46],
  landscape: [19, 172, 67],
  lightandwater: [39, 149, 204],

  education: [50, 134, 219],
  security: [240, 86, 75],
  community: [255, 162, 84],
  culture: [59, 186, 94],
  democracy: [206, 80, 159],
  health: [246, 81, 113],

  marine: [0, 60, 210],
  land: [176, 44, 0],
  aero: [201, 22, 22],
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
          const bodyBg = rgba(...rgb, 0.1);
          const bodyDarker = rgba(...rgb, 0.2);

          const styles = `${card.getAttribute(
            "style"
          )}; --gray-light: ${bodyBg}; --gray-med: ${bodyDarker}`;
          card.setAttribute("style", styles);

          // Set individual elements
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
    const gray100 = `rgba(${rgb.join(", ")}, 0.1)`;
    const highlight = `rgba(${rgb.map((v) => Math.max(v, 0)).join(", ")}, 1)`;
    const highlightBackground = `rgba(${rgb.join(", ")}, 0.1)`;
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
    if (doBackground) classes.push(`--bg: ${bg}`, `background-color: ${bg}`, `--gray-light: ${gray100}`, `--color-placeholder: var(--color-gray)`);

    // Inject dark colors into DOM
    el.setAttribute("style", classes.join(";"));
  } else {
    // Define all colors for light mode
    const bodyBg = rgba(...rgb, 0.1);
    const darkerText = rgba(...rgb, 0.35, "black");
    const titleText = rgba(...rgb, 0.25, "black");
    const bg = `rgba(${rgb.join(", ")}, 0.1)`;
    const gray100 = `rgba(${rgb.join(", ")}, 0.1)`;
    const highlight = `rgba(${rgb.map((v) => Math.max(v, 0)).join(", ")}, 1)`;
    const highlightBackground = `rgba(${rgb.join(", ")}, 0.1)`;
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
    if (doBackground) classes.push(`--bg: ${bg}`, `background-color: ${bg}`, `--gray-light: ${gray100}`, `--color-placeholder: var(--color-gray)`);
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