
$(document).ready(function () {
    var regExEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var regExAlpha = /^[a-zA-Z ]*$/;
    var regExNumbers = /^\d+$/;
    var regExAphaNumeric = "^[a-zA-Z0-9]+$";
    var regExPan = /[A-Za-z]{5}\d{4}[A-Za-z]{1}/;
    var regExAdhaar = /^\d{ 4}\s\d{ 4}\s\d{ 4}$/;
    var regExAphaNumericWithSpace = "^[a-zA-Z0-9 ]+$";
    var regAlphabetswithspace = "^[a-zA-Z ]+$";

    $.validator.addMethod("regExAlpha", function (value, element, regExAlpha) {
        var check = false;
        return this.optional(element) || regExAlpha.test(value);
    }, "Alphabets only");

    $.validator.addMethod("regExEmail", function (value, element, regExEmail) {
        var check = false;
        return this.optional(element) || regExEmail.test(value);
    }, "Invalid Email.");

    $.validator.addMethod("regExNumbers", function (value, element, regExNumbers) {
        var check = false;
        return this.optional(element) || regExNumbers.test(value);
    }, "Digits only.");

    $.validator.addMethod("AlphaNumRegEx", function (value, element, regExAphaNumeric) {
        var check = false;
        return this.optional(element) || regExAphaNumeric.test(value);
    }, "Enter alphanumeric value.");

    $.validator.addMethod("regExPan", function (value, element, regExPan) {
        var check = false;
        return this.optional(element) || regExPan.test(value);
    }, "Invalid pan number.");

    $.validator.addMethod("regExAdhaar", function (value, element, regExAdhaar) {
        var check = false;
        return this.optional(element) || regExAdhaar.test(value);
    }, "Invalid adhaar number.");

    debugger
    $.validator.addMethod("maxNomAllocation", function (value, element, params) {
        var check = false;
        var sumOfAllocation = 0;

        //sumOfAllocation = parseInt(parseInt($("#txtNomineeAllocation1").val() == "" ? "0" : $("#txtNomineeAllocation1").val()) + parseInt($("#txtNomineeAllocation2").val() == "" ? "0" : $("#txtNomineeAllocation2").val()) + parseInt($("#txtNomineeAllocation3").val() == "" ? "0" : $("#txtNomineeAllocation3").val()));
        //if (sumOfAllocation == params) { return true; }
        //else { return false; }
        return true;
    }, "Sum of all Nominees share should be 100.");


    ///Show hide initial functions
    $("#divEmployment").hide();




    //$("#btnCustomer").click(function () {
    //    var regExEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    //    var regExAlpha = /^[A-Za-z]+$/;
    //    var regExNumbers = /^\d+$/;
    //    var regExAphaNumeric = "^[a-zA-Z0-9]+$";
    //    var laTitle = $("#ddlLATitle").val();
    //    if (laTitle == "0")
    //    {
    //        $("#spanLaTitle").text('Please select title');
    //    }
    //});

    //$("#rdbLACorrAddrY").click(function () {
    //    $("#currentaddrsdiv").hide();
    //});

    //$("#rdbLACorrAddrN").click(function () {
    //    $("#currentaddrsdiv").show();
    //});
});

/////////////// End of Document.ready ///////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$("#btnEINS").click(function () {

    if ($("#IsCustomer").val() == "False" && $("#islasame").val() == "Y") {
        valid = ValidatePersonalAgentLoginSpuse();

    } else if ($("#IsCustomer").val() == "False") {
        valid = ValidatePersonalAgentLogin();
    }
    else {
        valid = ValidateOthers();
    }
    if (valid) {
        return true;
        // $('#modalTnC').modal('open');

    } else {
        return false;
    }
});

$("#btnQues4").click(function () {
    var valid = false;
    // valid = ValidatePersonal();
    //if ($("#IsCustomer").val() == "False" && $("#islasame").val() == "Y") {
    //    valid = ValidatePersonalAgentLoginSpuse();

    //} else if ($("#IsCustomer").val() == "False") {
    //    valid = ValidatePersonalAgentLogin();
    //}
    //else {
    //    valid = ValidateOthers();
    //}
    //if (valid) {

    //    $("#divQues4").css("display", "none");
    //    $("#taxinfodiv").css("display", "block");
    //}

    //var valid = false;
    // valid = ValidatePersonal();
    if ($("#IsCustomer").val() == "False" && $("#islasame").val() == "Y") {
        valid = ValidatePersonalAgentLoginSpuse();

    } else if ($("#IsCustomer").val() == "False") {
        valid = ValidatePersonalAgentLogin();
    }
    else {
        valid = ValidateOthers();
    }
    if (valid) {

        if ($("#IsCustomer").val() == "True") {
            var famRowsCount = 0;
            var spousefamRowsCount = 0;
            if ($("#tblYourFamRowCount").val() != "" && $("#tblYourFamRowCount").val() != null && $("#tblYourFamRowCount").val() != undefined) {
                famRowsCount = parseInt($("#tblYourFamRowCount").val());
            }



            if (parseInt(famRowsCount) < 1) {
                alert("Please add family details");
                return false;
            }
            if ($("#islasame").val() == "N") {
                if ($("#tblSpouseFamRowCount").val() != "" && $("#tblSpouseFamRowCount").val() != null && $("#tblSpouseFamRowCount").val() != undefined) {
                    spousefamRowsCount = parseInt($("#tblSpouseFamRowCount").val());
                }
                if (parseInt(spousefamRowsCount) < 1) {
                    alert("Please add spouse family details");
                    return false;
                }
            }


            if (famRowsCount > 0) {

                if ($("#islasame").val() == "N") {
                    if (famRowsCount > 0 && spousefamRowsCount > 0) {
                        $("#divQues4").css("display", "none");
                        $("#taxinfodiv").css("display", "block");
                    }
                }
                else {
                    $("#divQues4").css("display", "none");
                    $("#taxinfodiv").css("display", "block");
                }


                //$("#divQues3").css("display", "none");
                //$("#divQues4").css("display", "block");
                //if ($("#islasame").val() == "N") {
                //    $("#divSpouseFam").css("display", "block");
                //}

            }
        } else {
            if ($("#IsCustomer").val() == "True") {
                var famRowsCount = 0;


                if ($("#tblFamInsRowCount").val() != "" && $("#tblFamInsRowCount").val() != null && $("#tblFamInsRowCount").val() != undefined) {
                    famRowsCount = parseInt($("#tblFamInsRowCount").val());
                }



                if (parseInt(famRowsCount) < 2) {
                    alert("Please add family income and family insurance details");
                    return false;
                }

                //        //var ExistInsRowsCount = 0;

                //        //if ($("#tblExstInsRowCount").val() != "" && $("#tblExstInsRowCount").val() != null && $("#tblExstInsRowCount").val() != undefined) {
                //        //    ExistInsRowsCount = $("#tblExstInsRowCount").val();
                //        //}

                //        //if ($("#rdbLADiscloseInsur1Y").val() == true) {
                //        //    if (ExistInsRowsCount < 1) {
                //        //        alert("Please add family income and family insurance details");
                //        //        return false;
                //        //    }
                //        //}



                if (famRowsCount == 0) {
                    $("#divQues4").css("display", "none");
                    $("#taxinfodiv").css("display", "block");
                    //$("#divQues3").css("display", "none");
                    //$("#divQues4").css("display", "block");
                    //if ($("#islasame").val() == "N") {
                    //    $("#divSpouseFam").css("display", "block");
                    //}
                }
            }
            else {
                $("#divQues4").css("display", "none");
                $("#taxinfodiv").css("display", "block");
            }
        }
    }

});

$("#btnQues3").click(function () {
    var valid = false;
    // valid = ValidatePersonal();
    if ($("#IsCustomer").val() == "False" && $("#islasame").val() == "Y") {
        valid = ValidatePersonalAgentLoginSpuse();

    } else if ($("#IsCustomer").val() == "False") {
        valid = ValidatePersonalAgentLogin();
    }
    else {
        valid = ValidateOthers();
    }
    if (valid) {

        if ($("#IsCustomer").val() == "True") {
            var famRowsCount = 0;
            if ($("#tblFamInsRowCount").val() != "" && $("#tblFamInsRowCount").val() != null && $("#tblFamInsRowCount").val() != undefined) {
                famRowsCount = parseInt($("#tblFamInsRowCount").val());
            }

            var ExistInsRowsCount = 0;

            if ($("#tblExstInsRowCount").val() != "" && $("#tblExstInsRowCount").val() != null && $("#tblExstInsRowCount").val() != undefined) {
                ExistInsRowsCount = $("#tblExstInsRowCount").val();
            }

            if ($('input:radio[name=rdbLADiscloseInsur1]:checked').val() == "yes") {
                if (ExistInsRowsCount < 1) {
                    alert("Please add  Existing Insurance Details");
                    return false;
                    $("#divQues3").css("display", "none");
                    $("#divQues4").css("display", "block");
                    if ($("#islasame").val() == "N") {
                        $("#divSpouseFam").css("display", "block");
                    }
                    return true;
                }
            }



            if (parseInt(famRowsCount) < 1) {
                if ($("#ddlLAEmployment").val() == 8 || $("#ddlLAEmployment").val() == 6 || $("#ddlLAEmployment").val() == 5) {
                    alert("Please add family income and family insurance details");
                    return false;
                }
                $("#divQues3").css("display", "none");
                $("#divQues4").css("display", "block");
                if ($("#islasame").val() == "N") {
                    $("#divSpouseFam").css("display", "block");
                }
                return true;
            }





            //if (famRowsCount > 0) {
            $("#divQues3").css("display", "none");
            $("#divQues4").css("display", "block");
            if ($("#islasame").val() == "N") {
                $("#divSpouseFam").css("display", "block");
            }

            //}
        } else {
            var famRowsCount = 0;


            //if ($("#tblFamInsRowCount").val() != "" && $("#tblFamInsRowCount").val() != null && $("#tblFamInsRowCount").val() != undefined) {
            //    famRowsCount = parseInt($("#tblFamInsRowCount").val());
            //}

            //if (parseInt(famRowsCount) < 2) {
            //    alert("Please add family income and family insurance details");
            //    return false;
            //}

            //var ExistInsRowsCount = 0;

            //if ($("#tblExstInsRowCount").val() != "" && $("#tblExstInsRowCount").val() != null && $("#tblExstInsRowCount").val() != undefined) {
            //    ExistInsRowsCount = $("#tblExstInsRowCount").val();
            //}

            //if ($("#rdbLADiscloseInsur1Y").val() == true) {
            //    if (ExistInsRowsCount < 1) {
            //        alert("Please add family income and family insurance details");
            //        return false;
            //    }
            //}



            // if (famRowsCount == 0) {
            $("#divQues3").css("display", "none");
            $("#divQues4").css("display", "block");
            if ($("#islasame").val() == "N") {
                $("#divSpouseFam").css("display", "block");
            }
            // }
        }
    }



});


$("#btnQues2").click(function () {
    //var valid = false;
    //valid = ValidatePersonal();
    if ($("#IsCustomer").val() == "False") {
        valid = ValidateHealthAgentLogin();
    } else {
        valid = ValidateHealth();
    }

    if (valid) {
        $("#divQues2").css("display", "none");

        openTab(event, 'OtherDetails');
        $("#OtherDetailsTab").prop("disabled", false);
        $("#divQues3").css("display", "block");

        if ($("#islasame").val() == "Y") {
            $(".spouseQues3Fields").css("display", "none");
        }
        $("#divQues4").css("display", "none");
        $("#taxinfodiv").css("display", "none");
        $("#divEINSBank").css("display", "none");
        $("#thankyoudiv").css("display", "none");
        laEmpType = $("#ddlLAEmployment").val();
        if (laEmpType == "5" || laEmpType == "6" || laEmpType == "8" || laEmpType == "3") {
            $("#divFamilyIncomeIns").css("display", "block");
        }
        else {
            $("#divFamilyIncomeIns").css("display", "none");
        }


    }
});


$("#btnQues1").click(function () {
    var valid = false;
    //valid = ValidatePersonal();
    if ($("#IsCustomer").val() == "False") {
        valid = ValidateHealthAgentLogin();
    } else {
        valid = ValidateHealth();
    }


    if (valid) {
        $("#divQues1").css("display", "none");

        $("#divQues2").css("display", "block");

        if ($("#islasame").val() == "Y") {
            $(".spouseQues2Fields").css("display", "none");

            if ($("#ddlLATitle").val() == "2") {
                $(".divFemaleQues").css("display", "block");
                $(".LAfemaleQues2").attr("disabled", false);
            }
        }
        if ($("#islasame").val() == "N") {

            if ($("#ddlLATitle").val() == "1") {
                $(".divFemaleQues").css("display", "block");
                $(".LAfemaleQues2").attr("disabled", true);
                $(".SpousefemaleQues2").attr("disabled", false);
            }
            else if ($("#ddlLATitle").val() == "2") {
                $(".divFemaleQues").css("display", "block");
                $(".LAfemaleQues2").attr("disabled", false);
                $(".SpousefemaleQues2").attr("disabled", true);
            }
        }
    }
});


//for Height details
$("#btnHeight").click(function () {

    var valid = false;

    //  valid = ValidateHealth();
    if ($("#IsCustomer").val() == "False") {
        valid = ValidateHealthAgentLogin();
    } else {
        valid = ValidateHealth();
    }

    if (valid) {
        $("#divheightDetails").css("display", "none");

        $("#divQues1").css("display", "block");

        if ($("#islasame").val() != "N") {
            $(".spouseQues1Fields").css("display", "none");
        }


    }
});

function ValidateHealth() {

    var validform = $("#FormHealthDetails").validate({
        rules: {

            //Prop details
            ddlLAHeight: { required: true },
            ddlLAInches: { required: true },
            txtweight: { required: true, regExNumbers: /^\d+$/ },
            rdbLAWeightVariation: { required: true },
            ddlLAWeightVariation: { required: true },
            ddlLAWeightVariationReason: { required: true },

            //Spouse details
            ddlSpouseHeight: { required: true },
            ddlSpouseInches: { required: true },
            txtSpouseWeight: { required: true, regExNumbers: /^\d+$/ },
            rdbSpouseWeightVariation: { required: true },
            ddlSpouseWeightVariation: { required: true },
            ddlSpouseWeightVariationReason: { required: true },

            //LA Health
            rdbLATravelOutsideIndia: { required: true },
            rdbLAPilot: { required: true },
            rdbLADrugs: { required: true },
            //  txtLADrugDetail: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            txtLADrugDetail: { required: true, regAlphabetswithspace: /^[a-zA-Z ]+$/ },
            rdbLAAlcohol: { required: true },
            txtLABeer: { required: true, regExNumbers: /^\d+$/ },
            txtLAHardLiquor: { required: true, regExNumbers: /^\d+$/ },
            txtLAWine: { required: true, regExNumbers: /^\d+$/ },
            rdbLASmoker: { required: true },
            txtLACigar: { required: true, regExNumbers: /^\d+$/ },
            txtLABidi: { required: true, regExNumbers: /^\d+$/ },
            txtLAgutka: { required: true, regExNumbers: /^\d+$/ },
            txtLAPaan: { required: true, regExNumbers: /^\d+$/ },
            rdbLAStopTabacco: { required: true },
            txtLAStopTobaccoDuration: { required: true, regExNumbers: /^\d+$/ },
            txtLAStopTobaccoReason: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbLADoctor: { required: true },
            txtLADoctorDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbLATests: { required: true },
            txtLATestsDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbLAAdmitted: { required: true },
            txtLAAdmittedDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbLAMedication: { required: true },
            txtLAMedicationDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbLAHeart: { required: true },
            txtLAHeartDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbLABp: { required: true },
            txtLABPDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbLALung: { required: true },
            rdbLADiabetes: { required: true },
            txtLADiabetesDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbLADisease: { required: true },
            txtLADiseaseDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbLADigestive: { required: true },
            txtLADigestiveDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbLACancer: { required: true },
            txtLACancerDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbLATropical: { required: true },
            txtLATropicalDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbLAThyroid: { required: true },
            txtLAThyroidDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbLABlood: { required: true },
            txtLABloodDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbLANeuro: { required: true },
            txtLANeuroDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbLADisorder: { required: true },
            txtLADisorderDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbLAAids: { required: true },
            txtLAAidsDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbLAAlcoholic: { required: true },
            txtLAAlcoholicDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbLAOtherill: { required: true },
            txtLAOtherillDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbLADeformity: { required: true },
            txtLADeformityDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbLASymptoms: { required: true },
            txtLASymptomsDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbLAHospitalized: { required: true },
            txtLAHospitalizedDate: { required: true },
            rdbLAMediRecover: { required: true },
            txtLAMediRecoverDetail: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            chkLAActivities: { required: true },
            rdbLAPregnant: { required: true },
            rdbLAPregAbnorm: { required: true },
            //Spouse Health
            rdbSpouseTravelOutsideIndia: { required: true },
            rdbSpousePilot: { required: true },
            rdbSpouseDrugs: { required: true },
            txtSpouseDrugDetail: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbSpouseAlcohol: { required: true },
            txtSpouseBeer: { required: true, regExNumbers: /^\d+$/ },
            txtSpouseHardLiquor: { required: true, regExNumbers: /^\d+$/ },
            txtSpouseWine: { required: true, regExNumbers: /^\d+$/ },
            rdbSpouseSmoker: { required: true },
            txtSpouseCigar: { required: true },
            txtSpouseBidi: { required: true, regExNumbers: /^\d+$/ },
            txtSpousegutka: { required: true, regExNumbers: /^\d+$/ },
            txtSpousePaan: { required: true },
            rdbSpouseStopTabacco: { required: true },
            txtSpouseStopTobaccoDuration: { required: true },
            txtSpouseStopTobaccoReason: { required: true },
            rdbSpouseDoctor: { required: true },
            txtSpouseDoctorDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbSpouseTests: { required: true },
            txtSpouseTestsDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbSpouseAdmitted: { required: true },
            txtSpouseAdmittedDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbSpouseMedication: { required: true },
            txtSpouseMedicationDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbSpouseHeart: { required: true },
            txtSpouseHeartDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbSpouseBp: { required: true },
            txtSpouseBPDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbSpouseLung: { required: true },
            rdbSpouseDiabetes: { required: true },
            txtSpouseDiabetesDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbSpouseDisease: { required: true },
            txtSpouseDiseaseDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbSpouseDigestive: { required: true },
            txtSpouseDigestiveDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbSpouseCancer: { required: true },
            txtSpouseCancerDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbSpouseTropical: { required: true },
            txtSpouseTropicalDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbSpouseThyroid: { required: true },
            txtSpouseThyroidDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbSpouseBlood: { required: true },
            txtSpouseBloodDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbSpouseNeuro: { required: true },
            txtSpouseNeuroDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbSpouseDisorder: { required: true },
            txtSpouseDisorderDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbSpouseAids: { required: true },
            txtSpouseAidsDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbSpouseAlcoholic: { required: true },
            txtSpouseAlcoholicDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbSpouseOtherill: { required: true },
            txtSpouseOtherillDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbSpouseDeformity: { required: true },
            txtSpouseDeformityDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbSpouseSymptoms: { required: true },
            txtSpouseSymptomsDetails: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            txtLAtdetailhereditary: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            txtSpousetdetailhereditary: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            rdbSpouseHospitalized: { required: true },
            txtSpouseHospitalizedDate: { required: true },
            rdbSpouseMediRecover: { required: true },
            txtSpouseMediRecoverDetail: { required: true },
            chkSpouseActivities: { required: true },
            rdbSpousePregnant: { required: true },
            rdbSpousePregAbnorm: { required: true },
            txtLAHospitalizedDate: { required: true }
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
            $(".col-md-4").height(79);
        },
        errorPlacement: function (error, element) {
            debugger
            //if (element.attr("id") == "chkSpouseSkyDive")
            //{
            //    if ($("#chkLASkyDive").prop("checked") == true)
            //    {
            //        $("#chkSpouseSkyDive").attr("id", "chkLASkyDive");
            //        //element.attr("id") = 'chkLASkyDive';
            //        $(element).parents('.form-group').addClass('has-error');
            //        //  error.insertAfter(element);
            //        error.insertAfter(element);
            //        $(".col-md-4").height(79);
            //    }

            //}else
            //{
            $(element).parents('.form-group').addClass('has-error');
            //  error.insertAfter(element);
            error.insertBefore(element);
            $(".col-md-4").height(79);
            //}

        }
    }).form();
    return validform;
}

function ValidateHealthAgentLogin() {

    var validform = $("#FormHealthDetails").validate({
        rules: {

            //Prop details
            ddlLAHeight: { required: false },
            ddlLAInches: { required: false },
            txtweight: { required: false, regExNumbers: /^\d+$/ },
            rdbLAWeightVariation: { required: false },
            ddlLAWeightVariation: { required: false },
            ddlLAWeightVariationReason: { required: false },

            //Spouse details
            ddlSpouseHeight: { required: false },
            ddlSpouseInches: { required: false },
            txtSpouseWeight: { required: false, regExNumbers: /^\d+$/ },
            rdbSpouseWeightVariation: { required: false },
            ddlSpouseWeightVariation: { required: false },
            ddlSpouseWeightVariationReason: { required: false }
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
            $(".col-md-3").height(79);
        },
        errorPlacement: function (error, element) {

            $(element).parents('.form-group').addClass('has-error');
            error.insertAfter(element);
            $(".col-md-3").height(79);
        }
    }).form();
    return validform;
}

$("#HealthDetailsTab").click(function () {
    debugger
    openTab(event, 'HealthDetails');
    $("#HealthDetailsTab").prop("disabled", false);
    $("#divheightDetails").show();
    if ($("#islasame").val() == "N") {
        $("#spouseHeightDetails").css("display", "block");
    }
    else {
        $("#spouseHeightDetails").css("display", "none");
    }

})

$("#OtherDetailsTab").click(function () {
    openTab(event, 'OtherDetails');
    $("#OtherDetailsTab").prop("disabled", false);
    $("#divQues3").css("display", "block");

    if ($("#islasame").val() == "Y") {
        $(".spouseQues3Fields").css("display", "none");
    }
    $("#divQues4").css("display", "none");
    $("#taxinfodiv").css("display", "none");
    $("#divEINSBank").css("display", "none");
    $("#thankyoudiv").css("display", "none");

})




//for PEP details
$("#btnOther").click(function () {
    debugger
    var valid = false;
    // valid = ValidatePersonal();
    if ($("#IsCustomer").val() == "False" && $("#islasame").val() == "Y") {
        valid = ValidatePersonalAgentLoginSpuse();

    } else if ($("#IsCustomer").val() == "False") {
        valid = ValidatePersonalAgentLogin();
    }
    else {
        valid = ValidatePersonal();
    }
    if (valid) {

        openTab(event, 'HealthDetails');
        $("#HealthDetailsTab").prop("disabled", false);

        if ($("#islasame").val() == "N") {
            $("#spouseHeightDetails").css("display", "block");
        }
        else {
            $("#spouseHeightDetails").css("display", "none");
        }
    }

});

0
$("#btnTaxRes").click(function () {
    debugger
    var valid = false;
    // valid = ValidatePersonal();
    if ($("#IsCustomer").val() == "False" && $("#islasame").val() == "Y") {
        valid = ValidatePersonalAgentLoginSpuse();

    } else if ($("#IsCustomer").val() == "False") {
        valid = ValidatePersonalAgentLogin();
    }
    else {
        valid = ValidateOthers();
    }
    if (valid) {
        $("#taxinfodiv").css("display", "none");
        $("#divEINSBank").css("display", "block");

        // openTab(event, 'HealthDetails');
    } else {
        $("#taxinfodiv").css("display", "block");
        $("#divEINSBank").css("display", "none");
        return false;
    }
});




//for other Nominee details validations
$("#btnNominee").click(function () {

    var valid = false;
    // valid = ValidatePersonal();
    if ($("#IsCustomer").val() == "False" && $("#islasame").val() == "Y") {
        valid = ValidatePersonalAgentLoginSpuse();

    } else if ($("#IsCustomer").val() == "False") {
        valid = ValidatePersonalAgentLogin();
    }
    else {
        valid = ValidatePersonal();
    }

    if (valid) {
        $("#divNominee").hide();
        //$("#btnBackNominee").hide();
        //$("#btnNominee").hide();
        //$("#btnFillNominee").hide();

        $("#divOther").css("display", "block");
    }
});




//For Employment details validations
$("#btnEmployment").click(function () {

    var valid = false;
    // valid = ValidatePersonal();
    if ($("#IsCustomer").val() == "False" && $("#islasame").val() == "Y") {
        valid = ValidatePersonalAgentLoginSpuse();

    } else if ($("#IsCustomer").val() == "False") {
        valid = ValidatePersonalAgentLogin();
    }
    else {
        valid = ValidatePersonal();
    }
    if (valid) {
        $("#divEmployment").hide();
        $("#divNominee").show();
    }
});


//For personal details validations
$("#btnPersonal").click(function () {
    debugger
    var valid = false;
    if ($("#IsCustomer").val() == "False" && $("#islasame").val() == "Y") {
        valid = ValidatePersonalAgentLoginSpuse();

    } else if ($("#IsCustomer").val() == "False") {
        valid = ValidatePersonalAgentLogin();
    }
    else {
        valid = ValidatePersonal();
    }


    if (valid) {
        $("#divPersonal").hide();
        $("#divEmployment").show();

        if ($("#islasame").val() == "N") {
            $("#divSpouseEmp").show();
        }
    }
});



function ValidateOthers() {
    var validform = $("#FormOtherDetails").validate({

        rules: {
            rdbLAFatca: { required: true },
            rdbLAEInsuranceAcc: { required: true },
            txtBankAccNo: { required: true },
            txtBankName: { required: true },
            txtBankLoc: { required: true },
            txtBankIFSC: { required: true },
            rdbLALifeInsurer: { required: true },
            rdbLALifeInsurerBenefits: { required: true },
            rdbLAExistInsurance: { required: true },
            rdbLADiscloseInsur: { required: true },
            rdbLAfamilyETLIIns: { required: true },
            // ddlLAFamilyRelationship: { required: true },
            //ddlLAHealthStatus: { required: true },
            // txtLAAge: { required: true },
            //txtLAAgeAtDeath: { required: true },
            //ddlLACauseOfDeath: { required: true },
            rdbSpouseLifeInsurer: { required: true },
            rdbSpouseLifeInsurerBenefits: { required: true },
            rdbSpouseExistInsurance: { required: true },
            rdbSpouseDiscloseInsur: { required: true },
            rdbSpousefamilyETLIIns: { required: true },
            //ddlLAFamIncmRel: { required: true },
            //txtLAFamIncmOccupation: { required: true },
            txtLAFamIncmTotalSum: { regExNumbers: /^\d+$/ },
            txtLAFamIncmIncome: { regExNumbers: /^\d+ $ / }
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
            $(".col-md-3").height(79);
        },
        errorPlacement: function (error, element) {

            $(element).parents('.form-group').addClass('has-error');
            error.insertBefore(element);
            $(".col-md-3").height(79);
        }
    }).form();
    return validform;

}

function ValidatePersonal() {
    debugger
    var validform = $("#FormPersonalDetails").validate({

        rules: {

            //LA personal
            ddlLATitle: { required: true },
            txtfirstname: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            txtmiddlename: { regExAlpha: /^[a-zA-Z ]*$/ },
            txtlastname: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            txtdob: { required: true },
            ddlgender: { required: true },
            ddlMaritalstatus: { required: true },
            txtpanno: { required: true, regExPan: /[A-Za-z]{5}\d{4}[A-Za-z]{1}/ },
            txtfathername: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            txtmothername: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            txtadharno: { required: true, regExNumbers: /^\d+$/ },
            ddlageproof: { required: true },
            ddlnatinality: { required: true },

            paddress1: { required: true },
            paddress2: { required: true },
            ppincode: { required: true, regExNumbers: /^\d+$/ },
            pstate: { required: true },
            pcity: { required: true },
            rdbLACorrAddr: { required: true },

            caddress1: { required: true },
            caddress2: { required: true },
            cpincode: { required: true, regExNumbers: /^\d+$/ },
            cstate: { required: true },
            ccity: { required: true },
            rdbLACurOrPer: { required: true },

            txtemailid: { required: true, regExEmail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },
            txtphonemobile: { required: true, regExNumbers: /^\d+$/ },
            txtphoneresidental: { required: false, regExNumbers: /^\d+$/ },
            txtphoneoffice: { required: false, regExNumbers: /^\d+$/ },
            txtfacebookid: { required: false, regExEmail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },
            txtlinkdinid: { required: false, regExEmail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },
            txtcorporateid: { required: false, regExEmail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },

            ddlLAEducation: { required: true },
            txtcollegename: { required: true },
            txthighestedu: { required: true },


            //Spouse Personal
            ddlSpouseTitle: { required: true },
            txtSpousefirstname: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            txtSpousemiddlename: { regExAlpha: /^[a-zA-Z ]*$/ },
            txtSpouselastname: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            txtSpousedob: { required: true },
            ddlSpousegender: { required: true },
            ddlSpouseMaritalstatus: { required: true },
            txtSpousepanno: { required: true, regExPan: /[A-Za-z]{5}\d{4}[A-Za-z]{1}/ },
            txtSpousefathername: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            txtSpousemothername: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            txtSpouseadharno: { required: true, regExNumbers: /^\d+$/ },
            ddlSpouseageproof: { required: true },
            ddlSpousenatinality: { required: true },

            Spousepaddress1: { required: true },
            Spousepaddress2: { required: true },
            Spouseppincode: { required: true, regExNumbers: /^\d+$/ },
            Spousepstate: { required: true },
            Spousepcity: { required: true },
            rdbSpouseCorrAddr: { required: true },

            Spousecaddress1: { required: true },
            Spousecaddress2: { required: true },
            Spousecpincode: { required: true, regExNumbers: /^\d+$/ },
            Spousecstate: { required: true },
            Spouseccity: { required: true },
            rdbSpouseCurOrPer: { required: true },

            Spousetxtemailid: { required: true, regExEmail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },
            //Spousetxtphonemobile: { required: true, regExNumbers: /^\d+$/ },
            //Spousetxtphoneresidental: { regExNumbers: /^\d+$/ },
            //Spousetxtphoneoffice: { regExNumbers: /^\d+$/ },
            //Spousetxtfacebookid: { regExEmail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },
            //Spousetxtlinkdinid: { regExEmail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },
            //Spousetxtcorporateid: { regExEmail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },

            ddlSpouseEducation: { required: true },
            txtcollegenameSpouse: { required: true },
            txthighesteduSpouse: { required: true },



            //Employment details
            //LA
            ddlLAEmployment: { required: true },
            txtnameofemployer: { required: true },
            txtladesignation: { required: true },
            ddlLAJobNature: { required: true },
            txtnatureofbusiness: { required: true },
            ddlLAExpYears: { required: true },
            ddlLAExpMonths: { required: true },
            txtaddressofemployer: { required: true },
            ddlLAIndustryType: { required: true },
            ddlLANoofEmp: { required: true },
            txtannualincome: { required: true },
            txtLAotherIncmSrc: { required: true },

            //Spouse
            ddlSpouseEmployment: { required: true },
            txtSpousenameofemployer: { required: true },
            txtSpousedesignation: { required: true },
            ddlSpouseJobNature: { required: true },
            txtSpousenatureofbusiness: { required: true },
            ddlSpouseExpYears: { required: true },
            ddlSpouseExpMonths: { required: true },
            txtSpouseaddressofemployer: { required: true },
            ddlSpouseIndustryType: { required: true },
            ddlSpouseNoofEmp: { required: true },
            txtSpouseannualincome: { required: true },
            txtSpouseotherIncmSrc: { required: true },


            //Nominee Details
            txtNomineeName1: { required: true, maxlength: 100 },
            txtNomineeDOB1: { required: true, maxlength: 10 },
            ddlNomGender1: { required: true },
            ddlNomRelation1: { required: true },
            txtNomineeAllocation1: {
                required: true, maxlength: 3, regExNumbers: /^\d+$/, maxNomAllocation: 100
                //function (element) { return parseInt(parseInt($("#txtNomineeAllocation1").val() == "" ? "0" : $("#txtNomineeAllocation1").val()) + parseInt($("#txtNomineeAllocation2").val() == "" ? "0" : $("#txtNomineeAllocation2").val()) + parseInt($("#txtNomineeAllocation3").val() == "" ? "0" : $("#txtNomineeAllocation3").val())) > 100 }
            },
            txtAppointeeName1: { required: true, maxlength: 100 },
            txtAppointeeDOB1: { required: true },
            txtAppointeeGender1: { required: true },
            txtAppointeeNomRelation1: { required: true },

            txtNomineeName2: { required: true, maxlength: 100 },
            txtNomineeDOB2: { required: true },
            ddlNomGender2: { required: true },
            ddlNomRelation2: { required: true },
            txtNomineeAllocation2: { required: true, maxlength: 3, regExNumbers: /^\d+$/, maxNomAllocation: 100 },
            txtAppointeeName2: { required: true, maxlength: 100 },
            txtAppointeeDOB2: { required: true },
            txtAppointeeGender2: { required: true },
            txtAppointeeNomRelation2: { required: true },

            txtNomineeName3: { required: true, maxlength: 100 },
            txtNomineeDOB3: { required: true },
            ddlNomGender3: { required: true },
            ddlNomRelation3: { required: true },
            txtNomineeAllocation3: { required: true, maxlength: 3, regExNumbers: /^\d+$/, maxNomAllocation: 100 },
            txtAppointeeName3: { required: true, maxlength: 100 },
            txtAppointeeDOB3: { required: true },
            txtAppointeeGender3: { required: true },
            txtAppointeeNomRelation3: { required: true },


            //Nominee Details
            txtNomineeName1: { required: true, maxlength: 100 },
            txtNomineeDOB1: { required: true, maxlength: 10 },
            ddlNomRelation1: { required: true },
            txtNomineeAllocation1: {
                required: true, maxlength: 3, regExNumbers: /^\d+$/, maxNomAllocation: 100
                //function (element) { return parseInt(parseInt($("#txtNomineeAllocation1").val() == "" ? "0" : $("#txtNomineeAllocation1").val()) + parseInt($("#txtNomineeAllocation2").val() == "" ? "0" : $("#txtNomineeAllocation2").val()) + parseInt($("#txtNomineeAllocation3").val() == "" ? "0" : $("#txtNomineeAllocation3").val())) > 100 }
            },
            txtAppointeeName1: { required: true, maxlength: 100 },
            txtAppointeeDOB1: { required: true },
            txtAppointeeGender1: { required: true },
            txtAppointeeNomRelation1: { required: true },


            txtNomineeName2: { required: true, maxlength: 100 },
            txtNomineeDOB2: { required: true },
            ddlNomRelation2: { required: true },
            txtNomineeAllocation2: { required: true, maxlength: 3, regExNumbers: /^\d+$/, maxNomAllocation: 100 },
            txtAppointeeName2: { required: true, maxlength: 100 },
            txtAppointeeDOB2: { required: true },
            txtAppointeeGender2: { required: true },
            txtAppointeeNomRelation2: { required: true },

            txtNomineeName3: { required: true, maxlength: 100 },
            txtNomineeDOB3: { required: true },
            ddlNomRelation3: { required: true },
            txtNomineeAllocation3: { required: true, maxlength: 3, regExNumbers: /^\d+$/, maxNomAllocation: 100 },
            txtAppointeeName3: { required: true, maxlength: 100 },
            txtAppointeeDOB3: { required: true },
            txtAppointeeGender3: { required: true },
            txtAppointeeNomRelation3: { required: true },


            //PEP details    
            rdbPropPep: { required: true },
            txtPEPDetails: { required: true, maxlength: 100 },
            rdbPropCriminal: { required: true },
            txtcrimalproc_q2: { required: true, maxlength: 100 },
            ddlPropIdentityProof: { required: true },
            ddlPropResidenceProof: { required: true },
            ddlPropIncomeProof: { required: true },

            //Ques-1 Details
            rdbLATravelOutsideIndia: { required: true },
            rdbSpouseTravelOutsideIndia: { required: true },
            rdbLAFatca: { required: true },
            rdbLAEInsuranceAcc: { required: true },
            txtBankAccNo: { required: true },
            txtBankName: { required: true },
            txtBankLoc: { required: true },
            txtBankIFSC: { required: true }
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
            $(".col-md-3").height(100);
        },
        errorPlacement: function (error, element) {

            $(element).parents('.form-group').addClass('has-error');
            error.insertAfter(element);
            $(".col-md-3").height(100);
        }
    }).form();
    return validform;
}

function ValidatePersonalAgentLogin() {

    var validform = $("#FormPersonalDetails").validate({
        rules: {

            //LA personal
            ddlLATitle: { required: false },
            txtfirstname: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            txtmiddlename: { regExAlpha: /^[a-zA-Z ]*$/ },
            txtlastname: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            txtdob: { required: true },
            ddlgender: { required: false },
            ddlMaritalstatus: { required: false },
            txtpanno: { required: false, regExPan: /[A-Za-z]{5}\d{4}[A-Za-z]{1}/ },
            txtfathername: { required: false, regExAlpha: /^[a-zA-Z ]*$/ },
            txtmothername: { required: false, regExAlpha: /^[a-zA-Z ]*$/ },
            txtadharno: { required: false, regExNumbers: /^\d+$/ },
            ddlageproof: { required: false },
            ddlnatinality: { required: false },

            paddress1: { required: false },
            paddress2: { required: false },
            ppincode: { required: false, regExNumbers: /^\d+$/ },
            pstate: { required: false },
            pcity: { required: false },
            rdbLACorrAddr: { required: false },

            caddress1: { required: false },
            caddress2: { required: false },
            cpincode: { required: false, regExNumbers: /^\d+$/ },
            cstate: { required: false },
            ccity: { required: false },
            rdbLACurOrPer: { required: false },

            txtemailid: { required: true, regExEmail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },
            txtphonemobile: { required: true, regExNumbers: /^\d+$/ },
            // txtphoneresidental: { required: true, regExNumbers: /^\d+$/ },
            //  txtphoneoffice: { required: true, regExNumbers: /^\d+$/ },
            // txtfacebookid: { required: true, regExEmail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },
            // txtlinkdinid: { required: true, regExEmail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },
            // txtcorporateid: { required: true, regExEmail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },

            ddlLAEducation: { required: false },
            txtcollegename: { required: false },
            txthighestedu: { required: false },


            //Spouse Personal
            ddlSpouseTitle: { required: false },
            txtSpousefirstname: { required: false, regExAlpha: /^[a-zA-Z ]*$/ },
            txtSpousemiddlename: { regExAlpha: /^[a-zA-Z ]*$/ },
            txtSpouselastname: { required: false, regExAlpha: /^[a-zA-Z ]*$/ },
            txtSpousedob: { required: false },
            ddlSpousegender: { required: false },
            ddlSpouseMaritalstatus: { required: false },
            txtSpousepanno: { required: false, regExPan: /[A-Za-z]{5}\d{4}[A-Za-z]{1}/ },
            txtSpousefathername: { required: false, regExAlpha: /^[a-zA-Z ]*$/ },
            txtSpousemothername: { required: false, regExAlpha: /^[a-zA-Z ]*$/ },
            txtSpouseadharno: { required: false, regExNumbers: /^\d+$/ },
            ddlSpouseageproof: { required: false },
            ddlSpousenatinality: { required: false },

            Spousepaddress1: { required: false },
            Spousepaddress2: { required: false },
            Spouseppincode: { required: false, regExNumbers: /^\d+$/ },
            Spousepstate: { required: false },
            Spousepcity: { required: false },
            rdbSpouseCorrAddr: { required: false },

            Spousecaddress1: { required: false },
            Spousecaddress2: { required: false },
            Spousecpincode: { required: false, regExNumbers: /^\d+$/ },
            Spousecstate: { required: false },
            Spouseccity: { required: false },
            rdbSpouseCurOrPer: { required: false },

            Spousetxtemailid: { required: false, regExEmail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },
            Spousetxtphonemobile: { required: false, regExNumbers: /^\d+$/ },
            Spousetxtphoneresidental: { regExNumbers: /^\d+$/ },
            Spousetxtphoneoffice: { regExNumbers: /^\d+$/ },
            Spousetxtfacebookid: { regExEmail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },
            Spousetxtlinkdinid: { regExEmail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },
            Spousetxtcorporateid: { regExEmail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },

            ddlSpouseEducation: { required: false },
            txtcollegenameSpouse: { required: false },
            txthighesteduSpouse: { required: false },



            //Employment details
            //LA
            ddlLAEmployment: { required: false },
            txtnameofemployer: { required: false },
            txtladesignation: { required: false },
            ddlLAJobNature: { required: false },
            txtnatureofbusiness: { required: false },
            ddlLAExpYears: { required: false },
            ddlLAExpMonths: { required: false },
            txtaddressofemployer: { required: false },
            ddlLAIndustryType: { required: false },
            ddlLANoofEmp: { required: false },
            txtannualincome: { required: false },
            txtLAotherIncmSrc: { required: false },

            //Spouse
            ddlSpouseEmployment: { required: false },
            txtSpousenameofemployer: { required: false },
            txtSpousedesignation: { required: false },
            ddlSpouseJobNature: { required: false },
            txtSpousenatureofbusiness: { required: false },
            ddlSpouseExpYears: { required: false },
            ddlSpouseExpMonths: { required: false },
            txtSpouseaddressofemployer: { required: false },
            ddlSpouseIndustryType: { required: false },
            ddlSpouseNoofEmp: { required: false },
            txtSpouseannualincome: { required: false },
            txtSpouseotherIncmSrc: { required: false },


            //Nominee Details
            txtNomineeName1: { required: false, maxlength: 100 },
            txtNomineeDOB1: { required: false, maxlength: 10 },
            ddlNomGender1: { required: false },
            ddlNomRelation1: { required: false },
            txtNomineeAllocation1: {
                required: false, maxlength: 3, regExNumbers: /^\d+$/, maxNomAllocation: 100
                //function (element) { return parseInt(parseInt($("#txtNomineeAllocation1").val() == "" ? "0" : $("#txtNomineeAllocation1").val()) + parseInt($("#txtNomineeAllocation2").val() == "" ? "0" : $("#txtNomineeAllocation2").val()) + parseInt($("#txtNomineeAllocation3").val() == "" ? "0" : $("#txtNomineeAllocation3").val())) > 100 }
            },
            txtAppointeeName1: { required: false, maxlength: 100 },
            txtAppointeeDOB1: { required: false },
            txtAppointeeGender1: { required: false },
            txtAppointeeNomRelation1: { required: false },

            txtNomineeName2: { required: false, maxlength: 100 },
            txtNomineeDOB2: { required: false },
            ddlNomGender2: { required: false },
            ddlNomRelation2: { required: false },
            txtNomineeAllocation2: { required: false, maxlength: 3, regExNumbers: /^\d+$/, maxNomAllocation: 100 },
            txtAppointeeName2: { required: false, maxlength: 100 },
            txtAppointeeDOB2: { required: false },
            txtAppointeeGender2: { required: false },
            txtAppointeeNomRelation2: { required: false },

            txtNomineeName3: { required: false, maxlength: 100 },
            txtNomineeDOB3: { required: false },
            ddlNomGender3: { required: false },
            ddlNomRelation3: { required: false },
            txtNomineeAllocation3: { required: false, maxlength: 3, regExNumbers: /^\d+$/, maxNomAllocation: 100 },
            txtAppointeeName3: { required: false, maxlength: 100 },
            txtAppointeeDOB3: { required: false },
            txtAppointeeGender3: { required: false },
            txtAppointeeNomRelation3: { required: false },


            //Nominee Details
            txtNomineeName1: { required: false, maxlength: 100 },
            txtNomineeDOB1: { required: false, maxlength: 10 },
            ddlNomRelation1: { required: false },
            txtNomineeAllocation1: {
                required: false, maxlength: 3, regExNumbers: /^\d+$/, maxNomAllocation: 100
                //function (element) { return parseInt(parseInt($("#txtNomineeAllocation1").val() == "" ? "0" : $("#txtNomineeAllocation1").val()) + parseInt($("#txtNomineeAllocation2").val() == "" ? "0" : $("#txtNomineeAllocation2").val()) + parseInt($("#txtNomineeAllocation3").val() == "" ? "0" : $("#txtNomineeAllocation3").val())) > 100 }
            },
            txtAppointeeName1: { required: false, maxlength: 100 },
            txtAppointeeDOB1: { required: false },
            txtAppointeeGender1: { required: false },
            txtAppointeeNomRelation1: { required: false },


            txtNomineeName2: { required: false, maxlength: 100 },
            txtNomineeDOB2: { required: false },
            ddlNomRelation2: { required: false },
            txtNomineeAllocation2: { required: false, maxlength: 3, regExNumbers: /^\d+$/, maxNomAllocation: 100 },
            txtAppointeeName2: { required: false, maxlength: 100 },
            txtAppointeeDOB2: { required: false },
            txtAppointeeGender2: { required: false },
            txtAppointeeNomRelation2: { required: false },

            txtNomineeName3: { required: false, maxlength: 100 },
            txtNomineeDOB3: { required: false },
            ddlNomRelation3: { required: false },
            txtNomineeAllocation3: { required: false, maxlength: 3, regExNumbers: /^\d+$/, maxNomAllocation: 100 },
            txtAppointeeName3: { required: false, maxlength: 100 },
            txtAppointeeDOB3: { required: false },
            txtAppointeeGender3: { required: false },
            txtAppointeeNomRelation3: { required: false },


            //PEP details    
            rdbPropPep: { required: false },
            txtPEPDetails: { required: false, maxlength: 100 },
            rdbPropCriminal: { required: false },
            txtcrimalproc_q2: { required: false, maxlength: 100 },
            ddlPropIdentityProof: { required: false },
            ddlPropResidenceProof: { required: false },
            ddlPropIncomeProof: { required: false },

            //Ques-1 Details
            rdbLATravelOutsideIndia: { required: false },
            rdbSpouseTravelOutsideIndia: { required: false },
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
            $(".col-md-3").height(79);
        },
        errorPlacement: function (error, element) {

            $(element).parents('.form-group').addClass('has-error');
            error.insertAfter(element);
            $(".col-md-3").height(79);
        }
    }).form();
    return validform;
}

function ValidatePersonalAgentLoginSpuse() {

    var validform = $("#FormPersonalDetails").validate({
        rules: {

            //LA personal
            ddlLATitle: { required: false },
            txtfirstname: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            txtmiddlename: { regExAlpha: /^[a-zA-Z ]*$/ },
            txtlastname: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            txtdob: { required: true },
            ddlgender: { required: false },
            ddlMaritalstatus: { required: false },
            txtpanno: { required: false, regExPan: /[A-Za-z]{5}\d{4}[A-Za-z]{1}/ },
            txtfathername: { required: false, regExAlpha: /^[a-zA-Z ]*$/ },
            txtmothername: { required: false, regExAlpha: /^[a-zA-Z ]*$/ },
            txtadharno: { required: false, regExNumbers: /^\d+$/ },
            ddlageproof: { required: false },
            ddlnatinality: { required: false },

            paddress1: { required: false },
            paddress2: { required: false },
            ppincode: { required: false, regExNumbers: /^\d+$/ },
            pstate: { required: false },
            pcity: { required: false },
            rdbLACorrAddr: { required: false },

            caddress1: { required: false },
            caddress2: { required: false },
            cpincode: { required: false, regExNumbers: /^\d+$/ },
            cstate: { required: false },
            ccity: { required: false },
            rdbLACurOrPer: { required: false },

            txtemailid: { required: true, regExEmail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },
            txtphonemobile: { required: true, regExNumbers: /^\d+$/ },
            // txtphoneresidental: { required: true, regExNumbers: /^\d+$/ },
            //  txtphoneoffice: { required: true, regExNumbers: /^\d+$/ },
            // txtfacebookid: { required: true, regExEmail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },
            // txtlinkdinid: { required: true, regExEmail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },
            // txtcorporateid: { required: true, regExEmail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },

            ddlLAEducation: { required: false },
            txtcollegename: { required: false },
            txthighestedu: { required: false },


            //Spouse Personal
            ddlSpouseTitle: { required: false },
            txtSpousefirstname: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            txtSpousemiddlename: { regExAlpha: /^[a-zA-Z ]*$/ },
            txtSpouselastname: { required: true, regExAlpha: /^[a-zA-Z ]*$/ },
            txtSpousedob: { required: true },
            ddlSpousegender: { required: false },
            ddlSpouseMaritalstatus: { required: false },
            txtSpousepanno: { required: false, regExPan: /[A-Za-z]{5}\d{4}[A-Za-z]{1}/ },
            txtSpousefathername: { required: false, regExAlpha: /^[a-zA-Z ]*$/ },
            txtSpousemothername: { required: false, regExAlpha: /^[a-zA-Z ]*$/ },
            txtSpouseadharno: { required: false, regExNumbers: /^\d+$/ },
            ddlSpouseageproof: { required: false },
            ddlSpousenatinality: { required: false },

            Spousepaddress1: { required: false },
            Spousepaddress2: { required: false },
            Spouseppincode: { required: false, regExNumbers: /^\d+$/ },
            Spousepstate: { required: false },
            Spousepcity: { required: false },
            rdbSpouseCorrAddr: { required: false },

            Spousecaddress1: { required: false },
            Spousecaddress2: { required: false },
            Spousecpincode: { required: false, regExNumbers: /^\d+$/ },
            Spousecstate: { required: false },
            Spouseccity: { required: false },
            rdbSpouseCurOrPer: { required: false },

            Spousetxtemailid: { required: true, regExEmail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },
            Spousetxtphonemobile: { required: true, regExNumbers: /^\d+$/ },
            Spousetxtphoneresidental: { regExNumbers: /^\d+$/ },
            Spousetxtphoneoffice: { regExNumbers: /^\d+$/ },
            Spousetxtfacebookid: { regExEmail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },
            Spousetxtlinkdinid: { regExEmail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },
            Spousetxtcorporateid: { regExEmail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },

            ddlSpouseEducation: { required: false },
            txtcollegenameSpouse: { required: false },
            txthighesteduSpouse: { required: false },



            //Employment details
            //LA
            ddlLAEmployment: { required: false },
            txtnameofemployer: { required: false },
            txtladesignation: { required: false },
            ddlLAJobNature: { required: false },
            txtnatureofbusiness: { required: false },
            ddlLAExpYears: { required: false },
            ddlLAExpMonths: { required: false },
            txtaddressofemployer: { required: false },
            ddlLAIndustryType: { required: false },
            ddlLANoofEmp: { required: false },
            txtannualincome: { required: false },
            txtLAotherIncmSrc: { required: false },

            //Spouse
            ddlSpouseEmployment: { required: false },
            txtSpousenameofemployer: { required: false },
            txtSpousedesignation: { required: false },
            ddlSpouseJobNature: { required: false },
            txtSpousenatureofbusiness: { required: false },
            ddlSpouseExpYears: { required: false },
            ddlSpouseExpMonths: { required: false },
            txtSpouseaddressofemployer: { required: false },
            ddlSpouseIndustryType: { required: false },
            ddlSpouseNoofEmp: { required: false },
            txtSpouseannualincome: { required: false },
            txtSpouseotherIncmSrc: { required: false },


            //Nominee Details
            txtNomineeName1: { required: false, maxlength: 100 },
            txtNomineeDOB1: { required: false, maxlength: 10 },
            ddlNomGender1: { required: false },
            ddlNomRelation1: { required: false },
            txtNomineeAllocation1: {
                required: false, maxlength: 3, regExNumbers: /^\d+$/, maxNomAllocation: 100
                //function (element) { return parseInt(parseInt($("#txtNomineeAllocation1").val() == "" ? "0" : $("#txtNomineeAllocation1").val()) + parseInt($("#txtNomineeAllocation2").val() == "" ? "0" : $("#txtNomineeAllocation2").val()) + parseInt($("#txtNomineeAllocation3").val() == "" ? "0" : $("#txtNomineeAllocation3").val())) > 100 }
            },
            txtAppointeeName1: { required: false, maxlength: 100 },
            txtAppointeeDOB1: { required: false },
            txtAppointeeGender1: { required: false },
            txtAppointeeNomRelation1: { required: false },

            txtNomineeName2: { required: false, maxlength: 100 },
            txtNomineeDOB2: { required: false },
            ddlNomGender2: { required: false },
            ddlNomRelation2: { required: false },
            txtNomineeAllocation2: { required: false, maxlength: 3, regExNumbers: /^\d+$/, maxNomAllocation: 100 },
            txtAppointeeName2: { required: false, maxlength: 100 },
            txtAppointeeDOB2: { required: false },
            txtAppointeeGender2: { required: false },
            txtAppointeeNomRelation2: { required: false },

            txtNomineeName3: { required: false, maxlength: 100 },
            txtNomineeDOB3: { required: false },
            ddlNomGender3: { required: false },
            ddlNomRelation3: { required: false },
            txtNomineeAllocation3: { required: false, maxlength: 3, regExNumbers: /^\d+$/, maxNomAllocation: 100 },
            txtAppointeeName3: { required: false, maxlength: 100 },
            txtAppointeeDOB3: { required: false },
            txtAppointeeGender3: { required: false },
            txtAppointeeNomRelation3: { required: false },


            //Nominee Details
            txtNomineeName1: { required: false, maxlength: 100 },
            txtNomineeDOB1: { required: false, maxlength: 10 },
            ddlNomRelation1: { required: false },
            txtNomineeAllocation1: {
                required: false, maxlength: 3, regExNumbers: /^\d+$/, maxNomAllocation: 100
                //function (element) { return parseInt(parseInt($("#txtNomineeAllocation1").val() == "" ? "0" : $("#txtNomineeAllocation1").val()) + parseInt($("#txtNomineeAllocation2").val() == "" ? "0" : $("#txtNomineeAllocation2").val()) + parseInt($("#txtNomineeAllocation3").val() == "" ? "0" : $("#txtNomineeAllocation3").val())) > 100 }
            },
            txtAppointeeName1: { required: false, maxlength: 100 },
            txtAppointeeDOB1: { required: false },
            txtAppointeeGender1: { required: false },
            txtAppointeeNomRelation1: { required: false },


            txtNomineeName2: { required: false, maxlength: 100 },
            txtNomineeDOB2: { required: false },
            ddlNomRelation2: { required: false },
            txtNomineeAllocation2: { required: false, maxlength: 3, regExNumbers: /^\d+$/, maxNomAllocation: 100 },
            txtAppointeeName2: { required: false, maxlength: 100 },
            txtAppointeeDOB2: { required: false },
            txtAppointeeGender2: { required: false },
            txtAppointeeNomRelation2: { required: false },

            txtNomineeName3: { required: false, maxlength: 100 },
            txtNomineeDOB3: { required: false },
            ddlNomRelation3: { required: false },
            txtNomineeAllocation3: { required: false, maxlength: 3, regExNumbers: /^\d+$/, maxNomAllocation: 100 },
            txtAppointeeName3: { required: false, maxlength: 100 },
            txtAppointeeDOB3: { required: false },
            txtAppointeeGender3: { required: false },
            txtAppointeeNomRelation3: { required: false },


            //PEP details    
            rdbPropPep: { required: false },
            txtPEPDetails: { required: false, maxlength: 100 },
            rdbPropCriminal: { required: false },
            txtcrimalproc_q2: { required: false, maxlength: 100 },
            ddlPropIdentityProof: { required: false },
            ddlPropResidenceProof: { required: false },
            ddlPropIncomeProof: { required: false },

            //Ques-1 Details
            rdbLATravelOutsideIndia: { required: false },
            rdbSpouseTravelOutsideIndia: { required: false },
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
            $(".col-md-3").height(79);
        },
        errorPlacement: function (error, element) {

            $(element).parents('.form-group').addClass('has-error');
            error.insertAfter(element);
            $(".col-md-3").height(79);
        }
    }).form();
    return validform;
}






