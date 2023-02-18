const dark_mode_btn = document.getElementById("dark_mode_btn");
const light_mode_btn = document.getElementById("light_mode_btn");

if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    light_mode_btn.classList.remove('hidden');
} else {
    dark_mode_btn.classList.remove('hidden');
}

dark_mode_btn.addEventListener('click', function () {
    setScheme("dark")
});

light_mode_btn.addEventListener('click', function () {
    setScheme("light")
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    const newColorScheme = event.matches ? "dark" : "light";
    setScheme(newColorScheme)
});

function setScheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.theme = theme;
    if(theme === "dark") {
        dark_mode_btn.classList.add('hidden');
        light_mode_btn.classList.remove('hidden');
    } else {
        light_mode_btn.classList.add('hidden');
        dark_mode_btn.classList.remove('hidden');
    }
    colorsMain()
}