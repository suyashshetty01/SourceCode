$(document).ready(function(){
	$('.title').on('click', function() {
		debugger;
		var err_count =0;
		
		$('form#PersonalInfo').find('input').each(function(){
			if($(this).prop('required')){
				if($(this).val() === "" || $(this).val() === null){
					err_count++;
					console.log(err_count);
					$(this).parent().parent().addClass('Error_Cls');
				}
				
			} else {
				console.log("IR");
			}
		});
		
		if(err_count === 0){
			$parent_box = $(this).closest('#Details');
			$parent_box.siblings().find('.info').hide();
			$parent_box.find('.info').toggle();
			$parent_box.siblings().find('#icon').addClass('fa-caret-down');
			$parent_box.siblings().find('#icon').removeClass('fa-caret-up');
			$(this).find('#icon').toggleClass('fa-caret-up fa-caret-down');
		}
		
	});
	var update_checkbox = function (){
		if ($("#LifeInsu").is(":checked")) {
	        $("#life").prop('disabled', false);
	    }
	    else {
	        $("#life").prop('disabled', 'disabled');
	    }
	    if ($("#GeneralInsu").is(":checked")) {
	        $("#general").removeAttr("disabled");
	    }
	    else {
	        $("#general").prop('disabled', 'disabled');
	    }
	    if ($("#HealthInsu").is(":checked")) {
	        $("#health").removeAttr("disabled");
	    }
	    else {
	        $("#health").prop('disabled', 'disabled');
	    }
	}
	$(update_checkbox);
 	$("#LifeInsu").change(update_checkbox);
 	$("#GeneralInsu").change(update_checkbox);
 	$("#HealthInsu").change(update_checkbox);
 	
 	$('#DateofBirth').focus(function(){
 		var element = $(this).parent();
	  	element.addClass('place');
	  });
 	$('#DateofBirth').blur(function(){
 		var element = $(this).parent();
	  	element.removeClass('place');
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
});