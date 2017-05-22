import {sendPostToGo, sendPostToGet} from './httpProcesor.js';
import {notNullNotUndefined, NullOrUndefined} from './differentOfNullAndUndefined.js';

export function getVersions(modelId, modelName, modelPrice, or) {
	 localStorage.setItem('modelId', modelId.toString());
	 localStorage.setItem('modelName', modelName.toString());
	 localStorage.setItem('modelPrice', modelPrice.toString());
	 var device = localStorage.getItem('deviceId');
	 var userId = localStorage.getItem('aUsr');
	 var data = {};

          if(notNullNotUndefined(device) && modelId){
          		if(notNullNotUndefined(userId)){
          			data = {'device': device, modelId: modelId, user: userId};
          		}else{
          			data = {'device': device, modelId: modelId};
          		}
            		
            data = JSON.stringify(data);

            (or === 'prof') ? sendPostToGet('catalogo/getversiones', data, 'spVrsInfo') : (sendPostToGo('catalogo/getversiones', data, 'versiones'), sendPostToGet('catalogo/getgaleria', data, 'vrsGal'));

          }
}