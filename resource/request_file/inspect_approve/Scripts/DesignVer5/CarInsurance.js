//var types = $("#CarType").val();
function GetLTPostOfficeLtg(Pincode) {
    $.get('/CarInsuranceIndia/GetLTPostOfficeLtg?Pincode=' + Pincode, function (response) {
        var _responce = (response);
        var listItems = "";
        listItems = " <option value=\"0\">Select City</option>";
        for (var i = 0; i < _responce.length; i++)
        { listItems += "<option value='" + _responce[i].Value + "'>" + _responce[i].Text + "</option>"; }
        $("#PostOfficeVORef").html(listItems);
        $("#PostOfficeVORef option:contains(" + $("#HiddenPostOfficeName").val() + ")").attr('selected', 'selected');
        $("#PostOfficeVORef").selectedIndex = "0";
    });
}

function GetLTDistrictState(Pincode) {
    $.get('/CarInsuranceIndia/GetLTDistrictState?Pincode=' + Pincode, function (response) {
        var _responce = (response);
        var listItems = "";
        listItems = _responce.split('&');
        if (listItems.length > 0) {
            $("#DistrictName").val(listItems[0]);
            $("#ProvinceName").val(listItems[2]);
        }
        else {
            $("#DistrictName").val('');
            $("#ProvinceName").val('');
        }
    });
}

function checkFlat(input) {

    var pattern = new RegExp('^[0-9a-zA-Z ,/-]+$');
    var id = "spn" + input[0].id;
    if (pattern.test(input.val()) == false) {
        $('#' + id + '').remove();
        $(input).addClass('Error');
        $(input).after('<span id=' + id + ' class="ErrorText">Enter Valid Address</span>');
        return false;
    }
    else {
        $(input).removeClass('Error');
        $('#' + id + '').remove();
        return true;
    }
}

function ValidateContactNewForCommonCarContact() {

    $('#ErrorMessage').hide();
    ValidateError = 0;
    //if ($('#divGenderMale').is(':visible') == true) {
    //    if ($('input[name=Gender]:checked').val() == 'M') {
    //        $("#divGenderMale").removeClass('Error');
    //        $("#divGenderMale").addClass('active');
    //    }
    //    else if ($('input[name=Gender]:checked').val() == 'F') {
    //        $("#divGenderFemale").removeClass('Error');
    //        $("#divGenderFemale").addClass('active');
    //    }
    //    else {
    //        $("#divGenderMale").addClass('Error');
    //        $("#divGenderFemale").addClass('Error');
    //        ValidateError++;
    //    }
    //}
    if ($('#divSingle').is(':visible') == true) {
        if (document.getElementById('MaritalStatus') != null) {
            if ($('#MaritalStatus').val() == 'M') {
                $("#divMarried").removeClass('Error');
                $("#divMarried").addClass('active');
                $("#MaritalStatus").val("M");
            }
            else if ($('#MaritalStatus').val() == 'S') {
                $("#divSingle").removeClass('Error');
                $("#divSingle").addClass('active');
                $("#MaritalStatus").val("S");
            }
            else {
                $("#divSingle").addClass('Error');
                $("#divMarried").addClass('Error');
                ValidateError++;
            }
        }
    }
    if ($('#MaritalStatusID').val() == null || $('#MaritalStatusID').val() == "0" || $('#MaritalStatusID').val() == "") {
        if ($('#MaritalStatusID').is(':visible')) {
            $('#MaritalStatusID').addClass('Error');
            ValidateError++;
        }
    } else { $('#MaritalStatusID').removeClass('Error'); }

    //if ($('#AreYouOwnerNo').is(':visible') == true) {
    //    if ($('#AreYouOwnerYes').hasClass('active')) {
    //        $("#AreYouOwnerYes").removeClass('Error');
    //        $("#AreYouOwnerYes").addClass('active');
    //    }
    //    else if ($('#AreYouOwnerNo').hasClass('active')) {
    //        $("#AreYouOwnerNo").removeClass('Error');
    //        $("#AreYouOwnerNo").addClass('active');
    //    }
    //    else {
    //        $("#AreYouOwnerNo").addClass('Error');
    //        $("#AreYouOwnerYes").addClass('Error');
    //        ValidateError++;
    //    }
    //}
    //if ($('#divOwnerGender').is(':visible') == true) {
    //    if ($('input[name=OwnerGender]:checked').val() == 'M') {
    //        $("#divOwnerGenderMale").removeClass('Error');
    //        $("#divOwnerGenderMale").addClass('active');
    //    }
    //    else if ($('input[name=OwnerGender]:checked').val() == 'F') {
    //        $("#divOwnerGenderFemale").removeClass('Error');
    //        $("#divOwnerGenderFemale").addClass('active');
    //    }
    //    else {
    //        $("#divOwnerGenderMale").addClass('Error');
    //        $("#divOwnerGenderFemale").addClass('Error');
    //        ValidateError++;
    //    }
    //}

    if ($('#PermanentCityID').val() == null || $('#PermanentCityID').val() == "0" || $('#PermanentCityID').val() == "") {
        if ($('#PermanentCityName').is(':visible')) {
            $('#PermanentCityName').addClass('Error');
            ValidateError++;
        }
    } else { $('#PermanentCityName').removeClass('Error'); }

    if ($('#SalutationID').val() == null || $('#SalutationID').val() == "0" || $('#SalutationID').val() == "") {
        if ($('#SalutationID').is(':visible')) {
            $('#SalutationID').addClass('Error');
            ValidateError++;
        }
    } else { $('#SalutationID').removeClass('Error'); }

    if ($('#MaritalStatusID').val() == 0 || $('#MaritalStatusID').val() == "") {
        $('#MaritalStatusID').addClass('Error');
        ValidateError++;
    }
    else { $('#MaritalStatusID').removeClass('Error'); }

    if ($('#ContactCityID').val() == "" || $('#ContactCityID').val() == "0" || $('#ContactCityName').val() == "") {
        if ($('#ContactCityName').is(':visible')) {
            //$('#ContactCityName').addClass('Error'); //Commented Old Validation
            $('#dvContactCityName').addClass('Error'); //Added New Validation
            ValidateError++;
        }
    } else {
        //$('#ContactCityName').removeClass('Error');  //Commented Old Validation
        $('#dvContactCityName').removeClass('Error');  //Added New Validation
    }

    //if ($('#PermanentCityName').is(':visible')) {
    //    if ($('#PermanentCityName').val() == "") {
    //        $('#PermanentCityName').addClass('Error');
    //        ValidateError++;
    //    } else { $('#PermanentCityName').removeClass('Error'); }
    //}

    //if ($('#PermanentCityName').is(':visible')) {
    //    if ($('#PermanentCityName').val() == "") {
    //        $('#PermanentCityName').addClass('Error');
    //        ValidateError++;
    //    } else { $('#PermanentCityName').removeClass('Error'); }
    //}

    //  alert(3);
    // $("#PostOfficeVORef option:contains(" + $("#HiddenPostOfficeName").val() + ")").attr('selected', 'selected');
    //TitleVORef
    if ($('#TitleVORef').is(':visible')) {
        if ($('#TitleVORef').val() == 0) {
            $('#TitleVORef').addClass('Error');
            ValidateError++;
        }
        else { $('#TitleVORef').removeClass('Error'); }
    }

    if ($('#ContactName').val() == "" || $('#ContactName').val().length < 3) {
        $('#ContactName').addClass('Error');
        ValidateError++;
    }
    else {
        var val = checkTextWithoutSpace($('#ContactName'));
        if (val == false) { ValidateError++; }
        else { $('#ContactName').removeClass('Error'); }
    }

    if ($('#ContactMiddleName').is(':visible')) {
        if ($('#ContactMiddleName').val() == "" || $('#ContactMiddleName').val().length < 3)
        { $('#ContactMiddleName').removeClass('Error'); }
        else {
            var val = checkTextWithoutSpace($('#ContactMiddleName'));
            if (val == false) { ValidateError++; }
            else { $('#ContactMiddleName').removeClass('Error'); }
        }
    }
    //added by binaka
    if ($('#ContactLastName').is(':visible') == true) {
        if ($('#ContactLastName').val() == "" || $('#ContactLastName').val().length < 3) {
            $('#ContactLastName').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkTextWithoutSpace($('#ContactLastName'));
            if (val == false) { ValidateError++; }
            else { $('#ContactLastName').removeClass('Error'); }
        }
    }
    if ($('#ContactFatherFirstName').is(':visible')) {
        if ($('#ContactFatherFirstName').val() == "") {
            $('#ContactFatherFirstName').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkText($('#ContactFatherFirstName'));
            if (val == false) { ValidateError++; }
            else { $('#ContactFatherFirstName').removeClass('Error'); }
        }
    }
    if ($('#ContactFatherLastName').is(':visible')) {
        if ($('#ContactFatherLastName').val() == "") {
            $('#ContactFatherLastName').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkText($('#ContactFatherLastName'));
            if (val == false) { ValidateError++; }
            else { $('#ContactFatherLastName').removeClass('Error'); }
        }
    }

    //added by binaka
    $("#AreYouOwner").val('true');
    $('#OwnerName').val($('#ContactName').val() + ' ' + $('#ContactLastName').val());

    //if ($('#divGenderMale').hasClass("active"))
    //{
    //    $('#OwnerGender').val("M");
    //}

    //else{
    //    $('#OwnerGender').val("F");
    //}

    //added by binaka


    // alert($("#AreYouOwner").val() + "," + $('#OwnerName').val() + "," + $('#OwnerGender').val());

    //if ($('#PermanentCityID').val() == null || $('#PermanentCityID').val() == "0" || $('#PermanentCityID').val() == "") {
    //    $('#PermanentCityName').addClass('Error');
    //    ValidateError++;
    //} else { $('#PermanentCityName').removeClass('Error'); }


    if ($('#ContactAddress').val() == "") {
        $('#ContactAddress').addClass('Error');
        ValidateError++;
    }
    else {

        var val = checkAddress($('#ContactAddress'));
        //var flat = checkFlat($('#ContactAddress'));
        if (val == false) { ValidateError++; }
        else { $('#ContactAddress').removeClass('Error'); }
    }

    if ($('#Address2').is(':visible') == true) {
        if ($('#Address2').val() == "") {
            $('#Address2').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkAddress($('#Address2'));
            if (val == false) { ValidateError++; }
            else { $('#Address2').removeClass('Error'); }
        }
    }
    //Address3
    if ($('#Address3').is(':visible') == true) {
        if ($('#Address3').val() == "") {
            $('#Address3').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkAddress($('#Address3'));
            if (val == false) { ValidateError++; }
            else { $('#Address3').removeClass('Error'); }
        }
    }

    if ($('#ContactPinCode').val().length == 0) {
        $('#ContactPinCode').addClass('Error');
        ValidateError++;
    }
    else if ($('#ContactPinCode').val() == "000000") {
        $('#ContactPinCode').addClass('Error');
        ValidateError++;
    }
    else {
        var val = checkPinCode($('#ContactPinCode'));
        if (val == false) {
            ValidateError++;
            $(this).after('<span id="spnContactPinCode" class="ErrorText">Require valid Postal Code</span>');
        }
        else {
            if ($("#ContactPinCode").val().length > 5) {

                if ($('#PostOfficeVORef').is(':visible') == true && $('#PostOfficeVORef').val() == 0 || $('#PostOfficeVORef').val() == null) {
                    //GetLTPostOfficeLtg($("#ContactPinCode").val());
                    //GetLTDistrictState($("#ContactPinCode").val());
                }
            }
            $('#ContactPinCode').removeClass('Error');
        }
    }

    if ($('#ddlContactCityID').is(':visible') == true) {
        if ($('#ddlContactCityID').val() == "" | $('#ddlContactCityID').val() == "0" || $('#ddlContactCityID').val() == null) {
            $('#ddlContactCityID').addClass('Error');
            ValidateError++;
        } else { $('#ddlContactCityID').removeClass('Error'); }
    }

    if ($('#PostOfficeVORef').is(':visible') == true) {
        if ($('#PostOfficeVORef').val() == 0 || $('#PostOfficeVORef').val() == null) {
            $('#PostOfficeVORef').addClass('Error');
            ValidateError++;
        }
        else { $('#PostOfficeVORef').removeClass('Error'); }
    }



    if ($('#DOBofOwner').is(':visible') == true) {
        if ($('#DOBofOwner').val() == "") {
            $('#dvDOBofOwner').addClass('Error');
            ValidateError++;
        } else { $('#dvDOBofOwner').removeClass('Error'); }
    }

    if ($('#ContactMobile').val().length == 0) {
        $('#ContactMobile').addClass('Error');
        ValidateError++;
    }
    else {
        var val = checkMobile($('#ContactMobile'));
        if (val == false) {
            ValidateError++;
            //$this.addClass('Error');
            $(this).after('<span id="spnContactMobile" class="ErrorText">Require valid Mobile No.</span>');
        }
        else {
            $('#spnContactMobile').remove();
        }
    }

    if ($('#ContactEmail').val().length == 0) {
        $('#dvContactEmail').addClass('Error');
        ValidateError++;
    }
    else {
        var val = checkEmail($('#ContactEmail'));
        if (val == false) {
            ValidateError++;
            //$(this).after('<span id="spnContactEmail" class="ErrorText">Require valid Email ID</span>');
        }
        //else {
        //    $('#spnContactEmail').remove();
        //}
    }

    if ($('#IdTypeRef').is(':visible')) {
        if ($('#IdTypeRef').val() == 0) {
            $('#IdTypeRef').addClass('Error');
            ValidateError++;
        } else { $('#IdTypeRef').removeClass('Error'); }
    }
    else { $('#IdTypeRef').removeClass('Error'); }

    if ($('#IdValue').is(':visible')) {
        if ($('#IdValue').val() == "") {
            $('#IdValue').addClass('Error');
            ValidateError++;
        }
        else {

            //var val = checkTextWithoutSpace($('#IdValue'));
            var val = checkAlphaNumericWithoutSpace($('#IdValue'));

            if (val == false) {
                ValidateError++;
            }
            else { $('#IdValue').removeClass('Error'); }
        }
    }

    //Validate ('#LT_AAAI_LTG_ID');
    if ($('#LT_AAAI_LTG_ID').is(':visible')) {
        if ($('#LT_AAAI_LTG_ID').val() == 0) {
            $('#LT_AAAI_LTG_ID').addClass('Error');
            ValidateError++;
        } else { $('#LT_AAAI_LTG_ID').removeClass('Error'); }
    }
    else { $('#LT_AAAI_LTG_ID').removeClass('Error'); }


    if ($('#OwnerName').is(':visible')) {
        if ($('#OwnerName').val() == "") {
            //$('#OwnerName').addClass('Error'); //Commented Old Validation
            $('#dvOwnerName').addClass('Error'); //Added New Validation
            ValidateError++;
        }
        else {
            var val = checkText($('#OwnerName'));
            if (val == false) { ValidateError++; }
            else {
                //$('#OwnerName').removeClass('Error'); //Commented Old Validation 
                $('#dvOwnerName').removeClass('Error'); //Added New Validation
            }
        }
    }
}

function ValidateContact(Company) {
    debugger;
    if ($("#SelectedInsurerID").val() == 2 && $("#AreYouOwner").val() == "false") {
        $('#OwnerName').val($("#ContactName").val() + " " + $("#ContactLastName").val());
    }

    $('#ErrorMessage').hide();
    ValidateError = 0;

    //if ($('#divGenderMale').is(':visible') == true) {
    //    if ($('input[name=Gender]:checked').val() == 'M') {
    //        $("#divGenderMale").removeClass('Error');
    //        $("#divGenderMale").addClass('active');
    //    }
    //    else if ($('input[name=Gender]:checked').val() == 'F') {
    //        $("#divGenderFemale").removeClass('Error');
    //        $("#divGenderFemale").addClass('active');
    //    }
    //    else {
    //        $("#divGenderMale").addClass('Error');
    //        $("#divGenderFemale").addClass('Error');
    //        ValidateError++;
    //    }
    //}

    if ($('#divSingle').is(':visible') == true) {
        if (document.getElementById('MaritalStatus') != null) {
            if ($('#MaritalStatus').val() == 'M') {
                $("#divMarried").removeClass('Error');
                $("#divMarried").addClass('active');
            }
            else if ($('#MaritalStatus').val() == 'S') {
                $("#divSingle").removeClass('Error');
                $("#divSingle").addClass('active');
            }
            else {
                $("#divSingle").addClass('Error');
                $("#divMarried").addClass('Error');
                ValidateError++;
            }
        }
    }
    if ($('#MaritalStatusID').val() == null || $('#MaritalStatusID').val() == "0" || $('#MaritalStatusID').val() == "") {
        if ($('#MaritalStatusID').is(':visible')) {
            $('#MaritalStatusID').addClass('Error');
            ValidateError++;
        }
    } else { $('#MaritalStatusID').removeClass('Error'); }

    if ($('#AreYouOwnerNo').is(':visible') == true) {
        if ($('#AreYouOwnerYes').hasClass('active')) {
            $("#AreYouOwnerYes").addClass('active');
            $("#AreYouOwnerYes").removeClass('Error');
            $("#AreYouOwnerNo").removeClass('Error');
        }
        else if ($('#AreYouOwnerNo').hasClass('active')) {
            $("#AreYouOwnerNo").addClass('active');
            $("#AreYouOwnerYes").removeClass('Error');
            $("#AreYouOwnerNo").removeClass('Error');
        }
        //else {
        //    $("#AreYouOwnerNo").addClass('Error');
        //    $("#AreYouOwnerYes").addClass('Error');
        //    ValidateError++;
        //}
    }

    if (Company != 'Reliance') {
     if ($('#PermanentCityID').val() == null || $('#PermanentCityID').val() == "0" || $('#PermanentCityID').val() == "") {
            if ($('#PermanentCityName').is(':visible')) {
                $('#dvPermanentCityName').addClass('Error');
                ValidateError++;
            }
        } else { $('#dvPermanentCityName').removeClass('Error'); }
    }
   

    if ($('#SalutationID').val() == null || $('#SalutationID').val() == "0" || $('#SalutationID').val() == "") {
        if ($('#SalutationID').is(':visible')) {
            $('#SalutationID').addClass('Error');
            ValidateError++;
        }
    } else { $('#SalutationID').removeClass('Error'); }

    if ($('#MaritalStatusID').val() == 0 || $('#MaritalStatusID').val() == "") {
        $('#MaritalStatusID').addClass('Error');
        ValidateError++;
    }
    else { $('#MaritalStatusID').removeClass('Error'); }

    if ($('#ContactCityID').val() == "" || $('#ContactCityID').val() == "0" || $('#ContactCityName').val() == "") {
        if ($('#ContactCityName').is(':visible')) { $('#dvContactCityName').addClass('Error'); ValidateError++; }
    } else { $('#dvContactCityName').removeClass('Error'); }

    //if ($('#PermanentCityName').is(':visible')) {
    //    if ($('#PermanentCityName').val() == "") {
    //        $('#PermanentCityName').addClass('Error');
    //        ValidateError++;
    //    } else { $('#PermanentCityName').removeClass('Error'); }
    //}

    //if ($('#PermanentCityName').is(':visible')) {
    //    if ($('#PermanentCityName').val() == "") {
    //        $('#PermanentCityName').addClass('Error');
    //        ValidateError++;
    //    } else { $('#PermanentCityName').removeClass('Error'); }
    //}

    //  alert(3);
    // $("#PostOfficeVORef option:contains(" + $("#HiddenPostOfficeName").val() + ")").attr('selected', 'selected');
    //TitleVORef
    if ($('#TitleVORef').is(':visible')) {
        if ($('#TitleVORef').val() == 0) { $('#TitleVORef').addClass('Error'); ValidateError++; }
        else { $('#TitleVORef').removeClass('Error'); }
    }

    var val1 = checkTextWithoutSpace($('#ContactName'));
    if ($('#ContactName').val() == "" || $('#ContactName').val().length < 3 || val1 == false) { $('#dvContactName').addClass('Error'); ValidateError++; }
    else { $('#dvContactName').removeClass('Error'); }

    var val2 = checkTextWithoutSpace($('#ContactLastName'));
    if ($('#ContactLastName').val() == "" || $('#ContactLastName').val().length < 3 || val2 == false) { $('#dvContactLastName').addClass('Error'); ValidateError++; }
    else { $('#dvContactLastName').removeClass('Error'); }

    var val3 = checkMobile($('#ContactMobile'));
    if ($('#ContactMobile').val().length == 0 || val3 == false) { $('#dvContactMobile').addClass('Error'); ValidateError++; }
    else { $('#dvContactMobile').removeClass('Error'); }

    var val4 = checkEmail($('#ContactEmail'));
    if ($('#ContactEmail').val().length == 0 || val4 == false) { $('#dvContactEmail').addClass('Error'); ValidateError++; }
    else { $('#dvContactEmail').removeClass('Error'); }

    if (Company !='Libarty') {
        if ($('#ContactMiddleName').is(':visible')) {
            var val5 = checkTextWithoutSpace($('#ContactMiddleName'));
            if ($('#ContactMiddleName').val() == "" || $('#ContactMiddleName').val().length < 3 || val5 == false) { $('#dvContactMiddleName').addClass('Error'); ValidateError++; }
            else { $('#dvContactMiddleName').removeClass('Error'); }
        }
    }
    if ($('#ContactFatherFirstName').is(':visible')) {
        var val6 = checkTextWithoutSpace($('#ContactFatherFirstName'));
        if ($('#ContactFatherFirstName').val() == "" || $('#ContactFatherFirstName').val().length < 3 || val6 == false) { $('#dvContactFatherFirstName').addClass('Error'); ValidateError++; }
        else { $('#dvContactFatherFirstName').removeClass('Error'); }
    }
    if ($('#ContactFatherLastName').is(':visible')) {
        var val7 = checkTextWithoutSpace($('#ContactFatherLastName'));
        if ($('#ContactFatherLastName').val() == "" || $('#ContactFatherLastName').val().length < 3 || val7 == false) { $('#dvContactFatherLastName').addClass('Error'); ValidateError++; }
        else { $('#dvContactFatherLastName').removeClass('Error'); }
    }

    //if ($('#PermanentCityID').val() == null || $('#PermanentCityID').val() == "0" || $('#PermanentCityID').val() == "") {
    //    $('#PermanentCityName').addClass('Error');
    //    ValidateError++;
    //} else { $('#PermanentCityName').removeClass('Error'); }
    if (Company != 'Reliance'){
        if ($('#PANNo').is(':visible')) {
            if ($("#PANNo").val() != "") {
                var pan = $("#PANNo").val();
                var pan_pattern = /[A-Za-z]{5}\d{4}[A-Za-z]{1}/;
                var result = pan.match(pan_pattern);
                if (result != null) {
                    $("#dvPANNo").removeClass('Error');
                }
                else {
                    $("#dvPANNo").addClass('Error');
                    ValidateError++;
                }
            }
            else if ($('#NetPayablePayablePremium').val() >= 50000) {
                ($("#dvPANNo").addClass('Error'));
                ValidateError++;
            }
            else
                $("#dvPANNo").removeClass('Error');
        }
    }


    //ContactAddress
    var valAdd1 = checkAddress($('#ContactAddress'));
    if ($('#ContactAddress').val() == "" || valAdd1 == false) { $('#dvContactAddress').addClass('Error'); ValidateError++; }
    else { $('#dvContactAddress').removeClass('Error'); }

    //Address2
    if (Company == 'Libarty') {        
            var valAdd2 = checkAddress($('#Address2'));
            if ($('#Address2').val() == "" || valAdd2 == false) { $('#dvAddress2').addClass('Error'); ValidateError++; }
            else { $('#dvAddress2').removeClass('Error'); }       
    }
    else {
        if ($('#Address2').is(':visible') == true) {
            var valAdd2 = checkAddress($('#Address2'));
            if ($('#Address2').val() == "" || valAdd2 == false) { $('#dvAddress2').addClass('Error'); ValidateError++; }
            else { $('#dvAddress2').removeClass('Error'); }
        }
    }

    //Address3
    if (Company == 'Libarty') {
        var valAdd3 = checkAddress($('#Address3'));
        if ($('#Address3').val() == "" || valAdd3 == false) { $('#dvAddress3').addClass('Error'); ValidateError++; }
        else { $('#dvAddress3').removeClass('Error'); }
    }
    else {
        if ($('#Address3').is(':visible') == true) {
            var valAdd3 = checkAddress($('#Address3'));
            if ($('#Address3').val() == "" || valAdd3 == false) { $('#dvAddress3').addClass('Error'); ValidateError++; }
            else { $('#dvAddress3').removeClass('Error'); }
        }
    }
    if ($('#ContactPinCode').val().length == 0) {
        $('#dvContactPinCode').addClass('Error');
        ValidateError++;
    }
    else if ($('#ContactPinCode').val() == "000000") {
        $('#dvContactPinCode').addClass('Error');
        ValidateError++;
    }
    else {
        var val = checkPinCode($('#ContactPinCode'));
        if (val == false) {
            ValidateError++;
            //$(this).after('<span id="spnContactPinCode" class="ErrorText">Require valid Postal Code</span>');
        }
        else {
            if ($("#ContactPinCode").val().length > 5) {
                if ($('#PostOfficeVORef').is(':visible') == true && $('#PostOfficeVORef').val() == 0 || $('#PostOfficeVORef').val() == null) {
                    //GetLTPostOfficeLtg($("#ContactPinCode").val());
                    //GetLTDistrictState($("#ContactPinCode").val());
                }
            }
            $('#dvContactPinCode').removeClass('Error');
        }
    }
    if (Company == 'Libarty') {
        if ($('#ddlContactCityID').val() == "" | $('#ddlContactCityID').val() == "0" || $('#ddlContactCityID').val() == null) {
            $('#ddlContactCityID').addClass('Error');
            ValidateError++;
        } else { $('#ddlContactCityID').removeClass('Error'); }
    }
    else {
        if ($('#ddlContactCityID').is(':visible') == true) {
            if ($('#ddlContactCityID').val() == "" | $('#ddlContactCityID').val() == "0" || $('#ddlContactCityID').val() == null) {
                $('#ddlContactCityID').addClass('Error');
                ValidateError++;
            } else { $('#ddlContactCityID').removeClass('Error'); }
        }
    }

    if ($('#PostOfficeVORef').is(':visible') == true) {
        if ($('#PostOfficeVORef').val() == 0 || $('#PostOfficeVORef').val() == null) {
            $('#PostOfficeVORef').addClass('Error');
            ValidateError++;
        }
        else { $('#PostOfficeVORef').removeClass('Error'); }
    }
    if (Company == 'Libarty') {
        if ($('#DistrictName').val() == "") {
            $('#dvDistrictName').addClass('Error');
            ValidateError++;
        } else { $('#dvDistrictName').removeClass('Error'); }
    }
    else {
        if ($('#DistrictName').is(':visible') == true) {
            if ($('#DistrictName').val() == "") {
                $('#dvDistrictName').addClass('Error');
                ValidateError++;
            } else { $('#dvDistrictName').removeClass('Error'); }
        }
    }
    if (Company == 'Libarty') {
        if ($('#StateName').val() == "") {
            $('#dvStateName').addClass('Error');
            ValidateError++;
        } else { $('#dvStateName').removeClass('Error'); }
    }
    else {
        if ($('#StateName').is(':visible') == true) {
            if ($('#StateName').val() == "") {
                $('#dvStateName').addClass('Error');
                ValidateError++;
            } else { $('#dvStateName').removeClass('Error'); }
        }
    }
    if (Company == 'Libarty') {
        if ($('#DOBofOwner').val() == "") {
            $('#dvDOBofOwner').addClass('Error');
            ValidateError++;
        } else { $('#dvDOBofOwner').removeClass('Error'); }
    }
    else {
        if ($('#DOBofOwner').is(':visible') == true) {
            if ($('#DOBofOwner').val() == "") {
                $('#dvDOBofOwner').addClass('Error');
                ValidateError++;
            } else { $('#dvDOBofOwner').removeClass('Error'); }
        }
    }
    if ($('#IdTypeRef').is(':visible') == true) {
        if ($('#IdTypeRef').val() == 0) {
            $('#IdTypeRef').addClass('Error');
            ValidateError++;
        } else { $('#IdTypeRef').removeClass('Error'); }
    }
    else { $('#IdTypeRef').removeClass('Error'); }

    if ($('#IdValue').is(':visible') == true) {
        if ($('#IdValue').val() == "") {
            $('#IdValue').addClass('Error');
            ValidateError++;
        }
        else {

            //var val = checkTextWithoutSpace($('#IdValue'));
            var val = checkAlphaNumericWithoutSpace($('#IdValue'));

            if (val == false) {
                ValidateError++;
            }
            else { $('#IdValue').removeClass('Error'); }
        }
    }

    //Validate ('#LT_AAAI_LTG_ID');
    if ($('#LT_AAAI_LTG_ID').is(':visible')==true) {
        if ($('#LT_AAAI_LTG_ID').val() == 0) {
            $('#LT_AAAI_LTG_ID').addClass('Error');
            ValidateError++;
        } else { $('#LT_AAAI_LTG_ID').removeClass('Error'); }
    }
    else { $('#LT_AAAI_LTG_ID').removeClass('Error'); }


    if ($('#OwnerName').is(':visible') == true) {
        var data = $('#OwnerName').val();
        var arr = data.split(' ');
        if ($('#OwnerName').val() == "" || arr.length < 2 || arr[arr.length - 1] == "") {
            //$('#OwnerName').addClass('Error'); //Commented Old Validation
            $('#dvOwnerName').addClass('Error'); //Added New Validation
            ValidateError++;
        }
        else {
            var val = checkText($('#OwnerName'));
            if (val == false) { ValidateError++; }
            else {
                //$('#OwnerName').removeClass('Error'); //Commented Old Validation 
                $('#dvOwnerName').removeClass('Error'); //Added New Validation 
            }
        }
    }
    if (Company == 'Reliance') {
        if ($('#ContactOccupationId').val() == 0 || $('#ContactOccupationId').val() == "") {
            $('#ContactOccupationId').addClass('Error');
            ValidateError++;
        }
        else { $('#ContactOccupationId').removeClass('Error'); }
    }
    //ValidateError = 0;//EEEEEE 
    if (ValidateError < 1) {
        //eventsubmmision(1, 'next', 'enter contact-details', 'car-insurance contactdetails step 1 event',types);
        $('#iconContact').removeClass('glyphs');
        return true;
    }
    else { return false; }
}

//$EngineNumber = ;
//$ChasisNumber = ;
//alert(1);
$('#EngineNumber').focusout(function () {
    var id = "spnEngineNumber";
    $('#' + id + '').remove();
    if ($('#EngineNumber').val().length < 7 || $('#EngineNumber').val().length > 20 || $('#EngineNumber').val() == "") {
        //($('#EngineNumber')).after('<span id=' + id + ' class="ErrorText">Please Enter Engine Number between 7 and 20.</span>'); //Commented Old Validation
        //($('#dvEngineNumber')).after('<span id=' + id + ' class="ErrorText">Please Enter Engine Number between 7 and 20.</span>'); //Added New Validation
        $('#dvEngineNumber').addClass('Error');
        return false;
        //ValidateError++;
    }
    else {
        $('#dvEngineNumber').removeClass('Error');
        $('#' + id + '').remove();
    }
});

$('#ChasisNumber').focusout(function () {
    id = "spnChasisNumber";
    $('#' + id + '').remove();
    if ($('#ChasisNumber').val().length < 7 || $('#ChasisNumber').val().length > 20 || $('#ChasisNumber').val() == "") {
        //($('#ChasisNumber')).after('<span id=' + id + ' class="ErrorText">Please Enter Chasis Number between 7 and 20.</span>'); //Commented Old Validation
        //($('#dvChasisNumber')).after('<span id=' + id + ' class="ErrorText">Please Enter Chasis Number between 7 and 20.</span>'); //Added New Validation
        $('#dvChasisNumber').addClass('Error');
        return false;
    } else {
        $('#dvChasisNumber').removeClass('Error');
        $('#' + id + '').remove();
    }
});
var $PolicyNumber = $('PolicyNumber');
$('#PolicyNumber').focusout(function () {
    ValidateError = 0;
    if ($('#PolicyNumber').val() == "" || $('#PolicyNumber').val().length == 0) {
        $('#dvPolicyNumber').addClass('Error');
        ValidateError++;
    }
    var val = checkAlphaNumeric($('#PolicyNumber'));
    if (val == false) { ValidateError++; }
    
});


function checkEngineChasis(input) {
    var pattern = new RegExp('[^\w\d]*(([0-9]+.*[A-Za-z]+.*)|[A-Za-z]+.*([0-9]+.*))');
    if (pattern.test(input.val()) == false) {
        //$('span').remove();
        $(input).addClass('Error');
        //  $(input).after('<span id="spanEngineChasis" class="ErrorText">Enter AlphaNumeric Only</span>');
        return false;
    }
    else {
        $(input).removeClass('Error');
        // $('spanEngineChasis').remove();
        return true;
    }
}

function ValidateVAD(Company) {
    ValidateError = 0;

    if ($('#AutomobileAssociationNumber').is(':visible') == true) {
        if ($('#AutomobileAssociationNumber').val() == "") {
            $('#AutomobileAssociationNumber').addClass('Error');
            ValidateError++;
        }
        else {
            $('#AutomobileAssociationNumber').removeClass('Error');
        }
    }

    if ($('#AutomobileAssociationName').is(':visible') == true) {
        if ($('#AutomobileAssociationName').val() == "") {
            $('#AutomobileAssociationName').addClass('Error');
            ValidateError++;
        }
        else { $('#AutomobileAssociationName').removeClass('Error'); }
    }


    if ($('#AutomobileMembershipExpiryDate').is(':visible') == true) {
        if ($('#AutomobileMembershipExpiryDate').val() == "") {
            $('#AutomobileMembershipExpiryDate').addClass('Error');
            ValidateError++;
        }
        else { $('#AutomobileMembershipExpiryDate').removeClass('Error'); }
    }

    //Is Financed Fields
    if (($('#IsFinancedyes').is(':visible') == true) || ($('#IsFinancedno').is(':visible') == true)) {
        if ($('#IsFinancedyes').hasClass('active') || $('#IsFinancedno').hasClass('active')) {
            $('#IsFinancedyes').removeClass('Error');
            $('#IsFinancedno').removeClass('Error');
        }
        else {
            $('#IsFinancedyes').addClass('Error');
            $('#IsFinancedno').addClass('Error');
            ValidateError++;
        }
    }

    $EngineNumber = $('#EngineNumber');
    $ChasisNumber = $('#ChasisNumber');

    if (Company != 'Reliance') {
        if ($EngineNumber.val() == "") {
            $('#dvEngineNumber').addClass('Error'); //Added New Validation
            ValidateError++;
        }
        else {
            //added by binaka
            var _result = false;
            var _count = 12;
            var _EngineNumber = $("#EngineNumber").val();
            for (var i = 0; i < _EngineNumber.length; i++) {
                if (i + 5 < _EngineNumber.length) {
                    if (_EngineNumber.substring(i, i + 1) == _EngineNumber.substring(i + 5, i + 12)) {
                        var _char = _EngineNumber.substring(i, _EngineNumber.length - i);
                        //commented by shashikant for reference number 39203 UAT
                        var _rex = new RegExp("^" + _char.substring(0, 1) + "{" + _count + "}");
                        //var _rex = new RegExp('^[a-zA-Z0-9]+$');
                        _result = _char.match(_rex);
                        if (_result) {
                            break;
                        }
                    }
                }
            }
            if (_result) {
                $('#dvEngineNumber').addClass('Error'); //Added New Validation
                ValidateError++;
                return false;
            }
            else {
                $('#dvEngineNumber').removeClass('Error'); //Added New Validation
            }
            //.............
            var val = checkAlphaNumericWithoutSpace($EngineNumber);
            if (val == false) { ValidateError++; }
            else
            {
                id = "spnEngineNumber";
                if ($EngineNumber.val().length < 7 || $EngineNumber.val().length > 20) {
                    $('#dvEngineNumber').addClass('Error'); //Added New Validation
                    ValidateError++;
                }
                else {
                    $('#dvEngineNumber').removeClass('Error'); //Added New Validation
                }
            }
        }
        if ($ChasisNumber.val() == "") {
            $('#dvChasisNumber').addClass('Error'); //Added New Validation
            ValidateError++;
        }
        else {
            var val = checkAlphaNumericWithoutSpace($ChasisNumber);
            if (val == false) { ValidateError++; }
            else
            {
                id = "spnChasisNumber";
                if ($ChasisNumber.val().length < 7 || $ChasisNumber.val().length > 20) {
                    $('#dvChasisNumber').addClass('Error'); //Added New Validation
                    ValidateError++;
                }
                else {
                    $('#dvChasisNumber').removeClass('Error'); //Added New Validation
                }
            }
        }
    }
    if (Company == 'Reliance') {
        if ($EngineNumber.val() == "") {
            $('#dvEngineNumber').addClass('Error'); //Added New Validation
            ValidateError++;
        }
        else {
            var val1 = checkAlphaNumericWithoutSpace($EngineNumber);
            if (val1 == false) {
                $('#spnEngineNumber').remove();
                //($EngineNumber).after('<span id="spnEngineNumber" class="ErrorText">Please Enter Engine Number between 7 and 20.</span>');//Commented Old Validation
                //$EngineNumber.addClass('Error'); //Commented Old Validation
               // $('#dvEngineNumber').after('<span id="spnEngineNumber" class="ErrorText">Please Enter Engine Number between 7 and 20.</span>'); //Added New Validation
                $('#dvEngineNumber').addClass('Error'); //Added New Validation
                ValidateError++;
            }
            else {
                var val = checkEngineChasis($EngineNumber);
                if (val == false) { ValidateError++; }
                else
                {
                    if ($EngineNumber.val().length < 7 || $EngineNumber.val().length > 20) {
                        $('#spnEngineNumber').remove();
                        //($EngineNumber).after('<span id="spnEngineNumber" class="ErrorText">Please Enter Engine Number between 7 and 20.</span>'); //Commented Old Validation
                        //$EngineNumber.addClass('Error'); //Commented Old Validation
                        //$('#dvEngineNumber').after('<span id="spnEngineNumber" class="ErrorText">Please Enter Engine Number between 7 and 20.</span>'); //Added New Validation
                        $('#dvEngineNumber').addClass('Error'); //Added New Validation
                        ValidateError++;
                    }
                    else { $EngineNumber.removeClass('Error'); }
                }
            }
        }
        if ($('#ChasisNumber').val() == "") {
            $('#dvChasisNumber').addClass('Error');
            ValidateError++;
        } else {
            var val1 = checkAlphaNumericWithoutSpace($ChasisNumber);
            if (val1 == false) {
                $('#spnChasisNumber').remove();
                //($ChasisNumber).after('<span id="spnChasisNumber" class="ErrorText">Please Enter Chasis Number between 7 and 20.</span>'); //Commented Old Validation
                //$ChasisNumber.addClass('Error'); //Commented Old Validation
               // $('#dvChasisNumber').after('<span id="spnChasisNumber" class="ErrorText">Please Enter Chasis Number between 7 and 20.</span>'); //Added New Validation
                $('#dvChasisNumber').addClass('Error'); //Added New Validation
                ValidateError++;
            }
            else {
                var val = checkEngineChasis($ChasisNumber);
                if (val == false) { ValidateError++; }
                else
                {
                    if ($ChasisNumber.val().length < 7 || $ChasisNumber.val().length > 20) {
                        $('#spnChasisNumber').remove();
                        //($ChasisNumber).after('<span id="spnChasisNumber" class="ErrorText">Please Enter Chasis Number between 7 and 20.</span>'); //Commented Old Validation
                        //$ChasisNumber.addClass('Error'); //Commented Old Validation
                       // $('#dvChasisNumber').after('<span id="spnChasisNumber" class="ErrorText">Please Enter Chasis Number between 7 and 20.</span>');//Added New Validation
                        $('#dvChasisNumber').addClass('Error'); //Added New Validation
                        ValidateError++;
                    }
                    else { $('#dvChasisNumber').removeClass('Error'); }
                }
            }
        }
    }

    if (Company == 'LT' || Company == '2' || Company == 'Bharti') {
        if ($('#VehicleColor').val() == "" || $('#VehicleColor').val().length == 0) {
            $('#dvVehicleColor').addClass('Error'); //Added New Validation
            ValidateError++;
        }
        else {
            var val = checkText($('#VehicleColor'));
            if (val == false) { ValidateError++; }
            else {
                $('#dvVehicleColor').removeClass('Error'); //Added New Validation
            }
        }
    }

    //if (Comapny == 'Bharti') {
    //    if ($('#divinstitution').is(':visible') == true) {
    //        if ($('#InstitutionName').val() == "") {
    //            $('#dvInstitutionName').addClass('Error');
    //            ValidateError++;
    //        }
    //        else {
    //            var val = checkText($('#InstitutionName'));
    //            if (val == false) { ValidateError++; }
    //            else { $('#dvInstitutionName').removeClass('Error'); }
    //        }

    //        //if ($('#InstitutionCity').val() == "") {
    //        //    $('#dvInstitutionCity').addClass('Error');
    //        //    ValidateError++;
    //        //}
    //        //else {
    //        //    var val = checkText($('#InstitutionCity'));
    //        //    if (val == false) { ValidateError++; }
    //        //    else { $('#dvInstitutionCity').removeClass('Error'); }
    //        //}
    //    }
    //}
    if (Company != 'Libarty') {
        if ($('#InstitutionName').is(':visible') == true) {
            var valInstName = checkText($('#InstitutionName'));
            if ($('#InstitutionName').val() == "" || valInstName == false) { $('#dvInstitutionName').addClass('Error'); ValidateError++; }
            else { $('#dvInstitutionName').removeClass('Error'); }
        }
    }
    else {
        if ($('#InstitutionName').is(':visible') == true) {
            if ($('#InstitutionName').val() == "") { $('#dvInstitutionName').addClass('Error'); ValidateError++; }
            else { $('#dvInstitutionName').removeClass('Error'); }
        }
    }

    if ($('#InstitutionCity').is(':visible') == true) {
        var valInstCity = checkText($('#InstitutionCity'));
        if ($('#InstitutionCity').val() == "" || valInstCity == false) { $('#dvInstitutionCity').addClass('Error'); ValidateError++; }
        else { $('#dvInstitutionCity').removeClass('Error'); }
    }

    //Lv_FinancierCode
    if ($('#Lv_FinancierCode').is(':visible') == true) {
        if ($('#Lv_FinancierCode').val() == "" || $('#Lv_FinancierCode').val() == null) { $('#Lv_FinancierCode').addClass('Error'); ValidateError++; }
        else { $('#Lv_FinancierCode').removeClass('Error'); }
    }

    //Lv_FinancierAddress
    if ($('#Lv_FinancierAddress').is(':visible') == true) {
        var valFinAdd = checkAddress($('#Lv_FinancierAddress'));
        if ($('#Lv_FinancierAddress').val() == "" || valFinAdd == false) { $('#Lv_FinancierAddress').addClass('Error'); ValidateError++; }
        else { $('#Lv_FinancierAddress').removeClass('Error'); }
    }
    //Lv_FinancierPincode
    if ($('#Lv_FinancierPincode').is(':visible') == true) {
        var valPincode = checkPinCode($('#Lv_FinancierPincode'));
        if ($('#Lv_FinancierPincode').val() == "" || valPincode == false) { $('#Lv_FinancierPincode').addClass('Error'); ValidateError++; }
        else { $('#Lv_FinancierPincode').removeClass('Error'); }
    }

    //Lv_FinancerAgreementType
    if ($('#Lv_FinancerAgreementType').is(':visible')) {
        var valAgrType = checkAlphaNumeric($('#Lv_FinancerAgreementType'));
        if ($('#Lv_FinancerAgreementType').val() == 0 || $('#Lv_FinancerAgreementType').val() == "" || valAgrType == false) { $('#Lv_FinancerAgreementType').addClass('Error'); ValidateError++; }
        else { $('#Lv_FinancerAgreementType').removeClass('Error'); }
    }

    //ddlInstitutionCity
    if ($('#ddlInstitutionCity').is(':visible') == true) {
        if ($('#ddlInstitutionCity').val() == 0) {
            $('#ddlInstitutionCity').addClass('Error');
            ValidateError++;
        } else { $('#ddlInstitutionCity').removeClass('Error'); }
    }
    if ($('#LT_MORTGAGE_ID').is(':visible') == true) {
        if ($('#LT_MORTGAGE_ID').val() == 0) { $('#LT_MORTGAGE_ID').addClass('Error'); ValidateError++; }
        else { $('#LT_MORTGAGE_ID').removeClass('Error'); }
    }

    //if ($('.divMortgage').is(':hidden') == false) {
    //alert($('#LT_Financier_ID').val());
    if ($('#LT_Financier_ID').is(':visible')) {
        if ($('#LT_Financier_ID').val() == null) { $('#LT_Financier_ID').val(0); }
        else if ($('#LT_Financier_ID').val() == 0) { $('#LT_Financier_ID').addClass('Error'); ValidateError++; }
        else { $('#LT_Financier_ID').removeClass('Error'); }
    }

    if ($('#MortgageAmount').is(':visible')) {
        var valAmount = checkNumeric($('#MortgageAmount'));
        if ($('#MortgageAmount').val() == "" || $('#MortgageAmount').val() == "0" || valAmount == false) { $('#MortgageAmount').addClass('Error'); ValidateError++; }
        else { $('#MortgageAmount').removeClass('Error'); }
    }

    if ($('#MortgageStartDate').is(':visible')) {
        if ($('#MortgageStartDate').val() == "") { $('#MortgageStartDate').addClass('Error'); ValidateError++; }
        else { $('#MortgageStartDate').removeClass('Error'); }
    }

    if ($('#MortgageExpirationDate').is(':visible')) {
        if ($('#MortgageExpirationDate').val() == "") { $('#MortgageExpirationDate').addClass('Error'); ValidateError++; }
        else { $('#MortgageExpirationDate').removeClass('Error'); }
    }

    if ($('#MortgageRefNumber').is(':visible')) {
        if ($('#MortgageRefNumber').val() == "") {
            $('#MortgageRefNumber').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkAlphaNumeric($('#MortgageRefNumber'));
            if (val == false) { ValidateError++; }
            else { $('#MortgageRefNumber').removeClass('Error'); }
        }
    }
    //}
    if (Company == 'Reliance') {
        if ($('#PolicyNumber').is(':visible') == true) {

            if ($('#PolicyNumber').val() == "") { $('#dvPolicyNumber').addClass('Error'); ValidateError++; }
                else if ($('#PolicyNumber').val().length < 8) {                  
                    $('#dvPolicyNumber').addClass('Error');
                    ValidateError++;
                }
                else if (checkAlphaNumericWithoutSpace($('#PolicyNumber')) == false) {                  
                    $('#dvPolicyNumber').addClass('Error');
                    ValidateError++;
                }
            else { $('#spnPolicyNumber').remove(); $('#dvPolicyNumber').removeClass('Error'); }

        }
    }
    else if (Company == 'Oriental') {
        if ($('#PolicyNumber').is(':visible') == true) {
            if ($('#PolicyNumber').val() == "") { $('#dvPolicyNumber').addClass('Error'); ValidateError++; }
                //else if ($('#PolicyNumber').val().length < 8) {
                //    $('#spnPolicyNumber').remove();
                //    $('#PolicyNumber').addClass('Error');
                //    $('#PolicyNumber').after('<span ID="spnPolicyNumber" class="ErrorText">Policy Number must be more than 8 char.</span>');
                //    ValidateError++;
                //}
                //else if (checkPolicyNumber($('#PolicyNumber')) == false) {
                //    $('#spnPolicyNumber').remove();
                //    $('#PolicyNumber').addClass('Error');
                //    $('#PolicyNumber').after('<span ID="spnPolicyNumber" class="ErrorText">Enter Valid Policy Number </span>');
                //    ValidateError++;

                //}
            else { $('#spnPolicyNumber').remove(); $('#dvPolicyNumber').removeClass('Error'); }
        }
    }
    else if (Company == 'Libarty') {
        if ($('#PolicyNumber').is(':visible')) {
            var valPolicynumber = checkPolicyNumber($('#PolicyNumber'));
            if ($('#PolicyNumber').val() == "" || valPolicynumber == false) { $('#dvPolicyNumber').addClass('Error'); ValidateError++; }
            else { $('#dvPolicyNumber').removeClass('Error'); }
        }
    }
    else {
        if ($('#PolicyNumber').is(':visible') == true) {
            if ($('#PolicyNumber').val() == "") { $('#dvPolicyNumber').addClass('Error'); ValidateError++; }
                //else if ($('#PolicyNumber').val().length < 8) {
                //    $('#spnPolicyNumber').remove();
                //    $('#PolicyNumber').addClass('Error');
                //    $('#PolicyNumber').after('<span ID="spnPolicyNumber" class="ErrorText">Policy Number must be more than 8 char.</span>');
                //    ValidateError++;
                //}
                //else if (checkAlphaNumericWithoutSpace($('#PolicyNumber')) == false) {
                //    $('#spnPolicyNumber').remove();
                //    $('#PolicyNumber').addClass('Error');
                //    $('#PolicyNumber').after('<span ID="spnPolicyNumber" class="ErrorText">Space Not Allowed</span>');
                //    ValidateError++;

                //}
            else { $('#spnPolicyNumber').remove(); $('#dvPolicyNumber').removeClass('Error'); }
        }
    }    
    if ($('#LT_PrevCoverTypeIdRef').is(':visible') == true) {
        if ($('#LT_PrevCoverTypeIdRef').val() == 0) { $('#LT_PrevCoverTypeIdRef').addClass('Error'); ValidateError++; }
        else { $('#LT_PrevCoverTypeIdRef').removeClass('Error'); }
    }

    if ($('#RegistrationNumberPart1A').is(':visible') == true) {
        if ($('#RegistrationNumberPart1A').val() == "") { $('#dvRegistrationNumberPart1A').addClass('Error'); ValidateError++; }
        else { $('#dvRegistrationNumberPart1A').removeClass('Error'); }
    }

    if ($('#RegistrationNumberPart2').is(':visible') == true) {
        var valRegNum2 = checkTextWithoutSpace($('#RegistrationNumberPart2'));
        if ($('#RegistrationNumberPart2').val() == "" || valRegNum2 == false) { $('#dvRegistrationNumberPart2').addClass('Error'); ValidateError++; }
        else { $('#dvRegistrationNumberPart2').removeClass('Error'); }
    }

    if ($('#RegistrationNumberPart3').is(':visible') == true) {
        var valRegNum3 = checkNumeric($('#RegistrationNumberPart3'));
        if ($('#RegistrationNumberPart3').val() == "" || valRegNum3 == false) { $('#dvRegistrationNumberPart3').addClass('Error'); ValidateError++; }
        else { $('#dvRegistrationNumberPart3').removeClass('Error'); }
    }

    if ($('#LT_InsurerAddress').is(':visible') == true) {
        var valAdd = checkAddress($('#LT_InsurerAddress'));
        if ($('#LT_InsurerAddress').val() == "" || valAdd == false) { $('#LT_InsurerAddress').addClass('Error'); ValidateError++; }
        else { $('#LT_InsurerAddress').removeClass('Error'); }
    }
    //ValidateError = 0; //EEEEEE
    if (ValidateError < 1) {
        // eventsubmmision(1, 'next', ' enter vehicle additional details', 'car-contact-details step 2 event', types);        
        $('#iconVAD').removeClass('glyphs');
        return true;
    }
    else { return false; }
}

function ValidateVRD(company) {
    debugger;
    ValidateError = 0;
    if (company == 'HDFCErgo') {
        if ($('#PermanentCityName').val() == "") { $('#dvPermanentCityName').addClass('Error'); ValidateError++; }
        else { $('#dvPermanentCityName').removeClass('Error'); }

        if ($('#RegisteredAddress').val() == "") { $('#dvRegisteredAddress').addClass('Error'); ValidateError++; }
        else { $('#dvRegisteredAddress').removeClass('Error'); }

        if ($('#RegisteredAddress2').val() == "") { $('#dvRegisteredAddress2').addClass('Error'); ValidateError++; }
        else { $('#dvRegisteredAddress2').removeClass('Error'); }

        if ($('#RegisteredAddress3').val() == "") { $('#dvRegisteredAddress3').addClass('Error'); ValidateError++; }
        else { $('#dvRegisteredAddress3').removeClass('Error'); }

        if ($('#RegisteredPinCode').val() == "") { $('#dvRegisteredPinCode').addClass('Error'); ValidateError++; }
        else { $('#dvRegisteredPinCode').removeClass('Error'); }

        if ($('#RegisteredStateName').val() == "") {
            $('#dvRegisteredStateName').addClass('Error');
            ValidateError++;
        } else { $('#dvRegisteredStateName').removeClass('Error'); }

    }
    else {

        if ($('#PermanentCityName').val() == "") { $('#dvPermanentCityName').addClass('Error'); ValidateError++; }
        else { $('#dvPermanentCityName').removeClass('Error'); }

        if ($('#RegisteredAddress').val() == "") { $('#dvRegisteredAddress').addClass('Error'); ValidateError++; }
        else { $('#dvRegisteredAddress').removeClass('Error'); }

        if ($('#RegisteredAddress2').val() == "") { $('#dvRegisteredAddress2').addClass('Error'); ValidateError++; }
        else { $('#dvRegisteredAddress2').removeClass('Error'); }

        if ($('#RegisteredAddress3').val() == "") { $('#dvRegisteredAddress3').addClass('Error'); ValidateError++; }
        else { $('#dvRegisteredAddress3').removeClass('Error'); }

        if ($('#RegisteredPinCode').val() == "") { $('#dvRegisteredPinCode').addClass('Error'); ValidateError++; }
        else { $('#dvRegisteredPinCode').removeClass('Error'); }

        if ($('#RegisteredStateName').val() == "") {
            $('#dvRegisteredStateName').addClass('Error');
            ValidateError++;
        } else { $('#dvRegisteredStateName').removeClass('Error'); }

        if ($('#PermanentCityID').val() == "" || $('#PermanentCityID').val() == "0") {
            if ($('#PermanentCityName').is(':visible') == true) { $('#dvPermanentCityName').addClass('Error'); ValidateError++; }
        } else { $('#dvPermanentCityName').removeClass('Error'); }

        if ($('#ddlRegisteredCityID').val() == "" | $('#ddlRegisteredCityID').val() == "0" || $('#ddlRegisteredCityID').val() == null) {
            $('#ddlRegisteredCityID').addClass('Error');
            ValidateError++;
        } else { $('#ddlRegisteredCityID').removeClass('Error'); }

        if ($('#RegistereDistrictName').val() == "") {
            $('#dvRegistereDistrictName').addClass('Error');
            ValidateError++;
        } else { $('#dvRegistereDistrictName').removeClass('Error'); }
    }

    
       
    if (ValidateError < 1) {
        //eventsubmmision(1, 'next', ' enter vehicle registration details', 'car-contact-details step 3 event', types);
        $('#iconVRD').removeClass('glyphs');
        return true;
    }
    else { return false; }
}

function ValidatePIA() {
    ValidateError = 0;
    if ($('#PreviousInsurerCityID').val() == "" || $('#PreviousInsurerCityID').val() == "0") { $('#dvPreviousInsurerCityName').addClass('Error'); ValidateError++; }
    else { $('#dvPreviousInsurerCityName').removeClass('Error'); }
    //if ($('#PreviousInsurerCityName').val() == "") {
    //    $('#PreviousInsurerCityName').addClass('Error');
    //    ValidateError++;
    //}
    //else { $('#PreviousInsurerCityName').removeClass('Error'); }

    if ($('#PreviousInsurerAddress').val() == "") { $('#dvPreviousInsurerAddress').addClass('Error'); ValidateError++; }
    else { $('#dvPreviousInsurerAddress').removeClass('Error'); }

    if ($('#PreviousInsurerAddress2').val() == "") { $('#dvPreviousInsurerAddress2').addClass('Error'); ValidateError++; }
    else { $('#dvPreviousInsurerAddress2').removeClass('Error'); }

    if ($('#PreviousInsurerAddress3').val() == "") { $('#dvPreviousInsurerAddress3').addClass('Error'); ValidateError++; }
    else { $('#dvPreviousInsurerAddress3').removeClass('Error'); }

    if ($('#PreviousInsurerPinCode').val() == "") { $('#dvPreviousInsurerPinCode').addClass('Error'); ValidateError++; }
    else { $('#dvPreviousInsurerPinCode').removeClass('Error'); }

    if (ValidateError < 1) { return true;  $('#iconPIA').removeClass('glyphs'); }
    else { return false; }
}

function ValidateND(company) {
    ValidateError = 0;

    if ($('#NomineeRelationID').is(':visible') == true) {
    if ($('#NomineeRelationID').val() == 0) { $('#NomineeRelationID').addClass('Error'); ValidateError++; }
    else { $('#NomineeRelationID').removeClass('Error'); }
    }
    if ($('#NomineeName').is(':visible') == true) {
        if ($('#NomineeName').val() == "") { $('#dvNomineeName').addClass('Error'); ValidateError++; }
        else {
            var val = checkText($('#NomineeName'));
            if (val == false) { ValidateError++; }
            else { $('#dvNomineeName').removeClass('Error'); }
        }
    }
    else if ($('#NomineeRelationID').val() == "1") { $('#NomineeName').val($('#ContactName').val()); }

    if ($('#NomineeDOB').val() == "") { $('#dvNomineeDOB').addClass('Error'); ValidateError++; }
    else { $('#dvNomineeDOB').removeClass('Error'); }

    if ($('#MNomineeName').is(':visible') == true) {
        if ($('#MNomineeName').val() == "") {
            $('#dvMNomineeName').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkText($('#MNomineeName'));
            if (val == false) { ValidateError++; }
            else { $('#dvMNomineeName').removeClass('Error'); }
        }
    }

    if ($('#LNomineeName').is(':visible') == true) {
        if ($('#LNomineeName').val() == "") {
            $('#dvLNomineeName').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkText($('#LNomineeName'));
            if (val == false) { ValidateError++; }
            else { $('#dvLNomineeName').removeClass('Error'); }
        }
    }

    if ($('#RFirstName').is(':visible') == true) {
        if ($('#RFirstName').val() == "") {
            $('#RFirstName').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkText($('#RFirstName'));
            if (val == false) { ValidateError++; }
            else { $('#RFirstName').removeClass('Error'); }
        }
    }
    if ($('#RLastName').is(':visible') == true) {
        if ($('#RLastName').val() == "") {
            $('#RLastName').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkText($('#RLastName'));
            if (val == false) { ValidateError++; }
            else { $('#RLastName').removeClass('Error'); }
        }
    }
    if ($('#NomineeAppointeeRelID').is(':visible') == true) {
        if ($('#NomineeAppointeeRelID').val() == 0) {
            $('#NomineeAppointeeRelID').addClass('Error');
            ValidateError++;
        }
        else {
            $('#NomineeAppointeeRelID').removeClass('Error');
        }
    }

    if ($('#otherNomineeRelation').is(':visible') == true) {
        if ($('#otherNomineeRelation').val() == "") {
            $('#dvotherNomineeRelation').addClass('Error');
            ValidateError++;
        }
        else {
            $('#dvotherNomineeRelation').removeClass('Error');
        }
    }
    if (company == 'Reliance') {
        
        if ($('#NomineeRelation').val() == "0") { $('#NomineeRelation').addClass('Error'); ValidateError++; }
        else { $('#dvNomineeRelation').removeClass('Error'); }
    }
    if (ValidateError < 1) {
        if (company == 'Oriental') {
            //eventsubmmision(1, 'next', ' enter nominee details', 'car-contact-details step 4 event', types);
        }
        if (company == 'Reliance') {
            //eventsubmmision(1, 'next', ' enter nominee details', 'car-contact-details step 7 event', types);
        }
        if (company == 'Libarty') {
            //eventsubmmision(1, 'next', ' enter nominee details', 'car-contact-details step 8 event', types);
        }
        //eventsubmmision(1, 'next', ' enter nominee details', 'car-contact-details step 3 event', types);
        $('#iconND').removeClass('glyphs');
        $("#FinalSubmit").val("1");
        return true;
    }
    else {
        return false;
    }
}

$('input[name=PaymentOption]').click(function () {
    $("#HiddenPaymentOption").val($(this).val());
    HideShowChequeDetails($(this).val());
});

if ($('input[name=PaymentOption]').is(':checked') == true) {
    HideShowChequeDetails($("#HiddenPaymentOption").val());
}

HideShowChequeDetails($("#HiddenPaymentOption").val());

SetRadioButton($("input[name=PaymentOption]"), $("#HiddenPaymentOption").val());

function SetRadioButton(current_element, match_value) {
    for (var i = 0; i < current_element.length; i++) {
        if (current_element[i].value == match_value) {
            current_element[i].checked = true;
        }
    }
}

function HideShowChequeDetails(_value) {
    if (_value == "DD") {
        $("#trChequeDetails").show('slow', function () { });
    } else {
        $("#trChequeDetails").hide('slow', function () { });
    }
}

function ValidatePayment() {
    ValidateError = 0;
    var hdnOnlinePay = document.getElementById('hdnOnlinePayment');
    var hdnSupportAgntID = document.getElementById('SupportsAgentID');

    if (hdnOnlinePay != null && hdnSupportAgntID != null) {

        if (hdnOnlinePay.val() == IsFinancedyes && hdnSupportAgntID.val() > 0) {
            if (!$("input[name='PaymentOption']:radio").prop("checked"))
                ValidateError++;
        }
    }
    else {

        if (hdnOnlinePay != null) {
            if (hdnOnlinePay.value == 1) {
                if (!$("input[name='PaymentOption']:radio").prop("checked"))
                    ValidateError++;
            }
        }

        if (hdnSupportAgntID != null) {
            if (hdnSupportAgntID.value > 0) {
                if (!$("input[name='PaymentOption']:radio").prop("checked"))
                    ValidateError++;
            }
        }
    }

    if ($('#trChequeDetails').is(':visible') == true) {

        if ($('#ChequeNumber').val() == "") {
            $('#ChequeNumber').addClass('Error');
            ValidateError++;
        }
        else {
            $('#ChequeNumber').removeClass('Error');
        }


        if ($('#ChequeNumber').val().length != 6 || checkNumeric($('#ChequeNumber')) == false) {
            $('#ChequeNumber').addClass('Error');
            ValidateError++;
        }
        else {
            $('#ChequeNumber').removeClass('Error');
        }

        if ($('#BankName').val() == "" || $('#BankCode').val() == "") {
            $('#BankName').addClass('Error');
            ValidateError++;
        }
        else {
            $('#BankName').removeClass('Error');
        }

        if ($('#BankBranch').val() == "") {
            $('#BankBranch').addClass('Error');
            ValidateError++;
        }
        else {
            $('#BankBranch').removeClass('Error');
        }




        if ($("#OrientalBankID").is(':visible') == true) {
            if ($("#OrientalBankID").val() == 0) {
                $('#OrientalBankID').addClass('Error');
                ValidateError++;
            }
            else {
                $('#OrientalBankID').removeClass('Error');
            }
        }
        if ($("#ChequeDate").val() == "") {
            $('#ChequeDate').addClass('Error');
            ValidateError++;
        }
        else {
            $('#ChequeDate').removeClass('Error');
        }

        if ($("input[name='PaymentOption'][value=\"DD\"]").prop("checked")) {
            $("input[name='PaymentOption'][value=\"DD\"]").removeClass('Error');
        }
        else {
            $("input[name='PaymentOption'][value=\"DD\"]").addClass('Error');
            ValidateError++;
        }
    }

    if (ValidateError > 0) {
        if (company == 'Oriental') {
            //eventsubmmision(1, 'next', ' enter nominee details', 'car-contact-details step 4 event', types);
        }
        if (company == 'Reliance') {
            //eventsubmmision(1, 'next', ' enter nominee details', 'car-contact-details step 7 event', types);
        }
        if (company == 'Libarty') {
            //eventsubmmision(1, 'next', ' enter nominee details', 'car-contact-details step 8 event', types);
        }
        //eventsubmmision(1, 'next', ' enter nominee details', 'car-contact-details step 3 event', types);
        return false;
    }
    else {
        return true;
    }
}

function AddRow1() {

    $numeric1 = $('.numeric1');
    $numeric2 = $('.numeric2');
    $numeric3 = $('.numeric3');
    $numeric4 = $('.numeric4');
    $numeric5 = $('.numeric5');
    $numeric6 = $('.numeric6');

    ValidateError = 0;

    if ($numeric1.val() == "") {
        $numeric1.addClass('errorClass1');
        ValidateError++;
    }
    else {
        $numeric1.removeClass('errorClass1');
    }
    if ($('select[name="DateofPurchaseofCar"]').val() == "0") {
        //$numeric2.addClass('errorClass1');
        $('select[name="DateofPurchaseofCar"]').addClass('errorClass1');
        ValidateError++;
    }
    else {
        $('select[name="DateofPurchaseofCar"]').removeClass('errorClass1');
    }
    if ($numeric3.val() == "") {
        $numeric3.addClass('errorClass1');
        ValidateError++;
    }
    else {
        $numeric3.removeClass('errorClass1');
    }
    if ($numeric4.val() == "") {
        $numeric4.addClass('errorClass1');
        ValidateError++;
    }
    else {
        $numeric4.removeClass('errorClass1');
    }
    if ($numeric5.val() == "") {
        $numeric5.addClass('errorClass1');
        ValidateError++;
    }
    else {
        $numeric5.removeClass('errorClass1');
    }
    if ($numeric6.val() == "") {
        $numeric6.addClass('errorClass1');
        ValidateError++;
    }
    else {
        $numeric6.removeClass('errorClass1');
    }
    if (ValidateError < 1) {
        if (company == 'Libarty') {
            //eventsubmmision(1, 'next', ' enter electrical accessories', 'car-contact-details step 5 event', types);
        }
        //eventsubmmision(1, 'next', ' enter electrical accessories', 'car-contact-details step 4 event', types);
        return true;
    }
    else {
        return false;
    }

}

function NeAddRow1() {

    $numeric11 = $('.numeric11');
    $numeric22 = $('.numeric22');
    $numeric33 = $('.numeric33');
    $numeric44 = $('.numeric44');
    $numeric55 = $('.numeric55');
    $numeric66 = $('.numeric66');

    ValidateError = 0;

    if ($numeric11.val() == "") {
        $numeric11.addClass('errorClass1');
        ValidateError++;

    }
    else {
        $numeric11.removeClass('errorClass1');
    }

    if ($('select[name="NeAccessory_YOM"]').val() == "0") {
        //$numeric2.addClass('errorClass1');
        $('select[name="NeAccessory_YOM"]').addClass('errorClass1');
        ValidateError++;
    }
    else {
        $('select[name="NeAccessory_YOM"]').removeClass('errorClass1');
    }

    if ($numeric22.val() == "") {
        $numeric22.addClass('errorClass1');
        ValidateError++;

    }
    else {
        $numeric22.removeClass('errorClass1');
    }
    if ($numeric33.val() == "") {
        $numeric33.addClass('errorClass1');
        ValidateError++;

    }
    else {
        $numeric33.removeClass('errorClass1');
    }
    if ($numeric44.val() == "") {
        $numeric44.addClass('errorClass1');
        ValidateError++;

    }
    else {
        $numeric44.removeClass('errorClass1');
    }
    if ($numeric55.val() == "") {
        $numeric55.addClass('errorClass1');
        ValidateError++;

    }
    else {
        $numeric55.removeClass('errorClass1');
    }
    if ($numeric66.val() == "") {
        $numeric66.addClass('errorClass1');
        ValidateError++;

    }
    else {
        $numeric66.removeClass('errorClass1');
    }
    if (ValidateError < 1) {
        if (company == 'Libarty') {
            // eventsubmmision(1, 'next', ' enter non-electrical accessories', 'car-contact-details step 6 event', types);
        }
        // eventsubmmision(1, 'next', ' enter non-electrical accessories', 'car-contact-details step 5 event', types);
        return true;
    }
    else {
        return false;
    }

}

function CNGAddRow() {
    $numeric11 = $('.numeric21');
    $numeric22 = $('.numeric24');
    $numeric33 = $('.numeric25');
    $numeric44 = $('.numeric26');
    $numeric55 = $('.numeric23');

    ValidateError = 0;

    if ($('select[name="bifAccessory_YOM"]').val() == "0") {
        //$numeric2.addClass('errorClass1');
        $('select[name="bifAccessory_YOM"]').addClass('errorClass1');
        ValidateError++;
    }
    else {
        $('select[name="bifAccessory_YOM"]').removeClass('errorClass1');
    }

    if ($numeric11.val() == "") {
        $numeric11.addClass('errorClass1');
        ValidateError++;

    }
    else {
        $numeric11.removeClass('errorClass1');
    }

    if ($('select[name="NeAccessory_YOM"]').val() == "0") {
        //$numeric2.addClass('errorClass1');
        $('select[name="NeAccessory_YOM"]').addClass('errorClass1');
        ValidateError++;
    }
    else {
        $('select[name="NeAccessory_YOM"]').removeClass('errorClass1');
    }

    if ($numeric22.val() == "") {
        $numeric22.addClass('errorClass1');
        ValidateError++;

    }
    else {
        $numeric22.removeClass('errorClass1');
    }
    if ($numeric33.val() == "") {
        $numeric33.addClass('errorClass1');
        ValidateError++;

    }
    else {
        $numeric33.removeClass('errorClass1');
    }
    if ($numeric44.val() == "") {
        $numeric44.addClass('errorClass1');
        ValidateError++;

    }
    else {
        $numeric44.removeClass('errorClass1');
    }
    if ($numeric55.val() == "") {
        $numeric55.addClass('errorClass1');
        ValidateError++;

    }
    else {
        $numeric55.removeClass('errorClass1');
    }
    if ($numeric66.val() == "") {
        $numeric66.addClass('errorClass1');
        ValidateError++;

    }
    else {
        $numeric66.removeClass('errorClass1');
    }
    if (ValidateError < 1) {
        //eventsubmmision(1, 'next', ' enter bi-fuel accessories', 'car-contact-details step 7 event', types);
        return true;
    }
    else {
        return false;
    }

}

function checkPinCode(input) {
    var pattern = new RegExp('^([1-9]{1}[0-9]{5})$');
    var id = "spn" + input[0].id;
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) {
        $('#' + id + '').remove();
        $('#' + dvid).addClass('Error');
        //$('#' + dvid).after('<span id=' + id + ' class="ErrorText">Require Valid Postal Code.</span>');
        return false;
    }
    else {
        $('#' + dvid).removeClass('Error');
        $('#' + id + '').remove();
        return true;
    }
};
function checkMobile(input) {
    var pattern = new RegExp('^([7-9]{1}[0-9]{9})$');
    var id = "spn" + input[0].id;
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) {
        $('#' + id + '').remove();
        $('#' + dvid).addClass('Error');
        //$('#' + dvid).after('<span id=' + id + ' class="ErrorText">Require Valid Mobile No.</span>');
        return false;
    }
    else {
        $('#' + dvid).removeClass('Error');
        $('#' + id + '').remove();
        return true;
    }
};
function checkEmail(input) {
    var pattern = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$');
    var id = "spn" + input[0].id;
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) {
        $('#' + id + '').remove();
        $('#' + dvid).addClass('Error');
        //$('#' + dvid).after('<span id=' + id + ' class="ErrorText">Require Valid Email-Id.</span>');
        return false;
    }
    else {
        $('#' + dvid).removeClass('Error');
        $('#' + id + '').remove();
        return true;
    }
};
function checkText(input) {
    var pattern = new RegExp('^[a-zA-Z ]+$');
    var id = "spn" + input[0].id;
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) {
        $('#' + id + '').remove();
        $('#' + dvid).addClass('Error');
        //$('#' + dvid).after('<span id=' + id + ' class="ErrorText">Enter Text Only</span>');
        return false;
    }
    else {
        $('#' + dvid).removeClass('Error');
        $('#' + id + '').remove();
        return true;
    }
}
function checkTextWithoutSpace(input) {
    var pattern = new RegExp('^[a-zA-Z]+$');
    var id = "spn" + input[0].id;
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) {
        $('#' + id + '').remove();
        $('#' + dvid).addClass('Error');
        //$('#' + dvid).after('<span id=' + id + ' class="ErrorText">Enter Valid Text</span>');
        return false;
    }
    else {
        $('#' + dvid).removeClass('Error');
        $('#' + id + '').remove();
        return true;
    }
}
function checkNumeric(input) {
    var pattern = new RegExp('^[0-9]*$');
    var id = "spn" + input[0].id;
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) {
        $('#' + id + '').remove();
        $('#' + dvid).addClass('Error');
        //$('#' + dvid).after('<span id=' + id + ' class="ErrorText">Enter Number Only</span>');
        return false;
    }
    else {
        $('#' + dvid).removeClass('Error');
        $('#' + id + '').remove();
        return true;
    }
}
function checkAlphaNumericWithoutSpace(input) {
  
    var pattern = new RegExp('^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$');
    var id = "spn" + input[0].id;
    var divError = "#dv" + input[0].id;
    var dvid = "dv" + input[0].id;

    if (pattern.test(input.val()) == false) {
        $('#' + id + '').remove();

        //$(input).addClass('Error');
        //$(divError).after('<span id=' + id + ' class="ErrorText">Enter Alpha/Numeric Only</span>');
        $(divError).addClass('Error');
        return false;
    }
    else {
        $(divError).removeClass('Error');
        $('#' + id + '').remove();
        return true;
    }
}
function checkPolicyNumber(input) {
    var pattern = new RegExp('^[a-zA-Z0-9-/]+$');
    var id = "spn" + input[0].id;
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) {
        $('#' + id + '').remove();
        $('#' + dvid).addClass('Error1');
        //$('#' + dvid).after('<span id=' + id + ' class="ErrorText">Enter Valid Policy Number.</span>');
        return false;
    }
    else {
        $('#' + dvid).removeClass('Error1');
        $('#' + id + '').remove();
        return true;
    }
}
function checkAlphaNumeric(input) {
    var pattern = new RegExp('^[a-zA-Z0-9 ]+$');
    //var id = "spn" + input[0].id;
    var dvid = "#dv" + input[0].id;
    if (pattern.test(input.val()) == false) {
       // $('#' + id + '').remove();
        $(dvid).addClass('Error');
       // $(dvid).after('<span id=' + id + ' class="ErrorText">Enter AlphaNumeric Only</span>');
        return false;
    }
    else {
        $(dvid).removeClass('Error');
       // $('#' + id + '').remove();
        return true;
    }
}
function checkAddress(input) {
    var pattern = new RegExp('^[a-zA-Z0-9-,./ ]+$');
    //var id = "spn" + input[0].id;
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) {
       // $('#' + id + '').remove();
        $('#' + dvid).addClass('Error');
       // $('#' + dvid).after('<span id=' + id + ' class="ErrorText">Enter Valid Address</span>');
        return false;
    }
    else {
        $('#' + dvid).removeClass('Error');
       // $('#' + id + '').remove();
        return true;
    }
}
function checkCity1(input) {
    var pattern = new RegExp('^[a-zA-Z ,]+$');
    var id = "spn" + input[0].id;
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) {
        $('#' + id + '').remove();
        $('#' + dvid).addClass('Error1');
        //$('#' + dvid).after('<span id=' + id + ' class="ErrorText">Enter Valid City Name</span>');
        return false;
    }
    else {
        $('#' + dvid).removeClass('Error1');
        $('#' + id + '').remove();
        return true;
    }
}

//
function DynamicValidation(input, Message, RegexVal) {

    var pattern = new RegExp(RegexVal);
    var id = "spn" + input[0].id;
    if (input.val().length < 7) {
        $('#' + id + '').remove();
        $(input).addClass('Error');
       // $(input).after('<span id=' + id + ' class="ErrorText">' + Message + ' </span>');
        return false;
    }
    else if (pattern.test(input.val()) == false) {
        $('#' + id + '').remove();
        $(input).addClass('Error');
       // $(input).after('<span id=' + id + ' class="ErrorText">' + Message + ' </span>');
        return false;
    }
    else {
        $(input).removeClass('Error');
        $('#' + id + '').remove();
        return true;
    }
}

//$('#PolicyNumber').focusout(function () {
//    DynamicValidation($(this), 'Policy Number must be more than 7 char.')
//});

$('.PinCode').focusout(function () {
    checkPinCode($(this));
});
$('.Mobile').focusout(function () {
    checkMobile($(this));
});
$('.Email').focusout(function () {
    checkEmail($(this))
});
$('.Textonly').focusout(function () {
    checkText($(this))
});
$('.Numberonly').focusout(function () {
    checkNumeric($(this))
});
$('.AlphaNumeric').focusout(function () {
    //checkAlphaNumeric($(this))
});
$('.Address').focusout(function () {
    checkAddress($(this))
});
$('.OnlyText').focusout(function () {
    checkText($(this))
});
//$('.OnlyText').keydown(function (e) {
//    var key = e.keyCode;
//    if (!((key == 8) || (key == 9) || (key == 46) || (key >= 35 && key <= 40) || (key >= 65 && key <= 90))) { e.preventDefault(); }
//});
//$('.OnlyTextWithSpace').keydown(function (e) {
//    var key = e.keyCode;
//    if (!((key == 8) || (key == 9) || (key == 32) || (key == 46) || (key >= 35 && key <= 40) || (key >= 65 && key <= 90))) { e.preventDefault(); }
//});
//$('.PinCode').keypress(function (e) {
//    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) { return false; }
//});
//$('.OnlyNumber').keypress(function (e) {
//    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) { return false; }
//});
//$('.Mobile').keypress(function (e) {
//    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) { return false; }
//});
//$('.AlphaNumeric').keypress(function (e) {
//    if (e.which != 8 && e.which != 0 && (e.which < 65 || e.which > 90) && (e.which < 96 || e.which > 123) && (e.which < 48 || e.which > 57))
//    { return false; }
//});
//$('.Address').keydown(function (e) {
//    var key = e.keyCode;
//    if (!((key == 8) || (key == 9) || (key == 32) || (key >= 44 && key <= 57) || (key >= 65 && key <= 90) || (key == 92)
//        || (key >= 97 && key <= 122) || (key == 188) || (key == 189) || (key == 190) || (key == 191) || (key == 220))) {
//        e.preventDefault();
//    }
//});

if ($('#Lv_FinancierPincode').is(':visible') == true) {
    if ($('#Lv_FinancierPincode').val() == "") {
        $('#Lv_FinancierPincode').addClass('Error');
        ValidateError++;
    }
    else {
        var val = checkPinCode($('#Lv_FinancierPincode'));
        if (val == false) { ValidateError++; }
        else { $('#Lv_FinancierPincode').removeClass('Error'); }
    }
}


$(document).ready(function () {
    // alert($("#SameAsCommunication:checked").val());
    //Commented Old DatePicker
    /* $("#DOBofOwner").datepicker({
         changeMonth: true,
         changeYear: true,
         yearRange: 'c-82:c',
         dateFormat: 'dd-mm-yy',
         maxDate: '-18y'
     });*/
    if ($("#Lv_FinancierPincode").val() != "" && $("#Lv_FinancierPincode").is(':visible') == true) {
        if ($("#Lv_FinancierPincode").val().length > 5) {
            GetLibartyInstituteCity($("#Lv_FinancierPincode").val());
            $("#ddlInstitutionCity").val("@Model.InstitutionCity");
        }
    }
    //Commented Old DatePicker
    /*$("#ChequeDate").datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate() - 15),
        maxDate: '+15d'
    });*/


    //Commented By Pratik 9-2-17
    //$('#divfinanced').click(function () {
    //    $('#IsFinancedyes').removeClass('Error');
    //    $('#IsFinancedno').removeClass('Error');
    //});

    $('.chkreg').click(function () {
        $('.chkreg').removeClass('Error');
    });

    var ValidateError = 0;

    //if ($('input[name=Gender]:checked').val() == 'M') {
    //    $("#divGenderMale").removeClass('Error');
    //    $("#divGenderMale").addClass('active');
    //}
    //else if ($('input[name=Gender]:checked').val() == 'F') {
    //    $("#divGenderFemale").removeClass('Error');
    //    $("#divGenderFemale").addClass('active');
    //}
    ////else {
    ////    $("#divGenderMale").addClass('Error');
    ////    $("#divGenderFemale").addClass('Error');
    ////    ValidateError++;
    ////}

    if ($('#MaritalStatus').val() == 'M') {
        $("#divMarried").removeClass('Error');
        $("#divMarried").addClass('active');        
    }
    else if ($('#MaritalStatus').val() == 'S') {
        $("#divSingle").removeClass('Error');
        $("#divSingle").addClass('active');        
    }
    //else {
    //    $("#divsingle").addclass('error');
    //    $("#divmarried").addclass('error');
    //    ValidateError++;
    //}

    $('#AreYouOwnerYes').change(function () {
        $('#trOwnerDetails').hide('slow', function () { });
        $("#HiddenAreYouOwner").val('true');
        $("#AreYouOwnerYes").removeClass('Error');
        $("#AreYouOwnerNo").removeClass('Error');
        $('#OwnerName').val("");
    });
    $('#AreYouOwnerNo').change(function () {
        $('#trOwnerDetails').show('slow', function () { });
        $('#dvOwnerName').addClass('Error');
        $('#OwnerName').focus();
        $("#HiddenAreYouOwner").val('false');
        $("#AreYouOwnerYes").removeClass('Error');
        $("#AreYouOwnerNo").removeClass('Error');
    });


    //if ($('#divOwnerGender').is(':visible') == true) {
    //    if ($('input[name=OwnerGender]:checked').val() == 'M') {
    //        $("#divOwnerGenderMale").removeClass('Error');
    //        $("#divOwnerGenderMale").addClass('active');
    //    }
    //    else if ($('input[name=OwnerGender]:checked').val() == 'F') {
    //        $("#divOwnerGenderFemale").removeClass('Error');
    //        $("#divOwnerGenderFemale").addClass('active');
    //    }
    //    //else {
    //    //    $("#divOwnerGenderMale").addClass('Error');
    //    //    $("#divOwnerGenderFemale").addClass('Error');
    //    //    ValidateError++;
    //    //}
    //}


    if ($('#IsFinancedno').val() == "") {

        $('#divinstitution').hide(function () { });
    } else { $('#divinstitution').show(function () { }); }

    //
    if ($('input[type=IsFinanced]:checked').val() == "True" || $('input[id=IsFinanced]:checked').val() == "True") {
        $('#IsFinancedyes').removeClass('Error');
        $('#IsFinancedyes').addClass('active');
        $('#IsFinancedno').removeClass('Error');
        $('#divinstitution').show(function () { });
    }
    else if ($('input[type=IsFinanced]:checked').val() == "False" || $('input[id=IsFinanced]:checked').val() == "False") {
        $('#IsFinancedyes').removeClass('Error');
        $('#IsFinancedno').addClass('active');
        $('#IsFinancedno').removeClass('Error');
        $('#divinstitution').hide(function () { });
    }
    else {
        $('#IsFinancedyes').addClass('Error');
        $('#IsFinancedno').addClass('Error');
    }

    $('#IsFinancedyes').change(function () {
        $('#divinstitution').show(function () { });
        $('#IsFinancedyes').removeClass('Error');
        $('#IsFinancedno').removeClass('Error');
        $('#IsFinanced').prop('checked', true);
    });
    $('#IsFinancedno').change(function () {
        $('#divinstitution').hide(function () { });
        $('#IsFinancedyes').removeClass('Error');
        $('#IsFinancedno').removeClass('Error');
        $('#InstitutionName').val("");
        $('#InstitutionCity').val("");
        $('#IsFinanced').prop('checked', true);
    });


    //new code change by shashikant 30-01-2016 end
    //$('#divGender').click(function () {
    //    $('#divGenderMale').removeClass('Error');
    //    $('#divGenderFemale').removeClass('Error');
    //});
    //$('#divOwnerGender').click(function () {
    //    $('#divOwnerGenderMale').removeClass('Error');
    //    $('#divOwnerGenderFemale').removeClass('Error');
    //});

    $('#divAreYouOwner').click(function () {
        $('#AreYouOwnerYes').removeClass('Error');
        $('#AreYouOwnerNo').removeClass('Error');
    });
    $('#divMaritalStatus').click(function () {
        $('#divMarried').removeClass('Error');
        $('#divSingle').removeClass('Error');
    });

    if ($('#LT_MORTGAGE_ID').is(':visible') == true) {
        if ($('#LT_MORTGAGE_ID').val() == 0 || $('#LT_MORTGAGE_ID').val() == 3 || $('#LT_MORTGAGE_ID').val() == undefined) {
            $('.divMortgage').hide('slow', function () { });//FOR LT PAGE
            $('#divinstitution').hide('slow', function () { });//FOR RELIANCE PAGE
        }
        else {
            $('.divMortgage').show('slow', function () { });//FOR LT PAGE
            $('#divinstitution').show('slow', function () { });//FOR RELIANCE PAGE
        }
    }

    //if ($("#SameAsCommunication:checked").val() == "true") {
    //    SetAddressToRegistered(true);
    //}
    //else {
    //    $("#PermanentCityID").val(0);
    //    $("#PermanentCityName").val("");
    //    $("#RegisteredAddress").val("");
    //    $("#RegisteredAddress2").val("");
    //    $("#RegisteredAddress3").val("");
    //    $("#RegisteredPinCode").val("");
    //    $("#PermanentCityName").addClass('used');
    //    $("#RegisteredAddress").addClass('used');
    //    $("#RegisteredAddress2").addClass('used');
    //    $("#RegisteredAddress3").addClass('used');
    //    $("#RegisteredPinCode").addClass('used');
    //}



    if ($("#SameAsCommunication") != null) {
        $("#SameAsCommunication").change(function () {
            debugger;
            if ($("#SameAsCommunication:checked").val()) { SetAddressToRegistered(true); }
            else {
                $("#PermanentCityID").val(0);
                $("#PermanentCityName").val("");
                $("#RegisteredAddress").val("");
                $("#RegisteredAddress2").val("");
                $("#RegisteredAddress3").val("");
                $("#RegisteredPinCode").val("");
                $("#PermanentCityName").removeClass('used');
                $("#RegisteredAddress").removeClass('used');
                $("#RegisteredAddress2").removeClass('used');
                $("#RegisteredAddress3").removeClass('used');
                $("#RegisteredPinCode").removeClass('used');
                $("#RegistereDistrictName").removeClass('used');
                $("#RegisteredStateName").removeClass('used');
            }
        });
    }
    function SetAddressToRegistered(_isSet) {
        debugger;
        if (_isSet) {
            $("#PermanentCityID").val($("#ContactCityID").val());
            $("#PermanentCityName").val($("#ContactCityName").val());
            $("#RegisteredAddress").val($("#ContactAddress").val());
            $("#RegisteredAddress2").val($("#Address2").val());
            $("#RegisteredAddress3").val($("#Address3").val());
            $("#RegisteredPinCode").val($("#ContactPinCode").val());
            $("#ddlRegisteredCityID").empty();
            
            $('#ddlContactCityID option').clone().appendTo('#ddlRegisteredCityID');
            $('#ddlRegisteredCityID').val($('#ddlContactCityID').val());
            $("#RegistereDistrictName").val($("#DistrictName").val());
            $("#RegisteredStateName").val($("#StateName").val());

            $("#dvPermanentCityName").removeClass('Error');
            $("#dvRegisteredAddress").removeClass('Error');
            $("#dvRegisteredAddress2").removeClass('Error');
            $("#dvRegisteredAddress3").removeClass('Error');
            $("#dvRegisteredPinCode").removeClass('Error');
            $("#ddlRegisteredCityID").removeClass('Error');
            $("#dvRegistereDistrictName").removeClass('Error');
            $("#dvRegisteredStateName").removeClass('Error');

            $("#PermanentCityName").addClass('used');
            $("#RegisteredAddress").addClass('used');
            $("#RegisteredAddress2").addClass('used');
            $("#RegisteredAddress3").addClass('used');
            $("#RegisteredPinCode").addClass('used');
            $("#RegistereDistrictName").addClass('used');
            $("#RegisteredStateName").addClass('used');
        }
    }

    //Commented Old DatePicker
    /*$("#NomineeDOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y'
    });*/

    $('#LT_MORTGAGE_ID').change(function () {

        //alert($('#LT_MORTGAGE_ID').val());
        if ($(this).val() == 0 || $(this).val() == 3) {

            $('.divMortgage').hide('slow', function () { });
            $('#LT_Financier_ID').removeClass('Error').val('');
            $('#MortgageAmount').removeClass('Error').val('');
            $('#MortgageStartDate').removeClass('Error').val('');
            $('#MortgageExpirationDate').removeClass('Error').val('');
            $('#MortgageRefNumber').removeClass('Error').val('');
        }
        else {
            $('.divMortgage').show('slow', function () { });

            if ($('#LT_Financier_ID').val() == "0")
            { $('#LT_Financier_ID').addClass('Error'); }
            else
            { $('#LT_Financier_ID').removeClass('Error'); }

            if ($('#MortgageAmount').val() == "" || $('#MortgageAmount').val() == "0")
            { $('#MortgageAmount').addClass('Error'); }
            else
            { $('#MortgageAmount').removeClass('Error'); }

            if ($('#MortgageStartDate').val() == "")
            { $('#MortgageStartDate').addClass('Error'); }
            else
            { $('#MortgageStartDate').removeClass('Error'); }

            if ($('#MortgageExpirationDate').val() == "")
            { $('#MortgageExpirationDate').addClass('Error'); }
            else
            { $('#MortgageExpirationDate').removeClass('Error'); }

            if ($('#MortgageRefNumber').val() == "")
            { $('#MortgageRefNumber').addClass('Error'); }
            else
            { $('#MortgageRefNumber').removeClass('Error'); }

        }
    });

    $('#btn-global').on('click', function () {
        $('#btn-sectional').removeClass('disabled');
        $(this).addClass('disabled');
        $('#sectional').hide();
        $('#global').show();
    });

    $('#btn-sectional').on('click', function () {
        $('#btn-global').removeClass('disabled');
        $(this).addClass('disabled');
        $('#global').hide();
        $('#sectional').show();
    });

    $('input').on('keyup change', function () {
        $(this).closest($('.valid')).removeClass('valid');
    });

    //$('input').focusout()
    //        if(!/[0-9a-zA-Z- ]/.test(String.fromCharCode(e.which)))
    //            return false;
    //});

    $('input').focusout(function () {
      
        var input = $.trim($(this).val());
        if (input.length == 0) {
            $(this).val('');
        }

    });

    $('#AreYouOwnerYes').click(function () {
        $('#trOwnerDetails').hide('slow', function () { });
    });
    $('#AreYouOwnerNo').click(function () {
        $('#trOwnerDetails').show('slow', function () { });
        //$('#OwnerName').addClass('Error'); //Commented Old Validation
        $('#dvOwnerName').addClass('Error'); //Added New Validation
    });

    $('#chkregyes').change(function () {
        $('#divHaveRegistrationNumber').show('slow', function () { });
        $('#divRegistrationNumberPart1A').addClass('Error');
        $('#divRegistrationNumberPart2').addClass('Error');
        $('#divRegistrationNumberPart3').addClass('Error');
    });
    $('#chkregno').change(function () {

        $('#divHaveRegistrationNumber').hide('slow', function () { });
        $('#divRegistrationNumberPart1A').removeClass('Error');
        $('#divRegistrationNumberPart2').removeClass('Error');
        $('#divRegistrationNumberPart3').removeClass('Error');
    });

    $("#RegistrationNumberPart2").focusout(function () {
        ValidateError = 0;
        if ($('#RegistrationNumberPart2').val() == "" || $('#RegistrationNumberPart2').val().length == 0) {
            $('#dvRegistrationNumberPart2').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkTextWithoutSpace($('#RegistrationNumberPart2'));
            if (val == false) { ValidateError++; }
            else { $('#dvRegistrationNumberPart2').removeClass('Error'); }
        }
    });

    $("#RegistrationNumberPart3").focusout(function () {
        ValidateError = 0;
        if ($('#RegistrationNumberPart3').val() == "" || $('#RegistrationNumberPart3').val().length == 0) {
            $('#dvRegistrationNumberPart3').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkNumeric($('#RegistrationNumberPart3'));
            if (val == false || $('#RegistrationNumberPart3').val().length < 4) {
                ValidateError++;
            }
            else { $('#dvRegistrationNumberPart3').removeClass('Error'); }
        }
    });
    //Cheque Details

    $("input[name=PaymentOption]").click(function () {
        $("#HiddenPaymentOption").val($(this).val());
        HideShowChequeDetails($(this).val());
    });
    function HideShowChequeDetails(_value) {
        if (_value == "DD") {
            $("#trChequeDetails").show('slow', function () { });
        } else {
            $("#trChequeDetails").hide('slow', function () { });
        }
    }

    //$('#IsSameAsCommunicationYes').change(function () {
    //    $("#PermanentCityID").val($("#ContactCityID").val());
    //    $("#PermanentCityName").val($("#ContactCityName").val());
    //    $("#RegisteredAddress").val($("#ContactAddress").val());
    //    $("#RegisteredAddress2").val($("#Address2").val());
    //    $("#RegisteredAddress3").val($("#Address3").val());
    //    $("#RegisteredPinCode").val($("#ContactPinCode").val());
    //});
    //$('#IsSameAsCommunicationNo').change(function () {
    //    $("#PermanentCityID").val(0);
    //    $("#PermanentCityName").val("");
    //    $("#RegisteredAddress").val("");
    //    $("#RegisteredAddress2").val("");
    //    $("#RegisteredAddress3").val("");
    //    $("#RegisteredPinCode").val("");
    //});

    //$('#NomineeRelationID').change(function () {
    //    if ($('#NomineeRelationID').val() == "1") {
    //        $('#divNomineeRelationID').hide('slow', function () { });
    //        $('#NomineeName').removeClass('Error');
    //        $('#NomineeDOB').removeClass('Error');
    //    }
    //    else {
    //        $('#divNomineeRelationID').show('slow', function () { });
    //        $('#NomineeName').addClass('Error');
    //        $('#NomineeDOB').addClass('Error');
    //    }
    //});


    $("#SameAsCommunication").change(function () {
        debugger;
        if ($("#SameAsCommunication:checked").val() == "true") {
            SetAddressToRegistered(true);
        }
        else {
            $("#PermanentCityID").val(0);
            $("#PermanentCityName").val("");
            $("#RegisteredAddress").val("");
            $("#RegisteredAddress2").val("");
            $("#RegisteredAddress3").val("");
            $("#RegisteredPinCode").val("");
            $("#ddlRegisteredCityID").val("0");
            $("#RegistereDistrictName").val("");
            $("#RegisteredStateName").val("");
        }
    });
    
    $('#NomineeRelationID').change(function () {
        var isSelect = $('#NomineeRelationID option:selected').text();
        if (isSelect == "Self") {
           
                var Fname = $('#ContactName').val();
                var Lname = $('#ContactLastName').val();
                var DOB = $('#DOBofOwner').val();
                $('#NomineeName').val(Fname + ' ' + Lname);
                $('#NomineeDOB').val(DOB);
                $('#NomineeName').addClass('used');
                $('#dvNomineeDOB').removeClass('Error');
                $('#dvNomineeName').removeClass('Error');
                //$('#divNomineeRelationID').hide('slow', function () { });
            }
        else {
            //$('#divNomineeRelationID').show('slow', function () { });
            $('#NomineeDOB').val('');
            $('#NomineeName').val('').addClass('used');
            if ($('#NomineeName').val() == "" || $('#NomineeName').val() == null) { $('#dvNomineeName').addClass('Error'); }
            else { $('#dvNomineeName').removeClass('Error'); }
            //$('#dvNomineeDOB').addClass('Error');
            if ($('#NomineeDOB').val() == "" || $('#NomineeDOB').val() == null) { $('#dvNomineeDOB').addClass('Error'); }
            else { $('#dvNomineeDOB').removeClass('Error'); }

            if ($('#LNomineeName').val() == "") { $('#dvLNomineeName').addClass('Error'); }
            else { $('#dvLNomineeName').removeClass('Error'); }
        }
    });

    $('#OwnerName').blur(function () {
        if ($('#OwnerName').val() != "") { $('#dvOwnerName').removeClass('Error'); }
        else { $('#dvOwnerName').addClass('Error'); }
    });

    //Pratik
    $('#IsAltAddressYes').click(function () {
        ResetIsAltAddressValue();
        $('#AltAddressDetails').show('slow', function () { });
        $("#IsAltAddressYes").removeClass('Error');
        $("#AreYouOwnerNo").removeClass('Error');
    });
    $('#IsAltAddressNo').click(function () {
        $('#AltAddressDetails').hide('slow', function () { });
        $("#IsAltAddressYes").removeClass('Error');
        $("#IsAltAddressNo").removeClass('Error');
    });
});

//function ValidateTerms() {
//    //eventsubmmision(1, 'next', ' terms and conditions', 'car-contact-details step 9 event', types);
//    ValidateError = 0;
//    if ($("#iagree").prop('checked') == false) {
//        $("#iagree").addClass('errorCheckBox');
//        ValidateError++;
//    }
//    else {
//        $("#iagree").removeClass('errorCheckBox');
//    }
//    if (ValidateError < 1) {            // if (ValidateError < 1 && ValidateVAD(2)==true) {

//        //eventsubmmision(1, 'next', 'enter contact-details', 'car-insurance contactdetails step 1 event',types);  //Commented Old Validation
//        return true;
//    }
//    else {
//        return false;
//    }
//}


function ValidatePersonalAgent()
{
    ValidateError = 0;
    if ($('#ContactName').val() == "" || $('#ContactName').val().length < 3) {
        $('#dvContactName').addClass('Error');
        ValidateError++;
    }
    else {
        var val = checkTextWithoutSpace($('#ContactName'));
        if (val == false) { ValidateError++; }
        else { $('#dvContactName').removeClass('Error'); }
    }


    if ($('#ContactEmail').val().length == 0) {
        $('#dvContactEmail').addClass('Error');
        ValidateError++;
    }
    else {
        var val = checkEmail($('#ContactEmail'));
        if (val == false) { ValidateError++; }
    }

    if ($('#ContactMobile').val().length == 0) {
        //$('#ContactMobile').addClass('Error'); //Commented Old Validation
        $('#dvContactMobile').addClass('Error'); //Added New Validation
        ValidateError++;
    }
    else {
        var val = checkMobile($('#ContactMobile'));
        if (val == false) {
            ValidateError++;
            //$this.addClass('Error'); //Commented Old Validation
            //$('#dvContactMobile').after('<span id="spnContactMobile" class="ErrorText">Require valid Mobile No.</span>'); //Commented Old Validation
        }
    }

    if (ValidateError < 1) {
        //eventsubmmision(1, 'next', 'enter contact-details', 'car-insurance contactdetails step 1 event',types);  //Commented Old Validation
        return true;
    }
    else {
        return false;
    }

}


function ValidatePersonalInfo(Company) {
    ValidateError = 0;
    if (Company == 'Bharti') {
        if ($('#sault').val() == "TITLE") {
            $("#sault").addClass('Error');
            ValidateError++;
            $('#spnTitle').hide();
        }
        else {
            $("#sault").removeClass('Error');
            $('#spnTitle').show();
        }
    }

    if ($('#sault').is(':visible') == true) {
        if ($('#sault').val() == "TITLE") {
            $("#sault").addClass('Error');
            ValidateError++;
            $('#spnTitle').hide();
        }
        else {
            $("#sault").removeClass('Error');
            $('#spnTitle').show();
        }
    }

    if ($('#divGenderMale').is(':visible') == true) {
        if ($('#GenderMale').attr('src') == '/Images/POSP/male-border.png') {
            $("#divGenderMale").removeClass('Error');
            $("#divGenderMale").addClass('active');
        }
        else if ($('#GenderFemale').attr('src') == '/Images/POSP/female-border.png') {
            $("#divGenderFemale").removeClass('Error');
            $("#divGenderFemale").addClass('active');
        }
        else {
            $("#divGenderMale").addClass('Error');
            $("#divGenderFemale").addClass('Error');
            ValidateError++;
        }
    }

    if ($('#divSingle').is(':visible') == true) {
        if (document.getElementById('MaritalStatus') != null) {
            if ($('#MaritalStatus').val() == 'M') {
                $("#divMarried").removeClass('Error');
                $("#divMarried").addClass('active');
            }
            else if ($('#MaritalStatus').val() == 'S') {
                $("#divSingle").removeClass('Error');
                $("#divSingle").addClass('active');
            }
            else {
                $("#divSingle").addClass('Error');
                $("#divMarried").addClass('Error');
                ValidateError++;
            }
        }
    }
    if ($('#MaritalStatusID').val() == null || $('#MaritalStatusID').val() == "0" || $('#MaritalStatusID').val() == "") {
        if ($('#MaritalStatusID').is(':visible')) {
            $('#MaritalStatusID').addClass('Error');
            ValidateError++;
        }
    } else { $('#MaritalStatusID').removeClass('Error'); }

    if ($('#ContactName').val() == "" || $('#ContactName').val().length < 3) {
        $('#dvContactName').addClass('Error');
        ValidateError++;
    }
    else {
        var val = checkTextWithoutSpace($('#ContactName'));
        if (val == false) { ValidateError++; }
        else { $('#dvContactName').removeClass('Error'); }
    }

    if (Company == 'Bharti' || Company == "HDFCErgo") {
        if ($('#ContactLastName').val() == "" || $('#ContactLastName').val().length < 3) {
            $('#dvContactLastName').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkTextWithoutSpace($('#ContactLastName'));
            if (val == false) { ValidateError++; }
            else {
                $('#dvContactLastName').removeClass('Error');
            }
        }
    }
    if ($('#ContactLastName').is(':visible') == true) {
        if ($('#ContactLastName').val() == "" || $('#ContactLastName').val().length < 3) {
            $('#dvContactLastName').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkTextWithoutSpace($('#ContactLastName'));
            if (val == false) { ValidateError++; }
            else {
                $('#dvContactLastName').removeClass('Error');
            }
        }
    }

     

    if ($('#DOBofOwner').val() == "") {
        $('#dvDOBofOwner').addClass('Error');
        ValidateError++;
    } else {
        $('#dvDOBofOwner').removeClass('Error');
        $('#dvDOBofOwner').removeClass('DOBofOwnerClass');
       
    }


    if ($('#ContactEmail').val().length == 0) {
        $('#dvContactEmail').addClass('Error');
        ValidateError++;
    }
    else {
        var val = checkEmail($('#ContactEmail'));
        if (val == false) { ValidateError++; }
    }

    if ($('#ContactMobile').val().length == 0) {
        //$('#ContactMobile').addClass('Error'); //Commented Old Validation
        $('#dvContactMobile').addClass('Error'); //Added New Validation
        ValidateError++;
    }
    else {
        var val = checkMobile($('#ContactMobile'));
        if (val == false) {
            ValidateError++;
            //$this.addClass('Error'); //Commented Old Validation
            //$('#dvContactMobile').after('<span id="spnContactMobile" class="ErrorText">Require valid Mobile No.</span>'); //Commented Old Validation
        }
    }

    if (ValidateError < 1) {
        //eventsubmmision(1, 'next', 'enter contact-details', 'car-insurance contactdetails step 1 event',types);  //Commented Old Validation
        return true;
    }
    else {
        return false;
    }
}

function ValidateContactInfo(Company) {
    ValidateError = 0;
    if ($('#ContactAddress').val() == "") {
        $('#dvContactAddress').addClass('Error');
        ValidateError++;
    }
    else {
        var val = checkAddress($('#ContactAddress'));
        if (val == false) { ValidateError++; }
        else { $('#dvContactAddress').removeClass('Error'); }
    }
    if (Company == 'Bharti' || Company =='HDFCErgo') {
        if ($('#Address2').val() == "") {
            $('#dvAddress2').addClass('Error');//Added New Validation
            ValidateError++;
        }
        else {
            var val = checkAddress($('#Address2'));
            if (val == false) { ValidateError++; }
            else {
                //$('#Address2').removeClass('Error');  //Commented Old Validation
                $('#dvAddress2').removeClass('Error'); //Added New Validation
            }
        }
    }
    if ($('#Address2').is(':visible') == true) {
        if ($('#Address2').val() == "") {
            $('#dvAddress2').addClass('Error');//Added New Validation
            ValidateError++;
        }
        else {
            var val = checkAddress($('#Address2'));
            if (val == false) { ValidateError++; }
            else {
                //$('#Address2').removeClass('Error');  //Commented Old Validation
                $('#dvAddress2').removeClass('Error'); //Added New Validation
            }
        }
    }
    //Address3
    if (Company == 'Bharti' || Company == 'HDFCErgo') {
        if ($('#Address3').val() == "") {
            //$('#Address3').addClass('Error');  //Commented Old Validation
            $('#dvAddress3').addClass('Error'); //Added New Validation
            ValidateError++;
        }
        else {
            var val = checkAddress($('#Address3'));
            if (val == false) { ValidateError++; }
            else {
                //$('#Address3').removeClass('Error'); //Commented Old Validation
                $('#dvAddress3').removeClass('Error');  //Added New Validation
            }
        }
    }
    if ($('#Address3').is(':visible') == true) {
        if ($('#Address3').val() == "") {
            //$('#Address3').addClass('Error');  //Commented Old Validation
            $('#dvAddress3').addClass('Error'); //Added New Validation
            ValidateError++;
        }
        else {
            var val = checkAddress($('#Address3'));
            if (val == false) { ValidateError++; }
            else {
                //$('#Address3').removeClass('Error'); //Commented Old Validation
                $('#dvAddress3').removeClass('Error');  //Added New Validation
            }
        }
    }

    if ($('#ContactPinCode').val().length == 0) {
        //$('#ContactPinCode').addClass('Error'); //Commented Old Validation
        $('#dvContactPinCode').addClass('Error');  //Added New Validation
        ValidateError++;
    }
    else if ($('#ContactPinCode').val() <= 109999) {
        //$('#ContactPinCode').addClass('Error'); //Commented Old Validation
        $('#dvContactPinCode').addClass('Error');  //Added New Validation
        ValidateError++;
    }
    else {
        var val = checkPinCode($('#ContactPinCode'));
        if (val == false) {
            ValidateError++;
            $('#dvContactPinCode').after('<span id="spnContactPinCode" class="ErrorText">Require valid Postal Code</span>');  //Commented Old Validation
        }
        else {
            if ($("#ContactPinCode").val().length > 5) {

                if ($('#PostOfficeVORef').is(':visible') == true && $('#PostOfficeVORef').val() == 0 || $('#PostOfficeVORef').val() == null) {
                    GetLTPostOfficeLtg($("#ContactPinCode").val());
                    GetLTDistrictState($("#ContactPinCode").val());
                }
            }
            $('#ContactPinCode').removeClass('Error'); //Commented Old Validation
            $('#dvContactPinCode').removeClass('Error');  //Added New Validation
        }
    }

    if (Company == 'Bharti') {
        if ($('#ContactCityName').val() == "" || $('#ContactCityName').val() == "0" || $('#ContactCityID') == "0" || $('#ContactCityName').val() == null) {
            $('#dvContactCityName').addClass('Error');
            ValidateError++;
        }
        else { $('#dvContactCityName').removeClass('Error'); }
    }
    if ($('#dvContactCityName').is(':visible') == true) {

        if ($('#ContactCityName').val() == "" || $('#ContactCityName').val() == "0" || $('#ContactCityName').val() == null || $('#ContactCityName').val() == "OTHER, OTHER") {
            $('#dvContactCityName').addClass('Error');
            ValidateError++;
        }
        else { $('#dvContactCityName').removeClass('Error'); }
    }

    if (Company == 'HDFCErgo') {
        if ($('#StateName').val() == "") {
            $('#dvStateName').addClass('Error');
            ValidateError++;
        } else { $('#dvStateName').removeClass('Error'); }
    }

    if ($('#PostOfficeVORef').is(':visible') == true) {
        if ($('#PostOfficeVORef').val() == 0 || $('#PostOfficeVORef').val() == null) {
            $('#PostOfficeVORef').addClass('Error');
            ValidateError++;
        }
        else { $('#PostOfficeVORef').removeClass('Error'); }
    }




    if ($('#DOBofOwner').is(':visible') == true) {
        if ($('#DOBofOwner').val() == "") {
            $('#dvDOBofOwner').addClass('Error');
            ValidateError++;
        } else { $('#dvDOBofOwner').removeClass('Error'); }
    }

    if ($('#ContactMobile').val().length == 0) {
        //$('#ContactMobile').addClass('Error'); //Commented Old Validation
        $('#dvContactMobile').addClass('Error'); //Added New Validation
        ValidateError++;
    }
    else {
        var val = checkMobile($('#ContactMobile'));
        if (val == false) {
            ValidateError++;
            //$this.addClass('Error'); //Commented Old Validation
            //$('#dvContactMobile').after('<span id="spnContactMobile" class="ErrorText">Require valid Mobile No.</span>'); //Commented Old Validation
        }
    }
    if ($('#DistrictName').val() == "") {
        $('#dvDistrictName').addClass('Error');
        ValidateError++;
    } else { $('#dvDistrictName').removeClass('Error'); }

    if (ValidateError < 1) {
        //eventsubmmision(1, 'next', 'enter contact-details', 'car-insurance contactdetails step 1 event',types); //Commented Old Validation
        return true;
    }
    else { return false; }
}

function ValidateVehicleInfo(Company) {
    ValidateError = 0;
    if (($('#AreYouOwnerYes').is(':visible') == true) || ($('#AreYouOwnerNo').is(':visible') == true)) {
        if ($('#AreYouOwnerYes').hasClass('active') || $('#AreYouOwnerNo').hasClass('active')) {
            $('#AreYouOwnerYes').removeClass('Error');
            $('#AreYouOwnerNo').removeClass('Error');
        }
        else {
            $('#AreYouOwnerYes').addClass('Error');
            $('#AreYouOwnerNo').addClass('Error');
            ValidateError++;
        }
    }


    //OwnerName visible dvOwnerName
    if ($('#OwnerName').is(':visible') == true) {
        if ($('#OwnerName').val() == "") {
            $('#dvOwnerName').addClass('Error');
            ValidateError++;
        } else {

            $('#dvOwnerName').removeClass('Error');

        }
    }


    //EngineNumber dvEngineNumber
    if ($('#EngineNumber').val() == "") {
        $('#dvEngineNumber').addClass('Error');
        ValidateError++;
    } else {
               
        var val = checkAlphaNumericWithoutSpace($('#EngineNumber'));

        if (val == false) {
            ValidateError++;
        }
        else
        {
            $('#dvEngineNumber').removeClass('Error');
        }
    }

    //ChasisNumber dvChasisNumber
    if ($('#ChasisNumber').val() == "") {
        $('#dvChasisNumber').addClass('Error');
        ValidateError++;
    } else {
        var val = checkAlphaNumericWithoutSpace($('#ChasisNumber'));

        if (val == false) {
            ValidateError++;
        }
        else {
            $('#dvChasisNumber').removeClass('Error');
        }
       
    }

    //VehicleColor dvVehicleColor
    if ($('#VehicleColor').val() == "") {
        $('#dvVehicleColor').addClass('Error');
        ValidateError++;
    } else { $('#dvVehicleColor').removeClass('Error'); }

    if ($('#IsFinancedyes').hasClass('active') || $('#IsFinancedno').hasClass('active')) {
        $('#IsFinancedyes #IsFinancedno').removeClass('Error');
    }
    else {
        $('#IsFinancedyes #IsFinancedno').addClass('Error');
        ValidateError++;
    }

    if ($('#InstitutionName').is(':visible') == true) {
        if ($('#InstitutionName').val() == "") {
            $('#dvInstitutionName').addClass('Error');
            ValidateError++;
        } else { $('#dvInstitutionName').removeClass('Error'); }
        if ($('#InstitutionCity').val() == "") {
            $('#dvInstitutionCity').addClass('Error');
            ValidateError++;
        } else { $('#dvInstitutionCity').removeClass('Error'); }
    }

    if (Company == 'Bharti' || Company == "HDFCErgo") {
        $PolicyNumber = $('#PolicyNumber');
        if ($('#PolicyNumber').val() == "" ) {
            $('#dvPolicyNumber').addClass('Error');
            ValidateError++;
        }
        else {
            $('#PolicyNumber').removeClass('Error');
        }
    }
    else if ($('#PolicyNumber').is(':visible') == true) {  
        if ($('#PolicyNumber').val() == "" || $('#PolicyNumber').val().length == 0) {
            $('#dvPolicyNumber').addClass('Error');
            ValidateError++;
        }
        var val = checkAlphaNumeric($PolicyNumber);
        if (val == false) { ValidateError++; }
        else
        {
            if ($PolicyNumber.val().length() < 8 || $PolicyNumber.val().length() > 40) {
                $('#dvPolicyNumber').after('<span class="ErrorText">Please Enter Policy Number between 8 and 40.</span>');
                $('#dvPolicyNumber').addClass('Error');
                ValidateError++;
            }
            else { $('#dvPolicyNumber').removeClass('Error'); }
        }
    }
  
    if ($('#RegistrationNumberPart1').is(':visible') == true) {
        if ($('#RegistrationNumberPart1').val() == "") {
            $('#dvRegistrationNumberPart1').addClass('Error');
            ValidateError++;
        } else { $('#dvRegistrationNumberPart1').removeClass('Error'); }

        if ($('#RegistrationNumberPart1A').val() == "") {
            $('#dvRegistrationNumberPart1A').addClass('Error');
            ValidateError++;
        } else { $('#dvRegistrationNumberPart1A').removeClass('Error'); }

        if ($('#RegistrationNumberPart2').val() == "") {
            $('#dvRegistrationNumberPart2').addClass('Error');
            ValidateError++;
        } else { $('#dvRegistrationNumberPart2').removeClass('Error'); }

        if ($('#RegistrationNumberPart3').val() == "") {
            $('#dvRegistrationNumberPart3').addClass('Error');
            ValidateError++;
        } else { $('#dvRegistrationNumberPart3').removeClass('Error'); }
    }




    if ($('#divOwnerGender').is(':visible') == true) {

        if ($('#OwnerGenderMale').attr('src') == '/Images/POSP/male-border.png') {
            $("#divOwnerGenderMale").removeClass('Error');
            $("#divOwnerGenderMale").addClass('active');
        }
        else if ($('#OwnerGenderFemale').attr('src') == '/Images/POSP/female-border.png') {
            $("#divOwnerGenderFemale").removeClass('Error');
            $("#divOwnerGenderFemale").addClass('active');
        }
        else {
            $("#divOwnerGenderMale").addClass('Error');
            $("#divOwnerGenderFemale").addClass('Error');
            ValidateError++;
        }
    }
    if (ValidateError < 1) {
        //eventsubmmision(1, 'next', 'enter contact-details', 'car-insurance contactdetails step 1 event',types);  //Commented Old Validation
        return true;
    }
    else { return false; }
}

// By Pratik
function ValidateNomineeInfo() {
    ValidateError = 0;
    if ($('#NomineeName').is(':visible') == true) {
        if ($('#NomineeName').val() == "") {
            $('#dvNomineeName').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkText($('#NomineeName'));
            if (val == false) { ValidateError++; $('#dvNomineeName').addClass('Error'); }
            else { $('#dvNomineeName').removeClass('Error'); }
        }
    }

    if ($('#NomineeRelationID').val() == "1") {
        $('#NomineeDOB').val($('#DOBofOwner').val()); // For Self Condition
        $('#NomineeName').val($('#ContactName').val() + ' ' + ('#ContactLastName').val()); // For Self Condition
    }
    if ($('#NomineeRelationID').val() == "0") {
        $('#NomineeRelationID').addClass('Error');
        ValidateError++;
    }
    else { $('#NomineeRelationID').removeClass('Error'); }

    if ($('#NomineeDOB').val() == "") {
        $('#dvNomineeDOB').addClass('Error');
        ValidateError++;
    }
    else { $('#dvNomineeDOB').removeClass('Error'); }


    if (ValidateError < 1) {
        //eventsubmmision(1, 'next', 'enter contact-details', 'car-insurance contactdetails step 1 event',types);
        return true;
    }
    else { return false; }
}
//function Payment() {
//    ValidateError = 0;
//    if ($('#lblOnlinePayment').hasClass('active')) {
//        $("#lblOnlinePayment").addClass('active');
//        $("#lblOnlinePayment").removeClass('Error');
//        $("#lblNetBanking").removeClass('Error');
//    }
//    else if ($('#lblNetBanking').hasClass('active')) {
//        $("#lblNetBanking").addClass('active');
//        $("#lblOnlinePayment").removeClass('Error');
//        $("#lblNetBanking").removeClass('Error');
//    }
//    else {
//        $("#lblOnlinePayment").addClass('Error');
//        $("#lblNetBanking").addClass('Error');
//        ValidateError++;
//    }
//    if (ValidateError < 1) { return true; }
//    else { return false; }
//}

function ResetIsAltAddressValue() {
    $('#AltAddress1').val('');
    $('#AltAddress2').val('');
    $('#AltAddress3').val('');
    $('#AltPinCode').val('');
    $('#AltState').val('');
    $('#AltCity').val('');
}
function SetSameAddress() {
    $('#AltAddress1').val($('#ContactAddress').val());
    $('#AltAddress2').val($('#Address2').val());
    $('#AltAddress3').val($('#Address3').val());
    $('#AltPinCode').val($('#ContactPinCode').val());
    $('#AltState').val($('#ContactCityName').val());
    $('#AltCity').val($('#StateName').val());
}