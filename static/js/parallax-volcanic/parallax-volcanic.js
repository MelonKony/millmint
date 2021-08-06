/* .:. created by Ben_R_R .:. tolkienfan72@gmail.com .:. */
var falling_layers = [
    new Animated_Object("falling-1",[KeyFrame(0, 0, 606), KeyFrame(910, 0, 1390)], pre_ani = 'stop'),
    new Animated_Object("falling-2",[KeyFrame(0, 0, 606), KeyFrame(910, 0, 1380)], pre_ani = 'stop'),
    new Animated_Object("falling-3",[KeyFrame(0, 0, 606), KeyFrame(910, 0, 1300)], pre_ani = 'stop'),
    new Animated_Object("falling-4",[KeyFrame(0, 0, 606), KeyFrame(910, 0, 1250)], pre_ani = 'stop'),
    new Animated_Object("falling-5",[KeyFrame(0, 0, 606), KeyFrame(910, 0, 1200)], pre_ani = 'stop'),
    new Animated_Object("falling-6",[KeyFrame(0, 0, 606), KeyFrame(910, 0, 1100)], pre_ani = 'stop'),
    new Animated_Object("falling-train-2",[KeyFrame(0, -800, 606), KeyFrame(910, -5000, 1100)], pre_ani = 'stop'),
    new Animated_Object("falling-7",[KeyFrame(0, 0, 606), KeyFrame(910, 0, 1025)], pre_ani = 'stop'),
    new Animated_Object("falling-8",[KeyFrame(0, 0, 606), KeyFrame(910, 0, 980)], pre_ani = 'stop'),
    new Animated_Object("falling-9",[KeyFrame(0, 0, 606), KeyFrame(910, 0, 920)], pre_ani = 'stop'),
    new Animated_Object("falling-train",[KeyFrame(0, -400, 602), KeyFrame(910, 7000, 864)], pre_ani = 'stop'),
    new Animated_Object("falling-10",[KeyFrame(0, 0, 606), KeyFrame(910, 0, 850)], pre_ani = 'stop'),
    new Animated_Object("falling-11",[KeyFrame(0, 0, 606), KeyFrame(910, 0, 830)], pre_ani = 'stop'),
    new Animated_Object("falling-12",[KeyFrame(0, 0, 606), KeyFrame(910, 0, 850)], pre_ani = 'stop'),
    new Animated_Object("falling-13",[KeyFrame(0, 0, 606), KeyFrame(910, 0, 780)], pre_ani = 'stop'),
    new Animated_Object("falling-14",[KeyFrame(0, 0, 0), KeyFrame(910, 0, 0)], pre_ani = 'stop')
];
Register_Animation(new Animation('HeaderCanvas', falling_layers, 3996, 1212, 0.5, 1.0, "#9CB8B8"));
