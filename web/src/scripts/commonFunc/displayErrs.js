
var userE = $('#l-email'),
	userPass = $('#l-pass'),
	errMsg = $('div.errorLogin');

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



export function displayErr(where){

	if(where === 'login'){
		
		errMsg.disBlock();
		userE.val("");
		userPass.val("");
	}

}