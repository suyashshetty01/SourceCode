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
    // $("#find-my-ibuddy").validate({
    //     rules: {
    //         car_number: {
    //             required: true,
    //         }
    //     },
    //     messages: {
    //         car_number: {
    //             required: "Please enter Car Number",
    //         }
    //     },
    //     invalidHandler: function(form, validator) {
    //         // if (!validator.numberOfInvalids())
    //             scrollOnError(validator);
    //     }
    // });
});