/* .:. created by Ben_R_R .:. tolkienfan72@gmail.com .:. */
// Add this line at the top of your file
var parallaxBackground = {
    light: "#5AC2E7",
    dark: "#1a1b28"
};

function getParallaxBackground() {
    return document.documentElement.getAttribute('data-theme') === 'dark' 
        ? parallaxBackground.dark 
        : parallaxBackground.light;
}

var falling_layers = [
    new Animated_Object("falling-1",[KeyFrame(0, 0, 910), KeyFrame(910, 0, 2400)], pre_ani = 'stop'),
    new Animated_Object("falling-2",[KeyFrame(0, 0, 775), KeyFrame(910, 0, 2300)], pre_ani = 'stop'),
    new Animated_Object("falling-3",[KeyFrame(0, 0, 910), KeyFrame(910, 0, 2250)], pre_ani = 'stop'),
    new Animated_Object("falling-4",[KeyFrame(0, 0, -120), KeyFrame(1820, 0, 2100)], pre_ani = 'stop'),
    new Animated_Object("falling-5",[KeyFrame(0, 0, 825), KeyFrame(910, 0, 1800)], pre_ani = 'stop'),
    new Animated_Object("falling-6",[KeyFrame(0, 0, 850), KeyFrame(910, 0, 1500)], pre_ani = 'stop'),
    new Animated_Object("falling-7",[KeyFrame(0, 0, 875), KeyFrame(910, 0, 1200)], pre_ani = 'stop'),
    new Animated_Object("falling-8",[KeyFrame(0, 0, 0), KeyFrame(1820, 0, 0)], pre_ani = 'stop')
];
// Update this line to use the variable
// Store the animation reference
var headerAnimation = new Animation('HeaderCanvas', falling_layers, 6000, 1820, 0.5, 1.0, getParallaxBackground());
Register_Animation(headerAnimation);

// Watch for theme changes using MutationObserver
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.attributeName === "data-theme") {
            console.log('Theme changed to:', document.documentElement.getAttribute('data-theme'));
            headerAnimation.clear_color = getParallaxBackground();
            headerAnimation.ctx.clearRect(0, 0, headerAnimation.canvas.width, headerAnimation.canvas.height);
            window_has_moved = true;
            headerAnimation.render();
        }
    });
});

// Start observing theme changes
observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
});
