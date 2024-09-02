$(document).ready(function() {
	$(".carousel-indicators > li").click(function(){
		if($(this).attr("data-slide-to")=="4")
		{
			$("#btnNext").text("GET STARTED");
		}
		else
		{
			$("#btnNext").text("NEXT");
		}
	});
	
	$("#btnNext").click(function(){
		if($(".carousel-indicators > li:nth-child(4)").hasClass("active")==true)
		{
			$("#btnNext").text("GET STARTED");
		}
		else
		{
			$("#btnNext").text("NEXT");
		}
	});

	$('#product-box .swiper-wrapper > div').click(function(){
		$('#product-box .swiper-wrapper > div').removeClass('swiper-slide-active');
		var index = $(this).attr('data-swiper-slide-index');
		$(this).addClass('swiper-slide-active');
		console.log(index);
		$('#slider .swiper-wrapper > div').removeClass('swiper-slide-active');
		$('#slider .swiper-wrapper > div[data-swiper-slide-index='+ index +']').addClass('swiper-slide-active');
		newSwiper.slideTo(index,100,false);
	});


	$('.Nevigation li').click(function(){
    	$('li').removeClass('activeMenu');
    	$(this).addClass('activeMenu');
    	var id = $(this).attr('id');
    	if( id == 'menu-icon'){
    		$('.side-menu-popup').toggle();
    	}
    });

	$('.menu-list > li').click(function(){
		$('.sub-menu').hide();
		$('.menu-list > li').removeClass('active');
		$(this).addClass('active');
		$(this).find('.sub-menu').show();
	})

	var swiper = new Swiper(".mySwiper", {
        slidesPerView: "auto",
        hashnav: true,
        centeredSlides: true,
        slideToClickedSlide:true,
        loop: true,
        noSwiping:true,
        autoplay: {
		    delay: 2000,
		    disableOnInteraction: false
		}
	});

	var newSwiper = new Swiper("#slider", {
        slidesPerView: "auto",
        hashnav: true,
        centeredSlides: true,
        slideToClickedSlide:true,
        loop: true,
        noSwiping:true,
        autoplay: {
		    delay: 2000,
		    disableOnInteraction: false
		}
	});



    $('input').focus( function() {
	 	var element = $(this).next();
		element.addClass('txt');
		element.css('color','#009fe3');
		$(this).css('border-bottom','1px solid #009fe3');
	});

	$('input').blur( function() {
		var element = $(this).next();
		console.log($(this).val());
		if(!$(this).val()){
			element.removeClass('txt');
			element.css('color','#212529');
		}
		else{
			element.css('color','gray');
		}
		$(this).css('border-bottom','1px solid gray');
	});

	$('textarea').focus( function() {
	 	var element = $(this).next();
		element.addClass('txt');
		element.css('color','#009fe3');
		$(this).css('border-bottom','1px solid #009fe3');
	});

	$('textarea').blur( function() {
		var element = $(this).next();
		console.log($(this).val());
		if(!$(this).val()){
			element.removeClass('txt');
			element.css('color','#212529');
		}
		else{
			element.css('color','gray');
		}
		$(this).css('border-bottom','1px solid gray');
	});

	$('select').change( function() {
	 	var element = $(this).next();
	 	element.show();
	});

	$(".datepicker").datepicker( {
	    format: "yyyy",
	    viewMode: "years", 
	    minViewMode: "years",
	    autoclose:true
	});
	$("input[type='checkbox']").change(function(){
		$(this).next().find('p').toggleClass('color');
	});


	$('.addCount').click(function(){
        console.log('click');
        var count=0;
        var val = 1;
        var value =parseInt($(this).prev('.Count').text());
        count = value + 1;
        console.log(value);
        console.log(count);
        $(this).prev('.Count').html(count);
    });

    $('.removeCount').click(function(){
        console.log('click');
        var count=0;
        var val = 1;
        var value =parseInt($(this).next('.Count').text());
        if(value == 0){value=1;}
        count = value - 1;
        console.log(value);
        console.log(count);
        if(count == 0){
            if($(this).next('.Count').hasClass('adult')){
                $(this).next('.adult').html("1");
                console.log("true");
            }
            else{
                $(this).next('.Count').html(count);
                console.log("false");
            }
        }
        else{
           $(this).next('.Count').html(count); 
       }
    });

    $('.sub-heading').click(function(){
    	$('.popup').show();
    });
    $('.colse-btn').click(function(){
    	$('.popup').hide();
    });


});
