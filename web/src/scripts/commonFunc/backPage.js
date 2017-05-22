import {navigating, myLocation, myLocHref} from './locating.js';
import {getQueriesString} from './urlEncoder.js';
import {con} from './consoling.js';

var queriesIdx = myLocHref.indexOf('?');

var queries = (queriesIdx !== -1) ? myLocHref.slice(queriesIdx) : '';

var hashes = (queries.length > 3) ? true : false;

var queriesWOutLIdx = (hashes) ? queries.lastIndexOf('&') : -1;

var lastQuery = (queriesWOutLIdx !== -1) ? queries.slice(queriesWOutLIdx + 1, queries.lastIndexOf('=')) : queries.slice(0, queries.lastIndexOf('='));
var notTouchQueries = ['?ss', 'usrId', 'al'];

var stopCutting = false;

notTouchQueries.forEach(function(itm, idex){

	if(lastQuery === itm){

		stopCutting = true;
	}

});



var queriesWithOutLast = (queriesWOutLIdx !== -1 && !stopCutting) ? queries.slice(0, queriesWOutLIdx) : queries;



export function backing(currPage) {
	var treePages = [{
		name: ['/web/', '/web/index', '/web/index.html'],
		parent: null,
		destiny: 'home'
	},
	{
		name: ['/web/registro/', '/web/registro/index.html', '/web/registro/index'],
		parent: null,
		destiny: 'registro'
	},
	{
		name: ['/web/paseo/', '/web/paseo/index.html', '/web/paseo/index'],
		parent: 'home',
		destiny: 'paseo'
	},
	{
		name: ['/web/catalogo/', '/web/catalogo/index.html', '/web/catalogo/index'],
		parent: ['home', 'perfil'],
		destiny: ''
	},
	{
		name: ['/web/perfil/index.html', '/web/perfil/index','/web/perfil/'],
		parent: 'home',
		destiny: 'home'
	},
	{
		name: ['/web/perfil/configuracion.html', '/web/perfil/configuracion'],
		parent: 'perfil',
		destiny: 'perfil'
	},
	{
		name: ['/web/perfil/detalles.html', '/web/perfil/detalles'],
		parent: 'perfil',
		destiny: 'perfil'
	},
	{
		name: ['/web/catalogo/brand-modelo.html', '/web/catalogo/brand-modelo'],
		parent: 'catalogo',
		destiny: 'catalogo'
	},
	{
		name: ['/web/catalogo/modelo-versiones.html', '/web/catalogo/modelo-versiones'],
		parent: 'catalogo/brand-modelo',
		destiny: 'catalogo/brand-modelo'
	},
	{
		name: ['/web/catalogo/specific-version.html', '/web/catalogo/specific-version'],
		parent: 'catalogo/modelo-versiones',
		destiny: 'catalogo/modelo-versiones'
	}];


	var done = false;
	
	var lastPageArr = $.grep(treePages, function(item, index){

		if(!done){

			item.name.forEach(function(itm, i){
				if(currPage === itm){
					done = true;
				}
			});

			if(done){ return item;}
		}

	});

	let lastPage = lastPageArr[0];
	
	if($.isArray(lastPage.parent)){
		
		//check the page from which the user come from
		//askLastPage(lastPage);
		backIt(lastPage.parent);

	}else{

		(lastPage.parent === 'home') ? navigating('home') : navigating(lastPage.parent + queriesWithOutLast);

	}
}

function askLastPage(oldPage) {
	var lastPageUrl = document.referred;

	if(lastPageUrl !== undefined && lastPageUrl.length > 3){

		//check if the user come from the webapp or from the web
		//first getting its host

		var lastPageHostIdx = lastPageUrl.indexOf('/', 8);
		var lastPageOrigin = lastPageUrl.slice(0, lastPageHostIdx);
		var wasInApp = cameFromInside(lastPageOrigin);

		alert(wasInApp);
		//if it came from inside the app we return him to the last page using window history
		if(wasInApp){
			//if it was in the app already
			window.history.back();

		//else, we give priority returning the user to 
		}else{


			backIt(oldPage.parent);
			
		}

	}else{

		backIt(oldPage.parent);

	}
}

function backIt(pos) {
	$.map(pos, function(item, idex){
		if(item !== 'home' && item !== 'registro'){

			navigating(pos[idex] + queriesWithOutLast);

		}
	});
}


function cameFromInside(lastOrigin){
	var actualOrigin = window.location.origin;
	return (lastOrigin == actualOrigin) ?  true :  false;
}