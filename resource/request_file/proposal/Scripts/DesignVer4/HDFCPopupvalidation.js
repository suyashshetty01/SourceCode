function validation() {

	   var name = $('#name').val();
    	var number = $('#number').val();
    	var email = $('#email').val();
    	var DOB = $("#dob").val();
    	var amount = $('#SumInsured').val();
    	var city = $('#city').val();
	var nameReg = /^[a-zA-Z ]*$/;
    	var numberReg = /^[0-9]+$/;
	var mailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    	$(".error").remove();
    	//name validation
    	var nameValid = false;
    	if(name < 1){
			$('#name').addClass('wrong-input');
			//$("#name").after('<div class="error">Please Enter Your Name</div>');
			nameValid = false;
		}
		else if(!nameReg.test(name)){
			$('#name').addClass('wrong-input');
			$('#name').after('<div class="error">Name must be in characters only</div>');
			nameValid = false;
		}
		else if(name.length <= 2 || name.length > 20){
			$('#name').addClass('wrong-input');
			$('#name').after('<div class="error">user name must be in between of 3 to 20</div>');
			nameValid = false;
		}
		else{
			$('#name').addClass('right-input');
			$('#name').removeClass('wrong-input');
			$('#name').after('<div class="error"</div>');
			nameValid = true;
		}

		//Email validation
    	var emailValid = false;
    	if(email < 1){
			$('#email').addClass('wrong-input');
			//$("#email").after('<div class="error">Please Enter Your Email Id.</div>');
			emailValid = false;
		}
		else if(!mailReg.test(email)){
			$('#email').addClass('wrong-input');
			$('#email').after('<div class="error">Please Enter Valid Email ID.</div>');
			emailValid = false;
		}
		else{
			$('#email').addClass('right-input');
			$('#email').removeClass('wrong-input');
			$('#email').after('<div class="error"</div>');
			emailValid = true;
		}

		//Phone number validation
		var numberValid = false;
		if(number < 1){
			$('#number').addClass('wrong-input');
			//$('#number').after('<div class="error">Please Enter Your Contact Number</div>');
			numberValid = false;
		}
		else if(!numberReg.test(number)){
			console.log("numeric");
			$('#number').after('<div class="error">Please Enter Numbers Only</div>');
			numberValid = false;
		}
		else if(number.length != 10){
			$('#number').addClass('wrong-input');
			$('#number').after('<div class="error">Please Enter 10 Digits Contact Number</div>');
			numberValid = false;
		}
		else if((number[0]!=9) && (number[0]!=8) && (number[0]!=7)){
			$('#number').addClass('wrong-input');
			$('#number').after('<div class="error">number must start with 9 , 8 or 7</div>');
			numberValid = false;
		}
		else{
			$('#number').addClass('right-input');
			$('#number').removeClass('wrong-input');
			$('#number').after('<div class="error"></div>');
			numberValid = true;
		}

		//sum insured validation
		var amountValida = false;
		if(amount < 1){
			$('#SumInsured').addClass('wrong-input');
			//$('#SumInsured').after('<div class="error">Please Select Sum Insured</div>');
			amountValida = false;
		}
		else{
			$('#SumInsured').addClass('right-input');
			$('#SumInsured').removeClass('wrong-input');
			$('#SumInsured').after('<div class="error"></div>');
			amountValida = true;
		} 

		//DOB validation
		var dateValid = true;
	    if(DOB < 1){
	    	$('#dob').addClass('wrong-input');
	    	//$("#dob").after('<span class="error">Please Enter Date of Birth</span>');
	    	dateValid = false;
	    }
	    else{
			$('#dob').addClass('right-input');
			$('#dob').removeClass('wrong-input');
	    	$("#dob").after('<span class="error"></span>');
	    	dateValid = true;
	    }

	    //City name validation
		var cityValida = false;
		if(city < 1){
			$('#city').addClass('wrong-input');
			$('#city').addClass('wrong-input');
			//$('#city').after('<div class="error">Please Enter Your City</div>');
			cityValida = false;
		}
		else{

			$('#city').addClass('right-input');
			$('#city').removeClass('wrong-input');
			$('#city').after('<div class="error"></div>');
			cityValida = true;
		}
	};
