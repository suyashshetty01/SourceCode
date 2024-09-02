    var siteURL = "";
    var geo_lat, geo_long, ss_id, fba_id, ip_address, app_version, mac_address, mobile_no,udid,service_log_id;
    var srn,arn,client_id;
	var MemberResponse =[];
	var CommonResponse= [];
	var StatusCount = 0;
	
    $(document).ready(function () {
        siteURL =  window.location.href;
        stringparam();
        var mydate = new Date();
        var month = mydate.getMonth();
        var day = mydate.getDate();
        var year = mydate.getFullYear();
        var currentyear = new Date().getFullYear();

            //time: false, clearButton: true,
            //format: 'YYYY-MM-DD',
            //maxDate: new Date(new Date().getFullYear()-18, (new Date()).getMonth(), (new Date()).getDate())
		$('.inform_popup_close').on('click', function () {	
			$('.Inform_popup').hide();
		});	
		$('.close_det_popup').on('click', function () {	
			$('.detail_section').hide();
		});	
		$('#statusClosed, .addpopupclose').on('click', function () {	
			$('.StatusPopup').hide();
		});	
    });
	
	function OpenCal(){             
		$('#DOB').datepicker({
				changeYear: true,
				changeMonth: true,
				dateFormat: 'dd-mm-yy',
				yearRange: '1900:-18d',
				defaultDate: '-18yr',
			}).datepicker('show');	
	  }	
	
    var getParameterByName = function(name) {
        var url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    var stringparam = function() {
        mac_address = getParameterByName('mac_address');
        ss_id = getParameterByName('ss_id');
        fba_id = getParameterByName('fba_id');
        ip_address = getParameterByName('ip_address');
        app_version = getParameterByName('app_version');
        if (getParameterByName('mobile_no') == "" || getParameterByName('mobile_no') == null) {
            mobile_no = "";
        } else if((app_version=='FinPeace') && getParameterByName('mobile_no') !="") {
            mobile_no = getParameterByName('mobile_no');
            document.getElementById("Mobile").value = getParameterByName('mobile_no');
        }
        var arr = ["ss_id", "fba_id", "ip_address", "app_version"];
        for (var i = 0; i < arr.length; i++) {
            var qs_val = getParameterByName(arr[i]);
            fba_id = getParameterByName('fba_id');
            ip_address = getParameterByName('ip_address');
            app_version = getParameterByName('app_version');
            if (qs_val == null || qs_val == '' || qs_val == '0') {
                $(".healthmaindiv").hide();
                $(".warningmsg").show();
            }
            else if(app_version=='FinPeace' && (mobile_no=="" || mobile_no == null || mobile_no==0)){
                $(".healthmaindiv").hide();
                $(".warningmsg").show();
            }
            else {

                $(".healthmaindiv").show();
                $(".warningmsg").hide();
            }
        }
    }
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
    var getUrlVars = function() {
        var vars = [],
            hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
    function Horizon_Method_Convert(method_action,data,type){
        var obj_horizon_method = {
            'url': (type=="POST")?"/TwoWheelerInsurance/call_horizon_post":"/TwoWheelerInsurance/call_horizon_get?method_name="+method_action,
            "data":{
                request_json: JSON.stringify(data),
                method_name: method_action,
                client_id:"2"
            }
        };
        return obj_horizon_method;
    }
    function onSubmit1() {

				$('.detail_section').show();
             
    }
	function onSubmit() {
		
        var SubmitErr = 0;
        var insureList = document.getElementById("Insurelist").value;
        var mobile = document.getElementById("mobile").value;
        var policyno = document.getElementById("Policyno").value;
        var Datepicker = document.getElementById("DOB").value;
        var email = document.getElementById('email').value;

        var mobilepattern = new RegExp('^[7-9]{1}[0-9]{9}$');

        if (insureList == '0' || insureList == null) {
            SubmitErr++;
            document.getElementById("insureErr").innerHTML = "Please Select Insurer";
        }else{
			document.getElementById("insureErr").innerHTML = "";
		}

        if (policyno === '') {
            SubmitErr++;
            document.getElementById("policyErr").innerHTML = "Enter Policy Number";
        }
		else{
			document.getElementById("policyErr").innerHTML = "";
		}
		
        if (mobile == '') {
            SubmitErr++;
            document.getElementById("mblErr").innerHTML = "Enter mobile number";
        }
        else {
            if (mobilepattern.test(mobile) === false) {
                SubmitErr++;
                document.getElementById("mblErr").innerHTML = "Enter Correct mobile number";
            }else{
				document.getElementById("mblErr").innerHTML = "";
			}
        }

        if (email == '') {
            document.getElementById("emailErr").innerHTML = "Enter Email Id";
            SubmitErr++;
        }
        else {
            var pattern = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$');
            if (pattern.test(email) == false) {
                document.getElementById("emailErr").innerHTML = "Enter Correct Email Id";
                SubmitErr++;
            }
            else {
                document.getElementById("emailErr").innerHTML = "";
            }
        }


        if (SubmitErr == 0) {
            if(insureList == "34"){
                health_renewal_initiate();
            }else{
                premium_initiate();
            }
        }
    }
    var GetUrl = function() {
        var url = window.location.href;
        var newurl;
        newurl = "http://qa-horizon.policyboss.com:3000";
        if (url.includes("request_file")) {
            newurl = "http://localhost:3000";
        } else if (url.includes("qa")) {
            newurl = "http://qa-horizon.policyboss.com:3000";
        } else if (url.includes("www") || url.includes("cloudfront")) {
            newurl = "http://horizon.policyboss.com:5000";
        }
        return newurl;
    }

    function health_renewal_initiate(){

        $('#loader').show();

        var data = {
            "mobile": document.getElementById("mobile").value,
            "email": document.getElementById('email').value,
            "policy_no": document.getElementById("Policyno").value,
            "prev_insurer_id": document.getElementById("Insurelist").value,
            "insurer_selected": parseInt(document.getElementById("Insurelist").value),
            "birth_date": document.getElementById("DOB").value,
            "city_id": 677,
            "method_type": "Renewal",
            "health_policy_type": "renew",
            "execution_async": "yes",
            "product_id": 2,
            "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
            "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
            "ss_id": ss_id,
            "fba_id": fba_id,
            "ip_address": ip_address,
            "geo_lat": geo_lat,
            "geo_long": geo_long,
            "app_version": app_version

        }
        var obj_horizon_data = Horizon_Method_Convert("/quote/health_renewal_initiate",data,"POST");

        $.ajax({
            type: "POST",
            data : siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) :  JSON.stringify(data),
            url :  siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/health_renewal_initiate" ,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function(response) {
                console.log(response);
                $('.detail_section').show();
				MemberResponse = response['Response']['Premium_Response']['Member_details'];
				CommonResponse = response['Response']['Premium_Response']['Common_details'];
				for(var i in MemberResponse){
				$('.Detailtxt').append('<div class="detailGrid">'
                    +'<div class="title">First Name : <span class="data">'+MemberResponse[i]['first_name']+'</span></div>'
                    +'<div class="title">Last Name : <span class="data">'+MemberResponse[i]['last_name']+'</span></div>'
                    +'<div class="title">Date of Birth : <span class="data">'+MemberResponse[i]['birthdate']+'</span></div>'
					+'<div class="title">Gender : <span class="data">'+MemberResponse[i]['gender']+'</span> </div>'
                +'</div>')
				}
				
				//premium_initiate();
                },
            error: function(result) {
                //alert("Error");
            }
        });

    }

    function premium_initiate(){

        $('#loader').show();

        var data = {
            "mobile": document.getElementById("mobile").value,
            "email": document.getElementById('email').value,
            "policy_no": document.getElementById("Policyno").value,
            "prev_insurer_id": document.getElementById("Insurelist").value,
            "insurer_selected": parseInt(document.getElementById("Insurelist").value),
            "birth_date": document.getElementById("DOB").value,
            "city_id": 677,
            "method_type": "Premium",
            //"method_type": "Renewal",
            "health_policy_type": "renew",
            "execution_async": "yes",
            "product_id": 2,
            "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
            "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
            "ss_id": ss_id,
            "fba_id": fba_id,
            "ip_address": ip_address,
            "geo_lat": geo_lat,
            "geo_long": geo_long,
            "app_version": app_version

        }
		var member_count= 0;
		  if(MemberResponse.length>0){
    for (var i in MemberResponse) {
      var mem = parseInt(i) + 1;
      member_count = this.member_count+1;
      data["member_" + mem + "_first_name"] = MemberResponse[i]['first_name'];
      data["member_" + mem + "_last_name"] = MemberResponse[i]['last_name'];
      data["member_" + mem + "_mobile_number"] = MemberResponse[i]['mobile_number'];
      data["member_" + mem + "_email"] = MemberResponse[i]['email'];
      data["member_" + mem + "_gender"] = MemberResponse[i]['gender'];
      data["member_" + mem + "_age"] = MemberResponse[i]['age'];
      data["member_" + mem + "_customerId"] = MemberResponse[i]['customerId'];
      data["member_" + mem + "_salutation"] = MemberResponse[i]['title'];
      data["member_" + mem + "_birth_date"] = MemberResponse[i]['birthdate'];
      data["member_" + mem + "_relation"] = MemberResponse[i]['relation'];
      data["member_" + mem + "_premanent_address1"] = MemberResponse[i]['premanent_address1'];
      data["member_" + mem + "_premanent_address2"] = MemberResponse[i]['premanent_address2'];
      data["member_" + mem + "_premanent_pincode"] = MemberResponse[i]['premanent_pincode'];
      data["member_" + mem + "_premanent_state"] = MemberResponse[i]['premanent_state'];
      data["member_" + mem + "_premanent_city"] = MemberResponse[i]['premanent_city'];
      data["member_" + mem + "_communication_address1"] = MemberResponse[i]['communication_address1'];
      data["member_" + mem + "_communication_address2"] = MemberResponse[i]['communication_address2'];
      data["member_" + mem + "_communication_pincode"] = MemberResponse[i]['communication_pincode'];
      data["member_" + mem + "_communication_state"] = MemberResponse[i]['communication_state'];
      data["member_" + mem + "_communication_city"] = MemberResponse[i]['communication_city'];
    }
    data['member_count'] = member_count;
  }
 if(CommonResponse != null  || CommonResponse != "" ){
    data['sum_insured'] = CommonResponse['sum_insured'];
    data['health_insurance_type'] = CommonResponse['cover_type'];
    data['prev_policy_expiry_date'] = CommonResponse['prev_policy_expiry_date'];
  }  
		
        var obj_horizon_data = Horizon_Method_Convert("/quote/premium_initiate",data,"POST");

        $.ajax({
            type: "POST",
            data : siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) :  JSON.stringify(data),
            url :  siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/premium_initiate" ,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function(response) {
                console.log(response);
                srn = response['Summary']['Request_Unique_Id'];
                if(srn !== "" || srn !== null){
                
				 StatusCount++;
                        var is_complete = false;
                        if (StatusCount > 5) {
                            is_complete = true;
                            $('#loader').hide();
                            
                            console.log("STOP1");
                          
                        }

                        if (is_complete === false) {
                            setTimeout(() => {
                                //$('#myloader').hide();
                                getQuote();
                            }, 3000);
                        }
				
                //alert(srn);
			}
            },
            error: function(result) {
                //alert("Error");
            }
        });

    }
    function getQuote() {

        var str1 = {
            "search_reference_number": srn,
            "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
            "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9"
        };

        //var returnurl = GetUrl() + '/' + mainUrl;
        var obj_horizon_data = Horizon_Method_Convert("/quote/premium_list_db",str1,"POST");
        $.ajax({
            type: "POST",
            data : siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) :  JSON.stringify(str1),
            url :  siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/premium_list_db" ,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (data) {
			 console.log(data);
                if(data !== "") {
                    $('#loader').hide();
                    var response = data['Response'];
					if(response.length >0){
						udid= data["Summary"]['Request_Core']['udid'];
						client_id = data["Summary"]["Client_Id"];
						arn = response[0]["Service_Log_Unique_Id"];
						service_log_id= response[0]["Service_Log_Id"];
						$('.CRN_No').text(data["Summary"]["PB_CRN"] ==="" ? (data["Summary"]["Request_Core"]["crn"]) : data["Summary"]["PB_CRN"]);
						var premium_breakup = response[0]["Plan_List"][0]["Premium_Breakup"]
						$('.Inform_popup').show();
						$('#Premium').text(premium_breakup['final_premium']);
						$('#Sum_Insured').text(response[0].Insurer_Response.Member_details[0]['upsell_suminsured']);
                    }else{
						$('.StatusPopup').show();
						$('#txt_statusmsg').text("Policy No. / Mobile No. is invalid")
					}
                }
            }
        });
    }
    function BuyNow(){
         window.location.href = GeteditUrl() + "/Health/renewProposal?client_id="+ client_id + "&arn=" + arn + "&is_posp=NonPOSP&ss_id=" + ((app_version == 'FinPeace') ? 0 : ss_id); 				//UAT

        //window.location.href = "http://localhost:4200/renewProposal?client_id=" + client_id + "&arn=" + arn + "&is_posp=NonPOSP&ss_id=" + ((app_version == 'FinPeace') ? 0 : ss_id);				 // local
    }
	
	
	function submitFunc(){
		$('.Inform_popup').show();
	}