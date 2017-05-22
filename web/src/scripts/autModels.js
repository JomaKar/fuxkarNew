import {navigating, myLocation, pathnameRoot} from './commonFunc/locating.js';
import {alleGleichlich, sizingModelItms} from './commonFunc/sizingGarageImgs.js';
import {con} from './commonFunc/consoling.js';
import {sendPostToGo, sendPostToGet} from './commonFunc/httpProcesor.js';
import {getVersions} from './commonFunc/getversiones.js';
import {askBrands, theBrand} from './commonFunc/brandsImgs.js';
import {queriesT, hashesExist} from './commonFunc/urlEncoder.js';
import {notNullNotUndefined, NullOrUndefined} from './commonFunc/differentOfNullAndUndefined.js';


$(function(){
	
	var brands = [];


	if(myLocation === "/web/catalogo/brand-modelo.html" || myLocation === "/web/catalogo/brand-modelo"){



		/*$(document).ready(function(){
			displayBrand();
		});*/


		var models = [],
		headerBrandImg = $('div.headerBrandImg'),
		brandName = sessionStorage.getItem('currentBrandName');

		var askInterval = setInterval(function(){
		
			var modelsStored = sessionStorage.getItem('modelsArr');
			checkBrands(modelsStored);

		}, 5);

		var askBrand = setInterval(function(){
		
			var brandImg = theBrand(queriesT.brdId)[0];

			checkBrandImg(brandImg);

		}, 5);

		var askBrandTimes = 0;
		function checkBrandImg(img) {
			if(askBrandTimes < 60){

				setTimeout(function(){
					if(notNullNotUndefined(img) && img){
						clearInterval(askBrand);
						displayBrand(img.pic_url);
				    }	
					askBrandTimes++;
				}, 15);

			}else{
				clearInterval(askBrand);
				displayBrand(null);
			}
		}

		function checkBrands(argument) {
			if(notNullNotUndefined(argument) && argument !== 'nothing stored'){
				clearInterval(askInterval);
				brands = argument;
				extractModels(brands);
		    }	
		}


		var modelsSpace = $('div.modelsSpace');
		var initialTxt = $('p.modelsStartTxt');


		function extractModels(brandsArr){
			models = JSON.parse(brandsArr);
			// console.log('new version', models);
			var availableUses = [],
			availableTypes = [],
			diffUses = [], 
			tipo = [];

			if(models !== ''){
				//figuring out the different uses available

				models.forEach(function(itm, idx){
					var inArray = $.inArray(itm.tipo_catalogo, availableTypes, 0);
					if(inArray === -1){
						availableTypes.push(itm.tipo_catalogo);				}
				});

				// console.log('availableTypes', availableTypes);

				//ordering depending on uses

				var itmsDependingOnType = [];
				
				availableTypes.forEach(function(typeName, idx){
					itmsDependingOnType[idx] = [];

					itmsDependingOnType[idx] = $.grep(models, function(el, idex){
						return (el.tipo_catalogo === availableTypes[idx]);
					});

				});


				var availableYears = new Array(itmsDependingOnType.length);
				var itmsDividedPerYear = new Array(itmsDependingOnType.length);
				var actualYear = '';

				// discover how many different years are for each type
				// make an array for each inside the general part of the array
				// push them inside of it

				$.map(itmsDependingOnType, function(itm, idx){

					availableYears[idx] = [];
					
					$.each(itm, function(idxt, el){

						// set the year to check.
						if(idxt === 0){ actualYear = el.year.replace(/\s/g, ''); availableYears[idx].push(actualYear);}
						else{
							var yearToTest = el.year.replace(/\s/g, '');
							var idxOfYear = availableYears[idx].indexOf(yearToTest);
							(idxOfYear == -1) ? availableYears[idx].push(yearToTest) : null;
						}

					});

				});

				// console.log('availableYears', availableYears);

				availableYears.forEach(function(itm, idx){
					itmsDividedPerYear[idx] = [];

					$.map(itm, function(theYear, yIdx){
						var elements = [];
						elements = itmsDependingOnType[idx].filter(el => el.year.replace(/\s/g, '') == theYear);
						itmsDividedPerYear[idx].push(elements);
					});
				});

				displayModels(itmsDividedPerYear);

				// console.log('itmsDividedPerYear', itmsDividedPerYear);
	
			}else{
				initialTxt.html('No hay información sobre esta marca para mostrar');
			}

		}


		function displayModels(collYearType) {
			console.log('filterTypes', collYearType);
			initialTxt.remove();


			collYearType.forEach(function(typeColl, ind){
				var type = typeColl[0][0].tipo_catalogo;
				var typeName = type;
				console.log('typeColl', typeName, typeColl);
				type = type.replace(/ /g, '');
				// var currentYearUseFilter = $('div.yearFilterCont' + type);


				var typeFilter = `<div class="galleryHead col-xs-12 noPadding noMargin typeFilter${typeName}">
									<span class="modelUse">${typeName}</span>
								 </div>
								 <div class="col-xs-12 noPadding noMargin">
				                    <div class="row-fluid noPadding noMargin childHeight modelColl${type}">
				                        
				                    </div>
				                 </div>`;

				modelsSpace.append(typeFilter);


				typeColl.forEach(function(yearItem, idxOfYearNow){
					var modelCollBox = $('div.modelColl' + type);
					var yearActual = yearItem[0].year;
					var yearName = yearActual;

					yearActual.replace(/ /g, '');
					console.log('yearItem', 'modelCollBox' + type, yearItem);

					var myModelYear = `<div class="galleryNeck col-xs-12 noPadding noMargin typeFilter${yearName}">
					                    <span class="gallNeckCarSp"></span>
					                    <span class="gallNeckCarTxt">${yearName} ${typeName}</span>
					                </div>
					                <div class="col-xs-12 noPadding noMargin">
					                    <div class="row-fluid noPadding noMargin childHeight modelBoxYear${type + yearActual}">
					                        
					                    </div>
					                </div>`;

					modelCollBox.append(myModelYear); 
					var currentYearBox = $('div.modelBoxYear' + type + yearActual);

					yearItem.forEach(function(yearEl){
						var myYear = yearEl.year;
						// console.log('myYear', myYear);
						console.log('myYear', 'modelBoxYear' + type + myYear, myYear);

						var hrefPath = (notNullNotUndefined(localStorage.getItem('aUsrA'))) ? `fuxkar/catalogo/modelo-versiones?al=${localStorage.getItem('aUsrA')}&brdId=${yearEl.brand_id}&mdlId=${yearEl.model_id}` : `fuxkar/catalogo/modelo-versiones?brdId=${yearEl.brand_id}&mdlId=${yearEl.model_id}`;

						var modelItem = `<div class="col-xs-12 col-sm-4 noPadding noMargin modelItem">
			                            <img src="${yearEl.pic_url}" class="img-responsive carImg"/>
			                            <a href="${hrefPath}" class="modelItmAnchor">
				                            <div class="hoverInfo">
				                                <ul class="mDetails noPadding">
				                                  <li class="mName">${yearEl.name}</li>
				                                  <li class="vPrice">$ ${yearEl.desde} - $ ${yearEl.hasta}</li>
				                                  <li class="yModel">${yearEl.year}</li>
				                                  <li class="hiddenItm modelId">${yearEl.model_id}</li>
				                                </ul>
				                            </div>
				                        </a>
			                        </div>`;

			            currentYearBox.append(modelItem); 

					});

				});
				
			});

			sizingModelItms();

		}

		$(document).on('click', 'a.modelItmAnchor', function(e){
			e.preventDefault();
		});


		$(document).on('click', 'div.hoverInfo', function(){
			var modelId = $(this).find('li.modelId').text();
			var modelN = $(this).find('li.mName').text();
			var modelP = $(this).find('li.vPrice').text();
			getVersions(modelId, modelN, modelP, 'mdls');
			//console.log('hi from models') 
		});


		$(window).resize(function(){
			var carContainer = $('div.modelItem');
			if(carContainer.length){
				alleGleichlich(carContainer);
			}
		});

		function displayBrand(img) {


			if(img){

				headerBrandImg.css({
					'background-image': `url(${img})`
				});

			}else if(!img && notNullNotUndefined(sessionStorage.getItem('currentBrandImg'))){

				var brandURL = sessionStorage.getItem('currentBrandImg');
				
				headerBrandImg.css({
					'background-image': `url(${brandURL})`
				});
			
			}else{

				con('no image brand')

			}

		}

		var backBtn = $('span.backBtn');

		backBtn.click(function(){
			navigating('catalogo');
		})


	}
});