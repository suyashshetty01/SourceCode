$().ready(function () {
    InitializeControls();

    visibilityControlOnDropdown("LA_Nationality", "Please select,Indian,NRI,FNIO/PIO", "dvLAOtherNationality");
    visibilityControlOnDropdown("PROP_Nationality", "Please select,Indian,NRI,FNIO/PIO", "dvPROPOtherNationality");

    visibilityControlOnDropdown("LA_Qualification", "Please select,Post Graduate,Graduate,12th Passed,10th Passed,Below 10th,Student,Professional", "dvLAOtherQualification");
    visibilityControlOnDropdown("PROP_Qualification", "Please select,Post Graduate,Graduate,12th Passed,10th Passed,Below 10th,Student,Professional", "dvPROPOtherQualification");

    visibilityControlOnCheckbox_UnCheck("LA_PermanentAddressSameAsCurrentAddress", "dvLAPermanentAddress");
    visibilityControlOnCheckbox_UnCheck("PROP_PermanentAddressSameAsCurrentAddress", "dvPROPPermanentAddress");

    $('#LA_Nationality, #PROP_Nationality').on('change', function () {
        if ($(this).val() == '2')
            $('#NRIModal').modal();
    });
});

function InitializeControls() {
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
    //$('#LA_PermanentAddressSameAsCurrentAddress').prop('checked', 'checked');
    //$('#PROP_PermanentAddressSameAsCurrentAddress').prop('checked', 'checked');
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

