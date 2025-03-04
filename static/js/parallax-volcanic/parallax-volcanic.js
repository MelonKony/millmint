/* .:. created by Ben_R_R .:. tolkienfan72@gmail.com .:. */
var parallaxBackground = {
    light: "#9CB8B8",
    dark: "#202e2e"
};

function getParallaxBackground() {
    return document.documentElement.getAttribute('data-theme') === 'dark' 
        ? parallaxBackground.dark 
        : parallaxBackground.light;
}

var falling_layers = [
    new Animated_Object("falling-1",[KeyFrame(0, 0, 596), KeyFrame(910, 0, 1450)], pre_ani = 'stop'),
    new Animated_Object("falling-2",[KeyFrame(0, 0, 616), KeyFrame(910, 0, 1400)], pre_ani = 'stop'),
    new Animated_Object("falling-3",[KeyFrame(0, 0, 576), KeyFrame(910, 0, 1250)], pre_ani = 'stop'),
    new Animated_Object("falling-4",[KeyFrame(0, 0, 566), KeyFrame(910, 0, 1150)], pre_ani = 'stop'),
    new Animated_Object("falling-5",[KeyFrame(0, 0, 586), KeyFrame(910, 0, 1050)], pre_ani = 'stop'),
    new Animated_Object("falling-6",[KeyFrame(0, 0, 586), KeyFrame(910, 0, 950)], pre_ani = 'stop'),
    new Animated_Object("falling-7",[KeyFrame(0, 0, 566), KeyFrame(910, 0, 950)], pre_ani = 'stop'),
    new Animated_Object("falling-8",[KeyFrame(0, 0, 566), KeyFrame(910, 0, 850)], pre_ani = 'stop'),
    new Animated_Object("falling-9",[KeyFrame(0, 0, -80), KeyFrame(910, 0, 190)], pre_ani = 'stop'),
    new Animated_Object("falling-train",[KeyFrame(0, -400, 572), KeyFrame(910, 7000, 804)], pre_ani = 'stop'),
    new Animated_Object("falling-10",[KeyFrame(0, 0, 576), KeyFrame(910, 0, 800)], pre_ani = 'stop'),
    new Animated_Object("falling-11",[KeyFrame(0, 0, 576), KeyFrame(910, 0, 775)], pre_ani = 'stop'),
    new Animated_Object("falling-12",[KeyFrame(0, 0, 596), KeyFrame(910, 0, 750)], pre_ani = 'stop'),
    new Animated_Object("falling-13",[KeyFrame(0, 0, 606), KeyFrame(910, 0, 700)], pre_ani = 'stop'),
    new Animated_Object("falling-14",[KeyFrame(0, 0, 0), KeyFrame(910, 0, 0)], pre_ani = 'stop')
];

var headerAnimation = new Animation('HeaderCanvas', falling_layers, 3996, 1212, 0.5, 1.0, getParallaxBackground());
Register_Animation(headerAnimation);

const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.attributeName === "data-theme") {
            headerAnimation.clear_color = getParallaxBackground();
            headerAnimation.ctx.clearRect(0, 0, headerAnimation.canvas.width, headerAnimation.canvas.height);
            window_has_moved = true;
            headerAnimation.render();
        }
    });
});

observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
});
