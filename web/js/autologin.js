$(function(){


	var queries = getQueries();
	var isToken = false;
	var token = '';
	var loader = $('div.autologinLoader');
	var modal =  $('div#myModal');

	$(document).ready(function(){

		start();

	});

	$(window).resize(function(){
		startLoader();
	});

	function startLoader(){
		var winW = $(window).width();
		var loaderSize = winW * 0.5;
		var loaderLeft = winW * 0.25;

		var data = loader.data('on');

		// console.log('hello, just me', winW, loaderSize, loaderLeft, data);
		if(data == 'true'){
			loader.css({
				width: loaderSize + 'px',
				height: loaderSize + 'px',
				left: loaderLeft + 'px',
				visibility: 'visible'
			});
		}
	}


	function start(){

		if(queries.token !== undefined && queries.token !== null){
			loader.data('on', 'true');
			startLoader();
			isToken = true;
			token = queries.token;
			autoLog(token);
		}
		else{
			modal.modal();
			isToken = false;
			console.log('no token');
		}
	}


	function autoLog(theToken){
		var url = 'http://fuxkar.com/ws/v2/usuario/autologin';
		var data = JSON.stringify({token: theToken});

		$.post(url, data).then(function(res){
			if(res.estado === 1){

				var user = res.mensaje[0][0];
				var alias = user.alias;
				var id = user.id;

				localStorage.setItem('aUsrA', alias);
				localStorage.setItem('activeSession', 'yes');
				localStorage.setItem('aUsr', id.toString());
				

				ssRmForSet('currentUserId', id);
				ssRmForSet('currentUserAlias', alias);
				ssRmForSet('currentUserInfo', JSON.stringify(user));


				window.location = window.location.pathname + 'perfil?al=' + alias;


			}else{
				console.log(res);
				modal.modal();
			}
		}).fail(function(){
			modal.modal();
			loader.css({
				visibility: 'hidden'
			});
		});
	}



});


function ssRmForSet(item, data) {
	sessionStorage.removeItem(item);
	sessionStorage.setItem(item, data);
}


function getQueries() {
	var vars = [], hash, queriesObj = {};
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++)
	{
	    hash = hashes[i].split('=');

	    queriesObj[hash[0]] = hash[1];
	}
	
	return queriesObj;

}


function getQueriesString() {
	var totalUrl = window.location.href;
	var indexOfQueryStart = totalUrl.indexOf('?');

	if(indexOfQueryStart !== -1){
		queryString = totalUrl.slice(indexOfQueryStart);
	}

	return queryString;

}