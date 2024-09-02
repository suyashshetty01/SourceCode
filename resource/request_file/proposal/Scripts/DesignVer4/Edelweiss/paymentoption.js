$().ready(function () {
    InitializeControls();

    visibilityControlOnDropdown("PaymentType", "Please select, Online, Cash", "dvChequeDetails");
    visibilityControlOnDropdown("PaymentType", "Please select, Online, Cheque", "dvCashDetails");
});

function InitializeControls() {
    if ($('#PaymentType').val() == 'ONLINE') {
        $('#dvOnlinePayment').show();
        $('#dvOfflinepayment').hide();
        $('#ChequeAmount').val('');
        $('#ChequeNo').val('');
        $('#ChequeDate').val('');
        $('#BankName').val('');
        $('#BankLocation').val('');
        $('#ReferenceNo').val('');
    }

    if ($('#PaymentType').val() == 'CASH' || $('#PaymentType').val() == 'CHEQUE') {
        $('#dvOnlinePayment').hide();
        $('#dvOfflinepayment').show();
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

$('#PaymentType').on('change', function () {
    if ($(this).val() == 'ONLINE') {
        $('#dvOnlinePayment').show();
        $('#dvOfflinepayment').hide();
        $('#ChequeAmount').val('');
        $('#ChequeNo').val('');
        $('#ChequeDate').val('');
        $('#BankName').val('');
        $('#BankLocation').val('');
        $('#ReferenceNo').val('');
    }

    if ($(this).val() == 'CASH' || $(this).val() == 'CHEQUE') {
        $('#dvOnlinePayment').hide();
        $('#dvOfflinepayment').show();
    }
});

/* VALIDATION */
$().ready(function () {

    var emailregex = /^([a-zA-Z\d_\.\-\+%])+\@(([a-zA-Z\d\-])+\.)+([a-zA-Z\d]{2,4})+$/;

    $.validator.addMethod("regex", function (value, element, regexp) {
        var check = false;
        return this.optional(element) || regexp.test(value);
    }, "Invalid input");

    $.validator.addMethod("GreaterThanZeroregex", function (value, element, regexp) {
        var check = false;
        return this.optional(element) || regexp.test(value);
    }, "Value should be greater than 0");

    $('select, .datepicker').change(function () {
        $(this).valid();
    });

    $("form").validate({
        rules: {
            PaymentType: { required: true },
            ChequeAmount: { required: true, GreaterThanZeroregex: /^[1-9][0-9]*$/ },
            ChequeNo: { required: true },
            ChequeDate: { required: true },
            BankName: { required: true },
            BankLocation: { required: true }
        },
        messages: {

        },
        errorClass: 'invalid',
        errorElement: 'div',
        invalidHandler: function (form, validator) {
            if (!validator.numberOfInvalids())
                return;
            $('html, body').animate({
                scrollTop: $(validator.errorList[0].element).offset().top
            }, 200);
        },
        errorPlacement: function (error, element) {
            $(element).parents('.form-group').addClass('has-error');
            error.insertAfter(element);
        }
    });
});