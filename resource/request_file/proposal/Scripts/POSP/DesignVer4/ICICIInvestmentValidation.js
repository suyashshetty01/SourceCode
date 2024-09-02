$(document).ready(function () {
    
    $("#NomineeRelation").change(function () {
        var name = $("#NomineeRelation option:selected").attr("name");
        NomineeGender(name);
    });


    $("#ContactTitle").change(function () {

        setGender();

    });

    $("#InsuredGender").change(function () {
        if ($("#InsuredGender").val() == "Male" && $("#InsuredMaritalStatus").val() == "696") {
            $("#MWPADiv").show();
        } else {
            $("#MWPADiv").hide();
        }
    });
   
    //$("#MaritalStatus").change(function () {
    //    if ($("#InsuredGender").val() == "Male" && $("#MaritalStatus").val() == "696") {
    //        $("#MWPADiv").show();
    //    } else {
    //        $("#MWPADiv").hide();
    //    }
    //});

            //$("#ISLAPropoerSame").prop("checked",true);
            $('#ContactIDProof').on('change', function () {
                
                if (this.value == 'Driving license') {
                    $("#DIVDrivingLicenseExpiry").show();
                }
                else {
                    $("#DIVDrivingLicenseExpiry").hide();
                }

                if (this.value != null) {
                    $("#dvDocumentID").show();
                }

            });

            $('input[type="checkbox"]').val(true);
            $('input[type="checkbox"]').attr("checked");
            if ($('input[type="checkbox"]').prop("checked") == true) {
                
                $('input[type="checkbox"]').val(true);
                $("#LifeAssured").hide();
            }
            else if ($('input[type="checkbox"]').prop("checked") == false) {
                $('input[type="checkbox"]').val(false);
                $("#LifeAssured").show();
            }

            $('input[type="checkbox"]').change(function(){
                if ($('input[type="checkbox"]').prop("checked") == true) {
                    
                    $('input[type="checkbox"]').val(true);
                    $("#LifeAssured").hide();
                }
                else if ($('input[type="checkbox"]').prop("checked") == false) {
                    $('input[type="checkbox"]').val(false);
                    $("#LifeAssured").show();
                }
            })
           

            //$("#ProposerRelation").change(function()
            //{
            //    
            //    if($("#ProposerRelation").val()=="Self")
            //    {
            //        $("#LifeAssured").hide();
            //    }else
            //    {
            //        $("#LifeAssured").show();
            //    }
            //})
            //if($("#ProposerRelation").val()!="Self")
            //{
            //    $("#LA").show();
            //}else
            //{
            //    $("#LA").hide();
            //}

            $("input").each(function () {
                var element = $(this);
                if (element.val() == "" || element.val() == "0") { $(element).removeClass('used'); }
                else { $(element).addClass('used'); }
            });

            $("input").focusout(function () {
                var element = $(this);
                if (element.val() == "" || element.val() == "0") { $(element).removeClass('used'); }
                else { $(element).addClass('used'); }
            });

            $("#BenficiaryCount").val(1);
            $("#TrusteeCount").val(1);

            //var medicalquestion1411 = $("#MedicalQuestionAns_1411").val();
            //if (medicalquestion1411 != "" || medicalquestion1411 != null) {
            //    if ($("#MedicalQuestionAns_1411").val() == "Yes") {
            //        $("#MedicalQuestionSubQuestionHQ167").show();
            //    }
            //    else {
            //        $("#MedicalQuestionSubQuestionHQ167").hide();
            //    }
            //}

            $('#InsuredMaritalStatus option[value="696"]').attr("selected", "selected");

            //For Disable first select option
            $("select option[value='']").prop('disabled', true);

            //dynamically setting selected dropdown text
            $('select[name=selector]').attr("selected", "selected");

            var contactpincode = $("#ContactPinCode").val();
            if (contactpincode != null) {
                $("#ContactPinCode").focusout(function () {
                    if (checkPincode($(this)) == false) {
                        $('#dvContactPinCode').addClass('Error');
                        $('#PostOfficeId').empty();
                        $('#ContactCityName').removeClass('used').val("");
                        $('#ContactState').removeClass('used').val("");
                    }
                    else {
                        //GetPincodeDetails($(this).val());
                        $('#dvContactPinCode').removeClass('Error');
                        $('#dvCity').removeClass('Error');
                        $('#dvStateName').removeClass('Error');
                        $('#ContactCityName').addClass('used');
                        $('#ContactState').addClass('used');
                    }
                });
            }

            var permanentpincode = $("#PermanentPinCode").val();
            if (permanentpincode != null) {
                $("#PermanentPinCode").focusout(function () {
                    if (checkPincode($(this)) == false) {
                        $('#dvPermanentPinCode').addClass('Error');
                        // $('#PermanentPostOfficeId').empty();
                        $('#PermanentCityName').removeClass('used').val("");
                        $('#PermanentState').removeClass('used').val("");
                    }
                    else {
                        //GetHDFCLifePermanentPincodeDetails($(this).val());
                        $('#dvPermanentPinCode').removeClass('Error');
                        $('#dvPermanentCityName').removeClass('Error');
                        $('#dvPermanentStateName').removeClass('Error');
                        $('#PermanentCityName').addClass('used');
                        $('#PermanentStateName').addClass('used');
                    }
                });
            }

            var nomineepincode = $("#NomineePinCode").val();
            if (nomineepincode != null) {
                $("#NomineePinCode").focusout(function () {
                    if (checkPincode($(this)) == false) {
                        $('#dvNomineePinCode').addClass('Error');
                        //  $('#NomineePostOfficeId').empty();
                        $('#NomineeCityName').removeClass('used').val("");
                        $('#NomineeState').removeClass('used').val("");
                    }
                    else {
                        //GetHDFCLifeNomineePincodeDetails($(this).val());
                        $('#dvNomineePinCode').removeClass('Error');
                        $('#dvNomineeCity').removeClass('Error');
                        $('#dvNomineeState').removeClass('Error');
                        $('#NomineeCityName').addClass('used');
                        $('#NomineeState').addClass('used');
                    }
                });
            }

            var appointeepincode = $("#AppointeePinCode").val();
            if (appointeepincode != null) {

                $("#AppointeePinCode").focusout(function () {
                    if (checkPincode($(this)) == false) {
                        $('#dvAppointeePinCode').addClass('Error');
                        $('#AppointeeCityName').removeClass('used').val("");
                        $('#AppointeeState').removeClass('used').val("");
                    }
                    else {
                        //GetHDFCLifeAppointeePincodeDetails($(this).val());
                        $('#dvAppointeePinCode').removeClass('Error');
                        $('#dvAppointeeCity').removeClass('Error');
                        $('#dvAppointeeState').removeClass('Error');
                        $('#AppointeeCityName').addClass('used');
                        $('#AppointeeState').addClass('used');
                    }
                });
            }


            //$('#FinalSubmit').val("0");
            //var isCustomer = "@Model.IsCustomer";

            //if (isCustomer == "False" || isCustomer == "false") {
            //    checkAgentValidation();
            //}
            //else {
            //    checkCustomerValidation();
            //}


        });
function setGender() {
    if ($('#ContactTitle').val() == "TITL_KMAR" || $('#ContactTitle').val() == "TITL_MR" || $('#ContactTitle').val() == "TITL_SHRI") {
        ContactGender('Male');
        $("#ContactGender").val("Male");
        $("#ContactGenderM").addClass('active');
        $("#ContactGenderF").removeClass('active');
        $('#ContactGender').prop('readonly', true);
        $("#ContactGenderM").css("pointer-events", "none");
        $("#ContactGenderF").css("pointer-events", "none");
    }
    else if ($('#ContactTitle').val() == "TITL_KMRI" || $('#ContactTitle').val() == "TITL_MIS" || $('#ContactTitle').val() == "TITL_MRS" || $('#ContactTitle').val() == "TITL_SMT") {
        ContactGender('Female');
        $("#ContactGender").val("Female");
        $("#ContactGenderF").addClass('active');
        $("#ContactGenderM").removeClass('active');
        $('#ContactGender').prop('readonly', true);
        $("#ContactGenderM").css("pointer-events", "none");
        $("#ContactGenderF").css("pointer-events", "none");
    }
    //else if ($('#ContactTitle').val() == "TITL_OTHERS") {
    //    $("#ContactGender").val("Transgender");
    //    $("#ContactGenderF").removeClass('active');
    //    $("#ContactGenderM").removeClass('active');
    //}
    //else if ($('#ContactTitle').val() == "TITL_DR" || $('#ContactTitle').val() == "TITL_OTHERS") {
    //   // $("#ContactGender").val("");
    //    $("#ContactGenderF").removeClass('active');
    //    $("#ContactGenderM").removeClass('active');
    //    $("#ContactGenderM").css("pointer-events", "auto");
    //    $("#ContactGenderF").css("pointer-events", "auto");
    //    $('#ContactGender').prop('readonly', false);
    //}
    if ($("#ContactGender").val() == "Male" && $("#MaritalStatus").val() == "696") {
        $("#MWPADiv").show();
    } else {
        $("#MWPADiv").hide();
    }
}

        function checkAgentValidation() {

            $('.Heading1').click(function (e) {
                if ($(this).attr('id') == 'hrefViewInput' || $(this).attr('id') == 'hrefPersonalInfo') {
                    $(this).next('.collapse').collapse('show');
                }
                else if (ValidatePersonalInformation()) {

                    if ($(this).attr('id') == 'submitSendPaymentlink' && $('#FinalSubmit').val() == "1") {
                        if ($('#FinalSubmit').val() == "1") {
                            $("#submitSendPaymentlink").prop('value', 'Please Wait...');
                            document.forms[0].submit();
                        }
                    }
                }
                else { $('#hrefProposalInfo').find("i.indicator").addClass('glyphs');
                    ExpandSection('hrefPersonalInfo', 'collapsetwo');
                    e.preventDefault(); e.stopPropagation();
                    return false;

                }
            });
        }

        function ValidatePersonalInformation() {

            var is_valid = 0;
            var $ContactTitle = $("#ContactTitle");
            var $ContactEmail = $("#ContactEmail");
            var $OccupationalDetailsOthers = $("#OccupationalDetailsOthers");
            var $OccupationalDetails = $("#OccupationalDetails");

            if ($ContactTitle.val() == 0) {
                $ContactTitle.addClass('Error'); is_valid = 1;
            }
            else {
                $("#error_ContactTitle").html("");
                $ContactTitle.removeClass('Error');
            }

            if ($ContactEmail.val() == '' || checkEmail($ContactEmail) == false) {

                $('#dvContactEmail').addClass('Error'); is_valid = 1;
            }
            else { $('#dvContactEmail').removeClass('Error'); }


            if (is_valid == 0) { $("#FinalSubmit").val("1"); return true; }
            else { return false; }
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

                    //case 'hrefHealthHistoryTravelDetails':
                    //    return ValidateControls('8');
                    //    break;
                case 'hrefnominee':
                    return ValidateControls('9');
                    break;

                case 'hrefContactInfo':
                    return ValidateControls('7');
                    break;

                case 'hrefMedicalQuestionnaire':
                    return ValidateControls('10');
                    break;

                case 'hrefCKYC':
                    return ValidateControls('12');
                    break;
                case 'hrefBankDetails':
                    return ValidateControls('13');
                    break;

                case 'submitSendPaymentlink':
                    return ValidateControls('14');
                    break;
                case 'hrefEIA':
                    return ValidateControls('15');
                    break;
                case 'hrefExistingPolicy':
                    return ValidateControls('16');

                case 'hrefCovidQuestionnaire':
                    return ValidateControls('17');

                case 'hrefLifeStyleQuestionnaire':
                    return ValidateControls('18');
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

            //Proposer Details

            var $ContactTitle = $("#ContactTitle");
            var $ContactFirstName = $("#ContactFirstName")
            var $ContactLastName = $("#ContactLastName");
            var $ContactDOB = $("#ContactDOB");
            var $MaritalStatus = $("#MaritalStatus");
            var $ContactMobile = $("#ContactMobile");
            var $ContactEmail = $("#ContactEmail");
            var $ProposerRelation = $("#ProposerRelation");
            var $ProposerResidentStatus = $("#ProposerResidentStatus");
            var $AadharNo = $("#AadharNo");
            var $PanNo = $("#PanNo");
            var $ContactGender = $("#ContactGender");
            var $ProposerEducation = $("#ProposerEducation");
            var $ContactIDProof = $("#ContactIDProof");
            var $ContactAddressProof = $("#ContactAddressProof");
            var $ContactIncomeProof = $("#ContactIncomeProof");
            var $ContactAgeProof = $("#ContactAgeProof");
            var $IndustryType = $("#IndustryType");
            var $ContactITProof = $("#ContactITProof");   //durgesh
            var $ProposerOthsersOccupationDescriptionf = $("#ProposerOthsersOccupationDescription"); //durgesh
           
            var $IndustryDescription = $("#IndustryDescription");
            var $ProposerOccupationalDetails = $("#ProposerOccupationalDetails");
            var $ProposerAnnualIncome = $("#ProposerAnnualIncome");
            var $AnnualIncome = $("#AnnualIncome");
            var $ProposerMyProfession = $("#ProposerMyProfession");
            var $ProposerNameOfOrganisation = $("#ProposerNameOfOrganisation");
            var $ProposerOrganistionNameDescription = $("#ProposerOrganistionNameDescription");
            var $ProposerOrganisationType = $("#ProposerOrganisationType");
            var $ProposerOccupationDescription = $("#ProposerOccupationDescription");
            //Insured Details

            var $InsuredTitle = $("#InsuredTitle");
            var $InsuredFirstName = $("#InsuredFirstName");
            var $InsuredLastName = $("#InsuredLastName");
            var $InsuredDOB = $("#InsuredDOB");
            var $InsuredMaritalStatus = $("#InsuredMaritalStatus");
            var $InsuredMobile = $("#InsuredMobile");
            var $InsuredMaritalStatus = $("#InsuredMaritalStatus");
            var $InsuredResidentStatus = $("#InsuredResidentStatus");
            var $InsuredAadharNo = $("#AadharNo");
            var $AadharNo = $("#InsuredAadharNo");
            var $InsuredEducationQualification = $("#InsuredEducationQualification");
            var $InsuredIDProof = $("#InsuredIDProof");
            var $InsuredAddressProof = $("#InsuredAddressProof");
            var $InsuredIncomeProof = $("#InsuredIncomeProof");
            var $InsuredAgeProof = $("#InsuredAgeProof");
            var $InsuredGender = $("#InsuredGender");
            var $OccupationalDetails = $("#OccupationalDetails");
            var $OccupationDescription = $("#OccupationDescription");
            var $OrganistionNameDescription = $("#OrganistionNameDescription");
            var $NameOfOrganisation = $("#NameOfOrganisation");
            var $OrganisationType = $("#OrganisationType");
            var $AnnualIncome = $("#AnnualIncome");


            var $MarriedWomensAct = $("#MarriedWomensAct");

            //Nominee Details

            var $NomineeFirstName = $("#NomineeFirstName");
            var $NomineeLastName = $("#NomineeLastName");
            var $NomineeDOB = $("#NomineeDOB");
            var $NomineeRelation = $("#NomineeRelation");
            var $NomineeGender = $("#NomineeGender");

            //Appointee fields
            var $AppointeeFirstName = $("#AppointeeFirstName");
            var $AppointeeLastName = $("#AppointeeLastName");
            var $AppointeeDOB = $("#AppointeeDOB");
            var $AppointeeRelation = $("#AppointeeRelationship");
            var $AppointeeGender = $("#AppointeeGender");



            //Beneficiary Details
            var $Beneficiary1FirstName = $("#Beneficiary1FirstName");
            var $Beneficiary1LastName = $("#Beneficiary1LastName");
            var $Beneficiary1RelationshipWithPropser = $("#Beneficiary1RelationshipWithPropser");
            var $Beneficiary1DOB = $("#Beneficiary1DOB");
            var $Beneficiary1Share = $("#Beneficiary1Share");

            var $Beneficiary2FirstName = $("#Beneficiary2FirstName");
            var $Beneficiary2LastName = $("#Beneficiary2LastName");
            var $Beneficiary2RelationshipWithPropser = $("#Beneficiary2RelationshipWithPropser");
            var $Beneficiary2DOB = $("#Beneficiary2DOB");
            var $Beneficiary2Share = $("#Beneficiary2Share");

            var $Beneficiary3FirstName = $("#Beneficiary3FirstName");
            var $Beneficiary3LastName = $("#Beneficiary3LastName");
            var $Beneficiary3RelationshipWithPropser = $("#Beneficiary3RelationshipWithPropser");
            var $Beneficiary3DOB = $("#Beneficiary3DOB");
            var $Beneficiary3Share = $("#Beneficiary3Share");

            var $Beneficiary4FirstName = $("#Beneficiary4FirstName");
            var $Beneficiary4LastName = $("#Beneficiary4LastName");
            var $Beneficiary4RelationshipWithPropser = $("#Beneficiary4RelationshipWithPropser");
            var $Beneficiary4DOB = $("#Beneficiary4DOB");
            var $Beneficiary4Share = $("#Beneficiary4Share");

            var $Beneficiary5FirstName = $("#Beneficiary5FirstName");
            var $Beneficiary5LastName = $("#Beneficiary5LastName");
            var $Beneficiary5RelationshipWithPropser = $("#Beneficiary5RelationshipWithPropser");
            var $Beneficiary5DOB = $("#Beneficiary5DOB");
            var $Beneficiary5Share = $("#Beneficiary5Share");

            var $Beneficiary6FirstName = $("#Beneficiary6FirstName");
            var $Beneficiary6LastName = $("#Beneficiary6LastName");
            var $Beneficiary6RelationshipWithPropser = $("#Beneficiary6RelationshipWithPropser");
            var $Beneficiary6DOB = $("#Beneficiary6DOB");
            var $Beneficiary6Share = $("#Beneficiary6Share");


            //Trustee fields
            var $Trustee1Type = $("#Trustee1Type");
            var $Trustee1Name = $("#Trustee1Name");
            var $Trustee1DOB = $("#Trustee1DOB");
            var $Trustee1Address = $("#Trustee1Address");
            var $Trustee1Pincode = $("#Trustee1Pincode");
            var $Trustee1State = $("#Trustee1State");
            var $Trustee1City = $("#Trustee1City");
            var $Trustee1CityID = $("#Trustee1CityID");

            var $Trustee2Type = $("#Trustee2Type");
            var $Trustee2Name = $("#Trustee2Name");
            var $Trustee2DOB = $("#Trustee2DOB");
            var $Trustee2Address = $("#Trustee2Address");
            var $Trustee2Pincode = $("#Trustee2Pincode");
            var $Trustee2State = $("#Trustee2State");
            var $Trustee2City = $("#Trustee2City");
            var $Trustee2CityID = $("#Trustee2CityID");

            var $Trustee3Type = $("#Trustee3Type");
            var $Trustee3Name = $("#Trustee3Name");
            var $Trustee3DOB = $("#Trustee3DOB");
            var $Trustee3Address = $("#Trustee3Address");
            var $Trustee3Pincode = $("#Trustee3Pincode");
            var $Trustee3State = $("#Trustee3State");
            var $Trustee3City = $("#Trustee3City");
            var $Trustee3CityID = $("#Trustee3CityID");

            var $Trustee4Type = $("#Trustee4Type");
            var $Trustee4Name = $("#Trustee4Name");
            var $Trustee4DOB = $("#Trustee4DOB");
            var $Trustee4Address = $("#Trustee4Address");
            var $Trustee4Pincode = $("#Trustee4Pincode");
            var $Trustee4State = $("#Trustee4State");
            var $Trustee4City = $("#Trustee4City");
            var $Trustee4CityID = $("#Trustee4CityID");

            var $Trustee5Type = $("#Trustee5Type");
            var $Trustee5Name = $("#Trustee5Name");
            var $Trustee5DOB = $("#Trustee5DOB");
            var $Trustee5Address = $("#Trustee5Address");
            var $Trustee5Pincode = $("#Trustee5Pincode");
            var $Trustee5State = $("#Trustee5State");
            var $Trustee5City = $("#Trustee5City");
            var $Trustee5CityID = $("#Trustee5CityID");

            var $Trustee6Type = $("#Trustee6Type");
            var $Trustee6Name = $("#Trustee6Name");
            var $Trustee6DOB = $("#Trustee6DOB");
            var $Trustee6Address = $("#Trustee6Address");
            var $Trustee6Pincode = $("#Trustee6Pincode");
            var $Trustee6State = $("#Trustee6State");
            var $Trustee6City = $("#Trustee6City");
            var $Trustee6CityID = $("#Trustee6CityID");


            //Contact Information
            var $ContactSTREETBUILDING = $("#ContactSTREETBUILDING");
            var $ContactHOUSEFLATNUMBER = $("#ContactHOUSEFLATNUMBER");
            var $ContactLine3 = $("#ContactLine3");
            var $ContactLandmark = $("#ContactLandmark");
            var $ContactPinCode = $("#ContactPinCode");
            var $ContactCityName = $("#ContactCityName");
            var $ContactState = $("#ContactState");

            var $PermanentContactHOUSEFLATNUMBER = $("#PermanentContactHOUSEFLATNUMBER");
            var $PermanentContactSTREETBUILDING = $("#PermanentContactSTREETBUILDING");
            var $PermanentLandmark = $("#PermanentLandmark");
            var $PermanentLine3 = $("#PermanentLine3");
            var $PermanentPinCode = $("#PermanentPinCode");
            var $PermanentCityName = $("#PermanentCityName");
            var $PermanentState = $("#PermanentState"); 
            var $Nationality = $("#Nationality"); 
            var $ResidentialStatus = $("#ResidentialStatus");
            var $PermanentHOUSEFLATNUMBER = $("#PermanentHOUSEFLATNUMBER"); 
            var $PermanentSTREETBUILDING = $("#PermanentSTREETBUILDING"); 
            //var $PermanentLine3 = $("#PermanentLine3");
            var $ContactLine3 = $("#ContactLine3");
            //Medical Question
            var $Height = $("#Height");
            var $Weight = $("#Weight");

            //EIA Details 
            var $EIA = $("#EIA"); 
            var $Insurancerepository = $("#Insurancerepository");
            var $IpruPolicy = $("#IpruPolicy");
            var $EIANo = $("#EIANo");

            //existing policy 
            var $ExistingPolicy = $("#ExistingPolicy"); 
            var $ExistingPolicySumAssured = $("#ExistingPolicySumAssured");
            var $cmpany = $("#cmpany"); 
            var $ExistingPolicyTotalAmount = $("#ExistingPolicyTotalAmount"); 
            //CKYC Details
            var $CKYCFatherTitle = $("#CKYCFatherTitle");
            var $CKYCFatherFirstName = $("#CKYCFatherFirstName");
            var $CKYCFatherMiddleName = $("#CKYCFatherMiddleName");
            var $CKYCFatherLastName = $("#CKYCFatherLastName");
            var $CKYCMotherTitle = $("#CKYCMotherTitle");
            var $CKYCMotherFirstName = $("#CKYCMotherFirstName");
            var $CKYCMotherMiddleName = $("#CKYCMotherMiddleName");
            var $CKYCMotherLastName = $("#CKYCMotherLastName");

            var $CKYCSpouseTitle = $("#CKYCSpouseTitle");
            var $CKYCSpouseFirstName = $("#CKYCSpouseFirstName");
            var $CKYCSpouseMiddleName = $("#CKYCSpouseMiddleName");
            var $CKYCSpouseLastName = $("#CKYCSpouseLastName");
            var $CKYCOccupationType = $("#CKYCOccupationType");
            var $CKYCCountryOfBirth = $("#CKYCCountryOfBirth");
            var $DrivingLicenseExpiry = $("#DrivingLicenseExpiry");
            var $ContactDocumentIDProof = $("#ContactDocumentIDProof");
            //bank details
            
            var $txtBankAccNo = $("#txtBankAccNo");
            var $txtBankName = $("#txtBankName");
            var $txtBankLoc = $("#txtBankLoc");
            var $txtBankIFSC = $("#txtBankIFSC"); 
            var $AccountType = $("#AccountType");
            var $MICRCode = $("#MICRCode");
            

            /*------------------------------Proposal Details Client Validations -------------------------------*/

            if (Opt == 0) {

                if ($("#ContactTitle option:selected").val() == 0 || $("#ContactTitle option:selected").val() == '') { $('#ContactTitle').addClass('Error'); is_valid = 1; }
                else { $('#ContactTitle').removeClass('Error'); }

                if ($ContactFirstName.val() == "" || checkTextWithSpace($ContactFirstName) == false) { $('#dvContactFirstName').addClass('Error'); is_valid = 1; }
                else {

                    var name = $("#ContactFirstName").val();
                    var ContactFirstName = name.replace('/\s\s/', ' ');
                    $("#ContactFirstName").val(ContactFirstName);
                    $("#ContactFirstName").removeClass('Error');
                }

                if ($('#ContactLastName').val() == "" || checkTextWithSpace($ContactLastName) == false) { $('#dvContactLastName').addClass('Error'); is_valid = 1; }
                else { $("#ContactLastName").removeClass('Error'); }

                if ($ContactDOB.val() == "") { $('#dvContactDOB').addClass('Error'); is_valid = 1; }
                else {

                    $('#dvContactDOB').removeClass('Error');
                }

                if ($("#MaritalStatus option:selected").val() == 0) { $MaritalStatus.addClass('Error'); is_valid = 1; }
                else { $MaritalStatus.removeClass('Error'); }


                if ($ContactMobile.val() == "" || checkMobile($ContactMobile) == false) {
                    $('#dvContactMobile').addClass('Error'); is_valid = 1;
                }
                else { $('#dvContactMobile').removeClass('Error'); }

                if ($ContactEmail.val() == '' || checkEmail($ContactEmail) == false) { $('#dvContactEmail').addClass('Error'); is_valid = 1; }
                else { $('#dvContactEmail').removeClass('Error'); }

                //if ($("#ProposerRelation option:selected").val() == 0 || $("#ProposerRelation option:selected").val() == '') { $('#ProposerRelation').addClass('Error'); is_valid = 1; }
                //else { $('#ProposerRelation').removeClass('Error'); }

                //if ($ProposerRelation.val() == "") {
                //    $('#spnProposerRelation').addClass('Error');
                //    is_valid = 1;
                //    $("#error_ContactGender").html("Please Select Gender.");
                //}
                //else {

                //    $('#spnProposerRelation').removeClass('Error');
                //    $("#error_ProposerRelation").html("");
                //}


                if ($ContactGender.val() == "") {
                    $('#ContactGender').addClass('Error');
                    is_valid = 1;
                    $("#error_ContactGender").html("Please Select Gender.");
                }
                else {

                    $('#ContactGender').removeClass('Error');
                    $("#error_ContactGender").html("");
                }

                //if ($InsuredAadharNo.val() == '') {    //durgesh
                //    $("#error_AadharNo").html("");
                //    $('#dvAadharNo').removeClass('Error');

                //}
                //else {


                //    if (($InsuredAadharNo).val() != '') {

                //        var AadharVal = $InsuredAadharNo.val();
                       
                //        var AadharPattern = /\d{12}/;
                //        var patternArray = AadharVal.match(AadharPattern);
                //        if (patternArray == null) {
                //            $('#dvAadharNo').addClass('Error');
                //            //$("#error_InsuredAadharNo").html("Please Enter Valid Aadhar No.");
                //            is_valid = 1;
                //        }
                //        else {
                //            $('#dvAadharNo').removeClass('Error');
                //            $("#error_AadharNo").html("");
                //        }
                //    }
                //    else {
                //        $('#dvAadharNo').removeClass('Error');
                //        $("#error_AadharNo").html("");
                //    }

                //}





                //if ($("#AadharNo").val() == "") { $("#dvAadharNo").addClass('Error'); is_valid = 1; }
                //else {
                //    var aadhar = $("#AadharNo").val();
                //    var pattern = /\d{12}/;
                //    if (aadhar.match(pattern) != null) {
                //        $("#AadharNo").removeClass('Error');
                //    }
                //    else {
                //        $("#dvAadharNo").addClass('Error'); is_valid = 1;
                //    }
                //}

                if ($('#PanNo').val() == '' || checkPAN($PanNo) == false) {   //durgesh
                    $('#dvPanNo').addClass('Error'); is_valid = 1;
                    //$("#error_PanNo").html("Please Enter Pan No.");
                }
                else {
                    $("#error_PanNo").html("");
                    $('#dvPanNo').removeClass('Error');
                }
            
                  
                                
                            

                //$PanNo = $('#PanNo').val().toUpperCase();
                //if ($('#PanNo').val() == '' || checkPAN($PanNo) == false) { $('#dvPanNo').addClass('Error'); is_valid = 1; }
                //else { $('#dvPanNo').removeClass('Error'); }

                if ($("#ProposerEducation option:selected").val() == 0) { $ProposerEducation.addClass('Error'); is_valid = 1; }
                else { $ProposerEducation.removeClass('Error'); }

                //if ($("#ContactIDProof option:selected").val() == 0) { $ContactIDProof.addClass('Error'); is_valid = 1; }
                //else { $ContactIDProof.removeClass('Error'); }
                if ($("#ContactIDProof option:selected").val() == 0) {

                    $("#ContactIDProof").addClass('Error');
                    //$("#error_ContactIDProof").html("Please select an option.");
                    is_valid = 1;

                }  else {

                    if ($ContactIDProof.val() == "Driving license") {


                        if ($DrivingLicenseExpiry.val() == "") {
                            $("#dvDrivingLicenseExpiry").addClass('Error');
                            //$("#error_DrivingLicenseExpiry").html("Please select Expiry Date.");
                            is_valid = 1;
                        }
                        else {
                            $("#dvDrivingLicenseExpiry").removeClass('Error');
                            //$("#error_DrivingLicenseExpiry").html("");

                        }
                    }

                    $("#ContactIDProof").removeClass('Error');
                    //$("#error_ContactIDProof").html("");
                }

                //if ($ContactIDProof.val() == " licenseDriving" ) {
                if ($ContactDocumentIDProof.val() == "" || $ContactDocumentIDProof.val() == null) {
                    $("#dvContactDocumentIDProof").addClass('Error');
                    //$("#error_DocumentId").html("Please Enter ID Proof Number.");
                    is_valid = 1;
                }
                else {
                    $("#dvContactDocumentIDProof").removeClass('Error');
                    //$("#error_DocumentId").html("");

                }

                //if ($('#industries').val() == "" || $('#industries').val() == null) {
                //    //$("#dvindustries").addClass('Error');
                //    if ($("#ProposerOccupationalDetails option:selected").val() == "SPVT" || $("#ProposerOccupationalDetails option:selected").val() == "BSEM" || $("#ProposerOccupationalDetails option:selected").val() == "SPRO") {
                //        $("#error_industries").html("Please Select Yes/No.");
                //        is_valid = 1;
                //    } 
                //    //$("#error_industries").html("Please Select Yes/No.");
                //    //is_valid = 1;
                //}
                //else {
                //    //$("#dvindustries").removeClass('Error');
                //    $("#error_industries").html("");

                //}


                //if ($("#NomineeRelation").val() == "" || $("#NomineeRelation").val() == null) {
                //    $("#NomineeRelation").addClass('Error');
                //    //$("#error_OraganizationType").html("Please select an option.");
                //    is_valid = 1;
                //} else {
                //    $("#NomineeRelation").removeClass('Error');
                //    $("#error_NomineeRelation").html("");
                //}



                if ($("#ContactAddressProof option:selected").val() == 0) { $ContactAddressProof.addClass('Error'); is_valid = 1; }
                else { $ContactAddressProof.removeClass('Error'); }

                if ($("#ContactIncomeProof option:selected").val() == 0) { $ContactIncomeProof.addClass('Error'); is_valid = 1; }
                else { $ContactIncomeProof.removeClass('Error'); }

                if ($("#ContactAgeProof option:selected").val() == 0) { $ContactAgeProof.addClass('Error'); is_valid = 1; }
                else { $ContactAgeProof.removeClass('Error'); }

                if ($("#ContactITProof option:selected").val() == 0) { $ContactITProof.addClass('Error'); is_valid = 1; }   //durgesh
                else { $ContactITProof.removeClass('Error'); }
                

                if ($("#ProposerOccupationalDetails option:selected").val() == "") { $('#ProposerOccupationalDetails').addClass('Error'); is_valid = 1; }
                else { $('#ProposerOccupationalDetails').removeClass('Error'); }

                if ($("#ProposerOccupationalDetails option:selected").val() == "HSWF" || $("#ProposerOccupationalDetails option:selected").val() == "STDN") {
                    //if ($('#InsuranceDetails').val() == "" || $('#InsuranceDetails').val() == null) {
                    //    $('#error_InsuranceDetails').html('Please Select'); is_valid = 1;
                    //} else {
                    //    $('#error_InsuranceDetails').html('');
                    //    if ($('#InsuranceDetails').val() == "Yes") {
                    //        if ($('#InsuranceDetailsSumAssured').val() == "" || $('#InsuranceDetailsSumAssured').val() == null) {
                    //            $('#dvInsuranceDetailsSumAssured').addClass('Error'); is_valid = 1;
                    //        } else {
                    //            $('#dvInsuranceDetailsSumAssured').removeClass('Error');
                    //        }
                    //        if ($('#InsuranceDetailscmpany').val() == "" || $('#InsuranceDetailscmpany').val() == null) {
                    //            $('#InsuranceDetailscmpany').addClass('Error'); is_valid = 1;
                    //        } else {
                    //            $('#InsuranceDetailscmpany').removeClass('Error');
                    //        }
                    //        if ($('#InsuranceDetailsTotalAmount').val() == "" || $('#InsuranceDetailsTotalAmount').val() == null) {
                    //            $('#dvInsuranceDetailsTotalAmount').addClass('Error'); is_valid = 1;
                    //        } else {
                    //            $('#dvInsuranceDetailsTotalAmount').removeClass('Error');
                    //        }
                    //    }
                    if ($("#ProposerOccupationalDetails option:selected").val() == "STDN") {
                        if ($('#ProposerParentAnnualIncome').val() == "" || $('#ProposerParentAnnualIncome').val() == null) {
                            $('#dvProposerParentAnnualIncome').addClass('Error');
                            $('#error_ProposerParentAnnualIncome').html('Please Enter Correct Amount.'); is_valid = 1;
                        } else {
                            $('#dvProposerParentAnnualIncome').removeClass('Error');
                            $('#error_ProposerParentAnnualIncome').html('');
                        }

                    }
                    if ($("#ProposerOccupationalDetails option:selected").val() == "HSWF") {
                        if ($('#ProposerHusbandAnnualIncome').val() == "" || $('#ProposerHusbandAnnualIncome').val() == null) {
                            $('#dvProposerHusbandAnnualIncome').addClass('Error');
                            $('#error_ProposerHusbandAnnualIncome').html('Please Enter Correct Amount.'); is_valid = 1;
                        } else {
                            $('#dvProposerHusbandAnnualIncome').removeClass('Error');
                            $('#error_ProposerHusbandAnnualIncome').html('');
                        }

                    }
                }
             
                
                

                if ($("#ProposerOccupationalDetails option:selected").val() == "SPVT" ) {
                    if ($("#ProposerNameOfOrganisation option:selected").val() == 0 || $("#ProposerNameOfOrganisation option:selected").val() == "") {
                        $('#ProposerNameOfOrganisation').addClass('Error'); is_valid = 1;
                    }
                    else { $('#ProposerNameOfOrganisation').removeClass('Error'); }

                    if ($("#ProposerOrganisationType option:selected").val() == 0 || $("#ProposerOrganisationType option:selected").val() == "") {
                        $('#ProposerOrganisationType').addClass('Error'); is_valid = 1;
                    }
                    else { $('#ProposerOrganisationType').removeClass('Error'); }

                    if ($('#industries').val() == "" || $('#industries').val() == null) {
                        //$("#dvindustries").addClass('Error');
                        if ($("#ProposerOccupationalDetails option:selected").val() == "SPVT" || $("#ProposerOccupationalDetails option:selected").val() == "BSEM" || $("#ProposerOccupationalDetails option:selected").val() == "SPRO") {
                            $("#error_industries").html("Please Select Yes/No.");
                            is_valid = 1;
                        }
                        //$("#error_industries").html("Please Select Yes/No.");
                        //is_valid = 1;
                    }
                    else {
                        //$("#dvindustries").removeClass('Error');
                        $("#error_industries").html("");

                    }

                    if ($('#industries').val() == "Yes") {
                        if ($("#IndustryType option:selected").val() == 0) { $IndustryType.addClass('Error'); is_valid = 1; }
                        else { $IndustryType.removeClass('Error'); }
                    }
                    //if ($IndustryDescription.val() == '') { $('#dvIndustryDescription').addClass('Error'); is_valid = 1; }
                    //else { $('#dvIndustryDescription').removeClass('Error'); }

                    if ($('#ProposerNameOfOrganisation').val() == "Others") {
                        if ($('#ProposerNameOfOrganisationDesc').val() == "" || $('#ProposerNameOfOrganisationDesc').val() == null) {
                            $('#dvProposerNameOfOrganisationDesc').addClass('Error');
                        } else {
                            $('#dvProposerNameOfOrganisationDesc').removeClass('Error');
                        }
                    } 
                    if ($('#ProposerOrganisationType').val() == "NOT ANSWERED") {
                        if ($('#ProposerOrganisationTypeDesc').val() == "" || $('#ProposerOrganisationTypeDesc').val() == null) {
                            $('#dvProposerOrganisationTypeDesc').addClass('Error');
                        } else {
                            $('#dvProposerOrganisationTypeDesc').removeClass('Error');
                        }
                    } 

                }

                if ($("#ProposerOccupationalDetails option:selected").val() == "SPRO") {
                    
                    if ($('#ProposerOthersNameOfOrganisation').val() == '' || $('#ProposerOthersNameOfOrganisation').val() == null)
                    { $('#ProposerOthersNameOfOrganisation').addClass('Error'); is_valid = 1; }
                    else
                    { $('#ProposerOthersNameOfOrganisation').removeClass('Error'); }

                    if ($('#ProposerOthsersOrganisationType').val() == '' || $('#ProposerOthsersOrganisationType').val() == null)
                    { $('#ProposerOthsersOrganisationType').addClass('Error'); is_valid = 1; }
                    else
                    { $('#ProposerOthsersOrganisationType').removeClass('Error'); }
                    if ($('#industries').val() == "" || $('#industries').val() == null) {
                        //$("#dvindustries").addClass('Error');
                        if ($("#ProposerOccupationalDetails option:selected").val() == "SPVT" || $("#ProposerOccupationalDetails option:selected").val() == "BSEM" || $("#ProposerOccupationalDetails option:selected").val() == "SPRO") {
                            $("#error_industries").html("Please Select Yes/No.");
                            is_valid = 1;
                        }
                        //$("#error_industries").html("Please Select Yes/No.");
                        //is_valid = 1;
                    }
                    else {
                        //$("#dvindustries").removeClass('Error');
                        $("#error_industries").html("");

                    }
                    
                    if ($('#ProposerOthsersOccupationDescriptionText').val() == "" || $('#ProposerOthsersOccupationDescriptionText').val() == null) {
                        $('#dvProposerOthsersOccupationDescriptionText').addClass('Error');
                    } else {
                        $('#dvProposerOthsersOccupationDescriptionText').removeClass('Error');
                    }
                    if ($('#industries').val() == "Yes") {
                        if ($("#IndustryType option:selected").val() == 0) { $IndustryType.addClass('Error'); is_valid = 1; }
                        else { $IndustryType.removeClass('Error'); }
                    }
                    //if ($IndustryDescription.val() == '') { $('#dvIndustryDescription').addClass('Error'); is_valid = 1; }
                    //else { $('#dvIndustryDescription').removeClass('Error'); }

                    if ($('#ProposerOthsersOrganisationType').val() == "NOT ANSWERED") {
                        if ($('#ProposerOthsersOrganisationTypeDescription').val() == "" || $('#ProposerOthsersOrganisationTypeDescription').val() == null) {
                            $('#dvProposerOthsersOrganisationTypeDescription').addClass('Error');
                        } else {
                            $('#dvProposerOthsersOrganisationTypeDescription').removeClass('Error');
                        }
                    } 
                    if ($('#ProposerOthersNameOfOrganisation').val() == "Others") {
                        if ($('#ProposerOthsersOccupationDescription').val() == "" || $('#ProposerOthsersOccupationDescription').val() == null) {
                            $('#dvProposerOthsersOccupationDescription').addClass('Error');
                        } else {
                            $('#dvProposerOthsersOccupationDescription').removeClass('Error');
                        }
                    } 
                }

                if ($("#ProposerOccupationalDetails option:selected").val() == "PROF") {
                    if ($("#ProposerMyProfession option:selected").val() == 0) { $('#ProposerMyProfession').addClass('Error'); is_valid = 1; }
                    else { $('#ProposerMyProfession').removeClass('Error'); }
                }

                if ($("#ProposerOccupationalDetails option:selected").val() == "BSEM") {
                    if ($('#ProposerSelfEmpNameOfOrganisation').val() == '' || $('#ProposerSelfEmpNameOfOrganisation').val() == null)
                    {
                        $('#ProposerSelfEmpNameOfOrganisation').addClass('Error'); is_valid = 1;
                    }
                    else
                    {
                        $('#ProposerSelfEmpNameOfOrganisation').removeClass('Error');
                    }
                    var $ProposerSelfEmpOrganistionNameDescription = $('#ProposerSelfEmpOrganistionNameDescription');
                    if ($('#ProposerSelfEmpOrganistionNameDescription').val() == '' || $('#ProposerSelfEmpOrganistionNameDescription').val() == null || checkTextWithSpace($ProposerSelfEmpOrganistionNameDescription) == false)
                    {
                        $('#dvProposerSelfEmpOrganistionNameDescription').addClass('Error'); is_valid = 1;
                    }
                    else {
                        $('#dvProposerSelfEmpOrganistionNameDescription').removeClass('Error');
                    }
                    if ($('#ProposerSelfEmpOrganisationType').val() == '' || $('#ProposerSelfEmpOrganisationType').val() == null)
                    {
                        $('#ProposerSelfEmpOrganisationType').addClass('Error'); is_valid = 1;
                    }
                    else {
                        $('#ProposerSelfEmpOrganisationType').removeClass('Error');
                    }
                    if ($('#industries').val() == "" || $('#industries').val() == null) {
                        //$("#dvindustries").addClass('Error');
                        if ($("#ProposerOccupationalDetails option:selected").val() == "SPVT" || $("#ProposerOccupationalDetails option:selected").val() == "BSEM" || $("#ProposerOccupationalDetails option:selected").val() == "SPRO") {
                            $("#error_industries").html("Please Select Yes/No.");
                            is_valid = 1;
                        }
                        //$("#error_industries").html("Please Select Yes/No.");
                        //is_valid = 1;
                    }
                    else {
                        //$("#dvindustries").removeClass('Error');
                        $("#error_industries").html("");

                    }

                    if ($('#industries').val() == "Yes") {
                        if ($("#IndustryType option:selected").val() == 0) { $IndustryType.addClass('Error'); is_valid = 1; }
                        else { $IndustryType.removeClass('Error'); }
                    }
                    //if ($IndustryDescription.val() == '') { $('#dvIndustryDescription').addClass('Error'); is_valid = 1; }
                    //else { $('#dvIndustryDescription').removeClass('Error'); }

                    if ($('#ProposerSelfEmpOrganisationType').val() == "NOT ANSWERED") {
                        if ($('#ProposerSelfEmpOrganisationTypeDesc').val() == "" || $('#ProposerSelfEmpOrganisationTypeDesc').val() == null) {
                            $('#dvProposerSelfEmpOrganisationTypeDesc').addClass('Error');
                        } else {
                            $('#dvProposerSelfEmpOrganisationTypeDesc').removeClass('Error');
                        }
                    } 
                }


                if ($ProposerAnnualIncome.val() == '') { $('#dvProposerAnnualIncome').addClass('Error'); is_valid = 1; }
                else { $('#dvProposerAnnualIncome').removeClass('Error'); }


                //if ($ProposerAnnualIncome.val() == '' || CheckWholeNumber($ProposerAnnualIncome) == false) { $('#dvProposerAnnualIncome').addClass('Error'); is_valid = 1; }
                //else { $('#dvProposerAnnualIncome').removeClass('Error'); }

                if (is_valid == 0) { return true; }
                else { return false; }
            }


            /*------------------------------Insured Details Client Validations start-------------------------------*/
            if (Opt == 1) {

                if ($("#ISLAPropoerSame").val() == "true") {
                    is_valid = 0;
                } else {
                    if ($("#InsuredTitle option:selected").val() == 0 || $("#InsuredTitle option:selected").val() == '') { $('#InsuredTitle').addClass('Error'); is_valid = 1; }
                    else { $('#InsuredTitle').removeClass('Error'); }

                    if ($InsuredFirstName.val() == "" || checkTextWithSpace($InsuredFirstName) == false) { $('#dvInsuredFirstName').addClass('Error'); is_valid = 1; }
                    else { $("#dvInsuredFirstName").removeClass('Error'); }

                    if ($InsuredLastName.val() == "" || checkTextWithSpace($InsuredLastName) == false) { $('#dvInsuredLastName').addClass('Error'); is_valid = 1; }
                    else { $("#dvInsuredLastName").removeClass('Error'); }

                    if ($InsuredDOB.val() == "") { $('#dvInsuredDOB').addClass('Error'); is_valid = 1; }
                    else {
                        //if ($("#InsuredAge").val() != '@Model.Age') {
                        //    $('#dvInsuredDOB').addClass('Error');
                        //    is_valid = 1;
                        //    alert("Please Select Valid DOB.");
                        //} else {
                        $('#dvInsuredDOB').removeClass('Error');
                    }
                    //}


                    if ($("#InsuredMaritalStatus option:selected").val() == 0) { $InsuredMaritalStatus.addClass('Error'); is_valid = 1; }
                    else { $InsuredMaritalStatus.removeClass('Error'); }

                    if ($InsuredMobile.val() == "" || checkMobile($InsuredMobile) == false) { $('#dvInsuredMobile').addClass('Error'); is_valid = 1; }
                    else { $('#dvInsuredMobile').removeClass('Error'); }




                    //if ($AadharNo.val() == '') {    //durgesh
                    //    $("#error_InsuredAadharNo").html("");
                    //    $('#dvInsuredAadharNo').removeClass('Error');

                    //}
                    //else {


                    //    if (($AadharNo).val() != '') {

                    //        var AadharVal = $AadharNo.val();

                    //        var AadharPattern = /\d{12}/;
                    //        var patternArray = AadharVal.match(AadharPattern);
                    //        if (patternArray == null) {
                    //            $('#dvInsuredAadharNo').addClass('Error');
                    //            //$("#error_InsuredAadharNo").html("Please Enter Valid Aadhar No.");
                    //            is_valid = 1;
                    //        }
                    //        else {
                    //            $('#dvInsuredAadharNo').removeClass('Error');
                    //            $("#error_InsuredAadharNo").html("");
                    //        }
                    //    }
                    //    else {
                    //        $('#dvInsuredAadharNo').removeClass('Error');
                    //        $("#error_InsuredAadharNo").html("");
                    //    }

                    //}
                   
                    if ($Nationality.val() == "" || $Nationality.val() == null) {
                        $('#Nationality').addClass('Error');
                        is_valid = 1;
                        //$("#error_dvNationality").html("Please Select Gender.");
                    }
                    else {

                        $('#Nationality').removeClass('Error');
                        $("#error_Nationality").html("");
                    }


                    if ($ResidentialStatus.val() == "" || $ResidentialStatus.val() == null) {
                        $('#ResidentialStatus').addClass('Error');
                        is_valid = 1;
                        //$("#error_dvNationality").html("Please Select Gender.");
                    }
                    else {

                        $('#ResidentialStatus').removeClass('Error');
                        $("#error_ResidentialStatus").html("");
                    }

                    if ($AnnualIncome.val() == "" || $AnnualIncome.val() == 0 || $AnnualIncome.val() == null) {
                        $('#dvAnnualIncome').addClass('Error'); is_valid = 1;
                    }
                    else {
                        $('#dvAnnualIncome').removeClass('Error');
                        $("#error_AnnualIncome").html("");
                    }

                    //if ($("#InsuredAadharNo").val() == "") { $("#dvInsuredAadharNo").addClass('Error'); is_valid = 1; }
                    //else {
                    //    var aadhar = $("#InsuredAadharNo").val();
                    //    var pattern = /\d{12}/;
                    //    if (aadhar.match(pattern) != null) {
                    //        $("#dvInsuredAadharNo").removeClass('Error');
                    //    }
                    //    else {
                    //        $("#dvInsuredAadharNo").addClass('Error'); is_valid = 1;
                    //    }
                    //}

                    if ($("#InsuredEducationQualification option:selected").val() == 0) { $InsuredEducationQualification.addClass('Error'); is_valid = 1; }
                    else { $InsuredEducationQualification.removeClass('Error'); }

                    if ($("#InsuredIDProof option:selected").val() == 0) { $InsuredIDProof.addClass('Error'); is_valid = 1; }
                    else { $InsuredIDProof.removeClass('Error'); }

                    if ($("#InsuredAddressProof option:selected").val() == 0) { $InsuredAddressProof.addClass('Error'); is_valid = 1; }
                    else { $InsuredAddressProof.removeClass('Error'); }

                    if ($("#InsuredIncomeProof option:selected").val() == 0) { $InsuredIncomeProof.addClass('Error'); is_valid = 1; }
                    else { $InsuredIncomeProof.removeClass('Error'); }

                    if ($("#InsuredAgeProof option:selected").val() == 0) { $InsuredAgeProof.addClass('Error'); is_valid = 1; }
                    else { $InsuredAgeProof.removeClass('Error'); }

                    if ($("#OccupationalDetails option:selected").val() == 0) { $OccupationalDetails.addClass('Error'); is_valid = 1; }
                    else { $OccupationalDetails.removeClass('Error'); }

                    if ($("#OccupationalDetails option:selected").val() == "SPVT") {
                        if ($("#NameOfOrganisation option:selected").val() == 0) { $('#NameOfOrganisation').addClass('Error'); is_valid = 1; }
                        else { $('#NameOfOrganisation').removeClass('Error'); }

                        if ($("#OrganisationType option:selected").val() == 0) { $('#OrganisationType').addClass('Error'); is_valid = 1; }
                        else { $('#OrganisationType').removeClass('Error'); }
                    }

                    if ($("#OccupationalDetails option:selected").val() == "SPRO") {
                        if ($OccupationDescription.val() == '') { $('#dvOccupationDescription').addClass('Error'); is_valid = 1; }
                        else { $('#dvOccupationDescription').removeClass('Error'); }

                        if ($('#OthersNameOfOrganisation').val() == '' || $('#OthersNameOfOrganisation').val() == null)
                        {
                            $('#OthersNameOfOrganisation').addClass('Error'); is_valid = 1;
                        }
                        else
                        {
                            $('#OthersNameOfOrganisation').removeClass('Error');
                        }
                        if ($('#OthersOrganisationType').val() == '' || $('#OthersOrganisationType').val() == null) {
                            $('#OthersOrganisationType').addClass('Error'); is_valid = 1;
                        }
                        else {
                            $('#OthersOrganisationType').removeClass('Error');
                        }
                    }

                    if ($("#OccupationalDetails option:selected").val() == "PROF") {
                        if ($("#MyProfession option:selected").val() == 0) { $('#MyProfession').addClass('Error'); is_valid = 1; }
                        else { $('#MyProfession').removeClass('Error'); }
                    }

                    if ($("#OccupationalDetails option:selected").val() == "BSEM") {
                        if ($OrganistionNameDescription.val() == '') { $('#dvOrganistionNameDescription').addClass('Error'); is_valid = 1; }
                        else { $('#dvOrganistionNameDescription').removeClass('Error'); }

                        if ($('#SelfOrganisationType').val() == '' || $('#SelfOrganisationType').val() == null) {
                            $('#SelfOrganisationType').addClass('Error'); is_valid = 1;
                        }
                        else {
                            $('#SelfOrganisationType').removeClass('Error');
                        }
                        if ($('#SelfNameOfOrganisation').val() == '' || $('#SelfNameOfOrganisation').val() == null) {
                            $('#SelfNameOfOrganisation').addClass('Error'); is_valid = 1;
                        }
                        else {
                            $('#SelfNameOfOrganisation').removeClass('Error');
                        }
                        
                    }


                    //if ($AnnualIncome.val() == '') { $('#dvAnnualIncome').addClass('Error'); is_valid = 1; }
                    //else { $('#dvAnnualIncome').removeClass('Error'); }
                }





                if (is_valid == 0) {

                    return true;
                }
                else { return false; }
            }

            //if (Opt > 1 && Opt < 7) {

            //    var k = Opt;
            //    var $MemberName = $("#Member" + k + "Name");
            //    var $MemberLastName = $("#Member" + k + "LastName");

            //    var $ProposerRelationId = $("#ProposerRelationId" + k);
            //    var $NomineeRelationID = $("#NomineeRelationID" + k);
            //    var $PassportMember = $("#PassportMember" + k);
            //    var $MemberNomineeName = $("#MemberNomineeName" + k);


            //    if ($PassportMember.val() == "" || checkPassport($PassportMember) == false) { $('#dvPassportMember' + k).addClass('Error'); is_valid = 1; }
            //    else { $('#dvPassportMember' + k).removeClass('Error'); }

            //    if ($MemberName.val() == "" || checkText($MemberName) == false) { $('#dvMember' + k + 'Name').addClass('Error'); is_valid = 1; }
            //    else { $('#dvMember' + k + 'Name').removeClass('Error'); }

            //    if ($MemberLastName.val() == "" || checkText($MemberLastName) == false) { $('#dvMember' + k + 'LastName').addClass('Error'); is_valid = 1; }
            //    else { $('#dvMember' + k + 'LastName').removeClass('Error'); }

            //    //if ($ProposerRelationId.val() == 0) { $ProposerRelationId.addClass('Error'); is_valid = 1; }
            //    //else { $ProposerRelationId.removeClass('Error'); }

            //    if ($NomineeRelationID.val() == 0) { $NomineeRelationID.addClass('Error'); is_valid = 1; }
            //    else { $NomineeRelationID.removeClass('Error'); }

            //    if ($MemberNomineeName.val() == "" || checkTextWithSpace($MemberNomineeName) == false) { $('#dvMemberNomineeName' + k).addClass('Error'); is_valid = 1; }
            //    else {
            //        var data = $MemberNomineeName.val();
            //        var arr = data.split(' ');
            //        if (arr[1] != null && arr[1] != "") { $('#dvMemberNomineeName' + k).removeClass('Error'); }
            //        else { $('#dvMemberNomineeName' + k).addClass('Error'); is_valid = 1; }
            //    }

            //    if (is_valid == 0) {

            //        return true;
            //    }
            //    else { return false; }

            //}

            /*-----------------Current/Communication Address Client Validations--------------------*/
            else if (Opt == 7) {

                if ($ContactHOUSEFLATNUMBER.val() == '' || checkAddress($ContactHOUSEFLATNUMBER) == false) {
                    $('#dvContactHOUSEFLATNUMBER').addClass('Error'); is_valid = 1;
                    $("#error_ContactHOUSEFLATNUMBER").html("Please Enter HOUSE/FLAT NUMBER.");
                }
                else {
                    //CheckAddressHDFC($ContactHOUSEFLATNUMBER);
                    $("#error_ContactHOUSEFLATNUMBER").html("");
                    $('#dvContactHOUSEFLATNUMBER').removeClass('Error');
                }


                if ($ContactSTREETBUILDING.val() == '' || checkAddress1($ContactSTREETBUILDING) == false) {
                    $('#dvContactSTREETBUILDING').addClass('Error'); is_valid = 1;
                    $("#error_ContactSTREETBUILDING").html("Please Enter Correct Address.");
                }
                else {
                    //CheckAddressHDFC($ContactSTREETBUILDING);
                    $("#error_ContactSTREETBUILDING").html("");
                    $('#dvContactSTREETBUILDING').removeClass('Error');
                    // $('#dvContactHOUSEFLATNUMBER').removeClass('Error');
                }
                if ($ContactLine3.val() == '') {    //durgesh
                    $("#error_ContactLine3").html("");
                    $('#dvContactLine3').removeClass('Error');

                }
                else {
                    if ($ContactLine3.val() == '' || checkAddress1($ContactLine3) == false) {
                        $('#dvContactLine3').addClass('Error'); is_valid = 1;
                        $("#error_ContactLine3").html("Please Enter Valid Address.");
                    }
                    else {
                        //CheckAddressHDFC($ContactSTREETBUILDING);
                        $("#error_ContactLine3").html("");
                        $('#dvContactLine3').removeClass('Error');
                        // $('#dvContactHOUSEFLATNUMBER').removeClass('Error');
                    }
                }
                //if ($ContactSTREETBUILDING.val() == '' || checkAddress($ContactSTREETBUILDING) == false) { $('#dvContactSTREETBUILDING').addClass('Error'); is_valid = 1; }
                //else { $('#dvContactSTREETBUILDING').removeClass('Error'); }

                if ($ContactPinCode.val() == "" || $ContactPinCode.val().length != 6 || $ContactPinCode.val() < 110000 || checkPincode($ContactPinCode) == false) {

                    $('#dvContactPinCode').addClass('Error'); is_valid = 1;
                    $("#error_ContactPinCode").html("Please Enter PinCode.");
                }
                else {
                    $("#error_ContactPinCode").html("");
                    $('#dvContactPinCode').removeClass('Error');
                }

                if ($ContactLandmark.val() == '' || checkAddress1($ContactLandmark) == false) {
                    $('#dvContactLandmark').addClass('Error'); is_valid = 1;
                    $("#error_ContactLandmark").html("Please Enter Landmark.");
                }
                else {
                    //CheckAddressHDFC($ContactLandmark);
                    $("#error_ContactLandmark").html("");
                    $('#dvContactLandmark').removeClass('Error');
                    // $('#dvContactHOUSEFLATNUMBER').removeClass('Error');
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
                if ($('#PermanentAddress').val() == '' || $('#PermanentAddress').val() == null) {
                    //$('#dvContactState').addClass('Error'); is_valid = 1;
                    $("#error_PermanentAddress").html("Select Yes/No."); is_valid = 1;
                }
                else {
                    $("#error_PermanentAddress").html("");
                    //$('#error_PermanentAddress').removeClass('Error');
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
                //                if ($EmployeeID.val() == '') {
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
                //                }

                //                //if ($YearlyIncome.val() == '' || CheckWholeNumber($YearlyIncome) == false) { $('#dvYearlyIncome').addClass('Error'); is_valid = 1; }
                //                //else { $('#dvYearlyIncome').removeClass('Error'); }

                //                //if ($("#SelectedQuote_NetPremium").val() > 100000) {

                //                //    if ($('#PanNo').val() == '' || checkPAN($PanNo) == false) {
                //                //        $('#dvPanNo').addClass('Error'); is_valid = 1;
                //                //        $("#error_PanNo").html("Please Enter Pan No.");
                //                //    }
                //                //    else {
                //                //        $("#error_PanNo").html("");
                //                //        $('#dvPanNo').removeClass('Error');
                //                //    }
                //                //}
                //                //else {
                //                //    if ($PanNo.val() != '') {

                //                //        if (checkPAN($PanNo.val().toUpperCase()) == false) { $('#dvPanNo').addClass('Error'); is_valid = 1; }
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
                //                if ($OccupationalDetailsBusiness.val() == '') {
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

                //if ($("#paddress").val() == '') {
                //    $('#divpaddress').addClass('Error'); is_valid = 1;
                //    $("#error_paddress").html("Please Select Yes/No.");
                //}
                //else {
                //    $("#error_paddress").html("");
                //    $('#divpaddress').removeClass('Error');
                if ($("#PermanentAddress").val() == "No") {
                  
                    if ($PermanentHOUSEFLATNUMBER.val() == '' || checkAddress1($PermanentHOUSEFLATNUMBER) == false) {
                        $('#dvPermanentHOUSEFLATNUMBER').addClass('Error'); is_valid = 1;
                        $("#error_PermanentHOUSEFLATNUMBER").html("Please Enter HOUSE/FLAT NUMBER.");
                        }
                        else {
                            //CheckAddressHDFC($PermanentContactHOUSEFLATNUMBER);
                        $("#error_PermanentHOUSEFLATNUMBER").html("");
                        $('#dvPermanentHOUSEFLATNUMBER').removeClass('Error');
                        }

                        //if ($PermanentContactHOUSEFLATNUMBER.val() == '' || checkAddress($PermanentContactHOUSEFLATNUMBER) == false) { $('#dvPermanentContactHOUSEFLATNUMBER').addClass('Error'); is_valid = 1; }
                        //else { $('#dvPermanentContactHOUSEFLATNUMBER').removeClass('Error'); }

                        //if ($PermanentContactSTREETBUILDING.val() == '' || checkAddress($PermanentContactSTREETBUILDING) == false) { $('#dvPermanentContactSTREETBUILDING').addClass('Error'); is_valid = 1; }
                        //else { $('#dvPermanentContactSTREETBUILDING').removeClass('Error'); }

                    if ($PermanentSTREETBUILDING.val() == '') {    //durgesh
                        $('#dvPermanentSTREETBUILDING').addClass('Error'); is_valid = 1;
                        $("#error_PermanentSTREETBUILDING").html("Please Enter Correct Address.");

                    }
                    else {
                        if ($PermanentSTREETBUILDING.val() == '' || checkAddress1($PermanentSTREETBUILDING) == false) {
                            $('#dvPermanentSTREETBUILDING').addClass('Error'); is_valid = 1;
                            $("#error_PermanentSTREETBUILDING").html("Please Enter Correct Address.");
                        }

                        else {
                            //CheckAddressHDFC($PermanentContactSTREETBUILDING);
                            $("#error_PermanentSTREETBUILDING").html("");
                            $('#dvPermanentSTREETBUILDING').removeClass('Error');
                        }
                    }


                    if ($PermanentLine3.val() == '') {    //durgesh
                        $("#error_PermanentLine3").html("");
                        $('#dvPermanentLine3').removeClass('Error');
                    }
                    else {
                        if ($PermanentLine3.val() == '' || checkAddress1($PermanentLine3) == false) {
                            $('#dvPermanentLine3').addClass('Error'); is_valid = 1;
                            $("#error_PermanentLine3").html("Please Enter Valid Address.");
                        }

                        else {
                            //CheckAddressHDFC($PermanentContactSTREETBUILDING);
                            $("#error_PermanentLine3").html("");
                            $('#dvPermanentLine3').removeClass('Error');
                        }
                    }
                        if ($PermanentPinCode.val() == "" || $PermanentPinCode.val().length != 6 || $PermanentPinCode.val() < 110000 || checkPincode($PermanentPinCode) == false) {
                            $('#dvPermanentPinCode').addClass('Error'); is_valid = 1;
                            $("#error_PermanentPinCode").html("Please Enter PinCode.");
                        }
                        else {
                            $("#error_PermanentPinCode").html("");
                            $('#dvPermanentPinCode').removeClass('Error');
                    }
                    if ($PermanentLandmark.val() == '') {    //durgesh
                        $('#dvPermanentLandmark').addClass('Error'); is_valid = 1;
                        $("#error_PermanentLandmark").html("Please Enter valid Landmark.");
                    }
                    else {

                        if ($PermanentLandmark.val() == '' || checkAddress1($PermanentLandmark) == false) {
                            $('#dvPermanentLandmark').addClass('Error'); is_valid = 1;
                            $("#error_PermanentLandmark").html("Please Enter valid Landmark.");
                        }
                        else {
                            //CheckAddressHDFC($PermanentLandmark);
                            $("#error_PermanentLandmark").html("");
                            $('#dvPermanentLandmark').removeClass('Error');
                        }
                    }

                   

                        if ($PermanentCityName.val() == '') {
                            $('#dvPermanentCityName').addClass('Error'); is_valid = 1;
                            $("#error_PermanentCityName").html("Please Enter City.");
                        }
                        else {
                            $("#error_PermanentCityName").html("");
                            $('#dvPermanentCityName').removeClass('Error');
                        }
                    if ($PermanentState.val() == '') {
                        $('#dvPermanentState').addClass('Error'); is_valid = 1;
                        $("#error_PermanentState").html("Please Enter State.");
                    }
                    else {
                        $("#error_PermanentState").html("");
                        $('#dvPermanentState').removeClass('Error');
                    }
                        //if ($PermanentStateName.val() == '') {
                        //    $('#dvPermanentStateName').addClass('Error'); is_valid = 1;
                        //    $("#error_PermanentStateName").html("Please Enter State.");
                        //}
                        //else {
                        //    $("#error_PermanentStateName").html("");
                        //    $('#dvPermanentStateName').removeClass('Error');
                        //}

                        //if ($PermanentPostOfficeId.val() == 0 || checkAddress($PermanentPostOfficeId) == false || $PermanentPostOfficeId.val() == "") { $PermanentPostOfficeId.addClass('Error'); is_valid = 1; }
                        //else { $PermanentPostOfficeId.removeClass('Error'); }
                    }


                

                //if ($CommPreference.val() == '' || $CommPreference.val() == null) {
                //    $('#CommPreference').addClass('Error'); is_valid = 1;
                //    $("#error_CommPreference").html("Please Enter Communication Preference.");
                //}
                //else {
                //    $("#error_CommPreference").html("");
                //    $('#CommPreference').removeClass('Error');
                //}



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

                /*------------------------------End Policy Client Validations ---------------------------*/
            else if (Opt == 9) {
                if ($('#MarriedWomensAct').val() == "No") {

                    //if ($NomineeFirstName.val() == "" || checkTextWithSpace($NomineeFirstName) == false) { $('#error_NomineeFirstName').addClass('Error'); is_valid = 1; }
                    //else { $('#error_NomineeFirstName').removeClass('Error'); }

                    //if ($NomineeLastName.val() == "" || checkTextWithSpace($NomineeLastName) == false) { $('#dvNomineeLastName').addClass('Error'); is_valid = 1; }
                    //else { $('#dvNomineeLastName').removeClass('Error'); }
                    //if ($NomineeLastName.val() == "" || checkTextWithSpace($NomineeLastName) == false) { $('#error_NomineeLastName').addClass('Error'); is_valid = 1; }
                    //else { $('#error_NomineeLastName').removeClass('Error'); }

                    //if ($NomineeDOB.val() == "") { $('#error_NomineeDOB').addClass('Error'); is_valid = 1; }
                    //else { $('#error_NomineeDOB').removeClass('Error'); }

                    //if ($("#NomineeRelation option:selected").val() == 0 || $("#NomineeRelation option:selected").val() == "") { $('#dvNomineeRelation').addClass('Error'); is_valid = 1; }
                    //else { $('#dvNomineeRelation').removeClass('Error'); }

                    if ($NomineeFirstName.val() == "" || checkTextWithSpace($NomineeFirstName) == false) {      //durgesh
                        $("#dvNomineeFirstName").addClass('Error');
                        //$("#error_NomineeFirstName").html("Please select an option.");
                        is_valid = 1;
                    } else {
                        $("#dvNomineeFirstName").removeClass('Error');
                        $("#error_NomineeFirstName").html("");
                    }

                    if ($NomineeLastName.val() == "" || checkTextWithSpace($NomineeLastName) == false) {      //durgesh
                        $("#dvNomineeLastName").addClass('Error');
                        //$("#error_NomineeLastName").html("Please select an option.");
                        is_valid = 1;
                    } else {
                        $("#dvNomineeLastName").removeClass('Error');
                        $("#error_NomineeLastName").html("");
                    }


                    if ($NomineeDOB.val() == "" || $("#NomineeDOB").val() == null) {    //durgesh
                        $("#dvNomineeDOB").addClass('Error');
                        //$("#error_NomineeDOB").html("Please select an option.");
                        is_valid = 1;
                    } else {
                        $("#dvNomineeDOB").removeClass('Error');
                        $("#error_NomineeDOB").html("");
                    }

                    if ($("#NomineeRelation").val() == "" || $("#NomineeRelation").val() == null) {      //durgesh
                        $("#NomineeRelation").addClass('Error');
                        //$("#error_NomineeRelation").html("Please select an option.");
                        is_valid = 1;
                    } else {
                        if ($("#MaritalStatus").val() == "697") {
                            if ($("#NomineeRelation").val() == "Brother in law" || $("#NomineeRelation").val() == "Sister in law" || $("#NomineeRelation").val() == "RNMLA_SPOU_CD" || $("#NomineeRelation").val() == "Wife") {
                                $("#NomineeRelation").addClass('Error');
                                alert("Please Select Valid Nominee Relation.")
                                is_valid = 1;
                            } else {
                                $("#NomineeRelation").removeClass('Error');
                                $("#error_NomineeRelation").html("");
                            }

                        } else {
                            $("#NomineeRelation").removeClass('Error');
                            $("#error_NomineeRelation").html("");
                        }
                       
                    }

                    //if ($NomineeGender.val() == '') { $('#divNomineeGender').addClass('Error'); is_valid = 1; }
                    //else { $('#divNomineeGender').removeClass('Error'); }

                    if ($NomineeGender.val() == '') {
                        $('#NomineeGender').addClass('Error');
                        is_valid = 1;
                        $("#error_NomineeGender").html("Please Select Option.");
                    }
                    else {
                        $("#error_NomineeGender").html("");
                        $('#NomineeGender').removeClass('Error');
                    }


                    if ($("#agenominee1").val() < 216) {

                        if ($AppointeeFirstName.val() == "" || checkTextWithSpace($AppointeeFirstName) == false) { $('#dvAppointeeFirstName').addClass('Error'); is_valid = 1; }
                        else { $('#dvAppointeeFirstName').removeClass('Error'); }

                        if ($AppointeeLastName.val() == "" || checkTextWithSpace($AppointeeLastName) == false) { $('#dvAppointeeLastName').addClass('Error'); is_valid = 1; }
                        else { $('#dvAppointeeLastName').removeClass('Error'); }

                        if ($AppointeeDOB.val() == "") { $('#dvAppointeeDOB').addClass('Error'); is_valid = 1; }
                        else { $('#dvAppointeeDOB').removeClass('Error'); }

                        //if ($("#AppointeeRelationship option:selected").val() == 0 || $("#AppointeeRelationship option:selected").val() == '') { $('#dvAppointeeRelationship').addClass('Error'); is_valid = 1; }
                        //else { $('#dvAppointeeRelationship').removeClass('Error'); }

                        if ($("#AppointeeRelationship").val() == "" || $("#AppointeeRelationship").val() == null) {      //durgesh
                            $("#AppointeeRelationship").addClass('Error');
                            //$("#error_NomineeRelation").html("Please select an option.");
                            is_valid = 1;
                        } else {
                            $("#AppointeeRelationship").removeClass('Error');
                            $("#error_AppointeeRelationship").html("");
                        }

                        if ($AppointeeGender.val() == '') {
                            $('#AppointeeGender').addClass('Error');
                            is_valid = 1;
                            $("#error_AppointeeGender").html("Please Select Option.");
                        }
                        else {
                            $("#error_AppointeeGender").html("");
                            $('#AppointeeGender').removeClass('Error');
                        }


                        //if ($AppointeeGender.val() == '') { $('#divAppointeeGender').addClass('Error'); is_valid = 1; }
                        //else { $('#divAppointeeGender').removeClass('Error'); }
                    }


                }

                else {

                    var Beneficiarycount = $("#BenficiaryCount").val();
                    if (Beneficiarycount == 1) {
                        if ($Beneficiary1FirstName.val() == "" || checkTextWithSpace($Beneficiary1FirstName) == false) { $('#dvBeneficiary1FirstName').addClass('Error'); is_valid = 1; }
                        else { $('#dvBeneficiary1FirstName').removeClass('Error'); }

                        if ($Beneficiary1LastName.val() == "" || checkTextWithSpace($Beneficiary1LastName) == false) { $('#dvBeneficiary1LastName').addClass('Error'); is_valid = 1; }
                        else { $('#dvBeneficiary1LastName').removeClass('Error'); }

                        if ($("#Beneficiary1RelationshipWithPropser option:selected").val() == 0 || $("#Beneficiary1RelationshipWithPropser option:selected").val() == '') { $('#Beneficiary1RelationshipWithPropser').addClass('Error'); is_valid = 1; }
                        else { $('#Beneficiary1RelationshipWithPropser').removeClass('Error'); }

                        if ($Beneficiary1DOB.val() == "") { $('#dvBeneficiary1DOB').addClass('Error'); is_valid = 1; }
                        else { $('#dvBeneficiary1DOB').removeClass('Error'); }

                        if ($Beneficiary1Share.val() == "" || $Beneficiary1Share.val() == "0") { $('#dvBeneficiary1Share').addClass('Error'); is_valid = 1; }
                        else { $('#dvBeneficiary1Share').removeClass('Error'); }

                    }

                    if (Beneficiarycount == 2) {
                        if ($Beneficiary2FirstName.val() == "" || checkTextWithSpace($Beneficiary2FirstName) == false) { $('#dvBeneficiary2FirstName').addClass('Error'); is_valid = 1; }
                        else { $('#dvBeneficiary2FirstName').removeClass('Error'); }

                        if ($Beneficiary2LastName.val() == "" || checkTextWithSpace($Beneficiary2LastName) == false) { $('#dvBeneficiary2LastName').addClass('Error'); is_valid = 1; }
                        else { $('#dvBeneficiary2LastName').removeClass('Error'); }

                        if ($("#Beneficiary2RelationshipWithPropser option:selected").val() == 0 || $("#Beneficiary2RelationshipWithPropser option:selected").val() == '') { $('#Beneficiary2RelationshipWithPropser').addClass('Error'); is_valid = 1; }
                        else { $('#Beneficiary2RelationshipWithPropser').removeClass('Error'); }

                        if ($Beneficiary2DOB.val() == "") { $('#dvBeneficiary2DOB').addClass('Error'); is_valid = 1; }
                        else { $('#dvBeneficiary1DOB').removeClass('Error'); }

                        if ($Beneficiary2Share.val() == "" || $Beneficiary2Share.val() == "0") { $('#dvBeneficiary2Share').addClass('Error'); is_valid = 1; }
                        else { $('#dvBeneficiary2Share').removeClass('Error'); }

                    }
                    if (Beneficiarycount == 3) {
                        if ($Beneficiary3FirstName.val() == "" || checkTextWithSpace($Beneficiary3FirstName) == false) { $('#dvBeneficiary3FirstName').addClass('Error'); is_valid = 1; }
                        else { $('#dvBeneficiary3FirstName').removeClass('Error'); }

                        if ($Beneficiary3LastName.val() == "" || checkTextWithSpace($Beneficiary3LastName) == false) { $('#dvBeneficiary3LastName').addClass('Error'); is_valid = 1; }
                        else { $('#dvBeneficiary3LastName').removeClass('Error'); }

                        if ($("#Beneficiary3RelationshipWithPropser option:selected").val() == 0 || $("#Beneficiary3RelationshipWithPropser option:selected").val() == '') { $('#Beneficiary3RelationshipWithPropser').addClass('Error'); is_valid = 1; }
                        else { $('#Beneficiary3RelationshipWithPropser').removeClass('Error'); }

                        if ($Beneficiary3DOB.val() == "") { $('#dvBeneficiary3DOB').addClass('Error'); is_valid = 1; }
                        else { $('#dvBeneficiary1DOB').removeClass('Error'); }

                        if ($Beneficiary3Share.val() == "" || $Beneficiary3Share.val() == "0") { $('#dvBeneficiary3Share').addClass('Error'); is_valid = 1; }
                        else { $('#dvBeneficiary3Share').removeClass('Error'); }

                    }
                    if (Beneficiarycount == 4) {
                        if ($Beneficiary4FirstName.val() == "" || checkTextWithSpace($Beneficiary4FirstName) == false) { $('#dvBeneficiary4FirstName').addClass('Error'); is_valid = 1; }
                        else { $('#dvBeneficiary4FirstName').removeClass('Error'); }

                        if ($Beneficiary4LastName.val() == "" || checkTextWithSpace($Beneficiary4LastName) == false) { $('#dvBeneficiary4LastName').addClass('Error'); is_valid = 1; }
                        else { $('#dvBeneficiary4LastName').removeClass('Error'); }

                        if ($("#Beneficiary4RelationshipWithPropser option:selected").val() == 0 || $("#Beneficiary4RelationshipWithPropser option:selected").val() == '') { $('#Beneficiary4RelationshipWithPropser').addClass('Error'); is_valid = 1; }
                        else { $('#Beneficiary4RelationshipWithPropser').removeClass('Error'); }

                        if ($Beneficiary4DOB.val() == "") { $('#dvBeneficiary4DOB').addClass('Error'); is_valid = 1; }
                        else { $('#dvBeneficiary1DOB').removeClass('Error'); }

                        if ($Beneficiary4Share.val() == "" || $Beneficiary4Share.val() == "0") { $('#dvBeneficiary4Share').addClass('Error'); is_valid = 1; }
                        else { $('#dvBeneficiary4Share').removeClass('Error'); }

                    }
                    if (Beneficiarycount == 5) {
                        if ($Beneficiary5FirstName.val() == "" || checkTextWithSpace($Beneficiary5FirstName) == false) { $('#dvBeneficiary5FirstName').addClass('Error'); is_valid = 1; }
                        else { $('#dvBeneficiary5FirstName').removeClass('Error'); }

                        if ($Beneficiary5LastName.val() == "" || checkTextWithSpace($Beneficiary5LastName) == false) { $('#dvBeneficiary5LastName').addClass('Error'); is_valid = 1; }
                        else { $('#dvBeneficiary5LastName').removeClass('Error'); }

                        if ($("#Beneficiary5RelationshipWithPropser option:selected").val() == 0 || $("#Beneficiary5RelationshipWithPropser option:selected").val() == '') { $('#Beneficiary5RelationshipWithPropser').addClass('Error'); is_valid = 1; }
                        else { $('#Beneficiary5RelationshipWithPropser').removeClass('Error'); }

                        if ($Beneficiary5DOB.val() == "") { $('#dvBeneficiary5DOB').addClass('Error'); is_valid = 1; }
                        else { $('#dvBeneficiary1DOB').removeClass('Error'); }

                        if ($Beneficiary5Share.val() == "" || $Beneficiary5Share.val() == "0") { $('#dvBeneficiary5Share').addClass('Error'); is_valid = 1; }
                        else { $('#dvBeneficiary5Share').removeClass('Error'); }

                    }
                    if (Beneficiarycount == 6) {
                        if ($Beneficiary6FirstName.val() == "" || checkTextWithSpace($Beneficiary6FirstName) == false) { $('#dvBeneficiary6FirstName').addClass('Error'); is_valid = 1; }
                        else { $('#dvBeneficiary6FirstName').removeClass('Error'); }

                        if ($Beneficiary6LastName.val() == "" || checkTextWithSpace($Beneficiary6LastName) == false) { $('#dvBeneficiary6LastName').addClass('Error'); is_valid = 1; }
                        else { $('#dvBeneficiary6LastName').removeClass('Error'); }

                        if ($("#Beneficiary6RelationshipWithPropser option:selected").val() == 0 || $("#Beneficiary6RelationshipWithPropser option:selected").val() == '') { $('#Beneficiary6RelationshipWithPropser').addClass('Error'); is_valid = 1; }
                        else { $('#Beneficiary6RelationshipWithPropser').removeClass('Error'); }

                        if ($Beneficiary6DOB.val() == "") { $('#dvBeneficiary6DOB').addClass('Error'); is_valid = 1; }
                        else { $('#dvBeneficiary1DOB').removeClass('Error'); }

                        if ($Beneficiary6Share.val() == "" || $Beneficiary6Share.val() == "0") { $('#dvBeneficiary6Share').addClass('Error'); is_valid = 1; }
                        else { $('#dvBeneficiary6Share').removeClass('Error'); }

                    }

                    var TrusteeCount = $("#TrusteeCount").val();
                    if (TrusteeCount == 1) {
                        if ($("#Trustee1Type option:selected").val() == 0 || $("#Trustee1Type option:selected").val() == '') { $('#Trustee1Type').addClass('Error'); is_valid = 1; }
                        else { $('#Trustee1Type').removeClass('Error'); }

                        if ($Trustee1Name.val() == "" || checkTextWithSpace($Trustee1Name) == false) { $('#dvTrustee1Name').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee1Name').removeClass('Error'); }

                        if ($Trustee1DOB.val() == "") { $('#dvTrustee1DOB').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee1DOB').removeClass('Error'); }

                        if ($Trustee1Address.val() == "") { $('#dvTrustee1Address').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee1Address').removeClass('Error'); }

                        if ($Trustee1Pincode.val() == "" || $Trustee1Pincode.val() == "0") { $('#dvTrustee1Pincode').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee1Pincode').removeClass('Error'); }

                        if ($Trustee1City.val() == "") { $('#dvTrustee1City').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee1City').removeClass('Error'); }

                        if ($Trustee1CityID.val() == "") { $('#dvTrustee1City').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee1City').removeClass('Error'); }

                        if ($Trustee1State.val() == "") { $('#dvTrustee1State').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee1State').removeClass('Error'); }

                    }

                    var TrusteeCount = $("#TrusteeCount").val();
                    if (TrusteeCount == 2) {
                        if ($("#Trustee2Type option:selected").val() == 0 || $("#Trustee2Type option:selected").val() == '') { $('#Trustee2Type').addClass('Error'); is_valid = 1; }
                        else { $('#TrusteeType').removeClass('Error'); }
                        if ($Trustee2Name.val() == "" || checkTextWithSpace($Trustee1Name) == false) { $('#dvTrustee2Name').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee2Name').removeClass('Error'); }

                        if ($Trustee2DOB.val() == "") { $('#dvTrustee2DOB').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee2DOB').removeClass('Error'); }

                        if ($Trustee2Address.val() == "") { $('#dvTrustee2Address').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee2Address').removeClass('Error'); }

                        if ($Trustee2Pincode.val() == "" || $Trustee2Pincode.val() == "0") { $('#dvTrustee2Pincode').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee2Pincode').removeClass('Error'); }

                        if ($Trustee2City.val() == "") { $('#dvTrustee2City').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee2City').removeClass('Error'); }

                        if ($Trustee2CityID.val() == "") { $('#dvTrustee2City').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee2City').removeClass('Error'); }

                        if ($Trustee2State.val() == "") { $('#dvTrustee2State').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee2State').removeClass('Error'); }
                    }



                    if (TrusteeCount == 3) {
                        if ($("#Trustee3Type option:selected").val() == 0 || $("#Trustee3Type option:selected").val() == '') { $('#Trustee3Type').addClass('Error'); is_valid = 1; }
                        else { $('#TrusteeType').removeClass('Error'); }
                        if ($Trustee3Name.val() == "" || checkTextWithSpace($Trustee1Name) == false) { $('#dvTrustee3Name').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee3Name').removeClass('Error'); }

                        if ($Trustee3DOB.val() == "") { $('#dvTrustee3DOB').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee3DOB').removeClass('Error'); }

                        if ($Trustee3Address.val() == "") { $('#dvTrustee3Address').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee3Address').removeClass('Error'); }

                        if ($Trustee3Pincode.val() == "" || $Trustee3Pincode.val() == "0") { $('#dvTrustee3Pincode').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee3Pincode').removeClass('Error'); }

                        if ($Trustee3City.val() == "") { $('#dvTrustee3City').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee3City').removeClass('Error'); }

                        if ($Trustee3CityID.val() == "") { $('#dvTrustee3City').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee3City').removeClass('Error'); }

                        if ($Trustee3State.val() == "") { $('#dvTrustee3State').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee3State').removeClass('Error'); }
                    }


                    if (TrusteeCount == 4) {
                        if ($("#Trustee4Type option:selected").val() == 0 || $("#Trustee4Type option:selected").val() == '') { $('#Trustee4Type').addClass('Error'); is_valid = 1; }
                        else { $('#TrusteeType').removeClass('Error'); }
                        if ($Trustee4Name.val() == "" || checkTextWithSpace($Trustee1Name) == false) { $('#dvTrustee4Name').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee4Name').removeClass('Error'); }

                        if ($Trustee4DOB.val() == "") { $('#dvTrustee4DOB').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee4DOB').removeClass('Error'); }

                        if ($Trustee4Address.val() == "") { $('#dvTrustee4Address').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee4Address').removeClass('Error'); }

                        if ($Trustee4Pincode.val() == "" || $Trustee4Pincode.val() == "0") { $('#dvTrustee4Pincode').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee4Pincode').removeClass('Error'); }

                        if ($Trustee4City.val() == "") { $('#dvTrustee4City').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee4City').removeClass('Error'); }

                        if ($Trustee4CityID.val() == "") { $('#dvTrustee4City').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee4City').removeClass('Error'); }

                        if ($Trustee4State.val() == "") { $('#dvTrustee4State').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee4State').removeClass('Error'); }
                    }
                    if (TrusteeCount == 5) {
                        if ($("#Trustee5Type option:selected").val() == 0 || $("#Trustee5Type option:selected").val() == '') { $('#Trustee5Type').addClass('Error'); is_valid = 1; }
                        else { $('#TrusteeType').removeClass('Error'); }
                        if ($Trustee5Name.val() == "" || checkTextWithSpace($Trustee1Name) == false) { $('#dvTrustee5Name').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee5Name').removeClass('Error'); }

                        if ($Trustee5DOB.val() == "") { $('#dvTrustee5DOB').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee5DOB').removeClass('Error'); }

                        if ($Trustee5Address.val() == "") { $('#dvTrustee5Address').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee5Address').removeClass('Error'); }

                        if ($Trustee5Pincode.val() == "" || $Trustee5Pincode.val() == "0") { $('#dvTrustee5Pincode').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee5Pincode').removeClass('Error'); }

                        if ($Trustee5City.val() == "") { $('#dvTrustee5City').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee5City').removeClass('Error'); }

                        if ($Trustee5CityID.val() == "") { $('#dvTrustee5City').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee5City').removeClass('Error'); }

                        if ($Trustee5State.val() == "") { $('#dvTrustee5State').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee5State').removeClass('Error'); }
                    }
                    if (TrusteeCount == 6) {
                        if ($("#Trustee6Type option:selected").val() == 0 || $("#Trustee6Type option:selected").val() == '') { $('#Trustee6Type').addClass('Error'); is_valid = 1; }
                        else { $('#TrusteeType').removeClass('Error'); }
                        if ($Trustee6Name.val() == "" || checkTextWithSpace($Trustee1Name) == false) { $('#dvTrustee6Name').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee6Name').removeClass('Error'); }

                        if ($Trustee6DOB.val() == "") { $('#dvTrustee6DOB').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee6DOB').removeClass('Error'); }

                        if ($Trustee6Address.val() == "") { $('#dvTrustee6Address').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee6Address').removeClass('Error'); }

                        if ($Trustee6Pincode.val() == "" || $Trustee6Pincode.val() == "0") { $('#dvTrustee6Pincode').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee6Pincode').removeClass('Error'); }

                        if ($Trustee6City.val() == "") { $('#dvTrustee6City').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee6City').removeClass('Error'); }

                        if ($Trustee6CityID.val() == "") { $('#dvTrustee6City').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee6City').removeClass('Error'); }

                        if ($Trustee6State.val() == "") { $('#dvTrustee6State').addClass('Error'); is_valid = 1; }
                        else { $('#dvTrustee6State').removeClass('Error'); }
                    }
                }
                if (is_valid < 1) { return true; }
                else { return false; }
            }
            else if (Opt == 18) {

                if ($("#HQ05").val() == "" || $("#HQ05").val() == null) {
                    $("#error_HQ05").html('Select Yes/No');
                    is_valid = 1;
                }
                else {
                    $("#error_HQ05").html('');
                    if ($("#HQ05").val() == 'Yes') {
                        if ($("#TobaccoConsumeAs").val() == "" || $("#TobaccoConsumeAs").val() == null) {
                            $("#TobaccoConsumeAs").addClass('Error');
                            $("#error_TobaccoConsumeAs").val('Please Select'); is_valid = 1;
                        } else {
                            $("#TobaccoConsumeAs").removeClass('Error');
                            $("#error_TobaccoConsumeAs").val('');
                        }
                        if ($("#TobaccoQuantity").val() == "" || $("#TobaccoQuantity").val() == null) {
                            $("#TobaccoQuantity").addClass('Error');
                            $("#error_TobaccoQuantity").val('Please Select'); is_valid = 1;
                        } else {
                            $("#TobaccoQuantity").removeClass('Error');
                            $("#error_TobaccoQuantity").val('');
                        }
                        if ($("#TobaccoYears").val() == "" || $("#TobaccoYears").val() == null || $("#TobaccoYears").val() == '0') {
                            $("#dvTobaccoYears").addClass('Error'); is_valid = 1;
                            $("#error_TobaccoYears").val('Please Select');
                        } else {
                            $("#TobaccoQuantity").removeClass('Error');
                            $("#error_TobaccoYears").val('');
                        }
                    }
                }


                if ($("#HQ06").val() == "" || $("#HQ06").val() == null) {
                    $("#error_HQ06").html('Select Yes/No');
                    is_valid = 1;
                }
                else {
                    $("#error_HQ06").html('');
                    if ($("#HQ06").val() == 'Yes') {
                        if ($("#AlcoholConsumeAs").val() == "" || $("#AlcoholConsumeAs").val() == null) {
                            $("#AlcoholConsumeAs").addClass('Error');
                            $("#error_AlcoholConsumeAs").val('Please Select'); is_valid = 1;
                        } else {
                            $("#AlcoholConsumeAs").removeClass('Error');
                            $("#error_AlcoholConsumeAs").val('');
                        }
                        if ($("#AlcoholQuantity").val() == "" || $("#AlcoholQuantity").val() == null) {
                            $("#AlcoholQuantity").addClass('Error');
                            $("#error_AlcoholQuantity").val('Please Select'); is_valid = 1;
                        } else {
                            $("#AlcoholQuantity").removeClass('Error');
                            $("#error_AlcoholQuantity").val('');
                        }
                        if ($("#AlcoholYears").val() == "" || $("#AlcoholYears").val() == null || $("#AlcoholYears").val() == '0') {
                            $("#dvAlcoholYears").addClass('Error'); is_valid = 1;
                            $("#error_AlcoholYears").val('Please Select');
                        } else {
                            $("#AlcoholYears").removeClass('Error');
                            $("#error_AlcoholYears").val('');
                        }
                    }
                }

                if ($("#HQ07").val() == "" || $("#HQ07").val() == null) {
                    $("#error_HQ07").html('Select Yes/No');
                    is_valid = 1;
                } else {
                    $("#error_HQ07").html('');
                }

                if ($("#HQ09").val() == "" || $("#HQ09").val() == null) {
                    $("#error_HQ09").html('Select Yes/No');
                    is_valid = 1;
                } else {
                    $("#error_HQ09").html('');
                    if ($("#HQ09").val() == "Yes") {
                        if ($("#RemarkHQ09").val() == null || $("#RemarkHQ09").val() == "") {
                            $("#error_RemarkHQ09").html('Enter text');
                            $("#dvRemarkHQ09").addClass('Error');
                            is_valid = 1;
                        } else {
                            $("#error_RemarkHQ09").html('');
                            $("#dvRemarkHQ09").removeClass('Error');
                        }
                    }
                }

                if ($("#HQ125").val() == "" || $("#HQ125").val() == null) {
                    $("#error_HQ125").html('Select Yes/No');
                    is_valid = 1;
                } else {
                    $("#error_HQ125").html('');
                    if ($("#HQ125").val() == "Yes") {
                        if ($("#RemarkHQ125").val() == null || $("#RemarkHQ125").val() == "") {
                            $("#error_RemarkHQ125").html('Enter text');
                            $("#dvRemarkHQ125").addClass('Error');
                            is_valid = 1;
                        } else {
                            $("#error_RemarkHQ125").html('');
                            $("#dvRemarkHQ125").removeClass('Error');
                        }
                    }
                }

                if (is_valid < 1) { return true; }
                else { return false; }
            }

            else if (Opt == 10) {
                if ($Height.val() == "" || $Height.val() == null) { $('#ddlLAHeight').addClass('Error'); is_valid = 1; }
                else { $('#ddlLAHeight').removeClass('Error'); }

                if ($Weight.val() == '') { $('#dvWeight').addClass('Error'); is_valid = 1; }
                else { $('#dvWeight').removeClass('Error'); }


                //if ($("#HQ05").val() == "" || $("#HQ05").val() == null) {
                //    $("#error_HQ05").html('Select Yes/No');
                //    is_valid = 1;
                //}
                //else {
                //    $("#error_HQ05").html('');
                //    if ($("#HQ05").val() == 'Yes') {
                //        if ($("#TobaccoConsumeAs").val() == "" || $("#TobaccoConsumeAs").val() == null) {
                //            $("#TobaccoConsumeAs").addClass('Error');
                //            $("#error_TobaccoConsumeAs").val('Please Select'); is_valid = 1;
                //        } else {
                //            $("#TobaccoConsumeAs").removeClass('Error');
                //            $("#error_TobaccoConsumeAs").val('');
                //        }
                //        if ($("#TobaccoQuantity").val() == "" || $("#TobaccoQuantity").val() == null) {
                //            $("#TobaccoQuantity").addClass('Error');
                //            $("#error_TobaccoQuantity").val('Please Select'); is_valid = 1;
                //        } else {
                //            $("#TobaccoQuantity").removeClass('Error');
                //            $("#error_TobaccoQuantity").val('');
                //        }
                //        if ($("#TobaccoYears").val() == "" || $("#TobaccoYears").val() == null || $("#TobaccoYears").val() == '0') {
                //            $("#dvTobaccoYears").addClass('Error'); is_valid = 1;
                //            $("#error_TobaccoYears").val('Please Select');
                //        } else {
                //            $("#TobaccoQuantity").removeClass('Error');
                //            $("#error_TobaccoYears").val('');
                //        }
                //    }
                //}


                //if ($("#HQ06").val() == "" || $("#HQ06").val() == null) {
                //    $("#error_HQ06").html('Select Yes/No');
                //    is_valid = 1;
                //}
                //else {
                //    $("#error_HQ06").html('');
                //    if ($("#HQ06").val() == 'Yes') {
                //        if ($("#AlcoholConsumeAs").val() == "" || $("#AlcoholConsumeAs").val() == null) {
                //            $("#AlcoholConsumeAs").addClass('Error');
                //            $("#error_AlcoholConsumeAs").val('Please Select'); is_valid = 1;
                //        } else {
                //            $("#AlcoholConsumeAs").removeClass('Error');
                //            $("#error_AlcoholConsumeAs").val('');
                //        }
                //        if ($("#AlcoholQuantity").val() == "" || $("#AlcoholQuantity").val() == null) {
                //            $("#AlcoholQuantity").addClass('Error');
                //            $("#error_AlcoholQuantity").val('Please Select'); is_valid = 1;
                //        } else {
                //            $("#AlcoholQuantity").removeClass('Error');
                //            $("#error_AlcoholQuantity").val('');
                //        }
                //        if ($("#AlcoholYears").val() == "" || $("#AlcoholYears").val() == null || $("#AlcoholYears").val() == '0') {
                //            $("#dvAlcoholYears").addClass('Error'); is_valid = 1;
                //            $("#error_AlcoholYears").val('Please Select');
                //        } else {
                //            $("#AlcoholYears").removeClass('Error');
                //            $("#error_AlcoholYears").val('');
                //        }
                //    }
                //}

                //if ($("#HQ07").val() == "" || $("#HQ07").val() == null) {
                //    $("#error_HQ07").html('Select Yes/No');
                //    is_valid = 1;
                //} else {
                //    $("#error_HQ07").html('');
                //}

                //if ($("#HQ09").val() == "" || $("#HQ09").val() == null) {
                //    $("#error_HQ09").html('Select Yes/No');
                //    is_valid = 1;
                //} else {
                //    $("#error_HQ09").html('');
                //    if ($("#HQ09").val() == "Yes") {
                //        if ($("#RemarkHQ09").val() == null || $("#RemarkHQ09").val() == "") {
                //            $("#error_RemarkHQ09").html('Enter text');
                //            $("#dvRemarkHQ09").addClass('Error');
                //            is_valid = 1;
                //        } else {
                //            $("#error_RemarkHQ09").html('');
                //            $("#dvRemarkHQ09").removeClass('Error');
                //        }
                //    }
                //}

                //if ($("#HQ125").val() == "" || $("#HQ125").val() == null) {
                //    $("#error_HQ125").html('Select Yes/No');
                //    is_valid = 1;
                //} else {
                //    $("#error_HQ125").html('');
                //    if ($("#HQ125").val() == "Yes") {
                //        if ($("#RemarkHQ125").val() == null || $("#RemarkHQ125").val() == "") {
                //            $("#error_RemarkHQ125").html('Enter text');
                //            $("#dvRemarkHQ125").addClass('Error');
                //            is_valid = 1;
                //        } else {
                //            $("#error_RemarkHQ125").html('');
                //            $("#dvRemarkHQ125").removeClass('Error');
                //        }
                //    }
                //}

                if ($("#HQ144").val() == "" || $("#HQ144").val() == null) {
                    $("#error_HQ144").html('Select Yes/No');
                    is_valid = 1;
                } else {
                    $("#error_HQ144").html('');
                    if ($("#HQ144").val() == "Yes") {
                        if ($("#RemarkHQ144").val() == null || $("#RemarkHQ144").val() == "") {
                            $("#error_RemarkHQ144").html('Enter text');
                            $("#dvRemarkHQ144").addClass('Error');
                            is_valid = 1;
                        } else {
                            $("#error_RemarkHQ144").html('');
                            $("#dvRemarkHQ144").removeClass('Error');
                        }
                    }
                }

                if ($("#HQ165").val() == "" || $("#HQ165").val() == null) {
                    $("#error_HQ165").html('Select Yes/No');
                    is_valid = 1;
                } else {
                    $("#error_HQ165").html('');
                    if ($("#HQ165").val() == "Yes") {
                        if ($("#RemarkHQ165").val() == null || $("#RemarkHQ165").val() == "") {
                            $("#error_RemarkHQ165").html('Enter text');
                            $("#dvRemarkHQ165").addClass('Error');
                            is_valid = 1;
                        } else {
                            $("#error_RemarkHQ165").html('');
                            $("#dvRemarkHQ165").removeClass('Error');
                        }
                    }
                }


                if ($("#HQ166").val() == "" || $("#HQ166").val() == null) {
                    $("#error_HQ166").html('Select Yes/No');
                    is_valid = 1;
                } else {
                    $("#error_HQ166").html('');
                    if ($("#HQ166").val() == "Yes") {
                        if ($("#RemarkHQ166").val() == null || $("#RemarkHQ166").val() == "") {
                            $("#error_RemarkHQ166").html('Enter text');
                            $("#dvRemarkHQ166").addClass('Error');
                            is_valid = 1;
                        } else {
                            $("#error_RemarkHQ166").html('');
                            $("#dvRemarkHQ166").removeClass('Error');
                        }
                    }
                }

                if ($("#HQ167").val() == "" || $("#HQ167").val() == null) {
                    $("#error_HQ167").html('Select Yes/No');
                    is_valid = 1;
                } else {
                    $("#error_HQ167").html('');
                    if ($("#HQ167").val() == "Yes") {
                        if ($("#RemarkHQ167").val() == null || $("#RemarkHQ167").val() == "") {
                            $("#error_RemarkHQ167").html('Enter text');
                            $("#dvRemarkHQ167").addClass('Error');
                            is_valid = 1;
                        } else {
                            $("#error_RemarkHQ167").html('');
                            $("#dvRemarkHQ167").removeClass('Error');
                        }
                    }
                    //    if ($("#SubQuestion1_HQ167").val() == "" || $("#SubQuestion1_HQ167").val() == null) {
                    //        $("#error_SubQuestion1_HQ167").html('Select Yes/No');
                    //        is_valid = 1;
                    //    }
                    //    else {
                    //        $("#error_SubQuestion1_HQ167").html('');
                    //    }
                    //    if ($("#SubQuestion2_HQ167").val() == "" || $("#SubQuestion2_HQ167").val() == null) {
                    //        $("#error_SubQuestion2_HQ167").html('Select Yes/No');
                    //        is_valid = 1;
                    //    }
                    //    else {
                    //        $("#error_SubQuestion2_HQ167").html('');
                    //    }
                    //    if ($("#SubQuestion3_HQ167").val() == "" || $("#SubQuestion3_HQ167").val() == null) {
                    //        $("#error_SubQuestion3_HQ167").html('Select Yes/No');
                    //        is_valid = 1;
                    //    }
                    //    else {
                    //        $("#error_SubQuestion3_HQ167").html('');
                    //    }
                    //    if ($("#SubQuestion4_HQ167").val() == "" || $("#SubQuestion4_HQ167").val() == null) {
                    //        $("#error_SubQuestion4_HQ167").html('Select Yes/No');
                    //        is_valid = 1;
                    //    }
                    //    else {
                    //        $("#error_SubQuestion4_HQ167").html('');
                    //    }
                    //    if ($("#SubQuestion5_HQ167").val() == "" || $("#SubQuestion5_HQ167").val() == null) {
                    //        $("#error_SubQuestion5_HQ167").html('Select Yes/No');
                    //        is_valid = 1;
                    //    }
                    //    else {
                    //        $("#error_SubQuestion5_HQ167").html('');
                    //    }
                    //    if ($("#SubQuestion6_HQ167").val() == "" || $("#SubQuestion6_HQ167").val() == null) {
                    //        $("#error_SubQuestion6_HQ167").html('Select Yes/No');
                    //        is_valid = 1;
                    //    }
                    //    else {
                    //        $("#error_SubQuestion6_HQ167").html('');
                    //    }
                    //    if ($("#SubQuestion7_HQ167").val() == "" || $("#SubQuestion7_HQ167").val() == null) {
                    //        $("#error_SubQuestion7_HQ167").html('Select Yes/No');
                    //        is_valid = 1;
                    //    }
                    //    else {
                    //        $("#error_SubQuestion7_HQ167").html('');
                    //    }
                    //    if ($("#SubQuestion8_HQ167").val() == "" || $("#SubQuestion8_HQ167").val() == null) {
                    //        $("#error_SubQuestion8_HQ167").html('Select Yes/No');
                    //        is_valid = 1;
                    //    }
                    //    else {
                    //        $("#error_SubQuestion8_HQ167").html('');
                    //    }
                    //    if ($("#SubQuestion9_HQ167").val() == "" || $("#SubQuestion9_HQ167").val() == null) {
                    //        $("#error_SubQuestion9_HQ167").html('Select Yes/No');
                    //        is_valid = 1;
                    //    }
                    //    else {
                    //        $("#error_SubQuestion9_HQ167").html('');
                    //    }
                    //    if ($("#SubQuestion10_HQ167").val() == "" || $("#SubQuestion10_HQ167").val() == null) {
                    //        $("#error_SubQuestion10_HQ167").html('Select Yes/No');
                    //        is_valid = 1;
                    //    }
                    //    else {
                    //        $("#error_SubQuestion10_HQ167").html('');
                    //    }
                    //    if ($("#SubQuestion11_HQ167").val() == "" || $("#SubQuestion11_HQ167").val() == null) {
                    //        $("#error_SubQuestion11_HQ167").html('Select Yes/No');
                    //        is_valid = 1;
                    //    }
                    //    else {
                    //        $("#error_SubQuestion11_HQ167").html('');
                    //    }
                    //    if ($("#SubQuestion12_HQ167").val() == "" || $("#SubQuestion12_HQ167").val() == null) {
                    //        $("#error_SubQuestion12_HQ167").html('Select Yes/No');
                    //        is_valid = 1;
                    //    }
                    //    else {
                    //        $("#error_SubQuestion12_HQ167").html('');
                    //    }
                    //    if ($("#SubQuestion13_HQ167").val() == "" || $("#SubQuestion13_HQ167").val() == null) {
                    //        $("#error_SubQuestion13_HQ167").html('Select Yes/No');
                    //        is_valid = 1;
                    //    }
                    //    else {
                    //        $("#error_SubQuestion13_HQ167").html('');
                    //    }
                    //    if ($("#SubQuestion14_HQ167").val() == "" || $("#SubQuestion14_HQ167").val() == null) {
                    //        $("#error_SubQuestion14_HQ167").html('Select Yes/No');
                    //        is_valid = 1;
                    //    }
                    //    else {
                    //        $("#error_SubQuestion14_HQ167").html('');
                    //    }


                        //if ($("#SubMedicalQuestionAns_789").val() == "" || $("#SubMedicalQuestionAns_789").val() == null) {
                        //    $("#error_789").html('Select Yes/No');
                        //    is_valid = 1;
                        //}
                        //else {
                        //    $("#error_789").html('');
                        //}
                   // }
            }
           
                //if ($("#RemarkHQ167").val() == null || $("#RemarkHQ167").val() == "") {
                //    $("#error_RemarkHQ167").html('Enter text');
                //    $("#dvRemarkHQ167").addClass('Error');
                //    is_valid = 1;
                //} else {
                //    $("#error_RemarkHQ167").html('');
                //    $("#dvRemarkHQ167").removeClass('Error');
                //}
                if ($("#SubQuestion1_HQ167").val() == "" || $("#SubQuestion1_HQ167").val() == null) {
                    $("#error_SubQuestion1_HQ167").html('Select Yes/No');
                    is_valid = 1;
                }
                else {
                    $("#error_SubQuestion1_HQ167").html('');
                }
                if ($("#SubQuestion2_HQ167").val() == "" || $("#SubQuestion2_HQ167").val() == null) {
                    $("#error_SubQuestion2_HQ167").html('Select Yes/No');
                    is_valid = 1;
                }
                else {
                    $("#error_SubQuestion2_HQ167").html('');
                }
                if ($("#SubQuestion3_HQ167").val() == "" || $("#SubQuestion3_HQ167").val() == null) {
                    $("#error_SubQuestion3_HQ167").html('Select Yes/No');
                    is_valid = 1;
                }
                else {
                    $("#error_SubQuestion3_HQ167").html('');
                }
                if ($("#SubQuestion4_HQ167").val() == "" || $("#SubQuestion4_HQ167").val() == null) {
                    $("#error_SubQuestion4_HQ167").html('Select Yes/No');
                    is_valid = 1;
                }
                else {
                    $("#error_SubQuestion4_HQ167").html('');
                }
                if ($("#SubQuestion5_HQ167").val() == "" || $("#SubQuestion5_HQ167").val() == null) {
                    $("#error_SubQuestion5_HQ167").html('Select Yes/No');
                    is_valid = 1;
                }
                else {
                    $("#error_SubQuestion5_HQ167").html('');
                }
                if ($("#SubQuestion6_HQ167").val() == "" || $("#SubQuestion6_HQ167").val() == null) {
                    $("#error_SubQuestion6_HQ167").html('Select Yes/No');
                    is_valid = 1;
                }
                else {
                    $("#error_SubQuestion6_HQ167").html('');
                }
                if ($("#SubQuestion7_HQ167").val() == "" || $("#SubQuestion7_HQ167").val() == null) {
                    $("#error_SubQuestion7_HQ167").html('Select Yes/No');
                    is_valid = 1;
                }
                else {
                    $("#error_SubQuestion7_HQ167").html('');
                }
                if ($("#SubQuestion8_HQ167").val() == "" || $("#SubQuestion8_HQ167").val() == null) {
                    $("#error_SubQuestion8_HQ167").html('Select Yes/No');
                    is_valid = 1;
                }
                else {
                    $("#error_SubQuestion8_HQ167").html('');
                }
                if ($("#SubQuestion9_HQ167").val() == "" || $("#SubQuestion9_HQ167").val() == null) {
                    $("#error_SubQuestion9_HQ167").html('Select Yes/No');
                    is_valid = 1;
                }
                else {
                    $("#error_SubQuestion9_HQ167").html('');
                }
                if ($("#SubQuestion10_HQ167").val() == "" || $("#SubQuestion10_HQ167").val() == null) {
                    $("#error_SubQuestion10_HQ167").html('Select Yes/No');
                    is_valid = 1;
                }
                else {
                    $("#error_SubQuestion10_HQ167").html('');
                }
                if ($("#SubQuestion11_HQ167").val() == "" || $("#SubQuestion11_HQ167").val() == null) {
                    $("#error_SubQuestion11_HQ167").html('Select Yes/No');
                    is_valid = 1;
                }
                else {
                    $("#error_SubQuestion11_HQ167").html('');
                }
                if ($("#SubQuestion12_HQ167").val() == "" || $("#SubQuestion12_HQ167").val() == null) {
                    $("#error_SubQuestion12_HQ167").html('Select Yes/No');
                    is_valid = 1;
                }
                else {
                    $("#error_SubQuestion12_HQ167").html('');
                }
                if ($("#SubQuestion13_HQ167").val() == "" || $("#SubQuestion13_HQ167").val() == null) {
                    $("#error_SubQuestion13_HQ167").html('Select Yes/No');
                    is_valid = 1;
                }
                else {
                    $("#error_SubQuestion13_HQ167").html('');
                }
                if ($("#SubQuestion14_HQ167").val() == "" || $("#SubQuestion14_HQ167").val() == null) {
                    $("#error_SubQuestion14_HQ167").html('Select Yes/No');
                    is_valid = 1;
                }
                else {
                    $("#error_SubQuestion14_HQ167").html('');
                }



                if ($("#HQ188").val() == "" || $("#HQ188").val() == null) {
                    $("#error_HQ188").html('Select Yes/No');
                    is_valid = 1;
                } else {
                    $("#error_HQ188").html('');
                    if ($("#HQ188").val() == "Yes") {
                        if ($("#RemarkHQ188").val() == null || $("#RemarkHQ188").val() == "") {
                            $("#error_RemarkHQ188").html('Enter text');
                            $("#dvRemarkHQ188").addClass('Error');
                            is_valid = 1;
                        } else {
                            $("#error_RemarkHQ188").html('');
                            $("#dvRemarkHQ188").removeClass('Error');
                        }
                        if ($("#SubQuestion1_HQ188").val() == "" || $("#SubQuestion1_HQ188").val() == null) {
                            $("#error_SubQuestion1_HQ188").html('Select Yes/No');
                            is_valid = 1;
                        }
                        else {
                            $("#error_SubQuestion1_HQ188").html('');
                        }
                        if ($("#SubQuestion2_HQ188").val() == "" || $("#SubQuestion2_HQ188").val() == null) {
                            $("#error_SubQuestion2_HQ188").html('Select Yes/No');
                            is_valid = 1;
                        }
                        else {
                            $("#error_SubQuestion2_HQ188").html('');
                        }
                        if ($("#SubQuestion3_HQ188").val() == "" || $("#SubQuestion3_HQ188").val() == null) {
                            $("#error_SubQuestion3_HQ188").html('Select Yes/No');
                            is_valid = 1;
                        }
                        else {
                            $("#error_SubQuestion3_HQ188").html('');
                        }
                        if ($("#SubQuestion4_HQ188").val() == "" || $("#SubQuestion4_HQ188").val() == null) {
                            $("#error_SubQuestion4_HQ188").html('Select Yes/No');
                            is_valid = 1;
                        }
                        else {
                            $("#error_SubQuestion4_HQ188").html('');
                        }
                        if ($("#SubQuestion5_HQ188").val() == "" || $("#SubQuestion5_HQ188").val() == null) {
                            $("#error_SubQuestion5_HQ188").html('Select Yes/No');
                            is_valid = 1;
                        }
                        else {
                            $("#error_SubQuestion5_HQ188").html('');
                        }
                        if ($("#SubQuestion6_HQ188").val() == "" || $("#SubQuestion6_HQ188").val() == null) {
                            $("#error_SubQuestion6_HQ188").html('Select Yes/No');
                            is_valid = 1;
                        }
                        else {
                            $("#error_SubQuestion6_HQ188").html('');
                        }
                        if ($("#SubQuestion7_HQ188").val() == "" || $("#SubQuestion7_HQ188").val() == null) {
                            $("#error_SubQuestion7_HQ188").html('Select Yes/No');
                            is_valid = 1;
                        }
                        else {
                            $("#error_SubQuestion7_HQ188").html('');
                        }
                    }
                }
                        
                if ($("#HQ168").val() == "" || $("#HQ168").val() == null) {
                    $("#error_HQ168").html('Select Yes/No');
                    is_valid = 1;
                } else {
                    $("#error_HQ168").html('');
                    if ($("#HQ168").val() == "Yes") {
                        if ($("#RemarkHQ168").val() == null || $("#RemarkHQ168").val() == "") {
                            $("#error_RemarkHQ168").html('Enter text');
                            $("#dvRemarkHQ168").addClass('Error');
                            is_valid = 1;
                        } else {
                            $("#error_RemarkHQ168").html('');
                            $("#dvRemarkHQ168").removeClass('Error');
                        }
                    }
                }

                if ($("#HQ21").val() == "" || $("#HQ21").val() == null) {
                    $("#error_HQ21").html('Select Yes/No');
                    is_valid = 1;
                } else {
                    $("#error_HQ21").html('');
                    if ($("#HQ21").val() == "Yes") {
                        if ($("#RemarkHQ21").val() == null || $("#RemarkHQ21").val() == "") {
                            $("#error_RemarkHQ21").html('Enter text');
                            $("#dvRemarkHQ21").addClass('Error');
                            is_valid = 1;
                        } else {
                            $("#error_RemarkHQ21").html('');
                            $("#dvRemarkHQ21").removeClass('Error');
                        }
                    }
                }


                if ($("#HQ24").val() == "" || $("#HQ24").val() == null) {
                    $("#error_HQ24").html('Select Yes/No');
                    is_valid = 1;
                } else {
                    $("#error_HQ24").html('');
                    if ($("#HQ24").val() == "Yes") {
                        if ($("#RemarkHQ24").val() == null || $("#RemarkHQ24").val() == "") {
                            $("#error_RemarkHQ24").html('Enter text');
                            $("#dvRemarkHQ24").addClass('Error');
                            is_valid = 1;
                        } else {
                            $("#error_RemarkHQ24").html('');
                            $("#dvRemarkHQ24").removeClass('Error');
                        }
                    }
                }

                if ($("#HQ61").val() == "" || $("#HQ61").val() == null) {
                    $("#error_HQ61").html('Select Yes/No');
                    is_valid = 1;
                } else {
                    $("#error_HQ61").html('');
                    if ($("#HQ61").val() == "Yes") {
                        if ($("#RemarkHQ61").val() == null || $("#RemarkHQ61").val() == "") {
                            $("#error_RemarkHQ61").html('Enter text');
                            $("#dvRemarkHQ61").addClass('Error');
                            is_valid = 1;
                        } else {
                            $("#error_RemarkHQ61").html('');
                            $("#dvRemarkHQ61").removeClass('Error');
                        }
                    }
                }





                //if ($("#MedicalQuestionAns_1403").val() == "" || $("#MedicalQuestionAns_1403").val() == null) {
                //    $("#error1_1403").html('Select Yes/No');
                //    is_valid = 1;
                //}
                //else {
                //    $("#error1_1403").html('');
                //    if ($("#MedicalQuestionAns_1403").val() == 'Yes') {
                //        if ($("#TobaccoConsumeAs").val() == "" || $("#TobaccoConsumeAs").val() == null) {
                //            $("#TobaccoConsumeAs").addClass('Error');
                //            $("#error_TobaccoConsumeAs").val('Please Select'); is_valid = 1;
                //        } else {
                //            $("#TobaccoConsumeAs").removeClass('Error');
                //            $("#error_TobaccoConsumeAs").val('');
                //        }
                //        if ($("#TobaccoQuantity").val() == "" || $("#TobaccoQuantity").val() == null) {
                //            $("#TobaccoQuantity").addClass('Error');
                //            $("#error_TobaccoQuantity").val('Please Select'); is_valid = 1;
                //        } else {
                //            $("#TobaccoQuantity").removeClass('Error');
                //            $("#error_TobaccoQuantity").val('');
                //        }
                //        if ($("#TobaccoYears").val() == "" || $("#TobaccoYears").val() == null || $("#TobaccoYears").val() == '0') {
                //            $("#dvTobaccoYears").addClass('Error'); is_valid = 1;
                //            $("#error_TobaccoYears").val('Please Select');
                //        } else {
                //            $("#TobaccoQuantity").removeClass('Error');
                //            $("#error_TobaccoYears").val('');
                //        }
                //    }
                //}
                //if ($("#MedicalQuestionAns_1404").val() == "" || $("#MedicalQuestionAns_1404").val() == null) {
                //    $("#error1_1404").html('Select Yes/No');
                //    is_valid = 1;
                //}
                //else {
                //    $("#error1_1404").html('');
                //    if ($("#MedicalQuestionAns_1404").val() == 'Yes') {
                //        if ($("#AlcoholConsumeAs").val() == "" || $("#AlcoholConsumeAs").val() == null) {
                //            $("#AlcoholConsumeAs").addClass('Error');
                //            $("#error_AlcoholConsumeAs").val('Please Select'); is_valid = 1;
                //        } else {
                //            $("#AlcoholConsumeAs").removeClass('Error');
                //            $("#error_AlcoholConsumeAs").val('');
                //        }
                //        if ($("#AlcoholQuantity").val() == "" || $("#AlcoholQuantity").val() == null) {
                //            $("#AlcoholQuantity").addClass('Error');
                //            $("#error_AlcoholQuantity").val('Please Select'); is_valid = 1;
                //        } else {
                //            $("#AlcoholQuantity").removeClass('Error');
                //            $("#error_AlcoholQuantity").val('');
                //        }
                //        if ($("#AlcoholYears").val() == "" || $("#AlcoholYears").val() == null || $("#AlcoholYears").val() == '0') {
                //            $("#dvAlcoholYears").addClass('Error'); is_valid = 1;
                //            $("#error_AlcoholYears").val('Please Select');
                //        } else {
                //            $("#AlcoholYears").removeClass('Error');
                //            $("#error_AlcoholYears").val('');
                //        }
                //    }
                //}

                //if ($("#MedicalQuestionAns_1405").val() == "" || $("#MedicalQuestionAns_1405").val() == null) {
                //    $("#error1_1405").html('Select Yes/No');
                //    is_valid = 1;
                //} else {
                //    $("#error1_1405").html('');
                //}
                //if ($("#MedicalQuestionAns_1407").val() == "" || $("#MedicalQuestionAns_1407").val() == null) {
                //    $("#error1_1407").html('Select Yes/No');
                //    is_valid = 1;
                //} else {
                //    $("#error1_1407").html('');
                //}

                //if ($("#MedicalQuestionAns_1406").val() == "" || $("#MedicalQuestionAns_1406").val() == null) {
                //    $("#error1_1406").html('Select Yes/No');
                //    is_valid = 1;
                //} else {
                //    $("#error1_1406").html('');
                //    if ($("#MedicalQuestionAns_1406").val() == "Yes") {
                //        if ($("#Remark_1406_HQ09").val() == null || $("#Remark_1406_HQ09").val() == "") {
                //            $("#error_1406").html('Enter text');
                //            $("#dv1406").addClass('Error');
                //            is_valid = 1;
                //        } else {
                //            $("#error_1406").html('');
                //            $("#dv1406").removeClass('Error');
                //        }
                //    }
                //}

                //if ($("#MedicalQuestionAns_1407").val() == "" || $("#MedicalQuestionAns_1407").val() == null) {
                //    $("#error1_1407").html('Select Yes/No');
                //    is_valid = 1;
                //} else {
                //    $("#error1_1407").html('');
                //    if ($("#MedicalQuestionAns_1407").val() == "Yes") {
                //        if ($("#Remark_1407_HQ125").val() == null || $("#Remark_1407_HQ125").val() == "") {
                //            $("#error_1407").html('Enter text');
                //            $("#dv1407").addClass('Error');
                //            is_valid = 1;
                //        } else {
                //            $("#error_1407").html('');
                //            $("#dv1407").removeClass('Error');
                //        }
                //    }
                //}

                //if ($("#MedicalQuestionAns_1408").val() == "" || $("#MedicalQuestionAns_1408").val() == null) {
                //    $("#error1_1408").html('Select Yes/No');
                //    is_valid = 1;
                //} else {
                //    $("#error1_1408").html('');
                //    if ($("#MedicalQuestionAns_1408").val() == "Yes") {
                //        if ($("#Remark_1408_HQ144").val() == null || $("#Remark_1408_HQ144").val() == "") {
                //            $("#error_1408").html('Enter text');
                //            $("#dv1408").addClass('Error');
                //            is_valid = 1;
                //        } else {
                //            $("#error_1408").html('');
                //            $("#dv1408").removeClass('Error');
                //        }
                //    }
                    
                //}
                //if ($("#MedicalQuestionAns_1409").val() == "" || $("#MedicalQuestionAns_1409").val() == null) {
                //    $("#error1_1409").html('Select Yes/No');
                //    is_valid = 1;
                //} else {
                //    $("#error1_1409").html('');
                //    if ($("#MedicalQuestionAns_1409").val() == "Yes") {
                //        if ($("#Remark_1409_HQ165").val() == null || $("#Remark_1409_HQ165").val() == "") {
                //            $("#error_1409").html('Enter text');
                //            $("#dv1409").addClass('Error');
                //            is_valid = 1;
                //        } else {
                //            $("#error_1409").html('');
                //            $("#dv1409").removeClass('Error');
                //        }
                //    }
                //}
                //if ($("#MedicalQuestionAns_1410").val() == "" || $("#MedicalQuestionAns_1410").val() == null) {
                //    $("#error1_1410").html('Select Yes/No');
                //    is_valid = 1;
                //} else {
                //    $("#error1_1410").html('');
                //    if ($("#MedicalQuestionAns_1410").val() == "Yes") {
                //        if ($("#Remark_1410_HQ166").val() == null || $("#Remark_1410_HQ166").val() == "") {
                //            $("#error_1410").html('Enter text');
                //            $("#dv1410").addClass('Error');
                //            is_valid = 1;
                //        } else {
                //            $("#error_1410").html('');
                //            $("#dv1410").removeClass('Error');
                //        }
                //    }
                //}
                //if ($("#MedicalQuestionAns_1411").val() == "" || $("#MedicalQuestionAns_1411").val() == null) {
                //    $("#error1_1411").html('Select Yes/No');
                //    is_valid = 1;
                //} else {
                //    $("#error1_1411").html('');
                //    if ($("#MedicalQuestionAns_1411").val() == "Yes") {
                //        if ($("#Remark_1411_HQ167").val() == null || $("#Remark_1411_HQ167").val() == "") {
                //            $("#error_1411").html('Enter text');
                //            $("#dv1411").addClass('Error');
                //            is_valid = 1;
                //        } else {
                //            $("#error_1411").html('');
                //            $("#dv1411").removeClass('Error');
                //        }
                //        if ($("#SubMedicalQuestionAns_775").val() == "" || $("#SubMedicalQuestionAns_775").val() == null) {
                //            $("#error_775").html('Select Yes/No');
                //            is_valid = 1;
                //        }
                //        else {
                //            $("#error_775").html('');
                //        }
                //        if ($("#SubMedicalQuestionAns_776").val() == "" || $("#SubMedicalQuestionAns_776").val() == null) {
                //            $("#error_776").html('Select Yes/No');
                //            is_valid = 1;
                //        }
                //        else {
                //            $("#error_776").html('');
                //        }
                //        if ($("#SubMedicalQuestionAns_777").val() == "" || $("#SubMedicalQuestionAns_777").val() == null) {
                //            $("#error_777").html('Select Yes/No');
                //            is_valid = 1;
                //        }
                //        else {
                //            $("#error_777").html('');
                //        }
                //        if ($("#SubMedicalQuestionAns_778").val() == "" || $("#SubMedicalQuestionAns_778").val() == null) {
                //            $("#error_778").html('Select Yes/No');
                //            is_valid = 1;
                //        }
                //        else {
                //            $("#error_778").html('');
                //        }
                //        if ($("#SubMedicalQuestionAns_779").val() == "" || $("#SubMedicalQuestionAns_779").val() == null) {
                //            $("#error_779").html('Select Yes/No');
                //            is_valid = 1;
                //        }
                //        else {
                //            $("#error_779").html('');
                //        }
                //        if ($("#SubMedicalQuestionAns_780").val() == "" || $("#SubMedicalQuestionAns_780").val() == null) {
                //            $("#error_780").html('Select Yes/No');
                //            is_valid = 1;
                //        }
                //        else {
                //            $("#error_780").html('');
                //        }
                //        if ($("#SubMedicalQuestionAns_781").val() == "" || $("#SubMedicalQuestionAns_781").val() == null) {
                //            $("#error_781").html('Select Yes/No');
                //            is_valid = 1;
                //        }
                //        else {
                //            $("#error_781").html('');
                //        }
                //        if ($("#SubMedicalQuestionAns_782").val() == "" || $("#SubMedicalQuestionAns_782").val() == null) {
                //            $("#error_782").html('Select Yes/No');
                //            is_valid = 1;
                //        }
                //        else {
                //            $("#error_782").html('');
                //        }
                //        if ($("#SubMedicalQuestionAns_783").val() == "" || $("#SubMedicalQuestionAns_783").val() == null) {
                //            $("#error_783").html('Select Yes/No');
                //            is_valid = 1;
                //        }
                //        else {
                //            $("#error_783").html('');
                //        }
                //        if ($("#SubMedicalQuestionAns_784").val() == "" || $("#SubMedicalQuestionAns_784").val() == null) {
                //            $("#error_784").html('Select Yes/No');
                //            is_valid = 1;
                //        }
                //        else {
                //            $("#error_784").html('');
                //        }
                //        if ($("#SubMedicalQuestionAns_785").val() == "" || $("#SubMedicalQuestionAns_785").val() == null) {
                //            $("#error_785").html('Select Yes/No');
                //            is_valid = 1;
                //        }
                //        else {
                //            $("#error_785").html('');
                //        }
                //        if ($("#SubMedicalQuestionAns_786").val() == "" || $("#SubMedicalQuestionAns_786").val() == null) {
                //            $("#error_786").html('Select Yes/No');
                //            is_valid = 1;
                //        }
                //        else {
                //            $("#error_786").html('');
                //        }
                //        if ($("#SubMedicalQuestionAns_787").val() == "" || $("#SubMedicalQuestionAns_787").val() == null) {
                //            $("#error_787").html('Select Yes/No');
                //            is_valid = 1;
                //        }
                //        else {
                //            $("#error_787").html('');
                //        }
                //        if ($("#SubMedicalQuestionAns_788").val() == "" || $("#SubMedicalQuestionAns_788").val() == null) {
                //            $("#error_788").html('Select Yes/No');
                //            is_valid = 1;
                //        }
                //        else {
                //            $("#error_788").html('');
                //        }
                //        if ($("#SubMedicalQuestionAns_789").val() == "" || $("#SubMedicalQuestionAns_789").val() == null) {
                //            $("#error_789").html('Select Yes/No');
                //            is_valid = 1;
                //        }
                //        else {
                //            $("#error_789").html('');
                //        }
                //    }
                //}
                //if ($("#MedicalQuestionAns_1412").val() == "" || $("#MedicalQuestionAns_1412").val() == null) {
                //    $("#error1_1412").html('Select Yes/No');
                //    is_valid = 1;
                //} else {
                //    $("#error1_1412").html('');
                //    if ($("#MedicalQuestionAns_1412").val() == "Yes") {
                //        if ($("#Remark_1412_HQ168").val() == null || $("#Remark_1412_HQ168").val() == "") {
                //            $("#error_1412").html('Enter text');
                //            $("#dv1412").addClass('Error');
                //            is_valid = 1;
                //        } else {
                //            $("#error_1412").html('');
                //            $("#dv1412").removeClass('Error');
                //        }
                //    }
                //}
                //if ($("#MedicalQuestionAns_1413").val() == "" || $("#MedicalQuestionAns_1413").val() == null) {
                //    $("#error1_1413").html('Select Yes/No');
                //    is_valid = 1;
                //} else {
                //    $("#error1_1413").html('');
                //    if ($("#MedicalQuestionAns_1413").val() == "Yes") {
                //        if ($("#Remark_1413_HQ21").val() == null || $("#Remark_1413_HQ21").val() == "") {
                //            $("#error_1413").html('Enter text');
                //            $("#dv1413").addClass('Error');
                //            is_valid = 1;
                //        } else {
                //            $("#error_1413").html('');
                //            $("#dv1413").removeClass('Error');
                //        }
                //    }
                //}
                //if ($("#MedicalQuestionAns_1414").val() == "" || $("#MedicalQuestionAns_1414").val() == null) {
                //    $("#error1_1414").html('Select Yes/No');
                //    is_valid = 1;
                //} else {
                //    $("#error1_1414").html('');
                //    if ($("#MedicalQuestionAns_1414").val() == "Yes") {
                //        if ($("#Remark_1414_HQ24").val() == null || $("#Remark_1414_HQ24").val() == "") {
                //            $("#error_1414").html('Enter text');
                //            $("#dv1414").addClass('Error');
                //            is_valid = 1;
                //        } else {
                //            $("#error_1414").html('');
                //            $("#dv1414").removeClass('Error');
                //        }
                //    }
                //}
                //if ($("#MedicalQuestionAns_1415").val() == "" || $("#MedicalQuestionAns_1415").val() == null) {
                //    $("#error1_1415").html('Select Yes/No');
                //    is_valid = 1;
                //} else {
                //    $("#error1_1415").html('');
                //}
                //if ($("#MedicalQuestionAns_1416").val() == "" || $("#MedicalQuestionAns_1416").val() == null) {
                //    $("#error1_1416").html('Select Yes/No');
                //    is_valid = 1;
                //} else {
                //    $("#error1_1416").html('');
                //    if ($("#MedicalQuestionAns_1416").val() == "Yes") {
                //        if ($("#Remark_1416_HQ188").val() == null || $("#Remark_1416_HQ188").val() == "") {
                //            $("#error_1416").html('Enter text');
                //            $("#dv1416").addClass('Error');
                //            is_valid = 1;
                //        } else {
                //            $("#error_1416").html('');
                //            $("#dv1416").removeClass('Error');
                //        }
                //        if ($("#SubMedicalQuestionAns_790").val() == "" || $("#SubMedicalQuestionAns_790").val() == null) {
                //            $("#error_790").html('Enter Details');
                //            is_valid = 1;
                //        }
                //        else {
                //            $("#error_790").html('');
                //        }
                //        if ($("#SubMedicalQuestionAns_791").val() == "" || $("#SubMedicalQuestionAns_791").val() == null) {
                //            $("#error_791").html('Enter Details');
                //            is_valid = 1;
                //        }
                //        else {
                //            $("#error_791").html('');
                //        }
                //        if ($("#SubMedicalQuestionAns_792").val() == "" || $("#SubMedicalQuestionAns_792").val() == null) {
                //            $("#error_792").html('Enter Details');
                //            is_valid = 1;
                //        }
                //        else {
                //            $("#error_792").html('');
                //        }
                //        if ($("#SubMedicalQuestionAns_793").val() == "" || $("#SubMedicalQuestionAns_793").val() == null) {
                //            $("#error_793").html('Enter Details');
                //            is_valid = 1;
                //        }
                //        else {
                //            $("#error_793").html('');
                //        }
                //        if ($("#SubMedicalQuestionAns_794").val() == "" || $("#SubMedicalQuestionAns_794").val() == null) {
                //            $("#error_794").html('Enter Details');
                //            is_valid = 1;
                //        }
                //        else {
                //            $("#error_794").html('');
                //        }
                //        if ($("#SubMedicalQuestionAns_795").val() == "" || $("#SubMedicalQuestionAns_795").val() == null) {
                //            $("#error_795").html('Enter Details');
                //            is_valid = 1;
                //        }
                //        else {
                //            $("#error_795").html('');
                //        }
                //        if ($("#SubMedicalQuestionAns_796").val() == "" || $("#SubMedicalQuestionAns_796").val() == null) {
                //            $("#error_796").html('Enter Details');
                //            is_valid = 1;
                //        }
                //        else {
                //            $("#error_796").html('');
                //        }
                //    }
                //}
                if ($("#HQ167").val() == "Yes") {
                    if ($("#SubQuestion1_HQ167").val() == "No" && $("#SubQuestion2_HQ167").val() == "No" && $("#SubQuestion3_HQ167").val() == "No" && $("#SubQuestion4_HQ167").val() == "No" && $("#SubQuestion5_HQ167").val() == "No" && $("#SubQuestion6_HQ167").val() == "No" && $("#SubQuestion7_HQ167").val() == "No" && $("#SubQuestion8_HQ167").val() == "No" && $("#SubQuestion9_HQ167").val() == "No" && $("#SubQuestion10_HQ167").val() == "No" && $("#SubQuestion11_HQ167").val() == "No" && $("#SubQuestion12_HQ167").val() == "No" && $("#SubQuestion13_HQ167").val() == "No" && $("#SubQuestion14_HQ167").val() == "No") {
                        alert("Atleast one subquestion of Medical Details must be answered as YES");
                        is_valid = 1;
                    }
                }

                if ($("#HQ188").val() == "Yes") {
                    if ($("#SubQuestion1_HQ188").val() == "No" && $("#SubQuestion2_HQ188").val() == "No" && $("#SubQuestion3_HQ188").val() == "No" && $("#SubQuestion4_HQ188").val() == "No" && $("#SubQuestion5_HQ188").val() == "No" && $("#SubQuestion6_HQ188").val() == "No" && $("#SubQuestion7_HQ188").val() == "No") {
                        alert("Atleast one subquestion of Health Declaration must be answered as YES");
                        is_valid = 1;
                    }
                }
                if (is_valid < 1) { return true; }
                else { return false; }
            }



            else if (Opt == 12) {

               
                //if ($CKYCFatherTitle.val() == '' || $CKYCFatherTitle.val() == null) {
                //    $('#CKYCFatherTitle').addClass('Error'); is_valid = 1;
                //    $("#error_CKYCFatherTitle").html("Please Select Title");
                //}
                //else {
                //    $("#error_CKYCFatherTitle").html("");
                //    $('#CKYCFatherTitle').removeClass('Error');
                //}

                //if ($CKYCFatherFirstName.val() == "" || checkText($CKYCFatherFirstName) == false) {

                //    $('#dvCKYCFatherFirstName').addClass('Error'); is_valid = 1;
                //    $("#error_CKYCFatherFirstName").html("Please Enter Father First Name");
                //}
                //else {
                //    $("#error_CKYCFatherFirstName").html("");
                //    $('#dvCKYCFatherFirstName').removeClass('Error');
                //}

                //if ($CKYCFatherLastName.val() == "" || checkText($CKYCFatherLastName) == false) {
                //    $('#dvCKYCFatherLastName').addClass('Error'); is_valid = 1;
                //    $("#error_CKYCFatherLastName").html("Please Enter Father Last Name");
                //}
                //else {
                //    $("#error_CKYCFatherLastName").html("");
                //    $('#dvCKYCFatherLastName').removeClass('Error');
                //}

                //if ($CKYCMotherTitle.val() == '' || $CKYCMotherTitle.val() == null) {
                //    $('#CKYCMotherTitle').addClass('Error'); is_valid = 1;
                //    $("#error_CKYCMotherTitle").html("Please Select Title");
                //}
                //else {
                //    $("#error_CKYCMotherTitle").html("");
                //    $('#CKYCMotherTitle').removeClass('Error');
                //}

                //if ($CKYCMotherFirstName.val() == "" || checkText($CKYCMotherFirstName) == false) {
                //    $('#dvCKYCMotherFirstName').addClass('Error'); is_valid = 1;
                //    $("#error_CKYCMotherFirstName").html("Please Enter Mother First Name");
                //}
                //else {
                //    $("#error_CKYCMotherFirstName").html("");
                //    $('#dvCKYCMotherFirstName').removeClass('Error');
                //}
                //if ($CKYCMotherLastName.val() == "" || checkText($CKYCMotherLastName) == false) {
                //    $('#dvCKYCMotherLastName').addClass('Error'); is_valid = 1;
                //    $("#error_CKYCMotherLastName").html("Please Enter Mother Last Name");
                //}
                //else {
                //    $("#error_CKYCMotherLastName").html("");
                //    $('#dvCKYCMotherLastName').removeClass('Error');
                //}

                //if ($("#MaritalStatus").val() == "MAR_MRD" || $("#MaritalStatus").val() == null || $("#MaritalStatus").val()=="696") {

                //    if ($CKYCSpouseTitle.val() == '' || $CKYCSpouseTitle.val() == null) {
                //        $('#CKYCSpouseTitle').addClass('Error'); is_valid = 1;
                //        $("#error_CKYCSpouseTitle").html("Please Select Title");
                //    }
                //    else {
                //        $("#error_CKYCSpouseTitle").html("");
                //        $('#CKYCSpouseTitle').removeClass('Error');
                //    }

                //    if ($CKYCSpouseFirstName.val() == "" || checkText($CKYCSpouseFirstName) == false) {
                //        $('#dvCKYCSpouseFirstName').addClass('Error'); is_valid = 1;
                //        $("#error_CKYCSpouseFirstName").html("Please Enter Spouse First Name");
                //    }
                //    else {
                //        $("#error_CKYCSpouseFirstName").html("");
                //        $('#dvCKYCSpouseFirstName').removeClass('Error');
                //    }

                //    if ($CKYCSpouseLastName.val() == "" || checkText($CKYCSpouseLastName) == false) {
                //        $('#dvCKYCSpouseLastName').addClass('Error'); is_valid = 1;
                //        $("#error_CKYCSpouseLastName").html("Please Enter Spouse Last Name");
                //    }
                //    else {
                //        $("#error_CKYCSpouseLastName").html("");
                //        $('#dvCKYCSpouseLastName').removeClass('Error');
                //    }
                //}

                

                if (is_valid == 0) {
                  //  $("#FinalSubmit").val("1");
                    return true;
                }
                else { return false; }

            }
            else if (Opt == 13) {
                //if ($('#txtBankAccNo').val() == '' || BankAccount($txtBankAccNo) == null) {
                //    $('#dvtxtBankAccNo').addClass('Error'); is_valid = 1;
                //    //$("#Error_txtBankAccNo").html("please enter country.");
                //}
                //else {
                //    $("#Error_txtBankAccNo").html("");
                //    $('#dvtxtBankAccNo').removeClass('Error');
                //}
                //if ($('#txtBankName').val() == '' || $('#txtBankName').val() == null) {
                //    $('#dvtxtBankName').addClass('Error'); is_valid = 1;
                //    //$("#Error_txtBankAccNo").html("please enter country.");
                //}
                //else {
                //    $("#Error_txtBankName").html("");
                //    $('#dvtxtBankName').removeClass('Error');
                //}
                //if ($('#txtBankLoc').val() == '' || $('#txtBankLoc').val() == null) {
                //    $('#dvtxtBankLoc').addClass('Error'); is_valid = 1;
                //    //$("#Error_txtBankAccNo").html("please enter country.");
                //}
                //else {
                //    $("#Error_txtBankLoc").html("");
                //    $('#dvtxtBankLoc').removeClass('Error');
                //}
                //if ($('#txtBankIFSC').val() == '' || $('#txtBankIFSC').val() == null) {
                //    $('#dvtxtBankIFSC').addClass('Error'); is_valid = 1;
                //    //$("#Error_txtBankAccNo").html("please enter country.");
                //}
                //else {
                //    if ($('#txtBankIFSC').val().length == 11) {
                //        $("#error_txtBankIFSC").html("");
                //        $('#dvtxtBankIFSC').removeClass('Error');
                //    } else {
                //        $('#dvtxtBankIFSC').addClass('Error'); is_valid = 1;
                //        $("#error_txtBankIFSC").html("Enter valid IFSC Code");
                //    }
                   
                //}
                //if ($('#AccountType').val() == '' || $('#AccountType').val() == null) {
                //    $('#AccountType').addClass('Error'); is_valid = 1;
                //    //$("#Error_txtBankAccNo").html("please enter country.");
                //}
                //else {
                //    $("#Error_AccountType").html("");
                //    $('#AccountType').removeClass('Error');
                //}
                //if ($('#MICRCode').val() == '' || $('#MICRCode').val() == null) {
                //    $('#dvMICRCode').addClass('Error'); is_valid = 1;
                //    //$("#Error_txtBankAccNo").html("please enter country.");
                //}
                //else {
                //    if ($('#MICRCode').val().length == 9) {
                //        $("#error_MICRCode").html("");
                //        $('#dvMICRCode').removeClass('Error');
                //    } else {
                //        $('#dvMICRCode').addClass('Error'); is_valid = 1;
                //        $("#error_MICRCode").html("Enter Valid MICR Code");
                //    }
                    
                //}
                    if (is_valid == 0) {
                         $("#FinalSubmit").val("1");
                        return true;
                    }
                    else { return false; }

            }
            else if (Opt == 15) {

                if ($EIA.val() == "" || $EIA.val() == null) {
                    $('#EIA').addClass('Error');
                    is_valid = 1;
                    $("#error_EIA").html("Please Select Option.");
                }
                else {

                    $('#EIA').removeClass('Error');
                    $("#error_EIA").html("");
                }
                
                    if ($EIA.val() == "Yes") {
                        if ($("#EIANo").val() == "" || $("#EIANo").val() == null || $("#EIANo").val() == "0") {
                            $('#dvEIANo').addClass('Error'); is_valid = 1;
                            //$("#error_EIANo ").html("Please Select Type of Insurance.");
                        }
                        else {
                            if ($("#EIANo").val().length == "13") {
                                $("#error_EIANo").html("");
                                $('#dvEIANo').removeClass('Error');
                            } else {
                                $('#dvEIANo').addClass('Error'); is_valid = 1;
                                $("#error_EIANo").html("Enter valid 13 digit EIA Number.");
                            }
                            
                        }

                    }
                //    $('#EIA').removeClass('Error');
                //$("#error_EIA").html("");

                
                if ($("#Insurancerepository").val() == "" || $("#Insurancerepository").val() == null) {
                    $('#Insurancerepository').addClass('Error'); is_valid = 1;
                   
                }
                else {
                    $("#error_Insurancerepository").html("");
                    $('#Insurancerepository').removeClass('Error');
                }

                //if ($IpruPolicy.val() == "") {
                //    $('#IpruPolicy').addClass('Error');
                //    is_valid = 1;
                //    $("#error_IpruPolicy").html("Please Select Option.");
                //}
                //else {
                //    $('#IpruPolicy').removeClass('Error');
                //    $("#error_IpruPolicy").html("");
                    
                //}

                if (is_valid < 1) { return true; }
                else { return false; }
            }

            else if (Opt == 16) {
                if ($("#ExistingPolicy").val() == "Yes") {
                    if ($("#ExistingPolicySumAssured").val() == "" || $("#ExistingPolicySumAssured").val() == null || $("#ExistingPolicySumAssured").val() == "0") {
                        $('#dvExistingPolicySumAssured').addClass('Error'); is_valid = 1;

                    }
                    else {
                        $("#error_ExistingPolicySumAssured").html("");
                        $('#dvExistingPolicySumAssured').removeClass('Error');
                    }
                    if ($("#cmpany option:selected").val() == 0 || $("#cmpany option:selected").val() == '') {
                        $('#cmpany').addClass('Error');
                        is_valid = 1;
                        //$("#error_cmpany").html("Please Select Option.");
                    }
                    else {
                        $('#cmpany').removeClass('Error');
                        $("#error_cmpany").html("");

                    }

                    if ($("#ExistingPolicyTotalAmount").val() == "" || $("#ExistingPolicyTotalAmount").val() == null || $("#ExistingPolicyTotalAmount").val() == "0") {
                        $('#dvExistingPolicyTotalAmount').addClass('Error'); is_valid = 1;

                    }
                    else {
                        $("#error_ExistingPolicyTotalAmount").html("");
                        $('#dvExistingPolicyTotalAmount').removeClass('Error');
                    }

                    if ($('#ExistingInsuranceCount').val() >= 2) {
                        if ($("#ExistingPolicySumAssured2").val() == "" || $("#ExistingPolicySumAssured2").val() == null || $("#ExistingPolicySumAssured2").val() == "0") {
                            $('#dvExistingPolicySumAssured2').addClass('Error'); is_valid = 1;

                        }
                        else {
                            $("#error_ExistingPolicySumAssured2").html("");
                            $('#dvExistingPolicySumAssured2').removeClass('Error');
                        }
                        if ($("#cmpany2 option:selected").val() == 0 || $("#cmpany2 option:selected").val() == '') {
                            $('#cmpany2').addClass('Error');
                            is_valid = 1;
                            //$("#error_cmpany").html("Please Select Option.");
                        }
                        else {
                            $('#cmpany2').removeClass('Error');
                            $("#error_cmpany2").html("");

                        }

                        if ($("#ExistingPolicyTotalAmount2").val() == "" || $("#ExistingPolicyTotalAmount2").val() == null || $("#ExistingPolicyTotalAmount2").val() == "0") {
                            $('#dvExistingPolicyTotalAmount2').addClass('Error'); is_valid = 1;

                        }
                        else {
                            $("#error_ExistingPolicyTotalAmount2").html("");
                            $('#dvExistingPolicyTotalAmount2').removeClass('Error');
                        }
                    }
                    if ($('#ExistingInsuranceCount').val() >=3) {
                        if ($("#ExistingPolicySumAssured3").val() == "" || $("#ExistingPolicySumAssured3").val() == null || $("#ExistingPolicySumAssured3").val() == "0") {
                            $('#dvExistingPolicySumAssured3').addClass('Error'); is_valid = 1;

                        }
                        else {
                            $("#error_ExistingPolicySumAssured3").html("");
                            $('#dvExistingPolicySumAssured3').removeClass('Error');
                        }
                        if ($("#cmpany3 option:selected").val() == 0 || $("#cmpany3 option:selected").val() == '') {
                            $('#cmpany3').addClass('Error');
                            is_valid = 1;
                            //$("#error_cmpany").html("Please Select Option.");
                        }
                        else {
                            $('#cmpany3').removeClass('Error');
                            $("#error_cmpany3").html("");

                        }

                        if ($("#ExistingPolicyTotalAmount3").val() == "" || $("#ExistingPolicyTotalAmount3").val() == null || $("#ExistingPolicyTotalAmount3").val() == "0") {
                            $('#dvExistingPolicyTotalAmount3').addClass('Error'); is_valid = 1;

                        }
                        else {
                            $("#error_ExistingPolicyTotalAmount3").html("");
                            $('#dvExistingPolicyTotalAmount3').removeClass('Error');
                        }
                    }
                    if ($('#ExistingInsuranceCount').val() >= 4) {
                        if ($("#ExistingPolicySumAssured4").val() == "" || $("#ExistingPolicySumAssured4").val() == null || $("#ExistingPolicySumAssured4").val() == "0") {
                            $('#dvExistingPolicySumAssured4').addClass('Error'); is_valid = 1;

                        }
                        else {
                            $("#error_ExistingPolicySumAssured4").html("");
                            $('#dvExistingPolicySumAssured4').removeClass('Error');
                        }
                        if ($("#cmpany4 option:selected").val() == 0 || $("#cmpany4 option:selected").val() == '') {
                            $('#cmpany4').addClass('Error');
                            is_valid = 1;
                            //$("#error_cmpany").html("Please Select Option.");
                        }
                        else {
                            $('#cmpany4').removeClass('Error');
                            $("#error_cmpany4").html("");

                        }

                        if ($("#ExistingPolicyTotalAmount4").val() == "" || $("#ExistingPolicyTotalAmount4").val() == null || $("#ExistingPolicyTotalAmount4").val() == "0") {
                            $('#dvExistingPolicyTotalAmount4').addClass('Error'); is_valid = 1;

                        }
                        else {
                            $("#error_ExistingPolicyTotalAmount4").html("");
                            $('#dvExistingPolicyTotalAmount4').removeClass('Error');
                        }
                    }
                    if ($('#ExistingInsuranceCount').val() >=5) {
                        if ($("#ExistingPolicySumAssured5").val() == "" || $("#ExistingPolicySumAssured5").val() == null || $("#ExistingPolicySumAssured5").val() == "0") {
                            $('#dvExistingPolicySumAssured5').addClass('Error'); is_valid = 1;

                        }
                        else {
                            $("#error_ExistingPolicySumAssured5").html("");
                            $('#dvExistingPolicySumAssured5').removeClass('Error');
                        }
                        if ($("#cmpany5 option:selected").val() == 0 || $("#cmpany5 option:selected").val() == '') {
                            $('#cmpany5').addClass('Error');
                            is_valid = 1;
                            //$("#error_cmpany").html("Please Select Option.");
                        }
                        else {
                            $('#cmpany5').removeClass('Error');
                            $("#error_cmpany5").html("");

                        }

                        if ($("#ExistingPolicyTotalAmount5").val() == "" || $("#ExistingPolicyTotalAmount5").val() == null || $("#ExistingPolicyTotalAmount5").val() == "0") {
                            $('#dvExistingPolicyTotalAmount5').addClass('Error'); is_valid = 1;

                        }
                        else {
                            $("#error_ExistingPolicyTotalAmount5").html("");
                            $('#dvExistingPolicyTotalAmount5').removeClass('Error');
                        }
                    }
                }
                if (is_valid < 1) { return true; }
                else { return false; }
            }

            else if (Opt == 17) {
                if ($("#CHQ01").val() == "" || $("#CHQ01").val() == null) {
                    $("#error_CHQ01").html('Select Yes/No');
                    is_valid = 1;
                } else {
                    $("#error_CHQ01").html('');
                }

                if ($("#CHQ02").val() == "" || $("#CHQ02").val() == null) {
                    $("#error_CHQ02").html('Select Yes/No');
                    is_valid = 1;
                } else {
                    $("#error_CHQ02").html('');
                }

                if ($("#CHQ03").val() == "" || $("#CHQ03").val() == null) {
                    $("#error_CHQ03").html('Select Yes/No');
                    is_valid = 1;
                } else {
                    $("#error_CHQ03").html('');
                }

                if ($("#CHQ04").val() == "" || $("#CHQ04").val() == null) {
                    $("#error_CHQ04").html('Select Yes/No');
                    is_valid = 1;
                } else {
                    $("#error_CHQ04").html('');
                }

                if ($("#CHQ05").val() == "" || $("#CHQ05").val() == null) {
                    $("#error_CHQ05").html('Select Yes/No');
                    is_valid = 1;
                } else {
                    $("#error_CHQ05").html('');
                }
                if (is_valid < 1) {
                    $('#FinalSubmit').val("1");
                    return true;
                }
                else { return false; }
            }
            else if (Opt == 14) {
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
                for (var i = 0; i < thislength ; i++) {
                    if (ValidateSection(IDs[i]) == true) {
                       
                        $('#' + IDs[i]).find("i.indicator").removeClass('glyphs');
                    }
                    else {
                        $('#' + IDs[i]).find("i.indicator").addClass('glyphs');
                        //ExpandSection(IDs[i], ContentIDs[i]);//$('#'+ContentIDs[i]).collapse('show');
                        if (IDs[i] == "hrefViewInput") {
                            ExpandSection(IDs[i], "collapseOne");
                        } else if (IDs[i] == "hrefProposalInfo") {
                            ExpandSection(IDs[i], "collapsetwo");
                        } else if (IDs[i] == "hrefPersonalInfo") {
                            ExpandSection(IDs[i], "collapsefour");
                        } else if (IDs[i] == "hrefEIA") {
                            ExpandSection(IDs[i], "collapseeleven");
                        } else if (IDs[i] == "hrefExistingPolicy") {
                            ExpandSection(IDs[i], "collapsetwelve");
                        }  else if (IDs[i] == "hrefnominee") {
                            ExpandSection(IDs[i], "collapsefive");
                        } else if (IDs[i] == "hrefContactInfo") {
                            ExpandSection(IDs[i], "collapseThree");
                        } else if (IDs[i] == "hrefMedicalQuestionnaire") {
                            ExpandSection(IDs[i], "collapsesix");
                        } else if (IDs[i] == "hrefLifeStyleQuestionnaire") {
                            ExpandSection(IDs[i], "collapsethirteen");
                        } else if (IDs[i] == "hrefCKYC") {
                            ExpandSection(IDs[i], "collapseeight");
                        } else if (IDs[i] == "hrefBankDetails") {
                            ExpandSection(IDs[i], "collapsenine");
                        } else if (IDs[i] == "hrefCovidQuestionnaire") {
                            ExpandSection(IDs[i], "collapseseven");
                        }else {
                            ExpandSection(IDs[i], "collapseten");//$('#'+ContentIDs[i]).collapse('show');
                        }
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

        function checkAddress1(input) {

            var pattern = new RegExp("^[0-9a-zA-Z/ -]{2,30}$");
            var dvid = "dv" + input[0].id;
            if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
            else { $('#' + dvid).removeClass('Error'); return true; }
        }
function checkAddress(input) {    //durgesh

    var pattern = new RegExp('^[\d0-9a-zA-Z]{2}[\d0-9a-zA-Z ]{0,28}$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}

        function checkTextWithSpace(input) {

            var pattern = new RegExp('^[a-zA-Z ]+$');
            var dvid = "dv" + input[0].id;
            if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
            else { $('#' + dvid).removeClass('Error'); return true; }
}

function checkTextWithSpace1(input) {    //durgesh

    var pattern = new RegExp('^[a-zA-Z ]{2,30}$');
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

function BankAccount(input) {

    var pattern = new RegExp("^[0-9]{4,40}$");
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkEmail(input) {

    var dvid = "dv" + input[0].id;
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input.val().toLowerCase())) {
        $('#' + dvid).removeClass('Error'); //return true;
        return (true)
    }
    $('#' + dvid).addClass('Error'); //return false;
    return (false)


}

        function checkPAN(input) {

            var pattern = new RegExp('^[A-Z]{5}[0-9]{4}[A-Z]{1}$');
            
            var dvid = "dv" + input[0].id;
            //if (pattern.test(input) == false) { $('#' + dvid).addClass('Error'); return false; }
            //else { $('#' + dvid).removeClass('Error'); return true; }
            if (pattern.test(input.val().toUpperCase()) == false) { $('#' + dvid).addClass('Error'); return false; }  //durgesh
            else { $('#' + dvid).removeClass('Error'); return true; }
        }

function HealthDeclarationQuestion(ID, questionid,InsurerQuestionID) {
    if (ID == 'Yes' || ID == true) {
        if (questionid == '1') {
            $('#HealthDeclarationQuestion1').val('Yes');
            $('#HealthDeclaration1Yes').addClass('active');
            $('#HealthDeclaration1Yes').removeClass('active');
            $('#HealthDeclarationSubQuestion').show();
        }
        if (HealthDeclarationQuestion1 == 'Yes') {
            if (questionid == 'sub1') {
                $('#HealthDeclarationSubQuestion1').val('Yes');
                $('#HealthDeclarationSub1Yes').addClass('active');
                $('#HealthDeclarationSub1No').removeClass('active');
            }
            if (questionid == 'sub2') {
                $('#HealthDeclarationSubQuestion2').val('Yes');
                $('#HealthDeclarationSub2Yes').addClass('active');
                $('#HealthDeclarationSub2No').removeClass('active');
            }
            if (questionid == 'sub3') {
                $('#HealthDeclarationSubQuestion3').val('Yes');
                $('#HealthDeclarationSub3Yes').addClass('active');
                $('#HealthDeclarationSub3No').removeClass('active');
            }
            if (questionid == 'sub4') {
                $('#HealthDeclarationSubQuestion4').val('Yes');
                $('#HealthDeclarationSub4Yes').addClass('active');
                $('#HealthDeclarationSub4No').removeClass('active');
            }
            if (questionid == 'sub5') {
                $('#HealthDeclarationSubQuestion5').val('Yes');
                $('#HealthDeclarationSub5Yes').addClass('active');
                $('#HealthDeclarationSub5No').removeClass('active');
            }
            if (questionid == 'sub6') {
                $('#HealthDeclarationSubQuestion6').val('Yes');
                $('#HealthDeclarationSub6Yes').addClass('active');
                $('#HealthDeclarationSub6No').removeClass('active');
            }
            if (questionid == 'sub7') {
                $('#HealthDeclarationSubQuestion7').val('Yes');
                $('#HealthDeclarationSub7Yes').addClass('active');
                $('#HealthDeclarationSub7No').removeClass('active');
            }
        }
    } else {
        if (questionid == '1') {
            $('#HealthDeclarationQuestion1').val('No');
            $('#HealthDeclaration1No').addClass('active');
            $('#HealthDeclaration1Yes').removeClass('active');
            $('#HealthDeclarationSubQuestion').hide();
        }
        if (HealthDeclarationQuestion1 == 'No') {
            if (questionid == 'sub1') {
                $('#HealthDeclarationSubQuestion1').val('No');
                $('#HealthDeclarationSub1Yes').removeClass('active');
                $('#HealthDeclarationSub1No').addClass('active');
            }
            if (questionid == 'sub2') {
                $('#HealthDeclarationSubQuestion2').val('No');
                $('#HealthDeclarationSub2Yes').removeClass('active');
                $('#HealthDeclarationSub2No').addClass('active');
            }
            if (questionid == 'sub3') {
                $('#HealthDeclarationSubQuestion3').val('No');
                $('#HealthDeclarationSub3Yes').removeClass('active');
                $('#HealthDeclarationSub3No').addClass('active');
            }
            if (questionid == 'sub4') {
                $('#HealthDeclarationSubQuestion4').val('No');
                $('#HealthDeclarationSub4Yes').removeClass('active');
                $('#HealthDeclarationSub4No').addClass('active');
            }
            if (questionid == 'sub5') {
                $('#HealthDeclarationSubQuestion5').val('No');
                $('#HealthDeclarationSub5Yes').removeClass('active');
                $('#HealthDeclarationSub5No').addClass('active');
            }
            if (questionid == 'sub6') {
                $('#HealthDeclarationSubQuestion6').val('No');
                $('#HealthDeclarationSub6Yes').removeClass('active');
                $('#HealthDeclarationSub6No').addClass('active');
            }
            if (questionid == 'sub7') {
                $('#HealthDeclarationSubQuestion7').val('No');
                $('#HealthDeclarationSub7Yes').removeClass('active');
                $('#HealthDeclarationSub7No').addClass('active');
            }
        }
    }

}

function MedicalQuestionAns(questionid, ID) {
    if (ID == 'Yes' || ID == true) {

        $('#' + questionid).val('Yes');
        $('#' + questionid +'Y').addClass('active');
        $('#' + questionid +'N').removeClass('active');



    } else if (ID == 'No' || ID == false) {

        $('#' + questionid).val('No');
        $('#' + questionid + 'N').addClass('active');
        $('#' + questionid + 'Y').removeClass('active');
    }

    if ($("#HQ05").val() == "Yes") {
        $('#TobacoConsume').show();
    } else {
        $('#TobacoConsume').hide();
    }

    if ($("#HQ06").val() == "Yes") {
        $('#AlcoholConsume').show();
    } else {
        $('#AlcoholConsume').hide();
    }

    if ($("#HQ09").val() == "Yes") {
        $('#divRemarkHQ09').show();
    } else {
        $('#divRemarkHQ09').hide();
    }
    if ($("#HQ125").val() == "Yes") {
        $('#divRemarkHQ125').show();
    } else {
        $('#divRemarkHQ125').hide();
    }
    if ($("#HQ165").val() == "Yes") {
        $('#divRemarkHQ165').show();
    } else {
        $('#divRemarkHQ165').hide();
    }
    if ($("#HQ166").val() == "Yes") {
        $('#divRemarkHQ166').show();
    } else {
        $('#divRemarkHQ166').hide();
    }
    if ($("#HQ144").val() == "Yes") {
        $('#divRemarkHQ144').show();
    } else {
        $('#divRemarkHQ144').hide();
    }
    if ($("#HQ167").val() == "Yes") {
        //$('#MedicalQuestionSubQuestionHQ167').show();
        $(".pointerNone").css('pointer-events', 'auto');
    } else {
        $(".pointerNone").css('pointer-events', 'none');
        for (var i = 1; i <= 14; i++) {
            $("#SubQuestion" + i + "_HQ167").val("No");
            $('#' + $("#SubQuestion" + i + "_HQ167").attr('id')).val('No');
            $('#' + $("#SubQuestion" + i + "_HQ167").attr('id') + 'N').addClass('active');
            $('#' + $("#SubQuestion" + i + "_HQ167").attr('id') + 'Y').removeClass('active');
            //MedicalQuestionAns($("#SubQuestion" + i + "_HQ167").attr('id'),'No')
        }
        //$('#MedicalQuestionSubQuestionHQ167').hide();
    }
    if ($("#HQ188").val() == "Yes") {
        $('#MedicalQuestionSubQuestionHQ188').show();
    } else {
        $('#MedicalQuestionSubQuestionHQ188').hide();
    }

    if ($("#HQ168").val() == "Yes") {
        $('#divRemarkHQ168').show();
    } else {
        $('#divRemarkHQ168').hide();
    }

    if ($("#HQ21").val() == "Yes") {
        $('#divRemarkHQ21').show();
    } else {
        $('#divRemarkHQ21').hide();
    }

    if ($("#HQ24").val() == "Yes") {
        $('#divRemarkHQ24').show();
    } else {
        $('#divRemarkHQ24').hide();
    }

    if ($("#HQ61").val() == "Yes") {
        $('#divRemarkHQ61').show();
    } else {
        $('#divRemarkHQ61').hide();
    }

}

            function MedicalQuestion(ID, questionid, InsurerQuestionID) {
                
                var Remarks = null;
                if (ID == 'Yes' || ID == true) {

                    $('#MedicalQuestionAns_' + questionid).val('Yes');
                    $('#lblMedicalQuestionSelfYes_' + questionid).addClass('active');
                    $('#lblMedicalQuestionSelfNo_' + questionid).removeClass('active');


                } else if (ID == 'No' || ID == false) {
                    $('#MedicalQuestionAns_' + questionid).val('No');
                    $('#lblMedicalQuestionSelfNo_' + questionid).addClass('active');
                    $('#lblMedicalQuestionSelfYes_' + questionid).removeClass('active');
                }

                

                if ($("#MedicalQuestionAns_1403").val() == "Yes") {
                    $("#TobacoConsume").show();
                }
                else {
                    $("#TobacoConsume").hide();
                }

                if ($("#MedicalQuestionAns_1404").val() == "Yes") {
                    $("#AlcoholConsume").show();
                }
                else {
                    $("#AlcoholConsume").hide();
                }

                if ($("#MedicalQuestionAns_1406").val() == "Yes") {
                    $("#MedicalQuestionRemark1406").show();
                } else {
                    $("#MedicalQuestionRemark1406").hide();
                }
                if ($("#MedicalQuestionAns_1407").val() == "Yes") {
                    $("#MedicalQuestionRemark1407").show();
                } else {
                    $("#MedicalQuestionRemark1407").hide();
                }
                if ($("#MedicalQuestionAns_1408").val() == "Yes") {
                    $("#MedicalQuestionRemark1408").show();
                } else {
                    $("#MedicalQuestionRemark1408").hide();
                }
                if ($("#MedicalQuestionAns_1409").val() == "Yes") {
                    $("#MedicalQuestionRemark1409").show();
                } else {
                    $("#MedicalQuestionRemark1409").hide();
                }
                if ($("#MedicalQuestionAns_1410").val() == "Yes") {
                    $("#MedicalQuestionRemark1410").show();
                } else {
                    $("#MedicalQuestionRemark1410").hide();
                }
                if ($("#MedicalQuestionAns_1411").val() == "Yes" || $("#MedicalQuestionAns_1411").val() == true) {
                    $("#MedicalQuestionRemark1411").show();
                } else if ($("#MedicalQuestionAns_1411").val() == "No" || $("#MedicalQuestionAns_1411").val() == false) {
                    $("#MedicalQuestionRemark1411").hide();
                }
                if ($("#MedicalQuestionAns_1416").val() == "Yes" || $("#MedicalQuestionAns_1416").val() == true) {
                    $("#MedicalQuestionRemark1416").show();
                } else if ($("#MedicalQuestionAns_1416").val() == "No" || $("#MedicalQuestionAns_1416").val() == false) {
                    $("#MedicalQuestionRemark1416").hide();
                }
                if ($("#MedicalQuestionAns_1412").val() == "Yes") {
                    $("#MedicalQuestionRemark1412").show();
                } else {
                    $("#MedicalQuestionRemark1412").hide();
                }
                if ($("#MedicalQuestionAns_1413").val() == "Yes") {
                    $("#MedicalQuestionRemark1413").show();
                } else {
                    $("#MedicalQuestionRemark1413").hide();
                }
                if ($("#MedicalQuestionAns_1414").val() == "Yes") {
                    $("#MedicalQuestionRemark1414").show();
                }
                else {
                    $("#MedicalQuestionRemark1414").hide();
                }


                //var medicalquestion1411 = $("#MedicalQuestionAns_1411").val();
                //if (medicalquestion1411 != "" || medicalquestion1411 != null) {
                //    if ($("#MedicalQuestionAns_1411").val() == "Yes") {
                //        $("#MedicalQuestionSubQuestionHQ167").show();
                //    }
                //    else {
                //        $("#MedicalQuestionSubQuestionHQ167").hide();
                //    }
                //}

                var medicalquestion1416 = $("#MedicalQuestionAns_1416").val();
                if (medicalquestion1416 != "" || medicalquestion1416 != null) {
                    if ($("#MedicalQuestionAns_1416").val() == "Yes") {
                        $("#MedicalQuestionSubQuestionHQ188").show();
                    }
                    else {
                        $("#MedicalQuestionSubQuestionHQ188").hide();
                    }
                }

                $.get('/TermInsuranceIndia/FillMedicalQuestionAnswerSet?Question_Id=' + questionid + '&Answer=' + ID + '&InsurerQuestionID=' + InsurerQuestionID + '&Remarks=' + Remarks, function (response) {

                    var _content = $.parseJSON(response);
                    //$("#tdMedicalQuestion").html(_content);
                });


            }
//function EIA(ID) {

//    if (ID == 'Yes') {
//        $('#EIA').val('Yes');
//        $("#EIAY").addClass('active');
//        $("#EIAN").removeClass('active');
//        $("#dvEIAno").show();

//    }
//    else if (ID == 'No') {
//        $('#EIA').val('No');
//        $("#EIAN").addClass('active');
//        $("#EIAY").removeClass('active');
//        $("#dvEIAno").hide();

//    }
//}


function IpruPolicy(ID) {

    if (ID == 'Yes') {
        $('#IpruPolicy').val('Yes');
        $("#IpruPolicyY").addClass('active');
        $("#IpruPolicyN").removeClass('active');
        $("#dvIpruPolicyno").show();

    }
    else if (ID == 'No') {
        $('#IpruPolicy').val('No');
        $("#IpruPolicyN").addClass('active');
        $("#IpruPolicyY").removeClass('active');
        $("#dvIpruPolicy").hide();

    }
}
            function SubMedicalQuestion(ID, questionid) {

                if (ID == 'Yes' || ID == true) {
                    
                    $('#SubMedicalQuestionAns_' + questionid).val('Yes');
                    $('#lblSubMedicalQuestionSelfYes_' + questionid).addClass('active');
                    $('#lblSubMedicalQuestionSelfNo_' + questionid).removeClass('active');



                } else if (ID == 'No' || ID == false) {
                    $('#SubMedicalQuestionAns_' + questionid).val('No');
                    $('#lblSubMedicalQuestionSelfNo_' + questionid).addClass('active');
                    $('#lblSubMedicalQuestionSelfYes_' + questionid).removeClass('active');
                }

                $.get('/TermInsuranceIndia/SetMedicalSubAnswer?Question_Id=' + questionid + '&Answer=' + ID, function (response) {
                    var _content = $.parseJSON(response);
                });

}

$("#txtBankLoc").keypress(function (e) {

    var regex = new RegExp("^[a-zA-Z0-9 ]*$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});

$("#txtBankName").keypress(function (e) {

    var regex = new RegExp("^[a-zA-Z0-9 ]*$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});
$("#txtBankName").keypress(function (e) {

    var regex = new RegExp("^[a-zA-Z0-9 ]*$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});
$("#txtBankIFSC").keypress(function (e) {

    var regex = new RegExp("^[a-zA-Z0-9 ]*$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});
$("#NomineeFirstName").keypress(function (e) {

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
$("#NomineeLastName").keypress(function (e) {

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
$("#AppointeeFirstName").keypress(function (e) {

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
$("#AppointeeLastName").keypress(function (e) {

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
$("#AadharNo").keypress(function (e) {

    var regex = new RegExp("^[0-9]*$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});
            //$(".Remarks").focusout(function () { // focusout method to bind function

            //    var RemarksID = $(this).attr('id');
            //    var Remarks = $(this).val();
            //    var arr = RemarksID.split('_');


            //    $.get('/TermInsuranceIndia/FillMedicalQuestionAnswerSet?Question_Id=' + arr[1] + '&Answer=Yes&InsurerQuestionID=' + arr[2] + '&Remarks=' + Remarks, function (response) {

            //        var _content = $.parseJSON(response);
            //        //$("#tdMedicalQuestion").html(_content);
            //    });

            //});
//function ContactGender(ID) {
//    if (ID == 'Male') {
//        $('#ContactGender').val('Male');
//        $("#ContactGenderM").addClass('active');
//        $("#ContactGenderF").removeClass('active');

//    }
//    else {
//        $('#ContactGender').val('Female');
//        $("#ContactGenderM").addClass('active');
//        $("#ContactGenderF").removeClass('active');
//    }
//}

//function MarriedWomensAct(ID) {
//    if (ID == 'Yes') {
//        $('#MarriedWomensAct').val('Yes');
//        $("#MarriedWomensActY").addClass('active');
//        $("#MarriedWomensActN").removeClass('active');
      
//    }
//    else {
//        $('#MarriedWomensAct').val('No');
//        $("#MarriedWomensActN").addClass('active');
//        $("#MarriedWomensActY").removeClass('active');
      

//    }
//}
//function MarriedWomensAct(ID) {

//    if (ID == 'Yes') {
//        $('#MarriedWomensAct').val('Yes');
//        $("#MarriedWomensActY").addClass('active');
//        $("#MarriedWomensActN").removeClass('active');
//        $("#MarriedWomensActYes").show();
//    }
//    else {
//        $("#MarriedWomensActYes").hide();
//        $('#MarriedWomensAct').val('No');
//        $("#MarriedWomensActN").addClass('active');
//        $("#MarriedWomensActY").removeClass('active');
//    }

//}
//$("#DrivingLicenseExpiry").datepicker({
//    changeMonth: true,
//    changeYear: true,
//    yearRange: "-100:+20",
//    dateFormat: 'dd-mm-yy',
//    minDate: '+1',
//    maxDate: '20y',
//    onSelect: function () { $('#dvDrivingLicenseExpiry').removeClass('Error'); }
//});
//$("#dvDrivingLicenseExpiry").click(function () { $("#DrivingLicenseExpiry").datepicker("show"); if ($('#DrivingLicenseExpiry').val() != "") { $('#dvDrivingLicenseExpiry').removeClass('Error'); } });
//Existing Policy Add and Remove
$("#add_policy2").click(function () {
    $("#dvadd_policy2").hide();
    $("#dvadd_policy3").show();
    $("#dvadd_policy4").hide();
    $("#dvadd_policy5").hide();
    
    $("#dvRemove_policy2").show();
    $("#dvRemove_policy3").hide();
    $("#dvRemove_policy4").hide();
    $("#dvRemove_policy5").hide();
    var ExistingInsuranceCount = $("#ExistingInsuranceCount").val();
    ExistingInsuranceCount++;
    $("#ExistingInsuranceCount").val(ExistingInsuranceCount);
    $("#dvExistingPolicy2").show();

})

$("#add_policy3").click(function () {
    $("#dvadd_policy2").hide();
    $("#dvadd_policy4").show();
    $("#dvadd_policy3").hide();
    $("#dvadd_policy5").hide();

    $("#dvRemove_policy3").show();
    $("#dvRemove_policy2").hide();
    $("#dvRemove_policy4").hide();
    $("#dvRemove_policy5").hide();
    var ExistingInsuranceCount = $("#ExistingInsuranceCount").val();
    ExistingInsuranceCount++;
    $("#ExistingInsuranceCount").val(ExistingInsuranceCount);
    $("#dvExistingPolicy3").show();

})


$("#add_policy4").click(function () {
    $("#dvadd_policy2").hide();
    $("#dvadd_policy5").show();
    $("#dvadd_policy3").hide();
    $("#dvadd_policy4").hide();

    $("#dvRemove_policy4").show();
    $("#dvRemove_policy2").hide();
    $("#dvRemove_policy3").hide();
    $("#dvRemove_policy5").hide();
    var ExistingInsuranceCount = $("#ExistingInsuranceCount").val();
    ExistingInsuranceCount++;
    $("#ExistingInsuranceCount").val(ExistingInsuranceCount);
    $("#dvExistingPolicy4").show();

})


$("#add_policy5").click(function () {
    $("#dvadd_policy2").hide();
    $("#dvadd_policy5").hide();
    $("#dvadd_policy3").hide();
    $("#dvadd_policy4").hide();

    $("#dvRemove_policy5").show();
    $("#dvRemove_policy2").hide();
    $("#dvRemove_policy3").hide();
    $("#dvRemove_policy4").hide();
    var ExistingInsuranceCount = $("#ExistingInsuranceCount").val();
    ExistingInsuranceCount++;
    $("#ExistingInsuranceCount").val(ExistingInsuranceCount);
    $("#dvExistingPolicy5").show();

})



$("#Remove_policy2").click(function () {
    $("#dvExistingPolicy2").hide();
    $("#dvRemove_policy2").hide();
    $("#dvadd_policy2").show();
    $("#dvadd_policy3").hide();
    $("#dvadd_policy4").hide();
    $("#dvadd_policy5").hide();
    var ExistingInsuranceCount = $("#ExistingInsuranceCount").val();
    ExistingInsuranceCount--
    $("#ExistingInsuranceCount").val(ExistingInsuranceCount);
})

$("#Remove_policy3").click(function () {
    $("#dvExistingPolicy3").hide();
    $("#dvRemove_policy3").hide();
    $("#dvRemove_policy2").show();
    $("#dvadd_policy3").show();
    $("#dvadd_policy2").hide();
    $("#dvadd_policy4").hide();
    $("#dvadd_policy5").hide();
    var ExistingInsuranceCount = $("#ExistingInsuranceCount").val();
    ExistingInsuranceCount--
    $("#ExistingInsuranceCount").val(ExistingInsuranceCount);
})


$("#Remove_policy4").click(function () {
    $("#dvExistingPolicy4").hide();
    $("#dvRemove_policy4").hide();
    $("#dvRemove_policy3").show();
    $("#dvadd_policy4").show();
    $("#dvadd_policy2").hide();
    $("#dvadd_policy3").hide();
    $("#dvadd_policy5").hide();
    var ExistingInsuranceCount = $("#ExistingInsuranceCount").val();
    ExistingInsuranceCount--
    $("#ExistingInsuranceCount").val(ExistingInsuranceCount);
})


$("#Remove_policy5").click(function () {
    $("#dvExistingPolicy5").hide();
    $("#dvRemove_policy5").hide();
    $("#dvRemove_policy4").show();
    $("#dvadd_policy5").show();
    $("#dvadd_policy2").hide();
    $("#dvadd_policy3").hide();
    $("#dvadd_policy4").hide();
    var ExistingInsuranceCount = $("#ExistingInsuranceCount").val();
    ExistingInsuranceCount--
    $("#ExistingInsuranceCount").val(ExistingInsuranceCount);
})

$("#ProposerOthsersOrganisationType").change(function () {
    if ($('#ProposerOthsersOrganisationType').val() == "NOT ANSWERED") {
        $('#divProposerOthsersOrganisationTypeDesc').show();
    } else {
        $('#divProposerOthsersOrganisationTypeDesc').hide();
    }
})
$("#ProposerOthersNameOfOrganisation").change(function () {
    if ($('#ProposerOthersNameOfOrganisation').val() == "Others") {
        $('#divProposerOthersNameOfOrganisationDesc').show();
    } else {
        $('#divProposerOthersNameOfOrganisationDesc').hide();
    }
})
$("#ProposerSelfEmpOrganisationType").change(function () {
    if ($('#ProposerSelfEmpOrganisationType').val() == "NOT ANSWERED") {
        $('#divProposerSelfEmpOrganisationTypeDesc').show();
    } else {
        $('#divProposerSelfEmpOrganisationTypeDesc').hide();
    }
})
$("#ProposerNameOfOrganisation").change(function () {
    if ($('#ProposerNameOfOrganisation').val() == "Others") {
        $('#divProposerNameOfOrganisationDesc').show();
    } else {
        $('#divProposerNameOfOrganisationDesc').hide();
    }
})
$("#ProposerOrganisationType").change(function () {
    if ($('#ProposerOrganisationType').val() == "NOT ANSWERED") {
        $('#divProposerOrganisationTypeDesc').show();
    } else {
        $('#divProposerOrganisationTypeDesc').hide();
    }
})
$('#ProposerOccupationalDetails').change(function () {
    if ($("#ProposerOccupationalDetails option:selected").val() == "HSWF" || $("#ProposerOccupationalDetails option:selected").val() == "STDN") {
        
        if ($("#SumAssuredval").val() > 5000000) {
            $("#submitSendPaymentlink").css("pointer-events", "none");
            alert("SumAssured must be less than 50Lakh for Occupation Selected as Housewife or Student.");
        } else {
            $("#submitSendPaymentlink").css("pointer-events", "auto");
        }
    } else {
        $("#submitSendPaymentlink").css("pointer-events", "auto");
    }
});

$('#submitSendPaymentlink').click(function () {
    if ($("#ProposerOccupationalDetails option:selected").val() == "HSWF" || $("#ProposerOccupationalDetails option:selected").val() == "STDN") {

        if ($("#SumAssuredval").val() > 5000000) {
            $("#submitSendPaymentlink").css("pointer-events", "none");
            alert("SumAssured must be less than 50Lakh for Occupation Selected as Housewife or Student.");
        } else {
            $("#submitSendPaymentlink").css("pointer-events", "auto");
        }
    } else {
        $("#submitSendPaymentlink").css("pointer-events", "auto");
    }
});

$("#ProposerOccupationalDetails").change(function () {
    if ($("#ProposerOccupationalDetails option:selected").val() == "SPVT" || $("#ProposerOccupationalDetails option:selected").val() == "BSEM" || $("#ProposerOccupationalDetails option:selected").val() == "SPRO") {
        $("#divindutriesblock").show();
    } else {
        $("#divindutriesblock").hide();
    }
})

$('input[type="checkbox"]').val(true);
$('input[type="checkbox"]').attr("checked");
if ($('input[type="checkbox"]').prop("checked") == true) {
    //debugger
    $('input[type="checkbox"]').val(true);
    $("#LifeAssured").hide();
}
else if ($('input[type="checkbox"]').prop("checked") == false) {
    $('input[type="checkbox"]').val(false);
    $("#LifeAssured").show();
}

$('input[type="checkbox"]').change(function () {
    if ($('input[type="checkbox"]').prop("checked") == true) {
        // debugger
        $('input[type="checkbox"]').val(true);
        $("#LifeAssured").hide();
    }
    else if ($('input[type="checkbox"]').prop("checked") == false) {
        $('input[type="checkbox"]').val(false);
        $("#LifeAssured").show();
    }
});

$("#ContactGender").change(function () {
    if ($("#ContactGender").val() == "Male" && $("#MaritalStatus").val() == "696") {
        $("#MWPADiv").show();
    } else {
        $("#MWPADiv").hide();
    }
});
$("#ContactTitle").change(function () {

    setGender();

});
 $("#MaritalStatus").change(function () {
     if ($("#ContactGender").val() == "Male" && $("#MaritalStatus").val() == "696") {
            $("#MWPADiv").show();
        } else {
            $("#MWPADiv").hide();
        }
});

$("#divindustries").click(function () {
    if ($("#industries").val() == "Yes") {
        $("#divIndustry").show();
    } else {
        $("#divIndustry").hide();
    }
});

//$("#HQ167").change(function () {
//    if ($("#HQ167").val() == "Yes") {
//        if ($("#SubQuestion1_HQ167").val() == "No" && $("#SubQuestion2_HQ167").val() == "No" && $("#SubQuestion3_HQ167").val() == "No" && $("#SubQuestion4_HQ167").val() == "No" && $("#SubQuestion5_HQ167").val() == "No" && $("#SubQuestion6_HQ167").val() == "No" && $("#SubQuestion7_HQ167").val() == "No" && $("#SubQuestion8_HQ167").val() == "No" && $("#SubQuestion9_HQ167").val() == "No" && $("#SubQuestion10_HQ167").val() == "No" && $("#SubQuestion11_HQ167").val() == "No" && $("#SubQuestion12_HQ167").val() == "No" && $("#SubQuestion13_HQ167").val() == "No" && $("#SubQuestion14_HQ167").val() == "No") {
//            alert("Atleast one subquestion must be answered as YES");
//        }
//    }
//});