var scrollPosition = window.scrollY;
var header = document.getElementById('header');

window.addEventListener('scroll', function() {
    scrollPosition = window.scrollY;

    if (scrollPosition >= 5) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
});