
$(document).ready(function () {
    //-----------------------------Name Validation-----------------------------------//
    function nameValid(_str) {
        var reg = /^[a-zA-Z ]+$/;
        return reg.test(_str);
    }
    //-----------------------------Mobile Validation----------------------------------//
    function mobileValid(_Mobile) {
        var regMobile = new RegExp("^[6-9]{1}[0-9]{9}$");
        return regMobile.test(_Mobile);
    }
    //----------------------------EmailValidation--------------------------------------//
    function emailValid(_email) {
        var regEmail = /^[_\.0-9a-zA-Z-]+@([0-9a-zA-Z][0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}$/i;
        return regEmail.test(_email);
    }

    $('#divInsuredGenderM').click(function () {
        $("#InsuredGender").val("Male");
        $("#divInsuredGenderM").removeClass('errorClass1');
        $("#divInsuredGenderF").removeClass('errorClass1');
        $('.Gender').addClass('errorClass1');
        $('#divmsg1').html('');
    });
    $('#divInsuredGenderF').click(function () {
        $("#InsuredGender").val("Female");
        $("#divInsuredGenderM").removeClass('errorClass1');
        $("#divInsuredGenderF").removeClass('errorClass1');
        $('.Gender').addClass('errorClass1');
        $('#divmsg1').html('');
    });
    $('#divPlanningforUSAYes').click(function () {
        $("#divPlanningforUSAYes").removeClass('errorClass1');
        $("#divPlanningforUSANo").removeClass('errorClass1');
        $('#divmsg2').html('');
    });
    $('#divPlanningforUSANo').click(function () {
        $("#divPlanningforUSANo").removeClass('errorClass1');
        $("#divPlanningforUSAYes").removeClass('errorClass1');
        $('#divmsg2').html('');
    });
    $("#DateofBirthofTraveller").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function (dateText) {
            $("#DateofBirthofTraveller").removeClass('errorClass1');
            $("#DateofBirthofTraveller").removeClass('errorClass1');
            $('#divmsg1').html('');
        }
    });
    $("#DateofTravelStart").datepicker({
        changeMonth: false,
        changeYear: false,
        dateFormat: 'dd-mm-yy',
        yearRange: 'c-82:c',
        minDate: '+1d',
        onSelect: function (dateText) {
            $("#DateofTravelStart").removeClass('errorClass1');
            $("#DateofTravelStart").removeClass('errorClass1');
            $("#DateofTravelEND").datepicker("option", "minDate", $("#DateofTravelStart").val())
            $('#divmsg3').html('');
        }
    });
    $("#DateofTravelEND").datepicker({
        changeMonth: true,
        changeYear: false,
        dateFormat: 'dd-mm-yy',
        yearRange: 'c-82:c',
        maxDate: '+1y',
        onSelect: function (date) {
            $("#DateofTravelEND").removeClass('errorClass1');
            $("#DateofTravelEND").removeClass('errorClass1');
            $('#divmsg3').html('');
        }
    });
    $("#TravelCountry").keypress(function () {
        $("#TravelCountry").removeClass('errorClass1');
        $("#TravelCountry").removeClass('errorClass1');
        $('#divmsg2').html('');
    });
    $("#SumInsured").keypress(function () {
        $("#SumInsured").removeClass('errorClass1');
        $("#SumInsured").removeClass('errorClass1');
        $('#divmsg4').html('');
    });
    $("#ContactName").keypress(function () {
        $("#ContactName").removeClass('errorClass1');
        $("#ContactName").removeClass('errorClass1');
        $('#divmsg5').html('');
    });
    //$("#ContactMobile").keypress(function () {
    //    $("#ContactMobile").removeClass('errorClass1');

    //    $('#divmsg4').html('');
    //});
    $('#ContactName').keydown(function (e) {
        var key = e.keyCode;
        if (!((key == 8) || (key == 9) || (key == 32) || (key == 46) || (key >= 35 && key <= 40) || (key >= 65 && key <= 90))) { e.preventDefault(); }
    });

    $("#ContactMobile").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) { return false; }
        $("#ContactMobile").removeClass('errorClass1');
        $('#divmsg4').html('');
    });

    $("#ContactEmail").keypress(function () {
        $("#ContactEmail").removeClass('errorClass1');
        $('#divmsg4').html('');
    });

    $("#chkAuthorize").click(function () {
        $("#chkAuthorize").removeClass('errorClass1');
        $('#divmsg4').html('');
    });

    function Validatediv1() {
        var Err = 0;
        if ($('input[id=InsuredGender]:checked').val() == undefined) {
            $('#divInsuredGenderM').addClass('errorClass1');
            Err++;
        } else { $('#divInsuredGenderM').removeClass('errorClass1'); }

        if ($('input[id=InsuredGender]:checked').val() == undefined) {
            $('#divInsuredGenderF').addClass('errorClass1');
            Err++;
        } else { $('#divInsuredGenderF').removeClass('errorClass1'); }


        if ($("#DateofBirthofTraveller").val() == "") {
            $("#DateofBirthofTraveller").addClass('errorClass1');
            Err++;
            //$("#right1").attr("href", "javascript:void(0);");
        } else {
            $("#DateofBirthofTraveller").removeClass('errorClass1');
            // $("#right1").attr("href", "#carousel-example-generic");
        }
        if (Err < 1) {
            if ($("#divInsuredGenderM").hasClass("active"))
            { eventsubmmision(3, 'gender', 'male', 'travel-insurance step 1 event'); }
            if ($("#divInsuredGenderF").hasClass("active"))
            { eventsubmmision(3, 'gender', 'female', 'travel-insurance step 1 event'); }
            SlideAfterSelection();
        }
    }
    function Validatediv1_Continue() {
        var Err = 0;
        if ($('input[id=InsuredGender]:checked').val() == undefined) {
            $('#divInsuredGenderM').addClass('errorClass1');
            Err++;
        } else { $('#divInsuredGenderM').removeClass('errorClass1'); }

        if ($('input[id=InsuredGender]:checked').val() == undefined) {
            $('#divInsuredGenderF').addClass('errorClass1');
            Err++;
        } else { $('#divInsuredGenderF').removeClass('errorClass1'); }

        if ($("#DateofBirthofTraveller").val() == "") {
            $("#DateofBirthofTraveller").addClass('errorClass1');
            // $("#btnContniue").attr("href", "javascript:void(0);");
            Err++;
        }
        else {
            $("#DateofBirthofTraveller").removeClass('errorClass1');
            // $("#btnContniue").attr("href", "#carousel-example-generic");
        }
        if (Err < 1) {
            if ($("#divInsuredGenderM").hasClass("active"))
            { eventsubmmision(3, 'gender', 'male', 'travel-insurance step 1 event'); }
            if ($("#divInsuredGenderF").hasClass("active"))
            { eventsubmmision(3, 'gender', 'female', 'travel-insurance step 1 event'); }
            SlideAfterSelection();
        }
        else { slideonerror(); }//check for validation 
    }

    function Validatediv2() {
        var Err = 0;
        var travelCountry = $('#TravelCountry').val();
        if ($('input[id=PlanningforUSA]:checked').val() == undefined) {
            $('#divPlanningforUSAYes').addClass('errorClass1');
            Err++;
        } else { $('#divPlanningforUSAYes').removeClass('errorClass1'); }

        if ($('input[id=PlanningforUSA]:checked').val() == undefined) {
            $('#divPlanningforUSANo').addClass('errorClass1');
            Err++;
        } else { $('#divPlanningforUSANo').removeClass('errorClass1'); }

        if ($("#TravelCountry").val() == "") {
            $("#TravelCountry").addClass('errorClass1');
            Err++;
        } else { $("#TravelCountry").removeClass('errorClass1'); }

        if (Err < 1) {
            eventsubmmision(3, 'country', travelCountry, 'travel-insurance step 2 event');
            SlideAfterSelection();
        }
    }
    function Validatediv2_Next1() {
        var Err = 0;
        var travelCountry = $('#TravelCountry').val();
        if ($('input[id=PlanningforUSA]:checked').val() == undefined) {
            $('#divPlanningforUSAYes').addClass('errorClass1');
            Err++;
        } else { $('#divPlanningforUSAYes').removeClass('errorClass1'); }

        if ($('input[id=PlanningforUSA]:checked').val() == undefined) {
            $('#divPlanningforUSANo').addClass('errorClass1');
            Err++;
        } else { $('#divPlanningforUSANo').removeClass('errorClass1'); }

        if ($("#TravelCountryID").val() == "" || $("#TravelCountryID").val() == "0") {
            $("#TravelCountry").addClass('errorClass1');
            Err++;
        } else { $("#TravelCountry").removeClass('errorClass1'); }

        if (Err < 1) {
            eventsubmmision(3, 'country', travelCountry, 'travel-insurance step 2 event');
            SlideAfterSelection();
        }
        else { slideonerror(); }//check for validation 
    }

    function Validatediv3() {
        var Err = 0;
        var dateofTravelStart = $('#DateofTravelStart').val();
        var dateofTravelEND = $('#DateofTravelEND').val();
        if ($("#DateofTravelStart").val() == "") {
            $("#DateofTravelStart").addClass('errorClass1');
            // $("#right3").attr("href", "javascript:void(0);");
            Err++;
        } else { $("#DateofTravelStart").removeClass('errorClass1'); }

        if ($("#DateofTravelEND").val() == "") {
            $("#DateofTravelEND").addClass('errorClass1');
            // $("#right3").attr("href", "javascript:void(0);");
            Err++;
        } else { $("#DateofTravelEND").removeClass('errorClass1'); }

        if (Err < 1) {
            //$("#right3").attr("href", "#carousel-example-generic");
            eventsubmmision(3, 'date', dateofTravelStart + ' to ' + dateofTravelEND, 'travel-insurance step 3 event');
            SlideAfterSelection();
        }
    }
    function Validatediv3_Next2() {
        var Err = 0;
        var dateofTravelStart = $('#DateofTravelStart').val();
        var dateofTravelEND = $('#DateofTravelEND').val();
        if ($("#DateofTravelStart").val() == "") {
            $("#DateofTravelStart").addClass('errorClass1');
          
            Err++;
        } else { $("#DateofTravelStart").removeClass('errorClass1'); }

        if ($("#DateofTravelEND").val() == "") {
            $("#DateofTravelEND").addClass('errorClass1');
           
            Err++;
        } else { $("#DateofTravelEND").removeClass('errorClass1'); }

        if (Err < 1) {
            
            eventsubmmision(3, 'date', dateofTravelStart + ' to ' + dateofTravelEND, 'travel-insurance step 3 event');
            SlideAfterSelection();
        }
    }

    function Validatediv4() {
        var Err = 0;
        var SumInsured = $("#SumInsured").val();
        
        if (SumInsured == "" ) {
            $("#SumInsured").addClass('errorClass1');
            Err++;
        } else { $("#SumInsured").removeClass('errorClass1'); }

       
        if (Err < 1) {
            eventsubmmision(3, 'SumInsured', SumInsured, 'travel-insurance step 4 event');
            SlideAfterSelection();
        }
        else { slideonerror(); return false; } // check for validation 
    }
    function Validatediv4_Next3() {
        var Err = 0;
        var SumInsured = $('#SumInsured').val();
       
        if ($("#SumInsured").val() == "") {
            $("#SumInsured").addClass('errorClass1');           
            Err++;
        } else { $("#SumInsured").removeClass('errorClass1'); }
        if (Err < 1) {         
            eventsubmmision(3, 'SumInsured', SumInsured, 'travel-insurance step 4 event');
            SlideAfterSelection();
        }
    }

    function Validatediv5() {
        var Err = 0;
        var _ContactName = $("#ContactName").val();
        var _ContactMobile = $("#ContactMobile").val();
        var _ContactEmail = $("#ContactEmail").val();
        var _TermCondition = $("#chkAuthorize").is(":checked");
        if (($("#chkAuthorize").attr("checked")) == false) {
            $("#TermCondition").val(false);
        } else { $("#TermCondition").val(true); }

        if (_ContactName == "" || !nameValid(_ContactName)) {
            $("#ContactName").addClass('errorClass1');
            Err++;
        } else { $("#ContactName").removeClass('errorClass1'); }

        if (_ContactMobile == "" || !mobileValid(_ContactMobile)) {
            $("#ContactMobile").addClass('errorClass1');
            Err++;
        } else { $("#ContactMobile").removeClass('errorClass1'); }

        if (_ContactEmail == "" || !emailValid(_ContactEmail)) {
            $("#ContactEmail").addClass('errorClass1');
            Err++;
        } else { $("#ContactEmail").removeClass('errorClass1'); }

        if (_TermCondition != true) {
            $("#chkAuthorize").addClass('errorCheckBox');
            Err++;
        } else { $("#chkAuthorize").removeClass('errorCheckBox'); }

        if (Err < 1) {
            eventsubmmision(3, 'submit', 'compare your quote', 'travel-insurance step 5 event');
            return true;
        }
        else { slideonerror(); return false; } // check for validation 
    }

    function CheckMissCallTravel(mobileNumber, SentType) {
        var returnval = false;
        $("#divmobile").val(mobileNumber);
        var IsFromCampaign = false;
        $.get('/Home/CheckSMSCodeReceived?sessionId=' + mobileNumber + '&IsFromCampaign=' + IsFromCampaign, function (response) {
            var _missCallResponse = $.parseJSON(response);
            if (_missCallResponse == "verified") {
                $("#CustomerSMSVerified").val("true");
                $("#IsAlreadyVerified").val("true");
                spinnerVisible = false;
                showProgress();
                $("#dialog").dialog("close");
                document.forms[0].submit();
            }
            else {
                $("#IsAlreadyVerified").val("false");
                if (update == false && resent == false) {
                    $("#pResent").css("display", "none");
                    SlideAfterSelection();
                }
                var _sentcode = "";
                if (SentType == "Resent") {
                    _sentcode = $("#NeedhelpCustomerSentCode").val();
                    $("#pResent").html("Your Verification code has been resent.");
                    $("#pResent").css("display", "block");
                }

                $.get('/Home/GenerateVerificationCode?smsisdn=' + mobileNumber + "&sentcode=" + _sentcode, function (response) {
                    var _sessionId = $.parseJSON(response);
                    $("#CustomerSentCode").val(_sessionId);
                    $("#NeedhelpCustomerSentCode").val(_sessionId);
                    setTimeout(function () {
                        $("#CustomerSMSVerified").val("false");
                        document.forms[0].submit();
                    }, 1000 * 60 * 3); // change in minute
                });
                // Dialop close
            }
        });

    }

    function SlideAfterSelection() {
        var $next = $(".item:visible").toggle().next('.item');
        if ($next.size() >= 1) {
            $next.toggle('slide', { direction: "right" }, -1);
            $CurrentDiv = $next;
        }
        else {
            $CurrentDiv = $next;
            if ($next.size() < 1) { $next = $(".item:first"); }
            $next.toggle('slide', { direction: "right" }, -1);
        }
    }

    function slideonerror() {
        error = 0;
        _errorMsg = "";
        var err = 0;
        var test = $(".item:visible");
        test = test[0].id;
        switch (test) {
            case "div1":
                $('#divmsg1').html('');
                if (($('#divInsuredGenderM').hasClass('active') == false) && ($('#divInsuredGenderF').hasClass('active') == false)) {
                    $('#divmsg1').html('Please select Insured gender.').slideUp().slideDown();
                    return;
                }
                if (($("#DateofBirthofTraveller").val() == "")) {
                    $('#divmsg1').html('Please Select Insured DOB.').slideUp().slideDown();
                    return;
                }
                break;
            case "div2":
                $('#divmsg2').html('');
                if (($("#TravelCountry").val() == "")) {
                    $('#divmsg2').html('Please Select the country to travel.').slideUp().slideDown();
                    return;
                }
                if (($('#divPlanningforUSAYes').hasClass('active') == false) && ($('#divPlanningforUSANo').hasClass('active') == false)) {
                    $('#divmsg2').html('Please select if you will travel to USA/Canada.').slideUp().slideDown();
                    return;
                }
                break;
            case "div3":
                $('#divmsg3').html('');
                if (($("#DateofTravelStart").val() == "")) {
                    $('#divmsg3').html('Please Select the date of departure.').slideUp().slideDown();
                    return;
                }
                if (($("#DateofTravelEND").val() == "")) {
                    $('#divmsg3').html('Please Select the date of arrival.').slideUp().slideDown();
                    return;
                }
                break;
            case "div4":
                $('#divmsg4').html('');
                if (($("#SumInsured").val() == "")) {
                    $('#divmsg4').html('Please Select Sum Insured.').slideUp().slideDown();
                    return;
                }
                break;
            case "div5":
                $('#divmsg5').html('');
                if (($("#ContactName").val() == "")) {
                    $('#divmsg5').html('Please enter the name of person to be insured .').slideUp().slideDown();
                    return;
                }
                if (($("#ContactMobile").val() == "")) {
                    $('#divmsg5').html('Please enter the contact number.').slideUp().slideDown();
                    return;
                }
                if (($("#ContactEmail").val() == "")) {
                    $('#divmsg5').html('Please enter the Email Id.').slideUp().slideDown();
                    return;
                }
                if (($("#chkAuthorize").hasClass('active') == false)) {
                    $('#divmsg5').html('Please agree the terms and conditions.').slideUp().slideDown();
                    return;
                }
                break;
        }
    }
    function SlideAfterSelectionLeft() {
        var $prev = $(".item:visible").toggle().prev('.item');
        if ($prev.size() >= 1) {
            $prev.toggle('slide', { direction: "right" }, -1);
            $CurrentDiv = $prev;
        }
        else {
            $CurrentDiv = $prev;
            if ($prev.size() < 1) { $prev = $(".item:first"); }
            $prev.toggle('slide', { direction: "right" }, -1);
        }
    }
    $("#left2").click(function () { SlideAfterSelectionLeft(); });
    $("#left3").click(function () { SlideAfterSelectionLeft(); });
    $("#left4").click(function () { SlideAfterSelectionLeft(); });
    $("#left5").click(function () { SlideAfterSelectionLeft(); });
   // $("#left6").click(function () {
    //    SlideAfterSelectionLeft();
   // });

    $("#right1").click(function () { Validatediv1(); });
    $("#btnContniue").click(function () { Validatediv1_Continue(); });
    $("#right2").click(function () { Validatediv2(); });
    $("#next1").click(function () { Validatediv2_Next1(); });
    $("#right3").click(function () { Validatediv3(); });
    $("#next2").click(function () { Validatediv3_Next2(); });
    $("#right4").click(function () { Validatediv4(); });
    $("#next3").click(function () { Validatediv4_Next3(); });
   // $("#btnGetQuote1").click(function () { Validatediv4(); });
    $("#btnGetQuote1").click(function () {
        $("#RequestTypeID").val(1);
        $("#btnNext").hide();
        if (Validatediv5()) {
            document.getElementById("btnGetQuote1").disabled = true;
            $("#left5").hide();
            //showProgress();
            {
                if ($("#hidIsCallMissCallAlert").val()) { CheckMissCallTravel($("#ContactMobile").val(), "Fresh"); }
                else { ShowDialogBoxNew(true); }
            }
        }
    });
    function ShowDialogBoxNew(_submit) {
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
                            "Not Accepted": function () { $("#dialogNdnc").dialog('close'); }
                        },
                        close: function () {
                            $("#dialogNdnc").remove();
                            $("#IsNdncAccepted").val("false");
                        }
                    });
                }
                else {
                    $("#IsNdncAccepted").val("true");
                    //  alert("RequestTypeID-" + $("#RequestTypeID").val());
                    document.forms[0].submit();
                }
            });
        }
        else { document.forms[0].submit(); }
    }
});