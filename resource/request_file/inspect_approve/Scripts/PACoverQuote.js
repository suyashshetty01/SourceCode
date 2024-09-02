
$(document).ready(function () {
    $("#dialog:ui-dialog").dialog("destroy");
    $("#dialog").dialog({
        width: 600,
        draggable: false,
        autoOpen: false,
        resizable: false,
        modal: true,
        close: function () { $("#tdPlanDetails").html(""); }
    });
    $(".ui-dialog-titlebar").hide();

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
                        $.get("/PACoverIndia/SendEmailQuotes?planids=" + _planId + "&IsAlternate=" + _IsAlternate, function (response) {
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
                        $.get("/PACoverIndia/SendEmailQuotesComparison?planids=" + _planId + "&IsAlternate=" + _IsAlternate, function (response) {
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


    $("#btnEmailQuote").click(function () {
        $("#dialogEmailQuote").dialog({ title: "Email Quotes" });
        GetAllPlansForEmail("Quote");
    });

    $("#btnEmailComparison").click(function () {
        $("#dialogEmailQuote").dialog({ title: "Email Comparison" });
        //        GetAllPlansForEmail("Comparison");
        UpdateContactDetails("Comparison");
    });


    function GetAllPlansForEmail(sendas) {
        $.get("/PACoverIndia/GetAllPlans?sendas=" + sendas, function (response) {
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
                            $.get("/PACoverIndia/UpdateContactDetails?email=" + $("#ContactEmail").val() + "&mobile=" + $("#ContactMobile").val(), function (response) {
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
});
function OpenPlanDetails(plan_id) {
    $(document).ready(function () {
        $.post("/PACoverIndia/OpenPlanDetails?Plan_Id=" + plan_id, null, function (strReturnValu) {
            var _content = $.evalJSON(strReturnValu);
            $("#dialog").html(_content);
            $("#dialog").dialog("open");
        });
    });
}

function AddToCompare(plan_id, iSumInsured) {
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
                $.post("/PACoverIndia/GetReturnValue?PlanIdlst=" + PlanIdlst + "&iSumInsured=" + iSumInsured, null, function (strReturnValu) {
                    var _content = $.evalJSON(strReturnValu);
                    document.getElementById("spanComparisionPlans").innerHTML = _content;
                    // $("#spanComparisionPlans").val(ss);
                });
            }
        }
    });
}


//function GetPlanDetails(plan_id) {
//    $(document).ready(function () {
//        $.get('/PACoverIndia/GetPlanDetails?Plan_Id=' + plan_id, function (response) {
//            var _content = $.evalJSON(response);
//            $("#dialog").html(_content);
//            $("#dialog").dialog("open");
//        });
//    });
//}
function ClosePlanDetails() {
    $(document).ready(function () {
        $("#dialog").dialog("close");
    });
}

function RemovePlan(plan_id, iSumInsured) {
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
            $.post("/PACoverIndia/GetReturnValue?PlanIdlst=" + nPlanlst + "&iSumInsured=" + iSumInsured, null, function (strReturnValu) {
                var _content = $.evalJSON(strReturnValu);
                document.getElementById("spanComparisionPlans").innerHTML = _content;
                // $("#spanComparisionPlans").val(ss);
            });
        }
    });
}
