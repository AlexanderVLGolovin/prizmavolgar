/* XlntCode 2015-06-06  */

$(window).on('load', function () {
    'use strict';

    /* ==========================================================================
     Page Loader
     ========================================================================== */

    //$("#loader-wrapper").delay(0).fadeOut();
    //$("#loader").delay(0).fadeOut("slow");

    /* ==========================================================================
     Flexslider - Section Slider
     ========================================================================== */

    $('.flexslider').flexslider({
        animation: "slide", // Fade or Slide              
        selector: ".section-slides > li",
        animationLoop: true, // Autorun the slider 
        slideshow: true,
        pauseOnAction: true,
        pauseOnHover: true,
        slideshowSpeed: 200, // Speed in milliseconds 1000 = 1sec  
        directionNav: true, // Show navigation Arrows or not
        controlNav: false, // Show pagination in bottom
        prevText: "",
        nextText: ""
    });

    /* ==========================================================================
     Flexslider - App Slider
     ========================================================================== */

    $('.flexslider').flexslider({
        animation: "fade", // Fade or Slide              
        selector: ".app-slides > li",
        animationLoop: true, // Autorun the slider 
        slideshow: true,
        pauseOnAction: true,
        pauseOnHover: true,
        slideshowSpeed: 200, // Speed in milliseconds 1000 = 1sec  
        directionNav: true, // Show navigation Arrows or not
        controlNav: false, // Show pagination in bottom
        prevText: "",
        nextText: ""
    });

    /* ==========================================================================
     Flexslider - Column Slider
     ========================================================================== */

    $('.flexslider').flexslider({
        animation: "slide", // Fade or Slide              
        selector: ".column-slides > li",
        animationLoop: true, // Autorun the slider 
        slideshow: true,
        pauseOnAction: true,
        pauseOnHover: true,
        slideshowSpeed: 200, // Speed in milliseconds 1000 = 1sec  
        directionNav: true, // Show navigation Arrows or not
        controlNav: true, // Show pagination in bottom
        prevText: "",
        nextText: ""
    });

    /* ==========================================================================
     Flexslider - Team Slider
     ========================================================================== */

    $('.flexslider').flexslider({
        animation: "fade", // Fade only!              
        selector: ".team-slides > li",
        animationLoop: true, // Autorun the slider 
        slideshow: true,
        pauseOnAction: true,
        pauseOnHover: true,
        pauseInvisible: true,
        slideshowSpeed: 200, // Speed in milliseconds 1000 = 1sec
        animationSpeed: 0,
        directionNav: true, // Show navigation Arrows or not
        controlNav: false, // Show pagination in bottom
        prevText: "",
        nextText: ""
    });


    /* ==========================================================================
     Flexslider - Text Rotator
     ========================================================================== */

    $('.flexslider').flexslider({
        animation: "fade", // Fade or Slide              
        selector: ".text-slides > li",
        animationLoop: true, // Autorun the slider 
        slideshow: true,
        pauseOnAction: false,
        pauseOnHover: false,
        pauseInvisible: true,
        slideshowSpeed: 200, // Speed in milliseconds 1000 = 1sec
        animationSpeed: 0,
        directionNav: false, // Do not use!!
        controlNav: false, // Do not use!!
        prevText: "",
        nextText: ""
    });

    /* ==========================================================================
     Isotope.
     ========================================================================== */
    var $container = $('.portfolio-container');
    $container.isotope({
        filter: '*',
        animationOptions: {
            duration: 50,
            easing: 'linear',
            queue: false
        }
    }); //
    $('.creations-filter a').on('click', function () {
        $('.creations-filter .current').removeClass('current');
        $(this).addClass('current');

        var selector = $(this).attr('data-filter');
        $container.isotope({
            filter: selector,
            animationOptions: {
                duration: 250,
                easing: 'linear',
                queue: false
            }
        });
        return false;
    });
});

/* ==========================================================================
 Navbar
 ========================================================================== */

$(document).ready(function () {

    "use strict";

    // Dropdown
    $('ul.dropdown-menu [data-toggle=dropdown]').on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).parent().siblings().removeClass('open');
        $(this).parent().toggleClass('open');
    });

    // Prevent search-form to close on click (991px & smaller)
    $('input.form-control').on('click', function (e) {
        e.stopPropagation();
    });

    // Mobile dropdown menu scrollable all the way (for mobile/smaller devices)
    $(".navbar-collapse").css({maxHeight: $(window).height() - $(".navbar-header").height() + "px"});
    // Add class to last ul in navbar
    $(".navbar-right ul").last().addClass("last-nav-left");
    
    $(".nav.navbar-nav .dropdown-menu li.navbar-item a").on('click', function() {
       $('.navbar-collapse.collapse').removeClass('in');
    });


    /* ==========================================================================
     Testimonial Slider (jcarousel)
     ========================================================================== */
    $('.carousel').carousel({
        interval: 5000
    });

    /* ==========================================================================
     OWL - Slider "Brand Slider/Recent Work"
     ========================================================================== */
    $(".owl-carousel").owlCarousel({
        pagination: false,
        navigation: false,
        stopOnHover: false,
        paginationSpeed: 1000,
        autoPlay: 5000,
        goToFirstSpeed: 1000,
        singleItem: false,
        items: 5
    });
    /* ==========================================================================
     Pages Animations
     ========================================================================== */
    $('.fades, .bounces, .zooms, .flips').on('change', function () {
        var elem = $('#sandbox'),
                effect = $(this).val();
        elem.removeClass().addClass('animating bm-remove').addClass(effect);
        elem.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            elem.removeClass(effect).removeClass('animating');
        });
    });

    $('.show-off').on('change', function () {
        var elem = $('#sandbox'),
                effect = $(this).val(),
                exit = $(this).attr('data-exit');

        if (exit)
            animateEnd('#sandbox', true, true, effect);
        else
            animate('#sandbox', effect);
    });

    /* ==========================================================================
     Count Up
     ========================================================================== */
    jQuery('.counter-1').appear(function () {
        $('.counter-1').countTo({
            from: 0,
            to: 1780,
            speed: 4000,
            refreshInterval: 50,
            onComplete: function (value) {
                //console.debug(this); 
            }
        });
    });
    jQuery('.counter-2').appear(function () {
        $('.counter-2').countTo({
            from: 0,
            to: 456,
            speed: 4000,
            refreshInterval: 50,
            onComplete: function (value) {
                //console.debug(this); 
            }
        });
    });
    jQuery('.counter-3').appear(function () {
        $('.counter-3').countTo({
            from: 0,
            to: 1254,
            speed: 4000,
            refreshInterval: 50,
            onComplete: function (value) {
                //console.debug(this); 
            }
        });
    });
    jQuery('.counter-4').appear(function () {
        $('.counter-4').countTo({
            from: 0,
            to: 372,
            speed: 4000,
            refreshInterval: 50,
            onComplete: function (value) {
                //console.debug(this); 
            }
        });
    });
    jQuery('.counter-5').appear(function () {
        $('.counter-5').countTo({
            from: 0,
            to: 19279,
            speed: 4000,
            refreshInterval: 50,
            onComplete: function (value) {
                //console.debug(this); 
            }
        });
    });
    jQuery('.counter-6').appear(function () {
        $('.counter-6').countTo({
            from: 0,
            to: 199,
            speed: 4000,
            refreshInterval: 50,
            onComplete: function (value) {
                //console.debug(this); 
            }
        });
    });


    /* ==========================================================================
     Contact Form Validation
     ========================================================================== */

    $('#contact-form').validate({
        highlight: function (element, errorClass) {
            $(element).fadeOut(function () {
                $(element).fadeIn();
            });
        },
        rules: {
            name: {
                required: true,
                minlength: 2
            },
            email: {
                required: true,
                email: true
            },

            message: {
                required: true
            }
        },
        messages: {
            name: "<i class='fa fa-exclamation-triangle'></i>Please specify your name.",
            email: {
                required: "<i class='fa fa-exclamation-triangle'></i>We need your email address to contact you.",
                email: "<i class='fa fa-exclamation-triangle'></i>Please enter a valid email address."
            },
            message: "<i class='fa fa-exclamation-triangle'></i>Please enter your message."

        },
        submitHandler: function (form) {
            $(form).ajaxSubmit({
                type: "POST",
                data: $(form).serialize(),
                url: "send.php",
                success: function () {
                    $('#contact-form :input').attr('disabled', 'disabled');
                    $('#contact-form').fadeTo("slow", 0.15, function () {
                        $(this).find(':input').attr('disabled', 'disabled');
                        $(this).find('label').css('cursor', 'default');
                        $('.success-msg').fadeIn();
                    });
                },
                error: function () {
                    $('#contact-form').fadeTo("slow", 0.15, function () {
                        $('.error-msg').fadeIn();
                    });
                }
            });
        }
    });

    /* ==========================================================================
     Validation Of Subscribe Form
     ========================================================================== */

    $("#email").on("input", function (e) {

        e.preventDefault(); //prevent default action//////

        var email = $("#email").val();

        if (email.trim() == "") {
            // let the submit button be disabled
            $("#mc-subscribe").prop('disabled', true);
        } else {
            // make the submit button working//////
            $("#mc-subscribe").prop('disabled', false);
        }
    });

    $("#mc-subscribe").on('click', function (e) {

        e.preventDefault(); // prevent default action////

        var email = $("#email").val();

        $("#error").hide();
        $("#success").hide();
        $("#loadigImageDiv").show();

        if (!validateEmail(email)) { // validation for email addressssss////////
            $("#loadigImageDiv").hide();


            $("#error").html('<p><i class="fa fa-exclamation-triangle"></i>' + 'Please provide a valid email address!</p>');
            $("#error").fadeIn("slow");
        } else { ////// if email is valid ////////
            $.ajax({
                type: "POST",
                url: "mc-config/subscribe.php", // send the post data for validation there
                data: {email: email}
            }).done(function (msg) {
                $("#loadigImageDiv").hide();
                var responseObj = JSON.parse(msg);
                if (responseObj.status == "success") {
                    $("#success").html(responseObj.message);
                    $("#success").fadeIn(1000);
                } else if (responseObj.status == "failed") {
                    $("#error").html(responseObj.message);
                    $("#error").fadeIn(1000);
                }
            });
        }
    });

    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }


    /* ==========================================================================
     FullScreen 
     ========================================================================== */
    //Fullscreen Header
    var h = $(window).height();
    $("#section-fs-header, #fs-parallax-header").css("min-height", h);
    $(window).resize(function () {
        var xh = $(window).height();
        $("#section-fs-header, #fs-parallax-header").css("min-height", xh);
    });

    /* ==========================================================================
     Google Maps.
     ========================================================================== */
    // map button toggle
    $('.gmap-btn').on('click', function () {
        $('#map-btn1').toggleClass('btn-show', 'btn-hide', 1000);
        $('#map-btn1').toggleClass('btn-hide', 'btn-show', 1000);
        $('#map-btn2').toggleClass('btn-hide', 'btn-show', 1000);
        $('#map-btn2').toggleClass('btn-show', 'btn-hide', 1000);
        $('#map-btn2').toggleClass('close-map-button', 'open-map-button', 1000);
        $('#map-btn2').toggleClass('open-map-button', 'close-map-button', 1000);
        $('#map').toggleClass('close-map', 'open-map', 1000);
        $('#map').toggleClass('open-map', 'close-map', 1000);
        return false;
    });
    // Make your settings below 
    function init_map() {
        var myLocation = new google.maps.LatLng(37.3321082, -122.0307465);

        var mapOptions = {
            center: myLocation,
            zoom: 15,
            scrollwheel: false,
            draggable: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: gmapGreyscaleStyle
        };

        var image = 'assets/img/ico/marker.png';
        var marker = new google.maps.Marker({
            position: myLocation,
            icon: image,
        });

        var map = new google.maps.Map(document.getElementById("google-map"),
                mapOptions);

        marker.setMap(map);

    }

//    google.maps.event.addDomListener(window, 'load', init_map);

    /* ===================================================================
     Accordions "Plus & Minus" Icons
     ===================================================================*/
    $('.collapse').on('shown.bs.collapse', function () {

        $(this).parent().find(".icon-plus").removeClass("icon-plus").addClass("icon-minus");

    }).on('hidden.bs.collapse', function () {

        $(this).parent().find(".icon-minus").removeClass("icon-minus").addClass("icon-plus");

    });
    /* ===================================================================
     CountDown
     ===================================================================*/
    setInterval(function () {
        var future = new Date("Dec 24 2015 21:15:00 GMT+0200");  // date to count down
        var now = new Date();
        var difference = Math.floor((future.getTime() - now.getTime()) / 1000);

        var seconds = fixIntegers(difference % 60);
        difference = Math.floor(difference / 60);

        var minutes = fixIntegers(difference % 60);
        difference = Math.floor(difference / 60);

        var hours = fixIntegers(difference % 24);
        difference = Math.floor(difference / 24);


        var days = difference;

        $(".seconds").text(seconds);
        $(".minutes").text(minutes);
        $(".hours").text(hours);
        $(".days").text(days);

    }, 1000);

    function fixIntegers(integer)
    {
        if (integer < 0)
            integer = 0;
        if (integer < 10)
            return "0" + integer;
        return "" + integer;
    }
    /* ===================================================================
     Fancybox
     ===================================================================*/

    /*
     *  Simple image gallery. Uses default settings
     */

    $(".fancybox").fancybox({
        padding: 0,
        width: 800,
        height: 'auto',
        maxWidth: 9999,
        maxHeight: 9999,
        pixelRatio: 1, // Set to 2 for retina display support

        autoSize: false,
        autoHeight: false,
        autoWidth: false,
        autoResize: true,
        fitToView: true

    });
    /*
     *  Different effects
     */

    // Change title type, overlay closing speed
    $(".fancybox-effects-a").fancybox({
        helpers: {
            title: {
                type: 'outside'
            },
            overlay: {
                speedOut: 0
            }
        }
    });

    // Disable opening and closing animations, change title type
    $(".fancybox-effects-b").fancybox({
        openEffect: 'none',
        closeEffect: 'none',

        helpers: {
            title: {
                type: 'over'
            }
        }
    });

    // Set custom style, close if clicked, change title type and overlay color
    $(".fancybox-effects-c").fancybox({
        wrapCSS: 'fancybox-custom',
        closeClick: true,

        openEffect: 'none',

        helpers: {
            title: {
                type: 'inside'
            },
            overlay: {
                css: {
                    'background': 'rgba(238,238,238,0.85)'
                }
            }
        }
    });

    // Remove padding, set opening and closing animations, close if clicked and disable overlay
    $(".fancybox-effects-d").fancybox({
        padding: 0,

        openEffect: 'elastic',
        openSpeed: 150,

        closeEffect: 'elastic',
        closeSpeed: 150,

        closeClick: true,

        helpers: {
            overlay: null
        }
    });

    /*
     *  Button helper. Disable animations, hide close button, change title type and content
     */

    $('.fancybox-buttons').fancybox({
        openEffect: 'none',
        closeEffect: 'none',

        prevEffect: 'none',
        nextEffect: 'none',

        closeBtn: false,

        helpers: {
            title: {
                type: 'inside'
            },
            buttons: {}
        },

        afterLoad: function () {
            this.title = 'Image ' + (this.index + 1) + ' of ' + this.group.length + (this.title ? ' - ' + this.title : '');
        }
    });


    /*
     *  Thumbnail helper. Disable animations, hide close button, arrows and slide to next gallery item if clicked
     */

    $('.fancybox-thumbs').fancybox({
        prevEffect: 'none',
        nextEffect: 'none',

        closeBtn: false,
        arrows: false,
        nextClick: true,

        helpers: {
            thumbs: {
                width: 50,
                height: 50
            }
        }
    });

    /*
     *  Media helper. Group items, disable animations, hide arrows, enable media and button helpers.
     */
    $('.fancybox-media')
            .attr('rel', 'media-gallery')
            .fancybox({
                openEffect: 'none',
                closeEffect: 'none',
                prevEffect: 'none',
                nextEffect: 'none',

                arrows: false,
                helpers: {
                    media: {},
                    buttons: {}
                }
            });

    /*
     *  Open manually
     */

    $("#fancybox-manual-a").on('click', function () {
        $.fancybox.open('1_b.jpg');
    });

    $("#fancybox-manual-b").on('click', function () {
        $.fancybox.open({
            href: 'iframe.html',
            type: 'iframe',
            padding: 5
        });
    });

    $("#fancybox-manual-c").on('click', function () {
        $.fancybox.open([
            {
                href: '1_b.jpg',
                title: 'My title'
            }, {
                href: '2_b.jpg',
                title: '2nd title'
            }, {
                href: '3_b.jpg'
            }
        ], {
            helpers: {
                thumbs: {
                    width: 75,
                    height: 50
                }
            }
        });
    });

    /* ===================================================================
     Fancybox 2.1.5 - iframe popup settings
     ===================================================================*/

    $(".various").fancybox({
        padding: 0,
        margin: 40,
        maxWidth: 9999,
        maxHeight: 9999,
        fitToView: true,
        width: '95%',
        height: '95%',
        autoSize: true,
        mouseWheel: true,
        closeClick: false,
        closeBtn: true,
        openEffect: 'none',
        closeEffect: 'none',
        iframe: {scrolling: 'auto', preload: true}

    });

});
/* =========================================================================
 Parallax 
 ========================================================================= */
(function ($) {
    'use strict';
    $(document).ready(function () {
        $(window).bind('load', function () {
            parallaxInit();
        });
        function parallaxInit() {
            testMobile = isMobile.any();
            if (testMobile == null)
            {
                $('.parallax-01').parallax("50%", 0.5);
                $('.parallax-02').parallax("50%", 0.5);
                $('.parallax-03').parallax("50%", 0.5);
            }
        }
        parallaxInit();
    });
// Mobile Detect
    var testMobile;
    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
}(jQuery));



