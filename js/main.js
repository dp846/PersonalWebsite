
(function ($) {
	"use strict";
	var nav = $('nav');
  var navHeight = nav.outerHeight();
  
  $('.navbar-toggler').on('click', function() {
    if( ! $('#mainNav').hasClass('navbar-reduce')) {
      $('#mainNav').addClass('navbar-reduce');
    }
  })

  // Navbar theme selector
  document.addEventListener('DOMContentLoaded', function() {
	const bodyElement = document.body;
	const themeToggle = document.getElementById('theme-toggle');
	const bgImg = document.querySelector('.bg-image');
  
	themeToggle.addEventListener('click', function() {
	  bodyElement.classList.toggle('light-theme');
	  bodyElement.classList.toggle('dark-theme');
  
	  if (bodyElement.classList.contains('light-theme')) {
		bgImg.style.backgroundImage = 'url(../img/blue-background.png)';
	  } else {
		bgImg.style.backgroundImage = 'url(../img/orange-space.jpg)';
	  }
	});
  });
  

  

  
	// Call the function from Blast.js file as soon as the page loads
	startBlastJsEffect();

	//Scroll for more indicator
	const scrollForMore = document.querySelector('.scroll-for-more');

		function showHideScrollForMore() {
		if (window.scrollY === 0) {
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
			"This personal portfolio website you are scrolling through.",
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

})(jQuery);
