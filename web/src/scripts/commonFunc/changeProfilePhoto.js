import {sendPostToGo, sendPostToGet} from './httpProcesor.js';

export function changeProfilePhoto(photo, id){
	var data = {device: localStorage.getItem('deviceId'), user: id, campo: 'foto_perfil', dato: photo};
	//console.log('processing to send', data);
	data = JSON.stringify(data);

	sendPostToGet('usuario/actualizadato', data, 'usrAct');
}