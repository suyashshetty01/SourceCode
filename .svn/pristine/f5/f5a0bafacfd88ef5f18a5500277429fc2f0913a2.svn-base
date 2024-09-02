var siteURL ="";
$(document).ready(function(){
	siteURL =  window.location.href;
	$(".closebutton").click(function(){
		$("#successful").hide();
		location.reload();
	});
});
	function Horizon_Method_Convert(method_action, data, type) {
    var obj_horizon_method = {
        'url': (type == "POST") ? "/TwoWheelerInsurance/call_horizon_post" : "/TwoWheelerInsurance/call_horizon_get?method_name=" + method_action,
        "data": {
            request_json: JSON.stringify(data),
            method_name: method_action,
            client_id: "2"
        }
    };
    return obj_horizon_method;
}
 function GetUrl() {
        var url = window.location.href;
        var newurl;
        if (url.includes("request_file")) {
            newurl = "http://localhost:3000";
        } else if (url.includes("qa")) {
            newurl = "http://qa-horizon.policyboss.com:3000";
        } else if (url.includes("www") || url.includes("origin-cdnh") || url.includes("cloudfront")) {
            newurl = "http://horizon.policyboss.com:5000";
        }
        return newurl;
    }
		function GeteditUrl() {
    var url = window.location.href;
    //alert(url.includes("health"));
    var newurl;
    newurl = "http://qa.policyboss.com";
    if (url.includes("localhost")) {
        newurl = "http://localhost:3000";
    } else if (url.includes("qa")) {
        newurl = "http://qa.policyboss.com";
    } else if (url.includes("www") || url.includes("origin-cdnh") || url.includes("cloudfront")) {
        newurl = "https://www.policyboss.com";
    }
    return newurl;
}
	function SubmitForm(){
	//$('#myForm').submit(function(e){
		//e.preventDefault();
		var username = $('#username').val();
    	var number = $('#number').val();
    	var city = $('#city').val();
    	//var options = $('#selectCity option');
    	var nameReg = /^[A-Za-z ]+$/;
    	var numberReg = /^[0-9]+$/;

    	$(".error").remove();
    	//Username validation
    	var nameValid = false;
    	if(username < 1){
			$('#username').addClass('wrong-input');
			$("#username").after('<span class="error">Please Enter Your Name</span>');
			nameValid = false;
		}
		else if(!nameReg.test(username)){
			$('#username').addClass('wrong-input');
			$('#username').after('<span class="error">Name must be in characters only</span>');
			nameValid = false;
		}
		else if(username.length <= 2 || username.length > 20){
			$('#username').addClass('wrong-input');
			$('#username').after('<span class="error">user name must be in between of 3 to 20</span>');
			nameValid = false;
		}
		else{
			$('#username').addClass('right-input');
			$('#username').after('<span class="error"</span>');
			nameValid = true;
		}

		//Phone number validation
		var numberValid = false;
		if(number < 1){
			$('#number').addClass('wrong-input');
			$('#number').after('<span class="error">Please Enter Your Contact Number</span>');
			numberValid = false;
		}
		else if(!numberReg.test(number)){
			console.log("numeric");
			$('#number').after('<span class="error">Please Enter Numbers Only</span>');
			numberValid = false;
		}
		else if(number.length != 10){
			$('#number').addClass('wrong-input');
			$('#number').after('<span class="error">Please Enter 10 Digits Contact Number</span>');
			numberValid = false;
		}
		else if((number[0]!=9) && (number[0]!=8) && (number[0]!=7)){
			$('#number').addClass('wrong-input');
			$('#number').after('<span class="error">number must start with 9 , 8 or 7</span>');
			numberValid = false;
		}
		else{
			$('#number').addClass('right-input');
			$('#number').after('<span class="error"></span>');
			numberValid = true;
		}

		//City name validation
		var cityValida = false;
		if(city < 1){
			$('#city').addClass('wrong-input');
			$('#city').after('<span class="error">Please enter your City</span>');
			cityValida = false;
		}
		else{
			$('#city').addClass('right-input');
			$('#city').after('<span class="error"></span>');
			cityValida = true;
		} 
		console.log(nameValid);console.log(numberValid);console.log(cityValida);
		if((nameValid === true) && (numberValid === true) && (cityValida === true)){
			 var obj = {
				 "Name" : username ,
				 "Contact_Number" : number ,
				 "City" : city 
				 }
				var obj_horizon_data = Horizon_Method_Convert("/term_lifeinsurance_campaigns", obj, "POST");
       
        $.ajax({
            type: "POST", 
			data : siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) :  JSON.stringify(obj),
			url :  siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/term_lifeinsurance_campaigns" ,
			contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (response) {
				$("#successful").show();
				$("body").css('overflow','hidden');
            }
        });
				 
			 // $('#myForm').ajaxSubmit({
						// data: obj,
						// error: function (xhr) {
						// $('#txt_statusmsg').text(response["Msg"]);
						// },
						// success: function (response) {
						// $("#successful").show();
						// $("body").css('overflow','hidden');
						// }
				// });
			
		}
		
	}
	//);

	