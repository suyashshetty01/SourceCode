// Global variables
var SRN = "";
var clientid = 2;
var crn = 0;

$('.flip').click(function () { $(this).find('.card').toggleClass('flipped'); });

function flipimage() {
    $('.flip').click();
    setTimeout(function () {
        flipimage();
    }, 5000);
}

$(document).ready(function () {
    $.ajax({
        url: 'http://horizon.policyboss.com:5000/quote/qrcode?url=' + escape(window.location.href),
        success: function (response) {
            $('#vehimg').attr('src', response);
        },
        error: function (response) { }
    });

    setTimeout(function () {
        flipimage();
    }, 5000);
});

function onPageLoad() {

}
$('#btnclear').click(function () {
    $('#Addons p').find('input[type=checkbox]:checked').removeAttr('checked');
});
function addon_filter() {
    var addon_checked = $('#Addons p').find('input[type=checkbox]:checked');
    var addon_unchecked = $('#Addons p').find("input:checkbox:not(:checked)");
    var obj = {};
    if (addon_checked.length > 0) {
        $.each(addon_checked, function (i, value) {
            obj[value.id] = "yes";
        });
    }
    if (addon_unchecked.length > 0) {
        $.each(addon_unchecked, function (i, value) {
            obj[value.id] = "no";
        });
    }
    obj["data_type"] = "addon_quote";
    obj["search_reference_number"] = SRN;
    console.log(obj);
    $.get("Save_User_Data?update_data=" + JSON.stringify(obj) + "&ClientID=" + clientid,
        function (data) {
            console.log('data', data);
            var res = $.parseJSON(data);
            if (res.Msg == "Data saved") {
                handle_addon_addition();
                $('html,body').animate({
                    scrollTop: $(".quote-start").offset().top
                }, 'slow');
            }
        }
    );
}
function handle_addon_addition() {
    if (quotes.Response.length > 0) {
        var addon_checked = $('#Addons p').find('input[type=checkbox]:checked');
        var addon_unchecked = $('#Addons p').find("input:checkbox:not(:checked)");
        $.each(quotes.Response, function (index, value) {
            if (value.Error_Code == "") {
                var addon_amount = 0;//value.Premium_Breakup.net_premium;
                var addon_premium_breakup = "";
                $($('#divQuitList' + value.Insurer.Insurer_ID).children('.quotebox').children('.row').children()[1]).children('.clearfix').nextAll().remove();
                $($('#divQuitList' + value.Insurer.Insurer_ID).children('.addon-selected')).html("");
                $($('#divQuitList' + value.Insurer.Insurer_ID).children('.addon-selected')).hide();

                //addon label start
                var count = 0;
                console.log("addon_checked", addon_checked, "value.Addon_List", value.Addon_List, "Addon_List", addon_list);
                $.each(addon_checked, function (i, v) {
                    var addon_name = addon_shortlist[v.id];
                    var addon_Fullname = addon_list[v.id];
                    if (typeof value.Addon_List[v.id] !== 'undefined') {
                        count++;
                        var addon_premium = value.Addon_List[v.id];
                        addon_amount += addon_premium;
                        //addon_premium_breakup += addon_name + '-' + addon_premium + '+';//Commented By Pratik On 14-02-2018
                        addon_premium_breakup += addon_Fullname + '-' + addon_premium + '+';// Added By Pratik On 14-02-2018

                        //$($('#divQuitList' + value.Insurer.Insurer_ID).children('.quotebox').children('.row').children()[1]).append('<div class="keyboxleft-full"><i class="fa fa-check txtred"></i>' + addon_name + '</div>');
                        $($('#divQuitList' + value.Insurer.Insurer_ID).children('.addon-selected')).append('<div class="col-xs-4 col-md-2 form-height"><button class="btn btn-success btn-xs btn-block waves-effect" type="button" title="' + addon_Fullname + '">' + addon_name + ' <span class="badge">' + addon_premium + '</span></button></div>');

                    }
                    //else {
                    //    $($('#divQuitList' + value.Insurer.Insurer_ID).children('.addon-selected')).append('<div class="col-xs-6 col-md-3 form-height"><button class="btn btn-danger btn-xs btn-block waves-effect" type="button">' + addon_name + ' <span class="badge">NA</span></button></div>');
                    //}
                });


                //addon label end
                var total_liability_premium = value.Premium_Breakup.liability['tp_final_premium'] - 0;
                var net_premium = value.Premium_Breakup.net_premium + addon_amount;
                var service_tax = Math.round(net_premium * 0.18) - 0;
                var od_final_premium = value.Premium_Breakup.own_damage['od_final_premium'] - 0;
                var ncb = value.Premium_Breakup.own_damage['od_disc_ncb'] - 0;

                //Added by Ajit for TATA-AIG and Bajaj for Service Tax Calculation
                if (value.Insurer.Insurer_ID == 11) {
                    var net_premium_without_rsa = value.Premium_Breakup.own_damage['od_final_premium'] + value.Premium_Breakup.liability['tp_final_premium'] + addon_amount;
                    net_premium = net_premium_without_rsa;
                    var flag_addon_rsa = false;
                    var addon_amount_rsa = 0;
                    if (value.Addon_List.hasOwnProperty('addon_road_assist_cover')) {
                        $.each(addon_checked, function (i, v) {
                            var addon_name = addon_list[v.id];
                            if (addon_name == 'RoadSide Assistance') {
                                flag_addon_rsa = true;
                                addon_amount_rsa = value.Addon_List[v.id];
                            }
                        });
                    }
                    if (flag_addon_rsa) {
                        net_premium_without_rsa = Math.round(net_premium_without_rsa) - addon_amount_rsa - 0;
                    }
                    service_tax = 2 * (Math.round(net_premium_without_rsa * 0.09)) + Math.round(addon_amount_rsa * 0.18) - 0;
                }
                if (value.Insurer.Insurer_ID == 14) {
                    var addon_amount_me = addon_amount;
                    if (value.Addon_List.hasOwnProperty('addon_medical_expense_cover')) {
                        $.each(addon_checked, function (i, v) {
                            var addon_name = addon_list[v.id];
                            if (addon_name == 'Medical Expense') {
                                flag_addon_rsa = true;
                                addon_amount_me = addon_amount_me - value.Addon_List[v.id];
                            }
                        });
                    }
                    var od_final_uui = value.Premium_Breakup.own_damage['od_final_premium'] + value.Premium_Breakup.own_damage['od_disc_ncb'] + addon_amount_me;
                    var ncb_next_slab = value.Premium_Rate.own_damage['od_disc_ncb'] - 0;
                    console.log('od_final_uui', od_final_uui);
                    ncb = (od_final_uui * ncb_next_slab / 100);
                    od_final_premium = od_final_uui - addon_amount_me - ncb;
                    net_premium = od_final_premium + total_liability_premium + addon_amount;
                    console.log('final', od_final_premium, total_liability_premium, addon_amount, ncb);
                    service_tax = (net_premium * 0.18);
                }
                var final_premium = Math.round(net_premium + service_tax - 0);
                $('#divQuitList' + value.Insurer.Insurer_ID).children('.quotebox').children('.row').children('.dynamic').children('.quote-buynow').html('<span class="Premium">Rs. ' + rupee_format(final_premium) + '<i style="font-size:14px">(1 year) </i></span><span class="glyphicon glyphicon-chevron-right"></span>');
                $('#divQuitList' + value.Insurer.Insurer_ID).attr('premium', final_premium);
                $('#divQuitList' + value.Insurer.Insurer_ID).attr('applied_addon', count);
                $('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('netpayablepayablepremium', rupee_format(final_premium));
                $('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('servicetax', rupee_format(Math.round(service_tax)));
                $('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('addonpremium', Math.round(addon_amount));
                $('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('addonname', addon_premium_breakup);

                if (value.Insurer.Insurer_ID == 35) {
                    net_premium = net_premium - 195;
                    total_liability_premium = value.Premium_Breakup.liability['tp_final_premium'] - 195;
                }

                $('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('TotalLiabilityPremium', total_liability_premium);
                $('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('totalpremium', rupee_format(Math.round(net_premium)));
                $('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('NoClaimBonus', rupee_format(Math.round(ncb)));
                $('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('TotalODPremium', rupee_format(Math.round(od_final_premium)));

                if (addon_checked.length > 0) {
                    $($('#divQuitList' + value.Insurer.Insurer_ID).children('.addon-selected')).slideDown();
                }
                else {
                    $($('#divQuitList' + value.Insurer.Insurer_ID).children('.addon-selected')).slideUp();
                }
            }
        });

        $('.quoteboxparent').html($('.quoteboxmain').pbsort(false, "applied_addon"));
        set_minmax_premium();
    }
}
function redirect(id) {
    var arn = $(id).attr('href').split("/")[3];
    $(id).attr('href', $(id).attr('href').replace("___client_id___", clientid));
    var i = 0;
    $.each(quotes.Response, function (index, value) {
        if (value.Service_Log_Unique_Id == arn) {
            i = index;
            return false;
        }
    });
    var breakup = quotes.Response[i].Premium_Breakup;
    var obj = {
        ProductInsuranceMapping_Id: quotes.Summary.Request_Core.crn,
        Insurer_Id: quotes.Response[i].Insurer_Id,
        BasicOwnDamage: breakup.own_damage.od_basic,
        NonElectricalAccessoriesPremium: breakup.own_damage.od_non_elect_access,
        ODDiscount: breakup.own_damage.od_disc,
        NetODAfterTariffDiscount: breakup.own_damage.od_basic - breakup.own_damage.od_disc,
        ElectricalAcessoriesPremium: breakup.own_damage.od_elect_access,
        BiFuelKitPremium: breakup.own_damage.od_cng_lpg,
        TotalOwnDamagePremium: breakup.own_damage.od_final_premium,
        AntiTheftDiscount: breakup.own_damage.od_disc_anti_theft,
        VoluntaryDeductions: breakup.own_damage.od_disc_vol_deduct,
        AutomobileAssociationMembershipPremium: breakup.own_damage.od_disc_aai,
        NoClaimBonus: breakup.own_damage.od_disc_ncb,
        UnderwriterLoading: breakup.own_damage.od_loading,
        TotalODPremium: breakup.own_damage.od_final_premium,
        ThirdPartyLiablityPremium: breakup.liability.tp_basic,
        BiFuelKitLiabilityPremium: breakup.liability.tp_cng_lpg,
        PersonalAccidentCoverForOwnerDriver: breakup.liability.tp_cover_owner_driver_pa,
        LegalLiabilityPremiumForPaidDriver: breakup.liability.tp_cover_paid_driver_ll,
        PersonalAccidentCoverForUnammedPassenger: breakup.liability.tp_cover_unnamed_passenger_pa,
        TotalLiabilityPremium: breakup.liability.tp_final_premium,
        TotalPremium: breakup.net_premium,
        ARN: arn,
        AddOnPremium: 0,
        ServiceTax: breakup.service_tax,
        NetPayablePayablePremium: breakup.final_premium,
        IDV: quotes.Response[i].LM_Custom_Request.vehicle_expected_idv,
        Insurer_IDV: quotes.Response[i].LM_Custom_Request.vehicle_expected_idv
    };
    console.log(obj);
    $.ajax({
        url: "Update_Motor_Quote?quote=" + JSON.stringify(obj),
        type: 'Get',
        data: JSON.stringify(obj),
        contentType: 'application/json;',
        dataType: "json",
        success: function (response) {
        },
        error: function (response) { }
    });
    if (quotes.Response[i].Insurer_Id == 11) {
        if (quotes.Summary.Request_Core.vehicle_insurance_type == "renew") {
            var addon_checked = $('#Addons p').find('input[type=checkbox]:checked');
            if (addon_checked.length > 0) {
                //var addon_list = quotes.Response[i].Addon_List;
                //$.each(addon_checked, function (i, value) {
                //    if (addon_list[value.id] > 0) {
                showConfirmMessage(arn);
                return false;
            }
            //});               
        }
        else {
            return true;
        }
    }
    else { return true; }


    //$('#body').remove();

    //location.href = this.href;
}

var search_summary;
var max_calling_times = 12;
var long_wait = 2;
var addon_list = {
    'addon_ambulance_charge_cover': 'Ambulance Charge',
    'addon_consumable_cover': 'Consumables',
    'addon_daily_allowance_cover': 'Daily Allowance',
    'addon_engine_protector_cover': 'Engine Protection',
    'addon_hospital_cash_cover': 'Hospital Cash',
    'addon_hydrostatic_lock_cover': 'Hydrostatic Lock',
    'addon_inconvenience_allowance_cover': 'Inconvinenience Allowance',
    'addon_invoice_price_cover': 'Invoice Price',
    'addon_key_lock_cover': 'Key Lock',
    'addon_losstime_protection_cover': 'Loss-Time Protection',
    'addon_medical_expense_cover': 'Medical Expense',
    'addon_ncb_protection_cover': 'NCB Protection',
    'addon_passenger_assistance_cover': 'Passenger Assistance',
    'addon_personal_belonging_loss_cover': 'Personal Belonging Loss',
    'addon_road_assist_cover': 'RoadSide Assistance',
    'addon_rodent_bite_cover': 'Rodent Bite',
    'addon_tyre_coverage_cover': 'Tyre Coverage',
    'addon_windshield_cover': 'Windshield Protection',
    'addon_zero_dep_cover': 'Zero Depreciation',
    'addon_additional_pa_cover': 'Additional PA'
};
var addon_shortlist = {
    'addon_ambulance_charge_cover': 'AC',
    'addon_consumable_cover': 'CC',
    'addon_daily_allowance_cover': 'DA',
    'addon_engine_protector_cover': 'EP',
    'addon_hospital_cash_cover': 'HC',
    'addon_hydrostatic_lock_cover': 'HL',
    'addon_inconvenience_allowance_cover': 'IA',
    'addon_invoice_price_cover': 'IP',
    'addon_key_lock_cover': 'KL',
    'addon_losstime_protection_cover': 'LTP',
    'addon_medical_expense_cover': 'ME',
    'addon_ncb_protection_cover': 'NCBP',
    'addon_passenger_assistance_cover': 'PA',
    'addon_personal_belonging_loss_cover': 'PBL',
    'addon_road_assist_cover': 'RA',
    'addon_rodent_bite_cover': 'RB',
    'addon_tyre_coverage_cover': 'TC',
    'addon_windshield_cover': 'WP',
    'addon_zero_dep_cover': 'ZD',
    'addon_additional_pa_cover': 'APA'
};
var videolink_list = {
    'addon_ambulance_charge_cover': 'Tllo-iqhgek',
    'addon_consumable_cover': 'Tllo-iqhgek',
    'addon_daily_allowance_cover': 'Tllo-iqhgek',
    'addon_engine_protector_cover': 'Tllo-iqhgek',
    'addon_hospital_cash_cover': 'Tllo-iqhgek',
    'addon_hydrostatic_lock_cover': 'Tllo-iqhgek',
    'addon_inconvenience_allowance_cover': 'Tllo-iqhgek',
    'addon_invoice_price_cover': 'Tllo-iqhgek',
    'addon_key_lock_cover': 'Tllo-iqhgek',
    'addon_losstime_protection_cover': 'Tllo-iqhgek',
    'addon_medical_expense_cover': 'Tllo-iqhgek',
    'addon_ncb_protection_cover': 'Tllo-iqhgek',
    'addon_passenger_assistance_cover': 'Tllo-iqhgek',
    'addon_personal_belonging_loss_cover': 'Tllo-iqhgek',
    'addon_road_assist_cover': 'Tllo-iqhgek',
    'addon_rodent_bite_cover': 'Tllo-iqhgek',
    'addon_tyre_coverage_cover': 'Tllo-iqhgek',
    'addon_windshield_cover': 'Tllo-iqhgek',
    'addon_zero_dep_cover': 'Tllo-iqhgek'
};
var arr_insurer_breakin_support = [1, 2, 4, 5, 6, 9, 11, 12, 19, 30, 22, 35,45];
var insurer_list = [
       { "Insurer_ID": 1, "Insurer_Name": "Bajaj Allianz", "Insurer_Logo_Name": "BajajAllianzLife.png" },
       { "Insurer_ID": 2, "Insurer_Name": "Bharti Axa", "Insurer_Logo_Name": "Bharti_Axa_General.png" },
       { "Insurer_ID": 4, "Insurer_Name": "Future Generali India", "Insurer_Logo_Name": "Future_Generali_General.png" },
       { "Insurer_ID": 5, "Insurer_Name": "HDFC ERGO", "Insurer_Logo_Name": "hdfc.png" },
       { "Insurer_ID": 6, "Insurer_Name": "ICICI Lombard", "Insurer_Logo_Name": "ICICI_Lombard.png" },
       { "Insurer_ID": 7, "Insurer_Name": "IFFCO Tokio", "Insurer_Logo_Name": "Iffco_Tokio_General.png" },
       { "Insurer_ID": 9, "Insurer_Name": "Reliance General", "Insurer_Logo_Name": "reliance.png" },
       { "Insurer_ID": 10, "Insurer_Name": "Royal Sundaram", "Insurer_Logo_Name": "royal.png" },
       { "Insurer_ID": 11, "Insurer_Name": "Tata AIG", "Insurer_Logo_Name": "tata_aig.png" },
       { "Insurer_ID": 12, "Insurer_Name": "New India Assurance", "Insurer_Logo_Name": "new_india.png" },
       { "Insurer_ID": 14, "Insurer_Name": "United India", "Insurer_Logo_Name": "United.png" },
       { "Insurer_ID": 19, "Insurer_Name": "Universal Sompo", "Insurer_Logo_Name": "universal_sompo.png" },
       { "Insurer_ID": 30, "Insurer_Name": "Kotak Mahindra", "Insurer_Logo_Name": "kotak.png" },
       { "Insurer_ID": 33, "Insurer_Name": "Liberty Videocon", "Insurer_Logo_Name": "liberty.png" },
       { "Insurer_ID": 44, "Insurer_Name": "Digit", "Insurer_Logo_Name": "Go_Digit.png" },
       { "Insurer_ID": 35, "Insurer_Name": "Magma HDI", "Insurer_Logo_Name": "magma_hdi.png" },
       { "Insurer_ID": 45, "Insurer_Name": "Acko General", "Insurer_Logo_Name": "Acko_General.png" }
];


$(document).ready(function () {
    console.log("loaded");
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    SRN = hashes[0].split('=')[1];
    if (hashes.length >= 2)
        clientid = parseInt(hashes[1].split('=')[1]);
    Display_blocks();
    console.log(clientid);
    Get_Search_Summary(clientid);
    if (!location.href.includes("www")) {
        max_calling_times = 15;
        long_wait = 7;
    }
});

$(document).on("click", ".addon-video", function () {
    var modal_html = $("#videoModal").html();
    var reg = new RegExp("___video_id___", "gi");
    modal_html = modal_html.replace(reg, videolink_list[$(this).attr("addon_name")]);
    $("#videoModal").html(modal_html);
});

function Display_blocks() {
    $(".quoteboxparent").empty();
    var insurer_display_list = insurer_list_live;
    if (!location.href.includes("www")) {
        insurer_display_list = insurer_list;
    }
    $.each(insurer_display_list, function (index, value) {
        var block = html_quote;
        block = block.replace("hidden", "");
        $.each(value, function (index1, value1) {
            var regex = new RegExp("___" + index1 + "___", "gi");
            block = block.replace(regex, value1);
        });
        block = block.replace("___client_id___", clientid);
        if (value.Insurer_ID == 35) {
            if (block.indexOf('magmakeybenefits') > -1) {
                block = block.replace("hidden", "");
            }

        }


        $(".quoteboxparent").append(block);
    });
}

function Get_Search_Summary(clientid) {
    $.ajax({
        url: "Get_Search_Summary?SID=" + SRN + "&ClientID=" + clientid,
        type: 'GET',
        contentType: 'application/json;',
        dataType: "json",
        success: function (response) {
            console.log(response);
            try {
                var vehicle = response.Master.Vehicle;
                var request = response.Request;
                original_request = request;
                search_summary = response;
                //console.log(search_summary.Summary);
                $('.twoWheelerImageHeader').append(' ' + response.Summary.PB_CRN);
                crn = response.Summary.PB_CRN == null ? 0 : response.Summary.PB_CRN;
                $('#CustomerReferenceID').val(crn);
                $('#Variant').text(vehicle.Make_Name + " " + vehicle.Model_Name + " " + vehicle.Variant_Name);
                $('#Variant1').text(vehicle.Make_Name + " " + vehicle.Model_Name + " " + vehicle.Variant_Name);
                var $radios = $('input:radio[name=IsAntiTheftDevice]');
                if ($radios.is(':checked') === false && request.is_antitheft_fit == "yes") {
                    $radios.filter('[value=Yes]').prop('checked', true);
                }
                if ($radios.is(':checked') === false && request.is_antitheft_fit == "no") {
                    $radios.filter('[value=No]').prop('checked', true);
                }
                var $radios = $('input:radio[name=MemberofAA]');
                if ($radios.is(':checked') === false && request.is_aai_member == "yes") {
                    $radios.filter('[value=Yes]').prop('checked', true);
                }
                if ($radios.is(':checked') === false && request.is_aai_member == "no") {
                    $radios.filter('[value=No]').prop('checked', true);
                }

                var $radios = $('input:radio[name=OwnerDriverPersonalAccidentCover]');
                if ($radios.is(':checked') === false && request.pa_owner_driver_si == "100000") {
                    $radios.filter('[value=Yes]').prop('checked', true);
                }
                if ($radios.is(':checked') === false && request.pa_owner_driver_si == "0") {
                    $radios.filter('[value=No]').prop('checked', true);
                }
                var $radios = $('input:radio[name=PeronalAccidentCoverforDriver]');
                if ($radios.is(':checked') === false && request.is_llpd == "yes") {
                    $radios.filter('[value=Yes]').prop('checked', true);
                }
                if ($radios.is(':checked') === false && request.is_llpd == "no") {
                    $radios.filter('[value=No]').prop('checked', true);
                }
                var $radios = $('input:radio[name=PaidDriverPersonalAccidentCover]');
                if ($radios.is(':checked') === false && request.pa_paid_driver_si == "100000") {
                    $radios.filter('[value=Yes]').prop('checked', true);
                }
                if ($radios.is(':checked') === false && request.pa_paid_driver_si == "0") {
                    $radios.filter('[value=No]').prop('checked', true);
                }

                $('#VoluntaryDeduction').val(request.voluntary_deductible > 0 ? request.voluntary_deductible : 0);
                $('#PersonalCoverPassenger').val(request.pa_unnamed_passenger_si > 0 ? request.pa_unnamed_passenger_si : 0);
                $('#NamedPersonalAccidentCover').val(request.pa_named_passenger_si > 0 ? request.pa_named_passenger_si : 0);
                $('#ElectricalAccessories').val(request.electrical_accessory);
                $('#NonElectricalAccessories').val(request.non_electrical_accessory);
                $('#spinner').css("visibility", "visible");
                //$('#expected_idv').val(request.vehicle_expected_idv);
                if (request.vehicle_insurance_type == "renew") {
                    console.log(request.vehicle_insurance_type);
                    $('.idv_range').removeClass('hidden');
                    $('.idv_slider').removeClass('hidden');
                }
                $('#expected_idv').attr("value", request.vehicle_expected_idv);
                $('#expected_idv').prev().text(request.vehicle_expected_idv);
                $('#expected_idv').prev().val(request.vehicle_expected_idv);



                if (response.hasOwnProperty('Insurer_Details') && response.Insurer_Details != null)
                { Populate_Keybenefits(response.Insurer_Details); }
                Get_Saved_Data();
            }
            catch (e) {
                console.log('Exception: ' + e);
            }
        },
        error: function (response) { }
    });
}
function Populate_Keybenefits(Insurer_details) {
    $.each(Insurer_details, function (i, val) {
        var benifitshtml = "";
        $.each(val.Keybenefit.split("\n"), function (i, v) {
            benifitshtml += '<div class="keyboxleft-full"><i class="fa fa-check txtred"></i>' + v + '</div>';
        });
        $('#benifits' + val.Insurer_ID).append(benifitshtml);
        html_quote = $(".quoteboxparent").html();
    });

}

var Available_Addon_List = [];
var html_quote = $(".quoteboxparent").html();
var html_brand = $('#Brands').html();
var html_addon = $('#Addons').html();
var original_request = "";

function Get_Saved_Data() {
    $.get("Get_Saved_Quotes?SID=" + SRN + "&ClientID=" + clientid,
         function (response) {
             if (max_calling_times > 0) {
                 var res = $.parseJSON(response);
                 quotes = res;
                 response_handler();
             }
             else {

                 //console.log("Quotes no available for selected Criteria");
             }
         });
}
function response_handler() {

    console.log('premium_db_list', quotes);


    if (quotes.Summary.Status == "complete") {
        prepend_quotes();
        delete_block();
        hide_spinner();
        $("#quoteloder").fadeOut('fast', function () {
            $('#main').show();
        });
    }
    else {
        var dateString = quotes.Summary.Created_On;
        var createdon = moment(dateString);
        var now = new moment();
        var diff = now - createdon;
        if (diff > 200000) {
            prepend_quotes();
            delete_block();
            hide_spinner();
            $("#quoteloder").fadeOut('fast', function () {
                $('#main').show();
            });
        }
        else {
            max_calling_times--;
            console.log(max_calling_times);
            prepend_quotes();
            if (max_calling_times > long_wait) {
                console.log("calling again");
                setTimeout(function () {
                    Get_Saved_Data();
                }, 3000);
            }
            else if (max_calling_times != 0) {
                console.log("calling again");
                setTimeout(function () {
                    Get_Saved_Data();
                }, 10000);
            }
            else {
                delete_block();
            }
            if (max_calling_times == long_wait) {
                hide_spinner();
            }
        }
    }
}
function prepend_quotes() {

    // for loop to add premiums through jquery...finally hahaha....i know
    var insurer_count = 0;
    if (crn <= 0) {
        $('.twoWheelerImageHeader').append(' ' + quotes.Summary.PB_CRN);
        crn = quotes.Summary.PB_CRN;
        $('#CustomerReferenceID').val(crn);
    }
    var is_expired = false;
    var prev_policy_expiry_date = moment(original_request.policy_expiry_date, 'YYYY-MM-DD');
    if (moment().diff(prev_policy_expiry_date, 'days') > 0) {
        is_expired = true;
    }
    for (var i = 0; i < quotes.Response.length ; i++) {
        if (is_expired) {
            if (arr_insurer_breakin_support.indexOf(quotes.Response[i].Insurer.Insurer_ID) < 0) {
                continue;
            }
        }
        if (quotes.Response[i].Insurer.Insurer_ID == 35 && original_request.ss_id == 0 && false) {
            continue;
        }
        var current_div = $('#divQuitList' + quotes.Response[i].Insurer.Insurer_ID);

        if (quotes.Response[i].Error_Code != "") {
            if (location.href.includes("www")) {
                current_div.remove();
            }
            else {
                addRequestResponse(current_div, quotes.Response[i]);
            }
            continue;
        }

        insurer_count++;
        var quote = current_div.html();
        current_div.parent().prepend(current_div);
        var update_quote_object = {};

        //transform hierachical object to first depth
        $.each(quotes.Response[i], function (index, value) {
            if (typeof value == 'object' && value != null) {
                $.each(value, function (index1, value1) {
                    if (typeof value1 == 'object' && value1 != null) {
                        $.each(value1, function (index2, value2) {
                            var keytoreplace = '___' + index + '_' + index1 + '_' + index2 + '___';
                            update_quote_object[keytoreplace] = value2;
                        });
                    }
                    else {
                        var keytoreplace = '___' + index + '_' + index1 + '___';
                        update_quote_object[keytoreplace] = value1;
                    }
                });
            }
            else {
                var keytoreplace = '___' + index + '___';
                update_quote_object[keytoreplace] = value;
            }
        });
        update_quote_object['___fair_price___'] = (update_quote_object['___Premium_Breakup_final_premium___'] * 100 / update_quote_object['___LM_Custom_Request_vehicle_expected_idv___']).toFixed(2);
        //replace place holder
        console.log(update_quote_object);
        $.each(update_quote_object, function (index, value) {
            if (index.indexOf('Premium_Breakup') > -1 || index.indexOf('_idv') > -1) {
                value = rupee_format(Math.round(value - 0));
            }
            if (value != null) {
                var regex = new RegExp(index, "gi");
                quote = quote.replace(regex, value);
            }
        });

        // hide preloader and display premium
        current_div.empty();
        current_div.append(quote);
        current_div.children('.quotebox').children('.row').children('.dynamic').removeClass('hidden');
        if (!current_div.children('.quotebox').children('.row').children('.preloader').hasClass('hidden'))
            current_div.children('.quotebox').children('.row').children('.preloader').addClass('hidden');
        current_div.attr('premium', quotes.Response[i].Premium_Breakup.final_premium);
        current_div.attr('idv', quotes.Response[i].LM_Custom_Request.vehicle_expected_idv);
        current_div.attr('total_addon', quotes.Response[i].Addon_List.length);
        current_div.attr('fair_price', update_quote_object['___fair_price___']);


        // to set idv range
        var request = quotes.Summary;
        $('#expected_idv').attr('min', request.Idv_Min);
        $('#expected_idv').attr('max', request.Idv_Max);
        $('#expected_idv').prev().attr('min', request.Idv_Min);
        $('#expected_idv').prev().attr('max', request.Idv_Max);
        $($('#expected_idv').next().children()[0]).html(rupee_format(request.Idv_Min));
        $($('#expected_idv').next().children()[1]).html(rupee_format(request.Idv_Max));
    }

    if (insurer_count > 0) {

        //Addon filter
        //if (quotes.Summary.Request_Core.ss_id == 0 && quotes.Summary.Common_Addon.hasOwnProperty('addon_additional_pa_cover')) {            
        //    delete quotes.Summary.Common_Addon['addon_additional_pa_cover'];
        //}
        var common_addon_list = quotes.Summary.Common_Addon;

        $('#Addons').empty();

        var count = 0;
        //populate common addon
        $.each(common_addon_list, function (index, value) {
            addon = html_addon;
            addon = addon.replace(new RegExp('___Common_Addon___', 'gi'), index);
            addon = addon.replace('___Common_Addon_Name___', addon_list[index] + '(' + addon_shortlist[index] + ')');
            if (value.min == value.max) {
                addon = addon.replace('___addon_range___', 'Upto Rs ' + value.min);
            }
            else {
                addon = addon.replace('___addon_range___', 'Rs ' + value.min + ' - Rs ' + value.max);
            }

            $('#Addons').append(addon);
            count++;
        });
        //$('#addon_additional_pa_cover').parent().hide();

        //if (count > 1) {

        //}
        $("#Addons").removeClass('hidden');

        // check unckeck based on previous search
        $.each(search_summary.Addon_Request, function (index, value) {
            console.log(index, value);
            if (value == "yes")
                $('#' + index).click();
        });

        handle_addon_addition();
        var divQts = $('.quoteboxmain').pbsort(true, "fair_price");
        $('.quoteboxparent').html(divQts);

        //$("#Brands").empty();
        //var unique = {};
        //var distinct = [];
        //var res = quotes.Response;
        //res.forEach(function (x) {
        //    if (!unique[x.Insurer_Id] && x.Error_Code == "" && x.Status == "complete") {
        //        distinct.push(x);
        //        unique[x.Insurer_Id] = true;
        //    }
        //});
        //var brand = html_brand;
        //for (var i = 0; i < distinct.length; i++) {
        //    var brandhtml = brand.replace("hidden", "");
        //    var regex = new RegExp("___Insurer_Id___", "gi");
        //    brandhtml = brandhtml.replace(regex, distinct[i].Insurer_Id);
        //    regex = new RegExp("___Insurer_Code___", "gi");
        //    brandhtml = brandhtml.replace(regex, distinct[i].Insurer.Insurer_Code);

        //    $("#Brands").append(brandhtml);
        //}

        //set odometer values
        $('.insurer_ctn').html(insurer_count);
        $('.idv_min').html(quotes.Summary.Idv_Min == null ? 0 : quotes.Summary.Idv_Min);
        $('.idv_max').html(quotes.Summary.Idv_Max == null ? 0 : quotes.Summary.Idv_Max);


    }
}
function delete_block() {
    var insurer_display_list = insurer_list;
    if (location.href.indexOf("www") > 0) {
        insurer_display_list = insurer_list_live;
    }
    for (var i = 0; i < insurer_display_list.length; i++) {
        var div = $('#divQuitList' + insurer_display_list[i].Insurer_ID);
        if (div.children('.quotebox').children('.row').children('.dynamic').hasClass('hidden')) {
            div.remove();
        }
    }
}
function hide_spinner() {
    $('#spinner').css("visibility", "hidden");
    $('#spinner').parent().slideUp("slow");
}

$('#btnReset').click(function () {
    var request = original_request;
    var $radios = $('input:radio[name=IsAntiTheftDevice]');
    if (request.is_antitheft_fit == "yes") {
        $radios.filter('[value=Yes]').prop('checked', true);
    }
    if (request.is_antitheft_fit == "no") {
        $radios.filter('[value=No]').prop('checked', true);
    }

    $('#VoluntaryDeduction').val(request.voluntary_deductible > 0 ? request.voluntary_deductible : 0)

    $('#ElectricalAccessories').val(request.electrical_accessory);
    $('#NonElectricalAccessories').val(request.non_electrical_accessory);
    $('#expected_idv').val("0");
    $('#expected_idv').prev().text("0");
    $('#expected_idv').prev().val("0");
});

var rangeSlider = function () {
    var slider = $('.range-slider'),
        range = $('.range-slider__range'),
        value = $('.range-slider__value');

    slider.each(function () {
        value.each(function () {
            $(this).next().attr('value', this.html);
            //$(this).next().attr(value);            
        });

        range.on('input', function () {
            $(this).prev(value).val(this.value);
            $(this).attr("value", this.value);
        });
    });

    value.focusout(function () {
        // if value entered is less than min value 
        if (this.value - 0 < $(this).next().attr("min") - 0) { this.value = 0; }
        else if (this.value - 0 > $(this).next().attr("max") - 0) { this.value = $(this).next().attr("max"); }
        $(this).next().attr('value', this.value);
        $('.range-slider__range').val(this.value);
    });
};

rangeSlider();

function rupee_format(x) {
    x = x.toString();
    var lastThree = x.substring(x.length - 3);
    var otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers != '')
        lastThree = ',' + lastThree;
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
}
function set_minmax_premium() {
    var arr_prem = [];
    $(".quoteboxparent .quoteboxmain").each(function (index) {
        if ($(this).children('.quotebox').children('.row').children('.preloader').hasClass('hidden')) {
            var ind_prem = $(this).attr('premium') - 0;
            if (!(isNaN(ind_prem))) {
                arr_prem.push(ind_prem);
            }
        }
    });
    $('.premium_min').html(Math.min.apply(null, arr_prem) == NaN ? 0 : Math.min.apply(null, arr_prem));
    $('.Premium_Max').html(Math.max.apply(null, arr_prem) == NaN ? 0 : Math.max.apply(null, arr_prem));
    console.log(arr_prem, 'Min', Math.min.apply(null, arr_prem), 'Max', Math.max.apply(null, arr_prem));
}
function addRequestResponse(current_div, quote) {
    console.log(quote);
    var uatReview_list = [1, 10, 11, 30, 35, 14];
    if (uatReview_list.indexOf(quote.Insurer.Insurer_ID) > -1) {
        current_div.children('.quotebox').children('.row').children('.dynamic').removeClass('hidden');
        if (!current_div.children('.quotebox').children('.row').children('.preloader').hasClass('hidden'))
            current_div.children('.quotebox').children('.row').children('.preloader').addClass('hidden');
        if (['LM003', 'LM004', 'LM005', 'LM006'].indexOf(quote.Error_Code) > -1) {
            $(current_div.children('.quotebox').children('.row').children('.dynamic')[0]).html('<p class="text-center">ERROR</p>');
            var html = "";
            if (quote.Error_Code == 'LM003') { html = "Vehicle Not Mapped"; }
            else if (quote.Error_Code == 'LM004') { html = "RTO Not Mapped"; }
            else if (quote.Error_Code == 'LM005') { html = "Prev Insurer Not Mapped"; }
            else if (quote.Error_Code == 'LM006') { html = "IDV Not Available"; }
            $(current_div.children('.quotebox').children('.row').children('.dynamic')[1]).html('' + html);
        }
        else {
            $(current_div.children('.quotebox').children('.row').children('.dynamic')[0]).html('<p class="text-center">ERROR</p>');
            $(current_div.children('.quotebox').children('.row').children('.dynamic')[1]).html('<div><a class="text-center" href="http://qa-horizon.policyboss.com:3000/service_logs/' + quote.Service_Log_Id + '/Insurer_Request" target="_blank">Insurer Request</a></div>' +
            '<div><a class="text-center" href="http://qa-horizon.policyboss.com:3000/service_logs/' + quote.Service_Log_Id + '/Insurer_Response_Core" target="_blank">Insurer Response</a></div>' +
            '<div><a class="text-center" href="http://qa-horizon.policyboss.com:3000/service_logs/' + quote.Service_Log_Id + '/Insurer_Response" target="_blank">Response Json</a></div>');
        }
    }
}