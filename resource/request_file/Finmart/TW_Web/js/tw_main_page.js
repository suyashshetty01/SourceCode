var RtoList = [];
var VehicleList = [];
var Product_id;
var Product_Name;
var VariantIDSelected;
var VehicleType;
var PrevVehicle_id;
var PrevRto_id;
var PrevReg_Date;
var twowheelerType = "";
var isPostBack = false;
var SRN = "";//"SRN-7QSMHV8C-3OWA-ALSO-G91H-CQNQNK1FLGVK_63742";
var quotes;
var insurer_count = 0;
var StatusCount = 0;
var html_addon = $('.insurance-cover').html();
var CoverCount = 0;
var DiscountCount = 0;
var Response_Global;
var Name = "";
var EmailVal = "";
var ss_id, fba_id, ip_address, app_version, mac_address, mobile_no, srn, client_id = 2, editmodify, header, sub_fba_id, ip_city_state;
var Error = 0;
var AddOnSelectedList = [];
var IsLoad = true;
var InsPlanTypeYear = 5;
var searchFlag = false;
var Quote_cnt = 0;
var App_cnt = 0;
var Sell_cnt = 0;
var RTOCode = "";
var PEDFlag = "no";
var IsPolicyExistFlag = "yes";
var is_TP = "no";
var VehInsSubType;
var IsExternalBifuel = false;
var siteURL = "";
if(document.readyState === 'complete'){
    console.log('dom is loaded ');
}
var htmllist = $('.quoteboxparent').html();
var IsFastLane = 'True';
var IsFinancedFlag = '';
var vehicle_class_code = 0;
var vehicle_subclass_code = 0;
var Error_Master = {};
var arr_preference = [];

var own_premises = 'no';
var Cleaner_Ll = 'no';
var GeographicalAreaExt = 'no';
var Additional_Towing = 'no';
var fibre_glass_fuel_tank = 'no';

var NonFairingPayingPassengerVal = 'no';
var FairingPayingPassengerVal = 'no';
var Conductor_Ll = 'no';

var IMT23 = 'no';
var OtherUse = 'no';
var PersonalAccidentCoverForEmployee = 'no';
var Coolie_Ll = 'no';

var fin_vehicle_registration_type = "individual";

var Renewal_Cnt = 0;
var origin_crn = "", origin_udid = "", udid, origin_email = '';
var activeTab = "";
var GStype = '';
var GLeadId = '';
var GLeadType = '';
var GLeadStatus = '';
var IsTypeFastLane = false;
var OrgRtoFastLane = '';
var quoteMode = '';
var utm_source, utm_campaign, utm_medium;
var IsTwiceRenewal = false;
var leadCty = "";
var leadVrntName = "";
var html_addon_bundle = $('#BundleEdit').html();
var html_addon_bundle_Plan = $('.addons').html();
var html_addon_bundle_Plan_details = $('.BundleAddonDisplay').html();
var RTO_count = 0;
var RtoList_updated = [];
var map_vehicle_id;
var Insurer_Vehicle_List = [];
var app_visitor_id = '';
//var IsTPPolicyExistflag = '';
var geo_long;
var geo_lat;
var product_attr = {
    "1": {
        "RENEW": {
            "TPCompPlan": {
                "1CH_0TP": "Comprehensive Plan (1 Yr)",
                "0CH_1TP": "T.P. Only (1 Yr)",
                "1OD_0TP": "O.D. Only For 1 Yr"
            }
        },
        "NEW": {
            "TPCompPlan": {
                "0CH_3TP": "T.P.Only(3 Yrs)",
                "1CH_2TP": "Comprehensive(1 Yr) + T.P. (2Yrs)"
            }
        },
        "Proposal_url": "car-insurance/buynow",
        "VOLUNTARY_DEDUCTIBLE": {
            "2500": "2500",
            "5000": "5000",
            "7500": "7500",
            "15000": "15000"
        }
    },
    "10": {
        "RENEW": {
            "TPCompPlan": {
                "1CH_0TP": "O.D. + T.P. For 1 Yr",
                "2CH_0TP": "O.D. + T.P. For 2 Yr",
                "3CH_0TP": "O.D. + T.P. For 3 Yr",
                "0CH_1TP": "T.P. Only (1 Yr)",
                "1OD_0TP": "O.D. Only For 1 Yr"
            }
        },
        "NEW": {
            "TPCompPlan": {
                "0CH_5TP": "T.P. Only For 5 Yrs",
                "1CH_4TP": "O.D. For 1 Yr + T.P. For 5 Yrs"
            }
        },
        "Proposal_url": "two-wheeler-insurance/buynow",
        "VOLUNTARY_DEDUCTIBLE": {
            "500": "500",
            "750": "750",
            "1000": "1000",
            "1500": "1500",
            "3000": "3000"
        }
    },
    "12": {
        "RENEW": {
            "TPCompPlan": {
                "1CH_0TP": "Comprehensive Plan (1 Year)",
                "0CH_1TP": "T.P. only (1 Year)"
            }
        },
        "NEW": {
            "TPCompPlan": {
                "1CH_0TP": "Comprehensive Plan (1 Year)",
                "0CH_1TP": "T.P. only (1 Year)"
            }
        },
        "Proposal_url": "car-insurance/buynow",
        "VOLUNTARY_DEDUCTIBLE": {
            "2500": "2500",
            "5000": "5000",
            "7500": "7500",
            "15000": "15000"
        }
    }

}



$('ul#myTab li').click(function (e) {

    $('ul#myTab li').removeClass("active");
    $(this).addClass("active");
    var selectedtab = $('ul#myTab li.active').text();
    //if (selectedtab == "QUOTE") {

    //$('.maininput').hide();
    //$('.quotelist').show();
    //$('.footerDiv').hide();
    // $('.loading').show();
    // $('#Property').removeClass('active in');
    // $('#Appl').addClass('active in');
    // Get_Search_Summary();
    // Get_Saved_Data();
    //} else if (selectedtab == "INPUT") {
    // GetDataFromSIDCRN();
    // }
});



function Horizon_Method_Convert(method_action, data, type) {
    var obj_horizon_method = {
        'url': (type == "POST") ? "/horizon-method.php" : "/horizon-method.php?method_name=" + method_action,
        "data": {
            request_json: JSON.stringify(data),
            method_name: method_action,
            client_id: "2"
        }
    };
    return obj_horizon_method;
}


function checkTextWithSpace(input) {
    var pattern = new RegExp('^[a-zA-Z ]+$');
    if (pattern.test(input) == false) {
        return false;
    } else {
        return true;
    }
}

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
    'addon_mandatory_deduction_protect': 'Mandatory Deduction Protect',
    'addon_accident_shield_cover': 'Accident Shield Cover'
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
    'addon_mandatory_deduction_protect': 'MDP',
    'addon_accident_shield_cover': 'AS'
};

$('#Click_here').click(function (e) {
    GStype = '';
    GLeadId = '';
    GLeadType = '';
    GLeadStatus = '';
    ClearForm();
    AddQuote();
    $("#CityofRegitration").attr('disabled', false);
    CheckType('RENEW');
    $('#InputForm').show();
    $('.basicDetails').hide();
    $('#VehicleType').val('renew');
    $('.footerDiv').show();
    $(".policyType").show();
    if ((app_version == 'FinPeace') && getUrlVars()["mobile_no"] != "") {
        $("#ContactMobile").addClass('used');
        $('#ContactMobile').val(getUrlVars()["mobile_no"]);
    }
    if (udid !== "" && udid !== undefined && udid !== null) {
        origin_udid = udid;
        get_crosssell();
    }
    $('.PolicyExpiryDate').hide();
    $(".PreviousInsurer").hide();
    $("#divNoClaimBonusPercent, .divNoClaimBonusPercent").hide();
    $("#lblPolicyExist-Yes").addClass('btn-UnSelected').removeClass('btn-primarySelected active');
    $("#lblPolicyExist-No").addClass('btn-UnSelected').removeClass('btn-primarySelected active');//mg31
    if ($("#TPCompPlan").val() == "1OD_0TP") {
        $("#divNoClaimBonusPercent, .divNoClaimBonusPercent").hide();
    }
    if (($("#TPCompPlan").val() == "1CH_0TP" || $("#TPCompPlan").val() == "1OD_0TP")) {
        $('#id_existing_policy_label').text('DO YOU HAVE EXISTING COMPREHENSIVE POLICY (SELECT "NO" IF OWNERSHIP TRANSFER) ');
    }
    /*else{
     $('#id_existing_policy_label').text('DO YOU HAVE EXISTING COMPREHENSIVE POLICY');
     }*///mg31

    if ($("#TPCompPlan").val() == "1OD_0TP") {
        $('.tpInsurer').show();
    }
    if ($('#VehicleType').val() === "new" || Product_id == 12) {
        $('.IsTPPolicyExist').hide();
    }
})

function ClearForm() {
    $('.footerDiv').hide();
    activeTab = "";
    TP_CompSet('RENEW');
    $("#Model_Name").val("");
    $("#MakeModel").val("");
    $("#MakeModel").removeClass('used');
    $("#MakeModelID").val("");

    //Variant
    $("#VariantID").empty();
    $("#VariantID").append('<option value="0">Select Variant</option>');
    $("#hdVariantID").val("");
    VariantIDSelected = "";

    //fuel
    $("#FuelType").empty();
    $('#FuelType').append('<option value="0">SELECT FUEL TYPE</option>');


    $("#DOPCRenew").val("");
    $("#DOPCRenew").show();
    //$("#DateofPurchaseofCar").val("");
    $(".DateofPurchaseofCar").removeClass('used');

    $('#PolicyExpiryDate').val("");
    $("#PolicyExpiryDate").removeClass('used');

    $('#ManufactureDate').val("");
    $('#ManufactureYear').val("");
    $('#ManufactureMonth').val("");
    $("#ManufactureDate").removeClass('used');
    $('.ErMFGID').html("");
    $('.ErMFGID').hide("");

    $('.have_claim').show();
    $('.PolicyExist').show();

    $('#lblHaveNCBCertificate-Yes').addClass('active');
    $('#lblHaveNCBCertificate-No').removeClass('active');
    var custom_values = [0, 20, 25, 35, 45, 50];

    var slider = $("#range1").data("ionRangeSlider");

    // Change slider, by calling it's update method
    slider.update({
        min: 0,
        max: 50,
        from: 0,

        step: 5,
        grid: true,
        grid_snap: true,
        values: custom_values
                // etc.
    });



    $('#CityofRegitration').val("");
    $('#CityofRegitrationID').val("");
    $("#CityofRegitration").removeClass('used');

    $('#PreviousInsurer').val(0);
    $("#PreviousInsurer").removeClass('used');

    $('#ContactName').val("");
    $("#ContactName").removeClass('used');

    $('#ContactMobile').val("");
    $("#ContactMobile").removeClass('used');
    //is finance_amount
    /*$('#finance_amount').val("");
     $("#div_finance_amount_and_name").hide();
     $("#isFinanced-Yes").removeClass('active');
     $("#isFinanced-No").removeClass('active');*/

    if (getUrlVars()['app_version'] === 'highway_delite_customer') {
        if (getUrlVars()['hd_customer_name'] != "" && getUrlVars()['hd_customer_name'] !== undefined && getUrlVars()['hd_customer_name'] !== null) {
            $('#ContactName').val(decodeURI(getUrlVars()['hd_customer_name'])).addClass('used');
        }
        if (getUrlVars()['hd_mobile'] != "" && getUrlVars()['hd_mobile'] != undefined && getUrlVars()['hd_mobile'] != null) {
            $('#ContactMobile').val(getUrlVars()['hd_mobile']).addClass('used');
        }
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
}

function stringparam() {

    ss_id = getUrlVars()["ss_id"];
    fba_id = getUrlVars()["fba_id"];
    ip_address = getUrlVars()["ip_address"];
    app_version = getUrlVars()["app_version"];
    mac_address = getUrlVars()["mac_address"];
    SRN = getUrlVars()["SRN"];
    client_id = getUrlVars()["ClientID"];
    editmodify = getUrlVars()["Edit"];
    header = getUrlVars()["header"];
    Product_id = getUrlVars()["product_id"];
    sub_fba_id = getUrlVars()["sub_fba_id"];
    udid = getUrlVars()["udid"];
    utm_source = getUrlVars()["utm_source"];
    utm_campaign = getUrlVars()["utm_campaign"];
    utm_medium = getUrlVars()["utm_medium"];
    // Product_id = 10;
    if (getUrlVars()["mobile_no"] == "" || getUrlVars()["mobile_no"] == undefined) {
        mobile_no = 0;
    } else if ((app_version == 'FinPeace') && getUrlVars()["mobile_no"] != "") {
        mobile_no = getUrlVars()["mobile_no"];
        $('#ContactMobile').val(getUrlVars()["mobile_no"]);
    }

    if (app_version == "highway_delite_customer" && ss_id == "117277") {
        $(".col-xs-3").css("width", "32%");
        $("#menu").hide();
    } else {
        $(".col-xs-3").css("width", "25%");
        $("#menu").show();
    }
    var url = window.location.href;


    if (header == "yes") {
        $('.main-header').show();
        $('.main-header').css("top", "0px");
        $('.head').css('margin-top', '48px');
        $('.wrapper').css('margin-top', '48px');
    }

    if (Product_id == 1) {
        Product_Name = "Car";
        $('.FuelType').show();
        $('.variantType').removeClass('col-xs-6');
        $('.variantType').addClass('col-xs-12');
        $('#product_image').attr('src', 'images/car-icon.png');
        $('.LLPD').removeClass('hidden');
        $('.PAPD').show();
        $('.UNPASS').show();
        $('.carAttribute').show();
        $('.title,.header-middle').text('CAR INSURANCE');
        $('#spnElectricalAccessories').text('Min: 10,000 To Max: 50,000');
        $('#spnNonElectricalAccessories').text('Min: 10,000 To Max: 50,000');
        $('.carAttribute').removeClass('hidden');
        $('.bikeAttribute').addClass('hidden');
        $('.vehicleFinanced').hide();
        $('.CV_VehicleClass').hide();
        $(".own_premises").hide();
    } else if (Product_id == 10) {
        Product_Name = "Bike";
        $('#bundle').hide();
        $('#product_image').attr('src', 'images/two-wheeler-icon.png');
        $('.title,.header-middle').text('BIKE INSURANCE');
        $('#spnElectricalAccessories').text('Min: 5,000 To Max: 50,000');
        $('#spnNonElectricalAccessories').text('Min: 5,000 To Max: 50,000');
        $('.vehicleFinanced').hide();
        $('.CV_VehicleClass').hide();
        $(".own_premises").hide();
    } else if (Product_id == 12) {
        $('#bundle').hide();
        Product_Name = "CV";
        $('#product_image').attr('src', 'images/commercial_vehicle.png');
        $('.title,.header-middle').text('COMMERCIAL VEHICLE INSURANCE');
        $('.CV_VehicleClass').show();
        $('.vehicleFinanced').hide();
        $('.LLPD').removeClass('hidden');
        $('.PAPD').show();
        $('.UNPASS').show();
        $('.bikeAttribute').hide();
        $("#AMA").show();
        $('.carAttribute').show();
        $('.carAttribute').removeClass('hidden');
        $(".own_premises").show();
        $('.FuelType').show();
        $('#spnElectricalAccessories').text('Min: 10,000 To Max: 50,000');
        $('#spnNonElectricalAccessories').text('Min: 10,000 To Max: 50,000');
        //$('.p_cv_claim').hide().addClass('hidden'); //mg02-02-2022
    }

    if (editmodify == "modify") {
        if (SRN != null && SRN != "" && SRN != undefined && client_id != undefined && client_id != null && client_id != "") {

            $('#InputForm').show();
            $('.basicDetails').hide();
            $('.footerDiv').show();
            GetDataFromSIDCRN(SRN, client_id);
            $(".warningmsg").hide();

        }
    } else if ((fba_id == "" || fba_id == undefined || fba_id == "0" || app_version == "" || app_version == "0" || app_version == undefined || ss_id == "" || ss_id == undefined || ss_id == "0")) {
        $(".maindiv").hide();
        $(".warningmsg").show();
        $("#error_query_str").text(window.location.href.split('?')[1]);
    } else if (app_version == 'FinPeace' && (mobile_no == "" || mobile_no == null || mobile_no == "0")) {
        $(".maindiv").hide();
        $(".warningmsg").show();
    } else if (app_version == '2.2.4') {
        $(".maindiv").hide();
        $(".warningmsg").show();
        $('#warningerror').text("Page under construction");
    } else if (SRN != null) {
        $('.maininput').hide();
        $('.quotelist').show();
        $('#Property').removeClass('active in');
        $('#Appl').addClass('active in');
        Get_Search_Summary();
        Get_Saved_Data();
    } else {

        $(".maindiv").show();
        $(".warningmsg").hide();
    }


}

// function setProduct(product_name) {
// if (product_name == "Car") { Product_id = 1; Product_Name = "Car"; }
// else if (product_name == "Bike") { Product_id = 10; Product_Name = "Bike"; }

// }

function is_num(val) {
    if (isNaN(val)) {
        return false;
    } else {
        return true;
    }
}
function mobileValid(_Mobile) {
    var regMobile = new RegExp("^[6-9]{1}[0-9]{9}$");
    return regMobile.test(_Mobile);
}
function emailValid(_email) {
    var regEmail = /^[_\.0-9a-zA-Z-]+@([0-9a-zA-Z][0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}$/i;
    return regEmail.test(_email);
}
function nameValid(_str) {
    var reg = /^[a-zA-Z ]+$/;
    return reg.test(_str);
}
function passportValid(_number) {
    var reg = new RegExp("^[A-Z][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$");
    return reg.test(_number);
}

function GetUrl() {
    var url = window.location.href;
    var newurl;
    //newurl = "http://qa.policyboss.com";
    if (url.includes("request_file")) {
        // newurl = "http://qa-horizon.policyboss.com:3000";
        newurl = "http://localhost:3000";
    } else if (url.includes("qa")) {
        //newurl = "http://qa-horizon.policyboss.com:3000";
        newurl = url.includes("https") ? "https://qa-horizon.policyboss.com:3443" : "http://qa-horizon.policyboss.com:3000";
    } else if (url.includes("www") || url.includes("origin-cdnh") || url.includes("cloudfront")) {
        //newurl = "http://horizon.policyboss.com:5000";
        newurl = url.includes("https") ? "https://horizon.policyboss.com:5443" : "http://horizon.policyboss.com:5000";
    }
    return newurl;
}
function GetUrlrtovehicle(){
    let newurl = "http://qa-horizon.policyboss.com:3000";
    return newurl;
}
function BindMakeModel() {
    FilterVehicleList = [];
    var searchStr = $("#MakeModel").val();
    for (var i = 0; i < VehicleList.length; i++) {
        if ((VehicleList[i].vehicle_name.toString().toLowerCase()).indexOf(searchStr.toLowerCase()) > -1) {
            FilterVehicleList.push(VehicleList[i]);
        }
    }
}

function CallFuelOnModelSelect(Model_ID) {

    if (Product_id == 1 || Product_id == 10) {
<<<<<<< .mine
        var p_data = siteURL.indexOf("https") == 0 ? {method_name: '/vehicles/GetFuelVariant?Model_ID=' + Model_ID + '&Product_Id=' + Product_id, client_id: "2"} : "";
        var p_url = siteURL.indexOf("https") == 0 ? GeteditUrl() + '/horizon-method.php' : GetUrlrtovehicle() + '/vehicles/GetFuelVariant?Model_ID=' + Model_ID + '&Product_Id=' + Product_id;
    }

=======
        var p_data = siteURL.indexOf("https") == 0 ? {method_name: '/vehicles/GetFuelVariant?Model_ID=' + Model_ID + '&Product_Id=' + Product_id + '&make_name=' + $("#MakeName").val(), client_id: "2"} : "";
        var p_url = siteURL.indexOf("https") == 0 ? GeteditUrl() + '/horizon-method.php' : GetUrl() + '/vehicles/GetFuelVariant?Model_ID=' + Model_ID + '&Product_Id=' + Product_id + '&make_name=' + $("#MakeName").val();
    }	
	
	let vehicle_sub_class_code = $('#id_VehicleSubClass').val();
>>>>>>> .r12881
    if (Product_id == 12) {
<<<<<<< .mine
        var p_data = siteURL.indexOf("https") == 0 ? {method_name: '/vehicles/GetFuelVariant_cv?Model_ID=' + Model_ID + '&Product_Id=' + Product_id + '&vehicle_class=' + vehicle_class_code, client_id: "2"} : "";
        var p_url = siteURL.indexOf("https") == 0 ? GeteditUrl() + '/horizon-method.php' : GetUrlrtovehicle() + '/vehicles/GetFuelVariant_cv?Model_ID=' + Model_ID + '&Product_Id=' + Product_id + '&vehicle_class=' + vehicle_class_code;
=======
        var p_data = siteURL.indexOf("https") == 0 ? {method_name: '/vehicles/cv_beta_GetFuelVariant' + '/' + Model_ID + '/' + Product_id + '/' + vehicle_class_code + '/' + vehicle_sub_class_code + '/' + $("#MakeName").val(), client_id: "2"} : "";
        var p_url = siteURL.indexOf("https") == 0 ? GeteditUrl() + '/horizon-method.php' : GetUrl() + '/vehicles/cv_beta_GetFuelVariant' + '/' + Model_ID + '/' + Product_id + '/' + vehicle_class_code + '/' + vehicle_sub_class_code + '/' + $("#MakeName").val();
>>>>>>> .r12881
    }

    $.ajax({
        type: 'GET',
        dataType: 'json',
        data: p_data, //UAT
        url: p_url,

        success: function (Data) {

            console.log(Data);
            FuelList = Data['FuelList'];
            VariantList = Data['VariantList'];

            $("#FuelType").empty();
            $("#FuelType").append('<option value="0">Select Fuel Type</option>');
            if (FuelList.length <= 0) {
                $("#VariantID").empty();
                $("#VariantID").append('<option value="0">Select Variant</option>');
            } else {
                $.each(FuelList, function (i) {
                    var optionhtml = '<option value="' + FuelList[i] + '">' + FuelList[i] + '</option>';
                    $("#FuelType").append(optionhtml);
                    if (FuelList.length == 1) {

                        $('#FuelType').val(FuelList[i]).attr("selected", "selected").removeClass('Unselected');
                        $('label[for=FuelType], input#FuelType').show();
                        $("#FuelType").parent().removeClass('is-empty');
                        $('#ErFuelType').html("").hide();
                    }
                });
                if (($('#FuelType').text()).indexOf("Petrol") > 0 || ($('#FuelType').text()).indexOf("PETROL") > 0) { // || ($('#FuelType').text()).indexOf("Diesel") > 0) {
                    $("#FuelType").append('<option name="PetrolCNG" value="Petrol">EXTERNAL FITTED CNG</option>');
                    $("#FuelType").append('<option name="PetrolLPG" value="Petrol">EXTERNAL FITTED LPG</option>');

                }
                if (FuelSelected != null && FuelSelected != "") {
                    $("#FuelType").removeClass('Unselected');
                    $('label[for=FuelType], input#FuelType').show();
                    if (IsExternalBifuel == true) {
                        if (BiFuelTypeVal == "cng") {
                            $('select[id="FuelType"] option[name="PetrolCNG"]').attr("selected", "selected");
                        }
                        if (BiFuelTypeVal == "lpg") {
                            $('select[id="FuelType"] option[name="PetrolLPG"]').attr("selected", "selected");
                        }
                    } else {
                        if (FuelSelected == "Petrol" || FuelSelected == "PETROL" || FuelSelected == "CNG" || FuelSelected == "Diesel" || FuelSelected == "DIESEL") {
                            $('select[id="FuelType"] option[value="' + FuelSelected + '"]').attr("selected", "selected");
                        }
                    }
                }
                if (!(GLeadId === null || GLeadId === "" || GLeadId === undefined)) {
                    if (GLeadType === "sync_contacts") {
                        if ($("#FuelType").val() === "0") {
                            document.getElementById("FuelType").selectedIndex = "1";
                        }
                    }
                }
                CallVariantOnModelSelect(Model_ID);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });
}

$('select').change(function () {

    var thisId = $(this).attr('Id');
    var ErthisId = $("#Er" + thisId);
    if ($(this).val() == "0" || $(this).val() == null) {
        $('label[for=' + thisId + '], input#' + thisId + '').hide();
        $(this).addClass('empty Unselected');

        switch (thisId) {
            case "id_VehicleClass":
                ErrMsg = "Please Select Vehicle Class.";
                $("#id_VehicleSubClass").empty();
                $("#id_VehicleSubClass").append('<option value="0">Select Vehicle Sub Class</option>');
                break;
            case "id_VehicleSubClass":
                ErrMsg = "Please Select Vehicle Sub Class.";
                break;
            case "FuelType":
                ErrMsg = "Please Select Fuel Type.";
                $("#VariantID").empty();
                $("#VariantID").append('<option value="0">Select Variant</option>');
                $('label[for=VariantID], input#VariantID').hide();
                break;
            case "VariantID":
                ErrMsg = "Please Select " + Product_Name + " Variant from list.";
                break;
            case "PreviousInsurer":
                ErrMsg = "Please Select Previous Insurer.";
                break;
            case "NoClaimBonusPercent":
                $('label[for=NoClaimBonusPercent], input#NoClaimBonusPercent').show();
                ErrMsg = "";
                break;
        }
        $("#Er" + thisId).show().html(ErrMsg);
    } else {
        $(this).removeClass('Unselected');
        switch (thisId) {
            case "id_VehicleClass":
                VehicleClassSel = $(this).val();
                break;
            case "FuelType":
                FuelSelected = $(this).val();
                if (Product_Name == "Car" || Product_Name == "CV") {
                    VariantIDSelected = "";
                    $("#ValueOfBiFuelKit").val("");
                    //CallVariantOnModelNFuelSelect($("#Model_Name").val(), $(this).val());
                    CallVariantOnModelSelect($('#MakeModelID').val());
                }
                $('label[for=VariantID], input#VariantID').hide();
                break;
            case "VariantID":
                VariantIDSelected = $("#VariantID").val();
                $("#hdVariantID").val(VariantIDSelected);

                break;
            case "PreviousInsurer":
                break;
        }

        $('label[for=' + thisId + '], input#' + thisId + '').show();
        $("#Er" + thisId).hide().html("");
    }

    if (Product_Name == "Car" || Product_Name == "CV") {

        if ($('#FuelType :selected').text().indexOf("External") > -1 || $('#FuelType :selected').text().indexOf("EXTERNAL") > -1) {
            $("#IsBiFuelKit").val("yes");
            $("#divValueOfBiFuelKit").show();
            IsExternalBifuel = true;
            if ($('#FuelType :selected').text().indexOf("CNG") > -1) {
                $("#BiFuelType").val("cng");
                BiFuelTypeVal = "cng";
            } else {
                $("#BiFuelType").val("lpg");
                BiFuelTypeVal = "lpg";
            }
        } else {
            $("#divValueOfBiFuelKit").hide().val("");
            IsExternalBifuel = false;
            $("#IsBiFuelKit").val("no");
            $("#BiFuelType").val('');
        }
    } else {
        $("#IsBiFuelKit").val('');
        $("#BiFuelType").val('');
        IsExternalBifuel = false;
    }

    console.log("MakeModel : " + $("#MakeModel").val() + " & ID : " + $("#MakeModelID").val() + "\nFuelType : " + $("#FuelType").val() + "\nVariant : " + $("#VariantID option:selected").text() + " & ID : " + $("#VariantID").val());

    //if ($(this).val() != "") { ErthisId.html("").hide(); }
    //else { ErthisId.html(ErrMsg).Show(); }
});

$('#CityofRegitration').autocomplete({
    source: function (request, response) {
        $('#CityofRegitrationID').val("");
        if (RtoList != null && RtoList != undefined) {
            var RtoFilterList = [];
            var searchStr = $("#CityofRegitration").val();
            leadCty = "";
            for (var i = 0; i < RtoList.length; i++) {
                if ((("(" + RtoList[i].VehicleCity_RTOCode.toString() + ") " + RtoList[i].RTO_City.toString()).toLowerCase()).indexOf(searchStr.toLowerCase()) > -1) {
                    RtoFilterList.push(RtoList[i]);
                }
            }

            response($.map(RtoFilterList, function (item) {
                //console.log(RtoFilterList.length);
                if (RtoFilterList.length > 1) {
                    RtoFilterList.push({
                        CityofRegitrationID: null,
                        CityofRegitration: 'Not Found.'
                    });
                    //$('#CityofRegitrationID').val(null);
                }
                ;
                var label = "(" + item.VehicleCity_RTOCode + ") " + item.RTO_City;

                return {
                    label: label,
                    value: label,
                    id: item.VehicleCity_Id
                };
            }));
        }
    },
    minLength: 1,
    select: function (event, ui) {
        if (ui.item.id == null)
            return false;
        $('#ErCityofRegitration').hide();
        $('#CityofRegitrationID').val(ui.item.id);
        $('#CityofRegitration').val(ui.item.VehicleCity_RTOCode);
        $("#RegistrationNo").val("");
    }
});
$('#MakeModel').autocomplete({
    source: function (request, response) {
        if (FilterVehicleList != null && FilterVehicleList != undefined) {
            if (FilterVehicleList.length == 0) {
                FilterVehicleList.push({
                    MakeModelID: null,
                    MakeModel: 'Not Found.'
                });
                $('#MakeModelID').val(null);
            }
            ;
            response($.map(FilterVehicleList, function (item) {
                //console.log(item);
                return {
                    label: item.vehicle_name,
                    value: item.vehicle_name,
                    id: item.Model_ID
                };
            }));
        }
    },
    minLength: 1,
    select: function (event, ui) {
        if (ui.item.id == null)
            return false;
        $('#MakeModelID').val(ui.item.id);
        $('#divslide1Result').html("").hide();
        SelectedMakeModel = ui.item.value;
        var Model_ID = ui.item.id;
        var arr = (ui.item.value).split(',');
        arr[1] = (arr[1]).trim();
        ModelSelected = arr[1];
        $("#MakeName").val(arr[0]);
        $("#Model_Name").val(arr[1]);
        $('#MakeModel').addClass('used');
        if (arr[1] != null && $(this).val() != null) { // if (arr[1] != null) { //
            if (Model_ID != "0") {
                $("#MakeModelID").val(Model_ID);
                $("#ErMakeModel").hide();
                CallFuelOnModelSelect(Model_ID);

            }
        }
        FuelSelected = "";
    },
    change: function (event, ui) {
        if (ui.item == null) {
            $("#FuelType").empty();
            $("#FuelType").append('<option value="0">Select Fuel Type</option>');
            $("#VariantID").empty();
            $("#VariantID").append('<option value="0">Select Variant</option>');
        }
        MakeModelChange();
    }
});

function MakeModelChange() {
    $('#divslide1Result').html("").hide();
    $('#CNG_LPG_Kit').hide();
    var arr = $('#MakeModel').val().split(',');
    if (arr[1] != undefined) {
        arr[1] = (arr[1]).trim();
    }
    ModelSelected = arr[1];
    $("#MakeName").val(arr[0]);
    $("#Model_Name").val(arr[1]);

    $('.ErrorMsg').removeClass('DetailsError');

    if ($('#MakeModel').val() != null && arr[1] != null) {
        var Model_ID = $("#MakeModelID").val();
        CallFuelOnModelSelect(Model_ID);
    } else {
        $('#MakeModel').addClass('errorCheckBox');
        $("#MakeName, #Model_Name, #MakeModelID").val("");
        $("#FuelType").empty().append('<option value="0">Select Fuel Type</option>');
        $('label[for=FuelType], input#FuelType').hide();
        $("#VariantID").empty().append('<option value="0">Select Variant</option>');
        $('label[for=VariantID], input#VariantID').hide();
    }
    FuelSelected = "";
}

function CallVariantOnModelSelect(Model_ID) {

    if (Product_id == 1 || Product_id == 10) {
<<<<<<< .mine
        var p_data = siteURL.indexOf("https") == 0 ? {method_name: '/vehicles/GetFuelVariant?Model_ID=' + Model_ID + '&Product_Id=' + Product_id, client_id: "2"} : "";
        var p_url = siteURL.indexOf("https") == 0 ? GeteditUrl() + '/horizon-method.php' : GetUrlrtovehicle() + '/vehicles/GetFuelVariant?Model_ID=' + Model_ID + '&Product_Id=' + Product_id;
=======
        var p_data = siteURL.indexOf("https") == 0 ? {method_name: '/vehicles/GetFuelVariant?Model_ID=' + Model_ID + '&Product_Id=' + Product_id + '&make_name=' + $("#MakeName").val(), client_id: "2"} : "";
        var p_url = siteURL.indexOf("https") == 0 ? GeteditUrl() + '/horizon-method.php' : GetUrl() + '/vehicles/GetFuelVariant?Model_ID=' + Model_ID + '&Product_Id=' + Product_id + '&make_name=' + $("#MakeName").val();
>>>>>>> .r12881
    }

	let vehicle_sub_class_code = $('#id_VehicleSubClass').val();
    if (Product_id == 12) {
<<<<<<< .mine
        var p_data = siteURL.indexOf("https") == 0 ? {method_name: '/vehicles/GetFuelVariant_cv?Model_ID=' + Model_ID + '&Product_Id=' + Product_id + '&vehicle_class=' + vehicle_class_code, client_id: "2"} : "";
        var p_url = siteURL.indexOf("https") == 0 ? GeteditUrl() + '/horizon-method.php' : GetUrlrtovehicle() + '/vehicles/GetFuelVariant_cv?Model_ID=' + Model_ID + '&Product_Id=' + Product_id + '&vehicle_class=' + vehicle_class_code;
=======
        var p_data = siteURL.indexOf("https") == 0 ? {method_name: '/vehicles/cv_beta_GetFuelVariant' + '/' + Model_ID + '/' + Product_id + '/' + vehicle_class_code + '/' + vehicle_sub_class_code + '/' + $("#MakeName").val(), client_id: "2"} : "";
        var p_url = siteURL.indexOf("https") == 0 ? GeteditUrl() + '/horizon-method.php' : GetUrl() + '/vehicles/cv_beta_GetFuelVariant' + '/' + Model_ID + '/' + Product_id + '/' + vehicle_class_code + '/' + vehicle_sub_class_code + '/' + $("#MakeName").val();
>>>>>>> .r12881
    }

    $.ajax({
        type: 'GET',
        dataType: 'json',
        data: p_data,
        url: p_url,

        success: function (Data) {
            FuelList = Data['FuelList'];
            VariantList = Data['VariantList'];
            if (Product_Name == "Bike") {
                $("#FuelType").empty().removeClass('Unselected');
                $("#FuelType").append('<option value="Petrol">PETROL</option>');
                $('label[for=FuelType], input#FuelType').show();
                $("#FuelType").parent().removeClass('is-empty');
                $('#ErFuelType').html("").hide();
            }

            //New Code Starts
            var FilterVariantList = [];
            for (var i = 0; i < VariantList.length; i++) {
                if ((VariantList[i].Fuel_Name.toString().toLowerCase()).indexOf(FuelSelected.toLowerCase()) > -1) {
                    FilterVariantList.push(VariantList[i]);
                }
            }
            $("#VariantID").empty().append('<option value="0">Select Variant</option>');
            if (FilterVariantList.length <= 0) {
                $('#VehicleDetailsError').html("Variant Not Found").slideUp().slideDown();
            } else {
                $.each(FilterVariantList, function (i) {
                    var disp_is_base = ((FilterVariantList[i].Is_Base == "Yes") ? " (Base)" : "");
                    if (Product_id == 1 || Product_id == 10) {
                        var optionhtml = '<option value="' + FilterVariantList[i].Vehicle_ID + '">' + FilterVariantList[i].Variant_Name + ' (' + FilterVariantList[i].Cubic_Capacity + 'CC)' + disp_is_base + '</option>';
                        $("#VariantID").append(optionhtml);
                    }

                    if (Product_id == 12) {
                        var optionhtml = '';
                        if (vehicle_class_code == 24) {
                            optionhtml = '<option value="' + FilterVariantList[i].Vehicle_ID + '">' + FilterVariantList[i].Variant_Name + ' (' + FilterVariantList[i].Gross_Vehicle_Weight + ' GVW, ' + FilterVariantList[i].Product_Sub_Category_Class_Name + ')' + disp_is_base + '</option>';
                        }
                        if (vehicle_class_code == 41) {
                            optionhtml = '<option value="' + FilterVariantList[i].Vehicle_ID + '">' + FilterVariantList[i].Variant_Name + ' (' + FilterVariantList[i].Cubic_Capacity + 'CC)' + disp_is_base + '</option>';
                        }
                        if (vehicle_class_code == 35) {
                            optionhtml = '<option value="' + FilterVariantList[i].Vehicle_ID + '">' + FilterVariantList[i].Variant_Name + ' (' + FilterVariantList[i].Cubic_Capacity + 'HP)' + disp_is_base + '</option>';
                        }
                        $("#VariantID").append(optionhtml);
                    }

                    if (FilterVariantList.length == 1) {
                        $('#VariantID').val(FilterVariantList[i].Vehicle_ID).attr("selected", "selected");
                        $('#VariantID').removeClass('Unselected');
                        $('#ErVariantID').html("").hide();
                        $('label[for=VariantID], input#VariantID').show();
                        $('#hdVariantID').val($('#VariantID').val());
                        $('#TwoWheelerVariantID').val($('#VariantID').val());
                    }
                });

                if (VariantIDSelected != null && VariantIDSelected != "") {
                    $('#VariantID option[value="' + VariantIDSelected + '"]').attr('selected', true);
                    $("#VariantID").val(VariantIDSelected);
                    $("#hdVariantID").val(VariantIDSelected);
                    console.log("VariantID: " + $("#VariantID").val());
                    $('#TwoWheelerVariantID').val($('#VariantID').val());
                    $('#VariantID').parent().removeClass('is-empty');
                    $('label[for=VariantID], input#VariantID').show();
                }
                if (!(GLeadId === null || GLeadId === "" || GLeadId === undefined)) {
                    if (GLeadType === "sync_contacts") {
                        if (!(leadVrntName === null || leadVrntName === "" || leadVrntName === undefined)) {
                            for (var i in VariantList) {
                                if ((VariantList[i].Variant_Name === leadVrntName) && ($("#FuelType").val() === VariantList[i].Fuel_Name)) {
                                    $("#VariantID").val(VariantList[i].Vehicle_ID);
                                    $("#hdVariantID").val($("#VariantID").val());
                                    break;
                                } else {
                                    document.getElementById("VariantID").selectedIndex = "0";
                                    $("#hdVariantID").val($("#VariantID").val());
                                }
                            }
                        } else {
                            if ($("#VariantID").val() === "0") {
                                document.getElementById("VariantID").selectedIndex = "1";
                                $("#hdVariantID").val($("#VariantID").val());
                            }
                        }
                    }
                }
            }
            //New Code Ends
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });
}
$("#lblHaveNCBCertificate-Yes").click(function () { //No button
    $("#divNoClaimBonusPercent").slideDown();
    $('#HaveNCBCertificate').val("Yes");
    //$("#lblHaveNCBCertificate-Yes").addClass('btn-primarySelected active');
    //$("#lblHaveNCBCertificate-No").removeClass('btn-primarySelected active');
    $(".NCBNo").addClass('active');
    $(".NCBYes").removeClass('active');
    $('label[for=NoClaimBonusPercent], input#NoClaimBonusPercent').show();
});

$("#lblHaveNCBCertificate-No").click(function () { //Yes button
    $("#divNoClaimBonusPercent").slideDown();
    $('#HaveNCBCertificate').val("No");
    //$("#NoClaimBonusPercent").val("0");
    $("#txttenure").val("0");
    //$("#lblHaveNCBCertificate-No").addClass('btn-primarySelected active');
    //$("#lblHaveNCBCertificate-Yes").removeClass('btn-primarySelected active');
    $(".NCBYes").addClass('active');
    $(".NCBNo").removeClass('active');
    $("#lblHaveNCBCertificate-Yes").text("No");
    var custom_values = [0, 20, 25, 35, 45, 50];

    var slider = $("#range1").data("ionRangeSlider");

    // Change slider, by calling it's update method
    slider.update({
        min: 0,
        max: 50,
        from: 0,

        step: 5,
        grid: true,
        grid_snap: true,
        values: custom_values
                // etc.
    });
});


function TP_CompSet(type) {
    $('#TPCompPlan').empty();
    for (var i in product_attr) {
        if (i == Product_id) {
            $.each(product_attr[i], function (index, value) {
                if (typeof value == 'object' && value != null && index == type) {
                    $.each(value, function (index1, value1) {
                        if (typeof value1 == 'object' && value1 != null && index1 == "TPCompPlan") {
                            $.each(value1, function (index2, value2) {
                                $('#TPCompPlan').append($("<option></option>").attr("value", index2).text(value2));
                            });
                        }
                    });
                }
            });
        }
    }
    if (VehicleInsuranceSubtype != null && VehicleInsuranceSubtype != "") {

        $('#TPCompPlan').val(VehicleInsuranceSubtype);
    }

}

function Set_VoluntaryValue() {
    $('#VoluntaryDeduction').empty();
    $('#VoluntaryDeduction').append($("<option></option>").attr("value", 0).text("Not Opted"));
    for (var i in product_attr) {
        if (i == Product_id) {
            $.each(product_attr[i], function (index, value) {
                if (typeof value == 'object' && value != null && index == "VOLUNTARY_DEDUCTIBLE") {
                    $.each(value, function (index1, value1) {
                        $('#VoluntaryDeduction').append($("<option></option>").attr("value", index1).text(value1));
                    })
                }
            })
        }
    }
}

function TwoWheelerTypeNew() {

    twowheelerType = "NEW";
    IsFastLane = "False";
    $("#TwoWheelerType").val("NEW");
    $('#divDOPCNew').show();
    $('#divDOPCRenew').hide();
    $("#lblCompTP").show();
    $('.have_claim').hide();

    $('#DOPCNew').bootstrapMaterialDatePicker({
        time: false, clearButton: true, format: 'DD-MM-YYYY',
        minDate: moment().subtract(6, 'months'), // 6 Months Before The Current Day
        maxDate: moment(), // Current day
        currentDate: moment() // Current day
    });

    $('#DOPCNew').val("");
    $('#DOPCNew').on('open', function (e, date) {
        $('#DOPCNew').val("");
    });
}
function RegNoblockError(id) {
    $("#" + id).addClass('ErrorMessage1');
    var validationMsg = "Please Enter Valid Registration Number.";
    $('#RegistrationNoError').html(validationMsg).show();
    return false;
}

function RegNoError() {
    $("#RegistrationNo").addClass('ErrorMessage1');
    var validationMsg = "Please Enter Valid Registration Number.";
    $('#RegistrationNoError').addClass('ErrorMessage1');
    $('#RegistrationNoError').html(validationMsg).slideUp().slideDown();
    return false;
}
function SetDefaultValue() {
    $("#HaveNCBCertificate").val("Yes");
    $("#NoClaimBonusPercent").val("0");

}
function CheckType(type) {
    //debugger
    FlagRegNoValid = 0;
    $("#VehicleDetailsError").html("").hide();
    getPrevInsList();
    //$("#DateofPurchaseofCar").datepicker("refresh");
    //$('#DateofPurchaseofCar').bootstrapMaterialDatePicker('destroy');
    $("#TPCompPlan").show();
    if (type == "NEW") {
        IsTypeFastLane = false;
        OrgRtoFastLane = '';
        $('.IsTPPolicyExist').hide();
        if (Product_Name == "Car" || Product_Name == "CV") {
            InsPlanTypeYear = 3;
        } else {
            InsPlanTypeYear = 5;
        }
        $('#DOPCNew').show();
        //$('#HaveNCBCertificate').val("No");
        $("#PolicyExpiryDate").datepicker("refresh");
        SetDefaultValue();
        TwoWheelerTypeNew();
        InsurerPlanType("CompTP");
        TP_CompSet("NEW")
    } else if (type == "RENEW") {
        IsTypeFastLane = false;
        OrgRtoFastLane = '';
        InsPlanTypeYear = 1;
        $('#ManufactureYear').val("");
        $('#ManufactureMonth').val("");
        SetDefaultValue();
        TwoWheelerTypeRenew();
        InsurerPlanType("Comp");
        TP_CompSet("RENEW")
    } else if (type == "FastLane") {
        ClearForm();
        IsTypeFastLane = true;
        activeTab = '';
        BindModel_rto();
        $('#QuoteLoader').show();
        var Text_Pattern = new RegExp('^[a-zA-Z]+$');
        var Number_Pattern = new RegExp('^[0-9]*$');
        var AlphaNum_Pattern = new RegExp('^[0-9a-zA-Z]*$');

        if ($("#Reg1").val() == "" || $("#Reg1").val().length != 2 || (Text_Pattern.test($("#Reg1").val()) == false)) {
            RegNoblockError('Reg1');
            $('#QuoteLoader').hide();
        } else {
            $("#Reg1").removeClass('ErrorClass');
            OrgRtoFastLane = OrgRtoFastLane + $("#Reg1").val() + '-';
        }

        if ($("#Reg2").val() == "" || $("#Reg2").val().length != 2 || (AlphaNum_Pattern.test($("#Reg2").val()) == false)) {
            RegNoblockError('Reg2');
            $('#QuoteLoader').hide();
        } else if (Text_Pattern.test($("#Reg2").val()) == true) {
            RegNoblockError('Reg2');
            $('#QuoteLoader').hide();
        } else {
            $("#Reg2").removeClass('ErrorClass');
            OrgRtoFastLane = OrgRtoFastLane + $("#Reg2").val();
        }

        if ($("#Reg3").val() == "" || $("#Reg3").val().length < 1 || $("#Reg3").val().length > 3 || (Text_Pattern.test($("#Reg3").val()) == false)) {
            RegNoblockError('Reg3');
            $('#QuoteLoader').hide();
        } else {
            $("#Reg3").removeClass('ErrorClass');
        }

        if ($("#Reg4").val() == "" || $("#Reg4").val().length != 4 || (Number_Pattern.test($("#Reg4").val()) == false)) {
            RegNoblockError('Reg4');
            $('#QuoteLoader').hide();
        } else {
            $("#Reg4").removeClass('ErrorClass');
        }

        var RegNumber = $("#Reg1").val() + $("#Reg2").val() + $("#Reg3").val() + $("#Reg4").val();
        $("#RegistrationNo").val(RegNumber);

        InsPlanTypeYear = 1;
        twowheelerType = "RENEW";
        $("#TwoWheelerType").val("RENEW");
        $('#divDOPCRenew').show();
        $('#divDOPCNew').hide();
        $("#lblCompTP").hide();
        $("#RegistrationNoError").hide().html("");
        RegNo = $("#RegistrationNo").val().toUpperCase();
        var pattern1 = new RegExp('^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$');//new RegExp('^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$');
        var Result1 = pattern1.test(RegNo);
        var pattern2 = new RegExp('^[A-Z]{2}[0-9]{2}[A-Z]{3}[0-9]{4}$');
        var Result2 = pattern2.test(RegNo);
        var pattern3 = new RegExp('^[A-Z]{2}[0-9]{2}[A-Z]{1}[0-9]{4}$');
        var Result3 = pattern3.test(RegNo);
        var pattern4 = new RegExp('^[A-Z]{2}[A-Za-z0-9]{2}[A-Z]{2}[0-9]{4}$');
        var Result4 = pattern4.test(RegNo);
        var pattern5 = new RegExp('^[A-Z]{2}[0-9]{2}[0-9]{4}$');
        var Result5 = pattern5.test(RegNo);
        //var pattern31 = new RegExp('^[A-Z]{2}[0-9]{2}[A-Z]{1}[0-9]{4}$');
        //var pattern32 = new RegExp('^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{3}$');
        //var Result3 = pattern31.test(RegNo) || pattern32.test(RegNo);
        if (RegNo != "" && !(RegNo.length < 7 && RegNo.length > 11)) {
            if ((RegNo.length == 10 && (Result1 == true || Result4 == true)) || (RegNo.length == 11 && Result2 == true) || (RegNo.length == 9 && Result3 == true) || (RegNo.length == 8 && Result5 == true)) {
                twowheelerType = "RENEW";
                IsFastLane = 'True';
                $('#RegistrationNoError').html("").hide();
                $("#PreLoader").show();
                //SetDefaultValue();
                //GetFastLane(RegNo);
                CheckRTOFromDB();
                //SetInputValue();
            } else {
                RegNoError();
            }
        } else {
            RegNoError();




        }
        //InsurerPlanType("Comp");
        if (Product_Name == 'Car' || Product_Name == "CV") {
            InsurerPlanType("Comp");
        } else {
            InsurerPlanTypeBike('1CH_0TP', 'Bike');
        }
        $('.PolicyExpiryDate').show();
        $('.divNoClaimBonusPercent').show();
        $("#lblPolicyExist-Yes").addClass('btn-primarySelected active').removeClass('btn-UnSelected');
        $("#lblPolicyExist-No").addClass('btn-UnSelected').removeClass('btn-primarySelected active');
    }

    //SetInputValue();

    //SetTextInsPlan(InsPlanTypeYear);
}
function InsurerPlanTypeBike(type, VehType) {
    VehicleInsuranceSubtype = type;
    if (VehType == 'New') {
        $(".BikeNew").removeClass('btngrpSelected');
        $("#lbl_" + type).addClass('btngrpSelected');
    } else if (VehType == 'Renew') {
        $(".BikeRenew").removeClass('btngrpSelected');
        $("#lbl_" + type).addClass('btngrpSelected');
    }
}
function SetTextInsPlan(Years) {
    var year, Yeartext = "";
    if (twowheelerType == "NEW") {
        year = Years - 1;
    } else {
        Years = 1;
    }


    if (Years == 1) {
        Yeartext = "1 Yr"
    } else {
        Yeartext = Years + " Yrs"
    }

    $("#lblTP").text("T.P. Only (" + Yeartext + ")");
    $("#lblCompTP").text("Comprehensive (1 Yr) + T.P. (" + year + " Yrs)");
    $("#lblComp").text("Comprehensive Plan (" + Yeartext + ")");
}
function TwoWheelerTypeRenew() {
    twowheelerType = "RENEW";
    $("#TwoWheelerType").val("RENEW");
    $('#divDOPCRenew').show();
    $('#divDOPCNew').hide();
    $("#lblCompTP").hide();
    $('#DOPCRenew').val('');
    if (!isPostBack) {
        $("#txttenure").val("0");
    }

    $('#DOPCRenew').bootstrapMaterialDatePicker({
        time: false, clearButton: true, format: 'DD-MM-YYYY',
        minDate: moment().subtract(15, 'years'), // 15 Years Before The Current Day // moment().subtract(15, 'y'),
        maxDate: moment().subtract(6, 'months'), // 6 Months Before The Current Day
        currentDate: moment().subtract(12, 'months'), // 1 Year Before The Current Day
        onSelect: function () {
            myfunction();
        }
    });
    $('#DOPCRenew').val("");
    $('#DOPCRenew').on('open', function (e, date) {
        $('#DOPCRenew').val("");
    });

    $('#PolicyExpiryDate').bootstrapMaterialDatePicker({
        time: false, clearButton: true, format: 'DD-MM-YYYY',
        minDate: moment().subtract(180, 'days'), // (180 Days Before The Current Day) Or (Current Day)//mg22-04-2022
        maxDate: moment().add(60, 'days'), // 180 Days After The Current Day
        //minDate: (Product_id == 10 ? moment().subtract(180, 'days') : moment()), // (180 Days Before The Current Day) Or (Current Day)
        //maxDate: moment().add(60, 'days'), // 180 Days After The Current Day
        defaultDate: moment(),
        onselect: function () {
            myfunction1();
        }
    });
}
/** mg 30-01-2022
 function CheckIsTPPolicyExist(value){
 if(value == "Yes"){
 $("#isTPPolicyExist-Yes").addClass('btn-primarySelected active').removeClass('btn-UnSelected');
 $("#isTPPolicyExist-No").addClass('btn-UnSelected').removeClass('btn-primarySelected active');
 IsTPPolicyExistflag = 'yes';
 }
 else if(value == "No"){
 $("#isTPPolicyExist-No").addClass('btn-primarySelected active').removeClass('btn-UnSelected');
 $("#isTPPolicyExist-Yes").addClass('btn-UnSelected').removeClass('btn-primarySelected active');
 IsTPPolicyExistflag = 'no';
 }
 }*/
function SmartQuoteCalculate() {

    var name = $("#ContactName").val();
    var arr_name = name.split(' ');
    var first_name = "",
            last_name = "",
            middle_name = "";
    first_name = arr_name[0];
    last_name = arr_name.length > 1 ? arr_name[arr_name.length - 1] : "";
    if (arr_name.length > 2) {
        arr_name.splice(0, 1);
        arr_name.splice(arr_name.length - 1, 1);
        middle_name = arr_name.join(' ');
    }
    //setcookies();
    srn = "";
    $('#OwnerDriverPersonalAccidentCover').val("Yes");
    $('#PaidDriverPersonalAccidentCover').val("0");
    $("#PersonalAccidentCoverforDriver").val("No");
    $("#IsAntiTheftDevice").val("No");
    $("#RegisterintheName").val(fin_vehicle_registration_type);

    $("#MemberofAA").val("No");
    // $('#VehicleType').val($('#TwoWheelerType').val() == "NEW" ? 0 : 1);

    if ($("#VariantID").val() == PrevVehicle_id && $("#CityofRegitrationID").val() == PrevRto_id && $("#DateofPurchaseofCar").val() == PrevReg_Date) {
        $("#CustomerReferenceID").val(PreCRN);
    } else {
        $("#CustomerReferenceID").val("0");
    }


    var dataToPost = $("form").serializeArray();
    var objCarInsurance = {};
    $(dataToPost).each(function (index, value) {
        objCarInsurance[value.name] = value.value;
    });

    var manf_date = objCarInsurance['ManufactureYear'] + "-" + objCarInsurance['ManufactureMonth'] + "-01";
    if (twowheelerType == "RENEW") {
        if (IsPolicyExistFlag == "yes") {
            var expiry_date = $('#PolicyExpiryDate').val().split('-');
            var expiry_date_new = expiry_date[2] + "-" + expiry_date[1] + "-" + expiry_date[0];

            //Breakin Case Added By Pratik 11-03-2019
            var selectedDate = new Date(expiry_date_new);
            var now = new Date();
            now.setHours(0);
            now.setMinutes(0);
            now.setSeconds(0, 0);
            if (selectedDate < now) {
                PEDFlag = "yes";
            } else {
                PEDFlag = "no";
            }
        } else if (IsPolicyExistFlag == "no") {//Breakin Case Added By Pratik 20-03-2019
            $('#PreviousInsurer').val("0");
            PEDFlag = "yes";
            $('#HaveNCBCertificate').val("No");
            $('#txttenure').val("0");
        }
    } else if (twowheelerType == "NEW") {
        PEDFlag = "no";
        IsPolicyExistFlag = "no";
		$("#CPATenure_Car").val("1");
		$("#CPATenure_TW").val("1");
    }
    var DateofPurchaseofCar = $('#DateofPurchaseofCar').val().split('-');
    DateofPurchaseofCar = DateofPurchaseofCar[2] + '-' + DateofPurchaseofCar[1] + '-' + DateofPurchaseofCar[0];

    var _registration_no = $("#RegistrationNo").val() == null ? "" : $("#RegistrationNo").val();

    if (_registration_no.length > 0) {
        if (IsFastLane == 'True') {
            _registration_no = $("#RegistrationNo").val();

        } else {
            //_registration_no  = $("#Reg1").val().toUpperCase() + "-" + $("#Reg2").val() + "-AA-1234";
            _registration_no = $("#CityofRegitration").val().substring(1, 3) + "-" + $("#CityofRegitration").val().substring(3, 5) + "-" + $("#Reg3").val().toUpperCase() + "-" + $("#Reg4").val();
        }

    } else {
        _registration_no = $("#CityofRegitration").val().substring(1, 3) + "-" + $("#CityofRegitration").val().substring(3, 5) + "-AA-1234";
    }

    if ($("#TPCompPlan").val() === "1OD_0TP") {
        $('.LLPD').addClass('hidden');
        $('.UNPASS').hide();
    } else {
        $('.UNPASS').show();
        $('.LLPD').removeClass('hidden');
    }

    var data1 = {
        "product_id": Product_id,
        "vehicle_id": parseInt($('#hdVariantID').val()),
        "rto_id": parseInt(objCarInsurance['CityofRegitrationID']),
        "vehicle_insurance_type": $('#VehicleType').val(),
        "vehicle_manf_date": manf_date,
        "vehicle_registration_date": DateofPurchaseofCar,
        "policy_expiry_date": expiry_date_new == undefined ? "" : expiry_date_new,
        "prev_insurer_id": $('#PreviousInsurer').val(),
        "vehicle_registration_type": fin_vehicle_registration_type,
        "vehicle_ncb_current": $('#txttenure').val(),
        "is_claim_exists": $('#HaveNCBCertificate').val() == "No" ? "yes" : "no",
        "method_type": "Premium",
        "execution_async": "yes",
        "electrical_accessory": 0,
        "non_electrical_accessory": 0,
        "registration_no": _registration_no,
        "is_llpd": $("#PersonalAccidentCoverforDriver").val() == "Yes" ? "yes" : "no",
        "is_antitheft_fit": objCarInsurance['IsAntiTheftDevice'].toLowerCase(),
        "voluntary_deductible": objCarInsurance['VoluntaryDeduction'],
        "is_external_bifuel": objCarInsurance['IsBiFuelKit'],
        "is_aai_member": objCarInsurance['MemberofAA'].toLowerCase(),
        "external_bifuel_type": objCarInsurance['BiFuelType'],
        "external_bifuel_value": objCarInsurance['ValueOfBiFuelKit'],
        "pa_owner_driver_si": "1500000",
        "is_having_valid_dl": "no",
        "is_inspection_done": "no",
        "is_pa_od": "yes",
        "is_opted_standalone_cpa": "yes",
        "pa_named_passenger_si": objCarInsurance['NamedPersonalAccidentCover'],
        "pa_unnamed_passenger_si": objCarInsurance['PersonalCoverPassenger'],
        "pa_paid_driver_si": objCarInsurance['PaidDriverPersonalAccidentCover'],
        "vehicle_expected_idv": 0,
        "vehicle_insurance_subtype": $('#TPCompPlan').val(),
        "first_name": first_name,
        "middle_name": middle_name,
        "last_name": last_name,
        "email": getUrlVars()['hd_email'] != "" && getUrlVars()['hd_email'] != undefined && getUrlVars()['hd_email'] != null ? getUrlVars()['hd_email'] : $("#ContactEmail").val(),
        "mobile": $("#ContactMobile").val(),
        "crn": $('#CustomerReferenceID').val() == "" ? "" : parseInt($('#CustomerReferenceID').val()),
        "ss_id": ss_id,
        "fba_id": fba_id,
        "geo_lat": geo_lat ? geo_lat : 0,
        "geo_long": geo_long ? geo_long : 0,
        "agent_source": "",
        "ip_address": ip_address,
        "app_version": app_version,
        "mac_address": mac_address,
        "voluntary_deductible": 0,
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
        "is_financed": "no",
        "is_oslc": "no",
        "oslc_si": 0,
        "ip_city_state": ip_city_state ? ip_city_state : "",
        "vd_customer_name" : getUrlVars()['vd_customer_name'] != "" && getUrlVars()['vd_customer_name'] != undefined && getUrlVars()['vd_customer_name'] != null ? getUrlVars()['vd_customer_name'] : "",
        "vd_mobile" : getUrlVars()['vd_mobile'] != "" && getUrlVars()['vd_mobile'] != undefined && getUrlVars()['vd_mobile'] != null ? getUrlVars()['vd_mobile'] : "",
        "vd_email": getUrlVars()['vd_email'] != "" && getUrlVars()['vd_email'] != undefined && getUrlVars()['vd_email'] != null ? getUrlVars()['vd_email'] : "",
        "vd_registration_no" : getUrlVars()['vd_registration_no'] != "" && getUrlVars()['vd_registration_no'] != undefined && getUrlVars()['vd_registration_no'] != null ? getUrlVars()['vd_registration_no'] : "",
        "vd_customer_identifier" : getUrlVars()['vd_customer_identifier'] != "" && getUrlVars()['vd_customer_identifier'] != undefined && getUrlVars()['vd_customer_identifier'] != null ? getUrlVars()['vd_customer_identifier'] : "",
        "app_visitor_id" : app_visitor_id
                
    };
    /*
     if($("#TPCompPlan").val() !== "1OD_0TP" && ($('#VehicleType').val() === "renew") &&  (Product_id == 1 || Product_id == 10)){
     data1['is_tp_policy_exists'] = IsTPPolicyExistflag;
     }*/
    data1["is_breakin"] = PEDFlag;
    //data1["is_policy_exist"] = 'yes';
    if ($("#TPCompPlan").val() == "1OD_0TP") {
        data1["tp_insurer_id"] = $('#TP_PolicyInsurer').val();
    }
    if (Product_id == 1 || Product_id == 10) {
        data1["is_policy_exist"] = IsPolicyExistFlag;
    }
    if (Product_id == 10) {
        data1["is_tppd"] = $("#IsTPPD").val() == "yes" ? "yes" : "no";
    }
    if (Product_id == 1 && $('#TPCompPlan').val() == "0CH_1TP") {
        $('.bikeAttribute').removeClass('hidden');
        data1["is_tppd"] = $("#IsTPPD").val() == "yes" ? "yes" : "no";
    }
    if (Product_id == 12) {
        data1["vehicle_sub_class"] = $("#id_VehicleSubClass").val();
        data1["vehicle_class"] = $("#id_VehicleClass").val();
        data1["vehicle_class_code"] = vehicle_class_code;

        data1["own_premises"] = "no";

        //cv covers
        data1["cleaner_ll"] = "no";
        data1["geographicalareaext"] = "no";
        data1["additionaltowing"] = "no";
        data1["fibreglasstankfitted"] = "no";

        //gcv covers
        data1["imt23"] = "no";
        data1["other_use"] = "no";
        data1["emp_pa"] = "no";
        data1["coolie_ll"] = "no";

        //pcv covers
        data1["non_fairing_paying_passenger"] = "no";
        data1["fairing_paying_passenger"] = "no";
        data1["conductor_ll"] = "no";
    }
    if (origin_crn != "" && origin_crn !== undefined && origin_udid !== undefined && origin_udid !== "") {
        data1['origin_crn'] = origin_crn;
        data1['origin_udid'] = origin_udid;
        data1['origin_email'] = origin_email;
        data1['lead_type'] = "cross_sell";
    }

    if (GLeadId != null && GLeadType != null && GLeadStatus != null && GLeadId != '' && GLeadType != '' && GLeadStatus != '' && GLeadId != undefined && GLeadType != undefined && GLeadStatus != undefined) {
        data1["lead_id"] = GLeadId;
        data1["lead_type"] = GLeadType;
        data1["lead_status"] = GLeadStatus;
    }
    if (sub_fba_id != '' || sub_fba_id != null) {
        data1["sub_fba_id"] = sub_fba_id;
    }
    console.log(JSON.stringify(data1));
    if (IsTypeFastLane === true) {
        if (OrgRtoFastLane !== '') {
            data1["regno_rtocode"] = OrgRtoFastLane.toUpperCase();
            data1["is_fastlane_rto"] = "yes";
        }
    } else {
        data1["is_fastlane_rto"] = "no";
    }
    //data1['quote_mode'] = "prefetch";
    if (data1.hasOwnProperty("quote_mode")) {
        if (data1['quote_mode'] = "prefetch") {
            quoteMode = "ShowLERPPopup";
        }
    }
    if (utm_source != undefined && utm_campaign != undefined && utm_medium != undefined) {
        data1['utm_source'] = utm_source;
        data1['utm_campaign'] = utm_campaign;
        data1['utm_medium'] = utm_medium;
        data1['lead_type'] = "LERP_FRESH";
    }

    var obj_horizon_data = Horizon_Method_Convert("/quote/premium_initiate", data1, "POST");

    $.ajax({
        type: "POST",
        data: siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(data1),
        url: siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/premium_initiate",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {

            if ((data.hasOwnProperty("Details")) && ((data.hasOwnProperty("Summary")) ? ((data.Summary.hasOwnProperty("Request_Unique_Id")) || (data.Summary.Request_Unique_Id == "")) : true)) {
                var msg = data.Details.join('<br/>');
                $('.error_popupbox').show();
                $(".Agebox_wrap").html(msg);
            } else {

                $('.error_popupbox').hide();
                $(".Agebox_wrap").empty();

                console.log(data);
                console.log(SRN);
                SRN = data.Summary.Request_Unique_Id;

                $('.maininput').hide();
                $('.quotelist').show();
                $('.footerDiv').hide();

                $('#Property').removeClass('active in');
                $('#Appl').addClass('active in');
                Get_Search_Summary();
                Get_Saved_Data();
                $('#addonChecked').prop('checked', false);
                $('#SelectAllAddons').prop('checked', false);
                //window.location.href = "./tw-main-page.html?SRN=" + SRN + "&ClientID=2";
                $(".tonnageWarning").hide();
            }
        },
        error: function (data) {

            $.alert("Cannot Proceed Now. Please Try Again!");
            console.log(data);

        }
    });


}

function Get_Saved_Data() {
    $('.footerDiv').hide();
    $('.loading').show();
    $('.refresh1').show();
    $('#Input1').removeClass('active');
    $('#Quote1').addClass('active');
    var mainUrl = GetUrl() + "/quote/premium_list_db";
    var str1 = {
        "search_reference_number": SRN,
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9"
    };
    var obj_horizon_data = Horizon_Method_Convert("/quote/premium_list_db", str1, "POST");
    $.ajax({
        type: "POST",
        data: siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(str1),
        url: siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/premium_list_db",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {

            if (!(data.Msg === "Not Authorized")) {
                console.log(data);
                Response_Global = data;
                clientid = data.Summary["Client_Id"];
                udid = data.Summary.Request_Core.udid;
                AgentType = clientid == 3 ? "POSP" : "NonPOSP";
                ss_id = data.Summary.Request_Core.ss_id;
                app_version = data.Summary.Request_Core.app_version;
                GLeadId = data.Summary.Request_Core.lead_id;
                GLeadType = data.Summary.Request_Core.lead_type;
                GLeadStatus = data.Summary.Request_Core.lead_status;
                origin_crn = data.Summary.Request_Core.origin_crn;
                origin_udid = data.Summary.Request_Core.origin_udid;
                origin_email = data.Summary.Request_Core.origin_email;
                arr_preference = data['Summary']['Prefered_Insurer_list'] !== undefined ? data['Summary']['Prefered_Insurer_list'].reverse() : "";
                quotes = data;
                response_handler();
                $('#CRN').text(data.Summary.Request_Core.crn == 0 ? data.Summary.PB_CRN : data.Summary.Request_Core.crn);
                $('.CRN').text(data.Summary.Request_Core.crn == 0 ? data.Summary.PB_CRN : data.Summary.Request_Core.crn)
                var CreateTime = new Date(data['Summary'].Created_On);
                var CurrentTime = new Date();
                var DateDiff = Date.parse(CurrentTime) - Date.parse(CreateTime);
                console.log(DateDiff);
                StatusCount++;

                var is_complete = false;
                if ((DateDiff >= 30000 || data['Summary']['Status'] === "complete")) {
                    is_complete = true;
                    $('.loading').hide();
                    $('#txt_gst_tx').show();
                    $('#Appl').show();
                }
                if (is_complete === false) {

                    setTimeout(() => {
                        Get_Saved_Data();

                        $('.insurer_count').text("");
                        $('.insurer_count').text(insurer_count);
                    }, 3000);
                }
            } else {
                console.log("Quotes not available for selected Criteria");
            }
        },

        error: function (result) {
            // alert("Error");

        }
    });

}
function rupee_format(x) {
    if (x) {
        x = x.toString();
        var lastThree = x.substring(x.length - 3);
        var otherNumbers = x.substring(0, x.length - 3);
        if (otherNumbers != '')
            lastThree = ',' + lastThree;
        return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    } else {
        return 0;
    }
}

$('#GET_QUOTE').click(function (e) {
    leadVrntName = "";
    Error = 0;



    if ($("#TPCompPlan").val() == '' || $("#TPCompPlan").val() == null || $("#TPCompPlan").val() == undefined) {
        Error++;
        $("#ErTPCompPlan").show().html("Please Select Policy Type");
    } else {
        $("#ErTPCompPlan").hide().html("");
    }

    //debugger;
    if (Product_id == 12 && vehicle_class_code == 0) {
        Error++;
        $("#Erid_VehicleClass").show().html("Please Select Vehicle Class");
    }

    if (Product_id == 12 && vehicle_subclass_code == 0) {
        Error++;
        $("#Erid_VehicleSubClass").show().html("Please Select Vehicle Sub Class");
    }

    if ($('#MakeModelID').val() != "0" && $('#MakeModel').val() != "") {
        $("#ErMakeModel").hide().html("");
        if ($('#FuelType').val() == "0" || $('#FuelType').val() == "") {
            Error++;
            $("#ErFuelType").show().html("Please Select Fuel Type From List.");
            $("#VariantID").empty().append('<option value="0">Select Variant</option>');
        } else {
            $("#ErFuelType").hide().html("");
            if (Product_Name == "Car" || Product_Name == "CV") {
                if (IsExternalBifuel == true) {
                    if ($("#ValueOfBiFuelKit").val() >= 10000 && $("#ValueOfBiFuelKit").val() <= 60000) {
                        $("#ErValueOfBiFuelKit").hide().html("");
                    } else {
                        Error++;
                        $("#ErValueOfBiFuelKit").show().html("The Value CNG/LPG Kit Should Be Between 10000 & 60000");
                    }
                }
            }
            if ($('#VariantID').val() == "0" || $('#VariantID').val() == "" || $('#VariantID').val() <= 0) {
                Error++;
                $("#ErVariantID").show().html("Please Select " + Product_Name + " Variant From List.");
            } else {
                $("#ErVariantID").hide().html("");
            }
        }
    } else {
        Error++;
        $("#ErMakeModel").show().html("Please Enter Proper " + Product_Name + " Make And Model.");
        $("#MakeName, #Model_Name, #MakeModelID").val("");
        $("#FuelType").empty().append('<option value="0">Select Fuel Type</option>');
        $("#VariantID").empty().append('<option value="0">Select Variant</option>');
    }

    //if(IsFinancedFlag == '' && (Product_id == 1 || Product_id == 10)){
    /*if (IsFinancedFlag == '' && Product_id == 1) {
     Error++; $("#ErIs_financed").show().html("Please Select Yes or No");
     } else {
     $("#ErIs_financed").hide().html("");
     }*/

    //if(IsFinancedFlag == 'Yes' && $("#finance_amount").val() == "" && (Product_id == 1 || Product_id == 10)){
    /*if (IsFinancedFlag == 'Yes' && $("#finance_amount").val() == "" && Product_id == 1) {
     Error++; $("#Erfinance_amount").show().html("Outstanding Loan Amount Should not be blank");
     }*/

    /*if ($("#finance_amount").val() != "" && (Product_id == 1 || Product_id == 10)) {
     if (is_num($("#finance_amount").val()) == false) {
     Error++; $("#Erfinance_amount").show().html("Please Enter Proper Outstanding Loan Amount");
     } else {
     if (parseInt($("#finance_amount").val()) < parseInt(0) || parseInt($("#finance_amount").val()) > parseInt(2000000)) {
     Error++; $("#Erfinance_amount").show().html("Please Enter Outstanding Loan Amount between 0 to 20,00,000");
     } else {
     $("#Erfinance_amount").hide().html("");
     }
     }
     }*/

    if (twowheelerType == "NEW") {
        if ($("#DOPCNew").val() == "") {
            Error++;
            $("#ErDOPCNew").show().html("Please Select Registration/Invoice Date.");
        } else {
            $("#ErDOPCNew").hide().html("");
        }
    }
    if (twowheelerType == "RENEW") {
        if ($("#DOPCRenew").val() == "") {
            Error++;
            $("#ErDOPCRenew").show().html("Please Select Registration/Invoice Date.");
        } else {
            $("#ErDOPCRenew").hide().html("");
        }
    }

    if ($('#CityofRegitrationID').val() <= 0 || $('#CityofRegitration').val() == "") {
        Error++;
        $("#ErCityofRegitration").show().html("Please Enter Place Of Registration From List.");
    } else {
        $("#ErCityofRegitration").hide().html("");
    }

    if ($("#ManufactureDate").val() == "") {
        Error++;
        $("#ErManufactureDate").show().html("Please Select Year - Month Of Registration.");
    } else {
        var MD = parseInt(($('#ManufactureDate').val()).substring(3, 7));
        if (new Date().getFullYear() < MD) {
            Error++;
            $("#ErManufactureDate").show().html("Please Select Year Less Than Current Date.");
        } else if ((new Date().getFullYear() - 25) > MD) {
            Error++;
            $("#ErManufactureDate").show().html("Please Select Year Upto 25 Year From Current Date.");
        } else {
            $("#ErManufactureDate").hide().html("");
        }
    }

    var DPC = $("#DateofPurchaseofCar").val().split('-');
    var DPCDate = DPC[1] + "-" + DPC[0] + "-" + DPC[2];
    var MD = $("#ManufactureDate").val().split('-');
    var MDDate = MD[0] + "-" + "01" + "-" + MD[1];
    SetManuDate();
    var CompareRenew = false;
    CompareRenew = new Date(MDDate) > new Date(DPCDate) == true;
    if (CompareRenew) {
        $('.ErMFGID').html('Date Of First Registration Must Be Greater Than The Vehicle Manufacturing Year & Month.').slideUp().slideDown();
        Error++;
        return false;
    }

    var MthOfMan = parseInt(($('#ManufactureDate').val()).split("-")[0]);
    if (twowheelerType == "RENEW") {
        var yr = parseInt(($("#DOPCRenew").val()).split("-")[2]);
        var MthOfReg = parseInt(($("#DOPCRenew").val()).split("-")[1]);
    } else {
        var yr = parseInt(($("#DOPCNew").val()).split("-")[2]);
        var MthOfReg = parseInt(($("#DOPCNew").val()).split("-")[1]);
    }

    if ((Math.abs(MD[1] - yr)) <= 2) {
        if ((Math.abs(MD[1] - yr)) == 2) {
            if ((MthOfReg - 1) > MthOfMan) {
                if ($("#ErManufactureDate").val() === "" || $('.ErMFGID').val() === "") {
                    Error++;
                    $("#ErManufactureDate").html("");
                    $('#ErMFGID').html("");
                    $("#ErManufactureDate").show().html("Difference of more than 2 years in Registration date and manufacturing date. Please select proper date .");
                }
            } else {
                $("#ErManufactureDate").hide().html("");
                $('#ErMFGID').hide().html("");
            }
        } else {
            $("#ErManufactureDate").hide().html("");
            $('#ErMFGID').hide().html("");
        }
    } else {
        if ($("#ErManufactureDate").val() === "" || $('.ErMFGID').val() === "") {
            Error++;
            $("#ErManufactureDate").html("");
            $('#ErMFGID').html("");
            $("#ErManufactureDate").show().html("Difference of more than 2 years in Registration date and manufacturing date. Please select proper date .");
        }
    }

    //Previous year policy
    var VehicleInsuranceSubtype = $("#VehicleInsuranceSubtype").val();
    var arr = $("#PolicyExpiryDate").val().split('-');
    var Days = (((new Date(Date.now())).getTime()) - ((new Date(arr[1] + "-" + arr[0] + "-" + arr[2])).getTime())) / (1000 * 60 * 60 * 24);
    if (twowheelerType == "RENEW" && IsPolicyExistFlag == "yes") {
        if ($("#PolicyExpiryDate").val() == "") {
            Error++;
            $("#ErPolicyExpiryDate").show().html("Please Select Policy Expiry Date");
        } else {
            var DOPCar1 = $("#DateofPurchaseofCar").val().split('-');
            DOPCar = DOPCar1[2] + "-" + DOPCar1[1] + "-" + DOPCar1[0];

            var MDate1 = $("#ManufactureDate").val().split('-');
            MDate = MDate1[1] + "-" + MDate1[0] + "-01";

            var PEDate1 = $("#PolicyExpiryDate").val().split('-');
            PEDate = PEDate1[2] + "-" + PEDate1[1] + "-" + PEDate1[0];

            if (((((new Date(DOPCar)).getTime()) - ((new Date(PEDate)).getTime())) / (1000 * 60 * 60 * 24)) > 0) {
                Error++;
                $("#ErPolicyExpiryDate").show().html("Policy Expiry Date Should greater than Date of Purchase of " + ProductName);
            } else if (((((new Date(MDate)).getTime()) - ((new Date(PEDate)).getTime())) / (1000 * 60 * 60 * 24)) > 0) {
                Error++;
                $("#ErPolicyExpiryDate").show().html("Policy Expiry Date Should greater than Manufacturing Date");
            }

            var Days = (((new Date(Date.now())).getTime()) - ((new Date(PEDate)).getTime())) / (1000 * 60 * 60 * 24);

            if (Math.floor(Days) > 120) {
                Error++;
                $("#ErPolicyExpiryDate").show().html("Please Select Proper Policy Expiry Date");
            } else {
                $("#ErPolicyExpiryDate").hide().html("");
            }

            //Check For Prev PolicyStartDate
            var PSDate = (parseInt(PEDate1[2]) - 1) + "-" + PEDate1[1] + "-" + PEDate1[0];
            if (((((new Date(MDate)).getTime()) - ((new Date(PSDate)).getTime())) / (1000 * 60 * 60 * 24)) > 0) {
                Error++;
                $("#ErPolicyExpiryDate").show().html("Policy Expiry Date Should 1 year greater than Manufacturing Date");
            }
        }


        if ($('#PreviousInsurer').val() <= 0 || $('#PreviousInsurer').val() == "") {
            Error++;
            $("#ErPreviousInsurer").show().html("Please Select Previous Insurer.");
        } else {
            $("#ErPreviousInsurer").hide().html("");
        }

        var VIST = VehicleInsuranceSubtype.split('CH_');
        if (VIST[0] != '0') {
            if (!$("#lblHaveNCBCertificate-No").hasClass("active") && !$("#lblHaveNCBCertificate-Yes").hasClass("active")) {

                $("#lblHaveNCBCertificate-No, #lblHaveNCBCertificate-Yes").addClass("btnError");
                Error++;
                if (PEDFlag == true) {
                    Error--;
                }
            } else {
                $("#lblHaveNCBCertificate-No, #lblHaveNCBCertificate-Yes").removeClass("btnError");
            }
        }

        //mg22-04-2022
        var Days = (((new Date(Date.now())).getTime()) - ((new Date(PEDate)).getTime())) / (1000 * 60 * 60 * 24);
        if (Math.floor(Days) > 0 && Product_id == 12 && (VehicleInsuranceSubtype == "1CH_0TP" && ['gcv_public_otthw', 'pcv_fw_lt6pass', 'pcv_fw_gt6pass', 'pcv_tw'].indexOf($("#id_VehicleSubClass").val()) > -1)) {
            Error++;
            $('.AlertOvl').show();
            $('.alert_container').text("Breakin Not Allowed.").css("text-align", "center");
            $('.ok_btn').click(function () {
                $('.AlertOvl').hide();
            });
        }
    }
    //mg25-04-2022
    if (twowheelerType == "RENEW" && IsPolicyExistFlag == "no" && Product_id == 12 && (VehicleInsuranceSubtype == "1CH_0TP" && ['gcv_public_otthw', 'pcv_fw_lt6pass', 'pcv_fw_gt6pass', 'pcv_tw'].indexOf($("#id_VehicleSubClass").val()) > -1)) {
        Error++;
        $('.AlertOvl').show();
        $('.alert_container').text("Breakin Not Allowed.").css("text-align", "center");
        $('.ok_btn').click(function () {
            $('.AlertOvl').hide();
        });
    }
    //mg01-02-2022****start
    if ((!$("#lblPolicyExist-No").hasClass("active") && !$("#lblPolicyExist-Yes").hasClass("active")) && $('#VehicleType').val() === "renew") {
        $("#lblPolicyExist-No, #lblPolicyExist-Yes").addClass("btnError");
        Error++;
        $("#ErPolicyExist").show().html("Please Select Existing Policy - Yes/No");
    } else {
        $("#ErPolicyExist").hide().html("");
        $("#lblPolicyExist-No, #lblPolicyExist-Yes").removeClass("btnError");
    }
    var VehicleInsuranceSubtype = $("#VehicleInsuranceSubtype").val();
    if (VehicleInsuranceSubtype == "1OD_0TP") {
        if ($('#TP_PolicyInsurer').val() == "0" || $('#TP_PolicyInsurer').val() == "") {
            Error++;
            $("#ErTP_PolicyInsurer").show().html("Please Select TP Policy Insurer");
        } else {
            $("#ErTP_PolicyInsurer").hide().html("");
        }
    }
    //mg01-02-2022****end
    if ($("#ContactName").val() != "") {
        var _rex = /^[a-zA-Z ]+$/;
        var CName = ($("#ContactName").val()).trim();
        var bool = _rex.test(CName);
        if (bool && $("#ContactName").val().length < 50) {
            var Name = CName.split(" ");
            if (Name[1] == "" || Name[1] == undefined) {
                Error++;
                $("#ErContactName").show().html("Please Enter Full Contact Name");
            } else {
                $("#ErContactName").hide().html("");
            }
        } else {
            Error++;
            $("#ErContactName").show().html("Please Enter Valid Contact Name");
        }
    } else {
        // Error++; $("#ErContactName").show().html("Please Enter Valid Contact Name"); 
    }


    // if ($("#ContactMobile").val() == "") {
    // Error++;
    // $("#ErContactMobile").show().html("Please Enter Mobile No.");
    // }
    /*
     if ((IsTPPolicyExistflag === '') && (($('#TPCompPlan').val()) != '1OD_0TP') && ($('#VehicleType').val() == 'renew')) {
     Error++;
     $("#ErTPPolicyExist").show().html("Please Select Do You Have Active TP Policy? Yes or No.");
     }*/

    if ($("#ContactMobile").val() != "") {

        //if (mobileValid($("#ContactMobile").val()) || ($("#ContactMobile").val().length > 10 && $("#ContactMobile").val().length < 10)) {
        if (mobileValid($("#ContactMobile").val()) && $("#ContactMobile").val().length == 10) {
            $("#ErContactMobile").hide().html("");
        } else {
            Error++;
            $("#ErContactMobile").show().html("Please Enter Valid Mobile No.");
        }
    }

    console.log(Error);
    if (Error == 0) {
        SmartQuoteCalculate();
    }
});


function GetDataFromSIDCRN() {
    var str1 = {
        "search_reference_number": SRN,
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9"
    };
    //var mainUrl = GetUrl() + "/quote/premium_summary";								//local
    var obj_horizon_data = Horizon_Method_Convert("/quote/premium_summary", str1, "POST");		//UAT

    $.ajax({
        type: "POST",
        data: siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(str1),
        url: siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/premium_summary",

        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (response) {

            $('#QuoteLoader').hide();
            $("#register_vehicle").hide()
            $("#dont_remember").show();
            console.log(response);
            var vehicle = response.Master.Vehicle;
            var RTO = response.Master.Rto;
            var request = response.Request;
            var Summary = response.Summary;
            var CRN = request.crn;

            ss_id = request["ss_id"];
            fba_id = request["fba_id"];
            ip_address = request["ip_address"];
            app_version = request["app_version"];
            mac_address = request["mac_address"];
            mobile_no = request["mobile"];


            $("#CustomerReferenceID").val(CRN);
            console.log("CRN:" + request.crn);
            $("#TPCompPlan").show();
            $(".selectbox-highlight").show();


            PreCRN = request.crn;
            PreSRN = Summary.Request_Unique_Id;
            PrevVehicle_id = request.vehicle_id;
            PrevRto_id = request.rto_id;

            if (IsTypeFastLane === true) {
            } else {
                BindModel_rto();
            }

            if (request.registration_no !== "" && request.registration_no !== "MH-01-AA-1234" && request.registration_no !== "MH-01-ZZ-9999") {
                RegNo = request.registration_no.split("-");
                RegNo = RegNo[0] + RegNo[1] + RegNo[2] + RegNo[3];
                $("#RegistrationNo").val(RegNo);
            }

            var RegDate = request.vehicle_registration_date.substring(8, 10) + "-" + request.vehicle_registration_date.substring(5, 7) + "-" + request.vehicle_registration_date.substring(0, 4);
            PrevReg_Date = RegDate;
            console.log("PrevReg_Date:", PrevReg_Date);
            console.log("Type:" + request.vehicle_insurance_type + "\nDateofPurchaseofCar:" + RegDate);

            $('#VehicleType').val(request.vehicle_insurance_type)
            //Added By For T.P. And Comprehensive Starts
            VehicleInsuranceSubtype = request.vehicle_insurance_subtype;
            var VehInsST = VehicleInsuranceSubtype.split('CH_');
            var VehInsSTType = "";


            var VIST = request.vehicle_insurance_subtype.split('CH_');
            if (VIST[0] == "0") {
                is_TP = 'yes';
            } else {
                is_TP = 'no';
            }

            //Claim
            //debugger;

            //Set dropdown policytype
            TP_CompSet(request.vehicle_insurance_type.toUpperCase());
            $("#TPCompPlan").val(VehicleInsuranceSubtype);
            if (request.vehicle_insurance_type == "new") {
                $("#DOPCRenew").hide();
                $("#DOPCNew").show();
                TwoWheelerTypeNew();
                $("#DateofPurchaseofCar, #DOPCNew").val(RegDate);
                if (VehInsST[0] == 0) {
                    VehInsSTType = 'TP';
                    $('.NOTP').hide();
                } else if (VehInsST[0] > 1) {
                    VehInsSTType = 'Comp';
                } else {
                    VehInsSTType = 'CompTP';
                }
            }
            if (request.vehicle_insurance_type == "renew") {

                $("#DOPCRenew").show();
                $("#DOPCNew").hide();
                TwoWheelerTypeRenew();
                $("#DateofPurchaseofCar, #DOPCRenew").val(RegDate);
                if (VehInsST[0] == 0) {
                    VehInsSTType = 'TP';
                    $('.NOTP').hide();
                } else {
                    VehInsSTType = 'Comp';
                }
            }

            //Khushbu Gite 20181010 Set min and max year and month for manufacture date
            if ($('#DateofPurchaseofCar').val() != "") {

                var temp = $('#DateofPurchaseofCar').val().split('-');
                var minManufactureDate = parseInt(temp[1]) + '-' + parseInt(temp[2] - 2);
                var maxManufactureDate = parseInt(temp[1]) + '-' + parseInt(temp[2]);
                $('#ManufactureDate').bootstrapMaterialDatePicker({dateFormat: 'mm-yy'});

                $('#ManufactureDate').bootstrapMaterialDatePicker('setMinDate', minManufactureDate);
                $('#ManufactureDate').bootstrapMaterialDatePicker('setMaxDate', maxManufactureDate);
            }
            //


            //Added By For T.P. And Comprehensive Ends

            $('#MakeModel').addClass('used');
            $('#ManufactureDate').addClass('used');
            $('#DOPCRenew').addClass('used');
            $('#DOPCNew').addClass('used');

            if (vehicle != null && vehicle != "") {
                //Make Model Details
                $("#MakeName").val(vehicle.Make_Name);
                ModelSelected = vehicle.Model_Name;
                $("#Model_Name").val(vehicle.Model_Name);
                $("#MakeModel").val(vehicle.Make_Name + ', ' + vehicle.Model_Name);
                $("#MakeModelID").val(vehicle.Model_ID);


                //Variant
                VariantIDSelected = vehicle.Vehicle_ID;
                $("#VariantID").val(vehicle.Vehicle_ID);

                FuelSelected = vehicle.Fuel_Name;
                if (Product_Name == "Car" || Product_Name == "CV") {
                    // SetTextInsPlan(3);
                    CallFuelOnModelSelect(vehicle.Model_ID);//Fuel

                    //Bifuel
                    if (request.is_external_bifuel == "yes") {
                        IsExternalBifuel = true;
                        BiFuelTypeVal = request.external_bifuel_type;

                        $("#IsBiFuelKit").val(request.is_external_bifuel);
                        $("#BiFuelType").val(request.external_bifuel_type);
                        $("#ValueOfBiFuelKit").val(request.external_bifuel_value);
                        $("#divValueOfBiFuelKit").show();
                    }
                    $("#hdVariantID").val(VariantIDSelected);
                    //CallVariantOnModelNFuelSelect(vehicle.Model_ID, vehicle.Fuel_Name)
                    CallVariantOnModelSelect(vehicle.Model_ID);
                }
                if (Product_Name == "Bike") {
                    SetTextInsPlan(5);
                    CallVariantOnModelSelect(vehicle.Model_ID);
                    $("#TwoWheelerVariantID").val(VariantIDSelected);
                }
            }
            var RegDate = (request.vehicle_manf_date).split("-");
            RegDate = RegDate[2] + "-" + RegDate[1] + "-" + RegDate[0];

            var ManDate = (request.vehicle_manf_date).split("-");
            $('#ManufactureYear').val(ManDate[0]);
            $('#ManufactureMonth').val(ManDate[1]);
            ManDate = ManDate[1] + "-" + ManDate[0];
            $("#ManufactureDate").val(ManDate);

            //Is Policy Exist
            //debugger;
            // if(request.is_breakin == "no"){
            // if(request.vehicle_insurance_type == "renew")	{
            // IsPolicyExistFlag = "yes";
            // $(".PolicyExist").show();
            // $(".PreviousInsurer").show();
            // $("#lblPolicyExist-Yes").removeClass('btn-UnSelected btnError').addClass('btn-primarySelected active');
            // $("#lblPolicyExist-No").removeClass('btn-primarySelected btnError active').addClass('btn-UnSelected');
            // }else{
            // IsPolicyExistFlag = "no";
            // $('.NOTP').hide();
            // }
            // // if(is_TP == "yes"){
            // // $('.NOTP').show();
            // // }
            // }else{
            // //$('.NOTP').hide();
            // //if (is_TP == "no") {
            // //alert("Your Policy will not issue instantly. It will issue after inspection");
            // //}

            // IsPolicyExistFlag = "no";
            // $(".PolicyExist").hide();
            // $("#lblPolicyExist-Yes").removeClass('btn-primarySelected btnError active').addClass('btn-UnSelected');
            // $("#lblPolicyExist-No").removeClass('btn-UnSelected btnError').addClass('btn-primarySelected active');
            // $("#PolicyExpiryDate").val();
            // $("#PreviousInsurer").val();
            // $(".PreviousInsurer").hide();
            // $('.PolicyExpiryDate').hide();
            // $('.NOTP').hide();
            // }

            if (request.is_policy_exist == 'yes') {
                $('#ExistPolicyYes').attr('checked', 'checked');
                $("#lblPolicyExist-Yes").addClass('btn-primarySelected active').removeClass('btn-UnSelected');
                $("#lblPolicyExist-No").addClass('btn-UnSelected').removeClass('btn-primarySelected active');
                IsPolicyExistFlag = "yes";
                $("#PolicyExist").show();
            } else if (request.is_policy_exist == 'no') {
                $('#ExistPolicyNo').attr('checked', 'checked');
                $("#lblPolicyExist-No").addClass('btn-primarySelected active').removeClass('btn-UnSelected');
                $("#lblPolicyExist-Yes").addClass('btn-UnSelected').removeClass('btn-primarySelected active');
                IsPolicyExistFlag = "no";
                $("#PolicyExist").hide();
                $("#PolicyExpiryDate").val();
                $('.PolicyExpiryDate').hide();
                $("#PreviousInsurer").val();
                $(".PreviousInsurer").hide();
                $('.NOTP').hide();
                $("#divNoClaimBonusPercent, .divNoClaimBonusPercent").hide();//mg31
            }

            if (request.is_policy_exist == 'yes') {
                var PolExpDate = (request.policy_expiry_date).split("-")
                PolExpDate = PolExpDate[2] + "-" + PolExpDate[1] + "-" + PolExpDate[0];
                $("#PolicyExpiryDate").val(PolExpDate);
                myfunction1();
            }

            if (request.is_claim_exists == "yes") {
                $("#HaveNCBCertificate").val("No");
                $(".NCBYes").removeClass('btn-UnSelected btnError').addClass('btn-primarySelected active');
                $(".NCBNo").removeClass('active');
                $("#divNoClaimBonusPercent").slideUp();
                //$('.NOTP').hide();
            } else {
                $("#HaveNCBCertificate").val("Yes");
                $(".NCBYes").removeClass('active')
                $(".NCBNo").removeClass('btn-UnSelected btnError').addClass('btn-primarySelected active');
                $("#divNoClaimBonusPercent").slideDown();
                //$(".NOTP").show();

            }
            InsurerPlanType(VehInsSTType);
            if (request.is_policy_exist == 'no') {
                $('.NOTP').hide();
            }
            if (RTO != null && RTO != "") {
                //City
                CityName = "(" + RTO.VehicleCity_RTOCode + ") " + RTO.RTO_City;
                $("#CityofRegitration").val(CityName);
                $('#CityofRegitrationID').val(RTO.VehicleCity_Id);
                $('#CityofRegitration').addClass('used');
                $("#PreviousInsurer").val(request.prev_insurer_id);
                if (IsTypeFastLane === true) {
                    if (OrgRtoFastLane !== '') {
                        $("#CityofRegitration").attr('disabled', true);
                    }
                }
            }

            if (request.is_breakin == 'yes') {
                PEDFlag = "yes";
            } else if (request.is_breakin == 'no') {
                PEDFlag = "no";
            }

            $("#NoClaimBonusPercent").val(request.vehicle_ncb_current);

            /*if (request.is_financed == 'yes' && (Product_id == 1 || Product_id == 10)) {
             IsFinancedFlag = 'Yes';
             $("#div_finance_amount_and_name").show();
             $("#finance_amount").val(request.oslc_si);
             $("#isFinanced-Yes").removeClass('btn-UnSelected btnError').addClass('btn-primarySelected active');
             $("#isFinanced-No").removeClass('btn-primarySelected btnError active').addClass('btn-UnSelected');
             }
             else if (request.is_financed == 'no' && (Product_id == 1 || Product_id == 10)) {
             IsFinancedFlag = 'No';
             $("#div_finance_amount_and_name").hide();
             $("#finance_amount").val('');
             $("#isFinanced-No").removeClass('btn-UnSelected btnError').addClass('btn-primarySelected active');
             $("#isFinanced-Yes").removeClass('btn-primarySelected btnError active').addClass('btn-UnSelected');
             }*/

            //debugger;
            $("#id_VehicleClass").val(request.vehicle_class);
            $("#id_VehicleClass").addClass("used");
            if (request.vehicle_class == "gcv") {
                vehicle_class_code = 24;
            } else if (request.vehicle_class == "pcv") {
                vehicle_class_code = 41;
            } else if (request.vehicle_class == "msc") {
                vehicle_class_code = 35;
            } else {
                vehicle_class_code = 0;
            }

            var sub_vehicle_class_optionhtml = "<option value='0'>Select Vehicle Sub Class</option>";
            $.each(VehicleSubClass, function (key, value) {
                if (value.VehicleClass == request.vehicle_class && value.value == request.vehicle_sub_class) {
                    sub_vehicle_class_optionhtml += "<option selected value='" + value.value + "'>" + value.Text + "</option>";
                }
                if (value.VehicleClass == request.vehicle_class && value.value != request.vehicle_sub_class) {
                    sub_vehicle_class_optionhtml += "<option value='" + value.value + "'>" + value.Text + "</option>";
                }
            });

            $("#id_VehicleSubClass").html(sub_vehicle_class_optionhtml);
            $("#id_VehicleSubClass").addClass("used");
            vehicle_subclass_code = request.vehicle_sub_class;

            var $range1 = $("#range1"),
                    $update1 = $("#txttenure");
            var custom_values = [0, 20, 25, 35, 45, 50];
            var my_from = custom_values.indexOf(parseInt(request.vehicle_ncb_current));
            var my_to = custom_values.indexOf(50);
            $range1.ionRangeSlider({
                type: "single",
                min: 0,
                from: my_from,
                max: 50,
                step: 5,
                grid: true,
                grid_snap: true,
                values: custom_values
            });

            //first Name And Last Name
            var Reg = /^[a-zA-Z ]+$/;
            if (Reg.test(request.first_name) && Reg.test(request.last_name)) {
                $("#ContactName").val(request.first_name + " " + request.last_name);
                $('#ContactName').addClass('used');
            }
            if (request.mobile != 0 && request.mobile != "") {
                $("#ContactMobile").val(request.mobile);
                $('#ContactMobile').addClass('used');
            }
            if (request.email != 0 && request.email != "") {
                if ((request.email).indexOf('testpb.com') > -1) {
                    $("#ContactEmail").val("");
                } else {
                    $("#ContactEmail").val(request.email);
                }
            }
            $('select').click();

            if (request.vehicle_registration_type == "corporate") {
                $("#lblVehRegTypeCom").addClass('btngrpSelected');
                $("#lblVehRegTypeInd").removeClass('btngrpSelected');
                $("#RegisterintheName").val("corporate");
            } else {
                $("#lblVehRegTypeInd").addClass('btngrpSelected');
                $("#lblVehRegTypeCom").removeClass('btngrpSelected');
                $("#RegisterintheName").val("individual");
            }
            //SetInputValue();
            $('#Property').show();
            $('.refresh1').hide();
            $('#InputForm').show();
            $('.quotelist').hide();
            $('#Property').addClass('active in');
            $('#Appl').removeClass('active in');
            $('#Quote1').removeClass('active');
            $('#Input1').addClass('active');
        },
        error: function (response) { }
    });
    $(".quickSection").hide();
    $(".detailSection").show().removeClass('hidden');
}

// Input Page End

function response_handler() {

    insurer_count = 0;
    $('.quoteboxparent').show();
    //$('.quoteboxparent').html("");
    $(".quoteboxparent").empty();

    for (var i = 0; i < quotes.Response.length; i++) {



        if (quotes.Response[i].Error_Code === "") {

            Display_Insurer_Block(quotes.Response[i].Insurer);

            $('.quoteboxparent').append(htmllist);
        } else {
            continue;
        }
        insurer_count++;
        var current_div = $('#divQuitList' + quotes.Response[i].Insurer.Insurer_ID);
        var quote = current_div.html();
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
                    } else {
                        var keytoreplace = '___' + index + '_' + index1 + '___';
                        update_quote_object[keytoreplace] = value1;
                    }
                });
            } else {
                var keytoreplace = '___' + index + '___';
                update_quote_object[keytoreplace] = value;
            }
        });
        update_quote_object['___fair_price___'] = (update_quote_object['___Premium_Breakup_final_premium___'] * 100 / update_quote_object['___LM_Custom_Request_vehicle_expected_idv___']).toFixed(2);
        update_quote_object['___prefInsurer___'] = arr_preference !== undefined ? arr_preference.indexOf(quotes.Response[i].Insurer.Insurer_ID) : "";
        //replace place holder
        console.log(update_quote_object);
        $.each(update_quote_object, function (index, value) {
            if (index.indexOf('Premium_Breakup') > -1 || index.indexOf('_idv') > -1) {
                value = rupee_format(Math.round(value - 0));
            }
            if (value != null) { //if (value != null && typeof quote !== 'undefined') {//
                var regex = new RegExp(index, "gi");
                quote = quote.replace(regex, value);
            }
        });
        current_div.empty();
        current_div.append(quote);

        $('.insurer_ctn').html(insurer_count);

        current_div.attr('premium', quotes.Response[i].Premium_Breakup.final_premium);
        current_div.attr('idv', quotes.Response[i].LM_Custom_Request.vehicle_expected_idv);
        current_div.attr('total_addon', quotes.Response[i].Addon_List.length);
        current_div.attr('fair_price', update_quote_object['___fair_price___']);
        current_div.attr('pref', update_quote_object['___prefInsurer___']);

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
        //$("#LoaderImg").fadeOut('slow');
    }
    console.log("Insurer Count : ", insurer_count);

    if (quotes.Summary.Request_Core.vehicle_registration_type == "corporate") {
        $(".PACOD").hide();
        $("#ODPAC").val(0);
        $("#OwnerDriverPersonalAccidentCover").val("No");
		$("#CPATenure_Car").hide();
		$("#CPATenure_TW").hide();
		$(".CPATenure").hide();
    }

    if (quotes.Summary.Request_Core.vehicle_registration_type == "individual") {
        $(".PACOD").show();
        $("#ODPAC").val(1500000);
        $("#OwnerDriverPersonalAccidentCover").val("Yes");
		
		if(quotes.Summary.Request_Core.vehicle_insurance_type == "new"){
			if(quotes.Summary.Request_Core.product_id == 1){
				$("#CPATenure_Car").show();
				$("#CPATenure_TW").hide();
				$(".CPATenure").show();
			}
			if(quotes.Summary.Request_Core.product_id == 10){
				$("#CPATenure_Car").hide();
				$("#CPATenure_TW").show();
				$(".CPATenure").show();
			}
			if(quotes.Summary.Request_Core.product_id == 12){
				$("#CPATenure_Car").hide();
				$("#CPATenure_TW").hide();
				$(".CPATenure").hide();
			}
		} else{
			$("#CPATenure_Car").hide();
			$("#CPATenure_TW").hide();
			$(".CPATenure").hide();
		}
    }

    //Adding Insurer Id To List
    if (quotes.Response.length > 0) {
        InsList = [];
        $.each(quotes.Response, function (index, value) {
            if (value.Error_Code == "") {

                var InsID = value.Insurer.Insurer_ID;
                InsList.push(InsID);
                var InsID = value.Insurer.Insurer_ID;

                if (($("#TPCompPlan").val() == "0CH_1TP" || $("#TPCompPlan").val() == "0CH_3TP") && Product_id == 1) {
                    $("#divLoanWaiver").hide();
                    $(".divOutstandingLoanCoverAmount").hide();
                }

                if (($("#TPCompPlan").val() == "1CH_0TP" || $("#TPCompPlan").val() == "1OD_0TP" || $("#TPCompPlan").val() == "1CH_2TP" || $("#TPCompPlan").val() == "3CH_0TP") && Product_id == 1 && InsID == 2) {
                    $("#divLoanWaiver").show();
                    $(".divOutstandingLoanCoverAmount").show();
                }

                if (($("#TPCompPlan").val() == "0CH_1TP" || $("#TPCompPlan").val() == "0CH_5TP") && Product_id == 10) {
                    $("#divLoanWaiver").hide();
                    $(".divOutstandingLoanCoverAmount").hide();
                }

                if (($("#TPCompPlan").val() == "1CH_4TP" || $("#TPCompPlan").val() == "5CH_0TP" || $("#TPCompPlan").val() == "1CH_0TP" || $("#TPCompPlan").val() == "2CH_0TP" || $("#TPCompPlan").val() == "3CH_0TP" || $("#TPCompPlan").val() == "1OD_0TP") && Product_id == 10 && InsID == 2) {
                    $("#divLoanWaiver").hide();
                    $(".divOutstandingLoanCoverAmount").hide();
                }
            }
        })
    }

    if (VehInsSubType != null) {
        var VIST = VehInsSubType.split('CH_');
        if (VIST[0] == "0") { // if (VehInsSubType.indexOf('0CH') > -1) { //
            $("#IDVSection").text("Not Applicable");
            $(".IDVRange").html("");
            $(".IDVDisplay").html("NA");
            //$("#divClaimYesNo, .divAccessories, .divAddon, .divIDV, .divDiscount, #liidvedit, #lidiscountedit").hide();
            $("#divClaimYesNo, .divAccessories, #liidvedit, #lidiscountedit").hide();
            $(".divAddon, .divIDV, .divDiscount").addClass('hidden');
            $("#CovMore").removeClass('col-xs-5').addClass('col-xs-6');
            $("#Errmsg , #shareqt").removeClass('col-xs-2').addClass('col-xs-3');


            $("#liidvedit").attr('data-target', false);
            $("#lidiscountedit").attr('data-target', false);
            $("#TotalODPremium").text("N.A.");

            if (Product_id == 12) {
                $(".divAddon").addClass('hidden');
                $(".CVCovers").hide();
                $(".GCVCovers").show();
                $(".class_gcv_imt23").hide();
                $(".class_gcv_OtherUse").hide();
                $(".class_gcv_PersonalAccidentCoverForEmployee").show();
                $(".class_gcv_Coolie_Ll").hide();
                $(".PCVCovers").hide();
            }
        } else {
            $("#divClaimYesNo, .divAccessories, #liidvedit, #lidiscountedit").show();
            $(".additional-info").show();
            $(".divAddon, .divIDV, .divDiscount, .divCover").removeClass('hidden');

            if (Product_id == 12) {
                $(".divAddon").addClass('hidden');
                $(".CVCovers").show();
                if (quotes.Summary.Request_Core.vehicle_class == "gcv") {
                    $(".GCVCovers").show();
                    $(".class_gcv_imt23").show();
                    $(".class_gcv_OtherUse").show();
                    $(".class_gcv_PersonalAccidentCoverForEmployee").show();
                    $(".class_gcv_Coolie_Ll").show();
                    $(".PCVCovers").hide();
                }
                if (quotes.Summary.Request_Core.vehicle_class == "pcv") {
                    $(".PCVCovers").show();
                    $(".GCVCovers").hide();
                }
            }
        }
    }

    if (insurer_count > 0) {
        //Addon filter
        Global_addon_list = quotes.Summary.Common_Addon;
        var common_addon_list = quotes.Summary.Common_Addon;
        VehInsSubType = quotes.Summary.Request_Core.vehicle_insurance_subtype;
        VehicleClass = quotes.Summary.Request_Core.vehicle_class;


        $('.insurance-cover').empty();

        if (Object.keys(quotes.Summary.Common_Addon).length > 0) { // Checking Whether Addons Present Or Not (with Count)
            var AddOnCount = 0;
            $('.PremCompareAddonsIns').html("");
            AddonSection = "";
            $("#AddonSection").html("");
            $("#Standaloneedit").html("");
            //populate common addon
            $.each(common_addon_list, function (index, value) {
                IsAddonPresent = true;
                addon = html_addon;
                addon = addon.replace(new RegExp('___Common_Addon___', 'gi'), index);
                //addon = addon.replace('___Common_Addon_Name___', addon_list[index]);//12-02-2018
                addon = addon.replace('___Common_Addon_Name___', addon_list[index] + '(' + addon_shortlist[index] + ')');
                if (value.min == value.max) {
                    addon = addon.replace('___addon_range___', 'Upto &#8377; ' + Math.round(value.min));
                } else {
                    addon = addon.replace('___addon_range___', '&#8377; ' + Math.round(value.min) + ' - &#8377; ' + Math.round(value.max));
                }
                $(".chkAddons").show();
                $('.insurance-cover').append(addon);
                AddOnCount++;
                if (AddOnCount < 2) {
                    $("#selectall").hide();
                } else {
                    $("#selectall").show();
                    $(".chkAddons").show();
                }


            });
            AddonSection = $("#AddonSection").html();
            html_PremCompareAddonsIns = $('.PremCompareAddonsIns').html();
            $('.insurance-cover').removeClass('hidden');
        } else {
            $(".chkAddons").hide();
            IsAddonPresent = false;
            $("#Standaloneedit").html('<div style="margin: 10px;text-align: center;">No Addons Available</div>');
        }

        // check uncheck based on previous search //Object.keys(quotes.Summary.Addon_Request).length > 0
        if (quotes.Summary.hasOwnProperty("Addon_Request") && quotes.Summary.Addon_Request != null && (Object.keys(quotes.Summary.Addon_Request).length > 0)) {
            if (Object.keys(quotes.Summary.Common_Addon).length <= 0) {
                $('.insurance-cover').html("No Addons Available").css("text-align", "center");
            }

            // check uncheck based on previous search For Bundle And Standalone addons
            if (quotes.Summary.Addon_Request.hasOwnProperty("addon_standalone")) {
                if (Object.keys(quotes.Summary.Addon_Request.addon_standalone).length > 0) {
                    $.each(quotes.Summary.Addon_Request.addon_standalone, function (index, value) {
                        if (value == "yes") {
                            $('#' + index).click();
                        }
                    });
                }
            } else { // check uncheck based on previous search For Only Standalone addons
                if (Object.keys(quotes.Summary.Addon_Request).length > 0) {
                    $.each(quotes.Summary.Addon_Request, function (index, value) {
                        if (value == "yes") {
                            $('#' + index).click();
                        }
                    });
                }
            }
        }
        handle_addon_addition();

        /*Prefered Insurer sorting 21102020*/
        /*var divQts = $('.quoteboxmain').pbsort(false, "pref");
         $('.quoteboxparent').html(divQts);*/
        /*Prefered Insurer sorting 21102020 END*/

        /*Prefered Insurer sorting 20052021*/
        var divQts = $('.quoteboxmain').pbsort(true, "premium");
        $('.quoteboxparent').html(divQts);
        /*Prefered Insurer sorting 21102020 END*/

        //var divQts = $('.quoteboxmain').pbsort(true, "Premium");
        //$('.quoteboxparent').html(divQts);
        //set odometer values
        $('.insurer_count').text("");
        $('.insurer_count').text(insurer_count);
        $('.idv_min').html(quotes.Summary.Idv_Min == null ? 0 : quotes.Summary.Idv_Min);
        $('.idv_max').html(quotes.Summary.Idv_Max == null ? 0 : quotes.Summary.Idv_Max);

        SetValues();
        if (CoverCount == 1) {
            $(".trCover").removeClass('hidden');
        } else {
            $(".trCover").addClass('hidden');
        }
        if (DiscountCount == 1) {
            $(".trDiscount").removeClass('hidden');
        } else {
            $(".trDiscount").addClass('hidden');
        }
    } else {
        $(".chkAddons").hide();
        IsAddonPresent = false;
        $("#Standaloneedit").html('<div style="margin: 10px;text-align: center;">No Addons Available</div>');
    }
    $('.quoteboxparent').children(".hidden").remove();
}

function SetValues() {
    $('.SpnCD').each(function () {
        if ($(this).text() == 0) {
            $(this).parent().empty().remove();
        }//$(this).parent().addClass('hidden'); }
    });
}
function Get_Search_Summary() {

    var str1 = {
        "search_reference_number": SRN,
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9"
    };
    //var mainUrl = GetUrl() + "/quote/premium_summary";										//local
    var obj_horizon_data = Horizon_Method_Convert("/quote/premium_summary", str1, "POST");		//UAT

    $.ajax({
        type: "POST",
        data: siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(str1),
        url: siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/premium_summary",

        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (response) {
            console.log('Summary')
            console.log(response);
            var vehicle = response.Master.Vehicle;
            var request = response.Request;
            var rto = response.Master.Rto;
            var reqistration_no = "";

            if (request.registration_no.includes("AA-1234") || request.registration_no.includes("ZZ-9999")) {
                reqistration_no = request.registration_no.substring(0, 5)
            } else {
                reqistration_no = request.registration_no
            }


            if (vehicle != "" && vehicle != null) {
                $('.Variant').text(vehicle.Make_Name + " " + vehicle.Model_Name + " " + vehicle.Variant_Name);
                $("#FuelNameDetails").text(vehicle.Fuel_Name);
                $('#VariantDetails').text(vehicle.Variant_Name);
                if (Product_id == 1 || Product_id == 10) {
                    $('#VehicleDetails').text(vehicle.Fuel_Name + ' | ' + vehicle.Cubic_Capacity + ' CC | ' + reqistration_no);
                }
                if (Product_id == 12) {
                    $('#VehicleDetails').text(vehicle.Fuel_Name + ' | ' + reqistration_no);
                }

            }

            if (request.external_bifuel_type == "cng") {
                $("#FuelNameDetails").text(vehicle.Fuel_Name + "(" + "EXTERNAL FITTED CNG" + ")");
            }
            if (request.external_bifuel_type == "lpg") {
                $("#FuelNameDetails").text(vehicle.Fuel_Name + "(" + "EXTERNAL FITTED LPG" + ")");
            }

            if (request.vehicle_insurance_type == "new") {
                $("#RegistrationTypeDetails").text("New");
            } else {
                $("#RegistrationTypeDetails").text("Renew");
            }
            //For TP Plan Implementation
            VehInsSubType = request.vehicle_insurance_subtype;
            $("#VehicleInsuranceSubtype1").val(VehInsSubType);
            console.log("VehInsSubType: ", VehInsSubType);

            $('#expected_idv').attr("value", request.vehicle_expected_idv);
            $('#expected_idv').prev().text(request.vehicle_expected_idv);
            $('#expected_idv').prev().val(request.vehicle_expected_idv);
            $('#ExpectedIDV').val(request.vehicle_expected_idv);
            if (request.vehicle_expected_idv != undefined) {
                $('#ExpectedIDVVal').text("(" + request.vehicle_expected_idv + ")");
            }


            if (request.is_tppd != undefined) {

                if (request.is_tppd == "yes") {
                    $("#IsTPPD").val("yes").text("Yes");
                    $("#IsTPPD2").addClass('active');
                    $("#IsTPPD1").removeClass('active');
                } else if (request.is_tppd == "no") {
                    $("#IsTPPD").val("no").text("No");
                    $("#IsTPPD1").addClass('active');
                    $("#IsTPPD2").removeClass('active');
                }
            }
            console.log("-------------Type: " + request.vehicle_insurance_type + " Product ID: " + request.product_id + "-------------");
            if (request.vehicle_insurance_type == "renew") {

                $("#ZeroDepMsg").show();
            }


            //Outstanding Loan cover
            /*if (request.is_oslc == "yes") {
             CheckLoanWaiver('Yes');
             $("#OutstandingLoanCoverAmount").val(request.oslc_si);
             $("#OutstandingLoanCoverAmount").addClass('used');
             }
             else {
             CheckLoanWaiver('No');
             $(".divOutstandingLoanCoverAmount").hide();
             $("#OutstandingLoanCoverAmount").val(0);
             }*/
            if (request.od_disc_perc) {
                if (request.od_disc_perc == 0) {
                    $("#ODDiscount").val(0);
                    $("#ODDiscountPercent").val(0);
                } else {
                    $("#ODDiscount").val(request.od_disc_perc);
                    $("#ODDiscountPercent").val(request.od_disc_perc);
                }
            } else {
                $("#ODDiscount").val(0);
                $("#ODDiscountPercent").val(0);
            }

            //Cover
            // DC condition 
            if (request.channel == "DC") {
                $('.PACOD').show();
            }



            //Elec and non electrical_accessory
            $('#ElectricalAccessories').val(request.electrical_accessory).addClass("used");
            $('#NonElectricalAccessories').val(request.non_electrical_accessory).addClass("used");

            //PersonalAccidentCoverforDriver //Legal Liability to Paid Driver
            if (request.is_llpd == "no") {
                $("#PersonalAccidentCoverforDriver").text("No").val("No");
                $("#PD2").addClass('active');
                $("#PD1").removeClass('active');
            }
            if (request.is_llpd == "yes") {
                $("#PersonalAccidentCoverforDriver").text("Yes").val("Yes");
                $("#PD1").addClass('active');
                $("#PD2").removeClass('active');
            }

            //PaidDriverPersonalAccidentCover
            if (request.pa_paid_driver_si == "0") {
                $("#PaidDriverPersonalAccidentCover").text("No").val("No");
                $("#PDPersonal2").addClass('active');
                $("#PDPersonal1").removeClass('active');
            }
            if (request.pa_paid_driver_si == "100000") {
                $("#PaidDriverPersonalAccidentCover").text("Yes").val("Yes");
                $("#PDPersonal1").addClass('active');
                $("#PDPersonal2").removeClass('active');
            }

            // IsAntiTheftDevice
            if (request.is_antitheft_fit == "no") {
                $("#IsAntiTheftDevice").text("No").val("No");
                $("#ATN").addClass('active');
                $("#ATY").removeClass('active');
            }
            if (request.is_antitheft_fit == "yes") {
                $("#IsAntiTheftDevice").text("Yes").val("Yes");
                $("#ATY").addClass('active');
                $("#ATN").removeClass('active');
            }

            //MemberofAA
            if (request.is_aai_member == "no") {
                $("#MemberofAA").text("No").val("No");
                $("#Association2").addClass('active');
                $("#Association1").removeClass('active');
            }
            if (request.is_aai_member == "yes") {
                $("#MemberofAA").text("Yes").val("Yes");
                $("#Association1").addClass('active');
                $("#Association2").removeClass('active');
            }

            $('#PersonalCoverPassenger').val(request.pa_unnamed_passenger_si > 0 ? request.pa_unnamed_passenger_si : 0);


            //Popup Details

            if (request.registration_no != "") {
                var RegNo = request.registration_no.replace(new RegExp('-', 'gi'), "");
                $("#RegistrationNo").text(RegNo);

                if ((RegNo.indexOf("AA1234") > -1) || (RegNo.indexOf("ZZ9999") > -1)) {
                    $("#RegistrationNo").text(RTOCode);
                    $("#divRegistrationNoDetails").hide();
                } else {
                    $("#divRegistrationNoDetails").show();
                    $("#RegistrationNoDetails").text(RegNo);
                }
            }
            if (vehicle != "" && vehicle != null) {
                map_vehicle_id = vehicle.Vehicle_ID;
                $("#VehicleNameDetails").text(vehicle.Description + " (" + vehicle.Vehicle_ID + ")");
                $("#FuelNameDetails").text(vehicle.Fuel_Name);
                if (request.external_bifuel_type == "cng") {
                    $("#FuelNameDetails").text(vehicle.Fuel_Name + "(" + "EXTERNAL FITTED CNG" + ")");
                }
                if (request.external_bifuel_type == "lpg") {
                    $("#FuelNameDetails").text(vehicle.Fuel_Name + "(" + "EXTERNAL FITTED LPG" + ")");
                }
            }

            if (request.external_bifuel_value > 0) {
                $("#ExternalBifuelVal").html(request.external_bifuel_value);
            } else {
                $("#divExternalBifuelVal").hide();
            }

            if (rto != "" && rto != null) {
                $("#RTODetails").text(rto.RTO_City + ", " + rto.State_Name + " (" + response.Master.Rto.VehicleCity_Id + ")");
            }
            var Name = "";
            if (request.first_name != "" && checkTextWithSpace(request.first_name)) {
                Name = request.first_name + " ";
                if (request.middle_name != "" && checkTextWithSpace(request.middle_name)) {
                    Name = Name + request.middle_name + " ";
                }
                if (request.last_name != "" && checkTextWithSpace(request.last_name)) {
                    Name = Name + request.last_name;
                }
            } else {
                $("#divNameDetails").hide();
            }
            $("#NameDetails").text(Name);
            if (request.mobile != "" && request.mobile != null) {
                $("#MobileDetails").text(request.mobile);
                if (request.mobile == "9999999999") {
                    $("#MobileDetails").text("NA");
                }
            } else {
                $("#divMobileDetails").hide();
            }
            if (request.email != "" && request.email != null) {
                $("#EmailDetails").text(request.email);
                if ((request.email).indexOf('@testpb.com') > 1) {
                    $("#EmailDetails").text("NA");
                }
            } else {
                $("#divEmailDetails").hide();
            }

            if (request.vehicle_insurance_type == "new") {
                $("#RegistrationTypeDetails").text("New");
            } else {
                $("#RegistrationTypeDetails").text("Renew");
            }

            //For TP Plan Implementation
            VehInsSubType = request.vehicle_insurance_subtype;
            $("#VehicleInsuranceSubtype").val(VehInsSubType);
            console.log("VehInsSubType: ", VehInsSubType);

            $("#RegistrationSubTypeDetails").html(ShowVehInsSubType(VehInsSubType));

            if (request.vehicle_registration_date != "" || request.vehicle_registration_date != null) {
                $("#RegistrationDate").html(request.vehicle_registration_date);
            } else {
                $("#divRegistrationDate").hide();
            }

            if (request.vehicle_manf_date != "" || request.vehicle_manf_date != null) {
                $("#ManufactureDateval").html(request.vehicle_manf_date);
            } else {
                $("#divManufactureDateval").hide();
            }

            if (request.policy_expiry_date != "" && request.policy_expiry_date != null) {
                $("#PolicyExpiryDateval").html(request.policy_expiry_date);
            } else {
                $("#divPolicyExpiryDateval").hide();
            }

            if ((request.vehicle_ncb_current != "" || request.vehicle_ncb_current != null) && request.vehicle_ncb_current != 0) {
                $("#PrevNCB").html(request.vehicle_ncb_current + "%");
            } else {
                $("#divPrevNCB").hide();
            }

            if (request.is_claim_exists != "no") {
                $("#ClaimYesNo").html("Yes");
                $("#divPrevNCB").hide();
            }
            if (request.is_claim_exists != "yes") {
                $("#ClaimYesNo").html("No");
                $("#divPrevNCB").show();
            }

            if (request.vehicle_registration_type == "corporate") {
                $("#VehicleInsType").html("Company");
            } else {
                $("#VehicleInsType").html("Individual");
            }

            var PrevInsName = GetPrevIns(request.prev_insurer_id);
            if (request.prev_insurer_id != "" && request.prev_insurer_id != null) {
                $("#PrevInsurer").html(PrevInsName);
            } else {
                $("#divPrevInsurer").hide();
            }

            $('#PospAgentName').text(request.posp_first_name + ' ' + request.posp_last_name + ' ( Mob. :  ' + request.posp_mobile_no + ', SS_ID : ' + request.posp_ss_id + ', FBA_ID : ' + request.posp_fba_id + ', City  : ' + request.posp_agent_city + ')');
            $('#PospAgentCity').text(request.posp_agent_city);
            var reportingMobile = request.posp_reporting_mobile_number != null ? request.posp_reporting_mobile_number : "";
            $('#ReportingAgentName').text(request.posp_reporting_agent_name + ' ( UID : ' + request.posp_reporting_agent_uid + ', Mob. : ' + reportingMobile + ' )');
            var client_key_val;
            if (request['product_id'] == 1 || request['product_id'] == 10) {
                if (request.hasOwnProperty('ss_id') && (request['ss_id'] - 0) > 0) {
                    var posp_sources = request['posp_sources'] - 0;
                    var ss_id = (request['ss_id'] - 0);
                    if (posp_sources == 1) {
                        if (request.hasOwnProperty('posp_erp_id') && (request['posp_erp_id'] - 0) > 0) { //posp_erp_id
                            client_key_val = 'DC-POSP';
                            if ([8279, 6328, 9627, 6425].indexOf(ss_id) > -1) {
                                client_key_val = 'FINPEACE';
                            }
                        } else if (ss_id !== 5) {
                            client_key_val = 'DC-NON-POSP';
                        } else if (ss_id === 5) {
                            client_key_val = 'DC-FBA';
                        }


                    } else if (posp_sources == 2) {
                        if (request.hasOwnProperty('posp_erp_id') && (request['posp_erp_id'] - 0) > 0) { //posp_erp_id
                            client_key_val = 'SM-POSP';
                        } else if (ss_id === 5) {
                            client_key_val = 'SM-FBA';
                        } else {
                            client_key_val = 'SM-NON-POSP';
                        }
                    } else {
                        if (request['posp_category'] == 'FOS') {
                            client_key_val = 'SM-FOS';
                        } else if (request['posp_category'] == 'RBS') {
                            client_key_val = 'RBS';
                        } else {
                            client_key_val = 'PB-SS';
                        }
                    }

                }
            }
            $('#POSPType').text(client_key_val);


            //End



            var Hrefval = "";
            Hrefval = "/Finmart/TW_Web/tw-main-page.html?SRN=" + response.Summary.Request_Unique_Id + "&ClientID=" + response.Summary.Client_Id + "&Edit=modify";

            $("#EditInfo").attr("href", Hrefval);

        }, error: function (result) {

        }
    });
}

function OnEdit() {

    $('#InputForm').show();
    $('.basicDetails').hide();
    $('.footerDiv').show();
    GetDataFromSIDCRN();
    $(".warningmsg").hide();
    //window.location.href = "Finmart/TW_Web/"+$("#EditInfo").attr("href");
    // window.location.href = $("#EditInfo").attr("href");

}

function Display_Insurer_Block(insurer) {

    var block = htmllist;
    block = block.replace("hidden", "");
    $.each(insurer, function (index1, value1) {
        var regex = new RegExp("___" + index1 + "___", "gi");
        block = block.replace(regex, value1);
    });
    //block = block.replace("___client_id___", clientid);
    $(".quoteboxparent").append(block);
}




$('#datepicker1').on('click', function () {
    $(this).siblings('div.clearer').show();

    $(this).siblings('span').addClass('active');

    $(this).data('holdDate', $(this).val());

})
        .on('dp.show', function () {

            $(this).val($(this).data('holdDate'));
            //useCurrent:true;
            //viewDate: true;
            //$('.bootstrap-datetimepicker-widget .datepicker-days td.active').trigger('click');
        });
$('.DateofPurchaseofCar').on('change', function (e, date) {
    //debugger
    $("#DateofPurchaseofCar").addClass('used');
    $("#ManufactureDate").addClass('used');
    $("#DateofPurchaseofCar").val($(this).val());
});
$('#DOPCRenew').bootstrapMaterialDatePicker({

    time: false,
    clearButton: true,
    format: 'DD-MM-YYYY',
    minDate: moment().subtract(25, 'years'), // 25 Years Before The Current Day // moment().subtract(25, 'y'),
    maxDate: moment().subtract(6, 'months'), // 6 Months Before The Current Day
    currentDate: moment().subtract(12, 'months'), // 1 Year Before The Current Day
    onSelect: function () {

        myfunction();
    }
});
$('.Datepicker').on('change', function (e, date) {


    var thisId = $(this).attr('id');
    var ErthisId = $("#Er" + thisId);
    switch (thisId) {
        case "DOPCNew":
            ErrMsg = "Please Select Registration/Invoice Date.";
            $(".dtp-picker, .dtp-actual-num").removeClass('hidden');
            break;
        case "DOPCRenew":
            ErrMsg = "Please Select Registration/Invoice Date.";
            $(".dtp-picker, .dtp-actual-num").removeClass('hidden');
            break;
        case "ManufactureDate":
            ErrMsg = "Please Select Year - Month Of Registration.";
            $(".dtp-picker, .dtp-actual-num").addClass('hidden');
            SetManuDate();
            break;
        case "PolicyExpiryDate":
            ErrMsg = "Please Select Policy Expiry Date.";
            $(".dtp-picker, .dtp-actual-num").removeClass('hidden');
            break;
    }
    if ($(this).val() != "") {
        ErthisId.html("").hide();
    } else {
        $("#Er" + thisId).show().html(ErrMsg);
    }
});
$('.Datepicker').on('focus', function (e, date) {
    var thisId = $(this).attr('id');
    switch (thisId) {
        case "DOPCNew":
        case "DOPCRenew":
            $(".dtp-picker, .dtp-actual-num").removeClass('hidden');
            break;
        case "ManufactureDate":
            $(".dtp-picker, .dtp-actual-num").addClass('hidden');
            break;
        case "PolicyExpiryDate":
            $(".dtp-picker, .dtp-actual-num").removeClass('hidden');
            break;
    }
});

$(function () {
    $('#datepicker1,#datepicker2,#datepicker3,#datepicker4').datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'dd-mm-yy',
        yearRange: 'c-82:c',

        onSelect: function (date) {
            if ($("#datepicker1").val() != "") {
                $("#datepicker1").next().next().next().css("background", "rgb(0, 158, 227)");
            } else {
                $("#datepicker1").next().next().next().css("background", "#ccc");
            }


            // var reg_date=$("#datepicker").val()	;
            // var year =reg_date.split('-')[2];
            // var year=[];
            // for (i=year;i<=parseInt(year)-1 ;i--){
            // 
            // year.push(i);
            // }
            // var months=['January', 'Febraury', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            // for (i = 0; i < months.length; i++)
            // {
            // $('#MFG_MONTH').append( '<option value="'+parseInt(i+1)+'">'+months[i]+'</option>' );
            // }

        }

    });

});

var todayDate = moment();
$('#ManufactureDate').bootstrapMaterialDatePicker({

    time: false,
    clearButton: true,
    format: 'MM-YYYY',
    minDate: moment().subtract(15, 'years'), // 15 Years Before The Current Day
    maxDate: moment(), // Current day
    //minDate: new Date((new Date()).getFullYear() - 15, (new Date()).getMonth(), 1),
    //maxDate: new Date(),
    //startView: 1,
    viewMode: 'years',
});
function myfunction() {

    if ($('#DateofPurchaseofCar').val() == "") {
    } else {
        //
        var temp = $('#DateofPurchaseofCar').val().split('-');

        var minManufactureDate = parseInt(temp[1]) + '-' + parseInt(temp[2] - 2);
        var maxManufactureDate = parseInt(temp[1]) + '-' + parseInt(temp[2]);

        $('#ManufactureYear').val(parseInt(temp[2]));
        $("#ManufactureMonth").val(parseInt(temp[1]));
        queryDate = parseInt(temp[1]) + '-' + parseInt(temp[2]);
        $('#ManufactureDate').bootstrapMaterialDatePicker({
            dateFormat: 'mm-yy'
        });
        //$('#ManufactureDate').val('');
        //Khushbu Gite 20181005 Set min and max year and month for manufacture date
        $('#ManufactureDate').bootstrapMaterialDatePicker('setMinDate', minManufactureDate);
        $('#ManufactureDate').bootstrapMaterialDatePicker('setMaxDate', maxManufactureDate);
        $('#ManufactureDate').bootstrapMaterialDatePicker('setDate', queryDate);
        $('#ManufactureDate').parent().removeClass('is-empty');
        $('#ErManufactureDate').hide().html("");
    }

}
function myfunction1() {
    if ($('#PolicyExpiryDate').val() == "") {
        $('#PolicyExpiryDate').addClass('errorCheckBox');
        $('#PolicyExpiryDate').removeClass('SuccessClass');
    } else {
        $("#ErPolicyExpiryDate").hide();
        var arr = $("#PolicyExpiryDate").val().split('-');
        var Days = (((new Date(Date.now())).getTime()) - ((new Date(arr[1] + "-" + arr[0] + "-" + arr[2])).getTime())) / (1000 * 60 * 60 * 24);

        // if (Product_Name == "Bike") {
        if (Math.floor(Days) > 90) {
            PEDFlag = true;
            $("#divNoClaimBonusPercent, .divNoClaimBonusPercent").hide();
            $('#HaveNCBCertificate').val("No");
            $("#NoClaimBonusPercent").val("0");
        } else {
            PEDFlag = false;
            if (is_TP == "no") {
                $("#divNoClaimBonusPercent, .divNoClaimBonusPercent").show();
            }
        }
        // }
        var VIST = VehicleInsuranceSubtype.split('CH_');
        if (VIST[0] == '0') {
            $("#divNoClaimBonusPercent, .divNoClaimBonusPercent").hide();
        }
        $('#PolicyExpiryDate').addClass('SuccessClass');
        $('#PolicyExpiryDate').removeClass('errorCheckBox');
        $('#PreviousInsurer').trigger('click');
        $('#PolicyExpiryDate').addClass('used');
        //$('#PreviousInsurer option').toggle();
        if (Math.floor(Days) > 0 && is_TP == "no" && (Product_id == 1 || Product_id == 12)) {//mg22-04-2022
            $('.AlertOvl').show();
            $('.alert_container').text("Your Policy will not issue instantly. It will issue after inspection.");
            $('.ok_btn').click(function () {
                $('.AlertOvl').hide();
            });
        }
    }
}
$("#TPCompPlan").change(function () {

    var type = $('option:selected', $(this)).val();
    $('#VehicleInsuranceSubtype').val(type);
    var VIST = type.split('CH_');


    // if (twowheelerType == "NEW" && VIST[0] == 0) {
    // is_TP = "yes";
    // $('.NOTP').hide();
    // $('#HaveNCBCertificate').val('');
    // }
    // else if (twowheelerType == "RENEW" && VIST[0] == 0) {
    // is_TP = "yes";
    // $('.NOTP').hide();
    // }
    if (VIST[0] == 0) {
        is_TP = "yes";
        $('.NOTP').hide();
        $('#HaveNCBCertificate').val('No');
        $('#txttenure').val("0")
    } else {
        is_TP = "no";
        if (twowheelerType != "NEW") {
            $(".NOTP").show();
        }
    }
    /*
     if ($("#TPCompPlan").val() == "1OD_0TP" && Product_id == 10) {
     $('#1OD_0TP_NOTE_ALERT').modal('show');
     $('#id_existing_policy_label').text("DO YOU HAVE EXISTING COMPREHENSIVE POLICY");
     } else {
     $('#id_existing_policy_label').text("DO YOU HAVE EXISTING POLICY");
     }
     
     
     if (($("#TPCompPlan").val() == "1CH_0TP" || $("#TPCompPlan").val() == "2CH_0TP" || $("#TPCompPlan").val() == "3CH_0TP") && (Product_id == 10)) {
     $('#id_existing_policy_label').text("DO YOU HAVE EXISTING COMPREHENSIVE POLICY");
     }
     
     if ( ($("#TPCompPlan").val() == "1CH_0TP" || $("#TPCompPlan").val() == "1OD_0TP")&& Product_id == 1) {
     $('#id_existing_policy_label').text('Do You Have Existing Comprehensive Policy (Select "NO" if ownership transfer) ');
     }else{
     $('#id_existing_policy_label').text('ANY OUTSTANDING LOAN?');		
     }
     */
    //mg31******Start
    if (($("#TPCompPlan").val() == "1CH_0TP" || $("#TPCompPlan").val() == "2CH_0TP" || $("#TPCompPlan").val() == "3CH_0TP")) {
        $('#id_existing_policy_label').text('Do You Have Existing Comprehensive Policy (Select "NO" if ownership transfer) ');
        $("#divNoClaimBonusPercent, .divNoClaimBonusPercent").hide();
    }

    if ($("#TPCompPlan").val() == "0CH_1TP") {
        $('#id_existing_policy_label').text('DO YOU HAVE EXISTING POLICY ');
        $(".PolicyExpiryDate").hide();//mg22-04-2022
    }
    if ($("#TPCompPlan").val() === "1OD_0TP") {
        $('#id_existing_policy_label').text('Do You Have Existing Comprehensive Policy (Select "NO" if ownership transfer) ');
        $('.tpInsurer').show();
        $('#1OD_0TP_NOTE_ALERT').modal('show');
        $('.IsTPPolicyExist').hide();
        $("#divNoClaimBonusPercent, .divNoClaimBonusPercent").hide();
    } else {
        $('.tpInsurer').hide();
        $('.IsTPPolicyExist').show();
    }
    if ($('#VehicleType').val() === "new" || Product_id == 12) {
        $('.IsTPPolicyExist').hide();
    }

    $("#lblPolicyExist-Yes").addClass('btn-UnSelected').removeClass('btn-primarySelected active');
    $("#lblPolicyExist-No").addClass('btn-UnSelected').removeClass('btn-primarySelected active');
    //$("#lblPolicyExist-No").addClass('btn-primarySelected active').removeClass('btn-UnSelected');
    //mg31******End
    //InsurerPlanType(type);

});
function InsurerPlanType(type) {
    if (type == "TP") {
        is_TP = "yes";
        $(".NOTP").hide();
        $("#lblTP").addClass('btngrpSelected');
        $("#lblComp").removeClass('btngrpSelected');
        $("#lblCompTP").removeClass('btngrpSelected');
        if (twowheelerType == "NEW") {
            VehicleInsuranceSubtype = "0CH_" + InsPlanTypeYear + "TP";
        } else {
            VehicleInsuranceSubtype = "0CH_1TP";
        }
    } else if (type == "Comp") {
        //$('.have_claim').show();
        $(".NOTP").show();
        $("#lblTP").removeClass('btngrpSelected');
        $("#lblComp").addClass('btngrpSelected');
        $("#lblCompTP").removeClass('btngrpSelected');
        if (twowheelerType == "NEW") {
            VehicleInsuranceSubtype = InsPlanTypeYear + "CH_0TP";
        } else {
            VehicleInsuranceSubtype = "1CH_0TP";
        }
    } else {

        $("#lblTP").removeClass('btngrpSelected');
        $("#lblComp").removeClass('btngrpSelected');
        $("#lblCompTP").addClass('btngrpSelected');
        if (twowheelerType == "NEW") {
            VehicleInsuranceSubtype = "1CH" + "_" + (InsPlanTypeYear - 1) + "TP";
        } else {
            $(".NOTP").show();
            VehicleInsuranceSubtype = "";
        }
    }
    console.log("VehicleInsuranceSubtype:" + VehicleInsuranceSubtype);
    //$("#VehicleInsuranceSubtype").val(VehicleInsuranceSubtype);
    // $("#TPCompPlan").val(VehicleInsuranceSubtype);
    $("#TPCompPlan").trigger('click');
}
// $('#PolicyExpiryDate').bootstrapMaterialDatePicker({
// time: false,
// clearButton: true,
// format: 'DD-MM-YYYY',
// minDate: (Product_Name == "CV" ?   moment(): moment().subtract(180, 'days')),// (180 Days Before The Current Day) Or (Current Day)
// maxDate: moment().add(60, 'days'), // 180 Days After The Current Day
// //minDate: moment().subtract(120, 'days'), //(Product_Name == "Bike" ? moment().subtract(180, 'days') : moment()), // (180 Days Before The Current Day) Or (Current Day)
// //maxDate: moment().add(60, 'days'), // 180 Days After The Current Day
// defaultDate: moment(),
// onselect: function () {
// myfunction1();
// }
// });

function SetManuDate() {
    if ($("#ManufactureDate").val() != "") {
        var ManDate = ($("#ManufactureDate").val()).split("-");
        $("#ManufactureYear").val(ManDate[1]);
        if (parseInt(ManDate[0]) < 9) {
            $("#ManufactureMonth").val("0" + parseInt(ManDate[0]));
        } else {
            $("#ManufactureMonth").val(ManDate[0]);
        }
    }
}

function CheckAntitheft(value) {
    if (value == "0") {
        $("#IsAntiTheftDevice").html("No");
        $('#ATN').addClass('active');
        $('#ATY').removeClass('active');
    } else {
        $("#IsAntiTheftDevice").html(value);
        $('#ATY').addClass('active');
        $('#ATN').removeClass('active');
    }
    $("#IsAntiTheftDevice").val(value);
}

function cover_filter() {
    ////;


    var motorobject = new Object()
    //var request = search_summary.Request;
    var request = Response_Global.Summary.Request_Core;
    var LoanWaiverval = $('#LoanWaiver').val();
    var OSLCAmount = $("#OutstandingLoanCoverAmount").val();
    var Err = 0;

    var Eleval = $('#ElectricalAccessories').val();
    var NonEleval = $('#NonElectricalAccessories').val();
    var pattern = /^[0-9]*$/;
    //$('#spnElectricalAccessories, #spnNonElectricalAccessories').remove();
    var EleMinRange = Product_id == 10 ? 5000 : 10000;

    if ((Eleval != 0 || Eleval == "")) {
        if (Product_id === "1" || Product_id === "12") {
            if (Eleval < 10000 || Eleval > 50000 || pattern.test(Eleval) == false || Eleval.length != 5 || Eleval == "") {
                Err++;
                $('#spnElectricalAccessories').addClass('ErrorMessage1');
                $('#ElectricalAccessories').addClass('errorClass1');
            } else {
                $('#spnElectricalAccessories').removeClass('ErrorMessage1');
                $('#ElectricalAccessories').removeClass('errorClass1');
            }
        }
        if (Product_id === "10") {
            if (Eleval < 5000 || Eleval > 50000 || pattern.test(Eleval) == false || Eleval.length < 4 || Eleval.length > 5 || Eleval == "") {
                Err++;
                $('#spnElectricalAccessories').addClass('ErrorMessage1');
                $('#ElectricalAccessories').addClass('errorClass1');
            } else {
                $('#spnElectricalAccessories').removeClass('ErrorMessage1');
                $('#ElectricalAccessories').removeClass('errorClass1');
            }
        }
    }
    if ((NonEleval != 0 || NonEleval == "")) {
        if (Product_id === "1" || Product_id == "12") {
            if (NonEleval < 10000 || NonEleval > 50000 || pattern.test(NonEleval) == false || NonEleval.length != 5 || NonEleval == "") {
                Err++;
                $('#spnNonElectricalAccessories').addClass('ErrorMessage1');
                $('#NonElectricalAccessories').addClass('errorClass1');
            } else {
                $('#spnNonElectricalAccessories').removeClass('ErrorMessage1');
                $('#NonElectricalAccessories').removeClass('errorClass1');
            }
        }
        if (Product_id === "10") {
            if (NonEleval < 5000 || NonEleval > 50000 || pattern.test(NonEleval) == false || NonEleval.length < 4 || NonEleval.length > 5 || NonEleval == "") {
                Err++;
                $('#spnNonElectricalAccessories').addClass('ErrorMessage1');
                $('#NonElectricalAccessories').addClass('errorClass1');
            } else {
                $('#spnNonElectricalAccessories').removeClass('ErrorMessage1');
                $('#NonElectricalAccessories').removeClass('errorClass1');
            }
        }
    }


    if (parseInt($("#ExpectedIDV").val()) != 0) {
        if (parseInt($("#ExpectedIDV").val()) < parseInt($('#expected_idv').attr("min")) || parseInt($("#ExpectedIDV").val()) > parseInt($('#expected_idv').attr("max"))) {
            $("#ExpectedIDV").addClass('errorClass1');
            $(".spnExpectedIDV").addClass('ErrorMessage1');
            Err++;
        } else {
            $("#ExpectedIDV").removeClass('ErrorMsg');
        }
    }

    if ($("#LoanWaiver").val() == "Yes" && (Product_id === "1" || Product_id === "10")) {
        if (OSLCAmount < 0 || OSLCAmount > 2000000 || pattern.test(OSLCAmount) == false || OSLCAmount == "") {
            Err++;
            $('#spnOutstandingLoanCoverAmount').addClass('ErrorMessage1');
            $('#OutstandingLoanCoverAmount').addClass('errorClass1');
        } else {
            $('#spnOutstandingLoanCoverAmount').removeClass('ErrorMessage1');
            $('#OutstandingLoanCoverAmount').removeClass('errorClass1');
        }
    }

    if (Err > 0) {
        return false;
    }
    var REGNO = (request.registration_no).replace(/-/g, '');
    var manf_date = request.vehicle_manf_date.substring(0, 4) + "-" + request.vehicle_manf_date.substring(5, 7) + "-01";

    var data1 = {
        "product_id": parseInt(Product_id),
        "vehicle_id": request.vehicle_id,
        "rto_id": request.rto_id,
        "vehicle_insurance_type": request.vehicle_insurance_type,
        "vehicle_manf_date": manf_date,
        "vehicle_registration_date": request.vehicle_registration_date,
        "policy_expiry_date": request.policy_expiry_date,
        "prev_insurer_id": request.prev_insurer_id,
        "vehicle_registration_type": fin_vehicle_registration_type,
        "vehicle_ncb_current": request.vehicle_ncb_current,
        "is_claim_exists": request.is_claim_exists,
        "method_type": "Premium",
        "execution_async": "yes",
        "electrical_accessory": parseInt($("#ElectricalAccessories").val()),
        "non_electrical_accessory": parseInt($("#NonElectricalAccessories").val()),
        "registration_no": request.registration_no,
        "is_llpd": $("#PersonalAccidentCoverforDriver").val() == "Yes" ? "yes" : "no",
        "is_antitheft_fit": $("#IsAntiTheftDevice").val() == "Yes" ? "yes" : "no",
        "voluntary_deductible": $("#VoluntaryDeduction").val(),
        "is_external_bifuel": request.is_external_bifuel,
        "is_aai_member": $("#MemberofAA").val() == "Yes" ? "yes" : "no",
        "is_inspection_done": "no",
        "external_bifuel_type": request.external_bifuel_type,
        "external_bifuel_value": request.external_bifuel_value > 0 ? request.external_bifuel_value : "",
        "pa_owner_driver_si": $("#ODPAC").val() == "" ? 1500000 : parseInt($("#ODPAC").val()),
        "is_pa_od": $("#OwnerDriverPersonalAccidentCover").val() == "Yes" ? "yes" : "no",
        "is_having_valid_dl": $('#IsHavingValidDL').val() == "Yes" ? "yes" : "no",
        "is_opted_standalone_cpa": $('#IsHavingSCPACheckIsHavingSCPA').val() == "No" ? "no" : "yes",
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
        "ss_id": request.ss_id,
        "fba_id": request.fba_id,
        "geo_lat": geo_lat ? geo_lat : 0,
        "geo_long": geo_long ? geo_long : 0,
        "agent_source": "",
        "client_id": 2,
        "ip_address": request.ip_address,
        "app_version": request.app_version,
        "mac_address": request.mac_address,
        "search_reference_number": SRN,
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
        "is_financed": "no",
        "is_oslc": $("#LoanWaiver").val() == "Yes" ? "yes" : "no",
        "oslc_si": $("#OutstandingLoanCoverAmount").val() == "" ? 0 : parseInt($("#OutstandingLoanCoverAmount").val()),
        "ip_city_state": ip_city_state ? ip_city_state : "",
        "vd_customer_name" : getUrlVars()['vd_customer_name'] != "" && getUrlVars()['vd_customer_name'] != undefined && getUrlVars()['vd_customer_name'] != null ? getUrlVars()['vd_customer_name'] : "",
        "vd_mobile" : getUrlVars()['vd_mobile'] != "" && getUrlVars()['vd_mobile'] != undefined && getUrlVars()['vd_mobile'] != null ? getUrlVars()['vd_mobile'] : "",
        "vd_email": getUrlVars()['vd_email'] != "" && getUrlVars()['vd_email'] != undefined && getUrlVars()['vd_email'] != null ? getUrlVars()['vd_email'] : "",
        "vd_registration_no" : getUrlVars()['vd_registration_no'] != "" && getUrlVars()['vd_registration_no'] != undefined && getUrlVars()['vd_registration_no'] != null ? getUrlVars()['vd_registration_no'] : "",
        "vd_customer_identifier" : getUrlVars()['vd_customer_identifier'] != "" && getUrlVars()['vd_customer_identifier'] != undefined && getUrlVars()['vd_customer_identifier'] != null ? getUrlVars()['vd_customer_identifier'] : "",
        "app_visitor_id" : app_visitor_id

    };
    /*
     if($("#TPCompPlan").val() !== "1OD_0TP" && ($('#VehicleType').val() === "renew") &&  (Product_id == 1 || Product_id == 10)){
     data1['is_tp_policy_exists'] = IsTPPolicyExistflag;
     }*/
    data1["is_breakin"] = request.is_breakin;
    data1["is_policy_exist"] = request.is_policy_exist;

    if ($("#TPCompPlan").val() == "1OD_0TP") {
        data1["tp_insurer_id"] = request.tp_insurer_id;
        ;
    }
    //if (Product_id == 1) { data1["is_policy_exist"] = request.is_policy_exist; }
    if (sub_fba_id != '' || sub_fba_id != null) {
        data1["sub_fba_id"] = request.sub_fba_id;
    }
    if (Product_id == 10) {
        data1["is_tppd"] = $("#IsTPPD").val() == "yes" ? "yes" : "no";
    }
    if (Product_id == 1 && $('#TPCompPlan').val() == "0CH_1TP") {
        $('.bikeAttribute').removeClass('hidden');
        data1["is_tppd"] = $("#IsTPPD").val() == "yes" ? "yes" : "no";
    }

    if (Product_id == 12) {
        data1["vehicle_class"] = request.vehicle_class;
        data1["vehicle_class_code"] = request.vehicle_class_code;
        data1["vehicle_sub_class"] = request.vehicle_sub_class;
        data1["own_premises"] = own_premises;
        data1["cleaner_ll"] = Cleaner_Ll;
        data1["geographicalareaext"] = GeographicalAreaExt;
        data1["additionaltowing"] = Additional_Towing;
        data1["fibreglasstankfitted"] = fibre_glass_fuel_tank;

        data1["imt23"] = IMT23;
        data1["other_use"] = OtherUse;
        data1["emp_pa"] = PersonalAccidentCoverForEmployee;
        data1["coolie_ll"] = Coolie_Ll;

        data1["non_fairing_paying_passenger"] = NonFairingPayingPassengerVal;
        data1["fairing_paying_passenger"] = FairingPayingPassengerVal;
        data1["conductor_ll"] = Conductor_Ll;

    }
    if (GLeadId != null && GLeadType != null && GLeadStatus != null && GLeadId != '' && GLeadType != '' && GLeadStatus != '' && GLeadId != undefined && GLeadType != undefined && GLeadStatus != undefined) {
        data1["lead_id"] = GLeadId;
        data1["lead_type"] = GLeadType;
        data1["lead_status"] = GLeadStatus;
    }
    if (origin_crn != "" && origin_crn !== undefined && origin_udid !== undefined && origin_udid !== "") {
        data1['origin_crn'] = origin_crn;
        data1['origin_udid'] = origin_udid;
        data1['origin_email'] = origin_email;
        data1['lead_type'] = "cross_sell";
    }
    if (IsTypeFastLane === true) {
        if (OrgRtoFastLane !== '') {
            data1["regno_rtocode"] = OrgRtoFastLane.toUpperCase();
            data1["is_fastlane_rto"] = "yes";
        }
    } else {
        data1["is_fastlane_rto"] = "no";
    }

    if (utm_source != undefined && utm_campaign != undefined && utm_medium != undefined) {
        data1['utm_source'] = utm_source;
        data1['utm_campaign'] = utm_campaign;
        data1['utm_medium'] = utm_medium;
        data1['lead_type'] = "LERP_FRESH";
    }
	if(Product_id == 1 && request.vehicle_insurance_type == "new" && $("#OwnerDriverPersonalAccidentCover").val() == 'Yes'){
		data1['cpa_tenure'] = parseInt($("#CPATenure_Car").val());
	}else if(Product_id == 10 && request.vehicle_insurance_type == "new" && $("#OwnerDriverPersonalAccidentCover").val() == 'Yes'){
		data1['cpa_tenure'] = parseInt($("#CPATenure_TW").val());
	}
    console.log(JSON.stringify(data1));

    var obj_horizon_data = Horizon_Method_Convert("/quote/premium_initiate", data1, "POST"); 		//UAT
    $.ajax({
        type: "POST",
        data: siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(data1),
        url: siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/premium_initiate",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {

            if ((data.hasOwnProperty("Details")) && ((data.hasOwnProperty("Summary")) ? ((data.Summary.hasOwnProperty("Request_Unique_Id")) || (data.Summary.Request_Unique_Id == "")) : true)) {
                var msg = data.Details.join('<br/>');
                $('.error_popupbox').show();
                $(".Agebox_wrap").html(msg);
            } else {

                $('.error_popupbox').hide();
                $(".Agebox_wrap").empty();

                console.log(data)
                SRN = data.Summary.Request_Unique_Id;
                console.log(SRN);
                $('body').css({'overflow': 'auto'});
                $('.coveradd').hide();
                $('.maininput').hide();
                $('.quotelist').show();
                $('.footerDiv').hide();
                $('.loading').show();
                $('#Property').removeClass('active in');
                $('#Appl').addClass('active in');
                Get_Search_Summary();
                Get_Saved_Data();
                $('#addonChecked').prop('checked', false);
                $('#SelectAllAddons').prop('checked', false);
                //window.location.href = "E:/Codebase/Horizon_v1/resource/request_file/Finmart/TW_Web/tw-main-page.html?SRN=" + data.Summary.Request_Unique_Id + "&ClientID=" + clientid;
                //window.location.href = "/Finmart/TW_Web/tw-main-page.html?SRN=" + data.Summary.Request_Unique_Id + "&ClientID=" + clientid;
            }
        },
        error: function (data) {
            $('.AlertOvl').show();
            $('.alert_container').text("Cannot Proceed Now. Please Try Again!");
            $('.ok_btn').click(function () {
                $('.AlertOvl').hide();
            });

            console.log(data);

        }
    });

}


function CheckOwnerDriverPersonalAccidentCover(value) {

    if (value == "Yes") {
        $('#ShowPACODMsg').hide();

        $("#ODPAC").val(1500000).text('1500000');
        $('#CKAY').addClass('active');
        $('#CKAN').removeClass('active');
		
		if(Product_id == 1){
			$("#CPATenure_Car").show();
			$("#CPATenure_TW").hide();
			$(".CPATenure").show();
		}
		if(Product_id == 10){
			$("#CPATenure_Car").hide();
			$("#CPATenure_TW").show();
			$(".CPATenure").show();
		}
		if(Product_id == 12){
			$("#CPATenure_Car").hide();
			$("#CPATenure_TW").hide();
			$(".CPATenure").hide();
		}		
    } else if (value == "No") {
        $('#ShowPACODMsg').show();
        $("#ODPAC").val(0).text('0');
        $('#CKAN').addClass('active');
        $('#CKAY').removeClass('active');
		
		$("#CPATenure_Car").hide();
		$("#CPATenure_TW").hide();
		$(".CPATenure").hide();
    }

    $("#OwnerDriverPersonalAccidentCover").val(value);
}
function CheckMobileAssociation(value) {
    if (value == "0") {
        $("#MemberofAA").html("No");
        $('#Association2').addClass('active');
        $('#Association1').removeClass('active');
    } else {
        $("#MemberofAA").html(value);
        $('#Association1').addClass('active');
        $('#Association2').removeClass('active');
    }
    $("#MemberofAA").val(value);
}

$(document).on("click", ".PremiumBreakup", function () {

    var premium_values = $(this).children(".PremiumBreakup");
    SelectedInsId = premium_values.attr("insurerid");
    if (SelectedInsId == 11 && ($("#NonElectricalAccessories").val() - 0 > 0)) {
        $("#lblBasicOwnDamage").text("Basic OD + NEA Premium");
    } else {
        $("#lblBasicOwnDamage").text("Basic OD");
    }
    $(".Name").text(Name);
    if (EmailVal.indexOf('testpb.com') > -1) {
        $("#EmailID").val("");
    } else {
        $("#EmailID").val(EmailVal);
    }

    //RoyalSundaram
    if (quotes.Summary.Request_Core.vehicle_insurance_subtype) {
        var ch_flag = ((parseInt(((quotes.Summary.Request_Core.vehicle_insurance_subtype).split('CH'))[0]) > 0) ? true : false);
        if (SelectedInsId == 10 && ch_flag) {
            $('.royalsundarambreakup').removeClass('hidden');
        } else {
            $('.royalsundarambreakup').addClass('hidden');
        }
    }



    $("#spanPremium").html(premium_values.attr("Premium"));
    $("#sBasicOwnDamage, .sBasicOwnDamage").html(premium_values.attr("BasicOwnDamage"));
    $("#NonElectricalAccessoriesPremium").html(premium_values.attr("nonelectricalaccessoriespremium"));
    $("#ElectricalAcessoriesPremium, .ElectricalAcessoriesPremium").html(premium_values.attr("electricalacessoriespremium"));
    $("#ODDiscount, .ODDiscount").html(premium_values.attr("ODDiscount"));
    $("#ODDiscountper").html(premium_values.attr("ODDiscountper"));
    $("#ODOwnPremises, .ODOwnPremises").html(premium_values.attr("oddiscownpremises"));
    $("#BiFuelKitPremium, .BiFuelKitPremium").html(premium_values.attr("BiFuelKitPremium"));
    $("#BiFuelKitLiability, .BiFuelKitLiability").html(premium_values.attr("bifuelkitliabilitypremium"));
    $("#AntiTheftDiscount, .AntiTheftDiscount").html(premium_values.attr("AntiTheftDiscount"));
    $("#VoluntaryDeductions, .VoluntaryDeductions").html(premium_values.attr("VoluntaryDeductions"));
    $("#AutomobileAssociationMembershipPremium, .AutomobileAssociationMembershipPremium").html(premium_values.attr("AutomobileAssociationMembershipPremium"));
    $("#AgeDiscount").html(premium_values.attr("AgeDiscount"));
    $("#ProfessionDiscount").html(premium_values.attr("ProfessionDiscount"));
    $("#UnderwriterLoading, .UnderwriterLoading").html(premium_values.attr("underwriterloading"));
    $("#TotalODPremium, .TotalODPremium").html(premium_values.attr("TotalODPremium"));

    $("#NonFarePayingPassenger, .NonFarePayingPassenger").html(premium_values.attr("NonFarePayingPassenger"));
    $("#FarePayingPassenger, .FarePayingPassenger").html(premium_values.attr("FarePayingPassenger"));

    $("#Imt23, .Imt23").html(premium_values.attr("Imt23"));
    $("#OtherUse, .OtherUse").html(premium_values.attr("OtherUse"));
    $("#PersonalAccidentCoverForEmployee, .PersonalAccidentCoverForEmployee").html(premium_values.attr("PersonalAccidentCoverForEmployee"));
    $("#TPPDDiscount").html(premium_values.attr("tppd"));

    $("#p_insurername").html(premium_values.attr("insurername"));
    $("#p_bike_model_name").html(premium_values.attr("makemodelname"));
    $("#p_servicelogid").html(premium_values.attr("servicelogid"));
    $("#p_LM_Custom_Request_vehicle_expected_idv").html(premium_values.attr("idv"));
    $("#premium_CRN").html($("#CRN").text());

    if ($("#VehicleInsuranceSubtype").val() != null || $("#VehicleInsuranceSubtype").val() != "") {
        var VIST = ($("#VehicleInsuranceSubtype").val()).split("CH_")
        if (VIST[0] == 0) {
            $("#TotalODPremium").html("N.A.");
        }
    } else {
    }

    if (SelectedInsId == 2) {
        $("#OutstandingLoanCover, .OutstandingLoanCover").html(premium_values.attr("OutstandingLoanCover"));
    } else {
        $("#OutstandingLoanCover, .OutstandingLoanCover").html(0);
    }

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
    if (_AddOnPremium > 0) {
        $("#divAddOnPremium").css("display", "block");
    } else {
        $("#divAddOnPremium").css("display", "none");
    }

    if (premium_values.attr("insurerid") == 9 && premium_values.attr("ODDiscount") == "0") {
        $("#odDiscount").hide();
    } else {
        $("#odDiscount").show();
    }

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

        $("#divAddOnPremium").show();
        $("#divAddOnPremiumPopup").show();
        $("#divAddonLI").empty();
        $("#divAddonLIPopup").empty();
        $("#divAddonLIPopup").append("<tr class='addonsList'><td class='border-table-td text-center' style='background:#00476f; padding: 6px !important; color:#fff;'>ADDON PREMIUM</td></tr>")
        //$("#divAddonLIPopup").append("<div style='width:100%; padding:10px 0px;text-align:center;font-size:15px;background-color:#15b9dc;color:#fff;font-family:arial!important;line-height:20px;'><b>ADD-ONS</b></div>");
        SelectedAddonList = [];
        for (var i = 0; i < tempAd.length - 1; i++) {
            var obj = {n: tempAd[i].split("-")[0], v: tempAd[i].split("-")[1]};
            SelectedAddonList.push(obj);
            $("#divAddonLI").append("<li class='list-group-item'><span>" + tempAd[i].split("-")[0] + "</span><span class='pull-right'>" + tempAd[i].split("-")[1] + "</span></li>");
            $("#divAddonLIPopup").append("<tr><td  class='border-table-td'><div class='col-xs-8 pad border-div-td'><p>" + tempAd[i].split("-")[0] + "</p></div> <div class='col-xs-4 text-center pad'><p>" + tempAd[i].split("-")[1] + "</p></div></td></tr>");
        }
        $("#divAddonLIPopup").append("<tr class='addonsList'><td  class='border-table-td'><div class='col-xs-8 pad border-div-td'><h5>Total Addons Premium</h5></div> <div class='col-xs-4 text-center pad'><h5 id='AddOnPremium'>" + premium_values.attr("addonpremium") + "</h5></div></td></tr>");
    } else {
        $("#divAddOnPremium").hide();
        $("#divAddOnPremiumPopup").hide();
        $("#divAddonLIPopup").empty();
    }

    if (premium_values.attr("addonpremium") > 0) {
        $("#pGrossPremium").css("display", "block");
        $("#GrossPremium").html((parseFloat(_AddOnPremium) + parseFloat(premium_values.attr("TotalPremium"))));
    } else {
        $("#pGrossPremium").css("display", "none");
    }
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
    CVCoversHide();

    $(".popup_overlay").slideDown();
    $(".popup_overlay > div").hide();
    $(".PremiumDetails").show();
    var addontext = $('.switch-outer').children('.active').text().trim();

    if (premium_values.attr("addonpremium") > 0) {
        $('.addonsList').show();
    } else {
        $('.addonsList').hide();
    }
});

var PremiumArray = ['sBasicOwnDamage', 'ODDiscount', 'BiFuelKitPremium', 'BiFuelKitLiability', 'AutomobileAssociationMembershipPremium', 'UnderwriterLoading',
    'NonElectricalAccessoriesPremiumNEA', 'ElectricalAcessoriesPremium', 'AntiTheftDiscount', 'PersonalAccidentCoverForNamedPassenger',
    'PersonalAccidentCoverForPaidDriver', 'VoluntaryDeductions', 'ThirdPartyPropertyDamage', 'NoClaimBonus', 'TotalLiabilityPremium', 'ThirdPartyLiablityPremium',
    'PersonalAccidentCoverForOwnerDriver', 'LegalLiabilityPremiumForPaidDriver', 'PersonalAccidentCoverForUnammedPassenger', 'BiFuelKitLiabilityPremium', 'AddOnPremium', 'OutstandingLoanCover',
    'ODOwnPremises', 'NonFarePayingPassenger', 'FarePayingPassenger', 'Imt23', 'OtherUse', 'PersonalAccidentCoverForEmployee', 'TPPDDiscount']

function PremiumDetailsValues() {

    for (var i = 0; i < PremiumArray.length; i++) {
        if ($("#" + PremiumArray[i]).text() == "0" || $("#" + PremiumArray[i]).text() == "") {
            $("#" + PremiumArray[i]).closest('tr').hide();
        } else {
            $("#" + PremiumArray[i]).closest('tr').show();
        }

    }
}
function PremiumPopupDetailsValues() {
    for (var i = 0; i < PremiumArray.length; i++) {
        if ($("." + PremiumArray[i]).text() == "0" || $("." + PremiumArray[i]).text() == "") {
            $("." + PremiumArray[i]).parent().parent().remove();
        } else {
            $("." + PremiumArray[i]).parent().parent().show();
        }
    }
}

var CVCoverArray = ['ODOwnPremises', 'NonFarePayingPassenger', 'FarePayingPassenger', 'Imt23', 'OtherUse', 'PersonalAccidentCoverForEmployee']
function CVCoversHide() {

    if (Product_id === "10" || Product_id === "1")
        for (var i = 0; i < CVCoverArray.length; i++) {
            $("#" + CVCoverArray[i]).closest('tr').hide();

        }
}

function redirect(id) {

    if (app_version == "FinPeace") {
        ss_id = 0;
    }
    $(id).attr('href', $(id).attr('href').replace("___proposal_url___", product_attr[Product_id]["Proposal_url"]));
    $(id).attr('href', $(id).attr('href').replace("___Service_Log_Unique_Id___", $("#hdn_arn").val()));
    $(id).attr('href', $(id).attr('href').replace("___client_id___", clientid));
    $(id).attr('href', $(id).attr('href').replace("AgentType", AgentType));
    $(id).attr('href', $(id).attr('href').replace("IsCustomer", ss_id));
    var hrefval = $(id).attr('href');
    var newurl = SetUrl() + hrefval;
    window.location.replace(newurl);
    return false;
    //window.location.href = newurl;
    //location = newurl;

}
function SetUrl() {
    var url = window.location.href;
    //alert(url.includes("health"));
    var newurl;
    newurl = "http://qa-horizon.policyboss.com:3000";
    if (url.includes("request_file")) {
        newurl = "http://qa.policyboss.com";
//        newurl = "http://localhost:50111";
    } else if (url.includes("qa")) {
        newurl = "http://qa.policyboss.com";
    } else if (url.includes("www") || url.includes("origin-cdnh") || url.includes("cloudfront")) {
        newurl = "https://www.policyboss.com";
    }
    return newurl;
}

function AllAddons(input) {
    if (input == true) {
        handle_addon_addition();
    } else {
        $('.addon-selectedMobile').empty();
        $('.addon-selectedMobile').hide();
        $('.addon-selectedMobile').removeClass('.quote-without-addon');
        if (quotes.Response.length > 0) {
            $.each(quotes.Response, function (index, value) {
                if (value.Error_Code == "") {
                    var addon_amount = 0;//value.Premium_Breakup.net_premium;
                    var addon_premium_breakup = "";
                    var InsID = value.Insurer.Insurer_ID;
                    var InsName = value.Insurer.Insurer_Code;
                    var total_liability_premium = value.Premium_Breakup.liability['tp_final_premium'] - 0;
                    var net_premium = value.Premium_Breakup.net_premium + addon_amount;
                    var service_tax = 2 * (Math.round(net_premium * 0.09) - 0);
                    var od_final_premium = value.Premium_Breakup.own_damage['od_final_premium'] - 0;
                    var ncb = value.Premium_Breakup.own_damage['od_disc_ncb'] - 0;

                    var final_premium = Math.round(net_premium + service_tax - 0);
                    $('.PB1_' + InsID).text('₹ ' + rupee_format(final_premium));
                    $('#divQuitList' + InsID + ' .PremiumBreakup').children('.PremiumBreakup').attr('netpayablepayablepremium', rupee_format(final_premium));
                    $('#divQuitList' + InsID + ' .PremiumBreakup').children('.PremiumBreakup').attr('servicetax', rupee_format(Math.round(service_tax)));
                    $('#divQuitList' + InsID + ' .PremiumBreakup').children('.PremiumBreakup').attr('addonpremium', Math.round(addon_amount));
                    $('#divQuitList' + InsID + ' .PremiumBreakup').children('.PremiumBreakup').attr('totalpremium', rupee_format(Math.round(net_premium)));
                    $('#divQuitList' + InsID + ' .PremiumBreakup').children('.PremiumBreakup').attr('addonname', addon_premium_breakup);
                    $('#divwithgst' + InsID).text('₹ ' + rupee_format(final_premium) + ' with GST');

                }
            });

        }

    }
    addon_filter();

}
;

function handle_addon_addition() {
    $('#QuoteLoader').hide();
    var NewAddOnSelectedList = [];
    BundleResponse = {};
    NewAddOnSelectedList = AddOnSelectedList;
    var BundleHtml = $("#BundleEdit").html();
    $("#BundleBody").html("");
    var InsurerCount = 0;
    $("#BundleEdit").html("");
    var BundleCount = 0;
    var vehicle_Insurance_type;
    if (quotes.Response.length > 0) {


        if (quotes.hasOwnProperty("Addon_Request") && quotes.Addon_Request != null && (Object.keys(quotes.Addon_Request).length > 0)) {
            AddonBlock(quotes);
            NewAddOnSelectedList = AddOnSelectedList;
        }

        var addon_checked = $('#Addons').find('input[type=checkbox]:checked');
        var addon_unchecked = $('#Addons').find("input:checkbox:not(:checked)");
        if (addon_checked.length > 0) {
            $('#addonChecked').prop('checked', true);
        } else
        {
            $('#addonChecked').prop('checked', false);
        }

        vehicle_Insurance_type = quotes.Summary.Request_Product['vehicle_insurance_type'];
        $.each(quotes.Response, function (index, value) {

            if (value.Error_Code == "") {

                var InsID = value.Insurer.Insurer_ID;
                if (InsID === 2) {
                    if (VehInsSubType.indexOf('0CH') === -1 && Product_id == 1) {
                        if (Response_Global.Summary.Request_Core.is_oslc === "yes" && value.Premium_Breakup.liability['tp_cover_outstanding_loan'] > 0) {
                            $("#oustandingTxt_" + InsID).show();
                        }
                    }
                    $(".loanwaiver").show();
                }

                if (($("#TPCompPlan").val() == "0CH_1TP" || $("#TPCompPlan").val() == "0CH_3TP") && Product_id == 1) {
                    $("#divLoanWaiver").hide();
                    $(".divOutstandingLoanCoverAmount").hide();
                }

                if (($("#TPCompPlan").val() == "1CH_0TP" || $("#TPCompPlan").val() == "1OD_0TP" || $("#TPCompPlan").val() == "1CH_2TP" || $("#TPCompPlan").val() == "3CH_0TP") && Product_id == 1 && InsID == 2) {
                    $("#divLoanWaiver").show();
                    $(".divOutstandingLoanCoverAmount").show();
                }

                if (($("#TPCompPlan").val() == "0CH_1TP" || $("#TPCompPlan").val() == "0CH_5TP") && Product_id == 10) {
                    $("#divLoanWaiver").hide();
                    $(".divOutstandingLoanCoverAmount").hide();
                }

                if (($("#TPCompPlan").val() == "1CH_4TP" || $("#TPCompPlan").val() == "5CH_0TP" || $("#TPCompPlan").val() == "1CH_0TP" || $("#TPCompPlan").val() == "2CH_0TP" || $("#TPCompPlan").val() == "3CH_0TP" || $("#TPCompPlan").val() == "1OD_0TP") && Product_id == 10 && InsID == 2) {
                    $("#divLoanWaiver").hide();
                    $(".divOutstandingLoanCoverAmount").hide();
                }

                var addon_amount = 0;//value.Premium_Breakup.net_premium;
                var addon_premium_breakup = "";
                var InsID = value.Insurer.Insurer_ID;
                var InsName = value.Insurer.Insurer_Code;
                $($('#divQuitList' + value.Insurer.Insurer_ID).children('.UlClass').children('.LiClass').children()[1]).children('.clearfix').nextAll().remove();
                // $('#divQuitList' + InsID).children('.quotechild').children('.premium_div').children('.Premium').text("")
                $($('#divQuitList' + InsID).children('.addon-selected')).hide();
                $('#divQuitList' + InsID).addClass('applyAddon');
                //Addon for Mobile
                $($('#divQuitList' + InsID).children('.addon-selectedMobile')).html("");

                //RoyalSundaram
                if (InsID == 10) {
                    for (var a = 0; a < addon_checked.length; a++) {
                        if (addon_checked[a].id == "addon_zero_dep_cover") {
                            if (value.Addon_List.hasOwnProperty("addon_zero_dep_cover") && value.Addon_List.addon_zero_dep_cover > 0) {
                                $('.royalsundarambreakup').removeClass('hidden');
                            } else {
                                $('.royalsundarambreakup').addClass('hidden');
                            }
                        }
                    }
                    if (addon_checked.length == 0) {
                        $('.royalsundarambreakup').addClass('hidden');
                    }
                }

                //addon label start
                var count = 0;

                // ALACARTE
                if (value.Addon_Mode == "ALACARTE") {

                    $.each(addon_checked, function (i, v) {
                        $('.addon-selectedMobile').show();
                        //var addon_name = addon_list[v.id];
                        var addon_name = addon_shortlist[v.id];
                        var addon_Fullname = addon_list[v.id];
                        if (typeof value.Addon_List[v.id] !== 'undefined') {
                            count++;
                            addon_premium = value.Addon_List[v.id];
                            addon_amount += addon_premium;

                            //addon_premium_breakup += addon_name + '-' + addon_premium + '+';//Commented By Pratik On 14-02-2018
                            addon_premium_breakup += addon_Fullname + '-' + addon_premium + '+';// Added By Pratik On 14-02-2018
                            //For Desktop
                            //$($('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.addon-selected')).append('<div style="margin-bottom: 2px;font-size: 11px;background-color: #0091c0;color:#fff; padding: 3px;border-radius:2px; /*text-align: center*/; float:left; padding-right: 0px; padding-left: 0px !important;margin-right: 3px;" class="col-xs-4 col-md-2 form-height" title="' + addon_Fullname + '"><div class="col-md-5" style"padding-left: 10px;">' + addon_name + '</div><div class="" style="padding-left: 0;"><span class="addonvalue">₹ ' + Math.round(addon_premium) + '</span ></div ></div > ');
                            $($('#divQuitList' + InsID).children('.addon-selected')).append('<span class="BlockSections" title="' + addon_Fullname + '">' + addon_name + ' <span>₹ ' + Math.round(addon_premium) + '</span></span>');

                            //For Mobile
                            $('#divQuitList' + InsID).children('.addon-selectedMobile').append('<div class="hello" style="font-size:11px;margin:3px;"><div  class="ad xyz" title="' + addon_Fullname + '">' + addon_Fullname + '  &nbsp; <span><i class="fa fa-inr"></i>' + Math.round(addon_premium) + '</span></div></div>');
                        }
                        $('body').css('overflow', 'auto');
                        // else {
                        // $('#divQuitList' + InsID).addClass('hidden');
                        //    $($('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.boxLeft').children('.addon-selected')).append('<div><button class="btn btn-danger btn-xs btn-block waves-effect" type="button">' + addon_name + ' <span class="badge">NA</span></button></div>');
                        // }
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

                            if (BuffetPlanName == "Basic") {
                                Baseclass = "Basic";
                            } else if (BuffetPlanName == "OD") {
                                Baseclass = "OD";
                            } else {
                                Baseclass = "NoBasic";
                            }
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
                                    case 'PEARLP':
                                        $("#note" + InsID + "_" + BuffetPlanName).text('You can only opt ' + BuffetPlanName + ' if you have  Zero depreciation & Engine secure in previous policy.');
                                        break;
                                    case 'SILVER':
                                        $("#note" + InsID + "_" + BuffetPlanName).text('');
                                        break;
                                    case 'GOLD':
                                        $("#note" + InsID + "_" + BuffetPlanName).text('');
                                        break;
                                    case 'SAPPHIRE':
                                        $("#note" + InsID + "_" + BuffetPlanName).text('You can only opt ' + BuffetPlanName + ' if you have Zero depreciation & Tyre secure in previous policy.');
                                        break;
                                    case 'SAPPHIREPP':
                                        $("#note" + InsID + "_" + BuffetPlanName).text('You can only opt ' + BuffetPlanName + ' if you have Zero depreciation, Engine secure, Tyre secure & RTI in previous policy.');
                                        break;
                                    case 'PEARL':
                                        $("#note" + InsID + "_" + BuffetPlanName).text('You can only opt ' + BuffetPlanName + ' if you have Zero depreciation in previous policy.');
                                        break;
                                    case 'SAPPHIREP':
                                        $("#note" + InsID + "_" + BuffetPlanName).text('You can only opt ' + BuffetPlanName + ' if you have Zero depreciation, Engine secure & Tyre secure in previous policy.');
                                        break;
                                    case 'Basic':
                                        $("#note" + InsID + "_" + BuffetPlanName).text('');
                                        break;
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
                            } else {
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
                            if (BuffetPlan.length == 1) {
                                $("#" + BuffetPlanName + "-" + InsID).attr("checked", true);
                            }
                            $("#Premium_" + InsID + "_" + BuffetPlanName).text(PkgNP);

                        }
                        //$("#BundleEdit").append(addonbundle);
                        $("#BundleBody").append('</div>');
                        //$('#DisplayAddons' + InsID).find('input[type=checkbox]:checked').removeAttr('checked');
                    }
                }

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


                //For GCV service tax Calculation is different.
                if (Product_id == 12) {
                    var OD_final = value.Premium_Breakup.own_damage['od_final_premium'];
                    var OD_Own_Premises = value.Premium_Breakup.own_damage['od_disc_own_premises'];
                    var total_liability_premium1 = parseInt(value.Premium_Breakup.liability['tp_final_premium']) + parseInt(value.Premium_Breakup.liability['tp_cover_imt23']);
                    var total_liability_premium2 = parseInt(value.Premium_Breakup.liability['tp_basic_other_use']);
                    total_liability_premium = (Math.round(total_liability_premium1 + total_liability_premium2));
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
                        var OD_tax = 2 * (od_final_premium * 0.09) - 0;
                        var tp_basic_Tax = 2 * (value.Premium_Breakup.liability['tp_basic'] * 0.06);
                        var tp_rest = value.Premium_Breakup.liability['tp_final_premium'] - value.Premium_Breakup.liability['tp_basic'];
                        var tp_rest_Tax = 2 * (tp_rest * 0.09) - 0;
                        service_tax = (Math.round(OD_tax + tp_basic_Tax + tp_rest_Tax));
                        value.Premium_Breakup.service_tax = service_tax;

                    } else {
                        service_tax = 2 * (Math.round(net_premium * 0.09) - 0);
                        value.Premium_Breakup.service_tax = service_tax;
                    }
                }

                var final_premium = Math.round(net_premium + service_tax - 0);
                $('.PB1_' + InsID).text('');
                $('.PB1_' + InsID).text('₹ ' + rupee_format(Math.round(net_premium)));
                //$('#divQuitList' + InsID).children('.quotechild').children('.premium_div').children('.Premium').children('.divname').children('.PremiumBreakup1').children('.PremiumBreakup').text('₹ ' + rupee_format(final_premium))

                $('#divQuitList' + InsID).attr('premium', final_premium);


                $('#divQuitList' + value.Insurer.Insurer_ID).attr('applied_addon', count);
                $('#divQuitList' + InsID + ' .PremiumBreakup').children('.PremiumBreakup').attr('netpayablepayablepremium', rupee_format(final_premium));
                $('#divQuitList' + InsID + ' .PremiumBreakup').children('.PremiumBreakup').attr('servicetax', rupee_format(Math.round(service_tax)));
                $('#divQuitList' + InsID + ' .PremiumBreakup').children('.PremiumBreakup').attr('addonpremium', Math.round(addon_amount));
                $('#divQuitList' + InsID + ' .PremiumBreakup').children('.PremiumBreakup').attr('totalpremium', rupee_format(Math.round(net_premium)));
                $('#divQuitList' + InsID + ' .PremiumBreakup').children('.PremiumBreakup').attr('addonname', addon_premium_breakup);
                $('#divwithgst' + InsID).text('₹ ' + rupee_format(final_premium) + ' with GST');

                //For Displaying Message For Discount Not Selected
                var TotalDiscountVal = 0;
                TotalDiscountVal = Math.round(value.Premium_Breakup.own_damage.od_disc_anti_theft) + Math.round(value.Premium_Breakup.own_damage.od_disc_vol_deduct);
                //$('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('totaldiscount', TotalDiscountVal);
                if (TotalDiscountVal == 0) {
                    $('#DisplayDiscount' + value.Insurer.Insurer_ID).html("No Discount Available");
                }

                //For Displaying Message For Cover Not Selected
                var TotalCover = 0;
                TotalCover = Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.premium_div').children('.Premium').children('.PremiumBreakup').attr('electricalacessoriespremium')).replace(/,/g, '')) + Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.premium_div').children('.Premium').children('.PremiumBreakup').attr('nonelectricalaccessoriespremium').replace(/,/g, '')));
                if (Product_id == 10) {
                    if (TotalCover == 0) {
                        $("#DisplayCover" + InsID).html("No Cover Available");
                    }
                }
                if (Product_id == 1) {
                    TotalCover +=
                            Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.premium_div').children('.Premium').children('.PremiumBreakup').attr('legalliabilitypremiumforpaiddriver')).replace(/,/g, '')) +
                            Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.premium_div').children('.Premium').children('.PremiumBreakup').attr('personalaccidentcoverforpaiddriver')).replace(/,/g, '')) +
                            Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.premium_div').children('.Premium').children('.PremiumBreakup').attr('personalaccidentcoverforunammedpassenger')).replace(/,/g, '')) +
                            Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.premium_div').children('.Premium').children('.PremiumBreakup').attr('personalaccidentcoverfornamedpassenger')).replace(/,/g, '')) +
                            Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.premium_div').children('.Premium').children('.PremiumBreakup').attr('outstandingloancover')).replace(/,/g, ''));
                    if (TotalCover == 0) {
                        $("#DisplayCover" + InsID).html("No Cover Available");
                    }
                }
                //$('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('totalCover', TotalCover);

                if (InsID == 35) {
                    net_premium = net_premium - 195;
                    total_liability_premium = value.Premium_Breakup.liability['tp_final_premium'] - 195;
                }

                $('#divQuitList' + InsID + ' .PremiumBreakup').attr('TotalLiabilityPremium', total_liability_premium);
                $('#divQuitList' + InsID + ' .PremiumBreakup').attr('totalpremium', rupee_format(Math.round(net_premium)));

                if (addon_checked.length > 0) {
                    $($('#divQuitList' + InsID).children('.addon-selected')).show();
                    $(".trAddon").removeClass('hidden');
                } else {
                    $($('#divQuitList' + InsID).children('.addon-selected')).hide();
                    $(".trAddon").addClass('hidden');
                }
                if ($($('#divQuitList' + InsID).children('.addon-selected')).html() == "") {
                    $($('#divQuitList' + InsID).children('.addon-selected')).show().html("No Add-ons Selected").css({"text-align": "center"}, {"color": "rgb(29, 40, 85)"}, {"padding-top": "30px"});
                    $("#DisplayAddons" + InsID).show().html("No Add-ons Available");
                }

            }
        });

        if (IsLoad == true && AddOnSelectedList.length == 0) {
            $(".Basic").attr("checked", "true");
            NewAddOnSelectedList = $('#BundleEdit :radio:checked').map(function () {
                return this.id;
            }).get();
        } else {
            NewAddOnSelectedList = AddOnSelectedList;
        }

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
                if (PlanName == 'Basic') {
                    BasicCount++;
                    $(".Basic").attr("checked", "true");
                }
            }
        } else {
            $(".Basic").attr("checked", "true");
        } // Setting All Basic Plan Selected


        if (addon_checked.length == 0) {
            $($('.UlClass').children('.LiClass').children('.addon-selected')).hide();
        }
        if (BundleCount == 0) {
            IsBundlePresent = false;
            $("#BundleEdit").html('<div style="margin: 10px;text-align: center;">No Addon Bundle Plan Available</div>');
        }
        //$('.quoteboxparent').html($('.quoteboxmain').pbsort(false, "applied_addon"));
        set_minmax_premium();
    }
    $(".more_detail_addons").hide();

}

function set_minmax_premium() {
    ////;;
    var arr_prem = [];
    $(".quoteboxparent .quoteboxmain").each(function (index) {
        //if ($(this).children('.UlClass').children('.LiClass').children('.preloader').hasClass('hidden')) {
        var ind_prem = $(this).attr('premium') - 0;
        if (!(isNaN(ind_prem))) {
            arr_prem.push(ind_prem);
        }
        //}
    });

    $('.premium_min').html(Math.min.apply(null, arr_prem) == NaN ? 0 : Math.min.apply(null, arr_prem));
    $('.premium_max').html(Math.max.apply(null, arr_prem) == NaN ? 0 : Math.max.apply(null, arr_prem));
    //console.log(arr_prem, 'Min', Math.min.apply(null, arr_prem), 'Max', Math.max.apply(null, arr_prem));

    //CheckAddons();
}
function addon_filter() {

    //if(addon_checked.length<=0){swal({text: "Please select atleast one add-on."});
    //}else{
    var addon_checked = $('#Addons').find('input[type=checkbox]:checked');
    var addon_unchecked = $('#Addons').find("input:checkbox:not(:checked)");
    $('#QuoteLoader').show();
    $('#main_div').hide();
    $(".popup_overlay").slideUp();

    var obj = {}, objStandalone = {}, objPackage = {};
    obj["data_type"] = "addon";
    obj["search_reference_number"] = srn;
    obj["udid"] = udid;

    // Addon Standalone
    var addontext = $('.switch-outer').children('.active').text().trim();
    if (addontext == "WITH ADD-ON") {

        $.each(quotes.Response, function (index, value) {
            $.each(value.Addon_List, function (i, v) {

                objStandalone[i] = "yes"
            });

        });
    }
    //

    if (addon_checked.length > 0) {
        $.each(addon_checked, function (i, value) {
            objStandalone[value.id] = "yes";
        });
        $(".trAddon").removeClass('hidden');
    }
    if (addon_unchecked.length > 0) {
        $('.addon-selectedMobile').empty();
        $('.addon-selectedMobile').hide();
        $.each(addon_unchecked, function (i, value) {
            objStandalone[value.id] = "no";
        });
    }

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

    obj["addon_standalone"] = objStandalone;
    obj["addon_package"] = objPackage;
    obj["secret_key"] = "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW";
    obj["client_key"] = "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9";

    console.log(obj);
    console.log(JSON.stringify(obj));

    var obj_horizon_data = Horizon_Method_Convert("/quote/save_user_data", obj, "POST");

    $.ajax({
        type: 'POST',
        data: siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(obj),
        url: siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/save_user_data",
        contentType: 'application/json; charset=utf-8',
        success: function (response) {

            console.log('response', response);
            handle_addon_addition();
            $('#addonPopup').hide();
        },
        error: function (data) {
            console.log(data);
        }
    });
}



$('#menu').click(function (e) {
    $("#CityofRegitration").attr('disabled', false);
    $('#RegistrationNoError').html("").hide();
    $("#ErCityofRegitration").hide().html("");
    GLeadType = '';
    GLeadStatus = '';
    GLeadId = '';
    OrgRtoFastLane = '';
    getPrevInsList();
    $('.divlist').hide();
    $('#dashboardquotelist').show();
    $('.sticky_btn').show();
    searchFlag = false;
    QuoteShow();
    $('#tbl_quote_list').empty();
    GetQuoteList();
})

$(".inputIsu").keyup(function () {
    if (this.value.length == this.maxLength) {
        var $next = $(this).next('.inputIsu');
        if ($next.length)
            $(this).next('.inputIsu').focus();
        else
            $(this).blur();
    }
});
function GetFastLane(RegNo) {
    //
    $('#divDOPCRenew').show();
    $('#divDOPCNew').hide();
    var data1 = {
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
        "RegistrationNumber": RegNo,
        "product_id": Product_id,
        "ss_id": ss_id,
        "source": app_version

    }
    var obj_horizon_data = Horizon_Method_Convert("/quote/vehicle_info", data1, "POST");
    $.ajax({

        type: "POST",
        //url: "http://localhost:50111/CarInsuranceIndia/Fastlane",
        //data: JSON.stringify({ 'someNum': RegNo.toLowerCase() }),
        //data: JSON.stringify(obj_horizon_data['data']),								//UAT
        //url: obj_horizon_data['url'],												//UAT

        data: siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(data1),
        url: siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/vehicle_info",

        dataType: "json",
        traditional: true,
        contentType: "application/json; charset=utf-8",
        success: function (data, e) {
            //debugger;
            $('#QuoteLoader').hide();
            console.log(data);
            TP_CompSet("RENEW")
            if ((Product_Name == "Car" || Product_Name == "CV") && data.Variant_Id > 50000) { // Checking Invalid Bike Registration Number
                FlagRegNoValid = 1;
            }
            if (Product_Name == "Bike" && data.Variant_Id < 50000) { // Checking Invalid Car Registration Number
                FlagRegNoValid = 1;
            }
            if (data.hasOwnProperty('Product_Id') && data.Product_Id > 0 && Product_id != data.Product_Id && data.status == "Success") {
                var Fastlane_ProducName = "Car"
                if (data.Product_Id == 10) {
                    Fastlane_ProducName = "Bike";
                }
                $("#fastlane_prod_name").text(Fastlane_ProducName);
                $("#fastlane_popup").modal('show');
            } else if (data != "" && FlagRegNoValid != 1 && data.Error_Message == "") {
                $("#FastlaneMsg").text('Please Verify Your Details Before Proceeding').show();
                $("#TwoWheelerType").val("renew");
                if (data.Make_Name == "" || data.Make_Name == null || data.Model_Name == "" || data.Model_Name == null) {
                    $("#ErMakeModel").show().addClass('DetailsError');
                } else {
                    varcarmodel = data.Model_Name;
                    $("#MakeName").val(data.Make_Name);

                    ModelSelected = data.Model_Name;
                    $("#Model_Name").val(data.Model_Name);
                    $("#MakeModel").val(data.Make_Name + ', ' + data.Model_Name);
                    $("#MakeModel").addClass('used');
                    $("#MakeModelID").val(data.Model_ID);
                    //if (Product_Name == "Car") { CallFuelOnModelSelect(data.Model_Name); }
                }

                if (data.Fuel_Type != null && data.Fuel_Type != "") {
                    FuelSelected = (data.Fuel_Type).toUpperCase();
                    //CallFuelOnModelSelect(data.Model_ID);
                    if (Product_Name == "Car" || Product_Name == "CV") {
                        CallFuelOnModelSelect(data.Model_ID);
                    }
                    //$("#FuelType").val(data.Fuel_Type);
                    //$('#FuelType :selected').text(data.Fuel_Type);
                    //$("#FuelSelected").val(data.Fuel_Type);
                } else {
                    $("#ErFuelType").show().addClass('DetailsError');
                }

                if (data.Variant_Id != null && data.Variant_Id != 0 && data.Variant_Id != "0" && data.Variant_Id >= 0) {

                    VariantIDSelected = data.Variant_Id;
                    $("#VariantID").val(VariantIDSelected).removeClass('Unselected');
                    $('.variantHighlight').show();
                    if (Product_Name == "Car" || Product_Name == "CV") {
                        $("#hdVariantID").val(VariantIDSelected);

                        if (data.Model_Name != null && data.Model_Name != "" && data.Fuel_Type != null && data.Fuel_Type != "") {
                            $("#MakeModelID").val(data.Model_ID);
                            //CallVariantOnModelNFuelSelect(data.Model_Name, data.Fuel_Type); // Temporary Change For Variant List on 16-02-2018
                            CallVariantOnModelSelect(data.Model_ID);
                            //$("#VariantID").val(VariantIDSelected);
                        } else {
                            $("#ErVariantID").show().addClass('DetailsError');
                        }
                    }
                    if (Product_Name == "Bike") {
                        $("#TwoWheelerVariantID").val(VariantIDSelected);
                        //Here data.Model_ID != null Have to Check
                        if (data.Model_Name != null && data.Model_Name != "") {
                            $("#MakeModelID").val(data.Model_ID);
                            CallVariantOnModelSelect(data.Model_ID);
                            ///$("#VariantID").val(VariantIDSelected);
                        } else {
                            $("#ErVariantID").show().addClass('DetailsError');
                        }
                    }
                } else {
                    $("#ErVariantID").show().addClass('DetailsError');
                    $("#VariantID").empty();
                    $("#VariantID").append('<option value="0">Select Variant</option>');
                    $('label[for=VariantID], input#VariantID').hide();
                }

                if (data.RTO_Code != null && data.RTO_Code != "") {
                    strcity = RegNo.slice(0, 4);
                    strcity = "(" + strcity + ") " + data.RTO_Name;
                    $("#CityofRegitration").val(strcity);
                    $('#CityofRegitrationID').val(data.RTO_Code);
                    //$("#spnCityofRegitration").text(data.CityofRegitration);
                } else {
                    $("#ErCityofRegitration").show().addClass('DetailsError');
                }

                $('#DOPCRenew').bootstrapMaterialDatePicker({
                    time: false, clearButton: true, format: 'DD-MM-YYYY',
                    minDate: moment().subtract(15, 'years'), // 15 Years Before The Current Day // moment().subtract(15, 'y'),
                    maxDate: moment().subtract(6, 'months'), // 6 Months Before The Current Day
                    currentDate: moment().subtract(12, 'months'), // 1 Year Before The Current Day
                    onSelect: function () {
                        myfunction();
                    }
                });

                $("#PolicyExpiryDate").bootstrapMaterialDatePicker(
                        {
                            time: false, clearButton: true, format: 'DD-MM-YYYY',
                            minDate: ((Product_Name == "Bike" || Product_Name == "Car") ? moment().subtract(180, 'days') : moment()), // (180 Days Before The Current Day) Or (Current Day)
                            maxDate: moment().add(60, 'days'), // 180 Days After The Current Day
                            //minDate: moment().subtract(120, 'days'),  //(Product_Name == "Bike" ? moment().subtract(180, 'days') : moment()), // (180 Days Before From The Current Day) : (Current Day)
                            //maxDate: moment().add(60, 'days'), // 60 Days From The Current Day
                            defaultDate: moment(),
                            onselect: function () {
                                myfunction1();
                            }
                        });

                //Check Whether Year Valid Or Not // For Format FEB2014
                if (data.Manufacture_Year != "NULL" && data.Manufacture_Year != "" && data.Manufacture_Year != null && data.Manufacture_Year != "0") // Year Validate
                {
                    var CurMonth = 1; // new Date().getMonth() + 1; //
                    if (CurMonth < 10) {
                        CurMonth = "0" + CurMonth;
                    }

                    var RegDate = data.Registration_Date.split('/');

                    if (data.Manufacture_Year != null) {
                        //var Month = GetMonthNum(RegDate[1])

                        $("#ManufactureDate").val(RegDate[1] + "-" + data.Manufacture_Year);
                        $('#ManufactureYear').val(data.Manufacture_Year);
                        $('#ManufactureMonth').val(RegDate[1]);
                    }

                    VarDateofPurchaseofCar = data.Registration_Date;
                    var today = new Date();
                    var month = today.getMonth() + 1;
                    var day = today.getDate();
                    if (day < 10) {
                        day = "0" + day;
                    }
                    if (month < 10) {
                        month = "0" + month;
                    }
                    today = day + '-' + month + '-' + today.getFullYear();

                    $("#PolicyExpiryDate").val(today);
                } else {
                    $("#ErPolicyExpiryDate, #ErDateofPurchaseofCar, #ErManufactureDate").show().addClass('DetailsError');
                }

                var NewRegDate = data.Registration_Date.replace(/\//g, '-');


                if (data.Registration_Date != null && data.Registration_Date != "") {
                    $("#DateofPurchaseofCar, #DOPCRenew").val(NewRegDate);
                } else {
                    $("#DateofPurchaseofCar, #DOPCRenew").val("");
                    $("#ErDateofPurchaseofCar, #ErDOPCRenew").show().addClass('DetailsError');
                }

                //$('#DateofPurchaseofCar').bootstrapMaterialDatePicker(
                //{
                //    time: false, clearButton: true, format: 'DD-MM-YYYY',
                //    minDate: moment().subtract(15, 'years'), // 15 Years Before The Current Day // moment().subtract(15, 'y'),
                //    maxDate: moment().subtract(6, 'months'),// 6 Months Before The Current Day
                //    currentDate: moment().subtract(12, 'months'), // 1 Year Before The Current Day
                //    onSelect: function () { myfunction(); }
                //});
                $('#TPCompPlan').val("1CH_0TP");
                $("#PolicyExpiryDate").datepicker("refresh");
                $("#DOPCRenew").addClass('used');
                $("#CityofRegitration").addClass('used');
                $("#PolicyExpiryDate").addClass('used');
                $("#ManufactureDate").addClass('used');
                $("#RegistrationNo").val(RegNo);
                //CalDifference();
                //SetInputValue();
                $('#InputForm').show();
                $('.basicDetails').hide();
                $('#VehicleType').val('renew');
                $('.footerDiv').show();
                $(".policyType").show();

            } else if (FlagRegNoValid == 1 && data.VariantID != 0 && data.ErrorMessage == "") {
                $("#PreLoader").hide();
                var EMsg = "Please Enter Valid " + Product_Name + " Registration Number."
                $("#RegistrationNoError").show().html(EMsg);
                return false;
                //$(".back").click();
            } else {
                $("#FastlaneMsg").text('Kindly enter the vehicle details manually').show();
                $('#InputForm').show();
                $('.basicDetails').hide();
                $('#VehicleType').val('renew');
                $('.footerDiv').show();
                $(".policyType").show();

                IsFastLane = "False";
                //$('.divlist').show();
                //$('#dashboardquotelist').hide();
                validationMsg = "Your Vehicle Details Not Found. Please Enter Manually";
                $("#MakeModel").val("");
                $("#MakeModelID").val(0);

                if (RTO_count > 1) {
                    console.log(RtoList_updated);
                    $("#CityofRegitration").attr('disabled', false);
                    RtoList = RtoList_updated;
                } else if (RTO_count === 1) {
                    $('#CityofRegitration').val("(" + RtoList_updated[0].VehicleCity_RTOCode.toString() + ") " + RtoList_updated[0].RTO_City.toString());
                    $('#CityofRegitrationID').val(RtoList_updated[0].VehicleCity_Id);
                    $('#CityofRegitration').addClass('used');
                    $("#ErCityofRegitration").hide().html("");
                    $("#CityofRegitration").attr('disabled', true);
                }
                //$('#VehicleDetailsError').html(validationMsg).slideUp().slideDown();
                //$('#VehicleDetailsError').addClass('ErrorMessage1');
                // SetDefaultValue();
                TwoWheelerTypeRenew();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //SetDefaultValue();
            TwoWheelerTypeRenew();
        }
    });
}

function Quote_share() {
    $('.divlist').hide();
    $('.shareQuote').show();
}
function shareQuote() {
    console.log('whatsapp://send?text=' + window.location.href);
    $('#whatsapp').attr('href', 'whatsapp://send?text=' + window.location.href);
}
function Breakupinfo(str, divId) {
    if (str === 'buy') {
        if (quoteMode === "ShowLERPPopup" || (utm_source != undefined && utm_campaign != undefined && utm_medium != undefined) && IsTwiceRenewal != true) {
            $(".LoadPopup").show();
        } else {
            $("#redirect_Btn").show();
            var ARN = $('#' + divId + '  .quote-with-addon-buy .PremiumBreakup .PremiumBreakup').attr('arn')
            $("#hdn_arn").val(ARN);
            $('#VehicleModal').show();
        }
    } else if (str === 'premium') {
        $("#redirect_Btn").hide();
        $('#VehicleModal').show();
    }
}
$('.cross-w').click(function (e) {
    $('#VehicleModal').hide();
});

function prizewise_sort() {

    //prizewise sort in ascending order all divs(start)
    var prizewise_sorted_order = $(".applyAddon").sort(function (a, b) {
        return parseInt($(a).attr('premium')) - parseInt($(b).attr('premium'));
    });

    $(".quoteboxparent").html(prizewise_sorted_order);
    //prizewise sort in ascending order all divs(end)
}

$('#addonChecked').change(function () {
    if ($(this).is(":checked")) {

        $(".checkBoxClass").prop('checked', true);
        $('#SelectAllAddons').prop('checked', true);
        AllAddons(true);
    } else {
        $(".checkBoxClass").prop('checked', false);
        $('#SelectAllAddons').prop('checked', false);
        AllAddons(false);
    }

    prizewise_sort();
    $('#textbox1').val($(this).is(':checked'));
});
$(document).on('click', '#SelectAllAddons', function () {
    $('#Addons').find('input[type=checkbox]').click();
    if ($(this).is(':checked') == true) {
        $('#Addons').find('input[type=checkbox]').prop('checked', true);
        $('#addonChecked').prop('checked', true)
    } else {
        $('#Addons').find('input[type=checkbox]').prop('checked', false);
        $('#addonChecked').prop('checked', false)
    }
});


$(document).on('click', ".checkBoxClass", function () {
    if ($(".checkBoxClass:checked").length > 0) {
        $('#addonChecked').prop('checked', true);
    } else {
        $('#addonChecked').prop('checked', false);
    }
});

function CheckPersonalAccidentCoverforDriver(value) {
    if (value == "Yes") {
        $('#PersonalAccidentCoverforDriver').val('Yes');
        $("#PD1").addClass('active');
        $("#PD2").removeClass('active');
    } else if (value == "No") {
        $('#PersonalAccidentCoverforDriver').val('No');
        $("#PD2").addClass('active');
        $("#PD1").removeClass('active');
    }
}
function CheckPaidDriverPersonalAccidentCover(value) {
    if (value == "Yes") {
        $('#PaidDriverPersonalAccidentCover').val('Yes');
        $("#PDPersonal1").addClass('active');
        $("#PDPersonal2").removeClass('active');
    } else if (value == "No") {
        $('#PaidDriverPersonalAccidentCover').val('No');
        $("#PDPersonal2").addClass('active');
        $("#PDPersonal1").removeClass('active');
    }
}

$("#lblPolicyExist-Yes").click(function () {

    IsPolicyExistFlag = "yes";
    $(".PolicyExist").show();
    $(".PolicyExpiryDate").show();
    $(".PreviousInsurer").show();
    $("#lblPolicyExist-Yes").removeClass('btn-UnSelected btnError').addClass('btn-primarySelected active');
    $("#lblPolicyExist-No").removeClass('btn-primarySelected btnError active').addClass('btn-UnSelected');
    $("#ErPolicyExist").hide().html("");//mg01-02-2022
    if (is_TP == "no") {
        $('.NOTP').show();
    }

    var arr = $("#PolicyExpiryDate").val().split('-');
    if (arr != "" && arr != null && is_TP == "no") {
        var Days = (((new Date(Date.now())).getTime()) - ((new Date(arr[1] + "-" + arr[0] + "-" + arr[2])).getTime())) / (1000 * 60 * 60 * 24);

        if (Math.floor(Days) > 90) {

            $("#divNoClaimBonusPercent, .divNoClaimBonusPercent").hide();
            $('#HaveNCBCertificate').val("No");
            $("#NoClaimBonusPercent").val("0");
        } else {

            $("#divNoClaimBonusPercent, .divNoClaimBonusPercent").show();
        }
    }


});
$("#lblPolicyExist-No").click(function () {
    if (is_TP == "no" && Product_id != 10) {
        $('.AlertOvl').show();
        $('.alert_container').text("Your Policy will not issue instantly. It will issue after inspection.");
        $('.ok_btn').click(function () {
            $('.AlertOvl').hide();
        });

    }

    IsPolicyExistFlag = "no";
    $(".PolicyExist").hide();
    $("#lblPolicyExist-Yes").removeClass('btn-primarySelected btnError active').addClass('btn-UnSelected');
    $("#lblPolicyExist-No").removeClass('btn-UnSelected btnError').addClass('btn-primarySelected active');
    $(".PreviousInsurer").hide();
    $('.PolicyExpiryDate').hide();
    $('.NOTP').hide();
    $("#PreviousInsurer").val($("#PreviousInsurer option:first").val());
    $("#PolicyExpiryDate").val('');
    $("#ErPolicyExist").hide().html("");//mg01-02-2022
});

/*$("#isFinanced-Yes").click(function () {
 IsFinancedFlag = 'Yes';
 $("#isFinanced-Yes").removeClass('btn-UnSelected btnError').addClass('btn-primarySelected active');
 $("#isFinanced-No").removeClass('btn-primarySelected btnError active').addClass('btn-UnSelected');
 $("#div_finance_amount_and_name").show();
 });
 
 $("#isFinanced-No").click(function () {
 IsFinancedFlag = 'No';
 $("#isFinanced-No").removeClass('btn-UnSelected btnError').addClass('btn-primarySelected active');
 $("#isFinanced-Yes").removeClass('btn-primarySelected btnError active').addClass('btn-UnSelected');
 $("#div_finance_amount_and_name").hide();
 $('#finance_amount').val('');
 });*/


function ShowVehInsSubType(VISTCode) {
    var InsText = "";
    switch (VISTCode) {
        case '0CH_1TP':
            InsText = "T.P. Only For 1 Yr";
            break;
        case '0CH_3TP':
            InsText = "T.P. Only For 3 Yrs";
            break;
        case '0CH_5TP':
            InsText = "T.P. Only For 5 Yrs";
            break;

            //case '1CH_0TP': InsText = "Comprehensive For 1 Yr"; break;
            //case '3CH_0TP': InsText = "Comprehensive For 3 Yrs"; break;
            //case '5CH_0TP': InsText = "Comprehensive For 5 Yrs"; break;

        case '1CH_2TP':
            InsText = "Comprehensive For 1 Yr + T.P. For 2 Yrs";
            break;
            //case '1CH_4TP': InsText = "Comprehensive For 1 Yr + T.P. For 4 Yrs"; break;

        case '1CH_1TP':
            InsText = "O.D. For 1 Yr + T.P. For 1 Yr";
            break;

        case '1CH_0TP':
            InsText = "O.D. + T.P. For 1 Yr";
            break;
        case '2CH_0TP':
            InsText = "O.D. + T.P. For 2 Yrs";
            break;
        case '3CH_0TP':
            InsText = "O.D. + T.P. For 3 Yrs";
            break;

        case '1CH_4TP':
            InsText = "O.D. For 1 Yr + T.P. For 5 Yrs";
            break;
        case '5CH_0TP':
            InsText = "O.D. + T.P. For 5 Yrs";
            break;
        case '1OD_0TP':
            InsText = "O.D. Only For 1 Yr";
            break;
    }
    return InsText;
}

$('#ExpectedIDV').keypress(function () {
    return this.value.length < 7;
});
$('#ElectricalAccessories').keypress(function () {
    return this.value.length < 5;
});
$('#NonElectricalAccessories').keypress(function () {
    return this.value.length < 5;
});

$('#ExpectedIDV').focusout(function () {

    if (parseInt($("#ExpectedIDV").val()) != 0) {
        if (parseInt($("#ExpectedIDV").val()) < parseInt($('#expected_idv').attr("min")) || parseInt($("#ExpectedIDV").val()) > parseInt($('#expected_idv').attr("max")))
        {
            $("#ExpectedIDV").addClass('errorClass1');
            $(".spnExpectedIDV").addClass('ErrorMessage1');
        } else {
            $("#ExpectedIDV").removeClass('errorClass1');
            $(".spnExpectedIDV").removeClass('ErrorMessage1');
        }
    } else {
        $("#ExpectedIDV").removeClass('errorClass1');
        $(".spnExpectedIDV").removeClass('ErrorMessage1');
    }
});

function CheckIsTPPD(value) {
    if (value == "Yes") {
        $("#IsTPPD").val("yes").text("Yes");
        $("#IsTPPD2").addClass('active');
        $("#IsTPPD1").removeClass('active');
    } else if (value == "No") {
        $("#IsTPPD").val("no").text("No");
        $("#IsTPPD1").addClass('active');
        $("#IsTPPD2").removeClass('active');
    }
}

function CheckSort(filter1, filter2) {


    var ascending = (filter1 == "low-high") ? true : false;
    //var parameter = (filter2 == "1") ? "premium" : (filter2 == "2") ? "idv" : "fair_price";
    var parameter = (filter2 == "1") ? "premium" : (filter2 == "2") ? "idv" : "pref";
    var divQts = $('.quoteboxmain').pbsort(ascending, parameter);
    $('.quoteboxparent').html(divQts);
    console.log("Sorting:" + ascending + "_" + parameter);
    $(".popup_overlay").slideUp();
}

$(document).ready(function () {
    $(".more_detail_addons").hide();
    siteURL = window.location.href;
    stringparam();
    Set_VoluntaryValue();

    if (app_version == '2.4.4' && (Product_id == 1 || Product_id == 10)) {
        app_popup();//mg1
    }
    ss_id = getUrlVars()['ss_id'];
    if ((ss_id !== "" && ss_id !== undefined && ss_id !== "0")) {
        $.get('https://ipinfo.io/json', function (data) {
            ip_address = data.ip;
            ip_city_state = data.city + "_" + data.region;
            geo_lat = data.loc.split(",")[0];
            geo_long = data.loc.split(",")[1];
            console.log("location", ip_city_state);
            save_app_visitor();
        });
    }
    if (getUrlVars()['app_version'] === 'highway_delite_customer') {
        if (getUrlVars()['hd_registration_no'] != "" && getUrlVars()['hd_registration_no'] != undefined && getUrlVars()['hd_registration_no'] != null) {
            let vehicle_reg_arr = getUrlVars()['hd_registration_no'].split('-');
            $('#Reg1').val(vehicle_reg_arr[0]);
            $('#Reg2').val(vehicle_reg_arr[1]);
            $('#Reg3').val(vehicle_reg_arr[2]);
            $('#Reg4').val(vehicle_reg_arr[3]);
        }
    }

    $('#Reg3').keypress(function (e) {
        var regex = new RegExp("^[a-zA-Z0-9]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            return true;
        }

        e.preventDefault();
        return false;
    });

    if (VehicleType == null || VehicleType == '') {
        isPostBack = false;
    } else {
        isPostBack = true;
        if (VehicleType == "NEW") {
            TwoWheelerTypeNew();
        }
        if (VehicleType == "RENEW") {
            TwoWheelerTypeRenew();
        }
    }
    var URL_SRN = getUrlVars()["SRN"];
    if (URL_SRN != null && URL_SRN != '' && URL_SRN != undefined) {
        var mainUrl = GetUrl() + "/quote/premium_list_db";
        var str1 = {
            "search_reference_number": URL_SRN,
            "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
            "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9"
        };
        var obj_horizon_data = Horizon_Method_Convert("/quote/premium_list_db", str1, "POST");
        $.ajax({
            type: "POST",
            data: siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(str1),
            url: siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/premium_list_db",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (data) {
                oneclickRenewal(data);
            }, error: function (result) {
            }
        });
    }
});


var ss_id, fba_id, ip_address, app_version, mac_address, mobile_no;
var pageIndex = 1;
var pageCount;
var iScrollPos = 0;
var isSearchCheck = false;
var quoteSearch_url = "";
var appSearch_url = "";
var sellSearch_url = "";




function QuoteShow() {
    $(".qlist #QUOTE_TAB").addClass('Active')
    $(".quoteList_container").show();
    $(".appquote_list").hide();
    $(".sell_list").hide();
    $(".renewal_list").hide();
    $(".qlist #RENEWAL_TAB").removeClass('Active');
}

function ApplicationShow() {
    $(".qlist #APPLICATION_TAB").addClass('Active')
    $(".quoteList_container").hide();
    $(".appquote_list").show();
    $(".sell_list").hide();
    $(".renewal_list").hide();
}

function SellShow() {
    $(".qlist #SELL_TAB").addClass('Active')
    $(".quoteList_container").hide();
    $(".appquote_list").hide();
    $(".sell_list").show();
    $(".renewal_list").hide();
}

function RenewalShow() {
    $(".qlist #RENEWAL_TAB").addClass('Active')
    $(".quoteList_container").hide();
    $(".appquote_list").hide();
    $(".sell_list").hide();
    $(".renewal_list").show();
}

function Reset() {
    $('#tbl_quote_list').empty();
    $('#renewaltbl_quote_list').empty();
    $('.app_mainlist').empty();
    $('.sellDiv').empty();
    quoteSearch_url = "";
    appSearch_url = "";
    sellSearch_url = "";
    GetQuoteList();
    GetApplication();
    GetSellList();
    GetRenewalList();
}

function app_popup() {
    let html = `<br>Yay, PolicyBoss Pro Now Live!`;
    html += `<br><br><p>PolicyBoss Pro, the new age POSP app from PolicyBoss team is now live on Google Play Store.`;
    html += `<br><br>To install Policyboss Pro App, kindly copy below bitly url and open in chrome browser</p><br><p style="background-color:yellow;">https://bit.ly/31VVJb2</p><br>Team Marketing & IT<br>PolicyBoss.com`;

    document.getElementById("alert_container").innerHTML = html;
    $('.ok_btn').html("Continue using Current App").css("margin-left", "15%");
    $('.AlertOvl').show();
    $('.ok_btn').click(function () {
        $('.AlertOvl').hide();
    });
}
$(document).ready(function () {
    stringparam();
    //GetQuoteList();

    $("#SearchQuote").val(0);
    //  $("#SearchQuoteInput").hide();
    $(".FormFields").focus(function () {
        $('html, body').animate({scrollTop: $(document).height()}, 1200);
    });

    $('.qlist div').click(function (e) {
        pageIndex = 1;
        $('.sticky_btn').show();
        $('#QuoteLoader').show();
        $("#SearchQuote").val(0);
        $('.sticky_btn').show();
        //$("#SearchQuoteInput").hide();
        $("#SearchQuoteInput").css('visibility', 'hidden');

        $('.qlist div').removeClass("Active");
        //$(this).addClass("Active");


        if ($(this).text() == 'APPLICATION') {
            activeTab = "APPLICATION";
            $(".motor_maindiv").children('.menuBox').hide();
            ApplicationShow();

            // Call when no search
            if (!searchFlag) {
                $('.app_mainlist').empty();
                appSearch_url = "";
                GetApplication();
            }

        } else if ($(this).text() == 'QUOTE') {
            activeTab = "SEARCH";

            $(".appquote_list").children('.menuBox').hide();
            QuoteShow();

            // Call when no search
            if (!searchFlag) {
                $('#tbl_quote_list').empty();
                quoteSearch_url = "";
                GetQuoteList();
            }
        } else if ($(this).text() == 'COMPLETE') {
            SellShow();
            activeTab = "SELL";
            if (!searchFlag) {
                $('.sellDiv').empty();
                sellSearch_url = "";
                GetSellList();
            }
        } else if ($(this).text() == 'LEAD') {
            activeTab = "LEAD";
            $(".appquote_list").children('.menuBox').hide();
            $('.sticky_btn').hide();
            $('.divlist').hide();
            $('#dashboardquotelist').show();
            searchFlag = false;
            RenewalShow();
            // Call when no search
            if (!searchFlag) {
                $('#renewaltbl_quote_list').empty();
                quoteSearch_url = "";
                GetRenewalList();
            }
        }


    });
    $('.crossSell_popup').on('click', function () {
        $('.crossSell_popup').hide();
    });

});

function GetQuoteList() {
    //
    //var url = GetUrl()+"/user_datas/quicklist/10/SEARCH/" + ss_id + "/" + fba_id + "/" + pageIndex + "/" + mobile_no;     

    if (sub_fba_id == "" || sub_fba_id == null) {
        f_sub_fba_id = 0
    } else if (sub_fba_id != "") {
        f_sub_fba_id = sub_fba_id;
    }

    var url, method_name;
    if (quoteSearch_url == "") {
        url = GetUrl() + "/user_datas/quicklist/" + Product_id + "/SEARCH/" + ss_id + "/" + fba_id + "/" + pageIndex + "/" + mobile_no + "/" + f_sub_fba_id;  					//local		
        method_name = "/user_datas/quicklist/" + Product_id + "/SEARCH/" + ss_id + "/" + fba_id + "/" + pageIndex + "/" + mobile_no + "/" + f_sub_fba_id;
    } else {
        //url = quoteSearch_url;
        method_name = quoteSearch_url;
    }


    $.ajax({
        type: "GET",
        data: siteURL.indexOf('https') == 0 ? {'method_name': method_name} : "",
        url: siteURL.indexOf('https') == 0 ? GeteditUrl() + '/horizon-method.php' : url,
        dataType: "json",
        success: function (data) {
            console.log(data);
            if (data.length > 0) {
                for (var i in data) {
                    $('#tbl_quote_list').append('<tr class="quoteDiv" id="tr_lst" srn="' + data[i].SRN + '" udid="' + data[i].User_Data_Id + '">' +
                            '<td><div class="ApplicantName" >' + data[i].Customer_Name + '</div>' +
                            '<div class="contentTxt"><span class="crn_span"></div>' +
                            '</td>' +
                            '<td class="" style="text-align:center">' +
                            '<div class="contentTxt crn">CRN No.</div>' +
                            '<div class="desc crn">' + data[i].CRN + '</div>' +
                            '</td>' +
                            '<td  style="text-align:center"><div class="contentTxt quote_date">QUOTE DATE</div><div class="desc quote_date">' + data[i].Quote_Date_Mobile + '</div></td>' +
                            '<td class="" style="text-align:center" id="Infopopup">' +
                            '<i class="fa fa-info-circle" id="info_' + data[i].SRN + '" aria-hidden="true" style="padding:10px 0px;font-size:20px"></i>' +
                            '</td>' +
                            '</tr>'
                            )
                    var $menubox = $(".motor_maindiv").children('.menuBox')
                    $(".mb").click(function (e) {
                        var mbtoppos = $(this).position().top + (-13) + "px";
                        //console.log(mbtoppos);
                        if ($menubox.is(":visible")) {

                            $menubox.hide()
                            $menubox.slideDown();
                        }
                        $menubox.slideDown().css({"top": mbtoppos});
                    });
                    $('#info_' + data[i].SRN).click(function (e) {
                        var SRN = $(this).parent().parent().attr('srn');
                        var udid = SRN.split('_')[1];
                        SRN = SRN.split('_')[0];
                        //vehicleinfo(SRN);
                        vehicleinfo(SRN, udid);
                    });

                    $("#CallFuncId").click(function (e) {

                        //$('a[href*="tel:+91"]' + data[i].Customer_Mobil);
                        $(".CallFuncClass").attr('href', 'tel:' + data[i].Customer_Mobile);
                    });

                    $("#SmsFuncId").click(function (e) {
                        //$('a[href*="tel:+91"]' + data[i].Customer_Mobil);
                        $(".SmsFuncClass").attr('href', 'sms:' + data[i].Customer_Mobile);
                    });
                }
                $(".ApplicantName,.crn,.quote_date").click(function (e) {
                    SRN = $(this).parent().parent().attr('srn');
                    var udid = $(this).parent().parent().attr('udid');
                    $('.maininput').hide();
                    $('.quotelist').show();
                    $('.divlist').show();
                    $('#dashboardquotelist').hide();
                    $('.loading').show();
                    $('#Property').removeClass('active in');
                    $('#Appl').addClass('active in');
                    Get_Search_Summary();
                    Get_Saved_Data();
                    $('#addonChecked').prop('checked', false);
                    $('#SelectAllAddons').prop('checked', false);

                    //window.location.href = './quotepage.html?SRN=' + SRN + '&client_id=2';

                });
            } else {
                var htmllist = $("#tbl_quote_list").html();
                if (htmllist.length == 0) {
                    $('#tbl_quote_list').append("<div style ='text-align:center;font-weight: bold;font-size: 18px;'>No Record found</div>");
                }
            }
            $('#QuoteLoader').hide();

        },
        error: function (result) {

        }
    });

}



// '<td style="width:21%"><div class="ApplicantName" style="align:center">IDV</div> <div  class="IDV">' + data[i].Sum_Insured + ' </div> </td>' +
// '<td style="width:32%"><div class=""><div class="ApplicantName">Make & Model</div><div class="make_model">BAJAJ PULSAR 180 CC</div></div></td>' +  




function GeteditUrl() {
    var url = window.location.href;
    //alert(url.includes("health"));
    var newurl;
    newurl = "http://qa.policyboss.com";
    if (url.includes("localhost")) {
        newurl = "http://localhost:3000";
    } else if (url.includes("qa")) {
        newurl = "http://qa.policyboss.com";
    } else if (url.includes("www") || url.includes("origin-cdnh") || url.includes("cloudfront")) {
        newurl = "https://www.policyboss.com";
    }
    return newurl;
}


function Redirect(input) {
    //
    if (input == "QUOTE") {
        $(".quoteList_container").show();
        $(".searchbar").show();
        $(".appquote_list").hide();
    } else if (input == "APPLICATION") {
        $(".quoteList_container").hide();
        $(".searchbar").hide();
        $(".appquote_list").show();
    }

}

// Get Application Data 
function GetApplication() {
    var const_insurerlogo = {
        "21": "apollo_munich.png",
        "42": "aditya_birla.png",
        "9": "reliance.png",
        "34": "religare_health.png",
        "26": "star_health.png",
        "38": "Cigna.png",
        "33": "lvgi.png",
        "6": "ICICI_Lombard.png",
        "12": "new_india.png",
        "44": "Go_Digit.png",
        "45": "Acko_General.png",
        "19": "universal_sompo.png",
        "1": "BajajAllianzGeneral.png",
        "4": "Future_Generali_General.png",
        "7": "Iffco_Tokio_General.png",
        "10": "royal.png",
        "11": "tata_aig.png",
        "5": "hdfc.png",
        "14": "United.png",
        "2": "Bharti_Axa_General.png",

        "46": "edelweiss.png",
        "47": "dhfl.png",
        "41": "Kotak.png",
        "35": "magma.png",
        "13": "oriental.png",
        "16": "raheja.png",
        "17": "SBI_General.png",
        "30": "kotak.png",
        "18": "shriram.png"

    };
    //var url = GetUrl()+"/user_datas/quicklist/10/APPLICATION/" + ss_id + "/" + fba_id + "/" + pageIndex + "/" + mobile_no

    if (sub_fba_id == "" || sub_fba_id == null) {
        f_sub_fba_id = 0
    } else if (sub_fba_id != "") {
        f_sub_fba_id = sub_fba_id;
    }

    var url, method_name;
    if (appSearch_url == "") {
        url = GetUrl() + "/user_datas/quicklist/" + Product_id + "/APPLICATION/" + ss_id + "/" + fba_id + "/" + pageIndex + "/" + mobile_no + "/" + f_sub_fba_id;
        method_name = "/user_datas/quicklist/" + Product_id + "/APPLICATION/" + ss_id + "/" + fba_id + "/" + pageIndex + "/" + mobile_no + "/" + f_sub_fba_id;
    } else {
        //url = appSearch_url;
        method_name = appSearch_url;
    }

    $.ajax({
        type: "GET",
        data: siteURL.indexOf('https') == 0 ? {'method_name': method_name} : "",
        url: siteURL.indexOf('https') == 0 ? GeteditUrl() + '/horizon-method.php' : url,
        dataType: "json",
        success: function (data) {
            console.log(data);
            if (data.length > 0) {
                for (var i in data) {
                    $(".app_mainlist").append("<div class='app_quoteDiv' srn='" + data[i].SRN + "' id='app_quote_id'" + data[i].CRN + ">" + "<div class='ins_logo'>" + "<img src='http://di8vsggi846z0.cloudfront.net/fmweb/Images/insurer_logo_fm/" + const_insurerlogo[data[i].Insurer] + "' class='img-responsive'>" + "</div>" + "<div class='content_container'>" + "<div class='con parta'>" + "<div class='uname'>" + data[i].Customer_Name + "</div>" + "<div class='menu' id='info_" + data[i].SRN + "'><i class='fa fa-info-circle'  aria-hidden='true' style='padding:10px 0px;font-size:20px'></i></div>" + "</div>" + "<div class='con partb'>" + "<div class='app_num'>" + "<div class='title'>APP NUMBER</div>" + "<div class='num'>" + data[i].CRN + "</div>" + "</div>" + "<div class='app_status'>" + "<div class='title'>APP STATUS</div>" + "<div class='progress'>" + "<div class='progress-bar' role='progressbar' aria-valuenow='70' aria-valuemin='0' aria-valuemax='100' style='width:" + data[i].Progress + "%'>" + data[i].Progress + "</div>" + "</div>" + "</div>" + "</div>" + "<div class='con partc'>" + "<div class='SUM_a'>" + "<div class='title'>IDV</div>" + data[i].Sum_Insured + "</div>" + "<div class='a_date'>" + "<div class='title'>APP DATE</div>" + data[i].Quote_Date_Mobile + "</div>" + "</div>" + "<input type='hidden' id='hd_app_SRN_" + data[i].CRN + "' value='" + data[i].SRN + "'/>" + "<input type='hidden' id='hd_app_Insurer' value='" + data[i].Insurer + "'/>" + "</div>" + "</div>");
                    $(".amb").click(function (e) {

                        var mbtoppos = $(this).position().top + "px";
                        //console.log(mbtoppimos);
                        var $menubox = $(".appquote_list").children('.menuBox')
                        if ($menubox.is(":visible")) {

                            $menubox.hide()
                            $menubox.slideDown()
                        }
                        $menubox.slideDown().css({
                            "top": mbtoppos,

                        });
                    });

                    $('#info_' + data[i].SRN).click(function (e) {

                        var SRN = $(this).parent().parent().parent().attr('SRN');
                        var udid = SRN.split('_')[1];
                        SRN = SRN.split('_')[0];
                        //vehicleinfo(SRN);
                        vehicleinfo(SRN, udid);
                    });
                }
            } else {

                var htmllist = $(".app_mainlist").html();
                if (htmllist.length == 0) {
                    $('.app_mainlist').append("<div style ='text-align:center;font-weight: bold;font-size: 18px;'>No Record found</div>")
                }
            }
            $('#QuoteLoader').hide();
        },
        error: function (result) {
            console.log(result)
        }
    });

}
function info(i) {

    var SRN = $('#hd_app_SRN_' + i).val();
    var udid = SRN.split('_')[1];
    SRN = SRN.split('_')[0];
    //vehicleinfo(SRN);
    vehicleinfo(SRN, udid);
}
function GetSellList() {


    var const_insurerlogo = {
        "21": "apollo_munich.png",
        "42": "aditya_birla.png",
        "9": "reliance.png",
        "34": "religare_health.png",
        "26": "star_health.png",
        "38": "Cigna.png",
        "33": "lvgi.png",
        "6": "ICICI_Lombard.png",
        "12": "new_india.png",
        "44": "Go_Digit.png",
        "45": "Acko_General.png",
        "19": "universal_sompo.png",
        "1": "BajajAllianzGeneral.png",
        "4": "Future_Generali_General.png",
        "7": "Iffco_Tokio_General.png",
        "10": "royal.png",
        "11": "tata_aig.png",
        "5": "hdfc.png",
        "14": "United.png",
        "2": "Bharti_Axa_General.png",
        "46": "edelweiss.png",
        "47": "dhfl.png",
        "41": "Kotak.png",
        "35": "magma.png",
        "13": "oriental.png",
        "16": "raheja.png",
        "17": "SBI_General.png",
        "30": "kotak.png",
        "18": "shriram.png"

    };

    //var url = GetUrl()+"/user_datas/quicklist/10/SELL/" + ss_id + "/" + fba_id + "/1/" + mobile_no

    if (sub_fba_id == "" || sub_fba_id == null) {
        f_sub_fba_id = 0
    } else if (sub_fba_id != "") {
        f_sub_fba_id = sub_fba_id;
    }

    var url, method_name;
    if (sellSearch_url == "") {
        //url = GetUrl() + "/user_datas/quicklist/" + Product_id + "/SELL/" + ss_id + "/" + fba_id + "/" + pageIndex + "/" + mobile_no + "/" + f_sub_fba_id;
        url = GetUrl() + "/user_datas/quicklist/" + Product_id + "/SELL/" + ss_id + "/0/" + pageIndex + "/" + mobile_no + "/0";
        method_name = "/user_datas/quicklist/" + Product_id + "/SELL/" + ss_id + "/" + fba_id + "/" + pageIndex + "/" + mobile_no + "/" + f_sub_fba_id;

    } else {
        //url = sellSearch_url;
        method = sellSearch_url;
    }

    $.ajax({
        type: "GET",
        data: siteURL.indexOf('https') == 0 ? {'method_name': method_name} : "",
        url: siteURL.indexOf('https') == 0 ? GeteditUrl() + '/horizon-method.php' : url,
        dataType: "json",
        success: function (data) {
            console.log(data);
            if (data.length > 0) {
                for (var i in data) {
                    $(".sellDiv").append("<div class='app_quoteDiv' status='" + data[i].Last_Status + "' id='selldiv_id' CRN='" + data[i].CRN + "' SRN='" + data[i].SRN + "'>" + "<div class='ins_logo'>" + "<img src='http://di8vsggi846z0.cloudfront.net/fmweb/Images/insurer_logo_fm/" + const_insurerlogo[data[i].Insurer]
                            + "' class='img-responsive'>"
                            + "</div>"
                            + "<div class='content_container'>"
                            + "<div class='con parta' style='grid-template-columns: 1fr 100px !important;'>"
                            + "<div class='uname'>" + data[i].Customer_Name + "</div>"
                            + "<div class='crossSell' onclick='showCrossSellFunc(" + data[i].udid + ")'><button  id='cross_Sell'>Cross Sell</button></div>"
                            + "</div>"

                            + "<div class='con partb'>" + "<div class='app_num'>"
                            + "<div class='title'>APP NUMBER</div>" + "<div class='num'>" + data[i].CRN + "</div>" + "</div>"
                            + "<div class='app_status'>" + "<div class='title'>APP STATUS</div>" + "<div class='progress'>"
                            + "<div class='progress-bar' role='progressbar' aria-valuenow='70' aria-valuemin='0' aria-valuemax='100' style='width:"
                            + data[i].Progress + "%'>" + data[i].Progress + "</div>" + "</div>" + "</div>"
                            + "</div>"
                            + "<div class='con1 partc'>"
                            + "<div class='SUM_a'>"
                            + "<div class='title'>IDV</div>"
                            + data[i].Sum_Insured
                            + "</div>"
                            + "<div class='a_date'>"
                            + "<div class='title'>APP DATE</div>"
                            + data[i].Quote_Date_Mobile
                            + "</div>"
                            + "<div class='downloadpolicy' id='div_downloadPolicy_" + i + "'>"
                            + "<div class='dwn_policy' pdflink='" + data[i].policy_url + "' id='download_policy'><i class='fa fa-download' aria-hidden='true'></i></div>"
                            + "</div>"
                            + "</div>"

                            + "<input type='hidden' id='hd_app_SRN' value='" + data[i].SRN + "'/>" + "<input type='hidden' id='hd_app_Insurer' value='" + data[i].Insurer + "'/>" + "</div>" + "</div>");

                    $('#download_policy').click(function (e) {
                        var fileUrl = $(this).attr('pdflink');
                        var filename = $(this).parent().parent().parent().attr('CRN');
                        SaveToDisk(fileUrl, filename + "policy.pdf");
                    });

                    $('#info_' + data[i].SRN).click(function (e) {

                        var SRN = $(this).parent().parent().parent().attr('SRN');
                        var udid = SRN.split('_')[1];
                        SRN = SRN.split('_')[0];
                        //vehicleinfo(SRN);
                        vehicleinfo(SRN, udid);
                    });

                    var Status = data[i].Last_Status;
                    if (Status == "TRANS_SUCCESS_WITH_POLICY") {
                        $('#div_downloadPolicy_' + i).show();
                    } else {
                        $('#div_downloadPolicy_' + i).hide();
                    }

                }
            } else {
                var htmllist = $(".sellDiv").html();
                if (htmllist.length == 0) {
                    $('.sellDiv').append("<div style ='text-align:center;font-weight: bold;font-size: 18px;'>No Record found</div>");
                }
            }
            $('#QuoteLoader').hide();
        },
        error: function (result) {
            console.log(result)
        }
    });
}



$(document).ready(function () {
    $('.crossSell_popup').on('click', function () {
        $('.crossSell_popup').hide();
    })
});


var getUrlVars = function () {

    var vars = [],
            hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}


function BindModel_rto() {
    $.ajax({
        type: "GET",
        //url: GetUrl() + '/rtos/list',												//local
        //data:  { method_name: '/rtos/list', client_id: "2" },						//UAT
        //url: GeteditUrl() + '/TwoWheelerInsurance/call_horizon_get', 	  			//UAT
        data: siteURL.indexOf("https") == 0 ? {method_name: '/rtos/list', client_id: "2"} : "", //UAT
        url: siteURL.indexOf("https") == 0 ? GeteditUrl() + '/horizon-method.php' : GetUrlrtovehicle() + '/rtos/list',
        dataType: "json",
        success: function (data) {
            RtoList = data;
            console.log("RtoList");
            console.log(RtoList);
            if (GLeadType === "sync_contacts") {
                if (leadCty !== null || leadCty !== "" || leadCty !== undefined) {
                    for (var i in RtoList) {
                        if (RtoList[i].RTO_City === leadCty) {
                            $('#CityofRegitration').val("(" + RtoList[i].VehicleCity_RTOCode.toString() + ") " + RtoList[i].RTO_City.toString().toLowerCase());
                            $('#CityofRegitrationID').val(RtoList[i].VehicleCity_Id);
                            $('#CityofRegitration').addClass('used');
                            $("#ErCityofRegitration").hide().html("");
                        }
                    }
                }
            }
        }
    });

<<<<<<< .mine
    if (Product_id == 1 || Product_id == 10){//|| Product_id == 12) {27-04
=======
    if (Product_id == 1 || Product_id == 10) {
>>>>>>> .r12881
        // get Make and Model
        $.ajax({
            type: "GET",
            url: siteURL.indexOf("https") == 0 ? GeteditUrl() + '/horizon-method.php' : GetUrlrtovehicle() + '/vehicles/model_list?product_id=' + Product_id,
            data: siteURL.indexOf("https") == 0 ? {method_name: '/vehicles/model_list?product_id=' + Product_id, client_id: "2"} : "",
            dataType: "json",
            success: function (data) {
                VehicleList = data;
                console.log("Vehicle_Make_Model");
                console.log(VehicleList);
            },
            error: function (result) {

            }
        });
    }

}

function AddQuote() {

    BindModel_rto();
    $("#QUOTE_TAB").removeClass('Active');
    $("#APPLICATION_TAB").removeClass('Active');
    $("#SELL_TAB").removeClass('Active');
    $('.divlist').show();
    $('.renewSlider').addClass('slider1');
    $('.basicDetails').show();
    $('#dashboardquotelist').hide();
    $('#InputForm').hide();
    $('.quotelist').hide();
    $('#Input1').addClass('active');
    $('#Property').show();
    $('#Property').addClass('active in');
    $('#menu').removeClass('active');
    $("#Reg1,#Reg2,#Reg3,#Reg4 ").val("").removeClass('used');
    $("#RegistrationNo").val("");
    $("#FastlaneMsg").text('');
    ClearForm();
}



/*$(window).scroll(function () {
 var iCurScrollPos = $(this).scrollTop();
 var tab = activeTab;
 if (iCurScrollPos > iScrollPos) {
 //Scrolling Down
 if ($(window).scrollTop() == $(document).height() - $(window).height()) {
 if (!searchFlag) {
 pageIndex++;
 
 if (tab == 'SEARCH') {
 GetQuoteList();
 } else if (tab == 'APPLICATION') {
 GetApplication();
 } else if (tab == 'SELL') {
 GetSellList();
 } else if (tab == 'LEAD') {
 GetRenewalList();
 }
 }
 }
 }
 
 });*/


$(document.body).on('touchmove', onScroll); // for mobile
$(window).on('scroll', onScroll);

// callback
function onScroll() {
    if ($(window).scrollTop() + window.innerHeight >= document.body.scrollHeight) {
        pageIndex++;
        var tab = activeTab;
        if (tab == 'SEARCH') {
            GetQuoteList();
        } else if (tab == 'APPLICATION') {
            GetApplication();
        } else if (tab == 'SELL') {
            GetSellList();
        } else if (tab == 'LEAD') {
            GetRenewalList();
        }
    }
}


function Reload() {
    location.reload(true)
}
;

function Refresh() {
    Get_Search_Summary();
    Get_Saved_Data();
}

function myFunction1() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("tbl_quote_list");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}
function myFunction() {
    //
    var searchOption = $("#SearchQuote").val();
    var input = document.getElementById("myInput").value;
    var valuelength;
    valuelength = document.getElementById("myInput").value.length;

    if ((searchOption == "CRN" && valuelength == "6") || (searchOption == "Name" && valuelength >= 3)) {
        isSearchCheck = true;
    }

    if (valuelength == 0) {
        Reset();
    } else {
        if (isSearchCheck) {
            var type = activeTab;
            switch (type) {

                case 'SEARCH':
                    $('#tbl_quote_list').empty();
                    //quoteSearch_url = GetUrl() + "/user_datas/search/" + Product_id + "/" + type + "/" + ss_id + "/" + fba_id + "/" + searchOption + "/" + input + "/" + mobile_no;
                    quoteSearch_url = "/user_datas/search/" + Product_id + "/" + type + "/" + ss_id + "/" + fba_id + "/" + searchOption + "/" + input + "/" + mobile_no;
                    GetQuoteList();
                    break;
                case 'APPLICATION':

                    $('.app_mainlist').empty();
                    //appSearch_url = GetUrl() + "/user_datas/search/" + Product_id + "/" + type + "/" + ss_id + "/" + fba_id + "/" + searchOption + "/" + input + "/" + mobile_no;
                    appSearch_url = "/user_datas/search/" + Product_id + "/" + type + "/" + ss_id + "/" + fba_id + "/" + searchOption + "/" + input + "/" + mobile_no;
                    GetApplication();
                    break;
                case 'SELL':
                    $('.sellDiv').empty();
                    //sellSearch_url = GetUrl() + "/user_datas/search/" + Product_id + "/" + type + "/" + ss_id + "/" + fba_id + "/" + searchOption + "/" + input + "/" + mobile_no;
                    sellSearch_url = "/user_datas/search/" + Product_id + "/" + type + "/" + ss_id + "/" + fba_id + "/" + searchOption + "/" + input + "/" + mobile_no;
                    GetSellList();
                    break;
                case 'LEAD':
                    $('#renewaltbl_quote_list').empty();
                    //quoteSearch_url = GetUrl() + "/user_datas/search/" + Product_id + "/" + type + "/" + ss_id + "/" + fba_id + "/" + searchOption + "/" + input + "/" + mobile_no;
                    quoteSearch_url = "/user_datas/search/" + Product_id + "/" + type + "/" + ss_id + "/" + fba_id + "/" + searchOption + "/" + input + "/" + mobile_no;
                    GetRenewalList();
                    break;
            }
        }
    }
}

function GetSearchData() {
    searchFlag = true;
    Quote_cnt = 0;
    App_cnt = 0;
    Sell_cnt = 0;
    Renewal_Cnt = 0;
    var Error = 0;
    var ErrorMsg = "";

    var alphaReg = new RegExp("^[a-zA-Z ]+$");
    var numericReg = new RegExp("^[0-9]+$")

    var const_insurerlogo = {
        "21": "apollo_munich.png",
        "42": "aditya_birla.png",
        "9": "reliance.png",
        "34": "religare_health.png",
        "26": "star_health.png",
        "38": "Cigna.png",
        "33": "lvgi.png",
        "6": "ICICI_Lombard.png",
        "12": "new_india.png",
        "44": "Go_Digit.png",
        "45": "Acko_General.png",
        "19": "universal_sompo.png",
        "1": "BajajAllianzGeneral.png",
        "4": "Future_Generali_General.png",
        "7": "Iffco_Tokio_General.png",
        "10": "royal.png",
        "11": "tata_aig.png",
        "5": "hdfc.png",
        "14": "United.png",
        "2": "Bharti_Axa_General.png",
        "46": "edelweiss.png",
        "47": "dhfl.png",
        "41": "Kotak.png",
        "35": "magma.png",
        "13": "oriental.png",
        "16": "raheja.png",
        "17": "SBI_General.png",
        "30": "kotak.png",
        "18": "shriram.png"

    };

    var searchby = $("#SearchBy").val();
    var searchvalue = $('#searchInput').val();


    if (searchby == "Name") {
        if (!alphaReg.test(searchvalue)) {
            Error++;
            $('#ErsearchInput').text("Please enter valid Name.");
        }
    } else if (searchby == "CRN") {
        if (!numericReg.test(searchvalue)) {
            Error++;
            $('#ErsearchInput').text("Please enter valid CRN.");

        }
    }

    if (Error == 0) {
        $('#ErsearchInput').text("");
        var url = GetUrl() + "/user_datas/search1/" + Product_id + "/" + ss_id + "/" + fba_id + "/" + searchby + "/" + searchvalue + "/0"
        var method_name = "/user_datas/search1/" + Product_id + "/" + ss_id + "/" + fba_id + "/" + searchby + "/" + searchvalue + "/0"


        $.ajax({
            type: "GET",
            data: siteURL.indexOf('https') == 0 ? {'method_name': method_name} : "",
            url: siteURL.indexOf('https') == 0 ? GeteditUrl() + '/horizon-method.php' : url,
            dataType: "json",
            success: function (data) {
                console.log(data);
                $('#tbl_quote_list').empty();
                $('#renewaltbl_quote_list').empty();
                $('.app_mainlist').empty();
                $('.sellDiv').empty();
                for (var i in data) {

                    if (data[i].Status == "QUOTE") {
                        Quote_cnt++;
                        $('#tbl_quote_list').append('<tr class="quoteDiv" id="tr_lst" srn="' + data[i].SRN + '" udid="' + data[i].User_Data_Id + '">' +
                                '<td><div class="ApplicantName">' + data[i].Customer_Name + '</div>' +
                                '<div class="contentTxt"><span class="crn_span"></div>' +
                                '</td>' +
                                '<td class="" style="text-align:center">' +
                                '<div class="contentTxt crn">CRN No.</div>' +
                                '<div class="desc crn">' + data[i].CRN + '</div>' +
                                '</td>' +
                                '<td class="" style="text-align:center"><div class="contentTxt quote_date">QUOTE DATE</div><div class="desc quote_date">' + data[i].Quote_Date_Mobile + '</div></td>' +
                                '<td class="" style="text-align:center" id="Infopopup">' +
                                '<i class="fa fa-info-circle" id="quoteinfo_' + data[i].SRN + '" aria-hidden="true" style="padding:10px 0px;font-size:20px"></i>' +
                                '</td>' +
                                '</tr>'
                                )
                    }

                    if (data[i].Status == "APPLICATION") {
                        App_cnt++;
                        $(".app_mainlist").append("<div class='app_quoteDiv' id='app_quote_id' CRN='" + data[i].CRN + "' SRN='" + data[i].SRN + "'>" + "<div class='ins_logo'>" + "<img src='./images/InsurerLogo/" + const_insurerlogo[data[i].Insurer] + "' class='img-responsive'>" + "</div>" + "<div class='content_container'>" + "<div class='con parta'>" + "<div class='uname'>" + data[i].Customer_Name + "</div>" + "<div class='menu' id='info_" + data[i].SRN + "'><i class='fa fa-info-circle'  aria-hidden='true' style='padding:10px 0px;font-size:20px'></i></div>" + "</div>" + "<div class='con partb'>" + "<div class='app_num'>" + "<div class='title'>APP NUMBER</div>" + "<div class='num'>" + data[i].CRN + "</div>" + "</div>" + "<div class='app_status'>" + "<div class='title'>APP STATUS</div>" + "<div class='progress'>" + "<div class='progress-bar' role='progressbar' aria-valuenow='70' aria-valuemin='0' aria-valuemax='100' style='width:" + data[i].Progress + "%'>" + data[i].Progress + "</div>" + "</div>" + "</div>" + "</div>" + "<div class='con partc'>" + "<div class='SUM_a'>" + "<div class='title'>IDV</div>" + data[i].Sum_Insured + "</div>" + "<div class='a_date'>" + "<div class='title'>APP DATE</div>" + data[i].Quote_Date_Mobile + "</div>" + "</div>" + "<input type='hidden' id='hd_app_SRN' value='" + data[i].SRN + "'/>" + "<input type='hidden' id='hd_app_Insurer' value='" + data[i].Insurer + "'/>" + "</div>" + "</div>");
                    }

                    if (data[i].Status == "COMPLETE") {
                        Sell_cnt++;
                        $(".sellDiv").append("<div class='app_quoteDiv' status='" + data[i].Last_Status + "' id='selldiv_id' CRN='" + data[i].CRN + "' SRN='" + data[i].SRN + "'>" + "<div class='ins_logo'>" + "<img src='./images/InsurerLogo/" + const_insurerlogo[data[i].Insurer] + "' class='img-responsive'>" + "</div>" + "<div class='content_container'>" + "<div class='con parta'>"
                                + "<div class='uname'>" + data[i].Customer_Name + "</div>"
                                + "<div class='menu'  id='info_" + data[i].SRN + "'><i class='fa fa-info-circle'  aria-hidden='true' style='padding:10px 0px;font-size:20px'></i>"
                                + "</div>" + "</div>" + "<div class='con partb'>" + "<div class='app_num'>"
                                + "<div class='title'>APP NUMBER</div>" + "<div class='num'>" + data[i].CRN + "</div>" + "</div>"
                                + "<div class='app_status'>" + "<div class='title'>APP STATUS</div>" + "<div class='progress'>"
                                + "<div class='progress-bar' role='progressbar' aria-valuenow='70' aria-valuemin='0' aria-valuemax='100' style='width:"
                                + data[i].Progress + "%'>" + data[i].Progress + "</div>" + "</div>" + "</div>"
                                + "</div>"
                                + "<div class='con1 partc'>"
                                + "<div class='SUM_a'>"
                                + "<div class='title'>IDV</div>"
                                + data[i].Sum_Insured
                                + "</div>"
                                + "<div class='a_date'>"
                                + "<div class='title'>APP DATE</div>"
                                + data[i].Quote_Date_Mobile
                                + "</div>"
                                + "<div class='downloadpolicy' id='div_downloadPolicy_" + i + "'>"
                                + "<div class='dwn_policy' pdflink='" + data[i].policy_url + "' id='download_policy'><i class='fa fa-download' aria-hidden='true'></i></div>"
                                + "</div>"
                                + "</div>"
                                + "<input type='hidden' id='hd_app_SRN' value='" + data[i].SRN + "'/>" + "<input type='hidden' id='hd_app_Insurer' value='" + data[i].Insurer + "'/>" + "</div>" + "</div>"
                                );
                    }
                    if (data[i].Status == "LEAD") {
                        Renewal_Cnt++;
                        $('#renewaltbl_quote_list').append('<tr class="quoteDiv" id="tr_lst" srn="' + data[i].SRN + '" udid="' + data[i].User_Data_Id + '">' +
                                '<td><div class="ApplicantName">' + data[i].Customer_Name + '</div>' +
                                '<div class="contentTxt"><span class="crn_span"></div>' +
                                '</td>' +
                                '<td class="" style="text-align:center">' +
                                '<div class="contentTxt crn">CRN No.</div>' +
                                '<div class="desc crn">' + data[i].CRN + '</div>' +
                                '</td>' +
                                '<td class="" style="text-align:center"><div class="contentTxt quote_date">QUOTE DATE</div><div class="desc quote_date">' + data[i].Quote_Date_Mobile + '</div></td>' +
                                '<td class="" style="text-align:center" id="Infopopup">' +
                                '<i class="fa fa-info-circle" id="quoteinfo_' + data[i].SRN + '" aria-hidden="true" style="padding:10px 0px;font-size:20px"></i>' +
                                '</td>' +
                                '</tr>'
                                )
                    }
                    $('#quoteinfo_' + data[i].SRN).click(function (e) {

                        var SRN = $(this).parent().parent().attr('srn');
                        var udid = SRN.split('_')[1];
                        SRN = SRN.split('_')[0];
                        //vehicleinfo(SRN);
                        vehicleinfo(SRN, udid);
                    });
                    $('#info_' + data[i].SRN).click(function (e) {

                        var SRN = $(this).parent().parent().parent().attr('SRN');
                        var udid = SRN.split('_')[1];
                        SRN = SRN.split('_')[0];
                        //vehicleinfo(SRN);
                        vehicleinfo(SRN, udid);
                    });

                    $(".ApplicantName,.crn,.quote_date").click(function (e) {
                        SRN = $(this).parent().parent().attr('srn');
                        var udid = $(this).parent().parent().attr('udid');
                        $('.maininput').hide();
                        $('.quotelist').show();
                        $('.divlist').show();
                        $('#dashboardquotelist').hide();
                        $('.loading').show();
                        $('#Property').removeClass('active in');
                        $('#Appl').addClass('active in');
                        Get_Search_Summary();
                        Get_Saved_Data();
                        //window.location.href = './quotepage.html?SRN=' + SRN + '&client_id=2';

                    });
                }

                $(".qlist div").removeClass('Active');
                $('.othrFilter').removeClass("hidden");

                //Count
                $('#Quote_Cnt').text(Quote_cnt);
                $('#App_Cnt').text(App_cnt);
                $('#Sell_Cnt').text(Sell_cnt);
                $('#Renewal_Cnt').text(Renewal_Cnt);


                if (Quote_cnt > 0) {
                    QuoteShow();

                } else if (App_cnt > 0) {
                    ApplicationShow();

                } else if (Sell_cnt > 0) {
                    SellShow();

                } else if (Renewal_Cnt > 0) {
                    RenewalShow();

                } else {

                    $('#nodata').val('No Data Found!!!!!!!')
                    searchFlag = false;
                    QuoteShow();
                    GetQuoteList();
                }

            },
            error: function (result) {
                console.log(result)
            }
        });

    }
}

function SearchQuote() {

    if ($("#SearchBy").val() != 0) {
        $("#SearchQuoteInput").css('visibility', 'visible');
        $('#searchInput').val('');
        var option = $("#SearchBy").val();
        switch (option) {
            case 'Name':
                $('#searchInput').attr('placeholder', 'Name');
                break;
            case 'CRN':
                $('#searchInput').attr('placeholder', 'CRN');
                break;
            case 'Registration_no':
                $('#searchInput').attr('placeholder', 'Registration Number');
                break;
        }
    } else {
        $("#SearchQuoteInput").hide();
    }

}

function SaveToDisk(fileURL, fileName) {
    // for non-IE
    if (!window.ActiveXObject) {
        var save = document.createElement('a');
        save.href = fileURL;
        save.target = '_blank';

        save.download = fileName || fileURL;
        var evt = document.createEvent('MouseEvents');
        evt.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0,
                false, false, false, false, 0, null);
        save.dispatchEvent(evt);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    }

    // for IE
    else if (!!window.ActiveXObject && document.execCommand) {
        var _window = window.open(fileURL, "_blank");
        _window.document.close();
        _window.document.execCommand('SaveAs', true, fileName || fileURL)
        _window.close();
    }
}


$('#Filterpopup').on('click', function () {
    $("#SearchBy").val("CRN");
    $('#searchInput').val("");
    $('#searchInput').attr('placeholder', 'CRN');
    $('#othrFilter').addClass("hidden");
    $('.popupbox1').show();
    $('.sticky_btn').hide();
    $('.sticky_popup').hide();
})

$('#popupClose').on('click', function () {
    $('.popupbox').hide();
    $('.popupbox1').hide();
    $('.sticky_btn').show();

})
$('#Infopopup').on('click', function () {
    $('#infoPopup').show();
    $('.sticky_btn').hide();
})
$('#infopopupClose').on('click', function () {
    $('#infoPopup').hide();
    if ($(".qlist #RENEWAL_TAB").hasClass('Active')) {
        $('.sticky_btn').hide();
    } else {
        $('.sticky_btn').show();
    }
})

function GetPrevIns(InsId) {
    var InsText = "";
    switch (InsId) {
        case 1:
            InsText = "Bajaj Allianz";
            break;
        case 2:
            InsText = "Bharti Axa";
            break;
        case 3:
            InsText = "Cholamandalam MS";
            break;
        case 4:
            InsText = "Future Generali";
            break;
        case 5:
            InsText = "HDFC ERGO";
            break;
        case 6:
            InsText = "ICICI Lombard";
            break;
        case 7:
            InsText = "IFFCO Tokio";
            break;
        case 8:
            InsText = "National Insurance";
            break;
        case 9:
            InsText = "Reliance General";
            break;
        case 10:
            InsText = "Royal Sundaram";
            break;
        case 11:
            InsText = "Tata AIG";
            break;
        case 12:
            InsText = "New India Assurance";
            break;
        case 13:
            InsText = "Oriental Insurance";
            break;
        case 14:
            InsText = "United India";
            break;
        case 15:
            InsText = "L&amp;T General";
            break;
        case 16:
            InsText = "Raheja QBE";
            break;
        case 17:
            InsText = "SBI General";
            break;
        case 18:
            InsText = "Shriram General";
            break;
        case 19:
            InsText = "Universal Sompo";
            break;
        case 30:
            InsText = "Kotak Mahindra";
            break;
        case 33:
            InsText = "Liberty Videocon";
            break;
        case 35:
            InsText = "Magma HDI";
            break;
        case 44:
            InsText = "Go Digit";
            break;
        case 45:
            InsText = "Acko General";
            break;
        case 46:
            InsText = "Edelweiss";
            break;
        case 47:
            InsText = "DHFL";
            break;
    }
    return InsText;
}
function vehiclePopupOpen() {
    $('#infoPopup').show();
    //vehicleinfo(SRN.split('_')[0]);
    vehicleinfo(SRN.split('_')[0], SRN.split('_')[1]);
}

function vehicleinfo(SRN, UDID) {

    $('#QuoteLoader').show();
    var str1 = {
        "search_reference_number": SRN,
        "udid": UDID,
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9"
    };

    // var mainUrl = GetUrl() + "/quote/premium_summary";				//local
    var obj_horizon_data = Horizon_Method_Convert("/quote/premium_summary", str1, "POST");			//UAT

    $.ajax({
        type: "POST",
        //data: JSON.stringify(str1), //local
        //url: mainUrl, //local
        //data: JSON.stringify(obj_horizon_data['data']), //UAT
        //url: obj_horizon_data['url'], //UAT
        data: siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(str1),
        url: siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/premium_summary",

        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (response) {
            console.log("premium_summary() called ", response);
            var vehicle = response.Master.Vehicle;
            var request = response.Request;
            var rto = response.Master.Rto;
            if (request !== null && vehicle !== null) {

                $("#err_msg_vehinfo").text("");
                $('#divveh_info').show()
                if (request.registration_no != "") {
                    var RegNo = request.registration_no.replace(new RegExp('-', 'gi'), "");
                    $("#RegistrationNo").text(RegNo);

                    if ((RegNo.indexOf("AA1234") > -1) || (RegNo.indexOf("ZZ9999") > -1)) {
                        $("#RegistrationNo").text(RTOCode);
                        $("#divRegistrationNoDetails").hide();
                    } else {
                        $("#divRegistrationNoDetails").show();
                        $("#RegistrationNoDetails").text(RegNo);
                    }
                }
                if (vehicle != "" && vehicle != null) {

                    $("#VehicleNameDetails").text(vehicle.Description + " (" + vehicle.Vehicle_ID + ")");
                    $("#FuelNameDetails").text(vehicle.Fuel_Name);
                    if (request.external_bifuel_type == "cng") {
                        $("#FuelNameDetails").text(vehicle.Fuel_Name + "(" + "EXTERNAL FITTED CNG" + ")");
                    }
                    if (request.external_bifuel_type == "lpg") {
                        $("#FuelNameDetails").text(vehicle.Fuel_Name + "(" + "EXTERNAL FITTED LPG" + ")");
                    }
                } else {
                    $("#VehicleNameDetails").text("");
                    $("#FuelNameDetails").text("");
                }

                if (Product_id == 12) {
                    if (request.vehicle_class_code == 24) {
                        $("#span_vehicle_class").text("Goods Carrying Vehicle");
                    } else if (request.vehicle_class_code == 41) {
                        $("#span_vehicle_class").text("Passenger Carrying Vehicle");
                    } else if (request.vehicle_class_code == 35) {
                        $("#span_vehicle_class").text("Miscellaneous And Special Type");
                    }

                    $.each(VehicleSubClass, function (key, value) {
                        if (value.value == request.vehicle_sub_class) {
                            $("#span_vehicle_subclass").text(value.Text);
                        }
                    })
                }

                if (request.external_bifuel_value > 0) {
                    $("#ExternalBifuelVal").html(request.external_bifuel_value);
                } else {
                    $("#divExternalBifuelVal").hide();
                }

                if (rto != "" && rto != null) {
                    $("#RTODetails").text(rto.RTO_City + ", " + rto.State_Name + " (" + response.Master.Rto.VehicleCity_Id + ")");
                } else {
                    $("#RTODetails").text("");
                }

                var Name = "";
                if (request.first_name != "" && checkTextWithSpace(request.first_name)) {
                    Name = request.first_name + " ";
                    if (request.middle_name != "" && checkTextWithSpace(request.middle_name)) {
                        Name = Name + request.middle_name + " ";
                    }
                    if (request.last_name != "" && checkTextWithSpace(request.last_name)) {
                        Name = Name + request.last_name;
                    }
                } else {
                    $("#divNameDetails").hide();
                }
                $("#NameDetails").text(Name);
                if (request.mobile != "" && request.mobile != null) {
                    $("#MobileDetails").text(request.mobile);
                    if (request.mobile == "9999999999") {
                        $("#MobileDetails").text("NA");
                    }
                } else {
                    $("#divMobileDetails").hide();
                }
                if (request.email != "" && request.email != null) {
                    $("#EmailDetails").text(request.email);
                    if ((request.email).indexOf('@testpb.com') > 1) {
                        $("#EmailDetails").text("NA");

                    }
                } else {
                    $("#divEmailDetails").hide();
                }

                if (request.vehicle_insurance_type == "new") {
                    $("#RegistrationTypeDetails").text("New");
                } else {
                    $("#RegistrationTypeDetails").text("Renew");
                }

                //For TP Plan Implementation
                VehInsSubType = request.vehicle_insurance_subtype;
                $("#VehicleInsuranceSubtype").val(VehInsSubType);
                console.log("VehInsSubType: ", VehInsSubType);

                $("#RegistrationSubTypeDetails").html(ShowVehInsSubType(VehInsSubType));

                if (request.vehicle_registration_date != "" || request.vehicle_registration_date != null) {
                    $("#RegistrationDate").html(request.vehicle_registration_date);
                } else {
                    $("#divRegistrationDate").hide();
                }

                if (request.vehicle_manf_date != "" || request.vehicle_manf_date != null) {
                    $("#ManufactureDateval").html(request.vehicle_manf_date);
                } else {
                    $("#divManufactureDateval").hide();
                }

                if (request.policy_expiry_date != "" && request.policy_expiry_date != null) {
                    $("#PolicyExpiryDateval").html(request.policy_expiry_date);
                } else {
                    $("#divPolicyExpiryDateval").hide();
                }

                $("#PrevNCB").empty();
                if (request.vehicle_ncb_current != "" || request.vehicle_ncb_current != null) {
                    $("#PrevNCB").html(request.vehicle_ncb_current + "%")
                } else {
                    $("#divPrevNCB").hide();
                }

                if (request.is_claim_exists != "no") {
                    $("#ClaimYesNo").html("Yes");
                    $("#divPrevNCB").hide();
                }
                if (request.is_claim_exists != "yes") {
                    $("#ClaimYesNo").html("No");
                    $("#divPrevNCB").show();
                }

                if (request.vehicle_registration_type == "corporate") {
                    $("#VehicleInsType").html("Company");
                } else {
                    $("#VehicleInsType").html("Individual");
                }

                var PrevInsName = GetPrevIns(request.prev_insurer_id);
                if (request.prev_insurer_id != "" && request.prev_insurer_id != null) {
                    $("#PrevInsurer").html(PrevInsName);
                } else {
                    $("#divPrevInsurer").hide();
                }

                $('#PospAgentName').text(request.posp_first_name + ' ' + request.posp_last_name + ' ( Mob. :  ' + request.posp_mobile_no + ', SS_ID : ' + request.posp_ss_id + ', FBA_ID : ' + request.posp_fba_id + ', City  : ' + request.posp_agent_city + ')');
                $('#PospAgentCity').text(request.posp_agent_city);
                var reportingMobile = request.posp_reporting_mobile_number != null ? request.posp_reporting_mobile_number : "";
                $('#ReportingAgentName').text(request.posp_reporting_agent_name + ' ( UID : ' + request.posp_reporting_agent_uid + ', Mob. : ' + reportingMobile + ' )');
                var client_key_val;
                if (request['product_id'] == 1 || request['product_id'] == 10 || request['product_id'] == 12) {
                    if (request.hasOwnProperty('ss_id') && (request['ss_id'] - 0) > 0) {
                        var posp_sources = request['posp_sources'] - 0;
                        var ss_id = (request['ss_id'] - 0);
                        if (posp_sources == 1) {
                            if (request.hasOwnProperty('posp_erp_id') && (request['posp_erp_id'] - 0) > 0) { //posp_erp_id
                                client_key_val = 'DC-POSP';
                                if ([8279, 6328, 9627, 6425].indexOf(ss_id) > -1) {
                                    client_key_val = 'FINPEACE';
                                }
                            } else if (ss_id !== 5) {
                                client_key_val = 'DC-NON-POSP';
                            } else if (ss_id === 5) {
                                client_key_val = 'DC-FBA';
                            }
                        } else if (posp_sources == 2) {
                            if (request.hasOwnProperty('posp_erp_id') && (request['posp_erp_id'] - 0) > 0) { //posp_erp_id
                                client_key_val = 'SM-POSP';
                            } else if (ss_id === 5) {
                                client_key_val = 'SM-FBA';
                            } else {
                                client_key_val = 'SM-NON-POSP';
                            }
                        } else {
                            if (request['posp_category'] == 'FOS') {
                                client_key_val = 'SM-FOS';
                            } else if (request['posp_category'] == 'RBS') {
                                client_key_val = 'RBS';
                            } else {
                                client_key_val = 'PB-SS';
                            }
                        }

                    }
                }
                $('#POSPType').text(client_key_val);
                $('#QuoteLoader').hide();
                $('#infoPopup').show();
                $('.sticky_btn').hide();
            } else {

                $('#infoPopup').show();
                $("#err_msg_vehinfo").text("No data found");
                $('#divveh_info').hide()
                $('#QuoteLoader').hide();
            }
        }, error: function (response) {
            $('.AlertOvl').show();
            $('.alert_container').text("Error in Premium Summary.");
            $('.ok_btn').click(function () {
                $('.AlertOvl').hide();
            });
        }
    });
}




function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var regMobile = new RegExp("^[0-9]");
    var value = evt.target.value.length;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 32 && (charCode < 48 || charCode > 57) || value >= 10) {
        return false;
    }
    return true;
}


function ValidateNumber(event) {
    if (!(/^[0-9]*$/.test(event.target.value))) {
        event.target.value = "";
    }
}

function Contactkeyup(value) {
    value = value.replace('.', '');
    $('#ContactMobile').val(value);
}
function CheckLoanWaiver(value) {

    if (($("#TPCompPlan").val() == "0CH_1TP" || $("#TPCompPlan").val() == "0CH_3TP") && Product_id == 1) {
        $("#divLoanWaiver").hide();
        $(".divOutstandingLoanCoverAmount").hide();
    }

    if (($("#TPCompPlan").val() == "1CH_0TP" || $("#TPCompPlan").val() == "1OD_0TP" || $("#TPCompPlan").val() == "1CH_2TP" || $("#TPCompPlan").val() == "3CH_0TP") && Product_id == 1) {
        $("#divLoanWaiver").show();
        $(".divOutstandingLoanCoverAmount").show();
    }

    if (($("#TPCompPlan").val() == "0CH_1TP" || $("#TPCompPlan").val() == "0CH_5TP") && Product_id == 10) {
        $("#divLoanWaiver").hide();
        $(".divOutstandingLoanCoverAmount").hide();
    }

    if (($("#TPCompPlan").val() == "1CH_4TP" || $("#TPCompPlan").val() == "5CH_0TP" || $("#TPCompPlan").val() == "1CH_0TP" || $("#TPCompPlan").val() == "2CH_0TP" || $("#TPCompPlan").val() == "3CH_0TP" || $("#TPCompPlan").val() == "1OD_0TP") && Product_id == 10) {
        $("#divLoanWaiver").hide();
        $(".divOutstandingLoanCoverAmount").hide();
    }

    if (value == "Yes") {
        $("#LoanWaiver").text("Yes").val("Yes");
        $("#LoanWaiver2").prop('checked', true);
        $(".divOutstandingLoanCoverAmount").show();
        $("#LoanWaiver2").addClass('active');
        $("#LoanWaiver1").removeClass('active');
    } else if (value == "No") {
        $("#LoanWaiver").text("No").val("No");
        $("#LoanWaiver1").prop('checked', true);
        $(".divOutstandingLoanCoverAmount").hide();
        $("#OutstandingLoanCoverAmount").val(0);
        $("#LoanWaiver1").addClass('active');
        $("#LoanWaiver2").removeClass('active');
    }
}

function ShareQuotePdf() {
    var val = [];
    $("input[name='insuid[]']:checked").each(function (i) {
        val[i] = $(this).val();
    });
    if (val.length == 0) {
        $('.AlertOvl').show();
        $('.alert_container').text("Please select atleast 1 quote.");
        $('.ok_btn').click(function () {
            $('.AlertOvl').hide();
        });
    } else {
        Get_Share_Data(val);
    }
}

function Get_Share_Data(InsuID) {

    var with_addons_checked = 'unchecked';
    if ($("#addonChecked").prop("checked") == true) {
        with_addons_checked = 'checked';
    }

    var qpara = [];
    var data_response = Response_Global.Response;
    var responseData = '';
    var InsuranceIdData = '';
    for (var key in data_response) {
        responseData = data_response[key];
        for (var key in InsuID) {
            InsuranceIdData = InsuID[key];
            if (InsuranceIdData == responseData.Insurer_Id) {
                qpara.push(responseData);
            }
        }
    }

    var custom_add_on = [];
    $.each($(".checkBoxClass:checked"), function (key, value) {
        custom_add_on.push(value.value);
    });
    var posp_name = "";
    posp_name += Response_Global.Summary.Request_Core.posp_first_name;
    if (Response_Global.Summary.Request_Core.posp_middle_name != null && Response_Global.Summary.Request_Core.posp_middle_name.length > 0) {
        posp_name += " " + Response_Global.Summary.Request_Core.posp_middle_name;
    }
    posp_name += " " + Response_Global.Summary.Request_Core.posp_last_name;

    var quotes_para = {
        "Name": Response_Global.Summary.Request_Core.first_name + " " + Response_Global.Summary.Request_Core.last_name,
        "PB_CRN": Response_Global.Summary.Request_Core.crn == 0 ? Response_Global.Summary.PB_CRN : Response_Global.Summary.Request_Core.crn,
        "NCB": Response_Global.Summary.Request_Core.vehicle_ncb_current,
        "vehicle_registration_date": Response_Global.Summary.Request_Core.registration_no,
        "policy_expiry_date": Response_Global.Summary.Request_Core.policy_expiry_date,
        "is_claim_exists": Response_Global.Summary.Request_Core.is_claim_exists,
        "Pospname": posp_name,
        "posp_mobile_no": Response_Global.Summary.Request_Core.posp_mobile_no,
        "posp_email_id": Response_Global.Summary.Request_Core.posp_email_id,
        "product_id": Response_Global.Summary.Request_Core.product_id,
        "quotes": JSON.stringify(qpara),
        "with_addons_checked": with_addons_checked,
        "addon_list_labels": JSON.stringify(addon_list),
        "custom_add_on": JSON.stringify(custom_add_on)
    };

    //console.log(quotes_para);
    SendShareQuotePdf(quotes_para);
}


function SendShareQuotePdf(quotes_para) {
    var obj_horizon_data = Horizon_Method_Convert("/finmart_quotes_share", quotes_para, "POST");
    var datastr = JSON.stringify(quotes_para);
    $.ajax({
        url: siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/finmart_quotes_share",
        //data : siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) :  quotes_para, 
        data: quotes_para,
        dataType: "json",
        method: "POST",
        success: function (result) {


            if (app_version.startsWith("1")) {
                var data = result.Url.split("fm_quoteshare");
                data = data[1];
                var urlSchemedefault = "iosscheme://";
                var url = GetUrl() + "/tmp/fm_quoteshare" + data;
                window.location = urlSchemedefault + url;
            }
            if (app_version == "2.4.2" || app_version == "2.4.3" || true) {
                Android.SendShareQuotePdf(result['Url'], result['Htmldata']);
            }
            /*if (app_version == "2.0") {
             window.webkit.messageHandlers.finmartios.postMessage(result['Url']);
             $("#test_version").text("Hello IOS");
             }*/

        }
    });
}



var VehicleSubClass = [
<<<<<<< .mine
    {"ID": "1", "VehicleClass": "gcv", "Text": "Public Carrier (Other Than Three Wheelers)", "value": "gcv_public_otthw"},
    //{"ID": "2", "VehicleClass": "gcv", "Text": "Private Carrier (Other Than Three Wheelers)", "value": "gcv_private_otthw"},
    {"ID": "3", "VehicleClass": "gcv", "Text": "Public Carrier (Three Wheelers And Pedal Cycles)", "value": "gcv_public_thwpc"},
    //{"ID": "4", "VehicleClass": "gcv", "Text": "Private Carrier (Three Wheelers And Pedal Cycles)", "value": "gcv_private_thwpc"},
=======
    {"ID": "1", "VehicleClass": "gcv", "Text": "Public Other than 3 Wheeler", "value": "gcv_public_otthw"},
    //{"ID": "2", "VehicleClass": "gcv", "Text": "Private Carrier (Other Than Three Wheelers)", "value": "gcv_private_otthw"},
    {"ID": "3", "VehicleClass": "gcv", "Text": "Public 3 Wheeler", "value": "gcv_public_thwpc"},
    //{"ID": "4", "VehicleClass": "gcv", "Text": "Private Carrier (Three Wheelers And Pedal Cycles)", "value": "gcv_private_thwpc"},
>>>>>>> .r12881

    {"ID": "5", "VehicleClass": "pcv", "Text": "4 Wheeler LESS THAN OR EQUAL TO 6 PASSENGERS", "value": "pcv_fw_lt6pass"},
    {"ID": "6", "VehicleClass": "pcv", "Text": "3 Wheeler LESS THAN OR EQUAL TO 6 PASSENGERS", "value": "pcv_thw_lt6pass"},
    {"ID": "7", "VehicleClass": "pcv", "Text": "4 Wheeler MORE THAN 6 PASSENGERS", "value": "pcv_fw_gt6pass"},
    {"ID": "8", "VehicleClass": "pcv", "Text": "3 Wheeler BETWEEN 6 TO 17 PASSENGERS", "value": "pcv_thw_between6to17pass"},
    {"ID": "9", "VehicleClass": "pcv", "Text": "2 Wheeler LESS THAN OR EQUAL TO 2 PASSENGERS", "value": "pcv_tw"},

    //{"ID": "10", "VehicleClass": "msc", "Text": "Miscellaneous And Special Type", "value": "msc"}
];

$("#id_VehicleClass").on('change', function () {
	if ($("#id_VehicleClass").val() == "gcv") {
        vehicle_class_code = 24;
    } else if ($("#id_VehicleClass").val() == "pcv") {
        vehicle_class_code = 41;
    } else if ($("#id_VehicleClass").val() == "msc") {
        vehicle_class_code = 35;
    } else {
        vehicle_class_code = 0;
    }
	
	 if (vehicle_class_code == 0) {
        var option_val = "<option value='0'>Select Vehicle Sub Class</option>";

        $("#id_VehicleSubClass").html(option_val);
        vehicle_subclass_code = 0;
    } else {
        var option_val = "<option value='0'>Select Vehicle Sub Class</option>";
        $.each(VehicleSubClass, function (key, value) {
            if (value.VehicleClass == $("#id_VehicleClass").val()) {
                option_val += "<option value='" + value.value + "'>" + value.Text + "</option>";
            }
        });

        $("#id_VehicleSubClass").html(option_val);
        vehicle_subclass_code = 0;

        // get Make and Model
        /*$.ajax({
            type: "GET",
            url: siteURL.indexOf("https") == 0 ? GeteditUrl() + '/horizon-method.php' : GetUrl() + '/vehicles/model_list_cv?product_id=' + Product_id + '&vehicle_class=' + vehicle_class_code,
            data: siteURL.indexOf("https") == 0 ? {method_name: '/vehicles/model_list_cv?product_id=' + Product_id + '&vehicle_class=' + vehicle_class_code, client_id: "2"} : "",
            dataType: "json",
            success: function (data) {
                VehicleList = data;
                console.log("Vehicle_Make_Model");
                console.log(VehicleList);
            },
            error: function (result) {

            }
        });*/
    }
    $("#MakeModel").val('');
    $("#FuelType").html('<option selected value="0">SELECT FUEL TYPE</option>');
    FuelSelected = 0;
    $("#VariantID").html('<option selected value="0">Select Variant</option>');
    VariantIDSelected = 0;
	
});

$("#id_VehicleSubClass").on('change', function () {
    vehicle_subclass_code = $("#id_VehicleSubClass").val();
	let vehicle_class_short_name = $("#id_VehicleClass").val();
	
    $("#MakeModel").val('');
    $("#FuelType").html('<option selected value="0">SELECT FUEL TYPE</option>');
    FuelSelected = 0;
    $("#VariantID").html('<option selected value="0">Select Variant</option>');
    VariantIDSelected = 0;
	
	// get Make and Model
	$.ajax({
		type: "GET",
		url: siteURL.indexOf("https") == 0 ? GeteditUrl() + '/horizon-method.php' : GetUrl() + '/vehicles/make_list_cv?product_id=12&vehicle_class=' + vehicle_class_code + '_' + vehicle_class_short_name + '&vehicle_subclass_name=' + vehicle_subclass_code,
		data: siteURL.indexOf("https") == 0 ? {method_name: '/vehicles/make_list_cv?product_id=12&vehicle_class=' + vehicle_class_code + '_' + vehicle_class_short_name + '&vehicle_subclass_name=' + vehicle_subclass_code, client_id: "2"} : "",
		dataType: "json",
		success: function (data) {
			$.ajax({
				type: "GET",
				url: siteURL.indexOf("https") == 0 ? GeteditUrl() + '/horizon-method.php' : GetUrl() + '/vehicles/model_list_cv?product_id=12&vehicle_class=' + vehicle_class_code + '_' + vehicle_class_short_name + '&vehicle_subclass_name=' + vehicle_subclass_code,
				data: siteURL.indexOf("https") == 0 ? {method_name: '/vehicles/model_list_cv?product_id=12&vehicle_class=' + vehicle_class_code + '_' + vehicle_class_short_name + '&vehicle_subclass_name=' + vehicle_subclass_code, client_id: "2"} : "",
				dataType: "json",
				success: function (data) {
					VehicleList = data;
					console.log("Vehicle_Make_Model");
					console.log(VehicleList);
					
				},
				error: function (result) {

				}
			});
		},
		error: function (result) {

		}
	});
    
    $("#MakeModel").val('');
    $("#FuelType").html('<option selected value="0">SELECT FUEL TYPE</option>');
    FuelSelected = 0;
    $("#VariantID").html('<option selected value="0">Select Variant</option>');
    VariantIDSelected = 0;	
});


function fin_own_premises(value) {
    if (value == 'yes') {
        own_premises = 'yes';
        $("#own_premises_YES").addClass('active');
        $("#own_premises_NO").removeClass('active');
    }
    if (value == 'no') {
        own_premises = 'no';
        $("#own_premises_YES").removeClass('active');
        $("#own_premises_NO").addClass('active');
    }
}

function cvcovers_Cleaner_Ll(value) {
    if (value == 'yes') {
        Cleaner_Ll = 'yes';
        $("#Cleaner_Ll_YES").addClass('active');
        $("#Cleaner_Ll_NO").removeClass('active');
    }
    if (value == 'no') {
        Cleaner_Ll = 'no';
        $("#Cleaner_Ll_YES").removeClass('active');
        $("#Cleaner_Ll_NO").addClass('active');
    }
}

function cvcovers_GeographicalAreaExt(value) {
    if (value == 'yes') {
        GeographicalAreaExt = 'yes';
        $("#GeographicalAreaExt_YES").addClass('active');
        $("#GeographicalAreaExt_NO").removeClass('active');
    }
    if (value == 'no') {
        GeographicalAreaExt = 'no';
        $("#GeographicalAreaExt_YES").removeClass('active');
        $("#GeographicalAreaExt_NO").addClass('active');
    }
}

function cvcovers_Additional_Towing(value) {
    if (value == 'yes') {
        Additional_Towing = 'yes';
        $("#Additional_Towing_YES").addClass('active');
        $("#Additional_Towing_NO").removeClass('active');
    }
    if (value == 'no') {
        Additional_Towing = 'no';
        $("#Additional_Towing_YES").removeClass('active');
        $("#Additional_Towing_NO").addClass('active');
    }
}

function cvcovers_fibre_glass_fuel_tank(value) {
    if (value == 'yes') {
        fibre_glass_fuel_tank = 'yes';
        $("#fibre_glass_fuel_tank_YES").addClass('active');
        $("#fibre_glass_fuel_tank_NO").removeClass('active');
    }
    if (value == 'no') {
        fibre_glass_fuel_tank = 'no';
        $("#fibre_glass_fuel_tank_YES").removeClass('active');
        $("#fibre_glass_fuel_tank_NO").addClass('active');
    }
}

function pcvcovers_NonFairingPayingPassengerVal(value) {
    if (value == 'yes') {
        NonFairingPayingPassengerVal = 'yes';
        $("#NonFairingPayingPassengerVal_YES").addClass('active');
        $("#NonFairingPayingPassengerVal_NO").removeClass('active');
    }
    if (value == 'no') {
        NonFairingPayingPassengerVal = 'no';
        $("#NonFairingPayingPassengerVal_YES").removeClass('active');
        $("#NonFairingPayingPassengerVal_NO").addClass('active');
    }
}

function pcvcovers_FairingPayingPassengerVal(value) {
    if (value == 'yes') {
        FairingPayingPassengerVal = 'yes';
        $("#FairingPayingPassengerVal_YES").addClass('active');
        $("#FairingPayingPassengerVal_NO").removeClass('active');
    }
    if (value == 'no') {
        FairingPayingPassengerVal = 'no';
        $("#FairingPayingPassengerVal_YES").removeClass('active');
        $("#FairingPayingPassengerVal_NO").addClass('active');
    }
}

function pcvcovers_Conductor_Ll(value) {
    if (value == 'yes') {
        Conductor_Ll = 'yes';
        $("#Conductor_Ll_YES").addClass('active');
        $("#Conductor_Ll_NO").removeClass('active');
    }
    if (value == 'no') {
        Conductor_Ll = 'no';
        $("#Conductor_Ll_YES").removeClass('active');
        $("#Conductor_Ll_NO").addClass('active');
    }
}

function gcv_IMT23(value) {
    if (value == 'yes') {
        IMT23 = 'yes';
        $("#IMT23_YES").addClass('active');
        $("#IMT23_NO").removeClass('active');
    }
    if (value == 'no') {
        IMT23 = 'no';
        $("#IMT23_YES").removeClass('active');
        $("#IMT23_NO").addClass('active');
    }
}

function gcv_OtherUse(value) {
    if (value == 'yes') {
        OtherUse = 'yes';
        $("#OtherUse_YES").addClass('active');
        $("#OtherUse_NO").removeClass('active');
    }
    if (value == 'no') {
        OtherUse = 'no';
        $("#OtherUse_YES").removeClass('active');
        $("#OtherUse_NO").addClass('active');
    }
}

function gcv_PersonalAccidentCoverForEmployee(value) {
    if (value == 'yes') {
        PersonalAccidentCoverForEmployee = 'yes';
        $("#PersonalAccidentCoverForEmployee_YES").addClass('active');
        $("#PersonalAccidentCoverForEmployee_NO").removeClass('active');
    }
    if (value == 'no') {
        PersonalAccidentCoverForEmployee = 'no';
        $("#PersonalAccidentCoverForEmployee_YES").removeClass('active');
        $("#PersonalAccidentCoverForEmployee_NO").addClass('active');
    }
}

function gcv_Coolie_Ll(value) {
    if (value == 'yes') {
        Coolie_Ll = 'yes';
        $("#Coolie_Ll_YES").addClass('active');
        $("#Coolie_Ll_NO").removeClass('active');
    }
    if (value == 'no') {
        Coolie_Ll = 'no';
        $("#Coolie_Ll_YES").removeClass('active');
        $("#Coolie_Ll_NO").addClass('active');
    }
}


var insurer_errormsg = {
    'LM003': 'VEHICLE_NOT_MAPPED',
    'LM004': 'RTO_NOT_MAPPED',
    'LM005': 'PREV_INSURER_NOT_MAPPED',
    'LM006': 'IDV_NOT_AVAILABLE',
    'LM008': 'VEHICLE_NOT_SUPPORTED_BY_INSURER'
};
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
    $(".VehicleName").text(quotes.Summary.Request_Core.vehicle_full.split("|")[0] + " " + quotes.Summary.Request_Core.vehicle_full.split("|")[1] + " " + quotes.Summary.Request_Core.vehicle_full.split("|")[2] + " (" + quotes.Summary.Request_Core.vehicle_id + ")");

    mlist = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var dateVal = new Date(quotes.Summary.Request_Core.vehicle_manf_date);
    var monthName = mlist[dateVal.getMonth()];

    $(".Manufacturer_yr").text(monthName + " " + quotes.Summary.Request_Core.vehicle_manf_date.split("-")[0]);
    $(".RTO").text(quotes.Summary.Request_Core.rto_full.split("|")[1] + ", " + quotes.Summary.Request_Core.rto_full.split("|")[2] + " (" + quotes.Summary.Request_Core.rto_id + ")");
    $('.noInsurer_list_popup').show();
    var res = quotes.Response;
    /*if (quotes.hasOwnProperty('Error_Master')) {
     Error_Master = quotes.Error_Master;
     }*/

    $('#insurer_display').empty();
    for (var i in res) {
        if (res[i]['Error_Code'] !== null && res[i]['Error_Code'] !== "") {
            var error_msg = res[i]['Error_Msg'];
            var ins_name = arr_ins[res[i]['Insurer_Id']];
            $('#insurer_display').append("<tr>"
                    + "<td>" + ins_name + "</td>"
                    + "<td>" + error_msg + "</td>"
                    + "</tr>")
        }
    }

    // Roshni's code
    /*
     var ssid1 = [8154,7582,8067,1]
     if(ssid1.indexOf(ss_id) === -1){
     $('#proccedtomap').hide();
     }
     if (Error_Master != null || Error_Master != "") {
     for (var i in res) {
     if (Error_Master.hasOwnProperty(res[i]['Error_Code'])) {
     
     var error_msg = "";
     if(res[i].hasOwnProperty('Error_Msg')){
     if(res[i]['Error_Msg'] !== "" && res[i]['Error_Msg'] !== null ){
     error_msg =res[i]['Error_Msg'];
     }else{
     error_msg = Error_Master[res[i]['Error_Code']];
     }
     }else{
     error_msg = Error_Master[res[i]['Error_Code']];
     }
     
     
     var ins_name = arr_ins[res[i]['Insurer_Id']];
     if ((res[i]['Error_Code'] === 'LM003'|| res[i]['Error_Code'] === 'LM008') && ssid1.indexOf(ss_id) >=0) {
     $('#insurer_display').append("<tr>"
     + "<td>" + ins_name + "</td>"
     + "<td>" + error_msg + "</td>"
     + "<td style='border:1px solid rgb(195, 194, 194);padding:4px;'>"
     + "<button class='error_btn' onclick='ProccedtoList(" + map_vehicle_id + ',' + res[i]['Insurer_Id'] + ");'>Proceed for mapping</button>"
     + "</td>"
     + "</tr>")
     }else{
     $('#insurer_display').append("<tr>"
     + "<td>" + ins_name + "</td>"
     + "<td>" + error_msg + "</td>"
     
     + "</tr>")
     }				
     }
     }
     }*/

});
$('.noInurerList_closebtn').click(function () {
    $('.noInsurer_list_popup').hide();
});

$('.closeErrpopup').click(function () {
    $('.error_popupbox').hide();
});

// $('#RENEWAL_TAB').click(function (e) {
// $('.sticky_btn').hide();
// $('.divlist').hide();
// $('#dashboardquotelist').show();
// searchFlag = false;
// RenewalShow();
// $('#renewaltbl_quote_list').empty();
// //GetRenewalList();
// });

function GetRenewalList() {

    if (sub_fba_id === "" || sub_fba_id === null) {
        f_sub_fba_id = 0;
    } else if (sub_fba_id !== "") {
        f_sub_fba_id = sub_fba_id;
    }

    var url, method_name;
    if (quoteSearch_url === "") {
        url = GetUrl() + "/renewal_quotes/get_lead_data/" + Product_id + "/" + ss_id + "/" + fba_id + "/" + pageIndex;  //local		
        method_name = "/renewal_quotes/get_lead_data/" + Product_id + "/" + ss_id + "/" + fba_id + "/" + pageIndex;
    } else {
        method_name = quoteSearch_url;
    }

    $.ajax({
        type: "GET",
        data: siteURL.indexOf('https') === 0 ? {'method_name': method_name} : "",
        url: siteURL.indexOf('https') === 0 ? GeteditUrl() + '/horizon-method.php' : url,

        dataType: "json",
        success: function (data) {
            console.log(data);
            $('.sticky_btn').hide();
            if (data.length > 0) {
                for (var i in data) {

                    var Stype = data[i].lead_type;
                    GStype = data[i].lead_type;
                    if (Stype === "lead" || Stype === "sync_contacts") {
                        var CustomerName = data[i].Customer_Name;
                        var leadId = data[i].Lead_Id;
                        var leadType = data[i].lead_type;
                        var policyExpiryDate = data[i].policy_expiry_date;

                        if (CustomerName === null || CustomerName === undefined || CustomerName === "") {
                            CustomerName = "";
                        }
                        if (leadId === null || leadId === undefined || leadId === "") {
                            leadId = "";
                        }
                        if (leadType === null || leadType === undefined || leadType === "") {
                            leadType = "";
                        }
                        if (policyExpiryDate === null || policyExpiryDate === undefined || policyExpiryDate === "") {
                            policyExpiryDate = "";
                        }

                        $('#renewaltbl_quote_list').append(
                                '<div class="lead_section renewList" >' +
                                '<input type="hidden" id="hd_lead_type" value="' + data[i].lead_type + '">' +
                                '<input type="hidden" id="hd_lead_status" value="' + data[i].lead_status + '">' +
                                '<div class="leadgrid">' +
                                '<div class="leadTitle"><b>' + CustomerName + '</b></div>' +
                                '<div style="text-align:center">' +
                                '<div class="texttrans" style="padding: 3px 0px;">Expiry Date</div><div style="padding: 3px 0px;">' + policyExpiryDate + '</div>' +
                                '</div>' +
                                '<div style="text-align:center">' +
                                '<i class="fa fa-info-circle" aria-hidden="true" style="padding:2px 0px;font-size:20px" id="renewinfo_' + data[i].Lead_Id + '"></i>' +
                                '<p>Lead ID :' + data[i].Lead_Id + '</p>' +
                                '</div>' +
                                '</div>' +
                                '<div class="leadgrid1">' +
                                '<div><div class="texttrans" id="source_' + leadId + '">Source :</div>' + leadType + '</div>' +
                                '<div class="renew_btn_design" id="oneclkrenewal_' + data[i].Lead_Id + '_' + data[i].registration_no + '"><button>Renew</button></div>' +
                                '</div>' +
                                '</div>'
                                );
                        $('#oneclkrenewal_' + data[i].Lead_Id + '_' + data[i].registration_no).click(function (e) {
                            var leadid = $(this)[0].id.split('_')[1];
                            GLeadType = $(this).closest('.renewList').find("#hd_lead_type").val();
                            GLeadStatus = $(this).closest('.renewList').find("#hd_lead_status").val();
                            GLeadId = leadid;
                            Lead_proceed(leadid);
                            /*var regNo = $(this)[0].id.split('_')[2];
                             var chLeadType = $(this).closest('.renewList').find("#hd_lead_type").val();
                             if(chLeadType === "lead"){
                             if(regNo !== null && regNo !== '' && regNo !== undefined && regNo !== '---' ){
                             $("#QUOTE_TAB").removeClass('Active');
                             $("#APPLICATION_TAB").removeClass('Active');
                             $("#SELL_TAB").removeClass('Active');
                             $("#RENEWAL_TAB").removeClass('Active');
                             $('.divlist').show();
                             $('.renewSlider').addClass('slider1');
                             $('.basicDetails').show();
                             $('#dashboardquotelist').hide();
                             $('#InputForm').hide();
                             $('.quotelist').hide();
                             $('#Input1').addClass('active');
                             $('#Property').show();
                             $('#Property').addClass('active in');
                             $('#menu').removeClass('active');
                             $("#Reg1,#Reg2,#Reg3,#Reg4 ").val("").removeClass('used');
                             $("#RegistrationNo").val("");
                             $("#FastlaneMsg").text('');									
                             $("#Reg1").val(regNo.slice(0, 2));
                             $("#Reg2").val(regNo.slice(2, 4));
                             $("#Reg3").val(regNo.slice(4, 6));
                             $("#Reg4").val(regNo.slice(6, 10));									
                             }else{
                             
                             Lead_proceed(leadid);
                             }
                             }else{
                             Lead_proceed(leadid);
                             }*/
                        });
                        $('#renewinfo_' + data[i].Lead_Id).click(function (e) {
                            var info_LeadId = $(this)[0].id.split('_')[1];
                            vehicleinfowithLead(info_LeadId);
                        });
                    }
                    if (Stype === "renewal") {
                        var data1 = data[i].renewal_data.Erp_Qt_Request_Core;

                        GLeadType = data[i].lead_type;

                        GLeadStatus = data[i].lead_status;
                        IsTypeFastLane = false;
                        OrgRtoFastLane = '';
                        $('#renewaltbl_quote_list').append(
                                '<div class="lead_section renewList" >' +
                                '<input type="hidden" id="renewalsrn" value="' + data1['___search_reference_number___'] + '">' +
                                '<input type="hidden" id="renewaludid" value="' + data1['___udid___'] + '">' +
                                '<input type="hidden" id="renewalprodid" value="' + data1['___product_id___'] + '">' +
                                '<input type="hidden" id="renewalsubtype" value="' + data1['___vehicle_insurance_subtype___'] + '">' +
                                '<input type="hidden" id="renewalInsuranceTyp" value="' + data1['___vehicle_insurance_type___'] +
                                '">' +
                                '<input type="hidden" id="srcType" value="' + data[i].lead_type + '">' +
                                '<input type="hidden" id="leadId" value="' + data[i].Lead_Id + '">' +
                                '<div class="leadgrid">' +
                                '<div class="leadTitle"><b>' + data1['___contact_name___'] + '</b></div>' +
                                '<div style="text-align:center">' +
                                '<div class="texttrans" style="padding: 3px 0px;">Expiry Date</div><div style="padding: 3px 0px;">' + data1['___policy_end_date___'] + '</div>' +
                                '</div>' +
                                '<div style="text-align:center">' +
                                '<i class="fa fa-info-circle" aria-hidden="true" style="padding:2px 0px;font-size:20px" id="renewinfo_' + data[i].Lead_Id + '"></i>' +
                                '<p>Lead ID :' + data[i].Lead_Id + '</p>' +
                                '</div>' +
                                '</div>' +
                                '<div class="leadgrid1">' +
                                '<div><div class="texttrans" id="source_' + data[i].Lead_Id + '">Source :</div>' + data[i].lead_type + '</div>' +
                                '<div class="renew_btn_design" id="renewalclick_' + data1['___udid___'] + '"><button>Renew</button></div>' +
                                '<div class="renew_btn_design" id="oneclkrenewal_' + data1['___udid___'] + '"><button>One Click Renew</button></div>' +
                                '</div>' +
                                '</div>'
                                );
                        $('.sticky_btn').hide();
                        var $menubox = $(".motor_maindiv").children('.menuBox');
                        $('#renewinfo_' + data[i].Lead_Id).click(function (e) {
                            var info_LeadId = $(this)[0].id.split('_')[1];
                            vehicleinfowithLead(info_LeadId);
                        });

                        $('#renewalclick_' + data1['___udid___']).click(function (e) {
                            GLeadId = $(this).closest('.renewList').find('#leadId').val();
                            var leadType = $(this).closest('.renewList').find('#srcType').val();
                            var leadid = $(this).closest('.renewList').find('#leadId').val();
                            var ProductID = $(this).closest('.renewList').find("#renewalprodid").val();
                            var vehicle_subtype = $(this).closest('.renewList').find('#renewalsubtype').val();
                            var udid = $(this).closest('.renewList').find("#renewaludid").val();
                            var insuranceTyp = $(this).closest('.renewList').find("#renewalInsuranceTyp").val();
                            SRN = $(this).closest('.renewList').find("#renewalsrn").val();
                            $('#hiddenudid').val(udid);
                            $('#hiddenprodId').val(ProductID);
                            $('#hiddensubtypeOrgnl').val(vehicle_subtype);
                            $('#NCBno_btn').removeClass('addActive');
                            $('#NCByes_btn').removeClass('addActive');
                            if (insuranceTyp === "renew") {
                                if (ProductID === "10") {
                                    $('#selectedPlantw').val(vehicle_subtype).attr("selected", "selected");
                                } else {
                                    $('#selectedPlanCar').val(vehicle_subtype).attr("selected", "selected");
                                }
                            } else {
                                $('#selectedPlantw').val("1CH_0TP").attr("selected", "selected");
                            }
                            $('#NCByes_btn').click(function () {
                                $('#NCByes_btn').addClass('addActive');
                                $('#NCBno_btn').removeClass('addActive');
                                $('.noClaimDiv').hide();
                                is_claim_exist = "yes";
                                vehicle_ncb_current = "0";
                                $(".ErrormesgDiv").hide().html("Please Select Claim on Last Year Policy? Yes or No");
                            });
                            $('#NCBno_btn').click(function () {
                                $('#NCBno_btn').addClass('addActive');
                                $('#NCByes_btn').removeClass('addActive');
                                $('.noClaimDiv').show();
                                $('#ncbPercent').val("0").attr("selected", "selected");
                                $("#ncbPercent option[value='0']").attr("selected", "selected");
                                is_claim_exist = "no";
                                vehicle_ncb_current = $("#ncbPercent").val();
                                $(".ErrormesgDiv").hide().html("Please Select Claim on Last Year Policy? Yes or No");
                            });
                            $('.noClaimDiv').hide();
                            $('.ConfDetPopup').show();
                            if (vehicle_subtype !== "0CH_1TP") {
                                $('.claimdiv').show();
                            }
                            if (ProductID === "10") {
                                if (vehicle_subtype === "0CH_1TP") {
                                    //$('.NCBdiv').hide();
                                    $('.claimdiv').hide();
                                    $('.noClaimDiv').hide();
                                    $(".ErrormesgDiv").hide().html("Please Select Claim on Last Year Policy? Yes or No");
                                    $('#NCByes_btn').addClass('addActive');
                                    $('#NCBno_btn').removeClass('addActive');
                                    is_claim_exist = "yes";
                                    vehicle_ncb_current = "0";
                                    $("#selectedPlantw option[value='0CH_1TP']").attr("selected", "selected");
                                } else if (vehicle_subtype === "1OD_0TP") {
                                    $("#selectedPlantw option[value='1OD_0TP']").attr("selected", "selected");
                                }
                                $('#renewquote_subtype_tw').show();
                                $('#selectedPlantw').on('change', function () {
                                    var vehicle_subtype1 = $("#selectedPlantw").val();
                                    if ($("#selectedPlantw").val() === "0CH_1TP") {
                                        //$('.NCBdiv').hide();
                                        $('.claimdiv').hide();
                                        $('.noClaimDiv').hide();
                                        $(".ErrormesgDiv").hide().html("Please Select Claim on Last Year Policy? Yes or No");
                                    } else {
                                        $('.NCBdiv').show();
                                        $('.claimdiv').show();
                                        if ($('#NCBno_btn').hasClass("addActive")) {
                                            $('.noClaimDiv').show();
                                        }
                                        if ($("#selectedPlantw").val() === "1OD_0TP") {
                                            $('.AlertOvl').show();
                                            $('.alert_container').text("Note : You Can Buy OD Only Policy, If You Have Active TP Policy With A Coverage Upto Next Year.");
                                            $('.ok_btn').click(function () {
                                                $('.AlertOvl').hide();
                                            });
                                        }
                                    }
                                    if ($("#selectedPlantw").val() === "0CH_1TP") {
                                        if ($("#selectedPlantw").val() !== "0CH_1TP" && $("#selectedPlantw").val() !== "1OD_0TP") {
                                            $('.NCBdiv').show();
                                            $('.claimdiv').show();
                                        }
                                    }
                                    $('#hiddensubtype').val(vehicle_subtype1);
                                });
                                //$('#hiddensubtype').val(vehicle_subtype);
                            } else {
                                if (vehicle_subtype === "0CH_1TP") {
                                    //$('.NCBdiv').hide();
                                    $('.claimdiv').hide();
                                    $('.noClaimDiv').hide();
                                    $(".ErrormesgDiv").hide().html("Please Select Claim on Last Year Policy? Yes or No");
                                    $('#NCByes_btn').addClass('addActive');
                                    $('#NCBno_btn').removeClass('addActive');
                                    is_claim_exist = "yes";
                                    vehicle_ncb_current = "0";
                                    $("#selectedPlanCar option[value='0CH_1TP']").attr("selected", "selected");
                                    $('#selectedPlanCar').on('change', function () {
                                        var vehicle_subtype1 = $('#selectedPlanCar').val();
                                        $('#hiddensubtype').val(vehicle_subtype1);
                                        if (vehicle_subtype1 === "1CH_0TP") {
                                            $('.AlertOvl').show();
                                            $('.alert_container').text("Note : This Case is Breaking. Your Policy will not issue instantly. It will issue after inspection.");
                                            $('.ok_btn').click(function () {
                                                $('.AlertOvl').hide();
                                            });
                                        }
                                    });
                                } else if (vehicle_subtype === "1OD_0TP") {
                                    $("#selectedPlanCar option[value='1OD_0TP']").attr("selected", "selected");
                                }
                                $('#renewquote_subtype_car').show();
                                $('#selectedPlanCar').on('change', function () {
                                    var vehicle_subtype1 = $('#selectedPlanCar').val();
                                    if ($('#selectedPlanCar').val() === "0CH_1TP") {
                                        //$('.NCBdiv').hide();
                                        $('.claimdiv').hide();
                                        $('.noClaimDiv').hide();
                                        $(".ErrormesgDiv").hide().html("Please Select Claim on Last Year Policy? Yes or No");
                                    } else {
                                        $('.NCBdiv').show();
                                        $('.claimdiv').show();
                                        if ($('#NCBno_btn').hasClass("addActive")) {
                                            $('.noClaimDiv').show();
                                        }
                                        if ($("#selectedPlanCar").val() === "1OD_0TP") {
                                            $('.AlertOvl').show();
                                            $('.alert_container').text("Note : You Can Buy OD Only Policy, If You Have Active TP Policy With A Coverage Upto Next Year.");
                                            $('.ok_btn').click(function () {
                                                $('.AlertOvl').hide();
                                            });
                                        }
                                    }
                                    if (vehicle_subtype1 === "0CH_1TP") {
                                        if ($("#selectedPlanCar").val() !== "0CH_1TP" && $("#selectedPlanCar").val() !== "1OD_0TP") {
                                            $('.NCBdiv').show();
                                            $('.claimdiv').show();
                                        }
                                    }
                                    $('#hiddensubtype').val(vehicle_subtype1);
                                });
                            }
                        });

                        $('#oneclkrenewal_' + data1['___udid___']).click(function (e) {
                            GLeadId = $(this).closest('.renewList').find('#leadId').val();
                            $('#QuoteLoader').show();
                            var url, method_name;
                            var udid = $(this).closest('.renewList').find("#renewaludid").val();
                            if (quoteSearch_url === "") {
                                url = GetUrl() + "/renewal_quotes/getpopupdata/" + udid;  //local		
                                method_name = "/renewal_quotes/getpopupdata/" + udid;
                            } else {
                                method_name = quoteSearch_url;
                            }

                            $.ajax({
                                type: "GET",
                                data: siteURL.indexOf('https') === 0 ? {'method_name': method_name} : "",
                                url: siteURL.indexOf('https') === 0 ? GeteditUrl() + '/horizon-method.php' : url,
                                dataType: "json",
                                success: function (data) {
                                    console.log(data);
                                    if (data === "Not Authorized") {
                                        $('#QuoteLoader').hide();
                                    } else {
                                        var premiumMsg = '';
                                        var min_premium;
                                        var max_premium;
                                        min_premium = data.Summary['Premium_Min'];
                                        max_premium = data.Summary['Premium_Max'];
                                        if (min_premium !== null && min_premium !== undefined && min_premium !== 0) {
                                            premiumMsg = "Your Premium for the given vehicle details will be between " + data.Summary['Premium_Min'] + " and " + data.Summary['Premium_Max'] + " premium.";
                                            $(".renewNow_yes_btn").attr("disabled", false);
                                            $(".proceedDiv").show();
                                            $(".renewNow_yes_btn").show();
                                            $(".renewNow_no_btn").show();
                                            $(".renewNow_ok_btn").hide();
                                            $(".popupMsg").hide();
                                            $(".renewNow_Content").show();
                                            $(".renewNow_Details").show();
                                        } else {
                                            premiumMsg = "Your Premium for the given vehicle details is not available.";
                                            $(".renewNow_yes_btn").attr("disabled", true);
                                            $(".proceedDiv").hide();
                                            $(".renewNow_yes_btn").hide();
                                            $(".renewNow_no_btn").hide();
                                            $(".renewNow_ok_btn").show();
                                            $(".popupMsg").hide();
                                            $(".renewNow_Content").show();
                                            $(".renewNow_Details").show();
                                        }
                                        $("#min_max_premium").text(premiumMsg);
                                        $('#QuoteLoader').hide();
                                        $(".renewNow_inform_popup").show();
                                        $('.renewNow_yes_btn').click(function () {
                                            $('#QuoteLoader').show();
                                            var product_id = parseInt(data.Summary.Request_Core['product_id']);
                                            var Request_Unique_Id = data.Summary['Request_Unique_Id'];
                                            var User_Data_Id = data.Summary.Request_Core['udid'];
                                            var Premium_Min = data.Summary['Premium_Min'];
                                            var Premium_Max = data.Summary['Premium_Max'];
                                            var PB_CRN = data.Summary.Request_Core['crn'];
                                            var vehicle_insurance_subtype = data.Summary.Request_Product['vehicle_insurance_subtype'];
                                            var first_name = data.Summary.Request_Core['first_name'];
                                            var email = data.Summary.Request_Core['email'];

                                            var url, method_name;
                                            var udid = $(this).closest('.renewList').find("#renewaludid").val();
                                            if (quoteSearch_url === "") {
                                                url = GetUrl() + "/renewal_quotes/renewalSendEmailMsg/" + product_id + "/" + Request_Unique_Id + "/" + User_Data_Id + "/" + Premium_Min + "/" + Premium_Max + "/" + PB_CRN + "/" + vehicle_insurance_subtype + "/" + first_name + "/" + email + "/" + ss_id + "/" + fba_id + "/" + ip_address + "/" + mac_address + "/" + app_version + "/" + sub_fba_id;  //local		
                                                method_name = "/renewal_quotes/renewalSendEmailMsg/" + product_id + "/" + Request_Unique_Id + "/" + User_Data_Id + "/" + Premium_Min + "/" + Premium_Max + "/" + PB_CRN + "/" + vehicle_insurance_subtype + "/" + first_name + "/" + email + "/" + ss_id + "/" + fba_id + "/" + ip_address + "/" + mac_address + "/" + app_version + "/" + sub_fba_id;
                                            } else {
                                                method_name = quoteSearch_url;
                                            }
                                            $.ajax({
                                                type: "GET",
                                                data: siteURL.indexOf('https') === 0 ? {'method_name': method_name} : "",
                                                url: siteURL.indexOf('https') === 0 ? GeteditUrl() + '/horizon-method.php' : url,
                                                dataType: "json",
                                                success: function (data) {
                                                    $('#QuoteLoader').hide();
                                                    if (data === "Success") {
                                                        $(".renewNow_Content").hide();
                                                        $(".renewNow_Details").hide();
                                                        $(".renewNow_yes_btn").hide();
                                                        $(".renewNow_no_btn").hide();
                                                        $(".popupMsg").text("Mail Send Successfully.");
                                                        $(".renewNow_ok_btn").show();
                                                        $(".popupMsg").show();
                                                    } else {
                                                        $(".renewNow_Content").hide();
                                                        $(".renewNow_Details").hide();
                                                        $(".renewNow_yes_btn").hide();
                                                        $(".renewNow_no_btn").hide();
                                                        $(".popupMsg").text("Oops. Something went wrong. Please try again later.");
                                                        $(".popupMsg").show();
                                                        $(".renewNow_ok_btn").show();
                                                    }
                                                },
                                                error: function (result) {
                                                    $('#QuoteLoader').hide();
                                                    console.log(result);
                                                }
                                            });
                                        });
                                        $('.renewNow_no_btn').click(function () {
                                            $('.renewNow_inform_popup').hide();
                                        });
                                        $('.renewNow_ok_btn').click(function () {
                                            $('.renewNow_inform_popup').hide();
                                        });
                                    }
                                },
                                error: function (data) {
                                    console.log(data);
                                }
                            });
                        });
                    }
                }
                var is_claim_exist = "";
                var vehicle_ncb_current = "";

                $('.Detpopupclose').click(function () {
                    $('.ConfDetPopup').hide();
                });
                $('select.planTypeDiv').change(function () {
                    var planType = $(this).children("option:selected").val();
                    if (planType === "0CH_1TP") {
                        //$(".NCBdiv").hide();
                        $('.claimdiv').hide();
                        $('.noClaimDiv').hide();
                        $(".ErrormesgDiv").hide().html("Please Select Claim on Last Year Policy? Yes or No");

                    } else {
                        $(".NCBdiv").show();
                    }
                });
                $('#NCByes_btn').click(function () {
                    $('#NCByes_btn').addClass('addActive');
                    $('#NCBno_btn').removeClass('addActive');
                    $('.noClaimDiv').hide();
                    is_claim_exist = "yes";
                    vehicle_ncb_current = "0";
                    $(".ErrormesgDiv").hide().html("Please Select Claim on Last Year Policy? Yes or No");
                });
                $('#NCBno_btn').click(function () {
                    $('#NCBno_btn').addClass('addActive');
                    $('#NCByes_btn').removeClass('addActive');
                    $('.noClaimDiv').show();
                    $("#ncbPercent option[value='0']").attr("selected", "selected");
                    is_claim_exist = "no";
                    vehicle_ncb_current = $("#ncbPercent").val();
                    $(".ErrormesgDiv").hide().html("Please Select Claim on Last Year Policy? Yes or No");
                });
                $("#ncbPercent").on('change', function () {
                    vehicle_ncb_current = $("#ncbPercent").val();
                });
                var checkTpPolicy = "";
                $('#selectedPlanCar').on('change', function () {
                    checkTpPolicy = $('#selectedPlanCar').val();
                    $('#hiddensubtype').val(checkTpPolicy);
                });
                $('#selectedPlantw').on('change', function () {
                    checkTpPolicy = $('#selectedPlantw').val();
                    $('#hiddensubtype').val(checkTpPolicy);
                });
                $('#quoteButton').click(function () {
                    if (checkTpPolicy === "0CH_1TP") {
                        $('#NCByes_btn').addClass("addActive");
                        $('#NCBno_btn').addClass("addActive");
                    }
                    ;
                    if (!$('#NCByes_btn').hasClass("addActive") && !$('#NCBno_btn').hasClass("addActive")) {
                        $(".ErrormesgDiv").show().html("Please Select Claim on Last Year Policy? Yes or No");
                    } else {
                        $(".ErrormesgDiv").hide().html("Please Select Claim on Last Year Policy? Yes or No");
                        if (checkTpPolicy === "0CH_1TP") {
                            $('#NCByes_btn').removeClass("addActive");
                            $('#NCBno_btn').removeClass("addActive");
                            is_claim_exist = "yes";
                            vehicle_ncb_current = "0";
                        }
                        var quote_udid = $("#hiddenudid").val();
                        var quote_subtype = $("#hiddensubtype").val();
                        if (quote_subtype === "") {
                            quote_subtype = $('#hiddensubtypeOrgnl').val();
                        }
                        var quote_prodId = $("#hiddenprodId").val();

                        $('.ConfDetPopup').hide();
                        $('#QuoteLoader').show();

                        var quote_url, method_name1;
                        if (quoteSearch_url === "") {
                            quote_url = GetUrl() + "/renewal_quotes/premium_initiate/" + quote_prodId + "/" + quote_udid + "/" + quote_subtype + "/" + is_claim_exist + "/" + vehicle_ncb_current;

                            method_name1 = "/renewal_quotes/premium_initiate/" + quote_prodId + "/" + quote_udid + "/" + quote_subtype + "/" + is_claim_exist + "/" + vehicle_ncb_current;
                        } else {
                            method_name1 = quoteSearch_url;
                        }

                        $.ajax({
                            type: "GET",
                            data: siteURL.indexOf('https') === 0 ? {'method_name': method_name1} : "",
                            url: siteURL.indexOf('https') === 0 ? GeteditUrl() + '/horizon-method.php' : quote_url,
                            datatype: "json",
                            success: function (data) {
                                console.log(data);
                                //$('#QuoteLoader').show();
                                if (data.hasOwnProperty('Summary') && data.Summary.hasOwnProperty('Request_Unique_Id')) {
                                    SRN = data.Summary.Request_Unique_Id;
                                    $('#QuoteLoader').hide();
                                    $('.maininput').hide();
                                    $('.quotelist').show();
                                    $('.divlist').show();
                                    $('#dashboardquotelist').hide();
                                    $('.loading').show();
                                    $('#Property').removeClass('active in');
                                    $('#Appl').addClass('active in');
                                    Get_Search_Summary();
                                    Get_Saved_Data();
                                    $('#addonChecked').prop('checked', false);
                                    $('#SelectAllAddons').prop('checked', false);
                                }
                            }
                        });
                    }
                });
            } else {
                var htmllist = $("#renewaltbl_quote_list").html();
                if (htmllist.length === 0) {
                    $('#renewaltbl_quote_list').append("<div style ='text-align:center;font-weight: bold;font-size: 18px;'>No Record found</div>");
                }
            }
            $('#QuoteLoader').hide();
        },
        error: function (result) {
        }
    });
}

function Lead_proceed(lead_id) {
    if (lead_id !== null && lead_id !== "" && lead_id !== undefined) {
        AddQuote();
        CheckType('RENEW');
        $('#InputForm').show();
        $('.basicDetails').hide();
        $('#VehicleType').val('renew');
        $('.footerDiv').show();
        GetDataFromLead(lead_id);
        $(".warningmsg").hide();
        $(".policyType").show();
    } else {
        $('.Car_insurer_main_cls').hide();
        $('#maindiv').removeClass("hidden");
        $(".quickSection ").hide();
        $(".detailSection").show().removeClass('hidden');
    }
}

var lead_res;
function GetDataFromLead(lead_id) {
    $.ajax({
        type: "GET",
        data: siteURL.indexOf('https') === 0 ? {'method_name': "/renewal_quotes/get_leadid/" + lead_id} : "",
        url: siteURL.indexOf('https') === 0 ? GeteditUrl() + '/horizon-method.php' : GetUrl() + "/renewal_quotes/get_leadid/" + lead_id,
        dataType: "json",
        success: function (data) {
            data = JSON.stringify(data);
            data = JSON.parse(data);
            console.log("lead data" + data);
            lead_res = data;
            $('#VehicleType').val('renew');
            CheckType('RENEW');
            if (GLeadType === "sync_contacts") {
                var modelId = "";
                if (data.Make_Name != "" && data.Make_Name != null) {
                    if (data.Model_Name === null || data.Model_Name === "" || data.Model_Name === undefined) {
                        $('#MakeModel').val(data.Make_Name);
                    } else {
                        $('#MakeModel').val(data.Make_Name + ', ' + data.Model_Name);
                    }
                    $('#MakeModel').addClass('used');
                    $("#ErMakeModel").hide().html("");
                    $('#MakeName').val(data.Make_Name);
                    $('#ModelName').val(data.Model_Name);
                    $('#MakeModelID').val(data.Model_ID);
                } else {
                    //$("#ErMakeModel").show().html("Please Enter Proper " + Product_Name + " Make And Model.");
                }
                if (data.Fuel_Name != null && data.Fuel_Name != "") {
                    FuelSelected = (data.Fuel_Name).toUpperCase();
                    if (Product_Name == "Car") {
                        CallFuelOnModelSelect(data.Model_ID);
                    }
                } else {
                    FuelSelected = "";
                    BindMakeModel();
                    console.log(FilterVehicleList);
                    modelId = data.Model_ID;
                    if (data.Model_ID === null || data.Model_ID === "" || data.Model_ID === undefined) {
                        modelId = FilterVehicleList[0].Model_ID;
                    }
                    if (data.Model_Name === null || data.Model_Name === "" || data.Model_Name === undefined) {
                        $('#MakeModel').val(data.Make_Name + ', ' + FilterVehicleList[0].Model_Name);
                    }
                    $('#MakeModelID').val(modelId);
                    CallFuelOnModelSelect(modelId);
                }
                if (data.Vehicle_ID != null && data.Vehicle_ID != 0 && data.Vehicle_ID != "0" && data.Vehicle_ID >= 0) {
                    VariantIDSelected = data.Vehicle_ID;
                    $("#VariantID").val(VariantIDSelected).removeClass('Unselected');
                    if (Product_Name == "Car") {
                        if (data.Model_Name != null && data.Model_Name != "" && data.Fuel_Name != null && data.Fuel_Name != "") {
                            $("#MakeModelID").val(data.Model_ID);
                            CallVariantOnModelSelect(data.Model_ID);
                        } else {
                        }
                    }
                    if (Product_Name == "Bike") {
                        if (data.Model_Name != null && data.Model_Name != "") {
                            $("#MakeModelID").val(data.Model_ID);
                            CallVariantOnModelSelect(data.Model_ID);
                        } else {
                        }
                    }
                } else {
                    if (!(data.Variant_Name === null || data.Variant_Name === "" || data.Variant_Name === undefined)) {
                        leadVrntName = data.Variant_Name;
                        if (!(data.Model_ID === null || data.Model_ID === "" || data.Model_ID === undefined)) {
                            CallVariantOnModelSelect(data.Model_ID);
                        } else {
                            CallVariantOnModelSelect(modelId);
                        }
                    }
                }
                if (data.VehicleCity_RTOCode != "" && data.VehicleCity_RTOCode != null && data.RTO_City != "" && data.RTO_City != null) {
                    $('#CityofRegitration').val("(" + data.VehicleCity_RTOCode.toString() + ") " + data.RTO_City.toString().toLowerCase());
                    $('#CityofRegitrationID').val(data.VehicleCity_Id);
                    $('#CityofRegitration').addClass('used');
                    $("#ErCityofRegitration").hide().html("");
                } else {
                    $('#CityofRegitration').removeClass('used');
                    leadCty = data.RTO_City;
                    BindModel_rto();
                }
            } else {
                if (data.Make_Name != "" && data.Make_Name != null && data.Model_Name != "" && data.Model_Name != null) {
                    $('#MakeModel').val(data.Make_Name + ', ' + data.Model_Name);
                    $('#MakeModel').addClass('used');
                    $("#ErMakeModel").hide().html("");
                    $('#MakeName').val(data.Make_Name);
                    $('#ModelName').val(data.Model_Name);
                    $('#MakeModelID').val(data.Model_ID);
                } else {
                    //$("#ErMakeModel").show().html("Please Enter Proper " + Product_Name + " Make And Model.");
                }
                if (data.Fuel_Name != null && data.Fuel_Name != "") {

                    FuelSelected = (data.Fuel_Name).toUpperCase();
                    if (Product_Name == "Car") {
                        CallFuelOnModelSelect(data.Model_ID);
                    }
                } else { //$("#ErFuelType").show().html("Please Enter Proper Fuel Name.");
                }
                if (data.Vehicle_ID != null && data.Vehicle_ID != 0 && data.Vehicle_ID != "0" && data.Vehicle_ID >= 0) {
                    VariantIDSelected = data.Vehicle_ID;
                    $("#VariantID").val(VariantIDSelected).removeClass('Unselected');
                    if (Product_Name == "Car") {
                        if (data.Model_Name != null && data.Model_Name != "" && data.Fuel_Name != null && data.Fuel_Name != "") {
                            $("#MakeModelID").val(data.Model_ID);
                            CallVariantOnModelSelect(data.Model_ID);
                        } else { //$("#ErVariantID").show().html("Please Enter Proper Variant Name."); 
                        }
                    }
                    if (Product_Name == "Bike") {
                        if (data.Model_Name != null && data.Model_Name != "") {
                            $("#MakeModelID").val(data.Model_ID);
                            CallVariantOnModelSelect(data.Model_ID);
                        } else { //$("#ErVariantID").show().addClass('DetailsError'); 
                        }
                    }
                } else {
                    $("#VariantID").empty();
                    $("#VariantID").append('<option value="0">Select Variant</option>');
                    $('label[for=VariantID], input#VariantID').hide();
                }
                if (data.VehicleCity_RTOCode != "" && data.VehicleCity_RTOCode != null && data.RTO_City != "" && data.RTO_City != null) {
                    $('#CityofRegitration').val("(" + data.VehicleCity_RTOCode.toString() + ") " + data.RTO_City.toString().toLowerCase());
                    $('#CityofRegitrationID').val(data.VehicleCity_Id);
                    $('#CityofRegitration').addClass('used');
                    $("#ErCityofRegitration").hide().html("");
                } else {
                    $('#CityofRegitration').removeClass('used');
                }
            }

            if (data.vehicle_registration_date != "" && data.vehicle_registration_date != null) {
                var rnwdate = data.vehicle_registration_date.split('-')[0];
                var rnwyr = data.vehicle_registration_date.split('-')[2];
                var d = new Date(data.vehicle_registration_date);
                var rnwmonth = d.getMonth() + 1;
                rnwmonth = ("0" + (rnwmonth)).slice(-2);
                $('#DOPCRenew').val(rnwdate + '-' + rnwmonth + '-' + rnwyr);
                $('#DOPCRenew').addClass('used');
                $("#ErDOPCRenew").hide().html("");
                $('#DateofPurchaseofCar').val(rnwdate + '-' + rnwmonth + '-' + rnwyr);

            } else {
                $('#DOPCRenew').removeClass('used');
            }
            if (data.vehicle_manf_date != "" && data.vehicle_manf_date != null) {
                var rnwyr = data.vehicle_manf_date.split('-')[0];
                var d = new Date(data.vehicle_manf_date);
                var rnwmonth = d.getMonth() + 1;
                rnwmonth = ("0" + (rnwmonth)).slice(-2);
                $('#ManufactureDate').val(rnwmonth + '-' + rnwyr);
                $('#ManufactureDate').addClass('used');
                $("#ErManufactureDate").hide().html("");
            } else {
                $('#ManufactureDate').removeClass('used');
            }
            if (data.policy_expiry_date != "" && data.policy_expiry_date != null) {
                var rnwdate = data.policy_expiry_date.split('-')[2];
                var rnwmonth = data.policy_expiry_date.split('-')[1];
                var rnwyr = data.policy_expiry_date.split('-')[0];
                $('#PolicyExpiryDate').val(rnwdate + '-' + rnwmonth + '-' + rnwyr);
                $('#PolicyExpiryDate').addClass('used');
                $("#ErPolicyExpiryDate").hide().html("");

            } else {
                $('#PolicyExpiryDate').removeClass('used');
            }
            if (data.prev_insurer_id != "" && data.prev_insurer_id != null) {
                $('#PreviousInsurer').val(data.prev_insurer_id);
                $('#PreviousInsurer').addClass('used');
                $("#ErPreviousInsurer").hide().html("");
            } else {
                $('#PreviousInsurer').removeClass('used');
            }
            console.log("%=" + data.vehicle_ncb_current);
            if (data.is_policy_exist == 'yes') {
                $('#ExistPolicyYes').attr('checked', 'checked');
                $("#lblPolicyExist-Yes").addClass('btn-primarySelected active').removeClass('btn-UnSelected');
                $("#lblPolicyExist-No").addClass('btn-UnSelected').removeClass('btn-primarySelected active');
                IsPolicyExistFlag = "yes";
                $("#PolicyExist").show();
            } else if (data.is_policy_exist == 'no') {
                $('#ExistPolicyNo').attr('checked', 'checked');
                $("#lblPolicyExist-No").addClass('btn-primarySelected active').removeClass('btn-UnSelected');
                $("#lblPolicyExist-Yes").addClass('btn-UnSelected').removeClass('btn-primarySelected active');
                IsPolicyExistFlag = "no";
                $("#PolicyExist").hide();
                $("#PolicyExpiryDate").val();
                $('.PolicyExpiryDate').hide();
                $("#PreviousInsurer").val();
                $(".PreviousInsurer").hide();
                $('.NOTP').hide();
            }

            if (data.is_policy_exist == 'yes') {
                var PolExpDate = (data.policy_expiry_date).split("-")
                PolExpDate = PolExpDate[2] + "-" + PolExpDate[1] + "-" + PolExpDate[0];
                $("#PolicyExpiryDate").val(PolExpDate);
                myfunction1();
            }

            if (data.is_claim_exists == "yes") {
                $("#HaveNCBCertificate").val("No");
                $(".NCBYes").removeClass('btn-UnSelected btnError').addClass('btn-primarySelected active');
                $(".NCBNo").removeClass('active');
                $("#divNoClaimBonusPercent").slideUp();
            } else {
                $("#HaveNCBCertificate").val("Yes");
                $(".NCBYes").removeClass('active')
                $(".NCBNo").removeClass('btn-UnSelected btnError').addClass('btn-primarySelected active');
                $("#divNoClaimBonusPercent").slideDown();
            }
            var $range1 = $("#range1"),
                    $update1 = $("#txttenure");
            var custom_values = [0, 20, 25, 35, 45, 50];
            var my_from = custom_values.indexOf(parseInt(data.vehicle_ncb_current));
            var my_to = custom_values.indexOf(50);
            $range1.ionRangeSlider({
                type: "single",
                min: 0,
                from: my_from,
                max: 50,
                step: 5,
                grid: true,
                grid_snap: true,
                values: custom_values
            });
            if (data.Customer_Name != "" && data.Customer_Name != null) {
                $('#ContactName').val(data.Customer_Name);
                $('#ContactName').addClass('used');
                $("#ErContactName").hide().html("");
            } else {
                $('#ContactName').removeClass('used');
            }
            if (data.mobile != "" && data.mobile != null) {
                $('#ContactMobile').val(data.mobile);
                $('#ContactMobile').addClass('used');
                $("#ErContactMobile").hide().html("");
            } else {
                $('#ContactMobile').removeClass('used');
            }
        },
        error: function (data) {
            $.alert("Cannot Proceed Now. Please Try Again!");
            console.log(data);
        }
    });
}
function showCrossSellFunc(udid) {
    $("#ul_csell").attr("udid", udid);

    if (Product_id === "1") {
        $("#CrossSell_Car").hide();
    } else if (Product_id === "10") {
        $("#CrossSell_TW").hide();
    } else if (Product_id === "12") {
        $("#CrossSell_CV").hide();
    }

    $('.crossSell_popup').show();
}

$("#ul_csell li a").on('click', function () {
    var product = $(this).text().trim();
    var udid = $("#ul_csell").attr("udid");
    var CrossSell_changeUrl = window.location.href.split("?")[0];
    if (product === "Health") {


        $(this).attr("href", "https://www.policyboss.com/Health_Web/health_main.html?ss_id=" + ss_id + "&fba_id=" + fba_id + "&ip_address=" + ip_address + "&mac_address=" + mac_address + "&app_version=" + app_version + "&udid=" + udid);
        try {
            Android.crossselltitle("HEALTH INSURANCE");
        } catch (e) {
            $(this).attr("href", "https://www.policyboss.com/Health_Web/health_main.html?ss_id=" + ss_id + "&fba_id=" + fba_id + "&ip_address=" + ip_address + "&mac_address=" + mac_address + "&app_version=" + app_version + "&udid=" + udid);
        }


    } else if (product === "Bike") {
        $(this).attr("href", CrossSell_changeUrl + "?ss_id=" + ss_id + "&fba_id=" + fba_id + "&ip_address=" + ip_address + "&mac_address=" + mac_address + "&app_version=" + app_version + "&product_id=10&udid=" + udid);

        try {
            Android.crossselltitle("TWO WHEELER INSURANCE");
        } catch (e) {
            $(this).attr("href", CrossSell_changeUrl + "?ss_id=" + ss_id + "&fba_id=" + fba_id + "&ip_address=" + ip_address + "&mac_address=" + mac_address + "&app_version=" + app_version + "&product_id=10&udid=" + udid);
        }


    } else if (product === "CV") {

        $(this).attr("href", CrossSell_changeUrl + "?ss_id=" + ss_id + "&fba_id=" + fba_id + "&ip_address=" + ip_address + "&mac_address=" + mac_address + "&app_version=" + app_version + "&product_id=12&udid=" + udid);

        try {
            Android.crossselltitle("COMMERCIAL VEHICLE INSURANCE");
        } catch (e) {
            $(this).attr("href", CrossSell_changeUrl + "?ss_id=" + ss_id + "&fba_id=" + fba_id + "&ip_address=" + ip_address + "&mac_address=" + mac_address + "&app_version=" + app_version + "&product_id=12&udid=" + udid);
        }

    } else if (product === "Car") {

        $(this).attr("href", CrossSell_changeUrl + "?ss_id=" + ss_id + "&fba_id=" + fba_id + "&ip_address=" + ip_address + "&mac_address=" + mac_address + "&app_version=" + app_version + "&product_id=1&udid=" + udid);

        try {
            Android.crossselltitle("MOTOR INSURANCE");
        } catch (e) {
            $(this).attr("href", CrossSell_changeUrl + "?ss_id=" + ss_id + "&fba_id=" + fba_id + "&ip_address=" + ip_address + "&mac_address=" + mac_address + "&app_version=" + app_version + "&product_id=1&udid=" + udid);
        }

    }

});

function get_crosssell() {
    $.ajax({
        type: "GET",
        data: siteURL.indexOf('https') === 0 ? {'method_name': "/user_datas/view/" + udid} : "",
        url: siteURL.indexOf('https') === 0 ? GeteditUrl() + '/horizon-method.php' : GetUrl() + "/user_datas/view/" + udid,
        dataType: "json",
        success: function (data) {
            origin_crn = data['0'].PB_CRN;
            console.log('udid data', data['0'].Proposal_Request);
            var prm_data = data['0'].Proposal_Request;
            var erp_data = data['0'].Erp_Qt_Request_Core;

            if (prm_data !== undefined) {
                origin_email = prm_data["email"];
                document.getElementById("ContactName").value = prm_data["first_name"] + " " + prm_data["last_name"];
                $('#ContactName').addClass('used');
                $("#ErContactName").hide().html("");
                document.getElementById("ContactMobile").value = prm_data["mobile"];
                $('#ContactMobile').addClass('used');
                $("#ErContactMobile").hide().html("");
                if (erp_data.hasOwnProperty("___pb_rto_city___")) {
                    $('#CityofRegitrationID').val(erp_data["___pb_vehiclecity_id___"]);
                    $('#CityofRegitration').val("(" + erp_data["___pb_vehiclecity_rtocode___"].toString() + ") " + erp_data["___pb_rto_city___"].toString().toLowerCase());
                    $('#CityofRegitration').addClass('used');
                    $("#ErCityofRegitration").hide().html("");
                }
            }
        }
    });
}

var oneclickRenewalData = [];
function oneclickRenewal(request) {

    var oneclickRenewalData = {
        "product_id": parseInt(Product_id),
        "vehicle_id": request.Summary.Request_Product.vehicle_id,
        "rto_id": request.Summary.Request_Product.rto_id,
        "vehicle_insurance_type": request.Summary.Request_Product.vehicle_insurance_type,
        "vehicle_manf_date": request.Summary.Request_Product.vehicle_manf_date,
        "vehicle_registration_date": request.Summary.Request_Product.vehicle_registration_date,
        "policy_expiry_date": request.Summary.Request_Product.policy_expiry_date,
        "prev_insurer_id": request.Summary.Request_Product.prev_insurer_id,
        "vehicle_registration_type": request.Summary.Request_Product.vehicle_registration_type,
        "method_type": request.Summary.Request_Core.method_type,
        "execution_async": request.Summary.Request_Core.execution_async,
        "electrical_accessory": parseInt(request.Summary.Request_Core.electrical_accessory),
        "non_electrical_accessory": parseInt(request.Summary.Request_Core.non_electrical_accessory),
        "registration_no": request.Summary.Request_Core.registration_no,
        "is_llpd": request.Summary.Request_Core.is_llpd == "Yes" ? "yes" : "no",
        "is_antitheft_fit": request.Summary.Request_Core.is_antitheft_fit == "Yes" ? "yes" : "no",
        "voluntary_deductible": request.Summary.Request_Core.voluntary_deductible,
        "is_external_bifuel": request.Summary.Request_Core.is_external_bifuel,
        "is_aai_member": request.Summary.Request_Core.is_aai_member == "Yes" ? "yes" : "no",
        "is_inspection_done": "no",
        "external_bifuel_type": request.Summary.Request_Core.external_bifuel_type,
        "external_bifuel_value": request.Summary.Request_Core.external_bifuel_value > 0 ? request.Summary.Request_Core.external_bifuel_value : "",
        "pa_owner_driver_si": request.Summary.Request_Core.pa_owner_driver_si == "" ? 1500000 : parseInt(request.Summary.Request_Core.pa_owner_driver_si),
        "is_pa_od": request.Summary.Request_Core.is_pa_od == "Yes" ? "yes" : "no",
        "is_having_valid_dl": request.Summary.Request_Core.is_having_valid_dl == "Yes" ? "yes" : "no",
        "is_opted_standalone_cpa": request.Summary.Request_Core.is_opted_standalone_cpa == "No" ? "no" : "yes",
        "pa_named_passenger_si": request.Summary.Request_Core.pa_named_passenger_si == undefined ? "0" : request.Summary.Request_Core.pa_named_passenger_si,
        "pa_unnamed_passenger_si": request.Summary.Request_Core.pa_unnamed_passenger_si == undefined ? "0" : request.Summary.Request_Core.pa_unnamed_passenger_si,
        "pa_paid_driver_si": request.Summary.Request_Core.pa_paid_driver_si == "Yes" ? "100000" : "0",
        "vehicle_expected_idv": parseInt(request.Summary.Request_Core.vehicle_expected_idv),
        "first_name": request.Summary.Request_Core.first_name,
        "middle_name": request.Summary.Request_Core.middle_name,
        "last_name": request.Summary.Request_Core.last_name,
        "mobile": request.Summary.Request_Core.mobile,
        "email": request.Summary.Request_Core.email,
        "crn": request.Summary.PB_CRN,
        "ss_id": request.Summary.Request_Core.ss_id,
        "fba_id": request.Summary.Request_Core.fba_id,
        "geo_lat": geo_lat ? geo_lat : 0,
        "geo_long": geo_long ? geo_long : 0,
        "agent_source": "",
        "client_id": 2,
        "ip_address": request.Summary.Request_Core.ip_address,
        "app_version": request.Summary.Request_Core.app_version,
        "mac_address": request.Summary.Request_Core.mac_address,
        "search_reference_number": request.Summary.Request_Unique_Id,
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
        "is_financed": "no",
        "is_oslc": request.Summary.Request_Core.is_oslc == "Yes" ? "yes" : "no",
        "oslc_si": request.Summary.Request_Core.oslc_si == "" ? 0 : parseInt(request.Summary.Request_Core.oslc_si),
        "is_breakin": request.Summary.Request_Core.is_breakin,
        "is_policy_exist": request.Summary.Request_Core.is_policy_exist,
        "ip_city_state": ip_city_state ? ip_city_state : ""
    };

    /*   if($("#TPCompPlan").val() !== "1OD_0TP" && ($('#VehicleType').val() === "renew") &&  (Product_id == 1 || Product_id == 10)){
     oneclickRenewalData['is_tp_policy_exists'] = IsTPPolicyExistflag;
     }//mg */

    if (sub_fba_id != '' || sub_fba_id != null) {
        oneclickRenewalData["sub_fba_id"] = request.Summary.Request_Core.sub_fba_id;
    }
    if (Product_id == 10) {
        oneclickRenewalData["is_tppd"] = request.Summary.Request_Core.is_tppd == "yes" ? "yes" : "no";
    }


    if (Product_id == 12) {
        oneclickRenewalData["vehicle_class"] = request.Summary.Request_Core.vehicle_class;
        oneclickRenewalData["vehicle_class_code"] = request.Summary.Request_Core.vehicle_class_code;
        oneclickRenewalData["vehicle_sub_class"] = request.Summary.Request_Core.vehicle_sub_class;
        oneclickRenewalData["own_premises"] = own_premises;
        oneclickRenewalData["cleaner_ll"] = Cleaner_Ll;
        oneclickRenewalData["geographicalareaext"] = GeographicalAreaExt;
        oneclickRenewalData["additionaltowing"] = Additional_Towing;
        oneclickRenewalData["fibreglasstankfitted"] = fibre_glass_fuel_tank;

        oneclickRenewalData["imt23"] = IMT23;
        oneclickRenewalData["other_use"] = OtherUse;
        oneclickRenewalData["emp_pa"] = PersonalAccidentCoverForEmployee;
        oneclickRenewalData["coolie_ll"] = Coolie_Ll;

        oneclickRenewalData["non_fairing_paying_passenger"] = NonFairingPayingPassengerVal;
        oneclickRenewalData["fairing_paying_passenger"] = FairingPayingPassengerVal;
        oneclickRenewalData["conductor_ll"] = Conductor_Ll;

    }


    $('#NCByes_btn').click(function () {
        $('#NCByes_btn').addClass('addActive');
        $('#NCBno_btn').removeClass('addActive');
        $('.noClaimDiv').hide();
        is_claim_exist = "yes";
        vehicle_ncb_current = "0";
        $(".ErrormesgDiv").hide().html("Please Select Claim on Last Year Policy? Yes or No");
    });
    $('#NCBno_btn').click(function () {
        $('#NCBno_btn').addClass('addActive');
        $('#NCByes_btn').removeClass('addActive');
        $('.noClaimDiv').show();
        $('#ncbPercent').val("0").attr("selected", "selected");
        $("#ncbPercent option[value='0']").attr("selected", "selected");
        is_claim_exist = "no";
        vehicle_ncb_current = $("#ncbPercent").val();
        $(".ErrormesgDiv").hide().html("Please Select Claim on Last Year Policy? Yes or No");
    });
    $('.ConfDetPopup').show();
    if (Product_id === "10") {
        $('#renewquote_subtype_tw').show();
        $('#selectedPlantw').on('change', function () {
            var vehicle_subtype1 = $("#selectedPlantw").val();
            if ($("#selectedPlantw").val() === "0CH_1TP") {
                $('.claimdiv').hide();
                $('.noClaimDiv').hide();
                $(".ErrormesgDiv").hide().html("Please Select Claim on Last Year Policy? Yes or No");
            } else {
                $('.NCBdiv').show();
                $('.claimdiv').show();
                if ($('#NCBno_btn').hasClass("addActive")) {
                    $('.noClaimDiv').show();
                }
                if ($("#selectedPlantw").val() === "1OD_0TP") {
                    $('.AlertOvl').show();
                    $('.alert_container').text("Note : You Can Buy OD Only Policy, If You Have Active TP Policy With A Coverage Upto Next Year.");
                    $('.ok_btn').click(function () {
                        $('.AlertOvl').hide();
                    });
                }
            }
            if ($("#selectedPlantw").val() === "0CH_1TP") {
                if ($("#selectedPlantw").val() !== "0CH_1TP" && $("#selectedPlantw").val() !== "1OD_0TP") {
                    $('.NCBdiv').show();
                    $('.claimdiv').show();
                }
            }
        });
    } else {
        $('#renewquote_subtype_car').show();
        $('#selectedPlanCar').on('change', function () {
            var vehicle_subtype1 = $('#selectedPlanCar').val();
            if ($('#selectedPlanCar').val() === "0CH_1TP") {
                $('.claimdiv').hide();
                $('.noClaimDiv').hide();
                $(".ErrormesgDiv").hide().html("Please Select Claim on Last Year Policy? Yes or No");
            } else {
                $('.NCBdiv').show();
                $('.claimdiv').show();
                if ($('#NCBno_btn').hasClass("addActive")) {
                    $('.noClaimDiv').show();
                }
                if ($("#selectedPlanCar").val() === "1OD_0TP") {
                    $('.AlertOvl').show();
                    $('.alert_container').text("Note : You Can Buy OD Only Policy, If You Have Active TP Policy With A Coverage Upto Next Year.");
                    $('.ok_btn').click(function () {
                        $('.AlertOvl').hide();
                    });
                }
            }
            if (vehicle_subtype1 === "0CH_1TP") {
                if ($("#selectedPlanCar").val() !== "0CH_1TP" && $("#selectedPlanCar").val() !== "1OD_0TP") {
                    $('.NCBdiv').show();
                    $('.claimdiv').show();
                }
            }
        });
    }
    var is_claim_exist = "";
    var vehicle_ncb_current = "";
    $('.Detpopupclose').click(function () {
        $('.ConfDetPopup').hide();
    });
    $('select.planTypeDiv').change(function () {
        var planType = $(this).children("option:selected").val();
        if (planType === "0CH_1TP") {
            $('.claimdiv').hide();
            $('.noClaimDiv').hide();
            $(".ErrormesgDiv").hide().html("Please Select Claim on Last Year Policy? Yes or No");

        } else {
            $(".NCBdiv").show();
        }
    });
    $('#NCByes_btn').click(function () {
        $('#NCByes_btn').addClass('addActive');
        $('#NCBno_btn').removeClass('addActive');
        $('.noClaimDiv').hide();
        is_claim_exist = "yes";
        vehicle_ncb_current = "0";
        $(".ErrormesgDiv").hide().html("Please Select Claim on Last Year Policy? Yes or No");
    });
    $('#NCBno_btn').click(function () {
        $('#NCBno_btn').addClass('addActive');
        $('#NCByes_btn').removeClass('addActive');
        $('.noClaimDiv').show();
        $("#ncbPercent option[value='0']").attr("selected", "selected");
        is_claim_exist = "no";
        vehicle_ncb_current = $("#ncbPercent").val();
        $(".ErrormesgDiv").hide().html("Please Select Claim on Last Year Policy? Yes or No");
    });
    $("#ncbPercent").on('change', function () {
        vehicle_ncb_current = $("#ncbPercent").val();
    });
    var checkTpPolicy = "1CH_0TP";
    var checkCarPolicy = "";
    $('#selectedPlanCar').on('change', function () {
        checkTpPolicy = $('#selectedPlanCar').val();
    });
    $('#selectedPlantw').on('change', function () {
        checkTpPolicy = $('#selectedPlantw').val();
    });
    $('.Detpopupclose').click(function () {
        $('.ConfDetPopup').hide();
    });
    if (Product_id == 1 && checkTpPolicy == "0CH_1TP") {
        $('.bikeAttribute').removeClass('hidden');
        oneclickRenewalData["is_tppd"] = request.Summary.Request_Core.is_tppd == "yes" ? "yes" : "no";
    }
    $('#quoteButton').click(function () {
        if (!$('#NCByes_btn').hasClass("addActive") && !$('#NCBno_btn').hasClass("addActive")) {
            $(".ErrormesgDiv").show().html("Please Select Claim on Last Year Policy? Yes or No");
        } else {
            $(".ErrormesgDiv").hide().html("Please Select Claim on Last Year Policy? Yes or No");
            if (checkTpPolicy === "0CH_1TP") {
                $('#NCByes_btn').removeClass("addActive");
                $('#NCBno_btn').removeClass("addActive");
                is_claim_exist = "yes";
                vehicle_ncb_current = "0";
            }
            var quote_subtype = checkTpPolicy;
            $('.ConfDetPopup').hide();
            $('#QuoteLoader').show();
            var quote_udid = udid;
            console.log(origin_udid);
            var quote_prodId = Product_id;
            var quote_url, method_name1;

            oneclickRenewalData["vehicle_ncb_current"] = vehicle_ncb_current;
            oneclickRenewalData["is_claim_exists"] = is_claim_exist;
            oneclickRenewalData["vehicle_insurance_subtype"] = quote_subtype;

            if (GLeadId != null && GLeadType != null && GLeadStatus != null && GLeadId != '' && GLeadType != '' && GLeadStatus != '' && GLeadId != undefined && GLeadType != undefined && GLeadStatus != undefined) {
                oneclickRenewalData["lead_id"] = GLeadId;

                oneclickRenewalData["lead_type"] = GLeadType;
                oneclickRenewalData["lead_status"] = GLeadStatus;
            }

            var obj_horizon_data = Horizon_Method_Convert("/quote/premium_initiate", oneclickRenewalData, "POST");

            $.ajax({
                type: "POST",
                data: siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(oneclickRenewalData),
                url: siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/premium_initiate",
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if (data.hasOwnProperty('msg')) {
                        if (data['msg'] === "No Data Avilable") {
                            $('#QuoteLoader').hide();
                            $('.ConfDetPopup').show();
                        }
                    } else {
                        if (data.hasOwnProperty('Summary') && data.Summary.hasOwnProperty('Request_Unique_Id')) {
                            SRN = data.Summary.Request_Unique_Id;
                            $('#QuoteLoader').hide();
                            $('.maininput').hide();
                            $('.quotelist').show();
                            $('.divlist').show();
                            $('#dashboardquotelist').hide();
                            $('.loading').show();
                            $('#Property').removeClass('active in');
                            $('#Appl').addClass('active in');
                            Get_Saved_Data();
                            $('#addonChecked').prop('checked', false);
                            $('#SelectAllAddons').prop('checked', false);
                        }
                    }
                },
                error: function (data) {
                    $.alert("Cannot Proceed Now. Please Try Again!");
                    console.log(data);
                    $('#QuoteLoader').hide();
                }
            });
        }
    });
}
$(".edit_btn1").click(function (e) {
    $(".LoadPopup").hide();
    IsTwiceRenewal = true;
    $('#InputForm').show();
    $('.basicDetails').hide();
    $('.footerDiv').show();
    GetDataFromSIDCRN();
});

function vehicleinfowithLead(leadId) {
    $('#QuoteLoader').show();
    $.ajax({
        type: "GET",
        data: siteURL.indexOf('https') === 0 ? {'method_name': "/renewal_quotes/get_leadid/" + leadId} : "",
        url: siteURL.indexOf('https') === 0 ? GeteditUrl() + '/horizon-method.php' : GetUrl() + "/renewal_quotes/get_leadid/" + leadId,
        dataType: "json",
        success: function (data) {
            data = JSON.stringify(data);
            data = JSON.parse(data);
            console.log("lead data" + data);

            if (data !== null && data !== '') {

                $("#err_msg_vehinfo").text("");
                $('#divveh_info').show()
                if (data.registration_no != "") {
                    var RegNo = data.registration_no.replace(new RegExp('-', 'gi'), "");
                    $("#RegistrationNo").text(RegNo);

                    if ((RegNo.indexOf("AA1234") > -1) || (RegNo.indexOf("ZZ9999") > -1)) {
                        $("#RegistrationNo").text(RTOCode);
                        $("#divRegistrationNoDetails").hide();
                    } else {
                        $("#divRegistrationNoDetails").show();
                        $("#RegistrationNoDetails").text(RegNo);
                    }
                }
                if (data.Make_Name != "" && data.Make_Name != null && data.Model_Name != "" && data.Model_Name != null) {
                    $("#VehicleNameDetails").text(data.Make_Name + " " + data.Model_Name + " (" + data.Vehicle_ID + ")");
                } else {
                    $("#VehicleNameDetails").text("");
                }
                if (data.Fuel_Name != "" && data.Fuel_Name != null) {
                    $("#FuelNameDetails").text(data.Fuel_Name);
                } else {
                    $("#FuelNameDetails").text("");
                }

                if (data.Product_Id == 12) {
                    if (data.vehicle_class_code == 24) {
                        $("#span_vehicle_class").text("Goods Carrying Vehicle");
                    } else if (data.vehicle_class_code == 41) {
                        $("#span_vehicle_class").text("Passenger Carrying Vehicle");
                    } else if (data.vehicle_class_code == 35) {
                        $("#span_vehicle_class").text("Miscellaneous And Special Type");
                    }

                    $.each(VehicleSubClass, function (key, value) {
                        if (value.value == data.vehicle_sub_class) {
                            $("#span_vehicle_subclass").text(value.Text);
                        }
                    })
                }

                if (data.external_bifuel_value > 0) {
                    $("#ExternalBifuelVal").html(data.external_bifuel_value);
                } else {
                    $("#divExternalBifuelVal").hide();
                }

                if (data.RTO_City != "" && data.RTO_City != null) {
                    $("#RTODetails").text(data.RTO_City);
                } else {
                    $("#RTODetails").text("");
                }

                var Name = "";
                if (data.Customer_Name != "" && checkTextWithSpace(data.Customer_Name)) {
                    Name = data.Customer_Name;
                } else {
                    $("#divNameDetails").hide();
                }
                $("#NameDetails").text(Name);
                if (data.mobile != "" && data.mobile != null) {
                    $("#MobileDetails").text(data.mobile);
                    if (data.mobile == "9999999999") {
                        $("#MobileDetails").text("NA");
                    }
                } else {
                    $("#divMobileDetails").hide();
                }
                if (data.email != "" && data.email != null) {
                    $("#EmailDetails").text(data.email);
                    if ((data.email).indexOf('@testpb.com') > 1) {
                        $("#EmailDetails").text("NA");
                    }
                } else {
                    $("#divEmailDetails").hide();
                }

                if (data.vehicle_insurance_type == "new") {
                    $("#RegistrationTypeDetails").text("New");
                } else {
                    $("#RegistrationTypeDetails").text("Renew");
                }

                //For TP Plan Implementation
                VehInsSubType = data.vehicle_insurance_subtype;
                $("#VehicleInsuranceSubtype").val(VehInsSubType);
                console.log("VehInsSubType: ", VehInsSubType);

                $("#RegistrationSubTypeDetails").html(ShowVehInsSubType(VehInsSubType));

                if (data.vehicle_registration_date != "" && data.vehicle_registration_date != null) {
                    $("#RegistrationDate").html(data.vehicle_registration_date);
                } else {
                    $("#divRegistrationDate").hide();
                }

                if (data.vehicle_manf_date != "" && data.vehicle_manf_date != null) {
                    $("#ManufactureDateval").html(data.vehicle_manf_date);
                } else {
                    $("#divManufactureDateval").hide();
                }

                if (data.policy_expiry_date != "" && data.policy_expiry_date != null) {
                    $("#PolicyExpiryDateval").html(data.policy_expiry_date);
                } else {
                    $("#divPolicyExpiryDateval").hide();
                }

                $("#PrevNCB").empty();
                if (data.vehicle_ncb_current != "" && data.vehicle_ncb_current != null) {
                    $("#PrevNCB").html(data.vehicle_ncb_current + "%")
                } else {
                    $("#divPrevNCB").hide();
                }

                if (data.is_claim_exists != "no") {
                    $("#ClaimYesNo").html("Yes");
                    $("#divPrevNCB").hide();
                }
                if (data.is_claim_exists != "yes") {
                    $("#ClaimYesNo").html("No");
                    $("#divPrevNCB").show();
                }

                if (data.vehicle_registration_type == "corporate") {
                    $("#VehicleInsType").html("Company");
                } else {
                    $("#VehicleInsType").html("Individual");
                }

                var PrevInsName = GetPrevIns(data.prev_insurer_id);
                if (data.prev_insurer_id != "" && data.prev_insurer_id != null) {
                    $("#PrevInsurer").html(PrevInsName);
                } else {
                    $("#divPrevInsurer").hide();
                }
                if (data.posp_first_name != null && data.posp_first_name != '' && data.posp_first_name != undefined && data.posp_last_name != null && data.posp_last_name != '' && data.posp_last_name != undefined && data.posp_mobile_no != null && data.posp_mobile_no != '' && data.posp_mobile_no != undefined && data.posp_ss_id != null && data.posp_ss_id != '' && data.posp_ss_id != undefined && data.posp_fba_id != null && data.posp_fba_id != '' && data.posp_fba_id != undefined && data.posp_agent_city != null && data.posp_agent_city != '' && data.posp_agent_city != undefined) {
                    $('#PospAgentName').text(data.posp_first_name + ' ' + data.posp_last_name + ' ( Mob. :  ' + data.posp_mobile_no + ', SS_ID : ' + data.posp_ss_id + ', FBA_ID : ' + data.posp_fba_id + ', City  : ' + data.posp_agent_city + ')');
                } else {
                    $('#PospAgentName').text('');
                }
                if (data.posp_agent_city != null && data.posp_agent_city != '' && data.posp_agent_city != undefined) {
                    $('#PospAgentCity').text(data.posp_agent_city);
                } else {
                    $('#PospAgentCity').text('');
                }
                if (data.posp_reporting_agent_name != null && data.posp_reporting_agent_name != '' && data.posp_reporting_agent_name != undefined) {
                    var reportingMobile = data.posp_reporting_mobile_number != null ? data.posp_reporting_mobile_number : "";
                    $('#ReportingAgentName').text(data.posp_reporting_agent_name + ' ( UID : ' + data.posp_reporting_agent_uid + ', Mob. : ' + reportingMobile + ' )');
                } else {
                    $('#ReportingAgentName').text('');
                }
                if (data.posp_sources != null && data.posp_sources != '' && data.posp_sources != undefined) {
                    var client_key_val;
                    if (data['product_id'] == 1 || data['product_id'] == 10) {
                        if (data.hasOwnProperty('ss_id') && (data['ss_id'] - 0) > 0) {
                            var posp_sources = data['posp_sources'] - 0;
                            var ss_id = (data['ss_id'] - 0);
                            if (posp_sources == 1) {
                                if (data.hasOwnProperty('posp_erp_id') && (data['posp_erp_id'] - 0) > 0) { //posp_erp_id
                                    client_key_val = 'DC-POSP';
                                    if ([8279, 6328, 9627, 6425].indexOf(ss_id) > -1) {
                                        client_key_val = 'FINPEACE';
                                    }
                                } else if (ss_id !== 5) {
                                    client_key_val = 'DC-NON-POSP';
                                } else if (ss_id === 5) {
                                    client_key_val = 'DC-FBA';
                                }
                            } else if (posp_sources == 2) {
                                if (data.hasOwnProperty('posp_erp_id') && (data['posp_erp_id'] - 0) > 0) { //posp_erp_id
                                    client_key_val = 'SM-POSP';
                                } else if (ss_id === 5) {
                                    client_key_val = 'SM-FBA';
                                } else {
                                    client_key_val = 'SM-NON-POSP';
                                }
                            } else {
                                if (data['posp_category'] == 'FOS') {
                                    client_key_val = 'SM-FOS';
                                } else if (data['posp_category'] == 'RBS') {
                                    client_key_val = 'RBS';
                                } else {
                                    client_key_val = 'PB-SS';
                                }
                            }

                        }
                    }
                    $('#POSPType').text(client_key_val);
                } else {
                    $('#POSPType').text('');
                }
                $('#QuoteLoader').hide();
                $('#infoPopup').show();
                $('.sticky_btn').hide();
            } else {
                $('#infoPopup').show();
                $("#err_msg_vehinfo").text("No data found");
                $('#divveh_info').hide()
                $('#QuoteLoader').hide();
            }

        },
        error: function (data) {
            $.alert("Cannot Proceed Now. Please Try Again!");
            console.log(data);
        }
    });
}

$(document).on("click", ".detail_heading", function () {
    var current = $(this).parent([0]).find(".more_detail_addons");
    $(".more_detail_addons").not(current).slideUp();
    current.slideToggle();
})

function PackageSelect(Id, Plan) {
    IsLoad = false;
    AddOnSelectedList = $('#BundleEdit :radio:checked').map(function () {
        return this.id;
    }).get();
}
function AddonSelect(InsID, Plan) {
    // console.log("AddonSelect() Called :" + InsID + "_" + Plan);
    var addon_amount = 0;
    var addon_premium_breakup = "";
    var addon_premium;
    var addon_checked = $('#Addons').find('input[type=checkbox]:checked');
    var addon_plan_name = '';
    var addon_count = 0;
    var addon_premium_amount = -1;
    for (var i = 0; i < quotes.Response.length; i++) {
        if (quotes.Response[i].Insurer_Id == InsID) {
            var InsResponse = quotes.Response[i];
            var InsAddonList = InsResponse.Addon_List;
            var InsPlanList = InsResponse.Plan_List;
            var InsPremBrkup = InsResponse.Premium_Breakup;
            for (var x = 0; x < InsPlanList.length; x++) {
                var current_addon_no = 0;
                for (var j in InsPlanList[x].Plan_Addon_Breakup) {
                    for (var k = 0; k < addon_checked.length; k++) {
                        if (j == addon_checked[k].value) {
                            current_addon_no++;
                            break;
                        }
                    }
                }
                if (addon_count <= current_addon_no) {
                    if (addon_count < current_addon_no || (addon_premium_amount == -1) || (addon_premium_amount > InsPlanList[x].Plan_Addon_Premium)) {
                        addon_plan_name = InsPlanList[x].Plan_Name;
                        addon_count = current_addon_no;
                        addon_premium_amount = InsPlanList[x].Plan_Addon_Premium;
                    }
                }
                if (addon_checked.length == addon_count) {
                    break;
                }
            }


            for (var pl in InsPlanList) {
                var Hrefval = "";
                var ARN = "";
                var addon_premium_breakup = "";

                if (InsResponse.Plan_List[pl].Plan_Name == addon_plan_name) {
                    BundleResponse["Insurer_" + InsID] = InsResponse.Plan_List[pl]; // obj["addon_package"] = objPackage;
                    ARN = InsResponse.Plan_List[pl].Service_Log_Unique_Id;

                    $('#divQuitList' + InsID + ' .quote-with-addon-buy .PremiumBreakup .PremiumBreakup').attr('arn', ARN)

                    // DisplayAddons30
                    var DisplayAddons = "";
                    $("#DisplayAddons" + InsID).html("No Addons Available");
                    Plan_Addon_Breakup = InsResponse.Plan_List[pl].Plan_Addon_Breakup;
                    var HtmlBundleAddon = "";
                    $.each(Plan_Addon_Breakup, function (key, v) {
                        AddonTitle = addon_list[key] + "(" + v + ")";
                        var addon_name = addon_shortlist[key];
                        var addon_Fullname = addon_list[key];
                        //arr1.push(addon_shortlist[key]);
                        //arr.push('<span class="Pack" title="' + AddonTitle + '">' + addon_shortlist[key] + '</span>');

                        var addon_premium = v;
                        addon_amount += addon_premium;
                        addon_premium_breakup += addon_list[key] + '-' + v + '+';
                        DisplayAddons += '<span class="BlockSections" title="' + addon_list[key] + '">' + addon_shortlist[key] + '<span>₹ ' + addon_premium + '</span></span>';

                        //For Mobile
                        HtmlBundleAddon = HtmlBundleAddon + "<div class='col-xs-6 col-md-2 form-height'>" + addon_list[key] + "<span><i class='fa fa-inr'></i>" + v + "</span></div>";

                        //For Mobile
                        $('#divQuitList' + InsID).children('.addon-selectedMobile').append('<div class="hello" style="font-size:11px;margin:3px;"><div  class="ad xyz" title="' + addon_Fullname + '">' + addon_Fullname + '  &nbsp; <span><i class="fa fa-inr"></i>' + Math.round(addon_premium) + '</span></div></div>');
                        $('#divQuitList' + InsID).children('.addon-selectedMobile').show();
                    });
                    $(".BundleAddons" + InsID).html(HtmlBundleAddon);

                    if (DisplayAddons == "") {
                        DisplayAddons = "No Addons Available";
                    }
                    $("#DisplayAddons" + InsID).html(DisplayAddons);

                    //Code For Changing Premium On Addon Select Starts
                    var total_liability_premium = InsPremBrkup.liability['tp_final_premium'] - 0;
                    var net_premium = InsPremBrkup.net_premium + addon_amount;
                    var service_tax = 0;
                    if (Product_id == 12 && quotes.Summary.Request_Core.vehicle_class == "gcv" && InsID == '1') {
                        var tp_basic_Tax = 2 * (InsPremBrkup.liability['tp_basic'] * 0.06);
                        var rest_prm = parseFloat(InsPremBrkup['net_premium']) - parseFloat(InsPremBrkup.liability['tp_basic']);
                        var rest_prm_Tax = 2 * (rest_prm * 0.09) - 0;
                        service_tax = (Math.round(tp_basic_Tax + rest_prm_Tax));
                    } else {
                        service_tax = 2 * (Math.round(net_premium * 0.09) - 0);
                    }
                    var od_final_premium = InsPremBrkup.own_damage['od_final_premium'] - 0;
                    var ncb = InsPremBrkup.own_damage['od_disc_ncb'] - 0;


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
                    $('.PB1_' + InsID).text('');
                    $('.PB1_' + InsID).text('₹ ' + rupee_format(Math.round(net_premium)));
                    //final_premium = InsResponse.Plan_List[pl].Plan_Full_Premium.final_premium;

                    $('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.dynamic').children('.btn-buy').children('.Premium').html('₹ ' + rupee_format(final_premium));// + ' <i style="font-size:14px">(1 year) </i>');
                    $('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.dynamic').children('.btn-buy').children('.PremiumMobile').html('₹ ' + rupee_format(final_premium));

                    $('#divQuitList' + InsID).attr('premium', final_premium);
                    //$('#divQuitList' + InsID).attr('applied_addon', count);
                    $('#BuyNow' + InsID + '').children('#breakup_Btn').text('₹ ' + rupee_format(Math.round(net_premium)) + '');//$('#BuyNow' + InsID + '').children('#breakup_Btn').text('₹ ' + rupee_format(final_premium) + '');
                    $('#divQuitList' + InsID + ' .PremiumBreakup').children('.PremiumBreakup').attr('netpayablepayablepremium', rupee_format(final_premium));
                    $('#divQuitList' + InsID + ' .PremiumBreakup').children('.PremiumBreakup').attr('servicetax', rupee_format(Math.round(service_tax)));
                    $('#divQuitList' + InsID + ' .PremiumBreakup').children('.PremiumBreakup').attr('addonpremium', Math.round(addon_amount));
                    $('#divQuitList' + InsID + ' .PremiumBreakup').children('.PremiumBreakup').attr('totalpremium', rupee_format(Math.round(net_premium)));
                    $('#divQuitList' + InsID + ' .PremiumBreakup').children('.PremiumBreakup').attr('addonname', addon_premium_breakup);
                    $('#divwithgst' + InsID).text('₹ ' + rupee_format(final_premium) + ' with GST');

                    //For Displaying Message For Discount Not Selected
                    var TotalDiscountVal = 0;
                    TotalDiscountVal = Math.round(InsPremBrkup.own_damage.od_disc_anti_theft) + Math.round(InsPremBrkup.own_damage.od_disc_vol_deduct);
                    //$('#divQuitList' + InsID + ' .PremiumBreakup').attr('totaldiscount', TotalDiscountVal);
                    if (TotalDiscountVal == 0) {
                        $('#DisplayDiscount' + InsID).html("No Discount Available");
                    }

                    //For Displaying Message For Cover Not Selected
                    var TotalCover = 0;
                    TotalCover = Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.premium_div').children('.Premium').children('.PremiumBreakup').attr('electricalacessoriespremium')).replace(/,/g, '')) + Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.premium_div').children('.Premium').children('.PremiumBreakup').attr('nonelectricalaccessoriespremium').replace(/,/g, '')));
                    if (Product_id == 10) {
                        if (TotalCover == 0) {
                            $("#DisplayCover" + InsID).html("No Cover Available");
                        }
                    }
                    if (Product_id == 1) {
                        TotalCover +=
                                Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.premium_div').children('.Premium').children('.PremiumBreakup').attr('legalliabilitypremiumforpaiddriver')).replace(/,/g, '')) +
                                Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.premium_div').children('.Premium').children('.PremiumBreakup').attr('personalaccidentcoverforpaiddriver')).replace(/,/g, '')) +
                                Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.premium_div').children('.Premium').children('.PremiumBreakup').attr('personalaccidentcoverforunammedpassenger')).replace(/,/g, '')) +
                                Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.premium_div').children('.Premium').children('.PremiumBreakup').attr('personalaccidentcoverfornamedpassenger')).replace(/,/g, '')) +
                                Math.round(($('#divQuitList' + InsID).children('.quotechild').children('.premium_div').children('.Premium').children('.PremiumBreakup').attr('outstandingloancover')).replace(/,/g, ''));
                        if (TotalCover == 0) {
                            $("#DisplayCover" + InsID).html("No Cover Available");
                        }
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
    if (addon_plan_name != 'Basic' && addon_plan_name != "") {
        addon_plan_name = addon_plan_name.replace(new RegExp('_', 'gi'), " ");
        $("#divPlanName" + InsID).show();
        $("#PlanName" + InsID).text(addon_plan_name);
    } else {
        $("#divPlanName" + InsID).hide();
        $("#PlanName" + InsID).text("");
    }

    set_minmax_premium();
    $('body').css("overflow", "auto")
}

$('#showMore_btn').on('click', function () {
    $('.sticky_popup').show();
});
$('#close_sticky_popup,.stycky_grid').on('click', function () {
    $('.sticky_popup').hide();
});
$('#close_sticky_popup1,.stycky_grid').on('click', function () {
    $('.sticky_popup1').hide();
});
$('.refresh1').on('click', function () {
    $('.sticky_popup1').show();
});

function AddonBlock(res) {
    Response_Global = res;
    var Summary = res.Summary;
    var AddonRequest = res.Addon_Request;
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
                if (value == "yes") {
                    $('#' + i).attr("checked", "true");
                }
                //$('#' + i).click();
            });
        }
    }
}

function getPrevInsList() {
    $.ajax({
        type: "GET",
        data: siteURL.indexOf('https') === 0 ? {'method_name': "/insurers/getPrevInsurer/" + Product_id} : "",
        url: siteURL.indexOf('https') === 0 ? GeteditUrl() + '/horizon-method.php' : GetUrl() + "/insurers/getPrevInsurer/" + Product_id,
        dataType: "json",
        success: function (response) {
            console.log("Previous Insurer List : ", response);
            var ary = Array('<option value="0" selected>Select Previous Insurer</option>');
            for (var i in response) {
                ary.push('<option value="' + response[i]['insurer_id'] + '">' + response[i]['insurer_name'] + '</option>');
            }
            $("#PreviousInsurer").empty();
            $('#PreviousInsurer').append(ary);

            var tp_ary = Array('<option value="0" selected>Select TP Policy Insurer</option>');
            for (var i in response) {
                tp_ary.push('<option value="' + response[i]['insurer_id'] + '">' + response[i]['insurer_name'] + '</option>');
            }
            $("#TP_PolicyInsurer").empty();
            $('#TP_PolicyInsurer').append(tp_ary);
        },
        error: function (e) {
            console.log("Previous Insurer List error :", e);
        }
    });
}

function CheckRTOFromDB() {
    var Rto_No = $("#Reg1").val().toLowerCase() + $("#Reg2").val().toLowerCase();
    if (RtoList.length > 0) {
        RTO_count = 0;
        RtoList_updated = [];
        for (var r in RtoList) {
            var RTO_State_Name = "";
            if (RtoList[r].hasOwnProperty('VehicleCity_RTOCode')) {
                RTO_State_Name = (RtoList[r]['VehicleCity_RTOCode']).toLowerCase();
                if (RTO_State_Name == Rto_No) {
                    RTO_count++;
                    RtoList_updated.push(RtoList[r]);
                } else {
                    $("#CityofRegitration").attr('disabled', true);
                }
            }
        }
        if (RTO_count === 0) {
            $('#QuoteLoader').hide();
            $("#RegistrationNo").addClass('ErrorMessage1');
            var validationMsg = "Invalid RTO";
            $('#RegistrationNoError').addClass('ErrorMessage1');
            $('#RegistrationNoError').html(validationMsg).slideUp().slideDown();
            return false;
        } else {
            GetFastLane(RegNo);
        }
    } else {
        setTimeout(CheckRTOFromDB, 5000);
    }

}
function ProccedtoList(vehicleid, insurerid) {
    var Insurer_Vehicle_List = [];
    $('.MapppopClose1').click(function () {
        $('.map_popup').hide();
        $('#spn_veh_msg').text("");
    });
    ss_id = getUrlVars()["ss_id"];
    $('.recalToMap').hide(20);
    $('#VehicleMap').show(30);
    $("#VehicleInsurer").empty();
    $.ajax({
        type: "GET",
        data: siteURL.indexOf("https") == 0 ? {method_name: '/vehicles/mapping/get_availability?PB_Vehicle_Id=' + vehicleid + '&Mapping_Insurer_Id=' + insurerid + '&Ss_Id=' + ss_id, client_id: '2'} : "", //UAT
        url: siteURL.indexOf("https") == 0 ? GeteditUrl() + '/horizon-method.php' : GetUrl() + '/vehicles/mapping/get_availability?PB_Vehicle_Id=' + vehicleid + '&Mapping_Insurer_Id=' + insurerid + '&Ss_Id=' + ss_id,
        dataType: "json",
        success: function (data) {
            var objResponse = data;
            if (objResponse['Status'] === "SUCCESS") {
                $('#err_map').hide();
                $('.div_mapped').show();
                var Insurer_Vehicle_List = objResponse['Insurer_Vehicle_List'];
                var Pb_Vehicle_Full_Name = objResponse['Pb_Vehicle']['Full_Name'];

                $.each(Insurer_Vehicle_List, function (j) {
                    var vehicleFullName = '<option value="' + Insurer_Vehicle_List[j]['Insurer_Vehicle_ID'] + '">' + Insurer_Vehicle_List[j]['Full_Name'] + '</option>';
                    $("#VehicleInsurer").append(vehicleFullName);
                });

                $('.Pb_Vehicle_Full_Name').text(Pb_Vehicle_Full_Name);
                $('#hideMappingINSId').val(insurerid);
                $('#hideMappingINSName').val(arr_ins[insurerid]);
            } else {
                $('.div_mapped').hide();
                $('#err_map').show();
                $('#spn_veh_msg').text(objResponse['Status'])
            }
            console.log(objResponse);
        }
    });
}
function ProceedtoMapped() {
    var objRequest = {
        "Insurer_ID": $('#hideMappingINSId').val(),
        "Insurer_Name": $('#hideMappingINSName').val(),
        "Insurer_Vehicle_ID": $('#VehicleInsurer').find(":selected").val(),
        "Insurer_Vehicle_Name": $('#VehicleInsurer').find(":selected").text().toString().trim(),
        "Vehicle_ID": map_vehicle_id,
        "Vehicle_Name": $('.Pb_Vehicle_Full_Name').text(),
        "Status_Id": "4",
        "Status_Name": "to map closely",
        "ss_id": ss_id
    }
    console.log(objRequest);
    var obj_horizon_data = Horizon_Method_Convert("/vehicles_insurers_mappings/mapping", objRequest, "POST");
    $.ajax({
        type: "POST",
        data: siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(objRequest),
        url: siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/vehicles_insurers_mappings/mapping",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            console.log(data);
            if (data['Msg'] === "Success") {
                $('.div_mapped').hide();
                $('#err_map').show();
                $('#spn_veh_msg').text("You have successfully applied Vehicle Mapping. Kindly recalculate premium again.");
                $('.recalToMap').show();
            } else {
                $('.div_mapped').hide();
                $('#err_map').show();
                $('#spn_veh_msg').text(data['Msg']);
                $('.recalToMap').hide();
            }
        }
    });
}

function recaltoMapped() {
    $('#VehicleMap').hide();
    $('.noInsurer_list_popup').hide();
    $('.loading').show();
    cover_filter();
}

function tonnageWarning() {
    Product_id = getUrlVars()["product_id"];
    if (Product_id == 12) {
        $(".tonnageWarning").show();
    } else {
        $(".tonnageWarning").hide();
    }
}

function fastlane_msg_popup() {
    $("#fastlane_popup").modal('hide');
}
function save_app_visitor() {
    let visitorObj = {
        app_type: "TW_Finmart",
        IP_Address: ip_address,
        query_string: siteURL.split("?")[1],
        ss_id: getUrlVars()['ss_id'],
        fba_id: getUrlVars()['fba_id'] != "" && getUrlVars()['fba_id'] != undefined && getUrlVars()['fba_id'] != null ? getUrlVars()['fba_id'] : "",
        customer_name: getUrlVars()['hd_customer_name'] != "" && getUrlVars()['hd_customer_name'] !== undefined && getUrlVars()['hd_customer_name'] !== null ? decodeURI(getUrlVars()['hd_customer_name']) : "",
        mobile: getUrlVars()['hd_mobile'] != "" && getUrlVars()['hd_mobile'] != undefined && getUrlVars()['hd_mobile'] != null ? getUrlVars()['hd_mobile'] : "",
        email: getUrlVars()['hd_email'] != "" && getUrlVars()['hd_email'] != undefined && getUrlVars()['hd_email'] != null ? getUrlVars()['hd_email'] : "",
        registration_no: getUrlVars()['hd_registration_no'] != "" && getUrlVars()['hd_registration_no'] != undefined && getUrlVars()['hd_registration_no'] != null ? getUrlVars()['hd_registration_no'] : ""
    };
    $.ajax({
        type: "POST",
        data: JSON.stringify(visitorObj),
        url: GetUrl() + "/postservicecall/app_visitor/save_data",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            app_visitor_id = data['visitor_Id'];
            console.log(data);
        },
        error: function (e) {
            console.log("save app visitor error :", e);
        }
    });
}