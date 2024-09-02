var srn;
var html_quote = $(".quoteboxparent").html();
var html_addon = $('#Addons').html();
var html_addon_bundle = $('#BundleEdit').html();
var html_addon_bundle_Plan = $('.addons').html();
var html_addon_bundle_Plan_details = $('.BundleAddonDisplay').html();

var quotes;
var crn = 0;
var VehInsSubType = "";
var insurer_count;
var Product_id;
var Product_Name;
var StatusCount = 0;
var CoverCount = 0;
var DiscountCount = 0;
var AddOnSelectedList = [];
var IsLoad = true;
var BundleResponse = {};
var AddonType = "Stanalone";
var AgentType;
var IsCustomer = 0;
var Response_Global;
var udid;
var clientid = 2;
var search_summary;
var max_calling_times = 12;
var MaxCall = 11;
var long_wait = 2;
var Name = "";
var app_version;
var IsAddonPresent = false, IsBundlePresent = false;
var EmailVal = "";
var siteURL = "";

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
    'addon_emergency_transport_hotel': 'Emergency transport and Hotel expenses'
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
    'addon_emergency_transport_hotel': 'ETHE'
};

$(document).ready(function () {
	siteURL =  window.location.href;
    $(".cls").click(function (e) {
        $(".popup_overlay, .shareCode").slideUp();

    })

    $("#info").click(function (e) {

        $(".popup_overlay").slideDown();
        $(".popup_overlay > div").hide();
        $(".structure_info").show();


    })

    $(".more_detail").click(function (e) {

        $(".popup_overlay").slideDown();
        $(".popup_overlay > div").hide();
        $(".structure_prem_break").show();


    })

    $("#cov_more").click(function (e) {

        $(".popup_overlay").slideDown();
        $(".popup_overlay > div").hide();
        $(".structure_cov_more").show();


    })
    $("#addons").click(function (e) {

        $(".popup_overlay").slideDown();
        $(".popup_overlay > div").hide();
        $(".structure_addon").show();

    })
    $("#filter").click(function (e) {

        $(".popup_overlay").slideDown();
        $(".popup_overlay > div").hide();
        $(".structure_filter").show();

    })

    $("#share").click(function (e) {

        $(".shareCode").slideDown();

    })

    $(".more_details").hide();
    $(".bundle").click(function (e) {

        $(".tab_wrapper div").removeClass("active");
        $(this).addClass("active");


        $("#bundle").css("display", "block");
        $("#st_alone").css("display", "none")

    })
    $(".standalone").click(function (e) {

        $(".tab_wrapper div").removeClass("active");
        $(this).addClass("active");

        $("#bundle").css("display", "none");
        $("#st_alone").css("display", "block")

    })

    $(".more_detail").click(function (e) {

        $(".popup_overlay").slideDown();
        $(".popup_overlay > div").hide();
        $(".structure_prem_break").show();


    })

    $window = $(window);
    $window.scroll(function () {
        $scroll_position = $window.scrollTop();
        if ($scroll_position > 1) { // if body is scrolled down by 300 pixels
            $('.tab_wrapper').addClass('sticky');

            header_height = $('.tab_wrapper').innerHeight();
            $('body').css('padding-top', header_height);
        } else {
            $('body').css('padding-top', '0');
            $('.tab_wrapper').removeClass('sticky');
        }

    });

    $(".detail_heading").click(function (e) {

        var current = $(this).parent([0]).find(".more_details");
        $(".more_details").not(current).slideUp();
        current.slideToggle();

    })
    srn = getParameterByName('SRN');
    udid = srn.split('_')[1];
    $('#main_div').hide();


    getQuote();
    Get_Search_Summary();
    Get_Saved_Data();
    if (location.href.indexOf("www") > 0) {
        //max_calling_times = 2;
        //long_wait = 1;
        max_calling_times = 4; long_wait = 0; MaxCall = 3;
    }

});


function Reload() {
    location.reload(true)
};
function setProduct(product_id) {

    if (product_id == 1) {
        Product_id = 1;
        Product_Name = "Car";

    } else if (product_id == 10) {
        Product_id = 10;
        Product_Name = "Bike";
    }

}
function GeteditUrl() {
    var url = window.location.href;
    //alert(url.includes("health"));
    var newurl;
    newurl = "http://qa.policyboss.com";
    if (url.includes("localhost")) {
        newurl = "http://localhost:3000";
    } else if (url.includes("qa")) {
        newurl = "http://qa.policyboss.com";
    } else if (url.includes("www") || url.includes("cloudfront")) {
        newurl = "https://www.policyboss.com";
    }
    return newurl;
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
function getParameterByName(name) {

    var url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
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
function append_quotes() {
    insurer_count = 0;
    // for loop to add premiums through jquery...finally hahaha....i know
    $('.quoteboxparent').show();
    if (crn <= 0) {
        ////;
        $('.twoWheelerImageHeader').append(' ' + quotes.Summary.PB_CRN);
        crn = quotes.Summary.PB_CRN;
        $('.CRN').text(crn);
    }
    $(".quoteboxparent").empty();
    for (var i = 0; i < quotes.Response.length ; i++) {

        if (['LM003', 'LM004', 'LM005', 'LM006'].indexOf(quotes.Response[i].Error_Code) == -1) {
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
        current_div.children('.dynamic').removeClass('hidden');
        if (!current_div.children('.preloader').hasClass('hidden'))
            current_div.children('.preloader').addClass('hidden');

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
    $('#insurer_count').text(insurer_count);

    if (insurer_count > 0) {

        //Addon filter
        var common_addon_list = quotes.Summary.Common_Addon;
        $('#Addons').empty();
        if (Object.keys(quotes.Summary.Common_Addon).length > 0) { // Checking Whether Addons Present Or Not (with Count)
            var AddOnCount = 0;
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
            $('#st_alone').html("No Addons Available").css({ "text-align": "center" }, { "color": "#1d2955" }, { "font-family": "unset" });
        }

        console.log("Addons:" + Object.keys(quotes.Summary.Common_Addon).length);
        //if (Object.keys(quotes.Summary.Common_Addon).length <= 0) {
        //    $('#Addons').html("No Addons Available").css("text-align", "center");
        //}

        // check unckeck based on previous search //Object.keys(quotes.Summary.Addon_Request).length > 0
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

        //var divQts = $('.quoteboxmain').pbsort(true, "Premium");
        //$('.quoteboxparent').html(divQts);

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

    if (insurer_count == 0) {
        $("#BundleEdit").html('<div style="margin: 10px;text-align: center;">No Addon Bundle Plan Available</div>');
        $("#st_alone").html('<div style="margin: 10px;text-align: center;">No Addons Available</div>');
    }
    if (VehInsSubType != null && VehInsSubType != "") {

        var VIST = VehInsSubType.split('CH_');
        if (VIST[0] == 0) {
            $("#IDVSection").text("Not Applicable");
            $(".IDVDisplay").html("");
            $(".IDVRange").html("");
            $(".IDVDisplay").html("IDV : Not Applicable");
            $("#divClaimYesNo, .Save_More, .IDVcov_row, .Accessoriescov_row, .Save_Morecov_row, #addons, #lidiscountedit").hide();
            $(".divCoverMob").addClass('col-xs-12').removeClass('col-xs-6');
            $(".divAddon").attr('data-toggle', false);
            $(".divIDV").attr('data-toggle', false);
            $(".divDiscount").attr('data-toggle', false);
            if (Product_id == 10) { $(".divCover").hide(); }

            $("#liidvedit").attr('data-target', false);
            $("#lidiscountedit").attr('data-target', false);
            $("#TotalODPremium").text("N.A.");
        }
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
    $(".BasicMD").hide();
}

function GetUrl() {
    var url = window.location.href;
    //alert(url.includes("health"));
    var newurl;
    newurl = "http://qa-horizon.policyboss.com:3000";
    if (url.includes("request_file")) {
        // newurl = "http://qa-horizon.policyboss.com:3000";
        newurl = "http://localhost:3000";
        //newurl="http://localhost:50111";
    } else if (url.includes("qa")) {
        newurl = "http://qa-horizon.policyboss.com:3000";
    } else if (url.includes("www") || url.includes("cloudfront")) {
        newurl = "http://horizon.policyboss.com:5000";
    }
    return newurl;
}
function SetUrl() {
    var url = window.location.href;
    //alert(url.includes("health"));
    var newurl;
    newurl = "http://qa-horizon.policyboss.com:3000";
    if (url.includes("request_file")) {

        newurl = "http://localhost:50111";
    } else if (url.includes("qa")) {
        newurl = "http://qa.policyboss.com";
    } else if (url.includes("www") || url.includes("cloudfront")) {
        newurl = "https://www.policyboss.com";
    }
    return newurl;
}

function getQuote() {
    ////;
    $('#QuoteLoader').show();
    ////;;
    var mainUrl = GetUrl() + "/quote/premium_list_db";

    var str1 = {
        "search_reference_number": srn,
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9"
    };

    var obj_horizon_data = Horizon_Method_Convert("/quote/premium_list_db", str1, "POST");
    $.ajax({
        type: "POST",
        //data: JSON.stringify(str1),
        //url: mainUrl,
        //data: JSON.stringify(obj_horizon_data['data']),
        //url: obj_horizon_data['url'],
		data : siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) :  JSON.stringify(str1),
		url :  siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/premium_list_db" ,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            console.log(data);
            Response_Global = data;
            clientid = data.Summary["Client_Id"];
            udid = data.Summary.Request_Core.udid;
            AgentType = clientid == 3 ? "POSP" : "NonPOSP";
            ss_id = data.Summary.Request_Core.ss_id;
            app_version = data.Summary.Request_Core.app_version

            setProduct(data.Summary.Request_Core.product_id);

            if (app_version == "FinPeace" && ss_id > 0) {
                IsCustomer = 0;
            } else {
                IsCustomer = 1;
            }

            //Set img 

            if (Product_id == 1) {
                $('#vehicle_img').attr('src', "./images/sample-car.jpg");
                $('.bike_cover').hide();
                $('.car_cover').show();


            } else if (Product_id == 10) {
                $('#vehicle_img').attr('src', "./images/sample-bike.jpg");
                $('.car_cover').hide();
                $('.bike_cover').show();
            }

            // Replacing fields
            $('#makemodelname').text()
            //$('.idv_min').text(data['Summary']['Idv_Min']);
            //$('.idv_max').text(data['Summary']['Idv_Max']);
            //
            // $('.premium_min').text(data['Summary']['Premium_Min']);
            //$('.premium_max').text(data['Summary']['Premium_Max']);
            $('#CRN').text(data['Summary']['PB_CRN']);
            VehInsSubType = data.Summary.Request_Core['vehicle_insurance_subtype'];
            quotes = data;
            append_quotes();


            var CreateTime = new Date(data['Summary'].Created_On);
            var CurrentTime = new Date();
            var DateDiff = Date.parse(CurrentTime) - Date.parse(CreateTime);
            console.log(DateDiff);
            StatusCount++;
            var is_complete = false;
            if (StatusCount > 3 || DateDiff >= 30000 || data['Summary']['Status'] === "complete") {
                is_complete = true;
                $('#QuoteLoader').hide();
                $('#main_div').show();
            }
            if (is_complete === false) {

                setTimeout(() => {
                    getQuote();
                    $('#insurer_count').text("");
                    $('#insurer_count').text(insurer_count);
                }, 3000);
            }
        },

        error: function (result) {
            // alert("Error");

        }

    });
}

function OnEdit() {
    var Hrefval = "";
    if (Product_id == 1) { Hrefval = "./carinsurance.html?SRN=" + search_summary.Summary.Request_Unique_Id + "&ClientID=" + search_summary.Summary.Client_Id; }
    else if (Product_id == 10) { Hrefval = "./bikeinsurance.html?SRN=" + search_summary.Summary.Request_Unique_Id + "&ClientID=" + search_summary.Summary.Client_Id; }

    window.location.href = Hrefval;

}
var request;
function Get_Search_Summary() {

    var mainUrl = GetUrl() + "/quote/premium_summary";
    var str1 = {
        "search_reference_number": srn,
        "udid": udid,
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9"
    };
    var obj_horizon_data = Horizon_Method_Convert("/quote/premium_summary", str1, "POST");
    $.ajax({
        type: "POST",
        //data: JSON.stringify(str1),
        //url: mainUrl,
        //data: JSON.stringify(obj_horizon_data['data']),
        //url: obj_horizon_data['url'],
		data : siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) :  JSON.stringify(str1),
		url :  siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/premium_summary" ,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (response) {

            console.log(response);
            var vehicle = response.Master.Vehicle;
            request = response.Request;
            original_request = request;
            search_summary = response;
            var rto = response.Master.Rto;
            $('.makemodelname').text(vehicle['Description']);
            Product_id = request.product_id;
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
            udid = request.udid;
            //$('#ContactName').text(response.Request.first_name);
            Name = request.first_name;
            $('#CustomerReferenceID').val(crn);
            $(".CRN").val(crn).text(crn);
            $('#Variant').text(vehicle.Make_Name + " " + vehicle.Model_Name + " " + vehicle.Variant_Name);
            $('#Variant1').text(vehicle.Make_Name + " " + vehicle.Model_Name + " " + vehicle.Variant_Name);
            $('#RTOName').text(response.Master.Rto.RTO_City);




            // Personal Accident Cover For Owner Driver 02-01-2019
            $("#ODPAC").val(request.pa_owner_driver_si);
            if (request.pa_owner_driver_si == 0) {

                $("#divIsHavingValidDL").show();
                $("#OwnerDriverPersonalAccidentCover").text("No").val("No"); $("#ODPAC1").attr('checked', true);
            }
            if (request.pa_owner_driver_si == 1500000) {
                $("#OwnerDriverPersonalAccidentCover").text("Yes").val("Yes");
                $("#ODPAC2").attr('checked', true);
                $('#divIsHavingValidDL').hide();
                $('#divIsHavingSCPA').hide();
            }

            // Driving Licence
            if (request.is_having_valid_dl == false) { $('#IsHavingValidDL').val("No").text("No"); $("#IsHavingValidDL1").attr('checked', true); }
            if (request.is_having_valid_dl == true) {

                $('#OwnerDriverPersonalAccidentCover').text("No").val("No"); $("#ODPAC1").attr('checked', true);
                $('#divIsHavingSCPA').hide();
                $('#IsHavingValidDL').val("Yes").text("Yes"); $("#IsHavingValidDL2").attr('checked', true);
            }

            //Standalone PA Cover
            if (request.is_opted_standalone_cpa == false) {
                $("#IsHavingSCPA").text("No").val("No"); $("#IsHavingSCPA1").attr('checked', true);
            }
            if (request.is_opted_standalone_cpa == true) {
                $('#divIsHavingValidDL').show();
                $('#ODPAC').val(0); $("#IsHavingSCPA").text("Yes").val("Yes"); $("#IsHavingSCPA2").attr('checked', true);
            }
            if (request.is_opted_standalone_cpa == false && request.is_having_valid_dl == false) {
                if (request.pa_owner_driver_si == 1500000) {
                    $('#OwnerDriverPersonalAccidentCover').text("Yes").val("Yes"); $("#ODPAC2").attr('checked', true);

                    $('#divIsHavingValidDL').hide();
                    $('#divIsHavingSCPA').hide();
                }
            }
            if (request.is_opted_standalone_cpa == true && request.is_having_valid_dl == false) {
                if (request.pa_owner_driver_si == 1500000) {
                    $('#OwnerDriverPersonalAccidentCover').text("Yes").val("Yes"); $("#ODPAC2").attr('checked', true);
                    $('#divIsHavingValidDL').hide();
                    $('#divIsHavingSCPA').hide();
                }
                if (request.pa_owner_driver_si == 0) {

                    $('#OwnerDriverPersonalAccidentCover').text("No").val("No"); $("#ODPAC1").attr('checked', true);
                }
            }

            if ((request.is_opted_standalone_cpa == false && request.is_having_valid_dl == true) || (request.is_opted_standalone_cpa == true && request.is_having_valid_dl == true)) {
                $('#divIsHavingValidDL').show();
                $('#OwnerDriverPersonalAccidentCover').text("No").val("No"); $("#ODPAC1").attr('checked', true);
            }



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
            //Get_Saved_Data();

            var Hrefval = "";
            if (vehicle.Product_Id_New == 1) { Hrefval = "/carinsurance.html?SRN=" + search_summary.Summary.Request_Unique_Id + "&ClientID=" + search_summary.Summary.Client_Id; }
            else if (vehicle.Product_Id_New == 10) { Hrefval = "/bikeinsurance?SRN=" + search_summary.Summary.Request_Unique_Id + "&ClientID=" + search_summary.Summary.Client_Id; }
            //if (vehicle.Product_Id_New == 1) { Hrefval = "/car-insurance-gamma?SID=" + search_summary.Summary.Request_Unique_Id + "&ClientID=" + search_summary.Summary.Client_Id; }
            //else if (vehicle.Product_Id_New == 10) { Hrefval = "/twowheeler-insurance-gamma?SID=" + search_summary.Summary.Request_Unique_Id + "&ClientID=" + search_summary.Summary.Client_Id; }
            $("#EditInfo").attr("href", Hrefval);
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
            // var Name = "";
            // if (request.first_name != "" && checkTextWithSpace(request.first_name)) {
            // Name = request.first_name + " ";
            // if (request.middle_name != "" && checkTextWithSpace(request.middle_name)) {
            // Name = Name + request.middle_name + " ";
            // }
            // if (request.last_name != "" && checkTextWithSpace(request.last_name)) {
            // Name = Name + request.last_name;
            // }
            // }
            // else { $("#divNameDetails").hide(); }
            // $("#NameDetails").text(Name);
            // if (request.mobile != "" && request.mobile != null) {
            // $("#MobileDetails").text(request.mobile);
            // if (request.mobile == "9999999999") {
            // $("#MobileDetails").text("NA");
            // }
            // } else { $("#divMobileDetails").hide(); }
            // if (request.email != "" && request.email != null) {
            // $("#EmailDetails").text(request.email);
            // if ((request.email).indexOf('@testpb.com') > 1) {
            // $("#EmailDetails").text("NA");
            // }
            // } else { $("#divEmailDetails").hide(); }

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

function CheckVoluntary(value) {
    if (value == "0") { $("#VoluntaryDeduction").html("No"); }
    else { $("#VoluntaryDeduction").html(value); }
    $("#VoluntaryDeduction").val(value);
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

function checkTextWithSpace(input) {
    var pattern = new RegExp('^[a-zA-Z ]+$');
    if (pattern.test(input) == false) { return false; }
    else { return true; }
}
function ShowVehInsSubType(VISTCode) {
    var InsText = "";
    switch (VISTCode) {
        case '3CH_0TP': InsText = "Comprehensive For 3 Yrs"; break;
        case '5CH_0TP': InsText = "Comprehensive For 5 Yrs"; break;
        case '1CH_2TP': InsText = "Comprehensive For 1 Yr + T.P. For 2 Yrs"; break;
        case '1CH_4TP': InsText = "Comprehensive For 1 Yr + T.P. For 4 Yrs"; break;
        case '0CH_3TP': InsText = "T.P. Only For 3 Yrs"; break;
        case '0CH_5TP': InsText = "T.P. Only For 5 Yrs"; break;
        case '1CH_0TP': InsText = "Comprehensive Plan For 1 Yr"; break;
        case '0CH_1TP': InsText = "T.P. Only For 1 Yr"; break;
    }
    return InsText;
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
        case 33: InsText = "Liberty Videocon"; break;
        case 35: InsText = "Magma HDI"; break;
        case 46: InsText = "Edelweiss"; break;
    }
    return InsText;
}

$(document).on('click', '#SelectAllAddons', function () {
    $('#Addons').find('input[type=checkbox]').click();
    if ($(this).is(':checked') == true) { $('#Addons').find('input[type=checkbox]').prop('checked', true); }
    else { $('#Addons').find('input[type=checkbox]').prop('checked', false); }
});

function CheckAddons() {
    var Addon_Check = $('#Addons :checkbox').length == $('#Addons :checkbox').filter(':checked').length;
    if (Addon_Check) { $('#SelectAllAddons').prop('checked', true); }
    else { $('#SelectAllAddons').prop('checked', false); }
}
$(document).on("click", "#Addons .chk-col-indigo", function () {
    CheckAddons();
});

function handle_addon_addition12() {
    ////;
    var NewAddOnSelectedList = [];
    BundleResponse = {};
    NewAddOnSelectedList = AddOnSelectedList;
    var BundleHtml = $("#BundleEdit").html();
    $("#BundleBody").html("");
    var InsurerCount = 0;
    $("#BundleEdit").html("");
    if (quotes.Response.length > 0) {
        var addon_checked = $('#Addons').find('input[type=checkbox]:checked');
        var addon_unchecked = $('#Addons').find("input:checkbox:not(:checked)");

        $.each(quotes.Response, function (index, value) {
            //////;
            if (value.Error_Code == "") {
                var InsID = value.Insurer.Insurer_ID;
                var InsName = value.Insurer.Insurer_Code;
                var addon_amount = 0;//value.Premium_Breakup.net_premium;
                var addon_premium_breakup = "";
                $($('#divQuitList' + InsID).children()[1]).children('.clearfix').nextAll().remove();
                // $($('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.addon-selected')).html("");
                $('#divQuitList' + InsID).children('.quotechild').children('.premium_div').children('.Premium').text("")
                $($('#divQuitList' + InsID).children('.addon-selected')).hide();
                //Addon for Mobile
                $($('#divQuitList' + InsID).children('.addon-selectedMobile')).html("");

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
                            $($('#divQuitList' + InsID).children('.addon-selected')).append('<span class="BlockSections" title="' + addon_Fullname + '">' + addon_name + ' <span>₹ ' + Math.round(addon_premium) + '</span></span>');

                            //For Mobile
                            $('#divQuitList' + InsID).children('.addon-selectedMobile').append('<div  class="ad" title="' + addon_Fullname + '">' + addon_Fullname + ' </div><div  class="ad_p"><i class="fa fa-inr"></i>' + Math.round(addon_premium) + '</div>');
                        }
                        //else {
                        //    $($('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.boxLeft').children('.addon-selected')).append('<div><button class="btn btn-danger btn-xs btn-block waves-effect" type="button">' + addon_name + ' <span class="badge">NA</span></button></div>');
                        //}
                    });
                }
                // BUFFET
                if (value.Addon_Mode == "BUFFET") {
                    //////;
                    var amount = [];
                    var BuffetPlan = value.Plan_List;
                    var AddonArray = "";
                    var addonbundle;
                    $("#BundleBody").append('<br><div id="div' + InsID + '"><div class="AddonPlanHeading">' + InsName + '</div>');
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
                        var addon_amount = 0;
                        var arr = [], arr1 = [], arrFullName = [];
                        //var AddonChecked = false;
                        BundleAddonDisplay = $(".AddonDisplay_" + InsID + "_" + BuffetPlanName).html();
                        $(".AddonDisplay_" + InsID + "_" + BuffetPlanName).html("");
                        var Baseclass = "", AddonTitle = "", AddonDisplay = "";
                        BundleAddonDisplay1 = BundleAddonDisplay;
                        var addon_Fullname;

                        $.each(Plan_Addon_Breakup, function (key, v) {

                            AddonTitle = addon_list[key] + "(" + v + ")";
                            var addon_name = addon_shortlist[key];
                            addon_Fullname = addon_list[v.id];
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
                            if (typeof value.Addon_List[v.id] !== 'undefined') {

                                count++;
                                var addon_premium = value.Addon_List[v.id];
                                addon_amount += addon_premium;

                                //addon_premium_breakup += addon_name + '-' + addon_premium + '+';//Commented By Pratik On 14-02-2018
                                addon_premium_breakup += addon_Fullname + '-' + addon_premium + '+';// Added By Pratik On 14-02-2018

                                //For Mobile
                                $('#divQuitList' + InsID).children('.addon-selectedMobile').append('<div  class="ad" title="' + addon_Fullname + '">' + addon_Fullname + '</div> <div  class="ad_p"><i class="fa fa-inr"></i>' + Math.round(addon_premium) + '</div>');
                            }


                        });

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
                        $('#divQuitList' + InsID).children('.addon-selected').append('<div class="BlockSections" id="div-' + BuffetPlanName + "-" + InsID + '" name="' + addon_amount + '"><input type="radio" class="' + Baseclass + '" PlanAddon="' + arr1.join('_') + '" id="' + BuffetPlanName + "-" + InsID + '" name="' + +BuffetPlanName + "-" + InsID + '" onclick="PackageSelect(' + InsID + ',\'' + BuffetPlanName + '\')">' + BuffetPlanName1 + " (₹ <span class='Pack Pack" + InsID + "'>" + PkgNP + "</span>)" + " - (" + PackageAddon + ")" + "</div>");
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

                //For Sorting Addons Starts
                var mylist = $($('#divQuitList' + InsID).children('.addon-selected'));
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
                var total_liability_premium = value.Premium_Breakup.liability['tp_final_premium'] - 0;
                var net_premium = value.Premium_Breakup.net_premium + addon_amount;
                var service_tax = 2 * (Math.round(net_premium * 0.09) - 0);
                var od_final_premium = value.Premium_Breakup.own_damage['od_final_premium'] - 0;
                var ncb = value.Premium_Breakup.own_damage['od_disc_ncb'] - 0;

                //Added by Ajit for TATA-AIG and Bajaj for Service Tax Calculation
                // if (InsID == 11) {
                // var net_premium_without_rsa = value.Premium_Breakup.own_damage['od_final_premium'] + value.Premium_Breakup.liability['tp_final_premium'] + addon_amount;
                // net_premium = net_premium_without_rsa;
                // var flag_addon_rsa = false;
                // var addon_amount_rsa = 0;
                // if (value.Addon_List.hasOwnProperty('addon_road_assist_cover')) {
                // $.each(addon_checked, function (i, v) {
                // var addon_name = addon_list[v.id];
                // if (addon_name == 'RoadSide Assistance') { flag_addon_rsa = true; addon_amount_rsa = value.Addon_List[v.id]; }
                // });
                // }
                // if (flag_addon_rsa) { net_premium_without_rsa = Math.round(net_premium_without_rsa) - addon_amount_rsa - 0; }
                // service_tax = 2 * (Math.round(net_premium_without_rsa * 0.09)) + Math.round(addon_amount_rsa * 0.18) - 0;
                // }
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

                $('#divQuitList' + InsID).children('.quotechild').children('.premium_div').children('.Premium').text('₹ ' + rupee_format(final_premium))
                // $('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.dynamic').children('.Premium').html(' Rs.' + rupee_format(final_premium) + ' <i style="font-size:14px">(1 year) </i>');
                // $('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.dynamic').children('.btn-buy').children('.Premium').html('₹ ' + rupee_format(final_premium));// + ' <i style="font-size:14px">(1 year) </i>');
                //  $('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.dynamic').children('.btn-buy').children('.PremiumMobile').html('₹ ' + rupee_format(final_premium));

                $('#divQuitList' + InsID).attr('premium', final_premium);
                $('#divQuitList' + InsID).attr('applied_addon', count);
                $('#divQuitList' + InsID + ' .PremiumBreakup').attr('netpayablepayablepremium', rupee_format(final_premium));
                $('#divQuitList' + InsID + ' .PremiumBreakup').attr('servicetax', rupee_format(Math.round(service_tax)));
                $('#divQuitList' + InsID + ' .PremiumBreakup').attr('addonpremium', Math.round(addon_amount));
                $('#divQuitList' + InsID + ' .PremiumBreakup').attr('totalpremium', rupee_format(Math.round(net_premium)));
                $('#divQuitList' + InsID + ' .PremiumBreakup').attr('addonname', addon_premium_breakup);

                //For Displaying Message For Discount Not Selected
                var TotalDiscountVal = 0;
                TotalDiscountVal = Math.round(value.Premium_Breakup.own_damage.od_disc_anti_theft) + Math.round(value.Premium_Breakup.own_damage.od_disc_vol_deduct);
                //$('#divQuitList' + InsID + ' .PremiumBreakup').attr('totaldiscount', TotalDiscountVal);
                if (TotalDiscountVal == 0) {
                    $('#DisplayDiscount' + InsID).html("No Discount Available");
                }

                //For Displaying Message For Cover Not Selected
                var TotalCover = 0;
                TotalCover = Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.dynamic').children('.PremiumBreakup').children('.PremiumBreakup').attr('electricalacessoriespremium')).replace(/,/g, '')) + Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.dynamic').children('.PremiumBreakup').children('.PremiumBreakup').attr('nonelectricalaccessoriespremium').replace(/,/g, '')));
                if (Product_id == 10) {
                    if (TotalCover == 0) { $("#DisplayCover" + InsID).html("No Cover Available"); }
                }
                if (Product_id == 1) {
                    TotalCover +=
                                Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.dynamic').children('.PremiumBreakup').children('.PremiumBreakup').attr('legalliabilitypremiumforpaiddriver')).replace(/,/g, '')) +
                                Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.dynamic').children('.PremiumBreakup').children('.PremiumBreakup').attr('personalaccidentcoverforpaiddriver')).replace(/,/g, '')) +
                                Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.dynamic').children('.PremiumBreakup').children('.PremiumBreakup').attr('personalaccidentcoverforunammedpassenger')).replace(/,/g, '')) +
                                Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.dynamic').children('.PremiumBreakup').children('.PremiumBreakup').attr('personalaccidentcoverfornamedpassenger')).replace(/,/g, ''));
                    if (TotalCover == 0) { $("#DisplayCover" + InsID).html("No Cover Available"); }
                }
                //$('#divQuitList' + InsID + ' .PremiumBreakup').attr('totalCover', TotalCover);

                if (InsID == 35) {
                    net_premium = net_premium - 195;
                    total_liability_premium = value.Premium_Breakup.liability['tp_final_premium'] - 195;
                }

                $('#divQuitList' + InsID + ' .PremiumBreakup').attr('TotalLiabilityPremium', total_liability_premium);
                $('#divQuitList' + InsID + ' .PremiumBreakup').attr('totalpremium', rupee_format(Math.round(net_premium)));

                if (addon_checked.length > 0) { $($('#divQuitList' + InsID).children('.addon-selected')).show(); $(".trAddon").removeClass('hidden'); }
                else { $($('#divQuitList' + InsID).children('.addon-selected')).hide(); $(".trAddon").addClass('hidden'); }
                if ($($('#divQuitList' + InsID).children('.addon-selected')).html() == "") {
                    $($('#divQuitList' + InsID).children('.addon-selected')).show().html("No Add-ons Selected").css({ "text-align": "center" }, { "color": "rgb(29, 40, 85)" }, { "padding-top": "30px" });
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
        //$('.quoteboxparent').html($('.quoteboxmain').pbsort(false, "applied_addon"));

        if (BundleCount == 0) {
            IsBundlePresent = false;
            //$("#BundleEdit").html('<div style="margin: 10px;text-align: center;">No Addon Bundle Plan Available</div>');
        }
        else { IsBundlePresent = true; }
        set_minmax_premium();
    }
    $(".more_details").hide();
}

function handle_addon_addition() {

    var NewAddOnSelectedList = [];
    BundleResponse = {};
    NewAddOnSelectedList = AddOnSelectedList;
    var BundleHtml = $("#BundleEdit").html();
    $("#BundleBody").html("");
    var InsurerCount = 0;
    $("#BundleEdit").html("");
    var BundleCount = 0;
    if (quotes.Response.length > 0) {



        if (quotes.Summary.hasOwnProperty("Addon_Request") && quotes.Summary.Addon_Request != null && (Object.keys(quotes.Summary.Addon_Request).length > 0) && IsLoad == true) {
            AddonBlock(quotes);
            NewAddOnSelectedList = AddOnSelectedList;
        }

        var addon_checked = $('#Addons').find('input[type=checkbox]:checked');
        var addon_unchecked = $('#Addons').find("input:checkbox:not(:checked)");
        $.each(quotes.Response, function (index, value) {
            if (value.Error_Code == "") {
                var addon_amount = 0;//value.Premium_Breakup.net_premium;
                var addon_premium_breakup = "";
                var InsID = value.Insurer.Insurer_ID;
                var InsName = value.Insurer.Insurer_Code;
                $($('#divQuitList' + value.Insurer.Insurer_ID).children('.UlClass').children('.LiClass').children()[1]).children('.clearfix').nextAll().remove();
                $('#divQuitList' + InsID).children('.quotechild').children('.premium_div').children('.Premium').text("")
                $($('#divQuitList' + InsID).children('.addon-selected')).hide();
                //Addon for Mobile
                $($('#divQuitList' + InsID).children('.addon-selectedMobile')).html("");

                //addon label start
                var count = 0;

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
                            $($('#divQuitList' + InsID).children('.addon-selected')).append('<span class="BlockSections" title="' + addon_Fullname + '">' + addon_name + ' <span>₹ ' + Math.round(addon_premium) + '</span></span>');

                            //For Mobile
                            $('#divQuitList' + InsID).children('.addon-selectedMobile').append('<div  class="ad" title="' + addon_Fullname + '">' + addon_Fullname + ' </div><div  class="ad_p"><i class="fa fa-inr"></i>' + Math.round(addon_premium) + '</div>');
                        }
                        //else {
                        //    $($('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.boxLeft').children('.addon-selected')).append('<div><button class="btn btn-danger btn-xs btn-block waves-effect" type="button">' + addon_name + ' <span class="badge">NA</span></button></div>');
                        //}
                    });
                }
                // BUFFET
                if (value.Addon_Mode == "BUFFET") {
                    ////////;
                    var amount = [];
                    var BuffetPlan = value.Plan_List;
                    var AddonArray = "";
                    var addonbundle;
                    $("#BundleBody").append('<br><div id="div' + InsID + '"><div class="AddonPlanHeading">' + InsName + '</div>');
                    addonbundle = html_addon_bundle;
                    BundleCount++;
                    addonbundle = addonbundle.replace(new RegExp('___Insurer_Name___', 'gi'), InsName);
                    addonbundle = addonbundle.replace(new RegExp('___Insurer_Id___', 'gi'), InsID);
                    // var BundlePlanBlock = $(".addons_" + InsID).html();
                    // BundlePlanBlock = $(".BundlePlanBlock").html();
                    // $(".BundlePlanBlock").html("");
                    $("#BundleEdit").append(addonbundle);

                    //html_addon_bundle_Plan
                    BundlePlan = $(".addons_" + InsID).html();
                    $(".addons_" + InsID).html("");
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
                        if (InsID == 11 && BuffetPlanName != "Basic") {
                            Plan_Addon_Breakup["addon_repair_glass_fiber_plastic"] = 0
                        }
                        //
                        var addon_amount = 0;
                        var arr = [], arr1 = [], arrFullName = [];
                        //var AddonChecked = false;
                        BundleAddonDisplay = $(".AddonDisplay_" + InsID + "_" + BuffetPlanName).html();
                        $(".AddonDisplay_" + InsID + "_" + BuffetPlanName).html("");
                        var Baseclass = "", AddonTitle = "", AddonDisplay = "";
                        BundleAddonDisplay1 = BundleAddonDisplay;
                        var addon_Fullname;

                        $.each(Plan_Addon_Breakup, function (key, v) {

                            AddonTitle = addon_list[key] + "(" + v + ")";
                            var addon_name = addon_shortlist[key];
                            addon_Fullname = addon_list[v.id];
                            arr1.push(addon_shortlist[key]);
                            arr.push('<div  class="ad" title="' + addon_Fullname + '">' + addon_Fullname + '</div> <div  class="ad_p"><i class="fa fa-inr"></i>' + Math.round(addon_premium) + '</div>');
                            var addon_premium = v;
                            addon_amount += addon_premium;
                            amount[BuffetPlanName] = addon_amount;
                            //AddonContent = AddonContent + '<span title="' + addon_premium + '">' + addon_shortlist[key] + '</span> ';

                            // New Bundle Implementation Code
                            AddonDisplay = addon_list[key] + "(" + addon_name + ") ( ₹ " + v + ")";
                            BundleAddonDisplay = BundleAddonDisplay1.replace(new RegExp('___AddonDetails___', 'gi'), AddonDisplay);
                            $(".AddonDisplay_" + InsID + "_" + BuffetPlanName).append(BundleAddonDisplay);

                            if (typeof value.Addon_List[v.id] !== 'undefined') {
                                // ;;
                                count++;
                                var addon_premium = value.Addon_List[v.id];
                                addon_amount += addon_premium;

                                //addon_premium_breakup += addon_name + '-' + addon_premium + '+';//Commented By Pratik On 14-02-2018
                                addon_premium_breakup += addon_Fullname + '-' + addon_premium + '+';// Added By Pratik On 14-02-2018

                                //For Mobile
                                $('#divQuitList' + InsID).children('.addon-selectedMobile').append('<div  class="ad" title="' + addon_Fullname + '">' + addon_Fullname + '</div> <div  class="ad_p"><i class="fa fa-inr"></i>' + Math.round(addon_premium) + '</div>');
                            }


                        });


                        if (BuffetPlanName == "Basic" || arr.length == 0) {
                            Baseclass = "Basic";
                            arr = [];
                            //arr.push("No Addons");
                            addon_amount = 0;
                            var NP = value.Premium_Breakup.net_premium;
                        }
                        else {
                            Baseclass = "NoBasic";
                            var NP = value.Premium_Breakup.net_premium + addon_amount;
                        }
                        ////////;
                        var PackageAddon = arr.join(', ');

                        //var NP = value.Premium_Breakup.net_premium + addon_amount;
                        var ST = NP * 0.18;

                        var PkgNP = rupee_format(Math.round(NP + ST - 0));

                        //For Desktop
                        //$($('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.addon-selected')).append('<div class="BlockSections" id="div-' + BuffetPlanName + "-" + InsID + '" name="' + addon_amount + '"><input type="radio" class="' + Baseclass + '" PlanAddon="' + arr1.join('_') + '" id="' + BuffetPlanName + "-" + InsID + '" name="' + +BuffetPlanName + "-" + InsID + '" onclick="PackageSelect(' + InsID + ',\'' + BuffetPlanName + '\')">' + BuffetPlanName1 + " (₹ <span class='Pack Pack" + InsID + "'>" + PkgNP + "</span>)" + " - (" + PackageAddon + ")" + "</div>");
                        //$('#divQuitList' + InsID).children('.addon-selected').append('<div class="BlockSections" id="div-' + BuffetPlanName + "-" + InsID + '" name="' + addon_amount + '"><input type="radio" class="' + Baseclass + '" PlanAddon="' + arr1.join('_') + '" id="' + BuffetPlanName + "-" + InsID + '" name="' + +BuffetPlanName + "-" + InsID + '" onclick="PackageSelect(' + InsID + ',\'' + BuffetPlanName + '\')">' + BuffetPlanName1 + " (₹ <span class='Pack Pack" + InsID + "'>" + PkgNP + "</span>)" + " - (" + PackageAddon + ")" + "</div>");
                        // $("#BundleBody").append('<div id="div-' + BuffetPlanName + "-" + InsID + '" name="' + addon_amount + '"><input type="radio" class="' + Baseclass + '" PlanAddon="' + arr1.join('_') + '" id="' + InsID + "_" +  BuffetPlanName + '" name="' + +BuffetPlanName + "-" + InsID + '" onclick="PackageSelect(' + InsID + ',\'' + BuffetPlanName + '\')" packagepremium="' + PkgNP + '">' + BuffetPlanName1 + " (₹ <span class='Pack Pack" + InsID + "'>" + PkgNP + "</span>)" + " - (" + PackageAddon + ")" + "</div>");
                        if (PackageAddon.length != 0) {
                            //$('#divQuitList' + InsID).children('.addon-selectedMobile').append(PackageAddon)	
                        }

                        //Selecting Basic Plan Default
                        //$(".Basic").attr("checked", "true"); // Setting All Basic Plan Selected
                        if (BuffetPlan.length == 1) { $("#" + BuffetPlanName + "-" + InsID).attr("checked", true); }
                        $("#Premium_" + InsID + "_" + BuffetPlanName).text(PkgNP);


                    }
                    //$("#BundleEdit").append(addonbundle);
                    $("#BundleBody").append('</div>');
                    //$('#DisplayAddons' + InsID).find('input[type=checkbox]:checked').removeAttr('checked');

                }
                //console.log("addon_checked", addon_checked, "value.Addon_List", value.Addon_List, "Addon_List", addon_list);
                /*$.each(addon_checked, function (i, v) {
                    var addon_name = addon_shortlist[v.id];
                    var addon_Fullname = addon_list[v.id];
                    if (typeof value.Addon_List[v.id] !== 'undefined') {
                        count++;
                        var addon_premium = value.Addon_List[v.id];
                        addon_amount += addon_premium;
                        addon_premium_breakup += addon_Fullname + '-' + addon_premium + '+';// Added By Pratik On 14-02-2018
                        //For Mobile
                         $('#divQuitList' + InsID).children('.addon-selectedMobile').append('<div  class="ad" title="' + addon_Fullname + '">' + addon_Fullname + ' </div><div  class="ad_p"><i class="fa fa-inr"></i>' + Math.round(addon_premium) + '</div>');
                    }                   
                });*/

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
                // if (value.Insurer.Insurer_ID == 11) {
                // var net_premium_without_rsa = value.Premium_Breakup.own_damage['od_final_premium'] + value.Premium_Breakup.liability['tp_final_premium'] + addon_amount;
                // net_premium = net_premium_without_rsa;
                // var flag_addon_rsa = false;
                // var addon_amount_rsa = 0;
                // if (value.Addon_List.hasOwnProperty('addon_road_assist_cover')) {
                // $.each(addon_checked, function (i, v) {
                // var addon_name = addon_list[v.id];
                // if (addon_name == 'RoadSide Assistance') { flag_addon_rsa = true; addon_amount_rsa = value.Addon_List[v.id]; }
                // });
                // }
                // if (flag_addon_rsa) { net_premium_without_rsa = Math.round(net_premium_without_rsa) - addon_amount_rsa - 0; }
                // service_tax = 2 * (Math.round(net_premium_without_rsa * 0.09)) + Math.round(addon_amount_rsa * 0.18) - 0;
                // }
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

                $('#divQuitList' + InsID).children('.quotechild').children('.premium_div').children('.Premium').text('₹ ' + rupee_format(final_premium))

                $('#divQuitList' + InsID).attr('premium', final_premium);


                $('#divQuitList' + value.Insurer.Insurer_ID).attr('applied_addon', count);
                $('#divQuitList' + InsID + ' .PremiumBreakup').attr('netpayablepayablepremium', rupee_format(final_premium));
                $('#divQuitList' + InsID + ' .PremiumBreakup').attr('servicetax', rupee_format(Math.round(service_tax)));
                $('#divQuitList' + InsID + ' .PremiumBreakup').attr('addonpremium', Math.round(addon_amount));
                $('#divQuitList' + InsID + ' .PremiumBreakup').attr('totalpremium', rupee_format(Math.round(net_premium)));
                $('#divQuitList' + InsID + ' .PremiumBreakup').attr('addonname', addon_premium_breakup);

                //For Displaying Message For Discount Not Selected
                var TotalDiscountVal = 0;
                TotalDiscountVal = Math.round(value.Premium_Breakup.own_damage.od_disc_anti_theft) + Math.round(value.Premium_Breakup.own_damage.od_disc_vol_deduct);
                //$('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('totaldiscount', TotalDiscountVal);
                if (TotalDiscountVal == 0) {
                    $('#DisplayDiscount' + value.Insurer.Insurer_ID).html("No Discount Available");
                }

                //For Displaying Message For Cover Not Selected
                var TotalCover = 0;
                TotalCover = Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.dynamic').children('.PremiumBreakup').children('.PremiumBreakup').attr('electricalacessoriespremium')).replace(/,/g, '')) + Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.dynamic').children('.PremiumBreakup').children('.PremiumBreakup').attr('nonelectricalaccessoriespremium').replace(/,/g, '')));
                if (Product_id == 10) {
                    if (TotalCover == 0) { $("#DisplayCover" + InsID).html("No Cover Available"); }
                }
                if (Product_id == 1) {
                    TotalCover +=
                                Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.dynamic').children('.PremiumBreakup').children('.PremiumBreakup').attr('legalliabilitypremiumforpaiddriver')).replace(/,/g, '')) +
                                Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.dynamic').children('.PremiumBreakup').children('.PremiumBreakup').attr('personalaccidentcoverforpaiddriver')).replace(/,/g, '')) +
                                Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.dynamic').children('.PremiumBreakup').children('.PremiumBreakup').attr('personalaccidentcoverforunammedpassenger')).replace(/,/g, '')) +
                                Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.dynamic').children('.PremiumBreakup').children('.PremiumBreakup').attr('personalaccidentcoverfornamedpassenger')).replace(/,/g, ''));
                    if (TotalCover == 0) { $("#DisplayCover" + InsID).html("No Cover Available"); }
                }
                //$('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('totalCover', TotalCover);

                if (InsID == 35) {
                    net_premium = net_premium - 195;
                    total_liability_premium = value.Premium_Breakup.liability['tp_final_premium'] - 195;
                }

                $('#divQuitList' + InsID + ' .PremiumBreakup').attr('TotalLiabilityPremium', total_liability_premium);
                $('#divQuitList' + InsID + ' .PremiumBreakup').attr('totalpremium', rupee_format(Math.round(net_premium)));

                if (addon_checked.length > 0) { $($('#divQuitList' + InsID).children('.addon-selected')).show(); $(".trAddon").removeClass('hidden'); }
                else { $($('#divQuitList' + InsID).children('.addon-selected')).hide(); $(".trAddon").addClass('hidden'); }
                if ($($('#divQuitList' + InsID).children('.addon-selected')).html() == "") {
                    $($('#divQuitList' + InsID).children('.addon-selected')).show().html("No Add-ons Selected").css({ "text-align": "center" }, { "color": "rgb(29, 40, 85)" }, { "padding-top": "30px" });
                    $("#DisplayAddons" + InsID).show().html("No Add-ons Available");
                }

            }
        });

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
        }
        if (BundleCount == 0) {
            IsBundlePresent = false;
            $("#BundleEdit").html('<div style="margin: 10px;text-align: center;">No Addon Bundle Plan Available</div>');
        }
        $('.quoteboxparent').html($('.quoteboxmain').pbsort(false, "applied_addon"));
        set_minmax_premium();
    }
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
    for (var i = 0; i < quotes.Response.length; i++) {
        if (quotes.Response[i].Insurer_Id == InsID) {

            var InsResponse = quotes.Response[i];
            var InsAddonList = InsResponse.Addon_List;
            var InsPlanList = InsResponse.Plan_List;
            var InsPremBrkup = InsResponse.Premium_Breakup;
            ss_id = quotes.Summary.Request_Core.ss_id;
            app_version = quotes.Summary.Request_Core.app_version
            if (app_version == "FinPeace" && ss_id > 0) {
                IsCustomer = 0;
            } else {
                IsCustomer = 1;
            }

            for (var pl in InsPlanList) {
                var Hrefval = "";
                var ARN = "";
                var addon_premium_breakup = "";

                if (InsResponse.Plan_List[pl].Plan_Name == Plan) {

                    BundleResponse["Insurer_" + InsID] = InsResponse.Plan_List[pl]; // obj["addon_package"] = objPackage;
                    ARN = InsResponse.Plan_List[pl].Service_Log_Unique_Id;

                    if (Product_Name == "Car") {
                        Hrefval = "/car-insurance/buynow/" + clientid + "/" + ARN + "/" + AgentType + "/" + IsCustomer;
                    } else if (Product_Name == "Bike") {
                        Hrefval = "/two-wheeler-insurance/buynow/" + clientid + "/" + ARN + "/" + AgentType + "/" + IsCustomer;
                    }
                    $($('#divQuitList' + InsID).children('.quotechild').children('.dynamic').children('.quote-buynow')).attr('href', Hrefval);
                    // DisplayAddons30
                    var DisplayAddons = "";
                    $("#DisplayAddons" + InsID).html("No Addons Available");
                    Plan_Addon_Breakup = InsResponse.Plan_List[pl].Plan_Addon_Breakup;
                    var addon_Fullname;
                    $.each(Plan_Addon_Breakup, function (key, v) {
                        AddonTitle = addon_list[key] + "(" + v + ")";
                        //////;
                        var addon_name = addon_shortlist[key];
                        addon_Fullname = addon_list[v.id];
                        //arr1.push(addon_shortlist[key]);
                        //arr.push('<span class="Pack" title="' + AddonTitle + '">' + addon_shortlist[key] + '</span>');
                        var addon_premium = v;
                        addon_amount += addon_premium;

                        //amount[BuffetPlanName] = addon_amount;
                        //AddonContent = AddonContent + '<span title="' + addon_premium + '">' + addon_shortlist[key] + '</span> ';

                        //addon_premium = InsResponse.Addon_List[j];
                        // addon_premium_breakup += addon_list[j] + '-' + addon_premium + '+';
                        addon_premium_breakup += addon_list[key] + '-' + v + '+';
                        //////;
                        //DisplayAddons += '<span class="BlockSections" title="' + addon_list[key] + '">' + addon_shortlist[key] + '<span>₹ ' + addon_premium + '</span></span>';
                        DisplayAddons += '<div  class="ad" title="' + addon_list[key] + '">' + addon_list[key] + '</div> <div  class="ad_p"><i class="fa fa-inr"></i>' + Math.round(addon_premium) + '</div>'
                    });
                    if (DisplayAddons == "") {
                        //DisplayAddons = "No Addons Available";
                    }
                    //$("#DisplayAddons" + InsID).html(DisplayAddons);
                    //////;
                    $('#divQuitList' + InsID).children('.addon-selectedMobile').append(DisplayAddons);

                    // Add <span class="BlockSections" title="Zero Depreciation">ZD <span>₹ 4363</span></span>


                    //addon_amount = InsResponse.Plan_List[pl].Plan_Addon_Premium;
                    //Code For Changing Premium On Addon Select Starts

                    var total_liability_premium = InsPremBrkup.liability['tp_final_premium'] - 0;
                    var net_premium = InsPremBrkup.net_premium + addon_amount;
                    var service_tax = 2 * (Math.round(net_premium * 0.09) - 0);
                    var od_final_premium = InsPremBrkup.own_damage['od_final_premium'] - 0;
                    var ncb = InsPremBrkup.own_damage['od_disc_ncb'] - 0;

                    //Added by Ajit for TATA-AIG and Bajaj for Service Tax Calculation
                    // if (InsID == 11) {
                    // var net_premium_without_rsa = InsPremBrkup.own_damage['od_final_premium'] + InsPremBrkup.liability['tp_final_premium'] + addon_amount;
                    // net_premium = net_premium_without_rsa;
                    // var flag_addon_rsa = false;
                    // var addon_amount_rsa = 0;
                    // if (InsResponse.Addon_List.hasOwnProperty('addon_road_assist_cover')) {
                    // $.each(addonchecked, function (i, v) {
                    // var addon_name = addon_list[v.id];
                    // if (addon_name == 'RoadSide Assistance') { flag_addon_rsa = true; addon_amount_rsa = InsResponse.Addon_List[v.id]; }
                    // });
                    // }
                    // if (flag_addon_rsa) { net_premium_without_rsa = Math.round(net_premium_without_rsa) - addon_amount_rsa - 0; }
                    // service_tax = 2 * (Math.round(net_premium_without_rsa * 0.09)) + Math.round(addon_amount_rsa * 0.18) - 0;
                    // }
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

                    // $('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.dynamic').children('.btn-buy').children('.Premium').html('₹ ' + rupee_format(final_premium));// + ' <i style="font-size:14px">(1 year) </i>');
                    //$('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.dynamic').children('.btn-buy').children('.PremiumMobile').html('₹ ' + rupee_format(final_premium));

                    $('#divQuitList' + InsID).children('.quotechild').children('.premium_div').children('.Premium').text(('₹ ' + rupee_format(final_premium)));
                    $('#divQuitList' + InsID).attr('premium', final_premium);
                    //$('#divQuitList' + InsID).attr('applied_addon', count);
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
                    TotalCover = Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.dynamic').children('.PremiumBreakup').children('.PremiumBreakup').attr('electricalacessoriespremium')).replace(/,/g, '')) + Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.dynamic').children('.PremiumBreakup').children('.PremiumBreakup').attr('nonelectricalaccessoriespremium').replace(/,/g, '')));
                    if (Product_id == 10) {
                        if (TotalCover == 0) { $("#DisplayCover" + InsID).html("No Cover Available"); }
                    }
                    if (Product_id == 1) {
                        TotalCover +=
                                    Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.dynamic').children('.PremiumBreakup').children('.PremiumBreakup').attr('legalliabilitypremiumforpaiddriver')).replace(/,/g, '')) +
                                    Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.dynamic').children('.PremiumBreakup').children('.PremiumBreakup').attr('personalaccidentcoverforpaiddriver')).replace(/,/g, '')) +
                                    Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.dynamic').children('.PremiumBreakup').children('.PremiumBreakup').attr('personalaccidentcoverforunammedpassenger')).replace(/,/g, '')) +
                                    Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.dynamic').children('.PremiumBreakup').children('.PremiumBreakup').attr('personalaccidentcoverfornamedpassenger')).replace(/,/g, ''));
                        if (TotalCover == 0) { $("#DisplayCover" + InsID).html("No Cover Available"); }
                    }
                    //$('#divQuitList' + InsID + ' .PremiumBreakup').attr('totalCover', TotalCover);

                    if (InsID == 35) {
                        net_premium = net_premium - 195;
                        total_liability_premium = InsPremBrkup.liability['tp_final_premium'] - 195;
                    }

                    $('#divQuitList' + InsID + ' .PremiumBreakup').attr('TotalLiabilityPremium', total_liability_premium);
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
function set_minmax_premium() {
    ////;;
    var arr_prem = [];
    $(".quoteboxparent .quoteboxmain").each(function (index) {
        //if ($(this).children('.UlClass').children('.LiClass').children('.preloader').hasClass('hidden')) {
        var ind_prem = $(this).attr('premium') - 0;
        if (!(isNaN(ind_prem))) { arr_prem.push(ind_prem); }
        //}
    });

    $('.premium_min').html(Math.min.apply(null, arr_prem) == NaN ? 0 : Math.min.apply(null, arr_prem));
    $('.premium_max').html(Math.max.apply(null, arr_prem) == NaN ? 0 : Math.max.apply(null, arr_prem));
    //console.log(arr_prem, 'Min', Math.min.apply(null, arr_prem), 'Max', Math.max.apply(null, arr_prem));

    CheckAddons();
}

function addon_filter() {
    if (IsAddonPresent == true || IsBundlePresent == true) {
        var addon_checked = $('#Addons').find('input[type=checkbox]:checked');
        var addon_unchecked = $('#Addons').find("input:checkbox:not(:checked)");
        //if(addon_checked.length<=0){swal({text: "Please select atleast one add-on."});
        //}else{
        $('#QuoteLoader').show();
        $('#main_div').hide();
        $(".popup_overlay").slideUp();

        var obj = {}, objStandalone = {}, objPackage = {};
        obj["data_type"] = "addon";
        obj["search_reference_number"] = srn;
        obj["udid"] = udid;
        ////;
        // Addon Standalone


        if (addon_checked.length > 0) { $.each(addon_checked, function (i, value) { objStandalone[value.id] = "yes"; }); $(".trAddon").removeClass('hidden'); }
        if (addon_unchecked.length > 0) { $.each(addon_unchecked, function (i, value) { objStandalone[value.id] = "no"; }); }
        obj["addon_standalone"] = objStandalone;

        // Addon Package Pratik_adddonPackage
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
        obj["secret_key"] = "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW";
        obj["client_key"] = "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9";

        console.log(obj);
        console.log(JSON.stringify(obj));

        var data = {
            request_json: JSON.stringify(obj),
            // method_name: "/quote/save_user_data",
            client_id: "2"
        };
        var obj_horizon_data = Horizon_Method_Convert("/quote/save_user_data", obj, "POST");
        $.ajax({
            type: 'POST',
			dataType: "json",
            //url: GetUrl()+"/quote/save_user_data",
            //data: JSON.stringify(obj),
            //data: JSON.stringify(obj_horizon_data['data']),
            //url: obj_horizon_data['url'],
			data : siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) :  JSON.stringify(obj),
		    url :  siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/save_user_data" ,
            contentType: 'application/json; charset=utf-8',
            success: function (response) {

                console.log('response', response);


                if (response["Msg"] == "Data saved") {

                    handle_addon_addition();
                    $('#QuoteLoader').hide();
                    $('#main_div').show();
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
        //}
        $("#AddonCount").text("(" + addon_checked.length + ")");
        $("#CloseAddon").click();
    }
    else { return false; }
}

function cover_filter() {
    ////;
    var motorobject = new Object()
    //var request = search_summary.Request;
    var request = Response_Global.Summary.Request_Core;
    var Err = 0;

    var Eleval = $('#ElectricalAccessories').val();
    var NonEleval = $('#NonElectricalAccessories').val();
    var pattern = /^[0-9]*$/;
    //$('#spnElectricalAccessories, #spnNonElectricalAccessories').remove();

    if (Eleval != 0 || Eleval == "") {
        if (Eleval < 10000 || Eleval > 50000 || pattern.test(Eleval) == false || Eleval.length != 5 || Eleval == "") {
            Err++;
            $('#spnElectricalAccessories').addClass('ErrorMsg');
            $('#ElectricalAccessories').addClass('errorClass1');
        }
        else { $('#spnElectricalAccessories').removeClass('ErrorMsg'); $('#ElectricalAccessories').removeClass('errorClass1'); }
    }

    if (NonEleval != 0 || NonEleval == "") {
        if (NonEleval < 10000 || NonEleval > 50000 || pattern.test(NonEleval) == false || NonEleval.length != 5 || NonEleval == "") {
            Err++;
            $('#spnNonElectricalAccessories').addClass('ErrorMsg');
            $('#NonElectricalAccessories').addClass('errorClass1');
        }
        else { $('#spnNonElectricalAccessories').removeClass('ErrorMsg'); $('#NonElectricalAccessories').removeClass('errorClass1'); }
    }

    //if (($("#ElectricalAccessories").val() < 10000 || $("#ElectricalAccessories").val() > 50000 || pattern.test($("#ElectricalAccessories").val()) == false) && $("#ElectricalAccessories").val() != 0) { $('#spnElectricalAccessories').addClass('ErrorMsg'); $("#ElectricalAccessories").addClass('errorClass1'); Err++; }
    //else { $("#ElectricalAccessories").removeClass('errorClass1'); }
    //if (($("#NonElectricalAccessories").val() < 10000 || $("#NonElectricalAccessories").val() > 50000 || pattern.test($("#NonElectricalAccessories").val()) == false) && $("#NonElectricalAccessories").val() != 0) { $('#spnNonElectricalAccessories').addClass('ErrorMsg'); $("#NonElectricalAccessories").addClass('errorClass1'); Err++; }
    //else { $("#NonElectricalAccessories").removeClass('errorClass1'); }

    if (parseInt($("#ExpectedIDV").val()) != 0) {
        if (parseInt($("#ExpectedIDV").val()) < parseInt($('#expected_idv').attr("min")) || parseInt($("#ExpectedIDV").val()) > parseInt($('#expected_idv').attr("max"))) { $("#ExpectedIDV").addClass('errorClass1'); $(".spnExpectedIDV").addClass('ErrorMsg'); Err++; }
        else { $("#ExpectedIDV").removeClass('ErrorMsg'); }
    }
    if (Err > 0) { return false; }
    var REGNO = (request.registration_no).replace(/-/g, '');
    var manf_date = request.vehicle_manf_date.substring(0, 4) + "-" + request.vehicle_manf_date.substring(5, 7) + "-01";
    ;;
    var data1 = {
        "product_id": Product_id,
        "vehicle_id": request.vehicle_id,
        "rto_id": request.rto_id,
        "vehicle_insurance_type": request.vehicle_insurance_type,
        "vehicle_manf_date": manf_date,
        "vehicle_registration_date": request.vehicle_registration_date,
        "policy_expiry_date": request.policy_expiry_date,
        "prev_insurer_id": request.prev_insurer_id.toString(),
        "vehicle_registration_type": "individual",
        "vehicle_ncb_current": request.vehicle_ncb_current,
        "is_claim_exists": request.is_claim_exists,
        "method_type": "Premium",
        "execution_async": "yes",
        "electrical_accessory": parseInt($("#ElectricalAccessories").val()),
        "non_electrical_accessory": parseInt($("#NonElectricalAccessories").val()),
        "registration_no": request.registration_no,
        "is_llpd": $("#PeronalAccidentCoverforDriver").val() == "Yes" ? "yes" : "no",
        "is_antitheft_fit": $("#IsAntiTheftDevice").val() == "Yes" ? "yes" : "no",
        "voluntary_deductible": $("#VoluntaryDeduction").val(),
        "is_external_bifuel": request.is_external_bifuel,
        "is_aai_member": $("#MemberofAA").val() == "Yes" ? "yes" : "no",
        "external_bifuel_type": request.external_bifuel_type,
        "external_bifuel_value": request.external_bifuel_value > 0 ? request.external_bifuel_value : "",
        "pa_owner_driver_si": $("#ODPAC").val() == "" ? 1500000 : parseInt($("#ODPAC").val()),
        "is_having_valid_dl": $('#IsHavingValidDL').val() == "Yes" ? true : false,
        "is_opted_standalone_cpa": $('#IsHavingSCPACheckIsHavingSCPA').val() == "No" ? false : true,
        "pa_named_passenger_si": $('#NamedPersonalAccidentCover').val() == undefined ? "0" : $('#NamedPersonalAccidentCover').val(),
        "pa_unnamed_passenger_si": $('#PersonalCoverPassenger').val() == undefined ? "0" : $('#PersonalCoverPassenger').val(),
        "pa_paid_driver_si": $("#PaidDriverPersonalAccidentCover").val() == "Yes" ? "100000" : "0",
        "vehicle_expected_idv": parseInt($("#ExpectedIDV").val()),
        "vehicle_insurance_subtype": request.vehicle_insurance_subtype,
        "first_name": request.first_name,
        "middle_name": request.middle_name,
        "last_name": request.last_name,
        "mobile": request.mobile,
        "email": request.email,
        "crn": Response_Global.Summary.PB_CRN,
        "ss_id": request.ss_id.toString(),
        "fba_id": request.fba_id.toString(),
        "geo_lat": 0,
        "geo_long": 0,
        "agent_source": "",
        "ip_address": request.ip_address,
        "app_version": request.app_version,
        "mac_address": request.mac_address,
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9"
    };

    console.log(data1);
    var obj_horizon_data = Horizon_Method_Convert("/quote/premium_initiate", data1, "POST");
    $.ajax({
        type: "POST",
		data : siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) :  JSON.stringify(data1),
		url :  siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/premium_initiate" ,
        //data: JSON.stringify(obj_horizon_data['data']),
        //url: obj_horizon_data['url'],
        //data: JSON.stringify(data1),
        //url: GetUrl()+"/quote/premium_initiate",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {

            console.log(data)
            window.location.href = "./quotepage.html?SRN=" + data.Summary.Request_Unique_Id + "&ClientID=" + clientid;
        },
        error: function (data) {
            ////;;

            console.log(data);

        }
    });

}
function SetValues() {
    $('.SpnCD').each(function () {
        if ($(this).text() == 0) { $(this).parent().empty().remove(); }//$(this).parent().addClass('hidden'); }
    });
}

function Get_Saved_Data() {
    //var mainUrl = GetUrl()+"/quote/premium_list_db";	
    var str1 = {
        "search_reference_number": srn,
        "udid": udid,
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9"
    };
    var obj_horizon_data = Horizon_Method_Convert("/quote/premium_list_db", str1, "POST");
    $.ajax({
        type: "POST",
		data : siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) :  JSON.stringify(str1),
		url :  siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/premium_list_db" ,
        //data: JSON.stringify(str1),
        //url: mainUrl,
        //data: JSON.stringify(obj_horizon_data['data']),
        //url: obj_horizon_data['url'],
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (max_calling_times > 0) {

                quotes = data;
                response_handler();
            }
            else { //console.log("Quotes no available for selected Criteria");
            }
        },

        error: function (result) {
            // alert("Error");

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
    $(".BasicMD").hide();
}

function hide_spinner() {
    $("#QuoteLoader").css('display', 'none');
}

function redirect(id) {

    // var arn = $(id).attr('href').split("/")[3];
    if (Product_Name == "Car") {
        $(id).attr('href', $(id).attr('href').replace("___proposal_url___", "car-insurance/buynow"));
    } else if (Product_Name == "Bike") {
        $(id).attr('href', $(id).attr('href').replace("___proposal_url___", "two-wheeler-insurance/buynow"));
    }

    $(id).attr('href', $(id).attr('href').replace("___client_id___", clientid));
    $(id).attr('href', $(id).attr('href').replace("AgentType", AgentType));
    $(id).attr('href', $(id).attr('href').replace("IsCustomer", IsCustomer));
    var hrefval = $(id).attr('href');
    var newurl = SetUrl() + hrefval
    $(window).attr('location', newurl)
    // $(id).attr('href', $(id).attr('href').replace("___udid___", udid));
    // var i = 0;
    // $.each(quotes.Response, function (index, value) {
    // if (value.Service_Log_Unique_Id == arn) {
    // i = index;
    // return false;
    // }
    // });
    // var breakup = quotes.Response[i].Premium_Breakup;
    // var obj = {
    // ProductInsuranceMapping_Id: quotes.Summary.Request_Core.crn,
    // Insurer_Id: quotes.Response[i].Insurer_Id,
    // BasicOwnDamage: breakup.own_damage.od_basic,
    // NonElectricalAccessoriesPremium: breakup.own_damage.od_non_elect_access,
    // ODDiscount: breakup.own_damage.od_disc,
    // NetODAfterTariffDiscount: breakup.own_damage.od_basic - breakup.own_damage.od_disc,
    // ElectricalAcessoriesPremium: breakup.own_damage.od_elect_access,
    // BiFuelKitPremium: breakup.own_damage.od_cng_lpg,
    // TotalOwnDamagePremium: breakup.own_damage.od_final_premium,
    // AntiTheftDiscount: breakup.own_damage.od_disc_anti_theft,
    // VoluntaryDeductions: breakup.own_damage.od_disc_vol_deduct,
    // AutomobileAssociationMembershipPremium: breakup.own_damage.od_disc_aai,
    // NoClaimBonus: breakup.own_damage.od_disc_ncb,
    // UnderwriterLoading: breakup.own_damage.od_loading,
    // TotalODPremium: breakup.own_damage.od_final_premium,
    // ThirdPartyLiablityPremium: breakup.liability.tp_basic,
    // BiFuelKitLiabilityPremium: breakup.liability.tp_cng_lpg,
    // PersonalAccidentCoverForOwnerDriver: breakup.liability.tp_cover_owner_driver_pa,
    // LegalLiabilityPremiumForPaidDriver: breakup.liability.tp_cover_paid_driver_ll,
    // PersonalAccidentCoverForUnammedPassenger: breakup.liability.tp_cover_unnamed_passenger_pa,
    // TotalLiabilityPremium: breakup.liability.tp_final_premium,
    // TotalPremium: breakup.net_premium,
    // ARN: arn,
    // AddOnPremium: 0,
    // ServiceTax: breakup.service_tax,
    // NetPayablePayablePremium: breakup.final_premium,
    // IDV: quotes.Response[i].LM_Custom_Request.vehicle_expected_idv,
    // Insurer_IDV: quotes.Response[i].LM_Custom_Request.vehicle_expected_idv,
    // UDID: udid
    // };
    // console.log(obj);
    // $.ajax({
    // url: "Update_Motor_Quote?quote=" + JSON.stringify(obj),
    // type: 'Get',
    // data: JSON.stringify(obj),
    // contentType: 'application/json;',
    // dataType: "json",
    // success: function (response) { },
    // error: function (response) { }
    // });
    // //return true;
    // if (quotes.Response[i].Insurer_Id == 11) {
    // if (quotes.Summary.Request_Core.vehicle_insurance_type == "renew") {
    // var addon_checked = $('#Addons p').find('input[type=checkbox]:checked');
    // if (addon_checked.length > 0) {
    // //var addon_list = quotes.Response[i].Addon_List;
    // //$.each(addon_checked, function (i, value) {
    // //    if (addon_list[value.id] > 0) {
    // showConfirmMessage(arn);
    // return false;
    // }
    // //});               
    // }
    // else {
    // return true;
    // }
    // }
    // else { return true; }
}

$(document).on("click", ".PremiumBreakup", function () {

    var premium_values = $(this).children(".PremiumBreakup");
    SelectedInsId = premium_values.attr("insurerid");
    if (SelectedInsId == 11 && ($("#NonElectricalAccessories").val() - 0 > 0)) { $("#lblBasicOwnDamage").text("Basic OD + NEA Premium"); }
    else { $("#lblBasicOwnDamage").text("Basic OD"); }
    $(".Name").text(Name);
    if (EmailVal.indexOf('testpb.com') > -1) { $("#EmailID").val(""); }
    else { $("#EmailID").val(EmailVal); }

    $("#spanPremium").html(premium_values.attr("Premium"));
    $("#sBasicOwnDamage, .sBasicOwnDamage").html(premium_values.attr("BasicOwnDamage"));
    $("#NonElectricalAccessoriesPremium").html(premium_values.attr("nonelectricalaccessoriespremium"));
    $("#ElectricalAcessoriesPremium, .ElectricalAcessoriesPremium").html(premium_values.attr("electricalacessoriespremium"));
    $("#ODDiscount, .ODDiscount").html(premium_values.attr("ODDiscount"));
    $("#ODDiscountper").html(premium_values.attr("ODDiscountper"));
    $("#BiFuelKitPremium, .BiFuelKitPremium").html(premium_values.attr("BiFuelKitPremium"));
    $("#AntiTheftDiscount, .AntiTheftDiscount").html(premium_values.attr("AntiTheftDiscount"));
    $("#VoluntaryDeductions, .VoluntaryDeductions").html(premium_values.attr("VoluntaryDeductions"));
    $("#AutomobileAssociationMembershipPremium, .AutomobileAssociationMembershipPremium").html(premium_values.attr("AutomobileAssociationMembershipPremium"));
    $("#AgeDiscount").html(premium_values.attr("AgeDiscount"));
    $("#ProfessionDiscount").html(premium_values.attr("ProfessionDiscount"));
    $("#UnderwriterLoading, .UnderwriterLoading").html(premium_values.attr("UnderwriterLoading"));
    $("#TotalODPremium, .TotalODPremium").html(premium_values.attr("TotalODPremium"));

    if ($("#VehicleInsuranceSubtype").val() != null || $("#VehicleInsuranceSubtype").val() != "") {
        var VIST = ($("#VehicleInsuranceSubtype").val()).split("CH_")
        if (VIST[0] == 0) {
            $(".TotalODPremiumDisplay").html("N.A.");
        }
    }
    else { }

    $("#ThirdPartyLiablityPremium, .ThirdPartyLiablityPremium").html(premium_values.attr("ThirdPartyLiablityPremium"));
    $("#PersonalAccidentCoverForUnammedPassenger, .PersonalAccidentCoverForUnammedPassenger").html(premium_values.attr("PersonalAccidentCoverForUnammedPassenger"));
    $("#PersonalAccidentCoverForNamedPassenger, PersonalAccidentCoverForNamedPassenger").html(premium_values.attr("PersonalAccidentCoverForNamedPassenger"));
    $("#PersonalAccidentCoverForOwnerDriver, .PersonalAccidentCoverForOwnerDriver").html(premium_values.attr("PersonalAccidentCoverForOwnerDriver"));
    $("#PersonalAccidentCoverForPaidDriver, .PersonalAccidentCoverForPaidDriver").html(premium_values.attr("PersonalAccidentCoverForPaidDriver"));
    $("#LegalLiabilityPremiumForPaidDriver, .LegalLiabilityPremiumForPaidDriver").html(premium_values.attr("LegalLiabilityPremiumForPaidDriver"));
    $("#BiFuelKitLiabilityPremium, .BiFuelKitLiabilityPremium").html(premium_values.attr("BiFuelKitLiabilityPremium"));
    $("#TotalLiabilityPremium, .TotalLiabilityPremium").html(premium_values.attr("TotalLiabilityPremium"));
    $("#TotalPremium, .TotalPremium").html(premium_values.attr("TotalPremium"));
    $("#TotalPremiumFinal").html(premium_values.attr("TotalPremium"));
    $("#ServiceTax, .ServiceTax").html(premium_values.attr("ServiceTax"));
    $("#ServiceTaxFinal").html(premium_values.attr("ServiceTax"));

    $("#NetPayablePayablePremium, .NetPayablePayablePremium").html(premium_values.attr("NetPayablePayablePremium"));
    $("#NetPayablePayablePremiumFinal").html(premium_values.attr("NetPayablePayablePremium"));

    $("#InsurerNameTitle, .InsurerNameTitle").html(premium_values.attr("InsurerName"));
    $("#ServiceLogId").html(premium_values.attr("ServiceLogId"));
    $("#NoClaimBonusPercentage").html(Math.round(premium_values.attr("noClaimBonusPercentage")));
    $("#NoClaimBonusPercentage").html(premium_values.attr("noClaimBonusPercentage"));
    $("#NoClaimBonus, .NoClaimBonus").html(premium_values.attr("noClaimBonus"));
    $("#AddOnPremium, .AddOnPremium").html(premium_values.attr("addonpremium"));
    $("#AddOnName").html(premium_values.attr("addonname"));
    $("#NonElectricalAccessoriesPremiumNEA, .NonElectricalAccessoriesPremiumNEA").html(premium_values.attr("nonelectricalaccessoriespremium"));
    $("#IDV, .IDV").html(premium_values.attr("idv"));
    $('#fair_price').html(premium_values.attr('fair_price'));

    var _AddOnPremium = premium_values.attr("addonpremium");
    if (_AddOnPremium > 0) { $("#divAddOnPremium").css("display", "block"); }
    else { $("#divAddOnPremium").css("display", "none"); }

    if (premium_values.attr("insurerid") == 9 && premium_values.attr("ODDiscount") == "0") { $("#odDiscount").hide(); }
    else { $("#odDiscount").show(); }

    //if ($(this).attr("insurerid") == 2 ) {
    //    $("#NEACOMBOEA").show();
    //    $("#NEAPremium").hide();
    //    $("#EAPremium").hide();
    //}
    //else {
    //    $("#NEACOMBOEA").hide();
    //    $("#NEAPremium").show();
    //    $("#EAPremium").show();
    //}
    if (premium_values.attr("addonpremium") > 0) {
        var tempAd = premium_values.attr("addonname").split("+");
        $("#divAddOnPremium").show(); $("#divAddOnPremiumPopup").show();
        $("#divAddonLI").empty(); $("#divAddonLIPopup").empty();
        $("#divAddonLIPopup").append("<div style='width:100%; padding:10px 0px;text-align:center;font-size:15px;background-color:#15b9dc;color:#fff;font-family:arial!important;line-height:20px;'><b>ADD-ONS</b></div>");
        SelectedAddonList = [];
        for (var i = 0; i < tempAd.length - 1; i++) {
            var obj = { n: tempAd[i].split("-")[0], v: tempAd[i].split("-")[1] };
            SelectedAddonList.push(obj);
            $("#divAddonLI").append("<li class='list-group-item'><span>" + tempAd[i].split("-")[0] + "</span><span class='pull-right'>" + tempAd[i].split("-")[1] + "</span></li>");
            $("#divAddonLIPopup").append("<tr><td style='width:70%;padding:5px 0px 5px 20px;font-family:arial!important;font-size:13px!important;line-height:20px;color:#414042;'>" + tempAd[i].split("-")[0] + "</td><td style='width:30%;padding:5px 20px 5px 0px;font-family:arial!important;font-size:13px!important;line-height:20px;color:#414042;text-align: right;'>" + tempAd[i].split("-")[1] + "</td></tr>");
        }
    }
    else { $("#divAddOnPremium").hide(); $("#divAddOnPremiumPopup").hide(); $("#divAddonLIPopup").empty(); }

    if (premium_values.attr("addonpremium") > 0) {
        $("#pGrossPremium").css("display", "block");
        $("#GrossPremium").html((parseFloat(_AddOnPremium) + parseFloat(premium_values.attr("TotalPremium"))));
    } else { $("#pGrossPremium").css("display", "none"); }
    var selectedQuoteId = premium_values.attr("quoteid");
    $("#hdnSelectedQuoteid").val(selectedQuoteId);

    //if ($(this).attr("insurerid") == 10) {
    //    $("#NEAPremium").hide();
    //    $("#lblBasicOwnDamage").html("Basic OD + NEA Premium");
    //}
    //else {
    //    $("#NEAPremium").show();
    //    $("#lblBasicOwnDamage").html("Basic OD");
    //}

    //Hide The Premium Details List Content If Values is 0
    $(".ErrorMsg1").hide();
    PremiumDetailsValues();

    $(".popup_overlay").slideDown();
    $(".popup_overlay > div").hide();
    $(".structure_prem_break").show();
});

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

function CheckSort(filter1, filter2) {


    var ascending = (filter1 == "low-high") ? true : false;
    var parameter = (filter2 == "1") ? "premium" : (filter2 == "2") ? "idv" : "fair_price";
    var divQts = $('.quoteboxmain').pbsort(ascending, parameter);
    $('.quoteboxparent').html(divQts);
    console.log("Sorting:" + ascending + "_" + parameter);
    $(".popup_overlay").slideUp();
}
function CheckOwnerDriverPersonalAccidentCover(value) {

    if (value == "Yes") {
        $("#ODPAC").val(1500000).text('1500000');
        $("#ODPAC2").attr('checked', true);
        $("#divIsHavingValidDL").hide();
        $("#divIsHavingSCPA").hide();
        $('#IsHavingValidDL').val("No").text("No");
        $("#IsHavingSCPA").val("Yes").text("Yes");
    }
    else if (value == "No") {
        $("#ODPAC").val(0).text('0');
        $("#ODPAC1").attr('checked', true);
        $("#IsHavingValidDL1").attr('checked', true);
        $("#divIsHavingValidDL").show();
    }
    $("#IsHavingSCPA2").attr('checked', true);
    //$("#IsHavingSCPA2").click();
    $("#OwnerDriverPersonalAccidentCover").html(value);
    $("#OwnerDriverPersonalAccidentCover").val(value);
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
function CheckIsHavingValidDL(value) {

    $("#ODPAC").val(0).text('0');
    if (value == "Yes") {
        $("#divIsHavingSCPA").show();
    }
    else if (value == "No") {
        $("#divIsHavingSCPA").hide();
    }
    $("#IsHavingSCPA").val("Yes").text("Yes");
    $("#IsHavingSCPA2").attr('checked', true);
    $("#IsHavingSCPA2").click();
    $("#IsHavingValidDL").val(value).html(value);
}
function CheckIsHavingSCPA(value) {

    if (value == "Yes") { $("#ODPAC").val(0).text('0'); }
    else if (value == "No") { $("#ODPAC").val(1500000).text('1500000'); }
    $("#IsHavingSCPA").val(value).html(value);
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