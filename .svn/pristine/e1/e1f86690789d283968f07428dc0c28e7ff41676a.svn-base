var siteURL = "";
var view = '';
var ss_id;
var arn, srn, client_id = 2;
var pb_crn = 0;
var StatusCount = 0;
var response = [];
var response_1 = [];
var summary = [];
var slider_SI = [];
var si_selected;
var travel_start_date;
var travel_end_date;
var travel_region;
var trip_type;

$(document).ready(function () {
    srn = getUrlVars()["SID"];
    if (srn !== undefined) {
        StatusCount = 0;
        getPremiumList(srn);
    }
    $("#plusMore").mouseover(function (e) {
        $(".child_menu").css("display", "flex");
    })
    $("#plusMore").mouseout(function (e) {
        $(".child_menu").css("display", "none");
    })
    $('.quoteEditPopup').hide();
    $('.filter_tab').on('change', function () {
        $('.QuoteWrapper').html(sortData('premium', this.value, $('.quoteBox')));
        $('.QuoteWrapper_mb').html(sortData('premium', this.value, $('.plan_list')));
        if (this.value == 'ascending') {
            sort_icon
            $('#sort_icon').removeClass('fa-sort-amount-desc');
            $('#sort_icon').addClass('fa-sort-amount-asc');
        } else {
            $('#sort_icon').removeClass('fa-sort-amount-asc');
            $('#sort_icon').addClass('fa-sort-amount-desc');
        }
    });

    $('.slider').on('change', function () {
        si_selected = slider_SI[this.value];
        if (si_selected == undefined) {
            si_selected = "All";
        } else {
            if ($('.desktop_view').css('display') === 'block') {
                allFilter();
            }
        }
        $(this).parent().find(".tooltext_detail").text(si_selected);
        $(".slider_Si_value").text("Show SI : " + si_selected);
    });

    $("#moreDetails").click(function () {
        $(".Features").slideToggle();
    })
    $("#closeDetails").click(function () {
        $("#main").animate({
            left: '0'
        });
    });
    $("#filter").click(function () {
        $("#main").animate({
            left: '100%'
        });
    });
    $("#dismissEditPopup").click(function () {
        $(".quoteEditPopup").hide();
    });
    $("#closeFilterTab").click(function () {
        $("#main").animate({
            left: '0'
        });
    });
    $("input[Type='range']").change(function (e) {
        var currVal = $(this).val();
        $(this).parent().find(".output").text(currVal);
    });
    $(".twoCol").click(function () {
        $(this).siblings(".info").slideToggle()
    });
    $("#modify,#closeModifyTab").click(function () {
        $(".modifyTab").slideToggle();
    });
    $(".applyBtn").click(function () {
        allFilter();
        $("#main").animate({
            left: '0'
        });
    });
    $(".resetBtn").click(function () {
        reset_filter();
        $("#main").animate({
            left: '0'
        });
    });
    $("#modify_submit").click(function () {
        var err = 0;
        $("#end_dt_mb").removeClass('errDisplay');
        var isModified = false;
        travel_start_date = $("#start_dt_mb").val();
        travel_end_date = $("#end_dt_mb").val();
        travel_region = $('#region_mb').val();

        if (travel_region != summary.Request_Core.travelling_to_area) {
            isModified = true;
        } else if (Date.parse(travel_start_date) != Date.parse(summary.Request_Core.travel_start_date)) {
            isModified = true;
        }
        if (trip_type == 'SINGLE' && (Date.parse(travel_end_date) != Date.parse(summary.Request_Core.travel_end_date))) {
            if (travel_end_date == '') {
                $(".end").addClass('errDisplay');
                err++;
            } else {
                isModified = true;
            }
        } else if (trip_type == 'MULTI' && $('#maxTripPeriod_mb').val() != summary.Request_Core.maximum_duration) {
            isModified = true;
        }
        if (err === 0) {
            $(".modifyTab").slideToggle();
        }

        if (isModified === true && err === 0) {
            premium_initiate('mobile');
        }
    });
    $("#modify_submit_desktp").click(function () {
        var err = 0;
        $("#end_dt").removeClass('errDisplay');
        var isModified = false;
        travel_start_date = $("#start_dt").val();
        travel_end_date = $("#end_dt").val();
        travel_region = $('#region').val();

        if (travel_region != summary.Request_Core.travelling_to_area) {
            isModified = true;
        } else if (Date.parse(travel_start_date) != Date.parse(summary.Request_Core.travel_start_date)) {
            isModified = true;
        }
        if (trip_type == 'SINGLE' && (Date.parse(travel_end_date) != Date.parse(summary.Request_Core.travel_end_date))) {
            if (travel_end_date == '') {
                $(".end").addClass('errDisplay');
                err++;
            } else {
                isModified = true;
            }
        } else if (trip_type == 'MULTI' && $('#maxTripPeriod').val() != summary.Request_Core.maximum_duration) {
            isModified = true;
        }
        if (err === 0) {
            $(".quoteEditPopup").hide();
        }

        if (isModified === true && err === 0) {
            premium_initiate('desktop');
        }
    });

    $('#start_dt_mb,#start_dt').flatpickr({
        altInput: true,
        altFormat: 'd-m-Y',
        dateFormat: 'Y-m-d',
        disableMobile: 'true',
        minDate: new Date().fp_incr(1),
        maxDate: new Date().fp_incr(179)
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
    $("#start_dt").change(function (e) {
        $("#end_dt").val('');
        $("#end_dt").prop("disabled", false);
        flatpickr("#end_dt", {
            altInput: true,
            altFormat: 'd-m-Y',
            dateFormat: 'Y-m-d',
            disableMobile: 'true',
            minDate: new Date($('#start_dt').val()).fp_incr(1),
            maxDate: new Date($('#start_dt').val()).fp_incr(179)
        });
    });
});
function reset_filter() {
    si_selected = "All";
    $('.slider').val('0');
    $(".slider_Si_value").text("Show SI : " + si_selected);
    $('.ins_chk').prop('checked', false);
    allFilter();
}
var premium_initiate = function (source) {
    var max_duration;
    if (summary.Request_Core.trip_type === "SINGLE") {
        travel_end_date = source == 'mobile' ? $("#end_dt_mb").val() : $("#end_dt").val();
        max_duration = "0";
    } else {
        travel_end_date = "";
        max_duration = source == 'mobile' ? $("#maxTripPeriod_mb").val() : $("#maxTripPeriod").val();
    }
    var post_keys = {
        "city_id": '',
        "client_name": "",
        "client_id": '',
        "client_key": "",
        "secret_key": "",
        "ip_address": '',
        "geo_long": '',
        "geo_lat": '',
		"ip_city_state":'',
        "ss_id": '',
        "fba_id": '',
        "sub_fba_id": '',
        "agent_source": '',
        "member_count": '',
        "adult_count": '',
        "child_count": '',
        "member_6_relation": "",
        "member_6_birth_date": '',
        "member_6_gender": "",
        "member_5_relation": "",
        "member_5_birth_date": '',
        "member_5_gender": "",
        "member_4_relation": "",
        "member_4_birth_date": '',
        "member_4_gender": "",
        "member_3_relation": "",
        "member_3_birth_date": '',
        "member_3_gender": "",
        "member_2_relation": "",
        "member_2_birth_date": '',
        "member_2_gender": "",
        "member_1_relation": "",
        "member_1_birth_date": '',
        "member_1_gender": "M",
        "mobile": '',
        "email": '',
        "contact_name": '',
        "travel_insurance_si": "0",
        "travelling_to_area": '',
        "travel_start_date": '',
        "travel_end_date": '',
        "maximum_duration": '',
        "travel_insurance_type": '',
        "trip_type": '',
        "execution_async": "",
        "method_type": "",
        "product_id": '',
        "insurer_selected": "",
        "utm_source": "",
        "app_version": "PolicyBoss.com"
    }
    var post = {};
    for (const [key] of Object.entries(post_keys)) {
        post[key] = summary.Request_Core[key];
    }
    post["crn"] = pb_crn;
    post["maximum_duration"] = max_duration;
    post["travel_start_date"] = travel_start_date;
    post["travel_end_date"] = travel_end_date;
    post["travelling_to_area"] = travel_region;
    console.log(JSON.stringify(post));

    $.ajax({
        type: "POST",
        data: JSON.stringify(post),
        url: GetUrl() + "/quote/premium_initiate",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            if ((data.hasOwnProperty("Details")) && ((data.hasOwnProperty("Summary")) ? ((data.Summary.hasOwnProperty("Request_Unique_Id")) || (data.Summary.Request_Unique_Id == "")) : true)) { }
            else {
                console.log(data);
                srn = data['Summary']['Request_Unique_Id'];
                window.location.href = './travel_quote.html?SID=' + srn + '&ClientID=2';
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
                pb_crn = summary['PB_CRN'];
                ss_id = summary.Request_Core.ss_id;
                if (ss_id > 0) {
                    $(".Agent_name").text(summary.Request_Core.posp_reporting_agent_name);
                    $(".login a").attr("href", "/Sales/Login?_logout=logout");
                } else {
                    $('.onlyAgent').hide();
                }
                $('.crntxt').text(summary['PB_CRN']);
                $('.destination').text(summary.Request_Core.travelling_to_area);
                $('.trip_type').text(summary.Request_Core.trip_type);
                trip_type = summary.Request_Core.trip_type;

                /* Set data to modify (mobile) */

                flatpickr("#start_dt_mb,#start_dt", {
                    altInput: true,
                    altFormat: 'd-m-Y',
                    dateFormat: 'Y-m-d',
                    disableMobile: 'true',
                    minDate: new Date().fp_incr(1),
                    maxDate: new Date().fp_incr(179),
                    defaultDate: summary.Request_Core.travel_start_date
                });
                flatpickr("#end_dt_mb,#end_dt", {
                    altInput: true,
                    altFormat: 'd-m-Y',
                    dateFormat: 'Y-m-d',
                    disableMobile: 'true',
                    maxDate: new Date(summary.Request_Core.travel_start_date).fp_incr(179),
                    minDate: new Date(summary.Request_Core.travel_start_date).fp_incr(1),
                    defaultDate: summary.Request_Core.travel_end_date

                });
                if (summary.Request_Core.trip_type === 'MULTI') {
                    $('.hideOnMultiTrip').hide();
                    $('.showOnMultiTrip').show();
                    $(".dayRange").val(summary.Request_Core.maximum_duration);
                } else {
                    $('.showOnMultiTrip').hide();
                }
                if (summary.Request_Core.utm_source === "VFS") {
                    $('.hideForVFS').hide();
                }
                $('#region_mb,#region').val(summary.Request_Core.travelling_to_area);

                StatusCount++;
                // var CreateTime = new Date(summary.Created_On);
                // var CurrentTime = new Date();
                // var DateDiff = Date.parse(CurrentTime) - Date.parse(CreateTime);
                // console.log(DateDiff);
                var is_complete = false;
                if (StatusCount >= 3 || summary['Status'] === "complete") {
                    is_complete = true;
                    console.log("Premium List - ", data);
                    $("#loader").hide();
                }
                if (is_complete === false) {
                    setTimeout(() => {
                        getPremiumList(ref_no);
                    }, 5000);
                } else {
                    pb_crn = summary.PB_CRN === "" ? summary['Request_Core'].crn : summary.PB_CRN;
                    if (response_1.length > 0) {
                        view = $('.desktop_view').css('display') === 'block' ? 'desktop' : 'mobile';
                        console.log(view);
                        $(".ins_count").text(summary.Insurer_Cnt);
                        $(".plan_count").text(summary.Plan_Cnt);

                        /* Appending quotes */
                        $(".QuoteWrapper").empty();
                        response_1.forEach((res, i) => {

                            if (!slider_SI.includes(res.Sum_Insured)) {
                                slider_SI.push(res.Sum_Insured);
                            }

                            $('.QuoteWrapper').append(
                                `<div class='quoteBox' data-ins='${res.Insurer_Id}' data-pln='${res.Plan_Id}' data-si='${res.Sum_Insured.substring(1)}' data-premium='${res.Premium_Breakup.final_premium}' id='QuoteDiv_${res.Insurer_Id}_${res.Plan_Id}'>
									<div class='inpl_det'>
										<img src='https://www.policyboss.com/Images/insurer_logo/${res.Insurer_Logo_Name}'>
										<span class='plan_name'>${res.Plan_Name}</span> 
										<span class='comp'>
											<label class='cb_cont'> 
												<input type='checkbox'  class='cb'>
												<!--<span class='tickmark'> </span>-->
											</label>
										</span> 
									</div> 
									<div class='pay_det' ><span>${res.Sum_Insured}</span></div> 
									<!--<div class='clse_det'><span>""<span class='mob'>Claims Setteled</span></div> 
									<div class='coup_det'><span>  </span></div> -->
									<div class='spfe_det'>NA</div> 
									<div class='prem_det plan_${res.Plan_Id}'> 
										<span class='btn_box'> 
											<span class='buytag'>BUY NOW</span> 
											<span class='quote_val' onclick='proposal_redirect(${i})' id="Premium_Amount_${res.Insurer_Id}_${res.Plan_Id}">₹ ${res.Premium_Breakup.final_premium}</span> 
											<span class='val_ins'>PREMIUM (INCL.TAX)</span>
										</span> 
										<span class='more_info benefits_${res.Insurer_Id}'  onclick='getBenefits(${res.Insurer_Id},${res.Plan_Id})'>More Info</span>
									</div>
								</div>`);

                            $('.QuoteWrapper_mb').append(
                                `<div class="plan_list" data-ins='${res.Insurer_Id}' data-pln='${res.Plan_Id}' data-si='${res.Sum_Insured.substring(1)}' data-premium='${res.Premium_Breakup.final_premium}' id='QuoteDivMb_${res.Insurer_Id}_${res.Plan_Id}'>
						<div class="plan_grid">
							 <div><!--<label class="cbox">
	                            <input type="checkbox" checked="checked"  name="special_feat">
	                            <span class="tick"></span></label>--></div>
							<div>
								<img src='https://www.policyboss.com/Images/insurer_logo/${res.Insurer_Logo_Name}' width="80%"><br>
							</div>
							<div>
								<p class="planname">${res.Plan_Name}</p>
								<p>Sum Insured</p>
								<p>${res.Sum_Insured}</p>
							</div>
							<div>
								<span class="boldWidth"> ₹ ${res.Premium_Breakup.final_premium}</span>
								<div class="cust_btn buyNow" onclick='proposal_redirect(${i})' id="Premium_Amount_${res.Insurer_Id}_${res.Plan_Id}_mb">BUY NOW</div>
							</div>
						</div>
						<div>
							<hr/>
							<p class='details benefits_${res.Insurer_Id} disableBenefits'  onclick='getBenefits(${res.Insurer_Id},${res.Plan_Id})'>More Info</p>
						</div>
											<!-- <div class="Features">
						<p><strong>Special Features</strong></p>
						<ul>
							<li>In-patient Care</li>
						</ul> -->
					</div>`);

                        });

                        /*benefits*/
                        $('.more_info').hide();
                        $('.benefits_11,.benefits_44').show();
                        $('.benefits_11,.benefits_44').removeClass('disableBenefits');

                        $('.QuoteWrapper').html(sortData('premium', 'ascending', $('.quoteBox')));
                        $('.QuoteWrapper_mb').html(sortData('premium', 'ascending', $('.plan_list')));

                        /* Si slider on Filter*/
                        slider_SI = sortData('si', 'ascending', slider_SI);
                        $(".slider").attr("max", slider_SI.length);
                        slider_SI.unshift("All");
                        $(".right_label").text(slider_SI[slider_SI.length - 1]);

                        /* appending insurers on Filter */
                        $(".ins_img").empty();
                        response.forEach(res => {
                            $('.ins_img').append(
                                `<div id="ins_${res.Insurer_Id}_Img" class ="dvInsImg"onclick="allFilter()">
								<label id="${res.Insurer_Id}"><img class="act" id="insurer_${res.Insurer_Id}" src="https://www.policyboss.com/Images/insurer_logo/${res.Insurer.Insurer_Logo_Name}" alt="">
								<input class='ins_chk' type="checkbox" value="${res.Insurer_Id}" >
								</label>
							</div>`);

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
function getBenefits(insId, planId) {
    var url = window.location.href;
    var benefit_url;
    if (insId == 11) {
        if (url.includes("https:")) {
            benefit_url = "";
        } else {
            benefit_url = "http://qa.policyboss.com/Pdfs/TATA_Travel/Benefits/TATA_Plan_" + planId + "_benefits.pdf";
        }
    } else if (insId == 44) {
        if (url.includes("https:")) {
            benefit_url = "https://www.policyboss.com/pdf-files/GoDigit_Travel/GoDigit_Brochure.pdf";
        } else {
            benefit_url = "http://qa.policyboss.com/Pdfs/GoDigit_Travel/GoDigit_Brochure.pdf";
        }
    }
    window.open(benefit_url, "_blank");
}

function allFilter() {
    $(".quoteBox").show();
    $(".plan_list").show();

    /* filtering SI */
    if (si_selected != 'All' && si_selected != undefined) {
        $(".quoteBox").hide();
        $(".plan_list").hide();
        $("[data-si=" + si_selected.substring(1) + "]").show();
    }

    /* filtering insurers */
    $(".dvInsImg").removeClass("act");
    if ($('.ins_chk').is(':checked')) {
        $(".quoteBox").hide();
        $(".plan_list").hide();
        let insChecked = $(".ins_chk:checked");

        for (var i = 0; i < insChecked.length; i++) {
            $("#ins_" + insChecked[i].id + "_Img").addClass("act");
            if (si_selected != 'All' && si_selected != undefined) {
                $("[data-ins=" + insChecked[i].value + "][data-si=" + si_selected.substring(1) + "]").show();
            } else {
                $("[data-ins=" + insChecked[i].value + "]").show();
            }
        }
    }

    setInsPlansCount();
}

function setInsPlansCount() {
    let ins_plans_count = {};
    let visibleDivs = $('.quoteBox:not([style*="display: none"])');
    for (var i = 0; i < visibleDivs.length; i++) {
        var ins = visibleDivs[i].dataset.ins;
        ins_plans_count[ins] = (ins_plans_count[ins] || 0) + 1;
    }
    console.log('ins_pln_cnt', ins_plans_count);
    $(".plan_count").text(visibleDivs.length);
    $(".ins_count").text(Object.keys(ins_plans_count).length);
}
function modifyLink() {
    //window.location.href = './travel_input.html?SID=' + srn;
    $('.quoteEditPopup').show();
}
function proposal_redirect(res_index) {
    arn = response_1[res_index].Service_Log_Unique_Id;
    window.location.href = BuyNowUrl() + '/proposal?client_id=2&arn=' + arn + '&is_posp=NonPOSP&ss_id=' + ss_id;

}