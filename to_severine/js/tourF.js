setUp();

function setUp(){

    if(getURLParameter('lang') != null){
        setLanguage(getURLParameter('lang'));
    }else{
        $('body').data('lang', 'es');
    }

    $('.lang').click(function(){
        var lang = $(this).data('lang');

        if(lang != $('body').data('lang')){
            setLanguage(lang);            
        }
    });

    $('#paseos a').click(function(){
        setPasseoParamURL($(this));
        setLangParamURL($(this), false);
    });
}

function setPasseoParamURL(tag, first=true){
    var href = tag.attr('href');
    href += (first?'?':'&');
    href +='paseo='+tag.attr('id');
    tag.attr('href',href);
}

function setLangParamURL(tag, first=true){
    var href = tag.attr('href');
    href += (first?'?':'&');
    href +='lang='+$('body').data('lang');
    tag.attr('href',href);
}

function setLanguage(lang){
    $('body').data('lang', lang);
    changeSelectedFlag(lang);
    changeIndexLanguage(lang);
}

function changeSelectedFlag(lang){
    $('.lang.selected').attr('href', '#').removeClass('selected');
    $('.dropdown').find('a[data-lang="'+lang+'"]').attr('href', 'javascript:;').addClass('selected');
    
    var new_lang = $('.lang.selected').detach();
    $('.dropdown-content').prepend(new_lang);
}

function changeIndexLanguage(lang){
    var dic = INDEX[lang];

    $('#cover_slogan').html(dic['cover_slogan']);

    $.each(dic['menu'], function(id, val) {
        $('#' + id).html(val);
    });

    $.each(dic['buenos_aires'], function(id, val) {
        $('#' + id).html(val);
    });
    
    $.each(dic['tours'], function(id, val) {
        $('#' + id).html(val);
    });

    $.each(dic['presentation'], function(id, val) {
        $('#' + id).html(val);
    });
    
    var contact = dic['contact'];
    $('#contact_us').html(contact['contact_us']);
    $('#contact_sub').html(contact['contact_sub']);
    $('#contact_name').attr('placeholder', contact['contact_name']);
    $('#contact_email').attr('placeholder', contact['contact_email']);
    $('#contact_message').attr('placeholder', contact['contact_message']);
    $('#contact_send').attr('value', contact['contact_send']);
}

function getURLParameter(sParam){
    var sPageURL = window.location.href.split('?')[1];
    if(sPageURL != null){ 
        var sURLVariables = sPageURL.split('&');

        for (var i = 0; i < sURLVariables.length; i++){
            var sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] == sParam){
                return sParameterName[1];
            }
        }
    }
}




