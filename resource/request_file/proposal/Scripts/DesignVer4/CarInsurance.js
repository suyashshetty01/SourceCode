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
            if ($('input[name=MaritalStatus]:checked').val() == 'M') {
                $("#divMarried").removeClass('Error');
                $("#divMarried").addClass('active');
            }
            else if ($('input[name=MaritalStatus]:checked').val() == 'S') {
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
    if ($('#divOwnerGender').is(':visible') == true) {
        if ($('input[name=OwnerGender]:checked').val() == 'M') {
            $("#divOwnerGenderMale").removeClass('Error');
            $("#divOwnerGenderMale").addClass('active');
        }
        else if ($('input[name=OwnerGender]:checked').val() == 'F') {
            $("#divOwnerGenderFemale").removeClass('Error');
            $("#divOwnerGenderFemale").addClass('active');
        }
        else {
            $("#divOwnerGenderMale").addClass('Error');
            $("#divOwnerGenderFemale").addClass('Error');
            ValidateError++;
        }
    }

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
            $('#ContactCityName').addClass('Error');
            ValidateError++;
        }
    } else { $('#ContactCityName').removeClass('Error'); }

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
  
    if ($('#divGenderMale').hasClass("active"))
    {
        $('#OwnerGender').val("M");
    }

    else{
        $('#OwnerGender').val("F");
    }


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
                    GetLTPostOfficeLtg($("#ContactPinCode").val());
                    GetLTDistrictState($("#ContactPinCode").val());
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
            $('#DOBofOwner').addClass('Error');
            ValidateError++;
        } else { $('#DOBofOwner').removeClass('Error'); }
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
    }

    if ($('#ContactEmail').val().length == 0) {
        $('#ContactEmail').addClass('Error');
        ValidateError++;
    }
    else {
        var val = checkEmail($('#ContactEmail'));
        if (val == false) {
            ValidateError++;
            $(this).after('<span id="spnContactEmail" class="ErrorText">Require valid Email ID</span>');
        }
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
            $('#OwnerName').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkText($('#OwnerName'));
            if (val == false) { ValidateError++; }
            else { $('#OwnerName').removeClass('Error'); }
        }
    }
}

function ValidateContact() {
    if ($("#SelectedInsurerID").val() == 2 && $("#AreYouOwner").val() == "false") {
        $('#OwnerName').val($("#ContactName").val() + " " + $("#ContactLastName").val());
    }
    
    $('#ErrorMessage').hide();
    ValidateError = 0;
    if ($('#divGenderMale').is(':visible') == true) {
        if ($('input[name=Gender]:checked').val() == 'M') {
            $("#divGenderMale").removeClass('Error');
            $("#divGenderMale").addClass('active');
        }
        else if ($('input[name=Gender]:checked').val() == 'F') {
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
            if ($('input[name=MaritalStatus]:checked').val() == 'M') {
                $("#divMarried").removeClass('Error');
                $("#divMarried").addClass('active');
            }
            else if ($('input[name=MaritalStatus]:checked').val() == 'S') {
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
            $("#AreYouOwnerYes").removeClass('Error');
            $("#AreYouOwnerYes").addClass('active');
        }
        else if ($('#AreYouOwnerNo').hasClass('active')) {
            $("#AreYouOwnerNo").removeClass('Error');
            $("#AreYouOwnerNo").addClass('active');
        }
        else {
            $("#AreYouOwnerNo").addClass('Error');
            $("#AreYouOwnerYes").addClass('Error');
            ValidateError++;
        }       
    }    
    if ($('#divOwnerGender').is(':visible') == true) {
        if ($('input[name=OwnerGender]:checked').val() == 'M') {
            $("#divOwnerGenderMale").removeClass('Error');
            $("#divOwnerGenderMale").addClass('active');
        }
        else if ($('input[name=OwnerGender]:checked').val() == 'F')
        {
            $("#divOwnerGenderFemale").removeClass('Error');
            $("#divOwnerGenderFemale").addClass('active');
        }
        else {
            $("#divOwnerGenderMale").addClass('Error');
            $("#divOwnerGenderFemale").addClass('Error');
            ValidateError++;
        }
    }
    
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
                $('#ContactCityName').addClass('Error');
                ValidateError++;
        }
    } else { $('#ContactCityName').removeClass('Error'); }

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

    //if ($('#PermanentCityID').val() == null || $('#PermanentCityID').val() == "0" || $('#PermanentCityID').val() == "") {
    //    $('#PermanentCityName').addClass('Error');
    //    ValidateError++;
    //} else { $('#PermanentCityName').removeClass('Error'); }



    if ($("#PANNo").is(':visible') == true) {
        if($("#PANNo").val()!="" )
        {
            var pan = $("#PANNo").val();
            var pan_pattern = /[A-Za-z]{5}\d{4}[A-Za-z]{1}/;
            var result = pan.match(pan_pattern);
            if (result != null) {
                $("#PANNo").removeClass('Error');
            }
            else {
                $("#PANNo").addClass('Error');
                ValidateError++;
            }            
        }
        else if ($('#NetPayablePayablePremium').val() >= 50000) {
            ($("#PANNo").addClass('Error'));
            ValidateError++;
        }
        else
            ($("#PANNo").removeClass('Error'));
    }

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

    if ($('#Address2').is(':visible')==true) {
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
    if ($('#Address3').is(':visible')==true) {
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
                    GetLTPostOfficeLtg($("#ContactPinCode").val());
                    GetLTDistrictState($("#ContactPinCode").val());
                }
            }
            $('#ContactPinCode').removeClass('Error');
        }
    }

    if ($('#ddlContactCityID').is(':visible')==true) {
        if ($('#ddlContactCityID').val() == "" | $('#ddlContactCityID').val() == "0" || $('#ddlContactCityID').val() == null) {
            $('#ddlContactCityID').addClass('Error');
            ValidateError++;
        } else { $('#ddlContactCityID').removeClass('Error'); }
    }

    if ($('#PostOfficeVORef').is(':visible')==true) {
        if ($('#PostOfficeVORef').val() == 0 || $('#PostOfficeVORef').val()==null) {
            $('#PostOfficeVORef').addClass('Error');
            ValidateError++;
        }
        else { $('#PostOfficeVORef').removeClass('Error'); }
    }

    if ($('#DOBofOwner').is(':visible')==true) {
        if ($('#DOBofOwner').val() == "") {
            $('#DOBofOwner').addClass('Error');
            ValidateError++;
        } else { $('#DOBofOwner').removeClass('Error'); }
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
    }

    if ($('#ContactEmail').val().length == 0) {
        $('#ContactEmail').addClass('Error');
        ValidateError++;
    }
    else {
        var val = checkEmail($('#ContactEmail'));
        if (val == false) {
            ValidateError++;
            $(this).after('<span id="spnContactEmail" class="ErrorText">Require valid Email ID</span>');
        }
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
        var data = $('#OwnerName').val();
        var arr = data.split(' ');
        if ($('#OwnerName').val() == "" || arr.length < 2 || arr[arr.length - 1] == "") {
            $('#OwnerName').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkText($('#OwnerName'));
            if (val == false) { ValidateError++; }
            else { $('#OwnerName').removeClass('Error'); }
        }
    }
    if (ValidateError < 1) {
        eventsubmmision(1, 'next', 'enter contact-details', 'car-insurance contactdetails step 1 event',types);
        return true;
    }
    else {
        return false;
    }
}

//$EngineNumber = ;
//$ChasisNumber = ;
//alert(1);
$('#EngineNumber').focusout(function () {
    id = "spnEngineNumber";
    if ($('#EngineNumber').val().length < 7 || $('#EngineNumber').val().length > 20) {
        $("#spnEngineNumber").remove();
        ($('#EngineNumber')).after('<span id=' + id + ' class="ErrorText">Please Enter Engine Number between 7 and 20.</span>');
        ValidateError++;
    }
    else {
        $('#' + id + '').remove();
    }
});

var $PolicyNumber = $('PolicyNumber');
$('#PolicyNumber').focusout(function () {
    ValidateError = 0;
    if ($('#PolicyNumber').val() == "" || $('#PolicyNumber').val().length == 0) {
        $('#PolicyNumber').addClass('Error');
        ValidateError++;
    }
    var val = checkAlphaNumeric($PolicyNumber);
    if (val == false) { ValidateError++; }
    //else
    //{
    //    if ($PolicyNumber.val().length() < 8 || $PolicyNumber.val().length() > 40) {
    //        ($PolicyNumber).after('<span class="ErrorText">Please Enter Policy Number between 8 and 40.</span>');
    //        $PolicyNumber.addClass('Error');
    //        ValidateError++;
    //    }
    //    else { $PolicyNumber.removeClass('Error'); }
    //}
});

$('#ChasisNumber').focusout(function () {
    id = "spnChasisNumber";
    if ($('#ChasisNumber').val().length < 7 || $('#ChasisNumber').val().length > 20) {
        ($('#ChasisNumber')).after('<span id=' + id + ' class="ErrorText">Please Enter Chasis Number between 7 and 20.</span>');
        ValidateError++;
    } else { $('#' + id + '').remove(); }
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
        else {
            $('#AutomobileAssociationName').removeClass('Error');
        }
    }

    if ($('#AutomobileMembershipExpiryDate').is(':visible') == true) {
        if ($('#AutomobileMembershipExpiryDate').val() == "") {
            $('#AutomobileMembershipExpiryDate').addClass('Error');
            ValidateError++;
        }
        else {
            $('#AutomobileMembershipExpiryDate').removeClass('Error');
        }
    }
  
    //IsFinancedyes
    if (($('#IsFinancedyes').is(':visible') == true) || ($('#IsFinancedno').is(':visible') == true))
    {
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
            $EngineNumber.addClass('Error');
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
                $EngineNumber.addClass('Error');
                ValidateError++;
                return false;
            }
            else {
                $EngineNumber.removeClass('Error');
            }
            //.............

            var val = checkAlphaNumericWithoutSpace($EngineNumber);
            if (val == false) { ValidateError++; }
            else
            {
                id = "spnEngineNumber";
                if ($EngineNumber.val().length < 7 || $EngineNumber.val().length > 20) {
                    $("#spnEngineNumber").remove();
                    ($EngineNumber).after('<span id=' + id + ' class="ErrorText">Please Enter Engine Number between 7 and 20.</span>');
                    $EngineNumber.addClass('Error');
                    ValidateError++;
                }
                else { $EngineNumber.removeClass('Error'); }
            }
        }

        if ($ChasisNumber.val() == "") {
            $ChasisNumber.addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkAlphaNumericWithoutSpace($ChasisNumber);
            if (val == false) { ValidateError++; }
            else
            {
                id = "spnChasisNumber";
                if ($ChasisNumber.val().length < 7 || $ChasisNumber.val().length > 20) {
                    $("#spnChasisNumber").remove();
                    ($ChasisNumber).after('<span id=' + id + ' class="ErrorText">Please Enter Chasis Number between 7 and 20.</span>');
                    $ChasisNumber.addClass('Error');
                    ValidateError++;
                }
                else { $ChasisNumber.removeClass('Error'); }
            }
        }
    }
    if (Company == 'Reliance') {
        if ($EngineNumber.val() == "") {
            $EngineNumber.addClass('Error');
            ValidateError++;
        }
        else {
            var val1 = checkAlphaNumericWithoutSpace($EngineNumber);
            if (val1 == false) {
                $('#spnEngineNumber').remove();
                ($EngineNumber).after('<span id="spnEngineNumber" class="ErrorText">Please Enter Engine Number between 7 and 20.</span>');
                $EngineNumber.addClass('Error');
                ValidateError++;
            }
            else {
                var val = checkEngineChasis($EngineNumber);
                if (val == false) { ValidateError++; }
                else
                {
                    if ($EngineNumber.val().length < 7 || $EngineNumber.val().length > 20) {
                        $('#spnEngineNumber').remove();
                        ($EngineNumber).after('<span id="spnEngineNumber" class="ErrorText">Please Enter Engine Number between 7 and 20.</span>');
                        $EngineNumber.addClass('Error');
                        ValidateError++;
                    }
                    else { $EngineNumber.removeClass('Error'); }
                }
            }
        }
        if ($('#ChasisNumber').val() == "") {
            $('#ChasisNumber').addClass('Error');
            ValidateError++;
        } else {
            var val1 = checkAlphaNumericWithoutSpace($ChasisNumber);
            if (val1 == false) {
                $('#spnChasisNumber').remove();
                ($ChasisNumber).after('<span id="spnChasisNumber" class="ErrorText">Please Enter Chasis Number between 7 and 20.</span>');
                $ChasisNumber.addClass('Error');
                ValidateError++;
            }
            else {
                var val = checkEngineChasis($ChasisNumber);
                if (val == false) { ValidateError++; }
                else
                {
                    if ($ChasisNumber.val().length < 7 || $ChasisNumber.val().length > 20) {
                        $('#spnChasisNumber').remove();
                        ($ChasisNumber).after('<span id="spnChasisNumber" class="ErrorText">Please Enter Chasis Number between 7 and 20.</span>');
                        $ChasisNumber.addClass('Error');
                        ValidateError++;
                    }
                    else { $ChasisNumber.removeClass('Error'); }
                }
            }
        }
    }

    //alert(Company);
    if (Company == 'LT' || Company=='2') {
        if ($('#VehicleColor').val() == "" || $('#VehicleColor').val().length == 0) {
            $('#VehicleColor').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkText($('#VehicleColor'));
            if (val == false) { ValidateError++; }
            else { $('#VehicleColor').removeClass('Error'); }
        }
    }
  
    //if ($('#divinstitution').is(':visible') == true) {
    //    if ($('#InstitutionName').val() == "") {
    //        $('#InstitutionName').addClass('Error');
    //        ValidateError++;
    //    }
    //    else {
    //        var val = checkText($('#InstitutionName'));
    //        if (val == false) { ValidateError++; }
    //        else { $('#InstitutionName').removeClass('Error'); }
    //    }

    //    //if ($('#InstitutionCity').val() == "") {
    //    //    $('#InstitutionCity').addClass('Error');
    //    //    ValidateError++;
    //    //}
    //    //else {
    //    //    var val = checkText($('#InstitutionCity'));
    //    //    if (val == false) { ValidateError++; }
    //    //    else { $('#InstitutionCity').removeClass('Error'); }
    //    //}
    //}
    if(Company!='Libarty'){
    if ($('#InstitutionName').is(':visible')==true) {
        if ($('#InstitutionName').val() == "") {
            $('#InstitutionName').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkText($('#InstitutionName'));
            if (val == false) { ValidateError++; }
            else { $('#InstitutionName').removeClass('Error'); }
        }
    }
    }
    else {
        if ($('#InstitutionName').is(':visible') == true) {
            if ($('#InstitutionName').val() == "") {
                $('#InstitutionName').addClass('Error');
                ValidateError++;
            }
            else {
                var val = true;
                if (val == false) { ValidateError++; }
                else { $('#InstitutionName').removeClass('Error'); }
            }
        }
    }
    if ($('#InstitutionCity').is(':visible')==true) {
        if ($('#InstitutionCity').val() == "") {
            $('#InstitutionCity').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkText($('#InstitutionCity'));
            if (val == false) { ValidateError++; }
            else {
                $('#InstitutionCity').removeClass('Error');
            }
        }
    }

    //Lv_FinancierCode
    if ($('#Lv_FinancierCode').is(':visible')==true) {
        if ($('#Lv_FinancierCode').val() == "" || $('#Lv_FinancierCode').val() == null ) {
            $('#Lv_FinancierCode').addClass('Error');
            ValidateError++;
        }
        else {
             $('#Lv_FinancierCode').removeClass('Error'); 
        }
    }

    //Lv_FinancierAddress
    if ($('#Lv_FinancierAddress').is(':visible')) {
        if ($('#Lv_FinancierAddress').val() == "") {
            $('#Lv_FinancierAddress').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkAddress($('#Lv_FinancierAddress'));
            if (val == false) { ValidateError++; }
            else { $('#Lv_FinancierAddress').removeClass('Error'); }
        }
    }
    //Lv_FinancierPincode
    if ($('#Lv_FinancierPincode').is(':visible')==true) {
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

    //Lv_FinancerAgreementType
    if ($('#Lv_FinancerAgreementType').is(':visible')) {
        if ($('#Lv_FinancerAgreementType').val() == 0 || $('#Lv_FinancerAgreementType').val() =="") {
            $('#Lv_FinancerAgreementType').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkAlphaNumeric($('#Lv_FinancerAgreementType'));
            if (val == false) { ValidateError++; }
            else { $('#Lv_FinancerAgreementType').removeClass('Error'); }
        }
    }

    //ddlInstitutionCity
    if ($('#ddlInstitutionCity').is(':visible')==true) {
        if ($('#ddlInstitutionCity').val() == 0) {
            $('#ddlInstitutionCity').addClass('Error');
            ValidateError++;
        } else { $('#ddlInstitutionCity').removeClass('Error'); }
    }
    if ($('#LT_MORTGAGE_ID').is(':visible')==true) {
        if ($('#LT_MORTGAGE_ID').val() == 0) {
            $('#LT_MORTGAGE_ID').addClass('Error');
            ValidateError++;
        } else { $('#LT_MORTGAGE_ID').removeClass('Error'); }
    }

    //if ($('.divMortgage').is(':hidden') == false) {
    //alert($('#LT_Financier_ID').val());
    if ($('#LT_Financier_ID').is(':visible')) {
        if ($('#LT_Financier_ID').val() == null) {
            $('#LT_Financier_ID').val(0);
        }
        else if ($('#LT_Financier_ID').val() == 0) {
            $('#LT_Financier_ID').addClass('Error');
            ValidateError++;
        }
        else { $('#LT_Financier_ID').removeClass('Error'); }
    }

    if ($('#MortgageAmount').is(':visible')) {
        if ($('#MortgageAmount').val() == "" || $('#MortgageAmount').val() == "0") {
            $('#MortgageAmount').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkNumeric($('#MortgageAmount'));
            if (val == false) { ValidateError++; }
            else { $('#MortgageAmount').removeClass('Error'); }
        }
    }

    if ($('#MortgageStartDate').is(':visible')) {
        if ($('#MortgageStartDate').val() == "") {
            $('#MortgageStartDate').addClass('Error');
            ValidateError++;
        }
        else { $('#MortgageStartDate').removeClass('Error'); }
    }

    if ($('#MortgageExpirationDate').is(':visible')) {
        if ($('#MortgageExpirationDate').val() == "") {
            $('#MortgageExpirationDate').addClass('Error');
            ValidateError++;
        }
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
            if ($('#PolicyNumber').val() == "") {
                $('#PolicyNumber').addClass('Error');
                ValidateError++;
            }
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
            else {
                $('#spnPolicyNumber').remove();
                $('#PolicyNumber').removeClass('Error');
            }
        }
    }
    else if (Company == 'Oriental') {
        if ($('#PolicyNumber').is(':visible') == true) {
            if ($('#PolicyNumber').val() == "") {
                $('#PolicyNumber').addClass('Error');
                ValidateError++;
            }
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
            else {
                $('#spnPolicyNumber').remove();
                $('#PolicyNumber').removeClass('Error');
            }
        }
    }
    else {
        if ($('#PolicyNumber').is(':visible') == true) {
            if ($('#PolicyNumber').val() == "") {
                $('#PolicyNumber').addClass('Error');
                ValidateError++;
            }
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
            else {
                $('#spnPolicyNumber').remove();
                $('#PolicyNumber').removeClass('Error');
            }
        }
    }
    if (Company == 'Libarty') {
        if ($('#PolicyNumber').is(':visible')) {
            if ($('#PolicyNumber').val() == "") {
                $('#PolicyNumber').addClass('Error');
                ValidateError++;
            }
            else {
                var val = checkPolicyNumber($('#PolicyNumber'));
                if (val == false) {
                    ValidateError++;
                }
                else { $('#PolicyNumber').removeClass('Error'); }
            }
        }
    }
    if ($('#LT_PrevCoverTypeIdRef').is(':visible')==true) {
        if ($('#LT_PrevCoverTypeIdRef').val() == 0) {
            $('#LT_PrevCoverTypeIdRef').addClass('Error');
            ValidateError++;
        }
        else { $('#LT_PrevCoverTypeIdRef').removeClass('Error'); }
    }

    if ($('#RegistrationNumberPart1A').is(':visible')==true) {
        if ($('#RegistrationNumberPart1A').val() == "") {
            $('#RegistrationNumberPart1A').addClass('Error');
            ValidateError++;
        }
        else {
            //var val = checkNumeric($('#RegistrationNumberPart1A'));
            //if (val == false) {
            //    ValidateError++;
            //}
            //else { $('#RegistrationNumberPart1A').removeClass('Error'); }
            $('#RegistrationNumberPart1A').removeClass('Error');
        }
    }

    if ($('#RegistrationNumberPart2').is(':visible')==true) {
        if ($('#RegistrationNumberPart2').val() == "") {
            $('#RegistrationNumberPart2').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkTextWithoutSpace($('#RegistrationNumberPart2'));
            if (val == false) {
                ValidateError++;
            }
            else { $('#RegistrationNumberPart2').removeClass('Error'); }
        }
    }

    if ($('#RegistrationNumberPart3').is(':visible')==true) {
        if ($('#RegistrationNumberPart3').val() == "") {
            $('#RegistrationNumberPart3').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkNumeric($('#RegistrationNumberPart3'));
            if (val == false || $('#RegistrationNumberPart3').val().length < 4) {
                $('#RegistrationNumberPart3').addClass('Error');
                ValidateError++;
            }
            else { $('#RegistrationNumberPart3').removeClass('Error'); }
        }
    }

    if ($('#LT_InsurerAddress').is(':visible')==true) {
        if ($('#LT_InsurerAddress').val() == "") {
            $('#LT_InsurerAddress').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkAddress($('#LT_InsurerAddress'));
            if (val == false) {
                ValidateError++;
            }
            else { $('#LT_InsurerAddress').removeClass('Error'); }
        }
    }
    if (ValidateError < 1) {
        eventsubmmision(1, 'next', ' enter vehicle additional details', 'car-contact-details step 2 event', types);        
        return true;
    }
    else {
        return false;
    }
}

function ValidateVRD() {
    ValidateError = 0;
    if ($('#PermanentCityID').val() == "" || $('#PermanentCityID').val() == "0") {
        if ($('#PermanentCityName').is(':visible')==true) {
            $('#PermanentCityName').addClass('Error');
            ValidateError++;
        }
    } else { $('#PermanentCityName').removeClass('Error'); }

    if ($('#PermanentCityName').val() == "") {
        $('#PermanentCityName').addClass('Error');
        ValidateError++;
    }
    else { $('#PermanentCityName').removeClass('Error'); }

    if ($('#RegisteredAddress').val() == "") {
        $('#RegisteredAddress').addClass('Error');
        ValidateError++;
    }
    else {
        var val = checkAddress($('#RegisteredAddresss'));
        if (val == false) { ValidateError++; }
        else { $('#RegisteredAddress').removeClass('Error'); }
    }

    if ($('#RegisteredAddress2').is(':visible')) {
        if ($('#RegisteredAddress2').val() == "") {
            $('#RegisteredAddress2').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkAddress($('#RegisteredAddress2'));
            if (val == false) { ValidateError++; }
            else { $('#RegisteredAddress2').removeClass('Error'); }
        }
    }
    //Address3
    if ($('#RegisteredAddress3').is(':visible')) {
        if ($('#RegisteredAddress3').val() == "") {
            $('#RegisteredAddress3').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkAddress($('#RegisteredAddress3'));
            if (val == false) { ValidateError++; }
            else { $('#RegisteredAddress3').removeClass('Error'); }
        }
    }

    if ($('#RegisteredPinCode').val() == "") {
        $('#RegisteredPinCode').addClass('Error');
        ValidateError++;
    }
    else {
        var val = checkPinCode($('#RegisteredPinCode'));
        if (val == false) {
            ValidateError++;
        }
        else { $('#RegisteredPinCode').removeClass('Error'); }
    }
    if (ValidateError < 1) {
        eventsubmmision(1, 'next', ' enter vehicle registration details', 'car-contact-details step 3 event', types);
        return true;
    }
    else {
        return false;
    }
}

function ValidatePIA() {
    ValidateError = 0;
    if ($('#PreviousInsurerCityID').val() == "" || $('#PreviousInsurerCityID').val() == "0") {
        $('#PreviousInsurerCityName').addClass('Error');
        ValidateError++;
    }
    if ($('#PreviousInsurerCityID').val() == "" || $('#PreviousInsurerCityID').val() == "0") {
        $('#PreviousInsurerCityName').addClass('Error');
        ValidateError++;
    }
    //if ($('#PreviousInsurerCityName').val() == "") {
    //    $('#PreviousInsurerCityName').addClass('Error');
    //    ValidateError++;
    //}
    //else { $('#PreviousInsurerCityName').removeClass('Error'); }

    if ($('#PreviousInsurerAddress').val() == "") {
        $('#PreviousInsurerAddress').addClass('Error');
        ValidateError++;
    }
    else {
        var val = checkAddress($('#PreviousInsurerAddress'));
        if (val == false) { ValidateError++; }
        else { $('#PreviousInsurerAddress').removeClass('Error'); }
    }

    if ($('#PreviousInsurerAddress2').is(':visible')==true) {
        if ($('#PreviousInsurerAddress2').val() == "") {
            $('#PreviousInsurerAddress2').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkAddress($('#PreviousInsurerAddress2'));
            if (val == false) { ValidateError++; }
            else { $('#PreviousInsurerAddress2').removeClass('Error'); }
        }
    }
    //Address3
    if ($('#PreviousInsurerAddress3').is(':visible')==true) {
        if ($('#PreviousInsurerAddress3').val() == "") {
            $('#PreviousInsurerAddress3').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkAddress($('#PreviousInsurerAddress3'));
            if (val == false) { ValidateError++; }
            else { $('#PreviousInsurerAddress3').removeClass('Error'); }
        }
    }

    if ($('#PreviousInsurerPinCode').val() == "") {
        $('#PreviousInsurerPinCode').addClass('Error');
        ValidateError++;
    } else {
        var val = checkPinCode($('#PreviousInsurerPinCode'));
        if (val == false) {
            ValidateError++;
        }
        else { $('#PreviousInsurerPinCode').removeClass('Error'); }

    }
}

function ValidateND(company) {
    ValidateError = 0;
    if ($('#NomineeRelationID').val() == 0) {
        $('#NomineeRelationID').addClass('Error');
        ValidateError++;
    }
    else {
        $('#NomineeRelationID').removeClass('Error');
    }
    //if ($('#NomineeName').is(':visible')==true) {
    //    if ($('#NomineeName').val() == "") {
    //        $('#NomineeName').addClass('Error');
    //        ValidateError++;
    //    }
    //    else {
    //        var val = checkText($('#NomineeName'));
    //        if (val == false) { ValidateError++; }
    //        else { $('#NomineeName').removeClass('Error'); }
    //    }
    //}
    //else if ($('#NomineeRelationID').val()=="1")
    //{
    //    $('#NomineeName').val($('#ContactName').val());
    //}

    if ($('#NomineeName').is(':visible') == true) {
        if ($('#NomineeName').val() == "") { $('#dvNomineeName').addClass('Error'); ValidateError++; }
        else {
            if (Company == 'Libarty' || Company == 'TataAIG') {
                var val = checkTextWithoutSpace($('#NomineeName'));
                if (val == false) { $("#dvNomineeName").addClass('Error'); ValidateError++; }
                else { $('#dvNomineeName').removeClass('Error'); }
            }
            else {
                if (checkText($('#NomineeName')) == true) {
                    var data = $('#NomineeName').val();
                    var arr = data.split(' ');
                    if (arr[1] != null && arr[1] != "") { $("#dvNomineeName").removeClass('Error'); }
                    else { $("#dvNomineeName").addClass('Error'); ValidateError++; }
                }
                else { $("#dvNomineeName").addClass('Error'); ValidateError++; }
            }
        }
    }
    else if ($('#NomineeRelationID').val() == "1") { $('#NomineeName').val($('#ContactName').val()); }

    if ($('#NomineeDOB').val() == "") {
        $('#NomineeDOB').addClass('Error');
        ValidateError++;
    }
    else { $('#NomineeDOB').removeClass('Error'); }

    if ($('#MNomineeName').is(':visible') == true) {
        if ($('#MNomineeName').val() == "") {
            $('#MNomineeName').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkTextWithoutSpace($('#MNomineeName'));
            if (val == false) { ValidateError++; }
            else { $('#MNomineeName').removeClass('Error'); }
        }
    }

    if ($('#LNomineeName').is(':visible') == true) {
        if ($('#LNomineeName').val() == "") {
            $('#LNomineeName').addClass('Error');
            ValidateError++;
        }
        else {
            var val = checkText($('#LNomineeName'));
            if (val == false) { ValidateError++; }
            else { $('#LNomineeName').removeClass('Error'); }
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
    if ($('#NomineeAppointeeRelID').is(':visible') == true)
    {
        if ($('#NomineeAppointeeRelID').val() == 0) {
            $('#NomineeAppointeeRelID').addClass('Error');
            ValidateError++;
        }
        else {
            $('#NomineeAppointeeRelID').removeClass('Error');
        }
    }

    if ($('#otherNomineeRelation').is(':visible') == true) {
        if ($('#otherNomineeRelation').val() == 0) {
            $('#otherNomineeRelation').addClass('Error');
            ValidateError++;
        }
        else {
            $('#otherNomineeRelation').removeClass('Error');
        }
    }

    if (ValidateError < 1) {
        if (company == 'Oriental') {
            eventsubmmision(1, 'next', ' enter nominee details', 'car-contact-details step 4 event', types);
        }
        if (company == 'Reliance') {
            eventsubmmision(1, 'next', ' enter nominee details', 'car-contact-details step 7 event', types);
        }
        if (company == 'Libarty') {
            eventsubmmision(1, 'next', ' enter nominee details', 'car-contact-details step 8 event', types);
        }
        eventsubmmision(1, 'next', ' enter nominee details', 'car-contact-details step 3 event', types);
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

        if (hdnOnlinePay.val() == 1 && hdnSupportAgntID.val() > 0) {
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
            eventsubmmision(1, 'next', ' enter nominee details', 'car-contact-details step 4 event', types);
        }
        if (company == 'Reliance') {
            eventsubmmision(1, 'next', ' enter nominee details', 'car-contact-details step 7 event', types);
        }
        if (company == 'Libarty') {
            eventsubmmision(1, 'next', ' enter nominee details', 'car-contact-details step 8 event', types);
        }
        eventsubmmision(1, 'next', ' enter nominee details', 'car-contact-details step 3 event', types);
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
            eventsubmmision(1, 'next', ' enter electrical accessories', 'car-contact-details step 5 event', types);
        }
        eventsubmmision(1, 'next', ' enter electrical accessories', 'car-contact-details step 4 event', types);
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
            eventsubmmision(1, 'next', ' enter non-electrical accessories', 'car-contact-details step 6 event', types);
        }
        eventsubmmision(1, 'next', ' enter non-electrical accessories', 'car-contact-details step 5 event', types);
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
        eventsubmmision(1, 'next', ' enter bi-fuel accessories', 'car-contact-details step 7 event', types);
        return true;
    }
    else {
        return false;
    }

}

function checkPinCode(input) {
    var $temp = input;
    var pattern = new RegExp('^([0-9]{6})$');
    var id = "spn" + input[0].id;
    if (pattern.test(input.val()) == false) {
        $('#' + id + '').remove();
        $(input).addClass('Error');
        $(input).after('<span id=' + id + ' class="ErrorText">Require valid Postal code.</span>');
        return false;
    }
    else {
        $(input).removeClass('Error');
        $('#' + id + '').remove();
        return true;
    }
};
function checkMobile(input) {
    var pattern = new RegExp('^([6-9]{1}[0-9]{9})$');
    var id = "spn" + input[0].id;
    if (pattern.test(input.val()) == false) {
        $('#' + id + '').remove();
        $(input).addClass('Error');
        $(input).after('<span id=' + id + ' class="ErrorText">Require valid Mobile No.</span>');
        return false;
    }
    else {
        $(input).removeClass('Error');
        $('#' + id + '').remove();
        return true;
    }
};
function checkEmail(input) {
    var pattern = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$');
    var id = "spn" + input[0].id;
    if (pattern.test(input.val()) == false) {
        $('#' + id + '').remove();
        $(input).addClass('Error');
        $(input).after('<span id=' + id + ' class="ErrorText">Require valid Email ID.</span>');
        return false;
    }
    else {
        $(input).removeClass('Error');
        $('#' + id + '').remove();
        return true;
    }
};
function checkText(input) {
    var pattern = new RegExp('^[a-zA-Z ]+$');
    var id = "spn" + input[0].id;
    if (pattern.test(input.val()) == false) {
        $('#' + id + '').remove();
        $(input).addClass('Error');
        $(input).after('<span id=' + id + ' class="ErrorText">Enter Text Only</span>');
        return false;
    }
    else {
        $(input).removeClass('Error');
        $('#' + id + '').remove();
        return true;
    }
}
function checkNumeric(input) {
    
    var pattern = new RegExp('^[0-9]*$');
    var id = "spn" + input[0].id;
    if (pattern.test(input.val()) == false) {
        $('#' + id + '').remove();
        $(input).addClass('Error');
        $(input).after('<span id=' + id + ' class="ErrorText">Enter Number Only</span>');
        return false;
    }
    else {
        $(input).removeClass('Error');
        $('#' + id + '').remove();
        return true;
    }
}
function checkAlphaNumericWithoutSpace(input) {
    var pattern = new RegExp('^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$');
    var id = "spn" + input[0].id;
    if (pattern.test(input.val()) == false) {
        $('#' + id + '').remove();
        $(input).addClass('Error');
        $(input).after('<span id=' + id + ' class="ErrorText">Enter Alpha/Numeric Only</span>');
        return false;
    }
    else {
        $(input).removeClass('Error');
        $('#' + id + '').remove();
        return true;
    }
}
function checkPolicyNumber(input) {
    var pattern = new RegExp('^[a-zA-Z0-9-/]+$');
    var id = "spn" + input[0].id;
    if (pattern.test(input.val()) == false) {
        $('#' + id + '').remove();
        $(input).addClass('Error');
        $(input).after('<span id=' + id + ' class="ErrorText">Enter Valid Policy Number.</span>');
        return false;
    }
    else {
        $(input).removeClass('Error');
        $('#' + id + '').remove();
        return true;
    }
}
function checkAlphaNumeric(input) {
    var pattern = new RegExp('^[a-zA-Z0-9 ]+$');
    var id = "spn" + input[0].id;
    if (pattern.test(input.val()) == false) {
        $('#' + id + '').remove();
        $(input).addClass('Error');
        $(input).after('<span id=' + id + ' class="ErrorText">Enter Alpha/Numeric Only</span>');
        return false;
    }
    else {
        $(input).removeClass('Error');
        $('#' + id + '').remove();
        return true;
    }
}
function checkAddress(input) {
    var pattern = new RegExp('^[a-zA-Z0-9-,./ ]+$');
    var id = "spn" + input[0].id;
    if (pattern.test(input.val()) == false) {
        $('#' + id + '').remove();
        $(input).addClass('Error');
        $(input).after('<span id=' + id + ' class="ErrorText">Enter valid Input</span>');
        return false;
    }
    else {
        $(input).removeClass('Error');
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
        $(input).after('<span id=' + id + ' class="ErrorText">' + Message + ' </span>');
        return false;
    }
    else if (pattern.test(input.val()) == false) {
        $('#' + id + '').remove();
        $(input).addClass('Error');
        $(input).after('<span id=' + id + ' class="ErrorText">' + Message + ' </span>');
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
    checkAlphaNumeric($(this))
});
function checkTextWithoutSpace(input) {
    var pattern = new RegExp('^[a-zA-Z]+$');
    var id = "spn" + input[0].id;
    if (pattern.test(input.val()) == false) {
        $('#' + id + '').remove();
        $(input).addClass('Error');
        $(input).after('<span id=' + id + ' class="ErrorText">Enter Valid Text</span>');
        return false;
    }
    else {
        $(input).removeClass('Error');
        $('#' + id + '').remove();
        return true;
    }
}

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
    $("#DOBofOwner").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        maxDate: '-18y'
    });
    
    if ($("#Lv_FinancierPincode").val() != "" && $("#Lv_FinancierPincode").is(':visible')==true) {
        if ($("#Lv_FinancierPincode").val().length > 5) {
            GetLibartyInstituteCity($("#Lv_FinancierPincode").val());
            $("#ddlInstitutionCity").val("@Model.InstitutionCity");
        }
    }

    $('#ContactName').keydown(function (e) {
        var key = e.keyCode;
        if ($('#hdnIsCompany').val() == "Company") {
            if (!((key == 8) || (key == 9) || (key == 32) || (key == 46) || (key >= 35 && key <= 40) || (key >= 65 && key <= 90))) { e.preventDefault(); }
        }
        else {
            if (!((key == 8) || (key == 9) || (key == 46) || (key >= 35 && key <= 40) || (key >= 65 && key <= 90))) { e.preventDefault(); }
        }
    });
    $('#ContactLastName').keydown(function (e) {
        var key = e.keyCode;
        if (!((key == 8) || (key == 9) || (key == 46) || (key >= 35 && key <= 40) || (key >= 65 && key <= 90))) { e.preventDefault(); }
    });

    $('#ContactMiddleName').keydown(function (e) {
        var key = e.keyCode;
        if (!((key == 8) || (key == 9) || (key == 46) || (key >= 35 && key <= 40) || (key >= 65 && key <= 90))) { e.preventDefault(); }
    });

    $('#ContactFatherFirstName').keydown(function (e) {
        var key = e.keyCode;
        if (!((key == 8) || (key == 9) || (key == 46) || (key >= 35 && key <= 40) || (key >= 65 && key <= 90))) { e.preventDefault(); }
    });

    $('#ContactFatherLastName').keydown(function (e) {
        var key = e.keyCode;
        if (!((key == 8) || (key == 9) || (key == 46) || (key >= 35 && key <= 40) || (key >= 65 && key <= 90))) { e.preventDefault(); }
    });

    $("#ChequeDate").datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate() - 15),
        maxDate: '+15d'
    });

    $('.ContactKey').keydown(function (e) {
        if (e.ctrlKey || e.altKey) {
            e.preventDefault();
        } else {
            var key = e.keyCode;
            //alert(key);
            if (!((key == 8) || (key == 9) || (key == 46) || (key >= 35 && key <= 40) || (key >= 65 && key <= 90))) {
                e.preventDefault();
            }
        }
    });
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
    }
     //new code change by Sudhir 30-01-2016 start
    $('#divfinanced').click(function () {
        $('#IsFinancedyes').removeClass('Error');
        $('#IsFinancedno').removeClass('Error');
    });

    $('.chkreg').click(function () {
        $('.chkreg').removeClass('Error');
    });

    var ValidateError = 0;

    if ($('input[name=Gender]:checked').val() == 'M') {
        $("#divGenderMale").removeClass('Error');
        $("#divGenderMale").addClass('active');
    }
    else if ($('input[name=Gender]:checked').val() == 'F') {
        $("#divGenderFemale").removeClass('Error');
        $("#divGenderFemale").addClass('active');
    }
    //else {
    //    $("#divGenderMale").addClass('Error');
    //    $("#divGenderFemale").addClass('Error');
    //    ValidateError++;
    //}

    if ($('input[name=MaritalStatus]:checked').val() == 'M') {
        $("#divMarried").removeClass('Error');
        $("#divMarried").addClass('active');
    }
    else if ($('input[name=MaritalStatus]:checked').val() == 'S') {
        $("#divSingle").removeClass('Error');
        $("#divSingle").addClass('active');
    }
    //else {
    //    $("#divSingle").addClass('Error');
    //    $("#divMarried").addClass('Error');
    //    ValidateError++;
    //}

    if ($('input[type=AreYouOwnerYes]:checked').val() == true || $("#HiddenAreYouOwner").val() == "True" || $("#HiddenAreYouOwner").val() == "true") {
        $("#AreYouOwnerYes").removeClass('Error');
        $("#AreYouOwnerYes").addClass('active');
        $("#AreYouOwnerNo").removeClass('Error');
        $('#trOwnerDetails').hide('slow', function () { });
    }
    else if ($('input[type=AreYouOwnerNo]:checked').val() == true || $("#HiddenAreYouOwner").val() == "False" || $("#HiddenAreYouOwner").val() == "false") {
        $("#AreYouOwnerNo").removeClass('Error');
        $("#AreYouOwnerNo").addClass('active');
        $("#AreYouOwnerYes").removeClass('Error');
        $('#trOwnerDetails').show('slow', function () { });
    }
    else {
        $("#AreYouOwnerNo").addClass('Error');
        $("#AreYouOwnerYes").addClass('Error');
        ValidateError++;
    }
    if ($('#divOwnerGender').is(':visible') == true) {
        if ($('input[name=OwnerGender]:checked').val() == 'M') {
            $("#divOwnerGenderMale").removeClass('Error');
            $("#divOwnerGenderMale").addClass('active');
        }
        else if ($('input[name=OwnerGender]:checked').val() == 'F') {
            $("#divOwnerGenderFemale").removeClass('Error');
            $("#divOwnerGenderFemale").addClass('active');
        }
        //else {
        //    $("#divOwnerGenderMale").addClass('Error');
        //    $("#divOwnerGenderFemale").addClass('Error');
        //    ValidateError++;
        //}
    }

    if ($('#IsFinancedno').val() == "") {
        $('#divinstitution').hide(function () { });
    } else { $('#divinstitution').show(function () { }); }
   
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
    //$('#divinstitution').show(function () { });

    $('#AreYouOwnerYes').click(function () {
        $('#trOwnerDetails').hide('slow', function () { });
        $("#HiddenAreYouOwner").val('true');
        //$('#OwnerName').addClass('required-field');
    });

    $('#AreYouOwnerNo').click(function () {
        $('#trOwnerDetails').show('slow', function () { });
        $('#OwnerName').addClass('Error');
        $("#HiddenAreYouOwner").val('false');
        //$('#OwnerName').removeClass('Error');
    });

    //new code change by shashikant 30-01-2016 end
    $('#divGender').click(function () {
        $('#divGenderMale').removeClass('Error');
        $('#divGenderFemale').removeClass('Error');
    });
    $('#divOwnerGender').click(function () {
        $('#divOwnerGenderMale').removeClass('Error');
        $('#divOwnerGenderFemale').removeClass('Error');
    });
    $('#divAreYouOwner').click(function () {
        $('#AreYouOwnerYes').removeClass('Error');
        $('#AreYouOwnerNo').removeClass('Error');
    });
    $('#divMaritalStatus').click(function () {
        $('#divMarried').removeClass('Error');
        $('#divSingle').removeClass('Error');
    });
    //alert(1);
    
    if ($('#LT_MORTGAGE_ID').is(':visible')==true) {
        if ($('#LT_MORTGAGE_ID').val() == 0 || $('#LT_MORTGAGE_ID').val() == 3 || $('#LT_MORTGAGE_ID').val() == undefined) {
            $('.divMortgage').hide('slow', function () { });//FOR LT PAGE
            $('#divinstitution').hide('slow', function () { });//FOR RELIANCE PAGE
        }
        else {
            $('.divMortgage').show('slow', function () { });//FOR LT PAGE
            $('#divinstitution').show('slow', function () { });//FOR RELIANCE PAGE
        }
    }
        
    if ($('#hdnInsurerId').val() == "10") {
        $("#NomineeDOB").datepicker({
            changeMonth: true,
            changeYear: true,
            yearRange: 'c-82:c',
            dateFormat: 'dd-mm-yy',
            minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
            maxDate: new Date()
        });
        $("#GuardianDOB").datepicker({
            changeMonth: true,
            changeYear: true,
            yearRange: 'c-82:c',
            dateFormat: 'dd-mm-yy',
            minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
            maxDate: '-18y'
        });
    } else {
        $("#NomineeDOB").datepicker({
            changeMonth: true,
            changeYear: true,
            yearRange: 'c-82:c',
            dateFormat: 'dd-mm-yy',
            minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
            maxDate: '-18y'
        }); 
    }
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

            if ($('#MortgageAmount').val() == "" || $('#MortgageAmount').val()=="0")
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
        if (input.length == 0) { $(this).val(''); }
       
    });

    $('#AreYouOwnerYes').click(function () {
        $('#trOwnerDetails').hide('slow', function () { });
    });
    $('#AreYouOwnerNo').click(function () {
        $('#trOwnerDetails').show('slow', function () { });
        $('#OwnerName').addClass('Error');
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
        if ($('#RegistrationNumberPart2').val() == "" || $('#RegistrationNumberPart2').val().length == 0) { $('#RegistrationNumberPart2').addClass('Error'); ValidateError++; }
        else {
            var val = checkTextWithoutSpace($('#RegistrationNumberPart2'));
            if (val == false) { ValidateError++; }
            else { $('#RegistrationNumberPart2').removeClass('Error'); }
        }
    });

    $("#RegistrationNumberPart3").focusout(function () {
        ValidateError = 0;
        if ($('#RegistrationNumberPart3').val() == "" || $('#RegistrationNumberPart3').val().length == 0) { $('#RegistrationNumberPart3').addClass('Error'); ValidateError++; }
        else {
            var val = checkNumeric($('#RegistrationNumberPart3'));
            if (val == false || $('#RegistrationNumberPart3').val().length < 4) { ValidateError++; }
            else { $('#RegistrationNumberPart3').removeClass('Error'); }
        }
    });
    //Cheque Details

    $("input[name=PaymentOption]").click(function () {
        $("#HiddenPaymentOption").val($(this).val());
        HideShowChequeDetails($(this).val());
    });
    function HideShowChequeDetails(_value) {
        if (_value == "DD") { $("#trChequeDetails").show('slow', function () { }); }
        else { $("#trChequeDetails").hide('slow', function () { }); }
    }

    $('#IsFinancedyes').change(function () {
        $('#divinstitution').show(function () { });
        // $('#institutionname').addClass('Error');
        //$('#institutioncity').addClass('Error');
    });
    $('#IsFinancedno').change(function () {
        $('#divinstitution').hide(function () { });
        //$('#institutionname').removeClass('Error');
        //$('#institutioncity').removeClass('Error');
    });

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
    function SetAddressToRegistered(_isSet) {
        if (_isSet) {
            $("#PermanentCityID").val($("#ContactCityID").val());
            $("#PermanentCityName").val($("#ContactCityName").val());
            $("#RegisteredAddress").val($("#ContactAddress").val());
            $("#RegisteredAddress2").val($("#Address2").val());
            $("#RegisteredAddress3").val($("#Address3").val());
            $("#RegisteredPinCode").val($("#ContactPinCode").val());
        }
    }

    $("#SameAsCommunication").change(function () {
        if ($("#SameAsCommunication:checked").val() == "true") { SetAddressToRegistered(true); }
        else {
            $("#PermanentCityID").val(0);
            $("#PermanentCityName").val("");
            $("#RegisteredAddress").val("");
            $("#RegisteredAddress2").val("");
            $("#RegisteredAddress3").val("");
            $("#RegisteredPinCode").val("");
        }
    });

    $('#NomineeRelationID').change(function () {
        //alert($('#NomineeRelationID').val());
        if ($('#NomineeRelationID').val() == "1") {
            $('#divNomineeRelationID').hide('slow', function () { });
            $('#NomineeName').removeClass('Error');
            $('#NomineeDOB').removeClass('Error');
            $('#LNomineeName').removeClass('Error');
           // $('#MNomineeName').removeClass('Error');
        }
        else {
            $('#divNomineeRelationID').show('slow', function () { });
            if ($('#NomineeName').val()=="" || $('#NomineeName').val()==null){ $('#NomineeName').addClass('Error'); }
            else { $('#NomineeName').removeClass('Error'); }
            $('#NomineeDOB').addClass('Error');
            if ($('#LNomineeName').val() == "") {   $('#LNomineeName').addClass('Error'); }
            else { $('#LNomineeName').removeClass('Error'); }
        }
    });

    $('#OwnerName').blur(function () {
        if ($('#OwnerName').val() != "") { $(this).removeClass('Error'); }
        else { $(this).addClass('Error'); }
    });
});

function ValidateTerms()
{
    eventsubmmision(1, 'next', ' terms and conditions', 'car-contact-details step 9 event', types);
    ValidateError = 0;
    if ($("#iagree").prop('checked') == false) { $("#iagree").addClass('errorCheckBox'); ValidateError++; }
    else { $("#iagree").removeClass('errorCheckBox'); }
}

//Setting Maxlength for Mobile
$('#ContactMobile').keypress(function () {
    return this.value.length < 10
})

//Setting Maxlength For Pincode
$('.Pincode').keypress(function () {
    return this.value.length < 6
})

$('.Pincode').focusout(function () {
    checkPinCode($(this));
});