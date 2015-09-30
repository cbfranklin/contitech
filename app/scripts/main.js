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
    //conti.loadSections(content);
    var req = 'http://conticontent.geometrysites.com/Services/content.asmx/ContiDataGet'
    $.ajax({
        dataType: "json",
        url: req,
        mimeType: "application/json",
        success: function(data) {
            conti.loadSections(data);
            conti.getWindowDimensions();
            conti.setStickyAbility();
            conti.navigation();
            conti.parallax();
            conti.whatAbility();
            conti.buttons();
            conti.WOW = new WOW({
                mobile: false
            }).init();
            $('#form-submit').on('click', function(e) {
                conti.formSubmit();
                e.preventDefault();
            })
            conti.debouncedResize(function() {
                conti.getWindowDimensions();
                conti.delay(function() {
                    conti.setStickyAbility();
                    conti.setNavDimensions();
                }, 100)
            });
            $(window).scrollStopped(function() {
                if (conti.windowDimensions.width > 768) {
                    conti.delay(conti.scrollAdjust, 1000);
                }
            })
            conti.delay(function() {
                $('.wrapper').addClass('init');
            }, 250)

        }
    });
};
conti.buttons = function() {
        $('#button-contact').on('click', function(e) {
            conti.scrollTo($('#contact'));
            e.preventDefault();
        })
        $('#button-what-ability').on('click', function(e) {
            conti.scrollTo($('#what-ability'));
            e.preventDefault();
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
    //navigation
    template = $('#templates .nav-ability').html();
    rendered = Mustache.render(template, content);
    $('#nav-ability').html(rendered);
    //left-hand treatment
    template = $('#templates .left-hand-ability').html();
    conti.leftHandAbilities = conti.leftHandAbilities.concat(conti.leftHandAbilities)
    rendered = Mustache.render(template, conti.leftHandAbilities);
    $('#left-hand-ability').html(rendered);
    conti.sections = [{
        el: 'add-more-ability',
        navAbility: false
    }, {
        el: 'discover-ability',
        navAbility: true,
        stickyAbility: true
    }];
    for (var i in content) {
        conti.sections.push({
            el: content[i].prefix + '-ability',
            navAbility: true
        });
    }
    conti.sections.push({
        el: 'what-ability',
        navAbility: false
    });
    conti.sections.push({
        el: 'contact',
        navAbility: false
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
    $('section').css({
        'min-height': conti.windowDimensions.height,
        'height': 'auto'
    });
    /*if (conti.windowDimensions.width > 768) {
        $('section').css({
            'height': conti.windowDimensions.height,
            'min-height': 'initial'
        });
    } else {
        $('section').css({
            'min-height': conti.windowDimensions.height,
            'height': 'auto'
        });
    }*/

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

        //set up tweens
        var backgroundOpacityTween = TweenMax.to('#' + el + ' .parallax-background', 0.6, {
                opacity: 1
            }),
            foregroundOpacityTween = TweenMax.to('#' + el + ' .parallax-foreground', 0.6, {
                opacity: 1
            });

        conti.parallax.scene.leftHandAbility = new ScrollMagic.Scene({
                triggerElement: 'body',
                duration: '11844',
                offset: '0',
                tweenChanges: false

            }).setTween('#left-hand-ability', {
                y: '-=20%',
                ease: Linear.easeInOut
            })
            .addTo(conti.parallax.controller);

        //parallax foreground scene
        conti.parallax.scene.foreground[el] = new ScrollMagic.Scene({
                triggerElement: '#' + el,
                triggerHook: 'onEnter',
                duration: '125%',
                offset: '0'
            })
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
                duration: '110%',
                offset: '0.1'
            }).setTween('#' + el + ' .parallax-background', {
                y: '20%',
                ease: Linear.easeInOut
            })
            .addIndicators()
            .addTo(conti.parallax.controller);



        conti.parallax.scene.background[el].on('enter', function(e) {
            conti.updateCurrentScene(e);
        })
        if (navAbility) {
            conti.parallax.scene.background[el].on('enter', conti.updateNavigation);
        } else {
            conti.parallax.scene.background[el].on('enter', conti.hideNavigation);
        }
    });
    conti.parallax.scene.foreground['add-more-ability'].on('enter', conti.hideNavigation);
};
//ability navigation
conti.navigation = function() {
    'use strict';
    $('#nav-ability a').on('click', function(event) {
        conti.mobileNav.close();
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
    $('#back-to-top').on('click', function() {
        conti.scrollTo($('#add-more-ability'), 0);
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
        if ($('#blank').val() !== '' && $('#blank').val() !== undefined) {
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
/*conti.advanceList = function($el) {
    'use strict';
    var prev = $($el).find('li:first-child');
    $.unique(prev).each(function(i) {
        $(this).delay(i * 600).slideUp(function() {
            $(this).appendTo(this.parentNode).slideDown();
        });
    });
};*/
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
}

conti.leftHandAbilities = ['market', 'expand', 'adapt', 'credit', 'foresee', 'solve', 'account', 'profit', 'depend', 'support', 'affect', 'target', 'service', 'protect', 'assure', 'knowledge', 'deliver', 'trust', 'process', 'control', 'sustain']
conti.currentScene = '';

conti.scrollAdjust = function(e) {
    var sceneViewportOffset = Math.abs(conti.currentScene.offset().top - $(window).scrollTop())
    var sceneScrollPercentage = sceneViewportOffset / conti.windowDimensions.height;
    if (sceneScrollPercentage < 0.25 && conti.windowDimensions.width > 768) {
        if (conti.currentScene.attr('id') === 'discover-ability') {
            conti.scrollTo(conti.currentScene, 20, 500)
        } else {
            conti.scrollTo(conti.currentScene, 0, 500)
        }
    }
}

conti.debouncedResize = function(c, t) {
    function onresize() {
        clearTimeout(t);
        t = setTimeout(c, 100)
    };
    return c
};


conti.formSubmit = function() {
    var formObj = {};
    formObj.sName = $('#form-name').val();
    formObj.sEmail = $('#form-email').val();
    formObj.sContent = $('#form-content').val();
    formObj.sAbility = $('#blank').val();
    var formString = JSON.stringify(formObj)
    $.ajax({
        type: "POST",
        data: formString,
        url: 'http://conticontent.geometrysites.com/Services/content.asmx/ContiEmailSend',
        contentType: "application/json; charset=utf-8"
    }).always(function(data){
        $('.content-form').hide();
        $('.content-form-success').show();
    })
}

$.fn.scrollStopped = function(callback) {
    var that = this,
        $this = $(that);
    $this.scroll(function(ev) {
        clearTimeout($this.data('scrollTimeout'));
        $this.data('scrollTimeout', setTimeout(callback.bind(that), 1000, ev));
    });


};