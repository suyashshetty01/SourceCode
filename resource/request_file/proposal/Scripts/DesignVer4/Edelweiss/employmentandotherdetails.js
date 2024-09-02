$().ready(function () {
    InitializeControls();

    visibilityControlOnDropdown("LA_EmploymentType", "Employment Type,Salaried,Self employed (Business),Self employed (Professional),Labourer/worker,Agriculture", "dvLA_OtherEmploymentType");
    visibilityControlOnDropdown("PROP_EmploymentType", "Employment Type,Salaried,Self employed (Business),Self employed (Professional),Labourer/worker,Agriculture", "dvPROP_OtherEmploymentType");

    visibilityControlOnRadioButton("LA_IsPEP", "rd_LA_PEP_True", "dvLAPEPDetails");
    visibilityControlOnRadioButton("PROP_IsPEP", "rd_PROP_PEP_True", "dvPROPPEPDetails");
});

function InitializeControls() {
    $('.datepicker').datepicker({
        dateFormat: "dd-M-yy"
    });

    $('#NomineeDOB').datepicker({
        onSelect: function (dateText) {
            console.log("Selected date: " + dateText + "; input's current value: " + this.value);
        }
    }).on("change", function (dateText) {
        console.log("Got change event from field");
        var selectedDate = GetDate($(this).val());
        console.log(selectedDate.getFullYear());
        var today = new Date();
        if (today >= new Date(selectedDate.getFullYear() + 18, selectedDate.getMonth(), selectedDate.getDate())) {
            //alert("Adult");
            $("#dvAppointee").hide();
            $('#AppointeeName').val('');
            $('#AppointeeDOB').val('');
            $('#AppointeeRelationWithNominee').val('');
        } else {
            //alert("Minor");
            $("#dvAppointee").show();
        }
        console.log($("#NomineeDOB").find("input").val());
    });

    $('#AppointeeDOB').datepicker({
        onSelect: function (dateText) {
            console.log("Selected date: " + dateText + "; input's current value: " + this.value);
        }
    }).on("change", function (dateText) {
        console.log("Got change event from field");
        var selectedDate = GetDate($(this).val());
        console.log(selectedDate.getFullYear());
        var today = new Date();
        if (today >= new Date(selectedDate.getFullYear() + 18, selectedDate.getMonth(), selectedDate.getDate())) {
            //alert("Adult");
        } else {
            //alert("Minor");
            alert("A minor cannot be an appointee")
        }
        console.log($("#NomineeDOB").find("input").val());
    });

    var isLAPropSame = $('#Propser_LifeAssured_Same').val();
    if (isLAPropSame != null && isLAPropSame != "") {
        if (isLAPropSame.toLowerCase() == "y") {
            $('#dvProposer').hide();
        }
        else {
            $('#dvProposer').show();
        }
    }
    else {
        $('#dvProposer').hide();
    }

    var selectedDate = GetDate($('#NomineeDOB').val());
    console.log(selectedDate.getFullYear());
    var today = new Date();
    if (today >= new Date(selectedDate.getFullYear() + 18, selectedDate.getMonth(), selectedDate.getDate())) {
        $("#dvAppointee").hide();
        $('#AppointeeName').val('');
        $('#AppointeeDOB').val('');
        $('#AppointeeRelationWithNominee').val('');
    }
    else {
        $("#dvAppointee").show();
    }
}

function visibilityControlOnDropdown(senderDropdownId, targetedValue, targetControlId) {
    var targetLength = targetControlId.split(",").length;
    var targetId = targetControlId.split(",");
    var i;
    $("#" + senderDropdownId).change(function () {
        if (targetedValue.indexOf($("#" + senderDropdownId + " option:selected").text()) > -1) {
            for (i = 0; i < targetLength; i++) {
                $("#" + targetId[i]).hide();
            }
        }
        else {
            for (i = 0; i < targetLength; i++) {
                //console.log(targetId[i]);
                $("#" + targetId[i]).show();
            }
        }
    });

    if (targetedValue.indexOf($("#" + senderDropdownId + " option:selected").text()) > -1) {
        for (i = 0; i < targetLength; i++) {
            $("#" + targetId[i]).hide();
        }
    }
    else {
        for (i = 0; i < targetLength; i++) {
            $("#" + targetId[i]).show();
        }
    }
}

function visibilityControlOnCheckbox(senderCheckBoxId, targetControlId) {
    var targetLength = targetControlId.split(",").length;
    var targetId = targetControlId.split(",");
    var i;
    $("#" + senderCheckBoxId).change(function () {
        if ($("#" + senderCheckBoxId).is(":checked")) {
            for (i = 0; i < targetLength; i++) {
                $("#" + targetId[i]).slideDown();
            }
        }
        else {
            for (i = 0; i < targetLength; i++) {
                $("#" + targetId[i]).slideUp();
            }
        }
    });

    if ($("#" + senderCheckBoxId).is(":checked")) {
        for (i = 0; i < targetLength; i++) {
            $("#" + targetId[i]).slideDown();
        }
    }
    else {
        for (i = 0; i < targetLength; i++) {
            $("#" + targetId[i]).slideUp();
        }
    }
}

function visibilityControlOnCheckbox_UnCheck(senderCheckBoxId, targetControlId) {
    var targetLength = targetControlId.split(",").length;
    var targetId = targetControlId.split(",");
    var i;
    $("#" + senderCheckBoxId).change(function () {
        if ($("#" + senderCheckBoxId).is(":checked")) {
            for (i = 0; i < targetLength; i++) {
                $("#" + targetId[i]).slideUp();
            }
        }
        else {
            for (i = 0; i < targetLength; i++) {
                $("#" + targetId[i]).slideDown();
            }
        }
    });

    if ($("#" + senderCheckBoxId).is(":checked")) {
        for (i = 0; i < targetLength; i++) {
            $("#" + targetId[i]).slideUp();
        }
    }
    else {
        for (i = 0; i < targetLength; i++) {
            $("#" + targetId[i]).slideDown();
        }
    }
}

function visibilityControlOnRadioButton(senderRdbGroup, visibleRdbId, targetControlId, reverse) {
    var targetLength = targetControlId.split(",").length;
    var targetId = targetControlId.split(",");
    var i;
    $("input[type='radio'][name='" + senderRdbGroup + "']").click(function () {
        if ($("#" + visibleRdbId).is(":checked")) {
            for (i = 0; i < targetLength; i++) {
                $("#" + targetId[i]).slideDown();
            }
        }
        else {
            for (i = 0; i < targetLength; i++) {
                $("#" + targetId[i]).slideUp();
            }
        }
    });

    if ($("#" + visibleRdbId).is(":checked")) {
        for (i = 0; i < targetLength; i++) {
            $("#" + targetId[i]).slideDown();
        }
    }
    else {
        for (i = 0; i < targetLength; i++) {
            $("#" + targetId[i]).slideUp();
        }
    }
}

function getage(str) {
    var dob
    if (str.indexOf('/') === -1)
        dob = str.split('-');
    else
        dob = str.split('/');
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    else {
        mm = mm.toString();
    }

    today = yyyy + mm + dd;
    dob = dob[2] + dob[1] + dob[0];
    dob = parseInt(dob);
    today = parseInt(today);
    var age = today - dob;
    age = parseInt(age / 10000);
    return age;
}

$('#NomineeDOB').on('dp.change', function (ev) {
    var selectedDate = GetDate(ev.date);
    console.log(selectedDate.getFullYear());
    var today = new Date();
    if (today >= new Date(selectedDate.getFullYear() + 18, selectedDate.getMonth(), selectedDate.getDate())) {
        //alert("Adult");
        $("#dvAppointee").hide();
        $('#AppointeeName').val('');
        $('#AppointeeDOB').val('');
        $('#AppointeeRelationWithNominee').val('');
    } else {
        //alert("Minor");
        $("#dvAppointee").show();
    }
    console.log($("#NomineeDOB").find("input").val());
});

function GetDate(str) {
    var arr = str.split("-");
    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    var month = months.indexOf(arr[1].toLowerCase());

    return new Date(parseInt(arr[2]), month, parseInt(arr[0]));
}