var myLocHref = window.location.href;
var queriesIdx = myLocHref.indexOf('?');
var queries = (queriesIdx !== -1) ? myLocHref.slice(queriesIdx) : '';
var queriesObj = {};
var queryString = '';

export var hashesExist = (queries.length > 3) ? true : false;


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

export var queriesT = getQueries();

function getQueriesString() {
	var totalUrl = window.location.href;
	var indexOfQueryStart = totalUrl.indexOf('?');

	if(indexOfQueryStart !== -1){
		queryString = totalUrl.slice(indexOfQueryStart);
	}

	return queryString;

}

export var queryText = getQueriesString();


export function setQueriesWithObj(obj) {
	var hashes = [];
	var queriesString = '';

	$.map(obj, function(val, key){
		hashes.push(`${key}=${val}`);
	});


	$.each(hashes, function(idx, string){

		if(idx === 0){
			string = '?' + string;
		}else{
			string = '&' + string;
		}

		queriesString += string;

	});
	

	//return queriesString;
	console.log(queriesString);
	
}