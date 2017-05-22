import {con} from './commonFunc/consoling.js';
import {notNullNotUndefined, NullOrUndefined} from './commonFunc/differentOfNullAndUndefined.js';

$(function(){
	var refInput = $('input#referido'),
	posFrList = $('ul.posibleFriendsList'),
	friendsList = posFrList.children('li'),
	togglingFrList = 0, 
	friends,
	noFriendMsg = $('div.errorFriendNick');

	function killLabel(){
		refInput.next('label#referido-error').css({display: 'none'});
	}

	$(document).ready(function(){
		listWidth();
	});

	$(window).resize(function(){
		listWidth();
	});

	// support list width according to device width
	function listWidth(){
		var referedWidth = refInput.outerWidth();

		posFrList.css({ height: 0, border: 0, width: referedWidth});
		friendsList.outerWidth(referedWidth);
	}

	refInput.on('keyup', function(e){

		var whoInvite = $(this).val();

		if(e.which === 8){
			setTimeout(killLabel, 5);
			cleanFriendList();
		}

		if(whoInvite.length > 0){
			invitationSender(whoInvite);
		}

	});

	refInput.focus(function() {

		var txt = $(this).val();

		if(txt.length > 0){
			invitationSender(txt);
		}else{
			cleanFriendList();
		}

		setTimeout(killLabel, 5);

		noFriendMsg.css({display: 'none'});

	    var itms = posFrList.children('li').length;
	  
	  	// achtung
	  	// ///////
	  	// ///////
	  	// ///////
	  	// console.log('readonlyFocus', refInput.attr('readonly'), NullOrUndefined(refInput.attr('readonly')));
	  	if(NullOrUndefined(refInput.attr('readonly'))){
			posFrList.animate({
				height: itms *  25
			}, 20);
		}

	    //recordFriends();

	}).blur(function() {
		setTimeout(killLabel, 5);

		setTimeout(function(){
			posFrList.animate({
				height: 0
			}, 20);
		}, 190);

	});


	$(document).on('click', 'li.posibleFriend', function(){
		var id = $(this).children('span.friendId').html();
		var nick = $(this).children('span.psFrAlias').html();
		
		// console.log(NullOrUndefined(refInput.attr('readonly')), 'attaching value');
		if(notNullNotUndefined(nick) && NullOrUndefined(refInput.attr('readonly'))){
			refInput.val(nick);
		}
	});


	function invitationSender(val){
		cleanFriendList();
		
		if(val.length > 0){

			val = val.replace(/ /g, "");

			var data = JSON.stringify({'abuscar': val});

			$.post('http://fuxkar.com/ws/v2/usuario/buscarqtinv', 
				data
			).then(function(res){
				//con(res);
				displayCandidates(res);  

			}).fail(function(err){
				//con(err);
		  		displayCandidates('noOne');

			});	
		}

	}

	function cleanFriendList() {
		var listItm = '<li class="posibleFriend noFriends regInputs"><span class="psFrName"></span><span class="psFrAlias">Nadie con ese nombre </span> </li>';


		$('li.posibleFriend').each(function(idx, el){
			if(idx > 0){
				el.remove();
			}
		});

		if(refInput.val().length > 0){
			posFrList.append(listItm);
		}
		
		var itms = posFrList.children('li').length;

		// change height of friend's list
		// console.log('readonlyClean', refInput.attr('readonly'), NullOrUndefined(refInput.attr('readonly')));
		if(NullOrUndefined(refInput.attr('readonly'))){
			posFrList.animate({
				height: itms *  25
			}, 20);
		}

	}

	function displayCandidates(argument) {
		var candidates = [];
		var itms = posFrList.children('li');
		var displayedAlready = [];

		$.map(itms, function(value, key){
			var id = $(value).find('span.friendId').html();
			displayedAlready.push(id);
		});

		if(argument !== 'noOne'){
			
			candidates = argument.mensaje.rs;
			candidates.forEach(function(itm, idx){
				var listItm = `<li class="posibleFriend regInputs">
									<span class="psFrName">${itm.full_name}</span>
									<span class="friendId">${itm.id}</span>
									<span class="psFrAlias">${itm.alias}</span>
								</li>`;
				
				if($('li.noFriends').length){
					$('li.noFriends').remove();
				}

				/*console.log("displayedAlready when necessary", displayedAlready);*/

				if(itm.id.length > 0){
					// chech if its already in list, as a string or as a number
					var idNum = parseInt(itm.id);
					var idStr = itm.id.toString();
					var mayBeNum = displayedAlready.indexOf(idNum);
					var mayBeStr = displayedAlready.indexOf(idStr);
					/*console.log("item id from server", itm.id, "like num", idNum, "like str", idStr);
					console.log("exist like num", mayBeNum, "exist like str", mayBeStr);*/

					if(mayBeStr === -1 && mayBeNum === -1){
						posFrList.append(listItm);
					}

				}

			});

		}

		var itms = posFrList.children('li').length;

		// achtung
	  	// ///////
	  	// ///////
	  	// ///////
	  	// console.log('readonlyDisplay', refInput.attr('readonly'), NullOrUndefined(refInput.attr('readonly')));
		if(NullOrUndefined(refInput.attr('readonly'))){
			posFrList.animate({
				height: itms *  25
			}, 20);
		}

	}

});