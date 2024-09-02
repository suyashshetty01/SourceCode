var uatIP = "http://103.118.2.17";



$(document).ready(function () {

    if ($("#ppincode").val() != "") {
        //  checkPincode($("#ContactPinCode").val())
       // GetPincodeDetails($("#ppincode").val());
    }
    if ($("#rdbLATaxResidentOfIndia").prop("checked") == false || $("#rdbLATaxResidentOfOther").prop("checked") == false ) {
        $('#rdbLATaxResidentOfIndia').prop('checked', true);
}


    if ($('#chkLASkyDive').prop("checked") == false || $('#chkLAParagliding').prop("checked") == false || $('#chkLAMountaineering').prop("checked") == false || $('#chkLARacing').prop("checked") == false || $('#chkLAOtherActivies').prop("checked") == false ) {
        $("#chkLASkyDive").attr("disabled", true);
        $("#chkLAParagliding").attr("disabled", true);
        $("#chkLAMountaineering").attr("disabled", true);
        $("#chkLARacing").attr("disabled", true);
        $("#chkLAOtherActivies").attr("disabled", true);
        $("#divtxtLAOtherActivities").hide();
        $('#chkLANone').prop('checked', true);
    }

    if ($('#chkSpouseSkyDive').prop("checked") == false || $('#chkSpouseParagliding').prop("checked") == false || $('#chkSpouseMountaineering').prop("checked") == false || $('#chkSpouseRacing').prop("checked") == false || $('#chkSpouseOtherActivies').prop("checked") == false) {
        $("#chkSpouseSkyDive").attr("disabled", true);
        $("#chkSpouseParagliding").attr("disabled", true);
        $("#chkSpouseMountaineering").attr("disabled", true);
        $("#chkSpouseRacing").attr("disabled", true);
        $("#chkSpouseOtherActivies").attr("disabled", true);
        $('#chkSpouseNone').prop('checked', true);
    }
    

    HideFunction();
    //Personal Details div hide and show initial condition    
    $("#txtLAOtherQualification").attr("disabled", true);
    $("#divLAPermanentAddress").hide();
    $("#rdbLACorrAddrY").prop("checked", true);
    $("#rdbLAPerY").prop("checked", true);
    $("#txtPropOtherQualification").attr("disabled", true);
    $("#divPropPermanentAddress").hide();
    $("#divCurrOrPerLA").hide();
    $("#rdbLACurOrPerY").prop("checked", false);
    $("#rdbLACurOrPerN").prop("checked", false);

    if ($('input:radio[name=rdbLAIncmSrc]:checked').val() == "yes") {
        $("#divOtherIncome").show();
    } else
    {
        $("#divOtherIncome").hide();
    }

    if ($("input[name='rdbSpouseIncmSrc']:checked").val() == "no") {
        $("#divSpouseOtherIncome").show();
    }
    else if ($("input[name='rdbSpouseIncmSrc']:checked").val() == "yes") {
        $("#divSpouseOtherIncome").hide();
    }

    $("#ddlnatinality").change(function () {
        if ($(this).val() == "2") {
            $('#modalNRI').modal('show');
        }
        else {
            $('#modalNRI').modal('hide');
        }
    });
    $("input[name = 'rdbLACorrAddr']").change(function () {
        if ($(this).val() == "no") {
            $("#currentaddrsdiv").show();
            $("#divCurrOrPerLA").show();
        }
        else if ($(this).val() == "yes") {
            $("#currentaddrsdiv").hide();
            $("#divCurrOrPerLA").hide();

            $("#caddress1").val("");
            $("#caddress2").val("");
            $("#caddress3").val("");
            $("#cpincode").val("");
            $("#cstate").val("");
            $("#ccity").val("");

            $("#rdbLACurOrPerY").prop("checked", false);
            $("#rdbLACurOrPerN").prop("checked", false);
        }
    });
    
    function checkTextWithSpace(input) {

        var pattern = new RegExp('^[a-zA-Z ]+$');
        var dvid = "dv" + input[0].id;
        if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
        else { $('#' + dvid).removeClass('Error'); return true; }
    }

    $("#divSpousePersonal").hide();
    $("#Spousecurrentaddrsdiv").hide();
    $("#divSpouseCorrAddress").hide();
    $("#rdbSpouseCorrAddrY").prop("checked", true);
    $("#ddlSpousenatinality").change(function () {
        if ($(this).val() == "2") {
            $('#modalNRI').modal('show');
        }
        else {
            $('#modalNRI').modal('hide');
        }
    });
    $("input[name = 'rdbSpouseCorrAddr']").change(function () {
        if ($(this).val() == "no") {
            $("#Spousecurrentaddrsdiv").show();
            $("#divSpouseCorrAddress").show();
        }
        else if ($(this).val() == "yes") {
            $("#Spousecurrentaddrsdiv").hide();
            $("#divSpouseCorrAddress").hide();

            $("#Spousecaddress1").val("");
            $("#Spousecaddress2").val("");
            $("#Spousecaddress3").val("");
            $("#Spousecpincode").val("");
            $("#Spousecstate").val("");
            $("#Spouseccity").val("");

            $("#rdbLACurOrPerY").prop("checked", false);
            $("#rdbLACurOrPerN").prop("checked", false);
        }
    });
    $("#chkAddrSameAsLA").click(function () {
        if ($(this).prop("checked") == true) {

            $("#Spousepaddress1").val($("#paddress1").val());
            $("#Spousepaddress2").val($("#paddress2").val());
            $("#Spousepaddress3").val($("#paddress3").val());
            $("#Spouseppincode").val($("#ppincode").val());
            $("#Spousepstate").val($("#pstate").val());
            $("#Spousepcity").val($("#pcity").val());

            if ($("input[name='rdbLACorrAddr']:checked").val() == "no") {
                $("#Spousecaddress1").val($("#caddress1").val());
                $("#Spousecaddress2").val($("#caddress2").val());
                $("#Spousecaddress3").val($("#caddress3").val());
                $("#Spousecpincode").val($("#cpincode").val());
                $("#Spousecstate").val($("#cstate").val());
                $("#Spouseccity").val($("#ccity").val());

                $("#rdbSpouseCorrAddrY").prop("checked", false);
                $("#rdbSpouseCorrAddrN").prop("checked", true);
                $("#Spousecurrentaddrsdiv").show();
                $("#divSpouseCorrAddress").show();
            }
        }
        else if ($(this).prop("checked") == false) {
            $("#Spousepaddress1").val("");
            $("#Spousepaddress2").val("");
            $("#Spousepaddress3").val("");
            $("#Spouseppincode").val("");
            $("#Spousepstate").val("");
            $("#Spousepcity").val("");


            $("#Spousecaddress1").val("");
            $("#Spousecaddress2").val("");
            $("#Spousecaddress3").val("");
            $("#Spousecpincode").val("");
            $("#Spousecstate").val("");
            $("#Spouseccity").val("");

            $("#rdbSpouseCorrAddrY").prop("checked", true);
            $("#rdbSpouseCorrAddrN").prop("checked", false);
            $("#Spousecurrentaddrsdiv").hide();
            $("#divSpouseCorrAddress").hide();

        }
    });


    //Get client details which were submitted during Quote
    GetClientDetails();

    //Disabling the elements which got the data from quote
    $("#ddlLATitle").attr('disabled', 'disabled');
    $("#txtfirstname").attr('disabled', 'disabled');
    $("#txtlastname").attr('disabled', 'disabled');
    $("#txtdob").attr('disabled', 'disabled');
    $("#ddlgender").attr('disabled', 'disabled');
    // $("#ddlMaritalstatus").attr('disabled', 'disabled');
    // $("#txtemailid").attr('disabled', 'disabled');
    //$("#txtphonemobile").attr('disabled', 'disabled');
    // $("#ddlSpouseTitle").attr('disabled', 'disabled');
    // $("#txtSpousedob").attr('disabled', 'disabled');
    // $("#ddlSpousegender").attr('disabled', 'disabled');
    // $("#ddlSpouseMaritalstatus").attr('disabled', 'disabled');


    //Openning Personal Details tab first
    openTab(event, 'PersonalDetails');


    //Employment details div hide and show initial conditions   
    $("#divNameOfEmployer").hide();
    $("#divLaDesignation").hide();
    $("#divJobDesc").hide();
    $("#divNatureOfBussiness").hide();
    $("#divWorkExperienceYear").hide();
    $("#divWorkExperienceMonth").hide();
    $("#divAddressEmployer").hide();
    $("#divOccupationIndType").hide();
    $("#divNoOfEmployees").hide();
    $("#divAnnualIncome").hide();
    $("#divIncomeSource").hide();
    $("#divOtherIncome").hide();

    $("#divSpouseNameOfEmployer").hide();
    $("#divSpouseDesignation").hide();
    $("#divSpouseJobDesc").hide();
    $("#divSpouseNatureOfBussiness").hide();
    $("#divSpouseWorkExperienceYear").hide();
    $("#divSpouseWorkExperienceMonth").hide();
    $("#divSpouseAddressEmployer").hide();
    $("#divSpouseOccupationIndType").hide();
    $("#divSpouseNoOfEmployees").hide();
    $("#divSpouseAnnualIncome").hide();
    $("#divSpouseIncomeSource").hide();
    $("#divSpouseOtherIncome").hide();
    $("#divSpouseEmp").hide();

    $("#ddlLAEmployment").change(function () {
        
        $("#divNameOfEmployer").hide();
        $("#divLaDesignation").hide();
        $("#divJobDesc").hide();
        $("#divNatureOfBussiness").hide();
        $("#divWorkExperienceYear").hide();
        $("#divWorkExperienceMonth").hide();
        $("#divAddressEmployer").hide();
        $("#divOccupationIndType").hide();
        $("#divNoOfEmployees").hide();
        $("#divAnnualIncome").hide();
        $("#divIncomeSource").hide();
        $("#divOtherIncome").hide();

        if ($(this).val() == "1" || $(this).val() == "8" || $(this).val() == "5" || $(this).val() == "7") {
            $("#divNameOfEmployer").show();
            $("#divLaDesignation").show();
            $("#divJobDesc").show();
            if ($(this).val() == "5") {
                $("#divNatureOfBussiness").show();
            }
            $("#divWorkExperienceYear").show();
            $("#divWorkExperienceMonth").show();
            $("#divAddressEmployer").show();
            $("#divOccupationIndType").show();
            $("#divNoOfEmployees").show();
            $("#divAnnualIncome").show();
            $("#divIncomeSource").show();
        }
        else if ($(this).val() == "2" || $(this).val() == "6" || $(this).val() == "3") {
            $("#divAnnualIncome").show();
            $("#divIncomeSource").show();
        }

        if ($('input:radio[name=rdbLAIncmSrc]:checked').val() == "yes") {
            $("#divOtherIncome").hide();
        } else {
            $("#divOtherIncome").show();
        }


    });

    $("#ddlSpouseEmployment").change(function () {
        $("#divSpouseNameOfEmployer").hide();
        $("#divSpouseDesignation").hide();
        $("#divSpouseJobDesc").hide();
        $("#divSpouseNatureOfBussiness").hide();
        $("#divSpouseWorkExperienceYear").hide();
        $("#divSpouseWorkExperienceMonth").hide();
        $("#divSpouseAddressEmployer").hide();
        $("#divSpouseOccupationIndType").hide();
        $("#divSpouseNoOfEmployees").hide();
        $("#divSpouseAnnualIncome").hide();
        $("#divSpouseIncomeSource").hide();
        $("#divSpouseOtherIncome").hide();

        if ($(this).val() == "1" || $(this).val() == "8" || $(this).val() == "5" || $(this).val() == "7") {
            $("#divSpouseNameOfEmployer").show();
            $("#divSpouseDesignation").show();
            $("#divSpouseJobDesc").show();
            if ($(this).val() == "5") {
                $("#divSpouseNatureOfBussiness").show();
            }
            $("#divSpouseWorkExperienceYear").show();
            $("#divSpouseWorkExperienceMonth").show();
            $("#divSpouseAddressEmployer").show();
            $("#divSpouseOccupationIndType").show();
            $("#divSpouseNoOfEmployees").show();
            $("#divSpouseAnnualIncome").show();
            $("#divSpouseIncomeSource").show();
        }
        else if ($(this).val() == "2" || $(this).val() == "6" || $(this).val() == "3") {
            $("#divSpouseAnnualIncome").show();
            $("#divSpouseIncomeSource").show();
        }

        if ($('input:radio[name=rdbSpouseIncmSrc]:checked').val() == "yes") {
            $("#divSpouseOtherIncome").hide();
        } else {
            $("#divSpouseOtherIncome").show();
        }
    });

    $("input[name='rdbLAIncmSrc']").change(function () {

        if ($("input[name='rdbLAIncmSrc']:checked").val() == "no") {
            $("#divOtherIncome").show();
        }
        else if ($("input[name='rdbLAIncmSrc']:checked").val() == "yes") {
            $("#divOtherIncome").hide();
        }
    });


    $("input[name='rdbSpouseIncmSrc']").change(function () {

        if ($("input[name='rdbSpouseIncmSrc']:checked").val() == "no") {
            $("#divSpouseOtherIncome").show();
        }
        else if ($("input[name='rdbSpouseIncmSrc']:checked").val() == "yes") {
            $("#divSpouseOtherIncome").hide();
        }
    });

    $("#txtLAOtherLAempType").attr("disabled", true);
    $("#txtPropOtherLAempType").attr("disabled", true);
    $('#isLaPropSame').prop('checked', false);
    $('#isPEP').prop('checked', false);
    $("#txtPEPDetails").attr("disabled", true);
    $("#txtOtherPolicyCategory").attr("disabled", true);
    $("#divEiaAccountNo").hide();
    $("#divEpolicy").hide();
    $("#divApplyYesNo").hide();
    $("#divInsRepName").hide();
    $("#currentaddrsdiv").hide();


    //Nominee details hide and show functions
    $("#divNominee").hide();
    $("#secondNominee").hide();
    $("#thirdNominee").hide();

    $("#txtNomineeAllocation1").attr("readonly", "readonly").val("100");
    $("#divAppointee1").hide();
    $("#divAppointee2").hide();
    $("#divAppointee3").hide();
    //First Nominee and Appointee Datepicker
    var date_input = $('input[name="txtNomineeDOB1"]'); //our date input has the name "date"
    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    date_input.datepicker({
        format: 'dd/mm/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,
    }).on('change', function (e) {


        var dob = $('#txtNomineeDOB1').val();
        var dob1 = dob.split('/');
        var age = 0;

        age = calculate_age(dob1[0], dob1[1], dob1[2]);
        $("#agenominee1").val(age);
        if (age < 18) {
            $("#divAppointee1").show();
        }
        else {
            $("#divAppointee1").hide();
        }
    });

    var date_input = $('input[name="txtAppointeeDOB1"]'); //our date input has the name "date"
    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    date_input.datepicker({
        format: 'dd/mm/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,
    }).on('change', function (e) {


        var dob = $('#txtAppointeeDOB1').val();
        var dob1 = dob.split('/');
        var age = 0;

        age = calculate_age(dob1[0], dob1[1], dob1[2]);

        if (age < 18) {
            alert("Appointee age should be greater than 18");
            $('#txtAppointeeDOB1').val("");
        }
    });




    //Second Nominee and Appointee Datepicker
    var date_input = $('input[name="txtNomineeDOB2"]'); //our date input has the name "date"
    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    date_input.datepicker({
        format: 'dd/mm/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,
    }).on('change', function (e) {


        var dob = $('#txtNomineeDOB2').val();
        var dob1 = dob.split('/');
        var age = 0;

        age = calculate_age(dob1[0], dob1[1], dob1[2]);
        $("#agenominee2").val(age);
        if (age < 18) {
            $("#divAppointee2").show();
        }
        else {
            $("#divAppointee2").hide();
        }
    });

    var date_input = $('input[name="txtAppointeeDOB2"]'); //our date input has the name "date"
    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    date_input.datepicker({
        format: 'dd/mm/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,
    }).on('change', function (e) {


        var dob = $('#txtAppointeeDOB2').val();
        var dob1 = dob.split('/');
        var age = 0;

        age = calculate_age(dob1[0], dob1[1], dob1[2]);

        if (age < 18) {
            alert("Appointee age should be greater than 18");
            $('#txtAppointeeDOB2').val("");
        }
    });


    //Third Nominee and Appointee Datepicker
    var date_input = $('input[name="txtNomineeDOB3"]'); //our date input has the name "date"
    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    date_input.datepicker({
        format: 'dd/mm/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,
    }).on('change', function (e) {


        var dob = $('#txtNomineeDOB3').val();
        var dob1 = dob.split('/');
        var age = 0;

        age = calculate_age(dob1[0], dob1[1], dob1[2]);
        $("#agenominee3").val(age);
        if (age < 18) {
            $("#divAppointee3").show();
        }
        else {
            $("#divAppointee3").hide();
        }
    });

    var date_input = $('input[name="txtAppointeeDOB3"]'); //our date input has the name "date"
    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    date_input.datepicker({
        format: 'dd/mm/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,
    }).on('change', function (e) {


        var dob = $('#txtAppointeeDOB3').val();
        var dob1 = dob.split('/');
        var age = 0;

        age = calculate_age(dob1[0], dob1[1], dob1[2]);

        if (age < 18) {
            alert("Appointee age should be greater than 18");
            $('#txtAppointeeDOB3').val("");
        }
    });


    //Calculate Age by Date of Birth.
    function calculate_age(birth_month, birth_day, birth_year) {

        today_date = new Date();
        today_year = today_date.getFullYear();
        today_month = today_date.getMonth();
        today_day = today_date.getDate();

        age = today_year - birth_year;

        if (today_month < (birth_month - 1)) {
            age--;
        }
        if (((birth_month - 1) == today_month) && (today_day < birth_day)) {
            age--;
        }
        return age;
    }


    $("#ddlPropNoOfNominees").change(function () {

        var selectedValue = $(this).val();
        if (selectedValue == 1) {
            $("#txtNomineeAllocation1").val("100");
            $("#txtNomineeAllocation2").val("0");
            $("#txtNomineeAllocation3").val("0");
            $("#txtNomineeAllocation1").attr("readonly", "readonly").val("100");
            $("#firstNominee").css({ 'display': 'block' });
            $("#secondNominee").css({ 'display': 'none' });
            $("#thirdNominee").css({ 'display': 'none' });
        }
        else if (selectedValue == 2) {

            $("#txtNomineeAllocation1").val("50");
            $("#txtNomineeAllocation2").val("50");
            $("#txtNomineeAllocation3").val("0");
            $("#txtNomineeAllocation1").removeAttr("disabled");
            $("#firstNominee").css({ 'display': 'block' });
            $("#secondNominee").css({ 'display': 'block' });
            $("#thirdNominee").css({ 'display': 'none' });
        }
        else if (selectedValue == 3) {
            $("#txtNomineeAllocation1").val("40");
            $("#txtNomineeAllocation2").val("30");
            $("#txtNomineeAllocation3").val("30");
            $("#txtNomineeAllocation1").removeAttr("disabled");
            $("#firstNominee").css({ 'display': 'block' });
            $("#secondNominee").css({ 'display': 'block' });
            $("#thirdNominee").css({ 'display': 'block' });
        }
    });

    $("#divtxtLAOtherActivities").hide();

    $("#tblFamInsDetail").hide();
    $("#tblExstInsDetail").hide();

    $("#txtLAAge").attr("disabled", "disabled");
    $("#txtLAAgeAtDeath").attr("disabled", "disabled");
    $("#ddlLACauseOfDeath").attr("disabled", "disabled");

    $("#txtSpouseAge").attr("disabled", "disabled");
    $("#txtSpouseAgeAtDeath").attr("disabled", "disabled");
    $("#ddlSpouseCauseOfDeath").attr("disabled", "disabled");

    $("#tblYourFamDetail").hide();
    $("#tblSpouseFamDetail").hide();

});


/////////////////////////////////////////end of document.ready


$("#iagree").click(function () {
    $("#modalTnC").hide();
    DisplayFunction();
    submitPF();

    //document.form.submit();
});

$("input[name = 'rdbSpouseDiscloseInsur']").click(function () {
    var txtSpouseFamMemberDisease = "";
    var isSpouseFamMemberDisease = "";
    if ($('input:radio[name=rdbSpouseDiscloseInsur]:checked').val() == "yes") {
        isSpouseFamMemberDisease = "Y";
        txtSpouseFamMemberDisease = $("#txtSpousetdetailhereditary").val();
    }
    else {
        isSpouseFamMemberDisease = "N";
        txtSpouseFamMemberDisease = "";
    }
})


var laTotalCheckBoxChecked = "";

$("input[name ='chkLAActivities']").click(function () {
    debugger
    if ($("#chkLAActivities").prop("checked") == true || $("#chkLAActivities").prop("checked") ==undefined) {
        IsAdventurousActivities = "N";
    }
    else {
        debugger
        IsAdventurousActivities = 'Y';

        if ($("#chkLASkyDive").prop("checked") == true) {
            laSkyDiveInd = "Y";
            var skydive = "1";
            laTotalCheckBoxChecked = skydive + "~";
        }
        else {
            laSkyDiveInd = "N";
        }

        if ($("#chkLAParagliding").prop("checked") == true) {
            laParaglidingInd = "Y";
            var paragliding = "2";
            laTotalCheckBoxChecked = laTotalCheckBoxChecked + paragliding + "~";
        }
        else {
            laParaglidingInd = "N";
        }
        if ($("#chkLAMountaineering").prop("checked") == true) {
            laMountaineeringInd = "Y";
            var mountaineering = "3";
            laTotalCheckBoxChecked = laTotalCheckBoxChecked + mountaineering + "~";
        }
        else {
            laMountaineeringInd = "N";
        }
        if ($("#chkLARacing").prop("checked") == true) {
            laRacingInd = "Y";
            var racing = "5";
            laTotalCheckBoxChecked = laTotalCheckBoxChecked + racing + "~";
        }
        else {
            laRacingInd = "N";
        }
        if ($("#chkLAOtherActivies").prop("checked") == true) {
            laOtherActiviesInd = "Y";
            var flying = "9";
            var txtotheracti = $("#txtLAOtherActivities").val();
            laTotalCheckBoxChecked = laTotalCheckBoxChecked + flying + "~";
            laTotalCheckBoxChecked = laTotalCheckBoxChecked + "10~" + txtotheracti + "~";
        }
        else {
            laOtherActiviesInd = "N";
        }
    }
})

$("#btnQues2").click(function () {
    debugger
    //Height and weight details
    //Your height
    var laHeightFt = "";
    var laHeightInch = "";
    var laWeight = "";
    var laWeightVariationInd = "";
    var laWeightVariation = "";
    var laWeightVariationReason = "";

    laHeightFt = $("#ddlLAHeight").val();
    laHeightInch = $("#ddlLAInches").val();
    laWeight = $("#txtweight").val();

    if ($('input:radio[name=rdbLAWeightVariation]:checked').val() == "yes") {

        laWeightVariationInd = "Y";
        laWeightVariation = $("#ddlLAWeightVariation").val();
        laWeightVariationReason = $("#ddlLAWeightVariationReason").val();
    }
    else {
        laWeightVariationInd = "";
        laWeightVariation = "";
        laWeightVariationReason = "";
    }

    if (isLaPropSame == "N") {
        var spouseHeightFt = "";
        var spouseHeightInch = "";
        var spouseWeight = "";
        var spouseWeightVariationInd = "";
        var spouseWeightVariation = "";
        var spouseWeightVariationReason = "";

        spouseHeightFt = $("#ddlSpouseHeight").val();
        spouseHeightInch = $("#ddlSpouseInches").val();
        spouseWeight = $("#txtSpouseWeight").val();

        if ($('input:radio[name=rdbSpouseWeightVariation]:checked').val() == "yes") {

            spouseWeightVariationInd = "Y";
            spouseWeightVariation = $("#ddlLAWeightVariation").val();
            spouseWeightVariationReason = $("#ddlLAWeightVariationReason").val();
        }
        else {
            spouseWeightVariationInd = "";
            spouseWeightVariation = "";
            spouseWeightVariationReason = "";
        }
    }

    //------Ques-1----------------------------------------
    var laTravelOutInd = "";
    var laPilotInd = "";

    var laSkyDiveInd = "";
    var laParaglidingInd = "";
    var laMountaineeringInd = "";
    var laRacingInd = "";
    var laOtherActiviesInd = "";

    var laDrugInd = "";
    var laDrugTxt = "";
    var laAlchohol = "";
    var laAlchoholTxt = "";
    var laIsSmoker = "";
    var laIsSmokerTxt = "";
    var laStopTobaccoInd = "";
    var laStopTobaccoDetails = "";
    var laStopTobDuration = "";
    var laStopTobReason = "";
    var laIsAdventurousActivities = "";
    var laTotalCheckBoxChecked = "";



    if ($('input:radio[name=rdbLATravelOutsideIndia]:checked').val() == "yes") {

        laTravelOutInd = "Y";
    }
    else {
        laTravelOutInd = "N";
    }

    if ($('input:radio[name=rdbLAPilot]:checked').val() == "yes") {

        laPilotInd = "Y";
    }
    else {
        laPilotInd = "N";
    }

    if ($("#chkLAActivities").prop("checked") == true || $("#chkLAActivities").prop("checked") == undefined) {
        IsAdventurousActivities = "N";
    }
    else {
        debugger
        IsAdventurousActivities = 'Y';

        if ($("#chkLASkyDive").prop("checked") == true) {
            laSkyDiveInd = "Y";
            var skydive = "1";
            laTotalCheckBoxChecked = skydive + "~";
        }
        else {
            laSkyDiveInd = "N";
        }

        if ($("#chkLAParagliding").prop("checked") == true) {
            laParaglidingInd = "Y";
            var paragliding = "2";
            laTotalCheckBoxChecked = laTotalCheckBoxChecked + paragliding + "~";
        }
        else {
            laParaglidingInd = "N";
        }
        if ($("#chkLAMountaineering").prop("checked") == true) {
            laMountaineeringInd = "Y";
            var mountaineering = "3";
            laTotalCheckBoxChecked = laTotalCheckBoxChecked + mountaineering + "~";
        }
        else {
            laMountaineeringInd = "N";
        }
        if ($("#chkLARacing").prop("checked") == true) {
            laRacingInd = "Y";
            var racing = "5";
            laTotalCheckBoxChecked = laTotalCheckBoxChecked + racing + "~";
        }
        else {
            laRacingInd = "N";
        }
        if ($("#chkLAOtherActivies").prop("checked") == true) {
            laOtherActiviesInd = "Y";
            var flying = "9";
            var txtotheracti = $("#txtLAOtherActivities").val();
            laTotalCheckBoxChecked = laTotalCheckBoxChecked + flying + "~";
            laTotalCheckBoxChecked = laTotalCheckBoxChecked + "10~" + txtotheracti + "~";
        }
        else {
            laOtherActiviesInd = "N";
        }
    }


    if ($('input:radio[name=rdbLADrugs]:checked').val() == "yes") {


        laDrugInd = "Y";
        laDrugTxt = $("#txtLADrugDetail").val();
    }
    else {
        laDrugInd = "N";
        laDrugTxt = "";
    }
    if ($('input:radio[name=rdbLAAlcohol]:checked').val() == "yes") {

        laAlchohol = "Y";
        if ($("#txtLABeer").val() != "" && $("#txtLAHardLiquor").val() != "" && $("#txtLAWine").val() != "") {
            laAlchoholTxt = $("#txtLABeer").val() + "~" + $("#txtLAHardLiquor").val() + "~" + $("#txtLAWine").val();
        }
        else {
            laDrugInd = "N";
            laAlchoholTxt = "";
        }

    }
    else {
        laDrugInd = "N";
        laAlchoholTxt = "";
    }

    if ($('input:radio[name=rdbLASmoker]:checked').val() == "yes") {

        laIsSmoker = "Y";
        if ($("#txtLACigar").val() != "" && $("#txtLABidi").val() != "" && $("#txtLAgutka").val() != "" && $("#txtLAPaan").val()) {
            laIsSmokerTxt = $("#txtLACigar").val() + "~" + $("#txtLABidi").val() + "~" + $("#txtLAgutka").val() + "~" + $("#txtLAPaan").val();
        }
        else {
            laIsSmoker = "N";
            laIsSmokerTxt = "";
        }

    }
    else {
        laIsSmoker = "N";
        laIsSmokerTxt = "";
    }

    if ($('input:radio[name=rdbLAStopTabacco]:checked').val() == "yes") {

        laStopTobaccoInd = "Y";
        laStopTobDuration = $("#txtLAStopTobaccoDuration").val();
        laStopTobReason = $("#txtLAStopTobaccoReason").val();
        if (laStopTobDuration != "" && laStopTobReason != "") {
            //  laStopTobaccoDetails = laStopTobDuration + "~" + laStopTobReason;
            laStopTobaccoDetails = laStopTobReason;
        }
        else {
            laStopTobaccoInd = "N";
            laStopTobDuration = "";
            laStopTobReason = "";
            laStopTobaccoDetails = "";
        }

    }
    else {
        laStopTobaccoInd = "N";
        laStopTobDuration = "";
        laStopTobReason = "";
        laStopTobaccoDetails = "";
    }


    //--Spouse Ques-1
    if (isLaPropSame == "N") {
        var spouseTravelOutInd = "";
        var spousePilotInd = "";
        var spouseSkyDiveInd = "";
        var spouseParaglidingInd = "";
        var spouseMountaineeringInd = "";
        var spouseRacingInd = "";
        var spouseOtherActiviesInd = "";
        var spouseDrugInd = "";
        var spouseDrugTxt = "";
        var spouseAlchohol = "";
        var spouseAlchoholTxt = "";
        var spouseIsSmoker = "";
        var spouseIsSmokerTxt = "";
        var spouseStopTobaccoInd = "";
        var spouseStopTobDuration = "";
        var spouseStopTobReason = "";
        var spouseIsAdventurousActivities = "N";
        var spouseTotalCheckBoxChecked = "";


        if ($('input:radio[name=rdbSpouseTravelOutsideIndia]:checked').val() == "yes") {

            spouseTravelOutInd = "Y";
        }
        else {
            spouseTravelOutInd = "N";
        }
        if ($('input:radio[name=rdbSpousePilot]:checked').val() == "yes") {

            spousePilotInd = "Y";
        }
        else {
            spousePilotInd = "N";
        }

        if ($("#chkSpouseActivities").prop("checked") == true) {

            spouseIsAdventurousActivities = "N";
        }
        else {
            spouseIsAdventurousActivities = "Y";

            if ($("#chkSpouseSkyDive").prop("checked") == true) {
                var spouseSkydive = "1";
                spouseSkyDiveInd = "Y";
                spouseTotalCheckBoxChecked = spouseTotalCheckBoxChecked + spouseSkydive + "~";
            }
            else {
                spouseSkyDiveInd = "N";
            }
            if ($("#chkSpouseParagliding").prop("checked") == true) {
                var spouseParagliding = "2";
                spouseParaglidingInd = "Y";
                spouseTotalCheckBoxChecked = spouseTotalCheckBoxChecked + spouseParagliding + "~";
            }
            else {
                spouseParaglidingInd = "N";
            }
            if ($("#chkSpouseMountaineering").prop("checked") == true) {
                var spouseMountaineering = "3";
                spouseMountaineeringInd = "Y";
                spouseTotalCheckBoxChecked = spouseTotalCheckBoxChecked + spouseMountaineering + "~";
            }
            else {
                spouseMountaineeringInd = "N";
            }
            if ($("#chkSpouseRacing").prop("checked") == true) {
                var spouseRacing = "5";
                spouseRacingInd = "Y";
                spouseTotalCheckBoxChecked = spouseTotalCheckBoxChecked + spouseRacing + "~";
            }
            else {
                spouseRacingInd = "N";
            }
            if ($("#chkSpouseOtherActivies").prop("checked") == true) {
                var spouseFlying = "9";
                spouseOtherActiviesInd = "Y";
                spouseTotalCheckBoxChecked = spouseTotalCheckBoxChecked + spouseFlying + "~";
                spouseTotalCheckBoxChecked = spouseTotalCheckBoxChecked + "10~" + '' + "~";
            }
            else {
                spouseOtherActiviesInd = "N";
            }
        }

        if ($('input:radio[name=rdbSpouseDrugs]:checked').val() == "yes") {

            spouseDrugInd = "Y";
        }
        else {
            spouseDrugInd = "N";
        }
        if ($('input:radio[name=rdbSpouseAlcohol]:checked').val() == "yes") {

            spouseAlchohol = "Y";
        }
        else {
            spouseAlchohol = "N";
        }
        if ($('input:radio[name=rdbSpouseSmoker]:checked').val() == "yes") {

            spouseIsSmoker = "Y";
        }
        else {
            spouseIsSmoker = "N";
        }
        if ($('input:radio[name=rdbSpouseStopTabacco]:checked').val() == "yes") {

            spouseStopTobacco = "Y";
        }
        else {
            spouseStopTobacco = "N";
        }
    }



    //---Ques-2
    var laConsultDocInd = "";
    var laConsultDocTxt = "";
    var laTestInd = "";
    var laTestTxt = "";
    var laAdmittedInd = "";
    var laAdmittedTxt = "";
    var laMedication = "";
    var laMedicationTxt = "";
    var laHeartDiseaseInd = "";
    var laHeartDiseaseTxt = "";
    var laBpInd = "";
    var laBpTxt = "";
    var laLungDiseaseInd = "";
    var laLungDiseaseTxt = "";
    var laDiabetesInd = "";
    var laDiabetesTxt = "";
    var laDiseaseInd = "";
    var laDiseaseTxt = "";
    var laDigestInd = "";
    var laDigestTxt = "";
    var laCancerInd = "";
    var laCancerTxt = "";
    var laTropicalInd = "";
    var laTropicalTxt = "";
    var laThyroidInd = "";
    var laThyroidTxt = "";
    var laBloodInd = "";
    var laBloodTxt = "";
    var laNeuroInd = "";
    var laNeuroTxt = "";
    var laMuscleDiseaseInd = "";
    var laMuscleDiseaseTxt = "";
    var laHivInd = "";
    var laHivTxt = "";
    var laExcessAlchInd = "";
    var laExcessAlchTxt = "";
    var laOtherIllnessInd = "";
    var laOtherIllnessTxt = "";
    var laDeformityInd = "";
    var laDeformityTxt = "";
    var laSymptomInd = "";
    var laSymptomTxt = "";
    var laPregInd = "";
    var laPregTxt = "";
    var laPregAbnormInd = "";
    var laPregAbnormTxt = "";
    var laHospitalizedInd = "";
    var laHospitalizedDate = "";
    var laFullyRecoveredInd = "";
    var laFullyRecoveredTxt = "";


    //  if ($("input[name='rdbLADoctor']").val() == "yes") {
    if ($('input:radio[name=rdbLADoctor]:checked').val() == "yes") {//
        laConsultDocInd = "Y";
        laConsultDocTxt = $("#txtLADoctorDetails").val();
    }
    else {
        laConsultDocInd = "N";
        laConsultDocTxt = "";
    }

    if ($('input:radio[name=rdbLATests]:checked').val() == "yes") {

        laTestInd = "Y";
        laTestTxt = $("#txtLADoctorDetails").val();
    }
    else {
        laTestInd = "N";
        laTestTxt = "";
    }

    if ($('input:radio[name=rdbLAAdmitted]:checked').val() == "yes") {

        laAdmittedInd = "Y";
        laAdmittedTxt = $("#txtLAAdmittedDetails").val();
    }
    else {
        laAdmittedInd = "N";
        laAdmittedTxt = "";
    }

    if ($('input:radio[name=rdbLAMedication]:checked').val() == "yes") {

        laMedication = "Y";
        laMedicationTxt = $("#txtLAMedicationDetails").val();
    }
    else {
        laMedication = "N";
        laMedicationTxt = "";
    }
    if ($('input:radio[name=rdbLAHeart]:checked').val() == "yes") {

        $('input:radio[name=rdbLAMedication]:checked').val()
        laHeartDiseaseInd = "Y";
        laHeartDiseaseTxt = $("#txtLAHeartDetails").val();
    }
    else {
        laHeartDiseaseInd = "N";
        laHeartDiseaseTxt = "";
    }
    if ($('input:radio[name=rdbLABp]:checked').val() == "yes") {

        laBpInd = "Y";
        laBpTxt = $("#txtLABPDetails").val();
    }
    else {
        laBpInd = "N";
        laBpTxt = "";
    }
    if ($('input:radio[name=rdbLALung]:checked').val() == "yes") {

        laLungDiseaseInd = "Y";
        laLungDiseaseTxt = $("#txtLABPDetails").val();
    }
    else {
        laLungDiseaseInd = "N";
        laLungDiseaseTxt = "";
    }

    if ($('input:radio[name=rdbLADiabetes]:checked').val() == "yes") {

        laDiabetesInd = "Y";
        laDiabetesTxt = $("#txtLADiabetesDetails").val();
    }
    else {
        laDiabetesInd = "N";
        laDiabetesTxt = "";
    }

    if ($('input:radio[name=rdbLADisease]:checked').val() == "yes") {

        laDiseaseInd = "Y";
        laDiseaseTxt = $("#txtLADiseaseDetails").val();
    }
    else {
        laDiseaseInd = "N";
        laDiseaseTxt = "";
    }
    if ($('input:radio[name=rdbLADigestive]:checked').val() == "yes") {

        laDigestInd = "Y";
        laDigestTxt = $("#txtLADigestiveDetails").val();
    }
    else {
        laDigestInd = "N";
        laDigestTxt = "";
    }

    if ($('input:radio[name=rdbLACancer]:checked').val() == "yes") {

        laCancerInd = "Y";
        laCancerTxt = $("#txtLACancerDetails").val();
    }
    else {
        laCancerInd = "N";
        laCancerTxt = "";
    }

    if ($('input:radio[name=rdbLATropical]:checked').val() == "yes") {

        laTropicalInd = "Y";
        laTropicalTxt = $("#txtLATropicalDetails").val();
    }
    else {
        laTropicalInd = "N";
        laTropicalTxt = "";
    }
    if ($('input:radio[name=rdbLAThyroid]:checked').val() == "yes") {

        laThyroidInd = "Y";
        laThyroidTxt = $("#txtLAThyroidDetails").val();
    }
    else {
        laThyroidInd = "N";
        laThyroidTxt = "";
    }

    if ($('input:radio[name=rdbLABlood]:checked').val() == "yes") {

        laBloodInd = "Y";
        laBloodTxt = $("#txtLABloodDetails").val();
    }
    else {
        laBloodInd = "N";
        laBloodTxt = "";
    }

    if ($('input:radio[name=rdbLANeuro]:checked').val() == "yes") {

        laNeuroInd = "Y";
        laNeuroTxt = $("#txtLANeuroDetails").val();
    }
    else {
        laNeuroInd = "N";
        laNeuroTxt = "";
    }

    if ($('input:radio[name=rdbLADisorder]:checked').val() == "yes") {

        laMuscleDiseaseInd = "Y";
        laMuscleDiseaseTxt = $("#txtLADisorderDetails").val();
    }
    else {
        laMuscleDiseaseInd = "N";
        laMuscleDiseaseTxt = "";
    }

    if ($('input:radio[name=rdbLAAids]:checked').val() == "yes") {

        laHivInd = "Y";
        laHivTxt = $("#txtLAAidsDetails").val();
    }
    else {
        laHivInd = "N";
        laHivTxt = "";
    }

    if ($('input:radio[name=rdbLAAlcoholic]:checked').val() == "yes") {

        laExcessAlchInd = "Y";
        laExcessAlchTxt = $("#txtLAAlcoholicDetails").val();
    }
    else {
        laExcessAlchInd = "N";
        laExcessAlchTxt = "";
    }

    if ($('input:radio[name=rdbLAOtherill]:checked').val() == "yes") {

        laOtherIllnessInd = "Y";
        laOtherIllnessTxt = $("#txtLAOtherillDetails").val();
    }
    else {
        laOtherIllnessInd = "N";
        laOtherIllnessTxt = "";
    }
    if ($('input:radio[name=rdbLADeformity]:checked').val() == "yes") {

        laDeformityInd = "Y";
        laDeformityTxt = $("#txtLADeformityDetails").val();
    }
    else {
        laDeformityInd = "N";
        laDeformityTxt = "";
    }
    if ($('input:radio[name=rdbLASymptoms]:checked').val() == "yes") {

        laSymptomInd = "Y";
        laSymptomTxt = $("#txtLASymptomsDetails").val();
    }
    else {
        laSymptomInd = "N";
        laSymptomTxt = "";
    }

    if ($('input:radio[name=rdbLAPregnant]:checked').val() == "yes") {
        debugger
        laPregInd = "Y";
    }
    else {
        laPregInd = "N";
    }
    if ($('input:radio[name=rdbLAPregAbnorm]:checked').val() == "yes") {

        laPregAbnormInd = "Y";
    }
    else {
        laPregAbnormInd = "N";
    }

    if ($('input:radio[name=rdbLAMediRecover]:checked').val() == "yes") {

        laFullyRecoveredInd = "Y";
        laFullyRecoveredTxt = $("#txtLAMediRecoverDetail").val();
    }
    else {
        laFullyRecoveredInd = "N";
        laFullyRecoveredTxt = "";
    }

    if ($('input:radio[name=rdbLAHospitalized]:checked').val() == "yes") {

        laHospitalizedInd = "Y";
        laHospitalizedDate = $("#txtLAHospitalizedDate").val();
    }
    else {
        laHospitalizedInd = "N";
        laHospitalizedDate = "";
    }




    //Spouse Ques-2
    if (isLaPropSame == "N") {
        var spouseConsultDocInd = "";
        var spouseTestInd = "";
        var spouseAdmittedInd = "";
        var spouseMedication = "";
        var spouseHeartDiseaseInd = "";
        var spouseBpInd = "";
        var spouseLungDiseaseInd = "";
        var spouseDiabetesInd = "";
        var spouseDiseaseInd = "";
        var spouseDigestInd = "";
        var spouseCancerInd = "";
        var spouseTropicalInd = "";
        var spouseThyroidInd = "";
        var spouseBloodInd = "";
        var spouseNeuroInd = "";
        var spouseMuscleDiseaseInd = "";
        var spouseHivInd = "";
        var spouseExcessAlchInd = "";
        var spouseOtherIllnessInd = "";
        var spouseDeformityInd = "";
        var spouseSymptomInd = "";
        var spousePregInd = "";
        var spousePregAbnormInd = "";
        var spouseHospitalizedInd = "";
        var spouseFullyRecoveredInd = "";


        if ($('input:radio[name=rdbSpouseDoctor]:checked').val() == "yes") {

            spouseConsultDocInd = "Y";
        }
        else {
            spouseConsultDocInd = "N";
        }

        if ($('input:radio[name=rdbSpouseTests]:checked').val() == "yes") {

            spouseTestInd = "Y";
        }
        else {
            spouseTestInd = "N";
        }
        if ($('input:radio[name=rdbSpouseAdmitted]:checked').val() == "yes") {

            spouseAdmittedInd = "Y";
        }
        else {
            spouseAdmittedInd = "N";
        }
        if ($('input:radio[name=rdbSpouseMedication]:checked').val() == "yes") {

            spouseMedication = "Y";
        }
        else {
            spouseMedication = "N";
        }
        if ($('input:radio[name=rdbSpouseHeart]:checked').val() == "yes") {

            spouseHeartDiseaseInd = "Y";
        }
        else {
            spouseHeartDiseaseInd = "N";
        }
        if ($('input:radio[name=rdbSpouseBp]:checked').val() == "yes") {

            spouseBpInd = "Y";
        }
        else {
            spouseBpInd = "N";
        }

        if ($('input:radio[name=rdbSpouseDiabetes]:checked').val() == "yes") {

            spouseDiabetesInd = "Y";
        }
        else {
            spouseDiabetesInd = "N";
        }
        if ($('input:radio[name=rdbSpouseDisease]:checked').val() == "yes") {

            spouseDiseaseInd = "Y";
        }
        else {
            spouseDiseaseInd = "N";
        }
        if ($('input:radio[name=rdbSpouseDigestive]:checked').val() == "yes") {

            spouseDigestInd = "Y";
        }
        else {
            spouseDigestInd = "N";
        }
        if ($('input:radio[name=rdbSpouseCancer]:checked').val() == "yes") {

            spouseCancerInd = "Y";
        }
        else {
            spouseCancerInd = "N";
        }
        if ($('input:radio[name=rdbSpouseTropical]:checked').val() == "yes") {

            spouseTropicalInd = "Y";
        }
        else {
            spouseTropicalInd = "N";
        }


        if ($('input:radio[name=rdbSpouseThyroid]:checked').val() == "yes") {

            spouseThyroidInd = "Y";
        }
        else {
            spouseThyroidInd = "N";
        }


        if ($('input:radio[name=rdbSpouseBlood]:checked').val() == "yes") {

            rdbSpouseBlood = "Y";
        }
        else {
            rdbSpouseBlood = "N";
        }

        if ($('input:radio[name=rdbSpouseNeuro]:checked').val() == "yes") {

            spouseNeuroInd = "Y";
        }
        else {
            spouseNeuroInd = "N";
        }

        if ($('input:radio[name=rdbSpouseDisorder]:checked').val() == "yes") {

            spouseMuscleDiseaseInd = "Y";
        }
        else {
            spouseMuscleDiseaseInd = "N";
        }
        if ($('input:radio[name=rdbSpouseAids]:checked').val() == "yes") {

            spouseHivInd = "Y";
        }
        else {
            spouseHivInd = "N";
        }
        if ($('input:radio[name=rdbSpouseAlcoholic]:checked').val() == "yes") {

            spouseExcessAlchInd = "Y";
        }
        else {
            spouseExcessAlchInd = "N";
        }


        if ($('input:radio[name=rdbSpouseOtherill]:checked').val() == "yes") {

            spouseOtherIllnessInd = "Y";
        }
        else {
            spouseOtherIllnessInd = "N";
        }

        if ($('input:radio[name=rdbSpouseDeformity]:checked').val() == "yes") {

            spouseDeformityInd = "Y";
        }
        else {
            spouseDeformityInd = "N";
        }

        if ($('input:radio[name=rdbSpouseSymptoms]:checked').val() == "yes") {

            spouseSymptomInd = "Y";
        }
        else {
            spouseSymptomInd = "N";
        }

        if ($('input:radio[name=rdbSpousePregnant]:checked').val() == "yes") {

            spousePregInd = "Y";
        }
        else {
            spousePregInd = "N";
        }
        if ($('input:radio[name=rdbSpousePregAbnorm]:checked').val() == "yes") {

            spousePregAbnormInd = "Y";
        }
        else {
            spousePregAbnormInd = "N";
        }
    }


    //-----Ques-3-----------
    //Your Insurance details
    var laInsDeclinedInd = "";
    var laInsDecliNameInsurer = "";
    var laInsDecliReason = "";
    var laInsDecliDate = "";

    var laIsCIbenefit = "";
    var laIsCIInsName = "";
    var laIsCIReason = "";
    var laIsCIDate = "";

    var laInsApplyInd = "";
    var laDiscloseInfoInd = "";

    if ($('input:radio[name=rdbLALifeInsurer]:checked').val() == "yes") {
        debugger
        laInsDeclinedInd = "Y";
        laInsDecliNameInsurer = $("#ddlLANameofcomp").val();
        laInsDecliReason = $("#txtLAReason").val();
        laInsDecliDate = $("#txtLAInsDeclWhen").val();
    }
    else {
        laInsDeclinedInd = "N";
        laInsDecliNameInsurer = "";
        laInsDecliReason = "";
        laInsDecliDate = "";
    }

    if ($('input:radio[name=rdbLALifeInsurerBenefits]:checked').val() == "yes") {

        laIsCIbenefit = "Y";
        laIsCIInsName = $("#ddlLANameOfIns").val();
        laIsCIReason = $("#txtLAInsReason").val();
        laIsCIDate = $("#txtLAInsDate").val();
    }
    else {
        laIsCIbenefit = "N";
        laIsCIInsName = "";
        laIsCIReason = "";
        laIsCIDate = "";
    }
    if ($('input:radio[name=rdbLAExistInsurance]:checked').val() == "yes") {

        laInsApplyInd = "Y";

        if ($('input:radio[name=rdbLADiscloseInsur1]:checked').val() == "yes") {

            laDiscloseInfoInd = "Y";
        }
        else {
            laDiscloseInfoInd = "N";
        }
    }
    else {
        laInsApplyInd = "N";
        laDiscloseInfoInd = "N";
    }

    //Spouse insurance details
    if (isLaPropSame == "N") {
        var spouseInsDeclinedInd = "";
        var spouseIsCIbenefit = "";
        var spouseInsApplyInd = "";
        var spouseDiscloseInfoInd = "";

        if ($('input:radio[name=rdbSpouseLifeInsurer]:checked').val() == "yes") {

            spouseInsDeclinedInd = "Y";
        }
        else {
            spouseInsDeclinedInd = "N";
        }

        if ($('input:radio[name=rdbSpouseLifeInsurerBenefits]:checked').val() == "yes") {

            spouseIsCIbenefit = "Y";
        }
        else {
            spouseIsCIbenefit = "N";
        }
        if ($('input:radio[name=rdbSpouseExistInsurance]:checked').val() == "yes") {

            spouseInsApplyInd = "Y";

            if ($('input:radio[name=rdbSpouseDiscloseInsur1]:checked').val() == "yes") {

                spouseDiscloseInfoInd = "Y";
            }
            else {
                spouseDiscloseInfoInd = "N";
            }
        }
        else {
            spouseInsApplyInd = "N";
        }
    }



    //your family and income details
    var tblFamInsRowCount = 0;
    var jsonFamIns = null;
    var MedicalQuestion = null;
    tblFamInsRowCount = parseInt($("#tblFamInsRowCount").val());

    var stringFamIns = "[";

    var table = $("#tblFamInsDetail tbody");

    ;
    table.find('tr').each(function (i, el) {
        var $tds = $(this).find('td'),
            relationId = $tds.eq(0).text(),
            relation = $tds.eq(1).text(),
            occupation = $tds.eq(2).text(),
            totalSumAssured = $tds.eq(3).text(),
            Income = $tds.eq(4).text()

        stringFamIns = stringFamIns + '{"relation": "' + relationId + '","occupation": "' + occupation + '","totalSA": "' + totalSumAssured + '","Income": "' + Income +
            '"},';
    });

    var strVal = stringFamIns;
    var lastChar = strVal.slice(-1);
    if (lastChar == ',') {
        strVal = strVal.slice(0, -1);
    }

    stringFamIns = strVal + ']';
    //jsonFamIns = jQuery.parseJSON(stringFamIns);
    jsonFamIns = stringFamIns;
    var stringJsonFamIns = jsonFamIns;

    // console.log(stringJsonFamIns);

    
    //--- your existing insurance details
    debugger
    if (laDiscloseInfoInd == "Y") {
        var tblExstInsRowCount = 0;
        tblExstInsRowCount = parseInt($("#tblExstInsRowCount").val());
        var stringExstIns = null;
        if (tblExstInsRowCount > 0) {
            stringExstIns = "[";

            var table = $("#tblExstInsDetail tbody");


            table.find('tr').each(function (i, el) {
                var $tds = $(this).find('td'),
                    policyNo = $tds.eq(0).text(),
                    insCompany = $tds.eq(1).text(),
                    yearPolicy = $tds.eq(2).text(),
                    annualarizedPremium = $tds.eq(3).text(),
                    policyStatus = $tds.eq(4).text(),
                    sumAssured = $tds.eq(5).text(),
                    acceptTerm = $tds.eq(6).text()

                stringExstIns = stringExstIns + '{"policyNo": "' + policyNo + '","companyName": "' + insCompany + '","yearOfIssue": "' + yearPolicy + '","annualizedPremium": "' + annualarizedPremium + '","policyStatus": "' + policyStatus +
                    '", "sumAssured": "' + sumAssured + '","acceptanceTerm": "' + acceptTerm + '"},';
            });

            var strVal = stringExstIns;
            var lastChar = strVal.slice(-1);
            if (lastChar == ',') {
                strVal = strVal.slice(0, -1);
            }

            stringExstIns = strVal + ']';
        }

        //  var jsonExstIns = jQuery.parseJSON(stringExstIns);
        var jsonExstIns = stringExstIns;
    }


    //-----Your family details
    var tblYourFamRowCount = 0;
    var stringYourFam = "";
    debugger
    tblYourFamRowCount = parseInt($("#tblYourFamRowCount").val());

    stringYourFam = "[";

    var table = $("#tblYourFamDetail tbody");


    table.find('tr').each(function (i, el) {
        var $tds = $(this).find('td'),
            RelationId = $tds.eq(0).text(),
            //Relation = $tds.eq(1).text(),
            livingAge = $tds.eq(2).text(),
            healthStatus = $tds.eq(3).text(),
            ageOfDeath = $tds.eq(4).text(),
            causeOfDeath = $tds.eq(5).text()


        stringYourFam = stringYourFam + '{"relation": "' + RelationId + /*'","Relation": "' + Relation +*/ '","age": "' + livingAge + '","healthStatus": "' + healthStatus + '","ageOnDeath": "' + ageOfDeath +
            '", "causeOfDeath": "' + causeOfDeath + '"},';
    });

    var strVal = stringYourFam;
    var lastChar = strVal.slice(-1);
    if (lastChar == ',') {
        strVal = strVal.slice(0, -1);
    }

    stringYourFam = strVal + ']';
    //var jsonYourFam = jQuery.parseJSON(stringYourFam);
    var jsonYourFam = stringYourFam;

    var isFamMemberDisease = "";
    var txtFamMemberDisease = "";
    var hasFamMemEdelPolicy = "";


    if ($('input:radio[name=rdbLADiscloseInsur]:checked').val() == "yes") {

        isFamMemberDisease = "Y";
        txtFamMemberDisease = $("#txtLAtdetailhereditary").val();
    }
    else {
        isFamMemberDisease = "N";
        txtFamMemberDisease = "";
    }

    if ($('input:radio[name=rdbLAfamilyETLIIns]:checked').val() == "yes") {

        hasFamMemEdelPolicy = "Y";
    }
    else {
        hasFamMemEdelPolicy = "N";
    }

    //-----Spouse family details
    if (isLaPropSame == "N") {
        ;
        var tblSpouseFamRowCount = 0;
        tblSpouseFamRowCount = parseInt($("#tblSpouseFamRowCount").val());

        var stringSpouseFam = "[";

        var table = $("#tblSpouseFamDetail tbody");

        table.find('tr').each(function (i, el) {
            var $tds = $(this).find('td'),
                RelationId = $tds.eq(0).text(),
                Relation = $tds.eq(1).text(),
                livingAge = $tds.eq(2).text(),
                healthStatus = $tds.eq(3).text(),
                ageOfDeath = $tds.eq(4).text(),
                causeOfDeath = $tds.eq(5).text()


            stringSpouseFam = stringSpouseFam + '{"relation": "' + RelationId + /*'","Relation": "' + Relation +*/ '","age": "' + livingAge + '","healthStatus": "' + healthStatus + '","ageOnDeath": "' + ageOfDeath +
                '", "causeOfDeath": "' + causeOfDeath + '"},';
        });

        var strVal = stringSpouseFam;
        var lastChar = strVal.slice(-1);
        if (lastChar == ',') {
            strVal = strVal.slice(0, -1);
        }

        stringSpouseFam = strVal + ']';
        var jsonSpouseFam = jQuery.parseJSON(stringSpouseFam);

        var isSpouseFamMemberDisease = "";
        var txtSpouseFamMemberDisease = "";

        if ($('input:radio[name=rdbSpouseDiscloseInsur]:checked').val() == "yes") {

            isSpouseFamMemberDisease = "Y";
            txtSpouseFamMemberDisease = $("#txtSpousetdetailhereditary").val();
        }
        else {
            isSpouseFamMemberDisease = "N";
            txtSpouseFamMemberDisease = "";
        }
    }

});

function submitPF() {

    //var isLaPropSame = "";
    var isLaPropSame = $("#isLaPropSame").val();
    isLaPropSame = $("#islasame").val();
    var laCliId = $("#laCliId").val();
    var spouseCliId = "";

    var isBetterHalfBenefit = false;
    if (isLaPropSame == "N") {
        isBetterHalfBenefit = true;
        spouseCliId = $("#spouseCliId").val();
    }


    //Your Personal details
    //general details
    var laTitle = "";
    var laFName = "";
    var laMName = "";
    var laLName = "";
    var laDOB = "";
    var laGender = "";
    var laMarital = "";
    var laPAN = "";
    var laFatherName = "";
    var laMotherName = "";
    var laAdhaar = "";
    var laAgeProof = "";
    var laNationality = "";

    laTitle = $("#ddlLATitle").val();
    laFName = $("#txtfirstname").val();
    laMName = $("#txtmiddlename").val();
    laLName = $("#txtlastname").val();
    laDOB = $("#txtdob").val().replace(/\-/g, "/");
    if ($("#ddlgender").val() == "Male") { laGender = "M"; } else { laGender = "F";}

    // laGender = $("#ddlgender").val();
    laMarital = $("#ddlMaritalstatus").val();
    laPAN = $("#txtpanno").val();
    laFatherName = $("#txtfathername").val();
    laMotherName = $("#txtmothername").val();
    laAdhaar = $("#txtadharno").val();
    laAgeProof = $("#ddlageproof").val();
    laNationality = $("#ddlnatinality").val();

    //Your Address Details  
    var laPerAddr1 = "";
    var laPerAddr2 = "";
    var laPerAddr3 = "";
    var laPin = "";
    var laState = "";
    var laCity = "";

    laPerAddr1 = $("#paddress1").val();
    laPerAddr2 = $("#paddress2").val();
    laPerAddr3 = $("#paddress3").val();
    laPin = $("#ppincode").val();
    laState = $("#pstate").val();
    laCity = $("#pcity").val();

    var isCurrSamePer = "";

    //your current address
    var laCurrAddr1 = "";
    var laCurrAddr2 = "";
    var laCurrAddr3 = "";
    var laCurrPin = "";
    var laCurrState = "";
    var laCurrCity = "";

    var corrAddr = "";

    if ($("#rdbLACorrAddrY").prop("checked") == true) {
        isCurrSamePer = "Y";

        laCurrAddr1 = laPerAddr1;
        laCurrAddr2 = laPerAddr2;
        laCurrAddr3 = laPerAddr3;
        laCurrPin = laPin;
        laCurrState = laState;
        laCurrCity = laCity;
    }
    if ($("#rdbLACorrAddrN").prop("checked") == true) {
        isCurrSamePer = "N";

        laCurrAddr1 = $("#caddress1").val();
        laCurrAddr2 = $("#caddress2").val();
        laCurrAddr3 = $("#caddress3").val();
        laCurrPin = $("#cpincode").val();
        laCurrState = $("#cstate").val();
        laCurrCity = $("#ccity").val();

        if ($("#rdbLACorrAddrY").prop("checked") == true) {
            corrAddr = "Y";
        }
        else {
            corrAddr = "N";
        }
    }


    //your contact details
    var laEmailId = "";
    var laPhoneM = "";
    var laPhoneR = "";
    var laPhoneO = "";
    var laFbId = "";
    var laLinkedInId = "";
    var laCorporateId = "";

    laEmailId = $("#txtemailid").val();
    laPhoneM = $("#txtphonemobile").val();
    laPhoneR = $("#txtphoneresidental").val();
    laPhoneO = $("#txtphoneoffice").val();
    laFbId = $("#txtfacebookid").val();
    laLinkedInId = $("#txtlinkdinid").val();
    laCorporateId = $("#txtcorporateid").val();


    //your Education Details
    var laEducation = "";
    var laOtherEducation = "";
    var laColgName = "";
    var laHighestQuali = "";

    laEducation = $("#ddlLAEducation").val();
    laColgName = $("#txtcollegename").val();
    laHighestQuali = $("#txthighestedu").val();


    if (isLaPropSame == "N") {
        //Spouse Personal Details
        //General Details
        var spouseTitle = "";
        var spouseFName = "";
        var spouseMName = "";
        var spouseLName = "";
        var spouseDOB = "";
        var spouseGender = "";
        var spouseMarital = "";
        var spousePAN = "";
        var spouseFatherName = "";
        var spouseMotherName = "";
        var spouseAdhaar = "";
        var spouseAgeProof = "";
        var spouseNationality = "";

        if ($("#ddlSpousegender").val() == "Male") {
            debugger
            spouseGender = "M";
        } else {
            spouseGender = "F";
        }

        spouseTitle = $("#ddlSpouseTitle").val();
        spouseFName = $("#txtSpousefirstname").val();
        spouseMName = $("#txtSpousemiddlename").val();
        spouseLName = $("#txtSpouselastname").val();
        spouseDOB = $("#txtSpousedob").val();
        //spouseGender = $("#ddlSpousegender").val();
        spouseMarital = $("#ddlSpouseMaritalstatus").val();
        spousePAN = $("#txtSpousepanno").val();
        spouseFatherName = $("#txtSpousefathername").val();
        spouseMotherName = $("#txtSpousemothername").val();
        spouseAdhaar = $("#txtSpouseadharno").val();
        spouseAgeProof = $("#ddlSpouseageproof").val();
        spouseNationality = $("#ddlSpousenatinality").val();


        //Spouse Address details

        var addrSameAsLA = "";

        var spousePerAddr1 = "";
        var spousePerAddr2 = "";
        var spousePerAddr3 = "";
        var spousePin = "";
        var spouseState = "";
        var spouseCity = "";

        var isCurrSamePerSpouse = "";

        var spouseCurrAddr1 = "";
        var spouseCurrAddr2 = "";
        var spouseCurrAddr3 = "";
        var spousePin = "";
        var spouseState = "";
        var spouseCity = "";

        var corrAddrSpouse = "";

        if ($("#chkAddrSameAsLA").prop("checked") == true) {
            addrSameAsLA = "Y";

            spousePerAddr1 = $("#paddress1").val();
            spousePerAddr2 = $("#paddress2").val();
            spousePerAddr3 = $("#paddress3").val();
            spousePin = $("#ppincode").val();
            spouseState = $("#pstate").val();
            spouseCity = $("#pcity").val();

            if ($("#rdbLACorrAddrY").prop("checked") == true) {
                isCurrSamePerSpouse = "Y";

                spouseCurrAddr1 = spousePerAddr1;
                spouseCurrAddr2 = spousePerAddr2;
                spouseCurrAddr3 = spousePerAddr3;
                spouseCPin = spousePin;
                spouseCState = spouseState;
                spouseCCity = spouseCity;

            }
            if ($("#rdbLACorrAddrN").prop("checked") == true) {
                isCurrSamePerSpouse = "N";

                spouseCurrAddr1 = $("#caddress1").val();
                spouseCurrAddr2 = $("#caddress2").val();
                spouseCurrAddr3 = $("#caddress3").val();
                spouseCPin = $("#cpincode").val();
                spouseCState = $("#cstate").val();
                spouseCCity = $("#ccity").val();

                if ($("#rdbLACorrAddrY").prop("checked") == true) {
                    corrAddrSpouse = "Y";
                }
                else {
                    corrAddrSpouse = "N";
                }
            }

        }

        else {
            addrSameAsLA = "N";

            spousePerAddr1 = $("#Spousepaddress1").val();
            spousePerAddr2 = $("#Spousepaddress2").val();
            spousePerAddr3 = $("#Spousepaddress3").val();
            spousePin = $("#Spouseppincode").val();
            spouseState = $("#Spousepstate").val();
            spouseCity = $("#Spousepcity").val();

            if ($("#rdbSpouseCorrAddrY").prop("checked") == true) {
                isCurrSamePerSpouse = "Y";

                spouseCurrAddr1 = spousePerAddr1;
                spouseCurrAddr2 = spousePerAddr2;
                spouseCurrAddr3 = spousePerAddr3;
                spouseCPin = spousePin;
                spouseCState = spouseState;
                spouseCCity = spouseCity;
            }
            else {
                isCurrSamePerSpouse = "N";

                spouseCurrAddr1 = $("#Spousecaddress1").val();
                spouseCurrAddr2 = $("#Spousecaddress2").val();
                spouseCurrAddr3 = $("#Spousecaddress3").val();
                spouseCPin = $("#Spousecpincode").val();
                spouseCState = $("#Spousepstate").val();
                spouseCCity = $("#Spouseppincode").val();

                if ($("#rdbSpouseCurOrPerY").prop("checked") == true) {
                    corrAddrSpouse = "Y";
                }
                else {
                    corrAddrSpouse = "N";
                }
            }

        }


        //spouse contact details
        var spouseEmailId = "";
        var spousePhoneM = "";
        var spousePhoneR = "";
        var spousePhoneO = "";
        var spouseFbId = "";
        var spouseLinkedInId = "";
        var spouseCorporateId = "";

        spouseEmailId = $("#Spousetxtemailid").val();
        spousePhoneM = $("#Spousetxtphonemobile").val();
        spousePhoneR = $("#Spousetxtphoneresidental").val();
        spousePhoneO = $("#Spousetxtphoneoffice").val();
        spouseFbId = $("#Spousetxtfacebookid").val();
        spouseLinkedInId = $("#Spousetxtlinkdinid").val();
        spouseCorporateId = $("#Spousetxtcorporateid").val();


        //spouse Education Details
        var spouseEducation = "";
        var spouseColgName = "";
        var spouseHighestQuali = "";

        spouseEducation = $("#ddlSpouseEducation").val();
        spouseColgName = $("#txtcollegenameSpouse").val();
        spouseHighestQuali = $("#txthighesteduSpouse").val();
    }


    //------Employment details-----------------------
    //your employment details

    var laEmpType = "";
    var laEmpName = "";
    var laEmpDesign = "";
    var laNatureOfDuty = "";
    var laExpYears = "";
    var laExpMonths = "";
    var laAddressOfEmp = "";
    var laIndType = "";
    var laNoOfEmp = "";
    var laAnnIncome = "";
    var laIncSrcInd = "";
    var laIncSrcTxt = "";

    laEmpType = $("#ddlLAEmployment").val();

    if (laEmpType == "1" || laEmpType == "8" || laEmpType == "5" || laEmpType == "7") {
        laEmpName = $("#txtnameofemployer").val();
        laEmpDesign = $("#txtladesignation").val();
        laNatureOfDuty = $("#ddlLAJobNature").val();
        laExpYears = $("#ddlLAExpYears").val();
        laExpMonths = $("#ddlLAExpMonths").val();
        laAddressOfEmp = $("#txtaddressofemployer").val();
        laIndType = $("#ddlLAIndustryType").val();
        laNoOfEmp = $("#ddlLANoofEmp").val();
        laAnnIncome = $("#txtannualincome").val();

        if ($("#rdbLAIncmSrcN").prop("checked") == true) {
            laIncSrcInd = "N";
            laIncSrcTxt = $("#txtLAotherIncmSrc").val();
        }
        if ($("#rdbLAIncmSrcY").prop("checked") == true) {
            laIncSrcInd = "Y";
            laIncSrcTxt = "";
        }

        if ($('input:radio[name=rdbLAIncmSrc]:checked').val() == "yes") {
            $("#divOtherIncome").hide();
        } else {
            $("#divOtherIncome").show();
        }
    }
    if (laEmpType == "2" || laEmpType == "6" || laEmpType == "3") {
        laAnnIncome = $("#txtannualincome").val();

        if ($("#rdbLAIncmSrcN").prop("checked") == true) {
            laIncSrcInd = "N";
            laIncSrcTxt = $("#txtLAotherIncmSrc").val();
        }
        if ($("#rdbLAIncmSrcY").prop("checked") == true) {
            laIncSrcInd = "Y";
            laIncSrcTxt = "";
        }

        if ($('input:radio[name=rdbLAIncmSrc]:checked').val() == "yes") {
            $("#divOtherIncome").hide();
        } else {
            $("#divOtherIncome").show();
        }
    }

    //Spouse Employment details
    if (isLaPropSame == "N") {
        var spouseEmpType = "";
        var spouseEmpName = "";
        var spouseEmpDesign = "";
        var spouseNatureOfDuty = "";
        var spouseExpYears = "";
        var spouseExpMonths = "";
        var spouseAddressOfEmp = "";
        var spouseIndType = "";
        var spouseNoOfEmp = "";
        var spouseAnnIncome = "";
        var spouseIncSrcInd = "";
        var spouseIncSrcTxt = "";

        spouseEmpType = $("#ddlSpouseEmployment").val();

        if (spouseEmpType == "1" || spouseEmpType == "8" || spouseEmpType == "5" || spouseEmpType == "7") {
            spouseEmpName = $("#txtSpousenameofemployer").val();
            spouseEmpDesign = $("#txtSpousedesignation").val();
            spouseNatureOfDuty = $("#ddlSpouseJobNature").val();
            spouseExpYears = $("#ddlSpouseExpYears").val();
            spouseExpMonths = $("#ddlSpouseExpMonths").val();
            spouseAddressOfEmp = $("#txtSpouseaddressofemployer").val();
            spouseIndType = $("#ddlSpouseIndustryType").val();
            spouseNoOfEmp = $("#ddlSpouseNoofEmp").val();
            spouseAnnIncome = $("#txtSpouseannualincome").val();

            if ($("#rdbSpouseIncmSrcN").prop("checked") == true) {
                spouseIncSrcInd = "N";
                spouseIncSrcTxt = $("#txtSpouseotherIncmSrc").val();
            }

            if ($("#rdbSpouseIncmSrcY").prop("checked") == true) {
                spouseIncSrcInd = "Y";
                spouseIncSrcTxt = $("#txtSpouseotherIncmSrc").val();
            }
        }
        if (spouseEmpType == "2" || spouseEmpType == "6" || spouseEmpType == "3") {
            spouseAnnIncome = $("#txtSpouseannualincome").val();

            if ($("#rdbSpouseIncmSrcN").prop("checked") == true) {
                spouseIncSrcInd = "N";
                spouseIncSrcTxt = $("#txtSpouseotherIncmSrc").val();
            }
        }
    }


    //------------Nominee details--------------------------
    //Nominee Details
    var noOfNominees = $("#ddlPropNoOfNominees").val();

    var nomDOB1 = $("#txtNomineeDOB1").val();
    var nomDOB2 = $("#txtNomineeDOB2").val();
    var nomDOB3 = $("#txtNomineeDOB3").val();

    if ($("#txtNomineeDOB1").val() != "") {
        var splitnomDOB1 = nomDOB1.split("/");
        nomDOB1 = splitnomDOB1[1] + '/' + splitnomDOB1[0] + '/' + splitnomDOB1[2];
    }
    if ($("#txtNomineeDOB2").val() != "") {
        var splitnomDOB2 = nomDOB2.split("/");
        nomDOB2 = splitnomDOB2[1] + '/' + splitnomDOB2[0] + '/' + splitnomDOB2[2];
    }
    if ($("#txtNomineeDOB3").val() != "") {
        var splitnomDOB3 = nomDOB3.split("/");
        nomDOB3 = splitnomDOB3[1] + '/' + splitnomDOB3[0] + '/' + splitnomDOB3[2];
    }
    var nomRelationCd1 = $("#ddlNomRelation1").val();
    var nomRelationCd2 = $("#ddlNomRelation2").val();
    var nomRelationCd3 = $("#ddlNomRelation3").val();

    var nomRelation1 = $("#ddlNomRelation1 option:selected").text();
    var nomRelation2 = $("#ddlNomRelation2 option:selected").text();
    var nomRelation3 = $("#ddlNomRelation3 option:selected").text();

    var nomGender1 = "";
    var nomGender2 = "";
    var nomGender3 = "";


    if (nomRelationCd1 == "1" || (nomRelationCd1 == "3" && laTitle == "2") || nomRelationCd1 == "4" || nomRelationCd1 == "6" || nomRelationCd1 == "6" || nomRelationCd1 == "8" || nomRelationCd1 == "10") {
        nomGender1 = "M";
    }
    else if (nomRelationCd1 == "2" || (nomRelationCd1 == "3" && laTitle == "1") || nomRelationCd1 == "5" || nomRelationCd1 == "7" || nomRelationCd1 == "9" || nomRelationCd1 == "11") {
        nomGender1 = "F";
    }


    if (nomRelationCd2 == "1" || (nomRelationCd2 == "3" && laTitle == "2") || nomRelationCd2 == "4" || nomRelationCd2 == "6" || nomRelationCd2 == "6" || nomRelationCd2 == "8" || nomRelationCd2 == "10") {
        nomGender2 = "M";
    }
    else if (nomRelationCd2 == "2" || (nomRelationCd2 == "3" && laTitle == "1") || nomRelationCd2 == "5" || nomRelationCd2 == "7" || nomRelationCd2 == "9" || nomRelationCd2 == "11") {
        nomGender2 = "F";
    }


    if (nomRelationCd3 == "1" || (nomRelationCd3 == "3" && laTitle == "2") || nomRelationCd3 == "4" || nomRelationCd3 == "6" || nomRelationCd3 == "6" || nomRelationCd3 == "8" || nomRelationCd3 == "10") {
        nomGender3 = "M";
    }
    else if (nomRelationCd3 == "2" || (nomRelationCd3 == "3" && laTitle == "1") || nomRelationCd3 == "5" || nomRelationCd3 == "7" || nomRelationCd3 == "9" || nomRelationCd3 == "11") {
        nomGender3 = "F";
    }


    var nomAllocation1 = $("#txtNomineeAllocation1").val();
    var nomAllocation2 = $("#txtNomineeAllocation3").val();
    var nomAllocation3 = $("#txtNomineeAllocation3").val();

    var appointeeName1 = "";
    var appointeeName2 = "";
    var appointeeName3 = "";

    appointeeName1 = $("#txtAppointeeName1").val();
    appointeeName2 = $("#txtAppointeeName2").val();
    appointeeName3 = $("#txtAppointeeName3").val();

    var appointeeDOB1 = "";
    var appointeeDOB2 = "";
    var appointeeDOB3 = "";

    if ($("#txtAppointeeDOB1").val() != "" || $("#txtAppointeeDOB1").val() == null) {
        var appointeeDOB1 = $("#txtAppointeeDOB1").val();
        var splitAppointeeDOB1 = appointeeDOB1.split("/");
        appointeeDOB1 = splitAppointeeDOB1[1] + '/' + splitAppointeeDOB1[0] + '/' + splitAppointeeDOB1[2];
    }

    if ($("#txtAppointeeDOB2").val() != "" || $("#txtAppointeeDOB2").val() == null) {
        var appointeeDOB2 = $("#txtAppointeeDOB2").val();
        var splitAppointeeDOB2 = appointeeDOB2.split("/");
        appointeeDOB2 = splitAppointeeDOB2[1] + '/' + splitAppointeeDOB2[0] + '/' + splitAppointeeDOB2[2];
    }

    if ($("#txtAppointeeDOB3").val() != "" || $("#txtAppointeeDOB3").val() == null) {
        var appointeeDOB3 = $("#txtAppointeeDOB3").val();
        var splitAppointeeDOB3 = appointeeDOB3.split("/");
        appointeeDOB3 = splitAppointeeDOB3[1] + '/' + splitAppointeeDOB3[0] + '/' + splitAppointeeDOB3[2];
    }

    var appointeeGender1 = $("#txtAppointeeGender1").val();
    var appointeeGender2 = $("#txtAppointeeGender2").val();
    var appointeeGender3 = $("#txtAppointeeGender3").val();

    var appointeeRel1 = $("#txtAppointeeNomRelation1 option:selected").text();
    var appointeeRel2 = $("#txtAppointeeNomRelation2 option:selected").text();
    var appointeeRel3 = $("#txtAppointeeNomRelation3 option:selected").text();

    var appointeeCd1 = $("#txtAppointeeNomRelation1").val();
    var appointeeCd2 = $("#txtAppointeeNomRelation2").val();
    var appointeeCd3 = $("#txtAppointeeNomRelation3").val();
    var jsonNominee = null;
    var agenominee1 = $("#agenominee1").val();
    var agenominee2 = $("#agenominee2").val();
    var agenominee3 = $("#agenominee3").val();

    if (noOfNominees == "1") {
        jsonNominee = [{
            'nomineeNumber': '1',
            'name': $("#txtNomineeName1").val(),
            'dob': nomDOB1,
            'gender': nomGender1,
            'relation': nomRelation1,
            'relCd': nomRelationCd1,
            'allocation': nomAllocation1,
            'appointee': {
                'name': appointeeName1,
                'dob': appointeeDOB1,
                'relation': appointeeRel1,
                'relCd': appointeeCd1,
                'gender': appointeeGender1
            }
        }]
    }
    if (noOfNominees == "2") {
        jsonNominee = [{
            'nomineeNumber': '1',
            'name': $("#txtNomineeName1").val(),
            'dob': nomDOB1,
            'gender': nomGender1,
            'relation': nomRelation1,
            'relCd': nomRelationCd1,
            'allocation': nomAllocation1,
            'appointee': {
                'name': appointeeName1,
                'dob': appointeeDOB1,
                'relation': appointeeRel1,
                'relCd': appointeeCd1,
                'gender': appointeeGender1
            }
        },
        {
            'nomineeNumber': '2',
            'name': $("#txtNomineeName2").val(),
            'dob': nomDOB2,
            'gender': nomGender2,
            'relation': nomRelation2,
            'relCd': nomRelationCd2,
            'allocation': nomAllocation2,
            'appointee': {
                'name': appointeeName2,
                'dob': appointeeDOB2,
                'relation': appointeeRel2,
                'relCd': appointeeCd2,
                'gender': appointeeGender2
            }
        }]
    }
    if (noOfNominees == "3") {
        jsonNominee = [{
            'nomineeNumber': '1',
            'name': $("#txtNomineeName1").val(),
            'dob': nomDOB1,
            'gender': nomGender1,
            'relation': nomRelation1,
            'relCd': nomRelationCd1,
            'allocation': nomAllocation1,
            'appointee': {
                'name': appointeeName1,
                'dob': appointeeDOB1,
                'relation': appointeeRel1,
                'relCd': appointeeCd1,
                'gender': appointeeGender1
            }
        },
        {
            'nomineeNumber': '2',
            'name': $("#txtNomineeName2").val(),
            'dob': nomDOB2,
            'gender': nomGender2,
            'relation': nomRelation2,
            'relCd': nomRelationCd2,
            'allocation': nomAllocation2,
            'appointee': {
                'name': appointeeName2,
                'dob': appointeeDOB2,
                'relation': appointeeRel2,
                'relCd': appointeeCd2,
                'gender': appointeeGender2
            }
        },
        {
            'nomineeNumber': '3',
            'name': $("#txtNomineeName3").val(),
            'dob': nomDOB3,
            'gender': nomGender3,
            'relation': nomRelation3,
            'relCd': nomRelationCd3,
            'allocation': nomAllocation3,
            'appointee': {
                'name': appointeeName3,
                'dob': appointeeDOB3,
                'relation': appointeeRel3,
                'relCd': appointeeCd3,
                'gender': appointeeGender3
            }
        },
        ]
    }


    //Other details 
    var isPep = "";
    var txtPEP = "";
    var isCriminal = "";
    var txtCriminal = "";
    var idenetiryProof = "";
    var addressProof = "";
    var incomeProof = "";

    if ($('input:radio[name=rdbPropPep]:checked').val() == "yes") {

        isPep = "Y";
        txtPEP = $("#txtpolyexposed_q1").val();
    }
    else {
        isPep = "N";
        txtPEP = "";
    }

    if ($('input:radio[name=rdbPropCriminal]:checked').val() == "yes") {

        isCriminal = "Y";
        txtCriminal = $("#txtcrimalproc_q2").val();
    }
    else {
        isCriminal = "N";
        txtCriminal = "";
    }
    idenetiryProof = $("#ddlPropIdentityProof").val();
    addressProof = $("#ddlPropResidenceProof").val();
    incomeProof = $("#ddlPropIncomeProof").val();


    //Height and weight details
    //Your height
    var laHeightFt = "";
    var laHeightInch = "";
    var laWeight = "";
    var laWeightVariationInd = "";
    var laWeightVariation = "";
    var laWeightVariationReason = "";

    laHeightFt = $("#ddlLAHeight").val();
    laHeightInch = $("#ddlLAInches").val();
    laWeight = $("#txtweight").val();

    if ($('input:radio[name=rdbLAWeightVariation]:checked').val() == "yes") {

        laWeightVariationInd = "Y";
        laWeightVariation = $("#ddlLAWeightVariation").val();
        laWeightVariationReason = $("#ddlLAWeightVariationReason").val();
    }
    else {
        laWeightVariationInd = "";
        laWeightVariation = "";
        laWeightVariationReason = "";
    }

    if (isLaPropSame == "N") {
        var spouseHeightFt = "";
        var spouseHeightInch = "";
        var spouseWeight = "";
        var spouseWeightVariationInd = "";
        var spouseWeightVariation = "";
        var spouseWeightVariationReason = "";

        spouseHeightFt = $("#ddlSpouseHeight").val();
        spouseHeightInch = $("#ddlSpouseInches").val();
        spouseWeight = $("#txtSpouseWeight").val();

        if ($('input:radio[name=rdbSpouseWeightVariation]:checked').val() == "yes") {

            spouseWeightVariationInd = "Y";
            spouseWeightVariation = $("#ddlLAWeightVariation").val();
            spouseWeightVariationReason = $("#ddlLAWeightVariationReason").val();
        }
        else {
            spouseWeightVariationInd = "";
            spouseWeightVariation = "";
            spouseWeightVariationReason = "";
        }
    }

    //------Ques-1----------------------------------------
    var laTravelOutInd = "";
    var laPilotInd = "";

    var laSkyDiveInd = "";
    var laParaglidingInd = "";
    var laMountaineeringInd = "";
    var laRacingInd = "";
    var laOtherActiviesInd = "";

    var laDrugInd = "";
    var laDrugTxt = "";
    var laAlchohol = "";
    var laAlchoholTxt = "";
    var laIsSmoker = "";
    var laIsSmokerTxt = "";
    var laStopTobaccoInd = "";
    var laStopTobaccoDetails = "";
    var laStopTobDuration = "";
    var laStopTobReason = "";
    var laIsAdventurousActivities = "";
    var laTotalCheckBoxChecked = "";



    if ($('input:radio[name=rdbLATravelOutsideIndia]:checked').val() == "yes") {

        laTravelOutInd = "Y";
    }
    else {
        laTravelOutInd = "N";
    }

    if ($('input:radio[name=rdbLAPilot]:checked').val() == "yes") {

        laPilotInd = "Y";
    }
    else {
        laPilotInd = "N";
    }
    debugger
    if ($("#chkLAActivities").prop("checked") == true || $("#chkLAActivities").prop("checked") == undefined) {

        IsAdventurousActivities = "N";
    }
    else {
        IsAdventurousActivities = 'Y';

        if ($("#chkLASkyDive").prop("checked") == true) {
            laSkyDiveInd = "Y";
            var skydive = "1";
            laTotalCheckBoxChecked = skydive + "~";
        }
        else {
            laSkyDiveInd = "N";
        }

        if ($("#chkLAParagliding").prop("checked") == true) {
            laParaglidingInd = "Y";
            var paragliding = "2";
            laTotalCheckBoxChecked = laTotalCheckBoxChecked + paragliding + "~";
        }
        else {
            laParaglidingInd = "N";
        }
        if ($("#chkLAMountaineering").prop("checked") == true) {
            laMountaineeringInd = "Y";
            var mountaineering = "3";
            laTotalCheckBoxChecked = laTotalCheckBoxChecked + mountaineering + "~";
        }
        else {
            laMountaineeringInd = "N";
        }
        if ($("#chkLARacing").prop("checked") == true) {
            laRacingInd = "Y";
            var racing = "5";
            laTotalCheckBoxChecked = laTotalCheckBoxChecked + racing + "~";
        }
        else {
            laRacingInd = "N";
        }
        if ($("#chkLAOtherActivies").prop("checked") == true) {
            laOtherActiviesInd = "Y";
            var flying = "9";
            var txtotheracti = $("#txtLAOtherActivities").val();
            laTotalCheckBoxChecked = laTotalCheckBoxChecked + flying + "~";
            laTotalCheckBoxChecked = laTotalCheckBoxChecked + "10~" + txtotheracti + "~";
        }
        else {
            laOtherActiviesInd = "N";
        }
    }


    if ($('input:radio[name=rdbLADrugs]:checked').val() == "yes") {


        laDrugInd = "Y";
        laDrugTxt = $("#txtLADrugDetail").val();
    }
    else {
        laDrugInd = "N";
        laDrugTxt = "";
    }
    if ($('input:radio[name=rdbLAAlcohol]:checked').val() == "yes") {

        laAlchohol = "Y";
        if ($("#txtLABeer").val() != "" && $("#txtLAHardLiquor").val() != "" && $("#txtLAWine").val() != "") {
            laAlchoholTxt = $("#txtLABeer").val() + "~" + $("#txtLAHardLiquor").val() + "~" + $("#txtLAWine").val();
        }
        else {
            laDrugInd = "N";
            laAlchoholTxt = "";
        }

    }
    else {
        laDrugInd = "N";
        laAlchoholTxt = "";
    }

    if ($('input:radio[name=rdbLASmoker]:checked').val() == "yes") {

        laIsSmoker = "Y";
        if ($("#txtLACigar").val() != "" && $("#txtLABidi").val() != "" && $("#txtLAgutka").val() != "" && $("#txtLAPaan").val()) {
            laIsSmokerTxt = $("#txtLACigar").val() + "~" + $("#txtLABidi").val() + "~" + $("#txtLAgutka").val() + "~" + $("#txtLAPaan").val();
        }
        else {
            laIsSmoker = "N";
            laIsSmokerTxt = "";
        }

    }
    else {
        laIsSmoker = "N";
        laIsSmokerTxt = "";
    }

    if ($('input:radio[name=rdbLAStopTabacco]:checked').val() == "yes") {

        laStopTobaccoInd = "Y";
        laStopTobDuration = $("#txtLAStopTobaccoDuration").val();
        laStopTobReason = $("#txtLAStopTobaccoReason").val();
        if (laStopTobDuration != "" && laStopTobReason != "") {
            //  laStopTobaccoDetails = laStopTobDuration + "~" + laStopTobReason;
            laStopTobaccoDetails = laStopTobReason;
        }
        else {
            laStopTobaccoInd = "N";
            laStopTobDuration = "";
            laStopTobReason = "";
            laStopTobaccoDetails = "";
        }

    }
    else {
        laStopTobaccoInd = "N";
        laStopTobDuration = "";
        laStopTobReason = "";
        laStopTobaccoDetails = "";
    }


    //--Spouse Ques-1
    if (isLaPropSame == "N") {
        var spouseTravelOutInd = "";
        var spousePilotInd = "";
        var spouseSkyDiveInd = "";
        var spouseParaglidingInd = "";
        var spouseMountaineeringInd = "";
        var spouseRacingInd = "";
        var spouseOtherActiviesInd = "";
        var spouseDrugInd = "";
        var spouseDrugTxt = "";
        var spouseAlchohol = "";
        var spouseAlchoholTxt = "";
        var spouseIsSmoker = "";
        var spouseIsSmokerTxt = "";
        var spouseStopTobaccoInd = "";
        var spouseStopTobDuration = "";
        var spouseStopTobReason = "";
        var spouseIsAdventurousActivities = "N";
        var spouseTotalCheckBoxChecked = "";


        if ($('input:radio[name=rdbSpouseTravelOutsideIndia]:checked').val() == "yes") {

            spouseTravelOutInd = "Y";
        }
        else {
            spouseTravelOutInd = "N";
        }
        if ($('input:radio[name=rdbSpousePilot]:checked').val() == "yes") {

            spousePilotInd = "Y";
        }
        else {
            spousePilotInd = "N";
        }

        if ($("#chkSpouseActivities").prop("checked") == true) {

            spouseIsAdventurousActivities = "N";
        }
        else {
            spouseIsAdventurousActivities = "Y";

            if ($("#chkSpouseSkyDive").prop("checked") == true) {
                var spouseSkydive = "1";
                spouseSkyDiveInd = "Y";
                spouseTotalCheckBoxChecked = spouseTotalCheckBoxChecked + spouseSkydive + "~";
            }
            else {
                spouseSkyDiveInd = "N";
            }
            if ($("#chkSpouseParagliding").prop("checked") == true) {
                var spouseParagliding = "2";
                spouseParaglidingInd = "Y";
                spouseTotalCheckBoxChecked = spouseTotalCheckBoxChecked + spouseParagliding + "~";
            }
            else {
                spouseParaglidingInd = "N";
            }
            if ($("#chkSpouseMountaineering").prop("checked") == true) {
                var spouseMountaineering = "3";
                spouseMountaineeringInd = "Y";
                spouseTotalCheckBoxChecked = spouseTotalCheckBoxChecked + spouseMountaineering + "~";
            }
            else {
                spouseMountaineeringInd = "N";
            }
            if ($("#chkSpouseRacing").prop("checked") == true) {
                var spouseRacing = "5";
                spouseRacingInd = "Y";
                spouseTotalCheckBoxChecked = spouseTotalCheckBoxChecked + spouseRacing + "~";
            }
            else {
                spouseRacingInd = "N";
            }
            if ($("#chkSpouseOtherActivies").prop("checked") == true) {
                var spouseFlying = "9";
                spouseOtherActiviesInd = "Y";
                spouseTotalCheckBoxChecked = spouseTotalCheckBoxChecked + spouseFlying + "~";
                spouseTotalCheckBoxChecked = spouseTotalCheckBoxChecked + "10~" + '' + "~";
            }
            else {
                spouseOtherActiviesInd = "N";
            }
        }

        if ($('input:radio[name=rdbSpouseDrugs]:checked').val() == "yes") {

            spouseDrugInd = "Y";
        }
        else {
            spouseDrugInd = "N";
        }
        if ($('input:radio[name=rdbSpouseAlcohol]:checked').val() == "yes") {

            spouseAlchohol = "Y";
        }
        else {
            spouseAlchohol = "N";
        }
        if ($('input:radio[name=rdbSpouseSmoker]:checked').val() == "yes") {

            spouseIsSmoker = "Y";
        }
        else {
            spouseIsSmoker = "N";
        }
        if ($('input:radio[name=rdbSpouseStopTabacco]:checked').val() == "yes") {

            spouseStopTobacco = "Y";
        }
        else {
            spouseStopTobacco = "N";
        }
    }



    //---Ques-2
    var laConsultDocInd = "";
    var laConsultDocTxt = "";
    var laTestInd = "";
    var laTestTxt = "";
    var laAdmittedInd = "";
    var laAdmittedTxt = "";
    var laMedication = "";
    var laMedicationTxt = "";
    var laHeartDiseaseInd = "";
    var laHeartDiseaseTxt = "";
    var laBpInd = "";
    var laBpTxt = "";
    var laLungDiseaseInd = "";
    var laLungDiseaseTxt = "";
    var laDiabetesInd = "";
    var laDiabetesTxt = "";
    var laDiseaseInd = "";
    var laDiseaseTxt = "";
    var laDigestInd = "";
    var laDigestTxt = "";
    var laCancerInd = "";
    var laCancerTxt = "";
    var laTropicalInd = "";
    var laTropicalTxt = "";
    var laThyroidInd = "";
    var laThyroidTxt = "";
    var laBloodInd = "";
    var laBloodTxt = "";
    var laNeuroInd = "";
    var laNeuroTxt = "";
    var laMuscleDiseaseInd = "";
    var laMuscleDiseaseTxt = "";
    var laHivInd = "";
    var laHivTxt = "";
    var laExcessAlchInd = "";
    var laExcessAlchTxt = "";
    var laOtherIllnessInd = "";
    var laOtherIllnessTxt = "";
    var laDeformityInd = "";
    var laDeformityTxt = "";
    var laSymptomInd = "";
    var laSymptomTxt = "";
    var laPregInd = "";
    var laPregTxt = "";
    var laPregAbnormInd = "";
    var laPregAbnormTxt = "";
    var laHospitalizedInd = "";
    var laHospitalizedDate = "";
    var laFullyRecoveredInd = "";
    var laFullyRecoveredTxt = "";


    //   if ($("input[name='rdbLADoctor']").val() == "yes") {
    if ($('input:radio[name=rdbLADoctor]:checked').val() == "yes") {
        laConsultDocInd = "Y";
        laConsultDocTxt = $("#txtLADoctorDetails").val();
    }
    else {
        laConsultDocInd = "N";
        laConsultDocTxt = "";
    }

    if ($('input:radio[name=rdbLATests]:checked').val() == "yes") {

        laTestInd = "Y";
        laTestTxt = $("#txtLADoctorDetails").val();
    }
    else {
        laTestInd = "N";
        laTestTxt = "";
    }

    if ($('input:radio[name=rdbLAAdmitted]:checked').val() == "yes") {

        laAdmittedInd = "Y";
        laAdmittedTxt = $("#txtLAAdmittedDetails").val();
    }
    else {
        laAdmittedInd = "N";
        laAdmittedTxt = "";
    }

    if ($('input:radio[name=rdbLAMedication]:checked').val() == "yes") {

        laMedication = "Y";
        laMedicationTxt = $("#txtLAMedicationDetails").val();
    }
    else {
        laMedication = "N";
        laMedicationTxt = "";
    }
    if ($('input:radio[name=rdbLAHeart]:checked').val() == "yes") {

        $('input:radio[name=rdbLAMedication]:checked').val()
        laHeartDiseaseInd = "Y";
        laHeartDiseaseTxt = $("#txtLAHeartDetails").val();
    }
    else {
        laHeartDiseaseInd = "N";
        laHeartDiseaseTxt = "";
    }
    if ($('input:radio[name=rdbLABp]:checked').val() == "yes") {

        laBpInd = "Y";
        laBpTxt = $("#txtLABPDetails").val();
    }
    else {
        laBpInd = "N";
        laBpTxt = "";
    }
    if ($('input:radio[name=rdbLALung]:checked').val() == "yes") {

        laLungDiseaseInd = "Y";
        laLungDiseaseTxt = $("#txtLABPDetails").val();
    }
    else {
        laLungDiseaseInd = "N";
        laLungDiseaseTxt = "";
    }

    if ($('input:radio[name=rdbLADiabetes]:checked').val() == "yes") {

        laDiabetesInd = "Y";
        laDiabetesTxt = $("#txtLADiabetesDetails").val();
    }
    else {
        laDiabetesInd = "N";
        laDiabetesTxt = "";
    }

    if ($('input:radio[name=rdbLADisease]:checked').val() == "yes") {

        laDiseaseInd = "Y";
        laDiseaseTxt = $("#txtLADiseaseDetails").val();
    }
    else {
        laDiseaseInd = "N";
        laDiseaseTxt = "";
    }
    if ($('input:radio[name=rdbLADigestive]:checked').val() == "yes") {

        laDigestInd = "Y";
        laDigestTxt = $("#txtLADigestiveDetails").val();
    }
    else {
        laDigestInd = "N";
        laDigestTxt = "";
    }

    if ($('input:radio[name=rdbLACancer]:checked').val() == "yes") {

        laCancerInd = "Y";
        laCancerTxt = $("#txtLACancerDetails").val();
    }
    else {
        laCancerInd = "N";
        laCancerTxt = "";
    }

    if ($('input:radio[name=rdbLATropical]:checked').val() == "yes") {

        laTropicalInd = "Y";
        laTropicalTxt = $("#txtLATropicalDetails").val();
    }
    else {
        laTropicalInd = "N";
        laTropicalTxt = "";
    }
    if ($('input:radio[name=rdbLAThyroid]:checked').val() == "yes") {

        laThyroidInd = "Y";
        laThyroidTxt = $("#txtLAThyroidDetails").val();
    }
    else {
        laThyroidInd = "N";
        laThyroidTxt = "";
    }

    if ($('input:radio[name=rdbLABlood]:checked').val() == "yes") {

        laBloodInd = "Y";
        laBloodTxt = $("#txtLABloodDetails").val();
    }
    else {
        laBloodInd = "N";
        laBloodTxt = "";
    }

    if ($('input:radio[name=rdbLANeuro]:checked').val() == "yes") {

        laNeuroInd = "Y";
        laNeuroTxt = $("#txtLANeuroDetails").val();
    }
    else {
        laNeuroInd = "N";
        laNeuroTxt = "";
    }

    if ($('input:radio[name=rdbLADisorder]:checked').val() == "yes") {

        laMuscleDiseaseInd = "Y";
        laMuscleDiseaseTxt = $("#txtLADisorderDetails").val();
    }
    else {
        laMuscleDiseaseInd = "N";
        laMuscleDiseaseTxt = "";
    }

    if ($('input:radio[name=rdbLAAids]:checked').val() == "yes") {

        laHivInd = "Y";
        laHivTxt = $("#txtLAAidsDetails").val();
    }
    else {
        laHivInd = "N";
        laHivTxt = "";
    }

    if ($('input:radio[name=rdbLAAlcoholic]:checked').val() == "yes") {

        laExcessAlchInd = "Y";
        laExcessAlchTxt = $("#txtLAAlcoholicDetails").val();
    }
    else {
        laExcessAlchInd = "N";
        laExcessAlchTxt = "";
    }

    if ($('input:radio[name=rdbLAOtherill]:checked').val() == "yes") {

        laOtherIllnessInd = "Y";
        laOtherIllnessTxt = $("#txtLAOtherillDetails").val();
    }
    else {
        laOtherIllnessInd = "N";
        laOtherIllnessTxt = "";
    }
    if ($('input:radio[name=rdbLADeformity]:checked').val() == "yes") {

        laDeformityInd = "Y";
        laDeformityTxt = $("#txtLADeformityDetails").val();
    }
    else {
        laDeformityInd = "N";
        laDeformityTxt = "";
    }
    if ($('input:radio[name=rdbLASymptoms]:checked').val() == "yes") {

        laSymptomInd = "Y";
        laSymptomTxt = $("#txtLASymptomsDetails").val();
    }
    else {
        laSymptomInd = "N";
        laSymptomTxt = "";
    }

    if ($('input:radio[name=rdbLAPregnant]:checked').val() == "yes") {
        debugger
        laPregInd = "Y";
    }
    else {
        laPregInd = "N";
    }
    if ($('input:radio[name=rdbLAPregAbnorm]:checked').val() == "yes") {

        laPregAbnormInd = "Y";
    }
    else {
        laPregAbnormInd = "N";
    }

    if ($('input:radio[name=rdbLAMediRecover]:checked').val() == "yes") {

        laFullyRecoveredInd = "Y";
        laFullyRecoveredTxt = $("#txtLAMediRecoverDetail").val();
    }
    else {
        laFullyRecoveredInd = "N";
        laFullyRecoveredTxt = "";
    }




    //Spouse Ques-2
    if (isLaPropSame == "N") {
        var spouseConsultDocInd = "";
        var spouseTestInd = "";
        var spouseAdmittedInd = "";
        var spouseMedication = "";
        var spouseHeartDiseaseInd = "";
        var spouseBpInd = "";
        var spouseLungDiseaseInd = "";
        var spouseDiabetesInd = "";
        var spouseDiseaseInd = "";
        var spouseDigestInd = "";
        var spouseCancerInd = "";
        var spouseTropicalInd = "";
        var spouseThyroidInd = "";
        var spouseBloodInd = "";
        var spouseNeuroInd = "";
        var spouseMuscleDiseaseInd = "";
        var spouseHivInd = "";
        var spouseExcessAlchInd = "";
        var spouseOtherIllnessInd = "";
        var spouseDeformityInd = "";
        var spouseSymptomInd = "";
        var spousePregInd = "";
        var spousePregAbnormInd = "";
        var spouseHospitalizedInd = "";
        var spouseFullyRecoveredInd = "";


        if ($('input:radio[name=rdbSpouseDoctor]:checked').val() == "yes") {

            spouseConsultDocInd = "Y";
        }
        else {
            spouseConsultDocInd = "N";
        }

        if ($('input:radio[name=rdbSpouseTests]:checked').val() == "yes") {

            spouseTestInd = "Y";
        }
        else {
            spouseTestInd = "N";
        }
        if ($('input:radio[name=rdbSpouseAdmitted]:checked').val() == "yes") {

            spouseAdmittedInd = "Y";
        }
        else {
            spouseAdmittedInd = "N";
        }
        if ($('input:radio[name=rdbSpouseMedication]:checked').val() == "yes") {

            spouseMedication = "Y";
        }
        else {
            spouseMedication = "N";
        }
        if ($('input:radio[name=rdbSpouseHeart]:checked').val() == "yes") {

            spouseHeartDiseaseInd = "Y";
        }
        else {
            spouseHeartDiseaseInd = "N";
        }
        if ($('input:radio[name=rdbSpouseBp]:checked').val() == "yes") {

            spouseBpInd = "Y";
        }
        else {
            spouseBpInd = "N";
        }

        if ($('input:radio[name=rdbSpouseDiabetes]:checked').val() == "yes") {

            spouseDiabetesInd = "Y";
        }
        else {
            spouseDiabetesInd = "N";
        }
        if ($('input:radio[name=rdbSpouseDisease]:checked').val() == "yes") {

            spouseDiseaseInd = "Y";
        }
        else {
            spouseDiseaseInd = "N";
        }
        if ($('input:radio[name=rdbSpouseDigestive]:checked').val() == "yes") {

            spouseDigestInd = "Y";
        }
        else {
            spouseDigestInd = "N";
        }
        if ($('input:radio[name=rdbSpouseCancer]:checked').val() == "yes") {

            spouseCancerInd = "Y";
        }
        else {
            spouseCancerInd = "N";
        }
        if ($('input:radio[name=rdbSpouseTropical]:checked').val() == "yes") {

            spouseTropicalInd = "Y";
        }
        else {
            spouseTropicalInd = "N";
        }


        if ($('input:radio[name=rdbSpouseThyroid]:checked').val() == "yes") {

            spouseThyroidInd = "Y";
        }
        else {
            spouseThyroidInd = "N";
        }


        if ($('input:radio[name=rdbSpouseBlood]:checked').val() == "yes") {

            rdbSpouseBlood = "Y";
        }
        else {
            rdbSpouseBlood = "N";
        }

        if ($('input:radio[name=rdbSpouseNeuro]:checked').val() == "yes") {

            spouseNeuroInd = "Y";
        }
        else {
            spouseNeuroInd = "N";
        }

        if ($('input:radio[name=rdbSpouseDisorder]:checked').val() == "yes") {

            spouseMuscleDiseaseInd = "Y";
        }
        else {
            spouseMuscleDiseaseInd = "N";
        }
        if ($('input:radio[name=rdbSpouseAids]:checked').val() == "yes") {

            spouseHivInd = "Y";
        }
        else {
            spouseHivInd = "N";
        }
        if ($('input:radio[name=rdbSpouseAlcoholic]:checked').val() == "yes") {

            spouseExcessAlchInd = "Y";
        }
        else {
            spouseExcessAlchInd = "N";
        }


        if ($('input:radio[name=rdbSpouseOtherill]:checked').val() == "yes") {

            spouseOtherIllnessInd = "Y";
        }
        else {
            spouseOtherIllnessInd = "N";
        }

        if ($('input:radio[name=rdbSpouseDeformity]:checked').val() == "yes") {

            spouseDeformityInd = "Y";
        }
        else {
            spouseDeformityInd = "N";
        }

        if ($('input:radio[name=rdbSpouseSymptoms]:checked').val() == "yes") {

            spouseSymptomInd = "Y";
        }
        else {
            spouseSymptomInd = "N";
        }

        if ($('input:radio[name=rdbSpousePregnant]:checked').val() == "yes") {

            spousePregInd = "Y";
        }
        else {
            spousePregInd = "N";
        }
        if ($('input:radio[name=rdbSpousePregAbnorm]:checked').val() == "yes") {

            spousePregAbnormInd = "Y";
        }
        else {
            spousePregAbnormInd = "N";
        }
    }


    //-----Ques-3-----------
    //Your Insurance details
    var laInsDeclinedInd = "";
    var laInsDecliNameInsurer = "";
    var laInsDecliReason = "";
    var laInsDecliDate = "";

    var laIsCIbenefit = "";
    var laIsCIInsName = "";
    var laIsCIReason = "";
    var laIsCIDate = "";

    var laInsApplyInd = "";
    var laDiscloseInfoInd = "";

    if ($('input:radio[name=rdbLALifeInsurer]:checked').val() == "yes") {

        laInsDeclinedInd = "Y";
        laInsDecliNameInsurer = $("#ddlLANameofcomp").val();
        laInsDecliReason = $("#txtLAReason").val();
        laInsDecliDate = $("#txtLAInsDeclWhen").val();
    }
    else {
        laInsDeclinedInd = "N";
        laInsDecliNameInsurer = "";
        laInsDecliReason = "";
        laInsDecliDate = "";
    }

    if ($('input:radio[name=rdbLALifeInsurerBenefits]:checked').val() == "yes") {

        laIsCIbenefit = "Y";
        laIsCIInsName = $("#ddlLANameOfIns").val();
        laIsCIReason = $("#txtLAInsReason").val();
        laIsCIDate = $("#txtLAInsDate").val();
    }
    else {
        laIsCIbenefit = "N";
        laIsCIInsName = "";
        laIsCIReason = "";
        laIsCIDate = "";
    }
    if ($('input:radio[name=rdbLAExistInsurance]:checked').val() == "yes") {

        laInsApplyInd = "Y";

        if ($('input:radio[name=rdbLADiscloseInsur1]:checked').val() == "yes") {

            laDiscloseInfoInd = "Y";
        }
        else {
            laDiscloseInfoInd = "N";
        }
    }
    else {
        laInsApplyInd = "N";
    }

    //Spouse insurance details
    if (isLaPropSame == "N") {
        var spouseInsDeclinedInd = "";
        var spouseIsCIbenefit = "";
        var spouseInsApplyInd = "";
        var spouseDiscloseInfoInd = "";

        if ($('input:radio[name=rdbSpouseLifeInsurer]:checked').val() == "yes") {

            spouseInsDeclinedInd = "Y";
        }
        else {
            spouseInsDeclinedInd = "N";
        }

        if ($('input:radio[name=rdbSpouseLifeInsurerBenefits]:checked').val() == "yes") {

            spouseIsCIbenefit = "Y";
        }
        else {
            spouseIsCIbenefit = "N";
        }
        if ($('input:radio[name=rdbSpouseExistInsurance]:checked').val() == "yes") {

            spouseInsApplyInd = "Y";

            if ($('input:radio[name=rdbSpouseDiscloseInsur1]:checked').val() == "yes") {

                spouseDiscloseInfoInd = "Y";
            }
            else {
                spouseDiscloseInfoInd = "N";
            }
        }
        else {
            spouseInsApplyInd = "N";
        }
    }



    //your family and income details
    var tblFamInsRowCount = 0;
    var jsonFamIns = null;
    var MedicalQuestion = null;
    tblFamInsRowCount = parseInt($("#tblFamInsRowCount").val());

    var stringFamIns = "[";

    var table = $("#tblFamInsDetail tbody");

    ;
    table.find('tr').each(function (i, el) {
        var $tds = $(this).find('td'),
            relationId = $tds.eq(0).text(),
            relation = $tds.eq(1).text(),
            occupation = $tds.eq(2).text(),
            totalSumAssured = $tds.eq(3).text(),
            Income = $tds.eq(4).text()

        stringFamIns = stringFamIns + '{"relation": "' + relationId + '","occupation": "' + occupation + '","totalSA": "' + totalSumAssured + '","Income": "' + Income +
            '"},';
    });

    var strVal = stringFamIns;
    var lastChar = strVal.slice(-1);
    if (lastChar == ',') {
        strVal = strVal.slice(0, -1);
    }

    stringFamIns = strVal + ']';
    //jsonFamIns = jQuery.parseJSON(stringFamIns);
    jsonFamIns = stringFamIns;
    var stringJsonFamIns = jsonFamIns;

    // console.log(stringJsonFamIns);

    ;
    //--- your existing insurance details
    if (laDiscloseInfoInd == "Y") {
        var tblExstInsRowCount = 0;
        tblExstInsRowCount = parseInt($("#tblExstInsRowCount").val());

        var stringExstIns = "[";

        var table = $("#tblExstInsDetail tbody");


        table.find('tr').each(function (i, el) {
            var $tds = $(this).find('td'),
                policyNo = $tds.eq(0).text(),
                insCompany = $tds.eq(1).text(),
                yearPolicy = $tds.eq(2).text(),
                annualarizedPremium = $tds.eq(3).text(),
                policyStatus = $tds.eq(4).text(),
                sumAssured = $tds.eq(5).text(),
                acceptTerm = $tds.eq(6).text()

            stringExstIns = stringExstIns + '{"policyNo": "' + policyNo + '","companyName": "' + insCompany + '","yearOfIssue": "' + yearPolicy + '","annualizedPremium": "' + annualarizedPremium + '","policyStatus": "' + policyStatus +
                '", "sumAssured": "' + sumAssured + '","acceptanceTerm": "' + acceptTerm + '"},';
        });

        var strVal = stringExstIns;
        var lastChar = strVal.slice(-1);
        if (lastChar == ',') {
            strVal = strVal.slice(0, -1);
        }

        stringExstIns = strVal + ']';
        //  var jsonExstIns = jQuery.parseJSON(stringExstIns);
        var jsonExstIns = stringExstIns;
    }


    //-----Your family details
    var tblYourFamRowCount = 0;
    var stringYourFam = "";

    tblYourFamRowCount = parseInt($("#tblYourFamRowCount").val());

    stringYourFam = "[";

    var table = $("#tblYourFamDetail tbody");


    table.find('tr').each(function (i, el) {
        var $tds = $(this).find('td'),
            RelationId = $tds.eq(0).text(),
            //Relation = $tds.eq(1).text(),
            livingAge = $tds.eq(2).text(),
            healthStatus = $tds.eq(3).text(),
            ageOfDeath = $tds.eq(4).text(),
            causeOfDeath = $tds.eq(5).text()


        stringYourFam = stringYourFam + '{"relation": "' + RelationId + /*'","Relation": "' + Relation +*/ '","age": "' + livingAge + '","healthStatus": "' + healthStatus + '","ageOnDeath": "' + ageOfDeath +
            '", "causeOfDeath": "' + causeOfDeath + '"},';
    });

    var strVal = stringYourFam;
    var lastChar = strVal.slice(-1);
    if (lastChar == ',') {
        strVal = strVal.slice(0, -1);
    }

    stringYourFam = strVal + ']';
    //var jsonYourFam = jQuery.parseJSON(stringYourFam);
    var jsonYourFam = stringYourFam;

    var isFamMemberDisease = "";
    var txtFamMemberDisease = "";
    var hasFamMemEdelPolicy = "";


    if ($('input:radio[name=rdbLADiscloseInsur]:checked').val() == "yes") {

        isFamMemberDisease = "Y";
        txtFamMemberDisease = $("#txtLAtdetailhereditary").val();
    }
    else {
        isFamMemberDisease = "N";
        txtFamMemberDisease = "";
    }

    if ($('input:radio[name=rdbLAfamilyETLIIns]:checked').val() == "yes") {

        hasFamMemEdelPolicy = "Y";
    }
    else {
        hasFamMemEdelPolicy = "N";
    }

    //-----Spouse family details
    if (isLaPropSame == "N") {
        ;
        var tblSpouseFamRowCount = 0;
        tblSpouseFamRowCount = parseInt($("#tblSpouseFamRowCount").val());

        var stringSpouseFam = "[";

        var table = $("#tblSpouseFamDetail tbody");

        table.find('tr').each(function (i, el) {
            var $tds = $(this).find('td'),
                RelationId = $tds.eq(0).text(),
                Relation = $tds.eq(1).text(),
                livingAge = $tds.eq(2).text(),
                healthStatus = $tds.eq(3).text(),
                ageOfDeath = $tds.eq(4).text(),
                causeOfDeath = $tds.eq(5).text()


            stringSpouseFam = stringSpouseFam + '{"relation": "' + RelationId + /*'","Relation": "' + Relation +*/ '","age": "' + livingAge + '","healthStatus": "' + healthStatus + '","ageOnDeath": "' + ageOfDeath +
                '", "causeOfDeath": "' + causeOfDeath + '"},';
        });

        var strVal = stringSpouseFam;
        var lastChar = strVal.slice(-1);
        if (lastChar == ',') {
            strVal = strVal.slice(0, -1);
        }

        stringSpouseFam = strVal + ']';
        var jsonSpouseFam = jQuery.parseJSON(stringSpouseFam);

        var isSpouseFamMemberDisease = "";
        var txtSpouseFamMemberDisease = "";

        if ($('input:radio[name=rdbSpouseDiscloseInsur]:checked').val() == "yes") {

            isSpouseFamMemberDisease = "Y";
            txtSpouseFamMemberDisease = $("#txtSpousetdetailhereditary").val();
        }
        else {
            isSpouseFamMemberDisease = "N";
            txtSpouseFamMemberDisease = "";
        }
    }



    //------------Tax residence details----------------
    var isTaxResident = "";
    if ($('input:radio[name=rdbLAFatca]:checked').val() == "yes") {

        isTaxResident = "Y";
    }
    else {
        isTaxResident = "N";
    }



    //-------------E-Insurance accountInfo-------------
    debugger
    var isEIA = "";
    var applyEIA = "";
    var insRepository = "";
    var RepositoryId = "";
    //  rdBtnisEIA

    if ($('input:radio[name=rdbLAEInsuranceAcc]:checked').val() == "yes") {
        isEIA = "Y";
    }
    else {
        isEIA = "N";
        applyEIA = "Y";
        insRepository = "";

        RepositoryId = $("input[name='rdbLAapplyeiaCreation']:checked").val();

        switch (RepositoryId) {
            case "1":
                insRepository = "NSDL Data Management Limited";
                break;
            case "2":
                insRepository = "Karvy Insurance Repository Limited";
                break;
            case "3":
                insRepository = "CDSL Insurance Repository Limited";
                break;
            case "4":
                insRepository = "CAMS Repository Services Limited";
                break;
            default:
                insRepository = "";
        }
    }


    //-----------Bank Account Info---------------
    var bankAccNo = "";
    var bankName = "";
    var BankLocation = "";
    var BankIfsc = "";

    bankAccNo = $("#txtBankAccNo").val();
    bankName = $("#txtBankName").val();
    BankLocation = $("#txtBankLoc").val();
    BankIfsc = $("#txtBankIFSC").val();


    //---JSON preparation for AJAX call
    var policyNo = $("#hdnPolicyNo").val();
    var transId = $("#hdnTransactionId").val();

    crn = "54545";
    var jsSource = "A4A040";
    var agentCode = "000TWIP";
    var biLink = $("#biLink").val();


    var jsonSpouse = null;
    var spousedata = null;

    if ($("#ddlgender").val() == "Male") {
        spouseGender = "F";
    } else {
        spouseGender = "M";
    }

    if (isLaPropSame == "N") {
        jsonSpouse = {
            "nomineeData": null,
            "title": spouseTitle,
            "firstName": spouseFName,
            "middleName": spouseMName,
            "lastName": spouseLName,
            "dob": spouseDOB,
            "gender": spouseGender,
            "isSmoker": $("#isSmokerSpouseEdelweiss").val(),
            "maritalStatus": spouseMarital,
            "pan": spousePAN,
            "maidName": null,
            "motherMaidName": spouseMotherName,
            "FHName": spouseFatherName,
            "nationality": spouseNationality,
            "otherNationality": null,
            "ageProofId": null,
            "emailId": spouseEmailId,
            "phoneNo": spousePhoneM,
            "officePhoneNo": spousePhoneO,
            "std": null,
            "ResidencePhoneNo": spousePhoneR,
            "alternate_cnt_no": null,
            "socialMediaDetails": {
                "facebook_id": spouseFbId,
                "linkedin_id": spouseLinkedInId,
                "corporate_id": spouseCorporateId
            },
            "currAddr1": spouseCurrAddr1,
            "currAddr2": spouseCurrAddr2,
            "currAddr3": spouseCurrAddr3,
            "currPincode": spouseCPin,
            "currState": spouseCState,
            "currCity": spouseCCity,
            "perAddr1": spousePerAddr1,
            "perAddr2": spousePerAddr2,
            "perAddr3": spousePerAddr3,
            "perPincode": spousePin,
            "perState": spouseState,
            "perCity": spouseCity,
            "isCurrPerAddrSame": isCurrSamePerSpouse,
            "isPerAddrIsCorrAddr": null,
            "education": spouseEducation,
            "otherEducation": null,
            "highestQualification": spouseHighestQuali,
            "collegeNameLoc": spouseColgName,
            "course": null,
            "courseDuration": null,
            "courseYear": null,
            "studentInstruction": null,
            "employementType": spouseEmpType,
            "employementTypeOther": "",
            "employerName": spouseEmpName,
            "employerAddr": spouseAddressOfEmp,
            "designation": spouseEmpDesign,
            "natureOfDuty": spouseNatureOfDuty,
            "experienceInYears": spouseExpYears,
            "experienceInMonths": spouseExpMonths,
            "occupationType": null,
            "employementTypeText": null,
            "noOfEmployees": spouseNoOfEmp,
            "natureOfBusiness": spouseNatureOfDuty,
            "annualIncome": spouseAnnIncome,
            "isIncomeSource": spouseIncSrcInd,
            "incomeSourceDetails": spouseIncSrcTxt,
            "familyHistory": jsonSpouseFam,
            "familyDiease_Ind": isSpouseFamMemberDisease,
            "familyDiease_Details": txtSpouseFamMemberDisease,
            "hasfamilyAppliedETLI": null,
            "otherPolicy_Ind": laInsDeclinedInd,
            "otherPolicy_InsurerName": $("#ddlLANameofcomp").val(),
            "otherPolicy_OtherInsurerName": null,
            "otherPolicy_Reason": $("#txtLAReason").val(),
            "otherPolicy_Date": $("#txtLAInsDeclWhen").val(),
            "CIB_Ind": "N",
            "CIB_InsurerName": null,
            "CIB_Reason": null,
            "CIB_Date": null,
            "isPEP": null,
            "pepReason": null,
            "hasFamPhysician": null,
            "FamPhysicianName": null,
            "FamPhysicianAddr1": null,
            "FamPhysicianAddr2": null,
            "FamPhysicianPhone": null,
            "isCriminal": null,
            "criminalDetails": null,
            "identityProof": null,
            "ageProof": $("#ddlSpouseageproof").val(),
            "otherAgeProof": null,
            "addrProof": null,
            "corrAddrProof": null,
            "incomeProof": null,
            "incomeProofText": null,
            "isCA": null,
            "hasEIAccount": null,
            "EIAccountNo": null,
            "applyEIAccount": null,
            "EIARepository": null,
            "wantEPolicy": null,
            "relationLAProposer": null,
            "relationLAProposerText": null,
            "height": null,
            "heightUnit": null,
            "heightFeets": spouseHeightFt,
            "heightInches": spouseHeightInch,
            "heightCentimeters": null,
            "weight": spouseWeight,
            "clientId": spouseCliId,
            "hasWeightChanged": spouseWeightVariationInd,
            "weightChange": spouseWeightVariation,
            "weightChangeReason": spouseWeightVariationReason,
            "isStaff": null,
            "employeeCode": null,
            "childDOB": null,
            "childGender": null,
            "isTaxResOfIndia": null,
            "isHospitalized": "N",
            "hospitalizedDate": null,
            "isRecovered": null,
            "nonRecoveryDetails": null,
            "medicalScheduleDate": null,
            "medicalScheduleTime": null,
            //"aadhaarNo": spouseAdhaar,
            "husbandInsurance": null,
            "husbandIncome": null,
            "questionnaires": {
                "travelOutsideIndiaInd": spouseTravelOutInd,
                "pilotInd": spousePilotInd,
                "adventurousActivitiesInd": "N",
                "adventurousActivitiesDetails": null,
                "drugsInd": spouseDrugInd,
                "drugsDetails": spouseDrugTxt,
                "alcoholInd": spouseAlchohol,
                "alcoholDetails": spouseAlchoholTxt,
                "tobaccoInd": spouseIsSmoker,
                "tobaccoDetails": spouseIsSmokerTxt,
                "tobaccoStopInd": spouseStopTobaccoInd,
                "tobaccoStopDetails": null,
                "consultDoctorInd": spouseConsultDocInd,
                "consultDoctorDetails": null,
                "ECGInd": spouseTestInd,
                "ECGDetails": null,
                "admitInd": spouseAdmittedInd,
                "admitDetails": null,
                "medicationInd": spouseMedication,
                "diagnosedInd": null,
                "diagnosedDetails": null,
                "medicationDetails": null,
                "heartDieaseInd": spouseHeartDiseaseInd,
                "heartDieaseDetails": null,
                "BPInd": spouseBpInd,
                "BPDetails": null,
                "respiratoryDieaseInd": spouseLungDiseaseInd,
                "respiratoryDieaseDetails": null,
                "diabetesInd": spouseDiseaseInd,
                "diabetesDetails": null,
                "kidneyDieaseInd": spouseDiseaseInd,
                "kidneyDieaseDetails": null,
                "digestiveDieaseInd": spouseDigestInd,
                "digestiveDieaseDetails": null,
                "cancerDieaseInd": spouseCancerInd,
                "cancerDieaseDetails": null,
                "tropicalDieaseInd": spouseTropicalInd,
                "tropicalDieaseDetails": null,
                "thyroidDieaseInd": spouseThyroidInd,
                "thyroidDieaseDetails": null,
                "bloodDieaseInd": spouseBloodInd,
                "bloodDieaseDetails": null,
                "nervousDieaseInd": spouseNeuroInd,
                "nervousDieaseDetails": null,
                "ENTDieaseInd": null,
                "ENTDieaseDetails": null,
                "muscleDieaseInd": spouseMuscleDiseaseInd,
                "muscleDieaseDetails": null,
                "aidsInd": spouseHivInd,
                "aidsDetails": null,
                "alcoholicInd": spouseExcessAlchInd,
                "alcoholicDetails": null,
                "otherIllnessInd": spouseOtherIllnessInd,
                "otherIllnessDetails": null,
                "deformityInd": spouseDeformityInd,
                "deformityDetails": null,
                "symptomsInd": spouseSymptomInd,
                "symptomsDetails": null,
                "pregnantInd": spousePregInd,
                "pregnantweeks": null,
                "femaleDiease_Ind": spousePregAbnormInd,
                "femaleDieaseWeeks": null,
                "healthInformation": null,
                "healthQuestionnaires_None": null,
                "lifeStyleQuestionnaires_None": null,
                "medicalQuestions": null
            },
            "bank": null,
            "existingInsurance_Ind": "N",
            "existingInsurance": null,
            "familyIncomeData": null,
            "noOfNominees": null
        }
        spousedata = jsonSpouse;
    }

    var JsonProposer = {
        "title": laTitle,
        "firstName": laFName,
        "middleName": laMName,
        "lastName": laLName,
        "dob": laDOB,
        "gender": laGender,
        "isSmoker": null,
        "maritalStatus": laMarital,
        "pan": laPAN,
        "maidName": null,
        "motherMaidName": laMotherName,
        "FHName": laFatherName,
        "nationality": laNationality,
        "otherNationality": null,
        "ageProofId": laAgeProof,
        "emailId": laEmailId,
        "phoneNo": laPhoneM,
        "officePhoneNo": laPhoneO,
        "std": null,
        "ResidencePhoneNo": laPhoneR,
        "alternate_cnt_no": null,
        "socialMediaDetails": {
            "facebook_id": laFbId,
            "linkedin_id": laLinkedInId,
            "corporate_id": laCorporateId
        },
        "currAddr1": laCurrAddr1,
        "currAddr2": laCurrAddr2,
        "currAddr3": laCurrAddr3,
        "currPincode": laPin,
        "currState": laState,
        "currCity": laCity,
        "perAddr1": laPerAddr1,
        "perAddr2": laPerAddr2,
        "perAddr3": laPerAddr3,
        "perPincode": laPin,
        "perState": laState,
        "perCity": laCity,
        "isCurrPerAddrSame": isCurrSamePer,
        "isPerAddrIsCorrAddr": null,
        "education": laEducation,
        "otherEducation": laOtherEducation,
        "highestQualification": laHighestQuali,
        "collegeNameLoc": laColgName,
        "course": null,
        "courseDuration": null,
        "courseYear": null,
        "studentInstruction": null,
        "employementType": laEmpType,
        "employementTypeOther": "",
        "employerName": laEmpName,
        "employerAddr": laAddressOfEmp,
        "designation": laEmpDesign,
        "natureOfDuty": laNatureOfDuty,
        "experienceInYears": laExpYears,
        "experienceInMonths": laExpMonths,
        "occupationType": null,
        "employementTypeText": null,
        "noOfEmployees": laNoOfEmp,
        "natureOfBusiness": laNatureOfDuty,
        "annualIncome": laAnnIncome,
        "isIncomeSource": laIncSrcInd,
        "incomeSourceDetails": laIncSrcTxt,
        "familyHistory": jsonYourFam,
        "familyDiease_Ind": isFamMemberDisease,
        "familyDiease_Details": txtFamMemberDisease,
        "hasfamilyAppliedETLI": hasFamMemEdelPolicy,
        "otherPolicy_Ind": $("#ddlLANameofcomp").val(),
        "otherPolicy_InsurerName": null,
        "otherPolicy_OtherInsurerName": null,
        "otherPolicy_Reason": $("#txtLAReason").val(),
        "otherPolicy_Date": $("#txtLAInsDeclWhen").val(),
        "CIB_Ind": null,
        "CIB_InsurerName": null,
        "CIB_Reason": null,
        "CIB_Date": null,
        "isPEP": isPep,
        "pepReason": txtPEP,
        "hasFamPhysician": null,
        "FamPhysicianName": null,
        "FamPhysicianAddr1": null,
        "FamPhysicianAddr2": null,
        "FamPhysicianPhone": null,
        "isCriminal": isCriminal,
        "criminalDetails": txtCriminal,
        "identityProof": idenetiryProof,
        "ageProof": null,
        "otherAgeProof": null,
        "addrProof": addressProof,
        "corrAddrProof": null,
        "incomeProof": incomeProof,
        "incomeProofText": null,
        "isCA": null,
        "hasEIAccount": isEIA,
        "EIAccountNo": null,
        "applyEIAccount": applyEIA,
        "EIARepository": insRepository,
        "wantEPolicy": null,
        "relationLAProposer": null,
        "relationLAProposerText": null,
        "height": null,
        "heightUnit": null,
        "heightFeets": laHeightFt,
        "heightInches": laHeightInch,
        "heightCentimeters": null,
        "weight": laWeight,
        "clientId": laCliId,
        "hasWeightChanged": laWeightVariationInd,
        "weightChange": laWeightVariation,
        "weightChangeReason": laWeightVariationReason,
        "isStaff": null,
        "employeeCode": null,
        "childDOB": null,
        "childGender": null,
        "isTaxResOfIndia": isTaxResident,
        "isHospitalized": laHospitalizedInd,
        "hospitalizedDate": laHospitalizedDate,
        "isRecovered": laFullyRecoveredInd,
        "nonRecoveryDetails": laFullyRecoveredTxt,
        "medicalScheduleDate": null,
        "medicalScheduleTime": null,
        //"aadhaarNo": laAdhaar,
        "husbandInsurance": null,
        "husbandIncome": null,
        "questionnaires": null,
        "bank": {
            "accountNo": bankAccNo,
            "name": bankName,
            "location": BankLocation,
            "ifscCode": BankIfsc,
            "investmentStrategy": null
        },
        "existingInsurance_Ind": null,
        "existingInsurance": [{

            "policyNo": null,
            "companyName": null,
            "yearOfIssue": null,
            "sumAssured": null,
            "annualizedPremium": null,
            "policyStatus": null,
            "acceptanceTerm": null
        }]
    }



    var jsonData = {
        "commondata": {
            "policyNo": policyNo,
            "transactionId": transId,
            "source": jsSource,
            "AgentCode": agentCode,
            "productName": "ZindagiPlus",
            "productCode": "TLBR08",
            //"tabId": "",
            //"statusFlag": ""
        },
        "BILink": biLink,
        "isLAProposerSame": isLaPropSame,
        "LifeAssured": {
            "nomineeData": jsonNominee,
            "title": laTitle,
            "firstName": laFName,
            "middleName": laMName,
            "lastName": laLName,
            "dob": laDOB,
            "gender": laGender,
            "isSmoker": null,
            "maritalStatus": laMarital,
            "pan": laPAN,
            "maidName": null,
            "motherMaidName": laMotherName,
            "FHName": laFatherName,
            "nationality": laNationality,
            "otherNationality": null,
            "ageProofId": null,
            "emailId": laEmailId,
            "phoneNo": laPhoneM,
            "officePhoneNo": laPhoneO,
            "std": null,
            "ResidencePhoneNo": laPhoneR,
            "alternate_cnt_no": null,
            "socialMediaDetails": {
                "facebook_id": laFbId,
                "linkedin_id": laLinkedInId,
                "corporate_id": laCorporateId
            },
            "currAddr1": laCurrAddr1,
            "currAddr2": laCurrAddr2,
            "currAddr3": laCurrAddr3,
            "currPincode": laPin,
            "currState": laState,
            "currCity": laCity,
            "perAddr1": laPerAddr1,
            "perAddr2": laPerAddr2,
            "perAddr3": laPerAddr3,
            "perPincode": laPin,
            "perState": laState,
            "perCity": laCity,
            "isCurrPerAddrSame": isCurrSamePer,
            "isPerAddrIsCorrAddr": null,
            "education": laEducation,
            "otherEducation": laOtherEducation,
            "highestQualification": laHighestQuali,
            "collegeNameLoc": laColgName,
            "course": null,
            "courseDuration": null,
            "courseYear": null,
            "studentInstruction": null,
            "employementType": laEmpType,
            "employementTypeOther": "",
            "employerName": laEmpName,
            "employerAddr": laAddressOfEmp,
            "designation": laEmpDesign,
            "natureOfDuty": laNatureOfDuty,
            "experienceInYears": laExpYears,
            "experienceInMonths": laExpMonths,
            "occupationType": null,
            "employementTypeText": null,
            "noOfEmployees": laNoOfEmp,
            "natureOfBusiness": laNatureOfDuty,
            "annualIncome": laAnnIncome,
            "isIncomeSource": laIncSrcInd,
            "incomeSourceDetails": laIncSrcTxt,
            "familyHistory": jsonYourFam,
            "familyDiease_Ind": isFamMemberDisease,
            "familyDiease_Details": txtFamMemberDisease,
            "hasfamilyAppliedETLI": hasFamMemEdelPolicy,
            "otherPolicy_Ind": $("#ddlLANameofcomp").val(),
            "otherPolicy_InsurerName": null,
            "otherPolicy_OtherInsurerName": null,
            "otherPolicy_Reason": $("#txtLAReason").val(),
            "otherPolicy_Date": $("#txtLAInsDeclWhen").val(),
            "CIB_Ind": null,
            "CIB_InsurerName": null,
            "CIB_Reason": null,
            "CIB_Date": null,
            "isPEP": isPep,
            "pepReason": txtPEP,
            "hasFamPhysician": null,
            "FamPhysicianName": null,
            "FamPhysicianAddr1": null,
            "FamPhysicianAddr2": null,
            "FamPhysicianPhone": null,
            "isCriminal": isCriminal,
            "criminalDetails": txtCriminal,
            "identityProof": idenetiryProof,
            "ageProof": laAgeProof,
            "otherAgeProof": null,
            "addrProof": addressProof,
            "corrAddrProof": null,
            "incomeProof": incomeProof,
            "incomeProofText": null,
            "isCA": null,
            "hasEIAccount": isEIA,
            "EIAccountNo": null,
            "applyEIAccount": applyEIA,
            "EIARepository": insRepository,
            "wantEPolicy": null,
            "relationLAProposer": null,
            "relationLAProposerText": null,
            "height": null,
            "heightUnit": null,
            "heightFeets": laHeightFt,
            "heightInches": laHeightInch,
            "heightCentimeters": null,
            "weight": laWeight,
            "clientId": laCliId,
            "hasWeightChanged": laWeightVariationInd,
            "weightChange": laWeightVariation,
            "weightChangeReason": laWeightVariationReason,
            "isStaff": null,
            "employeeCode": null,
            "childDOB": null,
            "childGender": null,
            "isTaxResOfIndia": isTaxResident,
            "isHospitalized": laHospitalizedInd,
            "hospitalizedDate": laHospitalizedDate,
            "isRecovered": laFullyRecoveredInd,
            "nonRecoveryDetails": laFullyRecoveredTxt,
            "medicalScheduleDate": null,
            "medicalScheduleTime": null,
            //"aadhaarNo": laAdhaar,
            "husbandInsurance": null,
            "husbandIncome": null,
            "questionnaires": {
                "travelOutsideIndiaInd": laTravelOutInd,
                "pilotInd": laPilotInd,
                "adventurousActivitiesInd": IsAdventurousActivities,
                "adventurousActivitiesDetails": laTotalCheckBoxChecked,
                "drugsInd": laDrugInd,
                "drugsDetails": laDrugTxt,
                "alcoholInd": laAlchohol,
                "alcoholDetails": laAlchoholTxt,
                "tobaccoInd": laIsSmoker,
                "tobaccoDetails": laIsSmokerTxt,
                "tobaccoStopInd": laStopTobaccoInd,
                "tobaccoStopDetails": laStopTobaccoDetails,
                "consultDoctorInd": laConsultDocInd,
                "consultDoctorDetails": laConsultDocTxt,
                "ECGInd": laTestInd,
                "ECGDetails": laTestTxt,
                "admitInd": laAdmittedInd,
                "admitDetails": laAdmittedTxt,
                "medicationInd": laMedication,

                "diagnosedInd": null,
                "diagnosedDetails": null,
                "medicationDetails": laMedicationTxt,
                "heartDieaseInd": laHeartDiseaseInd,
                "heartDieaseDetails": laHeartDiseaseTxt,
                "BPInd": laBpInd,
                "BPDetails": laBpTxt,
                "respiratoryDieaseInd": laLungDiseaseInd,
                "respiratoryDieaseDetails": laLungDiseaseTxt,
                "diabetesInd": laDiabetesInd,
                "diabetesDetails": laDiabetesTxt,
                "kidneyDieaseInd": laDiseaseInd,
                "kidneyDieaseDetails": laDiseaseTxt,
                "digestiveDieaseInd": laDigestInd,
                "digestiveDieaseDetails": laDigestTxt,
                "cancerDieaseInd": laCancerInd,
                "cancerDieaseDetails": laCancerTxt,
                "tropicalDieaseInd": laTropicalInd,
                "tropicalDieaseDetails": laTropicalTxt,
                "thyroidDieaseInd": laThyroidInd,
                "thyroidDieaseDetails": laThyroidTxt,
                "bloodDieaseInd": laBloodInd,
                "bloodDieaseDetails": laBloodTxt,
                "nervousDieaseInd": laNeuroInd,
                "nervousDieaseDetails": laNeuroTxt,
                "ENTDieaseInd": null,
                "ENTDieaseDetails": null,
                "muscleDieaseInd": laMuscleDiseaseInd,
                "muscleDieaseDetails": laMuscleDiseaseTxt,
                "aidsInd": laHivInd,
                "aidsDetails": laHivTxt,
                "alcoholicInd": laExcessAlchInd,
                "alcoholicDetails": laExcessAlchTxt,
                "otherIllnessInd": laOtherIllnessInd,
                "otherIllnessDetails": laOtherIllnessTxt,
                "deformityInd": laDeformityInd,
                "deformityDetails": laDeformityTxt,
                "symptomsInd": laSymptomInd,
                "symptomsDetails": laSymptomTxt,
                "pregnantInd": laPregInd,
                "pregnantweeks": laPregTxt,
                "femaleDiease_Ind": laPregAbnormInd,
                "femaleDieaseWeeks": laPregAbnormTxt,
                "healthInformation": null,
                "healthQuestionnaires_None": null,
                "lifeStyleQuestionnaires_None": null,
                "medicalQuestions": null
            },
            "bank": {
                "accountNo": bankAccNo,
                "name": bankName,
                "location": BankLocation,
                "ifscCode": BankIfsc,
                "investmentStrategy": null
            },
            "existingInsurance_Ind": laDiscloseInfoInd,
            "existingInsurance": jsonExstIns,
            "familyIncomeData": jsonFamIns,
            "noOfNominees": noOfNominees
        },
        "Spouse": jsonSpouse,
        "Proposer": JsonProposer,
        "isBetterHalfBenefit": isBetterHalfBenefit,
        'posp': {
            'AGENT_CODE': 'POX001',
            'POSCODE': '123',
            'POSNAME': 'pos name',
            'POSCONTACT': '9999999999',
            'POSAADHAAR': '123456789012',
            'POSPAN': 'PPPPO9867J',
            'POSSOURCE': '111A',
            'CRN': '54545',
            'SOURCESYSTEM': null,
            'D2USER': null,
            'RMCODE': null,
            'RMBRANCHCODE': null,
            'PFACODE': null,
            'BRANCHCODE': null,
            'BROKERBRANCHCODE': null,
            'SOURCE': null,
            'RECEIPTCREATEDBRANCH': null,
            'SALESBRANCHCODE': null,
            'CORPBRANCHCODE': null,
            'CHANNELCODE': null
        },
        "ConfidentialDetails": {
            "appid": null,
            "tranid": null,
            "source": null,
            "crnnumber": null,
            "confidentpropname": null,
            "liname": null,
            "haveyoumetlipersonally": null,
            "isliappearsgoodhealth": null,
            "libadhealthdetails": null,
            "islipropinsurancedeclined": null,
            "islipropinsurancedecdetails": null,
            "areyousatisfiedlirpropstatus": null,
            "issuspactivityobserved": null,
            "issuspactivitydetails": null,
            "howinsuranceamtcalc": null,
            "salesource": null,
            "pfaname": null,
            "pfarelationwithlirprop": null,
            "personallymetplace": null,
            "personallymetdate": null,
            "knowpropyear": null,
            "knowpropmonth": null,
            "knowpropdays": null,
            "occupation": null,
            "occupationothers": null,
            "annualincome": null,
            "premiumpaid": null,
            "assets1": null,
            "assets2": null,
            "assets3": null,
            "assets4": null,
            "lirpropdetails": null,
            "lirproplifestyledetails": null,
            "existingcustomer": null,
            "existingcustomerifyes": null,
            "etlipolicynumber": null,
            "etlidateofpurchase": null,
            "specifychannel": null,
            "acnumber": null,
            "durrelationship": null,
            "detailsproduct": null,
            "specifyrm": null,
            "declartionconsent": null,
            "brokerCode": null,
            "brokerName": null,
            "brokerManagerName": null
        }
    }


    MedicalQuestion = {
        "ddlLAHeight": $("#ddlLAHeight").val(),
        "ddlLAInches": $("#ddlLAInches").val(),
        "txtweight": $("#txtweight").val(),
        "ddlLAWeightVariation": laWeightVariation,
        "ddlLAWeightVariationReason": laWeightVariationReason,
        "ddlSpouseHeight": $("#ddlSpouseHeight").val(),
        "ddlSpouseInches": $("#ddlSpouseInches").val(),
        "txtSpouseWeight": $("#txtSpouseWeight").val(),
        "ddlSpouseWeightVariation": $("#ddlSpouseWeightVariation").val(),
        "ddlSpouseWeightVariationReason": $("#ddlSpouseWeightVariationReason").val(),
        "txtLAOtherActivities": $("#txtLAOtherActivities").val(),
        "txtLADrugDetail": $("#txtLADrugDetail").val(),
        "txtLABeer": $("#txtLABeer").val(),
        "txtLAHardLiquor": $("#txtLAHardLiquor").val(),
        "txtLAWine": $("#txtLAWine").val(),
        "txtLACigar": $("#txtLACigar").val(),
        "txtLABidi": $("#txtLABidi").val(),
        "txtLAgutka": $("#txtLAgutka").val(),
        "txtLAPaan": $("#txtLAPaan").val(),
        "txtLAStopTobaccoDuration": $("#txtLAStopTobaccoDuration").val(),
        "txtLAStopTobaccoReason": $("#txtLAStopTobaccoReason").val(),
        "txtLADoctorDetails": $("#txtLADoctorDetails").val(),
        "txtLATestsDetails": $("#txtLATestsDetails").val(),
        "txtLAAdmittedDetails": $("#txtLAAdmittedDetails").val(),
        "txtLAMedicationDetails": $("#txtLAMedicationDetails").val(),
        "txtLAHeartDetails": $("#txtLAHeartDetails").val(),
        "txtLABPDetails": $("#txtLABPDetails").val(),
        "txtLALungDetails": $("#txtLALungDetails").val(),
        "txtLADiabetesDetails": $("#txtLADiabetesDetails").val(),
        "txtLADiseaseDetails": $("#txtLADiseaseDetails").val(),
        "txtLADigestiveDetails": $("#txtLADigestiveDetails").val(),
        "txtLACancerDetails": $("#txtLACancerDetails").val(),
        "txtLATropicalDetails": $("#txtLATropicalDetails").val(),
        "txtLAThyroidDetails": $("#txtLAThyroidDetails").val(),
        "txtLABloodDetails": $("#txtLABloodDetails").val(),
        "txtLANeuroDetails": $("#txtLANeuroDetails").val(),
        "txtLADisorderDetails": $("#txtLADisorderDetails").val(),
        "txtLAAidsDetails": $("#txtLAAidsDetails").val(),
        "txtLAAlcoholicDetails": $("#txtLAAlcoholicDetails").val(),
        "txtLAOtherillDetails": $("#txtLAOtherillDetails").val(),
        "txtLADeformityDetails": $("#txtLADeformityDetails").val(),
        "txtLASymptomsDetails": $("#txtLASymptomsDetails").val(),
        "isHospitalized": $('input:radio[name=rdbLAHospitalized]:checked').val(),
        "txtLAHospitalizedDate": $("#txtLAHospitalizedDate").val(),
        "txtLAMediRecoverDetail": $("#txtLAMediRecoverDetail").val(),
        "ddlLANameofcomp": $("#ddlLANameofcomp").val(),
        "txtLAReason": $("#txtLAReason").val(),
        "txtLAInsDeclWhen": $("#txtLAInsDeclWhen").val(),
        "ddlLANameOfIns": $("#ddlLANameOfIns").val(),
        "txtLAInsReason": $("#txtLAInsReason").val(),
        "txtLAInsDate": $("#txtLAInsDate").val(),
        "questionnaires": {
            "travelOutsideIndiaInd": laTravelOutInd,
            "pilotInd": laPilotInd,
            "adventurousActivitiesInd": IsAdventurousActivities,
            "adventurousActivitiesDetails": laTotalCheckBoxChecked,
            "drugsInd": laDrugInd,
            "drugsDetails": laDrugTxt,
            "alcoholInd": laAlchohol,
            "alcoholDetails": laAlchoholTxt,
            "tobaccoInd": laIsSmoker,
            "tobaccoDetails": laIsSmokerTxt,
            "tobaccoStopInd": laStopTobaccoInd,
            "tobaccoStopDetails": laStopTobaccoDetails,
            "consultDoctorInd": laConsultDocInd,
            "consultDoctorDetails": laConsultDocTxt,
            "ECGInd": laTestInd,
            "ECGDetails": laTestTxt,
            "admitInd": laAdmittedInd,
            "admitDetails": laAdmittedTxt,
            "medicationInd": laMedication,

            "diagnosedInd": null,
            "diagnosedDetails": null,
            "medicationDetails": laMedicationTxt,
            "heartDieaseInd": laHeartDiseaseInd,
            "heartDieaseDetails": laHeartDiseaseTxt,
            "BPInd": laBpInd,
            "BPDetails": laBpTxt,
            "respiratoryDieaseInd": laLungDiseaseInd,
            "respiratoryDieaseDetails": laLungDiseaseTxt,
            "diabetesInd": laDiabetesInd,
            "diabetesDetails": laDiabetesTxt,
            "kidneyDieaseInd": laDiseaseInd,
            "kidneyDieaseDetails": laDiseaseTxt,
            "digestiveDieaseInd": laDigestInd,
            "digestiveDieaseDetails": laDigestTxt,
            "cancerDieaseInd": laCancerInd,
            "cancerDieaseDetails": laCancerTxt,
            "tropicalDieaseInd": laTropicalInd,
            "tropicalDieaseDetails": laTropicalTxt,
            "thyroidDieaseInd": laThyroidInd,
            "thyroidDieaseDetails": laThyroidTxt,
            "bloodDieaseInd": laBloodInd,
            "bloodDieaseDetails": laBloodTxt,
            "nervousDieaseInd": laNeuroInd,
            "nervousDieaseDetails": laNeuroTxt,
            "ENTDieaseInd": null,
            "ENTDieaseDetails": null,
            "muscleDieaseInd": laMuscleDiseaseInd,
            "muscleDieaseDetails": laMuscleDiseaseTxt,
            "aidsInd": laHivInd,
            "aidsDetails": laHivTxt,
            "alcoholicInd": laExcessAlchInd,
            "alcoholicDetails": laExcessAlchTxt,
            "otherIllnessInd": laOtherIllnessInd,
            "otherIllnessDetails": laOtherIllnessTxt,
            "deformityInd": laDeformityInd,
            "deformityDetails": laDeformityTxt,
            "symptomsInd": laSymptomInd,
            "symptomsDetails": laSymptomTxt,
            "pregnantInd": laPregInd,
            "pregnantweeks": laPregTxt,
            "femaleDiease_Ind": laPregAbnormInd,
            "femaleDieaseWeeks": laPregAbnormTxt,
            "healthInformation": null,
            "healthQuestionnaires_None": null,
            "lifeStyleQuestionnaires_None": null,
            "medicalQuestions": null
        }
    }

    var Questiondata = MedicalQuestion;
    debugger
    var dataz = {

        "ddlLATitle": $("#ddlLATitle").val(),
        "txtfirstname": $("#txtfirstname").val(),
        "txtmiddlename": $("#txtmiddlename").val(),
        "txtlastname": $("#txtlastname").val(),
        "txtdob": $("#txtdob").val(),
        "ddlgender": laGender,
        "ddlMaritalstatus": $("#ddlMaritalstatus").val(),
        "txtpanno": $("#txtpanno").val(),
        "txtfathername": $("#txtfathername").val(),
        "txtmothername": $("#txtmothername").val(),
        "txtadharno": $("#txtadharno").val(),
        "ddlageproof": $("#ddlageproof").val(),
        "ddlnatinality": $("#ddlnatinality").val(),
        "paddress1": $("#paddress1").val(),
        "paddress2": $("#paddress2").val(),
        "paddress3": $("#paddress3").val(),
        "ppincode": $("#ppincode").val(),
        "pstate": $("#pstate").val(),
        "pcity": $("#pcity").val(),
        "caddress1": $("#caddress1").val(),
        "caddress2": $("#caddress2").val(),
        "caddress3": $("#caddress3").val(),
        "cpincode": $("#cpincode").val(),
        "cstate": $("#cstate").val(),
        "ccity": $("#ccity").val(),
        "rdbLACorrAddr": $('input:radio[name=rdbLACorrAddr]:checked').val(),
        "rdbLACurOrPer": $('input:radio[name=rdbLACurOrPer]:checked').val(),
        "txtemailid": $("#txtemailid").val(),
        "txtphonemobile": $("#txtphonemobile").val(),
        "txtphoneresidental": $("#txtphoneresidental").val(),
        "txtphoneoffice": $("#txtphoneoffice").val(),
        "txtfacebookid": $("#txtfacebookid").val(),
        "txtlinkdinid": $("#txtlinkdinid").val(),
        "txtcorporateid": $("#txtcorporateid").val(),
        "ddlLAEducation": $("#ddlLAEducation").val(),
        "txtcollegename": $("#txtcollegename").val(),
        "txthighestedu": $("#txthighestedu").val(),
        "ddlSpouseTitle": $("#ddlSpouseTitle").val(),
        "txtSpousefirstname": $("#txtSpousefirstname").val(),
        "txtSpousemiddlename": $("#txtSpousemiddlename").val(),
        "txtSpouselastname": $("#txtSpouselastname").val(),
        "txtSpousedob": $("#txtSpousedob").val(),
        "ddlSpousegender": $("#ddlSpousegender").val(),
        "ddlSpouseMaritalstatus": $("#ddlSpouseMaritalstatus").val(),
        "txtSpousepanno": $("#txtSpousepanno").val(),
        "txtSpousefathername": $("#txtSpousefathername").val(),
        "txtSpousemothername": $("#txtSpousemothername").val(),
        "txtSpouseadharno": $("#txtSpouseadharno").val(),
        "ddlSpouseageproof": $("#ddlSpouseageproof").val(),
        "ddlSpousenatinality": $("#ddlSpousenatinality").val(),
        "chkAddrSameAsLA": $("#chkAddrSameAsLA").val(),
        "Spousepaddress1": $("#Spousepaddress1").val(),
        "Spousepaddress2": $("#Spousepaddress2").val(),
        "Spousepaddress3": $("#Spousepaddress3").val(),
        "Spouseppincode": $("#Spouseppincode").val(),
        "Spousepstate": $("#Spousepstate").val(),
        "Spousepcity": $("#Spousepcity").val(),
        "Spousecaddress1": $("#Spousecaddress1").val(),
        "Spousecaddress2": $("#Spousecaddress2").val(),
        "Spousecaddress3": $("#Spousecaddress3").val(),
        "Spousecpincode": $("#Spousecpincode").val(),
        "Spousecstate": $("#Spousecstate").val(),
        "Spouseccity": $("#Spouseccity").val(),
        "Spousetxtemailid": $("#Spousetxtemailid").val(),
        "Spousetxtphonemobile": $("#Spousetxtphonemobile").val(),
        "Spousetxtphoneresidental": $("#Spousetxtphoneresidental").val(),
        "Spousetxtphoneoffice": $("#Spousetxtphoneoffice").val(),
        "Spousetxtfacebookid": $("#Spousetxtfacebookid").val(),
        "Spousetxtlinkdinid": $("#Spousetxtlinkdinid").val(),
        "Spousetxtcorporateid": $("#Spousetxtcorporateid").val(),
        "ddlSpouseEducation": $("#ddlSpouseEducation").val(),
        "txtcollegenameSpouse": $("#txtcollegenameSpouse").val(),
        "txthighesteduSpouse": $("#txthighesteduSpouse").val(),
        "ddlLAEmployment": $("#ddlLAEmployment").val(),
        "txtnameofemployer": $("#txtnameofemployer").val(),
        "txtladesignation": $("#txtladesignation").val(),
        "ddlLAJobNature": laNatureOfDuty,
        "txtnatureofbusiness": laNatureOfDuty,
        "ddlLAExpYears": laExpYears,
        "ddlLAExpMonths": laExpMonths,
        "txtaddressofemployer": $("#txtaddressofemployer").val(),
        "ddlLAIndustryType": $("#ddlLAIndustryType").val(),
        "ddlLANoofEmp": $("#ddlLANoofEmp").val(),
        "txtannualincome": $("#txtannualincome").val(),
        "txtLAotherIncmSrc": $("#txtLAotherIncmSrc").val(),
        "ddlSpouseEmployment": $("#ddlSpouseEmployment").val(),
        "txtSpousenameofemployer": $("#txtSpousenameofemployer").val(),
        "txtSpousedesignation": $("#txtSpousedesignation").val(),
        "ddlSpouseJobNature": $("#ddlSpouseJobNature").val(),
        "txtSpousenatureofbusiness": $("#txtSpousenatureofbusiness").val(),
        "ddlSpouseExpYears": $("#ddlSpouseExpYears").val(),
        "ddlSpouseExpMonths": $("#ddlSpouseExpMonths").val(),
        "txtSpouseaddressofemployer": $("#txtSpouseaddressofemployer").val(),
        "ddlSpouseIndustryType": $("#ddlSpouseIndustryType").val(),
        "ddlSpouseNoofEmp": $("#ddlSpouseNoofEmp").val(),
        "txtSpouseannualincome": $("#txtSpouseannualincome").val(),
        "txtSpouseotherIncmSrc": $("#txtSpouseotherIncmSrc").val(),
        "ddlPropNoOfNominees": $("#ddlPropNoOfNominees").val(),
        "txtNomineeName1": $("#txtNomineeName1").val(),
        "txtNomineeDOB1": $("#txtNomineeDOB1").val(),//nomDOB1,
        "ddlNomRelation1": nomRelation1,
        "txtNomineeAllocation1": nomAllocation1,
        "txtAppointeeName1": appointeeName1,
        "txtAppointeeDOB1": appointeeDOB1,
        "txtAppointeeGender1": appointeeGender1,
        "txtAppointeeNomRelation1": appointeeRel1,
        "txtNomineeName2": $("#txtNomineeName2").val(),
        "txtNomineeDOB2": nomDOB2,
        "ddlNomRelation2": nomRelation2,
        "txtNomineeAllocation2": nomAllocation2,
        "txtAppointeeName2": $("#txtAppointeeName2").val(),
        "txtAppointeeDOB2": appointeeDOB2,
        "txtAppointeeGender2": appointeeGender2,
        "txtAppointeeNomRelation2": appointeeRel2,
        "txtNomineeName3": $("#txtNomineeName3").val(),
        "txtNomineeDOB3": nomDOB3,
        "ddlNomRelation3": nomRelation3,
        "txtNomineeAllocation3": nomAllocation3,
        "txtAppointeeName3": appointeeName3,
        "txtAppointeeDOB3": appointeeDOB3,
        "txtAppointeeGender3": appointeeGender3,
        "txtAppointeeNomRelation3": appointeeRel3,
        "txtpolyexposed_q1": txtPEP,
        "txtcrimalproc_q2": txtCriminal,
        "ddlPropIdentityProof": $("#ddlPropIdentityProof").val(),
        "ddlPropResidenceProof": $("#ddlPropResidenceProof").val(),
        "ddlPropIncomeProof": $("#ddlPropIncomeProof").val(),
        "ddlLAHeight": $("#ddlLAHeight").val(),
        "ddlLAInches": $("#ddlLAInches").val(),
        "txtweight": $("#txtweight").val(),
        "ddlLAWeightVariation": laWeightVariation,
        "ddlLAWeightVariationReason": laWeightVariationReason,
        "ddlSpouseHeight": $("#ddlSpouseHeight").val(),
        "ddlSpouseInches": $("#ddlSpouseInches").val(),
        "txtSpouseWeight": $("#txtSpouseWeight").val(),
        "ddlSpouseWeightVariation": $("#ddlSpouseWeightVariation").val(),
        "ddlSpouseWeightVariationReason": $("#ddlSpouseWeightVariationReason").val(),
        "txtLAOtherActivities": $("#txtLAOtherActivities").val(),
        "txtLADrugDetail": $("#txtLADrugDetail").val(),
        "txtLABeer": $("#txtLABeer").val(),
        "txtLAHardLiquor": $("#txtLAHardLiquor").val(),
        "txtLAWine": $("#txtLAWine").val(),
        "txtLACigar": $("#txtLACigar").val(),
        "txtLABidi": $("#txtLABidi").val(),
        "txtLAgutka": $("#txtLAgutka").val(),
        "txtLAPaan": $("#txtLAPaan").val(),
        "txtLAStopTobaccoDuration": $("#txtLAStopTobaccoDuration").val(),
        "txtLAStopTobaccoReason": $("#txtLAStopTobaccoReason").val(),
        "txtLADoctorDetails": $("#txtLADoctorDetails").val(),
        "txtLATestsDetails": $("#txtLATestsDetails").val(),
        "txtLAAdmittedDetails": $("#txtLAAdmittedDetails").val(),
        "txtLAMedicationDetails": $("#txtLAMedicationDetails").val(),
        "txtLAHeartDetails": $("#txtLAHeartDetails").val(),
        "txtLABPDetails": $("#txtLABPDetails").val(),
        "txtLALungDetails": $("#txtLALungDetails").val(),
        "txtLADiabetesDetails": $("#txtLADiabetesDetails").val(),
        "txtLADiseaseDetails": $("#txtLADiseaseDetails").val(),
        "txtLADigestiveDetails": $("#txtLADigestiveDetails").val(),
        "txtLACancerDetails": $("#txtLACancerDetails").val(),
        "txtLATropicalDetails": $("#txtLATropicalDetails").val(),
        "txtLAThyroidDetails": $("#txtLAThyroidDetails").val(),
        "txtLABloodDetails": $("#txtLABloodDetails").val(),
        "txtLANeuroDetails": $("#txtLANeuroDetails").val(),
        "txtLADisorderDetails": $("#txtLADisorderDetails").val(),
        "txtLAAidsDetails": $("#txtLAAidsDetails").val(),
        "txtLAAlcoholicDetails": $("#txtLAAlcoholicDetails").val(),
        "txtLAOtherillDetails": $("#txtLAOtherillDetails").val(),
        "txtLADeformityDetails": $("#txtLADeformityDetails").val(),
        "txtLASymptomsDetails": $("#txtLASymptomsDetails").val(),
        "txtLAHospitalizedDate": $("#txtLAHospitalizedDate").val(),
        "txtLAMediRecoverDetail": $("#txtLAMediRecoverDetail").val(),
        "ddlLANameofcomp": $("#ddlLANameofcomp").val(),
        "txtLAReason": $("#txtLAReason").val(),
        "txtLAInsDeclWhen": $("#txtLAInsDeclWhen").val(),
        "ddlLANameOfIns": $("#ddlLANameOfIns").val(),
        "txtLAInsReason": $("#txtLAInsReason").val(),
        "txtLAInsDate": $("#txtLAInsDate").val(),
        "ddlLAFamIncmRel": $("#ddlLAFamIncmRel").val(),
        "txtLAFamIncmOccupation": $("#txtLAFamIncmOccupation").val(),
        "txtLAFamIncmTotalSum": $("#txtLAFamIncmTotalSum").val(),
        "txtLAFamIncmIncome": $("#txtLAFamIncmIncome").val(),
        "txtLAPolicyNumber": $("#txtLAPolicyNumber").val(),
        "ddlLAexInsurance": $("#ddlLAexInsurance").val(),
        "ddlLAYearIssue": $("#ddlLAYearIssue").val(),
        "txtLAPremium": $("#txtLAPremium").val(),
        "ddlLAStatusPolicy": $("#ddlLAStatusPolicy").val(),
        "txtLASumAssured": $("#txtLASumAssured").val(),
        "ddlLAAcceptanceTerm": $("#ddlLAAcceptanceTerm").val(),
        "ddlLAFamilyRelationship": $("#ddlLAFamilyRelationship").val(),
        "ddlLAHealthStatus": $("#ddlLAHealthStatus").val(),
        "txtLAAge": $("#txtLAAge").val(),
        "txtLAAgeAtDeath": $("#txtLAAgeAtDeath").val(),
        "ddlLACauseOfDeath": $("#ddlLACauseOfDeath").val(),
        "tblFamInsRowCount": $("#tblFamInsRowCount").val(),
        "txtLAtdetailhereditary": $("#txtLAtdetailhereditary").val(),
        "ddlSpouseFamilyRelationship": $("#ddlSpouseFamilyRelationship").val(),
        "ddlSpouseHealthStatus": $("#ddlSpouseHealthStatus").val(),
        "txtSpouseAge": $("#txtSpouseAge").val(),
        "txtSpouseAgeAtDeath": $("#txtSpouseAgeAtDeath").val(),
        "ddlSpouseCauseOfDeath": $("#ddlSpouseCauseOfDeath").val(),
        "tblSpouseFamRowCount": $("#tblSpouseFamRowCount").val(),
        "txtSpousetdetailhereditary": $("#txtSpousetdetailhereditary").val(),
        "txtBankAccNo": $("#txtBankAccNo").val(),
        "txtBankName": $("#txtBankName").val(),
        "txtBankLoc": $("#txtBankLoc").val(),
        "txtBankIFSC": $("#txtBankIFSC").val(),
        "lblinvestmentamt": $("#lblinvestmentamt").val(),
        "lblbasecover": $("#lblbasecover").val(),
        "lblmodeofpayment": $("#lblmodeofpayment").val(),
        "lblPPT": $("#lblPPT").val(),
        "linkBIpdfFinal": $("#linkBIpdfFinal").val(),
        "linkAppForm": $("#linkAppForm").val(),
        "lbltotalpremiumamt": $("#lbltotalpremiumamt").val(),
        "isLaPropSame": $("#isLaPropSame").val(),
        "hdnPolicyNo": $("#hdnPolicyNo").val(),
        "hdnTransactionId": $("#hdnTransactionId").val(),
        "bi_pdf": $("#bi_pdf").val(),
        "isCurrSamePer": isCurrSamePer,
        "laIncSrcInd": laIncSrcInd,
        "isPep": isPep,
        "txtpolyexposed_q1": txtPEP,
        "isCriminal": isCriminal,
        "isEIA": isEIA,
        "applyEIA": applyEIA,
        "insRepository": insRepository,
        "laCliId": $("#laCliId").val(),
        "laWeightVariationInd": $('input:radio[name=rdbLAWeightVariation]:checked').val(),
        //"laWeightVariationInd": laWeightVariationInd,
        "isTaxResident": isTaxResident,
        "isHospitalized": $('input:radio[name=rdbLAHospitalized]:checked').val(),
        "hospitalizedDate": laHospitalizedDate,
        "laFullyRecoveredInd": laFullyRecoveredInd,
        "travelOutsideIndiaInd": laTravelOutInd,
        "pilotInd": laPilotInd,
        "adventurousActivitiesInd": IsAdventurousActivities,
        "adventurousActivitiesDetails": laTotalCheckBoxChecked,
        "drugsInd": laDrugInd,
        "drugsDetails": laDrugTxt,
        "alcoholInd": $('input:radio[name=rdbLAAlcohol]:checked').val(),
        //"alcoholInd": laAlchohol,
        "alcoholDetails": laAlchoholTxt,
        "tobaccoInd": laIsSmoker,
        "tobaccoDetails": laIsSmokerTxt,
        "tobaccoStopInd": laStopTobaccoInd,
        "tobaccoStopDetails": laStopTobaccoDetails,
        "consultDoctorInd": laConsultDocInd,
        "consultDoctorDetails": laConsultDocTxt,
        "ECGInd": laTestInd,
        "ECGDetails": laTestTxt,
        "admitInd": laAdmittedInd,
        "admitDetails": laAdmittedTxt,
        "medicationInd": laMedication,
        "diagnosedInd": null,
        "diagnosedDetails": null,
        "medicationDetails": laMedicationTxt,
        "heartDieaseInd": laHeartDiseaseInd,
        "heartDieaseDetails": laHeartDiseaseTxt,
        "BPInd": laBpInd,
        "BPDetails": laBpTxt,
        "respiratoryDieaseInd": laLungDiseaseInd,
        "respiratoryDieaseDetails": laLungDiseaseTxt,
        "diabetesInd": laDiabetesInd,
        "diabetesDetails": laDiabetesTxt,
        "kidneyDieaseInd": laDiseaseInd,
        "kidneyDieaseDetails": laDiseaseTxt,
        "digestiveDieaseInd": laDigestInd,
        "digestiveDieaseDetails": laDigestTxt,
        "cancerDieaseInd": laCancerInd,
        "cancerDieaseDetails": laCancerTxt,
        "tropicalDieaseInd": laTropicalInd,
        "tropicalDieaseDetails": laTropicalTxt,
        "thyroidDieaseInd": laThyroidInd,
        "thyroidDieaseDetails": laThyroidTxt,
        "bloodDieaseInd": laBloodInd,
        "bloodDieaseDetails": laBloodTxt,
        "nervousDieaseInd": laNeuroInd,
        "nervousDieaseDetails": laNeuroTxt,
        "ENTDieaseInd": "N",
        "ENTDieaseDetails": null,
        "muscleDieaseInd": laMuscleDiseaseInd,
        "muscleDieaseDetails": laMuscleDiseaseTxt,
        "aidsInd": laHivInd,
        "aidsDetails": laHivTxt,
        "alcoholicInd": laExcessAlchInd,
        "alcoholicDetails": laExcessAlchTxt,
        "otherIllnessInd": laOtherIllnessInd,
        "otherIllnessDetails": laOtherIllnessTxt,
        "deformityInd": laDeformityInd,
        "deformityDetails": laDeformityTxt,
        "symptomsInd": laSymptomInd,
        "symptomsDetails": laSymptomTxt,
        "pregnantInd": laPregInd,
        "pregnantweeks": laPregTxt,
        "femaleDiease_Ind": laPregAbnormInd,
        "femaleDieaseWeeks": laPregAbnormTxt,
        "nomineeData": jsonNominee,
        "familyHistory": jsonYourFam,
        "familyDiease_Ind": isFamMemberDisease,
        "familyDiease_Details": txtFamMemberDisease,
        "hasfamilyAppliedETLI": hasFamMemEdelPolicy,
        "appointeeCd1": appointeeCd1,
        "appointeeCd2": appointeeCd2,
        "appointeeCd3": appointeeCd3,
        "nomRelationCd1": nomRelationCd1,
        "nomRelationCd2": nomRelationCd2,
        "nomRelationCd3": nomRelationCd3,
        "nomGender1": nomGender1,
        "nomGender2": nomGender2,
        "nomGender3": nomGender3,
        "bi_pdf": biLink,
        "islasame": $("#islasame").val(),
        "SelectedQuoteID": $("#SelectedQuoteID").val(),
        "CustomerReferenceID": $("#CustomerReferenceID").val(),
        "SpouseDetails": JSON.stringify(spousedata),
        "agenominee1": agenominee1,
        "agenominee2": agenominee2,
        "agenominee3": agenominee3,
        "existingInsurance": jsonExstIns,
        "familyIncomeData": jsonFamIns,
        "MedicalQuestionData": JSON.stringify(Questiondata),
        "SpouseFamilyJson": JSON.stringify(stringSpouseFam),
        "existingInsurance_Ind": $('input:radio[name=rdbLADiscloseInsur1]:checked').val(),
        //"SpuseexistingInsurance_Ind": $('input:radio[name=rdbSpouseDiscloseInsur1]:checked').val(),
        "SpuseexistingInsurance_Ind": spouseDiscloseInfoInd, 
        "otherPolicy_Ind": laInsDeclinedInd,
        "otherPolicy_InsurerName": $("#ddlLANameofcomp").val(),
        "otherPolicy_OtherInsurerName": null,
        "otherPolicy_Reason": $("#txtLAReason").val(),
        "otherPolicy_Date": $("#txtLAInsDeclWhen").val(),
        "isIncomeSource": laIncSrcInd,
        "incomeSourceDetails": $("#txtLAotherIncmSrc").val()
    }

    var dataString = JSON.stringify(dataz);
   console.log(dataString);

    $.ajax({
        // url: uatIP + "/WhitelabelAPI/api/SaveProposalForm",
        url: "/TermInsuranceIndia/EdelweissProposalPage",
        type: "POST", //send it through get method
        data: dataString,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            if (data == "" || data == null) {
                
                alert("Please check your details once again");
                HideFunction();
                url = "/TermInsuranceIndia/EdelweissProposalPage?QuoteId=" + $("#SelectedQuoteID").val();
                window.location.href = url;
                //$("#spanid").hide("slow", function () {
                //    alert("Please check your details once again");
                //});

            }
            else {
                if (JSON.parse(data).IsCustomer == false && JSON.parse(data).CallingSource) {
                    url = "/TermInsuranceIndia/New_CustomerPaymentRequest";
                    window.location.href = url;
                }
                else if (JSON.parse(data).IsCustomer == true) {
                    if (JSON.parse(data).status == "True") {

                        status = JSON.parse(data).status;
                        transactionId = JSON.parse(data).transactionId;
                        policyNo = JSON.parse(data).policyNo;
                        $("#hdnPolicyNo").val(policyNo);
                        $("#hdnTransactionId").val(transactionId);
                        $('#modalTnC').modal('hide');
                        $("#ModelOTP").show();
                        $('body').css('overflow', 'hidden');
                        HideFunction();
                    }
                    else {
                        alert(JSON.parse(data).ResponseMessage);
                         url = "/TermInsuranceIndia/EdelweissProposalPage?QuoteId=" + $("#SelectedQuoteID").val();
                         window.location.href = url;
                        //$("#spanid").hide("slow", function () {
                        //    alert(JSON.parse(data).ResponseMessage);
                        //});
                    }
                }
                else {
                    alert("Please check your details once again");
                    url = "/TermInsuranceIndia/EdelweissProposalPage?QuoteId=" + $("#SelectedQuoteID").val();
                    window.location.href = url;
                    //$("#spanid").hide("slow", function () {
                    //    alert("Please check your details once again");
                    //});
                }

            }


        },
        error: function (xhr) {
            alert("Please check your details once again");
            url = "/TermInsuranceIndia/EdelweissProposalPage?QuoteId=" + $("#SelectedQuoteID").val();
            window.location.href = url;
            //$("#spanid").hide("slow", function () {
            //    alert("Please check your details once again");
            //});

        }

    });

}





$("#closeterm").click(function () {
    $('#modalTnC').modal('hide');
});

$("input[name='rdbSpouseExistInsurance']").click(function () {

    if ($(this).val() == "yes") {
        $("#Spouseinfodisclosediv").css("display", "block");
    }
    else {
        $("#Spouseinfodisclosediv").css("display", "none");
    }

});

$("input[name='rdbSpouseDiscloseInsur1']").click(function () {
    
   
    if ($("input[name='rdbSpouseDiscloseInsur1']:checked") == true) {
        $("input[name='rdbSpouseDiscloseInsur1']").val("Yes");
    } else {
        $("input[name='rdbSpouseDiscloseInsur1']").val("No");
    }
    alert($("input[name='rdbSpouseDiscloseInsur1']").val());
});


// $("#btnEINS").click(function () {
// $("#divEINSBank").css("display", "none");
// $("#thankyoudiv").css("display", "block");
// });

$("#btnBackEINS").click(function () {
    $("#divEINSBank").css("display", "none");
    $("#taxinfodiv").css("display", "block");
});



$("#btnFillEINSBank").click(function () {
    $("#rdbLAEInsuranceAccY").prop("checked", false);
    $("#rdbLAEInsuranceAccN").prop("checked", true);

    $("#einsurancediv").css("display", "block");

    $("#rdbLAapplyeiaCreationNSDL").prop("checked", true);
    $("#rdbLAapplyeiaCreationkarvy").prop("checked", false);
    $("#rdbLAapplyeiaCreationcentral").prop("checked", false);
    $("#rdbLAapplyeiaCreationCAMS").prop("checked", false);

    $("#txtBankAccNo").val("32124");
    $("#txtBankName").val("Sample Bank Name");
    $("#txtBankLoc").val("Bank Location");
    $("#txtBankIFSC").val("133333");

});


//$("#btnTaxRes").click(function () {
//    $("#taxinfodiv").css("display", "block");
//    //$("#divEINSBank").css("display", "block");
//});

$("#btnFillTaxRes").click(function () {

    $("#rdbLATaxResidentOfIndia").prop("checked", true);
    $("#rdbLATaxResidentOfOther").prop("checked", false);
});

$("#btnBackTaxRes").click(function () {
    $("#divQues4").css("display", "block");
    $("#taxinfodiv").css("display", "none");
});

$("#btnBackQues4").click(function () {
    $("#divQues4").css("display", "none");
    $("#divQues3").css("display", "block");
});

$("#btnFillQues4").click(function () {
    var markup = "<tr><td style='display: none'>1</td><td>Father</td><td>60</td><td>Healthy</td><td>N/A</td><td>N/A</td><td><input class='btn btn-danger deleteRowYourFam' type='button' value='Delete'></td></tr><tr><td style='display: none'>2</td><td>Mother</td><td>57</td><td>Healthy</td><td>N/A</td><td>N/A</td><td><input class='btn btn-danger deleteRowYourFam' type='button' value='Delete'></td></tr><tr><td style='display: none'>3</td><td>Spouse</td><td>35</td><td>Deceased</td><td>24</td><td>Natural death</td><td><input class='btn btn-danger deleteRowYourFam' type='button' value='Delete'></td></tr>";

    $("#tblYourFamDetail tbody").append(markup);
    $("#tblYourFamDetail").show();

    //assigning count of rows in table to hidden field
    var rowCount = $('#tblYourFamDetail tbody tr').length;
    $("#tblYourFamRowCount").val(parseInt(rowCount));

    $("#rdbLADiscloseInsurY").prop("checked", true);
    $("#rdbLADiscloseInsurN").prop("checked", false);

    $("#txtLAtdetailhereditary").val("yourFamily blood pressure/cancer details");
    $("#txtLAtdetailhereditary").css("display", "block");

    $("#rdbLAfamilyETLIInsY").prop("checked", true);
    $("#rdbLAfamilyETLIInsN").prop("checked", false);



    //Spouse
    if ($("#islasame").val() == "N") {
        var markup = "<tr><td style='display: none'>1</td><td>Father</td><td>60</td><td>Healthy</td><td>N/A</td><td>N/A</td><td><input class='btn btn-danger deleteRowYourFam' type='button' value='Delete'></td></tr><tr><td style='display: none'>2</td><td>Mother</td><td>57</td><td>Healthy</td><td>N/A</td><td>N/A</td><td><input class='btn btn-danger deleteRowYourFam' type='button' value='Delete'></td></tr><tr><td style='display: none'>3</td><td>Spouse</td><td>-</td><td>Deceased</td><td>24</td><td>Natural death</td><td><input class='btn btn-danger deleteRowYourFam' type='button' value='Delete'></td></tr>";

        $("#tblSpouseFamDetail tbody").append(markup);
        $("#tblSpouseFamDetail").show();

        //assigning count of rows in table to hidden field
        var rowCount = $('#tblSpouseFamDetail tbody tr').length;
        $("#tblSpouseFamRowCount").val(parseInt(rowCount));

        $("#rdbSpouseDiscloseInsurY").prop("checked", true);
        $("#rdbSpouseDiscloseInsurN").prop("checked", false);

        $("#txtSpousetdetailhereditary").val("Spouse Family blood pressure/cancer details");
        $("#txtSpousetdetailhereditary").css("display", "block");

    }

    $("html, body").animate({ scrollTop: $(document).height() }, 200);
});


$("#btnaddSpousefamilymember").click(function () {
    debugger
    var relationId = "";
    var relationship = "";
    var healthStatusId = "";
    var HealthStatus = "";
    var age = "";
    var ageAtDeath = "";
    var causeOfDeath = "";

    relationId = $("#ddlSpouseFamilyRelationship").val();
    relationship = $("#ddlSpouseFamilyRelationship option:selected").text();
    healthStatusId = $("#ddlSpouseHealthStatus").val();
    HealthStatus = $("#ddlSpouseHealthStatus option:selected").text();
    age = $("#txtSpouseAge").val();
    ageAtDeath = $("#txtSpouseAgeAtDeath").val();
    causeOfDeathId = $("#ddlSpouseCauseOfDeath").val();
    causeOfDeath = $("#ddlSpouseCauseOfDeath option:selected").text();

    if ((relationId == "" || healthStatusId == "")) {
        alert("Please enter your family details properly");
        return false;
    }
    else if (healthStatusId != "") {
        if (healthStatusId != "Deceased" && age == "") {
            alert("Please enter family member age.");
            return false;
        }
        else if (healthStatusId == "Deceased") {
            if (ageAtDeath == "" || causeOfDeath == "") {
                alert("Please enter family member age of death and cause death.");
                return false;
            }
        }
    }

    if (age == "") {
        // age = "-";
        age = ageAtDeath;
    }
    if (ageAtDeath == "" && causeOfDeathId == "") {
        ageAtDeath = "N/A";
        causeOfDeath = "N/A";
    }

    var markup = "<tr><td style='display: none'>" + relationId + "</td><td>" + relationship + "</td><td>" + age + "</td><td>" + HealthStatus + "</td><td>" + ageAtDeath + "</td><td>" + causeOfDeath
        + "</td><td><input class='btn btn-danger deleteRowSpouseFam' type='button' value='Delete'></td></tr>";

    $("#tblSpouseFamDetail tbody").append(markup);
    $("#tblSpouseFamDetail").show();

    //assigning count of rows in table to hidden field
    var rowCount = $('#tblSpouseFamDetail tbody tr').length;
    $("#tblSpouseFamRowCount").val(parseInt(rowCount));



    relationId = $("#ddlSpouseFamilyRelationship").val();
    relationship = $("#ddlSpouseFamilyRelationship option:selected").text();
    healthStatusId = $("#ddlSpouseHealthStatus").val();
    HealthStatus = $("#ddlSpouseHealthStatus option:selected").text();
    age = $("#txtSpouseAge").val();
    ageAtDeath = $("#txtSpouseAgeAtDeath").val();
    causeOfDeathId = $("#ddlSpouseCauseOfDeath").val();
    causeOfDeath = $("#ddlSpouseCauseOfDeath option:selected").text();

    //Empty the text fields
    $("#ddlSpouseFamilyRelationship").val("");
    $("#ddlSpouseHealthStatus").val("");
    $("#txtSpouseAge").val("");
    $("#txtSpouseAgeAtDeath").val("");
    $("#ddlSpouseCauseOfDeath").val("");


});

$(document).on('click', '.deleteRowSpouseFam', function () {

    $(this).parents("tr").remove();
    var removedMemberId = $(this).closest('tr').find('td:eq(0)').text();

    var rowCount = $('#tblSpouseFamDetail tbody tr').length;
    $("#tblSpouseFamRowCount").val(parseInt(rowCount));

    if (parseInt(rowCount) == 0) {
        $("#tblSpouseFamDetail").hide();
    }
});


$("#btnaddfamilymember").click(function () {

    var relationId = "";
    var relationship = "";
    var healthStatusId = "";
    var HealthStatus = "";
    var age = "";
    var ageAtDeath = "";
    var causeOfDeath = "";

    relationId = $("#ddlLAFamilyRelationship").val();
    relationship = $("#ddlLAFamilyRelationship option:selected").text();
    healthStatusId = $("#ddlLAHealthStatus").val();
    HealthStatus = $("#ddlLAHealthStatus option:selected").text();
    age = $("#txtLAAge").val();
    ageAtDeath = $("#txtLAAgeAtDeath").val();
    causeOfDeathId = $("#ddlLACauseOfDeath").val();
    causeOfDeath = $("#ddlLACauseOfDeath option:selected").text();

    if ((relationId == "" || healthStatusId == "")) {
        alert("Please enter your family details properly");
        return false;
    }
    else if (healthStatusId != "") {
        if (healthStatusId != "Deceased" && age == "") {
            alert("Please enter family member age.");
            return false;
        }
        else if (healthStatusId == "Deceased") {
            if (ageAtDeath == "" || causeOfDeath == "") {
                alert("Please enter family member age of death and cause death.");
                return false;
            }
        }
    }

    if (age == "") {
        //  age = "-";
        age = ageAtDeath;
    }
    if (ageAtDeath == "" && causeOfDeathId == "") {
        ageAtDeath = "N/A";
        causeOfDeath = "N/A";
    }

    var markup = "<tr><td style='display: none'>" + relationId + "</td><td>" + relationship + "</td><td>" + age + "</td><td>" + HealthStatus + "</td><td>" + ageAtDeath + "</td><td>" + causeOfDeath
        + "</td><td><input class='btn btn-danger deleteRowYourFam' type='button' value='Delete'></td></tr>";

    $("#tblYourFamDetail tbody").append(markup);
    $("#tblYourFamDetail").show();

    //assigning count of rows in table to hidden field
    var rowCount = $('#tblYourFamDetail tbody tr').length;
    $("#tblYourFamRowCount").val(parseInt(rowCount));



    //Empty the text fields
    $("#ddlLAFamilyRelationship").val("");
    $("#ddlLAHealthStatus").val("");
    $("#txtLAAge").val("");
    $("#txtLAAgeAtDeath").val("");
    $("#ddlLACauseOfDeath").val("");

});

$(document).on('click', '.deleteRowYourFam', function () {

    $(this).parents("tr").remove();
    var removedMemberId = $(this).closest('tr').find('td:eq(0)').text();

    var rowCount = $('#tblYourFamDetail tbody tr').length;
    $("#tblYourFamRowCount").val(parseInt(rowCount));

    if (parseInt(rowCount) == 0) {
        $("#tblYourFamDetail").hide();
    }
});


$("#btnBackHeight").click(function () {
    openTab(event, 'PersonalDetails');

    $("#divPersonal").css("display", "none");
    $("#divEmployment").css("display", "none");
    $("#divNominee").css("display", "none");

    $("#divOther").css("display", "block");
});

$("#ddlSpouseHealthStatus").change(function () {

    $("#txtSpouseAgeAtDeath").val("");
    $("#ddlSpouseCauseOfDeath").val("");
    $("#txtSpouseAge").val("");

    if ($(this).val() != "") {
        if ($(this).val() == "Deceased") {


            $("#txtSpouseAgeAtDeath").removeAttr("disabled");
            $("#ddlSpouseCauseOfDeath").removeAttr("disabled");
            $("#txtSpouseAge").attr("disabled", "disabled");
        }
        else {
            $("#txtSpouseAge").removeAttr("disabled");
            $("#txtSpouseAgeAtDeath").attr("disabled", "disabled");
            $("#ddlSpouseCauseOfDeath").attr("disabled", "disabled");
        }
    }
    else {
        $("#txtSpouseAge").attr("disabled", "disabled");
        $("#txtSpouseAgeAtDeath").attr("disabled", "disabled");
        $("#ddlSpouseCauseOfDeath").attr("disabled", "disabled");
    }


});



$("#ddlLAHealthStatus").change(function () {
    $("#txtLAAgeAtDeath").val("");
    $("#ddlLACauseOfDeath").val("");
    $("#txtLAAge").val("");

    if ($(this).val() != "") {
        if ($(this).val() == "Deceased") {
            $("#txtLAAgeAtDeath").removeAttr("disabled");
            $("#ddlLACauseOfDeath").removeAttr("disabled");
            $("#txtLAAge").attr("disabled", "disabled");
        }
        else {
            $("#txtLAAge").removeAttr("disabled");
            $("#txtLAAgeAtDeath").attr("disabled", "disabled");
            $("#ddlLACauseOfDeath").attr("disabled", "disabled");
        }
    }
    else {
        $("#txtLAAge").attr("disabled", "disabled");
        $("#txtLAAgeAtDeath").attr("disabled", "disabled");
        $("#ddlLACauseOfDeath").attr("disabled", "disabled");
    }


});

$("#btnFillQues3").click(function () {
    $("#rdbLALifeInsurerY").prop("checked", true);
    $("#rdbLALifeInsurerN").prop("checked", false);

    $("#Insurerdiv").show();
    $("#expolicyLAReason").show();
    $("#expolicytxtLAWhen").show();

    $("#ddlLANameofcomp").val("Aviva Life Insurance Co. Ltd.");
    $("#txtLAReason").val("Some reason for Insurance declined.");
    $("#txtLAInsDeclWhen").val("2019-04-18");

    $("#rdbLALifeInsurerBenefitsY").prop("checked", true);
    $("#rdbLALifeInsurerBenefitsN").prop("checked", false);

    $("#disabilitybenefitdiv").show();

    $("#ddlLANameOfIns").val("Aviva Life Insurance Co. Ltd.");
    $("#txtLAInsReason").val("Some Reason disablity benefit.");
    $("#txtLAInsDate").val("2019-05-19");

    $("#rdbLAExistInsuranceY").prop("checked", true);
    $("#rdbLAExistInsuranceN").prop("checked", false);



    $("#infodisclosediv").show();

    $("#rdbLADiscloseInsur1Y").prop("checked", true);
    $("#rdbLADiscloseInsur1N").prop("checked", false);

    $("#divExistinginsurance").css("display", "block");

    if ($("#islasame").val() == "N") {
        $("#rdbSpouseLifeInsurerY").prop("checked", true);
        $("#rdbSpouseLifeInsurerN").prop("checked", false);

        $("#rdbSpouseLifeInsurerY").prop("checked", false);
        $("#rdbSpouseLifeInsurerN").prop("checked", true);

        $("#rdbSpouseLifeInsurerBenefitsY").prop("checked", true);
        $("#rdbSpouseLifeInsurerBenefitsN").prop("checked", false);

        $("#rdbSpouseExistInsuranceY").prop("checked", true);
        $("#rdbSpouseExistInsuranceN").prop("checked", false);

        $("#Spouseinfodisclosediv").show();

        $("#rdbSpouseDiscloseInsur1Y").prop("checked", true);
        $("#rdbSpouseDiscloseInsur1N").prop("checked", false);



    }


    var markup = "<tr><td style='display:none'>1</td><td>Father</td><td>Father Occupation</td><td>800000</td><td>90000</td><td><input class='btn btn-danger deleteRowFamInc' type='button' value='Delete'></td></tr><tr><td style='display: none'>2</td><td>Mother</td><td>mother occupation</td><td>700000</td><td>70000</td><td><input class='btn btn-danger deleteRowFamInc' type='button' value='Delete'></td></tr><tr><td style='display: none'>3</td><td>Spouse</td><td>Spouse Occupation</td><td>700000</td><td>80000</td><td><input class='btn btn-danger deleteRowFamInc' type='button' value='Delete'></td></tr>";


    $("#tblFamInsDetail tbody").append(markup);
    $("#tblFamInsDetail").show();

    //assigning count of rows in table to hidden field
    var rowCount = $('#tblFamInsDetail tbody tr').length;
    $("#tblFamInsRowCount").val(parseInt(rowCount));


    var markup2 = "<tr><td>1234</td><td>AEGON Religare Life Insurance Co. Ltd.</td><td>2018</td><td>800000</td><td>Lapsed</td><td>900000</td><td>Standard</td><td><input class='btn btn-danger deleteRowExstIns' type='button' value='Delete'></td></tr><tr><td>4321</td><td>HDFC Standard Life Insurance Co. Ltd.</td><td>2017</td><td>800000</td><td>Surrendered</td><td>80000</td><td>Sub-Standard</td><td><input class='btn btn-danger deleteRowExstIns' type='button' value='Delete'></td></tr>"


    $("#tblExstInsDetail tbody").append(markup2);
    $("#tblExstInsDetail").show();

    //assigning count of rows in table to hidden field
    var rowCount = $('#tblExstInsDetail tbody tr').length;
    $("#tblExstInsRowCount").val(parseInt(rowCount));

    $("html, body").animate({ scrollTop: $(document).height() }, 200);
});

$("#btnBackQues3").click(function () {
    //$("#divQues3").css("display", "none");

    openTab(event, 'HealthDetails');
    $("#divheightDetails").css("display", "none");
    $("#divQues1").css("display", "none");
    $("#divQues2").css("display", "block");
});

$("#btnExitInsDetail").click(function () {
    debugger
    var polNo = "";
    var insCompnyName = "";
    var yearOfPolicyIns = "";
    var annualizedPremium = 0;
    var statusOfPolicy = "";
    var sumAssured = "";
    var acceptanceTerm = "";
    
    

    polNo = $("#txtLAPolicyNumber").val();
    //insCompnyName = $("#ddlLAexInsurance option:selected").text();
    insCompnyName = $("#ddlLAexInsurance option:selected").val();
    //yearOfPolicyIns = $("#ddlLAYearIssue option:selected").text();
    yearOfPolicyIns = $("#ddlLAYearIssue option:selected").val();
    annualizedPremium = $("#txtLAPremium").val();
    //statusOfPolicy = $("#ddlLAStatusPolicy option:selected").text();
    statusOfPolicy = $("#ddlLAStatusPolicy option:selected").val();
    sumAssured = $("#txtLASumAssured").val();
    //acceptanceTerm = $("#ddlLAAcceptanceTerm option:selected").text();
    acceptanceTerm = $("#ddlLAAcceptanceTerm option:selected").val();


    if (insCompnyName == "" || yearOfPolicyIns == "" || statusOfPolicy == "" || sumAssured == "" || acceptanceTerm == "") {
        alert("Please enter the mandetory fields in existing insurance details.");
    }
    else {
        var markup = "<tr><td>" + polNo + "</td><td>" + insCompnyName + "</td><td>" + yearOfPolicyIns + "</td><td>" + annualizedPremium + "</td><td>" + statusOfPolicy + "</td><td>" + sumAssured + "</td><td>" + acceptanceTerm
            + "</td><td><input class='btn btn-danger deleteRowExstIns' type='button' value='Delete'></td></tr>";


        $("#tblExstInsDetail tbody").append(markup);
        $("#tblExstInsDetail").show();

        //assigning count of rows in table to hidden field
        var rowCount = $('#tblExstInsDetail tbody tr').length;
        $("#tblExstInsRowCount").val(parseInt(rowCount));

        //Empty the text fields
        $("#txtLAPolicyNumber").val("");
        $("#ddlLAexInsurance").val("");
        $("#ddlLAYearIssue").val("");
        $("#txtLAPremium").val("");
        $("#ddlLAStatusPolicy").val("");
        $("#txtLASumAssured").val("");
        $("#ddlLAAcceptanceTerm").val("");
    }

    
});
$(document).on('click', '.deleteRowExstIns', function () {

    $(this).parents("tr").remove();


    var rowCount = $('#tblExstInsDetail tbody tr').length;
    $("#tblExstInsRowCount").val(parseInt(rowCount));

    if (parseInt(rowCount) == 0) {
        $("#tblExstInsDetail").hide();
    }
});



$("#btnAddFamInsMember").click(function () {
    var relation = "";
    var occupation = "";
    var totalSumAssured = "";
    var income = "";

    relationId = $("#ddlLAFamIncmRel option:selected").val();
    relation = $("#ddlLAFamIncmRel option:selected").text();
    occupation = $("#txtLAFamIncmOccupation").val();
    totalSumAssured = $("#txtLAFamIncmTotalSum").val();
    income = $("#txtLAFamIncmIncome").val();

    if (relation == "" || occupation == "" || totalSumAssured == "" || income == "") {
        alert("Please enter the family income & insurance details properly.");
    }
    else {
        var markup = "<tr><td style='display: none'>" + relationId + "</td><td>" + relation + "</td><td>" + occupation + "</td><td>" + totalSumAssured + "</td><td>" + income
            + "</td><td><input class='btn btn-danger deleteRowFamInc' type='button' value='Delete'></td></tr>";


        $("#tblFamInsDetail tbody").append(markup);
        $("#tblFamInsDetail").show();

        //assigning count of rows in table to hidden field
        var rowCount = $('#tblFamInsDetail tbody tr').length;
        $("#tblFamInsRowCount").val(parseInt(rowCount));

        var relationVal = $("#ddlLAFamIncmRel option:selected").val();
        if (relationVal == "1" || relationVal == "2" || relationVal == "3") {
            $("#tblFamInsDetail select option[value*='" + relationVal + "']").prop('disabled', true);
        }

        //Empty the text fields
        $("#ddlLAFamIncmRel").val("");
        $("#txtLAFamIncmOccupation").val("");
        $("#txtLAFamIncmTotalSum").val("");
        $("#txtLAFamIncmIncome").val("");
    }

});

//function for removing the rows from medical questionaries table
$(document).on('click', '.deleteRowFamInc', function () {

    $(this).parents("tr").remove();
    var removedMemberId = $(this).closest('tr').find('td:eq(0)').text();

    if (removedMemberId == "1" || removedMemberId == "2" || removedMemberId == "3") {
        $("select option[value*='" + removedMemberId + "']").prop('disabled', false);
    }

    var rowCount = $('#tblFamInsDetail tbody tr').length;
    $("#tblFamInsRowCount").val(parseInt(rowCount));

    if (parseInt(rowCount) == 0) {
        $("#tblFamInsDetail").hide();
    }
});


$("#btnBackQues2").click(function () {
    $("#divQues2").css("display", "none");
    $("#divQues1").css("display", "block");
});

$("#btnBackQues1").click(function () {
    $("#divQues1").css("display", "none");
    $("#divheightDetails").css("display", "block");
});


$("input[name='rdbLADiscloseInsur1']").click(function () {
    if ($(this).val() == "yes") {
        rdbLALifeInsurer = "Y";
        $("#divExistinginsurance").css("display", "block");
    }
    else {
        rdbLALifeInsurer = "N";
        $("#divExistinginsurance").css("display", "none");
    }

});


$("input[name='rdbLAPregnant']").click(function () {
            debugger
    if ($(this).val() == "yes") {

        $("#txtLANumWeeks").show();
        //$("#PregnantYes").show();
    }
    else {
        //$("#PregnantYes").hide();
        $("#txtLANumWeeks").hide();
    }

});

$("input[name='rdbLAPregAbnorm']").click(function () {
    if ($(this).val() == "yes") {
        $("#LAPregAbnormYes").css("display", "block");
    }
    else {
        $("#LAPregAbnormYes").css("display", "none");
    }

});

$("input[name='rdbSpousePregnant']").click(function () {
    if ($(this).val() == "yes") {
        spousePregInd = "Y";
        /// $("#txtSpouseNumWeeks").show();
        //$("#SpouseYes").css("display", "block");
    }
    else {
        spousePregInd = "N";
        // $("#txtSpouseNumWeeks").hide();
        //$("#SpouseYes").css("display", "none");
    }

});

$("input[name='rdbSpousePregAbnorm']").click(function () {
    if ($(this).val() == "yes") {
        $("#SpousePregAbnormYes").css("display", "block");
    }
    else {
        $("#SpousePregAbnormYes").css("display", "none");
    }

});

$("#btnFillQues2").click(function () {
    $("#rdbLADoctorY").prop("checked", true);
    $("#rdbLADoctorN").prop("checked", false);


    $("#txtLADoctorDetails").val("Consult doctor details");
    $("#txtLADoctorDetails").css("display", "block");


    $("#rdbLATestsY").prop("checked", true);
    $("#rdbLATestsN").prop("checked", false);


    $("#txtLATestsDetails").val("Any test done details");
    $("#txtLATestsDetails").css("display", "block");





    $("#rdbLAAdmittedY").prop("checked", true);
    $("#rdbLAAdmittedN").prop("checked", false);


    $("#txtLAAdmittedDetails").val("Hospital admitted details");
    $("#txtLAAdmittedDetails").css("display", "block");

    //2.medication
    $("#rdbLAMedicationY").prop("checked", true);
    $("#rdbLAMedicationN").prop("checked", false);


    $("#txtLAMedicationDetails").val("Medication details");
    $("#txtLAMedicationDetails").css("display", "block");


    //3a.Heart disorder details.    
    $("#rdbLAHeartY").prop("checked", true);
    $("#rdbLAHeartN").prop("checked", false);


    $("#txtLAHeartDetails").val("Heart disorder details");
    $("#txtLAHeartDetails").css("display", "block");


    //3b.Blood pressure
    $("#rdbLABpY").prop("checked", true);
    $("#rdbLABpN").prop("checked", false);


    $("#txtLABPDetails").val("Blood pressure details");
    $("#txtLABPDetails").css("display", "block");


    //3c.any other
    $("#rdbLALungY").prop("checked", true);
    $("#rdbLALungN").prop("checked", false);


    $("#txtLALungDetails").val("Lung Disease details");
    $("#txtLALungDetails").css("display", "block");


    //3d.diabetes
    $("#rdbLADiabetesY").prop("checked", true);
    $("#rdbLADiabetesN").prop("checked", false);


    $("#txtLADiabetesDetails").val("Diabetes details");
    $("#txtLADiabetesDetails").css("display", "block");


    //3e.disorder kidney
    $("#rdbLADiseaseY").prop("checked", true);
    $("#rdbLADiseaseN").prop("checked", false);


    $("#txtLADiseaseDetails").val("Kidney details");
    $("#txtLADiseaseDetails").css("display", "block");


    //3f.disorder digestive 
    $("#rdbLADigestiveY").prop("checked", true);
    $("#rdbLADigestiveN").prop("checked", false);



    $("#txtLADigestiveDetails").val("Digestive disease");
    $("#txtLADigestiveDetails").css("display", "block");


    //3g.Cancer 
    $("#rdbLACancerY").prop("checked", true);
    $("#rdbLACancerN").prop("checked", false);



    $("#txtLACancerDetails").val("Cancer details");
    $("#txtLACancerDetails").css("display", "block");


    //3h.tropical 
    $("#rdbLATropicalY").prop("checked", true);
    $("#rdbLATropicalN").prop("checked", false);



    $("#txtLATropicalDetails").val("Tropical details");
    $("#txtLATropicalDetails").css("display", "block");

    //3i.thyroid 
    $("#rdbLAThyroidY").prop("checked", true);
    $("#rdbLAThyroidN").prop("checked", false);
    $("#rdbSpouseThyroidY").prop("checked", false);
    $("#rdbSpouseThyroidN").prop("checked", true);

    $("#txtLAThyroidDetails").val("Thyroid details");
    $("#txtLAThyroidDetails").css("display", "block");


    //3j.Blood 
    $("#rdbLABloodY").prop("checked", true);
    $("#rdbLABloodN").prop("checked", false);



    $("#txtLABloodDetails").val("Blood Anemia details");
    $("#txtLABloodDetails").css("display", "block");

    //3k.Neoro 
    $("#rdbLANeuroY").prop("checked", true);
    $("#rdbLANeuroN").prop("checked", false);
    $("#rdbSpouseNeuroY").prop("checked", false);
    $("#rdbSpouseNeuroN").prop("checked", true);

    $("#txtLANeuroDetails").val("neurological disorder ");
    $("#txtLANeuroDetails").css("display", "block");

    //3m.Disease of muscle bones 
    $("#rdbLADisorderY").prop("checked", true);
    $("#rdbLADisorderN").prop("checked", false);



    $("#txtLADisorderDetails").val("Muscle bones disease ");
    $("#txtLADisorderDetails").css("display", "block");

    //3n.Aids details
    $("#rdbLAAidsY").prop("checked", true);
    $("#rdbLAAidsN").prop("checked", false);





    $("#txtLAAidsDetails").val("Aids details");
    $("#txtLAAidsDetails").css("display", "block");

    //3o.Excessive alchohol details
    $("#rdbLAAlcoholicY").prop("checked", true);
    $("#rdbLAAlcoholicN").prop("checked", false);
    $("#rdbSpouseAlcoholicY").prop("checked", false);
    $("#rdbSpouseAlcoholicN").prop("checked", true);

    $("#txtLAAlcoholicDetails").val("Excessive alchohol ");
    $("#txtLAAlcoholicDetails").css("display", "block");


    //3p.Any other illness,disorder details
    $("#rdbLAOtherillY").prop("checked", true);
    $("#rdbLAOtherillN").prop("checked", false);




    $("#txtLAOtherillDetails").val("Any other illness");
    $("#txtLAOtherillDetails").css("display", "block");


    //4.Any Other deformity
    $("#rdbLADeformityY").prop("checked", true);
    $("#rdbLADeformityN").prop("checked", false);
    $("#rdbSpouseDeformityY").prop("checked", false);
    $("#rdbSpouseDeformityN").prop("checked", true);

    $("#txtLADeformityDetails").val("Any deformity");
    $("#txtLADeformityDetails").css("display", "block");


    //5.Any Symtoms deformity
    $("#rdbLASymptomsY").prop("checked", true);
    $("#rdbLASymptomsN").prop("checked", false);



    $("#txtLASymptomsDetails").val("Any Symtoms");
    $("#txtLASymptomsDetails").css("display", "block");


    if ($("#islasame").val() == "Y") {
        if ($("#ddlLATitle").val() == "2") {

            $(".divFemaleQues").css("display", "block");
            $(".LAfemaleQues2").attr("disabled", false);

            $("#rdbLAPregnantY").prop("checked", false);
            $("#rdbLAPregnantN").prop("checked", true);

            $("#rdbLAPregAbnormY").prop("checked", false);
            $("#rdbLAPregAbnormN").prop("checked", true);
            //
        }
    }
    if ($("#islasame").val() == "N") {
        if ($("#ddlLATitle").val() == "1") {
            $(".divFemaleQues").css("display", "block");
            $(".LAfemaleQues2").attr("disabled", true);
            $(".SpousefemaleQues2").attr("disabled", false);

            $("#rdbSpousePregnantY").prop("checked", false);
            $("#rdbSpousePregnantN").prop("checked", true);

            $("#rdbSpousePregAbnormY").prop("checked", false);
            $("#rdbSpousePregAbnormN").prop("checked", true);
        }

        else if ($("#ddlLATitle").val() == "2") {
            $(".divFemaleQues").css("display", "block");
            $(".LAfemaleQues2").attr("disabled", false);
            $(".SpousefemaleQues2").attr("disabled", true);

            $("#rdbLAPregnantY").prop("checked", false);
            $("#rdbLAPregnantN").prop("checked", true);

            $("#rdbLAPregAbnormY").prop("checked", false);
            $("#rdbLAPregAbnormN").prop("checked", true);
        }


        $("#rdbSpouseDoctorY").prop("checked", false);
        $("#rdbSpouseDoctorN").prop("checked", true);

        $("#rdbSpouseTestsY").prop("checked", false);
        $("#rdbSpouseTestsN").prop("checked", true);

        $("#rdbSpouseAdmittedY").prop("checked", false);
        $("#rdbSpouseAdmittedN").prop("checked", true);

        $("#rdbSpouseMedicationY").prop("checked", false);
        $("#rdbSpouseMedicationN").prop("checked", true);

        $("#rdbSpouseHeartY").prop("checked", false);
        $("#rdbSpouseHeartN").prop("checked", true);

        $("#rdbSpouseBpY").prop("checked", false);
        $("#rdbSpouseBpN").prop("checked", true);

        $("#rdbSpouseLungY").prop("checked", false);
        $("#rdbSpouseLungN").prop("checked", true);

        $("#rdbSpouseDiabetesY").prop("checked", false);
        $("#rdbSpouseDiabetesN").prop("checked", true);

        $("#rdbSpouseDiseaseY").prop("checked", false);
        $("#rdbSpouseDiseaseN").prop("checked", true);
        $("#rdbSpouseDigestiveY").prop("checked", false);
        $("#rdbSpouseDigestiveN").prop("checked", true);
        $("#rdbSpouseCancerY").prop("checked", false);
        $("#rdbSpouseCancerN").prop("checked", true);
        $("#rdbSpouseTropicalY").prop("checked", false);
        $("#rdbSpouseTropicalN").prop("checked", true);
        $("#rdbSpouseBloodY").prop("checked", false);
        $("#rdbSpouseBloodN").prop("checked", true);
        $("#rdbSpouseDisorderY").prop("checked", false);
        $("#rdbSpouseDisorderN").prop("checked", true);
        $("#rdbSpouseAidsY").prop("checked", false);
        $("#rdbSpouseAidsN").prop("checked", true);
        $("#rdbSpouseOtherillY").prop("checked", false);
        $("#rdbSpouseOtherillN").prop("checked", true);
        $("#rdbSpouseSymptomsY").prop("checked", false);
        $("#rdbSpouseSymptomsN").prop("checked", true);

    }

    //Hospitalized   
    $("#divHospitalized").css("display", "block");
    $("#rdbLAHospitalizedY").prop("checked", true);
    $("#rdbLAHospitalizedN").prop("checked", false);


    //  $("#txtLAHospitalizedDate").val("Hospitalized Date.");
    $("#txtLAHospitalizedDate").css("display", "block");

    $("#mediclrecoverdiv").css("display", "block");

    $("#rdbLAMediRecoverY").prop("checked", false);
    $("#rdbLAMediRecoverN").prop("checked", true);

    $("#txtLAMediRecoverDetail").val("fully recovered medication");
    $("#txtLAMediRecoverDetail").css("display", "block");


    $("html, body").animate({ scrollTop: $(document).height() }, 200);
});

$(".AnsYques2").click(function () {
    $("#divHospitalized").css("display", "block");
});

$(".AnsNques2").click(function () {
    $("#divHospitalized").css("display", "none");
});


$("input[name='rdbLAHospitalized']").click(function () {

    if ($(this).val() == "yes") {
        $("#txtLAHospitalizedDate").val("");
        $("#txtLAHospitalizedDate").css("display", "block");
        $("#txtLAMediRecoverDetail").val("");

        $("#mediclrecoverdiv").css("display", "block");
    }
    else {
        $("#txtLAHospitalizedDate").val("");
        $("#txtLAHospitalizedDate").css("display", "none");
        $("#txtLAMediRecoverDetail").val("");
        $("#mediclrecoverdiv").css("display", "none");
    }
});


$("input[name='rdbLAMediRecover']").click(function () {
    if ($(this).val() == "no") {
        $("#txtLAMediRecoverDetail").css("display", "block");
    }
    else {
        $("#txtLAMediRecoverDetail").css("display", "none");
    }
});


$("#rdbLAHospitalizedY").click(function () {
    $("#txtLAHospitalizedDetails").css("display", "block");
    $("#mediclrecoverdiv").css("display", "block");


});

$("input[name='rdbLALung']").click(function () {

    if ($(this).val() == "yes") {
        $("#txtLALungDetails").css("display", "block");
    }
    else {
        $("#txtLALungDetails").css("display", "none");
    }

});

$("input[name='rdbLABp']").click(function () {
    if ($(this).val() == "yes") {
        $("#txtLABPDetails").css("display", "block");
    }
    else {
        $("#txtLABPDetails").css("display", "none");
    }

});


$("#btnFillQues1").click(function () {
    $("#rdbLATravelOutsideIndiaY").prop("checked", false);
    $("#rdbLATravelOutsideIndiaN").prop("checked", true);


    $("#rdbLAPilotY").prop("checked", false);
    $("#rdbLAPilotN").prop("checked", true);


    $('#chkLAParagliding').prop('checked', false);
    $('#chkLAMountaineering').prop('checked', false);
    $('#chkLARacing').prop('checked', false);
    $('#chkLAOtherActivies').prop('checked', false);

    $("#chkLASkyDive").attr("disabled", true);
    $("#chkLAParagliding").attr("disabled", true);
    $("#chkLAMountaineering").attr("disabled", true);
    $("#chkLARacing").attr("disabled", true);
    $("#chkLAOtherActivies").attr("disabled", true);

    $('#chkLANone').prop('checked', true);




    $("#rdbLADrugsY").prop("checked", true);
    $("#rdbLADrugsN").prop("checked", false);


    $("#txtLADrugDetail").val("Some Drug and Narcotics");
    $("#txtLADrugDetail").css("display", "block");

    $("#rdbLAAlcoholY").prop("checked", true);
    $("#rdbLAAlcoholN").prop("checked", false);


    $("#txtLABeer").val("2");
    $("#txtLAHardLiquor").val("3");
    $("#txtLAWine").val("4");

    $("#txtLABeer").css("display", "block");
    $("#txtLAHardLiquor").css("display", "block");
    $("#txtLAWine").css("display", "block");


    $("#rdbLASmokerY").prop("checked", true);
    $("#rdbLASmokerN").prop("checked", false);


    $("#txtLACigar").val("5");
    $("#txtLABidi").val("6");
    $("#txtLAgutka").val("7");
    $("#txtLAPaan").val("8");

    $("#txtLACigar").css("display", "block");
    $("#txtLABidi").css("display", "block");
    $("#txtLAgutka").css("display", "block");
    $("#txtLAPaan").css("display", "block");


    $("#rdbLAStopTabaccoY").prop("checked", true);
    $("#rdbLAStopTabaccoN").prop("checked", false);


    $("#txtLAStopTobaccoDuration").val("7");
    $("#txtLAStopTobaccoReason").val("8");

    $("#txtLAStopTobaccoDuration").val("3");
    $("#txtLAStopTobaccoReason").val("stopping tobacco");

    $("#txtLAStopTobaccoDuration").css("display", "block");
    $("#txtLAStopTobaccoReason").css("display", "block");


    if ($("#islasame").val() == "N") {
        $("#rdbSpouseTravelOutsideIndiaY").prop("checked", false);
        $("#rdbSpouseTravelOutsideIndiaN").prop("checked", true);
        $("#rdbSpousePilotY").prop("checked", false);
        $("#rdbSpousePilotN").prop("checked", true);
        $("#rdbSpouseDrugsY").prop("checked", false);
        $("#rdbSpouseDrugsN").prop("checked", true);
        $("#rdbSpouseAlcoholY").prop("checked", false);
        $("#rdbSpouseAlcoholN").prop("checked", true);

        $("#rdbSpouseStopTabaccoY").prop("checked", false);
        $("#rdbSpouseStopTabaccoN").prop("checked", true);

        $("#rdbSpouseSmokerY").prop("checked", false);
        $("#rdbSpouseSmokerN").prop("checked", true);

        $('#chkSpouseSkyDive').prop('checked', false);
        $('#chkSpouseParagliding').prop('checked', false);
        $('#chkSpouseMountaineering').prop('checked', false);
        $('#chkSpouseRacing').prop('checked', false);
        $('#chkSpouseOtherActivies').prop('checked', false);

        $("#chkSpouseSkyDive").attr("disabled", true);
        $("#chkSpouseParagliding").attr("disabled", true);
        $("#chkSpouseMountaineering").attr("disabled", true);
        $("#chkSpouseRacing").attr("disabled", true);
        $("#chkSpouseOtherActivies").attr("disabled", true);

        $('#chkSpouseNone').prop('checked', true);
    }


    $("html, body").animate({ scrollTop: $(document).height() }, 200);

});


$("#btnFillheight").click(function () {
    $("#ddlLAHeight").val("5");
    $("#ddlLAInches").val("5");
    $("#txtweight").val("65");

    $("#rdbLAWeightVariationY").prop("checked", true);
    $("#rdbLAWeightVariationN").prop("checked", false);


    $("#ddlLAWeightVariation").val("6");
    $("#ddlLAWeightVariationReason").val("DIET");
    $("#weightchangediv").css("display", "block");

    //spouse
    if ($("#islasame").val() == "N") {
        $("#ddlSpouseHeight").val("5");
        $("#ddlSpouseInches").val("5");
        $("#txtSpouseWeight").val("65");

        $("#rdbSpouseWeightVariationY").prop("checked", true);
        $("#rdbSpouseWeightVariationN").prop("checked", false);


        $("#ddlSpouseWeightVariation").val("6");
        $("#ddlSpouseWeightVariationReason").val("DIET");
        $("#divSpouseweightchange").css("display", "block");

        $("#spouseHeightDetails").css("display", "block");
    }

    $("html, body").animate({ scrollTop: $(document).height() }, 200);

});


$("#btnFillEmployment").click(function () {

    //LA
   // $("#ddlLAEmployment").val("5");

    $("#divNameOfEmployer").show();
    $("#divLaDesignation").show();
    $("#divJobDesc").show();
    $("#divNatureOfBussiness").show();
    $("#divWorkExperienceYear").show();
    $("#divWorkExperienceMonth").show();
    $("#divAddressEmployer").show();
    $("#divOccupationIndType").show();
    $("#divNoOfEmployees").show();
    $("#divAnnualIncome").show();
    $("#divIncomeSource").show();

    //$("#txtnameofemployer").val("Edelweiss Tokio");
    //$("#txtladesignation").val("Software Developer");
    //$("#ddlLAJobNature").val("Office Work");
    //$("#txtnatureofbusiness").val("sample nature of buisness");
    //$("#ddlLAExpYears").val("2");
    //$("#ddlLAExpMonths").val("3");
    //$("#txtaddressofemployer").val("Kohinoor");
    //$("#ddlLAIndustryType").val("IT");
    //$("#ddlLANoofEmp").val("1000+");
    //$("#txtannualincome").val("800000");
    //$("#rdbLAIncmSrcY").prop("checked", false);
    //$("#rdbLAIncmSrcN").prop("checked", true);
    $("#divOtherIncome").show();

  //  $("#txtLAotherIncmSrc").val("Other Income details");

    if ($("#islasame").val() == "N") {
        //Spouse  
        $("#ddlSpouseEmployment").val("5");

        $("#divSpouseNameOfEmployer").show();
        $("#divSpouseDesignation").show();
        $("#divSpouseJobDesc").show();
        $("#divSpouseNatureOfBussiness").show();
        $("#divSpouseWorkExperienceYear").show();
        $("#divSpouseWorkExperienceMonth").show();
        $("#divSpouseAddressEmployer").show();
        $("#divSpouseOccupationIndType").show();
        $("#divSpouseNoOfEmployees").show();
        $("#divSpouseAnnualIncome").show();
        $("#divSpouseIncomeSource").show();

        $("#txtSpousenameofemployer").val("Neosoft");
        $("#txtSpousedesignation").val("Software tester");
        $("#ddlSpouseJobNature").val("Office Work");
        $("#txtSpousenatureofbusiness").val("spouse nature of buisness");
        $("#ddlSpouseExpYears").val("3");
        $("#ddlSpouseExpMonths").val("2");
        $("#txtSpouseaddressofemployer").val("Rabale");
        $("#ddlSpouseIndustryType").val("IT");
        $("#ddlSpouseNoofEmp").val("1000+");
        $("#txtSpouseannualincome").val("700000");
        //$("#rdbSpouseIncmSrcY").prop("checked", false);
        //$("#rdbSpouseIncmSrcN").prop("checked", true);
        $("#divSpouseOtherIncome").show();

        $("#txtSpouseotherIncmSrc").val("Spouse Other Income details");

        $("html, body").animate({ scrollTop: $(document).height() }, 200);
    }
});

$("#btnBackEmp").click(function () {
    $("#divEmployment").hide();
    $("#divPersonal").show();
});

$("#btnFillPersonal").click(function () {


    //life assured
    $("#txtpanno").val("aaapa1234a");
    $("#txtfathername").val("sample father name");
    $("#txtmothername").val("sample mother name");
    $("#txtadharno").val("444455556666");
    $("#ddlageproof").val("4");
    $("#ddlnatinality").val("1");

    $("#paddress1").val("pa1");
    $("#paddress2").val("pa2");
    $("#paddress3").val("pa3");
    $("#ppincode").val("411038");
    $("#pstate").val("Maharashtra");
    $("#pcity").val("Mumbai");

    $("#caddress1").val("ca1");
    $("#caddress2").val("ca2");
    $("#caddress3").val("ca3");
    $("#cpincode").val("411039");
    $("#cstate").val("Maharashtra");
    $("#ccity").val("Pune");

    $("#rdbLACorrAddrY").prop("checked", false);
    $("#rdbLACorrAddrN").prop("checked", true);
    $("#rdbLACurOrPerY").prop("checked", true);
    $("#rdbLACurOrPerN").prop("checked", false);

    $("#currentaddrsdiv").show();
    $("#divCurrOrPerLA").show();

    var emailId = $("#txtfirstname").val() + '.' + $("#txtlastname").val();

    $("#txtphoneresidental").val("9999999988");
    $("#txtphoneoffice").val("9999998888");
    $("#txtfacebookid").val(emailId + '@facebook.com');
    $("#txtlinkdinid").val(emailId + '@linkedin.com');
    $("#txtcorporateid").val(emailId + '@abc.com');
    $("#ddlLAEducation").val("1");
    $("#txtcollegename").val("sample college name");
    $("#txthighestedu").val("highest qualification details");


    //Spouse
    $("#txtSpousepanno").val("bbbap4321a");
    $("#txtSpousefathername").val("spouse father name");
    $("#txtSpousemothername").val("spouse mother name");
    $("#txtSpouseadharno").val("777788889999");
    $("#ddlSpouseageproof").val("4");
    $("#ddlSpousenatinality").val("1");

    $("#Spousepaddress1").val("pa1Spouse");
    $("#Spousepaddress2").val("pa2Spouse");
    $("#Spousepaddress3").val("pa3Spouse");
    $("#Spouseppincode").val("411039");
    $("#Spousepstate").val("Maharashtra");
    $("#Spousepcity").val("pune");

    $("rdbSpouseCorrAddrY").prop("checked", false);
    $("rdbSpouseCorrAddrN").prop("checked", true);

    $("#rdbSpouseCurOrPerY").prop("checked", false);
    $("#rdbSpouseCurOrPerN").prop("checked", true);

    $("#Spousecaddress1").val("ca1Spouse");
    $("#Spousecaddress2").val("ca2Spouse");
    $("#Spousecaddress3").val("ca3Spouse");
    $("#Spousecpincode").val("411039");
    $("#Spousecstate").val("Maharashtra");
    $("#Spouseccity").val("Pune");
    $("#Spousecurrentaddrsdiv").show();
    $("#divSpouseCorrAddress").show();

    var emailIdSpouse = $("#txtSpousefirstname").val() + '.' + $("#txtSpouselastname").val();
    $("#Spousetxtemailid").val(emailIdSpouse + "@gmail.com");
    $("#Spousetxtphonemobile").val("8888888888")
    $("#Spousetxtphoneresidental").val("8888888899");
    $("#Spousetxtphoneoffice").val("8888889999");
    $("#Spousetxtfacebookid").val(emailIdSpouse + '@facebook.com');
    $("#Spousetxtlinkdinid").val(emailIdSpouse + '@linkedin.com');
    $("#Spousetxtcorporateid").val(emailIdSpouse + '@abc.com');
    $("#ddlSpouseEducation").val("2");
    $("#txtcollegenameSpouse").val("sample college name");
    $("#txthighesteduSpouse").val("highest qualification details");


    $("html, body").animate({ scrollTop: $(document).height() }, 200);

});




function GetClientDetails() {

    //var tId = getUrlVars()["tId"];
    //var pNo = getUrlVars()["pNo"];
    //  document.getElementById("loader").style.display = "block";

    //var tId = localStorage.getItem('transactionId');
    //var pNo = localStorage.getItem('policyNo');

    //$("#hdnPolicyNo").val(pNo);
    //$("#hdnTransactionId").val(tId);
    pNo = $("#hdnPolicyNo").val();
    tId = $("#hdnTransactionId").val();

    LaPropSame = $("#isLaPropSame").val();
    if (LaPropSame == 'Y') {
        $("#divSpousePersonal").css("display:none");
        $("#divSpouseEmp").css("display:none");

    }
    else if (LaPropSame == "N") {
        //$("#spouseCliId").val(data.propCliId);
        $("#divSpousePersonal").show();
        $("#divSpouseEmp").show();
    }

    //$.ajax({
    //    url: uatIP + "/WhitelabelAPI/v2/GetClientDetails",
    //    //url: "http://localhost:19951/api/GetClientDetails",
    //    type: "GET",
    //    data: {
    //        transId: tId,
    //        policyNo: pNo
    //    },
    //    success: function (data) {

    //       // data.isLaPropSame = "N";
    //       // $("#islasame").val(data.isLaPropSame);
    //        $("#laCliId").val(data.laCliId);


    //        // document.getElementById("loader").style.display = "none";
    //        var laName = data.lafname + ' ' + data.laMidName + ' ' + data.lalName;
    //        var splitLaDOB = data.laDOB.split(' ');
    //        var splitLaDOB = splitLaDOB[0].split('/');
    //        var laDOB = splitLaDOB[0] + '/' + splitLaDOB[1] + '/' + splitLaDOB[2];


    //        // $("#ddlLATitle").val(data.laTitle);
    //        //  $("#txtfirstname").val(data.lafname);
    //        // $("#txtmiddlename").val(data.laMidName);
    //        // $("#txtlastname").val(data.lalName);
    //        $("#txtdob").val(laDOB);
    //        //if (data.laTitle == "1") {
    //        //    $("#ddlgender").val("Male");
    //        //}
    //        //if (data.laTitle == "2") {
    //        //    $("#ddlgender").val("Female");
    //        //}
    //        //$("#ddlMaritalstatus").val(data.laMarital);
    //        //$("#txtemailid").val(data.laEmail);
    //        $("#txtphonemobile").val(data.laMobile);

    //        data.isLaPropSame = $("#isLaPropSame").val();
    //        if (data.isLaPropSame == 'Y') {
    //            $("#divSpousePersonal").css("display:none");

    //        }
    //        else if (data.isLaPropSame == "N") {
    //            $("#spouseCliId").val(data.propCliId);
    //           // var splitPropDOB = data.propDOB.split(' ');
    //            //var splitPropDOB = splitPropDOB[0].split('/');
    //           // var propDOB = splitPropDOB[0] + "/" + splitPropDOB[1] + "/" + splitPropDOB[2];
    //            //$("#ddlSpouseTitle").val(data.propTitle);
    //            //$("#txtSpousefirstname").val(data.propfname);
    //            //$("#txtSpousemiddlename").val(data.propMidName);
    //            //$("#txtSpouselastname").val(data.proplName);
    //            //$("#txtSpousedob").val(propDOB);
    //            //$("#ddlSpouseMaritalstatus").val(data.propMarital);



    //            //if (data.propTitle == "1") {
    //            //    $("#ddlSpousegender").val("Male");
    //            //}
    //            //if (data.propTitle == "2") {
    //            //    $("#ddlSpousegender").val("Female");
    //            //}

    //            $("#divSpousePersonal").show();
    //        }




    //        //Policy details
    //        $("#lblinvestmentamt").text(data.premiumAmt);
    //        $("#lblbasecover").text(data.BaseCover);
    //        $("#lblmodeofpayment").text(data.ModeOfPayment);
    //        $("#lblPPT").text(data.PolicyPremiumTerm);
    //        $("#lbltotalpremiumamt").text(data.premiumAmt);

    //        $("#linkBIpdfFinal").attr("href", localStorage.getItem('linkBIpdf'));
    //    },
    //    error: function (xhr) {
    //      //  alert('fail to load client details.');
    //        //document.getElementById("loader").style.display = "none";
    //    }
    //});

}


$('#chkLANone').change(function () {
    if ($(this).prop("checked") == true) {


        $('#chkLASkyDive').prop('checked', false);
        $('#chkLAParagliding').prop('checked', false);
        $('#chkLAMountaineering').prop('checked', false);
        $('#chkLARacing').prop('checked', false);
        $('#chkLAOtherActivies').prop('checked', false);

        $("#chkLASkyDive").attr("disabled", true);
        $("#chkLAParagliding").attr("disabled", true);
        $("#chkLAMountaineering").attr("disabled", true);
        $("#chkLARacing").attr("disabled", true);
        $("#chkLAOtherActivies").attr("disabled", true);
        $("#divtxtLAOtherActivities").hide();

    }
    else if ($(this).prop("checked") == false) {
        $("#chkLASkyDive").attr("disabled", false);
        $("#chkLAParagliding").attr("disabled", false);
        $("#chkLAMountaineering").attr("disabled", false);
        $("#chkLARacing").attr("disabled", false);
        $("#chkLAOtherActivies").attr("disabled", false);

    }
});

$('#chkSpouseNone').change(function () {
    if ($(this).prop("checked") == true) {

        $('#chkSpouseSkyDive').prop('checked', false);
        $('#chkSpouseParagliding').prop('checked', false);
        $('#chkSpouseMountaineering').prop('checked', false);
        $('#chkSpouseRacing').prop('checked', false);
        $('#chkSpouseOtherActivies').prop('checked', false);

        $("#chkSpouseSkyDive").attr("disabled", true);
        $("#chkSpouseParagliding").attr("disabled", true);
        $("#chkSpouseMountaineering").attr("disabled", true);
        $("#chkSpouseRacing").attr("disabled", true);
        $("#chkSpouseOtherActivies").attr("disabled", true);

    }
    else if ($(this).prop("checked") == false) {
        $("#chkSpouseSkyDive").attr("disabled", false);
        $("#chkSpouseParagliding").attr("disabled", false);
        $("#chkSpouseMountaineering").attr("disabled", false);
        $("#chkSpouseRacing").attr("disabled", false);
        $("#chkSpouseOtherActivies").attr("disabled", false);

    }
});




//$("#btnlifetoinsured1").click(function () {

//    PrepareProposalData();
//});






//For tab
function openTab(evt, tabName) {

    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace("active", "");
    }
    document.getElementById(tabName).style.display = "block";
    $("#" + tabName + "Tab").addClass("active");
    $('#' + tabName).className += "active";
    // $('#' + tabName).className += " Active";
    $(".tablinks").className += "active";
    // $(".tablinks").addClass("Active");

};

//Get QueryString value
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

//Enabling and disabling the Proposer div on checkbox for is la proposer same.
$('#isLaPropSame').change(function () {
    if ($(this).is(":checked")) {
        //$("#propbox").css("display", "block");
        $(".propBoxes").fadeOut(300);
    } else {
        // $("#propbox").css("display", "none");
        $(".propBoxes").fadeIn(300);
    }
});


//Employment change function
$('#ddlLAEmployment').on('change', function () {
    if (this.value == "5") //self employed(business)
    {
        $('#divnatureofbussiness').css({ 'display': 'block' });
        $('.hide1').css({ 'display': 'block' });
    }
    else if (this.value == "2" || this.value == "6" || this.value == "3") {
        $('.hide1').css({ 'display': 'none' });
        $('#divnatureofbussiness').css({ 'display': 'none' });
    }
    else {
        $('#divnatureofbussiness').css({ 'display': 'none' });
        $('.hide1').css({ 'display': 'block' });

    }

    if ($('input:radio[name=rdbLAIncmSrc]:checked').val() == "yes") {
        $("#divOtherIncome").hide();
    } else {
        $("#divOtherIncome").show();
    }


});

//PersonaDetails Continue Button
$("#btnemplomentdetailsconti").click(function () {
    var valid = true;//PersonalDetailsValid();

    if (valid) {
        $('#CustomerDetails').css({ 'display': 'none' });
        $('#EmploymentDetails').css({ 'display': 'block' });
        $('#Nomineedetails').css({ 'display': 'none' });
        $('#otherdetails').css({ 'display': 'none' });

    }
    else {
        $('#CustomerDetails').css({ 'display': 'block' });
        $('#EmploymentDetails').css({ 'display': 'none' });
        $('#Nomineedetails').css({ 'display': 'none' });
        $('#otherdetails').css({ 'display': 'none' });
    }

});

//Fill default nominee details
$("#btnFillNominee").click(function () {
    var isLaPropSame = localStorage.getItem('isLaPropSame');
    // if (isLaPropSame == "Y") {
    $("#ddlPropNoOfNominees").val("1");

    $("#txtNomineeName1").val("Nominee Name1");
    $("#txtNomineeDOB1").val("06/01/2017");
    $("#ddlNomRelation1").val("5");
    $("#txtNomineeAllocation1").val("100");
    $("#txtNomineeAllocation1").removeAttr("disabled", "disabled");
    $("#txtAppointeeName1").val("Appointee Name1");
    $("#txtAppointeeDOB1").val("06/01/1992");
    $("#txtAppointeeGender1").val("1");
    $("#txtAppointeeNomRelation1").val("3");


    //$("#txtNomineeName2").val("Nominee Name2");
    //$("#txtNomineeDOB2").val("09/05/2015");
    //$("#ddlNomRelation2").val("7");
    //$("#txtNomineeAllocation2").val("35");
    //$("#txtAppointeeName2").val("Appointee Name2");
    //$("#txtAppointeeDOB2").val("09/05/1993");
    //$("#txtAppointeeGender2").val("2");
    //$("#txtAppointeeNomRelation2").val("4");

    //$("#txtNomineeName3").val("Nominee Name3");
    //$("#txtNomineeDOB3").val("09/11/2014");
    //$("#ddlNomRelation3").val("4");
    //$("#txtNomineeAllocation3").val("30");
    //$("#txtAppointeeName3").val("Appointee Name3");
    //$("#txtAppointeeDOB3").val("09/11/1994");
    //$("#txtAppointeeGender3").val("1");
    //$("#txtAppointeeNomRelation3").val("1");


    $("#firstNominee").show();
    //$("#secondNominee").show();
    //$("#thirdNominee").show();
    $("#divAppointee1").show();
    //$("#divAppointee2").show();
    //$("#divAppointee3").show();
    // }

    $("html, body").animate({ scrollTop: $(document).height() }, 200);
});

$("#btnBackNominee").click(function () {

    $("#divNominee").css("display", "none");

    $("#divEmployment").css("display", "block");

    //var isLaPropSame = localStorage.getItem('isLaPropSame');
    //if (isLaPropSame == "Y") {
    //    $("#divLAemp").hide();
    //    $("#divPropemp").show();
    //}
    //else if (isLaPropSame == "N") {
    //    $("#divLAemp").show();
    //    $("#divPropemp").show();
    //}
});




//$("#btnnomineecontinue").click(function () {

//    $('#CustomerDetails').css({ 'display': 'none' });
//    $('#EmploymentDetails').css({ 'display': 'none' });
//    $('#Nomineedetails').css({ 'display': 'block' });
//    $('#otherdetails').css({ 'display': 'none' });
//});

$("#btnotherdetailscontinue").click(function () {

    $('#CustomerDetails').css({ 'display': 'none' });
    $('#EmploymentDetails').css({ 'display': 'none' });
    $('#Nomineedetails').css({ 'display': 'none' });
    $('#otherdetails').css({ 'display': 'block' });
    $('#healthdetailsdiv').css({ 'display': 'none' });
});

$("#btnhealthdetailscontinue").click(function () {

    $('#CustomerDetails').css({ 'display': 'none' });
    $('#EmploymentDetails').css({ 'display': 'none' });
    $('#Nomineedetails').css({ 'display': 'none' });
    $('#otherdetails').css({ 'display': 'none' });
    $('#healthdetailsdiv').css({ 'display': 'block' });
});


$("#btnhealthconti").click(function () {

    $('#CustomerDetails').css({ 'display': 'none' });
    $('#EmploymentDetails').css({ 'display': 'none' });
    $('#Nomineedetails').css({ 'display': 'none' });
    $('#otherdetails').css({ 'display': 'none' });
    $('#healthdetailsdiv').css({ 'display': 'none' });
    $('#lifetoinsured1').css({ 'display': 'block' });
});

$("#btnlifetoinsured1").click(function () {

    $('#CustomerDetails').css({ 'display': 'none' });
    $('#EmploymentDetails').css({ 'display': 'none' });
    $('#Nomineedetails').css({ 'display': 'none' });
    $('#otherdetails').css({ 'display': 'none' });
    $('#healthdetailsdiv').css({ 'display': 'none' });
    $('#lifetoinsured1').css({ 'display': 'none' });
    $('#lifetoinsured2div').css({ 'display': 'block' });
});


$("#btnlifetoinsured2").click(function () {

    $('#CustomerDetails').css({ 'display': 'none' });
    $('#EmploymentDetails').css({ 'display': 'none' });
    $('#Nomineedetails').css({ 'display': 'none' });
    $('#otherdetails').css({ 'display': 'none' });
    $('#healthdetailsdiv').css({ 'display': 'none' });
    $('#lifetoinsured1').css({ 'display': 'none' });
    $('#lifetoinsured2div').css({ 'display': 'none' });
    $('#lifetoinsured3div').css({ 'display': 'block' });
});

$("#btnlifetoinsured3").click(function () {

    $('#CustomerDetails').css({ 'display': 'none' });
    $('#EmploymentDetails').css({ 'display': 'none' });
    $('#Nomineedetails').css({ 'display': 'none' });
    $('#otherdetails').css({ 'display': 'none' });
    $('#healthdetailsdiv').css({ 'display': 'none' });
    $('#lifetoinsured1').css({ 'display': 'none' });
    $('#lifetoinsured2div').css({ 'display': 'none' });
    $('#lifetoinsured3div').css({ 'display': 'none' });
    $('#familydetails').css({ 'display': 'block' });
});

$("#btnfamiltdetailsconti").click(function () {

    $('#CustomerDetails').css({ 'display': 'none' });
    $('#EmploymentDetails').css({ 'display': 'none' });
    $('#Nomineedetails').css({ 'display': 'none' });
    $('#otherdetails').css({ 'display': 'none' });
    $('#healthdetailsdiv').css({ 'display': 'none' });
    $('#lifetoinsured1').css({ 'display': 'none' });
    $('#lifetoinsured2div').css({ 'display': 'none' });
    $('#lifetoinsured3div').css({ 'display': 'none' });
    $('#familydetails').css({ 'display': 'none' });
    $('#taxinfodiv').css({ 'display': 'block' });
});

$("#btntaxinfoconti").click(function () {

    $('#CustomerDetails').css({ 'display': 'none' });
    $('#EmploymentDetails').css({ 'display': 'none' });
    $('#Nomineedetails').css({ 'display': 'none' });
    $('#otherdetails').css({ 'display': 'none' });
    $('#healthdetailsdiv').css({ 'display': 'none' });
    $('#lifetoinsured1').css({ 'display': 'none' });
    $('#lifetoinsured2div').css({ 'display': 'none' });
    $('#lifetoinsured3div').css({ 'display': 'none' });
    $('#familydetails').css({ 'display': 'none' });
    $('#taxinfodiv').css({ 'display': 'none' });
    $('#Iaccdetails').css({ 'display': 'block' });
});


$("#btniaccdetilconti").click(function () {

    $('#CustomerDetails').css({ 'display': 'none' });
    $('#EmploymentDetails').css({ 'display': 'none' });
    $('#Nomineedetails').css({ 'display': 'none' });
    $('#otherdetails').css({ 'display': 'none' });
    $('#healthdetailsdiv').css({ 'display': 'none' });
    $('#lifetoinsured1').css({ 'display': 'none' });
    $('#lifetoinsured2div').css({ 'display': 'none' });
    $('#lifetoinsured3div').css({ 'display': 'none' });
    $('#familydetails').css({ 'display': 'none' });
    $('#taxinfodiv').css({ 'display': 'none' });
    $('#Iaccdetails').css({ 'display': 'none' });
    $('#bankdetailsdiv').css({ 'display': 'block' });
});


$("#btnbankdetailsconti").click(function () {

    $('#CustomerDetails').css({ 'display': 'none' });
    $('#EmploymentDetails').css({ 'display': 'none' });
    $('#Nomineedetails').css({ 'display': 'none' });
    $('#otherdetails').css({ 'display': 'none' });
    $('#healthdetailsdiv').css({ 'display': 'none' });
    $('#lifetoinsured1').css({ 'display': 'none' });
    $('#lifetoinsured2div').css({ 'display': 'none' });
    $('#lifetoinsured3div').css({ 'display': 'none' });
    $('#familydetails').css({ 'display': 'none' });
    $('#taxinfodiv').css({ 'display': 'none' });
    $('#Iaccdetails').css({ 'display': 'none' });
    $('#bankdetailsdiv').css({ 'display': 'none' });
    $('#thankyoudiv').css({ 'display': 'block' });
});

function PersonalDetailsValid() {

    var validform = $("#formcustomer").validate({
        rules: {
            txtfirstname: { required: true },
            txtlastname: { required: true },
            txtdob: { required: true },
            ddlgender: { required: true },
            ddlMaritalstatus: { required: true },
            txtpanno: { required: true },
            ddlnatinality: { required: true },

        },
        messages: {

        },
        errorClass: 'invalid',
        errorElement: 'div',
        invalidHandler: function (form, validator) {

            if (!validator.numberOfInvalids()) {
                return;
                $('html, body').animate({
                    scrollTop: $(validator.errorList[0].element).offset().top
                }, 200);

            }
        },
        errorPlacement: function (error, element) {
            $(element).parents('.form-group').addClass('has-error');
            error.insertAfter(element);
        }
    }).form();
    return validform;
};

$("#btnFillpep").click(function () {

    $("#rdbPropPepY").prop("checked", true);
    $("#rdbPropPepN").prop("checked", false);


    $("#divPolyExposed").show();
    $("#txtpolyexposed_q1").val("sample PEP details");
    $("#divTxtPolyExposed").css("display", "block");

    $("#rdbPropCriminalY").prop("checked", true);
    $("#rdbPropCriminalN").prop("checked", false);

    $("#txtcrimalproc_q2").val("sample criminal details");
    $("#divtxtcrimalproc_q2").css("display", "block");


    $("#ddlPropIdentityProof").val("3");
    $("#ddlPropResidenceProof").val("9");
    $("#ddlPropIncomeProof").val("10");

});

//Personal details Back Button
$("#btnbackcustomerdetails").click(function () {

    $('#CustomerDetails').css({ 'display': 'block' });
    $('#EmploymentDetails').css({ 'display': 'none' });
    $('#Nomineedetails').css({ 'display': 'none' });
    $('#otherdetails').css({ 'display': 'none' });
    $('#healthdetailsdiv').css({ 'display': 'none' });
    $('#lifetoinsured1').css({ 'display': 'none' });

});

$("#btnbackEmploymentDetails").click(function () {

    $('#CustomerDetails').css({ 'display': 'none' });
    $('#EmploymentDetails').css({ 'display': 'block' });
    $('#Nomineedetails').css({ 'display': 'none' });
    $('#otherdetails').css({ 'display': 'none' });
    $('#healthdetailsdiv').css({ 'display': 'none' });
    $('#lifetoinsured1').css({ 'display': 'none' });

});

$("#btnbackNomineedetails").click(function () {
    $('#CustomerDetails').css({ 'display': 'none' });
    $('#EmploymentDetails').css({ 'display': 'none' });
    $('#Nomineedetails').css({ 'display': 'block' });
    $('#otherdetails').css({ 'display': 'none' });
    $('#healthdetailsdiv').css({ 'display': 'none' });
    $('#lifetoinsured1').css({ 'display': 'none' });
});

//$("#btnbackotherdetails").click(function () {
//    $('#CustomerDetails').css({ 'display': 'none' });
//    $('#EmploymentDetails').css({ 'display': 'none' });
//    $('#Nomineedetails').css({ 'display': 'none' });
//    $('#otherdetails').css({ 'display': 'block' });
//    $('#healthdetailsdiv').css({ 'display': 'none' });
//    $('#lifetoinsured1').css({ 'display': 'none' });
//});

$("#btnBackOther").click(function () {
    $("#divOther").css("display", "none");

    $("#divNominee").css("display", "block");
});

$("#btnbackhealthdetails").click(function () {
    $('#CustomerDetails').css({ 'display': 'none' });
    $('#EmploymentDetails').css({ 'display': 'none' });
    $('#Nomineedetails').css({ 'display': 'none' });
    $('#otherdetails').css({ 'display': 'none' });
    $('#healthdetailsdiv').css({ 'display': 'block' });
    $('#lifetoinsured1').css({ 'display': 'none' });
});

$("#btnbacklifetoinsured1").click(function () {
    $('#CustomerDetails').css({ 'display': 'none' });
    $('#EmploymentDetails').css({ 'display': 'none' });
    $('#Nomineedetails').css({ 'display': 'none' });
    $('#otherdetails').css({ 'display': 'none' });
    $('#healthdetailsdiv').css({ 'display': 'none' });
    $('#lifetoinsured1').css({ 'display': 'block' });
    $('#lifetoinsured2div').css({ 'display': 'none' });
});

$("#btnbacklifetoinsured2").click(function () {
    $('#CustomerDetails').css({ 'display': 'none' });
    $('#EmploymentDetails').css({ 'display': 'none' });
    $('#Nomineedetails').css({ 'display': 'none' });
    $('#otherdetails').css({ 'display': 'none' });
    $('#healthdetailsdiv').css({ 'display': 'none' });
    $('#lifetoinsured1').css({ 'display': 'none' });
    $('#lifetoinsured2div').css({ 'display': 'block' });
    $('#lifetoinsured3div').css({ 'display': 'none' });
});

$("#btnbacklifetoinsured3").click(function () {
    $('#CustomerDetails').css({ 'display': 'none' });
    $('#EmploymentDetails').css({ 'display': 'none' });
    $('#Nomineedetails').css({ 'display': 'none' });
    $('#otherdetails').css({ 'display': 'none' });
    $('#healthdetailsdiv').css({ 'display': 'none' });
    $('#lifetoinsured1').css({ 'display': 'none' });
    $('#lifetoinsured2div').css({ 'display': 'none' });
    $('#lifetoinsured3div').css({ 'display': 'block' });
    $('#familydetails').css({ 'display': 'none' });
});

$("#btnbackfamily").click(function () {
    $('#CustomerDetails').css({ 'display': 'none' });
    $('#EmploymentDetails').css({ 'display': 'none' });
    $('#Nomineedetails').css({ 'display': 'none' });
    $('#otherdetails').css({ 'display': 'none' });
    $('#healthdetailsdiv').css({ 'display': 'none' });
    $('#lifetoinsured1').css({ 'display': 'none' });
    $('#lifetoinsured2div').css({ 'display': 'none' });
    $('#lifetoinsured3div').css({ 'display': 'none' });
    $('#familydetails').css({ 'display': 'block' });
    $('#taxinfodiv').css({ 'display': 'none' });
});

$("#btnbacktaxinfo").click(function () {
    $('#CustomerDetails').css({ 'display': 'none' });
    $('#EmploymentDetails').css({ 'display': 'none' });
    $('#Nomineedetails').css({ 'display': 'none' });
    $('#otherdetails').css({ 'display': 'none' });
    $('#healthdetailsdiv').css({ 'display': 'none' });
    $('#lifetoinsured1').css({ 'display': 'none' });
    $('#lifetoinsured2div').css({ 'display': 'none' });
    $('#lifetoinsured3div').css({ 'display': 'none' });
    $('#familydetails').css({ 'display': 'none' });
    $('#taxinfodiv').css({ 'display': 'block' });
    $('#Iaccdetails').css({ 'display': 'none' });
});

$("#btniaccdetail").click(function () {
    $('#CustomerDetails').css({ 'display': 'none' });
    $('#EmploymentDetails').css({ 'display': 'none' });
    $('#Nomineedetails').css({ 'display': 'none' });
    $('#otherdetails').css({ 'display': 'none' });
    $('#healthdetailsdiv').css({ 'display': 'none' });
    $('#lifetoinsured1').css({ 'display': 'none' });
    $('#lifetoinsured2div').css({ 'display': 'none' });
    $('#lifetoinsured3div').css({ 'display': 'none' });
    $('#familydetails').css({ 'display': 'none' });
    $('#taxinfodiv').css({ 'display': 'none' });
    $('#Iaccdetails').css({ 'display': 'block' });
    $('#bankdetailsdiv').css({ 'display': 'none' });
});

$("#btnbankdetailsdiv").click(function () {
    openTab(event, 'OtherDetails');

    $("#divQues3").css("display", "none");
    $("#divQues4").css("display", "none");
    $("#taxinfodiv").css("display", "none");
    $("#thankyoudiv").css("display", "none");
    $("#divEINSBank").css("display", "block");
});

//Scroll Finction


function Scroll() {

    if ($(document).height() < 600) {
        $('#scrollToBottom').css({ 'display': 'none' });
        $('#scrollToTop').css({ 'display': 'none' });
    }
    else {
        $('#scrollToBottom').css({ 'display': 'block' });
        $('#scrollToTop').css({ 'display': 'block' });
    }
};

$(function () {
    $('#scrollToBottom').bind("click", function () {

        $('html, body').animate({ scrollTop: $(document).height() }, 500);
        return false;
    });
    $('#scrollToTop').bind("click", function () {
        $('html, body').animate({ scrollTop: 0 }, 500);
        return false;
    });
});


//Date Selection
//txtladob, datepickerprop
var date_input = $('input[name="txtdob"]'); //our date input has the name "date"
var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
date_input.datepicker({

    format: 'mm/dd/yyyy',
    container: container,
    todayHighlight: true,
    autoclose: true,

}).on('change', function (e) {

    var currentDate = new Date();
    var selectedDate = new Date($(this).val());
    var age = currentDate.getFullYear() - selectedDate.getFullYear();
    var m = currentDate.getMonth() - selectedDate.getMonth();
    if (m < 0 || (m === 0 && currentDate.getDate() < selectedDate.getDate())) {
        age--;
    }
    $('#txtlaage').val(age);
});


var date_input = $('input[name="datepickerprop"]'); //our date input has the name "date"
var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
date_input.datepicker({
    format: 'mm/dd/yyyy',
    container: container,
    todayHighlight: true,
    autoclose: true,
}).on('change', function (e) {

    var currentDate = new Date();
    var selectedDate = new Date($(this).val());
    var age = currentDate.getFullYear() - selectedDate.getFullYear();
    var m = currentDate.getMonth() - selectedDate.getMonth();
    if (m < 0 || (m === 0 && currentDate.getDate() < selectedDate.getDate())) {
        age--;
    }
    $('#txtpropage').val(age);
});



//NOminee DOB 1
var date_input = $('input[name="txtnomineedob1"]'); //our date input has the name "date"
var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
date_input.datepicker({
    format: 'dd/mm/yyyy',
    container: container,
    todayHighlight: true,
    autoclose: true,
}).on('change', function (e) {

    var currentDate = new Date();
    var selectedDate = new Date($(this).val());

    var dob = $('#txtnomineedob1').val();
    var dob1 = dob.split('/');

    var age = currentDate.getFullYear() - dob1[2];

    if (age < 18) {
        $("#appt1").css({ 'display': 'block' });
    } else {
        $("#appt1").css({ 'display': 'none' });
    }
});

//NOminee DOB 2
var date_input = $('input[name="txtnomineedob2"]'); //our date input has the name "date"
var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
date_input.datepicker({
    format: 'dd/mm/yyyy',
    container: container,
    todayHighlight: true,
    autoclose: true,
}).on('change', function (e) {

    var currentDate = new Date();
    var selectedDate = new Date($(this).val());

    var dob = $('#txtnomineedob2').val();
    var dob1 = dob.split('/');

    var age = currentDate.getFullYear() - dob1[2];

    if (age < 18) {
        $("#appt2").css({ 'display': 'block' });
    } else {
        $("#appt2").css({ 'display': 'none' });
    }
});

//NOminee DOB 3
var date_input = $('input[name="txtnomineedob3"]'); //our date input has the name "date"
var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
date_input.datepicker({
    format: 'dd/mm/yyyy',
    container: container,
    todayHighlight: true,
    autoclose: true,
}).on('change', function (e) {

    var currentDate = new Date();
    var selectedDate = new Date($(this).val());

    var dob = $('#txtnomineedob3').val();
    var dob1 = dob.split('/');

    var age = currentDate.getFullYear() - dob1[2];

    if (age < 18) {
        $("#appt3").css({ 'display': 'block' });
    } else {
        $("#appt3").css({ 'display': 'none' });
    }
});

//NOminee DOB 3
//var date_input = $('input[name="txtLAHospitalizedDate"]'); //our date input has the name "date"
//var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
//date_input.datepicker({
//    format: 'dd/mm/yyyy',
//    container: container,
//    todayHighlight: true,
//    autoclose: true,
//}).on('change', function (e) {

//    var currentDate = new Date();
//    var selectedDate = new Date($(this).val());

//    var dob = $('#txtLAHospitalizedDate').val();
//    var dob1 = dob.split('/');

//    var age = currentDate.getFullYear() - dob1[2];
//});

$("#txtLAHospitalizedDate").datepicker({
    changeMonth: true,
    changeYear: true,
    yearRange: 'c-82:c',
    dateFormat: 'dd-mm-yy',
    minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
    maxDate: '',
    onSelect: function () { $('#dvContactDOB').removeClass('Error'); }
});


$("#txtLAInsDeclWhen").datepicker({
    changeMonth: true,
    changeYear: true,
    yearRange: 'c-82:c',
    dateFormat: 'dd-mm-yy',
    minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
    maxDate: '',
    onSelect: function () { $('#dvContactDOB').removeClass('Error'); }
});


$("#txtLAInsDate").datepicker({
    changeMonth: true,
    changeYear: true,
    yearRange: 'c-82:c',
    dateFormat: 'dd-mm-yy',
    minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
    maxDate: '',
    onSelect: function () { $('#dvContactDOB').removeClass('Error'); }
});


$("#txtLAQualification").change(function () {
    var selectedValue = $(this).val();
    if (selectedValue == 8) {
        $("#txtLAOtherQualification").attr("disabled", false);
    }
    else {
        $("#txtLAOtherQualification").attr("disabled", true);
    }
});

if ($("#chkLAPerAddrSameAsCurr")) {
    $("#chkLAPerAddrSameAsCurr").change(function () {
        if ($(this).prop("checked") == false) {
            $("#divLAPermanentAddress").show();
        }
        else {
            $("#divLAPermanentAddress").hide();
        }
    });
}


$("#txtPropQualification").change(function () {
    var selectedValue = $(this).val();
    if (selectedValue == 8) {
        $("#txtPropOtherQualification").attr("disabled", false);
    }
    else {
        $("#txtPropOtherQualification").attr("disabled", true);
    }
});

if ($("#chkPropPerAddrSameAsCurr")) {
    $("#chkPropPerAddrSameAsCurr").change(function () {
        if ($(this).prop("checked") == false) {
            $("#divPropPermanentAddress").show();
        }
        else {
            $("#divPropPermanentAddress").hide();
        }
    });
}

//Employment Details Script functions
$("#ddlLAEmpType").change(function () {
    var selectedValue = $(this).val();
    if (selectedValue == 9) {
        $("#txtLAOtherLAempType").attr("disabled", false);
    }
    else {
        $("#txtLAOtherLAempType").attr("disabled", true);
    }
});

$("#ddlPropEmpType").change(function () {
    var selectedValue = $(this).val();
    if (selectedValue == 9) {
        $("#txtPropOtherLAempType").attr("disabled", false);
    }
    else {
        $("#txtPropOtherLAempType").attr("disabled", true);
    }
});

//Other Details script functions
$("#isPEP").change(function () {
    if ($(this).is(":checked")) {
        $("#txtPEPDetails").attr("disabled", false);
    }
    else {
        $("#txtPEPDetails").attr("disabled", true);
    }
});

$(".isEia").click(function () {
    debugger
    var radioValue = $("input[name='rdBtnisEIA']:checked").val();
    if (radioValue == "Y") {
        $("#divEiaAccountNo").show();
        $("#divEpolicy").show();
        $("#divApplyYesNo").hide();
        isEIA = "Y";
    }
    else if (radioValue == "N") {
        $("#divEiaAccountNo").hide();
        $("#divEpolicy").hide();
        $("#divApplyYesNo").show();
        isEIA = "N";
        applyEIA = "Y";
        insRepository = "";
        RepositoryId = $("input[name='rdbLAapplyeiaCreation']:checked").val();

        switch (RepositoryId) {
            case 1:
                insRepository = "NSDL Data Management Limited";
                break;
            case 2:
                insRepository = "Karvy Insurance Repository Limited";
                break;
            case 3:
                insRepository = "CDSL Insurance Repository Limited";
                break;
            case 4:
                insRepository = "CAMS Repository Services Limited";
                break;
            default:
                insRepository = "";
        }
    }
});

$(".ApplyEIA").click(function () {
    var radioValue = $("input[name='rdBtnApplyEIA']:checked").val();
    if (radioValue == "Y") {
        $("#divEpolicy").show();
        $("#divInsRepName").show();
    }
    else if (radioValue == "N") {
        $("#divEpolicy").hide();
        $("#divInsRepName").hide();
    }
});







//---------Radio Button Functions--------
$("input[name='rdbPropPep']").click(function () {
    var value = $(this).val();
    if (value == 'yes') {
        $("#divTxtPolyExposed").css("display", "block");
    }
    else {
        $("#txtpolyexposed_q1").val("");
        $("#divTxtPolyExposed").css("display", "none");
    }
});

//$(#btnOther).click(function () {

//})
$("input[name$='rdbPropCriminal']").click(function () {
    var value = $(this).val();
    if (value == 'yes') {
        $("#divtxtcrimalproc_q2").css("display", "block");
    } else {
        $("#txtcrimalproc_q2").val("");
        $("#divtxtcrimalproc_q2").css("display", "none");
    }
});


$("input[name$='rdbLADrugs']").click(function () {
    var value = $(this).val();
    if (value == 'yes') {
        $("#txtLADrugDetail").show();
    } else {
        $("#txtLADrugDetail").hide();
    }
});

$("input[name$='rdbLADrugs']").click(function () {
    var value = $(this).val();
    if (value == 'yes') {
        $("#txtLADrugDetail").show();
    } else {
        $("#txtLADrugDetail").hide();
    }
});

$("input[name$='rdbLAAlcohol']").click(function () {
   
    var value = $(this).val();
    if (value == 'yes') {
        laAlchohol = "Y";
        $("#txtLABeer").show(); $("#txtLAHardLiquor").show(); $("#txtLAWine").show();
    } else {

        laAlchohol = "N";
        $("#txtLABeer").hide(); $("#txtLAHardLiquor").hide(); $("#txtLAWine").hide();
    }
});

$("input[name$='rdbLASmoker']").click(function () {
    var value = $(this).val();
    if (value == 'yes') {
        $("#txtLACigar").show(); $("#txtLABidi").show(); $("#txtLAgutka").show(); $("#txtLAPaan").show();
    } else {
        $("#txtLACigar").hide(); $("#txtLABidi").hide(); $("#txtLAgutka").hide(); $("#txtLAPaan").hide();
    }
});


$("input[name$='rdbLAStopTabacco']").click(function () {
    var value = $(this).val();
    if (value == 'yes') {
        $("#txtLAStopTobaccoDuration").show(); $("#txtLAStopTobaccoReason").show();
    } else {
        $("#txtLAStopTobaccoDuration").hide(); $("#txtLAStopTobaccoReason").hide();
    }
});


$("input[name$='rdbLADoctor']").click(function () {
    var value = $(this).val();
    if (value == 'yes') {
        $("#txtLADoctorDetails").show();
    } else {
        $("#txtLADoctorDetails").hide();
    }
});


$("input[name$='rdbLATests']").click(function () {
    var value = $(this).val();
    if (value == 'yes') {
        $("#txtLATestsDetails").show();
    } else {
        $("#txtLATestsDetails").hide();
    }
});


$("input[name$='rdbLAAdmitted']").click(function () {
    var value = $(this).val();
    if (value == 'yes') {
        $("#txtLAAdmittedDetails").show();
    } else {
        $("#txtLAAdmittedDetails").hide();
    }
});


$("input[name$='rdbLAMedication']").click(function () {
    var value = $(this).val();
    if (value == 'yes') {
        $("#txtLAMedicationDetails").show();
    } else {
        $("#txtLAMedicationDetails").hide();
    }
});


$("input[name$='rdbLAHeart']").click(function () {
    var value = $(this).val();
    if (value == 'yes') {
        $("#txtLAHeartDetails").show();
    } else {
        $("#txtLAHeartDetails").hide();
    }
});

$("input[name$='rdbLADiabetes']").click(function () {
    var value = $(this).val();
    if (value == 'yes') {
        $("#txtLADiabetesDetails").show();
    } else {
        $("#txtLADiabetesDetails").hide();
    }
});

$("input[name$='rdbLADisease']").click(function () {
    var value = $(this).val();
    if (value == 'yes') {
        $("#txtLADiseaseDetails").show();
    } else {
        $("#txtLADiseaseDetails").hide();
    }
});

$("input[name$='rdbLADigestive']").click(function () {
    var value = $(this).val();
    if (value == 'yes') {
        $("#txtLADigestiveDetails").show();
    } else {
        $("#txtLADigestiveDetails").hide();
    }
});


$("input[name$='rdbLACancer']").click(function () {
    var value = $(this).val();
    if (value == 'yes') {
        $("#txtLACancerDetails").show();
    } else {
        $("#txtLACancerDetails").hide();
    }
});



$("input[name$='rdbLATropical']").click(function () {
    var value = $(this).val();
    if (value == 'yes') {
        $("#txtLATropicalDetails").show();
    } else {
        $("#txtLATropicalDetails").hide();
    }
});

$("input[name$='rdbLAThyroid']").click(function () {
    var value = $(this).val();
    if (value == 'yes') {
        $("#txtLAThyroidDetails").show();
    } else {
        $("#txtLAThyroidDetails").hide();
    }
});


$("input[name$='rdbLABlood']").click(function () {
    var value = $(this).val();
    if (value == 'yes') {
        $("#txtLABloodDetails").show();
    } else {
        $("#txtLABloodDetails").hide();
    }
});


$("input[name$='rdbLANeuro']").click(function () {
    var value = $(this).val();
    if (value == 'yes') {
        $("#txtLANeuroDetails").show();
    } else {
        $("#txtLANeuroDetails").hide();
    }
});

$("input[name$='rdbLADisorder']").click(function () {
    var value = $(this).val();
    if (value == 'yes') {
        $("#txtLADisorderDetails").show();
    } else {
        $("#txtLADisorderDetails").hide();
    }
});

$("input[name$='rdbLAAids']").click(function () {
    var value = $(this).val();
    if (value == 'yes') {
        $("#txtLAAidsDetails").show();
    } else {
        $("#txtLAAidsDetails").hide();
    }
});


$("input[name$='rdbLAAlcoholic']").click(function () {
    var value = $(this).val();
    if (value == 'yes') {
        $("#txtLAAlcoholicDetails").show();
    } else {
        $("#txtLAAlcoholicDetails").hide();
    }
});


$("input[name$='rdbLAOtherill']").click(function () {
    var value = $(this).val();
    if (value == 'yes') {
        $("#txtLAOtherillDetails").show();
    } else {
        $("#txtLAOtherillDetails").hide();
    }
});


$("input[name$='rdbLADeformity']").click(function () {
    var value = $(this).val();
    if (value == 'yes') {
        $("#txtLADeformityDetails").show();
    } else {
        $("#txtLADeformityDetails").hide();
    }
});

$("input[name$='rdbLASymptoms']").click(function () {
    var value = $(this).val();
    if (value == 'yes') {
        $("#txtLASymptomsDetails").show();
        $("#hospitallizedcondition").show();
        $("#mediclrecoverdiv").show();

    } else {
        $("#txtLASymptomsDetails").hide();
        $("#hospitallizedcondition").hide();
        $("#mediclrecoverdiv").hide();
    }
});


$("input[name$='rdbLAHospitalized']").click(function () {
    var value = $(this).val();
    if (value == 'yes') {
        $("#txtLAHospitalizedDetail").show();
    } else {
        $("#txtLAHospitalizedDetail").hide();
    }
});


$("input[name$='rdbLAMediRecover']").click(function () {
    var value = $(this).val();
    if (value == 'yes') {
        $("#txtLAMediRecoverDetail").show();
    } else {
        $("#txtLAMediRecoverDetail").hide();
    }
});


$("input[name$='rdbLALifeInsurer']").click(function () {
    var value = $(this).val();
    if (value == 'yes') {
        laInsDeclinedInd = "Y";
        $("#Insurerdiv").show();
        $("#expolicyLAReason").show();
        $("#expolicytxtLAWhen").show();

    } else {
        laInsDeclinedInd = "N";
        $("#Insurerdiv").hide();
        $("#expolicyLAReason").hide();
        $("#expolicytxtLAWhen").hide();
    }
});

$("input[name$='rdbLALifeInsurerBenefits']").click(function () {

    var value = $(this).val();
    if (value == 'yes') {
        $("#disabilitybenefitdiv").show();
    } else {
        $("#disabilitybenefitdiv").hide();
    }
});

$("input[name$='rdbLAExistInsurance']").click(function () {
        debugger
    var value = $(this).val();
    if (value == 'yes') {

        $("#infodisclosediv").show();
    } else {
        $("#rdbLADiscloseInsur1Y").prop("checked", false);
        $("#rdbLADiscloseInsur1N").prop("checked", true);
        $("#infodisclosediv").hide();
        //$("#existinginsurancediv").hide();
        $("#divExistinginsurance").hide();
    }
});

$("input[name$='rdbLADiscloseInsur1']").click(function () {

    var value = $(this).val();
    if (value == 'yes') {
        $("#existinginsurancediv").show();
    } else {
        $("#existinginsurancediv").hide();
    }
});


$("input[name$='rdbLADiscloseInsur']").click(function () {

    var value = $(this).val();
    if (value == 'yes') {
        $("#txtLAtdetailhereditary").show();
    } else {
        $("#txtLAtdetailhereditary").hide();
    }
});


$("input[name$='rdbLAEInsuranceAcc']").click(function () {
    debugger
    var value = $(this).val();
    if (value == 'no') {
        $("#einsurancediv").show();
    } else {
        $("#einsurancediv").hide();
    }
    //if ($("input[name='rdbLAEInsuranceAcc']").val() == "yes") {
    //    isEIA = "Y";
    //}
    if (value == 'no') {
        isEIA = "N";
        applyEIA = "Y";
        insRepository = "";

        RepositoryId = $("input[name='rdbLAapplyeiaCreation']:checked").val();

        switch (RepositoryId) {
            case 1:
                insRepository = "NSDL Data Management Limited";
                break;
            case 2:
                insRepository = "Karvy Insurance Repository Limited";
                break;
            case 3:
                insRepository = "CDSL Insurance Repository Limited";
                break;
            case 4:
                insRepository = "CAMS Repository Services Limited";
                break;
            default:
                insRepository = "";
        }
    }
    else {
        isEIA = "Y";
    }
});

$("input[name$='rdbLAIncmSrc']").click(function () {

    var value = $(this).val();
    if (value == 'yes') {
        $("#otherincomediv").hide();

    } else {

        $("#otherincomediv").show();
    }
});


$("input[name$='rdbLAWeightVariation']").click(function () {

    var value = $(this).val();
    if (value == 'yes') {
        laWeightVariationInd = "Y";
        $("#weightchangediv").show();
    } else {
        laWeightVariationInd = "N";
        $("#weightchangediv").hide();
    }
});

$("input[name='rdbSpouseWeightVariation']").click(function () {

    var radioVal = $(this).val();
    if (radioVal == "yes") {
        $("#divSpouseweightchange").css("display", "block");
    }
    else {
        $("#divSpouseweightchange").css("display", "none");
    }
});


$("#chkLAOtherActivies").click(function () {
    if ($("#chkLAOtherActivies").prop("checked") == true) {
        $("#divtxtLAOtherActivities").show();
    }
    else {
        $("#divtxtLAOtherActivities").hide();
    }
});

function PostProposalData() {
    //$.ajax({
    //    url: uatIP + "/WhitelabelAPI/api/SaveProposalForm",
    //    type: "POST", //send it through get method
    //    data: dataString,
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    success: function (data) {
    //        alert('Proposal form Successfully updated!');

    //        $('#modalTnC').modal('hide');
    //        $("#divEINSBank").css("display", "none");
    //        $("#thankyoudiv").css("display", "block");
    //        return true;
    //    },
    //    error: function (xhr) {
    //        alert('failed to update proposal form');
    //        return false;
    //    }

    //});

    $.ajax({
        url: "/TermInsuranceIndia/SaveProposalData",
        type: "GET",
        dataType: "text",
        success: function (data) {
            alert('Proposal form Successfully updated!');

            $('#modalTnC').modal('hide');
            $("#divEINSBank").css("display", "none");
            $("#thankyoudiv").css("display", "block");
            return true;
        },
        error: function (xhr) {
            alert('failed to update proposal form');
            return false;
        }
    });

}

//$("#btn_otp_verify").click(function () {
//    if (ValidOTP()==true)
//    {
//        
//        var txtotp = $("#txtotp").val();
//        var transactionId = $("#hdnTransactionId").val();
//        var CRN = $("#CustomerReferenceID").val();
//        window.location.href = "/TermInsuranceIndia/Verify_Otp?txtotp=" + txtotp + "&hdnTransactionId=" + transactionId + "&CustomerReferenceID=" + CRN;
//        return true;
//    }

//})

$("#btn_otp_verify").click(function (event) {


    if (ValidOTP() == true) {
        var dataz = {

            "txtotp": $("#txtotp").val(),
            "hdnTransactionId": $("#hdnTransactionId").val(),
            "CustomerReferenceID": $("#CustomerReferenceID").val(),
            "count": 0
        }

        var dataString = JSON.stringify(dataz);
        //  console.log(dataString);
        $.ajax({

            // url: uatIP + "/WhitelabelAPI/api/SaveProposalForm",
            url: "/TermInsuranceIndia/Verify_Otp",
            type: "POST", //send it through get method
            dataType: "text",
            contentType: 'application/json;charset=utf-8',
            data: JSON.stringify(dataz),
            success: function (data) {

                if (JSON.parse(data).status == "success") {
                    ////var pdf = 'data:application/octet-stream;base64,' + JSON.parse(data).Base64data;
                    //window.open("data:application/pdf;base64," + JSON.parse(data).Base64data, "_blank");

                    //// The Base64 string of a simple PDF file
                    //var b64 = JSON.parse(data).Base64data;

                    //// Decode Base64 to binary and show some information about the PDF file (note that I skipped all checks)
                    //var bin = atob(b64);
                    //console.log('File Size:', Math.round(bin.length / 1024), 'KB');
                    //console.log('PDF Version:', bin.match(/^.PDF-([0-9.]+)/)[1]);
                    //console.log('Create Date:', bin.match(/<xmp:CreateDate>(.+?)<\/xmp:CreateDate>/)[1]);
                    //console.log('Modify Date:', bin.match(/<xmp:ModifyDate>(.+?)<\/xmp:ModifyDate>/)[1]);
                    //console.log('Creator Tool:', bin.match(/<xmp:CreatorTool>(.+?)<\/xmp:CreatorTool>/)[1]);

                    //// Embed the PDF into the HTML page and show it to the user
                    //var obj = document.createElement('object');
                    //obj.style.width = '100%';
                    //obj.style.height = '842pt';
                    //obj.type = 'application/pdf';
                    //obj.data = 'data:application/pdf;base64,' + b64;
                    //document.body.appendChild(obj);

                    //// Insert a link that allows the user to download the PDF file
                    //var link = document.createElement('a');
                    //link.innerHTML = 'Download PDF file';
                    //link.download = 'file.pdf';
                    //link.href = 'data:application/octet-stream;base64,' + b64;
                    //document.body.appendChild(link);








                    var url = "";
                    //var transactionId = $("#hdnTransactionId").val();
                    //DownloadPolicy();
                    url = "/TermInsuranceIndia/EdelweissPaymentGatewayRequest?CustomerRefNumber=" + JSON.parse(data).CustomerReferenceID + "&PremiumAmount=" + JSON.parse(data).NetPremium + "&FirstName=" + $("#txtfirstname").val() + "&mobile=" + $("#txtphonemobile").val() + "&emailId=" + $("#txtemailid").val() + "&TransId=" + JSON.parse(data).transactionId + "&PolicyNo=" + JSON.parse(data).policyNo;
                    // url = "/TermInsuranceIndia/DownloadPolicyCopy?CustomerRefNumber=" + JSON.parse(data).CustomerReferenceID;
                    // url = "/TermInsuranceIndia/DownloadPolicyCopy";

                    window.location.href = url;
                    // CallPayment();

                    // window.location.href = "/TermInsuranceIndia/EdelweissPaymentGatewayRequest?CustomerRefNumber=" + JSON.parse(data).CustomerReferenceID + "&PremiumAmount=" + JSON.parse(data).NetPremium + "&FirstName=" + $("#txtfirstname").val() + "&mobile=" + $("#txtphonemobile").val() + "&emailId=" + $("#txtemailid").val() + "&TransId=" + JSON.parse(data).transactionId + "&PolicyNo=" + JSON.parse(data).policyNo;
                }
                else if (JSON.parse(data).status == "failure") {
                    // url = "/TermInsuranceIndia/EdelweissProposalPage?QuoteId=" + $("#SelectedQuoteID").val();
                    // window.location.href = url;
                    //location.reload();
                    $("#lblerrormsg").text("Please Enter valid OTP");
                    event.stopPropagation();
                }
                else {
                    url = "/TermInsuranceIndia/EdelweissProposalPage?QuoteId=" + $("#SelectedQuoteID").val();
                    window.location.href = url;
                }

            },
            error: function (xhr) {

                url = "/TermInsuranceIndia/EdelweissProposalPage?QuoteId=" + $("#SelectedQuoteID").val();
                window.location.href = url;
                // location.reload();
            }
        });
    }
    else {
        $("#lblerrormsg").text("Please Enter OTP");
        event.stopPropagation();
    }

});


function CallPayment() {
    var dataz = {

        "txtotp": $("#txtotp").val(),
        "hdnTransactionId": $("#hdnTransactionId").val(),
        "CustomerReferenceID": $("#CustomerReferenceID").val(),
        "count": 1
    }

    var dataString = JSON.stringify(dataz);
    //  console.log(dataString);
    $.ajax({

        // url: uatIP + "/WhitelabelAPI/api/SaveProposalForm",
        url: "/TermInsuranceIndia/Verify_Otp",
        type: "POST", //send it through get method
        dataType: "text",
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(dataz),
        success: function (data) {

            if (JSON.parse(data).status == "success") {
                var url = "";
                //var transactionId = $("#hdnTransactionId").val();
                //DownloadPolicy();
                // url = "/TermInsuranceIndia/EdelweissPaymentGatewayRequest?CustomerRefNumber=" + JSON.parse(data).CustomerReferenceID + "&PremiumAmount=" + JSON.parse(data).NetPremium + "&FirstName=" + $("#txtfirstname").val() + "&mobile=" + $("#txtphonemobile").val() + "&emailId=" + $("#txtemailid").val() + "&TransId=" + JSON.parse(data).transactionId + "&PolicyNo=" + JSON.parse(data).policyNo;
                // url = "/TermInsuranceIndia/DownloadPolicyCopy?CustomerRefNumber=" + JSON.parse(data).CustomerReferenceID;
                url = "/TermInsuranceIndia/DownloadPolicyCopy";

                window.location.href = url;

                // window.location.href = "/TermInsuranceIndia/EdelweissPaymentGatewayRequest?CustomerRefNumber=" + JSON.parse(data).CustomerReferenceID + "&PremiumAmount=" + JSON.parse(data).NetPremium + "&FirstName=" + $("#txtfirstname").val() + "&mobile=" + $("#txtphonemobile").val() + "&emailId=" + $("#txtemailid").val() + "&TransId=" + JSON.parse(data).transactionId + "&PolicyNo=" + JSON.parse(data).policyNo;
            }
            else if (JSON.parse(data).status == "failure") {
                // url = "/TermInsuranceIndia/EdelweissProposalPage?QuoteId=" + $("#SelectedQuoteID").val();
                // window.location.href = url;
                //location.reload();
                $("#lblerrormsg").text("Please Enter valid OTP");
                event.stopPropagation();
            }
            else {
                url = "/TermInsuranceIndia/EdelweissProposalPage?QuoteId=" + $("#SelectedQuoteID").val();
                window.location.href = url;
            }

        },
        error: function (xhr) {

            url = "/TermInsuranceIndia/EdelweissProposalPage?QuoteId=" + $("#SelectedQuoteID").val();
            window.location.href = url;
            // location.reload();
        }
    });
}

//function DownloadPolicy()
//{
//    //var dataz = {
//    //    "hdnPolicyNo":$("#hdnPolicyNo").val(),
//    //    "hdnTransactionId": $("#hdnTransactionId").val(),
//    //    "CustomerReferenceID": $("#CustomerReferenceID").val()
//    //}
//    //var dataString = JSON.stringify(dataz);
//    //  console.log(dataString);
//    $.ajax({

//        // url: uatIP + "/WhitelabelAPI/api/SaveProposalForm",
//        url: "/TermInsuranceIndia/DownloadPolicyCopy",
//        type: "get", //send it through get method
//        dataType: "text",
//        contentType: 'application/json;charset=utf-8',
//       // data: JSON.stringify(dataz),
//        success: function (data) {
//            
//            //if (JSON.parse(data).status == "success") {
//            //    var url = "";
//            //    //var transactionId = $("#hdnTransactionId").val();
//            //    DownloadPolicy();
//            //    url = "/TermInsuranceIndia/EdelweissPaymentGatewayRequest?CustomerRefNumber=" + JSON.parse(data).CustomerReferenceID + "&PremiumAmount=" + JSON.parse(data).NetPremium + "&FirstName=" + $("#txtfirstname").val() + "&mobile=" + $("#txtphonemobile").val() + "&emailId=" + $("#txtemailid").val() + "&TransId=" + JSON.parse(data).transactionId + "&PolicyNo=" + JSON.parse(data).policyNo;
//            //    // url = "/TermInsuranceIndia/DownloadPolicyCopy?CustomerRefNumber=" + JSON.parse(data).CustomerReferenceID;
//            //    window.location.href = url;
//            //}
//            //else if (JSON.parse(data).status == "failure") {
//            //    // url = "/TermInsuranceIndia/EdelweissProposalPage?QuoteId=" + $("#SelectedQuoteID").val();
//            //    // window.location.href = url;
//            //    //location.reload();
//            //    $("#lblerrormsg").text("Please Enter valid OTP");
//            //    event.stopPropagation();
//            //}
//            //else {
//            //    url = "/TermInsuranceIndia/EdelweissProposalPage?QuoteId=" + $("#SelectedQuoteID").val();
//            //    window.location.href = url;
//            //}

//        },
//        error: function (xhr) {
//            
//          //  url = "/TermInsuranceIndia/EdelweissProposalPage?QuoteId=" + $("#SelectedQuoteID").val();
//          //  window.location.href = url;
//            // location.reload();
//        }
//    });
//}

function ValidOTP() {

    if ($("#txtotp").val() != null && $("#txtotp").val() != "") {

        return true;
    }
    else {
        $("#lblerrormsg").text("Please Enter OTP");
        return false;
    }

}

function DisplayFunction() {
    setTimeout(function () { $('#loader').css("display", "block") }, 1000); 
}


function HideFunction() {
    setTimeout(function () {
        $('#loader').css("display", "none")
      // $('.modal-backdrop .in').css('opacity', '0');
    }, 1000);
}

//function HideLifeAssuredTbl() {
//    var a = $("input[name='rdbLAExistInsurance']:checked").val();
//    var b = $("input[name='rdbLADiscloseInsur1']:checked").val();

//    if (a == "no") {
//        $("#rdbLADiscloseInsur1N").prop("checked", false);
//    }
//}
