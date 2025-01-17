var siteURL = '';
var memberCount = 1;
var adult_count = 1;
var child_count = 0;
var name, email, mobile, trip_type, travel_start_date, travel_end_date, travelling_to_area;
var mem_1_dob, mem_2_dob, mem_3_dob, mem_4_dob, mem_5_dob, mem_6_dob;
var ss_id = 0, sub_fba_id = '0', agent_source = '0', fba_id = '0', app_version, arn, client_id = 2, product_id, ip_address, mac_address, geo_lat, geo_long, ip_city_state='';
var srn = '';
var udid = '';
var crn = '';
var pageIndex = 1;
var pageCount;
var iScrollPos = 0;
var activeTab = "SENTLINK";

var StatusCount = 0;
var response = [];
var response_1 = [];
var summary = [];
var slider_SI = [];
var si_selected;
var fresh_quote = false;

$(document).ready(function (e) {
    siteURL = window.location.href;
    getSession();
    getClientBrowserDetails();
    stringparam();
	ss_id = getUrlVars()['ss_id'];
	if ((ss_id !== "" && ss_id !== undefined && ss_id !== "0")) {
		$.get('https://api.ipify.org?format=json', function (data) {
			ip_address = data.ip;
			save_app_visitor();
		});
	}
    if (srn !== undefined) {
        $(".warningmsg").hide();
        $('#inputTabBtn').prop("disabled", true);
        $('#Dashboard').hide();
        $('#travel').show();
        showPanel(1); //showing quote
        getPremiumList(srn);
    }
    $('#travel_start_date').flatpickr({
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

    /* triptype */
    $("input[type='radio']").change(function (e) {
        trip_type = $(this).val();
        if ($(this).val() === "SINGLE") {
            $('.hideOnMultiTrip').show();
            $('.dvMaxTripPeriod').hide();
            $('.dvEndPeriod').show();
        } else if ($(this).val() === "MULTI") {
            $("#region").prop("selectedIndex", '');
            $('.hideOnMultiTrip').hide();
            $('.dvMaxTripPeriod').show();
            $('.dvEndPeriod').hide();
        }
    });
    $(".member").click(function () {
        setMemberCount($(this).attr("memberType"), $(this).attr("operation"));
    });
    $("#Member_1_DOB").flatpickr({
        altInput: true,
        altFormat: 'd-m-Y',
        dateFormat: 'Y-m-d',
        disableMobile: "true",
        maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
        minDate: new Date().setFullYear(new Date().getFullYear() - 60)
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

    //$('body').on('propertychange input', 'input[type="tel"]', forceNumeric);
    $('#name').bind('keyup blur', forceText);
    $('#mobile').bind('keyup blur', forceNumeric);

    /* SI | Filters | quote page */
    $('.slider').on('change', function () {
        si_selected = slider_SI[this.value];
        if (si_selected === undefined) {
            si_selected = "All";
        }
        $(".slider_Si_value").text("Show SI : " + si_selected);
    });

    /* Sort | quote page */
    $('.sort_select').on('change', function () {
        $('#quote_display').html(sortData('premium', this.value, $('.quote_grid')));
        if (this.value === 'ascending') {
            //            sort_icon
            $('#sort_icon').removeClass('fa-sort-amount-desc');
            $('#sort_icon').addClass('fa-sort-amount-asc');
        } else {
            $('#sort_icon').removeClass('fa-sort-amount-asc');
            $('#sort_icon').addClass('fa-sort-amount-desc');
        }
    });

    $('input').focus(function () {
        $(window).scrollTop($(this).position().top);
    });
    $(".closeValidPopup").click(function () {
        $('.PremInitiVerify').hide();
    });
});
function hideFilters() {
    $('.Filter_popup').hide();
}
function stringparam() {
    ss_id = getUrlVars()["ss_id"];
    fba_id = getUrlVars()["fba_id"];
    app_version = getUrlVars()["app_version"];
    product_id = getUrlVars()["product_id"];
    srn = getUrlVars()["srn"];
    mac_address = getUrlVars()["mac_address"];
    ip_address = getUrlVars()["ip_address"];
    if ((fba_id === "" || fba_id === undefined || fba_id === "0" || app_version === "" || app_version === "0" || app_version === undefined || ss_id === "" || ss_id === undefined || ss_id === "0")) {
        $("#travel").hide();
        $("#Dashboard").hide();
        $(".warningmsg").show();
    } else {
        $(".warningmsg").hide();
        if (srn === undefined) {
            showInput();
        }
        if (ss_id === "819") {
            $("#menu1").hide();
        } else {
            Get_Quote_List(pageCount, ss_id, fba_id);
        }
    }
}
function getSession() {
    var session_url = getEditUrl() + "/Payment/GetSession";

    $.getJSON(session_url, function (data) {
        if (data.hasOwnProperty('agent_id')) {
            ss_id = Number(data.agent_id);
            fba_id = data.fba_id;
            sub_fba_id = data.hasOwnProperty('sub_fba_id') ? data.sub_fba_id : '0';
            agent_source = data.agent_source;
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
                showPosition(position);
            },
            error => {
                console.log('Position Unavailable');
            });
    }
}
function showPosition(position) {
    geo_lat = position.coords.latitude;
    geo_long = position.coords.longitude;
    $.ajax({
        url: 'https://ipinfo.io/json',
        dataType: 'json',
        success: function (data) {
            ip_address = data.ip;
            ip_city_state = data.city + '_' + data.region;
        },
        error: function (data) {
            console.log("error in getting location");
        }
    });
}

function forceNumeric() {
    var $input = $(this);
    $input.val($input.val().replace(/[^\d]+/g, ''));
}
function forceText() {
    var $input = $(this);
    $input.val($input.val().replace(/[^a-zA-Z ]+/g, ''));
}
function setMemberCount(member_type, operatn) {
    if (member_type === "Adult") {
        if (operatn === "plus") {
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
        if (operatn === "plus") {
            if (child_count < 4) {
                child_count++;
                addMemberDob(member_type);
            }
        } else {
            if (child_count !== 0) {
                removeMemberDob(member_type);
                child_count--;
            }
        }
    }
    $("#adult").text(adult_count);
    $("#child").text(child_count);
    memberCount = adult_count + child_count;
}
function addMemberDob(member_type) {
    var count;
    var max_date;
    var min_date;

    if (member_type === 'Adult') {
        $("#Member_dob>:nth-child(1)").after(
            "<input type='text' id='Member_" + adult_count + "_DOB' placeholder= 'Adult " + adult_count + " - DOB' class='datepickr M_" + adult_count + "_DOB'>");

        if ($('#Member_1_DOB').val() === '') {
            $(".M_2_DOB").prop("disabled", true);
            adlt2_min_dt = 'today';
        } else {
            adlt2_min_dt = new Date($('#Member_1_DOB').val());
        }
        max_date = new Date().setFullYear(new Date().getFullYear() - 18),
            min_date = adlt2_min_dt;
        count = adult_count;
    } else {
        var child_cnt = (child_count + 2);
        var child_min_dt = new Date().setFullYear(new Date().getFullYear() - 18);
        $("#Member_dob").append(
            "<input type='text' id='Member_" + child_cnt + "_DOB' placeholder= 'Child " + child_count + " - DOB' class='datepickr M_" + child_cnt + "_DOB' onchange='set_child_dob(event, " + child_cnt + ")'>");

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

}
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
function set_child_dob(evt, child) {
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
function validateForm() {
    var err = 0;
    $(".inpErr").removeClass('errDisplay');
    var namePattern = new RegExp('^[a-zA-Z ]+$');
    var mobilePattern = new RegExp('^[7-9]{1}[0-9]{9}$');
    var emailPattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    name = $("#name").val();
    mobile = $("#mobile").val();
    email = $("#email").val();
    travel_start_date = $("#travel_start_date").val();
    travel_end_date = $("#travel_end_date").val();
    travelling_to_area = $('#region').val();

    if (!$('.trip_type').is(':checked')) {
        $("#trip_type").addClass('errBoxDisplay');
        err++;
    } else {
        $("#trip_type").removeClass('errBoxDisplay');
    }
    if (travelling_to_area === null || travelling_to_area === '') {
        $("#region").addClass('errDisplay');
        err++;
    }
    if (travel_start_date === '') {
        $(".start_dt").addClass('errDisplay');
        err++;
    }
    if (!$('#MULTI').is(':checked') && travel_end_date === '') {
        $(".end_dt").addClass('errDisplay');
        err++;
    }
    if ($('#MULTI').is(':checked') && $('#maxTripPeriod').val() === null) {
        $("#maxTripPeriod").addClass('errDisplay');
        err++;
    }
    if (name !== '') {
        if (!namePattern.test(name)) {
            $("#name").addClass('errDisplay');
            err++;
        } else {
            var namearray = name.split(" ");
            if (namearray[1] === "" || namearray[0] === "" || namearray[1] === undefined) {
                $("#name").addClass('errDisplay');
                err++;
            }
        }
    }
    if (email !== '' && !emailPattern.test(email)) {
        $("#email").addClass('errDisplay');
        err++;
    }
    if (mobile === '' || !mobilePattern.test(mobile)) {
        $("#mobile").addClass('errDisplay');
        err++;
    }
    for (var i = 1; i <= 6; i++) {
        if ($('#Member_' + i + '_DOB').val() === "") {
            err++;
            $('.M_' + i + '_DOB').addClass('errDisplay');
        } else {
            $('.M_' + i + '_DOB').removeClass('errDisplay');
            this['mem_' + i + '_dob'] = $('#Member_' + i + '_DOB').val();
        }
    }
    console.log("adults:" + adult_count, " childs:" + child_count, " members:" + memberCount);
    if (err === 0) {
        if (srn === undefined) {
            premium_initiate();
        } else {
            checkDataModified();
        }
    }
}
function checkDataModified() {
    var isModified = false;
    var isReqDataModified = false;

    if (summary.Request_Core.member_count !== memberCount) {
        isModified = true;
    } else if (summary.Request_Core.contact_name.localeCompare(name) !== 0) {
        isModified = true;
    } else if (summary.Request_Core.email.localeCompare(email) !== 0) {
        if (email === '' && summary.Request_Core.email.includes('@testpb.com')) {
        } else {
            isModified = true;
        }
    } else if (summary.Request_Core.mobile.localeCompare(mobile) !== 0) {
        isModified = true;
    } else if (summary.Request_Core.trip_type.localeCompare(trip_type) !== 0) {
        isModified = true;
    } else {
        for (var i = 1; i <= summary.Request_Core.adult_count; i++) {
            if (Date.parse(this['mem_' + i + '_dob']) !== Date.parse(summary.Request_Core['member_' + i + '_birth_date'])) {
                isModified = true;
            }
        }
        for (var i = 3; i <= summary.Request_Core.child_count + 2; i++) {
            if (Date.parse(this['mem_' + i + '_dob']) !== Date.parse(summary.Request_Core['member_' + i + '_birth_date'])) {
                isModified = true;
            }
        }
    }
    if (isModified === false) {
        if (travelling_to_area !== summary.Request_Core.travelling_to_area) {
            isReqDataModified = true;
        } else if (Date.parse(travel_start_date) !== Date.parse(summary.Request_Core.travel_start_date)) {
            isReqDataModified = true;
        }
        if (trip_type === 'SINGLE' && (Date.parse(travel_end_date) !== Date.parse(summary.Request_Core.travel_end_date))) {
            isReqDataModified = true;
        } else if (trip_type === 'MULTI' && $('#maxTripPeriod').val() !== summary.Request_Core.maximum_duration) {
            isReqDataModified = true;
        }
    }

    if (isModified === true) {
        crn = 0;
        premium_initiate();
    } else if (isReqDataModified === true) {
        premium_initiate();
        console.log(crn);
    } else {
        fresh_quote = false;
        showPanel(1); //show quote page
        resetFilter();
    }

}
var premium_initiate = function () {
    var max_duration;
    if (trip_type === "SINGLE") {
        travel_end_date = $("#travel_end_date").val();
        max_duration = "0";
    } else {
        travel_end_date = "";
        max_duration = $("#maxTripPeriod").val();
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
        "ss_id": ss_id === undefined ? summary.Request_Core.ss_id : ss_id,
        "fba_id": fba_id === undefined ? summary.Request_Core.fba_id : fba_id,
        "sub_fba_id": sub_fba_id,
        "agent_source": agent_source,
        "app_version": app_version === undefined ? summary.Request_Core.app_version : app_version,
        "crn": crn,
        "member_count": memberCount,
        "adult_count": adult_count,
        "child_count": child_count,
        "member_6_relation": "",
        "member_6_birth_date": mem_6_dob === undefined ? "" : mem_6_dob,
        "member_6_gender": "",
        "member_5_relation": "",
        "member_5_birth_date": mem_5_dob === undefined ? "" : mem_5_dob,
        "member_5_gender": "",
        "member_4_relation": "",
        "member_4_birth_date": mem_4_dob === undefined ? "" : mem_4_dob,
        "member_4_gender": "",
        "member_3_relation": "",
        "member_3_birth_date": mem_3_dob === undefined ? "" : mem_3_dob,
        "member_3_gender": "",
        "member_2_relation": "",
        "member_2_birth_date": mem_2_dob === undefined ? "" : mem_2_dob,
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
        "product_id": 4
    };
    console.log(JSON.stringify(post));

    $.ajax({
        type: "POST",
        data: JSON.stringify(post),
        url: GetUrl() + "/quote/premium_initiate",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            if ((data.hasOwnProperty("Details")) && ((data.hasOwnProperty("Summary")) ? ((data.Summary.hasOwnProperty("Request_Unique_Id")) || (data.Summary.Request_Unique_Id === "")) : true)) {
                var msg = data.Details.join('<br/>');
                $('.PremInitiVerify').show();
                $(".validationMsg").html(msg);
            } else {
                console.log(data);
                srn = data['Summary']['Request_Unique_Id'];
                udid = srn.split("_")[1];
                window.location.href = './Travel_Finmart.html?srn=' + srn + '&client_id=2';
            }
        },
        error: function (result) {
            alert("Error");
        }
    });
};

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
        data: JSON.stringify(requestData),
        url: GetUrl() + "/quote/premium_list_db",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            // console.log(data);
            if (data !== null && data.Msg !== "Not Authorized") {
                response = (data.Response);
                response_1 = data.Response_1;
                summary = data.Summary;
                $('.crntxt').text(summary['PB_CRN']);
                crn = summary['PB_CRN'];
                $('.destination').text(summary.Request_Core.travelling_to_area);
                $('.trip_type').text(summary.Request_Core.trip_type);
                trip_type = summary.Request_Core.trip_type;
                ss_id = summary.Request_Core.ss_id;
                fba_id = summary.Request_Core.fba_id;
                appVersion = summary.Request_Core.appVersion;

                StatusCount++;
                var CreateTime = new Date(summary.Created_On);
                var CurrentTime = new Date();
                var DateDiff = Date.parse(CurrentTime) - Date.parse(CreateTime);
                console.log(DateDiff);
                var is_complete = false;
                if (StatusCount > 3 || DateDiff >= 30000 || summary['Status'] === "complete") {
                    is_complete = true;
                    console.log("Premium List - ", data);
                    $("#loader").hide();
                }
                if (is_complete === false) {
                    setTimeout(() => {
                        getPremiumList(ref_no);
                    }, 3000);
                } else {
                    pb_crn = summary.PB_CRN === "" ? summary['Request_Core'].crn : summary.PB_CRN;
                    if (response_1.length > 0) {
                        $(".ins_count").text(summary.Insurer_Cnt);
                        $(".plan_count").text(summary.Plan_Cnt);

                        /* Appending quotes */
                        $("#quote_display").empty();
                        response_1.forEach((res, i) => {

                            if (!slider_SI.includes(res.Sum_Insured)) {
                                slider_SI.push(res.Sum_Insured);
                            }

                            $('#quote_display').append(
                                "<div class='quote_grid' data-ins='" + res.Insurer_Id + "' data-pln='" + res.Plan_Id + "' data-si='" + res.Sum_Insured.substring(1) + "' data-premium='" + res.Premium_Breakup.final_premium + "'>" +
                                "<div style='box-shadow: 2px 3px 4px 1px rgb(181, 177, 177);'>" +
                                "<img class='insuLogo' src='https://www.policyboss.com/Images/insurer_logo/" + res.Insurer_Logo_Name + "' width='100%'>"+
                                "<b style='font-weight: bolder;'><u><span class= 'benefit_span' onclick='benefit_popup(" + i + ")'>Benefits</span></u></b></div>" +
                                "<div class='planInfo'><p style='text-align:left;padding:0px 3px'>Plan : <span style='color:gray;'>" +
                                "<strong>" + res.Plan_Name + "</strong></span></p>" +
                                "<p style='text-align:left;padding:3px 3px'>Sum Insured: <span style='color:gray;'>" +
                                "<strong>" + res.Sum_Insured + "</strong></span></p> </p></div>" +
                                "<div class='insu_btn'><p>premium</p><button id='plan_" + res.Plan_Id + "'" +
                                "class='buy_amt' onclick='premium_breakup(" + i + ")'>&#8377; " + res['Premium_Breakup'].final_premium + "</button>" +
                                "</div></div>");
                        });
                        fresh_quote = true;
                        $('#quote_display').html(sortData('premium', 'ascending', $('.quote_grid')));

                        /* setting Si on Filter */
                        slider_SI = sortData('si', 'ascending', slider_SI);
                        $(".slider").attr("max", slider_SI.length);
                        slider_SI.unshift("All");
                        $(".right_label").text(slider_SI[slider_SI.length - 1]);

                        /* appending insurers on Filter */
                        $(".ins_img").empty();
                        response.forEach(res => {
                            $('.insurer').append(
                                `<label class="cbox" id="ins_${res.Insurer_Id}_mb"><span style="padding-left: 5px;">${res.Insurer.Insurer_Code}</span>
									<input type="checkbox" class='ins_chk' value="${res.Insurer_Id}" name="special_feat"> <span class="tick"></span>
								</label>`);
                        });
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
function sortData(toSort, sortOrder, unsortedData) {
    var contentA, contentB, sortedData;

    if (sortOrder === 'ascending') {
        sortedData = unsortedData.sort(function (a, b) {
            if (toSort === 'si') {
                contentA = parseFloat(a.replace(/[^\d\.]/, ''));
                contentB = parseFloat(b.replace(/[^\d\.]/, ''));
            } else {
                contentA = parseInt($(a).attr('data-premium'));
                contentB = parseInt($(b).attr('data-premium'));
            }
            return contentA - contentB;
        });
    } else {
        sortedData = unsortedData.sort(function (a, b) {
            contentA = parseInt($(a).attr('data-premium'));
            contentB = parseInt($(b).attr('data-premium'));
            return contentB - contentA;
        });
    }
    return sortedData;
}
function applyFilter() {
    $(".quote_grid").show();

    /* filtering SI */
    if (si_selected !== 'All' && si_selected !== undefined) {
        $(".quote_grid").hide();
        $("[data-si=" + si_selected.substring(1) + "]").show();
    }

    /* filtering insurers */
    if ($('.ins_chk').is(':checked')) {
        $(".quote_grid").hide();
        let insChecked = $(".ins_chk:checked");

        for (var i = 0; i < insChecked.length; i++) {
            if (si_selected !== 'All' && si_selected !== undefined) {
                $("[data-ins=" + insChecked[i].value + "][data-si=" + si_selected.substring(1) + "]").show();
            } else {
                $("[data-ins=" + insChecked[i].value + "]").show();
            }
        }
    }
    $('.Filter_popup').hide();
    setInsPlansCount();
}
function resetFilter() {
    si_selected = "All";
    $('#tpslide').val('0');
    $(".slider_Si_value").text("Show SI : " + si_selected);
    $('.ins_chk').prop('checked', false);
    applyFilter();
}

function setInsPlansCount() {
    let ins_plans_count = {};
    let visibleDivs = $('.quote_grid:not([style*="display: none"])');
    for (var i = 0; i < visibleDivs.length; i++) {
        var ins = visibleDivs[i].dataset.ins;
        ins_plans_count[ins] = (ins_plans_count[ins] || 0) + 1;
    }
    console.log('ins_pln_cnt', ins_plans_count);
    $(".plan_count").text(visibleDivs.length);
    $(".ins_count").text(Object.keys(ins_plans_count).length);
}
function premium_breakup(res_index) {
    var res = response_1[res_index];
    var prm_brkup = res['Premium_Breakup'];
    $(".premium_content").empty();
    $(".premium_content").append(
        "<p><b>Plan Name : </b><span>" + res.Plan_Name + "</span></p>" +
        "<p><b>Base Premium : </b><span>&#8377;" + Math.round(res['Premium_Breakup'].net_premium) + "</span></p>" +
        "<p><b>Service Tax : </b><span>&#8377;" + Math.round(res['Premium_Breakup'].service_tax) + "</span></p>" +
        "<p><b>Total Premium : </b><span>&#8377;" + Math.round(res['Premium_Breakup'].final_premium) + "</span></p>");

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
    $('.Filter_popup').hide();
}
function showFilters() {
    $('.Filter_popup').show();
}
function hideFilters() {
    $('.Filter_popup').hide();
}

function Get_Quote_List() {
    var url = "/user_datas/quicklist/4/SEARCH/" + ss_id + "/" + fba_id + "/" + pageIndex + "/0";

    $.ajax({
        type: "GET",
        data: siteURL.indexOf('https') === 0 ? { 'method_name': url } : "",
        url: GetUrl() + url,
        dataType: "json",
        success: function (data) {
            console.log("QUOTE-", data.length);

            if (data.length > 0) {
                $('#No_Record').hide();
                $("#quoteId").empty();
                for (var i in data) {
                    if (data[i].Customer_Name === '' || data[i].Customer_Name.includes('Undefined')) {
                        data[i].Customer_Name = 'No Details';
                    }
                    $("#quoteId").append(" <div class='CustInfo' id='quote_list_id_'" + data[i].CRN + ">"
                        + "<div><div class='fontWeight' style='padding: 0px 0px 4px 0px;'>" + data[i].Customer_Name
                        + "</div><div>CRN:<span class='fontWeight'>" + data[i].CRN + "<span></div></div>"
                        + "<div class='centerAlign'>QUOTE DATE<div class='data'>" + data[i].Quote_Date_Mobile + "</div></div>"
                        + "<div class='centerAlign'>MOBILE NO.<div class='data'>" + data[i].Customer_Mobile + "</div></div>"
                        + "</div>");
                }
                $("#sales_loader").hide();
            } else {
                $("#sales_loader").hide();
                $('#No_Record').show();
            }
        },
        error: function (result) {
            console.log(result);
        }
    });
}

function Get_App_List() {
    var url = "/user_datas/quicklist/4/APPLICATION/" + ss_id + "/" + fba_id + "/" + pageIndex + "/0";

    $.ajax({
        type: "GET",
        data: siteURL.indexOf('https') === 0 ? { 'method_name': url } : "",
        url: GetUrl() + url,
        dataType: "json",
        success: function (data) {
            console.log("APP-", data.length);

            if (data.length > 0) {
                $('#No_Record').hide();
                $("#applicationId").empty();
                for (var i in data) {
                    if (data[i].Customer_Name === '' || data[i].Customer_Name.includes('Undefined')) {
                        data[i].Customer_Name = 'No Details';
                    }
                    $("#applicationId").append("<div class='app_quoteDiv'>"
                        + "<div class='ins_logo'>"
                        + "<img src='https://www.policyboss.com/Images/insurer_logo/" + const_insurerlogo[data[i].Insurer] + "' class='img-responsive' style='width:100%;'>"
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
                        + "<div class='con partb'>"
                        + "<div class='a_date'>"
                        + "<div class='title'>APP DATE</div>" + data[i]['Quote_Date_Mobile']
                        + "</div>"
                        + "</div>"
                        + "</div>"
                        + "</div>");
                }
                $("#sales_loader").hide();
            } else {
                $("#sales_loader").hide();
                $('#No_Record').show();

            }
        },
        error: function (result) {
            console.log(result);
        }
    });

}
function Get_Sell_List() {
    var url = "/user_datas/quicklist/4/SELL/" + ss_id + "/" + fba_id + "/" + pageIndex + "/0";

    $.ajax({
        type: "GET",
        data: siteURL.indexOf('https') === 0 ? { 'method_name': url } : "",
        url: GetUrl() + url,
        dataType: "json",
        success: function (data) {
            console.log("COMPLETE-", data.length);

            if (data.length > 0) {
                $('#No_Record').hide();
                $("#completeId").empty();
                for (var i in data) {
                    if (data[i].Customer_Name === '' || data[i].Customer_Name.includes('Undefined')) {
                        data[i].Customer_Name = 'No Details';
                    }
                    $("#completeId").append("<div class='app_quoteDiv'>"
                        + "<div class='ins_logo'>"
                        + "<img src='https://www.policyboss.com/Images/insurer_logo/" + const_insurerlogo[data[i].Insurer] + "' class='img-responsive' style='width:100%;'>"
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
                        + "<div class='con partb'>"
                        + "<div class='a_date'>"
                        + "<div class='title'>APP DATE</div>" + data[i]['Quote_Date_Mobile']
                        + "</div>"
                        + "</div>"
                        + "</div>"
                        + "</div>");
                }
                $("#sales_loader").hide();
            } else {
                $("#sales_loader").hide();
                $('#No_Record').show();

            }
        },
        error: function (result) {
            console.log(result);
        }
    });
}
function EditCustdetails() {
    // console.log(summary);
    showPanel(0); // showing input section
    if (fresh_quote === true) {
        var request = summary.Request_Core;
        if (summary !== null || summary !== "") {
            memberCount = request['member_count'];
            adult_count = request['adult_count'];
            child_count = request['child_count'];
            $("#adult").text(adult_count);
            $("#child").text(child_count);
            $('#name').val(request['contact_name']);
            $('#mobile').val(request['mobile']);
            if (request['email'].includes('@testpb.com')) {
                $('#email').val('');
            } else {
                $('#email').val(request['email']);
            }
            travelling_to_area = request['travelling_to_area'];
            $('#region').val(travelling_to_area);
            trip_type = request['trip_type'];
            $("#" + trip_type).prop("checked", true);
            if (trip_type === "MULTI") {
                $('.hideOnMultiTrip').hide();
                $('.dvEndPeriod').hide();
                $('.dvMaxTripPeriod').show();
                $(".dayRange").val(request['maximum_duration']);
            } else {
                $('.hideOnMultiTrip').show();
                $('.dvMaxTripPeriod').hide();
                $('.dvEndPeriod').show();
            }

            flatpickr("#travel_start_date", {
                altInput: true,
                altFormat: 'd-m-Y',
                dateFormat: 'Y-m-d',
                disableMobile: 'true',
                minDate: new Date().fp_incr(1),
                maxDate: new Date().fp_incr(179),
                defaultDate: request['travel_start_date']
            });
            flatpickr("#travel_end_date", {
                altInput: true,
                altFormat: 'd-m-Y',
                dateFormat: 'Y-m-d',
                disableMobile: 'true',
                maxDate: new Date(request['travel_start_date']).fp_incr(179),
                minDate: new Date(request['travel_start_date']).fp_incr(1),
                defaultDate: request['travel_end_date']
            });
            $(".end_dt").prop("disabled", false);

            var max_date;
            var min_date;
            for (var i = 1; i <= 6; i++) {
                if (request['member_' + i + '_birth_date'] !== "") {
                    if (i < 3) {
                        max_date = new Date().setFullYear(new Date().getFullYear() - 18);
                        min_date = new Date().setFullYear(new Date().getFullYear() - 60);
                        if (i !== 1) {
                            min_date = request.member_1_birth_date;
                            $("#Member_dob>:nth-child(1)").after(
                                "<input type='text' id='Member_" + i + "_DOB' placeholder= 'Adult " + i + " - DOB' class='datepickr M_" + i + "_DOB' value=" + request.member_1_birth_date + ">");
                        }
                    } else {
                        max_date = new Date().setMonth(new Date().getMonth() - 3);
                        min_date = new Date().setFullYear(new Date().getFullYear() - 18);
                        $("#Member_dob").append(
                            "<input type='text' id='Member_" + i + "_DOB' placeholder= 'Child " + i + " - DOB' class='datepickr M_" + i + "_DOB'>");
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
                }
            }

        }
    }
}
function Reload() {
    location.reload(true);
}
function showDashBoard() {
    if (srn !== undefined) {
        window.location.href = './Travel_Finmart.html?ss_id=' + ss_id + '&fba_id=' + fba_id + '&app_version=' + summary.Request_Core.app_version;
    } else {
        $('#travel').hide();
        $('#Dashboard').show();
        $('#quoteId').show();
        $('#applicationId').hide();
        $('#completeId').hide();
        $('.Quotenav').addClass('ActivenavItem');
        $('.Applicationnav').removeClass('ActivenavItem');
        $('.Completenav').removeClass('ActivenavItem');
    }
}

function quoteClick() {
    $("#quoteId").empty();
    pageIndex = 1;
    activeTab = "SENTLINK";
    $('#No_Record').hide();
    $("#sales_loader").show();
    Get_Quote_List(pageCount, ss_id, fba_id);
    $('#quoteId').show();
    $('#applicationId').hide();
    $('#completeId').hide();

    $('.Quotenav').addClass('ActivenavItem');
    $('.Applicationnav').removeClass('ActivenavItem');
    $('.Completenav').removeClass('ActivenavItem');
}

function applicationClick() {
    $("#applicationId").empty();
    pageIndex = 1;
    activeTab = "PROPOSAL";
    $('#No_Record').hide();
    $("#sales_loader").show();
    Get_App_List(pageCount, ss_id, fba_id);
    $('#quoteId').hide();
    $('#applicationId').show();
    $('#completeId').hide();

    $('.Quotenav').removeClass('ActivenavItem');
    $('.Applicationnav').addClass('ActivenavItem');
    $('.Completenav').removeClass('ActivenavItem');
}

function completeClick() {
    $("#completeId").empty();
    pageIndex = 1;
    activeTab = "SELL";
    $('#No_Record').hide();
    $("#sales_loader").show();
    Get_Sell_List(pageCount, ss_id, fba_id);
    $('#quoteId').hide();
    $('#applicationId').hide();
    $('#completeId').show();

    $('.Quotenav').removeClass('ActivenavItem');
    $('.Applicationnav').removeClass('ActivenavItem');
    $('.Completenav').addClass('ActivenavItem');
}

function showInput() {
    activeTab = "";
    $(".warningmsg").hide();
    $('#Dashboard').hide();
    $('#travel').show();
    showPanel(0);
    $('.dvMaxTripPeriod').hide();
}
$(window).scroll(function () {
    var iCurScrollPos = $(this).scrollTop();
    if (iCurScrollPos > iScrollPos) {
        //Scrolling Down
        if ($(window).scrollTop() === $(document).height() - $(window).height()) {
            pageIndex++;
            var tab = activeTab;
            if (tab === 'SENTLINK') {
                Get_Quote_List(pageCount, ss_id, fba_id);
            } else if (tab === 'PROPOSAL') {
                Get_App_List(pageCount, ss_id, fba_id);
            } else if (tab === 'SELL') {
                Get_Sell_List(pageCount, ss_id, fba_id);
            }
        }
    }
});
function save_app_visitor() {
	let visitorObj = {
		app_type: "Travel_Finmart",
		IP_Address: ip_address,
		query_string: siteURL.split("?")[1],
		ss_id: getUrlVars()['ss_id'],
		fba_id: getUrlVars()['fba_id'] != "" && getUrlVars()['fba_id'] != undefined && getUrlVars()['fba_id'] != null ? getUrlVars()['fba_id'] : ""
	};

	$.ajax({
		type: "POST",
		data: JSON.stringify(visitorObj),
		url: GetUrl() + "/postservicecall/app_visitor/save_data",
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		success: function (data) {
			console.log('save app visitor:',data);
		},
		error: function (e) {
			console.log("save app visitor error :", e);
		}
	});
}
var const_insurerlogo = {
    "1": "BajajAllianzGeneral.png",
    "2": "Bharti_Axa_General.png",
    "4": "Future_Generali_General.png",
    "5": "hdfc.png",
    "6": "ICICI_Lombard.png",
    "9": "reliance.png",
    "11": "tata_aig.png",
    "26": "StarHealth.png",
    "34": "care.png",
    "44": "Go_Digit.png"
};
function benefit_popup(index){
     const geo_area = summary.Request_Core.travelling_to_area;
     const insurance_type = summary.Request_Core.travel_insurance_type;
     const plan_details = response_1[index];
     const method_name = '/travel_benefit/benefit/' + plan_details.Insurer_Id + '/' + plan_details.Plan_Id + '/' + geo_area + '/' + insurance_type;
     var htmlstring = "<div style='height:330px !important;overflow-y:scroll'>";
    $.ajax({
        type:'GET',
        data:'',
        url:GetUrl() + method_name,
        success: function (data){
            if(data){
               var benefits = Object.entries(data);
            
               for (var i = 0; i < benefits.length; i++) {
                  htmlstring += "<table style='border-collapse: collapse;text-align: left; font-size: 12px;width: 100%;'><tr style=''><td style='font-weight:700;border:1px solid #dddddd;width:50%;padding:6px'>" + benefits[i][0] + ":</td> <td style='border:1px solid #dddddd;width:50%;padding:6px'>" + benefits[i][1] + "</td></tr></table>"
               }
               if (benefits.length === 0) {
                 htmlstring += "<div style='text-align: center; font-size: 12px;'>No benefits applicable. </div>";
                };  
               htmlstring += "</div>"
               swal.fire({
                title: 'Benefits',
                html: htmlstring,
                showCloseButton: true,
                width: '800px',
                buttonsStyling: false,
                customClass: {
     	         confirmButton: 'btn_swal',
                }
              })
            }
        }
    })
}