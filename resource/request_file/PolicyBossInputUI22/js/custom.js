$(document).ready(function () {
	
    window.scrollTo(0, 0);

    //Preloader Js
    $(".loader").fadeOut("slow");

    //Video play On click
    $(".js_play").click(function() {
      var id = $(this).data('id-match');
      // var vid = $('#video-element-'+id);
      var vid = $('.modal-video-element');
      vid.get(0).currentTime = 0;
        vid.trigger('play');
        // $(this).hide();
        $('.js-videos').slick('slickPause');
    });
    
    $(".js_video_reset").click(function() {
      $('.modal-video-element').trigger('pause');
    });

    $(".js_play_video").click(function() {
      console.log("this play clicked");
      $(this).closest('.video-box').find('.video-element').trigger('play');
      $(this).hide();
    });
    
    //Open Modal Automatically after Delay
    // setTimeout(function(){
    //   $('#policyInfromationModal').modal('show');
    // }, 5000);

    $('#buy_now_btn').click(function() {
      $('#buy_now_btn').removeClass('animate');
      $(this).addClass('active');
      setTimeout(function() {
        $('#buy_now_btn').addClass('animate');
      },1000);
      var delay = 3000; 
      var url = 'car-proposal-details.html'
      setTimeout(function(){ window.location = url; }, delay);
    });
    $('#mob_buy_now_btn').click(function() {
      $('#buy_now_btn').removeClass('animate');
      $(this).addClass('active');
      setTimeout(function() {
        $('#mob_buy_now_btn').addClass('animate');
      },1000);
      var delay = 3000; 
      var url = 'car-proposal-details.html'
      setTimeout(function(){ window.location = url; }, delay);
    });

    $('.health_buy_now_btn').click(function() {
      $('.health_buy_now_btn').removeClass('animate');
      $(this).addClass('active');
      setTimeout(function() {
        $('.health_buy_now_btn').addClass('animate');
      },1000);
      var delay = 3000; 
      var url = 'health-proposal-details.html'
      setTimeout(function(){ window.location = url; }, delay);
    });
    $('.health_mob_buy_now_btn').click(function() {
      $('.health_buy_now_btn').removeClass('animate');
      $(this).addClass('active');
      setTimeout(function() {
        $('.health_mob_buy_now_btn').addClass('animate');
      },1000);
      var delay = 3000; 
      var url = 'health-proposal-details.html'
      setTimeout(function(){ window.location = url; }, delay);
    });

    $('.term_buy_now_btn').click(function() {
      $('.term_buy_now_btn').removeClass('animate');
      $(this).addClass('active');
      setTimeout(function() {
        $('.term_buy_now_btn').addClass('animate');
      },1000);
      var delay = 3000; 
      var url = 'term-proposal-details.html'
      setTimeout(function(){ window.location = url; }, delay);
    });
    $('.term_mob_buy_now_btn').click(function() {
      $('.term_buy_now_btn').removeClass('animate');
      $(this).addClass('active');
      setTimeout(function() {
        $('.term_mob_buy_now_btn').addClass('animate');
      },1000);
      var delay = 3000; 
      var url = 'term-proposal-details.html'
      setTimeout(function(){ window.location = url; }, delay);
    });

    $('.cv_buy_now_btn').click(function() {
      $('.cv_buy_now_btn').removeClass('animate');
      $(this).addClass('active');
      setTimeout(function() {
        $('.cv_buy_now_btn').addClass('animate');
      },1000);
      var delay = 3000; 
      var url = 'commercial-vehicle-proposal-details.html'
      setTimeout(function(){ window.location = url; }, delay);
    });
    $('.mob_cv_buy_now_btn').click(function() {
      $('.cv_buy_now_btn').removeClass('animate');
      $(this).addClass('active');
      setTimeout(function() {
        $('.mob_cv_buy_now_btn').addClass('animate');
      },1000);
      var delay = 3000; 
      var url = 'commercial-vehicle-proposal-details.html'
      setTimeout(function(){ window.location = url; }, delay);
    });

    $('.traveler-btn').click(function() {
      $(this).closest('.inner-field-col').find('.traveler-age-select').addClass('added');
      $(this).hide();
      $(this).closest('.inner-field-col').next().removeClass('btn-hidden');
    });

    setTimeout(function(){
      $('.language-dropdown').show();
    }, 200);
   
    if ($(window).width() < 992) {
     $('.car-proposal-policy-info.policy-info-listing').addClass('btn-hidden');
     $('.summary-info-wrapper').addClass('btn-hidden');
    }

    $('.decreament-btn').click(function (e) {
      e.preventDefault();
       var currentVal = parseInt($(this).next(".number-count-input").val());
        if (currentVal != NaN && currentVal > 0)
        {
            $(this).next(".number-count-input").val(currentVal - 1);
        }
    });

    $('.increament-btn').click(function (e) {
      e.preventDefault();
       var currentVal = parseInt($(this).prev(".number-count-input").val());
        if (currentVal != NaN)
        {
            $(this).prev(".number-count-input").val(currentVal + 1);
        }
    });

    $(".select-all-input").closest('.check-item-box').click(function () {
      $(this).closest('.check-item-area').find(".check-input").prop('checked', $('.select-all-input').prop('checked'));
    });

    $(".check-all-input").click(function () {
      console.log('this check clicked');
      $(this).closest('.contact-lead-section').find(".check-input").prop('checked', $('.check-input').prop('checked'));
    });
    

    $('input.inner-placeholder-dropdown-input').click(function () {
      console.log('inn drop');
      if (($('input.inner-placeholder-dropdown-input')).length > 0) {
        console.log('has value');
        $(this).addClass('value-added');
      } 
      else{
        console.log('no value');
        $(this).removeClass('value-added');
      }
    });

    $('input.plan-list-chechkbox:checkbox').change(function(){
      if($(this).is(":checked")) {
        $(this).closest('.result-listing-select-col').find('.result-listing-select-box').addClass("shadow-glow");
      } 
      else {
        $(this).closest('.result-listing-select-col').find('.result-listing-select-box').removeClass("shadow-glow");
      }
    });

    $('input.show-select:checkbox').change(function(e){
      if($(this).is(":checked")) {
        $(this).closest('.detail-select-row').find('input.deselect-all:checkbox').prop('checked',false);
        $(this).closest('.detail-select-box').find('.select-box').show();
      } 
      else {
        $(this).closest('.detail-select-box').find('.select-box').hide();
      } 
    });

    $('input.deselect-all:checkbox').change(function(e){
      if($(this).is(":checked")) {
        $(this).closest('.detail-select-row').find('.select-box').hide();
        $(this).closest('.detail-select-row').find('.show-select:checkbox').each(function() { 
          this.checked = false; 
        });
      } 
      else {
        $(this).closest('.detail-select-row').find('.select-box').show();
        $(this).closest('.detail-select-row').find('.show-select:checkbox').each(function() { 
          this.checked = true; 
        });
      } 
    });

    $('input.check-input:checkbox').change(function(e){
      if (!$('input.deselect-all:checkbox')) {
        $(this).closest('.detail-select-row').find('input.deselect-all:checkbox').prop('checked', false);
      }
    });

    //policy information have policy toggle
    $('input.js-not-have-policy[type=radio]').closest('.policy-information-listing').find('.js-policy-condition').hide();
    $('input.js-not-have-policy[type=radio]').change(function(e){
      if($(this).is(":checked")) {
        $(this).closest('.policy-information-listing').find('.js-policy-condition').hide();
      }
    });
    $('input.js-have-policy[type=radio]').change(function(e){
      if($(this).is(":checked")) {
        $(this).closest('.policy-information-listing').find('.js-policy-condition').show();
      }
    });

    $('input.js-not-have-previous-policy[type=radio]').closest('.registration-row').find('.js-previous-policy-condition').hide();
    $('input.js-not-have-previous-policy[type=radio]').change(function(e){
      if($(this).is(":checked")) {
        $(this).closest('.registration-row').find('.js-previous-policy-condition').hide();
      }
    });
    $('input.js-have-previous-policy[type=radio]').change(function(e){
      if($(this).is(":checked")) {
        $(this).closest('.registration-row').find('.js-previous-policy-condition').show();
      }
    });

    //View Info Toggle
    $('.view-info-btn').click(function () {
      $('#car-proosal-detail-box').find('.policy-info-listing').toggleClass('btn-hidden');
      $('.summary-info-wrapper').toggleClass('btn-hidden');
      $('.policy-detail-modal .policy-info-listing').toggleClass('btn-hidden');
      $(this).text( ($(this).text() == 'View Info' ? 'Hide Info' : 'View Info') )
     .toggleClass("active");
    })

    $('.show-detail').click(function () {
        $('#car-proosal-detail-box').find('.insurance-price-breakup-area').toggleClass('hidden-section');
        $('.policy-detail-modal .policy-info-listing').toggleClass('btn-hidden');
        $(this).text( ($(this).text() == 'Hide Price Breakup' ? 'Show Price Breakup' : 'Hide Price Breakup') )
       .toggleClass("active");
       $(this).parent(".insurance-price-breakup-area").find(".insurance-price-list").toggleClass('hidden-section');
    });

    if ($(window).width() < 992) {
      $('#car-proosal-detail-box').find('.insurance-price-breakup-area').removeClass('hidden-section');
    }

    $(document).on('keypress','.number-field',function(e){
      if($(e.target).prop('value').length>=10){
      if(e.keyCode!=32)
      {return false} 
    }});

    $(document).on('keypress','#pin_code',function(e){
      if($(e.target).prop('value').length>=6){
        if(e.keyCode!=32)
        {return false} 
      }
    });

    $(document).on('keypress','#rangeValue',function(e){
      if($(e.target).prop('value').length>=6){
        if(e.keyCode!=32)
        {return false} 
      }
    });

    // $('#registration_num').keyup(function(e) {
    //   var shortCode = $(this).val().split("-").join(""); // remove hyphens
    //   // var shortCode = $(this).val(); // remove hyphens
    //   if (shortCode.length > 0) {
    //     var upper = shortCode.toUpperCase();
    //     console.log(upper);
    //     // var reg = new RegExp ('/^[A-Za-z]{2,3}(-\\d{2}(-[A-Za-z]{1,2})?)?-\\d{3,4}$/');
    //     // shortCode = reg.test(upper);
    //     shortCode = shortCode.match(new RegExp('.{1,2}', 'g')).join("-").toLocaleUpperCase();
    //     console.log(shortCode);
    //     $(this).val(shortCode);
    //   }
    // });

    // $('#tab-yourself-1').find('.select-tab-box').click(function () {
    //   $('.select-tab-box').addClass('show');
    //   console.log('inn');
    //   $(".other-links-box").show();
    //   $(".other-links-box").hide();
    // })

    // $('input.dob-datepicker').focus(function () {
    //     $(this).closest('.input-field-box').find('.floating-placeholder')
    // });
      
 
    $('.dropdown-toggle.bs-placeholder').focus(function () {
        $(this).addClass('dropdown-focused');
        $(this).closest('.multiselect-dropdown-box').find('.floating-placeholder').addClass('focused');
    });

    //Add Class On Modal Open and Close
    // $('.mob-search-listing-modal').on('shown.bs.modal', function (e) {
    //     $('body').addClass('bottom-sheet-modal-show');
    // });
    // $(".mob-search-listing-modal").on('hide.bs.modal', function () {
    //   $('body').removeClass('bottom-sheet-modal-show');
    // });


    //Check Checkbox Selection
    $(function(){
      count_num = 0;
      $('.plan-list-chechkbox[type=checkbox]').change(function(){
        count_num = count_num + 1;
        if(($('.plan-list-chechkbox[type=checkbox]:checked').length > 1) && ($('.plan-list-chechkbox[type=checkbox]:checked').length < 4)){
          $(".plan-comparison-section").slideDown();

          var tempCounter = 0
          $('.plan-comparison-col').each(function () {
              tempCounter = tempCounter + 1
              if (tempCounter <= $('.plan-list-chechkbox[type=checkbox]:checked').length) {
                $(this).addClass('selected');
                $(this).show();
              }
          })
        }
        else {
          $('.plan-comparison-section').slideUp();
        }
        if(($('.plan-list-chechkbox[type=checkbox]:checked').length == 3)){
          count_num = 3;
          $('.plan-comparison-col').addClass('selected');
          $('.count-btn').text(count_num);
          $('.plan-list-chechkbox[type=checkbox]:not(:checked)').attr('disabled', 'disabled');
        }
        else{
          count_num = 2;
          $('.plan-comparison-col').removeClass('selected');
          $('.count-btn').text(count_num);
          $('.plan-list-chechkbox[type=checkbox]:not(:checked)').removeAttr('disabled');
        }
        if(($('.plan-list-chechkbox[type=checkbox]:checked').length == 2)){
          $('.plan-comparison-col').addClass('active');
          $('.plan-comparison-col.button-col').removeClass('active');
        }
        $('.remove-item-btn').click(function () {
          var target = $(this).attr('data-for')
          $(target).prop( "checked", false );
          $(this).closest('.plan-comparison-col').removeClass('selected');
          $(this).closest('.plan-comparison-col').removeClass('active');
          $(this).closest('.plan-comparison-col').hide();
          var totalCounts=$(".plan-comparison-listing-row").find(".plan-comparison-col.active").length;
          $('.count-btn').text(totalCounts);
          if(totalCounts < 2){
            $('.plan-comparison-section').slideUp();
          }
        });
      });
    });

    //Set Min and Max of Input according to Radio Button Checked
    $('input.value-change-radio[type=radio]').change(function(){
      console.log('this changed');

      if($(this).attr('data-limit') == 'first-limit'){
        $('input.value-input').val(10000000);
        $('input.min-value-input').attr('minlength','100000');
        $('input.min-value-input').val(100000);
        $('input.max-value-input').attr('maxlength','300000');
        $('input.max-value-input').val(300000);
        $(document).on('keypress','.min-value-input',function(e){
          if($(e.target).prop('value').length>=6){
            if(e.keyCode!=32)
            {return false} 
          }
          if($('input.min-value-input').val() < 100000 && $('input.max-value-input').val() > 300000){
            $('input.min-value-input').val() == '100000';
            $('input.max-value-input').val() == '300000';
          }
        });
        $('#limit_apply_btn').click(function () {
          $('.travel-insurance-listing-section').find('.filter-dropdown-text[data-match=""]').text('₹ 50,000')
        });
      }
      else if($(this).attr('data-limit') == 'second-limit'){
        $('input.value-input').val(30000000);
        $('input.min-value-input').attr('minlength','300000');
        $('input.min-value-input').val(300000);
        $('input.max-value-input').attr('maxlength','500000');
        $('input.max-value-input').val(500000);

        $('#limit_apply_btn').click(function () {
          $('.travel-insurance-listing-section').find('.filter-dropdown-text[data-match=""]').text('₹ 1,00,000')
        });
      }
      else if($(this).attr('data-limit') == 'third-limit'){
        $('input.value-input').val(50000000);
        $('input.min-value-input').attr('minlength','500000');
        $('input.min-value-input').val(500000);
        $('input.max-value-input').attr('maxlength','1000000');
        $('input.max-value-input').val(1000000);

        $('#limit_apply_btn').click(function () {
          $('.travel-insurance-listing-section').find('.filter-dropdown-text[data-match=""]').text('₹ 2,00,000')
        });
      }
      else if($(this).attr('data-limit') == 'fourth-limit'){
        $('input.value-input').val(100000000);
        $('input.min-value-input').attr('minlength','1000000');
        $('input.min-value-input').val(1000000);
        $('input.max-value-input').attr('maxlength','2000000');
        $('input.max-value-input').val(2000000);
        
        $('#limit_apply_btn').click(function () {
          $('.travel-insurance-listing-section').find('.filter-dropdown-text[data-match=""]').text('₹ 2,50,000')
        });
      }
      else if($(this).attr('data-limit') == 'fifth-limit'){
        $('input.value-input').val(200000000);
        $('input.min-value-input').attr('minlength','2000000');
        $('input.min-value-input').val(2000000);
        $('input.max-value-input').attr('maxlength','5000000');
        $('input.max-value-input').val(5000000);

        
        $('#limit_apply_btn').click(function () {
          $('.travel-insurance-listing-section').find('.filter-dropdown-text[data-match=""]').text('₹ 5,00,000')
        });
      }
      else if($(this).attr('data-limit') == 'sixth-limit'){
        $('input.min-value-input').attr('minlength','5000000');
        $('input.min-value-input').val(5000000);
        $('input.max-value-input').attr('maxlength','1000000');
        $('input.max-value-input').val(1000000);
      }
      else if($(this).attr('data-limit') == 'max-limit'){
        $('input.min-value-input').attr('minlength','1000000');
        $('input.max-value-input').attr('maxlength','');
        $('input.min-value-input').val(1000000);
        $('input.max-value-input').val('');

      }

      $('#limit_apply_btn').click(function(){
        // var commaNum = numberWithCommas(input_val);
        var minLimit = 500000;
        var maxLimit = 100000;
        // $("#idv-value").text('₹'+commaNum);
        if (($(".min-value-input").val() == '') || ($(".min-value-input").val() < minLimit) || ($(".min-value-input").val() > maxLimit)) {
            $(".min-value-input").val(500000);
        }
        if (($(".max-value-input").val() == '') || ($(".max-value-input").val() < minLimit) || ($(".max-value-input").val() > maxLimit)) {
            $(".max-value-input").val(1000000);
        }
    });
   });

   $('#limit_apply_btn').click(function() {
    console.log('in btn');
    if (($('input.value-input').val() < 10000000) || ($('input.value-input').val() > 200000000)) {
      $('input.value-input').val(10000000);
    }
   });

    $('#compare_btn').click(function() {
      $('#compare_count').trigger('click');
    });
    $('#compare_count').click(function () {
      const no_of_comparison = $('.count-btn').text();
      if(no_of_comparison == 3){
        $('#planComparisonModal').find('.modal-dialog').removeClass('wrapper-750');
        $('#planComparisonModal').find('.modal-dialog').addClass('wrapper-945');
      }
      else{
        $('#planComparisonModal').find('.modal-dialog').removeClass('wrapper-945');
        $('#planComparisonModal').find('.modal-dialog').addClass('wrapper-750');
      }  
    });

    $(".number-field").attr("maxlength", "10");
    $(".number-field").keypress(function(e) {
      var kk = e.which;
      if(kk < 48 || kk > 57)
        e.preventDefault();
    });

    $('.other-detail-area').find('.check-input:checkbox').change(function () {
        if($(this).is(':checked')){
          $('.other-detail-area').find('.no-check[type="radio"]').prop('checked', true);
        }
        else{
          $('.other-detail-area').find('.no-check[type="radio"]').prop('checked', false);
        }
    });

    $('.other-detail-area').find('.yes-check[type="radio"]').change(function () {
      if($(this).is(':checked')){
        $('.other-detail-area').find('.check-input:checkbox').prop('checked', false);
      }
    });

    $('.registration-no-input').focusout(function () {
      $(this).attr("placeholder", "Registration No");
    });

    // $('.other-detail-area').find('.no-check[type="radio"]').change(function () {
    //   if($(this).is(':checked')){
    //     $('.other-detail-area').find('.check-input:checkbox').prop('checked', true);
    //   }
    // });

    

    // $('.remove-item-btn').click(function () {
    //   console.log('remove clicked');
    //   $(this).closest('.plan-comparison-col').removeClass('selected');
    //   $(this).closest('.plan-comparison-col').hide();
    // });

    // $(".tab-change-btn").on("click", function() {
    //   var total = $(this).width();
    //   $('.tab-change-wrap').animate({scrollLeft:total},500);
    // });

    //Tab Change With Buttons
    $('.btnNext').click(function() {
      $('.tab-change-btn').parent().next('li').find('a').trigger('click');
    });
  
    $('.btnPrevious').click(function() {
      $('.nav-pills .active').parent().prev('li').find('a').trigger('click');
    });

    $('.btn-next').click(function(e){
      e.preventDefault();
      $("#basic_detil_form").valid();
      $("#personal_detil_form").valid();
      $("#address_form").valid();
      $("#car_detil_form").valid();
      var next_tab = $('.tab-change-wrap > .active').next('.tab-change-btn');
      if ($("#basic_detil_form").valid() && $("#personal_detil_form").valid() && $("#address_form").valid()) {
        if(next_tab.length>0){
          next_tab.attr('data-bs-toggle','tab');
          next_tab.trigger('click');
          $('.tab-change-wrap > .active').prev('.tab-change-btn').addClass('finished');
        }else{
          $('.nav-tabs li:eq(0) a').trigger('click');
        }
      }
    });
    $('.btn-prev').click(function(e){
      e.preventDefault();
      var next_tab = $('.tab-change-wrap > .active').prev('.tab-change-btn');
      next_tab.trigger('click');
    });

    $('.next-btn').click(function(e){
      e.preventDefault();

      var next_tab = $('.tab-change-wrap > .active').next('.tab-change-btn');
      if ($("#proposer_detil_form").valid() && $("#insured_detil_form").valid()) {
        if(next_tab.length>0){
          next_tab.attr('data-bs-toggle','tab');
          next_tab.trigger('click');
          $('.tab-change-wrap > .active').prev('.tab-change-btn').addClass('finished');
        }else{
          $('.nav-tabs li:eq(0) a').trigger('click');
        }
      }
    });

    $('.submit-form-btn').click(function(e){
      // e.preventDefault();
      if ($("#car_detil_form").valid()) {
        var url = 'proposal-summary.html'
        window.location = url;
      }
    });
    
    $('.submit-health-form-btn').click(function(e){
      // e.preventDefault();
      // if ($("#car_detil_form").valid()) {
        var url = 'health-proposal-summary.html'
        window.location = url;
      // }
    });
    $('.submit-term-form-btn').click(function(e){
      // e.preventDefault();
      // if ($("#car_detil_form").valid()) {
        var url = 'term-proposal-summary.html'
        window.location = url;
      // }
    });
    $('.submit-travel-form-btn').click(function(e){
      // e.preventDefault();
      // if ($("#car_detil_form").valid()) {
        var url = 'travel-proposal-summary.html'
        window.location = url;
      // }
    });
    $('.submit-cv-form-btn').click(function(e){
      // e.preventDefault();
      // if ($("#car_detil_form").valid()) {
        var url = 'commercial-vehicle-proposal-summary.html'
        window.location = url;
      // }
    });

    thirty_pc();
    $(window).bind('resize', thirty_pc);
    function thirty_pc() {
      var height = $(window).height();
      var thirtypc = (100 * height) / 100 - 145;
      thirtypc = parseInt(thirtypc) + 'px';
      $(".travel-proposal-detail-section .main-row").css('min-height', thirtypc);
    
      if ($(window).width() < 992) {
        $(".travel-proposal-detail-section .main-row").css('min-height', 'auto');
      }
    }

    //Language Dropdown Toggle
   $('.language-dropdown').click(function () {
    $(this).toggleClass('active');
   })
   $('.select-dropdown-box-li').click(function () {
    $(".language-dropdown").toggleClass('active');
   });

    //Addons Add btn
    $(".addons-apply-btn").click(function() {
      $('.value-block').addClass('addons-added');
      $('.addons-area').addClass('addons-added');
      $('.depreciation-area').addClass('addons-added');
    });

    $('.video-element').on('ended',function(){           
        $('.js-videos').slick('slickPlay');
    });

    //Bootstrap Tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    //Bootstrap Accordion Collapse
    if ($(window).width() >= 768) {  
      $('.accordion-button').each(function () {
          $(this).attr('data-bs-toggle','');
      })
    }else{
      $('.accordion-button').each(function () {
        $(this).addClass('collapsed')
        $(this).attr('data-bs-toggle','collapse');
      })
      $('.location-listing-area').each(function () {
        $(this).removeClass('show')
      })
    }
    
    $('.accordion-button-working').attr('data-bs-toggle','');
    $('.accordion-button-working').addClass('collapsed')
    $('.accordion-button-working').attr('data-bs-toggle','collapse');

    $('.select-tab-box').click(function() {
      console.log('click');
      $('.select-tab-box.active').removeClass('active');
        $(this).addClass('active');
    });

    $('.profile-button').click(function() {
      $('.profile-box-area').toggleClass('profile-active');
      setTimeout(function(){
        $('.profile-detail-area').toggleClass('open');
      },400);
    });

    // $('.js_link').click(function() {
    //   $(this).addClass('active');
    // })

    var windowWidth = $( window ).width();
    if (windowWidth < 768) {
        $('.js-hidden').each(function () {
        $(this).hide();
        })
    }
    $('.view-all-btn').click(function () {
        $('.js-hidden').slideDown();
        $('.view-all-btn').hide();
    })

    // $('.ui-menu-item').click(function () {
    //   console.log('inn');
    //     $('.tag-field-box').removeClass('active');
    // });

    // $("body").click(function(e){
    //   $('.tag-field').parent().removeClass('active');
    // });

    $('.apply-btn').on('click',function() {
      $(".dropdown-toggle").trigger("click");
    });


    //Custome Dropdown Select Bootstrap
    $(".select-dropdown-box li a").click(function () {
        var selText = $(this).text();
        $(this).closest('.input-field-box').find('.select-dropdown').val(selText);
        $(this).closest('.input-field-box').find('.select-dropdown').removeClass('show');
        $(this).closest('.input-field-box').find('.select-dropdown-box').removeClass('show');
    });

    //Autocomplete Declaration

    $("#tag1").autocomplete({
        source: ["GJ - 01 Ahmedabad", "GJ - 02 Mehsana", "GJ - 03 Rajkot", "GJ - 04 Bhavnagar","GJ - 06 Vadodara"],
        minLength: 0,
        appendTo: "#autoComplete1",
        select: showResult,
        classes: {
                "ui-autocomplete": "search-autocomplete"
        },
    }).focus(function () {
        $(this).autocomplete("search");
    })
    function showResult() {
        $('.tag-field-box').each(function () {
            $(this).removeClass('active');
            $(this).find('.tag-field').blur();
        });
    }

   /* $("#tag2").autocomplete({
        source: ["GJ - 01 Ahmedabad", "GJ - 02 Mehsana", "GJ - 03 Rajkot", "GJ - 04 Bhavnagar","GJ - 06 Vadodara"],
        minLength: 0,
        appendTo: "#autoComplete2",
        select: showResult,
        classes: {
                "ui-autocomplete": "search-autocomplete"
        },
    }).focus(function () {
        $(this).autocomplete("search");
    })*/
    function showResult() {
        $('.tag-field-box').each(function () {
            $(this).removeClass('active');
            $(this).find('.tag-field').blur();
        });
    }

    $("#tag3").autocomplete({
        source: ["GJ - 01 Ahmedabad", "GJ - 02 Mehsana", "GJ - 03 Rajkot", "GJ - 04 Bhavnagar","GJ - 06 Vadodara"],
        minLength: 0,
        appendTo: "#autoComplete3",
        select: showResult,
        classes: {
                "ui-autocomplete": "search-autocomplete"
        },
    }).focus(function () {
        $(this).autocomplete("search");
    })
    function showResult() {
        $('.tag-field-box').each(function () {
            $(this).removeClass('active');
            $(this).find('.tag-field').blur();
        });
    }

    $("#tag4").autocomplete({
      source: ["GJ - 01 Ahmedabad", "GJ - 02 Mehsana", "GJ - 03 Rajkot", "GJ - 04 Bhavnagar","GJ - 06 Vadodara"],
      minLength: 0,
      appendTo: "#autoComplete3",
      select: showResult,
      classes: {
              "ui-autocomplete": "search-autocomplete"
      },
  }).focus(function () {
      $(this).autocomplete("search");
  })
  function showResult() {
      $('.tag-field-box').each(function () {
          $(this).removeClass('active');
          $(this).find('.tag-field').blur();
      });
  }

  $("#tag5").autocomplete({
    source: ["GJ - 01 Ahmedabad", "GJ - 02 Mehsana", "GJ - 03 Rajkot", "GJ - 04 Bhavnagar","GJ - 06 Vadodara"],
    minLength: 0,
    appendTo: "#autoComplete3",
    select: showResult,
    classes: {
            "ui-autocomplete": "search-autocomplete"
    },
  }).focus(function () {
      $(this).autocomplete("search");
  })
  function showResult() {
      $('.tag-field-box').each(function () {
          $(this).removeClass('active');
          $(this).find('.tag-field').blur();
      });
  }

  $("#tag6").autocomplete({
    source: ["GJ - 01 Ahmedabad", "GJ - 02 Mehsana", "GJ - 03 Rajkot", "GJ - 04 Bhavnagar","GJ - 06 Vadodara"],
    minLength: 0,
    appendTo: "#autoComplete3",
    select: showResult,
    classes: {
            "ui-autocomplete": "search-autocomplete"
    },
  }).focus(function () {
    $(this).autocomplete("search");
  })
  function showResult() {
    $('.tag-field-box').each(function () {
        $(this).removeClass('active');
        $(this).find('.tag-field').blur();
    });
  }

    //Autocomplete Input Focus
    $(".tag-field").focus(function(e){
      $(this).parent('.tag-field-box').addClass('active');
    });
    $(".tag-field").focusout(function() {
      $(this).parent('.tag-field-box').removeClass('active');
    });

    //Input Field
    $('.input-field').change(function(e){
        if ((e.val) !== ''){
            $(this).addClass('input-change');
        }else if((e.val) == ''){
          $(this).removeClass('input-change');
        }
    })
    //Prevent Dropdown close on click inside
    $('.dropdown-menu').on('click', function(e) {
      e.stopPropagation();
    });

    //Click active
    $('.dropdown-list-col').click(function () {
      $('.dropdown-list-col').removeClass('active');
      $(this).addClass('active');
      $('.sort-dropdown-box').removeClass('show');
      $('.sort-dropdown-toggle').removeClass('show');
    });

    //Get Dropdown value 
    $('#js-dropdown-links-1 .js_click_link').click(function(){
      $('.input-field-box').find('#dropdownMenuButton4 .js-dropdown-value').text($(this).text());
    });
    $('#js-dropdown-links-2 .js_click_link').click(function(){
      $('.result-filter-box-area').find('#dropdownMenuButton4 .js-dropdown-value').text($(this).text());
    });
    $('#js-dropdown-links-3 .js_click_link').click(function(){
      $('.result-filter-box-area').find('#dropdownMenuButton5 .js-dropdown-value').text($(this).text());
    });
    $('#js-dropdown-links-4 .js_click_link').click(function(){
      $('.result-filter-box-area').find('#dropdownMenuButton6 .js-dropdown-value').text($(this).text());
    });

    //Tab View Change For Without Car Number 
    var carBrand
    var carModel
    var carFuelType
    var carVariant
    $('input[type=radio][name=radio-tab-group-1]').change(function() {
      $('#nav-model-tab').attr('data-bs-toggle','tab');
      $('#nav-model-tab').trigger('click');
      if( $(this).is(":checked") ){
        var val = $(this).parent().find('.radio-name-text').text();
          carBrand = val;
        $('#nav-make-tab').addClass('visited');
        $('#nav-make-tab-2').addClass('visited');
      }
      if ($(window).width() > 768) {
        if( $(this).is(":checked") ){
          $('#nav-make-tab').text((val));
        }        
      }
    });
    $('input[type=radio][name=radio-tab-group-2]').change(function() {
      $('#nav-fuel-tab').attr('data-bs-toggle','tab');
      $('#nav-fuel-tab').trigger('click');
      if( $(this).is(":checked") ){
        var val = $(this).parent().find('.radio-text').text();
          carModel = val;
        $('#nav-model-tab').addClass('visited');
      }
      if ($(window).width() > 768) {
        if( $(this).is(":checked") ){
          $('#nav-model-tab').text((val));
          $('#nav-model-tab').addClass('visited');
        }
      }
    });
    $('input[type=radio][name=radio-tab-group-3]').change(function() {
      $('#nav-variant-tab').attr('data-bs-toggle','tab');
      $('#nav-variant-tab').trigger('click');
      if( $(this).is(":checked") ){
        var val = $(this).parent().find('.radio-text').text();
          carFuelType = val;
        $('#nav-fuel-tab').addClass('visited');
      }
      if ($(window).width() > 768) {
        if( $(this).is(":checked") ){
          $('#nav-fuel-tab').text((val));
          $('#nav-fuel-tab').addClass('visited');
        }
      }
    });
    $('input[type=radio][name=radio-tab-group-4]').change(function() {
      if ($(window).width() > 768) {
        if( $(this).is(":checked") ){
          var val = $(this).parent().find('.radio-text').text();
          $('#nav-variant-tab').text((val));
          $('#nav-variant-tab').addClass('visited');
        }
      }
      if( $(this).is(":checked") ){
        var val = $(this).parent().find('.radio-text').text();
        carVariant = val;
        var inputValue =  carBrand+', '+ carModel+', '+ carFuelType+', '+ carVariant;

        var modalName = $('#selectCarModalBackBtn').attr('data-modal-name');
        $('.SelectCarDetail-modal').hide('slow');
        $('.'+modalName).show();
        $('.'+modalName).find('.js-detail').val(inputValue);

        if ($('.js-detail').val !== '') {
          $('.WithoutCarNumber-modal').find('.js-detail').addClass('editable-input');    
        }
      }
    });

    //Tab View Change For Without Car Number 
    var newCarBrand
    var newCarModel
    var newCarFuelType
    var newCarVariant
    $('input[type=radio][name=radio-tab-group-new-1]').change(function() {
      $('#nav-model-tab-2').attr('data-bs-toggle','tab');
      $('#nav-model-tab-2').trigger('click');
      if( $(this).is(":checked") ){
        var val = $(this).parent().find('.radio-name-text').text();
        newCarBrand = val;
        $('#nav-make-tab-2').addClass('visited');
      }
      if ($(window).width() > 768) {
        if( $(this).is(":checked") ){
          $('#nav-make-tab-2').text((val));
          $('#nav-make-tab-2').addClass('visited');
        }        
      }
    });
    $('input[type=radio][name=radio-tab-group-new-2]').change(function() {
      $('#nav-fuel-tab-2').attr('data-bs-toggle','tab');
      $('#nav-fuel-tab-2').trigger('click');
      if( $(this).is(":checked") ){
        var val = $(this).parent().find('.radio-text').text();
        newCarModel = val;
        $('#nav-model-tab-2').addClass('visited');
      }
      if ($(window).width() > 768) {
        if( $(this).is(":checked") ){
          $('#nav-model-tab-2').text((val));
          $('#nav-model-tab-2').addClass('visited');
        }
      }
    });
    $('input[type=radio][name=radio-tab-group-new-3]').change(function() {
      $('#nav-variant-tab-2').attr('data-bs-toggle','tab');
      $('#nav-variant-tab-2').trigger('click');
      if( $(this).is(":checked") ){
        var val = $(this).parent().find('.radio-text').text();
        newCarFuelType = val;
        $('#nav-fuel-tab-2').addClass('visited');
      }
      if ($(window).width() > 768) {
        if( $(this).is(":checked") ){
          $('#nav-fuel-tab-2').text((val));
          $('#nav-fuel-tab-2').addClass('visited');
        }
      }
    });
    $('input[type=radio][name=radio-tab-group-new-4]').change(function() {
      if ($(window).width() > 768) {
        if( $(this).is(":checked") ){
          var val = $(this).parent().find('.radio-text').text();
          $('#nav-variant-tab-2').text((val));
          $('#nav-variant-tab-2').addClass('visited');
        }
      }
      if( $(this).is(":checked") ){
        $('#nav-variant-tab-2').addClass('visited');
        var val = $(this).parent().find('.radio-text').text();
        newCarVariant = val;
        var inputValue =  newCarBrand+', '+ newCarModel+', '+ newCarFuelType+', '+ newCarVariant;

        var modalName = $('#selectCarModalBackBtn').attr('data-modal-name');
        $('.SelectCarDetail-modal').hide('slow');
        $('.'+modalName).show();
        $('.'+modalName).find('.js-detail').val(inputValue);

        if ($('.js-detail').val !== '') {
          $('.NewCar-modal').find('.js-detail').addClass('editable-input');    
        }
      }
    });


    //Tab View Change For My iBuddy 
    var CarBrandMyiBuddy
    var CarModelMyiBuddy
    var CarFuelTypeMyiBuddy
    var CarVariantMyiBuddy

    $('input[type=radio][name=radio-tab-after-submit]').change(function() {
      $('#nav-model-tab-3').attr('data-bs-toggle','tab');
      $('#nav-model-tab-3').trigger('click');
      if( $(this).is(":checked") ){
        var val = $(this).parent().find('.radio-name-text').text();
        CarBrandMyiBuddy = val;
        $('#nav-make-tab-3').addClass('visited');
      }
      if ($(window).width() > 768) {
        if( $(this).is(":checked") ){
          $('#nav-make-tab-3').text((val));
          $('#nav-make-tab-3').addClass('visited');
        }        
      }
    });
    $('input[type=radio][name=radio-tab-after-submit-2]').change(function() {
      $('#nav-fuel-tab-3').attr('data-bs-toggle','tab');
      $('#nav-fuel-tab-3').trigger('click');
      if( $(this).is(":checked") ){
        var val = $(this).parent().find('.radio-text').text();
        CarModelMyiBuddy = val;
        $('#nav-model-tab-3').addClass('visited');
      }
      if ($(window).width() > 768) {
        if( $(this).is(":checked") ){
          $('#nav-model-tab-3').text((val));
          $('#nav-model-tab-3').addClass('visited');
        }
      }
    });
    $('input[type=radio][name=radio-tab-after-submit-3]').change(function() {
      $('#nav-variant-tab-3').attr('data-bs-toggle','tab');
      $('#nav-variant-tab-3').trigger('click');
      if( $(this).is(":checked") ){
        var val = $(this).parent().find('.radio-text').text();
        CarFuelTypeMyiBuddy = val;
        $('#nav-fuel-tab-3').addClass('visited');
      }
      if ($(window).width() > 768) {
        if( $(this).is(":checked") ){
          $('#nav-fuel-tab-3').text((val));
          $('#nav-fuel-tab-3').addClass('visited');
        }
      }
    });
    $('input[type=radio][name=radio-tab-after-submit-4]').change(function() {
      if ($(window).width() > 768) {
        if( $(this).is(":checked") ){
          var val = $(this).parent().find('.radio-text').text();
          $('#nav-variant-tab-3').text((val));
          $('#nav-variant-tab-3').addClass('visited');
        }
      }
      if( $(this).is(":checked") ){
        $('#nav-variant-tab-3').addClass('visited');
        var val = $(this).parent().find('.radio-text').text();
        CarVariantMyiBuddy = val;
        var inputValue =  CarBrandMyiBuddy+', '+ CarModelMyiBuddy+', '+ CarFuelTypeMyiBuddy+', '+ CarVariantMyiBuddy;

        var modalName = $('#selectCarModalBackBtn').attr('data-modal-name');
        $('.SelectCarDetail-modal').hide('slow');
        $('.'+modalName).show();
        $('.'+modalName).find('.js-detail').val(inputValue);

        if ($('.js-detail').val !== '') {
          $('.NewCar-modal').find('.js-detail').addClass('editable-input');    
        }
      }
    });
    

    //-------------------------------------Slider JS------------------------------------
    //Slider area
    $('.slider-area').slick({
      slidesToShow: 3,
      slidesToScroll: 3,
      autoplay: true,
      autoplaySpeed: 2000,
      arrows: false,
      dots: true,

      responsive: [
          {
              breakpoint: 1200,
              settings: {
                  slidesToShow: 3,
                  slidesToScroll: 3,
              }
          },
          {
              breakpoint: 992,
              settings: {
                  slidesToShow: 2,
                  slidesToScroll: 3
              }
          },
          {
              breakpoint: 768,
              settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2
              }
          },
          {
              breakpoint: 480,
              settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1
              }
          }
      ]
    });
    //js videos slider
    $('.js-videos').slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: false,
      autoplaySpeed: 2000,
      arrows: true,
      dots: false,

      responsive: [
          {
              breakpoint: 1200,
              settings: {
                  slidesToShow: 4,
                  slidesToScroll: 1,
              }
          },
          {
              breakpoint: 992,
              settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1
              }
          },
          {
              breakpoint: 768,
              settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1,
                  arrows: false
              }
          },
          {
              breakpoint: 575,
              settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1
              }
          },
          {
              breakpoint: 374,
              settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1
              }
          }
      ]
    });
    //Image Box area Slider
    $('.image-box-area').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      asNavFor: '.slider-nav'
    });
    //Nav Box Area Slider
    $('.nav-box-area').slick({
      slidesToShow: 4,
      slidesToScroll: 4,
      asNavFor: '.slider-for',
      dots: false,
      arrows: false,
      centerMode: true,
      focusOnSelect: true,
      vertical:true,
      verticalSwiping: true,

      responsive: [
          {
              breakpoint: 768,
              settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  centerMode: true,
                  slidesToShow: 1,
                  variableWidth: false,
                  infinite: true,
                  vertical: false,
                  verticalSwiping: false,
                  autoplay: true
              }
          }
      ]
    });
    //Banner Slider
    $('.bannersliderjs').slick({
      dots: true,
      speed: 800,
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: true,
      fade: true,
      cssEase: 'linear',
      autoplay: true,
      autoplaySpeed: 2000,
      arrows : false
    });
    //Product Slider
    $('.product-slider').slick({
      infinite: false,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: false,
      arrows: true,
      dots: false, 
    });
    //Product Slider Small
    $('.product-slider-small').slick({
      infinite: false,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: false,
      arrows: true,
      dots: false,

      responsive: [
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1
            }
        },
        {
          breakpoint: 375,
          settings: {
              slidesToShow: 1,
              slidesToScroll: 1
          }
      }
    ]
    });
    //Features slider
    if($(window).width() < 575){
      $('.features-slider').slick({
        infinite: false,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: false,
        arrows: false,
        dots: false, 
      });
    }

    //Footer accordion 
    $(".js_accordion").click(function() {
      $(this).toggleClass('active');
    });

    $( ".value_btn" ).click(function() {
      var tel = $('#tel').val();
      console.log('click');
      console.log(tel);
    });

    $('#tel').on("keyup", function() {
      this.value = this.value.replace(/ /g,'');
      var number = this.value;
      this.value = number.replace(/\B(?=(\d{5})+(?!\d))/g, " ");
    });

    //Toggle on click
    $('.js_menu').on('click', function () {
      $('body').addClass('active');
      $('html').addClass('active');
    })
    $('.js_modal_close').on('click', function () {
      $('body').removeClass('active');
      $('html').removeClass('active');
    })

    //Radio checked
    $('input[name=radio-group3]').click(function () {
      if (this.id == "inlineRadiobox8") {
        console.log('id matched');
          $(".WithoutCarNumber-modal .modal-profile-box").hide();
          $(".NewCar-modal .modal-profile-box").hide();
      } else {
          $(".WithoutCarNumber-modal .modal-profile-box").show();
          $(".NewCar-modal .modal-profile-box").show();
      }
    });

    //click active
    var selector = '.js_active';
    $(selector).click(function() {
      $(selector).removeClass('active');
      $(this).addClass('active');
    });
 
    //Read more toggle js
    var expand = '.expand-text';
    $(expand).click(function() {
      $('.hidden-text').addClass('show');
      $(this).addClass('disable');
    });

    //Set image & location on initial load
    var img = $('.js_box').first().attr('data-img-src');

    $('.preview-image').attr("src", img);
    var location = $('.js_box').first().attr('data-location');
    $(".map-location").attr('href',location);

    //Preview Image JS
    $( ".js_box" ).click(function() {
          var img = $(this).attr('data-img-src');
          $('.preview-image').attr("src", img);
          var location = $(this).attr('data-location');
          $(".map-location").attr('href',location);
    });

    
    //Set image & location on initial load
    var location = $('.js_box').first().attr('data-redirect');
    $(".redirect").attr('href',location);

    //Preview Image JS
    $( ".js_box" ).click(function() {
          var location = $(this).attr('data-redirect');
          $(".redirect").attr('href',location);
    });

    $(".modal-toggle-btn").on('click', function () {
      $('body').addClass('modal-active');
      $('.navbarLink').removeClass('active');
      $('.overlay-appear').removeClass('active'); 
      $('.hamburger').removeClass('active');
    });

    //My Burger JS
    $('.overlay-appear').on('click', function () {
      $(this).removeClass('active');
      $('#sidebar').removeClass('active');
      $('body').removeClass('active');
      $('.overlay').fadeOut();
      $('#sidebarCollapse').toggleClass('active');
      $('html').removeClass('active');
      $('.dropdown-icon').removeClass('active');
      $('.dropdown-menu').removeClass('show');
    });
  
    //Burger Menu JS
    $('#dismiss, .overlay').on('click', function () {
        $('#sidebar').removeClass('active');
        $('body').removeClass('active');
        $('.mainmainubtn').removeClass('active');
        $('btnjs').removeClass('active');
        $('.overlay').fadeOut();
        
    });
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $('body').toggleClass('active');
        $('.mainmainubtn').toggleClass('active');
        $('.btnjs').toggleClass('active');
        $('.overlay').fadeIn();
        $('.overlay-appear').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
    $('.notification-btn').on('click', function () {
      setTimeout(function(){
        $('body').toggleClass('notification_active');
      });
    });
    
    $('.abc').on('click', function () {
        $('body').removeClass('notification_active');
        $('#sidebar').removeClass('active');
        $('body').removeClass('active');
        $('btnjs').removeClass('active');
    });
 
    //  $('body').on('click', function () {
    //    $('body').removeClass('notification_active');
    //    $('.common-dropdown').removeClass('dropdown-open');
    // });

  //Burger Menu JS
    $('#dismiss1, .overlay').on('click', function () {
        $('.menuicon').removeClass('active');
        $('.navbarLink1').removeClass('active');
        $('body').removeClass('active1');
        $('.overlay').fadeOut();
    });
    $('#sidebarCollapse1').on('click', function () {
        $('.menuicon').toggleClass('active');
        $('.navbarLink1').toggleClass('active');
        $('body').toggleClass('active1');
        $('.overlay').fadeIn();
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
    $('.hamburger').on('click', function () {
        $(this).toggleClass('active');
        $('html').toggleClass('active');
        $('.dropdown-icon').removeClass('active');
        $('.dropdown-menu').removeClass('show');
    });
    // $(".navbar-nav li a").on('click', function () {
    //   $('body').removeClass('active');
    //   $('.hamburger').removeClass('active');  
    //   $('.navbarLink').removeClass('active'); 
    // });
    
	
	
    $(function(){
      if($(window).width() < 992){
        $( ".dropdown-link-box" ).click(function() {
          $(this).removeClass('js_link');
          if ($(this).find('.dropdown-menu').hasClass('show')) {
            $(this).find('.dropdown-menu').slideUp();
            $(this).removeClass('active');
            $(this).find('.dropdown-menu').removeClass('show');
          }else{
            $('.dropdown-menu.show').slideUp();
            $('.dropdown-menu.show').parent('.dropdown-link-box').removeClass('active');
            $('.dropdown-menu.show').removeClass('show');
            $(this).addClass('active');
            $(this).find('.dropdown-menu').slideDown();
            $(this).find('.dropdown-menu').addClass('show');
          }
        });
      }
    });
    
    //On click focus Input
    $('.verify-your-account').on('shown.bs.modal', function () {
      $('#input-otp').get(0).focus()
    });  
    
    $('.edit-num-btn').click(function() {
      $('#findBuddyInput').get(0).focus()
    });

    $('.extra-btn').click(function() {
      $(this).text('Resend OTP');
      $(this).closest('.legal-form-box').find('.btn-hidden').removeClass('btn-hidden');
      $('#input-otp').get(0).focus()
    });

    $('#verify-otp').click(function() {
      $('.extra-btn').addClass('verified');
      $('.extra-btn').text('Verified');
      $(this).closest('.field-box').addClass('btn-hidden');
    });

    $('.browse-btn').click(function() {
      var file_name = $(this).closest('.file-upload-wrap').find('#formFile').val();
      console.log(file_name);
      $(this).closest('.file-upload-wrap').find('.browse-file-name').text(file_name);
    });

    //Sync contact Leads Calender Click Active
    $('.lead-box').click(function () {
        $('.lead-box.active').removeClass('active');
        $(this).addClass('active');
    })

    //File Input Selected File name
    $('.verifying-detail-box').hide();
    $('#pan_detail').change(function(e) {
      var file = e.target.files[0].name;
      console.log(file);
      $(this).closest('.file-upload-wrap').find('.browse-file-name').addClass('file-uploaded');
      $(this).closest('.file-upload-wrap').find('.verifying-detail-box').show().delay(2000).fadeOut(function () {
        $('#pan_detail').closest('.field-box').find('.inner-detail-main-box').addClass('success');
        $(this).closest('.inner-detail-main-box').find('.field-icon-box').removeClass('reset');
        $(this).closest('.inner-detail-main-box').find('.doc-number').removeClass('reset');
        $(this).closest('.inner-detail-main-box.success').find('.browse-file-name').contents()[0].nodeValue = "Your PAN number is:";
        // $(this).closest('.inner-detail-main-box.failed').find('.browse-file-name').contents()[0].nodeValue = "Your PAN number is:";
      });
      $(this).closest('.file-upload-wrap').find('.browse-file-name').contents()[0].nodeValue = file;
      $(this).closest('.file-upload-wrap').parent().find('.document-name').text(file);
    });
    $('#adhar_detail').change(function(e) {
      var file = e.target.files[0].name;
      $(this).closest('.file-upload-wrap').find('.browse-file-name').contents()[0].nodeValue = file;
      $(this).closest('.file-upload-wrap').find('.browse-file-name').addClass('file-uploaded');
      
    });
    $('#education_certification_detail').change(function(e) {
      var file = e.target.files[0].name;
      $(this).closest('.file-upload-wrap').find('.browse-file-name').contents()[0].nodeValue = file;
      $(this).closest('.file-upload-wrap').find('.browse-file-name').addClass('file-uploaded');
    });
    $('#pan_detail').change(function(e) {
      var file = e.target.files[0].name;
      $(this).closest('.file-upload-wrap').find('.browse-file-name').contents()[0].nodeValue = file;
      $(this).closest('.file-upload-wrap').find('.browse-file-name').addClass('file-uploaded');
    });

    $('#posp_bank_account').change(function(e) {
      var file = e.target.files[0].name;
      $(this).closest('.file-upload-wrap').find('.browse-file-name').contents()[0].nodeValue = file;
      $(this).closest('.file-upload-wrap').find('.browse-file-name').addClass('file-uploaded');
    });
    $('#nominee_pan_card').change(function(e) {
      var file = e.target.files[0].name;
      $(this).closest('.file-upload-wrap').find('.browse-file-name').contents()[0].nodeValue = file;
      $(this).closest('.file-upload-wrap').find('.browse-file-name').addClass('file-uploaded');
    });
    $('#nominee_bank_account').change(function(e) {
      var file = e.target.files[0].name;
      $(this).closest('.file-upload-wrap').find('.browse-file-name').contents()[0].nodeValue = file;
      $(this).closest('.file-upload-wrap').find('.browse-file-name').addClass('file-uploaded');
    });

    $('#contact_detail').change(function(e) {
      var file = e.target.files[0].name;
      $(this).closest('.file-upload-wrap').find('.browse-file-name').contents()[0].nodeValue = file;
      $(this).closest('.file-upload-wrap').find('.browse-file-name').addClass('file-uploaded');
    });


    //Remove Document On Button Click
    $('.remove-doc-btn').click(function(e) {
      console.log('remove clicked');
      $(this).closest('.document-download-remove-area').parent().find('.field-icon-box').addClass('reset');
      $(this).closest('.document-download-remove-area').parent().find('.browse-btn').addClass('reset');
      $(this).closest('.document-download-remove-area').parent().find('.doc-number').addClass('reset');
      $(this).closest('.document-download-remove-area').parent().find('.browse-file-name').contents()[0].nodeValue = "Browse a file";
      $(this).closest('.document-download-remove-area').parent().find('.browse-file-name').removeClass('file-uploaded');
      $(this).closest('.document-download-remove-area').parent().removeClass('success');
    });

    //Upload Cheque Radio Select
    $('.bank-detail-box').hide();
    $('.bank-detail-nominee-box').hide();

    //Bank Detail Radio Select
    $('input.bank-detail').change(function(e) {
      $(this).closest('.field-box').parent().find('.upload-cheque-detail-box').hide();
      $(this).closest('.field-box').parent().find('.bank-detail-box').show();
    });
    $('input.upload-cheque').change(function(e) {
      $(this).closest('.field-box').parent().find('.bank-detail-box').hide();
      $(this).closest('.field-box').parent().find('.upload-cheque-detail-box').show();
    });
    
    $('input.upload-cheque-nominee').change(function(e) {
      $(this).closest('.field-box').parent().find('.upload-cheque-nominee-box').show();
      $(this).closest('.field-box').parent().find('.bank-detail-nominee-box').hide();
    });
    $('input.bank-detail-nominee').change(function(e) {
      $(this).closest('.field-box').parent().find('.bank-detail-nominee-box').show();
      $(this).closest('.field-box').parent().find('.upload-cheque-nominee-box').hide();
    });

    //POSP Form Tab Change
    $('.js_control_next').click(function(){
      $('.tab-control-panel-area').find('.nav-tabs > .active').next('.tab-change-btn').trigger('click');
      $('.tab-control-panel-area').find('.nav-tabs > .active').prev('.tab-change-btn').addClass('visited');
    });
    
    $('.js_control_prev').click(function(){
        $('.tab-control-panel-area').find('.nav-tabs > .active').prev('.tab-change-btn').trigger('click');
        $('.tab-control-panel-area').find('.nav-tabs > .active').next('.tab-change-btn').removeClass('visited');
    });

    $('.btn-temp-disable').off('click');

    //Language Change Button
    $('.language-change-btn').click(function () {
      $('.language-change-btn.active').removeClass('active');
        $(this).addClass('active');
    })

    //Show English/Hindi contents bansed on Swith toggle
    $('.content-type.hindi').hide();
    $('#toggle_hindi').click(function() {
      $('.content-type.hindi').show();
      $('.content-type.english').hide();
    });
    $('#toggle_english').click(function() {
      $('.content-type.english').show();
      $('.content-type.hindi').hide();
    });
    //Profile Picture Toggle
    $('.profile-picture-box').hide();
    $('.js_profile_btn').click(function(){
      $(this).parent().find('.profile-picture-box').show();
      $(this).hide();
    });
    $('.js_show_live').click(function(){
      $(this).closest('.profile-picture-box').hide();
      $(this).closest('.click-photo-box').find('.js_profile_btn').show();
    });

    $('input.file-input').change(function(e){
      var file_title = e.target.files[0].name;
      console.log("file-title =" + file_title);
      var shortText = jQuery.trim(file_title).substring(0, 10).split(" ").slice(0, -1).join(" ") + "...";

      console.log("shorten =" + shortText);
    });
    
    
    $("input.subscription-plan-input").change(function(){
      $('.plan-box-label').removeClass('active');
      $(this).closest('.plan-box-label').addClass('active');
    });

    //Date Range Picker 
    $(function() {
      $('input[name="daterange"]').daterangepicker({
        opens: 'left'
      }, function(start, end, label) {
        console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
      });
    });


    //Quiz Question Control
    $('.js_next_control').click(function () {
      console.log('this clicked');
      $(this).closest('.question-control-area').parent().find('.second-box.btn-hidden').removeClass('btn-hidden');
      $(this).closest('.question-control-area').parent().find('.first-box').addClass('btn-hidden');
      $(this).closest('.question-control-area').find('.js_prev_control').removeClass('btn-hidden');
    });
    $('.js_prev_control').click(function () {
      console.log('this clicked');
      $(this).closest('.question-control-area').parent().find('.second-box').addClass('btn-hidden');
      $(this).closest('.question-control-area').parent().find('.first-box.btn-hidden').removeClass('btn-hidden');
      $(this).addClass('btn-hidden');
    });


    //Multiple Dropdown Click JS

    
    // $("ul.dropdown-menu [data-toggle='dropdown']").on("click", function(event) {
    //     event.preventDefault();
    //     event.stopPropagation();

    //     $(this).siblings().toggleClass("show");
    
    //     if (!$(this).next().hasClass('show')) {
    //       $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
    //     }
    //     $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
    //       $('.submenu .show').removeClass("show");
    //     });
    // });  

    $('.bannersliderjs').slick({
      dots: true,
      infinite: false,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
    });  


});

