import {con} from './consoling.js';
import {notNullNotUndefined} from './differentOfNullAndUndefined.js';
import {queriesT, hashesExist} from './urlEncoder.js';
import {sendPostToGo, sendPostToGet} from './httpProcesor.js';

// this file only make a record for each user is visited, only one, even if the same user is visited several times

// functions requirements:
// record visited profiles (meaning those that no correspond with the user is logged, if any)
	// first, we have to check if there's any user logged, to contrast with ::: done
	// if not, record all of them ::: done
	// if the users logged after some users visited, his record must be remove :::missing

// offer a source of ids related with aliases ::: done


let isFirstRecordMigrationDone = (notNullNotUndefined(localStorage.getItem('FMR'))) ? localStorage.getItem('FMR') : 'false';
let profilesToRecordForAPI = (notNullNotUndefined(localStorage.getItem('visitedOnAPI'))) ? JSON.parse(localStorage.getItem('visitedOnAPI')) : [];


// get all visited users or start the array of them

let visitedUsrs = (notNullNotUndefined(localStorage.getItem('visitedUsrs'))) 
				? 
				JSON.parse(localStorage.getItem('visitedUsrs')) 
				: 
				[];

// tells you if the logged user is actually the actual user
// console.log(sessionStorage.getItem('currentUserId'), localStorage.getItem('aUsr'), 'recording');
let loggedEqualActual = ((queriesT.al == localStorage.getItem('aUsr') || sessionStorage.getItem('currentUserId') == localStorage.getItem('aUsr')) && localStorage.getItem('aUsr') !== undefined) ? true : false;


export function allVisitedProfiles(alOrId){

	var data = JSON.stringify({user: alOrId, device: localStorage.getItem('deviceId')});

	return $.post('http://fuxkar.com/ws/v2/usuario/garagefriends',
		data
	).then(res => {
		console.log(res);
		return (res.estado === 1) ? res.mensaje.rs :  'No body';
	});
}


export function recordNewVisitedProfile(id, al, or){
	console.log('recordVisitInReal... from', or);
	let theId = ($.isNumeric(id)) ? id : parseInt(id);
	var indexOfUser = (theId) ? returnRepitedVisitedIndex(theId) : returnRepitedVisitedIndex(null);
	// console.log('trying to record');
	

	// there are profiles already recorded in local
	if(visitedUsrs.length > 0){
		// console.log('alreadySomeone visited', visitedUsrs);

		// this is only usefull to add new profiles that hasn't been already visit

		if(indexOfUser < 0){
			// record in local if its not repeated
			(theId && al) ? pushNewProfileInLocal(theId, al) : pushNewProfileInLocal(null, null);
			
			// record in api if its new
			if(notNullNotUndefined(localStorage.getItem('aUsrA'))){
				(theId && al) ? startProcessToRecordInAPI(theId, al) : startProcessToRecordInAPI(null, null);
			}


		// if its not the first time this profile is visited (the id is repeated)
		// check if its necesary to remove the record, maybe if the visited profile is from the logged person
		// but also its a way to register the already visited profiles after deleting the logged profile
		}else if(notNullNotUndefined(localStorage.getItem('aUsrA'))){
			startProcessToRecordInAPI(null, null);
		}

	// meaning its gonna start the process, and there are not profiles visited yet
	}else{
		// console.log('no body visited yet');
		if(notNullNotUndefined(localStorage.getItem('aUsrA')) && theId && al){
			startProcessToRecordInAPI(theId, al);
		}

		(theId && al) ? pushNewProfileInLocal(theId, al) : pushNewProfileInLocal(null, null);
	}

}


export function returnAlreadyVisitedProfileId(){
	let actualID = -1;
	if(hashesExist){
		if(queriesT.al.length > 0){

			visitedUsrs.forEach(function(objItm, objIdx){
		  		if(queriesT.al == objItm.al) {
		  			let theId = ($.isNumeric(objItm.id)) ? objItm.id : parseInt(objItm.id);
		  			actualID = theId;
		  		}
		  	});
		
		}
	
	}

	return actualID;

}


export function returnIdOfAlias(alias){
	let actualID = -1;


	visitedUsrs.forEach(function(objItm, objIdx){
  		if(alias == objItm.al) {
  			let theId = ($.isNumeric(objItm.id)) ? objItm.id : parseInt(objItm.id);
  			actualID = theId;
  		}
  	});

	return actualID;

}

export function returnLastVisitedProfile(){
	let lastVisitedUserToReturn = {};

	if(visitedUsrs.length > 0){

		// there's a logged user
		if(notNullNotUndefined(localStorage.getItem('aUsr'))){
			if(differentNumbers(localStorage.getItem('aUsr'), visitedUsrs[visitedUsrs.length - 1]['id'])){
				lastVisitedUserToReturn = visitedUsrs[visitedUsrs.length - 1];
			}else if(visitedUsrs.length > 1){
				lastVisitedUserToReturn = visitedUsrs[visitedUsrs.length - 2];
			}
		
		// there's not a logged user
		}else{
			lastVisitedUserToReturn = visitedUsrs[visitedUsrs.length - 1];
		}
	}

	return lastVisitedUserToReturn;
}


// at the point
function startProcessToRecordInAPI(id, al){
	// this function must be used to check if the active user is recorded it and remove that record
	// to register in the API the already recorded profiles (without the active user profile)
	// to check if you are not repeating an already recorded visit, in future situations.

	// each time you have are in a new profile
	// check if its not the active user profile
	// check if the profile is not already recorded in the inScrito array
	// if not, record it: first in the api, if it was correctly added declare it like recorded in api and
	// then add it to the inScrito array


	// this function is access if 
	// you are visiting a new profile as an active user
	// or you are visinting an already visited profile but as an active user
		// at the moment this function runs, the actual profile is already recorded in localStorage
		// the parameters are for new sites

	// the active user profile is removed from the visitedUsrs array
	let usersToCheck = deletingActiveUserFromVisitedUsrs();

	// if its the first migration
	if(isFirstRecordMigrationDone != 'true'){
		// console.log('trying first record when loging');

		// if there are already visited profiles
		// at least the first one would be record here-if it was not deleted for been the active users profile
		if(usersToCheck.length > 0){
			// console.log(usersToCheck, 'almost on api');
			usersToCheck.forEach((itm, idx) => {
				let visitedForApi = itm;
				visitedForApi.usrState = 'pending';
				recordInAPIVisitedProfile(visitedForApi, 'firstMigration');
			});
			localStorage.setItem('FMR', 'true');
		
		// if there are not visited profiles
		}else{
			localStorage.setItem('FMR', 'true');
		}
	
	// if is not the first migration
	}else{

		// that means this visit is made after the user was logged and it is not the active user profile
		// and its not already recorded in api as niether as in local, cause when they are new records the id is sended as parameter
		if(id !== null && al !== null && differentNumbers(id, localStorage.getItem('aUsr'))){

			// lets check if there are already visited profiles, if not, that would mean the first visit to a profile
			// was made when someone sing in
			if(profilesToRecordForAPI.length > 0){
				let diferentFromAll = 0;
				let objectToSend = {};

				profilesToRecordForAPI.forEach((itm, idx) => {
					if(differentNumbers(id, itm.id)){
						objectToSend = {al: al, id: id, usrState: 'pending'};
						diferentFromAll++;
					}
				});

				(diferentFromAll >= profilesToRecordForAPI.length) ? (recordInAPIVisitedProfile(objectToSend, 'record after logged with profiles already')) : null;
			
			// if there are not recorded profiles
			}else{
				let objectToSend = {al: al, id: id, usrState: 'pending'};
				// console.log('trying record after logged')
				recordInAPIVisitedProfile(objectToSend, 'after log and without profiles');
			}

		// that would mean this are old profiles that are not already recorded
		}else{
			if(profilesToRecordForAPI.length > 0){
				// console.log('retrying to insert old profiles', usersToCheck);
				usersToCheck.forEach((itm, idx) => {
					let differenceNumber = 0;
					$.map(profilesToRecordForAPI, (el, idx) => {

						// the ids already saved are gonna be compare with the old ones to see see if it doesn't match with any
						// it it doesn't match the difference number is gonna be equal to the number of saved numbers, equal to the 
						// length of saved numbers array
						if(differentNumbers(itm.id, el.id)){
							differenceNumber++;
						}
						// if its completly different to every number in the already saved ids, its gonna be save
						if(differenceNumber >= profilesToRecordForAPI.length){
							let visitedForApi = itm;
							// console.log('this is an old value that wasnt recorded yet', visitedForApi);
							visitedForApi.usrState = 'pending';
							recordInAPIVisitedProfile(visitedForApi, 'retrying records');
						}
					});
				});
			
			// if there are not visited profiles
			}
		}


	}

}

function differentNumbers(nm1, nm2){
	return (nm1 != nm2 || nm1 != parseInt(nm2) || parseInt(nm1) != nm2 || parseInt(nm1) != parseInt(nm2)) ? true : false;
}

function deletingActiveUserFromVisitedUsrs(){

	let idCheck = ($.isNumeric(localStorage.getItem('aUsr'))) ? localStorage.getItem('aUsr') : parseInt(localStorage.getItem('aUsr'));
	
	// console.log('deleting record2', idCheck, 'numbers for delete');

	let repitedIdIndex = returnRepitedVisitedIndex(idCheck);

	// visitedUsrs array without the active user
	if($.isNumeric(repitedIdIndex) && repitedIdIndex > -1){ 
		visitedUsrs.splice(repitedIdIndex, 1);

		recordInLocal();
	}

	// console.log('usersWithoutLogged', usersWithoutLogged, visitedUsrs);
	return visitedUsrs;;
}


// just working with no visited profiles
function pushNewProfileInLocal(id, al){
	// console.log(queriesT.al, 'url', localStorage.getItem('aUsrA'), 'local', sessionStorage.getItem('currentUserAlias'), 'session', "newTests-workOk");
	var alternativeIdToSend = ($.isNumeric(sessionStorage.getItem('currentUserId'))) ? sessionStorage.getItem('currentUserId') : parseInt(sessionStorage.getItem('currentUserId'));
	
	// recording with an active user
	if(notNullNotUndefined(localStorage.getItem('aUsrA'))){
		// you want to check wether the active user is recorded and remove that record
		// if its not the active user profile, somebody else's not yet visited profile
		// record it
		// after that, or if the active user was not recorded, is necesary to record in API those visited profiles with the new one (if it wasn't the active user profile)

		deletingActiveUserFromVisitedUsrs();

		// if you are not in the active user profile, record the present profile
		if(queriesT.al !== localStorage.getItem('aUsrA')){
			(id && al) ? visitedUsrs.push({al: al, id: id, usrState: 'active'}) : visitedUsrs.push({al: sessionStorage.getItem('currentUserAlias'), id: alternativeIdToSend, usrState: 'active'});
		}

	
	}else{
	// recording with a passive user
		(id && al) ? visitedUsrs.push({al: al, id: id, usrState: 'pasive'}) : visitedUsrs.push({al: sessionStorage.getItem('currentUserAlias'), id: alternativeIdToSend, usrState: 'pasive'});
	}

	recordInLocal();
}

function returnRepitedVisitedIndex(id){
	var indexOfUser = -1;

	// check if there have been a lot of visited profiles
	if(visitedUsrs.length > 0){

		visitedUsrs.forEach(function(itm, idx){
			
			var someId = parseInt(itm.id);
			let idToCheck = (id) ? id : currentUserId;
			if(someId == idToCheck){
				indexOfUser = idx;
			}

		});

	}

	return indexOfUser;
}

function recordInLocal(){
	let visitedUsrsString = JSON.stringify(visitedUsrs);
	// console.log(visitedUsrsString, 'recording');
	localStorage.setItem('visitedUsrs', visitedUsrsString);
}

var calls = 0;
function recordInAPIVisitedProfile(futureRecord, origin){
	if(notNullNotUndefined(localStorage.getItem('aUsr'))){
		calls++;

		let dataToSend = {
			user: parseInt(localStorage.getItem('aUsr')), 
			visito: futureRecord.id,
			device: localStorage.getItem('deviceId')
		};

		let dataString = JSON.stringify(dataToSend);
		// console.log('times call', calls, origin, dataString);

		$.post('http://fuxkar.com/ws/v2/usuario/clicvisita',
				dataString
			).then((res) => {
				console.log(res);
				if(res.estado === 1){
					futureRecord.usrState = 'recorded';
					profilesToRecordForAPI.push(futureRecord);
					localStorage.setItem('visitedOnAPI', JSON.stringify(profilesToRecordForAPI));
				}
			});
	}
}

