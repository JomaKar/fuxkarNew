import {con} from './commonFunc/consoling.js';
import { myLocation} from './commonFunc/locating.js';
import {queriesT, hashesExist} from './commonFunc/urlEncoder.js';
import {notNullNotUndefined, NullOrUndefined} from './commonFunc/differentOfNullAndUndefined.js';


$(function(){



	if(myLocation == '/web/catalogo/specific-version.html' || myLocation == '/web/catalogo/specific-version'){
		
		//version info variables
			var version = {};
			var versions = [];

		//DOM variables
		const theCarousel = $('div.versionsCarousel'),
		versionDetailCont = $('div.versionDetailCont'),
		versionsArrows = $('span.versionArrow');
		//spans with version index number, in compare version bar

		const versionRecognizerGroup = $('div.versionRecognizerGroup'),
		spanNum = $('span.versionNum'),
		spanTotal = $('span.versionTotal'),
		isGarageImg = $('#btnAddToGarage img.isGarage'),
		addGarageBtn = $('a#btnAddToGarage'),
		addToGrgMsg = $('span.addToGrgMsg'),
		addToCmpMsg = $('span.addToCmpMsg'),
		addGrgList = $('ul.addToGarage'),
		colorsTab = $('div.colorsTab'),
		colorsContainer = $('div.colorsContainer'),
		
		metaTitle = $('meta.metaTitle'),
		metaDescrip = $('meta.metaDescrip'),
		metaImg = $('meta.metaImg');

		var compareGroup = $('div.compareGroup.specificVersion');

		//carousel variables
		var imgs = [];
		var currentVersionMainImg = '';

		//change variables
		var versionChange = false;
		var selectedVersion = {};
		var versionInGarage = false;
		var versionInComparator = false;

		//console.log(theCarousel);

		if(notNullNotUndefined(sessionStorage.getItem('versionsArr')) && notNullNotUndefined(sessionStorage.getItem('versionStored'))){
			version = JSON.parse(sessionStorage.getItem('versionStored'));
			versions = JSON.parse(sessionStorage.getItem('versionsArr'));

			if(hashesExist){
				//console.log(version, 'hi here', queriesT.cId);
				var storedNum = parseInt(version.id), 
				newNum = parseInt(queriesT.cId);
				
				(storedNum === newNum) ?( kickStart('start'), hideShowArrows(versions, 'start')) : selectVersionStart(versions, 'start');
			
			}else{

				kickStart('start');
				hideShowArrows(versions, 'start');
			}

		}else{
			wait();
		}

		function wait() {
			setTimeout(function(){
				if(notNullNotUndefined(sessionStorage.getItem('versionStored'))){
					version = JSON.parse(sessionStorage.getItem('versionStored'));
					versions = JSON.parse(sessionStorage.getItem('versionsArr'));

					if(hashesExist){
						//console.log(version, 'hi here', queriesT.cId);
						var storedNum = parseInt(version.id), 
						newNum = parseInt(queriesT.cId);
						
						(storedNum === newNum) ? (kickStart('wait'), hideShowArrows(versions, 'wait')) : selectVersionStart(versions, 'wait');
					
					}else{

						kickStart('wait');
						hideShowArrows(versions, 'wait');
					}

				}else{
					askVersionsAgain();
				}
			}, 1600);
		}

		function askVersionsAgain() {
			if(hashesExist){
				var datos = (notNullNotUndefined(localStorage.getItem('aUsr'))) ? {'device': localStorage.getItem('deviceId'), modelId: parseInt(queriesT.mdlId), user: localStorage.getItem('aUsr')} : {'device': localStorage.getItem('deviceId'), modelId: parseInt(queriesT.mdlId)};
				datos = JSON.stringify(datos);
				$.post('http://fuxkar.com/ws/v2/catalogo/getversiones', datos)
				.then(function(res){
					if(res.estado === 1){
						versions = res.mensaje.rs;



						hideShowArrows(versions, 'askVersionsAgain');
						selectVersionStart(versions, 'askVersionsAgain');

					}
				}).fail(function(err){
					console.log(err)
				});
			}else{
				wait();
			}
		}

		function hideShowArrows(versns, or) {
			//console.log(,'hideShowArrows', versns, or);
			
			(versns.length > 1) ? null : (versionsArrows.hide(), versionRecognizerGroup.css({margin: '0 auto'}));
		}

		function selectVersionStart(vrs, or){

			//console.log('selectVersionStart', or, vrs);

			var carId = parseInt(queriesT.cId);

			var versionAr = $.grep(vrs, function(el, idx){
								var objId = parseInt(el.id);
								//console.log('selectVersionStart', objId, carId);
								if(objId === carId){

									return  el;
								} 

							});

			version = versionAr[0];

			(notNullNotUndefined(version)) ? kickStart('selectVersionStart') : askVersionsAgain(); 
			//console.log('selectVersionStart', version);
		}



		function kickStart(or) {
			//console.log('kickStart', or);
			displayBrandBar();
			sizeCarousel();
			displayCarousel();
			selectVersion(null);
			displayTecnichCard();
		}

		$(window).resize(function(){
			sizeCarousel();
		});

		// this display the size each element of the details card must have
		function displayTecnichCard() {
			const infoCont = $('ul.fichaRenglon').children('li');



			infoCont.map(function(idx, ele){

				var classList = $(ele).attr('class').split(/\s+/);
				$.each(classList, function(index, item) {
				    if (item.search('pct') !== -1) {

				        var perc = classList[index].substring(3);

				        $(ele).css({
				        	width: `${perc}%`
				        })
				    }
				});
			})
		}


		function displayCarousel() {

			var imgsCont = $('div.thumbImgsCont');
			
			var arrowsCont = $('div.arrowsCont');

			if(!versionChange){

				($.isArray(version.pic_web)) ? imgs = version.pic_web : imgs[0] = version.pic_web;

			}else{

				imgs = [];

				($.isArray(selectedVersion.pic_web))  ? imgs = selectedVersion.pic_web : imgs[0] = selectedVersion.pic_web;

			}

			metaImg.attr('content', imgs[0]);

			theCarousel.find('div.sk-circle').remove();

			$(theCarousel).css({
				'background-image': `url(${imgs[0]})`
			});

			currentVersionMainImg = imgs[0];

			var classes = '';

			imgsCont.find('div.carThumbImgUnit').remove();

		}

		$(document).on('click', 'input.autoColorOption', function(e){
			var inp = $(e.target);

			var imgColor = $(inp).data('auto');

			$(theCarousel).css({
				'background-image': `url(${imgColor})`
			})
		});


		versionsArrows.on('click', function(){
			var el = $(this);
			versionChange = true;

			if(el.hasClass('left')){
				selectVersion('left');
			}else if(el.hasClass('right')){
				selectVersion('right');
			}

		});



		var objIdx = -1;

		function selectVersion(dir){
			var info = [];


			if(!versionChange){
				findVersionIdx();
				spanNum.text(objIdx + 1);
				spanTotal.text(versions.length);
				info =  version.ficha_tecnica;
				throwInfo(info);

			}else if(dir.length > 0 && versionChange){
				versionInGarage = false;
				/*console.log(versions, 'versions');
				console.log(selectedVersion, 'selectedVersion');
				console.log(version, 'version');*/


				findVersionIdx();

				var lastVersionIdx = versions.length - 1;

				var numIdx; 

				if(objIdx === 0) {
					(dir === 'right') ? numIdx =  2 : numIdx = versions.length;

				} else if(objIdx === lastVersionIdx){

					(dir === 'right') ? numIdx = 1 : numIdx = objIdx;

				}else{

					(dir === 'right') ? numIdx = parseInt(spanNum.text()) + 1 : numIdx = parseInt(spanNum.text()) - 1;
				}
				
				spanNum.text(numIdx);

				if(objIdx === 0){

					(dir === 'left') ? selectedVersion = versions[lastVersionIdx] : selectedVersion = versions[objIdx + 1];

				}else if(objIdx === lastVersionIdx){

					(dir === 'left') ? selectedVersion = versions[objIdx - 1] : selectedVersion = versions[0];

				}else{

					(dir === 'left') ? selectedVersion = versions[objIdx - 1] : selectedVersion = versions[objIdx + 1];
				
				}

				info = selectedVersion.ficha_tecnica;
				changeUrlId(selectedVersion.id);

				throwInfo(info);
				displayBrandBar();
				displayCarousel();

			}
			
		}

		function findVersionIdx() {

			$.map(versions, function(itm, idx){

					if(selectedVersion.id !== undefined && selectedVersion.id !== null){

						if(itm.id === selectedVersion.id){
							objIdx = idx;
						}

					}else{

						if(itm.id === version.id){
							objIdx = idx;
						}

					}
				});
		}


		function changeUrlId(id) {
			var href = window.location.href;

			var carIdUrlIdx = href.search('cId');

			if(carIdUrlIdx !== -1){
				var nextAnIdx = href.indexOf('&', carIdUrlIdx);
				var urlBefcID = href.slice(0, carIdUrlIdx);
				var carId = 'cId=' + id;

				var newHref = (nextAnIdx !== -1) ? `${urlBefcID}${carId}${href.slice(nextAnIdx)}` : `${urlBefcID}${carId}`;

				con(newHref);
			}
		}

		function throwInfo(info) {

			//need to be deleted
			/*$('div.fichaTecnicaDetail').empty();
			$('div.fichaCat').empty();*/
			//til here
			var actualCat = info[0].tab;
			// console.log(info, 'from versionsSpecific');

			//this info need to be displayed with endpoint getfichatecnica
			
			info.forEach(function(itm, idx){

				//this makes a div for every tab that actually is not considered

				if(itm.tab !== actualCat && !versionDetailCont.find(`div.${itm.tab}`).length){
					actualCat = itm.tab;
					var cat = `<div class="${actualCat} fichaCat">
									<h2>${actualCat}</h2>
								</div>`;
					versionDetailCont.append(cat);
				}

				//this throw the info in the corresponding tab
				if(itm.tab !== 'Colores'){
					if(notNullNotUndefined(itm.dato)){
						if(versionDetailCont.find(`div.${itm.tab}`).find(`li.dato${itm.dato}`).length){
							var xIfFalse = '<i class="fa fa-times" aria-hidden="true"></i';
							var yIfTrue = '<i class="fa fa-check" aria-hidden="true"></i';
							


							if(!versionChange){

								if(itm.valor == 'false' || itm.valor == 'No' || itm.valor == 'No tiene ' || itm.valor == 0 || itm.valor == 'true' || itm.valor == 'Si tiene ' || itm.valor == 1 || itm.valor == 'Sí' || itm.valor == 'Sí tienetrue'){
									(itm.valor == 'false' || itm.valor == 'No' || itm.valor == 'No tiene ' || itm.valor == 0) ? versionDetailCont.find(`div.${itm.tab}`).find(`li.dato${itm.dato}`).children('p.datoVal').empty().html(`<span class="hiddenItm">${itm.valor}</span>${xIfFalse}`) : versionDetailCont.find(`div.${itm.tab}`).find(`li.dato${itm.dato}`).children('p.datoVal').empty().html(`<span class="hiddenItm">${itm.valor}</span>${yIfTrue}`);
								}else{
									versionDetailCont.find(`div.${itm.tab}`).find(`li.dato${itm.dato}`).children('p.datoVal').empty().html(`<span class="hiddenItm">${itm.valor}</span>${itm.valor}`);
								}

							}else{

								//take off diffData class before determining if the info has change or not

								versionDetailCont.find(`div.${itm.tab}`).find(`li.dato${itm.dato}`).children('p.datoVal').removeClass('diffData');

								//get the data already stored there to contrast
								var newData = itm.valor;
								var lastData = versionDetailCont.find(`div.${itm.tab}`).find(`li.dato${itm.dato}`).children('p.datoVal').find('span.hiddenItm').text();

								//adding the new text

								if(itm.valor == 'false' || itm.valor == 'No' || itm.valor == 'No tiene ' || itm.valor == 0 || itm.valor == 'true' || itm.valor == 'Si tiene ' || itm.valor == 1 || itm.valor == 'Sí' || itm.valor == 'Sí tienetrue'){
									//con(itm.valor);
									(itm.valor == 'false' || itm.valor == 'No' || itm.valor == 'No tiene ' || itm.valor == 0) ? versionDetailCont.find(`div.${itm.tab}`).find(`li.dato${itm.dato}`).children('p.datoVal').empty().html(`<span class="hiddenItm">${itm.valor}</span>${xIfFalse}`) : versionDetailCont.find(`div.${itm.tab}`).find(`li.dato${itm.dato}`).children('p.datoVal').empty().html(`<span class="hiddenItm">${itm.valor}</span>${yIfTrue}`);
								}else{ 
									//con(itm.valor);
									versionDetailCont.find(`div.${itm.tab}`).find(`li.dato${itm.dato}`).children('p.datoVal').empty().html(`<span class="hiddenItm">${itm.valor}</span>${itm.valor}`);
								}

								//contrasting the data and adding 'diffData' class if any change has been detected and is inside an active tab

								if(newData !== lastData) {
									var activeOrnot = versionDetailCont.find(`div.${itm.tab}`);

									(activeOrnot.hasClass('active')) ? activeOrnot.find(`li.dato${itm.dato}`).children('p.datoVal').addClass('diffData') : null;
								}
							}
						}else{
							var plainText = `<p class="${itm.tab}">${itm.valor} : ${itm.dato}</p>`;

							($(`p.${itm.tab}`).length) ? $(`p.${itm.tab}`).empty().text(`${itm.valor} : ${itm.dato}`) : versionDetailCont.find(`div.${itm.tab}`).append(plainText);
						}

					}else{
						con(itm.dato);
					}
				}else{
					// console.log(itm.colors);
					// con('trying to make a new way to put colors');
					if(itm.valor != 0){
						
						var colors = itm.colors;

						if(notNullNotUndefined(colors) && $.isArray(colors)){
							colorsTab.css({display: 'flex'});
							

							colors.forEach((color, idx) => {
								var colorBtn = `<input type="image" src="${color.boton}" class="autoColorOption" data-auto="${color.foto}">`;
								var btnWrapper = `<div class="color${idx} colorCont">${colorBtn} <span class="colorName">${color.nombre}</span></div>`;
								colorsContainer.append(btnWrapper);
							});
						}else{
							colorsTab.css({display: 'none'});
						}

					}

					// old way in small tab
					// if(versionDetailCont.find(`div.${itm.tab}`).find(`li.dato${itm.dato}`).length){
					// 	if(itm.valor != 0){
							
					// 		var colors = itm.colors;

					// 		if(notNullNotUndefined(colors) && $.isArray(colors)){
					// 			versionDetailCont.find(`div.${itm.tab}`).find(`li.dato${itm.dato}`).children('p.datoVal').remove();
					// 			colors.forEach((color, idx) => {
					// 				var colorBtn = `<input type="image" src="${color.boton}" class="autoColorOption" data-auto="${color.foto}">`;
					// 				var btnWrapper = `<div class="color${idx} colorCont">${colorBtn} <span class="colorName">${color.nombre}</span></div>`;

					// 				if(idx == 0){
					// 					versionDetailCont.find(`div.${itm.tab}`).find(`li.dato${itm.dato}`).children('div.titleCont').after(btnWrapper);
					// 				}else{
					// 					versionDetailCont.find(`div.${itm.tab}`).find(`li.dato${itm.dato}`).children(`div.color${idx-1}`).after(btnWrapper);
					// 				}
					// 			});
					// 		}else{
					// 			versionDetailCont.find(`div.${itm.tab}`).find(`li.dato${itm.dato}`).children('p.datoVal').text('No hay colores para mostrar');	
					// 		}

					// 	}
					// 	// else{
					// 	// 	versionDetailCont.find(`div.${itm.tab}`).find(`li.dato${itm.dato}`).children('p.datVal').text(itm.valor);
					// 	// }
					// }
				}
			});
		}

		//startAlberto

		function addToGarage(type) {

			var userId = localStorage.getItem('aUsr');
	        var deviceId = localStorage.getItem('deviceId');
	        var versionId = ( versionChange ) ? selectedVersion.id : version.id;

	        var addedAutos = (notNullNotUndefined(localStorage.getItem('addedAutosArr'))) ? JSON.parse(localStorage.getItem('addedAutosArr')) : [];


	        var dataForGarage = { 'device': deviceId, 'user': userId, 'version': versionId, 'tipo': type };

	        dataForGarage = JSON.stringify(dataForGarage);

	        if(!versionInGarage){

		        $.post('http://fuxkar.com/ws/v2/garage/agregar',
		        	dataForGarage
		        ).then(function(data){

		            if(data.estado === 1){
		            	$('#success-modal').modal();

		            	addedAutos.push(versionId);
		            	addedAutos = JSON.stringify(addedAutos);
		            	localStorage.setItem('addedAutosArr', addedAutos);

		            	isGarageImg.attr('src', '../img/ic_OKGarage@2x.png');
		            }
		        });
	        
	        }
	           
	    }
	    
	    $('.addToGarage a').on('click', function(e) {
	    	e.preventDefault();
	    	var tipo = $(this).data('type');
	    	addToGarage(tipo);
	    });

		//endAlberto
	    
	    isGarageImg.click(function(){

	    	(notNullNotUndefined(localStorage.getItem('aUsr'))) ? null : $('div#failLog').modal();

	    });

	    compareGroup.click(function(e) {
			(notNullNotUndefined(localStorage.getItem('aUsr'))) ? addToComparator(localStorage.getItem('aUsr')) : $('div#failLog').modal();
	    });

	    function addToComparator(id){
	    	//console.log(id, localStorage.getItem('aUsr'));
	    	var theId = parseInt(id);

	    	var deviceId = localStorage.getItem('deviceId');
	        var versionId = ( versionChange ) ? selectedVersion.id : version.id;

	        var addedInComparatorAutos = (notNullNotUndefined(localStorage.getItem('addedInComAutosArr'))) ? JSON.parse(localStorage.getItem('addedInComAutosArr')) : [];


	        var dataForCompare = JSON.stringify({ 'device': deviceId, 'idUsr': theId, 'version': versionId});
	        con(dataForCompare);
	        if(!versionInComparator){

		        $.post('http://fuxkar.com/ws/v2/comparador/agregar',
		        	dataForCompare
		        ).then(function(data){

		            if(data.estado === 1){
		            	$('#successComparador').modal();

		            	addedInComparatorAutos.push(versionId);
		            	addedInComparatorAutos = JSON.stringify(addedInComparatorAutos);
		            	localStorage.setItem('addedInComAutosArr', addedInComparatorAutos);

		            	compareGroup.find('span.circle').removeClass('fa-plus-circle').addClass('fa-check-circle');
		            }
		        });
	        
	        }
	    }



		function displayBrandBar() {
			var versionsBrandImg = $('div.versionsBrandImg');
			var modelNameSpan = $('p.modelName');
			var modelPrcSpan = $('p.modelPrice');
			var versionNameP = $('p.versionName');

			var brandURL = version.pic_marca;
			var modelName = (notNullNotUndefined(localStorage.getItem('modelName'))) ? localStorage.getItem('modelName') : version.model_name;
			
			sessionStorage.setItem('currentBrandAutos', versions[0].brand_id);
			localStorage.setItem('modelPrice', `$ ${versions[0].starting_price} - $ ${versions[versions.length - 1].starting_price}`);
			sessionStorage.setItem('currentBrandImg', version.pic_marca);
			localStorage.setItem('modelName', version.model_name);

			var modelPrice = '',
			versionName = '';

			if(!versionChange){
				
				modelPrice = version.starting_price;
				versionName = version.name;

				isInGarage(version);
				isInComparator(version);

			}else{

				modelPrice = selectedVersion.starting_price;
				versionName = selectedVersion.name;

				isInGarage(selectedVersion);
				isInComparator(selectedVersion);

			}

			
			versionsBrandImg.css({
				'background-image': `url(${brandURL})`
			});


			metaTitle.attr('content', `Checa el ${modelName} en Vrumm`);
			metaDescrip.attr('content', `Vrumm te permite ver todos los autos del mercado mexicano, como el ${modelName}`);
			
			modelNameSpan.text(modelName);
			modelPrcSpan.text(`$ ${modelPrice}`);
			versionNameP.text(versionName);

		}

		function isInGarage(vers){

			//console.log('specific-version', vers, localStorage.getItem('addedAutosArr'));

			if(notNullNotUndefined(localStorage.getItem('addedAutosArr'))){

				var autosAlreadyAdded = JSON.parse(localStorage.getItem('addedAutosArr'));
				var lastAutoStoredIdx = autosAlreadyAdded.length - 1;
				var currAutoId = parseInt(vers.id);

				if(typeof vers.esta_garage === 'string'){
					isGrgTrue();
				}else if(autosAlreadyAdded.length > 0){

						$.each(autosAlreadyAdded, function(indx, item){
							var idStored = parseInt(item);

							if(currAutoId === idStored){
								isGrgTrue();
							}

							if(indx === lastAutoStoredIdx && currAutoId !== idStored && !versionInGarage){
								isGarageImg.attr('src', '../img/ic_AddGarage@2x.png');
								(notNullNotUndefined(localStorage.getItem('aUsr'))) ? (versionInGarage = false, addToGrgMsg.text('Agregar a Mi Garage'), addGarageBtn.removeClass('defaultPointer')) : (versionInGarage = true, addGrgList.addClass('hiddenItm'));	
							}

						});

				}else{
					isGarageImg.attr('src', '../img/ic_AddGarage@2x.png');
					(notNullNotUndefined(localStorage.getItem('aUsr'))) ? (versionInGarage = false, addToGrgMsg.text('Agregar a Mi Garage'), addGarageBtn.removeClass('defaultPointer')) : (versionInGarage = true, addGrgList.addClass('hiddenItm'));
				}


			}else if(typeof vers.esta_garage === 'string'){
			
				isGrgTrue();
			
			}else{

				isGarageImg.attr('src', '../img/ic_AddGarage@2x.png');
				(notNullNotUndefined(localStorage.getItem('aUsr'))) ? (versionInGarage = false, addToGrgMsg.text('Agregar a Mi Garage'), addGarageBtn.removeClass('defaultPointer')) : (versionInGarage = true, addGrgList.addClass('hiddenItm'));
				//console.log( 'versionInGarage', versionInGarage);
			}
		}

		function isInComparator(vers){
			
			//con(vers);
			if(notNullNotUndefined(localStorage.getItem('addedInComAutosArr'))){
				//console.log(localStorage.getItem('addedInComAutosArr'));

				var autosAlreadyCompared = JSON.parse(localStorage.getItem('addedInComAutosArr'));
				var lastAutoInCmpIdx = autosAlreadyCompared.length - 1;
				var currAutoId = parseInt(vers.id);

				if(notNullNotUndefined(vers.esta_comparador) && vers.esta_comparador !== 'false'){
					isCmpTrue();
				}else if(autosAlreadyCompared.length > 0){

					var equalId = $.grep(autosAlreadyCompared, function(item, idx){
						var idStored = parseInt(item);
						return idStored === currAutoId;
					});

					//con(equalId);

					if(equalId.length > 0 && currAutoId === parseInt(equalId[0])){
						isCmpTrue();
					}else{
						compareGroup.find('span.circle').addClass('fa-plus-circle').removeClass('fa-check-circle');
						versionInComparator = false; 
						addToCmpMsg.text('Agregar al Comparador');
						compareGroup.removeClass('defaultPointer');
					}

				}


			}else if(notNullNotUndefined(vers.esta_comparador) && vers.esta_comparador !== 'false'){
			
				isCmpTrue();
			
			}
		}

		function isGrgTrue() {
			versionInGarage = true;
			isGarageImg.attr('src', '../img/ic_OKGarage@2x.png');
			addGrgList.addClass('hiddenItm')
			addGarageBtn.addClass('defaultPointer');
			addToGrgMsg.text('Agregado al Garage');
		}

		function isCmpTrue() {
			versionInComparator = true;
        	compareGroup.find('span.circle').removeClass('fa-plus-circle').addClass('fa-check-circle');
			compareGroup.addClass('defaultPointer');
			addToCmpMsg.text('Agregado al Comparador');

		}

		function sizeCarousel() {
			
			var widthImg = theCarousel.width();

			var height = widthImg * 0.6309;

			theCarousel.height(height);
		}


	}

});