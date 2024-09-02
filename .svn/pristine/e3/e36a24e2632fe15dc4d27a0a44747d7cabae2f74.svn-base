var geo_lat, geo_long, ip_address;
var member_count = 1;
var adult_count = 1;
var child_count = 0;
var name = '', email = '', mobile = '', trip_type, travel_start_date, travel_end_date, max_duration = '0', travelling_to_area;
var ss_id = 0, sub_fba_id = '0', agent_source = '0', fba_id = '0';
var srn = '';
var udid = '';
var pageIndex = 1;
var mem_1_dob, mem_2_dob, mem_3_dob, mem_4_dob, mem_5_dob, mem_6_dob;
var activeTab = "";
var iScrollPos = 0;
var utmSource = "";
var dateObj = {};
var errOnDob = 0;
var const_insurerlogo = {
    "2": "Bharti_Axa_General.png",
    "4": "Future_Generali_General.png",
    "9": "reliance.png",
    "26": "StarHealth.png",
    "34": "care.png",
    "1": "BajajAllianzGeneral.png",
    "5": "hdfc.png",
    "6": "ICICI_Lombard.png",
    "11": "tata_aig.png",
    "44": "Go_Digit.png"
};

$(document).ready(function (e) {
    getClientBrowserDetails();
    calculate_dates();

    $("#start_date").attr({ min: dateObj.start_min, max: dateObj.start_max });
    $("#end_date").attr({ min: dateObj.end_min, max: dateObj.end_max });
    $("#M1DOB").attr({ min: dateObj.adult_min, max: dateObj.adult_max });

    $('#members').change(function () { traveller_details(this); });

    $('#start_date').change(function () {
        if (Date.parse(this.value) >= Date.parse($('#end_date').val())) {
            $("#end_date").val('');
        }
        var result = new Date(this.value);
        result.setDate(result.getDate() + 179);
        var end_max = result.toISOString().split("T")[0];
        result = new Date(this.value);
        result.setDate(result.getDate() + 1);
        var end_min = result.toISOString().split("T")[0];
        $("#end_date").attr({ min: end_min, max: end_max });
    });

    $('#trip_type').on('change', function () {
        if ($(this).val() == 'MULTI') {
            $('#maxDuration').show();
            $('#tripEndDate').hide();
        }
        else {
            $('#maxDuration').hide();
            $('#tripEndDate').show();
        }

    });
	
	$(".closeValidPopup").click(function () {
        $('.PremInitiVerify').hide();
    });

});

$(document).on('change', '.Dob', function () {
    var id = Number(this.id.charAt(1)) + 1;
    if (id !== 3) { $("#M" + id + "DOB").attr('min', this.value); }
    if (Date.parse(this.value) > Date.parse($("#M" + id + "DOB").val())) {
        $("#M" + id + "DOB").val('');
    }
});

function validateDob() {
    errOnDob = 0;
    $(".Dob").removeClass('errInvalid');

    for (var i = 1; i <= adult_count; i++) {
        this['mem_' + i + '_dob'] = $("#M" + i + "DOB").val();
        if (this['mem_' + i + '_dob'] === "") {
            $("#M" + i + "DOB").addClass('errInvalid'); errOnDob++;
        }
    }
    for (var i = 3; i <= child_count + 2; i++) {
        this['mem_' + i + '_dob'] = $("#M" + i + "DOB").val();
        if (this['mem_' + i + '_dob'] === "") {
            $("#M" + i + "DOB").addClass('errInvalid'); errOnDob++;
        }
    }
    errOnDob === 0 ? $("#popup_dob").hide() : $("#popup_dob").show();
    // $("#errDob").text('*Enter Date of birth in highlighted fields');
}
function popup_dob(view) {
    view === 'show' ? $("#popup_dob").show() : $("#popup_dob").hide();
}

function traveller_details(detail) {
    const travelers_cnt = detail.selectedOptions['0'].attributes;
    member_count = Number(travelers_cnt['1'].value);
    adult_count = Number(travelers_cnt['2'].value);
    child_count = Number(travelers_cnt['3'].value);
    //console.log(member_count, adult_count, child_count);

    $('#travellers').empty();

    for (var i = 1; i <= adult_count; i++) {
        //adult age -> 18yrs - 80yrs

        $('#travellers').append(
            `<div class="row">
                    <div class="col-6 user-box">
                        <select id="M${i}_Relatn">
                            <option ${i === 1 ? 'Selected' : ''}>Self</option>
                            <option ${i === 2 ? 'Selected' : ''}>Spouse</option>
                        </select>
                        <label>TRAVELLER ${i} ( Adult )</label>
                    </div>
                    <div class="col-6 user-box">
					<input id="M${i}DOB" class="picker Dob" type="date" min = ${dateObj.adult_min} max=${dateObj.adult_max} />
                        <label>Date of Birth</label>
                    </div>
                </div>`);
    }

    for (i = 3; i <= child_count + 2; i++) {
        //child age -> 3 months - 18 yrs

        $('#travellers').append(
            `<div class="row">
                    <div class="col-6 user-box">
                        <select id="M${i}_Relatn"><option selected>Kids</option></select>
                        <label>TRAVELLER ${adult_count === 2 ? i : i - 1} ( Child )</label>
                    </div>
                    <div class="col-6 user-box">
					<input id="M${i}DOB" class="picker Dob" type="date" min = ${dateObj.child_min} max = ${dateObj.child_max} />
                        <label>Date of Birth</label>
                    </div>
                </div>`);
    }
}

function calculate_dates() {
    var date_info =
    {
        adult_max: { type: 'year', operatn: 'sub', years: 18 },
        adult_min: { type: 'year', operatn: 'sub', years: 80 },
        child_min: { type: 'year', operatn: 'sub', years: 18 },
        child_max: { type: 'month', operatn: 'sub', months: 3 },
        start_min: { type: 'day', operatn: 'add', days: 1 },
        start_max: { type: 'day', operatn: 'add', days: 179 },
        end_min: { type: 'day', operatn: 'add', days: 2 },
        end_max: { type: 'day', operatn: 'add', days: 180 }
    };

    for (const [key, value] of Object.entries(date_info)) {
        var result = new Date();
        if (value.type === 'day') {
            result.setDate(result.getDate() + value.days);
        } else if (value.type === 'month') {
            result.setMonth(result.getMonth() - value.months);
        } else {
            result.setFullYear(result.getFullYear() - value.years);
        }
        dateObj[key] = result.toISOString().split("T")[0];
    }
    console.log(dateObj);
}

function getSession() {
    var session_url = getEditUrl() + "/Payment/GetSession";
    $.getJSON(session_url, function (data) {
        if (data.hasOwnProperty('agent_id')) {
            ss_id = + data.agent_id;
            fba_id = data.fba_id;
            sub_fba_id = data.hasOwnProperty('sub_fba_id') ? data.sub_fba_id : '0';
            agent_source = data.agent_source;
            //Get_Quote_List();
            //Get_App_List();
            //Get_Sell_List();
            //$(".Agent_name").text(data.agent_name);
            //$(".login a").attr("href", "/Sales/Login?_logout=logout");
            //showDashBoard();
        } else {
            //showInput();
            //$('.onlyAgent').hide();
        }
        console.log('session data', data);
    }).fail(function (error) {
        console.log('Error in get Session:', error.status, error.statusText);
    });
}

function getClientBrowserDetails() {
    if (window.navigator && window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
            position => {
                this.showPosition(position)
            },
            error => {
                console.log('Permission not granted or Position Unavailable');
            });
    }
}
function showPosition(position) {
    geo_lat = position.coords.latitude;
    geo_long = position.coords.longitude;
    $.getJSON('https://api.ipify.org?format=json', function (data) {
        ip_address = data.ip;
    });
}

function isCharacter(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return true;
    }
    return false;
};
function isNumber(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if ((charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
};
function forceNumeric() {
    var $input = $(this);
    $input.val($input.val().replace(/[^\d]+/g, ''));
}

function forceText() {
    var $input = $(this);
    $input.val($input.val().replace(/[^a-zA-Z ]+/g, ''));
}

function validateForm() {
    var err = 0;
    $(".picker,#trip_type,#max_duration").removeClass('errInvalid');

    travel_start_date = $("#start_date").val();
    travel_end_date = $("#end_date").val();
    travelling_to_area = $("#region").val();
    trip_type = $("#trip_type").val();

    if (travel_start_date === '') {
        $("#start_date").addClass('errInvalid'); err++;
    }
    if (travelling_to_area === null) {
        $("#region").addClass('errInvalid'); err++;
    }
    if (trip_type === 'SINGLE') {
        max_duration = '0';
        if (travel_end_date === '') {
            $("#end_date").addClass('errInvalid'); err++;
        }
    } else if (trip_type === 'MULTI') {
        travel_end_date = "";
        max_duration = $('#max_duration').val();
        if (max_duration === null) {
            $("#max_duration").addClass('errInvalid'); err++;
        }
    } else {
        $("#trip_type").addClass('errInvalid'); err++;
        if (travel_end_date === '') {
            $("#end_date").addClass('errInvalid'); err++;
        }
    }

    validateDob();

    if (err === 0 && errOnDob === 0) {
        $("#loader").show();
        premium_initiate();
    }

    // else{
    // $("#errMsg").text('*Enter details in highlighted fields');
    // }
};

var premium_initiate = function () {

    var post = {
        "city_id": 677,
        "client_name": "PolicyBoss",
        "client_id": 2,
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
        "ip_address": ip_address,
        "geo_long": geo_long,
        "geo_lat": geo_lat,
        "ss_id": ss_id,
        "fba_id": fba_id,
        "sub_fba_id": sub_fba_id,
        "agent_source": agent_source,
        "crn": 0,
        "member_count": member_count,
        "adult_count": adult_count,
        "child_count": child_count,
        "member_6_relation": "",
        "member_6_birth_date": mem_6_dob == undefined ? "" : mem_6_dob,
        "member_6_gender": "",
        "member_5_relation": "",
        "member_5_birth_date": mem_5_dob == undefined ? "" : mem_5_dob,
        "member_5_gender": "",
        "member_4_relation": "",
        "member_4_birth_date": mem_4_dob == undefined ? "" : mem_4_dob,
        "member_4_gender": "",
        "member_3_relation": "",
        "member_3_birth_date": mem_3_dob == undefined ? "" : mem_3_dob,
        "member_3_gender": "",
        "member_2_relation": "",
        "member_2_birth_date": mem_2_dob == undefined ? "" : mem_2_dob,
        "member_2_gender": "",
        "member_1_relation": "",
        "member_1_birth_date": mem_1_dob,
        "member_1_gender": "M",
        "mobile": mobile,
        "email": email,
        "contact_name": name,
        "travel_insurance_si": "0",
        "travelling_to_area": travelling_to_area,
        "travel_start_date": travel_start_date,
        "travel_end_date": travel_end_date,
        "maximum_duration": max_duration,
        "travel_insurance_type": ((member_count > 1) ? "floater" : "individual"),
        "trip_type": trip_type,
        "execution_async": "yes",
        "method_type": "Premium",
        "product_id": 4,
        "insurer_selected": "11,1,6,5",
        "utm_source": utmSource,
        "source": "VFS",
        "app_version": "PolicyBoss.com"
    }
    console.log(JSON.stringify(post));

    $.ajax({
        type: "POST",
        data: JSON.stringify(post),
        url: GetUrl() + "/quote/premium_initiate",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            if ((data.hasOwnProperty("Details")) && ((data.hasOwnProperty("Summary")) ? ((data.Summary.hasOwnProperty("Request_Unique_Id")) || (data.Summary.Request_Unique_Id == "")) : true)) { 
				$("#loader").hide();
				var msg = data.Details.join('<br/>');
				$('.PremInitiVerify').show();
				$(".validationMsg").html(msg);
			}
            else {
                console.log(data);
                srn = data['Summary']['Request_Unique_Id'];
                udid = srn.split("_")[1];
                // if (ss_id > 0 || siteURL.includes('SRN')) {
                window.location.href = './Travel_Quote.html?SID=' + srn + '&ClientID=2';
                // }
            }
        },
        error: function (result) {
            alert("Error");
        }
    });
};

function Get_Quote_List() {
    var url = "/user_datas/quicklist/4/SEARCH/" + ss_id + "/" + fba_id + "/" + pageIndex + "/0";

    $.ajax({
        type: "GET",
        data: siteURL.indexOf('https') == 0 ? {
            'method_name': url
        }
            : "",
        url: GetUrl() + url,
        dataType: "json",
        success: function (data) {
            console.log("QUOTE-", data.length);

            if (data.length > 0) {
                $("#quoteId").empty();
                for (var i in data) {
                    if (data[i].Customer_Name === '' || data[i].Customer_Name.includes('Undefined')) {
                        data[i].Customer_Name = 'No Details';
                    }
                    $("#quoteId").append("<div>CRN:<b>" + data[i]['CRN'] + "</b></div><div style='padding: 0px 0px 4px 0px;'><b>" +
                        data[i].Customer_Name + "</b></div><div class='center_align'>QUOTE DATE:<div><b>" + data[i]['Quote_Date_Mobile'] + "</b> </div></div>"
                        + "<div class='center_align'>Mobile No.:<div><b>" + data[i]['Customer_Mobile'] + "</b></div></div>");
                }
            }
        },
        error: function (result) {
            console.log(result)
        }
    });
}

function Get_App_List() {
    var url = "/user_datas/quicklist/4/APPLICATION/" + ss_id + "/" + fba_id + "/" + pageIndex + "/0";

    $.ajax({
        type: "GET",
        data: siteURL.indexOf('https') == 0 ? {
            'method_name': url
        }
            : "",
        url: GetUrl() + url,
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
                        + "<div class='ins_logo'><img src='https://www.policyboss.com/Images/insurer_logo/" + const_insurerlogo[data[i].Insurer] + "' class='img-responsive'>"
                        + "</div><div class='content_container'><div class='con parta'><div class='uname'>" + data[i].Customer_Name + "</div><div> </div>"
                        + "<div class='menu' style='display:none;'><i class='fa fa-info-circle' aria-hidden='true'style='padding:4px 0px;font-size:20px'></i></div></div>"
                        + "<div class='con partb'><div class='app_num'><div class='title1'>APP NUMBER</div><div><b>" + data[i]['CRN'] + "</b></div></div>"
                        + "<div class='app_status'><div class='title1'>APP STATUS</div><div class='progress'><div class='progress-bar' role='progressbar' aria-valuenow='" + data[i].Progress
                        + "' aria-valuemin='0' aria-valuemax='100' style='width:" + data[i].Progress + "%'>" + data[i].Progress + "</div></div></div></div>"
                        + "<div class='con partc'><div><div class='title1'>Mobile No.</div><div>" + data[i]['Customer_Mobile'] + "</div></div><div class='a_date'>"
                        + " <div class='title1'>APP DATE</div><div>" + data[i]['Quote_Date_Mobile'] + "</div></div></div></div></div>");
                }
            }
        },
        error: function (result) {
            console.log(result)
        }
    });

}
function Get_Sell_List() {
    var url = "/user_datas/quicklist/4/SELL/" + ss_id + "/" + fba_id + "/" + pageIndex + "/0";

    $.ajax({
        type: "GET",
        data: siteURL.indexOf('https') == 0 ? {
            'method_name': url
        }
            : "",
        url: GetUrl() + url,
        dataType: "json",
        success: function (data) {
            console.log("COMPLETE-", data.length);

            if (data.length > 0) {
                $("#completeId").empty();
                for (var i in data) {
                    if (data[i].Customer_Name === '' || data[i].Customer_Name.includes('Undefined')) {
                        data[i].Customer_Name = 'No Details';
                    }
                    $("#completeId").append("<div class='app_quoteDiv'><div class='ins_logo'>"
                        + "<img src='https://www.policyboss.com/Images/insurer_logo/" + const_insurerlogo[data[i].Insurer] + "' class='img-responsive'></div>"
                        + "<div class='content_container'><div class='con parta'><div class='uname'>" + data[i].Customer_Name + "</div><div class='menu' style='display:none'>"
                        + "<span class='glyphicon glyphicon-option-vertical amb '></span></div></div>"
                        + "<div class='con partb'><div class='app_num'><div class='title1'>APP NUMBER</div><div><b>" + data[i].CRN + "</b></div></div>"
                        + "<div class='app_status'><div class='title1'>APP STATUS &nbsp;</div><div class='progress'>"
                        + "<div class='progress-bar' role='progressbar' aria-valuenow='" + data[i].Progress + "' aria-valuemin='0' aria-valuemax='100' style='width:" + data[i].Progress + "%'>"
                        + data[i].Progress + "</div></div></div></div><div class='con partc'><div ><div class='title1'>MOBILE</div><div>" + data[i]['Customer_Mobile'] + "</div></div>"
                        + "<div class='a_date'><div class='title1'>APP DATE</div><div>" + data[i]['Quote_Date_Mobile'] + "</div></div></div></div></div>");
                }
            }
        },
        error: function (result) {
            console.log(result)
        }
    });
}
function showDashBoard() {
    $('#input_desk').hide();
    $('#input_mb').hide();
    $('#Dashboard').show();
    $('#quoteId').show();
    $('#applicationId').hide();
    $('#completeId').hide();
}
function showInput() {
    activeTab = "";
    $('#input_desk').show();
    $('#input_mb').show();
    $('#Dashboard').hide();
    $('#quoteId').hide();
    $('#applicationId').hide();
    $('#completeId').hide();
}
function quoteClick() {
    pageIndex = 1;
    activeTab = "SENTLINK";
    $('#quoteId').show();
    $('#applicationId').hide();
    $('#completeId').hide();

    $('#Quote_tab').addClass('Activeboard');
    $('#Application_tab').removeClass('Activeboard');
    $('#Complete_tab').removeClass('Activeboard');
}

function applicationClick() {
    pageIndex = 1;
    activeTab = "PROPOSAL";
    $('#quoteId').hide();
    $('#applicationId').show();
    $('#completeId').hide();

    $('#Quote_tab').removeClass('Activeboard');
    $('#Application_tab').addClass('Activeboard');
    $('#Complete_tab').removeClass('Activeboard');
}

function completeClick() {
    pageIndex = 1;
    activeTab = "SELL";
    $('#quoteId').hide();
    $('#applicationId').hide();
    $('#completeId').show();

    $('#Quote_tab').removeClass('Activeboard');
    $('#Application_tab').removeClass('Activeboard');
    $('#Complete_tab').addClass('Activeboard');
}
$(window).scroll(function () {
    if (activeTab !== "") {
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
    }
});