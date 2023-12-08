/*--------------------- Copyright (c) 2023 -----------------------
[Master Javascript]
Project: Portfolio html
-------------------------------------------------------------------*/
(function ($) {
	"use strict";
	var NightClub = {
		initialised: false,
		version: 1.0,
		mobile: false,
		init: function () {
			if (!this.initialised) {
				this.initialised = true;
			}
			else {
				return;
			}
			/*-------------- Portfolio Functions Calling ---------------------------------------------------
			------------------------------------------------------------------------------------------------*/
			
			this.pages_slider();
			this.bottom_top();
			this.loader();	
			this.toggle_menu();
		},

		/*-------------- Portfolio Functions Calling ---------------------------------------------------
		--------------------------------------------------------------------------------------------------*/

		// Inner Pages Slider			
		pages_slider: function () {
			var swiper = new Swiper('.cv_pages_slider1', {
				slidesPerView: 3,
				spaceBetween: 20,
				centeredSlides: true,
				loop: true,
				speed: 3000,
				autoplay: {
					delay: 1500,
					disableOnInteraction: false,
				},
				breakpoints: {
					1700: {
						slidesPerView: 2.7,
						spaceBetween: 20,
					},
					1199: {
						slidesPerView: 3,
						spaceBetween: 20,
					},
					992: {
						slidesPerView: 2,
						spaceBetween: 20,
					},
					768: {
						slidesPerView: 2,
						spaceBetween: 20,
					},
					575: {
						slidesPerView: 1,
						spaceBetween: 15,
					},
					320: {
						slidesPerView: 1,
						spaceBetween: 15,
					}
					,
					0: {
						slidesPerView: 1,
						spaceBetween: 15,
					}
				}
			});

			var swiper = new Swiper('.cv_pages_slider2', {
				slidesPerView: 3,
				spaceBetween: 20,
				centeredSlides: true,
				loop: true,
				speed: 4000,
				autoplay: {
					delay: 2500,
					disableOnInteraction: false,
					reverseDirection: true,
				},
				breakpoints: {
					1199: {
						slidesPerView: 3,
						spaceBetween: 20,
					},
					992: {
						slidesPerView: 2,
						spaceBetween: 20,
					},
					768: {
						slidesPerView: 2,
						spaceBetween: 20,
					},
					575: {
						slidesPerView: 1,
						spaceBetween: 15,
					},
					320: {
						slidesPerView: 1,
						spaceBetween: 15,
					}
					,
					0: {
						slidesPerView: 1,
						spaceBetween: 15,
					}
				}
			});

			var swiper = new Swiper('.cv_pages_slider3', {
				slidesPerView: 3,
				spaceBetween: 20,
				centeredSlides: true,
				loop: true,
				speed: 3000,
				autoplay: {
					delay: 2000,
					disableOnInteraction: false,
				},
				breakpoints: {
					1700: {
						slidesPerView: 2.7,
						spaceBetween: 20,
					},
					1199: {
						slidesPerView: 3,
						spaceBetween: 20,
					},
					992: {
						slidesPerView: 2,
						spaceBetween: 20,
					},
					768: {
						slidesPerView: 2,
						spaceBetween: 20,
					},
					575: {
						slidesPerView: 1,
						spaceBetween: 15,
					},
					320: {
						slidesPerView: 1,
						spaceBetween: 15,
					}
					,
					0: {
						slidesPerView: 1,
						spaceBetween: 15,
					}
				}
			});
		},


		// Bottom To Top
		bottom_top: function () {
			if ($('#button').length > 0) {
				var btn = $('#button');
				var fixed = $('.cv_header_wrapper')
				$(window).scroll(function () {
					if ($(window).scrollTop() > 300) {
						btn.addClass('show');
						fixed.addClass('fixed')
					} else {
						btn.removeClass('show');
						fixed.removeClass('fixed')
					}
				});
				btn.on('click', function (e) {
					e.preventDefault();
					$('html, body').animate({ scrollTop: 0 }, '300');
				});
			}
		},
		
		// loader			
		loader: function () {
			jQuery(window).on('load', function () {
				$(".loader").fadeOut();
				$(".spinner").delay(500).fadeOut("slow");
			});
		},
		
		// toggle menu
		toggle_menu: function(){
			$('.cv_nav_btn span, .cv_body_overlay').on('click', function () {
				$('body').toggleClass('menu-open');
			})
			let mouseCursor = document.querySelector(".cv_close");
			window.addEventListener('mousemove', cv_close);
			function cv_close (e) {
				mouseCursor.style.top = e.pageY + 'px';
				mouseCursor.style.left = e.pageX + 'px';
			}
		},



	};
	NightClub.init();

}(jQuery));

