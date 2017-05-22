import { myLocation, pathnameRoot, isMyLocationHideMode} from './commonFunc/locating.js';
import {con} from './commonFunc/consoling.js';
import {alleGleichlich, sizingModelItms} from './commonFunc/sizingGarageImgs.js';
import {queriesT, hashesExist} from './commonFunc/urlEncoder.js';
import {sendPostToGo, sendPostToGet} from './commonFunc/httpProcesor.js';
import {changeProfilePhoto} from './commonFunc/changeProfilePhoto.js';
import {getVersions} from './commonFunc/getversiones.js';
import {notNullNotUndefined, NullOrUndefined} from './commonFunc/differentOfNullAndUndefined.js';

$(function(){

	if(isMyLocationHideMode("/web/perfil/")){

		var filterSelect = $('select#filterSelect'),
		garageGrid = $('div.garageGrid'),
		user = [],
		usrGarageArr = [],
		aliasSpan = $('span.aliasSpan'),
		nameSpace = $('h4.fullName'),
		initialText = $('p.usrGarageInitialTxt'),
		//loadingText = $('p.usrGarageLoadingTxt'),
		loadingText = $('div.sk-circle'),
		addGarageBtn = $('div.addGarageBtnCon'),
		selectCaret = $('span.selectCaret'),
		editProfileAnchor = $('a.editProfileAnchor'),
		editPencil = $('span.editProfileSpan'),
		askingTimes = 0,
		carsNumber = $('span.carsNumb'),
		dateSpace = $('span.memDateNumb'),
		photoDiv = $('div#profilePict'),
		miniCameraIcon = $('span.profImgCameraIcon'),
		headerCameraIcon = $('span.cameraIconHead'),
		domDataElements = [aliasSpan, dateSpace, nameSpace, carsNumber, photoDiv],
		userObjKeys = ['alias', 'created_at', 'full_name', 'total_garage', 'foto_perfil'];
		var usrIDG;
		var garageAsked = false;
		var garageRqst = false;

		var metaTitle = $('meta.metaTitle');
		var metaDescrip = $('meta.metaDescrip');
		var metaImg = $('meta.metaImg');



		var askInterval = setInterval(function(){
		
			var userInfo = sessionStorage.getItem('currentUserInfo');
			checkUser(userInfo);

		}, 5);

		var askForGarage = setInterval(function(){
		
			var userGargage = sessionStorage.getItem('currentUserGarage');
			checkUserGarage(userGargage);
			askingTimes++;

		}, 5);


		$(document).ready(function(){
			sizeAddGarageBtn();
			var hrefConfig = (notNullNotUndefined(localStorage.getItem('aUsrA'))) ? `${pathnameRoot}perfil/configuracion?al=${localStorage.getItem('aUsrA')}` : `${pathnameRoot}perfil/configuracion`;
			editProfileAnchor.attr('href', hrefConfig);
		});

		$(window).resize(function(){
			sizeAddGarageBtn();

			var carContainer = $('div.modelItem');
	
			if(carContainer.length){
				alleGleichlich(carContainer);
			}
		});

		editProfileAnchor.click(function(e){
			//e.preventDefault();
		})

		function sizeAddGarageBtn() {
			var hgt = addGarageBtn.width() * 0.6309;

			addGarageBtn.css({height: hgt});
		}

		$(document).on('click', 'span.dots', function(){
			var sideInfoBar = $(this).closest('div.sideInfoBar'),
			toggleableIcons = sideInfoBar.find('div.toggleableIcons');
			

			toggleableIcons.css({display: 'flex'});
			sideInfoBar.height('100%');

			$(this).hide();
			
		});

		$(document).on('click', 'div.toggleableIcons div', function(){
			var sideInfoBar = $(this).closest('div.sideInfoBar'),
			toggleableIcons = $(this).closest('div.toggleableIcons'),
			dotsSpan = sideInfoBar.find('span.dots');
			

			toggleableIcons.css({display: 'none'});
			sideInfoBar.height('auto');

			dotsSpan.show();
			
		});

		$(document).on('click', 'div.selectedCat', function(){
			var catContainer = $(this).closest('div.userCarCatCont'),
			bar = $(this).closest('div.selectionContainer'),
			innerDiv = $(this).find('div'),
			notSelected = bar.find('div.notSelectedCat');

			if(localStorage.getItem('activeSession') === 'yes'){
				var logUsr = localStorage.getItem('aUsr');
				var visibleUserId = sessionStorage.getItem('currentUserId');

				if(notNullNotUndefined(logUsr)){
					logUsr = parseInt(logUsr);
					var visibleUser = (notNullNotUndefined(visibleUserId)) ? parseInt(visibleUserId) : parseInt(user.id);

					(logUsr === visibleUser) ? toggleCarSelection(catContainer, bar, innerDiv, notSelected) : null;
				}
			}

		});

		var prevCat = '';

		function reverseCategory(mainEl){
			var catContainer = $(mainEl).find('div.userCarCatCont'),
			bar = catContainer.find('div.selectionContainer'),
			notSelectedCont = bar.find('div.notSelectedCat'),
			selectedCat = notSelectedCont.prev('div.selectedCat'),
			lastCat = selectedCat.children('div');

			lastCat.appendTo(notSelectedCont);
			prevCat.appendTo(selectedCat);
			var err = 'yes';
			displayAddCatErr(mainEl);
			addCategory(prevCat, mainEl, err);
		}

		function displayAddCatErr(mainEl){
			var errMsg = $(mainEl).find('span.msgErrAddCat');

			errMsg.removeClass('hiddenItm');

			setTimeout(function(){
				errMsg.addClass('hiddenItm');
			}, 3000)
		}

		$(document).on('click', 'div.notSelectedCat div', function(){
			var catContainer = $(this).closest('div.userCarCatCont'),
			bar = catContainer.find('div.selectionContainer'),
			notSelectedCont = $(this).closest('div.notSelectedCat'),
			selectedCat = notSelectedCont.prev('div.selectedCat');

			prevCat = selectedCat.children('div');

			var el = $(this);
			var mainContainer = catContainer.closest('div.garageImgCont');

			addCategory(el, mainContainer, null);

			prevCat.appendTo(notSelectedCont);

			selectedCat.append($(this));

			toggleCarSelection(catContainer, bar, prevCat, notSelectedCont);

		});

		function toggleCarSelection(parent, selCont, selCat, notSelCont) {
			if(notSelCont.css('display') === 'none'){
				notSelCont.css({display: 'flex'});
				parent.width(108);
				selCont.width(108);
				selCat.addClass('grayColor');
			}else{
				notSelCont.css({display: 'none'});
				parent.width('100%');
				selCont.width(36);
				selCat.removeClass('grayColor');
			}
		}

		function addCategory(el, mainEl, err) {
			var categories = ['dream', 'someday', 'soonday'];
			var newCat = '';
			var garageId = $(mainEl).find('span.garageUsrCarId').text();
			
			categories.forEach(function(itm, idx){
				if(el.hasClass(itm)){
					newCat = itm;

					if(err !== 'yes'){
						sendNewCat(newCat, garageId, mainEl);
					}
				}

				if(mainEl.hasClass(itm)){
					mainEl.removeClass(itm);
				}
			});

			mainEl.addClass(newCat, garageId);
		}


		function sendNewCat(cat, grgId, mainEl) {


			var userId = sessionStorage.getItem('currentUserId');
            var devicId = localStorage.getItem('deviceId');

            var data = {user: userId, device: devicId, tipo: cat, garage: grgId};
            data = JSON.stringify(data);

            $.post('http://fuxkar.com/ws/v2/garage/cambiartipo', 
                data
              ).then(function(res){
              	//con(res);
                if(res.estado !== 1){

                  reverseCategory(mainEl);
                   
                }

               }).fail(function(err){
               		reverseCategory(mainEl);
                	console.log(err);
            });
		}

		function checkUserGarage(garageArr) {
			
			// if the garageArray obtained from the api is not an empty value
			if(notNullNotUndefined(garageArr) && garageArr !== 'nothing stored'){
	        	
	        	clearInterval(askForGarage);
	        	usrGarageArr = JSON.parse(garageArr);
	        	//con(usrGarageArr);

	        	// lets make a little test
	        	if(notNullNotUndefined(queriesT.al) && notNullNotUndefined(sessionStorage.getItem('currentUserAlias'))){
	        		
	        		var aliasN = sessionStorage.getItem('currentUserAlias');
        			(aliasN == queriesT.al) ? displayGarage() : getUserGarage(queriesT.al);
	        	
	        	}else{

	        		displayGarage();
	        	}

	        // if the garageArray obtained from the api is an empty value
	        }else if(NullOrUndefined(garageArr) || garageArr === 'nothing stored'){
	        	
	        	if(notNullNotUndefined(queriesT.al)){
	        		getUserGarage(queriesT.al);
	        		clearInterval(askForGarage);
	        	}else if(askingTimes >= 100 && notNullNotUndefined(sessionStorage.getItem('currentUserId'))){
	        		clearInterval(askForGarage);
        			getUserGarage(sessionStorage.getItem('currentUserId'));
	        	}
	        }
		}

		function checkUser(user) {

			if(notNullNotUndefined(user) && user !== 'nothing stored'){
				clearInterval(askInterval);
				user = JSON.parse(user);

				//console.log('from profile', user);

				
				if($.isArray(user)){
					if(user.length > 0){
						if(hashesExist){
							
							(user[0].alias == queriesT.al) ? (displayUserInfo(user[0]), usrIDG = parseInt(user[0].id)) :  getUserInfoAl(queriesT.al);

						
						}else{

							displayUserInfo(user[0]);
							usrIDG = parseInt(user[0].id);
						}
					}

				}else if((typeof user === "object") && (user !== null)){
					if(hashesExist){
						
						(user.alias == queriesT.al) ? (displayUserInfo(user), usrIDG = parseInt(user.id)) :  getUserInfoAl(queriesT.al);

					
					}else{

						displayUserInfo(user);
						usrIDG = parseInt(user.id);
					}
				}
				else{
					con('no user');
				}
		    }	
		}


		function getUserInfoAl(alias) {
			  var data = {alias: alias};
			  data = JSON.stringify(data);
			  getUserGarage(alias)

			  $.post('http://fuxkar.com/ws/v2/usuario/info', 
			      data
			    ).then(function(res){

			      if(res.estado === 1){

			        var userInfoFromIn = res.mensaje.rs;
			        displayUserInfo(userInfoFromIn[0]);
			        usrIDG = parseInt(userInfoFromIn[0].id);

			        (!garageRqst) ? getUserGarage(usrIDG) : null;
			        
			        userInfoFromIn = JSON.stringify(userInfoFromIn);
			        sessionStorage.setItem('currentUserInfo', userInfoFromIn);

			      }

			     }).fail(function(err){
			        console.log(err);
			  });

		}


		function getUserGarage(idOrAl) {

            var devicId = localStorage.getItem('deviceId');


            var dataForGarage = {idUsr: idOrAl, device: devicId};
            dataForGarage = JSON.stringify(dataForGarage);

            //console.log('getting the garage', dataForGarage);

              $.post('http://fuxkar.com/ws/v2/garage/listar', 
                dataForGarage
              ).then(function(res){

                if(res.estado === 1){

                  //console.log(res.mensaje.rs)
                  usrGarageArr = res.mensaje.rs;
                  garageRqst = true;

                  displayGarage();
                   
                }else if(res.estado === 2){
                	con('sin autos en garage');
                	changeIfLog();

                	loadingText.addClass('hiddenItm');
                	initialText.removeClass('hiddenItm');
                }

               }).fail(function(err){
                  console.log(err);
            });
               
        }

		var imageOk = false;

		function displayUserInfo(userObj){
			//console.log('displayUserInfo', userObj);
			$.map(userObj, function(value, key){

				if(key === 'created_at'){
					value.trim();

					var whiteSpaceIdx = value.indexOf(' ');

					value = value.slice(0, whiteSpaceIdx);
				}else if(key === 'full_name'){
					value.trim();

					var whiteSpaceIdx = value.indexOf(' ');

					value = value.slice(0, whiteSpaceIdx);

					metaTitle.attr('content', `${value} está en Vrumm`);
					metaDescrip.attr('content', `Checa los coches en el garage de ${value}`);


				}else if(key === 'foto_perfil'){

					if(value !== null){
						imageOk = true;

						value = `data:image/png;base64,${value}`;

					}
				}

				$.each(userObjKeys, function(index, val){
					if(key === val){

						var el = domDataElements[index];

						if(val === 'foto_perfil' && imageOk){

							$(el).css({'background-image': `url(${value})`});
							metaImg.attr('content', value);

						}else if(val === 'foto_perfil' && !imageOk){
							$(el).css({'background-image': 'url(../img/profileDafault.png)'});
						}else{
							$(el).html(value);
						}

					}
				});

			});
		}

		function displayGarage() {
			var availableCats = [
				`<div class="calendarGroup someday">
	                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
	                      <path d="M16.2 2.2v0.6 0.6 0 0.4c0 0.9-0.8 1.7-1.7 1.7s-1.7-0.7-1.7-1.7V3.4 2.8 2.2H8.1v0.6 0.6 0.4c0 0.9-0.8 1.7-1.7 1.7 -0.9 0-1.7-0.7-1.7-1.7V3.4v0V2.8v0V2.2C3.2 2.3 2 3.4 2 4.8v0.3 2.5 8.6C2 17.7 3.3 19 4.9 19h11.2c1.6 0 2.9-1.3 2.9-2.9V7.5 5.1 4.8C19 3.4 17.7 2.2 16.2 2.2zM17.7 16.1c0 0.9-0.7 1.6-1.6 1.6H4.9c-0.9 0-1.6-0.7-1.6-1.6V7.5h14.5V16.1zM6.4 4.5c0.4 0 0.7-0.3 0.7-0.7V3.4 2.8 2.2 1.7C7.2 1.3 6.8 1 6.4 1 6 1 5.7 1.3 5.7 1.7v0.5 0.6 0.6 0.4C5.7 4.2 6 4.5 6.4 4.5zM14.5 4.5c0.4 0 0.7-0.3 0.7-0.7V3.4 2.8 2.2 1.7c0-0.4-0.3-0.7-0.7-0.7 -0.4 0-0.7 0.3-0.7 0.7v0.5 0.6 0.6 0.4C13.8 4.2 14.1 4.5 14.5 4.5zM8.4 16.1c0.8 0 1.4-0.2 1.9-0.7 0.4-0.5 0.6-1 0.6-1.6 0-0.6-0.2-1-0.5-1.3 -0.1-0.1-0.2-0.2-0.3-0.2 -0.1-0.1-0.2-0.2 0-0.3 0.1-0.1 0.2-0.1 0.2-0.2 0.2-0.3 0.4-0.6 0.4-1.1 0-0.6-0.2-1.1-0.6-1.4C9.6 9 9.1 8.8 8.4 8.8 8 8.8 7.7 8.9 7.4 9S7 9.2 6.8 9.3c-0.2 0.2-0.4 0.5-0.5 0.8 -0.1 0.2-0.1 0.5-0.2 0.7 0 0.2 0.1 0.3 0.3 0.3h0.7c0.2 0 0.3-0.1 0.3-0.3 0-0.2 0.1-0.4 0.2-0.5C7.8 10.1 8 10 8.3 10 8.6 10 8.8 10 9 10.2c0.2 0.2 0.2 0.4 0.2 0.7 0 0.4-0.2 0.7-0.5 0.8 -0.1 0.1-0.3 0.1-0.6 0.1 -0.2 0-0.3 0.2-0.3 0.3v0.4c0 0.2 0.1 0.3 0.3 0.3 0.3 0 0.5 0.1 0.7 0.1 0.4 0.2 0.6 0.5 0.6 0.9 0 0.4-0.1 0.6-0.3 0.8C8.9 14.9 8.7 15 8.4 15c-0.4 0-0.8-0.2-0.9-0.5 -0.1-0.1-0.1-0.2-0.1-0.4 0-0.2-0.2-0.3-0.3-0.3H6.3c-0.2 0-0.3 0.1-0.3 0.3 0 0.4 0.2 0.8 0.3 1.1C6.7 15.8 7.4 16.1 8.4 16.1zM12.3 11.1h1.1c0.2 0 0.3 0.1 0.3 0.3v4.3c0 0.2 0.1 0.3 0.3 0.3h0.8c0.2 0 0.3-0.1 0.3-0.3V9.2c0-0.2-0.1-0.3-0.3-0.3h-0.5c-0.2 0-0.3 0.1-0.3 0.1 0 0 0 0.1 0 0.1 -0.1 0.2-0.2 0.4-0.3 0.5 -0.2 0.2-0.4 0.3-0.7 0.4 -0.1 0-0.3 0.1-0.6 0.1 -0.2 0-0.3 0.2-0.3 0.3v0.3C12 10.9 12.1 11.1 12.3 11.1z" />
	                </svg>
	            </div>`,
	            `<div class="heartGroup dream">
                    <span class="userCarCat fa fa-heart"></span>
                </div>`,
                `<div class="soonGroup soonday">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
                            <path d="M10.4 2c-3.7 0-6.8 2.3-8 5.5l2.2 1c0.8-2.4 3.1-4.1 5.8-4.1 3.4 0 6.1 2.7 6.1 6.1s-2.7 6.1-6.1 6.1c-2.4 0-4.5-1.4-5.5-3.4l1.8-0.7L2.2 9.7l-1.2 5 1.6-0.7C4 17 7 19 10.4 19c4.7 0 8.6-3.8 8.6-8.5S15.2 2 10.4 2z"/>
                            <rect x="9" y="6" width="2" height="5"/>
                            <rect x="11" y="10" transform="matrix(0.6002 -0.7999 0.7999 0.6002 -5.2003 14.5968)" width="2" height="5"/>
                    </svg>
                </div>`
			];

			var selectedCategory = '',
			availableClasses = ['someday', 'dream', 'soonday'];


			if(!garageAsked){
				changeIfLog();

				usrGarageArr.forEach(function(itm, idx){
					var notSelectedCategories = '';

					$.map(availableClasses, function(item, index){

						if(item === itm.tipo){
							selectedCategory = availableCats[index];
						}else{

							notSelectedCategories += availableCats[index];
						}

					});

					var hrefPath = (localStorage.getItem('aUsrA') !== null && localStorage.getItem('aUsrA') !== undefined) ? `${pathnameRoot}catalogo/specific-version?al=${localStorage.getItem('aUsrA')}&brdId=${itm.brand_id}&mdlId=${itm.model_id}&cId=${itm.version_id}` : `${pathnameRoot}catalogo/specific-version?brdId=${itm.brand_id}&mdlId=${itm.model_id}&cId=${itm.version_id}`;
					var compareGroupEnd = (itm.esta_comparador !== null && itm.esta_comparador !== 'false') ? `<span class="fa fa-check-circle circle"></span><span class="message">En comparador</span>` : `<span class="fa fa-plus-circle circle"></span><span class="message">Agrega al comparador</span>`;
					var classesCompareGroup = (itm.esta_comparador !== null && itm.esta_comparador !== 'false') ? 'defaultPointer' : '';

					var auto = `<div class="col-xs-12 modelItem defaultPointer noPadding col-sm-6 col-md-4 garageImgCont ${itm.tipo}">
		                            <div class="sideInfoBar">
		                            	<span class="msgErrAddCat hiddenItm">No se pudo cambiar la categoría
											<br>
											Intente más tarde
		                            	</span>
		                                <div class="userCarCatCont">
		                                    <div class="selectionContainer">
		                                        <div class="selectedCat">
		                                            ${selectedCategory}
		                                        </div>
		                                        <div class="notSelectedCat">
		                                            ${notSelectedCategories}
		                                        </div>
		                                    </div>
		                                </div>
		                                <div class="toggleableIcons">
		                                    <div class="compareGroup ${classesCompareGroup}">
		                                        <span class="fa fa-long-arrow-right right"></span>
		                                        <span class="fa fa-long-arrow-left left"></span>
		                                        ${compareGroupEnd}
		                                    </div>
		                                    <div class="shareGroup shareLink">
		                                        <svg class="shareLink" xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
		                                          <g>
		                                                <path d="M17.8 6.2h-2.2c-0.4 0-0.8 0.4-0.8 0.8s0.4 0.8 0.8 0.8h1.4v10.7H4.2v-10.7h1.7c0.4 0 0.8-0.4 0.8-0.8s-0.4-0.8-0.9-0.8h-2.4c-0.5 0-0.8 0.4-0.8 0.8v12.3c0 0.4 0.3 0.7 0.8 0.7h14.5c0.4 0 0.8-0.3 0.8-0.7v-12.3C18.6 6.6 18.3 6.2 17.8 6.2zM9.4 3.9l0.3-0.1v10.2c0 0.4 0.4 0.8 0.8 0.8s0.8-0.4 0.8-0.8v-10.6l0.8 0.5c0.1 0.1 0.3 0.2 0.5 0.2 0.2 0 0.4-0.1 0.6-0.3 0.3-0.3 0.3-0.8-0.1-1.1l-2-1.5c-0.3-0.2-0.7-0.3-1 0 -0.1 0.1-1.8 1.5-1.8 1.5 -0.3 0.3-0.3 0.8 0 1.1C8.6 4.2 9.1 4.2 9.4 3.9z" />
		                                          </g>
		                                        </svg>
		                                        <!-- <span class="fa fa-long-arrow-up arUp"></span>
		                                        <span class="fa fa-square-o sqEmp"></span> -->
		                                        <span class="message">Compartir</span>
		                                    </div>
		                                    <div class="toggleTrashGrp">
		                                        <span class="fa fa-trash trash"></span>
		                                        <span class="message">Eliminar</span>
		                                    </div>
		                                </div>
		                                <span class="fa fa-ellipsis-h dots"></span>
		                            </div>
		                            <a href="${hrefPath}" class="garageItmAnchor">
			                            <img  src="${itm.pic_url}" class="noMargin garageImg img-responsive" border="0"/>
			                            <span class="hiddenItm garageVersionId">${itm.version_id}</span>
			                            <span class="hiddenItm garageModelId">${itm.model_id}</span>
			                            <span class="hiddenItm garageModelName">${itm.model_name}</span>
			                            <span class="hiddenItm garageModelPrice">$ ${itm.starting_price}</span>
			                            <span class="hiddenItm garageUsrCarId">${itm.garage_id}</span>
			                            <span class="hiddenItm garageUsrBrandId">${itm.brand_id}</span>
		                            </a>
		                        </div>`;

		                        if(loadingText.length){
		                        	loadingText.remove();
		                        }

		                        garageGrid.prepend(auto);
				});
			
			}

			sizingModelItms();
			garageAsked = true;
		}

		$(document).on('click', 'div.modelItem', function(e){
			var anchor = $(e).find('a.garageItmAnchor');
			var mdlID = anchor.children('span.garageModelId').text();
			var mdlNam = anchor.children('span.garageModelName').text();
			var mdlPrice = anchor.children('span.garageModelPrice').text();

			getVersions(mdlID, mdlNam, mdlPrice, 'prof');

		});

		$(document).on('click', 'div.compareGroup', function(e){

			var compareGroupEl = $(this),
			container = compareGroupEl.closest('div.garageImgCont'),
			versId = container.find('span.garageVersionId').text();

			console.log(compareGroupEl, container, versId);

			versId = parseInt(versId);

			var userId = parseInt(localStorage.getItem('aUsr'));
            var deviceId = localStorage.getItem('deviceId');

            var addedInComparatorAutos = (localStorage.getItem('addedInComAutosArr') !== null && localStorage.getItem('addedInComAutosArr') !== undefined) ? JSON.parse(localStorage.getItem('addedInComAutosArr')) : [];
            
            var dataForCompare = JSON.stringify({ 'device': deviceId, 'idUsr': userId, 'version': versId});

            con(dataForCompare);

            $.post('http://fuxkar.com/ws/v2/comparador/agregar',
	        	dataForCompare
	        ).then(function(data){

	            if(data.estado === 1){
	            	$('#successComparador').modal();

	            	addedInComparatorAutos.push(versId);
	            	addedInComparatorAutos = JSON.stringify(addedInComparatorAutos);
	            	localStorage.setItem('addedInComAutosArr', addedInComparatorAutos);

	            	compareGroupEl.find('span.circle').removeClass('fa-plus-circle').addClass('fa-check-circle');
	            	compareGroupEl.addClass('defaultPointer');
	            	compareGroupEl.find('span.message').text('En Comparador');
	            }
	        });

		});


		$(document).on('click', 'span.trash', function(){
			var el = $(this),
			container = el.closest('div.garageImgCont'),
			garageID = container.find('span.garageUsrCarId').text(),
			versId = container.find('span.garageVersionId').text();

			var userId = localStorage.getItem('aUsr');
            var devicId = localStorage.getItem('deviceId');
            var dataForDelete = {user: userId, device: devicId, garage: garageID};

            dataForDelete = JSON.stringify(dataForDelete);

            $.post('http://fuxkar.com/ws/v2/garage/quitar', 
                dataForDelete
            ).then(function(res){

                if(res.estado === 1){
                	con(res);
                	container.remove();
                	if(notNullNotUndefined(localStorage.getItem('addedAutosArr'))){
                		var addedAutosArr = JSON.parse(localStorage.getItem('addedAutosArr'));
                		versId = parseInt(versId);
                		var newAutosArr = $.grep(addedAutosArr, function(el, i){
                			var idItm = parseInt(el);
                			return idItm !== versId;
                		});

                		newAutosArr = JSON.stringify(newAutosArr);

                		localStorage.setItem('addedAutosArr', newAutosArr);

                	}
                   
                }else{
                	con(res);
                	alert('No se pudo eliminar el auto, intenta más tarde');
                }

               }).fail(function(err){
               		con('No se pudo eliminar el auto, intenta más tarde');
                	console.log(err);
            });

		});

		//change profile picture
		var headerBackImg = $('div.p-headerBackImg');


		$(document).on('click', 'div.ok', function(){

			if(localStorage.getItem('activeSession') === 'yes'){
				var logUsr = localStorage.getItem('aUsr');
				var visibleUserId = sessionStorage.getItem('currentUserId');

				if(notNullNotUndefined(logUsr)){
					logUsr = parseInt(logUsr);
					var visibleUser = (notNullNotUndefined(visibleUserId)) ? parseInt(visibleUserId) : parseInt(user.id);

					if(logUsr === visibleUser){

						setTimeout(function(){

							if(photoDiv.find('img').length){

								photoDiv.css({'background-image':  'none'});
								var dataImg = photoDiv.find('img').attr('src').replace(/^data:image\/(png|jpg);base64,/, "");
								sessionStorage.setItem('temptyImgForLocal', dataImg.toString());
								photoDiv.append('<span class="glyphicon glyphicon-camera profImgCameraIcon"></span>');
								changeProfilePhoto(dataImg, usrIDG);
							}

							if(headerBackImg.find('img').length){
								var dataImg = headerBackImg.find('img').attr('src').replace(/^data:image\/(png|jpg);base64,/, "");
								//con(dataImg);
							}

						}, 200);

					}else{
						alert('tienes estar logueado y usar tu perfil para cambiar la foto');

						setTimeout(function(){

							if(photoDiv.find('img').length){
								photoDiv.find('img').remove();
							}

						}, 200);
					}
				}
			}

		});


		var membershipDateCounter = $('div.membershipDateCounter');
		var dateProfileRgtBtnCont = $('div.dateProfileRgtBtnCont');

		function changeIfLog() {

			var photo = localStorage.getItem('aUPP');
			var logUsr = localStorage.getItem('aUsr');
			var logUserAlias = localStorage.getItem('aUsrA');
			
			var userInfoObj = sessionStorage.getItem('currentUserInfo');
			var visibleUserId = sessionStorage.getItem('currentUserId');

			var isInfo = (notNullNotUndefined(userInfoObj) && userInfoObj !== 'nothing stored') ? true : false;

			var user = {};

			let addGrgBtn = addGarageBtn;

			if(isInfo){

				if($.isArray(userInfoObj)){
					user = userInfoObj[0];
				}else if((typeof userInfoObj === 'object') && (userInfoObj !== null)){
					user = userInfoObj;
				}

			}


			//console.log('from navbar function', photo);

			//logueado
			if(notNullNotUndefined(logUsr)){

				logUsr = parseInt(logUsr);
				var visibleUser = (notNullNotUndefined(visibleUserId)) ? parseInt(visibleUserId) : parseInt(user.id);

				//viendo mi perfil
				if(logUsr === visibleUser){
					//aparecer toggleableArea the elementos de garage

					miniCameraIcon.removeClass('hiddenItm');
					headerCameraIcon.removeClass('hiddenItm');
					editProfileAnchor.removeClass('hiddenItm');

					photoDiv.addClass('p-profilePhoto').removeClass('p-profPict');

					(dateProfileRgtBtnCont.hasClass('hiddenItm')) ? null : dateProfileRgtBtnCont.addClass('hiddenItm');
					(membershipDateCounter.hasClass('hiddenItm')) ? membershipDateCounter.removeClass('hiddenItm') : null;
					(garageGrid.hasClass('noToggleArea')) ? garageGrid.removeClass('noToggleArea') : null;

					if($('nav.myNavBar').length){
						var theNavbar = $('nav.myNavBar');
						(isMyLocationHideMode("/web/perfil/")) ? theNavbar.addClass('noPhoto') : null;
					}

				//viendo el perfil de alguien más
				}else{
					//desaparecer toggeable area
					//aparecer datos de ingreso

					miniCameraIcon.addClass('hiddenItm');
					headerCameraIcon.addClass('hiddenItm');
					editProfileAnchor.addClass('hiddenItm');

					photoDiv.removeClass('p-profilePhoto').addClass('p-profPict');

					addGrgBtn.addClass('hiddenItm');


					(dateProfileRgtBtnCont.hasClass('hiddenItm')) ? null : dateProfileRgtBtnCont.addClass('hiddenItm');
					(membershipDateCounter.hasClass('hiddenItm')) ? membershipDateCounter.removeClass('hiddenItm') : null;
					(garageGrid.hasClass('noToggleArea')) ? null : garageGrid.addClass('noToggleArea');

					if($('nav.myNavBar').length && isInfo){
						var theNavbar = $('nav.myNavBar'); 
						theNavbar.removeClass('noPhoto');
					}
				}

			//no está logueado
			}else if(localStorage.getItem('activeSession') !== 'yes'){
				//desaparecer cámaras, datos de ingreso, toggeable area
				//aparecer botón
				miniCameraIcon.addClass('hiddenItm');
				headerCameraIcon.addClass('hiddenItm');
				editProfileAnchor.addClass('hiddenItm');
				photoDiv.removeClass('p-profilePhoto').addClass('p-profPict');

				addGrgBtn.addClass('hiddenItm');

				(membershipDateCounter.hasClass('hiddenItm')) ? null : membershipDateCounter.addClass('hiddenItm');
				(dateProfileRgtBtnCont.hasClass('hiddenItm')) ? dateProfileRgtBtnCont.removeClass('hiddenItm') : null;
				(garageGrid.hasClass('noToggleArea')) ? null : garageGrid.addClass('noToggleArea');
			}			
		}


		filterSelect.change(function(){
			var val = $(this).val();
			
			$('div.garageImgCont').each(function(idx, el){

				if($(el).hasClass(val)){
					$(el).show();
				}else{
					$(el).hide();
				}
			});
		});
	}

});