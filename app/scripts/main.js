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
    contitech.navigation();
    contitech.parallax();
    contitech.WOW = new WOW().init();
    contitech.setStickyAbility();
    contitech.whatAbility();
    $(window).on('resize', function() {
        contitech.getWindowDimensions();
        contitech.setStickyAbility();
    })

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

contitech.setStickyAbility = function() {
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
        navAbility: false,
        stickyAbility: false
    }, {
        el: 'discover-ability',
        navAbility: true,
        stickyAbility: true
    }];
    for (var i in content) {
        contitech.sections.push({
            el: content[i].prefix + '-ability',
            navAbility: true,
            stickyAbility: true
        })
    }
    contitech.sections.push({
        el: 'what-ability',
        navAbility: false,
        stickyAbility: false
    })
    contitech.sections.push({
        el: 'contact',
        navAbility: false,
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
        var navAbility = val.navAbility;
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
        if (el === 'what-ability') {
             contitech.parallax.scene[el].on('enter', $('#blank').focus());
        }
        if(el === 'add-more-ability'){
            contitech.parallax.scene[el].on('enter', contitech.resetWOW());
        }
        if (navAbility) {
            contitech.parallax.scene[el].on('enter', contitech.updateNavigation);
        } else {
            contitech.parallax.scene[el].on('enter', contitech.hideNavigation);
        }

        if (stickyAbility) {
            if (el === 'discover-ability') {
                contitech.parallax.scene[el].on('enter', contitech.showStickyAbility);
            } else {
                contitech.parallax.scene[el].on('enter', contitech.showStickyAbility);
            }
        } else {
            contitech.parallax.scene[el].on('enter', contitech.hideStickyAbility);
        }
    })

}
contitech.showStickyAbility = function() {
    $('#sticky-ability').show()
}
contitech.hideStickyAbility = function() {
        $('#sticky-ability').hide()
    }
    //ability navigation
contitech.navigation = function() {
        $('#nav-ability a').on('click', function(event) {
            $(this).addClass('animated pulse');
            setTimeout(function() {
                    $(this).removeClass('animated pulse')
                },
                1000);
            $('#nav-ability a').removeClass('active');
            $(this).addClass('active')
            var ability = $(this).attr('data-ability');
            if (ability === "discover") {
                _scrollTo($('#discover-ability'), 20)
            } else {
                _scrollTo($('#' + ability + '-ability'))
            }
            event.preventDefault();
        })
        $('#scroll-for-more-ability').on('click', function() {
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
    $('#nav-ability').hide()
}

contitech.resetWOW = function() {
    $('.wow').each(function(){
        $(this).removeClass('animated');
        $(this).removeAttr('style');
    })
    contitech.WOW = new WOW().init();
}

contitech.whatAbility = function() {
    $('#blank').val('');
    $('#blank').on('keyup', function() {
        console.log('keyup')
        _delay(feedback, 500)

        function feedback() {
            console.log('feedbackkeyup')
            if ($('#blank').val() !== '') {
                setTimeout(function() {
                    $('#blank-ability em').addClass('animated pulse');
                    setTimeout(function() {
                        $('#blank-ability em').removeClass('animated pulse');
                    }, 1000)
                }, 500)
                $('#blank').addClass('animated pulse')
                setTimeout(function() {
                    $('#blank').removeClass('animated pulse')
                }, 1000)
            }

        }
    })
}

var _scrollTo = function($el, offsetTop) {
    if (!offsetTop) {
        offsetTop = 0;
    }
    $('html, body').animate({
        scrollTop: $el.offset().top + offsetTop
    }, 1000);
}

var _delay = (function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();
