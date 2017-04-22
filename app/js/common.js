$(function() {

	$(".owl-carousel.home-promo").owlCarousel({
		loop: true,
		margin: 10,
		navText: ['<span class="uk-transition-fade uk-position-center-left" uk-icon="icon:  chevron-left; ratio: 3"></span>',
							'<span class="uk-transition-fade uk-position-center-right" uk-icon="icon: chevron-right; ratio: 3"></span>'
						],
		navClass: ['uk-transition-toggle', 'uk-transition-toggle'],
		navContainerClass: 'slidenav',
		nav: true,
		responsive:{
			0:{
				items:1
			},
			640:{
				items:2
			},
			1000:{
				items:3
			}
		}
	});



	var $grid = $('.grid').imagesLoaded( function() {
	  $grid.masonry({
	    itemSelector: '.grid-item'			
	  });
	});

// =========== magnificPopup ======================================= //

	$('.gallery').each(function() { // the containers for all your galleries
		$(this).magnificPopup({
		delegate: 'a', // the selector for gallery item
		type: 'image',
		gallery: {
			enabled:true
				}
		});
	});

	$('.lightbox').magnificPopup({
		delegate: 'a',
		type: 'image'
	  // other options
	});

});
