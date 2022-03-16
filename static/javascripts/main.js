const header = document.querySelector('.main-header');
const body = document.body;
const burger = document.querySelector('#menu-btn');
const hero = document.querySelector('.hero');
const $menu = document.querySelector('.reviews__menu--ani');

const scrollOptions = {
  rootMargin: "-150px 0px 0px 0px"
};

const scrollObserver = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      header.classList.add('shadow');
    } else {
      header.classList.remove('shadow');
    }
  });
}, scrollOptions);

function testScroll(className) {
  const scrollPos = window.scrollY;

  if (scrollPos > 10) {
    header.classList.add(className);
  } else {
    header.classList.remove(className);
  }
}

if (hero) {
  window.addEventListener('scroll', () => {
    testScroll('scrolled');
  });

  testScroll('scrolled');
  scrollObserver.observe(hero);
} else {
  window.addEventListener('scroll', () => {
    testScroll('shadow');
  });

  testScroll('shadow');
  header.classList.add('scrolled');
}

if ($menu) {
  /*--------------------
  Vars
  --------------------*/
  const $items = document.querySelectorAll('.reviews__menu--item');
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let menuWidth = $menu.clientWidth;
  let itemWidth = $items[0].clientWidth;
  let wrapWidth = $items.length * itemWidth;

  let scrollSpeed = 0;
  let oldScrollY = 0;
  let scrollY = 0;
  let y = 0;


  /*--------------------
  Lerp
  --------------------*/
  const lerp = (v0, v1, t) => {
    return v0 * (1 - t) + v1 * t;
  };


  /*--------------------
  Dispose
  --------------------*/
  const dispose = scroll => {
    gsap.set($items, {
      x: i => {
        return i * itemWidth + scroll;
      },
      modifiers: {
        x: (x, target) => {
          const s = gsap.utils.wrap(-itemWidth, wrapWidth - itemWidth, parseInt(x));
          return `${s}px`;
        } } });


  };
  dispose(0);


  /*--------------------
  Wheel
  --------------------*/
  const handleMouseWheel = e => {
    scrollY -= e.deltaX * 0.9;
  };


  /*--------------------
  Touch
  --------------------*/
  let touchStart = 0;
  let touchX = 0;
  let isDragging = false;
  const handleTouchStart = e => {
    touchStart = e.clientX || e.touches[0].clientX;
    isDragging = true;
    $menu.classList.add('is-dragging');
  };
  const handleTouchMove = e => {
    if (!isDragging) return;
    touchX = e.clientX || e.touches[0].clientX;
    scrollY += (touchX - touchStart) * 2.5;
    touchStart = touchX;
  };
  const handleTouchEnd = () => {
    isDragging = false;
    $menu.classList.remove('is-dragging');
  };


  /*--------------------
  Listeners
  --------------------*/
  $menu.addEventListener('mousewheel', handleMouseWheel);

  $menu.addEventListener('touchstart', handleTouchStart);
  $menu.addEventListener('touchmove', handleTouchMove);
  $menu.addEventListener('touchend', handleTouchEnd);

  $menu.addEventListener('mousedown', handleTouchStart);
  $menu.addEventListener('mousemove', handleTouchMove);
  $menu.addEventListener('mouseleave', handleTouchEnd);
  $menu.addEventListener('mouseup', handleTouchEnd);

  $menu.addEventListener('selectstart', () => {return false;});


  /*--------------------
  Resize
  --------------------*/
  window.addEventListener('resize', () => {
    menuWidth = $menu.clientWidth;
    itemWidth = $items[0].clientWidth;
    wrapWidth = $items.length * itemWidth;
  });


  /*--------------------
  Render
  --------------------*/
  const render = () => {
    requestAnimationFrame(render);
    y = lerp(y, scrollY, .1);
    dispose(y/2);

    scrollSpeed = y - oldScrollY;
    oldScrollY = y;

    gsap.to($items, {
      //skewX: -scrollSpeed * .2,
      rotate: scrollSpeed * .002,
      scale: 1 - Math.min(100, Math.abs(scrollSpeed)) * 0.0009 });

  };
  render();

  /*--------------------
  Buttons
  --------------------*/
  document.getElementById("scrollLeft").onclick = function () {
    scrollY += itemWidth;
  }

  document.getElementById("scrollRight").onclick = function () {
    scrollY -= itemWidth;
  }
}