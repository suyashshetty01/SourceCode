var siteURL = '';
var geo_lat= 0, geo_long=0, ip_address='', ip_city_state='';
var memberCount = 1;
var adult_count = 1;
var child_count = 0;
var name, email, mobile, trip_type, travel_start_date, travel_end_date, travelling_to_area;
var ss_id = 0, sub_fba_id = '0', agent_source = '0', fba_id = '0';
var srn = '';
var udid = '';
var pageIndex = 1;
var mem_1_dob, mem_2_dob, mem_3_dob, mem_4_dob, mem_5_dob, mem_6_dob;
var activeTab = "";
var iScrollPos = 0;
var utmSource = "";
var const_insurerlogo = {
    "2": "Bharti_Axa_General.png",
    "4": "Future_Generali_General.png",
    "9": "reliance.png",
    "26": "StarHealth.png",
    "34": "care.png",
    "1": "BajajAllianzGeneral.png",
    "5": "hdfc.png",
    "6": "ICICI_Lombard.png",
    "11": "tata_aig.png"
};

$(document).ready(function (e) {
    siteURL = window.location.href;
    getSession();
    getClientBrowserDetails();

    $("#plusMore").mouseover(function (e) {
        $(".child_menu").css("display", "flex");
    })
    $("#plusMore").mouseout(function (e) {
        $(".child_menu").css("display", "none");
    })
    $('.dvMaxTripPeriod').hide();
    $('#OTP').hide();
    $(".datepickr").flatpickr();

    srn = getUrlVars()["srn"];
    if (srn != "" && srn != undefined) {
        fetchDataToModify(srn);
    }
    utmSource = getUrlVars()["utm_source"];
    if (utmSource === "VFS") {
        var nav_bar = document.getElementsByClassName("header");
        for (var i = 0; i < nav_bar.length; i++) {
            nav_bar[i].style.display = "none";
        }
        $('.image_container').hide();
        $('.image_container_mb').hide();
        $('.hideForVFS').hide();
    }

    $("#closeotppopup").click(function () {
        $('#OTP').hide();
    });
	
	$(".closeValidPopup").click(function () {
        $('.PremInitiVerify').hide();
    });
    /* change input on triptype radio */
    $("input[type='radio']").change(function (e) {
        trip_type = $(this).val();
        if ($(this).val() === "SINGLE") {
            if (utmSource === "VFS") {
                $('.hideForVFS').hide();
            } else {
                $('.hideOnMultiTrip').show();
            }
            $('.dvMaxTripPeriod').hide();
            $('.dvEndPeriod').show();
        } else if ($(this).val() === "MULTI") {
            $("#region_mb").prop("selectedIndex", '');
            if (utmSource === "VFS") {
                $('.hideForVFS').hide();
            } else {
                $(".hideOnMultiTrip").removeClass("activated");
                $('.hideOnMultiTrip').hide();
            }
            $('.dvMaxTripPeriod').show();
            $('.dvEndPeriod').hide();
        }
    });

    $(".region").click(function () {
        $("#dvGeographicalAreaId").empty();
        $(".region").removeClass("activated");
        travelling_to_area = $(this).attr("id");
        $("#" + travelling_to_area).addClass("activated");
    });

    $(".member").click(function () {
        setMemberCount($(this).attr("memberType"), $(this).attr("operation"));
    });

    $("#name").keypress(function () {
        return isCharacter(event);
    });

    $("#mobile").keypress(function () {
        return isNumber(event);
    });

    $('body').on('propertychange input', 'input[type="tel"]', forceNumeric);
    $('#name_mb').bind('keyup blur', forceText);

    $("#Member_1_DOB,#Member_1_DOB_mb").flatpickr({
        altInput: true,
        altFormat: 'd-m-Y',
        dateFormat: 'Y-m-d',
        disableMobile: "true",
        maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
        minDate: new Date().setFullYear(new Date().getFullYear() - 80)
    });
    $("#Member_1_DOB").change(function (e) {
        if ($(".M_2_DOB ").is(":visible")) {
            $(".M_2_DOB").prop("disabled", false);
            $('#Member_2_DOB').val('');
            flatpickr("#Member_2_DOB", {
                altInput: true,
                altFormat: 'd-m-Y',
                dateFormat: 'Y-m-d',
                disableMobile: "true",
                maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                minDate: new Date($("#Member_1_DOB").val())
            });
        }
    });
    $("#Member_1_DOB_mb").change(function (e) {
        if ($(".M_2_DOB_mb").is(":visible")) {
            $(".M_2_DOB_mb").prop("disabled", false);
            flatpickr("#Member_2_DOB_mb", {
                altInput: true,
                altFormat: 'd-m-Y',
                dateFormat: 'Y-m-d',
                disableMobile: "true",
                maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                minDate: new Date($("#Member_1_DOB_mb").val())
            });
        }
    });

    $('#travel_start_date,#start_dt_mb').flatpickr({
        altInput: true,
        altFormat: 'd-m-Y',
        dateFormat: 'Y-m-d',
        disableMobile: "true",
        minDate: new Date().fp_incr(1),
        maxDate: new Date().fp_incr(179)
    });
    $("#travel_start_date").change(function (e) {
        $("#travel_end_date").val('');
        $("#travel_end_date").prop("disabled", false);
        flatpickr("#travel_end_date", {
            altInput: true,
            altFormat: 'd-m-Y',
            dateFormat: 'Y-m-d',
            disableMobile: "true",
            maxDate: new Date($('#travel_start_date').val()).fp_incr(179),
            minDate: new Date($('#travel_start_date').val()).fp_incr(1)
        });
    });
    $("#start_dt_mb").change(function (e) {
        $("#end_dt_mb").val('');
        $("#end_dt_mb").prop("disabled", false);
        flatpickr("#end_dt_mb", {
            altInput: true,
            altFormat: 'd-m-Y',
            dateFormat: 'Y-m-d',
            disableMobile: 'true',
            maxDate: new Date($('#start_dt_mb').val()).fp_incr(179),
            minDate: new Date($('#start_dt_mb').val()).fp_incr(1)
        });
    });

    $(".flatpickr-mobile").hide();

});

window.onload = function (e) {
    setTimeout(() => {
        $('input:radio').prop('checked', false);
        $(".inpErr").val('');
    }, 5);
}

function set_child_dob(evt, child) {
    //console.log('set_child_dob', evt.target.value, child, evt);
    if ($(".M_" + (child + 1) + "_DOB").is(":visible")) {
        $(".M_" + (child + 1) + "_DOB").prop("disabled", false);
        if (Date.parse(evt.target.value) > Date.parse($('#Member_' + (child + 1) + '_DOB').val())) {
            $('#Member_' + (child + 1) + '_DOB').val('');
        }
        flatpickr("#Member_" + (child + 1) + "_DOB", {
            altInput: true,
            altFormat: 'd-m-Y',
            dateFormat: 'Y-m-d',
            disableMobile: "true",
            minDate: evt.target.value,
            maxDate: new Date().setMonth(new Date().getMonth() - 3)
        });
    }

}
function set_child_dob_mb(evt, child) {
    //console.log('set_child_dob_mb', evt.target.value, child, evt);
    if ($(".M_" + (child + 1) + "_DOB_mb").is(":visible")) {
        $(".M_" + (child + 1) + "_DOB_mb").prop("disabled", false);
        if (Date.parse(evt.target.value) > Date.parse($('#Member_' + (child + 1) + '_DOB_mb').val())) {
            $('#Member_' + (child + 1) + '_DOB_mb').val('');
        }
        flatpickr("#Member_" + (child + 1) + "_DOB_mb", {
            altInput: true,
            altFormat: 'd-m-Y',
            dateFormat: 'Y-m-d',
            disableMobile: "true",
            minDate: evt.target.value,
            maxDate: new Date().setMonth(new Date().getMonth() - 3)
        });
    }

}
function getSession() {
    var session_url = getEditUrl() + "/Payment/GetSession";
    $.getJSON(session_url, function (data) {
        if (data.hasOwnProperty('agent_id')) {
            ss_id = + data.agent_id;
            fba_id = data.fba_id;
            sub_fba_id = data.hasOwnProperty('sub_fba_id') ? data.sub_fba_id : '0';
            agent_source = data.agent_source;
            Get_Quote_List();
            Get_App_List();
            Get_Sell_List();
            $(".Agent_name").text(data.agent_name);
            $(".login a").attr("href", "/Sales/Login?_logout=logout");
            showDashBoard();
        } else {
            showInput();
            $('.onlyAgent').hide();
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
                console.log('Position Unavailable');
            });
    }
}
function showPosition(position) {
    geo_lat = position.coords.latitude;
    geo_long = position.coords.longitude;
	//https://api.ipify.org?format=json
    $.getJSON('https://ipinfo.io/json', function (data) {
		console.log(data);
        ip_address = data.ip;
		ip_city_state = data.city +'_'+ data.region;
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
function KeyPressEvent(event, type) {
    let pattern;
    switch (type) {
        case 'Text': pattern = /[a-zA-Z ]/; break;
        case 'Number': pattern = /[0-9\+\-\ ]/; break;
    }
    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) { event.preventDefault(); }
}

function setMemberCount(member_type, operatn) {
    if (member_type == "Adult") {
        if (operatn == "plus") {
            if (adult_count < 2) {
                adult_count++;
                addMemberDob(member_type);
            }
        } else {
            if (adult_count > 1) {
                removeMemberDob(member_type);
                adult_count--;
            }
        }
    } else {
        if (operatn == "plus") {
            if (child_count < 4) {
                child_count++;
                addMemberDob(member_type);
            }
        } else {
            if (child_count != 0) {
                removeMemberDob(member_type);
                child_count--;
            }
        }
    }
    $(".adult_count").text('Adult [ ' + adult_count + ' ]');
    $(".child_count").text('Child [ ' + child_count + ' ]');
    memberCount = adult_count + child_count;
};
function addMemberDob(member_type) {
    var count;
    var max_date;
    var min_date;
    if ($('.desktop_view').css('display') === 'block') {
        if (member_type == 'Adult') {
            $(".input_row>span:nth-child(1)").after(
                "<span class='membox M" + adult_count + "DOB'><input type='text' id='Member_" + adult_count + "_DOB' placeholder= 'Adult " + adult_count + " - DOB' class='datepickr M_" + adult_count + "_DOB'></span>");

            if ($('#Member_1_DOB').val() === '') {
                $(".M_2_DOB").prop("disabled", true);
                var adlt2_min_dt = 'today';
            } else {
                var adlt2_min_dt = new Date($('#Member_1_DOB').val());
            }

            max_date = new Date().setFullYear(new Date().getFullYear() - 18),
                min_date = adlt2_min_dt;
            count = adult_count;
        } else {
            var child_cnt = (child_count + 2);
            var child_min_dt = new Date().setFullYear(new Date().getFullYear() - 18);
            $(".input_row").append(
                "<span class='membox M" + child_cnt + "DOB'><input type='text' id='Member_" + child_cnt + "_DOB' placeholder= 'Child " + child_count + " - DOB' class='datepickr M_" + child_cnt + "_DOB' onchange='set_child_dob(event, " + child_cnt + ")'></span>");

            if (child_cnt > 3) {
                if ($('#Member_' + (child_cnt - 1) + '_DOB').val() === '') {
                    $(".M_" + child_cnt + "_DOB").prop("disabled", true);
                } else {
                    child_min_dt = new Date($('#Member_' + (child_cnt - 1) + '_DOB').val());
                }
            }

            max_date = new Date().setMonth(new Date().getMonth() - 3);
            min_date = child_min_dt;

            count = child_cnt;
        }

        $("#Member_" + count + "_DOB").flatpickr({
            altInput: true,
            altFormat: 'd-m-Y',
            dateFormat: 'Y-m-d',
            minDate: min_date,
            maxDate: max_date,
            disableMobile: "true"
        });
    } else {
        if (member_type == 'Adult') {
            $(".input_row_mb>span:nth-child(1)").after(
                "<span class='membox M" + adult_count + "DOB_mb' style='width: 47.33%'><input type='text' id='Member_" + adult_count + "_DOB_mb' placeholder= 'Adult " + adult_count + " - DOB' class='datepickr M_" + adult_count + "_DOB_mb'></span>");

            if ($('#Member_1_DOB_mb').val() === '') {
                $(".M_2_DOB_mb").prop("disabled", true);
                adlt2_min_dt = 'today';
            } else {
                adlt2_min_dt = $('#Member_1_DOB_mb').val();
            }
            max_date = new Date().setFullYear(new Date().getFullYear() - 18),
                min_date = adlt2_min_dt;
            count = adult_count;
        } else {
            var child_cnt = (child_count + 2);
            var child_min_dt = new Date().setFullYear(new Date().getFullYear() - 18);
            $(".input_row_mb").append(
                "<span class='membox M" + child_cnt + "DOB_mb' style='width: 47.33%'><input type='text' id='Member_" + child_cnt + "_DOB_mb' placeholder= 'Child " + child_count + " - DOB' class='datepickr M_" + child_cnt + "_DOB_mb' onchange='set_child_dob_mb(event, " + child_cnt + ")'></span>");

            if (child_cnt > 3) {
                if ($('#Member_' + (child_cnt - 1) + '_DOB_mb').val() === '') {
                    $(".M_" + child_cnt + "_DOB_mb").prop("disabled", true);
                } else {
                    child_min_dt = new Date($('#Member_' + (child_cnt - 1) + '_DOB_mb').val());
                }
            }

            max_date = new Date().setMonth(new Date().getMonth() - 3);
            min_date = child_min_dt;
            count = child_cnt;
        }
        $(".M_" + count + "_DOB_mb").flatpickr({
            altInput: true,
            altFormat: 'd-m-Y',
            dateFormat: 'Y-m-d',
            minDate: min_date,
            maxDate: max_date,
            disableMobile: "true"
        });
    }
};
function removeMemberDob(member_type) {
    if (member_type === "Adult") {
        $(".M2DOB").remove();
        $(".M_2_DOB").remove();
        $(".M2DOB_mb").remove();
        $(".M_2_DOB_mb").remove();
    } else {
        $(".M" + (child_count + 2) + "DOB").remove();
        $(".M_" + (child_count + 2) + "_DOB").remove();
        $(".M" + (child_count + 2) + "DOB_mb").remove();
        $(".M_" + (child_count + 2) + "_DOB_mb").remove();
    }
}
function validateForm() {
    var err = 0;
    var namePattern = new RegExp('^[a-zA-Z ]+$');
    var mobilePattern = new RegExp('^[6-9]{1}[0-9]{9}$');
    var emailPattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    name = $("#name").val();
    mobile = $("#mobile").val();
    email = $("#email").val();
    travel_start_date = $("#travel_start_date").val();
    var end_date = $("#travel_end_date").val();

    $("#name").removeClass('errDisplay');
    $("#email").removeClass('errDisplay');
    $("#mobile").removeClass('errDisplay');
    $(".start").removeClass('errDisplay');
    $(".end").removeClass('errDisplay');
    $(".dayRange").removeClass('errDisplay');
    $("#trip_type").removeClass('errDisplay');

    if (!$('.trip_type').is(':checked')) {
        err++;
        $("#trip_type").addClass('errDisplay');
        if (end_date === '') {
            err++;
            $(".end").addClass('errDisplay');
        }
    }
    if (!$(".region").hasClass("activated")) {
        err++;
        $("#dvGeographicalAreaId").text("Please Select Geographical Area");
    }
    if (travel_start_date === '') {
        err++;
        $(".start").addClass('errDisplay');
    }
    if (!$('#MULTI').is(':checked') && end_date === '') {
        err++;
        $(".end").addClass('errDisplay');
    }
    if ($('#MULTI').is(':checked') && $('.dayRange').val() == null) {
        err++;
        $(".dayRange").addClass('errDisplay');
    }
    for (var i = 1; i <= 6; i++) {
        if ($('#Member_' + i + '_DOB').val() == "") {
            err++;
            $('.M_' + i + '_DOB').addClass('errDisplay');
        } else {
            $('.M_' + i + '_DOB').removeClass('errDisplay');
            this['mem_' + i + '_dob'] = $('#Member_' + i + '_DOB').val();
        }
    }
    if (name !== '') {
        if (!namePattern.test(name)) {
            err++;
            $("#name").addClass('errDisplay');
        } else {
            var namearray = name.split(" ");
            if (namearray[1] === "" || namearray[0] === "" || namearray[1] === undefined) {
                err++;
                $("#name").addClass('errDisplay');
            }
        }
    } else {
        if (ss_id === 0 || ss_id === '0') {
            err++;
            $("#name").addClass('errDisplay');
        }
    }
    if (email !== '') {
        if (!emailPattern.test(email)) {
            err++;
            $("#email").addClass('errDisplay');
        }
    } else {
        if (ss_id === 0 || ss_id === '0') {
            err++;
            $("#email").addClass('errDisplay');
        }
    }
    if (mobile === '' || !mobilePattern.test(mobile)) {
        err++;
        $("#mobile").addClass('errDisplay');
    }
    console.log("adults:" + adult_count, " childs:" + child_count, " members:" + memberCount);
    if (err === 0) {
        // if (ss_id > 0 || siteURL.includes('SRN')) {
        // $('#OTP').hide();
        // } else {
        //     generateOTP();
        //     $('#OTP').show();
        //     $('#namemodal').text(name);
        //     $('#otpverify').hide();
        //     $('#otpError').hide();
        // }
        premium_initiate();
    }
};
function validateFormMb() {
    var err = 0;
    $(".inpErr").removeClass('errDisplay');
    var namePattern = new RegExp('^[a-zA-Z ]+$');
    var mobilePattern = new RegExp('^[6-9]{1}[0-9]{9}$');
    var emailPattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    name = $("#name_mb").val();
    mobile = $("#mobile_mb").val();
    email = $("#email_mb").val();
    travel_start_date = $("#start_dt_mb").val();
    var end_date = $("#end_dt_mb").val();

    if (!$('.trip_type').is(':checked')) {
        $("#trip_type_mb").addClass('errDisplay');
        err++;
    }
    if ($('#region_mb').val() === null || $('#region_mb').val() === '') {
        $("#region_mb").addClass('errDisplay');
        err++;
    } else {
        travelling_to_area = $('#region_mb').val();
    }
    if (travel_start_date === '') {
        err++;
        $(".start").addClass('errDisplay');
    }
    if (!$('#trip_MULTI_mb').is(':checked') && end_date === '') {
        err++;
        $(".end").addClass('errDisplay');
    }
    if ($('#trip_MULTI_mb').is(':checked') && $('#maxTripPeriod_mb').val() == null) {
        err++;
        $("#maxTripPeriod_mb").addClass('errDisplay');
    }
    for (var i = 1; i <= 6; i++) {
        if ($('#Member_' + i + '_DOB_mb').val() == "") {
            err++;
            $('.M_' + i + '_DOB_mb').addClass('errDisplay');
        } else {
            $('.M_' + i + '_DOB_mb').removeClass('errDisplay');
            this['mem_' + i + '_dob'] = $('#Member_' + i + '_DOB_mb').val();
        }
    }
    if (name !== '') {
        if (!namePattern.test(name)) {
            err++;
            $("#name_mb").addClass('errDisplay');
        } else {
            var namearray = name.split(" ");
            if (namearray[1] === "" || namearray[0] === "" || namearray[1] === undefined) {
                err++;
                $("#name_mb").addClass('errDisplay');
            }
        }
    } else {
        if (ss_id === 0 || ss_id === '0') {
            err++;
            $("#name_mb").addClass('errDisplay');
        }
    }
    if (email !== '') {
        if (!emailPattern.test(email)) {
            err++;
            $("#email_mb").addClass('errDisplay');
        }
    } else {
        if (ss_id === 0 || ss_id === '0') {
            err++;
            $("#email_mb").addClass('errDisplay');
        }
    }
    if (mobile === '' || !mobilePattern.test(mobile)) {
        err++;
        $("#mobile_mb").addClass('errDisplay');
    }
    console.log("adults:" + adult_count, " childs:" + child_count, " members:" + memberCount);
    if (err === 0) {
        // if (ss_id > 0 || siteURL.includes('SRN')) {
        //     $('#OTP').hide();
        // } else {
        //     generateOTP();
        //     $('#OTP').show();
        //     $('#namemodal').text(name);
        //     $('#otpverify').hide();
        //     $('#otpError').hide();
        // }
        premium_initiate();
    }
};
function generateOTP() {
    var method_name = GetUrl() + '/generateOTP/' + mobile + '/' + email + '/Travel';
    console.log('otp-data', method_name);
    $.getJSON(method_name, function (data) {
        console.log('otp-data', data);
    });
}
function verifyOTP() {
    var otp = $('#txtotp').val();
    if (otp == '') {
        $('#otpverify').show();
        $('#otpError').hide();
    }
    var method_name = GetUrl() + '/verifyOTP/' + otp + '/' + udid;
    $.getJSON(method_name, function (data) {
        console.log('otp-data', data);
        if (data['Msg'] == 'Success') {
            window.location.href = './travel_quote.html?srn=' + srn + '&client_id=2';
        } else {
            $('#otpverify').hide();
            $('#otpError').show();
        }
    });
}

function resendOTP() {
    var method_name = GetUrl() + '/resendOTP/' + mobile + '/' + email + '/Travel';
    $.getJSON(method_name, function (data) {
        console.log('otp-resent', data);
    });
}
var premium_initiate = function () {
    var max_duration;
    var view = $('.desktop_view').css('display') === 'block' ? 'desktop' : 'mobile';
    if (trip_type === "SINGLE") {
        travel_end_date = view === 'desktop' ? $("#travel_end_date").val() : $("#end_dt_mb").val();
        max_duration = "0";
    } else {
        travel_end_date = "";
        max_duration = view === 'desktop' ? $("#maxTripPeriod").val() : $("#maxTripPeriod_mb").val();
    }

    var post = {
        "city_id": 677,
        "client_name": "PolicyBoss",
        "client_id": 2,
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
        "ip_address": ip_address,
        "geo_long": geo_long,
        "geo_lat": geo_lat,
		"ip_city_state": ip_city_state,
        "ss_id": ss_id,
        "fba_id": fba_id,
        "sub_fba_id": sub_fba_id,
        "agent_source": agent_source,
        "crn": 0,
        "member_count": memberCount,
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
        "travel_insurance_type": ((memberCount > 1) ? "floater" : "individual"),
        "trip_type": trip_type,
        "execution_async": "yes",
        "method_type": "Premium",
        "product_id": 4,
        "insurer_selected": ((utmSource == "VFS") ? "11,1,6,5" : ""),
        "utm_source": utmSource,
        "app_version" : "PolicyBoss.com"
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
				var msg = data.Details.join('<br/>');
                $('.PremInitiVerify').show();
                $(".validationMsg").html(msg);
			}
            else {
                console.log(data);
                srn = data['Summary']['Request_Unique_Id'];
                udid = srn.split("_")[1];
                // if (ss_id > 0 || siteURL.includes('SRN')) {
                window.location.href = './travel_quote.html?SID=' + srn + '&ClientID=2';
                // }
            }
        },
        error: function (result) {
            alert("Error");
        }
    });
};

function fetchDataToModify(srn) {
    var requestData = {
        "search_reference_number": srn,
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW"
    };

    $.ajax({
        type: "POST",
        data: JSON.stringify(requestData),
        url: GetUrl() + "/quote/premium_summary",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            var request = data['Request'];

            if (data !== null || data !== "") {
                memberCount = request['member_count'];
                adult_count = request['adult_count'];
                child_count = request['child_count'];
                $(".adult_count").text('Adult [ ' + adult_count + ' ]');
                $(".child_count").text('Child [ ' + child_count + ' ]');
                $('#name,#name_mb').val(request['contact_name']);
                $('#mobile,#mobile_mb').val(request['mobile']);
                $('#email,#email_mb').val(request['email']);
                $("#" + request['travelling_to_area']).addClass("activated");
                travelling_to_area = request['travelling_to_area'];
                $('#region_mb').val(travelling_to_area);
                trip_type = request['trip_type'];
                $("#" + trip_type).prop("checked", true);
                $("#trip_" + trip_type + "_mb").prop("checked", true);
                if (trip_type == "MULTI") {
                    $('.hideOnMultiTrip').hide();
                    $('.dvEndPeriod').hide();
                    $('.dvMaxTripPeriod').show();
                    $(".dayRange").val(request['maximum_duration']);
                }
                $("#travel_end_date").prop("disabled", false);
                $("#end_dt_mb").prop("disabled", false);

                flatpickr("#travel_start_date,#start_dt_mb", {
                    altInput: true,
                    altFormat: 'd-m-Y',
                    dateFormat: 'Y-m-d',
                    disableMobile: 'true',
                    minDate: new Date().fp_incr(1),
                    maxDate: new Date().fp_incr(179),
                    defaultDate: request['travel_start_date']
                });

                flatpickr("#travel_end_date,#end_dt_mb", {
                    altInput: true,
                    altFormat: 'd-m-Y',
                    dateFormat: 'Y-m-d',
                    disableMobile: 'true',
                    minDate: new Date(request['travel_start_date']).fp_incr(1),
                    maxDate: new Date(request['travel_start_date']).fp_incr(179),
                    defaultDate: request['travel_end_date']
                });

                var max_date;
                var min_date;
                for (var i = 1; i <= 6; i++) {
                    if (request['member_' + i + '_birth_date'] != "") {
                        if (i < 3) {
                            max_date = new Date().setFullYear(new Date().getFullYear() - 18);
                            min_date = new Date().setFullYear(new Date().getFullYear() - 80);
                            if (i !== 1) {
                                min_date = new Date(request['member_1_birth_date']);
                                $(".input_row>span:nth-child(1)").after(
                                    "<span class='membox M" + i + "DOB'><input type='text' id='Member_" + i + "_DOB' placeholder= 'Adult " + i + " - DOB' class='datepickr M_" + i + "_DOB'></span>");

                                $(".input_row_mb>span:nth-child(1)").after(
                                    "<span class='membox M" + i + "DOB_mb' style='width: 47.33%'><input type='text' id='Member_" + i + "_DOB_mb' placeholder= 'Adult " + i + " - DOB' class='datepickr M_" + i + "_DOB_mb'></span>");
                            }
                        } else {
                            max_date = new Date().setMonth(new Date().getMonth() - 3);
                            min_date = new Date().setFullYear(new Date().getFullYear() - 18);
                            $(".input_row").append(
                                "<span class='membox M" + i + "DOB'><input type='text' id='Member_" + i + "_DOB' placeholder= 'Child " + i + " - DOB' class='M_" + i + "_DOB'></span>");
                            $(".input_row_mb").append(
                                "<span class='membox M" + i + "DOB_mb' style='width: 47.33%'><input type='text' id='Member_" + i + "_DOB_mb' placeholder= 'Child " + i + " - DOB' class='datepickr M_" + i + "_DOB_mb'></span>");
                        }

                        flatpickr("#Member_" + i + "_DOB", {
                            altInput: true,
                            altFormat: 'd-m-Y',
                            dateFormat: 'Y-m-d',
                            minDate: min_date,
                            maxDate: max_date,
                            disableMobile: "true",
                            defaultDate: request['member_' + i + '_birth_date']
                        });

                        flatpickr("#Member_" + i + "_DOB_mb", {
                            altInput: true,
                            altFormat: 'd-m-Y',
                            dateFormat: 'Y-m-d',
                            minDate: min_date,
                            maxDate: max_date,
                            disableMobile: "true",
                            defaultDate: request['member_' + i + '_birth_date']
                        });
                    }
                }

            }
        }
    });
}

function Reload() {
    location.reload(true);
}
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