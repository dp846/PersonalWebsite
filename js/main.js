
(function ($) {
	"use strict";
	var nav = $('nav');
  var navHeight = nav.outerHeight();
  
  $('.navbar-toggler').on('click', function() {
    if( ! $('#mainNav').hasClass('navbar-reduce')) {
      $('#mainNav').addClass('navbar-reduce');
    }
  })

  // Preloader
  $(window).on('load', function () {
    if ($('#preloader').length) {
      $('#preloader').delay(100).fadeOut('slow', function () {
        $(this).remove();
      });
    }
  });

  // Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });
  $('.back-to-top').click(function(){
    $('html, body').animate({scrollTop : 0},1500, 'easeInOutExpo');
    return false;
  });


  //Scroll for more indicator
  const scrollForMore = document.querySelector('.scroll-for-more');

	function showHideScrollForMore() {
	if (window.pageYOffset === 0) {
		scrollForMore.style.opacity = '1';
		} else {
			scrollForMore.style.opacity = '0';
		}
	}

showHideScrollForMore(); // Call the function to display the indicator initially
window.addEventListener('scroll', showHideScrollForMore);


	/*--/ Star ScrollTop /--*/
	$('.scrolltop-mf').on("click", function () {
		$('html, body').animate({
			scrollTop: 0
		}, 1000);
	});

	/*--/ Star Counter /--*/
	$('.counter').counterUp({
		delay: 15,
		time: 2000
	});

	/*--/ Star Scrolling nav /--*/
	$('a.js-scroll[href*="#"]:not([href="#"])').on("click", function () {
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				$('html, body').animate({
					scrollTop: (target.offset().top - navHeight + 5)
				}, 1000, "easeInOutExpo");
				return false;
			}
		}
	});

	// Closes responsive menu when a scroll trigger link is clicked
	$('.js-scroll').on("click", function () {
		$('.navbar-collapse').collapse('hide');
	});

	// Activate scrollspy to add active class to navbar items on scroll
	$('body').scrollspy({
		target: '#mainNav',
		offset: navHeight
	});
	/*--/ End Scrolling nav /--*/

	/*--/ Navbar Menu Reduce /--*/
	$(window).trigger('scroll');
	$(window).on('scroll', function () {
		var pixels = 50; 
		var top = 1200;
		if ($(window).scrollTop() > pixels) {
			$('.navbar-expand-md').addClass('navbar-reduce');
			$('.navbar-expand-md').removeClass('navbar-trans');
		} else {
			$('.navbar-expand-md').addClass('navbar-trans');
			$('.navbar-expand-md').removeClass('navbar-reduce');
		}
		if ($(window).scrollTop() > top) {
			$('.scrolltop-mf').fadeIn(1000, "easeInOutExpo");
		} else {
			$('.scrolltop-mf').fadeOut(1000, "easeInOutExpo");
		}
	});

	/*--/ Star Typed /--*/
	if ($('.text-slider').length == 1) {
    var typed_strings = $('.text-slider-items').text();
		var typed = new Typed('.text-slider', {
			strings: typed_strings.split(','),
			typeSpeed: 40,
			loop: true,
			backDelay: 1500,
			backSpeed: 30
		});
	}

	/*--/ Star Typed /--*/
	if ($('.new-slider').length == 1) {
		var typed_strings = $('.new-slider-items').text();
			var typed2 = new Typed('.new-slider', {
				strings: typed_strings.split(','),
				typeSpeed: 60,
				loop: true,
				backDelay: 1500,
				backSpeed: 25,
			});
		}

	/*--/ Testimonials owl /--*/
	$('#testimonial-mf').owlCarousel({
		margin: 20,
		autoplay: true,
		autoplayTimeout: 4000,
		autoplayHoverPause: true,
		responsive: {
			0: {
				items: 1,
			}
		}
	});




	// code for moving the planets towards the cursor for interactive feel

	// var planet = document.getElementById("planet");
	// document.addEventListener("mousemove", function(event) {
	// var x = event.clientX;
	// var y = event.clientY;
	// planet.style.left = -100 + (x / 100) + "px";
	// planet.style.top = -100 + (y / 100) + "px";
	// });

	// var planet2 = document.getElementById("planet2");
	// document.addEventListener("mousemove", function(event) {
	// var x = event.clientX;
	// var y = event.clientY;
	// planet2.style.left = 900 + (x / 12) + "px";
	// planet2.style.top = 200 + (y / 12) + "px";
	// });


	// Crosshair code

	// document.addEventListener('DOMContentLoaded', () => {
	// 	// Create the crosshair element and add it to the body
	// 	const crosshair = document.createElement('div');
	// 	crosshair.classList.add('crosshair');
	// 	document.body.appendChild(crosshair);
	
	// 	// Update the crosshair position based on the mouse movement
	// 	document.addEventListener('mousemove', (e) => {
	// 		const x = e.clientX;
	// 		const y = e.clientY;
	
	// 		crosshair.style.left = `${x - crosshair.offsetWidth / 2}px`;
	// 		crosshair.style.top = `${y - crosshair.offsetHeight / 2}px`;
	// 	});
	
	// 	let isAnimating = false; // Flag to track the animation state
	
	// 	// Add click event listener to play the shooting animation
	// 	document.addEventListener('click', () => {
	// 		if (!isAnimating) {
	// 			isAnimating = true;
	// 			crosshair.classList.add('shoot');
	
	// 			// Remove the shooting animation class after the animation is complete
	// 			setTimeout(() => {
	// 				crosshair.classList.remove('shoot');
	// 				isAnimating = false;
	// 			}, 500); // Duration of the animation in milliseconds
	// 		}
	// 	});
	// });

	
	

})(jQuery);
