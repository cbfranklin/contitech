// jshint devel:true
if (!contitech) {
    var contitech = {}
}

$(function(){
	contitech.init();
})

contitech.init = function(){
	contitech.getWindowHeight();
	$(window).on('resize',function(){
		contitech.getWindowHeight();
	})
}

//get screen height, set to refresh on resize
contitech.getWindowHeight = function() {
    console.log('getWindowHeight')
    var height = $(window).height();
    var width = $(window).width();
    contitech.windowDimensions = {
        width: width,
        height: height
    }
    contitech.setSectionHeight()
}

//set section heights to screen height
contitech.setSectionHeight = function() {
    console.log('setSectionHeight')
    $('section').css({
        'height': contitech.windowDimensions.height
    })
}