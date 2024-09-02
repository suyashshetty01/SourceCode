var sync_contact_id;
var siteURL = window.location.href;
$(document).ready(function () {
    $.getJSON("https://api.ipify.org?format=json",
            function (data) {

                // Setting text of element P with id gfg 
                $("#gfg").html(data.ip);
            });
							//$(".container").addClass('center');
							//$(".message").show();
                            //$(".contain").hide();
                            //$("body").css('overflow', 'hidden');
    $('#myForm').submit(function (e) {
        e.preventDefault();
        var username = $('#username').val();
        var number = $('#number').val();
        var email = $('#email').val();
        var carNumber = $('#vehicleNumber').val();

        var nameReg = /^[a-zA-Z ]*$/;
        var numberReg = /^[0-9]+$/;
        var mailReg = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;


        $(".error").remove();
        //Vehicle Number Validation
        var carNumberValid = false;
        if (carNumber < 1) {
            $('.inputGrid').addClass('wrong-input');
            $('.inputGrid').after('<div class="error">Please Enter a Value</div>');
            carNumberValid = false;
        } else {
            $('.inputGrid').addClass('right-input');
            $('.inputGrid').after('<div class="error"></div>');
            carNumberValid = true;
        }

        //Username validation
        var nameValid = false;
        if (username < 1) {
            $('#username').addClass('wrong-input');
            $("#username").after('<div class="error">Please Enter Your Name</div>');
            nameValid = false;
        } else if (!nameReg.test(username)) {
            $('#username').addClass('wrong-input');
            $('#username').after('<div class="error">Name must be in characters only</div>');
            nameValid = false;
        } else if (username.length <= 2 || username.length > 20) {
            $('#username').addClass('wrong-input');
            $('#username').after('<div class="error">user name must be in between of 3 to 20</div>');
            nameValid = false;
        } else {
            $('#username').addClass('right-input');
            $('#username').after('<div class="error"></div>');
            nameValid = true;
        }

        //Phone number validation
        var numberValid = false;
        if (number < 1) {
            $('#number').addClass('wrong-input');
            $('#number').after('<div class="error">Please Enter Your Contact Number</div>');
            numberValid = false;
        } else if (!numberReg.test(number)) {
            console.log("numeric");
            $('#number').addClass('wrong-input');
            $('#number').after('<div class="error">Please Enter Numbers Only</div>');
            numberValid = false;
        } else if (number.length != 10) {
            $('#number').addClass('wrong-input');
            $('#number').after('<div class="error">Please Enter 10 Digits Contact Number</div>');
            numberValid = false;
        } else if ((number[0] != 9) && (number[0] != 8) && (number[0] != 7)&& (number[0] != 6)) {
            $('#number').addClass('wrong-input');
            $('#number').after('<div class="error">number must start with 9 , 8, 7 or 6</div>');
            numberValid = false;
        } else {
            $('#number').addClass('right-input');
            $('#number').after('<div class="error"></div>');
            numberValid = true;
        }

        //email validation
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

        console.log(nameValid);
        console.log(numberValid);
        console.log(emailValid);
        if ((nameValid === true) && (numberValid === true) && (emailValid === true) && (carNumberValid === true)) {
            //$(".container").addClass('center');
            //$(".message").show();
            //$(".contain").hide();
            //$("body").css('overflow','hidden');
            submit_rsa_data(carNumber, username, number, email);
        }

    });
////////////////////////////////////////
    sync_contact_id = getUrlVars()["sync_contact_id"];
//var ipAddress = $_SERVER[‘REMOTE_ADDR’];
    if (sync_contact_id !== null && sync_contact_id !== "" && sync_contact_id !== undefined) {
        $.getJSON("https://api.ipify.org?format=json", function (data) {
            if (data.ip) {
                $("#gfg").html(data.ip);
				$.ajax({
                    type: "GET",
                    url: siteURL.indexOf('https://') === 0 ? GeteditUrl() + "/TwoWheelerInsurance/call_horizon_get?method_name=/sync_contacts/rsa?sync_contact_id=" + sync_contact_id + "&ip_address=" + data.ip : GetUrl() + "/sync_contacts/rsa?sync_contact_id=" + sync_contact_id + "&ip_address=" + data.ip,
                    success: function (data) {
						$(".loader").hide();
						if (typeof data === 'string' || data instanceof String){
							data = JSON.parse(data);
						}
                        console.log(data);
                        if (data.err === 0 && data.mobileno > 0) {
                            $(".mobileno").val(data.mobileno);
                        } else {
							if (data.err === 3){
							$(".container").addClass('center');
							$(".SuccessfulMsg").hide();
							$(".message").show();
							$(".FailedMsg").show();
                            $(".contain").hide();
                            $("body").css('overflow', 'hidden');
							}
							else {
								alert("Oops! Something went wrong.");
							}
                        }

                    },
                    error: function (error) {
						$(".loader").hide();
                        console.log(error);
                        alert("Oops! Something went wrong.");

                    }
                });
                // Setting text of element P with id gfg 
            } else {
				$(".loader").hide();
                alert("Getting Error in Fetching IP Address");
            }
        });
    } else {
		$(".loader").hide();
        alert("Please ensure that Sync Contact Id is proper");
    }


});
function GeteditUrl() {
    var url = window.location.href;
    //alert(url.includes("health"));
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
function submit_rsa_data(carNumber, username, number, email) {
	$(".loader").show();
    $.getJSON("https://ipinfo.io", function (data) {
        if (data.ip) {
            //$("#gfg").html(data.ip);
            var obj = {
                "sync_contact_id": sync_contact_id,
                "ip_address": data.ip,
                "reg_no": carNumber,
                "name": username,
                "mobile_no": number,
                "email": email,
                "state_city": data.region.replace(/ /g, '-') + "_" + data.city.replace(/ /g, '-')
            };
            console.log(obj);
			var url = window.location.href;
			if (url.includes("www") || url.includes("cloudfront") || url.includes("origin-cdnh")) {
				var obj_horizon_data = Horizon_Method_Convert("/sync_contacts/rsa_data", obj, "POST");
			} else {
				var obj_horizon_data = Horizon_Method_Convert("/postservicecall/rsa_data", obj, "POST");
			}
            $.ajax({
                //type: "GET",
                //url: siteURL.indexOf('https://') === 0 ? GeteditUrl() + "/TwoWheelerInsurance/call_horizon_get?method_name=/sync_contacts/rsa_data?sync_contact_id=" + sync_contact_id +"&ip_address="+ data.ip+"&reg_no="+ carNumber+"&name="+ username+"&mobile_no="+ number+"&email="+ email+"&state_city="+ data.region.replace(/ /g,'-')+"_"+data.city.replace(/ /g,'-'): GetUrl() + "/sync_contacts/rsa_data?sync_contact_id=" + sync_contact_id +"&ip_address="+ data.ip+"&reg_no="+ carNumber+"&name="+ username+"&mobile_no="+ number+"&email="+ email+"&state_city="+ data.region.replace(/ /g,'-')+"_"+data.city.replace(/ /g,'-'),
                type: "POST",
                data: window.location.href.indexOf('https') === 0 ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(obj),
                url: window.location.href.indexOf('https') === 0 ? obj_horizon_data['url'] : GetUrl() + "/postservicecall/rsa_data",
                dataType: "json",
                traditional: true,
                contentType: "application/json; charset=utf-8",
                success: function (data) {
					$(".loader").hide();
                    console.log(data);
                    if (data.err === 0 && data.rsa_response) {
                        if (data.rsa_response.status === "Success") {
                            $("#CertificateNo").text(data.rsa_response.CertificateNo);
							$("#CertificateURL").attr("href", data.rsa_response.CertificateFile);
                            $(".container").addClass('center');
							$(".SuccessfulMsg").show();
							$(".message").show();
							$(".FailedMsg").hide();
                            $(".contain").hide();
                            $("body").css('overflow', 'hidden');
                        } else {
                            alert("TransactionID - " + data.rsa_response.TransactionID + "ErrorMessage - " + data.rsa_response.ErrorMessage);
                        }

                    } else {
						alert("TransactionID - " + data.rsa_response.TransactionID + "ErrorMessage - " + data.rsa_response.ErrorMessage);
                    }

                },
                error: function (error) {
					$(".loader").hide();
                    console.log(error);
                    alert("Oops! Something went wrong.");

                }
            });
            // Setting text of element P with id gfg 
        } else {
			$(".loader").hide();
            alert("Getting Error in Fetching IP Address");
        }
    });
}
;
function Horizon_Method_Convert(method_action, data, type) {
    var obj_horizon_method = {
        'url': (type === "POST") ? "/horizon-method.php" : "/horizon-method.php?method_name=" + method_action,
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
    } else if (url.includes("www") || url.includes("cloudfront") || url.includes("origin-cdnh")) {
        newurl = "http://horizon.policyboss.com:5000";
    }
    return newurl;
}
var getUrlVars = function () {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        if (hashes[i].includes("?"))
        {
            hashes1 = hashes[i].split('?');
            for (var k in hashes1) {
                hashes.push(hashes1[k]);
            }
        }
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
};