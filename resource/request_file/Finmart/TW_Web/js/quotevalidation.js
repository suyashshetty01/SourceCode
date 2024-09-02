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
var SRN ="";//"SRN-7QSMHV8C-3OWA-ALSO-G91H-CQNQNK1FLGVK_63742";
var quotes;
var insurer_count = 0;
var StatusCount = 0;
var html_addon = $('.insurance-cover').html();
var CoverCount = 0;
var DiscountCount = 0;
var Response_Global;
var Name="";
var EmailVal = "";
var ss_id, fba_id, ip_address, app_version, mac_address,mobile_no,srn,client_id=2;
var Error=0;
var AddOnSelectedList = [];
var IsLoad = true;

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
     
function stringparam(){
		//debugger;
		ss_id = getUrlVars()["ss_id"];
        fba_id = getUrlVars()["fba_id"];
        ip_address = getUrlVars()["ip_address"];
        app_version = getUrlVars()["app_version"];
        mac_address = getUrlVars()["mac_address"];
		SRN=getUrlVars()["SRN"];
		client_id=getUrlVars()["ClientID"];
	
				if(getUrlVars()["mobile_no"]=="" || getUrlVars()["mobile_no"]== undefined){
				mobile_no=0;
				}else if((app_version=='FinPeace') && getUrlVars()["mobile_no"] !="") 
				{
					mobile_no = getUrlVars()["mobile_no"];
					$('#ContactMobile').val(getUrlVars()["mobile_no"]);
				}
				 var url = window.location.href;
				 if(!url.includes("quotepage")){
				 if(SRN !=null && SRN !="" && client_id !=null && client_id !="" ){
					 
					 $('#InputForm').show();
					 $('.basicDetails').hide();
					 $('.footerDiv').show();
					 GetDataFromSIDCRN(srn,client_id);
                     $(".warningmsg").hide();
					}
				 }
                 else if (fba_id == "" || fba_id ==undefined ||fba_id == "0" || ip_address == '' ||ip_address == '0' || ip_address == undefined || app_version == "" ||app_version == "0"|| app_version == undefined || ss_id  ==""|| ss_id==undefined  ||ss_id  =="0") {

                    $(".maindiv").hide();
                    $(".warningmsg").show();
                }
				else if(app_version=='FinPeace' && (mobile_no=="" || mobile_no == null || mobile_no==0)){
					$(".maindiv").hide();
					$(".warningmsg").show();
				}
                else {

                    $(".maindiv").show();
                    $(".warningmsg").hide();
                }
}

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

function GetUrl() {
    var url = window.location.href;
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
var htmllist=$('.quoteboxparent').html();
function response_handler(){
	//debugger;
	insurer_count=0;
	$('.quoteboxparent').html("");
	 for (var i = 0; i < quotes.Response.length ; i++) {
	 
		 
		  
		   if (['LM003', 'LM004', 'LM005', 'LM006'].indexOf(quotes.Response[i].Error_Code) == -1) {
			   
            Display_Insurer_Block(quotes.Response[i].Insurer);
			 $('.quoteboxparent').append(htmllist);
        }
		 else {
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
		current_div.empty();
        current_div.append(quote);
		//debugger;
		 $('.insurer_ctn').html(insurer_count);
		 
		 
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
            //populate common addon
            $.each(common_addon_list, function (index, value) {
                IsAddonPresent = true;
                addon = html_addon;
                addon = addon.replace(new RegExp('___Common_Addon___', 'gi'), index);
                //addon = addon.replace('___Common_Addon_Name___', addon_list[index]);//12-02-2018
                addon = addon.replace('___Common_Addon_Name___', addon_list[index] + '(' + addon_shortlist[index] + ')');
                if (value.min == value.max) { addon = addon.replace('___addon_range___', 'Upto &#8377; ' + Math.round(value.min)); }
                else { addon = addon.replace('___addon_range___', '&#8377; ' + Math.round(value.min) + ' - &#8377; ' + Math.round(value.max)); }

                $('.insurance-cover').append(addon);
                AddOnCount++;
                if (AddOnCount < 2) { $("#selectall").hide(); }
                else { $("#selectall").show(); $(".chkAddons").show(); }

                
            });
            AddonSection = $("#AddonSection").html();
            html_PremCompareAddonsIns = $('.PremCompareAddonsIns').html();
            $('.insurance-cover').removeClass('hidden');
        }
        else {
            $(".chkAddons").hide();
            IsAddonPresent = false;
            $("#Standaloneedit").html('<div style="margin: 10px;text-align: center;">No Addons Available</div>');
        }

        // check uncheck based on previous search //Object.keys(quotes.Summary.Addon_Request).length > 0
        if (quotes.Summary.hasOwnProperty("Addon_Request") && quotes.Summary.Addon_Request  != null && (Object.keys(quotes.Summary.Addon_Request).length > 0)) {
            if (Object.keys(quotes.Summary.Common_Addon).length <= 0) {
                $('.insurance-cover').html("No Addons Available").css("text-align", "center");
            }

            // check uncheck based on previous search For Bundle And Standalone addons
            if (quotes.Summary.Addon_Request.hasOwnProperty("addon_standalone")) {
                if (Object.keys(quotes.Summary.Addon_Request.addon_standalone).length > 0) {
                    $.each(quotes.Summary.Addon_Request.addon_standalone, function (index, value) {
                        if (value == "yes") { $('#' + index).click();  }                            
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
        //handle_addon_addition();



        //set odometer values
        $('.insurer_count').text("");
		$('.insurer_count').text(insurer_count);
        $('.idv_min').html(quotes.Summary.Idv_Min == null ? 0 : quotes.Summary.Idv_Min);
        $('.idv_max').html(quotes.Summary.Idv_Max == null ? 0 : quotes.Summary.Idv_Max);

        SetValues();
        if (CoverCount == 1) { $(".trCover").removeClass('hidden'); }
        else { $(".trCover").addClass('hidden'); }
        if (DiscountCount == 1) { $(".trDiscount").removeClass('hidden'); }
        else { $(".trDiscount").addClass('hidden'); }
    }

		 // alert(value.Insurer.Insurer_ID);
		
		 
	 
	  }
}


function OnEdit(){
	 
	  window.location.href='/Finmart/TW_Web'+$("#EditInfo").attr("href");

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
	


	
    
function myfunction() {

    if ($('#DateofPurchaseofCar').val() == "") {} else {
       // 
        var temp = $('#DateofPurchaseofCar').val().split('-');

        var minManufactureDate = parseInt(temp[1]) + '-' + parseInt(temp[2] - 1);
        var maxManufactureDate = parseInt(temp[1]) + '-' + parseInt(temp[2]);

        $('#ManufactureYear').val(parseInt(temp[2]));
        $("#ManufactureMonth").val(parseInt(temp[1]));
        queryDate = parseInt(temp[1]) + '-' + parseInt(temp[2]);
        $('#ManufactureDate').bootstrapMaterialDatePicker({
            dateFormat: 'mm-yy'
        });
		$('#ManufactureDate').val('');
        //Khushbu Gite 20181005 Set min and max year and month for manufacture date 
        $('#ManufactureDate').bootstrapMaterialDatePicker('setMinDate', minManufactureDate);
        $('#ManufactureDate').bootstrapMaterialDatePicker('setMaxDate', maxManufactureDate);
        $('#ManufactureDate').bootstrapMaterialDatePicker('setDate', queryDate);
        $('#ManufactureDate').parent().removeClass('is-empty');
        $('#ErManufactureDate').hide().html("");
    }

}

function CheckAntitheft(value) {
    if (value == "0") { $("#IsAntiTheftDevice").html("No");  
	$('#ATN').addClass('active');
	$('#ATY').removeClass('active');}
    else { $("#IsAntiTheftDevice").html(value);
		   $('#ATY').addClass('active');
		   $('#ATN').removeClass('active');
	}
    $("#IsAntiTheftDevice").val(value);
}

function cover_filter(){
	////;
	debugger;
	
	     var motorobject = new Object()
            //var request = search_summary.Request;
            var request = Response_Global.Summary.Request_Core;
            var Err = 0;

            var Eleval = $('#ElectricalAccessories').val();
            var NonEleval = $('#NonElectricalAccessories').val();
            var pattern = /^[0-9]*$/;
            //$('#spnElectricalAccessories, #spnNonElectricalAccessories').remove();

            if (Eleval != 0 || Eleval != "") {
                if (Eleval < 10000 || Eleval > 50000 || pattern.test(Eleval) == false || Eleval.length != 5 || Eleval == "") {
                    Err++;
                    $('#spnElectricalAccessories').addClass('ErrorMsg');
                    $('#ElectricalAccessories').addClass('errorClass1');
                }
                else { $('#spnElectricalAccessories').removeClass('ErrorMsg'); $('#ElectricalAccessories').removeClass('errorClass1'); }
            }

            if (NonEleval != 0 || NonEleval != "") {
                if (NonEleval < 10000 || NonEleval > 50000 ||  pattern.test(NonEleval) == false || NonEleval.length != 5 || NonEleval == "") {
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
                if (parseInt($("#ExpectedIDV").val()) < parseInt($('#expected_idv').attr("min")) || parseInt($("#ExpectedIDV").val()) > parseInt($('#expected_idv').attr("max"))) {$("#ExpectedIDV").addClass('errorClass1'); $(".spnExpectedIDV").addClass('ErrorMsg'); Err++; }
                else { $("#ExpectedIDV").removeClass('ErrorMsg'); }
            }
			
            if (Err > 0) { return false; }
			var REGNO = (request.registration_no).replace(/-/g, '');
			var manf_date=request.vehicle_manf_date.substring(0, 4) + "-" + request.vehicle_manf_date.substring(5, 7) + "-01";
			
           var data1 = {
        "product_id": Product_id,
        "vehicle_id": request.vehicle_id,
        "rto_id": request.rto_id,
        "vehicle_insurance_type":request.vehicle_insurance_type,
        "vehicle_manf_date": manf_date,
        "vehicle_registration_date": request.vehicle_registration_date,
        "policy_expiry_date":request.policy_expiry_date,
        "prev_insurer_id": request.prev_insurer_id.toString(),
        "vehicle_registration_type": "individual",
        "vehicle_ncb_current": request.vehicle_ncb_current,
        "is_claim_exists": request.is_claim_exists ,
        "method_type": "Premium",
        "execution_async": "yes",
        "electrical_accessory": parseInt($("#ElectricalAccessories").val()),
        "non_electrical_accessory": parseInt($("#NonElectricalAccessories").val()),
        "registration_no": request.registration_no,
        "is_llpd":  $("#PeronalAccidentCoverforDriver").val() == "Yes" ? "yes" : "no",
        "is_antitheft_fit": $("#IsAntiTheftDevice").val() == "Yes" ? "yes" : "no",
        "voluntary_deductible": $("#VoluntaryDeduction").val(),
        "is_external_bifuel": request.is_external_bifuel,
        "is_aai_member": $("#MemberofAA").val() == "Yes" ? "yes" : "no",
        "external_bifuel_type": request.external_bifuel_type,
        "external_bifuel_value":  request.external_bifuel_value>0?request.external_bifuel_value:"",
        "pa_owner_driver_si": $("#ODPAC").val() == "" ? 1500000 : parseInt($("#ODPAC").val()),
        "is_having_valid_dl": $('#IsHavingValidDL').val() == "Yes" ? true : false,
        "is_opted_standalone_cpa": $('#IsHavingSCPACheckIsHavingSCPA').val() == "No" ? false : true,
        "pa_named_passenger_si": $('#NamedPersonalAccidentCover').val() == undefined ? "0" : $('#NamedPersonalAccidentCover').val(),
        "pa_unnamed_passenger_si": $('#PersonalCoverPassenger').val() == undefined ? "0" : $('#PersonalCoverPassenger').val(),
        "pa_paid_driver_si" : $("#PaidDriverPersonalAccidentCover").val() == "Yes" ? "100000" : "0",
        "vehicle_expected_idv": parseInt($("#ExpectedIDV").val()),
		"vehicle_insurance_subtype":request.vehicle_insurance_subtype,
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
		"client_id": 2,
        "ip_address": request.ip_address,
        "app_version": request.app_version,
		"mac_address": request.mac_address,
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9"
    };

             console.log(JSON.stringify(data1));
             $.ajax({
            type: "POST",
            data: JSON.stringify(data1),
            url: GetUrl()+"/quote/premium_initiate",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function(data) {
              //debugger;
			   console.log(data)
			   SRN = data.Summary.Request_Unique_Id;
				console.log(SRN);				
				window.location.href = "/Finmart/TW_Web/quotepage.html?SRN=" + data.Summary.Request_Unique_Id + "&ClientID=" + clientid;
            },
            error: function(data) {
                
                $.alert("Cannot Proceed Now. Please Try Again!");
                console.log(data);
                
            }
        });
	
}


function CheckOwnerDriverPersonalAccidentCover(value) {
	
    if (value == "Yes") {
        $("#ODPAC").val(1500000).text('1500000');
        $('#CKAY').addClass('active');
		$('#CKAN').removeClass('active');
    }
    else if (value == "No") {
        $("#ODPAC").val(0).text('0');
        $('#CKAN').addClass('active');
		$('#CKAY').removeClass('active');
    } 
    
    $("#OwnerDriverPersonalAccidentCover").val(value);
}	

     $(document).on("click", ".PremiumBreakup", function () {
		 //debugger;
		 var premium_values=$(this).children(".PremiumBreakup");
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
            $(".PremiumDetails").show();
			var addontext=$('.switch-outer').children('.active').text().trim();

			if(addontext=="WITHOUT ADD-ON" || !premium_values.attr("addonpremium") > 0){
				$('.addonsList').hide();
			}else{
				$('.addonsList').show();
			}
        });
		
		var PremiumArray = ['sBasicOwnDamage', 'ODDiscount', 'BiFuelKitPremium', 'AutomobileAssociationMembershipPremium', 'UnderwriterLoading',
    'NonElectricalAccessoriesPremiumNEA', 'ElectricalAcessoriesPremium', 'AntiTheftDiscount', 'PersonalAccidentCoverForNamedPassenger',
    'PersonalAccidentCoverForPaidDriver', 'VoluntaryDeductions', 'NoClaimBonus', 'TotalLiabilityPremium', 'ThirdPartyLiablityPremium',
    'PersonalAccidentCoverForOwnerDriver', 'LegalLiabilityPremiumForPaidDriver', 'PersonalAccidentCoverForUnammedPassenger', 'BiFuelKitLiabilityPremium', 'AddOnPremium']
		
		function PremiumDetailsValues() {
			//debugger;
    for (var i = 0; i < PremiumArray.length; i++) {
        if ($("#" + PremiumArray[i]).text() == "0" || $("#" + PremiumArray[i]).text() == "") { $("#" + PremiumArray[i]).closest('tr').hide(); }
        else { $("#" + PremiumArray[i]).closest('tr').show(); }
    }
}
function PremiumPopupDetailsValues() {
    for (var i = 0; i < PremiumArray.length; i++) {
        if ($("." + PremiumArray[i]).text() == "0" || $("." + PremiumArray[i]).text() == "") { $("." + PremiumArray[i]).parent().parent().remove(); }
        else { $("." + PremiumArray[i]).parent().parent().show(); }
    }
}

function redirect(id) {
	
	$(id).attr('href', $(id).attr('href').replace("___proposal_url___", "two-wheeler-insurance/buynow"));
	$(id).attr('href', $(id).attr('href').replace("___client_id___", clientid));
	 $(id).attr('href', $(id).attr('href').replace("AgentType", AgentType));
	 $(id).attr('href', $(id).attr('href').replace("IsCustomer", ss_id));
	 var hrefval =$(id).attr('href');	
	 var newurl=SetUrl()+hrefval
	 window.location.href=newurl;
 
}
function SetUrl() {
    var url = window.location.href;
    //alert(url.includes("health"));
    var newurl;
    newurl = "http://qa-horizon.policyboss.com:3000";
    if (url.includes("request_file")) {
     
	   newurl="http://localhost:50111";
    } else if (url.includes("qa")) {
        newurl = "http://qa.policyboss.com";
    } else if (url.includes("www") || url.includes("cloudfront")) {
        newurl = "https://www.policyboss.com";
    }
    return newurl;
}
function AllAddons(input){
	if(input == true){	
		handle_addon_addition();
	}else{
		$('.addon-selectedMobile').empty();
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

				}
			});
			
		}
		
	}
	addon_filter();
	
};

function handle_addon_addition() {
	
	 var NewAddOnSelectedList = [];
    BundleResponse = {};
    NewAddOnSelectedList = AddOnSelectedList;
    var BundleHtml = $("#BundleEdit").html();
    $("#BundleBody").html("");
    var InsurerCount = 0;
    $("#BundleEdit").html("");
	var BundleCount=0;
    if (quotes.Response.length > 0) {

      
        
		if (quotes.Summary.hasOwnProperty("Addon_Request") && quotes.Summary.Addon_Request!=null  &&(Object.keys(quotes.Summary.Addon_Request).length > 0) && IsLoad == true) {
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
					//debugger;
                    $.each(value.Addon_List, function (i, v) {
						//debugger;
                        //var addon_name = addon_list[v.id];  
                        var addon_name = addon_shortlist[i];
                        var addon_Fullname = addon_list[i];
                        if (typeof value.Addon_List[i] !== 'undefined') {
                            count++;
                             addon_premium = value.Addon_List[i];
                            addon_amount += addon_premium;

                            //addon_premium_breakup += addon_name + '-' + addon_premium + '+';//Commented By Pratik On 14-02-2018
                            addon_premium_breakup += addon_Fullname + '-' + addon_premium + '+';// Added By Pratik On 14-02-2018
                            //For Desktop
                            //$($('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.addon-selected')).append('<div style="margin-bottom: 2px;font-size: 11px;background-color: #0091c0;color:#fff; padding: 3px;border-radius:2px; /*text-align: center*/; float:left; padding-right: 0px; padding-left: 0px !important;margin-right: 3px;" class="col-xs-4 col-md-2 form-height" title="' + addon_Fullname + '"><div class="col-md-5" style"padding-left: 10px;">' + addon_name + '</div><div class="" style="padding-left: 0;"><span class="addonvalue">₹ ' + Math.round(addon_premium) + '</span ></div ></div > ');
                            $($('#divQuitList' + InsID).children('.addon-selected')).append('<span class="BlockSections" title="' + addon_Fullname + '">' + addon_name + ' <span>₹ ' + Math.round(addon_premium) + '</span></span>');
                       
                            //For Mobile
                             $('#divQuitList' + InsID).children('.addon-selectedMobile').append('<div style="display:grid;grid-template-columns:1fr 1fr;margin:8px;text-align:center;"><div  class="ad" title="' + addon_Fullname + '">' + addon_Fullname + '  &nbsp; <span><i class="fa fa-inr"></i>' + Math.round(addon_premium) + '</span></div></div>');
                        }
                        //else {
                        //    $($('#divQuitList' + InsID).children('.UlClass').children('.LiClass').children('.boxLeft').children('.addon-selected')).append('<div><button class="btn btn-danger btn-xs btn-block waves-effect" type="button">' + addon_name + ' <span class="badge">NA</span></button></div>');
                        //}
                    });
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

                 var final_premium = Math.round(net_premium + service_tax - 0);
				 $('.PB1_' + InsID).text('');
				 $('.PB1_' + InsID).text('₹ ' + rupee_format(final_premium))
				//$('#divQuitList' + InsID).children('.quotechild').children('.premium_div').children('.Premium').children('.divname').children('.PremiumBreakup1').children('.PremiumBreakup').text('₹ ' + rupee_format(final_premium))
              
                $('#divQuitList' + InsID).attr('premium', final_premium);
				
                //debugger;
                $('#divQuitList' + value.Insurer.Insurer_ID).attr('applied_addon', count);
                $('#divQuitList' + InsID + ' .PremiumBreakup').children('.PremiumBreakup').attr('netpayablepayablepremium', rupee_format(final_premium));
                $('#divQuitList' + InsID + ' .PremiumBreakup').children('.PremiumBreakup').attr('servicetax', rupee_format(Math.round(service_tax)));
                $('#divQuitList' + InsID + ' .PremiumBreakup').children('.PremiumBreakup').attr('addonpremium', Math.round(addon_amount));
                $('#divQuitList' + InsID + ' .PremiumBreakup').children('.PremiumBreakup').attr('totalpremium', rupee_format(Math.round(net_premium)));
                $('#divQuitList' + InsID + ' .PremiumBreakup').children('.PremiumBreakup').attr('addonname', addon_premium_breakup);

                //For Displaying Message For Discount Not Selected
                var TotalDiscountVal = 0;
                TotalDiscountVal = Math.round(value.Premium_Breakup.own_damage.od_disc_anti_theft) + Math.round(value.Premium_Breakup.own_damage.od_disc_vol_deduct);
                //$('#divQuitList' + value.Insurer.Insurer_ID + ' .PremiumBreakup').attr('totaldiscount', TotalDiscountVal);
                if (TotalDiscountVal == 0) {
                    $('#DisplayDiscount' + value.Insurer.Insurer_ID).html("No Discount Available");
                }

                //For Displaying Message For Cover Not Selected
                 var TotalCover = 0;
                TotalCover = Math.round(($('#divQuitList' + InsID).children('.premium_div').children('.Premium').children('.PremiumBreakup').attr('electricalacessoriespremium')).replace(/,/g, '')) + Math.round(($('#divQuitList' + InsID ).children('.premium_div').children('.Premium').children('.PremiumBreakup').attr('nonelectricalaccessoriespremium').replace(/,/g, '')));
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
                if (PlanName == 'Basic') { BasicCount++;}
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
        //$('.quoteboxparent').html($('.quoteboxmain').pbsort(false, "applied_addon"));
        //set_minmax_premium();
    }
}


function addon_filter() {

	//if(addon_checked.length<=0){swal({text: "Please select atleast one add-on."});
	//}else{
	 $('#QuoteLoader').show();
	 $('#main_div').hide();
	 $(".popup_overlay").slideUp();
    
    var obj = {}, objStandalone = {}, objPackage = {};
    obj["data_type"] = "addon";
    obj["search_reference_number"] = srn;
	obj["udid"] = udid;

    // Addon Standalone
	var addontext=$('.switch-outer').children('.active').text().trim();
	if(addontext=="WITH ADD-ON"){
		
	$.each(quotes.Response, function (index, value) {
		 $.each(value.Addon_List, function (i, v) {
			 //debugger;
			 objStandalone[i] = "yes"
		 });
		
	});
	}
	//debugger;
	
    obj["addon_standalone"] = objStandalone;
    obj["addon_package"] = objPackage;
	obj["secret_key"]= "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW";
	obj["client_key"]="CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9";

    console.log(obj);
    console.log(JSON.stringify(obj));

	var data = {
       request_json: JSON.stringify(obj),
        method_name: "/quote/save_user_data",
        client_id: "2"
    };
    
    $.ajax({
        type: 'POST',
        
		url: GetUrl()+"/quote/save_user_data",
        data: JSON.stringify(obj),
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
		
            console.log('response', response);
 
        },
        error: function (data) {
            console.log(data);
        }
    });
}
	 
	 
	    function GetDataFromSIDCRN(SRN, ClientID)
    {
		var mainUrl = GetUrl()+"/quote/premium_summary";
		var str1 = {
        "search_reference_number": SRN,
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9"
		};
		
        $.ajax({
			type: "POST",
			data: JSON.stringify(str1),
			url: mainUrl,
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

	function Get_Saved_Data() {
		//debugger;
    var mainUrl = GetUrl()+"/quote/premium_list_db";	
    var str1 = {
        "search_reference_number": SRN,		
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9"
    };   
    $.ajax({
        type: "POST",
        data: JSON.stringify(str1),
        url: mainUrl,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function(data) {
        //if (max_calling_times > 0) {
            console.log(data);
			Response_Global = data;
			clientid=data.Summary["Client_Id"];
			udid= data.Summary.Request_Core.udid;
			AgentType=clientid==3?"POSP" : "NonPOSP";
			ss_id=data.Summary.Request_Core.ss_id;
			app_version=data.Summary.Request_Core.app_version
            quotes = data;
			response_handler();
			$('#CRN').text(data.Summary.Request_Core.crn==0?data.Summary.PB_CRN:data.Summary.Request_Core.crn)
			var CreateTime = new Date(data['Summary'].Created_On);
            var CurrentTime = new Date();
            var DateDiff = Date.parse(CurrentTime) - Date.parse(CreateTime);
            console.log(DateDiff);
			StatusCount++;
			
                var is_complete = false;
                if ( DateDiff >= 60000 || data['Summary']['Status'] === "complete") {
                    is_complete = true;
                    $('.loading').hide();
					$('#Appl').show();
					
                }
                if (is_complete === false) {

                    setTimeout(() => {
                        Get_Saved_Data();
						$('.insurer_count').text("");
						$('.insurer_count').text(insurer_count);
                    }, 3000);
                }
        
            
        //}
        //else { //console.log("Quotes no available for selected Criteria");
        //}
		},

        error: function(result) {
            // alert("Error");

        }
    }); 
  
}
function SetValues() {
    $('.SpnCD').each(function () {
        if ($(this).text() == 0) { $(this).parent().empty().remove(); }//$(this).parent().addClass('hidden'); }
    });
}
function Get_Search_Summary() {
	//debugger;
     var str1 = {
        "search_reference_number": SRN,
        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9"
    };
	 var mainUrl = GetUrl()+"/quote/premium_summary";
  
    $.ajax({
        type:"POST",
        data: JSON.stringify(str1),
        url: mainUrl,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (response) {
			console.log('Summary')
			console.log(response);
			 var vehicle = response.Master.Vehicle;
            var request = response.Request;
			var rto = response.Master.Rto;
			
			if(vehicle !="" && vehicle != null){
				$(".makemodelname").text(vehicle.Description + " (" + vehicle.Vehicle_ID + ")");
				$("#FuelNameDetails").text(vehicle.Fuel_Name);     
				$('#VariantDetails').text(vehicle.Variant_Name);
				$('#VehicleDetails').text(vehicle.Fuel_Name+' | '+vehicle.Cubic_Capacity+' CC | '+request.registration_no)
			}
		
			if (request.external_bifuel_type == "cng") {
                $("#FuelNameDetails").text(vehicle.Fuel_Name + "(" + "EXTERNAL FITTED CNG" + ")");
            }
            if (request.external_bifuel_type == "lpg") {
                $("#FuelNameDetails").text(vehicle.Fuel_Name + "(" + "EXTERNAL FITTED LPG" + ")");
            }
			
			  if (request.vehicle_insurance_type == "new") { $("#RegistrationTypeDetails").text("New"); }
            else { $("#RegistrationTypeDetails").text("Renew"); }
            //For TP Plan Implementation
            VehInsSubType = request.vehicle_insurance_subtype;
            $("#VehicleInsuranceSubtype1").val(VehInsSubType);
            console.log("VehInsSubType: ", VehInsSubType);
			
			var Hrefval = "";
            Hrefval = "/tw-main-page.html?SRN=" + response.Summary.Request_Unique_Id + "&ClientID=" + response.Summary.Client_Id; 
            
            $("#EditInfo").attr("href", Hrefval);

		},error: function(result){
			
		}
	});
}

function Quote_share(){
	 window.location.href = "./tw-sharing.html?SRN=" + SRN + "&ClientID=2";
}
$(document).ready(function() {
	setProduct("Bike");
	stringparam();
	//Get_Saved_Data();//Temp
	//Get_Search_Summary(); //Temp
	//get RTO 
	
	Get_Search_Summary();
	Get_Saved_Data();
	
	
	if (VehicleType == null || VehicleType== '') { isPostBack = false; }
        else {
            isPostBack = true;
            if (VehicleType == "NEW") { TwoWheelerTypeNew(); }
            if (VehicleType == "RENEW") {  TwoWheelerTypeRenew(); }
        }
    
});