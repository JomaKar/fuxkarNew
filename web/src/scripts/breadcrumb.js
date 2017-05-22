import {queriesT, hashesExist} from './commonFunc/urlEncoder.js';

$(function(){

	var breadcrum = $('div.breadCrum');

	if(breadcrum.length){
		var links = breadcrum.find('a');

		//console.log(links, breadcrum);

		links.each(function(indx, el){

			if(!$(el).hasClass('noChangeHref')){

				var dataD = $(el).data('dev');
				var dataP = $(el).data('prod');

				if($(el).hasClass('brdId')){

					dataD += (queriesT.al) ? `?al=${queriesT.al}&brdId=${queriesT.brdId}` : `?brdId=${queriesT.brdId}`;
					dataP += (queriesT.al) ? `?al=${queriesT.al}&brdId=${queriesT.brdId}` : `?brdId=${queriesT.brdId}`;
				
				}

				if($(el).hasClass('mdlId')){

					dataD += (queriesT.al) ? `?al=${queriesT.al}&brdId=${queriesT.brdId}&mdlId=${queriesT.mdlId}` : `?brdId=${queriesT.brdId}&mdlId=${queriesT.mdlId}`;
					dataP += (queriesT.al) ? `?al=${queriesT.al}&brdId=${queriesT.brdId}&mdlId=${queriesT.mdlId}` : `?brdId=${queriesT.brdId}&mdlId=${queriesT.mdlId}`;

				}

				$(el).data('dev', dataD);
				$(el).data('prod', dataP);

				sessionStorage.setItem('hrefBreadCrumb', 'setted');
			}
			
		});


	}

});