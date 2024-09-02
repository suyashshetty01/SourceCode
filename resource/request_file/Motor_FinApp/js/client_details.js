

var RtoList = [];
var VehicleList = [];
var Product_id;
var Product_Name;
var VehicleInsuranceSubtype = "";
var twowheelerType = "";
var InsPlanTypeYear;
var VehicleType;
var IsHaveNCBCertificate;
var PEDFlag = false;
var PrevVehicle_id;
var PrevRto_id;
var PrevReg_Date;
var srn = "";
var ud_id="";
var ss_id, fba_id, ip_address, app_version, mac_address,mobile_no,srn,client_id;
var VariantIDSelected;
var isPostBack = false;
var IsExternalBifuel = false;
var StatusCount=0;
var siteURL = "";

function setProduct(product_name) {
    if (product_name == "Car") {Product_id = 1;Product_Name = "Car";} 
	else if (product_name == "Bike") { Product_id = 10;Product_Name = "Bike";}

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

function stringparam(){

		ss_id = getUrlVars()["ss_id"];
        fba_id = getUrlVars()["fba_id"];
        ip_address = getUrlVars()["ip_address"];
        app_version = getUrlVars()["app_version"];
        mac_address = getUrlVars()["mac_address"];
		srn=getUrlVars()["SRN"];
		client_id=getUrlVars()["ClientID"];
				if(getUrlVars()["mobile_no"]=="" || getUrlVars()["mobile_no"]== undefined){
				mobile_no=0;
				}else if((app_version=='FinPeace') && getUrlVars()["mobile_no"] !="") 
				{
					mobile_no = getUrlVars()["mobile_no"];
					$('#ContactMobile').val(getUrlVars()["mobile_no"]);
				}
				 
				if(srn !=null && srn !="" && client_id !=null && client_id !="" ){
					$(".motor_maindiv").show();
                    $(".warningmsg").hide();
				}
                else if (fba_id == "" || fba_id ==undefined ||fba_id == "0" || ip_address == '' ||ip_address == '0' || ip_address == undefined || app_version == "" ||app_version == "0"|| app_version == undefined || ss_id  ==""|| ss_id==undefined  ||ss_id  =="0") {

                    $(".motor_maindiv").hide();
                    $(".warningmsg").show();
                }
				else if(app_version=='FinPeace' && (mobile_no=="" || mobile_no == null || mobile_no==0)){
					$(".motor_maindiv").hide();
					$(".warningmsg").show();
				}
                else {

                    $(".motor_maindiv").show();
                    $(".warningmsg").hide();
                }
}


    $(window).load(function(){
		
        if(srn !=null && srn !="" && client_id !=null && client_id !="" ) {
            
        }
    });
 
$(document).ready(function() {
	siteURL =  window.location.href;
	stringparam();
	
		
	if(srn !=null && srn !="" && client_id !=null && client_id !="" ){
		$('motor_maindiv').hide();
		$("#QuoteLoader").show();
		GetDataFromSIDCRN(srn,client_id)
	}
	
	if (VehicleType == null || VehicleType== '') { isPostBack = false; }
        else {
            isPostBack = true;
            if (VehicleType == "NEW") { TwoWheelerTypeNew(); }
            if (VehicleType == "RENEW") { TwoWheelerTypeRenew(); }
        }
	
    if (Product_Name == 'Car') {
        InsPlanTypeYear = 3;
        $("#MakeModel").attr('placeholder', 'Vehicle Make & Model (e.g. Honda, City)');
    }
    if (Product_Name == 'Bike') {
        InsPlanTypeYear = 5;
        $("#MakeModel").attr('placeholder', 'Vehicle Make & Model (e.g. Bajaj, Avenger)');
    }

    if (IsHaveNCBCertificate == "Yes") {
        $('#lblHaveNCBCertificate-No').removeClass('active');
        $('#lblHaveNCBCertificate-Yes').addClass('active');
    }
    if (IsHaveNCBCertificate == "No") {
        $('#lblHaveNCBCertificate-Yes').html('NO');
    }

    //get RTO 
    $.ajax({
        type: "GET",
		data: siteURL.indexOf("https") == 0 ?  { method_name: '/rtos/list', client_id: "2" } : "",						//UAT
		url : siteURL.indexOf("https") == 0 ? GeteditUrl()+'/TwoWheelerInsurance/call_horizon_get' : GetUrl()+ '/rtos/list' ,
        //data: { method_name: '/rtos/list', client_id: "2" },						//UAT
        //url: GeteditUrl() + '/TwoWheelerInsurance/call_horizon_get', 	  			//UAT	
	   //url:GetUrl()+'/rtos/list',                                                 //local
        dataType: "json",
        // data: {
            // method_name: '/rtos/list',
            // client_id: "2"
        // },
        success: function (data) {
           // debugger;
            RtoList = data;
            console.log("RtoList");
            console.log(RtoList);
        }
    });

    // get Make and Model
    $.ajax({
        type: "GET",
		url : siteURL.indexOf("https") == 0 ? GeteditUrl() + '/TwoWheelerInsurance/call_horizon_get' : GetUrl()+'/vehicles/model_list?product_id='+Product_id,
		data :  siteURL.indexOf("https") == 0 ? { method_name: '/vehicles/model_list?product_id=' + Product_id, client_id: "2" } : "",
        //url: GeteditUrl() + '/TwoWheelerInsurance/call_horizon_get',                //UAT
		//url: GetUrl() + '/vehicles/model_list?product_id=' + Product_id,          //Local
        dataType: "json",
        //data: { method_name: '/vehicles/model_list?product_id=' + Product_id, client_id: "2" },            //Local
        success: function (data) {
            //debugger;
            VehicleList = data;
            console.log("Vehicle_Make_Model");
            console.log(VehicleList);
        },
        error: function(result) {

        }
    });
    // 


    $('#CityofRegitration').autocomplete({
        source: function(request, response) {
            if (RtoList != null && RtoList != undefined) {
                var RtoFilterList = [];
                var searchStr = $("#CityofRegitration").val();
                for (var i = 0; i < RtoList.length; i++) {
                    if ((("(" + RtoList[i].VehicleCity_RTOCode.toString() + ") " + RtoList[i].RTO_City.toString()).toLowerCase()).indexOf(searchStr.toLowerCase()) > -1) {
                        RtoFilterList.push(RtoList[i]);
                    }
                }
                response($.map(RtoFilterList, function(item) {
                    //console.log(RtoFilterList.length);
                    if (RtoFilterList.length > 1) {
                        RtoFilterList.push({
                            CityofRegitrationID: null,
                            CityofRegitration: 'Not Found.'
                        });
                        //$('#CityofRegitrationID').val(null);
                    };
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
        select: function(event, ui) {
            if (ui.item.id == null)
                return false;
            $('#CityofRegitrationID').val(ui.item.id);
            $('#CityofRegitration').val(ui.item.VehicleCity_RTOCode);
        }
    });
    $('#MakeModel').autocomplete({
        source: function(request, response) {
            if (FilterVehicleList != null && FilterVehicleList != undefined) {
                if (FilterVehicleList.length == 0) {
                    FilterVehicleList.push({
                        MakeModelID: null,
                        MakeModel: 'Not Found.'
                    });
                    $('#MakeModelID').val(null);
                };
                response($.map(FilterVehicleList, function(item) {
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
        select: function(event, ui) {
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
            if (arr[1] != null && $(this).val() != null) { // if (arr[1] != null) { //
                if (Model_ID != "0") {
                    $("#MakeModelID").val(Model_ID);
                    CallFuelOnModelSelect(Model_ID);

                }
            }
            FuelSelected = "";
        },
        change: function(event, ui) {
            if (ui.item == null) {
                $("#FuelType").empty();
                $("#FuelType").append('<option value="0">Select Fuel Type</option>');
                $("#VariantID").empty();
                $("#VariantID").append('<option value="0">Select Variant</option>');
            }
            MakeModelChange();
        }
    });

    $('select').change(function() {
       
        var thisId = $(this).attr('Id');
        var ErthisId = $("#Er" + thisId);
        if ($(this).val() == "0" || $(this).val() == null) {
            $('label[for=' + thisId + '], input#' + thisId + '').hide();
            $(this).addClass('empty Unselected');

            switch (thisId) {
                case "VehicleClass":
                    ErrMsg = "Please Select Vehicle Class.";
                    $("#VehicleSubClass").empty();
                    $("#VehicleSubClass").append('<option value="0">Select Vehicle Sub Class</option>');
                    break;
                case "VehicleSubClass":
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
                case "VehicleClass":
                    VehicleClassSel = $(this).val();
                    VehicleSubClassSetOption(VehicleClassSel);
                    break;
                case "FuelType":
                    FuelSelected = $(this).val();
                    if (Product_Name == "Car") {
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

        if (Product_Name == "Car") {
            
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
    $('.Datepicker').on('change', function(e, date) {
        
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
    $('.Datepicker').on('focus', function(e, date) {
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

    $('.DateofPurchaseofCar').on('change', function(e, date) {

        $("#DateofPurchaseofCar").val($(this).val());
    });
    $('#DOPCRenew').bootstrapMaterialDatePicker({

        time: false,
        clearButton: true,
        format: 'DD-MM-YYYY',
        minDate: moment().subtract(15, 'years'), // 15 Years Before The Current Day // moment().subtract(15, 'y'),
        maxDate: moment().subtract(6, 'months'), // 6 Months Before The Current Day
        currentDate: moment().subtract(12, 'months'), // 1 Year Before The Current Day
        onSelect: function() {
            
            myfunction();
        }
    });
    $('#DOPCRenew').val("");
    $('#DOPCRenew').on('open', function(e, date) {
        $('#DOPCRenew').val("");
    });

    $('#DOPCNew').bootstrapMaterialDatePicker({
            time: false, clearButton: true, format: 'DD-MM-YYYY',
            minDate: moment().subtract(6, 'months'), // 6 Months Before The Current Day
            maxDate: moment(), // Current day
            currentDate: moment() // Current day
        });

        $('#DOPCNew').val("");
        $('#DOPCNew').on('open', function(e, date) {   $('#DOPCNew').val(""); });

    $('#PolicyExpiryDate').bootstrapMaterialDatePicker({
        time: false,
        clearButton: true,
        format: 'DD-MM-YYYY',
        minDate: (Product_Name == "Bike" ? moment().subtract(180, 'days') : moment()), // (180 Days Before The Current Day) Or (Current Day)
        maxDate: moment().add(60, 'days'), // 180 Days After The Current Day
        defaultDate: moment(),
        onselect: function() {
            myfunction1();
        }
    });

    $("#TPCompPlan").change(function() {
		
        var type = $('option:selected', $(this)).val();
		$('#VehicleInsuranceSubtype').val(type);
		if(type=="0CH_1TP"){
		 $(".NOTP").hide();
	}else if(type=="1CH_0TP"){$(".NOTP").show();}
       // InsurerPlanType(type);
    });

    $("#ihave").click(function(e) {
	   $('#TPCompPlan').empty()
        twowheelerType = "NEW";
		TP_CompSet(twowheelerType);	
    })
    $("#notremem").click(function(e) {
		$('#TPCompPlan').empty()
        twowheelerType = "RENEW";
		TP_CompSet(twowheelerType);	
    })
	
	    $("#next").click(function () {
		
        $('#VehicleDetailsError').html("").hide();
        $(".ErrorMsg").html("");
        $(".ErrorMsg").removeClass("DetailsError");
        // $(".DetailsError").html("").hide();
        Error = 0;
		if($('#TPCompPlan').val() == ""){
			Error++; $("#ErTPCompPlan").show().html("Please Select Policy Type From List.");
			
		}
		
        if ($('#MakeModelID').val() != "0" && $('#MakeModel').val() != "") {
            $("#ErMakeModel").hide().html("");
            if ($('#FuelType').val() == "0" || $('#FuelType').val() == "") {
                Error++; $("#ErFuelType").show().html("Please Select Fuel Type From List.");
                $("#VariantID").empty().append('<option value="0">Select Variant</option>');
            }
            else {
                $("#ErFuelType").hide().html("");
                if (Product_Name == "Car") {
                    if (IsExternalBifuel == true) {
                        if ($("#ValueOfBiFuelKit").val() >= 10000 && $("#ValueOfBiFuelKit").val() <= 60000) { $("#ErValueOfBiFuelKit").hide().html(""); }
                        else { Error++; $("#ErValueOfBiFuelKit").show().html("The Value CNG/LPG Kit Should Be Between 10000 & 60000"); }
                    }
                }
                if ($('#VariantID').val() == "0" || $('#VariantID').val() == "" || $('#VariantID').val() <= 0) { Error++; $("#ErVariantID").show().html("Please Select " + Product_Name + " Variant From List."); }
                else { $("#ErVariantID").hide().html(""); }
            }
        }
        else {
            Error++;
            $("#ErMakeModel").show().html("Please Enter Proper " + Product_Name + " Make And Model.");
            $("#MakeName, #Model_Name, #MakeModelID").val("");
            $("#FuelType").empty().append('<option value="0">Select Fuel Type</option>');
            $("#VariantID").empty().append('<option value="0">Select Variant</option>');
        }

        if (twowheelerType == "NEW") {
            if ($("#DOPCNew").val() == "") { Error++; $("#ErDOPCNew").show().html("Please Select Registration/Invoice Date."); }
            else { $("#ErDOPCNew").hide().html(""); }
        }
        if (twowheelerType == "RENEW") {
            if ($("#DOPCRenew").val() == "") { Error++; $("#ErDOPCRenew").show().html("Please Select Registration/Invoice Date."); }
            else { $("#ErDOPCRenew").hide().html(""); }
        }

        if ($('#CityofRegitrationID').val() <= 0 || $('#CityofRegitration').val() == "") { Error++; $("#ErCityofRegitration").show().html("Please Enter Place Of Registration From List."); }
        else { $("#ErCityofRegitration").hide().html(""); }

        if ($("#ManufactureDate").val() == "") { Error++; $("#ErManufactureDate").show().html("Please Select Year - Month Of Registration."); }
        else {
            var MD = parseInt(($('#ManufactureDate').val()).substring(3,7));
            if ( new Date().getFullYear() < MD) { Error++; $("#ErManufactureDate").show().html("Please Select Year Less Than Current Date."); }
            else if ( (new Date().getFullYear() - 15) > MD) { Error++; $("#ErManufactureDate").show().html("Please Select Year Upto 15 Year From Current Date."); }
            else {$("#ErManufactureDate").hide().html(""); }
        }

        //var DateConditionRenew = false;
        //DateConditionRenew = new Date($("#ManufactureDate").val()) > new Date($("#DateofPurchaseofCar").val()) == true;
        //if (DateConditionRenew) {
        //    $('#VehicleDetailsError').html('Date Of First Registration Must Be Greater Than The Vehicle Manufacturing Year & Month.').slideUp().slideDown();
        //    Error++;
        //    return false;
        //}

        var DPC = $("#DateofPurchaseofCar").val().split('-');
        var DPCDate = DPC[1] + "-" + DPC[0] + "-" + DPC[2];
        var MD = $("#ManufactureDate").val().split('-');
        var MDDate = MD[0] + "-" + "01" + "-" + MD[1];
        SetManuDate();
        var CompareRenew = false;
        CompareRenew = new Date(MDDate) > new Date(DPCDate) == true;
        if (CompareRenew) {
            $('#VehicleDetailsError').html('Date Of First Registration Must Be Greater Than The Vehicle Manufacturing Year & Month.').slideUp().slideDown();
            Error++;
            return false;
        }
        if (Error == 0) {
            $("#dont_remember").slideUp();
            $("#policy_details").show();
            if (twowheelerType == "NEW") {
				 $("#policy_details").hide();
                 $("#personal_details").show();
                //SmartCalculateQuote();
				
                //$(".PersonalDetails").removeClass('hidden');
            }
            else { $(".bikeinsurance").removeClass('hidden'); }
        }
    });

    $("#next1").click(function() {
        
        Error = 0;
		var  VehicleInsuranceSubtype= $("#VehicleInsuranceSubtype").val();
		
        if (twowheelerType == "RENEW") {
            //if ($("#PolicyExpiryDate").val() == "") { Error++; $("#ErPolicyExpiryDate").show().html("Please Select Policy Expiry Date"); }
            //else { $("#ErPolicyExpiryDate").hide().html(""); }

            var arr = $("#PolicyExpiryDate").val().split('-');
            var Days = (((new Date(Date.now())).getTime()) - ((new Date(arr[1] + "-" + arr[0] + "-" + arr[2])).getTime())) / (1000 * 60 * 60 * 24);

            if ($("#PolicyExpiryDate").val() == "") {
                Error++;
                $("#ErPolicyExpiryDate").show().html("Please Select Policy Expiry Date");
            } else {
                if (Product_Name == "Car") {
                    if (Math.floor(Days) > 180) {
                        Error++;
                        $("#ErPolicyExpiryDate").show().html("Please Select Proper Policy Expiry Date");
                    } else {
                        $("#ErPolicyExpiryDate").hide().html("");
                    }
                } else {
                    if (Math.floor(Days) > 1) {
                        Error++;
                        $("#ErPolicyExpiryDate").show().html("Please Select Proper Policy Expiry Date");
                    } else {
                        $("#ErPolicyExpiryDate").hide().html("");
                    }
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
        }
        if (Error == 0) {
		   if (twowheelerType == "RENEW") {
				   
				   $("#next1").html("Next").css('background-color','#062654');
                     
                     $("#policy_details").hide();
                     $("#personal_details").show();
			   } else {
                     $("#policy_details").hide();
                     $("#personal_details").show();
			   }	
			
        }
    });

    $("#lblHaveNCBCertificate-Yes").click(function() { //No button
        $("#divNoClaimBonusPercent").slideDown();
        $('#HaveNCBCertificate').val("Yes");
        //$("#lblHaveNCBCertificate-Yes").addClass('btn-primarySelected active');
        //$("#lblHaveNCBCertificate-No").removeClass('btn-primarySelected active');
        $(".NCBNo").removeClass('btn-UnSelected btnError').addClass('btn-primarySelected active');
        $(".NCBYes").removeClass('btn-primarySelected btnError active').addClass('btn-UnSelected');
        $('label[for=NoClaimBonusPercent], input#NoClaimBonusPercent').show();
    });

    $("#lblHaveNCBCertificate-No").click(function() { //Yes button
        $("#divNoClaimBonusPercent").slideUp();
        $('#HaveNCBCertificate').val("No");
        $("#NoClaimBonusPercent").val("0");
        //$("#lblHaveNCBCertificate-No").addClass('btn-primarySelected active');
        //$("#lblHaveNCBCertificate-Yes").removeClass('btn-primarySelected active');
        $(".NCBYes").removeClass('btn-UnSelected btnError').addClass('btn-primarySelected active');
        $(".NCBNo").removeClass('btn-primarySelected btnError active').addClass('btn-UnSelected');
        $("#lblHaveNCBCertificate-Yes").text("No");
    });
	
	$("#btnCompareQuote").click(function() {
	
    var errmsg = '';
    var isError = false;
    $("#RequestTypeID").val(1);
    validationMsg = "";
    var Error = 0;

    if (($("#chkAuthorize").attr("checked")) == false) {
        $("#chkAuthorize").addClass('errorCheckBox');
        validationMsg = "Please Select Checkbox For Terms & Conditions.\n";
        $("#TermCondition").val(false);
        isError = true;
    } else {
        $("#chkAuthorize").removeClass('errorCheckBox');
        $("#TermCondition").val(true);
    }
   
    if ($("#ContactName").val() != "") {
		
        var _rex = /^[a-zA-Z ]+$/;
        var bool = _rex.test($("#ContactName").val());
        if (bool && $("#ContactName").val().length<50) {
            $("#ErContactName").hide().html("");
        } else {
            Error++;
            $("#ErContactName").show().html("Please Enter Valid Contact Name");
        }
    }

    if ($("#ContactMobile").val() != "") {
		
        if (mobileValid($("#ContactMobile").val()) || ($("#ContactMobile").val().length>10 && $("#ContactMobile").val().length<10) ) {
            $("#ErManufactureDate").hide().html("");
        } else {
            Error++;
            $("#ErContactMobile").show().html("Please Enter Valid Mobile No.");
        }
    }

    if ($("#ContactEmail").val() != "") {
        if (emailValid($("#ContactEmail").val())) {
            $("#ErContactEmail").hide().html("");
        } else {
            Error++;
            $("#ErContactEmail").show().html("Please Enter Valid Email ID.");
        }
    }

    if (Error > 0) {
        return false;
    } else {
		$("#LoadingQuote").show();
        $("#DateofPurchaseofCar").attr("disabled", false);
        $("#PolicyExpiryDate").attr("disabled", false);
        //$("#FuelSelected").val(FuelSelected)
        $("#TwoWheelerType").val(twowheelerType);
        $("#VehicleInsuranceSubtype").val(VehicleInsuranceSubtype);
        $("#CarModel").val(ModelSelected);
        $('#OwnerDriverPersonalAccidentCover').val("100000");
        $('#PaidDriverPersonalAccidentCover').val("0");
        $("#PeronalAccidentCoverforDriver").val("No");
        $("#IsAntiTheftDevice").val("No");
        $("#RegisterintheName").val("individual");

        if ($("#CNG_LPG_Kit").val() > 0) {
            $("#rdoPlanningtoAddAccessory").val("Yes");
        }
        //$("#rdoPlanningtoAddAccessory").val("No");
        $("#SelectAdditionalCoverage").val("No");
        $("#IsLanding").val(true);
        $("#CarVariant").val($("#hdVariantID option:selected").text());
        //document.getElementById("btnCompareQuote").disabled = true;
        //SmartUpdateCustomer();
        $(".header-content-inner").addClass('hidden');
        $("#details").removeAttr('style').css("padding-top", "0px");
    }

    if (Error) {
        return false;
    } else {
        document.getElementById("btnCompareQuote").disabled = true;
        $("#btnCompareQuote").hide();
        SmartCalculateQuote();
        //SmartUpdateCustomer();
        //$("#btnPrev").hide();
    }
    return false;

   
});

})

function myfunction() {
    
	
    if ($('#DateofPurchaseofCar').val() == "") {} else {
        var temp = $('#DateofPurchaseofCar').val().split('-');

        var minManufactureDate = parseInt(temp[1]) + '-' + parseInt(temp[2] - 1);
        var maxManufactureDate = parseInt(temp[1]) + '-' + parseInt(temp[2]);

        $('#ManufactureYear').val(parseInt(temp[2]));
        $("#ManufactureMonth").val(parseInt(temp[1]));
        queryDate = parseInt(temp[1]) + '-' + parseInt(temp[2]);
        $('#ManufactureDate').bootstrapMaterialDatePicker({
            dateFormat: 'mm-yy'
        });
        //Khushbu Gite 20181005 Set min and max year and month for manufacture date 
        $('#ManufactureDate').bootstrapMaterialDatePicker('setMinDate', minManufactureDate);
        $('#ManufactureDate').bootstrapMaterialDatePicker('setMaxDate', maxManufactureDate);
        $('#ManufactureDate').bootstrapMaterialDatePicker('setDate', queryDate);
        $('#ManufactureDate').parent().removeClass('is-empty');
        $('#ErManufactureDate').hide().html("");
    }
    //Commented On 08-02-2018 By Pratik
    //if (twowheelerType == "RENEW" && $("#DateofPurchaseofCar").val() != "") {
    //    var dates = $("#DateofPurchaseofCar").val().split('-');
    //    var purchase_date = moment([dates[2] - 0, (dates[1] - 0) - 1, dates[0] - 0]);
    //    var expiry_date = moment([moment().year(), purchase_date.month(), purchase_date.date() - 1])
    //    if (moment().diff(expiry_date, 'days') <= 0) { $("#PolicyExpiryDate").bootstrapMaterialDatePicker('setDate', expiry_date._d); }
    //    else { $("#PolicyExpiryDate").bootstrapMaterialDatePicker('setDate', moment()._d); }
    //    $('#PolicyExpiryDate').parent().removeClass('is-empty');
    //}
    //CalDifference();
}

function myfunction1() {
    if ($('#PolicyExpiryDate').val() == "") {
        $('#PolicyExpiryDate').addClass('errorCheckBox');
        $('#PolicyExpiryDate').removeClass('SuccessClass');
    } else {
        var arr = $("#PolicyExpiryDate").val().split('-');
        var Days = (((new Date(Date.now())).getTime()) - ((new Date(arr[1] + "-" + arr[0] + "-" + arr[2])).getTime())) / (1000 * 60 * 60 * 24);

        if (Product_Name == "Bike") {
            if (Math.floor(Days) > 90) {
                PEDFlag = true;
                $("#divNCB").hide();
                $('#HaveNCBCertificate').val("No");
                $("#NoClaimBonusPercent").val("0");
            } else {
                PEDFlag = false;
                $("#divNCB").show();
            }
        }
        var VIST = VehicleInsuranceSubtype.split('CH_');
        if (VIST[0] == '0') {
            $("#divNCB").hide();
        }
        $('#PolicyExpiryDate').addClass('SuccessClass');
        $('#PolicyExpiryDate').removeClass('errorCheckBox');
        $('#PreviousInsurer').trigger('click');
        //$('#PreviousInsurer option').toggle();
    }
    //Commented On 08-02-2018 By Pratik
    //CalDifference();
}

function GetUrl() {
    var url = window.location.href;
    //alert(url.includes("health"));
    var newurl;
    newurl = "http://qa.policyboss.com";
    if (url.includes("request_file")) {
        //newurl = "http://qa-horizon.policyboss.com:3000";
       newurl = "http://localhost:3000";
    } else if (url.includes("qa")) {
        newurl = "http://qa-horizon.policyboss.com:3000";
    } else if (url.includes("www") || url.includes("cloudfront")) {
        newurl = "http://horizon.policyboss.com:5000";
    }
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

function CallFuelOnModelSelect(Model_ID) {
   // debugger;
    $.ajax({
        type: 'GET',
        dataType: 'json',
		data: siteURL.indexOf("https") == 0 ?  { method_name: '/vehicles/GetFuelVariant?Model_ID=' + Model_ID + '&Product_Id=' + Product_id, client_id: "2" } : "",						
		url : siteURL.indexOf("https") == 0 ? GeteditUrl()+'/TwoWheelerInsurance/call_horizon_get' : GetUrl()+ '/vehicles/GetFuelVariant?Model_ID=' + Model_ID + '&Product_Id=' + Product_id ,
        //data: {
        //    'method_name': '/vehicles/GetFuelVariant?Model_ID='+Model_ID +'&Product_Id=' + Product_id,
        //    'client_id': '2'
        // },
        //url: GeteditUrl() + '/TwoWheelerInsurance/call_horizon_get',
		// url: GetUrl() + '/vehicles/GetFuelVariant?Model_ID='+ Model_ID+'&Product_Id='+Product_id,
        success: function(Data) {
           // debugger;
			console.log(Data);
            FuelList = Data['FuelList'];
            VariantList = Data['VariantList'];
			
            $("#FuelType").empty();
            $("#FuelType").append('<option value="0">Select Fuel Type</option>');
            if (FuelList.length <= 0) {
                //$('#VehicleDetailsError').html("Fuel Type Not Found").slideUp().slideDown();
                $("#VariantID").empty();
                $("#VariantID").append('<option value="0">Select Variant</option>');
            } else {
                $.each(FuelList, function(i) {
                    var optionhtml = '<option value="' + FuelList[i] + '">' + FuelList[i] + '</option>';
                    $("#FuelType").append(optionhtml);
                    if (FuelList.length == 1) {
						
                        $('#FuelType').val(FuelList[i]).attr("selected", "selected").removeClass('Unselected');
                        //$("#FuelType").append('<option value="Petrol">Petrol</option>');
                        $('label[for=FuelType], input#FuelType').show();
                        $("#FuelType").parent().removeClass('is-empty');
                        $('#ErFuelType').html("").hide();
                        //CallVariantOnModelNFuelSelect(Model_ID, FuelList[i]);
                        CallVariantOnModelSelect(Model_ID);
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
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {}
    });
}

function CallVariantOnModelSelect(Model_ID) {
	
    $.ajax({
        type: 'GET',
        dataType: 'json',
		data: siteURL.indexOf("https") == 0 ?  { method_name: '/vehicles/GetFuelVariant?Model_ID=' + Model_ID + '&Product_Id=' + Product_id, client_id: "2" } : "",						
		url : siteURL.indexOf("https") == 0 ? GeteditUrl()+'/TwoWheelerInsurance/call_horizon_get' : GetUrl()+ '/vehicles/GetFuelVariant?Model_ID=' + Model_ID + '&Product_Id=' + Product_id ,
         //data: {
          //   method_name: '/vehicles/GetFuelVariant?Model_ID=' + Model_ID + '&Product_Id=' + Product_id,
          //   client_id: '2'
         //},
        //url: GeteditUrl() + '/TwoWheelerInsurance/call_horizon_get',
		//url: GetUrl() +'/vehicles/GetFuelVariant?Model_ID='+ Model_ID+'&Product_Id='+Product_id,
        success: function(Data) {
        
            FuelList = Data['FuelList'];
            VariantList = Data['VariantList'];
            if (Product_Name == "Bike") {
                $("#FuelType").empty().removeClass('Unselected');;
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
                $.each(FilterVariantList, function(i) {
                    var optionhtml = '<option value="' + FilterVariantList[i].Vehicle_ID + '">' + FilterVariantList[i].Variant_Name + ' (' + FilterVariantList[i].Cubic_Capacity + 'CC)</option>';
                    $("#VariantID").append(optionhtml);
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
            }
            //New Code Ends
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });
}

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

function InsurerPlanType(type) {
    
    if (type == "TP") {
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
        $(".NOTP").show();
        $("#lblTP").removeClass('btngrpSelected');
        $("#lblComp").removeClass('btngrpSelected');
        $("#lblCompTP").addClass('btngrpSelected');
        if (twowheelerType == "NEW") {
            VehicleInsuranceSubtype = "1CH" + "_" + (InsPlanTypeYear - 1) + "TP";
        } else {
            VehicleInsuranceSubtype = "";
        }
    }
    console.log("VehicleInsuranceSubtype:" + VehicleInsuranceSubtype);
    $("#VehicleInsuranceSubtype").val(VehicleInsuranceSubtype);
	$("#TPCompPlan").val(VehicleInsuranceSubtype);
}

// to call calculator API, and return CRN no and RequestID
function SmartCalculateQuote() {
    if (twowheelerType == "NEW") {
        $(".PersonalDetails").removeClass('hidden');
        $("#next").html("Please Wait").css('background-color','grey');
    } else {
        $("#next1").html("Please Wait").css('background-color','grey');
    }
    //setcookies();
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
    srn = "";
    $('#OwnerDriverPersonalAccidentCover').val("100000");
    $('#PaidDriverPersonalAccidentCover').val("0");
    $("#PeronalAccidentCoverforDriver").val("No");
    $("#IsAntiTheftDevice").val("No");
    $("#RegisterintheName").val("individual");
    //$("#VehicleInsuranceSubtype").val(VehicleInsuranceSubtype);
    if (Product_Name == "Car") { //For Car
        if ($("#lblVehRegTypeCom").hasClass('btngrpSelected')) {
            $("#RegisterintheName").val("corporate");
        }
        if ($("#lblVehRegTypeInd").hasClass('btngrpSelected')) {
            $("#RegisterintheName").val("individual");
        }
    } else {
        $("#RegisterintheName").val("individual");
    } //For Bike
    $("#MemberofAA").val("No");
    // $('#VehicleType').val($('#TwoWheelerType').val() == "NEW" ? 0 : 1);

    if ($("#VariantID").val() == PrevVehicle_id && $("#CityofRegitrationID").val() == PrevRto_id && $("#DateofPurchaseofCar").val() == PrevReg_Date) {
        $("#CustomerReferenceID").val(PreCRN);
    } else {
        $("#CustomerReferenceID").val("0");
    }

   
    var dataToPost = $("form").serializeArray();
    var objCarInsurance = {};
    $(dataToPost).each(function(index, value) {
        objCarInsurance[value.name] = value.value;
    });
 
     var manf_date=objCarInsurance['ManufactureYear'] + "-" + objCarInsurance['ManufactureMonth'] + "-01";
	 
    var expiry_date ="";
	if($('#PolicyExpiryDate').val() !== ""){
		expiry_date = $('#PolicyExpiryDate').val().split('-');
		expiry_date=expiry_date[2]+'-'+expiry_date[1]+'-'+expiry_date[0];
	}
	var DateofPurchaseofCar = $('#DateofPurchaseofCar').val().split('-');
	DateofPurchaseofCar=DateofPurchaseofCar[2]+'-'+DateofPurchaseofCar[1]+'-'+DateofPurchaseofCar[0];
	
    
	var _registration_no = $("#RegistrationNo").val() == null ? "" : $("#RegistrationNo").val();
            if (_registration_no.length == 9)
            {
                _registration_no = _registration_no.substring(0, 2) + "-" + _registration_no.substring(2, 2) + "-" + _registration_no.substring(4, 1) + "-" + _registration_no.substring(5, 4);
            }
            else if (_registration_no.length == 10)
            {
                _registration_no = $("#RegistrationNo").val().substring(0, 2) + "-" + $("#RegistrationNo").val().substring(4, 2) + "-" + $("#RegistrationNo").val().substring(6, 4) + "-" + $("#RegistrationNo").val().substring(10, 6);
            }
            else
            {
                _registration_no = "" + $("#CityofRegitration").val().substring(1, 3) + "-" + $("#CityofRegitration").val().substring(3, 5) + "-AA-1234";
            }
	
	var exc =(objCarInsurance['ElectricalAccessories']== ""?0: parseInt(objCarInsurance['NonElectricalAccessories']));

    var data1 = {
        "product_id": Product_id,
        "vehicle_id": parseInt($('#hdVariantID').val()),
        "rto_id": parseInt(objCarInsurance['CityofRegitrationID']),
        "vehicle_insurance_type":$('#VehicleType').val(),
        "vehicle_manf_date": manf_date,
        "vehicle_registration_date":DateofPurchaseofCar,
        "policy_expiry_date":expiry_date,
        "prev_insurer_id": $('#PreviousInsurer').val(),
        "vehicle_registration_type": "individual",
        "vehicle_ncb_current": objCarInsurance['NoClaimBonusPercent'],
        "is_claim_exists": objCarInsurance['HaveNCBCertificate'] == "No" ? "yes" : "no",
        "method_type": "Premium",
        "execution_async": "yes",
        "electrical_accessory": (objCarInsurance['ElectricalAccessories']== ""?0: parseInt(objCarInsurance['NonElectricalAccessories'])),
        "non_electrical_accessory":objCarInsurance['NonElectricalAccessories']== ""?0: parseInt(objCarInsurance['NonElectricalAccessories']),
        "registration_no": _registration_no,
        "is_llpd": objCarInsurance['PeronalAccidentCoverforDriver'].toLowerCase(),
        "is_antitheft_fit": objCarInsurance['IsAntiTheftDevice'].toLowerCase(),
        "voluntary_deductible": objCarInsurance['VoluntaryDeduction'],
        "is_external_bifuel": objCarInsurance['IsBiFuelKit'],
        "is_aai_member": objCarInsurance['MemberofAA'].toLowerCase(),
        "external_bifuel_type": objCarInsurance['BiFuelType'],
        "external_bifuel_value": objCarInsurance['ValueOfBiFuelKit'],
        "pa_owner_driver_si": objCarInsurance['OwnerDriverPersonalAccidentCover'],
        "pa_named_passenger_si": objCarInsurance['NamedPersonalAccidentCover'],
        "pa_unnamed_passenger_si": objCarInsurance['PersonalCoverPassenger'],
        "pa_paid_driver_si": objCarInsurance['PaidDriverPersonalAccidentCover'],
        "vehicle_expected_idv": 0,
		"vehicle_insurance_subtype":$('#TPCompPlan').val(),
        "first_name": first_name,
        "middle_name": middle_name,
        "last_name": last_name,
        "email": $("#ContactEmail").val(),
        "mobile": $("#ContactMobile").val(),
        "crn": $('#CustomerReferenceID').val()==""?"":parseInt($('#CustomerReferenceID').val()),
        "ss_id": ss_id,
        "fba_id": fba_id,
        "geo_lat": 0,
        "geo_long": 0,
        "agent_source": "",
        "ip_address": ip_address,
        "app_version": app_version,
		"mac_address": mac_address,
        "voluntary_deductible": 0,
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9"
    };

    var obj_horizon_data = Horizon_Method_Convert("/quote/premium_initiate", data1, "POST");
    console.log(JSON.stringify(data1));
    var client_id = 2;
    
        $.ajax({
            type: "POST",
            //data: JSON.stringify(data1),
            //url: GetUrl()+"/quote/premium_initiate",
            //data: JSON.stringify(obj_horizon_data['data']),
            //url: obj_horizon_data['url'],
			data : siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) :  JSON.stringify(data1),
			url :  siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/premium_initiate" ,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function(data) {
			   console.log(data)
			   srn = data.Summary.Request_Unique_Id;			   								   
				if (Product_Name == "Bike") {
                window.location.href = "./quotepage.html?SRN=" + srn + "&ClientID=" + client_id;
				} else if (Product_Name == "Car") {
				 window.location.href = "./quotepage.html?SRN=" + srn + "&ClientID=" + client_id;
				}			   
                
            },
            error: function(data) {
                
                $.alert("Cannot Proceed Now. Please Try Again!");
                console.log(data);
                
            }
        });
    
    
}



function SmartUpdateCustomer() {
	
    var client_id = 2; 

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
    var request = {
        "search_reference_number": srn,
        "first_name": first_name,
        "middle_name": middle_name,
        "last_name": last_name,
        "email": $("#ContactEmail").val(),
        "mobile": $("#ContactMobile").val(),
		"secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9"
            //"VehicleInsuranceSubtype":VehicleInsuranceSubtype
    };
    var obj_horizon_data = Horizon_Method_Convert("/quote/save_customer_details", request, "POST");
    console.log(JSON.stringify(request));
            $.ajax({
                type: 'POST',
                //url: GetUrl()+"/quote/save_customer_details",
                //data: JSON.stringify(request),
                //data: JSON.stringify(obj_horizon_data['data']),
                //url: obj_horizon_data['url'],
				data : siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) :  JSON.stringify(request),
				url :  siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/save_customer_details" ,
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
            console.log("success ", data);
            $('#body').empty();
            if (Product_Name == "Bike") {
                window.location.href = "./quotepage.html?SRN=" + srn + "&ClientID=" + client_id;
            } else if (Product_Name == "Car") {
                //window.location.href = "/CarInsuranceIndia/NewQuotePage?SID=" + srn + "&ClientID=" + client_id;
				 window.location.href = "./quotepage.html?SRN=" + srn + "&ClientID=" + client_id;
            }
        },
        error: function(data) {
            alert("Cannot Proceed Now. Please Try Again!");
            console.log(data);
           
        }
    });
}

    function GetDataFromSIDCRN(SRN, ClientID)
    {
		
		//var mainUrl = GetUrl()+"/quote/premium_summary";
		var str1 = {
        "search_reference_number": srn,
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
				mobile_no= request["mobile"];
				
				
                $("#CustomerReferenceID").val(CRN);
                console.log("CRN:" + request.crn);
                $("#TPCompPlan").show();


                PreCRN = request.crn;
                PreSRN = Summary.Request_Unique_Id;
                PrevVehicle_id = request.vehicle_id;
                PrevRto_id = request.rto_id;
                
				 
             
                if (request.registration_no !== "" && request.registration_no !== "MH-01-AA-1234" && request.registration_no !== "MH-01-ZZ-9999") {
                    RegNo = request.registration_no.split("-");
                    RegNo = RegNo[0] + RegNo[1] + RegNo[2]+ RegNo[3];
                    $("#RegistrationNo").val(RegNo);
                }

                var RegDate = request.vehicle_registration_date.substring(8,10) + "-" + request.vehicle_registration_date.substring(5,7) + "-" + request.vehicle_registration_date.substring(0,4);
                PrevReg_Date = RegDate;
                console.log("PrevReg_Date:",PrevReg_Date);
                console.log("Type:" +request.vehicle_insurance_type+"\nDateofPurchaseofCar:"+RegDate);

				$('#VehicleType').val(request.vehicle_insurance_type)
                //Added By For T.P. And Comprehensive Starts
                VehicleInsuranceSubtype = request.vehicle_insurance_subtype;
                var VehInsST = VehicleInsuranceSubtype.split('CH_');
                var VehInsSTType = "";
				//Set dropdown policytype
				TP_CompSet(request.vehicle_insurance_type.toUpperCase());
				
                if (request.vehicle_insurance_type == "new") { 
					$("#DOPCRenew").hide();
                    $("#DOPCNew").show();				
                    TwoWheelerTypeNew(); $("#DateofPurchaseofCar, #DOPCNew").val(RegDate); 
                    if (VehInsST[0] == 0) { VehInsSTType = 'TP'; }
                    else if (VehInsST[0] > 1) { VehInsSTType = 'Comp'; }
                    else { VehInsSTType = 'CompTP'; }                    
                }
                if (request.vehicle_insurance_type == "renew")  { 
				
					$("#DOPCRenew").show();
                    $("#DOPCNew").hide();				
                    TwoWheelerTypeRenew(); $("#DateofPurchaseofCar, #DOPCRenew").val(RegDate);
                    if (VehInsST[0] == 0) { VehInsSTType = 'TP'; }
                    else { VehInsSTType = 'Comp'; }                   
                }

                //Khushbu Gite 20181010 Set min and max year and month for manufacture date               
                if ($('#DateofPurchaseofCar').val() != "")
                {       
                   
                    var temp = $('#DateofPurchaseofCar').val().split('-');            
                    var minManufactureDate=parseInt(temp[1]) + '-' + parseInt(temp[2]-1);
                    var maxManufactureDate=parseInt(temp[1]) + '-' + parseInt(temp[2]);
                    $('#ManufactureDate').bootstrapMaterialDatePicker({ dateFormat: 'mm-yy' });
           
                    $('#ManufactureDate').bootstrapMaterialDatePicker('setMinDate', minManufactureDate);
                    $('#ManufactureDate').bootstrapMaterialDatePicker('setMaxDate', maxManufactureDate);
                }
                //
                
                InsurerPlanType(VehInsSTType);
                //Added By For T.P. And Comprehensive Ends

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
                if (Product_Name == "Car") {
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

                var RegDate = (request.vehicle_manf_date).split("-");
                RegDate = RegDate[2] + "-" + RegDate[1] + "-" + RegDate[0];

                var ManDate = (request.vehicle_manf_date).split("-");
                $('#ManufactureYear').val(ManDate[0]);
                $('#ManufactureMonth').val(ManDate[1]);
                ManDate = ManDate[1] + "-" + ManDate[0];
                $("#ManufactureDate").val(ManDate);

                var PolExpDate = (request.policy_expiry_date).split("-")
                PolExpDate = PolExpDate[2] + "-" + PolExpDate[1] + "-" + PolExpDate[0];
                $("#PolicyExpiryDate").val(PolExpDate);
                myfunction1();

                //City
                CityName = "(" + RTO.VehicleCity_RTOCode + ") " + RTO.RTO_City;
                $("#CityofRegitration").val(CityName);
                $('#CityofRegitrationID').val(RTO.VehicleCity_Id);

                $("#PreviousInsurer").val(request.prev_insurer_id);

                //Claim
                if(request.is_claim_exists == "yes") { $("#HaveNCBCertificate").val("No"); $(".NCBYes").removeClass('btn-UnSelected btnError').addClass('btn-primarySelected active'); }
                else { $("#HaveNCBCertificate").val("Yes"); $(".NCBNo").removeClass('btn-UnSelected btnError').addClass('btn-primarySelected active'); $("#divNoClaimBonusPercent").show(); }
                $("#NoClaimBonusPercent").val(request.vehicle_ncb_current);

                //first Name And Last Name
                var Reg = /^[a-zA-Z ]+$/;
                if (Reg.test(request.first_name) && Reg.test(request.last_name) ) { $("#ContactName").val(request.first_name+" "+request.last_name); }
                if (request.mobile!=0 && request.mobile != "") {
                    $("#ContactMobile").val(request.mobile);
                }
                if (request.email!=0 && request.email != "") {
                    if ((request.email).indexOf('testpb.com') > -1) { $("#ContactEmail").val(""); }
                    else { $("#ContactEmail").val(request.email); }
                }
                $('select').click();
                
                if (request.vehicle_registration_type == "corporate") { $("#lblVehRegTypeCom").addClass('btngrpSelected'); $("#lblVehRegTypeInd").removeClass('btngrpSelected'); $("#RegisterintheName").val("corporate");
                }
                else {
                    $("#lblVehRegTypeInd").addClass('btngrpSelected');  $("#lblVehRegTypeCom").removeClass('btngrpSelected'); $("#RegisterintheName").val("individual");
                }
                SetInputValue();
            },
            error: function (response) { }
        });
        $(".quickSection").hide();
        $(".detailSection").show().removeClass('hidden');
    }
	
	 function TwoWheelerTypeNew() {
        twowheelerType = "NEW";
        IsFastLane = "False";
        $("#TwoWheelerType").val("NEW");
        $('#divDOPCNew').show();
        $('#divDOPCRenew').hide();
        $("#lblCompTP").show();

        //$('#DateofPurchaseofCar').bootstrapMaterialDatePicker({
        //    time: false, clearButton: true, format: 'DD-MM-YYYY',
        //    minDate: moment().subtract(6, 'months'), // 6 Months Before The Current Day
        //    maxDate: moment(), // Current day
        //    currentDate: moment() // Current day
        //});
        //$('#DateofPurchaseofCar').val("");
        //var DateofPurchaseofCar = $('#DateofPurchaseofCar').val();
        //$('#DateofPurchaseofCar').on('open', function(e, date) {   $('#DateofPurchaseofCar').val(""); });

        $('#DOPCNew').bootstrapMaterialDatePicker({
            time: false, clearButton: true, format: 'DD-MM-YYYY',
            minDate: moment().subtract(6, 'months'), // 6 Months Before The Current Day
            maxDate: moment(), // Current day
            currentDate: moment() // Current day
        });

        $('#DOPCNew').val("");
        $('#DOPCNew').on('open', function(e, date) {   $('#DOPCNew').val(""); });
    }
    function TwoWheelerTypeRenew() {
        twowheelerType = "RENEW";
        $("#TwoWheelerType").val("RENEW");
        $('#divDOPCRenew').show();
        $('#divDOPCNew').hide();
        $("#lblCompTP").hide();
        if (!isPostBack) { $("#NoClaimBonusPercent").val("0"); }
        //$('#DateofPurchaseofCar').bootstrapMaterialDatePicker({
        //    time: false, clearButton: true, format: 'DD-MM-YYYY',
        //    minDate: moment().subtract(15, 'years'), // 15 Years Before The Current Day // moment().subtract(15, 'y'),
        //    maxDate: moment().subtract(6, 'months'),// 6 Months Before The Current Day
        //    currentDate: moment().subtract(12, 'months'), // 1 Year Before The Current Day
        //    onSelect: function () { myfunction(); }
        //});
        //$('#DateofPurchaseofCar').val("");
        //var DateofPurchaseofCar = $('#DateofPurchaseofCar').val();
        //$('#DateofPurchaseofCar').on('open', function(e, date) {   $('#DateofPurchaseofCar').val(""); });

        $('#DOPCRenew').bootstrapMaterialDatePicker({
            time: false, clearButton: true, format: 'DD-MM-YYYY',
            minDate: moment().subtract(15, 'years'), // 15 Years Before The Current Day // moment().subtract(15, 'y'),
            maxDate: moment().subtract(6, 'months'),// 6 Months Before The Current Day
            currentDate: moment().subtract(12, 'months'), // 1 Year Before The Current Day
            onSelect: function () { myfunction(); }
        });
        $('#DOPCRenew').val("");
        $('#DOPCRenew').on('open', function(e, date) {   $('#DOPCRenew').val(""); });

        $('#PolicyExpiryDate').bootstrapMaterialDatePicker({
            time: false, clearButton: true, format: 'DD-MM-YYYY',
            minDate: (Product_Name =="Bike" ? moment().subtract(180, 'days') : moment()), // (180 Days Before The Current Day) Or (Current Day)
            maxDate: moment().add(60, 'days'), // 180 Days After The Current Day
            defaultDate: moment(),
            onselect: function () { myfunction1(); }
        });
    }
	
	  function SetInputValue()
    {
        $(".ErrorMsg").hide().html("");
        $("input").each(function (i, element) {//$("input[type='text']").each(function (i, element) {
            var This = $(this);
            if (This.val() == "" || This.val() == "0") { $(this).parent().addClass('is-empty'); }
            else { $(this).parent().removeClass('is-empty'); }
        });
        $('select').each(function () {
            var thisId = $(this).attr('Id');
            if ($(this).val() == "0" || $(this).val() == null) { $('label[for=' + thisId + '], input#' + thisId + '').hide(); $(this).addClass('empty'); }
            else { $('label[for=' + thisId + '], input#' + thisId + '').show(); }
        });
    }

function TP_CompSet(type) {
	
    if (type == "RENEW") {
        $('#TPCompPlan').append($("<option></option>").attr("value", "").text("Select"));
        $('#TPCompPlan').append($("<option></option>").attr("value", "0CH_1TP").text("TP ONLY (1 year)"));
        $('#TPCompPlan').append($("<option></option>").attr("value", "1CH_0TP").text("Comprehensive Plan (1 Yr)"));
		$('#TPCompPlan').val("1CH_0TP");
    } else if (type == "NEW") {
        $('#TPCompPlan').append($("<option></option>").attr("value", "").text("Select"));
        $('#TPCompPlan').append($("<option></option>").attr("value", "0CH_3TP").text("TP ONLY (3 year)"));
		$('#TPCompPlan').append($("<option></option>").attr("value", "1CH_2TP").text("Comprehensive (1 Yr) + T.P. (2 Yrs)"));
        $('#TPCompPlan').append($("<option></option>").attr("value", "3CH_0TP").text("Comprehensive Plan (3 Yr)"));
       
		$('#TPCompPlan').val("1CH_2TP");
    }
	
	
	 if (VehicleInsuranceSubtype != null && VehicleInsuranceSubtype != "") {
			
		$('#TPCompPlan').val(VehicleInsuranceSubtype);
        }

}
  function GetFastLane(RegNo) {
        $('#divDOPCRenew').show();
        $('#divDOPCNew').hide();
		var data1 = {
			 "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
			 "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
			 "RegistrationNumber":RegNo
			
		}
		var obj_horizon_data = Horizon_Method_Convert("/quote/vehicle_info", data1, "POST");
        $.ajax({
            //url: "http://horizon.policyboss.com:5000/quote/vehicle_info",
            type: "POST",
			data : siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) :  JSON.stringify(data1),
			url :  siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/vehicle_info" ,
            //data: JSON.stringify(obj_horizon_data['data']),
            //url: obj_horizon_data['url'],
            //data: JSON.stringify(data1),
            dataType: "json",
            traditional: true,
            contentType: "application/json; charset=utf-8",
            success: function (data,e) {
				
                console.log(data);
                
                if (Product_Name == "Car" && data.Variant_Id > 50000) { // Checking Invalid Bike Registration Number
                    FlagRegNoValid = 1;
                }
                if (Product_Name == "Bike" && data.Variant_Id < 50000) { // Checking Invalid Car Registration Number
                    FlagRegNoValid = 1;
                }
                if (data!= "" && FlagRegNoValid != 1 ) {
                    $("#FastlaneMsg").show();
                    //All Details Not Null
                    //$(".quickSection").hide();
                    //$(".detailSection").show();
                    $("#TwoWheelerType").val("renew");
                    if (data.Make_Name == "" || data.Make_Name == null || data.Model_Name == "" || data.Model_Name == null) {
                        $("#ErMakeModel").show().addClass('DetailsError');
                    }
                    else {
                        varcarmodel = data.Model_Name;
                        $("#MakeName").val(data.Make_Name);
                        ModelSelected = data.Model_Name;
                        $("#Model_Name").val(data.Model_Name);
                        $("#MakeModel").val(data.Make_Name + ', ' + data.Model_Name);
                        $("#MakeModelID").val(data.Model_ID);
                        //if (Product_Name == "Car") { CallFuelOnModelSelect(data.Model_Name); }
                    }

                    if (data.Fuel_Type != null && data.Fuel_Type != "") {
                        FuelSelected = (data.Fuel_Type).toUpperCase();
                        //CallFuelOnModelSelect(data.Model_ID);
                        if (Product_Name == "Car") {
						CallFuelOnModelSelect(data.Model_ID); }
                        //$("#FuelType").val(data.Fuel_Type);
                        //$('#FuelType :selected').text(data.Fuel_Type);
                        //$("#FuelSelected").val(data.Fuel_Type);
                    }
                    else { $("#ErFuelType").show().addClass('DetailsError');  }

                    if (data.Variant_Id != null && data.Variant_Id != 0 && data.Variant_Id != "0" && data.Variant_Id >= 0) {

                        VariantIDSelected = data.Variant_Id;
                        $("#VariantID").val(VariantIDSelected).removeClass('Unselected');
                        if (Product_Name == "Car") {
                            $("#hdVariantID").val(VariantIDSelected);
							
                            if (data.Model_Name != null && data.Model_Name != "" && data.Fuel_Type != null && data.Fuel_Type != "") {
                                $("#MakeModelID").val(data.Model_ID);
                                //CallVariantOnModelNFuelSelect(data.Model_Name, data.Fuel_Type); // Temporary Change For Variant List on 16-02-2018
                                CallVariantOnModelSelect(data.Model_ID);
                                //$("#VariantID").val(VariantIDSelected);
                            }
                            else { $("#ErVariantID").show().addClass('DetailsError'); }
                        }
                        if (Product_Name == "Bike") {
                            $("#TwoWheelerVariantID").val(VariantIDSelected);
                            //Here data.Model_ID != null Have to Check
                            if (data.Model_Name != null && data.Model_Name != "") {
                                $("#MakeModelID").val(data.Model_ID);
                                CallVariantOnModelSelect(data.Model_ID);
                                ///$("#VariantID").val(VariantIDSelected);
                            }
                            else { $("#ErVariantID").show().addClass('DetailsError'); }
                        }
                    }
                    else {
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
                    }
                    else { $("#ErCityofRegitration").show().addClass('DetailsError'); }

                    $('#DOPCRenew').bootstrapMaterialDatePicker({
                        time: false, clearButton: true, format: 'DD-MM-YYYY',
                        minDate: moment().subtract(15, 'years'), // 15 Years Before The Current Day // moment().subtract(15, 'y'),
                        maxDate: moment().subtract(6, 'months'),// 6 Months Before The Current Day
                        currentDate: moment().subtract(12, 'months'), // 1 Year Before The Current Day
                        onSelect: function () { myfunction(); }
                    });

                    $("#PolicyExpiryDate").bootstrapMaterialDatePicker(
                    {
                        time: false, clearButton: true, format: 'DD-MM-YYYY',
                        minDate: (Product_Name =="Bike" ? moment().subtract(180, 'days') : moment()), // (180 Days Before From The Current Day) : (Current Day)
                        maxDate: moment().add(60, 'days'), // 60 Days From The Current Day
                        defaultDate: moment(),
                        onselect: function () { myfunction1(); }
                    });

                    //Check Whether Year Valid Or Not // For Format FEB2014
                    if (data.Manufacture_Year != "NULL" && data.Manufacture_Year != "" && data.Manufacture_Year !=null && data.Manufacture_Year != "0") // Year Validate
                    {
                        var CurMonth =  1; // new Date().getMonth() + 1; //
                        if (CurMonth < 10) { CurMonth = "0" + CurMonth; }
						
						var RegDate=data.Registration_Date.split('/');

                        if (data.Manufacture_Year!= null) {
                            //var Month = GetMonthNum(RegDate[1])

                            $("#ManufactureDate").val(RegDate[1] + "-" + data.Manufacture_Year);
                            $('#ManufactureYear').val(data.Manufacture_Year);
                            $('#ManufactureMonth').val(RegDate[1]);
                        }

                        VarDateofPurchaseofCar = data.Registration_Date;
                        var today = new Date();
                        var month = today.getMonth() + 1;
                        var day = today.getDate();
                        if (day < 10) { day = "0" + day; }
                        if (month < 10) { month = "0" + month; }
                        today = day + '-' + month + '-' + today.getFullYear();

                        $("#PolicyExpiryDate").val(today);
                    }
                    else { $("#ErPolicyExpiryDate, #ErDateofPurchaseofCar, #ErManufactureDate").show().addClass('DetailsError'); }

					var NewRegDate=data.Registration_Date.replace(/\//g, '-');
					
					
                    if (data.Registration_Date != null && data.Registration_Date != "") { $("#DateofPurchaseofCar, #DOPCRenew").val(NewRegDate); }
                    else { $("#DateofPurchaseofCar, #DOPCRenew").val("");  $("#ErDateofPurchaseofCar, #ErDOPCRenew").show().addClass('DetailsError'); }

                    //$('#DateofPurchaseofCar').bootstrapMaterialDatePicker(
                    //{
                    //    time: false, clearButton: true, format: 'DD-MM-YYYY',
                    //    minDate: moment().subtract(15, 'years'), // 15 Years Before The Current Day // moment().subtract(15, 'y'),
                    //    maxDate: moment().subtract(6, 'months'),// 6 Months Before The Current Day
                    //    currentDate: moment().subtract(12, 'months'), // 1 Year Before The Current Day
                    //    onSelect: function () { myfunction(); }
                    //});

                    $("#PolicyExpiryDate").datepicker("refresh");
                    $("#RegistrationNo").val(RegNo);
                    //CalDifference();
                    SetInputValue();
                    $(".quickSection").hide();
                    $(".detailSection").show();
                    $(".DetailsError").show();
                }
                else if (FlagRegNoValid == 1 && data.VariantID != 0) {
                    $("#PreLoader").hide();
                    var EMsg ="Please Enter Valid "+ Product_Name+" Registration Number."
                    $("#RegistrationNoError").show().html(EMsg);
                    return false;
                    //$(".back").click();
                }
                else {
                    IsFastLane = "False";
                    $(".quickSection").hide();
                    $(".detailSection").show();
                    validationMsg = "Your Vehicle Details Not Found. Please Enter Manually";
                    $("#MakeModel").val("");
                    $("#MakeModelID").val(0);
                    //$('#VehicleDetailsError').html(validationMsg).slideUp().slideDown();
                    SetDefaultValue();
                    TwoWheelerTypeRenew();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                SetDefaultValue();
                TwoWheelerTypeRenew();
            }
        });
    }
    function CheckType(type) {
		
        FlagRegNoValid = 0;
        $("#VehicleDetailsError").html("").hide();
        $("#DateofPurchaseofCar").val("");
        //$("#DateofPurchaseofCar").datepicker("refresh");
        //$('#DateofPurchaseofCar').bootstrapMaterialDatePicker('destroy');
        $("#TPCompPlan").show();
        if (type == "New") {
            if (Product_Name == 'Car') { InsPlanTypeYear = 3; }
            else { InsPlanTypeYear = 5; }
            
            $('#HaveNCBCertificate').val("No");
            $("#PolicyExpiryDate").datepicker("refresh");
            SetDefaultValue();
            TwoWheelerTypeNew();
            InsurerPlanType("CompTP");
        }
        else if (type == "Renew") {
            InsPlanTypeYear = 1;
             
            $('#ManufactureYear').val("");
            $('#ManufactureMonth').val("");
            SetDefaultValue();
            TwoWheelerTypeRenew();
            InsurerPlanType("Comp");
        }
        else if (type == "FastLane") {
			
            InsPlanTypeYear = 1;
            twowheelerType = "RENEW";
			TP_CompSet(twowheelerType)
            $("#TwoWheelerType").val("RENEW");
           
            $("#DOPCRenew").show();
            $("#DOPCNew").hide();
			$('#VehicleType').val('renew');
			
			
            $("#lblCompTP").hide();
            $("#RegistrationNoError").hide().html("");
            RegNo = $("#RegistrationNo").val().toUpperCase();
			
            var pattern1 = new RegExp('^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$');//new RegExp('^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$');
            var Result1 = pattern1.test(RegNo);
            var pattern2 = new RegExp('^[A-Z]{2}[0-9]{2}[A-Z]{3}[0-9]{4}$');
            var Result2 = pattern2.test(RegNo);
            var pattern3 = new RegExp('^[A-Z]{2}[0-9]{2}[A-Z]{1}[0-9]{4}$');
            var Result3 = pattern3.test(RegNo);
			var pattern4 = new RegExp('^[A-Z]{2}[0-9]{1}[A-Z]{2}[0-9]{4}$');
            var Result4 = pattern4.test(RegNo);
            if (RegNo != "" && !(RegNo.length < 8 && RegNo.length > 11)) {
                if ((RegNo.length == 10 && Result1 == true) || (RegNo.length == 11 && Result2 == true) ||(RegNo.length == 9 && Result3 == true) ||(RegNo.length == 9 && Result4 == true)) {
                    twowheelerType = "RENEW";
                    IsFastLane = 'True';
                    $("#PreLoader").show();
                    //SetDefaultValue();
                    GetFastLane(RegNo);
                    SetInputValue();
					$("#register_vehicle").slideUp();
					$("#dont_remember").show();
                }
                else {
                    $("#RegistrationNo").addClass('ErrorClass');
                    var validationMsg = "Please Enter Valid Registration Number.";
                    $('#RegistrationNoError').html(validationMsg).slideUp().slideDown();
                    return false;
                }
            }
            else {
                $("#RegistrationNo").addClass('ErrorClass');
                var validationMsg = "Please Enter Valid Registration Number.";
                $('#RegistrationNoError').html(validationMsg).slideUp().slideDown();
                return false;
            }
            InsurerPlanType("Comp");
        }
        SetInputValue();
		
        //SetTextInsPlan(InsPlanTypeYear);
    }
	 function SetTextInsPlan(Years)
    {
        var year, Yeartext = "";
        if (twowheelerType == "NEW") { year = Years - 1;}
        else { Years = 1; }
        
        if (Years == 1 ) { Yeartext = "1 Yr" } else { Yeartext = Years+" Yrs"}
        
        $("#lblTP").text("T.P. Only ("+ Yeartext+")");
        $("#lblCompTP").text("Comprehensive (1 Yr) + T.P. ("+year+" Yrs)");
        $("#lblComp").text("Comprehensive Plan ("+ Yeartext+")");
    }
	
	 function forceKeyPressUppercase(e) {
     var name = e.target.value;
     var input_length = name.length;
     var charInput = e.keyCode;
     if ((charInput >= 97) && (charInput <= 122) && (input_length < 50)) { // lowercase
         if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKEY) { // no modifier key
             var newChar = charInput - 32;
             var start = e.target.selectionStart;
             var end = e.target.selectionEnd;
             e.target.value = e.target.value.substring(0, start) + String.fromCharCode(newChar) + e.target.value.substring(end);
             e.target.setSelectionRange(start + 1, start + 1);
             e.preventDefault();
         }
     }
 }
	document.getElementById("ContactName").addEventListener("keypress", forceKeyPressUppercase, false);
	
	 $('#ContactName').on('keypress', function(event) {
     var inputValue = event.which;
     var regex = new RegExp("^[a-zA-Z ]+$");
     var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
     if (!regex.test(key)) {
         event.preventDefault();
         return false;
     }
 });
 
 function Quote_page(){
	 if(app_version=="FinPeace"){
		window.location.href = './quote_list.html?ss_id=' + ss_id + '&fba_id=' + fba_id + '&ip_address=' + ip_address + '&mac_address=' + mac_address + '&app_version=' + app_version +'&mobile_no='+ mobile_no;
	 }
	 else{
		 window.location.href = './quote_list.html?ss_id=' + ss_id + '&fba_id=' + fba_id + '&ip_address=' + ip_address + '&mac_address=' + mac_address + '&app_version=' + app_version ;
	 }
 }
	
	