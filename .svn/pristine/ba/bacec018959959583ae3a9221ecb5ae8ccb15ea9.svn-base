$(document).ready(function () {
    $('.selectbox-highlight').hide();
 
    $('input').focusout(function () {
        var input = $.trim($(this).val());      
        if (input.length == 0) { $(this).val(''); $(this).removeClass('used'); }
        else { $(this).addClass('used'); }

        if ($(this).attr('id') == 'AadharNumber' && $("#AadharNumber").val().length != 12) {
            $('#dvAadharNumber').addClass("Error");
        }
    });
    $('input').each(function () {
        var element = $(this);
        if (element.val() == "" || element.val() == "0") { $(element).removeClass('used'); }
        else { $(element).addClass('used'); }
    });
    $('select').each(function () {
        var ThisValue = $('option:selected', this).html();
        if ($(this).val() == "0" || $(this).val() == "" || ThisValue == "Select Salutation" || ThisValue == "Relation With Proposer") { $(this).prev('.selectbox-highlight').hide(); }
        else { $(this).prev('.selectbox-highlight').show(); }
    });

    $('select').on('change blur', function () {
        var ThisValue = $('option:selected', this).html();
        if ($(this).val() == "0" || $(this).val() == "" || ThisValue == "Select Salutation" || ThisValue == "Relation With Proposer") {
            $(this).prev('.selectbox-highlight').hide();
            $(this).addClass('Error');
            if ($(this).hasClass('NotRequired')) { $(this).removeClass('Error'); }
        }
        else { $(this).prev('.selectbox-highlight').show(); $(this).removeClass('Error'); }
    });
    $('input').blur(function () {
        var $this = $(this);
        var $dvthis = $('#dv' + $(this).attr('id') + '');
        if ($this.val()) { $this.addClass('used'); $dvthis.removeClass('Error'); }
        else { $this.removeClass('used'); $dvthis.addClass('Error'); }
        if ($this.hasClass('NotRequired')) { $dvthis.removeClass('Error'); }
    });

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
    $('.MedicalBorder').keypress(function () {
        return this.value.length < 2
    })
    
    //$('.OnlyText').keydown(function (e) {
    //    var key = e.keyCode;
    //    if (!((key == 8) || (key == 9) || (key == 46) || (key >= 35 && key <= 40) || (key >= 65 && key <= 90))) { e.preventDefault(); }
    //});
    //$('.OnlyTextWithSpace').keydown(function (e) {
    //    var key = e.keyCode;
    //    if (!((key == 8) || (key == 9) || (key == 32) || (key == 46) || (key >= 35 && key <= 40) || (key >= 65 && key <= 90))) { e.preventDefault(); }
    //});
    //$('.OnlyNumber').keypress(function (e) {
    //    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) { return false; }
    //});
    //$('.AlphaNumeric').keypress(function (e) {
    //    if (e.which != 8 && e.which != 0 && (e.which < 65 || e.which > 90) && (e.which < 96 || e.which > 123) && (e.which < 48 || e.which > 57))
    //    { return false; }
    //});
    //$('.Mobile').keypress(function (e) {
    //    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) { return false; }
    //});
    //$('.PinCode').keypress(function (e) {
    //    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) { return false; }
    //});
    //$('.Address').keydown(function (e) {
    //    var key = e.keyCode;
    //    if (!((key == 8) || (key == 9) || (key == 32) || (key >= 37 && key <= 40) || (key >= 44 && key <= 57) || (key >= 65 && key <= 90) || (key == 92)
    //        || (key >= 97 && key <= 122) || (key == 188) || (key == 189) || (key == 190) || (key == 191) || (key == 220))) {
    //        e.preventDefault();
    //    }
    //});
});

// Validation Of Fields Starts
function checkText(input) {
    var pattern = new RegExp('^[a-zA-Z]+$');
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
    var dvid = "dv" + $(input).attr('id');
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
    var pattern = new RegExp('^[a-zA-Z0-9-,./ ]+$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
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

function checkPAN_New(input) {
    var pattern = new RegExp('^[a-z]{5}[0-9]{4}[a-z]{1}$');
    var dvid = "dv" + $(input).attr('id');
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function TermAndCondition(id) {
    if ($(id).prop('checked') == false) { $("#IOnline").addClass('glyphs'); $(id).addClass('errorCheckBox'); }
    else { $(id).removeClass('errorCheckBox'); }
}
function checkLength(id) {
    if (id.length > 10) { return false; }
}
// Validation Of Fields Ends

// Validation Of Sections Starts
function ValidatePersonalInfo() {   
    $ContactTitleId = $('#ContactTitleId');
    $ContactName = $('#ContactName');
    $ContactDOB = $('#ContactDOB');
    $ContactMobile = $('#ContactMobile');
    $ContactEmail = $('#ContactEmail');
    var MobilePattern = new RegExp('^([7-9]{1}[0-9]{9})$');
    var EmailPattern = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$');
    var err = 0;
    if ($ContactTitleId.val() == 'TITLE' || $ContactTitleId.val() == "0") { $ContactTitleId.addClass('Error'); err++; }
    else { $ContactTitleId.removeClass('Error'); }
    if ($ContactName.val() == "" || checkTextWithSpace($ContactName) == false) { $("#dvContactName").addClass('Error'); err++; }
    else {
        var data = $ContactName.val();
        var arr = data.split(' ');
        if (arr[1] != null && arr[1] != "") { $("#dvContactName").removeClass('Error'); }
        else { $("#dvContactName").addClass('Error'); err++; }
    }
    if ($ContactMobile.val() == "" || $ContactMobile.val().length != 10 || (MobilePattern.test($ContactMobile.val()) == false)) { $("#dvContactMobile").addClass('Error'); err++; }
    else { $("#dvContactMobile").removeClass('Error'); }
    if ($ContactEmail.val() == "" || (EmailPattern.test($ContactEmail.val()) == false)) { $("#dvContactEmail").addClass('Error'); err++; }
    else { $("#dvContactEmail").removeClass('Error'); }
    if ($ContactDOB.val() == "") { $("#dvContactDOB").addClass('Error'); err++; }
    else { $("#dvContactDOB").removeClass('Error'); }
    if (err < 1) {       
        return true;      
    }
    else {       
        return false;
    }
}
function ValidateContactInfo() {
    $ContactAddress = $('#ContactAddress');
    $ContactAddress2 = $('#ContactAddress2');
    $ContactAddress3 = $('#ContactAddress3');
    $ContactCityName = $('#ContactCityName');
    $ContactPinCode = $('#ContactPinCode');
    $DistrictName = $('#DistrictName');
    $StateName = $('#StateName');
    $PostOfficeId = $('#PostOfficeId');
    $Pancard = $('#Pancard');

    var PinCodePattern = new RegExp('^([1-9]{1}[0-9]{5})$');
    var err = 0;
    if ($ContactAddress.val() == "" || checkAddress($ContactAddress) == false) { $("#dvContactAddress").addClass('Error'); err++; }
    else { $("#dvContactAddress").removeClass('Error'); }
    if ($ContactAddress2.val() == "" || checkAddress($ContactAddress2) == false) { $("#dvContactAddress2").addClass('Error'); err++; }
    else { $("#dvContactAddress2").removeClass('Error'); }
    if ($ContactPinCode.val() == "") { $("#dvContactPinCode").addClass('Error'); err++; }
    else if ($ContactPinCode.val() != "" && $ContactPinCode.val().length != 6) { $("#dvContactPinCode").addClass('Error'); err++; }
    else { $("#dvContactPinCode").removeClass('Error'); }
    if ($DistrictName.val() == "") { $('#ContactPinCod').focus(); $("#dvDistrictName").addClass('Error'); err++; }
    else { $("#dvDistrictName").removeClass('Error'); }
    if ($StateName.val() == "") { $("#dvStateName").addClass('Error'); err++; }
    else { $("#dvStateName").removeClass('Error'); }
    if ($PostOfficeId.val() == 0 || $PostOfficeId.val() == "0") { $("#PostOfficeId").addClass('Error'); err++; }
    else { $("#PostOfficeId").removeClass('Error'); }
    if ($("#HiddenAnualPREMIUM").val() >= 50000) {
        if ($Pancard.val() == 0 || $Pancard.val() == "0" || checkPAN_New($Pancard) == false || $Pancard.val() == "") { $("#dvPancard").addClass('Error'); err++; }
        else {
            $("#dvPancard").removeClass('Error');
        }
    }
  
    if ($('#InsurerId').val() == "42" && ($("#FatherSelect").val() == "True" || $("#MotherSelect").val() == "True")) {
        if ($("#AadharNumber").val() == "" && $("#UIDNumber").val() == "") {
            $("#dvAadharNumber").addClass('Error'); $("#dvUIDNumber").addClass('Error'); err++;
        }
        else if (($("#AadharNumber").val().length == 12) && ($("#UIDNumber").val() == "")) {

            $("#dvAadharNumber").removeClass('Error'); $("#dvUIDNumber").removeClass('Error');
        }
        else if (($("#AadharNumber").val().length != 12) && ($("#UIDNumber").val() == "")) {

            $("#dvAadharNumber").addClass('Error'); $("#dvUIDNumber").addClass('Error'); err++;
        }
        else {

            $("#dvAadharNumber").removeClass('Error');
            if ($("#UIDNumber").val() != "") {
                var valValidate = $("#UIDNumber").val();
                valValidate = valValidate.replace("/", "").replace("/", "").replace("/", "");
                var res = valValidate.split(" ");
                if ($.isNumeric(res[0])) {
                    var vardatevalidate = ValidateDate(res[1] + " " + res[2]);
                    if (vardatevalidate) {
                        $("#dvUIDNumber").removeClass('Error');
                        $("#dvAadharNumber").removeClass('Error');
                    }
                    else {
                        $("#dvUIDNumber").addClass('Error'); err++;
                    }
                }
                else {
                    $("#dvUIDNumber").addClass('Error'); err++;
                }
            }
        }
    }
    if (err < 1) { return true; }
    else { return false; }
}

function ValidateSelfInfo() {  
    $SelfTitleId = $('#SelfTitleId');
    $SelfName = $('#SelfName');
    $SelfLastName = $('#SelfLastName');
    $SelfDOB = $('#SelfDOB');
    $NomineeRelSelfID = $('#NomineeRelSelfID');
    $NomineeNameSelf = $('#NomineeNameSelf');
    $RelProposerSelf = $('#RelProposerSelf');
    $SelfHeight = $('#SelfHeight');
    $SelfWeight = $('#SelfWeight');
    $SelfOccupation = $('#SelfOccupation');
    $SelfPreExistingId = $('#SelfPreExistingId');
    $SelfPreExistingValue = $('#SelfPreExistingValue');
    $SelfMaritalStatusID = $('#SelfMaritalStatusID');   
    var err = 0;
    var chkSelf = $('#IsMediQuestionSelf').is(':checked');
    if (!chkSelf) { $("#IsMediQuestionSelf").addClass('errorCheckBox'); err++; }
    else { $("#IsMediQuestionSelf").removeClass('errorCheckBox'); }

    if ($SelfTitleId.val() == 'TITLE' || $SelfTitleId.val() == "0") { $SelfTitleId.addClass('Error'); err++; }
    else { $SelfTitleId.removeClass('Error'); }

    if ($('#InsurerId').val() == "42") {
       
        if ($("#AadharNumber").val().length != 12)
        {
            $("#dvAadharNumber").addClass('Error');
        }


        //if ($("#AadharNumber").val() == "" && $("#UIDNumber").val() == "") {
        //    $("#dvAadharNumber").addClass('Error'); $("#dvUIDNumber").addClass('Error'); err++;
        //}
        //else if (($("#AadharNumber").val().length == 12) && ($("#UIDNumber").val() == "")) {
            
        //    $("#dvAadharNumber").removeClass('Error'); $("#dvUIDNumber").removeClass('Error');
        //}
        //else if (($("#AadharNumber").val().length != 12) && ($("#UIDNumber").val() == "")) {
        
        //    $("#dvAadharNumber").addClass('Error'); $("#dvUIDNumber").addClass('Error'); err++;
        //}
        //else {           
         
        //    $("#dvAadharNumber").removeClass('Error');
        //    if ($("#UIDNumber").val() != "") {
        //        var valValidate = $("#UIDNumber").val();
        //        valValidate = valValidate.replace("/", "").replace("/", "").replace("/", "");
        //        var res = valValidate.split(" ");
        //        if ($.isNumeric(res[0])) {
        //            var vardatevalidate = ValidateDate(res[1] + " " + res[2]);
        //            if (vardatevalidate) {
        //                $("#dvUIDNumber").removeClass('Error');
        //                $("#dvAadharNumber").removeClass('Error');
        //            }
        //            else {
        //                $("#dvUIDNumber").addClass('Error'); err++;
        //            }
        //        }
        //        else {
        //            $("#dvUIDNumber").addClass('Error'); err++;
        //        }
        //    }
        //}
    }  

    if ($SelfName.val() == "" || checkText($SelfName) == false) { $("#dvSelfName").addClass('Error'); err++; }
    else { $("#dvSelfName").removeClass('Error'); }
    if ($SelfLastName.val() == "" || checkText($SelfLastName) == false) { $("#dvSelfLastName").addClass('Error'); err++; }
    else { $("#dvSelfLastName").removeClass('Error'); }
    if ($SelfDOB.val() == "") { $("#dvSelfDOB").addClass('Error'); err++; }
    else { $("#dvSelfDOB").removeClass('Error'); }
    if ($NomineeNameSelf.val() == "" || checkTextWithSpace($NomineeNameSelf) == false) { $("#dvNomineeNameSelf").addClass('Error'); err++; }
    else { $("#dvNomineeNameSelf").removeClass('Error'); }
    if ($RelProposerSelf.val() == "0") { $("#RelProposerSelf").addClass('Error'); err++; }
    else { $("#RelProposerSelf").removeClass('Error'); }

    if ($SelfOccupation.val() == "0") { $($SelfOccupation).addClass('Error'); err++; }
    else { $($SelfOccupation).removeClass('Error'); }
    if ($SelfMaritalStatusID.val() == "0") { $($SelfMaritalStatusID).addClass('Error'); err++; }
    else { $($SelfMaritalStatusID).removeClass('Error'); }
    if ($SelfPreExistingId.val() != 0) {
        if ($SelfPreExistingValue.val() == "") { $("#SelfPreExistingValue").addClass('Error'); err++; }
        else { $("#dvSelfPreExistingValue").removeClass('Error'); }
    }    
    //Validation For Mediacal Questions In Aditya Birla Case For Self
    if ($('#InsurerId').val() == "42") {      
        if ($SelfHeight.val() == 0) { $SelfHeight.addClass('Error'); err++; }
        else { $SelfHeight.removeClass('Error'); }
        if ($SelfWeight.val() == "" || checkNumeric($SelfWeight) == false) { $("#dvSelfWeight").addClass('Error'); err++; }
        else { $("#dvSelfWeight").removeClass('Error'); }
        // 12-02-2018
        var QuestSubId = 703;
        for (var i = 1234; i < 1252; i++) {          
            if ($('#lblyesMedicalQuestionSelf_' + i).hasClass('active')) {
                if ($("#txtMedicalQuestionSelf_" + i).val() == "") {
                    $("#dvtxtMedicalQuestionSelf_" + i).addClass('Error'); err++;
                }
                else {

                    if (i != 1234)
                    {                       
                        MedicalQustions_AdityaBirla(i, QuestSubId, $("#txtMedicalQuestionSelf_" + i).val(), '1');
                        $("#dvtxtMedicalQuestionSelf_" + i).removeClass('Error');
                    }
                    else
                    {
                        var ans = "Alcohal Per Day/Year :- " + $("#AMHI_SelfBeer").val() + "/ " + $("#AMHI_SelfYearCount_Beer").val() + " Smoke Per day/Year :- " + $("#AMHI_SelfSmoke").val() + "/ " + $("#AMHI_SelfYearCount_Smoke").val() + " Gutakha Per day/Year " + $("#AMHI_SelfPouch").val() + "/ " + $("#AMHI_SelfYearCount_Pouch").val();
                        MedicalQustions_AdityaBirla(i, QuestSubId, ans, '1');
                        $("#dvtxtMedicalQuestionSelf_" + i).removeClass('Error');
                    }
                  
                }
            }
            QuestSubId = QuestSubId + 1;
        }
    }

    if (err < 1) { return true; }
    else { return false; }
}
function ValidateSpouseInfo() {
    $SpouseTitleID = $('#SpouseTitleID');
    $SpouseName = $('#SpouseName');
    $SpouseLastName = $('#SpouseLastName');
    $SpouseDOB = $('#SpouseDOB');
    $NomineeRelSpouseID = $('#NomineeRelSpouseID');
    $NomineeNameSpouse = $('#NomineeNameSpouse');
    $RelProposerSpouse = $('#RelProposerSpouse');
    $SpouseHeight = $('#SpouseHeight');
    $SpouseWeight = $('#SpouseWeight');
    $SpouseOccupation = $('#SpouseOccupation');
    $SpousePreExistingId = $('#SpousePreExistingId');
    $SpousePreExistingValue = $('#SpousePreExistingValue');
    $SpouseMaritalStatusID = $('#SpouseMaritalStatusID');
    var err = 0;
    var chkSpouse = $('#IsMediQuestionSpouse').is(':checked');
    if (!chkSpouse) { $("#IsMediQuestionSpouse").addClass('errorCheckBox'); err++; }
    else { $("#IsMediQuestionSpouse").removeClass('errorCheckBox'); }
    if ($SpouseTitleID.val() == 'TITLE' || $SpouseTitleID.val() == "0") { $SpouseTitleID.addClass('Error'); err++; }
    else { $SpouseTitleID.removeClass('Error'); }
    if ($SpouseName.val() == "" || checkText($SpouseName) == false) { $("#dvSpouseName").addClass('Error'); err++; }
    else { $("#dvSpouseName").removeClass('Error'); }
    if ($SpouseLastName.val() == "" || checkText($SpouseLastName) == false) { $("#dvSpouseLastName").addClass('Error'); err++; }
    else { $("#dvSpouseLastName").removeClass('Error'); }
    if ($SpouseDOB.val() == "") { $("#dvSpouseDOB").addClass('Error'); err++; }
    else { $("#dvSpouseDOB").removeClass('Error'); }
    if ($NomineeNameSpouse.val() == "" || checkTextWithSpace($NomineeNameSpouse) == false) { $("#dvNomineeNameSpouse").addClass('Error'); err++; }
    else { $("#dvNomineeNameSpouse").removeClass('Error'); }
    if ($RelProposerSpouse.val() == "0") { $("#RelProposerSpouse").addClass('Error'); err++; }
    else { $("#RelProposerSpouse").removeClass('Error'); }

    if ($SpouseOccupation.val() == "0") { $($SpouseOccupation).addClass('Error'); err++; }
    else { $($SpouseOccupation).removeClass('Error'); }
    if ($SpouseMaritalStatusID.val() == "0") { $($SpouseMaritalStatusID).addClass('Error'); err++; }
    else { $($SpouseMaritalStatusID).removeClass('Error'); }

    if ($SpousePreExistingId.val() != 0) {
        if ($SpousePreExistingValue.val() == "") { $("#SpousePreExistingValue").addClass('Error'); err++; }
        else { $("#dvSpousePreExistingValue").removeClass('Error'); }
    }

    //Validation For Mediacal Questions In Aditya Birla Case For Spouse
    if ($('#InsurerId').val() == "42") {
        if ($SpouseHeight.val() == 0) { $SpouseHeight.addClass('Error'); err++; }
        else { $SpouseHeight.removeClass('Error'); }
        if ($SpouseWeight.val() == "" || checkNumeric($SpouseWeight) == false) { $("#dvSpouseWeight").addClass('Error'); err++; }
        else { $("#dvSpouseWeight").removeClass('Error'); }   

        var QuestSubId = 703;
        for (var i = 1234; i < 1252; i++) {
            if ($('#lblyesMedicalQuestionSpouse_' + i).hasClass('active')) {
                if ($("#txtMedicalQuestionSpouse_" + i).val() == "") {
                    $("#dvtxtMedicalQuestionSpouse_" + i).addClass('Error'); err++;
                }
                else {

                    if (i != 1234) {
                        MedicalQustions_AdityaBirla(i, QuestSubId, $("#txtMedicalQuestionSpouse_" + i).val(), '2');
                        $("#dvtxtMedicalQuestionSpouse_" + i).removeClass('Error');
                    }
                    else {
                        var ans = "Alcohal Per Day/Year :- " + $("#AMHI_SpouseBeer").val() + "/ " + $("#AMHI_SpouseYearCount_Beer").val() + " Smoke Per day/Year :- " + $("#AMHI_SpouseSmoke").val() + "/ " + $("#AMHI_SpouseYearCount_Smoke").val() + " Gutakha Per day/Year " + $("#AMHI_SpousePouch").val() + "/" + $("#AMHI_SpouseYearCount_Pouch").val();
                        MedicalQustions_AdityaBirla(i, QuestSubId, ans, '2');
                        $("#dvtxtMedicalQuestionSpouse_" + i).removeClass('Error');
                    }

                }
            }
            QuestSubId = QuestSubId + 1;
        }        
    }
    if (err < 1) { return true; } // $("#icontabSpouseinsured").removeClass('glyphs'); return true; }
    else { return false; }
}
function ValidateFatherInfo() {
    $FatherTitleID = $('#FatherTitleID');
    $FatherName = $('#FatherName');
    $FatherLastName = $('#FatherLastName');
    $FatherDOB = $('#FatherDOB');
    $NomineeRelFatherID = $('#NomineeRelFatherID');
    $NomineeNameFather = $('#NomineeNameFather');
    $RelProposerFather = $('#RelProposerFather');
    $FatherHeight = $('#FatherHeight');
    $FatherWeight = $('#FatherWeight');
    $FatherOccupation = $('#FatherOccupation');
    $FatherPreExistingId = $('#FatherPreExistingId');
    $FatherPreExistingValue = $('#FatherPreExistingValue');
    $FatherMaritalStatusID = $('#FatherMaritalStatusID');

    var err = 0;
    var chkFather = $('#IsMediQuestionFather').is(':checked');
    if (!chkFather) { $("#IsMediQuestionFather").addClass('errorCheckBox'); err++; }
    else { $("#IsMediQuestionFather").removeClass('errorCheckBox'); }
    if ($FatherTitleID.val() == 'TITLE' || $FatherTitleID.val() == "0") { $FatherTitleID.addClass('Error'); err++; }
    else { $FatherTitleID.removeClass('Error'); }
    if ($FatherName.val() == "" || checkText($FatherName) == false) { $("#dvFatherName").addClass('Error'); err++; }
    else { $("#dvFatherName").removeClass('Error'); }
    if ($FatherLastName.val() == "" || checkText($FatherLastName) == false) { $("#dvFatherLastName").addClass('Error'); err++; }
    else { $("#dvFatherLastName").removeClass('Error'); }
    if ($FatherDOB.val() == "") { $("#dvFatherDOB").addClass('Error'); err++; }
    else { $("#dvFatherDOB").removeClass('Error'); }
    if ($NomineeNameFather.val() == "" || checkTextWithSpace($NomineeNameFather) == false) { $("#dvNomineeNameFather").addClass('Error'); err++; }
    else { $("#dvNomineeNameFather").removeClass('Error'); }
    if ($RelProposerFather.val() == "0") { $("#RelProposerFather").addClass('Error'); err++; }
    else { $("#RelProposerFather").removeClass('Error'); }

    if ($FatherOccupation.val() == "0") { $($FatherOccupation).addClass('Error'); err++; }
    else { $($FatherOccupation).removeClass('Error'); }
    if ($FatherMaritalStatusID.val() == 0) { $($FatherMaritalStatusID).addClass('Error'); err++; }
    else { $($FatherMaritalStatusID).removeClass('Error'); }
    if ($FatherPreExistingId.val() != 0) {
        if ($FatherPreExistingValue.val() == "") { $("#FatherPreExistingValue").addClass('Error'); err++; }
        else { $("#dvFatherPreExistingValue").removeClass('Error'); }
    }

    

    //Validation For Mediacal Questions In Aditya Birla Case For Father
    if ($('#InsurerId').val() == "42") {
        if ($FatherHeight.val() == 0) { $FatherHeight.addClass('Error'); err++; }
        else { $FatherHeight.removeClass('Error'); }
        if ($FatherWeight.val() == "" || checkNumeric($FatherWeight) == false) { $("#dvFatherWeight").addClass('Error'); err++; }
        else { $("#dvFatherWeight").removeClass('Error'); }
        // 12-02-2018
        var QuestSubId = 703;
        for (var i = 1234; i < 1252; i++) {
            if ($('#lblyesMedicalQuestionFather_' + i).hasClass('active')) {
                if ($("#txtMedicalQuestionFather_" + i).val() == "") {
                    $("#dvtxtMedicalQuestionFather_" + i).addClass('Error'); err++;
                }
                else {

                    if (i != 1234) {
                        MedicalQustions_AdityaBirla(i, QuestSubId, $("#txtMedicalQuestionFather_" + i).val(), '3');
                        $("#dvtxtMedicalQuestionFather_" + i).removeClass('Error');
                    }
                    else {
                        var ans = "Alcohal Per Day/Year :- " + $("#AMHI_FatherBeer").val() + "/ " + $("#AMHI_FatherYearCount_Beer").val() + " Smoke Per day/Year :- " + $("#AMHI_FatherSmoke").val() + "/ " + $("#AMHI_FatherYearCount_Smoke").val() + " Gutakha Per day/Year " + $("#AMHI_FatherPouch").val() + "/" + $("#AMHI_FatherYearCount_Pouch").val();
                        MedicalQustions_AdityaBirla(i, QuestSubId, ans, '3');
                        $("#dvtxtMedicalQuestionFather_" + i).removeClass('Error');
                    }

                }
            }
            QuestSubId = QuestSubId + 1;
        }
    }
 

    if (err < 1) { return true; } // $("#icontabFatherinsured").removeClass('glyphs'); return true; }
    else { return false; }
}
function ValidateMotherInfo() {
    $MotherTitleId = $('#MotherTitleId');
    $MotherName = $('#MotherName');
    $MotherLastName = $('#MotherLastName');
    $MotherDOB = $('#MotherDOB');
    $NomineeRelMotherID = $('#NomineeRelMotherID');
    $NomineeNameMother = $('#NomineeNameMother');
    $RelProposerMother = $('#RelProposerMother');
    $MotherHeight = $('#MotherHeight');
    $MotherWeight = $('#MotherWeight');
    $MotherOccupation = $('#MotherOccupation');
    $MotherPreExistingId = $('#MotherPreExistingId');
    $MotherPreExistingValue = $('#MotherPreExistingValue');
    $MotherMaritalStatusID = $('#MotherMaritalStatusID');
    var err = 0;
    var chkMother = $('#IsMediQuestionMother').is(':checked');
    if (!chkMother) { $("#IsMediQuestionMother").addClass('errorCheckBox'); err++; }
    else { $("#IsMediQuestionMother").removeClass('errorCheckBox'); }
    if ($MotherTitleId.val() == 'TITLE' || $MotherTitleId.val() == "0") { $MotherTitleId.addClass('Error'); err++; }
    else { $MotherTitleId.removeClass('Error'); }
    if ($MotherName.val() == "" || checkText($MotherName) == false) { $("#dvMotherName").addClass('Error'); err++; }
    else { $("#dvMotherName").removeClass('Error'); }
    if ($MotherLastName.val() == "" || checkText($MotherLastName) == false) { $("#dvMotherLastName").addClass('Error'); err++; }
    else { $("#dvMotherLastName").removeClass('Error'); }
    if ($MotherDOB.val() == "") { $("#dvMotherDOB").addClass('Error'); err++; }
    else { $("#dvMotherDOB").removeClass('Error'); }
    if ($NomineeNameMother.val() == "" || checkTextWithSpace($NomineeNameMother) == false) { $("#dvNomineeNameMother").addClass('Error'); err++; }
    else { $("#dvNomineeNameMother").removeClass('Error'); }
    if ($RelProposerMother.val() == "0") { $("#RelProposerMother").addClass('Error'); err++; }
    else { $("#RelProposerMother").removeClass('Error'); }

    if ($MotherOccupation.val() == "0") { $($MotherOccupation).addClass('Error'); err++; }
    else { $($MotherOccupation).removeClass('Error'); }
    if ($MotherMaritalStatusID.val() == 0) { $($MotherMaritalStatusID).addClass('Error'); err++; }
    else { $($MotherMaritalStatusID).removeClass('Error'); }
    if ($MotherPreExistingId.val() != 0) {
        if ($MotherPreExistingValue.val() == "") { $("#MotherPreExistingValue").addClass('Error'); err++; }
        else { $("#dvMotherPreExistingValue").removeClass('Error'); }
    }
    if ($('#InsurerId').val() == "42") {
        if ($("#AadharNumber").val() == "" && $("#UIDNumber").val() == "") {
            $("#dvAadharNumber").addClass('Error'); $("#dvUIDNumber").addClass('Error'); err++;
        }
        else if (($("#AadharNumber").val().length == 12) && ($("#UIDNumber").val() == "")) {

            $("#dvAadharNumber").removeClass('Error'); $("#dvUIDNumber").removeClass('Error');
        }
        else if (($("#AadharNumber").val().length != 12) && ($("#UIDNumber").val() == "")) {

            $("#dvAadharNumber").addClass('Error'); $("#dvUIDNumber").addClass('Error'); err++;
        }
        else {

            $("#dvAadharNumber").removeClass('Error');
            if ($("#UIDNumber").val() != "") {
                var valValidate = $("#UIDNumber").val();
                valValidate = valValidate.replace("/", "").replace("/", "").replace("/", "");
                var res = valValidate.split(" ");
                if ($.isNumeric(res[0])) {
                    var vardatevalidate = ValidateDate(res[1] + " " + res[2]);
                    if (vardatevalidate) {
                        $("#dvUIDNumber").removeClass('Error');
                        $("#dvAadharNumber").removeClass('Error');
                    }
                    else {
                        $("#dvUIDNumber").addClass('Error'); err++;
                    }
                }
                else {
                    $("#dvUIDNumber").addClass('Error'); err++;
                }
            }
        }
    }
    //Validation For Mediacal Questions In Aditya Birla Case For Mother
    if ($('#InsurerId').val() == "42") {
        if ($MotherHeight.val() == 0) { $MotherHeight.addClass('Error'); err++; }
        else { $MotherHeight.removeClass('Error'); }
        if ($MotherWeight.val() == "" || checkNumeric($MotherWeight) == false) { $("#dvMotherWeight").addClass('Error'); err++; }
        else { $("#dvMotherWeight").removeClass('Error'); }
        // 12-02-2018
        var QuestSubId = 703;
        for (var i = 1234; i < 1252; i++) {
            if ($('#lblyesMedicalQuestionMother_' + i).hasClass('active')) {
                if ($("#txtMedicalQuestionMother_" + i).val() == "") {
                    $("#dvtxtMedicalQuestionMother_" + i).addClass('Error'); err++;
                }
                else {

                    if (i != 1234) {
                        MedicalQustions_AdityaBirla(i, QuestSubId, $("#txtMedicalQuestionMother_" + i).val(), '4');
                        $("#dvtxtMedicalQuestionMother_" + i).removeClass('Error');
                    }
                    else {
                        var ans = "Alcohal Per Day/Year :- " + $("#AMHI_MotherBeer").val() + "/ " + $("#AMHI_MotherYearCount_Beer").val() + " Smoke Per day/Year :- " + $("#AMHI_MotherSmoke").val() + "/ " + $("#AMHI_MotherYearCount_Smoke").val() + " Gutakha Per day/Year " + $("#AMHI_MotherPouch").val() + "/" + $("#AMHI_MotherYearCount_Pouch").val();
                        MedicalQustions_AdityaBirla(i, QuestSubId, ans, '4');
                        $("#dvtxtMedicalQuestionMother_" + i).removeClass('Error');
                    }

                }
            }
            QuestSubId = QuestSubId + 1;
        }
    }
    if (err < 1) { return true; } // $("#icontabMotherinsured").removeClass('glyphs'); return true; }
    else { return false; }
}
function ValidateKid1Info() {
    $Kid1TitleId = $('#Kid1TitleId');
    $Kid1Name = $('#Kid1Name');
    $Kid1LastName = $('#Kid1LastName');
    $Kid1DOB = $('#Kid1DOB');
    $NomineeRelKid1ID = $('#NomineeRelKid1ID');
    $NomineeNameKid1 = $('#NomineeNameKid1');
    $RelProposerKid1ID = $('#RelProposerKid1ID');
    $Kid1Height = $('#Kid1Height');
    $Kid1Weight = $('#Kid1Weight');
    $Kid1Occupation = $('#Kid1Occupation');
    $Kid1PreExistingId = $('#Kid1PreExistingId');
    $Kid1PreExistingValue = $('#Kid1PreExistingValue');
    $Kid1MaritalStatusID = $('#Kid1MaritalStatusID');
    $RelProposerKid1 = $('#RelProposerKid1');


    var err = 0;
    var chkKid1 = $('#IsMediQuestionKid1').is(':checked');
    if (!chkKid1) { $("#IsMediQuestionKid1").addClass('errorCheckBox'); err++; }
    else { $("#IsMediQuestionKid1").removeClass('errorCheckBox'); }
    if ($Kid1TitleId.val() == 'TITLE' || $Kid1TitleId.val() == "0") { $Kid1TitleId.addClass('Error'); err++; }
    else { $Kid1TitleId.removeClass('Error'); }
    if ($Kid1Name.val() == "" || checkText($Kid1Name) == false) { $("#dvKid1Name").addClass('Error'); err++; }
    else { $("#dvKid1Name").removeClass('Error'); }
    if ($Kid1LastName.val() == "" || checkText($Kid1LastName) == false) { $("#dvKid1LastName").addClass('Error'); err++; }
    else { $("#dvKid1LastName").removeClass('Error'); }
    if ($Kid1DOB.val() == "") { $("#dvKid1DOB").addClass('Error'); err++; }
    else { $("#dvKid1DOB").removeClass('Error'); }
    if ($NomineeNameKid1.val() == "" || checkTextWithSpace($NomineeNameKid1) == false) { $("#dvNomineeNameKid1").addClass('Error'); err++; }
    else { $("#dvNomineeNameKid1").removeClass('Error'); }
    if ($RelProposerKid1ID.val() == "0") { $("#RelProposerKid1ID").addClass('Error'); err++; }
    else { $("#RelProposerKid1ID").removeClass('Error'); }

    if ($Kid1Occupation.val() == "0") { $($Kid1Occupation).addClass('Error'); err++; }
    else { $($Kid1Occupation).removeClass('Error'); }

    if ($Kid1MaritalStatusID.val() == 0) { $($Kid1MaritalStatusID).addClass('Error'); err++; }
    else { $($Kid1MaritalStatusID).removeClass('Error'); }

    if ($RelProposerKid1.val() == 0) { $($RelProposerKid1).addClass('Error'); err++; }
    else { $($RelProposerKid1).removeClass('Error'); }

    if ($Kid1PreExistingId.val() != 0) {
        if ($Kid1PreExistingValue.val() == "") { $("#Kid1PreExistingValue").addClass('Error'); err++; }
        else { $("#dvKid1PreExistingValue").removeClass('Error'); }
    }
    //Validation For Mediacal Questions In Aditya Birla Case For Kid1
    if ($('#InsurerId').val() == "42") {
        if ($Kid1Height.val() == 0) { $Kid1Height.addClass('Error'); err++; }
        else { $Kid1Height.removeClass('Error'); }
        if ($Kid1Weight.val() == "" || checkNumeric($Kid1Weight) == false) { $("#dvKid1Weight").addClass('Error'); err++; }
        else { $("#dvKid1Weight").removeClass('Error'); }
        // 12-02-2018
        var QuestSubId = 703;
        for (var i = 1234; i < 1252; i++) {
            if ($('#lblyesMedicalQuestionKid1_' + i).hasClass('active')) {
                if ($("#txtMedicalQuestionKid1_" + i).val() == "") {
                    $("#dvtxtMedicalQuestionKid1_" + i).addClass('Error'); err++;
                }
                else {

                    if (i != 1234) {
                        MedicalQustions_AdityaBirla(i, QuestSubId, $("#txtMedicalQuestionKid1_" + i).val(), '5');
                        $("#dvtxtMedicalQuestionKid1_" + i).removeClass('Error');
                    }
                    else {
                        var ans = "Alcohal Per Day/Year :- " + $("#AMHI_Kid1Beer").val() + "/ " + $("#AMHI_Kid1YearCount_Beer").val() + " Smoke Per day/Year :- " + $("#AMHI_Kid1Smoke").val() + "/ " + $("#AMHI_Kid1YearCount_Smoke").val() + " Gutakha Per day/Year " + $("#AMHI_Kid1Pouch").val() + "/" + $("#AMHI_Kid1YearCount_Pouch").val();
                        MedicalQustions_AdityaBirla(i, QuestSubId, ans, '5');
                        $("#dvtxtMedicalQuestionKid1_" + i).removeClass('Error');
                    }

                }
            }
            QuestSubId = QuestSubId + 1;
        }
    }

    if (err < 1) { return true; } // $("#icontabKid1insured").removeClass('glyphs'); return true; }
    else { return false; }
}
function ValidateKid2Info() {
    $Kid2TitleId = $('#Kid2TitleId');
    $Kid2Name = $('#Kid2Name');
    $Kid2LastName = $('#Kid2LastName');
    $Kid2DOB = $('#Kid2DOB');
    $NomineeRelKid2ID = $('#NomineeRelKid2ID');
    $NomineeNameKid2 = $('#NomineeNameKid2');
    $RelProposerKid2ID = $('#RelProposerKid2ID');
    $Kid2Height = $('#Kid2Height');
    $Kid2Weight = $('#Kid2Weight');
    $Kid2Occupation = $('#Kid2Occupation');
    $Kid2PreExistingId = $('#Kid2PreExistingId');
    $Kid2PreExistingValue = $('#Kid2PreExistingValue');
    $Kid2MaritalStatusID = $('#Kid2MaritalStatusID');
    var err = 0;
    var chkKid2 = $('#IsMediQuestionKid2').is(':checked');
    if (!chkKid2) { $("#IsMediQuestionKid2").addClass('errorCheckBox'); err++; }
    else { $("#IsMediQuestionKid2").removeClass('errorCheckBox'); }
    if ($Kid2TitleId.val() == 'TITLE' || $Kid2TitleId.val() == "0") { $Kid2TitleId.addClass('Error'); err++; }
    else { $Kid2TitleId.removeClass('Error'); }
    if ($Kid2Name.val() == "" || checkText($Kid2Name) == false) { $("#dvKid2Name").addClass('Error'); err++; }
    else { $("#dvKid2Name").removeClass('Error'); }
    if ($Kid2LastName.val() == "" || checkText($Kid2LastName) == false) { $("#dvKid2LastName").addClass('Error'); err++; }
    else { $("#dvKid2LastName").removeClass('Error'); }
    if ($Kid2DOB.val() == "") { $("#dvKid2DOB").addClass('Error'); err++; }
    else { $("#dvKid2DOB").removeClass('Error'); }
    if ($NomineeNameKid2.val() == "" || checkTextWithSpace($NomineeNameKid2) == false) { $("#dvNomineeNameKid2").addClass('Error'); err++; }
    else { $("#dvNomineeNameKid2").removeClass('Error'); }
    if ($RelProposerKid2ID.val() == 0) { $("#RelProposerKid2ID").addClass('Error'); err++; }
    else { $("#RelProposerKid2ID").removeClass('Error'); }

    if ($Kid2Occupation.val() == "0") { $($Kid2Occupation).addClass('Error'); err++; }
    else { $($Kid2Occupation).removeClass('Error'); }
    if ($Kid2MaritalStatusID.val() == 0) { $($Kid2MaritalStatusID).addClass('Error'); err++; }
    else { $($Kid2MaritalStatusID).removeClass('Error'); }
    if ($Kid2PreExistingId.val() != 0) {
        if ($Kid2PreExistingValue.val() == "") { $("#Kid2PreExistingValue").addClass('Error'); err++; }
        else { $("#dvKid2PreExistingValue").removeClass('Error'); }
    }
    //Validation For Mediacal Questions In Aditya Birla Case For Kid2
    if ($('#InsurerId').val() == "42") {
        if ($Kid2Height.val() == 0) { $Kid2Height.addClass('Error'); err++; }
        else { $Kid2Height.removeClass('Error'); }
        if ($Kid2Weight.val() == "" || checkNumeric($Kid2Weight) == false) { $("#dvKid2Weight").addClass('Error'); err++; }
        else { $("#dvKid2Weight").removeClass('Error'); }
        // 12-02-2018
        var QuestSubId = 703;
        for (var i = 1234; i < 1252; i++) {
            if ($('#lblyesMedicalQuestionKid2_' + i).hasClass('active')) {
                if ($("#txtMedicalQuestionKid2_" + i).val() == "") {
                    $("#dvtxtMedicalQuestionKid2_" + i).addClass('Error'); err++;
                }
                else {

                    if (i != 1234) {
                        MedicalQustions_AdityaBirla(i, QuestSubId, $("#txtMedicalQuestionKid2_" + i).val(), '6');
                        $("#dvtxtMedicalQuestionKid2_" + i).removeClass('Error');
                    }
                    else {
                        var ans = "Alcohal Per Day/Year :- " + $("#AMHI_Kid2Beer").val() + "/ " + $("#AMHI_Kid2YearCount_Beer").val() + " Smoke Per day/Year :- " + $("#AMHI_Kid2Smoke").val() + "/ " + $("#AMHI_Kid2YearCount_Smoke").val() + " Gutakha Per day/Year " + $("#AMHI_Kid2Pouch").val() + "/" + $("#AMHI_Kid2YearCount_Pouch").val();
                        MedicalQustions_AdityaBirla(i, QuestSubId, ans, '6');
                        $("#dvtxtMedicalQuestionKid2_" + i).removeClass('Error');
                    }

                }
            }
            QuestSubId = QuestSubId + 1;
        }
    }

    if (err < 1) { return true; } // $("#icontabKid2insured").removeClass('glyphs'); return true; }
    else { return false; }
}
function ValidateKid3Info() {
    $Kid3TitleId = $('#Kid3TitleId');
    $Kid3Name = $('#Kid3Name');
    $Kid3LastName = $('#Kid3LastName');
    $Kid3DOB = $('#Kid3DOB');
    $NomineeRelKid3ID = $('#NomineeRelKid3ID');
    $NomineeNameKid3 = $('#NomineeNameKid3');
    $RelProposerKid3ID = $('#RelProposerKid3ID');
    $Kid3Height = $('#Kid3Height');
    $Kid3Weight = $('#Kid3Weight');
    $Kid3Occupation = $('#Kid3Occupation');
    $Kid3PreExistingId = $('#Kid3PreExistingId');
    $Kid3PreExistingValue = $('#Kid3PreExistingValue');
    $Kid3MaritalStatusID = $('#Kid3MaritalStatusID');
    var err = 0;
    var chkKid3 = $('#IsMediQuestionKid3').is(':checked');
    if (!chkKid3) { $("#IsMediQuestionKid3").addClass('errorCheckBox'); err++; }
    else { $("#IsMediQuestionKid3").removeClass('errorCheckBox'); }
    if ($Kid3TitleId.val() == 'TITLE' || $Kid3TitleId.val() == 0) { $Kid3TitleId.addClass('Error'); err++; }
    else { $Kid3TitleId.removeClass('Error'); }
    if ($Kid3Name.val() == "" || checkText($Kid3Name) == false) { $("#dvKid3Name").addClass('Error'); err++; }
    else { $("#dvKid3Name").removeClass('Error'); }
    if ($Kid3LastName.val() == "" || checkText($Kid3LastName) == false) { $("#dvKid3LastName").addClass('Error'); err++; }
    else { $("#dvKid3LastName").removeClass('Error'); }
    if ($Kid3DOB.val() == "") { $("#dvKid3DOB").addClass('Error'); err++; }
    else { $("#dvKid3DOB").removeClass('Error'); }
    if ($NomineeNameKid3.val() == "" || checkTextWithSpace($NomineeNameKid3) == false) { $("#dvNomineeNameKid3").addClass('Error'); err++; }
    else { $("#dvNomineeNameKid3").removeClass('Error'); }
    if ($RelProposerKid3ID.val() == 0) { $("#RelProposerKid3ID").addClass('Error'); err++; }
    else { $("#RelProposerKid3ID").removeClass('Error'); }

    if ($Kid3Occupation.val() == 0) { $($Kid3Occupation).addClass('Error'); err++; }
    else { $($Kid3Occupation).removeClass('Error'); }
    if ($Kid3MaritalStatusID.val() == 0) { $($Kid3MaritalStatusID).addClass('Error'); err++; }
    else { $($Kid3MaritalStatusID).removeClass('Error'); }
    if ($Kid3PreExistingId.val() != 0) {
        if ($Kid3PreExistingValue.val() == "") { $("#Kid3PreExistingValue").addClass('Error'); err++; }
        else { $("#dvKid3PreExistingValue").removeClass('Error'); }
    }

    //Validation For Mediacal Questions In Aditya Birla Case For Kid3
    if ($('#InsurerId').val() == "42") {
        if ($Kid3Height.val() == 0) { $Kid3Height.addClass('Error'); err++; }
        else { $Kid3Height.removeClass('Error'); }
        if ($Kid3Weight.val() == "" || checkNumeric($Kid3Weight) == false) { $("#dvKid3Weight").addClass('Error'); err++; }
        else { $("#dvKid3Weight").removeClass('Error'); }
        // 12-02-2018
        var QuestSubId = 703;
        for (var i = 1234; i < 1252; i++) {
            if ($('#lblyesMedicalQuestionKid3_' + i).hasClass('active')) {
                if ($("#txtMedicalQuestionKid3_" + i).val() == "") {
                    $("#dvtxtMedicalQuestionKid3_" + i).addClass('Error'); err++;
                }
                else {

                    if (i != 1234) {
                        MedicalQustions_AdityaBirla(i, QuestSubId, $("#txtMedicalQuestionKid3_" + i).val(), '7');
                        $("#dvtxtMedicalQuestionKid3_" + i).removeClass('Error');
                    }
                    else {
                        var ans = "Alcohal Per Day/Year :- " + $("#AMHI_Kid3Beer").val() + "/ " + $("#AMHI_Kid3YearCount_Beer").val() + " Smoke Per day/Year :- " + $("#AMHI_Kid3Smoke").val() + "/ " + $("#AMHI_Kid3YearCount_Smoke").val() + " Gutakha Per day/Year " + $("#AMHI_Kid3Pouch").val() + "/" + $("#AMHI_Kid3YearCount_Pouch").val();
                        MedicalQustions_AdityaBirla(i, QuestSubId, ans, '7');
                        $("#dvtxtMedicalQuestionKid3_" + i).removeClass('Error');
                    }

                }
            }
            QuestSubId = QuestSubId + 1;
        }
    }

    if (err < 1) { return true; } // $("#icontabKid3insured").removeClass('glyphs'); return true; }
    else { return false; }
}
function ValidateKid4Info() {
    $Kid4TitleId = $('#Kid4TitleId');
    $Kid4Name = $('#Kid4Name');
    $Kid4LastName = $('#Kid4LastName');
    $Kid4DOB = $('#Kid4DOB');
    $NomineeRelKid4ID = $('#NomineeRelKid4ID');
    $NomineeNameKid4 = $('#NomineeNameKid4');
    $RelProposerKid4ID = $('#RelProposerKid4ID');
    $Kid4Height = $('#Kid4Height');
    $Kid4Weight = $('#Kid4Weight');
    $Kid4Occupation = $('#Kid4Occupation');
    $Kid4PreExistingId = $('#Kid4PreExistingId');
    $Kid4PreExistingValue = $('#Kid4PreExistingValue');
    $Kid4MaritalStatusID = $('#Kid4MaritalStatusID');
    var err = 0;
    var chkKid4 = $('#IsMediQuestionKid4').is(':checked');
    if (!chkKid4) { $("#IsMediQuestionKid4").addClass('errorCheckBox'); err++; }
    else { $("#IsMediQuestionKid4").removeClass('errorCheckBox'); }
    if ($Kid4TitleId.val() == 'TITLE' || $Kid4TitleId.val() == 0) { $Kid4TitleId.addClass('Error'); err++; }
    else { $Kid4TitleId.removeClass('Error'); }
    if ($Kid4Name.val() == "" || checkText($Kid4Name) == false) { $("#dvKid4Name").addClass('Error'); err++; }
    else { $("#dvKid4Name").removeClass('Error'); }
    if ($Kid4LastName.val() == "" || checkText($Kid4LastName) == false) { $("#dvKid4LastName").addClass('Error'); err++; }
    else { $("#dvKid4LastName").removeClass('Error'); }
    if ($Kid4DOB.val() == "") { $("#dvKid4DOB").addClass('Error'); err++; }
    else { $("#dvKid4DOB").removeClass('Error'); }
    if ($NomineeNameKid4.val() == "" || checkTextWithSpace($NomineeNameKid4) == false) { $("#dvNomineeNameKid4").addClass('Error'); err++; }
    else { $("#dvNomineeNameKid4").removeClass('Error'); }
    if ($RelProposerKid4ID.val() == 0) { $("#RelProposerKid4ID").addClass('Error'); err++; }
    else { $("#RelProposerKid4ID").removeClass('Error'); }
    
    if ($Kid4Occupation.val() == 0) { $($Kid4Occupation).addClass('Error'); err++; }
    else { $($Kid4Occupation).removeClass('Error'); }

    if ($Kid4MaritalStatusID.val() == 0) { $($Kid4MaritalStatusID).addClass('Error'); err++; }
    else { $($Kid4MaritalStatusID).removeClass('Error'); }

    if ($Kid4PreExistingId.val() != 0) {
        if ($Kid4PreExistingValue.val() == "") { $("#Kid4PreExistingValue").addClass('Error'); err++; }
        else { $("#dvKid4PreExistingValue").removeClass('Error'); }
    }

    //$("#AadharNumber").onblur(function () {
    //    alert('AadharNumber');
    //    if ($('#AadharNumber').val().length != 12)
    //    {

    //        $('#dvAadharNumber').addClass('Error');
    //    }
    //    else { $('#dvAadharNumber').removeClass('Error'); }
    //});

    //Validation For Mediacal Questions In Aditya Birla Case For Kid4
    if ($('#InsurerId').val() == "42") {
        if ($Kid4Height.val() == 0) { $Kid4Height.addClass('Error'); err++; }
        else { $Kid4Height.removeClass('Error'); }
        if ($Kid4Weight.val() == "" || checkNumeric($Kid4Weight) == false) { $("#dvKid4Weight").addClass('Error'); err++; }
        else { $("#dvKid4Weight").removeClass('Error'); }
        // 12-02-2018
        var QuestSubId = 703;
        for (var i = 1234; i < 1252; i++) {
            if ($('#lblyesMedicalQuestionKid4_' + i).hasClass('active')) {
                if ($("#txtMedicalQuestionKid4_" + i).val() == "") {
                    $("#dvtxtMedicalQuestionKid4_" + i).addClass('Error'); err++;
                }
                else {

                    if (i != 1234) {
                        MedicalQustions_AdityaBirla(i, QuestSubId, $("#txtMedicalQuestionKid4_" + i).val(), '8');
                        $("#dvtxtMedicalQuestionKid4_" + i).removeClass('Error');
                    }
                    else {
                        var ans = "Alcohal Per Day/Year :- " + $("#AMHI_Kid4Beer").val() + "/ " + $("#AMHI_Kid4YearCount_Beer").val() + " Smoke Per day/Year :- " + $("#AMHI_Kid4Smoke").val() + "/ " + $("#AMHI_Kid4YearCount_Smoke").val() + " Gutakha Per day/Year " + $("#AMHI_Kid4Pouch").val() + "/" + $("#AMHI_Kid4YearCount_Pouch").val();
                        MedicalQustions_AdityaBirla(i, QuestSubId, ans, '8');
                        $("#dvtxtMedicalQuestionKid4_" + i).removeClass('Error');
                    }

                }
            }
            QuestSubId = QuestSubId + 1;
        }
    }

    if (err < 1) { return true; } // $("#icontabKid4insured").removeClass('glyphs'); return true; }
    else { return false; }
}
function ValidateAddnlInfo() {   
    var err = 0;
        if ($('#lblyesMedicalQuestionSelf_1239').hasClass('active')) {
            if ($('#lblyesMedicalQuestionSelf_1239').hasClass('active')) {
             
                var ans;
                for (var i = 706; i < 711; i++) {
                    switch (i) {
                        case 706:
                            ans = $("#AdditionalPolicyNo").val();
                            break;
                        case 707:
                            ans = $("#Additionalbenefit").val();
                            break;
                        case 708:
                            ans = $("#AdditionalSumInsured").val();
                            break;
                        case 709:
                            ans = $("#AdditionalClaims").val();
                            break;
                        case 710:
                            ans = $("#AdditionalDeclined").val();
                            break;
                        case 711:
                            ans = $("#AdditionalRejection").val();
                            break;
                    }
                    MedicalQustions_AdityaBirla('1239', i, ans, '1');
                }
            }
        }


    if (err < 1) { return true; }
    else { return false; }
}
function ValidateNomineeInfo() {   
    $NomineeTitleId = $('#NomineeTitleId');
    $NomineeRelationID = $('#NomineeRelationID');
    $NomineeName = $('#NomineeName');
    $NomineeDOB = $('#NomineeDOB');
    $NomineeAddress = $('#NomineeAddress');
    $NomineeCityName = $('#NomineeCityName');
    $NomineePinCode = $('#NomineePinCode');
    var err = 0;
    if ($NomineeTitleId.val() == 0) { $("#NomineeTitleId").addClass('Error'); err++; }
    else { $("#NomineeTitleId").removeClass('Error'); }
    if ($NomineeRelationID.val() == 0) { $("#NomineeRelationID").addClass('Error'); err++; }
    else { $("#NomineeRelationID").removeClass('Error'); }
    if ($NomineeName.val() == "" || checkTextWithSpace($NomineeName) == false) { $("#dvNomineeName").addClass('Error'); err++; }
    else { $("#dvNomineeName").removeClass('Error'); }
    if (true) {
        if ($NomineeName.val() == "" || checkTextWithSpace($NomineeName) == false) { $("#dvNomineeName").addClass('Error'); err++; }
        else {
            var data = $NomineeName.val();
            var arr = data.split(' ');
            if (arr[1] != null && arr[1] != "") { $("#dvNomineeName").removeClass('Error'); }
            else { $("#dvNomineeName").addClass('Error'); err++; }
        }
    }


    if ($NomineeDOB.val() == "") { $("#dvNomineeDOB").addClass('Error'); err++; }
    else { $("#dvNomineeDOB").removeClass('Error'); }
    if ($NomineeAddress.val() == "" || checkAddress($NomineeAddress) == false) { $("#dvNomineeAddress").addClass('Error'); err++; }
    else { $("#dvNomineeAddress").removeClass('Error'); }
    if ($NomineeCityName.val() == "" || checkCity1($NomineeCityName) == false) { $("#dvNomineeCityName").addClass('Error'); err++; }
    else { $("#dvNomineeCityName").removeClass('Error'); }
    if ($NomineePinCode.val() == "" || checkPincode($NomineePinCode) == false) { $("#dvNomineePinCode").addClass('Error'); err++; }
    else { $("#dvNomineePinCode").removeClass('Error'); }
    if (err < 1) { return true; } // $("#icontabnominee").removeClass('glyphs'); return true; }
    else { return false; }
}
function ValidateIAgree() {
    var err = 0;
    if ($("#ReligareHealthTermandCondition").prop('checked') == false) { $("#ReligareHealthTermandCondition").addClass('errorCheckBox'); err++; }
    else { $("#ReligareHealthTermandCondition").removeClass('errorCheckBox'); }
    if (err == "1") { return false; }
    else { $("#FinalSubmit").val("1"); return true; } //  $("#icontabonline").removeClass('glyphs'); return true; }
}
function ValidateSection(id) {
    switch (id) {
        case 'TabViewInput':
            return true;
            break;
        case 'TabPersonalInfo':
            return ValidatePersonalInfo();
            break;
        case 'TabContactInfo':
            return ValidateContactInfo();
            break;
        case 'TabSelf':
            return ValidateSelfInfo();
            break;
        case 'TabSpouse':
            return ValidateSpouseInfo();
            break;
        case 'TabFather':
            return ValidateFatherInfo();
            break;
        case 'TabMother':
            return ValidateMotherInfo();
            break;
        case 'TabKid1':
            return ValidateKid1Info();
            break;
        case 'TabKid2':
            return ValidateKid2Info();
            break;
        case 'TabKid3':
            return ValidateKid3Info();
            break;
        case 'TabKid4':
            return ValidateKid4Info();
            break;
        case 'TabAdditinal':
            return ValidateAddnlInfo();
            break;
        case 'TabNominee':
            return ValidateNomineeInfo();
            break;
        case 'TabOnline':
            return ValidateIAgree();
            break;
        default:
            return true;
            break;
    }
}
function ExpandSection(HID, CID) {
    var HeaderId = $('#' + HID);
    var ContentId = $('#' + CID);
    $('.Heading1').removeClass('collapsed').attr("aria-expanded", false).find("i.indicator").removeClass('glyphicon-minus').addClass('glyphicon-plus');//Adding Default
    $('.panel-collapse').removeClass('in').attr("style", "height: 0px;").attr("aria-expanded", false);//Adding Default
    //ContentId.toggleClass('collapsing');
    HeaderId.removeClass('collapsed').attr("aria-expanded", true).find("i.indicator").removeClass('glyphicon-plus').addClass('glyphicon-minus');
    ContentId.addClass('in').attr("aria-expanded", true).attr("style", "");
}

function MedicalQustions_AdityaBirla(qid, sqid, ans, member_number) { 
    $.get('/HealthInsuranceIndia/AdityaBirlaSetMedicalSubAnswer?Question_Id=' + qid + '&SubQuestion_Id=' + sqid + '&Anwer=' + ans + '&Member_Number=' + member_number, function (response) { });
}
function isDate(txtDate) {
    var currVal = txtDate;
    if (currVal == '')
        return false;

    var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/; //Declare Regex
    var dtArray = currVal.test(rxDatePattern); // is format OK?

    if (dtArray == null)
        return false;

    //Checks for mm/dd/yyyy format.
    dtMonth = dtArray[1];
    dtDay = dtArray[3];
    dtYear = dtArray[5];

    if (dtMonth < 1 || dtMonth > 12)
        return false;
    else if (dtDay < 1 || dtDay > 31)
        return false;
    else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
        return false;
    else if (dtMonth == 2) {
        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
        if (dtDay > 29 || (dtDay == 29 && !isleap))
            return false;
    }
    return true;
}

function ValidateDate(dt) {
    try {
        var isValidDate = false;
        var arr1 = dt.split('/');
        var year=0;var month=0;var day=0;var hour=0;var minute=0;var sec=0;
        if(arr1.length == 3)
        {
            var arr2 = arr1[2].split(' ');
            if(arr2.length == 2)
            {
                var arr3 = arr2[1].split(':');
                try{
                    year = parseInt(arr2[0],10);
                    month = parseInt(arr1[1],10);
                    day = parseInt(arr1[0],10);
                    hour = parseInt(arr3[0],10);
                    minute = parseInt(arr3[1],10);
                    //sec = parseInt(arr3[0],10);
                    sec = 0;
                    var isValidTime=false;
                    if(hour >=0 && hour <=23 && minute >=0 && minute<=59 && sec >=0 && sec<=59)
                        isValidTime=true;
                    else if(hour ==24 && minute ==0 && sec==0)
                        isValidTime=true;

                    if(isValidTime)
                    {
                        var isLeapYear = false;
                        if(year % 4 == 0)
                            isLeapYear = true;

                        if((month==4 || month==6|| month==9|| month==11) && (day>=0 && day <= 30))
                            isValidDate=true;
                        else if((month!=2) && (day>=0 && day <= 31))
                            isValidDate=true;

                        if(!isValidDate){
                            if(isLeapYear)
                            {
                                if(month==2 && (day>=0 && day <= 29))
                                    isValidDate=true;
                            }
                            else
                            {
                                if(month==2 && (day>=0 && day <= 28))
                                    isValidDate=true;
                            }
                        }
                    }
                }
                catch(er){isValidDate = false;}
            }

        }

        return isValidDate;
    }
    catch (err) { alert('ValidateDate: ' + err); }
}
// Validation Of Sections Ends

//$('.Mobile').on('keyup', function () {
//    if ($(this).val().length > 10) { $(this).val($(this).val().slice(0, 10)); }
//});

//$('input[type="number"]').on('keyup', function () {
//    if ($(this).hasClass('Mobile')) { $(this).val($(this).val().slice(0, 10)); }
//    if ($(this).hasClass('Pincode')) { $(this).val($(this).val().slice(0, 6)); }
//});

function GetMemberNumberText(MemberNumber) {
    var Text = "";
    switch (MemberNumber) {
        case "1": case 1: Text = "Self"; break;
        case "2": case 2: Text = "Spouse"; break;
        case "3": case 3: Text = "Father"; break;
        case "4": case 4: Text = "Mother"; break;
        case "5": case 5: Text = "Kid1"; break;
        case "6": case 6: Text = "Kid2"; break;
        case "7": case 7: Text = "Kid3"; break;
        case "8": case 8: Text = "Kid4"; break;
    }
    return Text;
}
//function SetGenderImages(Gender, Radio) {
//    if(Gender.contains("Female")) {
//        $("#" + Gender).attr('src', '/Images/POSP/female-border.png');
//        $("#" + Gender).prev().attr('src', '/Images/POSP/male.png');
//        $("#" + Radio).val("F");
//    }
//    else if (Gender.contains("Male")) {
//        $("#" + Gender).attr('src', '/Images/POSP/male-border.png');
//        $("#" + Gender).next().attr('src', '/Images/POSP/female.png');
//        $("#" + Radio).val("M");
//    }
//}