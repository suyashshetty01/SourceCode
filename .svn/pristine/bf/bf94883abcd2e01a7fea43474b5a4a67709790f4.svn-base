var ss_id, fba_id, ip_address, app_version, mac_address, mobile_no, srn, client_id = 2, editmodify, header, sub_fba_id, product_id;
var sliderVal = 500;
var pincodeArray = [];
var pincodeFlag = false;
var cityMaster = {};
var cityFlag = false;
var siteURL = "";
var StatusCount = 0;
var ChkCover_Name;
var pb_crn = 0;
var CRN = "";
var CoverDays;
var TotalAge, birth_date;
var lm_request = [];
var objCoverRow = "";
var req_unique_id;
var tab = "";
var response = [];
var summary = [];
var tenure = 1;

$(document).ready(function () {
    //stringparam();
    input = document.getElementById("pincodeId");
    input.addEventListener("mousewheel", function (event) {
        this.blur();
    });
    $(function () {
        PopulatePincode();
    });
    jQuery(function ($) { // DOM ready and $ alias secured
        $('#pincodeId').on('keydown', function (e) {
            if ($("#pincodeId").val().length === 3) {
                // $("#pincodeId").empty();
                pincodeFlag = true;
                var vari = autocomplete(document.getElementById("pincodeId"), pincodeArray);
                console.log(vari);
            }
        });
    });

    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");
    output.innerHTML = slider.value;

    slider.oninput = function () {
        output.innerHTML = this.value;
    };

});
function GetDashboard() {
    window.location.href = './hospicash.html?ss_id=' + ss_id + '&fba_id=' + fba_id + '&app_version=' + app_version + '&product_id=22';
    //$('#hospi_input').hide();
    //$('#hospi_dashboard').show();
}
function OpenCal() {
    var range = new Date().getFullYear() - 55;
    $('#mydatepicker').datepicker({
        changeYear: true,
        changeMonth: true,
        dateFormat: 'yy-mm-dd',
        yearRange: range + ':c',
        minDate: new Date(range, (new Date()).getMonth(), (new Date()).getDate() + 1),
        maxDate: '-3m'
    }).datepicker('show');
}
function sliderEvent(event) {
    sliderVal = event;
}

function finishFunction() {
    $('#Inform').removeClass('display');
    $('.Information').addClass('ActiveItem');
    $('#summary').addClass('display');
    $('#quotes').addClass('display');
    $('.Summary').removeClass('ActiveItem');
    $('.Quote').removeClass('ActiveItem');
    $('#Inform').load();
}

function submitBtnValidation() {
    var err = 0;
    tab = "quote"
    if ($("#checkedBox input:checked").length > 0) {
        document.getElementById("showErr_msg").innerHTML = "";
        $('#summary').removeClass('display');
        $('.Summary').addClass('ActiveItem');
        $('#quotes').addClass('display');
        $('#Inform').addClass('display');
        $('.Information').removeClass('ActiveItem');
        $('.Quote').removeClass('ActiveItem');
        summary_premium_initiate();
    } else {
        err++;
        event.preventDefault();
        event.stopPropagation();
        document.getElementById("showErr_msg").innerHTML = "select atleast one cover";
    }
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
};

function stringparam() {
    ss_id = getUrlVars()["ss_id"];
    fba_id = getUrlVars()["fba_id"];
    ip_address = getUrlVars()["ip_address"];
    app_version = getUrlVars()["app_version"];
    mac_address = getUrlVars()["mac_address"];
    sub_fba_id = 0;//getUrlVars()["sub_fba_id"];
    mobile_no = getUrlVars()["mobile_no"];
    product_id = getUrlVars()["product_id"];
    //    if ((fba_id === "" || fba_id === undefined || fba_id === "0" || ip_address === '' || ip_address === '0' || ip_address === undefined || app_version === "" || app_version === "0" || app_version === undefined || ss_id === "" || ss_id === undefined || ss_id === "0")) {
    //    }
}

function checkInformValidation() {
    var err = 0;
    tab = "input";
    CoverDays = document.getElementById('CoverDays').value;
    var mydatepicker = document.getElementById('mydatepicker').value;
    var date = new Date(mydatepicker);
    var getYear = date.getFullYear();
    var today = new Date();
    TotalAge = today.getFullYear() - getYear;
    var Name = document.getElementById('Name').value;
    var namepattern = new RegExp('^[a-zA-Z ]+$');
    var mobile = document.getElementById('mobile').value;
    var mobilepattern = new RegExp('^[7-9]{1}[0-9]{9}$');
    var pincodeId = document.getElementById('pincodeId').value;

    if (CoverDays === '' || CoverDays === '0') {
        err++;
        document.getElementById("CoverDays").classList.add('ErrorMsg');
        event.preventDefault();
        event.stopPropagation();
    } else {
        document.getElementById('CoverDays').classList.remove('ErrorMsg');
    }


    if (mydatepicker === '' || mydatepicker === '0') {
        err++;
        document.getElementById("mydatepicker").classList.add('ErrorMsg');
        event.preventDefault();
        event.stopPropagation();
    } else {
        birth_date = mydatepicker;
        document.getElementById('mydatepicker').classList.remove('ErrorMsg');
    }

    if (sliderVal < 500) {
        err++;
        var elem = document.getElementById("demo");
        elem.textContent = "Cover Amount should not be 0";
        elem.style.color = "Red";
        event.preventDefault();
        event.stopPropagation();
    } else {
        document.getElementById("demo");
    }

    if (Name === '' || Name === '0') {
        err++;
        document.getElementById("Name").classList.add('ErrorMsg');
        event.preventDefault();
        event.stopPropagation();
    } else {
        if (Name !== '') {
            if (namepattern.test(Name)) {
                var namearray = Name.split(" ");
                if (namearray[1] === "" || namearray[1] === undefined) {
                    err++;
                    document.getElementById("form_Error").innerHTML = "Enter FullName";
                } else {
                    document.getElementById("form_Error").innerHTML = "";
                    document.getElementById('Name').classList.remove('ErrorMsg');
                }
            } else {
                err++;
                document.getElementById('Name').classList.add('ErrorMsg');
            }
        }
    }

    if (mobile === '' || mobilepattern.test(mobile) === false) {
        err++;
        document.getElementById("mobile").classList.add('ErrorMsg');
        event.preventDefault();
        event.stopPropagation();
    } else {
        document.getElementById('mobile').classList.remove('ErrorMsg');
    }

    if (pincodeId === '' || pincodeId === '0' || cityMaster['City_Id'] === undefined) {
        err++;
        document.getElementById("pincodeId").classList.add('ErrorMsg');
        event.preventDefault();
        event.stopPropagation();
    } else {
        document.getElementById('pincodeId').classList.remove('ErrorMsg');
    }

    if (err > 0) {
        event.preventDefault();
        event.stopPropagation();
    } else {
        initiate_premium();
    }
}

function ValidateNumber(event) {
    if (!(/^[0-9]*$/.test(event.target.value))) {
        event.target.value = "";
    }
}

function trimValue(event) {
    event.target.value = event.target.value.replace(/\s+/g, ' ');
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
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
        event.preventDefault();
    }
}

//   Premium Initiate

function initiate_premium() {
    //StatusCount = 0;
    data = {
        "city_id": cityMaster['City_Id'],
        "city_name": cityMaster['City'],
        "permanent_pincode": cityMaster['Pincode'],
        "health_insurance_si": "500000",
        "per_day_si": sliderVal,
        "contact_name": $("#Name").val(),
        "mobile": $("#mobile").val(),
        "policy_tenure": tenure,
        "policy_cover": CoverDays,
        "product_id": 2,
        "state_name": cityMaster['State'],
        "member_1_gender": "",
        "member_2_gender": "",
        "member_3_gender": "",
        "member_4_gender": "",
        "member_5_gender": "",
        "member_6_gender": "",
        "member_1_age": -1,
        "member_2_age": -1,
        "member_3_age": -1,
        "member_4_age": -1,
        "member_5_age": -1,
        "member_6_age": -1,
        "member_1_birth_date": "",
        "member_2_birth_date": "",
        "member_3_birth_date": "",
        "member_4_birth_date": "",
        "member_5_birth_date": "",
        "member_6_birth_date": "",
        "method_type": "Premium",
        "health_insurance_type": "individual",
        "execution_async": "yes",
        "crn": pb_crn,
        "ss_id": ss_id,
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
        "fba_id": fba_id,
        "app_version": app_version,
        "insurer_selected": "6",
        "client_id": 2,
        "client_name": "PolicyBoss",
        "topup_applied": "none"
    };
    if (TotalAge < 18) {
        data["adult_count"] = 0;
        data["child_count"] = 1;
        data["member_3_gender"] = "M";
        data["member_3_age"] = TotalAge;
        data["member_3_birth_date"] = birth_date;
    } else {
        data["adult_count"] = 1;
        data["child_count"] = 0;
        data["member_1_gender"] = "M";
        data["member_1_age"] = TotalAge;
        data["member_1_birth_date"] = birth_date;
    }
    // data["opted_covers"] = ChkCover_Name;
    if (product_id === "22") {
        data["is_hospi"] = "yes";
    }
    console.log(data);
    var obj_horizon_data = Horizon_Method_Convert("/quote/premium_initiate", data, "POST");
    $.ajax({
        type: "POST",
        data: siteURL.indexOf('https://') === 0 ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(data),
        url: siteURL.indexOf('https://') === 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/premium_initiate",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log("success");
            response = data;
            if (tab === "input") {
                window.location.href = './hospicash.html?srn=' + data.Summary.Request_Unique_Id + '&tab=' + tab + '&ss_id=' + ss_id + '&fba_id=' + fba_id + '&app_version=' + app_version + '&product_id=22';
            }
            else {
                window.location.href = './hospicash.html?srn=' + data.Summary.Request_Unique_Id + '&tab=' + tab + '&ss_id=' + ss_id + '&fba_id=' + fba_id + '&app_version=' + app_version + '&product_id=22';
            }

        },
        error: function (error) {
            console.log(error);
        }
    });
}

function summary_premium_initiate() {
    //StatusCount = 0;
    var requestCore = summary["Request_Core"];
    data = {
        "city_id": requestCore['city_id'],
        "city_name": requestCore['city_name'],
        "permanent_pincode": requestCore['permanent_pincode'],
        "health_insurance_si": "500000",
        "per_day_si": requestCore['per_day_si'],
        "contact_name": requestCore['contact_name'],
        "mobile": requestCore['mobile'],
        "policy_tenure": requestCore['policy_tenure'],
        "policy_cover": requestCore['policy_cover'],
        "product_id": 2,
        "state_name": requestCore['state_name'],
        "member_1_gender": "",
        "member_2_gender": "",
        "member_3_gender": "",
        "member_4_gender": "",
        "member_5_gender": "",
        "member_6_gender": "",
        "member_1_age": -1,
        "member_2_age": -1,
        "member_3_age": -1,
        "member_4_age": -1,
        "member_5_age": -1,
        "member_6_age": -1,
        "member_1_birth_date": "",
        "member_2_birth_date": "",
        "member_3_birth_date": "",
        "member_4_birth_date": "",
        "member_5_birth_date": "",
        "member_6_birth_date": "",
        "method_type": "Premium",
        "health_insurance_type": "individual",
        "execution_async": "yes",
        "crn": requestCore['crn'],
        "ss_id": requestCore['ss_id'],
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
        "fba_id": requestCore['fba_id'],
        "app_version": app_version,
        "insurer_selected": "6",
        "client_id": 2,
        "client_name": "PolicyBoss",
        "topup_applied": "none",
        "quote_srn": srn
    };
    if (requestCore['member_1_age'] === -1 && requestCore['member_3_age'] !== -1) {
        data["adult_count"] = 0;
        data["child_count"] = 1;
        data["member_3_age"] = requestCore['member_3_age'];
        data["member_3_gender"] = requestCore['member_3_gender'];
        data["member_3_birth_date"] = requestCore['member_3_birth_date'];
    } else {
        data["adult_count"] = 1;
        data["child_count"] = 0;
        data["member_1_age"] = requestCore['member_1_age'];
        data["member_1_gender"] = requestCore['member_1_gender'];
        data["member_1_birth_date"] = requestCore['member_1_birth_date'];
    }
    data["opted_covers"] = ChkCover_Name;
    if (product_id === "22") {
        data["is_hospi"] = "yes";
    }
    console.log(data);
    var obj_horizon_data = Horizon_Method_Convert("/quote/premium_initiate", data, "POST");
    $.ajax({
        type: "POST",
        data: siteURL.indexOf('https://') === 0 ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(data),
        url: siteURL.indexOf('https://') === 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/premium_initiate",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log("success");

            if (tab === "input") {
                window.location.href = './hospicash.html?srn=' + data.Summary.Request_Unique_Id + '&tab=' + tab + '&ss_id=' + ss_id + '&fba_id=' + fba_id + '&app_version=' + app_version + '&product_id=22';
            }
            else {
                window.location.href = './hospicash.html?srn=' + data.Summary.Request_Unique_Id + '&tab=' + tab + '&ss_id=' + ss_id + '&fba_id=' + fba_id + '&app_version=' + app_version + '&product_id=22';
            }

        },
        error: function (error) {
            console.log(error);
        }
    });

}


function getPremiumList(ref_no) {
    console.log(ref_no);
    quoteString = "Summary";
    requestData = {
        "search_reference_number": ref_no,
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW"
    };
    var obj_horizon_data = Horizon_Method_Convert("/quote/premium_list_db", requestData, "POST");
    $.ajax({
        type: "POST",
        data: siteURL.indexOf('https://') === 0 ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(requestData),
        url: siteURL.indexOf('https://') === 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/premium_list_db",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            response = [];
            console.log(data);
            if (data !== null && data.Msg !== "Not Authorized") {
                response = (data.Response);
                summary = data.Summary;
                $('.CRN').text(data['Summary']['PB_CRN']);
                var rowQuote = $("#quote_block").html();
                StatusCount++;
                var CreateTime = new Date(data['Summary'].Created_On);
                var CurrentTime = new Date();
                var DateDiff = Date.parse(CurrentTime) - Date.parse(CreateTime);
                console.log(DateDiff);
                var is_complete = false;
                if (DateDiff >= 50000 || data['Summary']['Status'] === "complete" || response.length === 1) {
                    is_complete = true;
                    console.log("Premium List - ", data);
                    console.log("Success");
                    document.getElementById("loader").style.display = "none";
                }
                if (is_complete === false) {
                    setTimeout(() => {
                        getPremiumList(ref_no);
                    }, 3000);
                } else {
                    $("#quote_block").html('');
                    pb_crn = data['Summary'].PB_CRN === "" ? data['Summary']['Request_Core'].crn : data['Summary'].PB_CRN;
                    var hospifund = response[0].Plan_List[0]['Premium_Breakup']['hospicash'];
                    for (var k in hospifund) {
                        var rowQuoteUpdate = rowQuote;
                        var hospi_details = hospifund[k].split("|");
                        var jsonDataPrem = {
                            "___checkbox_id___": "checkbox_" + k,
                            "___premium___": hospi_details[1],
                            "___cover_name___": hospi_details[0],
                            "___si___": data['Summary']['Request_Core']['per_day_si'],
                            "___tenure___": data['Summary']['Request_Core']['policy_cover']
                        };
                        for (var j in jsonDataPrem) {
                            rowQuoteUpdate = rowQuoteUpdate.replaceAll(j, jsonDataPrem[j]);
                        }
                        objCoverRow = rowQuoteUpdate;
                        // objCoverRow.show();
                        $("#quote_block").append(objCoverRow);
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


function loadInfo(ref_no) {
    $('.summaryLoader').show();
    console.log(ref_no);
    quoteString = "quote";
    document.getElementById("selected_cover").style.display = "none";
    requestData = {
        "search_reference_number": ref_no,
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW"
    };
    var obj_horizon_data = Horizon_Method_Convert("/quote/premium_list_db", requestData, "POST");
    $.ajax({
        type: "POST",
        data: siteURL.indexOf('https://') === 0 ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(requestData),
        url: siteURL.indexOf('https://') === 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/premium_list_db",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            response = [];
            if (data !== null && data.Msg !== "Not Authorized") {
                response = (data.Response);
                lm_request = data['Summary']['Request_Core'];
                $('.CRN').text(data['Summary']['PB_CRN']);
                var rowQuote = $('#selected_cover').html();
                StatusCount++;
                var CreateTime = new Date(data['Summary'].Created_On);
                var CurrentTime = new Date();
                var DateDiff = Date.parse(CurrentTime) - Date.parse(CreateTime);
                console.log(DateDiff);
                var is_complete = false;
                if (DateDiff >= 50000 || data['Summary']['Status'] === "complete" || response.length === 1) {
                    is_complete = true;
                    console.log("Premium List - ", data);
                }

                if (is_complete === false) {
                    setTimeout(() => {
                        loadInfo(ref_no);
                    }, 3000);
                } else {
                    $('.summaryLoader').hide();
                    $('#selected_cover').html('');
                    pb_crn = data['Summary'].PB_CRN === "" ? data['Summary']['Request_Core'].crn : data['Summary'].PB_CRN;
                    var hospifund = response[0].Plan_List[0]['Premium_Breakup']['hospicash'];
                    for (var k in hospifund) {
                        var rowQuoteUpdate = rowQuote;
                        var hospi_details = hospifund[k].split("|");
                        var jsonDataPrem = {
                            "___premium___": hospi_details[1],
                            "___cover_name___": hospi_details[0],
                            "___si___": lm_request['per_day_si'],
                            "___tenure___": lm_request['policy_cover']
                        };
                        for (var j in jsonDataPrem) {
                            rowQuoteUpdate = rowQuoteUpdate.replaceAll(j, jsonDataPrem[j]);
                        }
                        objCoverRow = rowQuoteUpdate;
                        // objCoverRow.show();
                        $('#selected_cover').append(objCoverRow);
                        document.getElementById("loader1").style.display = "none";
                        document.getElementById("selected_cover").style.display = "block";
                    }
                }
                var custData = $('#cust_details').html();
                $('#cust_details').html('');
                var custDataUpdate = custData;
                var coverData = $('#cover_details').html();
                $('#cover_details').html('');
                var coverDataUpdate = coverData;
                var jsonDataCust = {
                    "___customer_name___": lm_request['contact_name'],
                    "___customer_mobile___": lm_request['mobile'],
                    "___city___": lm_request['city_name'],
                    "___customer_age___": lm_request['elder_member_age']
                };
                var jsonDataCover = {
                    "___cover_amount___": lm_request['per_day_si'],
                    "___cover_tenure___": lm_request['policy_cover']
                };

                for (var i in jsonDataCust) {
                    custDataUpdate = custDataUpdate.replaceAll(i, jsonDataCust[i]);
                }
                for (var k in jsonDataCover) {
                    coverDataUpdate = coverDataUpdate.replaceAll(k, jsonDataCover[k]);
                }
                var objCustomer = custDataUpdate;
                // objCustomer.show();
                $('#cust_details').append(objCustomer);
                var objCover = coverDataUpdate;
                // objCover.show();
                $('#cover_details').append(objCover);
            } else {
                console.log("quotes not available");
            }
        },
        error: function (error) {
            console.log(error);
        }
    });

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

function calculate() {
    document.getElementById("showErr_msg").innerHTML = "";
    var el = 0;
    var i = 0;
    var total = 0;
    ChkCover_Name = "";
    while (el = document.getElementsByName("chk")[i++]) {
        if (el.checked) {
            total = total + Number(el.value);
            ChkCover_Name = ChkCover_Name === "" ? el.parentNode['id'] : ChkCover_Name + '|' + el.parentNode['id'];
        }
    }
    // var div = document.getElementById("SubmitBtn");
    // div.innerHTML = "Total : " + total;
    // console.log("Premium: ₹" + total);
    // console.log("cover - ", ChkCover_Name);

    var div = document.getElementById("total_Amt");
    div.innerHTML = total;
    console.log("Premium: " + total);
    console.log("cover - ", ChkCover_Name);
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function proposal_redirect() {
    var arn = response[0]['Plan_List'][0].Service_Log_Unique_Id;
    var ss_id = lm_request.ss_id;
    console.log(ss_id);
    window.location.href = GeteditUrl() + '/Health/proposal-details?client_id=2&arn=' + arn + '&is_posp=NonPOSP' + '&ss_id=' + ss_id;//LIVE
    // window.location.href = 'http://localhost:4200/proposal-details?client_id=2&arn=' + arn + '&is_posp=NonPOSP' + '&ss_id=' + ss_id;//local
}

//   Pincode ********************

function GetUrl() {
    var url = window.location.href;
    var newurl;
    if (url.includes("request_file")) {
        //newurl = "http://localhost:3000";
        newurl = "http://horizon.policyboss.com:5000";
    } else if (url.includes("qa")) {
        newurl = "http://qa-horizon.policyboss.com:3000";
    } else if (url.includes("www") || url.includes("origin-cdnh") || url.includes("cloudfront")) {
        newurl = "http://horizon.policyboss.com:5000";
    }
    return newurl;
}

function GeteditUrl() {
    var url = window.location.href;
    //alert(url.includes("health"));
    var newurl;
    //newurl = "http://qa.policyboss.com";
    if (url.includes("request_file")) {
        newurl = "http://localhost:4200";
    } else if (url.includes("qa")) {
        newurl = "http://qa.policyboss.com";
    } else if (url.includes("www") || url.includes("origin-cdnh") || url.includes("cloudfront")) {
        newurl = "https://www.policyboss.com";
    }
    return newurl;
}

function PopulatePincode() {
    $.ajax({
        type: "GET",
        url: siteURL.indexOf('https://') === 0 ? GeteditUrl() + "/TwoWheelerInsurance/call_horizon_get?method_name=/quote/getPincodes" : GetUrl() + "/quote/getPincodes",
        success: function (data) {
            console.log("Pincodes-", data.length);
            if (pincodeArray.length <= 0) {
                for (i = 0; i < data.length; i++) {
                    pincodeArray.push({ Pincode: data[i].Pincode, City: data[i].City, City_Id: data[i].City_Id, State: data[i].State });
                }
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function autocomplete(inp, arr) {
    var currentFocus;
    console.log($("#pincodeId").val());
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, c, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();

        if (!val) {
            return false;
        } else if (pincodeFlag) {
            // if (val.length > 3) {
            // currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            var k = 0;
            for (i = 0; i < arr.length; i++) {
                /*check if the item starts with the same letters as the text field value:*/

                if ((pincodeFlag && (arr[i].Pincode ? arr[i].Pincode.toString().substr(0, val.length) === val : ""))) {
                    k = k + 1;
                    if (k < 5) {
                        /*create a DIV element for each matching element:*/
                        b = document.createElement("DIV");
                        if (pincodeFlag) {
                            /*make the matching letters bold:*/
                            b.innerHTML = "<strong>" + (arr[i].Pincode ? arr[i].Pincode.toString().substr(0, val.length) : "") + "</strong>";
                            b.innerHTML += (arr[i].Pincode ? arr[i].Pincode.toString().substr(val.length) : "");
                            b.innerHTML += "(" + arr[i].City + ")";
                            /*insert a input field that will hold the current array item's value:*/
                            b.innerHTML += "<input type='hidden' value='" + arr[i].Pincode + "'>";
                            b.innerHTML += "<input type='hidden' id='myField' value='" + JSON.stringify(arr[i]) + "'/>";
                        }


                        /*execute a function when someone clicks on the item value (DIV element):*/
                        b.addEventListener("click", function (e) {
                            if (pincodeFlag) {
                                /*insert the value for the autocomplete text field:*/
                                cityMaster = JSON.parse(this.getElementsByTagName("input")[1].value);
                                inp.value = this.getElementsByTagName("input")[0].value;
                                console.log("cityMaster - ", cityMaster);
                            }


                        });
                        a.appendChild(b);

                    }

                }
            }

            // }
        }

    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x)
            x = x.getElementsByTagName("div");
        if (e.keyCode === 40) {
            /*If the arrow DOWN key is pressed,
             increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode === 38) { //up
            /*If the arrow UP key is pressed,
             decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode === 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x)
                    x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x)
            return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length)
            currentFocus = 0;
        if (currentFocus < 0)
            currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    ;
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
         except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt !== x[i] && elmnt !== inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    ;
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}
function set_tenure(years) {
    $('.tenure_btn').removeClass('tenure_Active');
    $("#tenure_" + years).addClass('tenure_Active');
    tenure = years;
}
function editmodify() {
    var srn = getUrlVars()["srn"];
    var tab = getUrlVars()["tab"];
    var requestData = {
        "search_reference_number": srn,
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW"
    };
    var obj_horizon_data = Horizon_Method_Convert("/quote/premium_summary", requestData, "POST");
    $.ajax({
        type: "POST",
        data: siteURL.indexOf('https://') === 0 ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(requestData),
        url: siteURL.indexOf('https://') === 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/premium_summary",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            var request = data['Request'];
            if (data !== null || data !== "") {

                $('#hospi_dashboard').hide();
                $('#hospi_input').show();
                $('.Information').addClass('ActiveItem');
                $('.Inputnav').addClass('ActiveItem');
                $('.Dashboardnav').removeClass('ActiveItem');
                $('.Quote').removeClass('ActiveItem');
                $('.Summary').removeClass('ActiveItem');
                $('#Inform').removeClass('display');
                $('#quotes').addClass('display');
                $('#summary').addClass('display');

                if (request['adult_count'] > 0) {
                    $('#mydatepicker').val(request['member_1_birth_date']);
                } else {
                    $('#mydatepicker').val(request['member_3_birth_date']);
                }
                $('#CoverDays').val(request['policy_cover']);
                $('#Name').val(request['contact_name']);
                $('#mobile').val(request['mobile']);
                $("#demo").text(request['per_day_si']);
                $("input[type=range]").val(request['per_day_si']);
                sliderVal = request['per_day_si'];
                set_tenure(request['policy_tenure']);
                document.getElementById("pincodeId").value = request['permanent_pincode'];
                //$('#pincodeId').val(request['permanent_pincode']);
                cityMaster["Pincode"] = request['permanent_pincode'];
                cityMaster["City"] = request['city_name'];
                cityMaster["City_Id"] = request['city_id'];
                cityMaster["State"] = request['state_name'];

            }
        }
    });

}