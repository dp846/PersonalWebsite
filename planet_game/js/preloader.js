
(function ($) {
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
            }, 2100); // Adjust this timeout to control the minimum display time of the preloader
        }
    });

})(jQuery);