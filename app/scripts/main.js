// jshint devel:true
if (!contitech) {
    var contitech = {}
}

//doc ready
$(function() {
    contitech.init();
})

//init
contitech.init = function() {
    contitech.loadSections(content);
    contitech.getWindowDimensions();
    contitech.parallax();
    contitech.navigation();
    contitech.getWindowDimensions();
    contitech.setStickyAbility();
    $(window).on('resize', function() {
        contitech.getWindowDimensions();
        contitech.setStickyAbility();
    })
    new WOW().init();
}

//get screen height, set to refresh on resize
contitech.getWindowDimensions = function() {
    var height = $(window).height();
    var width = $(window).width();
    contitech.windowDimensions = {
        width: width,
        height: height + 1
    }
    contitech.setSectionHeight();
}

contitech.setStickyAbility = function(){
    $('#sticky-ability').css({
        left: $('#discover-ability .ability-hidden').offset().left,
        top: $('#discover-ability .ability-hidden').offset().top - $('#discover-ability').offset().top - 40
    })
}

contitech.loadSections = function(content) {

    //sections
    var template = $('#templates .template-ability').html();
    var rendered = Mustache.render(template, content);
    $('#discover-ability').after(rendered);
    $('.content-carousel').each(function() {
        $(this).find('.item').eq(0).addClass('active')
    })

    //navigation
    var template = $('#templates .nav-ability').html();
    var rendered = Mustache.render(template, content);
    $('#nav-ability').html(rendered);

    contitech.sections = [{
        el: 'add-more-ability',
        nav: false,
        stickyAbility: false
    }, {
        el: 'discover-ability',
        nav: false,
        stickyAbility: true
    }];
    for (var i in content) {
        contitech.sections.push({
            el: content[i].prefix + '-ability',
            nav: true,
            stickyAbility: true
        })
    }
    contitech.sections.push({
        el: 'what-ability',
        nav: false,
        stickyAbility: false
    })
    contitech.sections.push({
        el: 'contact',
        nav: false,
        stickyAbility: false
    })
}

//set section heights to screen height
contitech.setSectionHeight = function() {
    $('section').css({
        'height': contitech.windowDimensions.height
    })
}

//parallax
contitech.parallax = function() {
    contitech.parallax.controller = new ScrollMagic.Controller({
        globalSceneOptions: {
            tweenChanges: true
        }
    });
    contitech.parallax.scene = {};
    $.each(contitech.sections, function(i, val) {
        var el = val.el;
        var nav = val.nav;
        var stickyAbility = val.stickyAbility;
        var opacityTween = TweenMax.to('#' + el + ' .background', 0.6, {
            opacity: 1,
        });
        contitech.parallax.scene[el] = new ScrollMagic.Scene({
                triggerElement: '#' + el,
                triggerHook: "onEnter",
                duration: "125%",
                offset: "10%"
            })
            .setTween("#" + el + " .background", {
                y: "40%",
                ease: Linear.easeInOut
            })
            .on("enter", function(event) {
                opacityTween.play();
                //yTween.play()
                console.log('play ' + el)
            })
            .on("leave", function(event) {
                opacityTween.reverse();
                //yTween.play()
                console.log('reverse ' + el)
            })
            .addIndicators()
            .addTo(contitech.parallax.controller);

        if (nav) {
            contitech.parallax.scene[el].on('enter', contitech.updateNavigation);
        } else {
            contitech.parallax.scene[el].on('enter', contitech.hideNavigation);
        }

        if (stickyAbility) {
            if(el === 'discover-ability'){
                 contitech.parallax.scene[el].on('enter', contitech.showStickyAbility);
            }
            else{
                contitech.parallax.scene[el].on('enter', contitech.showStickyAbility);
            }
        } else {
            contitech.parallax.scene[el].on('enter', contitech.hideStickyAbility);
        }
    })
    /*contitech.parallax.scene['ability-pin'] = new ScrollMagic.Scene({
            triggerElement: '#discover-ability .ability',
            offset: contitech.windowDimensions.height * 0.222,
            duration: $('.sections').height(),
            reverse: true
        })
        .setPin('#discover-ability .ability')
        .addIndicators()
        .addTo(contitech.parallax.controller);*/

}
contitech.showStickyAbility = function(){
    $('#sticky-ability').show()
}
contitech.hideStickyAbility = function(){
    $('#sticky-ability').hide()
}
//ability navigation
contitech.navigation = function() {
        $('#nav-ability a').on('click', function(event) {
            $('#nav-ability a').removeClass('active');
            $(this).addClass('active')
            var ability = $(this).attr('data-ability');
            $('html, body').animate({
                scrollTop: $('#' + ability + '-ability').offset().top
            }, 1000);
            event.preventDefault();
        })
        $('#scroll-for-more-ability').on('click',function(){
             $('html, body').animate({
                scrollTop: $('#discover-ability').offset().top + 20
            }, 1000);
        })
    }
    //auto-update navigation on scroll
contitech.updateNavigation = function(e) {
    $('#nav-ability').show();
    var ability = e.target.triggerElement().id.replace('-ability', '')
    $('#nav-ability a').removeClass('active');
    $('#nav-ability a[data-ability="' + ability + '"]').addClass('active')
}
contitech.hideNavigation = function(e) {
    $('#nav-ability').hide();
}

contitech.resetWow = function(){
    new WOW().init();
}

contitech.sections = []
