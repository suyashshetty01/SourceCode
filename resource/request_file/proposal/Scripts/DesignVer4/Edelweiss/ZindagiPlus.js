var uatIP="http://103.118.2.17";


$("#TUB").on("change", function () {
    if ($(this).val() == "Yes") {
        $("#RiderTopUp").removeAttr("disabled");
        $("#WOP").attr("disabled", "disabled");
    }
    else {
        $("#RiderTopUp").attr("disabled", "disabled");
        $("#WOP").removeAttr("disabled");
    }
});

$("#CIBenefit").on("change", function () {
    if ($(this).val() == "Yes") {
        $("#RiderTopUp").removeAttr("readonly");
    }
    else {
        $("#RiderTopUp").attr("readonly", "readonly");
    }
});


$("#WOP").on("change", function () {
    if ($(this).val() == "Yes") {
        $("#RiderDSA").attr("disabled", "disabled");
        $("#TUB").attr("disabled", "disabled");
    }
    else {
        $("#RiderDSA").removeAttr("disabled");
        $("#TUB").removeAttr("disabled");
    }
});


$("#RiderDSA").on("change", function () {
    if ($(this).val() == "Yes") {
        $("#WOP").attr("disabled", "disabled");
    }
    else {
        $("#WOP").removeAttr("disabled");
    }
})

$('#tabQuoteZindagiPlus').change(function () {
    $("#btnConfirm").hide();
    $("#btnCalcPremium").show();
});


function numericInput() {
    $(document).on("input", ".numeric", function () {
        this.value = this.value.replace(/\D/g, '');
    });
}





$(".amountnumber").on("keyup focus", function (c) {
    if (c.which >= 37 && c.which <= 40) {
        return
    }
    var numberInWords = convertNumberToWords(removeCommas($(this).val()));
    $(this).siblings('.extra-info').html(numberInWords);
    //resetNudge();
});


function setDisplayPremium(freq) {

    totaldisplaypremium = parseInt($("#basepremium").val()) + parseInt($("#ADBpremium").val()) + parseInt($("#ATPDpremium").val()) + parseInt($("#CIpremium").val()) + parseInt($("#waiverpremium").val()) + parseInt($("#BHpremium").val()) + parseInt($("#HCBpremium").val()) + parseInt($("#CIRiderpremium").val());
    calcpremium = parseInt($("#basepremium").val()) + parseInt($("#ADBpremium").val()) + parseInt($("#ATPDpremium").val()) + parseInt($("#waiverpremium").val()) + parseInt($("#BHpremium").val()) + parseInt($("#HCBpremium").val()) + parseInt($("#CIRiderpremium").val());
    //if (freq == "Monthly") {
    //    BuyPremiumYearly(calcpremium, parseInt("0"));
    //}
    $("#rpremium").text(totaldisplaypremium.toString().replace(/\B(?=(\d{1})(\d{2})+(?!\d))/g, ","));

    if ($('[name=Frequency]').val() == "Monthly")
        $("#lblfrequency").html("monthly");
    else if ($('[name=Frequency]').val() == "Quarterly")
        $("#lblfrequency").html("quarterly");
    else if ($('[name=Frequency]').val() == "Half-Yearly")
        $("#lblfrequency").html("half-yearly");
    else
        $("#lblfrequency").html("annual");
}

function round(number, precision) {
    var shift = function (number, precision) {
        var numArray = ("" + number).split("e");
        return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + precision) : precision));
    };
    return shift(Math.round(shift(number, +precision)), -precision);
}

function getAge(dateString) {
    if (dateString == "" || dateString == undefined || dateString == null) {
        age = 0;
    } else {
        dateString = dateString.split("/");
        var dd = Number(dateString[1]);
        var mm = Number(dateString[0]);
        var yyyy = Number(dateString[2]);
        var bdate = mm + "/" + dd + "/" + yyyy;
        var today = new Date();
        var birthDate = new Date(bdate);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
    }
    return age;
}

function removeCommas(str) {
    while (str.search(",") >= 0) {
        str = (str + "").replace(',', '');
    }
    return str;
}

function convertNumberToWords(amount) {
    var words = new Array();
    words[0] = '';
    words[1] = 'One';
    words[2] = 'Two';
    words[3] = 'Three';
    words[4] = 'Four';
    words[5] = 'Five';
    words[6] = 'Six';
    words[7] = 'Seven';
    words[8] = 'Eight';
    words[9] = 'Nine';
    words[10] = 'Ten';
    words[11] = 'Eleven';
    words[12] = 'Twelve';
    words[13] = 'Thirteen';
    words[14] = 'Fourteen';
    words[15] = 'Fifteen';
    words[16] = 'Sixteen';
    words[17] = 'Seventeen';
    words[18] = 'Eighteen';
    words[19] = 'Nineteen';
    words[20] = 'Twenty';
    words[30] = 'Thirty';
    words[40] = 'Forty';
    words[50] = 'Fifty';
    words[60] = 'Sixty';
    words[70] = 'Seventy';
    words[80] = 'Eighty';
    words[90] = 'Ninety';
    amount = amount.toString();
    var atemp = amount.split(".");
    var number = atemp[0].split(",").join("");
    var n_length = number.length;
    var words_string = "";
    if (n_length <= 9) {
        var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
        var received_n_array = new Array();
        for (var i = 0; i < n_length; i++) {
            received_n_array[i] = number.substr(i, 1);
        }
        for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
            n_array[i] = received_n_array[j];
        }
        for (var i = 0, j = 1; i < 9; i++, j++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                if (n_array[i] == 1) {
                    n_array[j] = 10 + parseInt(n_array[j]);
                    n_array[i] = 0;
                }
            }
        }
        value = "";
        for (var i = 0; i < 9; i++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                value = n_array[i] * 10;
            } else {
                value = n_array[i];
            }
            if (value != 0) {
                words_string += words[value] + " ";
            }
            if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                if (value == "1")
                    words_string += "Crore ";
                else
                    words_string += "Crores ";
            }
            if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                if (value == "1")
                    words_string += "Lakh ";
                else
                    words_string += "Lakhs ";

            }
            if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Thousand ";
            }
            if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                words_string += "Hundred and ";
            } else if (i == 6 && value != 0) {
                words_string += "Hundred ";
            }
        }
        words_string = words_string.split("  ").join(" ");
    }
    return words_string;
}

function CriticalPremium() {
    if ($("#getcritical").val() == "0") {
        var productname = "CritiCare+";
        var fullname = $("#fullname").val();
        var dOb = $("#dob").val();
        var age = getAge($("#dob").val());
        var tobacco = "No";
        var gender = "";
        var Policyterm = parseInt($('.basicdiv').find("span.agenumber").text());
        if (Policyterm > 30)
            Policyterm = 30;
        var Amount = parseInt($("#criticalSlider").get(0).noUiSlider.get());
        if ($("input[name=gender]:checked").val() == "male") {
            gender = "Male";
        }
        else {
            gender = "Female";
        }
        if ($("input[name=tobacco]:checked").val() == "Yes") {
            tobacco = "Yes"
        }
        var benefittype = ($("#criticalillness").find('.bs-checkbox.typ-toggle input').is(':checked')) ? "multi Claim" : "Single Claim";
        var dataString = "{'Product':'" + productname + "','fullname':'" + fullname + "','cli_Gender':'" + gender + "','age':'" + age + "','clidob':'" + dOb + "','maturuty_age':'0','frequency':'Yearly','Smoke':'" + tobacco + "','PolicyTerm':'" + Policyterm + "','PPT':'" + Policyterm + "','SumAssured':'" + Amount + "','Staff':'No','wrksiteflg':'No','index':'0','ADB':'','ATPD':'','CI':'','HCB':'','Term':'','WOP':'No','pdf':'Yes','childAge':'','childGender':'','matrityOption':'','flexiableBenefityr':'','postponemenet':'','LargeCap':'','Top250':'','Bond':'','MoneyMarket':'','PEBased':'','Managed':'','ClaimsOptn':'" + benefittype + "'}";

        if (!$("#criticalillness").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").find(".add-benefit").hasClass("disable")) {
            $("#criticalillness").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").find(".add-benefit").addClass("disable premiumfetch")
            $("#criticalillness").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").find(".benefit-premium").hide();
            $("#criticalillness").find(".benefit-footer").find(".benefit-cta").find(".loadingicon").show();
        }
        $.ajax({
            type: "POST",
            url: "/Home/GetpremiumMylife",
            data: dataString,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                if (Result.indexOf("@") >= 0) {
                    $("#criticalillness").find(".benefit-footer").find(".add-benefit-block").find(".cm-error").show();
                    $("#criticalillness").find(".benefit-footer").find(".add-benefit-block").find(".cm-error").html(Result.replace("@", ""));
                    $("#criticalillness").find(".benefit-footer").find(".add-benefit-block").find(".benefit-premium").hide();
                    $("#criticalillness").find(".benefit-footer").find(".add-benefit-block").find(".add-benefit").addClass("disable");
                    $("#criticalillness").find(".benefit-footer").find(".benefit-cta").find(".loadingicon").hide();
                } else {
                    $("#criticalillness").find(".benefit-footer").find(".add-benefit-block").find(".cm-error").html("");
                    $("#criticalillness").find(".benefit-footer").find(".add-benefit-block").find(".cm-error").hide();
                    $("#criticalillness").find(".benefit-footer").find(".add-benefit-block").find(".benefit-premium").show();
                    $("#criticalillness").find(".benefit-footer").find(".add-benefit-block").find(".add-benefit").removeClass("disable");
                    var critivalue = Result.split(",");
                    $("#criticalillness").find(".benefit-footer").find(".add-benefit-block").find("span.amnt").html(critivalue[0].toString().replace(/\B(?=(\d{1})(\d{2})+(?!\d))/g, ","));
                    $("#criticarepdf").val(critivalue[1]);
                    if ($("#criticalillness").find(".benefit-footer").find(".add-benefit-block").find(".add-benefit").hasClass("premiumfetch")) {
                        $("#criticalillness").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").find(".add-benefit").removeClass("disable premiumfetch")
                        $("#criticalillness").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").find(".benefit-premium").show();
                        $("#criticalillness").find(".benefit-footer").find(".benefit-cta").find(".loadingicon").hide();
                    }
                }

            },
            error: function (xhr, status, error) {
                $("#criticalillness").find(".benefit-footer").find(".add-benefit-block").find(".cm-error").show();
                $("#criticalillness").find(".benefit-footer").find(".add-benefit-block").find(".cm-error").html("Unable to get premium please try again");
                $("#criticalillness").find(".benefit-footer").find(".add-benefit-block").find(".benefit-premium").hide();
                $("#criticalillness").find(".benefit-footer").find(".add-benefit-block").find(".add-benefit").addClass("disable");
            },
        });
    } else {
        return false;
    }

}

function getPremium() {
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
    $(".form-horizontal").hide();

    var slidername = slidername || null;
    var fullname = $("#ProposerFirstName").val() + " " + $("#ProposerLastName").val();
    var gender = $("#ProposerGender").val();
    if (gender == "M") {
        gender = "Male";
    }
    else if (gender == "F") {
        gender = "Female";
    }
    var dob = $("#ProposerDOB").val();
    var array = dob.split("/");
    dob = array[1] + "/" + array[0] + "/" + array[2];
    var age = ($("#Proposerage").val());
    var phone = $("#ProposerMobileNo").val();
    var email = $("#ProposerEmailId").val();
    var investmentamount = $("#SumAssuredAmount").val().replace(/,/g, '');
    var freq = $("#Frequency").val();
    var tobacco = $("#ProposerSmoke").val();
    var marriage = $("#ProposerMaritalStatus").val();

    if (freq == "yearly" || freq == "year") {
        freq = "Yearly";
    }
    else if (freq == "half-yearly" || freq == "6 months") {
        freq = "Half-yearly";
    }
    else if (freq == "quarterly" || freq == "quarter") {
        freq = "Quarterly";
    }
    else if (freq == "monthly" || freq == "month") {
        freq = "Monthly";
    }

    var policyterm = parseInt($("#PremiumPayingTerm").val());
    var PPT = parseInt($("#PremiumPayingTerm").val());
    var investmentstrategy = "";

    var fundEquity = "";
    var fundTop = "";
    var fundBond = "";
    var fundManaged = "";
    var fundMid = "";

    var LAname = fullname;
    var LAdOb = dob;
    var LAage = age;
    var LAgender = gender;
    var LAtobacco = tobacco;
    var LAemail = email;
    var LAnumber = phone;
    var LAProposerSame = "true";
    var rising = "No";
    var maritialstatus = marriage;

    var ADBAmt = parseInt($("#ADBCover").val() == "" ? 0 : $("#ADBCover").val());
    var CIRiderAmt = parseInt($("#CICover").val() == "" ? 0 : $("#CICover").val());
    var HCBAmt = parseInt($("#HCBCover").val() == "" ? 0 : $("#HCBCover").val());
    var ATPDAmt = parseInt($("#ATPDCover").val() == "" ? 0 : $("#ATPDCover").val());
    var zptype = $("#benefitdecreasing").val() == "2" ? "Life Cover with Decreasing Sum Assured" : "Life Cover with Level Sum Assured";

    var pptType = $("#PremiumPayingTerm").val();
    var policyTerm = parseInt($("#PremiumPayingTerm").val())
    if (pptType == "60 years of your age" && policyTerm != 60) {
        CIRiderAmt = "";
        HCBAmt = "";
    }

    var percentage = $("#RiderTopUp").val();
    var addbenefit = $("#addbenefittype").val();// == "Yes" ? "Top-up Benefit" : "Waiver of Premium Benefit";
    var addbenefitpercent = $("#addbenefitpercent").val();//percentage == "five" ? "5%" : percentage == "ten" ? "10%" : "";

    var benefitbetterhalf = $("#ProposerBetterHalf").val();
    var spousedob = $("#LifeAssuredDOB").val();
    var spousearray = spousedob != "" ? spousedob.split("/") : "";
    spousedob = spousearray != "" ? (spousearray[1] + "/" + spousearray[0] + "/" + spousearray[2]) : "";

    var spouseage = $("#LifeAssuredAge").val();
    var othergender = (LAgender == "Male") ? "Female" : "Male";
    var spousegender = othergender;
    var spousetobacco = $("#LifeAssuredTobacco").val();
    var spousename_first = $("#LifeAssuredFirstName").val();
    var spousename_last = $("#LifeAssuredLastName").val();

    var benefittopup = parseInt($("#benefittopup").val());
    var benefitpremiumwaiver = parseInt($("#benefitpremiumwaiver").val());
    var benefitdecreasing = parseInt($("#benefitdecreasing").val());

    var distributionChannel = 'Online Sales';////Corporate Agent
    var dataString = "{'product':'Zindagiplus','fullName':'" + fullname + "','cliGender':'" + gender + "','age':'" + age + "','cliDOB':'" + dob
        + "','maturityAge':'0','frequency':'" + freq + "','smoke':'" + tobacco + "','policyTerm':'" + policyterm + "','premiumPayingTerm':'" + PPT
        + "','sumAssured':'" + investmentamount + "','staff':'No','workSiteFlag':'No','index':'0','ADB':'" + ADBAmt + "','ATPD':'" + ATPDAmt + "','CI':'" + CIRiderAmt + "','HCB':'" + HCBAmt
        + "','Term':'','WOP':'No','pdf':'No','childAge':'','childGender':'','maturityOption':'','flexibleBenefitYear':'','postponement':'','largeCap':'" + fundEquity + "','top250':'" + fundTop
        + "','bond':'" + fundBond + "','moneyMarket':'','PEBased':'" + fundMid + "','managed':'" + fundManaged + "','claimsOption':'','LAProposerSame':'" + LAProposerSame + "','LAFullName':'"
        + LAname + "','LAEmail':'" + LAemail + "','LANumber':'" + LAnumber + "','LATobacco':'" + LAtobacco + "','LAAge':'" + LAage + "','LADOB':'" + LAdOb + "','investmentStrategy':'" + investmentstrategy + "','LAGender':'" + LAgender + "','risingStar':'" + rising
        + "','policyOption':'" + zptype + "','distributionChannel':'" + distributionChannel + "','betterHalfBenefit':'" + benefitbetterhalf + "','LAMarriedStatus':'" + maritialstatus
        + "','spouseFirstName':'" + spousename_first + "','spouseLastName':'" + spousename_last + "','spouseDOB':'" + spousedob + "','spouseGender':'" + spousegender
        + "','spouseAge':'" + spouseage + "','spouseTobaccoUser':'" + spousetobacco + "','additionalBenefit':'" + addbenefit + "','topUpBenefitPercentage':'" + addbenefitpercent
        + "','payoutOption':'LumpSum','payoutMonths':'','payoutPercentageLumpsum':'100','payoutPercentageLevelIncome':'','payoutPercentageIncreasingIncome':''}";

    $.ajax({
        type: "POST",
        //url: "http://localhost:19951/api/GetPremium",        
        url: uatIP + "/WhitelabelAPI/api/GetPremium",
        data: dataString,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (Result) {

            if (Result.error == "") {
                console.log("BI Return:" + Result);
                $("#basepremium").val(Result.premium);
                $("#hdnpremium").val(Result.premium);
				$("#pdfhref").val(Result.pdfName == null ? "0" : Result.pdfName);

                $("#ADBPremiumAmount").val(Result.accidentalDeathPremium);
                $("#ATPDPremiumAmount").val(Result.permanentDisabilityPremium);
                $("#CIPremiumAmount").val(Result.criticalIllnessPremium);
                $("#HCBPremiumAmount").val(Result.hcbPremium);
                $("#WOPAddBenefitAmount").val(Result.premiumWaiver);
                $("#BHBAddBenefitAmount").val(Result.betterHalfPremium);

                $("#posmoadl .loader-wrap").hide();
                $(".form-horizontal").show();
                $("#btnConfirm").show();
                $("#btnCalcPremium").hide();

                if ($("#benefitaccidental").val() == "2") {
                    $("#ADBpremium").val($("#ADBPremiumAmount").val());
                }

                if ($("#benefitdisability").val() == "2") {
                    $("#ATPDpremium").val($("#ATPDPremiumAmount").val());
                }

                if ($("#benefitci").val() == "2") {
                    $("#CIRiderpremium").val($("#CIPremiumAmount").val());
                }

                if ($("#benefithcb").val() == "2") {
                    $("#HCBpremium").val($("#HCBPremiumAmount").val());
                }
                if ($("#benefitpremiumwaiver").val() == "2") {
                    $("#waiverpremium").val(Result.premiumWaiver);
                }
                if ($("#benefitbetterhalf").val() == "2") {
                    $("#BHpremium").val(Result.betterHalfPremium);
                }

                setDisplayPremium(freq);
            }
            else {
                $("#btnConfirm").hide();
                $("#btnCalcPremium").show();
                $("#posmoadl .loader-wrap").hide();
                $(".form-horizontal").show();
            }

        },
        error: function (xhr, status, error) {
            //  console.log(error);
        },
    });

}

function CheckForNaN(value) {
    if (value == "" || value == null || value == "undefined") {
        return 0;
    } else {
        return value;
    }
}

function CheckForBoolean(value) {
    if (value == "" || value == null || value == "undefined") {
        return false;
    }
    if (value.toLowerCase() == "yes" || value.toLowerCase() == "y") {
        return true;
    }
    else { return false; }
}

function SaveQuoteDetails() {
    var isBetterHalfBenefit = "No";
    var isBHBFlag = $("#benefitbetterhalf").val();
    var isLaPropSame = "";

    if (isBHBFlag == "2") {
        isLaPropSame = "N";
    }
    else {
        isLaPropSame = "Y";
    }

    //la details
    var laTitle = $("#ProposerTitle").val();
    var laFName = $("#ProposerFirstName").val();
    var laMName = $("#ProposerMiddleName").val();
    var laLName = $("#ProposerLastName").val();
    var laDOB = $("#ProposerDOB").val();

    var splitlaDOB = laDOB.split("/");
    laDOB = splitlaDOB[1] + '-' + splitlaDOB[0] + '-' + splitlaDOB[2];

    var laGender = $("#ProposerGender").val();
    var laAge = $("#Proposerage").val();
    var laEmail = $("#ProposerEmailId").val();
    var laPhone = $("#ProposerMobileNo").val();
    var laMarrital = $("#ProposerMaritalStatus").val();
    var laSmoke = $("#ProposerSmoke").val();

    //Spouse Details if Better Half Benefit is selected
    var spouseTitle = "";
    var spouseFName = $("#LifeAssuredFirstName").val();
    var spouseMName = $("#LifeAssuredMiddleName").val();
    var spouseLName = $("#LifeAssuredLastName").val();
    var spouseDOB = $("#LifeAssuredDOB").val();

    var splitspouseDOB = "";
    if (spouseDOB != "" && spouseDOB != "undefined" && spouseDOB.length == 10) {
        splitspouseDOB = spouseDOB.split("/");
        spouseDOB = splitspouseDOB[1] + '-' + splitspouseDOB[0] + '-' + splitspouseDOB[2];
    }
    var spouseGender = "";
    var spouseEmail = $("#LifeAssuredEmailId").val();
    var spousePhone = $("#LifeAssuredMobileNo").val();
    var spouseMarrital = $("#ProposerMaritalStatus").val();
    var spouseSmoke = $("#LifeAssuredTobacco").val();
    var spousemaritalStatus = "";
    var LAProposerRelation = "";
    var spouseAge = $("#LifeAssuredAge").val();

    if (isBHBFlag == "2") {
        spousemaritalStatus = "M";
        if (laGender == "M") {
            LAProposerRelation = "wife";
            spouseTitle = "2";
            spouseGender = "F";
        } else {
            LAProposerRelation = "husband";
            spouseTitle = "1";
            spouseGender = "M";
        }
    }
    //policy details
    var SumAssuredAmount = $("#SumAssuredAmount").val();
    var PremiumPayingTerm = $("#PremiumPayingTerm").val();
    var PolicyTerm = $("#PolicyTerm").val();
    var Frequency = $("#Frequency").val();
    var ProposerStaff = $("#ProposerStaff").val();
    var premiumAmount = $("#hdnpremium").val();

    //benefitDetails
    var isTopUpBenefit = "No";
    var RateOfIncreament = "";
    var isDecreasingSumAssured = $("#benefitdecreasing").val();
    var isDSA = isDecreasingSumAssured == "2" ? "Y" : "N";
    var isCriticalIllness = $("#CIBenefit").val();
    var ciAmt = parseInt($("#CIBenefitCover").val());
    var isWOP = "No";
    //total premium amount calculation
    var BHpremium = 0;
    if ($("#benefitbetterhalf").val() == "2") {
        BHpremium += parseInt(CheckForNaN($("#BHBAddBenefitAmount").val()));
        isBetterHalfBenefit = "Yes";
    }
    else {
        isBetterHalfBenefit = "No";
    }
    if ($("#benefittopup").val() == "2") {
        var RateOfIncreament = $("#RiderTopUp").val();
        isTopUpBenefit = "Yes";
    }

    var waiverpremium = 0;
    if ($("#benefitpremiumwaiver").val() == "2") {
        waiverpremium = parseInt(CheckForNaN($("#WOPAddBenefitAmount").val()));
        isWOP = "Yes";
    }

    //ADB values
    var isADB = "No";
    var ADBcover = $("#ADBCover").val();
    var ADBpremium = 0;
    if ($("#benefitaccidental").val() == "2") {
        ADBpremium = parseInt(CheckForNaN($("#ADBPremiumAmount").val()));
        isADB = "Yes";
    }

    //ATPD values
    var isATPD = "No";
    var ATPDCover = $("#ATPDCover").val();
    var ATPDpremium = 0;
    if ($("#benefitdisability").val() == "2") {
        ATPDpremium = parseInt(CheckForNaN($("#ATPDPremiumAmount").val()));
        isATPD = "Yes";
    }

    //CI values
    var isCIBenefit = "No";
    var CICover = $("#CICover").val();
    var CIRiderpremium = 0;
    if ($("#benefitci").val() == "2") {
        CIRiderpremium = parseInt(CheckForNaN($("#CIPremiumAmount").val()));
        isCIBenefit = "Yes";
    }

    //HCB values
    var isHCBBenefit = "No";
    var HCBCover = $("#HCBCover").val();
    var HCBpremium = 0;
    if ($("#benefithcb").val() == "2") {
        HCBpremium = parseInt(CheckForNaN($("#HCBPremiumAmount").val()));
        isHCBBenefit = "Yes";
    }

    var totalriderpremium = parseInt(ADBpremium) + parseInt(ATPDpremium) + parseInt(waiverpremium) + parseInt(BHpremium) + parseInt(HCBpremium) + parseInt(CIRiderpremium);
    var totalPremiumAmount = parseInt(premiumAmount) + parseInt(totalriderpremium);



    var datastring = "{'commonData':{'policyNo': '','transactionId': '','agentCode': '','source': 'A5A040','TabId': '1','product': 'Zindagi+','productCode': 'TLBR08','bi_pdf': 'sis.edlweisstokio.in/dsakjdhas_dskdj_dsjak.pdf','isLaPropSame': '"
        + isLaPropSame + "'},'Payment': {'amount': '0','timestamp': '','transactionNo': ''},'productDetails': {'name': 'Zindagi+','policyTerm': '" + PolicyTerm + "','premiumPayingTerm': '" + PremiumPayingTerm + "','frequency': '"
        + Frequency + "','sumAssured': '" + SumAssuredAmount + "','premiumAmount': '" + premiumAmount + "','totalPremiumAmount': '" + totalPremiumAmount + "','planOption': '" + isDSA + "','totalRiderPremium': '" + totalriderpremium
        + "','fundDetails': null,'riderDetails': {'topUpBenefit': {'isTopUpBenefit': '" + CheckForBoolean(isTopUpBenefit) + "','topUpRate': '" + RateOfIncreament + "','premium': ''},'betterHalf': {'sumAssured': '" + SumAssuredAmount + "','premium': '" + BHpremium
        + "'},'WOP': {'waiverOfPremiumBenefit': '" + CheckForBoolean(isWOP) + "','premium': '" + waiverpremium + "'},'CI': {'criticalIllness': '" + CheckForBoolean(isCIBenefit) + "','sumAssured': '" + CICover + "','premium': '" + CIRiderpremium
        + "'},'ADB': {'isADB': '" + CheckForBoolean(isADB) + "','sumAssured': '" + ADBcover + "','premium': '" + ADBpremium + "'},'ATPD': {'isATPD': '" + CheckForBoolean(isATPD) + "','sumAssured': '" + ATPDCover + "','premium': '" + ATPDpremium
        + "'},'HCB': {'isHCB': '" + CheckForBoolean(isHCBBenefit) + "','sumAssured': '" + HCBCover + "','premium': '" + HCBpremium + "'}},'DeathBenefitOptions': {'payoutOption': 'LumpSum','lumpsumProportion': '100','monthlyIncomeOption': 'Level','noOfMonths': '0'}},'spouseDetails': {'title': '" + spouseTitle
        + "','firstName': '" + spouseFName + "','middleName': '" + spouseMName + "','lastName': '" + spouseLName + "','dob': '" + spouseDOB + "','gender': '" + spouseGender + "','maritalStatus': '" + spousemaritalStatus + "','emailId': '" + spouseEmail + "','phoneNo': '" + spousePhone
        + "','isSmoker': '" + spouseSmoke + "','isStaff': 'N','employeeCode': '','relationLAProposer':'','relationLAProposerText': '','age': '" + spouseAge + "'},'LADetails': null,'proposerDetails': {'title': '" + laTitle
        + "','firstName': '" + laFName + "', 'middleName': '" + laMName + "', 'lastName': '" + laLName + "', 'dob': '" + laDOB + "','gender': '" + laGender + "', 'maritalStatus': '" + laMarrital + "', 'emailId': '" + laEmail
    + "', 'phoneNo': '" + laPhone + "', 'isSmoker': '" + laSmoke + "','isStaff': 'N', 'employeeCode': '', 'relationLAProposer':  '" + LAProposerRelation + "', 'relationLAProposerText': '', 'age': '" + laAge
    + "', 'isTaxResofIndia': '', 'ipAddress': '', 'adhaarNo': ''}}";

    console.log(datastring);

    $.ajax({
        type: "POST",
        crossDomain: true,
        //url: "http://localhost:19951/api/SaveQuoteDetails",        
        url: uatIP + "/WhitelabelAPI/api/SaveQuoteDetails",
        data: datastring,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (Result) {
            response = Result;
            $("#ResponseDetails").show();
            $("#policynumber").val(Result.policyNo);
            $("#transid").val(Result.transactionId);
            $("#Bipfdlink").attr("href", $("#pdfhref").val());
            $("#Status").val(Result.status);
			$("#posmoadl .loader-wrap").hide();
			if (Result.error == null || Result.error.trim() == "") {
                localStorage.setItem('policyNo', Result.policyNo);
                localStorage.setItem('transactionId', Result.transactionId);
				 localStorage.setItem('linkBIpdf', $("#pdfhref").val());
                window.open($("#pdfhref").val(), '_blank');
                window.location.href = "ZP_PF.html" + "?tId=" + Result.transactionId + "&pNo=" + Result.policyNo;
            }
            else { 
			$("#posmoadl .loader-wrap").hide();
                alert('Failure: ' + Result.error);
            }        
        },
        error: function (xhr, status, error) {
            ////console.log(error);
        },
    });
    return false;

}


function setExternalValue() {
    if ($("#benefitpremiumwaiver").val() == "2") {
        var benefitAmount = $("#prewaiver").find(".benefit-footer").find(".benefit-cta").find("span.amnt").text().replace(/,/g, '');
        $("#waiverpremium").val(benefitAmount);
        $("#riderandbenefit").find("li.prewaiver").find(".benefit-amnt").find("span.amnt").html($("#prewaiver").find(".benefit-footer").find(".benefit-cta").find("span.amnt").text());
        $("#riderandbenefit").find("li.prewaiver").find(".benefit-amnt").show();
    }

    if ($("#benefitbetterhalf").val() == "2") {
        $("#riderandbenefit").find("li.betterhalf").find(".benefit-amnt").find("span.amnt").html($("#betterhalf").find(".benefit-footer").find(".benefit-cta").find("span.amnt").text())
        $("#riderandbenefit").find("li.betterhalf").find(".benefit-amnt").show();
        var benefitAmount = $("#betterhalf").find(".benefit-footer").find(".benefit-cta").find("span.amnt").text().replace(/,/g, '');
        $("#BHpremium").val(benefitAmount);
    }

    if ($("#benefitaccidental").val() == "2") {
        var benefitAmount = $("#accidentdeath").find(".benefit-footer").find(".benefit-cta").find("span.amnt").text().replace(/,/g, '');
        $("#ADBpremium").val(benefitAmount);
        $("#riderandbenefit").find("li.accidentdeath").find(".benefit-amnt").find("span.amnt").html($("#accidentdeath").find(".benefit-footer").find(".benefit-cta").find("span.amnt").text())
        $("#riderandbenefit").find("li.accidentdeath").find(".benefit-amnt").show();
    }

    if ($("#benefitcritical").val() == "2") {
        var benefitAmount = $("#criticalillness").find(".benefit-footer").find(".benefit-cta").find("span.amnt").text().replace(/,/g, '');
        $("#CIpremium").val(benefitAmount);
        $("#riderandbenefit").find("li.criticalillness").find(".benefit-amnt").find("span.amnt").html($("#criticalillness").find(".benefit-footer").find(".benefit-cta").find("span.amnt").text())
        $("#riderandbenefit").find("li.criticalillness").find(".benefit-amnt").show();
    }

    if ($("#benefitdisability").val() == "2") {
        var benefitAmount = $("#permadisability").find(".benefit-footer").find(".benefit-cta").find("span.amnt").text().replace(/,/g, '');
        $("#ATPDpremium").val(benefitAmount);
        $("#riderandbenefit").find("li.permadisability").find(".benefit-amnt").find("span.amnt").html($("#permadisability").find(".benefit-footer").find(".benefit-cta").find("span.amnt").text())
        $("#riderandbenefit").find("li.permadisability").find(".benefit-amnt").show();
    }

    if ($("#hdntabindex").val() == "1") {
        setTimeout(function () {
            changeSection($('.js-submit').parents('.cm-lyt'));
            $('.lyt-summary').removeClass('prev');
            progressBar();
            $(".module-loader .loader-wrap").hide();
        }, 1000);
    }

    if ($("#hdntabindex").val() == "2") {
        setTimeout(function () {
            setPaymentTerm();
            proceedtoSummary();
            slider();
            changeSection($(".onlynext").parents('.cm-lyt'));
            progressBar();
            $('.cm-bg').hide();
            $('.bs-header').hide();
            $('.lyt-form').removeClass('active').addClass('prev');
            $('.lyt-result').removeClass('next').addClass('prev');
            $('.lyt-summary').removeClass('prev');
            $('.lyt-summary').removeClass('next').addClass('active');
            $('.lyt-summary').find('.typ-deal').removeClass('next').addClass('active ');
            $(".module-loader .loader-wrap").hide();
        }, 1000);
    }
}

function bindPPTEvent() {
    $('#setperiod li').on('click', function (event) {
        //BuyPremium();
    });
}

$(function () {

    numericInput();

    history.pushState({ page: 1 }, "Zindagi-Plus", "#no-back");
    window.onhashchange = function (event) {
        window.location.hash = "no-back";
    };

    $('input, :input').attr('autocomplete', 'off');



    $(window).on("load", function () {
        $(".dropdown-list").mCustomScrollbar();
    });

    $('.txtOnly').keypress(function (event) {
        var inputValue = event.charCode;
        if (!(inputValue >= 65 && (inputValue <= 90 || (inputValue >= 97 && inputValue <= 122))) && (inputValue != 32 && inputValue != 0)) {
            event.preventDefault();
        }
    });

    //$("#spousename").on('blur', function () {
    //    if ($("#spousename").val() != "")
    //        if (setBetterHalf())
    //            //BuyPremium();
    //});


    if ($(".lyt-content").length != 0) {
        if ($("#hdnZindagiPlusdata").val() != "") {
            $(".module-loader .loader-wrap").show();
            var olddata = eval($("#hdnZindagiPlusdata").val());
            $("#tranid").val(olddata[0].ZPModel.TransID);
            $("#fullname").val(olddata[0].ZPModel.FullName);
            $("#email").val(olddata[0].ZPModel.Email);
            $("#phone").val(olddata[0].ZPModel.Phone);
            $("#dob").val(olddata[0].ZPModel.DOB);
            $("#edob").val(olddata[0].ZPModel.DOB);
            if (olddata[0].ZPModel.Gender == "Male") {
                $('input[name=gender][value=male]').prop('checked', true);
            }
            else {
                $('input[name=gender][value=female]').prop('checked', true);
            }

            if (olddata[0].ZPModel.Smoke == "Yes") {
                $('input[name=tobacco][value=Yes]').prop('checked', true);
            }
            else {
                $('input[name=tobacco][value=No]').prop('checked', true);
            }

            var earning = olddata[0].ZPModel.Earning;
            if (earning == "3-5 L" || earning == "3 - 5 Lakhs") {
                earning = "3 - 5 Lakhs";
            } else if (earning == "5-10 L" || earning == "5 - 10 Lakhs") {
                earning = "5 - 10 Lakhs";
            } else if (earning == "10-15 L" || earning == "10 - 15 Lakhs") {
                earning = "10 - 15 Lakhs";
            } else if (earning == "15-20 L" || earning == "15 - 20 Lakhs") {
                earning = "15 - 20 Lakhs";
            } else if (earning == "Above 20 L" || earning == "Above 20 Lakhs") {
                earning = "Above 20 Lakhs";
            }
            $("#earning").text(earning);

            if (olddata[0].ZPModel.MaritialStatus == "Single") {
                $('input[name=marriage][value=Single]').prop('checked', true);
            }
            else {
                $('input[name=marriage][value=Married]').prop('checked', true);
            }

            $("#policyTerm").html(parseInt(olddata[0].ZPModel.PolicyTerm) + parseInt(olddata[0].ZPModel.Age));
            $("#paymentTerm").html((parseInt(olddata[0].ZPModel.PPT) + parseInt(olddata[0].ZPModel.Age)) + " years of your age");

            var freq = olddata[0].ZPModel.Frequency;
            if (freq == "yearly" || freq == "year" || freq == "Yearly" || freq == "Year") {
                freq = "year";
            }
            else if (freq == "half-yearly" || freq == "6 months" || freq == "halfyearly") {
                freq = "6 months";
            }
            else if (freq == "quarterly" || freq == "quarter" || freq == "Quarterly" || freq == "Quarter") {
                freq = "quarter";
            }
            else if (freq == "monthly" || freq == "month" || freq == "Monthly" || freq == "Month") {
                freq = "month";
            }
            $("#freq").text(freq);

            if (olddata[0].ZPModel.SumAssured != "") {
                $("#sumassured").val(parseInt(olddata[0].ZPModel.SumAssured).toString().replace(/\B(?=(\d{1})(\d{2})+(?!\d))/g, ","));
            }

            // topup benifits
            if (olddata[0].ZPModel.TUB_Ind == "Yes") {
                if (olddata[0].ZPModel.TopupRate == "10") {
                    $('input[name=rate][value=10]').prop('checked', true);
                }
                else {
                    $('input[name=rate][value=5]').prop('checked', true);
                }
                $("#addbenefittype").val("Top-up Benefit");
                $("#addbenefitpercent").val(olddata[0].ZPModel.TopupRate + "%");
                $("#benefittopup").val("2");
                $("#benefitpremiumwaiver").val("0");
                $("#topup").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").hide();
                $("#topup").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").children('.cm-error').hide();
                $("#topup").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").children('.cm-error').html("");
                $(".tab-list").find(".topup").addClass('benefit-added');
                $("#topup").find(".benefit-widget").addClass('disabled');
                $("#topup").find('.add-benefit-block').next('.remove-benefit').fadeIn();
                $("#topup").find('.benefit-cta').siblings('.benefit-widget').addClass('disabled');
            }

            // betterhalf benifits
            if (olddata[0].ZPModel.BHB_Ind == "Yes") {
                $("#wifeDob").val(olddata[0].ZPModel.SpouseDOB);
                $("#spousename").val(olddata[0].ZPModel.SpouseFirstName + " " + olddata[0].ZPModel.SpouseLastName);
                var wifeage = getAge($("#wifeDob").val());

                if (olddata[0].ZPModel.SpouseTobbacoUser == "Yes") {
                    $("#betterhalf").find('.bs-checkbox').find('.no').removeClass('active');
                    $("#betterhalf").find('.bs-checkbox').find('.check-label').removeClass('active');
                    $("#betterhalf").find('.bs-checkbox').find('.yes').addClass('active');
                    $('#spousetobacco').prop('checked', true);
                } else {
                    $("#betterhalf").find('.bs-checkbox').find('.yes').removeClass('active');
                    $("#betterhalf").find('.bs-checkbox').find('.check-label').removeClass('active');
                    $("#betterhalf").find('.bs-checkbox').find('.no').addClass('active');
                    $('#spousetobacco').prop('checked', false);
                }

                $("#wifeDob").attr("placeholder", "");
                $("#wifeDob").attr("data-placeholder", "");
                $("#wifeDob").parents('.input-group').next('.extra-info').find('.cm-value').show().children('span').text(wifeage);
                $("#getbetterhalf").val("1");
                $("#benefitbetterhalf").val("2");
                $("#betterhalf").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").hide();
                $("#betterhalf").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").children('.cm-error').html("");
                $("#betterhalf").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").children('.cm-error').hide();
                $(".tab-list").find(".betterhalf").addClass('benefit-added');
                $("#betterhalf").find(".benefit-widget").addClass('disabled');
                $("#betterhalf").find('.add-benefit-block').next('.remove-benefit').fadeIn();
                $("#betterhalf").find('.benefit-cta').siblings('.benefit-widget').addClass('disabled');
            }

            // Waiver of Premium
            if (olddata[0].ZPModel.PWB_Ind == "Yes") {
                $("#benefitpremiumwaiver").val("2");
                $("#benefittopup").val("0");
                $("#addbenefittype").val("Waiver of Premium Benefit");
                $("#addbenefitpercent").val("");
                $("#prewaiver").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").hide();
                $("#prewaiver").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").children('.cm-error').hide();
                $("#prewaiver").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").children('.cm-error').html("");
                $(".tab-list").find(".prewaiver").addClass('benefit-added');
                $("#prewaiver").find(".benefit-widget").addClass('disabled');
                $("#prewaiver").find('.add-benefit-block').next('.remove-benefit').fadeIn();
                $("#prewaiver").find('.benefit-cta').siblings('.benefit-widget').addClass('disabled');
            }

            // Critical Illness Cover
            if (olddata[0].ZPModel.CIC_Ind == "Yes") {
                $("#benefitcritical").val("2");
                $("#criticalSlider").get(0).noUiSlider.updateOptions({
                    start: olddata[0].ZPModel.CIC_SumAssured, range: {
                        'min': 100000, 'max': 10000000
                    },
                    step: 100000
                });

                if (olddata[0].ZPModel.CIC_ClaimOption == "Multi") {
                    $("#criticalillness").find('.bs-checkbox').find('.no').removeClass('active');
                    $("#criticalillness").find('.bs-checkbox').find('.check-label').removeClass('active');
                    $("#criticalillness").find('.bs-checkbox').find('.yes').addClass('active');
                    $('#claimOptn').prop('checked', true);
                } else {
                    $("#criticalillness").find('.bs-checkbox').find('.yes').removeClass('active');
                    $("#criticalillness").find('.bs-checkbox').find('.check-label').removeClass('active');
                    $("#criticalillness").find('.bs-checkbox').find('.no').addClass('active');
                    $('#claimOptn').prop('checked', false);
                }

                var agelabel = parseInt(olddata[0].ZPModel.CIC_PolicyTerm) + parseInt(olddata[0].ZPModel.Age);
                $("#criticalillness").find('.basicdiv').find("span.totalage").text(agelabel);
                $("#criticalillness").find('.basicdiv').find("span.agenumber").text(olddata[0].ZPModel.CIC_PolicyTerm);
                $("#criticalillness").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").hide();
                $("#criticalillness").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").children('.cm-error').hide();
                $("#criticalillness").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").children('.cm-error').html("");
                $(".tab-list").find(".criticalillness").addClass('benefit-added');
                $("#criticalillness").find(".benefit-widget").addClass('disabled');
                $("#criticalillness").find('.add-benefit-block').next('.remove-benefit').fadeIn();
                $("#criticalillness").find('.benefit-cta').siblings('.benefit-widget').addClass('disabled');
                CriticalPremium();
            }

            // Decreasing Sum Assured
            if (olddata[0].ZPModel.DSA_ind == "Yes") {
                $("#zptype").val("Life Cover with Decreasing Sum Assured");
                $("#benefitdisability").val("2");
                $("#dsumassured").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").hide();
                $("#dsumassured").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").children('.cm-error').hide();
                $("#dsumassured").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").children('.cm-error').html("");
                $(".tab-list").find(".dsumassured").addClass('benefit-added');
                $("#dsumassured").find(".benefit-widget").addClass('disabled');
                $("#dsumassured").find('.add-benefit-block').next('.remove-benefit').fadeIn();
                $("#dsumassured").find('.benefit-cta').siblings('.benefit-widget').addClass('disabled');
            }

            // Accidental Death Benefit Rider
            if (olddata[0].ZPModel.ADB_Ind == "Yes") {
                $("#benefitaccidental").val("2");
                $("#accidentslider").get(0).noUiSlider.updateOptions({
                    start: olddata[0].ZPModel.ADB, range: { 'min': 100000, 'max': 10000000 },
                    step: 100000
                });

                //benefitAmount = $("#accidentaldeath").find(".benefit-footer").find(".benefit-cta").find("span.amnt").text().replace(/,/g, '');
                //$("#ADBpremium").val(benefitAmount);
                allridertotal();
                $("#benefitaccidental").val("2");
                $("#accidentaldeath").find(".benefit-footer").find(".add-benefit-block").find(".cm-error").html("");
                $("#accidentaldeath").find(".benefit-footer").find(".add-benefit-block").find(".cm-error").hide();
                $("#allriders").find("li.accidentaldeath").addClass("benefit-added");
                $(".tab-list").find(".allriders").addClass('benefit-added');
                $("#accidentaldeath").find('.add-benefit-block').fadeOut();
                $("#accidentaldeath").find('.add-benefit-block').next('.remove-benefit').fadeIn();
                $("#accidentaldeath").find('.benefit-cta').siblings('.benefit-widget').addClass('disabled');
                $(".tab-list > ul > li.accidentaldeath").addClass('benefit-added');
                // //BuyPremium();
            }

            // Permanent Disability Rider
            if (olddata[0].ZPModel.PD_Ind == "Yes") {
                $("#benefitdisability").val("2");
                $("#disabilitySlider").get(0).noUiSlider.updateOptions({
                    start: olddata[0].ZPModel.ATPD, range: {
                        'min': 100000, 'max': 10000000
                    },
                    step: 100000
                });


                //benefitAmount = $("#permanentdisability").find(".benefit-footer").find(".benefit-cta").find("span.amnt").text().replace(/,/g, '');
                //$("#ATPDpremium").val(benefitAmount);
                allridertotal();
                blockBenefit = true;
                $("#permanentdisability").find(".benefit-footer").find(".add-benefit-block").find(".cm-error").html("");
                $("#permanentdisability").find(".benefit-footer").find(".add-benefit-block").find(".cm-error").hide();
                $("#allriders").find("li.permanentdisability").addClass("benefit-added");
                $(".tab-list").find(".allriders").addClass('benefit-added');
                $("#permanentdisability").find('.add-benefit-block').fadeOut();
                $("#permanentdisability").find('.add-benefit-block').next('.remove-benefit').fadeIn();
                $("#permanentdisability").find('.benefit-cta').siblings('.benefit-widget').addClass('disabled');
                $(".tab-list > ul > li.permanentdisability").addClass('benefit-added');
                // //BuyPremium();
            }

            // CI Rider
            if (olddata[0].ZPModel.CI_Ind == "Yes") {
                $("#benefitci").val("2");
                $("#illnessslider").get(0).noUiSlider.updateOptions({
                    start: olddata[0].ZPModel.CI, range: {
                        'min': 100000, 'max': 10000000
                    },
                    step: 100000
                });

                //benefitAmount = $("#cirider").find(".benefit-footer").find(".benefit-cta").find("span.amnt").text().replace(/,/g, '');
                //$("#CIRiderpremium").val(benefitAmount);
                allridertotal();
                blockBenefit = true;
                $("#cirider").find(".benefit-footer").find(".add-benefit-block").find(".cm-error").html("");
                $("#cirider").find(".benefit-footer").find(".add-benefit-block").find(".cm-error").hide();
                $("#allriders").find("li.cirider").addClass("benefit-added");
                $(".tab-list").find(".allriders").addClass('benefit-added');
                $("#cirider").find('.add-benefit-block').fadeOut();
                $("#cirider").find('.add-benefit-block').next('.remove-benefit').fadeIn();
                $("#cirider").find('.benefit-cta').siblings('.benefit-widget').addClass('disabled');
                $(".tab-list > ul > li.cirider").addClass('benefit-added');
                setPaymentTerm();
            }

            // HCB Rider
            if (olddata[0].ZPModel.HCB_Ind == "Yes") {
                $("#benefithcb").val("2");
                $("#illnessslider").get(0).noUiSlider.updateOptions({
                    start: olddata[0].ZPModel.CI, range: {
                        'min': 100000, 'max': 10000000
                    },
                    step: 100000
                });

                //benefitAmount = $("#hcb").find(".benefit-footer").find(".benefit-cta").find("span.amnt").text().replace(/,/g, '');
                //$("#HCBpremium").val(benefitAmount);
                allridertotal();
                $("#hcb").find(".benefit-footer").find(".add-benefit-block").find(".cm-error").html("");
                $("#hcb").find(".benefit-footer").find(".add-benefit-block").find(".cm-error").hide();
                $("#allriders").find("li.hcb").addClass("benefit-added");
                $(".tab-list").find(".allriders").addClass('benefit-added');
                $("#hcb").find('.add-benefit-block').fadeOut();
                $("#hcb").find('.add-benefit-block').next('.remove-benefit').fadeIn();
                $("#hcb").find('.benefit-cta').siblings('.benefit-widget').addClass('disabled');
                $(".tab-list > ul > li.hcb").addClass('benefit-added');
                setPaymentTerm();
            }


            $.removeCookie('zindagiplus', {
                path: '/'
            });
            $.removeCookie("laData", {
                path: '/'
            });
            $.removeCookie("spouseData", {
                path: '/'
            });

            if ($("#hdntabindex").val() == "2") {
                if (olddata[0].ZPModel.PayoutOption == "LumpSum") {
                    $(".payoutDropdown").find('label.dropdown-btn').text("Lumpsum");
                } else if (olddata[0].ZPModel.PayoutOption == "Monthly Income - Level" || olddata[0].ZPModel.PayoutOption == "Monthly Income - Increasing") {
                    $(".payoutDropdown").find('label.dropdown-btn').text("Income Benefit");
                    if (olddata[0].ZPModel.PayoutMonths == "180") {
                        $('input[name=months][value=180]').prop('checked', true);
                    } else if (olddata[0].ZPModel.PayoutMonths == "120") {
                        $('input[name=months][value=120]').prop('checked', true);
                    } else if (olddata[0].ZPModel.PayoutMonths == "60") {
                        $('input[name=months][value=60]').prop('checked', true);
                    } else if (olddata[0].ZPModel.PayoutMonths == "36") {
                        $('input[name=months][value=36]').prop('checked', true);
                    }

                    if (olddata[0].ZPModel.PayoutOption == "Monthly Income - Increasing") {
                        $(".incomeType").find('.bs-checkbox').find('.no').removeClass('active');
                        $(".incomeType").find('.bs-checkbox').find('.check-label').removeClass('active');
                        $(".incomeType").find('.bs-checkbox').find('.yes').addClass('active');
                        $('#incomeType').prop('checked', true);
                    } else {
                        $(".incomeType").find('.bs-checkbox').find('.yes').removeClass('active');
                        $(".incomeType").find('.bs-checkbox').find('.check-label').removeClass('active');
                        $(".incomeType").find('.bs-checkbox').find('.no').addClass('active');
                        $('#incomeType').prop('checked', false);
                    }
                } else {
                    $(".payoutDropdown").find('label.dropdown-btn').text("Combination");
                    if (olddata[0].ZPModel.PayoutMonths == "180") {
                        $('input[name=months][value=180]').prop('checked', true);
                    } else if (olddata[0].ZPModel.PayoutMonths == "120") {
                        $('input[name=months][value=120]').prop('checked', true);
                    } else if (olddata[0].ZPModel.PayoutMonths == "60") {
                        $('input[name=months][value=60]').prop('checked', true);
                    } else if (olddata[0].ZPModel.PayoutMonths == "36") {
                        $('input[name=months][value=36]').prop('checked', true);
                    }

                    var finalamountstart = parseInt(olddata[0].ZPModel.SumAssured / 2);
                    setAllocationSlider(finalamountstart, parseInt(olddata[0].ZPModel.SumAssured));

                    if (olddata[0].ZPModel.PayoutOption == "Lumpsum Plus Monthly Income - Increasing") {
                        $(".incomeType").find('.bs-checkbox').find('.no').removeClass('active');
                        $(".incomeType").find('.bs-checkbox').find('.check-label').removeClass('active');
                        $(".incomeType").find('.bs-checkbox').find('.yes').addClass('active');
                        $('#incomeType').prop('checked', true);

                        var currentValue = parseInt(olddata[0].ZPModel.PayoutPercentageIncreasingIncome);
                        var currPercentage = (currentValue / parseInt(olddata[0].ZPModel.SumAssured)) * 100;
                        currPercentage = Math.ceil(currPercentage);
                        $('#allocateTooltip .current-value').text(currPercentage + "%");
                        $('#allocateTooltip .remaining-value').text((100 - currPercentage) + "%");
                        setSliderData(finalamount, currPercentage, (100 - currPercentage));
                    } else {
                        $(".incomeType").find('.bs-checkbox').find('.yes').removeClass('active');
                        $(".incomeType").find('.bs-checkbox').find('.check-label').removeClass('active');
                        $(".incomeType").find('.bs-checkbox').find('.no').addClass('active');
                        $('#incomeType').prop('checked', false);

                        var currentValue = parseInt(olddata[0].ZPModel.PayoutPercentageLevelIncome);
                        var currPercentage = (currentValue / parseInt(olddata[0].ZPModel.SumAssured)) * 100;
                        currPercentage = Math.ceil(currPercentage);
                        $('#allocateTooltip .current-value').text(currPercentage + "%");
                        $('#allocateTooltip .remaining-value').text((100 - currPercentage) + "%");
                        setSliderData(finalamount, currPercentage, (100 - currPercentage));
                    }

                }
            }
            tabs();
            if ($("#hdntabindex").val() == "1" || $("#hdntabindex").val() == "2") {
                binddata(3);
            }
        }
    }

    if ($("#hdnZindagiPlusdata").val() == "") {
        if ($.cookie("laData") != undefined || $.cookie("laData") != null) {
            $("#hdntabindex").val("1");
            var customerdetails = $.cookie("laData").split(',');
            $("#tranid").val(customerdetails[0]);
            $("#fullname").val(customerdetails[2]);
            $("#email").val(customerdetails[6]);
            $("#phone").val(customerdetails[7]);
            $("#dob").val(customerdetails[3]);
            $("#edob").val(customerdetails[3]);
            var LAAge = getAge(customerdetails[3]);

            if (customerdetails[4] == "Male" || customerdetails[4] == "MALE") {
                $('input[name=gender][value=male]').prop('checked', true);
            }
            else {
                $('input[name=gender][value=female]').prop('checked', true);
            }

            if (customerdetails[5] == "M") {
                $('input[name=marriage][value=Married]').prop('checked', true);
            }
            else {
                $('input[name=marriage][value=Single]').prop('checked', true);
            }

            if (customerdetails[9] == "Yes") {
                $('input[name=tobacco][value=Yes]').prop('checked', true);
            }
            else {
                $('input[name=tobacco][value=No]').prop('checked', true);
            }

            if ($.cookie("zindagiplus") != undefined || $.cookie("zindagiplus") != null) {
                var value = $.cookie("zindagiplus").split(',');

                var multiplier = "";
                if (LAAge >= 18 && LAAge <= 35) {
                    multiplier = 25;
                } else if (LAAge >= 36 && LAAge <= 40) {
                    multiplier = 20;
                } else if (LAAge >= 41 && LAAge <= 50) {
                    multiplier = 15;
                } else if (LAAge >= 51 && LAAge <= 55) {
                    multiplier = 10;
                } else if (LAAge >= 56 && LAAge <= 60) {
                    multiplier = 5;
                } else {
                    multiplier = 2;
                }

                var sumassured = value[0];
                var finalamount = parseInt(sumassured) / parseInt(multiplier);

                var earning = "";
                if (parseInt(finalamount) >= 300000 && parseInt(finalamount) < 500000) {
                    earning = "3 - 5 Lakhs";
                } else if (parseInt(finalamount) >= 500000 && parseInt(finalamount) < 1000000) {
                    earning = "5 - 10 Lakhs";
                } else if (parseInt(finalamount) >= 1000000 && parseInt(finalamount) < 1500000) {
                    earning = "10 - 15 Lakhs";
                } else if (parseInt(finalamount) >= 1500000 && parseInt(finalamount) < 2000000) {
                    earning = "15 - 20 Lakhs";
                } else if (parseInt(finalamount) >= 2000000) {
                    earning = "Above 20 Lakhs";
                }
                $("#earning").text(earning);

                var freq = value[3];
                if (freq == "yearly" || freq == "year" || freq == "Yearly" || freq == "Year") {
                    freq = "year";
                }
                else if (freq == "half-yearly" || freq == "6 months" || freq == "halfyearly") {
                    freq = "6 months";
                }
                else if (freq == "quarterly" || freq == "quarter" || freq == "Quarterly" || freq == "Quarter") {
                    freq = "quarter";
                }
                else if (freq == "monthly" || freq == "month" || freq == "Monthly" || freq == "Month") {
                    freq = "month";
                }
                $("#freq").text(freq);

                $("#policyTerm").html(parseInt(value[1]) + parseInt(LAAge));
                $("#paymentTerm").html((parseInt(value[2]) + parseInt(LAAge)) + " years of your age");
                $("#sumassured").val(parseInt(sumassured).toString().replace(/\B(?=(\d{1})(\d{2})+(?!\d))/g, ",")).change();

                // topup benifits
                if (value[5] == "Y") {
                    if (value[6] == "10") {
                        $('input[name=rate][value=10]').prop('checked', true);
                    }
                    else {
                        $('input[name=rate][value=5]').prop('checked', true);
                    }
                    $("#addbenefittype").val("Top-up Benefit");
                    $("#addbenefitpercent").val(value[6] + "%");
                    $("#benefittopup").val("2");
                    $("#benefitpremiumwaiver").val("0");
                    $("#topup").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").hide();
                    $("#topup").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").children('.cm-error').hide();
                    $("#topup").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").children('.cm-error').html("");
                    $(".tab-list").find(".topup").addClass('benefit-added');
                    $("#topup").find(".benefit-widget").addClass('disabled');
                    $("#topup").find('.add-benefit-block').next('.remove-benefit').fadeIn();
                    $("#topup").find('.benefit-cta').siblings('.benefit-widget').addClass('disabled');
                }

                // betterhalf benifits
                if (value[4] == "Y") {
                    var spousvalue = $.cookie("spouseData").split(',');
                    $("#wifeDob").val(spousvalue[2]);
                    var wifeage = getAge(spousvalue[2]);
                    $("#spousename").val(spousvalue[1]);
                    $("#wifeDob").attr("placeholder", "");
                    $("#wifeDob").attr("data-placeholder", "");
                    $("#wifeDob").parents('.input-group').next('.extra-info').find('.cm-value').show().children('span').text(wifeage);
                    $("#getbetterhalf").val("1");
                    $("#benefitbetterhalf").val("2");
                    $("#betterhalf").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").hide();
                    $("#betterhalf").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").children('.cm-error').html("");
                    $("#betterhalf").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").children('.cm-error').hide();
                    $(".tab-list").find(".betterhalf").addClass('benefit-added');
                    $("#betterhalf").find(".benefit-widget").addClass('disabled');
                    $("#betterhalf").find('.add-benefit-block').next('.remove-benefit').fadeIn();
                    $("#betterhalf").find('.benefit-cta').siblings('.benefit-widget').addClass('disabled');
                }

                // Waiver of Premium
                if (value[7] == "Y") {
                    $("#benefitpremiumwaiver").val("2");
                    $("#benefittopup").val("0");
                    $("#addbenefittype").val("Waiver of Premium Benefit");
                    $("#addbenefitpercent").val("");
                    $("#prewaiver").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").hide();
                    $("#prewaiver").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").children('.cm-error').hide();
                    $("#prewaiver").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").children('.cm-error').html("");
                    $(".tab-list").find(".prewaiver").addClass('benefit-added');
                    $("#prewaiver").find(".benefit-widget").addClass('disabled');
                    $("#prewaiver").find('.add-benefit-block').next('.remove-benefit').fadeIn();
                    $("#prewaiver").find('.benefit-cta').siblings('.benefit-widget').addClass('disabled');
                }

                // Critical Illness Cover
                if (value[23] == "Y") {
                    $("#benefitcritical").val("2");
                    $("#criticalSlider").get(0).noUiSlider.updateOptions({
                        start: value[26], range: {
                            'min': 100000, 'max': 10000000
                        },
                        step: 100000
                    });

                    if (value[27] == "Multi Cliam") {
                        $("#criticalillness").find('.bs-checkbox').find('.no').removeClass('active');
                        $("#criticalillness").find('.bs-checkbox').find('.check-label').removeClass('active');
                        $("#criticalillness").find('.bs-checkbox').find('.yes').addClass('active');
                        $('#claimOptn').prop('checked', true);
                    } else {
                        $("#criticalillness").find('.bs-checkbox').find('.yes').removeClass('active');
                        $("#criticalillness").find('.bs-checkbox').find('.check-label').removeClass('active');
                        $("#criticalillness").find('.bs-checkbox').find('.no').addClass('active');
                        $('#claimOptn').prop('checked', false);
                    }

                    $("#criticalillness").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").hide();
                    $("#criticalillness").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").children('.cm-error').hide();
                    $("#criticalillness").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").children('.cm-error').html("");
                    $(".tab-list").find(".criticalillness").addClass('benefit-added');
                    $("#criticalillness").find(".benefit-widget").addClass('disabled');
                    $("#criticalillness").find('.add-benefit-block').next('.remove-benefit').fadeIn();
                    $("#criticalillness").find('.benefit-cta').siblings('.benefit-widget').addClass('disabled');
                    CriticalPremium();
                }

                // Decreasing Sum Assured
                if (value[16] == "Y") {
                    $("#zptype").val("Life Cover with Decreasing Sum Assured");
                    $("#benefitdecreasing").val("2");
                    $("#dsumassured").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").hide();
                    $("#dsumassured").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").children('.cm-error').hide();
                    $("#dsumassured").find(".benefit-footer").find(".benefit-cta").find(".add-benefit-block").children('.cm-error').html("");
                    $(".tab-list").find(".dsumassured").addClass('benefit-added');
                    $("#dsumassured").find(".benefit-widget").addClass('disabled');
                    $("#dsumassured").find('.add-benefit-block').next('.remove-benefit').fadeIn();
                    $("#dsumassured").find('.benefit-cta').siblings('.benefit-widget').addClass('disabled');
                }

                // Accidental Death Benefit Rider
                if (value[8] == "Y") {
                    $("#benefitaccidental").val("2");
                    $("#accidentslider").get(0).noUiSlider.updateOptions({
                        start: value[9], range: { 'min': 100000, 'max': 10000000 },
                        step: 100000
                    });
                    //benefitAmount = $("#accidentaldeath").find(".benefit-footer").find(".benefit-cta").find("span.amnt").text().replace(/,/g, '');
                    //$("#ADBpremium").val(benefitAmount);
                    allridertotal();
                    $("#benefitaccidental").val("2");
                    $("#accidentaldeath").find(".benefit-footer").find(".add-benefit-block").find(".cm-error").html("");
                    $("#accidentaldeath").find(".benefit-footer").find(".add-benefit-block").find(".cm-error").hide();
                    $("#allriders").find("li.accidentaldeath").addClass("benefit-added");
                    $(".tab-list").find(".allriders").addClass('benefit-added');
                    $("#accidentaldeath").find('.add-benefit-block').fadeOut();
                    $("#accidentaldeath").find('.add-benefit-block').next('.remove-benefit').fadeIn();
                    $("#accidentaldeath").find('.benefit-cta').siblings('.benefit-widget').addClass('disabled');
                    $(".tab-list > ul > li.accidentaldeath").addClass('benefit-added');
                    // //BuyPremium();
                }

                // Permanent Disability Rider
                if (value[12] == "Y") {
                    $("#benefitdisability").val("2");
                    $("#disabilitySlider").get(0).noUiSlider.updateOptions({
                        start: value[13], range: {
                            'min': 100000, 'max': 10000000
                        },
                        step: 100000
                    });
                    //benefitAmount = $("#permanentdisability").find(".benefit-footer").find(".benefit-cta").find("span.amnt").text().replace(/,/g, '');
                    //$("#ATPDpremium").val(benefitAmount);
                    allridertotal();
                    blockBenefit = true;
                    $("#permanentdisability").find(".benefit-footer").find(".add-benefit-block").find(".cm-error").html("");
                    $("#permanentdisability").find(".benefit-footer").find(".add-benefit-block").find(".cm-error").hide();
                    $("#allriders").find("li.permanentdisability").addClass("benefit-added");
                    $(".tab-list").find(".allriders").addClass('benefit-added');
                    $("#permanentdisability").find('.add-benefit-block').fadeOut();
                    $("#permanentdisability").find('.add-benefit-block').next('.remove-benefit').fadeIn();
                    $("#permanentdisability").find('.benefit-cta').siblings('.benefit-widget').addClass('disabled');
                    $(".tab-list > ul > li.permanentdisability").addClass('benefit-added');
                    // //BuyPremium();
                }

                // CI Rider
                if (value[10] == "Y") {
                    $("#benefitci").val("2");
                    $("#illnessslider").get(0).noUiSlider.updateOptions({
                        start: value[11], range: {
                            'min': 100000, 'max': 10000000
                        },
                        step: 100000
                    });
                    //benefitAmount = $("#cirider").find(".benefit-footer").find(".benefit-cta").find("span.amnt").text().replace(/,/g, '');
                    //$("#CIRiderpremium").val(benefitAmount);
                    allridertotal();
                    blockBenefit = true;
                    $("#cirider").find(".benefit-footer").find(".add-benefit-block").find(".cm-error").html("");
                    $("#cirider").find(".benefit-footer").find(".add-benefit-block").find(".cm-error").hide();
                    $("#allriders").find("li.cirider").addClass("benefit-added");
                    $(".tab-list").find(".allriders").addClass('benefit-added');
                    $("#cirider").find('.add-benefit-block').fadeOut();
                    $("#cirider").find('.add-benefit-block').next('.remove-benefit').fadeIn();
                    $("#cirider").find('.benefit-cta').siblings('.benefit-widget').addClass('disabled');
                    $(".tab-list > ul > li.cirider").addClass('benefit-added');
                    setPaymentTerm();
                }

                // HCB Rider
                if (value[14] == "Y") {
                    $("#benefithcb").val("2");
                    $("#illnessslider").get(0).noUiSlider.updateOptions({
                        start: value[15], range: {
                            'min': 100000, 'max': 10000000
                        },
                        step: 100000
                    });
                    //benefitAmount = $("#hcb").find(".benefit-footer").find(".benefit-cta").find("span.amnt").text().replace(/,/g, '');
                    //$("#HCBpremium").val(benefitAmount);
                    allridertotal();
                    $("#hcb").find(".benefit-footer").find(".add-benefit-block").find(".cm-error").html("");
                    $("#hcb").find(".benefit-footer").find(".add-benefit-block").find(".cm-error").hide();
                    $("#allriders").find("li.hcb").addClass("benefit-added");
                    $(".tab-list").find(".allriders").addClass('benefit-added');
                    $("#hcb").find('.add-benefit-block').fadeOut();
                    $("#hcb").find('.add-benefit-block').next('.remove-benefit').fadeIn();
                    $("#hcb").find('.benefit-cta').siblings('.benefit-widget').addClass('disabled');
                    $(".tab-list > ul > li.hcb").addClass('benefit-added');
                    setPaymentTerm();
                }

                $.removeCookie('zindagiplus', { path: '/' });
                $.removeCookie("laData", { path: '/' });
                $.removeCookie("spouseData", { path: '/' });
                tabs();
                binddata(3);
            }
        }
    }

    $('#benefitselected li').on('click', function (event) {
        var selectedbenefit = $(this).data("tabid");
        if ($(".tab-content-rider").find(".tab-detail").hasClass("active")) {
            $(".tab-content-rider").find(".tab-detail.active").hide();
        }
        $(".tab-content-rider").find(".tab-detail").removeClass("active");
        $("#" + selectedbenefit).addClass("active").fadeIn();
    });
});
