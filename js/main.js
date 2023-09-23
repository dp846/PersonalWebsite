
(function ($) {
	"use strict";
	var nav = $('nav');
  var navHeight = nav.outerHeight();
  
  $('.navbar-toggler').on('click', function() {
    if( ! $('#mainNav').hasClass('navbar-reduce')) {
      $('#mainNav').addClass('navbar-reduce');
    }
  })

  
// Call the function from Blast.js file as soon as the page loads
startBlastJsEffect();

	// Preloader
	$(window).on('load', function () {
		if ($('#preloader').length) {
			let scrambleInterval, revealInterval;
	
			$('#preloader-content').css('opacity', 0); // Make sure preloader content is initially invisible
	
			$('#preloader-content').animate({ opacity: 1 }, 500, function() { // Fade in preloader content
				// Start the text scrambling after a delay of 1000ms
				setTimeout(function() {
					scrambleInterval = setInterval(scramble, 25);  // Start the text scrambling
					revealInterval = setInterval(reveal, 100);  // Start the text revealing
				}, 1000);
			});
	
			// Wait until everything is loaded, then start the process to hide the preloader
			setTimeout(function() {
				clearInterval(scrambleInterval);  // Stop the text scrambling
				clearInterval(revealInterval);  // Stop the text revealing
	
				$('#preloader-content').animate({ opacity: 0 }, 1000, function() { // Fade out preloader content
					// After preloader content has faded out, wait 500ms before fading out the preloader
					setTimeout(function() {
						$('#preloader').fadeOut(750, function() {
							$(this).remove();
						});
					}, 500);
				});
			}, 1500); // Adjust this timeout to control the minimum display time of the preloader
		}
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
			strings: typed_strings.split('|'),
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




	// Code for the subtitles on the portfolio projects
	const createWord = (text, index) => {
		const word = document.createElement("span");
	  
		word.innerHTML = `${text} `;
	  
		word.classList.add("card-subtitle-word");
	  
		word.style.transitionDelay = `${index * 55}ms`;
	  
		return word;
	  };
	  
	  const addWord = (text, index, subtitleElement) =>
		subtitleElement.appendChild(createWord(text, index));
	  
	  const createSubtitle = (text, subtitleElement) =>
		text.split(" ").map((word, index) => addWord(word, index, subtitleElement));
	  
	  const subtitles = [
		{
		  element: document.getElementsByClassName("subtitle-1")[0],
		  text:
			"Currently in the process of completing the Cryptopals challenges in both CERT-C standard C code and also in Python - a series of many challenges designed to improve knowledge of cryptography and security",
		},
		{
		  element: document.getElementsByClassName("subtitle-2")[0],
		  text:
			"Tensorflow object detection models created and trained to recognise many British Sign Language signs for an education and translation platform",
		},
		{
		  element: document.getElementsByClassName("subtitle-3")[0],
		  text:
			"A probability-driven Battleships AI opponent using Python, and an original single-player Battleships game using a soundtrack composed by me",
		},
		{
		element: document.getElementsByClassName("subtitle-4")[0],
			text:
			  "An enigma machine simulation in Python using Object Oriented Programming",
		},
		{
		  element: document.getElementsByClassName("subtitle-5")[0],
		  text:
			"A personal informatics Flask web application that links a user's Spotify listening data to their productivity when working - 'does that 2 hour heavy metal playlist make me more productive...?'",
		},
		{
		  element: document.getElementsByClassName("subtitle-6")[0],
		  text:
			"A fully AI generated React application created in a team of 4 in the Bath Hack 2023 hackathon - 'Attends a hackathon. Writes 0 lines of code. Leaves'",
		},
		{
		  element: document.getElementsByClassName("subtitle-7")[0],
		  text:
			"The website you are scrolling through, with a small JavaScript game on the top of the home scree - try clicking a planet! Control the the spaceship with WASD and click to shoot the asteroids! Improvements to come soon...",
		},
		{
		  element: document.getElementsByClassName("subtitle-8")[0],
		  text:
			"An EPQ dissertation analysing the extreme ethical and moral issues surrounding Artificial Intelligence - discussing the potential future demise of humanity was definitely an interesting project",
		},
		{
			element: document.getElementsByClassName("subtitle-9")[0],
			text:
			  "Python program that solves given sudokus using recursion, backtracking, and heuristics",
		  },
	  ];
	  
	  subtitles.forEach(({ element, text }) => createSubtitle(text, element));
	  


	  document.addEventListener("DOMContentLoaded", function () {
		const cards = document.querySelectorAll(".card");
		const windowHeight = window.innerHeight;
	
		function checkCardPosition() {
		  for (let i = 0; i < cards.length; i++) {
			const card = cards[i];
			const cardPosition = card.getBoundingClientRect().top;
	
			if (cardPosition < windowHeight - (windowHeight/5)) {
			  card.classList.add("visible");
			} else {
			  card.classList.remove("visible");
			}
		  }
		}
	
		window.addEventListener("scroll", checkCardPosition);
		checkCardPosition();
	  });
	

	
	//Update the scroll for more widget to also include details on how to play the game:
	// Get the div
	// Get the span
	var span = document.querySelector('#message');

	// Define your messages
	var messages = ["On a computer? Click a planet to play", "On a computer? WASD to move, click to shoot", "Scroll for more"];

	// Set an initial index
	var index = 0;

	// Function to change the message
	function changeMessage() {
		// Fade out
		span.style.opacity = 0;

		// After transition ended, change text and fade in
		setTimeout(function() {
			// Update the text inside the span
			span.textContent = messages[index];

			// Update the index
			index = (index + 1) % messages.length; // This will loop back to 0 when it reaches the end of the array

			// Fade in
			span.style.opacity = 1;
		}, 500); // 500 to match the transition duration in the CSS
	}

	// Call the function every 3 seconds (3000 milliseconds)
	setInterval(changeMessage, 3000);



	

})(jQuery);
