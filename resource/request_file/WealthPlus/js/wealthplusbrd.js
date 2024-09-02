var winH, winW, headerH, progressH, editH, fundH, posX, posY, piechart, linechart, progresswidth = 0, myTimer, myTimerPPT, totalValue;
totalSections = $('section').length;
fundsTable = [];
fundarray = [];
sideArrayLabels = [];
sideArrayData = [];
sideArrayValues = [];
var siteURL;
var ss_id, fba_id, ip_address, app_version, mac_address, mobile_no;


function getWindowDimensions() {
    winH = $(window).height();
    winW = $(window).width();

}

function calculateHeight() {
    headerH = $('.bs-header').outerHeight(true);
    progressH = $('.mod-progress').height();
    editH = $('.bs-edit').height();
    contentH = winH - (headerH + progressH);
    fundH = contentH - editH;
    // $('.lyt-result').css('height', contentH);
    $('.lyt-fund').css('height', fundH);
    $('.lyt-content').height(winH - (headerH + progressH));

}

function numericInput() {
    $(document).on("input", ".numeric", function () {
        this.value = this.value.replace(/\D/g, '');
    });
}

function round(number, precision) {
    var shift = function (number, precision) {
        var numArray = ("" + number).split("e");
        return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + precision) : precision));
    };
    return shift(Math.round(shift(number, +precision)), -precision);
}

function hideSections() {
    $('.bs-sec').removeClass('active');
    $('.back-btn').hide();
    $('.lyt-form section').children('.bs-sec').addClass('next');
    $('.lyt-form section').eq(0).children('.bs-sec').addClass('active').removeClass('next');
}

function hideMaskedPlaceholder() {
    $('.bdate').each(function () {
        if ($(this).val().length > 0) {
            $(this).prev('span').css('opacity', 0);
        } else {
            $(this).prev('span').css('opacity', 1);
        }
    })

    $('.bdate').on('focus', function () {
        //$(this).prev('span').css('opacity', 0);
        $(this).parent('.shell').next('.btn').css('visibility', 'visible');
    });

    $('#dob').on('keyup', function () {
        if ($(this).val().length == 10) {
            var age = getAge($(this).val());
            if (age > 0) {
                if (age < 18 || age > 100) {
                    $(this).parents('.input-group').next('.extra-info').children('.cm-value').hide();
                    $(this).parents('.input-group').next('.extra-info').children('.cm-error').show();
                    $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("age should be between 18 to 100");
                }
                else {
                    $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("");
                    $(this).parents('.input-group').next('.extra-info').find('.cm-error').hide();
                    $(this).parents('.input-group').next('.extra-info').find('.cm-value').show().children('span').text(age);
                    $(this).parents('.input-group').find('.btn').css('visibility', 'visible');
                }
            } else {
                $(this).parents('.input-group').next('.extra-info').find('.cm-value').hide();
                $(this).parents('.input-group').next('.extra-info').find('.cm-error').show();
            }
        }
        if ($(this).val().length > 0) {
            $(this).prev('span').css('opacity', 0);
        } else {
            $(this).prev('span').css('opacity', 1);
        }
    });

    $('#ladob').on('keyup', function () {
        if ($(this).val().length == 10) {
            var age = getAge($(this).val());
            var proposarage = getAge($("#dob").val());
            var totalage = proposarage + (18 - age);
            if (age > 0 && totalage <= 70) {
                var selectedVal = $('.dropdown-list li').parents('.dropdown-list').siblings('.dropdown-label').text();
                if (selectedVal == "son" || selectedVal == "daughter" || selectedVal == "grandson" || selectedVal == "granddaughter" || selectedVal == "wife" || selectedVal == "husband") {
                    if (age < 1 || age > 55) {
                        if (age < 1) {
                            $(this).parents('.input-group').next('.extra-info').children('.cm-value').hide();
                            $(this).parents('.input-group').next('.extra-info').children('.cm-error').show();
                            $(this).parents('.input-group').siblings('.rising-star').addClass('cm-hidden');
                            $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("Sorry, the minimum age for this policy is 1 year");
                        } else if (age > 55) {
                            $(this).parents('.input-group').next('.extra-info').children('.cm-value').hide();
                            $(this).parents('.input-group').next('.extra-info').children('.cm-error').show();
                            $(this).parents('.input-group').siblings('.rising-star').addClass('cm-hidden');
                            $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("Sorry the maximum age for this policy is 55 years");
                        }
                    }
                    else {

                        if (age < 18 && proposarage <= 55) {
                            $(this).parents('.input-group').next('.extra-info').find('.cm-error').hide();
                            if (age == 1) {
                                $(this).parents('.input-group').next('.extra-info').find('.cm-value').show().children('span').text(age + " year");
                            }
                            else {
                                $(this).parents('.input-group').next('.extra-info').find('.cm-value').show().children('span').text(age + " years");
                            }
                            $(this).parents('.input-group').find('.btn').css('visibility', 'visible');
                            $(this).parents('.input-group').siblings('.rising-star').removeClass('cm-hidden');
                            $(".RisingStarRelation").html(selectedVal);
                            var lafname = $("#lafullname").val().split(" ")[0];
                            $(".RisingStarfName").html(lafname);
                            $("#benefits").prop("checked", true);
                        }
                        else {
                            $(this).parents('.input-group').siblings('.rising-star').addClass('cm-hidden');
                            $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("");
                            $(this).parents('.input-group').next('.extra-info').find('.cm-error').hide();
                            $(this).parents('.input-group').next('.extra-info').find('.cm-value').show().children('span').text(age + " years");
                            $(this).parents('.input-group').find('.btn').css('visibility', 'visible');
                            $("#benefits").prop("checked", false);
                        }
                    }
                }
                else {
                    if (age < 18 || age > 55) {
                        $(this).parents('.input-group').next('.extra-info').children('.cm-value').hide();
                        $(this).parents('.input-group').next('.extra-info').children('.cm-error').show();
                        $(this).parents('.input-group').siblings('.rising-star').addClass('cm-hidden');
                        $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("age should be between 18 to 55");
                    }
                    else {
                        $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("");
                        $(this).parents('.input-group').next('.extra-info').find('.cm-error').hide();
                        $(this).parents('.input-group').next('.extra-info').find('.cm-value').show().children('span').text(age + " years");
                        $(this).parents('.input-group').find('.btn').css('visibility', 'visible');
                        $(this).parents('.input-group').siblings('.rising-star').addClass('cm-hidden');
                    }
                }
            } else {
                $(this).parents('.input-group').next('.extra-info').find('.cm-value').hide();
                $(this).parents('.input-group').next('.extra-info').find('.cm-error').show();
                $(this).parents('.input-group').siblings('.rising-star').addClass('cm-hidden');
            }
        }
        if ($(this).val().length > 0) {
            $(this).prev('span').css('opacity', 0);
        } else {
            $(this).prev('span').css('opacity', 1);
        }
    });


}

function ValidateEmail(mail) {
    var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (regex.test(mail)) {
        return true;
    } else {
        return false;
    }
}

function ValidateFullName(name) {
    var regex = /^\w+\s+\w+/;
    if (regex.test(name)) {
        return true;
    } else {
        return false;
    }
}

function validateMobile(mobile) {
    var regex = /^((\+91?)|\+)?[6-9][0-9]{9}$/;
    if (regex.test(mobile)) {
        return true;
    } else {
        return false;
    }

    $(document).on('input', '.mnumber', function () {
        if (this.value.length > 10) {
            return false;
        }
    });
}

function showInputBtn() {
    $('.form-control').on('blur', function () {
        if ($(this).attr('id') == "dob") {
            if ($(this).val().length == 10) {
                var age = getAge($(this).val());
                if (age > 0) {
                    if (age < 18 || age > 100) {
                        $(this).parents('.input-group').next('.extra-info').children('.cm-value').hide();
                        $(this).parents('.input-group').next('.extra-info').children('.cm-error').show();
                        $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("age should be between 18 to 100");
                    }
                    else {
                        $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("");
                        $(this).parents('.input-group').next('.extra-info').find('.cm-error').hide();
                        $(this).parents('.input-group').next('.extra-info').find('.cm-value').show().children('span').text(age);
                        $(this).parents('.input-group').find('.btn').css('visibility', 'visible');
                    }
                } else {
                    $(this).parents('.input-group').next('.extra-info').find('.cm-value').hide();
                    $(this).parents('.input-group').next('.extra-info').find('.cm-error').show();
                }
            }
            else {
                $(this).parents('.input-group').find('.btn').css('visibility', 'hidden');
                $(this).parents('.input-group').next('.extra-info').find('.cm-value').hide();
                $(this).parents('.input-group').next('.extra-info').find('.cm-error').show();
            }
        }
        if ($(this).attr('id') == "ladob") {
            if ($(this).val().length == 10) {
                var age = getAge($(this).val());
                var proposarage = getAge($("#dob").val());
                if (age > 0) {
                    var selectedVal = $('.dropdown-list li').parents('.dropdown-list').siblings('.dropdown-label').text();
                    if (selectedVal == "son" || selectedVal == "daughter" || selectedVal == "grandson" || selectedVal == "granddaughter" || selectedVal == "wife" || selectedVal == "husband") {
                        if (age < 1 || age > 55) {
                            if (age < 1) {
                                $(this).parents('.input-group').next('.extra-info').children('.cm-value').hide();
                                $(this).parents('.input-group').next('.extra-info').children('.cm-error').show();
                                $(this).parents('.input-group').siblings('.rising-star').addClass('cm-hidden');
                                $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("Sorry, the minimum age for this policy is 1 year");
                            } else if (age > 55) {
                                $(this).parents('.input-group').next('.extra-info').children('.cm-value').hide();
                                $(this).parents('.input-group').next('.extra-info').children('.cm-error').show();
                                $(this).parents('.input-group').siblings('.rising-star').addClass('cm-hidden');
                                $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("Sorry the maximum age for this policy is 55 years");
                            }
                        }
                        else {
                            var totalage = proposarage + (18 - age);
                            console.log("I am totalagae blur:" + totalage);
                            if (age < 18 && proposarage <= 55 && totalage <= 70) {
                                $(this).parents('.input-group').next('.extra-info').find('.cm-error').hide();
                                if (age == 1) {
                                    $(this).parents('.input-group').next('.extra-info').find('.cm-value').show().children('span').text(age + " year");
                                }
                                else {
                                    $(this).parents('.input-group').next('.extra-info').find('.cm-value').show().children('span').text(age + " years");
                                }
                                $(this).parents('.input-group').find('.btn').css('visibility', 'visible');
                                $(this).parents('.input-group').siblings('.rising-star').removeClass('cm-hidden');
                                $(this).parents('.input-group').find('.btn').css('visibility', 'hidden');
                                $(".RisingStarRelation").html(selectedVal);
                                var lafname = $("#lafullname").val().split(" ")[0];
                                $(".RisingStarfName").html(lafname);
                                // $("#benefits").prop("checked", true);
                            }
                            else {
                                $(this).parents('.input-group').siblings('.rising-star').addClass('cm-hidden');
                                $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("");
                                $(this).parents('.input-group').next('.extra-info').find('.cm-error').hide();
                                $(this).parents('.input-group').next('.extra-info').find('.cm-value').show().children('span').text(age + " years");
                                $(this).parents('.input-group').find('.btn').css('visibility', 'visible');
                                $("#benefits").prop("checked", false);
                            }
                        }
                    }
                    else {
                        if (age < 18 || age > 55) {
                            $(this).parents('.input-group').next('.extra-info').children('.cm-value').hide();
                            $(this).parents('.input-group').next('.extra-info').children('.cm-error').show();
                            $(this).parents('.input-group').siblings('.rising-star').addClass('cm-hidden');
                            $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("age should be between 18 to 55");
                        }
                        else {
                            $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("");
                            $(this).parents('.input-group').next('.extra-info').find('.cm-error').hide();
                            $(this).parents('.input-group').siblings('.rising-star').addClass('cm-hidden');
                            $(this).parents('.input-group').next('.extra-info').find('.cm-value').show().children('span').text(age + " years");
                            $(this).parents('.input-group').find('.btn').css('visibility', 'visible');
                        }
                    }
                } else {
                    $(this).parents('.input-group').next('.extra-info').find('.cm-value').hide();
                    $(this).parents('.input-group').next('.extra-info').find('.cm-error').show();
                    $(this).parents('.input-group').siblings('.rising-star').addClass('cm-hidden');
                }
            }
            else {
                $(this).parents('.input-group').find('.btn').css('visibility', 'hidden');
                $(this).parents('.input-group').next('.extra-info').find('.cm-value').hide();
                $(this).parents('.input-group').next('.extra-info').find('.cm-error').show();
                $(this).parents('.input-group').siblings('.rising-star').addClass('cm-hidden');
            }
        }
        else {
            if ($(this).val().length > 0) {
                $(this).parents('.input-group').find('.btn').css('visibility', 'visible');
            }
        }



        if ($(this).hasClass('fullname')) {
            var nameValid = false;
            nameValid = ValidateFullName($(this).val());
            if (!nameValid) {
                $(this).parents('.input-group').next('.extra-info').children('.cm-value').hide();
                $(this).parents('.input-group').next('.extra-info').children('.cm-error').show();
                $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("Please enter your full name");
            } else {
                $("#lblname").html($(this).val().split(" ")[0] + "");
                $(this).parents('.input-group').next('.extra-info').children('.cm-value').show();
                $(this).parents('.input-group').next('.extra-info').children('.cm-error').hide();
            }
        }

        if ($(this).hasClass('lafullname')) {
            var nameValid = false;
            nameValid = ValidateFullName($(this).val());
            if (!nameValid) {
                $(this).parents('.input-group').next('.extra-info').children('.cm-value').hide();
                $(this).parents('.input-group').next('.extra-info').children('.cm-error').show();
                $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("Please enter " + $(".latitle").html() + " full name");
            } else {
                $(this).parents('.input-group').next('.extra-info').children('.cm-value').show();
                $(this).parents('.input-group').next('.extra-info').children('.cm-error').hide();
            }
        }

    });

    $('.form-control').on('keyup', function (event) {
        if (event.keyCode == 13) {
            $(this).trigger('blur');
            $(this).parents('.input-group').find('.btn').trigger('click');
        }
    })
}

function radioValueValidation() {
    $('input[type=radio]').on('change click', function () {
        if (!$(this).parent('.bs-radio').hasClass('bs-dropdown') || $(this).val() != "dropdown") {
            if ($(this).parents('.form-group').siblings().length) {
                $(this).parents('.form-group').next().removeClass('hidden').addClass('active');
                if ($(this).val() == "myself") {
                    $(this).parents('.bs-dropdown').children('.dropdown-btn').text();
                    $(this).parents('.bs-dropdown').children('.dropdown-label').text("Family");
                }
                else {

                }
            }
        } else {
            if ($(this).val() == "dropdown") {
                $(this).parents('.form-group').next().addClass('hidden').removeClass('active');
                $(this).siblings('.dropdown-list').fadeIn();

            }
        }
    })
}

function showDropDown() {
    $('.dropdown-btn').on("click", function (event) {
        event.stopPropagation();
        $('.dropdown-list').hide();
        $('.dropdown-list').siblings('.tooltip-cont').hide();
        $(this).next('.dropdown-list').show();
    });
    $('.dropdown-label').on('click', function (event) {
        event.stopImmediatePropagation();
        $(this).siblings('.dropdown-list').show();
    });
    $(document).mouseup(function (e) {
        var container = $(".dropdown-label");
        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            $('.dropdown-list').hide();
        }
    });

    $('body').click(function () {
        //$('.dropdown-list').hide();
        $('.dropdown-list').siblings('.tooltip-cont').fadeOut();
    });

    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            $('.dropdown-list').hide();
            $('.dropdown-list').siblings('.tooltip-cont').fadeOut();
        }
    });

}

function dropdownList() {
    var selectedVal;
    $('.dropdown-list li').on('click', function (event) {
        event.stopPropagation();
        selectedVal = $(this).text();
        console.log($(this));
        console.log(selectedVal);
		if($(this).parents('.dropdown-list').attr('id') == "relationlist"){
			$('#investing_for').val(selectedVal);
		}else{
			$('#frequency').val(selectedVal);
		}
		
        $(this).parents('.dropdown-list').prev('.dropdown-btn').text(selectedVal);
        $(this).parents('.dropdown-list').siblings('.dropdown-label').text(selectedVal);
        $('.dropdown-list').hide();
        $('.dropdown-list').siblings('.tooltip-cont').fadeOut();

        if ($(this).parents('.form-group').siblings().length) {
            $(this).parents('.form-group').next().removeClass('hidden').addClass('active');

            if (selectedVal == "husband" || selectedVal == "son" || selectedVal == "grandson") {
                $(".latitlecase").html("he");
                $(".latitle").html("his");
                $(".latitletop").html("him");
                $("#lafullname").attr("placeholder", "Tell us his Full Name");
				$('#LA_gender').val('male');
            }
            else {
                $(".latitlecase").html("she");
                $(".latitle").html("her");
                $(".latitletop").html("her");
                $("#lafullname").attr("placeholder", "Tell us her Full Name");
				$('#LA_gender').val('female');
            }
        }
    });
}

function ValidateInputs(formContainer) {
    //console.log(formContainer);
    var formStatus = false;
    var inputValue;
    var inputsvalid = 0;
    var emailValid = false;
    var mobileValid = false;
    var nameValid = false;
    // var inputsToValidate = formContainer.find(':input').length;
    formContainer.find('input').each(function (index, element) {
        inputValue = $(this).val();
        if (inputValue === undefined || inputValue === "") {
            $(this).parents('.input-group').next('.extra-info').children('.cm-value').hide();
            $(this).parents('.input-group').next('.extra-info').children('.cm-error').show();

            if ($(this).hasClass('amountnumber')) {
                $("#investmentamt").parents('.multi-group').find('.extra-info').children('.cm-error').show();
                $("#investmentamt").parents('.multi-group').find('.extra-info').children('.cm-error').html("Please enter your investment amount");
            }
            inputsvalid++;
            formStatus = false;
        }
        else if ($(this).hasClass('fullname')) {
            nameValid = ValidateFullName(this.value);
            if (!nameValid) {
                inputsvalid++;
                formStatus = false;
                $(this).parents('.input-group').next('.extra-info').children('.cm-value').hide();
                $(this).parents('.input-group').next('.extra-info').children('.cm-error').show();
            } else {
                $(".lblname").html($(this).val().split(" ")[0] + "");
                $(this).parents('.input-group').next('.extra-info').children('.cm-value').show();
                $(this).parents('.input-group').next('.extra-info').children('.cm-error').hide();
            }
        }
        else if ($(this).hasClass('lafullname')) {
            nameValid = ValidateFullName(this.value);
            if (!nameValid) {
                inputsvalid++;
                formStatus = false;
                $(this).parents('.input-group').next('.extra-info').children('.cm-value').hide();
                $(this).parents('.input-group').next('.extra-info').children('.cm-error').show();
            } else {
                $(this).parents('.input-group').next('.extra-info').children('.cm-value').hide();
                $(this).parents('.input-group').next('.extra-info').children('.cm-error').hide();
                $(this).parents('.form-group').next().removeClass('hidden').addClass('active');
                $(this).parents('.form-group').next().find('input').focus();

            }
        }
        else if ($(this).attr('type') == "email") {
            emailValid = ValidateEmail(this.value);
            if (!emailValid) {
                inputsvalid++;
                formStatus = false;
                $(this).parents('.input-group').next('.extra-info').children('.cm-note').hide();
                $(this).parents('.input-group').next('.extra-info').children('.cm-error').show();
            } else {
                $(this).parents('.input-group').next('.extra-info').children('.cm-note').show();
                $(this).parents('.input-group').next('.extra-info').children('.cm-error').hide();
            }
        }
        else if ($(this).hasClass('mnumber')) {
            mobileValid = validateMobile(this.value);
            if (!mobileValid) {
                inputsvalid++;
                formStatus = false;
                $(this).parents('.input-group').next('.extra-info').children('.cm-note').hide();
                $(this).parents('.input-group').next('.extra-info').children('.cm-error').show();
            } else {
                $(this).parents('.input-group').next('.extra-info').children('.cm-note').show();
                $(this).parents('.input-group').next('.extra-info').children('.cm-error').hide();
            }
        }
        else if ($(this).attr('id') === "dob") {
            if ($(this).val().length == 10) {
                var age = getAge($(this).val());
                if (isNaN(age) || age < 0) {
                    inputsvalid++;
                    formStatus = false;
                    $(this).parents('.input-group').next('.extra-info').find('.cm-value').hide();
                    $(this).parents('.input-group').next('.extra-info').find('.cm-error').show();
                    $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("Please enter Date of Birth (dd/mm/yyyy)");
                }
                else {
                    if (age < 18 || age > 100) {
                        inputsvalid++;
                        formStatus = false;
                        $(this).parents('.input-group').next('.extra-info').children('.cm-value').hide();
                        $(this).parents('.input-group').next('.extra-info').children('.cm-error').show();
                        $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("age should be between 18 to 100");
                    }
                    else {
                        $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("");
                        $(this).parents('.input-group').next('.extra-info').find('.cm-error').hide();
                        $(this).parents('.input-group').next('.extra-info').find('.cm-value').show().children('span').text(age);
                        $(this).parents('.input-group').find('.btn').css('visibility', 'visible');
                        if (age > 55) {
                            $("#myself").attr('checked', false);
                            $("#myself").attr('disabled', true);
                            $("#myself").addClass("cm-disabled");
                            $(this).parents('.input-group').next('.extra-info').children('.cm-value').hide();
                            $(this).parents('.input-group').next('.extra-info').children('.cm-error').show();
                            $("#relationlist").parents('.bs-radio').next('.extra-info').children('.cm-error').html("you can only invest for your family");
                            $("#relationlist").parents('.bs-radio').next('.extra-info').children('.cm-error').show();
                        } else {
                            $("#myself").attr('disabled', false);
                            $("#myself").removeClass("cm-disabled");
                            $("#relationlist").parents('.bs-radio').next('.extra-info').children('.cm-error').html("");
                            $("#relationlist").parents('.bs-radio').next('.extra-info').children('.cm-error').hide();
                            // console.log("I am up");
                        }
                    }
                }
            }
            else {
                inputsvalid++;
                formStatus = false;
                $(this).parents('.input-group').next('.extra-info').find('.cm-value').hide();
                $(this).parents('.input-group').next('.extra-info').find('.cm-error').show();
                $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("Please enter correct Date of Birth (dd/mm/yyyy)");
            }
        }
        else if ($(this).attr('id') === "ladob") {

            var age = getAge($(this).val());
            var proposarage = getAge($("#dob").val());

            if ($(this).val().length == 10) {
                if (isNaN(age) || age < 0) {
                    inputsvalid++;
                    formStatus = false;
                    $(this).parents('.input-group').next('.extra-info').find('.cm-value').hide();
                    $(this).parents('.input-group').next('.extra-info').find('.cm-error').show();
                    $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("Please enter correct Date of Birth (dd/mm/yyyy)");
                }
                else {
                    var selectedVal = $('.dropdown-list li').parents('.dropdown-list').siblings('.dropdown-label').text();
                    //  console.log(selectedVal);
                    if (selectedVal == "son" || selectedVal == "daughter" || selectedVal == "grandson" || selectedVal == "granddaughter" || selectedVal == "wife" || selectedVal == "husband") {
                        if (age < 1 || age > 55) {
                            inputsvalid++;
                            formStatus = false;
                            if (age < 1) {
                                $(this).parents('.input-group').next('.extra-info').children('.cm-value').hide();
                                $(this).parents('.input-group').next('.extra-info').children('.cm-error').show();
                                $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("Sorry, the minimum age for this policy is 1 year");
                            } else if (age > 55) {
                                $(this).parents('.input-group').next('.extra-info').children('.cm-value').hide();
                                $(this).parents('.input-group').next('.extra-info').children('.cm-error').show();
                                $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("Sorry the maximum age for this policy is 55 years");
                            }
                        }
                        else {
                            var totalage = proposarage + (18 - age);
                            console.log("I am totalagae:" + totalage);
                            if (age < 18 && proposarage <= 55 && totalage <= 70) {
                                $(this).parents('.input-group').next('.extra-info').find('.cm-error').hide();
                                $(this).parents('.input-group').next('.extra-info').find('.cm-value').show().children('span').text(age);
                                $(this).parents('.input-group').find('.btn').css('visibility', 'visible');
                                $(this).parents('.input-group').siblings('.rising-star').removeClass('cm-hidden');
                                $(this).parents('.input-group').find('.btn').css('visibility', 'hidden');
                                $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("");
                                $(".RisingStarRelation").html(selectedVal);
                                var lafname = $("#lafullname").val().split(" ")[0];
                                $(".RisingStarfName").html(lafname);
                                // $("#benefits").prop("checked", true);
                            }
                            else {
                                $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("");
                                $(this).parents('.input-group').next('.extra-info').find('.cm-error').hide();
                                $(this).parents('.input-group').next('.extra-info').find('.cm-value').show().children('span').text(age);
                                $(this).parents('.input-group').siblings('.rising-star').addClass('cm-hidden');
                                $(this).parents('.input-group').find('.btn').css('visibility', 'visible');
                                $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("");
                                // console.log("setting false");
                                $("#benefits").prop("checked", false);
                            }
                        }
                    }
                    else {
                        if (age < 18 || age > 55) {
                            inputsvalid++;
                            formStatus = false;
                            $(this).parents('.input-group').next('.extra-info').children('.cm-value').hide();
                            $(this).parents('.input-group').next('.extra-info').children('.cm-error').show();
                            $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("age should be between 18 to 55");
                        }
                        else {
                            $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("");
                            $(this).parents('.input-group').next('.extra-info').find('.cm-error').hide();
                            $(this).parents('.input-group').next('.extra-info').find('.cm-value').show().children('span').text(age);
                            $(this).parents('.input-group').find('.btn').css('visibility', 'visible');
                        }
                    }
                }
            }
            else {
                inputsvalid++;
                formStatus = false;
                $(this).parents('.input-group').next('.extra-info').find('.cm-value').hide();
                $(this).parents('.input-group').next('.extra-info').find('.cm-error').show();
                $(this).parents('.input-group').next('.extra-info').children('.cm-error').html("Please enter correct Date of Birth (dd/mm/yyyy)");
            }
        }
        else if ($(this).hasClass('amountnumber')) {
            if ($(this).val() != "") {
                $(this).val(($(this).val().replace(/,/g, '')));
                $(this).val(parseInt($(this).val()).toString().replace(/\B(?=(\d{1})(\d{2})+(?!\d))/g, ","));


                var minamount = 48000;
                var investmentamount = $(this).val().replace(/,/g, '');
                var firstscreenfreq = $("#freq").text();
                if (firstscreenfreq == "yearly") {
                    minamount = 36000;
                } else if (firstscreenfreq == "half-yearly") {
                    minamount = 18000;
                } else if (firstscreenfreq == "quarterly") {
                    minamount = 9000;
                } else if (firstscreenfreq == "monthly") {
                    minamount = 3000;
                }

                if (investmentamount < minamount) {
                    $("#investmentamt").parents('.multi-group').find('.extra-info').children('.cm-error').show();
                    $("#investmentamt").parents('.multi-group').find('.extra-info').children('.cm-error').html("<br><br><br>minimum " + firstscreenfreq + " investment amount should be INR " + minamount + "");
                    inputsvalid++;
                    formStatus = false;
                }
                else {
                    $("#investmentamt").parents('.multi-group').find('.extra-info').children('.cm-error').hide();
                    $("#investmentamt").parents('.multi-group').find('.extra-info').children('.cm-error').html("");

                    if ($("input[name=investingfor]:checked").val() != "myself") {
                        var selectedVal = $('.dropdown-list li').parents('.dropdown-list').siblings('.dropdown-label').text();
                        $(".RisingStarRelation").html(selectedVal);
                    }
                }
            }
            else {
                inputsvalid++;
                formStatus = false;
                $("#investmentamt").parents('.multi-group').find('.extra-info').children('.cm-error').show();
                $("#investmentamt").parents('.multi-group').find('.extra-info').children('.cm-error').html("<br><br><br>Please enter your investment amount");
            }
        }
    });

    // if (formContainer.find('.dropdown-list').length) {
    //     formContainer.find('.dropdown-list').each(function (i, e) {
    //         inputValue = $(this).prev('.dropdown-btn').text();
    //         if (inputValue === undefined || inputValue === "") {
    //             $(this).parents('.input-group').next('.extra-info').children('.cm-value').hide();
    //             $(this).parents('.input-group').next('.extra-info').children('.cm-error').show();
    //             inputsvalid++;
    //             formStatus = false;
    //         } else {
    //             $(this).parents('.input-group').next('.extra-info').children('.cm-error').hide();
    //         }
    //     });
    // }


    if (inputsvalid > 0) {
        formStatus = false
    } else {
        formStatus = true;
    }
    return formStatus;
}

function slideTo(currSlide, nxtSlide) {
    $('.back-btn').show();
    var totalSec = $('.lyt-form section').length;
    if (nxtSlide === totalSec) {
        $('.cm-bg').addClass('blur');
    }
    $('.lyt-form').find('section').eq(currSlide - 1).children('.bs-sec').removeClass('active').addClass('prev');
    $('.lyt-form').find('section').eq(nxtSlide - 1).children('.bs-sec').removeClass('next').addClass('active');
    // $('.lyt-form').find('.bs-sec.active').find('.form-control:first-child').focus();
    // added on 14-06-2018 - change
    setTimeout(function () {
        $(".lyt-form")
            .find("section")
            .eq(nxtSlide - 1)
            .children(".bs-sec")
            .find("input:first")
            .trigger("focus");
    }, 600);
}

function changeSection(currLyt) {

    currLyt.removeClass('active').addClass('prev');
    currLyt.next('.cm-lyt').removeClass('next').addClass('active');
    if (!currLyt.next('.cm-lyt').hasClass('lyt-form')) {
        $('.cm-bg').hide();
        $('body').addClass('pg-result');
    }
    if (currLyt.next('.cm-lyt').hasClass('lyt-result')) {
        $('.svg-result').addClass('active');
    }
    if (currLyt.next('.cm-lyt').hasClass('lyt-summary')) {
        //  console.log("Start for Second Screen");
        dataArrayVal = $("#recommendfundAlloc").val().split('~');
        labelsArrayVal = $("#recommendfund").val().split('~');
        valuesArrayVal = $("#recommendfundvalue").val().split('~');
        recommendSeries = $("#recommendseries").val();
        if (recommendSeries == "0") {
            showReturnData("1 Year");
            $("#cagrcalc").val("0");
        } else if (recommendSeries == "1") {
            showReturnData("3 Year");
            $("#cagrcalc").val("1");
        } else if (recommendSeries == "2") {
            showReturnData("5 Year");
            $("#cagrcalc").val("2");
        } else if (recommendSeries == "3") {
            showReturnData("Since Inception");
            $("#cagrcalc").val("3");
        } else if (recommendSeries == "4") {
            showReturnData("7 Year");
            $("#cagrcalc").val("4");
        }
        currLyt.next('.cm-lyt').children('section').eq(0).children('.bs-sec').removeClass('next prev').addClass('active');
        $('.lyt-content').css('height', winH - $('.mod-progress').height());
        $("input[name=allocation][value='recomended']").prop("checked", true);
        $('.chart-title').html("<span class=\"cm-line-break\">Find recommendations that'll best suit your needs.</span><span class=\"cm-line-break\">You can also customize them as per your convenience.</span>");
        $('.bs-header').hide();

        drawChart(dataArrayVal, valuesArrayVal, labelsArrayVal);
        swapFunds(populateFundData());


        totalamount = 0;
        for (k = 0; k < valuesArrayVal.length; k++) {
            totalamount += valuesArrayVal[k] << 0;
        }
        $(".table-foot").children(".cm-txt-center").children(".mobile-top").children(".amnt").text(inrDisplay(totalamount.toString()));
    }
}


function backBtnLinking() {
    $(document).on('click', '.back-btn', function (e) {

        e.preventDefault();
        $(this).siblings('section').each(function (index, el) {

            if ($(this).children('.bs-sec').hasClass('active') && index != 0) {
                $(this).children('.bs-sec').removeClass('active').addClass('next');
                if (index == 4) {
                    if ($("input[name=investingfor]:checked").val() == "myself") {
                        $(this).prev().prev().children('.bs-sec').removeClass('prev').addClass('active');
                    }
                    else {
                        $(this).prev().children('.bs-sec').removeClass('prev').addClass('active');
                    }
                }
                else {
                    $(this).prev().children('.bs-sec').removeClass('prev').addClass('active');
                }
            }
            if ($(this).children('.bs-sec').hasClass('typ-counter')) {
                $('.cm-bg').removeClass('blur');
            }
        });
        if ($('.lyt-form section').eq(0).children('.bs-sec').hasClass('active')) {
            $('.back-btn').hide();
        }
        progressBarReverse();
    })
}

function getAge(dateString) {
    if (dateString == "" || dateString == undefined || dateString == null) {
        age = 0;
    } else {
        dateString = dateString.split("-");
        var dd = Number(dateString[0]);
        var mm = Number(dateString[1]);
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

function inrFormat() {
    $(".amountnumber").on("keyup", function (c) {
        if (c.which >= 37 && c.which <= 40) {
            return
        }
        var numberInWords = convertNumberToWords(removeCommas(this.value));
        x = removeCommas(this.value).toString();
        var lastThree = x.substring(x.length - 3);
        var otherNumbers = x.substring(0, x.length - 3);
        if (otherNumbers != '')
            lastThree = ',' + lastThree;
        var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        $(this).val(res);
        $(this).siblings('.extra-info').children('.cm-value').show().text(numberInWords);
    });
}

function inrDisplay(amount) {
    var lastThree = amount.substring(amount.length - 3);
    var otherNumbers = amount.substring(0, amount.length - 3);
    if (otherNumbers != '')
        lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return res;

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

function incrDicr() {
    var newVal = 0;
    var stepValue, oldValue, minVal, maxVal;
    $(".js-button").on("click", function () {
        var $button = $(this);
        stepValue = Number($button.parent().find("input").data('step'));
        minVal = Number($button.parent().find("input").attr('min'));
        maxVal = Number($button.parent().find("input").attr('max'));
        var oldValue = $button.parent().find("input").val();
        if (oldValue <= 9 || oldValue > 90)
            stepValue = 1;

        if (oldValue == 100 || oldValue == 0)
            stepValue = 10;

        if ($button.hasClass('plus') && (!$button.hasClass('disable'))) {
            newVal = parseInt(oldValue) + stepValue;
            if (newVal >= maxVal) {
                $button.addClass('disable');
                $(this).parent(".mod-incr-decr").children("button.minus").removeClass('disable');
            } else {
                $button.removeClass('disable');
                $(this).parent(".mod-incr-decr").children("button.minus").removeClass('disable');
            }
            if (newVal <= maxVal && newVal >= minVal) {
                $button.parent().find("input").val(newVal);
                totalAllocation();
            }
        } else if ($button.hasClass('minus') && (!$button.hasClass('disable'))) {
            if (oldValue > 0) {
                newVal = parseInt(oldValue) - stepValue;
            }
            if (newVal <= minVal) {
                $button.addClass('disable');
                $(this).parent(".mod-incr-decr").children("button.plus").removeClass('disable');
            } else {
                $button.removeClass('disable');
                $(this).parent(".mod-incr-decr").children("button.plus").removeClass('disable');
            }
            if (newVal <= maxVal && newVal >= minVal) {
                $button.parent().find("input").val(newVal);
                totalAllocation();
            }
        }
    });
    $(".mod-incr-decr input").on('focus', function () {
        oldValue = Number($(this).val());
    });
    $(".mod-incr-decr input").on('blur', function () {
        //   totalAllocation();
    });
    $(".mod-incr-decr input").on('change', function (event) {
        // console.log("on change fire");
        event.preventDefault();
        stepValue = Number($(this).data('step'));
        minVal = Number($(this).attr('min'));
        maxVal = Number($(this).attr('max'));
        newVal = Number($(this).val());
        if (newVal > maxVal || newVal < minVal) {
            $(this).val(oldValue)
        }
        totalAllocation();
    });
}

function totalAllocation() {
    FA_equitylargecap = parseInt($("#fundELCFD").val());
    FA_equitytop250 = parseInt($("#fundETTFD").val());
    FA_bondfund = parseInt($("#fundBNDFD").val());
    FA_managedfund = parseInt($("#fundMGFND").val());
    FA_equitymidcap = parseInt($("#fundEMCFD").val());

    totalAlloc = FA_equitylargecap + FA_equitytop250 + FA_bondfund + FA_managedfund + FA_equitymidcap;
    $(".table-foot").find(".totalallocation").val(totalAlloc);
    $(".mb-table-foot").find(".totalallocation").val(totalAlloc);

    valuesArrayVal = $("#recommendfundvalue").val().split('~');
    totalamount = 0;
    for (k = 0; k < valuesArrayVal.length; k++) {
        totalamount += valuesArrayVal[k] << 0;
    }

    $("#fundELCFDAmt").text(inrDisplay(parseInt((totalamount * FA_equitylargecap) / 100).toString()));
    $("#fundETTFDAmt").text(inrDisplay(parseInt((totalamount * FA_equitytop250) / 100).toString()));
    $("#fundBNDFDAmt").text(inrDisplay(parseInt((totalamount * FA_bondfund) / 100).toString()));
    $("#fundMGFNDAmt").text(inrDisplay(parseInt((totalamount * FA_managedfund) / 100).toString()));
    $("#fundEMCFDAmt").text(inrDisplay(parseInt((totalamount * FA_equitymidcap) / 100).toString()));


    if (totalAlloc == 100) {
        calculateWPPremium(2);
        FAequitylargecap = parseInt($("#fundELCFD").val());
        FAequitytop250 = parseInt($("#fundETTFD").val());
        FAbondfund = parseInt($("#fundBNDFD").val());
        FAmanagedfund = parseInt($("#fundMGFND").val());
        FAequitymidcap = parseInt($("#fundEMCFD").val());
        fundELCFDAmt = $("#fundELCFDAmt").text();
        fundETTFDAmt = $("#fundETTFDAmt").text();
        fundBNDFDAmt = $("#fundBNDFDAmt").text();
        fundEMCFDAmt = $("#fundEMCFDAmt").text();
        fundMGFNDAmt = $("#fundMGFNDAmt").text();
        $("#piechartarea").show();
        $("#continuebutton").removeClass("disable");
        $("#piecharterror").hide();
        piechart.data.datasets[0].data = [FAequitylargecap, FAequitytop250, FAbondfund, FAmanagedfund, FAequitymidcap];
        piechart.data.labels = ['Equity Large Cap', 'Equity Top 250', 'Bond Fund', 'Managed Fund', 'Equity Mid Cap'];
        piechart.data.datasets[0].values = [fundELCFDAmt, fundETTFDAmt, fundBNDFDAmt, fundMGFNDAmt, fundEMCFDAmt];
        piechart.update();
        $('.pie-chart-legends').html(piechart.generateLegend());
        return true;
    } else {
        $("#continuebutton").addClass("disable");
        $("#piecharterror").fadeIn();
        $("#piechartarea").fadeOut();
        return false;
    }
}

function tabFalse() {
    $(document).keydown(function (event) {
        if (!$('.cm-bg ').hasClass('blur')) {
            if (event.keyCode === 9) {
                return false;
            }
        }
    });
}

function progressBar() {
    progresswidth = progresswidth + (120 / totalSections);
    $('.mod-progress .progress-bar').width(progresswidth + "%");
}

function progressBarReverse() {
    progresswidth = progresswidth - (120 / totalSections);
    $('.mod-progress .progress-bar').width(progresswidth + "%");
}

function tooltip() {
    $('.js-tooltip').on('click', function () {
        if ($(this).siblings('.tooltip-cont').hasClass('typ-right')) {
            $(this).siblings('.tooltip-cont').fadeIn().addClass('cm-fadeInLeft');
        } else {
            $(this).siblings('.tooltip-cont').fadeIn().addClass('cm-fadeInDown');
        }
    });
    $('input.js-tooltip').on('blur', function () {
        $(this).siblings('.tooltip-cont').fadeOut().removeClass('cm-fadeInDown cm-fadeInLeft');
    })
}

function setPTAndPPT() {
    $("#drppt").mCustomScrollbar('destroy');
    $("#drpt").mCustomScrollbar('destroy');
    var LAPHSame = "no";
    var PHage = getAge($("#dob").val());
    var investamt = parseInt($("#investmentamt").val().replace(/,/g, ''));
    var ptterm = 70 - PHage;
    var x = 5;
    var y = 10;
    var multiplier = 1;
    var frequency = $("#summaryfreq").text();
    if (frequency == "month")
        multiplier = 12;
    else if (frequency == "quarter")
        multiplier = 4;
    else if (frequency == "6 month")
        multiplier = 2;
    else if (frequency == "year")
        multiplier = 1;

    var annualpremium = investamt * multiplier;

    console.log(frequency + "=" + annualpremium);
    paymentTerm = parseInt($("#ppterm").text());

    if (annualpremium >= 36000 && annualpremium <= 47999) {
        x = 5;
        y = 15;
    } else if (annualpremium <= 59999 && frequency != "year" && paymentTerm <= 10) {
        x = 5;
        y = 15;
    }
    else if (annualpremium >= 48000 && frequency == "year") {
        x = 5;
        y = 10;
    } else if (annualpremium >= 48000 && annualpremium <= 59999 && frequency != "year" && paymentTerm > 10) {
        x = 5;
        y = 11;
    } else if (annualpremium >= 60000) {
        x = 5;
        y = 10;
    }



    if ($("input[name=investingfor]:checked").val() == "myself") {
        LAPHSame = "yes"
    }

    if (LAPHSame == "yes") {
        if (ptterm >= 20)
            ptterm = 20;
        $('#drpt > li').remove();
        for (i = y; i <= ptterm; i++) {
            $("#drpt").append('<li class="list-item">' + i + ' th</li>');
            selectedptterm = i;
        }
        $('#drppt > li').remove();
        for (i = x; i <= ptterm; i++) {
            $("#drppt").append('<li class="list-item">' + i + '</li>');
            selectedppt = i;
        }
    } else {
        var LAage = getAge($("#ladob").val());
        y1 = 18 - LAage; //17
        ptendterm = 20;


        if (PHage <= 55 && PHage >= 18 && $("#benefits").prop("checked") && LAage < 18) {
            console.log("inside block");
            ptendterm = 70 - PHage;
            if (ptendterm >= 20) {
                ptendterm = 20;
            }
        } else if (LAage > 18) {
            ptendterm = 70 - LAage;
            if (ptendterm >= 20)
                ptendterm = 20;
        } else {
            ptendterm = 20;
        }

        if (y1 > y)
            y = y1;


        $('#drpt > li').remove();
        for (i = y; i <= ptendterm; i++) {
            $("#drpt").append('<li class="list-item">' + i + ' th</li>');
            selectedptterm = i;
        }
        $('#drppt > li').remove();
        for (i = x; i <= ptendterm; i++) {
            $("#drppt").append('<li class="list-item">' + i + '</li>');
            selectedppt = i;
        }
    }

    $("#ppterm").html(selectedppt);
    $("#policyterm").html(selectedptterm + "th");
    $("#drppt").mCustomScrollbar();
    $("#drpt").mCustomScrollbar();
    dropdownList();
    bindPPTEvent();
}

function setFrequency(freq, investamt, selectedptterm) {
    if (freq == "yearly" || freq == "year") {
        totinvestamt = investamt * 1 * selectedptterm;
        $("#policyMode").val("1");
        $("#policyModeFrequecy").val("12");
        $("#summaryfreq").html("year");
        $("#investmentamt").attr("placeholder", "48,000 min.");
    } else if (freq == "half-yearly" || freq == "6 month") {
        totinvestamt = investamt * 2 * selectedptterm;
        $("#policyMode").val("2");
        $("#policyModeFrequecy").val("6");
        $("#summaryfreq").html("6 month");
        $("#investmentamt").attr("placeholder", "24,000 min.");
    } else if (freq == "quarterly" || freq == "quarter") {
        totinvestamt = investamt * 4 * selectedptterm;
        $("#policyMode").val("4");
        $("#policyModeFrequecy").val("3");
        $("#summaryfreq").html("quarter");
        $("#investmentamt").attr("placeholder", "12,000 min.");
    } else if (freq == "monthly" || freq == "month") {
        totinvestamt = investamt * 12 * selectedptterm;
        $("#policyMode").val("12");
        $("#policyModeFrequecy").val("1");
        $("#summaryfreq").html("month");
        $("#investmentamt").attr("placeholder", "Eg. 10,000");
    }
    console.log("I am running:" + totinvestamt);
    // $("#totinvestamt").html(parseInt(totinvestamt).toString().replace(/\B(?=(\d{1})(\d{2})+(?!\d))/g, ","));
    // $("#totinvestamt").html(Number(totinvestamt).toLocaleString('en-IN'));
    console.log(Number(totinvestamt).toLocaleString('en-IN'));
    $("#totinvestamt").text(Number(totinvestamt).toLocaleString('en-IN'));

    $('.counterinvestment').counterUp({
        delay: 10,
        time: 1000
    });
    return true;
}

function checkMinInvestment() {
    amount = parseInt($("#summaryinvestmentamt").val().replace(/,/g, ''));
    minamount = 0;
    freq = $("#summaryfreq").text();
    if (freq == "month" && amount < 3000) {
        minamount = 3000;
    } else if (freq == "quarter" && amount < 9000) {
        minamount = 9000;
    } else if (freq == "6 month" && amount < 18000) {
        minamount = 18000;
    } else if (freq == "year" && amount < 36000) {
        minamount = 36000;
    } else {
        minamount = 0;
    }
    if (minamount > 0) {
        clearTimeout(myTimer);
        $('#minamountrequired').text("Minimum investment amount for " + freq + "ly mode is Rs. " + inrDisplay(minamount.toString()) + "");
        $('input.js-tooltipcondition').siblings('.tooltip-cont').fadeIn().addClass('cm-fadeInDown');
        $("#summaryinvestmentamt").val(inrDisplay(minamount.toString()));
        $("#summaryinvestmentamt").focus();
        minamount = 0;
        myTimer = setTimeout(function () {
            $('input.js-tooltipcondition').siblings('.tooltip-cont').fadeOut().removeClass('cm-fadeInDown');
        }, 5000);
        return false;
    } else {
        return true;
    }
}

function bindPPTEvent() {
    //  console.log("Rebinding");
    $('#drppt li').on('click', function (event) {
        var selecteditem = parseInt($(this).text().replace("th", ""));
        pptstart = parseInt($("#pptstart").val());
        pptend = parseInt($("#pptend").val());
        if (pptstart == 0 && pptend == 0) {
            $("#pptstart").val(parseInt($("#drpt li").first().text().replace("th", "")));
            $("#pptend").val(parseInt($("#drpt li").last().text().replace("th", "")));
            pptstart = parseInt($("#drpt li").first().text().replace("th", ""));
            pptend = parseInt($("#drpt li").last().text().replace("th", ""));
        }
        policyTerm = parseInt($("#policyterm").text().replace("th", ""));
        paymentTerm = parseInt($("#ppterm").text());
        startpoint = 0;

        if (paymentTerm > pptstart) {
            startpoint = paymentTerm;
        } else {


            var investamt = parseInt($("#investmentamt").val().replace(/,/g, ''));
            var frequency = $("#summaryfreq").text();
            if (frequency == "month")
                multiplier = 12;
            else if (frequency == "quarter")
                multiplier = 4;
            else if (frequency == "6 month")
                multiplier = 2;
            else if (frequency == "year")
                multiplier = 1;

            var annualpremium = investamt * multiplier;
            if (annualpremium >= 36000 && annualpremium <= 47999) {
                y = 15;
            } else if (annualpremium <= 59999 && frequency != "year" && paymentTerm <= 10) {
                y = 15;
            }
            else if (annualpremium >= 48000 && frequency == "year") {
                y = 10;
            } else if (annualpremium >= 48000 && annualpremium <= 59999 && frequency != "year") {
                y = 11;
            } else if (annualpremium >= 60000) {
                y = 10;
            }

            if ($("input[name=investingfor]:checked").val() != "myself") {
                var LAage = getAge($("#ladob").val());
                y1 = 18 - LAage;

                if (y1 > y)
                    y = y1;
            }


            startpoint = y;
            if (paymentTerm > y)
                selecteditem = paymentTerm;
            else
                selecteditem = y;
        }
        $("#drpt").mCustomScrollbar('destroy');

        $('#drpt > li').remove();
        for (i = startpoint; i <= pptend ; i++) {
            $("#drpt").append('<li class="list-item">' + i + 'th</li>');
        }
        $("#drpt").mCustomScrollbar();
        $("#policyterm").text(selecteditem + "th");
        bindPPTEvent();
        clearTimeout(myTimerPPT);
        myTimerPPT = setTimeout(function () { processData(); }, 500);

    });

    $('#drpt li').on('click', function (event) {
        policyTerm = parseInt($(this).text().replace("th", ""));
        $("#policyterm").text(policyTerm + "th");
        paymentTerm = parseInt($("#ppterm").text());
        if (policyTerm < paymentTerm) {
            clearTimeout(myTimerPPT);
            $('label.js-tooltipcondition').siblings('.tooltip-cont').fadeIn().addClass('cm-fadeInDown');
            myTimerPPT = setTimeout(function () {
                $('label.js-tooltipcondition').siblings('.tooltip-cont').fadeOut().removeClass('cm-fadeInDown');
                if (paymentTerm > policyTerm && paymentTerm < 20) {
                    $("#policyterm").text(paymentTerm + 1 + "th");
                } else if (paymentTerm == 20) {
                    $("#policyterm").text("20th");
                }
                processData();
            }, 2000);
        } else {
            processData();
        }
    });
}

function investmentAmout() {
    // $("#investmentamt").val(($("#investmentamt").val().replace(/,/g, '')));
    //  $("#investmentamt").val(parseInt($("#investmentamt").val()).toString().replace(/\B(?=(\d{1})(\d{2})+(?!\d))/g, ","));
    var minamount = 48000;
    var investmentamount = $("#investmentamt").val().replace(/,/g, '');
    var firstscreenfreq = $("#freq").text();
    if (firstscreenfreq == "yearly") {
        minamount = 36000;
        $("#investmentamt").attr("placeholder", "36,000 min.");
    } else if (firstscreenfreq == "half-yearly") {
        minamount = 18000;
        $("#investmentamt").attr("placeholder", "18,000 min.");
    } else if (firstscreenfreq == "quarterly") {
        minamount = 9000;
        $("#investmentamt").attr("placeholder", "9,000 min.");
    } else if (firstscreenfreq == "monthly") {
        minamount = 3000;
        $("#investmentamt").attr("placeholder", "3,000 min.");
    }

    if (investmentamount < minamount) {
        $("#investmentamt").parents('.multi-group').find('.extra-info').children('.cm-error').show();
        $("#investmentamt").parents('.multi-group').find('.extra-info').children('.cm-error').html("<br><br><br>minimum " + firstscreenfreq + " investment amount should be INR " + minamount + "");
    }
    else {
        $("#investmentamt").parents('.multi-group').find('.extra-info').children('.cm-error').hide();
        $("#investmentamt").parents('.multi-group').find('.extra-info').children('.cm-error').html("");
    }
}

function setFinalPeriodAmount() {
    var investamt = parseInt($("#summaryinvestmentamt").val().replace(/,/g, ''));
    $("#investmentamt").val(investamt);
    $("#fianlinvestmentamt").html(parseInt(investamt).toString().replace(/\B(?=(\d{1})(\d{2})+(?!\d))/g, ","));
    freq = $("#freq").text();
    $("#showinvestmentamt").children(".data-value").children(".amnt").html(parseInt(investamt).toString().replace(/\B(?=(\d{1})(\d{2})+(?!\d))/g, ","));
    $("#showinvestmentamt").children(".data-value").children(".time").html(freq);
}

function btnSubmit() {
    radioValueValidation();
    $('.js-submit').on('click', function (e) {
        e.preventDefault();
        if ($(this).parents('.form-group').siblings().length && $(this).parents('.form-group').siblings().hasClass('hidden')) {
            var validSection = ValidateInputs($(this).parents('.bs-form'));
            if (validSection) {
                $(this).parents('.form-group').next().removeClass('hidden').addClass('active');
                $(this).parents('.form-group').next().find('input').focus();
                //$(this).css('visibility', 'hidden');
                $(this).parents('.form-group').next().find('input').focus();
            }
        } else {
            var currSlide = $(this).parents('section').index();
            var nxtSlide = $(this).parents('section').next().index();
            var validSection = ValidateInputs($(this).parents('.bs-form'));
            if (validSection) {
                if ($(this).hasClass('show-result')) {
                    if (!$(this).hasClass('onlynext') && currSlide == 5) {
                        //alert("DO THE POST IMPLEMENTATION");
						premium_initiate();
						$('#main_body').css('overflow-x' , 'hidden');
                    }

                    progressBar();
                } else {

                    var investingfor = $('input[name=investingfor]:checked').val();
                    if (investingfor === undefined || investingfor === "") {
                        slideTo(currSlide, nxtSlide);
                    }
                    else {
                        if (investingfor == "myself") {
                            currSlide = parseInt(currSlide);
                            nxtSlide = parseInt(nxtSlide) + 1;
                            slideTo(currSlide, nxtSlide);
                        }
                        else if (investingfor == "dropdown") {
                            console.log("hide rising");
                            $(".js-submit").parents('.input-group').siblings('.rising-star').addClass('cm-hidden');
                            slideTo(currSlide, nxtSlide);
                        }
                        else {
                            slideTo(currSlide, nxtSlide);
                        }
                    }
                    progressBar();
                }
            }
        }
    })
}

var Request_Unique_Id,Service_Unique_Id;
function premium_initiate(){
	
	var name = ($('#fullname').val()).split(' ');
    var  middlename ="";
    for (var i = 2; i < name.length; i++){
            middlename = middlename + name[i - 1];
    }
    var firstname = $('#fullname').val().split(' ')[0];
        var lastname=name.length == 1 ? "" : name[name.length - 1];
	
	var insured_fullname,insured_birth_date,insured_age,insured_gender;
	
	if($('#investing_for').val()== "myself"){
		insured_fullname = $('#fullname').val();
		insured_birth_date = $('#dob').val();
		insured_age = getAge($('#dob').val());
		insured_gender = $('#gender').val();
	}else{
		insured_fullname =  $('#lafullname').val();
		insured_birth_date = $('#ladob').val();
		insured_age = getAge($('#ladob').val());
		insured_gender = $('#LA_gender').val();
	}
	
	var objdata= {
	"gender": $('#gender').val(),
	"customer_name": $('#fullname').val(),
	"first_name" : firstname,
	"middle_name" : middlename,
	"last_name" : lastname,
	"birth_date": $('#dob').val(),
	"age" : getAge($('#dob').val()),
	"investment_amount": parseInt($('#investmentamt').val().replace(/\,/g,'')),
	"investing_for": $('#investing_for').val(),
	"frequency": $('#frequency').val(),
	"mobile": $('#phone').val(),
	"email": $('#email').val(),
	"insured_fullname": insured_fullname,
	"insured_birth_date": insured_birth_date,
	"insured_age" : insured_age,
	"insured_gender" : insured_gender,
	"method_type" : "Premium",
	"execution_async" : "yes",
    "crn" : "0",
    "ss_id" : ss_id,
    "agent_source" : "0",
    "app_version": "PolicyBoss.com",
    "secret_key" : "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
    "client_key" : "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
    "fba_id" : fba_id,
    "product_id" : 5,
    "city_id": "677",
	"policy_tenure" : 20
}
var obj_horizon_data = Horizon_Method_Convert("/quote/premium_initiate", objdata, "POST");
 $.ajax({
                type: "POST",
                data : siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) :  JSON.stringify(objdata),
				url :  siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/premium_initiate" ,
                dataType: "json",
                cache: false,
                contentType: 'application/json',
                success: function (Result) {
					console.log(Result);
					if(Result !== null){
						
						var summary = Result['Summary'];
						Request_Unique_Id = summary.Request_Unique_Id;
						GetResponse(Request_Unique_Id);
					}
                },
                error: function (xhr, status, error) {
                    // console.log('error-' + error);
                },
            });
	
}
function GotoProposal(){
	window.location.href="../WealthPlus/wealthplus-proposal.html?ARN="+Service_Unique_Id+"&ss_id="+ss_id;
}

function GetResponse(SRN){
	var srn  = SRN.split('_')[0];
	var udid = parseInt(SRN.split('_')[1]);
	var objdata = 
		{
	"search_reference_number": srn,
	"secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
	"client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
	"response_version":"2.0",
	"udid" : udid
}
$('.MyLoader').show();

	var obj_horizon_data = Horizon_Method_Convert("/quote/premium_list_db", objdata, "POST");
 $.ajax({
                type: "POST",
                data : siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) :  JSON.stringify(objdata),
				url :  siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/quote/premium_list_db" ,
                dataType: "json",
                cache: false,
                contentType: 'application/json',
                success: function (Result) {
					$('.StatusPopup').show();
					console.log(Result);
					
					ss_id =  Result['Summary']['Request_Core']['ss_id'];
					var response_1 = Result['Response_1'];
					for(var i in response_1){
						Service_Unique_Id = response_1[i]['Service_Log_Unique_Id'];
						$('#premium').text(response_1[i]['final_premium'])
						$('#maturity4').text(response_1[i]['maturity4'])
						$('#maturity8').text(response_1[i]['maturity8'])
					}
					$('.MyLoader').hide();
                },
                error: function (xhr, status, error) {
                    // console.log('error-' + error);
                },
            });
}

 function GetUrl() {
        var url = window.location.href;
        var newurl;
        if (url.includes("Horizon_v1")) {
            newurl = "http://localhost:3000";
        } else if (url.includes("qa")) {
            newurl = "http://qa-horizon.policyboss.com:3000";
        } else if (url.includes("www") || url.includes("cloudfront")) {
            newurl = "http://horizon.policyboss.com:5000";
        }
        return newurl;
    }
	function Horizon_Method_Convert(method_action, data, type) {
    var obj_horizon_method = {
        'url': (type == "POST") ? "/TwoWheelerInsurance/call_horizon_post" : "/TwoWheelerInsurance/call_horizon_get?method_name=" + method_action,
        "data": {
            request_json: JSON.stringify(data),
            method_name: method_action,
            client_id: "2"
        }
    };
    return obj_horizon_method;
}

/* Document Ready */
$(function () {
	siteURL =  window.location.href;
    history.pushState({ page: 1 }, "wealth-plus-online", "#no-back");
    window.onhashchange = function (event) {
        window.location.hash = "no-back";
    };

    $('input, :input').attr('autocomplete', 'off');


    $("a").each(function () {
        if ($(this).attr("href") == "#" || $(this).attr("href") == " ") {
            $(this).attr("href", "javascript:void(0)");
        }
    });
    numericInput();
    hideMaskedPlaceholder();
    progressBar();
    getWindowDimensions();
    calculateHeight();
    hideSections();
    showInputBtn();
    dropdownList();
    showDropDown();
    inrFormat();
    tabFalse();
	btnSubmit();
    backBtnLinking();

    tooltip();

    $(".number-only").on("keydown", function (event) {
        // Ignore controls such as backspace
        var arr = [8, 9, 16, 17, 20, 32, 35, 36, 37, 38, 39, 40, 45, 46];
        // Allow letters
        for (var i = 48; i <= 57; i++) {
            arr.push(i);
        }
        for (var i = 96; i <= 105; i++) {
            arr.push(i);
        }
        if (jQuery.inArray(event.which, arr) === -1) {
            event.preventDefault();
        }
    });

    $(".number-only").on("input", function () {
        var regexp = /[^0-9]/;
        if ($(this).val().match(regexp)) {
            $(this).val($(this).val().replace(regexp, ''));
        }
    });

    $('input[type=radio][name=gender]').change(function () {
        $("#relationlist").mCustomScrollbar('destroy');
        $("#ddllarelation").mCustomScrollbar('destroy');
		$('#gender').val(this.value);
        if (this.value == 'male') {
            $(this).parents('.form-group').next().find('input').focus();
            $('#firstli').remove();
            $("#relationlist").prepend('<li class="list-item" id="firstli">wife</li>');
            $('#insidefirstli').remove();
            $("#ddllarelation").prepend('<li class="list-item" id="insidefirstli">wife</li>');

        }
        else if (this.value == 'female') {
            $(this).parents('.form-group').next().find('input').focus();
            $('#firstli').remove();
            $("#relationlist").prepend('<li class="list-item" id="firstli">husband</li>');
            $('#insidefirstli').remove();
            $("#ddllarelation").prepend('<li class="list-item" id="insidefirstli">husband</li>');
        }
        $("#relationlist").mCustomScrollbar();
        $("#ddllarelation").mCustomScrollbar();
        dropdownList();
    });

    $('input[type=radio][name=investingfor]').change(function () {
        $(this).parents('.form-group').next().find('input').focus();
		$('#investing_for').val(this.value);
    });

    $('#relationlist li').on('click', function (event) {
        $(this).parents('.form-group').next().find('input').focus();
		$('#investing_for').val(this.text);
    });


    $("#investmentamt").bind('blur', function () {
        if ($("#investmentamt").val() != "") {
            investmentAmout();
        }
        else {
            $("#investmentamt").parents('.multi-group').find('.extra-info').children('.cm-error').show();
            $("#investmentamt").parents('.multi-group').find('.extra-info').children('.cm-error').html("<br><br><br>Please enter your investment amount");
        }
    });


    $("#investmentamt").on("keyup", function (event) {
        if (event.keyCode == 13) {
            if ($("#investmentamt").val() != "") {
                investmentAmout();
                $(this).parents('.multi-group').find('.btn').trigger('click');
            }
            else {
                $("#investmentamt").parents('.multi-group').find('.extra-info').children('.cm-error').show();
                $("#investmentamt").parents('.multi-group').find('.extra-info').children('.cm-error').html("<br><br><br>Please enter your investment amount");
            }
        }
    });

    $('#firstscreenperiod li').on('click', function (event) {
        investmentAmout();
    });

    $("#investmentamt").bind('focus', function () {
        $("#investmentamt").parents('.multi-group').find('.extra-info').children('.cm-error').hide();
        $("#investmentamt").parents('.multi-group').find('.extra-info').children('.cm-error').html("");
    });

    $(window).on("load", function () {
        $(".dropdown-list").mCustomScrollbar();
        if ($("#ELCFDCAGR").val() == "" || $("#ETTFDCAGR").val() == "" || $("#BNDFDCAGR").val() == "" || $("#EMCFDCAGR").val() == "" || $("#MGFNDCAGR").val() == "") {
            $.ajax({
                type: "GET",
                url: "/wealthplus/getCAGR",
                dataType: "json",
                cache: false,
                contentType: 'application/json',
                success: function (Result) {
                    $("#ELCFDCAGR").val(round(Result.ELCFD1Year, 4) + "~" + round(Result.ELCFD3Year, 4) + "~" + round(Result.ELCFD5Year, 4) + "~" + round(Result.ELCFDInception, 4) + "~" + round(Result.ELCFD7Year, 4));
                    $("#ETTFDCAGR").val(round(Result.ETTFD1Year, 4) + "~" + round(Result.ETTFD3Year, 4) + "~" + round(Result.ETTFD5Year, 4) + "~" + round(Result.ETTFDInception, 4) + "~" + round(Result.ETTFD7Year, 4));
                    $("#BNDFDCAGR").val(round(Result.BNDFD1Year, 4) + "~" + round(Result.BNDFD3Year, 4) + "~" + round(Result.BNDFD5Year, 4) + "~" + round(Result.BNDFDInception, 4) + "~" + round(Result.BNDFD7Year, 4));
                    $("#EMCFDCAGR").val(round(Result.EMCFD1Year, 4) + "~" + round(Result.EMCFD3Year, 4) + "~" + round(Result.EMCFD5Year, 4) + "~" + round(Result.EMCFDInception, 4) + "~" + round(Result.EMCFD7Year, 4));
                    $("#MGFNDCAGR").val(round(Result.MGFND1Year, 4) + "~" + round(Result.MGFND3Year, 4) + "~" + round(Result.MGFND5Year, 4) + "~" + round(Result.MGFNDInception, 4) + "~" + round(Result.MGFND7Year, 4));
                },
                error: function (xhr, status, error) {
                    // console.log('error-' + error);
                },
            });
        }

        if ($("#BMELCFDCAGR").val() == "" || $("#BMETTFDCAGR").val() == "" || $("#BMBNDFDCAGR").val() == "" || $("#BMEMCFDCAGR").val() == "" || $("#BMMGFNDCAGR").val() == "") {
            $.ajax({
                type: "GET",
                url: "/wealthplus/getBenchMark",
                dataType: "json",
                cache: false,
                contentType: 'application/json',
                success: function (Result) {
                    $("#BMELCFDCAGR").val(round(Result.BMELCFD1Year, 4) + "~" + round(Result.BMELCFD3Year, 4) + "~" + round(Result.BMELCFD5Year, 4) + "~" + round(Result.BMELCFDInception, 4) + "~" + round(Result.BMELCFD7Year, 4));
                    $("#BMETTFDCAGR").val(round(Result.BMETTFD1Year, 4) + "~" + round(Result.BMETTFD3Year, 4) + "~" + round(Result.BMETTFD5Year, 4) + "~" + round(Result.BMETTFDInception, 4) + "~" + round(Result.BMETTFD7Year, 4));
                    $("#BMBNDFDCAGR").val(round(Result.BMBNDFD1Year, 4) + "~" + round(Result.BMBNDFD3Year, 4) + "~" + round(Result.BMBNDFD5Year, 4) + "~" + round(Result.BMBNDFDInception, 4) + "~" + round(Result.BMBNDFD7Year, 4));
                    $("#BMEMCFDCAGR").val(round(Result.BMEMCFD1Year, 4) + "~" + round(Result.BMEMCFD3Year, 4) + "~" + round(Result.BMEMCFD5Year, 4) + "~" + round(Result.BMEMCFDInception, 4) + "~" + round(Result.BMEMCFD7Year, 4));
                    $("#BMMGFNDCAGR").val(round(Result.BMMGFND1Year, 4) + "~" + round(Result.BMMGFND3Year, 4) + "~" + round(Result.BMMGFND5Year, 4) + "~" + round(Result.BMMGFNDInception, 4) + "~" + round(Result.BMMGFND7Year, 4));
                },
                error: function (xhr, status, error) {
                    // console.log('error-' + error);
                },
            });
        }
    });




    if ($('.mod-incr-decr').length != 0) {
        incrDicr();
    }






    $('.txtOnly').keypress(function (event) {
        var inputValue = event.charCode;
        if (!(inputValue >= 65 && inputValue <= 122) && (inputValue != 32 && inputValue != 0)) {
            event.preventDefault();
        }
    });

});

$(document).ready(function () {
   stringparam();
    $('.addpopupclose').on('click', function (event) {
        
		$('.StatusPopup').hide();
    });
});

var getUrlVars = function () {

    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function stringparam() {
    ss_id = parseInt(getUrlVars()["ss_id"]);
    fba_id = getUrlVars()["fba_id"];
    ip_address = getUrlVars()["ip_address"];
    app_version = getUrlVars()["app_version"];
    mac_address = getUrlVars()["mac_address"];
    if (getUrlVars()["mobile_no"] == "" || getUrlVars()["mobile_no"] == undefined) {
        mobile_no = 0;
    } else {
        mobile_no = getUrlVars()["mobile_no"];
    } 
    if (fba_id == "" || fba_id == undefined || fba_id == "0" || ip_address == '' || ip_address == '0' || ip_address == undefined || app_version == "" || app_version == "0" || app_version == undefined || ss_id == "" || ss_id == undefined || ss_id == "0") {

        $(".motor_maindiv").hide();
        $(".warningmsg").show();
    } else if (app_version == 'FinPeace' && (mobile_no == "" || mobile_no == null || mobile_no == 0)) {
        $(".motor_maindiv").hide();
        $(".warningmsg").show();
    } else {

        $(".motor_maindiv").show();
        $(".warningmsg").hide();
    }
}
