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
    contitech.getWindowHeight();
    contitech.parallax();
    contitech.navigation();
    $(window).on('resize', function() {
        contitech.getWindowHeight();
    })
    new WOW().init();
}

//get screen height, set to refresh on resize
contitech.getWindowHeight = function() {
    var height = $(window).height();
    var width = $(window).width();
    contitech.windowDimensions = {
        width: width,
        height: height + 1
    }
    contitech.setSectionHeight()
}

contitech.loadSections = function(content) {
    var template = $('#templates .ability').html();
    var rendered = Mustache.render(template, content);
    $('#discover-ability').after(rendered);
    $('.content-carousel').each(function() {
        $(this).find('.item').eq(0).addClass('active')
    })
    contitech.sections = [{
        el: 'add-more-ability',
        nav: false
    }, {
        el: 'discover-ability',
        nav: false
    }];
    for (var i in content) {
        contitech.sections.push({
            el: content[i].prefix + '-ability',
            nav: true
        })
    }
    contitech.sections.push({
        el: 'what-ability',
        nav: false
    })
    contitech.sections.push({
        el: 'contact',
        nav: false
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
            duration: '125%',
            tweenChanges: true
        }
    });
    contitech.parallax.scene = {};
    $.each(contitech.sections, function(i, val) {
        var el = val.el;
        var nav = val.nav;
        var opacityTween = TweenMax.to('#' + el + ' .background', 0.6, {
            opacity: 1,
        });
        contitech.parallax.scene[el] = new ScrollMagic.Scene({
                triggerElement: '#' + el,
                triggerHook: "onEnter"
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
    })
    contitech.parallax.scene['ability-pin'] = new ScrollMagic.Scene({
            triggerElement: '#discover-ability em',
            triggerHook: 'onCenter'
        })
        .setPin('#discover-ability em')
        .addIndicators()
        .addTo(contitech.parallax.controller);

}

//ability navigation
contitech.navigation = function() {
        $('.ability-nav a').on('click', function(event) {
            $('.ability-nav a').removeClass('active');
            $(this).addClass('active')
            var ability = $(this).attr('data-ability');
            $('html, body').animate({
                scrollTop: $('#' + ability + '-ability').offset().top
            }, 1000);
            event.preventDefault();
        })
    }
    //auto-update navigation on scroll
contitech.updateNavigation = function(e) {
    $('.ability-nav').show();
    var ability = e.target.triggerElement().id.replace('-ability', '')
    $('.ability-nav a').removeClass('active');
    $('.ability-nav a[data-ability="' + ability + '"]').addClass('active')
}
contitech.hideNavigation = function(e) {
    $('.ability-nav').hide();
}

contitech.sections = []
