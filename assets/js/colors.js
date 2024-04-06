/* COLORS.JS // @author: Jip Frijlink // Script that themes articles with colour */

const colors = {
  blue: [28, 123, 205],
  brown: [162, 132, 94],
  cyan: [50, 173, 230],
  gray: [95, 95, 105],
  green: [92, 185, 85],
  indigo: [88, 86, 214],
  mint: [0, 199, 190],
  orange: [237, 122, 69],
  pink: [225, 28, 110],
  purple: [155, 67, 199],
  red: [221, 52, 71],
  teal: [48, 176, 199],
  yellow: [234, 147, 101],

  millmint: [225, 28, 110],
  vekllei: [54, 73, 187],
  vnr: [255, 86, 79],
  mail: [221, 76, 86],
  gr: [31, 205, 88],

  commerce: [228, 160, 14],
  commons: [243, 133, 43],
  commonwealth: [229, 56, 143],
  culture: [128, 191, 34],
  defence: [237, 34, 13],
  foreignaffairs: [82, 47, 147],
  industry: [37, 89, 167],
  labour: [161, 43, 46],
  landscape: [19, 172, 67],
  lightandwater: [86, 163, 187],

  education: [59, 111, 185],
  security: [240, 86, 75],
  community: [255, 162, 84],
  culture: [59, 186, 94],
  democracy: [206, 80, 159],
  health: [246, 81, 113],
}

function colorsMain() {
  if(document.querySelector('[data-color]')) {
    // Page color override — no background!!!!
    const color = document
      .querySelector("[data-color]")
      .getAttribute("data-color");

    const rgbArray = colors[color]

    if(!rgbArray) console.log('Color not supported')

    setColors(rgbArray, false);
  } else if (document.querySelector("[data-page-color]")) {
    // Page color override
    const rgbArray = document
      .querySelector("[data-page-color]")
      .getAttribute("data-page-color")
      .split(",")
      .map((v) => Number(v));
    setColors(rgbArray);
  } else if (
    location.href.includes("/stories/") &&
    !document.querySelector(".list-item")
  ) {
    // Get story's color from image
    const img = document.querySelector(".page img");

    // Make sure image is finished loading
    if (img.complete) {
      getColors(img);
    } else {
      img.addEventListener("load", () => {
        getColors(img);
      });
    }
  }
}
colorsMain()

console.log(localStorage.theme)

if (localStorage.theme === 'light' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches)) {
  window.addEventListener("load", () => {
    updatePostGrid()
  });

  function updatePostGrid() {
    if (document.querySelector(".post-grid")) {
      document.querySelectorAll("ul.post-grid > li").forEach((card) => {
        const img = card.querySelector("img");

        function setCardBackground(rgb) {
          const bodyBg = rgba(...rgb, 0.1);
          const bodyDarker = rgba(...rgb, 0.2);

          const styles = `${card.getAttribute(
            "style"
          )}; --gray-light: ${bodyBg}; --gray-med: ${bodyDarker}`;
          card.setAttribute("style", styles);

          // Set individual elements
          card.querySelectorAll(".text-xs").forEach((el) => {
            el.style.color = `rgba(${rgb
              .map((v) => Math.max(v, 0))
              .join(", ")}, 1)`;
          });

          card
            .querySelectorAll(".card-title")
            .forEach((title) => {
              title.setAttribute(
                "style",
                `color: rgb(${rgb.join(", ")}) !important;`
              );
            });

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
    img.crossOrigin = 'anonymous'
    const vibrant = new Vibrant(img, 11);
    const swatches = vibrant.swatches();

    const key = "Vibrant";
    if (callback) callback(swatches[key].rgb);
    return swatches[key].rgb;
  } catch (e) {
    console.log(retryCount, img, e);
    if (retryCount <= 3) {
      setTimeout(() => getColors(img, retryCount + 1, callback), 30);
      console.log("Retrying Vibrant");
    }
  }
}

function setColors(rgb, doBackground = true, el = document.body) {
  // Set theme-color
  document
    .querySelectorAll(`[name="theme-color"]`)
    .forEach((el) => el.remove());
  const meta = document.createElement("meta");
  meta.setAttribute("name", "theme-color");
  meta.setAttribute("content", rgba(...rgb, 0.4));
  document.head.appendChild(meta);

  console.log(localStorage.theme)

  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      // Define all dark colors
      const bodyBg = `rgba(${rgb.map((v) => Math.max(v - 300, 0)).join(", ")}, 1)`;
      const darkerText = rgba(161, 161, 166, 1);
      const titleText = rgba(...rgb, 0.25, 'black');
      const bg = rgba(14, 14, 14, 1);
      const gray100 = `rgba(${rgb.join(", ")}, 0.1)`;
      const highlight = `rgba(${rgb.map((v) => Math.max(v, 0)).join(", ")}, 1)`;
      const highlightBackground = `rgba(${rgb.join(", ")}, 0.1)`;
      const colorGray = `rgba(${rgb.map((v) => Math.max(v, 0)).join(", ")}, 1)`;
      const darkerColor = `rgba(${rgb.map((v) => Math.max(v - 100, 0)).join(", ")}, 1)`;

      const classes = [`--title-text: ${titleText}`, `--highlight: ${highlight}`, `--highlight-background: ${highlightBackground}`, `--darker-text: ${darkerText}`, `a: ${colorGray}`, `--color-gray: ${colorGray}`, `--color-text: ${colorGray}`, `--hint-bg: ${bodyBg}`, `--bg-alt: ${bg}`]
      if(doBackground) classes.push(`--bg: ${bg}`, `background-color: ${bg}`, `--gray-light: ${gray100}`, `--color-placeholder: var(--color-gray)`/*, `--body-background: ${bodyBg}`*/);

      // Inject dark colors into DOM
      el.setAttribute(
        "style",
        classes.join(';')
      );
  } else {
      // Define all colors
      const bodyBg = rgba(...rgb, 0.1);
      const darkerText = rgba(...rgb, 0.35, 'black');
      const titleText = rgba(...rgb, 0.25, 'black');
      const bg = `rgba(${rgb.join(", ")}, 0.1)`;
      const gray100 = `rgba(${rgb.join(", ")}, 0.1)`;
      const highlight = `rgba(${rgb.map((v) => Math.max(v, 0)).join(", ")}, 1)`;
      const highlightBackground = `rgba(${rgb.join(", ")}, 0.1)`;
      const colorGray = `rgba(${rgb.map((v) => Math.max(v, 0)).join(", ")}, 1)`;
      const darkerColor = `rgba(${rgb.map((v) => Math.max(v - 100, 0)).join(", ")}, 1)`;

      const classes = [`--title-text: ${titleText}`, `--highlight: ${highlight}`, `--highlight-background: ${highlightBackground}`, `--darker-text: ${darkerText}`, `a: ${colorGray}`, `--color-gray: ${colorGray}`, `--color-text: ${colorGray}`, `--hint-bg: ${bodyBg}`, `--bg-alt: ${bg}`]
      if(doBackground) classes.push(`--bg: ${bg}`, `background-color: ${bg}`, `--gray-light: ${gray100}`, `--color-placeholder: var(--color-gray)`/*, `--body-background: ${bodyBg}`*/);
      classes.push(doBackground ? `--logo-color: var(--color-gray)` : `--logo-color: ${darkerColor}`)

      // Inject colors into DOM
      el.setAttribute(
        "style",
        classes.join(';')
      );
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
