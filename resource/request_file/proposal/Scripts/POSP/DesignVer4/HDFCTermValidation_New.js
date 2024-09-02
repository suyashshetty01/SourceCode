$(document).ready(function () {

    $("#CKYCOccupationType").change(function () {
        if ($("#CKYCOccupationType").val() == "OCCT_SALR") {
            $("#CKYCFatherSalaried").show();
        }
        else {
            $("#CKYCFatherSalaried").hide();
        }
    });

    $("#ContactFirstName").keypress(function () {

        return isCharacter(event);
    });

    $("#ContactLastName").keypress(function () {

        return isCharacter(event);
    });

    $("#InsuredFirstName").keypress(function () {

        return isCharacter(event);
    });


    $("#InsuredLastName").keypress(function () {

        return isCharacter(event);
    });


    $("#InsuredFatherName").keypress(function () {

        return isCharacter(event);
    });

    $("#NomineeFirstName").keypress(function () {

        return isCharacter(event);
    });

    $("#Nominee2FirstName").keypress(function () {

        return isCharacter(event);
    });

    $("#Nominee3FirstName").keypress(function () {

        return isCharacter(event);
    });


    $("#NomineeLastName").keypress(function () {

        return isCharacter(event);
    });

    $("#Nominee2LastName").keypress(function () {

        return isCharacter(event);
    });

    $("#Nominee3LastName").keypress(function () {

        return isCharacter(event);
    });


    $("#AppointeeFirstName").keypress(function () {

        return isCharacter(event);
    });

    $("#Appointee2FirstName").keypress(function () {

        return isCharacter(event);
    });

    $("#Appointee3FirstName").keypress(function () {

        return isCharacter(event);
    });


    $("#AppointeeLastName").keypress(function () {

        return isCharacter(event);
    });

    $("#Appointee2LastName").keypress(function () {

        return isCharacter(event);
    });

    $("#Appointee3LastName").keypress(function () {

        return isCharacter(event);
    });

    $("#CKYCFatherFirstName").keypress(function () {

        return isCharacter(event);
    });

    $("#CKYCFatherMiddleName").keypress(function () {

        return isCharacter(event);
    });

    $("#CKYCFatherLastName").keypress(function () {

        return isCharacter(event);
    });


    $("#CKYCMotherFirstName").keypress(function () {

        return isCharacter(event);
    });

    $("#CKYCMotherMiddleName").keypress(function () {

        return isCharacter(event);
    });

    $("#CKYCMotherLastName").keypress(function () {

        return isCharacter(event);
    });


    $("#CKYCSpouseFirstName").keypress(function () {

        return isCharacter(event);
    });

    $("#CKYCSpouseLastName").keypress(function () {

        return isCharacter(event);
    });

    $("#CKYCSpouseMiddleName").keypress(function () {

        return isCharacter(event);
    });

    $("#ContactMobile").keypress(function () {

        return isNumber(event);
    });


    $("#NomineePinCode").keypress(function () {

        return isNumber(event);
    });

    $("#Nominee2PinCode").keypress(function () {

        return isNumber(event);
    });

    $("#Nominee3PinCode").keypress(function () {

        return isNumber(event);
    });


    $("#AppointeePinCode").keypress(function () {

        return isNumber(event);
    });

    $("#Appointee2PinCode").keypress(function () {

        return isNumber(event);
    });

    $("#Appointee3PinCode").keypress(function () {

        return isNumber(event);
    });

    $("#PermanentPinCode").keypress(function () {

        return isNumber(event);
    });

    $("#ContactPinCode").keypress(function () {

        return isNumber(event);
    });

    $("#Weight").keypress(function () {

        return isNumber(event);
    });

    $("#nominee1percentage").keypress(function () {

        return isNumber(event);
    });

    $("#nominee2percentage").keypress(function () {

        return isNumber(event);
    });

    $("#nominee3percentage").keypress(function () {

        return isNumber(event);
    });

    $("#nomineepercentagetotal").keypress(function () {

        return isNumber(event);
    });

    $("#InsuredMobile").keypress(function () {

        return isNumber(event);
    });


    $("#NomineeMobile").keypress(function () {

        return isNumber(event);
    });

    $("#Nominee2Mobile").keypress(function () {

        return isNumber(event);
    });

    $("#Nominee3Mobile").keypress(function () {

        return isNumber(event);
    });

    $("#ContactCityName").val('');

    $("#OccupationalDetails").change(function () {//if Proposer Relation "Self" is selected,then member1 details will be same as contact details

        $("#OccupationalDetailsemployeeof").val("");
        Others();

        if ($("#OccupationalDetails").val() == 'OCCT_OTHR' || $("#OccupationalDetails").val() == 'OCCT_SALR' || $("#OccupationalDetails").val() == 'OCCT_SEBS' || $("#OccupationalDetails").val() == 'OCCT_STUD' || $("#OccupationalDetails").val() == "OCCT_AGCT" || $("#OccupationalDetails").val() == "OCCT_HOWF" || $("#OccupationalDetails").val() == "OCCT_RETD" || $("#OccupationalDetails").val() == "OCCT_UEMP") {

            $("#CKYCOccupationType").attr("style", "pointer-events: none;");

            if ($("#OccupationalDetails").val() == "OCCT_OTHR") {
                $("#CKYCOccupationType").val("OCCT_OTHR");
                $("#CKYCFatherSalaried").hide();
            }
            else if ($("#OccupationalDetails").val() == "OCCT_SALR") {
                $("#CKYCOccupationType").val("OCCT_SALR");
                $("#CKYCFatherSalaried").show();
            } else if ($("#OccupationalDetails").val() == "OCCT_SEBS") {
                $("#CKYCOccupationType").val("OCCT_SEBS");
                $("#CKYCFatherSalaried").hide();
            } else if ($("#OccupationalDetails").val() == "OCCT_STUD") {
                $("#CKYCOccupationType").val("OCCT_STUD");
                $("#CKYCFatherSalaried").hide();
            } else if ($("#OccupationalDetails").val() == "OCCT_AGCT") {
                $("#CKYCOccupationType").val("OCCT_AGCT");
                $("#CKYCFatherSalaried").hide();
            }
            else if ($("#OccupationalDetails").val() == "OCCT_HOWF") {
                $("#CKYCOccupationType").val("OCCT_HOWF");
                $("#CKYCFatherSalaried").hide();
            } else if ($("#OccupationalDetails").val() == "OCCT_RETD") {
                $("#CKYCOccupationType").val("OCCT_RETD");
                $("#CKYCFatherSalaried").hide();
            }
            else if ($("#OccupationalDetails").val() == "OCCT_UEMP") {
                $("#CKYCOccupationType").val("OCCT_UEMP");
                $("#CKYCFatherSalaried").hide();
            }

        }
        else {
            $("#CKYCOccupationType").attr("style", "pointer-events: auto;");
            $("#CKYCOccupationType").val("");
        }
        //if ($(this).val() == "Others") { }

    });


    $("#OccupationalDetailsemployeeof").change(function () {//if Proposer Relation "Self" is selected,then member1 details will be same as contact details

        Employeeof();
    });

    $("#ProposerRelationship").change(function () {//if Proposer Relation "Self" is selected,then member1 details will be same as contact details

        setMember1Values();
        //setGender();
    });

    $("#InsuredMaritalStatus").change(function () {

        spouse();
    });

    //$("#InsuredTitle").change(function () {


    //    setGender();
    //});

    $("#NomineeTitle").change(function () {

        setNomineeGender();

    });

    $("#Nominee2Title").change(function () {

        setNominee2Gender();

    });

    $("#Nominee3Title").change(function () {

        setNominee3Gender();

    });
    $("#Nominee4Title").change(function () {

        setNominee4Gender();

    });
    $("#AppointeeTitle").change(function () {

        setAppointeeGender();

    });

    $("#Appointee2Title").change(function () {

        setAppointee2Gender();

    });

    $("#Appointee3Title").change(function () {

        setAppointee3Gender();

    });
    $("#Appointee4Title").change(function () {

        setAppointee4Gender();

    });


    // $("#yourdropdownid option:selected")
    $("#NomineeGender").change(function () {

        setNomineeRelationShip();

    });

    $("#Nominee2Gender").change(function () {

        setNominee2RelationShip();

    });

    $("#Nominee3Gender").change(function () {

        setNominee3RelationShip();

    });

    //$("#InsuredDOB").datepicker({
    //    changeMonth: true,
    //    changeYear: true,
    //    yearRange: 'c-82:c',
    //    dateFormat: 'dd-mm-yy',
    //    minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
    //    maxDate: '0',
    //    //onSelect: function () { $('#dvNomineeDOB').removeClass('Error'); },
    //    onSelect: function (value, ui) {

    //        var tdate = new Date();
    //        var currentyear = tdate.getFullYear(); //yields year

    //        //  var nDOB = $("#NomineeDOB").val();
    //        // var tdate1 = new Date(nDOB);
    //        var age = (currentyear - ui.selectedYear) * 12;
    //        // var date = $("#datetimepicker1").data("datetimepicker").getDate()
    //        // var age = (currentyear - year)*12;
    //        $("#agenominee1").val(age);
    //        if (age>=12) {
    //            $("#InsuredMaritalStatus").val("MAR_MRD");

    //        }
    //        $('#InsuredDOB').datepicker("destroy");
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

            //  var nDOB = $("#NomineeDOB").val();
            // var tdate1 = new Date(nDOB);
            var age = (currentyear - ui.selectedYear);
            //var age = currentyear - year;
            var dateselect = $('#NomineeDOB').datepicker('getDate');
            var mindateselect = new Date((new Date()).getFullYear() - 18, (new Date()).getMonth(), 1);
            var diff=0;
            //alert(age);
            if (age == 18) {
                diff = Math.round((dateselect.getTime() - mindateselect.getTime()) / 86400000);
                //var days = Math.round(currentyear.getTime() - tdate.getTime())
               // alert(diff);
                if (diff > 1) {
                    age = age - 1;
                }
                
            }
            // var date = $("#datetimepicker1").data("datetimepicker").getDate()
            // var age = (currentyear - year)*12;
            $("#agenominee1").val(age);
            if (age < 18) {
                $("#appointee").show();

            }
            else {
                $("#appointee").hide();
            }
            $('#dvNomineeDOB').removeClass('Error');
        }
    });
    $("#divNomineeDOB").click(function () { $("#NomineeDOB").datepicker("show"); if ($('#NomineeDOB').val() != "") { $('#dvNomineeDOB').removeClass('Error'); } });

    $("#Nominee2DOB").datepicker({
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

            //var nDOB = $("#Nominee2DOB").val();
            //var tdate1 = new Date(nDOB);
            //   var year = tdate1.getFullYear();
            // var date = $("#datetimepicker1").data("datetimepicker").getDate()
            var age = (currentyear - ui.selectedYear);
            var age = currentyear - year;
            alert(age);
            //if (age == 18) {
            //    var days = Math.round(currentyear.getTime() - tdate.getTime())
            //    alert(days);
            //}
            $("#agenominee2").val(age);
            if (age < 18) {
                $("#appointee2").show();
            }
            else {
                $("#appointee2").hide();
            }
            $('#dvNominee2DOB').removeClass('Error');
        }
    });
    $("#divNominee2DOB").click(function () { $("#Nominee2DOB").datepicker("show"); if ($('#Nominee2DOB').val() != "") { $('#dvNominee2DOB').removeClass('Error'); } });

    $("#Nominee3DOB").datepicker({
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

            // var nDOB = $("#Nominee3DOB").val();
            // var tdate1 = new Date(nDOB);
            // var year = tdate1.getFullYear();
            // var date = $("#datetimepicker1").data("datetimepicker").getDate()
            var age = (currentyear - ui.selectedYear);
            $("#agenominee3").val(age);
            if (age < 18) {
                $("#appointee3").show();

            }
            else {
                $("#appointee3").hide();
            }
            $('#dvNominee3DOB').removeClass('Error');
        }
    });
    $("#divNominee3DOB").click(function () { $("#Nominee3DOB").datepicker("show"); if ($('#Nominee3DOB').val() != "") { $('#dvNominee3DOB').removeClass('Error'); } });

    $("#Nominee4DOB").datepicker({
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

            // var nDOB = $("#Nominee4DOB").val();
            // var tdate1 = new Date(nDOB);
            // var year = tdate1.getFullYear();
            // var date = $("#datetimepicker1").data("datetimepicker").getDate()
            var age = (currentyear - ui.selectedYear);
            $("#agenominee4").val(age);
            if (age < 18) {
                $("#appointee4").show();

            }
            else {
                $("#appointee4").hide();
            }
            $('#dvNominee4DOB').removeClass('Error');
        }
    });
    $("#divNominee4DOB").click(function () { $("#Nominee4DOB").datepicker("show"); if ($('#Nominee4DOB').val() != "") { $('#dvNominee4DOB').removeClass('Error'); } });

    //$("#ContactDOB").datepicker({
    //    changeMonth: true,
    //    changeYear: true,
    //    yearRange: 'c-82:c',
    //    dateFormat: 'dd-mm-yy',
    //    minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
    //    maxDate: '-18y',
    //    onSelect: function () { $('#dvContactDOB').removeClass('Error'); }
    //});

    //$("#InsuredDOB").datepicker({
    //    changeMonth: true,
    //    changeYear: true,
    //    yearRange: 'c-82:c',
    //    dateFormat: 'dd-mm-yy',
    //    minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
    //    maxDate: '-18y',
    //    onSelect: function (value, ui) {
    //        
    //        var tdate = new Date();
    //        var currentyear = tdate.getFullYear(); //yields year
    //        var age = (currentyear - ui.selectedYear);
    //        $("#InsuredAge").val(age);
    //    }
    //});



    $("#dvContactDOB").click(function () { $("#ContactDOB").datepicker("show"); if ($('#ContactDOB').val() != "") { $('#dvContactDOB').removeClass('Error'); } });


    $("#EmployeeJoining").datepicker({

        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '0',
        onSelect: function () { $('#dvDateOfJoining').removeClass('Error'); }
    });
    $("#dvDateOfJoining").click(function () { $("#EmployeeJoining").datepicker("show"); if ($('#EmployeeJoining').val() != "") { $('#dvDateOfJoining').removeClass('Error'); } });


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

    $("#Appointee2DOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvAppointee2DOB').removeClass('Error'); }
    });
    $("#dvAppointee2DOB").click(function () { $("#Appointee2DOB").datepicker("show"); if ($('#Appointee2DOB').val() != "") { $('#dvAppointee2DOB').removeClass('Error'); } });

    $("#Appointee3DOB").datepicker({

        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvAppointee3DOB').removeClass('Error'); }
    });
    $("#dvAppointee3DOB").click(function () { $("#Appointee3DOB").datepicker("show"); if ($('#Appointee3DOB').val() != "") { $('#dvAppointee3DOB').removeClass('Error'); } });

    $("#Appointee4DOB").datepicker({

        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvAppointee4DOB').removeClass('Error'); }
    });
    $("#dvAppointee4DOB").click(function () { $("#Appointee4DOB").datepicker("show"); if ($('#Appointee4DOB').val() != "") { $('#dvAppointee4DOB').removeClass('Error'); } });

    $("#AddNominee").click(function () {

        AddNominee2();

    });

    $("#AddNominee1").click(function () {

        AddNominee3();
    });
    $("#AddNominee2").click(function () {

        AddNominee4();
    });

    $("#RemoveNominee").click(function () {

        RemoveNominee2();
    });

    $("#RemoveNominee1").click(function () {

        RemoveNominee3();
    });
    $("#RemoveNominee2").click(function () {

        RemoveNominee4();
    });


    $("#nominee1percentage").keyup(function () {
        total();
    });

    $("#nominee2percentage").keyup(function () {
        total();
    });

    $("#nominee3percentage").keyup(function () {
        //if ($("#n3p").val() != "")
        //{
        //    
        //    total();
        //}
        total();
    });

    $("#nominee4percentage").keyup(function () {

        total();
    });



});

function total() {

    var n1 = 0, n2 = 0, n3 = 0, n4 = 0;
    n1 = $("#nominee1percentage").val();
    n2 = $("#nominee2percentage").val();
    n3 = $("#nominee3percentage").val();
    n4 = $("#nominee4percentage").val();
    var total = 0
    total = total + parseInt(n1);
    if (n2 != "") {
        total = total + parseInt(n2);
    }

    $("#nomineepercentagetotal").val(total);
    if (n3 != "") {
        total = total + parseInt(n3);
    }
    if (n4 != "") {
        total = total + parseInt(n4);
    }
    $("#nomineepercentagetotal").val(total);

    //if (total > 100 || total < 100)
    //{
    //    alert("Please enter valid percentage");
    //}
}

function AddNominee2() {

    $("#n2").show();
    $("#AddNominee").prop("disabled", true);
    $("#RemoveNominee").removeAttr('disabled');
    $("#nominee1percentage").removeAttr('readonly');
    $("#nominee2percentage").removeAttr('readonly');
    $("#isnominee2added").val("yes");
}

function AddNominee3() {

    $("#n3").show();
    $("#AddNominee1").prop("disabled", true);
    $("#RemoveNominee1").removeAttr('disabled');
    $("#nominee3percentage").removeAttr('readonly');
    $("#isnominee3added").val("yes");
}
function AddNominee4() {

    $("#n4").show();
    $("#AddNominee2").prop("disabled", true);
    $("#RemoveNominee2").removeAttr('disabled');
    $("#nominee4percentage").removeAttr('readonly');
    $("#isnominee4added").val("yes");
}
function RemoveNominee2() {

    $("#n2").hide();
    $("#AddNominee").removeAttr('disabled');
    $("#RemoveNominee").prop("disabled", true);
    $("#nominee1percentage").val(100);
    $("#nominee2percentage").val(0);
    $("#nominee1percentage").prop("readonly", true);
    $("#nominee2percentage").prop("readonly", true);
    $("#isnominee2added").val("");
}

function RemoveNominee3() {
    $("#n3").hide();
    $("#AddNominee1").removeAttr('disabled');
    $("#RemoveNominee1").prop("disabled", true);
    $("#nominee3percentage").prop("readonly", true);
    $("#isnominee3added").val("");

}
function RemoveNominee4() {
    $("#n4").hide();
    $("#AddNominee2").removeAttr('disabled');
    $("#RemoveNominee2").prop("disabled", true);
    $("#nominee4percentage").prop("readonly", true);
    $("#isnominee4added").val("");

}

function setNomineeRelationShip() {

    var nomineegender = $("#NomineeGender").val();

    if (nomineegender == "GEN_M") {
        $("#NomineeRelationship option[name=Male]").show();
        $("#NomineeRelationship option[name=both]").show();
        $("#NomineeRelationship option[name=Female]").hide();
    }
    else if (nomineegender == "GEN_F") {
        $("#NomineeRelationship option[name=Male]").hide();
        $("#NomineeRelationship option[name=Female]").show();
        $("#NomineeRelationship option[name=both]").show();
    }
    else if ($('#NomineeTitle').val() == "TITL_DR" || $('#NomineeTitle').val() == "TITL_OTHERS") {

        $("#NomineeRelationship option[name=Male]").show();
        $("#NomineeRelationship option[name=Female]").show();
        $("#NomineeRelationship option[name=both]").show();
    }
}

function setNominee2RelationShip() {

    var nomineegender = $("#Nominee2Gender").val();

    if (nomineegender == "GEN_M") {
        $("#Nominee2Relationship option[name=Male]").show();
        $("#Nominee2Relationship option[name=both]").show();
        $("#Nominee2Relationship option[name=Female]").hide();
    }
    else if (nomineegender == "GEN_F") {
        $("#Nominee2Relationship option[name=Male]").hide();
        $("#Nominee2Relationship option[name=Female]").show();
        $("#Nominee2Relationship option[name=both]").show();
    }
    else if ($('#Nominee2Title').val() == "TITL_DR" || $('#Nominee2Title').val() == "TITL_OTHERS") {
        $("#Nominee2Relationship option[name=Male]").show();
        $("#Nominee2Relationship option[name=Female]").show();
        $("#Nominee2Relationship option[name=both]").show();
    }
}

function setNominee3RelationShip() {

    var nomineegender = $("#Nominee3Gender").val();

    if (nomineegender == "GEN_M") {
        $("#Nominee3Relationship option[name=Male]").show();
        $("#Nominee3Relationship option[name=both]").show();
        $("#Nominee3Relationship option[name=Female]").hide();
    }
    else if (nomineegender == "GEN_F") {
        $("#Nominee3Relationship option[name=Male]").hide();
        $("#Nominee3Relationship option[name=Female]").show();
        $("#Nominee3Relationship option[name=both]").show();
    }
    else if ($('#Nominee3Title').val() == "TITL_DR" || $('#Nominee3Title').val() == "TITL_OTHERS") {

        $("#Nominee3Relationship option[name=Male]").show();
        $("#Nominee3Relationship option[name=Female]").show();
        $("#Nominee3Relationship option[name=both]").show();
    }
}

function setNominee4RelationShip() {

    var nomineegender = $("#Nominee4Gender").val();

    if (nomineegender == "GEN_M") {
        $("#Nominee4Relationship option[name=Male]").show();
        $("#Nominee4Relationship option[name=both]").show();
        $("#Nominee4Relationship option[name=Female]").hide();
    }
    else if (nomineegender == "GEN_F") {
        $("#Nominee4Relationship option[name=Male]").hide();
        $("#Nominee4Relationship option[name=Female]").show();
        $("#Nominee4Relationship option[name=both]").show();
    }
    else if ($('#Nominee4Title').val() == "TITL_DR" || $('#Nominee4Title').val() == "TITL_OTHERS") {

        $("#Nominee4Relationship option[name=Male]").show();
        $("#Nominee4Relationship option[name=Female]").show();
        $("#Nominee4Relationship option[name=both]").show();
    }
}

function setAppointeeRelationShip() {

    var Appointeegender = $("#AppointeeGender").val();

    if (Appointeegender == "GEN_M") {
        $("#AppointeeRelationship option[name=Male]").show();
        $("#AppointeeRelationship option[name=both]").show();
        $("#AppointeeRelationship option[name=Female]").hide();
    }
    else if (Appointeegender == "GEN_F") {
        $("#AppointeeRelationship option[name=Male]").hide();
        $("#AppointeeRelationship option[name=Female]").show();
        $("#AppointeeRelationship option[name=both]").show();
    }
    else if ($('#AppointeeTitle').val() == "TITL_DR" || $('#AppointeeTitle').val() == "TITL_OTHERS") {

        $("#AppointeeRelationship option[name=Male]").show();
        $("#AppointeeRelationship option[name=Female]").show();
        $("#AppointeeRelationship option[name=both]").show();
    }
}

function setAppointee2RelationShip() {

    var Appointee2gender = $("#Appointee2Gender").val();

    if (Appointee2gender == "GEN_M") {
        $("#Appointee2Relationship option[name=Male]").show();
        $("#Appointee2Relationship option[name=both]").show();
        $("#Appointee2Relationship option[name=Female]").hide();
    }
    else if (Appointee2gender == "GEN_F") {
        $("#Appointee2Relationship option[name=Male]").hide();
        $("#Appointee2Relationship option[name=Female]").show();
        $("#Appointee2Relationship option[name=both]").show();
    }
    else if ($('#Appointee2Title').val() == "TITL_DR" || $('#Appointee2Title').val() == "TITL_OTHERS") {

        $("#Appointee2Relationship option[name=Male]").show();
        $("#Appointee2Relationship option[name=Female]").show();
        $("#Appointee2Relationship option[name=both]").show();
    }
}

function setAppointee3RelationShip() {

    var Appointee3gender = $("#Appointee3Gender").val();

    if (Appointee3gender == "GEN_M") {
        $("#Appointee3Relationship option[name=Male]").show();
        $("#Appointee3Relationship option[name=both]").show();
        $("#Appointee3Relationship option[name=Female]").hide();
    }
    else if (Appointee3gender == "GEN_F") {
        $("#Appointee3Relationship option[name=Male]").hide();
        $("#Appointee3Relationship option[name=Female]").show();
        $("#Appointee3Relationship option[name=both]").show();
    }
    else if ($('#Appointee3Title').val() == "TITL_DR" || $('#Appointee3Title').val() == "TITL_OTHERS") {

        $("#Appointee3Relationship option[name=Male]").show();
        $("#Appointee3Relationship option[name=Female]").show();
        $("#Appointee3Relationship option[name=both]").show();
    }
}
function setAppointee4RelationShip() {

    var Appointee4gender = $("#Appointee4Gender").val();

    if (Appointee4gender == "GEN_M") {
        $("#Appointee4Relationship option[name=Male]").show();
        $("#Appointee4Relationship option[name=both]").show();
        $("#Appointee4Relationship option[name=Female]").hide();
    }
    else if (Appointee4gender == "GEN_F") {
        $("#Appointee4Relationship option[name=Male]").hide();
        $("#Appointee4Relationship option[name=Female]").show();
        $("#Appointee4Relationship option[name=both]").show();
    }
    else if ($('#Appointee4Title').val() == "TITL_DR" || $('#Appointee4Title').val() == "TITL_OTHERS") {

        $("#Appointee4Relationship option[name=Male]").show();
        $("#Appointee4Relationship option[name=Female]").show();
        $("#Appointee4Relationship option[name=both]").show();
    }
}

function setAppointee() {
    var tdate = new Date();
    var currentyear = tdate.getFullYear(); //yields year
    // $(this).datepicker('getDate').getYear();
    var nDOB = $("#NomineeDOB").val();
    var tdate1 = new Date(nDOB);

    // var ndate = getDate(nDOB);
    var year = tdate1.getFullYear();
    // var date = $("#datetimepicker1").data("datetimepicker").getDate()
    //var age = currentyear - year;
    //alert(age);
    //if (age == 18) {
    //    var days = Math.round(currentyear.getTime() - tdate.getTime())
    //    alert(days);
    //}
    if (age < 18) {
        $("#appointee").show();
    }
    else {
        $("#appointee").hide();
    }
    //alert("hi");
}
function setNomineeGender() {

    if ($('#NomineeTitle').val() == "TITL_KMAR" || $('#NomineeTitle').val() == "TITL_MR" || $('#NomineeTitle').val() == "TITL_SHRI") {
        $("#NomineeGender").val("GEN_M");
        $('#NomineeGender').prop('readonly', true);
    }
    else if ($('#NomineeTitle').val() == "TITL_KMRI" || $('#NomineeTitle').val() == "TITL_MIS" || $('#NomineeTitle').val() == "TITL_MRS" || $('#NomineeTitle').val() == "TITL_SMT") {
        $("#NomineeGender").val("GEN_F");
        $('#NomineeGender').prop('readonly', true);
    }
    else if ($('#NomineeTitle').val() == "TITL_DR" || $('#NomineeTitle').val() == "TITL_OTHERS") {
        $("#NomineeGender").val("");
        $("#NomineeRelationship").val("");

    }
    else if ($('#NomineeTitle').val() == "") {
        $("#NomineeGender").val("");
        $("#NomineeRelationship").val("");

    }
    setNomineeRelationShip();


}

function setNominee2Gender() {

    if ($('#Nominee2Title').val() == "TITL_KMAR" || $('#Nominee2Title').val() == "TITL_MR" || $('#Nominee2Title').val() == "TITL_SHRI") {
        $("#Nominee2Gender").val("GEN_M");
        $('#Nominee2Gender').prop('readonly', true);
    }
    else if ($('#Nominee2Title').val() == "TITL_KMRI" || $('#Nominee2Title').val() == "TITL_MIS" || $('#Nominee2Title').val() == "TITL_MRS" || $('#Nominee2Title').val() == "TITL_SMT") {
        $("#Nominee2Gender").val("GEN_F");
        $('#Nominee2Gender').prop('readonly', true);
    }
    else if ($('#Nominee2Title').val() == "TITL_DR" || $('#Nominee2Title').val() == "TITL_OTHERS") {
        $("#Nominee2Gender").val("");
        $("#Nominee2Relationship").val("");

    }
    else if ($('#Nominee2Title').val() == "") {
        $("#Nominee2Gender").val("");
        $("#Nominee2Relationship").val("");

    }
    setNominee2RelationShip();


}

function setNominee3Gender() {

    if ($('#Nominee3Title').val() == "TITL_KMAR" || $('#Nominee3Title').val() == "TITL_MR" || $('#Nominee3Title').val() == "TITL_SHRI") {
        $("#Nominee3Gender").val("GEN_M");
        $('#Nominee3Gender').prop('readonly', true);
    }
    else if ($('#Nominee3Title').val() == "TITL_KMRI" || $('#Nominee3Title').val() == "TITL_MIS" || $('#Nominee3Title').val() == "TITL_MRS" || $('#Nominee3Title').val() == "TITL_SMT") {
        $("#Nominee3Gender").val("GEN_F");
        $('#Nominee3Gender').prop('readonly', true);
    }
    else if ($('#Nominee3Title').val() == "TITL_DR" || $('#Nominee3Title').val() == "TITL_OTHERS") {
        $("#Nominee3Gender").val("");
        $("#Nominee3Relationship").val("");

    }
    else if ($('#Nominee3Title').val() == "") {
        $("#Nominee3Gender").val("");
        $("#Nominee3Relationship").val("");

    }
    setNominee3RelationShip();


}
function setNominee4Gender() {

    if ($('#Nominee4Title').val() == "TITL_KMAR" || $('#Nominee4Title').val() == "TITL_MR" || $('#Nominee4Title').val() == "TITL_SHRI") {
        $("#Nominee4Gender").val("GEN_M");
        $('#Nominee4Gender').prop('readonly', true);
    }
    else if ($('#Nominee4Title').val() == "TITL_KMRI" || $('#Nominee4Title').val() == "TITL_MIS" || $('#Nominee4Title').val() == "TITL_MRS" || $('#Nominee4Title').val() == "TITL_SMT") {
        $("#Nominee4Gender").val("GEN_F");
        $('#Nominee4Gender').prop('readonly', true);
    }
    else if ($('#Nominee4Title').val() == "TITL_DR" || $('#Nominee4Title').val() == "TITL_OTHERS") {
        $("#Nominee4Gender").val("");
        $("#Nominee4Relationship").val("");

    }
    else if ($('#Nominee4Title').val() == "") {
        $("#Nominee4Gender").val("");
        $("#Nominee4Relationship").val("");

    }
    setNominee4RelationShip();


}
function setAppointeeGender() {

    if ($('#AppointeeTitle').val() == "TITL_KMAR" || $('#AppointeeTitle').val() == "TITL_MR" || $('#AppointeeTitle').val() == "TITL_SHRI") {
        $("#AppointeeGender").val("GEN_M");
        $('#AppointeeGender').prop('readonly', true);
    }
    else if ($('#AppointeeTitle').val() == "TITL_KMRI" || $('#AppointeeTitle').val() == "TITL_MIS" || $('#AppointeeTitle').val() == "TITL_MRS" || $('#AppointeeTitle').val() == "TITL_SMT") {
        $("#AppointeeGender").val("GEN_F");
        $('#AppointeeGender').prop('readonly', true);
    }
    else if ($('#AppointeeTitle').val() == "TITL_DR" || $('#AppointeeTitle').val() == "TITL_OTHERS") {
        $("#AppointeeGender").val("");
        $("#AppointeeRelationship").val("");

    }
    else if ($('#AppointeeTitle').val() == "") {
        $("#AppointeeGender").val("");
        $("#AppointeeRelationship").val("");

    }
    setAppointeeRelationShip();


}

function setAppointee2Gender() {

    if ($('#Appointee2Title').val() == "TITL_KMAR" || $('#Appointee2Title').val() == "TITL_MR" || $('#Appointee2Title').val() == "TITL_SHRI") {
        $("#Appointee2Gender").val("GEN_M");
        $('#Appointee2Gender').prop('readonly', true);
    }
    else if ($('#Appointee2Title').val() == "TITL_KMRI" || $('#Appointee2Title').val() == "TITL_MIS" || $('#Appointee2Title').val() == "TITL_MRS" || $('#Appointee2Title').val() == "TITL_SMT") {
        $("#Appointee2Gender").val("GEN_F");
        $('#Appointee2Gender').prop('readonly', true);
    }
    else if ($('#Appointee2Title').val() == "TITL_DR" || $('#Appointee2Title').val() == "TITL_OTHERS") {
        $("#Appointee2Gender").val("");
        $("#Appointee2Relationship").val("");

    }
    else if ($('#Appointee2Title').val() == "") {
        $("#Appointee2Gender").val("");
        $("#Appointee2Relationship").val("");

    }
    setAppointee2RelationShip();


}

function setAppointee3Gender() {

    if ($('#Appointee3Title').val() == "TITL_KMAR" || $('#Appointee3Title').val() == "TITL_MR" || $('#Appointee3Title').val() == "TITL_SHRI") {
        $("#Appointee3Gender").val("GEN_M");
        $('#Appointee3Gender').prop('readonly', true);
    }
    else if ($('#Appointee3Title').val() == "TITL_KMRI" || $('#Appointee3Title').val() == "TITL_MIS" || $('#Appointee3Title').val() == "TITL_MRS" || $('#Appointee3Title').val() == "TITL_SMT") {
        $("#Appointee3Gender").val("GEN_F");
        $('#Appointee3Gender').prop('readonly', true);
    }
    else if ($('#Appointee3Title').val() == "TITL_DR" || $('#Appointee3Title').val() == "TITL_OTHERS") {
        $("#Appointee3Gender").val("");
        $("#Appointee3Relationship").val("");

    }
    else if ($('#Appointee3Title').val() == "") {
        $("#Appointee3Gender").val("");
        $("#Appointee3Relationship").val("");

    }
    setAppointee3RelationShip();


}
function setAppointee4Gender() {

    if ($('#Appointee4Title').val() == "TITL_KMAR" || $('#Appointee4Title').val() == "TITL_MR" || $('#Appointee4Title').val() == "TITL_SHRI") {
        $("#Appointee4Gender").val("GEN_M");
        $('#Appointee4Gender').prop('readonly', true);
    }
    else if ($('#Appointee4Title').val() == "TITL_KMRI" || $('#Appointee4Title').val() == "TITL_MIS" || $('#Appointee4Title').val() == "TITL_MRS" || $('#Appointee4Title').val() == "TITL_SMT") {
        $("#Appointee4Gender").val("GEN_F");
        $('#Appointee4Gender').prop('readonly', true);
    }
    else if ($('#Appointee4Title').val() == "TITL_DR" || $('#Appointee4Title').val() == "TITL_OTHERS") {
        $("#Appointee4Gender").val("");
        $("#Appointee4Relationship").val("");

    }
    else if ($('#Appointee4Title').val() == "") {
        $("#Appointee4Gender").val("");
        $("#Appointee4Relationship").val("");

    }
    setAppointee4RelationShip();


}
function setGender() {
    if ($('#InsuredTitle').val() == "TITL_KMAR" || $('#InsuredTitle').val() == "TITL_MR" || $('#InsuredTitle').val() == "TITL_SHRI") {

        $("#InsuredGender").val("Male");
        $("#InsuredGenderM").addClass('active');
        $("#InsuredGenderF").removeClass('active');
        $('#InsuredGender').prop('readonly', true);
    }
    else if ($('#InsuredTitle').val() == "TITL_KMRI" || $('#InsuredTitle').val() == "TITL_MIS" || $('#InsuredTitle').val() == "TITL_MRS" || $('#InsuredTitle').val() == "TITL_SMT") {
        $("#InsuredGender").val("Female");
        $("#InsuredGenderF").addClass('active');
        $("#InsuredGenderM").removeClass('active');
        $('#InsuredGender').prop('readonly', true);
    }
    else if ($('#InsuredTitle').val() == "TITL_DR" || $('#InsuredTitle').val() == "TITL_OTHERS") {
        $("#InsuredGender").val("");
        $("#InsuredGenderF").removeClass('active');
        $("#InsuredGenderM").removeClass('active');
        $('#InsuredGender').prop('readonly', true);
    }

}

//function setGender(input) {
//    var dvid = "dv" + input[0].id;
//    if (input.val() == "TITL_KMAR" || input.val() == "TITL_MR" || input.val() == "TITL_SHRI") {
//        
//        $('#' + dvid).val("Male");
//        $('#' + dvid).addClass('active');
//        $('#' + dvid).removeClass('active');
//        $('#' + dvid).prop('readonly', true);
//    }
//    else if (input.val() == "TITL_KMRI" || input.val() == "TITL_MIS" || input.val() == "TITL_MRS" || input.val() == "TITL_SMT") {
//        $('#' + dvid).val("Female");
//        $('#' + dvid).addClass('active');
//        $('#' + dvid).removeClass('active');
//        $('#' + dvid).prop('readonly', true);
//    }
//    else if (input.val() == "TITL_DR" || input.val() == "TITL_OTHERS") {
//        $('#' + dvid).val("");
//        $('#' + dvid).removeClass('active');
//        $('#' + dvid).removeClass('active');
//        //  $('#InsuredGender').prop('readonly', true);
//    }

//}


function setMember1Values() {

    var $ContactName = $("#ContactFirstName");
    var $ContactLastName = $("#ContactLastName");
    var $ContactDOB = $('#ContactDOB');
    var $ContactTitle = $('#ContactTitle');
    var $ContactMobile = $("#ContactMobile");
    var $ContactEmail = $("#ContactEmail");
    //var titleval = $("#InsuredTitle option:selected").text();
    if ($('#ProposerRelationship').val() == "SELF") {
        // var title = $("#ContactTitle option:selected").val();
        $('#InsuredTitle').val($('#ContactTitle').val());
        $('#InsuredTitle').prop('readonly', true);
        //$('#InsuredTitle option[value=' + title + ']').attr("selected", "selected");
        //$('#InsuredTitle').prop('disabled', true);

        $('#InsuredFirstName').val($ContactName.val()).addClass("used");
        //  $("#SelfName").addClass("used");
        $('#InsuredFirstName').prop('readonly', true);
        $('#InsuredLastName').val($ContactLastName.val()).addClass("used");
        $("#InsuredLastName").prop('readonly', true);
        $('#InsuredMobile').val($ContactMobile.val()).addClass("used");;
        $("#InsuredMobile").prop('readonly', true);
        $('#InsuredEmail').val($ContactEmail.val()).addClass("used");;
        $("#InsuredEmail").prop('readonly', true);
        $('#InsuredDOB').val($ContactDOB.val());
        $('#InsuredDOB').datepicker("destroy");
        // $("#Member1DOB").prop('readonly', true);
    }
    else {

        $('#InsuredTitle').removeAttr('disabled');
        $('#InsuredFirstName').removeAttr('readonly');
        $('#InsuredMobile').removeAttr('readonly');
        $('#InsuredLastName').removeAttr('readonly');
        $('#InsuredEmail').removeAttr('readonly');

        $('#InsuredDOB').datepicker({
            changeMonth: true,
            changeYear: true,
            yearRange: 'c-82:c',
            dateFormat: 'dd-mm-yy'
        });




        //$("#dvInsuredDOB").click(function () { $("#InsuredDOB").datepicker("show"); if ($('#InsuredDOB').val() != "") { $('#dvInsuredDOB').removeClass('Error'); } });
    }
}


function Others() {
    if (document.getElementById("OccupationalDetails").value == "OCCT_OTHR") {
        //document.getElementById('Salaried').style.display = 'none';
        //document.getElementById('SelfEmployedBusiness').style.display = 'none';
        //document.getElementById('Student').style.display = 'none';
        $('#Salaried').hide();
        $('#SelfEmployedBusiness').hide();
        $('#Student').hide();
        $('#Others').show();
        $('#HDFCLife').hide();
        $('#HDFCBank').hide();
        $('#eofothers').hide();

    }
    else if (document.getElementById("OccupationalDetails").value == "OCCT_SALR") {
        $('#Salaried').show();
        $('#SelfEmployedBusiness').hide();
        $('#Student').hide();
        $('#Others').hide();
        $('#HDFCLife').hide();
        $('#HDFCBank').hide();
        $('#eofothers').hide();
    }
    else if (document.getElementById("OccupationalDetails").value == "OCCT_SEBS") {
        $('#Salaried').hide();
        $('#SelfEmployedBusiness').show();
        $('#Student').hide();
        $('#Others').hide();
        $('#HDFCLife').hide();
        $('#HDFCBank').hide();
        $('#eofothers').hide();
    }
    else if (document.getElementById("OccupationalDetails").value == "OCCT_STUD" || document.getElementById("OccupationalDetails").value == "OCCT_AGCT" || document.getElementById("OccupationalDetails").value == "OCCT_HOWF" || document.getElementById("OccupationalDetails").value == "OCCT_RETD" || document.getElementById("OccupationalDetails").value == "OCCT_UEMP") {
        $('#Salaried').hide();
        $('#SelfEmployedBusiness').hide();
        $('#Student').show();
        $('#Others').hide();
        $('#HDFCLife').hide();
        $('#HDFCBank').hide();
        $('#eofothers').hide();
    } else if (document.getElementById("OccupationalDetails").value == "") {
        $('#Salaried').hide();
        $('#SelfEmployedBusiness').hide();
        $('#Student').hide();
        $('#Others').hide();
        $('#HDFCLife').hide();
        $('#HDFCBank').hide();
        $('#eofothers').hide();

    }

}

function Employeeof() {
    //$("#OccupationalDetailsemployeeof").val("");
    if (document.getElementById("OccupationalDetailsemployeeof").value == "HDFCLife") {
        $('#HDFCLife').show();
        $('#eofothers').hide();
        // $('#Salaried').hide();
        $('#SelfEmployedBusiness').hide();
        $('#Student').hide();
        $('#Others').hide();
        $('#HDFCBank').hide();
        //$("#YearlyIncome").val('1').addClass('used');
        $("#YearlyIncome").attr('readonly', 'true');


    }
    else if (document.getElementById("OccupationalDetailsemployeeof").value == "Others") {
        $('#eofothers').show();
        $('#HDFCLife').hide();
        // $('#Salaried').hide();
        $('#SelfEmployedBusiness').hide();
        $('#Student').hide();
        $('#Others').hide();
        $('#HDFCBank').hide();


    }
    else if (document.getElementById("OccupationalDetailsemployeeof").value == "HDFCBank") {
        $('#HDFCBank').show();
        $('#eofothers').hide();
        $('#HDFCLife').hide();
        // $('#Salaried').hide();
        $('#SelfEmployedBusiness').hide();
        $('#Student').hide();
        $('#Others').hide();
        $("#HDFCBankYearlyIncome").val('1').addClass('used');
        $("#HDFCBankYearlyIncome").attr('readonly', 'true');

    }

    else if (document.getElementById("OccupationalDetailsemployeeof").value == "") {
        $('#HDFCLife').hide();
        $('#eofothers').hide();
        $('#Salaried').hide();
        $('#SelfEmployedBusiness').hide();
        $('#Student').hide();
        $('#Others').hide();
        $('#HDFCBank').hide();

    }

}

//function SelectGender(ID) {


//    if (ID == 'Male') {
//       $('#InsuredGender').val('Male');
//        $("#InsuredGenderM").addClass('active');
//        $("#InsuredGenderF").removeClass('active');
//        $('#NomineeGender').val('Male');
//        $("#NomineeGenderM").addClass('active');
//        $("#NomineeGenderF").removeClass('active');
//    }
//    else {

//        $('#InsuredGender').val('Female');
//        $("#InsuredGenderF").addClass('active');
//        $("#InsuredGenderM").removeClass('active');
//        $('#NomineeGender').val('Female');
//        $("#NomineeGenderF").addClass('active');
//        $("#NomineeGenderM").removeClass('active');
//    }

//}

function EducationLoan(ID) {


    if (ID == 'Yes') {
        $('#EducationLoan').val('Yes');
        $("#EducationLoanY").addClass('active');
        $("#EducationLoanN").removeClass('active');

    }
    else {

        $('#EducationLoan').val('No');
        $("#EducationLoanN").addClass('active');
        $("#EducationLoanY").removeClass('active');

    }

}
function PMH(ID) {


    if (ID == 'Yes') {
        $('#PMH').val('Yes');
        $("#PMHY").addClass('active');
        $("#PMHN").removeClass('active');

    }
    else {

        $('#PMH').val('No');
        $("#PMHN").addClass('active');
        $("#PMHY").removeClass('active');

    }

}
function PMHD(ID) {


    if (ID == 'Yes') {
        $('#PMHD').val('Yes');
        $("#PMHDY").addClass('active');
        $("#PMHDN").removeClass('active');

    }
    else {

        $('#PMHD').val('No');
        $("#PMHDN").addClass('active');
        $("#PMHDY").removeClass('active');

    }

}

function DisabledPerson(ID) {


    if (ID == 'Yes') {
        $('#DisabledPerson').val('Yes');
        $("#DisabledPersonY").addClass('active');
        $("#DisabledPersonN").removeClass('active');

    }
    else {

        $('#DisabledPerson').val('No');
        $("#DisabledPersonN").addClass('active');
        $("#DisabledPersonY").removeClass('active');

    }

}

function Criminal(ID) {


    if (ID == 'Yes') {
        $('#Criminal').val('Yes');
        $("#CriminalY").addClass('active');
        $("#CriminalN").removeClass('active');

    }
    else {

        $('#Criminal').val('No');
        $("#CriminalN").addClass('active');
        $("#CriminalY").removeClass('active');

    }

}



function politicalexposedperson(ID) {


    if (ID == 'Yes') {
        $('#politicalexposedperson').val('Yes');
        $("#politicalexposedpersonY").addClass('active');
        $("#politicalexposedpersonN").removeClass('active');

    }
    else {

        $('#politicalexposedperson').val('No');
        $("#politicalexposedpersonN").addClass('active');
        $("#politicalexposedpersonY").removeClass('active');

    }

}



function appointeeaddress(ID) {
    if (ID == 'Yes') {
        $('#Is_appointeeaddress').val('Yes');
        $("#appointeeaddressY").addClass('active');
        $("#appointeeaddressN").removeClass('active');
        $("#AppointeeAddress").hide();

    }
    else {
        $('#Is_appointeeaddress').val('No');
        $("#appointeeaddressN").addClass('active');
        $("#appointeeaddressY").removeClass('active');
        $("#AppointeeAddress").show();
        //$("#AppointeeHOUSEFLATNUMBER").val();
        //$("#AppointeeSTREETBUILDING").val();
        //$("#AppointeeLandmark").val();
        //$("#AppointeePinCode").val();
        //$("#AppointeeState").val();
        //$("#AppointeeCityName").val();
        //$("#AppointeeStateID").val();
        //$("#AppointeeCityID").val();
    }
}

function appointee2address(ID) {
    if (ID == 'Yes') {
        $('#appointee2address').val('Yes');
        $("#appointee2addressY").addClass('active');
        $("#appointee2addressN").removeClass('active');
        $("#AppointeeAddress2").hide();

    }
    else {
        $('#appointee2address').val('No');
        $("#appointee2addressN").addClass('active');
        $("#appointee2addressY").removeClass('active');
        $("#AppointeeAddress2").show();
    }
}

function appointee3address(ID) {
    if (ID == 'Yes') {
        $('#appointee3address').val('Yes');
        $("#appointee3addressY").addClass('active');
        $("#appointee3addressN").removeClass('active');
        $("#AppointeeAddress3").hide();

    }
    else {
        $('#appointee3address').val('No');
        $("#appointee3addressN").addClass('active');
        $("#appointee3addressY").removeClass('active');
        $("#AppointeeAddress3").show();
    }
}
function appointee4address(ID) {
    if (ID == 'Yes') {
        $('#appointee4address').val('Yes');
        $("#appointee4addressY").addClass('active');
        $("#appointee4addressN").removeClass('active');
        $("#AppointeeAddress4").hide();

    }
    else {
        $('#appointee4address').val('No');
        $("#appointee4addressN").addClass('active');
        $("#appointee4addressY").removeClass('active');
        $("#AppointeeAddress4").show();
    }
}
function naddress(ID) {
    if (ID == 'Yes') {
        $('#naddress').val('Yes');
        $("#naddressY").addClass('active');
        $("#naddressN").removeClass('active');
        $("#NomineeAddress").hide();

    }
    else {
        $('#naddress').val('No');
        $("#naddressN").addClass('active');
        $("#naddressY").removeClass('active');
        $("#NomineeAddress").show();
        //$("#NomineeHOUSEFLATNUMBER").val("");
        //$("#NomineeSTREETBUILDING").val("");
        //$("#NomineeLandmark").val("");
        //$("#NomineePinCode").val("");
        //$("#NomineeState").val("");
        //$("#NomineeCityName").val("");
        //$("#HDFCNomineeCityID").val("");
        //$("#NomineeStateID").val("");
    }
}

function n2address(ID) {
    if (ID == 'Yes') {
        $('#n2address').val('Yes');
        $("#n2addressY").addClass('active');
        $("#n2addressN").removeClass('active');
        $("#Nominee2Address").hide();

    }
    else {
        $('#n2address').val('No');
        $("#n2addressN").addClass('active');
        $("#n2addressY").removeClass('active');
        $("#Nominee2Address").show();
    }
}

function n3address(ID) {
    if (ID == 'Yes') {
        $('#n3address').val('Yes');
        $("#n3addressY").addClass('active');
        $("#n3addressN").removeClass('active');
        $("#Nominee3Address").hide();

    }
    else {
        $('#n3address').val('No');
        $("#n3addressN").addClass('active');
        $("#n3addressY").removeClass('active');
        $("#Nominee3Address").show();
    }
}
function n4address(ID) {
    if (ID == 'Yes') {
        $('#n4address').val('Yes');
        $("#n4addressY").addClass('active');
        $("#n4addressN").removeClass('active');
        $("#Nominee4Address").hide();

    }
    else {
        $('#n4address').val('No');
        $("#n4addressN").addClass('active');
        $("#n4addressY").removeClass('active');
        $("#Nominee4Address").show();
    }
}


function paddress(ID) {
    if (ID == 'Yes') {
        $('#paddress').val('Yes');
        $("#paddressY").addClass('active');
        $("#paddressN").removeClass('active');
        $("#padd").hide();

    }
    else {
        $('#paddress').val('No');
        $("#paddressN").addClass('active');
        $("#paddressY").removeClass('active');
        $("#padd").show();
    }
}





function NRI(ID) {

    if (ID == 'Yes') {
        $('#InsuredNRI').val('Yes');
        $("#NRIY").addClass('active');
        $("#NRIN").removeClass('active');
    }
    else {

        $('#InsuredNRI').val('No');
        $("#NRIN").addClass('active');
        $("#NRIY").removeClass('active');
    }

}


//function Married(ID) {

//    if (ID == 'Yes') {
//        $('#CKYCMaritalStatus').val('Yes');
//        $("#MarriedY").addClass('active');
//        $("#MarriedN").removeClass('active');
//        $("#MaritalStatus").show();
//    }
//    else {

//        $('#CKYCMaritalStatus').val('No');
//        $("#MarriedN").addClass('active');
//        $("#MarriedY").removeClass('active');
//        $("#MaritalStatus").hide();
//    }

//}



function spouse() {
    if (document.getElementById("InsuredMaritalStatus").value == "MAR_MRD") {

        $("#Spouse").show();
    }
    else {
        $("#Spouse").hide();
    }
}



function ValidateSection(id) {

    switch (id) {
        case 'hrefViewInput':
            return true;
            break;
        case 'hrefProposalInfo':
            return ValidateControls('0');
            break;
        case 'hrefPersonalInfo':
            return ValidateControls('1');
            break;
        //case 'hrefPersonalInfoSecond':
        //    return ValidateControls('2');
        //    break;
        //case 'hrefPersonalInfoThird':
        //    return ValidateControls('3');
        //    break;
        //case 'hrefPersonalInfoFourth':
        //    return ValidateControls('4');
        //    break;
        //case 'hrefPersonalInfoFifth':
        //    return ValidateControls('5');
        //    break;
        //case 'hrefPersonalInfoSixth':
        //    return ValidateControls('6');
        //    break;
        case 'hrefContactInfo':
            return ValidateControls('7');
            break;
        case 'hrefHealthHistoryTravelDetails':
            return ValidateControls('8');
            break;
        case 'hrefnominee':
            return ValidateControls('9');
            break;

        case 'hrefMedicalQuestionnaire':
            return ValidateControls('10');
            break;

        case 'hrefonline':
            return ValidateControls('11');
            break;

        case 'hrefCKYC':
            return ValidateControls('12');
            break;
        case 'hrefNEFT':
            return ValidateControls('14');
            break;
        case 'hrefOccupationDetails':
            return ValidateControls('14');
            break;
        case 'submitSendPaymentlink':
            return ValidateControls('13');
            break;
        default:
            return true;
            break;
    }
}
function ValidateControls(Opt) {

    var is_valid = 0;
    var $DisabledPerson = $("#DisabledPerson");
    var $Criminal = $("#Criminal");
    var $politicalexposedperson = $("#politicalexposedperson");
    var $ContactTitle = $("#ContactTitle");
    // var $ContactName = $("#ContactFirstName");
    var $ContactFirstName = $("#ContactFirstName")
    var $ContactLastName = $("#ContactLastName");
    var $ContactGender = $("#ContactGender");
    var $ContactMobile = $("#ContactMobile");
    var $ContactEmail = $("#ContactEmail");
    var $ContactDOB = $("#ContactDOB");
    var $EmployeeJoining = $("#EmployeeJoining");
    var $InsuredTitle = $("#InsuredTitle");
    var $InsuredFirstName = $("#InsuredFirstName");
    var $InsuredLastName = $("#InsuredLastName");
    var $InsuredFatherName = $("#InsuredFatherName");
    var $InsuredGender = $("#InsuredGender");
    var $InsuredMaritalStatus = $("#InsuredMaritalStatus");
    var $InsuredEducationQualification = $("#InsuredEducationQualification");
    var $InsuredNationality = $("#InsuredNationality");
    var $InsuredResidentStatus = $("#InsuredResidentStatus");
    var $InsuredBirthPlace = $("#InsuredBirthPlace");
    var $NRI = $("#InsuredNRI");
    var $InsuredMobile = $("#ContactMobile");
    var $InsuredEmail = $("#ContactEmail");
    var $InsuredDOB = $("#InsuredDOB");
    var $PassportNumber = $("#InsuredPassport");
    var $ContactSTREETBUILDING = $("#ContactSTREETBUILDING");
    var $ContactHOUSEFLATNUMBER = $("#ContactHOUSEFLATNUMBER");
    var $ContactLandmark = $("#ContactLandmark");
    var $ContactCityName = $("#ContactCityName");
    var $ContactState = $("#ContactState");
    var $ContactPinCode = $("#ContactPinCode");
    var $PostOfficeId = $("#PostOfficeId");
    var $OccupationalDetails = $('#OccupationalDetails');
    var $DistrictName = $("#DistrictName");
    var $StateName = $("#StateName");

    var $PermanentContactHOUSEFLATNUMBER = $("#PermanentContactHOUSEFLATNUMBER");
    var $PermanentContactSTREETBUILDING = $("#PermanentContactSTREETBUILDING");
    var $PermanentLandmark = $("#PermanentLandmark");
    var $PermanentCityName = $("#PermanentCityName");
    var $PermanentStateName = $("#PermanentStateName");
    var $PermanentPinCode = $("#PermanentPinCode");
    var $PermanentPostOfficeId = $("#PermanentPostOfficeId");
    var $NomineeTitle = $("#NomineeTitle");
    var $NomineeFirstName = $("#NomineeFirstName");
    var $NomineeLastName = $("#NomineeLastName");
    var $NomineeGender = $("#NomineeGender");
    var $NomineeMaritalStatus = $("#NomineeMaritalStatus");
    var $NomineeDOB = $("#NomineeDOB");
    var $NomineeRelation = $("#NomineeRelationship");
    var $NomineeHOUSEFLATNUMBER = $("#NomineeHOUSEFLATNUMBER");
    var $NomineeSTREETBUILDING = $("#NomineeSTREETBUILDING");
    var $NomineeLandmark = $("#NomineeLandmark");
    var $NomineePinCode = $("#NomineePinCode");
    var $NomineeState = $("#NomineeState");
    var $NomineeCityName = $("#NomineeCityName");
    var $NomineePostOfficeId = $("#NomineePostOfficeId");
    var $NomineeMobile = $("#NomineeMobile");
    var $NomineeEmail = $("#NomineeEmail");

    //Appointee fields
    var $AppointeeTitle = $("#AppointeeTitle");
    var $AppointeeFirstName = $("#AppointeeFirstName");
    var $AppointeeLastName = $("#AppointeeLastName");
    var $AppointeeGender = $("#AppointeeGender");
    var $AppointeeMaritalStatus = $("#AppointeeMaritalStatus");
    var $AppointeeDOB = $("#AppointeeDOB");
    var $AppointeeRelationship = $("#AppointeeRelationship");
    var $AppointeeHOUSEFLATNUMBER = $("#AppointeeHOUSEFLATNUMBER");
    var $AppointeeSTREETBUILDING = $("#AppointeeSTREETBUILDING");
    var $AppointeeLandmark = $("#AppointeeLandmark");
    var $AppointeePinCode = $("#AppointeePinCode");
    var $AppointeeState = $("#AppointeeState");
    var $AppointeeCityName = $("#AppointeeCityName");
    var $AppointeePostOfficeId = $("#AppointeePostOfficeId");

    //Appointee fields
    var $Appointee2Title = $("#Appointee2Title");
    var $Appointee2FirstName = $("#Appointee2FirstName");
    var $Appointee2LastName = $("#Appointee2LastName");
    var $Appointee2Gender = $("#Appointee2Gender");
    var $Appointee2MaritalStatus = $("#Appointee2MaritalStatus");
    var $Appointee2DOB = $("#Appointee2DOB");
    var $Appointee2Relationship = $("#Appointee2Relationship");
    var $Appointee2HOUSEFLATNUMBER = $("#Appointee2HOUSEFLATNUMBER");
    var $Appointee2STREETBUILDING = $("#Appointee2STREETBUILDING");
    var $Appointee2Landmark = $("#Appointee2Landmark");
    var $Appointee2PinCode = $("#Appointee2PinCode");
    var $Appointee2State = $("#Appointee2State");
    var $Appointee2CityName = $("#Appointee2CityName");
    var $Appointee2PostOfficeId = $("#Appointee2PostOfficeId");

    //Appointee fields
    var $Appointee3Title = $("#Appointee3Title");
    var $Appointee3FirstName = $("#Appointee3FirstName");
    var $Appointee3LastName = $("#Appointee3LastName");
    var $Appointee3Gender = $("#Appointee3Gender");
    var $Appointee3MaritalStatus = $("#Appointee3MaritalStatus");
    var $Appointee3DOB = $("#Appointee3DOB");
    var $Appointee3Relationship = $("#Appointee3Relationship");
    var $Appointee3HOUSEFLATNUMBER = $("#Appointee3HOUSEFLATNUMBER");
    var $Appointee3STREETBUILDING = $("#Appointee3STREETBUILDING");
    var $Appointee3Landmark = $("#Appointee3Landmark");
    var $Appointee3PinCode = $("#Appointee3PinCode");
    var $Appointee3State = $("#Appointee3State");
    var $Appointee3CityName = $("#Appointee3CityName");
    var $Appointee3PostOfficeId = $("#Appointee3PostOfficeId");

    //Appointee fields 4
    var $Appointee4Title = $("#Appointee4Title");
    var $Appointee4FirstName = $("#Appointee4FirstName");
    var $Appointee4LastName = $("#Appointee4LastName");
    var $Appointee4Gender = $("#Appointee4Gender");
    var $Appointee4MaritalStatus = $("#Appointee4MaritalStatus");
    var $Appointee4DOB = $("#Appointee4DOB");
    var $Appointee4Relationship = $("#Appointee4Relationship");
    var $Appointee4HOUSEFLATNUMBER = $("#Appointee4HOUSEFLATNUMBER");
    var $Appointee4STREETBUILDING = $("#Appointee4STREETBUILDING");
    var $Appointee4Landmark = $("#Appointee4Landmark");
    var $Appointee4PinCode = $("#Appointee4PinCode");
    var $Appointee4State = $("#Appointee4State");
    var $Appointee4CityName = $("#Appointee4CityName");
    var $Appointee4PostOfficeId = $("#Appointee4PostOfficeId");
    //Nominee2 fields
    var $Nominee2Title = $("#Nominee2Title");
    var $Nominee2FirstName = $("#Nominee2FirstName");
    var $Nominee2LastName = $("#Nominee2LastName");
    var $Nominee2Gender = $("#Nominee2Gender");
    var $Nominee2MaritalStatus = $("#Nominee2MaritalStatus");
    var $Nominee2DOB = $("#Nominee2DOB");
    var $Nominee2Relation = $("#Nominee2Relationship");
    var $Nominee2HOUSEFLATNUMBER = $("#Nominee2HOUSEFLATNUMBER");
    var $Nominee2STREETBUILDING = $("#Nominee2STREETBUILDING");
    var $Nominee2Landmark = $("#Nominee2Landmark");
    var $Nominee2PinCode = $("#Nominee2PinCode");
    var $Nominee2State = $("#Nominee2State");
    var $Nominee2CityName = $("#Nominee2CityName");
    var $Nominee2PostOfficeId = $("#Nominee2PostOfficeId");
    var $Nominee2Mobile = $("#Nominee2Mobile");
    var $Nominee2Email = $("#Nominee2Email");

    //Nominee3 Fields
    var $Nominee3Title = $("#Nominee3Title");
    var $Nominee3FirstName = $("#Nominee3FirstName");
    var $Nominee3LastName = $("#Nominee3LastName");
    var $Nominee3Gender = $("#Nominee3Gender");
    var $Nominee3MaritalStatus = $("#Nominee3MaritalStatus");
    var $Nominee3DOB = $("#Nominee3DOB");
    var $Nominee3Relation = $("#Nominee3Relationship");
    var $Nominee3HOUSEFLATNUMBER = $("#Nominee3HOUSEFLATNUMBER");
    var $Nominee3STREETBUILDING = $("#Nominee3STREETBUILDING");
    var $Nominee3Landmark = $("#Nominee3Landmark");
    var $Nominee3PinCode = $("#Nominee3PinCode");
    var $Nominee3State = $("#Nominee3State");
    var $Nominee3CityName = $("#Nominee3CityName");
    var $Nominee3PostOfficeId = $("#Nominee3PostOfficeId");
    var $Nominee3Mobile = $("#Nominee3Mobile");
    var $Nominee3Email = $("#Nominee3Email");
    //Nominee4 Fields
    var $Nominee4Title = $("#Nominee4Title");
    var $Nominee4FirstName = $("#Nominee4FirstName");
    var $Nominee4LastName = $("#Nominee4LastName");
    var $Nominee4Gender = $("#Nominee4Gender");
    var $Nominee4MaritalStatus = $("#Nominee4MaritalStatus");
    var $Nominee4DOB = $("#Nominee4DOB");
    var $Nominee4Relation = $("#Nominee4Relationship");
    var $Nominee4HOUSEFLATNUMBER = $("#Nominee4HOUSEFLATNUMBER");
    var $Nominee4STREETBUILDING = $("#Nominee4STREETBUILDING");
    var $Nominee4Landmark = $("#Nominee4Landmark");
    var $Nominee4PinCode = $("#Nominee4PinCode");
    var $Nominee4State = $("#Nominee4State");
    var $Nominee4CityName = $("#Nominee4CityName");
    var $Nominee4PostOfficeId = $("#Nominee4PostOfficeId");
    var $Nominee4Mobile = $("#Nominee4Mobile");
    var $Nominee4Email = $("#Nominee4Email");

    var $ProposerRelation = $("#ProposerRelationship");
    var $ProposerRelationId = $("#ProposerRelationId");
    // var $TermsAndConditions = $("input[name=TermCondition]:checked");
    var $TermsAndConditions = $("#TermsAndConditions");
    var $IsMediQuestionSelf = $("input[name=IsMediQuestionSelf]:checked");
    var $NomineeRelationId = $("#NomineeRelationID");
    var $NomineeRelation = $("#NomineeRelationship");
    var $Member1OccupationID = $("#Member1OccupationID");
    var $MemberNomineeName1 = $("#MemberNomineeName1");
    var $Member1MobileNumber = $("#Member1MobileNumber");
    var $RelianceSalutation = $("#RelianceSalutation");
    var $gstIdNumber = $("#GSTIN");
    var $OccupationalDetailsOthers = $("#OccupationalDetailsOthers");
    var $OccupationalDetailsemployeeof = $("#OccupationalDetailsemployeeof");
    var $OccupationalDetailsBusiness = $("#OccupationalDetailsBusiness");
    var $SelfEmployeeDesignation = $("#SelfEmployeeDesignation");
    var $EducationLoan = $("#EducationLoan");
    var $EmployeeID = $("#EmployeeID");
    var $DateOfJoining = $("#EmployeeJoining");
    var $EmployeeLocation = $("#EmployeeLocation");
    var $EmployeeDesignation = $("#EmployeeDesignation");
    var $NameOfPresentEmployer = $("#NameOfPresentEmployer");
    var $AddressOfPresentEmployer = $("#AddressOfPresentEmployer");

    var $CKYCOccupationType = $("#CKYCOccupationType");
    var $CKYCOccupationalDetails = $("#CKYCOccupationalDetails");
    var $CKYCFatherTitle = $("#CKYCFatherTitle");
    var $CKYCFatherFirstName = $("#CKYCFatherFirstName");
    var $CKYCFatherMiddleName = $("#CKYCFatherMiddleName");
    var $CKYCFatherLastName = $("#CKYCFatherLastName");
    var $CKYCMotherTitle = $("#CKYCMotherTitle");
    var $CKYCMotherFirstName = $("#CKYCMotherFirstName");
    var $CKYCMotherMiddleName = $("#CKYCMotherMiddleName");
    var $CKYCMotherLastName = $("#CKYCMotherLastName");
    var $CKYCMaritalStatus = $("#CKYCMaritalStatus");
    var $CKYCSpouseTitle = $("#CKYCSpouseTitle");
    var $CKYCSpouseFirstName = $("#CKYCSpouseFirstName");
    var $CKYCSpouseMiddleName = $("#CKYCSpouseMiddleName");
    var $CKYCSpouseLastName = $("#CKYCSpouseLastName");
    var $CKYCOccupationType = $("#CKYCOccupationType");
    var $CKYCCountryOfBirth = $("#CKYCCountryOfBirth");
    var $YearlyIncome = $("#YearlyIncome");
    var $YearlyIncomeOhters = $("#YearlyIncomeOhters");
    var $Height = $("#Height");
    var $Weight = $("#Weight");
    var $PMH = $("#PMH");
    var $PMHD = $("#PMHD");
    var $HDFCBankEmployeeID = $("#HDFCBankEmployeeID");
    var $HDFCBankEmployeeJoining = $("#HDFCBankEmployeeJoining");
    var $HDFCBankEmployeeLocation = $("#HDFCBankEmployeeLocation");
    var $HDFCBankEmployeeDesignation = $("#HDFCBankEmployeeDesignation");
    var $HDFCBankEmployeePanNo = $("#HDFCBankEmployeePanNo");
    var $PanNo = $("#PanNo");

    var $CommPreference = $("#CommPreference");


    /*------------------------------Proposal Details Client Validations -------------------------------*/

    //if (Opt == 0) {

    //    if ($ContactTitle.val() == 0) {$ContactTitle.addClass('Error'); is_valid = 1;
    //        $("#error_ContactTitle").html("Please Select Title");
    //    }
    //    else {
    //        $("#error_ContactTitle").html("");
    //        $ContactTitle.removeClass('Error');
    //    }



    //    if ($ContactFirstName.val() == "" ||  checkTextWithSpace($ContactFirstName) == false) {

    //        $('#dvContactFirstName').addClass('Error'); is_valid = 1;
    //        $("#error_ContactFirstName").html("Please Enter First Name");
    //    }
    //    else {
    //        $("#error_ContactFirstName").html(" ");
    //        $("#ContactFirstName").removeClass('Error');
    //        var result=CheckThreeIChar($ContactFirstName);
    //        if (result == false) {
    //            var result1 = onlyonespace($ContactFirstName);
    //            if (result == false) {
    //                CheckAtleastTwoCharacter($ContactFirstName);
    //            }
    //        }
    //    }

    //    if ($('#ContactLastName').val() == "" || checkTextWithSpace($ContactLastName) == false) {

    //        $('#dvContactLastName').addClass('Error'); is_valid = 1;
    //        $("#error_ContactLastName").html("Please Enter Last Name");
    //    }
    //    else {
    //        $("#error_ContactLastName").html("");
    //        $("#ContactLastName").removeClass('Error');
    //        var result = CheckThreeIChar($ContactLastName);
    //        if (result == false) {
    //            var result1=onlyonespace($ContactLastName);
    //            if (result1 == false) {
    //                CheckAtleastTwoCharacter($ContactLastName);
    //            }
    //        }
    //    }

    //    //if ($ContactName.val() == "" || checkText($ContactName) == false) { $('#dvContactName').addClass('Error'); is_valid = 1; }
    //    //else { $('#dvContactName').removeClass('Error'); }

    //    //if ($ContactLastName.val() == "" || checkText($ContactLastName) == false) { $('#dvContactLastName').addClass('Error'); is_valid = 1; }
    //    //else { $('#dvContactLastName').removeClass('Error'); }

    //    if ($ContactDOB.val() == "") {
    //        $('#dvContactDOB').addClass('Error'); is_valid = 1;
    //        $("#error_ContactDOB").html("Please Select DOB.");
    //    }
    //    else {
    //        $("#error_ContactDOB").html("");
    //        $('#dvContactDOB').removeClass('Error');
    //    }

    //    if ($ContactMobile.val() == "" || checkMobile($ContactMobile) == false) {
    //        $('#dvContactMobile').addClass('Error'); is_valid = 1;
    //        $("#error_ContactMobile").html("Please Enter Mobile Number.");
    //    }
    //    else {
    //        $("#error_ContactMobile").html("");
    //        $('#dvContactMobile').removeClass('Error');
    //    }

    //    if ($ContactEmail.val() == '' || checkEmail($ContactEmail) == false) {
    //        $('#dvContactEmail').addClass('Error'); is_valid = 1;
    //        $("#error_ContactEmail").html("Please Enter Valid Email.");
    //    }
    //    else {
    //        $("#error_ContactEmail").html("");
    //        $('#dvContactEmail').removeClass('Error');
    //    }

    //    //if ($SelfOccupationID.val() == 0) { $SelfOccupationID.addClass('Error'); is_valid = 1; }
    //    //else { $SelfOccupationID.removeClass('Error'); }

    //    if ($ContactGender.val() == '') {
    //        $('#divGender').addClass('Error'); is_valid = 1;
    //        $("#error_ContactGender").html("Please Select Gender");
    //    }
    //    else {
    //        $("#error_ContactGender").html("");
    //        $('#divGender').removeClass('Error');
    //    }

    //    //if (($gstIdNumber).val() != '') {
    //    //    
    //    //    var gstVal = $gstIdNumber.val();
    //    //    gstVal = gstVal.toUpperCase();
    //    //    var gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}Z[0-9]{1}/;
    //    //    var patternArray = gstVal.match(gstPattern);
    //    //    if (patternArray == null) {
    //    //        $('#dvGSTIN').addClass('Error');
    //    //        is_valid = 1;
    //    //    }
    //    //    else {
    //    //        $('#dvGSTIN').removeClass('Error');
    //    //    }
    //    //}
    //    //else {
    //    //    $('#dvGSTIN').removeClass('Error');
    //    //}

    //    if (is_valid == 0) {  return true; }
    //    else { return false; }
    //}


    /*------------------------------Insured Details Client Validations start-------------------------------*/
    if (Opt == 1) {

        if ($InsuredTitle.val() == 0 || $InsuredTitle.val() == null) {
            $InsuredTitle.addClass('Error'); is_valid = 1;
            $("#error_InsuredTitle").html("Please Select Title");
        }
        else {
            $("#error_InsuredTitle").html("");
            $InsuredTitle.removeClass('Error');
        }

        if ($InsuredFirstName.val() == "" || checkTextWithSpace($InsuredFirstName) == false) {

            $('#dvInsuredFirstName').addClass('Error'); is_valid = 1;
            $("#error_InsuredFirstName").html("Please Enter First Name");
        }
        else {
            $("#error_InsuredFirstName").html("");
            $("#dvInsuredFirstName").removeClass('Error');
            var result = CheckThreeIChar($InsuredFirstName);
            if (result == false) {
                var result1 = onlyonespace($InsuredFirstName);
                if (result1 == true) {
                    CheckAtleastTwoCharacter($InsuredFirstName);
                }
            } else {
                is_valid = 1;
            }


        }



        //if ($InsuredFirstName.val() == "" || checkText($InsuredFirstName) == false) { $('#dvInsuredFirstName').addClass('Error'); is_valid = 1; }
        //else { $('#dvInsuredFirstName').removeClass('Error'); }


        if ($InsuredLastName.val() == "" || checkTextWithSpace($InsuredLastName) == false) {
            $('#dvInsuredLastName').addClass('Error'); is_valid = 1;
            $("#error_InsuredLastName").html("Please Enter Last Name");
        }
        else {
            $("#error_InsuredLastName").html("");
            $("#dvInsuredLastName").removeClass('Error');
            var result = CheckThreeIChar($InsuredLastName);
            if (result == false) {
                var result1 = onlyonespace($InsuredLastName);
                if (result1 == true) {
                    CheckAtleastTwoCharacter($InsuredLastName);
                }
            } else {
                is_valid = 1;
            }


        }

        //if ($InsuredLastName.val() == "" || checkText($InsuredLastName) == false) { $('#dvInsuredLastName').addClass('Error'); is_valid = 1; }
        //else { $('#dvInsuredLastName').removeClass('Error'); }

        if ($InsuredGender.val() == '') {
            $('#InsuredGender').addClass('Error'); is_valid = 1;
            $("#error_InsuredGender").html("Please Select Gender");
        }
        else {
            $("#error_InsuredGender").html("");
            $('#InsuredGender').removeClass('Error');
        }

        if ($InsuredDOB.val() == "") {
            $('#dvInsuredDOB').addClass('Error'); is_valid = 1;
            $("#error_InsuredDOB").html("Please Select DOB.");
        }
        else {
            //var age = $("#ModelInsuredAge").val();
            //if ($("#InsuredAge").val() != age)
            //{
            //            $('#dvInsuredDOB').addClass('Error');
            //            is_valid = 1;
            //            $("#error_InsuredDOB").html("Please Select Valid DOB.");
            //            alert("Please Select Valid DOB.");
            //} else
            //{
            $("#error_InsuredDOB").html("");
            $('#dvInsuredDOB').removeClass('Error');
            //}

        }


        if ($InsuredFatherName.val() == "" || CheckAtleastTwoCharacter($InsuredFatherName) == false) {
            $('#dvInsuredFatherName').addClass('Error'); is_valid = 1;
            $("#error_InsuredFatherName").html("Please Enter Father Name.");
        }
        else {
            $("#error_InsuredFatherName").html("");
            $("#InsuredFatherName").removeClass('Error');
            var result = CheckThreeIChar($InsuredFatherName);
            if (result == true) {
                is_valid = 1;
            }
        }

        //if ($InsuredFatherName.val() == "") { $('#dvInsuredFatherName').addClass('Error'); is_valid = 1; }
        //else { $('#dvInsuredFatherName').removeClass('Error'); }

        if ($InsuredMaritalStatus.val() == "" || $InsuredMaritalStatus.val() == null) {
            $('#InsuredMaritalStatus').addClass('Error'); is_valid = 1;
            $("#error_InsuredMaritalStatus").html("Please Select Marital Status.");
        }
        else {
            $("#error_InsuredMaritalStatus").html("");
            $('#InsuredMaritalStatus').removeClass('Error');

        }

        if ($InsuredEducationQualification.val() == "" || $InsuredEducationQualification.val() == null) {
            $('#InsuredEducationQualification').addClass('Error'); is_valid = 1;
            $("#error_InsuredEducationQualification").html("Please Select Education Qualification.");
        }
        else {
            $("#error_InsuredEducationQualification").html("");
            $('#InsuredEducationQualification').removeClass('Error');
        }

        if ($InsuredNationality.val() == "" || $InsuredNationality.val() == null) {
            $('#InsuredNationality').addClass('Error'); is_valid = 1;
            $("#error_InsuredNationality").html("Please Select Nationality.");
        }
        else {
            $("#error_InsuredNationality").html("");
            $('#InsuredNationality').removeClass('Error');
        }

        if ($InsuredResidentStatus.val() == "" || $InsuredResidentStatus.val() == null) {
            $('#InsuredResidentStatus').addClass('Error'); is_valid = 1;
            $("#error_InsuredResidentStatus").html("Please Select Resident Status.");
        }
        else {
            $("#error_InsuredResidentStatus").html("");
            $('#InsuredResidentStatus').removeClass('Error');
        }

        if ($InsuredBirthPlace.val() == "" || checkText($InsuredBirthPlace) == false) {
            $('#dvInsuredBirthPlace').addClass('Error'); is_valid = 1;
            $("#error_InsuredBirthPlace").html("Please Enter BirthPlace.");
        }
        else {
            $("#error_InsuredBirthPlace").html("");
            $('#dvInsuredBirthPlace').removeClass('Error');
            var result = CheckThreeIChar($InsuredBirthPlace);
            if (result == true) {
                is_valid = 1;
            }
        }

        //if ($NRI.val() == "") { $('#divNRI').addClass('Error'); is_valid = 1; }
        //else { $('#divNRI').removeClass('Error'); }

        //if ($PassportNumber.val() == "" || checkPassport($PassportNumber) == false) {
        //    $('#dvPassportNumber').addClass('Error'); is_valid = 1;
        //    $("#error_InsuredPassport").html("Please Enter Valid Passport Number.");
        //}
        //else {
        //    $("#error_InsuredPassport").html("");
        //    $('#dvPassportNumber').removeClass('Error');
        //}

        //if ($ProposerRelation.val() == 0) {
        //    $ProposerRelation.addClass('Error'); is_valid = 1;
        //    $("#error_ProposerRelationship").html("Please Select Proposer Relation.");
        //}
        //else {
        //    $("#error_ProposerRelationship").html("");
        //    $ProposerRelation.removeClass('Error');
        //}

        //if ($NomineeRelationId.val() == "") { $NomineeRelationId.addClass('Error'); is_valid = 1; }
        //else { $NomineeRelationId.removeClass('Error'); }

        //if ($Member1OccupationID.val() == "") { $Member1OccupationID.addClass('Error'); is_valid = 1; }
        //else { $Member1OccupationID.removeClass('Error'); }

        //if ($MemberNomineeName1.val() == "") { $("#dvMemberNomineeName1").addClass('Error'); is_valid = 1; }
        //else {
        //    var data = $MemberNomineeName1.val();
        //    var arr = data.split(' ');
        //    if (arr[1] != null && arr[1] != "") { $("#dvMemberNomineeName1").removeClass('Error'); }
        //    else { $("#dvMemberNomineeName1").addClass('Error'); is_valid = 1; }
        //}

        if ($InsuredEmail.val() == '' || checkEmail($InsuredEmail) == false) {
            $('#dvContactEmail').addClass('Error'); is_valid = 1;
            $("#error_InsuredEmail").html("Please Enter Valid Email.");

        }
        else {
            $("#error_InsuredEmail").html("");
            $('#dvContactEmail').removeClass('Error');
        }




        if ($InsuredMobile.val() == "" || checkMobile($InsuredMobile) == false) {
            $('#dvContactMobile').addClass('Error'); is_valid = 1;
            $("#error_InsuredMobile").html("Please Enter Mobile Number.");
        }
        else {
            $("#error_InsuredMobile").html("");
            $('#dvContactMobile').removeClass('Error');
        }

        if ($DisabledPerson.val() == "") {
            $('#divDisabledPerson').addClass('Error'); is_valid = 1;
            $("#error_DisabledPerson").html("Please Select Yes/No.");
        }
        else {
            $("#error_DisabledPerson").html("");
            $('#divDisabledPerson').removeClass('Error');
        }

        if ($Criminal.val() == "") {
            $('#divCriminal').addClass('Error'); is_valid = 1;
            $("#error_Criminal").html("Please Select Yes/No.");
        }
        else {
            $("#error_Criminal").html("");
            $('#divCriminal').removeClass('Error');
        }


        if ($politicalexposedperson.val() == "") {
            $('#divpoliticalexposedperson').addClass('Error'); is_valid = 1;
            $("#error_politicalexposedperson").html("Please Select Yes/No.");
        }
        else {
            $("#error_politicalexposedperson").html("");
            $('#divpoliticalexposedperson').removeClass('Error');
        }




        if (is_valid == 0) {

            return true;
        }
        else { return false; }
    }

    if (Opt > 1 && Opt < 7) {

        var k = Opt;
        var $MemberName = $("#Member" + k + "Name");
        var $MemberLastName = $("#Member" + k + "LastName");

        var $ProposerRelationId = $("#ProposerRelationId" + k);
        var $NomineeRelationID = $("#NomineeRelationID" + k);
        var $PassportMember = $("#PassportMember" + k);
        var $MemberNomineeName = $("#MemberNomineeName" + k);


        if ($PassportMember.val() == "" || checkPassport($PassportMember) == false) { $('#dvPassportMember' + k).addClass('Error'); is_valid = 1; }
        else { $('#dvPassportMember' + k).removeClass('Error'); }

        if ($MemberName.val() == "" || checkText($MemberName) == false) { $('#dvMember' + k + 'Name').addClass('Error'); is_valid = 1; }
        else { $('#dvMember' + k + 'Name').removeClass('Error'); }

        if ($MemberLastName.val() == "" || checkText($MemberLastName) == false) { $('#dvMember' + k + 'LastName').addClass('Error'); is_valid = 1; }
        else { $('#dvMember' + k + 'LastName').removeClass('Error'); }

        if ($ProposerRelationId.val() == 0) { $ProposerRelationId.addClass('Error'); is_valid = 1; }
        else { $ProposerRelationId.removeClass('Error'); }

        if ($NomineeRelationID.val() == 0) { $NomineeRelationID.addClass('Error'); is_valid = 1; }
        else { $NomineeRelationID.removeClass('Error'); }

        if ($MemberNomineeName.val() == "" || checkTextWithSpace($MemberNomineeName) == false) { $('#dvMemberNomineeName' + k).addClass('Error'); is_valid = 1; }
        else {
            var data = $MemberNomineeName.val();
            var arr = data.split(' ');
            if (arr[1] != null && arr[1] != "") { $('#dvMemberNomineeName' + k).removeClass('Error'); }
            else { $('#dvMemberNomineeName' + k).addClass('Error'); is_valid = 1; }
        }

        if (is_valid == 0) {

            return true;
        }
        else { return false; }



    }   /*-----------------Current/Communication Address Client Validations--------------------*/
    else if (Opt == 7) {

        if ($ContactHOUSEFLATNUMBER.val() == '' || checkAddress1($ContactHOUSEFLATNUMBER) == false || CheckAtleastTwoCharacter($ContactHOUSEFLATNUMBER) == false) {
            $('#dvContactHOUSEFLATNUMBER').addClass('Error'); is_valid = 1;
            $("#error_ContactHOUSEFLATNUMBER").html("Please Enter HOUSE/FLAT NUMBER.");
        }
        else {
            CheckAddressHDFC($ContactHOUSEFLATNUMBER);
            $("#error_ContactHOUSEFLATNUMBER").html("");
            $('#dvContactHOUSEFLATNUMBER').removeClass('Error');
            var result = CheckThreeIChar($ContactHOUSEFLATNUMBER);
            if (result == true) {
                is_valid = 1;
            }

        }


        if ($ContactSTREETBUILDING.val() == '' || checkAddress1($ContactSTREETBUILDING) == false) {
            $('#dvContactSTREETBUILDING').addClass('Error'); is_valid = 1;
            $("#error_ContactSTREETBUILDING").html("Please Enter STREET BUILDING.");
        }
        else {
            CheckAddressHDFC($ContactSTREETBUILDING);
            $("#error_ContactSTREETBUILDING").html("");
            $('#dvContactSTREETBUILDING').removeClass('Error');
            // $('#dvContactHOUSEFLATNUMBER').removeClass('Error');
            var result = CheckThreeIChar($ContactSTREETBUILDING);
            if (result == true) {
                is_valid = 1;
            }
        }

        //if ($ContactSTREETBUILDING.val() == '' || checkAddress($ContactSTREETBUILDING) == false) { $('#dvContactSTREETBUILDING').addClass('Error'); is_valid = 1; }
        //else { $('#dvContactSTREETBUILDING').removeClass('Error'); }

        if ($ContactPinCode.val() == "" || $ContactPinCode.val().length != 6 || $ContactPinCode.val() < 110000 || checkPincode($ContactPinCode) == false) {

            $('#dvContactPinCode').addClass('Error'); is_valid = 1;
            $("#error_ContactPinCode").html("Please Enter PinCode.");
        }
        else {
            //$("#error_ContactPinCode").html("");
            //$('#dvContactPinCode').removeClass('Error');
            GetHDFCPositivePincode($ContactPinCode.val())
        }

        if ($ContactLandmark.val() == '' || checkAddress1($ContactLandmark) == false) {
            $('#dvContactLandmark').addClass('Error'); is_valid = 1;
            $("#error_ContactLandmark").html("Please Enter Landmark.");
        }
        else {
            CheckAddressHDFC($ContactLandmark);
            $("#error_ContactLandmark").html("");
            $('#dvContactLandmark').removeClass('Error');
            // $('#dvContactHOUSEFLATNUMBER').removeClass('Error');
            var result = CheckThreeIChar($ContactLandmark);
            if (result == true) {
                is_valid = 1;
            }
        }

        //if ($ContactLandmark.val() == '') { $('#dvContactLandmark').addClass('Error'); is_valid = 1; }
        //else { $('#dvContactLandmark').removeClass('Error'); }

        if ($ContactCityName.val() == '') {
            $('#dvContactCityName').addClass('Error'); is_valid = 1;
            $("#error_ContactCityName").html("Please Enter City.");
        }
        else {
            $("#error_ContactCityName").html("");
            $('#dvContactCityName').removeClass('Error');
        }

        if ($ContactState.val() == '') {
            $('#dvContactState').addClass('Error'); is_valid = 1;
            $("#error_ContactState").html("Please Enter State.");
        }
        else {
            $("#error_ContactState").html("");
            $('#dvContactState').removeClass('Error');
        }

        //if ($OccupationalDetails.val() == '' || $OccupationalDetails.val() == null) {
        //    $('#OccupationalDetails').addClass('Error'); is_valid = 1;
        //    $("#error_OccupationalDetails").html("Please Select Occupational Details.");
        //}
        //else {
        //    if ($OccupationalDetails.val() == 'Others') {
        //        if ($OccupationalDetailsOthers.val() == '') {
        //            $('#dvOccupationalDetailsOthers').addClass('Error'); is_valid = 1;
        //            $("#error_OccupationalDetailsOthers").html("Please Enter Occupational Details.");
        //        }
        //        else {
        //            var occupationothers = $("#OccupationalDetailsOthers").val().toLowerCase();
        //            if (occupationothers.includes('housewife') || occupationothers.includes('unemployed') || occupationothers.includes('agriculture') || occupationothers.includes('home maker') || occupationothers.includes('homemaker')) {

        //                $('#dvOccupationalDetailsOthers').addClass('Error'); is_valid = 1;
        //                $("#error_OccupationalDetailsOthers").html("Occupation Invalid.");
        //            }
        //            else {
        //                $("#error_OccupationalDetailsOthers").html("");
        //                $('#dvOccupationalDetailsOthers').removeClass('Error');
        //            }

        //        }
        //    }
        //    else if ($OccupationalDetails.val() == 'Salaried') {
        //        if ($OccupationalDetailsemployeeof.val() == '' || $OccupationalDetailsemployeeof.val() == null) {
        //            $('#OccupationalDetailsemployeeof').addClass('Error'); is_valid = 1;
        //            $("#error_OccupationalDetailsemployeeof").html("Please Select Employee Of.");
        //        }
        //        else {
        //            $("#error_OccupationalDetailsemployeeof").html("");
        //            $('#OccupationalDetailsemployeeof').removeClass('Error');

        //            if ($OccupationalDetailsemployeeof.val() == 'HDFCLife') {
        //                if ($EmployeeID.val() == '' || CheckAtleastTwoCharacter($EmployeeID) == false) {
        //                    $('#dvEmployeeID').addClass('Error'); is_valid = 1;
        //                    $("#error_EmployeeID").html("Please Enter Employee ID.");
        //                }
        //                else {
        //                    $("#error_EmployeeID").html("");
        //                    $('#dvEmployeeID').removeClass('Error');
        //                }

        //                if ($DateOfJoining.val() == '') {
        //                    $('#dvDateOfJoining').addClass('Error'); is_valid = 1;
        //                    $("#error_EmployeeJoining").html("Please Select Date Of Joining.");
        //                }
        //                else {
        //                    $("#error_EmployeeJoining").html("");
        //                    $('#dvDateOfJoining').removeClass('Error');
        //                }

        //                if ($EmployeeLocation.val() == '' || $EmployeeLocation.val() == null) {
        //                    $('#EmployeeLocation').addClass('Error'); is_valid = 1;
        //                    $("#error_EmployeeLocation").html("Please Enter Location.");
        //                }
        //                else {
        //                    $("#error_EmployeeLocation").html("");
        //                    $('#EmployeeLocation').removeClass('Error');
        //                }

        //                if ($EmployeeDesignation.val() == '') {
        //                    $('#dvEmployeeDesignation').addClass('Error'); is_valid = 1;
        //                    $("#error_EmployeeDesignation").html("Please Enter Designation.");
        //                }
        //                else {
        //                    $("#error_EmployeeDesignation").html("");
        //                    $('#dvEmployeeDesignation').removeClass('Error');
        //                    var value = onlyonespace($EmployeeDesignation);
        //                    if (value == false) {
        //                        is_valid = 1;
        //                    }
        //                }

        //                //if ($YearlyIncome.val() == '' || CheckWholeNumber($YearlyIncome) == false) { $('#dvYearlyIncome').addClass('Error'); is_valid = 1; }
        //                //else { $('#dvYearlyIncome').removeClass('Error'); }


        //                if ($("#SelectedQuote_NetPremium").val() > 50000) {

        //                    if ($('#PanNo').val() == '' || checkPAN($PanNo) == false) {
        //                        $('#dvPanNo').addClass('Error'); is_valid = 1;
        //                        $("#error_PanNo").html("Please Enter Pan No.");
        //                    }
        //                    else {
        //                        $("#error_PanNo").html("");
        //                        $('#dvPanNo').removeClass('Error');
        //                    }
        //                }
        //                //else {
        //                //    if ($PanNo.val() != '') {

        //                //        if (checkPAN($PanNo) == false) { $('#dvPanNo').addClass('Error'); is_valid = 1; }
        //                //        else {
        //                //            // $("#error_PanNo").html("");
        //                //            $('#dvPanNo').removeClass('Error');
        //                //        }
        //                //    }
        //                //}

        //            }


        //            else if ($OccupationalDetailsemployeeof.val() == 'HDFCBank') {
        //                if ($HDFCBankEmployeeID.val() == '') {
        //                    $('#dvHDFCBankEmployeeID').addClass('Error'); is_valid = 1;
        //                    $("#error_HDFCBankEmployeeID").html("Please Enter Employee ID.");
        //                }
        //                else {
        //                    $("#error_HDFCBankEmployeeID").html("");
        //                    $('#dvHDFCBankEmployeeID').removeClass('Error');
        //                }

        //                if ($HDFCBankEmployeeJoining.val() == '') {
        //                    $('#dvHDFCBankEmployeeJoining').addClass('Error'); is_valid = 1;
        //                    $("#error_HDFCBankEmployeeJoining").html("Please Select Date Of Joining.");
        //                }
        //                else {
        //                    $("#error_HDFCBankEmployeeJoining").html("");
        //                    $('#dvHDFCBankEmployeeJoining').removeClass('Error');
        //                }

        //                if ($HDFCBankEmployeeLocation.val() == '') {
        //                    $('#HDFCBankEmployeeLocation').addClass('Error'); is_valid = 1;
        //                    $("#error_HDFCBankEmployeeLocation").html("Please Enter Location.");
        //                }
        //                else {
        //                    $("#error_HDFCBankEmployeeLocation").html("");
        //                    $('#HDFCBankEmployeeLocation').removeClass('Error');
        //                }

        //                if ($HDFCBankEmployeeDesignation.val() == '') {
        //                    $('#dvHDFCBankEmployeeDesignation').addClass('Error'); is_valid = 1;
        //                    $("#error_HDFCBankEmployeeDesignation").html("Please Enter Designation.");
        //                }
        //                else {
        //                    $("#error_HDFCBankEmployeeDesignation").html("");
        //                    $('#dvHDFCBankEmployeeDesignation').removeClass('Error');
        //                }

        //                //if ($YearlyIncome.val() == '' || CheckWholeNumber($YearlyIncome) == false) { $('#dvYearlyIncome').addClass('Error'); is_valid = 1; }
        //                //else { $('#dvYearlyIncome').removeClass('Error'); }

        //                if ($("#SelectedQuote_NetPremium").val() > 100000) {
        //                    if ($('#HDFCBankEmployeePanNo').val() == '' || checkPAN($HDFCBankEmployeePanNo) == false) {
        //                        $('#dvHDFCBankEmployeePanNo').addClass('Error'); is_valid = 1;
        //                        $("#error_HDFCBankEmployeePanNo").html("Please Enter Pan No.");
        //                    }
        //                    else {
        //                        $("#error_HDFCBankEmployeePanNo").html("");
        //                        $('#dvHDFCBankEmployeePanNo').removeClass('Error');
        //                    }
        //                }
        //                else {
        //                    if ($HDFCBankEmployeePanNo.val() != '') {
        //                        if (checkPAN($HDFCBankEmployeePanNo) == false) { $('#dvHDFCBankEmployeePanNo').addClass('Error'); is_valid = 1; }
        //                        else { $('#dvHDFCBankEmployeePanNo').removeClass('Error'); }
        //                    }

        //                }
        //            }
        //            else if ($OccupationalDetailsemployeeof.val() == 'Others') {
        //                if ($OccupationalDetailsBusiness.val() == '' || $OccupationalDetailsBusiness.val() == null) {
        //                    $('#OccupationalDetailsBusiness').addClass('Error'); is_valid = 1;
        //                    $("#error_OccupationalDetailsBusiness").html("Please Select Business");
        //                }
        //                else {
        //                    $("#error_OccupationalDetailsBusiness").html("");
        //                    $('#OccupationalDetailsBusiness').removeClass('Error');
        //                }

        //                if ($NameOfPresentEmployer.val() == '') {
        //                    $('#dvNameOfPresentEmployer').addClass('Error'); is_valid = 1;
        //                    $("#error_NameOfPresentEmployer").html("Please Enter Name");
        //                }
        //                else {
        //                    $("#error_NameOfPresentEmployer").html("");
        //                    $('#dvNameOfPresentEmployer').removeClass('Error');
        //                }

        //                if ($AddressOfPresentEmployer.val() == '') {
        //                    $('#dvAddressOfPresentEmployer').addClass('Error'); is_valid = 1;
        //                    $("#error_AddressOfPresentEmployer").html("Please Enter Address");
        //                }
        //                else {
        //                    $("#error_AddressOfPresentEmployer").html("");
        //                    $('#dvAddressOfPresentEmployer').removeClass('Error');
        //                    var result = CheckThreeIChar($AddressOfPresentEmployer);
        //                    if (result == true) {
        //                        is_valid = 1;
        //                    }
        //                }

        //                if ($YearlyIncomeOhters.val() == '' || CheckWholeNumber($YearlyIncomeOhters) == false) {
        //                    $('#dvYearlyIncomeOthers').addClass('Error'); is_valid = 1;
        //                    $("#error_YearlyIncomeOhters").html("Please Enter Yearly Income");
        //                }
        //                else {
        //                    $("#error_YearlyIncomeOhters").html("");
        //                    $('#dvYearlyIncomeOthers').removeClass('Error');
        //                }



        //            }

        //            // $('#OccupationalDetailsemployeeof').removeClass('Error');
        //        }


        //    }
        //    else if ($OccupationalDetails.val() == 'SelfEmployedBusiness') {

        //        if ($SelfEmployeeDesignation.val() == '') {
        //            $('#dvSelfEmployeeDesignation').addClass('Error'); is_valid = 1;
        //            $("#error_SelfEmployeeDesignation").html("Please Enter Designation.");
        //        }
        //        else {
        //            $("#error_SelfEmployeeDesignation").html("");
        //            $('#dvSelfEmployeeDesignation').removeClass('Error');
        //        }
        //    }
        //    else if ($OccupationalDetails.val() == 'Student') {
        //        if ($EducationLoan.val() == '') {
        //            $('#divEducationLoan').addClass('Error'); is_valid = 1;
        //            $("#error_EducationLoan").html("Please Select Yes/No.");
        //        }
        //        else {
        //            $("#error_EducationLoan").html("");
        //            $('#divEducationLoan').removeClass('Error');
        //        }
        //    }
        //    $("#error_OccupationalDetails").html("");
        //    $('#OccupationalDetails').removeClass('Error');
        //}

        //if ($PostOfficeId.val() == 0 || checkAddress($PostOfficeId) == false || $PostOfficeId.val() == "") { $PostOfficeId.addClass('Error'); is_valid = 1; }
        //else { $PostOfficeId.removeClass('Error'); }

        if ($("#paddress").val() == '') {
            $('#divpaddress').addClass('Error'); is_valid = 1;
            $("#error_paddress").html("Please Select Yes/No.");
        }
        else {
            $("#error_paddress").html("");
            $('#divpaddress').removeClass('Error');
            if ($("#paddress").val() == "No") {

                if ($PermanentContactHOUSEFLATNUMBER.val() == '' || checkAddress1($PermanentContactHOUSEFLATNUMBER) == false || CheckAtleastTwoCharacter($PermanentContactHOUSEFLATNUMBER) == false) {
                    $('#dvPermanentContactHOUSEFLATNUMBER').addClass('Error'); is_valid = 1;
                    $("#error_PermanentContactHOUSEFLATNUMBER").html("Please Enter HOUSE/FLAT NUMBER.");
                }
                else {
                    CheckAddressHDFC($PermanentContactHOUSEFLATNUMBER);
                    $("#error_PermanentContactHOUSEFLATNUMBER").html("");
                    $('#dvPermanentContactHOUSEFLATNUMBER').removeClass('Error');
                    var result = CheckThreeIChar($PermanentContactHOUSEFLATNUMBER);
                    if (result == true) {
                        is_valid = 1;
                    }
                }

                //if ($PermanentContactHOUSEFLATNUMBER.val() == '' || checkAddress($PermanentContactHOUSEFLATNUMBER) == false) { $('#dvPermanentContactHOUSEFLATNUMBER').addClass('Error'); is_valid = 1; }
                //else { $('#dvPermanentContactHOUSEFLATNUMBER').removeClass('Error'); }

                //if ($PermanentContactSTREETBUILDING.val() == '' || checkAddress($PermanentContactSTREETBUILDING) == false) { $('#dvPermanentContactSTREETBUILDING').addClass('Error'); is_valid = 1; }
                //else { $('#dvPermanentContactSTREETBUILDING').removeClass('Error'); }

                if ($PermanentContactSTREETBUILDING.val() == '' || checkAddress1($PermanentContactSTREETBUILDING) == false) {
                    $('#dvPermanentContactSTREETBUILDING').addClass('Error'); is_valid = 1;
                    $("#error_PermanentContactSTREETBUILDING").html("Please Enter STREET BUILDING.");
                }

                else {
                    CheckAddressHDFC($PermanentContactSTREETBUILDING);
                    $("#error_PermanentContactSTREETBUILDING").html("");
                    $('#dvPermanentContactSTREETBUILDING').removeClass('Error');
                    var result = CheckThreeIChar($PermanentContactSTREETBUILDING);
                    if (result == true) {
                        is_valid = 1;
                    }
                }

                if ($PermanentPinCode.val() == "" || $PermanentPinCode.val().length != 6 || $PermanentPinCode.val() < 110000 || checkPincode($PermanentPinCode) == false) {
                    $('#dvPermanentPinCode').addClass('Error'); is_valid = 1;
                    $("#error_PermanentPinCode").html("Please Enter PermanentPinCode.");
                }
                else {
                    $("#error_PermanentPinCode").html("");
                    $('#dvPermanentPinCode').removeClass('Error');
                }

                if ($PermanentLandmark.val() == '' || checkAddress1($PermanentLandmark) == false) {
                    $('#dvPermanentLandmark').addClass('Error'); is_valid = 1;
                    //$("#error_PermanentPinCode").html("Please Enter PermanentPinCode.");
                }
                else {
                    CheckAddressHDFC($PermanentLandmark);
                    $("#error_PermanentLandmark").html("");
                    $('#dvPermanentLandmark').removeClass('Error');
                    var result = CheckThreeIChar($PermanentLandmark);
                    if (result == true) {
                        is_valid = 1;
                    }
                }


                //if ($PermanentLandmark.val() == '') {
                //    $('#dvPermanentLandmark').addClass('Error'); is_valid = 1;
                //    $("#error_PermanentLandmark").html("Please Enter Landmark.");
                //}
                //else {
                //    $("#error_PermanentLandmark").html("");
                //    $('#dvPermanentLandmark').removeClass('Error');
                //}

                if ($PermanentCityName.val() == '') {
                    $('#dvPermanentCityName').addClass('Error'); is_valid = 1;
                    $("#error_PermanentCityName").html("Please Enter City.");
                }
                else {
                    $("#error_PermanentCityName").html("");
                    $('#dvPermanentCityName').removeClass('Error');
                }

                if ($PermanentStateName.val() == '') {
                    $('#dvPermanentStateName').addClass('Error'); is_valid = 1;
                    $("#error_PermanentStateName").html("Please Enter State.");
                }
                else {
                    $("#error_PermanentStateName").html("");
                    $('#dvPermanentStateName').removeClass('Error');
                }

                //if ($PermanentPostOfficeId.val() == 0 || checkAddress($PermanentPostOfficeId) == false || $PermanentPostOfficeId.val() == "") { $PermanentPostOfficeId.addClass('Error'); is_valid = 1; }
                //else { $PermanentPostOfficeId.removeClass('Error'); }
            }


        }

        if ($CommPreference.val() == '' || $CommPreference.val() == null) {
            $('#CommPreference').addClass('Error'); is_valid = 1;
            $("#error_CommPreference").html("Please Enter Communication Preference.");
        }
        else {
            $("#error_CommPreference").html("");
            $('#CommPreference').removeClass('Error');
        }



        if (is_valid == 0) { return true; }
        else { return false; }
    }
    /*-----------------Health History And Travel Details Client Validations--------------------*/
    else if (Opt == 8) {

        var chkSelf = $('#IsMediQuestionSelf').is(':checked');
        if (!chkSelf) { $('#IsMediQuestionSelf').addClass('errorcheckbox'); is_valid = 1; }
        else { $('#IsMediQuestionSelf').removeClass('errorcheckbox'); }

        var medicalSelf = $("input[name='MedicalQuestionSelf']:checked").val();

        if (medicalSelf == 'Yes') {
            var $PEDdisease = $("#PEDdisease");
            var $PEDsufferingDate = $("#PEDsufferingDate");
            var $UnderMedication = $("input[name='UnderMedication']:checked").val();

            if ($PEDdisease.val() == '') { $PEDdisease.addClass('Error'); is_valid = 1; }
            else { $PEDdisease.removeClass('Error'); }

            if ($PEDsufferingDate.val() == '') { $PEDsufferingDate.addClass('Error'); is_valid = 1; }
            else { $PEDsufferingDate.removeClass('Error'); }

            if ($UnderMedication == '' || $UnderMedication === undefined) { $('#radioGroupUnderMedication').addClass('Error'); is_valid = 1; }
            else { $('#radioGroupUnderMedication').removeClass('Error'); }
        }

        if (is_valid == 0) { return true; }
        else { return false; }
    }
    //    /*------------------------------Nominee Details Validations ---------------------------*/
    //else if (Opt == 9) {
    //    if ($NomineeName.val() == "" || checkTextWithSpace($NomineeName) == false) { $("#dvNomineeName").addClass('Error'); is_valid = 1; }
    //    else {
    //        var data = $NomineeName.val();
    //        var arr = data.split(' ');
    //        if (arr[1] != null && arr[1] != "") { $("#dvNomineeName").removeClass('Error'); }
    //        else { $("#dvNomineeName").addClass('Error'); is_valid = 1; }
    //    }

    //    if ($NomineeDOB.val() == "") { $('#dvNomineeDOB').addClass('Error'); is_valid = 1; }
    //    else { $('#dvNomineeDOB').removeClass('Error'); }
    //}
    /*------------------------------End Policy Client Validations ---------------------------*/
    else if (Opt == 9) {


        if ($NomineeTitle.val() == 0 || $NomineeTitle.val() == null) {
            $('#NomineeTitle').addClass('Error'); is_valid = 1;
            $("#error_NomineeTitle").html("Please Select Title");
        }
        else {
            $("#error_NomineeTitle").html("");
            $('#NomineeTitle').removeClass('Error');
        }


        if ($NomineeFirstName.val() == "" || checkTextWithSpace($NomineeFirstName) == false) {

            $('#dvNomineeFirstName').addClass('Error'); is_valid = 1;
            $("#error_NomineeFirstName").html("Please Enter First Name");
        }
        else {
            $("#error_NomineeFirstName").html("");
            $('#dvNomineeFirstName').removeClass('Error');
            var result = CheckAtleastTwoCharacter($NomineeFirstName);
            if (result == true) {
                onlyonespace($NomineeFirstName);
            }
            var result1 = CheckThreeIChar($NomineeFirstName);
            if (result1 == true) {
                is_valid = 1;
            }
        }

        if ($NomineeLastName.val() == "" || checkTextWithSpace($NomineeLastName) == false) {
            $('#dvNomineeLastName').addClass('Error'); is_valid = 1;
            $("#error_NomineeLastName").html("Please Enter Last Name");
        }
        else {
            $("#error_NomineeLastName").html("");
            $('#dvNomineeLastName').removeClass('Error');
            var result = CheckAtleastTwoCharacter($NomineeLastName);
            if (result == true) {
                onlyonespace($NomineeLastName);
            }
            var result1 = CheckThreeIChar($NomineeLastName);
            if (result1 == true) {
                is_valid = 1;
            }
        }

        if ($NomineeDOB.val() == "") {
            $('#dvNomineeDOB').addClass('Error'); is_valid = 1;
            $("#error_NomineeDOB").html("Please Select DOB.");
        }
        else {
            $("#error_NomineeDOB").html("");
            $('#dvNomineeDOB').removeClass('Error');
        }


        if ($("#agenominee1").val() < 18) {
            if ($AppointeeTitle.val() == 0 || $AppointeeTitle.val() == null) {
                $('#AppointeeTitle').addClass('Error'); is_valid = 1;
                $("#error_AppointeeTitle").html("Please Select Title");
            }
            else {
                $("#error_AppointeeTitle").html("");
                $('#AppointeeTitle').removeClass('Error');
            }


            if ($AppointeeFirstName.val() == "" || checkTextWithSpace($AppointeeFirstName) == false) {

                $('#dvAppointeeFirstName').addClass('Error'); is_valid = 1;
                $("#error_AppointeeFirstName").html("Please Enter First Name");
            }
            else {
                $("#error_AppointeeFirstName").html("");
                $('#dvAppointeeFirstName').removeClass('Error');
                var result = CheckAtleastTwoCharacter($AppointeeFirstName);
                if (result == true) {
                    onlyonespace($AppointeeFirstName);
                }
                var result1 = CheckThreeIChar($AppointeeFirstName);
                if (result1 == true) {
                    is_valid = 1;
                }
            }

            if ($AppointeeLastName.val() == "" || checkTextWithSpace($AppointeeLastName) == false) {
                $('#dvAppointeeLastName').addClass('Error'); is_valid = 1;
                $("#error_AppointeeLastName").html("Please Enter Last Name");
            }
            else {
                $("#error_AppointeeLastName").html("");
                $('#dvAppointeeLastName').removeClass('Error');
                var result = CheckAtleastTwoCharacter($AppointeeLastName);
                if (result == true) {
                    onlyonespace($AppointeeLastName);
                }
                var result1 = CheckThreeIChar($AppointeeLastName);
                if (result1 == true) {
                    is_valid = 1;
                }
            }

            if ($AppointeeDOB.val() == "") {
                $('#dvAppointeeDOB').addClass('Error'); is_valid = 1;
                $("#error_AppointeeDOB").html("Please Select DOB.");
            }
            else {
                $("#error_AppointeeDOB").html("");
                $('#dvAppointeeDOB').removeClass('Error');
            }

            if ($AppointeeGender.val() == '' || $AppointeeGender.val() == null) {
                $('#AppointeeGender').addClass('Error'); is_valid = 1;
                $("#error_AppointeeGender").html("Please Select Gender");
            }
            else {
                $("#error_AppointeeGender").html("");
                $('#AppointeeGender').removeClass('Error');
            }

            if ($AppointeeMaritalStatus.val() == '' || $AppointeeMaritalStatus.val() == null) {
                $('#AppointeeMaritalStatus').addClass('Error'); is_valid = 1;
                $("#error_AppointeeMaritalStatus").html("Please Select Marital Status");
            }
            else {
                $("#error_AppointeeMaritalStatus").html("");
                $('#AppointeeMaritalStatus').removeClass('Error');
            }

            if ($("#AppointeeRelationship").val() == '' || $("#AppointeeRelationship").val() == null) {
                $('#AppointeeRelationship').addClass('Error'); is_valid = 1;
                $("#error_AppointeeRelationship").html("Please Select Marital Status");
            }
            else {
                $("#error_AppointeeRelationship").html("");
                $('#AppointeeRelationship').removeClass('Error');
            }



            if ($("#appointeeaddress").val() == '' || $("#Is_appointeeaddress").val() == "") {
                //$('#divappointeeaddress').addClass('Error');
                is_valid = 1;
                $("#error_appointeeaddress").html("Please Select Yes/No.");
            }
            else {
                $("#error_appointeeaddress").html("");
                $('#divappointeeaddress').removeClass('Error');
                if ($("#Is_appointeeaddress").val() == "No") {

                    if ($AppointeeHOUSEFLATNUMBER.val() == "" || checkAddress1($AppointeeHOUSEFLATNUMBER) == false || CheckAtleastTwoCharacter($AppointeeHOUSEFLATNUMBER) == false) {
                        $('#dvAppointeeHOUSEFLATNUMBER').addClass('Error'); is_valid = 1;
                        $("#error_AppointeeHOUSEFLATNUMBER").html("Please Enter HOUSE/FLAT NUMBER.");
                    }
                    else {
                        CheckAddressHDFC($AppointeeHOUSEFLATNUMBER);
                        $("#error_AppointeeHOUSEFLATNUMBER").html("");
                        $('#dvAppointeeHOUSEFLATNUMBER').removeClass('Error');
                        var result = CheckThreeIChar($AppointeeHOUSEFLATNUMBER);
                        if (result == true) {
                            is_valid = 1;
                        }
                    }

                    //if ($NomineeHOUSEFLATNUMBER.val() == '' || checkAddress($NomineeHOUSEFLATNUMBER) == false) { $('#dvNomineeHOUSEFLATNUMBER').addClass('Error'); is_valid = 1; }
                    //else { $('#dvNomineeHOUSEFLATNUMBER').removeClass('Error'); }

                    if ($AppointeeSTREETBUILDING.val() == '' || checkAddress1($AppointeeSTREETBUILDING) == false) {
                        $('#dvAppointeeSTREETBUILDING').addClass('Error'); is_valid = 1;
                        $("#error_AppointeeSTREETBUILDING").html("Please Enter STREET BUILDING.");
                    }
                    else {
                        CheckAddressHDFC($AppointeeSTREETBUILDING);
                        $("#error_AppointeeSTREETBUILDING").html("");
                        $("#dvAppointeeSTREETBUILDING").removeClass('Error');
                        var result = CheckThreeIChar($AppointeeSTREETBUILDING);
                        if (result == true) {
                            is_valid = 1;
                        }
                    }

                    //if ($NomineeSTREETBUILDING.val() == '' || checkAddress($NomineeSTREETBUILDING) == false) { $('#dvNomineeSTREETBUILDING').addClass('Error'); is_valid = 1; }
                    //else { $('#dvNomineeSTREETBUILDING').removeClass('Error'); }

                    if ($AppointeePinCode.val() == "" || $AppointeePinCode.val().length != 6 || $AppointeePinCode.val() < 110000 || checkPincode($AppointeePinCode) == false) {
                        $('#dvAppointeePinCode').addClass('Error'); is_valid = 1;
                        $("#error_AppointeePinCode").html("Please Enter PinCode.");
                    }
                    else {
                        $("#error_AppointeePinCode").html("");
                        $('#dvAppointeePinCode').removeClass('Error');
                    }

                    if ($AppointeeLandmark.val() == '' || checkAddress1($AppointeeLandmark) == false) {
                        $('#dvAppointeeLandmark').addClass('Error'); is_valid = 1;
                        $("#error_AppointeeLandmark").html("Please Enter Landmark.");
                    }
                    else {
                        CheckAddressHDFC($AppointeeLandmark);
                        $("#error_AppointeeLandmark").html("");
                        $('#dvAppointeeLandmark').removeClass('Error');
                        var result = CheckThreeIChar($AppointeeLandmark);
                        if (result == true) {
                            is_valid = 1;
                        }
                    }

                    //if ($NomineeLandmark.val() == '') { $('#dvNomineeLandmark').addClass('Error'); is_valid = 1; }
                    //else { $('#dvNomineeLandmark').removeClass('Error'); }

                    if ($AppointeeCityName.val() == '') {
                        $('#dvAppointeeCityName').addClass('Error'); is_valid = 1;
                        $("#error_AppointeeCityName").html("Please Enter City.");
                    }
                    else {
                        $("#error_AppointeeCityName").html("");
                        $('#dvAppointeeCityName').removeClass('Error');
                    }

                    if ($AppointeeState.val() == '') {
                        $('#dvAppointeeState').addClass('Error'); is_valid = 1;
                        $("#error_AppointeeState").html("Please Enter State.");
                    }
                    else {
                        $("#error_AppointeeState").html("");
                        $('#dvAppointeeState').removeClass('Error');
                    }

                    //if ($AppointeePostOfficeId.val() == 0 || checkAddress($AppointeePostOfficeId) == false || $AppointeePostOfficeId.val() == "") { $AppointeePostOfficeId.addClass('Error'); is_valid = 1; }
                    //else { $AppointeePostOfficeId.removeClass('Error'); }
                }

            }


        }

        if ($NomineeMobile.val() == "" || checkMobile($NomineeMobile) == false) {
            $('#dvNomineeMobile').addClass('Error'); is_valid = 1;
            $("#error_NomineeMobile").html("Please Enter Mobile Number.");
        }
        else {
            $("#error_NomineeMobile").html("");
            $('#dvNomineeMobile').removeClass('Error');
        }

        if ($NomineeGender.val() == '' || $NomineeGender.val() == null) {
            $('#NomineeGender').addClass('Error'); is_valid = 1;
            $("#error_NomineeGender").html("Please Select Gender");
        }
        else {
            $("#error_NomineeGender").html("");
            $('#NomineeGender').removeClass('Error');
        }

        if ($NomineeMaritalStatus.val() == '' || $NomineeMaritalStatus.val() == null) {
            $('#NomineeMaritalStatus').addClass('Error'); is_valid = 1;
            $("#error_NomineeMaritalStatus").html("Please Select Marital Status");
        }
        else {
            $("#error_NomineeMaritalStatus").html("");
            $('#NomineeMaritalStatus').removeClass('Error');
        }

        if ($NomineeRelation.val() == '' || $NomineeRelation.val() == null) {
            $('#NomineeRelationship').addClass('Error'); is_valid = 1;
            $("#error_NomineeRelationship").html("Please Select Relation");
        }
        else {
            $("#error_NomineeRelationship").html("");
            $('#NomineeRelationship').removeClass('Error');
        }

        if ($("#naddress").val() == '') {
            $('#divnaddress').addClass('Error'); is_valid = 1;
            $("#error_naddress").html("Please Select Yes/No.");
        }
        else {
            $("#error_naddress").html("");
            $('#divnaddress').removeClass('Error');
            if ($("#naddress").val() == "No") {

                if ($NomineeHOUSEFLATNUMBER.val() == '' || checkAddress1($NomineeHOUSEFLATNUMBER) == false || CheckAtleastTwoCharacter($NomineeHOUSEFLATNUMBER) == false) {
                    $('#dvNomineeHOUSEFLATNUMBER').addClass('Error'); is_valid = 1;
                    $("#error_NomineeHOUSEFLATNUMBER").html("Please Enter HOUSE/FLAT NUMBER.");
                }
                else {
                    CheckAddressHDFC($NomineeHOUSEFLATNUMBER);
                    $("#error_NomineeHOUSEFLATNUMBER").html("");
                    $('#dvNomineeHOUSEFLATNUMBER').removeClass('Error');
                    var result = CheckThreeIChar($NomineeHOUSEFLATNUMBER);
                    if (result == true) {
                        is_valid = 1;
                    }
                }

                //if ($NomineeHOUSEFLATNUMBER.val() == '' || checkAddress($NomineeHOUSEFLATNUMBER) == false) { $('#dvNomineeHOUSEFLATNUMBER').addClass('Error'); is_valid = 1; }
                //else { $('#dvNomineeHOUSEFLATNUMBER').removeClass('Error'); }

                if ($NomineeSTREETBUILDING.val() == '' || checkAddress1($NomineeSTREETBUILDING) == false) {
                    $('#dvNomineeSTREETBUILDING').addClass('Error'); is_valid = 1;
                    $("#error_NomineeSTREETBUILDING").html("Please Enter STREET BUILDING.");

                }
                else {
                    CheckAddressHDFC($NomineeSTREETBUILDING);
                    $("#error_NomineeSTREETBUILDING").html("");
                    $("#dvNomineeSTREETBUILDING").removeClass('Error');
                    var result = CheckThreeIChar($NomineeSTREETBUILDING);
                    if (result == true) {
                        is_valid = 1;
                    }
                }

                //if ($NomineeSTREETBUILDING.val() == '' || checkAddress($NomineeSTREETBUILDING) == false) { $('#dvNomineeSTREETBUILDING').addClass('Error'); is_valid = 1; }
                //else { $('#dvNomineeSTREETBUILDING').removeClass('Error'); }

                if ($NomineePinCode.val() == "" || $NomineePinCode.val().length != 6 || $NomineePinCode.val() < 110000 || checkPincode($NomineePinCode) == false) {
                    $('#dvNomineePinCode').addClass('Error'); is_valid = 1;
                    $("#error_NomineePinCode").html("Please Enter PinCode.");
                }
                else {
                    $("#error_NomineePinCode").html("");
                    $('#dvNomineePinCode').removeClass('Error');
                }

                if ($NomineeLandmark.val() == '' || checkAddress1($NomineeLandmark) == false) {
                    $('#dvNomineeLandmark').addClass('Error'); is_valid = 1;
                    $("#error_NomineeLandmark").html("Please Enter Landmark.");
                }
                else {
                    CheckAddressHDFC($NomineeLandmark);
                    $("#error_NomineeLandmark").html("");
                    $('#dvNomineeLandmark').removeClass('Error');
                    var result = CheckThreeIChar($NomineeLandmark);
                    if (result == true) {
                        is_valid = 1;
                    }
                }

                //if ($NomineeLandmark.val() == '') { $('#dvNomineeLandmark').addClass('Error'); is_valid = 1; }
                //else { $('#dvNomineeLandmark').removeClass('Error'); }

                if ($NomineeCityName.val() == '') {
                    $('#dvNomineeCityName').addClass('Error'); is_valid = 1;
                    $("#error_NomineeCityName").html("Please Enter City.");
                }
                else {
                    $("#error_NomineeCityName").html("");
                    $('#dvNomineeCityName').removeClass('Error');
                }

                if ($NomineeState.val() == '') {
                    $('#dvNomineeState').addClass('Error'); is_valid = 1;
                    $("#error_NomineeState").html("Please Enter State.");
                }
                else {
                    $("#error_NomineeState").html("");
                    $('#dvNomineeState').removeClass('Error');
                }

                //if ($NomineePostOfficeId.val() == 0 || checkAddress($NomineePostOfficeId) == false || $NomineePostOfficeId.val() == "") { $NomineePostOfficeId.addClass('Error'); is_valid = 1; }
                //else { $NomineePostOfficeId.removeClass('Error'); }
            }

        }

        if ($NomineeEmail.val() == '' || checkEmail($NomineeEmail) == false) {
            $('#dvNomineeEmail').addClass('Error'); is_valid = 1;
            $("#error_NomineeEmail").html("Please Enter Valid Email.");

        }
        else {
            $("#error_NomineeEmail").html("");
            $('#dvNomineeEmail').removeClass('Error');
        }

        $("#AddNominee").removeAttr('disabled');

        if ($("#isnominee2added").val() == "yes") {

            if ($Nominee2Title.val() == 0 || $Nominee2Title.val() == null) {
                $('#Nominee2Title').addClass('Error'); is_valid = 1;
                $("#error_Nominee2Title").html("Please Select Title");
            }
            else {
                $("#error_Nominee2Title").html("");
                $('#Nominee2Title').removeClass('Error');
            }


            if ($Nominee2FirstName.val() == "" || checkTextWithSpace($Nominee2FirstName) == false) {
                $('#dvNominee2FirstName').addClass('Error'); is_valid = 1;
                $("#error_Nominee2FirstName").html("Please Enter First Name");
            }
            else {
                $("#error_Nominee2FirstName").html("");
                $('#dvNominee2FirstName').removeClass('Error');
                var result = CheckAtleastTwoCharacter($Nominee2FirstName);
                if (result == true) {
                    onlyonespace($Nominee2FirstName);
                }
                var result1 = CheckThreeIChar($Nominee2FirstName);
                if (result1 == true) {
                    is_valid = 1;
                }
            }

            if ($Nominee2LastName.val() == "" || checkTextWithSpace($Nominee2LastName) == false) {
                $('#dvNominee2LastName').addClass('Error'); is_valid = 1;
                $("#error_Nominee2LastName").html("Please Enter Last Name");
            }
            else {
                $("#error_Nominee2LastName").html("");
                $('#dvNominee2LastName').removeClass('Error');
                var result = CheckAtleastTwoCharacter($Nominee2LastName);
                if (result == true) {
                    onlyonespace($Nominee2LastName);
                }
                var result1 = CheckThreeIChar($Nominee2LastName);
                if (result1 == true) {
                    is_valid = 1;
                }
            }

            if ($Nominee2DOB.val() == "") {
                $('#dvNominee2DOB').addClass('Error'); is_valid = 1;
                $("#error_Nominee2DOB").html("Please Select DOB.");
            }
            else {
                $("#error_Nominee2DOB").html("");
                $('#dvNominee2DOB').removeClass('Error');
            }

            if ($("#agenominee2").val() < 18) {
                if ($Appointee2Title.val() == 0 || $Appointee2Title.val() == null) {
                    $('#Appointee2Title').addClass('Error'); is_valid = 1;
                    $("#error_Appointee2Title").html("Please Select Title");
                }
                else {
                    $("#error_Appointee2Title").html("");
                    $('#Appointee2Title').removeClass('Error');
                }


                if ($Appointee2FirstName.val() == "" || checkTextWithSpace($Appointee2FirstName) == false) {

                    $('#dvAppointee2FirstName').addClass('Error'); is_valid = 1;
                    $("#error_Appointee2FirstName").html("Please Enter First Name");
                }
                else {
                    $("#error_Appointee2FirstName").html("");
                    $('#dvAppointee2FirstName').removeClass('Error');
                    var result = CheckAtleastTwoCharacter($Appointee2FirstName);
                    if (result == true) {
                        onlyonespace($Appointee2FirstName);
                    }
                    var result1 = CheckThreeIChar($Appointee2FirstName);
                    if (result1 == true) {
                        is_valid = 1;
                    }
                }

                if ($Appointee2LastName.val() == "" || checkTextWithSpace($Appointee2LastName) == false) {
                    $('#dvAppointee2LastName').addClass('Error'); is_valid = 1;
                    $("#error_Appointee2LastName").html("Please Enter Last Name");
                }
                else {
                    $("#error_Appointee2LastName").html("");
                    $('#dvAppointee2LastName').removeClass('Error');
                    var result = CheckAtleastTwoCharacter($Appointee2LastName);
                    if (result == true) {
                        onlyonespace($Appointee2LastName);
                    }
                    var result1 = CheckThreeIChar($Appointee2LastName);
                    if (result1 == true) {
                        is_valid = 1;
                    }
                }

                if ($Appointee2DOB.val() == "") {
                    $('#dvAppointee2DOB').addClass('Error'); is_valid = 1;
                    $("#error_Appointee2DOB").html("Please Select DOB.");
                }
                else {
                    $("#error_Appointee2DOB").html("");
                    $('#dvAppointee2DOB').removeClass('Error');

                }

                if ($Appointee2Gender.val() == '' || $Appointee2Gender.val() == null) {
                    $('#Appointee2Gender').addClass('Error'); is_valid = 1;
                    $("#error_Appointee2Gender").html("Please Select Gender");
                }
                else {
                    $("#error_Appointee2Gender").html("");
                    $('#Appointee2Gender').removeClass('Error');
                }

                if ($Appointee2Relationship.val() == '' || $Appointee2Relationship.val() == null) {
                    $('#Appointee2Relationship').addClass('Error'); is_valid = 1;
                    $("#error_Appointee2Relationship").html("Please Select Gender");
                }
                else {
                    $("#error_Appointee2Relationship").html("");
                    $('#Appointee2Relationship').removeClass('Error');
                }

                if ($Appointee2MaritalStatus.val() == '' || $Appointee2MaritalStatus.val() == null) {
                    $('#Appointee2MaritalStatus').addClass('Error'); is_valid = 1;
                    $("#error_Appointee2MaritalStatus").html("Please Select Marital Status");
                }
                else {
                    $("#error_Appointee2MaritalStatus").html("");
                    $('#Appointee2MaritalStatus').removeClass('Error');

                }

                if ($("#appointee2address").val() == '') {
                    //$('#divappointee2address').addClass('Error');
                    is_valid = 1;
                    $("#error_appointee2address").html("Please Select Yes/No.");
                }
                else {
                    $("#error_appointee2address").html("");
                    $('#divappointee2address').removeClass('Error');
                    if ($("#appointee2address").val() == "No") {

                        if ($Appointee2HOUSEFLATNUMBER.val() == '' || checkAddress1($Appointee2HOUSEFLATNUMBER) == false) {
                            $('#dvAppointee2HOUSEFLATNUMBER').addClass('Error'); is_valid = 1;
                            $("#error_Appointee2HOUSEFLATNUMBER").html("Please Enter HOUSE/FLAT NUMBER.");
                        }
                        else {
                            CheckAddressHDFC($Appointee2HOUSEFLATNUMBER);
                            $("#error_Appointee2HOUSEFLATNUMBER").html("");
                            $('#dvAppointee2HOUSEFLATNUMBER').removeClass('Error');
                            var result = CheckThreeIChar($Appointee2HOUSEFLATNUMBER);
                            if (result == true) {
                                is_valid = 1;
                            }

                        }

                        //if ($NomineeHOUSEFLATNUMBER.val() == '' || checkAddress($NomineeHOUSEFLATNUMBER) == false) { $('#dvNomineeHOUSEFLATNUMBER').addClass('Error'); is_valid = 1; }
                        //else { $('#dvNomineeHOUSEFLATNUMBER').removeClass('Error'); }

                        if ($Appointee2STREETBUILDING.val() == '' || checkAddress1($Appointee2STREETBUILDING) == false) {
                            $('#dvAppointee2STREETBUILDING').addClass('Error'); is_valid = 1;
                            $("#error_Appointee2STREETBUILDING").html("Please Enter STREET BUILDING.");
                        }
                        else {
                            CheckAddressHDFC($Appointee2STREETBUILDING);
                            $("#error_Appointee2STREETBUILDING").html("");
                            $("#dvAppointee2STREETBUILDING").removeClass('Error');
                            var result = CheckThreeIChar($Appointee2STREETBUILDING);
                            if (result == true) {
                                is_valid = 1;
                            }
                        }

                        //if ($NomineeSTREETBUILDING.val() == '' || checkAddress($NomineeSTREETBUILDING) == false) { $('#dvNomineeSTREETBUILDING').addClass('Error'); is_valid = 1; }
                        //else { $('#dvNomineeSTREETBUILDING').removeClass('Error'); }

                        if ($Appointee2PinCode.val() == "" || $Appointee2PinCode.val().length != 6 || $Appointee2PinCode.val() < 110000 || checkPincode($Appointee2PinCode) == false) {
                            $('#dvAppointee2PinCode').addClass('Error'); is_valid = 1;
                            $("#error_Appointee2PinCode").html("Please Enter PinCode.");
                        }
                        else {
                            $("#error_Appointee2PinCode").html("");
                            $('#dvAppointee2PinCode').removeClass('Error');
                        }

                        if ($Appointee2Landmark.val() == '' || checkAddress1($Appointee2Landmark) == false) {
                            $('#dvAppointee2Landmark').addClass('Error'); is_valid = 1;
                            $("#error_Appointee2Landmark").html("Please Enter Landmark.");
                        }
                        else {
                            CheckAddressHDFC($Appointee2Landmark);
                            $("#error_Appointee2Landmark").html("");
                            $('#dvAppointee2Landmark').removeClass('Error');
                            var result = CheckThreeIChar($Appointee2Landmark);
                            if (result == true) {
                                is_valid = 1;
                            }
                        }

                        //if ($NomineeLandmark.val() == '') { $('#dvNomineeLandmark').addClass('Error'); is_valid = 1; }
                        //else { $('#dvNomineeLandmark').removeClass('Error'); }

                        if ($Appointee2CityName.val() == '') {

                            $('#dvAppointee2CityName').addClass('Error'); is_valid = 1;
                            $("#error_Appointee2CityName").html("Please Enter City.");
                        }
                        else {
                            $("#error_Appointee2CityName").html("");
                            $('#dvAppointee2CityName').removeClass('Error');
                        }

                        if ($Appointee2State.val() == '') {
                            $('#dvAppointee2State').addClass('Error'); is_valid = 1;
                            $("#error_Appointee2State").html("Please Enter State.");
                        }
                        else {
                            $("#error_Appointee2State").html("");
                            $('#dvAppointee2State').removeClass('Error');
                        }

                        //if ($Appointee2PostOfficeId.val() == 0 || checkAddress1($Appointee2PostOfficeId) == false || $Appointee2PostOfficeId.val() == "") { $AppointeePostOfficeId.addClass('Error'); is_valid = 1; }
                        //else { $Appointee2PostOfficeId.removeClass('Error'); }
                    }

                }


            }


            if ($Nominee2Mobile.val() == "" || checkMobile($Nominee2Mobile) == false) {
                $('#dvNominee2Mobile').addClass('Error'); is_valid = 1;
                $("#error_Nominee2Mobile").html("Please Enter Mobile Number.");
            }
            else {
                $("#error_Nominee2Mobile").html("");
                $('#dvNominee2Mobile').removeClass('Error');
            }

            if ($Nominee2Gender.val() == '' || $Nominee2Gender.val() == null) {
                $('#Nominee2Gender').addClass('Error'); is_valid = 1;
                $("#error_Nominee2Gender").html("Please Select Gender");
            }
            else {
                $("#error_Nominee2Gender").html("");
                $('#Nominee2Gender').removeClass('Error');
            }

            if ($Nominee2MaritalStatus.val() == '' || $Nominee2MaritalStatus.val() == null) {
                $('#Nominee2MaritalStatus').addClass('Error'); is_valid = 1;
                $("#error_Nominee2MaritalStatus").html("Please Select Marital Status");
            }
            else {
                $("#error_Nominee2MaritalStatus").html("");
                $('#Nominee2MaritalStatus').removeClass('Error');
            }

            if ($Nominee2Relation.val() == '' || $Nominee2Relation.val() == null) {
                $('#Nominee2Relationship').addClass('Error'); is_valid = 1;
                $("#error_Nominee2Relationship").html("Please Select Relationship");
            }
            else {
                $("#error_Nominee2Relationship").html("");
                $('#Nominee2Relationship').removeClass('Error');
            }

            if ($("#n2address").val() == '') {
                //$('#divn2address').addClass('Error');
                is_valid = 1;
                $("#error_n2address").html("Please Select Yes/No.");
            }
            else {
                $("#error_n2address").html("");
                $('#divn2address').removeClass('Error');

                if ($("#n2address").val() == "No") {

                    if ($Nominee2HOUSEFLATNUMBER.val() == '' || checkAddress1($Nominee2HOUSEFLATNUMBER) == false) {
                        $('#dvNominee2HOUSEFLATNUMBER').addClass('Error'); is_valid = 1;
                        $("#error_Nominee2HOUSEFLATNUMBER").html("Please Enter HOUSE/FLAT NUMBER.");
                    }
                    else {
                        CheckAddressHDFC($Nominee2HOUSEFLATNUMBER);
                        $("#error_Nominee2HOUSEFLATNUMBER").html("");
                        $('#dvNominee2HOUSEFLATNUMBER').removeClass('Error');
                        var result = CheckThreeIChar($Nominee2HOUSEFLATNUMBER);
                        if (result == true) {
                            is_valid = 1;
                        }
                    }

                    //if ($NomineeHOUSEFLATNUMBER.val() == '' || checkAddress($NomineeHOUSEFLATNUMBER) == false) { $('#dvNomineeHOUSEFLATNUMBER').addClass('Error'); is_valid = 1; }
                    //else { $('#dvNomineeHOUSEFLATNUMBER').removeClass('Error'); }

                    if ($Nominee2STREETBUILDING.val() == '' || checkAddress1($Nominee2STREETBUILDING) == false) {
                        $('#dvNominee2STREETBUILDING').addClass('Error'); is_valid = 1;
                        $("#error_Nominee2STREETBUILDING").html("Please Enter STREET BUILDING.");
                    }
                    else {
                        CheckAddressHDFC($Nominee2STREETBUILDING);
                        $("#error_Nominee2STREETBUILDING").html("");
                        $("#dvNominee2STREETBUILDING").removeClass('Error');
                        var result = CheckThreeIChar($Nominee2STREETBUILDING);
                        if (result == true) {
                            is_valid = 1;
                        }
                    }

                    //if ($NomineeSTREETBUILDING.val() == '' || checkAddress($NomineeSTREETBUILDING) == false) { $('#dvNomineeSTREETBUILDING').addClass('Error'); is_valid = 1; }
                    //else { $('#dvNomineeSTREETBUILDING').removeClass('Error'); }

                    if ($Nominee2PinCode.val() == "" || $Nominee2PinCode.val().length != 6 || $Nominee2PinCode.val() < 110000 || checkPincode($Nominee2PinCode) == false) {
                        $('#dvNominee2PinCode').addClass('Error'); is_valid = 1;
                        $("#error_Nominee2PinCode").html("Please Enter PinCode.");
                    }
                    else {
                        $("#error_Nominee2PinCode").html("");
                        $('#dvNominee2PinCode').removeClass('Error');
                    }

                    if ($Nominee2Landmark.val() == '' || checkAddress1($Nominee2Landmark) == false) {
                        $('#dvNominee2Landmark').addClass('Error'); is_valid = 1;
                        $("#error_Nominee2Landmark").html("Please Enter Landmark.");
                    }
                    else {
                        CheckAddressHDFC($Nominee2Landmark);
                        $("#error_Nominee2Landmark").html("");
                        $('#dvNominee2Landmark').removeClass('Error');
                        var result = CheckThreeIChar($Nominee2Landmark);
                        if (result == true) {
                            is_valid = 1;
                        }
                    }

                    //if ($NomineeLandmark.val() == '') { $('#dvNomineeLandmark').addClass('Error'); is_valid = 1; }
                    //else { $('#dvNomineeLandmark').removeClass('Error'); }

                    if ($Nominee2CityName.val() == '') {
                        $('#dvNominee2CityName').addClass('Error'); is_valid = 1;
                        $("#error_Nominee2CityName").html("Please Enter City.");
                    }
                    else {
                        $("#error_Nominee2CityName").html("");
                        $('#dvNominee2CityName').removeClass('Error');
                        $('#dvNominee2CityName').removeClass('Error');
                    }

                    if ($Nominee2State.val() == '') {
                        $('#dvNominee2State').addClass('Error'); is_valid = 1;
                        $("#error_Nominee2State").html("Please Enter State.");
                    }
                    else {
                        $("#error_Nominee2State").html("");
                        $('#dvNominee2State').removeClass('Error');
                    }

                    //if ($Nominee2PostOfficeId.val() == 0 || checkAddress($Nominee2PostOfficeId) == false || $Nominee2PostOfficeId.val() == "") { $Nominee2PostOfficeId.addClass('Error'); is_valid = 1; }
                    //else { $Nominee2PostOfficeId.removeClass('Error'); }
                }


            }

            if ($Nominee2Email.val() == '' || checkEmail($Nominee2Email) == false) {
                $('#dvNominee2Email').addClass('Error'); is_valid = 1;
                $("#error_Nominee2Email").html("Please Enter Valid Email.");
            }
            else {
                $("#error_Nominee2Email").html("");
                $('#dvNominee2Email').removeClass('Error');
            }
        }



        if ($("#isnominee3added").val() == "yes") {
            if ($Nominee3Title.val() == 0 || $Nominee3Title.val() == null) {
                $('#Nominee3Title').addClass('Error'); is_valid = 1;
                $("#error_Nominee3Title").html("Please Select Title");

            }
            else {
                $("#error_Nominee3Title").html("");
                $('#Nominee3Title').removeClass('Error');
            }


            if ($Nominee3FirstName.val() == "" || checkTextWithSpace($Nominee3FirstName) == false) {
                $('#dvNominee3FirstName').addClass('Error'); is_valid = 1;
                $("#error_Nominee3FirstName").html("Please Enter First Name");
            }
            else {
                $("#error_Nominee3FirstName").html("");
                $('#dvNominee3FirstName').removeClass('Error');
                var result = CheckAtleastTwoCharacter($Nominee3FirstName);
                if (result == true) {
                    onlyonespace($Nominee3FirstName);
                }
                var result1 = CheckThreeIChar($Nominee3FirstName);
                if (result1 == true) {
                    is_valid = 1;
                }
            }

            if ($Nominee3LastName.val() == "" || checkTextWithSpace($Nominee3LastName) == false) {
                $('#dvNominee3LastName').addClass('Error'); is_valid = 1;
                $("#error_Nominee3LastName").html("Please Enter Last Name");
            }
            else {
                $("#error_Nominee3LastName").html("");
                $('#dvNominee3LastName').removeClass('Error');
                var result = CheckAtleastTwoCharacter($Nominee3LastName);
                if (result == true) {
                    onlyonespace($Nominee3LastName);
                }
                var result1 = CheckThreeIChar($Nominee3LastName);
                if (result1 == true) {
                    is_valid = 1;
                }
            }

            if ($Nominee3DOB.val() == "") {
                $('#dvNominee3DOB').addClass('Error'); is_valid = 1;
                $("#error_Nominee3DOB").html("Please Select DOB.");
            }
            else {
                $("#error_Nominee3DOB").html("");
                $('#dvNominee3DOB').removeClass('Error');
            }

            if ($("#agenominee3").val() < 18) {
                if ($Appointee3Title.val() == 0 || $Appointee3Title.val() == null) {
                    $('#Appointee3Title').addClass('Error'); is_valid = 1;
                    $("#error_Appointee3Title").html("Please Select Title");
                }
                else {
                    $("#error_Appointee3Title").html("");
                    $('#Appointee3Title').removeClass('Error');
                }


                if ($Appointee3FirstName.val() == "" || checkTextWithSpace($Appointee3FirstName) == false) {
                    $('#dvAppointee3FirstName').addClass('Error'); is_valid = 1;
                    $("#error_Appointee3FirstName").html("Please Enter First Name");
                }
                else {
                    $("#error_Appointee3FirstName").html("");
                    $('#dvAppointee3FirstName').removeClass('Error');
                    var result = CheckAtleastTwoCharacter($Appointee3FirstName);
                    if (result == true) {
                        onlyonespace($Appointee3FirstName);
                    }
                    var result1 = CheckThreeIChar($Appointee3FirstName);
                    if (result1 == true) {
                        is_valid = 1;
                    }
                }

                if ($Appointee3LastName.val() == "" || checkTextWithSpace($Appointee3LastName) == false) {
                    $('#dvAppointee3LastName').addClass('Error'); is_valid = 1;
                    $("#error_Appointee3LastName").html("Please Enter Last Name");
                }
                else {
                    $("#error_Appointee3LastName").html("");
                    $('#dvAppointee3LastName').removeClass('Error');
                    var result = CheckAtleastTwoCharacter($Appointee3LastName);
                    if (result == true) {
                        onlyonespace($Appointee3LastName);
                    }
                    var result1 = CheckThreeIChar($Appointee3LastName);
                    if (result1 == true) {
                        is_valid = 1;
                    }
                }

                if ($Appointee3DOB.val() == "") {
                    $('#dvAppointee3DOB').addClass('Error'); is_valid = 1;
                    $("#error_Appointee3DOB").html("Please Select DOB.");
                }
                else {
                    $("#error_Appointee3DOB").html("");
                    $('#dvAppointee3DOB').removeClass('Error');
                }

                if ($Appointee3Gender.val() == '' || $Appointee3Gender.val() == null) {
                    $('#Appointee3Gender').addClass('Error'); is_valid = 1;
                    $("#error_Appointee3Gender").html("Please Select Gender");
                }
                else {
                    $("#error_Appointee3Gender").html("");
                    $('#Appointee3Gender').removeClass('Error');
                }

                if ($Appointee3MaritalStatus.val() == '' || $Appointee3MaritalStatus.val() == null) {
                    $('#Appointee3MaritalStatus').addClass('Error'); is_valid = 1;
                    $("#error_Appointee3MaritalStatus").html("Please Select Marital Status");
                }
                else {
                    $("#error_Appointee3MaritalStatus").html("");
                    $('#Appointee3MaritalStatus').removeClass('Error');
                }

                if ($("#Appointee3Relationship").val() == '' || $("#Appointee3Relationship").val() == null) {
                    $('#Appointee3Relationship').addClass('Error'); is_valid = 1;
                    $("#error_Appointee3Relationship").html("Please Select Marital Status");
                }
                else {
                    $("#error_Appointee3Relationship").html("");
                    $('#Appointee3Relationship').removeClass('Error');
                }



                if ($("#appointee3address").val() == '') {
                    //$('#divappointee3address').addClass('Error');
                    is_valid = 1;
                    $("#error_appointee3address").html("Please Select Yes/No.");
                }
                else {
                    $("#error_appointee3address").html("");
                    $('#divappointee3address').removeClass('Error');
                    if ($("#appointee3address").val() == "No") {

                        if ($Appointee3HOUSEFLATNUMBER.val() == '' || checkAddress1($Appointee3HOUSEFLATNUMBER) == false) {
                            $('#dvAppointee3HOUSEFLATNUMBER').addClass('Error'); is_valid = 1;
                            $("#error_Appointee3HOUSEFLATNUMBER").html("Please Enter HOUSE/FLAT NUMBER.");
                        }
                        else {
                            CheckAddressHDFC($Appointee3HOUSEFLATNUMBER);
                            $("#error_Appointee3HOUSEFLATNUMBER").html("");
                            $('#dvAppointee3HOUSEFLATNUMBER').removeClass('Error');
                            var result = CheckThreeIChar($Appointee3HOUSEFLATNUMBER);
                            if (result == true) {
                                is_valid = 1;
                            }
                        }

                        //if ($NomineeHOUSEFLATNUMBER.val() == '' || checkAddress($NomineeHOUSEFLATNUMBER) == false) { $('#dvNomineeHOUSEFLATNUMBER').addClass('Error'); is_valid = 1; }
                        //else { $('#dvNomineeHOUSEFLATNUMBER').removeClass('Error'); }

                        if ($Appointee3STREETBUILDING.val() == '' || checkAddress1($Appointee3STREETBUILDING) == false) {
                            $('#dvAppointee3STREETBUILDING').addClass('Error'); is_valid = 1;
                            $("#error_Appointee3STREETBUILDING").html("Please Enter STREET BUILDING.");
                        }
                        else {
                            CheckAddressHDFC($Appointee3STREETBUILDING);
                            $("#error_Appointee3STREETBUILDING").html("");
                            $("#dvAppointee3STREETBUILDING").removeClass('Error');
                            var result = CheckThreeIChar($Appointee3STREETBUILDING);
                            if (result == true) {
                                is_valid = 1;
                            }
                        }

                        //if ($NomineeSTREETBUILDING.val() == '' || checkAddress($NomineeSTREETBUILDING) == false) { $('#dvNomineeSTREETBUILDING').addClass('Error'); is_valid = 1; }
                        //else { $('#dvNomineeSTREETBUILDING').removeClass('Error'); }

                        if ($Appointee3PinCode.val() == "" || $Appointee3PinCode.val().length != 6 || $Appointee3PinCode.val() < 110000 || checkPincode($Appointee3PinCode) == false) {
                            $('#dvAppointee3PinCode').addClass('Error'); is_valid = 1;
                            $("#error_Appointee3PinCode").html("Please Enter PinCode.");
                        }
                        else {
                            $('#dvAppointee3PinCode').removeClass('Error');
                            $("#error_Appointee3PinCode").html("");
                        }

                        if ($Appointee3Landmark.val() == '' || checkAddress1($Appointee3Landmark) == false) {
                            $('#dvAppointee3Landmark').addClass('Error'); is_valid = 1;
                            $("#error_Appointee3Landmark").html("Please Enter Landmark.");
                        }
                        else {
                            CheckAddressHDFC($Appointee3Landmark);
                            $("#error_Appointee3Landmark").html("");
                            $('#dvAppointee3Landmark').removeClass('Error');
                            var result = CheckThreeIChar($Appointee3Landmark);
                            if (result == true) {
                                is_valid = 1;
                            }
                        }

                        //if ($NomineeLandmark.val() == '') { $('#dvNomineeLandmark').addClass('Error'); is_valid = 1; }
                        //else { $('#dvNomineeLandmark').removeClass('Error'); }

                        if ($Appointee3CityName.val() == '') {
                            $('#dvAppointee3CityName').addClass('Error'); is_valid = 1;
                            $("#error_Appointee3CityName").html("Please Enter City.");
                        }
                        else {
                            $("#error_Appointee3CityName").html("");
                            $('#dvAppointee3CityName').removeClass('Error');
                        }

                        if ($Appointee3State.val() == '') {
                            $('#dvAppointee3State').addClass('Error'); is_valid = 1;
                            $("#error_Appointee3State").html("Please Enter State.");
                        }
                        else {
                            $('#dvAppointee3State').removeClass('Error');
                            $("#error_Appointee3State").html("");
                        }

                        //if ($Appointee3PostOfficeId.val() == 0 || checkAddress1($Appointee3PostOfficeId) == false || $Appointee3PostOfficeId.val() == "") { $Appointee3PostOfficeId.addClass('Error'); is_valid = 1; }
                        //else { $Appointee3PostOfficeId.removeClass('Error'); }
                    }

                }


            }


            if ($Nominee3Mobile.val() == "" || checkMobile($Nominee3Mobile) == false) {
                $('#dvNominee3Mobile').addClass('Error'); is_valid = 1;
                $("#error_Nominee3Mobile").html("Please Enter Mobile Number.");
            }
            else {
                $('#dvNominee3Mobile').removeClass('Error');
                $("#error_Nominee3Mobile").html("");
            }

            if ($Nominee3Gender.val() == '' || $Nominee3Gender.val() == null) {
                $('#Nominee3Gender').addClass('Error'); is_valid = 1;
                $("#error_Nominee3Gender").html("Please Select Gender");

            }
            else {
                $("#error_Nominee3Gender").html("");
                $('#Nominee3Gender').removeClass('Error');

            }

            if ($Nominee3MaritalStatus.val() == '' || $Nominee3MaritalStatus.val() == null) {
                $('#Nominee3MaritalStatus').addClass('Error'); is_valid = 1;
                $("#error_Nominee3MaritalStatus").html("Please Select Marital Status");
            }
            else {
                $("#error_Nominee3MaritalStatus").html("");
                $('#Nominee3MaritalStatus').removeClass('Error');
            }

            if ($Nominee3Relation.val() == '' || $Nominee3Relation.val() == null) {
                $('#Nominee3Relationship').addClass('Error'); is_valid = 1;
                $("#error_Nominee3Relationship").html("Please Select Relationship");
            }
            else {
                $("#error_Nominee3Relationship").html("");
                $('#Nominee3Relationship').removeClass('Error');
            }

            if ($("#n3address").val() == '') {
                //$('#divn3address').addClass('Error');
                is_valid = 1;
                $("#error_n3address").html("Please Select Yes/No.");
            }
            else {
                $("#error_n3address").html("");

                $('#divn3address').removeClass('Error');
                if ($("#n3address").val() == "No") {

                    if ($Nominee3HOUSEFLATNUMBER.val() == '' || checkAddress1($Nominee3HOUSEFLATNUMBER) == false) {
                        $('#dvNominee3HOUSEFLATNUMBER').addClass('Error'); is_valid = 1;
                        $("#error_Nominee3HOUSEFLATNUMBER").html("Please Enter HOUSE/FLAT NUMBER.");
                    }
                    else {
                        CheckAddressHDFC($Nominee3HOUSEFLATNUMBER);
                        $("#error_Nominee3HOUSEFLATNUMBER").html("");
                        $('#dvNominee3HOUSEFLATNUMBER').removeClass('Error');
                        var result = CheckThreeIChar($Nominee3HOUSEFLATNUMBER);
                        if (result == true) {
                            is_valid = 1;
                        }
                    }

                    //if ($nomineehouseflatnumber.val() == '' || checkaddress($nomineehouseflatnumber) == false) { $('#dvnomineehouseflatnumber').addclass('error'); is_valid = 1; }
                    //else { $('#dvnomineehouseflatnumber').removeclass('error'); }

                    if ($Nominee3STREETBUILDING.val() == '' || checkAddress1($Nominee3STREETBUILDING) == false) {
                        $('#dvNominee3STREETBUILDING').addClass('Error'); is_valid = 1;
                        $("#error_Nominee3STREETBUILDING").html("Please Enter STREET BUILDING.");
                    }
                    else {
                        CheckAddressHDFC($Nominee3STREETBUILDING);
                        $("#error_Nominee3STREETBUILDING").html("");
                        $("#dvNominee3STREETBUILDING").removeClass('Error');
                        var result = CheckThreeIChar($Nominee3STREETBUILDING);
                        if (result == true) {
                            is_valid = 1;
                        }
                    }

                    //if ($nomineestreetbuilding.val() == '' || checkaddress($nomineestreetbuilding) == false) { $('#dvnomineestreetbuilding').addclass('error'); is_valid = 1; }
                    //else { $('#dvnomineestreetbuilding').removeclass('error'); }

                    if ($Nominee3PinCode.val() == "" || $Nominee3PinCode.val().length != 6 || $Nominee3PinCode.val() < 110000 || checkPincode($Nominee3PinCode) == false) {
                        $('#dvnominee3pincode').addClass('Error'); is_valid = 1;
                        $("#error_Nominee3PinCode").html("Please Enter PinCode.");
                    }
                    else {
                        $("#error_Nominee3PinCode").html("");
                        $('#dvNominee3PinCode').removeClass('error');
                    }

                    if ($Nominee3Landmark.val() == '' || checkAddress1($Nominee3Landmark) == false) {
                        $('#dvNominee3Landmark').addClass('Error'); is_valid = 1;
                        $("#error_Nominee3Landmark").html("Please Enter Landmark.");
                    }
                    else {
                        CheckAddressHDFC($Nominee3Landmark);
                        $("#error_Nominee3Landmark").html("");
                        $('#dvNominee3Landmark').removeClass('Error');
                        var result = CheckThreeIChar($Nominee3Landmark);
                        if (result == true) {
                            is_valid = 1;
                        }
                    }

                    //if ($nomineelandmark.val() == '') { $('#dvnomineelandmark').addclass('error'); is_valid = 1; }
                    //else { $('#dvnomineelandmark').removeclass('error'); }

                    if ($Nominee3CityName.val() == '') {
                        $('#dvNominee3CityName').addClass('Error'); is_valid = 1;
                        $("#error_Nominee3CityName").html("Please Enter City.");
                    }
                    else {
                        $("#error_Nominee3CityName").html("");
                        $('#dvNominee3CityName').removeClass('Error');
                    }

                    if ($Nominee3State.val() == '') {
                        $('#dvNominee3State').addClass('Error'); is_valid = 1;
                        $("#error_Nominee3State").html("Please Enter State.");
                    }
                    else {
                        $('#dvNominee3State').removeClass('Error');
                        $("#error_Nominee3State").html("");
                    }

                    //if ($Nominee3PostOfficeId.val() == 0 || checkAddress($Nominee3PostOfficeId) == false || $("#Nominee3PostOfficeId").val() == "") { $Nominee3PostOfficeId.addClass('Error'); is_valid = 1; }
                    //else { $("#Nominee3PostOfficeId").removeClass('Error'); }
                }


            }

            if ($Nominee3Email.val() == '' || checkEmail($Nominee3Email) == false) {
                $('#dvNominee3Email').addClass('Error'); is_valid = 1;
                $("#error_Nominee3Email").html("Please Enter Valid Email.");
            }
            else {
                $("#error_Nominee3Email").html("");
                $('#dvNominee3Email').removeClass('Error');
            }


        }
        if ($("#isnominee4added").val() == "yes") {
            if ($Nominee4Title.val() == 0 || $Nominee4Title.val() == null) {
                $('#Nominee4Title').addClass('Error'); is_valid = 1;
                $("#error_Nominee4Title").html("Please Select Title");

            }
            else {
                $("#error_Nominee4Title").html("");
                $('#Nominee4Title').removeClass('Error');
            }


            if ($Nominee4FirstName.val() == "" || checkTextWithSpace($Nominee4FirstName) == false) {
                $('#dvNominee4FirstName').addClass('Error'); is_valid = 1;
                $("#error_Nominee4FirstName").html("Please Enter First Name");
            }
            else {
                $("#error_Nominee4FirstName").html("");
                $('#dvNominee4FirstName').removeClass('Error');
                var result = CheckAtleastTwoCharacter($Nominee4FirstName);
                if (result == true) {
                    onlyonespace($Nominee4FirstName);
                }
                var result1 = CheckThreeIChar($Nominee4FirstName);
                if (result1 == true) {
                    is_valid = 1;
                }
            }

            if ($Nominee4LastName.val() == "" || checkTextWithSpace($Nominee4LastName) == false) {
                $('#dvNominee4LastName').addClass('Error'); is_valid = 1;
                $("#error_Nominee4LastName").html("Please Enter Last Name");
            }
            else {
                $("#error_Nominee4LastName").html("");
                $('#dvNominee4LastName').removeClass('Error');
                var result = CheckAtleastTwoCharacter($Nominee4LastName);
                if (result == true) {
                    onlyonespace($Nominee4LastName);
                }
                var result1 = CheckThreeIChar($Nominee4LastName);
                if (result1 == true) {
                    is_valid = 1;
                }
            }

            if ($Nominee4DOB.val() == "") {
                $('#dvNominee4DOB').addClass('Error'); is_valid = 1;
                $("#error_Nominee4DOB").html("Please Select DOB.");
            }
            else {
                $("#error_Nominee4DOB").html("");
                $('#dvNominee4DOB').removeClass('Error');
            }

            if ($("#agenominee4").val() < 18) {
                if ($Appointee4Title.val() == 0 || $Appointee4Title.val() == null) {
                    $('#Appointee4Title').addClass('Error'); is_valid = 1;
                    $("#error_Appointee4Title").html("Please Select Title");
                }
                else {
                    $("#error_Appointee4Title").html("");
                    $('#Appointee4Title').removeClass('Error');
                }


                if ($Appointee4FirstName.val() == "" || checkTextWithSpace($Appointee4FirstName) == false) {
                    $('#dvAppointee4FirstName').addClass('Error'); is_valid = 1;
                    $("#error_Appointee4FirstName").html("Please Enter First Name");
                }
                else {
                    $("#error_Appointee4FirstName").html("");
                    $('#dvAppointee4FirstName').removeClass('Error');
                    var result = CheckAtleastTwoCharacter($Appointee4FirstName);
                    if (result == true) {
                        onlyonespace($Appointee4FirstName);
                    }
                    var result1 = CheckThreeIChar($Appointee4FirstName);
                    if (result1 == true) {
                        is_valid = 1;
                    }
                }

                if ($Appointee4LastName.val() == "" || checkTextWithSpace($Appointee4LastName) == false) {
                    $('#dvAppointee4LastName').addClass('Error'); is_valid = 1;
                    $("#error_Appointee4LastName").html("Please Enter Last Name");
                }
                else {
                    $("#error_Appointee4LastName").html("");
                    $('#dvAppointee4LastName').removeClass('Error');
                    var result = CheckAtleastTwoCharacter($Appointee4LastName);
                    if (result == true) {
                        onlyonespace($Appointee4LastName);
                    }
                    var result1 = CheckThreeIChar($Appointee4LastName);
                    if (result1 == true) {
                        is_valid = 1;
                    }
                }

                if ($Appointee4DOB.val() == "") {
                    $('#dvAppointee4DOB').addClass('Error'); is_valid = 1;
                    $("#error_Appointee4DOB").html("Please Select DOB.");
                }
                else {
                    $("#error_Appointee4DOB").html("");
                    $('#dvAppointee4DOB').removeClass('Error');
                }

                if ($Appointee4Gender.val() == '' || $Appointee4Gender.val() == null) {
                    $('#Appointee4Gender').addClass('Error'); is_valid = 1;
                    $("#error_Appointee4Gender").html("Please Select Gender");
                }
                else {
                    $("#error_Appointee4Gender").html("");
                    $('#Appointee4Gender').removeClass('Error');
                }

                if ($Appointee4MaritalStatus.val() == '' || $Appointee4MaritalStatus.val() == null) {
                    $('#Appointee4MaritalStatus').addClass('Error'); is_valid = 1;
                    $("#error_Appointee4MaritalStatus").html("Please Select Marital Status");
                }
                else {
                    $("#error_Appointee4MaritalStatus").html("");
                    $('#Appointee4MaritalStatus').removeClass('Error');
                }

                if ($("#Appointee4Relationship").val() == '' || $("#Appointee4Relationship").val() == null) {
                    $('#Appointee4Relationship').addClass('Error'); is_valid = 1;
                    $("#error_Appointee4Relationship").html("Please Select Marital Status");
                }
                else {
                    $("#error_Appointee4Relationship").html("");
                    $('#Appointee4Relationship').removeClass('Error');
                }



                if ($("#appointee4address").val() == '') {
                    //$('#divappointee4address').addClass('Error');
                    is_valid = 1;
                    $("#error_appointee4address").html("Please Select Yes/No.");
                }
                else {
                    $("#error_appointee4address").html("");
                    $('#divappointee4address').removeClass('Error');
                    if ($("#appointee4address").val() == "No") {

                        if ($Appointee4HOUSEFLATNUMBER.val() == '' || checkAddress1($Appointee4HOUSEFLATNUMBER) == false) {
                            $('#dvAppointee4HOUSEFLATNUMBER').addClass('Error'); is_valid = 1;
                            $("#error_Appointee4HOUSEFLATNUMBER").html("Please Enter HOUSE/FLAT NUMBER.");
                        }
                        else {
                            CheckAddressHDFC($Appointee4HOUSEFLATNUMBER);
                            $("#error_Appointee4HOUSEFLATNUMBER").html("");
                            $('#dvAppointee4HOUSEFLATNUMBER').removeClass('Error');
                            var result = CheckThreeIChar($Appointee4HOUSEFLATNUMBER);
                            if (result == true) {
                                is_valid = 1;
                            }
                        }

                        //if ($NomineeHOUSEFLATNUMBER.val() == '' || checkAddress($NomineeHOUSEFLATNUMBER) == false) { $('#dvNomineeHOUSEFLATNUMBER').addClass('Error'); is_valid = 1; }
                        //else { $('#dvNomineeHOUSEFLATNUMBER').removeClass('Error'); }

                        if ($Appointee4STREETBUILDING.val() == '' || checkAddress1($Appointee4STREETBUILDING) == false) {
                            $('#dvAppointee4STREETBUILDING').addClass('Error'); is_valid = 1;
                            $("#error_Appointee4STREETBUILDING").html("Please Enter STREET BUILDING.");
                        }
                        else {
                            CheckAddressHDFC($Appointee4STREETBUILDING);
                            $("#error_Appointee4STREETBUILDING").html("");
                            $("#dvAppointee4STREETBUILDING").removeClass('Error');
                            var result = CheckThreeIChar($Appointee4STREETBUILDING);
                            if (result == true) {
                                is_valid = 1;
                            }
                        }

                        //if ($NomineeSTREETBUILDING.val() == '' || checkAddress($NomineeSTREETBUILDING) == false) { $('#dvNomineeSTREETBUILDING').addClass('Error'); is_valid = 1; }
                        //else { $('#dvNomineeSTREETBUILDING').removeClass('Error'); }

                        if ($Appointee4PinCode.val() == "" || $Appointee4PinCode.val().length != 6 || $Appointee4PinCode.val() < 110000 || checkPincode($Appointee4PinCode) == false) {
                            $('#dvAppointee4PinCode').addClass('Error'); is_valid = 1;
                            $("#error_Appointee4PinCode").html("Please Enter PinCode.");
                        }
                        else {
                            $('#dvAppointee4PinCode').removeClass('Error');
                            $("#error_Appointee4PinCode").html("");
                        }

                        if ($Appointee4Landmark.val() == '' || checkAddress1($Appointee4Landmark) == false) {
                            $('#dvAppointee4Landmark').addClass('Error'); is_valid = 1;
                            $("#error_Appointee4Landmark").html("Please Enter Landmark.");
                        }
                        else {
                            CheckAddressHDFC($Appointee4Landmark);
                            $("#error_Appointee4Landmark").html("");
                            $('#dvAppointee4Landmark').removeClass('Error');
                            var result = CheckThreeIChar($Appointee4Landmark);
                            if (result == true) {
                                is_valid = 1;
                            }
                        }

                        //if ($NomineeLandmark.val() == '') { $('#dvNomineeLandmark').addClass('Error'); is_valid = 1; }
                        //else { $('#dvNomineeLandmark').removeClass('Error'); }

                        if ($Appointee4CityName.val() == '') {
                            $('#dvAppointee4CityName').addClass('Error'); is_valid = 1;
                            $("#error_Appointee4CityName").html("Please Enter City.");
                        }
                        else {
                            $("#error_Appointee4CityName").html("");
                            $('#dvAppointee4CityName').removeClass('Error');
                        }

                        if ($Appointee4State.val() == '') {
                            $('#dvAppointee4State').addClass('Error'); is_valid = 1;
                            $("#error_Appointee4State").html("Please Enter State.");
                        }
                        else {
                            $('#dvAppointee4State').removeClass('Error');
                            $("#error_Appointee4State").html("");
                        }

                        //if ($Appointee4PostOfficeId.val() == 0 || checkAddress1($Appointee4PostOfficeId) == false || $Appointee4PostOfficeId.val() == "") { $Appointee4PostOfficeId.addClass('Error'); is_valid = 1; }
                        //else { $Appointee4PostOfficeId.removeClass('Error'); }
                    }

                }


            }


            if ($Nominee4Mobile.val() == "" || checkMobile($Nominee4Mobile) == false) {
                $('#dvNominee4Mobile').addClass('Error'); is_valid = 1;
                $("#error_Nominee4Mobile").html("Please Enter Mobile Number.");
            }
            else {
                $('#dvNominee4Mobile').removeClass('Error');
                $("#error_Nominee4Mobile").html("");
            }

            if ($Nominee4Gender.val() == '' || $Nominee4Gender.val() == null) {
                $('#Nominee4Gender').addClass('Error'); is_valid = 1;
                $("#error_Nominee4Gender").html("Please Select Gender");

            }
            else {
                $("#error_Nominee4Gender").html("");
                $('#Nominee4Gender').removeClass('Error');

            }

            if ($Nominee4MaritalStatus.val() == '' || $Nominee2MaritalStatus.val() == null) {
                $('#Nominee4MaritalStatus').addClass('Error'); is_valid = 1;
                $("#error_Nominee4MaritalStatus").html("Please Select Marital Status");
            }
            else {
                $("#error_Nominee4MaritalStatus").html("");
                $('#Nominee4MaritalStatus').removeClass('Error');
            }

            if ($Nominee4Relation.val() == '' || $Nominee4Relation.val() == null) {
                $('#Nominee4Relationship').addClass('Error'); is_valid = 1;
                $("#error_Nominee4Relationship").html("Please Select Relationship");
            }
            else {
                $("#error_Nominee4Relationship").html("");
                $('#Nominee4Relationship').removeClass('Error');
            }

            if ($("#n4address").val() == '') {
                //$('#divn4address').addClass('Error');
                is_valid = 1;
                $("#error_n4address").html("Please Select Yes/No.");
            }
            else {
                $("#error_n4address").html("");

                $('#divn4address').removeClass('Error');
                if ($("#n4address").val() == "No") {

                    if ($Nominee4HOUSEFLATNUMBER.val() == '' || checkAddress1($Nominee4HOUSEFLATNUMBER) == false) {
                        $('#dvNominee4HOUSEFLATNUMBER').addClass('Error'); is_valid = 1;
                        $("#error_Nominee4HOUSEFLATNUMBER").html("Please Enter HOUSE/FLAT NUMBER.");
                    }
                    else {
                        CheckAddressHDFC($Nominee4HOUSEFLATNUMBER);
                        $("#error_Nominee4HOUSEFLATNUMBER").html("");
                        $('#dvNominee4HOUSEFLATNUMBER').removeClass('Error');
                        var result = CheckThreeIChar($Nominee4HOUSEFLATNUMBER);
                        if (result == true) {
                            is_valid = 1;
                        }

                    }

                    //if ($nomineehouseflatnumber.val() == '' || checkaddress($nomineehouseflatnumber) == false) { $('#dvnomineehouseflatnumber').addclass('error'); is_valid = 1; }
                    //else { $('#dvnomineehouseflatnumber').removeclass('error'); }

                    if ($Nominee4STREETBUILDING.val() == '' || checkAddress1($Nominee4STREETBUILDING) == false) {
                        $('#dvNominee4STREETBUILDING').addClass('Error'); is_valid = 1;
                        $("#error_Nominee4STREETBUILDING").html("Please Enter STREET BUILDING.");
                    }
                    else {
                        CheckAddressHDFC($Nominee4STREETBUILDING);
                        $("#error_Nominee4STREETBUILDING").html("");
                        $("#dvNominee4STREETBUILDING").removeClass('Error');
                        var result = CheckThreeIChar($Nominee4STREETBUILDING);
                        if (result == true) {
                            is_valid = 1;
                        }
                    }

                    //if ($nomineestreetbuilding.val() == '' || checkaddress($nomineestreetbuilding) == false) { $('#dvnomineestreetbuilding').addclass('error'); is_valid = 1; }
                    //else { $('#dvnomineestreetbuilding').removeclass('error'); }

                    if ($Nominee4PinCode.val() == "" || $Nominee4PinCode.val().length != 6 || $Nominee4PinCode.val() < 110000 || checkPincode($Nominee4PinCode) == false) {
                        $('#dvnominee4pincode').addClass('Error'); is_valid = 1;
                        $("#error_Nominee4PinCode").html("Please Enter PinCode.");
                    }
                    else {
                        $("#error_Nominee4PinCode").html("");
                        $('#dvNominee4PinCode').removeClass('error');
                    }

                    if ($Nominee4Landmark.val() == '' || checkAddress1($Nominee4Landmark) == false) {
                        $('#dvNominee4Landmark').addClass('Error'); is_valid = 1;
                        $("#error_Nominee4Landmark").html("Please Enter Landmark.");
                    }
                    else {
                        CheckAddressHDFC($Nominee4Landmark);
                        $("#error_Nominee4Landmark").html("");
                        $('#dvNominee4Landmark').removeClass('Error');
                        var result = CheckThreeIChar($Nominee4Landmark);
                        if (result == true) {
                            is_valid = 1;
                        }
                    }

                    //if ($nomineelandmark.val() == '') { $('#dvnomineelandmark').addclass('error'); is_valid = 1; }
                    //else { $('#dvnomineelandmark').removeclass('error'); }

                    if ($Nominee4CityName.val() == '') {
                        $('#dvNominee4CityName').addClass('Error'); is_valid = 1;
                        $("#error_Nominee4CityName").html("Please Enter City.");
                    }
                    else {
                        $("#error_Nominee4CityName").html("");
                        $('#dvNominee4CityName').removeClass('Error');
                    }

                    if ($Nominee4State.val() == '') {
                        $('#dvNominee4State').addClass('Error'); is_valid = 1;
                        $("#error_Nominee4State").html("Please Enter State.");
                    }
                    else {
                        $('#dvNominee4State').removeClass('Error');
                        $("#error_Nominee4State").html("");
                    }

                    //if ($Nominee4PostOfficeId.val() == 0 || checkAddress($Nominee4PostOfficeId) == false || $("#Nominee4PostOfficeId").val() == "") { $Nominee4PostOfficeId.addClass('Error'); is_valid = 1; }
                    //else { $("#Nominee4PostOfficeId").removeClass('Error'); }
                }


            }

            if ($Nominee4Email.val() == '' || checkEmail($Nominee4Email) == false) {
                $('#dvNominee4Email').addClass('Error'); is_valid = 1;
                $("#error_Nominee4Email").html("Please Enter Valid Email.");
            }
            else {
                $("#error_Nominee4Email").html("");
                $('#dvNominee4Email').removeClass('Error');
            }


        }

        //if ($("#nomineepercentagetotal").val() > 100 || $("#nomineepercentagetotal").val() < 100) {
        //    $('#dvtotal').addClass('Error'); is_valid = 1;
        //    $("#error_total").html("Please Enter Valid Percentage.");
        //}
        //else {
        //    $('#dvtotal').removeClass('Error');
        //    $("#error_total").html("");
        //}



        if (is_valid < 1) { return true; }
        else { return false; }

    }

    else if (Opt == 10) {
        if ($Height.val() == '' || $Height.val() == null) {
            $('#Height').addClass('Error'); is_valid = 1;
            $("#error_Height").html("Please Enter Height.");
        }
        else {
            $("#error_Height").html("");
            $('#Height').removeClass('Error');
        }

        if ($Weight.val() == '') {
            $('#dvWeight').addClass('Error'); is_valid = 1;
            $("#error_Weight").html("Please Enter Weight.");
        }
        else {
            $("#error_Weight").html("");
            $('#dvWeight').removeClass('Error');
        }

        if ($("#PMH").val() == '') {
            $('#divPMH').addClass('Error'); is_valid = 1;
            $("#error_PMH").html("Please Select Yes/No.");
        }
        else {
            $("#error_PMH").html("");
            $('#divPMH').removeClass('Error');
        }
        if ($("#PMHD").val() == '') {
            $('#divPMHD').addClass('Error'); is_valid = 1;
            $("#error_PMHD").html("Please Select Yes/No.");
        }
        else {
            $("#error_PMHD").html("");
            $('#divPMHD').removeClass('Error');
        }

        if (is_valid < 1) { return true; }
        else { return false; }
    }

    //else if (Opt == 11) {


    //    if ($TermsAndConditions.val() == "undefined" || $TermsAndConditions.val() == "" || $TermsAndConditions.val() == null) {
    //        is_valid = 1;
    //        $("#TermsAndConditions").addClass('Error');
    //        $("#error_TermsAndConditions").html("Please Accept Terms & Conditions");
    //    }
    //    else {
    //        $("#error_TermsAndConditions").html("");
    //        $("#TermsAndConditions").removeClass('Error');
    //    }

    //    if (is_valid == 0) {

    //        //  $("#FinalSubmit").val("1");
    //        return true;
    //    }
    //    else { return false; }

    //}

    else if (Opt == 12) {


        if ($CKYCOccupationType.val() == '' || $CKYCOccupationType.val() == null) {

            $('#CKYCOccupationType').addClass('Error'); is_valid = 1;
            $("#error_CKYCOccupationType").html("Please Select Occupation Type.");
        }
        else {

            if ($CKYCOccupationType.val() == 'OCCT_SALR') {
                if ($CKYCOccupationalDetails.val() == '' || $CKYCOccupationalDetails.val() == null) {
                    $('#CKYCOccupationalDetails').addClass('Error'); is_valid = 1;
                    $("#error_CKYCOccupationalDetails").html("Please Select Occupation Type.");
                }
                else {
                    $("#error_CKYCOccupationalDetails").html("");
                    $('#CKYCOccupationalDetails').removeClass('Error');
                }
            }
            else {
                $("#error_CKYCOccupationType").html("");
                $('#CKYCOccupationType').removeClass('Error');
            }
        }

        if ($CKYCFatherTitle.val() == '' || $CKYCFatherTitle.val() == null) {
            $('#CKYCFatherTitle').addClass('Error'); is_valid = 1;
            $("#error_CKYCFatherTitle").html("Please Select Title");
        }
        else {
            $("#error_CKYCFatherTitle").html("");
            $('#CKYCFatherTitle').removeClass('Error');
        }

        if ($CKYCFatherFirstName.val() == "" || checkText($CKYCFatherFirstName) == false) {

            $('#dvCKYCFatherFirstName').addClass('Error'); is_valid = 1;
            $("#error_CKYCFatherFirstName").html("Please Enter Father First Name");
        }
        else {
            $("#error_CKYCFatherFirstName").html("");
            $('#dvCKYCFatherFirstName').removeClass('Error');
            var result = CheckThreeIChar($CKYCFatherFirstName);
            if (result == true) {
                is_valid = 1;
            }
        }

        //if ($CKYCFatherMiddleName.val() == "" || checkText($CKYCFatherMiddleName) == false) {
        //     $('#dvCKYCFatherMiddleName').addClass('Error'); is_valid = 1;
        //    $("#error_CKYCFatherMiddleName").html("Please Enter Middle Name");
        //}
        //else {
        //    $("#error_CKYCFatherMiddleName").html("");
        //    $('#dvCKYCFatherMiddleName').removeClass('Error');
        //}

        if ($CKYCFatherLastName.val() == "" || checkText($CKYCFatherLastName) == false) {
            $('#dvCKYCFatherLastName').addClass('Error'); is_valid = 1;
            $("#error_CKYCFatherLastName").html("Please Enter Father Last Name");
        }
        else {
            $("#error_CKYCFatherLastName").html("");
            $('#dvCKYCFatherLastName').removeClass('Error');
            var result = CheckThreeIChar($CKYCFatherLastName);
            if (result == true) {
                is_valid = 1;
            }
        }

        if ($CKYCMotherTitle.val() == '' || $CKYCMotherTitle.val() == null) {
            $('#CKYCMotherTitle').addClass('Error'); is_valid = 1;
            $("#error_CKYCMotherTitle").html("Please Select Title");
        }
        else {
            $("#error_CKYCMotherTitle").html("");
            $('#CKYCMotherTitle').removeClass('Error');
        }

        if ($CKYCMotherFirstName.val() == "" || checkText($CKYCMotherFirstName) == false) {
            $('#dvCKYCMotherFirstName').addClass('Error'); is_valid = 1;
            $("#error_CKYCMotherFirstName").html("Please Enter Mother First Name");
        }
        else {
            $("#error_CKYCMotherFirstName").html("");
            $('#dvCKYCMotherFirstName').removeClass('Error');
            var result = CheckThreeIChar($CKYCMotherFirstName);
            if (result == true) {
                is_valid = 1;
            }

        }

        //if ($CKYCMotherMiddleName.val() == "" || checkText($CKYCMotherMiddleName) == false) {

        //    $('#dvCKYCMotherMiddleName').addClass('error'); is_valid = 1;
        //    $("#error_CKYCMotherMiddleName").html("Please Enter Middle Name");
        //}
        //else {
        //    $("#error_CKYCMotherMiddleName").html("");
        //    $('#dvCKYCMotherMiddleName').removeClass('error');
        //}

        if ($CKYCMotherLastName.val() == "" || checkText($CKYCMotherLastName) == false) {
            $('#dvCKYCMotherLastName').addClass('Error'); is_valid = 1;
            $("#error_CKYCMotherLastName").html("Please Enter Mother Last Name");
        }
        else {
            $("#error_CKYCMotherLastName").html("");
            $('#dvCKYCMotherLastName').removeClass('Error');
            var result = CheckThreeIChar($CKYCMotherLastName);
            if (result == true) {
                is_valid = 1;
            }
        }

        if ($("#InsuredMaritalStatus").val() == "MAR_MRD" || $("#InsuredMaritalStatus").val() == null) {

            if ($CKYCSpouseTitle.val() == '' || $CKYCSpouseTitle.val() == null) {
                $('#CKYCSpouseTitle').addClass('Error'); is_valid = 1;
                $("#error_CKYCSpouseTitle").html("Please Select Title");
            }
            else {
                $("#error_CKYCSpouseTitle").html("");
                $('#CKYCSpouseTitle').removeClass('Error');
            }

            if ($CKYCSpouseFirstName.val() == "" || checkText($CKYCSpouseFirstName) == false) {
                $('#dvCKYCSpouseFirstName').addClass('Error'); is_valid = 1;
                $("#error_CKYCSpouseFirstName").html("Please Enter Spouse First Name");
            }
            else {
                $("#error_CKYCSpouseFirstName").html("");
                $('#dvCKYCSpouseFirstName').removeClass('Error');
                var result = CheckThreeIChar($CKYCSpouseFirstName);
                if (result == true) {
                    is_valid = 1;
                }
            }

            //if ($CKYCSpouseMiddleName.val() == "" || checkText($CKYCSpouseMiddleName) == false) {
            //     $('#dvCKYCSpouseMiddleName').addClass('Error'); is_valid = 1;
            //    $("#error_CKYCSpouseMiddleName").html("Please Enter Middle Name");
            //}
            //else {
            //    $("#error_CKYCSpouseMiddleName").html("");
            //    $('#dvCKYCSpouseMiddleName').removeClass('Error');
            //}

            if ($CKYCSpouseLastName.val() == "" || checkText($CKYCSpouseLastName) == false) {
                $('#dvCKYCSpouseLastName').addClass('Error'); is_valid = 1;
                $("#error_CKYCSpouseLastName").html("Please Enter Spouse Last Name");
            }
            else {
                $("#error_CKYCSpouseLastName").html("");
                $('#dvCKYCSpouseLastName').removeClass('Error');
                var result = CheckThreeIChar($CKYCSpouseLastName);
                if (result == true) {
                    is_valid = 1;
                }
            }
        }

        //if ($CKYCSpouseTitle.val() == '') { $('#CKYCSpouseTitle').addClass('Error'); is_valid = 1; }
        //else { $('#CKYCSpouseTitle').removeClass('Error'); }

        //if ($CKYCSpouseFirstName.val() == "" || checkText($CKYCSpouseFirstName) == false) {  $('#dvCKYCSpouseFirstName').addClass('Error'); is_valid = 1; }
        //else { $('#dvCKYCSpouseFirstName').removeClass('Error'); }

        //if ($CKYCSpouseMiddleName.val() == "" || checkText($CKYCSpouseMiddleName) == false) {  $('#dvCKYCSpouseMiddleName').addClass('Error'); is_valid = 1; }
        //else { $('#dvCKYCSpouseMiddleName').removeClass('Error'); }

        //if ($CKYCSpouseLastName.val() == "" || checkText($CKYCSpouseLastName) == false) {  $('#dvCKYCSpouseLastName').addClass('Error'); is_valid = 1; }
        //else { $('#dvCKYCSpouseLastName').removeClass('Error'); }

        if ($CKYCOccupationType.val() == '' || $CKYCOccupationType.val() == null) {

            $('#CKYCOccupationType').addClass('Error'); is_valid = 1;
            $("#error_CKYCOccupationType").html("Please Select Occupation");
        }
        else {
            $("#error_CKYCOccupationType").html("");
            $('#CKYCOccupationType').removeClass('Error');
        }

        if ($CKYCCountryOfBirth.val() == '') {
            $('#dvCKYCCountryOfBirth').addClass('Error'); is_valid = 1;
            $("#error_CKYCCountryOfBirth").html("Please Enter Country.");
        }
        else {
            $("#error_CKYCCountryOfBirth").html("");
            $('#dvCKYCCountryOfBirth').removeClass('Error');
        }

        if (is_valid == 0) {
            $("#FinalSubmit").val("1");
            return true;
        }
        else { return false; }

    }
    else if (Opt == 14) {
        if ($OccupationalDetails.val() == '' || $OccupationalDetails.val() == null) {
            $('#OccupationalDetails').addClass('Error'); is_valid = 1;
            $("#error_OccupationalDetails").html("Please Select Occupational Details.");
        }
        else {
            if ($OccupationalDetails.val() == 'OCCT_OTHR') {
                if ($OccupationalDetailsOthers.val() == '') {
                    $('#dvOccupationalDetailsOthers').addClass('Error'); is_valid = 1;
                    $("#error_OccupationalDetailsOthers").html("Please Enter Occupational Details.");
                }
                else {
                    $("#error_OccupationalDetailsOthers").html("");
                    $('#dvOccupationalDetailsOthers').removeClass('Error');
                    //var occupationothers = $("#OccupationalDetailsOthers").val().toLowerCase();
                    //if (occupationothers.includes('housewife') || occupationothers.includes('unemployed') || occupationothers.includes('agriculture') || occupationothers.includes('home maker') || occupationothers.includes('homemaker')) {

                    //    $('#dvOccupationalDetailsOthers').addClass('Error'); is_valid = 1;
                    //    $("#error_OccupationalDetailsOthers").html("Occupation Invalid.");
                    //}
                    //else {
                    //    $("#error_OccupationalDetailsOthers").html("");
                    //    $('#dvOccupationalDetailsOthers').removeClass('Error');
                    //}

                }
            }
            else if ($OccupationalDetails.val() == 'OCCT_SALR') {
                if ($OccupationalDetailsemployeeof.val() == '' || $OccupationalDetailsemployeeof.val() == null) {
                    $('#OccupationalDetailsemployeeof').addClass('Error'); is_valid = 1;
                    $("#error_OccupationalDetailsemployeeof").html("Please Select Employee Of.");
                }
                else {
                    $("#error_OccupationalDetailsemployeeof").html("");
                    $('#OccupationalDetailsemployeeof').removeClass('Error');

                    if ($OccupationalDetailsemployeeof.val() == 'HDFCLife') {
                        if ($EmployeeID.val() == '' || CheckAtleastTwoCharacter($EmployeeID) == false) {
                            $('#dvEmployeeID').addClass('Error'); is_valid = 1;
                            $("#error_EmployeeID").html("Please Enter Employee ID.");
                        }
                        else {
                            $("#error_EmployeeID").html("");
                            $('#dvEmployeeID').removeClass('Error');
                        }

                        if ($DateOfJoining.val() == '') {
                            $('#dvDateOfJoining').addClass('Error'); is_valid = 1;
                            $("#error_EmployeeJoining").html("Please Select Date Of Joining.");
                        }
                        else {
                            $("#error_EmployeeJoining").html("");
                            $('#dvDateOfJoining').removeClass('Error');
                        }

                        if ($EmployeeLocation.val() == '' || $EmployeeLocation.val() == null) {
                            $('#EmployeeLocation').addClass('Error'); is_valid = 1;
                            $("#error_EmployeeLocation").html("Please Enter Location.");
                        }
                        else {
                            $("#error_EmployeeLocation").html("");
                            $('#EmployeeLocation').removeClass('Error');
                        }

                        if ($EmployeeDesignation.val() == '') {
                            $('#dvEmployeeDesignation').addClass('Error'); is_valid = 1;
                            $("#error_EmployeeDesignation").html("Please Enter Designation.");
                        }
                        else {
                            $("#error_EmployeeDesignation").html("");
                            $('#dvEmployeeDesignation').removeClass('Error');
                            var value = onlyonespace($EmployeeDesignation);
                            if (value == false) {
                                is_valid = 1;
                            }
                        }

                        //if ($YearlyIncome.val() == '' || CheckWholeNumber($YearlyIncome) == false) { $('#dvYearlyIncome').addClass('Error'); is_valid = 1; }
                        //else { $('#dvYearlyIncome').removeClass('Error'); }


                        if ($("#SelectedQuote_NetPremium").val() > 50000) {

                            if ($('#PanNo').val() == '' || checkPAN($PanNo) == false) {
                                $('#dvPanNo').addClass('Error'); is_valid = 1;
                                $("#error_PanNo").html("Please Enter Pan No.");
                            }
                            else {
                                $("#error_PanNo").html("");
                                $('#dvPanNo').removeClass('Error');
                            }
                        }
                        else {
                            if ($('#PanNo').val() != '') {

                                if (checkPAN($PanNo) == false) {
                                    $('#dvPanNo').addClass('Error'); is_valid = 1;
                                    $("#error_PanNo").html("Please Enter Valid Pan No.");
                                }
                                else {
                                    $("#error_PanNo").html("");
                                    $('#dvPanNo').removeClass('Error');
                                }
                            }
                        }

                    }


                    else if ($OccupationalDetailsemployeeof.val() == 'HDFCBank') {
                        if ($HDFCBankEmployeeID.val() == '') {
                            $('#dvHDFCBankEmployeeID').addClass('Error'); is_valid = 1;
                            $("#error_HDFCBankEmployeeID").html("Please Enter Employee ID.");
                        }
                        else {
                            $("#error_HDFCBankEmployeeID").html("");
                            $('#dvHDFCBankEmployeeID').removeClass('Error');
                        }

                        if ($HDFCBankEmployeeJoining.val() == '') {
                            $('#dvHDFCBankEmployeeJoining').addClass('Error'); is_valid = 1;
                            $("#error_HDFCBankEmployeeJoining").html("Please Select Date Of Joining.");
                        }
                        else {
                            $("#error_HDFCBankEmployeeJoining").html("");
                            $('#dvHDFCBankEmployeeJoining').removeClass('Error');
                        }

                        if ($HDFCBankEmployeeLocation.val() == '') {
                            $('#HDFCBankEmployeeLocation').addClass('Error'); is_valid = 1;
                            $("#error_HDFCBankEmployeeLocation").html("Please Enter Location.");
                        }
                        else {
                            $("#error_HDFCBankEmployeeLocation").html("");
                            $('#HDFCBankEmployeeLocation').removeClass('Error');
                        }

                        if ($HDFCBankEmployeeDesignation.val() == '') {
                            $('#dvHDFCBankEmployeeDesignation').addClass('Error'); is_valid = 1;
                            $("#error_HDFCBankEmployeeDesignation").html("Please Enter Designation.");
                        }
                        else {
                            $("#error_HDFCBankEmployeeDesignation").html("");
                            $('#dvHDFCBankEmployeeDesignation').removeClass('Error');
                        }

                        //if ($YearlyIncome.val() == '' || CheckWholeNumber($YearlyIncome) == false) { $('#dvYearlyIncome').addClass('Error'); is_valid = 1; }
                        //else { $('#dvYearlyIncome').removeClass('Error'); }

                        if ($("#SelectedQuote_NetPremium").val() > 100000) {
                            if ($('#HDFCBankEmployeePanNo').val() == '' || checkPAN($HDFCBankEmployeePanNo) == false) {
                                $('#dvHDFCBankEmployeePanNo').addClass('Error'); is_valid = 1;
                                $("#error_HDFCBankEmployeePanNo").html("Please Enter Pan No.");
                            }
                            else {
                                $("#error_HDFCBankEmployeePanNo").html("");
                                $('#dvHDFCBankEmployeePanNo').removeClass('Error');
                            }
                        }
                        else {
                            if ($HDFCBankEmployeePanNo.val() != '') {
                                if (checkPAN($HDFCBankEmployeePanNo) == false) { $('#dvHDFCBankEmployeePanNo').addClass('Error'); is_valid = 1; }
                                else { $('#dvHDFCBankEmployeePanNo').removeClass('Error'); }
                            }

                        }
                    }
                    else if ($OccupationalDetailsemployeeof.val() == 'Others') {
                        if ($OccupationalDetailsBusiness.val() == '' || $OccupationalDetailsBusiness.val() == null) {
                            $('#OccupationalDetailsBusiness').addClass('Error'); is_valid = 1;
                            $("#error_OccupationalDetailsBusiness").html("Please Select Business");
                        }
                        else {
                            $("#error_OccupationalDetailsBusiness").html("");
                            $('#OccupationalDetailsBusiness').removeClass('Error');
                        }

                        if ($NameOfPresentEmployer.val() == '') {
                            $('#dvNameOfPresentEmployer').addClass('Error'); is_valid = 1;
                            $("#error_NameOfPresentEmployer").html("Please Enter Name");
                        }
                        else {
                            $("#error_NameOfPresentEmployer").html("");
                            $('#dvNameOfPresentEmployer').removeClass('Error');
                        }

                        if ($AddressOfPresentEmployer.val() == '') {
                            $('#dvAddressOfPresentEmployer').addClass('Error'); is_valid = 1;
                            $("#error_AddressOfPresentEmployer").html("Please Enter Address");
                        }
                        else {
                            $("#error_AddressOfPresentEmployer").html("");
                            $('#dvAddressOfPresentEmployer').removeClass('Error');
                            var result = CheckThreeIChar($AddressOfPresentEmployer);
                            if (result == true) {
                                is_valid = 1;
                            }
                        }

                        if ($YearlyIncomeOhters.val() == '' || CheckWholeNumber($YearlyIncomeOhters) == false) {
                            $('#dvYearlyIncomeOthers').addClass('Error'); is_valid = 1;
                            $("#error_YearlyIncomeOhters").html("Please Enter Yearly Income");
                        }
                        else {
                            $("#error_YearlyIncomeOhters").html("");
                            $('#dvYearlyIncomeOthers').removeClass('Error');
                        }



                    }

                    // $('#OccupationalDetailsemployeeof').removeClass('Error');
                }


            }
            if ($OccupationalDetails.val() == 'OCCT_SEBS') {

                if ($SelfEmployeeDesignation.val() == '') {
                    $('#dvSelfEmployeeDesignation').addClass('Error'); is_valid = 1;
                    $("#error_SelfEmployeeDesignation").html("Please Enter Designation.");
                }
                else {
                    $("#error_SelfEmployeeDesignation").html("");
                    $('#dvSelfEmployeeDesignation').removeClass('Error');
                }
            }
            //else if ($OccupationalDetails.val() == 'Student') {
            //    if ($EducationLoan.val() == '') {
            //        $('#divEducationLoan').addClass('Error'); is_valid = 1;
            //        $("#error_EducationLoan").html("Please Select Yes/No.");
            //    }
            //    else {
            //        $("#error_EducationLoan").html("");
            //        $('#divEducationLoan').removeClass('Error');
            //    }
            //}
            $("#error_OccupationalDetails").html("");
            $('#OccupationalDetails').removeClass('Error');
        }
        if (is_valid < 1) { return true; }
        else { return false; }
    }

    else if (Opt == 13) {
        if ($('#FinalSubmit').val() == "1") {
            //window.location.href = "/TermInsuranceIndia/Intermediatepagelife";
            is_valid = 0;
            return true;
        }
        else { return false; }

        if (is_valid < 1) { return true; }
        else { return false; }
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
function checkCustomerValidation() {
    $('.Heading1').click(function (e) {
        
        var IDs = [], ContentIDs = [], i = 0;
        var thisval = $(this).attr('id');
        $("#accordion1").find('.Heading1').each(function (n, i) { IDs.push(this.id); });
        $("#accordion1").find('.panel-collapse').each(function (n, i) { ContentIDs.push(this.id); });
        var thislength = IDs.indexOf(thisval);
        //for (var i = 0; i < thislength; i++) {
        //    if (ValidateSection(IDs[i]) == true) {
        //        $('#' + IDs[i]).find("i.indicator").removeClass('glyphs');
        //    }
        //    else {
        //        $('#' + IDs[i]).find("i.indicator").addClass('glyphs');
        //        ExpandSection(IDs[i], ContentIDs[i]);//$('#'+ContentIDs[i]).collapse('show');
        //        e.preventDefault(); e.stopPropagation();
        //        return false;
        for (var i = 0; i < thislength; i++) {
            if (ValidateSection(IDs[i]) == true) {
                $('#' + IDs[i]).find("i.indicator").removeClass('glyphs');
            }
            else {
                $('#' + IDs[i]).find("i.indicator").addClass('glyphs');
                if (IDs[i] == "hrefViewInput") {
                    ExpandSection(IDs[i], "collapseOne");
                } else if (IDs[i] == "hrefPersonalInfo") {
                    ExpandSection(IDs[i], "collapsefour");
                } else if (IDs[i] == "hrefContactInfo") {
                    ExpandSection(IDs[i], "collapseThree");
                } else if (IDs[i] == "hrefOccupationDetails") {
                    ExpandSection(IDs[i], "collapsetwo");
                } else if (IDs[i] == "hrefnominee") {
                    ExpandSection(IDs[i], "collapsefive");
                } else if (IDs[i] == "hrefMedicalQuestionnaire") {
                    ExpandSection(IDs[i], "collapsesix");
                } else if (IDs[i] == "hrefCKYC") {
                    ExpandSection(IDs[i], "collapseeight");
                } 
                //else if (IDs[i] == "hrefOccupationDetails") {
                //    ExpandSection(IDs[i], "collapsetwo");
                //} 
                else {
                    ExpandSection(IDs[i], "collapsenine");//$('#'+ContentIDs[i]).collapse('show');
                }
                //ExpandSection(IDs[i], ContentIDs[i]);//$('#'+ContentIDs[i]).collapse('show');
                e.preventDefault(); e.stopPropagation();
                return false;

            }
        }
        if ($('#FinalSubmit').val() == "1" && $(this).attr('id') == "submitSendPaymentlink") { $('#submitSendPaymentlink').attr("disabled", "disabled"); $(".Load_sec").show(); document.forms[0].submit(); }
    });
}


function CheckFocusOut(id, check) {

    var Customer;
    var divid = "dv" + id;
    if (Customer == 1) {
        if ($('#' + id).hasClass('NotRequired')) { $('#' + divid).removeClass('Error'); }
        else {
            if (check == false) { $('#' + divid).addClass('Error'); }
            else { $('#' + divid).removeClass('Error'); }
        }
    }
    else if ($('#' + id).hasClass('Required') == true) {
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

function ValidateOccupation() {
    var is_valid = 0;
    var $OccupationalDetailsOthers = $("#OccupationalDetailsOthers");
    var $OccupationalDetails = $("#OccupationalDetails");
    if ($OccupationalDetails.val() == 'Others') {

        var occupationothers = $("#OccupationalDetailsOthers").val().toLowerCase();
        if (occupationothers.includes('housewife') || occupationothers.includes('unemployed') || occupationothers.includes('agriculture') || occupationothers.includes('home maker') || occupationothers.includes('homemaker')) {
            $('#dvOccupationalDetailsOthers').addClass('Error'); is_valid = 1;
            $("#error_OccupationalDetailsOthers").html("Occupation Invalid.");
        }
        else {
            $("#error_OccupationalDetailsOthers").html("");
            $('#dvOccupationalDetailsOthers').removeClass('Error');
        }

    }

    if (is_valid == 0) {
        $("#FinalSubmit").val("1");
        $("#submitSendPaymentlink").removeAttr('disabled');
        return true;
    }
    else {
        $("#submitSendPaymentlink").prop('disabled', true);
        return false;
    }
}




$('.OnlyText').focusout(function () {
    CheckFocusOut($(this).attr('id'), checkText($(this)));
});

$('.ConsecutiveChar').focusout(function () {
    CheckFocusOut($(this).attr('id'), CheckThreeIChar($(this)));
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
    CheckFocusOut($(this).attr('id'), checkAddress1($(this)));
});
$('.City').focusout(function () {
    CheckFocusOut($(this).attr('id'), checkCity1($(this)));
});
$('.Passport').focusout(function () {
    CheckFocusOut($(this).attr('id'), checkPassport($(this)));
});

$('.addresshouse').focusout(function () {
    CheckFocusOut($(this).attr('id'), CheckAddressHDFC1($(this)));
});
$('#EmployeeDesignation').focusout(function () {
    CheckFocusOut($(this).attr('id'), CheckSingleSpace($(this)));
});
$('#OccupationalDetailsOthers').focusout(function () {
    CheckFocusOut($(this).attr('id'), CheckSingleSpace($(this)));
});
$('#NomineeFirstName').focusout(function () {
    CheckFocusOut($(this).attr('id'), CheckSingleSpace($(this)));
});
$('#NomineeLastName').focusout(function () {
    CheckFocusOut($(this).attr('id'), CheckSingleSpace($(this)));
});
$('#AppointeeFirstName').focusout(function () {
    CheckFocusOut($(this).attr('id'), CheckSingleSpace($(this)));
});
$('#AppointeeLastName').focusout(function () {
    CheckFocusOut($(this).attr('id'), CheckSingleSpace($(this)));
});
$('#NameOfPresentEmployer').focusout(function () {
    CheckFocusOut($(this).attr('id'), CheckSingleSpace($(this)));
});
$('#InsuredFatherName').focusout(function () {
    CheckFocusOut($(this).attr('id'), CheckSingleSpace($(this)));
});
$('.Number').keyup(function () {
    this.value = this.value.replace(/[^0-9\.]/g, '');
});

$('#OccupationalDetailsOthers').focusout(function () {
    CheckFocusOut($(this).attr('id'), ValidateOccupation($(this)));
});

function isNumber(evt) {

    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function isCharacter(evt) {

    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return true;
    }
    return false;
}

function CheckSingleSpace(input) {
    
    var EmployeeDesignation = input.val();
    //for dot
    EmployeeDesignation = EmployeeDesignation.replace(/ {1,}/g, ' ');
    input.val(EmployeeDesignation);
}


function CheckAddressHDFC(input) {
    
    var ContactHOUSEFLATNUMBER = input.val();
    //for dot
    ContactHOUSEFLATNUMBER = ContactHOUSEFLATNUMBER.replace(/ {1,}/g, ' ');
    input.val(ContactHOUSEFLATNUMBER);

    ContactHOUSEFLATNUMBER = ContactHOUSEFLATNUMBER.replace(/\s\./, '.');
    input.val(ContactHOUSEFLATNUMBER);

    //for hyphen
    ContactHOUSEFLATNUMBER = ContactHOUSEFLATNUMBER.replace(/\s\-/, '-');
    input.val(ContactHOUSEFLATNUMBER);


    //for dot
    ContactHOUSEFLATNUMBER = ContactHOUSEFLATNUMBER.replace('. ', '.');
    input.val(ContactHOUSEFLATNUMBER);

    //for hyphen
    ContactHOUSEFLATNUMBER = ContactHOUSEFLATNUMBER.replace('- ', '-');
    input.val(ContactHOUSEFLATNUMBER);

    //for dot
    ContactHOUSEFLATNUMBER = ContactHOUSEFLATNUMBER.replace(/[.]{2,}/, '.');
    input.val(ContactHOUSEFLATNUMBER);

    //for hyphen
    ContactHOUSEFLATNUMBER = ContactHOUSEFLATNUMBER.replace(/[-]{2,}/, '-');
    input.val(ContactHOUSEFLATNUMBER);

    ContactHOUSEFLATNUMBER = ContactHOUSEFLATNUMBER.replace('dr.', 'dr');
    input.val(ContactHOUSEFLATNUMBER);

    ContactHOUSEFLATNUMBER = ContactHOUSEFLATNUMBER.replace('rd.', 'rd');
    input.val(ContactHOUSEFLATNUMBER);

    ContactHOUSEFLATNUMBER = ContactHOUSEFLATNUMBER.replace('sri.', 'sri');
    input.val(ContactHOUSEFLATNUMBER);

    ContactHOUSEFLATNUMBER = ContactHOUSEFLATNUMBER.replace('shri.', 'shri');
    input.val(ContactHOUSEFLATNUMBER);

    ContactHOUSEFLATNUMBER = ContactHOUSEFLATNUMBER.replace('shree.', 'shree');
    input.val(ContactHOUSEFLATNUMBER);

    ContactHOUSEFLATNUMBER = ContactHOUSEFLATNUMBER.replace('smt.', 'smt');
    input.val(ContactHOUSEFLATNUMBER);

    ContactHOUSEFLATNUMBER = ContactHOUSEFLATNUMBER.replace('mr.', 'mr');
    input.val(ContactHOUSEFLATNUMBER);

    ContactHOUSEFLATNUMBER = ContactHOUSEFLATNUMBER.replace('mrs.', 'mrs');
    input.val(ContactHOUSEFLATNUMBER);

    ContactHOUSEFLATNUMBER = ContactHOUSEFLATNUMBER.replace('ave.', 'ave');
    input.val(ContactHOUSEFLATNUMBER);

    ContactHOUSEFLATNUMBER = ContactHOUSEFLATNUMBER.replace('jr.', 'jr');
    input.val(ContactHOUSEFLATNUMBER);
}


function CheckAddressHDFC1(input) {
    CheckAddressHDFC(input);
    var result = checkAddress1(input);
    return result;
}

function CheckWholeNumber(input) {

    var pattern = new RegExp('^[1-9][0-9]+$');
    var dvid = "dv" + input[0].id;
    var dvid1 = "error_" + input[0].id;
    if (pattern.test(input.val()) == false) {
        $('#' + dvid).addClass('Error');
        $('#' + dvid1).html("Please Enter Valid Number.");
        return false;
    }
    else {
        $('#' + dvid).removeClass('Error');
        $('#' + dvid1).html("");
        return true;
    }
}

function onlyonespace(input) {

    arr = input.val().split(' ');
    var dvid = "dv" + input[0].id;
    var dvid1 = "error_" + input[0].id;
    if (arr[2] != null && arr[2] != "") {
        $('#' + dvid).addClass('Error');
        $('#' + dvid1).html("Only Single Spaces are allowed.");
        return false;
    }
    else {
        $('#' + dvid).removeClass('Error');
        $('#' + dvid1).html("");
        return true;
    }
    if (arr[1] == " ") {
        $('#' + dvid).addClass('Error');
        $('#' + dvid1).html("Only Single Spaces are allowed.");
        return false;
    }

}

function CheckAtleastTwoCharacter(input) {

    var pattern = new RegExp('[a-zA-Z]{2,}');

    var input1 = input.val();
    var dvid = "dv" + input[0].id;
    var dvid1 = "error_" + input[0].id;
    if (pattern.test(input.val()) == false) {
        $('#' + dvid).addClass('Error');
        $('#' + dvid1).html("Please Enter Atleast Two Character");
        return false;
    }
    else {
        $('#' + dvid).removeClass('Error');
        $('#' + dvid1).html("");
        return true;
    }
}


function CheckThreeIChar(input) {

    //var pattern = '(.)\1\1';
    // var pattern = new RegExp('\\b([a-zA-Z0-9])\\1\\1+\\b');
    var pattern = new RegExp('([a-z\d])\\1\\1');

    var input1 = input.val();
    var dvid = "dv" + input[0].id;
    var dvid1 = "error_" + input[0].id;
    if (pattern.test(input.val()) == true) {
        $('#' + dvid).addClass('Error');
        $('#' + dvid1).html("Please Remove Consecutive Words.");

        return true;

    }
    else {

        $('#' + dvid).removeClass('Error');
        $('#' + dvid1).html("");
        return false;
        //$('#' + dvid).removeClass('Error'); return true;
        //$('#error_' + dvid).html("");
    }
}

function checkText(input) {

    var pattern = new RegExp('^[a-zA-Z]+$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
//function checkTextWithSpace(input) {
//    var pattern = new RegExp('^[a-zA-Z ]+$');
//    var dvid = "dv" + input[0].id;
//    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
//    else { $('#' + dvid).removeClass('Error'); return true; }
//}



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
//function checkAddress(input) {
//    var pattern = new RegExp('^[a-zA-Z0-9-,./ ]+$');
//    var dvid = "dv" + input[0].id;
//    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
//    else { $('#' + dvid).removeClass('Error'); return true; }
//}

function checkAddress1(input) {

    var pattern = new RegExp("^[a-zA-Z0-9-/.,#'()\ ]+$");
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
    //var pattern = new RegExp('');//('/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/');
    //var lower = input.val().toLowerCase();
    //var result = pattern.test(lower);
    //var dvid = "dv" + input[0].id;
    //if (result == false) { $('#' + dvid).addClass('Error'); return false; }
    //else { $('#' + dvid).removeClass('Error'); return true; }


    //(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test('mayuri.tikal@gmail.com.in'))

    var dvid = "dv" + input[0].id;
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input.val().toLowerCase())) {
        $('#' + dvid).removeClass('Error'); //return true;
        return (true)
    }
    $('#' + dvid).addClass('Error'); //return false;
    return (false)


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

    var pattern = new RegExp('^[A-Z]{1}(?!0+$)[0-9]{7}$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val().toUpperCase()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
//function checkPAN(input) {

//    var pattern = new RegExp('^[A-Z]{5}[0-9]{4}[A-Z]{1}$');
//    var dvid = "dv" + input[0].id;
//    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
//    else { $('#' + dvid).removeClass('Error'); return true; }
//}
function checkPAN(input) {

    var pattern = new RegExp('^[A-Z]{5}[0-9]{4}[A-Z]{1}$');
    var dvid = "dv" + input[0].id;
    // var inputupp = input.val().toUpperCase()
    if (pattern.test(input.val().toUpperCase()) == false) { $('#' + dvid).addClass('Error'); return false; }
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





