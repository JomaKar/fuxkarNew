import {notNullNotUndefined, NullOrUndefined} from '../scripts/commonFunc/differentOfNullAndUndefined.js';

function getVersionsPhotos(modelId){

    var device = localStorage.getItem('deviceId');
    var data = {};

    if(notNullNotUndefined(device) && modelId){
      data = {'device': device, modelId: modelId};
    }
            
    data = JSON.stringify(data);

    $.post('http://fuxkar.com/ws/v2/catalogo/getgaleria',
      data).then(function(res){
        if(res.estado === 1){
          var versionsPicts = res.mensaje.rs;
          versionsPicts = JSON.stringify(versionsPicts);
          sessionStorage.setItem('versionsPhotos', versionsPicts);
        }
      }).fail(function(err){
        console.log(err);
      });
}