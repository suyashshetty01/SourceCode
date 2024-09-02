$(document).ready(function(){
	$('.title').on('click', function() {
		$parent_box = $(this).closest('#Details');
		$parent_box.siblings().find('.info').hide();
		$parent_box.find('.info').toggle();
		$parent_box.siblings().find('#icon').addClass('fa-caret-down');
		$parent_box.siblings().find('#icon').removeClass('fa-caret-up');
    	$(this).find('#icon').toggleClass('fa-caret-up fa-caret-down');
	});
	$('input').focus( function() {
 	  var element = $(this).next();
	  element.next().addClass('txt');
	  element.next().css('color','#009fe3');
	  if($(this).parent().parent().hasClass("row")){
	  	$(this).parent().css('border-bottom','1px solid #009fe3');
	  }
	  else{
	  	$(this).parent().parent().css('border-bottom','1px solid #009fe3');
	  }
	});

	$('input').blur( function() {
		var element = $(this).next();
		element.next().css('color','gray');
		console.log(!$(this).val());
		if(!$(this).val()){
			element.next().removeClass('txt');
		}
		if($(this).parent().parent().hasClass("row")){
		  	$(this).parent().css('border-bottom','1px solid gray');
		  }
		  else{
		  	$(this).parent().parent().css('border-bottom','1px solid gray');
		  }
	});
	
	$('#DateofBirth').focus(function(){
 		var element = $(this).parent();
	  	element.addClass('place');
	  });
 	$('#DateofBirth').blur(function(){
 		var element = $(this).parent();
	  	element.removeClass('place');
	  });
});