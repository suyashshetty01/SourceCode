$().ready(function () {

    visibilityControlOnDropdown("ProposerBetterHalf", "Please select,No", "dvQuoteLifeAssured");

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

    var date_input = $('input[name="ProposerDOB"]'); //our date input has the name "date"
    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    date_input.datepicker({

        format: 'mm/dd/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,

    }).on('change', function (e) {

        var currentDate = new Date();
        var selectedDate = new Date($(this).val());
        var age = currentDate.getFullYear() - selectedDate.getFullYear();
        var m = currentDate.getMonth() - selectedDate.getMonth();
        if (m < 0 || (m === 0 && currentDate.getDate() < selectedDate.getDate())) {
            age--;
        }
        $('#Proposerage').val(age);
    });


    var date_input = $('input[name="LifeAssuredDOB"]'); //our date input has the name "date"
    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    date_input.datepicker({
        format: 'mm/dd/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,
    }).on('change', function (e) {

        var currentDate = new Date();
        var selectedDate = new Date($(this).val());
        var age = currentDate.getFullYear() - selectedDate.getFullYear();
        var m = currentDate.getMonth() - selectedDate.getMonth();
        if (m < 0 || (m === 0 && currentDate.getDate() < selectedDate.getDate())) {
            age--;
        }
        $('#LifeAssuredAge').val(age);
    });

    //$("#divADBCover").height("145");
    //$("#divATPDCOver").height("145");
    //$("#divCICover").height("145");
    //$("#divHCBCover").height("145");

    $(".col-md-4").height(80);
    var emailregex = /^([a-zA-Z\d_\.\-\+%])+\@(([a-zA-Z\d\-])+\.)+([a-zA-Z\d]{2,4})+$/;

    $.validator.addMethod("regex", function (value, element, regexp) {
        var check = false;
        return this.optional(element) || regexp.test(value);
    }, "Invalid input");

    $.validator.addMethod("GreaterThanZeroregex", function (value, element, regexp) {
        var check = false;
        return this.optional(element) || regexp.test(value);
    }, "Value should be greater than 0");

    $.validator.addMethod("Emailregex", function (value, element, emailregex) {
        var check = false;
        return this.optional(element) || emailregex.test(value);
    }, "Please enter a valid email address.");

    $.validator.addMethod("Landlineregex", function (value, element, emailregex) {
        var check = false;
        return this.optional(element) || emailregex.test(value);
    }, "Please enter a valid phone number.");

    jQuery.validator.addMethod("notEqual", function (value, element, param) {
        return this.optional(element) || value != $(param).val();
    }, "Invalid Input");

    jQuery.validator.addMethod("policyDateValidation", function (value, element, param) {
        var thisDate = new Date(value.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
        var LADOB = new Date($('#txtLADOB').val().replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
        return (thisDate < LADOB) ? false : true;
    }, "please provide correct date");

    $.validator.addMethod("NomineeShare", function () {
        var AllTextBoxes = $('.allocation:visible');
        var total = 0;
        $.each(AllTextBoxes, function () {
            total += parseInt($(this).val());
        });
        if (total != 100)
            return false;
        else
            return true;
    }, "Sum of all Nominees share should be 100");

    $('select, .datepicker').change(function () {
        $(this).valid();
    });

    $("#LA_PermanentAddressLine1, #LA_PermanentAddressLine2, #LA_PermanentAddressLine3, #LA_PermanentAddressState, #LA_PermanentAddressCity, #LA_CurrentAddressLine1, #LA_CurrentAddressLine2, #LA_CurrentAddressLine3, #LA_CurrentAddressState, #LA_CurrentAddressCity").bind("keypress", function (e) {
        var result;
        var keyCode = e.which ? e.which : e.keyCode
        if ($(this).val() == "") {
            result = ((keyCode == 35) || (keyCode == 39) || (keyCode == 63));
        }
        else {
            result = (((keyCode == 35) || (keyCode == 39) || (keyCode == 63)));
        }

        return !result;
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

    jQuery.validator.addMethod(
      "ProposerDOB",
      function (value, element) {
          var check = false;
          var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
          if (re.test(value)) {
              var adata = value.split('/');
              var mm = parseInt(adata[0], 10); // was gg (giorno / day)
              var dd = parseInt(adata[1], 10); // was mm (mese / month)
              var yyyy = parseInt(adata[2], 10); // was aaaa (anno / year)
              var xdata = new Date(yyyy, mm - 1, dd);
              if ((xdata.getFullYear() == yyyy) && (xdata.getMonth() == mm - 1) && (xdata.getDate() == dd))
                  check = true;
              else
                  check = false;
          } else
              check = false;
          return this.optional(element) || check;
      },
      "Please enter a valid date (m/d/yyyy)"
  );

    $("#tabQuoteZindagiPlus").validate({
        rules: {
            ProposerTitle: { required: true },
            ProposerFirstName: { required: true, maxlength: 60, regex: /^[a-zA-Z]*$/ },
            ProposerLastName: { required: true, maxlength: 60, regex: /^[a-zA-Z]*$/ },
            ProposerDOB: { required: true },
            ProposerEmailId: { required: true, Emailregex: /^([a-zA-Z\d_\.\-\+%])+\@(([a-zA-Z\d\-])+\.)+([a-zA-Z\d]{2,4})+$/ },
            ProposerMobileNo: { required: true, regex: /^[6-9][0-9]{9}$/ },
            ProposerMaritalStatus: { required: true },
            ProposerSmoke: { required: true },
            ProposerBetterHalf: { required: true },
            Proposerage: { min: 18, max: 65 },
            //ProposerStaff: { required: true },

            LifeAssuredFirstName: { required: true, maxlength: 60, regex: /^[a-zA-Z]*$/ },
            LifeAssuredLastName: { required: true, maxlength: 60, regex: /^[a-zA-Z]*$/ },
            LifeAssuredDOB: { required: true, regex: /^\d{1,2}\/\d{1,2}\/\d{4}$/ },
            LifeAssuredMobileNo: { regex: /^[6-9][0-9]{9}$/ },
            LifeAssuredEmailId: { Emailregex: /^([a-zA-Z\d_\.\-\+%])+\@(([a-zA-Z\d\-])+\.)+([a-zA-Z\d]{2,4})+$/ },
            LifeAssuredAge: { min: 18 },
            LifeAssuredTobacco: { required: true },
            //PremiumPayingTerm: { required: true },
            //PolicyTerm: { required: true },
            SumAssuredAmount: { required: true, min: 2500000, max: 100000000 },
            Frequency: { required: true },


            HCBCover: { min: 100000, max: 600000 },
            ADBCover: { min: 100000, max: 10000000 },
            ATPDCover: { min: 100000, max: 10000000 },
            CICover: { min: 100000, max: 5000000 }
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
    })
    $("#btnCalcPremium").click(function () {
        var status = false;
        status = $("#tabQuoteZindagiPlus").validate({
            rules: {

                ProposerTitle: { required: true },
                ProposerFirstName: { required: true, maxlength: 60, regex: /^[a-zA-Z]*$/ },
                ProposerLastName: { required: true, maxlength: 60, regex: /^[a-zA-Z]*$/ },
                ProposerDOB: { required: true },
                ProposerEmailId: { required: true, Emailregex: /^([a-zA-Z\d_\.\-\+%])+\@(([a-zA-Z\d\-])+\.)+([a-zA-Z\d]{2,4})+$/ },
                ProposerMobileNo: { required: true, regex: /^[6-9][0-9]{9}$/ },
                ProposerMaritalStatus: { required: true },
                ProposerSmoke: { required: true },
                ProposerBetterHalf: { required: true },
                Proposerage: { min: 18, max: 65 },
                //ProposerStaff: { required: true },

                LifeAssuredFirstName: { required: true, maxlength: 60, regex: /^[a-zA-Z]*$/ },
                LifeAssuredLastName: { required: true, maxlength: 60, regex: /^[a-zA-Z]*$/ },
                LifeAssuredDOB: { required: true, regex: /^\d{1,2}\/\d{1,2}\/\d{4}$/ },
                LifeAssuredMobileNo: { regex: /^[6-9][0-9]{9}$/ },
                LifeAssuredEmailId: { Emailregex: /^([a-zA-Z\d_\.\-\+%])+\@(([a-zA-Z\d\-])+\.)+([a-zA-Z\d]{2,4})+$/ },
                LifeAssuredAge: { min: 18 },
                LifeAssuredTobacco: { required: true },
                //PremiumPayingTerm: { required: true },
                //PolicyTerm: { required: true },
                SumAssuredAmount: { required: true, min: 2500000, max: 100000000 },
                Frequency: { required: true },


                HCBCover: { min: 100000, max: 600000 },
                ADBCover: { min: 100000, max: 10000000 },
                ATPDCover: { min: 100000, max: 10000000 },
                CICover: { min: 100000, max: 5000000 }

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
        if (status) {
            status = getPremium();

        }
        return false;
    });

    $("#btnConfirm").click(function () {

        SaveQuoteDetails();
        return false;
    });

    $("#riderDetails input[id$='Cover']").each(function () {
        $(this).on("keyup", function () {
            var id = $(this).attr("id");
            var element = $(this).attr("id");
            id = "btn" + id + "Amount";
            
            if ((element=="ADBCover" || element=="ATPDCover") && $(this).val() >= 100000 && $(this).val() <= 10000000) {
                $("#" + id).removeAttr("disabled");
            }
            else if(element=="CICover" && $(this).val() >= 100000 && $(this).val() <= 5000000)
            {
                $("#" + id).removeAttr("disabled");
            }
            else if (element == "HCBCover" && $(this).val() >= 100000 && $(this).val() <= 600000) {
                $("#" + id).removeAttr("disabled");
            }
            else { $("#" + id).attr("disabled", "disabled"); }
        });
    });

    //$(".benefit").on("change", function () {
    //    if ($(this).val() == "Yes") {
    //        $("#btnCalcPremium").click();

    //    }
    //});

    //Not allow to select better half if marital status selected as single
    $("#ProposerMaritalStatus").on("change", function () {
        console.log($(this).val());
        if ($(this).val() == "M") {
            $("#ProposerBetterHalf").removeAttr("disabled")
            //$("#dvQuoteLifeAssured").show();
            $("#lblBHBError").html("");
            //setBetterHalf();
        } else {
            $("#dvQuoteLifeAssured").hide();
            $("#ProposerBetterHalf").val("");
            $("#ProposerBetterHalf").attr("disabled", "disabled");
            $("#btnAddBHBnefitAmount").attr("disabled", "disabled");
            resetwifeDetails();
            $("#lblBHBError").html("This benefit is applicable for married people only.");

        }

    });

    //Checking Age should be between 18 to 65.......
    $('#ProposerDOB').on('change', function () {
        if ($(this).val().length == 10) {
            var age = getAge($(this).val());
            if (age > 0) {
                if (age < 18 || age > 65) {
                    $(this).siblings(".age_error").html("age should be between 18 to 65");
                    $(this).siblings('.age_error').show();
                    $("#policyTermError").show();
                    $("#policyTermList").attr("disabled");
                }
                else {
                    $(this).siblings(".age_error").html("");
                    $(this).siblings('.age_error').hide();
                    $("#policyTermError").hide();
                    $("#policyTermList").removeAttr("disabled");
                    setPolicyTerm(0, age);
                }
            } else {
                $(this).siblings(".age_error").html("age should be between 18 to 65");
                $(this).siblings('.age_error').show();
                $("#policyTermError").show();
                $("#policyTermList").attr("disabled", "disabled");
            }
        }
        else {
            $(this).siblings(".age_error").html("");
            $(this).siblings('.age_error').hide();
            $("#policyTermError").hide();
            $("#policyTermList").removeAttr("disabled");
            setPolicyTerm(0, age);
        }
    });

    //$("#LifeAssuredLastName,#LifeAssuredFirstName").on('blur', function () {
    //    var spousename = $("#LifeAssuredFirstName").val() + " " + $("#LifeAssuredLastName").val();
    //    if (spousename != "")
    //        if (setBetterHalf())
    //            getPremium();
    //});

    function checkProposerDataFill() {
        $("#dvQuoteProposerData").find("input,select").each(function () {
            if ($(this).val().trim() == '') {
                $(this).siblings(".invalid_error").show();

            }
        });
    }

    $('#LifeAssuredDOB').datepicker({

        format: 'mm/dd/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,

    }).on('changeDate', function () {
        console.log("Change");
        if ($("#ProposerFirstName").val().trim() == "" || $("#ProposerLastName").val().trim() == "" || $("#ProposerDOB").val().length != 10 ) {
            checkProposerDataFill();
            $("#lblProposerError").text("Please enter your details before Life Assured Details");
            //alert("Please enter your details before Life Assured Details");
            $(this).val("");
        }
        else {
            if ($(this).val().length == 10) {

                var LAAge = $("#Proposerage").val();
                var wifeage = getAge($(this).val());
                var agediff = LAAge - wifeage;
                var benefitdecreasing = parseInt($("#benefitdecreasing").val());
                var sumassuredamount = parseInt($("#SumAssuredAmount").val().replace(/,/g, ''));
                var paymentTerm = $("#lblpaymentTerm").text();

                if (setBetterHalf()) {
                    $("#getbetterhalf").val("1");
                    getPremium();
                    $("#btnAddBHBnefitAmount").removeAttr("disable");
                }
            }
            else {
                $("#btnAddBHBnefitAmount").attr("disable", "disable");
            }
        }
    });

    // SumAssuredAmount Validation
    $("#SumAssuredAmount").bind('blur', function () {

        if ($("#SumAssuredAmount").val() != "") {
            sumassuredamount = parseInt($("#SumAssuredAmount").val().replace(/,/g, ''));
            var amount = convertNumberToWords(sumassuredamount);
            //$("#SumAssuredAmount").val(amount);
            $(this).siblings('.extra-info').html("<b>" + amount + "</b>");
            benefitbetterhalf = parseInt($("#ProposerBetterHalf").val() == "Yes" ? "2" : "1");
            benefittopup = parseInt($("#TUB").val() == "Yes" ? "2" : "1");
            oldpaymentterm = (parseInt($("#Proposerage").val()) + parseInt($("#paymentTerm").val())) + " years of your age";

            //  console.log(sumassuredamount);
            if (sumassuredamount < 5000000 && (benefitbetterhalf == 2 || benefittopup == 2)) {
                $(this).siblings('.tooltip-desc').html("The minimum life cover amount is 50 lakhs");
                $(this).focus();
                $("#ProposerBetterHalf").val("");
                $("#TUB").val("");

            } else if (sumassuredamount < 5000000 && oldpaymentterm == "60 years of your age") {
                $(this).siblings('.tooltip-desc').html("The minimum life cover amount for pay till 60 is 50 lakhs");
                $(this).focus();

            }
            else if ((sumassuredamount % 100000) > 0) {
                $(this).siblings('.tooltip-desc').html("Please enter amount in multiples of lakhs");
                $(this).focus();

            }
            else {
                $(this).siblings('.tooltip-desc').html("");
                //setPaymentTerm();
                setTopUP();
                setBetterHalf();
                //setWOP();
                //finalamountstart = sumassuredamount / 2;
                //setAllocationSlider(finalamountstart, sumassuredamount)
                //$("#processdata").val(1);
                //getPremium();
            }

        }
        else {
            $(this).siblings('.tooltip-cont').find(".tooltip-desc").find("p").html("Please enter amount in multiples of lakhs");
            $(this).siblings('.tooltip-cont').fadeIn().addClass('cm-bounce');
            $(this).focus();

        }
    });


    function resetwifeDetails() {
        $("#dvQuoteLifeAssured").each(function () {
            $(this).find("input").val("");
           // $(this).find("select").val("");
        });
    }

    function setBetterHalf() {
        var sumassuredamount = parseInt($("#SumAssuredAmount").val().replace(/,/g, ''));
        var maritialstatus = $("#ProposerMaritalStatus").val();
        var LAAge = getAge($("#ProposerDOB").val());
        var wifeage = getAge($("#LifeAssuredDOB").val());
        var maxwifeage = 60;
        var paymentTerm = $("#lblpaymentTerm").text();
        var bhstatus = false;
        var benefitbetterhalf = parseInt($("#benefitbetterhalf").val());
        var policyTerm = parseInt($("#lblpolicyTerm").text())
        var benefitdecreasing = parseInt($("#benefitdecreasing").val());
        var spousename = $("#LifeAssuredFirstName").val() + " " + $("#LifeAssuredMiddleName").val() + " " + $("#LifeAssuredLastName").val();
        spousename = spousename.replace("  ", "");

        if (wifeage > 50 && paymentTerm == "60 years of your age" && policyTerm != 60)
            maxwifeage = 50;
        else if (benefitdecreasing == 2)
            maxwifeage = 55;
        else
            maxwifeage = 60;

        agediff = LAAge - wifeage;

        if (maritialstatus == "S" || maritialstatus == "") {
            $("#dvQuoteLifeAssured").hide();
            resetwifeDetails();
            $("#BHpremium").val("0");
            $("#getbetterhalf").val("0");
            $("#benefitbetterhalf").val("1");
            bhstatus = false;

        } else {
            $("#dvQuoteLifeAssured").show();

            if (spousename == "") {

                $("#lblLifeAssuredError").html("Please enter your spouse name to add the benefit");
                bhstatus = false;
            }
            else if (isNaN(wifeage) || wifeage <= 0) {
                $("#lblLifeAssuredError").html("Please enter the correct date of birth (mm/dd/yyyy)");
                bhstatus = false;
            }
            else if (wifeage < 18 || wifeage > maxwifeage) {
                $("#lblLifeAssuredError").html("To avail this benefit, the age of your spouse should be between 18-" + maxwifeage + " years");
                $("#getbetterhalf").val("0");
                //resetwifeDetails();
                $("#LifeAssuredDOB").val("");
                $("#LifeAssuredAge").val("");
                $("#btnAddBHBnefitAmount").attr('disable', 'disable');
                bhstatus = false;
            }
            else if (Math.abs(agediff) > 10) {

                $("#lblLifeAssuredError").html("Benefit is  applicable for couples with an age difference of not more than 10 years");
                $("#getbetterhalf").val("0");
                //resetwifeDetails();
                $("#LifeAssuredDOB").val("");
                $("#LifeAssuredAge").val("");
                $("#btnAddBHBnefitAmount").attr('disable', 'disable');
                bhstatus = false;
            } else if (sumassuredamount < 5000000) {
                $("#benefitbetterhalf").val("0");
                $("#BHpremium").val("0");

                $("#lblLifeAssuredError").html("Benefit is  applicable for life cover amount more than or equal to 50 Lakhs");
                //resetwifeDetails();
                $("#LifeAssuredDOB").val("");
                $("#LifeAssuredAge").val("");
                $("#btnAddBHBnefitAmount").attr('disable', 'disable');
                bhstatus = false;
            }
            else if (benefitbetterhalf != 2) {
                $("#lblLifeAssuredError").html("");
                $("#btnAddBHBnefitAmount").removeAttr("disabled");
                bhstatus = true;
            }
        }

        if (!bhstatus)
            checkReset();

        return bhstatus;
    }


    function checkReset() {
        var betterhalf = $("#benefitbetterhalf").val();
        var benefitdecreasing = parseInt($("#benefitdecreasing").val());
        var sumassuredamount = parseInt($("#SumAssuredAmount").val().replace(/,/g, ''));
        var paymentTerm = $("#lblpaymentTerm").text();
        var policyTerm = parseInt($("#lblpolicyTerm").text())

        if (parseInt(betterhalf) == 2) {
            dob = $("#ProposerDOB").val();
            age = getAge($("#ProposerDOB").val());
            wifeage = getAge($("#LifeAssuredDOB").val());
            agediff = age - wifeage;
            if (wifeage > 50 && paymentTerm == "60 years of your age" && policyTerm != 60)
                maxwifeage = 50;
            else if (benefitdecreasing == 2)
                maxwifeage = 55;
            else
                maxwifeage = 60;

            if (wifeage > maxwifeage || sumassuredamount < 5000000 || Math.abs(agediff) > 10) {
                $("#benefitbetterhalf").val("0");
                $("#BHpremium").val("0");
                $("#getbetterhalf").val("0");

            }
        }
    }



    function setPolicyTerm(type, age) {
        var oldterm = $("#lblpolicyTerm").text();
        if (age == "" || age == null || age == "undefined") {
            age = $("#Proposerage").val();
        }
        LAAge = parseInt(age);

        if (type == 1) {
            $("#lblpolicyTerm").text(oldterm);
            //$("#policyTermList").val($("#lblpolicyTerm").text());
            termend = oldterm - LAAge;
            policyTerm = 65;
            $("#PolicyTerm").val(termend);
        } else if (type == 2) {
            $("#lblpolicyTerm").text(oldterm);
            //$("#policyTermList").val($("#lblpolicyTerm").text());
            termend = oldterm - LAAge;
            policyTerm = LAAge + 10;
            $("#PolicyTerm").val(termend);
        }
        else {
            $("#lblpolicyTerm").text("80");
            //$("#policyTermList").val($("#lblpolicyTerm").text());
            $("#lblpaymentTerm").text("80 years of your age");
            $("#paymentTermList").val($("#lblpaymentTerm").text());
            termend = 80 - LAAge;
            policyTerm = LAAge + 10;
            $("#PolicyTerm").val(termend);
            $("#PremiumPayingTerm").val(termend);
        }

        $('#policyTermList > option').remove();
        for (i = 80 ; i >= policyTerm ; i--) {
            $("#policyTermList").append('<option value=' + i + '>' + i + '</li>');
        }
        $("#policyTermList").val($("#lblpolicyTerm").text());

        //setCritiCareTerm();
        if (type == 0)
            setPaymentTerm();

        //$(".edit-info").find(".ptpptdetails").find(".tooltip-desc").find("p").html("Your policy term is " + termend + " years and premium paying term is " + termend + " years");
        //console.log("Your policy term is " + termend + " years and premium paying term is " + termend + " years");
        $("#policyTermList").on('change', function (event) {
            $("#lblpolicyTerm").text($(this).val());
            termend = parseInt($(this).val()) - LAAge;
            if ($("#lblpaymentTerm").text() != "60 years of your age" && $("#lblpaymentTerm").val() != "60 years of your age") {
                $("#PolicyTerm").val(termend);
                $("#PremiumPayingTerm").val(termend);

            } else {
                $("#PolicyTerm").val(termend);
            }
            $("#divpolicyTermRemarks").show();
            $("#policyTermRemarks").text("Your policy term is " + termend + " years and premium paying term is " + $("#PremiumPayingTerm").val() + " years");
            //console.log("Your policy term is " + termend + " years and premium paying term is " + $("#ppt").val() + " years");
            //$('.dropdown-list').hide();
            //$('.dropdown-list').siblings('.tooltip-cont').fadeOut();
            setPaymentTerm();
            //getPremium();
        });

    }




    $(".benefit").on("change", function () {
        var id = $(this).attr("id");
        if ($(this).val() == "Yes") {
            if (id == "ProposerBetterHalf") {
                $("#dvQuoteLifeAssured").show();
                $("#btnAddBHBnefitAmount").removeAttr("disabled");
            }
            if (id == "TUB") {
                $("#btnAddTUBnefitAmount").removeAttr("disabled");
            }
            if (id == "WOP") {
                $("#btnAddWOPnefitAmount").removeAttr("disabled");
            }
            if (id == "RiderDSA") {
                $("#btnAddDSAnefitAmount").removeAttr("disabled");
            }
            if (id == "ADB") {
                $("#ADBCover").removeAttr("disabled");
                $("#btnADBCoverAmount").removeAttr("disabled");
            }
            if (id == "ATPD") {
                $("#ATPDCover").removeAttr("disabled");
                $("#btnATPDCoverAmount").removeAttr("disabled");
            }
            if (id == "CI") {
                $("#CICover").removeAttr("disabled");
                $("#btnCICoverAmount").removeAttr("disabled");
            }
            if (id == "HCB") {
                $("#HCBCover").removeAttr("disabled");
                $("#btnHCBCoverAmount").removeAttr("disabled");
            }

        }
        else {
            if (id == "ProposerBetterHalf") {
                $("#dvQuoteLifeAssured").hide();
                $("#btnAddBHBnefitAmount").attr("disabled", "disabled");
            }
            if (id == "TUB") {
                $("#btnAddTUBnefitAmount").attr("disabled", "disabled");
            }
            if (id == "WOP") {
                $("#btnAddWOPnefitAmount").attr("disabled", "disabled");
            }
            if (id == "RiderDSA") {
                $("#btnAddDSAnefitAmount").attr("disabled", "disabled");
            }
            if (id == "ADB") {
                $("#ADBCover").attr("disabled", "disabled");
                $("#btnADBCoverAmount").attr("disabled", "disabled");
            }
            if (id == "ATPD") {
                $("#ATPDCover").attr("disabled", "disabled");
                $("#btnATPDCoverAmount").attr("disabled", "disabled");
            }
            if (id == "CI") {
                $("#CICover").attr("disabled", "disabled");
                $("#btnCICoverAmount").attr("disabled", "disabled");
            }
            if (id == "HCB") {
                $("#HCBCover").attr("disabled", "disabled");
                $("#btnHCBCoverAmount").attr("disabled", "disabled");
            }
        }
    });

    //Add benefit for Top Up
    $("#btnAddTUBnefitAmount").unbind('click').bind('click', function (e) {

        var sumassuredamount = parseInt($("#SumAssuredAmount").val().replace(/,/g, ''));
        var benefittopup = $("#TUB").val();
        var paymentTerm = $("#lblpaymentTerm").text();
        var benefitAdded = "topup";

        if (setTopUP()) {
            $("#addbenefittype").val("Top-up Benefit");
            $("#addbenefitpercent").val($('#RiderTopUp').val() + "%");
            $("#benefittopup").val("2");
            $("#benefitpremiumwaiver").val("0");
            setPaymentTerm();
            getPremium();
        }
        $("#btnRemoveTUBnefitAmount").show();
        $("#btnAddTUBnefitAmount").hide();
        return false;

    });

    $("#btnAddWOPnefitAmount").unbind('click').bind('click', function (e) {
        if (setWOP()) {
            $("#benefitpremiumwaiver").val("2");
            $("#benefittopup").val("0");
            $("#addbenefittype").val("Waiver of Premium Benefit");
            $("#addbenefitpercent").val("");
            benefitAmount = $("#WOPAddBenefitAmount").val().replace(/,/g, '');
            $("#waiverpremium").val(benefitAmount);
            setPaymentTerm();
            getPremium();
        }
        $("#btnRemoveWOPBnefitAmount").show();
        $("#btnAddWOPnefitAmount").hide();
        return false;

    });

    //Add benefit for Better Half
    $("#btnAddBHBnefitAmount").unbind('click').bind('click', function (e) {
        var blockBenefit = false;
        var benefitAdded = "betterhalf";
        var LAAge = getAge($("#ProposerDOB").val());
        var benefitdecreasing = parseInt($("#benefitdecreasing").val());
        var benefitpremiumwaiver = $("#benefitpremiumwaiver").val();
        var sumassuredamount = parseInt($("#SumAssuredAmount").val().replace(/,/g, ''));
        var benefittopup = $("#benefittopup").val();
        var paymentTerm = $("#lblpaymentTerm").text();
        var spousename = $("#LifeAssuredFirstName").val() + " " + $("#LifeAssuredMiddleName").val() + " " + $("#LifeAssuredLastName").val();
        spousename = spousename.replace("  ", "");

        var inputValue;
        inputValue = $("#LifeAssuredDOB").val();

        if (inputValue.length == 10) {
            $("#lblLifeAssuredError").html("");
            if (setBetterHalf()) {
                $("#benefitbetterhalf").val("2");
                //$("#BHpremium").val(benefitAmount);
                $("#getbetterhalf").val("1");
                blockBenefit = true;
                setPaymentTerm();
                getPremium();
            }
        }
        else if (spousename.trim() == "") {
            $("#lblLifeAssuredError").html("Please enter your spouse name to add the benefit");
        }
        else {
            $("#lblLifeAssuredError").html("Please enter the correct date of birth (mm/dd/yyyy)");
        }

        $("#btnAddBHBnefitAmount").hide();
        $("#btnRemoveBHBnefitAmount").show();


        return false;
    });



    //Add benefit for Accidental Death ADB
    $("#btnADBCoverAmount").unbind('click').bind('click', function (e) {
        if ($("#ADBCover").siblings(".invalid").length == 0 || $("#ADBCover").siblings(".invalid").css("display") == "none") {
            $("#benefitaccidental").val("2");
            getPremium();

            benefitAmount = $("#ADBPremiumAmount").val().replace(/,/g, '');
            $("#ADBpremium").val(benefitAmount);
            allridertotal();
            $("#btnRemoveADBCoverAmount").show();
            $("#btnADBCoverAmount").hide();
        }
        else {
            return false;
        }
        return false;

    });

    //Add benefit for permanent disability
    $("#btnATPDCoverAmount").unbind('click').bind('click', function (e) {
        if ($("#ATPDCover").siblings(".invalid").length == 0 || $("#ATPDCover").siblings(".invalid").css("display") == "none") {
            $("#benefitdisability").val("2");
            getPremium();
            benefitAmount = $("#ATPDPremiumAmount").val().replace(/,/g, '');
            $("#ATPDpremium").val(benefitAmount);
            allridertotal();
            $("#btnRemoveATPDCoverAmount").show();
            $("#btnATPDCoverAmount").hide();
        }
        else {
            return false;
        }
        return false;

    });

    //add benefit for Critical Illnes Rider
    $("#btnCICoverAmount").unbind('click').bind('click', function (e) {
        if ($("#CICover").siblings(".invalid").length == 0 || $("#CICover").siblings(".invalid").css("display") == "none") {
            if (setCIRider()) {
                $("#benefitci").val("2");
                getPremium();
                benefitAmount = $("#CIPremiumAmount").val().replace(/,/g, '');
                $("#CIRiderpremium").val(benefitAmount);
                allridertotal();
                $("#btnRemoveCICoverAmount").show();
                $("#btnCICoverAmount").hide();
                setPaymentTerm();
            }
        }
        else {
            return false;
        }
        return false;

    });

    //Add benefit for Hospital Cash Benefit
    $("#btnHCBCoverAmount").unbind('click').bind('click', function (e) {
        if ($("#HCBCover").siblings(".invalid").length == 0 || $("#HCBCover").siblings(".invalid").css("display") == "none") {
            if (setHCB()) {
                $("#benefithcb").val("2");
                getPremium();
                benefitAmount = $("#HCBPremiumAmount").val().replace(/,/g, '');
                $("#HCBpremium").val(benefitAmount);
                allridertotal();
                $("#btnRemoveHCBCoverAmount").show();
                $("#btnHCBCoverAmount").hide();
                setPaymentTerm();
            }
        }
        else {
            return false;
        }
        return false;

    });

    //Add benefit for Decreasing Sum Assured Benefit
    $("#btnAddDSAnefitAmount").unbind('click').bind('click', function (e) {
        if (setDSA()) {
            $("#benefitdecreasing").val("2");
            getPremium();
            setPolicyTerm(1);
            setPaymentTerm();
            $("#btnAddDSAnefitAmount").hide();
            $("#btnRemoveDSABnefitAmount").show();
        }
        return false;
    });

    //Remove benefit for Accidental Death ADB
    $("#btnRemoveADBCoverAmount").unbind('click').bind('click', function (e) {
        $("#benefitaccidental").val("0");
        $("#ADBpremium").val("0");
        allridertotal();
        $("#btnRemoveADBCoverAmount").hide();
        $("#btnADBCoverAmount").show();
        getPremium();
        return false;

    });

    //Remove benefit for permanent disability
    $("#btnRemoveATPDCoverAmount").unbind('click').bind('click', function (e) {
        $("#benefitdisability").val("0");
        $("#ATPDpremium").val("0");
        allridertotal();
        $("#btnRemoveATPDCoverAmount").hide();
        $("#btnATPDCoverAmount").show();
        getPremium();
        return false;

    });

    //Remove benefit for Critical Illnes Rider
    $("#btnRemoveCICoverAmount").unbind('click').bind('click', function (e) {
        $("#benefitci").val("0");
        $("#CIRiderpremium").val("0");
        allridertotal();
        $("#btnRemoveCICoverAmount").hide();
        $("#btnCICoverAmount").show();
        getPremium();
        setPaymentTerm();

        return false;

    });

    //Remove benefit for Hospital Cash Benefit
    $("#btnRemoveHCBCoverAmount").unbind('click').bind('click', function (e) {
        $("#benefithcb").val("0");
        $("#HCBpremium").val("0");
        allridertotal();
        $("#btnRemoveHCBCoverAmount").hide();
        $("#btnHCBCoverAmount").show();
        getPremium();
        setPaymentTerm();

        return false;

    });

    //Remove Benefit for WOP
    $("#btnRemoveWOPBnefitAmount").unbind('click').bind('click', function (e) {
        $("#benefitpremiumwaiver").val("0");
        $("#waiverpremium").val("0");
        setPaymentTerm();
        $("#btnRemoveWOPBnefitAmount").hide();
        $("#btnAddWOPnefitAmount").show();
        getPremium();
        setPaymentTerm();
        return false;

    });

    //Remove Benefit for Better Half BH
    $("#btnRemoveBHBnefitAmount").unbind('click').bind('click', function (e) {
        $("#benefitbetterhalf").val("0");
        $("#BHpremium").val("0");
        $("#getbetterhalf").val("0");
        $("#spousename").val('').focus().blur();
        resetWifeDOB();
        getPremium();
        setPaymentTerm();
        $("#btnRemoveBHBnefitAmount").hide();
        $("#btnAddBHBnefitAmount").show();
        return false;

    });

    //Remove Benefit for Top Up Benefit
    $("#btnRemoveTUBnefitAmount").unbind('click').bind('click', function (e) {
        $("#benefittopup").val("0");
        $("#benefitpremiumwaiver").val("0");
        $("#addbenefittype").val("Waiver of Premium Benefit");
        $("#addbenefitpercent").val("");

        $("#btnRemoveTUBnefitAmount").hide();
        $("#btnAddTUBnefitAmount").show();
        getPremium();
        setPaymentTerm();
        return false;

    });

    //Remove Benefit for DSA Benefit
    $("#btnRemoveDSABnefitAmount").unbind('click').bind('click', function (e) {
        $("#benefitdecreasing").val("0");
        getPremium();
        setPolicyTerm(2);
        setPaymentTerm();
        $("#btnRemoveDSABnefitAmount").hide();
        $("#btnAddDSAnefitAmount").show();

        return false;

    });

    function allridertotal() {
        var ADBPremium = parseInt($("#ADBpremium").val());
        var ATPDpremium = parseInt($("#ATPDpremium").val());
        var HCBpremium = parseInt($("#HCBpremium").val());
        var CIRiderpremium = parseInt($("#CIRiderpremium").val());
        var totalamount = parseInt(ADBPremium + ATPDpremium + HCBpremium + CIRiderpremium);
        $("#totalRiderAmount").val(totalamount.toString().replace(/\B(?=(\d{1})(\d{2})+(?!\d))/g, ","));

    }

    function setTopUP() {
        var pptType = $("#paymentTermList").val();
        var sumassuredamount = parseInt($("#SumAssuredAmount").val().replace(/,/g, ''));
        var topuprate = $("#RiderTopUp").val();
        var benefittopup = parseInt($("#benefittopup").val());
        var topupstatus = false;
        var policyTerm = parseInt($("#lblpolicyTerm").text())

        if (pptType == "60 years of your age" && policyTerm != 60) {
            $("#divTUBError").html("This benefit is not applicable if you are paying 'Till 60 years'");
            $("#btnAddTUBnefitAmount").addClass('disable');
            $("#benefittopup").val("1");
            topupstatus = false;
        } else if (sumassuredamount < 5000000) {

            $("#benefittopup").val("0");
            $("#benefitpremiumwaiver").val("0");
            $("#addbenefittype").val("Waiver of Premium Benefit");
            $("#addbenefitpercent").val("");

            $("#divTUBError").html("Benefit is applicable for life cover amount more than or equal to 50 Lakhs");
            $("#btnAddTUBnefitAmount").addClass('disable');
            topupstatus = false;
        } else if (benefittopup != 2) {
            $("#divTUBError").html("");
            $("#btnAddTUBnefitAmount").removeClass('disable');
            topupstatus = true;
        }
        return topupstatus;
    }

    function setCIRider() {
        var pptType = $("#lblpaymentTerm").text();
        var benefitdecreasing = parseInt($("#benefitdecreasing").val());
        var CIstatus = false;
        var policyTerm = parseInt($("#lblpolicyTerm").text())
        var benefitci = $("#benefitci").val();

        if (pptType == "60 years of your age" && policyTerm != 60) {
            $("#CIReiderError").html("This benefit is not applicable if you are paying 'Till 60 years'");
            $("#benefitci").val("1");
            CIstatus = false;
        } else if (benefitci != 2) {
            $("#CIReiderError").html("");
            CIstatus = true;
        }
        return CIstatus;
    }

    function setHCB() {
        var pptType = $("#lblpaymentTerm").text();
        var benefitdecreasing = parseInt($("#benefitdecreasing").val());
        var HCBstatus = false;
        var policyTerm = parseInt($("#policyTerm").text())
        var benefithcb = $("#benefithcb").val();


        if (pptType == "60 years of your age" && policyTerm != 60) {
            $("#lblHCBError").html("This benefit is not applicable if you are paying 'Till 60 years'");
            $("#benefithcb").val("1");
            $("#benefitci").val("1");
            HCBstatus = false;
        } else if (benefithcb != 2) {
            $("#lblHCBError").html("");
            HCBstatus = true;
        }

        return HCBstatus;
    }


    function setWOP() {
        var pptType = $("#lblpaymentTerm").text();
        var benefittopup = parseInt($("#benefittopup").val());
        var benefitdecreasing = parseInt($("#benefitdecreasing").val());
        var wopstatus = false;
        var benefitpremiumwaiver = parseInt($("#benefitpremiumwaiver").val());
        var policyTerm = parseInt($("#lblpolicyTerm").text())


        if (pptType == "60 years of your age" && policyTerm != 60) {
            $("#lblWOPError").html("This benefit is not applicable if you are paying 'Till 60 years'");
            $("#benefitpremiumwaiver").val("1");
            wopstatus = false;
        } else if (benefittopup == "2") {
            $("#lblWOPError").html("Waiver of Premium cannot be availed with Top Up Benefit and/or Decreasing Sum Assured. Please choose the option which is more suitable for you.");
            wopstatus = false;
        } else if (benefitdecreasing == "2") {
            $("#lblWOPError").html("Waiver of Premium and Decreasing Sum Assured cannot be availed together. Please choose one which is more suitable for you.");
            wopstatus = false;
        } else if (benefitpremiumwaiver != 2) {
            $("#lblWOPError").html("");
            wopstatus = true;
        }
        return wopstatus;
    }

    function setDSA() {
        var LAAge = getAge($("#ProposerDOB").val());
        var pptType = $("#lblpaymentTerm").text();
        var benefitbetterhalf = $("#benefitbetterhalf").val();
        var wifeDob = getAge($("#LifeAssuredDOB").val());
        var benefitpremiumwaiver = parseInt($("#benefitpremiumwaiver").val());
        var benefitdecreasing = parseInt($("#benefitdecreasing").val());
        var DSAstatus = false;
        var policyTerm = parseInt($("#lblpolicyTerm").text())

        if (LAAge > 55) {
            $("#lblDSAError").html("To avail this benefit, your age should be between 18-55 years");
            DSAstatus = false;
        } else if (policyTerm < 65) {
            $("#lblDSAError").html("Minimum maturity age for Decreasing Sum Assured is 65 years.");
            DSAstatus = false;
        } else if (benefitbetterhalf == 2 && wifeDob > 55) {
            $("#lblDSAError").html("To avail this benefit, the age of your spouse should be between 18-55 years");
            DSAstatus = false;
        } else if (benefitpremiumwaiver == 2) {
            $("#lblDSAError").html("Waiver of Premium and Decreasing Sum Assured cannot be availed together. Please choose one which is more suitable for you.");
            DSAstatus = false;
        }
        else if (pptType == "60 years of your age" && LAAge > 50 && policyTerm != 60) {
            $("#lblDSAError").html("To avail this benefit, your age should be between 18-50 years");
            DSAstatus = false;
        } else if (benefitbetterhalf == 2 && wifeDob > 50 && pptType == "60 years of your age" && policyTerm != 60) {
            $("#lblDSAError").html("To avail this benefit, your spouse's maximum age can be 50 years.");
            DSAstatus = false;
        } else {
            $("#lblDSAError").html("");
            DSAstatus = true;
        }

        if (!DSAstatus && benefitdecreasing == 2) {
            $("#benefitdecreasing").val("0");
        }

        return DSAstatus;
    }


    function setPaymentTerm() {

        var termStart = parseInt($("#lblpolicyTerm").text())
        var termEnd = parseInt($("#policyTermList option").last().text())
        var LAAge = parseInt(($("#Proposerage").val()));
        var wifeage = ($("#LifeAssuredDOB").val() != "") ? parseInt(($("#LifeAssuredAge").val())) : 0;
        var benefittopup = parseInt($("#benefittopup").val());
        var benefitpremiumwaiver = parseInt($("#benefitpremiumwaiver").val());
        var benefithcb = parseInt($("#benefithcb").val());
        var benefitci = parseInt($("#benefitci").val());
        var sumassuredamount = parseInt($("#SumAssuredAmount").val().replace(/,/g, ''));

        var optionvalue = termStart + " years of your age";

        labeltext = "";
        $('#paymentTermList > option').remove();
        $("#paymentTermList").append('<option value=' + optionvalue + '  id="lastvaliditem"> ' + termStart + ' years of your age</option>');
        labeltext = '' + termStart + ' years of your age';
        var oldpaymentterm = $("#lblpaymentTerm").text();
        if (oldpaymentterm != "60 years of your age") {
            $("#lblpaymentTerm").text(labeltext);
        }
        else {
            $('#paymentTermList > option').remove();
            $("#paymentTermList").append('<option value="60 years of your age" id="lastvaliditem"> 60 years of your age</option>');
            $("#paymentTermList").append('<option value="' + optionvalue + '"  id="lastvaliditem"> ' + termStart + ' years of your age</option>');
        }

        if (LAAge <= 50 && LAAge >= 31 && termStart >= 65 && benefittopup != 2 && wifeage < 50 && benefitpremiumwaiver != 2 && benefithcb != 2 && benefitci != 2 && sumassuredamount >= 5000000) {
            $("#paymentTermList").append('<option value=' + termStart + '"years of your age">60 years of your age</option>');
        }
        if ($("#ProposerBetterHalf").val() == "Yes") {
            setBetterHalf();
        }
        if ($("#TUB").val() == "Yes") {
            setTopUP();
        }
        setWOP();
        setDSA();
        setHCB();
        setCIRider();

        $("#paymentTermList").on('change', function (event) {
            $("#lblpaymentTerm").text($(this).val());
            if ($(this).val() == "60 years of your age" && termStart != 60) {
                setPolicyTerm(1);
                pinfoterm = parseInt($("#PolicyTerm").val());
                ppinfoterm = (60 - LAAge) + 1;
                $("#PolicyTerm").val(pinfoterm);
                $("#PremiumPayingTerm").val(ppinfoterm);
                $("#policyTermRemarks").html("Your policy term is " + pinfoterm + " years and premium paying term is " + ppinfoterm + " years");
            }
            else {
                setPolicyTerm(2);
                pinfoterm = parseInt($("#PolicyTerm").val());
                $("#policyTermRemarks").html("Your policy term is " + pinfoterm + " years and premium paying term is " + pinfoterm + " years");
                $("#PolicyTerm").val(pinfoterm);
                $("#PremiumPayingTerm").val(pinfoterm);
            }
            setBetterHalf();
            setTopUP();
            setWOP();
            setDSA();
            setHCB();
            setCIRider();
            getPremium();

        });

    }
});