var ss_id, fba_id, ip_address, app_version, mac_address, mobile_no=0, srn, client_id = 2, editmodify, header, sub_fba_id;
var Name, mobile, Email, Salutation;
var siteURL = "";
var si;
var prm_amt, serv_tax;
var srn;
var udid;
var pageIndex = 1;
var pageCount;
var iScrollPos = 0;
var activeTab = "quote";
var crn;
var tab;

$(document).ready(function () {
    siteURL = window.location.href;
    stringparam();
	if(srn == "" || srn == null){
		showDashBoard();
	}
})

function showInput() {
    activeTab = "";
    $('#hospi_dashboard').hide();
    $('#hospi_input').show(); 
   
    $('.Inputnav').addClass('ActiveItem');
    $('.Dashboardnav').removeClass('ActiveItem');
	$('.Information').addClass('ActiveItem');
    $('.Quote').removeClass('ActiveItem');
	$('#Inform').removeClass('display');
	$('#quotes').addClass('display');
	ClearForm();
}

function showDashBoard() {
    $('#warning_msg').hide();
    $('#CoronaCare').hide();
    $('#Dashboard').show();
    $('#quoteId').show();
    $('#applicationId').hide();
    $('#completeId').hide();
    $('.Inputnav').removeClass('ActiveItem');
    GetSearch_data();
    activeTab = "SENTLINK";
}
function quoteClick() {
	pageIndex = 1;
    activeTab = "SENTLINK";
    $('#quoteId').show();
    $('#applicationId').hide();
    $('#completeId').hide();

    $('.Quotenav').addClass('ActivenavItem');
    $('.Applicationnav').removeClass('ActivenavItem');
    $('.Completenav').removeClass('ActivenavItem');
}
function applicationClick() {
	pageIndex = 1;
    activeTab = "PROPOSAL";
    GetApplication();
    $('#quoteId').hide();
    $('#applicationId').show();
    $('#completeId').hide();

    $('.Quotenav').removeClass('ActivenavItem');
    $('.Applicationnav').addClass('ActivenavItem');
    $('.Completenav').removeClass('ActivenavItem');
}
function completeClick() {
	pageIndex = 1;
    activeTab = "SELL";
    GetSell_list();
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
		 //newurl = "http://qa-horizon.policyboss.com:3000";
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

function hidepopup() {
    pageIndex = 1;
    GetSearch_data();
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

function ClearForm(){
	document.getElementById('CoverDays').value = "";
    document.getElementById('mydatepicker').value = "";
    document.getElementById('Name').value = "";
    document.getElementById('mobile').value = "";
    document.getElementById('pincodeId').value ="";
}


function stringparam() {
    ss_id = getUrlVars()["ss_id"];
    fba_id = getUrlVars()["fba_id"];
    ip_address = getUrlVars()["ip_address"];
    app_version = getUrlVars()["app_version"];
    mac_address = getUrlVars()["mac_address"];
    sub_fba_id = 0;//getUrlVars()["sub_fba_id"];
    mobile_no = getUrlVars()["mobile_no"];
	product_id = getUrlVars()["product_id"];
	srn = getUrlVars()["srn"];
	tab = getUrlVars()["tab"];
	
	if(srn !=="" && srn !== null && srn !== undefined){
			$(".warningmsg").hide();
			$('#hospi_dashboard').hide();
			$('#hospi_input').show();
		   if (tab == "input") {
                 getPremiumList(srn);
                 $('#quotes').removeClass('display');
                 $('.Quote').addClass('ActiveItem');
                 $('#Inform').addClass('display');
                 $('#summary').addClass('display');
                 $('.Information').removeClass('ActiveItem');
                 $('.Summary').removeClass('ActiveItem');
             } else {
                 loadInfo(srn);
				 $('#quotes').addClass('display');
				 $('#Inform').addClass('display');
				 $('#summary').removeClass('display');
				 $('.Information').removeClass('ActiveItem');
				 $('.Quote').removeClass('ActiveItem');
                 $('.Summary').addClass('ActiveItem');
             }
	}
    else if ((fba_id == "" || fba_id == undefined || fba_id == "0" || app_version == "" || app_version == "0" || app_version == undefined || ss_id == "" || ss_id == undefined || ss_id == "0")) {
        $("#hospi_maindiv").hide();
        $(".warningmsg").show();
		$("#error_query_str").text( window.location.href.split('?')[1]);
    }else{
		$("#hospi_maindiv").show();
        $(".warningmsg").hide();
	}
}

function GetSearch_data() {
    var url = "/user_datas/quicklist/22/SEARCH/" + ss_id + "/" + fba_id + "/" + pageIndex + "/" + mobile_no + "/" + sub_fba_id;

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
                   
						$("#quoteId").append(" <div class='quoteList_container'><div srn='"+ data[i].SRN +"' class='quoteDiv' id='quote_list_id_'" + data[i].CRN + ">"
														+ "<div class='ApplicantName'>" + data[i].Customer_Name
														+ "<div>CRN:<span class='crn_span'>" + data[i].CRN + "<span></div></div>"
															+ "<div class='si_amt text-center'>"
															+ "<div class='title'>PER DAY SI</div> <div class='desc'>" + data[i].Sum_Insured + "</div>"
														+ "</div>"
														+ "<div class='quote_date text-center'>"
							+ "<div class='title'>QUOTE DATE</div><div class='desc'>" + data[i].Quote_Date_Mobile + "</div> "
						+ "</div>"
											
					+ "</div> </div>");


                }
            }
        },
        error: function (result) {
            console.log(result)
        }
    });
}
 var const_insurerlogo = {
            "21": "Hdfc_Ergo_Health.png",
            "42": "AdityaBirla.png",
            "9": "Reliance_new.png",
            "34": "rhicl.png",
            "26": "star_health.png",
            "38": "Cigna_TTK.png",
            "33": "Liberty.png",
            "6": "ICICI.png",
			"19" : "universal_sompo.png",
			"4" : "Future_Generali_General.png",
			"20" : "Max_Bupa_Health.png",
			"46" : "edelweiss.png",
			"5" : "HDFC.png",
			"35" : "magma_hdi.png"
        };
function GetApplication() {
    var url = "/user_datas/quicklist/22/APPLICATION/" + ss_id + "/" + fba_id + "/" + pageIndex + "/" + mobile_no + "/" + sub_fba_id;

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
                         + "<img src='./Img/InsurerLogo/" + const_insurerlogo[data[i].Insurer] + "' class='img-responsive' style='width:100%;'>"
                        + "</div>"
                        + "<div class='content_container'>"
                        + "<div class='con parta'>"
						 + "<div class='uname'>" + data[i].Customer_Name
                                                            + "</div>"
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
                        + "<div class='title'>PER DAY SI</div>" + data[i]['Sum_Insured']
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
function GetSell_list() {
    var url = "/user_datas/quicklist/22/SELL/" + ss_id + "/" + fba_id + "/" + pageIndex + "/" + mobile_no + "/" + sub_fba_id;

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
                         + "<img src='./Img/InsurerLogo/" + const_insurerlogo[data[i].Insurer] + "' class='img-responsive'>"
                        + "</div>"
                        + "<div class='content_container'>"
                        + "<div class='con parta'>"
						+ "<div class='uname'>" + data[i].Customer_Name
                                                            + "</div>"
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
                        + "<div class='title'>PER DAY SI</div>" + data[i]['Sum_Insured']
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

 function Reload() {
        location.reload(true)
    };