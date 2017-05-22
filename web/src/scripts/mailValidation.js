import {con} from './commonFunc/consoling.js';

$(function(){


	var nickInput = $('input#inputEmail'),
	loginMailInput = $('#l-email'),
	passInput = $('input#inputPassword'),
	passRecTxt = $('div.passRecover'),
	submitButt = $('button.registrarbtn.loginBtn'),
	passConfInput = $('input#inputPassword2');

	var camaleonUUID = 0, 
	fakingUUIDAsking = 0;

	$.fn.validatePass = function(){
		$(this).keyup(function(){
			var nextEl = $('p#passConfText');
			nextEl.remove();
		})

		$(this).focus(function(){

			var nextEl = $('p#passConfText');
			nextEl.remove();

		}).blur(function() {

			var confVal = $(this).val();
			
		    passConfirmation(confVal);
		});

		function passConfirmation(val){
			var pass = passInput.val();

			if(pass.length > 0 && pass !== val){

				var badConf = "<p id='passConfText' class='badText'>Las contraseñas no coinciden</p>";

				passConfInput.after(badConf);	

			}
		}


		return this;
	
	}

	passConfInput.validatePass();

	$.fn.validateMail = function(el, flag){
		
		$(document).ready(function(){

			setTimeout(function(){
				var txt = $(el).val();
				if(txt !== undefined){
					if(txt.length > 0){
						mailValidator(txt);
					}
				}
			}, 300);

		})

		passRecTxt.click(function(){
			var txt = $(el).val();
			if(txt !== undefined){
				if(txt.length > 0){
					mailValidator(txt);
				}
			}
		});

		submitButt.click(function(){
			var txt = $(el).val();
			if(txt !== undefined){
				if(txt.length > 0){
					mailValidator(txt);
				}
			}
		});

		$(this).keyup(function () {
			var nextEl = $('p#mailValText');
			nextEl.remove();
		})

		$(this).focus(function(){
		
			var nextEl = $('p#mailValText');
			nextEl.remove();
			var posMail = $(this).val();
			if(posMail.length > 0){
				mailValidator(posMail);
			}

		}).blur(function() {

			var posMail = $(this).val();
			mailValidator(posMail);
		    
		});


		function mailValidator(val){
			if(val.length > 0){

				var devID = localStorage.getItem('deviceId');
				devID = devID.toString();

				var data = JSON.stringify({'email': val, 'device': devID});

				$.post('http://fuxkar.com/ws/v2/usuario/validacorreo', 
					data
				).then(function(res){ 

					if(res.estado === 2){
						mailExist(res);  
					}else if(res.estado === 1){
						newMail(res);
					}

				}).fail(function(err){

			  		mailExist('noOne');

				});	
			}	
		}


		function mailExist(val) {
			var posMail = el.val();

			if (val !== 'noOne' && flag === 'l') {
				var greenLight = "<p id='mailValText' class='goodText'>"+ posMail +" es un buen mail</p>";
				sessionStorage.setItem('mailGood', 'yes');
				
				removeLast()
				el.after(greenLight);

			} else if(val === 'noOne'){

				var wrongOne = "<p id='mailValText' class='badText'>"+ posMail +" es un mail incorrecto</p>";
				var nextEl = $('p#mailValText');
				removeLast()
				sessionStorage.setItem('mailGood', 'no');

			}else if(val !== 'noOne' && flag === 'r'){

				sessionStorage.setItem('mailGood', 'no');
				var existOne = "<p id='mailValText' class='badText'>"+ posMail +" es un mail que ya existe</p>";
				removeLast()
				el.after(existOne);
			}

		}

		function newMail(val) {
			var posMail = el.val();

			if (flag === 'r') {
				var greenLight = "<p id='mailValText' class='goodText'>"+ posMail +" es un buen mail</p>";
				sessionStorage.setItem('mailGood', 'yes');
				removeLast()
				el.after(greenLight);

			}else if(flag === 'l'){
				var existOne = "<p id='mailValText' class='badText'>"+ posMail +" es un mail que no existe aún</p>";
				sessionStorage.setItem('mailGood', 'no');
				removeLast()
				el.after(existOne);
			}
		}

		function removeLast() {
			var nextEl = $('p#mailValText');
			nextEl.remove();
		}

		return this;
	}

	nickInput.validateMail(nickInput, 'r');

	//loginMailInput.validateMail(loginMailInput, 'l');

});