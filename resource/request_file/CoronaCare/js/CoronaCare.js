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

function paynow() {
    
    var obj = {
        "product_id":17,
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
    $('#loader').show();
    console.log(res);
    var sid = res['Summary'].Request_Unique_Id;
    srn = sid.split("_")[0];
    udid = sid.split("_")[1];
    crn = res['Request'].crn;
    var fname = Name.split(" ")[0];
    var lname = Name.split(" ")[1];
    var agent_email = res["Request"]["posp_email_id"];
    var agent_name = res["Request"]["posp_reporting_agent_name"];
    var agent_mobile = res["Request"]["posp_mobile_no"];
    var send_url = GeteditUrl() + "/corona_proposal-confirm.php?SID=" + sid;
    requestData = {
        "contact_name": fname,
        "last_name": lname,
        "phone_no": mobile,
        "customer_email": Email,
        "agent_name": agent_name,
        "agent_mobile": agent_mobile,
        "agent_email": agent_email,
        "crn": crn,
        "product_name": "CoronaCare",
        "insurer_name": "Go Digit General Insurance Limited",
        "insurer_id": 44,
        "vehicle_text": "",
        "final_premium": Math.round(prm_amt + serv_tax),
        "payment_link": send_url,
        "search_reference_number": srn,
        "salutation_text": Salutation,
        "insurance_type": "NEW",
        "client_id": 2,
        "api_reference_number": "",
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
        "CustomerReferenceID": crn
    };
    var obj_horizon_data = Horizon_Method_Convert("/quote/send_payment_link", requestData, "POST");
    $.ajax({
        type: "POST",
        data: siteURL.indexOf('https://') === 0 ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(requestData),
        url: siteURL.indexOf('https://') === 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/send_payment_link",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            // console.log(data);
            var send_payment_success_id = data['Id']
            $('#loader').hide();
            if (data.hasOwnProperty('Status')) {
                if (data['Status'] == "Success" || data['Status'] == "SUCCESS") {
                    $('.showCRN').text(crn);
                    $('.successPopup').show();
                    $('.sentLink').show();
                    $('.ErrorLink').hide();
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