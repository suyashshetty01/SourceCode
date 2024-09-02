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
        if($("#hidIsCallMissCallAlert").val()=="True")
         {
            CheckMissCall($("#ContactMobile").val(),"Fresh");
         }
         else
         {
            ShowDialogBox(true);
         }
    });
    $("#btnGetQuote").click(function () {
        $("#RequestTypeID").val(1);
         if($("#hidIsCallMissCallAlert").val()=="True")
         {
            //CheckMissCall($("#ContactMobile").val(),"Fresh");
         }
         else
         {
            //ShowDialogBox(true);
       }
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
//    if ($("#spanMinQuote").text() == "0" && $("#spanMinQuote").text() == "0") {
//        alert("- No quotes available for selected criteria");
//        $(location).attr("href", "/investment-plans");
    //    }

//    $("#btnSupprotAgent").click(function () {
//        var isChecked = jQuery("input[name=chkSupprotAgent]:checked").val();
//        if (isChecked == "J")
//            $(location).attr("href", "/TermInsuranceIndia/contactdetails?QuoteId=" + $("#hdnSelectedQuoteId").val());
//        else {
//            $(location).attr("href", "/TermInsuranceIndia/customerpaymentrequest?QuoteId=" + $("#hdnSelectedQuoteId").val());
//        }
//    });
});

////////////////////////////////////////////////////////

function AddToCompare(plan_id, iSumAssured) {
    $(document).ready(function () {
        if (document.getElementById("spanComparisionPlans").innerHTML == "") {
            $("#hdnplanlict").val("");
        }
        var PlanIdlst = $("#hdnplanlict").val();
        var arrPlanID = PlanIdlst.split(",");
        if (arrPlanID.length > 4) {
            alert("You can compare maximum 4 plans.");
        }
        else {
            isPlanAlreadyInList = false;
            for (i = 0; i < arrPlanID.length; i++) {
                if (arrPlanID[i] == plan_id) {
                    isPlanAlreadyInList = true;
                }
            }

            if (isPlanAlreadyInList) {
                alert("You already added this plan.");
            }
            else {
                if (arrPlanID == "")
                { PlanIdlst = plan_id; }
                else {
                    PlanIdlst = $("#hdnplanlict").val() + "," + plan_id;
                }
                $("#hdnplanlict").val(PlanIdlst);
                $.post("/InvestmentInsuranceIndia/GetReturnValue?PlanIdlst=" + PlanIdlst + "&iSumAssured=" + iSumAssured, null, function (strReturnValu) {
                    var _content = $.evalJSON(strReturnValu);
                    document.getElementById("spanComparisionPlans").innerHTML = _content;
                    // $("#spanComparisionPlans").val(ss);
                });
            }
        }
    });
}
function OpenPlanDetails(plan_id) {
    $(document).ready(function () {
        $.post("/InvestmentInsuranceIndia/OpenPlanDetails?Plan_Id=" + plan_id, null, function (strReturnValu) {
            var _content = $.evalJSON(strReturnValu);
            $("#dialog").html(_content);
            $("#dialog").dialog("open");
        });
    });
}
function VeiwAdditionDetail(quoteid, Plan_Id, GuaranteedAddition, PremiumPayingYear, PolicyTerm) {
    $(document).ready(function () {
        $.post("/InvestmentInsuranceIndia/VeiwAdditionDetail?quoteid=" + quoteid + "&Plan_Id=" + Plan_Id + "&GuaranteedAddition=" + GuaranteedAddition + "&PremiumPayingYear=" + PremiumPayingYear + "&PolicyTerm=" + PolicyTerm, null, function (strReturnValu) {
            var _content = $.evalJSON(strReturnValu);
            $("#dialog").html(_content);
            $("#dialog").dialog({
                width: 420,
                autoOpen: false,
                resizable: false,
                modal: true,
                height: 500,
                
            });
            $("#dialog").dialog("open");
        });
    });
}
function VeiwBonusDetail(quoteid, Plan_Id, GuaranteedAddition, PremiumPayingYear, PolicyTerm) {
    $(document).ready(function () {
        $.post("/InvestmentInsuranceIndia/VeiwBonusDetail?quoteid=" + quoteid + "&Plan_Id=" + Plan_Id + "&GuaranteedAddition=" + GuaranteedAddition + "&PremiumPayingYear=" + PremiumPayingYear + "&PolicyTerm=" + PolicyTerm, null, function (strReturnValu) {
            var _content = $.evalJSON(strReturnValu);
            $("#dialog").html(_content);
            $("#dialog").dialog({
                width: 420,
                autoOpen: false,
                resizable: false,
                modal: true,
                height: 500,
                
            });
            $("#dialog").dialog("open");
        });
    });
}
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
function ClosePlanDetails() {
    $(document).ready(function () {
        $("#dialog").dialog("close");
    });
}
$(function () {
    $("#dialog:ui-dialog").dialog("destroy");
    $("#dialog").dialog({
        width: 600,
        autoOpen: false,
        resizable: false,
        modal: true
    });
    $(".ui-dialog-titlebar").hide();
});

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
                    $.get("/InvestmentInsuranceIndia/SendEmailQuotes?planids=" + _planId + "&IsAlternate=" + _IsAlternate, function (response) {
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
                    $.get("/InvestmentInsuranceIndia/SendEmailQuotesComparison?planids=" + _planId + "&IsAlternate=" + _IsAlternate, function (response) {
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
    open: function () { $(".ui-dialog-titlebar").show(); },
    close: function () { $("#dialogEmailQuote").html(""); $(".ui-dialog-titlebar").hide(); }
});

$("#btnEmailQuote").click(function () {
    $("#dialogEmailQuote").dialog({ title: "Email Quotes" });
    //    GetAllPlansForEmail("Quote");
    UpdateContactDetails("Quote");
});
$("#btnEmailComparison").click(function () {
    $("#dialogEmailQuote").dialog({ title: "Email Comparison" });
    //    GetAllPlansForEmail("Comparison");
    UpdateContactDetails("Comparison");
});
function GetAllPlansForEmail(sendas) {
    $.get("/InvestmentInsuranceIndia/GetAllPlans?sendas=" + sendas, function (response) {
        var _plans = $.evalJSON(response);
        $("#dialogEmailQuote").html(_plans);
        $("#dialogEmailQuote").dialog("open");
    });
}

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
                        $.get("/InvestmentInsuranceIndia/UpdateContactDetails?email=" + $("#ContactEmail").val() + "&mobile=" + $("#ContactMobile").val(), function (response) {
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

function RemovePlan(plan_id, iSumAssured) {

    $(document).ready(function () {
        var PlanIdlst = $("#hdnplanlict").val();
        var arrPlanID = PlanIdlst.split(",");
        var nPlanlst = "";

        for (i = 0; i < arrPlanID.length; i++) {
            if (arrPlanID[i] == plan_id) {
            } else {
                if (nPlanlst == "")
                { nPlanlst = arrPlanID[i]; }
                else {
                    nPlanlst = nPlanlst + "," + arrPlanID[i];
                }
            }
        }

        $("#hdnplanlict").val(nPlanlst);
        if (nPlanlst == "")
        { document.getElementById("spanComparisionPlans").innerHTML = ""; }
        else {
            $.post("/InvestmentInsuranceIndia/GetReturnValue?PlanIdlst=" + nPlanlst + "&iSumAssured=" + iSumAssured, null, function (strReturnValu) {
                var _content = $.evalJSON(strReturnValu);
                document.getElementById("spanComparisionPlans").innerHTML = _content;
                // $("#spanComparisionPlans").val(ss);
            });
        }
    });
}

