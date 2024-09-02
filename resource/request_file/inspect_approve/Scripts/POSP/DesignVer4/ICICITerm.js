$(document).ready(function () {
    var InsuredMaritalStatus = $("#InsuredMaritalStatus").val();
    if (InsuredMaritalStatus == "696") {
        $("#Spouse").show();
    }
    else {
        $("#Spouse").hide();
    }


    $("#OccupationalDetails").change(function () {
        
        Occupation();
    });

    $("#ProposerOccupationalDetails").change(function () {
        
        ProposerOccupation();
    });

    $("#AddBeneficiary").click(function (e) {
        

        AddBeneficiary();

    });

    $("#AddTrustee").click(function (e) {
        

        AddTrustee();

    });

    $("#RemoveBeneficiary2").click(function () {
        RemoveBeneficiary2();
    });

    $("#RemoveBeneficiary3").click(function () {
        RemoveBeneficiary3();
    });

    $("#RemoveBeneficiary4").click(function () {
        RemoveBeneficiary4();
    });

    $("#RemoveBeneficiary5").click(function () {
        RemoveBeneficiary5();
    });

    $("#RemoveBeneficiary6").click(function () {
        RemoveBeneficiary6();
    });


    
    $("#RemoveTrustee2").click(function () {
        RemoveTrustee2();
    });

    $("#RemoveTrustee3").click(function () {
        RemoveTrustee3();
    });

    $("#RemoveTrustee4").click(function () {
        RemoveTrustee4();
    });

    $("#RemoveTrustee5").click(function () {
        RemoveTrustee5();
    });

    $("#RemoveTrustee6").click(function () {
        RemoveTrustee6();
    });

    $("#InsuredMaritalStatus").change(function () {
        var InsuredMaritalStatus = $("#InsuredMaritalStatus").val();
        if (InsuredMaritalStatus == "696") {
            $("#Spouse").show();
        }
        else {
            $("#Spouse").hide();
        }
    });

    $("#InsuredDOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '0',
        //onSelect: function () { $('#dvNomineeDOB').removeClass('Error'); },
        //onSelect: function (value, ui) {

        //    var tdate = new Date();
        //    var currentyear = tdate.getFullYear(); //yields year

        //    //  var nDOB = $("#NomineeDOB").val();
        //    // var tdate1 = new Date(nDOB);
        //    var age = (currentyear - ui.selectedYear) * 12;
        //    // var date = $("#datetimepicker1").data("datetimepicker").getDate()
        //    // var age = (currentyear - year)*12;
        //    $("#agenominee1").val(age);
        //    if (age >= 12) {
        //        $("#InsuredMaritalStatus").val("MAR_MRD");

        //    }

        //}
    });



    $("#NomineeDOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '0',
        //onSelect: function () { $('#dvNomineeDOB').removeClass('Error'); },
        onSelect: function (value, ui) {

            var tdate = new Date();
            var currentyear = tdate.getFullYear(); //yields year

            //  var nDOB = $("#NomineeDOB").val();
            // var tdate1 = new Date(nDOB);
            var age = (currentyear - ui.selectedYear) * 12;
            // var date = $("#datetimepicker1").data("datetimepicker").getDate()
            // var age = (currentyear - year)*12;
            $("#agenominee1").val(age);
            if (age < 216) {
                $("#appointee").show();

            }
            else {
                $("#appointee").hide();
            }
            $('#dvNomineeDOB').removeClass('Error');
        }
    });
    $("#divNomineeDOB").click(function () { $("#NomineeDOB").datepicker("show"); if ($('#NomineeDOB').val() != "") { $('#dvNomineeDOB').removeClass('Error'); } });

    $("#AppointeeDOB").datepicker({

        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvAppointeeDOB').removeClass('Error'); }
    });
    $("#dvAppointeeDOB").click(function () { $("#AppointeeDOB").datepicker("show"); if ($('#AppointeeDOB').val() != "") { $('#dvAppointeeDOB').removeClass('Error'); } });

    $("#Beneficiary1DOB").datepicker({

        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvBeneficiary1DOB').removeClass('Error'); }
    });
    $("#dvBeneficiary1DOB").click(function () { $("#Beneficiary1DOB").datepicker("show"); if ($('#Beneficiary1DOB').val() != "") { $('#dvBeneficiary1DOB').removeClass('Error'); } });


    $("#Beneficiary2DOB").datepicker({

        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvBeneficiary2DOB').removeClass('Error'); }
    });
    $("#dvBeneficiary2DOB").click(function () { $("#Beneficiary2DOB").datepicker("show"); if ($('#Beneficiary2DOB').val() != "") { $('#dvBeneficiary2DOB').removeClass('Error'); } });

    $("#Beneficiary3DOB").datepicker({

        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvBeneficiary3DOB').removeClass('Error'); }
    });
    $("#dvBeneficiary3DOB").click(function () { $("#Beneficiary3DOB").datepicker("show"); if ($('#Beneficiary3DOB').val() != "") { $('#dvBeneficiary3DOB').removeClass('Error'); } });

    $("#Beneficiary4DOB").datepicker({

        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvBeneficiary4DOB').removeClass('Error'); }
    });
    $("#dvBeneficiary4DOB").click(function () { $("#Beneficiary4DOB").datepicker("show"); if ($('#Beneficiary4DOB').val() != "") { $('#dvBeneficiary4DOB').removeClass('Error'); } });

    $("#Beneficiary5DOB").datepicker({

        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvBeneficiary5DOB').removeClass('Error'); }
    });
    $("#dvBeneficiary5DOB").click(function () { $("#Beneficiary5DOB").datepicker("show"); if ($('#Beneficiary5DOB').val() != "") { $('#dvBeneficiary5DOB').removeClass('Error'); } });


    $("#Beneficiary6DOB").datepicker({

        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvBeneficiary6DOB').removeClass('Error'); }
    });
    $("#dvBeneficiary6DOB").click(function () { $("#Beneficiary6DOB").datepicker("show"); if ($('#Beneficiary6DOB').val() != "") { $('#dvBeneficiary6DOB').removeClass('Error'); } });
});




function Occupation() {
    
    var occuptiondetails = $("#OccupationalDetails").val();
    if (occuptiondetails == "AGRI" || occuptiondetails == "HSWF" || occuptiondetails == "IPRU" || occuptiondetails == "RETD" || occuptiondetails == "STDN") {
        // $("#OccupationTypeCommon").show();
        $("#Occ_TypeSalaried").hide();
        $("#Occ_TypeOthers").hide();
        $("#Occ_TypeSelfEmployed").hide();
        $("#OccupationTypeProfessional").hide();
        $("#NameOfOrganisation").attr("style", "pointer-events: auto;");
        $("#NameOfOrganisation").val("0");

    }
    if (occuptiondetails == "SPRO") {
        $("#Occ_TypeOthers").show();
        //  $("#OccupationTypeCommon").hide();
        $("#Occ_TypeSalaried").hide();
        $("#Occ_TypeSelfEmployed").hide();
        $("#OccupationTypeProfessional").hide();
        $("#NameOfOrganisation").attr("style", "pointer-events: auto;");
        $("#NameOfOrganisation").val("0");
    }
    else if (occuptiondetails == "PROF") {
        $("#OccupationTypeProfessional").show();
        // $("#OccupationTypeCommon").hide();
        $("#Occ_TypeSalaried").hide();
        $("#Occ_TypeOthers").hide();
        $("#Occ_TypeSelfEmployed").hide();
        $("#NameOfOrganisation").attr("style", "pointer-events: auto;");
        $("#NameOfOrganisation").val("0");
    }
    else if (occuptiondetails == "SPVT") {
        $("#Occ_TypeSalaried").show();
        // $("#OccupationTypeCommon").show();
        $("#Occ_TypeOthers").hide();
        $("#OccupationTypeProfessional").hide();
        $("#Occ_TypeSelfEmployed").hide();
        $("#NameOfOrganisation").attr("style", "pointer-events: auto;");
        $("#NameOfOrganisation").val("0");
    }
    else if (occuptiondetails == "BSEM") {
        $("#Occ_TypeSelfEmployed").show();
        //  $("#OccupationTypeCommon").show();
        $("#Occ_TypeSalaried").hide();
        $("#Occ_TypeOthers").hide();
        $("#OccupationTypeProfessional").hide();
        $('#NameOfOrganisation option[value="Others"]').attr("selected", "selected");
        $("#NameOfOrganisation").attr("style", "pointer-events: none;");
    }

}

function ProposerOccupation() {
    
    var occuptiondetails = $("#ProposerOccupationalDetails").val();
    if (occuptiondetails == "AGRI" || occuptiondetails == "HSWF" || occuptiondetails == "IPRU" || occuptiondetails == "RETD" || occuptiondetails == "STDN") {
        // $("#OccupationTypeCommon").show();
        $("#ProposerOcc_TypeSalaried").hide();
        $("#ProposerOcc_TypeOthers").hide();
        $("#ProposerOcc_TypeSelfEmployed").hide();
        $("#ProposerOccupationTypeProfessional").hide();
        $("#ProposerNameOfOrganisation").attr("style", "pointer-events: auto;");
        $("#ProposerNameOfOrganisation").val("0");

    }
    if (occuptiondetails == "SPRO") {
        $("#ProposerOcc_TypeOthers").show();
        //  $("#OccupationTypeCommon").hide();
        $("#ProposerOcc_TypeSalaried").hide();
        $("#ProposerOcc_TypeSelfEmployed").hide();
        $("#ProposerOccupationTypeProfessional").hide();
        $("#ProposerNameOfOrganisation").attr("style", "pointer-events: auto;");
        $("#ProposerNameOfOrganisation").val("0");
    }
    else if (occuptiondetails == "PROF") {
        $("#ProposerOccupationTypeProfessional").show();
        // $("#OccupationTypeCommon").hide();
        $("#ProposerOcc_TypeSalaried").hide();
        $("#ProposerOcc_TypeOthers").hide();
        $("#ProposerOcc_TypeSelfEmployed").hide();
        $("#ProposerNameOfOrganisation").attr("style", "pointer-events: auto;");
        $("#ProposerNameOfOrganisation").val("0");
    }
    else if (occuptiondetails == "SPVT") {
        $("#ProposerOcc_TypeSalaried").show();
        // $("#OccupationTypeCommon").show();
        $("#ProposerOcc_TypeOthers").hide();
        $("#OccupationTypeProfessional").hide();
        $("#ProposerOcc_TypeSelfEmployed").hide();
        $("#ProposerNameOfOrganisation").attr("style", "pointer-events: auto;");
        $("#ProposerNameOfOrganisation").val("0");
    }
    else if (occuptiondetails == "BSEM") {
        $("#ProposerOcc_TypeSelfEmployed").show();
        //  $("#OccupationTypeCommon").show();
        $("#ProposerOcc_TypeSalaried").hide();
        $("#ProposerOcc_TypeOthers").hide();
        $("#ProposerOccupationTypeProfessional").hide();
        $('#ProposerNameOfOrganisation option[value="Others"]').attr("selected", "selected");
        $("#ProposerNameOfOrganisation").attr("style", "pointer-events: none;");
    }

}


function MarriedWomensAct(ID) {
    if (ID == 'Yes') {
        $('#MarriedWomensAct').val('Yes');
        $("#MarriedWomensActY").addClass('active');
        $("#MarriedWomensActN").removeClass('active');
        $("#Benificiary").show();
        $("#Trustee").show();
        $("#nominee").hide();
    }
    else {
        $('#MarriedWomensAct').val('No');
        $("#MarriedWomensActN").addClass('active');
        $("#MarriedWomensActY").removeClass('active');
        $("#Benificiary").hide();
        $("#Trustee").hide();
        $("#nominee").show();

    }
}



function NomineeGender(ID) {
    if (ID == 'Male') {
        $('#NomineeGender').val('Male');
        $("#NomineeGenderM").addClass('active');
        $("#NomineeGenderF").removeClass('active');

    }
    else {
        $('#NomineeGender').val('Female');
        $("#NomineeGenderF").addClass('active');
        $("#NomineeGenderM").removeClass('active');


    }
}

function InsurerGender(ID) {
    if (ID == 'Male') {
        $('#InsurerGender').val('Male');
        $("#InsurerGenderM").addClass('active');
        $("#InsurerGenderF").removeClass('active');

    }
    else {
        $('#InsurerGender').val('Female');
        $("#InsurerGenderF").addClass('active');
        $("#InsurerGenderM").removeClass('active');


    }
}

function ContactGender(ID) {
    if (ID == 'Male') {
        $('#ContactGender').val('Male');
        $("#ContactGenderM").addClass('active');
        $("#ContactGenderF").removeClass('active');

    }
    else {
        $('#ContactGender').val('Female');
        $("#ContactGenderF").addClass('active');
        $("#ContactGenderM").removeClass('active');


    }
}

function AppointeeGender(ID) {
    if (ID == 'Male') {
        $('#AppointeeGender').val('Male');
        $("#AppointeeGenderM").addClass('active');
        $("#AppointeeGenderF").removeClass('active');

    }
    else {
        $('#AppointeeGender').val('Female');
        $("#AppointeeGenderF").addClass('active');
        $("#AppointeeGenderM").removeClass('active');


    }
}


function AddBeneficiary() {
    
    
    var Count = $("#BenficiaryCount").val();
    Count++;
    if (Count == 2) {
        $("#Beneficiary2").show();
        $("#BenficiaryCount").val(Count);

       // $("#AddBeneficiary").prop('enabled', true);
    }
    else if (Count == 3) {
        $("#Beneficiary3").show();
        $("#BenficiaryCount").val(Count);
    }
    else if (Count == 4) {
        $("#Beneficiary4").show();
        $("#BenficiaryCount").val(Count);
    }
    else if (Count == 5) {
        $("#Beneficiary5").show();
        $("#BenficiaryCount").val(Count);
    }
    else if (Count == 6) {
        $("#Beneficiary6").show();
        $("#BenficiaryCount").val(Count);
    } else if (Count > 6)
    {
        alert("Maximum 6 Beneficiaries Allow.");
    }

}


function AddTrustee() {
    

    var Count = $("#TrusteeCount").val();
    Count++;
    if (Count == 2) {
        $("#Trustee2").show();
        $("#TrusteeCount").val(Count);

        // $("#AddBeneficiary").prop('enabled', true);
    }
    else if (Count == 3) {
        $("#Trustee3").show();
        $("#TrusteeCount").val(Count);
    }
    else if (Count == 4) {
        $("#Trustee4").show();
        $("#TrusteeCount").val(Count);
    }
    else if (Count == 5) {
        $("#Trustee5").show();
        $("#TrusteeCount").val(Count);
    }
    else if (Count == 6) {
        $("#Trustee6").show();
        $("#TrusteeCount").val(Count);
    } else if (Count > 6) {
        alert("Maximum 6 Trustee Allow.");
    }

}

function RemoveBeneficiary2() {
    var Count = $("#BenficiaryCount").val();
    Count--;
    $("#Beneficiary2").hide();
    $("#BenficiaryCount").val(Count);
}

function RemoveBeneficiary3() {
    var Count = $("#BenficiaryCount").val();
    Count--;
    $("#Beneficiary3").hide();
    $("#BenficiaryCount").val(Count);
}

function RemoveBeneficiary4() {
    var Count = $("#BenficiaryCount").val();
    Count--;
    $("#Beneficiary4").hide();
    $("#BenficiaryCount").val(Count);
}

function RemoveBeneficiary5() {
    var Count = $("#BenficiaryCount").val();
    Count--;
    $("#Beneficiary5").hide();
    $("#BenficiaryCount").val(Count);
}

function RemoveBeneficiary6() {
    var Count = $("#BenficiaryCount").val();
    Count--;
    $("#Beneficiary6").hide();
    $("#BenficiaryCount").val(Count);
}


function RemoveTrustee2() {
    var Count = $("#TrusteeCount").val();
    Count--;
    $("#Trustee2").hide();
    $("#TrusteeCount").val(Count);
}

function RemoveTrustee3() {
    var Count = $("#TrusteeCount").val();
    Count--;
    $("#Trustee3").hide();
    $("#TrusteeCount").val(Count);
}

function RemoveTrustee4() {
    var Count = $("#TrusteeCount").val();
    Count--;
    $("#Trustee4").hide();
    $("#TrusteeCount").val(Count);
}

function RemoveTrustee5() {
    var Count = $("#TrusteeCount").val();
    Count--;
    $("#Trustee5").hide();
    $("#TrusteeCount").val(Count);
}

function RemoveTrustee6() {
    var Count = $("#TrusteeCount").val();
    Count--;
    $("#Trustee6").hide();
    $("#TrusteeCount").val(Count);
}


function checkPincode(input) {
    var pattern = new RegExp('^([1-9]{1}[0-9]{5})$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}

function PermanentAddress(ID) {
    if (ID == 'Yes') {
        $('#PermanentAddress').val('Yes');
        $("#PermanentAddressY").addClass('active');
        $("#PermanentAddressN").removeClass('active');
        $("#PermanentAdd").hide();
    }
    else {
        $('#PermanentAddress').val('No');
        $("#PermanentAddressN").addClass('active');
        $("#PermanentAddressY").removeClass('active');
        $("#PermanentAdd").show();
    }
}
