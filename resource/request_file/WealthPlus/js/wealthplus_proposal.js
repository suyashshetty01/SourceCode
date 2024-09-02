 var ss_id, search_referenece_no, ARN,SRN, udid, slid, crn, summary, quote_request, response;

        function Get_Search_Summary_Proposal(search_referenece_no) {

            ARN = search_referenece_no.split('_')[0];
            slid = search_referenece_no.split('_')[1];
            udid = search_referenece_no.split('_')[2];
            var objdata = {
                "api_reference_number": ARN,
                "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
                "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
                "slid": slid,
                "udid": udid
            };

            var obj_horizon_data = Horizon_Method_Convert("/quote/api_log_summary", objdata, "POST");
            $.ajax({
                type: "POST",
                data: siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(objdata),
                url: siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/api_log_summary",
                dataType: "json",
                cache: false,
                contentType: 'application/json',
                success: function (Result) {
					
                    console.log(Result);
                    quote_request = Result['Quote_Request'];
                    response = Result['Premium_Response'];
                    summary = Result;
					SRN = Result['Summary']['Request_Unique_Id_Core'];
                    crn = quote_request['crn'];
                    $('.customer_name').text(quote_request['customer_name']);
                    $('.investment_amt').text(quote_request['investment_amount']);
                    $('.gender').text(quote_request['gender']);
                    $('.summaryage').text(quote_request['age'] + " years");
                    $('.summarypremiumpolicyterm').text(quote_request['investment_amount']);
                    $('.summarymobile').text(quote_request['mobile']);
                    $('.summaryemail').text(quote_request['email']);
                    $('.summaryinvestingfor').text(quote_request['investing_for']);
                    $('.summary8percent').text(response['Premium_Breakup']['maturity8']);
                    $('.summary4percent').text(response['Premium_Breakup']['maturity4']);
					$('#dob').val(quote_request['birth_date']);
					$('.frequency').text(quote_request['frequency']);
					$('#frequency').val(quote_request['frequency']);
					$('#insured_fullname').val(quote_request['insured_fullname']);
					$('#insured_birth_date').val(quote_request['insured_birth_date']);
					$('#insured_age').val(quote_request['insured_age']);
					$('#insured_gender').val(quote_request['insured_gender']);
					$('.policy_term').text(quote_request['policy_tenure']+"years")
					
					if(quote_request['investing_for'] !== "myself"){
						$('#summaryLAname').show();
						$('#summaryrelage').show();
						$('.lbl_LArelationname').text(quote_request['investing_for']+"'s name");
						$('.lbl_LArelationage').text(quote_request['investing_for']+"'s age")
						$('.summaryLAname').text(quote_request['insured_fullname']);
						$('.summaryrelage').text(quote_request['insured_age'] + " Year's");
					
					}
                },
                error: function (xhr, status, error) {
                    // console.log('error-' + error);
                },
            });
        }
        function payment_link_send() {

            console.log("payment_link_send");
            var _payLink = "";
            _payLink = "/WealthPlus/wealthplus-proposal.html?ARN=" + search_referenece_no + "&ss_id=0"


            var objdata = {
                "contact_name": $('.customer_name').text(),
                "last_name": $('#ContactLastName').val(),
                "phone_no": $('.summarymobile').text(),
                "customer_email": $('.summaryemail').text(),
                "agent_name": "",
                "agent_mobile": "",
                "agent_email": "",
                "crn": quote_request['crn'],
                "product_name": "Investment",
                "insurer_name": summary.PB_Master.Insurer.Insurer_Name,
                "insurer_id": summary.PB_Master.Insurer.Insurer_ID,
                "vehicle_text": "",
                "final_premium": response['Premium_Breakup']['premium'],
                "payment_link": SetUrl() + _payLink,
                "search_reference_number": summary.Summary.Request_Unique_Id_Core,
                "salutation_text": "",
                "insurance_type": "",
                "client_id": quote_request['client_id'],
                "api_reference_number": summary.Summary.Service_Log_Unique_Id,
                "CustomerReferenceID": $('#CustomerReferenceID').val(),
                "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
                "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9"
            }
            console.log(JSON.stringify(objdata));
            var obj_horizon_data = Horizon_Method_Convert("/quote/send_payment_link", objdata, "POST");
            $.ajax({
                type: "POST",
                data: siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(objdata),
                url: siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/send_payment_link",
                dataType: "json",
                cache: false,
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (response) {
                    console.log(response);
					$('.StatusPopup').show();
					if(response.Status =="SUCCESS"){
						$('#txt_statusmsg').text("Mail sent Successfully.");


					}else{
						$('#txt_statusmsg').text("Mail not sent.");
						$('#txt_statusmsg').css('color','red');
					}
					
				
						
                },
                error: function (request, status, errorThorwn) {
                    console.log(request);
                    console.log(status);
					
					$('#txt_statusmsg').text("Error");
                }
            });
            //$("#CustomerDiv").hide();
            //$("#AgentDiv").show();
        }
        function GetUrl() {
            var url = window.location.href;
            var newurl;
            if (url.includes("Horizon_v1")) {
                newurl = "http://localhost:3000";
            } else if (url.includes("qa")) {
                newurl = "http://qa-horizon.policyboss.com:3000";
            } else if (url.includes("www") || url.includes("cloudfront")) {
                newurl = "http://horizon.policyboss.com:5000";
            }
            return newurl;
        }
		function SetUrl() {
    var url = window.location.href;
    var newurl;
    newurl = "http://qa-horizon.policyboss.com:3000";
    if (url.includes("request_file")) {

        newurl = "http://localhost:50111";
    } else if (url.includes("qa")) {
        newurl = "http://qa.policyboss.com";
    } else if (url.includes("www") || url.includes("origin-cdnh")  || url.includes("cloudfront")) {
        newurl = "https://www.policyboss.com";
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

        var getUrlVars = function () {

            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        }
        function stringparam() {
            ss_id = getUrlVars()["ss_id"];
            search_referenece_no = getUrlVars()["ARN"];
        }
		
function post(path, params, method) {
    if (method.toString().toLowerCase() == 'get' && jQuery.isEmptyObject(params)) {
        window.location.href = path;
		$('.MyLoader').hide();
    }
    else {
        method = method || "post"; // Set method to post by default if not specified.

        // The rest of this code assumes you are not using a library.
        // It can be made less wordy if you use one.
        var form = document.createElement("form");
        form.setAttribute("method", method);
        form.setAttribute("action", path);

        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                var hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", key);
                hiddenField.setAttribute("value", params[key]);
                form.appendChild(hiddenField);
            }
        }

        document.body.appendChild(form);
        form.submit();
    }
};
		
function get_payment_data(arn, count) {
	$('#statusMsg').html('');
    $('#statusMsg').append("Checking Proposal Status...");
    var srn = summary.Summary.Request_Unique_Id_Core;
    var crn = summary.Quote_Request.crn;
    var product_id = summary.Quote_Request.product_id;
	var ClientID = summary.Quote_Request.client_id;
	var objdata = {
      api_reference_number: arn,
	  secret_key: summary.Quote_Request.secret_key,
	  client_key: summary.Quote_Request.client_key
    };
    console.log(JSON.stringify(objdata));
            var obj_horizon_data = Horizon_Method_Convert("/quote/proposal_details", objdata, "POST");
            $.ajax({
                type: "POST",
                data: siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(objdata),
                url: siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/proposal_details",
                dataType: "json",
                cache: false,
                contentType: 'application/json',
                success: function (response) {
                    console.log(response);
					var response_json = response;
        
        if (response_json.Status === 'complete') {
			$('#statusMsg').html('');
			$('#statusMsg').append("Going to payment gateway...");
            
            $('#ProgressStatus').html('');
            $('#ProgressStatus').append("Going to payment gateway ...");
            if (response_json.Error === null) {
                console.log(response_json.Payment);
                console.log(response_json.Payment.pg_data);
                post(response_json.Payment.pg_url, response_json.Payment.pg_data, response_json.Payment.pg_redirect_mode);
                /*
                window.location.href = response_json.Payment.proposal_confirm_url;
                */
                //if (window.location.hasOwnProperty('host') && (window.location.host === "www.policyboss.com")) {
                //    if (summary.Quote_Request.ss_id === "7582") {
                //    window.location.href = response_json.Payment.proposal_confirm_url;
                //} else {
                    
                //    post(response_json.Payment.pg_url, response_json.Payment.pg_data, response_json.Payment.pg_redirect_mode);
                //}
                //} else {
                //    window.location.href = response_json.Payment.proposal_confirm_url;
                //}
            }
            else {
                $('.spinner').hide();
                //proposalError();
                $('#AlertMsg').show();
                $('#ProgressStatus').html('');
                $('#ProgressStatus').append("Cannot Proceed Now !<br/>Error:" + response_json.Error.Error_Specific);
                $('#Hidepopup').show();
            }
        }
        else if (count > 0) {
            setTimeout(function () {
                get_payment_data(arn, count--);
            }, 2000);
        }
        else {
            $('.spinner').hide();
            proposalError();
            $('#AlertMsg').show();
            $('#ProgressStatus').html('');
            $('#ProgressStatus').append("Technical Issue ! Cannot Proceed Now !");
            $('#Hidepopup').show();
        }


                },
                error: function (request, status, errorThorwn) {
                    console.log(request);
                    console.log(status);
                }
            });
}

		
        function getproposal() {
            $('.MyLoader').show();
			$('#statusMsg').html('');
            $('#statusMsg').append("Proposal Initiate ...");
			var name = ($('.customer_name').text()).split(' ');
			var  middlename ="";
			for (var i = 2; i < name.length; i++){
				middlename = middlename + name[i - 1];
			}
			var firstname = $('.customer_name').text().split(' ')[0];
			var lastname=name.length == 1 ? "" : name[name.length - 1];
	
            var objdata =
            {
                "product_id": "5",
                "method_type": "Proposal",
                "execution_async": "yes",
                "first_name": firstname,
                "mobile": $('.summarymobile').text(),
                "email": $('.summaryemail').text(),
                "middle_name": middlename,
                "last_name": lastname,
                "birth_date": $('#dob').val(),
                "gender": $('.gender').text(),
                "age": $('.summaryage').text(),
				"insurer_id": summary.PB_Master.Insurer.Insurer_ID,
                "insured_fullname": $('#insured_fullname').val(),
                "insured_birth_date": $('#insured_birth_date').val(),
                "insured_age": $('#insured_age').val(),
                "insured_gender": $('#insured_gender').val(),
                "frequency": $('#frequency').val(),
                "investment_amount": parseInt($('.summarypremiumpolicyterm').text()),
                "investing_for": $('.summaryinvestingfor').text(),
				"final_premium" : parseInt($('.summarypremiumpolicyterm').text()),
                "crn": crn,
                "ss_id": ss_id,
                "client_id": "2",
                "fba_id": "0",
                "agent_source": "",
                "app_version": "PolicyBoss.com",
                "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
                "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
                "policy_tenure": $('.policy_term').text(),
                "client_name": "PolicyBoss",
                "search_reference_number": SRN,
                "api_reference_number": ARN,
                "slid": slid,
                "udid": udid
            };

            var obj_horizon_data = Horizon_Method_Convert("/quote/proposal_initiate", objdata, "POST");
            $.ajax({
                type: "POST",
                data: siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(objdata),
                url: siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/proposal_initiate",
                dataType: "json",
                cache: false,
                contentType: 'application/json',
                success: function (Result) {

                console.log(Result);
					var arn = Result.Service_Log_Unique_Id;
                        var res = {};
                        console.log('proposal_initate Result', Result);
                        if (Result.hasOwnProperty('Service_Log_Unique_Id') && arn.includes('-')) {
                            var max_count = 150;
                            setTimeout(function () {
                                get_payment_data(arn, max_count);
                            }, 1000);
                        }
                //Get_Search_Summary_Proposal(search_referenece_no)
                },
                error: function (xhr, status, error) {
                    // console.log('error-' + error);
                },
            });


        }
        /* Document Ready */
        $(function () {
            siteURL = window.location.href;
            stringparam();
            Get_Search_Summary_Proposal(search_referenece_no);

            if (ss_id > 0) {
				$('#PaymentLink').val('Send Payment Link');
            } else {
                $('#PaymentLink').val('Proceed');
            }

            $('#PaymentLink').on('click', function (event) {
                var value = this.value;
                if (value == "Proceed") {
					getproposal();
                } else {
					payment_link_send();
                }

            });
			$('#statusClosed').on('click',function(event){
				$('.StatusPopup').hide();
				
        window.location.href = './dashboard_list.html?ss_id=' + quote_request['ss_id'] + '&fba_id=' + quote_request['fba_id'] +'&ip_address=' + quote_request['ip_address'] + '&mac_address=' + quote_request['mac_address'] + '&app_version=' + quote_request['app_version'] ;
			})
        });
		
		