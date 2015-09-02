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
    contitech.loadAbilities(content);
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

contitech.loadAbilities = function(content) {
    var template = $('#templates .ability').html();
    var rendered = Mustache.render(template, content);
    $('#discover-ability').after(rendered);
    $('.content-carousel').each(function() {
        $(this).find('.item').eq(0).addClass('active')
    })
    contitech.abilities = ['add-more-ability', 'discover-ability'];
    for (var i in content) {
        contitech.abilities.push(content[i].prefix + '-ability')
    }
    contitech.abilities.push('what-ability')
    contitech.abilities.push('contact')
}

//set section heights to screen height
contitech.setSectionHeight = function() {
    $('section').css({
        'height': contitech.windowDimensions.height
    })
}

//parallax
contitech.parallax = function() {
    this.controller = new ScrollMagic.Controller({
        globalSceneOptions: {
            triggerHook: "onEnter",
            duration: "200%"
        }
    });
    /*contitech.parallax.tween = {};
    var obj = contitech.abilities;
    console.log(obj)
    for (var i in obj) {
        if (i == 0) {
            console.log('first')
            contitech.parallax.tween[obj[i]] = new ScrollMagic.Scene({
                    triggerElement: '#' + obj[i]
                })
                .setTween('#' + obj[i] + ' .background', {
                    //opacity: "100",
                    y: "80%",
                    ease: Linear.easeInOut
                })
                .addIndicators()
                .addTo(this.controller)
                //.on('enter', contitech.updateNavigation);
        } else if (i == obj.length - 1) {
            console.log('last')
            contitech.parallax.tween[obj[i]] = new ScrollMagic.Scene({
                    triggerElement: '#' + obj[i]
                })
                .setTween('#' + obj[i] + ' .background', {
                    y: "80%",
                    //opacity: "100",
                    ease: Linear.easeInOut
                })
                .setTween('#' + obj[i - 1] + ' .background', {
                    opacity: "0",
                    ease: Linear.easeInOut
                })
                .addIndicators()
                .addTo(this.controller)
                //.on('enter', contitech.updateNavigation);
        } else {
            console.log('other')
            contitech.parallax.tween[obj[i]] = new ScrollMagic.Scene({
                    triggerElement: '#' + obj[i] + ' .background'
                })
                .setTween('#' + obj[i] + ' .background', {
                    y: "80%",
                    //opacity: "100",
                    ease: Linear.easeInOut
                })
                /*.setTween('#' + obj[i + 1] + ' .background', {
                    opacity: "0",
                    ease: Linear.easeInOut
                })
                .setTween('#' + obj[i - 1] + ' .background', {
                    opacity: "0",
                    ease: Linear.easeInOut
                })
                .addIndicators()
                .addTo(this.controller)
                //.on('enter', contitech.updateNavigation);
        }
    }*/
        new ScrollMagic.Scene({
                triggerElement: "#add-more-ability"
            })
            .setTween("#add-more-ability .background", {
                y: "80%",
                ease: Linear.easeNone
            })
            .addIndicators()
            .addTo(this.controller)
            .on('enter', contitech.hideNavigation);

        new ScrollMagic.Scene({
                triggerElement: "#discover-ability"
            })
            .setTween("#discover-ability .background", {
                y: "80%",
                ease: Linear.easeNone
            })
            .addIndicators()
            .addTo(this.controller)
            .on('enter', contitech.hideNavigation);




 
        new ScrollMagic.Scene({
                triggerElement: "#account-ability"
            })
            .setTween("#account-ability .background", {
                y: "80%",
                ease: Linear.easeInOut
            })
            .addIndicators()
            .addTo(this.controller)
            .on('enter', contitech.updateNavigation);

        new ScrollMagic.Scene({
                triggerElement: "#assure-ability"
            })
            .setTween("#assure-ability .background", {
                y: "80%",
                ease: Linear.easeNone
            })
            .addIndicators()
            .addTo(this.controller)
            .on('enter', contitech.updateNavigation);

        new ScrollMagic.Scene({
                triggerElement: "#expand-ability"
            })
            .setTween("#expand-ability .background", {
                y: "80%",
                ease: Linear.easeNone
            })
            .addIndicators()
            .addTo(this.controller)
            .on('enter', contitech.updateNavigation);

        new ScrollMagic.Scene({
                triggerElement: "#knowledge-ability"
            })
            .setTween("#knowledge-ability .background", {
                y: "80%",
                ease: Linear.easeNone
            })
            .addIndicators()
            .addTo(this.controller)
            .on('enter', contitech.updateNavigation);

        new ScrollMagic.Scene({
                triggerElement: "#protect-ability"
            })
            .setTween("#protect-ability .background", {
                y: "80%",
                ease: Linear.easeNone
            })
            .addIndicators()
            .addTo(this.controller)
            .on('enter', contitech.updateNavigation);

        new ScrollMagic.Scene({
                triggerElement: "#sustain-ability"
            })
            .setTween("#sustain-ability .background", {
                y: "80%",
                ease: Linear.easeNone
            })
            .addIndicators()
            .addTo(this.controller)
            .on('enter', contitech.updateNavigation);

        new ScrollMagic.Scene({
                triggerElement: "#target-ability"
            })
            .setTween("#target-ability .background", {
                y: "80%",
                ease: Linear.easeNone
            })
            .addIndicators()
            .addTo(this.controller)
            .on('enter', contitech.updateNavigation);





        new ScrollMagic.Scene({
                triggerElement: "#what-ability"
            })
            .addIndicators()
            .addTo(this.controller)
            .on('enter', contitech.hideNavigation);

        new ScrollMagic.Scene({
                triggerElement: "#contact"
            })
            .setTween("#contact .background", {
                y: "80%",
                ease: Linear.easeNone
            })
            .addIndicators()
            .addTo(this.controller)
            .on('enter', contitech.hideNavigation);
      
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

contitech.abilities = []
