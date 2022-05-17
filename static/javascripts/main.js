"use strict";

const main = document.getElementById("main");
const scrolled = document.getElementById("scrolled");

const callback = (entries, observer) => {
  entries.forEach((entry) => {
    console.log(entry.intersectionRatio)
    if (entry.isIntersecting) {
      document.body.classList.remove("scrolled")
    } else {
      document.body.classList.add("scrolled")
    }
  })
}
const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0
}

const scollObserver = new IntersectionObserver(callback, options)
scollObserver.observe(scrolled)

document.body.onload = setTimeout(function() {
  if (window.pageYOffset >= 10) {
    document.body.className="scrolled";
  } else {
    document.body.className = "";
  }
} ,800);

AOS.init();