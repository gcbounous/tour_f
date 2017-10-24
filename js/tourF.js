setUp();

function setUp(){
    //set initial language
    if(getURLParameter('lang') != null){
        setLanguage(getURLParameter('lang'));
    }else{
        $('body').data('lang', 'es');
    }

    //change language
    $('.lang').click(function(e){
         e.preventDefault();
        var lang = $(this).data('lang');

        if(lang != $('body').data('lang')){
            setLanguage(lang);            
        }
    });

    //chose a tour
    $('.tour-img-wrapper').click(function(){
        setTourParamURL($(this).find('a'));
        setLangParamURL($(this).find('a'), false);
    });

    //send contact e-mail
    $('#contact_send').click(function(e){
         e.preventDefault();
        sendContactEmail();
    });
}

function setTourParamURL(tag, first=true){
    var href = tag.attr('href');
    href += (first?'?':'&');
    href +='tour='+tag.data('tour');
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
    
    var i = 0;
    console.log(dic['tours'])
    $.each(dic['tours'], function(id, val) {
        if(i==0) $('#' + id).html(val);
        else $('#paseos').find('a[data-tour="'+id+'"]').next('span').html(val);
        i++;
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
    $('#contact_send').html(contact['contact_send']);
}

function getURLParameter(sParam){
    var sPageURL = window.location.href.split('?')[1];
    if(sPageURL != null){
        if(sPageURL.includes('#')){
            sPageURL = sPageURL.split('#')[0];
        }

        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++){

            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam){
                return sParameterName[1];
            }
        }
    }
}

function sendContactEmail(){        
    var name = $('#contact_name').val();
    var email = $('#contact_email').val();
    var message = $('#contact_message').val();
                
    if(name == null || $.isEmptyObject(name)    ||
        email == null  || $.isEmptyObject(email)   ||
        message == null || $.isEmptyObject(message)){
        $('#contact_form').find('input').addClass('invalid');
        $('#contact_form').find('textarea').addClass('invalid');
        alert('All fields with * are needed!');
        return;
    }
    
    //send to formspree
    $.ajax({
        url:'https://formspree.io/gccbounous@gmail.com',
        method:'POST',
        data:{
            name:name,
            _replyto:email,
             email:email,
            message:message,
            _subject:'[CONTACTO]',
        },
        dataType:"json",
        success:function() {
            console.log('success'); 
        },
        error: function(e){
            console.log(e);
            alert('Sorry, we had an error, your e-mail was not sent. Please, try again later');
        }
    });     
}




