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
  vnr: [255, 86, 79],
  mail: [186, 29, 55],
  gr: [31, 205, 88]
}

if(document.querySelector('[data-color]')) {
  // Page color override — no background!!!!
  const color = document
    .querySelector("[data-color]")
    .getAttribute("data-color");

  const rgbArray = colors[color]

  if(!rgbArray) console.log('Color not supported')

  setBackgroundColor(rgbArray, false);
} else if (document.querySelector("[data-page-color]")) {
  // Page color override
  const rgbArray = document
    .querySelector("[data-page-color]")
    .getAttribute("data-page-color")
    .split(",")
    .map((v) => Number(v));
  setBackgroundColor(rgbArray);
} else if (
  location.href.includes("/stories/") &&
  !document.querySelector(".list-item")
) {
  // Get story's color from image
  const img = document.querySelector(".content img");

  // Make sure image is finished loading
  if (img.complete) {
    getColors(img);
  } else {
    img.addEventListener("load", () => {
      getColors(img);
    });
  }
}

window.addEventListener("load", () => {
  if (document.querySelector(".post-grid")) {
    document.querySelectorAll("ul.post-grid > li").forEach((card) => {
      const img = card.querySelector("img");

      function setCardBackground(rgb) {
        const bodyBg = rgba(...rgb, 0.1);
        const bodyDarker = rgba(...rgb, 0.2);

        const styles = `${card.getAttribute(
          "style"
        )}; --gray-100: ${bodyBg}; --gray-200: ${bodyDarker}`;
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
          getColors(img, 0, null).then(setCardBackground);
        } else {
          img.addEventListener("load", function () {
            getColors(img, 0, null).then(setCardBackground);
          });
        }
      }
    });
  }
});

async function getColors(img, retryCount = 0, callback = setBackgroundColor) {
  try {
    img.crossOrigin = 'anonymous'
    const vibrant = new Vibrant(img, 11);
    const swatches = vibrant.swatches();

    const key = "Vibrant";
    if (callback) callback(swatches[key].rgb);
    return swatches[key].rgb;
  } catch (e) {
    console.log(retryCount, e);
    if (retryCount <= 3) {
      setTimeout(() => getColors(img, retryCount + 1, callback), 30);
      console.log("Retrying Vibrant");
    }
  }
}

function setBackgroundColor(rgb, doBackground = true) {
  // Set theme-color
  document
    .querySelectorAll(`[name="theme-color"]`)
    .forEach((el) => el.remove());
  const meta = document.createElement("meta");
  meta.setAttribute("name", "theme-color");
  meta.setAttribute("content", rgba(...rgb, 0.4));
  document.head.appendChild(meta);

  // Define all colors
  const bodyBg = rgba(...rgb, 0.1);
  const darkerText = rgba(...rgb, 0.35, 'black');
  const titleText = rgba(...rgb, 0.25, 'black');
  const bg = `rgba(${rgb.join(", ")}, 0.1)`;
  const gray100 = `rgba(${rgb.join(", ")}, 0.1)`;
  const colorGray = `rgba(${rgb.map((v) => Math.max(v, 0)).join(", ")}, 1)`;
  const darkerColor = `rgba(${rgb.map((v) => Math.max(v - 100, 0)).join(", ")}, 1)`;

  const classes = [`--title-text: ${titleText}`, `--dark-title-text: ${darkerText}`, `a: ${colorGray}`, `--color-gray: ${colorGray}`, `--color-text: ${colorGray}`, `--hint-bg: ${bodyBg}`, `--bg-alt: ${bg}`]
  if(doBackground) classes.push(`--bg: ${bg}`, `background-color: ${bg}`, `--gray-100: ${gray100}`, `--color-placeholder: var(--color-gray)`/*, `--body-background: ${bodyBg}`*/);
  classes.push(doBackground ? `--logo-color: var(--color-gray)` : `--logo-color: ${darkerColor}`)

  // Inject colors into DOM
  document.body.setAttribute(
    "style",
    classes.join(';')
  );
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
