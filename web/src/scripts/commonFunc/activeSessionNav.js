import {queriesT, hashesExist} from './urlEncoder.js';
import {myLocation, isMyLocationHideMode} from './locating.js';
import {notNullNotUndefined, NullOrUndefined} from './differentOfNullAndUndefined.js';

export function navInfo() {
	
	var isNavbar = false;
	var isInfo = false;
	var userInfoObj = {};
	var theNavbar = $('nav.myNavBar');

	var userInfo = sessionStorage.getItem('currentUserInfo');
	var visibleUserId = sessionStorage.getItem('currentUserId');
	
	var usrGarage = sessionStorage.getItem('currentUserGarage');




	//display the logged alias and picture
	//show/hide the photo and alias if the loggedUser is in its profile or not
		//compare the visible user with the loggedUser
		//if theres no info find it to compare


	if(NullOrUndefined(userInfo)){

		if(notNullNotUndefined(visibleUserId)){

		  	getUserInfo(visibleUserId, 'id');


		}else if(hashesExist){

			if(queriesT.al.length > 0){
				
				getUserInfo(queriesT.al, 'al');

			}
		}

	}else if(notNullNotUndefined(userInfo)){

		var usrInf = JSON.parse(userInfo);

		//debería comparar con el usuario que tiene que estar logueado.
		userInfoObj = usrInf[0];
		isInfo = true;

	}


	var askNavInterval = setInterval(function(){
		if($('div.navbarIn').length){
			if(isInfo){stopInterval();}
		}
	}, 5);


	function stopInterval() {
		isNavbar = true;
		displayInfo();
		clearInterval(askNavInterval);
	}


	function getUserInfo(id, type) {

	    var data = (type === 'id') ? {idUsr: id} : {alias: id};
	    data = JSON.stringify(data);

	    $.post('http://fuxkar.com/ws/v2/usuario/info',
	        data
	      ).then(function(res){

	        if(res.estado === 1){

	          userInfoObj = res.mensaje.rs[0];
	          //console.log(res.mensaje.rs, 'was not in storage');

	          isInfo = true;
	          
	        }

	       }).fail(function(err){
	          console.log(err);
	    });

	}


	function displayInfo(){
		//sólo se debe mostrar alias y foto de usuario logueado, cuando no esté en su propio perfil
		var photo = localStorage.getItem('aUPP');
		var logUsr = localStorage.getItem('aUsr');
		var logUserAlias = localStorage.getItem('aUsrA');
		//console.log('from navbar function', photo);


		if(isNavbar && isInfo){

			var image = (notNullNotUndefined(photo)) ? `data:image/png;base64,${photo}` : '../img/profileDafault.png';
			var alias = (notNullNotUndefined(logUserAlias)) ? logUserAlias : userInfoObj.alias;

			let spanAlias = $('span.aliasNavSpan');
			let anchorProfile = spanAlias.closest('a');

			if(anchorProfile.attr('href').length > 0 && anchorProfile.attr('href').indexOf('?') < 0){
				let textToAdd = '?al=' + alias;
				anchorProfile.attr('href', anchorProfile.attr('href') + textToAdd); 
			}else{
				(anchorProfile.attr('data-dev').indexOf('?') < 0) ? null : anchorProfile.attr('data-dev', anchorProfile.attr('data-dev') + '?al=' + alias);
				(anchorProfile.attr('data-prod').indexOf('?') < 0) ? null : anchorProfile.attr('data-prod', anchorProfile.attr('data-dev') + '?al=' + alias);
			}

			spanAlias.text(alias);

			$('div.minProfileImg').css({
				'background-image': `url(${image})`
			});

		}

		if(notNullNotUndefined(logUsr)){

			var links = $('div.loggedNavbar').find('a');

			links.each(function(indx, el){

				if(!$(el).hasClass('noChangeHref')){
					var dataD = $(el).data('dev');
					var dataP = $(el).data('prod');


					dataD += `?al=${alias}`;
					dataP += `?al=${alias}`;
					
					$(el).data('dev', dataD);
					$(el).data('prod', dataP);

					sessionStorage.setItem('hrefNav', 'setted');				
				}
				
			});

			logUsr = parseInt(logUsr);
			var visibleUser = (notNullNotUndefined(visibleUserId)) ? parseInt(visibleUserId) : parseInt(userInfoObj.id);

			//console.log('aquí en navbar', logUsr, visibleUser);

			if(logUsr === visibleUser){
				if(isMyLocationHideMode("/web/perfil/")){

					theNavbar.addClass('noPhoto')
				}
			}else{ theNavbar.removeClass('noPhoto');}
		}

	}


}