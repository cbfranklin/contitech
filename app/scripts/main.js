// jshint devel:true
/* global $,WOW,Mustache,ScrollMagic,TweenMax,Linear,content */
var conti = {};
//doc ready
$(function() {
    'use strict';
    conti.init();
});
//init
conti.init = function() {
    'use strict';
    conti.scrollTo($('#add-more-ability'), 0, 0);
    conti.loadSections(content);
    conti.getWindowDimensions();
    conti.navigation();
    conti.parallax();
    conti.WOW = new WOW().init();
    conti.setStickyAbility();
    conti.whatAbility();
    $(window).on('resize', function() {
        conti.getWindowDimensions();
        conti.setStickyAbility();
    });
};
//get screen height, set to refresh on resize
conti.getWindowDimensions = function() {
    'use strict';
    var height = $(window).height();
    var width = $(window).width();
    conti.windowDimensions = {
        width: width,
        height: height + 1
    };
    conti.setSectionHeight();
    conti.updateNavigation();
};
conti.setStickyAbility = function() {
    'use strict';
    $('#sticky-ability').css({
        left: $('#discover-ability .ability-hidden').offset().left,
        top: $('#discover-ability .ability-hidden').offset().top - $('#discover-ability').offset().top - 40
    });
};
conti.loadSections = function(content) {
    'use strict';
    //sections
    var template = $('#templates .template-ability').html();
    var rendered = Mustache.render(template, content);
    $('#discover-ability').after(rendered);
    /*$('.content-carousel').each(function() {
        $(this).find('.item').eq(0).addClass('active');
    });*/
    //navigation
    template = $('#templates .nav-ability').html();
    rendered = Mustache.render(template, content);
    $('#nav-ability').html(rendered);
    //left-hand treatment
    template = $('#templates .left-hand-ability').html();
    rendered = Mustache.render(template, content);
    $('#left-hand-ability').html(rendered);
    conti.sections = [{
        el: 'add-more-ability',
        navAbility: false,
        stickyAbility: false
    }, {
        el: 'discover-ability',
        navAbility: true,
        stickyAbility: true
    }];
    for (var i in content) {
        conti.sections.push({
            el: content[i].prefix + '-ability',
            navAbility: true,
            stickyAbility: true
        });
    }
    conti.sections.push({
        el: 'what-ability',
        navAbility: false,
        stickyAbility: false
    });
    conti.sections.push({
        el: 'contact',
        navAbility: false,
        stickyAbility: false
    });
    conti.swiper.instances = {};

    $.each(conti.sections, function(i, val) {
        var el = conti.sections[i].el;
        conti.swiper[el] = new Swiper('#' + el + ' .swiper-container', {
            loop: true,
            pagination: '#' + el + ' .swiper-pagination',
            nextButton: '#' + el + ' .swiper-button-next',
            prevButton: '#' + el + ' .swiper-button-prev',
        })
    });
};
conti.swiper = {};

//TOOGLE NAVIGATION
conti.mobileNav = {
        'toggle': function() {
            var $that = $('.menu-toggle');
            if (!$that.hasClass('active')) {
                $('#nav-ability').addClass('open')
                if ($(window).width() < 480) {
                    window.scrollTo(0, 0);
                }
            } else {
                $('#nav-ability').removeClass('open')
                    //$('#nav-ability').hide();
            }

            $('body').toggleClass('nav-open')

            setTimeout(function() {
                $that.toggleClass('active');
            }, 250)
        },
        'close': function() {
            var $that = $('.menu-toggle');
            $('#nav-ability').removeClass('open');
            $that.removeClass('active');
        },
        'open': function() {
            var $that = $('.menu-toggle');
            $('#nav-ability').addClass('open')
            if ($(window).width() < 480) {
                window.scrollTo(0, 0);
            }
            $that.addClass('active');
        }
    }
    //set section heights to screen height
conti.setSectionHeight = function() {
    'use strict';
    if (conti.windowDimensions.width > 768) {
        $('section').css({
            'height': conti.windowDimensions.height,
        });
    } else {
        $('section').css({
            'min-height': conti.windowDimensions.height,
        });
    }

};
//parallax
conti.parallax = function() {
    'use strict';
    conti.parallax.controller = new ScrollMagic.Controller({
        globalSceneOptions: {
            tweenChanges: true
        }
    });
    conti.parallax.scene = {
        foreground: {},
        background: {}
    };
    $.each(conti.sections, function(i, val) {
        var el = val.el;
        var navAbility = val.navAbility;
        var stickyAbility = val.stickyAbility;
        var backgroundOpacityTween = TweenMax.to('#' + el + ' .parallax-background', 0.6, {
            opacity: 1
        });
        var foregroundOpacityTween = TweenMax.to('#' + el + ' .parallax-foreground', 0.6, {
            opacity: 1
        });
        conti.parallax.scene.background[el] = new ScrollMagic.Scene({
                triggerElement: '#' + el,
                triggerHook: 0.1,
                duration: '125%',
                offset: '0'
            }).setTween('#' + el + ' .parallax-background', {
                y: '20%',
                ease: Linear.easeInOut
            }).on('enter', function() {
                backgroundOpacityTween.play();
            }).on('leave', function() {
                backgroundOpacityTween.reverse();
                conti.advanceList($('#left-hand-ability'));
            })
            //.addIndicators()
            .addTo(conti.parallax.controller);

        conti.parallax.scene.foreground[el] = new ScrollMagic.Scene({
                triggerElement: '#' + el,
                triggerHook: 'onEnter',
                duration: '125%',
                offset: '0.1'
            })
            .setTween('#' + el + ' .parallax-foreground', {
                y: '20%',
                ease: Linear.easeInOut
            })
            .on('enter', function() {
                foregroundOpacityTween.play();
            }).on('leave', function() {
                foregroundOpacityTween.reverse();
            })
            .addTo(conti.parallax.controller);

        if (el === 'what-ability') {
            conti.parallax.scene.background[el].on('enter', function() {
                document.getElementById('blank').select();
                $('#blank').click();
            });
        }
        if (el === 'add-more-ability') {
            conti.parallax.scene.background[el].on('enter', conti.resetWOW);
        }
        if (navAbility) {
            conti.parallax.scene.background[el].on('enter', conti.updateNavigation);
        } else {
            conti.parallax.scene.background[el].on('enter', conti.hideNavigation);
        }
        if (stickyAbility) {
            if (el === 'discover-ability') {
                conti.parallax.scene.background[el].on('enter', conti.showStickyAbility);
            } else {
                conti.parallax.scene.background[el].on('enter', conti.showStickyAbility);
            }
        } else {
            conti.parallax.scene.background[el].on('enter', conti.hideStickyAbility);
        }
    });
};
conti.showStickyAbility = function() {
    'use strict';
    $('#sticky-ability').show();
};
conti.hideStickyAbility = function() {
    'use strict';
    $('#sticky-ability').hide();
};
//ability navigation
conti.navigation = function() {
    'use strict';
    $('#nav-ability a').on('click', function(event) {
        conti.mobileNav.close();
        $(this).addClass('animated pulse');
        setTimeout(function() {
            $(this).removeClass('animated pulse');
        }, 1000);
        $('#nav-ability a').removeClass('active');
        $(this).addClass('active');
        var ability = $(this).attr('data-ability');
        if (ability === 'discover') {
            conti.scrollTo($('#discover-ability'), 20);
        } else {
            conti.scrollTo($('#' + ability + '-ability'));
        }
        event.preventDefault();
    });
    $('#scroll-for-more-ability').on('click', function() {
        conti.scrollTo($('#discover-ability'), 20);
    });
    $('.menu-toggle').on('click', function(e) {
        conti.mobileNav.toggle();
        e.preventDefault();
    });
};
//auto-update navigation on scroll
conti.updateNavigation = function(e) {
    'use strict';
    if (conti.windowDimensions.width > 768) {
        $('#nav-ability').show();
    } else {
        $('#nav-ability').hide();
    }
    if (e) {
        var ability = e.target.triggerElement().id.replace('-ability', '');
    }
    $('#nav-ability a').removeClass('active');
    $('#nav-ability a[data-ability="' + ability + '"]').addClass('active');
};
conti.hideNavigation = function() {
    'use strict';
    if (conti.windowDimensions.width > 768) {
        $('#nav-ability').hide();
    }
};
conti.resetWOW = function() {
    'use strict';
    $('.wow').each(function() {
        $(this).removeClass('animated');
        $(this).removeAttr('style');
    });
    conti.WOW = new WOW().init();
};
conti.whatAbility = function() {
    'use strict';

    function feedback() {
        console.log('feedbackkeyup');
        if ($('#blank').val() !== '') {
            setTimeout(function() {
                $('#blank-ability em').addClass('animated pulse');
                setTimeout(function() {
                    $('#blank-ability em').removeClass('animated pulse');
                }, 1000);
            }, 500);
            $('#blank').addClass('animated pulse');
            setTimeout(function() {
                $('#blank').removeClass('animated pulse');
            }, 1000);
        }
    }
    $('#blank').val('');
    $('#blank').on('keyup', function() {
        conti.delay(feedback, 500);
    });
};
conti.advanceList = function($el) {
    'use strict';
    var prev = $($el).find('li:first-child');
    $.unique(prev).each(function(i) {
        $(this).delay(i * 600).slideUp(function() {
            $(this).appendTo(this.parentNode).slideDown();
        });
    });
};
conti.scrollTo = function($el, offsetTop, time) {
    'use strict';
    if (!offsetTop) {
        offsetTop = 0;
    }
    if (!time) {
        time = 1000;
    }
    $('html, body').animate({
        scrollTop: $el.offset().top + offsetTop
    }, 1000);
};
conti.delay = function() {
    'use strict';
    var timer = 0;
    return function(callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
}();