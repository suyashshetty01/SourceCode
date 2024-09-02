$(function() {
	 $.validator.addMethod("mobregex", function(value, element) {
        return this.optional(element) || value == value.match(/^[6-9]{1}[0-9]{9}$/);
    }, 'Mobile number should start from 6,7,8 or 9');
	
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