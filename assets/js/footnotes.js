const removeEl = (el) => {
    if (!el) return;
    el.remove ? el.remove() : el.parentNode.removeChild(el);
};

const insertAfter = (target, sib) => {
    target.after ? target.after(sib) : (
        target.parentNode.insertBefore(sib, target.nextSibling)
    );
};

const insideOut = (el) => {
    var p = el.parentNode,
        x = el.innerHTML,
        c = document.createElement('div');  // a tmp container
    insertAfter(p, c);
    c.appendChild(el);
    el.innerHTML = '';
    el.appendChild(p);
    p.innerHTML = x;  // let the original parent have the content of its child
    insertAfter(c, c.firstElementChild);
    removeEl(c);
};

let renderFootnotes = function () {
    const isSmallScreen = window.innerWidth < 1280;

    document.querySelectorAll('.footnotes > ol > li[id^="fn"], #refs > div[id^="ref-"]').forEach(function (fn) {
        let a = document.querySelectorAll('a[href="#' + fn.id + '"]');
        if (a.length === 0) return;

        if (isSmallScreen) {
            // On small screens, ensure the href is enabled for scrolling to the footnote
            a.forEach(function (el) { el.setAttribute('href', '#' + fn.id); });
            return; // Skip creating sidenotes on small screens
        }

        // On larger screens, create sidenotes
        a.forEach(function (el) { el.removeAttribute('href'); });
        let newA = a[0];
        let side = document.createElement('div');
        side.className = 'side side-right';
        if (/^fn/.test(fn.id)) {
            side.innerHTML = fn.innerHTML;
            var number = newA.innerHTML;   // footnote number
            side.firstElementChild.innerHTML = '<span class="bg-number">' + number +
                '</span> ' + side.firstElementChild.innerHTML;
            removeEl(side.querySelector('a[href^="#fnref"]'));  // remove backreference
            let newAParent = newA.parentNode;
            newAParent.tagName === 'SUP' && insideOut(newA);
        } else {
            side.innerHTML = fn.outerHTML;
            newA = newA.parentNode;
        }
        insertAfter(newA, side);
        newA.classList.add('note-ref');
    });

    // Ensure the footnotes section at the end of the article is not removed
    document.querySelectorAll('.footnotes, #refs').forEach(function (fn) {
        var items = fn.children;
        if (fn.id === 'refs') return items.length === 0 && removeEl(fn);
        // there must be a <hr> and an <ol> left
        if (items.length !== 2 || items[0].tagName !== 'HR' || items[1].tagName !== 'OL') return;
        // Do not remove the footnotes section even if it's empty
    });
};

// Call the function to render footnotes
renderFootnotes();

// Re-render footnotes on window resize to handle screen size changes
window.addEventListener('resize', renderFootnotes);