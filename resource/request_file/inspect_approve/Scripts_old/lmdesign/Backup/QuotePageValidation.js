// Global variables
var SRN = "";
var clientid = 2;
var crn = 0;
var CoverCount = 0;
var DiscountCount = 0;
var ProductIdVal;
var Name = "";
var EmailVal = "";
var SSID = "";
var SelectedInsId = 0;
var EA = 0;
var NEA = 0;
var EBV = 0;
var VehInsSubType = "";

$(document).ready(function () {
    $('#vehimg').attr('src','https://chart.googleapis.com/chart?chl=' + escape(window.location.href) + '&chld=L|4&choe=UTF-8&chs=200x200&cht=qr&');
    $('#qrpopup').attr('src', 'https://chart.googleapis.com/chart?chl=' + escape(window.location.href) + '&chld=L|4&choe=UTF-8&chs=200x200&cht=qr&');
    $('.collapse.in').prev('.panel-heading').addClass('active');
    $('#accordion, #bs-collapse')
    .on('show.bs.collapse', function (a) { $(a.target).prev('.panel-heading').addClass('active'); })
    .on('hide.bs.collapse', function (a) { $(a.target).prev('.panel-heading').removeClass('active'); });

});

$('#btnclear').click(function () { $('#Addons p').find('input[type=checkbox]:checked').removeAttr('checked'); });

function addon_filter() {
    var addon_checked = $('#Addons').find('input[type=checkbox]:checked');
    var addon_unchecked = $('#Addons').find("input:checkbox:not(:checked)");
    var obj = {};
    if (addon_checked.length > 0) { $.each(addon_checked, function (i, value) { obj[value.id] = "yes"; }); $(".trAddon").removeClass('hidden'); }
    if (addon_unchecked.length > 0) { $.each(addon_unchecked, function (i, value) { obj[value.id] = "no"; }); }
    obj["data_type"] = "addon";
    obj["search_reference_number"] = SRN;
    console.log(obj);
    $.get("Save_User_Data?update_data=" + JSON.stringify(obj) + "&ClientID=" + clientid,
        function (data) {
            console.log('data', data);
            var res = $.parseJSON(data);
            if (res.Msg == "Data saved") {
                handle_addon_addition();
                //$('html,body').animate({ -start").offset().top }, 'slow');
            }
        }
    );
    //console.log(addon_checked.length);
    $("#AddonCount").text("("+addon_checked.length+")");
}

function handle_addon_addition() {
    if (quotes.Response.length > 0) {
        var addon_checked = $('#Addons').find('input[type=checkbox]:checked');
        var addon_unchecked = $('#Addons').find("input:checkbox:not(:checked)");
        $.each(quotes.Response, function (index, value) {
            if (value.Error_Code == "") {
                var addon_amount = 0;//value.Premium_Breakup.net_premium;
                var addon_premium_breakup = "";
                $($('#divQuitList' + value.Insurer.Insurer_ID).children('.UlClass').children('.LiClass').children()[1]).children('.clearfix').nextAll().remove();
                $($('#divQuitList' + value.Insurer.Insurer_ID).children('.UlClass').children('.LiClass').children('.addon-selected')).html("");
                $($('#divQuitList' + value.Insurer.Insurer_ID).children('.UlClass').children('.LiClass').children('.addon-selected')).hide();
                //Addon for Mobile
                $($('#divQuitList' + value.Insurer.Insurer_ID).children('.UlClass').children('.LiClass').children('.addon-selectedMobile')).html("");

                //addon label start
                var count = 0;
                //console.log("addon_checked", addon_checked, "value.Addon_List", value.Addon_List, "Addon_List", addon_list);
                $.each(addon_checked, function (i, v) {
                    //var addon_name = addon_list[v.id];    //18-02-2018
                    var addon_name = addon_shortlist[v.id];
                    var addon_Fullname = addon_list[v.id];
                    if (typeof value.Addon_List[v.id] !== 'undefined') {
                        count++;
                        var addon_premium = value.Addon_List[v.id];
                        addon_amount += addon_premium;

                        //addon_premium_breakup += addon_name + '-' + addon_premium + '+';//Commented By Pratik On 14-02-2018
                        addon_premium_breakup += addon_Fullname + '-' + addon_premium + '+';// Added By Pratik On 14-02-2018
                        //For Desktop
                        //coloured Addons
                        //$($('#divQuitList' + value.Insurer.Insurer_ID).children('.UlClass').children('.LiClass').children('.addon-selected')).append('<div style="margin-bottom: 2px;font-size: 11px;background-color: #0091c0;color:#fff; padding: 3px;border-radius:2px; /*text-align: center*/; float:left; padding-right: 0px; padding-left: 0px !important;margin-right: 3px;" class="col-xs-4 col-md-2 form-height" title="' + addon_Fullname + '"><div class="col-md-5" style"padding-left: 10px;">' + addon_name + '</div><div class="" style="padding-left: 0;"><span class="addonvalue">₹ ' + Math.round(addon_premium) + '</span ></div ></div > ');
                        $($('#divQuitList' + value.Insurer.Insurer_ID).children('.UlClass').children('.LiClass').children('.addon-selected')).append('<span class="BlockSections" title="' + addon_Fullname + '">' + addon_name + ' <span>₹ ' + Math.round(addon_premium) + '</span></span>');
                       
                        //Last Edited By Santosh Sir
                        //$($('#divQuitList' + value.Insurer.Insurer_ID).children('.UlClass').children('.LiClass').children('.addon-selected')).append('<div style="margin-bottom: 2px;font-size: 10px;background-color: #fff;color:#000; border:solid 1px #c0c0c0;padding: 0px;border-radius:2px; /*text-align: center*/; float:left; padding-right: 0px; padding-left: 0px !important;margin-right: 3px;" class="col-xs-4 col-md-2 form-height" title="' + addon_Fullname + '"><div style="color:#000; padding:5px;"><span>' + addon_name + '</span>&nbsp;<span><b>₹ ' + Math.round(addon_premium) + '</b></span ></div></div > ');

                        //For Mobile
                        $($('#divQuitList' + value.Insurer.Insurer_ID).children('.UlClass').children('.LiClass').children('.addon-selectedMobile')).append('<div style="font-size: 10px;font-weight: 600; float:left; padding-right: 0px; padding-left: 0px !important;" class="col-xs-6 col-md-2 form-height" title="' + addon_Fullname + '">' + addon_Fullname + ' <span style="color:#37bf08;float:right;padding-right: 5px;"><i class="fa fa-inr"></i>' + Math.round(addon_premium) + '</span></div>');
                    }
                    //else {
                    //    $($('#divQuitList' + value.Insurer.Insurer_ID).children('.UlClass').children('.LiClass').children('.boxLeft').children('.addon-selected')).append('<div><button class="btn btn-danger btn-xs btn-block waves-effect" type="button">' + addon_name + ' <span class="badge">NA</span></button></div>');
                    //}
                });

                //
                $("#DisplayAddons" + value.Insurer.Insurer_ID).html($("#Add-ons" + value.Insurer.Insurer_ID).html());
                $("#DisplayDiscount" + value.Insurer.Insurer_ID).removeClass('hidden');
                $("#DisplayCover" + value.Insurer.Insurer_ID).removeClass('hidden');
                
                //addon label end
                var total_liability_premium = value.Premium_Breakup.liability['tp_final_premium'] - 0;
                var net_premium = value.Premium_Breakup.net_premium + addon_amount;
                var service_tax = 2 * (Math.round(net_premium * 0.09) - 0);
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
                            if (addon_name == 'RoadSide Assistance') { flag_addon_rsa = true; addon_amount_rsa = value.Addon_List[v.id]; }
                        });
                    }
                    if (flag_addon_rsa) { net_premium_without_rsa = Math.round(net_premium_without_rsa) - addon_amount_rsa - 0; }
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

                //$('#divQuitList' + value.Insurer.Insurer_ID).children('.UlClass').children('.LiClass').children('.dynamic').children('.Premium').html(' Rs.' + rupee_format(final_premium) + ' <i style="font-size:14px">(1 year) </i>');
                $('#divQuitList' + value.Insurer.Insurer_ID).children('.UlClass').children('.LiClass').children('.dynamic').children('.btn-buy').children('.Premium').html('₹ ' + rupee_format(final_premium));// + ' <i style="font-size:14px">(1 year) </i>');
                $('#divQuitList' + value.Insurer.Insurer_ID).children('.UlClass').children('.LiClass').children('.dynamic').children('.btn-buy').children('.PremiumMobile').html('₹ ' + rupee_format(final_premium));

                $('#divQuitList' + value.Insurer.Insurer_ID).attr('premium', final_premium);
                $('#divQuitList' + value.Insurer.Insurer_ID).attr('applied_addon', count);
                $('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('netpayablepayablepremium', rupee_format(final_premium));
                $('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('servicetax', rupee_format(Math.round(service_tax)));
                $('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('addonpremium', Math.round(addon_amount));
                $('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('totalpremium', rupee_format(Math.round(net_premium)));
                $('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('addonname', addon_premium_breakup);

                //For Displaying Message For Discount Not Selected
                var TotalDiscountVal = 0;
                TotalDiscountVal = Math.round(value.Premium_Breakup.own_damage.od_disc_anti_theft) + Math.round(value.Premium_Breakup.own_damage.od_disc_vol_deduct);
                //$('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('totaldiscount', TotalDiscountVal);
                if (TotalDiscountVal == 0) {
                    $('#DisplayDiscount' + value.Insurer.Insurer_ID).html("No Discount Available");
                }

                //For Displaying Message For Cover Not Selected
                var TotalCover = 0;
                TotalCover = Math.round(($('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('electricalacessoriespremium')).replace(/,/g, '')) + Math.round(($('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('nonelectricalaccessoriespremium').replace(/,/g, '')));
                if (ProductIdVal == 10) {
                    if (TotalCover == 0) { $("#DisplayCover" + value.Insurer.Insurer_ID).html("No Cover Available"); }
                }
                if (ProductIdVal == 1) {
                    TotalCover +=
                                Math.round(($('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('legalliabilitypremiumforpaiddriver')).replace(/,/g, '')) +
                                Math.round(($('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('personalaccidentcoverforpaiddriver')).replace(/,/g, '')) +
                                Math.round(($('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('personalaccidentcoverforunammedpassenger')).replace(/,/g, '')) +
                                Math.round(($('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('personalaccidentcoverfornamedpassenger')).replace(/,/g, ''));
                    if (TotalCover == 0) { $("#DisplayCover" + value.Insurer.Insurer_ID).html("No Cover Available"); }
                }
                //$('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('totalCover', TotalCover);

                if (value.Insurer.Insurer_ID == 35) {
                    net_premium = net_premium - 195;
                    total_liability_premium = value.Premium_Breakup.liability['tp_final_premium'] - 195;
                }

                $('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('TotalLiabilityPremium', total_liability_premium);
                $('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('totalpremium', rupee_format(Math.round(net_premium)));

                if (addon_checked.length > 0) { $($('#divQuitList' + value.Insurer.Insurer_ID).children('.UlClass').children('.LiClass').children('.addon-selected')).show(); $(".trAddon").removeClass('hidden'); }
                else { $($('#divQuitList' + value.Insurer.Insurer_ID).children('.UlClass').children('.LiClass').children('.addon-selected')).hide(); $(".trAddon").addClass('hidden'); }
                if ($($('#divQuitList' + value.Insurer.Insurer_ID).children('.UlClass').children('.LiClass').children('.addon-selected')).html() == "") {
                    $($('#divQuitList' + value.Insurer.Insurer_ID).children('.UlClass').children('.LiClass').children('.addon-selected')).show().html("No Add-ons Selected").css({ "text-align": "center" }, { "color": "rgb(29, 40, 85)" }, { "padding-top": "30px" });
                    $("#DisplayAddons" + value.Insurer.Insurer_ID).show().html("No Add-ons Available");
                }
            }
        });

        if (addon_checked.length == 0) {
            $($('.UlClass').children('.LiClass').children('.addon-selected')).hide();
        }
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
        success: function (response) { },
        error: function (response) { }
    });
    //return true;
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
}

var search_summary;
var max_calling_times = 12;
var MaxCall = 11;
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
    'addon_losstime_protection_cover': 'Loss Time Protection',
    'addon_medical_expense_cover': 'Medical Expense',
    'addon_ncb_protection_cover': 'NCB Protection',
    'addon_passenger_assistance_cover': 'Passenger Assistance',
    'addon_personal_belonging_loss_cover': 'Personal Belonging Loss',
    'addon_road_assist_cover': 'RoadSide Assistance',
    'addon_rodent_bite_cover': 'Rodent Bite',
    'addon_tyre_coverage_cover': 'Tyre Coverage',
    'addon_rim_damage_cover':'Rim Damage Cover',
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
    'addon_rim_damage_cover':"RD",
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
    'addon_zero_dep_cover': 'Tllo-iqhgek',
    'addon_additional_pa_cover': 'Tllo-iqhgek'
};
var arr_insurer_breakin_support = [1, 2, 4, 5, 6, 9, 11, 12, 19, 30, 22, 35, 45];
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
    //Display_blocks();
    console.log(clientid);
    Get_Search_Summary(clientid);
    //Get_Saved_Data();
    if (location.href.indexOf("www") > 0) {
        //max_calling_times = 2;
        //long_wait = 1;
        max_calling_times = 4; long_wait = 0; MaxCall = 3;
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
    var insurer_display_list = insurer_list;
    if (location.href.indexOf("www") > 0) {
        insurer_display_list = insurer_list_live;
    }
    $.each(insurer_display_list, function (index, value) {
        var block = html_quote;
        block = block.replace("hidden", "");
        $.each(value, function (index1, value1) {
            var regex = new RegExp("___" + index1 + "___", "gi");
            block = block.replace(regex, value1);
        });
        block = block.replace("___client_id___", clientid);
        $(".quoteboxparent").append(block);
    });
}

function Display_Insurer_Block(insurer) {
        var block = html_quote;
        block = block.replace("hidden", "");
        $.each(insurer, function (index1, value1) {
            var regex = new RegExp("___" + index1 + "___", "gi");
            block = block.replace(regex, value1);
        });
        block = block.replace("___client_id___", clientid);
        $(".quoteboxparent").append(block);
}

function Get_Search_Summary(clientid) {
    $.ajax({
        url: "Get_Search_Summary?SID=" + SRN + "&ClientID=" + clientid,
        type: 'GET',
        contentType: 'application/json;',
        dataType: "json",
        success: function (response) {
            //$("#LoaderImg").fadeIn();
            console.log(response);
            var vehicle = response.Master.Vehicle;
            var request = response.Request;
            original_request = request;
            search_summary = response;
            var rto = response.Master.Rto;
                       
            ProductIdVal = request.product_id;
            if (request.first_name != null) { Name = request.first_name; } else { Name = "Customer"; }
            if (request.email != null) { EmailVal = request.email; }

            NEA = request.non_electrical_accessory;
            EA = request.electrical_accessory;
            EBV = request.external_bifuel_value;

            SSID = request.ss_id;
            //SSID = 1; //_Premium
            if (SSID > 0) { $("#SendPolicyDetails").show(); }

            //console.log(search_summary.Summary);
            $('.twoWheelerImageHeader').append(' ' + response.Summary.PB_CRN);
            crn = response.Summary.PB_CRN == null ? 0 : response.Summary.PB_CRN;
            //$('#ContactName').text(response.Request.first_name);
            Name = request.first_name;
            $('#CustomerReferenceID').val(crn);
            $(".CRN").val(crn).text(crn);
            $('#Variant').text(vehicle.Make_Name + " " + vehicle.Model_Name + " " + vehicle.Variant_Name);
            $('#Variant1').text(vehicle.Make_Name + " " + vehicle.Model_Name + " " + vehicle.Variant_Name);
            $('#RTOName').text(response.Master.Rto.RTO_City);
            ;
            //PeronalAccidentCoverforDriver //Legal Liability to Paid Driver
            if (request.is_llpd == "no") { $("#PeronalAccidentCoverforDriver").text("No").val("No"); $("#PD1").attr('checked', true); $("#PeronalAccidentCoverforDriver").attr("checked", false); }
            if (request.is_llpd == "yes") { $("#PeronalAccidentCoverforDriver").text("Yes").val("Yes"); $("#PD2").attr('checked', true); $("#PeronalAccidentCoverforDriver").attr("checked", true); }

            //PaidDriverPersonalAccidentCover
            if (request.pa_paid_driver_si == "0") { $("#PaidDriverPersonalAccidentCover").text("No").val("No"); $("#PDPersonal1").attr('checked', true); $("#PaidDriverPersonalAccidentCover").attr("checked", false); }
            if (request.pa_paid_driver_si == "100000") { $("#PaidDriverPersonalAccidentCover").text("Yes").val("Yes"); $("#PDPersonal2").attr('checked', true); $("#PaidDriverPersonalAccidentCover").attr("checked", true); }

            // IsAntiTheftDevice
            if (request.is_antitheft_fit == "no") { $("#IsAntiTheftDevice").text("No").val("No"); $("#AntiTD1").attr('checked', true); $("#IsAntiTheftDevice").attr("checked", false); }
            if (request.is_antitheft_fit == "yes") { $("#IsAntiTheftDevice").text("Yes").val("Yes"); $("#AntiTD2").attr('checked', true); $("#IsAntiTheftDevice").attr("checked", true); }

            //MemberofAA
            if (request.is_aai_member == "no") { $("#MemberofAA").text("No").val("No"); $("#Association1").attr('checked', true); $("#MemberofAA").attr("checked", false); }
            if (request.is_aai_member == "yes") { $("#MemberofAA").text("Yes").val("Yes"); $("#Association2").attr('checked', true); $("#MemberofAA").attr("checked", true); }

            $('#VoluntaryDeduction').val(request.voluntary_deductible > 0 ? request.voluntary_deductible : 0);
            $('#VoluntaryDeduction').text(request.voluntary_deductible > 0 ? request.voluntary_deductible : 0);
            if (request.voluntary_deductible > 0) { CheckVoluntary(request.voluntary_deductible); }
            else { CheckVoluntary(0); }

            if (request.product_id == 1) {
                switch (request.voluntary_deductible) {
                    case 0: $('#Voluntry1').attr('checked', true); break;
                    case 2500: $('#Voluntry2').attr('checked', true); break;
                    case 5000: $('#Voluntry3').attr('checked', true); break;
                    case 7500: $('#Voluntry4').attr('checked', true); break;
                    case 15000: $('#Voluntry5').attr('checked', true); break;
                }
            }
            if (request.product_id == 10) {
                switch (request.voluntary_deductible) {
                    case 0: $('#Voluntry1').attr('checked', true); break;
                    case 500: $('#Voluntry2').attr('checked', true); break;
                    case 750: $('#Voluntry3').attr('checked', true); break;
                    case 1000: $('#Voluntry4').attr('checked', true); break;
                    case 1500: $('#Voluntry5').attr('checked', true); break;
                    case 3000: $('#Voluntry6').attr('checked', true); break;
                }
            }

            $('#PersonalCoverPassenger').val(request.pa_unnamed_passenger_si > 0 ? request.pa_unnamed_passenger_si : 0);
            $('#PersonalCoverPassenger').text(request.pa_unnamed_passenger_si > 0 ? request.pa_unnamed_passenger_si : 0);
            if (request.pa_unnamed_passenger_si > 0) { CheckUnnamedPassenger(request.pa_unnamed_passenger_si); }
            else { CheckUnnamedPassenger(0); }
            switch (request.pa_unnamed_passenger_si) {
                case 0: $('#Un-Named1').attr('checked', true); break;
                case 50000: $('#Un-Named2').attr('checked', true); break;
                case 100000: $('#Un-Named3').attr('checked', true); break;
                case 150000: $('#Un-Named4').attr('checked', true); break;
                case 200000: $('#Un-Named5').attr('checked', true); break;
            }

            $('#NamedPersonalAccidentCover').val(request.pa_named_passenger_si > 0 ? request.pa_named_passenger_si : 0);
            $('#NamedPersonalAccidentCover').text(request.pa_named_passenger_si > 0 ? request.pa_named_passenger_si : 0);
            if (request.pa_named_passenger_si > 0) { CheckNamedPassenger(request.pa_named_passenger_si); }
            else { CheckNamedPassenger(0); }
            switch (request.pa_named_passenger_si) {
                case 0: $('#Named1').attr('checked', true); break;
                case 50000: $('#Named2').attr('checked', true); break;
                case 100000: $('#Named3').attr('checked', true); break;
                case 150000: $('#Named4').attr('checked', true); break;
                case 200000: $('#Named5').attr('checked', true); break;
            }

            $('#ElectricalAccessories').val(request.electrical_accessory);
            $('#NonElectricalAccessories').val(request.non_electrical_accessory);
            $('#spinner').css("visibility", "visible");
            //For checking Cover Selected Or Not
            if (request.is_llpd == "yes" || request.pa_paid_driver_si > 0 || request.pa_named_passenger_si > 0 || request.pa_unnamed_passenger_si > 0 ||
                 request.electrical_accessory != 0 || request.non_electrical_accessory != 0) {
                CoverCount = 1;
                //$(".trCover").removeClass('hidden');
            }
            //For checking Discount Selected Or Not
            if (request.is_antitheft_fit == "yes" || request.is_aai_member == "yes" || request.voluntary_deductible > 0) {
                DiscountCount = 1;
                //$(".trdiscount").removeClass('hidden');
            }

            //$('#expected_idv').val(request.vehicle_expected_idv);
            console.log("-------------Type: " + request.vehicle_insurance_type + " Product ID: " + request.product_id + "-------------");
            if (request.vehicle_insurance_type == "renew") {
                $('.idv_range').removeClass('hidden');
                $('.idv_slider').removeClass('hidden');
            }
            //if (request.vehicle_insurance_type == "new" && request.product_id == 10) {
            //    $("#ExpectedIDV").attr("readonly", true);
            //}
            $('#expected_idv').attr("value", request.vehicle_expected_idv);
            $('#expected_idv').prev().text(request.vehicle_expected_idv);
            $('#expected_idv').prev().val(request.vehicle_expected_idv);
            $('#ExpectedIDV').val(request.vehicle_expected_idv);
            $('#ExpectedIDVVal').text("(" + request.vehicle_expected_idv + ")");
            if (request.registration_no != "") {
                RegNo = request.registration_no.split("-");
                if ((RegNo[2] + "-" + RegNo[3] != "AA-1234") && (RegNo[2] + "-" + RegNo[3] != "ZZ-9999")) {
                    RegNo = RegNo[0] + RegNo[1] + RegNo[2] + RegNo[3];
                    $("#RegistrationNo").text(RegNo);
                    $("#divRegistrationNoDetails").show();
                    $("#RegistrationNoDetails").text(RegNo);
                }
                else { $("#RegistrationNo").text(RegNo[0] + "-" + RegNo[1]); $("#divRegistrationNoDetails").hide(); }
            }

            if (response.hasOwnProperty('Insurer_Details') && response.Insurer_Details != null) { Populate_Keybenefits(response.Insurer_Details); }
            Get_Saved_Data();

            var Hrefval = "";
            if (vehicle.Product_Id_New == 1) { Hrefval = "/car-insurance?SID=" + search_summary.Summary.Request_Unique_Id + "&ClientID=" + search_summary.Summary.Client_Id; }
            else if (vehicle.Product_Id_New == 10) { Hrefval = "/twowheeler-insurance?SID=" + search_summary.Summary.Request_Unique_Id + "&ClientID=" + search_summary.Summary.Client_Id; }
            //if (vehicle.Product_Id_New == 1) { Hrefval = "/car-insurance-gamma?SID=" + search_summary.Summary.Request_Unique_Id + "&ClientID=" + search_summary.Summary.Client_Id; }
            //else if (vehicle.Product_Id_New == 10) { Hrefval = "/twowheeler-insurance-gamma?SID=" + search_summary.Summary.Request_Unique_Id + "&ClientID=" + search_summary.Summary.Client_Id; }
            $("#EditInfo").attr("href", Hrefval);
            $("#VehicleNameDetails").text(vehicle.Description + " (" + vehicle.Vehicle_ID + ")");
            $("#FuelNameDetails").text(vehicle.Fuel_Name);
            if (request.external_bifuel_type == "cng" ) {
                $("#FuelNameDetails").text(vehicle.Fuel_Name + "(" + "EXTERNAL FITTED CNG" + ")");
            }
            if (request.external_bifuel_type == "lpg") {
                $("#FuelNameDetails").text(vehicle.Fuel_Name + "(" + "EXTERNAL FITTED LPG" + ")");
            }

            if (request.external_bifuel_value > 0) { $("#ExternalBifuelVal").html(request.external_bifuel_value); }
            else { $("#divExternalBifuelVal").hide(); }

            $("#RTODetails").text(rto.RTO_City + ", " + rto.State_Name + " (" + response.Master.Rto.VehicleCity_Id + ")");
            var Name = "";
            if (request.first_name != "" && checkTextWithSpace(request.first_name)) {
                Name = request.first_name + " ";
                if (request.middle_name != "" && checkTextWithSpace(request.middle_name)) {
                    Name = Name + request.middle_name + " ";
                }
                if (request.last_name != "" && checkTextWithSpace(request.last_name)) {
                    Name = Name + request.last_name;
                }
            }
            else { $("#divNameDetails").hide(); }
            $("#NameDetails").text(Name);
            if (request.mobile != "" && request.mobile != null) {
                $("#MobileDetails").text(request.mobile);
                if (request.mobile == "9999999999") {
                    $("#MobileDetails").text("NA");
                }
            } else { $("#divMobileDetails").hide(); }
            if (request.email != "" && request.email != null) {
                $("#EmailDetails").text(request.email);
                if ((request.email).indexOf('@testpb.com') > 1) {
                    $("#EmailDetails").text("NA");
                }
            } else { $("#divEmailDetails").hide(); }
           
            if (request.vehicle_insurance_type == "new") { $("#RegistrationTypeDetails").text("New"); }
            else { $("#RegistrationTypeDetails").text("Renew"); }
            //For TP Plan Implementation
            VehInsSubType = request.vehicle_insurance_subtype;
            $("#VehicleInsuranceSubtype").val(VehInsSubType);
            console.log("VehInsSubType: ", VehInsSubType);

            $("#RegistrationSubTypeDetails").html(ShowVehInsSubType(VehInsSubType));

            if (request.vehicle_registration_date != "" || request.vehicle_registration_date != null ) { $("#RegistrationDate").html(request.vehicle_registration_date); }
            else { $("#divRegistrationDate").hide(); }

            if (request.vehicle_manf_date != "" || request.vehicle_manf_date != null) { $("#ManufactureDate").html(request.vehicle_manf_date); }
            else { $("#divManufactureDate").hide(); }

            if (request.policy_expiry_date != "" && request.policy_expiry_date != null) { $("#PolicyExpiryDate").html(request.policy_expiry_date); }
            else { $("#divPolicyExpiryDate").hide(); }

            if ((request.vehicle_ncb_current != "" || request.vehicle_ncb_current != null) && request.vehicle_ncb_current != 0) { $("#PrevNCB").html(request.vehicle_ncb_current + "%"); }
            else { $("#divPrevNCB").hide(); }

            if (request.is_claim_exists != "no") { $("#ClaimYesNo").html("Yes"); $("#divPrevNCB").hide(); }
            if (request.is_claim_exists != "yes") { $("#ClaimYesNo").html("No"); $("#divPrevNCB").show(); }

            if (request.vehicle_registration_type == "corporate") { $("#VehicleInsType").html("Company"); }
            else { $("#VehicleInsType").html("Individual"); }

            var PrevInsName = GetPrevIns(request.prev_insurer_id);
            if (request.prev_insurer_id != "" && request.prev_insurer_id != null) { $("#PrevInsurer").html(PrevInsName); }
            else { $("#divPrevInsurer").hide(); }
            
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
        else { //console.log("Quotes no available for selected Criteria");
        }
    });
}
function response_handler() {
    console.log('premium_db_list', quotes);
    if (quotes.Summary.Status == "complete") {
        append_quotes(); //delete_block(); 
        hide_spinner();
        $("#LoaderImg").fadeOut();
    }
    else {
        var dateString = quotes.Summary.Created_On;
        var date = new Date(dateString);
        var today = new Date();
        var diff = (today.getTime() - date.getTime());
        if (diff > 30000) {
            append_quotes();
            //delete_block();
            hide_spinner();
            $("#LoaderImg").fadeOut();
        }
        else {
            max_calling_times--;
            console.log(max_calling_times, MaxCall);
            if (MaxCall == max_calling_times) {
                hide_spinner();
                console.log('MaxCall');
                //$("#LoaderImg").fadeOut();
            }
            append_quotes();
            if (max_calling_times > long_wait) {
                console.log("calling again" + max_calling_times);
                setTimeout(function () {
                    Get_Saved_Data();
                }, 3000);
            }
            else if (max_calling_times != 0) {
                console.log("calling again" + max_calling_times);
                
                setTimeout(function () {
                    Get_Saved_Data();
                }, 10000);
            }
            else {
                $("#LoaderImg").fadeOut();
            }
            if (max_calling_times == long_wait) {
                hide_spinner();
                //$("#LoaderImg").fadeOut();
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
    for (var i = 0; i < quotes.Response.length ; i++) {
        
        var current_div = $('#divQuitList' + quotes.Response[i].Insurer.Insurer_ID);

        if (['LM003', 'LM004', 'LM005', 'LM006'].indexOf(quotes.Response[i].Error_Code) > -1) { current_div.remove(); continue; }

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
            if (index.indexOf('Premium_Breakup') > -1 || index.indexOf('_idv') > -1) { value = rupee_format(Math.round(value - 0)); }
            if (value != null) { //if (value != null && typeof quote !== 'undefined') {//
                var regex = new RegExp(index, "gi");
                quote = quote.replace(regex, value);
            }
        });

        // hide preloader and display premium
        current_div.empty();
        current_div.append(quote);
        current_div.children('.UlClass').children('.LiClass').children('.dynamic').removeClass('hidden');
        if (!current_div.children('.UlClass').children('.LiClass').children('.preloader').hasClass('hidden'))
            current_div.children('.UlClass').children('.LiClass').children('.preloader').addClass('hidden');

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
        $('#ExpectedIDVMin').html(request.Idv_Min).val(request.Idv_Min);
        $('#ExpectedIDVMax').html(request.Idv_Max).val(request.Idv_Min);
        
    }

    if (insurer_count > 0) {
        //Addon filter
        var common_addon_list = quotes.Summary.Common_Addon;
        $('#Addons').empty();
        if (Object.keys(quotes.Summary.Common_Addon).length > 0) { // Checking Whether Addons Present Or Not (with Count)
            var AddOnCount = 0;
            //populate common addon
            $.each(common_addon_list, function (index, value) {
                addon = html_addon;
                addon = addon.replace(new RegExp('___Common_Addon___', 'gi'), index);
                //addon = addon.replace('___Common_Addon_Name___', addon_list[index]);//12-02-2018
                addon = addon.replace('___Common_Addon_Name___', addon_list[index] + '(' + addon_shortlist[index] + ')');
                if (value.min == value.max) { addon = addon.replace('___addon_range___', 'Upto &#8377; ' + Math.round(value.min)); }
                else { addon = addon.replace('___addon_range___', '&#8377; ' + Math.round(value.min) + ' - &#8377; ' + Math.round(value.max)); }
                AddOnCount++;

                $('#Addons').append(addon);
                if (AddOnCount < 2) { $("#selectall").hide(); }
                else { $("#selectall").show(); $(".chkAddons").show(); }
            });
            $("#Addons").removeClass('hidden');
        }
        else {
            $(".chkAddons").hide();
            $('#Addons').html("No Addons Available").css({ "text-align": "center" }, { "color": "#1d2955" }, { "font-family": "unset" });
        }

        console.log("Addons:" + Object.keys(quotes.Summary.Common_Addon).length);
        //if (Object.keys(quotes.Summary.Common_Addon).length <= 0) {
        //    $('#Addons').html("No Addons Available").css("text-align", "center");
        //}

        // check unckeck based on previous search
        $.each(search_summary.Addon_Request, function (index, value) {
            console.log(index, value);
            if (value == "yes")
                $('#' + index).click();
        });
        handle_addon_addition();

        var divQts = $('.quoteboxmain').pbsort(true, "Premium");
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
        //$("#IDVSection").text("Not Applicable");
        SetValues();
        if (CoverCount == 1) { $(".trCover").removeClass('hidden'); }
        else { $(".trCover").addClass('hidden'); }
        if (DiscountCount == 1) { $(".trDiscount").removeClass('hidden'); }
        else { $(".trDiscount").addClass('hidden'); }
    }
}

function append_quotes() {

    // for loop to add premiums through jquery...finally hahaha....i know
    var insurer_count = 0;
    if (crn <= 0) {
        $('.twoWheelerImageHeader').append(' ' + quotes.Summary.PB_CRN);
        crn = quotes.Summary.PB_CRN;
        $('#CustomerReferenceID').val(crn);
    }
    $(".quoteboxparent").empty();
    for (var i = 0; i < quotes.Response.length ; i++) {
        
        if (['LM003', 'LM004', 'LM005', 'LM006'].indexOf(quotes.Response[i].Error_Code) == -1)
        {
            Display_Insurer_Block(quotes.Response[i].Insurer);
            //current_div.remove();
        }
        else {
            continue;
        }

        insurer_count++;
        var current_div = $('#divQuitList' + quotes.Response[i].Insurer.Insurer_ID);
        var quote = current_div.html();
        //current_div.parent().prepend(current_div);
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
            if (index.indexOf('Premium_Breakup') > -1 || index.indexOf('_idv') > -1) { value = rupee_format(Math.round(value - 0)); }
            if (value != null) { //if (value != null && typeof quote !== 'undefined') {//
                var regex = new RegExp(index, "gi");
                quote = quote.replace(regex, value);
            }
        });

        // hide preloader and display premium
        current_div.empty();
        current_div.append(quote);
        current_div.children('.UlClass').children('.LiClass').children('.dynamic').removeClass('hidden');
        if (!current_div.children('.UlClass').children('.LiClass').children('.preloader').hasClass('hidden'))
            current_div.children('.UlClass').children('.LiClass').children('.preloader').addClass('hidden');

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
        $('#ExpectedIDVMin').html(request.Idv_Min).val(request.Idv_Min);
        $('#ExpectedIDVMax').html(request.Idv_Max).val(request.Idv_Min);
        //$("#LoaderImg").fadeOut('slow');
    }
    console.log("Insurer Count : ", insurer_count);
    if (insurer_count > 0) {
        //Addon filter
        var common_addon_list = quotes.Summary.Common_Addon;
        $('#Addons').empty();
        if (Object.keys(quotes.Summary.Common_Addon).length > 0) { // Checking Whether Addons Present Or Not (with Count)
            var AddOnCount = 0;
            //populate common addon
            $.each(common_addon_list, function (index, value) {
                addon = html_addon;
                addon = addon.replace(new RegExp('___Common_Addon___', 'gi'), index);
                //addon = addon.replace('___Common_Addon_Name___', addon_list[index]);//12-02-2018
                addon = addon.replace('___Common_Addon_Name___', addon_list[index] + '(' + addon_shortlist[index] + ')');
                if (value.min == value.max) { addon = addon.replace('___addon_range___', 'Upto &#8377; ' + Math.round(value.min)); }
                else { addon = addon.replace('___addon_range___', '&#8377; ' + Math.round(value.min) + ' - &#8377; ' + Math.round(value.max)); }
                AddOnCount++;

                $('#Addons').append(addon);
                if (AddOnCount < 2) { $("#selectall").hide(); }
                else { $("#selectall").show(); $(".chkAddons").show(); }
            });
            $("#Addons").removeClass('hidden');
        }
        else {
            $(".chkAddons").hide();
            $('#Addons').html("No Addons Available").css({ "text-align": "center" }, { "color": "#1d2955" }, { "font-family": "unset" });
        }

        console.log("Addons:" + Object.keys(quotes.Summary.Common_Addon).length);
        //if (Object.keys(quotes.Summary.Common_Addon).length <= 0) {
        //    $('#Addons').html("No Addons Available").css("text-align", "center");
        //}

        // check unckeck based on previous search
        $.each(search_summary.Addon_Request, function (index, value) {
            console.log(index, value);
            if (value == "yes")
                $('#' + index).click();
        });
        handle_addon_addition();

        var divQts = $('.quoteboxmain').pbsort(true, "Premium");
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
        
        SetValues();
        if (CoverCount == 1) { $(".trCover").removeClass('hidden'); }
        else { $(".trCover").addClass('hidden'); }
        if (DiscountCount == 1) { $(".trDiscount").removeClass('hidden'); }
        else { $(".trDiscount").addClass('hidden'); }
    }
    if (VehInsSubType != null) {
        var VIST = VehInsSubType.split('CH_');
        if (VIST[0] == 0) {
            $("#IDVSection").text("Not Applicable");
            $(".IDVRange").html("");
            $(".IDVDisplay").html("IDV : Not Applicable");
            $("#divClaimYesNo, .divAccessories, .divAddon, .divIDV, .divDiscount, #liidvedit, #lidiscountedit").hide();
            $(".divCoverMob").addClass('col-xs-12').removeClass('col-xs-6');
            $(".divAddon").attr('data-toggle', false);
            $(".divIDV").attr('data-toggle', false);
            $(".divDiscount").attr('data-toggle', false);
            if (ProductIdVal == 10) { $(".divCover").hide(); }
            
            $("#liidvedit").attr('data-target', false);
            $("#lidiscountedit").attr('data-target', false);
            $("#TotalODPremium").text("N.A.");
        }
    }    
}

function delete_block() {
    var insurer_display_list = insurer_list;
    if (location.href.indexOf("www") > 0) { insurer_display_list = insurer_list_live; }
    for (var i = 0; i < insurer_display_list.length; i++) {
        var div = $('#divQuitList' + insurer_display_list[i].Insurer_ID);
        if (div.children('.UlClass').children('.LiClass').children('.dynamic').hasClass('hidden')) { div.remove(); }
    }   
}

function hide_spinner() {
    $("#QuoteLoader").css('display', 'none');
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
        if (this.value < $(this).next().attr("min")) {
            this.value = 0;
        }
        else if (this.value > $(this).next().attr("max")) {
            this.value = $(this).next().attr("max");
        }
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
        if ($(this).children('.UlClass').children('.LiClass').children('.preloader').hasClass('hidden')) {
            var ind_prem = $(this).attr('premium') - 0;
            if (!(isNaN(ind_prem))) { arr_prem.push(ind_prem); }
        }
    });
    $('.premium_min').html(Math.min.apply(null, arr_prem) == NaN ? 0 : Math.min.apply(null, arr_prem));
    $('.premium_max').html(Math.max.apply(null, arr_prem) == NaN ? 0 : Math.max.apply(null, arr_prem));
    //console.log(arr_prem, 'Min', Math.min.apply(null, arr_prem), 'Max', Math.max.apply(null, arr_prem));
}

function addRequestResponse(current_div, quote) {
    console.log(quote);
    var uatReview_list = [1, 10, 11, 30, 35];
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

var PremiumArray = ['sBasicOwnDamage', 'ODDiscount', 'BiFuelKitPremium', 'AutomobileAssociationMembershipPremium', 'UnderwriterLoading',
    'NonElectricalAccessoriesPremiumNEA', 'ElectricalAcessoriesPremium', 'AntiTheftDiscount', 'PersonalAccidentCoverForNamedPassenger',
    'PersonalAccidentCoverForPaidDriver', 'VoluntaryDeductions', 'NoClaimBonus', 'TotalLiabilityPremium', 'ThirdPartyLiablityPremium',
    'PersonalAccidentCoverForOwnerDriver', 'LegalLiabilityPremiumForPaidDriver', 'PersonalAccidentCoverForUnammedPassenger', 'BiFuelKitLiabilityPremium', 'AddOnPremium']
function PremiumDetailsValues() {
    for (var i = 0; i < PremiumArray.length; i++) {
        if ($("#" + PremiumArray[i]).text() == "0" || $("#" + PremiumArray[i]).text() == "") { $("#" + PremiumArray[i]).parent().hide(); }
        else { $("#" + PremiumArray[i]).parent().show(); }
    }
}
function PremiumPopupDetailsValues() {
    for (var i = 0; i < PremiumArray.length; i++) {
        if ($("." + PremiumArray[i]).text() == "0" || $("." + PremiumArray[i]).text() == "") { $("." + PremiumArray[i]).parent().parent().remove(); }
        else { $("." + PremiumArray[i]).parent().parent().show(); }
    }
}
function CheckPeronalAccidentCoverforDriver(value) {
    if (value == "0") { $("#PeronalAccidentCoverforDriver").html("No"); }
    else { $("#PeronalAccidentCoverforDriver").html(value); }
    $("#PeronalAccidentCoverforDriver").val(value);
}
function CheckPaidDriverPersonalAccidentCover(value) {
    if (value == "0") { $("#PaidDriverPersonalAccidentCover").html("No"); }
    else { $("#PaidDriverPersonalAccidentCover").html(value); }
    $("#PaidDriverPersonalAccidentCover").val(value);
}
function CheckUnnamedPassenger(value) {
    if (value == "0") { $("#PersonalCoverPassenger").html("No"); }
    else { $("#PersonalCoverPassenger").html(value); }
    $("#PersonalCoverPassenger").val(value);
}
function CheckNamedPassenger(value) {
    if (value == "0") { $("#NamedPersonalAccidentCover").html("No"); }
    else { $("#NamedPersonalAccidentCover").html(value); }
    $("#NamedPersonalAccidentCover").val(value);
}
function CheckAntitheft(value) {
    if (value == "0") { $("#IsAntiTheftDevice").html("No"); }
    else { $("#IsAntiTheftDevice").html(value); }
    $("#IsAntiTheftDevice").val(value);
}
function CheckMobileAssociation(value) {
    if (value == "0") { $("#MemberofAA").html("No"); }
    else { $("#MemberofAA").html(value); }
    $("#MemberofAA").val(value);
}
function CheckVoluntary(value) {
    if (value == "0") { $("#VoluntaryDeduction").html("No"); }
    else { $("#VoluntaryDeduction").html(value); }
    $("#VoluntaryDeduction").val(value);
}
function CheckSort(filter1, filter2)
{
    //ascending = $("#dllSotBy").val().includes("low-high");
    //parameter = $("#dllSotBy").val().includes("1") ? "premium" : ($("#dllSotBy").val().includes("2") ? "idv" : "fair_price")// $("#dllSotBy").val().includes("1") ? "premium" : "idv"
    var ascending = (filter1 == "low-high") ? true : false;
    var parameter = (filter2 == "1") ? "premium" : (filter2 == "2") ? "idv" : "fair_price";
    var divQts = $('.quoteboxmain').pbsort(ascending, parameter);
    $('.quoteboxparent').html(divQts);
    console.log("Sorting:" + ascending + "_" + parameter);
}

$('#ExpectedIDV').keypress(function () { return this.value.length < 7; });
//$('.Accessories').keypress(function () { return this.value.length < 6; });
$('.Accessories').keyup(function () {
    this.value = this.value.replace(/[^0-9\.]/g, '');
});
$('.Accessories').focusout(function () { EleNonEle($(this).attr('id')); });
function EleNonEle(Id) {
    var Eleval = parseInt($('#' + Id).val());
    $('#' + Id).val(Eleval);
    if (isNaN(Eleval) == true) {
        $('#' + Id).val(0);
    }
    var ErrorId = "Error" + Id;
    var pattern = /^[0-9]*$/;

    $('#' + ErrorId).remove();
    if (Eleval != 0 || Eleval == "") {
        if (ProductIdVal == 10) {
            if (Eleval < 5000 || Eleval > 50000 || pattern.test(Eleval) == false || Eleval == "") {
                $('#spn' + Id).addClass('ErrorMsg');
                $('#' + Id).addClass('errorClass1');
            }
            else { $('#spn' + Id).removeClass('ErrorMsg'); $('#' + Id).removeClass('errorClass1'); }
        }
        else {
            if (Eleval < 10000 || Eleval > 50000 || pattern.test(Eleval) == false  || Eleval == "") {
                $('#spn' + Id).addClass('ErrorMsg');
                $('#' + Id).addClass('errorClass1');
            }
            else { $('#spn' + Id).removeClass('ErrorMsg'); $('#' + Id).removeClass('errorClass1'); }
        }
    }  
}

$('#ExpectedIDV').focusout(function () {
    if (parseInt($("#ExpectedIDV").val()) != 0) {
        if (parseInt($("#ExpectedIDV").val()) < parseInt($('#expected_idv').attr("min")) || parseInt($("#ExpectedIDV").val()) > parseInt($('#expected_idv').attr("max")))
        { $("#ExpectedIDV").addClass('errorClass1'); $(".spnExpectedIDV").addClass('ErrorMsg'); }
        else { $("#ExpectedIDV").removeClass('errorClass1'); $(".spnExpectedIDV").removeClass('ErrorMsg'); }
    }
    else { $("#ExpectedIDV").removeClass('errorClass1'); $(".spnExpectedIDV").removeClass('ErrorMsg'); }
});

//For Select All Addon For Desktop
//$("#Addons .chk-col-indigo").click();
//$('#Addons').find('input[type=checkbox]').attr('checked', true).click(); // Select All
//$('#Addons').find('input[type=checkbox]').attr('checked', false); //Unselect All

$(document).on('click', '#SelectAllAddons', function () {
    $('#Addons').find('input[type=checkbox]').click();
    if ($(this).is(':checked') == true) { $('#Addons').find('input[type=checkbox]').prop('checked', true); }
    else { $('#Addons').find('input[type=checkbox]').prop('checked', false); }
});

function SetValues() {
    $('.SpnCD').each(function () {
        if ($(this).text() == 0) { $(this).parent().empty().remove(); }//$(this).parent().addClass('hidden'); }
    });
}

$(document).on('click', '#btnSendPolicyDetails', function (e) {
    PremiumPopupDetailsValues();
    //var ContentBody = ("<html><head></head><body>"+$("#ContentPolicyDetails").html()+"</body></html>").trim("");
    var pattern = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$');
    var Emailidval = $("#EmailID").val();
    //var index = quotes.Response.findIndex(x=>x.Insurer_Id == SelectedInsId);

    //var addon_checked = $('#Addons').find('input[type=checkbox]:checked');
    //var Checked_addon = {};
    //if (addon_checked.length > 0) { $.each(addon_checked, function (i, value) { Checked_addon[value.id] = "yes"; }); }

    if (Emailidval != "" && Emailidval != null && pattern.test(Emailidval) == true) { 
        var obj = {
            ContactEmail: Emailidval,
            //MailContent: ContentBody,
            Name: $(".Name").text(),
            CRN: crn,
            Insurer_Id: SelectedInsId,
            InsurerNameTitle: $("#InsurerNameTitle").text(),
            IDV: $("#IDV").text(),

            //owndamage_
            owndamage_Basic_Own_Damage: $("#sBasicOwnDamage").text(), //Basic Own Damage// _sBasicOwnDamage
            owndamage_Own_Damage_Discount: $("#ODDiscount").text(), //Own Damage Discount //ODDiscount
            owndamage_Non_Electrical_Accessories: $("#NonElectricalAccessoriesPremiumNEA").text(), //Non Electrical Accessories //NonElectricalAccessoriesPremiumNEA
            owndamage_Electrical_Acessories: $("#ElectricalAcessoriesPremium").text(), //Electrical Acessories //ElectricalAcessoriesPremium
            owndamage_Bi_Fuel_Kit: $("#BiFuelKitPremium").text(), // Bi Fuel Kit //BiFuelKitPremium
            owndamage_Anti_Theft_Discount: $("#AntiTheftDiscount").text(), // Anti Theft Discount //AntiTheftDiscount
            owndamage_Voluntary_Discount: $("#VoluntaryDeductions").text(), //Voluntary Discount //VoluntaryDeductions
            owndamage_Automobile_Association_Membership: $("#AutomobileAssociationMembershipPremium").text(),  //Automobile Association Membership //AutomobileAssociationMembershipPremium
            owndamage_No_Claim_Bonus: $("#NoClaimBonus").text(), //No Claim Bonus  //NoClaimBonus
            owndamage_Underwriter_Loading: $("#UnderwriterLoading").text(), //Underwriter Loading //UnderwriterLoading
            TotalODPremium: $("#TotalODPremium").text(), //Total OD Premium

            //liability libprem_
            libprem_Basic_3rd_Party_Premium: $("#ThirdPartyLiablityPremium").text(), //Basic 3rd Party Premium //ThirdPartyLiablityPremium
            libprem_PA_Owner_Driver: $("#PersonalAccidentCoverForOwnerDriver").text(), //PA Owner Driver //PersonalAccidentCoverForOwnerDriver
            libprem_PA_for_Unnamed_Passenger: $("#PersonalAccidentCoverForUnammedPassenger").text(), //PA for Unnamed Passenger //PersonalAccidentCoverForUnammedPassenger
            libprem_Named_Personal_Accident_Cover_for_Passenger: $("#PersonalAccidentCoverForNamedPassenger").text(), //Named Personal Accident Cover for Passenger //PersonalAccidentCoverForNamedPassenger
            libprem_PA_Cover_For_Paid_Driver: $("#PersonalAccidentCoverForPaidDriver").text(), //PA Cover For Paid Driver //PersonalAccidentCoverForPaidDriver
            libprem_Legal_Liability_To_Paid_Driver: $("#LegalLiabilityPremiumForPaidDriver").text(), //Legal Liability To Paid Driver //LegalLiabilityPremiumForPaidDriver
            libprem_Bi_Fuel_Kit_Liability: $("#BiFuelKitLiabilityPremium").text(), //Bi Fuel Kit Liability //BiFuelKitLiabilityPremium
            TotalLiabilityPremium: $("#TotalLiabilityPremium").text(), //Third Party Premium

            TotalPremium: $("#TotalPremium").text(),
            ServiceTax : $("#ServiceTax").text(),
            NetPayablePayablePremium: $("#NetPayablePayablePremium").text(),
            addonfinal: $("#AddOnPremium").text() == "0" ? "0" : $("#AddOnPremium").text(),
            ElectricalAccessory: EA,
            NonElectricalAccessory: NEA,
            ExternalBifuelValue: EBV,
            //Premium_Breakup: quotes.Response[index].Premium_Breakup,
            //Addon_List: quotes.Response[index].Addon_List,
            //Checked_AddonList : Checked_addon
        };
        for (var key in SelectedAddonList) {
        obj['addon_' + SelectedAddonList[key]['n'].toString().replace(/ +/g, "")] = SelectedAddonList[key]['v'];
        }
        console.log(JSON.stringify({ request_json: obj }));
        $.ajax({
            url: "/CarInsuranceIndia/Premium_Details",
            // url: "/CarInsuranceIndia/SendPremiumDetails",
            type: 'POST',
            data: JSON.stringify({ request_json: JSON.stringify(obj) }),
            contentType: 'application/json;charset=utf-8',
            success: function (response) {
                console.log("Response:" + response);
                if (response.indexOf("Success") > 0) { $("#MsgEmailID").show().css("color", "green"); $("#ErEmailID").hide(); }
                else { $("#ErEmailID").show().text("Error While Sending Email.").css("color", "red"); $("#MsgEmailID").hide(); }
            },
            error: function (response) { console.log("Error While Sending Email : " + response); }
        });
        $("#ErEmailID").hide();
    }
    else { $("#MsgEmailID").hide(); $("#ErEmailID").show(); e.preventDefault(); }
});

function checkTextWithSpace(input) {
    var pattern = new RegExp('^[a-zA-Z ]+$');
    if (pattern.test(input) == false) { return false; }
    else {return true; }
}

function GetPrevIns(InsId)
{
    var InsText="";
    switch (InsId) {
        case 1: InsText="Bajaj Allianz"; break;
        case 2: InsText="Bharti Axa"; break;
        case 3: InsText="Cholamandalam MS"; break;
        case 4: InsText="Future Generali"; break;
        case 5: InsText="HDFC ERGO"; break;
        case 6: InsText="ICICI Lombard"; break;
        case 7: InsText="IFFCO Tokio"; break;
        case 8: InsText="National Insurance"; break;
        case 9: InsText="Reliance General"; break;
        case 10: InsText="Royal Sundaram"; break;
        case 11: InsText="Tata AIG"; break;
        case 12: InsText="New India Assurance"; break;
        case 13: InsText="Oriental Insurance"; break;
        case 14: InsText="United India"; break;
        case 15: InsText="L&amp;T General"; break;
        case 16: InsText="Raheja QBE"; break;
        case 17: InsText="SBI General"; break;
        case 18: InsText="Shriram General"; break;
        case 19: InsText="Universal Sompo"; break;        
        case 33: InsText="Liberty Videocon"; break;
        case 35: InsText="Magma HDI"; break;
    }
    return InsText;
}

function ShowVehInsSubType(VISTCode)
{
    var InsText = "";
    switch (VISTCode) {
        case '3CH_0TP': InsText = "Comprehensive For For 3 Yrs"; break;
        case '5CH_0TP': InsText = "Comprehensive For For 5 Yrs"; break;
        case '1CH_2TP': InsText = "Comprehensive For 1 Yr + T.P. For 2 Yrs"; break;
        case '1CH_4TP': InsText = "Comprehensive For 1 Yr + T.P. For 4 Yrs"; break;       
        case '0CH_3TP': InsText = "T.P. Only For 3 Yrs"; break;
        case '0CH_5TP': InsText = "T.P. Only For 5 Yrs"; break;
        case '1CH_0TP': InsText = "Comprehensive Plan For 1 Yr"; break;
        case '0CH_1TP': InsText = "T.P. Only For 1 Yr"; break;
    }
    return InsText;
}