document.querySelectorAll('header #TableOfContents a').forEach(a => {
    a.addEventListener('click', () => {
        document.querySelector('#toc-control').checked = false;
    });
});