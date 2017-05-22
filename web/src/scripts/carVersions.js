import {isMyLocationExpMode, myLocation, pathnameRoot} from './commonFunc/locating.js';
import {con} from './commonFunc/consoling.js';
import {sendPostToGo, sendPostToGet} from './commonFunc/httpProcesor.js';
import {queriesT, hashesExist} from './commonFunc/urlEncoder.js';
import {notNullNotUndefined, NullOrUndefined} from './commonFunc/differentOfNullAndUndefined.js';

$(function(){
	var versions = [];
	var currentVersion = {};
	var currentVersionImgs = [];
	var currentVersionMainImg = '';
	var versionsArr = [];

	const theCarousel = $('div.versionsCarousel'),
	infoContainer = $('div.versionDetailCont'),
	idSpan = $('span.currentVersionId'),
	thumbsBar = $('div.thumbImgsBar'),
	metaTitle = $('meta.metaTitle'),
	metaDescrip = $('meta.metaDescrip'),
	metaImg = $('meta.metaImg');


	if(isMyLocationExpMode("/web/catalogo/modelo-versiones")){

		var brandName = sessionStorage.getItem('currentBrandName');

		$(document).ready(function(){

			if(notNullNotUndefined(sessionStorage.getItem('currentBrandImg')) && versionsArr.length > 0 && sessionStorage.getItem('currentBrandImg') !== 'nothing stored'){

				displayBrand();

			}

			startCarousel();
		});

		var askInterval = setInterval(function(){
		
			var versionsStored = sessionStorage.getItem('versionsArr');
			checkVersions(versionsStored, null);

		}, 5);

		var askPhotosInterval = setInterval(function(){
		
			var versionsPhotosStored = sessionStorage.getItem('versionsPhotos');
			checkVersions(null, versionsPhotosStored);

		}, 5);


	    var thumbImgsCont = $('div.thumbImgsCont');


		function checkVersions(argument, pict) {
			if(notNullNotUndefined(argument) && argument !== 'nothing stored'){
				clearInterval(askInterval);
				versions = argument;
				manageVersions(versions);
		    }
		    if(notNullNotUndefined(pict) && pict !== 'nothing stored'){
				clearInterval(askPhotosInterval);
				var photos = pict;

				//displayCarousel(JSON.parse(photos));
				(hashesExist) ?  getVersionsPhotos(queriesT.mdlId) : displayCarousel(JSON.parse(photos));
		    }	
		}




		function manageVersions(argument) {
			versionsArr = JSON.parse(argument);
			currentVersion = versionsArr[0];

			if(notNullNotUndefined(sessionStorage.getItem('currentBrandImg')) && sessionStorage.getItem('currentBrandImg') !== 'nothing stored'){

				displayBrand();

			}
			

			if(hashesExist){

				(currentVersion.model_id = queriesT.mdlId) ? displayVersionsInfo() :  getVersions(queriesT.mdlId);
			
			}else{

				displayVersionsInfo();
				
			}
						
		}

		var imgs = [];
		var currentVersionId;

		function getVersionsPhotos(modelId){
			modelId = parseInt(modelId);

		    var device = localStorage.getItem('deviceId');
		    var dataForPhotos = {};

		    if(notNullNotUndefined(device) && modelId){
		      dataForPhotos = {'device': device, modelId: modelId};
		    }
		            
		    dataForPhotos = JSON.stringify(dataForPhotos);

		    $.post('http://fuxkar.com/ws/v2/catalogo/getgaleria',
		      dataForPhotos).then(function(res){
		        if(res.estado === 1){
		          var versionsPicts = res.mensaje.rs;
		          //con(versionsPicts);
		          displayCarousel(versionsPicts);
		          versionsPicts = JSON.stringify(versionsPicts);
		          sessionStorage.setItem('versionsPhotos', versionsPicts);
		        }
		      }).fail(function(err){
		        console.log(err);
		      });
		}

		function displayCarousel(picts) {


			var imgsCont = $('div.thumbImgsCont');
			var arrowsCont = $('div.arrowsCont');

			$.map(picts.galeria, function(arrItem, idx){

				imgs.push({pict: arrItem.pic_url, id: idx});

			});

			changeCarBackPos(imgs[0].pict, null);

			metaImg.attr('content', imgs[0].pict);

			theCarousel.find('div.sk-circle').remove();

			$(theCarousel).css({
				'background-image': `url(${imgs[0].pict})`
			});

			currentVersionId = imgs[0].id;
			idSpan.text(currentVersionId);

			currentVersionMainImg = imgs[0].pict;

			var classes = '';
			imgs.forEach(function(item, idx){
				(idx === 0) ? classes = 'carThumb active' : classes = 'carThumb';

				var imgPrototype = `<div class="carThumbImgUnit"><span class="thumbIdSpan hiddenItm">${item.id}</span><img src="${item.pict}" class="${classes} img${idx} thumbImg img-responsive"></div>`;

				imgsCont.append(imgPrototype);
			});

			if(imgs.length <= 1){
				arrowsCont.hide();
			}

			sizeCarousel();

		}

		function getVersions(modelId) {
		    var device = localStorage.getItem('deviceId');

		    if(notNullNotUndefined(device) && modelId){

		        var data = (notNullNotUndefined(localStorage.getItem('aUsr'))) ? {'device': device, modelId: modelId, user: localStorage.getItem('aUsr')} : {'device': device, modelId: modelId};
		          
		      data = JSON.stringify(data);

		      $.post('http://fuxkar.com/ws/v2/catalogo/getversiones',
		        data).then(function(res){
		          if(res.estado === 1){
		            versionsArr = res.mensaje.rs;
		          	currentVersion = versionsArr[0];
					displayVersionsInfo();
		            versionsArr = JSON.stringify(versionsArr);
		            sessionStorage.setItem('versionsArr', versionsArr);
		          }
		        }).fail(function(err){
		          console.log(err);
		        });

		    }
		}

		function displayVersionsInfo() {
			var img = {};
			var versionRow = '';
			var versionRowLine = '';
			//con(versionsArr);
			$.each(versionsArr, function(idx, objItm){

				var hrefPath = (notNullNotUndefined(localStorage.getItem('aUsrA'))) ? `${pathnameRoot}catalogo/specific-version?al=${localStorage.getItem('aUsrA')}&brdId=${objItm.brand_id}&mdlId=${objItm.model_id}&cId=${objItm.id}` : `${pathnameRoot}catalogo/specific-version?brdId=${objItm.brand_id}&mdlId=${objItm.model_id}&cId=${objItm.id}`;

				var versName = objItm.name;
				var verPrice = objItm.starting_price;
				var verId = objItm.id;
				($.isArray(objItm.pic_web)) ? img = {pict: objItm.pic_web[0], id: objItm.id} : img = {pict: objItm.pic_web, id: objItm.id};

				(idx === 0) ? versionRowLine = `<div class="row-fluid childHeight versionDetailRow active">` : versionRowLine = `<div class="row-fluid childHeight versionDetailRow">`;
			
				versionRow = `${versionRowLine}
	                                <div class="versionImg col-xs-3 col-sm-2">
	                                    <img src="${img.pict}" class="img-responsive">
	                                </div>
	                                <div class="col-xs-8 col-sm-9 versionDetail">
	                                    <span class="versionName">${versName}</span>
	                                    <span class="versionPrice">$ ${verPrice}</span>
	                                    <span class="versionId hiddenItm">${verId}</span>
	                                </div>
	                                <div class="col-xs-1 noPadding goToDetailArrow">
	                                    <a href="${hrefPath}" class="goToDetailAnchor">
	                                    	<span class="glyphicon glyphicon-menu-right"></span>
	                                    </a>
	                                </div>
	                            </div>`;

				infoContainer.append(versionRow);

			});
		}

		//when clicking in version info tag under carousel

		$(document).on('click', 'div.versionDetailRow', function(){
			var el = $(this);
			
			activatingInfoTag(el, false);

		});

		function activatingInfoTag(el, go) {

			var elements = $('div.versionDetailRow');
			var selVerName = $(el).find('span.versionName').text();


			elements.removeClass('active');
			el.addClass('active');

			sessionStorage.removeItem('versionStored');

			var selectedVersObj = $.grep(versionsArr, function (itm, idx) {

				var currObjName = itm.name.replace(/"/g, '');

				return currObjName === selVerName;
			});

			currentVersion = selectedVersObj[0];
			if(go){sendPostToGo(currentVersion, null, 'specVer');}
			var versionStored = JSON.stringify(currentVersion);
			sessionStorage.setItem('versionStored', versionStored);
		}

		$(document).on('click', 'div.goToDetailArrow', function(){
			var el = $(this).closest('div.versionDetailRow');
			activatingInfoTag(el, true);
		});


		$(document).on('click', 'a.goToDetailAnchor', function(e){
			e.preventDefault();
		});

		//start carousel mechanich

		var carouselDirection = '';
		var nextCarouselImg = '',
		nextCarouselSpanId = '';
		var currentCarouselImg = '';
		var currentCarouselIdSpan = '';

		//when clicking on carousel's left-right arrows

		$(document).on('click', 'div.arrowsCont span', function(){
			var el = $(this);

			(el.hasClass('leftArr')) ? carouselDirection = 'left' : carouselDirection = 'right';

			currentCarouselImg = theCarousel.css('background-image');
			currentCarouselIdSpan = theCarousel.find('span.currentVersionId').text();
			var idxFQuote = currentCarouselImg.indexOf('"') + 1;
			var idxLQuote = currentCarouselImg.lastIndexOf('"');

			//defining the actual image visible in carousel

			currentCarouselImg = currentCarouselImg.substring(idxFQuote, idxLQuote);

			carouselMechanich(null, null);

		});

		//when clicking in the thumbnails under the carousel

		$(document).on('click', 'div.carThumbImgUnit', function(){

			var imgSelectedUrl = $(this).find('img').attr('src');
			var imgSelected = $(this).find('img');
			var spanThmbId = $(this).find('span.thumbIdSpan').text();

			carouselMechanich(imgSelectedUrl, spanThmbId);

			activateThumbnails(imgSelected);

		});

		function activateThumbnails(imgSel) {

			var imgsCollection = $('div.carThumbImgUnit').find('img.carThumb');
			imgsCollection.removeClass('active');
			imgSel.addClass('active');
		}

		var indexOfCurrImg = -1;

		function carouselMechanich(img, num) {

			if(img === null){
				$.each(imgs, function(idex, itm){
					if(itm.id === parseInt(currentCarouselIdSpan)){
						indexOfCurrImg = idex;
					}
				});

				if(carouselDirection === 'left'){
					//if is the first image in the array of images
					if(indexOfCurrImg === 0){
						//the next image is gonna be the last image in the array of images
						nextCarouselImg = imgs[imgs.length - 1].pict;
						//the id of the carousel is gonna be the last image's id in the array of images
						nextCarouselSpanId = imgs[imgs.length - 1].id;

					//if its not the first image
					}else{ 
						//the next image is gonna be the previous image in the array of images
						nextCarouselImg = imgs[indexOfCurrImg - 1].pict; 
						//the id of the carousel is gonna be the previous image's id in the array of images
						nextCarouselSpanId = imgs[indexOfCurrImg - 1].id;
					}

				}else if(carouselDirection === 'right'){
					//if is the last image in the array of images
					if(indexOfCurrImg === (imgs.length - 1)){
						//the next image is gonna be the first image in the array of images
						nextCarouselImg = imgs[0].pict;
						//the id of the carousel is gonna be the first image's id in the array of images
						nextCarouselSpanId = imgs[0].id;

					//if its not the last image	
					} else {
						//the next image is gonna be the next image in the array of images
						nextCarouselImg = imgs[indexOfCurrImg + 1].pict;
						//the id of the carousel is gonna be the next image's id in the array of images
						nextCarouselSpanId = imgs[indexOfCurrImg + 1].id;
					}
				}

				currentVersionMainImg = nextCarouselImg;
				changeCarBackPos(nextCarouselImg, null);
				theCarousel.css({'background-image': `url(${nextCarouselImg})`});
				idSpan.text(nextCarouselSpanId);

				var thumbs = $('div.carThumbImgUnit').find('span.thumbIdSpan');


				var activeImage = thumbs.filter(function(idx, el){
					 if (parseInt($(el).text()) === nextCarouselSpanId){
					 	return el;
					 }
				});

				activeImage = activeImage.next('img.carThumb');

				activateThumbnails(activeImage);

			}else{

				currentVersionMainImg = img;
				changeCarBackPos(img, null);
				theCarousel.css({'background-image': `url(${img})`});
				idSpan.text(num);

				var el = $('div.versionDetailRow').filter(function(idx, itm){
					var spaId = $(itm).find('span.versionId').text();
					if(spaId === num) { return itm;}
				});


				//activatingInfoTag(el);
			}

		}

		var imgForChange = '';

		function changeCarBackPos(url, changeSize){

			var imgNew = new Image();
			var widthImg = theCarousel.width();

			var imgProportionalHeight = 0.6309;
			var backgroundAreaHeight = widthImg * imgProportionalHeight;

			imgNew.src = url;

			$(imgNew).one('load', function(){
				var naturalW = imgNew.width;
		        var naturalH = imgNew.height;

		        var widthGrow = widthImg/naturalW;

		        //console.log('widthGrow', widthGrow);




		        var photoBackHeight = (naturalH < naturalW) ? widthGrow * naturalH : backgroundAreaHeight;

		        /*console.log('backgroundAreaHeight', backgroundAreaHeight);
		        console.log('photoBackHeight', photoBackHeight);*/
		        

        		var extraArea = backgroundAreaHeight - photoBackHeight;
        		var marginTArea = extraArea/2;

        		//console.log(naturalW, naturalH);

	        	if(naturalH >= naturalW){
	        		$(theCarousel).css({'background-position': 'top center'});
	        	
	        	}else{

	        		(extraArea > 0) ? $(theCarousel).css({'background-position': `0 ${marginTArea}px`}) : $(theCarousel).css({'background-position': 'top'});
	        	}
		        
		        if(changeSize !== null){
		        		
					(naturalH >= naturalW) ? theCarousel.css({'background-size': `auto ${changeSize}px`}) : theCarousel.css({'background-size': '100%'});

				}else{

					(naturalH >= naturalW) ? theCarousel.css({'background-size': `auto ${backgroundAreaHeight}px`}) : theCarousel.css({'background-size': '100%'});
				}

			});


		}

		//end carousel mechanich

		var existCarousel = false;

		$(window).resize(function(){
			(existCarousel) ? sizeCarousel() : startCarousel();
		});


		function startCarousel() {
			
			if(!existCarousel){
				
				var carInter = setInterval(function(){

					if(!$.isEmptyObject(currentVersion)){

						carouselExist();
					}
				}, 10);

				function carouselExist() {
					existCarousel = true;
					if(existCarousel){
						clearInterval(carInter);
						sizeCarousel();
					}
				}
			}else{
				return true;
			}

		}

		var exceededProportionalHeight = 0;
		function sizeCarousel() {
			
			var widthImg = theCarousel.width();
			var windWidth = $(window).width();

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


			var imgProportionalHeight = 0.6309;
			var heightBackground = widthImg * imgProportionalHeight;

			var thumbsBarHeight = exceededProportionalHeight * widthImg;

			thumbsBar.height(thumbsBarHeight);


			var totalProportionalHeight = imgProportionalHeight + exceededProportionalHeight;

			var heightCarousel = widthImg * totalProportionalHeight;

			if(currentVersionMainImg.length > 0){

				changeCarBackPos(currentVersionMainImg, heightBackground);
			}
			
			theCarousel.height(heightCarousel);
		}

     

		function displayBrand() {
			var versionsBrandImg = $('div.versionsBrandImg');
			var modelNameSpan = $('p.modelName');
			var modelPrcSpan = $('p.modelPrice');


			var brandURL = versionsArr[0].pic_marca;
			var modelName = versionsArr[0].model_name;
			
			sessionStorage.setItem('currentBrandImg', brandURL);
			sessionStorage.setItem('currentBrandAutos', versionsArr[0].brand_id);
			localStorage.setItem('modelName', modelName);

			metaTitle.attr('content', `Checa el ${modelName} en Vrumm`);
			metaDescrip.attr('content', `Vrumm te permite ver todos los autos del mercado mexicano, como el ${modelName}`);

			versionsBrandImg.css({
				'background-image': `url(${brandURL})`
			});

			modelNameSpan.text(modelName);

			var modelPrice = (localStorage.getItem('modelPrice') !== null) ? localStorage.getItem('modelPrice') : `$ ${versionsArr[0].starting_price}`;
			
			modelPrcSpan.text(modelPrice);

		}
	
	}




});