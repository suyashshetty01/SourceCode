$(document).ready(function () {
    $("input[name=ContactTimings]").datetimepicker({
        dateFormat: 'dd-mm-yy',
        ampm: true,
        minDate: new Date(),
        stepMinute: 5
    });
    
    $("#ContactName").removeClass("WaterMarkedTextBox");
    $("#ContactName").val($("#ContactName").val().replace("*"," "));

    $("#ContactName").focus(function () {
        if ($(this).val() == "Enter Full Name") {
            $(this).removeClass("WaterMarkedTextBox").val("");
        }

    }).blur(function () {
        if ($(this).val() == "") {
            $(this).val("Enter Full Name").addClass("WaterMarkedTextBox");
        }
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
        //ShowDialogBox(true);
        //alert($("#hidIsCallMissCallAlert").val());
        if (ValidateForm()) {
            //            var _val = $("#hdnIsMissCallVarified").val();
            //            //alert(_val);
            //            if (_val == "False") {
            if ($("#hidIsCallMissCallAlert").val() == "True") {
                CheckMissCall($("#ContactMobile").val(), "Fresh");
                //ShowDialogBox(true);
                //                $(function () {
                //                    $(".example").TimeCircles();

                //                    $(".stop").click(function () {
                //                        $(".example.stopwatch").TimeCircles().stop();
                //                    });
                //                    $(".start").click(function () {
                //                        $(".example.stopwatch").TimeCircles().start();
                //                    });
                //                    //$('body').scrollspy({ target: '#sideNav' });
                //                });
            }
            else {
                ShowDialogBox(true);
            }
        }
    });
    //    function CheckMissCall(mobileNumber) {
    //        var returnval = "";
    //        $(document).ready(function () {
    //            $("#dialogMissCallAlert:ui-dialog").dialog("destroy");
    //            $("#dialogMissCallAlert").dialog({
    //                width: 600,
    //                draggable: false,
    //                autoOpen: true,
    //                resizable: false,
    //                modal: true,
    //                open: function () {
    //                    var _interval = setInterval(function () {
    //                        $.get('/Home/CheckMissCallReceived?sessionId=' + mobileNumber, function (response) {
    //                            var _missCallResponse = $.evalJSON(response);
    //                            if (_missCallResponse == "OK") {
    //                                document.forms[0].submit();
    //                            }
    //                        });
    //                    }, 1000 * 10); // change in second
    //                    setTimeout(function () {
    //                        $("#dialogMissCallAlert").dialog("close");
    //                        var ContactName = $("#ContactName").val();
    //                        window.location = "/Home/misscalnotreceived?mobileNumber=" + mobileNumber + "&Name=" + ContactName + "";
    //                    }, 1000 * 60 * 3); // change in minute

    //                }
    //            });
    //        });
    //    }
    function ValidateForm() {
        var _error = "";
        var _ContactName = $("#ContactName").val();
        var _ContactEmail = $("#ContactEmail").val();
        var _ContactMobile = $("#ContactMobile").val();
        var _TermCondition = $("#TermCondition").is(":checked");
        var _ContactTimings = $("#ContactTimings").val();

        

        if (_ContactName == "" || _ContactName=="Enter Full Name") {
            _error += "- Please enter contact name.\n";
        }
        if (_ContactEmail == "" || !emailValid(_ContactEmail)) {
            _error += "- Please enter valid contact email.\n";
        }
        if (_ContactMobile == "" || !mobileValid(_ContactMobile)) {
            _error += "- Please enter valid mobile no..\n";
        }
        if ($("#RequestTypeID").val() == "3" && _ContactTimings == "") {
            _error += "- Please enter contact timings.\n";
        }
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
        $(location).attr("href", "/health-insurance");
    }
       
    
});