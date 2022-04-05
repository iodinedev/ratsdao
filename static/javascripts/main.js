const main = document.getElementById("main");

if (main) {
  window.onscroll = function() {
    var scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

    if (scrollPosition > 500) {
      main.classList.add("backtotop");
    } else {
      main.classList.remove("backtotop");
    }
  }
}