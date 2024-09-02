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
});

function SetRadioButton(current_element, match_value) {
    for (var i = 0; i < current_element.length; i++) {
        if (current_element[i].value == match_value) {
            current_element[i].checked = true;
        }
    }
}