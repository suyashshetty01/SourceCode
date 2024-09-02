
$(document).ready(function () {
    var selfvalue;
    SetRadioButton($("input[name=PaymentOption]"), $("#HiddenPaymentOption").val());
    HideShowChequeDetails($("#HiddenPaymentOption").val());
    // GetPermanentCignaPincode($('#PermanentCityID').val(), false);
    $("#ChequeDate").datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate() - 15),
        maxDate: '+15d'
    });
    HavesamedetailforContactGender();
    //havesamedetailforspouse();
    //havesamedetailforKid1();
    if ($("#ContactDOB") != null) {
        $("#ContactDOB").datepicker({
            changeMonth: true,
            changeYear: true,
            yearRange: 'c-82:c',
            dateFormat: 'dd-mm-yy',
            minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
            maxDate: '-18y'
        });
    }
    $('input').focusout(function () {
        var input = $.trim($(this).val());
        if (input.length == 0) {
            $(this).val('');
        }

    });
    //$("#SpouseDOB").datepicker({
    //    changeMonth: false,
    //    changeYear: false,
    //    yearRange: 'c-82:c',
    //    dateFormat: 'dd-mm-yy',
    //    minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
    //    maxDate: '-18y'
    //});
    //$("#KidDOB").datepicker({
    //    changeMonth: true,
    //    changeYear: true,
    //    yearRange: 'c-21:c',
    //    dateFormat: 'dd-mm-yy',
    //    minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
    //    maxDate: '-18y'
    //});
    //$("#Kid1DOB").datepicker({
    //    changeMonth: true,
    //    changeYear: true,
    //    yearRange: 'c-23:c',
    //    dateFormat: 'dd-mm-yy',
    //    minDate: new Date((new Date()).getFullYear() - 23, (new Date()).getMonth(), 1),
    //    maxDate: new Date().setDate(-3)
    //});
    //$("#Kid2DOB").datepicker({
    //    changeMonth: true,
    //    changeYear: true,
    //    yearRange: 'c-32:c',
    //    dateFormat: 'dd-mm-yy',
    //    minDate: new Date((new Date()).getFullYear() - 32, (new Date()).getMonth(), 1),
    //    maxDate: "90D"
    //});
    //$("#Kid3DOB").datepicker({
    //    changeMonth: true,
    //    changeYear: true,
    //    yearRange: 'c-82:c',
    //    dateFormat: 'dd-mm-yy',
    //    minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
    //    maxDate: '-18y'
    //});
    //$("#Kid4DOB").datepicker({
    //    changeMonth: true,
    //    changeYear: true,
    //    yearRange: 'c-82:c',
    //    dateFormat: 'dd-mm-yy',
    //    minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
    //    maxDate: '-18y'
    //});

    //if ($("#SelfDOB") != null) {
    //    $("#SelfDOB").datepicker({
    //        changeMonth: false,
    //        changeYear: false,
    //        yearRange: 'c-82:c',
    //        dateFormat: 'dd-mm-yy',
    //        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
    //        maxDate: '-18y'
    //    });
    //}
    if ($("#PolicyStartDate") != null) {
        $("#PolicyStartDate").datepicker({
            changeMonth: true,
            changeYear: true,
            //yearRange: 'c-82:c',
            dateFormat: 'dd-mm-yy',
            minDate: '+1D',
            maxDate: '+8M-1D'
        });
    }
    if ($("#NomineeDOB") != null) {
        $("#NomineeDOB").datepicker({
            changeMonth: true,
            changeYear: true,
            yearRange: 'c-82:c',
            dateFormat: 'dd-mm-yy',
            minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
            maxDate: '-18y'
        });
    }
    if ($("input[name=PaymentOption]") != null) {
        $("input[name=PaymentOption]").click(function () {
            $("#HiddenPaymentOption").val($(this).val());
            HideShowChequeDetails($(this).val());
        });
    }
    if ($("#SameAsForPermanent") != null) {
        $("#SameAsForPermanent").change(function () {
            if ($("#SameAsForPermanent:checked").val()) {
                SetAddressToPermanent(true);
            }
            else {
                $("#PermanentAddress").val("");
                $("#PermanentCityID").val(0);
                $("#PermanentCityName").val("");
                $("#PermanentPinCode").val("");
            }
        });
    }
    function SetAddressToPermanent(_isSet) {
        if (_isSet) {
            $("#PermanentAddress").val($("#ContactAddress").val());
            $("#PermanentCityID").val($("#ContactCityID").val());
            $("#PermanentCityName").val($("#ContactCityName").val());
            $("#PermanentPinCode").val($("#ContactPinCode").val());
        }
    }
    //For Cigna Address
    if ($("#CignaSameAsForPermanent") != null) {
        $("#CignaSameAsForPermanent").change(function () {
             if ($("#CignaSameAsForPermanent:checked").val()) {
                CignaSetAddressToPermanent(true);
            }
            else {
                //;
                $("#PermanentAddress").val("");
                $("#PermanentAddress2").val("");
                $("#PermanentCityID").val(0);
                $("#PermanentCityName").val("");
                $("#PermanentPinCode").val("");
            }
            GetPermanentCignaPincode($("#PermanentCityID").val(), true);
        });
    }
    function CignaSetAddressToPermanent(_isSet) {
        if (_isSet) {
            $("#PermanentAddress").val($("#ContactAddress").val());
            $("#PermanentAddress2").val($("#ContactAddress2").val());
            $("#PermanentCityID").val($("#ContactCityID").val());
            $("#PermanentCityName").val($("#ContactCityName").val());
            $("#PermanentPinCode").val($("#CignaPincodeID").val());
            //$('#HiddenPermanentPincode').val();
            //$("#PermanentPinCode").val($("#CignaPincodeID option:selected").text());
            $("#HiddenPermanentPincode").val($("#CignaPincodeID option:selected").text());
            //$("#PermanentPinCode option:selected").text($("#CignaPincodeID option:selected").text());
        }
    }


    if ($("#SameAsPermanentForNominee") != null) {
        $("#SameAsPermanentForNominee").change(function () {
            if ($("#SameAsPermanentForNominee:checked").val()) {
                SetPermanentAddressToNomineeNomineeAddress(true);
                $("#SameAsForNominee").removeAttr("checked");
            }
            else {
                $("#NomineeAddress").val("");
                $("#NomineeCityID").val(0);
                $("#NomineeCityName").val("");
                $("#NomineePinCode").val("");
            }
        });
    }
    function SetPermanentAddressToNomineeNomineeAddress(_isSet) {
        if (_isSet) {
            $("#NomineeAddress").val($("#PermanentAddress").val());
            clearClass('NomineeAddress');
            $("#NomineeCityID").val($("#PermanentCityID").val());
            $("#NomineeCityName").val($("#PermanentCityName").val()).removeClass('errorClass1');
            $("#NomineePinCode").val($("#PermanentPinCode").val()).removeClass('errorClass1');
        }
    }

    //added by jyoti 

    function HavesamedetailforContactGender() {
        var chechselfvalue = $('#hndSelfSelect').val();
        var checkspousevalue = $('#hndSpouseSelect').val();
        var checkKid1value = $('#hndKid1Select').val();
        var checkKid2value = $('#hndKid2Select').val();
        var checkKid3value = $('#hndKid3Select').val();
        var checkKid4value = $('#hndKid4Select').val();
        if (chechselfvalue == "True") {
            var sameselfgender = $('#SelfGender:checked').val();
            if (sameselfgender == "M") {
                $('#lblself1').addClass('active');
                $("#lblself2").click(false);
            }
            else {
                $('#lblself2').addClass('active');
                $('#lblself1').click(false);
            }
        }


        //for Spouse
        if (checkspousevalue == "True") {
            var sameSpouseGender = $('#SpouseGender:checked').val();
            if (sameSpouseGender == "M") {
                $('#lblspouse1').addClass('active');
                $("#lblspouse2").click(false);
            }
            else {
                $('#lblspouse2').addClass('active');
                $('#lblspouse1').click(false);
            }
        }


        //for kid1
        if (checkKid1value == "True") {
            var sameKid1Gender = $('#Kid1Gender:checked').val();
            if (sameKid1Gender == "M") {
                $('#lblkid11').addClass('active');
                $("#lblkid12").click(false);
            }
            else {
                $('#lblkid12').addClass('active');
                $('#lblkid11').click(false);
            }
        }

        //for Kid2
        if (checkKid2value == "True") {
            var sameKid2Gender = $('#Kid2Gender:checked').val();
            if (sameKid2Gender == "M") {
                $('#lblkid21').addClass('active');
                $("#lblkid22").click(false);
            }
            else {
                $('#lblkid22').addClass('active');
                $('#lblkid21').click(false);
            }
        }
        //for Kid3
        if (checkKid3value == "True") {
            var sameKid3Gender = $('#Kid3Gender:checked').val();
            if (sameKid3Gender == "M") {
                $('#lblkid31').addClass('active');
                $("#lblkid32").click(false);
            }
            else {
                $('#lblkid32').addClass('active');
                $('#lblkid31').click(false);
            }
        }

        if (checkKid4value == "True") {
            var sameKid4Gender = $('#Kid4Gender:checked').val();
            if (sameKid4Gender == "M") {
                $('#lblkid41').addClass('active');
                $("#lblkid42").click(false);
            }
            else {
                $('#lblkid42').addClass('active');
                $('#lblkid41').click(false);
            }
        }
    }
    //----------------------------------------------------------------//
    //                        Addredd Setting                         //
    //----------------------------------------------------------------//
    $("#ContactAddress").change(function () {
        SetAddressToPermanent($("#SameAsForPermanent:checked").val());
        //SetAddressToNomineeAddress($("#SameAsForNominee:checked").val());
        SetPermanentAddressToNomineeNomineeAddress($("#SameAsPermanentForNominee:checked").val());
        CignaSetAddressToPermanent($("#CignaSameAsForPermanent:checked").val());
    });
    $("#ContactPinCode").change(function () {
        SetAddressToPermanent($("#SameAsForPermanent:checked").val());
        //SetAddressToNomineeAddress($("#SameAsForNominee:checked").val());
        SetPermanentAddressToNomineeNomineeAddress($("#SameAsPermanentForNominee:checked").val());
        CignaSetAddressToPermanent($("#CignaSameAsForPermanent:checked").val());
    });
    $("#PermanentAddress").change(function () {
        SetPermanentAddressToNomineeNomineeAddress($("#SameAsPermanentForNominee:checked").val());
    });
    $("#PermanentCityName").change(function () {
        SetPermanentAddressToNomineeNomineeAddress($("#SameAsPermanentForNominee:checked").val());
    });
    $("#PermanentPinCode").change(function () {
        SetPermanentAddressToNomineeNomineeAddress($("#SameAsPermanentForNominee:checked").val());
    });
    //----------------------------------------------------------------//
    //                               End                              //
    //----------------------------------------------------------------//

    function HideShowChequeDetails(_value) {
        if (_value == "DD") {
            $("#trChequeDetails").show('slow', function () { });
        } else {
            $("#trChequeDetails").hide('slow', function () { });
        }
    }
});

$("#btnMedicalQuestionOK").click(function () {  
    var qid = $("#hdnMedicalQuestionId").val();
    var member_number = $("#hdnMemberNumber").val();
    var txt_element = $("input[name=txtMedicalSubQuestionAnswer]");
    var hdn_element = $("input[name=hdnMedicalSubQuestionId]");

    var _error = "";
    $.each($("input[name=txtMedicalSubQuestionAnswer]"), function (index, value) {
        if ($(this).val().trim() == "") {
            _error += "- Please enter medical detail " + (index + 1) + "\n";
        }
        else if ($(this).attr("datatype") == "DATE" && !isDate($(this).val().trim())) {
            _error += "- Please enter valid date in field " + (index + 1) + "\n";
        }
    });

    //        for (var i = 0; i < txt_element.length; i++) {
    //            var ans = txt_element[i].value.trim();
    //            if (ans == "") {
    //                _error += "- Please enter medical detail " + (i + 1) + "\n";
    //            }
    //        }
    if (_error.length == 0) {
        for (var i = 0; i < txt_element.length; i++) {
            var sqid = hdn_element[i].value;
            var ans = txt_element[i].value.trim();
            if (ans.length > 0) {
                $.get('/HealthInsuranceIndia/SetMedicalSubAnswer?Question_Id=' + qid + '&SubQuestion_Id=' + sqid + '&Anwer=' + ans + '&Member_Number=' + member_number, function (response) {
                    var _content = $.evalJSON(response);
                });
            }
        }
        $("#popup").bPopup().close();
    }
    else {
        alert(_error);
    }
});

$("#CignaMedicalQuestionOK").click(function () {
    var qid = $("#hdnMedicalQuestionId").val();
    var member_number = $("#hdnMemberNumber").val();
    var ans = $("#CignaMedicalSubQuestionAnswer").val();
    var sqid = $("#hdnMedicalSubQuestionId").val();

    //alert(txt_element.length);

    $.get('/HealthInsuranceIndia/SetMedicalSubAnswer?Question_Id=' + qid + '&SubQuestion_Id=' + sqid + '&Anwer=' + ans + '&Member_Number=' + member_number, function (response) {
        var _content = $.parseJSON(response);
        //alert(_content);
        $("#hdnMedicalSubAns").val(ans);
        $("#dialogCignaMediSubQues").dialog('close');
        $("#dialogCignaMediSubQues").dialog('destroy');
    });


});
function SetRadioButton(current_element, match_value) {
    for (var i = 0; i < current_element.length; i++) {
        if (current_element[i].value == match_value) {
            current_element[i].checked = true;
        }
    }
}

function _MedicalDetails(question_id, current_element, member_number) {

    $.get('/HealthInsuranceIndia/GetMedicalSubQuestion?Question_Id=' + question_id + '&Member_Number=' + member_number, function (response) {
        var _content = $.parseJSON(response);

        $(document).ready(function () {
            $("#tdMedicalQuestion").html(_content);
            $('#popup').bPopup(
            {
                onClose: function (event) {
                    var tmp1 = $("#txtMedicalSubQuestionAnswer").val();
                    var tmp2 = $("#hdnMedicalSubQuestionId").val();
                    if (tmp1 == "") {
                        $('input:radio[name=' + current_element.id + '][value=' + 'No' + ']').prop('checked', true);
                    }
                }
            });
        });
    });
}

function _CignaMedicalDetails(question_id, current_element, member_number) {
    //alert('hi');
    $.get('/HealthInsuranceIndia/GetCignaMedicalSubQuestion?Question_Id=' + question_id + '&Member_Number=' + member_number, function (response) {
        var _content = $.parseJSON(response);
        $(document).ready(function () {
            $("#tdMedicalQuestion").html(_content);
            $("#dialog:ui-dialog").dialog("destroy");
            $("#dialogCignaMediSubQues").dialog({
                width: 700,
                draggable: false,
                closeOnEscape: false,
                autoOpen: true,
                resizable: false,
                modal: true,
                close: function (event) {
                    var tmp1 = $("#CignaMedicalSubQuestionAnswer").val();
                    var tmp2 = $("#hdnMedicalSubAns").val();
                    //alert(tmp2);
                    if (tmp2 == "") {
                        var $radios = $('input:radio[name=' + current_element.id + ']');
                        $radios.filter('[value=' + 'No' + ']').attr('checked', true);
                    }
                },
                open: function (event) {

                }
            });
        });
    });
}

function _LTMedicalDetails(question_id, current_element, member_number) { 
    $.get('/HealthInsuranceIndia/GetMedicalSubQuestion?Question_Id=' + question_id + '&Member_Number=' + member_number, function (response) {
        var _content = $.parseJSON(response);
        //alert(_content);
        $("#tdMedicalQuestion").html(_content);
        $('#popup').bPopup(
            {
                onClose: function (event) {
                    var tmp1 = $("#txtMedicalSubQuestionAnswer").val();
                    var tmp2 = $("#hdnMedicalSubQuestionId").val();
                    if (tmp1 == "") {
                        $('input:radio[name=' + current_element.id + '][value=' + 'No' + ']').prop('checked', true);
                    }
                }
            });
    });
}

$("#btnLTMedicalQuestionOK").click(function () {
    var qid = $("#hdnMedicalQuestionId").val();
    var member_number = $("#hdnMemberNumber").val();
    var txt_element = $("input[name=txtMedicalSubQuestionAnswer]");
    var hdn_element = $("input[name=hdnMedicalSubQuestionId]");

    var _error = "";
    $.each($("input[name=txtMedicalSubQuestionAnswer]"), function (index, value) {
        if ($(this).val().trim() == "") {
            _error += "- Please enter medical detail " + (index + 1) + "\n";
        }
        else if ($(this).attr("datatype") == "DATE" && !isDate($(this).val().trim())) {
            _error += "- Please enter valid date in field " + (index + 1) + "\n";
        }
    });

    if (_error.length == 0) {
        for (var i = 0; i < txt_element.length; i++) {
            var sqid = hdn_element[i].value;
            var ans = txt_element[i].value.trim();
            if (ans.length > 0) {
                $.get('/HealthInsuranceIndia/SetMedicalSubAnswer?Question_Id=' + qid + '&SubQuestion_Id=' + sqid + '&Anwer=' + ans + '&Member_Number=' + member_number, function (response) {
                    var _content = $.evalJSON(response);
                });
            }
        }
        $("#popup").bPopup().close();
    }
    else {
        alert(_error);
    }
});



if ($("#SameAsForNominee") != null) {
    $("#SameAsForNominee").change(function () {
        if ($("#SameAsForNominee:checked").val()) {
            SetAddressToNomineeAddress(true);
        }
        else {
            $("#NomineeAddress").val("").addClass('errorClass1');
            $("#NomineeCityID").val(0);
            $("#NomineeCityName").val("").addClass('errorClass1');
            $("#NomineePinCode").val("").addClass('errorClass1');
        }
    });
}


$('#IsSameAsNomineeYes').change(function () {
    SetAddressToNomineeAddress(true);
});
$('#IsSameAsNomineeNo').change(function () {
    $("#NomineeAddress").val("");
    $("#NomineeCityID").val(0);
    $("#NomineeCityName").val("");
    $("#NomineePinCode").val("");
});


//if ($("#SameAsForNominee") != null) {
//    $("#SameAsForNominee").change(function () {
//        if ($("#SameAsForNominee:checked").val()) {
//            SetAddressToNomineeAddress(true);
//            $("#SameAsPermanentForNominee").removeAttr("checked");
//        }
//        else {
//            $("#NomineeAddress").val("");
//            $("#NomineeCityID").val(0);
//            $("#NomineeCityName").val("");
//            $("#NomineePinCode").val("");
//        }
//    });
//}


function SetAddressToNomineeAddress(_isSet) {
    if (_isSet) {
        var address = $("#ContactAddress").val() + ',' + $("#ContactAddress2").val();
        $("#NomineeAddress").val(address).removeClass('errorClass1');
        $("#NomineeCityID").val($("#ContactCityID").val());
        $("#NomineeCityName").val($("#ContactCityName").val()).removeClass('errorClass1');
        $("#NomineePinCode").val($("#ContactPinCode").val()).removeClass('errorClass1');
    }
}
function validateDate(txtDate) {
    //alert(txtDate);
    //  var txtVal = document.getElementById(txtDate).value;
    var filter = new RegExp("(0[123456789]|10|11|12)([/])([1-2][0-9][0-9][0-9])");
    if (filter.test(txtDate))
        return true;
    else
        return false;
}

//Added By Pratik
function clearClass(controlName) {
    if ($("#" + controlName).val() == "" || $("#" + controlName).val() == 0) {
        $("#" + controlName).addClass('errorClass1');
    }
    else {
        $("#" + controlName).removeClass('errorClass1');
    }
}
//Added By Pratik

//Setting Maxlength for Mobile
$('#ContactMobile').keypress(function () {
    return this.value.length < 10
})
//Setting Maxlength For Pincode
$('.Pincode').keypress(function () {
    return this.value.length < 6
})