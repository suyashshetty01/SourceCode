var ss_id, fba_id, ip_address, app_version, mac_address, mobile_no, srn, client_id = 2, editmodify, header, sub_fba_id;
var Name, mobile, Email, Salutation;
var siteURL = "";
var si;
var prm_amt, serv_tax;
var srn;
var udid;
var pageIndex = 1;
var pageCount;
var iScrollPos = 0;
var activeTab = "";
var crn;
var first_name = "";
var middle_name = "";
var last_name = "";

$(document).ready(function () {
    siteURL = window.location.href;
    stringparam();
})

function showInput() {
    activeTab = "";
    $('#CoronaCare').show();
    $('#InputPage').show();
	window.location.reload(true);
    $('#Dashboard').hide();
    $('#warning_msg').hide();
    $('.Inputnav').addClass('ActiveItem');
    $('.Dashboardnav').removeClass('ActiveItem');
}

function showDashBoard() {
    $('#warning_msg').hide();
    $('#CoronaCare').hide();
    $('#Dashboard').show();
    $('#quoteId').show();
    $('#applicationId').hide();
    $('#completeId').hide();
    $('.Inputnav').removeClass('ActiveItem');
    get_sentlinkdata();
    activeTab = "SENTLINK";
}
function quoteClick() {
    activeTab = "SENTLINK";
    $('#quoteId').show();
    $('#applicationId').hide();
    $('#completeId').hide();

    $('.Quotenav').addClass('ActivenavItem');
    $('.Applicationnav').removeClass('ActivenavItem');
    $('.Completenav').removeClass('ActivenavItem');
}
function applicationClick() {
    activeTab = "PROPOSAL";
    get_proposaldata();
    $('#quoteId').hide();
    $('#applicationId').show();
    $('#completeId').hide();

    $('.Quotenav').removeClass('ActivenavItem');
    $('.Applicationnav').addClass('ActivenavItem');
    $('.Completenav').removeClass('ActivenavItem');
}
function completeClick() {
    activeTab = "SELL";
    get_selldata();
    $('#quoteId').hide();
    $('#applicationId').hide();
    $('#completeId').show();

    $('.Quotenav').removeClass('ActivenavItem');
    $('.Applicationnav').removeClass('ActivenavItem');
    $('.Completenav').addClass('ActivenavItem');
}
function coverPremium(coveramt, premium) {
    si = coveramt;
    prm_amt = premium;
    //alert(coveramt +',' +premium);
}

function trimValue(event) {
    event.target.value = event.target.value.replace(/\s+/g, ' ');
}
function ValidateNumber(event) {
    if (!(/^[0-9]*$/.test(event.target.value))) {
        event.target.value = "";
    }
}
function KeyPressEvent(event, type) {
    let pattern;
    switch (type) {
        case 'Text':
            pattern = /[a-zA-Z ]/;
            break;
        case 'OnlyText':
            pattern = /[a-zA-Z]/;
            break;
        case 'Number':
            pattern = /[0-9\+\-\ ]/;
            break;
        case 'AlphaNumeric':
            pattern = /[a-zA-Z0-9 ]/;
            break;
        case 'Pincode':
            pattern = /[0-9]/;
            break;
    }
    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) { event.preventDefault(); }
}
function Horizon_Method_Convert(method_action, data, type) {
    var obj_horizon_method = {
        'url': (type === "POST") ? "/TwoWheelerInsurance/call_horizon_post" : "/TwoWheelerInsurance/call_horizon_get?method_name=" + method_action,
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
	//newurl = "http://localhost:3000";
    if (url.includes("request_file")) {
        newurl = "http://localhost:3000";
    } else if (url.includes("qa.")) {
        newurl = url.includes('https') ? "https://qa-horizon.policyboss.com:3443" : "http://qa-horizon.policyboss.com:3000";
    } else if (url.includes("www.") || url.includes("cloudfront") || url.includes("origin-cdnh") || url.includes("policyboss")) {
        newurl = url.includes('https') ? "https://horizon.policyboss.com:5443" : "http://horizon.policyboss.com:5000";
    }
    return newurl;
}
function GeteditUrl() {
    var url = window.location.href;
    var newurl;
	//newurl = "https://qa-www.policyboss.com";
	//newurl = "http://localhost:7000";
    if (url.includes("localhost")) {
        newurl = "http://localhost:7000";
    } else if (url.includes("qa.")) {
        newurl = url.includes('https') ? "https://qa-www.policyboss.com" : "http://qa-www.policyboss.com";
    } else if (url.includes("www.") || url.includes("origin-cdnh") || url.includes("cloudfront")) {
        newurl = url.includes('https') ? "https://www.policyboss.com" : "http://www.policyboss.com";
    }
    return newurl;
}

function paynow() {
    
    var obj = {
        "product_id":19,
        "ss_id": ss_id,
        "fba_id": fba_id,
	"sub_fba_id" : sub_fba_id,
    };
	
	 $('#uploadForm').ajaxSubmit({
	
                data: obj,
                error: function (xhr) {
                    //$('#txt_statusmsg').text(response["Msg"]);
                },
                success: function (response) {
                    console.log(response);
					if(response['Status'] ==="Success"){
						window.location.href = response['URL']
					}
                    
                }
            });
   
	// var obj_horizon_data = Horizon_Method_Convert("/product_share/product_share_url", obj, "POST");
	// $.ajax({
		// type: "POST",
        // data: siteURL.indexOf('https://') === 0 ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(obj),
        // url: siteURL.indexOf('https://') === 0 ? obj_horizon_data['url'] : GetUrl() + "/product_share/product_share_url",
        // contentType: "application/json;charset=utf-8",
		// dataType: "json",
        // success: function (response) {
            // console.log('response', response);   
			// if(response['Status'] ==="Success"){
				// window.location.href = response['URL']
			// }	
        // },
        // error: function (response) {
            // console.log(response);
        // }
    // });
}


function send_payment_link(res) {
    $('.Popup_thank').show();
    console.log(res);
    var sid = res['Summary'].Request_Unique_Id;
    srn = sid.split("_")[0];
    udid = sid.split("_")[1];
    crn = res['Request'].crn;
    //var fname = res['Request'].customer_name.split(" ")[0];
    //var lname = res['Request'].customer_name.split(" ")[1];
    var agent_email = res["Request"]["posp_email_id"];
    var agent_name = res["Request"]["posp_reporting_agent_name"];
    var agent_mobile = res["Request"]["posp_mobile_no"];
    var send_url = GeteditUrl() + "/corp_product_confirm/" + udid;
	let product_id = res['Request'].product_id;
	let objProduct = {
		'13': 'Marine',
		'19': 'WorkmenCompensation',
        '20': 'GroupHealth',
        '21': 'Property',
        '22': 'ProfessionalCA',
        '23': 'ProfessionalDoctors',
        '24': 'SME'
	};
    requestData = {
        "contact_name": res['Request'].customer_name,
		"first_name": first_name,
		"middle_name" : middle_name,
        "last_name": last_name,
        "phone_no": mobile,
	    "mobile": mobile,
        "customer_email": res['Request'].email,
        "agent_name": agent_name,
        "agent_mobile": agent_mobile,
        "agent_email": agent_email,
	    "email" : res['Request'].email,
        "crn": crn,
        "product_name": objProduct[product_id],
        "insurer_name": "ICICI Lombard General Insurance Co. Ltd.",
        "insurer_id": 6,
        "vehicle_text": "",
        "final_premium": 0,
        "payment_link": send_url,
        "search_reference_number": srn,
        "salutation_text": Salutation,
        "insurance_type": "NEW",
        "client_id": 2,
        "api_reference_number": "",
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
        "CustomerReferenceID": crn,
		"product_id": 19,
		"salutation_text" :"MR",
		"source" : "corporate"
    };
    $.ajax({
        type: "POST",
		data: JSON.stringify(requestData),
        url: GetUrl() + "/quote/send_payment_link",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var send_payment_success_id = data['Id']
            $('.Popup_thank').hide();
            if (data.hasOwnProperty('Status')) {
                if (data['Status'] == "Success" || data['Status'] == "SUCCESS") {
                    $('.showCRN').text(crn);
                    $('.successPopup').show();
                    $('.sentLink').show();
                    $('.ErrorLink').hide();
					$('#qrcode-container').show();
					$('.successLinkMsg').html('<span><b>CRN: </b>' + crn + '</span></br><span>Link Send Successfully</span></br><span><a class="payment_link" href="javascript: redirectmethod(`'+ data.Payment_Link +'`)">' + data.Payment_Link + '</a></span>');
					$('#name,#mobile,#email,#product').val("");
                }
                else {
                    $('.showCRN').text(crn);
                    $('.successPopup').show();
                    $('.sentLink').hide();
                    $('.ErrorLink').show();
                }

                console.log("Payment link status", data['Status']);
            }
            else {
                $('.showCRN').text(crn);
                $('.successPopup').show();
                $('.sentLink').hide();
                $('.ErrorLink').show();
            }
        },
        error: function (error) {
            console.log(error);
			 $('.Popup_thank').hide();
        }
    });
}
function hidepopup() {
    pageIndex = 1;
    get_sentlinkdata();
    $('.successPopup').hide();
    $('#warning_msg').hide();
    $('#CoronaCare').hide();
    $('#Dashboard').show();
    $('#quoteId').show();
    $('#applicationId').hide();
    $('#completeId').hide();
    $('.Inputnav').removeClass('ActiveItem');
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
    fba_id = getUrlVars()["fba_id"];
    ip_address = getUrlVars()["ip_address"];
    app_version = getUrlVars()["app_version"];
    mac_address = getUrlVars()["mac_address"];
    sub_fba_id = 0;//getUrlVars()["sub_fba_id"];
    mobile_no = getUrlVars()["mobile_no"];
    if ((fba_id == "" || fba_id == undefined || fba_id == "0" || app_version == "" || app_version == "0" || app_version == undefined || ss_id == "" || ss_id == undefined || ss_id == "0")) {
        $("#InputPage").hide();
        $("#Dashboard").hide();
        $("#warning_msg").show();
		$("#error_query_str").text( window.location.href.split('?')[1]);
    }
}

function get_sentlinkdata() {
    var url = "/user_datas/quicklist/17/SENTLINK/" + ss_id + "/" + fba_id + "/" + pageIndex + "/" + mobile_no + "/" + sub_fba_id;

    $.ajax({
        type: "GET",
        data: siteURL.indexOf('https') == 0 ? { 'method_name': url } : "",
        url: siteURL.indexOf('https') == 0 ? GeteditUrl() + '/TwoWheelerInsurance/call_horizon_get' : GetUrl() + url,
        dataType: "json",
        success: function (data) {
            console.log(data);

            if (data.length > 0) {
                $("#quoteId").empty();
                for (var i in data) {
                    $("#quoteId").append("<div class='CustInfo'>"
                        + "<div class='NameDiv fontWeight'>" + data[i]['Customer_Name'] + "</div>"
                        + "<div class='CrnDiv centerAlign'>CRN NO : <div class='data'>" + data[i]['CRN'] + "</div></div>"
                        + "<div class='CovAmt centerAlign'>COVER AMOUNT<div class='data'>" + data[i]['Sum_Insured'] + "</div>"
                        + "</div></div>");


                }
            }
        },
        error: function (result) {
            console.log(result)
        }
    });
}
function get_proposaldata() {
    var url = "/user_datas/quicklist/17/PROPOSALSUBMIT/" + ss_id + "/" + fba_id + "/" + pageIndex + "/" + mobile_no + "/" + sub_fba_id;

    $.ajax({
        type: "GET",
        data: siteURL.indexOf('https') == 0 ? { 'method_name': url } : "",
        url: siteURL.indexOf('https') == 0 ? GeteditUrl() + '/TwoWheelerInsurance/call_horizon_get' : GetUrl() + url,
        dataType: "json",
        success: function (data) {
            console.log(data);
            if (data.length > 0) {
                $("#applicationId").empty();
                for (var i in data) {
                    $("#applicationId").append("<div class='app_quoteDiv'>"
                        + "<div class='ins_logo'>"
                        + "<img src='images/corona/reliance.png' class='img-responsive' style='width:100%'>"
                        + "</div>"
                        + "<div class='content_container'>"
                        + "<div class='con parta'>"
                        + "<div> </div>"
                        + "<div class='menu' style='display:none;'>"
                        + "<i class='fa fa-info-circle' aria-hidden='true' style='padding:4px 0px;font-size:20px'></i>"
                        + "</div>"
                        + "</div>"
                        + "<div class='con partb'>"
                        + "<div class='app_num'>"
                        + "<div class='title'>APP NUMBER</div>"
                        + "<div class='num'>" + data[i]['CRN'] + "</div>"
                        + "</div><div class='app_status'>"
                        + "<div class='title'>APP STATUS</div>"
                        + "<div class='progress'>"
                        + "<div class='progress-bar' role='progressbar' aria-valuenow='70' aria-valuemin='0' aria-valuemax='100' style='width:" + data[i].Progress + "%'>" + data[i].Progress + "</div>"
                        + "</div>"
                        + "</div>"
                        + "</div>"
                        + "<div class='con partc'>"
                        + "<div class='SUM_a'>"
                        + "<div class='title'>SUM INSURED</div>" + data[i]['Sum_Insured']
                        + "</div>"
                        + "<div class='a_date'>"
                        + "<div class='title'>APP DATE</div>" + data[i]['Quote_Date_Mobile']
                        + "</div>"
                        + "</div>"
                        + "</div>"
                        + "</div>")


                }
            }
        },
        error: function (result) {
            console.log(result)
        }
    });

}
function get_selldata() {
    var url = "/user_datas/quicklist/17/SELL/" + ss_id + "/" + fba_id + "/" + pageIndex + "/" + mobile_no + "/" + sub_fba_id;

    $.ajax({
        type: "GET",
        data: siteURL.indexOf('https') == 0 ? { 'method_name': url } : "",
        url: siteURL.indexOf('https') == 0 ? GeteditUrl() + '/TwoWheelerInsurance/call_horizon_get' : GetUrl() + url,
        dataType: "json",
        success: function (data) {
            console.log(data);
            if (data.length > 0) {
                $("#completeId").empty();
                for (var i in data) {
                    $("#completeId").append("<div class='app_quoteDiv'>"
                        + "<div class='ins_logo'>"
                        + "<img src='images/corona/reliance.png' class='img-responsive' style='width:100%'>"
                        + "</div>"
                        + "<div class='content_container'>"
                        + "<div class='con parta'>"
                        + "<div> </div>"
                        + "<div class='menu' style='display:none;'>"
                        + "<i class='fa fa-info-circle' aria-hidden='true' style='padding:4px 0px;font-size:20px'></i>"
                        + "</div>"
                        + "</div>"
                        + "<div class='con partb'>"
                        + "<div class='app_num'>"
                        + "<div class='title'>APP NUMBER</div>"
                        + "<div class='num'>" + data[i]['CRN'] + "</div>"
                        + "</div><div class='app_status'>"
                        + "<div class='title'>APP STATUS</div>"
                        + "<div class='progress'>"
                        + "<div class='progress-bar' role='progressbar' aria-valuenow='70' aria-valuemin='0' aria-valuemax='100' style='width:" + data[i].Progress + "%'>" + data[i].Progress + "</div>"
                        + "</div>"
                        + "</div>"
                        + "</div>"
                        + "<div class='con partc'>"
                        + "<div class='SUM_a'>"
                        + "<div class='title'>SUM INSURED</div>" + data[i]['Sum_Insured']
                        + "</div>"
                        + "<div class='a_date'>"
                        + "<div class='title'>APP DATE</div>" + data[i]['Quote_Date_Mobile']
                        + "</div>"
                        + "</div>"
                        + "</div>"
                        + "</div>")


                }
            }
        },
        error: function (result) {
            console.log(result)
        }
    });
}
$('ul#myTab li').click(function (e) {

    $('ul#myTab li').removeClass("active");
    $(this).addClass("active");
    var selectedtab = $('ul#myTab li.active').text();

});

$(window).scroll(function () {
    var iCurScrollPos = $(this).scrollTop();
    if (iCurScrollPos > iScrollPos) {
        //Scrolling Down
        if ($(window).scrollTop() == $(document).height() - $(window).height()) {
            //if (!searchFlag) {
            pageIndex++;
            var tab = activeTab;
            if (tab == 'SENTLINK') {
                get_sentlinkdata();
            } else if (tab == 'PROPOSAL') {
                get_proposaldata();
            } else if (tab == 'SELL') {
                get_selldata();
            }
            //}
        }
    }

});
function validate_details(source){
	//console.log(source);
	$("#source_type").val(source);
	let err = 0;
    $(".inpErr").removeClass('ErrorMsg');
    let namePattern = new RegExp('^[a-zA-Z ]+$');
    let mobilePattern = new RegExp('^[6-9]{1}[0-9]{9}$');
    let emailPattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    let name = $("#name").val();
    let mobile = $("#mobile").val();
    let email = $("#email").val();
	let product = $("#product").val();
	    if (name !== '') {
        if (!namePattern.test(name)) {
            $("#name").addClass('ErrorMsg');
            err++;
        } else {
            let namearray = name.split(" ");
            if (namearray[1] === "" || namearray[0] === "" || namearray[1] === undefined) {
                $("#name").addClass('ErrorMsg');
                err++;
            }
        }
		name = name.trim();
		var namearray = name.split(" ");
		for (var i = 2; i < namearray.length; i++) {
			middle_name = namearray[i - 1];
		}
		first_name = name.split(' ')[0];
		last_name = namearray.length == 1 ? "" : namearray[namearray.length - 1];
    }
    if (email !== '' && !emailPattern.test(email)) {
        $("#email").addClass('ErrorMsg');
        err++;
    }
    if (mobile === '' || !mobilePattern.test(mobile)) {
        $("#mobile").addClass('ErrorMsg');
        err++;
    }
	if (product === null || product === "" || product === undefined) {
        $("#product").addClass('ErrorMsg');
        err++;
    }
	if (err === 0) {
		$('.Popup_thank').show();
		let obj = {
			"mobile" : mobile,
			"email" : email,
            "customer_name":name,
			"first_name" : first_name,
			"middle_name" : middle_name,
			"last_name" : last_name,
			"insurer_selected" : "6",
			"city_id" : 677,
			"method_type" : "Premium",
			"execution_async" : "yes",
			"product_id" : parseInt(product),
			"secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
  			"client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
			"ss_id" : ss_id,
			"fba_id" : fba_id,
			"app_version" : "PolicyBoss.com",
			"workmen_insurance_si" : 50000,
			"client_id" : 2,
			"client_name" : "PolicyBoss",
			"udid" : 0,
			"crn" : 0,
			"idv_by_crn" : "yes",
			"source" : "corporate"
		};
		if(source == "PayNow"){
			obj["action"] = "Premium";
		}else if (source == "SendLink"){
			obj["action"] = "Send_payment_link";
		}
		
		//var obj_horizon_data = Horizon_Method_Convert("/quote/premium_initiate", obj, "POST");
		 $.ajax({
			type: "POST",
			data: JSON.stringify(obj),
			url:  GetUrl() + "/quote/premium_initiate",
			contentType: "application/json;charset=utf-8",
			dataType: "json",
			success: function (response) {
				console.log('response', response);
				if(response.Request && response.Summary){
					if(response.Request.crn !== null && response.Request.crn !== "" && response.Summary.Request_Unique_Id !== null && response.Summary.Request_Unique_Id !== ""){
						if($("#source_type").val() == "PayNow"){
							$('.Popup_thank').hide();
							let redirect_url = {
								24 : 'https://www.ilgi.co/23D8ED2D39',
								19 : 'https://www.ilgi.co/3E8E4F7CCA',
								13 : 'https://www.ilgi.co/F93F2A1246',
								20 : 'https://www.ilgi.co/59AF272AE0',
								21 : 'https://www.ilgi.co/6A8845DADE',
								22 : 'https://www.ilgi.co/68751AF891',
								23 : 'https://www.ilgi.co/BFC2982D19'
							};
							$('#qrcode-container').show();
							$('.successLinkMsg').html('<span>Kindly note below CRN number for any future referenace</span><br><br><span><b>CRN: </b>' + response.Request.crn + '</span></br><button type="button" onclick="productRedirect('+ parseInt($("#product").val()) +');">Continue</button>');
						}else if($("#source_type").val() == "SendLink"){
							send_payment_link(response);
						}
					}					
				}
			},
			error: function (response) {
				console.log(response);
				$('.Popup_thank').hide();
			}
		});
	}
}
function productRedirect(product_id) {
	let redirect_url = {
		24 : 'https://www.ilgi.co/23D8ED2D39',
		19 : 'https://www.ilgi.co/3E8E4F7CCA',
		13 : 'https://www.ilgi.co/F93F2A1246',
		20 : 'https://www.ilgi.co/59AF272AE0',
		21 : 'https://www.ilgi.co/6A8845DADE',
		22 : 'https://www.ilgi.co/68751AF891',
		23 : 'https://www.ilgi.co/BFC2982D19'
	};
	if (redirect_url[product_id] !== undefined) {
		window.location.href = redirect_url[product_id];
		$('#name,#mobile,#email,#product').val("");
	}
}
function forceText(e) {
	e.target.value = e.target.value.replace(/[^a-zA-Z ]+/g, '');
	return false;
}
function forceNumeric(e) {
	e.target.value = e.target.value.replace(/[^\d]/g, '');
	return false;
}
function redirectDashboard () {
			var ss_id, fba_id, ip_address, app_version, mac_address, mobile_no;
			ss_id = getUrlVars()['ss_id'] ? getUrlVars()['ss_id'] : '0',
			fba_id =  getUrlVars()['fba_id'] ? getUrlVars()['fba_id'] : '0',
			sub_fba_id =  getUrlVars()['sub_fba_id'] ? getUrlVars()['sub_fba_id'] : '0',
			ip_address = getUrlVars()['ip_address'] ? getUrlVars()['ip_address'] : '',
			mac_address = getUrlVars()['mac_address'] ? getUrlVars()['mac_address'] : '',
			app_version = getUrlVars()['app_version'] ? getUrlVars()['app_version'] : '2.0',
			mobile_no = getUrlVars()['mobile_no'] ? getUrlVars()['mobile_no'] : 9999999999,
			product_id = getUrlVars()['product_id'] ? getUrlVars()['product_id'] : 10,
			window.location.href = "./quote_list.html?ss_id=" + ss_id + '&fba_id=' + fba_id + '&app_version=Policyboss.com';
		}
		
		function redirectmethod(urldata)
		{
			/*$.get(urldata, function() {
				console.log("check");
			});*/
			window.location.href = "//" + urldata;
			
		}