$(document).ready(function () {
    $("input[name=ContactTimings]").datetimepicker({
        dateFormat: 'dd-mm-yy',
        ampm: true,
        minDate: new Date(),
        stepMinute: 5
    });
    $("#btnEmailQuote").click(function () {
        $("#dialogEmailQuote").dialog({ title: "Email Quotes" });
        //        GetAllPlansForEmail("Quote");
        UpdateContactDetails("Quote");
    });
    function UpdateContactDetails(sendas) {
        if (!emailValid($("#ContactEmail").val()) || !mobileValid($("#ContactMobile").val())) {
            $("#dialogUpdateContactDetails:ui-dialog").dialog("destroy");
            $("#dialogUpdateContactDetails").dialog({
                draggable: false,
                autoOpen: true,
                resizable: false,
                modal: true,
                buttons: {
                    "Update": function () {
                        var _error = "";
                        if (!emailValid($("#ContactEmail").val())) {
                            _error += "Please enter valid email.\n";
                        }
                        if (!mobileValid($("#ContactMobile").val())) {
                            _error += "Please enter valid  mobile.\n";
                        }
                        if (_error.length == 0) {
                            $.get("/TravelInsuranceIndia/UpdateContactDetails?email=" + $("#ContactEmail").val() + "&mobile=" + $("#ContactMobile").val(), function (response) {
                                var _response = $.evalJSON(response);
                                if (_response == "OK") {
                                    $("#dialogUpdateContactDetails").dialog("close");
                                    GetAllPlansForEmail(sendas);
                                }
                                else {
                                    alert("Error in update contact details.");
                                }
                            });
                        }
                        else {
                            alert(_error);
                        }
                    },
                    "Close": function () {
                        $("#dialogUpdateContactDetails").dialog("close");
                    }
                },
                close: function () {
                    $("#dialogUpdateContactDetails:ui-dialog").dialog("destroy");
                }
            });
        }
        else {
            GetAllPlansForEmail(sendas);
        }
    }
    function GetAllPlansForEmail(sendas) {
        $.get("/TravelInsuranceIndia/GetAllPlans?sendas=" + sendas, function (response) {
            var _plans = $.evalJSON(response);
            $("#dialogEmailQuote").html(_plans);
            $("#dialogEmailQuote").dialog("open");
        });
    }
    $("#dialogEmailQuote").dialog({
        width: 600,
        draggable: false,
        autoOpen: false,
        resizable: false,
        modal: true,
        buttons: {
            "Send Email": function () {
                var _planId = "";
                var _sendAs = $("#hdnSendas").val();
                $(".EmailPlan").each(function () {
                    if ($(this).attr('checked')) {
                        if (_planId.length > 0) {
                            _planId += ",";
                        }
                        _planId += $(this).attr("planid");
                    }
                });
                if (_planId.length == 0) {
                    alert("- Please select minimum 1 plan");
                }
                else if (_sendAs == "Comparison" && _planId.split(',').length > 4) {
                    alert("- You can select maximum 4 plan");
                }
                else {
                    var _IsAlternate = $("#chkAlternateEmail").is(':checked');
                    if (_sendAs == "Quote") {
                        $.get("/TravelInsuranceIndia/SendEmailQuotes?planids=" + _planId + "&IsAlternate=" + _IsAlternate, function (response) {
                            var _message = $.evalJSON(response);
                            if (_message == "Send") {
                                alert("- Quote emailed successfully");
                                $("#dialogEmailQuote").dialog("close");
                            }
                            else {
                                alert("- Quote can not be emailed");
                            }
                        });
                    }
                    else if (_sendAs == "Comparison") {
                        $.get("/TravelInsuranceIndia/SendEmailQuotesComparison?planids=" + _planId + "&IsAlternate=" + _IsAlternate, function (response) {
                            var _message = $.evalJSON(response);
                            if (_message == "Send") {
                                alert("- Quote comparison emailed successfully");
                                $("#dialogEmailQuote").dialog("close");
                            }
                            else {
                                alert("- Quote comparison can not be emailed");
                            }
                        });
                    }
                }
            },
            "Close": function () { $("#dialogEmailQuote").dialog("close"); }
        },
        close: function () { $("#dialogEmailQuote").html(""); }
    });
    $("#trContactTimings").hide();
    ShowHideContactBox($("#RequestTypeID").val());
    function ShowHideContactBox(_RequestTypeID) {
        //        alert(_RequestTypeID);
        if (_RequestTypeID == 3) {
            $("#trContactTimings").show('slow', function () { });
            $("#spnCallBack").show('slow', function () { });
        }
        if (_RequestTypeID == 1) {
            $("#trContactTimings").hide('slow', function () { });
            $("#spnCallBack").hide('slow', function () { });
        }
        $("#RequestTypeID").val(_RequestTypeID);
        //$('html, body').animate({ scrollTop: 1000 }, 'slow');
    }
    $("#DoitYourself").click(function () {
        if ($("#RequestTypeID").val() != 1) {
            $("#trError").hide();
        }
        ShowHideContactBox(1)
    });
    $("#AssistMe").click(function () {
        if ($("#RequestTypeID").val() != 3) {
            $("#trError").hide();
        }
        ShowHideContactBox(3);
    });
    $("#btnCallBack").click(function () {
        $("#RequestTypeID").val(3);
        if (ValidateForm()) {
            if ($("#hidIsCallMissCallAlert").val() == "True") {
                CheckMissCall($("#ContactMobile").val(), "Fresh");
            }
            else {
                ShowDialogBox(true);
            }
        }
    });
    $("#btnGetQuote").click(function () {
        $("#RequestTypeID").val(1);
        if (ValidateForm()) {
            if ($("#hidIsCallMissCallAlert").val() == "True") {
                CheckMissCall($("#ContactMobile").val(), "Fresh");
            }
            else {
                ShowDialogBox(true);
            }
        }
    });
    function ValidateForm() {
        var _error = "";
        var _ContactName = $("#ContactName").val();
        var _ContactEmail = $("#ContactEmail").val();
        var _ContactMobile = $("#ContactMobile").val();
        var _TermCondition = $("#TermCondition").is(":checked");
        var _ContactTimings = $("#ContactTimings").val();



        if (_ContactName == "") {
            _error += "- Please enter contact name.\n";
        }
        if (_ContactEmail == "" || !emailValid(_ContactEmail)) {
            _error += "- Please enter valid contact email.\n";
        }
        if (_ContactMobile == "" || !mobileValid(_ContactMobile)) {
            _error += "- Please enter valid mobile no..\n";
        }
//        if ($("#RequestTypeID").val() == "3" && _ContactTimings == "") {
//            _error += "- Please enter contact timings.\n";
//        }
        if (_TermCondition != true) {
            _error += "- Please select term & condition.\n";
        }

        if (_error.length > 0) {
            alert(_error);
            return false;
        }
        else {
            return true;
        }
    }
    function ShowDialogBox(_submit) {
        var _message = "Dear " + $("#ContactName").val() + ",<br/><br/>"
                    + "Notwithstanding your registration as NDNC, fully/partially blocked and/or your customer preference registration, by accepting this confirms that you agree to receive a sales or service call from our employees/telecallers based on information you have submitted here.";
        var _MobileNumber = $("#ContactMobile").val();
        if ($("#IsNdncAccepted").val() != "true") {
            $.get("/Home/CheckNDNC?MobileNumber=" + _MobileNumber, function (response) {
                var _content = $.evalJSON(response);
                if (_content.length > 0 && _content == "YES") {
                    $('body').append('<div title="Alert" id="dialogNdnc" style="padding:15px;">' + _message + '</div>');
                    $("#dialogNdnc:ui-dialog").dialog("destroy");
                    $("#dialogNdnc").dialog({
                        width: 600,
                        draggable: false,
                        autoOpen: true,
                        resizable: false,
                        modal: true,
                        buttons: {
                            "Accept": function () {
                                $("#IsNdncAccepted").val("true");
                                document.forms[0].submit();
                            },
                            "Not Accepted": function () {
                                $("#dialogNdnc").dialog('close');
                            }
                        },
                        close: function () {
                            $("#dialogNdnc").remove();
                            $("#IsNdncAccepted").val("false");
                        }
                    });
                }
                else {
                    $("#IsNdncAccepted").val("true");
                    document.forms[0].submit();
                }
            });
        }
        else {
            document.forms[0].submit();
        }
    }

    function GetRadioButtonSelectedValue(current_element) {
        for (var i = 0; i < current_element.length; i++) {
            if (current_element[i].checked) {
                return current_element[i].value;
            }
        }
    }
    function SetRadioButton(current_element, match_value) {
        for (var i = 0; i < current_element.length; i++) {
            if (current_element[i].value == match_value) {
                current_element[i].checked = true;
            }
        }
    }

    if ($("#spanMinQuote").text() == "0" && $("#spanMinQuote").text() == "0") {
        alert("- No quotes available for selected criteria");
        $(location).attr("href", "/travel-insurance");
    }
});
function OpenSupportAgent(quotes_Id) {
    $(document).ready(function () {
        $("#hdnSelectedQuoteId").val(quotes_Id);
        //$("#dialogSupprotAgent").html(_content);
        $("#dialogSupprotAgent").dialog("open");
    });
}
$(function () {
    $("#dialog:ui-dialog").dialog("destroy");
    $("#dialogSupprotAgent").dialog({
        width: 300,
        autoOpen: false,
        resizable: false,
        modal: true,
        height: 115
    });
    $(".ui-dialog-titlebar").hide();
});