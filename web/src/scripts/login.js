import {navigating, myLocation, isMyLocationHideMode} from './commonFunc/locating.js';
import {con} from './commonFunc/consoling.js';
import {sendPostToGo, sendPostToGet} from './commonFunc/httpProcesor.js';

$(function(){

	var loginForm = $('#login');
	var userE = $('#l-email'),
	userPass = $('#l-pass'),
	linkReg = $('button#goToReg'),
	linkBrand = $('button#goToCatBrand'),
	passRecTxt = $('div.passRecover'),
	errMsg = $('div.errorLogin'),
	passCont = $('div#l-passCont'),
	emailCont = $('div#r-emailInputGrp'),
	recoverPass = false,
	normalText = $('span#normalText'),
	recoverPassTxt = $('span#recoverPassTxt'),
	subBtnNrTxt = $('span#subBtnNrTxt'),
	subBtnRecTxt = $('span#subBtnRecTxt'),
	loginBtnCont =$('div.loginBtnCont'),
	registrarbtn = $('button.registrarbtn'),
	cancelarBtn = $('button.cancelarBtn'),
	modal = $('div.passModalCont'),
	closeModal = $('span.closeModal'),
	resendPassMail = $('div.resendPart'),
	recoverPassFragment = $('span.mailRecover');

	userE.focus(removePrev);
	userPass.focus(removePrev);

	passRecTxt.click(recover);

	cancelarBtn.click(recoverPassEnd);

	

	linkReg.click(function(){
		//to save time, maybe, from here ask them
		sendPostToGet('catalogo/getmarcas', null, 'brands');
		navigating('registro');
	});

	closeModal.click(function(){
		modal.hide();
	});

	linkBrand.click(function(){
		sendPostToGo('catalogo/getmarcas', null, 'brands');
	})

	function recover(){
		removePrev();
		errMsg.disNone();
		passCont.an().remove();
		passRecTxt.an().remove();
		normalText.disNone();
		subBtnNrTxt.disNone();
		subBtnRecTxt.disBlock();
		recoverPassTxt.disBlock();
		cancelarBtn.disBlock();
		loginBtnCont.css({display: 'flex'}).removeClass('centerAlone');
		registrarbtn.addClass('NorightM halfML');
		recoverPass = true;
	}

	function recoverPassEnd() {
		recoverPass = false;
		loginBtnCont.disBlock().addClass('centerAlone');
		emailCont.after(passCont);
		errMsg.after(passRecTxt);
		recoverPassTxt.disNone();
		normalText.disBlock();
		subBtnRecTxt.disNone();
		subBtnNrTxt.disBlock();
		passCont.an();
		passRecTxt.an().click(recover);
		cancelarBtn.disNone();
		registrarbtn.removeClass('NorightM halfML');
	}


	loginForm.submit(function(e){

		e.preventDefault();
		var devID = localStorage.getItem('deviceId');
		devID = devID.toString();

		if(!recoverPass){
			var data = $(this).serializeArray();

			var values = {device: devID};

			$.map(data, function(itm, idx){
				values[itm.name] = itm.value;

			});

			sendLogin(values);

		}else{
			recoverPassEnd();

			var mailTxt = userE.val();
			var geoLoc = localStorage.getItem('location');
			var params = {device: devID, mail: mailTxt, geoloc: geoLoc};

			params = JSON.stringify(params);

			recoverPassSend(params, null);

		}

	});


	function sendLogin(val){
		
		var data = JSON.stringify(val);
		//sendPostToGo('usuario/login', data, 'perfil');
		//later when trying with the alias in url

		(!isMyLocationHideMode("/web/")) ? sendPostToGo('usuario/login', data, 'perfilLogIrgenwo') : sendPostToGo('usuario/login', data, 'perfilLog');

	}

	function recoverPassSend(argument, flag) {
		//console.log(argument)
		$.post('http://fuxkar.com/ws/v2/usuario/getpasswd', 
				argument
			).then(function(res){

				if(res.estado === 2){

					if(flag === null){
						
						if($('div#failLog').length){
							
							recoverPassEnd();

							$('div#failLog').modal('hide');
						}
						displayRecoverModal();						
					
					}else{
					
						modal.hide();
					
					}
				}

			 }).fail(function(err){

			 	showSubmitError();
		  		console.log(err);
			});
	}


	$.fn.disNone = function(){
		
		this.css({display: 'none'});
		return this;
	}

	$.fn.disBlock = function(){
		this.css({display: 'block'});
		return this;
	}

	$.fn.an = function(){
		this.animate({height: 'toggle'}, 200);
		return this;
	}


	function showSubmitError() {
		errMsg.disBlock();
		userE.val("");
		userPass.val("");
	}

	function removePrev(){
		var prevEl = registrarbtn.prev('p#nicknameText');
		prevEl.remove();
		passCont.disBlock();
	}

	function displayRecoverModal() {

		modal.css({display: 'flex'});
		
		var devID = localStorage.getItem('deviceId');
		devID = devID.toString();
		var mailTxt = userE.val();
		var geoLoc = localStorage.getItem('location');
		var params = {device: devID, mail: mailTxt, geoloc: geoLoc};

		resendPassMail.click(function(){
			params = JSON.stringify(params);

			//var mailGood = sessionStorage.getItem('mailGood');

			recoverPassSend(params,'etw');
			/*if(mailGood === 'yes'){
			}*/
		});
	}




});