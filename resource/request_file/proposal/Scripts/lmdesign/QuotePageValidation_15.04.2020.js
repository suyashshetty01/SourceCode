// Global variables
var SRN = "";
var clientid = 2;
var crn = 0;
var CoverCount = 0;
var DiscountCount = 0;
var ProductIdVal;
var Name = "";
var EmailVal = "";
var SelectedInsId = 0;
var EA = 0;
var NEA = 0;
var EBV = 0;
var VehInsSubType = "";
var VehicleClass = "";

var AddOnSelectedList = [];
var IsLoad = true;
var BundleResponse = {};
var Response_Global;
var ss_id, fba_id, sub_fba_id, utm_source, utm_medium, utm_campaign, campaign_id, ip_address, app_version, mac_address;
var Get_URL;
var IsAddonPresent = false, IsBundlePresent = false;
var InsList = [];
var InsNameList = [];
var AddOnCount = 0, AddonSelectedCount = 0;
var Global_addon_list = [];
var AddonSection = "";
var addon_checked = [];
var addon_unchecked = [];
var IsVehicleFinanced = "no";
var Error_Master = {};
var InsID;
var renewalType = '';	

$(document).ready(function () {
    $('#vehimg').attr('src', 'https://chart.googleapis.com/chart?chl=' + escape(window.location.href) + '&chld=L|4&choe=UTF-8&chs=200x200&cht=qr&');
    $('#qrpopup').attr('src', 'https://chart.googleapis.com/chart?chl=' + escape(window.location.href) + '&chld=L|4&choe=UTF-8&chs=200x200&cht=qr&');
    $('.collapse.in').prev('.panel-heading').addClass('active');
    $('#accordion, #bs-collapse')
    .on('show.bs.collapse', function (a) { $(a.target).prev('.panel-heading').addClass('active'); })
    .on('hide.bs.collapse', function (a) { $(a.target).prev('.panel-heading').removeClass('active'); });
    $(".divPlanName").hide();
});

$('#btnclear').click(function () { $('#Addons p').find('input[type=checkbox]:checked').removeAttr('checked'); });

function addon_filter1() {
    addon_checked = $('#Addons').find('input[type=checkbox]:checked');
    addon_unchecked = $('#Addons').find("input:checkbox:not(:checked)");
    var obj = {};
    if (addon_checked.length > 0) { $.each(addon_checked, function (i, value) { obj[value.id] = "yes"; }); $(".trAddon").removeClass('hidden'); }
    if (addon_unchecked.length > 0) { $.each(addon_unchecked, function (i, value) { obj[value.id] = "no"; }); }

    obj["data_type"] = "addon";
    obj["search_reference_number"] = SRN;

    console.log(obj);
    //$.get("Save_User_Data?update_data=" + JSON.stringify(obj) + "&ClientID=" + clientid,
    //    function (data) {
    //        console.log('data', data);
    //        var res = $.parseJSON(data);
    //        if (res.Msg == "Data saved") {
    //            handle_addon_addition();
    //            //$('html,body').animate({ -start").offset().top }, 'slow');
    //        }
    //    }
    //);

    var SaveDataURL = '/quote/save_user_data';
    var obj_horizon_data = Horizon_Method_Convert(SaveDataURL, obj, "POST");
    $.ajax({
        type: "POST",
        data: obj_horizon_data['data'],
        url: obj_horizon_data['url'],
        dataType: "json",
        success: function (response) {
            console.log('response', response);
            if (response.Msg == "Data saved") { handle_addon_addition(); }
        },
        error: function (data) { console.log(data); }
    });

    //console.log(addon_checked.length);
    if (addon_checked.length > 0) {
        $("#AddonCount").text("(" + addon_checked.length + ")");
    }
    else { $("#AddonCount").text(""); }
}
function addon_filter() {
    if (IsAddonPresent == true || IsBundlePresent == true) {
        $("#spinner").css('display', 'block');
        addon_checked = $('#Addons').find('input[type=checkbox]:checked');
        addon_unchecked = $('#Addons').find("input:checkbox:not(:checked)");
        var obj = {}, objStandalone = {}, objPackage = {};
        obj["data_type"] = "addon";
        obj["search_reference_number"] = SRN;
        AddonSelectedCount = addon_checked.length;
        // Addon Standalone
        if (addon_checked.length > 0) {
            $.each(addon_checked, function (i, value) {
                objStandalone[value.id] = "yes";
                //For Premium compare
                $(".QC_" + value.id).removeClass('DisplayNone');
                $("#PremCompare_" + value.id).prop("checked", true);
            });
            $(".trAddon").removeClass('hidden');
        }

        if (addon_unchecked.length > 0) {
            $.each(addon_unchecked, function (i, value) {
                objStandalone[value.id] = "no";
                //For Premium compare
                $(".QC_" + value.id).addClass('DisplayNone');
                $("#PremCompare_" + value.id).prop('checked', false);
            });
        }
        obj["addon_standalone"] = objStandalone;

        // Addon Package adddonPackage By Pratik
        if (AddOnSelectedList != "") {
            $.each(AddOnSelectedList, function (i, value) {
                var NewVal = value;
                var PlanDetails = value.split("_");
                var PlanName = "";
                var InsID = PlanDetails[0];
                var a = InsID + "_";
                var index = NewVal.indexOf(a);
                PlanName = NewVal.slice(0, index) + NewVal.slice(index + a.length);

                // Saving Selected Plan Array for Insurer 
                for (var i = 0; i < quotes.Response.length; i++) {
                    if (quotes.Response[i].Insurer_Id == InsID) {
                        var InsResponse = quotes.Response[i];
                        var InsAddonList = InsResponse.Addon_List;
                        var InsPlanList = InsResponse.Plan_List;
                        var InsPremBrkup = InsResponse.Premium_Breakup;
                        for (var pl in InsPlanList) {
                            if (InsResponse.Plan_List[pl].Plan_Name == PlanName) {
                                BundleResponse["Insurer_" + InsID] = InsResponse.Plan_List[pl];
                                $("#BuyNow" + InsID).attr('service_log_unique_id', InsResponse.Plan_List[pl].Service_Log_Unique_Id);
                                break;
                            }
                        }
                        break;
                    }
                }

                objPackage["Insurer_" + PlanDetails[0]] = PlanName;
                //objPackage["Insurer_" + InsID] = BundleResponse["Insurer_" + InsID];
            });
        }

        obj["addon_package"] = objPackage;

        console.log(obj);
        console.log(JSON.stringify(obj));
        ////$.get("Save_User_Data?update_data=" + JSON.stringify(obj) + "&ClientID=" + clientid + "&UDID=" + UDID,
        //$.get("Save_User_Data?update_data=" + JSON.stringify(obj) + "&ClientID=" + clientid,
        //   function (data) {
        //       console.log('data', data);
        //       var res = $.parseJSON(data);
        //       if (res.Msg == "Data saved") { handle_addon_addition(); }
        //   }
        //);

        var SaveDataURL = '/quote/save_user_data';
        var obj_horizon_data = Horizon_Method_Convert(SaveDataURL, obj, "POST");
        $.ajax({
            type: "POST",
            data: obj_horizon_data['data'],
            url: obj_horizon_data['url'],
            dataType: "json",
            success: function (response) {
                console.log('response', response, '\n Msg', response.Msg);
                if (response.Msg == "Data saved") { handle_addon_addition(); SetHeight(); }
            },
            error: function (data) { console.log(data); }
        });
        $("#spinner").css('display', 'none');
        if (addon_checked.length > 0) { $("#AddonCount").text("(" + addon_checked.length + ")"); } else { $("#AddonCount").text(""); }
        $("#CloseAddon").click();
    }
    else { return false; }
}
function handle_addon_addition_current() {
    if (quotes.Response.length > 0) {
        addon_checked = $('#Addons').find('input[type=checkbox]:checked');
        addon_unchecked = $('#Addons').find("input:checkbox:not(:checked)");
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
                //if (value.Insurer.Insurer_ID == 11) {
                //    var net_premium_without_rsa = value.Premium_Breakup.own_damage['od_final_premium'] + value.Premium_Breakup.liability['tp_final_premium'] + addon_amount;
                //    net_premium = net_premium_without_rsa;
                //    var flag_addon_rsa = false;
                //    var addon_amount_rsa = 0;
                //    if (value.Addon_List.hasOwnProperty('addon_road_assist_cover')) {
                //        $.each(addon_checked, function (i, v) {
                //            var addon_name = addon_list[v.id];
                //            if (addon_name == 'RoadSide Assistance') { flag_addon_rsa = true; addon_amount_rsa = value.Addon_List[v.id]; }
                //        });
                //    }
                //    if (flag_addon_rsa) { net_premium_without_rsa = Math.round(net_premium_without_rsa) - addon_amount_rsa - 0; }
                //    service_tax = 2 * (Math.round(net_premium_without_rsa * 0.09)) + Math.round(addon_amount_rsa * 0.18) - 0;
                //}
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

                    //Change Attr noclaimbonus
                    $('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('noclaimbonus', ncb);
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
                                Math.round(($('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('personalaccidentcoverfornamedpassenger')).replace(/,/g, '')) +
                                Math.round(($('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('ownpremises')).replace(/,/g, '')) +
                                Math.round(($('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('outstandingloancover')).replace(/,/g, ''));
                    if (TotalCover == 0) { $("#DisplayCover" + value.Insurer.Insurer_ID).html("No Cover Available"); }
                }
                //$('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('totalCover', TotalCover);

                if (value.Insurer.Insurer_ID == 35) {
                    net_premium = net_premium - 195;
                    total_liability_premium = value.Premium_Breakup.liability['tp_final_premium'] - 195;
                }

                $('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('TotalLiabilityPremium', rupee_format(total_liability_premium));
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
function handle_addon_addition() {

    var NewAddOnSelectedList = [];
    BundleResponse = {};
    NewAddOnSelectedList = AddOnSelectedList;
    var BundleHtml = $("#BundleEdit").html();
    var BundleCount = 0;
    $("#BundleBody").html("");
    var InsurerCount = 0;
    var vehicle_age;
    var vehicle_Insurance_type;
    $("#BundleEdit").html("");
    if (quotes.Response.length > 0) {
        var addon_checked = $('#Addons').find('input[type=checkbox]:checked');
        var addon_unchecked = $('#Addons').find("input:checkbox:not(:checked)");

        if (quotes.Summary.hasOwnProperty("Addon_Request") && quotes.Summary.Addon_Request != null && (Object.keys(quotes.Summary.Addon_Request).length > 0)) {
            if (IsLoad == true) {
                AddOnSelectedList = [];
                AddonBlock(quotes);
            }
            NewAddOnSelectedList = AddOnSelectedList;
        }
        InsList = [];
        vehicle_Insurance_type = quotes.Summary.Request_Product['vehicle_insurance_type'];
        $.each(quotes.Response, function (index, value) {
            if (value.Error_Code == "") {
                var InsID = value.Insurer.Insurer_ID;
                if (InsID === 2) {
                    if (VehInsSubType.indexOf('0CH') === -1 && value.Premium_Breakup.liability.tp_cover_outstanding_loan > 0) {
                        if (ProductIdVal === 1 || ProductIdVal === 10) {
                            if (original_request.is_oslc === "yes") {
                                $("#divWithOSLC_" + InsID).show();
                            }
                        }
                    }
                }
                //if (InsID == 2 && (VehInsSubType.indexOf('0CH') == -1 || VehInsSubType.indexOf('1OD') == -1) && ProductIdVal == 1) {
                if (InsID == 2 && VehInsSubType.indexOf('0CH') == -1 && ProductIdVal == 1) {
                    $("#divLoanWaiver").show();
                }
                if (InsID == 17 && (VehInsSubType.indexOf('0CH') == -1 || VehInsSubType.indexOf('1OD') == -1) && ProductIdVal == 10) {
                    var misp_SSID = "0";
                    if (quotes != null && quotes !== undefined) {
                        if (quotes.hasOwnProperty('Summary')) {
                            if (quotes.Summary.hasOwnProperty('Request_Core')) {
                                if (quotes.Summary.Request_Core.hasOwnProperty('ss_id')) {
                                    misp_SSID = quotes.Summary.Request_Core.ss_id;
                                }
                            }
                        }
                    }/*
                    var misp_report_ssid = {
                        '487': 0,
                        '816': 1,
                        '10352': 0,
                        '12512': 0
                    }*/
                    if (["816", "14154", "14155", "14156", "14157", "14158", "17051", "15912", "15253", "11971", "17053"].indexOf(misp_SSID.toString()) > -1) {
                        $("#divODDiscount").show();
                    }
                }
                var InsName = value.Insurer.Insurer_Code;
                var addon_amount = 0;//value.Premium_Breakup.net_premium;
                var addon_premium_breakup = "";
                InsList.push(InsID);
                InsNameList.push(InsName);
                $($('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children()[1]).children('.clearfix').nextAll().remove();
                $($('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.addon-selected')).html("");
                $($('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.addon-selected')).hide();
                //Addon for Mobile
                $($('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.addon-selectedMobile').children('.DisplayAddons')).html("");

                //addon label start
                var count = 0;
                //console.log("addon_checked", addon_checked, "value.Addon_List", value.Addon_List, "Addon_List", addon_list);

                // ALACARTE
                if (value.Addon_Mode == "ALACARTE") {
                    $.each(addon_checked, function (i, v) {
                        //var addon_name = addon_list[v.id];  
                        var addon_name = addon_shortlist[v.id];
                        var addon_Fullname = addon_list[v.id];
                        if (typeof value.Addon_List[v.id] !== 'undefined') {
                            count++;
                            var addon_premium = value.Addon_List[v.id];
                            addon_amount += addon_premium;

                            //addon_premium_breakup += addon_name + '-' + addon_premium + '+';//Commented By Pratik On 14-02-2018
                            addon_premium_breakup += addon_Fullname + '-' + addon_premium + '+';// Added By Pratik On 14-02-2018
                            //For Desktop
                            //$($('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.addon-selected')).append('<div style="margin-bottom: 2px;font-size: 11px;background-color: #0091c0;color:#fff; padding: 3px;border-radius:2px; /*text-align: center*/; float:left; padding-right: 0px; padding-left: 0px !important;margin-right: 3px;" class="col-xs-4 col-md-2 form-height" title="' + addon_Fullname + '"><div class="col-md-5" style"padding-left: 10px;">' + addon_name + '</div><div class="" style="padding-left: 0;"><span class="addonvalue">₹ ' + Math.round(addon_premium) + '</span ></div ></div > ');
                            $($('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.addon-selected')).append('<span class="BlockSections" title="' + addon_Fullname + '">' + addon_name + ' <span>₹ ' + Math.round(addon_premium) + '</span></span>');

                            //For Mobile
                            $($('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.addon-selectedMobile').children('.DisplayAddons')).append('<div class="col-xs-6 col-md-2 form-height" title="' + addon_Fullname + '">' + addon_Fullname + ' <span><i class="fa fa-inr"></i>' + Math.round(addon_premium) + '</span></div>');
                        }
                        //else {
                        //    $($('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.boxLeft').children('.addon-selected')).append('<div><button class="btn btn-danger btn-xs btn-block waves-effect" type="button">' + addon_name + ' <span class="badge">NA</span></button></div>');
                        //}
                    });
                }

                // BUFFET
                if (value.Addon_Mode == "BUFFET") {
                    var amount = [];
                    var BuffetPlan = value.Plan_List;
                    var AddonArray = "";

                    $("#BundleBody").append('<br><div id="div' + InsID + '"><div class="AddonPlanHeading">' + InsName + '</div>');
                    if (html_addon_bundle != undefined) {
                        BundleCount++;
                        addonbundle = html_addon_bundle;
                        addonbundle = addonbundle.replace(new RegExp('___Insurer_Name___', 'gi'), InsName);
                        addonbundle = addonbundle.replace(new RegExp('___Insurer_Id___', 'gi'), InsID);
                        // var BundlePlanBlock = $(".addons_" + InsID).html();
                        // BundlePlanBlock = $(".BundlePlanBlock").html();
                        // $(".BundlePlanBlock").html("");
                        $("#BundleEdit").append(addonbundle);

                        //html_addon_bundle_Plan
                        BundlePlan = $(".addons_" + InsID).html();
                        $(".addons_" + InsID).html("");
                        if (InsID == 11 && vehicle_Insurance_type == "renew") {
                            vehicle_age = quotes.Summary.Request_Product['vehicle_age_year'];
                            if (vehicle_age > 5) {
                                BuffetPlan = [];
                                for (var i = 0; i < value.Plan_List.length; i++) {
                                    if (vehicle_age > 5 && vehicle_age <= 7 && quotes.Summary.Request_Product['is_claim_exists'] == "yes") {
                                        if (value.Plan_List[i].Plan_Name != "SAPPHIREPP") {
                                            BuffetPlan.push(value.Plan_List[i]);
                                        }
                                    }
                                    if (vehicle_age > 5 && vehicle_age <= 7 && quotes.Summary.Request_Product['is_claim_exists'] == "no") {
                                        if (value.Plan_List[i].Plan_Name == "GOLD" || value.Plan_List[i].Plan_Name == "SILVER" || value.Plan_List[i].Plan_Name == "Basic") {
                                            BuffetPlan.push(value.Plan_List[i]);
                                        }
                                    }
                                    if (vehicle_age > 7 && vehicle_age <= 10) {
                                        if (value.Plan_List[i].Plan_Name == "GOLD" || value.Plan_List[i].Plan_Name == "SILVER" || value.Plan_List[i].Plan_Name == "Basic") {
                                            BuffetPlan.push(value.Plan_List[i]);
                                        }
                                    }
                                }
                            }
                        }
                        for (var i = 0; i < BuffetPlan.length; i++) {
                            var BuffetPlanName = BuffetPlan[i].Plan_Name;
                            var BuffetPlanName1 = BuffetPlanName.replace(/_/g, " ");
                            var BundlePlan = html_addon_bundle_Plan;
                            //BundlePlanBlock = BundlePlanBlock.replace('___BundleName___', BuffetPlanName1);

                            BundlePlan = BundlePlan.replace(new RegExp('___BundleName___', 'gi'), BuffetPlanName);
                            BundlePlan = BundlePlan.replace(new RegExp('___BundleName1___', 'gi'), BuffetPlanName1);
                            BundlePlan = BundlePlan.replace(new RegExp('___Insurer_Id___', 'gi'), InsID);

                            if (BuffetPlanName == "Basic") { Baseclass = "Basic"; }
                            else { Baseclass = "NoBasic"; }
                            BundlePlan = BundlePlan.replace(new RegExp('___Baseclass___', 'gi'), Baseclass);

                            $(".addons_" + InsID).append(BundlePlan);

                            var Plan_Addon_Breakup = BuffetPlan[i].Plan_Addon_Breakup;
                            //Khushbu Gite 20190401 
                            // Tata AIG give this addon for Free, they want to show 
                            if (InsID == 11 && BuffetPlanName !== "Basic") {
                                Plan_Addon_Breakup["addon_repair_glass_fiber_plastic"] = 0
                            }

                            if (InsID == 11 && vehicle_Insurance_type == "renew") {
                                switch (BuffetPlan[i].Plan_Name) {
                                    case 'PEARLP': $("#note" + InsID + "_" + BuffetPlanName).text('You can only opt ' + BuffetPlanName + ' if you have  Zero depreciation & Engine secure in previous policy.'); break;
                                    case 'SILVER': $("#note" + InsID + "_" + BuffetPlanName).text(''); break;
                                    case 'GOLD': $("#note" + InsID + "_" + BuffetPlanName).text(''); break;
                                    case 'SAPPHIRE': $("#note" + InsID + "_" + BuffetPlanName).text('You can only opt ' + BuffetPlanName + ' if you have Zero depreciation & Tyre secure in previous policy.'); break;
                                    case 'SAPPHIREPP': $("#note" + InsID + "_" + BuffetPlanName).text('You can only opt ' + BuffetPlanName + ' if you have Zero depreciation, Engine secure, Tyre secure & RTI in previous policy.'); break;
                                    case 'PEARL': $("#note" + InsID + "_" + BuffetPlanName).text('You can only opt ' + BuffetPlanName + ' if you have Zero depreciation in previous policy.'); break;
                                    case 'SAPPHIREP': $("#note" + InsID + "_" + BuffetPlanName).text('You can only opt ' + BuffetPlanName + ' if you have Zero depreciation, Engine secure & Tyre secure in previous policy.'); break;
                                    case 'Basic': $("#note" + InsID + "_" + BuffetPlanName).text(''); break;
                                }
                            }

                            //

                            var addon_amount = 0;
                            var arr = [], arr1 = [], arrFullName = [];
                            //var AddonChecked = false;
                            BundleAddonDisplay = $(".AddonDisplay_" + InsID + "_" + BuffetPlanName).html();
                            $(".AddonDisplay_" + InsID + "_" + BuffetPlanName).html("");
                            var Baseclass = "", AddonTitle = "", AddonDisplay = "";
                            BundleAddonDisplay1 = BundleAddonDisplay;
                            $(".BundleAddons" + InsID).html("");
                            $.each(Plan_Addon_Breakup, function (key, v) {
                                AddonTitle = addon_list[key] + "(" + v + ")";
                                var addon_name = addon_shortlist[key];
                                arr1.push(addon_shortlist[key]);
                                arr.push('<span class="Pack" title="' + AddonTitle + '">' + addon_shortlist[key] + '</span>');
                                var addon_premium = v;
                                addon_amount += addon_premium;
                                amount[BuffetPlanName] = addon_amount;
                                //AddonContent = AddonContent + '<span title="' + addon_premium + '">' + addon_shortlist[key] + '</span> ';

                                // New Bundle Implementation Code
                                AddonDisplay = addon_list[key] + "(" + addon_name + ") ( ₹ " + v + ")";
                                BundleAddonDisplay = BundleAddonDisplay1.replace(new RegExp('___AddonDetails___', 'gi'), AddonDisplay);
                                $(".AddonDisplay_" + InsID + "_" + BuffetPlanName).append(BundleAddonDisplay);
                                //addon_list[key]  v
                                //HtmlBundleAddon = HtmlBundleAddon + "<div class='col-xs-6 col-md-2 form-height'>"+addon_list[key]+"<span><i class='fa fa-inr'></i>"+ v +"</span></div>";
                            });
                            //$(".BundleAddons" + InsID).html(HtmlBundleAddon);
                            if (BuffetPlanName == "Basic" || arr.length == 0) {
                                Baseclass = "Basic";
                                arr = [];
                                arr.push("No Addons");
                                addon_amount = 0;
                                var NP = value.Premium_Breakup.net_premium;
                            }
                            else {
                                Baseclass = "NoBasic";
                                var NP = value.Premium_Breakup.net_premium + addon_amount;
                            }

                            var PackageAddon = arr.join(', ');

                            //var NP = value.Premium_Breakup.net_premium + addon_amount;
                            var ST = NP * 0.18;
                            var PkgNP = rupee_format(Math.round(NP + ST - 0));

                            //For Desktop
                            //$($('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.addon-selected')).append('<div class="BlockSections" id="div-' + BuffetPlanName + "-" + InsID + '" name="' + addon_amount + '"><input type="radio" class="' + Baseclass + '" PlanAddon="' + arr1.join('_') + '" id="' + BuffetPlanName + "-" + InsID + '" name="' + +BuffetPlanName + "-" + InsID + '" onclick="PackageSelect(' + InsID + ',\'' + BuffetPlanName + '\')">' + BuffetPlanName1 + " (₹ <span class='Pack Pack" + InsID + "'>" + PkgNP + "</span>)" + " - (" + PackageAddon + ")" + "</div>");

                            $("#BundleBody").append('<div id="div-' + BuffetPlanName + "-" + InsID + '" name="' + addon_amount + '"><input type="radio" class="' + Baseclass + '" PlanAddon="' + arr1.join('_') + '" id="' + InsID + "_" + BuffetPlanName + '" name="' + +BuffetPlanName + "-" + InsID + '" onclick="PackageSelect(' + InsID + ',\'' + BuffetPlanName + '\')" packagepremium="' + PkgNP + '">' + BuffetPlanName1 + " (₹ <span class='Pack Pack" + InsID + "'>" + PkgNP + "</span>)" + " - (" + PackageAddon + ")" + "</div>");

                            //Selecting Basic Plan Default
                            //$(".Basic").attr("checked", "true"); // Setting All Basic Plan Selected
                            if (BuffetPlan.length == 1) { $("#" + BuffetPlanName + "-" + InsID).attr("checked", true); }
                            $("#Premium_" + InsID + "_" + BuffetPlanName).text(PkgNP);

                        }
                        //$("#BundleEdit").append(addonbundle);
                        $("#BundleBody").append('</div>');
                        //$('#DisplayAddons' + InsID).find('input[type=checkbox]:checked').removeAttr('checked');
                    }
                }

                //For Sorting Addons Starts
                var mylist = $($('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.addon-selected'));
                var listitems = mylist.children("div");
                listitems.sort(function (a, b) {
                    var compA = $(a).attr('name');
                    var compB = $(b).attr('name');
                    return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
                })
                $(mylist).append(listitems);
                //For Sorting Addons Ends

                //
                $("#DisplayAddons" + InsID).html($("#Add-ons" + InsID).html());
                $("#DisplayDiscount" + InsID).removeClass('hidden');
                $("#DisplayCover" + InsID).removeClass('hidden');

                //addon label end
                var od_final_premium;
                var service_tax;
                var total_liability_premium;
                var net_premium;
                var ncb = value.Premium_Breakup.own_damage['od_disc_ncb'] - 0;
                if (InsID == 13 && vehicle_Insurance_type == "renew") {
                    var od_final_1;
                    var od_basic_premium;
                    var ncb_premium;
                    var next_ncb = value.LM_Custom_Request.vehicle_ncb_next;
                    var next_ncb_slab = {
                        '0': 0,
                        '20': 0.20,
                        '25': 0.25,
                        '35': 0.35,
                        '45': 0.45,
                        '50': 0.50
                    };
                    var ncb_perc = next_ncb_slab[next_ncb];
                    //var ncb_premium = value.Premium_Breakup.own_damage['od_disc_ncb'] - 0; addon_amount value.LM_Custom_Request.vehicle_ncb_next
                    if (addon_amount == 0) {
                        od_final_1 = value.Premium_Breakup.own_damage['od_final_premium'] + value.Premium_Breakup.own_damage['od_disc_ncb'];
                        od_basic_premium = value.Premium_Breakup.own_damage['od_basic'] - value.Premium_Breakup.own_damage['od_disc'];
                        ncb_premium = (Math.round(od_basic_premium * ncb_perc));
                        $('#divQuitList' + InsID + ' .PremiumBreakup').attr('NoClaimBonus', rupee_format(ncb_premium));
                        od_final_premium = (Math.round(od_final_1 - ncb_premium));
                        $('#divQuitList' + InsID + ' .PremiumBreakup').attr('totalodpremium', rupee_format(od_final_premium));
                        total_liability_premium = value.Premium_Breakup.liability['tp_final_premium'];
                        net_premium = od_final_premium + total_liability_premium;
                        value.Premium_Breakup.net_premium = net_premium;
                    }
                    else {
                        od_final_1 = value.Premium_Breakup.own_damage['od_final_premium'] + value.Premium_Breakup.own_damage['od_disc_ncb'];
                        od_basic_premium = value.Premium_Breakup.own_damage['od_basic'] - value.Premium_Breakup.own_damage['od_disc'];
                        ncb_premium = (Math.round((od_basic_premium + addon_amount) * ncb_perc));
                        $('#divQuitList' + InsID + ' .PremiumBreakup').attr('NoClaimBonus', rupee_format(ncb_premium));
                        od_final_premium = (Math.round(od_final_1 - ncb_premium));
                        $('#divQuitList' + InsID + ' .PremiumBreakup').attr('totalodpremium', rupee_format(od_final_premium));
                        total_liability_premium = value.Premium_Breakup.liability['tp_final_premium'];
                        net_premium = od_final_premium + total_liability_premium;
                        value.Premium_Breakup.net_premium = net_premium;
                    }
                }
                //For GCV service tax Calculation is different.
                if (ProductIdVal == 12) {
                    var OD_final = value.Premium_Breakup.own_damage['od_final_premium'];
                    var OD_Own_Premises = value.Premium_Breakup.own_damage['od_disc_own_premises'];
                    if (InsID == 4 && quotes.Summary.Request_Core.vehicle_class == "gcv") {
                        total_liability_premium = (Math.round(value.Premium_Breakup.liability['tp_final_premium']));
                    } else {
                        var total_liability_premium1 = parseInt(value.Premium_Breakup.liability['tp_final_premium']) + parseInt(value.Premium_Breakup.liability['tp_cover_imt23']);
                        var total_liability_premium2 = parseInt(value.Premium_Breakup.liability['tp_basic_other_use']);
                        total_liability_premium = (Math.round(total_liability_premium1 + total_liability_premium2));
                    }
                    value.Premium_Breakup.liability['tp_final_premium'] = total_liability_premium;
                    if (InsID == 5) {
                        od_final_premium = (Math.round(OD_final - OD_Own_Premises));
                    } else {
                        od_final_premium = (Math.round(value.Premium_Breakup.own_damage['od_final_premium']));
                    }
                    value.Premium_Breakup.own_damage['total_liability_premium'] = od_final_premium;
                    net_premium = od_final_premium + total_liability_premium + addon_amount;
                    value.Premium_Breakup.net_premium = net_premium;
                    $('#divQuitList' + InsID + ' .PremiumBreakup').attr('totalodpremium', rupee_format(od_final_premium));
                    if (quotes.Summary.Request_Core.vehicle_class == "gcv") {
                        var tp_basic_tax = 0;
                        var od_basic_tax = 0;
                        if (InsID == 4) {
                            tp_basic_tax = parseFloat(value.Premium_Breakup.liability['tp_final_premium'] * 0.1218);
                            od_basic_tax = parseFloat(value.Premium_Breakup.own_damage['od_final_premium'] * 0.18);
                            service_tax = (Math.round(tp_basic_tax + od_basic_tax));
                            value.Premium_Breakup.service_tax = service_tax;
                        } else {
                            var tp_basic_Tax = 2 * (value.Premium_Breakup.liability['tp_basic'] * 0.06);
                            var rest_prm = parseFloat(value.Premium_Breakup['net_premium']) - parseFloat(value.Premium_Breakup.liability['tp_basic']);
                            var rest_prm_Tax = 2 * (rest_prm * 0.09) - 0;
                            service_tax = (Math.round(tp_basic_Tax + rest_prm_Tax));
                            value.Premium_Breakup.service_tax = service_tax;
                        }
                    }
                    else {
                        service_tax = 2 * (Math.round(net_premium * 0.09) - 0);
                        value.Premium_Breakup.service_tax = service_tax;
                    }
                }
                else {
                    total_liability_premium = value.Premium_Breakup.liability['tp_final_premium'] - 0;
                    net_premium = value.Premium_Breakup.net_premium + addon_amount;
                    od_final_premium = value.Premium_Breakup.own_damage['od_final_premium'] - 0;
                    service_tax = 2 * (Math.round(net_premium * 0.09) - 0);
                }

                //Added by Ajit for TATA-AIG and Bajaj for Service Tax Calculation
                //if (InsID == 11) {
                //    var net_premium_without_rsa = value.Premium_Breakup.own_damage['od_final_premium'] + value.Premium_Breakup.liability['tp_final_premium'] + addon_amount;
                //    net_premium = net_premium_without_rsa;
                //    var flag_addon_rsa = false;
                //    var addon_amount_rsa = 0;
                //    if (value.Addon_List.hasOwnProperty('addon_road_assist_cover')) {
                //        $.each(addon_checked, function (i, v) {
                //            var addon_name = addon_list[v.id];
                //            if (addon_name == 'RoadSide Assistance') { flag_addon_rsa = true; addon_amount_rsa = value.Addon_List[v.id]; }
                //        });
                //    }
                //    if (flag_addon_rsa) { net_premium_without_rsa = Math.round(net_premium_without_rsa) - addon_amount_rsa - 0; }
                //    service_tax = 2 * (Math.round(net_premium_without_rsa * 0.09)) + Math.round(addon_amount_rsa * 0.18) - 0;
                //}
                if (InsID == 14) {
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

                //$('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.dynamic').children('.Premium').html(' Rs.' + rupee_format(final_premium) + ' <i style="font-size:14px">(1 year) </i>');
                $('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.dynamic').children('.btn-buy').children('.Premium').html('₹ ' + rupee_format(final_premium));// + ' <i style="font-size:14px">(1 year) </i>');
                $('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.dynamic').children('.btn-buy').children('.PremiumMobile').html('₹ ' + rupee_format(final_premium));

                $('#divQuitList' + InsID).attr('premium', final_premium);
                $('#divQuitList' + InsID).attr('applied_addon', count);
                $('#BuyNow' + InsID + '').children('#breakup_Btn').text('₹ ' + rupee_format(final_premium) + '');
                $('#divQuitList' + InsID + ' .PremiumBreakup').attr('netpayablepayablepremium', rupee_format(final_premium));
                $('#divQuitList' + InsID + ' .PremiumBreakup').attr('servicetax', rupee_format(Math.round(service_tax)));
                $('#divQuitList' + InsID + ' .PremiumBreakup').attr('addonpremium', Math.round(addon_amount));
                $('#divQuitList' + InsID + ' .PremiumBreakup').attr('totalpremium', rupee_format(Math.round(net_premium)));
                $('#divQuitList' + InsID + ' .PremiumBreakup').attr('addonname', addon_premium_breakup);

                //For Displaying Message For Discount Not Selected
                var TotalDiscountVal = 0;
                TotalDiscountVal = Math.round(value.Premium_Breakup.own_damage.od_disc_anti_theft) + Math.round(value.Premium_Breakup.own_damage.od_disc_vol_deduct);

                //For CV
                if (ProductIdVal == 12) {
                    TotalDiscountVal += Math.round(value.Premium_Breakup.own_damage.od_disc_own_premises);
                }
                //$('#divQuitList' + InsID + ' .PremiumBreakup').attr('totaldiscount', TotalDiscountVal);
                if (TotalDiscountVal == 0) {
                    $('#DisplayDiscount' + InsID).html("No Discount Available");
                }

                //For Displaying Message For Cover Not Selected
                var TotalCover = 0;
                TotalCover = Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('electricalacessoriespremium')).replace(/,/g, '')) + Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('nonelectricalaccessoriespremium').replace(/,/g, '')));
                if (ProductIdVal == 10) {
                    if (TotalCover == 0) { $("#DisplayCover" + InsID).html("No Cover Available"); }
                }
                if (ProductIdVal == 1) {
                    TotalCover +=
                                Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('legalliabilitypremiumforpaiddriver')).replace(/,/g, '')) +
                                Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('personalaccidentcoverforpaiddriver')).replace(/,/g, '')) +
                                Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('personalaccidentcoverforunammedpassenger')).replace(/,/g, '')) +
                                Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('personalaccidentcoverfornamedpassenger')).replace(/,/g, '')) +
                                Math.round(($('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('outstandingloancover')).replace(/,/g, ''));
                    if (TotalCover == 0) { $("#DisplayCover" + InsID).html("No Cover Available"); }
                }
                if (ProductIdVal == 12) {
                    if (VehicleClass == 'gcv') {
                        TotalCover +=
                            Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('imt23')).replace(/,/g, '')) +
                            Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('personalaccidentcoverforemployee')).replace(/,/g, '')) +
                            Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('otheruses')).replace(/,/g, '')) +
                            Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('coolie_ll')).replace(/,/g, ''));
                    }
                    if (VehicleClass == 'pcv') {
                        TotalCover +=
                            Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('fppremium')).replace(/,/g, '')) +
                            Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('nfppremium')).replace(/,/g, '')) +
                            Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('conductor_ll')).replace(/,/g, ''));
                    }
                    TotalCover +=
                                Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('legalliabilitypremiumforpaiddriver')).replace(/,/g, '')) +
                                Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('personalaccidentcoverforpaiddriver')).replace(/,/g, '')) +
                                Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('personalaccidentcoverforunammedpassenger')).replace(/,/g, '')) +
                                Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('personalaccidentcoverfornamedpassenger')).replace(/,/g, '')) +
                                Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('cleaner_ll')).replace(/,/g, '')) +
							    Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('geographicalareaext')).replace(/,/g, '')) +
							    Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('additionaltowing')).replace(/,/g, '')) +
							    Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('fibreglasstankfitted')).replace(/,/g, ''));
                    if (TotalCover == 0) { $("#DisplayCover" + InsID).html("No Cover Available"); }
                }
                //$('#divQuitList' + InsID + ' .PremiumBreakup').attr('totalCover', TotalCover);

                if (InsID == 35) {
                    net_premium = net_premium - 195;
                    total_liability_premium = value.Premium_Breakup.liability['tp_final_premium'] - 195;
                }

                $('#divQuitList' + InsID + ' .PremiumBreakup').attr('TotalLiabilityPremium', rupee_format(total_liability_premium));
                $('#divQuitList' + InsID + ' .PremiumBreakup').attr('totalpremium', rupee_format(Math.round(net_premium)));

                if (addon_checked.length > 0) {
                    $($('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.addon-selected')).show(); $(".trAddon").removeClass('hidden');
                }
                else { $($('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.addon-selected')).hide(); $(".trAddon").addClass('hidden'); }
                if ($($('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.addon-selected')).html() == "") {
                    $($('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.addon-selected')).show().html("No Add-ons Selected").css({ "text-align": "center" }, { "color": "rgb(29, 40, 85)" }, { "padding-top": "30px" });
                    $("#DisplayAddons" + InsID).show().html("No Add-ons Available");
                }
                $("#Add-ons" + InsID).html("");

                // $('.Basic').click();
            }
        });

        //AddOnSelectedList = NewAddOnSelectedList;
        if (IsLoad == true && AddOnSelectedList.length == 0) {
            $(".Basic").attr("checked", "true");
            NewAddOnSelectedList = $('#BundleEdit :radio:checked').map(function () { return this.id; }).get();
        }
        else { NewAddOnSelectedList = AddOnSelectedList; }

        var BasicCount = 0;
        if (NewAddOnSelectedList != "") {
            for (var i = 0; i < NewAddOnSelectedList.length; i++) {
                $('#' + NewAddOnSelectedList[i]).attr('checked', true);
                $('#' + NewAddOnSelectedList[i]).click();
                var arr = NewAddOnSelectedList[i].split("_");
                //arr[1] = arr[1].replace(new RegExp(' ', 'gi'), "_");

                var NewVal = NewAddOnSelectedList[i];
                var PlanDetails = NewAddOnSelectedList[i].split("_");
                var PlanName = "";
                var a = PlanDetails[0] + "_";
                var index = NewVal.indexOf(a);
                PlanName = NewVal.slice(0, index) + NewVal.slice(index + a.length);

                AddonSelect(PlanDetails[0], PlanName);

                //AddonSelect(arr[0], arr[1]);
                //console.log("AddonSelect() " + PlanDetails[0] + "_" +PlanName);
                if (PlanName == 'Basic') { BasicCount++; }
            }
        }
        else { $(".Basic").attr("checked", "true"); } // Setting All Basic Plan Selected

        if (addon_checked.length == 0) {
            $($('.UlClass').children('.LiClass').children('.addon-selected')).hide();
            if (BasicCount == NewAddOnSelectedList.length) { $(".trAddon").addClass('hidden'); }
            else { $(".trAddon").removeClass('hidden'); }
        }

        if (BundleCount == 0) {
            IsBundlePresent = false;
            $("#BundleEdit").html('<div style="margin: 10px;text-align: center;">No Addon Bundle Plan Available</div>');
        }
        else { IsBundlePresent = true; }

        $('.quoteboxparent').html($('.quoteboxmain').pbsort(false, "applied_addon"));

        set_minmax_premium();
    }
    $(".more_details, .BasicMD").hide();
    $("#spinner").css('display', 'none');
}
function redirect(id) {
    var arn = $(id).attr('href').split("/")[4];
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
        ThirdPartyPropertyDamage: breakup.od_disc_tppd,
        AutomobileAssociationMembershipPremium: breakup.own_damage.od_disc_aai,
        NoClaimBonus: breakup.own_damage.od_disc_ncb,
        UnderwriterLoading: breakup.own_damage.od_loading,
        TotalODPremium: breakup.own_damage.od_final_premium,
        ThirdPartyLiablityPremium: breakup.liability.tp_basic,
        BiFuelKitLiabilityPremium: breakup.liability.tp_cng_lpg,
        OwnPremises: breakup.own_damage.od_disc_own_premises,
        NFPPremium: breakup.liability.tp_cover_non_fairing_paying_passenger,
        FPPremium: breakup.liability.tp_cover_fairing_paying_passenger,
        OtherUses: breakup.liability.tp_basic_other_use,
        IMT23: breakup.liability.tp_cover_imt23,
        Conductor_Ll: breakup.liability.tp_cover_conductor_ll,
        Coolie_Ll: breakup.liability.tp_cover_coolie_ll,
        Cleaner_Ll: breakup.liability.tp_cover_cleaner_ll,
        GeographicalAreaExt: breakup.liability.tp_cover_geographicalareaext,
        AdditionalTowing: breakup.liability.tp_cover_additionaltowing,
        FibreGlassTankFitted: breakup.liability.tp_cover_fibreglasstankfitted,
        LLTP: breakup.liability.tp_cover_lltp,
        PersonalAccidentCoverForEmployee: breakup.liability.tp_cover_emp_pa,
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

    /* 
     Imt23: breakup.liability.tp_cover_imt23,
     NonFairingPayingPassenger: breakup.liability.tp_cover_non_fairing_paying_passenger,
     FairingPayingPassenger: breakup.liability.tp_cover_fairing_paying_passenger,
     OtherUse: breakup.own_damage.od_basic_private_use,
     //OtherUseTP: breakup.liability.tp_cover_private_use,
     OwnPremises: breakup.liability.tp_cover_own_premises,
     PersonalAccidentCoverForEmployee: breakup.liability.tp_cover_emp_pa,
     */
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
    'addon_rim_damage_cover': 'Rim Damage Cover',
    'addon_windshield_cover': 'Windshield Protection',
    'addon_zero_dep_cover': 'Zero Depreciation',
    'addon_additional_pa_cover': 'Additional PA',
    'addon_repair_glass_fiber_plastic': 'Repair of glass,fiber,plastic',
    'addon_emergency_transport_hotel': 'Emergency transport and Hotel expenses',
    'addon_mandatory_deduction_protect': 'Mandatory Deduction Protect'
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
    'addon_rim_damage_cover': "RD",
    'addon_windshield_cover': 'WP',
    'addon_zero_dep_cover': 'ZD',
    'addon_additional_pa_cover': 'APA',
    'addon_repair_glass_fiber_plastic': 'RGFB',
    'addon_emergency_transport_hotel': 'ETHE',
    'addon_mandatory_deduction_protect': 'MDP'
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
    'addon_additional_pa_cover': 'Tllo-iqhgek',
    'addon_repair_glass_fiber_plastic': 'Tllo-iqhgek',
    'addon_emergency_transport_hotel': 'Tllo-iqhgek'
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
       { "Insurer_ID": 45, "Insurer_Name": "Acko General", "Insurer_Logo_Name": "Acko_General.png" },
       { "Insurer_ID": 46, "Insurer_Name": "Edelweiss General", "Insurer_Logo_Name": "edelweiss.png" }
];


function toTitleCase(str) {
    var lcStr = str.toLowerCase();
    return lcStr.replace(/(?:^|\s)\w/g, function (match) {
        return match.toUpperCase();
    });
}

var arr_ins = {
    1: "BajajAllianz",
    2: "BhartiAxa",
    3: "Cholamandalam MS",
    4: "Future Generali",
    5: "HDFCERGO",
    6: "ICICILombard",
    7: "IFFCOTokio",
    8: "National Insurance",
    9: "Reliance",
    10: "RoyalSundaram",
    11: "TataAIG",
    12: "New India",
    13: "Oriental",
    14: "UnitedIndia",
    15: "L&amp;T General",
    16: "Raheja QBE",
    17: "SBI General",
    18: "Shriram General",
    19: "UniversalSompo",
    20: "Max Bupa",
    21: "Apollo Munich",
    22: "DLF Pramerica",
    23: "Bajaj Allianz",
    24: "IndiaFirst",
    25: "AEGON Religare",
    26: "Star Health",
    27: "Express BPO",
    28: "HDFC Life",
    29: "Bharti Axa",
    30: "Kotak Mahindra",
    31: "LIC India",
    32: "Birla Sun Life",
    33: "LibertyGeneral",
    34: "Religare",
    35: "Magma HDI",
    36: "Indian Health Organisation",
    37: "TATA AIA",
    38: "Cigna Manipal",
    39: "ICICI Pru",
    42: "Aditya Birla",
    44: "GoDigit",
    45: "Acko",
    46: "Edelweiss",
    47: "DHFL",
    100: "FastLaneVariantMapping",
    101: "Landmark"
};
$('.Insurer_errorMsg').click(function () {
    $('.noInsurer_list_popup').show();
    var res = quotes.Response;
    if (quotes.hasOwnProperty('Error_Master')) {
        Error_Master = quotes.Error_Master;
    }

    $('#insurer_display').empty();
    if (Error_Master != null || Error_Master != "") {
        for (var i in res) {
            if (Error_Master.hasOwnProperty(res[i]['Error_Code'])) {
                var error_msg = Error_Master[res[i]['Error_Code']];
                var ins_name = arr_ins[res[i]['Insurer_Id']];
                $('#insurer_display').append("<tr>"
                                   + "<td>" + ins_name + "</td>"
                                   + "<td>" + error_msg + "</td>"
                                + "</tr>")
            }
        }
    }

});
$('.noInurerList_closebtn').click(function () {
    $('.noInsurer_list_popup').hide();
});
$(document).ready(function () {
    console.log("Loaded");
    stringparam();
    SetUrl();
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    var Request_Unique_Id = hashes[0].split('=')[1];
    SRN = Request_Unique_Id;
    if (hashes.length >= 2)
        clientid = parseInt(hashes[1].split('=')[1]);
    //Display_blocks();
    console.log(clientid);
    Get_Search_Summary(clientid);
    Get_Saved_Data();

    if (location.href.indexOf("www") > 0) {
        //max_calling_times = 2;
        //long_wait = 1;
        max_calling_times = 4; long_wait = 0; MaxCall = 3;
    }
    $('input').each(function () {
        $(this).attr('autocomplete', 'nope');
    });
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
    var data1 = { "search_reference_number": SRN };
    var obj_horizon_data = Horizon_Method_Convert("/quote/premium_summary", data1, "POST");
    $.ajax({
        //type: 'GET',
        //url: "Get_Search_Summary?SID=" + SRN + "&ClientID=" + clientid,
        type: "POST",
        data: JSON.stringify(obj_horizon_data['data']),
        url: obj_horizon_data['url'],
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (response) {
            //$("#LoaderImg").fadeIn();

            console.log("premium_summary() called ", response);
            var vehicle = response.Master.Vehicle;
            var request = response.Request;
            if (response.hasOwnProperty("Addon_Request") && response.Addon_Request != null && Object.keys(response.Addon_Request).length > 0) {
                var AddonPack = response.Addon_Request.addon_package;
                if (AddonPack != "" && AddonPack != undefined) {
                    $.each(AddonPack, function (i, value) {
                        var PlanDetails = i.split("_");
                        AddOnSelectedList.push(PlanDetails[1] + "_" + value);
                        //objPackage["insurer" + PlanDetails[0]] = PlanDetails[1];
                    });
                }
            }

            original_request = request;
            search_summary = response;
            var rto = response.Master.Rto;
            if (response.Master.Rto.VehicleCity_RTOCode != "") {
                var RTOCode = response.Master.Rto.VehicleCity_RTOCode;
                var RTOCode1 = RTOCode.slice(0, 2) + "-" + RTOCode.slice(2, 4);
            }
            ProductIdVal = request.product_id;
            //if (ProductIdVal == 12) { $("#TP").show(); $("#NonTP").hide(); }
            //else { $("#TP").hide(); $("#NonTP").show(); }

            if (request.first_name != null) { Name = request.first_name; } else { Name = "Customer"; }
            if (request.email != null) { EmailVal = request.email; }

            NEA = request.non_electrical_accessory;
            EA = request.electrical_accessory;
            EBV = request.external_bifuel_value;

            SSID = request.ss_id;
            //SSID = 1; //_Premium
            if (SSID > 0) { $("#SendPolicyDetails").show(); }

            //console.log(search_summary.Summary);
            //$('.twoWheelerImageHeader').append(' ' + response.Summary.PB_CRN);
            crn = response.Summary.PB_CRN == null ? 0 : response.Summary.PB_CRN;
            //$('#ContactName').text(response.Request.first_name);
            Name = request.first_name;
            $('#CustomerReferenceID').val(crn);
            $(".CRN").val(crn).text(crn);
            $('#Variant, .Variant, #Variant1').text(vehicle.Make_Name + " " + vehicle.Model_Name + " " + vehicle.Variant_Name);
            $('#RTOName, .RTOName').text(response.Master.Rto.RTO_City);

            if (request.channel == "DC" || request.vehicle_registration_type == "corporate") {
                $("#divOwnerDriverPersonalAccidentCover").hide();
            }

            // Personal Accident Cover For Owner Driver 02-01-2019
            $("#ODPAC").val(request.pa_owner_driver_si);
            if (request.pa_owner_driver_si == 0) {
                $("#divIsHavingValidDL").removeClass('hidden');
                $("#OwnerDriverPersonalAccidentCover").text("No").val("No"); $("#ODPAC1").attr('checked', true);
                //$(".ODPACDiv").hide();
                $("#ShowPACODMsg").show();
            }
            if (request.pa_owner_driver_si == 1500000) { $("#OwnerDriverPersonalAccidentCover").text("Yes").val("Yes"); $("#ODPAC2").attr('checked', true); }

            // Driving Licence
            if (request.is_having_valid_dl == "no") { $('#IsHavingValidDL').val("No").text("No"); $("#IsHavingValidDL1").attr('checked', true); }
            if (request.is_having_valid_dl == "yes") {
                $("#OwnerDriverPersonalAccidentCover").text("No").val("No"); $("#ODPAC1").attr('checked', true);
                $("#divIsHavingSCPA").removeClass('hidden');
                $("#IsHavingValidDL").val("Yes").text("Yes"); $("#IsHavingValidDL2").attr('checked', true);
            }

            //Standalone PA Cover
            if (request.is_opted_standalone_cpa == "no") {
                $("#IsHavingSCPA").text("No").val("No"); $("#IsHavingSCPA1").attr('checked', true);
            }
            if (request.is_opted_standalone_cpa == "yes") {
                $("#divIsHavingValidDL").removeClass('hidden');
                $("#ODPAC").val(0); $("#IsHavingSCPA").text("Yes").val("Yes"); $("#IsHavingSCPA2").attr('checked', true);
            }
            if (request.is_opted_standalone_cpa == "no" && request.is_having_valid_dl == "no") {
                if (request.pa_owner_driver_si == 1500000) {
                    $("#OwnerDriverPersonalAccidentCover").text("Yes").val("Yes"); $("#ODPAC2").attr('checked', true);
                    $("#divIsHavingValidDL").addClass('hidden');
                    $("#divIsHavingSCPA").addClass('hidden');
                }
            }
            if (request.is_opted_standalone_cpa == "yes" && request.is_having_valid_dl == "no") {
                if (request.pa_owner_driver_si == 1500000) {
                    $("#OwnerDriverPersonalAccidentCover").text("Yes").val("Yes"); $("#ODPAC2").attr('checked', true);
                    $("#divIsHavingValidDL").addClass('hidden');
                    $("#divIsHavingSCPA").addClass('hidden');
                }
                if (request.pa_owner_driver_si == 0) {
                    $("#OwnerDriverPersonalAccidentCover").text("No").val("No"); $("#ODPAC1").attr('checked', true);
                }
            }

            if ((request.is_opted_standalone_cpa == "no" && request.is_having_valid_dl == "yes") || (request.is_opted_standalone_cpa == "yes" && request.is_having_valid_dl == "yes")) {
                $("#divIsHavingValidDL").removeClass('hidden');
                $("#OwnerDriverPersonalAccidentCover").text("No").val("No"); $("#ODPAC1").attr('checked', true);
            }

            if (request.is_pa_od == undefined || request.is_pa_od == "yes") {
                CheckOwnerDriverPersonalAccidentCover('Yes');
            }
            if (request.is_pa_od == "no") {
                CheckOwnerDriverPersonalAccidentCover('No');
            }

            //Outstanding Loan cover
            if (request.is_oslc == "yes") {
                CheckLoanWaiver('Yes');
                $("#divOutstandingLoanCoverAmount").show();
                $("#OutstandingLoanCoverAmount").val(request.oslc_si);
            }
            else {
                CheckLoanWaiver('No');
                $("#divOutstandingLoanCoverAmount").hide();
                $("#OutstandingLoanCoverAmount").val(0);
            }
            if (request.is_financed == "yes") {
                IsVehicleFinanced = "yes";
            }
            else {
                IsVehicleFinanced = "no";
            }
            if (request.od_disc_perc) {
                if (request.od_disc_perc == 0) {
                    $("#ODDiscount").val(0);
                    $("#ODDiscountPercent").val(0);
                }
                else {
                    $("#ODDiscount").val(request.od_disc_perc);
                    $("#ODDiscountPercent").val(request.od_disc_perc);
                }
            }
            else {
                $("#ODDiscount").val(0);
                $("#ODDiscountPercent").val(0);
            }

            $("#divIsHavingValidDL").addClass('hidden');
            $("#divIsHavingSCPA").addClass('hidden');

            //For Commercial Vehicle

            if (request.imt23 == "no") { $("#IMT23Val").text("No").val("No"); $("#IMT23_1").attr('checked', true); $("#IMT23Val").attr("checked", false); }
            if (request.imt23 == "yes") { $("#IMT23Val").text("Yes").val("Yes"); $("#IMT23_2").attr('checked', true); $("#IMT23Val").attr("checked", true); }

            if (request.non_fairing_paying_passenger == "no") { $("#NonFairingPayingPassengerVal").text("No").val("No"); $("#NonFairingPayingPassengerVal1").attr('checked', true); $("#NonFairingPayingPassengerVal").attr("checked", false); }
            if (request.non_fairing_paying_passenger == "yes") { $("#NonFairingPayingPassengerVal").text("Yes").val("Yes"); $("#NonFairingPayingPassengerVal2").attr('checked', true); $("#NonFairingPayingPassengerVal").attr("checked", true); }

            if (request.fairing_paying_passenger == "no") { $("#FairingPayingPassengerVal").text("No").val("No"); $("#FairingPayingPassengerVal1").attr('checked', true); $("#FairingPayingPassengerVal").attr("checked", false); }
            if (request.fairing_paying_passenger == "yes") { $("#FairingPayingPassengerVal").text("Yes").val("Yes"); $("#FairingPayingPassengerVal2").attr('checked', true); $("#FairingPayingPassengerVal").attr("checked", true); }

            if (request.other_use == "no") { $("#OtherUseVal").text("No").val("No"); $("#OtherUse_1").attr('checked', true); $("#OtherUseVal").attr("checked", false); }
            if (request.other_use == "yes") { $("#OtherUseVal").text("Yes").val("Yes"); $("#OtherUse_2").attr('checked', true); $("#OtherUseVal").attr("checked", true); }

            if (request.own_premises == "no") { $("#OwnPremisesVal").text("No").val("No"); $("#OwnPremises_1").attr('checked', true); $("#OwnPremisesVal").attr("checked", false); }
            if (request.own_premises == "yes") { $("#OwnPremisesVal").text("Yes").val("Yes"); $("#OwnPremises_2").attr('checked', true); $("#OwnPremisesVal").attr("checked", true); }

            if (request.emp_pa == "no") { $("#PersonalAccidentCoverForEmployeeVal").text("No").val("No"); $("#PersonalAccidentCoverForEmployee_1").attr('checked', true); $("#PersonalAccidentCoverForEmployeeVal").attr("checked", false); }
            if (request.emp_pa == "yes") { $("#PersonalAccidentCoverForEmployeeVal").text("Yes").val("Yes"); $("#PersonalAccidentCoverForEmployee_2").attr('checked', true); $("#PersonalAccidentCoverForEmployeeVal").attr("checked", true); }

            if (request.conductor_ll == "no") { $("#Conductor_LlVal").text("No").val("No"); $("#Conductor_Ll_1").attr('checked', true); $("#Conductor_LlVal").attr("checked", false); }
            if (request.conductor_ll == "yes") { $("#Conductor_LlVal").text("Yes").val("Yes"); $("#Conductor_Ll_2").attr('checked', true); $("#Conductor_LlVal").attr("checked", true); }

            if (request.coolie_ll == "no") { $("#Coolie_LlVal").text("No").val("No"); $("#Coolie_Ll_1").attr('checked', true); $("#Coolie_LlVal").attr("checked", false); }
            if (request.coolie_ll == "yes") { $("#Coolie_LlVal").text("Yes").val("Yes"); $("#Coolie_Ll_2").attr('checked', true); $("#Coolie_LlVal").attr("checked", true); }

            if (request.cleaner_ll == "no") { $("#Cleaner_LlVal").text("No").val("No"); $("#Cleaner_Ll_1").attr('checked', true); $("#Cleaner_LlVal").attr("checked", false); }
            if (request.cleaner_ll == "yes") { $("#Cleaner_LlVal").text("Yes").val("Yes"); $("#Cleaner_Ll_2").attr('checked', true); $("#Cleaner_LlVal").attr("checked", true); }

            if (request.geographicalareaext == "no") { $("#GeographicalAreaExtVal").text("No").val("No"); $("#GeographicalAreaExt_1").attr('checked', true); $("#GeographicalAreaExtVal").attr("checked", false); }
            if (request.geographicalareaext == "yes") { $("#GeographicalAreaExtVal").text("Yes").val("Yes"); $("#GeographicalAreaExt_2").attr('checked', true); $("#GeographicalAreaExtVal").attr("checked", true); }

            if (request.additionaltowing == "no") { $("#AdditionalTowingVal").text("No").val("No"); $("#AdditionalTowing_1").attr('checked', true); $("#AdditionalTowingVal").attr("checked", false); }
            if (request.additionaltowing == "yes") { $("#AdditionalTowingVal").text("Yes").val("Yes"); $("#AdditionalTowing_2").attr('checked', true); $("#AdditionalTowingVal").attr("checked", true); }

            if (request.fibreglasstankfitted == "no") { $("#FibreGlassTankFittedVal").text("No").val("No"); $("#FibreGlassTankFitted_1").attr('checked', true); $("#FibreGlassTankFittedVal").attr("checked", false); }
            if (request.fibreglasstankfitted == "yes") { $("#FibreGlassTankFittedVal").text("Yes").val("Yes"); $("#FibreGlassTankFitted_2").attr('checked', true); $("#FibreGlassTankFittedVal").attr("checked", true); }
            //For Commercial Vehicle
            //PersonalAccidentCoverforDriver //Legal Liability to Paid Driver
            if (request.is_llpd == "no") { $("#PersonalAccidentCoverforDriver").text("No").val("No"); $("#PD1").attr('checked', true); $("#PersonalAccidentCoverforDriver").attr("checked", false); }
            if (request.is_llpd == "yes") { $("#PersonalAccidentCoverforDriver").text("Yes").val("Yes"); $("#PD2").attr('checked', true); $("#PersonalAccidentCoverforDriver").attr("checked", true); }

            //PaidDriverPersonalAccidentCover
            if (request.pa_paid_driver_si == "0") { $("#PaidDriverPersonalAccidentCover").text("No").val("No"); $("#PDPersonal1").attr('checked', true); $("#PaidDriverPersonalAccidentCover").attr("checked", false); }
            if (request.pa_paid_driver_si == "100000") { $("#PaidDriverPersonalAccidentCover").text("Yes").val("Yes"); $("#PDPersonal2").attr('checked', true); $("#PaidDriverPersonalAccidentCover").attr("checked", true); }

            // IsAntiTheftDevice
            if (request.is_antitheft_fit == "no") { $("#IsAntiTheftDevice").text("No").val("No"); $("#AntiTD1").attr('checked', true); $("#IsAntiTheftDevice").attr("checked", false); }
            if (request.is_antitheft_fit == "yes") { $("#IsAntiTheftDevice").text("Yes").val("Yes"); $("#AntiTD2").attr('checked', true); $("#IsAntiTheftDevice").attr("checked", true); }

            //MemberofAA
            if (request.is_aai_member == "no") { $("#MemberofAA").text("No").val("No"); $("#Association1").attr('checked', true); $("#MemberofAA").attr("checked", false); }
            if (request.is_aai_member == "yes") { $("#MemberofAA").text("Yes").val("Yes"); $("#Association2").attr('checked', true); $("#MemberofAA").attr("checked", true); }

            // TPPD  Made For TW On 5 Apr 2019 But Commented For Now 
            if (request.is_tppd != undefined) {
                if (request.is_tppd == "no") { $("#IsTPPD").text("No").val("No"); $("#IsTPPD1").prop('checked', true); }
                if (request.is_tppd == "yes") { $("#IsTPPD").text("Yes").val("Yes"); $("#IsTPPD2").prop('checked', true); }
            }

            $('#VoluntaryDeduction').val(request.voluntary_deductible > 0 ? request.voluntary_deductible : 0);
            $('#VoluntaryDeduction').text(request.voluntary_deductible > 0 ? request.voluntary_deductible : 0);
            if (request.voluntary_deductible > 0) { CheckVoluntary(request.voluntary_deductible); }
            else { CheckVoluntary(0); }
            if (request.product_id == 1 || request.product_id == 12) {
                switch (parseInt(request.voluntary_deductible)) {
                    case 0: $('#Voluntry1').attr('checked', true); break;
                    case 2500: $('#Voluntry2').attr('checked', true); break;
                    case 5000: $('#Voluntry3').attr('checked', true); break;
                    case 7500: $('#Voluntry4').attr('checked', true); break;
                    case 15000: $('#Voluntry5').attr('checked', true); break;
                }
            }
            if (request.product_id == 10) {
                switch (parseInt(request.voluntary_deductible)) {
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
            switch (parseInt(request.pa_unnamed_passenger_si)) {
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
            switch (parseInt(request.pa_named_passenger_si)) {
                case 0: $('#Named1').attr('checked', true); break;
                case 50000: $('#Named2').attr('checked', true); break;
                case 100000: $('#Named3').attr('checked', true); break;
                case 150000: $('#Named4').attr('checked', true); break;
                case 200000: $('#Named5').attr('checked', true); break;
            }

            $('#ElectricalAccessories').val(request.electrical_accessory);
            $('#NonElectricalAccessories').val(request.non_electrical_accessory);
            //$('#spinner').css("visibility", "visible");

            //For checking Cover Selected Or Not
            if (request.is_llpd == "yes" || request.pa_paid_driver_si > 0 || request.pa_named_passenger_si > 0 || request.pa_unnamed_passenger_si > 0 ||
                 request.electrical_accessory != 0 || request.non_electrical_accessory != 0 || request.imt23 == "yes" || request.other_use == "yes" ||
                request.emp_pa == "yes" || request.non_fairing_paying_passenger == "yes" || request.fairing_paying_passenger == "yes" || request.conductor_ll == "yes" ||
                request.coolie_ll == "yes" || request.cleaner_ll == "yes" || request.geographicalareaext == "yes" || request.additionaltowing == "yes" ||
                request.fibreglasstankfitted == "yes") {
                CoverCount = 1;
                //$(".trCover").removeClass('hidden');
            }
            //For checking Discount Selected Or Not
            if (request.is_antitheft_fit == "yes" || request.is_aai_member == "yes" || request.voluntary_deductible > 0 || request.own_premises == "yes") {
                DiscountCount = 1;
                //$(".trdiscount").removeClass('hidden');
            }

            //$('#expected_idv').val(request.vehicle_expected_idv);
            console.log("-------------Type: " + request.vehicle_insurance_type + " Product ID: " + request.product_id + "-------------");
            if (request.vehicle_insurance_type == "renew") {
                $('.idv_range').removeClass('hidden');
                $('.idv_slider').removeClass('hidden');
                $("#ZeroDepMsg").show();
            }
            //if (request.vehicle_insurance_type == "new" && request.product_id == 10) {
            //    $("#ExpectedIDV").attr("readonly", true);
            //}
            $('#expected_idv').attr("value", request.vehicle_expected_idv);
            $('#expected_idv').prev().text(request.vehicle_expected_idv);
            $('#expected_idv').prev().val(request.vehicle_expected_idv);
            $('#ExpectedIDV').val(request.vehicle_expected_idv);
            if (request.vehicle_expected_idv != undefined) { $('#ExpectedIDVVal').text("(" + request.vehicle_expected_idv + ")"); }
            if (request.registration_no != "") {
                var RegNo = request.registration_no.replace(new RegExp('-', 'gi'), "");
                $("#RegistrationNo").text(RegNo);

                if ((RegNo.indexOf("AA1234") > -1) || (RegNo.indexOf("ZZ9999") > -1)) {
                    $("#RegistrationNo").text(RTOCode); $("#divRegistrationNoDetails").hide();
                }
                else {
                    $("#divRegistrationNoDetails").show();
                    $("#RegistrationNoDetails").text(RegNo);
                }

                //if (!(request.registration_no.indexOf("-") > -1) || !(request.registration_no.indexOf("AA1234") > -1) || !(request.registration_no.indexOf("AA-1234") > -1)) { // Registration No Entered
                //    $("#divRegistrationNoDetails").show();
                //    $("#RegistrationNoDetails").text(request.registration_no);
                //}
                //else { $("#RegistrationNo").text(RTOCode); $("#divRegistrationNoDetails").hide(); }// No Registration No Entered

                //if (request.registration_no != "") {
                //    RegNo = request.registration_no.split("-");
                //    if ((RegNo[2] + "-" + RegNo[3] != "AA-1234") && (RegNo[2] + "-" + RegNo[3] != "ZZ-9999")) {
                //        RegNo = RegNo[0] + RegNo[1] + RegNo[2] + RegNo[3];
                //        $("#RegistrationNo").text(RegNo);
                //        $("#divRegistrationNoDetails").show();
                //        $("#RegistrationNoDetails").text(RegNo);
                //    }
                //    else { $("#RegistrationNo").text(RegNo[0] + "-" + RegNo[1]); $("#divRegistrationNoDetails").hide(); }
                //}
            }
            if (ProductIdVal == 12) {
                $("#divVehicleClass").show();
                request.own_premises == "yes" ? $("#OwnPremises").val('Yes') : $("#OwnPremises").val('No');
                request.cleaner_ll == "yes" ? $("#Cleaner_Ll").val('Yes') : $("#Cleaner_Ll").val('No');
                request.geographicalareaext == "yes" ? $("#GeographicalAreaExt").val('Yes') : $("#GeographicalAreaExt").val('No');
                request.additionaltowing == "yes" ? $("#AdditionalTowing").val('Yes') : $("#AdditionalTowing").val('No');
                request.fibreglasstankfitted == "yes" ? $("#FibreGlassTankFitted").val('Yes') : $("#FibreGlassTankFitted").val('No');
                if (request.vehicle_class == "gcv") {
                    $("#VehicleClass").text("GCV");
                    //For GCV Cover
                    request.imt23 == "yes" ? $("#IMT23").val('Yes') : $("#IMT23").val('No');
                    request.other_use == "yes" ? $("#OtherUse").val('Yes') : $("#OtherUse").val('No');
                    request.emp_pa == "yes" ? $("#PersonalAccidentCoverForEmployee").val('Yes') : $("#PersonalAccidentCoverForEmployee").val('No');
                    request.coolie_ll == "yes" ? $("#Coolie_Ll").val('Yes') : $("#Coolie_Ll").val('No');
                }
                else if (request.vehicle_class == "pcv") {
                    $("#VehicleClass").text("PCV");
                    //For PCV Cover
                    request.non_fairing_paying_passenger == "yes" ? $("#NonFairingPayingPassenger").val('Yes') : $("#NonFairingPayingPassenger").val('No');
                    request.fairing_paying_passenger == "yes" ? $("#FairingPayingPassenger").val('Yes') : $("#FairingPayingPassenger").val('No');
                    request.conductor_ll == "yes" ? $("#Conductor_Ll").val('Yes') : $("#Conductor_Ll").val('No');
                }
                else { $("#VehicleClass").text("MSC"); }

            }
            if (response.hasOwnProperty('Insurer_Details') && response.Insurer_Details != null) { Populate_Keybenefits(response.Insurer_Details); }
            //Get_Saved_Data();

            var Hrefval = "";
            if (ProductIdVal == 1) { Hrefval = "/car-insurance?SID=" + search_summary.Summary.Request_Unique_Id + "&ClientID=" + search_summary.Summary.Client_Id; }
            else if (ProductIdVal == 10) { Hrefval = "/two-wheeler-insurance?SID=" + search_summary.Summary.Request_Unique_Id + "&ClientID=" + search_summary.Summary.Client_Id; }
            else if (ProductIdVal == 12) { Hrefval = "/commercial-vehicle-insurance/commercial-vehicle-insurance.html?SID=" + search_summary.Summary.Request_Unique_Id + "&ClientID=" + search_summary.Summary.Client_Id; }

            //if (vehicle.Product_Id_New == 1) { Hrefval = "/car-insurance-gamma?SID=" + search_summary.Summary.Request_Unique_Id + "&ClientID=" + search_summary.Summary.Client_Id; }
            //else if (vehicle.Product_Id_New == 10) { Hrefval = "/two-wheeler-insurance-gamma?SID=" + search_summary.Summary.Request_Unique_Id + "&ClientID=" + search_summary.Summary.Client_Id; }

            $("#EditInfo").attr("href", Hrefval);
			$("#Edit_Info").attr("href", Hrefval);
			$("#VehicleNameDetails").text(vehicle.Description + " (" + vehicle.Vehicle_ID + ")");
            $("#FuelNameDetails").text(vehicle.Fuel_Name);
            if (request.external_bifuel_type == "cng") {
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

            if (request.vehicle_registration_date != "" || request.vehicle_registration_date != null) { $("#RegistrationDate").html(request.vehicle_registration_date); }
            else { $("#divRegistrationDate").hide(); }

            if (request.vehicle_manf_date != "" || request.vehicle_manf_date != null) { $("#ManufactureDate").html(request.vehicle_manf_date); }
            else { $("#divManufactureDate").hide(); }

            if (request.policy_expiry_date != "" && request.policy_expiry_date != null) { $("#PolicyExpiryDate").html(request.policy_expiry_date); }
            else { $("#divPolicyExpiryDate").hide(); }

            if ((request.vehicle_ncb_current != "" || request.vehicle_ncb_current != null) && request.vehicle_ncb_current != 0) { $("#PrevNCB").html(request.vehicle_ncb_current + "%"); }
            else { $("#divPrevNCB").hide(); }

            if (request.is_claim_exists == "yes") { $("#ClaimYesNo").html("Yes"); $("#divPrevNCB").hide(); }
            if (request.is_claim_exists == "no") { $("#ClaimYesNo").html("No"); $("#divPrevNCB").show(); $("#PrevNCB").html(request.vehicle_ncb_current + "%"); }

            if (request.vehicle_registration_type == "corporate") { $("#VehicleInsType").html("Company"); }
            else { $("#VehicleInsType").html("Individual"); }

            var PrevInsName = GetPrevIns(request.prev_insurer_id);
            if (request.prev_insurer_id != "" && request.prev_insurer_id != null) { $("#PrevInsurer").html(PrevInsName); }
            else { $("#divPrevInsurer").hide(); }

        },
        error: function (response) { alert('Error in Premium Summary'); }
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
var html_addon_bundle = $('#BundleEdit').html();
var html_addon_bundle_Plan = $('.addons').html();
var html_addon_bundle_Plan_details = $('.BundleAddonDisplay').html();
var insurerData = $("#DisplayInsurerData").html();
var PremiumBlock = $(".PremiumCompareColumn").html();
var html_premcompare_addon = $('#PremCompareAddons').html();
var html_PremCompareAddonsIns = $(".PremCompareAddonsIns").html();

var original_request = "";

function Get_Saved_Data() {
    var data1 = { "search_reference_number": SRN };
    var obj_horizon_data = Horizon_Method_Convert("/quote/premium_list_db", data1, "POST");
    $.ajax({
        type: "POST",
        data: JSON.stringify(obj_horizon_data['data']),
        url: obj_horizon_data['url'],
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (max_calling_times > 0) {
                //var res = $.parseJSON(response);
                //Get_Details(res, clientid);
                quotes = response;
                response_handler();
            }
            else { //console.log("Quotes no available for selected Criteria");
            }
        },
        error: function (response) { }
    });

    return false;

    //Previous Code For Saving Data
    $.get("Get_Saved_Quotes?SID=" + SRN + "&ClientID=" + clientid,
    function (response) {
        if (max_calling_times > 0) {
            var res = $.parseJSON(response);
            //Get_Details(res, clientid);
            quotes = res;
            response_handler();
        }
        else { //console.log("Quotes no available for selected Criteria");
        }
    });
}
function AddonBlock(res) {
    Response_Global = res;
    var Summary = res.Summary;
    var AddonRequest = Summary.Addon_Request;
    if (AddonRequest != null) {
        var AddonPack = AddonRequest.addon_package;
        var AddonStandalone = AddonRequest.addon_standalone;
        if (AddonPack != "" && AddonPack != undefined) {
            $.each(AddonPack, function (i, value) {
                var PlanDetails = i.split("_");
                AddOnSelectedList.push(PlanDetails[1] + "_" + value);
            });
        }
        if (AddonStandalone != "" && AddonStandalone != undefined) {
            $.each(AddonStandalone, function (i, value) {
                if (value == "yes") { $('#' + i).attr("checked", "true"); }
                //$('#' + i).click();
            });
        }
    }
}
function Get_Details(response, clientid) {
    console.log("Get_Details() Called");
    console.log(response);
    Response_Global = response;
    var Summary = response.Summary;
    var Req_Core = Summary.Request_Core;
    var Req_Prod = Summary.Request_Product;
    var AddonRequest = Summary.Addon_Request;
    //var vehicle = response.Master.Vehicle;
    //var request = response.Request;
    //original_request = request;
    //search_summary = response;
    //var rto = response.Master.Rto;
    if (AddonRequest != null) {
        var AddonPack = AddonRequest.addon_package;
        if (AddonPack != "") {
            $.each(AddonPack, function (i, value) {
                var PlanDetails = i.split("_");
                AddOnSelectedList.push(PlanDetails[1] + "_" + value);
            });
        }
    }
    ProductIdVal = Req_Core.product_id;
    if (Req_Core.first_name != null) { Name = Req_Core.first_name; } else { Name = "Customer"; }
    if (Req_Core.email != null) { EmailVal = Req_Core.email; }

    NEA = Req_Core.non_electrical_accessory;
    EA = Req_Core.electrical_accessory;
    EBV = Req_Core.external_bifuel_value;

    SSID = Req_Core.ss_id;
    if (SSID > 0) { $("#SendPolicyDetails").show(); }

    //$('.twoWheelerImageHeader').append(' ' + Summary.PB_CRN);
    crn = Summary.PB_CRN == null ? 0 : Summary.PB_CRN;
    //Name = request.first_name;
    $('#CustomerReferenceID').val(crn);
    $(".CRN").val(crn).text(crn);
    ////$('#Variant').text(vehicle.Make_Name + " " + vehicle.Model_Name + " " + vehicle.Variant_Name);
    ////$('#Variant1').text(vehicle.Make_Name + " " + vehicle.Model_Name + " " + vehicle.Variant_Name);
    ////$('#RTOName').text(response.Master.Rto.RTO_City);

    //PersonalAccidentCoverforDriver //Legal Liability to Paid Driver
    if (Req_Core.is_llpd == "no") { $("#PersonalAccidentCoverforDriver").text("No").val("No"); $("#PD1").attr('checked', true); $("#PersonalAccidentCoverforDriver").attr("checked", false); }
    if (Req_Core.is_llpd == "yes") { $("#PersonalAccidentCoverforDriver").text("Yes").val("Yes"); $("#PD2").attr('checked', true); $("#PersonalAccidentCoverforDriver").attr("checked", true); }

    //PaidDriverPersonalAccidentCover
    if (Req_Core.pa_paid_driver_si == "0") { $("#PaidDriverPersonalAccidentCover").text("No").val("No"); $("#PDPersonal1").attr('checked', true); $("#PaidDriverPersonalAccidentCover").attr("checked", false); }
    if (Req_Core.pa_paid_driver_si == "100000") { $("#PaidDriverPersonalAccidentCover").text("Yes").val("Yes"); $("#PDPersonal2").attr('checked', true); $("#PaidDriverPersonalAccidentCover").attr("checked", true); }

    // IsAntiTheftDevice
    if (Req_Core.is_antitheft_fit == "no") { $("#IsAntiTheftDevice").text("No").val("No"); $("#AntiTD1").attr('checked', true); $("#IsAntiTheftDevice").attr("checked", false); }
    if (Req_Core.is_antitheft_fit == "yes") { $("#IsAntiTheftDevice").text("Yes").val("Yes"); $("#AntiTD2").attr('checked', true); $("#IsAntiTheftDevice").attr("checked", true); }

    //MemberofAA
    if (Req_Core.is_aai_member == "no") { $("#MemberofAA").text("No").val("No"); $("#Association1").attr('checked', true); $("#MemberofAA").attr("checked", false); }
    if (Req_Core.is_aai_member == "yes") { $("#MemberofAA").text("Yes").val("Yes"); $("#Association2").attr('checked', true); $("#MemberofAA").attr("checked", true); }

    $('#VoluntaryDeduction').val(Req_Core.voluntary_deductible > 0 ? Req_Core.voluntary_deductible : 0);
    $('#VoluntaryDeduction').text(Req_Core.voluntary_deductible > 0 ? Req_Core.voluntary_deductible : 0);
    if (Req_Core.voluntary_deductible > 0) { CheckVoluntary(Req_Core.voluntary_deductible); }
    else { CheckVoluntary(0); }

    if (ProductIdVal == 1 || ProductIdVal == 12) {
        switch (Req_Core.voluntary_deductible) {
            case 0: $('#Voluntry1').attr('checked', true); break;
            case 2500: $('#Voluntry2').attr('checked', true); break;
            case 5000: $('#Voluntry3').attr('checked', true); break;
            case 7500: $('#Voluntry4').attr('checked', true); break;
            case 15000: $('#Voluntry5').attr('checked', true); break;
        }
    }
    if (ProductIdVal == 10) {
        switch (Req_Core.voluntary_deductible) {
            case 0: $('#Voluntry1').attr('checked', true); break;
            case 500: $('#Voluntry2').attr('checked', true); break;
            case 750: $('#Voluntry3').attr('checked', true); break;
            case 1000: $('#Voluntry4').attr('checked', true); break;
            case 1500: $('#Voluntry5').attr('checked', true); break;
            case 3000: $('#Voluntry6').attr('checked', true); break;
        }
    }

    $('#PersonalCoverPassenger').val(Req_Core.pa_unnamed_passenger_si > 0 ? Req_Core.pa_unnamed_passenger_si : 0);
    $('#PersonalCoverPassenger').text(Req_Core.pa_unnamed_passenger_si > 0 ? Req_Core.pa_unnamed_passenger_si : 0);
    if (Req_Core.pa_unnamed_passenger_si > 0) { CheckUnnamedPassenger(Req_Core.pa_unnamed_passenger_si); }
    else { CheckUnnamedPassenger(0); }
    switch (Req_Core.pa_unnamed_passenger_si) {
        case 0: $('#Un-Named1').attr('checked', true); break;
        case 50000: $('#Un-Named2').attr('checked', true); break;
        case 100000: $('#Un-Named3').attr('checked', true); break;
        case 150000: $('#Un-Named4').attr('checked', true); break;
        case 200000: $('#Un-Named5').attr('checked', true); break;
    }

    $('#NamedPersonalAccidentCover').val(Req_Core.pa_named_passenger_si > 0 ? Req_Core.pa_named_passenger_si : 0);
    $('#NamedPersonalAccidentCover').text(Req_Core.pa_named_passenger_si > 0 ? Req_Core.pa_named_passenger_si : 0);
    if (Req_Core.pa_named_passenger_si > 0) { CheckNamedPassenger(Req_Core.pa_named_passenger_si); }
    else { CheckNamedPassenger(0); }
    switch (Req_Core.pa_named_passenger_si) {
        case 0: $('#Named1').attr('checked', true); break;
        case 50000: $('#Named2').attr('checked', true); break;
        case 100000: $('#Named3').attr('checked', true); break;
        case 150000: $('#Named4').attr('checked', true); break;
        case 200000: $('#Named5').attr('checked', true); break;
    }

    $('#ElectricalAccessories').val(Req_Core.electrical_accessory);
    $('#NonElectricalAccessories').val(Req_Core.non_electrical_accessory);
    //$('#spinner').css("visibility", "visible");
    //For checking Cover Selected Or Not
    if (Req_Core.is_llpd == "yes" || Req_Core.pa_paid_driver_si > 0 || Req_Core.pa_named_passenger_si > 0 || Req_Core.pa_unnamed_passenger_si > 0 ||
         Req_Core.electrical_accessory != 0 || Req_Core.non_electrical_accessory != 0 || request.imt23 == "yes" || request.other_use == "yes" ||
                request.emp_pa == "yes" || request.non_fairing_paying_passenger == "yes" || request.fairing_paying_passenger == "yes" || request.conductor_ll == "yes" ||
                request.coolie_ll == "yes" || request.cleaner_ll == "yes" || request.geographicalareaext == "yes" || request.additionaltowing == "yes" ||
        request.fibreglasstankfitted == "yes") {
        CoverCount = 1;
    }
    //For checking Discount Selected Or Not
    if (Req_Core.is_antitheft_fit == "yes" || Req_Core.is_aai_member == "yes" || Req_Core.voluntary_deductible > 0 || request.own_premises == "yes") {
        DiscountCount = 1;
    }

    console.log("-------------Type: " + Req_Core.vehicle_insurance_type + " Product ID: " + Req_Core.product_id + "-------------");
    if (Req_Core.vehicle_insurance_type == "renew") {
        $('.idv_range').removeClass('hidden');
        $('.idv_slider').removeClass('hidden');
    }
    //if (request.vehicle_insurance_type == "new" && request.product_id == 10) {
    //    $("#ExpectedIDV").attr("readonly", true);
    //}
    $('#expected_idv').attr("value", Req_Core.vehicle_expected_idv);
    $('#expected_idv').prev().text(Req_Core.vehicle_expected_idv);
    $('#expected_idv').prev().val(Req_Core.vehicle_expected_idv);
    $('#ExpectedIDV').val(Req_Core.vehicle_expected_idv);
    $('#ExpectedIDVVal').text("(" + Req_Core.vehicle_expected_idv + ")");
    if (Req_Core.registration_no != "") {
        RegNo = Req_Core.registration_no.split("-");
        if ((RegNo[2] + "-" + RegNo[3] != "AA-1234") && (RegNo[2] + "-" + RegNo[3] != "ZZ-9999")) {
            RegNo = RegNo[0] + RegNo[1] + RegNo[2] + RegNo[3];
            $("#RegistrationNo").text(RegNo);
            $("#divRegistrationNoDetails").show();
            $("#RegistrationNoDetails").text(RegNo);
        }
        else { $("#RegistrationNo").text(RegNo[0] + "-" + RegNo[1]); $("#divRegistrationNoDetails").hide(); }
    }

    if (response.hasOwnProperty('Insurer_Details') && response.Insurer_Details != null) { Populate_Keybenefits(response.Insurer_Details); }
    //Get_Saved_Data();

    var Hrefval = "";
    if (ProductIdVal == 1) { Hrefval = "/car-insurance?SID=" + Summary.Request_Unique_Id + "&ClientID=" + Summary.Client_Id; }
    else if (ProductIdVal == 10) { Hrefval = "/two-wheeler-insurance?SID=" + Summary.Request_Unique_Id + "&ClientID=" + Summary.Client_Id; }

    $("#EditInfo").attr("href", Hrefval);
	$("#Edit_Info").attr("href", Hrefval);
	////$("#VehicleNameDetails").text(vehicle.Description + " (" + vehicle.Vehicle_ID + ")");
    ////$("#FuelNameDetails").text(vehicle.Fuel_Name);
    ////if (request.external_bifuel_type == "cng") {
    ////    $("#FuelNameDetails").text(vehicle.Fuel_Name + "(" + "EXTERNAL FITTED CNG" + ")");
    ////}
    ////if (request.external_bifuel_type == "lpg") {
    ////    $("#FuelNameDetails").text(vehicle.Fuel_Name + "(" + "EXTERNAL FITTED LPG" + ")");
    ////}

    ////if (request.external_bifuel_value > 0) { $("#ExternalBifuelVal").html(request.external_bifuel_value); }
    ////else { $("#divExternalBifuelVal").hide(); }

    ////$("#RTODetails").text(rto.RTO_City + ", " + rto.State_Name + " (" + response.Master.Rto.VehicleCity_Id + ")");
    var Name = "";
    if (Req_Core.first_name != "" && checkTextWithSpace(Req_Core.first_name)) {
        Name = Req_Core.first_name + " ";
        if (Req_Core.middle_name != "" && checkTextWithSpace(Req_Core.middle_name)) {
            Name = Name + Req_Core.middle_name + " ";
        }
        if (Req_Core.last_name != "" && checkTextWithSpace(Req_Core.last_name)) {
            Name = Name + Req_Core.last_name;
        }
    }
    else { $("#divNameDetails").hide(); }

    $("#NameDetails").text(Name);
    if (Req_Core.mobile != "" && Req_Core.mobile != null) {
        $("#MobileDetails").text(Req_Core.mobile);
        if (Req_Core.mobile == "9999999999") {
            $("#MobileDetails").text("NA");
        }
    } else { $("#divMobileDetails").hide(); }
    if (Req_Core.email != "" && Req_Core.email != null) {
        $("#EmailDetails").text(Req_Core.email);
        if ((Req_Core.email).indexOf('@testpb.com') > 1) {
            $("#EmailDetails").text("NA");
        }
    } else { $("#divEmailDetails").hide(); }

    if (Req_Core.vehicle_insurance_type == "new") { $("#RegistrationTypeDetails").text("New"); }
    else { $("#RegistrationTypeDetails").text("Renew"); }

    //For TP Plan Implementation
    VehInsSubType = Req_Core.vehicle_insurance_subtype;
    $("#VehicleInsuranceSubtype").val(VehInsSubType);
    console.log("VehInsSubType: ", VehInsSubType);

    $("#RegistrationSubTypeDetails").html(ShowVehInsSubType(VehInsSubType));

    if (Req_Core.vehicle_registration_date != "" || Req_Core.vehicle_registration_date != null) { $("#RegistrationDate").html(Req_Core.vehicle_registration_date); }
    else { $("#divRegistrationDate").hide(); }

    if (Req_Core.vehicle_manf_date != "" || Req_Core.vehicle_manf_date != null) { $("#ManufactureDate").html(Req_Core.vehicle_manf_date); }
    else { $("#divManufactureDate").hide(); }

    if (Req_Core.policy_expiry_date != "" && Req_Core.policy_expiry_date != null) { $("#PolicyExpiryDate").html(Req_Core.policy_expiry_date); }
    else { $("#divPolicyExpiryDate").hide(); }

    if ((Req_Core.vehicle_ncb_current != "" || Req_Core.vehicle_ncb_current != null) && Req_Core.vehicle_ncb_current != 0) { $("#PrevNCB").html(Req_Core.vehicle_ncb_current + "%"); }
    else { $("#divPrevNCB").hide(); }

    if (Req_Core.is_claim_exists != "no") { $("#ClaimYesNo").html("Yes"); $("#divPrevNCB").hide(); }
    if (Req_Core.is_claim_exists != "yes") { $("#ClaimYesNo").html("No"); $("#divPrevNCB").show(); }

    if (Req_Core.vehicle_registration_type == "corporate") { $("#VehicleInsType").html("Company"); }
    else { $("#VehicleInsType").html("Individual"); }

    var PrevInsName = GetPrevIns(Req_Core.prev_insurer_id);
    if (Req_Core.prev_insurer_id != "" && Req_Core.prev_insurer_id != null) { $("#PrevInsurer").html(PrevInsName); }
    else { $("#divPrevInsurer").hide(); }

}

function response_handler() {

    console.log('premium_list_db', quotes);
    if (quotes.Summary.Status == "complete") {
        append_quotes(); //delete_block(); 
        hide_spinner();
        $("#LoaderImg").fadeOut();
    } else if (["TRANS_SUCCESS_WO_POLICY", "TRANS_SUCCESS_WITH_POLICY", "ALREADY_CLOSED", "TRANS_PAYPASS"].indexOf(quotes.Summary.Last_Status) > -1) {
        $.alert("Transaction Already Closed. Please make a new search and proceed dsfsdf!");
        hide_spinner();
        $("#LoaderImg").fadeOut();
        window.location.href = ('/');
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
    $(".BasicMD").hide();
}
function prepend_quotes() {
    // for loop to add premiums through jquery...finally hahaha....i know
    var insurer_count = 0;
    if (crn <= 0) {
        $('.twoWheelerImageHeader').append(' ' + quotes.Summary.PB_CRN);
        crn = quotes.Summary.PB_CRN;
        $('#CustomerReferenceID').val(crn);
        $(".CRN").val(crn).text(crn);
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
        $('#ExpectedIDVMax').html(request.Idv_Max).val(request.Idv_Max);

    }

    if (insurer_count > 0) {
        //Addon filter
        var common_addon_list = quotes.Summary.Common_Addon;
        $('#Addons').empty();
        if (Object.keys(quotes.Summary.Common_Addon).length > 0) { // Checking Whether Addons Present Or Not (with Count)
            AddOnCount = 0;
            //populate common addon
            $.each(common_addon_list, function (index, value) {
                IsAddonPresent = true;
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
            IsAddonPresent = false;
            $("#Standaloneedit").html('<div style="margin: 10px;text-align: center;">No Addons Available</div>');
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

$('#lblHaveNCBCertificate-Yes').click(function () {
    is_claim_exist = "yes";
    vehicle_ncb_current = "0";
    $(".ErrormesgDiv").hide().html("Please Select Claim on Last Year Policy? Yes or No");
})
$('#lblHaveNCBCertificate-No').click(function () {
    is_claim_exist = "no";
    vehicle_ncb_current = $("#NoClaimBonusPercent").val();//NoClaimBonusPercent1
    $(".ErrormesgDiv").hide().html("Please Select Claim on Last Year Policy? Yes or No");
})

$('#onclick_calprm').click(function () {
    if (!$('#lblHaveNCBCertificate-No').hasClass("Active_click") && !$('#lblHaveNCBCertificate-Yes').hasClass("Active_click")) {
        $(".ErrormesgDiv").show().html("Please Select Claim on Last Year Policy? Yes or No");
    }
    else {
        $(".ErrormesgDiv").hide().html("Please Select Claim on Last Year Policy? Yes or No");
        var vehicle_insurance_subtype = "";
        var quote_udid = $("#renewquote_udid").val();
        if (productid === "10") {
            vehicle_insurance_subtype = $("#selectPlantw").val();////selectPlancar
        } else {
            vehicle_insurance_subtype = $("#selectPlancar").val();
        }
        console.log('vehicle_insurance_subtype - ' + vehicle_insurance_subtype + '; is_claim_exist-' + is_claim_exist + ';  vehicle_ncb_current-' + vehicle_ncb_current);
        $('.ConfDetPopup').hide();
        $('#QuoteLoader').show();
		if (renewalType === "renewal") {
            var obj_horizon_data_renew = Horizon_Method_Convert("/renewal_quotes/premium_initiate/" + productid + "/" + quote_udid + "/" + vehicle_insurance_subtype + "/" + is_claim_exist + "/" + vehicle_ncb_current, '', "GET");
            if (quote_udid !== "" && vehicle_insurance_subtype !== "" && is_claim_exist !== "" && vehicle_ncb_current !== "") {
                $.ajax({
                    type: "GET",
                    url: obj_horizon_data_renew['url'],
                    dataType: "json",
                    success: function (data) {
                        console.log(data);
                        if (data.hasOwnProperty('Summary') && data.Summary.hasOwnProperty('Request_Unique_Id')) {
                            $('#QuoteLoader').show();
                            var SRN = data.Summary.Request_Unique_Id;
                            if (productid === "10") {
                                window.location.href = "/two-wheeler-insurance/quotes?SID=" + SRN + "&ClientID=" + clientid;
                            }
                            else {
                                window.location.href = "/car-insurance/quotes?SID=" + SRN + "&ClientID=" + clientid;
                            }
                        } else {
                            console.log(data);
                            $('#QuoteLoader').hide();
                            $.alert("Oops. Something went wrong. Please try again later.");
                        }

                    },
                    error: function (result) {
                        console.log(result)
                        $.alert("Oops. Something went wrong. Please try again later.");
                    }
                });
            }
        } else {
        var obj_horizon_data = Horizon_Method_Convert("/motor_camp_base_model/premium_initiate/" + productid + "/" + quote_udid + "/" + vehicle_insurance_subtype + "/" + is_claim_exist + "/" + vehicle_ncb_current, '', "GET");
        if (quote_udid !== "" && vehicle_insurance_subtype !== "" && is_claim_exist !== "" && vehicle_ncb_current !== "") {
            $.ajax({
                type: "GET",
                url: obj_horizon_data['url'],
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if (data.hasOwnProperty('Summary') && data.Summary.hasOwnProperty('Request_Unique_Id')) {
                        $('#QuoteLoader').show();
                        var SRN = data.Summary.Request_Unique_Id;
                        if (productid === "10") {
                            window.location.href = "/two-wheeler-insurance/quotes?SID=" + SRN + "&ClientID=" + clientid;
                        }
                        else {
                            window.location.href = "/car-insurance/quotes?SID=" + SRN + "&ClientID=" + clientid;
                        }
                    }else{
                        console.log(data);
                        $('#QuoteLoader').hide();
                        $.alert("Oops. Something went wrong. Please try again later.");
                    }

                },
                error: function (result) {
                    console.log(result)
                    $.alert("Oops. Something went wrong. Please try again later.");
                }
            });
        }
    }
	}
}) 
function append_quotes() {

    var insurer_count = 0;
    if (crn <= 0 || crn != "") {
        //$('.twoWheelerImageHeader').append(' ' + quotes.Summary.PB_CRN);
        crn = quotes.Summary.PB_CRN;
        if (quotes.Summary.PB_CRN == "") {
            crn = quotes.Summary.Request_Core.crn;
        }
        $('#CustomerReferenceID').val(crn);
        $(".CRN").val(crn).text(crn);
    }

    $(".quoteboxparent").empty();
    for (var i = 0; i < quotes.Response.length ; i++) {

        if (quotes.Response[i].Error_Code == '') {
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
        //request.Request_Core['quote_mode'] = "prefetch";
        var IsLERPRenewal = false;
        var IsPreFetch = false;
        var IsLERPFresh = false;
        if (request.Request_Core.hasOwnProperty('utm_source')) {
            if (request.Request_Core.utm_source == "LERP_Renewal") {
                IsLERPRenewal = true;
            }
        }
        if ( IsLERPRenewal === false)
        {
            if (request.Request_Core.hasOwnProperty('quote_mode') && request.Request_Core['quote_mode'] === "prefetch") {
                IsPreFetch = true;
            }
            if (getUrlVars()["utm_source"] && getUrlVars()["utm_campaign"]) {
                if (getUrlVars()["utm_source"] === "LERP_FRESH" && getUrlVars()["utm_campaign"] === "Fresh_Quotes") {
                    IsLERPFresh = true;
                }
            }
            if (IsPreFetch || IsLERPFresh) {
                $('.quote-buynow').removeAttr("href");
                $('.buy_now1').removeAttr("href");
                $('.quote-buynow').removeAttr("onclick");
                $('.buy_now1').removeAttr("onclick");
                $(".quote-buynow").attr("onclick", "$('.LoadPopup').show()");
                $('.buy_now1').attr("onclick", "$('.LoadPopup').show()");
            }
        }
        $('#expected_idv').attr('min', request.Idv_Min);
        $('#expected_idv').attr('max', request.Idv_Max);
        $('#expected_idv').prev().attr('min', request.Idv_Min);
        $('#expected_idv').prev().attr('max', request.Idv_Max);
        $($('#expected_idv').next().children()[0]).html(rupee_format(request.Idv_Min));
        $($('#expected_idv').next().children()[1]).html(rupee_format(request.Idv_Max));
        $('#ExpectedIDVMin').html(request.Idv_Min).val(request.Idv_Min);
        $('#ExpectedIDVMax').html(request.Idv_Max).val(request.Idv_Max);
        //$("#LoaderImg").fadeOut('slow');
    }
    console.log("Insurer Count : ", insurer_count);

    //Adding Insurer Id To List
    if (quotes.Response.length > 0) {
        InsList = [];
        $.each(quotes.Response, function (index, value) {
            if (value.Error_Code == "") {
                var InsID = value.Insurer.Insurer_ID;
                InsList.push(InsID);
            }
        })
    }

    if (insurer_count > 0) {
        //Addon filter
        Global_addon_list = quotes.Summary.Common_Addon;
        var common_addon_list = quotes.Summary.Common_Addon;
        VehInsSubType = quotes.Summary.Request_Core.vehicle_insurance_subtype;
        VehicleClass = quotes.Summary.Request_Core.vehicle_class;

        $('#Addons').empty();
        $('#PremCompareAddons').empty();
        if (Object.keys(quotes.Summary.Common_Addon).length > 0) { // Checking Whether Addons Present Or Not (with Count)
            var AddOnCount = 0;
            $('.PremCompareAddonsIns').html("");
            AddonSection = "";
            $("#AddonSection").html("");
            //populate common addon
            $.each(common_addon_list, function (index, value) {
                IsAddonPresent = true;
                addon = html_addon;
                addon = addon.replace(new RegExp('___Common_Addon___', 'gi'), index);
                //addon = addon.replace('___Common_Addon_Name___', addon_list[index]);//12-02-2018
                addon = addon.replace('___Common_Addon_Name___', addon_list[index] + '(' + addon_shortlist[index] + ')');
                if (value.min == value.max) { addon = addon.replace('___addon_range___', 'Upto &#8377; ' + Math.round(value.min)); }
                else { addon = addon.replace('___addon_range___', '&#8377; ' + Math.round(value.min) + ' - &#8377; ' + Math.round(value.max)); }

                $('#Addons').append(addon);
                AddOnCount++;
                if (AddOnCount < 2) { $("#selectall").hide(); }
                else { $("#selectall").show(); $(".chkAddons").show(); }

                //Addon For Premium Compare
                //Part - I
                premcompareaddon = html_premcompare_addon;
                if (premcompareaddon != undefined) {
                    premcompareaddon = premcompareaddon.replace(new RegExp('___Common_Addon___', 'gi'), index);
                    //premcompareaddon = premcompareaddon.replace('___Common_Addon_Name___', addon_list[index] + '(' + addon_shortlist[index] + ')');
                    premcompareaddon = premcompareaddon.replace('___Common_Addon_FullName___', addon_list[index]);
                    premcompareaddon = premcompareaddon.replace('___Common_Addon_ShortName___', addon_shortlist[index]);

                    if (value.min == value.max) { premcompareaddon = premcompareaddon.replace('___addon_range___', 'Upto &#8377; ' + Math.round(value.min)); }
                    else { premcompareaddon = premcompareaddon.replace('___addon_range___', '&#8377; ' + Math.round(value.min) + ' - &#8377; ' + Math.round(value.max)); }
                    $('#PremCompareAddons').append(premcompareaddon);

                    //For Dynamic Displaying Addons To Insurers
                    html_PremCompareAddonsIns1 = html_PremCompareAddonsIns
                    html_PremCompareAddonsIns1 = html_PremCompareAddonsIns1.replace('___AddonApplied___', addon_list[index]);
                    $('.PremCompareAddonsIns').append(html_PremCompareAddonsIns1);
                }

                //Part - II

                var AddonName = (addon_list[index]).replace(new RegExp(" ", 'gi'), "_");

                $("#AddonSection").append('<div class="fieldv sub QC_' + index + '" id="QC' + AddonName + '"><span>' + addon_list[index] + '</span></div>');

                for (var ins = 0; ins < InsList.length; ins++) {
                    var InsID = InsList[ins];
                    //$("#QC" + AddonName).append('<span id="QC' + AddonName + "_" + InsID + '"> - </span>');
                    $("#QC" + AddonName).append('<span class="AddonSection_' + InsID + '" id="QC' + AddonName + "_" + InsID + '"> - </span>');
                }

            });
            AddonSection = $("#AddonSection").html();
            html_PremCompareAddonsIns = $('.PremCompareAddonsIns').html();
            $("#Addons").removeClass('hidden');
        }
        else {
            $(".chkAddons").hide();
            IsAddonPresent = false;
            $("#Standaloneedit").html('<div style="margin: 10px;text-align: center;">No Addons Available</div>');
        }

        // check uncheck based on previous search //Object.keys(quotes.Summary.Addon_Request).length > 0
        if (quotes.Summary.hasOwnProperty("Addon_Request") && quotes.Summary.Addon_Request != null && (Object.keys(quotes.Summary.Addon_Request).length > 0)) {
            if (Object.keys(quotes.Summary.Common_Addon).length <= 0) {
                $('#Addons').html("No Addons Available").css("text-align", "center");
            }

            // check uncheck based on previous search For Bundle And Standalone addons
            if (quotes.Summary.Addon_Request.hasOwnProperty("addon_standalone")) {
                if (Object.keys(quotes.Summary.Addon_Request.addon_standalone).length > 0) {
                    $.each(quotes.Summary.Addon_Request.addon_standalone, function (index, value) {
                        if (value == "yes") { $('#' + index).click(); }
                    });
                }
            }
            else { // check uncheck based on previous search For Only Standalone addons
                if (Object.keys(quotes.Summary.Addon_Request).length > 0) {
                    $.each(quotes.Summary.Addon_Request, function (index, value) {
                        if (value == "yes") { $('#' + index).click(); }
                    });
                }
            }
        }
        handle_addon_addition();
        if (getUrlVars()["utm_source"] && request.Request_Core.lead_type) {
        if (getUrlVars()["utm_source"] === "LERP_Renewal")
        {
            if (request.Request_Core.product_id) {
                if (request.Request_Core.product_id === 10) {
                    $('#renewquote_subtype_tw').show();
                } else {
                    $('#renewquote_subtype_car').show();
                }
                $('#renewquote_udid').val(SRN.split('_')[1]);
                $('#renewquote_sub_type').val(VehInsSubType);
                $('.ConfDetPopup').show();
            }
        }
    }
	 if (request.Request_Core.lead_type == "renewal") {
            renewalType = "renewal";
            if (request.Request_Core.product_id) {
                if (request.Request_Core.product_id === 10) {
                    $('#renewquote_subtype_tw').show();
                } else {
                    $('#renewquote_subtype_car').show();
                }
                $('#renewquote_udid').val(SRN.split('_')[1]);
                $('#renewquote_sub_type').val(VehInsSubType);
                $('.ConfDetPopup').show();
            }
        }
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

    //For TP Plan Implementation
    VehInsSubType = quotes.Summary.Request_Core.vehicle_insurance_subtype;
    VehicleClass = quotes.Summary.Request_Core.vehicle_class;
    $("#VehicleInsuranceSubtype").val(VehInsSubType);
    console.log("VehInsSubType: ", VehInsSubType);
    $("#RegistrationSubTypeDetails").html(ShowVehInsSubType(VehInsSubType));
    if (ProductIdVal == null || ProductIdVal == undefined) {
        ProductIdVal = quotes.Summary.Request_Core.product_id;
    }

    if (VehInsSubType != null) {
        var VIST = VehInsSubType.split('CH_');
        if (VIST[0] == "0") { // if (VehInsSubType.indexOf('0CH') > -1) { //
            $("#IDVSection").text("Not Applicable");
            $(".IDVRange").html("");
            $(".IDVDisplay").html("IDV : Not Applicable");
            //$("#divClaimYesNo, .divAccessories, .divAddon, .divIDV, .divDiscount, #liidvedit, #lidiscountedit").hide();
            //$("#divClaimYesNo, .divAccessories, #liidvedit, #lidiscountedit").hide();
            $("#divAccessories, #divAccessoriesEA, #divAccessoriesNEA").hide();
            $("#divClaimYesNo, #liidvedit, #lidiscountedit").hide();
            $(".divAddon, .divIDV, .divDiscount").addClass('VisibleHidden');// 23-02-2019
            $(".divErrIcon").removeClass('VisibleHidden');
            $(".divCoverMob").addClass('col-xs-10').removeClass('col-xs-6');
            $(".divAddon").attr('data-toggle', false);
            $(".divIDV").attr('data-toggle', false);
            $(".divDiscount").attr('data-toggle', false);
            $("#divIDV, #divDiscount, .divAddonMob").hide();
            $(".divErrIcon").show();

            /*if (ProductIdVal == 10) { //|| ProductIdVal == 12) {
                $(".divCover").attr('data-toggle', false);
                $(".divCover").addClass('VisibleHidden');
                $(".trCover").hide();
                $("#licoveredit").attr('data-target', false);
            }*/
            $("#liidvedit").attr('data-target', false);
            $("#lidiscountedit").attr('data-target', false);
            $("#lidiscountedit1").show();
            $("#TotalODPremium").text("N.A.");
            if (ProductIdVal == 12 && VehicleClass == "gcv") {
                $("#CV, .GCVCovers").show();
                $(".divOtherUses").hide();
                $(".divIMT23").hide();
                $(".divCoolie_Ll").hide();
            }
        }
        else if (VehInsSubType == "1OD_0TP") {
            //$("#divAccessories, #divAccessoriesEA, #divAccessoriesNEA").hide();
            $("#divOwnerDriverPersonalAccidentCover, #divPersonalAccidentCoverforDriver, #divPaidDriverPersonalAccidentCover, #divPersonalCoverPassenger").hide();
            $("#divSecureMore, #divIsTPPD").hide();
            $("#TotalLiabilityPremium").text("N.A.");
        }
        else {
            if (ProductIdVal == 12) {
                $(".divAddon").addClass('VisibleHidden');
                $(".divAddon").css("margin-left", 0);
                $("#CV").show();
                $(".CVCovers").show();
                if (VehicleClass == "pcv") {
                    $(".PCVCovers").show();

                }
                if (VehicleClass == "gcv") {
                    $(".GCVCovers").show();
                    $("#divOwnPremises").show();
                }
            }
            else { $("#CV").hide(); }
            if (ProductIdVal == 10 && VIST[0] == "1") {
                var misp_SSID = "0";
                if (request != null && request !== undefined) {
                    if (request.hasOwnProperty('Request_Core')) {
                        if (request.Request_Core.hasOwnProperty('ss_id')) {
                            misp_SSID = request.Request_Core.ss_id;
                        }
                    }
                }
                /*var misp_report_ssid = {
                    '487': 0,
                    '816': 1,
                    '10352': 0,
                    '12512': 0
                }*/

                if (["816", "14154", "14155", "14156", "14157", "14158", "17051", "15912", "15253", "11971", "17053"].indexOf(misp_SSID.toString()) > -1) {
                    $("#divODDiscount").show();
                } else {
                    $("#ODDiscountPercent").val(0);
                }
            }
            else {
                $("#ODDiscountPercent").val(0);
            }
        }
    }

    if (insurer_count == 0) {
        $("#BundleEdit").html('<div style="margin: 10px;text-align: center;">No Addon Bundle Plan Available</div>');
        $("#Standaloneedit").html('<div style="margin: 10px;text-align: center;">No Addons Available</div>');
    }

    //For CRN
    if ($(".CRN").val() == "" && quotes.Summary.Request_Core.crn != "") {
        $(".CRN").val(quotes.Summary.Request_Core.crn).text(quotes.Summary.Request_Core.crn);
    }

    var NewMobile = quotes.Summary.Request_Core.mobile;
    var NewEmail = quotes.Summary.Request_Core.email;
    if (NewMobile != "" && NewMobile != null) {
        $("#MobileDetails").text(NewMobile);
        if (NewMobile == "9999999999") { $("#MobileDetails").text("NA"); }
    }
    else { $("#divMobileDetails").hide(); }

    if (NewEmail != "" && NewEmail != null) {
        $("#EmailDetails").text(NewEmail);
        if ((NewEmail).indexOf('@testpb.com') > 1) {
            $("#EmailDetails").text("NA");
        }
    }
    else { $("#divEmailDetails").hide(); }

    // Edit Href Taking From Premuim_list_db
    var Hrefval = "";
    if (ProductIdVal == 1) { Hrefval = "/car-insurance?SID=" + quotes.Summary.Request_Unique_Id + "&ClientID=" + quotes.Summary.Client_Id; }
    else if (ProductIdVal == 10) { Hrefval = "/two-wheeler-insurance?SID=" + quotes.Summary.Request_Unique_Id + "&ClientID=" + quotes.Summary.Client_Id; }
    else if (ProductIdVal == 12) { Hrefval = "/commercial-vehicle-insurance/commercial-vehicle-insurance.html?SID=" + quotes.Summary.Request_Unique_Id + "&ClientID=" + quotes.Summary.Client_Id; }

    //if (vehicle.Product_Id_New == 1) { Hrefval = "/car-insurance-gamma?SID=" + search_summary.Summary.Request_Unique_Id + "&ClientID=" + search_summary.Summary.Client_Id; }
    //else if (vehicle.Product_Id_New == 10) { Hrefval = "/two-wheeler-insurance-gamma?SID=" + search_summary.Summary.Request_Unique_Id + "&ClientID=" + search_summary.Summary.Client_Id; }

    $("#EditInfo").attr("href", Hrefval);
	$("#Edit_Info").attr("href", Hrefval);

    $(".BasicMD").hide();
    $(".IDVRange").hide();
}
function SetHeight() {
    var DisplayAddonsHeight = 0, DisplayCoverHeight = 0, DisplayDiscountHeight = 0;
    $(".DisplayAddons").each(function () {
        if ($(this).height() > DisplayAddonsHeight) {
            DisplayAddonsHeight = $(this).height();
        }
    });
    $(".DisplayAddons").height(DisplayAddonsHeight);

    $(".DisplayCover").each(function () {
        if ($(this).height() > DisplayCoverHeight) {
            DisplayCoverHeight = $(this).height();
        }
    });
    $(".DisplayCover").height(DisplayCoverHeight);

    $(".DisplayDiscount").each(function () {
        if ($(this).height() > DisplayDiscountHeight) {
            DisplayDiscountHeight = $(this).height();
        }
    });
    $(".DisplayDiscount").height(DisplayDiscountHeight);
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
    if (x) {
        x = x.toString();
        var lastThree = x.substring(x.length - 3);
        var otherNumbers = x.substring(0, x.length - 3);
        if (otherNumbers != '')
            lastThree = ',' + lastThree;
        return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    }
    else {
        return 0;
    }
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
    CheckAddons();
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
    'PersonalAccidentCoverForPaidDriver', 'VoluntaryDeductions', 'ThirdPartyPropertyDamage', 'NoClaimBonus', 'TotalLiabilityPremium', 'ThirdPartyLiablityPremium',
    'PersonalAccidentCoverForOwnerDriver', 'LegalLiabilityPremiumForPaidDriver', 'PersonalAccidentCoverForUnammedPassenger', 'BiFuelKitLiabilityPremium', 'AddOnPremium',
    'OwnPremises', 'NFPPremium', 'FPPremium', 'OtherUses', 'IMT23', 'PersonalAccidentCoverForEmployee', 'OutstandingLoanCover', 'Conductor_Ll', 'Coolie_Ll', 'Cleaner_Ll',
    'GeographicalAreaExt', 'AdditionalTowing', 'FibreGlassTankFitted', 'TPPD']
function PremiumDetailsValues() {
    for (var i = 0; i < PremiumArray.length; i++) {
        if ($("#" + PremiumArray[i]).text() == "0" || $("#" + PremiumArray[i]).text() == "" || ($("#" + PremiumArray[i]).text()).indexOf("___") > -1) { $("#" + PremiumArray[i]).parent().hide(); }
        else { $("#" + PremiumArray[i]).parent().show(); }
    }
    if ($("#ODPAC").val() == 0) {
        //$(".ODPACDiv").hide();
    }
}
function PremiumPopupDetailsValues() {
    for (var i = 0; i < PremiumArray.length; i++) {
        if ($("." + PremiumArray[i]).text() == "0" || $("." + PremiumArray[i]).text() == "") { $("." + PremiumArray[i]).parent().parent().remove(); }
        else { $("." + PremiumArray[i]).parent().parent().show(); }
    }
}

function CheckOwnerDriverPersonalAccidentCover(value) {
    if (value == "Yes") {
        $("#ShowPACODMsg").hide();
        $("#ODPAC").val(1500000).text("(1500000)");
        $("#ODPAC2").prop('checked', true);
        $("#divIsHavingValidDL").addClass('hidden');
        $("#divIsHavingSCPA").addClass('hidden');
        $('#IsHavingValidDL').val("No").text("No");
        $("#IsHavingSCPA").val("Yes").text("Yes");
    }
    else if (value == "No") {
        $("#ODPAC").val(0).text("(0)");
        $("#ODPAC1").prop('checked', true);
        $("#ShowPACODMsg").show();
        //$("#divIsHavingValidDL").removeClass('hidden');
    }
    $("#IsHavingValidDL1").prop('checked', true);
    $("#IsHavingSCPA2").prop('checked', true);
    $("#OwnerDriverPersonalAccidentCover").val(value).html(value);
}
function CheckIsHavingValidDL(value) {
    $("#ODPAC").val(0).text("(0)");
    if (value == "Yes") {
        $("#divIsHavingSCPA").removeClass('hidden');
    }
    else if (value == "No") {
        $("#divIsHavingSCPA").addClass('hidden');
    }
    $("#IsHavingSCPA").val("Yes").text("Yes");
    $("#IsHavingSCPA2").prop('checked', true);
    //$("#IsHavingSCPA2").click();
    $("#IsHavingValidDL").val(value).html(value);
}
function CheckIsHavingSCPA(value) {
    if (value == "Yes") { $("#ODPAC").val(0).text("(0)"); }
    else if (value == "No") { $("#ODPAC").val(1500000).text("(1500000)"); }
    $("#IsHavingSCPA").val(value).html(value);
}
function CheckIsTPPD(value) {
    if (value == "Yes") { $("#IsTPPD").val("yes").text("Yes"); $("#IsTPPD2").prop('checked', true); }
    else if (value == "No") { $("#IsTPPD").val("no").text("No"); $("#IsTPPD1").prop('checked', true); }
}

function CheckIMT23(value) {
    if (value == "Yes") { $("#IMT23Val").text("Yes").val("Yes"); $("#IMT23").val("Yes"); $("#IMT23_2").prop('checked', true); }
    else if (value == "No") { $("#IMT23Val").text("No").val("NO"); $("#IMT23").val("No"); $("#IMT23_1").prop('checked', true); }
}
function CheckNonFairingPayingPassenger(value) {
    if (value == "Yes") { $("#NonFairingPayingPassengerVal").text("Yes").val("YES"); $("#NonFairingPayingPassenger").val("Yes"); }
    else if (value == "No") {
        $("#NonFairingPayingPassengerVal").text("No").val("NO"); $("#NonFairingPayingPassenger").val("No"); $("#NonFairingPayingPassengerVal1").prop('checked', true);
    }
}
function CheckFairingPayingPassenger(value) {
    if (value == "Yes") { $("#FairingPayingPassengerVal").text("Yes").val("YES"); $("#FairingPayingPassenger").val("Yes"); $("#FairingPayingPassengerVal2").prop('checked', true); }
    else if (value == "No") {
        $("#FairingPayingPassengerVal").text("No").val("NO"); $("#FairingPayingPassenger").val("No");
        $("#FairingPayingPassengerVal1").prop('checked', true);
    }
}
function CheckOtherUse(value) {
    if (value == "Yes") { $("#OtherUseVal").text("Yes").val("YES"); $("#OtherUse").val("Yes"); }
    else if (value == "No") {
        $("#OtherUseVal").text("No").val("NO"); $("#OtherUse").val("No");
        $("#OtherUse_1").prop('checked', true);
    }
}
function CheckOwnPremises(value) {
    if (value == "Yes") { $("#OwnPremisesVal").text("Yes").val("YES"); $("#OwnPremises").val("Yes"); }
    else if (value == "No") {
        $("#OwnPremisesVal").text("No").val("NO"); $("#OwnPremises").val("No");
        $("#OwnPremises_1").prop('checked', true);
    }
}
function CheckPersonalAccidentCoverForEmployee(value) {
    if (value == "Yes") { $("#PersonalAccidentCoverForEmployeeVal").text("YES").val("YES"); $("#PersonalAccidentCoverForEmployee").val("Yes"); }
    else if (value == "No") { $("#PersonalAccidentCoverForEmployeeVal").text("NO").val("NO"); $("#PersonalAccidentCoverForEmployee").val("No"); $("#PersonalAccidentCoverForEmployee_1").click(); $("#PersonalAccidentCoverForEmployee_1").attr('checked', true); }
}
function CheckConductor_Ll(value) {
    if (value == "Yes") { $("#Conductor_LlVal").text("Yes").val("Yes"); $("#Conductor_Ll").val("Yes"); $("#Conductor_Ll_2").prop('checked', true); }
    else if (value == "No") { $("#Conductor_LlVal").text("No").val("NO"); $("#Conductor_Ll").val("No"); $("#Conductor_Ll_1").prop('checked', true); }
}
function CheckCoolie_Ll(value) {
    if (value == "Yes") { $("#Coolie_LlVal").text("Yes").val("Yes"); $("#Coolie_Ll").val("Yes"); $("#Coolie_Ll_2").prop('checked', true); }
    else if (value == "No") { $("#Coolie_LlVal").text("No").val("NO"); $("#Coolie_Ll").val("No"); $("#Coolie_Ll_1").prop('checked', true); }
}
function CheckCleaner_Ll(value) {
    if (value == "Yes") { $("#Cleaner_LlVal").text("Yes").val("Yes"); $("#Cleaner_Ll").val("Yes"); $("#Cleaner_Ll_2").prop('checked', true); }
    else if (value == "No") { $("#Cleaner_LlVal").text("No").val("NO"); $("#Cleaner_Ll").val("No"); $("#Cleaner_Ll_1").prop('checked', true); }
}
function CheckGeographicalAreaExt(value) {
    if (value == "Yes") { $("#GeographicalAreaExtVal").text("Yes").val("Yes"); $("#GeographicalAreaExt").val("Yes"); $("#GeographicalAreaExt_2").prop('checked', true); }
    else if (value == "No") { $("#GeographicalAreaExtVal").text("No").val("NO"); $("#GeographicalAreaExt").val("No"); $("#GeographicalAreaExt_1").prop('checked', true); }
}
function CheckAdditionalTowing(value) {
    if (value == "Yes") { $("#AdditionalTowingVal").text("Yes").val("Yes"); $("#AdditionalTowing").val("Yes"); $("#AdditionalTowing_2").prop('checked', true); }
    else if (value == "No") { $("#AdditionalTowingVal").text("No").val("NO"); $("#AdditionalTowing").val("No"); $("#AdditionalTowing_1").prop('checked', true); }
}
function CheckFibreGlassTankFitted(value) {
    if (value == "Yes") { $("#FibreGlassTankFittedVal").text("Yes").val("Yes"); $("#FibreGlassTankFitted").val("Yes"); $("#FibreGlassTankFitted_2").prop('checked', true); }
    else if (value == "No") { $("#FibreGlassTankFittedVal").text("No").val("NO"); $("#FibreGlassTankFitted").val("No"); $("#FibreGlassTankFitted_1").prop('checked', true); }
}
function myfunction() {
    // Driving Licence
    if (request.is_having_valid_dl == "no") { $('#IsHavingValidDL').val("No").text("No"); $("#IsHavingValidDL1").attr('checked', true); }
    if (request.is_having_valid_dl == "yes") {
        $("#divIsHavingSCPA").removeClass('hidden');
        $("#IsHavingValidDL").val("Yes").text("Yes"); $("#IsHavingValidDL2").attr('checked', true);
    }

    //Standalone PA Cover
    if (request.is_opted_standalone_cpa == "no") { $("#ODPAC").val(1500000); $("#PersonalAccidentCoverforDriver").text("No").val("No"); $("#IsHavingSCPA1").attr('checked', true); }
    if (request.is_opted_standalone_cpa == "yes") { $("#ODPAC").val(0); $("#PersonalAccidentCoverforDriver").text("Yes").val("Yes"); $("#IsHavingSCPA2").attr('checked', true); }

}

function CheckPersonalAccidentCoverforDriver(value) {
    if (value == "Yes") { $("#PersonalAccidentCoverforDriver").text("Yes").val("Yes"); }
    else if (value == "No") {
        $("#PersonalAccidentCoverforDriver").text("No").val("No");
        //$("#PD1").click();
        $("#PD1").prop('checked', true);
    }

    //if (value == "0") { $("#PersonalAccidentCoverforDriver").html("No"); }
    //else { $("#PersonalAccidentCoverforDriver").html(value); }
    //$("#PersonalAccidentCoverforDriver").val(value);
}
function CheckPaidDriverPersonalAccidentCover(value) {
    if (value == "Yes") { $("#PaidDriverPersonalAccidentCover").text("Yes").val("Yes"); }
    else if (value == "No") {
        $("#PaidDriverPersonalAccidentCover").text("No").val("No");
        //$("#PDPersonal1").click();
        $("#PDPersonal1").prop('checked', true);
    }

    //if (value == "0") { $("#PaidDriverPersonalAccidentCover").html("No"); }
    //else { $("#PaidDriverPersonalAccidentCover").html(value); }
    //$("#PaidDriverPersonalAccidentCover").val(value);
}
function CheckUnnamedPassenger(value) {

    $("#PersonalCoverPassenger").val(value).text(value);
    if (value == "0") {
        $("#PersonalCoverPassenger").html("No");
        //$("#Un-Named1").click();
        $("#Un-Named1").prop('checked', true);
    }

    //if (value == "0") { $("#PersonalCoverPassenger").html("No"); }
    //else { $("#PersonalCoverPassenger").html(value); }
    //$("#PersonalCoverPassenger").val(value);
}
function CheckNamedPassenger(value) {

    $("#NamedPersonalAccidentCover").val(value).text(value);
    if (value == "0") {
        $("#NamedPersonalAccidentCover").html("No");
        //$("#Named1").click();
        $("#Named1").prop('checked', true);
    }

    //if (value == "0") { $("#NamedPersonalAccidentCover").html("No"); }
    //else { $("#NamedPersonalAccidentCover").html(value); }
    //$("#NamedPersonalAccidentCover").val(value);
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
    $("#VoluntaryDeduction").val(value).text(value);
    if (value == "0") {
        $("#VoluntaryDeduction").html("No");
        //$("#Un-Named1").click();
        $("#Un-Named1").prop('checked', true);
    }
    //if (value == "0") { $("#VoluntaryDeduction").html("No"); }
    //else { $("#VoluntaryDeduction").html(value); }
    //$("#VoluntaryDeduction").val(value);
}
function CheckSort(filter1, filter2) {
    //ascending = $("#dllSotBy").val().includes("low-high");
    //parameter = $("#dllSotBy").val().includes("1") ? "premium" : ($("#dllSotBy").val().includes("2") ? "idv" : "fair_price")// $("#dllSotBy").val().includes("1") ? "premium" : "idv"
    var ascending = (filter1 == "low-high") ? true : false;
    var parameter = (filter2 == "1") ? "premium" : (filter2 == "2") ? "idv" : "fair_price";
    var divQts = $('.quoteboxmain').pbsort(ascending, parameter);
    $('.quoteboxparent').html(divQts);
    console.log("Sorting:" + ascending + "_" + parameter);
}
function CheckLoanWaiver(value) {
    if (value == "Yes") { $("#LoanWaiver").text("Yes").val("Yes"); $("#LoanWaiver2").prop('checked', true); $("#divOutstandingLoanCoverAmount").show(); }
    else if (value == "No") { $("#LoanWaiver").text("No").val("No"); $("#LoanWaiver1").prop('checked', true); $("#divOutstandingLoanCoverAmount").hide(); $("#OutstandingLoanCoverAmount").val(0); }
}

$('#ExpectedIDV').keypress(function () { return this.value.length < 7; });
//$('.Accessories').keypress(function () { return this.value.length < 6; });
$('.Accessories').keyup(function () {
    this.value = this.value.replace(/[^0-9\.]/g, '');
});
$('.Numeric').keyup(function () {
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
            if (Eleval < 10000 || Eleval > 50000 || pattern.test(Eleval) == false || Eleval == "") {
                $('#spn' + Id).addClass('ErrorMsg');
                $('#' + Id).addClass('errorClass1');
            }
            else { $('#spn' + Id).removeClass('ErrorMsg'); $('#' + Id).removeClass('errorClass1'); }
        }
    }
    if ($('#' + Id).val() == 0) { $('#spn' + Id).removeClass('ErrorMsg'); $('#' + Id).removeClass('errorClass1'); }
}

$('#ExpectedIDV').focusout(function () {
    if (parseInt($("#ExpectedIDV").val()) != 0) {
        if (parseInt($("#ExpectedIDV").val()) < parseInt($('#expected_idv').attr("min")) || parseInt($("#ExpectedIDV").val()) > parseInt($('#expected_idv').attr("max")))
        { $("#ExpectedIDV").addClass('errorClass1'); $(".spnExpectedIDV").addClass('ErrorMsg'); }
        else { $("#ExpectedIDV").removeClass('errorClass1'); $(".spnExpectedIDV").removeClass('ErrorMsg'); }
    }
    else { $("#ExpectedIDV").removeClass('errorClass1'); $(".spnExpectedIDV").removeClass('ErrorMsg'); }
});

$(document).on('click', '#SelectAllAddons', function () {
    $('#Addons').find('input[type=checkbox]').click();
    if ($(this).is(':checked') == true) { $('#Addons').find('input[type=checkbox]').prop('checked', true); }
    else { $('#Addons').find('input[type=checkbox]').prop('checked', false); }
});

function SetValues() {
    $('.SpnCD').each(function () {
        if ($(this).text() == 0 || $(this).text().indexOf("___") > -1) { $(this).parent().empty().remove(); }//$(this).parent().addClass('hidden'); }
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
            owndamage_Third_Party_Property_Damage: $("#ThirdPartyPropertyDamage").text(),//ThirdPartyPropertyDamage
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
            ServiceTax: $("#ServiceTax").text(),
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
        var obj_horizon_data = Horizon_Method_Convert("/email/premium_breakup", obj, "POST");
        $.ajax({
            type: "POST",
            data: JSON.stringify(obj_horizon_data['data']),
            url: obj_horizon_data['url'],
            //url: "/CarInsuranceIndia/Premium_Details",
            //data: JSON.stringify({ request_json: JSON.stringify(obj) }),
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
    else { return true; }
}

function GetPrevIns(InsId) {
    var InsText = "";
    switch (InsId) {
        case 1: InsText = "Bajaj Allianz"; break;
        case 2: InsText = "Bharti Axa"; break;
        case 3: InsText = "Cholamandalam MS"; break;
        case 4: InsText = "Future Generali"; break;
        case 5: InsText = "HDFC ERGO"; break;
        case 6: InsText = "ICICI Lombard"; break;
        case 7: InsText = "IFFCO Tokio"; break;
        case 8: InsText = "National Insurance"; break;
        case 9: InsText = "Reliance General"; break;
        case 10: InsText = "Royal Sundaram"; break;
        case 11: InsText = "Tata AIG"; break;
        case 12: InsText = "New India Assurance"; break;
        case 13: InsText = "Oriental Insurance"; break;
        case 14: InsText = "United India"; break;
        case 15: InsText = "L&amp;T General"; break;
        case 16: InsText = "Raheja QBE"; break;
        case 17: InsText = "SBI General"; break;
        case 18: InsText = "Shriram General"; break;
        case 19: InsText = "Universal Sompo"; break;
        case 30: InsText = "Kotak Mahindra"; break;
        case 33: InsText = "Liberty Videocon"; break;
        case 35: InsText = "Magma HDI"; break;
        case 44: InsText = "Go Digit"; break;
        case 45: InsText = "Acko General"; break;
        case 46: InsText = "Edelweiss"; break;
        case 47: InsText = "DHFL"; break;
    }
    return InsText;
}

function ShowVehInsSubType(VISTCode) {
    var InsText = "";
    switch (VISTCode) {
        case '0CH_1TP': InsText = "T.P. Only For 1 Yr"; break;
        case '0CH_3TP': InsText = "T.P. Only For 3 Yrs"; break;
        case '0CH_5TP': InsText = "T.P. Only For 5 Yrs"; break;

            //case '1CH_0TP': InsText = "Comprehensive For 1 Yr"; break;
            //case '3CH_0TP': InsText = "Comprehensive For 3 Yrs"; break;
            //case '5CH_0TP': InsText = "Comprehensive For 5 Yrs"; break;

        case '1CH_2TP': InsText = "Comprehensive For 1 Yr + T.P. For 2 Yrs"; break;
            //case '1CH_4TP': InsText = "Comprehensive For 1 Yr + T.P. For 4 Yrs"; break;

        case '1CH_1TP': InsText = "O.D. For 1 Yr + T.P. For 1 Yr"; break;
        case '1OD_0TP': InsText = "O.D. Only For 1 Yr"; break;
        case '1CH_0TP': InsText = "O.D. + T.P. For 1 Yr"; break;
        case '2CH_0TP': InsText = "O.D. + T.P. For 2 Yrs"; break;
        case '3CH_0TP': InsText = "O.D. + T.P. For 3 Yrs"; break;

        case '1CH_4TP': InsText = "O.D. For 1 Yr + T.P. For 4 Yrs"; break;
        case '5CH_0TP': InsText = "O.D. + T.P. For 5 Yrs"; break;
    }
    return InsText;
}

function PackageSelect(Id, Plan) {
    IsLoad = false;
    AddOnSelectedList = $('#BundleEdit :radio:checked').map(function () { return this.id; }).get();
}
function AddonSelect(InsID, Plan) {
    // console.log("AddonSelect() Called :" + InsID + "_" + Plan);
    var addon_amount = 0;
    var addon_premium_breakup = "";
    var addon_premium;
    var addon_checked = $('#Addons').find('input[type=checkbox]:checked');
    for (var i = 0; i < quotes.Response.length; i++) {
        if (quotes.Response[i].Insurer_Id == InsID) {
            var InsResponse = quotes.Response[i];
            var InsAddonList = InsResponse.Addon_List;
            var InsPlanList = InsResponse.Plan_List;
            var InsPremBrkup = InsResponse.Premium_Breakup;
            for (var pl in InsPlanList) {
                var Hrefval = "";
                var ARN = "";
                var addon_premium_breakup = "";

                if (InsResponse.Plan_List[pl].Plan_Name == Plan) {
                    BundleResponse["Insurer_" + InsID] = InsResponse.Plan_List[pl]; // obj["addon_package"] = objPackage;
                    ARN = InsResponse.Plan_List[pl].Service_Log_Unique_Id;
                    Hrefval = "/car-insurance/buynow/" + clientid + "/" + ARN + "/" + AgentType + "/" + IsCustomer;
                    $($('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.dynamic').children('.quote-buynow')).attr('href', Hrefval);
                    $($('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.dynamic').children('.buy_now1')).attr('href', Hrefval);
                    // DisplayAddons30
                    var DisplayAddons = "";
                    $("#DisplayAddons" + InsID).html("No Addons Available");
                    Plan_Addon_Breakup = InsResponse.Plan_List[pl].Plan_Addon_Breakup;
                    var HtmlBundleAddon = "";
                    $.each(Plan_Addon_Breakup, function (key, v) {
                        AddonTitle = addon_list[key] + "(" + v + ")";
                        var addon_name = addon_shortlist[key];

                        //arr1.push(addon_shortlist[key]);
                        //arr.push('<span class="Pack" title="' + AddonTitle + '">' + addon_shortlist[key] + '</span>');

                        var addon_premium = v;
                        addon_amount += addon_premium;

                        //amount[BuffetPlanName] = addon_amount;
                        //AddonContent = AddonContent + '<span title="' + addon_premium + '">' + addon_shortlist[key] + '</span> ';

                        //addon_premium = InsResponse.Addon_List[j];
                        // addon_premium_breakup += addon_list[j] + '-' + addon_premium + '+';

                        addon_premium_breakup += addon_list[key] + '-' + v + '+';

                        DisplayAddons += '<span class="BlockSections" title="' + addon_list[key] + '">' + addon_shortlist[key] + '<span>₹ ' + addon_premium + '</span></span>';

                        //For Mobile
                        HtmlBundleAddon = HtmlBundleAddon + "<div class='col-xs-6 col-md-2 form-height'>" + addon_list[key] + "<span><i class='fa fa-inr'></i>" + v + "</span></div>";
                    });
                    $(".BundleAddons" + InsID).html(HtmlBundleAddon);

                    if (DisplayAddons == "") {
                        DisplayAddons = "No Addons Available";
                    }
                    $("#DisplayAddons" + InsID).html(DisplayAddons);

                    // Add <span class="BlockSections" title="Zero Depreciation">ZD <span>₹ 4363</span></span>

                    //Commented Because of Premium Mismatch When Change Plan On 29-01-2019
                    //addon_amount = InsResponse.Plan_List[pl].Plan_Addon_Premium;

                    //Code For Changing Premium On Addon Select Starts
                    var total_liability_premium = InsPremBrkup.liability['tp_final_premium'] - 0;
                    var net_premium = InsPremBrkup.net_premium + addon_amount;
                    var service_tax = 0;
                    if (ProductIdVal == 12 && quotes.Summary.Request_Core.vehicle_class == "gcv" && InsID == '1') {
                        var tp_basic_Tax = 2 * (InsPremBrkup.liability['tp_basic'] * 0.06);
                        var rest_prm = parseFloat(InsPremBrkup['net_premium']) - parseFloat(InsPremBrkup.liability['tp_basic']);
                        var rest_prm_Tax = 2 * (rest_prm * 0.09) - 0;
                        service_tax = (Math.round(tp_basic_Tax + rest_prm_Tax));
                    }else{
                        service_tax = 2 * (Math.round(net_premium * 0.09) - 0);
                    }
                    var od_final_premium = InsPremBrkup.own_damage['od_final_premium'] - 0;
                    var ncb = InsPremBrkup.own_damage['od_disc_ncb'] - 0;

                    //Added by Ajit for TATA-AIG and Bajaj for Service Tax Calculation
                    //if (InsID == 11) {
                    //    var net_premium_without_rsa = InsPremBrkup.own_damage['od_final_premium'] + InsPremBrkup.liability['tp_final_premium'] + addon_amount;
                    //    net_premium = net_premium_without_rsa;
                    //    var flag_addon_rsa = false;
                    //    var addon_amount_rsa = 0;
                    //    if (InsResponse.Addon_List.hasOwnProperty('addon_road_assist_cover')) {
                    //        if (InsResponse.Plan_List[pl].Plan_Name != "Basic") {
                    //            $.each(InsResponse.Addon_List, function (i, v) {
                    //                var addon_name = addon_list[i];
                    //                if (addon_name == 'RoadSide Assistance') { flag_addon_rsa = true; addon_amount_rsa = v; }
                    //            });
                    //        }
                    //    }
                    //    if (flag_addon_rsa) { net_premium_without_rsa = Math.round(net_premium_without_rsa) - addon_amount_rsa - 0; }
                    //    service_tax = 2 * (Math.round(net_premium_without_rsa * 0.09)) - 0; //+ Math.round(addon_amount_rsa * 0.18) - 0;
                    //}
                    if (InsID == 14) {
                        var addon_amount_me = addon_amount;
                        if (InsResponse.Addon_List.hasOwnProperty('addon_medical_expense_cover')) {
                            $.each(addonchecked, function (i, v) {
                                var addon_name = addon_list[v.id];
                                if (addon_name == 'Medical Expense') {
                                    flag_addon_rsa = true;
                                    addon_amount_me = addon_amount_me - InsResponse.Addon_List[v.id];
                                }
                            });
                        }
                        var od_final_uui = InsPremBrkup.own_damage['od_final_premium'] + InsPremBrkup.own_damage['od_disc_ncb'] + addon_amount_me;
                        var ncb_next_slab = InsResponse.Premium_Rate.own_damage['od_disc_ncb'] - 0;
                        console.log('od_final_uui', od_final_uui);
                        ncb = (od_final_uui * ncb_next_slab / 100);
                        od_final_premium = od_final_uui - addon_amount_me - ncb;
                        net_premium = od_final_premium + total_liability_premium + addon_amount;
                        console.log('final', od_final_premium, total_liability_premium, addon_amount, ncb);
                        service_tax = (net_premium * 0.18);
                    }

                    var final_premium = Math.round(net_premium + service_tax - 0);
                    //final_premium = InsResponse.Plan_List[pl].Plan_Full_Premium.final_premium;

                    $('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.dynamic').children('.btn-buy').children('.Premium').html('₹ ' + rupee_format(final_premium));// + ' <i style="font-size:14px">(1 year) </i>');
                    $('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.dynamic').children('.btn-buy').children('.PremiumMobile').html('₹ ' + rupee_format(final_premium));

                    $('#divQuitList' + InsID).attr('premium', final_premium);
                    //$('#divQuitList' + InsID).attr('applied_addon', count);
                    $('#BuyNow' + InsID + '').children('#breakup_Btn').text('₹ ' + rupee_format(final_premium) + '');
                    $('#divQuitList' + InsID + ' .PremiumBreakup').attr('netpayablepayablepremium', rupee_format(final_premium));
                    $('#divQuitList' + InsID + ' .PremiumBreakup').attr('servicetax', rupee_format(Math.round(service_tax)));
                    $('#divQuitList' + InsID + ' .PremiumBreakup').attr('addonpremium', Math.round(addon_amount));
                    $('#divQuitList' + InsID + ' .PremiumBreakup').attr('totalpremium', rupee_format(Math.round(net_premium)));
                    $('#divQuitList' + InsID + ' .PremiumBreakup').attr('addonname', addon_premium_breakup);

                    //For Displaying Message For Discount Not Selected
                    var TotalDiscountVal = 0;
                    TotalDiscountVal = Math.round(InsPremBrkup.own_damage.od_disc_anti_theft) + Math.round(InsPremBrkup.own_damage.od_disc_vol_deduct);
                    //$('#divQuitList' + InsID + ' .PremiumBreakup').attr('totaldiscount', TotalDiscountVal);
                    if (TotalDiscountVal == 0) {
                        $('#DisplayDiscount' + InsID).html("No Discount Available");
                    }

                    //For Displaying Message For Cover Not Selected
                    var TotalCover = 0;
                    TotalCover = Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('electricalacessoriespremium')).replace(/,/g, '')) + Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('nonelectricalaccessoriespremium').replace(/,/g, '')));
                    if (ProductIdVal == 10) {
                        if (TotalCover == 0) { $("#DisplayCover" + InsID).html("No Cover Available"); }
                    }
                    if (ProductIdVal == 1) {
                        TotalCover +=
                                    Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('legalliabilitypremiumforpaiddriver')).replace(/,/g, '')) +
                                    Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('personalaccidentcoverforpaiddriver')).replace(/,/g, '')) +
                                    Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('personalaccidentcoverforunammedpassenger')).replace(/,/g, '')) +
                                    Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('personalaccidentcoverfornamedpassenger')).replace(/,/g, '')) +
                                    Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('ownpremises')).replace(/,/g, '')) +
                                    Math.round(($('#divQuitList' + InsID + ' .PremiumBreakup').attr('outstandingloancover')).replace(/,/g, ''));
                        if (TotalCover == 0) { $("#DisplayCover" + InsID).html("No Cover Available"); }
                    }
                    //$('#divQuitList' + InsID + ' .PremiumBreakup').attr('totalCover', TotalCover);

                    if (InsID == 35) {
                        net_premium = net_premium - 195;
                        total_liability_premium = InsPremBrkup.liability['tp_final_premium'] - 195;
                    }

                    $('#divQuitList' + InsID + ' .PremiumBreakup').attr('TotalLiabilityPremium', rupee_format(total_liability_premium));
                    $('#divQuitList' + InsID + ' .PremiumBreakup').attr('totalpremium', rupee_format(Math.round(net_premium)));
                    //Code For Changing Premium On Addon Select Ends
                    break;
                }
            }
            break;
        }
    }

    //console.log("Addon Name Checked:" + $('#DisplayAddons' + InsID).find('input[type=checkbox]:checked').attr('addname'));

    //$('#Pack'+InsID).text($('#divQuitList' + InsID + ' .Premium').text());
    if (Plan != 'Basic') { Plan = Plan.replace(new RegExp('_', 'gi'), " "); $("#divPlanName" + InsID).show(); $("#PlanName" + InsID).text(Plan); }
    else { $("#divPlanName" + InsID).hide(); $("#PlanName" + InsID).text(""); }

    set_minmax_premium();
}
function CheckAddons() {
    var Addon_Check = $('#Addons :checkbox').length == $('#Addons :checkbox').filter(':checked').length;
    if (Addon_Check) { $('#SelectAllAddons').prop('checked', true); }
    else { $('#SelectAllAddons').prop('checked', false); }
}
$(document).on("click", "#Addons .chk-col-indigo", function () {
    CheckAddons();
});
function GetUrl() {
    var url = window.location.href;
    var newurl;
    newurl = "https://qa.policyboss.com";

    if (url.includes("request_file")) {
        //  newurl = "https://qa-horizon.policyboss.com:3000";
        newurl = "https://localhost:3000";
    } else if (url.includes("qa")) {
        newurl = "https://qa-horizon.policyboss.com:3000";
    } else if (url.includes("www") || url.includes("cloudfront")) {
        newurl = "https://horizon.policyboss.com:5000";
    }
    return newurl;
}
function SetUrl() {
    var url = window.location.href;
    if (url.includes("request_file")) {
        Get_URL = "http://qa.policyboss.com";
    } else if (url.includes("qa")) {
        Get_URL = "http://qa-horizon.policyboss.com:3000";
    } else if (url.includes("www") || url.includes("cloudfront")) {
        Get_URL = "http://horizon.policyboss.com:5000";
    }
}

var getUrlVars = function () {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        if (hashes[i].includes("?"))
        {
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
}

function stringparam() {
    ss_id = getUrlVars()["ss_id"];
    fba_id = getUrlVars()["fba_id"];
    sub_fba_id = getUrlVars()["sub_fba_id"];
    utm_source = getUrlVars()["utm_source"];
    utm_medium = getUrlVars()["utm_medium"];
    utm_campaign = getUrlVars()["utm_campaign"];
    campaign_id = getUrlVars()["campaign_id"];
    //ip_address = getUrlVars()["ip_address"];
    app_version = getUrlVars()["app_version"];
    mac_address = getUrlVars()["mac_address"];
    if (utm_source != undefined && utm_medium != undefined && utm_campaign != undefined) {
    $.ajax({
        url: '/Payment/SetCampaignSession?utm_source=' + utm_source + '&utm_medium=' + utm_medium + '&utm_campaign=' + utm_campaign + '&pbcamp_id=' + campaign_id,
        type: 'Get',
        contentType: 'application/json;',
        dataType: "json",
        success: function (response) { },
        error: function (response) { }
    });
    }
}
function Horizon_Method_Convert(method_action, data, type) {
    var obj_horizon_method = {
        'url': (type == "POST") ? "/TwoWheelerInsurance/call_horizon_post" : "/TwoWheelerInsurance/call_horizon_get?method_name=" + method_action,
        "data": {
            request_json: JSON.stringify(data),
            method_name: method_action,
            client_id: "2"
        }
    };
    return obj_horizon_method;
}
$(document).on("click", "#Recalculate", function () {
    var request = search_summary.Request;
    var Err = 0;
    $("#ElectricalAccessories").focusout();
    $("#NonElectricalAccessories").focusout();
    var Eleval = $('#ElectricalAccessories').val();
    var NonEleval = $('#NonElectricalAccessories').val();
    var LoanWaiverval = $('#LoanWaiver').val();
    var OSLCAmount = $("#OutstandingLoanCoverAmount").val();
    var ODDiscountVal = $("#ODDiscount").val();
    var ODDiscountPercent = $("#ODDiscountPercent").val();
    var pattern = /^[0-9]*$/;
    //$('#spnElectricalAccessories, #spnNonElectricalAccessories').remove();
    if ((Eleval != 0 || Eleval == "")) {
        if (ProductIdVal == 1 || ProductIdVal == 12) {
            if (Eleval < 10000 || Eleval > 50000 || pattern.test(Eleval) == false || Eleval.length != 5 || Eleval == "") {
                Err++;
                $('#spnElectricalAccessories').addClass('ErrorMsg');
                $('#ElectricalAccessories').addClass('errorClass1');
            }
            else { $('#spnElectricalAccessories').removeClass('ErrorMsg'); $('#ElectricalAccessories').removeClass('errorClass1'); }
        }
        if (ProductIdVal == 10) {
            if (Eleval < 5000 || Eleval > 50000 || pattern.test(Eleval) == false || Eleval.length < 4 || Eleval.length > 5 || Eleval == "") {
                Err++;
                $('#spnElectricalAccessories').addClass('ErrorMsg');
                $('#ElectricalAccessories').addClass('errorClass1');
            }
            else { $('#spnElectricalAccessories').removeClass('ErrorMsg'); $('#ElectricalAccessories').removeClass('errorClass1'); }
        }
    }

    if ((NonEleval != 0 || NonEleval == "")) {
        if (ProductIdVal == 1 || ProductIdVal == 12) {
            if (NonEleval < 10000 || NonEleval > 50000 || pattern.test(NonEleval) == false || NonEleval.length != 5 || NonEleval == "") {
                Err++;
                $('#spnNonElectricalAccessories').addClass('ErrorMsg');
                $('#NonElectricalAccessories').addClass('errorClass1');
            }
            else { $('#spnNonElectricalAccessories').removeClass('ErrorMsg'); $('#NonElectricalAccessories').removeClass('errorClass1'); }
        }
        if (ProductIdVal == 10) {
            if (NonEleval < 5000 || NonEleval > 50000 || pattern.test(NonEleval) == false || NonEleval.length < 4 || NonEleval.length > 5 || NonEleval == "") {
                Err++;
                $('#spnNonElectricalAccessories').addClass('ErrorMsg');
                $('#NonElectricalAccessories').addClass('errorClass1');
            }
            else { $('#spnNonElectricalAccessories').removeClass('ErrorMsg'); $('#NonElectricalAccessories').removeClass('errorClass1'); }
        }
    }

    //if (($("#ElectricalAccessories").val() < 10000 || $("#ElectricalAccessories").val() > 50000 || pattern.test($("#ElectricalAccessories").val()) == false) && $("#ElectricalAccessories").val() != 0) { $('#spnElectricalAccessories').addClass('ErrorMsg'); $("#ElectricalAccessories").addClass('errorClass1'); Err++; }
    //else { $("#ElectricalAccessories").removeClass('errorClass1'); }
    //if (($("#NonElectricalAccessories").val() < 10000 || $("#NonElectricalAccessories").val() > 50000 || pattern.test($("#NonElectricalAccessories").val()) == false) && $("#NonElectricalAccessories").val() != 0) { $('#spnNonElectricalAccessories').addClass('ErrorMsg'); $("#NonElectricalAccessories").addClass('errorClass1'); Err++; }
    //else { $("#NonElectricalAccessories").removeClass('errorClass1'); }

    var expIDV = parseInt($("#ExpectedIDV").val());
    if (expIDV != 0) {
        if (expIDV < parseInt($('#expected_idv').attr("min")) || expIDV > parseInt($('#expected_idv').attr("max"))) { $("#ExpectedIDV").addClass('errorClass1'); Err++; }
        else { $("#ExpectedIDV").removeClass('errorClass1'); }
    }

    if ($("#LoanWaiver").val() == "Yes" && ProductIdVal == 1) {
        if (OSLCAmount < 0 || OSLCAmount > 2000000 || pattern.test(OSLCAmount) == false || OSLCAmount == "") {
            Err++;
            $('#spnOutstandingLoanCoverAmount').addClass('ErrorMsg');
            $('#OutstandingLoanCoverAmount').addClass('errorClass1');
        }
        else { $('#spnOutstandingLoanCoverAmount').removeClass('ErrorMsg'); $('#OutstandingLoanCoverAmount').removeClass('errorClass1'); }
    }
    if (ProductIdVal == 10) {
        if (ODDiscountPercent < 0 || ODDiscountPercent > 60 || pattern.test(ODDiscountPercent) == false || ODDiscountPercent == "") {
            Err++;
            $('#SpanODDiscountPercent').addClass('ErrorMsg');
            $('#ODDiscountPercent').addClass('errorClass1');
        }
        else { $('#SpanODDiscountPercent').removeClass('ErrorMsg'); $('#ODDiscountPercent').removeClass('errorClass1'); }
    }

    if (Err > 0) { return false; }

    ////motorobject.TwoWheelerType = request.vehicle_insurance_type;
    ////motorobject.TwoWheelerVariantID = request.vehicle_id;
    //var REGNO = (request.registration_no).replace(/-/g, '');
    //motorobject.RegistrationNo = REGNO;
    //motorobject.CustomerReferenceID = search_summary.Summary.PB_CRN;
    //motorobject.VehicleType = request.vehicle_insurance_type === 'renew' ? 1 : 0;
    //motorobject.VehicleInsuranceSubtype = request.vehicle_insurance_subtype;
    //motorobject.DateofPurchaseofCar = request.vehicle_registration_date;
    //motorobject.PolicyExpiryDate = request.policy_expiry_date;
    //motorobject.PreviousInsurer = request.previous_insurer;
    //motorobject.CarVariantID = request.vehicle_id;
    //motorobject.CityofRegitrationID = request.rto_id;
    //motorobject.ManufactureYear = request.vehicle_manf_date.substring(0, 4);
    //motorobject.ManufactureMonth = request.vehicle_manf_date.substring(5, 7);
    //motorobject.HaveNCBCertificate = request.is_claim_exists == "yes" ? "No" : "Yes";
    //motorobject.NoClaimBonusPercent = request.vehicle_ncb_current;
    //motorobject.PreviousInsurer = request.prev_insurer_id;
    //motorobject.ContactName = request.first_name;
    //motorobject.ContactMiddleName = request.middle_name;
    //motorobject.ContactLastName = request.last_name;
    //motorobject.ContactMobile = request.mobile;
    //motorobject.ContactEmail = request.email;
    //motorobject.IsBiFuelKit = request.is_external_bifuel;
    //motorobject.BiFuelType = request.external_bifuel_type;
    //motorobject.ValueOfBiFuelKit = request.external_bifuel_value;
    //motorobject.CityofRegitration = "(" + request.registration_no_1 + request.registration_no_2 + ")";
    //motorobject.IsAntiTheftDevice = $("#IsAntiTheftDevice").val() == "Yes" ? "yes" : "no";
    //motorobject.VoluntaryDeduction = $("#VoluntaryDeduction").val();
    //motorobject.ElectricalAccessories = $("#ElectricalAccessories").val();
    //motorobject.NonElectricalAccessories = $("#NonElectricalAccessories").val();
    //motorobject.ExpectedIDV = $("#ExpectedIDV").val();
    //motorobject.MemberofAA = $("#MemberofAA").val() == "Yes" ? "yes" : "no";
    //motorobject.PersonalAccidentCoverforDriver = $("#PersonalAccidentCoverforDriver").val() == "Yes" ? "yes" : "no"; //Legal liability to paid driver
    //motorobject.PaidDriverPersonalAccidentCover = $("#PaidDriverPersonalAccidentCover").val() == "Yes" ? "100000" : "0"; //Paid Driver Personal Accident Cover

    //motorobject.OwnerDriverPersonalAccidentCover = $("#ODPAC").val() == "" ? 1500000 : $("#ODPAC").val(),// Personal Accident Cover For Owner Driver // pa_owner_driver_si
    //motorobject.HaveDrivingLicense = $('#IsHavingValidDL').val() == "Yes" ? true : false, //is_having_valid_dl
    //motorobject.IsOptedStandaloneCPA = $('#IsHavingSCPA').val() == "No" ? false : true, //is_opted_standalone_cpa

    //motorobject.PersonalCoverPassenger = $('#PersonalCoverPassenger').val();
    //motorobject.NamedPersonalAccidentCover = $('#NamedPersonalAccidentCover').val();

    ////ODPAC
    //motorobject.client_id = clientid;
    //motorobject.app_version = "2.0";
    //motorobject.SupportsAgentID = request.ss_id;
    //console.log(JSON.stringify(motorobject));

    $("#spinner").css('display', 'block');
    var data1 = {
        "product_id": ProductIdVal,
        "vehicle_id": request.vehicle_id,
        "rto_id": request.rto_id,
        "vehicle_insurance_type": request.vehicle_insurance_type === 'renew' ? "renew" : "new",
        "vehicle_insurance_subtype": request.vehicle_insurance_subtype,
        "vehicle_manf_date": request.vehicle_manf_date,
        "vehicle_registration_date": request.vehicle_registration_date,
        "policy_expiry_date": request.policy_expiry_date,
        "prev_insurer_id": request.prev_insurer_id,
        "vehicle_registration_type": request.vehicle_registration_type,
        "vehicle_ncb_current": request.vehicle_ncb_current,
        "is_claim_exists": request.is_claim_exists,
        "method_type": "Premium",
        "execution_async": "yes",
        "electrical_accessory": $("#ElectricalAccessories").val(),
        "non_electrical_accessory": $("#NonElectricalAccessories").val(),
        "registration_no": request.registration_no,
        "is_llpd": $("#PersonalAccidentCoverforDriver").val() == "Yes" ? "yes" : "no",
        "is_antitheft_fit": $("#IsAntiTheftDevice").val() == "Yes" ? "yes" : "no",
        "voluntary_deductible": $("#VoluntaryDeduction").val(),
        "is_external_bifuel": request.is_external_bifuel,
        "is_aai_member": $("#MemberofAA").val() == ("Yes" || "yes") ? "yes" : "no",
        "external_bifuel_type": request.external_bifuel_type,
        "external_bifuel_value": request.external_bifuel_value,
        "pa_owner_driver_si": $("#ODPAC").val() == "" ? 1500000 : parseInt($("#ODPAC").val()),
        "is_pa_od": $("#OwnerDriverPersonalAccidentCover").val() == "Yes" ? "yes" : "no",
        "is_having_valid_dl": $('#IsHavingValidDL').val() == "Yes" ? "yes" : "no",
        "is_opted_standalone_cpa": $('#IsHavingSCPA').val() == "No" ? "no" : "yes",
        "pa_named_passenger_si": $('#NamedPersonalAccidentCover').val() == undefined ? "0" : $('#NamedPersonalAccidentCover').val(),
        "pa_unnamed_passenger_si": $('#PersonalCoverPassenger').val() == undefined ? "0" : $('#PersonalCoverPassenger').val(),
        "pa_paid_driver_si": $("#PaidDriverPersonalAccidentCover").val() == "Yes" ? "100000" : "0",
        "is_financed": IsVehicleFinanced,
        "is_oslc": $("#LoanWaiver").val() == "Yes" ? "yes" : "no",
        "oslc_si": $("#OutstandingLoanCoverAmount").val() == "" ? 0 : parseInt($("#OutstandingLoanCoverAmount").val()),
        "vehicle_expected_idv": $("#ExpectedIDV").val() == "" ? 0 : $("#ExpectedIDV").val(),
        "first_name": request.first_name,
        "middle_name": request.middle_name,
        "last_name": request.last_name,
        "mobile": request.mobile,
        "email": request.email,
        "crn": (request.crn == "" || request.crn == null) ? crn : request.crn,
        "ss_id": request.ss_id,
        "fba_id": request.fba_id,
        "geo_lat": 0,
        "geo_long": 0,
        "agent_source": "",
        "ip_address": request.ip_address,
        "app_version": request.app_version,
        "search_reference_number": SRN,
        "is_breakin": request.is_breakin,
        "is_inspection_done": "no",
        "is_policy_exist": request.is_policy_exist,
        "ip_city_state": request.ip_city_state
    }
    if (request.sub_fba_id !== null && request.sub_fba_id !== "" && request.sub_fba_id != undefined) {
        data1["sub_fba_id"] = request.sub_fba_id;
    }
    if (quotes.Summary.Request_Core.utm_source !== null && quotes.Summary.Request_Core.utm_source !== "" && quotes.Summary.Request_Core.utm_source != undefined) {
        data1["utm_source"] = quotes.Summary.Request_Core.utm_source;
    } 
    if (utm_source !== null && utm_source !== "" && utm_source != undefined) {
        data1["utm_source"] = utm_source;
    }
    if (quotes.Summary.Request_Core.utm_medium !== null && quotes.Summary.Request_Core.utm_medium !== "" && quotes.Summary.Request_Core.utm_medium != undefined) {
        data1["utm_medium"] = quotes.Summary.Request_Core.utm_medium;
    }
    if (utm_medium !== null && utm_medium !== "" && utm_medium !== undefined) {
        data1["utm_medium"] = utm_medium;
    }
    if (quotes.Summary.Request_Core.utm_campaign !== null && quotes.Summary.Request_Core.utm_campaign !== "" && quotes.Summary.Request_Core.utm_campaign != undefined) {
        data1["utm_campaign"] = quotes.Summary.Request_Core.utm_campaign;
    }
    if (utm_campaign !== null && utm_campaign !== "" && utm_campaign !== undefined) {
        data1["utm_campaign"] = utm_campaign;
    }
    if (quotes.Summary.Request_Core.campaign_id !== null && quotes.Summary.Request_Core.campaign_id !== "" && quotes.Summary.Request_Core.campaign_id != undefined) {
        data1["campaign_id"] = quotes.Summary.Request_Core.campaign_id;
    }
    if (campaign_id !== null && campaign_id !== "" && campaign_id !== undefined) {
        data1["campaign_id"] = campaign_id;
    }

    //// TPPD Made For TW On 5 Apr 2019 But Commented For Now 
    if (ProductIdVal == 10) {
        data1["is_tppd"] = $("#IsTPPD").val() == "yes" ? "yes" : "no";
        data1["od_disc_perc"] = $("#ODDiscountPercent").val() == "" ? 0 : parseInt($("#ODDiscountPercent").val());
    }
    if (request.hasOwnProperty('lead_type')) {
        if (request.lead_type === "erp_lead") {
            data1["is_renewal_proceed"] = request.is_renewal_proceed;
            data1["lead_type"] = request.lead_type;
            data1["lead_status"] = request.lead_status;
            data1["erp_uid"] = request.erp_uid;
            data1["utm_source"] = request.utm_source;
            data1["erp_qt"] = request.erp_qt;
            data1["lead_id"] = request.lead_id;
        }
        if (request.lead_type === "sync_contacts" || request.lead_type === "lead" || request.lead_type === "renewal") {
            data1["lead_id"] = request.lead_id;
            data1["lead_type"] = request.lead_type;
            data1["lead_status"] = request.lead_status;
        }
    }
    if (data1["utm_source"] && data1["utm_campaign"]) {
        if (data1["utm_source"] === "LERP_FRESH" && data1["utm_campaign"] === "Fresh_Quotes") {
            data1["lead_type"] = "LERP_FRESH";
        }
    }
    if (request.regno_rtocode) {
        if (request.regno_rtocode !== null && request.regno_rtocode !== "" && request.regno_rtocode !== undefined) {
            data1["regno_rtocode"] = request.regno_rtocode;
        }
    }
    if (ProductIdVal == 12) {
        data1["imt23"] = $("#IMT23").val() == "Yes" ? "yes" : "no";
        data1["non_fairing_paying_passenger"] = $("#NonFairingPayingPassenger").val() == "Yes" ? "yes" : "no";
        data1["fairing_paying_passenger"] = $("#FairingPayingPassenger").val() == "Yes" ? "yes" : "no";
        data1["other_use"] = $("#OtherUse").val() == "Yes" ? "yes" : "no";
        data1["own_premises"] = $("#OwnPremises").val() == "Yes" ? "yes" : "no";
        data1["emp_pa"] = $("#PersonalAccidentCoverForEmployee").val() == "Yes" ? "yes" : "no";
        data1["conductor_ll"] = $("#Conductor_Ll").val() == "Yes" ? "yes" : "no";
        data1["coolie_ll"] = $("#Coolie_Ll").val() == "Yes" ? "yes" : "no";
        data1["cleaner_ll"] = $("#Cleaner_Ll").val() == "Yes" ? "yes" : "no";
        data1["geographicalareaext"] = $("#GeographicalAreaExt").val() == "Yes" ? "yes" : "no";
        data1["additionaltowing"] = $("#AdditionalTowing").val() == "Yes" ? "yes" : "no";
        data1["fibreglasstankfitted"] = $("#FibreGlassTankFitted").val() == "Yes" ? "yes" : "no";
        data1["vehicle_class"] = request.vehicle_class;
        data1["vehicle_class_code"] = request.vehicle_class_code;
        data1["vehicle_sub_class"] = request.vehicle_sub_class;
    }
    console.log(JSON.stringify(data1));
    var PremiumInitiateURL = '/quote/premium_initiate';
    var obj_horizon_data = Horizon_Method_Convert(PremiumInitiateURL, data1, "POST");
    $.ajax({
        type: "POST",
        data: JSON.stringify(obj_horizon_data['data']),
        url: obj_horizon_data['url'],
        //url: GetUrl() + "/quote/premium_initiate",
        //data: JSON.stringify(data1),
        dataType: "json",
        contentType: 'application/json;',
        success: function (data) {
            $("#spinner").css('display', 'none');/*
            if (data.Msg == 'Not Valid Request') {
                $(".popclosepos").click();
                $.alert("Error While Processing Request");
                console.log("Error: " + data.Details[0]);
            }*/
            if ((data.hasOwnProperty("Details")) && ((data.hasOwnProperty("Summary")) ? ((data.Summary.hasOwnProperty("Request_Unique_Id")) || (data.Summary.Request_Unique_Id == "")) : true)) {
                var msg = data.Details.join('<br/>');
                $.alert(msg);
            }
            else {
                console.log("Success:", JSON.stringify(data));
                if (ProductIdVal == 1) { window.location.href = "/car-insurance/quotes?SID=" + data.Summary.Request_Unique_Id + "&ClientID=" + clientid; }
                else if (ProductIdVal == 10) { window.location.href = "/two-wheeler-insurance/quotes?SID=" + data.Summary.Request_Unique_Id + "&ClientID=" + clientid; }
                else { window.location.href = "/car-insurance/quotes?SID=" + data.Summary.Request_Unique_Id + "&ClientID=" + clientid; }
            }
        },
        error: function (data) {
            $("#spinner").css('display', 'none');
            console.log("Failed " + data);
        }
    });
});

function PremiumCompare() {
    var InsSelectedList = [];
    //$('input:checkbox.ChkCompare').each(function () {
    //    if (this.checked) { InsSelectedList.push($(this).attr('InsId'));  }
    //});
    $('#PremiumCompare').show();
    $("#AddonSection").html("");
    $("#AddonSection").html('<div class="fieldv main" id="QCAddonPremium"><span class="list_item">Addon Details (C)&nbsp;&nbsp;<i class="fa fa-plus" style="font-size:13px"></i></span></div>');
    $("#AddonSection").append(AddonSection);
    for (var i = 0; i < InsList.length; i++) {
        var InsID = InsList[i];
        var ImgSrc = $("#Img_" + InsID).attr('src');
        $('.Section_' + InsID).remove();
        $("#QCins_logo").append('<span class="Section_' + InsID + '"><img id="Img' + InsID + '" src="' + ImgSrc + '" alt=""><i class="fa fa-share-alt1" style="font-size:15px"></i></span>');
        $("#QCbuybtn").append('<span class="Section_' + InsID + '"><div class="buy_btn" ><a class="Url' + InsID + '">&#8377 ' + $(".PB_" + InsID).attr('netpayablepayablepremium') + '</a></div></span>');
        $("#QCIDV").append('<span class="Section_' + InsID + '">&#8377 ' + $(".PB_" + InsID).attr('idv') + '</span>');
        $("#QCOwnDamagePrem").append('<span class="Section_' + InsID + '">&#8377 ' + $(".PB_" + InsID).attr('premium') + '</span>');

        $("#QCBasicOD").append('<span class="Section_' + InsID + '">&#8377 ' + $(".PB_" + InsID).attr('basicowndamage') + '</span>');
        $("#QCUnderwriterLoading").append('<span class="Section_' + InsID + '">&#8377 ' + $(".PB_" + InsID).attr('underwriterloading') + '</span>');
        $("#QCODDisc").append('<span class="Section_' + InsID + '">&#8377 ' + $(".PB_" + InsID).attr('oddiscount') + '</span>');
        $("#QCNEAcc").append('<span class="Section_' + InsID + '">&#8377 ' + $(".PB_" + InsID).attr('nonelectricalaccessoriespremium') + '</span>');
        $("#QCEAcc").append('<span class="Section_' + InsID + '">&#8377 ' + $(".PB_" + InsID).attr('electricalacessoriespremium') + '</span>');
        $("#QCAntiTheftDisc").append('<span class="Section_' + InsID + '">&#8377 ' + $(".PB_" + InsID).attr('antitheftdiscount') + '</span>');
        $("#QCVolDisc").append('<span class="Section_' + InsID + '">&#8377 ' + $(".PB_" + InsID).attr('voluntarydeductions') + '</span>');
        $("#QCNCB").append('<span class="Section_' + InsID + '">&#8377 ' + $(".PB_" + InsID).attr('noClaimBonus') + '</span>');

        $("#QCTPPrem").append('<span class="Section_' + InsID + '">&#8377 ' + $(".PB_" + InsID).attr('totalliabilitypremium') + '</span>');
        $("#QCBTPPrem").append('<span class="Section_' + InsID + '">&#8377 ' + $(".PB_" + InsID).attr('thirdpartyliablitypremium') + '</span>');
        if ($(".PB_" + InsID).attr('personalaccidentcoverfornamedpassenger') != undefined) {
            $("#QCPANPass").append('<span class="Section_' + InsID + '">&#8377 ' + $(".PB_" + InsID).attr('personalaccidentcoverfornamedpassenger') + '</span>');
        }
        else { $("#QCPANPass").append('<span class="Section_' + InsID + '"> N.A. </span>'); }
        $("#QCPAUPass").append('<span class="Section_' + InsID + '">&#8377 ' + $(".PB_" + InsID).attr('personalaccidentcoverforunammedpassenger') + '</span>');
        $("#QCPAODriver").append('<span class="Section_' + InsID + '">&#8377 ' + $(".PB_" + InsID).attr('personalaccidentcoverforownerdriver') + '</span>');
        $("#QCAddonPremium").append('<span class="Section_' + InsID + '">&#8377 ' + $(".PB_" + InsID).attr('addonpremium') + '</span>');

        $("#QCNetPrem").append('<span class="Section_' + InsID + '">&#8377 ' + $(".PB_" + InsID).attr('totalpremium') + '</span>');
        $("#QServiceTax").append('<span class="Section_' + InsID + '">&#8377 ' + $(".PB_" + InsID).attr('servicetax') + '</span>');

        $("#QCbuybtn1").append('<span class="Section_' + InsID + '"><div class="buy_btn" ><a class="Url' + InsID + '">&#8377 ' + $(".PB_" + InsID).attr('netpayablepayablepremium') + '</a></div></span>');

        var tempAd = $(".PB_" + InsID).attr("addonname").split("+");
        if (tempAd != "") {
            for (var j = 0; j < tempAd.length - 1; j++) {
                var Addon_Name = tempAd[j].split("-")[0];
                var Addon_Name1 = Addon_Name.replace(new RegExp(" ", 'gi'), "_");
                var Addon_Value = tempAd[j].split("-")[1];
                //tempAd[i].split("-")[0] + "</span><span class='pull-right'>" + tempAd[i].split("-")[1]
                if (Addon_Value > 0) {
                    $("#QC" + Addon_Name1 + "_" + InsID).html('&#8377 ' + Addon_Value);
                }
            }
        }
        $(".Url" + InsID).attr("href", $("#BuyNow" + InsID).attr('href'));
        //if (IsMobile == "True") {
        //    if (i == 0) {
        //        $(".fieldv span:nth-child(" + i + ")").addClass("visibleClass").removeClass("hiddenClass");
        //    }
        //    else {
        //        $(".fieldv span:nth-child(" + (i + 1) + ")").addClass("hiddenClass").removeClass("visibleClass");
        //    }
        //}        
    }

    if ($("#ODPAC").val() == "0") {
        //$(".ODPACDiv").hide();
    }

    $(".sub").css("display", "none");

    $('input:checkbox.ChkCompare').each(function () {
        if (this.checked) { InsSelectedList.push($(this).attr('InsId')); $(".Section_" + $(this).attr('InsId')).show(); $(".AddonSection_" + $(this).attr('InsId')).show(); }
        else { $(".Section_" + $(this).attr('InsId')).remove(); $(".AddonSection_" + $(this).attr('InsId')).remove(); }
    });
    if (ProductIdVal == 10) {
        $("#QCPANPass").hide();
    }

    $(".commonshare").hide();
}

$('#ComparePopup').on('click', function (e) {
    var InsSelectedList = [];
    $('input:checkbox.ChkCompare').each(function () {
        if (this.checked) { InsSelectedList.push($(this).attr('InsId')); }
    });
    if (InsSelectedList.length > 1) { PremiumCompare(); }
    else if (InsList.length < 2) { $.alert("We Cant Compare Less Than 2 Insurers"); }
    else { $.alert("Select More Than 1 Insurers For Compare"); }
});

//Reset For All Quote Page
function ClearValues(Section) {
    switch (Section) {
        case 'IDV':
            $("#ExpectedIDV").val("");
            break;
        case 'Cover':
            CheckOwnerDriverPersonalAccidentCover("Yes");

            CheckPersonalAccidentCoverforDriver("No");
            CheckPaidDriverPersonalAccidentCover("No");
            CheckUnnamedPassenger('0');

            CheckIMT23("No");
            CheckNonFairingPayingPassenger("No");
            CheckFairingPayingPassenger("No");
            CheckOtherUse("No");
            CheckOwnPremises("No");
            CheckPersonalAccidentCoverForEmployee("No");
            CheckConductor_Ll("No");
            CheckCoolie_Ll("No");
            CheckCleaner_Ll("No");
            CheckGeographicalAreaExt("No");
            CheckAdditionalTowing("No");
            CheckFibreGlassTankFitted("No");
            CheckIsTPPD("No");
            CheckLoanWaiver("No");

            $("#ElectricalAccessories").val("");
            $("#NonElectricalAccessories").val("");
            $("#ErrorElectricalAccessories").hide();
            $("#ErrorNonElectricalAccessories").hide();
            break;
        case 'Discount':
            CheckOwnPremises("No");
            $("#AntiTD1").prop("checked", true);
            $('#IsAntiTheftDevice').val("no"); $("#IsAntiTheftDevice").html("No");
            $("#Association1").prop("checked", true);
            $("#MemberofAA").html("No");
            $("#Voluntry1").prop("checked", true);
            $("#ODDiscountPercent").val('0');
            $("#VoluntaryDeduction").html("No");
            break;
    }
}

var InsSelMaxCount = 5;
var SelectedInsurerCount = 0;
$(document).on("click", ".ChkCompare", function () {
    SelectedInsurerCount = 0;
    $('input:checkbox.ChkCompare').each(function () {
        if (this.checked) { SelectedInsurerCount++; }
    });

    if (SelectedInsurerCount > InsSelMaxCount) {
        $.alert("You Can Select Upto 5 Insurers"); return false;
    }
    else { $("#InsSelCount").text(SelectedInsurerCount); }
});
$(document).on("click", "#CloseComparePremium", function () {
    $("#PremiumCompare").hide();
});