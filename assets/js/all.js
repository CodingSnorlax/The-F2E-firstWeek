"use strict";

var swiper = new Swiper('.siteSwiper', {
  slidesPerView: 1.3,
  freeMode: true,
  watchSlidesProgress: true,
  spaceBetween: 20,
  autoplay: {
    // delay: 2500,
    stopOnLastSlide: false,
    disableOnInteraction: true
  },
  pagination: {
    el: ".swiper-pagination"
  },
  breakpoints: {
    576: {
      slidesPerView: 2.8,
      spaceBetween: 20
    },
    992: {
      slidesPerView: 2.5,
      spaceBetween: 20
    }
  }
});
//# sourceMappingURL=all.js.map
