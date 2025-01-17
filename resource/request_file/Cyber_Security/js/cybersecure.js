var siteURL = "";
var ss_id, fba_id, app_version, arn, srn, client_id = 2, product_id, ip_address, mac_address;
var pb_crn = 0;
var StatusCount = 0;
var response = [];
var response_1 = [];
var summary = [];
var name, mobile, email, si;
var addon_selected = false;
var addon_applied = false;
var objAddons = {};
var pageIndex = 1;
var pageCount;
var iScrollPos = 0;
var activeTab = "quote";
var addon_plan = [1801, 1802];
$(document).ready(function () {
    stringparam();
    srn = getUrlVars()["srn"];
    if (srn !== undefined) {
        showInput();
        getPremiumList(srn);
        $('#InputPage').hide();
        $('#QuotePage').show();
        $('.Inputnav').removeClass('ActiveItem');
        $('.Quotenav').addClass('ActiveItem');
        activeTab = "quote";
    }
});
var getUrlVars = function () {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
};

function stringparam() {
    ss_id = getUrlVars()["ss_id"];
    fba_id = getUrlVars()["fba_id"];
    app_version = getUrlVars()["app_version"];
    product_id = getUrlVars()["product_id"];
    srn = getUrlVars()["srn"];
    mac_address = getUrlVars()["mac_address"];
    ip_address = getUrlVars()["ip_address"];
    if ((fba_id == "" || fba_id == undefined || fba_id == "0" || app_version == "" || app_version == "0" || app_version == undefined || ss_id == "" || ss_id == undefined || ss_id == "0")) {
        $("#CyberSecure").hide();
        $("#Dashboard").hide();
        $(".warningmsg").show();
    } else {
        if (srn === undefined) {
            Get_Quote_List(pageCount, ss_id, fba_id);
            Get_App_List(pageCount, ss_id, fba_id);
            Get_Sell_List(pageCount, ss_id, fba_id);
            showDashBoard();
        }
        $(".warningmsg").hide();
    }
}
function checkInformValidation() {
    srn = getUrlVars()["srn"];
    var err = 0;
    name = srn === undefined ? document.getElementById('Name').value : document.getElementById('edit_name').value;
    var namepattern = new RegExp('^[a-zA-Z ]+$');
    mobile = srn === undefined ? document.getElementById('mobile').value : document.getElementById('edit_mobile').value;
    var mobilepattern = new RegExp('^[6-9]{1}[0-9]{9}$');
    email = srn === undefined ? document.getElementById('Email').value : document.getElementById('edit_email').value;
    var RegExpEmail = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    si = srn === undefined ? document.getElementById('SumInsured').value : document.getElementById('edit_SumInsured').value;

    if (name === '' || name === '0') {
        // err++;
        // srn === undefined ? document.getElementById('Name').classList.add('ErrorMsg') : document.getElementById('edit_name').classList.add('ErrorMsg');
    } else {
        if (name !== '') {
            if (namepattern.test(name)) {
                var namearray = name.split(" ");
                if (namearray[1] === "" || namearray[1] === undefined) {
                    err++;
                    srn === undefined ? document.getElementById('Name').classList.add('ErrorMsg') : document.getElementById('edit_name').classList.add('ErrorMsg');
                } else {
                    srn === undefined ? document.getElementById('Name').classList.remove('ErrorMsg') : document.getElementById('edit_name').classList.remove('ErrorMsg');
                }
            } else {
                err++;
                srn === undefined ? document.getElementById('Name').classList.add('ErrorMsg') : document.getElementById('edit_name').classList.add('ErrorMsg');
            }
        }
    }

    if (mobile === '') {
        err++;
        srn === undefined ? document.getElementById("mobile").classList.add('ErrorMsg') : document.getElementById("edit_mobile").classList.add('ErrorMsg');
    } else {
        if (mobile !== '' && mobilepattern.test(mobile) === false) {
            err++;
            srn === undefined ? document.getElementById("mobile").classList.add('ErrorMsg') : document.getElementById("edit_mobile").classList.add('ErrorMsg');
        } else { srn === undefined ? document.getElementById('mobile').classList.remove('ErrorMsg') : document.getElementById('edit_mobile').classList.remove('ErrorMsg'); }
    }

    if (email === '') {
        err++;
        srn === undefined ? document.getElementById("Email").classList.add('ErrorMsg') : document.getElementById("edit_email").classList.add('ErrorMsg');
    } else {
        if (email !== '' && !RegExpEmail.test(email)) {
            err++;
            srn === undefined ? document.getElementById("Email").classList.add('ErrorMsg') : document.getElementById("edit_email").classList.add('ErrorMsg');
        } else { srn === undefined ? document.getElementById('Email').classList.remove('ErrorMsg') : document.getElementById('edit_email').classList.remove('ErrorMsg'); }
    }

    if (si === '') {
        err++;
        srn === undefined ? document.getElementById("SumInsured").classList.add('ErrorMsg') : document.getElementById("edit_SumInsured").classList.add('ErrorMsg');
    } else {
        srn === undefined ? document.getElementById('SumInsured').classList.remove('ErrorMsg') : document.getElementById('edit_SumInsured').classList.remove('ErrorMsg');
    }

    if (err > 0) {
        event.preventDefault();
        event.stopPropagation();
    } else {
        initiate_premium();
    }
}
function initiate_premium() {
    StatusCount = 0;
    data = {
        "city_id": 677,
        "cs_insurance_si": si,
        "contact_name": name,
        "mobile": mobile,
        "email": email,
        "policy_tenure": 1,
        "product_id": 18,
        "method_type": "Premium",
        "cs_insurance_type": "individual",
        "execution_async": "yes",
        "crn": pb_crn,
        "ss_id": ss_id,
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
        "fba_id": fba_id,
        "app_version": app_version,
        "mac_address": mac_address,
        "ip_address": ip_address,
        "insurer_selected": "5",
        "client_id": 2,
        "client_name": "PolicyBoss"
    };
    // console.log(data);
    var obj_horizon_data = Horizon_Method_Convert("/quote/premium_initiate", data, "POST");
    $.ajax({
        type: "POST",
        data: siteURL.includes('https://') ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(data),
        url: siteURL.includes('https://') ? obj_horizon_data['url'] : GetUrl() + "/quote/premium_initiate",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log("success");
            StatusCount = 0;
            window.location.href = './cybersecure.html?srn=' + data.Summary.Request_Unique_Id + '&ss_id=' + ss_id + '&fba_id=' + fba_id + '&ip_address=' + ip_address + '&app_version=' + app_version;
        },
        error: function (error) {
            console.log(error);
        }
    });
}
function getPremiumList(ref_no) {
    console.log(ref_no);
    requestData = {
        "search_reference_number": ref_no,
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW"
    };
    var obj_horizon_data = Horizon_Method_Convert("/quote/premium_list_db", requestData, "POST");
    $.ajax({
        type: "POST",
        data: siteURL.includes('https://') ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(requestData),
        url: siteURL.includes('https://') ? obj_horizon_data['url'] : GetUrl() + "/quote/premium_list_db",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            // console.log(data);
            if (data !== null && data.Msg !== "Not Authorized") {
                response = (data.Response);
                response_1 = data.Response_1;
                summary = data.Summary;
                $('.crntxt').text('CRN: ' + summary['PB_CRN']);
                StatusCount++;
                var CreateTime = new Date(summary.Created_On);
                var CurrentTime = new Date();
                var DateDiff = Date.parse(CurrentTime) - Date.parse(CreateTime);
                console.log(DateDiff);
                var is_complete = false;
                if (StatusCount > 3 || DateDiff >= 30000 || summary['Status'] === "complete") {
                    is_complete = true;
                    console.log("Premium List - ", data);
                    document.getElementById("loader").style.display = "none";
                }
                if (is_complete === false) {
                    setTimeout(() => {
                        getPremiumList(ref_no);
                    }, 3000);
                } else {
                    pb_crn = summary.PB_CRN === "" ? summary['Request_Core'].crn : summary.PB_CRN;
                    if (response_1.length > 0) {
                        $("#quote_display").empty();
                        for (var k in response_1) {
                            $("#quote_display").append("<div class='quote_grid'>" +
                                "<div style='box-shadow: 2px 3px 4px 1px rgb(181, 177, 177);'>" +
                                "<img class='insuLogo' src='images/" + const_insurerlogo[response_1[k].Insurer_Id] + "' width='100%'></div>" +
                                "<div class='planInfo'><p style='text-align:left;padding:0px 3px'>Plan : <span style='color:gray;'>" +
                                "<strong>" + response_1[k].Plan_Name + "</strong></span></p>" +
                                "<p style='text-align:left;padding:3px 3px'>Sum Insured </p><div style='text-align:left;color:gray;padding:0px 8px;'>₹" +
                                "<strong>" + response_1[k].Sum_Insured + "</strong></div></div>" +
                                "<div class='insu_btn'><p>premium</p><button id='plan_" + response_1[k].Plan_Id + "'" +
                                "class='buy_amt' onclick='premium_breakup(" + JSON.stringify(response_1[k]) + ")'>₹" + response_1[k]['Premium_Breakup'].final_premium + "/ 1yr</button>" +
                                "</div></div>");
                        }
                    }
                    if (data.hasOwnProperty('Addon_Request') && data['Addon_Request'] !== null) {
                        reload_addons(data.Addon_Request);
                    }
                }
            } else {
                console.log("quotes not available");
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function show_customizePlan() {
    $('.CustomizePlan').toggle();
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
    if (url.includes("request_file")) {
        newurl = "http://localhost:6200";
    } else if (url.includes("qa")) {
        newurl = "http://qa.policyboss.com";
    } else if (url.includes("www") || url.includes("origin-cdnh") || url.includes("cloudfront")) {
        newurl = "https://www.policyboss.com";
    }
    return newurl;
}
function BuyNowUrl() {
    var url = window.location.href;
    var newurl;
    if (url.includes("request_file")) {
        newurl = "http://localhost:6200";
    } else if (url.includes("qa")) {
        newurl = "http://qa.policyboss.com/cybersecurity";
    } else if (url.includes("www") || url.includes("origin-cdnh") || url.includes("cloudfront")) {
        newurl = "https://www.policyboss.com/cyber-insurance";
    }
    return newurl;
}
function premium_breakup(res) {
    var policy_type = (res.Plan_Id === 1801 || res.Plan_Id === 1811) ? 'Individual' : 'Family';

    var prm_brkup = res['Premium_Breakup']['addon'];
    $(".premium_content").empty();
    if (addon_applied === false || addon_plan.indexOf(res.Plan_Id) < 0) {
        $(".premium_content").append("<p><b>Plan Name : </b><span>" + res.Plan_Name + "</span></p>" +
            "<p><b>Plan Type : </b><span>" + policy_type + "</span></p>" +
            "<p><b>Base Premium : </b><span>" + res['Premium_Breakup'].net_premium + "</span></p>" +
            "<p><b>Service Tax : </b><span>" + (res['Premium_Breakup'].service_tax).toFixed(2) + "</span></p>" +
            "<p><b>Total Premium : </b><span>" + res['Premium_Breakup'].final_premium + "</span></p>");
    } else {
        var serv_tax = (res['Premium_Breakup'].net_premium + prm_brkup.addon_malware) * 0.18;
        $(".premium_content").append("<p><b>Plan Name : </b><span>" + res.Plan_Name + "</span></p>" +
            "<p><b>Plan Type : </b><span>" + policy_type + "</span></p>" +
            "<p><b>Base Premium : </b><span>" + res['Premium_Breakup'].net_premium + "</span></p>" +
            "<p><b>Addon Rate : </b><span>" + prm_brkup.addon_malware + "</span></p>" +
            "<p><b>Service Tax : </b><span>" + (serv_tax).toFixed(2) + "</span></p>" +
            "<p><b>Total Premium : </b><span>" + prm_brkup.addon_final_premium + "</span></p>");
    }

    $(".premium_footer").empty();
    $(".premium_footer").append("<button class='close_btn' onclick='closePopup()'>Close</button>&nbsp;" +
        "&nbsp;<button class='buy_now_btn' onclick='proposal_redirect(" + '"' + res.Service_Log_Unique_Id + '"' + ")'>Buy Now</button>");

    $('.Premiumpopup').show();
}
function proposal_redirect(arn) {
    window.location.href = BuyNowUrl() + '/proposal?client_id=2&arn=' + arn + '&is_posp=NonPOSP&ss_id=' + ss_id;
}
function closePopup() {
    $('.Premiumpopup').hide();
    $('.Addon_popup').hide();
}
function EditCustdetails() {
    // console.log(summary);
    if (summary !== null || summary !== "") {
        var request = summary['Request_Core'];
        document.getElementById("edit_name").value = request['contact_name'];
        document.getElementById('edit_name').classList.remove('ErrorMsg');
        document.getElementById("edit_mobile").value = request['mobile'];
        document.getElementById('edit_mobile').classList.remove('ErrorMsg');
        document.getElementById("edit_email").value = request['email'];
        document.getElementById('edit_email').classList.remove('ErrorMsg');
        document.getElementById("edit_SumInsured").value = request['cs_insurance_si'];
        document.getElementById('edit_SumInsured').classList.remove('ErrorMsg');
        $('.Edit_popup').show();
    }
}
function close_edit_popup() {
    $('.Edit_popup').hide();
}
function showAddons() {
    $('.Addon_popup').show();
}
function hideAddons() {
    $('.Addon_popup').hide();
}
function calculate_addon() {
    if (event.target.checked) {
        addon_selected = true;
        objAddons[event.target.value] = "yes";
    } else {
        addon_selected = false;
        objAddons[event.target.value] = "no";
    }
}
function showDashBoard() {
    $('#CyberSecure').hide();
    $('#Dashboard').show();
    $('#quoteId').show();
    $('#applicationId').hide();
    $('#completeId').hide();
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
    $('#quoteId').hide();
    $('#applicationId').hide();
    $('#completeId').show();

    $('.Quotenav').removeClass('ActivenavItem');
    $('.Applicationnav').removeClass('ActivenavItem');
    $('.Completenav').addClass('ActivenavItem');
}

function showInput() {
    activeTab = "";
    $('#CyberSecure').show();
    $('#Dashboard').hide();
    $('#quoteId').hide();
    $('#applicationId').hide();
    $('#completeId').hide();
}

function update_addons() {
    addon_applied = false;
    var obj = summary['Request_Core'];
    obj['data_type'] = "addon_quote";
    obj['addon_standalone'] = objAddons;
    for (var key in objAddons) {
        if (objAddons[key] === 'yes') {
            addon_applied = true;
        }
    }
    var obj_horizon_data = Horizon_Method_Convert("/quote/save_user_data", obj, "POST");
    for (var k in response_1) {
        if (addon_applied === true && addon_plan.indexOf(response_1[k].Plan_Id) > -1) {
            $("#plan_" + response_1[k].Plan_Id).text("₹" + response_1[k]['Premium_Breakup']['addon'].addon_final_premium + "/1yr");
        } else {
            $("#plan_" + response_1[k].Plan_Id).text("₹" + response_1[k]['Premium_Breakup'].final_premium + "/1yr");
        }
    }
    $.ajax({
        type: "POST",
        data: siteURL.includes('https://') ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(obj),
        url: siteURL.includes('https://') ? obj_horizon_data['url'] : GetUrl() + "/quote/save_user_data",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            $('.Addon_popup').hide();
        },
        error: function (error) {
            console.log(error);
        }
    });
}
function Get_Quote_List() {
    var url = "/user_datas/quicklist/18/SEARCH/" + ss_id + "/" + fba_id + "/" + pageIndex + "/0";

    $.ajax({
        type: "GET",
        data: siteURL.indexOf('https') == 0 ? { 'method_name': url } : "",
        url: siteURL.indexOf('https') == 0 ? GeteditUrl() + '/TwoWheelerInsurance/call_horizon_get' : GetUrl() + url,
        dataType: "json",
        success: function (data) {
            console.log("QUOTE-", data.length);

            if (data.length > 0) {
                $("#quoteId").empty();
                for (var i in data) {
                    if (data[i].Customer_Name === '' || data[i].Customer_Name.includes('Undefined')) {
                        data[i].Customer_Name = 'No Details';
                    }
                    $("#quoteId").append(" <div class='CustInfo' id='quote_list_id_'" + data[i].CRN + ">"
                        + "<div><div class='fontWeight' style='padding: 0px 0px 4px 0px;'>" + data[i].Customer_Name
                        + "</div><div>CRN:<span class='fontWeight'>" + data[i].CRN + "<span></div></div>"
                        + "<div class='centerAlign'>SUM INSURED<div class='data'>" + data[i].Sum_Insured + "</div></div>"
                        + "<div class='centerAlign'>QUOTE DATE<div class='data'>" + data[i].Quote_Date_Mobile + "</div></div>"
                        + "</div>");
                }
            }
        },
        error: function (result) {
            console.log(result)
        }
    });
}
var const_insurerlogo = {
    "5": "HDFC.png",
    "1": "BAJAJ.png"
};
function Get_App_List() {
    var url = "/user_datas/quicklist/18/APPLICATION/" + ss_id + "/" + fba_id + "/" + pageIndex + "/0";

    $.ajax({
        type: "GET",
        data: siteURL.indexOf('https') == 0 ? { 'method_name': url } : "",
        url: siteURL.indexOf('https') == 0 ? GeteditUrl() + '/TwoWheelerInsurance/call_horizon_get' : GetUrl() + url,
        dataType: "json",
        success: function (data) {
            console.log("APP-", data.length);

            if (data.length > 0) {
                $("#applicationId").empty();
                for (var i in data) {
                    if (data[i].Customer_Name === '' || data[i].Customer_Name.includes('Undefined')) {
                        data[i].Customer_Name = 'No Details';
                    }
                    $("#applicationId").append("<div class='app_quoteDiv'>"
                        + "<div class='ins_logo'>"
                        + "<img src='./images/" + const_insurerlogo[data[i].Insurer] + "' class='img-responsive' style='width:100%;'>"
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
function Get_Sell_List() {
    var url = "/user_datas/quicklist/18/SELL/" + ss_id + "/" + fba_id + "/" + pageIndex + "/0";

    $.ajax({
        type: "GET",
        data: siteURL.indexOf('https') == 0 ? { 'method_name': url } : "",
        url: siteURL.indexOf('https') == 0 ? GeteditUrl() + '/TwoWheelerInsurance/call_horizon_get' : GetUrl() + url,
        dataType: "json",
        success: function (data) {
            console.log("COMPLETE-", data.length);

            if (data.length > 0) {
                $("#completeId").empty();
                for (var i in data) {
                    if (data[i].Customer_Name === '' || data[i].Customer_Name.includes('Undefined')) {
                        data[i].Customer_Name = 'No Details';
                    }
                    $("#completeId").append("<div class='app_quoteDiv'>"
                        + "<div class='ins_logo'>"
                        + "<img src='./images/" + const_insurerlogo[data[i].Insurer] + "' class='img-responsive' style='width:100%;'>"
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
function Reload() {
    location.reload(true)
};
function reload_addons(addon_req) {
    if (addon_req.hasOwnProperty('addon_standalone') && addon_req['addon_standalone'].hasOwnProperty('addon_malware')) {
        if (addon_req['addon_standalone'].addon_malware === 'yes') {
            $('#addon_malware').prop('checked', true);
            addon_applied = true;
            for (var k in response_1) {
                if (addon_plan.indexOf(response_1[k].Plan_Id) > -1) {
                    $("#plan_" + response_1[k].Plan_Id).text("₹" + response_1[k]['Premium_Breakup']['addon'].addon_final_premium + "/1yr");
                } else {
                    $("#plan_" + response_1[k].Plan_Id).text("₹" + response_1[k]['Premium_Breakup'].final_premium + "/1yr");
                }
            }
        }
    }
}
$(window).scroll(function () {
    var iCurScrollPos = $(this).scrollTop();
    if (iCurScrollPos > iScrollPos) {
        //Scrolling Down
        if ($(window).scrollTop() == $(document).height() - $(window).height()) {
            pageIndex++;
            var tab = activeTab;
            if (tab == 'SENTLINK') {
                Get_Quote_List();
            } else if (tab == 'PROPOSAL') {
                Get_App_List();
            } else if (tab == 'SELL') {
                Get_Sell_List();
            }
        }
    }
});