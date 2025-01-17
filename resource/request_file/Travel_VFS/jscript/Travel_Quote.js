var ss_id;
var arn, srn, client_id = 2;
var pb_crn = 0;
var StatusCount = 0;
var response = [];
var response_1 = [];
var summary = [];
var SIs = [];
var si_selected = '$50000';
var travel_start_date, travel_end_date, travel_region, trip_type;

$(document).ready(function () {
    srn = getUrlVars()["SID"];
    if (srn !== undefined) {
        getPremiumList(srn);
    }

    $('#si_filter').on('change', function () {
        si_selected = this.value;
        apply_filter();
    });
});

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
                response = data.Response;
                response_1 = data.Response_1;
                summary = data.Summary;
                pb_crn = summary['PB_CRN'];
                ss_id = summary.Request_Core.ss_id;
                $('#pb_crn').text(pb_crn);
                $('#members').val(summary.Request_Core.member_count + " member(s)");
                $('#trip_date').val(formatDate(summary.Request_Core.policy_start_date) + ' - ' + formatDate(summary.Request_Core.policy_end_date));
                StatusCount++;
                var CreateTime = new Date(summary.Created_On);
                var CurrentTime = new Date();
                var DateDiff = Date.parse(CurrentTime) - Date.parse(CreateTime);
                console.log(DateDiff);
                var is_complete = false;
                if (StatusCount > 3 || summary['Status'] === "complete") {
                    console.log('StatusCount', StatusCount);
                    is_complete = true;
                    console.log("Premium List - ", data);
                    $("#loader").hide();
                }
                if (is_complete === false) {
                    setTimeout(() => {
                        getPremiumList(ref_no);
                    }, 5000);
                } else {
                    console.log('StatusCount', StatusCount);
                    pb_crn = summary.PB_CRN === "" ? summary['Request_Core'].crn : summary.PB_CRN;
                    if (response_1.length > 0) {
                        $("#ins_count").text(summary.Insurer_Cnt);
                        $("#plan_count").text(summary.Plan_Cnt);

                        /* Appending quotes */
                        $("#QuoteWrapper").empty();
                        response_1.forEach((res, i) => {

                            if (!SIs.includes(res.Sum_Insured)) {
                                SIs.push(res.Sum_Insured);
                            }

                            $('#QuoteWrapper').append(
                                `<li class="resultRoW" data-ins='${res.Insurer_Id}' data-pln='${res.Plan_Id}' data-si='${res.Sum_Insured.substring(1)}' data-premium='${res.Premium_Breakup.final_premium}' id='QuoteDiv_${res.Insurer_Id}_${res.Plan_Id}'>
                       <div class="row resultCol">
                        <div class="col-25 colLine"><p class="pAlign"><img src="https://www.policyboss.com/Images/insurer_logo/${res.Insurer_Logo_Name}"></p>
						<span class='plan_name'>${res.Plan_Name}</span></div>
                        <div class="col-25 colLine">
                            <p><span class="colsmtext">MEDICAL COVER</span><br>
                            <span class="colbgtext">${res.Sum_Insured}</span><br>
                            <span class="colsmtext">Deductible: NA</span></p>
                        </div>
                        <div class="col-25 colLine disnone">
                            <p><span class="colsmtext">EXISTING DISEASES COVER</span><br>
                            <span class="colbgtext">NA</span></p>
                        </div>
                        <div class="col-25 colLine disnone">
                            <p><span class="colsmtext">BAGGAGE LOSS COVER</span><br>
                            <span class="colbgtext">NA</span></p>
                        </div>
                        <div class="col-25">
                        <div class="buyBtn" onclick='proposal_redirect(${i})' id="Premium_Amount_${res.Insurer_Id}_${res.Plan_Id}">
                            <a href="#">
                                <b><span style="font-size: 12px;">BUY</span><br><span style="font-size:24px;">&#8377 ${res.Premium_Breakup.final_premium}</span> </b>
                            </a>
                            </div>
                             <b style='font-weight: bolder;'><u><span class= 'benefit_span' onclick='benefit_popup(${i})'>Benefits</span></u></b>
                            </div>
                        </div>
                        <div class="details"><span><a href="#">Details</a></span></div>
                       </li>`
                            );

                            /*disable buy for LIVE*/
                            if ([5, 11].includes(res.Insurer_Id)) {
                                $('#Premium_Amount_' + res.Insurer_Id + '_' + res.Plan_Id).addClass('disableBuy');
                            }
                        });

                        $('#QuoteWrapper').html(sortData('premium', 'ascending', $('.resultRoW')));
                        SIs = sortData('si', 'ascending', SIs);
                        SIs.unshift("All");
                        //console.log(SIs);
                        SIs.forEach((res, i) => {
                            $('#si_filter').append(
                                `<option value='${res}'>${res}</option>`);
                        });

                        if (SIs.includes(si_selected)) {
                            $('option[value="' + si_selected + '"]').attr("selected", "selected");
                            apply_filter();
                        } else {
                            si_selected = 'All';
                        }
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
function formatDate(date) {
    if (date !== undefined && date !== "") {
        var myDate = new Date(date);
        var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ][myDate.getMonth()];
        var str = myDate.getDate() + " " + month + " " + myDate.getFullYear().toString().substring(2);
        console.log(str);
        return str;
    }
    return "";
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

function apply_filter() {
    $(".resultRoW").show();

    /* filtering SI */
    if (si_selected != 'All' && si_selected != undefined) {
        $(".resultRoW").hide();
        $("[data-si=" + si_selected.substring(1) + "]").show();
    }

    setInsPlansCount();
}

function setInsPlansCount() {
    let ins_plans_count = {};
    let visibleDivs = $('.resultRoW:not([style*="display: none"])');
    for (var i = 0; i < visibleDivs.length; i++) {
        var ins = visibleDivs[i].dataset.ins;
        ins_plans_count[ins] = (ins_plans_count[ins] || 0) + 1;
    }
    console.log('ins_pln_cnt', ins_plans_count);
    $("#plan_count").text(visibleDivs.length);
    $("#ins_count").text(Object.keys(ins_plans_count).length);
}

function proposal_redirect(res_index) {
    arn = response_1[res_index].Service_Log_Unique_Id;
    window.location.href = BuyNowUrl() + '/proposal?client_id=2&arn=' + arn + '&is_posp=NonPOSP&ss_id=' + ss_id;

}
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