$(function(){

	var goOn = true,
	modal = $('div.passModalCont'),
	modalBox = $('div.recoverPassModal'),
	outModalShadow = false;
	
	modalBox.mouseleave(function(){
		inShadow();
		setTimeout(function(){
			goOn = true;
		}, 3);
	});

	modalBox.mousemove(function(){
		outShadow();
	});

	modalBox.mouseenter(function(){
		outShadow();
	});
	

	modal.mouseleave(function(){
		outShadow();
		goOn = true;
	});

	modal.mouseenter(function(){
		if(goOn){
			inShadow();
			goOn = false;		
		}
	});

	function outShadow() {
		outModalShadow = true;
	}

	function inShadow() {
		outModalShadow = false;
	}

	modal.click(function(){
		setTimeout(function(){
			if(!outModalShadow){
				modal.hide();
			}
		}, 210);
	})

});