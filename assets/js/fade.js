/* FADE.JS // Fade-in animation for site images */

function showImages(el) {
  // Skip fade animation for stories page images
  if (window.location.pathname.includes('/stories/')) {
    return;
  }

  var windowHeight = jQuery(window).height();
  $(el).each(function() {
    var thisPos = $(this).offset().top;

    var topOfWindow = $(window).scrollTop();
    if (topOfWindow + windowHeight - 0 > thisPos) {
      $(this).addClass("fadein");
    }
  });
}

// if the image in the window of browser when the page is loaded, show that image
$(document).ready(function() {
  showImages('img');
  
  // Remove fade class from stories page images
  if (window.location.pathname.includes('/stories/')) {
    $('img').removeClass('fadein').addClass('no-fade');
    document.body.classList.add('show-all-images');
  } else {
    document.body.classList.remove('show-all-images');
  }
});

// if the image in the window of browser when scrolling the page, show that image
$(window).scroll(function() {
  showImages('img');
});