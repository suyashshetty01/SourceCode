$(document).ready(function () {
    debugger;

    $("#SelfName").keypress(function () {
         return isCharacter(event);
    });

    $("#SelfLastName").keypress(function () {
        return isCharacter(event);
    });


    var Customer;
    if ($('#IsCustomerVal').val() == 1) { Customer = 1; }
    else { Customer = 0; };

    $('.selectbox-highlight').hide();
    $('input').focusout(function () {
        var input = $.trim($(this).val());
        if (input.length == 0) { $(this).val(''); $(this).removeClass('used'); }
        else { $(this).addClass('used'); }
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
    if (Customer == 1) {
        $('select').on('change blur', function () {
            var ThisValue = $('option:selected', this).html();
            if ($(this).val() == "0" || $(this).val()== ""|| ThisValue == "Select Salutation" || ThisValue == "Relation With Proposer" ) {
                $(this).prev('.selectbox-highlight').hide();
                $(this).addClass('Error');
                if ($(this).hasClass('NotRequired')) { $(this).removeClass('Error'); }
            }
            else { $(this).prev('.selectbox-highlight').show(); $(this).removeClass('Error'); }
        });
        //$('input').blur(function () {
        //    var $this = $(this);
        //    var $dvthis = $('#dv' + $(this).attr('id') + '');
        //    if ($this.val()) { $this.addClass('used'); $dvthis.removeClass('Error'); }
        //    else { $this.removeClass('used'); $dvthis.addClass('Error'); }
        //    //if ($this.hasClass('NotRequired')) { $dvthis.removeClass('Error'); }
        //});
    }
    else {
        $('select').on('change blur', function () {
            var ThisValue = $('option:selected', this).html();
            if ($(this).val() == "0" || $(this).val() == "" || ThisValue == "Select Salutation" || ThisValue == "Relation With Proposer") {
                $(this).prev('.selectbox-highlight').hide();
                if ($(this).hasClass('Required')) { $(this).addClass('Error'); }
                else { $(this).removeClass('Error'); }
            }
            else { $(this).prev('.selectbox-highlight').show(); $(this).removeClass('Error'); }
        });
        //$('input').blur(function () {
        //    var $this = $(this);
        //    var $dvthis = $('#dv' + $(this).attr('id') + '');
        //    if ($this.val()) { $this.addClass('used'); }
        //    else {
        //        $this.removeClass('used');
        //        //if ($this.hasClass('Required')) { $dvthis.addClass('Error'); } else { $dvthis.removeClass('Error'); }
        //    }DateofBirthofTraveller
        //});
    }



    $("#DateofBirthofTraveller").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvDateofBirthofTraveller').removeClass('Error'); }
    });
    $("#dvDateofBirthofTraveller").click(function () { $("#DateofBirthofTraveller").datepicker("show"); if ($('#DateofBirthofTraveller').val() != "") { $('#dvDateofBirthofTraveller').removeClass('Error'); } });

    
    $("#NomineeDOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvNomineeDOB').removeClass('Error'); }
    });
    $("#divNomineeDOB").click(function () { $("#NomineeDOB").datepicker("show"); if ($('#NomineeDOB').val() != "") { $('#dvNomineeDOB').removeClass('Error'); } });

    $("#ContactDOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvContactDOB').removeClass('Error'); }
    });
    $("#dvContactDOB").click(function () { $("#ContactDOB").datepicker("show"); if ($('#ContactDOB').val() != "") { $('#dvContactDOB').removeClass('Error'); } });


    $("#Member2DOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvMember2DOB').removeClass('Error'); }
    });
    $("#dvMember2DOB").click(function () { $("#Member2DOB").datepicker("show"); if ($('#Member2DOB').val() != "") { $('#dvMember2DOB').removeClass('Error'); } });


    $("#Member3DOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvMember3DOB').removeClass('Error'); }
    });
    $("#dvMember3DOB").click(function () { $("#Member3DOB").datepicker("show"); if ($('#Member3DOB').val() != "") { $('#dvMember3DOB').removeClass('Error'); } });

    $("#Member4DOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvMember4DOB').removeClass('Error'); }
    });
    $("#dvMember4DOB").click(function () { $("#Member4DOB").datepicker("show"); if ($('#Member4DOB').val() != "") { $('#dvMember4DOB').removeClass('Error'); } });

    $("#Member5DOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvMember5DOB').removeClass('Error'); }
    });
    $("#dvMember5DOB").click(function () { $("#Member5DOB").datepicker("show"); if ($('#Member5DOB').val() != "") { $('#dvMember5DOB').removeClass('Error'); } });

    $("#Member6DOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvMember6DOB').removeClass('Error'); }
    });
    $("#dvMember6DOB").click(function () { $("#Member6DOB").datepicker("show"); if ($('#Member6DOB').val() != "") { $('#dvMember6DOB').removeClass('Error'); } });

    $("#NomineeDOB2").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvNomineeDOB2').removeClass('Error'); }
    });
    $("#dvNomineeDOB2").click(function () { $("#NomineeDOB2").datepicker("show"); if ($('#NomineeDOB2').val() != "") { $('#dvNomineeDOB2').removeClass('Error'); } });

    $("#NomineeDOB3").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvNomineeDOB3').removeClass('Error'); }
    });
    $("#divNomineeDOB3").click(function () { $("#NomineeDOB3").datepicker("show"); if ($('#NomineeDOB3').val() != "") { $('#divNomineeDOB3').removeClass('Error'); } });


    $("#NomineeDOB4").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvNomineeDOB4').removeClass('Error'); }
    });
    $("#divNomineeDOB4").click(function () { $("#NomineeDOB4").datepicker("show"); if ($('#NomineeDOB4').val() != "") { $('#divNomineeDOB4').removeClass('Error'); } });


    $("#NomineeDOB5").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvNomineeDOB5').removeClass('Error'); }
    });
    $("#divNomineeDOB5").click(function () { $("#NomineeDOB5").datepicker("show"); if ($('#NomineeDOB5').val() != "") { $('#divNomineeDOB5').removeClass('Error'); } });

    $("#NomineeDOB6").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvNomineeDOB6').removeClass('Error'); }
    });
    $("#divNomineeDOB6").click(function () { $("#NomineeDOB6").datepicker("show"); if ($('#NomineeDOB6').val() != "") { $('#divNomineeDOB6').removeClass('Error'); } });


    function CheckFocusOut(id, check) {
        debugger;
        var divid = "dv"+ id;
        if (Customer == 1)
        {
            if ($('#' + id).hasClass('NotRequired')) { $('#' + divid).removeClass('Error'); }
            else {
                if (check == false) { $('#' + divid).addClass('Error'); }
                else { $('#' + divid).removeClass('Error'); }
            }
        }
        else if ($('#' + id).hasClass('Required') == true)
        {
            if ($('#' + id).val() == "") { $('#' + divid).addClass('Error'); }
            else {
                if (check == false) { $('#' + divid).addClass('Error'); }
                else { $('#' + divid).removeClass('Error'); }
            }
        }
        else {
            if (check == false && $('#' + id).val() != "") { $('#' + divid).addClass('Error'); return false; }
            else { $('#' + divid).removeClass('Error'); }
        }
    }


    $('.OnlyText').focusout(function () {
        CheckFocusOut($(this).attr('id'), checkText($(this)));
    });
    $('.OnlyTextWithSpace').focusout(function () {
        CheckFocusOut($(this).attr('id'), checkTextWithSpace($(this)));
    });
    $('.OnlyNumber').focusout(function () {
        CheckFocusOut($(this).attr('id'), checkNumeric($(this)));
    });
    $('.AlphaNumeric').focusout(function () {
        CheckFocusOut($(this).attr('id'), checkAlphaNumeric($(this)));
    });
    $('.Mobile').focusout(function () {
        CheckFocusOut($(this).attr('id'), checkMobile($(this)));
    });
    $('.Email').focusout(function () {
        CheckFocusOut($(this).attr('id'), checkEmail($(this)));
    });
    $('.Pincode').focusout(function () {
        CheckFocusOut($(this).attr('id'), checkPincode($(this)));
    });
    $('.Address').focusout(function () {
        CheckFocusOut($(this).attr('id'), checkAddress($(this)));
    });
    $('.City').focusout(function () {
        CheckFocusOut($(this).attr('id'), checkCity1($(this)));
    });
    $('.Passport').focusout(function () {
        CheckFocusOut($(this).attr('id'), checkPassport($(this)));
    });

    $('.Number').keyup(function () {
        this.value = this.value.replace(/[^0-9\.]/g, '');
    });
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

function checkText(input) {
    var pattern = new RegExp('^[a-zA-Z]+$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkTextWithSpace(input) {
    var pattern = new RegExp('^[a-zA-Z ]+$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkNumeric(input) {
    var pattern = new RegExp('^[0-9]*$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkAlphaNumeric(input) {
    var pattern = new RegExp('^[a-zA-Z0-9]+$'); //var pattern = new RegExp('^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkAlphaNumericWithSpace(input) {
    var pattern = new RegExp('^[a-zA-Z0-9 ]+$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkPolicyNumber(input) {
    var pattern = new RegExp('^[a-zA-Z0-9-/]+$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkAddress(input) {
    var pattern = new RegExp('^[a-zA-Z0-9-,./ ]+$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkPincode(input) {
    var pattern = new RegExp('^([1-9]{1}[0-9]{5})$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkMobile(input) {
    var pattern = new RegExp('^([7-9]{1}[0-9]{9})$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkEmail(input) {
    var pattern = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkCity1(input) {
    var pattern = new RegExp('^[a-zA-Z ,]+$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkFlat(input) {
    var pattern = new RegExp('^[0-9a-zA-Z ,/-]+$'); 
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkPassport(input) {
    debugger;
    var pattern = new RegExp('^[A-Z]{1}(?!0+$)[0-9]{7}$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val().toUpperCase()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkPAN(input) {
    var pattern = new RegExp('^[A-Z]{5}[0-9]{4}[A-Z]{1}$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function TermAndCondition(id, IsCustomer) {
    if ($(id).prop('checked') == false) {
        $("#IOnline").addClass('glyphs');
        if (IsCustomer.toLowerCase() == "true" || IsCustomer == 1) { $(id).addClass('errorCheckBox'); }
    }
    else {
        $("#IOnline").removeClass('glyphs');
        $(id).removeClass('errorCheckBox');
    }
}

function isCharacter(evt) {

    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return true;
    }
    return false;
}

