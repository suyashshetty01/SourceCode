$(document).ready(function () {
  
    if ($("#hdnIsLanding").val() == "True") {
        $("#trPolicyFor").hide();
        $("#tdMaritalStatus").hide();
        $("#trInsurancePriority").hide();
        $("#InsurancePriority").val(3);
    }
    else {
        $("#trPolicyFor").show();
        $("#tdMaritalStatus").show();
        $("#trInsurancePriority").show();
    }
    if ($("#ContactDOB") != null) {
        $("#ContactDOB").datepicker({
            changeMonth: true,
            changeYear: true,
            yearRange: 'c-82:c',
            dateFormat: 'dd-mm-yy',
            minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
            maxDate: '-18y'
        });
    }
    $("#SelfDOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y'
    });
    $("#SpouseDOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y'
    });
    $("#FatherDOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-36y'
    });
    $("#MotherDOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-36y'
    });
    for (var i = 1; i <= 4; i++) {
        var _kid = "#Kid" + i + "DOB";
        $(_kid).datepicker({
            changeMonth: true,
            changeYear: true,
            yearRange: 'c-23:c',
            minDate: new Date((new Date()).getFullYear() - 23, (new Date()).getMonth(), 1),
            maxDate: '-3m',
            dateFormat: 'dd-mm-yy'
        });
    }
    if ($("#HiddenMaritalStatus").val() == "") {
        $("#HiddenMaritalStatus").val("Married");
    }
    SetRadioButton($("input[name=PolicyFor]"), $("#HiddenPolicyFor").val());
    SetRadioButton($("input[name=MaritalStatus]"), $("#HiddenMaritalStatus").val());
    ShowHidePolicyFor($("#HiddenPolicyFor").val());
    ShowHideChildSpouse($("#HiddenMaritalStatus").val());

    $("input[name=PolicyFor]").click(function () {
        if ($(this).val() == "Family") {
            SetRadioButton($("input[name=MaritalStatus]"), "Married");
        }
        else if ($(this).val() == "Self") {
            SetRadioButton($("input[name=MaritalStatus]"), "Single");
            $("#SpouseSelect").removeAttr('checked');
        }
        ShowHidePolicyFor($(this).val());
        $("#trError").hide('slow', function () { });
    });
    function ShowHidePolicyFor(_value) {
        if (_value == "Parents") {
            $("#trMaritalStatus").hide('slow', function () { })
            $(".trFather").show('slow', function () { })
            $(".trMother").show('slow', function () { })
            $(".trSelf").hide('slow', function () { })
            $(".trSpouse").hide('slow', function () { })
            $("#trChild").hide('slow', function () { })
            ShowHideChilds(0);
        }
        else {
            $("#trMaritalStatus").show('slow', function () { })
            $(".trFather").hide('slow', function () { })
            $(".trMother").hide('slow', function () { })
            $(".trSelf").show('slow', function () { })

            ShowHideChilds($("#NumberOfChild").val());
            ShowHideChildSpouse(GetRadioButtonSelectedValue($("input[name=MaritalStatus]")));
        }
        if (_value == "Parents" || GetRadioButtonSelectedValue($("input[name=MaritalStatus]")) == "Single") {
            FillPriority("Parents");
        }
        else {
            FillPriority("");
        }
    }
    $("input[name=MaritalStatus]").click(function () {
        ShowHideChildSpouse($(this).val());

        if ($(this).val() == "Single") {
            SetRadioButton($("input[name=PolicyFor]"), "Self");
            FillPriority("Parents");
        }
        else {
            FillPriority("");
        }
        $("#trError").hide('slow', function () { });
    });
    function ShowHideChildSpouse(_val) {
        //        alert(_val);
        if (_val == "") {
            _val = "Married";
        }
        if (_val == "Married") {
            if (GetRadioButtonSelectedValue($("input[name=SelfGender]")) == "M") {
                SetRadioButton($("input[name=SpouseGender]"), "F");
            }
            else if (GetRadioButtonSelectedValue($("input[name=SelfGender]")) == "F") {
                SetRadioButton($("input[name=SpouseGender]"), "M");
            }
            if (GetRadioButtonSelectedValue($("input[name=PolicyFor]")) != "Self" && GetRadioButtonSelectedValue($("input[name=PolicyFor]")) != "Parents") {
                $(".trSpouse").show('slow', function () { });
            }
        }
        else {
            $(".trSpouse").hide('slow', function () { })
            $("#SpouseSelect").removeAttr('checked');
        }
        if ((_val == "Married" || _val == "Divorced" || _val == "Widow") && GetRadioButtonSelectedValue($("input[name=PolicyFor]")) != "Self" && GetRadioButtonSelectedValue($("input[name=PolicyFor]")) != "Parents") {
            $("#trChild").show('slow', function () { })
            ShowHideChilds($("#NumberOfChild").val());
        }
        else {
            $("#trChild").hide('slow', function () { })
            ShowHideChilds(0);
        }
    }
    $("#NumberOfChild").change(function () {
        ShowHideChilds($(this).val());
        $("#trError").hide('slow', function () { });
    });
    $("input[name=SelfGender]").click(function () {
        if (GetRadioButtonSelectedValue($("input[name=MaritalStatus]")) == "Married") {
            if ($(this).val() == "M") {
                SetRadioButton($("input[name=SpouseGender]"), "F");
            }
            else {
                SetRadioButton($("input[name=SpouseGender]"), "M");
            }
        }
    });
    $("input[name=SpouseGender]").click(function () {
        if ($(this).val() == "M") {
            SetRadioButton($("input[name=SelfGender]"), "F");
        }
        else {
            SetRadioButton($("input[name=SelfGender]"), "M");
        }
    });
    $("#btnSubmit").click(function () {
        $("#HiddenMaritalStatus").val(GetRadioButtonSelectedValue($("input[name=MaritalStatus]")));
        $("#HiddenPolicyFor").val(GetRadioButtonSelectedValue($("input[name=PolicyFor]")));
    });

    function ShowHideChilds(_child) {
        if (_child == 0) {
            $("#NumberOfChild").val(0);
        }
        for (var i = 1; i <= 4; i++) {
            if (i <= _child) {
                $(".trKid" + i).show('slow', function () { })
            }
            else {
                $(".trKid" + i).hide('slow', function () { })
                $("#Kid" + i + "Select").removeAttr('checked');
            }
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
    function FillPriority(_policyFor) {
        var _selected = $("#InsurancePriority").val();
        $.get('/HealthInsuranceIndia/GetInsurancePriority?policyfor=' + _policyFor, function (response) {
            var Priority = $.parseJSON(response);
            var ddlInsurancePriority = $("#InsurancePriority");
            $("#InsurancePriority > option").remove();
            for (i = 0; i < Priority.length; i++) {
                ddlInsurancePriority.append($("<option />").val(Priority[i].Value).text(Priority[i].Text));
            }
            $("#InsurancePriority option[value='" + _selected + "']").attr("selected", "selected");
        });
    }

});

function ValidateForm() {   
    var _error = "";
    var _SelfSelected = $("#SelfSelect").val();
    var _SpouseSelected = $("#SpouseSelect").val();
    var _Kid1Seledted = $("#Kid1Select").val();
    var _Kid2Seledted = $("#Kid2Select").val();
    var _Kid3Seledted = $("#Kid3Select").val();
    var _Kid4Seledted = $("#Kid4Select").val();
    var _City = $("#ContactCityName").val();
    var _SelfDOB = $("#SelfDOB").val();
    var _SpouseDOB = $("#SpouseDOB").val();
    var _FatherDOB = $("#FatherDOB").val();
    var _MotherDOB = $("#MotherDOB").val();
    var _Kid1DOB = $("#Kid1DOB").val();
    var _Kid2DOB = $("#Kid2DOB").val();
    var _Kid3DOB = $("#Kid3DOB").val();
    var _Kid4DOB = $("#Kid4DOB").val();
    var _SelfGender = $("input[name='SelfGender']:checked").val();
    var _SpouseGender = $("input[name='SpouseGender']:checked").val();

    var _Kid1Gender = $("input[name='Kid1Gender']:checked").val();
    var _Kid2Gender = $("input[name='Kid2Gender']:checked").val();
    var _Kid3Gender = $("input[name='Kid3Gender']:checked").val();
    var _Kid4Gender = $("input[name='Kid4Gender']:checked").val();


    var _ContactName = $("#ContactName").val();
    var _ContactEmail = $("#ContactEmail").val();
    var _ContactMobile = $("#ContactMobile").val();
    var _TermCondition = $("#TermCondition").is(":checked");

    var _NumberOfChild = $("select[name='NumberOfChild'] option:selected").val();

    if (_City == "") {
        _error += "- Please select city .\n";
    }
    if (!(_SelfSelected || _SpouseSelected)) {
        _error += "- Please select minimum 1 adult insured .\n";
    }
    if (_NumberOfChild > 0) {
        if (!_Kid1Seledted) {
            _error += "- Please select kid1 .\n";
        }
    }
    if (_NumberOfChild > 1) {
        if (!_Kid2Seledted) {
            _error += "- Please select kid2 .\n";
        }
    }
    if (_NumberOfChild > 2) {
        if (!_Kid3Seledted) {
            _error += "- Please select kid3 .\n";
        }
    }
    if (_NumberOfChild > 3) {
        if (!_Kid4Seledted) {
            _error += "- Please select kid4 .\n";
        }
    }

    if (_SelfSelected) {
        if (_SelfDOB == "") {
            _error += "- Please select self dob .\n";
        }
        if (_SelfGender == undefined) {
            _error += "- Please select self gender .\n";
        }
    }
    if (_SpouseSelected) {
        if (_SpouseDOB == "") {
            _error += "- Please select spouse dob .\n";
        }
        if (_SpouseGender == undefined) {
            _error += "- Please select spouse gender .\n";
        }
    }
    if (_Kid1Seledted) {
        if (_Kid1DOB == "") {
            _error += "- Please select kid1 dob .\n";
        }
        if (_Kid1Gender == undefined) {
            _error += "- Please select kid1 gender .\n";
        }
    }
    if (_Kid2Seledted) {
        if (_Kid2DOB == "") {
            _error += "- Please select kid2 dob .\n";
        }
        if (_Kid2Gender == undefined) {
            _error += "- Please select kid2 gender .\n";
        }
    }
    if (_Kid3Seledted) {
        if (_Kid3DOB == "") {
            _error += "- Please select kid3 dob .\n";
        }
        if (_Kid3Gender == undefined) {
            _error += "- Please select kid3 gender .\n";
        }
    }
    if (_Kid4Seledted) {
        if (_Kid4DOB == "") {
            _error += "- Please select kid4 dob .\n";
        }
        if (_Kid4Gender == undefined) {
            _error += "- Please select kid4 gender .\n";
        }
    }
    if (_ContactName == "") {
        _error += "- Please enter contact name.\n";
    }
    if (_ContactEmail == "" || !emailValid(_ContactEmail)) {
        _error += "- Please enter valid contact email.\n";
    }
    if (_ContactMobile == "" || !mobileValid(_ContactMobile)) {
        _error += "- Please enter valid mobile no..\n";
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

//function ValidateForm() {
//    alert('e1');
//    debugger;
//    var _error = "";
//    var _SelfSelected = $("#SelfSelect").is(":checked");
//    var _SpouseSelected = $("#SpouseSelect").is(":checked");
//    var _Kid1Seledted = $("#Kid1Select").is(":checked");
//    var _Kid2Seledted = $("#Kid2Select").is(":checked");
//    var _Kid3Seledted = $("#Kid3Select").is(":checked");
//    var _Kid4Seledted = $("#Kid4Select").is(":checked");
//    var _City = $("#ContactCityName").val();
//    var _SelfDOB = $("#SelfDOB").val();
//    var _SpouseDOB = $("#SpouseDOB").val();
//    var _FatherDOB = $("#FatherDOB").val();
//    var _MotherDOB = $("#MotherDOB").val();
//    var _Kid1DOB = $("#Kid1DOB").val();
//    var _Kid2DOB = $("#Kid2DOB").val();
//    var _Kid3DOB = $("#Kid3DOB").val();
//    var _Kid4DOB = $("#Kid4DOB").val();
//    var _SelfGender = $("input[name='SelfGender']:checked").val();
//    var _SpouseGender = $("input[name='SpouseGender']:checked").val();

//    var _Kid1Gender = $("input[name='Kid1Gender']:checked").val();
//    var _Kid2Gender = $("input[name='Kid2Gender']:checked").val();
//    var _Kid3Gender = $("input[name='Kid3Gender']:checked").val();
//    var _Kid4Gender = $("input[name='Kid4Gender']:checked").val();


//    var _ContactName = $("#ContactName").val();
//    var _ContactEmail = $("#ContactEmail").val();
//    var _ContactMobile = $("#ContactMobile").val();
//    var _TermCondition = $("#TermCondition").is(":checked");

//    var _NumberOfChild = $("select[name='NumberOfChild'] option:selected").val();

//    if (_City == "") {
//        _error += "- Please select city .\n";
//    }
//    if (!(_SelfSelected || _SpouseSelected)) {
//        _error += "- Please select minimum 1 adult insured .\n";
//    }
//    if (_NumberOfChild > 0) {
//        if (!_Kid1Seledted) {
//            _error += "- Please select kid1 .\n";
//        }
//    }
//    if (_NumberOfChild > 1) {
//        if (!_Kid2Seledted) {
//            _error += "- Please select kid2 .\n";
//        }
//    }
//    if (_NumberOfChild > 2) {
//        if (!_Kid3Seledted) {
//            _error += "- Please select kid3 .\n";
//        }
//    }
//    if (_NumberOfChild > 3) {
//        if (!_Kid4Seledted) {
//            _error += "- Please select kid4 .\n";
//        }
//    }

//    if (_SelfSelected) {
//        if (_SelfDOB == "") {
//            _error += "- Please select self dob .\n";
//        }
//        if (_SelfGender == undefined) {
//            _error += "- Please select self gender .\n";
//        }
//    }
//    if (_SpouseSelected) {
//        if (_SpouseDOB == "") {
//            _error += "- Please select spouse dob .\n";
//        }
//        if (_SpouseGender == undefined) {
//            _error += "- Please select spouse gender .\n";
//        }
//    }
//    if (_Kid1Seledted) {
//        if (_Kid1DOB == "") {
//            _error += "- Please select kid1 dob .\n";
//        }
//        if (_Kid1Gender == undefined) {
//            _error += "- Please select kid1 gender .\n";
//        }
//    }
//    if (_Kid2Seledted) {
//        if (_Kid2DOB == "") {
//            _error += "- Please select kid2 dob .\n";
//        }
//        if (_Kid2Gender == undefined) {
//            _error += "- Please select kid2 gender .\n";
//        }
//    }
//    if (_Kid3Seledted) {
//        if (_Kid3DOB == "") {
//            _error += "- Please select kid3 dob .\n";
//        }
//        if (_Kid3Gender == undefined) {
//            _error += "- Please select kid3 gender .\n";
//        }
//    }
//    if (_Kid4Seledted) {
//        if (_Kid4DOB == "") {
//            _error += "- Please select kid4 dob .\n";
//        }
//        if (_Kid4Gender == undefined) {
//            _error += "- Please select kid4 gender .\n";
//        }
//    }
//    if (_ContactName == "") {
//        _error += "- Please enter contact name.\n";
//    }
//    if (_ContactEmail == "" || !emailValid(_ContactEmail)) {
//        _error += "- Please enter valid contact email.\n";
//    }
//    if (_ContactMobile == "" || !mobileValid(_ContactMobile)) {
//        _error += "- Please enter valid mobile no..\n";
//    }
//    if (_TermCondition != true) {
//        _error += "- Please select term & condition.\n";
//    }

//    if (_error.length > 0) {
//        alert(_error);
//        return false;
//    }
//    else {
//        return true;
//    }
//}
//----------------------------EmailValidation--------------------------------------//
function emailValid(_email) {
    
    var regEmail = /^[_\.0-9a-zA-Z-]+@([0-9a-zA-Z][0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}$/i;
    return regEmail.test(_email);
}