setUp();

function setUp(){
    //set up initial tour page
    setUpCategory();

    //click on menu item
    $('#texto_menu > li > a').click(function(){
        setLangParamURL($(this));
    });

    //change language
    $('.lang').click(function(){
        var lang = $(this).data('lang');

        if(lang != $('body').data('lang')){
            setLanguage(lang);            
        }
    });

    //click on return from tour info
    $('#return_btn').click(function(){
        $('body').removeClass('no-scroll');
        closeTourInfo();
    });

    //press esc while on tour info
    $(document).keyup(function(e) {
         if (e.keyCode == 27) { 
            closeTourInfo();
        }
    });

    //click on reserve button
    $('#reserve_btn').click(function(){
        toggleReservationForm();
    });

    //click on send reservation
    $('#reservation_send').click(function(e){
        e.preventDefault();
        sendReservationEmail();
    });
}

function closeTourInfo(){
    $('#reservation_form').show();
    toggleReservationForm();
    $("#tour_info").animate({width:'hide'}, 400);
}

function setUpCategory(change_lang = false){
    var lang = '';
    var tour = '';
    var dic_main = {};
    var dic_paseo = {};

    if(change_lang){
        lang = $('body').data('lang');
        tour = $('body').data('category');

        check_json = checkJsonExists(lang,tour)
        tour = check_json['tour'];
        lang = check_json['lang'];
    }else{
        tour = getURLParameter('tour');
        lang = getURLParameter('lang');
        
        check_json = checkJsonExists(lang,tour)
        tour = check_json['tour'];
        lang = check_json['lang'];

        $('body').data('lang',lang);
        $('body').data('category',tour);
    }
    

    dic_main = PASEO['main'][lang];
    dic_paseo = PASEO[tour][lang];

    // set static information in chosen language
    changeSelectedFlag(lang);
    setTourMainLanguage(lang);

    $('#category_title').html(dic_paseo['category_title']);
    $('#category_description').html(dic_paseo['category_description']);

    createTourCards(dic_paseo['tours'], tour);
    setUpTourCards();
}

function createTourCards(tours){
    $('#tours').empty();
    for (var i=0; i<tours.length; i++){
        var tour_card = '';
        tour_card += '<div data-tour-title="'+ tours[i]['tour-title'] +'" class="col-sm-6 col-md-4 tour-card">';

        tour_card += '<div class="tour-card-background">';

        if(tours[i]['tour-card-image'] != null && tours[i]['tour-card-image'] != ''){
            tour_card += '        <img class="tour-card-image" src="'+ tours[i]['tour-card-image'] +'">';
        }

        tour_card += '</div>';
        tour_card += '        <div class="brief-info">';
        tour_card += '            <span class="col-md-7 tour-title"><h4>'+ tours[i]['tour-title'] +'</h4></span>';
        tour_card += '            <span class="col-md-5 tour-card-duration"><h4>'+ tours[i]['tour-card-duration'] +'</h4></span>';
        tour_card += '        </div>';
        tour_card += '</div>';
        $('#tours').append(tour_card);
    }
}

function setUpTourCards(){
    $('.tour-card').hover(function(){
        $(this).find('.brief-info').toggle();
    });

    $('.tour-card').click(function(){
        cleanForm();
        openTourInfo($(this).data('tour-title'));
    });
}

function cleanForm(){
    $('#reservation_form').find('input').val('');
    $('#reservation_form').find('textarea').val('');
}

function openTourInfo(tour_title){
    var lang = $('body').data('lang');
    var category = $('body').data('category');

    //get right tour jason
    var dic_paseo = PASEO[category][lang]['tours'];
    for (var i=0; i<dic_paseo.length; i++){
        if(tour_title == dic_paseo[i]['tour-title']){
            dic_paseo = dic_paseo[i];
            break;
        }
    }

    if(dic_paseo['images'].length > 0){
        fillImageCarousel(dic_paseo['images']);
    }else{
        $('#myCarousel').hide();
    }
    
    fillTourPanel(dic_paseo)

    $('body').addClass('no-scroll');
    $('#tour_info').slideToggle();
}

function fillImageCarousel(images){
    var indicators = '';
    var items = '';

    for(var i=0; i<images.length; i++){       
        indicators += '<li data-target="#myCarousel" data-slide-to="'+i+'"></li>';

        items += ' <div class="item">';
        items += '    <img src="'+images[i]+'">';
        items += ' </div>';
    }

    $('#myCarousel').find('.carousel-indicators').html(indicators);
    $('#myCarousel').find('.carousel-inner').html(items);

    $('#myCarousel').find('.carousel-indicators li:first-child').addClass('active'); 
    $('#myCarousel').find('.carousel-inner .item:first-child').addClass('active');
}

function fillTourPanel(tour){
    var panel = $('.tour-panel');

    panel.find('.tour-title').html(tour['tour-title']);
    panel.find('.tour-description').html(tour['tour-info']['tour-description']);

    $.each(tour['tour-info'], function(id, val) {
        //fill price table
        if(id == 'tour-prices'){
            if(val['options'] != null){
                var description = createPiceTable(val['options']);
                panel.find('.' + id).find('.description').html(description);
            }else{
                panel.find('.' + id).find('.description').html('<p></p>');
                panel.find('.' + id).find('.description p').html(val);
            }
        }else{
            panel.find('.' + id).find('.description p').html(val);
        }
    });

    panel.find('#reservation_tour').val(tour['tour-title']);
}

function createPiceTable(price_table){
    var table = '';
    for(var i = 0; i< price_table.length; i++){ 
        if(price_table[i]['description'] == null){
            table += '';
        } else{
            table += price_table[i]['description'];
        }
        table +=' <table class="price-table table table-bordered table-hover .table-condensed">'; 
        table +='   <thead> ';
        table +='       <tr>';

        for(var j =0; j<price_table[i]['price_table']['header'].length; j++){
            var h = price_table[i]['price_table']['header'][j];
            table +='<th>'+ h +'</th>';
        }
        table +='       </tr>'; 
        table +='   </thead>';

        table +='   <tbody> ';
        var rows = price_table[i]['price_table']['rows'];
        for(var j =0; j<rows.length; j++){
            table +='       <tr>';

            var h = rows[j]['title'];
            table +='<th>'+ h +'</th>';

            for(var k=0; k<rows[j]['values'].length; k++){
                var d = rows[j]['values'][k];
                table +='<td>'+ d +'</td>';
            }
            table +='       </tr>';
        }

        table +='   </tbody> ';
        table +=' </table>';
    }
    return table;
}

function setLanguage(lang){
    $('body').data('lang',lang);
    setUpCategory(true);
}

function changeSelectedFlag(lang){
    $('.lang.selected').attr('href', '#').removeClass('selected');
    $('.dropdown').find('a[data-lang="'+lang+'"]').attr('href', 'javascript:;').addClass('selected');
    
    var new_lang = $('.lang.selected').detach();
    $('.dropdown-content').prepend(new_lang);
}

function checkJsonExists(lang, tour){
    try {
            dic_paseo = PASEO[tour];
            if(dic_paseo == null || $.isEmptyObject(dic_paseo)){ 
                // window.location.replace("../templates/index.html");
                console.log("[ERROR] jsonCheck: Tour doesn't exist!");
            }
    } catch (e) {
        // window.location.replace("../templates/index.html");
        console.log("[ERROR] jsonCheck: Tour doesn't exist!");
        console.log(e);
    }

    try {
            dic_paseo = PASEO[tour][lang];
            if(dic_paseo == null || $.isEmptyObject(dic_paseo)){ 
                if(lang == 'es'){
                    // window.location.replace("../templates/index.html");
                    console.log("[ERROR] jsonCheck: No tour in spanish!");
                }else{
                    lang = 'es';
                    return checkJsonExists(lang, tour);
                }
            } else if(dic_paseo['category_title'] == null || dic_paseo['category_title'] == ''){
                if(lang == 'es'){
                    // window.location.replace("../templates/index.html");
                    console.log("[ERROR] jsonCheck: No tour in spanish!");
                }else{
                    lang = 'es';
                    return checkJsonExists(lang, tour);
                }
            }
    } catch (e) {
        // window.location.replace("../templates/index.html");
        console.log("[ERROR] jsonCheck: Tour-lang!");
        console.log(e);
    }

    return {'lang': lang, 'tour': tour};
}

function setTourMainLanguage(lang){
    var dic_main = PASEO['main'][lang];

    //set menu
    $.each(dic_main['menu'], function(id, val) {
            $('#' + id).html(val);
        });

    //set panel
    var panel = $('.tour-panel');
    $.each(dic_main['tour-panel'], function(id, val) {
        panel.find('.' + id).find('.title strong').html(val);
    });

    //set form
    var form = $('#reservation_form').find('form');
    $.each(dic_main['reservation-form'], function(id, val) {
        form.find('#' + id).attr('placeholder', val);
    });

    //set buttons
    panel.find('#reserve_btn').find('span').text(dic_main['buttons']['reserve_btn']);
    panel.find('#reservation_send').text(dic_main['buttons']['reservation_send']);
}

function getURLParameter(sParam){
    var sPageURL = window.location.href.split('?')[1];
    if(sPageURL!=null){ 
        var sURLVariables = sPageURL.split('&');

        for (var i = 0; i < sURLVariables.length; i++){
            var sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] == sParam){
                return sParameterName[1];
            }
        }
    }
}

function setLangParamURL(tag, first=true){
    var href = tag.attr('href');
    var section = '';

    if(href.includes('#')){
        var href_split = href.split('#');
        if(href_split[1] != null){
            section ='#'+href_split[1];            
        }
        href = href_split[0];
    }

    href += (first?'?':'&');
    href +='lang='+$('body').data('lang');
    href += section;
    
    tag.attr('href',href);
}

function toggleReservationForm(){
    if($('#reservation_form').is(':visible')){
        $('#reserve_btn').removeClass('active');
        $('#reserve_btn').find('i').removeClass('fa-chevron-up');
        $('#reserve_btn').find('i').addClass('fa-chevron-down');
    }else{
        $('#reserve_btn').addClass('active');
        $('#reserve_btn').find('i').addClass('fa-chevron-up');
        $('#reserve_btn').find('i').removeClass('fa-chevron-down');
    }
    $('#reservation_form').slideToggle()
}

function sendReservationEmail(){
    var name = $('#reservation_name').val();
    var surname = $('#reservation_surname').val();
    var phone = $('#reservation_phone').val();
    var email = $('#reservation_email').val();
    var tour = $('#reservation_tour').val();
    var message = $('#reservation_message').val();
                
    if(name == null || $.isEmptyObject(name)    ||
        surname == null || $.isEmptyObject(name)    ||
        phone == null || $.isEmptyObject(phone)    ||
        email == null  || $.isEmptyObject(email)){
        $('#contact_form').find('input').addClass('invalid');
        $('#contact_form').find('#reservation_tour').removeClass('invalid');
        alert('All fields with * are needed!');
        return;
    }
    
    //send to formspree
    $.ajax({
        url:'https://formspree.io/gccbounous@gmail.com',
        method:'POST',
        data:{
            tour:tour,
            name:name,
            surname:surname,
            phone:phone,
            email:email,
            message:message,
            _replyto:email,
            _subject:'[RESERVA] - '+tour,
        },
        dataType:"json",
        success:function() {
            console.log('success');
            closeTourInfo();
        },
        error: function(e){
            console.log(e);
            alert('Sorry, we had an error, your e-mail was not sent. Please, try again later');
        }
    });     
}