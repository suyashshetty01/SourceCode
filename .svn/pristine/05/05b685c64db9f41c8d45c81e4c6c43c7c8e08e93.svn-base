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

    setTimeout(function(){
      $('.language-dropdown').show();
    }, 200);
   
    if ($(window).width() < 992) {
     $('.car-proposal-policy-info.policy-info-listing').addClass('btn-hidden');
     $('.summary-info-wrapper').addClass('btn-hidden');
    }

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
    })

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
    $('.submit-form-btn').click(function(e){
      // e.preventDefault();
      if ($("#car_detil_form").valid()) {
        var url = 'proposal-summary.html'
        window.location = url;
      }
    });

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

