var SRN = "";
var RTOCode = "";
var htmllist = $('.quoteboxparent').html();

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

function GetUrl() {
    var url = window.location.href;
    var newurl;
    newurl = "http://localhost:3000";
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

$(document).ready(function () {
    siteURL = window.location.href;
    stringparam();
    Get_Search_Summary();
    Get_Saved_Data();
});

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
    // if (getUrlVars()["mobile_no"] == "" || getUrlVars()["mobile_no"] == undefined) {
    //     mobile_no = 0;
    // } else if ((app_version == 'FinPeace') && getUrlVars()["mobile_no"] != "") {
    //     mobile_no = getUrlVars()["mobile_no"];
    //     $('#ContactMobile').val(getUrlVars()["mobile_no"]);
    // }

    // if (app_version == "highway_delite_customer" && ss_id == "117277") {
    //     $(".col-xs-3").css("width", "32%");
    //     $("#menu").hide();
    // } else {
    //     $(".col-xs-3").css("width", "25%");
    //     $("#menu").show();
    // }
    var url = window.location.href;


    // if (header == "yes") {
    //     $('.main-header').show();
    //     $('.main-header').css("top", "0px");
    //     $('.head').css('margin-top', '48px');
    //     $('.wrapper').css('margin-top', '48px');
    // }

    if (Product_id == 1) {
        Product_Name = "Car";
        // $('.FuelType').show();
        // $('.variantType').removeClass('col-xs-6');
        // $('.variantType').addClass('col-xs-12');
        // $('#product_image').attr('src', 'images/car-icon.png');
        // $('.LLPD').removeClass('hidden');
        // $('.PAPD').show();
        // $('.UNPASS').show();
        // $('.carAttribute').show();
        // $('.header-middle').text('CAR INSURANCE');
        $('.title').text('CAR INSURANCE');
        // $('#spnElectricalAccessories').text('Min: 10,000 To Max: 50,000');
        // $('#spnNonElectricalAccessories').text('Min: 10,000 To Max: 50,000');
        // $('.carAttribute').removeClass('hidden');
        // $('.bikeAttribute').addClass('hidden');
        // $('.vehicleFinanced').hide();
        // $('.CV_VehicleClass').hide();
        // $(".own_premises").hide();
    } else if (Product_id == 10) {
        Product_Name = "Bike";
        // $('#bundle').hide();
        // $('#product_image').attr('src', 'images/two-wheeler-icon.png');
        // $('.title,.header-middle').text('BIKE INSURANCE');
        // $('#spnElectricalAccessories').text('Min: 5,000 To Max: 50,000');
        // $('#spnNonElectricalAccessories').text('Min: 5,000 To Max: 50,000');
        // $('.vehicleFinanced').hide();
        // $('.CV_VehicleClass').hide();
        // $(".own_premises").hide();
    } else if (Product_id == 12) {
        // $('#bundle').hide();
        // Product_Name = "CV";
        // $('#product_image').attr('src', 'images/commercial_vehicle.png');
        // $('.title,.header-middle').text('COMMERCIAL VEHICLE INSURANCE');
        // $('.CV_VehicleClass').show();
        // $('.vehicleFinanced').hide();
        // $('.LLPD').removeClass('hidden');
        // $('.PAPD').show();
        // $('.UNPASS').show();
        // $('.bikeAttribute').hide();
        // $("#AMA").show();
        // $('.carAttribute').show();
        // $('.carAttribute').removeClass('hidden');
        // $(".own_premises").show();
        // $('.FuelType').show();
        // $('#spnElectricalAccessories').text('Min: 10,000 To Max: 50,000');
        // $('#spnNonElectricalAccessories').text('Min: 10,000 To Max: 50,000');
        //$('.p_cv_claim').hide().addClass('hidden'); //mg02-02-2022
    }

    // if (editmodify == "modify") {
    //     if (SRN != null && SRN != "" && SRN != undefined && client_id != undefined && client_id != null && client_id != "") {

    //         $('#InputForm').show();
    //         $('.basicDetails').hide();
    //         $('.footerDiv').show();
    //         GetDataFromSIDCRN(SRN, client_id);
    //         $(".warningmsg").hide();

    //     }
    // } else if ((fba_id == "" || fba_id == undefined || fba_id == "0" || app_version == "" || app_version == "0" || app_version == undefined || ss_id == "" || ss_id == undefined || ss_id == "0")) {
    //     $(".maindiv").hide();
    //     $(".warningmsg").show();
    //     $("#error_query_str").text(window.location.href.split('?')[1]);
    // } else if (app_version == 'FinPeace' && (mobile_no == "" || mobile_no == null || mobile_no == "0")) {
    //     $(".maindiv").hide();
    //     $(".warningmsg").show();
    // } else if (app_version == '2.2.4') {
    //     $(".maindiv").hide();
    //     $(".warningmsg").show();
    //     $('#warningerror').text("Page under construction");
    // } else if (SRN != null) {
    //     $('.maininput').hide();
    //     $('.quotelist').show();
    //     $('#Property').removeClass('active in');
    //     $('#Appl').addClass('active in');
    //     Get_Search_Summary();
    //     Get_Saved_Data();
    // } else {

    //     $(".maindiv").show();
    //     $(".warningmsg").hide();
    // }
}

function Get_Search_Summary() {
    SRN = "SRN-JNBB7UIE-NFOI-7EZC-3DLE-7U0GHCAGOSYM_261979";
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
                $('.vehicleFull').text(vehicle.Make_Name + " " + vehicle.Model_Name);
                $('.fuelType').text(vehicle.Fuel_Name);
                $('.variant').text(vehicle.Variant_Name);
                // $("#FuelNameDetails").text(vehicle.Fuel_Name);  // Vehicle Info Pop
                Product_id = 1;
                if (Product_id == 1 || Product_id == 10) {
                    $('.VehicleDetails').text(vehicle.Fuel_Name + ' 2021 ' + vehicle.Cubic_Capacity + ' CC  ');
                }
                if (Product_id == 12) {
                    $('.VehicleDetails').text(vehicle.Fuel_Name + '  ' + reqistration_no);
                }

            }

            if (request.external_bifuel_type == "cng") {
                // $("#FuelNameDetails").text(vehicle.Fuel_Name + "(" + "EXTERNAL FITTED CNG" + ")"); // Vehicle Info Pop
            }
            if (request.external_bifuel_type == "lpg") {
                // $("#FuelNameDetails").text(vehicle.Fuel_Name + "(" + "EXTERNAL FITTED LPG" + ")");  // Vehicle Info Pop
            }

            if (request.vehicle_insurance_type == "new") {
                // $("#RegistrationTypeDetails").text("New");  // Vehicle Info Pop
            } else {
                // $("#RegistrationTypeDetails").text("Renew");  // Vehicle Info Pop
            }
            //For TP Plan Implementation

            // VehInsSubType = request.vehicle_insurance_subtype;
            // $("#VehicleInsuranceSubtype1").val(VehInsSubType);
            // console.log("VehInsSubType: ", VehInsSubType);

            // $('#expected_idv').attr("value", request.vehicle_expected_idv);
            // $('#expected_idv').prev().text(request.vehicle_expected_idv);
            // $('#expected_idv').prev().val(request.vehicle_expected_idv);
            // $('#ExpectedIDV').val(request.vehicle_expected_idv);
            // if (request.vehicle_expected_idv != undefined) {
            //     $('#ExpectedIDVVal').text("(" + request.vehicle_expected_idv + ")");
            // }


            // if (request.is_tppd != undefined) {

            //     if (request.is_tppd == "yes") {
            //         $("#IsTPPD").val("yes").text("Yes");
            //         $("#IsTPPD2").addClass('active');
            //         $("#IsTPPD1").removeClass('active');
            //     } else if (request.is_tppd == "no") {
            //         $("#IsTPPD").val("no").text("No");
            //         $("#IsTPPD1").addClass('active');
            //         $("#IsTPPD2").removeClass('active');
            //     }
            // }
            console.log("-------------Type: " + request.vehicle_insurance_type + " Product ID: " + request.product_id + "-------------");
            if (request.vehicle_insurance_type == "renew") {

                $("#ZeroDepMsg").show();   // addons
            }

            // if (request.od_disc_perc) {
            //     if (request.od_disc_perc == 0) {
            //         $("#ODDiscount").val(0);
            //         $("#ODDiscountPercent").val(0);
            //     } else {
            //         $("#ODDiscount").val(request.od_disc_perc);
            //         $("#ODDiscountPercent").val(request.od_disc_perc);
            //     }
            // } else {
            //     $("#ODDiscount").val(0);
            //     $("#ODDiscountPercent").val(0);
            // }

            //Cover
            // DC condition 
            // if (request.channel == "DC") {
            //     $('.PACOD').show();
            // }



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
            // if (request.first_name != "" && checkTextWithSpace(request.first_name)) {
            //     Name = request.first_name + " ";
            //     if (request.middle_name != "" && checkTextWithSpace(request.middle_name)) {       // define checkTextWithSpace()
            //         Name = Name + request.middle_name + " ";
            //     }
            //     if (request.last_name != "" && checkTextWithSpace(request.last_name)) {
            //         Name = Name + request.last_name;
            //     }
            // } else {
            //     $("#divNameDetails").hide();
            // }
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

            // $("#RegistrationSubTypeDetails").html(ShowVehInsSubType(VehInsSubType));     // define ShowVehInsSubType  

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

            // var PrevInsName = GetPrevIns(request.prev_insurer_id);
            // if (request.prev_insurer_id != "" && request.prev_insurer_id != null) {    // Define GetPrevIns() 
            //     $("#PrevInsurer").html(PrevInsName);
            // } else {
            //     $("#divPrevInsurer").hide();
            // }

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

function Get_Saved_Data() {
    $('.footerDiv').hide();
    $('.loading').show();
    $('.refresh1').show();
    $('#Input1').removeClass('active');
    $('#Quote1').addClass('active');
    var mainUrl = GetUrl() + "/quote/premium_list_db";
    SRN = 'SRN-JHIPJDBU-QYLG-WG5V-XWM5-1MIOAXDCBTLL_261895';
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

function response_handler() {

    insurer_count = 0;
    // $('.quoteboxparent').show();
    // $(".quoteboxparent").empty();

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
//                value = rupee_format(Math.round(value - 0));
                  value = value - 0;
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
    }

    if (quotes.Summary.Request_Core.vehicle_registration_type == "individual") {
        $(".PACOD").show();
        $("#ODPAC").val(1500000);
        $("#OwnerDriverPersonalAccidentCover").val("Yes");
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
        // $('.quoteboxparent').html(divQts);
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
    // $('.quoteboxparent').children(".hidden").remove();
}

function Display_Insurer_Block(insurer) {
    if(document.readyState === 'complete'){
        console.log('DOM Loaded');
    }
    $('.quotePlan').html();
    $('.content').html();
    $('.titleText').html();
    htmllist = $('.quoteboxparent').html();
    var block = htmllist;
    block = block.replace("hidden", "");
    $.each(insurer, function (index1, value1) {
        var regex = new RegExp("___" + index1 + "___", "gi");
        block = block.replace(regex, value1);
    });
    //block = block.replace("___client_id___", clientid);
    $(".quoteboxparent").append(block);
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