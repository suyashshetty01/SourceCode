$(function() {
    jQuery.validator.setDefaults({
        highlight: function(element) {
            if ($(element).closest('.js-input-group').length) {
                $(element).closest('.js-input-group').addClass('has-error');
            } else {
                $(element).parent().addClass('has-error');
            }
        },
        unhighlight: function(element) {
            if ($(element).closest('.js-input-group').length) {
                $(element).closest('.js-input-group').removeClass('has-error');
            } else {
                $(element).parent().removeClass('has-error');
            }
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function(error, element) {
            if (element.closest('.js-input-group').length) {
                if (element.closest('.js-input-group').parent().find('.help-block').length) {
                    element.closest('.js-input-group').parent().find('.help-block').remove();
                }
                error.insertAfter(element.closest('.js-input-group'));
            } else {
                if (element.parent('.has-error').find('.help-block').length) {
                    element.parent('.has-error').find('.help-block').remove();
                }
                error.insertAfter(element);
            }
        },
        onfocusout: false
    });

    $.validator.addMethod('validatePostelcode', function(value, element) {
        var patt = /\b((?:(?:gir)|(?:[a-pr-uwyz])(?:(?:[0-9](?:[a-hjkpstuw]|[0-9])?)|(?:[a-hk-y][0-9](?:[0-9]|[abehmnprv-y])?)))) ?([0-9][abd-hjlnp-uw-z]{2})\b/i;

        return res = patt.test(value);
    }, 'Invalid postel code.');

    function scrollOnError(validator) {
        $('html, body').animate({
            scrollTop: $(validator.errorList[0].element).offset().top 
        }, 'fast', function() {
            validator.errorList[0].element.focus();
        });
    };


    jQuery.validator.addMethod("email", function(value, element) {
        return this.optional(element) || (/^[a-z0-9]+([-._][a-z0-9]+)*@([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,4}$/.test(value) && /^(?=.{1,64}@.{4,64}$)(?=.{6,100}$).*/.test(value));
    }, 'Invalid email address');

    $.validator.addMethod('filesize', function(value, element, param) {
        // param = size (en bytes)
        // element = element to validate (<input>)
        // value = value of the element (file name)
        return this.optional(element) || (element.files[0].size <= param)
    });

    $.validator.addMethod('phoneUK', function(phone_number, element) {
        return this.optional(element) || phone_number.length > 9 &&
            phone_number.match(/^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/);
    }, 'Please specify a valid phone number');

    $.validator.addMethod("alpha", function(value, element) {
        return this.optional(element) || value == value.match(/^[a-zA-Z][a-zA-Z\s-]*$/);
    }, 'Only alphabets are allowed.');
    
    $.validator.addMethod("reasonSpace", function(value, element) {
        return this.optional(element) || value == value.match(/^[^-\s][a-zA-Z0-9_\s-]+$/);
    }, 'Please Enter Valid Reason.');

    $.validator.addMethod("allowNumericWithDecimal", function(value, element) {
        return this.optional(element) || value == value.match(/^\+?[0-9]*\.?[0-9]+$/);
    }, 'Please Enter only digits.');

    $.validator.addMethod("regex", function(value, element, regexp) {
          var re = new RegExp(regexp);
          return this.optional(element) || re.test(value);
        },"Please check your input.");

    $.validator.addMethod("audioTracksValidation", function(value, element, regexp) {
            var re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        },"Audio track must be a file of type: mp3, ogg, wav.");
  
    jQuery.validator.addClassRules("js-audio-tracks",{
        audioTracksValidation: /\.(?:wav|mp3|ogg)$/,
    });

    $.validator.addMethod("photosValidation", function(value, element, regexp) {
        var re = new RegExp(regexp);
        return this.optional(element) || re.test(value);
    },"Image must be a file of type: jpeg, png, gif, jpg.");

    jQuery.validator.addClassRules("js-photos",{
        photosValidation: /\.(?:jpeg|png|gif|jpg)$/,
    });

    jQuery.validator.addClassRules("js-audio-tracks-required",{
        audioTrackRequired: true,
    });

    $.validator.addMethod("audioTrackRequired", $.validator.methods.required,
    "Audio track is required.");

    jQuery.validator.addClassRules("js-photo-required",{
        photoRequired: true,
    });

    $.validator.addMethod("characterNameRequired", $.validator.methods.required,
    "Name is required.");

    jQuery.validator.addClassRules("js-character-name-required",{
        characterNameRequired: true,
    });

    $.validator.addMethod("photoRequired", $.validator.methods.required,
    "Image is required.");

    jQuery.validator.addMethod("noSpace", function(value, element) { 
    return value == '' || value.trim().length != 0;  
    }, "Answer is required.");

    $("#contact-us-form").validate({
        rules: {
            name: {
                required: true,
                alpha: true
            },
            mobile: {
                required: true,
                number: true,
            },
            city: {
                required: true,
            },
            select: {
                required: true
            }
        },
        messages: {
            name: {
                required: "Name is required.",
            },
            mobile: {
                required: "Mobile Number is required.",
                number: "Only numbers are allowed."
            },
            city: {
                required: "City is required.",
            },
            select: {
                required: "This is required.",
            }
        },
        invalidHandler: function(form, validator) {
            // if (!validator.numberOfInvalids())
                scrollOnError(validator);
        }
    });
    $("#home-banner-form").validate({
        rules: {
            number: {
                required: true,
                number: true,
                min: 10,
            }
        },
        messages: {
            number: {
                required: "Mobile Number is required.",
                min: "Please enter at least 10 digits."
            }
        },
        invalidHandler: function(form, validator) {
            // if (!validator.numberOfInvalids())
                // scrollOnError(validator);
        }
    });
    $("#landing-banner-form").validate({
        rules: {
            number: {
                required: true,
                number: true,
                min: 10,
            }
        },
        messages: {
            number: {
                required: "Mobile Number is required.",
                min: "Please enter at least 10 digits."
            }
        },
        invalidHandler: function(form, validator) {
            // if (!validator.numberOfInvalids())
                // scrollOnError(validator);
        }
    });
    $('#view-quote-form').validate({
        rules: {
            registration_no : {
                required: true,
            },
            member_age_input : {
                required: true,
            },
            pincode_number_field : {
                required: true,
            }
        },
        messages: {
            registration_no: {
                required: "Car number is required.",
            },
            member_age_input : {
                required: "Member Age is required.",
            },
            pincode_number_field : {
                required: "Pincode is required.",
            }
        },
        invalidHandler: function(form, validator) {
            // if (!validator.numberOfInvalids())
                // scrollOnError(validator);
        }
    });
    $("#connect-us-form").validate({
        rules: {
            mobile_number: {
                required: true,
                number: true,
            },
            select: {
                required: true
            },
            date: {
                required: true
            },
            time: {
                required: true
            }
        },
        messages: {
            mobile_number: {
                required: "Mobile Number is required.",
                number: "Only numbers are allowed."
            },
            select: {
                required: "This is required.",
            },
            date: {
                required: "Date is required"
            },
            time: {
                required: "Time is required"
            }
        },
        invalidHandler: function(form, validator) {
            // if (!validator.numberOfInvalids())
                scrollOnError(validator);
        }
    });
    $("#explore-form").validate({
        rules: {
            number: {
                required: true,
                number: true,
            }
        },
        messages: {
            number: {
                required: "Mobile Number is required.",
            }
        },
        invalidHandler: function(form, validator) {
            // if (!validator.numberOfInvalids())
                scrollOnError(validator);
        }
    });
    $("#explore-find-form").validate({
        rules: {
            number: {
                required: true,
                number: true,
            }
        },
        messages: {
            number: {
                required: "Mobile Number is required.",
            }
        },
        invalidHandler: function(form, validator) {
            // if (!validator.numberOfInvalids())
                scrollOnError(validator);
        }
    });
    $("#join-now-form").validate({
        rules: {
            name: {
                required: true,
            },
            email: {
                required: true
            },
            mobile: {
                required: true,
                number: true,
            },
            city: {
                required: true,
            }
        },
        messages: {
            name: {
                required: "Name is required.",
            },
            email: {
                required: "Email is required.",
            },
            mobile: {
                required: "Mobile Number is required.",
                number: "Only numbers are allowed."
            },
            city: {
                required: "City is required.",
            }
        },
        invalidHandler: function(form, validator) {
            // if (!validator.numberOfInvalids())
                scrollOnError(validator);
        }
    });
    $("#modal-join-now-form").validate({
        rules: {
            name_field: {
                required: true,
            },
            email_field: {
                required: true
            },
            mobile_field: {
                required: true,
                number: true,
            },
            city_field: {
                required: true,
            }
        },
        messages: {
            name_field: {
                required: "Name is required.",
            },
            email_field: {
                required: "Email is required.",
            },
            mobile_field: {
                required: "Mobile Number is required.",
                number: "Only numbers are allowed."
            },
            city_field: {
                required: "City is required.",
            }
        },
        invalidHandler: function(form, validator) {
            // if (!validator.numberOfInvalids())
                scrollOnError(validator);
        }
    });
    $("#basic_detil_form").validate({
        rules: {
            registration_no: {
                required: true,
                // regex : /^[A-Za-z]{2,3}(-\d{2}(-[A-Za-z]{1,2})?)?-\d{3,4}$/
            },
            owner_name: {
                required: true,
                alpha: true
            },
            email_add: {
                required: true
            },
            mobile_num: {
                required: true,
                number: true,
                regex : /^(\+\d{1,3}[- ]?)?\d{10}$/
            },
        },
        messages: {
            registration_no:{
                required: "Please enter Registration Number",
                regex : "Invalid Number"
            },
            owner_name: {
                required: "Please enter Owner Name",
                alpha: "Invalid input."
            },
            email_add: {
                required: "Email is required.",
            },
            mobile_num: {
                required: "Mobile Number is required.",
                number: "Only numbers are allowed.",
                max: "Please enter maximum 10 digits.",
                regex : "Please Enter Valid Number."
            },
        },
        invalidHandler: function(form, validator) {
            if (!validator.numberOfInvalids())
                scrollOnError(validator);
        }
    });
    $("#personal_detil_form").validate({
        rules: {
            nominee_name: {
                required: true,
                alpha: true
            },
            age: {
                required: true,
            },
            relation: {
                required: true,
            }
        },
        messages: {
            nominee_name: {
                required: "Please enter Nominee Name",
                alpha: "Invalid input."
            },
            age: {
                required: "Please Select Age",
            },
            relation: {
                required: "Please Select Relation",
            }
        },
        invalidHandler: function(form, validator) {
            if (!validator.numberOfInvalids())
                scrollOnError(validator);
        }
    });
    $("#address_form").validate({
        rules: {
            address_input: {
                required: true
            },
            pincode_input: {
                required: true,
                number: true,
                regex: /^[1-9][0-9]{5}$/
            },
            previous_policy_number: {
                required: true
            }
        },
        messages: {
            address_input: {
                required: "Please enter Registred Address"
            },
            pincode_input: {
                required: "Please enter Pincode",
                number: "Invalid input.",
                regex: "Please Enter Valid Pincode."
            },
            previous_policy_number: {
                required: "Please enter Previous Policy Number"
            }
        },
        invalidHandler: function(form, validator) {
            if (!validator.numberOfInvalids())
                scrollOnError(validator);
        }
    });
    $("#car_detil_form").validate({
        rules: {
            engine_number: {
                required: true
            },
            chassis_number: {
                required: true
            },
            loan_provider : {
                required: true
            }
        },
        messages: {
            engine_number: {
                required: "Please enter Engine Number"
            },
            chassis_number: {
                required: "Please enter Chassis Number"
            },
            loan_provider : {
                required: "Please Select Loan Provider"
            }
        },
        invalidHandler: function(form, validator) {
            if (!validator.numberOfInvalids())
                scrollOnError(validator);
        }
    });
    $("#send_email_form").validate({
        rules: {
            send_email:{
                required: true,
                email: true
            }
        },
        messages: {
            send_email:{
                required:"Email is required",
                email: "Please enter valid email"
            }
        },
        invalidHandler: function(form, validator) {
            if (!validator.numberOfInvalids())
                scrollOnError(validator);
        }
    });

    $("#proposer_detil_form").validate({
        rules: {
            name: {
                required: true,
            },
            email_add: {
                required: true
            },
            mobile_num: {
                required: true,
                number: true,
                regex : /^(\+\d{1,3}[- ]?)?\d{10}$/
            },
            pincode_input: {
                required: true,
                number: true,
                regex: /^[1-9][0-9]{5}$/
            },
            address: {
                required: true,
            },
            state: {
                required: true,
            },
            nominee_name: {
                required: true,
                alpha: true
            }
        },
        messages: {
            address: {
                required: "Please enter Address"
            },
            pincode_input: {
                required: "Please enter Pincode",
                number: "Invalid input.",
                regex: "Please Enter Valid Pincode."
            },
            email_add: {
                required: "Email is required.",
            },
            mobile_num: {
                required: "Mobile Number is required.",
                number: "Only numbers are allowed.",
                max: "Please enter maximum 10 digits.",
                regex : "Please Enter Valid Number."
            },
            state: {
                required: "Please enter State"
            },
            nominee_name: {
                required: "Please enter Nominee Name",
                alpha: "Invalid input."
            }
        },
        invalidHandler: function(form, validator) {
            if (!validator.numberOfInvalids())
                scrollOnError(validator);
        }
    });
    $("#insured_detil_form").validate({
        rules: {
            adult_name: {
                required: true,
            },
            child_name: {
                required: true,
            },
            adult_weight: {
                required: true,
                number: true,
            },
            child_weight: {
                required: true,
                number: true,
            },
        },
        messages: {
            adult_name: {
                required: "Please enter Nominee Name",
            },
            adult_weight: {
                required: "Please enter Weight",
                number: "Weight should be in valid format."
            },
            child_name: {
                required: "Please enter Nominee Name",
            },
            child_weight: {
                required: "Please enter Weight",
                number: "Weight should be in valid format."
            },
        },
        invalidHandler: function(form, validator) {
            if (!validator.numberOfInvalids())
                scrollOnError(validator);
        }
    });
});