import { myLocation, isMyLocationHideMode, isMyLocationExpMode} from './commonFunc/locating.js';
import {notNullNotUndefined, NullOrUndefined} from './commonFunc/differentOfNullAndUndefined.js';

$(function(){

    const metaUrl = $('meta.metaUrl'),
    sharePage = $('span.sharePage'),
    sharePageSVG = $('svg.sharePage'),
    modalShare = $('div#modal-share'),
    copyClipboard = $('a#copy-to-clipboard'),
    profilePict = $('div#profilePict'),
    versionsCarousel = $('div.versionsCarousel'),
    shareButtonFB = $('a.shareButtonFB'),
    metaTitle = $('meta.metaTitle'),
    metaDescrip = $('meta.metaDescrip'),
    metaImg = $('meta.metaImg'),
    successClip = $('div.modalClipboard');

    var hrefUrl = '';
    var linkTitle = '';
    var linkDescrip = 'En Vrumm podrás encontrar los mejores autos del mercado en México';
    var linkImg = '';
    var imageToSend = '';

    var sharePageDo = false;
    var shareLinkDo = false;

    sharePageSVG.click(openShare);

    sharePage.click(openShare);

    if($('div#modal-share').length && localStorage.getItem('activeSession') === 'yes'){
        $('p.onlyOnLogged').removeClass('hiddenItm');
        $('form.onlyOnLogged').removeClass('hiddenItm');
        $('div.onlyOnLogged').removeClass('hiddenItm');
    }


    $(document).on('click', 'button.firstMenu', function(){
        
        if(!isMyLocationHideMode("/web/catalogo/") && !isMyLocationExpMode("/web/catalogo/brand-modelo") && !isMyLocationExpMode("/web/perfil/configuracion")){
            $('ul.navMenuList').find('li.shareVrummLi').removeClass('hiddenItm');
        }

    });


    $(document).on('click', 'button#secondMenu', function(){
        if(!isMyLocationHideMode("/web/catalogo/") && !isMyLocationExpMode("/web/catalogo/brand-modelo") && !isMyLocationExpMode("/web/perfil/configuracion")){
            $('ul.navSMenuList').find('li.shareVrummLi').removeClass('hiddenItm');
        }
    });

    $(document).on('click', 'a.shareVrumm', function(){
        openShare();
    });

    $(document).on('click', 'button.shareVrumm', function(){
        openShare();
    });

    function openShare(){
        modalShare.modal();

        if(!isMyLocationHideMode("/web/catalogo/") && !isMyLocationExpMode("/web/catalogo/brand-modelo") && !isMyLocationExpMode("/web/perfil/configuracion")){

            var cssImg = (profilePict.length) ? profilePict.css('background-image') : versionsCarousel.css('background-image');


            var idxFQuote = cssImg.indexOf('"') + 1;
            var idxLQuote = cssImg.lastIndexOf('"');

            //defining the actual image visible in carousel or in profile

            imageToSend = cssImg.substring(idxFQuote, idxLQuote);
        
        }else{

                if(notNullNotUndefined(sessionStorage.getItem('currentBrandImg'))){
                    imageToSend = sessionStorage.getItem('currentBrandImg');
                }else{
                    if(notNullNotUndefined(sessionStorage.getItem('catalogBrands'))){

                            var brandsStored = JSON.parse(sessionStorage.getItem('catalogBrands'));

                            var lgth = brandsStored.length - 1;

                            var randomNum = Math.floor(Math.random() * lgth) + 1;

                            imageToSend = brandsStored[randomNum].pic_url;
                    }else{
                        imageToSend = '../img/favicon.png';
                    }
                }

        }



        //console.log(profilePict, image);

        sharePageDo = true;
    }

    $(document).on('click', 'svg.shareLink', function(){
        //alert('click')
        var el = $(this);
        var container = el.closest('div.garageImgCont');
        var modelName = container.find('span.garageModelName').text();
        
        linkDescrip += `, como el ${modelName}`;
        hrefUrl = container.find('a').attr('href');

        linkTitle = `Checa el ${modelName} en Vrumm`;
        linkImg = container.find('img.garageImg').attr('src');
        //console.log('llinkShare', linkImg, hrefUrl, linkTitle, linkDescrip);
        shareLinkDo = true;
        modalShare.modal();
    });

    shareButtonFB.click(function(){

        if(sharePageDo){
            
            fbShare(window.location.href, metaTitle.attr('content'), metaDescrip.attr('content'), imageToSend, 550, 500);
            sharePageDo = false;
        
        }else if(shareLinkDo){
            
            fbShare(hrefUrl, linkTitle, linkDescrip, linkImg, 550, 500);
            shareLinkDo = false;
        }
    });

    metaUrl.attr('content', window.location.href);

    copyClipboard.click(function(){
        (sharePageDo) ? copyToClipboard(window.location.href) : copyToClipboard(hrefUrl);
    });

    function fbShare(url, title, descr, image, winWidth, winHeight) {
        console.log('fbShare', url, title, descr, image);

        var urlIdx = url.indexOf('/web/');
        var location = window.location.origin + window.location.pathname;

        url = `${location}${url.slice(urlIdx + 4)}`;

        var winTop = (screen.height / 2) - (winHeight / 2);
        var winLeft = (screen.width / 2) - (winWidth / 2);

        //window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, title, 'width=' + winWidth + ', height=' + winHeight);
        window.open('http://www.facebook.com/sharer.php?s=100&p[title]=' + title + '&p[summary]=' + descr + '&p[images][0]=' + image, 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
        modalShare.modal('hide'); 
    }


    function copyToClipboard(textToCopy) {
        var $temp = $("<input>");
        $("#col-share").append($temp);
        $temp.val(textToCopy).select();
        document.execCommand("copy");
        $temp.remove();
        console.log(textToCopy);
        
        //modalShare.modal('hide');
        
        successClip.animate({
            opacity: 1,
            right: '18px'
        }, 500)
        .delay(1000)
        .animate({
            opacity: 0,
            right: '-200px'
        }, 500);
    }

    if($('#tokenfield').length){
        $('#tokenfield').on('tokenfield:createtoken', function (e) {
            var data = e.attrs.value.split('|')
            e.attrs.value = data[1] || data[0]
            e.attrs.label = data[1] ? data[0] + ' (' + data[1] + ')' : data[0]
        }).on('tokenfield:createdtoken', function (e) {
            // Über-simplistic e-mail validation
            var re = /\S+@\S+\.\S+/
            var valid = re.test(e.attrs.value)
            if (!valid) {
                $(e.relatedTarget).remove()
            }
        }).on('tokenfield:edittoken', function (e) {
            if (e.attrs.label !== e.attrs.value) {
                var label = e.attrs.label.split(' (')
                e.attrs.value = label[0] + '|' + e.attrs.value
            }
        }).tokenfield()
    }

    $('#invitation-form').submit(function(e) {
        e.preventDefault();
        if ( $('#tokenfield').tokenfield('getTokens').length > 0 ) {
            $('#btn-send-invitation').button('loading');

            let objToSend = $(this).serializeArray();

            if($('input#tokenfield-tokenfield').length){
                    console.log('sí existe el input');
                    var textToCheck = $('input#tokenfield-tokenfield').val();
                    console.log(textToCheck);
                    if(textToCheck.length > 0){
                        var whiteSpaceIdx = textToCheck.indexOf(' ');
                        var commaIdx = textToCheck.indexOf(',');

                        if((whiteSpaceIdx !== -1 && commaIdx !== -1) || (whiteSpaceIdx !== -1 && commaIdx == -1)){
                            //array of posible arrays
                            var posMails = textToCheck.split(' ');

                            posMails.forEach((word, idx) => {
                                word = word.replace(/,/g, '');
                                word = word.replace(/ /g, '');

                                if(isValidEmailAddress(word)){
                                    objToSend[0].value += `, ${word}`;
                                }

                            });

                        }else if(whiteSpaceIdx == -1 && commaIdx !== -1){

                            var posMails = textToCheck.split(',');
                            posMails.forEach((word, idx) => {
                                word = word.replace(/,/g, '');
                                word = word.replace(/ /g, '');

                                if(isValidEmailAddress(word)){
                                    objToSend[0].value += `, ${word}`;
                                }

                            });

                        }else{
                            if (isValidEmailAddress(textToCheck)) {
                                 objToSend[0].value += `, ${textToCheck}`;
                            }
                        }
                    }

                }


            $.ajax({
                type    : "POST",
                cache   : false,
                url     : $(this).attr('action'),
                data    : objToSend,
                success : function(data){
                    alert(data);
                },
                error   : function(){
                    alert('Ha ocurrido un error, intentelo más tarde');
                },
                complete: function(){
                    $('#btn-send-invitation').button('reset');
                    $('#invitation-form')[0].reset();
                }
            });
        }else {
            alert('Agregue una dirección de correo valida');
        }
        return false;
    }); 

    function isValidEmailAddress(emailAddress) {
        var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
        return pattern.test(emailAddress);
    };    


})