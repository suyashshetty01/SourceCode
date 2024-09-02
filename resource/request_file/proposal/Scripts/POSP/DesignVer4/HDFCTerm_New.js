$(document).ready(function () {
   
});
$("#EmployeeID").keypress(function (e) {

    var regex = new RegExp("^[0-9A_Za-z]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});
$("#EmployeeDesignation").keypress(function (e) {

    var regex = new RegExp("^[A_Za-z ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});
$("#OccupationalDetailsOthers").keypress(function (e) {

    var regex = new RegExp("^[A_Za-z ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});

$(document).ready(function () {



});
//function (input) {
//    var pattern = new RegExp('/^([a-zA-Z]+\s)*[a-zA-Z]+$/');
//    var dvid = "dv" + input[0].id;
//    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
//    else { $('#' + dvid).removeClass('Error'); return true; }
//}

$("#InsuredBirthPlace").keypress(function (e) {

    var regex = new RegExp("^[A-Za-z]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});
$("#InsuredFatherName").keypress(function (e) {

    var regex = new RegExp("^[A-Za-z ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});
//CONTACT DETAIL
$("#ContactHOUSEFLATNUMBER").keypress(function (e) {

    var regex = new RegExp("^[a-zA-Z0-9-/., ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});

$("#ContactSTREETBUILDING").keypress(function (e) {

    var regex = new RegExp("^[a-zA-Z0-9-#()/.,' ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});


$("#ContactLandmark").keypress(function (e) {

    var regex = new RegExp("^[a-zA-Z0-9-#()/.,' ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});
//END

//PERMANENT CONTACT DETAIL
$("#PermanentContactHOUSEFLATNUMBER").keypress(function (e) {

    var regex = new RegExp("^[a-zA-Z0-9-/., ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});

$("#PermanentContactSTREETBUILDING").keypress(function (e) {

    var regex = new RegExp("^[a-zA-Z0-9-#()/.,' ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});


$("#PermanentLandmark").keypress(function (e) {

    var regex = new RegExp("^[a-zA-Z0-9-#()/.,' ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});


//END

$("#AddressOfPresentEmployer").keypress(function (e) {    //AddressOfPresentEmployer

    var regex = new RegExp("^[a-zA-Z0-9-#()/.,' ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});

//NOMINEE CONTACT DETAIL

$("#NomineeHOUSEFLATNUMBER").keypress(function (e) {

    var regex = new RegExp("^[a-zA-Z0-9-/., ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});

$("#NomineeSTREETBUILDING").keypress(function (e) {

    var regex = new RegExp("^[a-zA-Z0-9-#()/.,' ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});


$("#NomineeLandmark").keypress(function (e) {

    var regex = new RegExp("^[a-zA-Z0-9-#()/.,' ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});

//END


//APPOINTEE CONTACT DETAIL
$("#AppointeeHOUSEFLATNUMBER").keypress(function (e) {

    var regex = new RegExp("^[a-zA-Z0-9-/., ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});

$("#AppointeeSTREETBUILDING").keypress(function (e) {

    var regex = new RegExp("^[a-zA-Z0-9-#()/.,' ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});


$("#AppointeeLandmark").keypress(function (e) {

    var regex = new RegExp("^[a-zA-Z0-9-#()/.,' ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});

$("#NomineeRelationship").change(function () {
    $("#NomineeRelationshipTxt").val($("#NomineeRelationship option:selected").text())
})

$("#Nominee2Relationship").change(function () {
    $("#Nominee2RelationshipTxt").val($("#Nominee2Relationship option:selected").text())
})

$("#Nominee3Relationship").change(function () {
    $("#Nominee3RelationshipTxt").val($("#Nominee3Relationship option:selected").text())
})

$("#Nominee4Relationship").change(function () {
    $("#Nominee4RelationshipTxt").val($("#Nominee4Relationship option:selected").text())
})
//END
$("#AppointeeRelationship").change(function () {
    $("#AppointeeRelationshipTxt").val($("#AppointeeRelationship option:selected").text())
})

$("#Appointee2Relationship").change(function () {
    $("#Appointee2RelationshipTxt").val($("#Appointee2Relationship option:selected").text())
})

$("#Appointee3Relationship").change(function () {
    $("#Appointee3RelationshipTxt").val($("#Appointee3Relationship option:selected").text())
})

$("#Appointee4Relationship").change(function () {
    $("#Appointee4RelationshipTxt").val($("#Appointee4Relationship option:selected").text())
})