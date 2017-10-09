setUp();

function setUp(){
    setUpTour();

    $('#texto_menu > li > a').click(function(){
        setLangParamURL($(this));
    });

    $('.lang').click(function(){
        var lang = $(this).data('lang');

        if(lang != $('body').data('lang')){
            setLanguage(lang);            
        }
    })
}

function setUpTour(){
    var tour = getURLParameter('tour');
    var lang = getURLParameter('lang');

    var dic_main = PASEO['main'][lang];
    var dic_paseo = PASEO[tour][lang];

    if(dic_main == null || $.isEmptyObject(dic_main) 
        || dic_paseo == null || $.isEmptyObject(dic_paseo)){ 
        
        lang = 'es';
        dic_main = PASEO['main'][lang];
        dic_paseo = PASEO[tour][lang];
    }
    $('body').data('lang',lang)

    $.each(dic_main['menu'], function(id, val) {
        $('#' + id).html(val);
    });

    $('#category_title').html(dic_paseo['category_title']);

    if(dic_paseo['images'].length > 0){
        fillImageCarousel(dic_paseo['images']);
    }else{
        $('#myCarousel').hide();
    }

    createEmptyTourPanels(dic_paseo['tours'].length);
    setTourPanelLanguage(lang);
    fillTourPanels(dic_paseo['tours'])   
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
    $('#myCarousel').find('.carousel-indicators').append(indicators);
    $('#myCarousel').find('.carousel-inner').append(items);

    $('#myCarousel').find('.carousel-indicators li:first-child').addClass('active'); 
    $('#myCarousel').find('.carousel-inner .item:first-child').addClass('active');
}

function createEmptyTourPanels(panel_quantity){
    for (var i=0; i<panel_quantity; i++) {
        var tour_panel = '';
        tour_panel += ' <div class="panel panel-default tour-panel">';
        tour_panel += '     <div class="panel-heading tour-heading">';
        tour_panel += '         <div class="tour-title"></div>';
        tour_panel += '     </div>';
        tour_panel += '     <div class="panel-body">';
        tour_panel += '         <div class="tour-left">';
        tour_panel += '                 <h1 class="duration-left"></h1>';
        tour_panel += '         </div>';

        tour_panel += '         <div class="tour-right">';
        tour_panel += '             <div class="tour-inner tour-description">';                  
        tour_panel += '             </div>';

        tour_panel += '             <div class="tour-inner tour-frequency">';
        tour_panel += '                 <span class="title">';
        tour_panel += '                     <i class="fa fa-calendar-check-o fa-lg"><strong></strong></i>';
        tour_panel += '                 </span>';
        tour_panel += '                 <div class="description">';
        tour_panel += '                     <p></p>';
        tour_panel += '                 </div>';
        tour_panel += '             </div>';

        tour_panel += '             <div class="tour-inner tour-schedule">';
        tour_panel += '                 <span class="title">';
        tour_panel += '                     <i class="fa fa-clock-o fa-lg"><strong></strong></i>';
        tour_panel += '                 </span>';
        tour_panel += '                 <div class="description">';
        tour_panel += '                     <p></p>';
        tour_panel += '                 </div>';
        tour_panel += '             </div>';

        tour_panel += '             <div class="tour-inner tour-meeting-spot">';
        tour_panel += '                 <span class="title">';
        tour_panel += '                     <i class="fa fa-map-marker fa-lg"><strong></strong></i>';
        tour_panel += '                 </span>';
        tour_panel += '                 <div class="description">';
        tour_panel += '                     <p></p>';
        tour_panel += '                 </div>';
        tour_panel += '             </div>';

        tour_panel += '             <div class="tour-inner tour-duration">';
        tour_panel += '                 <span class="title">';
        tour_panel += '                     <i class="fa fa-hourglass-half  fa-lg"><strong></strong></i>';
        tour_panel += '                 </span>';
        tour_panel += '                 <div class="description">';
        tour_panel += '                     <p></p>';
        tour_panel += '                 </div>';
        tour_panel += '             </div>';

        tour_panel += '             <div class="tour-inner tour-prices">';
        tour_panel += '                 <span class="title">';
        tour_panel += '                     <i class="fa fa-money fa-lg"><strong></strong></i>';
        tour_panel += '                 </span>';
        tour_panel += '                 <div class="description">';
        tour_panel += '                     <p></p>';
        tour_panel += '                 </div>';
        tour_panel += '             </div>';

        tour_panel += '             <div class="tour-inner tour-languages">';
        tour_panel += '                 <span class="title">';
        tour_panel += '                     <i class="fa fa-globe fa-lg"><strong></strong></i>';
        tour_panel += '                 </span>';
        tour_panel += '                 <div class="description">';
        tour_panel += '                     <p></p>';
        tour_panel += '                 </div>';
        tour_panel += '             </div>';

        tour_panel += '             <div class="tour-inner tour-include">';
        tour_panel += '                 <span class="title">';
        tour_panel += '                     <i class="fa fa-plus-square fa-lg"><strong></strong></i>';
        tour_panel += '                 </span>';
        tour_panel += '                 <div class="description">';
        tour_panel += '                     <p></p>';
        tour_panel += '                 </div>';
        tour_panel += '             </div>';

        tour_panel += '             <div class="tour-inner tour-not-include">';
        tour_panel += '                 <span class="title">';
        tour_panel += '                     <i class="fa fa-minus-square fa-lg"><strong></strong></i>';
        tour_panel += '                 </span>';
        tour_panel += '                 <div class="description">';
        tour_panel += '                     <p></p>';
        tour_panel += '                 </div>';
        tour_panel += '             </div>';
        tour_panel += '         </div>';
        tour_panel += '     </div>';
        tour_panel += ' </div>';
        $('#tours').append(tour_panel);        
    }
        tourPanelSetUp();
}

function tourPanelSetUp(){
    $('.tour-heading').click(function(){
        $(this).siblings('.panel-body').slideToggle();
    });
}

function setTourPanelLanguage(lang){
    var dic_main = PASEO['main'][lang];

    $('.tour-panel').each(function(i){
        var panel = $(this);
        $.each(dic_main['tour-panel'], function(id, val) {
            panel.find('.' + id).find('.title strong').html(val);
        });
    });
}

function fillTourPanels(tours){
    $('.tour-panel').each(function(i){
        var panel = $(this);
        var this_tour = tours[i];
        var j=0;
        $.each(this_tour, function(id, val) {
            if(j<3){
                panel.find('.' + id).html(val);
            }else{
                panel.find('.' + id).find('.description p').html(val);
            }
            j++;
        });

    });  
}

function setLanguage(lang){
    $('body').data('lang',lang);
    changeSelectedFlag(lang);
    changeTourPanelLanguage(lang);
}

function changeTourPanelLanguage(){
    // [...]
    // fillTourPanels
}

function changeSelectedFlag(lang){
    $('.lang.selected').attr('href', '#').removeClass('selected');
    $('.dropdown').find('a[data-lang="'+lang+'"]').attr('href', 'javascript:;').addClass('selected');
    
    var new_lang = $('.lang.selected').detach();
    $('.dropdown-content').prepend(new_lang);
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
    href += (first?'?':'&');
    href +='lang='+$('body').data('lang');
    tag.attr('href',href);
}
