import { myLocation, pathnameRoot, isMyLocationHideMode} from './commonFunc/locating.js';
import {con} from './commonFunc/consoling.js';
import {queriesT, hashesExist} from './commonFunc/urlEncoder.js';

$(function(){


	if(isMyLocationHideMode("/web/paseo/")){

		const linksHelp = $('h4.panel-title a');
		let actualImgColl;
		let theCarousel;
		let currentVersionMainImg;
		var imgs = [];
		var idSpan;

		let mainCollection = {};
		var collectionDone = false;

		let inter;


		// $(window).scroll(function(){
		// 	var top = $(this).scrollTop();
		// 	con(top);
		// });

		$(document).ready(function(){

			$('div.panel-default').each(function(idx, e){
				mainCollection[`panel-${idx}`] = {};
				mainCollection[`panel-${idx}`]['parentCarousel'] = $(e).find('div.versionsCarousel');
				mainCollection[`panel-${idx}`]['thumbnails'] = [];
				
				var thumbUnits = $(e).find('div.thumbImgsCont').children('div.carThumbImgUnit');

				thumbUnits.map(function(idex, item){
					var itemObj = {};
					itemObj.imgSpanId = $(item).find('span.thumbIdSpan').text();
					itemObj.img = $(item).find('img.carThumb').attr('src');

					mainCollection[`panel-${idx}`]['thumbnails'].push(itemObj);
				})
			});

			collectionDone = true;
		});

		if(hashesExist){
			if(!collectionDone){
				wait(null);
			}else{
				triggerAlone();
			}
		}

		function wait(flag){
			inter = setInterval(ask, 10);
		}

		function ask(){
			(collectionDone) ? (clearInterval(inter), triggerAlone()) : con('hi');
		}

		function triggerAlone(){
			var anchorId = queriesT.to;
			//console.log('bef',anchorId, collectionDone);

			$(`a#${anchorId}`).trigger('click');
		}

		$('span.spanNext').click(function(e){
			var thisLink = $(e.target).data('to');

			//con(thisLink);

			$(`a#${thisLink}`).trigger('click');
		});

		linksHelp.on('click', function(e){onClick(e.target)});

		function onClick(e){
			imgs = [];
			var linkData = $(e).data('anchor');

			var linktop = $(e).data('top');

			var topAlt = $(e).offset().top - 40;

			//console.log(linktop, topAlt, 'linktop');

			try{

				$("body").animate({
					scrollTop: `${linktop}px`
				}, 10);

				$("html").animate({
					scrollTop: `${linktop}px`
				}, 10);

				if($(window).scrollTop() !== linktop){ window.scrollTo(0, linktop);}

			}catch(err){

				console.log(err);

			}




			theCarousel = mainCollection[`${linkData}`].parentCarousel;

			let thumbsCont = $(theCarousel).find('div.thumbImgsCont');

			mainCollection[`${linkData}`].thumbnails.forEach((obj, ind) => {
				imgs.push(obj);
			});

			let currentVersionMainImg = $(thumbsCont).find('img.carThumb').first();
			
			idSpan = $(theCarousel).find('span.currentVersionId');


			actualImgColl = mainCollection[`${linkData}`].thumbnails[0];
			let hiddenIdThumb = actualImgColl.imgSpanId;


			idSpan.text(hiddenIdThumb);

			sizeCarousel(theCarousel, currentVersionMainImg);
			activateThumbnails(currentVersionMainImg);

			let activeHead = $(e).closest('div.panel-heading');
			

			classFunc($('div.panel-heading'), 'activeHead', 'r');
			classFunc(activeHead, 'activeHead', 'a');

			//remove from others elements the activeCarousel class and add it to the active one
			classFunc([$('div.versionsCarousel'), $('div.thumbImgsCont')], 'activeCarousel', 'r');
			classFunc([theCarousel, thumbsCont], 'activeCarousel', 'a');

			let firstImage = actualImgColl.img;

			$(theCarousel).css({
				'background-image': `url(${firstImage})`
			});

		}

		function classFunc(el, classN, flag){
			if($.isArray(el)){
				if(flag === 'a'){
					$(el).each((id, e) => {
						// con(e);
						$(e).addClass(classN);
					});
				}else if(flag === 'r'){
					$(el).each((id, e) => {
						// con(e);
						$(e).removeClass(classN);
					});
				}
			}else{
				if(flag === 'a'){
					$(el).addClass(classN);
				}else if(flag === 'r'){
					$(el).removeClass(classN);
				}
			}
		}


		var carouselDirection = '';
		var nextCarouselImg = '',
		nextCarouselSpanId = '';
		var currentCarouselIdSpan = '';

		//when clicking on carousel's left-right arrows

		$(document).on('click', 'div.arrowsCont span', function(){
			var el = $(this);

			(el.hasClass('leftArr')) ? carouselDirection = 'left' : carouselDirection = 'right';

			currentCarouselIdSpan = $(theCarousel).find('span.currentVersionId').text();

			carouselMechanich(null, null);

		});

		//when clicking in the thumbnails under the carousel

		$(document).on('click', 'div.carThumbImgUnit', function(){

			//var imgSelectedUrl = $(this).find('img').attr('src');
			var imgSelected = $(this).find('img');
			var spanThmbId = $(this).find('span.thumbIdSpan').text();

			carouselMechanich(imgSelected, spanThmbId);

			activateThumbnails(imgSelected);

		});

		function activateThumbnails(imgSel) {

			var imgsCollection = $(imgSel).closest('div.thumbImgsCont').find('img.carThumb');
			imgsCollection.removeClass('active');
			imgSel.addClass('active');

		}

		var indexOfCurrImg = -1;

		function carouselMechanich(img, num) {

			//when an arrow was click
			if(img === null){
				$.each(imgs, function(idex, itm){
					//console.log(itm, currentCarouselIdSpan);
					if(itm.imgSpanId == currentCarouselIdSpan){
						indexOfCurrImg = idex;
					}
				});

				let usefullNum;

				if(carouselDirection === 'left'){
					//if is the first image in the array of images
					if(indexOfCurrImg === 0){
						//the next image is gonna be the last image in the array of images
						//the id of the carousel is gonna be the last image's id in the array of images
						usefullNum = imgs.length - 1;

					//if its not the first image
					}else{
						//the next image is gonna be the previous image in the array of images
						//the id of the carousel is gonna be the previous image's id in the array of images
						usefullNum = indexOfCurrImg - 1;
					}

				}else if(carouselDirection === 'right'){
					//if is the last image in the array of images
					if(indexOfCurrImg === (imgs.length - 1)){
						//the next image is gonna be the first image in the array of images
						//the id of the carousel is gonna be the first image's id in the array of images
						usefullNum = 0;

					//if its not the last image	
					} else {
						//the next image is gonna be the next image in the array of images
						//the id of the carousel is gonna be the next image's id in the array of images
						usefullNum = indexOfCurrImg + 1;
					}
				}

				nextCarouselImg = imgs[usefullNum]['img'];
				nextCarouselSpanId = imgs[usefullNum]['imgSpanId'];

				theCarousel.css({'background-image': `url(${nextCarouselImg})`});
				idSpan.text(nextCarouselSpanId);

				var activeImage = $(`img.carThumb[src='${nextCarouselImg}']`);

				activateThumbnails(activeImage);

			}else{

				theCarousel.css({'background-image': `url(${$(img).attr('src')})`});
				idSpan.text(num);
			}

			// $()

		}

		//end carousel mechanich
		$(window).resize(function(){
			let car = $('div.versionsCarousel.activeCarousel');
			let cImg = $('div.thumbImgsCont.activeCarousel').find('img.carThumb.active').first();

			if(car.length){
				sizeCarousel(car, cImg);
			}
		});

		var exceededProportionalHeight = 0;
		function sizeCarousel(carousel, currentImg) {
			//console.log(carousel, carousel.width(), $(carousel).width());
			
			var widthImg = carousel.closest('div.panel-default').find('div.panel-heading').width();
			var windWidth = $(window).width();

			let thumbImgsCont = $(carousel).find('div.thumbImgsCont');
			let thumbImgsBar = $(thumbImgsCont).find('div.thumbImgsBar');

			var fakeImg = new Image();

			fakeImg.src = currentImg.attr('src');

			var picWidth = fakeImg.width;   
			var picHeight = fakeImg.height;


			if(thumbImgsCont.find('div.carThumbImgUnit').length >= 7){
				
				thumbImgsCont.css({
					bottom: '11%',
					'justify-content': 'initial',
					height: '65%'
				});

				if(windWidth <= 310){
					exceededProportionalHeight = 0.17;
				}else if(windWidth > 310 && windWidth <= 410){
					exceededProportionalHeight = 0.15;
				}else if(windWidth > 410 && windWidth <= 510){
					exceededProportionalHeight = 0.135;
				}else if(windWidth > 510){
					exceededProportionalHeight = 0.12;
				}
				
			}else{

				exceededProportionalHeight = 0.1075502;
			}


			var imgProportionalHeight = picHeight/picWidth;
			var heightBackground = widthImg * imgProportionalHeight;

			var thumbsBarHeight = exceededProportionalHeight * widthImg;

			thumbImgsBar.height(thumbsBarHeight);


			var totalProportionalHeight = imgProportionalHeight + exceededProportionalHeight;
			//console.log(widthImg, totalProportionalHeight);

			var heightCarousel = widthImg * totalProportionalHeight;
			
			carousel.height(heightCarousel);
		}
	
	}




});