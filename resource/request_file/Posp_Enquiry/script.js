var siteURL = "";
var cityName = [];

$(document).ready(function () {
    siteURL = window.location.href;
	cities();
    $('#myForm').submit(function (e) {
        e.preventDefault();
        var name = $('#name').val();
        var number = $('#number').val();
        var city = $('#city').val();
        var email = $('#email').val();
        var nameReg = /^[A-Za-z ]+$/;
        var cityReg = /^[A-Za-z]+$/;
        var numberReg = /^[0-9]+$/;
        var mailReg = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        $("#name").next().remove();
        $("#number").next().remove();
        $("#email").next().remove();
        $("#city").next().remove();

        $(".error").remove();
        //name validation
        var nameValid = false;
        if (name < 1) {

            $('#name').addClass('wrong-input');
            $("#name").after('<div class="error">Please Enter Your Name.</div>');
            nameValid = false;
        } else if (!nameReg.test(name)) {
            $('#name').addClass('wrong-input');
            $('#name').after('<div class="error">Name must be in characters only.</div>');
            nameValid = false;
        } else if (name.length <= 2 || name.length > 20) {
            $('#name').addClass('wrong-input');
            $('#name').after('<div class="error">user name must be in between of 3 to 20.</div>');
            nameValid = false;
        } else {
            $('#name').addClass('right-input');
            $('#name').after('<div class="error"></div>');
            nameValid = true;
        }

        //Email validation
        var emailValid = false;
        if (email < 1) {
            $('#email').addClass('wrong-input');
            $("#email").after('<div class="error">Please Enter Your Email Id.</div>');
            emailValid = false;
        } else if (!mailReg.test(email)) {
            $('#email').addClass('wrong-input');
            $('#email').after('<div class="error">Please Enter Valid Email Id.</div>');
            emailValid = false;
        } else {
            $('#email').addClass('right-input');
            $('#email').after('<div class="error"></div>');
            emailValid = true;
        }

        //Phone number validation
        var numberValid = false;
        if (number < 1) {
            $('#number').addClass('wrong-input');
            $('#number').after('<div class="error">Please Enter Your Contact Number.</div>');
            numberValid = false;
        } else if (!numberReg.test(number)) {
            console.log("numeric");
            $('#number').after('<div class="error">Please Enter Numbers Only.</div>');
            numberValid = false;
        } else if (number.length != 10) {
            $('#number').addClass('wrong-input');
            $('#number').after('<div class="error">Please Enter 10 Digits Contact Number.</div>');
            numberValid = false;
        } else if ((number[0] != 9) && (number[0] != 8) && (number[0] != 7)) {
            $('#number').addClass('wrong-input');
            $('#number').after('<div class="error">number must start with 9 , 8 or 7.</div>');
            numberValid = false;
        } else {
            $('#number').addClass('right-input');
            $('#number').after('<div class="error"></div>');
            numberValid = true;
        }

        //City name validation
        var cityValida = false;
        if (!cityReg.test(city)) {
             $('#city').addClass('wrong-input');
            $('#city').after('<div class="error">Please enter your City Name.</div>');
            cityValida = false;
        }
        else if (city < 1) {
            $('#city').addClass('wrong-input');
            $('#city').after('<div class="error">Please enter your City Name.</div>');
            cityValida = false;
        } else {
            $('#city').addClass('right-input');
            $('#city').after('<div class="error"></div>');
            cityValida = true;
        }
        if ((nameValid === true) && (numberValid === true) && (cityValida === true)) {
            /*$("#successful").show();
             $("body").css('overflow','hidden');*/
        }
    });

    $(".closebutton").click(function () {
        $("#successful").hide();
        location.reload();
    });
	
	
	var input_city = document.getElementById("city");
var awesomplete = new Awesomplete(input_city, {
	minChars: 1,
	autoFirst: true,
	maxItems: 10,
	replace: function(suggestion) {
		console.log('suggestion', suggestion);
		this.input.value = suggestion.label;
		var Value = suggestion.value.split('+');
		document.getElementById('hdCity_ID').value = suggestion.value.split('+')[0];
		document.getElementById('city').value = suggestion.label;
		document.getElementById('hdPincode').value = suggestion.value.split('+')[1];
		document.getElementById('hdCity_name').value = suggestion.label.split('(')[0];
		var stateName = suggestion.label.split('(')[1];
		stateName = stateName.substring(0, stateName.length - 1);
		document.getElementById('hdState_name').value = stateName.trim();
	}
});
});

function btn_Submit() {
    var name = $("#name").val();
    var cnt_number = $("#number").val();
    var email = $("#email").val();
    var cty = $("#city").val().split("(")[0];
    var state=$("#city").val().split("( ")[1].split(")")[0];
	var panCN = $("#pan").val().toUpperCase();
	var aadhaarCN = $("#aadhaar").val();
    var nameReg = /^[A-Za-z ]+$/;
    var numberReg = /^[0-9]+$/;
    var mailReg = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	var panReg = /[a-zA-Z]{3}[PCHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}$/;
	var aadharReg = /^\d{12}$/;

    var nameChk = false;

    $("#name, #number, #email, #city, #pan, #aadhaar").next().remove();
	
	var ctyId = document.getElementById('hdCity_ID').value;
	
    if (name === null || name === "" || name === undefined) {
        $('#name').addClass('wrong-input');
        $("#name").after('<div class="error">Please Enter Your Name.</div>');
        nameChk = false;
    } else if (!nameReg.test(name)) {
        $('#name').addClass('wrong-input');
        $('#name').after('<div class="error">Name must be in characters only.</div>');
        nameChk = false;
    } else if (name.length <= 2 || name.length > 20) {
        $('#name').addClass('wrong-input');
        $('#name').after('<div class="error">user name must be in between of 3 to 20.</div>');
        nameChk = false;
    } else {
        $('#name').addClass('right-input');
        $("#name").after('<div class="error"></div>');
        nameChk = true;
    }

    var numberChk = false;
    if (cnt_number === null || cnt_number === "" || cnt_number === undefined) {
        $('#number').addClass('wrong-input');
        $('#number').after('<div class="error">Please Enter Your Contact Number.</div>');
        numberChk = false;
    } else if (cnt_number.length != 10) {
        $('#number').addClass('wrong-input');
        $('#number').after('<div class="error">Please Enter 10 Digits Contact Number.</div>');
        numberChk = false;
    } else if ((cnt_number[0] != 9) && (cnt_number[0] != 8) && (cnt_number[0] != 7) && (cnt_number[0] != 6)) {
        $('#number').addClass('wrong-input');
        $('#number').after('<div class="error">number must start with 9 , 8, 7 or 6.</div>');
        numberChk = false;
    } else {
        $('#number').addClass('right-input');
        $('#number').after('<div class="error"></div>');
        numberChk = true;
    }

    var emailChk = false;
    if (email === null || email === "" || email === undefined) {
        $('#email').addClass('wrong-input');
        $("#email").after('<div class="error">Please Enter Your Email Id.</div>');
        emailChk = false;
    } else if (!mailReg.test(email)) {
        $('#email').addClass('wrong-input');
        $('#email').after('<div class="error">Please Enter Valid Email Id.</div>');
        emailChk = false;
    } else {
        $('#email').addClass('right-input');
        $("#email").after('<div class="error"></div>');
        emailChk = true;
    }

    var ctyChk = false;
	if (ctyId === null || ctyId === "" || ctyId === undefined) {
        $('#city').addClass('wrong-input');
        $('#city').after('<div class="error">Please Enter your City Name.</div>');
        ctyChk = false;
    }else if (cty === null || cty === "" || cty === undefined) {
        $('#city').addClass('wrong-input');
        $('#city').after('<div class="error">Please Enter your City Name.</div>');
        ctyChk = false;
    } else {
        $('#city').addClass('right-input');
        $('#city').after('<div class="error"></div>');
        ctyChk = true;
    }
	
	var panchk = false;
	if(panCN === null || panCN === "" || panCN === undefined){
		$('#pan').addClass('right-input');
        $('#pan').after('<div class="error"></div>');
        panchk = true;
	}else{
		if(!panReg.test(panCN)){
			$('#pan').addClass('wrong-input');
			$('#pan').after('<div class="error">Please Enter Valid PAN Card Number.</div>');
			panchk = false;
		}else if (panCN.length != 10) {
			$('#pan').addClass('wrong-input');
			$('#pan').after('<div class="error">Please Enter 10 Digit PAN Card Number.</div>');
			panchk = false;
		}else{
			$('#pan').addClass('right-input');
			$('#pan').after('<div class="error"></div>');
			panchk = true;
		}		
	}
	
	var aadharChk = false;
	if(aadhaarCN === null || aadhaarCN === "" || aadhaarCN === undefined){
		$('#aadhaar').addClass('right-input');
        $('#aadhaar').after('<div class="error"></div>');
        aadharChk = true;
	}else{
		if(!aadharReg.test(aadhaarCN)){
			$('#aadhaar').addClass('wrong-input');
			$('#aadhaar').after('<div class="error">Please Enter Valid Aadhaar Card Number.</div>');
			aadharChk = false;
		}else if (aadhaarCN.length != 12) {
			$('#aadhaar').addClass('wrong-input');
			$('#aadhaar').after('<div class="error">Please Enter 12 Digit Aadhaar Card Number.</div>');
			aadharChk = false;
		}else{
			$('#aadhaar').addClass('right-input');
			$('#aadhaar').after('<div class="error"></div>');
			aadharChk = true;
		}		
	}
	
    if ((nameChk === true) && (numberChk === true) && (emailChk === true) && (ctyChk === true) && (panchk === true) && (aadharChk === true)) {
        var posp_enquiry_Schema = {
            "name": name,
            "mobile": cnt_number,
            "email": email,
            "city_name": cty,
			"city_id":ctyId,
			"pan":panCN,
			"aadhaar":aadhaarCN,
            "state":state
        };

        var obj_horizon_data = Horizon_Method_Convert("/posp_enquiry", posp_enquiry_Schema, "POST");
        $.ajax({
            type: "POST",
            data: siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(posp_enquiry_Schema),
            url: siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/posp_enquiry",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data.Status === "Success") {
                    $("#successful").show();
                    $(".succesTitle").text(data.Msg);
                    $("body").css('overflow', 'hidden');
                } else {
                    $("#successful").show();
                    $(".succesTitle").text(data.Msg);
                    $("body").css('overflow', 'hidden');
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    };
};

function GetUrl() {
    var url = window.location.href;
    var newurl;
    if (url.includes("request_file")) {
		 //newurl = "http://qa-horizon.policyboss.com:3000";
        newurl = "http://localhost:3000";
    } else if (url.includes("qa")) {
        newurl = "http://qa-horizon.policyboss.com:3000";
    } else if (url.includes("www") || url.includes("origin-cdnh") || url.includes("cloudfront")) {
        newurl = "http://horizon.policyboss.com:5000";
    }
    return newurl;
}

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
function cities() {
            $.ajax({
                type: "GET",
                //url: url,
                dataType: "json",
                //data: {'method_name': "/cities/list"},
                data : siteURL.indexOf('https') == 0 ?  { 'method_name': "/cities/city_master_list" } : "",
                url :  siteURL.indexOf('https') == 0 ?   GeteditUrl() + '/TwoWheelerInsurance/call_horizon_get' : GetUrl() + '/' + "cities/city_master_list",
                success: function(data) {
                    for (var i = 0; i < data.length; i++) {
                        cityName.push({
                            label: data[i]["City_Name"] + "( " + data[i]["State_Name"] + ')',
                            value: data[i]["City_ID"] + "+" + data[i]["pincode"]
                        });
                    }
                    awesomplete.list = cityName;
                    console.log(awesomplete._list);
                },
                error: function(result) {
                   
                }
            });
           
        }
		
var input_city = document.getElementById("city");
var awesomplete = new Awesomplete(input_city, {
	minChars: 1,
	autoFirst: true,
	maxItems: 10,
	replace: function(suggestion) {
		console.log('suggestion', suggestion);
		this.input.value = suggestion.label;
		var Value = suggestion.value.split('+');
		document.getElementById('hdCity_ID').value = suggestion.value.split('+')[0];
		document.getElementById('city').value = suggestion.label;
		document.getElementById('hdPincode').value = suggestion.value.split('+')[1];
		document.getElementById('hdCity_name').value = suggestion.label.split('(')[0];
		var stateName = suggestion.label.split('(')[1];
		stateName = stateName.substring(0, stateName.length - 1);
		document.getElementById('hdState_name').value = stateName.trim();
	}
});

function restrictAlphabets(e){
	var x=e.which||e.keycode;
	if(x>=48 && x<=57)
		return true;
	else
		return false;
}

function GeteditUrl() {
	var url = window.location.href;
	var newurl;
	//newurl = "http://qa.policyboss.com";
	if (url.includes("request_file")) {
		newurl = "http://localhost:50111";
	} else if (url.includes("qa")) {
		newurl = "http://qa.policyboss.com";
	} else if (url.includes("www") || url.includes("cloudfront")) {
		newurl = "https://www.policyboss.com";
	}
	return newurl;
}

function CheckCtyVal(){
	document.getElementById('hdCity_ID').value = "";
	document.getElementById('hdCity_name').value = "";
}
