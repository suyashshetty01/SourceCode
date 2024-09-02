function GetLTPostOfficeLtg(Pincode) {
    console.log("GetLTPostOfficeLtg(Pincode) Js");
    $.get('/CarInsuranceIndia/GetLTPostOfficeLtg?Pincode=' + Pincode, function (response) {
        var _responce = (response);
        var listItems = "";
        listItems = " <option value=\"0\">Select City</option>";
        for (var i = 0; i < _responce.length; i++)
        { listItems += "<option value='" + _responce[i].Value + "'>" + _responce[i].Text + "</option>"; }
        $("#PostOfficeVORef").html(listItems);
        $("#PostOfficeVORef option:contains(" + $("#HiddenPostOfficeName").val() + ")").attr('selected', 'selected');
        $("#PostOfficeVORef").selectedIndex = "0";
    });
}
function GetLTDistrictState(Pincode) {
    console.log("GetLTDistrictState(Pincode) Js");
    $.get('/CarInsuranceIndia/GetLTDistrictState?Pincode=' + Pincode, function (response) {
        var _responce = (response);
        var listItems = "";
        listItems = _responce.split('&');
        if (listItems.length > 0) {
            $("#DistrictName").val(listItems[0]);
            $("#ProvinceName").val(listItems[2]);
        }
        else {
            $("#DistrictName").val('');
            $("#ProvinceName").val('');
        }
    });
}
var InsurerName;
var spinnerVisible = false;
function showProgress() {
    if (!spinnerVisible) {
        $("div#spinner").fadeIn("fast");
        spinnerVisible = true;
    }
};
function hideProgress() {
    if (spinnerVisible) {
        $("div#spinner").fadeOut("fast");
        spinnerVisible = false;
        //if (ClientID == 0) {
        //    $('#PaymentLink').prop({ 'disabled': false, 'value': 'Online Payment' });
        //}
        $('#PaymentLink').prop({ 'disabled': false, 'value': 'Online Payment' });
    }
};

// Selection Of Radio Button
function SetGenderImages(img) {
    if (img.id == "GenderMale") {
        img.src = '/Images/POSP/male-border.png';
        $("#GenderFemale").attr('src', '/Images/POSP/female.png');
        $("#Gender").val("M");
        $('#GenderMale').addClass('active');
    }
    else {
        img.src = '/Images/POSP/female-border.png';
        $("#GenderMale").attr('src', '/Images/POSP/male.png');
        $("#Gender").val("F");
        $('#GenderFemale').addClass('active');
    }
    $("#divGender").removeClass('Error');
}
function SetOwnerGenderImages(img) {
    if (img.id == 'OwnerGenderMale') {
        img.src = '/Images/POSP/male-border.png';
        $("#OwnerGenderFemale").attr('src', '/Images/POSP/female.png').addClass('active');
        $("#OwnerGender").val("M");
    }
    else {
        img.src = '/Images/POSP/female-border.png';
        $("#OwnerGenderMale").attr('src', '/Images/POSP/male.png').addClass('active');
        $("#OwnerGender").val("F");
    }
    $("#divOwnerGender").removeClass('Error');
}
function opendiv(id) {
    $("#divinstitution").slideDown();
    $("#IsFinanced").val("True");
    Select1(id);
    //$("#"+id).addClass('active');
}
function closediv(id) {
    $("#divinstitution").slideUp();
    $("#IsFinanced").val("False");
    Select2(id);
    //$("#" + id).addClass('active');
}
function Select1(ID) {
    var NextId = $("#" + ID.id).next('.btn').attr('id');
    $("#" + ID.id).addClass('btn-primary active').removeClass('btn-default Error');
    $("#" + NextId).addClass('btn-default').removeClass('btn-primary active Error');

    $("#" + ID.id).find('input:radio').attr('checked', true);
    $("#" + NextId).find('input:radio').attr('checked', false);
}
function Select2(ID) {
    var PrevId = $("#" + ID.id).prev('.btn').attr('id');
    $("#" + ID.id).addClass('btn-primary active').removeClass('btn-default Error');
    $("#" + PrevId).addClass('btn-default').removeClass('btn-primary active Error');

    $("#" + ID.id).find('input:radio').attr('checked', true);
    $("#" + PrevId).find('input:radio').attr('checked', false);
}
function SelectM(ID) {
    var NextId = $("#" + ID.id).next('.btn').attr('id');
    $("#" + ID.id).addClass('btn-primary active').removeClass('btn-default Error');
    $("#" + NextId).addClass('btn-default').removeClass('btn-primary active Error');

    $("#" + ID.id).find('input:radio').attr('checked', true);
    $("#" + NextId).find('input:radio').attr('checked', false);
    // $("#Gender").val("M");
    $('#lblGenderM').children('.used').val("M") //Khushbu Gite 2018/09/21 
}
function SelectF(ID) {
    var PrevId = $("#" + ID.id).prev('.btn').attr('id');
    $("#" + ID.id).addClass('btn-primary active').removeClass('btn-default Error');
    $("#" + PrevId).addClass('btn-default').removeClass('btn-primary active Error');

    $("#" + ID.id).find('input:radio').attr('checked', true);
    $("#" + PrevId).find('input:radio').attr('checked', false);
     //$("#Gender").val("F");
    $('#lblGenderF').children('.used').val("F")//Khushbu Gite 2018/09/21 
}

$("#SameAsCommunication").change(function () {
    if ($('input[id=SameAsCommunication]').is(':checked')) {
        $('#divCurrentAddress').hide();
        IsSameAsRegistered(true);
    }
    else {
        $('#divCurrentAddress').show();
        IsSameAsRegistered(false);
    }
});
$("#IsAPDChkBox").change(function () {
    var APDChecked = $('input[id=IsAPDChkBox]').is(':checked');
    $('#IsAPD').val(APDChecked);
    if (APDChecked == true) {
        $("#TermsAndConditions").show();
        $("#provide-agent").hide();
        $("#PaymentOption").val("APD");
    }
    else {
        $("#TermsAndConditions").hide();
        $("#provide-agent").show();
        $("#PaymentOption").val("");
    }
});

// Set the Communication address if Adress is different then Registered Address

function SetCommunicationAddress(Obj_Communication) {
    
    $('#SameAsCommunication').prop('checked', false);
    $('#divCurrentAddress').show();

    $('#ContactAddress').val(Obj_Communication.communication_address_1);
    $('#Address2').val(Obj_Communication.communication_address_2)
    $('#Address3').val(Obj_Communication.communication_address_3)
    $('#ContactPinCode').val(Obj_Communication.communication_pincode)
    $('#ddlContactCityID').val(Obj_Communication.communication_locality_code)
    //$('#DistrictName').val(Obj_Communication.).removeClass('used');
    $('#ContactCityName').val(Obj_Communication.communication_city)
    $('#ContactCityID').val(Obj_Communication.communication_city_code)
    $('#StateName').val(Obj_Communication.communication_state)
    $("#CommunicationStateId").val(Obj_Communication.communication_state_code);
    $('#CommunicationDistrictCode').val(Obj_Communication.communication_district_code);    
}
$('#AreYouOwnerYes').change(function () {
    Select1(this);
    $('#trOwnerDetails').slideUp();
    $("#HiddenAreYouOwner").val('true');
    $('#OwnerName').val("");
    $('#dvOwnerName').removeClass('Error');
    $('#divOwnerGender').removeClass('Error');
});
$('#AreYouOwnerNo').change(function () {
    Select2(this);
    $('#trOwnerDetails').slideDown();
    //$('#dvOwnerName').addClass('Error');
    $('#OwnerName').focus();
    $("#HiddenAreYouOwner").val('false');
});
$('#IsFinancedYes').change(function () {
    Select1(this);
    $("#divinstitution").css('display', 'block');
});
$('#IsFinancedNo').change(function () {
    Select2(this);
    $("#divinstitution").hide();
});
$('#lblchkregyes').change(function () {
    Select1(this);
    $("#divHaveRegistrationNumber").css('display', 'block');
});
$('#lblchkregno').change(function () {
    Select2(this);
    $("#divHaveRegistrationNumber").hide();
});

//Keypress Events
$('.Number').keyup(function () {
    this.value = this.value.replace(/[^0-9\.]/g, '');
});
//$('#ContactMobile').keypress(function () { return this.value.length < 10 })
//$('.Pincode').keypress(function () { return this.value.length < 6 })
//$('#RegistrationNumberPart1A').keypress(function () { return this.value.length < 3 })
//$('#RegistrationNumberPart2').keypress(function () { return this.value.length < 3 })
//$('#RegistrationNumberPart3').keypress(function () { return this.value.length < 4 })
//$('#lm_agent_mobile').keypress(function () { return this.value.length < 10 })
$('.PAN').keypress(function () { return this.value.length < 10 })

//$('.OnlyText').keypress(function () {
//    var thisval = $(this).val();
//    var pattern = new RegExp("^[a-zA-Z]$");
//    return pattern.test($(this).val());
//})
//$('.OnlyTextWithSpace').keypress(function () {
//    var pattern = new RegExp('^[a-zA-Z ]+$');
//    return pattern.test($(this).val());
//})
//$('.OnlyNumber').keypress(function () {
//    var pattern = new RegExp('^[0-9]*$');
//    return pattern.test($(this).val());
//})
//$('.Address').keypress(function () {
//    var pattern = new RegExp('^[a-zA-Z0-9-,./ ]+$');
//    return pattern.test($(this).val());
//})
//$('.AlphaNumeric').keypress(function () {
//    var pattern = new RegExp('^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$');
//    return pattern.test($(this).val());
//})

// Focusout Events Of Fields

$('.OnlyText').focusout(function () {
    checkText($(this));
});

$('.OnlyTextWithSpace').focusout(function () {
    checkTextWithSpace($(this));
});
$('.OnlyNumber').focusout(function () {
    checkNumeric($(this));
});
$('.AlphaNumeric').focusout(function () {
    checkAlphaNumeric($(this));
});
// Checking Validation For Entered Content 
function checkPincode(input) {
    var pattern = new RegExp('^([1-9]{1}[0-9]{5})$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
};
function checkMobile(input) {
    var pattern = new RegExp('^([7-9]{1}[0-9]{9})$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
};
function checkEmail(input) {
    var dvid = "dv" + $(input).attr('id');
    var re = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (!re.test(input.val())) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
};
function checkText(input) {
    var pattern = new RegExp('^[a-zA-Z]+$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkTextWithSpace(input) {
    var pattern = new RegExp('^[a-zA-Z ]+$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkNumeric(input) {
    var pattern = new RegExp('^[0-9]*$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); }
}
function checkAlphaNumeric(input) {
    var pattern = new RegExp('^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $(dvid).addClass('Error'); return false; }
    else { $(dvid).removeClass('Error'); return true; }
}
function checkifAlphaNumeric(input) {
    var pattern = new RegExp('^[0-9a-zA-Z]*$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test($(input).val()) == false) { $(dvid).addClass('Error'); return false; }
    else { $(dvid).removeClass('Error'); return true; }
}
function checkPolicyNumber(input) {
    var pattern = new RegExp('^[a-zA-Z0-9-/]+$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $(dvid).addClass('Error'); return false; }
    else { $(dvid).removeClass('Error'); return true; }
}
function checkAlphaNumericAndSpace(input) {
    var pattern = new RegExp('^[a-zA-Z0-9 ]+$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $(dvid).addClass('Error'); return false; }
    else { $(dvid).removeClass('Error'); return true; }
}
function checkAddress(input) {
    //if (input.val().length < 2 || input.val().length > 25) {
    //    return false;
    //}
    var pattern = new RegExp('^[a-zA-Z0-9-,./ ]+$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $(dvid).addClass('Error'); return false; }
    else { $(dvid).removeClass('Error'); return true; }
}
function checkCity1(input) {
    var pattern = new RegExp('^[a-zA-Z ,]+$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $(dvid).addClass('Error'); return false; }
    else { $(dvid).removeClass('Error'); return true; }
}
function checkEngineChasis(input) {
    var pattern = new RegExp('[^\w\d]*(([0-9]+.*[A-Za-z]+.*)|[A-Za-z]+.*([0-9]+.*))');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $(dvid).addClass('Error'); return false; }
    else { $(dvid).removeClass('Error'); return true; }
}
function check1Numberand1Chararteratleast(input) {    
    var pattern = new RegExp('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $(dvid).addClass('Error'); return false; }
    else { $(dvid).removeClass('Error'); return true; }
}

function checkInstName(input) {
    var pattern = new RegExp('^[a-zA-Z\-& .,]+$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkComapnyName(input) {
    var pattern = new RegExp('^[a-zA-Z.-/() ]+$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}

function checkLicenceNumber(input) {
    var pattern = new RegExp('^[A-Za-z0-9 -]{16}$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) {
        $('#' + dvid).addClass('Error'); return false;
    } else { $('#' + dvid).removeClass('Error'); return true; }
}
//Sending data to api only once
var data_sent = {
    'TabPersonalInfo': false,
    'TabAddInfo': false,
    'TabVehicleAddInfo': false,
    'TabNomineeInfo': false,
    'PaymentLink': false
}

// Validating And Sliding Sections
function GetInsurerName(id) {
    switch (id) {
        case "1": InsurerName = "Bajaj"; break;
        case "2": InsurerName = "Bharti"; break;
        case "4": InsurerName = "FG"; break;
        case "5": InsurerName = "HDFCErgo"; break;
        case "6": InsurerName = "ICICI"; break;
        case "7": InsurerName = "IFFCO"; break;
        case "9": InsurerName = "Reliance"; break;
        case "10": InsurerName = "Royal"; break;
        case "11": InsurerName = "Tata"; break;
        case "12": InsurerName = "NewIndia"; break;
        case "13": InsurerName = "Oriental"; break;
        case "14": InsurerName = "United"; break;
        case "19": InsurerName = "Universal"; break;
        case "30": InsurerName = "Kotak"; break;
        case "33": InsurerName = "Liberty"; break;
        case "44": InsurerName = "GoDigit"; break;
        case "45": InsurerName = "Acko"; break;
        case "46": InsurerName = "Edelweiss"; break;
    }
    $('#InsurerName').val(InsurerName);
}
function ValidateSection(id) {
    switch (id) {
        case 'TabViewInput': return true; break;
        case 'TabPersonalInfo': return ValidateCD(InsurerName); break;
        case 'TabAddInfo': return ValidateAD(InsurerName); break;
        case 'TabVehicleAddInfo': return ValidateVAD(InsurerName); break;
        case 'TabNomineeInfo': return ValidateND(InsurerName); break;
        case 'TabTermsConditions': return ValidateTC(InsurerName); break;
        default: return true; break;
    }
}
function ExpandSection(HID, CID) {
    var HeaderId = $('#' + HID);
    var ContentId = $('#' + CID);
    $('.Heading1').removeClass('collapsed').attr("aria-expanded", false).find("i.indicator").removeClass('glyphicon-minus').addClass('glyphicon-plus');//Adding Default
    $('.panel-collapse').removeClass('in').attr("style", "height: 0px;").attr("aria-expanded", false);//Adding Default
    HeaderId.removeClass('collapsed').attr("aria-expanded", true).find("i.indicator").removeClass('glyphicon-plus').addClass('glyphicon-minus');
    ContentId.addClass('in').attr("aria-expanded", true).attr("style", "");
}

// Agent Validation
function AgentValidation() {
    $('.Heading1').click(function (e) {
        //to save proposal data
        if (data_sent.hasOwnProperty(this.id)) {
            data_sent[this.id] = true;
            var objAgentValidation = this;
            $.each(data_sent, function (index, value) {
                if (value) {
                    if (index == objAgentValidation.id) {
                        return false;
                    }
                    //data_sent[objAgentValidation.id] = false;
                    update_user_data($("#" + index).attr("href").substring(1));
                    data_sent[index] = false;
                }
            });
        }
        if ($(this).attr('id') == 'TabViewInput' || $(this).attr('id') == 'TabPersonalInfo') {
            $(this).next('.collapse').collapse('show');
        }
        else if (ValidatePersonalInformation()) {
            if ($(this).attr('id') == 'PaymentLink') {
                // employee name compulsary in case of SS agent 
               
                var is_employee = false;
                if ((summary.Quote_Request.posp_sources - 0) > 0) {
                    is_employee = false;
                }
                else {
                    if (summary.Quote_Request.posp_category == 'PBS') {
                        is_employee = true;
                    }
                }

                if (is_employee) {
                    if (window.location.href.split("/")[7] > 0) {
                        $("#dvlmName").removeClass('Error');
                        if ($("#lm_agent_id").val() == "" || $("#lm_agent_id").val() == 0) {
                            $("#dvlmName").addClass('Error');
                            return null;
                        }
                        if ($("#lm_agent_mobile").val() != "0" && $("#lm_agent_mobile").val() != "9999999999" && checkMobile($("#lm_agent_mobile")) == true) { $("#dvlm_agent_mobile").removeClass('Error'); }
                        else { $("#dvlm_agent_mobile").addClass('Error'); return null; }
                    }
                    update_user_data('provide-agent');
                }
                showProgress();
                $('#PaymentLink').attr("disabled", "disabled");
                $("#PaymentLink").prop('value', '   ...   ');
                $('#ProgressStatus').html('');
                $('#ProgressStatus').append("Sending mail to customer ...");
                var Sal = $("#Salutation option:selected").text();
                $("#hdnSalutation").val(Sal);
                setTimeout(function () {
                    //document.forms[0].submit();
                    payment_link_send();
                }, 5000);
                return false;
            }
        }
        else { ExpandSection($('#TabPersonalInfo').attr('id'), $('#collapsePersonalInfo').attr('id')); return false; }
    });
}

// payment_link_send function
function payment_link_send() {
    console.log("payment_link_send");
    $("#SRN").val(summary.Summary.Request_Unique_Id.toUpperCase());
    var data1 = objectifyForm($("form").serializeArray());
    console.log(data1);

    //data1['SRN'] = summary.Summary.Request_Unique_Id.toUpperCase();
    document.forms[0].submit();
    //return false;
    //  $.ajax({
    //  url: '/TwoWheelerInsurance/CustomerPaymentRequest',
    //  type: 'POST',
    //  data: JSON.stringify(data1),
    //  contentType: "application/json;",
    //  dataType: "json",
    //  success: function (response) {
    //  },
    //  error: function (request, status, errorThorwn) {
    //  }
    //  });

    //// Added By Pratik For Direct Node Calling
    ////  return false;
    //var _payLink= "";
    //_payLink = ((parseInt($("#ProductID").val()) == 10) ? "/buynowprivatecar/" : "/buynowtwowheeler/") + ClientID + "/" + ARN;
    //((parseInt(ClientID) == 3) ? (_payLink = _payLink + "/POSP/0") : (_payLink = _payLink + "/NonPOSP/0"));
    //document.forms[0].submit();
    //  var data = {
    //      contact_name : $('#ContactName').val(),
    //      last_name : $('#ContactLastName').val(),
    //      phone_no : $('#ContactMobile').val(),
    //      customer_email : $('#ContactEmail').val(),
    //      agent_name: $('#AgentName').val(),
    //      agent_mobile : $('#AgentMobile').val(),
    //      agent_email : $('#AgentEmail').val(), 
    //      crn : $('#CustomerReferenceID').val(),
    //      product_name : parseInt($("#ProductID").val()) == 1 ? "Car" : "Bike",
    //      insurer_name : summary.PB_Master.Insurer.Insurer_Name,
    //      vehicle_text : $('#TwoWheelerVariant').val(),
    //      final_premium : $("#SelectedQuote_TotalPremium").val(),
    //      payment_link : _payLink,
    //      //registration_no : _registrationNo,
    //      search_reference_number:summary.Summary.Request_Unique_Id_Core,
    //      salutation_text :$("#Salutation option:selected").text(),
    //      insurance_type :$("#TwoWheelerType").val(),
    //      client_id: ClientID,
    //      api_reference_number: summary.Summary.Service_Log_Unique_Id,
    //      CustomerReferenceID: $('#CustomerReferenceID').val(),
    //      //request_json: JSON.stringify(request),
    //  }

    //  var obj_horizon_data = Horizon_Method_Convert("/quote/send_payment_link", data, "POST");
    //  $.ajax({
    //      type: "POST",
    //      data: JSON.stringify(obj_horizon_data['data']),
    //      url: obj_horizon_data['url'],
    //      contentType: "application/json;charset=utf-8",
    //      dataType: "json",
    //      success: function (response) {
    //          console.log(response);
    //          if (ProductID == 1) { window.location.href = "/CarInsuranceIndia/CustomerPaymentRequest"; }
    //          else if (ProductID == 10) { window.location.href = "/TwoWheelerInsurance/CustomerPaymentRequest"; }
    //      },
    //      error: function (request, status, errorThorwn) {
    //          console.log(request);
    //          console.log(status);
    //      }
    //  });
}

function ValidatePersonalInformation() {
    ValidateError = 0;
    $('.valerr').remove();
    var ValidationArray = [];
    if ($("#GSTIN").val() == "" || $("#GSTIN").val() == null) {
        $("#dvGSTIN").removeClass('Error');
    }
    else {
        var gstVal = $("#GSTIN").val().toUpperCase();
        var gstPattern = new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');
        var patternArray = gstVal.match(gstPattern);
        if (patternArray == null) { $("#dvGSTIN").addClass('Error'); ValidateError++; }
        else {
            $("#dvGSTIN").removeClass('Error');
        }
    }
    if (VehicleRegistrationType == "individual") {
        var Salutation = $('#Salutation');
        if (Salutation.val() == '0' || Salutation.val() == '') { Salutation.addClass('Error'); ValidateError++; }
        else { Salutation.removeClass('Error'); }

        if ($('#ContactName').val() == "" || $('#ContactName').val().length < 1 || checkTextWithSpace($('#ContactName')) == false) { $('#dvContactName').addClass('Error'); ValidateError++; }
        else { $('#dvContactName').removeClass('Error'); }

        //if (InsName == "Reliance" && ($('#ContactMiddleName').val().length < 1 || checkText($('#ContactMiddleName')) == false)) {
        //    if ($('#ContactMiddleName').val() == "") { $('#dvContactMiddleName').removeClass('Error'); }
        //    else { $('#dvContactMiddleName').addClass('Error'); ValidateError++; }
        //} else {
        //    if (InsName != "Reliance" && ($('#ContactMiddleName').val().length < 2 || checkText($('#ContactMiddleName')) == false)) {
        //        if ($('#ContactMiddleName').val() == "") { $('#dvContactMiddleName').removeClass('Error'); }
        //        else { $('#dvContactMiddleName').addClass('Error'); ValidateError++; }
        //    }
        //    else { $('#dvContactMiddleName').removeClass('Error'); }
        //}

        if ($('#ContactLastName').val() == "" || $('#ContactLastName').val().length < 1 || checkText($('#ContactLastName')) == false) { $('#dvContactLastName').addClass('Error'); ValidateError++; }
        else { $('#dvContactLastName').removeClass('Error'); }
    }
    if ($('#ContactMobile').val().length == 0 || checkMobile($('#ContactMobile')) == false) { $('#dvContactMobile').addClass('Error'); ValidationArray.push('ContactMobile'); ValidateError++; }
    else { $('#dvContactMobile').removeClass('Error'); }

    if ($('#ContactEmail').val().length == 0 || checkEmail($('#ContactEmail')) == false) { $('#dvContactEmail').addClass('Error'); ValidationArray.push('ContactEmail'); ValidateError++; }
    else { $('#dvContactEmail').removeClass('Error'); }

    if (ValidateError < 1) { remove_errordetails(ValidationArray); $('.indicator').removeClass('glyphs'); $("#FinalSubmit").val("1"); return true; }
    else { populate_errordetails(ValidationArray); return false; }
}

$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
function objectifyForm(formArray) {//serialize data function
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
}
function post(path, params, method) {
    if (method.toString().toLowerCase() == 'get' && jQuery.isEmptyObject(params)) {
        window.location.href = path;
    }
    else {
        method = method || "post"; // Set method to post by default if not specified.

        // The rest of this code assumes you are not using a library.
        // It can be made less wordy if you use one.
        var form = document.createElement("form");
        form.setAttribute("method", method);
        form.setAttribute("action", path);

        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                var hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", key);
                hiddenField.setAttribute("value", params[key]);
                form.appendChild(hiddenField);
            }
        }

        document.body.appendChild(form);
        form.submit();
    }
}

//Customer Validation
function CustomerValidation() {
    $('.Heading1').click(function (e) {
        GetInsurerName($('#SelectedInsurerID').val());
        var IDs = [], ContentIDs = [], i = 0;
        var thisval = $(this).attr('id');
        data_sent[thisval] = false;
        $($('#' + data_sent[thisval]).prev().children()[0]).hide();
        $("#accordion").find('.Heading1').each(function (n, i) { IDs.push(this.id); });
        $("#accordion").find('.panel-collapse').each(function (n, i) { ContentIDs.push(this.id); });
        var thislength = IDs.indexOf(thisval);
        for (var i = 0; i < thislength ; i++) {
            if (ValidateSection(IDs[i]) == true) {
                $('#' + IDs[i]).find("i.indicator").removeClass('glyphs');
            }
            else {
                $('#' + IDs[i]).find("i.indicator").addClass('glyphs');
                ExpandSection(IDs[i], ContentIDs[i]);
                e.preventDefault(); e.stopPropagation();
                return false;
            }
        }

        if ($('#FinalSubmit').val() == "1" && ($(this).attr('id') == 'PaymentLink' || $(this).attr('id') == 'RequestForInspection')) {
            $('#AlertMsg').hide();
            $('#Hidepopup').hide();
            $('#ProgressStatus').html('');
            $('#ProgressStatus').append("Initiating proposal creation ...");
            $('#PaymentLink').prop({ 'disabled': true, 'value': '   ...  ' });

            var data1 = objectifyForm($("form").serializeArray());
            console.log(data1);
            console.log(summary.Quote_Request);
            var request = summary.Quote_Request;
            var last_request = summary.Last_Premium_Request;
            showProgress();
            $(".spinner").show();
            $.each(data1, function (index, value) {
                var eid = document.getElementById(index);
                if (eid != null)
                    if (eid.nodeName == "INPUT")
                        request[field_mapping[index]] = value.toUpperCase();
                    else
                        request[field_mapping[index]] = value;
                else
                    request[field_mapping[index]] = value;
            });

            console.log($("#SelectedQuote_NetPayablePayablePremium").val() + "\n" + $("#SelectedQuote_ServiceTax").val() + "\n" + $("#SelectedQuote_TotalPremium").val())

            request["birth_date"] = change_formate($("#DOBofOwner").val());
            request["nominee_birth_date"] = change_formate($("#NomineeDOB").val());
            request["vehicle_expected_idv"] = summary.Last_Premium_Request.vehicle_expected_idv;
            //request["final_premium"] = $("#premium").val();
            //request["tax"] = $("#SelectedQuote_ServiceTax").val();
            //request["net_premium"] = $("#SelectedQuote_TotalPremium").val();

            request["final_premium"] = $("#SelectedQuote_TotalPremium").val();
            request["tax"] = $("#SelectedQuote_ServiceTax").val();
            request["net_premium"] = net_premium;// $("#SelectedQuote_NetPayablePayablePremium").val();
            
            request["is_mobile"] = jQuery.browser.mobile == true ? "yes" : "no";
            request["is_financed"] = $("#IsFinanced").val() == "True" ? "yes" : "no";
            request["method_type"] = "Proposal";
            request["insurer_id"] = summary.Summary.Insurer_Id;
            request["ss_id"] = $("#SupportsAgentID").val();
            
            request["search_reference_number"] = summary.Summary.Request_Unique_Id;

            request["registration_no"] = ($("#RegistrationNumberPart1").val() + '-' + $("#RegistrationNumberPart1A").val() + '-' + $("#RegistrationNumberPart2").val() + '-' + $("#RegistrationNumberPart3").val()).toUpperCase();
            request["geo_lat"] = lat;
            request["geo_long"] = long;

            // Sending Through .net
            request["execution_async"] = "yes";
            request["api_reference_number"] = summary.Summary.Service_Log_Unique_Id; // (ARN.split("_")[0]).toUpperCase(); // ARN; //
            request["search_reference_number"] = summary.Summary.Request_Unique_Id; //summary.Summary.Request_Unique_Id.toUpperCase();

            // add dropdown_text to proposal request
            $.each(dropdown_text, function (index, value) {
                if (field_mapping.hasOwnProperty(value)) {
                    request[field_mapping[value] + '_text'] = $('#' + value + ' option:selected').text();
                }
            });
            request["vehicle_text"] = $('#TwoWheelerVariant').val();
            request["rto_text"] = last_request.dbmaster_insurer_rto_code + " " + last_request.dbmaster_insurer_rto_city_name;
            request["erp_uid"] = $("#lm_agent_id").val();
            request["erp_qt"] = $("#erp_qt").val();

            //Check If vehicle_expected_idv is "" or not
            var IDV_Val = request["vehicle_expected_idv"];
            if (IDV_Val == "" || IDV_Val == undefined || IDV_Val == NaN) {
                request["vehicle_expected_idv"] = 0;
            }

            //// add addon details Previous Code
            //var addon_checked = $('#collapseViewAddon div').find('input[type=checkbox]:checked');
            //var addon_unchecked = $('#collapseViewAddon div').find("input:checkbox:not(:checked)");
            //if (addon_checked.length > 0) {
            //    $.each(addon_checked, function (i, value) {
            //        request[value.id] = "yes";
            //        request[value.id + '_amt'] = summary.Premium_Response.Addon_List[value.id];
            //        if (last_request.hasOwnProperty(value.id + '_rate')) {
            //            request[value.id + '_rate'] = last_request[value.id + '_rate'];
            //        }
            //    });
            //}
            //if (addon_unchecked.length > 0) {
            //    $.each(addon_unchecked, function (i, value) {
            //        request[value.id] = "no";
            //    });
            //}

            AddOnSelectedList = $('#ShowAddon .Addons').map(function () { return this.id; }).get();
            // AddOnSelectedList = $('#ShowAddon :hidden').map(function () { return this.id; }).get();

            if (AddOnSelectedList.length > 0) {
                $.each(AddOnSelectedList, function (i, value) {
                    request[value] = "yes";
                    request[value + '_amt'] = summary.Premium_Response.Addon_List[value];
                    if (last_request.hasOwnProperty(value+ '_rate')) {
                        request[value + '_rate'] = last_request[value + '_rate'];
                    }
                });
            }

            $.each(request, function (i, v) {
                if (v != null) {
                    request[i] = v.toString().trim();
                }
            });
            console.log('request',request);


            data1["CustomerReferenceID"] = $('#CustomerReferenceID').val();
            data1["TwoWheelerVariantId"] = request["vehicle_id"];
            console.log('data1', data1);
            $.ajax({
                url: '/TwoWheelerInsurance/Proposal_Initiate_Pre',
                type: "POST",
                data: JSON.stringify(data1),
                contentType: "application/json;",
                dataType: "json",
                success: function (response) { },
                error: function (request, status, errorThorwn) { }
            });

            var data = {
                request_json: JSON.stringify(request),
                client_id: ClientID,
                execution_async: "yes",
                api_reference_number: summary.Summary.Service_Log_Unique_Id,
                CustomerReferenceID: $('#CustomerReferenceID').val(),
                search_reference_number: summary.Summary.Request_Unique_Id
            }
            console.log('data', data);
            var obj_horizon_data = Horizon_Method_Convert("/quote/proposal_initiate", data, "POST");
            $.ajax({
                type: "POST",

                url: '/TwoWheelerInsurance/Proposal_Initiate',
                data: JSON.stringify(data),
                
                //data: JSON.stringify(obj_horizon_data['data']),
                //url: obj_horizon_data['url'],
                
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (response) {
                    console.log(response);
                    $('#ProgressStatus').html('');
                    $('#ProgressStatus').append("Checking proposal status ...");
                    var arn = response.Service_Log_Unique_Id;
                    var res = {};
                    console.log('proposal_initate response', response);
                    if (response.hasOwnProperty('Service_Log_Unique_Id') && arn.includes('-')) {
                        var max_count = 150;
                        setTimeout(function () {
                            get_payment_data(arn, max_count);
                        }, 1000);
                    }
                    else {
                        $('.spinner').hide();
                        $('#AlertMsg').show();
                        $('#ProgressStatus').html('');
                        $('#ProgressStatus').append("Technical Issue ! Cannot Initiate Proposal !");
                        $('#Hidepopup').show();
                    }
                },
                error: function (request, status, errorThorwn) {
                    console.log(request);
                    console.log(status);
                    $('.spinner').hide();
                    $('#AlertMsg').show();
                    $('#ProgressStatus').html('');
                    $('#ProgressStatus').append("Technical Issue ! Cannot Proceed Now !");
                    $('#Hidepopup').show();
                }
            });
        }
    });
}

function ChequeValidation() {
    var Error = 0;
    GetInsurerName($('#SelectedInsurerID').val());
    $('#TermsAndConditions').show();
    var IDs = [], ContentIDs = [], i = 0;
    var thisval = "PaymentLink";
    data_sent[thisval] = false;
    $($('#' + data_sent[thisval]).prev().children()[0]).hide();
    $("#accordion").find('.Heading1').each(function (n, i) { IDs.push(this.id); });
    $("#accordion").find('.panel-collapse').each(function (n, i) { ContentIDs.push(this.id); });
    var thislength = IDs.indexOf(thisval);

    for (var i = 0; i < thislength ; i++) {
        if (ValidateSection(IDs[i]) == true) {
            $('#' + IDs[i]).find("i.indicator").removeClass('glyphs');
        }
        else {
            $('#' + IDs[i]).find("i.indicator").addClass('glyphs');
            ExpandSection(IDs[i], ContentIDs[i]);
            Error++;
            return false;
        }
    }

    //if (Error > 0) {
    //    $('#myModalNorm').removeAttr('data-target');
    //}
    //else { $('#myModalNorm').attr('data-target','#myModalNorm'); }

    //if (validateChequeDetails()) {
    //    $('#myModalNorm').modal('hide');
    //}
    //else {
    //    return false;
    //}
    if ($('#FinalSubmit').val() == "1") { $('#myModalNorm').modal('show'); }
    else { $('#myModalNorm').removeAttr('data-target'); }
}

function CODValidation() {
    var Error = 0;
    $('.Heading1').click(function (e) {
        var APDChecked = $('input[id=IsAPDChkBox]').is(':checked');
        if (APDChecked == true) { // Customer
            $('#TermsAndConditions').show();
            var IDs = [], ContentIDs = [], i = 0;
            var thisval = "PaymentLink";
            data_sent[thisval] = false;
            $($('#' + data_sent[thisval]).prev().children()[0]).hide();
            $("#accordion").find('.Heading1').each(function (n, i) { IDs.push(this.id); });
            $("#accordion").find('.panel-collapse').each(function (n, i) { ContentIDs.push(this.id); });
            var thislength = IDs.indexOf(thisval);

            for (var i = 0; i < thislength ; i++) {
                if (ValidateSection(IDs[i]) == true) {
                    $('#' + IDs[i]).find("i.indicator").removeClass('glyphs');
                }
                else {
                    $('#' + IDs[i]).find("i.indicator").addClass('glyphs');
                    ExpandSection(IDs[i], ContentIDs[i]);
                    Error++;
                    return false;
                }
            }

            // For Submitting And Saving Data Without Sending To PG
            if ($('#FinalSubmit').val() == "1" && $(this).attr('id') == 'SubmitAPD') {
                $('#AlertMsg').hide();
                $('#Hidepopup').hide();
                $('#ProgressStatus').html('');
                $('#ProgressStatus').append("Initiating proposal creation ...");
                $('#PaymentLink').prop({ 'disabled': true, 'value': '   ...  ' });

                var data1 = objectifyForm($("form").serializeArray());
                console.log(data1);
                console.log(summary.Quote_Request);
                var request = summary.Quote_Request;
                var last_request = summary.Last_Premium_Request;
                showProgress();
                $(".spinner").show();
                $.each(data1, function (index, value) {
                    var eid = document.getElementById(index);
                    if (eid != null)
                        if (eid.nodeName == "INPUT")
                            request[field_mapping[index]] = value.toUpperCase();
                        else
                            request[field_mapping[index]] = value;
                    else
                        request[field_mapping[index]] = value;
                });
                console.log($("#SelectedQuote_NetPayablePayablePremium").val() + "\n" + $("#SelectedQuote_ServiceTax").val() + "\n" + $("#SelectedQuote_TotalPremium").val())

                request["birth_date"] = change_formate($("#DOBofOwner").val());
                request["nominee_birth_date"] = change_formate($("#NomineeDOB").val());
                request["vehicle_expected_idv"] = summary.Last_Premium_Request.vehicle_expected_idv;
                //request["final_premium"] = $("#premium").val();
                //request["tax"] = $("#SelectedQuote_ServiceTax").val();
                //request["net_premium"] = $("#SelectedQuote_TotalPremium").val();


                request["final_premium"] = $("#SelectedQuote_TotalPremium").val();
                request["tax"] = $("#SelectedQuote_ServiceTax").val();
                request["net_premium"] = $("#SelectedQuote_NetPayablePayablePremium").val();

                request["is_mobile"] = jQuery.browser.mobile == true ? "yes" : "no";
                request["is_financed"] = $("#IsFinanced").val() == "True" ? "yes" : "no";
                request["method_type"] = "Proposal";
                request["insurer_id"] = summary.Summary.Insurer_Id;
                request["ss_id"] = $("#SupportsAgentID").val();

                request["registration_no"] = ($("#RegistrationNumberPart1").val() + '-' + $("#RegistrationNumberPart1A").val() + '-' + $("#RegistrationNumberPart2").val() + '-' + $("#RegistrationNumberPart3").val()).toUpperCase();
                request["geo_lat"] = lat;
                request["geo_long"] = long;

                request["execution_async"] = "yes";
                request["api_reference_number"] = summary.Summary.Service_Log_Unique_Id; // (ARN.split("_")[0]).toUpperCase(); // ARN; //
                request["search_reference_number"] = summary.Summary.Request_Unique_Id; //summary.Summary.Request_Unique_Id.toUpperCase();

                // add dropdown_text to proposal request
                $.each(dropdown_text, function (index, value) {
                    if (field_mapping.hasOwnProperty(value)) {
                        request[field_mapping[value] + '_text'] = $('#' + value + ' option:selected').text();
                    }
                });
                request["vehicle_text"] = $('#TwoWheelerVariant').val();
                request["rto_text"] = last_request.dbmaster_insurer_rto_code + " " + last_request.dbmaster_insurer_rto_city_name;
                request["erp_uid"] = $("#lm_agent_id").val();
                request["erp_qt"] = $("#erp_qt").val();
                request["is_apd"] = APDChecked;
                
                //// add addon details Previous Code
                //var addon_checked = $('#collapseViewAddon div').find('input[type=checkbox]:checked');
                //var addon_unchecked = $('#collapseViewAddon div').find("input:checkbox:not(:checked)");
                //if (addon_checked.length > 0) {
                //    $.each(addon_checked, function (i, value) {
                //        request[value.id] = "yes";
                //        request[value.id + '_amt'] = summary.Premium_Response.Addon_List[value.id];
                //        if (last_request.hasOwnProperty(value.id + '_rate')) {
                //            request[value.id + '_rate'] = last_request[value.id + '_rate'];
                //        }
                //    });
                //}
                //if (addon_unchecked.length > 0) {
                //    $.each(addon_unchecked, function (i, value) {
                //        request[value.id] = "no";
                //    });
                //}

                AddOnSelectedList = $('#ShowAddon .Addons').map(function () { return this.id; }).get();
                // AddOnSelectedList = $('#ShowAddon :hidden').map(function () { return this.id; }).get();

                if (AddOnSelectedList.length > 0) {
                    $.each(AddOnSelectedList, function (i, value) {
                        request[value] = "yes";
                        request[value + '_amt'] = summary.Premium_Response.Addon_List[value];
                        if (last_request.hasOwnProperty(value + '_rate')) {
                            request[value + '_rate'] = last_request[value + '_rate'];
                        }
                    });
                }

                $.each(request, function (i, v) {
                    if (v != null) {
                        request[i] = v.toString().trim();
                    }
                });

                console.log(request);
                showProgress();
                $('#SubmitAPD').attr("disabled", "disabled");
                $("#SubmitAPD").prop('value', '   ...   ');
                $('#ProgressStatus').html('');
                $('#ProgressStatus').append("Sending mail to customer ...");
                var Sal = $("#Salutation option:selected").text();
                $("#hdnSalutation").val(Sal);
                setTimeout(function () {
                    //document.forms[0].submit();
                    payment_link_send();
                }, 5000);
            }
        }
        else { // Agent
            if (data_sent.hasOwnProperty(this.id)) {
                data_sent[this.id] = true;
                var objAgentValidation = this;
                $.each(data_sent, function (index, value) {
                    if (value) {
                        if (index == objAgentValidation.id) {
                            return false;
                        }
                        //data_sent[objAgentValidation.id] = false;
                        update_user_data($("#" + index).attr("href").substring(1));
                        data_sent[index] = false;
                    }
                });
            }
            if ($(this).attr('id') == 'TabViewInput' || $(this).attr('id') == 'TabPersonalInfo') {
                $(this).next('.collapse').collapse('show');
            }
            else if (ValidatePersonalInformation()) {
                if ($(this).attr('id') == 'SubmitAPD') {
                    // employee name compulsary in case of SS agent 

                    var is_employee = false;
                    if ((summary.Quote_Request.posp_sources - 0) > 0) {
                        is_employee = false;
                    }
                    else {
                        if (summary.Quote_Request.posp_category == 'PBS') {
                            is_employee = true;
                        }
                    }

                    if (is_employee) {
                        if (window.location.href.split("/")[7] > 0) {
                            $("#dvlmName").removeClass('Error');
                            if ($("#lm_agent_id").val() == "" || $("#lm_agent_id").val() == 0) {
                                $("#dvlmName").addClass('Error');
                                return null;
                            }
                            if ($("#lm_agent_mobile").val() != "0" && $("#lm_agent_mobile").val() != "9999999999" && checkMobile($("#lm_agent_mobile")) == true) { $("#dvlm_agent_mobile").removeClass('Error'); }
                            else { $("#dvlm_agent_mobile").addClass('Error'); return null; }
                        }
                        update_user_data('provide-agent');
                    }

                    showProgress();
                    $('#SubmitAPD').attr("disabled", "disabled");
                    $("#SubmitAPD").prop('value', '   ...   ');
                    $('#ProgressStatus').html('');
                    $('#ProgressStatus').append("Sending mail to customer ...");
                    var Sal = $("#Salutation option:selected").text();
                    $("#hdnSalutation").val(Sal);
                    setTimeout(function () {
                        //document.forms[0].submit();
                        payment_link_send();
                    }, 5000);
                }
            }
            else { ExpandSection($('#TabPersonalInfo').attr('id'), $('#collapsePersonalInfo').attr('id')); return false; }
        }
    });
}

function ValidateChequeDetails() {
    var ValidateError = 0;
    if ($('#ChequeNumber').val() == "" || checkNumeric($('#ChequeNumber')) == false) { $('#dvChequeNumber').addClass('Error'); ValidateError++; }
    else { $('#dvChequeNumber').removeClass('Error'); }

    if ($('#BankName').val() == "" || checkTextWithSpace($('#BankName')) == false) { $('#dvBankName').addClass('Error'); ValidateError++; }
    else { $('#dvBankName').removeClass('Error'); }

    if ($('#BankCode').val() == "" || checkAlphaNumeric($('#BankCode')) == false) { $('#dvBankCode').addClass('Error'); ValidateError++; }
    else { $('#dvBankCode').removeClass('Error'); }

    if ($('#BankBranch').val() == "" || checkTextWithSpace($('#BankBranch')) == false) { $('#dvBankBranch').addClass('Error'); ValidateError++; }
    else { $('#dvBankBranch').removeClass('Error'); }

    if ($('#ChequeDate').val() == "") { $('#dvChequeDate').addClass('Error'); ValidateError++; }
    else { $('#dvChequeDate').removeClass('Error'); }

    if ($('#Remark').val() != "") {
        if (checkAlphaNumericAndSpace($('#Remark')) == false)
        { $('#dvRemark').addClass('Error'); ValidateError++; }
        else { $('#dvRemark').removeClass('Error'); }
    }
    if (ValidateError < 1) {
        $('#myModalNorm').modal('hide');
        $('#AlertMsg').hide();
        $('#Hidepopup').hide();
        $('#ProgressStatus').html('');
        $('#ProgressStatus').append("Initiating proposal creation ...");

        var data1 = objectifyForm($("form").serializeArray());
        console.log(data1);
        console.log(summary.Quote_Request);
        var request = summary.Quote_Request;
        var last_request = summary.Last_Premium_Request;
        showProgress();
        $(".spinner").show();
        $.each(data1, function (index, value) {
            var eid = document.getElementById(index);
            if (eid != null)
                if (eid.nodeName == "INPUT")
                    request[field_mapping[index]] = value.toUpperCase();
                else
                    request[field_mapping[index]] = value;
            else
                request[field_mapping[index]] = value;
        });

        request["birth_date"] = change_formate($("#DOBofOwner").val());
        request["nominee_birth_date"] = change_formate($("#NomineeDOB").val());
        request["vehicle_expected_idv"] = summary.Last_Premium_Request.vehicle_expected_idv;
        request["final_premium"] = $("#SelectedQuote_TotalPremium").val();
        request["tax"] = $("#SelectedQuote_ServiceTax").val();
        request["net_premium"] = $("#SelectedQuote_NetPayablePayablePremium").val();
        request["is_mobile"] = jQuery.browser.mobile == true ? "yes" : "no";
        request["is_financed"] = $("#IsFinanced").val() == "True" ? "yes" : "no";
        request["method_type"] = "Proposal";
        request["execution_async"] = "yes";
        request["insurer_id"] = summary.Summary.Insurer_Id;
        request["api_reference_number"] = ARN.toUpperCase();
        request["ss_id"] = $("#SupportsAgentID").val();
        request["search_reference_number"] = summary.Summary.Request_Unique_Id.toUpperCase();

        request["registration_no"] = ($("#RegistrationNumberPart1").val() + '-' + $("#RegistrationNumberPart1A").val() + '-' + $("#RegistrationNumberPart2").val() + '-' + $("#RegistrationNumberPart3").val()).toUpperCase();
        request["geo_lat"] = lat;
        request["geo_long"] = long;

        request["is_cheque"] = "yes";
        request["cheque_date"] = change_formate($("#ChequeDate").val());
        request["vehicle_expected_idv"] = request["vehicle_expected_idv"] == "" ? 0 : request["vehicle_expected_idv"]
        // add dropdown_text to proposal request
        $.each(dropdown_text, function (index, value) {
            if (field_mapping.hasOwnProperty(value)) {
                request[field_mapping[value] + '_text'] = $('#' + value + ' option:selected').text();
            }
        });
        request["vehicle_text"] = $('#TwoWheelerVariant').val();
        request["rto_text"] = last_request.dbmaster_insurer_rto_code + " " + last_request.dbmaster_insurer_rto_city_name;
        request["erp_uid"] = $("#lm_agent_id").val();
        request["erp_qt"] = $("#erp_qt").val();

        //Check If vehicle_expected_idv is "" or not
        var IDV_Val = request["vehicle_expected_idv"];
        if (IDV_Val == "" || IDV_Val == undefined || IDV_Val == NaN) {
            request["vehicle_expected_idv"] = 0;
        }

        //// add addon details Previous Code
        //var addon_checked = $('#collapseViewAddon div').find('input[type=checkbox]:checked');
        //var addon_unchecked = $('#collapseViewAddon div').find("input:checkbox:not(:checked)");
        //if (addon_checked.length > 0) {
        //    $.each(addon_checked, function (i, value) {
        //        request[value.id] = "yes";
        //        request[value.id + '_amt'] = summary.Premium_Response.Addon_List[value.id];
        //        if (last_request.hasOwnProperty(value.id + '_rate')) {
        //            request[value.id + '_rate'] = last_request[value.id + '_rate'];
        //        }
        //    });
        //}
        //if (addon_unchecked.length > 0) {
        //    $.each(addon_unchecked, function (i, value) {
        //        request[value.id] = "no";
        //    });
        //}
        AddOnSelectedList = $('#ShowAddon .Addons').map(function () { return this.id; }).get();
        // AddOnSelectedList = $('#ShowAddon :hidden').map(function () { return this.id; }).get();
        if (AddOnSelectedList.length > 0) {
            $.each(AddOnSelectedList, function (i, value) {
                request[value] = "yes";
                request[value + '_amt'] = summary.Premium_Response.Addon_List[value];
                if (last_request.hasOwnProperty(value + '_rate')) {
                    request[value + '_rate'] = last_request[value + '_rate'];
                }
            });
        }

        $.each(request, function (i, v) {
            if (v != null) {
                request[i] = v.toString().trim();
            }
        });

        console.log(request);
        var data = {
            request_json: JSON.stringify(request),
            client_id: ClientID,
            CustomerReferenceID: $('#CustomerReferenceID').val()
        }
        data1["CustomerReferenceID"] = $('#CustomerReferenceID').val();
        data1["TwoWheelerVariantId"] = request["vehicle_id"];

        $.ajax({
            url: '/TwoWheelerInsurance/Proposal_Initiate_Pre',
            type: "POST",
            data: JSON.stringify(data1),
            contentType: "application/json;",
            dataType: "json",
            success: function (response) {
            },
            error: function (request, status, errorThorwn) {
            }
        });

        $.ajax({
            url: '/TwoWheelerInsurance/Proposal_Initiate',
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json;",
            dataType: "json",
            success: function (response) {
                $('#ProgressStatus').html('');
                $('#ProgressStatus').append("Checking proposal status ...");
                var arn = response.Service_Log_Unique_Id;
                var res = {};
                if (response.hasOwnProperty('Service_Log_Unique_Id') && arn.includes('-')) {
                    var max_count = 150;
                    setTimeout(function () {
                        get_payment_data(arn, max_count);
                    }, 1000);
                }
                else {
                    console.log('proposal_initate response', response);
                    $('.spinner').hide();
                    $('#AlertMsg').show();
                    $('#ProgressStatus').html('');
                    $('#ProgressStatus').append("Technical Issue ! Cannot Initiate Proposal !");
                    $('#Hidepopup').show();
                }
            },
            error: function (request, status, errorThorwn) {
                console.log(request);
                console.log(status);
                $('.spinner').hide();
                $('#AlertMsg').show();
                $('#ProgressStatus').html('');
                $('#ProgressStatus').append("Technical Issue ! Cannot Proceed Now !");
                $('#Hidepopup').show();
            }
        });
    }
    else { return false; }
}

function get_payment_data(arn, count) {
    //var obj = {};
    //obj["search_reference_number"] = summary.Summary.Request_Unique_Id;
    //obj["api_reference_number"] = summary.Summary.Service_Log_Unique_Id;
    
    //var SaveDataURL = '/quote/proposal_details';
    //var obj_horizon_data = Horizon_Method_Convert(SaveDataURL, obj, "POST");
    //$.ajax({
    //    type: "POST",
    //    data: obj_horizon_data['data'],
    //    url: obj_horizon_data['url'],
    //    dataType: "json",
    //    success: function (response) {
    //        var response_json = response;
    //        if (response_json.Status === 'complete') {
    //            $('#ProgressStatus').html('');
    //            $('#ProgressStatus').append("Going to payment gateway ...");
    //            if (response_json.Error === null) {
    //                console.log(response_json.Payment);
    //                post(response_json.Payment.pg_url, response_json.Payment.pg_data, response_json.Payment.pg_redirect_mode);
    //            }
    //            else {
    //                $('.spinner').hide();
    //                $('#AlertMsg').show();
    //                $('#ProgressStatus').html('');
    //                $('#ProgressStatus').append("Cannot Proceed Now !<br/><br/>Error:" + response_json.Error.Error_Specific);
    //                $('#Hidepopup').show();
    //            }
    //        }
    //        else if (count > 0) {
    //            setTimeout(function () {
    //                get_payment_data(arn, count--);
    //            }, 2000);
    //        }
    //        else {
    //            $('.spinner').hide();
    //            $('#AlertMsg').show();
    //            $('#ProgressStatus').html('');
    //            $('#ProgressStatus').append("Technical Issue ! Cannot Proceed Now !");
    //            $('#Hidepopup').show();
    //        }
    //    }
    //});
    //return false;

    var srn = summary.Quote_Request.search_reference_number;
    var crn = $('#CustomerReferenceID').val();
    var product_id = summary.Quote_Request.product_id;

    $.get('/TwoWheelerInsurance/Proposal_Details?request_unique_id=' + srn + '&service_log_unique_id=' + arn + '&client_id=' + ClientID + '&customerRefNo=' + crn + '&productId=' + product_id + '', function (res) {
        var response_json = $.parseJSON(res)
        if (response_json.Status === 'complete') {
            //Checking Breakin Case for insurer 5
            var InspId = response_json.Insurer_Transaction_Identifier;
            var VIST = (summary.Quote_Request.vehicle_insurance_subtype).split("CH_");
            if (product_id == "1" && InsurerID == 5 && summary.Quote_Request.is_breakin == "yes" && (VIST[0] != '0')) {
                $('.spinner').hide();
                $('#AlertMsg').show();
                $('#Alerticon').css('width', '100px');
                $('#ProgressStatus').html('');
                $("#Hidepopup, #BackToHome").show();
                if (InspId != null && InspId != '') {
                    $('#ProgressStatus').append("<div style='font-size: 13px;'><strong>CRN : </strong>" + CRN + "<br/>This is breakin case. <br/>Insurer will contact for the inspection with inpection id :" + InspId + " <br/> Once the inspection is done you will get payment link from insurer.<div>");
                    $("#CloseBtn").hide();
                    var Hrefval = "";
                    if (ProductID == 1) { Hrefval = "/car-insurance"; }
                    else if (ProductID == 10) { Hrefval = "/two-wheeler-insurance"; }
                    $("#BreakinOk").show().attr('href', Hrefval);
                }
                else {
                    //$('#ProgressStatus').append("<div style='font-size: 13px;'><strong>CRN : </strong>" + CRN + "<br/>This is breakin case. <br/>Some service issue occured. <br/>Please Try again...<div>");
                    $('#ProgressStatus').append("<div style='font-size: 13px;'><strong>CRN : </strong>" + CRN + "<br/>Error: " + response_json.Error.Error_Specific + "<div>");
                }
                return false;
            }

            $('#ProgressStatus').html('');
            $('#ProgressStatus').append("Going to payment gateway ...");
            if (response_json.Error === null) {
                console.log(response_json.Payment);
                post(response_json.Payment.pg_url, response_json.Payment.pg_data, response_json.Payment.pg_redirect_mode);
            }
            else {
                $('.spinner').hide();
                $('#AlertMsg').show();
                $('#ProgressStatus').html('');
                $('#ProgressStatus').append("Cannot Proceed Now !<br/><br/>Error:" + response_json.Error.Error_Specific);
                $('#Hidepopup').show();
            }
        }
        else if (count > 0) {
            setTimeout(function () {
                get_payment_data(arn, count--);
            }, 2000);
        }
        else {
            $('.spinner').hide();
            $('#AlertMsg').show();
            $('#ProgressStatus').html('');
            $('#ProgressStatus').append("Technical Issue ! Cannot Proceed Now !");
            $('#Hidepopup').show();
        }
    });
}

function ValidateCD(InsName) {
    
    ValidateError = 0;
    $('.valerr').remove();
    var ValidationArray = [];
    var ValidationSalutation = [];

    if ((VehicleRegistrationType == "individual") && ($("#GSTIN").val() == "" || $("#GSTIN").val() == null)) { $("#dvGSTIN").removeClass('Error'); }
    else {
        var gstVal = $("#GSTIN").val().toUpperCase();
        var gstPattern = new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');
        var patternArray = gstVal.match(gstPattern);
        if (patternArray == null) { $("#dvGSTIN").addClass('Error'); ValidationArray.push('GSTIN'); ValidateError++; }
        else { $("#dvGSTIN").removeClass('Error'); }
    }

    if (VehicleRegistrationType == "corporate") {
        if ($('#CompanyName').val() == "" || checkComapnyName($('#CompanyName')) == false) { $('#dvCompanyName').addClass('Error'); ValidationArray.push('CompanyName'); ValidateError++; }
        else { $('#dvCompanyName').removeClass('Error'); }
    }

    if ((VehicleRegistrationType == "corporate" && InsName == "Liberty") || VehicleRegistrationType == "individual") {
        var $Salutation = $('#Salutation');
        if ($Salutation.val() == 'TITLE' || $Salutation.val() == "0") { $Salutation.addClass('Error'); ValidationArray.push('Salutation'); ValidateError++; }
        else { $Salutation.removeClass('Error'); }

        if (InsName != "Bharti") {
            if ($('#ContactName').val() == "" || $('#ContactName').val().length < 1 || checkTextWithSpace($('#ContactName')) == false) { $('#dvContactName').addClass('Error'); ValidationArray.push('ContactName'); ValidateError++; }
            else { $('#dvContactName').removeClass('Error'); }
        }
        else {
            if ($('#ContactName').val() == "" || $('#ContactName').val().length < 2 || checkTextWithSpace($('#ContactName')) == false) { $('#dvContactName').addClass('Error'); ValidationArray.push('ContactName'); ValidateError++; }
            else { $('#dvContactName').removeClass('Error'); }
        }

        if (InsName == "Reliance" && ($('#ContactMiddleName').val().length < 1 || checkText($('#ContactMiddleName')) == false)) {
            if ($('#ContactMiddleName').val() == "") { $('#dvContactMiddleName').removeClass('Error'); }
            else { $('#dvContactMiddleName').addClass('Error'); ValidationArray.push('dvContactMiddleName'); ValidateError++; }
        } else {
            if (InsName != "Reliance" && ($('#ContactMiddleName').val().length < 2 || checkText($('#ContactMiddleName')) == false)) {
                if ($('#ContactMiddleName').val() == "") { $('#dvContactMiddleName').removeClass('Error'); }
                else { $('#dvContactMiddleName').addClass('Error'); ValidationArray.push('dvContactMiddleName'); ValidateError++; }
            }
            else { $('#dvContactMiddleName').removeClass('Error'); }
        }
        if (InsName != "Bharti") {
            if ($('#ContactLastName').val() == "" || $('#ContactLastName').val().length < 1 || checkText($('#ContactLastName')) == false) { $('#dvContactLastName').addClass('Error'); ValidationArray.push('ContactLastName'); ValidateError++; }
            else { $('#dvContactLastName').removeClass('Error'); }
        }
        else {
            if ($('#ContactLastName').val() == "" || $('#ContactLastName').val().length < 2 || checkText($('#ContactLastName')) == false) { $('#dvContactLastName').addClass('Error'); ValidationArray.push('ContactLastName'); ValidateError++; }
            else { $('#dvContactLastName').removeClass('Error'); }
        }

        //if ($('#GenderMale').attr('src') == '/Images/POSP/male-border.png') {
        //    $("#divGender").removeClass('Error');
        //    $("#divGenderMale").addClass('active');
        //    $('#Gender').val('M');
        //}
        //else if ($('#GenderFemale').attr('src') == '/Images/POSP/female-border.png') {
        //    $("#divGender").removeClass('Error');
        //    $("#divGenderFemale").addClass('active');
        //    $('#Gender').val('F');
        //}
        //else {
        //    $("#divGender").addClass('Error');
        //    $('#Gender').val('');
        //    ValidateError++;
        //}
        //Khushbu Gite 2018/09/20 Validation for Gender and Salutation
        //Start
        var displayGenderBlock = $('.divGender').css('display');
        var GenderVal = $("input[id='Gender']:checked").val();
        var SalutationVal = $('#Salutation').val();
        var MaritalStatus = $('#MaritalStatus').val();
        if (SalutationVal.toUpperCase() == "MR") {
                
                if (displayGenderBlock != "none") {
                    if (GenderVal == "F") {
                        {
                            $('#Salutation').addClass('Error');
                            ValidationArray.push('Salutation');
                            ValidationSalutation.push('GenderNotMatch');
                            ValidateError++;
                        }
                    } else { $('#Salutation').removeClass('Error'); }
                }
            } else if (SalutationVal.toUpperCase() == "MRS") {
                if (displayGenderBlock != "none") {
                    if (GenderVal == "M") {
                        {
                            $('#Salutation').addClass('Error');
                            ValidationArray.push('Salutation');
                            ValidationSalutation.push('GenderNotMatch');
                            ValidateError++;
                        }
                    } else { $('#Salutation').removeClass('Error'); }
                }
                if (MaritalStatus == "U" || MaritalStatus == "S") {
                    {
                        $('#MaritalStatus').addClass('Error');
                        ValidationSalutation.push('MaritalStatus');
                        ValidateError++;
                    }
                }
            }
            else if (SalutationVal.toUpperCase() == "MS") {
                if (displayGenderBlock != "none") {
                    if (GenderVal == "M") {
                        {
                            $('#Salutation').addClass('Error');
                            ValidationArray.push('Salutation');
                            ValidationSalutation.push('GenderNotMatch');
                            ValidateError++;
                        }
                    } else { $('#Salutation').removeClass('Error'); }
                }
                if (MaritalStatus == "M") {
                    {
                        $('#MaritalStatus').addClass('Error');
                        ValidationSalutation.push('MaritalStatus');
                        ValidateError++;
                    }
                }
            }
      
        //End
        if ($('#divSingle').is(':visible') == true) {
            if (document.getElementById('MaritalStatus') != null) {
                if ($('input[name=MaritalStatus]:checked').val() == 'M') {
                    $("#divMarried").removeClass('Error');
                    $("#divMarried").addClass('active');
                    $("#MaritalStatus").val("M");
                }
                else if ($('input[name=MaritalStatus]:checked').val() == 'S') {
                    $("#divSingle").removeClass('Error');
                    $("#divSingle").addClass('active');
                    $("#MaritalStatus").val("S");
                }
                else {
                    $("#divSingle").addClass('Error');
                    $("#divMarried").addClass('Error');
                    ValidateError++;
                }
            }
        }

        if ($('#MaritalStatus').val() == null || $('#MaritalStatus').val() == "0" || $('#MaritalStatus').val() == "") {
            if (!(InsName == 'NewIndia' || InsName == 'Liberty' || InsName == 'Universal')) { $('#MaritalStatus').addClass('Error'); ValidationArray.push('MaritalStatus'); ValidateError++; }
        }
        else { $('#MaritalStatus').removeClass('Error'); }

        if ($('#DOBofOwner').val() == "") { $('#dvDOBofOwner').addClass('Error'); ValidationArray.push('DOBofOwner'); ValidateError++; }
        else { $('#dvDOBofOwner').removeClass('Error'); }

        if ($('#ContactOccupationId').is(':visible')) {
            if ($('#ContactOccupationId').val() == null || $('#ContactOccupationId').val() == "0" || $('#ContactOccupationId').val() == "")
            { $('#ContactOccupationId').addClass('Error'); ValidationArray.push('ContactOccupationId'); ValidateError++; }
            else { $('#ContactOccupationId').removeClass('Error'); }
        }
        if ($('#SelectedQuote_NetPayablePayablePremium').val() - 0 >= 50000) {
            var pan = $("#PANNo").val().toString().toUpperCase();
            var pattern = /[a-zA-Z]{3}[PCHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}$/;
            if (pan.match(pattern) != null) {
                $("#dvPANNo").removeClass('Error');
            }
            else {
                $("#dvPANNo").addClass('Error'); ValidationArray.push('SelectedQuote_NetPayablePayablePremium'); ValidateError++;
            }
        }
        else if ($("#PANNo").val() != "") {
            var pan = $("#PANNo").val().toString().toUpperCase();
            var pattern = /[a-zA-Z]{3}[PCHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}$/;
            if (pan.match(pattern) != null) {
                $("#dvPANNo").removeClass('Error');
            }
            else {
                $("#dvPANNo").addClass('Error'); ValidationArray.push('PANNo'); ValidateError++;
            }
        }
        if ($("#AadharNo").val() == "") { // || $("#AadharNo").val() == null || $("#AadharNo").val().length < 12) {
            //$("#dvAadharNo").addClass('Error'); ValidationArray.push('AadharNo'); ValidateError++;
            $("#dvAadharNo").removeClass('Error');
        }
        else {
            var aadhar = $("#AadharNo").val();
            var pattern = /\d{12}/;
            if (aadhar.match(pattern) != null) {
                $("#dvAadharNo").removeClass('Error');
            }
            else {
                $("#dvAadharNo").addClass('Error'); ValidateError++;
            }
        }
    }
    if ($('#ContactMobile').val().length == 0 || checkMobile($('#ContactMobile')) == false) { $('#dvContactMobile').addClass('Error'); ValidationArray.push('ContactMobile'); ValidateError++; }
    else { $('#dvContactMobile').removeClass('Error'); }

    if ($('#ContactEmail').val().length == 0 || checkEmail($('#ContactEmail')) == false) { $('#dvContactEmail').addClass('Error'); ValidationArray.push('ContactEmail'); ValidateError++; }
    else { $('#dvContactEmail').removeClass('Error'); }

    //if ($('#Licence').val().length == 0 || checkLicenceNumber($('#Licence')) == false) { $('#dvLicence').addClass('Error'); ValidationArray.push('Licence'); ValidateError++; }
    //else { $('#dvLicence').removeClass('Error'); }

    if (VehicleRegistrationType == "corporate" && corporate_proposal_flag == "false" && ValidateError == 0) {
        if (data_sent['TabPersonalInfo'] == false) {
            data_sent['TabPersonalInfo'] = true;
            update_user_data("collapsePersonalInfo");
        }
        return true;
    }

    if (ValidateError < 1) {
        if (data_sent['TabPersonalInfo'] == false) {
            data_sent['TabPersonalInfo'] = true;
            update_user_data("collapsePersonalInfo");
        }
        return true;
    }
    else {
        data_sent['TabPersonalInfo'] = false;
        populate_errordetails(ValidationArray);
        Salution_Error(ValidationSalutation);
        $($('#collapsePersonalInfo').prev().children()[0]).hide();
        return false;
    }
}
function ValidateAD(InsName) {
    ValidateError = 0;

    $('.valerr').remove();
    var ValidationArray = [];
    //RegisteredAddress
    if ($('#RegisteredAddress').val() == "" || checkAddress($('#RegisteredAddress')) == false) {
        $('#dvRegisteredAddress').addClass('Error'); ValidationArray.push('RegisteredAddress'); ValidateError++;
    }
    else if (((InsName == "GoDigit") && ($("#RegisteredAddress").val().length > 10)) || ($("#RegisteredAddress").val().length > 25))
    {
        $('#dvRegisteredAddress').addClass('Error'); ValidationArray.push('RegisteredAddress'); ValidateError++;
    }
    else { $('#dvRegisteredAddress').removeClass('Error'); }

    //RegisteredAddress2
    if ($('#RegisteredAddress2').val() == "" || checkAddress($('#RegisteredAddress2')) == false) { $('#dvRegisteredAddress2').addClass('Error'); ValidationArray.push('RegisteredAddress2'); ValidateError++; }
    else { $('#dvRegisteredAddress2').removeClass('Error'); }
    
    //RegisteredAddress3
    if ($('#RegisteredAddress3').val() == "" || checkAddress($('#RegisteredAddress3')) == false) { $('#dvRegisteredAddress3').addClass('Error'); ValidationArray.push('RegisteredAddress3'); ValidateError++; }
    else { $('#dvRegisteredAddress3').removeClass('Error'); }

    for (var i = 2; i <= 3; i++) {
        if ($('#RegisteredAddress' + i).val() == "" || checkAddress($('#RegisteredAddress' + i)) == false) {
            $('#dvRegisteredAddress' + i).addClass('Error'); ValidationArray.push('RegisteredAddress' + i); ValidateError++;
        }
        else if (((InsName == "GoDigit") && ($("#RegisteredAddress" + i).val().length > 70)) || (!(InsName == "GoDigit") && ($("#RegisteredAddress" + i).val().length > 25))) {
            $('#dvRegisteredAddress' + i).addClass('Error'); ValidationArray.push('RegisteredAddress' + i); ValidateError++;
        }
        else { $('#dvRegisteredAddress' + i).removeClass('Error'); }
    }
    
    if ($('#RegisteredPinCode').val().length == 0 || $('#RegisteredPinCode').val() < 110000 || checkPincode($('#RegisteredPinCode')) == false) { $('#dvRegisteredPinCode').addClass('Error'); ValidationArray.push('RegisteredPinCode'); ValidateError++; }
    else { $('#dvRegisteredPinCode').removeClass('Error'); }
    
    if ($('#RegisteredCityName').val() == "" || $('#RegisteredCityName').val() == "NO SUCH CITY" || $('#RegisteredCityName').val() == "0" || $('#ContactCityID') == "0" || $('#RegisteredCityName').val() == null)
    { $('#dvRegisteredCityName').addClass('Error'); ValidationArray.push('RegisteredCityName'); ValidateError++; $('#RegisteredCityName').val(''); $('#RegisteredCityName').removeClass('used') }
    else { $('#dvRegisteredCityName').removeClass('Error'); }

    if ($('#RegisteredStateName').val() == "" || $('#RegisteredStateName').val() == " ") { $('#dvRegisteredStateName').addClass('Error'); ValidationArray.push('RegisteredStateName'); ValidateError++; $('#RegisteredStateName').val(''); $('#RegisteredStateName').removeClass('used'); }
    else { $('#dvRegisteredStateName').removeClass('Error'); }

    //Dropdown 
    if (InsName != 'Tata' && InsName != 'NewIndia' && InsName != 'Royal' && InsName != 'United' && InsName != 'ICICI' && InsName != 'Oriental' && InsName != 'Edelweiss') {
        if ($('#ddlRegisteredCityId').val() == 0 || $('#ddlRegisteredCityId').val() == null) { $('#ddlRegisteredCityId').addClass('Error'); ValidationArray.push('ddlRegisteredCityId'); ValidateError++; }
        else { $('#ddlRegisteredCityId').removeClass('Error'); }
    }

    //if ($('#RegistereDistrictName').val() == "") { $('#dvRegistereDistrictName').addClass('Error'); ValidateError++; }
    //else { $('#dvRegistereDistrictName').removeClass('Error'); }
    
    if (!$('input[id=SameAsCommunication]').is(':checked')) {
        //if ($('#ContactAddress').val() == "" || checkAddress($('#ContactAddress')) == false) { $('#dvContactAddress').addClass('Error'); ValidationArray.push('ContactAddress'); ValidateError++; }
        //else { $('#dvContactAddress').removeClass('Error'); }

        ////    if (InsName == 'Bharti' || InsName == 'HDFCErgo') {
        //if ($('#Address2').val() == "" || checkAddress($('#Address2')) == false) { $('#dvAddress2').addClass('Error'); ValidationArray.push('Address2'); ValidateError++; }
        //else { $('#dvAddress2').removeClass('Error'); }
        ////    }

        ////Address3
        //if ($('#Address3').val() == "" || checkAddress($('#Address3')) == false) { $('#dvAddress3').addClass('Error'); ValidationArray.push('Address3'); ValidateError++; }
        //else { $('#dvAddress3').removeClass('Error'); }

        //ContactAddress
        if ($('#ContactAddress').val() == "" || checkAddress($('#ContactAddress')) == false) {
            $('#dvContactAddress').addClass('Error'); ValidationArray.push('ContactAddress'); ValidateError++;
        }
        else if (((InsName == "GoDigit") && ($("#ContactAddress").val().length > 10)) || ($("#ContactAddress").val().length > 25)) {
            $('#dvContactAddress').addClass('Error'); ValidationArray.push('ContactAddress'); ValidateError++;
        }
        else { $('#dvContactAddress').removeClass('Error'); }

        //Address2
        if ($('#Address2').val() == "" || checkAddress($('#Address2')) == false) { $('#dvAddress2').addClass('Error'); ValidationArray.push('Address2'); ValidateError++; }
        else { $('#dvAddress2').removeClass('Error'); }

        //Address3
        if ($('#Address3').val() == "" || checkAddress($('#Address3')) == false) { $('#dvAddress3').addClass('Error'); ValidationArray.push('Address3'); ValidateError++; }
        else { $('#dvAddress3').removeClass('Error'); }

        for (var i = 2; i <= 3; i++) {
            if ($('#Address' + i).val() == "" || checkAddress($('#Address' + i)) == false) {
                $('#dvAddress' + i).addClass('Error'); ValidationArray.push('Address' + i); ValidateError++;
            }
            else if (((InsName == "GoDigit") && ($("#Address" + i).val().length > 10)) || ($("#Address" + i).val().length > 25)) {
                $('#dvAddress' + i).addClass('Error'); ValidationArray.push('Address' + i); ValidateError++;
            }
            else { $('#dvAddress' + i).removeClass('Error'); }
        }

        if ($('#ContactPinCode').val().length == 0 || $('#ContactPinCode').val() < 110000 || checkPincode($('#ContactPinCode')) == false) { $('#dvContactPinCode').addClass('Error'); ValidationArray.push('ContactPinCode'); ValidateError++; }
        else { $('#dvContactPinCode').removeClass('Error'); }

        if ($('#ContactCityName').val() == "" || $('#ContactCityName').val() == "0" || $('#ContactCityID') == "0" || $('#ContactCityName').val() == null)
        { $('#dvContactCityName').addClass('Error'); ValidationArray.push('ContactCityName'); ValidateError++; }
        else { $('#dvContactCityName').removeClass('Error'); }

        if ($('#StateName').val() == "") { $('#dvStateName').addClass('Error'); ValidationArray.push('StateName'); ValidateError++; }
        else { $('#dvStateName').removeClass('Error'); }
        
        //Dropdown
        //    if ($('#ddlContactCityID').is(':visible') == true) {
        if (InsName != 'Tata' && InsName != 'NewIndia' && InsName != 'Royal' && InsName != 'Oriental') {
            if ($('#ddlContactCityID').val() == 0 || $('#ddlContactCityID').val() == null) { $('#ddlContactCityID').addClass('Error'); ValidationArray.push('ddlContactCityID'); ValidateError++; }
            else { $('#ddlContactCityID').removeClass('Error'); }
        }
        //    }

        //if ($('#DistrictName').val() == "") { $('#dvDistrictName').addClass('Error'); ValidationArray.push('DistrictName'); ValidateError++; }
        //else { $('#dvDistrictName').removeClass('Error'); }
    }
    else {
        IsSameAsRegistered(true);
    }

    if (ValidateError < 1) {
        
        if (data_sent['TabAddInfo'] == false) {
            data_sent['TabAddInfo'] = true;
            update_user_data("collapseAddInfo");
        }
        return true;
    }
    else {
        data_sent['TabAddInfo'] = false;
        populate_errordetails(ValidationArray);
        $($('#collapseAddInfo').prev().children()[0]).hide();
        return false;
    }
}
function ValidateVAD(InsName) {
    ValidateError = 0;
    $('.valerr').remove();
    var ValidationArray = [];

    if ($('#AreYouOwnerNo').hasClass('btn-primary')) {
        var data = $('#OwnerName').val();
        var arr = data.split(' ');
        if ($('#OwnerName').val == "" || checkTextWithSpace($('#OwnerName')) == false || arr.length < 2 || arr[arr.length - 1] == "") { $('#dvOwnerName').addClass('Error'); ValidateError++; }
        else { $('#dvOwnerName').removeClass('Error'); }

        if ($('#OwnerGenderMale').hasClass('active') || $('#OwnerGenderFemale').hasClass('active')) { $('#divOwnerGender').removeClass('Error'); }
        else { $('#divOwnerGender').addClass('Error'); ValidateError++; }
    }

    $EngineNumber = $('#EngineNumber');
    $ChasisNumber = $('#ChasisNumber');

    var pattern = new RegExp('^[a-zA-Z0-9]*$'); 
    if ($EngineNumber.val() == "" || $EngineNumber.val().length < 3 || $EngineNumber.val().length > 20 || pattern.test($EngineNumber.val())== false || checkText($('#EngineNumber')) == true) 

    { $('#dvEngineNumber').addClass('Error'); ValidationArray.push('EngineNumber'); ValidateError++; }
    else { $('#dvEngineNumber').removeClass('Error'); }


    if ($ChasisNumber.val() == "" || $ChasisNumber.val().length < 3 || $ChasisNumber.val().length > 20 || pattern.test($ChasisNumber.val()) == false || checkText($('#ChasisNumber')) == true)

    { $('#dvChasisNumber').addClass('Error'); ValidationArray.push('ChasisNumber'); ValidateError++; }
    else { $('#dvChasisNumber').removeClass('Error'); }

    //Is Financed Fields 
    if ($('#IsFinanced').val() == "True") {
        if ($('#InstitutionName').val() == "" || checkInstName($('#InstitutionName')) == false || $("#FinancierCode").val() == "") { $('#dvInstitutionName').addClass('Error'); ValidationArray.push('InstitutionName'); ValidateError++; }
        else { $('#dvInstitutionName').removeClass('Error'); }

        //if ($('#InstitutionCity').val() == "" || checkCity1($('#InstitutionCity')) == false) { $('#dvInstitutionCity').addClass('Error'); ValidateError++; }
        //else { $('#dvInstitutionCity').removeClass('Error'); }

        if ($('#FinancerAgreementType').val() == null || $('#FinancerAgreementType').val() == "0" || $('#FinancerAgreementType').val() == "")
        { $('#FinancerAgreementType').addClass('Error'); ValidationArray.push('FinancerAgreementType'); ValidateError++; }
        else { $('#FinancerAgreementType').removeClass('Error'); }
    }
    else {
        $('#dvInstitutionName').removeClass('Error'); $('#dvInstitutionCity').removeClass('Error');
        $('#InstitutionName').val(""); $('#FinancerAgreementType').val("0");
    }

    if ($('#TwoWheelerType').val() == "RENEW") {
        if ($('#RegistrationNumberPart1').val() == "" || checkText($('#RegistrationNumberPart1')) == false || $('#RegistrationNumberPart1').val().length < 2) { $('#dvRegistrationNumberPart1').addClass('Error'); ValidateError++; }
        else { $('#dvRegistrationNumberPart1').removeClass('Error'); }

        if (($('#RegistrationNumberPart2').val()).toUpperCase() == 'ZZ' && $('#RegistrationNumberPart3').val() == '9999') {
            $('#dvRegistrationNumberPart2').addClass('Error'); ValidationArray.push('RegistrationNumberPart2');
            $('#dvRegistrationNumberPart3').addClass('Error'); ValidationArray.push('RegistrationNumberPart3');
            ValidateError++;
        }
        else {
            $('#dvRegistrationNumberPart2').removeClass('Error');
            $('#dvRegistrationNumberPart3').removeClass('Error');
        }

        if ($('#RegistrationNumberPart1A').val() == "" || (checkifAlphaNumeric($('#RegistrationNumberPart1A')) == false) || checkText($('#RegistrationNumberPart1A')) == true) {
            $('#dvRegistrationNumberPart1A').addClass('Error'); ValidationArray.push('RegistrationNumberPart1A'); ValidateError++;
        }
        else {
            var Numpattern = new RegExp('^[0-9]+$');
            if (Numpattern.test($('#RegistrationNumberPart1A').val()) == true) { // Numeric 
                if ($('#RegistrationNumberPart1A').val().length < 2 && $('#RegistrationNumberPart1').val() != "DL") {
                    $('#dvRegistrationNumberPart1A').addClass('Error'); ValidationArray.push('RegistrationNumberPart1A'); ValidateError++;
                }
                else { $('#dvRegistrationNumberPart1A').removeClass('Error'); }
            }
            else { // Alphanumeric               
                //if ($('#RegistrationNumberPart1').val() == "DL" && InsName == "Reliance") {
                //    $('#dvRegistrationNumberPart1A').addClass('Error'); ValidationArray.push('RegistrationNumberPart1A'); ValidateError++;
                //}
                //else { $('#dvRegistrationNumberPart1A').removeClass('Error'); }

                if ($('#RegistrationNumberPart1').val() == "DL") {
                    if ((InsName == "Reliance" || InsName == "Acko") && $('#RegistrationNumberPart2').val().length > 1) {
                        $('#dvRegistrationNumberPart1A').removeClass('Error'); $('#dvRegistrationNumberPart2').removeClass('Error');
                    }
                    else {
                        $('#dvRegistrationNumberPart1A').addClass('Error'); ValidationArray.push('RegistrationNumberPart1A');
                        $('#dvRegistrationNumberPart2').addClass('Error'); ValidationArray.push('RegistrationNumberPart2');
                        ValidateError++;
                    }
                }
                else {
                    if ($('#RegistrationNumberPart2').val().length > 2) {
                        $('#dvRegistrationNumberPart1A').addClass('Error'); ValidationArray.push('RegistrationNumberPart1A');
                        $('#dvRegistrationNumberPart2').addClass('Error'); ValidationArray.push('RegistrationNumberPart2');
                        ValidateError++;
                    }
                    else {
                        $('#dvRegistrationNumberPart1A').removeClass('Error');
                        $('#dvRegistrationNumberPart2').removeClass('Error');
                    }
                }
            }

        }


        if ($('#RegistrationNumberPart2').val() == "" || pattern.test($('#RegistrationNumberPart2').val()) == false) {
            $('#dvRegistrationNumberPart2').addClass('Error'); ValidationArray.push('RegistrationNumberPart2'); ValidateError++;
        }
        else { $('#dvRegistrationNumberPart2').removeClass('Error'); }
        //else {
        //    var reg1A = $('#RegistrationNumberPart1A').val().replace(/^0+/, '');
        //    reg1A = reg1A.toString().toUpperCase();
        //    var reg2 = $('#RegistrationNumberPart2').val().toString().toUpperCase();
        //    if (checkText($('#RegistrationNumberPart2')) == false || $('#RegistrationNumberPart2').val().length < 1) {
        //        $('#dvRegistrationNumberPart2').addClass('Error'); ValidationArray.push('RegistrationNumberPart2'); ValidateError++;
        //    }
        //    else {
        //        if ($('#RegistrationNumberPart2').val() == 0) {
        //            $('#dvRegistrationNumberPart2').addClass('Error'); ValidationArray.push('RegistrationNumberPart2'); ValidateError++;
        //        }

        //        if ((reg1A.length + reg2.length) > 4 || (reg1A.length + reg2.length) < 2) {  // Check Both Filed length > 4 Or < 2      
        //            $('#dvRegistrationNumberPart1A').addClass('Error'); ValidationArray.push('RegistrationNumberPart1A');
        //            $('#dvRegistrationNumberPart2').addClass('Error'); ValidationArray.push('RegistrationNumberPart2');
        //            ValidateError++;
        //        }
        //        else {
        //            var Numpattern = new RegExp('^[0-9]+$');
        //            if (Numpattern.test($('#RegistrationNumberPart1A').val()) == true) { // Numeric
        //                if (reg1A.length == 1 && (reg2.length < 1 || reg2.length > 3)) {
        //                    $('#dvRegistrationNumberPart1A').addClass('Error'); ValidationArray.push('RegistrationNumberPart1A');
        //                    $('#dvRegistrationNumberPart2').addClass('Error'); ValidationArray.push('RegistrationNumberPart2');
        //                    ValidateError++;
        //                }
        //                else {
        //                    if ($('#RegistrationNumberPart1').val() == "DL") {
        //                        if ((InsName == "Reliance" || InsName == "Acko") && $('#RegistrationNumberPart2').val().length > 1) {
        //                             //$('#dvRegistrationNumberPart1A').removeClass('Error'); $('#dvRegistrationNumberPart2').removeClass('Error');
        //                        }
        //                        else {
        //                            $('#dvRegistrationNumberPart1A').addClass('Error'); ValidationArray.push('RegistrationNumberPart1A');
        //                            $('#dvRegistrationNumberPart2').addClass('Error'); ValidationArray.push('RegistrationNumberPart2');
        //                            ValidateError++;
        //                        }
        //                    }
        //                    else {
        //                        if ($('#RegistrationNumberPart2').val().length > 2) {
        //                            $('#dvRegistrationNumberPart1A').addClass('Error'); ValidationArray.push('RegistrationNumberPart1A');
        //                            $('#dvRegistrationNumberPart2').addClass('Error'); ValidationArray.push('RegistrationNumberPart2');
        //                            ValidateError++;
        //                        }
        //                        else {
        //                            $('#dvRegistrationNumberPart1A').removeClass('Error');
        //                            $('#dvRegistrationNumberPart2').removeClass('Error');
        //                        }                                
        //                    }
        //                }
        //            }
        //            else {
        //                if (reg1A.length == 3) {
        //                    var reg1Apattern = /[0-9]{2}[a-zA-Z]{1}$/;
        //                    if (reg1A.match(reg1Apattern) != null) {
        //                        $('#dvRegistrationNumberPart1A').removeClass('Error'); //remove error
        //                    }
        //                    else {
        //                        $('#dvRegistrationNumberPart1A').addClass('Error'); ValidationArray.push('RegistrationNumberPart1A');
        //                        ValidateError++;
        //                    }
        //                }
        //            }
        //        }
        //    }
        //}

        if ($('#RegistrationNumberPart3').val() == "" || checkNumeric($('#RegistrationNumberPart3')) == false || $('#RegistrationNumberPart3').val().length < 4 || $('#RegistrationNumberPart3').val() <= 0) { $('#dvRegistrationNumberPart3').addClass('Error'); ValidationArray.push('RegistrationNumberPart3'); ValidateError++; }
        else { $('#dvRegistrationNumberPart3').removeClass('Error'); }


        //if (($('#RegistrationNumberPart2').val()).toUpperCase() == 'ZZ' && $('#RegistrationNumberPart3').val() == '9999') {
        //    $('#dvRegistrationNumberPart2').addClass('Error');
        //    $('#dvRegistrationNumberPart3').addClass('Error');
        //    ValidateError++;
        //}
        //else {
        //    $('#dvRegistrationNumberPart2').removeClass('Error');
        //    $('#dvRegistrationNumberPart3').removeClass('Error');
        //}
        
        if ($('#PolicyNumber').val() == "" || checkPolicyNumber($('#PolicyNumber')) == false || $('#PolicyNumber').val().length < 7 || $('#PolicyNumber').val().length > 25 || checkText($('#PolicyNumber')) == true) { $('#dvPolicyNumber').addClass('Error'); ValidationArray.push('PolicyNumber'); ValidateError++; }

        else { $('#dvPolicyNumber').removeClass('Error'); }
    }

    if ($("#VehicleColor").is(':Visible')) {
        if ($("#VehicleColor").val() == "" || $("#VehicleColor").val() == 0 || $("#VehicleColor").val() == "0")
        {
            $('#VehicleColor').addClass('Error'); ValidationArray.push('VehicleColor'); ValidateError++;
        }
        else { $('#VehicleColor').removeClass('Error'); }
    }

    if (ValidateError < 1) {
        $('#iconVAD').removeClass('glyphs');
        if (data_sent['TabVehicleAddInfo'] == false) {
            data_sent['TabVehicleAddInfo'] = true;
            
            IsSameAsRegistered(true);
            update_user_data("collapseVehicleAddInfo");
        }
        return true;
    }
    else {
        data_sent['TabVehicleAddInfo'] = false;
        populate_errordetails(ValidationArray);
        $($('#collapseVehicleAddInfo').prev().children()[0]).hide();
        return false;
    }
}
function ValidateND(InsName) {
    ValidateError = 0;

    $('.valerr').remove();
    var ValidationArray = [];

    if ((VehicleRegistrationType == "corporate" && InsName == "Bharti") || VehicleRegistrationType == "individual") {
        var data = $('#NomineeName').val();
        var arr = data.split(' ');
        if (InsName == "Royal") {
            if ($('#NomineeName').val == "" || checkTextWithSpace($('#NomineeName')) == false) { $('#dvNomineeName').addClass('Error'); ValidateError++; }
            else { $('#dvNomineeName').removeClass('Error'); }
        }
        else {
            if ($('#NomineeName').val == "" || arr.length < 2 || arr[arr.length - 1] == "" || checkTextWithSpace($('#NomineeName')) == false) { $('#dvNomineeName').addClass('Error'); ValidateError++; }
            else { $('#dvNomineeName').removeClass('Error'); }
        }

        if ($('#NomineeRelationID option:selected').text() == "Self") {
            $('#NomineeDOB').val($('#DOBofOwner').val()); // For Self Condition
            $('#NomineeName').val($('#ContactName').val() + ' ' + $('#ContactLastName').val()); // For Self Condition
        }

        //if (InsName == "Reliance") {
        //    if ($('#NomineeRelation').val() == "0") { $('#NomineeRelation').addClass('Error'); ValidateError++; }
        //    else { $('#NomineeRelation').removeClass('Error'); }
        //}

        if ($('#NomineeRelationID').val() == "0") { $('#NomineeRelationID').addClass('Error'); ValidationArray.push('NomineeRelationID'); ValidateError++; }
        else { $('#NomineeRelationID').removeClass('Error'); }

        if ($('#NomineeDOB').val() == "") { $('#dvNomineeDOB').addClass('Error'); ValidationArray.push('NomineeDOB'); ValidateError++; }
        else { $('#dvNomineeDOB').removeClass('Error'); }
    }
    if (InsName == "Liberty" && corporate_nominee_flag == "false" && VehicleRegistrationType != "individual") {
        if (data_sent['TabNomineeInfo'] == false) {
            data_sent['TabNomineeInfo'] = true;
            update_user_data("collapseNomineeInfo");
        }
        return true;
    }

    if (ValidateError < 1) {
        if ((VehicleRegistrationType == "individual") && (InsName == "Bharti" || InsName == "HDFCErgo" || InsName == "Reliance")) { $("#FinalSubmit").val("1"); }
        if (data_sent['TabNomineeInfo'] == false) {
            data_sent['TabNomineeInfo'] = true;
            update_user_data("collapseNomineeInfo");
        }
        return true;
    }
    else {
        data_sent['TabNomineeInfo'] = false;
        populate_errordetails(ValidationArray);
        $($('#collapseNomineeInfo').prev().children()[0]).hide();
        return false;
    }
}
function ValidateTC(InsName) {
    ValidateError = 0;
    if (true) {
        if ($("#iagree").is(":checked") == false) { $("#lbliagree").addClass('Errorchack'); ValidateError++; return false; }
        else { $("#lbliagree").removeClass('Errorchack'); }

        if (ValidateError < 1) {
            { $("#FinalSubmit").val("1"); }
            return true;
        }
        else { return false; }
    }
    else {
        $("#FinalSubmit").val("1");
        return true;
    }
}

function IsSameAsRegistered(flag) {
   
    if (flag == true) {
        $('#ContactAddress').val($('#RegisteredAddress').val()).addClass('used');
        $('#Address2').val($('#RegisteredAddress2').val()).addClass('used');
        $('#Address3').val($('#RegisteredAddress3').val()).addClass('used');
        $('#ContactPinCode').val($('#RegisteredPinCode').val()).addClass('used');
        //$("#ddlContactCityID").val($("#ddlRegisteredCityId option:selected").val());
        $('#DistrictName').val($('#RegistereDistrictName').val()).addClass('used');
        $('#ContactCityName').val($('#RegisteredCityName').val()).addClass('used');
        $('#ContactCityID').val($('#RegisteredCityId').val());
        $('#StateName').val($('#RegisteredStateName').val()).addClass('used');
        $("#CommunicationStateId").val($('#RegisteredStateId').val());
        $("#ddlContactCityID").empty();
        $('#ddlRegisteredCityId option').clone().appendTo('#ddlContactCityID');
        $('#ddlContactCityID').val($('#ddlRegisteredCityId').val());
        $('#CommunicationDistrictCode').val($('#RegisteredDistrictCode').val());
        //$('#ContactPinCode').focusout();
        //$('#divCurrentAddress').hide();
    }
    else {
        
        //$('#divCurrentAddress').show();
        $('#ContactAddress').val("").removeClass('used');
        $('#Address2').val("").removeClass('used');
        $('#Address3').val("").removeClass('used');
        $('#ContactPinCode').val("").removeClass('used');
        $('#ddlContactCityID').val("0").removeClass('used');
        $('#DistrictName').val("").removeClass('used');
        $('#ContactCityName').val("").removeClass('used');
        $('#ContactCityID').val("").removeClass('used');
        $('#StateName').val("").removeClass('used');
        $("#CommunicationStateId").val("");
        $('#CommunicationDistrictCode').val('');
    }
}

function update_user_status() {
    var obj = {};
    obj["ss_id"] = $("#SupportsAgentID").val();
    obj["insurer_id"] = summary.Summary.Insurer_Id;
    obj["data_type"] = "status";

    obj["search_reference_number"] = summary.Summary.Request_Unique_Id;

    obj["api_reference_number"] = summary.Summary.Service_Log_Unique_Id;
    console.log(obj);

    //var SaveDataURL = '/quote/save_user_data';
    //var obj_horizon_data = Horizon_Method_Convert(SaveDataURL, obj, "POST");

    //$.ajax({
    //    type: "POST",
    //    data: obj_horizon_data['data'],
    //    url: obj_horizon_data['url'],
    //    dataType: "json",
    //    success: function (response) {
    //        console.log('Response', response);
    //        try {
    //            var res = response;
    //            if (res.Msg == "Data saved") {
    //                console.log("Status Saved");
    //            }
    //            else if (res.Msg == "Transaction Already Closed") {
    //                $.alert("Transaction Already Closed. Please make a new search and proceed!");
    //                $('#PaymentLink').hide();
    //                window.location.href = "/";
    //            }
    //        }
    //        catch (e) {
    //            $.alert("Transaction Already Closed. Please make a new search and proceed dsfsdf!");
    //            $('#PaymentLink').hide();
    //            window.location.href = ('/');
    //        }
    //    }
    //});
    //return false;

    $.get("/TwoWheelerInsurance/Save_User_Data?update_data=" + JSON.stringify(obj) + "&ClientID=" + ClientID,
        function (data) {
            //console.log('data', data);
            try {
                var res = $.parseJSON(data);
                if (res.Msg == "Data saved") {
                    console.log("Status Saved");
                }
                else if (res.Msg == "Transaction Already Closed") {
                    $.alert("Transaction Already Closed. Please make a new search and proceed!");
                    $('#PaymentLink').hide();
                    window.location.href = "/";
                }
            }
            catch (e) {
                $.alert("Transaction Already Closed. Please make a new search and proceed dsfsdf!");
                $('#PaymentLink').hide();
                window.location.href = ('/');
            }
        }
    );
}

function update_user_data(current_div) {
    var obj = {};
    if ($("#" + current_div).hasClass('panel-collapse') && data_sent[$("#" + current_div).prev().children('.Heading1')[0].id]) {
        $($('#' + current_div).prev().children()[0]).show();
    }
    var x = $('#' + current_div + ' :input').serializeArray();
    $(x).each(function (index, value) {
        obj[field_mapping[value.name]] = value.value;
    });

    obj["agent_source"] = typeof agent_source == "undefined" ? "" : agent_source;
    obj["ss_id"] = $("#SupportsAgentID").val();
    obj["insurer_id"] = summary.Summary.Insurer_Id;
    obj["data_type"] = "proposal";
    obj["search_reference_number"] = summary.Summary.Request_Unique_Id;
    obj["api_reference_number"] = summary.Summary.Service_Log_Unique_Id;
   
    if ($('input[id=SameAsCommunication]').is(':checked')) {
        IsSameAsRegistered(true);     
    }

    console.log(obj);

    //var SaveDataURL = '/quote/save_user_data';
    //var obj_horizon_data = Horizon_Method_Convert(SaveDataURL, obj, "POST");
    //$.ajax({
    //    type: "POST",
    //    data: obj_horizon_data['data'],
    //    url: obj_horizon_data['url'],
    //    dataType: "json",
    //    success: function (response) {
    //        console.log('Response', response);
    //        if (response.Msg == "Data saved") {
    //            console.log("Data Saved");
    //        }
    //    }
    //});
    //return false;

    $.get("/TwoWheelerInsurance/Save_User_Data?update_data=" + JSON.stringify(obj) + "&ClientID=" + ClientID,
        function (data) {
            console.log('data', data);
            var res = $.parseJSON(data);
            if (res.Msg == "Data saved") { console.log("Data Saved"); }
        }
    );
}

function change_formate(date) {
    if (isNaN(date.substring(2, 3)))
        return date.substring(6, 10) + date.substring(2, 6) + date.substring(0, 2);
    else
        return date.substring(8, 10) + date.substring(4, 8) + date.substring(0, 4);
}

function set_values(request) {
    $.each(field_mapping, function (index, value) {
        if (request.hasOwnProperty(value)) {
            $('#' + index).val(request[value]);
            //console.log(index, ":", request[value]);
        }
    });
    if (request.hasOwnProperty("birth_date"))
    { $('#DOBofOwner').val(request["birth_date"]); }
    if (request.hasOwnProperty("nominee_birth_date"))
    { $('#NomineeDOB').val(request["nominee_birth_date"]); }
    if (!request.hasOwnProperty("is_financed")) {
        $("#IsFinanced").val("False");
    }
}

var field_mapping = {
    "FinancierCode": "financial_institute_code",
    "InstitutionName": "financial_institute_name",
    "FinancerAgreementType": "financial_agreement_type",
    "InstitutionCity": "financial_institute_city",
    "IsFinanced": "is_financed",
    "VehicleColor": "vehicle_color",
    "PolicyNumber": "previous_policy_number",
    "ChasisNumber": "chassis_number",
    "EngineNumber": "engine_number",
    "RegistrationNumberPart3": "registration_no_4",
    "RegistrationNumberPart2": "registration_no_3",
    "RegistrationNumberPart1A": "registration_no_2",
    "RegistrationNumberPart1": "registration_no_1",
    "StateName": "communication_state",
    "ddlContactCityID": "communication_locality_code",
    "ContactCityName": "communication_city",
    "CommunicationDistrictCode": "communication_district_code",
    "ContactCityID": "communication_city_code",
    "CommunicationStateId": "communication_state_code",
    //"DistrictName": "NETAJINAGAR",
    "ContactPinCode": "communication_pincode",
    "Address3": "communication_address_3",
    "Address2": "communication_address_2",
    "ContactAddress": "communication_address_1",
    "RegisteredStateName": "permanent_state",
    "ddlRegisteredCityId": "permanent_locality_code",
    "RegisteredDistrictCode": "permanent_district_code",
    "RegisteredCityName": "permanent_city",
    "RegisteredCityId": "permanent_city_code",
    "RegisteredStateId": "permanent_state_code",
    //"RegistereDistrictName": "NETAJINAGAR",
    "RegisteredPinCode": "permanent_pincode",
    "RegisteredAddress3": "permanent_address_3",
    "RegisteredAddress2": "permanent_address_2",
    "RegisteredAddress": "permanent_address_1",
    "Salutation": "salutation",
    "hdnSalutation": "salutation_text",
    "ContactName": "first_name",
    "ContactMiddleName": "middle_name",
    "ContactLastName": "last_name",
    "ContactMobile": "mobile",
    "ContactEmail": "email",
    "Gender": "gender",
    "MaritalStatus": "marital",
    "PANNo": "pan",
    "ContactOccupationId": "occupation",
    "NomineeName": "nominee_name",
    "NomineeRelationID": "nominee_relation",
    "lm_agent_name": "lm_agent_name",
    "lm_agent_id": "lm_agent_id",
    "erp_qt": "erp_qt",
    "lm_agent_mobile": "lm_agent_mobile",

    // date format is different for view and backend.
    "DOBofOwner": "birth_date",
    "NomineeDOB": "nominee_birth_date",
    "AadharNo": "aadhar",
    "GSTIN": "gst_no",
    "CompanyName": "company_name"
};

var dropdown_text = [
    "Salutation",
    "MaritalStatus",
    "ContactOccupationId",
    "ddlContactCityID",
    "ddlRegisteredCityId",
    "FinancerAgreementType",
    "NomineeRelationID"
];

$('.Address').keypress(function () {
    if (InsurerName == "GoDigit") {
        if (($(this).attr('id') == "RegisteredAddress" || $(this).attr('id') == "ContactAddress")) {
            return this.value.length < 10;
        }
        else { return this.value.length < 70; }
    }
    else { return this.value.length < 25 }
});

$("#iagree").click(function () {
    if ($("#iagree").is(":checked") == false) { $("#lbliagree").addClass('Error'); }
    else { $("#lbliagree").removeClass('Error'); }
});
var _nominee = {
    "Spouse": "Spouse",
    "Father": "Father",
    "Mother": "Mother",
    "Son": "Son",
    "Sister": "Sister",
    "Daughter": "Daughter",
    "Brother": "Brother",
    "Other": "Other"
};
$.each(_nominee, function (val, text) {
    $('#NomineeRelationID').append(new Option(text, val));
});

var error_msg = {
    "Salutation": "Please select title",
    "ContactName": "Please Enter alphabets only",
    "ContactMiddleName": "Please Enter alphabets only",
    "ContactLastName": "Please Enter alphabets only",
    "DOBofOwner": "Please select DOB",
    "ContactMobile": "Please enter valid mobile number",
    "ContactEmail": "Please enter valid email address",
    "MaritalStatus": "Please select Marital Status",
    "PANNo": "Enter Valid Pan no",
    "AadharNo": "Enter number only",
    "ContactOccupationId": "Please select Occupation",
    "RegisteredAddress": "Please enter valid registered Address",
    "RegisteredAddress2": "Please enter valid registered Address 2",
    "RegisteredAddress3": "Please enter valid registered Address 3",
    "RegisteredPinCode": "Enter pincode number",
    "ddlRegisteredCityId": "Please select RegisteredCity",
    "EngineNumber": "Enter valid Engine no.",
    "ChasisNumber": "Enter valid Chasis no.",
    "VehicleColor": "Please select Vehicle Color",
    "FinancerAgreementType": "Please select Financer Agreement Type",
    "InstitutionName": "Enter Institution Name",
    "NomineeRelationID": "Please select Nominee Relation",
    "NomineeName": "Enter Nominee Name",
    "NomineeDOB": "Please select NomineeDOB",
    "iagree": "Please Select checkbox",
    "ContactAddress": "Please enter Contact Address",
    "Address2": "Please enter Contact Address 2",
    "Address3": "Please enter Contact Addres 3",
    "ContactPinCode": "Please enter pincode",
    "ddlContactCityID": "Please select locality",
    "RegisteredCityName": "Please enter city",
    "RegisteredStateName": "Please enter state",
    "ContactCityName": "Please enter pincode",
    "StateName": "Please enter pincode",
    "RegistrationNumberPart1": "Enter valid registration no ",
    "RegistrationNumberPart1A": "Enter valid registration no ",
    "RegistrationNumberPart2": "Enter valid registration no ",
    "RegistrationNumberPart3": "Enter valid registration no ",
    "PolicyNumber": "Please enter valid policy no",
    "VehicleColor": "Please select color",
    "FinancerAgreementType": "Please Select Financer type",
    "GSTIN": "Please Enter Valid GST Number",
    "CompanyName": "Please Valid Company Name",
    "Licence":"Please Enter Licence Number"
};

function populate_errordetails(ValidationArray) {
    var i, j;
    var result = [];
    $.each(ValidationArray, function (i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    ValidationArray = result;

    for (i = 0; i < ValidationArray.length; ++i) {
        var err = "<div class='valerr' style='color:red'>" + error_msg[ValidationArray[i]] + "</div>";
        if ($('#' + ValidationArray[i]).get(0).tagName == "SELECT") {
            //$('#' + ValidationArray[i]).append(err);
            $("<div class='valerr' style='color:red;margin-top:5px;'>" + error_msg[ValidationArray[i]] + "</div>").insertAfter($('#' + ValidationArray[i]));
        }
        if ($('#' + ValidationArray[i]).get(0).tagName == "INPUT") {
            $('#dv' + ValidationArray[i]).parent().append("");
            $('#dv' + ValidationArray[i]).parent().append(err);
        }
        if ($('#' + ValidationArray[i]).val() != "" || $('#' + ValidationArray[i]).val() != 0) {
            $('#' + ValidationArray[i]).next('.valerr').hide();
        }
    }
}
function Salution_Error(ValidationArray_Salutation) {
    
    var result = [];
    var i, j;
    $.each(ValidationArray_Salutation, function (i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    ValidationArray_Salutation = result;
    for (i = 0; i < ValidationArray_Salutation.length; ++i) {
        if (ValidationArray_Salutation[i] == "GenderNotMatch") {
            $("<div class='valerr' style='color:red;margin-top:5px;'>Please enter valid Salutation</div>").insertAfter($('#Salutation'));
        }
        if ((ValidationArray_Salutation[i] == "MaritalStatus")) {
            $("<div class='valerr' style='color:red;margin-top:5px;'>Please enter valid Marital Status</div>").insertAfter($('#MaritalStatus'));
        }
    }
}
function remove_errordetails(ValidationArray) {
    var i, j;
    for (i = 0; i < ValidationArray.length; ++i) {
        $('#' + ValidationArray[i]).parent().text("<span class='valerr' style='color:red'></span>");
    }
}
function CorporateHide(CPF, CNF) {
    if (CPF == "true") { $(".Individual").show(); }
    else { $(".Individual").hide(); }

    if (CNF == "true") { $("#NomineePanel").show(); }
    else { $("#NomineePanel").hide(); }
}
$('input').focusout(function () {
    var input = $.trim($(this).val());
    if (input.length == 0) {
        $(this).val('');
    }
    var string = $(this).val();
    string = string.replace(/^0+/, '').replace(/  +/g, ' ');
    $(this).val(string);
    if ($(this).attr('id') == 'RegistrationNumberPart1A' || $(this).attr('id') == 'RegistrationNumberPart3' || $(this).hasClass('form-dob') || $(this).attr('id') == 'PolicyNumber' || $(this).hasClass('RegNumber') || $(this).hasClass('Address') || $(this).attr('id') == 'GSTIN') {
        if ($(this).val() != 0) { $(this).val(input); }
    }
});

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

function GenerateOTP(CRN, UDID, CustName, CustMobile, CustEmail, ProdId) {
    //CRN
    //ProductID
    var CustName = $("#ContactName").val() + $("#ContactMiddleName").val() != "" ? $("#ContactMiddleName").val() : "" + $("#ContactLastName").val();
    var data = {
        "CRN": CRN,
        "UDID": UDID,
        "Cust_Name": CustName,
        "Cust_Mobile": $("#ContactMobile").val(),
        "Cust_Email": $("#ContactEmail").val(),
        "ProductID":ProductID,
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
    }
    var obj_horizon_data = Horizon_Method_Convert("/otp_generate", data, "POST");
    $.ajax({
        type: "POST",
        data: JSON.stringify(obj_horizon_data['data']),
        url: obj_horizon_data['url'],
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            
        },
        error: function (data) {

        }
    });
}

function VerifyOTP(CRN, OTP) {
    var VerifyOTPURL = '/otp_verify?CRN=' + CRN+'&otp='+ OTP;
    var obj_horizon_data = Horizon_Method_Convert(VerifyOTPURL, '', "GET");
    $.ajax({
        type: "GET",
        data: JSON.stringify(obj_horizon_data['data']),
        url: obj_horizon_data['url'],
        dataType: "json",
        success: function (data) {

        }
    });
}

function ResendOTP(CRN, UDID, CustName, CustMobile, CustEmail, ProdId) {
    //var VerifyOTPURL = '/otp_resend?CRN=' + CRN + '&otp=' + OTP;
    //var obj_horizon_data = Horizon_Method_Convert(VerifyOTPURL, '', "GET");

    var data = {
        "CRN": CRN,
        "UDID": UDID,
        "Cust_Name": CustName,
        "Cust_Mobile": $("#ContactMobile").val(),
        "Cust_Email": $("#ContactEmail").val(),
        "ProductID": ProductID,
        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
    }
    var obj_horizon_data = Horizon_Method_Convert("/otp_resend", data, "GET");
    $.ajax({
        type: "GET",
        data: JSON.stringify(obj_horizon_data['data']),
        url: obj_horizon_data['url'],
        dataType: "json",
        success: function (data) {

        }
    });
}