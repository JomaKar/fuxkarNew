import {con} from './commonFunc/consoling.js';

$(function(){

	var nickInput = $('input#alias');


	$.fn.nicknameValidation = function(el){
		$(this).keyup(function () {
			var nextEl = $('p#nicknameText');
			nextEl.remove();
		});

		$(this).focus(function(){
			
			var nextEl = $('p#nicknameText');
			nextEl.remove();

		}).blur(function() {

			var posNick = $(this).val();
			nickValidator(posNick);
		    
		});

		function nickValidator(val){
			if(val.length > 0){
				var data = JSON.stringify({'nickname': val});
				$.post('http://fuxkar.com/ws/v2/usuario/validanickname', 
					data
				).then(function(res){ 
					//con(res)
					if(res.estado === 2){
						nickExist(res);
					}else if(res.estado === 1){
						sayIfDoes(res);
					}

				}).fail(function(err){
			
			  		sayIfDoes('noOne');

				});	
			}	
		}


		function sayIfDoes(val) {
			var posNick = el.val();

			if (val !== 'noOne') {
				var greenLight = "<p id='nicknameText' class='goodText'>"+ posNick +" es un nickname bueno</p>";
				sessionStorage.setItem('nickGood', 'yes');
				el.after(greenLight);

			} else {

				var wrongOne = "<p id='nicknameText' class='badText'>"+ posNick +" es un nickname que ya existe</p>";
				el.after(wrongOne);
				sessionStorage.setItem('nickGood', 'no');

			}
		}

		function nickExist() {
			var posNick = el.val();
			var alreadyNick = "<p id='nicknameText' class='badText'>"+ posNick +" es un nickname que ya existe</p>";
			sessionStorage.setItem('nickGood', 'no');
			el.after(alreadyNick);
		}


	}

	nickInput.nicknameValidation(nickInput);
});