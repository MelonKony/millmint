// toc autoscroll //

$(document).ready(function() {
  $(window).scroll(function() {
    $(".book-toc a").removeClass("current")
    currentAnchor().addClass("current")
  })
});

function tocItem(anchor) {
  return $("[href=\"" + anchor + "\"]")
}

function heading(anchor) {
  return $("[id=" + anchor.substr(1) + "]")
}

var _anchors = null
function anchors() {
  if (!_anchors) {
    _anchors = $(".book-toc a").map(function() {
      return $(this).attr("href")
    })
  }
  return _anchors
}

function currentAnchor() {
  var winY = window.pageYOffset
  var currAnchor = null
  anchors().each(function() {
    var y = heading(this).position().top
    if (y < winY + window.innerHeight * 0.23) {
      currAnchor = this
      return
    }
  })
  return tocItem(currAnchor)
}

/* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('header').outerHeight();

$(window).scroll(function(event){
    didScroll = true;
});

setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);

function hasScrolled() {
    var st = $(this).scrollTop();

    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta)
        return;

    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop && st > navbarHeight){
        // Scroll Down
        $('book-header').removeClass('nav-down').addClass('nav-up');
    } else {
        // Scroll Up
        if(st + $(window).height() < $(document).height()) {
            $('header').removeClass('nav-up').addClass('nav-down');
        }
    }

    lastScrollTop = st;
}
