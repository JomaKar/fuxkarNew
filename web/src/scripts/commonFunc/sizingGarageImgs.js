export function sizingModelItms() {
			
	var carContainer = $('div.modelItem');
	
	if(carContainer.length){
		alleGleichlich(carContainer);
	}
	
}


export function alleGleichlich(el) {
	var img = $(el).find('img').first();
	var images = $(el).find('img');
	var width = img.width();
	var height = width * 0.6309;

	images.css({height: height});
}