import Zooming from 'zooming';

document.addEventListener('DOMContentLoaded', function () {
    const zooming = new Zooming({
        bgOpacity: 1,
        transitionDuration: 0.2,
        scaleBase: 1.0,
        scaleExtra: 0.5,
    })
    zooming.listen('#content img')
});
