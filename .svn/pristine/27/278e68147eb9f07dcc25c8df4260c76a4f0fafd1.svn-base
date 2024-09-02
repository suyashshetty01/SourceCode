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

    $.validator.addMethod("mobregex", function(value, element) {
        return this.optional(element) || value == value.match(/^[6-9]{1}[0-9]{9}$/);
    }, 'Mobile number should start from 6,7,8 or 9');
    
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
                mobregex:true,
				number:true
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
                mobregex:true
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
        },
        submitHandler: function () {
            $('.loading').show();
           var fba_id;var ss_id;
		   	var fba_id;var ss_id;
			setTimeout(call_ibuudy, 2000);
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

    function call_ibuudy(){
        $.ajax({
            //url: GetUrl()+'/sync_contacts/my_ibuddy?mobileno='+$('#buddyMobile').val()+'&update=yes',
            url: 'https://horizon.policyboss.com:5443/sync_contacts/my_ibuddy?mobileno='+$('#buddyMobile').val()+'&update=yes',
            type: "GET",
            success: function (response) {
				buddyMobile = $('#buddyMobile').val();
                $('.loading').show();
                console.log("ibuddy response ",response);
                if(response.hasOwnProperty('count')){
                    $('.loading').show();
                    $.ajax({
                        //url: GetUrl()+"/sync_contacts/sync_contact_call_histories/getTopPerformer/6",
                        url: "https://horizon.policyboss.com:5443/sync_contacts/sync_contact_call_histories/getTopPerformer/6",
                        type: "GET",
                        success: function (response) {
                            console.log("ibuddy response ",response);
                            if(response.length>0){
                                showModel(response);
                            }else{
                                alert("Error");
                            }
                        },
                        error: function (response) {
                            alert('Error');
                        }
                    });
                }else if(response.length>0){
                    showModel(response);
                }else{
                    alert("Error");
                    $('.loading').hide();
                }
               
            },
            error: function (response) {
                alert('Error');
                $('.loading').hide();
            }
        });
    }

    function showModel(response) {
        let advisordiv;
        var sync_type_response = response;
        //$('.divSlidderData').empty();
        for (let i = 0; i < response.length; i++) {
            let ss_id = response[i].hasOwnProperty('ss_id') ? response[i].ss_id : (response[i].hasOwnProperty('_id') ? response[i]._id : "");
            $.ajax({
                //url: GetUrl()+'/posps/dsas/view/' + ss_id,
                url: 'https://horizon.policyboss.com:5443/posps/dsas/view/' + ss_id,
                type: "GET",
                success: function (response) {
                    console.log("detail by ssid: ", response);
                    fba_id = response.EMP.FBA_ID;
                    $('#buddyMobile').val('');
                    $('.loading').hide();
                    $('#staticBackdrop').modal('show');
                    $('#noRecordFound').modal('hide');

                    // for(var i in newArray){
                    /*advisordiv = `<div class="product-slider-box nav-item select-tab-item" role="presentation">
                                <button class="nav-link select-tab-box tab-box-horizontal" id="#tab${i+1}" data-bs-toggle="pill" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">
                                    <div class="inner-box">
                                        <input class="form-check-input radio-custom radio-image" name="radio-group3" type="radio" id="inlineRadiobox${i}"   checked />
                                            <label class="form-check-label input-field border-thick radio-custom-label radio-image-label radio-input-hidden" for="inlineRadiobox5">
                                    <div class="icon-box">
                                                <img id="advisorimgurl${i}" src="https://horizon.policyboss.com/profile_pic?fba_id=${fba_id}" alt="Insurance Advisor" />
                                    </div>  
                                    <span id="advisorname${i}" class="radio-name-text text-extralight font-16">${response.EMP.Emp_Name}</span>
                                    </label>
                                    </div>
                                </button>
                            </div>`;*/

                    $(`#advisorimgurl${i}`).attr("src", `https://horizon.policyboss.com/profile_pic?fba_id=${fba_id}`);
                    $(`#advisorname${i}`).text(`${response.EMP.Emp_Name}`);
                    if (sync_type_response[i].type == "Preferred_Data") {
                        $(`#performer${i}`).show();
                    } else {
                        $(`#performer${i}`).hide();
                    };
                    console.log(i);
                    //$('.divSlidderData').append(advisordiv);
                    // }

                    $('.selection-box-row').append(advisordiv);
                },
                error: function (response) {
                    alert('Error');
                }
            });
        }
    }

    function showAdvisorPopup() {
        $('.product-slider-small').slick('refresh');
        for (var i = 0; i < 6; i++) {
            if ($(`#inlineRadiobox${i}`).is(":checked")) {
                $('#my_iBuddy').modal('show');
                let advisorimgurl = $(`#advisorimgurl${i}`).attr("src");
                let advisorname = $(`#advisorname${i}`).text()
                $(`#mybuddyimage`).attr("src", advisorimgurl);
                $(`#mybuddyname`).text(advisorname);
                console.log(advisorimgurl, " ", advisorname);
    
            }
    
        }
    
    }
});