var Product_id
var vehicleMake
var varientArray = [];
var fuelname
var UpdatedFuelList
var filterRTO = ["MH", "GJ", "KA", "DL", "UP"];
var rto_data = [];
var Vehicle_ID;
var ProductTypeNewrenew;
var RegisterintheName = 'individual';
var IsFastLane = "no";
var Product_type;
var RegistrationNumber;
var RTO;
var regno_rtocode = '';
var is_external_bifuel;
var FuelType_;
var external_bifuel_type ="";
var externalFuelTypevalue;
var show_agent = false;
var ss_id;
var agent_name;
var agent_email;
var agent_type = '';
var agent_mobile;
var fba_id = "";
var sub_fba_id;
var Is_Employee = false;
var utm_source;
var utm_medium;
var utm_campaign;
var campaign_id;
var UID;
var make_allowed = [];
var is_misp = "";
var ip_address;
var ip_respone;
var geo_lat;
var geo_long;
var ip_city_state;
var mainplantype;
var Breakin_status;
var udid ='';
var TPPreviousINS;
var policyExpiryDate;
var Fastlane =true;
var bifuelvalid;
var extfuelvalue;
var vehicleInsuranceSubtype;
var vehicleNcbCurrent = 0;
var NoClaimBonusStat = 'no';
var PreviousPolicyStatus = '';
var fastlane_data;
var fastlane_product_name ="";
var makename;
var Model;
var Vehicle_Variant;
var RTO_Id;
var selected_vehicle_class ="";
var vehicle_class_short_name;
var vehicle_class_data;
var VehicleSubClass;
var VariantList;
var ModelID;
var vehicleClassData;
var vehicleClassCode;
var vehicleClassValue;
var Premium_initiate=[];
var srn;
var client_id;
var ibuddy = false;
var buddyMobile = '';
var fastlaneRegistrationDate;
var fastlaneManfDate;
$(document).ready(function () {
	Product_id =1;
	setProductID(Product_id)
	getRto();
	AppendDate('renew');
	horizon_get_session();
	getClientBrowserDetails();
	if($( window ).width() < 767){
		$('.profile-popup').remove();
	}
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
		if($('#tag2').val().length >=2 ){
			$(this).parent('.tag-field-box').addClass('active');
		}
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
    // $('input[type=radio][name=radio-tab-group-1]').change(function() {
	// $(document).on("change", $('input[type=radio][name=radio-tab-group-1]'),function() {
	function makeOnChange(){
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
	};
    // });
    /*$('input[type=radio][name=radio-tab-group-2]').change(function() {
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
    });*/

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
function AppendDate(type){
	$('#WithoutCarNumberRegistrationDate').empty();
	var currentYear = new Date().getFullYear();
	// if(type === 'renew'){
		// currentYear =currentYear-1
	// }
	var startYear = 1997;
	yearsToDisplay = currentYear - (startYear - 1);
	for(i=0;i<yearsToDisplay;i++){
	$('#WithoutCarNumberRegistrationDate').append("<li class='dropdown-list-col select-dropdown-box-li' id='year_"+startYear+"'>"+
													   " <a class='dropdown-list-link select-dropdown-box-link'>"+startYear+"</a>"+
													"</li>")
	startYear++;
	}
}

function setProductID(productid){
	$('.forCV').hide();
	$("#MakeModelVarientFuel").removeAttr("disabled"); 
	Product_id = productid-0;
	if(Product_id === 10){
	Product_type ="BIKE";
	 vehicleMake = [
			{
				"ID": 1,
				"Make_Name": "KTM",
				"logo": "KTM"
			},
			{
				"ID": 2,
				"Make_Name": "YAMAHA",
				"logo": "YAMAHA"
			},
			{
				"ID": 3,
				"Make_Name": "HERO MOTOCORP",
				"logo": "HERO_MOTOCORP"
			},
			{
				"ID": 4,
				"Make_Name": "DUCATI",
				"logo": "DUCATI"
			},
			  {
				"ID": 5,
				"Make_Name": "SUZUKI",
				"logo": "SUZUKI"
			  },
			  {
				"ID": 6,
				"Make_Name": "BAJAJ",
				"logo": "BAJAJ"
			  },
			  {
				"ID": 7,
				"Make_Name": "KAWASAKI",
				"logo": "KAWASAKI"
			  },
			  {
				"ID": 8,
				"Make_Name": "EKO",
				"logo": "EKO"
			  },
			  {
				"ID": 9,
				"Make_Name": "GLOBAL",
				"logo": "GLOBAL"
			  },
			  {
				"ID": 10,
				"Make_Name": "HARLEY DAVIDSON",
				"logo": "HARLEY_DAVIDSON"
			  },
			  {
				"ID": 11,
				"Make_Name": "HAYABUSA",
				"logo": "HAYABUSA"
			  },
			  {
				"ID": 12,
				"Make_Name": "HERO HONDA",
				"logo": "HERO_HONDA"
			  },
			  {
				"ID": 13,
				"Make_Name": "HONDA MOTORS",
				"logo": "HONDA_MOTORS"
			  },
			  {
				"ID": 14,
				"Make_Name": "LML",
				"logo": "LML"
			  },
			  {
				"ID": 15,
				"Make_Name": "MAHINDRA",
				"logo": "MAHINDRA"
			  },
			  {
				"ID": 16,
				"Make_Name": "PIAGGIO",
				"logo": "PIAGGIO"
			  },
			  {
				"ID": 17,
				"Make_Name": "ROYAL ENFIELD",
				"logo": "ROYAL_ENFIELD"
			  },
			  {
				"ID": 18,
				"Make_Name": "TRIUMPH",
				"logo": "TRIUMPH"
			  },
			  {
				"ID": 19,
				"Make_Name": "TVS",
				"logo": "TVS"
			  },
			  {
				"ID": 20,
				"Make_Name": "VIBGYOR",
				"logo": "VIBGYOR"
			  },
			  {
				"ID": 21,
				"Make_Name": "KINETIC",
				"logo": "KINETIC"
			  },
			  {
				"ID": 22,
				"Make_Name": "AMPERE",
				"logo": "AMPERE"
			  },
			  {
				"ID": 23,
				"Make_Name": "HERO ELECTRIC",
				"logo": "HERO_ELECTRIC"
			  },
			  {
				"ID": 24,
				"Make_Name": "UM BIKES",
				"logo": "UM_BIKES"
			  },
			  {
				"ID": 25,
				"Make_Name": "BMW",
				"logo": "BMW"
			  },
			  {
				"ID": 26,
				"Make_Name": "APRILIA",
				"logo": "APRILIA"
			  },
			  {
				"ID": 27,
				"Make_Name": "FAB MOTORS",
				"logo": "FAB_MOTORS"
			  },
			  {
				"ID": 28,
				"Make_Name": "BENELLI",
				"logo": "BENELLI"
			  },
			  {
				"ID": 29,
				"Make_Name": "CAGIVA",
				"logo": "CAGIVA"
			  },
			  {
				"ID": 30,
				"Make_Name": "ELECTROTHERM",
				"logo": "ELECTROTHERM"
			  },
			  {
				"ID": 31,
				"Make_Name": "HERO",
				"logo": "HERO"
			  },
			  {
				"ID": 32,
				"Make_Name": "HUSQVARNA",
				"logo": "HUSQVARNA"
			  }
		];
	}
	if(Product_id === 1){
		Product_type ="CAR";
		vehicleMake =[
	  {
		"ID": 1,
		"Make_Name": "MARUTI",
		"logo": "logo-maruti"
	  },
	  {
		"ID": 2,
		"Make_Name": "HYUNDAI",
		"logo": "logo-hyundai"
	  },
	  {
		"ID": 3,
		"Make_Name": "HONDA",
		"logo": "logo-honda"
	  },
	  {
		"ID": 4,
		"Make_Name": "ASHOK LEYLAND",
		"logo": "logo-ashok-leyland"
	  },
	  {
		"ID": 5,
		"Make_Name": "ASTON MARTIN",
		"logo": "logo-aston-martin"
	  },
	  {
		"ID": 6,
		"Make_Name": "AUDI",
		"logo": "logo-audi"
	  },
	  {
		"ID": 7,
		"Make_Name": "BENTLEY",
		"logo": "logo-bentley"
	  },
	  {
		"ID": 8,
		"Make_Name": "BMW",
		"logo": "logo-bmw"
	  },
	  {
		"ID": 9,
		"Make_Name": "BUGATTI",
		"logo": "logo-bugatti"
	  },
	  {
		"ID": 10,
		"Make_Name": "CHEVROLET",
		"logo": "logo-chevrolet"
	  },
	  {
		"ID": 11,
		"Make_Name": "DAEWOO",
		"logo": "logo-daewoo"
	  },
	  {
		"ID": 12,
		"Make_Name": "DATSUN",
		"logo": "logo-datsun"
	  },
	  {
		"ID": 13,
		"Make_Name": "EICHER POLARIS",
		"logo": "logo-eicher-polaris"
	  },
	  {
		"ID": 14,
		"Make_Name": "FERRARI",
		"logo": "logo-ferrari"
	  },
	  {
		"ID": 15,
		"Make_Name": "FIAT",
		"logo": "logo-fiat"
	  },
	  {
		"ID": 16,
		"Make_Name": "FORCE MOTORS",
		"logo": "logo-force-motors"
	  },
	  {
		"ID": 17,
		"Make_Name": "FORD",
		"logo": "logo-ford"
	  },
	  {
		"ID": 18,
		"Make_Name": "HINDUSTAN MOTOR",
		"logo": "logo-hindustan-motor"
	  },
	  {
		"ID": 19,
		"Make_Name": "HUMMER",
		"logo": "logo-hummer"
	  },
	  {
		"ID": 20,
		"Make_Name": "ICML",
		"logo": "logo-icml"
	  },
	  {
		"ID": 21,
		"Make_Name": "ISUZU",
		"logo": "logo-isuzu"
	  },
	  {
		"ID": 22,
		"Make_Name": "JAGUAR",
		"logo": "logo-jaguar"
	  },
	  {
		"ID": 23,
		"Make_Name": "JEEP",
		"logo": "logo-jeep"
	  },
	  {
		"ID": 24,
		"Make_Name": "KIA",
		"logo": "logo-kia"
	  },
	  {
		"ID": 25,
		"Make_Name": "LAMBORGHINI",
		"logo": "logo-lamborghini"
	  },
	  {
		"ID": 26,
		"Make_Name": "LAND ROVER",
		"logo": "logo-land-rover"
	  },
	  {
		"ID": 27,
		"Make_Name": "LEXUS",
		"logo": "logo-lexus"
	  },
	  {
		"ID": 28,
		"Make_Name": "MAHINDRA",
		"logo": "logo-mahindra"
	  },
	  {
		"ID": 29,
		"Make_Name": "MAHINDRA RENAULT",
		"logo": "logo-mahindra-renault"
	  },
	  {
		"ID": 30,
		"Make_Name": "MASERATI",
		"logo": "logo-maserati"
	  },
	  {
		"ID": 31,
		"Make_Name": "MAYBACH",
		"logo": "logo-maybach"
	  },
	  {
		"ID": 32,
		"Make_Name": "MERCEDES-BENZ",
		"logo": "logo-mercedes-benz"
	  },
	  {
		"ID": 33,
		"Make_Name": "MG",
		"logo": "logo-mg"
	  },
	  {
		"ID": 34,
		"Make_Name": "MINI",
		"logo": "logo-mini"
	  },
	  {
		"ID": 35,
		"Make_Name": "MITSUBISHI",
		"logo": "logo-mitsubishi"
	  },
	  {
		"ID": 36,
		"Make_Name": "NISSAN",
		"logo": "logo-nissan"
	  },
	  {
		"ID": 37,
		"Make_Name": "OPEL",
		"logo": "logo-opel"
	  },
	  {
		"ID": 38,
		"Make_Name": "PAL",
		"logo": "logo-pal"
	  },
	  {
		"ID": 39,
		"Make_Name": "PORSCHE",
		"logo": "logo-porsche"
	  },
	  {
		"ID": 40,
		"Make_Name": "PREMIER",
		"logo": "logo-premier"
	  },
	  {
		"ID": 41,
		"Make_Name": "RENAULT",
		"logo": "logo-renault"
	  },
	  {
		"ID": 42,
		"Make_Name": "REVA",
		"logo": "logo-reva"
	  },
	  {
		"ID": 43,
		"Make_Name": "ROLLS-ROYCE",
		"logo": "logo-rolls-royce"
	  },
	  {
		"ID": 44,
		"Make_Name": "SAN MOTORS",
		"logo": "logo-san-motors"
	  },
	  {
		"ID": 45,
		"Make_Name": "SKODA",
		"logo": "logo-skoda"
	  },
	  {
		"ID": 46,
		"Make_Name": "SSANGYONG",
		"logo": "logo-ssangyong"
	  },
	  {
		"ID": 47,
		"Make_Name": "TATA",
		"logo": "logo-tata"
	  },
	  {
		"ID": 48,
		"Make_Name": "TOYOTA",
		"logo": "logo-toyota"
	  },
	  {
		"ID": 49,
		"Make_Name": "VOLKSWAGEN",
		"logo": "logo-volkswagen"
	  },
	  {
		"ID": 50,
		"Make_Name": "VOLVO",
		"logo": "logo-volvo"
	  }
	]
	}
	if(Product_id === 12){
		$("#MakeModelVarientFuel").attr("disabled", true);
		$('.forCV').show();
		vehicleMake = [];
		/*$.ajax({
			type: "GET",
			url: "http://www.policyboss.com/commercial-vehicle-insurance/assets/data/VehicleMake_24_gcv.json",
			success: function (data) {
				console.log(data);
				vehicleMake =data
			},
			error: function (err) {
				console.log(err);
			}
		});*/
	}
}
function onChangeFunction(event, source,urlParam){
	let id = event.id;
	if(source === 'make'){
		if(Product_id ==12){
			url = GetUrl() +'/vehicles/getmodel_variant/'+Product_id + '/' + urlParam +'/'+ selected_vehicle_class;
		}else{
			url = GetUrl() +'/vehicles/getmodel_variant/'+Product_id + '/' + urlParam;
		}
	$.get(url, function (res) {
	  var modelArray = res;
	  console.log(res);
	  // VariantList = res['VariantList'];
	// var makeAttr = $(this).attr('make');
	// console.log(makeAttr);
	$('#WithoutCarNumberPopupModel').empty();
	// let idNumber = 1000;
		for (var i in modelArray) {
			// idNumber++;
			$('#WithoutCarNumberPopupModel').append(
			"<div class='select-model-listing-col'>"+
				"<div class='select-product-listing-box select-model-listing-box'>"+
				   "<div class='radio-box'>"+
					 "<input class='form-check-input radio-custom radio-image' name='radio-tab-group-2' type='radio' id='inlineRadiobox_Model_"+ i+"'  onchange='onChangeFunction(event.target, `model`,`"+modelArray[i]['Model_ID']+"`);'/>"+
					 "<label class='form-check-label input-field border-thick radio-custom-label radio-input-hidden label-flex' for='inlineRadiobox_Model_"+ i+"'>"+
						"<span class='radio-text text-extralight font-16'>" + modelArray[i]['_id'] + "</span>"+
					 "</label>"+
				   "</div>"+ 
				"</div>"+
			 " </div>"
			)
		}			
	});
		
		
      $('#nav-model-tab').attr('data-bs-toggle','tab');
      $('#nav-model-tab').trigger('click');
      if( $('#' + id).is(":checked") ){
        var val = $('#' + id).parent().find('.radio-name-text').text();
          carBrand = val;
        $('#nav-make-tab').addClass('visited');
        $('#nav-make-tab-2').addClass('visited');
      }
      if ($(window).width() > 768) {
        if( $('#' + id).is(":checked") ){
          $('#nav-make-tab').text((val));
        }        
      }
	}
	if(source === 'model'){
	    UpdatedFuelList = [];
		var url = window.location.href.includes('https:') ? '/vehicles/beta_GetFuelVariant' + '/' + urlParam + '/'+Product_id : '/vehicles/GetFuelVariant?Model_ID=' + urlParam + '&Product_Id='+Product_id;
		if(Product_id ==12){
			url = '/vehicles/beta_GetFuelVariant/'+urlParam+'/'+Product_id;
		}
      $.get(GetUrl() + url, function(res) {
		console.log(res);
		var variantrArray = res;
		var fuelList = res['FuelList'];
		varientArray = res['VariantList'];
			if (Product_id === 1) {
				for (var i = 0; i < fuelList.length; i++) {
					var j = Object.keys(fuelList).length
					UpdatedFuelList = fuelList
					if (fuelList[i] === "PETROL") {
						UpdatedFuelList[j] = 'EXTERNAL FITTED CNG';
						UpdatedFuelList[j + 1] = 'EXTERNAL FITTED LPG';
					}
				}
			}
			else if (Product_id === 10) {
				UpdatedFuelList = fuelList;
			}
			
			if(Product_id === 12){
				ModelID = urlParam;
				// ModelName = model;
				
				fuelList = res['FuelList'];
				VariantList = res['VariantList'];
				for (var i = 0; i < fuelList.length; i++) {
				  var j = Object.keys(fuelList).length
				  UpdatedFuelList = fuelList
				  if (fuelList[i] === "PETROL" || fuelList[i] === "PETROL+LPG") {
					UpdatedFuelList[j] = 'EXTERNAL FITTED CNG';
					UpdatedFuelList[j + 1] = 'EXTERNAL FITTED LPG';
				  }
				  console.log('fuelList', UpdatedFuelList);
				}
			}
			
			
			console.log('UpdatedFuelList' +  JSON.stringify(UpdatedFuelList));
			$('#WithoutCarNumberPopupFuel').empty();
			for (var i in UpdatedFuelList) {
					$('#WithoutCarNumberPopupFuel').append(
					"<div class='select-fuel-listing-col'>"+
						"<div class='select-product-listing-box select-fuel-listing-box'>"+
							"<div class='radio-box'>"+
								"<input class='form-check-input radio-custom radio-image' name='radio-tab-group-3' type='radio' id='inlineRadiobox_Fuel_"+ i+"'  onchange='onChangeFunction(event.target, `fuel`,"+ JSON.stringify(UpdatedFuelList[i]) +");' />"+
								"<label class='form-check-label input-field border-thick radio-custom-label radio-input-hidden label-flex' for='inlineRadiobox_Fuel_"+ i+"'> "+
								"<span class='radio-text text-extralight font-16'>"+ UpdatedFuelList[i]+"</span>"+
								"</label>"+
							"</div> "+
						"</div>"+
					"</div>"
					)
			}
	  });
	  $('#nav-fuel-tab').attr('data-bs-toggle','tab');
      $('#nav-fuel-tab').trigger('click');
      if( $('#' + id).is(":checked") ){
        var val = $('#' + id).parent().find('.radio-text').text();
          carModel = val;
        $('#nav-model-tab').addClass('visited');
      }
      if ($(window).width() > 768) {
        if( $('#' + id).is(":checked") ){
          $('#nav-model-tab').text((val));
          $('#nav-model-tab').addClass('visited');
        }
      }
	}
	if(source === 'fuel'){
		fuelname = urlParam;
		FuelType_ = urlParam
		var tempFuel = urlParam;
			if (tempFuel === "EXTERNAL FITTED CNG" || tempFuel === "EXTERNAL FITTED LPG") {
				tempFuel = 'PETROL';
			}
			if (FuelType_ === "EXTERNAL FITTED CNG" || FuelType_ === "EXTERNAL FITTED LPG") {
				//$("#externalFuelTypevalueshow").show();
				is_external_bifuel = 'yes';
			}else {
				//$("#externalFuelTypevalueshow").hide();
				is_external_bifuel = 'no';
			}
			if (this.FuelType_ === "EXTERNAL FITTED CNG") {
				external_bifuel_type = "cng";
			}
			else if (this.FuelType_ === "EXTERNAL FITTED LPG") {
				external_bifuel_type = "lpg";
			}
			var FilterVariantList = [];
			if(Product_id === 12){
				for (var i = 0; i < VariantList.length; i++) {
				  FilterVariantList.push(VariantList[i]);
				}
			}else{
				for (var i = 0; i < varientArray.length; i++) {
					if ((varientArray[i].Fuel_Name.toString().toLowerCase()).indexOf(tempFuel.toLowerCase()) > -1) {
						FilterVariantList.push(varientArray[i]);
					}
				}
			}
				console.log(FilterVariantList);
				$('#WithoutCarNumberPopupVarient').empty();
				for (var i in FilterVariantList) {
							$('#WithoutCarNumberPopupVarient').append(
							"<div class='select-variant-listing-col'>"+
								"<div class='select-product-listing-box select-variant-listing-box'>"+
									"<div class='radio-box'>"+
										"<input class='form-check-input radio-custom radio-image' name='radio-tab-group-4' type='radio' id='inlineRadiobox_Variant_"+ i+"' onchange='onChangeFunction(event.target, `variant`,"+ JSON.stringify(FilterVariantList[i]['Vehicle_ID']) +");'  />"+
										"<label class='form-check-label input-field border-thick radio-custom-label radio-input-hidden label-flex' for='inlineRadiobox_Variant_"+ i+"'>"+ 
										"<span class='radio-text text-extralight font-16'>"+ FilterVariantList[i]['Variant_Name'] +" " + "(" + FilterVariantList[i]['Cubic_Capacity'] + "CC)" +"</span>"+
										"</label>"+
									"</div> "+
								"</div>"+
							"</div>"
							)
					}
				$('.FuelDv').hide("slide", {direction: "left"}, 500, function () {
				$('.varDv').show("slide", {direction: "right"}, 200);
				$('.alignvarName').show();
			});
		
		$('#nav-variant-tab').attr('data-bs-toggle','tab');
		  $('#nav-variant-tab').trigger('click');
		  if( $('#' + id).is(":checked") ){
			var val = $('#' + id).parent().find('.radio-text').text();
			  carFuelType = val;
			$('#nav-fuel-tab').addClass('visited');
		  }
		  if ($(window).width() > 768) {
			if( $('#' + id).is(":checked") ){
			  $('#nav-fuel-tab').text((val));
			  $('#nav-fuel-tab').addClass('visited');
			}
		  }	
	}
	if(source === 'variant'){
		Vehicle_ID = urlParam;
		if ($(window).width() > 768) {
        if( $('#' + id).is(":checked") ){
          var val = $('#' + id).parent().find('.radio-text').text();
          $('#nav-variant-tab').text((val));
          $('#nav-variant-tab').addClass('visited');
        }
      }
      if( $('#' + id).is(":checked") ){
        var val = $('#' + id).parent().find('.radio-text').text();
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
	}
};
//to get rto data
function getRto(){
	$.get(GetUrl() + '/rtos/list', function (res) {
		rto_data = res;
	// $.get(GetUrl() + '/vehicles/getrto/', function (res) {
		/*var rtoData = res
		var FilterRTO = [];
			for (var i in rtoData) {
				var rtoPrefix = rtoData[i]["VehicleCity_RTOCode"].toString().slice(0, 2);
					if (filterRTO.indexOf(rtoPrefix) > -1) {
						FilterRTO.push(rtoData[i]);
						const index = rtoData.findIndex(x => x.VehicleCity_RTOCode === rtoData[i]["VehicleCity_RTOCode"]);
						if (index > -1) {
							rtoData.splice(index, 1);
						}
					}
				}
				for (var i in rtoData) {
					FilterRTO.push(rtoData[i]);
				}
				var rtoArray = FilterRTO;
		 for (var k in rtoArray) {
			 for(var a in rtoArray[k]['Rtolist']){*/
				//rto_data.push(rtoArray[k]['Rtolist'][a]['VehicleCity_RTOCode']+' '+rtoArray[k]['Rtolist'][a]['RTO_City']); //+ rtoArray[k]['State_Name']
			 //}
		 //}
	});
}
function ProductType(source, prodType) {
	//AppendDate(prodType)
	ProductTypeNewrenew = prodType;
	if(ProductTypeNewrenew === 'renew'){
		var currentYear = new Date().getFullYear();
		var startYear = 1997;
		yearsToDisplay = currentYear - (startYear - 1);
		for(i=0;i<yearsToDisplay;i++){
			$('#year_' + startYear).show();
			startYear++;
		}
		$('#year_' + new Date().getFullYear()).hide();
	}else if(ProductTypeNewrenew === 'new'){
		var currentYear = new Date().getFullYear();
		var startYear = 1997;
		yearsToDisplay = currentYear - (startYear - 1);
		for(i=0;i<yearsToDisplay;i++){
			$('#year_' + startYear).hide();
			startYear++;
		}
		$('#year_' + new Date().getFullYear()).show();
		if((new Date().getMonth()+1)<=6){
			$('#year_' + (new Date().getFullYear()-1)).show();
		}
	}
	 if (Product_type === 'BIKE' && ProductTypeNewrenew === 'new') {
		IsFastLane = "no";
		mainplantype = '1CH_4TP';
		// var plantype = this.mainplantype.split('_');
		// Policy_OD_Tenure = plantype[0].charAt(0);
		// Policy_TP_Tenure = plantype[1].charAt(0);
     }
	 if (Product_type === 'BIKE' && ProductTypeNewrenew === 'renew') {
		mainplantype = '1CH_0TP';
		/*var plantype = this.mainplantype.split('_');
		this.Policy_OD_Tenure = plantype[0].charAt(0);
		this.Policy_TP_Tenure = plantype[1].charAt(0);*/
	 }
	 if (Product_type === 'CAR' && ProductTypeNewrenew === 'new') {
		IsFastLane = "no";
		mainplantype = '1CH_2TP';
		// var plantype = this.mainplantype.split('_');
		// this.Policy_OD_Tenure = plantype[0].charAt(0);
		// this.Policy_TP_Tenure = plantype[1].charAt(0);
    }
	if (Product_type === 'CAR' && ProductTypeNewrenew === 'renew') {
		mainplantype = '1CH_0TP';
		/*var plantype = mainplantype.split('_');
		Policy_OD_Tenure = plantype[0].charAt(0);
		Policy_TP_Tenure = plantype[1].charAt(0);*/
	}
	if (ProductTypeNewrenew === 'new') {
		IsFastLane = "no";
		Fastlane = false;
		//is_external_bifuel === "yes" ? $("#externalFuelTypevalueshow").show() : $("#externalFuelTypevalueshow").hide();
	}else if (ProductTypeNewrenew === 'renew') {
             Fastlane = false;
            // Mainform.reset();
            if (source === 'fastlane') {
				if(Product_id === 12){
					Fastlane = true;
					ProductTypeNewrenew = 'renew';
					openSelectCarModal('not_hidden');
					fastlaneRegistrationDate = fastlane_data.RegistrationDate;
					if(fastlane_data.RegistrationDate){
						var yearofmanf = fastlane_data.RegistrationDate.split('-')[2] 
					}
					else if(fastlane_data.Registration_Date){
						var yearofmanf = fastlane_data.Registration_Date.split('/')[2]
					}
					if(yearofmanf){
						$('.DateOfRegistration').val(yearofmanf)
					}
					fastlaneManfDate =  (new Date(Date.parse(fastlane_data.ManufactureYear +" 1, "+yearofmanf)).getMonth()+1 ).toString()+'-01-'+ fastlane_data.Manufacture_Year;
					if((new Date(fastlaneManfDate).getMonth() +1) <10){
						fastlaneManfDate =  fastlane_data.Manufacture_Year +'-0'+ (new Date(Date.parse(fastlane_data.ManufactureYear +" 1, "+yearofmanf)).getMonth()+1 ).toString()+'-01';
					}else{
						fastlaneManfDate =  fastlane_data.Manufacture_Year +'-'+ (new Date(Date.parse(fastlane_data.ManufactureYear +" 1, "+yearofmanf)).getMonth()+1 ).toString()+'-01';
					}
					var place_of_reg = RegistrationNumber;
					var temp = place_of_reg.split("-");
					RTO_Id = fastlane_data['VehicleCity_Id'];
					var RTO_name = temp[0] + temp[1] + '-' + fastlane_data['RTO_Name'];
					$('#tag2').val(RTO_name);
					makename = fastlane_data['Make_Name'];
					Model = fastlane_data['Model_Name'];
					Vehicle_Variant = fastlane_data['Variant_Name'];
					FuelType_ = fastlane_data['Fuel_Type'].toUpperCase();
					$('#MakeModelVarientFuel').val(makename + ' - ' + Model + ' - ' + Vehicle_Variant + ' - ' + FuelType_);
					Vehicle_ID = fastlane_data.VariantId;
				}
				else{
					Fastlane = true;
					ProductTypeNewrenew = 'renew';
					makename = fastlane_data.Make_Name;
					Model = fastlane_data.ModelName;
					Vehicle_Variant = fastlane_data.CarVariantName;
					FuelType_ = fastlane_data.FuelName.toUpperCase();
					var place_of_reg = RegistrationNumber;
					var temp = place_of_reg.split("-");
					RTO_Id = fastlane_data.CityofRegitrationId;
					var RTO_name = temp[0] + temp[1] + '-' + fastlane_data.CityofRegitration;
					//var mgfDate = fastlane_data.RegistrationDate;
					fastlaneRegistrationDate = fastlane_data.RegistrationDate;
					if(fastlane_data.RegistrationDate){
						var yearofmanf = fastlane_data.RegistrationDate.split('-')[2] 
					}
					else if(fastlane_data.Registration_Date){
						var yearofmanf = fastlane_data.Registration_Date.split('/')[2]
					}
					fastlaneManfDate =  (new Date(Date.parse(fastlane_data.ManufactureYear +" 1, "+yearofmanf)).getMonth()+1 ).toString()+'-01-'+ fastlane_data.Manufacture_Year;
					if((new Date(fastlaneManfDate).getMonth() +1) <10){
						fastlaneManfDate =  fastlane_data.Manufacture_Year +'-0'+ (new Date(Date.parse(fastlane_data.ManufactureYear +" 1, "+yearofmanf)).getMonth()+1 ).toString()+'-01';
					}else{
						fastlaneManfDate =  fastlane_data.Manufacture_Year +'-'+ (new Date(Date.parse(fastlane_data.ManufactureYear +" 1, "+yearofmanf)).getMonth()+1 ).toString()+'-01';
					}
					Vehicle_ID = fastlane_data.VariantId;
					if(yearofmanf){
					$('.DateOfRegistration').val(yearofmanf)
					}
					$('#MakeModelVarientFuel').val(makename + ' - ' + Model + ' - ' + Vehicle_Variant + ' - ' + FuelType_);
					$('#tag2').val(RTO_name);
					openSelectCarModal('not_hidden');
					//is_external_bifuel === "yes" ? $("#externalFuelTypevalueshow").show() : $("#externalFuelTypevalueshow").hide();
				}
			}else {
                Fastlane = false;
				 if (IsFastLane === "yes") {
                    var regNo = this.RegistrationNumber.split('-');
                    var reg1 = regNo[0];
                    var reg2 = regNo[1];
                    // rto_code = reg1 + '-' + reg2;
                    regno_rtocode = reg1 + '-' + reg2;
                    // CheckRTOValidationFromDB(reg1 + reg2);
                }
				//$("#externalFuelTypevalueshow").hide();
				//openSelectCarModal('not_hidden');
			}
	}
	if(prodType === "FastLane"){
		Fastlane = true;
		Mainformvalidate();
	}
}
function Mainformvalidate(){
	var SubmitErr = 0;
	if (Fastlane === false) {
		var makedata = $('#MakeModelVarientFuel').val();
		if (makedata === '' || makedata === undefined) {
			SubmitErr++;
			$('#MakeModelVarientFuel').addClass('has-error');
			$('.ErrMsgTxt').html('Please fill your vehicle data');
			$('.ErrMsg').show();
		}
		else {
			$('#MakeModelVarientFuel').removeClass('has-error');
			$('.ErrMsg').hide();
		}
		if($('#tag2').val()=== '' || $('#tag2').val()=== undefined ){
			SubmitErr++;
			$('#tag2').addClass('has-error');
			$('.ErrMsgTxt').html('Please fill place of registration');
			$('.ErrMsg').show();
		}else {
			$('#tag2').removeClass('has-error');
			$('.ErrMsg').hide();
		}
		if($('.DateOfRegistration').val()=== '' || $('.DateOfRegistration').val()=== undefined ){
			SubmitErr++;
			$('.DateOfRegistration').addClass('has-error');
			$('.ErrMsgTxt').html('Please fill year of registration');
			$('.ErrMsg').show();
		}else {
			$('.DateOfRegistration').removeClass('has-error');
			$('.ErrMsg').hide();
		}
		if(ProductTypeNewrenew === 'renew'){
			if(PreviousPolicyStatus=== '' || PreviousPolicyStatus=== undefined ){
				SubmitErr++;
				$('.PreviousPolicyStatus').addClass('has-error');
				$('.ErrMsgTxt').html('Please select previous policy status');
				$('.ErrMsg').show();
			}else {
				$('.PreviousPolicyStatus').removeClass('has-error');
				$('.ErrMsg').hide();
			}
		}
		if(Product_id == 12){
			if($('#vehClass').val()=== '' || $('#vehClass').val()=== undefined || $('#vehClass').val()=== null  ){
				SubmitErr++;
				$('#vehClass').addClass('has-error');
				$('.ErrMsgTxt').html('Please select vehicle class');
				$('.ErrMsg').show();
			}else {
				$('#vehClass').removeClass('has-error');
				$('.ErrMsg').hide();
			}
			if($('#vehSubClass').val()=== '' || $('#vehSubClass').val()=== undefined || $('#vehSubClass').val()=== null ){
				SubmitErr++;
				$('#vehSubClass').addClass('has-error');
				$('.ErrMsgTxt').html('Please select vehicle sub class');
				$('.ErrMsg').show();
			}else {
				$('#vehSubClass').removeClass('has-error');
				$('.ErrMsg').hide();
			}
		}
		externalFuelTypevalue = $('#externalFuelTypevalue').val();
		if (is_external_bifuel === 'yes') {
			/*if (externalFuelTypevalue === "") {
				bifuelvalid = false;
				$('#externalFuelTypevalue').addClass('has-error');//$('#spn_externalFuelTypevalue').addClass('has-error');
				$('.ErrMsgTxt').html('Please fill external fuel kit value');
				$('.ErrMsg').show();
			}
			else {
				if (externalFuelTypevalue >= 10000 && externalFuelTypevalue <= 60000) {
					bifuelvalid = true;
					$('#externalFuelTypevalue').removeClass('has-error');//$('#spn_externalFuelTypevalue').removeClass('has-error');
					$('.ErrMsg').hide();
					fuelvalue = extfuelvalue;
				}
				else {
					bifuelvalid = false;
					$('#externalFuelTypevalue').addClass('has-error');//$('#spn_externalFuelTypevalue').addClass('has-error');
					$('.ErrMsgTxt').html('The value CNG/LPG kit should be between 10000 & 60000');
					$('.ErrMsg').show();
				}
			}
			if (bifuelvalid === false) {
				SubmitErr++;
				$('#externalFuelTypevalue').addClass('has-error');//$('#spn_externalFuelTypevalue').addClass('has-error');
				$('.ErrMsg').show();
			}*/
		}
	}else{
		var fregno = $('#regno').val();
		if (fregno === '' || fregno === undefined) {
			SubmitErr++;
			$('#regno').addClass('has-error');
			$('.ErrMsgTxt').html('Please fill your vehicle data');
			$('.ErrMsg').show();
		}
		else {
			$('#regno').removeClass('has-error');
			$('.ErrMsg').hide();
		}
	}
	if (SubmitErr === 0) {
		if (Fastlane === false) {
			if(Product_id == 12 && Breakin_status === 'yes' && ProductTypeNewrenew && ProductTypeNewrenew === 'renew'){
				alert('Breakin not Allowed.')
			}else{
				/*if(ss_id > 0){
					premium_initiate();
				}else {
					$('#ModelOTP').show();
                     generateOTP();
                }*/
				premium_initiate();
			}
		}else{
			var RegNumber = $('#regno').val();
			var fastlaneRegNumber_temp =$('#regno').val();
			var fastlaneRegNumber = fastlaneRegNumber_temp.toLowerCase();
			// RegistrationNumber = RegNumber.toUpperCase();
			RegistrationNumber = "MH-02-FN-8095";
			IsFastLane = "yes";
			GetFastLane(fastlaneRegNumber);
		}
	}else if (SubmitErr >= 1) {
		$('.ErrMsgTxt').html('Please fill required data');
        $('.ErrMsg').show();
	}else {
      $('.ErrMsg').hide();
    }
}
function premium_initiate(){
	var rtocode_temp = "";
	var rtocode = "";
	RTO = $("#tag2").val().split(' ')[0];
	if (this.RTO) {
		rtocode_temp = this.RTO;
		rtocode = rtocode_temp.split('')[0] + rtocode_temp.split('')[1] + "-" + rtocode_temp.split('')[2] + rtocode_temp.split('')[3];
	} else {
		rtocode = regno_rtocode === "" ? "" : regno_rtocode;
	}
	if(ProductTypeNewrenew === 'renew'){
		vehicleInsuranceSubtype = '1CH_0TP'
	}
	if(ProductTypeNewrenew === 'new'){
		if(Product_id == 1){
			vehicleInsuranceSubtype = '1CH_2TP';
		}else if(Product_id == 10){
			vehicleInsuranceSubtype = '1CH_4TP';
		}else if(Product_id == 12){
			vehicleInsuranceSubtype = "1CH_0TP"
		}
		policyExpiryDate = null;
		Breakin_status = "no";
	}
	//vehicle_ncb_current
	var ageDiff = new Date().getFullYear() - $('.DateOfRegistration').val();
	if(ageDiff < 1){
		vehicleNcbCurrent = "0";
	}else if(ageDiff == 1){
		vehicleNcbCurrent = "20";
	}else if(ageDiff == 2){
		vehicleNcbCurrent = "25";
	}else if(ageDiff == 3){
		vehicleNcbCurrent = "35";
	}else if(ageDiff == 4){
		vehicleNcbCurrent = "45";
	}else if(ageDiff >= 5){
		vehicleNcbCurrent = "50";
	}
	if ((ProductTypeNewrenew === 'renew' && mainplantype === '0CH_1TP') || ProductTypeNewrenew === 'new') {
       NoClaimBonusStat = 'yes';
    }else{
	   NoClaimBonusStat = 'no';
	}
	var DateOfRegistration =  $('.DateOfRegistration').val()+'-'+ (new Date().getMonth() +1) +'-'+ new Date().getDate();
	if((new Date().getMonth() +1) <10){
		DateOfRegistration =  $('.DateOfRegistration').val()+'-0'+ (new Date().getMonth() +1) +'-'+ new Date().getDate();
	}
	if(IsFastLane.toLowerCase() === 'yes'){
		DateOfRegistration = fastlaneRegistrationDate.split('-')[2]+'-'+fastlaneRegistrationDate.split('-')[1]+'-'+fastlaneRegistrationDate.split('-')[0];
	}
	var vehicleManfDate =  $('.DateOfRegistration').val()+'-'+ (new Date().getMonth() +1) +'-01'
	if((new Date().getMonth() +1) <10){
		vehicleManfDate =  $('.DateOfRegistration').val()+'-0'+ (new Date().getMonth() +1) +'-01'
	}
	if(IsFastLane.toLowerCase() === 'yes'){
		vehicleManfDate = fastlaneManfDate;
	}
	if(RTO_Id){
		
	}else{
		RTO_Id = $('#rtoHidden').val() -0;
	}
	var obj = {
            'product_id': Product_id, //dynamic
            'vehicle_id': Vehicle_ID, //dynamic
            'rto_id': RTO_Id,//$('#rtoHidden').val() -0, //dynamic
            'vehicle_insurance_type': ProductTypeNewrenew, //dynamic for renew
            'vehicle_registration_date': DateOfRegistration,//$('.DateOfRegistration').val()+'-'+ (new Date().getMonth() +1) +'-'+ new Date().getDate(),//this.dateofmanf, //not available
            'vehicle_manf_date': vehicleManfDate,//$('.DateOfRegistration').val()+'-'+ (new Date().getMonth() +1) +'-01',//moment((this.manufact_year + " " + this.manufact_month), 'YYYY MMM').format('YYYY-MM') + "-01", //not available
            'policy_expiry_date': policyExpiryDate,//this.PolicyExpDate, //not available
            'prev_insurer_id': "5",//this.PreviousINS, //not available
            'vehicle_registration_type': RegisterintheName, //individual
            'vehicle_ncb_current': vehicleNcbCurrent,//this.NoClaimBonus === "" ? "0" : this.NoClaimBonus, //not available
            'is_claim_exists': NoClaimBonusStat, //not available
            'method_type': "Premium",
            'execution_async': "yes",
            'electrical_accessory': 0,
            'non_electrical_accessory': 0,
            "is_fastlane_rto": IsFastLane, //incomplete
            'registration_no': IsFastLane === "yes" ? RegistrationNumber : (rtocode + "-AA-1234"), //dynamic
            "regno_rtocode": regno_rtocode === "" ? rtocode : regno_rtocode,//incomplete
            'is_llpd': 'no',
            'is_antitheft_fit': 'no',
            'is_external_bifuel': is_external_bifuel,//dynamic
            'is_aai_member': 'no',
            'fuel_type': FuelType_,//dynamic
            'external_bifuel_type': external_bifuel_type,//dynamic
            'external_bifuel_value': is_external_bifuel === 'yes' ? "10000":"",//$('#externalFuelTypevalue').val(),// this.externalFuelTypevalue, //not available
            'pa_owner_driver_si': "1500000",
            'is_pa_od': "no",//RegisterintheName === "corporate" ? "no" : Product_id === 10 ? "no" : "yes", //incomplete
            'is_having_valid_dl': "no",
            'is_opted_standalone_cpa': "yes",
            'pa_paid_driver_si': "0",
            'first_name': 'FDummy',//this.First_name, //not available
            'middle_name':'MDummy',// this.Middle_name, //not available
            'mobile':'Dummy',// this.MobileNo, //not available
            'email': 'Dummy@gmail.com',//this.Email, //not available
            'crn': 0,
            'ss_id': ss_id, //dynamic
            'sub_fba_id': sub_fba_id, //dynamic
            'client_id': '2', 
            'fba_id': fba_id, //dynamic
            'geo_lat': geo_lat ? geo_lat: 0, //dynamic
            'geo_long': geo_long ? geo_long  : 0, //dynamic
            'agent_source': "",
            'app_version': "PolicyBoss.com",
            'vehicle_insurance_subtype':vehicleInsuranceSubtype, //mainplantype, //incomplete
            'secret_key': "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
            'client_key': "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
            'is_breakin': Breakin_status, //Different 
            'is_inspection_done': "no",
            'is_policy_exist': 'yes',//this.ClaimStatus, //not available
            'client_name': 'PolicyBoss',
            'udid': udid, //dynamic
            'last_name':'LDummy',// this.Last_name, //not available
            'ui_source': 'PBBETA',
            'is_financed': 'no',
            'is_oslc': 'no',
            'oslc_si': 0,
            'ip_address' : ip_address, //dynamic
            'ip_city_state':ip_city_state ? ip_city_state : "", //dynamic
            "is_helmet_cover": "no",
            "helmet_cover_si": 0,
			"search_from" : "diy",//
			"is_quick_quote" : "yes"
        }
		console.log(obj);
		if(Product_id == 12){
			vehicleClassData =  $('#vehClass').val();
			var namearray = vehicleClassData.split('_');
			vehicleClassCode = vehicleClassData.split('_')[0];
			vehicleClassValue = namearray.length == 1 ? "" : namearray[namearray.length - 1];
			obj["imt23"]="no";
			obj["pa_owner_driver_si"] = "100000";
			obj["non_fairing_paying_passenger"] ="no";
			obj["fairing_paying_passenger"]= "no";
			obj["other_use"]=  "no";
			obj["own_premises"]=  "no";
			obj["emp_pa"]=  "no";
			obj["conductor_ll"]= "no";
			obj["coolie_ll"]= "no";
			obj["cleaner_ll"]= "no";
			obj["geographicalareaext"]= "no";
			obj["additionaltowing"]= "no";
			obj["fibreglasstankfitted"]= "no";
			obj["vehicle_sub_class"]= $('#vehSubClass').val();
			obj["vehicle_class"]= vehicleClassValue;
			obj["vehicle_class_code"]= parseInt(vehicleClassCode);
		}
        if (mainplantype === '1OD_0TP') {
            obj["tp_insurer_id"] = 5;// TPPreviousINS; //not available
        }
         if (mainplantype != '1OD_0TP' && ProductTypeNewrenew === 'renew') {
            obj['is_tp_policy_exists'] = "no";//IsTPPolicyExists;
        }
        if (utm_source !== null && utm_source !== "" && utm_source !== undefined) {
          obj["utm_source"] = utm_source;
            if (utm_source === "LERP_FRESH") {
                obj["erp_qt"] = utm_medium ? utm_medium : "";
            }
        }
        if (utm_medium !== null && utm_medium !== "" && utm_medium !== undefined) {
            obj["utm_medium"] = utm_medium;
        }
        if (utm_campaign !== null && utm_campaign !== "" && utm_campaign !== undefined) {
            obj["utm_campaign"] = utm_campaign;
        }
        if (campaign_id !== null && campaign_id !== "" && campaign_id !== undefined) {
        	obj["campaign_id"] = campaign_id;
      	}
		if(ibuddy == true){
			obj["mobile"]= buddyMobile;
			obj["search_from"]= "ibuddy";
		}
		$.ajax({
		type: "POST",
		url: GetUrl() + "/quote/premium_initiate",
		data: JSON.stringify(obj),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
		success: function (data) {
			console.log(data);
			if (data.hasOwnProperty('Status') && data['Status'] === "VALIDATION") {
                    // POSPERROR_popup = true;
                    // VALIDATION_ERROR = data['Details'];
                } else {
                    // POSPERROR_popup = false;
                    Premium_initiate = data;
                    console.log('vehicledata', Premium_initiate);
                    srn = data['Summary']['Request_Unique_Id'];
                    console.log(data['Summary']['Request_Unique_Id'])
                    udid = (srn).split("_")[1];
                    console.log("UDID 1", udid);
                    //alert(srn);
                    if (client_id === undefined) {
                        client_id = 2;
                    }
                    // Router.navigate(['/quotes'], { queryParams: { SID: srn, ClientID: client_id } });
					// window.location.href = '/quotes?SID='+srn+'&ClientID='+client_id;
					var url = ''
					if(Product_id == 1){
						var url = '/car-insurance-UI22';
					}else if(Product_id == 10){
						var url = '/two-wheeler-insurance-UI22';
					}else if(Product_id == 12){
						var url = '/commercial-vehicle-insurance-UI22';
					}
					window.location.href = getWebsiteUrl() +url+'/quotes?SID='+srn+'&ClientID='+client_id;

                }
		},
		error: function (err) {
			console.log(err);
		}
	});
}
function horizon_get_session() {
	$.ajax({
		type: "GET",
		url: getWebsiteUrl() + "/get_session",//GetUrl() + "/get_session",
		success: function (data) {
			if (data.hasOwnProperty('agent_id')) {
                    show_agent = true;
                    ss_id = + data['agent_id'];
                    agent_name = data['agent_name'];
                    agent_email = data['agent_email'];
                    agent_mobile = data['agent_mobile'];
                    fba_id = data['fba_id'];
                    sub_fba_id = data.hasOwnProperty('sub_fba_id') ? data['sub_fba_id'] : '';
                    Is_Employee = data["Is_Employee"] == "Y" ? true : false;
                    utm_source = data.hasOwnProperty('utm_source') ? data['utm_source'] : '';
                    utm_medium = data.hasOwnProperty('utm_medium') ? data['utm_medium'] : '';
                    utm_campaign = data.hasOwnProperty('utm_campaign') ? data['utm_campaign'] : '';
                    campaign_id = data.hasOwnProperty('campaign_id') ? data['campaign_id'] : '';
                    UID = data['UID'];
                    session_id = data['session_id'];
                    if (data.hasOwnProperty('role_detail')) {
                        if (data['role_detail'].hasOwnProperty('channel') && data['role_detail']['channel'] === "MISP") {
                            is_misp = data['role_detail']['channel'];
                            make_allowed =  data['role_detail']['allowed_make'];
                        }
                    }
                    if (ss_id > 0) {
                        $('.dashboardIcon').show();
						$('.agentName').html(agent_name);
						$('.agentSsid').html('SS_ID : '+ss_id);
						$('.agentUid').html('ERP_Code : '+UID);
                    }
                }
                else {
                    ss_id = 0;
                    $(".term-insurance-visible").hide();
					$('.agentName').html('Login');
					$('.agentSsid').html('');
					$('.agentUid').html('');
					$('.profile-popup').hide();
                }
                console.log('session data', data);
			
		},
		error: function (err) {
			ss_id = 0;
			$('.agentName').html('Login');
			$('.agentSsid').html('');
			$('.agentUid').html('');
			$('.profile-popup').hide();
			console.log(err);
		}
	});
}
function getClientBrowserDetails() {
	if (window.navigator && window.navigator.geolocation) {
	  window.navigator.geolocation.getCurrentPosition(
		position => {
		  showPosition(position)
		},
		error => {
		  console.log('Position Unavailable');
		}
	  );
	}
  }
function showPosition(position) {
	geo_lat = position.coords.latitude;
	geo_long = position.coords.longitude;
	$.ajax({
		type: "GET",
		url: "https://ipinfo.io/json",
		success: function (data) {
			ip_city_state = data['city'] + "_" + data['region'];
			ip_address = data['ip'];
		    ip_respone = data;
			console.log(ip_respone);
		},
		error: function (err) {
			console.log(err);
		}
	});
}
function setBreakinStatus(status){
	let ExpiryDate = new Date();
	PreviousPolicyStatus = status;
	if(status === 'Not Expired'){
		Breakin_status = 'no';
		ExpiryDate.setDate(ExpiryDate.getDate() + 10);
		//policyExpiryDate = ExpiryDate.getFullYear() +'-'+ (ExpiryDate.getMonth()+1)+'-' + ExpiryDate.getDate();
		var temp_policyExpiryDate={
			day:ExpiryDate.getDate(),
			month:ExpiryDate.getMonth(),
			year:ExpiryDate.getFullYear()
		};
		if((ExpiryDate.getMonth()+1) < 10){
			//policyExpiryDate = ExpiryDate.getFullYear() +'-0'+ (ExpiryDate.getMonth()+1)+'-' + ExpiryDate.getDate();
			temp_policyExpiryDate.month = '0'+ (ExpiryDate.getMonth()+1);
		}
		if(ExpiryDate.getDate() < 10){
			//policyExpiryDate = ExpiryDate.getFullYear() + (ExpiryDate.getMonth()+1)+'-0' + ExpiryDate.getDate();
			temp_policyExpiryDate.day = '0'+ExpiryDate.getDate();
		}
		policyExpiryDate = temp_policyExpiryDate.year + '-' + temp_policyExpiryDate.month + '-' + temp_policyExpiryDate.day;
	}
	if(status === 'Expired within last 90 days'){
		Breakin_status = 'yes';
		ExpiryDate.setDate(ExpiryDate.getDate() - 30);
		policyExpiryDate = ExpiryDate.getFullYear() +'-'+ (ExpiryDate.getMonth()+1)+'-' + ExpiryDate.getDate();
		var temp_policyExpiryDate={
			day:ExpiryDate.getDate(),
			month:ExpiryDate.getMonth(),
			year:ExpiryDate.getFullYear()
		};
		if((ExpiryDate.getMonth()+1) <10){
			//policyExpiryDate = ExpiryDate.getFullYear() +'-0'+ (ExpiryDate.getMonth()+1)+'-' + ExpiryDate.getDate();
			temp_policyExpiryDate.month = '0'+ (ExpiryDate.getMonth()+1);
		}
		if(ExpiryDate.getDate() < 10){
			//policyExpiryDate = ExpiryDate.getFullYear() + (ExpiryDate.getMonth()+1)+'-0' + ExpiryDate.getDate();
			temp_policyExpiryDate.day = '0'+ExpiryDate.getDate();
		}
		policyExpiryDate = temp_policyExpiryDate.year + '-' + temp_policyExpiryDate.month + '-' + temp_policyExpiryDate.day;
		alert("Your Policy will not be issued instantly. It will be issued after inspection");
	}
	if(status === 'Expired for more than 90 days'){
		Breakin_status = 'yes';
		ExpiryDate.setDate(ExpiryDate.getDate() - 95);
		policyExpiryDate = ExpiryDate.getFullYear() +'-'+ (ExpiryDate.getMonth()+1)+'-' + ExpiryDate.getDate();
		var temp_policyExpiryDate={
			day:ExpiryDate.getDate(),
			month:ExpiryDate.getMonth(),
			year:ExpiryDate.getFullYear()
		};
		if((ExpiryDate.getMonth()+1)<10){
			//policyExpiryDate = ExpiryDate.getFullYear() +'-0'+ (ExpiryDate.getMonth()+1)+'-' + ExpiryDate.getDate();
			temp_policyExpiryDate.month = '0'+ (ExpiryDate.getMonth()+1);
		}
		if(ExpiryDate.getDate() < 10){
			temp_policyExpiryDate.day = '0'+ExpiryDate.getDate();
		}
		policyExpiryDate = temp_policyExpiryDate.year + '-' + temp_policyExpiryDate.month + '-' + temp_policyExpiryDate.day;
		alert("Your Policy will not be issued instantly. It will be issued after inspection.");
	}
}
function onChangeFunctionNew(event, source,urlParam){
	let id = event.id;
	if(source === 'make'){
	/*$.get(GetUrl() +'/vehicles/getmodel_variant/'+Product_id + '/' + urlParam, function (res) {
	  var modelArray = res;
	  console.log(res);
	$('#WithCarNumberPopupModel').empty();
		for (var i in modelArray) {
			$('#WithCarNumberPopupModel').append(
			"<div class='select-model-listing-col'>"+
				"<div class=1select-product-listing-box select-model-listing-box1>"+
					"<div class='radio-box'>"+
						"<input class='form-check-input radio-custom radio-image' name='radio-tab-group-new-2' type='radio' id='inlineRadiobox118'   />"+
						"<label class='form-check-label input-field border-thick radio-custom-label radio-input-hidden label-flex' for='inlineRadiobox118'> "+
						"<span class='radio-text text-extralight font-16'>Amaze</span>"+
						"</label>"+
					"</div> "+
				"</div>"+
			"</div>"
			)
		}			
	});*/
	  $('#nav-model-tab-2').attr('data-bs-toggle','tab');
      $('#nav-model-tab-2').trigger('click');
      if( $('#' + id).is(":checked") ){
        var val = $('#' + id).parent().find('.radio-name-text').text();
        newCarBrand = val;
        $('#nav-make-tab-2').addClass('visited');
      }
      if ($(window).width() > 768) {
        if( $('#' + id).is(":checked") ){
          $('#nav-make-tab-2').text((val));
          $('#nav-make-tab-2').addClass('visited');
        }        
      }
	}
}
function mySearch(val) {
	var value = val;
	value = value.toLowerCase();
	$("#WithoutCarNumberPopup *,#WithoutCarNumberPopupModel *,#WithoutCarNumberPopupFuel *,#WithoutCarNumberPopupVarient *").filter(function () {
		$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		// $('.Logodiv').css('display', 'block');
		// $('.Logodiv img').css('display', 'block');
	});
}
function GetFastLane(regno) {
	$('#fastlane_notification_error').html('');
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		var source = "PB-BETA-MOBILE";
	} else {
		var source = "PB-BETA";
	}
  var objRequest = {
	secret_key: "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
	client_key: "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
	RegistrationNumber: regno.toUpperCase(),
	product_id: Product_id,
	ss_id: ss_id !== undefined && ss_id !== null && ss_id !== "" ? ss_id : 0,
	source: source
  };
  $.ajax({
		type: "POST",
		url: GetUrl() + "/quote/vehicle_info",
		data: JSON.stringify(objRequest),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
		success: function (data) {
			fastlane_data = data
			if(Product_id == 12){
				if ((fastlane_data['Variant_Id'] != '0' && fastlane_data['Variant_Id'] !== "") && (fastlane_data['RTO_Code'] != '0' && fastlane_data['RTO_Code'] !== "")) {
					ProductType("fastlane", "renew");
				} else {
					ProductType("renew", "renew");
				}
			}else{
				if (fastlane_data['status'] === "Success" && fastlane_data.hasOwnProperty('Product_Id') && fastlane_data['Product_Id'] > 0 && (Product_id !== fastlane_data['Product_Id'])) {
					// fastlane_notification_popup = true;
					var product_name = {'1': 'Car', '10': 'Bike'}
					fastlane_product_name = product_name[fastlane_data['Product_Id'].toString()];
					$('#fastlane_notification_error').html('The vehicle number you have entered belongs to product '+ fastlane_product_name);
				} else if (fastlane_data['status'] === "Success" && (fastlane_data['VariantId'] != '0' && fastlane_data['VariantId'] !== "") && (fastlane_data['CityofRegitrationId'] != '0' && fastlane_data['CityofRegitrationId'] !== "")) {
				  ProductType("fastlane", "renew");
				  // loading = false;
				} else {
				  ProductType("renew", "renew");
				  // loading = false;
				}
			}
		},
		error: function (err) {
			console.log(err);
		}
	});
}
function setVehicleData(vehicle_class_data) {
	selected_vehicle_class = vehicle_class_data ? vehicle_class_data.split('_')[0] : "";
	vehicle_class_short_name = vehicle_class_data ? vehicle_class_data.split('_')[1] : "";
	$.ajax({
			type: "GET",
			url: getWebsiteUrl() + '/commercial-vehicle-insurance/assets/data/VehicleMake_' + vehicle_class_data + '.json',
			success: function (data) {
				console.log(data);
				vehicleMake =data
			},
			error: function (err) {
				console.log(err);
			}
		});
	
	VehicleSubClass = [];
	$("#MakeModelVarientFuel").val('');
	// cvForm.controls['vehSubClass'].setValue('0: null');
	$('#vehSubClass').empty();
	// VehicleDivClass = "makeDv";
	// cvForm.controls['vehicleDiv'].reset();
	// cvForm.controls['externalFuelTypevalue'].reset();
	$('.extFuelDiv').hide();
	if (vehicle_class_data == "24_gcv") {
	  VehicleSubClass = [
		{ "ID": "1", "vehClass": "gcv", "Text": "Public Carrier (Other Than Three Wheelers)", "value": "gcv_public_otthw" },
		// { "ID": "2", "vehClass": "gcv", "Text": "Private Carrier (Other Than Three Wheelers)", "value": "gcv_private_otthw" },
		{ "ID": "3", "vehClass": "gcv", "Text": "Public Carrier (Three Wheelers And Pedal Cycles)", "value": "gcv_public_thwpc" },
		// { "ID": "4", "vehClass": "gcv", "Text": "Private Carrier (Three Wheelers And Pedal Cycles)", "value": "gcv_private_thwpc" },
	  ]
	}
	else if (vehicle_class_data == "41_pcv") {
	  VehicleSubClass = [
		{ "ID": "5", "vehClass": "pcv", "Text": "Four Wheeled Vehicles With Carrying Capacity Not Exceeding 6 Passengers", "value": "pcv_fw_lt6pass" },
		{ "ID": "6", "vehClass": "pcv", "Text": "Three Wheeled Vehicles With Carrying Capacity Not Exceeding 6 Passengers", "value": "pcv_thw_lt6pass" },
		{ "ID": "7", "vehClass": "pcv", "Text": "Four Or More Wheeled Vehicles With Carrying Capacity Exceeding 6 Passengers", "value": "pcv_fw_gt6pass" },
		{ "ID": "8", "vehClass": "pcv", "Text": "Three Wheeled Vehicles With Carrying Capacity Exceeding 6 But Not Exceeding 17 Passengers", "value": "pcv_thw_between6to17pass" },
		{ "ID": "9", "vehClass": "pcv", "Text": "Motorized Two Wheelers", "value": "pcv_tw" },
	  ]
	}
	else if (vehicle_class_data = "35_mcv") {
	  $('.mcvAlert,.mcvAlert_msg').show();
	  VehicleSubClass = [
		{ "ID": "10", "vehClass": "msc", "Text": "Miscellaneous And Special Type", "value": "msc" }
	  ]
	}
	if(VehicleSubClass){
		// $('#vehSubClass').append("<option disabled selected>Select Sub Class</option>");
		$('#vehSubClass').append("<option value='' disabled  selected>Select Vehicle Sub Class</option>");
		for(var i=0;i<VehicleSubClass.length;i++){
			$('#vehSubClass').append("<option value='"+VehicleSubClass[i]['value'] +"'>"+VehicleSubClass[i]['Text']  +"</option>");
		}
	}
	/*var method_name = '/vehicles/model_list_cv?product_id=12&vehicle_class=' + vehicle_class_data;
	horizon.callAPIGet('', method_name, 2).subscribe(
	  data => {
		SubClass_list = data as any[];
		console.log('Vehicle class', data);
	  });
	  */
}
function getMakePopup() {
	$("#MakeModelVarientFuel").attr("disabled", true);
	if(Product_id==12){
		if(!($('#vehSubClass').val()=== '' || $('#vehSubClass').val()=== undefined || $('#vehSubClass').val()=== null  )){
			$("#MakeModelVarientFuel").removeAttr("disabled");
		}
	}else{
		$("#MakeModelVarientFuel").removeAttr("disabled");
	}
}
/*
function generateOTP() {
	var method_name = '/generateOTP/' + MobileNo + '/' + Product_type;
	horizon.callAPIGet('', method_name, 2).subscribe(
		data => {
			console.log('otp-data', data);
		});
}
function resendOTP() {
	var method_name = '/resendOTP/' + MobileNo + '/' + Product_type;
	horizon.callAPIGet('', method_name, 2).subscribe(
		data => {
			console.log('otp-resent', data);
		});
}
function verifyOTP() {
	var post = {};
	var otp = ((<HTMLInputElement>document.getElementById("txtotp")).value);
	if (otp != '') {
		OTPpopup = false;
	} else {
		otpverify = true;
		otpError = false;
		OTPpopup = true;
	}
	console.log("UDID 2", udid);
	var method_name = '/verifyOTP/' + otp;
	horizon.callAPIGet('', method_name, 2).subscribe(
		data => {
			console.log('otp-verify', data);
			if (data['Msg'] == 'Success') {
				premium_initiate(post);
			} else {
				otpverify = false;
				otpError = true;
				OTPpopup = true;
			}
		});
    }
*/
function hideOTPpopup(){
	$('#ModelOTP').hide();
}