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
    //conti.scrollTo($('#add-more-ability'), 0, 0);
    conti.loadSections(content);
    /*var req = 'http://conticontent.geometrysites.com/Services/content.asmx/ContiDataGet'
    $.ajax({
        dataType: "json",
        url: req,
        mimeType: "application/json",
        success: function(data) {
            conti.loadSections(data);
        }
    });*/
    conti.getWindowDimensions();
    conti.setStickyAbility();
    conti.navigation();
    conti.parallax();
    conti.whatAbility();
    conti.WOW = new WOW().init();
    $(window).on('resize', function() {
        conti.delay(function(){
            conti.getWindowDimensions();
            conti.setStickyAbility();
            conti.setNavDimensions();
        }, 1000);
    });
    $(window).scrollStopped(function() {
        conti.delay(conti.scrollAdjust, 1000);
    })
};
conti.buttons = function(){
    $('#button-contact').on('click',function(){
        conti.scrollTo($('#contact'));
    })
    $('#button-what-ability').on('click',function(){
        conti.scrollTo($('#what-ability'));
    })
}
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
conti.setNavDimensions = function() {
    if (conti.windowDimensions.width > 768) {
        var height = conti.windowDimensions.height - 135 - 100;
        $('#nav-ability').css({
            'height': height
        })
    } else {
        $('#nav-ability').css({
            'height': ''
        })
    }
}
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
    rendered = Mustache.render(template, conti.leftHandAbilities);
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
        background: {},
        content: {}
    };
    $.each(conti.sections, function(i, val) {
        var el = val.el;
        var navAbility = val.navAbility;
        var stickyAbility = val.stickyAbility;

        //set up tweens
        var backgroundOpacityTween = TweenMax.to('#' + el + ' .parallax-background', 0.6, {
                opacity: 1
            }),
            foregroundOpacityTween = TweenMax.to('#' + el + ' .parallax-foreground', 0.6, {
                opacity: 1
            })
            /*,
                        prefixTween = TweenMax.to('#' + el + ' .prefix', 1, {
                            opacity: 1,
                            y: '-=20',
                            delay: 0.5
                        }),
                        contentHeaderCopyTween = TweenMax.to('#' + el + ' .content-header-copy', 0.5, {
                            opacity: 1,
                            y: '-=20',
                            delay: 1.5
                        }),
                        swiperContainerTween = TweenMax.to('#' + el + ' .swiper-container', 0.5, {
                            opacity: 1,
                            y: '-=20',
                            delay: 1.5
                        })*/
        ;


        //parallax foreground scene

        conti.parallax.scene.foreground[el] = new ScrollMagic.Scene({
            triggerElement: '#' + el,
            triggerHook: 'onEnter',
            duration: '125%',
            offset: '0'
        })

        /*.on('enter', function() {
            foregroundOpacityTween.play();
        }).on('leave', function() {
            foregroundOpacityTween.reverse();
        })*/
        //.addIndicators()

        .addTo(conti.parallax.controller);
        if (el !== 'add-more-ability') {
            conti.parallax.scene.foreground[el].setTween('#' + el + ' .parallax-foreground', {
                y: '20%',
                ease: Linear.easeInOut
            })
        }

        //parallax background scene
        conti.parallax.scene.background[el] = new ScrollMagic.Scene({
                triggerElement: '#' + el,
                triggerHook: 0.1,
                duration: '125%',
                offset: '0.1'
            }).setTween('#' + el + ' .parallax-background', {
                y: '20%',
                ease: Linear.easeInOut
            })
            .on('enter', function(e) {
                //backgroundOpacityTween.play();
                //conti.updateCurrentScene(e);
            }).on('leave', function() {
                //backgroundOpacityTween.reverse();
            })
            //.addIndicators()
            .addTo(conti.parallax.controller);

        //parallax section content scene
        conti.parallax.scene.content[el] = new ScrollMagic.Scene({
                triggerElement: '#' + el,
                triggerHook: '0.25',
                duration: '110%',
                //offset: '-10'
            }).on('enter', function(e) {
                console.log('enter')
                    //prefixTween.play();
                    //contentHeaderCopyTween.play();
                    //swiperContainerTween.play();
                conti.advanceList($('#left-hand-ability'));
                conti.updateCurrentScene(e);
            }).on('leave', function(e) {
                //console.log('leave')
                //conti.updateCurrentScene(e);
                //prefixTween.reverse();
                //contentHeaderCopyTween.reverse();
                //swiperContainerTween.reverse();
            })
            //.addIndicators()
            .addTo(conti.parallax.controller);

        if (el === 'what-ability') {
            conti.parallax.scene.foreground[el].on('enter', function() {
                document.getElementById('blank').select();
                $('#blank').click();
            });
        }
        if (navAbility) {
            conti.parallax.scene.content[el].on('enter', conti.updateNavigation);
            //conti.parallax.scene.content[el].on('leave', conti.updateNavigation);
        } else {
            conti.parallax.scene.content[el].on('enter', conti.hideNavigation);
            //conti.parallax.scene.content[el].on('leave', conti.hideNavigation);
        }
        if (stickyAbility) {
            if (el !== 'discover-ability') {
                conti.parallax.scene.foreground[el].on('enter', conti.showStickyAbility);
            }
        } else {
            conti.parallax.scene.foreground[el].on('enter', conti.hideStickyAbility);
        }
    });
    conti.parallax.scene.foreground['add-more-ability'].on('enter', conti.hideNavigation);
    /*$('.prefix,.swiper-container,.content-header-copy').css({
        'opacity': '0',
        'transform': 'translateY(20px)'
    })*/
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
        /*$(this).addClass('animated pulse');
        setTimeout(function() {
            $(this).removeClass('animated pulse');
        }, 1000);*/
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
        conti.delay(feedback, 1000);
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
    //conti.isAutoScrolling = true;
    if (!offsetTop) {
        offsetTop = 0;
    }
    if (!time) {
        time = 1000;
    }
    $('html, body').animate({
        scrollTop: $el.offset().top + offsetTop
    }, time);
    /*setTimeout(function() {
        conti.isAutoScrolling = false;
        console.log(false)
    }, time + 300)*/
};
conti.delay = function() {
    'use strict';
    var timer = 0;
    return function(callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
}();
conti.updateCurrentScene = function(e) {
        conti.currentScene = $('#' + e.target.triggerElement().id);
        console.log(conti.currentScene)
    }
    /*conti.isAutoScrolling = false;
    console.log(false)*/
conti.leftHandAbilities = ['market', 'expand', 'adapt', 'credit', 'foresee', 'solve', 'account', 'profit', 'depend', 'support', 'affect', 'target', 'service', 'protect', 'assure', 'knowledge', 'deliver', 'trust', 'process', 'control', 'sustain']
conti.currentScene = '';

/*conti.scrollAdjust = function(e) {
conti.scrollAdjust = function(e) {
    var sceneViewportOffset = Math.abs(conti.currentScene.offset().top - $(window).scrollTop())
    var sceneScrollPercentage = sceneViewportOffset / conti.windowDimensions.height;
    console.log(conti.currentScene.attr('id'), sceneScrollPercentage)
    if (sceneScrollPercentage < 0.25 && conti.windowDimensions.width > 768) {
        console.log('scrollAdjust')
        if(conti.currentScene.attr('id') === 'discover-ability'){
            conti.scrollTo(conti.currentScene, 20, 500)
        }
        else{
            conti.scrollTo(conti.currentScene, 0, 500)
        }
    }
}
$.fn.scrollStopped = function(callback) {
        var that = this,
            $this = $(that);
        $this.scroll(function(ev) {
            clearTimeout($this.data('scrollTimeout'));
            $this.data('scrollTimeout', setTimeout(callback.bind(that), 1000, ev));
        });


};
*/
