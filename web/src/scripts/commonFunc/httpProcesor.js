import {notNullNotUndefined, NullOrUndefined} from './differentOfNullAndUndefined.js';
import {navigating, myLocation, isMyLocationHideMode} from './locating.js';
import {displayErr} from './displayErrs.js';
import {con} from './consoling.js';
import {queriesT, hashesExist} from './urlEncoder.js';
import {returnAlreadyVisitedProfileId, returnIdOfAlias, recordNewVisitedProfile} from './visitedProfilesRecord.js';

//urlEnd inticate where to go

var editChangeSpan = $('#successEditProfile').find('span.datoDetail');

export function sendPostToGo(urlEnd, data, whereTo){
	//console.log('from sendPostToGo', data);
	console.log(data, 'from sendToGo processor', whereTo);

	var usr = localStorage.getItem('aUsrA');

	if(whereTo === 'specVer'){
		var brandId = urlEnd.brand_id;
		var modelId = urlEnd.model_id;
		var autoId = urlEnd.id;

		(checkIfActive()) ? navigating(`catalogo/specific-version?al=${usr}&brdId=${brandId}&mdlId=${modelId}&cId=${autoId}`) : navigating(`catalogo/specific-version?brdId=${brandId}&mdlId=${modelId}&cId=${autoId}`);

	}

	$.post(`http://fuxkar.com/ws/v2/${urlEnd}`, 
				data
		).then(function(res){

			//con(res);
			// somebody wants to go to his profile (login) or just accessing to session. its always with sign in form
			if(whereTo === 'perfilLog' || whereTo === 'perfilLogIrgenwo'){
				
				if(res.estado === 1){


					var id = res.mensaje.rs;

					localStorage.setItem('activeSession', 'yes');


					var devicId = localStorage.getItem('deviceId');
					
					var data = JSON.stringify({idUsr: id});

					var dataForGarage = JSON.stringify({idUsr: id, device: devicId});

					sendPostToGet('garage/listar', dataForGarage, 'usrGrg');

					// usrInfoToGo is used when actually the person is entering to his profile fromo the loggin page
					// usrInfoToGetR when somebody doesn't want to go to his profile but wants to get into his session
					(whereTo !== 'perfilLogIrgenwo') ? sendPostToGet('usuario/info', data, 'usrInfoToGo') : sendPostToGet('usuario/info', data, 'usrInfoToGetR');
					

					localStorage.setItem('aUsr', id.toString());					
					ssRmForSet('currentUserId', id.toString());


				}else{
					con('whatTheFuck')
					displayErr('login');
				}

			// when somebody sign up
			}if(whereTo === 'perfilr' && res.estado === 1){
				
				var id = res.mensaje.usr.id,
				alias = res.mensaje.usr.alias;


				localStorage.setItem('aUsrA', alias);

				var usrPhoto = (notNullNotUndefined(res.mensaje.usr.foto_perfil)) ? res.mensaje.usr.foto_perfil.toString() : '';
				if(usrPhoto.length > 5){localStorage.setItem('aUPP', usrPhoto);}
				
				var userInfo = [];
				userInfo[0] = res.mensaje.usr;
				userInfo = JSON.stringify(userInfo);
				localStorage.setItem('aUsr', id.toString());

				ssRmForSet('currentUserId', id);
				ssRmForSet('currentUserAlias', alias);
				ssRmForSet('currentUserInfo', userInfo);
				
				localStorage.setItem('activeSession', 'yes');

				if(notNullNotUndefined(queriesT.al)){
					con('why doesnt work?');
					(queriesT.al != alias && !isMyLocationHideMode("/web/perfil/")) ? navigating(`perfil?al=${alias}`) : navigating(`perfil`);
				}else{
					navigating(`perfil?al=${alias}`);
				}

				callVisitRecording(id, alias, 'registro');

			}else if(whereTo === 'brands' && res.estado === 1){

				var brands = JSON.stringify(res.mensaje.rs);
				sessionStorage.setItem('catalogBrands', brands);

				(checkIfActive()) ? navigating(`catalogo/?al=${usr}`) : navigating(`catalogo/?`);

			}else if(whereTo === 'mdls' && res.estado === 1){

				var modelsArr = res.mensaje.rs;
				var brandId = res.mensaje.rs[0].brand_id;
				modelsArr = JSON.stringify(modelsArr);
				sessionStorage.setItem('modelsArr', modelsArr);

				(checkIfActive()) ? navigating(`catalogo/brand-modelo?al=${usr}&brdId=${brandId}`) : navigating(`catalogo/brand-modelo?brdId=${brandId}`);
			
			}else if(whereTo === 'versiones' && res.estado === 1){
				var versionsArr = res.mensaje.rs;

				sessionStorage.setItem('currentBrandImg', versionsArr[0].pic_marca.toString());
				localStorage.setItem('modelName', versionsArr[0].model_name.toString());

				versionsArr = JSON.stringify(versionsArr);
				sessionStorage.setItem('versionsArr', versionsArr);
				var brandId = res.mensaje.rs[0].brand_id;
				var modelId = res.mensaje.rs[0].model_id;
				
				(checkIfActive()) ? navigating(`catalogo/modelo-versiones?al=${usr}&brdId=${brandId}&mdlId=${modelId}`) : navigating(`catalogo/modelo-versiones?brdId=${brandId}&mdlId=${modelId}`);

			}

		}).fail(function(err){
	  		console.log(err);
	});

}

export function sendPostToGet(urlEnd, data, flag){
	console.log(data, 'from sendToGet processor', flag);

	var datos = (data) ? data : '';

	$.post(`http://fuxkar.com/ws/v2/${urlEnd}`, 
				datos
		).then(function(res){
			
			//con(res);
			// somebody wants to go to his profile or just accessing to session. its always with sign in form
			if(flag === 'usrInfoToGetR' || flag === 'usrInfoToGo'){

				if(res.estado === 1){

					var userInfo = [];
					userInfo[0] = res.mensaje.rs[0];
					//console.log('from https', userInfo); goes to fast


					var usrPhoto = (notNullNotUndefined(userInfo[0].foto_perfil)) ? userInfo[0].foto_perfil.toString() : '';
					if(usrPhoto.length > 0){localStorage.setItem('aUPP', usrPhoto);}

					var usrA = userInfo[0].alias;
					var userId = userInfo[0].id;


					var device = localStorage.getItem('deviceId');

					userInfo = JSON.stringify(userInfo);
					localStorage.setItem('aUsrA', usrA);


					ssRmForSet('currentUserAlias', usrA);
					ssRmForSet('currentUserInfo', userInfo);


					// when somebody get into session but not directly to his profile
					if(flag === 'usrInfoToGetR'){

						var routHref = window.location.href;
						var params = routHref.slice(routHref.indexOf('?') + 1);

						let windowLoc = (notNullNotUndefined(queriesT.al)) ? `${window.location.pathname}?${params}` : `${window.location.pathname}?al=${usrA}&${params}`;
						// console.log('whereTo', windowLoc);
						window.location = windowLoc;

					// when somebody get into session to his profile
					}else{

						if(!isMyLocationHideMode("/web/perfil/")){
							if(notNullNotUndefined(queriesT.al)){
								// con('why doesnt work?');
								(queriesT.al != usrA && !isMyLocationHideMode("/web/perfil/")) ? navigating(`perfil?al=${usrA}`) : navigating(`perfil`);
							}else{
								navigating(`perfil?al=${usrA}`);
							}
						}
					}

					callVisitRecording(userId, usrA, 'logging');

				}


			// somebody is in some profile page
			}else if(res.estado === 1 && flag === 'usrInfoToGet'){


				var userInfo = [];
				userInfo[0] = res.mensaje.rs[0];
				//console.log('from https', userInfo); goes to fast

				var usrA = userInfo[0].alias;
				var userId = userInfo[0].id;
				
				ssRmForSet('currentUserAlias', usrA.toString());
				ssRmForSet('currentUserId', userId.toString());

				userInfo = JSON.stringify(userInfo);

				ssRmForSet('currentUserInfo', userInfo);

				var device = localStorage.getItem('deviceId');
				callVisitRecording(userId, usrA, 'justVisitingProfile');

			}else if(flag === 'usrGrg'){


				if(res.estado === 1){

					var userGarage = res.mensaje.rs;
					userGarage = JSON.stringify(userGarage);

					ssRmForSet('currentUserGarage', userGarage);
					
				}else{
					sessionStorage.setItem('currentUserGarage', 'nothing stored');
				}

			}else if(flag === 'validaMail'){
				con(res);
				if(res.estado === 1){
					$('div#successMailVal').find('p.textRes').empty().text(res.mensaje.rs);
					$('div#successMailVal').modal();
				}

			}else if(flag === 'usrAct'){
				//console.log('trying to change profila photo', res);

				if(res.estado === 1){

					//console.log('success', res.mensaje);

					if(notNullNotUndefined(sessionStorage.getItem('temptyImgForLocal'))){
						var photoOficial = sessionStorage.getItem('temptyImgForLocal');
						localStorage.setItem('aUPP', photoOficial.toString());

						if(notNullNotUndefined(sessionStorage.getItem('currentUserInfo'))){
							var usrString = sessionStorage.getItem('currentUserInfo');
							var usrNow = JSON.parse(usrString);

							if($.isArray(usrNow)){
								(usrNow.length > 0) ? usrNow[0].foto_perfil = photoOficial : null;
							}else if((typeof usrNow === "object") && (usrNow !== null)){
								usrNow.foto_perfil = photoOficial;
							}

							usrNow = JSON.stringify(usrNow);

							sessionStorage.setItem('currentUserInfo', usrNow);
						}

						
					}
					
				}
			
			}else if(flag === 'usrContact'){
				//console.log('trying to change profila photo', res);

				if(res.estado === 1){

					$('input.referidoEdit').attr('readonly', true);

					//console.log('success', res.mensaje);

					localStorage.setItem('contactChange', 'y');

					if(notNullNotUndefined(localStorage.getItem('passwordChange'))){
						(notNullNotUndefined(localStorage.getItem('infoChange'))) ? editChangeSpan.text('contraseña, nuevo contacto de referencia e información general se ha guardado') : editChangeSpan.text('contraseña y nuevo contacto de referencia se han guardado. Pero la demás información no');
					}else{
						(notNullNotUndefined(localStorage.getItem('infoChange'))) ? editChangeSpan.text('nuevo contacto de referencia e información general se ha guardado') : editChangeSpan.text('nuevo contacto de referencia se ha guardado. Pero la demás información no');
					}


					if(notNullNotUndefined(sessionStorage.getItem('temptyNewContact'))){
						var contactNew = sessionStorage.getItem('temptyNewContact');

						if(notNullNotUndefined(sessionStorage.getItem('currentUserInfo'))){
							var usrString = sessionStorage.getItem('currentUserInfo');
							var usrNow = JSON.parse(usrString);

							if($.isArray(usrNow)){
								(usrNow.length > 0) ? usrNow[0].invitado_por = contactNew : null;
							}else if((typeof usrNow === "object") && (usrNow !== null)){
								usrNow.invitado_por = contactNew;
							}

							usrNow = JSON.stringify(usrNow);

							sessionStorage.setItem('currentUserInfo', usrNow);
						}

						
					}
					
				}else{
					console.log(res);
				}
			
			}else if(flag === 'usrPass'){

				if(res.estado === 1){
					localStorage.setItem('passwordChange', 'y');

					if(notNullNotUndefined(localStorage.getItem('contactChange'))){
						(notNullNotUndefined(localStorage.getItem('infoChange'))) ? editChangeSpan.text('contraseña, nuevo contacto de referencia e información general se ha guardado') : editChangeSpan.text('contraseña y nuevo contacto de referencia se han guardado. Pero no la demás información');
					}else{
						(notNullNotUndefined(localStorage.getItem('infoChange'))) ? editChangeSpan.text('contraseña e información general se ha guardado') : editChangeSpan.text('contraseña se ha guardado. Pero no la demás información');
					}
				}

			}else if(flag === 'usrFullEdit'){
				
				if(res.estado === 1){
					
					localStorage.setItem('infoChange', 'y');


					if(notNullNotUndefined(localStorage.getItem('contactChange'))){
						(notNullNotUndefined(localStorage.getItem('passwordChange'))) ? editChangeSpan.text('contraseña, nuevo contacto de referencia e información general se ha guardado') : editChangeSpan.text('nuevo contacto de referencia e información se han guardado');
					}else{
						(notNullNotUndefined(localStorage.getItem('passwordChange'))) ? editChangeSpan.text('contraseña e información general se ha guardado') : editChangeSpan.text('información general se ha guardado');
					}

					$('div#successEditProfile').modal();


					if(notNullNotUndefined(sessionStorage.getItem('currentUserInfo'))){
						var usrString = sessionStorage.getItem('currentUserInfo');
						var usrNow = JSON.parse(usrString);
						var newData = JSON.parse(datos);

						console.log('actFullBef', newData, usrNow);

						if($.isArray(usrNow)){
							if(usrNow.length > 0){
								var usrOb = usrNow[0];

								var datosToChange = ['fecha_nac', 'foto_perfil', 'full_name', 'genero', 'materno', 'paterno', 'nombre', 'tags'];

								$.each(datosToChange, function(i, itm){
									if(itm === 'full_name'){
										usrOb[itm] = `${newData.nombre} ${newData.paterno} ${newData.materno}`;
									}else if(itm === 'fecha_nac'){
										usrOb[itm] = newData.fecha_nacimiento;
									}else if(itm === 'foto_perfil'){
										usrOb[itm] = newData.foto;
									}else{
										usrOb[itm] = newData[itm];
									}
								});

								usrNow[0] = usrOb;
							}
						}else if((typeof usrNow === "object") && (usrNow !== null)){
							var datosToChange = ['fecha_nac', 'foto_perfil', 'full_name', 'genero', 'materno', 'paterno', 'nombre', 'tags'];

								$.each(datosToChange, function(i, itm){
									if(itm === 'full_name'){
										usrNow[itm] = `${newData.nombre} ${newData.paterno} ${newData.materno}`;
									}else if(itm === 'fecha_nac'){
										usrNow[itm] = newData.fecha_nacimiento;
									}else if(itm === 'foto_perfil'){
										usrNow[itm] = newData.foto;
									}else{
										usrNow[itm] = newData[itm];
									}
								});
						}

						//console.log('actFullAft', usrNow);

						usrNow = JSON.stringify(usrNow);

						sessionStorage.setItem('currentUserInfo', usrNow);
					}

				}

			}else if(flag === 'brands' && res.estado === 1){

				var brands = res.mensaje.rs;
		        brands = JSON.stringify(brands);
		        sessionStorage.setItem('catalogBrands', brands);

			}else if(flag === 'mdls' && res.estado === 1){

				var modelsArr = res.mensaje.rs;
	            modelsArr = JSON.stringify(modelsArr);
	            sessionStorage.setItem('modelsArr', modelsArr);

			}else if(flag === 'vrsInfo' && res.estado === 1){

				var versionsArr = res.mensaje.rs;
				sessionStorage.setItem('currentBrandImg', versionsArr[0].pic_marca.toString());
				localStorage.setItem('modelName', versionsArr[0].model_name.toString());
				versionsArr = JSON.stringify(versionsArr);
				sessionStorage.setItem('versionsArr', versionsArr);

			}else if(flag === 'vrsGal' && res.estado === 1){

				var versionsPicts = res.mensaje.rs;
                versionsPicts = JSON.stringify(versionsPicts);
                sessionStorage.setItem('versionsPhotos', versionsPicts);

			}else if(flag === 'spVrsInfo' && res.estado === 1){

				var versionsArr = res.mensaje.rs;
				var versionsToTransform = res.mensaje.rs;

				sessionStorage.setItem('currentBrandImg', versionsArr[0].pic_marca.toString());
				localStorage.setItem('modelName', versionsArr[0].model_name.toString());

				if(hashesExist){

					if(queriesT.cId.length > 0){
						var carId = parseInt(queriesT.cId);

						var versionArr = $.grep(versionsToTransform, function(el, idx){
							var objId = parseInt(el.id);
							if(objId === carId){

								return  el;
							} 

						});
						
						var version = versionArr[0];
						version = JSON.stringify(version);
						sessionStorage.setItem('versionStored', version);
						
					}
				}

				versionsArr = JSON.stringify(versionsArr);
				sessionStorage.setItem('versionsArr', versionsArr);

			}

		}).fail(function(err){
	  		console.log(err);
	});

}

function checkIfActive(){
	var session = localStorage.getItem('activeSession');

	return (session === 'yes') ? true : false;
}


function ssRmForSet(item, data) {
	sessionStorage.removeItem(item);
	sessionStorage.setItem(item, data);
}

// called when:
	// somebody sign up
	// somebody sign in
	// 
function callVisitRecording(id, al, origin){
	console.log('fromHTTP-visit2', id, al);
	setTimeout(() => {
		recordNewVisitedProfile(id, al, origin);
	}, 400);
}

