$(document).ready(function(){
  $(".owl-carousel").owlCarousel(
    {
      items: 1,
      loop: true,
      nav: true,
      navText: [
        '<a class="uk-slidenav-large uk-slidenav-container uk-position-center-left" href="" uk-slidenav-previous></a>',
        '<a class="uk-slidenav-large uk-slidenav-container uk-position-center-right" href="" uk-slidenav-next></a>'
      ]
    }
  );
});
