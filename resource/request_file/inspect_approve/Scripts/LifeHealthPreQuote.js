$(document).ready(function () {
    $("input[name=ContactTimings]").datetimepicker({
        dateFormat: 'dd-mm-yy',
        ampm: true,
        minDate: new Date(),
        stepMinute: 5
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
        $('html, body').animate({ scrollTop: 1000 }, 'slow');
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
        ShowDialogBox(true);
    });
    $("#btnGetQuote").click(function () {
        $("#RequestTypeID").val(1);
        ShowDialogBox(true);
    });

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
        $(location).attr("href", "/lifehealth-insurance");
    }
});