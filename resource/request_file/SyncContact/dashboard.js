/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var sync_contact;
var siteURL = "";
var AgentName = "";
var AgentMobile = "";
var AgentEmail = "";
var ss_id = "";
var fba_id = "";
var is_paid = "";
var is_sms ="";
var is_call ="";

$(document).ready(function () {
    ss_id = getUrlVars()["ss_id"];
    fba_id = getUrlVars()["fba_id"];
    is_paid = getUrlVars()["is_paid"];
    //is_paid = 'yes';
    if (is_paid === "yes") {
        $('#div_buyNow').show();
        //$(".sync_contact_calling_section").show();
    } else {
        $('#div_buyNow').hide();
        //$(".sync_contact_calling_section").hide();
    }

    if ((ss_id !== null && ss_id !== "" && ss_id !== undefined) && (fba_id !== null && fba_id !== "" && fba_id !== undefined)) {
        $.ajax({
            type: "GET",
            url: siteURL.indexOf('https://') === 0 ? GeteditUrl() + "/TwoWheelerInsurance/call_horizon_get?method_name=/sync_contacts/sync_contact_dashboard/" + ss_id + "/" + fba_id : GetUrl() + "/sync_contacts/sync_contact_dashboard/" + ss_id + "/" + fba_id,
            success: function (data) {
                var Landmark_Policy_Count = 0;
                var Total_Lead_Count = 0;
                console.log("sync_contact-", data);
                sync_contact = data;
                if (data.hasOwnProperty('Total_Contact_Count')) {
                    $(".total_count").append(data.Total_Contact_Count);
                } else {
                    $(".total_count").append('0');
                }
                if (data.hasOwnProperty('LandMark_Count')) {
                    $(".landmark_count").append(data.LandMark_Count);
                } else {
                    $(".landmark_count").append('0');
                }
                if (data.hasOwnProperty('Landmark_Policy_Count')) {
                    $(".landmark_Cust_count").append(data.Landmark_Policy_Count);
                } else {
                    $(".landmark_Cust_count").append('0');
                }
                if (data.hasOwnProperty('Lead_Count')) {
                    Total_Lead_Count = data.Lead_Count;
                }
                $(".display_lead_count").append('Renewal Reminder (Lead ' + data.Lead_Count + ' / Data ' + data.Landmark_Policy_Count + ')');
                if (data.hasOwnProperty('Month_Count')) {
                    for (var i in data.Month_Count) {
                        $("#append_month_contact").append('<div class="month ' + i + '" id="month_popup"><div class="circle">' + data.Month_Count[i].lead_count + '/' + data.Month_Count[i].count + '</div>' +
                                '<p>' + i + '</p>' +
                                '<img src="Images/calender.png"></div>');
                        $("#contactInfo").append('<div style ="display:none;"  class="info ' + i.split(' ')[0] + '">' +
                                '<i class="fa fa-times close" aria-hidden="true"></i>' +
                                '<h5 id="myHeader" class ="myHeader">Renewal Reminder - ' + i + '</h5>' +
                                '<table border="0" cellpadding="0" cellspacing="0" width="100%" id="tbl_list' + i.split(' ')[0] + '">' +
                                '</table>' +
                                '<div class="right">' +
                                '<div class="pagination">' +
                                //'<a href="#">&laquo;</a>' +
                                //'<a href="#" class="active">1</a>' +
                                //'<a href="#">2</a>' +
                                //'<a href="#">3</a>' +
                                //'<a href="#">&raquo;</a>' +
                                '</div>' +
                                '</div>' +
                                '</div>'
                                );

                        $('.close').click(function () {
                            $('#contactInfo').hide();
                        });
                    }
                    $('.month').click(function (e) {
                        //$('#contactInfo').show();
                        var monthpop = $(this).attr("class");
                        PopupList_Bind(sync_contact, monthpop);
                        //$('.'+monthpop).show();
                    });
                } else {
                    $("#append_month_contact").append('<div class="month" ><div class="circle">' - '</div>' +
                            '<p>' + i + '</p>' +
                            '<img src="Images/calender.png"></div>');
                }

                if (data.is_tele_support === "yes") {
                    $('.sync_contact_calling_section').hide();
                } else {
                    if (is_paid === "yes") {
                        $('.sync_contact_calling_section').show();
                    } else {
                        $('.sync_contact_calling_section').hide();
                    }

                }

            },
            error: function (error) {
                console.log(error);
                alert("Oops! Something went wrong.");
                $(".total_count").append('-');
                $(".landmark_count").append('-');
                $(".landmark_Cust_count").append('-');
                $("#append_month_contact").append('<tr>' +
                        '<td>-</td>' +
                        '<td>-</td>' +
                        '</tr>');

            }
        });

    } else {
        alert("Please ensure that SS ID & FBA ID is proper");
    }

    $('.month').click(function () {
        $('#dataPackage').show();
    });
    $('.close').click(function () {
        $('#dataPackage').hide();
    });
    $("ul.options-list li").on("click", function () {
        if ($(this).find('input[type="radio"]').is(':checked')) {
            $('ul.options-list li').removeClass('select');
            $(this).addClass('select');
        }
    });
    $('.popupClosed').on('click', function () {
        $('.more_details_section').hide();
    });
});
function policyPackage1(sync_contact, monthpop) {
    var policyNum = $.isNumeric($('#policyPackage1').val());
    $('.perPackage').val("");
    $('#totalAmountPackage1').val("");
    $('.errorMsgPackage').hide();
    if (policyNum) {
        var totalPolicyNo = parseInt($('#policyPackage1').val());
        if ((totalPolicyNo >= 0) && (totalPolicyNo <= 25)) {
            $('.perPackage').val("40");
            $('#totalAmountPackage1').val(totalPolicyNo * 40);
            $('.perPackage').val("Package 1");
        }
        if ((totalPolicyNo >= 26) && (totalPolicyNo <= 50)) {
            $('.perPackage').val("30");
            $('.totalAmountPackage').val(totalPolicyNo * 30);
            $('.perPackage').val("Package 2");
        }
        if ((totalPolicyNo >= 51) && (totalPolicyNo <= 100)) {
            $('.perPackage').val("25");
            $('.totalAmountPackage').val(totalPolicyNo * 25);
            $('.perPackage').val("Package 3");
        }
        if (totalPolicyNo > 100) {
            $('.perPackage').val("20");
            $('.totalAmountPackage').val(totalPolicyNo * 20);
            $('.perPackage').val("Package 4");
        }
    } else {
        $('.errorMsgPackage').text("Please enter the correct no. of lead");
        $('.errorMsgPackage').show();
    }
}
;
$(".buy_now_mainbtn").on("click", function () {
    set_ssid();
    if (sync_contact.Landmark_Policy_Count >= 25) {
        var count_lead = (sync_contact.Landmark_Policy_Count) - (sync_contact.Lead_Count);
        $('.policyPackage').val(count_lead);
        if ((count_lead >= 0) && (count_lead <= 25)) {
            $('.perPackage').val("40");
            $('#totalAmountPackage1').val(count_lead * 40);
            $('.perPackage').val("Package 1");
        }
        if ((count_lead >= 26) && (count_lead <= 50)) {
            $('.perPackage').val("30");
            $('.totalAmountPackage').val(count_lead * 30);
            $('.perPackage').val("Package 2");
        }
        if ((count_lead >= 51) && (count_lead <= 100)) {
            $('.perPackage').val("25");
            $('.totalAmountPackage').val(count_lead * 25);
            $('.perPackage').val("Package 3");
        }
        if (count_lead > 100) {
            $('.perPackage').val("20");
            $('.totalAmountPackage').val(count_lead * 20);
            $('.perPackage').val("Package 4");
        }
        $('#dataPackage').show();
    }
});
function PopupList_Bind(sync_contact, monthpop) {
    if (sync_contact.Landmark_Policy_Count >= 25) {
        var PageCount;
        //$('input[type=radio]').removeAttr('checked');
        $('.policyPackage').val("");
        $('.policyPackage').val("40");
        $('.perPackage').val("Package 2");
        //$('#package2').prop('checked', true);
        $('.totalAmountPackage').val(40 * 30);
        console.log("sync_contact-" + sync_contact + "monthpop - " + monthpop);
        set_ssid();
        monthpop = monthpop.split(' ')[1] + ' ' + monthpop.split(' ')[2];
        var count_lead = (sync_contact.Landmark_Policy_Count) - (sync_contact.Lead_Count);
        $('.policyPackage').val(count_lead);
        if ((count_lead >= 0) && (count_lead <= 25)) {
            $('.perPackage').val("40");
            $('#totalAmountPackage1').val(count_lead * 40);
            $('.perPackage').val("Package 1");
        }
        if ((count_lead >= 26) && (count_lead <= 50)) {
            $('.perPackage').val("30");
            $('.totalAmountPackage').val(count_lead * 30);
            $('.perPackage').val("Package 2");
        }
        if ((count_lead >= 51) && (count_lead <= 100)) {
            $('.perPackage').val("25");
            $('.totalAmountPackage').val(count_lead * 25);
            $('.perPackage').val("Package 3");
        }
        if (count_lead > 100) {
            $('.perPackage').val("20");
            $('.totalAmountPackage').val(count_lead * 20);
            $('.perPackage').val("Package 4");
        }
        sync_contact = sync_contact.Month_Count[monthpop];
        $('.info').hide();
        $('.myHeader').html('Renewal Reminder - ' + monthpop + '');
        $('.pagination').show();
        $("#tbl_list" + monthpop.split(' ')[0]).empty();
        $("#tbl_list" + monthpop.split(' ')[0]).append('<tr class="mytr">' +
                '<th>Sync Name</th>' +
                '<th>Number</th>' +
                '<th>Make</th>' +
                '<th>Expiry Date</th>' +
                //'<th>Share</th>' +
                '<th>Action</th>' +
                '</tr>'
                );
        if (sync_contact) {
            //debugger;
            if (sync_contact.lead_count > 0) {
                PageCount = Math.round(sync_contact.lead_count / 10);

                if (sync_contact.lead_count <= 10) {
                    $('.pagination').hide();
                }
                var datalen = sync_contact.lead_list;
                for (var z in datalen) {
                    var pol_exp_dt = moment(datalen[z].policy_expiry_date);
                    var curr_dt = moment();
                    var TotalDays = pol_exp_dt.diff(curr_dt, 'days');
                    //if (((TotalDays <= 45 && TotalDays >= 0 ) && (pol_exp_dt.format('MM') == curr_dt.format('MM'))) || ((TotalDays <= 45 && TotalDays >= 0 ) && (pol_exp_dt.format('MM') == curr_dt.add(1, 'M').format('MM')) )) 
                    if (datalen) {
                        var sync_name = "";
                        if (datalen[z].hasOwnProperty('sync_name') && datalen[z].sync_name !== "")
                        {
                            sync_name = datalen[z].sync_name;
                        } else
                        {
                            sync_name = datalen[z].name;
                        }
                        var display_date = getDate(datalen[z].policy_expiry_date);
                        $("#tbl_list" + monthpop.split(' ')[0]).append('<tr>' +
                                '<td style="width:30%">' + sync_name + '</td>' +
                                '<td style="width:26%;padding:6px 10px;">' + datalen[z].mobile + '</td>' +
                                '<td style="width:24%">' + datalen[z].make + '</td>' +
                                '<td style="width:20%">' + display_date + '</td>' +
                                //'<td><a href="#"><i class="fa fa-share-alt" aria-hidden="true"></i></a></td>' +
                                '<td><button class="sendbutton More_click" id="Moreclick_' + datalen[z].Sync_Contact_Erp_Data_Id + '">MORE</button></td>' +
                                '</tr>'

                                );
                        $('#Moreclick_' + datalen[z].Sync_Contact_Erp_Data_Id).click(function () {
							
                            var erp_id = this.id.split('_')[1];
                            more_details_section(datalen, erp_id);


                        });
                    } else {
                        //$(".month").switchClass("month", "month-new");
                        //if((parseInt(pol_exp_dt.format('MM')) >= parseInt(curr_dt.add(2, 'M').format('MM')))){
                        //$('#dataPackage').show();
                        //}
                    }
                }
            } else {


                if (is_paid === "yes") {
                    $('.buy_now_btn').show();
                    $('#dataPackage').show();
                } else {
                    $('.buy_now_btn').hide();
                    //$("#tbl_list" + monthpop.split(' ')[0]).empty();
                    $(".mytr").hide();
                    $("#tbl_list" + monthpop.split(' ')[0]).append('<tr>' +
                            '<td colspan="3" style="text-align: center; vertical-align: middle;"> No Lead Allocated</td>' +
                            //'<th>Share</th>' + 
                            //'<th>Action</th>' + 
                            '</tr>'
                            );
                    $('.pagination').hide();
                }

            }
            $('#contactInfo').show();
            $('.' + monthpop.split(' ')[0]).show();
        } else {
            $('#contactInfo').hide();
        }
        var totalRowCount = $("#tbl_list" + monthpop.split(' ')[0] + " tr").length;
        if (totalRowCount <= 1) {
            $('#contactInfo').hide();
        }
    }
}
;

function hideInfopopup() {
    $('.add_info_section1').hide();
}

function more_details_section(syncdata, erp_id) {
    var data = syncdata;
	clear_popup();
    for (var i in data) {

        if (data[i]['Sync_Contact_Erp_Data_Id'] == erp_id) {
            console.log(data[i]);
            $('.more_details_section').show();
            for (var j in data[i]) {
                $('#td_sync_' + j).text(data[i][j]);
            }
        }
    }

    console.log(erp_id);
    $('.more_details_section').show();
}

function sendbyunow(plan, amount, AgentName, AgentMobile, AgentEmail) {
    var PlanAmount = {
        "Package 1": 40,
        "Package 2": 30,
        "Package 3": 25,
        "Package 4": 20
    };
    var Net_Premium = amount;
    var CGST = amount * 0.09;
    var SGST = amount * 0.09;
    var IGST = amount * 0.18;
    var Service_Tax = amount * 0.18 ;
    var Total_Premium = (Net_Premium - 0) + (Service_Tax - 0);
    
    console.log(plan + '-' + amount);
    var mainUrl = GetUrl() + "/razorpay_payment";
    var liveUrl = "http://horizon.policyboss.com:5000";
    var str1 = {
        "Product": 1,
        "Ss_Id": getUrlVars()['ss_id'],
        "Fba_ID": getUrlVars()['fba_id'],
        "Name": AgentName,
        "Mobile": AgentMobile,
        "Email": AgentEmail,
        "Plan": PlanAmount[plan],
        "Net_Premium": Math.round(Net_Premium),
        "Service_Tax": Math.round(Service_Tax),
        "Total_Premium": ss_id === "25338" ? 1 : Math.round(Total_Premium),
        "Lead_Count": parseInt($('#policyPackage1').val())
        //"CGST" : CGST,
        //"SGST" : SGST,
        //"IGST" : IGST
    };
    var obj_horizon_data = Horizon_Method_Convert("/report/razorpay_payment", str1, "POST");
    $.ajax({
        type: "POST",
        //data: JSON.stringify(str1), 						//local
        //url: mainUrl,										//local
        //data: JSON.stringify(obj_horizon_data['data']),		//UAT
        //url: obj_horizon_data['url'],						//UAT
        data: window.location.href.indexOf('https') === 0 ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(str1),
        url: window.location.href.indexOf('https') === 0 ? obj_horizon_data['url'] : GetUrl() + "/report/razorpay_payment",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            console.log(data);
            if (data.Status === "Success") {
                //window.location = "http://qa.policyboss.com/razorpay/index.html?transaction_id="+data.Transaction_Id+"&amount="+amount;
                Android.syncrazorpay(data.Transaction_Id);
            } else {
                alert("Oops! Something went wrong.");
                $(".buy_now_btn").show();
            }
        },
        error: function (result) {
            //alert("Error - "+ result);
            alert("Oops! Something went wrong.");
            $(".buy_now_btn").show();
        }
    });
}
$(".buy_now_btn").on("click", function () {
    var packSelected = true;
    var pospdata = true;
    var plan = $('.perPackage').val();
    var amount = $('.totalAmountPackage').val();
    if (AgentName === "" || AgentName === undefined)
    {
        $('.errorMsgPackage').text("Error in fetching Data - POSP.");
        $('.errorMsgPackage').show();
        pospdata = false;
    }
    if ((plan !== null && plan !== "" && plan !== undefined) && (amount !== null && amount !== "" && amount !== undefined) && AgentName && packSelected) {
        //$(".buy_now_btn").hide();
        sendbyunow(plan, amount, AgentName, AgentMobile, AgentEmail);
    } else {
        alert("Please select proper data.");
    }

});
function getDate(date_value)
{
    const date = new Date(date_value);
    const dateTimeFormat = new Intl.DateTimeFormat('en', {year: 'numeric', month: 'short', day: '2-digit'});
    const [{value: month}, , {value: day}, , {value: year}] = dateTimeFormat.formatToParts(date);
    var displaydate = `${day} ${month}`;
    return displaydate;
}
function set_ssid() {
    $.ajax({
        type: "GET",
        url: siteURL.indexOf('https://') === 0 ? GeteditUrl() + "/TwoWheelerInsurance/call_horizon_get?method_name=/posps/dsas/view/" + getUrlVars()["ss_id"] : GetUrl() + "/posps/dsas/view/" + getUrlVars()["ss_id"],
        success: function (data) {
            if (data.status === "SUCCESS") {
                AgentName = data.EMP.Emp_Name;
                AgentMobile = data.EMP.Mobile_Number;
                AgentEmail = data.EMP.Email_Id;
                //sendbyunow(plan , amount, AgentName, AgentMobile, AgentEmail);
            } else {
                //alert("Error! Status : "+data.status);
                $('.errorMsgPackage').text("Error in fetching Data - POSP.");
                $('.errorMsgPackage').show();
            }
        },
        error: function (error) {
            console.log(error);
            alert("Oops! Something went wrong.");
        }
    });
}

$('.myHeader').html('');
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


function OnlineAggrementSubmit() {

    var checkboxs = document.getElementsByName("c1");
    var okay = false;
    var err_count = 0;
    var online_agreement = "";
    online_agreement = $("#chk_online_agreement").is(":checked") === true ? "yes" : "no";

    if (online_agreement === "no") {
        err_count++;
        $('.show_errMsg').text("Please select terms & conditions  checkbox");
    }
	
	if(is_call == "" || is_sms == "" )
	{
		err_count++;
        $('.show_errMsg').text("Please select yes or now for sms and call");
	}
    if (err_count === 0) {
        var obj = {
            "ss_id": parseInt(ss_id),
            "fba_id": parseInt(fba_id),
            "is_sms": is_sms,
            "is_call": is_call,
            "online_agreement": online_agreement
        };
        console.log(obj);
        var obj_horizon_data = Horizon_Method_Convert("/sync_contacts/online_agreement", obj, "POST");
        $.ajax({

            type: "POST",
            data: window.location.href.indexOf('https') === 0 ? JSON.stringify(obj_horizon_data['data']) : obj,
            url: window.location.href.indexOf('https') === 0 ? obj_horizon_data['url'] : GetUrl() + "/sync_contacts/online_agreement",
            success: function (data, e) {
                console.log(data);
                if (data.Status === "Success") {
                    $('.sync_contact_calling_section').hide();
                } else {
                    $('.sync_contact_calling_section').show();
                }
            },
            error: function (data) {
                console.log(data);
            }
        });

    }
}
$('.contact_calling_btn').on("click", function () {
    $(".sync_contact_calling_section").show();
});

$('.close_contact_calling').on("click", function () {
    $(".sync_contact_calling_section").hide();
});
function SyncData_Update() {

    var tele_support = "";
    if ($("#tele_yes").is(":checked")) {
        tele_support = "yes";
    } else {
        tele_support = "no";
    }
    var obj = {
        "Remark": $('#td_sync_remark').val(),
        "Is_tele_support": tele_support,
        "Sync_Contact_Erp_Data_Id": $('#td_sync_Sync_Contact_Erp_Data_Id').text(),
		"Ss_Id": parseInt(ss_id),
        "Fba_Id": parseInt(fba_id)
    };
    console.log(obj);
    var obj_horizon_data = Horizon_Method_Convert("/sync_contacts/save_lead_tele_support", obj, "POST");
    $.ajax({

        type: "POST",
        data: window.location.href.indexOf('https') === 0 ? JSON.stringify(obj_horizon_data['data']) : obj,
        url: window.location.href.indexOf('https') === 0 ? obj_horizon_data['url'] : GetUrl() + "/sync_contacts/save_lead_tele_support",

        dataType: "json",
        success: function (data, e) {
            console.log(data);
			if(data.Status === "Success"){
				$('.more_details_section').hide();
			}
        },
        error: function (data) {


            console.log(data);

        }
    });
}
function clear_popup() {
    $('#td_sync_remark').val("");
    $("#tele_yes").prop("checked", false);
    $("#tele_no").prop("checked", false);
}

function CheckCall(input){
	is_call = input;
	
	if(input === "yes"){
		$('#btn_call_yes').addClass("active_click");
		$('#btn_call_no').removeClass("active_click");
		
	}else{
		$('#btn_call_yes').removeClass("active_click");
		$('#btn_call_no').addClass("active_click");
	}
}
function CheckSMS(input){
	is_sms = input;
	
	if(input === "yes"){
		$('#btn_sms_yes').addClass("active_click");
		$('#btn_sms_no').removeClass("active_click");
		
	}else{
		$('#btn_sms_yes').removeClass("active_click");
		$('#btn_sms_no').addClass("active_click");
	}
}