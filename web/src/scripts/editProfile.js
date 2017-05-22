import { myLocation, pathnameRoot, isMyLocationExpMode} from './commonFunc/locating.js';
import {con} from './commonFunc/consoling.js';
import {queriesT, hashesExist} from './commonFunc/urlEncoder.js';
import {sendPostToGo, sendPostToGet} from './commonFunc/httpProcesor.js';
import {changeProfilePhoto} from './commonFunc/changeProfilePhoto.js';
import {notNullNotUndefined, NullOrUndefined} from './commonFunc/differentOfNullAndUndefined.js';

$(function(){

	if(isMyLocationExpMode("/web/perfil/configuracion")){

		//DOM variables

		const configForm = $('form#configForm'),
		formSecondPart = $('div.formSecondPart'),
		formFirstPart = $('div.formFirstPart'),
		passChA = $('div.passwordChangeArea'),
		passEditBtn = $('button.passEditBtn'),
		passInptsCont = $('div.passwordChangeInptsCont'),
		inpOldPass = $('input#inpOldPass'),
		inpPassNew = $('input#inpPassNew'),
		inpPassNewConf = $('input#inpPassNewConf'),
		mailInpEdit = $('input.mailInpEdit'),
		btnValidate = $('button.validateMailBtn'),
		contactInp = $('input#referido'),
		profileImgCont = $('div.profileImgCont'),
		editTagsCont = $('div.editTagsCont');

		const divMaterno = $('div.divMaterno');
		const divPaterno = $('div.divPaterno');


		var changeContact = false,
		validateMail = false,
		changePass = false,
		changePassAskStop = false,
		changePhoto = false,
		dataOK = true;

		var defaultContact = '';
		var initialInfo = {};
		var dataImg = '';

		var contactId;
		var dataForFullAct = {device: localStorage.getItem('deviceId'), geoloc: localStorage.getItem('location'), user: localStorage.getItem('aUsr')};

		$(document).ready(function(){
			sizing();
		});

		$(window).resize(function(){
			sizing();
		});

		var askInt = setInterval(function(){

			checkUser(sessionStorage.getItem('currentUserInfo'));

		}, 5);


		function checkUser(usr) {
			if(notNullNotUndefined(usr)){
				clearInterval(askInt);
				usr = JSON.parse(usr);
				displayInForm(usr);
			}
		}

		passEditBtn.click(function(){
			$(this).addClass('hiddenItm');
			passInptsCont.css({visibility: 'visible'});
			changePass = true;
			inpOldPass.prop('required', true);
			inpPassNew.prop('required', true);
			inpPassNewConf.prop('required', true);
		})

		function displayInForm(userObj) {
			con(userObj);

			initialInfo = userObj[0];
			dataImg = userObj[0].foto_perfil;

			$.map(userObj[0], function(val, key){

				if(key === 'foto_perfil'){

					$(`img.${key}`).attr('src', `data:image/png;base64,${val}`);

				}else if(key === 'genero'){
					var chckBoxes = configForm.find(`input[name='${key}']`);
					chckBoxes.each(function(i, el){
						if($(el).val() === val){
							$(el).attr('checked', true);
						}
					});

				}else if(key === 'mca_okmail'){
					var value = parseInt(val);

					if(value === 1){
						adjustValBtn('y');
					}

				}else{
					configForm.find(`input[name='${key}']`).val(val);
					
					if(key === 'tags'){
						configForm.find(`textarea[name='${key}']`).val(val);
					}

					if(key === 'invitado_por'){
						defaultContact = val;
						// achtung
					  	// ///////
					  	// ///////
					  	// ///////
						(val == 'Usuario Pruebas' || val === null || val == 'Sin invitación') ? (configForm.find(`input[name='${key}']`).removeAttr('readonly'), changeContact = true) : changeContact = false;
						//console.log('when displaying', val, changeContact);
					}
				}

			});
		}

		// revalidar el mail
		btnValidate.click(function(){
			let mail = mailInpEdit.val();
			var data = {device: localStorage.getItem('deviceId'), user: localStorage.getItem('aUsr'), mail: mail, geoloc: localStorage.getItem('location')};
			sendPostToGet('usuario/enviacodigo', JSON.stringify(data), 'validaMail');

		});

		// click on a posible friendo, when editting that field
		$(document).on('click', 'li.posibleFriend', function(e){
			var cId = $(this).find('span.friendId').text();

			//console.log('posibleFriend', cId);

			sessionStorage.setItem('idPsFriend', cId);
		});

		// for saving new foto
		$(document).on('click', 'div.ok', function(){

				changePhoto = true;


				setTimeout(function(){

					if(profileImgCont.find('img').length){

						profileImgCont.css({'background-image':  'none'});
						dataImg = profileImgCont.find('img').attr('src').replace(/^data:image\/(png|jpg);base64,/, "");
						sessionStorage.setItem('temptyImgForLocal', dataImg.toString());
					}

				}, 200);

		});

		configForm.submit(function(e){
			e.preventDefault();

			var data = $(this).serializeArray();

			//con(data);

			data.forEach(function(itm, idx){

				if(itm.name === 'invitado_por' && changeContact){
					var contactVal = contactInp.val();
					//console.log(contactVal, defaultContact, changeContact);

					(contactVal != defaultContact) ? changeContactProcess(sessionStorage.getItem('idPsFriend'), contactVal) : null;
				
				}else if(itm.name === 'actual' || itm.name === 'nueva' || itm.name === 'nuevaConf'){
					(itm.value !== '' && changePass) ? changePassProcess() : null;
				
				}else if(itm.name === 'nombre' || itm.name === 'paterno' || itm.name === 'materno' || itm.name === 'genero' || itm.name === 'tags' || itm.name === 'fecha_nac'){
					if(!$.isEmptyObject(initialInfo)){
						if(itm.name !== 'fecha_nac'){
							(initialInfo[itm.name] == itm.value) ? dataForFullAct[itm.name] = initialInfo[itm.name] : dataForFullAct[itm.name] = itm.value;
						}else{
							(initialInfo[itm.name] == itm.value) ? dataForFullAct.fecha_nacimiento = initialInfo[itm.name] : dataForFullAct.fecha_nacimiento = itm.value;
						}
					}
				}
			});

			if(changePhoto){
				var logUsr = parseInt(localStorage.getItem('aUsr'));
				changeProfilePhoto(dataImg, logUsr);
			}

			sendFullUpdate(dataForFullAct);

		});

		function changePassProcess() {
			if(!changePassAskStop){
				
				changePassAskStop = true;
				
				var OldPassTxt = inpOldPass.val();
				var PassNewTxt = inpPassNew.val();
				var PassNewConfTxt = inpPassNewConf.val();

				if(PassNewTxt !== '' && PassNewTxt === PassNewConfTxt && PassNewConfTxt !== '' && OldPassTxt !== '' && PassNewTxt !== OldPassTxt){

					dataOK = true;
					var dataForChangePass = JSON.stringify({device: localStorage.getItem('deviceId'), geoloc: localStorage.getItem('location'), user: localStorage.getItem('aUsr'), actual: OldPassTxt, nueva: PassNewTxt});
					sendPostToGet('usuario/cambiapsw', dataForChangePass, 'usrPass');

				}else{
					alert('las nuevas contraseñas no son iguales');
					dataOK = false;
					changePassAskStop = false;
				}
			}
		}

		function changeContactProcess(id, name) {
			var theId = parseInt(id);
			sessionStorage.setItem('temptyNewContact', name.toString());
			var dataForChangeContact = {device: localStorage.getItem('deviceId'), user: localStorage.getItem('aUsr'), campo: 'refered', dato: id};
			//console.log('processing to send', data);
			dataForChangeContact = JSON.stringify(dataForChangeContact);
			sendPostToGet('usuario/actualizadato', dataForChangeContact, 'usrContact');

		}

		function sendFullUpdate(data) {
			data.foto = dataImg;

			con(data);

			data = JSON.stringify(data);

			(dataOK) ? sendPostToGet('usuario/actualizar', data , 'usrFullEdit') : null;

		}

		// watch how several elements work according to device's width
		function sizing(){
			
			let outWidth = $(window).outerWidth();

			var passBtnContH = passChA.height();
			var passBtnContW = passChA.width();
			var btnW = passEditBtn.width();
			var btnH = passEditBtn.height();

			var btnTopMargin = passBtnContH/2 - btnH/2;
			var btnLeftMargin = passBtnContW/2 - btnW/2;

			//console.log(passBtnContH/2, btnH/2, btnTopMargin, 'heightR');
			//console.log(passBtnContW/2, btnW/2, btnLeftMargin, 'widthR');
			
			passEditBtn.css({
				'margin-top': btnTopMargin - 12,
				'margin-left': btnLeftMargin - 12
			});

			adjustValBtn(null)

			if(outWidth < 768){
			
				formSecondPart.removeClass('NorightP halfL').addClass('noPadding');
				formFirstPart.removeClass('NoleftP halfR').addClass('noPadding');
				adjustInputs('down');
			
			}else if(outWidth >= 768){

				formSecondPart.addClass('NorightP halfL').removeClass('noPadding');
				formFirstPart.addClass('NoleftP halfR').removeClass('noPadding');
				
				if(outWidth < 992){
					adjustInputs('down');
				}else{
					adjustInputs('up');
				}

			}

		}


		// this functions works for adjusting the button inside the mail input
		// in case the mail is already validated, remove that button
		// if not, keeps watching how it works according to device's width
		function adjustValBtn(stop) {
			if(stop === 'y'){
				validateMail = true;
				mailInpEdit.css({'padding-right': '5px !important'});
				btnValidate.remove();

			}else if(!validateMail){

				var rightP = btnValidate.outerWidth();
				mailInpEdit.css({'padding-right': rightP + 4})
			}
			// body...
		}


		// watch how several elements work according to device's width
		function adjustInputs(flag){
			if(flag === 'down'){
				divPaterno.removeClass('NoleftP halfR').css({padding: '0px 0px 6px'});
				divMaterno.removeClass('NorightP halfL').css({padding: '6px 0px 0px'});
				inpPassNewConf.closest('div.col-md-6').removeClass('NorightP halfL').addClass('noPadding');
				inpPassNew.closest('div.col-md-6').removeClass('NoleftP halfR').addClass('noPadding');
				profileImgCont.removeClass('NorightP halfL').addClass('NoleftP halfR');
				editTagsCont.addClass('NorightP halfL');
			}else{
				inpPassNewConf.closest('div.col-md-6').addClass('NorightP halfL').removeClass('noPadding');
				inpPassNew.closest('div.col-md-6').addClass('NoleftP halfR').removeClass('noPadding');
				divPaterno.addClass('NoleftP halfR');
				divMaterno.addClass('NorightP halfL').removeClass('noPadding');
			}
		}

	}

});