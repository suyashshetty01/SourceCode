$(document).ready(function () {
    $('input[type=text]').each(function () {
        
        if ($(this).val() == "" || $(this).val() == null) {
            $(this).removeClass('used');
        }
        else {
            $(this).addClass('used');
        }
    })

    $('input[type=number]').each(function () {
        
        if ($(this).val() == "" || $(this).val() == null) {
            $(this).removeClass('used');
        }
        else {
            $(this).addClass('used');
        }
    })

    $('select[name=selector]').attr("selected", "selected");

    //var InsuredMaritalStatus = $("#InsuredMaritalStatus").val();
    //if (InsuredMaritalStatus == "696" || MaritalStatus =="696") {
    //    $("#Spouse").show();
    //}
    //else {
    //    $("#Spouse").hide();
    //}
    $("#MaritalStatus").change(function () {
        var MaritalStatus = $("#MaritalStatus").val();
        if (MaritalStatus == "696") {
            $("#Spouse").show();
        }
        else {
            $("#Spouse").hide();
        }
    });
    $("#ContactGender").change(function () {
        var ContactGender = $("#ContactGender").val();
        if (ContactGender == "Male") {
            $("#FemaleQue").hide();
            //$("#FemaleQue2").hide();
        }
        else {
            $("#FemaleQue").show();
            // $("#FemaleQue2").show();
        }
    });
    $("#OccupationalDetails").change(function () {
        Occupation();
        //alert("alert function call ");
    });

    $("#ProposerOccupationalDetails").change(function () {
        
        ProposerOccupation();
       // alert("alert function call ");
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

    //$("#InsuredMaritalStatus").change(function () {
    //    var InsuredMaritalStatus = $("#InsuredMaritalStatus").val();
    //    if (InsuredMaritalStatus == "696") {
    //        $("#Spouse").show();
    //    }
    //    else {
    //        $("#Spouse").hide();
    //    }
    //});

    $("#DrivingLicenseExpiry").datepicker({

        changeMonth: true,
        changeYear: true,
        minDate: 0,
        dateFormat: 'dd-mm-yy',
        yearRange: new Date().getFullYear() + ':+20'
    });


    $("#ContactDOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
      
    });

    //$("#InsuredDOB").datepicker({
    //    changeMonth: true,
    //    changeYear: true,
    //    yearRange: 'c-82:c',
    //    dateFormat: 'dd-mm-yy',
    //    minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
    //    maxDate: '-18y',
    //    onSelect: function (value, ui) {
    //        var tdate = new Date();
    //        var currentyear = tdate.getFullYear(); //yields year
    //        var age = (currentyear - ui.selectedYear);
    //        $("#InsuredAge").val(age);
    //    }
    //});



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
            var age = (currentyear - ui.selectedYear) * 12;
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


$("#Trustee1DOB").datepicker({

    changeMonth: true,
    changeYear: true,
    yearRange: 'c-82:c',
    dateFormat: 'dd-mm-yy',
    minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
    maxDate: '-18y',
    onSelect: function () { $('#dvTrustee1DOB').removeClass('Error'); }
});
$("#dvTrustee1DOB").click(function () { $("#Trustee1DOB").datepicker("show"); if ($('#Trustee1DOB').val() != "") { $('#dvTrustee1DOB').removeClass('Error'); } });


$("#Trustee2DOB").datepicker({

    changeMonth: true,
    changeYear: true,
    yearRange: 'c-82:c',
    dateFormat: 'dd-mm-yy',
    minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
    maxDate: '-18y',
    onSelect: function () { $('#dvTrustee2DOB').removeClass('Error'); }
});
$("#dvTrustee2DOB").click(function () { $("#Trustee2DOB").datepicker("show"); if ($('#Trustee2DOB').val() != "") { $('#dvTrustee2DOB').removeClass('Error'); } });

$("#Trustee3DOB").datepicker({

    changeMonth: true,
    changeYear: true,
    yearRange: 'c-82:c',
    dateFormat: 'dd-mm-yy',
    minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
    maxDate: '-18y',
    onSelect: function () { $('#dvTrustee3DOB').removeClass('Error'); }
});
$("#dvTrustee3DOB").click(function () { $("#Trustee3DOB").datepicker("show"); if ($('#Trustee3DOB').val() != "") { $('#dvTrustee3DOB').removeClass('Error'); } });

$("#Trustee4DOB").datepicker({

    changeMonth: true,
    changeYear: true,
    yearRange: 'c-82:c',
    dateFormat: 'dd-mm-yy',
    minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
    maxDate: '-18y',
    onSelect: function () { $('#dvTrustee4DOB').removeClass('Error'); }
});
$("#dvTrustee4DOB").click(function () { $("#Trustee4DOB").datepicker("show"); if ($('#Trustee4DOB').val() != "") { $('#dvTrustee4DOB').removeClass('Error'); } });

$("#Trustee5DOB").datepicker({

    changeMonth: true,
    changeYear: true,
    yearRange: 'c-82:c',
    dateFormat: 'dd-mm-yy',
    minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
    maxDate: '-18y',
    onSelect: function () { $('#dvTrustee5DOB').removeClass('Error'); }
});
$("#dvTrustee5DOB").click(function () { $("#Trustee5DOB").datepicker("show"); if ($('#Trustee5DOB').val() != "") { $('#dvTrustee5DOB').removeClass('Error'); } });


$("#Trustee6DOB").datepicker({

    changeMonth: true,
    changeYear: true,
    yearRange: 'c-82:c',
    dateFormat: 'dd-mm-yy',
    minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
    maxDate: '-18y',
    onSelect: function () { $('#dvTrustee6DOB').removeClass('Error'); }
});
$("#dvTrustee6DOB").click(function () { $("#Trustee6DOB").datepicker("show"); if ($('#Trustee6DOB').val() != "") { $('#dvTrustee6DOB').removeClass('Error'); } });

function Occupation() {
    //alert("alert function 1");
    var occuptiondetails = $("#OccupationalDetails").val();
    if (occuptiondetails == "AGRI" || occuptiondetails == "HSWF" || occuptiondetails == "IPRU" || occuptiondetails == "RETD" || occuptiondetails == "STDN") {
        // $("#OccupationTypeCommon").show();
        $("#Occ_TypeSalaried").hide();
        $("#Occ_TypeOthers").hide();
        $("#Occ_TypeSelfEmployed").hide();
        $("#OccupationTypeProfessional").hide();
        $("#NameOfOrganisation").attr("style", "pointer-events: auto;");
        //$("#NameOfOrganisation").val("0");

    }
    if (occuptiondetails == "SPRO") {
        $("#Occ_TypeOthers").show();
        //  $("#OccupationTypeCommon").hide();
        $("#Occ_TypeSalaried").hide();
        $("#Occ_TypeSelfEmployed").hide();
        $("#OccupationTypeProfessional").hide();
        $("#NameOfOrganisation").attr("style", "pointer-events: auto;");
        //$("#NameOfOrganisation").val("0");
    }
    else if (occuptiondetails == "PROF") {
        $("#OccupationTypeProfessional").show();
        // $("#OccupationTypeCommon").hide();
        $("#Occ_TypeSalaried").hide();
        $("#Occ_TypeOthers").hide();
        $("#Occ_TypeSelfEmployed").hide();
        $("#NameOfOrganisation").attr("style", "pointer-events: auto;");
        //$("#NameOfOrganisation").val("0");
    }
    else if (occuptiondetails == "SPVT") {
        $("#Occ_TypeSalaried").show();
        // $("#OccupationTypeCommon").show();
        $("#Occ_TypeOthers").hide();
        $("#OccupationTypeProfessional").hide();
        $("#Occ_TypeSelfEmployed").hide();
        $("#NameOfOrganisation").attr("style", "pointer-events: auto;");
        //alert("alert function 5");
        //$("#NameOfOrganisation").val("0");
    }
    else if (occuptiondetails == "BSEM") {
        //alert("alert function 3");
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
    if (occuptiondetails == "AGRI" ||  occuptiondetails == "IPRU" || occuptiondetails == "RETD" ) {
        // $("#OccupationTypeCommon").show();
        $("#divIndustry").hide();
        //$("#divProposerOthersNameOfOrganisationDesc").hide();
        $("#ProposerOcc_Housewife").hide();
        $("#ProposerOcc_Student").hide();
        $("#ProposerOcc_TypeSalaried").hide();
        $("#ProposerOcc_TypeOthers").hide();
        $("#ProposerOcc_TypeSelfEmployed").hide();
        $("#ProposerOccupationTypeProfessional").hide();
        $("#ProposerNameOfOrganisation").attr("style", "pointer-events: auto;");
       // $("#ProposerNameOfOrganisation").val("0");
        $("#divindutriesblock").hide();
    }

    if (occuptiondetails == "SPRO") {
        $("#divindutriesblock").show();
        $("#ProposerOcc_TypeOthers").show();
        //$("#divProposerOthersNameOfOrganisationDesc").show();
       // $("#divIndustry").show();
        $("#ProposerOcc_Student").hide();
        $("#ProposerOcc_Housewife").hide();
        //  $("#OccupationTypeCommon").hide();
        $("#ProposerOcc_TypeSalaried").hide();
        $("#ProposerOcc_TypeSelfEmployed").hide();
        $("#ProposerOccupationTypeProfessional").hide();
        $("#ProposerNameOfOrganisation").attr("style", "pointer-events: auto;");
        // $("#ProposerNameOfOrganisation").val("0");
    } else if (occuptiondetails == "STDN") {
        $("#ProposerOcc_Student").show();
        //$("#divProposerOthersNameOfOrganisationDesc").hide();
        $("#ProposerOcc_Housewife").hide();
        $("#ProposerOcc_TypeSalaried").hide();
        $("#ProposerOcc_TypeSelfEmployed").hide();
        $("#ProposerOccupationTypeProfessional").hide();
        $("#ProposerOcc_TypeOthers").hide();
        $("#divIndustry").hide();
        $("#divindutriesblock").hide();
    }
    else if (occuptiondetails == "HSWF") {
        $("#ProposerOcc_TypeOthers").hide();
        //$("#divProposerOthersNameOfOrganisationDesc").hide();
        $("#ProposerOcc_Housewife").show();
        $("#ProposerOcc_Student").hide();
        $("#ProposerOcc_TypeSalaried").hide();
        $("#ProposerOcc_TypeSelfEmployed").hide();
        $("#ProposerOccupationTypeProfessional").hide();
        $("#divIndustry").hide();
        $("#divindutriesblock").hide();
    }
    else if (occuptiondetails == "PROF") {
        $("#divindutriesblock").hide();
        $("#ProposerOccupationTypeProfessional").show();
        //$("#divProposerOthersNameOfOrganisationDesc").hide();
        $("#ProposerOcc_Housewife").hide();
        // $("#OccupationTypeCommon").hide();
        $("#divIndustry").hide();
        $("#ProposerOcc_Student").hide();
        $("#ProposerOcc_TypeSalaried").hide();
        $("#ProposerOcc_TypeOthers").hide();
        $("#ProposerOcc_TypeSelfEmployed").hide();
        $("#ProposerNameOfOrganisation").attr("style", "pointer-events: auto;");
     //  $("#ProposerNameOfOrganisation").val("0");
     // $("#ProposerNameOfOrganisation").val("0");
 }
    else if (occuptiondetails == "SPVT") {
        $("#divindutriesblock").show();
        $("#ProposerOcc_TypeSalaried").show();
        //$("#divProposerOthersNameOfOrganisationDesc").hide();
        $("#ProposerOcc_Housewife").hide();
        //$("#divIndustry").show();
        // $("#OccupationTypeCommon").show();
        $("#ProposerOcc_Student").hide();
        $("#ProposerOcc_TypeOthers").hide();
        $("#OccupationTypeProfessional").hide();
        $("#ProposerOcc_TypeSelfEmployed").hide();
        $("#ProposerNameOfOrganisation").attr("style", "pointer-events: auto;");
      //  $("#ProposerNameOfOrganisation").val("0");
    }
    else if (occuptiondetails == "BSEM") {
        $("#ProposerOcc_TypeSelfEmployed").show();
        $("#divindutriesblock").show();
        //$("#divProposerOthersNameOfOrganisationDesc").hide();
        $("#ProposerOcc_Housewife").hide();
       // $("#divIndustry").show();
        //  $("#OccupationTypeCommon").show();
        $("#ProposerOcc_TypeSalaried").hide();
        $("#ProposerOcc_TypeOthers").hide();
        $("#ProposerOcc_Student").hide();
        $("#ProposerOccupationTypeProfessional").hide();
        $('#ProposerSelfEmpNameOfOrganisation option[value="Others"]').attr("selected", "selected");
        $("#ProposerSelfEmpNameOfOrganisation").attr("style", "pointer-events: none;");
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
    else if (ID == 'No') {
        $('#MarriedWomensAct').val('No');
        $("#MarriedWomensActN").addClass('active');
        $("#MarriedWomensActY").removeClass('active');
        $("#Benificiary").hide();
        $("#Trustee").hide();
        $("#nominee").show();

    }
}
function EIA(ID) {

    if (ID == 'Yes') {
        $('#EIA').val('Yes');
        $("#EIAY").addClass('active');
        $("#EIAN").removeClass('active');
        $("#dvEIAno").show();
        
    }
    else if (ID == 'No') {
        $('#EIA').val('No');
        $("#EIAN").addClass('active');
        $("#EIAY").removeClass('active');
        $("#dvEIAno").hide();
        
    }
}
function pltclyExpsd(ID) {

    if (ID == 'Yes') {
        $('#PoliticallyExposed').val('Yes');
        $("#pltclyExpsdY").addClass('active');
        $("#pltclyExpsdN").removeClass('active');
        //$("#dvEIAno").show();

    }
    else if (ID == 'No') {
        $('#PoliticallyExposed').val('No');
        $("#pltclyExpsdN").addClass('active');
        $("#pltclyExpsdY").removeClass('active');
        //$("#dvEIAno").hide();

    }
}
function industries(ID) {

    if (ID == 'Yes') {
        $('#industries').val('Yes');
        $("#industriesY").addClass('active');
        $("#industriesN").removeClass('active');
        //$("#dvInsuranceDetailsyes").show();

    }
    else if (ID == 'No') {
        $('#industries').val('No');
        $("#industriesN").addClass('active');
        $("#industriesY").removeClass('active');
        //$("#dvInsuranceDetailsyes").hide();

    }
}

function InsuranceDetails(ID) {

    if (ID == 'Yes') {
        $('#InsuranceDetails').val('Yes');
        $("#InsuranceDetailsY").addClass('active');
        $("#InsuranceDetailsN").removeClass('active');
        $("#dvInsuranceDetailsyes").show();

    }
    else if (ID == 'No') {
        $('#InsuranceDetails').val('No');
        $("#InsuranceDetailsN").addClass('active');
        $("#InsuranceDetailsY").removeClass('active');
        $("#dvInsuranceDetailsyes").hide();

    }
}


function IpruPolicy(ID) {

    if (ID == 'Yes') {
        $('#IpruPolicy').val('Yes');
        $("#IpruPolicyY").addClass('active');
        $("#IpruPolicyN").removeClass('active');
      

    }
    else if (ID == 'No') {
        $('#IpruPolicy').val('No');
        $("#IpruPolicyN").addClass('active');
        $("#IpruPolicyY").removeClass('active');
       
    }
} 
function ExistingPolicy(ID) {

    if (ID == 'Yes') {
        $('#ExistingPolicy').val('Yes');
        $("#ExistingPolicyY").addClass('active');
        $("#ExistingPolicyN").removeClass('active');
        $("#dvExistingPolicyyes").show();
        $("#dvExistingPolicy1").show();
        if ($("#ExistingInsuranceCount").val() == 0 || $("#ExistingInsuranceCount").val == "") {
            $("#ExistingInsuranceCount").val(1);
        }
        if ($("#ExistingInsuranceCount").val() == 1) {
            $("#dvadd_policy2").show();
        }
    }
    else if (ID == 'No') {
        $('#ExistingPolicy').val('No');
        $("#ExistingPolicyN").addClass('active');
        $("#ExistingPolicyY").removeClass('active');
        $("#dvExistingPolicyyes").hide();
        $("#dvExistingPolicy1").hide();
        $("#dvExistingPolicy2").hide();
        $("#dvExistingPolicy3").hide();
        $("#dvExistingPolicy4").hide();
        $("#dvExistingPolicy5").hide();
        $("#ExistingInsuranceCount").val(0);
        if ($("#ExistingInsuranceCount").val() == 0) {
            $("#dvadd_policy2").hide();
            $("#dvadd_policy3").hide();
            $("#dvadd_policy4").hide();
            $("#dvadd_policy5").hide();
        }
    }
}

function NomineeGender(ID) {
    if (ID == 'Male' || ID =='M') {
        $('#NomineeGender').val('Male');
        $("#NomineeGenderM").addClass('active');
        $("#NomineeGenderF").removeClass('active');

    }
    else if (ID == 'Female') {
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
    else if (ID == 'Female') {
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
        $("#MWPADiv").show();
    }
    else if (ID == 'Female') {
        $('#ContactGender').val('Female');
        $("#ContactGenderF").addClass('active');
        $("#ContactGenderM").removeClass('active');
        $("#MWPADiv").hide();
    }
}

function AppointeeGender(ID) {
    if (ID == 'Male' || ID == 'M') {
        $('#AppointeeGender').val('Male');
        $("#AppointeeGenderM").addClass('active');
        $("#AppointeeGenderF").removeClass('active');

    }
    else if (ID == 'Female') {
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
    else if (ID == 'No') {
        $('#PermanentAddress').val('No');
        $("#PermanentAddressN").addClass('active');
        $("#PermanentAddressY").removeClass('active');
        $("#PermanentAdd").show();
    }
}
