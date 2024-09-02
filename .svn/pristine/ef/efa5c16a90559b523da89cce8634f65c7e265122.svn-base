$(document).ready(function () {
    SetRadioButton($("input[name=PaymentOption]"), $("#HiddenPaymentOption").val());
    HideShowChequeDetails($("#HiddenPaymentOption").val());

    $("#ChequeDate").datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate() - 15),
        maxDate: '+15d'
    });
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
    if ($("#SameAsForNominee") != null) {
        $("#SameAsForNominee").change(function () {
            if ($("#SameAsForNominee:checked").val()) {
                SetAddressToNomineeAddress(true);
                $("#SameAsPermanentForNominee").removeAttr("checked");
            }
            else {
                $("#NomineeAddress").val("");
                $("#NomineeCityID").val(0);
                $("#NomineeCityName").val("");
                $("#NomineePinCode").val("");
            }
        });
    }
    function SetAddressToNomineeAddress(_isSet) {
        if (_isSet) {
            $("#NomineeAddress").val($("#ContactAddress").val());
            $("#NomineeCityID").val($("#ContactCityID").val());
            $("#NomineeCityName").val($("#ContactCityName").val());
            $("#NomineePinCode").val($("#ContactPinCode").val());
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
            $("#NomineeCityID").val($("#PermanentCityID").val());
            $("#NomineeCityName").val($("#PermanentCityName").val());
            $("#NomineePinCode").val($("#PermanentPinCode").val());
        }
    }

    //----------------------------------------------------------------//
    //                        Addredd Setting                         //
    //----------------------------------------------------------------//
    $("#ContactAddress").change(function () {
        SetAddressToPermanent($("#SameAsForPermanent:checked").val());
        SetAddressToNomineeAddress($("#SameAsForNominee:checked").val());
        SetPermanentAddressToNomineeNomineeAddress($("#SameAsPermanentForNominee:checked").val());
    });
    $("#ContactPinCode").change(function () {
        SetAddressToPermanent($("#SameAsForPermanent:checked").val());
        SetAddressToNomineeAddress($("#SameAsForNominee:checked").val());
        SetPermanentAddressToNomineeNomineeAddress($("#SameAsPermanentForNominee:checked").val());
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
            $("#dialog").dialog('destroy');
        }
        else {
            alert(_error);
        }
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
        var _content = $.evalJSON(response);
        $(document).ready(function () {
            $("#tdMedicalQuestion").html(_content);
            $("#dialog:ui-dialog").dialog("destroy");
            $("#dialog").dialog({
                width: 1000,
                draggable: false,
                closeOnEscape: false,
                autoOpen: true,
                resizable: false,
                modal: true,
                open: function (event) {
                    //                    $.each($("input[name=txtMedicalSubQuestionAnswer]"), function () {
                    //                        if ($(this).attr("datatype") == "DATE") {
                    //                            $(this).datepicker({
                    //                                changeMonth: true,
                    //                                changeYear: true,
                    //                                yearRange: 'c-82:c',
                    //                                dateFormat: 'dd-mm-yy',
                    //                                minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
                    //                                maxDate: 'c'
                    //                            });
                    //                        }
                    //                    });
                }
            });
        });
    });
}