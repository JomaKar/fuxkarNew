$(function(){

    var inpFile = $('#image_file').change(function(){
        fileSelectHandler();
    });

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

// check for selected crop region
function checkForm() {
    var divPrBr = getObj('divProgresBarr');
    divPrBr.innerHTML = '<center><marquee direction="left" id="ejemplo"><span class="Apple-style-span" style="color: red;">Subiendo foto del perfil ...</span></marquee> <a href="javascript:void(0);"></a> <a href="javascript:void(0);"></a></center>';
    if (parseInt($('#w').val()))return true;
    $('.error').html('Porfavor selecciona el area que se mostrara en tu perfil y selcciona subir').show();
    return false;

};

// update info by cropping (onChange and onSelect events handler)
function updateInfo(e) {
    $('#x1').val(e.x);
    $('#y1').val(e.y);
    $('#x2').val(e.x2);
    $('#y2').val(e.y2);
    $('#w').val(e.w);
    $('#h').val(e.h);
};

function fileSelectHandler() {

    // get selected file
    var oFile = $('#image_file')[0].files[0];

    // hide all errors
    $('.error').hide();

    // check for image type (jpg and png are allowed)
    var rFilter = /^(image\/jpeg|image\/png)$/i;
    if (! rFilter.test(oFile.type)) {
        $('.error').html('Porfavor selecciona un archivo de imagen (jpg y png son aceptados)').show();
        return;
    }
// clear info by cropping (onRelease event handler)
function clearInfo() {
    $('.info #w').val('');
    $('.info #h').val('');
};

    // check for file size
    if (oFile.size > 350 * (1024*1024)) {
        $('.error').html('Debes seleccionar una imagen que pese menos').show();
        return;
    }

    // preview element
    var oImage = $('#r-inpFileImgCont');


    // prepare HTML5 FileReader
    var oReader = new FileReader();
        oReader.onload = function(e) {

        // e.target.result contains the DataURL which we can use as a source of the image
        oImage.css({
            'background-image': 'url(' + e.target.result + ')'
        });

        oImage.onload = function () { // onload event handler

            // display step 2
            $('.step2').fadeIn(500);
            // paso 2.1: modificamos el contenedor del preview
            if ( oImage.naturalWidth > 500)
            {
                oImage.width = oImage.naturalWidth / 16
                oImage.height = oImage.naturalHeight / 16;
            }else{
                oImage.width = oImage.naturalWidth;
                oImage.height = oImage.naturalHeight;
            }
            // display some basic image info
          /*  var sResultFileSize = bytesToSize(oFile.size);
            $('#filesize').val(sResultFileSize);
            $('#filetype').val(oFile.type);
            $('#filedim').val(oImage.naturalWidth + ' x ' + oImage.naturalHeight);

            // Create variables (in this scope) to hold the Jcrop API and image size
            var jcrop_api, boundx, boundy;

            // destroy Jcrop if it is existed
            if (typeof jcrop_api != 'undefined')
                jcrop_api.destroy();

            // initialize Jcrop
            $('#preview').Jcrop({
                minSize: [50, 50], // min crop size
                maxSize: [500,500],
                aspectRatio : 1, // keep aspect ratio 1:1
                bgFade: true, // use fade effect
                bgOpacity: .3, // fade opacity
                onChange: updateInfo,
                onSelect: updateInfo,
                onRelease: clearInfo
            }, function(){

                // use the Jcrop API to get the real image size
                var bounds = this.getBounds();
                boundx = bounds[0];
                boundy = bounds[1];

                // Store the Jcrop API in the jcrop_api variable
                jcrop_api = this;
            });*/
        };
    };

    // read selected file as DataURL
    oReader.readAsDataURL(oFile);
}



})
// convert bytes into friendly format
