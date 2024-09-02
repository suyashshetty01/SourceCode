var ss_id, fba_id, ip_address, app_version, mac_address, mobile_no;
var pageIndex = 1;
var pageCount;
var iScrollPos = 0;
var isSearchCheck = false;
var quoteSearch_url = "";
var appSearch_url = "";
var sellSearch_url = "";
var method_name = "";
var siteURL = "";

function Reset() {

    $('#tbl_quote_list').empty();
    $('.app_mainlist').empty();
    $('.sellDiv').empty();
    quoteSearch_url = "";
    appSearch_url = "";
    sellSearch_url = "";
    GetQuoteList();
    GetApplication();
    GetSellList();
}
$(document).ready(function () {
	siteURL =  window.location.href;
    stringparam();
    GetQuoteList();
    GetApplication();
    GetSellList();
    $("#SearchQuote").val(0);
    $("#SearchQuoteInput").hide();

    $('ul.qlist li').click(function (e) {
        $("#SearchQuote").val(0);
        $("#SearchQuoteInput").hide();
        //Reset();

        $('ul.qlist li').removeClass("Active");
        $(this).addClass("Active");

        if ($('li.Active').text() == 'APPLICATIONS') {
            $(".quoteList_container").hide();
            $(".appquote_list").show();
            $(".motor_maindiv").children('.menuBox').hide();
            $(".sell_list").hide();

            $('.app_mainlist').empty();
            appSearch_url = "";
            GetApplication();

        } else if ($('li.Active').text() == 'QUOTE') {

            $(".quoteList_container").show();
            $(".appquote_list").hide();
            $(".appquote_list").children('.menuBox').hide();
            $('qlist').removeClass('Active');
            $(".sell_list").hide();

            $('#tbl_quote_list').empty();
            quoteSearch_url = "";
            GetQuoteList();
        }
        else if ($('li.Active').text() == 'COMPLETE') {
            $(".quoteList_container").hide();
            $(".appquote_list").hide();
            $(".sell_list").show();
            $('qlist').removeClass('Active');

            $('.sellDiv').empty();
            sellSearch_url = "";
            GetSellList();
        }

    });
    $('#infopopupClose').on('click', function () {

        $('#infoPopup').hide();
        $('.sticky_btn').show();
    })
});

function GetUrl() {
    var url = window.location.href;
    //alert(url.includes("health"));
    var newurl;
    //newurl = "http://qa-horizon.policyboss.com:3000";
    if (url.includes("request_file")) {
        //newurl = "http://qa-horizon.policyboss.com:3000";
        newurl = "http://localhost:3000";
        //newurl="http://localhost:50111";
    } else if (url.includes("qa")) {
        newurl = "http://qa-horizon.policyboss.com:3000";
    } else if (url.includes("www") || url.includes("cloudfront")) {
        newurl = "http://horizon.policyboss.com:5000";
    }
    return newurl;
}

function activeTab() {

    var activetab;
    if ($('li.Active').text() == 'QUOTE') {
        activetab = "SEARCH"
    } else if ($('li.Active').text() == 'APPLICATIONS') {
        activetab = "APPLICATION"
    } else if ($('li.Active').text() == 'COMPLETE') {
        activetab = "SELL"
    }

    return activetab
}

function GetQuoteList() {
    //
    var url;
    if (quoteSearch_url == "") {
        url = GetUrl() + "/user_datas/quicklist/1/SEARCH/" + ss_id + "/" + fba_id + "/" + pageIndex + "/" + mobile_no;
        method_name = "/user_datas/quicklist/1/SEARCH/" + ss_id + "/" + fba_id + "/" + pageIndex + "/" + mobile_no;

    } else {
        // url = quoteSearch_url;
        method_name = quoteSearch_url;
    }


    $.ajax({
        type: "GET",
        //url: url,
        //data: { 'method_name': method_name },			//UAT
        //url: GeteditUrl() + '/TwoWheelerInsurance/call_horizon_get',
		data : siteURL.indexOf('https') == 0 ?  { 'method_name': method_name } : "",
		url :  siteURL.indexOf('https') == 0 ?   GeteditUrl() + '/TwoWheelerInsurance/call_horizon_get' : url,
        dataType: "json",
        success: function (data) {
            console.log(data);
			if(data.length >0){
            for (var i in data) {
                $('#tbl_quote_list').append('<tr class="quoteDiv" id="tr_lst" srn="' + data[i].SRN + '" udid="' + data[i].User_Data_Id + '">' +
                    '<td><div class="ApplicantName">' + data[i].Customer_Name + '</div>' +
                    '<div class="ApplicantName">CRN:<span class="crn_span">' + data[i].CRN + '</div>' +
                    '</td>' +

                    '<td><div class="title">QUOTE DATE</div><div class="desc quote_date">' + data[i].Quote_Date_Mobile + '</div></td>' +
                    '<td class="" style="text-align:center" id="Infopopup">' +
                  '<i class="fa fa-info-circle" id="info_' + data[i].SRN + '" aria-hidden="true" style="padding:10px 0px;font-size:20px"></i>' +
                  '</td>' +
                    '<td style="text-align:right"><span class="glyphicon glyphicon-option-vertical mb" style="padding-top:10px;font-size:20px;visibility:hidden"></span></td>' +
                    '</tr>'
                )
                $('#info_' + data[i].SRN).click(function (e) {
                    var SRN = $(this).parent().parent().attr('srn');
                    SRN = SRN.split('_')[0];
                    vehicleinfo(SRN);
                });
                var $menubox = $(".motor_maindiv").children('.menuBox')
                $(".mb").click(function (e) {
                    var mbtoppos = $(this).position().top + (-13) + "px";
                    //console.log(mbtoppos);
                    if ($menubox.is(":visible")) {

                        $menubox.hide()
                        $menubox.slideDown();
                    }
                    $menubox.slideDown().css({ "top": mbtoppos });
                });
                $(".ApplicantName,.si_amt,.quote_date").click(function (e) {

                    var SRN = $(this).parent().parent().attr('srn');
                    var udid = $(this).parent().parent().attr('udid');
                    window.location.href = './quotepage.html?SRN=' + SRN + '&client_id=2';

                });
                $("#CallFuncId").click(function (e) {

                    //$('a[href*="tel:+91"]' + data[i].Customer_Mobil);
                    $(".CallFuncClass").attr('href', 'tel:' + data[i].Customer_Mobile);
                });

                $("#SmsFuncId").click(function (e) {

                    //$('a[href*="tel:+91"]' + data[i].Customer_Mobil);
                    $(".SmsFuncClass").attr('href', 'sms:' + data[i].Customer_Mobile);
                });

            }
			}else{
				$('#tbl_quote_list').append("<div style ='text-align:center;font-weight: bold;font-size: 18px;'>No Record found</div>")
			}

        },
        error: function (result) {

        }
    });

}

// '<td style="width:21%"><div class="ApplicantName" style="align:center">IDV</div> <div  class="IDV">' + data[i].Sum_Insured + ' </div> </td>' +
// '<td style="width:32%"><div class=""><div class="ApplicantName">Make & Model</div><div class="make_model">BAJAJ PULSAR 180 CC</div></div></td>' +  

function GeteditUrl() {
    var url = window.location.href;
    //alert(url.includes("health"));
    var newurl;
    newurl = "http://qa.policyboss.com";
    if (url.includes("Horizon_v1")) {
        newurl = "http://localhost:3000";
    } else if (url.includes("qa")) {
        newurl = "http://qa.policyboss.com";
    } else if (url.includes("www") || url.includes("cloudfront")) {
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





// Get Application Data 
function GetApplication() {
    var const_insurerlogo = {
        "21": "apollo_munich.png",
        "42": "aditya_birla.png",
        "9": "Reliance_new.png",
        "34": "religare_health.png",
        "26": "star_health.png",
        "38": "Cigna.png",
        "33": "Liberty.png",
        "6": "ICICI.png",
        "12": "NewIndia.png",
        "44": "digit.png",
        "45": "Acko_General.png",
        "19": "Universal.png",
        "1": "bajaj-allianz.png",
        "4": "Future.png",
        "7": "Iffco.png",
        "10": "Royal.png",
        "11": "TataAIG.png",
        "5": "HDFC.png",
        "14": "United.png",
        "2": "BharatiAxa.png",
        "47": "edelweiss.png",
        "41": "Kotak.png",
        "35": "magma.png",
        "13": "Oriental.png"

    };

    var url;
    if (appSearch_url == "") {
        method_name = "/user_datas/quicklist/1/APPLICATION/" + ss_id + "/" + fba_id + "/" + pageIndex + "/" + mobile_no;
        url = GetUrl()+"/user_datas/quicklist/1/APPLICATION/" + ss_id + "/" + fba_id + "/" + pageIndex + "/" + mobile_no;
    } else {
        method_name = appSearch_url;
    }

    //var url = GetUrl()+"/user_datas/quicklist/1/APPLICATION/" + ss_id + "/" + fba_id + "/" + pageIndex + "/" + mobile_no
    // "<div class='menu'><span class='glyphicon glyphicon-option-vertical amb' style='visibility:hidden'></span>" + "</div>" +
    $.ajax({
        type: "GET",
        //url: url,
        //data: { 'method_name': method_name },			//UAT
        //url: GeteditUrl() + '/TwoWheelerInsurance/call_horizon_get',
		data : siteURL.indexOf('https') == 0 ?  { 'method_name': method_name } : "",
		url :  siteURL.indexOf('https') == 0 ?   GeteditUrl() + '/TwoWheelerInsurance/call_horizon_get' : url,
        dataType: "json",
        success: function (data) {
            console.log(data);
			if(data.length >0){
            for (var i in data) {
                $(".app_mainlist").append("<div class='app_quoteDiv' srn='" + data[i].SRN + "' arn='" + data[i].ARN + "' slid='" + data[i].SL_ID + "' udid='" + data[i].udid + "' id='app_quote_id'" + data[i].CRN + ">"
                + "<div class='ins_logo'>"
                      + "<img src='./images/InsurerLogo/" + const_insurerlogo[data[i].Insurer] + "' class='img-responsive'>"
                      + "</div>"
                + "<div class='content_container'>"
                      + "<div class='con parta'>"
                      + "<div class='uname'>" + data[i].Customer_Name + "</div>"
                      + "<div class='menu proposal_redirect' style='text-align:right'><button type='button' class='gotopay'>Go to Proposal</button></div>"
                      + "<div class='menu' id='app_info_" + data[i].SRN + "'><i class='fa fa-info-circle'  aria-hidden='true' style='padding:10px 0px;font-size:20px'></i></div>"

                      + "</div>" + "<div class='con partb'>" + "<div class='app_num'>" + "<div class='title'>APP NUMBER</div>" + "<div class='num'>" + data[i].CRN + "</div>" + "</div>" + "<div class='app_status'>" + "<div class='title'>APP STATUS</div>" + "<div class='progress'>" + "<div class='progress-bar' role='progressbar' aria-valuenow='70' aria-valuemin='0' aria-valuemax='100' style='width:" + data[i].Progress + "%'>" + data[i].Progress + "</div>" + "</div>" + "</div>" + "</div>" + "<div class='con partc'>" + "<div class='SUM_a'>" + "<div class='title'>IDV</div>" + data[i].Sum_Insured + "</div>" + "<div class='a_date'>" + "<div class='title'>APP DATE</div>" + data[i].Quote_Date_Mobile + "</div>" + "</div>" + "<input type='hidden' id='hd_app_SRN' value='" + data[i].SRN + "'/>" + "<input type='hidden' id='hd_app_Insurer' value='" + data[i].Insurer + "'/>" + "</div>" + "</div>");
                $(".amb").click(function (e) {

                    var mbtoppos = $(this).position().top + "px";
                    //console.log(mbtoppos);
                    var $menubox = $(".appquote_list").children('.menuBox')
                    if ($menubox.is(":visible")) {

                        $menubox.hide()
                        $menubox.slideDown()
                    }
                    $menubox.slideDown().css({
                        "top": mbtoppos,

                    });
                });

                $('#app_info_' + data[i].SRN).click(function (e) {

                    var SRN = $(this).parent().parent().parent().attr('SRN');
                    SRN = SRN.split('_')[0];
                    vehicleinfo(SRN);
                });

                $(".proposal_redirect").click(function (e) {
                   
                    if (app_version == "FinPeace") {
                        var Service_Log_Unique_Id = $(this).parent().parent().parent().attr('ARN') + '_' + $(this).parent().parent().parent().attr('slid') + '_' + $(this).parent().parent().parent().attr('udid');
                        window.location.href = GeteditUrl() + "/car-insurance/buynow/2/" + Service_Log_Unique_Id + "/NonPOSP/" + ((app_version == 'FinPeace') ? 0 : ss_id);
                    }
                });


            }
			}else{
				$('.app_mainlist').append("<div style ='text-align:center;font-weight: bold;font-size: 18px;'>No Record found</div>")
			}
        },
        error: function (result) {
            console.log(result)
        }
    });

}

function GetSellList() {


    var const_insurerlogo = {
        "21": "apollo_munich.png",
        "42": "aditya_birla.png",
        "9": "Reliance_new.png",
        "34": "religare_health.png",
        "26": "star_health.png",
        "38": "Cigna.png",
        "33": "Liberty.png",
        "6": "ICICI.png",
        "12": "NewIndia.png",
        "44": "digit.png",
        "45": "Acko_General.png",
        "19": "Universal.png",
        "1": "bajaj-allianz.png",
        "4": "Future.png",
        "7": "Iffco.png",
        "10": "Royal.png",
        "11": "TataAIG.png",
        "5": "HDFC.png",
        "14": "United.png",
        "2": "BharatiAxa.png",
        "47": "edelweiss.png",
        "41": "Kotak.png",
        "35": "magma.png",
        "13": "Oriental.png"

    };

    var url;
    if (sellSearch_url == "") {
        url = GetUrl() + "/user_datas/quicklist/1/SELL/" + ss_id + "/" + fba_id + "/" + pageIndex + "/" + mobile_no;
        method_name = "/user_datas/quicklist/1/SELL/" + ss_id + "/" + fba_id + "/" + pageIndex + "/" + mobile_no;
    } else {
       // url = sellSearch_url;
        method_name = sellSearch_url;
    }
    //var url = GetUrl()+"/user_datas/quicklist/1/SELL/" + ss_id + "/" + fba_id + "/" + pageIndex + "/" + mobile_no


    $.ajax({
        type: "GET",
        //url: url,
        //data: { 'method_name': method_name },			//UAT
        //url: GeteditUrl() + '/TwoWheelerInsurance/call_horizon_get',
		
		data : siteURL.indexOf('https') == 0 ?  { 'method_name': method_name } : "",
		url :  siteURL.indexOf('https') == 0 ?   GeteditUrl() + '/TwoWheelerInsurance/call_horizon_get' : url,
        dataType: "json",
        success: function (data) {
            console.log(data);
			if(data.length >0){
            for (var i in data) {
                $(".sellDiv").append("<div class='app_quoteDiv' srn='" + data[i].SRN + "' status='" + data[i].Last_Status + "' id='selldiv_id' CRN='" + data[i].CRN + "'>" + "<div class='ins_logo'>" + "<img src='./images/InsurerLogo/" + const_insurerlogo[data[i].Insurer] + "' class='img-responsive'>" + "</div>" + "<div class='content_container'>" + "<div class='con parta'>"
                + "<div class='uname'>" + data[i].Customer_Name + "</div>"
                + "<div class='menu' id='info_" + data[i].SRN + "'><i class='fa fa-info-circle'  aria-hidden='true' style='padding:10px 0px;font-size:20px'></i></div>"
                + "</div>"
                + "<div class='con partb'>" + "<div class='app_num'>"
                + "<div class='title'>APP NUMBER</div>" + "<div class='num'>" + data[i].CRN + "</div>" + "</div>"
                + "<div class='app_status'>" + "<div class='title'>APP STATUS</div>" + "<div class='progress'>"
                + "<div class='progress-bar' role='progressbar' aria-valuenow='70' aria-valuemin='0' aria-valuemax='100' style='width:"
                + data[i].Progress + "%'>" + data[i].Progress + "</div>" + "</div>" + "</div>"
                + "</div>"
                + "<div class='con1 partc'>"
                  + "<div class='SUM_a'>"
                      + "<div class='title'>IDV</div>"
                          + data[i].Sum_Insured
                      + "</div>"
                  + "<div class='a_date'>"
                      + "<div class='title'>APP DATE</div>"
                      + data[i].Quote_Date_Mobile
                  + "</div>"
                  + "<div class='downloadpolicy' id='div_downloadPolicy_" + i + "'>"
                     + "<div class='dwn_policy' pdflink='" + data[i].policy_url + "' id='download_policy'><i class='fa fa-download' aria-hidden='true'></i></div>"
                  + "</div>"
                  + "</div>"

                + "<input type='hidden' id='hd_app_SRN' value='" + data[i].SRN + "'/>" + "<input type='hidden' id='hd_app_Insurer' value='" + data[i].Insurer + "'/>" + "</div>" + "</div>");

                $('#download_policy').click(function (e) {
                    var fileUrl = $(this).attr('pdflink');
                    var filename = $(this).parent().parent().parent().attr('CRN');
                    SaveToDisk(fileUrl, filename + "policy.pdf");
                });

                $('#info_' + data[i].SRN).click(function (e) {

                    var SRN = $(this).parent().parent().parent().attr('SRN');
                    SRN = SRN.split('_')[0];
                    vehicleinfo(SRN);
                });

                var Status = data[i].Last_Status;
                if (Status == "TRANS_SUCCESS_WITH_POLICY") {
                    $('#div_downloadPolicy_' + i).show();
                } else {
                    $('#div_downloadPolicy_' + i).hide();
                }

            }
			}else{
				$(".sellDiv").append("<div style ='text-align:center;font-weight: bold;font-size: 18px;'>No Record found</div>")
			}
        },
        error: function (result) {
            console.log(result)
        }
    });


}



function SaveToDisk(fileURL, fileName) {
    // for non-IE
    if (!window.ActiveXObject) {
        var save = document.createElement('a');
        save.href = fileURL;
        save.target = '_blank';
        save.download = fileName || fileURL;
        var evt = document.createEvent('MouseEvents');
        evt.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0,
            false, false, false, false, 0, null);
        save.dispatchEvent(evt);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    }

        // for IE
    else if (!!window.ActiveXObject && document.execCommand) {
        var _window = window.open(fileURL, "_blank");
        _window.document.close();
        _window.document.execCommand('SaveAs', true, fileName || fileURL)
        _window.close();
    }
}

var getUrlVars = function () {

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



function stringparam() {
    //
    ss_id = getUrlVars()["ss_id"];
    fba_id = getUrlVars()["fba_id"];
    ip_address = getUrlVars()["ip_address"];
    app_version = getUrlVars()["app_version"];
    mac_address = getUrlVars()["mac_address"];
    if (getUrlVars()["mobile_no"] == "" || getUrlVars()["mobile_no"] == undefined) {
        mobile_no = 0;
    } else {
        mobile_no = getUrlVars()["mobile_no"];
    }
    //// 
    if (fba_id == "" || fba_id == undefined || fba_id == "0" || ip_address == '' || ip_address == '0' || ip_address == undefined || app_version == "" || app_version == "0" || app_version == undefined || ss_id == "" || ss_id == undefined || ss_id == "0") {

        $(".motor_maindiv").hide();
        $(".warningmsg").show();
    } else if (app_version == 'FinPeace' && (mobile_no == "" || mobile_no == null || mobile_no == 0)) {
        $(".motor_maindiv").hide();
        $(".warningmsg").show();
    } else {

        $(".motor_maindiv").show();
        $(".warningmsg").hide();
    }
}

function AddQuote() {
    //window.location.href = './carinsurance.html?ss_id=' + ss_id + '&fba_id=' + fba_id + '&ip_address=' + ip_address + '&mac_address=' + mac_address + '&app_version=' + app_version +'&mobile_no='+ mobile_no;
    if (app_version == "FinPeace") {
        window.location.href = './carinsurance.html?ss_id=' + ss_id + '&fba_id=' + fba_id + '&ip_address=' + ip_address + '&mac_address=' + mac_address + '&app_version=' + app_version + '&mobile_no=' + mobile_no;
    }
    else {
        window.location.href = './carinsurance.html?ss_id=' + ss_id + '&fba_id=' + fba_id + '&ip_address=' + ip_address + '&mac_address=' + mac_address + '&app_version=' + app_version;
    }
}



$(window).scroll(function () {
    var iCurScrollPos = $(this).scrollTop();
    if (iCurScrollPos > iScrollPos) {
        //Scrolling Down
        if ($(window).scrollTop() == $(document).height() - $(window).height()) {
            if (!isSearchCheck) {
                pageIndex++;
                ////////debugger;;
                if (activeTab() == 'SEARCH') {
                    GetQuoteList();
                } else if (activeTab() == 'APPLICATIONS') {
                    GetApplication();
                } else if (activeTab() == 'SELL') {
                    GetSellList();
                }
            }
        }
    }

});

function Reload() {
    location.reload(true)
};

function myFunction1() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("tbl_quote_list");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function myFunction() {

    var searchOption = $("#SearchQuote").val();
    var input = document.getElementById("myInput").value;
    var valuelength;
    valuelength = document.getElementById("myInput").value.length;

    if ((searchOption == "CRN" && valuelength == "6") || (searchOption == "Name" && valuelength >= 3)) {
        isSearchCheck = true;
    }
    if (valuelength == 0) {
        Reset();

    }

    if (isSearchCheck) {
        var type = activeTab();
        switch (type) {
            case 'SEARCH':
                $('#tbl_quote_list').empty();
                //quoteSearch_url = GetUrl() + "/user_datas/search/1/" + type + "/" + ss_id + "/" + fba_id + "/" + searchOption + "/" + input + "/" + mobile_no;
                quoteSearch_url = "/user_datas/search/1/" + type + "/" + ss_id + "/" + fba_id + "/" + searchOption + "/" + input + "/" + mobile_no;
                GetQuoteList();
                break;
            case 'APPLICATION':
                $('.app_mainlist').empty();
                //appSearch_url = GetUrl() + "/user_datas/search/1/" + type + "/" + ss_id + "/" + fba_id + "/" + searchOption + "/" + input + "/" + mobile_no;
                appSearch_url = "/user_datas/search/1/" + type + "/" + ss_id + "/" + fba_id + "/" + searchOption + "/" + input + "/" + mobile_no;
                GetApplication();
                break;
            case 'SELL':
                $('.sellDiv').empty();
                //sellSearch_url = GetUrl() + "/user_datas/search/1/" + type + "/" + ss_id + "/" + fba_id + "/" + searchOption + "/" + input + "/" + mobile_no;
                sellSearch_url = "/user_datas/search/1/" + type + "/" + ss_id + "/" + fba_id + "/" + searchOption + "/" + input + "/" + mobile_no;
                GetSellList();
                break;
        }
    }
}

function SearchQuote() {
    if ($("#SearchQuote").val() != 0) {
        $("#SearchQuoteInput").show();
        $('#myInput').val('');
        var option = $("#SearchQuote").val();
        switch (option) {
            case 'Name':
                $('#myInput').attr('placeholder', 'Name');
                break;
            case 'CRN':
                $('#myInput').attr('placeholder', 'CRN');
                break;
            case 'RegNo':
                $('#myInput').attr('placeholder', 'Registration Number');
                break;
        }
    }
    else { $("#SearchQuoteInput").hide(); }

}
var RTOCode = "";
function vehicleinfo(SRN) {
    var str1 = {
        "search_reference_number": SRN,
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9"
    };
    //var mainUrl = GetUrl() + "/quote/premium_summary";
    var obj_horizon_data = Horizon_Method_Convert("/quote/premium_summary", str1, "POST");
    $.ajax({

        type: "POST",
        //data: JSON.stringify(str1),
        //url: mainUrl,
        //data: JSON.stringify(obj_horizon_data['data']),
        //url: obj_horizon_data['url'],
		data : siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) :  JSON.stringify(str1),
		url :  siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/premium_summary" ,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (response) {
            console.log("premium_summary() called ", response);
            var vehicle = response.Master.Vehicle;
            var request = response.Request;
            var rto = response.Master.Rto;
            if (request.registration_no != "") {
                var RegNo = request.registration_no.replace(new RegExp('-', 'gi'), "");
                $("#RegistrationNo").text(RegNo);

                if ((RegNo.indexOf("AA1234") > -1) || (RegNo.indexOf("ZZ9999") > -1)) {
                    $("#RegistrationNo").text(RTOCode); $("#divRegistrationNoDetails").hide();
                }
                else {
                    $("#divRegistrationNoDetails").show();
                    $("#RegistrationNoDetails").text(RegNo);
                }
            }
            if (vehicle != "" && vehicle != null) {
                $("#VehicleNameDetails").text(vehicle.Description + " (" + vehicle.Vehicle_ID + ")");
                $("#FuelNameDetails").text(vehicle.Fuel_Name);
                if (request.external_bifuel_type == "cng") {
                    $("#FuelNameDetails").text(vehicle.Fuel_Name + "(" + "EXTERNAL FITTED CNG" + ")");
                }
                if (request.external_bifuel_type == "lpg") {
                    $("#FuelNameDetails").text(vehicle.Fuel_Name + "(" + "EXTERNAL FITTED LPG" + ")");
                }
            }

            if (request.external_bifuel_value > 0) { $("#ExternalBifuelVal").html(request.external_bifuel_value); }
            else { $("#divExternalBifuelVal").hide(); }

            if (rto != "" && rto != null) {
                $("#RTODetails").text(rto.RTO_City + ", " + rto.State_Name + " (" + response.Master.Rto.VehicleCity_Id + ")");
            }
            var Name = "";
            if (request.first_name != "" && checkTextWithSpace(request.first_name)) {
                Name = request.first_name + " ";
                if (request.middle_name != "" && checkTextWithSpace(request.middle_name)) {
                    Name = Name + request.middle_name + " ";
                }
                if (request.last_name != "" && checkTextWithSpace(request.last_name)) {
                    Name = Name + request.last_name;
                }
            }
            else { $("#divNameDetails").hide(); }
            $("#NameDetails").text(Name);
            if (request.mobile != "" && request.mobile != null) {
                $("#MobileDetails").text(request.mobile);
                if (request.mobile == "9999999999") {
                    $("#MobileDetails").text("NA");
                }
            } else { $("#divMobileDetails").hide(); }
            if (request.email != "" && request.email != null) {
                $("#EmailDetails").text(request.email);
                if ((request.email).indexOf('@testpb.com') > 1) {
                    $("#EmailDetails").text("NA");
                }
            } else { $("#divEmailDetails").hide(); }

            if (request.vehicle_insurance_type == "new") { $("#RegistrationTypeDetails").text("New"); }
            else { $("#RegistrationTypeDetails").text("Renew"); }

            //For TP Plan Implementation
            VehInsSubType = request.vehicle_insurance_subtype;
            $("#VehicleInsuranceSubtype").val(VehInsSubType);
            console.log("VehInsSubType: ", VehInsSubType);

            $("#RegistrationSubTypeDetails").html(ShowVehInsSubType(VehInsSubType));

            if (request.vehicle_registration_date != "" || request.vehicle_registration_date != null) { $("#RegistrationDate").html(request.vehicle_registration_date); }
            else { $("#divRegistrationDate").hide(); }

            if (request.vehicle_manf_date != "" || request.vehicle_manf_date != null) { $("#ManufactureDateval").html(request.vehicle_manf_date); }
            else { $("#divManufactureDateval").hide(); }

            if (request.policy_expiry_date != "" && request.policy_expiry_date != null) { $("#PolicyExpiryDateval").html(request.policy_expiry_date); }
            else { $("#divPolicyExpiryDateval").hide(); }

            if ((request.vehicle_ncb_current != "" || request.vehicle_ncb_current != null) && request.vehicle_ncb_current != 0) { $("#PrevNCB").html(request.vehicle_ncb_current + "%"); }
            else { $("#divPrevNCB").hide(); }

            if (request.is_claim_exists != "no") { $("#ClaimYesNo").html("Yes"); $("#divPrevNCB").hide(); }
            if (request.is_claim_exists != "yes") { $("#ClaimYesNo").html("No"); $("#divPrevNCB").show(); }

            if (request.vehicle_registration_type == "corporate") { $("#VehicleInsType").html("Company"); }
            else { $("#VehicleInsType").html("Individual"); }

            var PrevInsName = GetPrevIns(request.prev_insurer_id);
            if (request.prev_insurer_id != "" && request.prev_insurer_id != null) { $("#PrevInsurer").html(PrevInsName); }
            else { $("#divPrevInsurer").hide(); }

            $('#PospAgentName').text(request.posp_first_name + ' ' + request.posp_last_name + ' ( Mob. :  ' + request.posp_mobile_no + ', SS_ID : ' + request.posp_ss_id + ', FBA_ID : ' + request.posp_fba_id + ', City  : ' + request.posp_agent_city + ')');
            $('#PospAgentCity').text(request.posp_agent_city);
            var reportingMobile = request.posp_reporting_mobile_number != null ? request.posp_reporting_mobile_number : "";
            $('#ReportingAgentName').text(request.posp_reporting_agent_name + ' ( UID : ' + request.posp_reporting_agent_uid + ', Mob. : ' + reportingMobile + ' )');
            var client_key_val;
            if (request['product_id'] == 1 || request['product_id'] == 10) {
                if (request.hasOwnProperty('ss_id') && (request['ss_id'] - 0) > 0) {
                    var posp_sources = request['posp_sources'] - 0;
                    var ss_id = (request['ss_id'] - 0);
                    if (posp_sources == 1) {
                        if (request.hasOwnProperty('posp_erp_id') && (request['posp_erp_id'] - 0) > 0) { //posp_erp_id
                            client_key_val = 'DC-POSP';
                            if ([8279, 6328, 9627, 6425].indexOf(ss_id) > -1) {
                                client_key_val = 'FINPEACE';
                            }
                        } else if (ss_id !== 5) {
                            client_key_val = 'DC-NON-POSP';
                        } else if (ss_id === 5) {
                            client_key_val = 'DC-FBA';
                        }
                    } else if (posp_sources == 2) {
                        if (request.hasOwnProperty('posp_erp_id') && (request['posp_erp_id'] - 0) > 0) { //posp_erp_id
                            client_key_val = 'SM-POSP';
                        } else if (ss_id === 5) {
                            client_key_val = 'SM-FBA';
                        } else {
                            client_key_val = 'SM-NON-POSP';
                        }
                    } else {
                        if (request['posp_category'] == 'FOS') {
                            client_key_val = 'SM-FOS';
                        } else if (request['posp_category'] == 'RBS') {
                            client_key_val = 'RBS';
                        } else {
                            client_key_val = 'PB-SS';
                        }
                    }

                }
            }
            $('#POSPType').text(client_key_val);

            $('#infoPopup').show();
            $('.sticky_btn').hide();
        }, error: function (response) { alert('Error in Premium Summary') }
    });
}

function checkTextWithSpace(input) {
    var pattern = new RegExp('^[a-zA-Z ]+$');
    if (pattern.test(input) == false) { return false; }
    else { return true; }
}

function ShowVehInsSubType(VISTCode) {
    var InsText = "";
    switch (VISTCode) {
        case '0CH_1TP': InsText = "T.P. Only For 1 Yr"; break;
        case '0CH_3TP': InsText = "T.P. Only For 3 Yrs"; break;
        case '0CH_5TP': InsText = "T.P. Only For 5 Yrs"; break;

            //case '1CH_0TP': InsText = "Comprehensive For 1 Yr"; break;
            //case '3CH_0TP': InsText = "Comprehensive For 3 Yrs"; break;
            //case '5CH_0TP': InsText = "Comprehensive For 5 Yrs"; break;

        case '1CH_2TP': InsText = "Comprehensive For 1 Yr + T.P. For 2 Yrs"; break;
            //case '1CH_4TP': InsText = "Comprehensive For 1 Yr + T.P. For 4 Yrs"; break;

        case '1CH_1TP': InsText = "O.D. For 1 Yr + T.P. For 1 Yr"; break;

        case '1CH_0TP': InsText = "O.D. + T.P. For 1 Yr"; break;
        case '2CH_0TP': InsText = "O.D. + T.P. For 2 Yrs"; break;
        case '3CH_0TP': InsText = "O.D. + T.P. For 3 Yrs"; break;

        case '1CH_4TP': InsText = "O.D. For 1 Yr + T.P. For 5 Yrs"; break;
        case '5CH_0TP': InsText = "O.D. + T.P. For 5 Yrs"; break;
    }
    return InsText;
}

function GetPrevIns(InsId) {
    var InsText = "";
    switch (InsId) {
        case 1: InsText = "Bajaj Allianz"; break;
        case 2: InsText = "Bharti Axa"; break;
        case 3: InsText = "Cholamandalam MS"; break;
        case 4: InsText = "Future Generali"; break;
        case 5: InsText = "HDFC ERGO"; break;
        case 6: InsText = "ICICI Lombard"; break;
        case 7: InsText = "IFFCO Tokio"; break;
        case 8: InsText = "National Insurance"; break;
        case 9: InsText = "Reliance General"; break;
        case 10: InsText = "Royal Sundaram"; break;
        case 11: InsText = "Tata AIG"; break;
        case 12: InsText = "New India Assurance"; break;
        case 13: InsText = "Oriental Insurance"; break;
        case 14: InsText = "United India"; break;
        case 15: InsText = "L&amp;T General"; break;
        case 16: InsText = "Raheja QBE"; break;
        case 17: InsText = "SBI General"; break;
        case 18: InsText = "Shriram General"; break;
        case 19: InsText = "Universal Sompo"; break;
        case 30: InsText = "Kotak Mahindra"; break;
        case 33: InsText = "Liberty Videocon"; break;
        case 35: InsText = "Magma HDI"; break;
        case 44: InsText = "Go Digit"; break;
        case 45: InsText = "Acko General"; break;
        case 46: InsText = "Edelweiss"; break;
    }
    return InsText;
}

