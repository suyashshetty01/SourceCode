function GetLTPostOfficeLtg(Pincode) {
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
    $("#Gender").val("M");
}
function SelectF(ID) {
    var PrevId = $("#" + ID.id).prev('.btn').attr('id');
    $("#" + ID.id).addClass('btn-primary active').removeClass('btn-default Error');
    $("#" + PrevId).addClass('btn-default').removeClass('btn-primary active Error');

    $("#" + ID.id).find('input:radio').attr('checked', true);
    $("#" + PrevId).find('input:radio').attr('checked', false);
    $("#Gender").val("F");
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
$('#ContactMobile').keypress(function () { return this.value.length < 10 })
$('#AadharNo').keypress(function () { return this.value.length < 12 })
$('.Pincode').keypress(function () { return this.value.length < 6 })
$('#RegistrationNumberPart1A').keypress(function () { return this.value.length < 3 })
$('#RegistrationNumberPart2').keypress(function () { return this.value.length < 2 })
$('#RegistrationNumberPart3').keypress(function () { return this.value.length < 4 })
$('.PAN').keypress(function () { return this.value.length < 10 })
$('.Address').keypress(function () { return this.value.length < 25 });

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
    var pattern = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
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
function checkInstName(input) {
    var pattern = new RegExp('^[a-zA-Z\-& .,]+$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}

//Sending data to api only once
var data_sent = {
    'TabPersonalInfo': false,
    'TabAddInfo': false,
    'TabVehicleAddInfo':false,
    'TabNomineeInfo': false,
    'PaymentLink': false
}

// Validating And Sliding Sections
function GetInsurerName(id) {
    var InsurerName;
    console.log(id);
    switch (id) {
        case 1: InsurerName = "Bajaj"; break;
        case 2: InsurerName = "Bharti"; break;
        case 4: InsurerName = "FG"; break;
        case 5: InsurerName = "HDFCErgo"; break;
        case 6: InsurerName = "ICICI"; break;
        case 7: InsurerName = "IFFCO"; break;
        case 9: InsurerName = "Reliance"; break;
        case 10: InsurerName = "Royal"; break;
        case 11: InsurerName = "Tata"; break;
        case 12: InsurerName = "NewIndia"; break;
        case 19: InsurerName = "Universal"; break;
        case 30: InsurerName = "Kotak"; break;
        case 33: InsurerName = "Liberty"; break;        
    }
    $('#InsurerName').val(InsurerName);
}
function ValidateSection(SlideNum, IsCustomer) {
    var InsurerName = $('#InsurerName').val();
    if (IsCustomer == "True") {
         switch (SlideNum) {
                case "1": return true; break;
                case "2": return ValidateCD(InsurerName);   break;//return true; break; //
                case "3": return ValidateAD(InsurerName);   break;//return true; break; //
                case "4": return ValidateVAD(InsurerName);  break;//return true; break; //
                case "5": return ValidateND(InsurerName);   break;//return true; break; //
                case "6": return ValidateTC(InsurerName);   break;//return true; break; //

                //case "1": return true; break;
                //case "2": return true; break;
                //case "3": return true; break;
                //case "4": return true; break;
                //case "5": return true; break;
                //case "6": return true; break;
         }
    }
    else {
        switch (SlideNum) {
            case "1": return true; break;
            case "2": return ValidatePersonalInformation(); break;//return true; break; //
            case "3": return ValidatePersonalInformation(); break;//return true; break; //
            case "4": return ValidatePersonalInformation(); break;//return true; break; //
            case "5": return ValidatePersonalInformation(); break;//return true; break; //
            case "6": return ValidatePersonalInformation(); break;//return true; break; //
        }
    }   
}
function ValidateSection1(id) {
    var InsurerName = $('#InsurerName').val();
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

    if ($('#FinalSubmit').val() == "1") {
        showProgress();
        $('#PaymentLink').attr("disabled", "disabled");
        $("#PaymentLink").prop('value', '   ...   ');
        $('#ProgressStatus').html('');
        $('#ProgressStatus').append("Sending mail to customer ...");
        var Sal = $("#Salutation option:selected").text();
        $("#hdnSalutation").val(Sal);
        setTimeout(function () { document.forms[0].submit(); }, 5000);
        return false;
    }
}
function ValidatePersonalInformation() {
    Err = 0;
    if ($('#Salutation').val() == 'TITLE' || $('#Salutation').val() == "0") { $('#ErSalutation').show().html('Please Select Title'); Err++; }
    else { $('#ErSalutation').hide().html(''); }

    if ($('#ContactName').val() == "" || $('#ContactName').val().length < 3 || checkText($('#ContactName')) == false) { $('#ErContactName').show().html('Please Enter Proper Name'); Err++; }
    else { $('#ErContactName').hide().html(''); }

    if ($('#ContactMiddleName').val().length < 3 || checkText($('#ContactMiddleName')) == false) {
        if ($('#ContactMiddleName').val() == "") { $('#ErContactMiddleName').hide().html(''); }
        else { $('#ErContactMiddleName').show().html('Please Enter Proper Name'); Err++; }
    }
    else { $('#ErContactMiddleName').hide().html(''); }

    if ($('#ContactLastName').val() == "" || $('#ContactLastName').val().length < 3 || checkText($('#ContactLastName')) == false) { $('#ErContactLastName').show().html('Please Enter Proper Name'); Err++; }
    else { $('#ErContactLastName').hide().html(''); }

    if ($('#ContactMobile').val().length == 0 || checkMobile($('#ContactMobile')) == false) { $('#ErContactMobile').show().html('Please Enter Proper Mobile'); Err++; }
    else { $('#ErContactMobile').hide().html(''); }

    if ($('#ContactEmail').val().length == 0 || checkEmail($('#ContactEmail')) == false) { $('#ErContactEmail').show().html('Please Enter Proper Email'); Err++; }
    else { $('#ErContactEmail').hide().html(''); }

    if (Err < 1) { $("#FinalSubmit").val("1"); return true; }
    else { return false; }
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

//Customer Validation
function CustomerValidation() {
    if ($('#FinalSubmit').val() == "1") {
        $('#myModal').modal('hide');
        showProgress();
        $(".spinner").show();            
        $('#AlertMsg').hide();
        $('#Hidepopup').hide();
        $('#ProgressStatus').html('');
        $('#ProgressStatus').append("Initiating proposal creation ...");           
        $('#PaymentLink').prop({ 'disabled': true, 'value': '   ...  ' });
           
        var data1 = objectifyForm($("form").serializeArray());
        console.log(data1);
        console.log(summary.Quote_Request);
        var request = summary.Quote_Request;

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
        request["final_premium"] = $("#SelectedQuote_NetPayablePayablePremium").val();
        request["tax"] = $("#SelectedQuote_ServiceTax").val();
        request["net_premium"] = $("#SelectedQuote_TotalPremium").val();
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

        // add addon details
        var addon_checked = $('#ViewAddon div').find('input[type=checkbox]:checked');
        var addon_unchecked = $('#ViewAddon div').find("input:checkbox:not(:checked)");
        if (addon_checked.length > 0) {
            $.each(addon_checked, function (i, value) { request[value.id] = "yes"; });
        }
        if (addon_unchecked.length > 0) {
            $.each(addon_unchecked, function (i, value) { request[value.id] = "no"; });
        }

        console.log(request);
        var data = {
            request_json : JSON.stringify(request),
            client_id: ClientID,
            CustomerReferenceID: $('#CustomerReferenceID').val(),
            SupportsAgentID: $("#SupportsAgentID").val(),
            SelectedInsurerID: summary.Summary.Insurer_Id
        }
        data1["CustomerReferenceID"] = $('#CustomerReferenceID').val();
        data1["TwoWheelerVariantId"] = request["vehicle_id"];

        $.ajax({
            url: '/TwoWheelerInsurance/Proposal_Initiate_Pre',
            type: "POST",
            data: JSON.stringify(data1),
            contentType: "application/json;",
            dataType: "json",
            success: function (response) { },
            error: function (request, status, errorThorwn) { }
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
                    setTimeout(function () { get_payment_data(arn, max_count); }, 1000);
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
}

function get_payment_data(arn,count) {
    var srn = summary.Quote_Request.search_reference_number;
    var crn = $('#CustomerReferenceID').val();
    var product_id = summary.Quote_Request.product_id;
    $.get('/TwoWheelerInsurance/Proposal_Details?request_unique_id=' + srn + '&service_log_unique_id=' + arn + '&client_id=' + ClientID + '&customerRefNo=' + crn + '&productId=' + product_id + '', function (res) {
        var response_json = $.parseJSON(res)
        if (response_json.Status === 'complete') {
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
        else if(count>0){
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

function CheckError(Flag, ID) {
    var IID = ID.attr('id')
    if (Flag == 'Empty') // Error Empty;
    { $('#Er' + IID).show().html('Please Enter This Field'); $(this).addClass('empty'); }
    else if (Flag == 'Invalid') // Error Invalid;
    { $('#Er' + IID).show().html('Please Enter Valid Input'); $(this).addClass('empty'); }
    else { $("#Er" + IID).hide().html(''); $(this).removeClass('empty'); } // Valid
}

function ValidateCD(InsName) {
    Err = 0;
    if ($('#Salutation').val() == 'TITLE' || $('#Salutation').val() == "0") { $('#ErSalutation').show().html('Please Select Title'); Err++; }
    else { $('#ErSalutation').hide().html(''); }

    if ($('#ContactName').val() == "" || $('#ContactName').val().length < 3 || checkText($('#ContactName')) == false) { $('#ErContactName').show().html('Please Enter Proper Name'); Err++; }
    else { $('#ErContactName').hide().html(''); }

    if ($('#ContactMiddleName').val().length < 3 || checkText($('#ContactMiddleName')) == false) {
        if ($('#ContactMiddleName').val() == "") { $('#ErContactMiddleName').hide().html(''); }
        else { $('#ErContactMiddleName').show().html('Please Enter Proper Name'); Err++; }
    }
    else { $('#ErContactMiddleName').hide().html(''); }

    if ($('#ContactLastName').val() == "" || $('#ContactLastName').val().length < 3 || checkText($('#ContactLastName')) == false) { $('#ErContactLastName').show().html('Please Enter Proper Name'); Err++; }
    else { $('#ErContactLastName').hide().html(''); }

    if ($('#ContactMobile').val().length == 0 || checkMobile($('#ContactMobile')) == false) { $('#ErContactMobile').show().html('Please Enter Proper Mobile'); Err++; }
    else { $('#ErContactMobile').hide().html(''); }

    if ($('#ContactEmail').val().length == 0 || checkEmail($('#ContactEmail')) == false) { $('#ErContactEmail').show().html('Please Enter Proper Email'); Err++; }
    else { $('#ErContactEmail').hide().html(''); }

    if ($('#dvMaritalStatus').is(':visible')) {
        if ($('#MaritalStatus').val() == null || $('#MaritalStatus').val() == "0" || $('#MaritalStatus').val() == "") {
            $('#ErMaritalStatus').show().html('Please Select Marital Status'); Err++;
        }
        else { $('#ErMaritalStatus').hide().html(''); }
    }
    else { $('#ErMaritalStatus').hide().html(''); }

    if ($('#DOBofOwner').val() == "") { $('#ErDOBofOwner').show().html('Please Enter Date Of Birth'); Err++; }
    else { $('#ErDOBofOwner').hide().html(''); }
    
    if ($('#dvContactOccupationId').is(':visible')) {
        if ($('#ContactOccupationId').val() == null || $('#ContactOccupationId').val() == "0" || $('#ContactOccupationId').val() == "")
            { $('#ErContactOccupationId').show().html('Please Select Occupation'); Err++; }
        else { $('#ErContactOccupationId').hide().html(''); }
    }
    if ($('#SelectedQuote_NetPayablePayablePremium').val() - 0 >= 50000) {
        var pan = $("#PANNo").val();
        var pattern = /[A-Za-z]{5}\d{4}[A-Za-z]{1}/;
        if (pan.match(pattern) != null) { $('#ErPANNo').hide().html(''); }
        else { $('#ErPANNo').show().html('Please Enter Proper PAN'); Err++; }
    }
    else if ($("#PANNo").val() != "" && $('#PANNo').is(':visible')) {
        var pan = $("#PANNo").val();
        var pattern = /[A-Za-z]{5}\d{4}[A-Za-z]{1}/;
        if (pan.match(pattern) != null) { $('#ErPANNo').hide().html(''); }
        else { $('#ErPANNo').show().html('Please Enter Proper PAN'); Err++; }
    }
    if ($('#AadharNo').val() == "" || $('#AadharNo').val().length < 12 || checkNumeric($('#AadharNo')) == false) { $('#ErAadharNo').show().html('Please Enter Proper Aadhar'); Err++; }
    else { $('#ErAadharNo').hide().html(''); }

    if (Err < 1) { return true; } //{ update_user_data("Section_2"); return true; }//
    else {  return false; }
}
function ValidateAD(InsName) {
    Err = 0;

    if ($('#RegisteredAddress').val() == "" || checkAddress($('#RegisteredAddress')) == false) { $('#ErRegisteredAddress').show().html('Please Enter Address 1'); Err++; }
    else { $('#ErRegisteredAddress').hide().html(''); }

    if ($('#RegisteredAddress2').val() == "" || checkAddress($('#RegisteredAddress2')) == false) { $('#ErRegisteredAddress2').show().html('Please Enter Address 2'); Err++; }
    else { $('#ErRegisteredAddress2').hide().html(''); }

    if ($('#RegisteredAddress3').val() == "" || checkAddress($('#RegisteredAddress3')) == false) { $('#ErRegisteredAddress3').show().html('Please Enter Address 3'); Err++; }
    else { $('#ErRegisteredAddress3').hide().html(''); }

    if ($('#RegisteredPinCode').val().length == 0 || $('#RegisteredPinCode').val() < 110000 || checkPincode($('#RegisteredPinCode')) == false) { $('#ErRegisteredPinCode').show().html('Please Enter Pincode'); Err++; }
    else {
        if ($("#RegisteredPinCode").val().length > 5 && $('#RegisteredPinCode').hasClass('Valid') == false) {
            if ($('#PostOfficeVORef').is(':visible') == true && $('#PostOfficeVORef').val() == 0 || $('#PostOfficeVORef').val() == null)
            { GetLTPostOfficeLtg($("#RegisteredPinCode").val()); GetLTDistrictState($("#RegisteredPinCode").val()); }
            $('#ErRegisteredPinCode, .ErRegisteredCityName, .ErRegisteredStateName').hide().html('');
        }
        else { $('#ErRegisteredPinCode').show().html('Please Enter Valid Pincode'); Err++; }
    }

    //if ($('#RegisteredCityName').val() == "" || $('#RegisteredCityName').val() == "0" || $('#ContactCityID') == "0" || $('#RegisteredCityName').val() == null)
    //{ $('#ErRegisteredCityName').show().html('Please Enter City'); Err++; }
    //else { $('#ErRegisteredCityName').hide().html(''); }

    //if ($('#RegisteredStateName').val() == "") { $('#ErRegisteredStateName').show().html('Please Enter State'); Err++; }
    //else { $('#ErRegisteredStateName').hide().html(''); }

    if ($('#ddlRegisteredCityId').val() == 0 || $('#ddlRegisteredCityId').val() == "0" || $('#ddlRegisteredCityId').val() == null) {
        $('#ErddlRegisteredCityId').show().html('Please Select Locality');  $('label[for=ddlRegisteredCityId], input#ddlRegisteredCityId').show();Err++;
        $('#ddlRegisteredCityId-styled').addClass('empty').val("");
    }
    else { $('#ddlRegisteredCityId').removeClass('Error'); }

    //if ($('#RegistereDistrictName').val() == "") { $('#dvRegistereDistrictName').addClass('Error'); Err++; }
    //else { $('#dvRegistereDistrictName').removeClass('Error'); }

    if (!$('input[id=SameAsCommunication]').is(':checked')) {

        if ($('#ContactAddress').val() == "" || checkAddress($('#ContactAddress')) == false) { $('#ErContactAddress').show().html('Please Enter Address 1'); Err++; }
        else { $('#ErContactAddress').hide().html(''); }

        if ($('#Address2').val() == "" || checkAddress($('#Address2')) == false) { $('#ErAddress2').show().html('Please Enter Address 2'); Err++; }
        else { $('#ErAddress2').hide().html(''); }

        if ($('#Address3').val() == "" || checkAddress($('#Address3')) == false) { $('#ErAddress3').show().html('Please Enter Address 3'); Err++; }
        else { $('#ErAddress3').hide().html(''); }

        if ($('#ContactPinCode').val().length == 0 || $('#ContactPinCode').val() < 110000 || checkPincode($('#ContactPinCode')) == false) { $('#ErContactPinCode').show().html('Please Enter Pincode'); Err++; }
        else {
            if ($("#ContactPinCode").val().length > 5 && $('#ContactPinCode').hasClass('Valid') == false) {
                if ($('#PostOfficeVORef').is(':visible') == true && $('#PostOfficeVORef').val() == 0 || $('#PostOfficeVORef').val() == null)
                { GetLTPostOfficeLtg($("#ContactPinCode").val()); GetLTDistrictState($("#ContactPinCode").val()); }
                $('#ErContactPinCode, .ErContactCityName, .ErStateName').hide().html('');
            }
            else { $('#ErContactPinCode').show().html('Please Enter Valid Pincode'); Err++; }
        }


        //if ($('#ContactCityName').val() == "" || $('#ContactCityName').val() == "0" || $('#ContactCityID') == "0" || $('#ContactCityName').val() == null)
        //{ $('#ErContactCityName').show().html('Please Enter City'); Err++; }
        //else { $('#ErContactCityName').hide().html(''); }

        //if ($('#StateName').val() == "") { $('#ErStateName').show().html('State Should Not Empty'); Err++; }
        //else { $('#ErStateName').hide().html(''); }
        
        if ($('#ddlContactCityID').val() == 0 || $('#ddlContactCityID').val() == "0" || $('#ddlContactCityID').val() == null) { $('#ErddlContactCityID').show().html('Please Select Locality'); Err++; }
        else { $('#ErddlContactCityID').hide().html(''); }

        if ($('#DistrictName').val() == "") { $('#ErDistrictName').show().html('District Should Not Empty'); Err++; }
        else { $('#ErDistrictName').hide().html(''); }
    }
    else { IsSameAsRegistered(true); }

    if (Err < 1) { return true; } // { update_user_data("Section_3"); return true; }//
    else { return false; }
}
function ValidateVAD(InsName) {
    Err = 0;
    //if ($('#AreYouOwnerNo').hasClass('btn-primary')) {
    //    var data = $('#OwnerName').val();
    //    var arr = data.split(' ');
    //    if ($('#OwnerName').val == "" || checkTextWithSpace($('#OwnerName')) == false || arr.length < 2 || arr[arr.length - 1] == "") { $('#dvOwnerName').addClass('Error'); Err++; }
    //    else {  $('#dvOwnerName').removeClass('Error'); }

    //    if ($('#OwnerGenderMale').hasClass('active') || $('#OwnerGenderFemale').hasClass('active')) { $('#divOwnerGender').removeClass('Error'); }
    //    else { $('#divOwnerGender').addClass('Error'); Err++; }
    //}

    $EngineNumber = $('#EngineNumber');
    $ChasisNumber = $('#ChasisNumber');

    if ($EngineNumber.val() == "" || $EngineNumber.val().length < 7 || $EngineNumber.val().length > 20 || checkEngineChasis($EngineNumber) == false)
    { $('#ErEngineNumber').show().html('Enter Proper Engine Number'); Err++; }
    else { $('#ErEngineNumber').hide().html(''); }

    if ($ChasisNumber.val() == "" || $ChasisNumber.val().length < 7 || $ChasisNumber.val().length > 20 || checkEngineChasis($ChasisNumber) == false)
    { $('#ErChasisNumber').show().html('Enter Proper Chasis Number'); Err++; }
    else { $('#ErChasisNumber').hide().html(''); }


    //Is Financed Fields
    if ($('#IsFinanced').val() == "True")
    {
        if ($('#InstitutionName').val() == "" || checkInstName($('#InstitutionName')) == false) { $('#ErInstitutionName').show().html('Enter Proper Institution Name'); Err++; }
        else { $('#ErInstitutionName').hide().html(''); }

        //if ($('#InstitutionCity').val() == "" || checkCity1($('#InstitutionCity')) == false) { $('#dvInstitutionCity').addClass('Error'); Err++; }
        //else { $('#dvInstitutionCity').removeClass('Error'); }

        if ($('#FinancerAgreementType').val() == null || $('#FinancerAgreementType').val() == "0" || $ ('#FinancerAgreementType').val() == "")
        { $('#ErFinancerAgreementType').show().html('Select Financer Agreement Type'); Err++; }
        else { $('#ErFinancerAgreementType').hide().html(''); }
    }
    else {
        $('#ErInstitutionName, #ErFinancerAgreementType').hide().html('');
        $('#InstitutionName').val(""); $('#FinancerAgreementType').val("0");
    }

    if ($('#TwoWheelerType').val() == "RENEW")
    {   
        if ($('#RegistrationNumberPart1').val() == "" || checkText($('#RegistrationNumberPart1')) == false || $('#RegistrationNumberPart1').val().length < 2) { $('#ErRegistrationNumberPart1').show().html('Enter Proper Input'); Err++; }
        else { $('#ErRegistrationNumberPart1').hide().html(''); }

        if ($('#RegistrationNumberPart1A').val() == "" || checkNumeric($('#RegistrationNumberPart1A')) == false) { $('#ErRegistrationNumberPart1A').show().html('Enter Proper Input'); Err++; }
        else { $('#ErRegistrationNumberPart1A').hide().html(''); }

        if ($('#RegistrationNumberPart2').val() == "" || checkText($('#RegistrationNumberPart2')) == false || $('#RegistrationNumberPart2').val().length < 1) { $('#ErRegistrationNumberPart2').show().html('Enter Proper Input'); Err++; }
        else { $('#ErRegistrationNumberPart2').hide().html(''); }

        if ($('#RegistrationNumberPart3').val() == "" || checkNumeric($('#RegistrationNumberPart3')) == false || $('#RegistrationNumberPart3').val().length < 4 || $('#RegistrationNumberPart3').val() <= 0) { $('#ErRegistrationNumberPart3').show().html('Enter Proper Input'); Err++; }
        else { $('#ErRegistrationNumberPart3').hide().html(''); }

        if ($('#PolicyNumber').val() == "" || checkPolicyNumber($('#PolicyNumber')) == false || $('#PolicyNumber').val().length < 8 || $('#PolicyNumber').val().length > 25) { $('#ErPolicyNumber').show().html('Enter Proper Policy Number'); Err++; }
        else { $('#ErPolicyNumber').hide().html(''); }
    }

    if ($("#VehicleColor").val() == "" || $("#VehicleColor").val() == 0 || $("#VehicleColor").val() == "0")
    { $('#ErVehicleColor').show().html('Select Proper Vehicle Color'); Err++; }
    else { $('#ErVehicleColor').hide().html(''); }
    
    if (Err < 1) { return true; } //{ update_user_data("Section_4"); return true; }//
    else { return false; }
}
function ValidateND(InsName) {
    Err = 0;
    
        var data = $('#NomineeName').val();
        var arr = data.split(' ');
        if ($('#NomineeName').val == "" || arr.length < 2 || arr[arr.length - 1] == "" || checkTextWithSpace($('#NomineeName')) == false)
            { $('#ErNomineeName').show().html('Enter Proper Nominee Name '); Err++; }
        else { $('#Er').hide().html(''); }

    if ($('#NomineeRelationID option:selected').text() == "Self") {
        $('#NomineeDOB').val($('#DOBofOwner').val()); // For Self Condition
        $('#NomineeName').val($('#ContactName').val() + ' ' + $('#ContactLastName').val()); // For Self Condition
    }

    if (InsName == "Reliance") {
        if ($('#NomineeRelation').val() == "0" || $('#NomineeRelation').val() == "" || $('#NomineeRelation').val() == "NOMINEE RELATION") { $('#ErNomineeRelationID').show().html('Select Nominee Relation'); Err++; }
        else { $('#ErNomineeRelationID').hide().html(''); }
    }
    else {
        if ($('#NomineeRelationID').val() == "0") { $('#ErNomineeRelationID').show().html('Select Nominee Relation'); Err++; }
        else { $('#ErNomineeRelationID').hide().html(''); }
    }

    if ($('#NomineeDOB').val() == "") { $('#ErNomineeDOB').show().html('Enter Proper Date'); Err++; }
    else { $('#ErNomineeDOB').hide().html(''); }

    if (Err < 1) {
        if (InsName == "Bharti" || InsName == "HDFCErgo" || InsName == "Reliance") { $("#FinalSubmit").val("1"); }
        return true;//update_user_data("Section_5"); return true;//
    }
    else { $("#FinalSubmit").val("0"); return false; }
}
function ValidateTC(InsName) {
    Err = 0;
    if (true) {
        if ($("#iagree").is(":checked") == false) { $("#lbliagree").addClass('Error'); Err++;  }
        else { $("#lbliagree").removeClass('Error'); }
        
        if (Err < 1) { $("#FinalSubmit").val("1"); return true; }
        else { $("#FinalSubmit").val("0"); return false; }
    }
    else { $("#FinalSubmit").val("1"); return true; }
}

function IsSameAsRegistered(flag) {
    if (flag == true) {
        $('#ContactAddress').val($('#RegisteredAddress').val()).removeClass('empty');
        $('#Address2').val($('#RegisteredAddress2').val()).removeClass('empty');
        $('#Address3').val($('#RegisteredAddress3').val()).removeClass('empty');        
        $('#ContactPinCode').val($('#RegisteredPinCode').val()).removeClass('empty');
        //$("#ddlContactCityID").val($("#ddlRegisteredCityId option:selected").val());
        $('#DistrictName').val($('#RegistereDistrictName').val()).removeClass('empty');
        $('#ContactCityName').val($('#RegisteredCityName').val()).removeClass('empty');
        $('#ContactCityID').val($('#RegisteredCityId').val());
        $('#StateName').val($('#RegisteredStateName').val()).removeClass('empty');
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
        $('#ContactAddress').val("").addClass('empty');
        $('#Address2').val("").addClass('empty');
        $('#Address3').val("").addClass('empty');
        $('#ContactPinCode').val("").addClass('empty');
        $('#ddlContactCityID').val("0").addClass('empty');
        $('#DistrictName').val("").addClass('empty');
        $('#ContactCityName').val("").addClass('empty');
        $('#ContactCityID').val("").addClass('empty');
        $('#StateName').val("").addClass('empty');
        $("#CommunicationStateId").val("");
        $('#CommunicationDistrictCode').val('');
    }
}

function update_user_data(current_div) {
    //if (data_sent[$("#"+current_div).prev().children('.Heading1')[0].id]){
    //    $($('#' + current_div).prev().children()[0]).show();
    //}
    var obj = {};
    var x = $('#' + current_div + ' :input').serializeArray();
    $(x).each(function (index, value) {
        obj[field_mapping[value.name]] = value.value;
    });
	obj["insurer_id"] = summary.Summary.Insurer_Id;
    obj["data_type"] = "proposal";
    obj["search_reference_number"] = summary.Summary.Request_Unique_Id;
    console.log(obj);
    $.get("/TwoWheelerInsurance/Save_User_Data?update_data=" + JSON.stringify(obj) + "&ClientID=" + ClientID,
        function (data) {
            console.log('data', data);
            var res = $.parseJSON(data);
            if (res.Msg == "Data saved") {
                console.log("Data Saved");
            }
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
            //console.log(index,":", request[value]);
        }
    });
    if (request.hasOwnProperty("birth_date"))
        {$('#DOBofOwner').val(request["birth_date"]);}
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
    "CommunicationDistrictCode":"communication_district_code",
    "ContactCityID": "communication_city_code",
    "CommunicationStateId":"communication_state_code",
    //"DistrictName": "NETAJINAGAR",
    "ContactPinCode": "communication_pincode",
    "Address3": "communication_address_3",
    "Address2": "communication_address_2",
    "ContactAddress": "communication_address_1",
    "RegisteredStateName": "permanent_state",
    "ddlRegisteredCityId": "permanent_locality_code",
    "RegisteredDistrictCode":"permanent_district_code",
    "RegisteredCityName": "permanent_city",
    "RegisteredCityId": "permanent_city_code",
    "RegisteredStateId":"permanent_state_code",
    //"RegistereDistrictName": "NETAJINAGAR",
    "RegisteredPinCode": "permanent_pincode",
    "RegisteredAddress3": "permanent_address_3",
    "RegisteredAddress2": "permanent_address_2",
    "RegisteredAddress": "permanent_address_1",
    "Salutation": "salutation",
    "hdnSalutation":"salutation_text",
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
    // date format is different for view and backend.
    "DOBofOwner": "birth_date",
    "NomineeDOB": "nominee_birth_date"
};

$("#iagree").click(function () {
    alert('iagree');
    if ($("#iagree").is(":checked") == false) { $("#lbliagree").addClass('Error'); $('#FinalSubmit').val("0"); }
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
    "Other":"Other"
};
$.each(_nominee, function (val, text) {
    $('#NomineeRelationID').append(new Option(text, val));
});