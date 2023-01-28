$(document).ready(function(){
    
    $('.menu').on('click', function() {
		$('.bar').toggleClass('animate');
        $('.expand-menu').toggleClass('animate');
        $('.expand-menu .nav-link').toggleClass('animate');
        setTimeout(function(){
            $('.expand-menu .nav-link').toggleClass('animate-show');
        },500)
	})
    
})