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
    var pattern = new RegExp('^([6-9]{1}[0-9]{9})$'); 
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
function checkTextWithDotSpace(input) {
    var pattern = new RegExp('^[a-zA-Z .]+$');
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
    var pattern = new RegExp('^[a-zA-Z\-&() .,]+$');
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
    //'TabCompanyInfo': false,
    'TabAddInfo': false,
    'TabCurrentTPPolicyInfo': false,
    'TabVehicleAddInfo': false,
    'TabNomineeInfo': false,
    'PaymentLink': false
}

// Validating And Sliding Sections
function GetInsurerName(id) {
    switch (id) {
        case "1": InsurerName = "Bajaj"; break;
        case "2": InsurerName = "Bharti"; break;
        case "3": InsurerName = "Cholamandalam"; break;
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
        case "47": InsurerName = "DHFL"; break;
        case "48": InsurerName = "Kotak"; break;
    }
    $('#InsurerName').val(InsurerName);
}
function ValidateSection(id) {
    switch (id) {
        case 'TabViewInput': return true; break;
        case 'TabPersonalInfo': return ValidateCD(InsurerName); break;
            //case 'TabCompanyInfo': return ValidateCompanyD(InsurerName); break;
        case 'TabAddInfo': return ValidateAD(InsurerName); break;
        case 'TabCurrentTPPolicyInfo': return ValidateCTPD(InsurerName); break;
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

            if (summary.Quote_Request.vehicle_registration_type == "corporate") {
                //data_sent["TabPersonalInfo"] = true;
                data_sent["TabNomineeInfo"] = true;
            }
            //else { data_sent["TabCompanyInfo"] = true; }
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

        /*if (summary.Quote_Request.vehicle_registration_type == "corporate") {
            if ($(this).attr('id') == 'TabViewInput' || $(this).attr('id') == 'TabCompanyInfo' || $(this).attr('id') == 'TabVehicleAddInfo') {
                $(this).next('.collapse').collapse('show');
            }
            else if (ValidateCompanyInformation() && ValidateVADAgent(InsurerName)) {
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
                    $("#AgentDiv").hide();
                    showProgress();
                    $('#PaymentLink').attr("disabled", "disabled");
                    $("#PaymentLink").prop('value', '   ...   ');
                    $('#ProgressStatus').html('');
                    $('#ProgressStatus').append("Sending mail to customer ...");
                    var Sal = $("#Salutation option:selected").text();
                    $("#hdnSalutation").val(Sal);
                    $("#CustomerDiv").show();
                    setTimeout(function () {
                        //document.forms[0].submit();
                        payment_link_send();
                    }, 5000);
                }
            }
            else if (!(ValidateCompanyInformation())) {
                ExpandSection($('#TabCompanyInfo').attr('id'), $('#collapseCompanyInfo').attr('id'));
                return false;
            }
            else if (!(ValidateVADAgent())) {
                ExpandSection($('#TabVehicleAddInfo').attr('id'), $('#collapseVehicleAddInfo').attr('id'));
                return false;
            }
        }*/

        //if (summary.Quote_Request.vehicle_registration_type == "individual") {
        if ($(this).attr('id') == 'TabViewInput' || $(this).attr('id') == 'TabPersonalInfo' || $(this).attr('id') == 'TabVehicleAddInfo') {
            $(this).next('.collapse').collapse('show');
        }
       
        else if (ValidatePersonalInformation() && ValidateVADAgent(InsurerName)) {
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
                $("#AgentDiv").hide();
                showProgress();
                $('#PaymentLink').attr("disabled", "disabled");
                $("#PaymentLink").prop('value', '   ...   ');
                $('#ProgressStatus').html('');
                $('#ProgressStatus').append("Sending mail to customer ...");
                var Sal = $("#Salutation option:selected").text();
                $("#hdnSalutation").val(Sal);
                $("#CustomerDiv").show();
                setTimeout(function () {
                    //document.forms[0].submit();
                    payment_link_send();
                }, 5000);
            }
        }
        else if (!(ValidatePersonalInformation())) {
            ExpandSection($('#TabPersonalInfo').attr('id'), $('#collapsePersonalInfo').attr('id'));
            return false;
        }
        else if (!(ValidateVADAgent())) {
            ExpandSection($('#TabVehicleAddInfo').attr('id'), $('#collapseVehicleAddInfo').attr('id'));
            return false;
        }
        //}
    });
}

// payment_link_send function
function payment_link_send1() {
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
function payment_link_send() {

    console.log("payment_link_send");
    // Added By Pratik For Node Calling
    var _payLink = "";
    //_payLink = ((parseInt($("#ProductID").val()) == 10) ? "/buynowprivatecar/" : "/buynowtwowheeler/") + ClientID + "/" + ARN;
    _payLink = ((parseInt($("#ProductID").val()) == 10) ? "/two-wheeler-insurance/" : "/car-insurance/") + "buynow/" + ClientID + "/" + ARN;
    ((parseInt(ClientID) == 3) ? (_payLink = _payLink + "/POSP/0") : (_payLink = _payLink + "/NonPOSP/0"));
    var ProdID = parseInt($("#ProductID").val());
    var email_id = "";
    if (summary.Quote_Request.vehicle_registration_type == "corporate") {
        email_id = $('#CompanyContactPersonEmail').val();
    }
    else {
        email_id = $('#ContactEmail').val();
    }

    var data = {
        contact_name: $('#ContactName').val(),
        last_name: $('#ContactLastName').val(),
        phone_no: $('#ContactMobile').val(),
        customer_email: $('#ContactEmail').val(),
        agent_name: $('#AgentName').val(),
        agent_mobile: $('#AgentMobile').val(),
        agent_email: $('#AgentEmail').val(),
        crn: $('#CustomerReferenceID').val(),
        product_name: ProdID == 12 ? "CV" : (ProdID == 10 ? "Bike" : "Car"),
        insurer_name: summary.PB_Master.Insurer.Insurer_Name,
        insurer_id: summary.PB_Master.Insurer.Insurer_ID,
        vehicle_text: $('#TwoWheelerVariant').val(),
        final_premium: $("#SelectedQuote_TotalPremium").val(),
        payment_link: GetUrl() + _payLink,
        //registration_no : _registrationNo,
        search_reference_number: summary.Summary.Request_Unique_Id_Core,
        salutation_text: $("#Salutation option:selected").text(),
        insurance_type: $("#TwoWheelerType").val(),
        client_id: ClientID,
        api_reference_number: summary.Summary.Service_Log_Unique_Id,
        CustomerReferenceID: $('#CustomerReferenceID').val(),
        //request_json: JSON.stringify(request),
    }
    console.log(JSON.stringify(data));
    var obj_horizon_data = Horizon_Method_Convert("/quote/send_payment_link", data, "POST");
    $.ajax({
        type: "POST",
        data: JSON.stringify(obj_horizon_data['data']),
        url: obj_horizon_data['url'],
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (response) {
            console.log(response);
            $("#CustomerDiv").hide();
            if (response.hasOwnProperty('Status')) {
                if (response.Status == "SUCCESS") {
                    $("#FailMsg").text("");
                    $('#short_url').text("");
                    $("#AgentFail").hide();
                    $("#AgentDiv, #AgentSuccess").show();
                    $('#PaymentLink').attr("disabled", "disabled");
                    $("#PaymentLink").prop('value', '   ...   ');
                    $('#short_url').text(response.Payment_Link);
                } else if (response.Status == "FAIL" || response.Status == "VALIDATION") {
                    $("#AgentDiv, #AgentFail").show();
                    $("#FailMsg").text(response.Msg);
                    $('#PaymentLink').prop({ 'disabled': false, 'value': 'Send Proposal Link' });
                }
            }
            else {
                $("#AgentDiv, #AgentSuccess").show();
            }
            //{'Status': 'FAIL', 'Msg': 'Kindly provide different EmailId. More than 2 policies are issued in last 6 month(s) through email - ' + emailto, }
            //{'Status' : 'SUCCESS'}
            //if (ProductID == 1) { window.location.href = "/CarInsuranceIndia/CustomerPaymentRequest"; }
            //else if (ProductID == 10) { window.location.href = "/TwoWheelerInsurance/CustomerPaymentRequest"; }
        },
        error: function (request, status, errorThorwn) {
            console.log(request);
            console.log(status);
        }
    });
    //$("#CustomerDiv").hide();
    //$("#AgentDiv").show();
}
function ValidateCompanyInformation(InsName) {

    ValidateError = 0;
    $('.valerr').remove();
    var ValidationArray = [];
    var ValidationSalutation = [];

    if (VehicleRegistrationType == "corporate") {
        if (document.getElementById('CorporateName').value == "" || (document.getElementById('CorporateName').value.length < 2) || (checkCompanyTextWithSpace(document.getElementById('CorporateName').value) == false)) {
            $('#dvCorporateName').addClass('Error'); ValidationArray.push('CorporateName'); ValidateError++;
        }
        else { $('#dvCorporateName').removeClass('Error'); }

        if ((document.getElementById('GSTNo').value == "" || document.getElementById('GSTNo').value == null)) {
            $("#dvGSTNo").addClass('Error'); ValidationArray.push('GSTNo'); ValidateError++;
        }
        else {
            var gstVal = document.getElementById('GSTNo').value.toUpperCase();
            var gstPattern = new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');
            var patternArray = gstVal.match(gstPattern);
            if (patternArray == null) { $("#dvGSTNo").addClass('Error'); ValidationArray.push('GSTNo'); ValidateError++; }
            else { $("#dvGSTNo").removeClass('Error'); }
        }

        if ($('#CompanyContactPersonName').val() == "" || $('#CompanyContactPersonName').val().length < 2 || checkTextWithSpace($('#CompanyContactPersonName')) == false) {
            $('#dvCompanyContactPersonName').addClass('Error'); ValidationArray.push('CompanyContactPersonName'); ValidateError++;
        }
        else { $('#dvCompanyContactPersonName').removeClass('Error'); }

        if ($('#CompanyContactPersonMobile').val().length == 0 || checkMobile($('#CompanyContactPersonMobile')) == false) {
            $('#dvCompanyContactPersonMobile').addClass('Error'); ValidationArray.push('CompanyContactPersonMobile'); ValidateError++;
        }
        else if ($('#CompanyContactPersonMobile').val().length > 10 || $('#CompanyContactPersonMobile').val().length < 10) {
            $('#dvCompanyContactPersonMobile').addClass('Error'); ValidationArray.push('CompanyContactPersonMobile'); ValidateError++;
        }
        else { $('#dvCompanyContactPersonMobile').removeClass('Error'); }

        if ($('#CompanyContactPersonEmail').val().length == 0 || checkEmail($('#CompanyContactPersonEmail')) == false) {
            $('#dvCompanyContactPersonEmail').addClass('Error'); ValidationArray.push('CompanyContactPersonEmail'); ValidateError++;
        }
        else { $('#dvCompanyContactPersonEmail').removeClass('Error'); }
    }
    else {
        ValidateError = 0;
    }

    if (VehicleRegistrationType == "corporate" && ValidateError == 0) {
        if (data_sent['TabCompanyInfo'] == false) {
            data_sent['TabCompanyInfo'] = true;
            update_user_data("collapseCompanyInfo");
        }
        return true;
    }

    if (ValidateError < 1) {
        if (data_sent['TabCompanyInfo'] == false) {
            data_sent['TabCompanyInfo'] = true;
            update_user_data("collapseCompanyInfo");
        }
        return true;
    }
    else {
        data_sent['TabCompanyInfo'] = false;
        populate_errordetails(ValidationArray);
        $($('#collapseCompanyInfo').prev().children()[0]).hide();
        return false;
    }
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
        if ($('#ContactLastName').val() != "") {
            if ($('#ContactLastName').val().length < 1 || checkTextWithDotSpace($('#ContactLastName')) == false) { $('#dvContactLastName').addClass('Error'); ValidateError++; }
            else { $('#dvContactLastName').removeClass('Error'); }
        }
        else { $('#dvContactLastName').removeClass('Error'); }
    }
    if ($('#ContactMobile').val().length == 0 || checkMobile($('#ContactMobile')) == false) { $('#dvContactMobile').addClass('Error'); ValidationArray.push('ContactMobile'); ValidateError++; }
    else { $('#dvContactMobile').removeClass('Error'); }

    if ($('input[id="Is_Email_Optional"]').is(":checked") && ProductID == 10) {
        $('#dvContactEmail').removeClass('Error');
    } else {
        if ($('#ContactEmail').val().length == 0 || checkEmail($('#ContactEmail')) == false) { $('#dvContactEmail').addClass('Error'); ValidationArray.push('ContactEmail'); ValidateError++; }
        else { $('#dvContactEmail').removeClass('Error'); }
    }




    if (ValidateError < 1) {
        remove_errordetails(ValidationArray);
        update_user_data("collapseAddInfo");
        $('.indicator').removeClass('glyphs');
        $("#FinalSubmit").val("1");
        return true;
    }
    else {
        populate_errordetails(ValidationArray);
        return false;
    }
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
        var is_misp = false;
        var is_kotakoem = false;
        if ([816, 14154, 14155, 14156, 14157, 14158, 17051, 15912, 15253, 11971, 17053].indexOf(summary.Quote_Request.ss_id) > -1 && ProductID === 10) {
            is_misp = true;
        }
        if ([822].indexOf(summary.Quote_Request.ss_id) > -1 && ProductID === 10) {
            is_kotakoem = true;
        }
        data_sent[thisval] = false;
        $($('#' + data_sent[thisval]).prev().children()[0]).hide();
        $("#accordion").find('.Heading1').each(function (n, i) { IDs.push(this.id); });
        $("#accordion").find('.panel-collapse').each(function (n, i) { ContentIDs.push(this.id); });
        var thislength = IDs.indexOf(thisval);
        for (var i = 0; i < thislength ; i++) {
            if (summary.Quote_Request.vehicle_registration_type == "corporate") {
                //data_sent["TabPersonalInfo"] = true;
                data_sent["TabNomineeInfo"] = true;
            }
            //else { data_sent["TabCompanyInfo"] = true; }
            if (summary.Quote_Request.vehicle_insurance_subtype == "1OD_0TP") {
                if (summary.Quote_Request.channel == "GS" || summary.Quote_Request.channel == "SM" || is_misp || is_kotakoem) {
                    data_sent["TabTermsConditions"] = true;
                }
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
            else {
                data_sent["TabCurrentTPPolicyInfo"] = true;
                if (summary.Quote_Request.channel == "GS" || summary.Quote_Request.channel == "SM" || is_misp || is_kotakoem) {
                    data_sent["TabTermsConditions"] = true;
                }
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
        }

        if ($('#FinalSubmit').val() == "1" && ($(this).attr('id') == 'PaymentLink' || $(this).attr('id') == 'RequestForInspection' || $(this).attr('id') == 'PayAgent')) {
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

            var is_customer = window.location.href.split('/')[8] != "0" ? false : true;
            if (summary.Quote_Request.channel == "GS" || summary.Quote_Request.channel == "SM" || is_misp || is_kotakoem) {
                if (is_customer) {
                    request["is_customer_paid"] = "yes";
                }
                else {
                    request["is_customer_paid"] = "no";
                }
            }
            else {
                request["is_customer_paid"] = "yes";
            }

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
                    if (last_request.hasOwnProperty(value + '_rate')) {
                        request[value + '_rate'] = last_request[value + '_rate'];
                    }
                });
            }

            //jyoti
            if (request["vehicle_insurance_subtype"] == "1OD_0TP") {
                request["tp_policy_number"] = document.getElementById("TPPolicyNumber").value;
                request["tp_start_date"] = document.getElementById("TPStartDate").value;
                request["tp_end_date"] = document.getElementById("TPEndDate").value;
            }

            if (request["vehicle_registration_type"] == "corporate") {
                request["salutation"] = 'Messrs.';
                //request["company_name"] = document.getElementById("CorporateName").value;
                //request["company_gst_no"] = document.getElementById("GSTNo").value;
                //request["company_contact_person_name"] = document.getElementById("CompanyContactPersonName").value;
                //request["company_contact_person_mobile"] = document.getElementById("CompanyContactPersonMobile").value;
                //request["company_contact_person_email"] = document.getElementById("CompanyContactPersonEmail").value;
            }

            //jyoti
            if (summary.Quote_Request.product_id == 1 && summary.Quote_Request.is_breakin == "yes" && summary.Quote_Request.is_inspection_done == "yes") {
                if ((((summary.Quote_Request.vehicle_insurance_subtype).split("CH_"))[0]) != '0') {
                    request["iffco_inspection_date"] = $("#Iffco_Breakin_Inspection_Date").val();
                    data1["IffcoInspectionDate"] = $("#Iffco_Breakin_Inspection_Date").val();
                }
            }

            //Somanshu
            request["is_reg_addr_comm_addr_same"] = $('input[id=SameAsCommunication]').is(':checked') ? "yes" : "no";
            if (summary.Quote_Request.is_breakin == "yes") {
                request["breakin_location_code"] = $('#ListOfBreakinLocation').val();
                data1["BreakinLocationID"] = $('#ListOfBreakinLocation').val();
            } else {
                request["breakin_location_code"] = "0";
                data1["BreakinLocationID"] = "0";
            }

            $.each(request, function (i, v) {
                if (v != null) {
                    request[i] = v.toString().trim();
                }
            });
            console.log('request', request);


            data1["CustomerReferenceID"] = $('#CustomerReferenceID').val();
            data1["TwoWheelerVariantId"] = request["vehicle_id"];
            console.log('data1', data1);
            /*$.ajax({
                url: '/TwoWheelerInsurance/Proposal_Initiate_Pre',
                type: "POST",
                data: JSON.stringify(data1),
                contentType: "application/json;",
                dataType: "json",
                success: function (response) { },
                error: function (request, status, errorThorwn) { }
            });*/
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
                    if (response.hasOwnProperty('Status') && response.Status != null && response.Status != '' && response.Status == "VALIDATION") {
                        $('.spinner').hide();
                        $('#AlertMsg').show();
                        $('.Insurer_listbox, #RaisedBtn').hide();
                        $('.CRN').text("CRN : " + CRN);
                        $('#ProgressStatus').html('');
                        $('#ProgressStatus').append(response.Msg);
                        $('#err_msgtxt').html("");
                        $('#Hidepopup').show();
                    }
                    else {
                        var arn = response.Service_Log_Unique_Id;
                        if (response.Proposal_Id) {
                            var proposal_id = response.Proposal_Id;
                        } else {
                            var proposal_id = 0;
                        }
                        var res = {};
                        console.log('proposal_initate response', response);
                        if (response.hasOwnProperty('Service_Log_Unique_Id') && arn.includes('-')) {
                            var max_count = 150;
                            setTimeout(function () {
                                get_payment_data(arn, max_count, proposal_id);
                            }, 1000);
                        }
                        else {
                            $('.spinner').hide();
                            //Khushbu 23072019 Proposal error popup.
                            proposalError();
                            $('#AlertMsg').show();

                            $('#ProgressStatus').html('');
                            $('#ProgressStatus').append("Technical Issue ! Cannot Initiate Proposal !");
                            $('#Hidepopup').show();
                        }
                    }
                },
                error: function (request, status, errorThorwn) {
                    console.log(request);
                    console.log(status);
                    $('.spinner').hide();
                    proposalError();
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

        //jyoti
        if (summary.Quote_Request.product_id == 1 && summary.Quote_Request.is_breakin == "yes" && summary.Quote_Request.is_inspection_done == "yes") {
            if ((((summary.Quote_Request.vehicle_insurance_subtype).split("CH_"))[0]) != '0') {
                request["iffco_inspection_date"] = $("#Iffco_Breakin_Inspection_Date").val();
                data1["IffcoInspectionDate"] = $("#Iffco_Breakin_Inspection_Date").val();
            }
        }

        if (summary.Quote_Request.is_breakin == "yes") {
            request["breakin_location_code"] = $('#ListOfBreakinLocation').val();
            data1["BreakinLocationID"] = $('#ListOfBreakinLocation').val();
        } else {
            request["breakin_location_code"] = "0";
            data1["BreakinLocationID"] = "0";
        }


        $.each(request, function (i, v) {
            if (v != null) {
                request[i] = v.toString().trim();
            }
        });
        //debugger;
        console.log(request);
        var data = {
            request_json: JSON.stringify(request),
            client_id: ClientID,
            CustomerReferenceID: $('#CustomerReferenceID').val()
        }
        data1["CustomerReferenceID"] = $('#CustomerReferenceID').val();
        data1["TwoWheelerVariantId"] = request["vehicle_id"];

        /*$.ajax({
            url: '/TwoWheelerInsurance/Proposal_Initiate_Pre',
            type: "POST",
            data: JSON.stringify(data1),
            contentType: "application/json;",
            dataType: "json",
            success: function (response) {
            },
            error: function (request, status, errorThorwn) {
            }
        });*/

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
                var proposal_id = 0;
                if (response.Proposal_Id) {
                    proposal_id = response.Proposal_Id;
                }
                var res = {};
                if (response.hasOwnProperty('Service_Log_Unique_Id') && arn.includes('-')) {
                    var max_count = 150;
                    setTimeout(function () {
                        get_payment_data(arn, max_count, proposal_id);
                    }, 1000);
                }
                else {
                    console.log('proposal_initate response', response);
                    $('.spinner').hide();
                    proposalError();
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
                proposalError();
                $('#AlertMsg').show();
                $('#ProgressStatus').html('');
                $('#ProgressStatus').append("Technical Issue ! Cannot Proceed Now !");
                $('#Hidepopup').show();
            }
        });
    }
    else { return false; }
}

var error_response = {};
function get_payment_data(arn, count, proposal_id) {
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
    var obj = {};
    obj["search_reference_number"] = srn;
    obj["api_reference_number"] = arn;
    obj["Proposal_Id"] = proposal_id;
    var SaveDataURL = '/quote/proposal_details';
    var obj_horizon_data = Horizon_Method_Convert(SaveDataURL, obj, "POST");
    $.ajax({
        type: "POST",
        data: obj_horizon_data['data'],
        url: obj_horizon_data['url'],
        dataType: "json",
        success: function (response) {
            var response_json = response;
            // $.get('/TwoWheelerInsurance/Proposal_Details?request_unique_id=' + srn + '&service_log_unique_id=' + arn + '&client_id=' + ClientID + '&customerRefNo=' + crn + '&productId=' + product_id + '', function (res) {
            //     var response_json = $.parseJSON(res)

            if (response_json.Status === 'complete') { 
                
                //Checking Breakin Case for insurer 5
                var InspId = response_json.Insurer_Transaction_Identifier;
                var VIST = (summary.Quote_Request.vehicle_insurance_subtype).split("CH_");
                //QA
                if (product_id == "1" && (InsurerID == 5 || InsurerID == 9 || InsurerID == 33 || InsurerID == 6 || InsurerID == 7) && summary.Quote_Request.is_breakin == "yes" && summary.Quote_Request.is_inspection_done == "no" && (VIST[0] != '0')) {
                    //Live
                    //if (product_id == "1" && (InsurerID == 5) && summary.Quote_Request.is_breakin == "yes" && summary.Quote_Request.is_inspection_done == "no" && (VIST[0] != '0')) {
                    $('.spinner').hide();
                    $('#AlertMsg').show();
                    $('#Alerticon').css('width', '100px');
                    $('#ProgressStatus').html('');
                    $("#Hidepopup, #BackToHome").show();
                    if (InspId != null && InspId != '') {
                        error_response["Error_Code"] = "LM002";
                        if (InsurerID == 9 || InsurerID == 33) {
                            $('#ProgressStatus').append("<div style='font-size: 13px;'><strong>CRN : </strong>" + CRN + "<br/>This is breakin case. <br/>Our Agent will contact for the inspection with inpection id :" + InspId + " <br/> Once the inspection is done successfully, you will get payment link.<div>");
                        }
                        else if (InsurerID == 6) {
                            var InspIdSplit = InspId.split("-");
                            $('#ProgressStatus').append("<div style='font-size: 13px;'><strong>CRN : </strong>" + CRN + "<br/>This is breakin case. <br/>Insurer will contact for the inspection with inpection id :" + InspIdSplit[2] + " <br/> Once the inspection is done successfully, you will get payment link.<div>");
                        }
                        else if (InsurerID == 7) {
                            $('#ProgressStatus').append("<div style='font-size: 13px;'><strong>CRN : </strong>" + CRN + "<br/>This is breakin case. <br/>Insurer will contact for the inspection with inpection id :" + InspId + " <br/> Once the inspection is done successfully, you will get payment link.<div>");
                        }
                        else {
                            $('#ProgressStatus').append("<div style='font-size: 13px;'><strong>CRN : </strong>" + CRN + "<br/>This is breakin case. <br/>Insurer will contact for the inspection with inpection id :" + InspId + " <br/> Once the inspection is done you will get payment link from insurer.<div>");
                        }
                        $('#err_msgtxt').html("");
                        $("#CloseBtn").hide();
                        var Hrefval = "";
                        if (ProductID == 1) { Hrefval = "/car-insurance"; }
                        else if (ProductID == 10) { Hrefval = "/two-wheeler-insurance"; }
                        $("#BreakinOk").show().attr('href', Hrefval);

                    }
                    else {
                        error_response = response_json.Error;
                        //$('#ProgressStatus').append("<div style='font-size: 13px;'><strong>CRN : </strong>" + CRN + "<br/>This is breakin case. <br/>Some service issue occured. <br/>Please Try again...<div>");
                        $('#ProgressStatus').append("<div style='font-size: 13px;'><strong>CRN : </strong>" + CRN + "<br/>Error:" + response_json.Error.Error_Specific + "<div>");
                        proposalError();
                    }
                    return false;
                }

                $('#ProgressStatus').html('');
                $('#ProgressStatus').append("Going to payment gateway ...");
                if (response_json.Error === null) {
                    console.log(response_json.Payment);
                    /*
                    post(response_json.Payment.pg_url, response_json.Payment.pg_data, response_json.Payment.pg_redirect_mode);
                    */
                    window.location.href = response_json.Payment.proposal_confirm_url;

                    //if (window.location.hasOwnProperty('host') && (window.location.host === "www.policyboss.com")) {
                    //    if (summary.Quote_Request.ss_id === "7582") {
                    //    window.location.href = response_json.Payment.proposal_confirm_url;
                    //} else {

                    //    post(response_json.Payment.pg_url, response_json.Payment.pg_data, response_json.Payment.pg_redirect_mode);
                    //}
                    //} else {
                    //    window.location.href = response_json.Payment.proposal_confirm_url;
                    //}
                }
                else {
                    error_response = response_json.Error;

                    $('.spinner').hide();
                    proposalError();
                    $('#AlertMsg').show();
                    $('#ProgressStatus').html('');
                    $('#ProgressStatus').append("Error:" + response_json.Error.Error_Specific);
                    $('#Hidepopup').show();
                    if (response_json.Error.Error_Action == "UI_VALIDATION") {
                        $('.Insurer_listbox, #RaisedBtn').hide();
                    }
                }
            }
            else if (count > 0) {
                setTimeout(function () {
                    get_payment_data(arn, count--, proposal_id);
                }, 2000);
            }
            else {
                error_response = response_json.Error;

                $('.spinner').hide();
                proposalError();
                $('#AlertMsg').show();
                $('#ProgressStatus').html('');
                $('#ProgressStatus').append("Technical Issue ! Cannot Proceed Now !");
                $('#Hidepopup').show();
            }
        }
    });
}

function ValidateCD(InsName) {
    ValidateError = 0;
    $('.valerr').remove();
    var ValidationArray = [];
    var ValidationSalutation = [];

    if ((VehicleRegistrationType == "individual") && ($("#GSTIN").val() == "" || $("#GSTIN").val() == null)) {
        $("#dvGSTIN").removeClass('Error');
    } else {
        var gstVal = $("#GSTIN").val().toUpperCase();
        var gstPattern = new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');
        var patternArray = gstVal.match(gstPattern);
        if (patternArray == null) {
            $("#dvGSTIN").addClass('Error');
            ValidationArray.push('GSTIN');
            ValidateError++;
        } else {
            $("#dvGSTIN").removeClass('Error');
        }
    }

    if (VehicleRegistrationType == "corporate") {
        if ($('#CompanyName').val() == "" || checkComapnyName($('#CompanyName')) == false) {
            $('#dvCompanyName').addClass('Error');
            ValidationArray.push('CompanyName');
            ValidateError++;
        } else {
            $('#dvCompanyName').removeClass('Error');
        }

        if ($('#ContactName').val() == "" || $('#ContactName').val().length < 1 || checkTextWithSpace($('#ContactName')) == false) {
            $('#dvContactName').addClass('Error');
            ValidationArray.push('ContactName');
            ValidateError++;
        } else {
            $('#dvContactName').removeClass('Error');
        }
    }

    if (VehicleRegistrationType == "individual") {
        var $Salutation = $('#Salutation');
        if ($Salutation.val() == 'TITLE' || $Salutation.val() == "0") {
            $Salutation.addClass('Error');
            ValidationArray.push('Salutation');
            ValidateError++;
        } else {
            $Salutation.removeClass('Error');
        }

        if (InsName != "Bharti") {
            if ($('#ContactName').val() == "" || $('#ContactName').val().length < 1 || checkTextWithSpace($('#ContactName')) == false) {
                $('#dvContactName').addClass('Error');
                ValidationArray.push('ContactName');
                ValidateError++;
            } else {
                $('#dvContactName').removeClass('Error');
            }
        } else {
            if ($('#ContactName').val() == "" || $('#ContactName').val().length < 2 || checkTextWithSpace($('#ContactName')) == false) {
                $('#dvContactName').addClass('Error');
                ValidationArray.push('ContactName');
                ValidateError++;
            } else {
                $('#dvContactName').removeClass('Error');
            }
        }

        if (InsName == "Reliance" && ($('#ContactMiddleName').val().length < 1 || checkText($('#ContactMiddleName')) == false)) {
            if ($('#ContactMiddleName').val() == "") {
                $('#dvContactMiddleName').removeClass('Error');
            } else {
                $('#dvContactMiddleName').addClass('Error');
                ValidationArray.push('dvContactMiddleName');
                ValidateError++;
            }
        } else {
            if (InsName != "Reliance" && ($('#ContactMiddleName').val().length < 2 || checkText($('#ContactMiddleName')) == false)) {
                if ($('#ContactMiddleName').val() == "") {
                    $('#dvContactMiddleName').removeClass('Error');
                } else {
                    $('#dvContactMiddleName').addClass('Error');
                    ValidationArray.push('dvContactMiddleName');
                    ValidateError++;
                }
            } else {
                $('#dvContactMiddleName').removeClass('Error');
            }
        }
        if (InsName != "Bharti") {
            if($('#ContactLastName').val() != "") {
                if ($('#ContactLastName').val().length < 1 || checkTextWithDotSpace($('#ContactLastName')) == false) {
                    $('#dvContactLastName').addClass('Error');
                    ValidationArray.push('ContactLastName');
                    ValidateError++;
                } else {
                    $('#dvContactLastName').removeClass('Error');
                }
            } else {
                $('#dvContactLastName').removeClass('Error');
            }
        } else {
            if($('#ContactLastName').val() != "") {
                if ($('#ContactLastName').val().length < 2 || checkTextWithDotSpace($('#ContactLastName')) == false) {
                    $('#dvContactLastName').addClass('Error');
                    ValidationArray.push('ContactLastName');
                    ValidateError++;
                } else {
                    $('#dvContactLastName').removeClass('Error');
                }
            } else {
                $('#dvContactLastName').removeClass('Error');
            }
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
                    $('#Salutation').addClass('Error');
                    ValidationArray.push('Salutation');
                    ValidationSalutation.push('GenderNotMatch');
                    ValidateError++;
                } else {
                    $('#Salutation').removeClass('Error');
                }
            }
        } else if (SalutationVal.toUpperCase() == "MRS") {
            if (displayGenderBlock != "none") {
                if (GenderVal == "M") {
                    $('#Salutation').addClass('Error');
                    ValidationArray.push('Salutation');
                    ValidationSalutation.push('GenderNotMatch');
                    ValidateError++;
                } else {
                    $('#Salutation').removeClass('Error');
                }
            }
            if (MaritalStatus == "U" || MaritalStatus == "S" || MaritalStatus == "SINGLE") {
                {
                    $('#MaritalStatus').addClass('Error');
                    ValidationSalutation.push('MaritalStatus');
                    ValidateError++;
                }
            }
        } else if (SalutationVal.toUpperCase() == "MS") {
            if (displayGenderBlock != "none") {
                if (GenderVal == "M") {

                    $('#Salutation').addClass('Error');
                    ValidationArray.push('Salutation');
                    ValidationSalutation.push('GenderNotMatch');
                    ValidateError++;

                } else {
                    $('#Salutation').removeClass('Error');
                }
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
                } else if ($('input[name=MaritalStatus]:checked').val() == 'S') {
                    $("#divSingle").removeClass('Error');
                    $("#divSingle").addClass('active');
                    $("#MaritalStatus").val("S");
                } else {
                    $("#divSingle").addClass('Error');
                    $("#divMarried").addClass('Error');
                    ValidateError++;
                }
            }
        }

        if ($('#MaritalStatus').val() == null || $('#MaritalStatus').val() == "0" || $('#MaritalStatus').val() == "") {
            if (!(InsName == 'NewIndia' || InsName == 'Liberty' || InsName == 'Universal')) {
                $('#MaritalStatus').addClass('Error');
                ValidationArray.push('MaritalStatus');
                ValidateError++;
            }
        } else {
            $('#MaritalStatus').removeClass('Error');
        }

        if ($('#DOBofOwner').val() == "") {
            $('#dvDOBofOwner').addClass('Error');
            ValidationArray.push('DOBofOwner');
            ValidateError++;
        } else {
            $('#dvDOBofOwner').removeClass('Error');
        }
        
        if ($('#ContactOccupationId').is(':visible')) {
            if ($('#ContactOccupationId').val() == null || $('#ContactOccupationId').val() == "0" || $('#ContactOccupationId').val() == "") {
                $('#ContactOccupationId').addClass('Error');
                ValidationArray.push('ContactOccupationId');
                ValidateError++;
            } else {
                $('#ContactOccupationId').removeClass('Error');
            }
        }
        if ($('#SelectedQuote_NetPayablePayablePremium').val() - 0 >= 50000) {
            var pan = $("#PANNo").val().toString().toUpperCase();
            var pattern = /[a-zA-Z]{3}[PCHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}$/;
            if (pan.match(pattern) != null) {
                $("#dvPANNo").removeClass('Error');
            } else {
                $("#dvPANNo").addClass('Error');
                ValidationArray.push('SelectedQuote_NetPayablePayablePremium');
                ValidateError++;
            }
        } else if ($("#PANNo").val() != "") {
            var pan = $("#PANNo").val().toString().toUpperCase();
            var pattern = /[a-zA-Z]{3}[PCHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}$/;
            if (pan.match(pattern) != null) {
                $("#dvPANNo").removeClass('Error');
            } else {
                $("#dvPANNo").addClass('Error');
                ValidationArray.push('PANNo');
                ValidateError++;
            }
        }
        if ($("#AadharNo").val() == "") { // || $("#AadharNo").val() == null || $("#AadharNo").val().length < 12) {
            //$("#dvAadharNo").addClass('Error'); ValidationArray.push('AadharNo'); ValidateError++;
            $("#dvAadharNo").removeClass('Error');
        } else {
            var aadhar = $("#AadharNo").val();
            var pattern = /\d{12}/;
            if (aadhar.match(pattern) != null) {
                $("#dvAadharNo").removeClass('Error');
            } else {
                $("#dvAadharNo").addClass('Error');
                ValidateError++;
            }
        }
    }

    if ($('#ContactMobile').val().length == 0 || checkMobile($('#ContactMobile')) == false) {
        $('#dvContactMobile').addClass('Error');
        ValidationArray.push('ContactMobile');
        ValidateError++;
    } else {
        $('#dvContactMobile').removeClass('Error');
    }

    if (!is_email_optional) {
        if ($('#ContactEmail').val().length == 0 || checkEmail($('#ContactEmail')) == false) {
            $('#dvContactEmail').addClass('Error');
            ValidationArray.push('ContactEmail');
            ValidateError++;
        } else {
            $('#dvContactEmail').removeClass('Error');
        }
    }



    //if ($('#Licence').val().length == 0 || checkLicenceNumber($('#Licence')) == false) { $('#dvLicence').addClass('Error'); ValidationArray.push('Licence'); ValidateError++; }
    //else { $('#dvLicence').removeClass('Error'); }

    /*if (VehicleRegistrationType == "corporate" && ValidateError == 0) {
     if (data_sent['TabPersonalInfo'] == false) {
     data_sent['TabPersonalInfo'] = true;
     update_user_data("collapsePersonalInfo");
     }
     return true;
     }*/

    if (ValidateError < 1) {
        if (data_sent['TabPersonalInfo'] == false) {
            data_sent['TabPersonalInfo'] = true;
            update_user_data("collapsePersonalInfo");
        }
        return true;
    } else {
        data_sent['TabPersonalInfo'] = false;
        populate_errordetails(ValidationArray);
        Salution_Error(ValidationSalutation);
        $($('#collapsePersonalInfo').prev().children()[0]).hide();
        return false;
    }
}
function checkCompanyTextWithSpace(input) {
    var pattern = new RegExp('^[a-zA-Z ]+$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function ValidateCompanyD(InsName) {

    ValidateError = 0;
    $('.valerr').remove();
    var ValidationArray = [];
    var ValidationSalutation = [];

    if (VehicleRegistrationType == "corporate") {
        if (document.getElementById('CorporateName').value == "" || (document.getElementById('CorporateName').value.length < 2) || (checkCompanyTextWithSpace(document.getElementById('CorporateName').value) == false)) {
            $('#dvCorporateName').addClass('Error'); ValidationArray.push('CorporateName'); ValidateError++;
        }
        else { $('#dvCorporateName').removeClass('Error'); }

        if ((document.getElementById('GSTNo').value == "" || document.getElementById('GSTNo').value == null)) {
            $("#dvGSTNo").addClass('Error'); ValidationArray.push('GSTNo'); ValidateError++;
        }
        else {
            var gstVal = document.getElementById('GSTNo').value.toUpperCase();
            var gstPattern = new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');
            var patternArray = gstVal.match(gstPattern);
            if (patternArray == null) { $("#dvGSTNo").addClass('Error'); ValidationArray.push('GSTNo'); ValidateError++; }
            else { $("#dvGSTNo").removeClass('Error'); }
        }

        if ($('#CompanyContactPersonName').val() == "" || $('#CompanyContactPersonName').val().length < 2 || checkTextWithSpace($('#CompanyContactPersonName')) == false) {
            $('#dvCompanyContactPersonName').addClass('Error'); ValidationArray.push('CompanyContactPersonName'); ValidateError++;
        }
        else { $('#dvCompanyContactPersonName').removeClass('Error'); }

        if ($('#CompanyContactPersonMobile').val().length == 0 || checkMobile($('#CompanyContactPersonMobile')) == false) {
            $('#dvCompanyContactPersonMobile').addClass('Error'); ValidationArray.push('CompanyContactPersonMobile'); ValidateError++;
        }
        else { $('#dvCompanyContactPersonMobile').removeClass('Error'); }

        if ($('#CompanyContactPersonEmail').val().length == 0 || checkEmail($('#CompanyContactPersonEmail')) == false) {
            $('#dvCompanyContactPersonEmail').addClass('Error'); ValidationArray.push('CompanyContactPersonEmail'); ValidateError++;
        }
        else { $('#dvCompanyContactPersonEmail').removeClass('Error'); }
    }
    else {
        ValidateError = 0;
    }

    if (VehicleRegistrationType == "corporate" && ValidateError == 0) {
        if (data_sent['TabCompanyInfo'] == false) {
            data_sent['TabCompanyInfo'] = true;
            update_user_data("collapseCompanyInfo");
        }
        return true;
    }

    if (ValidateError < 1) {
        if (data_sent['TabCompanyInfo'] == false) {
            data_sent['TabCompanyInfo'] = true;
            update_user_data("collapseCompanyInfo");
        }
        return true;
    }
    else {
        data_sent['TabCompanyInfo'] = false;
        populate_errordetails(ValidationArray);
        $($('#collapseCompanyInfo').prev().children()[0]).hide();
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
    else if (((InsName == "GoDigit") && ($("#RegisteredAddress").val().length > 5)) || ($("#RegisteredAddress").val().length > 25)) {
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

    var hdfcergo_breakin_location_flag = false;
    if (InsName == 'HDFCErgo' && summary.Quote_Request.product_id == 1 && (summary.Quote_Request.is_breakin == 'yes')) {
        if (summary.Quote_Request.vehicle_insurance_subtype != null || summary.Quote_Request.vehicle_insurance_subtype != '') {
            var VIST = (summary.Quote_Request.vehicle_insurance_subtype).split("CH_");
            if (VIST[0] != '0') {
                hdfcergo_breakin_location_flag = true;
            } else {
                hdfcergo_breakin_location_flag = false;
            }
        } else {
            hdfcergo_breakin_location_flag = false;
        }
    } else {
        hdfcergo_breakin_location_flag = false;
    }

    //Dropdown 
    //if ((InsName != 'Tata' && InsName != 'NewIndia' && InsName != 'Royal' && InsName != 'United' && InsName != 'ICICI' && InsName != 'Oriental'  && InsName != 'Edelweiss' && InsName != 'DHFL' && (InsName == 'HDFCErgo' && (summary.Quote_Request.is_breakin == 'yes'))) ||  InsName == 'Cholamandalam') {
    if ((InsName != 'Tata' && InsName != 'NewIndia' && InsName != 'Royal' && InsName != 'United' && InsName != 'ICICI' && InsName != 'Oriental' && InsName != 'Edelweiss' && InsName != 'DHFL' && InsName != 'GoDigit') || InsName == 'Cholamandalam' || hdfcergo_breakin_location_flag) {
        if ($('#ddlRegisteredCityId').val() == "0" || $('#ddlRegisteredCityId').val() == 0 || $('#ddlRegisteredCityId').val() == null) { $('#ddlRegisteredCityId').addClass('Error'); ValidationArray.push('ddlRegisteredCityId'); ValidateError++; }
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
        //if ((InsName != 'Tata' && InsName != 'NewIndia' && InsName != 'Royal' && InsName != 'Oriental' && InsName != 'Edelweiss' && InsName != 'DHFL' && (InsName == 'HDFCErgo' && (summary.Quote_Request.is_breakin == 'yes'))) || InsName == 'Cholamandalam') {
        if ((InsName != 'Tata' && InsName != 'NewIndia' && InsName != 'Royal' && InsName != 'Oriental' && InsName != 'Edelweiss' && InsName != 'DHFL' && InsName != 'GoDigit') || InsName == 'Cholamandalam' || hdfcergo_breakin_location_flag) {
            if ($('#ddlContactCityID').val() == "0" || $('#ddlContactCityID').val() == 0 || $('#ddlContactCityID').val() == null) { $('#ddlContactCityID').addClass('Error'); ValidationArray.push('ddlContactCityID'); ValidateError++; }
            else { $('#ddlContactCityID').removeClass('Error'); }
        }
        //    }

        //if ($('#DistrictName').val() == "") { $('#dvDistrictName').addClass('Error'); ValidationArray.push('DistrictName'); ValidateError++; }
        //else { $('#dvDistrictName').removeClass('Error'); }
    }
    else {
        IsSameAsRegistered(true);
    }

    if (summary.Quote_Request.product_id == 1) {
        if (summary.Quote_Request.vehicle_insurance_subtype != null || summary.Quote_Request.vehicle_insurance_subtype != '') {
            var VIST = (summary.Quote_Request.vehicle_insurance_subtype).split("CH_");
            if (VIST[0] != '0') {
                if (summary.Quote_Request.is_breakin == "yes") {
                    if (InsurerID == 5) {
                        if ($('#ListOfBreakinLocation').val() == "" || $('#ListOfBreakinLocation').val() == "0" || $('#ListOfBreakinLocation').val() == null) {
                            $('#ListOfBreakinLocation').addClass('Error'); ValidationArray.push('ListOfBreakinLocation'); ValidateError++;
                        }
                        else {
                            $('#ListOfBreakinLocation').removeClass('Error');
                        }
                    }
                }
            }
        }
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
function ValidateVADAgent(InsName) {
    ValidateError = 0;
    $('.valerr').remove();
    var ValidationArray = [];

    var pattern = new RegExp('^[a-zA-Z0-9]*$');

    if ($('#TwoWheelerType').val() == "RENEW") {
        if ($('#RegistrationNumberPart1').val() == "" || checkText($('#RegistrationNumberPart1')) == false || $('#RegistrationNumberPart1').val().length < 2) { $('#dvRegistrationNumberPart1').addClass('Error'); ValidateError++; }
        else { $('#dvRegistrationNumberPart1').removeClass('Error'); }

        if (($('#RegistrationNumberPart2').val()).toUpperCase() == 'ZZ') {
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
            else {
                //$('#dvRegistrationNumberPart2').removeClass('Error');
                if ($('#RegistrationNumberPart1').val() == "DL") {
                    // Changes For Removing Validation For 2nd field For (Delhi+Tata) On 15-May-2019 By Pratik
                    if ((InsName == "Reliance" || InsName == "Acko" || InsName == "Tata" || InsName == "IFFCO") && $('#RegistrationNumberPart2').val().length > 1) {
                        $('#dvRegistrationNumberPart1A').removeClass('Error'); $('#dvRegistrationNumberPart2').removeClass('Error');
                    }
                    else {
                        $('#dvRegistrationNumberPart1A').addClass('Error'); ValidationArray.push('RegistrationNumberPart1A');
                        $('#dvRegistrationNumberPart2').addClass('Error'); ValidationArray.push('RegistrationNumberPart2');
                        ValidateError++;
                    }
                }
                else {
                    if ($('#RegistrationNumberPart2').val() != "") {
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
                    else {
                        $('#dvRegistrationNumberPart2').removeClass('Error');
                    }
                }
            }
        }

        if ($('#RegistrationNumberPart2').val() != "" && (pattern.test($('#RegistrationNumberPart2').val()) == false)) {
            $('#dvRegistrationNumberPart2').addClass('Error'); ValidationArray.push('RegistrationNumberPart2'); ValidateError++;
        }
        else { $('#dvRegistrationNumberPart2').removeClass('Error'); }

        if ($('#RegistrationNumberPart3').val() == "" || checkNumeric($('#RegistrationNumberPart3')) == false || $('#RegistrationNumberPart3').val().length < 4 || $('#RegistrationNumberPart3').val() <= 0) { $('#dvRegistrationNumberPart3').addClass('Error'); ValidationArray.push('RegistrationNumberPart3'); ValidateError++; }
        else { $('#dvRegistrationNumberPart3').removeClass('Error'); }

        $('#dvPolicyNumber').removeClass('Error');
    }
    $('#dvEngineNumber').removeClass('Error');
    $('#dvChasisNumber').removeClass('Error');

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
function checkTPPolicyNumber(input) {
    var pattern = new RegExp('^[a-zA-Z0-9-/]+$');
    var dvid = "dvTPPolicyNumber";
    if (pattern.test(input) == false) { $(dvid).addClass('Error'); return false; }
    else { $(dvid).removeClass('Error'); return true; }
}
function ValidateCTPD(InsName) {
    ValidateError = 0;
    $('.valerr').remove();
    var ValidationArray = [];

    if (summary.Quote_Request.vehicle_insurance_subtype == "1OD_0TP") {
        if ((document.getElementById('TPPolicyNumber').value == "") || (checkTPPolicyNumber(document.getElementById('TPPolicyNumber').value) == false)) {
            $('#dvTPPolicyNumber').addClass('Error');
            ValidationArray.push('TPPolicyNumber');
            ValidateError++;
        }
        else {
            $('#dvTPPolicyNumber').removeClass('Error');
        }

        if (document.getElementById('TPStartDate').value == "") { $('#dvTPStartDate').addClass('Error'); ValidationArray.push('TPStartDate'); ValidateError++; }
        else { $('#dvTPStartDate').removeClass('Error'); }

        if (document.getElementById('TPEndDate').value == "") { $('#dvTPEndDate').addClass('Error'); ValidationArray.push('TPEndDate'); ValidateError++; }
        else { $('#dvTPEndDate').removeClass('Error'); }

        if (document.getElementById('TPStartDate').value != "" && document.getElementById('TPEndDate').value != "") {
            var TPStartDate = document.getElementById("TPStartDate").value.split('-');
            TPSDate = TPStartDate[2] + "-" + TPStartDate[1] + "-" + TPStartDate[0];

            var TPEndDate = document.getElementById("TPEndDate").value.split('-');
            TPEDate = TPEndDate[2] + "-" + TPEndDate[1] + "-" + TPEndDate[0];

            var Days = (((new Date(Date.now())).getTime()) - ((new Date(TPEDate)).getTime())) / (1000 * 60 * 60 * 24);

            if (Math.floor(Days) > 1) {
                ValidateError++; $("#ErTPEndDate").show().html("Please Select Proper Policy End Date");
                $('#dvTPEndDate').addClass('Error');
            }
            else { $("#ErTPEndDate").hide().html(""); }

            var TPExpiryDate = TPEndDate[2] + "-" + TPEndDate[1] + "-" + TPEndDate[0];
            //var TPExpiryDate = (parseInt(TPEndDate[2]) - 1) + "-" + TPEndDate[1] + "-" + TPEndDate[0];
            if (((((new Date(TPExpiryDate)).getTime()) - ((new Date(TPSDate)).getTime())) / (1000 * 60 * 60 * 24)) < 365) {
                ValidateError++; $("#ErTPEndDate").show().html("Policy End Date should be 1 year greater than Policy Start Date");
                $('#dvTPEndDate').addClass('Error');
            }
        }

        if (ValidateError < 1) {
            $('#iconCTPD').removeClass('glyphs');
            if (data_sent['TabCurrentTPPolicyInfo'] == false) {
                data_sent['TabCurrentTPPolicyInfo'] = true;
                update_user_data("collapseCurrentTPPolicyInfo");
            }
            return true;
        }
        else {
            data_sent['TabCurrentTPPolicyInfo'] = false;
            populate_errordetails(ValidationArray);
            $($('#collapseCurrentTPPolicyInfo').prev().children()[0]).hide();
            return false;
        }
    }
    else {
        data_sent['TabCurrentTPPolicyInfo'] = true;
        update_user_data("collapseCurrentTPPolicyInfo");
        return true;
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
    if ($EngineNumber.val() == "" || $EngineNumber.val().length < 6 || $EngineNumber.val().length > 20 || pattern.test($EngineNumber.val()) == false || checkText($('#EngineNumber')) == true)

    { $('#dvEngineNumber').addClass('Error'); ValidationArray.push('EngineNumber'); ValidateError++; }
    else { $('#dvEngineNumber').removeClass('Error'); }


    if ($ChasisNumber.val() == "" || $ChasisNumber.val().length < 6 || $ChasisNumber.val().length > 20 || pattern.test($ChasisNumber.val()) == false || checkText($('#ChasisNumber')) == true)

    { $('#dvChasisNumber').addClass('Error'); ValidationArray.push('ChasisNumber'); ValidateError++; }
    else { $('#dvChasisNumber').removeClass('Error'); }

    if (InsName == "United") {
        if ($ChasisNumber.val() == "" || $ChasisNumber.val().length < 3 || $ChasisNumber.val().length > 22 || pattern.test($ChasisNumber.val()) == false || checkText($('#ChasisNumber')) == true)
        { $('#dvChasisNumber').addClass('Error'); ValidationArray.push('ChasisNumber'); ValidateError++; }
        else { $('#dvChasisNumber').removeClass('Error'); }
    }

    //tata 
   
    if (InsName == "Tata") {
        if ($ChasisNumber.val() == "" || $ChasisNumber.val().length !== 17 || pattern.test($ChasisNumber.val()) == false || checkText($('#ChasisNumber')) == true)

        { $('#dvChasisNumber').addClass('Error'); ValidationArray.push('ChasisNumber'); ValidateError++; }
        else { $('#dvChasisNumber').removeClass('Error'); }
    }

    if (summary.Quote_Request.product_id == 1) {
        $("#IsFinancedYes").css('pointer-events', 'cursor');
        $("#IsFinancedNo").css('pointer-events', 'cursor');
        if (summary.hasOwnProperty('Quote_Request') && summary.Quote_Request) {
            if ((summary.Quote_Request.hasOwnProperty('is_oslc') && summary.Quote_Request.is_oslc)) {
                if (summary.Quote_Request.is_oslc === "yes") {
                    $("#IsFinanced").val("True");
                    $("#IsFinancedYes").css('pointer-events', 'none');
                    $("#IsFinancedNo").css('pointer-events', 'none');
                    //$('#IsFinanced').val("True");
                    Select1($('#divfinanced').children()[0]);
                    $("#divinstitution").css('display', 'block');
                    GetFinancerDetails();
                }
            }
        }
    }

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

        if (($('#RegistrationNumberPart2').val()).toUpperCase() == 'ZZ') {
            $('#dvRegistrationNumberPart2').addClass('Error'); ValidationArray.push('RegistrationNumberPart2');
            $('#dvRegistrationNumberPart3').addClass('Error'); ValidationArray.push('RegistrationNumberPart3');
            ValidateError++;
        }
        else {
            $('#dvRegistrationNumberPart2').removeClass('Error');
            $('#dvRegistrationNumberPart3').removeClass('Error');
        }

        //$('#dvRegistrationNumberPart2').removeClass('Error');

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
                //$('#dvRegistrationNumberPart2').removeClass('Error');
                if ($('#RegistrationNumberPart1').val() == "DL") {
                    // Changes For Removing Validation For 2nd field For (Delhi+Tata) On 15-May-2019 By Pratik
                    if ((InsName == "Reliance" || InsName == "Acko" || InsName == "Tata" || InsName == "IFFCO") && $('#RegistrationNumberPart2').val().length > 1) {
                        $('#dvRegistrationNumberPart1A').removeClass('Error'); $('#dvRegistrationNumberPart2').removeClass('Error');
                    }
                    else {
                        $('#dvRegistrationNumberPart1A').addClass('Error'); ValidationArray.push('RegistrationNumberPart1A');
                        $('#dvRegistrationNumberPart2').addClass('Error'); ValidationArray.push('RegistrationNumberPart2');
                        ValidateError++;
                    }
                }
                else {
                    if ($('#RegistrationNumberPart2').val() != "") {
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
                    else {
                        $('#dvRegistrationNumberPart2').removeClass('Error');
                    }
                }
            }
        }


        if ($('#RegistrationNumberPart2').val() != "" && (pattern.test($('#RegistrationNumberPart2').val()) == false)) {
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

        if (summary.Quote_Request.is_policy_exist == "yes" && ($('#PolicyNumber').val() == "" || checkPolicyNumber($('#PolicyNumber')) == false || checkText($('#PolicyNumber')) == true)) { $('#dvPolicyNumber').addClass('Error'); ValidationArray.push('PolicyNumber'); ValidateError++; }

        else { $('#dvPolicyNumber').removeClass('Error'); }
    }

    if ($("#VehicleColor").is(':Visible')) {
        if ($("#VehicleColor").val() == "" || $("#VehicleColor").val() == 0 || $("#VehicleColor").val() == "0") {
            $('#VehicleColor').addClass('Error'); ValidationArray.push('VehicleColor'); ValidateError++;
        }
        else { $('#VehicleColor').removeClass('Error'); }
    }

    if (ValidateError < 1) {
        $('#iconVAD').removeClass('glyphs');
        if (data_sent['TabVehicleAddInfo'] == false) {
            data_sent['TabVehicleAddInfo'] = true;

            //IsSameAsRegistered(true);
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
    if (VehicleRegistrationType != "corporate") {
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
            
            if ($('#NomineeRelationID option:selected').text() == "Spouse") {
                if ($('#MaritalStatus option:selected').text() == "Single" || $('#MaritalStatus option:selected').text() == "UnMarried" || $('#MaritalStatus option:selected').text() == "Unmarried") {
                    $('#NomineeRelationID').addClass('Error'); ValidationArray.push('NomineeRelationID'); ValidateError++;
                   
                }
            }
        }
        if (InsName == "Liberty" && corporate_nominee_flag == "false" && VehicleRegistrationType != "individual") {
            if (data_sent['TabNomineeInfo'] == false) {
                data_sent['TabNomineeInfo'] = true;
                update_user_data("collapseNomineeInfo");
            }
            return true;
        }
    }
    else {
        ValidateError = 0;
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
    //Khushbu   
    var is_Tata = false;
    var vehicle_ins_type = $("#VehicleInsuranceType").val();
    var is_Comp ="no"
    if (summary.Quote_Request.vehicle_insurance_subtype != null) {
        var VIST = (summary.Quote_Request.vehicle_insurance_subtype).split("_");
        if (VIST[0].split('CH') > 0) {
            is_Comp = "yes";
        }
    }

    if (InsName == "Tata" && vehicle_ins_type == "renew" && ProductID == 1 && is_Comp == "yes") {

        var planename = $('#PlanName').text();
        console.log($("#iagree").is(":checked") && ($("#iagreeTATA").is(":checked") || (planename != "GOLD" && planename != "Basic" && planename != "SILVER")))
        if (planename != "GOLD" && planename != "Basic" && planename != "SILVER") {
            is_Tata = true;
        }
    }
    //Somanshu
    var is_Edelweiss = false;
    var vehicle_ins_type = $("#VehicleInsuranceType").val();
    if (InsName == "Edelweiss" && vehicle_ins_type == "renew" && ProductID == 1) {
        if (summary.Addon_Request != null) {
            if (summary.Addon_Request.hasOwnProperty('addon_standalone')) {
                if (summary.Addon_Request.addon_standalone.hasOwnProperty('addon_zero_dep_cover')) {
                    var is_zero_dep = summary.Addon_Request.addon_standalone.addon_zero_dep_cover;
                    if (is_zero_dep === "yes") {
                        is_Edelweiss = true;
                    }
                }
            }
        }
    }
    var is_Dhfl = false;
    var vehicle_ins_type = $("#VehicleInsuranceType").val();
    if (InsName == "DHFL" && vehicle_ins_type == "renew" && ProductID == 1) {
        if (summary.Addon_Request != null) {
            if (summary.Addon_Request.hasOwnProperty('addon_standalone')) {
                if (summary.Addon_Request.addon_standalone.hasOwnProperty('addon_zero_dep_cover')) {
                    var is_zero_dep = summary.Addon_Request.addon_standalone.addon_zero_dep_cover;
                    if (is_zero_dep === "yes") {
                        is_Dhfl = true;
                    }
                }
            }
        }
    }
    if (true) {
        if ($("#iagree").is(":checked") == false) {
            if (summary.Quote_Request.channel == 'GS' || summary.Quote_Request.channel == 'SM' || ([816, 14154, 14155, 14156, 14157, 14158, 17051, 15912, 15253, 11971, 17053].indexOf(summary.Quote_Request.ss_id) > -1 && ProductID === 10) || ([822].indexOf(summary.Quote_Request.ss_id) > -1 && ProductID === 10)) { }
            else {
                $("#lbliagree").addClass('Errorchack');
                ValidateError++;
                return false;
            }
        }
        else { $("#lbliagree").removeClass('Errorchack'); }

        if (is_Tata && (summary.Quote_Request.channel != 'GS' && summary.Quote_Request.channel != 'SM')) {
            if ($("#iagreeTATA").is(":checked") == false) { $("#lbliagreeTATA").addClass('Errorchack'); ValidateError++; return false; }
            else { $("#lbliagreeTATA").removeClass('Errorchack'); }
        }
        if (is_Edelweiss && (summary.Quote_Request.channel != 'GS' && summary.Quote_Request.channel != 'SM')) {
            if ($("#iagreeEDELWEISS").is(":checked") == false) { $("#lbliagreeEDELWEISS").addClass('Errorchack'); ValidateError++; return false; }
            else { $("#lbliagreeEDELWEISS").removeClass('Errorchack'); }
        }
        if (is_Dhfl && (summary.Quote_Request.channel != 'GS' && summary.Quote_Request.channel != 'SM')) {
            if ($("#iagreeDHFL").is(":checked") == false) { $("#lbliagreeDHFL").addClass('Errorchack'); ValidateError++; return false; }
            else { $("#lbliagreeDHFL").removeClass('Errorchack'); }
        }
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
    if ($('input[id=SameAsCommunication]').is(':checked') === true) {
        $('#divCurrentAddress').hide();
        //IsSameAsRegistered(true);
        $('input[id=SameAsCommunication]').prop('checked', true);
    }
    else {
        $('#divCurrentAddress').show();
        $('input[id=SameAsCommunication]').prop('checked', false);
        //IsSameAsRegistered(false);
        $('#ContactAddress').val(request['communication_address_1']);
        $('#Address2').val(request['communication_address_2']);
        $('#Address3').val(request['communication_address_3']);
        $('#dvContactPinCode').val(request['communication_pincode']);
        $('#ContactCityName').val(request['communication_city']);
        $('#StateName').val(request['communication_state']);
        $('#ddlContactCityID').val(request['communication_locality_code']);
    }
    if (request.hasOwnProperty("birth_date"))
    { $('#DOBofOwner').val(request["birth_date"]); }
    if (request.hasOwnProperty("nominee_birth_date"))
    { $('#NomineeDOB').val(request["nominee_birth_date"]); }
    if (!request.hasOwnProperty("is_financed")) {
        $("#IsFinanced").val("False");
    }
    if (summary.Quote_Request.product_id == 1) {
        $("#IsFinancedYes").css('pointer-events', 'cursor');
        $("#IsFinancedNo").css('pointer-events', 'cursor');
        if (summary.hasOwnProperty('Quote_Request') && summary.Quote_Request) {
            if ((summary.Quote_Request.hasOwnProperty('is_oslc') && summary.Quote_Request.is_oslc)) {
                if (summary.Quote_Request.is_oslc === "yes") {
                    $("#IsFinanced").val("True");
                    $("#IsFinancedYes").css('pointer-events', 'none');
                    $("#IsFinancedNo").css('pointer-events', 'none');
                    //$('#IsFinanced').val("True");
                    Select1($('#divfinanced').children()[0]);
                    $("#divinstitution").css('display', 'block');
                    GetFinancerDetails();
                }
            }
        }
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
    "TPPolicyNumber": "tp_policy_number",
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
    "TPStartDate": "tp_start_date",
    "TPEndDate": "tp_end_date",
    "NomineeDOB": "nominee_birth_date",
    "AadharNo": "aadhar",
    "GSTIN": "gst_no",
    "CompanyName": "company_name",
    "hdEmailOptional": "is_email_optional"
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
    "TPStartDate": "Please select TP Start Date",
    "TPEndDate": "Please select TP End Date",
    "ContactMobile": "Please enter valid mobile number",
    "ContactEmail": "Please enter valid email address",
    "MaritalStatus": "Please select Marital Status",
    "PANNo": "Enter Valid Pan no",
    "AadharNo": "Enter number only",
    "ContactOccupationId": "Please select Occupation",
    "RegisteredAddress": "Please enter valid registered Address",
    "DigitRegisteredAddress": "Please enter registered Address upto 5 Characters",
    "RegisteredAddress2": "Please enter valid registered Address 2",
    "RegisteredAddress3": "Please enter valid registered Address 3",
    "RegisteredPinCode": "Enter pincode number",
    "ddlRegisteredCityId": "Please select RegisteredCity",
    "EngineNumber": "Enter valid Engine no.",
    "ChasisNumber": "Enter valid Chassis no.",
    "VehicleColor": "Please select Vehicle Color",
    "FinancerAgreementType": "Please select Financer Agreement Type",
    "InstitutionName": "Enter Institution Name",
    "NomineeRelationID": "Please select valid Nominee Relation",
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
    "TPPolicyNumber": "Please enter valid TP policy no",
    "VehicleColor": "Please select color",
    "FinancerAgreementType": "Please Select Financer type",
    "GSTIN": "Please Enter Valid GST Number",
    "CompanyName": "Please Valid Company Name",
    "Licence": "Please Enter Licence Number",
    "CorporateName": "Please Valid Company Name",
    "GSTNo": "Please Enter Valid GST Number",
    "CompanyContactPersonName": "Please enter valid Company Contact Person name",
    "CompanyContactPersonMobile": "Please enter valid mobile number",
    "CompanyContactPersonEmail": "Please enter valid email address",
    "ListOfBreakinLocation": "Please select breakin location",
    "TataChassisNo": "Enter Chassis no should be 17 digit.",
};

function populate_errordetails(ValidationArray) {
    var i, j;
    var result = [];
    $.each(ValidationArray, function (i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    ValidationArray = result;

    for (i = 0; i < ValidationArray.length; ++i) {
        if (InsurerID === 44 && RegisteredAddress.value.length > 5 && ValidationArray[i] === "RegisteredAddress") {
            var err = "<div class='valerr' style='color:red'>" + error_msg['DigitRegisteredAddress'] + "</div>";
        } else if (InsurerID === 11   && ValidationArray[i] === "ChasisNumber" && $('#ChasisNumber').val.length !== 17) {
            var err = "<div class='valerr' style='color:red'>" + error_msg['TataChassisNo'] + "</div>";
        }
        else {
            var err = "<div class='valerr' style='color:red'>" + error_msg[ValidationArray[i]] + "</div>";
        }


        if ($('#' + ValidationArray[i]).val() != "" || $('#' + ValidationArray[i]).val() != 0) {
            $('#' + ValidationArray[i]).next('.valerr').hide();
        }
        if ($('#' + ValidationArray[i]).get(0).tagName == "SELECT") {
            //$('#' + ValidationArray[i]).append(err);
            $("<div class='valerr' style='color:red;margin-top:5px;'>" + error_msg[ValidationArray[i]] + "</div>").insertAfter($('#' + ValidationArray[i]));
        }
        if ($('#' + ValidationArray[i]).get(0).tagName == "INPUT") {
            $('#dv' + ValidationArray[i]).parent().append("");
            $('#dv' + ValidationArray[i]).parent().append(err);
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
    if ($(this).attr('id') === "GSTNo") {
    }
    else {
        string = string.replace(/^0+/, '').replace(/  +/g, ' ');
    }
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
        "ProductID": ProductID,
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
    var VerifyOTPURL = '/otp_verify?CRN=' + CRN + '&otp=' + OTP;
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

function GetUrl() {
    var url = window.location.href;
    var newurl;
    if (url.indexOf("www.policyboss.com") > -1 || url.indexOf("cloudfront") > -1) {
        newurl = "https://www.policyboss.com";
    } else if (url.indexOf("qa.policyboss.com") > -1) {
        newurl = "http://qa.policyboss.com";
    } else if (url.indexOf("localhost") > -1) {
        newurl = "http://localhost:50111";
    }
    return newurl;
}


//Khushbu Gite 23072019 Proposal Popup.
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

var insurer_staticlist = [5, 2, 6, 9]; //
var quote_res = [];
var proposal_res = [];
var is_proposalError = false;
var selected_insurer = "";
var selected_insurer_id;
var _urlLink = "";
function proposalError() {
    $('.CRN').text("CRN : " + CRN);
    var daten = new Date();
    daten = (daten.toString()).split("GMT");
    var quotedate = (new Date(summary.Summary.Created_On).toString()).split("GMT")[0];
    $('.ErrInsurerName').text(summary.PB_Master.Insurer.Insurer_Name);
    $('.ErrQuoteOn').text("Quote On : " + quotedate);
    $('.ErrDateTime').text("Error On : " + daten[0]);
    //$('.Insu_errAlert').hide();
    $('.Insurer_list').empty();
    var data1 = { "search_reference_number": SRN };
    var obj_horizon_data = Horizon_Method_Convert("/report/getProposalInsurer_Master", data1, "POST");
    $.ajax({
        type: "POST",
        data: JSON.stringify(obj_horizon_data['data']),
        url: obj_horizon_data['url'],
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (response) {
            is_proposalError = true;
            console.log(response);
            proposal_res = response;
            if (proposal_res.length > 0) {
                //insurer_staticlist.splice($.inArray(proposal_res, insurer_staticlist), 1);
                //insurer_staticlist = insurer_staticlist.filter(item => !proposal_res.includes())
                insurer_staticlist = insurer_staticlist.filter(item => !proposal_res.includes(item['']))
                console.log(insurer_staticlist);
                Get_Premium_Data();
            } else {
                Get_Premium_Data();
            }
        },
        error: function (response) { }
    });
}
var err_category = {
    "LM206": "Premium mismatch (Premium available on quotation page and on proposal page is different )",
    "LM255": "Pincode not available",
    "LM237": "Financial institute not available",
    "LM002": "Technical error on online payment"
}
function Raise_Ticket() {

    var error_specification = err_category[error_response['Error_Code']];
    error_specification = error_specification === undefined ? "Technical error on online payment" : error_specification;
    

    var obj_horizon_data = Horizon_Method_Convert('/ticket_exist/' + CRN + '/' + error_specification, '', "GET");
    var ss_id = parseInt($("#SupportsAgentID").val());
    $.ajax({
        type: "GET",
        url: obj_horizon_data['url'],
        dataType: "json",
        success: function (data) {
            var response = data;
            var result = response['result'];
            if (result === 1 && response['Status'] === "Success") {
                $('.ticketAlert').show();
                //$('#div_ticket').show();
                $('#txt_ticket_res h4').text(response['Msg']);
                $('#spn_Category').text(response['Category']);
                $('#spn_SubCategory').text(response['SubCategory']);
                $('#spn_ticket_id').text(response['Ticket_Id']);
                $('#spn_created_on').text(response['Created_On']);
                $('#spn_CRN').text(response['CRN']);
                $('#spn_tranaction_on').text(response['Transaction_On']);
            } else {
                var objdata = {
                    "Ticket_Id": "",
                    "Product": $("#ProductID").val() == "1" ? "CAR" : "BIKE",
                    "Category": "Proposal",
                    "SubCategory": error_specification,
                    "Proposal_Error_Msg": error_specification,
                    "Status": "Open",
                    "ss_id": ss_id,
                    "Remark": "",
                    "Agent_Email": $('#ContactEmail').val(),
                    "CRN": CRN,
                    "Created_By": $('#ContactName').val() + " " + $('#ContactLastName').val(),
                    "Mobile_No": $('#ContactMobile').val(),
                    "Vehicle_No": $('#RegistrationNumberPart1').val() + $('#RegistrationNumberPart1A').val() + $('#RegistrationNumberPart2').val() + $('#RegistrationNumberPart3').val(),
                    "fba_id": fba_id,
                    "Is_Customer": ss_id > 0 ? false : true,
                    "channel": summary.Quote_Request['channel'],
                    "subchannel": summary.Quote_Request['subchannel'],
                    "CRN_fba_id": summary.Quote_Request['fba_id'],
                    "CRN_owner": summary.Quote_Request['ss_id'],
                    "Transaction_On": summary.Summary["Created_On"],
                    "Source": "policyboss",
                    "rm_email_id": summary.Quote_Request["posp_reporting_email_id"] !== "0" ? summary.Quote_Request["posp_reporting_email_id"] : ""
                };

                console.log(objdata)
                //var obj_horizon_data = Horizon_Method_Convert("/tickets/raiseticket", objdata, "POST");
                var obj_horizon_data = Horizon_Method_Convert("/report/raiseticket", objdata, "POST");
                $.ajax({
                    type: "POST",
                    data: JSON.stringify(obj_horizon_data['data']),
                    url: obj_horizon_data['url'],
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    success: function (response) {

                        console.log(response);
                        $('.ticketAlert').show();
                        //$('#div_ticket').show();
                        $('#txt_ticket_res h4').text(response['Msg']);
                        $('#spn_Category').text(response['Category']);
                        $('#spn_SubCategory').text(response['SubCategory']);
                        $('#spn_ticket_id').text(response['Ticket_Id']);
                        $('#spn_created_on').text(response['Created_On']);
                        if (response['CRN'] != "") {
                            $('#cls_CRN').show();
                            $('#spn_CRN').text(response['CRN']);
                            $('#spn_tranaction_on').text(response['Transaction_On']);
                        } else {
                            $('#cls_CRN').hide();
                        }

                    }
                });

            }
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
    }
    else {
        return 0;
    }
}
function Get_Premium_Data() {
    var data1 = { "search_reference_number": SRN };
    var obj_horizon_data = Horizon_Method_Convert("/quote/premium_list_db", data1, "POST");
    $.ajax({
        type: "POST",
        data: JSON.stringify(obj_horizon_data['data']),
        url: obj_horizon_data['url'],
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (response) {
            console.log(response);
            quote_res = response;
            quote_res['Response'] = quote_res['Response'].filter(item => !proposal_res.includes(item['Insurer_Id']))

            VehicleInsuranceSubtype = quote_res['Summary']['Request_Product']['vehicle_insurance_subtype'];
            var productid = quote_res['Summary']['Request_Core']['product_id'];
            if (quote_res != "") {
                $.each(quote_res['Response'], function (index, value) {
                    //$.each(insurer_staticlist, function (index1, value1) {
                    if (value['Error_Code'] == "") {

                        // if (value["Insurer_Id"] != InsurerID) {
                        // if (value["Insurer_Id"] !== value1) {
                        selected_insurer = value.Insurer.Insurer_Name;
                        selected_insurer_id = value.Insurer_Id;
                        var addonName = addonname(value).split('/')[0];
                        var addonAmount = addonname(value).split('/')[1];
                        var Netpremium = parseInt(value['Premium_Breakup']['net_premium'] + parseInt(addonAmount));
                        var servicetax = (Netpremium * 0.18);
                        var FinalPremium = Math.round(Netpremium + servicetax);
                        $('.Insurer_list').append('<div style="border-right:1px solid #c9c9c9;box-shadow: 0px 0px 5px 1px #c9c9c9;margin:5px;height:85px;" id="divproposal' + value["Insurer_Id"] + '">'
                     + '<div class="layout_container">'
                     + '<div class="Insurer_logoimg"><img id="insurer_logo" src="https://www.policyboss.com/Images/insurer_logo/' + value['Insurer']['Insurer_Logo_Name'] + '" class="img-responsive"></div>'
                     + '<div style="display:grid;grid-template-columns: 1fr;">'
                     + '<div class="buybtn_box"><button onClick="redirect(\'' + value["Service_Log_Unique_Id"] + '\',\'' + productid + '\',\'' + selected_insurer + '\')">₹ ' + rupee_format(FinalPremium) + '</button></div>'
                     + '<div class="premium_breakup_logo">'
                     + '<a href="#" class="PremiumBreakup PB_' + value["Insurer_Id"] + '" data-toggle="modal" data-target="#fsModal" role="button" '
                     + '        basicowndamage="' + value['Premium_Breakup']['own_damage']['od_basic'] + '"'
                     + '        premium="' + value['Premium_Breakup']['own_damage']['od_final_premium'] + '" nonelectricalaccessoriespremium="' + value['Premium_Breakup']['own_damage']['od_non_elect_access'] + '" electricalacessoriespremium="' + value['Premium_Breakup']['own_damage']['od_elect_access'] + '" '
                     + '        oddiscount="' + value['Premium_Breakup']['own_damage']['od_disc'] + '" oddiscountper="' + value['Premium_Rate']['own_damage']['od_disc'] + '" bifuelkitpremium="' + value['Premium_Breakup']['own_damage']['od_cng_lpg'] + '" antitheftdiscount="' + value['Premium_Breakup']['own_damage']['od_disc_anti_theft'] + '" '
                     + '        voluntarydeductions="' + value['Premium_Breakup']['own_damage']['od_disc_vol_deduct'] + '" automobileassociationmembershippremium="' + value['Premium_Breakup']['own_damage']['od_disc_aai'] + '" '
                     + '        agediscount="0.0" professiondiscount="0.0" underwriterloading="' + value['Premium_Breakup']['own_damage']['od_loading'] + '" ownpremises="' + value['Premium_Breakup']['own_damage']['od_disc_own_premises'] + '" totalodpremium="' + value['Premium_Breakup']['own_damage']['od_final_premium'] + '" '
                     + '        thirdpartyliablitypremium="' + value['Premium_Breakup']['liability']['tp_basic'] + '" personalaccidentcoverforunammedpassenger="' + value['Premium_Breakup']['liability']['tp_cover_unnamed_passenger_pa'] + '" personalaccidentcoverfornamedpassenger="' + value['Premium_Breakup']['liability']['tp_cover_named_passenger_pa'] + '" '
                     + '        personalaccidentcoverforownerdriver="' + value['Premium_Breakup']['liability']['tp_cover_owner_driver_pa'] + '" personalaccidentcoverforpaiddriver="' + value['Premium_Breakup']['liability']['tp_cover_paid_driver_pa'] + '" legalliabilitypremiumforpaiddriver="' + value['Premium_Breakup']['liability']['tp_cover_paid_driver_ll'] + '" '
                     + '        bifuelkitliabilitypremium="' + value['Premium_Breakup']['liability']['tp_cng_lpg'] + '" nfppremium="' + value['Premium_Breakup']['liability']['tp_cover_non_fairing_paying_passenger'] + '" fppremium="' + value['Premium_Breakup']['liability']['tp_cover_fairing_paying_passenger'] + '" otheruses="' + value['Premium_Breakup']['liability']['tp_basic_other_use'] + '" '
                     + '        imt23="' + value['Premium_Breakup']['liability']['tp_cover_imt23'] + '" personalaccidentcoverforemployee="' + value['Premium_Breakup']['liability']['tp_cover_emp_pa'] + '" totalliabilitypremium="' + value['Premium_Breakup']['liability']['tp_final_premium'] + '" totalpremium="' + Netpremium + '" '
                     + '        outstandingloancover="' + value['Premium_Breakup']['liability']['tp_cover_outstanding_loan'] + '" conductor_ll="' + value['Premium_Breakup']['liability']['tp_cover_conductor_ll'] + '" coolie_ll="' + value['Premium_Breakup']['liability']['tp_cover_coolie_ll'] + '" cleaner_ll="' + value['Premium_Breakup']['liability']['tp_cover_cleaner_ll'] + '" '
                     + '        geographicalareaext="' + value['Premium_Breakup']['liability']['tp_cover_geographicalareaext'] + '" additionaltowing="' + value['Premium_Breakup']['liability']['tp_cover_additionaltowing'] + '" fibreglasstankfitted="' + value['Premium_Breakup']['liability']['tp_cover_fibreglasstankfitted'] + '" '
                     + '        servicetax="' + servicetax + '" netpayablepayablepremium="' + FinalPremium + '" insurername="' + value['Insurer']['Insurer_Name'] + '" quoteid="' + value['mi_quote_id'] + '" '
                     + '        noclaimbonus="' + value['Premium_Breakup']['own_damage']['od_disc_ncb'] + '" noclaimbonuspercentage="' + value['Premium_Rate']['own_damage']['od_disc_ncb'] + '" servicelogid="' + value['Plan_List']['0']['Service_Log_Id'] + '" fair_price="___fair_price___" '
                     + '        idv="' + value['LM_Custom_Request']['vehicle_expected_idv'] + '" idvmin="' + value['LM_Custom_Request']['vehicle_min_idv'] + '" idvmax="' + value['LM_Custom_Request']['vehicle_max_idv'] + '" addonpremium="' + addonAmount + '" addonname="' + addonName + '" insurerid="' + value['Insurer_Id'] + '"  >'
                     + '         <img src="/Images/lmdesign/ico-breakup.png" title="Premium Breakup">'
                     + '     </a></div>'
                     + "    </div>"
                     + "     </div>"
                     + "</div>")
                        //}
                    }
                    // }
                    // })
                })
                if ($('.Insurer_list').html() == "") {
                    $('#err_msgtxt').text("");
                    $('#err_msgtxt').text("Please Wait.IT Team will check the issue and revert.");
                }
            }
        },
        error: function (response) { }
    });

}

function addonname(response) {

    var addonpremium = "";
    var addonamount = 0;
    $.each(PlanAddonList, function (index, value) {
        $.each(response['Addon_List'], function (index1, value1) {
            if (index == index1) {
                addonamount += value1;
                addonpremium += addon_list[index] + "-" + value1 + "+"
            }
        })
    })
    return addonpremium + "/" + addonamount;

}

function redirect(ARN, product_id, Insurer_name) {
    _urlLink = ((parseInt(product_id) == 10) ? "/two-wheeler-insurance/" : "/car-insurance/") + "buynow/" + ClientID + "/" + ARN;
    ((parseInt(ClientID) == 3) ? (_urlLink = _urlLink + "/POSP/0") : (_urlLink = _urlLink + "/NonPOSP/0"));
    console.log("payment_link_send");

    if ($('#SupportsAgentID').val() != "" && $('#SupportsAgentID').val() != "0") {
        payment_link_send2(ARN, Insurer_name)
    } else {
        window.location.href = _urlLink;
    }
}

function payment_link_send2(api_reference_number, Insurer_name) {

    console.log("payment_link_send");

    var _payLink = "";
    //_payLink = ((parseInt($("#ProductID").val()) == 10) ? "/buynowprivatecar/" : "/buynowtwowheeler/") + ClientID + "/" + ARN;
    _payLink = ((parseInt($("#ProductID").val()) == 10) ? "/two-wheeler-insurance/" : "/car-insurance/") + "buynow/" + ClientID + "/" + api_reference_number;
    ((parseInt(ClientID) == 3) ? (_payLink = _payLink + "/POSP/0") : (_payLink = _payLink + "/NonPOSP/0"));
    var ProdID = parseInt($("#ProductID").val());
    var data = {
        contact_name: $('#ContactName').val(),
        last_name: $('#ContactLastName').val(),
        phone_no: $('#ContactMobile').val(),
        customer_email: $('#ContactEmail').val(),
        agent_name: summary.Quote_Request.posp_first_name + " " + (summary.Quote_Request.posp_middle_name == "" || summary.Quote_Request.posp_middle_name == 0 ? "" : summary.Quote_Request.posp_middle_name + " ") + summary.Quote_Request.posp_last_name,
        agent_mobile: summary.Quote_Request.posp_mobile_no,
        agent_email: summary.Quote_Request.posp_email_id,
        crn: $('#CustomerReferenceID').val(),
        product_name: ProdID == 12 ? "CV" : (ProdID == 10 ? "Bike" : "Car"),
        insurer_name: Insurer_name,
        insurer_id: summary.PB_Master.Insurer.Insurer_ID,
        vehicle_text: $('#TwoWheelerVariant').val(),
        final_premium: $("#SelectedQuote_TotalPremium").val(),
        payment_link: GetUrl() + _payLink,
        //registration_no : _registrationNo,
        search_reference_number: summary.Summary.Request_Unique_Id_Core,
        salutation_text: $("#Salutation option:selected").text(),
        insurance_type: $("#TwoWheelerType").val(),
        client_id: ClientID,
        api_reference_number: api_reference_number,
        CustomerReferenceID: $('#CustomerReferenceID').val(),
        quote_preference: "optional"
        //request_json: JSON.stringify(request),
    }
    console.log(JSON.stringify(data));
    var obj_horizon_data = Horizon_Method_Convert("/quote/send_payment_link", data, "POST");
    $.ajax({
        type: "POST",
        data: JSON.stringify(obj_horizon_data['data']),
        url: obj_horizon_data['url'],
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (response) {
            console.log(response);
            $("#CustomerDiv").hide();
            if (response.hasOwnProperty('Status')) {
                if (response.Status == "SUCCESS") {
                    window.location.href = _urlLink;
                } else if (response.Status == "FAIL") {

                }
            }
            else {
                window.location.href = _urlLink;
            }

        },
        error: function (request, status, errorThorwn) {
            console.log(request);
            console.log(status);
        }
    });
    //$("#CustomerDiv").hide();
    //$("#AgentDiv").show();
}

$('.noInurerList_closebtn').click(function () {
    //$('.Insu_errAlert').hide();
    if (spinnerVisible) {
        $("div#spinner").fadeOut("fast");
        spinnerVisible = false;
        //if (ClientID == 0) {
        //    $('#PaymentLink').prop({ 'disabled': false, 'value': 'Online Payment' });
        //}
        $('#PaymentLink').prop({ 'disabled': false, 'value': 'Online Payment' });
    }
});

var PremiumArray = ['sBasicOwnDamage', 'ODDiscount', 'ODDiscount1', 'BiFuelKitPremium', 'AutomobileAssociationMembershipPremium', 'UnderwriterLoading',
'NonElectricalAccessoriesPremiumNEA', 'ElectricalAcessoriesPremium', 'AntiTheftDiscount', 'PersonalAccidentCoverForNamedPassenger',
'PersonalAccidentCoverForPaidDriver', 'VoluntaryDeductions', 'ThirdPartyPropertyDamage', 'NoClaimBonus', 'TotalLiabilityPremium', 'ThirdPartyLiablityPremium',
'PersonalAccidentCoverForOwnerDriver', 'LegalLiabilityPremiumForPaidDriver', 'PersonalAccidentCoverForUnammedPassenger', 'BiFuelKitLiabilityPremium', 'AddOnPremium',
'OwnPremises', 'NFPPremium', 'FPPremium', 'OtherUses', 'IMT23', 'PersonalAccidentCoverForEmployee', 'OutstandingLoanCover', 'Conductor_Ll', 'Coolie_Ll', 'Cleaner_Ll',
'GeographicalAreaExt', 'AdditionalTowing', 'FibreGlassTankFitted']
function PremiumDetailsValues() {
    for (var i = 0; i < PremiumArray.length; i++) {
        if ($("#" + PremiumArray[i]).text() == "0" || $("#" + PremiumArray[i]).text() == "" || ($("#" + PremiumArray[i]).text()).indexOf("___") > -1) { $("#" + PremiumArray[i]).parent().hide(); }
        else { $("#" + PremiumArray[i]).parent().show(); }
    }
    if ($("#ODPAC").val() == 0) {
        //$(".ODPACDiv").hide();
    }
}

$(document).on("click", ".PremiumBreakup", function () {

    SelectedInsId = $(this).attr("insurerid");
    if (SelectedInsId == 11 && ($("#NonElectricalAccessories").val() - 0 > 0)) { $("#lblBasicOwnDamage").text("Basic OD + NEA Premium"); }
    else { $("#lblBasicOwnDamage").text("Basic OD"); }
    $(".Name").text(Name);
    // if (EmailVal.indexOf('testpb.com') > -1) { $("#EmailID").val(""); }
    // else { $("#EmailID").val(EmailVal); }

    $("#spanPremium").html($(this).attr("Premium"));
    $("#sBasicOwnDamage, .sBasicOwnDamage").html(Math.round($(this).attr("BasicOwnDamage")));
    $("#NonElectricalAccessoriesPremium").html(Math.round($(this).attr("nonelectricalaccessoriespremium")));
    $("#ElectricalAcessoriesPremium, .ElectricalAcessoriesPremium").html(Math.round($(this).attr("electricalacessoriespremium")));
    $("#ODDiscount1, .ODDiscount").html(Math.round($(this).attr("ODDiscount")));
    $("#ODDiscountper").html(Math.round($(this).attr("ODDiscountper")));
    $("#BiFuelKitPremium, .BiFuelKitPremium").html(Math.round($(this).attr("BiFuelKitPremium")));
    $("#AntiTheftDiscount, .AntiTheftDiscount").html(Math.round($(this).attr("AntiTheftDiscount")));
    $("#VoluntaryDeductions, .VoluntaryDeductions").html(Math.round($(this).attr("VoluntaryDeductions")));
    $("#AutomobileAssociationMembershipPremium, .AutomobileAssociationMembershipPremium").html(Math.round($(this).attr("AutomobileAssociationMembershipPremium")));
    $("#AgeDiscount").html(Math.round($(this).attr("AgeDiscount")));
    $("#ProfessionDiscount").html(Math.round($(this).attr("ProfessionDiscount")));
    $("#UnderwriterLoading, .UnderwriterLoading").html(Math.round($(this).attr("UnderwriterLoading")));
    $("#OwnPremises, .OwnPremises").html(Math.round($(this).attr("OwnPremises")));
    $("#TotalODPremium, .TotalODPremium").html(Math.round($(this).attr("TotalODPremium")));

    if (VehicleInsuranceSubtype != null || VehicleInsuranceSubtype != "") {
        var VIST = (VehicleInsuranceSubtype).split("CH_")
        if (VIST[0] == 0) {
            $(".TotalODPremiumDisplay").html("N.A.");
        }
    }
    else { }

    $("#ThirdPartyLiablityPremium, .ThirdPartyLiablityPremium").html(Math.round($(this).attr("ThirdPartyLiablityPremium")));
    $("#PersonalAccidentCoverForUnammedPassenger, .PersonalAccidentCoverForUnammedPassenger").html(Math.round($(this).attr("PersonalAccidentCoverForUnammedPassenger")));
    $("#PersonalAccidentCoverForNamedPassenger, PersonalAccidentCoverForNamedPassenger").html(Math.round($(this).attr("PersonalAccidentCoverForNamedPassenger")));
    $("#PersonalAccidentCoverForOwnerDriver, .PersonalAccidentCoverForOwnerDriver").html(Math.round($(this).attr("PersonalAccidentCoverForOwnerDriver")));
    $("#PersonalAccidentCoverForPaidDriver, .PersonalAccidentCoverForPaidDriver").html(Math.round($(this).attr("PersonalAccidentCoverForPaidDriver")));
    $("#LegalLiabilityPremiumForPaidDriver, .LegalLiabilityPremiumForPaidDriver").html(Math.round($(this).attr("LegalLiabilityPremiumForPaidDriver")));
    $("#BiFuelKitLiabilityPremium, .BiFuelKitLiabilityPremium").html(Math.round($(this).attr("BiFuelKitLiabilityPremium")));
    $("#NFPPremium, .NFPPremium").html(Math.round($(this).attr("NFPPremium")));
    $("#FPPremium, .FPPremium").html(Math.round($(this).attr("FPPremium")));
    $("#OtherUses, .OtherUses").html($(this).attr("OtherUses"));
    $("#IMT23, .IMT23").html($(this).attr("IMT23"));
    $("#Conductor_Ll, .Conductor_Ll").html($(this).attr("Conductor_Ll"));
    $("#Coolie_Ll, .Coolie_Ll").html($(this).attr("Coolie_Ll"));
    $("#Cleaner_Ll, .Cleaner_Ll").html($(this).attr("Cleaner_Ll"));
    $("#GeographicalAreaExt, .GeographicalAreaExt").html($(this).attr("GeographicalAreaExt"));
    $("#AdditionalTowing, .AdditionalTowing").html($(this).attr("AdditionalTowing"));
    $("#FibreGlassTankFitted, .FibreGlassTankFitted").html($(this).attr("FibreGlassTankFitted"));
    $("#PersonalAccidentCoverForEmployee, .PersonalAccidentCoverForEmployee").html($(this).attr("PersonalAccidentCoverForEmployee"));
    if (SelectedInsId == 2) {
        $("#OutstandingLoanCover, .OutstandingLoanCover").html($(this).attr("OutstandingLoanCover"));
    } else {
        $("#OutstandingLoanCover, .OutstandingLoanCover").html(0);
    }

    $("#TotalLiabilityPremium, .TotalLiabilityPremium").html(Math.round($(this).attr("TotalLiabilityPremium")));
    $("#TotalPremium, .TotalPremium").html(Math.round($(this).attr("TotalPremium")));
    $("#TotalPremiumFinal").html(Math.round($(this).attr("TotalPremium")));
    $("#ServiceTax, .ServiceTax").html(Math.round($(this).attr("ServiceTax")));
    $("#ServiceTaxFinal").html(Math.round($(this).attr("ServiceTax")));

    $("#NetPayablePayablePremium, .NetPayablePayablePremium").html($(this).attr("NetPayablePayablePremium"));
    $("#NetPayablePayablePremiumFinal").html($(this).attr("NetPayablePayablePremium"));

    $("#InsurerNameTitle, .InsurerNameTitle").html($(this).attr("InsurerName"));
    $("#ServiceLogId").html($(this).attr("ServiceLogId"));
    $("#NoClaimBonusPercentage").html(Math.round($(this).attr("noClaimBonusPercentage")));
    $("#NoClaimBonusPercentage").html($(this).attr("noClaimBonusPercentage"));
    $("#NoClaimBonus, .NoClaimBonus").html($(this).attr("noClaimBonus"));
    $("#AddOnPremium, .AddOnPremium").html($(this).attr("addonpremium"));
    $("#AddOnName").html($(this).attr("addonname"));
    $("#NonElectricalAccessoriesPremiumNEA, .NonElectricalAccessoriesPremiumNEA").html($(this).attr("nonelectricalaccessoriespremium"));
    $("#IDV, .IDV").html($(this).attr("idv"));
    $(".CRN1").html($('#CustomerReference_ID').text());
    $("#Variant1").html($('#_Vehicle_Variant').text());
    $('#fair_price').html($(this).attr('fair_price'));

    var _AddOnPremium = $(this).attr("addonpremium");
    if (_AddOnPremium > 0) { $("#divAddOnPremium").css("display", "block"); }
    else { $("#divAddOnPremium").css("display", "none"); }

    if ($(this).attr("insurerid") == 9 && $(this).attr("ODDiscount") == "0") { $("#odDiscount").hide(); }
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

    if ($(this).attr("addonpremium") > 0) {
        var tempAd = $(this).attr("addonname").split("+");
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

    if ($(this).attr("addonpremium") > 0) {
        $("#pGrossPremium").css("display", "block");
        $("#GrossPremium").html((parseFloat(_AddOnPremium) + parseFloat($(this).attr("TotalPremium"))));
    } else { $("#pGrossPremium").css("display", "none"); }
    var selectedQuoteId = $(this).attr("quoteid");
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
});



