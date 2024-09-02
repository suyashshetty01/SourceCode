var sync_contact;
var siteURL = "";
var AgentName = "";
var AgentMobile = "";
var AgentEmail = "";
var ss_id = "";
var fba_id = "";
var is_paid = "";
var is_sms = "";
var is_call = "";
var lead_data_count = 0;
var device_type;
var datalen;
$(document).ready(function () {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        device_type = "mobile";
    } else {
        device_type = "desktop";
    }
    //ss_id = getUrlVars()["ss_id"];
    //fba_id = getUrlVars()["fba_id"];
    //is_paid = getUrlVars()["is_paid"];
    horizon_get_session();
    if (is_paid === "yes") {
        // $('#div_buyNow').show();
    } else {
        // $('#div_buyNow').show();
    }
});
function sync_contact_dashboard() {
    if ((ss_id !== null && ss_id !== "" && ss_id !== undefined) && (fba_id !== null && fba_id !== "" && fba_id !== undefined)) {
        $('.loading').show();
        $.ajax({
            type: "GET",
            url: GetUrl() + "/sync_contacts/sync_contact_dashboard/" + ss_id + "/" + fba_id,
            success: function (data) {
                $('.loading').hide();
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
                    $(".leads_allocated").append(data.Lead_Count);
                } else {
                    $(".leads_allocated").append('0');
                }
                if (data.hasOwnProperty('Lead_Count')) {
                    Total_Lead_Count = data.Lead_Count;
                }
                lead_data_count = data.Landmark_Policy_Count - data.Lead_Count;
                console.log("lead_data_count" + lead_data_count);
                $(".display_lead_count").append('Track Sync Expiries (Lead ' + data.Lead_Count + ' / Data ' + data.Landmark_Policy_Count + ')');
                if (data.hasOwnProperty('Month_Count')) {
                    for (var i in data.Month_Count) {
                        $("#append_month_contact").append(
                            '<div class="lead-col month ' + i + '">' +
                            '<div class="lead-box" onclick="activeLeadBox(event)">' +
                            '<div class="inner-header-box">' +
                            '<span class="font-18 title-text text-extralight">' + moment(i, 'MMMM YYYY').format('MMM YYYY').toUpperCase() + '</span>' +
                            '</div>' +
                            '<div class="inner-body-box">' +
                            '<ul >' +
                            '<li class="font-28 text-extralight">' + data.Month_Count[i].lead_count + '</li>' +
                            '<li class="font-28 text-extralight">' + data.Month_Count[i].count + '</li>' +
                            '</ul>' +
                            '<button type="button" onclick="triggerBuyLeadModel(' + data.Month_Count[i].lead_count + ',' + data.Month_Count[i].count + ')" class="font-15 btn-bordered">Buy Lead</button>' +
                            '</div>' +
                            '</div>' +
                            '</div>');
                        /*$("#contactInfo").append('<div style ="display:none;"  class="info ' + i.split(' ')[0] + '">' +
                        '<i class="fa fa-times close" aria-hidden="true"></i>' +
                        '<h5 id="myHeader" class ="myHeader">Renewal Reminder - ' + i + '</h5>' +
                        '<table border="0" cellpadding="0" cellspacing="0" width="100%" id="tbl_list' + i.split(' ')[0] + '">' +
                        '</table>' +
                        '<div class="right">' +
                        '<div class="pagination">' +
                        '</div>' +
                        '</div>' +
                        '</div>'
                        );

                        $('.close').click(function () {
                        $('#contactInfo').hide();
                        });
                        }*/
                        $('.month').click(function (e) {
                            var monthpop = $(this).attr("class");
                            PopupList_Bind(sync_contact, monthpop);
                        });
                    }
                    PopupList_Bind(sync_contact, 'lead-col month ' + moment().format('MMMM YYYY'));
                } else {
                    $("#append_month_contact").append('<div class="month" ><div class="circle">' - '</div>' +
                        '<p>' + i + '</p>' +
                        '<img src="https://origin-cdnh.policyboss.com/website/UI22/images/calender.png"></div>');
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
                $('.loading').hide();
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
        //alert("Please ensure that SS ID & FBA ID is proper");
        window.location.href = "https://horizon.policyboss.com/sign-in?ref_login=https://www.policyboss.com/sync-contacts-dashboard";
    }
}

var getUrlVars = function () {
    var vars = [],
    hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        if (hashes[i].includes("?")) {
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
function activeLeadBox(e) {
    $('.lead-box.active').removeClass('active');
    $(e.currentTarget).addClass('active');
}
function PopupList_Bind(sync_contact, monthpop) {
    if (true || sync_contact.Landmark_Policy_Count >= 25) {
        var PageCount;
        $('.policyPackage').val("");
        $('.policyPackage').val("40");
        $('.perPackage').val("Package 2");
        $('.totalAmountPackage').html(40 * 30); //$('.totalAmountPackage').val(40 * 30);
        //console.log("sync_contact-" + sync_contact + "monthpop - " + monthpop);
        set_ssid();
        monthpop = monthpop.split(' ')[2] + ' ' + monthpop.split(' ')[3];
        var count_lead = (sync_contact.Landmark_Policy_Count) - (sync_contact.Lead_Count);
        $('.policyPackage').val(count_lead);
        if ((count_lead >= 0) && (count_lead <= 25)) {
            $('.perPackage').val("40");
            $('#totalAmountPackage1').html(count_lead * 40); //$('#totalAmountPackage1').val(count_lead * 40);
            $('.perPackage').val("Package 1");
        }
        if ((count_lead >= 26) && (count_lead <= 50)) {
            $('.perPackage').val("30");
            $('.totalAmountPackage').html(count_lead * 30); //$('.totalAmountPackage').val(count_lead * 30);
            $('.perPackage').val("Package 2");
        }
        if ((count_lead >= 51) && (count_lead <= 100)) {
            $('.perPackage').val("25");
            $('.totalAmountPackage').html(count_lead * 25); //$('.totalAmountPackage').val(count_lead * 25);
            $('.perPackage').val("Package 3");
        }
        if (count_lead > 100) {
            $('.perPackage').val("20");
            $('.totalAmountPackage').html(count_lead * 20); //$('.totalAmountPackage').val(count_lead * 20);
            $('.perPackage').val("Package 4");
        }
        sync_contact = sync_contact.Month_Count[monthpop];
        //$('.info').hide();
        //$('.myHeader').html('Renewal Reminder - ' + monthpop + '');
        //$('.pagination').show();
        //$("#tbl_list" + monthpop.split(' ')[0]).empty();
        /*$("#tbl_list" + monthpop.split(' ')[0]).append('<tr class="mytr">' +
        '<th>Sync Name</th>' +
        '<th>Number</th>' +
        '<th>Make</th>' +
        '<th>Expiry Date</th>' +
        '<th>Action</th>' +
        '</tr>'
        );*/
        if (sync_contact) {
            if (sync_contact.lead_count > 0) {
                PageCount = Math.round(sync_contact.lead_count / 10);

                /*if (sync_contact.lead_count <= 10) {
                $('.pagination').hide();
                }*/
                datalen = sync_contact.lead_list;
                $("#tbl_list").empty();
                for (var z in datalen) {
                    var pol_exp_dt = moment(datalen[z].policy_expiry_date);
                    var curr_dt = moment();
                    var TotalDays = pol_exp_dt.diff(curr_dt, 'days');
                    if (datalen) {
                        var sync_name = "";
                        if (datalen[z].hasOwnProperty('name') && datalen[z].sync_name !== "") {
                            sync_name = datalen[z].name;
                        }
                        var registration_no_processed = (datalen[z].hasOwnProperty('registration_no_processed') && datalen[z].registration_no_processed !== "") ? datalen[z].registration_no_processed : '';
                        var Sync_Contact_Erp_Data_Id = (datalen[z].hasOwnProperty('Sync_Contact_Erp_Data_Id') && datalen[z].Sync_Contact_Erp_Data_Id !== "") ? datalen[z].Sync_Contact_Erp_Data_Id : '';
                        var last5 = datalen[z].mobile.substring(datalen[z].mobile.length - 3);
                        var mask1 = datalen[z].mobile.substring(0, datalen[z].mobile.length - 3);
                        var mask = mask1.replace(/.(?=.)/g, "x");
                        var display_date = getDate(datalen[z].policy_expiry_date);
                        $("#tbl_list").append(
                            '<tr>' +
                            '<td class="check-box-col">' +
                            '<div class="check-item-box">' +
                            '<input type="checkbox" class="check-input" id="check-item-2">' +
                            '<label class="check-input-label font-16 text-extralight" for="check-item-2"></label>' +
                            '</div>' +
                            '</td>' +
                            '<td>' +
                            '<div class="action-btn" style="display: flex;">' +
                            '<button type="button" class="unstyled-btn" data-bs-toggle="modal" data-bs-target="#addLeadModal">' +
                            '<img src="https://origin-cdnh.policyboss.com/website/UI22/images/icons/pay-icon.png" alt="" />' +
                            '</button>' +
                            '<button type="button" class="unstyled-btn" data-bs-toggle="modal" data-bs-target="#addLeadModal">' +
                            '<img src="https://origin-cdnh.policyboss.com/website/UI22/images/icons/edit-field-icon.png" alt="" />' +
                            '</button>' +
                            '</div>' +
                            '</td>' +
                            '<td data-label="ERP ID">' +
                            '<span class="block font-18 text-extralight weight-500">' + Sync_Contact_Erp_Data_Id + '</span>' +
                            '</td>' +
                            '<td data-label="Contact Name">' +
                            '<span class="block font-18 text-extralight weight-500">' + sync_name + '</span>' +
                            '</td>' +
                            '<td data-label="Owner">' +
                            '<span class="block font-18 text-extralight weight-500">' + sync_name + '</span>' +
                            '<span class="block font-16 text-666">' + mask + last5 + '</span>' +
                            '</td>' +
                            '<td data-label="Vehicle Details">' +
                            '<span class="block font-16 text-extralight weight-500">' + registration_no_processed + '</span>' +
                            '<span class="block font-16 text-666">' + datalen[z].make + '</span>' +
                            '</td>' +
                            '<td data-label="Expiry Date">' +
                            '<span class="block font-18 text-extralight weight-500">' + display_date + '</span>' +
                            '</td>' +
                            /*'<td data-label="Call Back">' +
                            '<span class="block font-16 text-extralight weight-500">Call Back </span>' +
                            '<span class="block font-16 text-666">At 1 Oct, 11 AM</span>' +
                            '</td>' +
                            '<td data-label="Status">' +
                            '<span class="block font-16 weight-500 status-completed">Completed </span>' +
                            '</td>' +*/
                            '</tr>');
                        $('#Moreclick_' + datalen[z].Sync_Contact_Erp_Data_Id).click(function () {

                            var erp_id = this.id.split('_')[1];
                            more_details_section(datalen, erp_id);

                        });
                    } else {}
                }
            } else {

                if (is_paid === "yes") {
                    $('#dataPackage').show();
                } else {
                    //$('.buy_now_btn').hide();
                    //$(".mytr").hide();
                    /*$("#tbl_list" + monthpop.split(' ')[0]).append('<tr>' +
                    '<td colspan="3" style="text-align: center; vertical-align: middle;"> No Lead Allocated</td>' +
                    '</tr>'
                    );
                    $('.pagination').hide();*/
                    $("#tbl_list").empty();
                    $("#tbl_list").append('<tr><td class="check-box-col" colspan="100%">No Lead Allocated</td></tr>');
                }

            }
            $('#contactInfo').show();
            $('.' + monthpop.split(' ')[0]).show();
        } else {
            //$('#contactInfo').hide();
        }
        var totalRowCount = $("#tbl_list" + monthpop.split(' ')[0] + " tr").length;
        if (totalRowCount <= 1) {
            $('#contactInfo').hide();
        }
    }
};
function set_ssid() {
    $('.loading').show();
    $.ajax({
        type: "GET",
        url: GetUrl() + "/posps/dsas/view/" + ss_id, //getUrlVars()["ss_id"],
        success: function (data) {
            $('.loading').hide();
            if (data.status === "SUCCESS") {
                AgentName = data.EMP.Emp_Name;
                AgentMobile = data.EMP.Mobile_Number;
                AgentEmail = data.EMP.Email_Id;
            } else {
                $('.errorMsgPackage').text("Error in fetching Data - POSP.");
                $('.errorMsgPackage').show();
            }
        },
        error: function (error) {
            $('.loading').hide();
            console.log(error);
            alert("Oops! Something went wrong.");
        }
    });
}
function getDate(date_value) {
    const date = new Date(date_value);
    const dateTimeFormat = new Intl.DateTimeFormat('en', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    });
    const[{
            value: month
        }, , {
            value: day
        }, , {
            value: year
        }
    ] = dateTimeFormat.formatToParts(date);
    var displaydate = `${day} ${month}`;
    return displaydate;
}
function triggerBuyLeadModel(completed_leads, total_leads) {
    var available_leads = (total_leads - 0) - (completed_leads - 0);
    $('.available_leads').html(available_leads);
    $('#triggerbuyLeadModal').trigger('click');
}
function policyPackageFunction(sync_contact, monthpop) {
    var policyNum = $.isNumeric($('#policyPackage1').val());
    $('.perPackage').val("");
    // $('#totalAmountPackage1').val("");
    $('#totalAmountPackage1').html("");
    $('.errorMsgPackage').hide();
    if (policyNum) {
        var totalPolicyNo = parseInt($('#policyPackage1').val());
        if ((totalPolicyNo >= 0) && (totalPolicyNo <= 25)) {
            $('.perPackage').val("40");
            $('#totalAmountPackage1').html(totalPolicyNo * 40); //$('#totalAmountPackage1').val(totalPolicyNo * 40);
            $('.perPackage').val("Package 1");
        }
        if ((totalPolicyNo >= 26) && (totalPolicyNo <= 50)) {
            $('.perPackage').val("30");
            $('.totalAmountPackage').html(totalPolicyNo * 30); //$('.totalAmountPackage').val(totalPolicyNo * 30);
            $('.perPackage').val("Package 2");
        }
        if ((totalPolicyNo >= 51) && (totalPolicyNo <= 100)) {
            $('.perPackage').val("25");
            $('.totalAmountPackage').html(totalPolicyNo * 25); //$('.totalAmountPackage').val(totalPolicyNo * 25);
            $('.perPackage').val("Package 3");
        }
        if (totalPolicyNo > 100) {
            $('.perPackage').val("20");
            $('.totalAmountPackage').html(totalPolicyNo * 20); //$('.totalAmountPackage').val(totalPolicyNo * 20);
            $('.perPackage').val("Package 4");
        }
    } else {
        $('.errorMsgPackage').text("Please enter the correct no. of lead");
        $('.errorMsgPackage').show();
    }
}
function horizon_get_session() {
    $.ajax({
        type: "GET",
        url: getWebsiteUrl() + "/get-session",
        success: function (data) {
            data = {
                "cookie": {
                    "originalMaxAge": 6000000,
                    "expires": "2022-11-16T09:21:36.473Z",
                    "httpOnly": false,
                    "domain": "policyboss.com",
                    "path": "/"
                },
                "transaction": {
                    "visitor_id": 965911
                },
                "login_response": {
                    "UserName": "Anuj Baliram Singh",
                    "FBAId": 56265,
                    "FBAStatus": "",
                    "Fullname": "Anuj Baliram Singh",
                    "POSPStatus": "",
                    "EmailID": "anuj.singh@policyboss.com",
                    "MobiNumb1": 9619160851,
                    "SuppAgentId": 8067,
                    "EmpCode": 110560,
                    "RoleId": 23,
                    "Source": 0,
                    "client_id": 2,
                    "IsFirstLogin": 0,
                    "LIveURL": 0,
                    "LastloginDate": 0,
                    "Validfrom": "",
                    "UserType": "",
                    "RewardPoint": 0,
                    "strPassword": "",
                    "IsDemo": 0,
                    "FSM": "",
                    "IsMagiSale": 0,
                    "LeadId": 0,
                    "Sub_Fba_Id": "",
                    "Is_Employee": "Y",
                    "Result": "Success",
                    "Message": "Authentication Succesfull!",
                    "Status": 0,
                    "Sources": 0
                },
                "user": {
                    "session_id": "puw7klEPiqRznK5h7ovHylv_c_vc9xOw",
                    "email": "anuj.singh@policyboss.com",
                    "mobile": 9619160851,
                    "fullname": "Anuj Baliram Singh",
                    "role_id": 23,
                    "role_detail": {
                        "channel": "ALL",
                        "ownership": "ST",
                        "title": "SuperAdmin",
                        "role": ["Employee", "SuperAdmin"],
                        "allowed_product": ["ALL"],
                        "allowed_make": ["ALL"]
                    },
                    "ss_id": 8067,
                    "fba_id": 56265,
                    "erp_id": 110560,
                    "sub_fba_id": 0,
                    "uid": 110560,
                    "website_session": {
                        "session_id": "puw7klEPiqRznK5h7ovHylv_c_vc9xOw",
                        "agent_name": "Anuj Baliram Singh",
                        "agent_city": "NA",
                        "fba_id": 56265,
                        "sub_fba_id": 0,
                        "agent_source": 0,
                        "AgentClientFBAID": null,
                        "agent_email": "anuj.singh@policyboss.com",
                        "agent_mobile": 9619160851,
                        "UID": 110560,
                        "Is_Employee": "Y",
                        "client_id": 2,
                        "agent_id": 8067,
                        "agent_rm_name": "NA",
                        "role_detail": {
                            "channel": "ALL",
                            "ownership": "ST",
                            "title": "SuperAdmin",
                            "role": ["Employee", "SuperAdmin"],
                            "allowed_product": ["ALL"],
                            "allowed_make": ["ALL"]
                        }
                    },
                    "direct": {
                        "cnt_posp": 0,
                        "cnt_dsa": 0,
                        "cnt_cse": 0
                    },
                    "team": {
                        "cnt_posp": 0,
                        "cnt_dsa": 0,
                        "cnt_cse": 6
                    },
                    "profile": {
                        "Ss_Id": 8067,
                        "Business_Phone_Number": "9619160851",
                        "Official_Email": "anuj.singh@policyboss.com",
                        "Email": "anujsingh2511@gmail.com",
                        "Phone": "9619160851",
                        "Direct_Reporting_UID": 107602,
                        "Dept_Segment": "IT_Development",
                        "Dept_Short_Name": "IT",
                        "Emp_Category": "-",
                        "Sub_Process": "IT_Development",
                        "Process": "IT_Development",
                        "Sub_Vertical": "IT",
                        "Vertical": "Support",
                        "Director_CXO_Name": "Susheel Tejuja",
                        "VH_HOD_Name": "Chiragkumar Sevantilal Modi",
                        "RH_Name": "-",
                        "BH_Name": "-",
                        "LM_Name": "-",
                        "ALM_Name": "-",
                        "TL_Name": "-",
                        "Band": 5,
                        "Designation": "Deputy General Manager",
                        "DOJ": "2018-05-10",
                        "Branch": "Mumbai_M",
                        "Company": "Datacomp",
                        "Software_ID": "ANUJ BALIRAM SINGH",
                        "Employee_Name": "Anuj Baliram Singh",
                        "EMP_ID": 550005,
                        "HRMS_ID": 10550005,
                        "UID": 110560,
                        "__v": 0,
                        "_id": "637420fc05390898975a88ae"
                    }
                },
                "users_assigned": {
                    "Profile": {
                        "Ss_Id": 8067,
                        "Business_Phone_Number": "9619160851",
                        "Official_Email": "anuj.singh@policyboss.com",
                        "Email": "anujsingh2511@gmail.com",
                        "Phone": "9619160851",
                        "Direct_Reporting_UID": 107602,
                        "Dept_Segment": "IT_Development",
                        "Dept_Short_Name": "IT",
                        "Emp_Category": "-",
                        "Sub_Process": "IT_Development",
                        "Process": "IT_Development",
                        "Sub_Vertical": "IT",
                        "Vertical": "Support",
                        "Director_CXO_Name": "Susheel Tejuja",
                        "VH_HOD_Name": "Chiragkumar Sevantilal Modi",
                        "RH_Name": "-",
                        "BH_Name": "-",
                        "LM_Name": "-",
                        "ALM_Name": "-",
                        "TL_Name": "-",
                        "Band": 5,
                        "Designation": "Deputy General Manager",
                        "DOJ": "2018-05-10",
                        "Branch": "Mumbai_M",
                        "Company": "Datacomp",
                        "Software_ID": "ANUJ BALIRAM SINGH",
                        "Employee_Name": "Anuj Baliram Singh",
                        "EMP_ID": 550005,
                        "HRMS_ID": 10550005,
                        "UID": 110560,
                        "__v": 0,
                        "_id": "637420fc05390898975a88ae"
                    },
                    "Direct": {
                        "POSP": [],
                        "DSA": [],
                        "CSE": []
                    },
                    "Team": {
                        "POSP": [],
                        "DSA": [],
                        "CSE": [16114, 16115, 64496, 107889, 107890, 114118]
                    }
                }
            }
            if (data && data.hasOwnProperty('user')) {
                ss_id = (data.user && data.user.hasOwnProperty('ss_id')) ? data.user.ss_id : 0;
                fba_id = (data.user && data.user.hasOwnProperty('fba_id')) ? data.user.fba_id : 0;
                if (ss_id !== 0) {
                    /* start for header */
                    var agentNameDeskMob;
                    if (device_type === "mobile") {
                        agentNameDeskMob = data['user']['fullname'].split(" ")[0];
                    } else {
                        agentNameDeskMob = data['user']['fullname'];

                    }
                    $('.agentNameDeskMob').html(agentNameDeskMob);
                    $('#login').attr('href', 'javascript:return false;');
                    $('#login').attr('onclick', 'javascript:return false;');
                    $('a[title="Login"]').attr('href', 'https://horizon.policyboss.com/sign-out');
                    /* end for header */
                    $('li[title="Term Insurance"]').attr('onclick', "window.open('https://term.policyboss.com/term-insurance','_self');");
                    $('.dashboardIcon').show();
                    $('.agentName').html(agentNameDeskMob);
                    $('.agentSsid').html('SS_ID : ' + ss_id);
                    //$('.agentUid').html('ERP_Code : ' + UID);
                    $('.loginButton').hide();
                    $('.profileDropdown').show();
                } else {
                    $('.loginButton').show();
                    $('.profileDropdown').hide();
                    $('.agentNameDeskMob').html('Login');
                    $('.agentSsid').html('');
                    $('.agentUid').html('');
                    /* start for header */
                    $('a[title="Login"]').attr('href', 'https://horizon.policyboss.com/sign-in?ref_login=' + window.location.href);
                    $(".term-insurance-visible").hide();
                    $('.profile-popup').remove();
                    /* end for header */
                }
            }
            sync_contact_dashboard();

        },
        error: function (err) {
            $('.loginButton').show();
            $('.profileDropdown').hide();
            $('.agentNameDeskMob').html('Login');
            $('.agentSsid').html('');
            $('.agentUid').html('');
            sync_contact_dashboard();
        }
    });
}
function filter() {
    var err = 0;
    var condition = true;
	var reg_no_err = 0;
	var data_exists = false;
	$('#registration_num').removeClass('has-error');
    if ($('#mobile_no').val() !== '' && $('#mobile_no').val() !== null && $('#mobile_no').val() !== undefined) {
        if ($('#mobile_no').val().length == 0 || checkMobile($('#mobile_no')) == false) {
            err++;
            $('#mobile_no').addClass('has-error');
        } else {
            condition = 'datalen[z].mobile == $("#mobile_no").val()';
                $('#mobile_no').removeClass('has-error');
        }
    }
	if ($('#registration_num').val() !== '' && $('#registration_num').val() !== null && $('#registration_num').val() !== undefined) {
        var reg1 = '', reg2 ='', reg3 ='',reg4 ='';
		var registration_num = $('#registration_num').val();
		var Text_Pattern = new RegExp('^[a-zA-Z]+$');
		var Number_Pattern = new RegExp('^[0-9]*$');
		var AlphaNum_Pattern = new RegExp('^[0-9a-zA-Z]*$');
		if (registration_num) {
		  var registration_num_array = registration_num.split('-');
		  reg1 = registration_num_array[0];
		  if (registration_num_array.length >= 2) {
			reg2= registration_num_array[1];
		  }
		  if (registration_num_array.length >= 3) {
			if (registration_num_array.length == 3 && isNaN(registration_num_array[2]) == false) {
			  reg4 = registration_num_array[2];
			} else {
			  reg3 = registration_num_array[2];
			}
		  }
		  if (registration_num_array.length >= 4) {
			reg4 = registration_num_array[3];
		  }
		}
		if (reg1 == "" || reg1.length != 2 || (Text_Pattern.test(reg1) == false)) {
			$('#registration_num').addClass('has-error');
			reg_no_err++;
			err++;
		}
		else {}
		if (reg2 == "" || reg2 == "00" || reg2.length != 2 || (AlphaNum_Pattern.test(reg2) == false)) {
			if (reg2 == "00") {
				$('#reg2').val('');
			}
			$('#registration_num').addClass('has-error');
			reg_no_err++;
			err++;
		}
		else if (Text_Pattern.test(reg2) == true) {
			$('#registration_num').addClass('has-error');
			reg_no_err++;
			err++;
		}
		if (reg3 != "" && (reg3.length < 1 || reg3.length > 3 || (AlphaNum_Pattern.test(reg3) == false))) {
			$('#registration_num').addClass('has-error');
			reg_no_err++;
			err++;
		}
		if (reg1 == "" || reg2 == "" || reg3 == "") {
			$('#registration_num').addClass('has-error');
			reg_no_err++;
			err++;
		}
		if (reg4 == "" || reg4.length != 4 || (Number_Pattern.test(reg4) == false)) {
			$('#registration_num').addClass('has-error');
			reg_no_err++;
			err++;
		}
		if(reg_no_err == 0){
			if(condition == true){
				condition = 'datalen[z].registration_no == $("#registration_num").val()';
			}else{
				condition = ' && datalen[z].registration_no == $("#registration_num").val()';
			}
		}
    }
    if (err == 0) {
        $("#tbl_list").empty();
        for (var z in datalen) {
            if (eval(condition)) {
				data_exists = true;
                var pol_exp_dt = moment(datalen[z].policy_expiry_date);
                var curr_dt = moment();
                var TotalDays = pol_exp_dt.diff(curr_dt, 'days');
                if (datalen) {
                    var sync_name = "";
                    if (datalen[z].hasOwnProperty('name') && datalen[z].sync_name !== "") {
                        sync_name = datalen[z].name;
                    }
                    var registration_no_processed = (datalen[z].hasOwnProperty('registration_no_processed') && datalen[z].registration_no_processed !== "") ? datalen[z].registration_no_processed : '';
                    var Sync_Contact_Erp_Data_Id = (datalen[z].hasOwnProperty('Sync_Contact_Erp_Data_Id') && datalen[z].Sync_Contact_Erp_Data_Id !== "") ? datalen[z].Sync_Contact_Erp_Data_Id : '';
                    var last5 = datalen[z].mobile.substring(datalen[z].mobile.length - 3);
                    var mask1 = datalen[z].mobile.substring(0, datalen[z].mobile.length - 3);
                    var mask = mask1.replace(/.(?=.)/g, "x");
                    var display_date = getDate(datalen[z].policy_expiry_date);
                    $("#tbl_list").append(
                        '<tr>' +
                        '<td class="check-box-col">' +
                        '<div class="check-item-box">' +
                        '<input type="checkbox" class="check-input" id="check-item-2">' +
                        '<label class="check-input-label font-16 text-extralight" for="check-item-2"></label>' +
                        '</div>' +
                        '</td>' +
                        '<td>' +
                        '<div class="action-btn" style="display: flex;">' +
                        '<button type="button" class="unstyled-btn" data-bs-toggle="modal" data-bs-target="#addLeadModal">' +
                        '<img src="https://origin-cdnh.policyboss.com/website/UI22/images/icons/pay-icon.png" alt="" />' +
                        '</button>' +
                        '<button type="button" class="unstyled-btn" data-bs-toggle="modal" data-bs-target="#addLeadModal">' +
                        '<img src="https://origin-cdnh.policyboss.com/website/UI22/images/icons/edit-field-icon.png" alt="" />' +
                        '</button>' +
                        '</div>' +
                        '</td>' +
                        '<td data-label="ERP ID">' +
                        '<span class="block font-18 text-extralight weight-500">' + Sync_Contact_Erp_Data_Id + '</span>' +
                        '</td>' +
                        '<td data-label="Contact Name">' +
                        '<span class="block font-18 text-extralight weight-500">' + sync_name + '</span>' +
                        '</td>' +
                        '<td data-label="Owner">' +
                        '<span class="block font-18 text-extralight weight-500">' + sync_name + '</span>' +
                        '<span class="block font-16 text-666">' + mask + last5 + '</span>' +
                        '</td>' +
                        '<td data-label="Vehicle Details">' +
                        '<span class="block font-16 text-extralight weight-500">' + registration_no_processed + '</span>' +
                        '<span class="block font-16 text-666">' + datalen[z].make + '</span>' +
                        '</td>' +
                        '<td data-label="Expiry Date">' +
                        '<span class="block font-18 text-extralight weight-500">' + display_date + '</span>' +
                        '</td>' +
                        /*'<td data-label="Call Back">' +
                        '<span class="block font-16 text-extralight weight-500">Call Back </span>' +
                        '<span class="block font-16 text-666">At 1 Oct, 11 AM</span>' +
                        '</td>' +
                        '<td data-label="Status">' +
                        '<span class="block font-16 weight-500 status-completed">Completed </span>' +
                        '</td>' +*/
                        '</tr>');
                    $('#Moreclick_' + datalen[z].Sync_Contact_Erp_Data_Id).click(function () {

                        var erp_id = this.id.split('_')[1];
                        more_details_section(datalen, erp_id);

                    });
                } else {}
            }
        }
		if(data_exists == false){
			 $("#tbl_list").append('<tr><td class="check-box-col" colspan="100%">No Data Available</td></tr>');
		}
    }
}
function checkMobile(input) {
    var pattern = new RegExp('^([6-9]{1}[0-9]{9})$');
    var dvid = $(input).attr('id');
    if (pattern.test(input.val()) == false) {
        return false;
    } else {
        return true;
    }
}
