import Zooming from 'zooming';

document.addEventListener('DOMContentLoaded', function () {
    if(!document.querySelector('.post-grid')) {
        const zooming = new Zooming()
        zooming.listen('#content img')
    }
});
