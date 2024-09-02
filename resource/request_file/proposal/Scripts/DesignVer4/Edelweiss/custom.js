$().ready(function () {
    InitializeControls();
    $("#ProposerGender").attr('disabled', 'disabled');

    visibilityControlOnDropdown("InvestingFor", "Please select,Self", "dvQuoteLifeAssured");
    visibilityControlOnDropdown("ProposerBetterHalf", "Please select,No", "dvQuoteLifeAssured");

    $('#LA_Nationality, #PROP_Nationality').on('change', function () {
        if ($(this).val() == '2')
            $('#NRIModal').modal();
    });

    $("#ProposerTitle").change(function () {
        
        
        if ($(this).val() == 1) {
            $("#ProposerGender").val("M");
        }
        else if ($(this).val() == 2) {
            $("#ProposerGender").val("F");
        }
        else {
            $("#ProposerGender").val("");
        }        
    });

    $("#InvestingFor").change(function () {
        if ($(this).val() == "SELF") {
            $("#LifeAssuredTitle").val("");
            $("#LifeAssuredFirstName").val("");
            $("#LifeAssuredMiddleName").val("");
            $("#LifeAssuredLastName").val("");
            $("#LifeAssuredDOB").val("");
            $("#LifeAssuredAge").val("");
            $("#LifeAssuredEmailId").val("");
            $("#LifeAssuredMobileNo").val("");
        }

        if ($(this).val() == "SPOUSE") {
            if ($("#ProposerTitle").val() == "1") {
                $("#LifeAssuredTitle").val("2");
            }
            else if ($("#ProposerTitle").val() == "2") {
                $("#LifeAssuredTitle").val("1");
            }
            else {
                $("#LifeAssuredTitle").val("");
            }
        }
        if ($(this).val() == "SON" || $(this).val() == "FATHER") {
            $("#LifeAssuredTitle").val("1");
        }
        if ($(this).val() == "DAUGHTER" || $(this).val() == "MOTHER") {
            $("#LifeAssuredTitle").val("2");
        }   
        
    });

});

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

$('#tabQuote').change(function () {
    $("#btnConfirm").hide();
    $("#btnCalcPremium").show();
});

function getPremium(downloadbi) {
    var errorcount = 0;
    $(".required").parent().next("input, select").each(function () {
        if ($(this).val() == "") {
            errorcount += 1;
            $(this).next().show();
        }
    });
    if (errorcount > 0) {
        return false;
    }
    $("#posmoadl .loader-wrap").show();
    var productname = "pos"
    var fullname = "";
    var cgender = "";
    var name = $("#ProposerFirstName").val().trim() + " " + $("#ProposerMiddleName").val().trim() + " " + $("#ProposerLastName").val().trim();
    var cdob = $("#ProposerDOB").val().trim()
    var gender = $('#ProposerGender').val().trim();
    if (gender == "M") {
        gender = "Male"
    }
    else {
        gender = "Female"
    }
    var relation = $('#InvestingFor').val().trim();
    var cfullname = $("#LifeAssuredFirstName").val().trim() + " " + $("#LifeAssuredMiddleName").val().trim() + " " + $("#LifeAssuredLastName").val().trim();
    var codob = $("#LifeAssuredDOB").val().trim();

    var pospremium = $('#hdnpremium').val().trim();
    var sumassured = $('#SumAssuredAmount').val().trim();
    var ppt = $("#PremiumPayingTerm").val().trim();
    var policyterm = $("#PolicyTerm").val().trim();
    var frequency = $('[name=Frequency]').val().trim();
    var BIPDFurl = $('#pdfhref').val();
    // var POSPREMIMUMTYPE = $('#hdnPOSPREMIMUMTYPE').val();

    var LAProposerSame = relation == "SELF" ? "Y" : "N";

    if (cfullname.trim() != "") {
        fullname = cfullname;
    }
    else {
        fullname = name;
    }

    if (relation.toLowerCase().trim() == "self") {
        cgender = gender;
    }
    else {
        if ((relation.toLowerCase().trim() == "husband" || relation.toLowerCase().trim() == "son" || relation.toLowerCase().trim() == "father")) {
            cgender = "Male";
        }
        if ((relation.toLowerCase().trim() == "daughter" || relation.toLowerCase().trim() == "mother")) {
            cgender = "Female";
            if (gender.toLowerCase().trim() == "male" && (relation.toLowerCase().trim() == "spouse")) {
                cgender = "Female";
            }
            if (gender.toLowerCase().trim() == "female" && (relation.toLowerCase().trim() == "spouse")) {
                cgender = "Male";
            }
        }
    }
    var cLAage = "";
    var cLADOB = "";
    if (codob != "") {
        cLAage = getAge($("#LifeAssuredDOB").val());
        $("#LAage").val(cLAage);
        cLADOB = $("#LifeAssuredDOB").val();
    }
    else {
        cLAage = getAge($("#ProposerDOB").val());
        cLADOB = $("#ProposerDOB").val();
    }
    var rdnvalues = "sumassure";//$('input[name=service]:checked').val();
    var claimoption;
    if (rdnvalues == "sumassure")
        claimoption = "Sum Assured On Maturity";
    else
        claimoption = "Annualised Premium";

    var emp = "";
    if ($("#ProposerStaff").val() == "Yes") {
        if ($("#ProposerEmpCode").val() == "")
            emp = "No";
        else
            emp = "Yes";
    }
    else {
        emp = "No";
    }
    var smoke = "No";

    var array = cLADOB.split("/");
    cLADOB = array[1] + "/" + array[0] + "/" + array[2];

    var dataString = "{'product':'" + productname + "','fullname':'" + fullname.replace("  "," ") + "','cliGender':'" + cgender + "','age':'" + cLAage + "','cliDOB':'" + cLADOB + "','maturityAge':'0','frequency':'" + frequency + "','smoke':'" + smoke + "','policyTerm':'" + policyterm + "','premiumPayingTerm':'" + ppt + "','sumAssured':'" + sumassured.replace(/,/g, '') + "','staff':'" + emp + "','workSiteFlag':'No','index':'0','ADB':'','ATPD':'','CI':'','HCB':'','term':'','WOP':'No','pdf':'Yes','childAge':'','childGender':'','maturityOption':'','flexibleBenefitYear':'','postponemenet':'','claimsOption':'" + claimoption + "','LAProposerSame':'" + LAProposerSame + "'}";
    console.log(dataString);
	jQuery.support.cors = true;
    $.ajax({
        type: "POST",
        //crossDomain: true,
        url: "http://182.19.17.195/WhitelabelAPI/api/GetPremium",
        data: dataString,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (Result) {
            // alert(Result);

            sumprem = Result;
            if ($("#ProposerStaff").val() == "Yes") {
                if ($("#ProposerEmpCode").val() == "") {
                    $("#pdfhref").val("");

                    $("#prmshowerror").show();
                    $("#prmshow").hide();
                    $("#lblmsgerror").html("please enter your employee code");
                    $("#btnConfirm").hide();
                    $("#btnCalcPremium").show();
                }
                else {
                    if (Result.error != "") {
                        $("#pdfhref").val("");
                        $("#prmshowerror").show();
                        $("#prmshow").hide();
                        $("#lblmsgerror").html(Result.replace("@", ""));
                        $("#btnConfirm").hide();
                        $("#btnCalcPremium").show();
                    }
                    else {
                       // var arrayresult = Result.split(";");
                        if (rdnvalues == "sumassure") {
                            $("#rpremium").html("<span class='inr'>RS </span>" + (Result.premium).replace(/\B(?=(\d{1})(\d{2})+(?!\d))/g, ","));
                            $("#hdnpremium").val((Result.premium).replace(/\B(?=(\d{1})(\d{2})+(?!\d))/g, ","));
                        }
                        else {
                            $("#rpremium").html("<span class='inr'>RS </span>" + (Result.sumAssured).replace(/\B(?=(\d{1})(\d{2})+(?!\d))/g, ","));
                            $("#hdnpremium").val((Result.premium).replace(/\B(?=(\d{1})(\d{2})+(?!\d))/g, ","));
                        }

                        $("#hdnbasepremium").val((Result.basePremium == null ? "0" : Result.basePremium).replace(/\B(?=(\d{1})(\d{2})+(?!\d))/g, ","));
                        $("#hdnsumassured").val((Result.sumAssured == null ? "0" : Result.sumAssured).replace(/\B(?=(\d{1})(\d{2})+(?!\d))/g, ","));

                        $("#hdnpremium").val((Result.premium).replace(/\B(?=(\d{1})(\d{2})+(?!\d))/g, ","));
                        $("#pdfhref").val(Result.pdfName == null ? "0" : Result.pdfName);
                        $("#pdfhrefdownload").attr("href", Result.pdfName == null ? "0" : Result.pdfName);

                        //if ($('input[name=service]:checked').val() == "sumassure") {
                        if ($('[name=Frequency]').val() == "Monthly")
                            $("#lblfrequency").html("monthly");
                            else
                            $("#lblfrequency").html("annual");

                        //}
                        //else {
                        //    $("#lblfrequency").html("your <span id='lblfrequency'>sum</span> assured is");
                       // }
                        $('#btnsubmitpos').attr("disabled", false);
                        $("#btnsubmitpos").removeClass('disable');
                        $("#prmshowerror").hide();
                        $("#prmshow").show();

                        if ($("#hdndownloadbi").val() != "") {
                            if ($("#hdndownloadbi").val() == "bi") {
                                $("#btnsubmitpos").hide();
                                $("#downloadbi").show();
                            }
                        }
                        $("#btnConfirm").show();
                        $("#btnCalcPremium").hide();
                    }
                }

            }
            else {
                if (Result.error != "") {
                    $("#pdfhref").val("");
                    $("#prmshowerror").show();
                    $("#prmshow").hide();
                    $("#lblmsgerror").html(Result.error);
                    $("#btnConfirm").hide();
                    $("#btnCalcPremium").show();
                }
                else {
                    //var arrayresult = Result.split(";");
                    //if (rdnvalues == "sumassure") {
                    //    $("#rpremium").html("<span class='inr'>RS</span>" + (arrayresult[1]).replace(/\B(?=(\d{1})(\d{2})+(?!\d))/g, ","));
                    //    $("#hdnpremium").val((arrayresult[1]).replace(/\B(?=(\d{1})(\d{2})+(?!\d))/g, ","));
                    //}
                    //else {
                    //    $("#rpremium").html("<span class='inr'>RS</span>" + (arrayresult[3]).replace(/\B(?=(\d{1})(\d{2})+(?!\d))/g, ","));
                    //    $("#hdnpremium").val((arrayresult[3]).replace(/\B(?=(\d{1})(\d{2})+(?!\d))/g, ","));
                    //}
                    //$("#hdnbasepremium").val((arrayresult[0]).replace(/\B(?=(\d{1})(\d{2})+(?!\d))/g, ","));
                    //$("#hdnsumassured").val((arrayresult[3]).replace(/\B(?=(\d{1})(\d{2})+(?!\d))/g, ","));

                    //$("#pdfhref").val(arrayresult[2]);
                    //$("#pdfhrefdownload").attr("href", arrayresult[2]);
                    //if ($('input[name=service]:checked').val() == "sumassure") {
                    //    if ($('[name=frequency]').val() == "Monthly")
                    //        $("#lblfrequency").html("your <span id='lblfrequency'>monthly</span> premium inclusive of taxes is");
                    //    else
                    //        $("#lblfrequency").html("your <span id='lblfrequency'>annual</span> premium inclusive of taxes is");

                    //}
                    //else {
                    //    $("#lblfrequency").html("your <span id='lblfrequency'>sum</span> assured is");
                    //}                   
                    $("#prmshowerror").hide();
                    $("#prmshow").show();

                    $("#rpremium").html("<span class='inr'>RS </span>" + (Result.premium).replace(/\B(?=(\d{1})(\d{2})+(?!\d))/g, ","));
                    $("#hdnpremium").val((Result.premium).replace(/\B(?=(\d{1})(\d{2})+(?!\d))/g, ","));
                    $("#hdnbasepremium").val((Result.basePremium == null ? "0" : Result.basePremium).replace(/\B(?=(\d{1})(\d{2})+(?!\d))/g, ","));
                    $("#hdnsumassured").val((Result.sumAssured == null ? "0" : Result.sumAssured).replace(/\B(?=(\d{1})(\d{2})+(?!\d))/g, ","));

                    $("#pdfhref").val(Result.pdfName == null ? "0" : Result.pdfName);
                    $("#pdfhrefdownload").attr("href", Result.pdfName == null ? "0" : Result.pdfName);

                    if ($('[name=Frequency]').val() == "Monthly")
                        $("#lblfrequency").html("monthly");
                    else
                        $("#lblfrequency").html("annual");

                    $("#btnConfirm").show();
                    $("#btnCalcPremium").hide();
                }
            }

            $("#posmoadl .loader-wrap").hide();
           
        },
        error: function (xhr, status, error) {
            $("#posmoadl .loader-wrap").hide();
            ////console.log(error);
        },
    });

    if (downloadbi == "1")
        setTimeout(function () {
            downloadbipos();
        }, 1000);
    return false;
}

function getAge(dateString) {
    //var today = new Date(),
    // dob = new Date(dateString.replace(/(\d{2}\/)(\d{2}\/)(\d{4})/, '$2$1$3'));
    //var age = today.getFullYear() - dob.getFullYear();
    //return age;
    //dob = new Date(dateString.replace(/(\d{2}\/)(\d{2}\/)(\d{4})/, '$1$2$3'));
    dob = new Date(dateString.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"))
    var today = new Date();
    var age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
    return age;
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

$("#hdndownloadbi").val(getUrlVars()["option"]);

function SaveQuoteDetails() {
    var productCode = "PLBR01";
    var product = "pos";
    var source = "";
    var bi_pdf = $('#pdfhref').val();
    var relation = $('#InvestingFor').val().trim();
    var isLaPropSame = relation == "SELF" ? "Y" : "N";
    localStorage.setItem('isLaPropSame', isLaPropSame);

    var productName = "pos";
    var policyTerm = $("#PolicyTerm").val().trim();
    var premiumPayingTerm = $("#PremiumPayingTerm").val().trim();
    var frequency = $('[name=Frequency]').val().trim();
    var sumAssured = $('#SumAssuredAmount').val().trim();;
    var premiumAmount = $('#hdnpremium').val().trim().replace(/,/g, '');
    var totalPremiumAmount = $('#hdnpremium').val().trim().replace(/,/g, '');


    //Proposer Details
    var proptitle = $("#ProposerTitle").val();
    var propfirstName = $("#ProposerFirstName").val();
    var propmiddleName = $("#ProposerMiddleName").val();
    var proplastName = $("#ProposerLastName").val();
    //var propdob = $("#ProposerDOB").val();
    var array = $("#ProposerDOB").val().split("/");
    var propdob = array[1] + "/" + array[0] + "/" + array[2];
    var propgender = $("#ProposerGender").val();
    var propmaritalStatus = $("#ProposerMaritalStatus").val();
    var propemailId = $("#ProposerEmailId").val();
    var propphoneNo = $("#ProposerMobileNo").val();
    var propisSmoker = "No";
    var propisStaff = $("#ProposerStaff").val();
    var propemployeeCode = $("#ProposerEmpCode").val();
    var proprelationLAProposer = relation;
    var propage = $("#Proposerage").val();
    var propisTaxResofIndia = "";
    var propipAddress = "";
    var propadhaarNo = "";

    // Life Assured Details if LA and Proposer are different
    var LAtitle = $("#LifeAssuredTitle").val();
    var LAfirstName = $("#LifeAssuredFirstName").val();
    var LAmiddleName = $("#LifeAssuredMiddleName").val();
    var LAlastName = $("#LifeAssuredLastName").val();
    var array;
    var LAdob;
    if ($("#LifeAssuredDOB").val() != "") {
        array = $("#LifeAssuredDOB").val().split("/")
        LAdob = array[1] + "/" + array[0] + "/" + array[2];
    }
    var LAgender = "";//$("#LifeAssuredGender").val();
    var LAmaritalStatus = "";//$("#LifeAssuredMaritalStatus").val();
    if (relation.toLowerCase().trim() == "self") {
        LAgender = propgender;
    }
    else {
        if ((relation.toLowerCase().trim() == "husband" || relation.toLowerCase().trim() == "son" || relation.toLowerCase().trim() == "father")) {
            LAgender = "M";
        }
        if ((relation.toLowerCase().trim() == "daughter" || relation.toLowerCase().trim() == "mother")) {
            LAgender = "F";
            if (propgender.toLowerCase().trim() == "m" && (relation.toLowerCase().trim() == "spouse")) {
                LAgender = "F";
            }
            if (propgender.toLowerCase().trim() == "f" && (relation.toLowerCase().trim() == "spouse")) {
                LAgender = "M";
            }
        }
    }
    var LAemailId = $("#LifeAssuredEmailId").val();
    var LAphoneNo = $("#LifeAssuredMobileNo").val();
    var LAisSmoker = "No";
    var LAisStaff = "";//$("#LifeAssuredStaff").val();
    var LAemployeeCode = "";
    var LAage = $("#LifeAssuredAge").val();
    var LAisTaxResofIndia = "";
    var LAipAddress = "";
    var LAadhaarNo = "";


    // Creating JSON for Save Quote Details
    var json = "{'commonData':{ 'policyNo':'','transactionId':'','agentCode':'','source':'A5A040' ,'TabId':'1','product':'" + product + "','productCode':'" + productCode + "','bi_pdf':'" + bi_pdf + "','isLaPropSame':'" + isLaPropSame + "' }, 'productDetails':{'name': 'POS','policyTerm': '" + policyTerm + "','premiumPayingTerm': '" + premiumPayingTerm + "','frequency': '" + frequency + "','sumAssured': '" + sumAssured + "','premiumAmount': '" + premiumAmount + "','totalPremiumAmount': '" + totalPremiumAmount + "','planOption': 'level','CHANNEL_CD':'','DIST_MKT':'','PFA_CD':'','DM_CD':'','BR_CD':'','SUB_CD':'','COR_BKR_BR_CD':''},'proposerDetails':{'title': '" + proptitle + "','firstName': '" + propfirstName + "','middleName': '" + propmiddleName + "','lastName': '" + proplastName + "','dob': '" + propdob + "','gender': '" + propgender + "','maritalStatus': '" + propmaritalStatus + "','emailId': '" + propemailId + "','phoneNo': '" + propphoneNo + "','isSmoker': '" + propisSmoker + "','isStaff': '" + propisStaff + "','employeeCode': '" + propemployeeCode + "','relationLAProposer': '" + proprelationLAProposer + "','relationLAProposerText': '','age': '" + propage + "','isTaxResofIndia': '','ipAddress': '','adhaarNo': ''},'LADetails':{'title': '" + LAtitle + "','firstName': '" + LAfirstName + "','middleName': '" + LAmiddleName + "','lastName': '" + LAlastName + "','dob': '" + LAdob + "','gender': '" + LAgender + "','maritalStatus': '" + LAmaritalStatus + "','emailId': '" + LAemailId + "','phoneNo': '" + LAphoneNo + "','isSmoker': '" + LAisSmoker + "','isStaff': '" + LAisStaff + "','employeeCode': '" + LAemployeeCode + "','age': '" + LAage + "','isTaxResofIndia': '','ipAddress': '','adhaarNo': ''},'Payment':{'amount':'0','timestamp':'','transactionNo':''}}"
    console.log(json);
    var response;
    debugger;
    $.ajax({
        type: "POST",
        crossDomain: true,
        url: "http://182.19.17.195/WhitelabelAPI/api/SaveQuoteDetails",
        data: json,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (Result) {
            response = Result;
            //$("#ResponseDetails").show();
            //$("#policynumber").val(Result.policyNo);
            //$("#transid").val(Result.transactionId);
            //$("#Bipfdlink").attr("href", $("#pdfhref").val());
            //$("#Status").val(Result.status);

            if (Result.error == null || Result.error.trim() == "") {
                localStorage.setItem('policyNo', Result.policyNo);
                localStorage.setItem('transactionId', Result.transactionId);
                localStorage.setItem('biPdfLink', $("#pdfhref").val());
                window.location.href = "ZP_PF.html";
            }
            else {
                alert('Failure: ' + Result.error);
            }           
        },
        error: function (xhr, status, error) {
            ////console.log(error);
        },
    });
    return false;
}