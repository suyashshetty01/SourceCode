$(document).ready(function () {
     $("#ContactDOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvContactDOB').removeClass('Error'); }
    });

    $("#NomineeDOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvNomineeDOB').removeClass('Error'); }
    });

    $("#divContactDOB").click(function () {
        $("#ContactDOB").datepicker("show"); if ($('#ContactDOB').val() != "") { $('#dvContactDOB').removeClass('Error'); }
    });
    $('#divNomineeDOB').click(function () {
        $("#NomineeDOB").datepicker("show"); if ($('#NomineeDOB').val() != "") { $('#dvNomineeDOB').removeClass('Error'); }
    });

    // Value Of Selected Dropdown (Title)
    $("#ContactTitleId").change(function () {
        $("#ContactTitle").val($("#ContactTitleId option:selected").text());
    });
    $("#SelfTitleId").change(function () {
        $("#SelfTitle").val($("#SelfTitleId option:selected").text());
    });
    $("#SpouseTitleID").change(function () {
        $("#SpouseTitle").val($("#SpouseTitleID option:selected").text());
    });
    $("#FatherTitleID").change(function () {
        $("#FatherTitle").val($("#FatherTitleID option:selected").text());
    });
    $("#MotherTitleId").change(function () {
        $("#MotherTitle").val($("#MotherTitleId option:selected").text());
    });
    $("#Kid1TitleId").change(function () {
        $("#Kid1Title").val($("#Kid1TitleId option:selected").text());
    });
    $("#Kid2TitleId").change(function () {
        $("#Kid2Title").val($("#Kid2TitleId option:selected").text());
    });
    $("#Kid3TitleId").change(function () {
        $("#Kid3Title").val($("#Kid3TitleId option:selected").text());
    });
    $("#Kid4TitleId").change(function () {
        $("#Kid4Title").val($("#Kid4TitleId option:selected").text());
    });
    $("#NomineeTitleId").change(function () {
        $("#NomineeTitle").val($("#NomineeTitleId option:selected").text());
    });

    // Focusout Events Of Fields
    $('.OnlyText').focusout(function () {
        checkText($(this));
    });
    $('.OnlyTextWithSpace').focusout(function () {
        checkTextWithSpace($(this));
    });
    $('.OnlyNumber').focusout(function () {
        checkNumeric($(this));
    });
    $('.AlphaNumeric').focusout(function () {
        checkAlphaNumeric($(this));
    });
    $('.Mobile').focusout(function () {
        checkMobile($(this));
    });
    $('.Email').focusout(function () {
        checkEmail($(this));
    });
    $('.Pincode').focusout(function () {
        checkPincode($(this));
    });
    $('.Address').focusout(function () {
        checkAddress($(this));
    });
    $('.City').focusout(function () {
        checkCity1($(this));
    });
    $('.Passport').focusout(function () {
        checkPassport($(this));
    });
    $('#ContactMobile').keypress(function () {
        return this.value.length < 10
    })

    // Setting Maxlength For Pincode
    $('.Pincode').keypress(function () {
        return this.value.length < 6
    })

    //Added on 27-06-2017
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
            maxDate: '-18y',
            onSelect: function () { $('#dvContactDOB').removeClass('Error'); }
        });
    }
    if ($("#PolicyStartDate") != null) {
        $("#PolicyStartDate").datepicker({
                changeMonth: true,
                changeYear: true,
                //yearRange: 'c-82:c',
                dateFormat: 'dd-mm-yy',
                minDate: '+0D',
                maxDate: '+8M-1D'
            });
    }
    
    $('input').focusout(function () {
        var input = $.trim($(this).val());
        if (input.length == 0) {
            $(this).val('');
        }
    });
    if ($("#PolicyStartDate") != null) {
        $("#PolicyStartDate").datepicker({
            changeMonth: true,
            changeYear: true,
            //yearRange: 'c-82:c',
            dateFormat: 'dd-mm-yy',
            minDate: '+1D',
            maxDate: '+8M-1D',
            onSelect: function () { $('#dvPolicyStartDate').removeClass('Error'); }
        });
    }
    if ($("#NomineeDOB") != null) {
        $("#NomineeDOB").datepicker({
            changeMonth: true,
            changeYear: true,
            yearRange: 'c-82:c',
            dateFormat: 'dd-mm-yy',
            minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
            maxDate: '-18y',
            onSelect: function () { $('#dvNomineeDOB').removeClass('Error'); }
        });
    }
    if ($("input[name=PaymentOption]") != null) {
        $("input[name=PaymentOption]").click(function () {
            $("#HiddenPaymentOption").val($(this).val());
            HideShowChequeDetails($(this).val());
        });
    }



    //Modified by Sarvesh M. on 19/7/2018 to save Permanent address details as per current address

    if ($("#SameAsForPermanent") != null) {
        $("#SameAsForPermanent").change(function () {
            debugger;
            var contactPinCode = $('#ContactPinCode').val();
            if ($("#SameAsForPermanent:checked").val()) {
                SetAddressToPermanent(true);
                if (($("#InsurerId").val() == 34) && contactPinCode.length > 0) {
                    GetPermanentPincodeDetails($("#PermanentPinCode").val(),1);
                }
            }
            else {
                $("#PermanentAddress").val("").removeClass('used');
                $('#PermanentAddress').prop('readonly', false);
                $("#PermanentAddress2").val("").removeClass('used');
                $('#PermanentAddress2').prop('readonly', false);
                $("#PermanentAddress3").val("").removeClass('used');
                $('#PermanentAddress3').prop('readonly', false);
                $("#PermanentPinCode").val("").removeClass('used');
                $('#PermanentPinCode').prop('readonly', false);
                $("#PermanentDistrictName").val("").removeClass('used');
                $("#PermanentCityName").val("").removeClass('used');
                $("#PermanentStateName").val("").removeClass('used');
                $("#PermanentPostOfficeId").empty();
                $("#PermanentCityID").val(0);
                $("#PermanentCityName").val("");
                $('#PermanentPostOfficeId').prop('disabled', false);
                listItems = "<option value=\"0\">LOCALITY</option>";
                $("#PermanentPostOfficeId").append(listItems);
            }
        });
    }

    
  
    function SetAddressToPermanent(_isSet) {
        if (_isSet) {

            $("#PermanentAddress").val($("#ContactAddress").val());
            ($("#PermanentAddress").val() !== '') ? $("#PermanentAddress").addClass('used') : $("#PermanentAddress").removeClass('used')
            $('#PermanentAddress').prop('readonly', true);

            $("#PermanentAddress2").val($("#ContactAddress2").val());
            ($("#PermanentAddress2").val() !== '') ? $("#PermanentAddress2").addClass('used') : $("#PermanentAddress2").removeClass('used')
            $('#PermanentAddress2').prop('readonly', true);

            $("#PermanentPinCode").val($("#ContactPinCode").val());
            ($("#PermanentPinCode").val() !== '') ? $("#PermanentPinCode").addClass('used') : $("#PermanentPinCode").removeClass('used')
            $('#PermanentPinCode').prop('readonly', true);
            //Added by Sarvesh M. on 21/7/2018
            if ($("#PermanentPinCode").val() == '') {
                $("#PermanentDistrictName").val("").removeClass('used');
                $("#PermanentStateName").val("").removeClass('used');
                $("#PermanentPostOfficeId").empty();
                var listItems = "<option value=\"0\">LOCALITY</option>";
                $("#PermanentPostOfficeId").append(listItems);
            }
        }
    }
    //For Cigna Address
    if ($("#CignaSameAsForPermanent") != null) {
        $("#CignaSameAsForPermanent").change(function () {
            if ($("#CignaSameAsForPermanent:checked").val()) {
                CignaSetAddressToPermanent(true);
                debugger;
            }
            else {
                debugger;
                $("#PermanentAddress").val("").removeClass('used');
                $('#PermanentAddress').prop('readonly', false);
                $("#PermanentAddress2").val("").removeClass('used');
                $('#PermanentAddress2').prop('readonly', false);
                $("#PermanentCityID").val(0);
                $("#PermanentCityName").val("").removeClass('used');
                $('#PermanentCityName').prop('readonly', false);
                $("#CignaPermanentPincodeID").val("0");
                $('#CignaPermanentPincodeID').prop('disabled', false);
            }
           // GetPermanentCignaPincode($("#PermanentCityID").val(), true);
        });
    }
    function CignaSetAddressToPermanent(_isSet) {
        if (_isSet) {
            debugger;         //Modified by Sarvesh M. on 26/7/2018
            $("#PermanentAddress").val($("#ContactAddress").val());
            ($("#PermanentAddress").val() !== '') ? $("#PermanentAddress").addClass('used') : $("#PermanentAddress").removeClass('used')
            $('#PermanentAddress').prop('readonly', true);

            $("#PermanentAddress2").val($("#ContactAddress2").val());
            ($("#PermanentAddress2").val() !== '') ? $("#PermanentAddress2").addClass('used') : $("#PermanentAddress2").removeClass('used')
            $('#PermanentAddress2').prop('readonly', true);

            $("#PermanentCityID").val($("#ContactCityID").val());
            $("#PermanentCityName").val($("#ContactCityName").val());
            ($("#PermanentCityName").val() !== '') ? $("#PermanentCityName").addClass('used') : $("#PermanentCityName").removeClass('used')
            $('#PermanentCityName').prop('readonly', true);
           

           // $("#PermanentPinCode").val($("#CignaPincodeID").val());

             GetPermanentCignaPincode($("#PermanentCityID").val(),true);
            //$('#HiddenPermanentPincode').val();
           // $("#HiddenPermanentPincode").val($("#HiddenCignaPincode").val());
             $('#CignaPermanentPincodeID').prop('disabled', true);
            //$("#PermanentPinCode option:selected").text($("#CignaPincodeID option:selected").text());
        }
    }
    if ($("#CignaSameAsForNominee") != null) { //added by sarvesh on 26-7-2018

        debugger;
        $("#CignaSameAsForNominee").change(function () {
            if ($("#CignaSameAsForNominee:checked").val()) {
                CignaSetAddressToNomineeAddress(true);
            }
            else {
                $("#NomineeAddress").val("").removeClass('used');
                $("#NomineeCityName").val("").removeClass('used');
            }
        });
    }

    //if (document.getElementById("SameAsPermanentForNominee").checked) {
    //    $("#NomineeAddress").val($("#ContactAddress").val() + ', ' + $("#ContactAddress2").val());
    //    $("#NomineeAddress").addClass("used");
    //    $("#NomineeCityName").val($("#ContactCityName").val());
    //    $("#NomineeCityName").addClass("used");
    //    $("#NomineePinCode").val($("#ContactPinCode").val());
    //    $("#NomineePinCode").addClass("used");
    //}
    function CignaSetAddressToNomineeAddress(_isSet) {//added by sarvesh on 26-7-2018
        if (_isSet) {
            debugger;

            var fullAddress = [$("#ContactAddress").val(), $("#ContactAddress2").val()].filter(function (val) { return val; }).join(', ');
            $("#NomineeAddress").val(fullAddress);
            ($("#NomineeAddress").val() !== '') ? $("#NomineeAddress").addClass('used') : $("#NomineeAddress").removeClass('used');
            $("#dvNomineeAddress").removeClass('errorClass1');

            $("#NomineeCityID").val($("#ContactCityID").val());
            $("#NomineeCityName").val($("#ContactCityName").val());
             ($("#NomineeCityName").val() !== '') ? $("#NomineeCityName").addClass('used') : $("#NomineeCityName").removeClass('used');
            $("#dvNomineeCityName").removeClass('errorClass1');

        }
    }
    //   End by Sarvesh
    $("#SameAsPermanentForNominee").click(function () {debugger;
        if (document.getElementById("SameAsPermanentForNominee").checked) {
            var fullAddress = [$("#ContactAddress").val(), $("#ContactAddress2").val(), $("#ContactAddress3").val()].filter(function (val) { return val; }).join(', ');
            $("#NomineeAddress").val(fullAddress);
            ($("#NomineeAddress").val() !== '') ? $("#NomineeAddress").addClass('used') : $("#NomineeAddress").removeClass('used');
            $("#NomineeCityName").val($("#DistrictName").val());
            ($("#NomineeCityName").val() !== '') ? $("#NomineeCityName").addClass('used') : $("#NomineeCityName").removeClass('used');
            $("#NomineePinCode").val($("#ContactPinCode").val());
            if ($("#NomineePinCode").val() !== '') {
                $("#NomineeCityID").val($("#PraposalcityId").val());
                $("#NomineePinCode").addClass('used');
            } else {
                $("#NomineePinCode").removeClass('used');
            };
            if ($("#InsurerId").val() == 21) {
                $("#NomineeCityName").val($("#DistrictName").val()).addClass("used");
                if (contactPinCode.length > 0) {                   
                    GetPincodeDetails($("#NomineePinCode").val());
                }
            }

            $("#dvNomineeAddress").removeClass("Error");
            $("#dvNomineeCityName").removeClass("Error");
            $("#dvNomineePinCode").removeClass("Error");
        }
        else {
            $("#NomineeAddress").val('');
            $("#NomineeAddress").removeClass("used");
            $("#NomineeCityName").val('');
            $("#NomineeCityName").removeClass("used");
            $("#NomineePinCode").val('');
            $("#NomineePinCode").removeClass("used");
        }
    });

    function SetPermanentAddressToNomineeNomineeAddress(_isSet) {
        if (_isSet) {
            $("#NomineeAddress").val($("#PermanentAddress").val());
            $("#NomineeCityID").val($("#PermanentCityID").val());
            $("#NomineeCityName").val($("#PermanentCityName").val()).removeClass('Error');
            $("#NomineePinCode").val($("#PermanentPinCode").val()).removeClass('Error');
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
    //                        Address Setting                         //
    //----------------------------------------------------------------//
    $("#ContactAddress").change(function () {
       // SetAddressToPermanent($("#SameAsForPermanent:checked").val()); //commented by Sarves M. on 19-7-2018 to disable text change from contactaddress to permanentaddress
        //SetAddressToNomineeAddress($("#SameAsForNominee:checked").val());
        SetPermanentAddressToNomineeNomineeAddress($("#SameAsPermanentForNominee:checked").val());
        //CignaSetAddressToPermanent($("#CignaSameAsForPermanent:checked").val()); //commented by Sarves M. on 26-7-2018 to disable text change from contactaddress to permanentaddress
    });
    $("#ContactPinCode").change(function () {
        debugger;
       // SetAddressToPermanent($("#SameAsForPermanent:checked").val());
        //SetAddressToNomineeAddress($("#SameAsForNominee:checked").val());
        SetPermanentAddressToNomineeNomineeAddress($("#SameAsPermanentForNominee:checked").val());
        CignaSetAddressToPermanent($("#CignaSameAsForPermanent:checked").val());
    });
    $("#PermanentAddress").change(function () {
        //SetPermanentAddressToNomineeNomineeAddress($("#SameAsPermanentForNominee:checked").val());
    }); //commented by Sarves M. on 26-7-2018 to disable text change from permanentaddress to nominee address
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
                    var _content = $.parseJSON(response);
                    ClearCSS(member_number, qid);
                });
                var MemberName = GetMemberNumberText(member_number);
                $('#lblyesMedicalQuestion' + MemberName + '_' + qid).addClass('btn-primary active').removeClass('btn-default Error');
                $('#lblnoMedicalQuestion' + MemberName + '_' + qid).addClass('btn-default').removeClass('btn-primary active Error');

                $('input:radio[name="MedicalQuestion' + MemberName + '_' + qid + '"]').filter('[value="Yes"]').attr('checked', true);
                $('input:radio[name="MedicalQuestion' + MemberName + '_' + qid + '"]').filter('[value="No"]').attr('checked', false);
            }
            else
            {
                $('#lblnoMedicalQuestion' + MemberName + '_' + qid).addClass('btn-primary active').removeClass('btn-default Error');
                $('#lblyesMedicalQuestion' + MemberName + '_' + qid).addClass('btn-default').removeClass('btn-primary active Error');

                $('input:radio[name="MedicalQuestion' + MemberName + '_' + qid + '"]').filter('[value="No"]').attr('checked', true);
                $('input:radio[name="MedicalQuestion' + MemberName + '_' + qid + '"]').filter('[value="Yes"]').attr('checked', false);
            }
        }
        $("#popup").bPopup().close();
    }
    else { $('#txtMedicalSubQuestionAnswer').addClass('Error'); }
});

$("#CignaMedicalQuestionOK").click(function () {
    var qid = $("#hdnMedicalQuestionId").val();
    var member_number = $("#hdnMemberNumber").val();
    var ans = $("#CignaMedicalSubQuestionAnswer").val();
    var sqid = $("#hdnMedicalSubQuestionId").val();

    $.get('/HealthInsuranceIndia/SetMedicalSubAnswer?Question_Id=' + qid + '&SubQuestion_Id=' + sqid + '&Anwer=' + ans + '&Member_Number=' + member_number, function (response) {
        var _content = $.parseJSON(response);
        $("#hdnMedicalSubAns").val(ans);
        $("#dialogCignaMediSubQues").dialog('close');
        $("#dialogCignaMediSubQues").dialog('destroy');
    });
});

$("#EdelweissMedicalQuestionOK").click(function () {   
    var qid = $("#hdnMedicalQuestionId").val();
    var member_number = $("#hdnMemberNumber").val();
    var ans = $("#txtMedicalSubQuestionAnswer").val();
    var sqid = $("#hdnMedicalSubQuestionId").val(); 
    if (ans == "" || ans == null) {
        $("#txtMedicalSubQuestionAnswer").addClass('Error');
    }
    else {
        $.get('/HealthInsuranceIndia/SetMedicalSubAnswer?Question_Id=' + qid + '&SubQuestion_Id=' + sqid + '&Anwer=' + ans + '&Member_Number=' + member_number, function (response) {
            var _content = $.parseJSON(response);
            $("#txtMedicalSubQuestionAnswer").removeClass('Error');
            $("#hdnMedicalSubAns").val(ans);
            $("#popup").bPopup().close();
            if (member_number == 1) {
                $("#lblyesMedicalQuestionSelf_" + qid).addClass('btn-primary active').removeClass('Error');
                $("#lblnoMedicalQuestionSelf_" + qid).removeClass('btn-primary active Error').addClass('btn-default');
            }
            if (member_number == 2) {
                $("#lblyesMedicalQuestionSpouse_" + qid).addClass('btn-primary active').removeClass('Error');
                $("#lblnoMedicalQuestionSpouse_" + qid).removeClass('btn-primary active Error').addClass('btn-default');
            }
            if (member_number == 5) {
                $("#lblyesMedicalQuestionKid1_" + qid).addClass('btn-primary active').removeClass('Error');
                $("#lblnoMedicalQuestionKid1_" + qid).removeClass('btn-primary active Error').addClass('btn-default');
            }
            if (member_number == 6) {
                $("#lblyesMedicalQuestionKid2_" + qid).addClass('btn-primary active').removeClass('Error');
                $("#lblnoMedicalQuestionKid2_" + qid).removeClass('btn-primary active Error').addClass('btn-default');
            }
            if (member_number == 7) {
                $("#lblyesMedicalQuestionKid3_" + qid).addClass('btn-primary active').removeClass('Error');
                $("#lblnoMedicalQuestionKid3_" + qid).removeClass('btn-primary active Error').addClass('btn-default');
            }
            if (member_number == 8) {
                $("#lblyesMedicalQuestionKid4_" + qid).addClass('btn-primary active').removeClass('Error');
                $("#lblnoMedicalQuestionKid4_" + qid).removeClass('btn-primary active Error').addClass('btn-default');
            }
            if (member_number == 3) {
                $("#lblyesMedicalQuestionFather_" + qid).addClass('btn-primary active').removeClass('Error');
                $("#lblnoMedicalQuestionFather_" + qid).removeClass('btn-primary active Error').addClass('btn-default');
            }
            if (member_number == 4) {
                $("#lblyesMedicalQuestionMother_" + qid).addClass('btn-primary active').removeClass('Error');
                $("#lblnoMedicalQuestionMother_" + qid).removeClass('btn-primary active Error').addClass('btn-default');
            }
        });
    }
});

$("#ReligareMedicalQuestionOK").click(function () {
    debugger;
    var qid = $("#hdnMedicalQuestionId").val();
    var member_number = $("#hdnMemberNumber").val();
    var txt_element = $("input[name=txtMedicalSubQuestionAnswer]");
    var hdn_element = $("input[name=hdnMedicalSubQuestionId]");

    var _error = "";
    $.each($("input[name=txtMedicalSubQuestionAnswer]"), function (index, value) {
        if ($(this).val().trim() != "") {
            if (!validateDate($(this).val().trim())) {
                _error += "- Please enter value in (MM/YYYY) format ? " + "\n";
                $("#txtMedicalSubQuestionAnswer").addClass('Error');
                $("#txtMedicalSubQuestionAnswer").val('');
            }
            else { $("#txtMedicalSubQuestionAnswer").removeClass('Error'); }
        }
        else {
            _error += "- Existing since in (MM/YYYY) ? " + "\n";
            $("#txtMedicalSubQuestionAnswer").addClass('Error');
            
        }
    });

    if (_error.length == 0) {
        $("#txtMedicalSubQuestionAnswer").removeClass('Error');
        for (var i = 0; i < txt_element.length; i++) {
            var sqid = hdn_element[i].value;
            var ans = txt_element[i].value.trim();
            if (ans.length > 0) {
                $.get('/HealthInsuranceIndia/SetMedicalSubAnswer?Question_Id=' + qid + '&SubQuestion_Id=' + sqid + '&Anwer=' + ans + '&Member_Number=' + member_number, function (response) {
                    var _content = $.parseJSON(response);
                });
                var MemberName = GetMemberNumberText(member_number);
                $('#lblyesMedicalQuestion' + MemberName + '_' + qid).addClass('btn-primary active').removeClass('btn-default Error');
                $('#lblnoMedicalQuestion' + MemberName + '_' + qid).addClass('btn-default').removeClass('btn-primary active Error');
                $('input:radio[name="MedicalQuestion' + MemberName + '_' + qid + '"]').filter('[value="Yes"]').attr('checked', true);
                $('input:radio[name="MedicalQuestion' + MemberName + '_' + qid + '"]').filter('[value="No"]').attr('checked', false);
            }
            else {
                $('input:radio[name="MedicalQuestion' + MemberName + '_' + qid + '"]').filter('[value="No"]').attr('checked', true);
                $('input:radio[name="MedicalQuestion' + MemberName + '_' + qid + '"]').filter('[value="Yes"]').attr('checked', false);
            }
        }
        $("#popup").bPopup().close();
        // $("#dialog").dialog('destroy');
    }
    else {
        $("#txtMedicalSubQuestionAnswer").addClass('Error');
      //  alert(_error);
    }
});

$("#ReligareOtherMedicalQuestionOK").click(function () {
    var qid = $("#hdnOtherMedicalQuestionId").val();
    var member_number = $("#hdnOtherMemberNumber").val();
    var txt_element = $("input[name=txtSubQuestionAnswer]");
    var txt_Otherelement = $("input[name=txtOtherMedicalSubQuestionAnswer]");
    var hdn_element = $("input[name=hdnOtherMedicalSubQuestionId]");
    var hdn_element = $("input[name=hdnOtherMedicalSubQuestionId]");
    //alert(qid + ',' + member_number + ',' + txt_element.length + ',' + txt_Otherelement.length + ',' + hdn_element.length);
    var _error = "";
    var sVal = $("#txtSubQuestionAnswer").val();
    //alert(sVal);
    if (sVal != "") {
        if (!validateDate($("#txtSubQuestionAnswer").val())) {
           _error += "- Please enter value in (MM/YYYY) format ? " + "\n";
            $("#txtMedicalSubQuestionAnswer").addClass('Error');
            $("#txtSubQuestionAnswer").val('');
        }
    }
    else {
        _error += "- Existing since in (MM/YYYY) ? " + "\n";
        $("#txtMedicalSubQuestionAnswer").addClass('Error');
    }

    if ($("input[name=txtOtherMedicalSubQuestionAnswer]").val().trim() == "") {
        _error += "-  Please enter Other diseases description " + "\n";
        $('#txtOtherMedicalSubQuestionAnswer').addClass('Error');
    }

    //alert(_error.length);
    if (_error.length == 0) {
        $("#txtMedicalSubQuestionAnswer").addClass('Error');
        $('#txtOtherMedicalSubQuestionAnswer').addClass('Error');
        for (var i = 0; i < txt_element.length; i++) {
            var sqid = hdn_element[i].value;
            var ans = txt_element[i].value.trim() + "," + txt_Otherelement[i].value.trim();
            if (ans.length > 0) {
                $.get('/HealthInsuranceIndia/SetMedicalSubAnswer?Question_Id=' + qid + '&SubQuestion_Id=' + sqid + '&Anwer=' + ans + '&Member_Number=' + member_number, function (response) {
                    var _content = $.parseJSON(response);
                });
                var MemberName = GetMemberNumberText(member_number);
                $('#lblyesMedicalQuestion' + MemberName + '_' + qid).addClass('btn-primary active').removeClass('btn-default Error');
                $('#lblnoMedicalQuestion' + MemberName + '_' + qid).addClass('btn-default').removeClass('btn-primary active Error');
                $('input:radio[name="MedicalQuestion' + MemberName + '_' + qid + '"]').filter('[value="Yes"]').attr('checked', true);
                $('input:radio[name="MedicalQuestion' + MemberName + '_' + qid + '"]').filter('[value="No"]').attr('checked', false);
            }
            else {
                $('input:radio[name="MedicalQuestion' + MemberName + '_' + qid + '"]').filter('[value="No"]').attr('checked', true);
                $('input:radio[name="MedicalQuestion' + MemberName + '_' + qid + '"]').filter('[value="Yes"]').attr('checked', false);
            }
        }
        $("#popup2").bPopup().close();
    }
    else { //alert(_error); 
    }
});

$("#ReligareOtherSmokeMedicalQuestionOK").click(function () {
    //alert('other');
    var qid = $("#hdnOtherSmokeMedicalQuestionId").val();
    var member_number = $("#hdnOtherSmokeMemberNumber").val();
    var txt_element = $("input[name=txtSmokeSubQuestionAnswer]");
    var txt_Otherelement = $("input[name=txtOtherSmokeMedicalSubQuestionAnswer]");
    var hdn_element = $("input[name=hdnOtherSmokeMedicalSubQuestionId]");

    //alert(qid + ',' + member_number + ',' + txt_element.length + ',' + txt_Otherelement.length + ',' + hdn_element.length);
    var _error = "";
    var sVal = $("#txtSmokeSubQuestionAnswer").val();
    //alert(sVal);
    if (sVal != "") {
        if (!validateDate($("#txtSmokeSubQuestionAnswer").val())) {
            _error += "- Please enter value in (MM/YYYY) format ? " + "\n";
            $("#txtSmokeSubQuestionAnswer").val('');
            $("#txtSmokeSubQuestionAnswer").addClass('Error');
        }
    }
    else {
        _error += "- Existing since in (MM/YYYY) ? " + "\n";
        $("#txtSmokeSubQuestionAnswer").addClass('Error');
    }

    if ($("input[name=txtOtherSmokeMedicalSubQuestionAnswer]").val().trim() == "") {
        _error += "-  Please enter other smoke details  " + "\n";
        $("#txtOtherSmokeMedicalSubQuestionAnswer").addClass('Error');
    }

    //alert(_error.length);
    if (_error.length == 0) {
        $('#txtOtherSmokeMedicalSubQuestionAnswer').removeClass('Error');
        $("#txtSmokeSubQuestionAnswer").removeClass('Error');
        for (var i = 0; i < txt_element.length; i++) {
            var sqid = hdn_element[i].value;
            var ans = txt_element[i].value.trim() + "," + txt_Otherelement[i].value.trim();
            if (ans.length > 0) {
                $.get('/HealthInsuranceIndia/SetMedicalSubAnswer?Question_Id=' + qid + '&SubQuestion_Id=' + sqid + '&Anwer=' + ans + '&Member_Number=' + member_number, function (response) {
                    var _content = $.parseJSON(response);
                });
                var MemberName = GetMemberNumberText(member_number);
                $('#lblyesMedicalQuestion' + MemberName + '_' + qid).addClass('btn-primary active').removeClass('btn-default Error');
                $('#lblnoMedicalQuestion' + MemberName + '_' + qid).addClass('btn-default').removeClass('btn-primary active Error');
                $('input:radio[name="MedicalQuestion' + MemberName + '_' + qid + '"]').filter('[value="Yes"]').attr('checked', true);
                $('input:radio[name="MedicalQuestion' + MemberName + '_' + qid + '"]').filter('[value="No"]').attr('checked', false);
            }
            else {
                $('input:radio[name="MedicalQuestion' + MemberName + '_' + qid + '"]').filter('[value="No"]').attr('checked', true);
                $('input:radio[name="MedicalQuestion' + MemberName + '_' + qid + '"]').filter('[value="Yes"]').attr('checked', false);
            }
        }
        $("#popup3").bPopup().close();
    }
    else { //alert(_error); 
    }
});

function SetRadioButton(current_element, match_value) {
    for (var i = 0; i < current_element.length; i++) {
        if (current_element[i].value == match_value) {
            current_element[i].checked = true;
        }
    }
}

function _LibertyMedicalDetails(qid, current_element, member_number) { 
    var MemberName = GetMemberNumberText(member_number);  
    $('input:radio[name="MedicalQuestion' + MemberName + '_' + qid + '"]').filter('[value="Yes"]').attr('checked', true);
    $('input:radio[name="MedicalQuestion' + MemberName + '_' + qid + '"]').filter('[value="No"]').attr('checked', false); 
}

function _MedicalDetails(question_id, current_element, member_number) {
   
    ActiveCSS(question_id, current_element, member_number);
    $.get('/HealthInsuranceIndia/GetMedicalSubQuestion?Question_Id=' + question_id + '&Member_Number=' + member_number, function (response) {

        var _content = $.parseJSON(response);
        $(document).ready(function () {
            $("#tdMedicalQuestion").html(_content);
            //$("#txtMedicalSubQuestionAnswer").addClass('SubQuestionAnswer');
            $('#popup').bPopup(
            {
                onClose: function (event) {
                    var tmp1 = $("#txtMedicalSubQuestionAnswer").val();
                    var tmp2 = $("#hdnMedicalSubQuestionId").val();
                    var MemberName = GetMemberNumberText(member_number);
                    if (tmp1 == "") {
                        ClearCSS(member_number, question_id);
                        //$('input:radio[name=' + current_element.id + '][value=' + 'No' + ']').prop('checked', true).css({ 'width': '100%', 'border': '1px solid #ccc' });
                        $('#lblnoMedicalQuestion' + MemberName + '_' + question_id).addClass('btn-primary active').removeClass('btn-default Error');
                        $('#lblyesMedicalQuestion' + MemberName + '_' + question_id).addClass('btn-default').removeClass('btn-primary active Error');
                        $('input:radio[name="MedicalQuestion' + MemberName + '_' + question_id + '"]').filter('[value="No"]').attr('checked', true);
                        $('input:radio[name="MedicalQuestion' + MemberName + '_' + question_id + '"]').filter('[value="Yes"]').attr('checked', false);
                    }
                    else {
                        $("#txtMedicalSubQuestionAnswer").val("");
                        $('#lblyesMedicalQuestion' + MemberName + '_' + question_id).addClass('btn-primary active').removeClass('btn-default Error');
                        $('#lblnoMedicalQuestion' + MemberName + '_' + question_id).addClass('btn-default').removeClass('btn-primary active Error');
                        $('input:radio[name="MedicalQuestion' + MemberName + '_' + question_id + '"]').filter('[value="Yes"]').attr('checked', true);
                        $('input:radio[name="MedicalQuestion' + MemberName + '_' + question_id + '"]').filter('[value="No"]').attr('checked', false);
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
    }
});

//Created By Pramod for Religare on 01.09.2015 for select 'No' for 1st Question 
//when all of the preexisting disease is selected No.
$('input[name=MedicalQuestionSelf_241]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 242; i <= 253; i++) {
            $('input[name=MedicalQuestionSelf_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionSpouse_241]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 242; i <= 253; i++) {
            $('input[name=MedicalQuestionSpouse_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionFather_241]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 242; i <= 253; i++) {
            $('input[name=MedicalQuestionFather_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionMother_241]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 242; i <= 253; i++) {
            $('input[name=MedicalQuestionMother_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid1_241]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 242; i <= 253; i++) {
            $('input[name=MedicalQuestionKid1_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid2_241]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 242; i <= 253; i++) {
            $('input[name=MedicalQuestionKid2_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid3_241]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 242; i <= 253; i++) {
            $('input[name=MedicalQuestionKid3_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid4_241]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 242; i <= 253; i++) {
            $('input[name=MedicalQuestionKid4_' + i + '][value=No]').prop('checked', true);
        }
    }
});

$('input[name=MedicalQuestionSelf_323]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 324; i <= 335; i++) {
            $('input[name=MedicalQuestionSelf_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionSpouse_323]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 324; i <= 335; i++) {
            $('input[name=MedicalQuestionSpouse_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionFather_323]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 324; i <= 335; i++) {
            $('input[name=MedicalQuestionFather_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionMother_323]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 324; i <= 335; i++) {
            $('input[name=MedicalQuestionMother_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid1_323]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 324; i <= 335; i++) {
            $('input[name=MedicalQuestionKid1_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid2_323]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 324; i <= 335; i++) {
            $('input[name=MedicalQuestionKid2_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid3_323]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 324; i <= 335; i++) {
            $('input[name=MedicalQuestionKid3_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid4_323]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 324; i <= 335; i++) {
            $('input[name=MedicalQuestionKid4_' + i + '][value=No]').prop('checked', true);
        }
    }
});

// Created by Manish Anand on 09.09.2016 
// to put "No" in all preexisting questions when FirstQuestion is selected "No"

$('input[name=MedicalQuestionSelf_413]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 414; i <= 424; i++) {
            $('input[name=MedicalQuestionSelf_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionSpouse_413]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 414; i <= 424; i++) {
            $('input[name=MedicalQuestionSpouse_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionFather_413]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 414; i <= 424; i++) {
            $('input[name=MedicalQuestionFather_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionMother_413]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 414; i <= 424; i++) {
            $('input[name=MedicalQuestionMother_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid1_413]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 414; i <= 424; i++) {
            $('input[name=MedicalQuestionKid1_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid2_413]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 414; i <= 424; i++) {
            $('input[name=MedicalQuestionKid2_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid3_413]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 414; i <= 424; i++) {
            $('input[name=MedicalQuestionKid3_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid4_413]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 414; i <= 424; i++) {
            $('input[name=MedicalQuestionKid4_' + i + '][value=No]').prop('checked', true);
        }
    }
});
//End of Religare Selection

//Added by Ajit on 12-01-2016 for Religare Care V2
$('input[name=MedicalQuestionSelf_438]').click(function () {
    // alert("dd");
    if ($(this).val() == 'No') {
        for (var i = 443; i <= 455; i++) {
            $('input[name=MedicalQuestionSelf_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionSpouse_438]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 443; i <= 455; i++) {
            $('input[name=MedicalQuestionSpouse_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionFather_438]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 443; i <= 455; i++) {
            $('input[name=MedicalQuestionFather_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionMother_438]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 443; i <= 455; i++) {
            $('input[name=MedicalQuestionMother_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid1_438]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 443; i <= 455; i++) {
            $('input[name=MedicalQuestionKid1_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid2_438]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 443; i <= 455; i++) {
            $('input[name=MedicalQuestionKid2_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid3_438]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 443; i <= 455; i++) {
            $('input[name=MedicalQuestionKid3_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid4_438]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 443; i <= 455; i++) {
            $('input[name=MedicalQuestionKid4_' + i + '][value=No]').prop('checked', true);
        }
    }
});
// End of Religare Care V2

function _ReligareMedicalDetails(question_id, current_element, member_number) {  
    //Created By Pramod for Religare on 01.09.2015 for select 'Yes' for 1st Question 
    //when any of the preexisting disease is selected Yes.

    if ($("#HiddenPlan_ID").val() == 81) {
        if (member_number == 1) { $('input[name=MedicalQuestionSelf_241][value=Yes]').prop('checked', true); }
        if (member_number == 2) { $('input[name=MedicalQuestionSpouse_241][value=Yes]').prop('checked', true); }
        if (member_number == 3) { $('input[name=MedicalQuestionFather_241][value=Yes]').prop('checked', true); }
        if (member_number == 4) { $('input[name=MedicalQuestionMother_241][value=Yes]').prop('checked', true); }
        if (member_number == 5) { $('input[name=MedicalQuestionKid1_241][value=Yes]').prop('checked', true); }
        if (member_number == 6) { $('input[name=MedicalQuestionKid2_241][value=Yes]').prop('checked', true); }
        if (member_number == 7) { $('input[name=MedicalQuestionKid3_241][value=Yes]').prop('checked', true); }
        if (member_number == 8) { $('input[name=MedicalQuestionKid4_241][value=Yes]').prop('checked', true); }
    }
    else if ($("#HiddenPlan_ID").val() == 189) {
        if (member_number == 1) { $('input[name=MedicalQuestionSelf_323][value=Yes]').prop('checked', true); }
        if (member_number == 2) { $('input[name=MedicalQuestionSpouse_323][value=Yes]').prop('checked', true); }
        if (member_number == 3) { $('input[name=MedicalQuestionFather_323][value=Yes]').prop('checked', true); }
        if (member_number == 4) { $('input[name=MedicalQuestionMother_323][value=Yes]').prop('checked', true); }
        if (member_number == 5) { $('input[name=MedicalQuestionKid1_323][value=Yes]').prop('checked', true); }
        if (member_number == 6) { $('input[name=MedicalQuestionKid2_323][value=Yes]').prop('checked', true); }
        if (member_number == 7) { $('input[name=MedicalQuestionKid3_323][value=Yes]').prop('checked', true); }
        if (member_number == 8) { $('input[name=MedicalQuestionKid4_323][value=Yes]').prop('checked', true); }
    }
        //Added by Ajit on 12-01-2016 for Religare Care V2
    else if ($("#HiddenPlan_ID").val() == 230) {
        if (member_number == 1) { $('input[name=MedicalQuestionSelf_438][value=Yes]').prop('checked', true); }
        if (member_number == 2) { $('input[name=MedicalQuestionSpouse_438][value=Yes]').prop('checked', true); }
        if (member_number == 3) { $('input[name=MedicalQuestionFather_438][value=Yes]').prop('checked', true); }
        if (member_number == 4) { $('input[name=MedicalQuestionMother_438][value=Yes]').prop('checked', true); }
        if (member_number == 5) { $('input[name=MedicalQuestionKid1_438][value=Yes]').prop('checked', true); }
        if (member_number == 6) { $('input[name=MedicalQuestionKid2_438][value=Yes]').prop('checked', true); }
        if (member_number == 7) { $('input[name=MedicalQuestionKid3_438][value=Yes]').prop('checked', true); }
        if (member_number == 8) { $('input[name=MedicalQuestionKid4_438][value=Yes]').prop('checked', true); }
    }
        //End of Religare Care V2
        //Added by nitesh on 04-08-2018 for Edleweiss
    else if ($("#HiddenPlan_ID").val() == 314) {  

        if (member_number == 1) {
         
            $('input[name=MedicalQuestionSelf_314][value=Yes]').prop('checked', true);
        }
        if (member_number == 2) { $('input[name=MedicalQuestionSpouse_438][value=Yes]').prop('checked', true); }
        if (member_number == 3) { $('input[name=MedicalQuestionFather_438][value=Yes]').prop('checked', true); }
        if (member_number == 4) { $('input[name=MedicalQuestionMother_438][value=Yes]').prop('checked', true); }
        if (member_number == 5) { $('input[name=MedicalQuestionKid1_438][value=Yes]').prop('checked', true); }
        if (member_number == 6) { $('input[name=MedicalQuestionKid2_438][value=Yes]').prop('checked', true); }
        if (member_number == 7) { $('input[name=MedicalQuestionKid3_438][value=Yes]').prop('checked', true); }
        if (member_number == 8) { $('input[name=MedicalQuestionKid4_438][value=Yes]').prop('checked', true); }
    }
    else if ($("#HiddenPlan_ID").val() == 315) {

        if (member_number == 1) {

            $('input[name=MedicalQuestionSelf_315][value=Yes]').prop('checked', true);
        }
        if (member_number == 2) { $('input[name=MedicalQuestionSpouse_438][value=Yes]').prop('checked', true); }
        if (member_number == 3) { $('input[name=MedicalQuestionFather_438][value=Yes]').prop('checked', true); }
        if (member_number == 4) { $('input[name=MedicalQuestionMother_438][value=Yes]').prop('checked', true); }
        if (member_number == 5) { $('input[name=MedicalQuestionKid1_438][value=Yes]').prop('checked', true); }
        if (member_number == 6) { $('input[name=MedicalQuestionKid2_438][value=Yes]').prop('checked', true); }
        if (member_number == 7) { $('input[name=MedicalQuestionKid3_438][value=Yes]').prop('checked', true); }
        if (member_number == 8) { $('input[name=MedicalQuestionKid4_438][value=Yes]').prop('checked', true); }
    }
    else if ($("#HiddenPlan_ID").val() == 316) {

        if (member_number == 1) {

            $('input[name=MedicalQuestionSelf_315][value=Yes]').prop('checked', true);
        }
        if (member_number == 2) { $('input[name=MedicalQuestionSpouse_438][value=Yes]').prop('checked', true); }
        if (member_number == 3) { $('input[name=MedicalQuestionFather_438][value=Yes]').prop('checked', true); }
        if (member_number == 4) { $('input[name=MedicalQuestionMother_438][value=Yes]').prop('checked', true); }
        if (member_number == 5) { $('input[name=MedicalQuestionKid1_438][value=Yes]').prop('checked', true); }
        if (member_number == 6) { $('input[name=MedicalQuestionKid2_438][value=Yes]').prop('checked', true); }
        if (member_number == 7) { $('input[name=MedicalQuestionKid3_438][value=Yes]').prop('checked', true); }
        if (member_number == 8) { $('input[name=MedicalQuestionKid4_438][value=Yes]').prop('checked', true); }
    }
        //End of Edleweiss 
    else {
        if (member_number == 1) { $('input[name=MedicalQuestionSelf_413][value=Yes]').prop('checked', true); }
        if (member_number == 2) { $('input[name=MedicalQuestionSpouse_413][value=Yes]').prop('checked', true); }
        if (member_number == 3) { $('input[name=MedicalQuestionFather_413][value=Yes]').prop('checked', true); }
        if (member_number == 4) { $('input[name=MedicalQuestionMother_413][value=Yes]').prop('checked', true); }
        if (member_number == 5) { $('input[name=MedicalQuestionKid1_413][value=Yes]').prop('checked', true); }
        if (member_number == 6) { $('input[name=MedicalQuestionKid2_413][value=Yes]').prop('checked', true); }
        if (member_number == 7) { $('input[name=MedicalQuestionKid3_413][value=Yes]').prop('checked', true); }
        if (member_number == 8) { $('input[name=MedicalQuestionKid4_413][value=Yes]').prop('checked', true); }
    }

    //end of Reliagre Selection
    $.get('/HealthInsuranceIndia/GetMedicalSubQuestion?Question_Id=' + question_id + '&Member_Number=' + member_number, function (response) {
        var _content = $.parseJSON(response);
        $("#tdMedicalQuestion").html(_content);
        $('#popup').bPopup(
            {
                onClose: function (event) {
                    var tmp1 = $("#txtMedicalSubQuestionAnswer").val();
                    var tmp2 = $("#hdnMedicalSubQuestionId").val();
                    var MemberName = GetMemberNumberText(member_number);
                    //$('#SelectedMemberNumber').val("#lblnoMedicalQuestion" + SelText + "_" + question_id);
                    if (tmp1 == "") {
                        ClearCSS(member_number, question_id);
                        $('#lblnoMedicalQuestion' + MemberName + '_' + question_id).addClass('btn-primary active').removeClass('btn-default Error');
                        $('#lblyesMedicalQuestion' + MemberName + '_' + question_id).addClass('btn-default').removeClass('btn-primary active Error');
                        $('input:radio[name="MedicalQuestion' + MemberName + '_' + question_id + '"]').filter('[value="No"]').attr('checked', true);
                        $('input:radio[name="MedicalQuestion' + MemberName + '_' + question_id + '"]').filter('[value="Yes"]').attr('checked', false);
                    }
                    else {
                        $('#lblyesMedicalQuestion' + MemberName + '_' + question_id).addClass('btn-primary active').removeClass('btn-default Error');
                        $('#lblnoMedicalQuestion' + MemberName + '_' + question_id).addClass('btn-default').removeClass('btn-primary active Error');
                        $('input:radio[name="MedicalQuestion' + MemberName + '_' + question_id + '"]').filter('[value="Yes"]').attr('checked', true);
                        $('input:radio[name="MedicalQuestion' + MemberName + '_' + question_id + '"]').filter('[value="No"]').attr('checked', false);
                    }
                }
            });
    });
}

function _ReligareOtherMedicalDetails(question_id, current_element, member_number) {
    //Created By Pramod for Religare on 01.09.2015 for select 'Yes' for 1st Question 
    //when any of the preexisting disease is selected Yes.
    if ($("#HiddenPlan_ID").val() == 81) {
        if (member_number == 1) { $('input[name=MedicalQuestionSelf_241][value=Yes]').prop('checked', true); }
        if (member_number == 2) { $('input[name=MedicalQuestionSpouse_241][value=Yes]').prop('checked', true); }
        if (member_number == 3) { $('input[name=MedicalQuestionFather_241][value=Yes]').prop('checked', true); }
        if (member_number == 4) { $('input[name=MedicalQuestionMother_241][value=Yes]').prop('checked', true); }
        if (member_number == 5) { $('input[name=MedicalQuestionKid1_241][value=Yes]').prop('checked', true); }
        if (member_number == 6) { $('input[name=MedicalQuestionKid2_241][value=Yes]').prop('checked', true); }
        if (member_number == 7) { $('input[name=MedicalQuestionKid3_241][value=Yes]').prop('checked', true); }
        if (member_number == 8) { $('input[name=MedicalQuestionKid4_241][value=Yes]').prop('checked', true); }
    }
    else if ($("#HiddenPlan_ID").val() == 189) {
        if (member_number == 1) { $('input[name=MedicalQuestionSelf_323][value=Yes]').prop('checked', true); }
        if (member_number == 2) { $('input[name=MedicalQuestionSpouse_323][value=Yes]').prop('checked', true); }
        if (member_number == 3) { $('input[name=MedicalQuestionFather_323][value=Yes]').prop('checked', true); }
        if (member_number == 4) { $('input[name=MedicalQuestionMother_323][value=Yes]').prop('checked', true); }
        if (member_number == 5) { $('input[name=MedicalQuestionKid1_323][value=Yes]').prop('checked', true); }
        if (member_number == 6) { $('input[name=MedicalQuestionKid2_323][value=Yes]').prop('checked', true); }
        if (member_number == 7) { $('input[name=MedicalQuestionKid3_323][value=Yes]').prop('checked', true); }
        if (member_number == 8) { $('input[name=MedicalQuestionKid4_323][value=Yes]').prop('checked', true); }
    }
    else {
        if (member_number == 1) { $('input[name=MedicalQuestionSelf_413][value=Yes]').prop('checked', true); }
        if (member_number == 2) { $('input[name=MedicalQuestionSpouse_413][value=Yes]').prop('checked', true); }
        if (member_number == 3) { $('input[name=MedicalQuestionFather_413][value=Yes]').prop('checked', true); }
        if (member_number == 4) { $('input[name=MedicalQuestionMother_413][value=Yes]').prop('checked', true); }
        if (member_number == 5) { $('input[name=MedicalQuestionKid1_413][value=Yes]').prop('checked', true); }
        if (member_number == 6) { $('input[name=MedicalQuestionKid2_413][value=Yes]').prop('checked', true); }
        if (member_number == 7) { $('input[name=MedicalQuestionKid3_413][value=Yes]').prop('checked', true); }
        if (member_number == 8) { $('input[name=MedicalQuestionKid4_413][value=Yes]').prop('checked', true); }
    }
    //end of Reliagre Selection
    $.get('/HealthInsuranceIndia/GetOtherMedicalSubQuestion?Question_Id=' + question_id + '&Member_Number=' + member_number, function (response) {
        var _content = $.parseJSON(response);
        $("#tdOtherMedicalQuestion").html(_content);
        $('#popup2').bPopup({
            onClose: function (event) {
                var tmp1 = $("#txtSubQuestionAnswer").val();
                var tmp2 = $("#hdnOtherMedicalSubQuestionId").val();
                var tmp3 = $("#txtOtherMedicalSubQuestionAnswer").val();
                var MemberName = GetMemberNumberText(member_number);
                if (tmp1 == "") {
                    ClearCSS(member_number, question_id);
                    $('#lblnoMedicalQuestion' + MemberName + '_' + question_id).addClass('btn-primary active').removeClass('btn-default Error');
                    $('#lblyesMedicalQuestion' + MemberName + '_' + question_id).addClass('btn-default').removeClass('btn-primary active Error');
                    $('input:radio[name="MedicalQuestion' + MemberName + '_' + question_id + '"]').filter('[value="No"]').attr('checked', true);
                    $('input:radio[name="MedicalQuestion' + MemberName + '_' + question_id + '"]').filter('[value="Yes"]').attr('checked', false);
                }
                else {
                    $('#lblyesMedicalQuestion' + MemberName + '_' + question_id).addClass('btn-primary active').removeClass('btn-default Error');
                    $('#lblnoMedicalQuestion' + MemberName + '_' + question_id).addClass('btn-default').removeClass('btn-primary active Error');
                    $('input:radio[name="MedicalQuestion' + MemberName + '_' + question_id + '"]').filter('[value="Yes"]').attr('checked', true);
                    $('input:radio[name="MedicalQuestion' + MemberName + '_' + question_id + '"]').filter('[value="No"]').attr('checked', false);
                }
            }
        });
    });
}

function ActiveCSS(question_id, test, member_number) {
    if (member_number == 1) {
        $("#divMedicalQuestionSelf_" + question_id).removeClass('Error');
        $('input[name=MedicalQuestionSelf_' + question_id + '][value=No]').prop('checked', true);
    }
    if (member_number == 2) {
        $("#divMedicalQuestionSpouse_" + question_id).removeClass('Error');
        $('input[name=MedicalQuestionSpouse_' + question_id + '][value=No]').prop('checked', true);
    }
    if (member_number == 3) {
        $("#divMedicalQuestionFather_" + question_id).removeClass('Error');
        $('input[name=MedicalQuestionFather_' + question_id + '][value=No]').prop('checked', true);
    }
    if (member_number == 4) {
        $("#divMedicalQuestionMother_" + question_id).removeClass('Error');
        $('input[name=MedicalQuestionMother_' + question_id + '][value=No]').prop('checked', true);
    }
    if (member_number == 5) {
        $("#divMedicalQuestionKid1_" + question_id).removeClass('Error');
        $('input[name=MedicalQuestionKid1_' + question_id + '][value=No]').prop('checked', true);
    }
    if (member_number == 6) {
        $("#divMedicalQuestionKid2_" + question_id).removeClass('Error');
        $('input[name=MedicalQuestionKid2_' + question_id + '][value=No]').prop('checked', true);
    }
    if (member_number == 7) {
        $("#divMedicalQuestionKid3_" + question_id).removeClass('Error');
        $('input[name=MedicalQuestionKid3_' + question_id + '][value=No]').prop('checked', true);
    }
    if (member_number == 8) {
        $("#divMedicalQuestionKid4_" + question_id).removeClass('Error');
        $('input[name=MedicalQuestionKid4_' + question_id + '][value=No]').prop('checked', true);
    }
}

function ClearCSS(member_number, question_id) {
    if (member_number == 1) {
        $("#lblnoMedicalQuestionSelf_" + question_id).addClass('active');
        $("#lblyesMedicalQuestionSelf_" + question_id).removeClass('active');
    }
    if (member_number == 2) {
        $("#lblnoMedicalQuestionSpouse_" + question_id).addClass('active');
        $("#lblyesMedicalQuestionSpouse_" + question_id).removeClass('active');
    }
    if (member_number == 3) {
        $("#lblnoMedicalQuestionFather_" + question_id).addClass('active');
        $("#lblyesMedicalQuestionFather_" + question_id).removeClass('active');
    }
    if (member_number == 4) {
        $("#lblnoMedicalQuestionMother_" + question_id).addClass('active');
        $("#lblyesMedicalQuestionMother_" + question_id).removeClass('active');
    }
    if (member_number == 5) {
        $("#lblnoMedicalQuestionKid1_" + question_id).addClass('active');
        $("#lblyesMedicalQuestionKid1_" + question_id).removeClass('active');
    }
    if (member_number == 6) {
        $("#lblnoMedicalQuestionKid2_" + question_id).addClass('active');
        $("#lblyesMedicalQuestionKid2_" + question_id).removeClass('active');
    }
    if (member_number == 7) {
        $("#lblnoMedicalQuestionKid3_" + question_id).addClass('active');
        $("#lblyesMedicalQuestionKid3_" + question_id).removeClass('active');
    }
    if (member_number == 8) {
        $("#lblnoMedicalQuestionKid4_" + question_id).addClass('active');
        $("#lblyesMedicalQuestionKid4_" + question_id).removeClass('active');
    }
}

//Added by Pramod on 27.06.2016 for changes as per religare changes in PED Question
function _ReligareOtherSmokeMedicalDetails(question_id, current_element, member_number) {
    //Created By Pramod for Religare on 01.09.2015 for select 'Yes' for 1st Question 
    //when any of the preexisting disease is selected Yes.
    if ($("#HiddenPlan_ID").val() == 81) {
        if (member_number == 1) { $('input[name=MedicalQuestionSelf_241][value=Yes]').prop('checked', true); }
        if (member_number == 2) { $('input[name=MedicalQuestionSpouse_241][value=Yes]').prop('checked', true); }
        if (member_number == 3) { $('input[name=MedicalQuestionFather_241][value=Yes]').prop('checked', true); }
        if (member_number == 4) { $('input[name=MedicalQuestionMother_241][value=Yes]').prop('checked', true); }
        if (member_number == 5) { $('input[name=MedicalQuestionKid1_241][value=Yes]').prop('checked', true); }
        if (member_number == 6) { $('input[name=MedicalQuestionKid2_241][value=Yes]').prop('checked', true); }
        if (member_number == 7) { $('input[name=MedicalQuestionKid3_241][value=Yes]').prop('checked', true); }
        if (member_number == 8) { $('input[name=MedicalQuestionKid4_241][value=Yes]').prop('checked', true); }
    }
    else {
        if (member_number == 1) { $('input[name=MedicalQuestionSelf_323][value=Yes]').prop('checked', true); }
        if (member_number == 2) { $('input[name=MedicalQuestionSpouse_323][value=Yes]').prop('checked', true); }
        if (member_number == 3) { $('input[name=MedicalQuestionFather_323][value=Yes]').prop('checked', true); }
        if (member_number == 4) { $('input[name=MedicalQuestionMother_323][value=Yes]').prop('checked', true); }
        if (member_number == 5) { $('input[name=MedicalQuestionKid1_323][value=Yes]').prop('checked', true); }
        if (member_number == 6) { $('input[name=MedicalQuestionKid2_323][value=Yes]').prop('checked', true); }
        if (member_number == 7) { $('input[name=MedicalQuestionKid3_323][value=Yes]').prop('checked', true); }
        if (member_number == 8) { $('input[name=MedicalQuestionKid4_323][value=Yes]').prop('checked', true); }
    }
    //end of Reliagre Selection
    $.get('/HealthInsuranceIndia/GetOtherSmokeMedicalSubQuestion?Question_Id=' + question_id + '&Member_Number=' + member_number, function (response) {
        var _content = $.parseJSON(response);
        //alert(_content);
        $("#tdOtherSmokeMedicalQuestion").html(_content);
        $('#popup3').bPopup({
            onClose: function (event) {
                var tmp1 = $("#txtSmokeSubQuestionAnswer").val();
                var tmp2 = $("#hdnOtherSmokeMedicalSubQuestionId").val();
                var tmp3 = $("#txtOtherSmokeMedicalSubQuestionAnswer").val();
                var MemberName = GetMemberNumberText(member_number);
                if (tmp1 == "") {
                    ClearCSS(member_number, question_id);
                    $('#lblnoMedicalQuestion' + MemberName + '_' + question_id).addClass('btn-primary active').removeClass('btn-default Error');
                    $('#lblyesMedicalQuestion' + MemberName + '_' + question_id).addClass('btn-default').removeClass('btn-primary active Error');
                    $('input:radio[name="MedicalQuestion' + MemberName + '_' + question_id + '"]').filter('[value="No"]').attr('checked', true);
                    $('input:radio[name="MedicalQuestion' + MemberName + '_' + question_id + '"]').filter('[value="Yes"]').attr('checked', false);
                }
                else {
                    $('#lblyesMedicalQuestion' + MemberName + '_' + question_id).addClass('btn-primary active').removeClass('btn-default Error');
                    $('#lblnoMedicalQuestion' + MemberName + '_' + question_id).addClass('btn-default').removeClass('btn-primary active Error');
                    $('input:radio[name="MedicalQuestion' + MemberName + '_' + question_id + '"]').filter('[value="Yes"]').attr('checked', true);
                    $('input:radio[name="MedicalQuestion' + MemberName + '_' + question_id + '"]').filter('[value="No"]').attr('checked', false);
                }
                //alert(tmp2);
                //if (tmp1 == "") {
                //    if (member_number == 5) {
                //        $("#lblnoMedicalQuestionKid1_" + qid).addClass('active');
                //        $("#lblyesMedicalQuestionKid1_" + qid).removeClass('active');
                //    }
                //    if (member_number == 2) {
                //        $("#lblnoMedicalQuestionSpouse_" + qid).addClass('active');
                //        $("#lblyesMedicalQuestionSpouse_" + qid).removeClass('active');
                //    }
                //    if (member_number == 1) {
                //        $("#lblnoMedicalQuestionSelf_" + qid).addClass('active');
                //        $("#lblyesMedicalQuestionSelf_" + qid).removeClass('active');
                //    }
                //    $('input:radio[name=' + current_element.id + '][value=' + 'No' + ']').prop('checked', true);
                //}
            }
        });
    });
}
//End of Pramod code
if ($("#SameAsForNominee") != null) {
    $("#SameAsForNominee").change(function () {
        if ($("#SameAsForNominee:checked").val()) {
            SetAddressToNomineeAddress(true);
        }
        else {

            $("#NomineeAddress").val("").addClass('Error');

            $("#NomineeCityID").val(0);

            $("#NomineeAddress").val("");
            $("#NomineeCityName").val("");
            $("#NomineePinCode").val("");
            $("#dvNomineeAddress").addClass('errorClass1');
            $("#dvNomineeCityName").addClass('errorClass1');
            $("#dvNomineePinCode").addClass('errorClass1');

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

function SetAddressToNomineeAddress(_isSet) {
    if (_isSet) {
        var address = $("#ContactAddress").val() + ',' + $("#ContactAddress2").val();

        $("#NomineeAddress").val(address)
        $("#dvNomineeAddress").removeClass('errorClass1');

        $("#NomineeCityID").val($("#ContactCityID").val());

        $("#NomineeCityName").val($("#ContactCityName").val())
        $("#dvNomineeCityName").removeClass('errorClass1');
        $("#NomineePinCode").val($("#ContactPinCode").val())
        $("#dvNomineePinCode").removeClass('errorClass1');

        $("#NomineeCityName").val($("#ContactCityName").val()).removeClass('Error');
        $("#NomineePinCode").val($("#ContactPinCode").val()).removeClass('Error');

    }
}
function validateDate(txtDate) {
    
    var filter = new RegExp("(0[123456789]|10|11|12)([/])([1-2][0-9][0-9][0-9])");
    if (filter.test(txtDate) && txtDate.length == 7) {
        var d = new Date();
        var n = d.getFullYear();
        var dat = txtDate.split('/');
        var checkdate = dat[1];
        if (checkdate >= n)
        {
            return false;
        }
        else
        {
            return true;
        }
        
    }
    else
        return false;
}

//Added By Pratik On 23-03-2017 - Starts
function ClearDivClass(id) {
    $('#' + $(id).closest('.btn-group').attr('id')).removeClass('Error');
}//Added By Pratik On 23-03-2017 - Ends

//Added By Pratik On 06-04-2017 - Starts
function TermAndCondition(id, IsCustomer) {
    if (!$(id).prop('checked')) {
        $("#FinalSubmit").val("0");
        $("#TermCondition").addClass('glyphs'); $(id).addClass('errorCheckBox');
    }
    else {
        $("#FinalSubmit").val("1");
        $(id).removeClass('errorCheckBox');
    }
}//Added By Pratik On 06-04-2017 - Ends

function checkText(input) {
    //var pattern = new RegExp('^[a-zA-Z]+$');
    var pattern = new RegExp('^[a-zA-Z ]*$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkTextWithSpace(input) {
    var pattern = new RegExp('^[a-zA-Z ]+$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkNumeric(input) {
    var pattern = new RegExp('^[0-9]*$');
    var dvid = "dv" + $(input).attr('id');//var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkAlphaNumeric(input) {
    var pattern = new RegExp('^[a-zA-Z0-9]+$'); //var pattern = new RegExp('^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkAlphaNumericWithSpace(input) {
    var pattern = new RegExp('^[a-zA-Z0-9 ]+$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkPolicyNumber(input) {
    var pattern = new RegExp('^[a-zA-Z0-9-/]+$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkAddress(input) {
//    var pattern = new RegExp('^[a-zA-Z0-9-#,:\'./ ]+$');
//    var dvid = "dv" + $(input).attr('id');
//    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
//    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkPincode(input) {
    var pattern = new RegExp('^([1-9]{1}[0-9]{5})$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkMobile(input) {
    var pattern = new RegExp('^([7-9]{1}[0-9]{9})$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkEmail(input) {
    var pattern = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkCity1(input) {
    var pattern = new RegExp('^[a-zA-Z ,]+$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkFlat(input) {
    var pattern = new RegExp('^[0-9a-zA-Z ,/-]+$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkPassport(input) {
    var pattern = new RegExp('^[A-Z]{1}[0-9]{7}$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkPAN(input) {
    var pattern = new RegExp('^[A-Z]{5}[0-9]{4}[A-Z]{1}$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}

$('#ContactMobile').keypress(function () {
    return this.value.length < 10
})
$('.Pincode').keypress(function () {
    return this.value.length < 6
})
$('.Length2').keypress(function () {
    return this.value.length < 2
})
$('.Length3').keypress(function () {
    return this.value.length < 3
})
$('.Length4').keypress(function () {
    return this.value.length < 4
})

//Code For Radio Yes / No Selection Starts
function Select1(ID) {
    debugger
    var NextId = $("#" + ID.id).next('.btn').attr('id');   
    $("#" + ID.id).addClass('btn-primary active').removeClass('btn-default Error');
    $("#" + NextId).addClass('btn-default').removeClass('btn-primary active Error');

    $("#" + ID.id).find('input:radio').attr('checked', true);
    $("#" + NextId).find('input:radio').attr('checked', false);
}
function SelectEdelweiss(ID,questionId) {   
    var NextId = $("#" + ID.id).next('.btn').attr('id');
    $("#txtMedicalSubQuestionAnswer").val('');
    $("#" + ID.id).addClass('btn-primary active').removeClass('btn-default Error');
    $("#" + NextId).addClass('btn-default').removeClass('btn-primary active Error');

    $("#" + ID.id).find('input:radio').attr('checked', true);
    $("#" + NextId).find('input:radio').attr('checked', false);
}

function Select2(ID) {
    debugger
    var PrevId = $("#" + ID.id).prev('.btn').attr('id');
    $("#" + ID.id).addClass('btn-primary active').removeClass('btn-default Error');
    $("#" + PrevId).addClass('btn-default').removeClass('btn-primary active Error');

    $("#" + ID.id).find('input:radio').attr('checked', true);
    $("#" + PrevId).find('input:radio').attr('checked', false);
}

function GetMemberNumberText(MemberNumber) {
    var Text = "";
    switch (MemberNumber) {
        case "1":   case 1:     Text = "Self";      break;
        case "2":   case 2:     Text = "Spouse";    break;
        case "3":   case 3:     Text = "Father";    break;
        case "4":   case 4:     Text = "Mother";    break;
        case "5":   case 5:     Text = "Kid1";      break;
        case "6":   case 6:     Text = "Kid2";      break;
        case "7":   case 7:     Text = "Kid3";      break;
        case "8":   case 8:     Text = "Kid4";      break;
    }
    return Text;
}

//By Pratik - Dynamic Radiobutton Selection Code Starts (For Medical Questions)
function SelectYes(qid, id, member_number) {
    var MemberName = GetMemberNumberText(member_number);
    $('#lblyesMedicalQuestion' + MemberName + '_' + qid).addClass('btn-primary active').removeClass('btn-default Error');
    $('#lblnoMedicalQuestion' + MemberName + '_' + qid).addClass('btn-default').removeClass('btn-primary active Error');
    $('input:radio[name="MedicalQuestion' + MemberName + '_' + qid + '"]').filter('[value="Yes"]').attr('checked', true);
    $('input:radio[name="MedicalQuestion' + MemberName + '_' + qid + '"]').filter('[value="No"]').attr('checked', false);
}
function SelectNo(qid, id, member_number) {
    var MemberName = GetMemberNumberText(member_number);
    $('#lblnoMedicalQuestion' + MemberName + '_' + qid).addClass('btn-primary active').removeClass('btn-default Error');
    $('#lblyesMedicalQuestion' + MemberName + '_' + qid).addClass('btn-default').removeClass('btn-primary active Error');
    $('input:radio[name="MedicalQuestion' + MemberName + '_' + qid + '"]').filter('[value="No"]').attr('checked', true);
    $('input:radio[name="MedicalQuestion' + MemberName + '_' + qid + '"]').filter('[value="Yes"]').attr('checked', false);
}
//Dynamic Radiobutton Selection Code Starts

$('.Weight').keypress(function () {
    return this.value.length < 3
})
$('#AadharNumber').keypress(function () {
    return this.value.length < 12
})
$('#ContactAnnualIncome').keypress(function () {
    return this.value.length < 10
})

$('.Address').keypress(function () {
    return this.value.length < 50
})

$(window).load(function () {
  
    if ($("#HdnIsCustomer").val() == "0") {
        
       // var contactname = $('#ContactName').val();
     
     //   $('#ContactName').val(contactname);
       //  $('#ContactLastName').val("");
         
        //$('#SelfTitle').val("TITLE");
        //$('#SelfTitle').prev('.selectbox-highlight').hide();

        //$('#SelfTitle').prev('.selectbox-highlight').hide();
        //$('#SelfTitle').val("0").attr("selected", "selected");l

        
         $('#RelProposerKid1ID').val(0);
        $('#spnTitle').hide();
      //  $('#ContactDOB').val("");
        $('#ContactMaritalStatusId').val(0);
        $('#ContactOccupationId').val(0);
        $('#gstIdNumber').val("");
        $('#AadharNumber').val("");
        $('#ContactAddress').val("");
        $('#ContactAddress2').val("");
        $('#ContactPinCode').val("");
        $('#DistrictName').val('');
        $('#StateName').val('');
        $('#SelfName').val("");
        $('#SelfHeight').val(0);
        $('#SelfWeight').val("");
        $('#SelfOccupationID').val(0);
        $('#NomineeRelationID').val(0);
        $('#NomineeName').val("");

        $('#NomineeCityName').removeClass('used');
        $('#NomineeCityID').removeClass('used');

        $('#IsMediQuestionSelf').val(0);

        $('#SpouseName').val("");
        $('#SpouseHeight').val(0);
        $('#SpouseWeight').val("");
        $('#SpouseOccupationID').val(0);
        $('#IsMediQuestionSpouse').val(0);

        $('#FatherName').val("");
        $('#FatherHeight').val(0);
        $('#FatherWeight').val("");
        $('#FatherOccupationID').val(0);
        $('#IsMediQuestionFather').val(0);

        $('#MotherName').val("");
        $('#MotherHeight').val(0);
        $('#MotherWeight').val("");
        $('#MotherOccupationID').val(0);
        $('#IsMediQuestionMother').val(0);

        $('#Kid1Name').val("");
        $('#Kid1Height').val(0);
        $('#Kid1Weight').val("");
        $('#Kid1OccupationID').val(0);
        $('#IsMediQuestionKid1').val(0);

        $('#Kid2Name').val("");
        $('#Kid2Height').val(0);
        $('#Kid2Weight').val("");
        $('#Kid2OccupationID').val(0);
        $('#IsMediQuestionKid2').val(0);

        $('#Kid3Name').val("");
        $('#Kid3Height').val(0);
        $('#Kid3Weight').val("");
        $('#Kid3OccupationID').val(0);
        $('#IsMediQuestionKid3').val(0);

        $('#Kid4Name').val("");
        $('#Kid4Height').val(0);
        $('#Kid4Weight').val("");
        $('#Kid4OccupationID').val(0);
        $('#IsMediQuestionKid4').val(0);
        $('#ContactCityName').val("");
        $('#ContactCityName').removeClass('used');
        $('#ContactCityID').val("");
        $('#ContactCityID').removeClass('used');

        $('input[type=radio]').each(function () {
           // console.log($(this).val() + "=" + $(this).attr('id'));
            if ($(this).val() == "Yes" || $(this).val() == "No") {
                $(this).filter('[value="Yes"]').attr('checked', false);
                $(this).filter('[value="No"]').attr('checked', true);
                $('#lblyes' + $(this).attr('id')).addClass('btn-default').removeClass('btn-primary active');
                $('#lblno' + $(this).attr('id')).addClass('btn-primary active').removeClass('btn-default');
            }
        });
    }
    else
     {
        $('input[type=radio]').each(function () {
           //  console.log($(this).val()+"="+$(this).attr('id'));
            if ($(this).val() == "Yes" && $(this).prop("checked")) {
                $(this).filter('[value="Yes"]').attr('checked', true);
                $(this).filter('[value="No"]').attr('checked', false);
                $('#lblyes' + $(this).attr('id')).addClass('btn-primary active').removeClass('btn-default');
                $('#lblno' + $(this).attr('id')).addClass('btn-default').removeClass('btn-primary active');
            }
            if ($(this).val() == "No" && $(this).prop("checked")) {
                $(this).filter('[value="No"]').attr('checked', true);
                $(this).filter('[value="Yes"]').attr('checked', false);
                $('#lblno' + $(this).attr('id')).addClass('btn-primary active').removeClass('btn-default');
                $('#lblyes' + $(this).attr('id')).addClass('btn-default').removeClass('btn-primary active');
            }
        });      

        $('input:checkbox[id^="MedicalQuestion"]:checked').each(function(){
          //  console.log($(this).val() + "=" + $(this).attr('id'));
            if ($(this).prop("checked")) { $(this).attr('checked', true); }
            else { $(this).attr('checked', false); }
        });    
     }

    $('input[type=number]').each(function () {
         if ($(this).val() == 0) { $(this).val(""); $(this).addClass('used');}
     });
    if ($('#SelfTitle option:selected').text() == "TITLE") { $('#spnTitle').hide(); }
    else { $('#spnTitle').show(); }

    //else {
    //    if ($('#ContactPinCode').val("") != "") {
    //        GetPincodeDetails($('#ContactPinCode').val());
    //    }
    //}

    $("input").each(function () {
        var element = $(this);
        if (element.val() == "") { $(element).removeClass('used'); }
        else { $(element).addClass('used'); }
    });
    $('select').each(function () {
        var ThisValue = $('option:selected', this).html();
        if ($(this).val() == "0" || ThisValue == "TITLE" || ThisValue == "SELECT AREA" || ThisValue == "SELECT OCCUPATION" || ThisValue == "SELECT RELATION" || ThisValue == "SELECT HEIGHT" || ThisValue == "SELECT QUALIFICATION" || ThisValue == "SELECT RELATIONSHIP" || ThisValue == "HEIGHT") {
            $(this).prev('.selectbox-highlight').hide();
        }
        else { $(this).prev('.selectbox-highlight').show(); }
    });
});