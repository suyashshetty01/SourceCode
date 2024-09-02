
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
                        $.get("/HealthInsuranceIndia/SendEmailQuotes?planids=" + _planId + "&IsAlternate=" + _IsAlternate, function (response) {
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
                        $.get("/HealthInsuranceIndia/SendEmailQuotesComparison?planids=" + _planId + "&IsAlternate=" + _IsAlternate, function (response) {
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
        //        GetAllPlansForEmail("Quote");
        UpdateContactDetails("Quote");
    });

    $("#btnEmailComparison").click(function () {
        $("#dialogEmailQuote").dialog({ title: "Email Comparison" });
        //        GetAllPlansForEmail("Comparison");
        UpdateContactDetails("Comparison");
    });

    function GetAllPlansForEmail(sendas) {
        $.get("/HealthInsuranceIndia/GetAllPlans?sendas=" + sendas, function (response) {
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
                            $.get("/HealthInsuranceIndia/UpdateContactDetails?email=" + $("#ContactEmail").val() + "&mobile=" + $("#ContactMobile").val(), function (response) {
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

function GetPlanDetails(plan_id) {


    $(document).ready(function () {
       
        $.get('/HealthInsuranceIndia/GetPlanDetails?Plan_Id=' + plan_id, function (response) {
            var _content = $.evalJSON(response);
            $("#dialog").html(_content);
            $("#dialog").dialog("open");
        });
    });

}
function ClosePlanDetails() {
   
    $(document).ready(function () {          
        $("#divOpenpalndetails").remove();     
        $("#divOpenpalndetails").hide();
        $("#divOpenpalndetails").dialog("close");       
    });
}
function AddPlanToCompare(plan_id, plan_name) {
    $(document).ready(function () {
        var _tdPlan = $("#tdPlan_" + plan_id);
        var _id = _tdPlan.attr("id");
        if (_id == undefined) {
            var count_plans = $("#tblPlans").find('tr')[0].cells.length;
            if (count_plans == 0) {
                $("#trComparePlans").show('slow', function () { });
            }
            if (count_plans <= 6) {
                $.get('/HealthInsuranceIndia/AddPlanToCompare?Plan_Id=' + plan_id, function (response) {
                    var _content = $.evalJSON(response);
                    $("#tdPlan_" + plan_id).remove();
                    $("#tblPlans tr:first").append("<td id='tdPlan_" + plan_id + "' valign='top' style='width:135px; border-right:1px solid #E0E0E0;height:75px;'>" + _content + "</td>");
                });
            }
            else {
                alert("You can compare maximum 7 plans.");
            }
        }
        else {
            alert(plan_name + " is already added.");
        }
    });
}
function RemovePlan(plan_id) {
    $(document).ready(function () {
        $("#tdPlan_" + plan_id).remove();
        var count_plans = $("#tblPlans").find('tr')[0].cells.length;
        if (count_plans == 0) {
            $("#trComparePlans").hide('slow', function () { });
        }
    });
}