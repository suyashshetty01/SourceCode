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
var external_bifuel_type = "";
var externalFuelTypevalue;
var show_agent = false;
var ss_id;
var agent_name;
var agent_name_desk_mob;
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
var udid = '';
var TPPreviousINS;
var policyExpiryDate;
var Fastlane = true;
var bifuelvalid;
var extfuelvalue;
var vehicleInsuranceSubtype;
var vehicleNcbCurrent = 0;
var NoClaimBonusStat = 'no';
var PreviousPolicyStatus = '';
var fastlane_data;
var fastlane_product_name = "";
var makename;
var Model;
var Vehicle_Variant;
var RTO_Id;
var selected_vehicle_class = "";
var vehicle_class_short_name;
var vehicle_class_data;
var VehicleSubClass;
var VariantList;
var ModelID;
var vehicleClassData;
var vehicleClassCode;
var vehicleClassValue;
var Premium_initiate = [];
var srn;
var client_id = 2;
var ibuddy = false;
var buddyMobile = '';
var fastlaneRegistrationDate;
var fastlaneManfDate;
var Breakin_desc;
var SubClass_list = [];
var Get_RTO;
var filterRTO = ["MH", "GJ", "KA", "DL", "UP"];
//travel variable
traveler_count = 1;
var adult_count = 2;
var child_count = 1;
var pageIndex = 1;
var utmSource;
var ss_id , sub_fba_id = '0', fba_id = '0';
var geo_lat = 0, geo_long = 0, ip_address = '', ip_city_state = '';
var agent_source = "0";
var trip_type = "";
//end travel variable
var cnt_child = 0;
var selected_child_count = 0;
var cnt_adult = 1;
var ageDropdownActive;
var age_val = '';
var member_count = 1;
var new_mem_count_child = false;
//var geo_lat, geo_long, ss_id, fba_id, ip_address, app_version, mac_address, mobile_no, inputs, udid, origin_crn = "", origin_udid = "";
var memberInp, age_val, gendertype, memType;
var memID = 1;
var member1age, member2age, member3age, member4age, member5age, member6age;
var member1gender, member2gender, member3gender, member4gender, member5gender, member6gender;
var member_1_birth_date ='', member_2_birth_date='', member_3_birth_date ='', member_4_birth_date='' , member_5_birth_date ='' , member_6_birth_date ='' ;
var amount = 500000;
var policy_tenure = 1;
var insurer_selected = "";
var cityName = [];
var pincodeName = [];
var cityID = [];
var pincode_data = {};
var ElderGender;
var valid_pincode = true;
var Engin_Number;
var Chassis_Number;
var rto_dropdown_list;
var fastlaneThroughIbuddy = false;
var valid_RTO = false;
var device_type;
var Owner_Name;
var Permanent_Pincode;
var Puc_Number;
var PUCC_date;
var is_fastlane_manufacture;
var is_fastlane_registration;
var vehSubClass = '';
var vehClass = '';
$(document).ready(function () {
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		device_type = "mobile";
	} else {
		device_type = "desktop";
	}
	stringparam();
	Product_id = 1;
	setProductID(Product_id)
	getRto();
	AppendDate('renew');
	//horizon_get_session();
	getClientBrowserDetails();
	getRtos();
	if (window.location.href.includes('qa')) {
		$('#agentName').attr({ 'href': 'http://qa-horizon.policyboss.com/sign-in?ref_login=https://qa-www.policyboss.com/UI22/', 'target': '_blank' });
		$('#ViewProfile').attr({ 'href': 'https://qa-www.policyboss.com/profile', 'target': '_blank' });
		$('#GoToHORIZON').attr({ 'href': 'https://qa-horizon.policyboss.com/product', 'target': '_blank' });
		$('#WalletDetails').attr({ 'href': 'https://qa-www.policyboss.com/wallet-details', 'target': '_blank' });
		$('#LogOut').attr({ 'href': 'https://qa-horizon.policyboss.com/sign-out', 'target': '_blank' });
	} else {
		$('#agentName').attr({ 'href': 'https://horizon.policyboss.com/sign-in?ref_login=https://www.policyboss.com/UI22', 'target': '_blank' });
		$('#ViewProfile').attr({ 'href': 'https://www.policyboss.com/profile', 'target': '_blank' });
		$('#GoToHORIZON').attr({ 'href': 'https://horizon.policyboss.com/product', 'target': '_blank' });
		$('#WalletDetails').attr({ 'href': 'https://www.policyboss.com/wallet-details', 'target': '_blank' });
		$('#LogOut').attr({ 'href': 'https://horizon.policyboss.com/sign-in', 'target': '_blank' });
	}
	if ($(window).width() < 767) {
		$('.profile-popup').hide();
		$('.forMobile').removeClass('select-brand-listing-wrapper');
		$('.forMobile').attr('style', '');
	}

	$('#login').click(function(){
        $('.profile-popup').toggle();
    });
	//Autocomplete Input Focus
	$(".tag-field").focus(function (e) {
		if ($('#tag2').val().length >= 2 && rto_dropdown_list && rto_dropdown_list.length >0) {
			$(this).parent('.tag-field-box').addClass('active');
        } else {
            var temp_this = this
            $(this).parent('.tag-field-box').removeClass('active');
            setTimeout(function () {
                $(temp_this).parent('.tag-field-box').removeClass('active');
            }, 10);
		}
	});
	//for travle input page
	if(window.innerWidth>380){
		$('.forup').css({"padding-top": "35px" })}
	console.log(window.innerWidth);
		$('.loading').show();
		$('.list').empty();
		for (var i = 5; i < 81; i++) {
			$(".list").append("<li class='dropdown-list-col select-dropdown-box-li'> <a href='javascript:void(0)' class='dropdown-list-link select-dropdown-box-link '  onclick='travel_age(this)'>" + i + " " + "Yrs</a></li>");
		}
	
		$('.maxtripdays_dropdown').hide();
		var hello = $('#travel_return_date').val();
		if (hello == null || hello == "") {
			$("#travel_return_date").prop("disabled", true);
		}
		$('.loading').hide();
	$(".travelhide").hide()
	//end travle input page

	//Tab View Change For Without Car Number 
	var carBrand
	var carModel
	var carFuelType
	var carVariant

	//Tab View Change For Without Car Number 
	var newCarBrand
	var newCarModel
	var newCarFuelType
	var newCarVariant
	$("#buddyMobile").keypress(function () {
        return isNumber(event);
    });
	$('#findMyBuddyBtn').on('click',function(){
		$('#ibuddyRegno').val('');
	})

$(document).click((e) => {
		if (!$(e.target).closest('.eldest_age').length) {
			$('#memAgeDropdown').removeClass('active');
			$('#memAgeDropdown').hide();
		}
	});
});
function AppendDate(type) {
	$('#WithoutCarNumberRegistrationDate').empty();
	var currentYear = moment().format('YYYY');
	// if(type === 'renew'){
	// currentYear =currentYear-1
	// }
	var startYear = moment().subtract(25, 'years').format('YYYY');//1997;
	yearsToDisplay = currentYear - (startYear - 1);
	for (i = 0; i < yearsToDisplay; i++) {
		$('#WithoutCarNumberRegistrationDate').append("<li class='dropdown-list-col select-dropdown-box-li' id='year_" + currentYear + "' onclick='selectDropdown(this,`RegYear`,``)'>" +
			" <a class='dropdown-list-link select-dropdown-box-link'>" + currentYear + "</a>" +
			"</li>")
		currentYear--
	}
}

function setProductID(productid) {
	$('.forCV').hide();
	$("#MakeModelVarientFuel").removeAttr("disabled");
	Product_id = productid - 0;
	$('#ibuddyRegno').attr('placeholder','');
	if (Product_id === 10) {
		$('.changeProductNameRenew').html('Continue without bike number');
		$('.changeProductNameNew').html('New Bike');
		$('.changeProductNameRenewQ').html('Continue without bike number?');
		$('.changeProductNameNewQ').html('New Bike, Click Here?');
		$('.productDetailsLabel').html('Bike Details');
		$('.changeProductTitleMake').html('Select Bike Brand')
		$('.changeProductTitleModel').html('Select Bike Model')
		$('.changeProductTitleFuel').html('Select Bike Fuel Type')
		$('.changeProductTitleVariant').html('Select Bike Variant')
		$('.regnoplaceholder').html('Enter Bike Number')
		$('.searchBrand').attr('placeholder', 'Search bike brand');
		$('.searchModel').attr('placeholder', 'Search bike model');
		$('.searchFuel').attr('placeholder', 'Search bike fuel');
		$('.searchVariant').attr('placeholder', 'Search bike variant');
		$('#ibuddyPlaceholder').html('Enter bike Number');
		Product_type = "BIKE";
		vehicleMake = [];
		/*vehicleMake = [
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
		];*/
	}
	if (Product_id === 1) {
		$('.changeProductNameRenew').html('Continue without car number');
		$('.changeProductNameNew').html('New Car');
		$('.changeProductNameRenewQ').html('Continue without car number?');
		$('.changeProductNameNewQ').html('New Car, Click Here?');
		$('.productDetailsLabel').html('Car Details');
		$('.changeProductTitleMake').html('Select Car Brand')
		$('.changeProductTitleModel').html('Select Car Model')
		$('.changeProductTitleFuel').html('Select Car Fuel Type')
		$('.changeProductTitleVariant').html('Select Car Variant')
		$('.regnoplaceholder').html('Enter Car Number')
		$('.searchBrand').attr('placeholder', 'Search car brand');
		$('.searchModel').attr('placeholder', 'Search car model');
		$('.searchFuel').attr('placeholder', 'Search car fuel');
		$('.searchVariant').attr('placeholder', 'Search car variant');
		$('#ibuddyPlaceholder').html('Enter Car Number');
		Product_type = "CAR";
        vehicleMake = [];
        /*
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
         ]*/
	}
	if (Product_id === 12) {
		$('.changeProductNameRenew').html('Continue without cv number');
		$('.changeProductNameNew').html('New CV');
		$('.changeProductNameRenewQ').html('Continue without cv number?');
		$('.changeProductNameNewQ').html('New CV, Click Here?');
		$("#MakeModelVarientFuel").attr("disabled", true);
		$('.productDetailsLabel').html('CV Details');
		$('.changeProductTitleMake').html('Select CV Brand')
		$('.changeProductTitleModel').html('Select CV Model')
		$('.changeProductTitleFuel').html('Select CV Fuel Type')
		$('.changeProductTitleVariant').html('Select CV Variant')
		$('.regnoplaceholder').html('Enter CV Number')
		$('.searchBrand').attr('placeholder', 'Search CV brand');
		$('.searchModel').attr('placeholder', 'Search CV model');
		$('.searchFuel').attr('placeholder', 'Search CV fuel');
		$('.searchVariant').attr('placeholder', 'Search CV variant');
		$('.forCV').show();
		$('#ibuddyPlaceholder').html('Enter CV Number')
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
	if (Product_id === 12 || Product_id === 1 || Product_id === 10) {
		$('.hideDiv').show();
		$('.healthInpDiv').hide();
		$('#do-it-yourself-1').addClass('active').show();
	} else if (Product_id === 2) {
		$('#adult_count').val(1);
		$('#child_count').val(0);
		$('#pincode').removeClass('has-error');
		$('.eldest_age').removeClass('has-error');
		$('.health-insurance-content').show();
		$('#do-it-yourself-3').addClass('show active');
		$('#do-it-yourself-1').removeClass('active').hide();
		$('.hideDiv').show();
		$('.hideDiv_h').hide();
		$('.eldest_age').val("");
		$('#pincode').val("");
		$("#memAgeDropdown").hide();
		selected_child_count = 0;
		cnt_adult = 1;
		pincodes();
		AgeBoxDropdown();
	} else {
		//$('#do-it-yourself-1').removeClass('active').hide();
		//$('#do-it-yourself-2').removeClass('active').hide();
		$('.hideDiv_h').hide();
		$('.hideDiv').hide();
	}
}
function onChangeFunction(event, source, urlParam, makename) {
    let id = event.id;/*
     if(source === 'make'){
		makename = urlParam;
		let vehicle_Sub_Category_Class_Name = $('#vehSubClass').val();
		if (Product_id == 12) {
			url = GetUrl() + '/vehicles/cv_getmodel_variant/' + Product_id + '/' + urlParam + '/' + selected_vehicle_class + '/' + vehicle_Sub_Category_Class_Name;
		} else {
			url = GetUrl() + '/vehicles/getmodel_variant/' + Product_id + '/' + urlParam;
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
					"<div class='select-model-listing-col'>" +
					"<div class='select-product-listing-box select-model-listing-box'>" +
					"<div class='radio-box'>" +
					"<input class='form-check-input radio-custom radio-image' name='radio-tab-group-2' type='radio' id='inlineRadiobox_Model_" + i + "'  onchange='onChangeFunction(event.target, `model`,`" + modelArray[i]['Model_ID'] + "`);'/>" +
					"<label class='form-check-label input-field border-thick radio-custom-label radio-input-hidden label-flex' for='inlineRadiobox_Model_" + i + "'>" +
					"<span class='radio-text text-extralight font-16'>" + modelArray[i]['_id'] + "</span>" +
					"</label>" +
					"</div>" +
					"</div>" +
					" </div>"
				)
			}
		});


		$('#nav-model-tab').attr('data-bs-toggle', 'tab');
		$('#nav-model-tab').trigger('click');
		if ($('#' + id).is(":checked")) {
			var val = $('#' + id).parent().find('.radio-name-text').text();
			carBrand = val;
			$('#nav-make-tab').addClass('visited');
			$('#nav-make-tab-2').addClass('visited');
		}
		if ($(window).width() > 768) {
			if ($('#' + id).is(":checked")) {
				$('#nav-make-tab').text((val));
     }        
			}
     }*/
    if (source === 'make') {
		$('#nav-fuel-tab').html('Fuel<span class="tab-text">2</span>');//$('#nav-fuel-tab').text('Fuel');
		$('#nav-fuel-tab').attr('data-bs-toggle','');
		$('#nav-variant-tab').html('Variant<span class="tab-text">3</span>');//$('#nav-variant-tab').text('Variant');
		$('#nav-variant-tab').attr('data-bs-toggle','');
		$('#nav-fuel-tab').removeClass('visited');
		$('#nav-variant-tab').removeClass('visited');
		UpdatedFuelList = [];
		var url = window.location.href.includes('https:') ? '/vehicles/beta_GetFuelVariant' + '/' + urlParam + '/' + Product_id + '/' + makename : '/vehicles/GetFuelVariant?Model_ID=' + urlParam + '&Product_Id=' + Product_id + '&make_name=' + makename;
		let vehicle_Sub_Category_Class_Name = vehSubClass;//$('#vehSubClass').val();
		if (Product_id == 12) {
			url = '/vehicles/cv_beta_GetFuelVariant/' + urlParam + '/' + Product_id + '/' + selected_vehicle_class + '/' + vehicle_Sub_Category_Class_Name + '/' + makename;
		}
		$.get(GetUrl() + url, function (res) {
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

			if (Product_id === 12) {
				ModelID = urlParam;
				// ModelName = model;

				fuelList = res['FuelList'];
				VariantList = res['VariantList'];
				for (var i = 0; i < fuelList.length; i++) {
					var j = Object.keys(fuelList).length
					UpdatedFuelList = fuelList
					if (vehSubClass && vehSubClass !== 'pcv_tw' && (fuelList[i] === "PETROL" || fuelList[i] === "PETROL+LPG")) {
						UpdatedFuelList[j] = 'EXTERNAL FITTED CNG';
						UpdatedFuelList[j + 1] = 'EXTERNAL FITTED LPG';
					}
					console.log('fuelList', UpdatedFuelList);
				}
			}


			console.log('UpdatedFuelList' + JSON.stringify(UpdatedFuelList));
			$('#WithoutCarNumberPopupFuel').empty();
			for (var i in UpdatedFuelList) {
				$('#WithoutCarNumberPopupFuel').append(
					"<div class='select-fuel-listing-col'>" +
					"<div class='select-product-listing-box select-fuel-listing-box'>" +
					"<div class='radio-box'>" +
                        "<input class='form-check-input radio-custom radio-image' name='radio-tab-group-3' type='radio' id='inlineRadiobox_Fuel_" + i + "'  onclick='onChangeFunction(event.target, `fuel`," + JSON.stringify(UpdatedFuelList[i]) + ",``);' />" +
					"<label class='form-check-label input-field border-thick radio-custom-label radio-input-hidden label-flex' for='inlineRadiobox_Fuel_" + i + "'> " +
					"<span class='radio-text text-extralight font-16'>" + UpdatedFuelList[i] + "</span>" +
					"</label>" +
					"</div> " +
					"</div>" +
					"</div>"
				)
			}
		});
		$('#nav-fuel-tab').attr('data-bs-toggle', 'tab');
		$('#nav-fuel-tab').trigger('click');
		if ($('#' + id).is(":checked")) {
            var val = $('#' + id).parent().find('.radio-name-text').text();
            carBrand = val.split(',')[0].trim();
            carModel = val.split(',')[1].trim();
			$('#nav-model-tab').addClass('visited');
            $('#nav-make-tab').addClass('visited');
            $('#nav-make-tab-2').addClass('visited');
		}
		if ($(window).width() > 768) {
			if ($('#' + id).is(":checked")) {
                $('#nav-make-tab').text((val));
				$('#nav-model-tab').text((val));
				$('#nav-model-tab').addClass('visited');
			}
		}
	}
	if (source === 'fuel') {
		$('#nav-variant-tab').html('Variant<span class="tab-text">3</span>');//$('#nav-variant-tab').text('Variant');
		$('#nav-variant-tab').removeClass('visited');
		fuelname = urlParam;
		FuelType_ = urlParam
		var tempFuel = urlParam;
		if (tempFuel === "EXTERNAL FITTED CNG" || tempFuel === "EXTERNAL FITTED LPG") {
			tempFuel = 'PETROL';
		}
		if (FuelType_ === "EXTERNAL FITTED CNG" || FuelType_ === "EXTERNAL FITTED LPG") {
			//$("#externalFuelTypevalueshow").show();
			is_external_bifuel = 'yes';
		} else {
			//$("#externalFuelTypevalueshow").hide();
			is_external_bifuel = 'no';
		}
		if (FuelType_ === "EXTERNAL FITTED CNG") {
			external_bifuel_type = "cng";
		}
		else if (FuelType_ === "EXTERNAL FITTED LPG") {
			external_bifuel_type = "lpg";
		}
		var FilterVariantList = [];
		// if (Product_id === 12) {
			// for (var i = 0; i < VariantList.length; i++) {
				// FilterVariantList.push(VariantList[i]);
			// }
		// } else {
			for (var i = 0; i < varientArray.length; i++) {
				if ((varientArray[i].Fuel_Name.toString().toLowerCase()).indexOf(tempFuel.toLowerCase()) > -1) {
					FilterVariantList.push(varientArray[i]);
				}
			}
		//}
		console.log(FilterVariantList);
		$('#WithoutCarNumberPopupVarient').empty();
		if(selected_vehicle_class == "24"){
			for (var i in FilterVariantList) {
				$('#WithoutCarNumberPopupVarient').append(
					"<div class='select-variant-listing-col'>" +
					"<div class='select-product-listing-box select-variant-listing-box'>" +
					"<div class='radio-box'>" +
						"<input class='form-check-input radio-custom radio-image' name='radio-tab-group-4' type='radio' id='inlineRadiobox_Variant_" + i + "' onclick='onChangeFunction(event.target, `variant`," + JSON.stringify(FilterVariantList[i]['Vehicle_ID']) + ",``);'  />" +
					"<label class='form-check-label input-field border-thick radio-custom-label radio-input-hidden label-flex' for='inlineRadiobox_Variant_" + i + "'>" +
					"<span class='radio-text text-extralight font-16'>" + FilterVariantList[i]['Variant_Name'] + " " + "(" + FilterVariantList[i]['Gross_Vehicle_Weight'] + "GVW)" + "</span>" +
					"</label>" +
					"</div> " +
					"</div>" +
					"</div>"
				)
			}
		}else{
			for (var i in FilterVariantList) {
				$('#WithoutCarNumberPopupVarient').append(
					"<div class='select-variant-listing-col'>" +
					"<div class='select-product-listing-box select-variant-listing-box'>" +
					"<div class='radio-box'>" +
						"<input class='form-check-input radio-custom radio-image' name='radio-tab-group-4' type='radio' id='inlineRadiobox_Variant_" + i + "' onclick='onChangeFunction(event.target, `variant`," + JSON.stringify(FilterVariantList[i]['Vehicle_ID']) + ",``);'  />" +
					"<label class='form-check-label input-field border-thick radio-custom-label radio-input-hidden label-flex' for='inlineRadiobox_Variant_" + i + "'>" +
					"<span class='radio-text text-extralight font-16'>" + FilterVariantList[i]['Variant_Name'] + " " + "(" + FilterVariantList[i]['Cubic_Capacity'] + "CC)" + "</span>" +
					"</label>" +
					"</div> " +
					"</div>" +
					"</div>"
				)
			}
		}
		$('.FuelDv').hide("slide", { direction: "left" }, 500, function () {
			$('.varDv').show("slide", { direction: "right" }, 200);
			$('.alignvarName').show();
		});

		$('#nav-variant-tab').attr('data-bs-toggle', 'tab');
		$('#nav-variant-tab').trigger('click');
		if ($('#' + id).is(":checked")) {
			var val = $('#' + id).parent().find('.radio-text').text();
			carFuelType = val;
			$('#nav-fuel-tab').addClass('visited');
		}
		if ($(window).width() > 768) {
			if ($('#' + id).is(":checked")) {
				$('#nav-fuel-tab').html(val + '<span class="tab-text">2</span>');
				$('#nav-fuel-tab').addClass('visited');
			}
		}
	}
	if (source === 'variant') {
		Vehicle_ID = urlParam;
		if ($(window).width() > 768) {
			if ($('#' + id).is(":checked")) {
				var val = $('#' + id).parent().find('.radio-text').text();
				$('#nav-variant-tab').text(val + '<span class="tab-text">3</span>');
				$('#nav-variant-tab').addClass('visited');
			}
		}
		if ($('#' + id).is(":checked")) {
			var val = $('#' + id).parent().find('.radio-text').text();
			carVariant = val;
			var inputValue = carBrand + ', ' + carModel + ', ' + carFuelType + ', ' + carVariant;

			var modalName = $('#selectCarModalBackBtn').attr('data-modal-name');
			$('.SelectCarDetail-modal').hide('slow');
			$('.' + modalName).show();
			$('.' + modalName).find('.js-detail').val(inputValue);

			if ($('.js-detail').val !== '') {
				$('.WithoutCarNumber-modal').find('.js-detail').addClass('editable-input');
			}
		}
	}
};
//for travel functions
function travel_age(obj) {
	var selText = $(obj).text();
	$(obj).closest('.input-field-box').find('.select-dropdown').val(selText);
	$(obj).closest('.input-field-box').find('.select-dropdown').removeClass('show');
	$(obj).closest('.input-field-box').find('.select-dropdown-box').removeClass('show');
};
$(".list").on('click','li',function(){
	$(this).closest('.inner-field-col').find('.dropdown-list-col').removeClass("active")
	$(this).addClass("active");  // adding active class
});

function Single_Trip(val) {
	var start_date = $('#travel_start_date').val();
	trip_type = val;
	if (utmSource === "VFS") {
		$('.hideForVFS').hide();
	} else {
		$('.hideOnMultiTrip').show();
	}
	$('.maxtripdays_dropdown').hide();
	$('.return_date').show();
	if (start_date == null || start_date == "") {
		$("#travel_return_date").prop("disabled", true);
	}
	else {
		$("#travel_return_date").prop("disabled", false);
	}

}

function Multi_Trip(val2) {
	trip = val2;
	$("#region").prop("selectedIndex", '');
	if (utmSource === "VFS") {
		$('.hideForVFS').hide();
	} else {
		$(".hideOnMultiTrip").removeClass("activated");
		$('.hideOnMultiTrip').hide();

	}
	$('.maxtripdays_dropdown').show();
	$('.return_date').hide();
	$('.hideOnMultiTrip').hide();
	$('#region').val("")

}

$('.traveler-btn').click(function () {
	$(this).closest('.inner-field-col').find('.traveler-age-select').show();
	$(this).hide();
	$(this).closest('.inner-field-col').find('.remove-btn').hide()
	$(this).closest('.inner-field-col').next().show();
	$(this).closest('.inner-field-col').next().children('.traveler-btn').show();
	$(this).closest('.inner-field-col').next().children('.remove-btn').show();
	traveler_count++;
});
$('.remove-btn').click(function () {
	$(this).hide();
	$(this).closest('.inner-field-col').find('.traveler-btn').hide()
	$(this).closest('.inner-field-col').prev().children('.traveler-btn').show()
	$(this).closest('.inner-field-col').prev().children('.remove-btn').show()
	$(this).closest('.inner-field-col').prev().show()
	$(this).closest('.inner-field-col').prev().children('.traveler-age-select').hide()
	$(this).closest('.inner-field-col').hide();
	$(this).closest('.inner-field-col').prev().children('.traveler-age-select').find('.delete').val("")
	$(this).closest('.inner-field-col').prev().children('.traveler-age-select').find('.list').find('.dropdown-list-col').removeClass('active')
	$(this).closest('.inner-field-col').prev().children('.traveler-age-select').find('.delete').removeClass('errDisplay');
	traveler_count--
});

$("#travel_start_date").datepicker({
	startDate: '+1d',
	format: 'dd-M-yyyy',
	endDate: '+5m +28d',
	autoclose: true
});
$("#travel_return_date").datepicker({
	format: 'dd-M-yyyy',
	autoclose: true
});

$('.dropdown-toggle.bs-placeholder').focus(function () {
	$(this).addClass('dropdown-focused');
	$(this).closest('.multiselect-dropdown-box').find('.floating-placeholder').addClass('focused');
});
function reset(){
	$("#travel_start_date,#travel_return_date,.dayRange,#trip,#region").removeClass('errDisplay');
	$('#finalspan,#spantrip,#spanregion,#spanmaxtripday,#spanstartdate,#spanenddate,#spantraveler1,#spantraveler2,#spantraveler3,#spantraveler4,#spantraveler5,#spantraveler6').addClass("btn-hidden");
	$("#travel_start_date,#travel_return_date,.dayRange,#trip,#region").val('');
	for (var i = 1; i <= traveler_count; i++) {
		$('.travelersval' + i).val('');
			$('.travelersval' + i).removeClass('errDisplay');
			
		}
}

$("#travel_start_date").change(function (e) {
	var Start_Date_Val = $('#travel_start_date').val();
	if (Start_Date_Val !== null || Start_Date_Val !== "") {
		$("#travel_return_date").prop("disabled", false)
	}
})

$("#travel_start_date").on("changeDate", (e) => {
	var travel_date = $("#travel_start_date").val();
	 var traveler_start_date_1 =moment(travel_date, "DD/MMM/YYYY").add(1, 'days').format('DD/MM/YYYY');
	var forenddate = moment(travel_date, "DD/MMM/YYYY").add(179, 'days').format('DD-MM-YYYY');
	$('#travel_return_date').datepicker('setStartDate', traveler_start_date_1);
	$('#travel_return_date').datepicker('setEndDate', forenddate);
	$('#travel_return_date').datepicker('setDate', traveler_start_date_1);
	$('#travel_return_date').val("");
})

function validateTravel() {
	var err = 0;
	var Trip_Type = $("#trip").val()
	var travel_start_date = $("#travel_start_date").val();
	var end_date = $("#travel_return_date").val();
	$("#travel_start_date,#travel_return_date,.dayRange,#trip,#region").removeClass('errDisplay');
	$('#finalspan,#spantrip,#spanregion,#spanmaxtripday,#spanstartdate,#spanenddate,#spantraveler1,#spantraveler2,#spantraveler3,#spantraveler4,#spantraveler5,#spantraveler6').addClass("btn-hidden");

	if (Trip_Type == "") {
		err++;
		$("#trip").addClass('errDisplay');
		if (end_date === '') {
			err++;
			$("#travel_return_date").addClass('errDisplay');
		}
	}
	if ($('#region').val() === null || $('#region').val() === '') {
		err++;
		$("#region").addClass('errDisplay');
	} else {
		travelling_to_area = $('#region').val();
	}
	if (travel_start_date === '') {
		err++;
		$("#travel_start_date").addClass('errDisplay');
	}
	if (Trip_Type == "Single Trip" && end_date === '') {
		err++;
		$("#travel_return_date").addClass('errDisplay');
	}
	if (Trip_Type == "Multi Trip" && $('.dayRange').val() == "") {
		err++;
		$("#trip_date").addClass('errDisplay');
	}
	for (var i = 1; i <= traveler_count; i++) {
		if ($('#travelers_ageaddid' + i).val() == "") {
			$('.travelersval' + i).addClass('errDisplay');
			err++;
		} else {
			$('.travelersval' + i).removeClass('errDisplay');
			this['travel' + i] = $('#travelers_ageaddid' + i).val();

		}
	}
	if (err >= 1) {
		$('#finalspan').removeClass("btn-hidden");
	}
	if (err === 0) {
		premium_initiate1();
	}

};

var premium_initiate1 = function () {
	$('.loading').show();
	var trip_type = $('#trip').val();
	max_duration = $('#trip_date').val();
	var destination = $("#region").val();
	var travel_start_date = $("#travel_start_date").val();
	var travel_end_date = $("#travel_return_date").val();
	travel1_dob = $('#travelers_ageaddid1').val();
	travel2_dob = $('#travelers_ageaddid2').val();
	travel3_dob = $('#travelers_ageaddid3').val();
	travel4_dob = $('#travelers_ageaddid4').val();
	travel5_dob = $('#travelers_ageaddid5').val();
	travel6_dob = $('#travelers_ageaddid6').val();

	travel1_age = moment().subtract($("#travelers_ageaddid1").val().split(' ')[0], 'years').format('YYYY')
	var mem_1_dob = travel1_age + '-' +  moment().format('MM-DD')
	travel2_age = moment().subtract($("#travelers_ageaddid2").val().split(' ')[0], 'years').format('YYYY')
	var mem_2_dob = travel2_age + '-' +  moment().format('MM-DD')
	travel3_age = moment().subtract($("#travelers_ageaddid3").val().split(' ')[0], 'years').format('YYYY')
	var mem_3_dob = travel3_age + '-' +  moment().format('MM-DD')
	travel4_age = moment().subtract($("#travelers_ageaddid4").val().split(' ')[0], 'years').format('YYYY')
	var mem_4_dob = travel4_age + '-' +  moment().format('MM-DD')
	travel5_age = moment().subtract($("#travelers_ageaddid5").val().split(' ')[0], 'years').format('YYYY')
	var mem_5_dob = travel5_age + '-' +  moment().format('MM-DD')
	travel6_age = moment().subtract($("#travelers_ageaddid6").val().split(' ')[0], 'years').format('YYYY')
	var mem_6_dob = travel6_age + '-' +  moment().format('MM-DD')

	var travel_date = moment(travel_start_date).format('YYYY-MM-DD');
	var travel_date_end = moment(travel_end_date).format('YYYY-MM-DD');

	var post = {
		"city_id": 677,
		"client_name": "PolicyBoss",
		"client_id": 2,
		"client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
		"secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
		"ip_address": ip_address,
		"geo_long": geo_long,
		"geo_lat": geo_lat,
		"ip_city_state": ip_city_state,
		"ss_id": ss_id,
		"fba_id": fba_id,
		"sub_fba_id": sub_fba_id,
		"agent_source": agent_source,
		"crn": 0,
		"member_count": traveler_count,
		"adult_count": adult_count,
		"child_count": child_count,
		"member_6_relation": "",
		"member_6_birth_date": travel6_dob == "" ? "" : mem_6_dob,
		"member_6_gender": "",
		"member_5_relation": "",
		"member_5_birth_date": travel5_dob == "" ? "" : mem_5_dob,
		"member_5_gender": "",
		"member_4_relation": "",
		"member_4_birth_date": travel4_dob == "" ? "" : mem_4_dob,
		"member_4_gender": "",
		"member_3_relation": "",
		"member_3_birth_date": travel3_dob == "" ? "" : mem_3_dob,
		"member_3_gender": "",
		"member_2_relation": "",
		"member_2_birth_date": travel2_dob == "" ? "" : mem_2_dob,
		"member_2_gender": "",
		"member_1_relation": "",
		"member_1_birth_date": mem_1_dob,
		"member_1_gender": "M",
		"mobile":"9898989989",
		"email": "policybosstesting@gmail.com",
		"contact_name": "test test",
		"travel_insurance_si": "0",
		"travelling_to_area": destination == "WorldWide Excl. US/Canada" ? "WWExUSCanada" : destination.split('(')[0],
		"travel_start_date": travel_date,
		"travel_end_date": trip_type == "Multi Trip" ? "" : travel_date_end,
		"maximum_duration": trip_type == "Single Trip" ? "0" : max_duration.split('-')[1],
		"travel_insurance_type": ((traveler_count > 1) ? "floater" : "individual"),
		"trip_type": trip_type == "Single Trip" ? "SINGLE" : "MULTI",
		"execution_async": "yes",
		"method_type": "Premium",
		"product_id": 4,
		"insurer_selected": ((utmSource == "VFS") ? "11,1,6,5" : ""),
		"utm_source": utmSource,
		"app_version": "PolicyBoss.com",
		"visitor_id": "603391"
	}

	$.ajax({
		type: "POST",
		data: JSON.stringify(post),
		url: GetUrl() + "/quote/premium_initiate",
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		success: function (data) {

			if ((data.hasOwnProperty("Details")) && ((data.hasOwnProperty("Summary")) ? ((data.Summary.hasOwnProperty("Request_Unique_Id")) || (data.Summary.Request_Unique_Id == "")) : true)) {
				var msg = data.Details.join('<br/>');

				$('.PremInitiVerify').show();

				$(".validationMsg").html(msg);
			}
			else {

				srn = data['Summary']['Request_Unique_Id'];
				udid = srn.split("_")[1];
				$('.loading').hide();
				// if (ss_id > 0 || siteURL.includes('SRN')) {
				window.location.href = window.location.origin + '/quotes?SID=' + srn + '&ClientID=2';
				// }
			}
		},
		error: function (result) {
			alert("Error");
		}
	});
};
//end travel functions

//to get rto data
function getRto() {
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
	$('#fastlane_notification_error,#fastlane_notification_errorIbuddy').html('')
	//AppendDate(prodType)
	if(source == 'ibuddy'){
		source = 'input';
		fastlaneThroughIbuddy = true;
	}else{
		fastlaneThroughIbuddy = false;
	}
	if(source == 'input' && prodType == 'FastLane'){
		$('#vehClass,#vehSubClass').val('');
		vehClass = '';
		vehSubClass = '';
	}
	ProductTypeNewrenew = prodType;
	if (Product_id === 12) {
		$('.addScroller_class').addClass('select-brand-listing-wrapper');
	} else {
		$('.addScroller_class').removeClass('select-brand-listing-wrapper');
	}
	if (ProductTypeNewrenew === 'renew') {
		var currentYear = moment().format('YYYY');
		var startYear = moment().subtract(25, 'years').format('YYYY');//1997;
		yearsToDisplay = currentYear - (startYear - 1);
		for (i = 0; i < yearsToDisplay; i++) {
			$('#year_' + startYear).show();
			startYear++;
		}
		if (moment().format('MM') <= 6) {
			$('#year_' + moment().format('YYYY')).hide();
		}else{
			$('#year_' + moment().format('YYYY')).show();
		}
	} else if (ProductTypeNewrenew === 'new') {
		var currentYear = moment().format('YYYY');
		var startYear = moment().subtract(25, 'years').format('YYYY');//1997;
		yearsToDisplay = currentYear - (startYear - 1);
		for (i = 0; i < yearsToDisplay; i++) {
			$('#year_' + startYear).hide();
			startYear++;
		}
		$('#year_' +moment().format('YYYY')).show();
		if (moment().format('MM') <= 6) {
			$('#year_' + (moment().format('YYYY') - 1)).show();
		}
	}
	if (Product_type === 'BIKE' && ProductTypeNewrenew === 'new') {
		IsFastLane = "no";
		vehicleInsuranceSubtype = '1CH_4TP';//mainplantype = '1CH_4TP';

		// var plantype = this.mainplantype.split('_');
		// Policy_OD_Tenure = plantype[0].charAt(0);
		// Policy_TP_Tenure = plantype[1].charAt(0);
	}
	if (Product_type === 'BIKE' && ProductTypeNewrenew === 'renew') {
		vehicleInsuranceSubtype = '1CH_0TP';//mainplantype = '1CH_0TP';
		/*var plantype = this.mainplantype.split('_');
		this.Policy_OD_Tenure = plantype[0].charAt(0);
		this.Policy_TP_Tenure = plantype[1].charAt(0);*/
	}
	if (Product_type === 'CAR' && ProductTypeNewrenew === 'new') {
		IsFastLane = "no";
		vehicleInsuranceSubtype = '1CH_2TP';//mainplantype = '1CH_2TP';
		// var plantype = this.mainplantype.split('_');
		// this.Policy_OD_Tenure = plantype[0].charAt(0);
		// this.Policy_TP_Tenure = plantype[1].charAt(0);
	}
	if (Product_type === 'CAR' && ProductTypeNewrenew === 'renew') {
		vehicleInsuranceSubtype = '1CH_0TP';//mainplantype = '1CH_0TP';
		/*var plantype = mainplantype.split('_');
		Policy_OD_Tenure = plantype[0].charAt(0);
		Policy_TP_Tenure = plantype[1].charAt(0);*/
	}
	if (ProductTypeNewrenew === 'new') {
		IsFastLane = "no";
		Fastlane = false;
		//is_external_bifuel === "yes" ? $("#externalFuelTypevalueshow").show() : $("#externalFuelTypevalueshow").hide();
	} else if (ProductTypeNewrenew === 'renew') {
		Fastlane = false;
		// Mainform.reset();
		if (source === 'fastlane') {
			if (Product_id === 12) {
				Fastlane = true;
				ProductTypeNewrenew = 'renew';
				openSelectCarModal('not_hidden');
				if($('.ibuddyPopup').is(':visible')){
						$("#triggerStaticBackdropModal").trigger("click");
					}
				if($('#doItYourself').is(':visible')){
					$("#triggerDoItYourselfModal").trigger("click");
				}
				$('.changeProductNameRenew').html('Continue with cv number');
				fastlaneRegistrationDate = fastlane_data.RegistrationDate;
				if (fastlane_data.RegistrationDate) {
					var yearofmanf = fastlane_data.RegistrationDate.split('-')[2]
				}
				else if (fastlane_data.Registration_Date) {
					var yearofmanf = fastlane_data.Registration_Date.split('/')[2]
				}
				if (yearofmanf) {
					$('.DateOfRegistration').val(yearofmanf);
					// $('.DateOfRegistration').prop('disabled',true);
					is_fastlane_registration = 'yes';
				}else{
					// $('.DateOfRegistration').prop('disabled',false);
					is_fastlane_registration = 'no';
				}
				if(fastlane_data && fastlane_data.Manufacture_Year){
					fastlaneManfDate = fastlane_data.Manufacture_Year + '-'+moment(fastlane_data.ManufactureYear, 'MMM').format('MM') +'-01';
				}
				var place_of_reg = RegistrationNumber;
				var temp = place_of_reg.split("-");
				RTO_Id = fastlane_data['VehicleCity_Id'];
				$('#rtoHidden').val(RTO_Id);
				var RTO_name = temp[0] + temp[1] + '-' + fastlane_data['RTO_Name'];
				$('#tag2').val(RTO_name);
				if ($('#tag2').val() === '' || $('#tag2').val() === undefined || $('#rtoHidden').val() === '' || $('#rtoHidden').val() === undefined) {
					$('#tag2').attr('disabled',false);
				}else{
					$('#tag2').attr('disabled','disabled');
				}
				makename = fastlane_data['Make_Name'];
				Model = fastlane_data['Model_Name'];
				Vehicle_Variant = fastlane_data['Variant_Name'];
				FuelType_ = fastlane_data['Fuel_Type'].toUpperCase();
				$('#MakeModelVarientFuel').val(makename + ' - ' + Model + ' - ' + Vehicle_Variant + ' - ' + FuelType_);
				Vehicle_ID = fastlane_data.VariantId;
				Chassis_Number = fastlane_data.Chassis_Number;
				Engin_Number = fastlane_data.Engin_Number;
				if (fastlane_data && fastlane_data.hasOwnProperty('Owner_Name') && fastlane_data['Owner_Name'] !== '' && fastlane_data['Owner_Name'] !== null && fastlane_data['Owner_Name'] !== undefined) {
				  Owner_Name = fastlane_data.Owner_Name;
			}
				if (fastlane_data && fastlane_data.hasOwnProperty('Permanent_Pincode') && fastlane_data['Permanent_Pincode'] !== '' && fastlane_data['Permanent_Pincode'] !== null && fastlane_data['Permanent_Pincode'] !== undefined) {
					Permanent_Pincode = fastlane_data.Permanent_Pincode;
				}
				if (fastlane_data && fastlane_data.hasOwnProperty('Puc_Number') && fastlane_data['Puc_Number'] !== '' && fastlane_data['Puc_Number'] !== null && fastlane_data['Puc_Number'] !== undefined) {
				  Puc_Number = fastlane_data.Puc_Number;
				}
				if (fastlane_data && fastlane_data.hasOwnProperty('Puc_Number') && fastlane_data['Puc_Number'] !== '' && fastlane_data['Puc_Number'] !== null && fastlane_data['Puc_Number'] !== undefined) {
				  Puc_Number = fastlane_data.Puc_Number;
				}
				if (fastlane_data && fastlane_data.hasOwnProperty('Puc_Expiry_Date') && fastlane_data['Puc_Expiry_Date'] !== '' && fastlane_data['Puc_Expiry_Date'] !== null && fastlane_data['Puc_Expiry_Date'] !== undefined) {
				  PUCC_date = fastlane_data.Puc_Expiry_Date;
				}
			}
			else {
				Fastlane = true;
				ProductTypeNewrenew = 'renew';
				makename = fastlane_data.Make_Name;
				Model = fastlane_data.ModelName;
				Vehicle_Variant = fastlane_data.CarVariantName;
				FuelType_ = fastlane_data.FuelName.toUpperCase();
				var place_of_reg = RegistrationNumber;
				var temp = place_of_reg.split("-");
				RTO_Id = fastlane_data.CityofRegitrationId;
				$('#rtoHidden').val(RTO_Id);
				var RTO_name = temp[0] + temp[1] + '-' + fastlane_data.CityofRegitration;
				//var mgfDate = fastlane_data.RegistrationDate;
				fastlaneRegistrationDate = fastlane_data.RegistrationDate;
				if (fastlane_data.RegistrationDate) {
					var yearofmanf = fastlane_data.RegistrationDate.split('-')[2]
				}
				else if (fastlane_data.Registration_Date) {
					var yearofmanf = fastlane_data.Registration_Date.split('/')[2]
				}
				if(fastlane_data && fastlane_data.Manufacture_Year){
					fastlaneManfDate = fastlane_data.Manufacture_Year + '-'+moment(fastlane_data.ManufactureYear, 'MMM').format('MM') +'-01';
				}
				Vehicle_ID = fastlane_data.VariantId;
				Chassis_Number = fastlane_data.Chassis_Number;
				Engin_Number = fastlane_data.Engin_Number;
				if (fastlane_data && fastlane_data.hasOwnProperty('Owner_Name') && fastlane_data['Owner_Name'] !== '' && fastlane_data['Owner_Name'] !== null && fastlane_data['Owner_Name'] !== undefined) {
				  Owner_Name = fastlane_data.Owner_Name;
				}
				if (fastlane_data && fastlane_data.hasOwnProperty('Permanent_Pincode') && fastlane_data['Permanent_Pincode'] !== '' && fastlane_data['Permanent_Pincode'] !== null && fastlane_data['Permanent_Pincode'] !== undefined) {
					Permanent_Pincode = fastlane_data.Permanent_Pincode;
				}
				if (fastlane_data && fastlane_data.hasOwnProperty('Puc_Number') && fastlane_data['Puc_Number'] !== '' && fastlane_data['Puc_Number'] !== null && fastlane_data['Puc_Number'] !== undefined) {
				  Puc_Number = fastlane_data.Puc_Number;
				}
				if (fastlane_data && fastlane_data.hasOwnProperty('Puc_Expiry_Date') && fastlane_data['Puc_Expiry_Date'] !== '' && fastlane_data['Puc_Expiry_Date'] !== null && fastlane_data['Puc_Expiry_Date'] !== undefined) {
				  PUCC_date = fastlane_data.Puc_Expiry_Date;
				}
				if (yearofmanf) {
					$('.DateOfRegistration').val(yearofmanf);
					// $('.DateOfRegistration').prop('disabled',true);
					is_fastlane_registration = 'yes';
				}else{
					// $('.DateOfRegistration').prop('disabled',false);
					is_fastlane_registration = 'no';
				}
				$('#MakeModelVarientFuel').val(makename + ' - ' + Model + ' - ' + Vehicle_Variant + ' - ' + FuelType_);
				$('#tag2').val(RTO_name);
				if ($('#tag2').val() === '' || $('#tag2').val() === undefined || $('#rtoHidden').val() === '' || $('#rtoHidden').val() === undefined) {
					$('#tag2').attr('disabled',false);
				}else{
					$('#tag2').attr('disabled','disabled');
				}
				openSelectCarModal('not_hidden');
				if (Product_id === 10) {
					$('.changeProductNameRenew').html('Continue with bike number');
				}else if (Product_id === 1) {
					$('.changeProductNameRenew').html('Continue with car number');
				}
				if($('.ibuddyPopup').is(':visible')){
						$("#triggerStaticBackdropModal").trigger("click");
					}
				if($('#doItYourself').is(':visible')){
					$("#triggerDoItYourselfModal").trigger("click");
				}
				//is_external_bifuel === "yes" ? $("#externalFuelTypevalueshow").show() : $("#externalFuelTypevalueshow").hide();
			}
		} else {
			Fastlane = false;
			if (IsFastLane === "yes") {
				var regNo = RegistrationNumber.split('-');
				var reg1 = regNo[0];
				var reg2 = regNo[1];
				// rto_code = reg1 + '-' + reg2;
				regno_rtocode = reg1 + '-' + reg2;

				CheckRTOValidationFromDB(reg1 + reg2);
			}
			//$("#externalFuelTypevalueshow").hide();
			//openSelectCarModal('not_hidden');
		}
	}
	if (prodType === "FastLane") {
		Fastlane = true;
		Mainformvalidate();
	}
}
function Mainformvalidate() {
	var SubmitErr = 0;
	var id ="regno";
	if(fastlaneThroughIbuddy == true){
		id = "ibuddyRegno";
	}
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
		if($("#tag2").val() !== $('#rtoName').val() && IsFastLane.toLowerCase() !=='yes'){
			rtocode = "";
			$('#rtoHidden').val('');
		}
		if ($('#tag2').val() === '' || $('#tag2').val() === undefined || $('#rtoHidden').val() === '' || $('#rtoHidden').val() === undefined) {
			SubmitErr++;
			$('#tag2').addClass('has-error');
			$('.ErrMsgTxt').html('Please fill place of registration');
			$('.ErrMsg').show();
		} else {
			$('#tag2').removeClass('has-error');
			$('.ErrMsg').hide();
		}
		if ($('.DateOfRegistration').val() === '' || $('.DateOfRegistration').val() === undefined) {
			SubmitErr++;
			$('.DateOfRegistration').addClass('has-error');
			$('.ErrMsgTxt').html('Please fill year of registration');
			$('.ErrMsg').show();
		} else {
			$('.DateOfRegistration').removeClass('has-error');
			$('.ErrMsg').hide();
		}
		if (ProductTypeNewrenew === 'renew') {
			if (PreviousPolicyStatus === '' || PreviousPolicyStatus === undefined) {
				SubmitErr++;
				$('.PreviousPolicyStatus').addClass('has-error');
				$('.ErrMsgTxt').html('Please select previous policy status');
				$('.ErrMsg').show();
			} else {
				$('.PreviousPolicyStatus').removeClass('has-error');
				$('.ErrMsg').hide();
			}
		}
		if (Product_id == 12) {
			if ($('#vehClass').val() === '' || $('#vehClass').val() === undefined || $('#vehClass').val() === null || vehClass === '' || vehClass === undefined || vehClass === null) {
				SubmitErr++;
				$('#vehClass').addClass('has-error');
				$('.ErrMsgTxt').html('Please select vehicle class');
				$('.ErrMsg').show();
			} else {
				$('#vehClass').removeClass('has-error');
				$('.ErrMsg').hide();
			}
			if ($('#vehSubClass').val() === '' || $('#vehSubClass').val() === undefined || $('#vehSubClass').val() === null || vehSubClass === '' || vehSubClass === undefined || vehSubClass === null) {
				SubmitErr++;
				$('#vehSubClass').addClass('has-error');
				$('.ErrMsgTxt').html('Please select vehicle sub class');
				$('.ErrMsg').show();
			} else {
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
	} else {
		var fregno = $('#'+ id).val();
		let registration_num = $('#'+id).val();
		var Text_Pattern = new RegExp('^[a-zA-Z]+$');
		var Number_Pattern = new RegExp('^[0-9]*$');
		var AlphaNum_Pattern = new RegExp('^[0-9a-zA-Z]*$');
		var reg1 ='';
		var reg2 ='';
		var reg3 ='';
		var reg4 ='';
		if (registration_num) {
		  var registration_num_array = registration_num.split('-');
		  reg1 = registration_num_array[0];
		  if (registration_num_array.length >= 2) {
			reg2= registration_num_array[1];
		  }
		  if (registration_num_array.length >= 3) {
			if (registration_num_array.length == 3 && isNaN(registration_num_array[2]) == false) {
			  reg4 = registration_num_array[2];
			} else {
			  reg3 = registration_num_array[2];
			}
		  }
		  if (registration_num_array.length >= 4) {
			reg4 = registration_num_array[3];
		  }
		}
		
		if (reg1 == "" || reg1.length != 2 || (Text_Pattern.test(reg1) == false)) {
			// $('#spn_reg1').addClass('ErrorMsg');
			SubmitErr++;
		}
		else {
			// $('#spn_reg1').removeClass('ErrorMsg');
		}
		if (reg2 == "" || reg2 == "00" || reg2.length != 2 || (AlphaNum_Pattern.test(reg2) == false)) {
			if (reg2 == "00") {
				$('#reg2').val('');
			}
			// $('#spn_reg2').addClass('ErrorMsg');
			SubmitErr++;
		}
		else if (Text_Pattern.test(reg2) == true) {
			// $('#spn_reg2').addClass('ErrorMsg');
			SubmitErr++;
		}
		else {
			// $('#spn_reg2').removeClass('ErrorMsg');
		}
		if (reg3 != "" && (reg3.length < 1 || reg3.length > 3 || (AlphaNum_Pattern.test(reg3) == false))) {
			// $('#spn_reg3').addClass('ErrorMsg');
			SubmitErr++;
		}
		else {
			// $("#spn_reg3").removeClass('ErrorMsg');
		}
		if (reg1 == "" || reg2 == "") {
			// $('#spn_reg3').addClass('ErrorMsg');
			SubmitErr++;
		}
		if (reg4 == "" || reg4.length != 4 || (Number_Pattern.test(reg4) == false)) {
			// $('#spn_reg4').addClass('ErrorMsg');
			SubmitErr++;
		}
		else {
			// $("#spn_reg4").removeClass('ErrorMsg');
		}
		
		if (fregno === '' || fregno === undefined || SubmitErr > 0) {
			SubmitErr++;
			$('#'+id).addClass('has-error');
			if(fastlaneThroughIbuddy === true){
				$('#fastlane_notification_errorIbuddy').html('Please fill your vehicle data');
			} else {
				$('#fastlane_notification_error').html('Please fill your vehicle data');//$('.ErrMsgTxt').html('Please fill your vehicle data');
			}
			$('.ErrMsg').show();
		}
		else {
			if(fastlaneThroughIbuddy === true){
				$('#fastlane_notification_errorIbuddy').html('');
			} else {
				$('#fastlane_notification_error').html('');
			}
			$('#'+id).removeClass('has-error');
			$('.ErrMsg').hide();
		}
	}
	if (SubmitErr === 0) {
		if (Fastlane === false) {
			if (Product_id == 12 && Breakin_status === 'yes' && ProductTypeNewrenew && ProductTypeNewrenew === 'renew') {
				$('.error_message').show();
				$('.ErrpopupSection2').html('Breakin not Allowed');
				//alert('Breakin not Allowed.')
			} else {
				/*if(ss_id > 0){
					premium_initiate();
				}else {
					$('#ModelOTP').show();
                     generateOTP();
                }*/
				premium_initiate();
			}
		} else {
			var RegNumber = $('#'+id).val();
			var fastlaneRegNumber_temp = $('#'+id).val().split('-').join('');
			var fastlaneRegNumber = fastlaneRegNumber_temp.toLowerCase();
			RegistrationNumber = RegNumber.toUpperCase();
			//RegistrationNumber = "MH-02-FN-8095";
			// IsFastLane = "yes";
			CheckRTOValidationFromDB($('#'+id).val().split('-')[0] + $('#'+id).val().split('-')[1])
			if (valid_RTO == false) {
				IsFastLane = "yes";
			GetFastLane(fastlaneRegNumber);
		}
		}
	} else if (SubmitErr >= 1) {
		$('.ErrMsgTxt').html('Please fill required data');
		$('.ErrMsg').show();
	} else {
		$('.ErrMsg').hide();
	}
}
function premium_initiate() {
	var ageDiff = moment().format('YYYY') - $('.DateOfRegistration').val();
	$('.loading').show();
	var rtocode_temp = "";
	var rtocode = "";
	if(IsFastLane == 'no'){
		regno_rtocode = '';
	}
	RTO = $("#tag2").val().split(' ')[0];
	if (RTO) {
		rtocode_temp = RTO;
		rtocode = rtocode_temp.split('')[0] + rtocode_temp.split('')[1] + "-" + rtocode_temp.split('')[2] + rtocode_temp.split('')[3];
	} else {
		rtocode = regno_rtocode === "" ? "" : regno_rtocode;
	}
	if (ProductTypeNewrenew === 'renew') {
		if (Product_id == 1) {
			if (ageDiff < 3) {
				vehicleInsuranceSubtype = '1OD_0TP';
			}
			if (ageDiff >= 3) {
				vehicleInsuranceSubtype = '1CH_0TP';
			}
		} else if (Product_id == 10) {
			if (ageDiff < 5) {
				vehicleInsuranceSubtype = '1OD_0TP';
			}
			if (ageDiff >= 5) {
				vehicleInsuranceSubtype = '1CH_0TP';
			}
		} else if (Product_id == 12) {
			vehicleInsuranceSubtype = '1CH_0TP'
		}
	}
	if (ProductTypeNewrenew === 'new') {
		if (Product_id == 1) {
			vehicleInsuranceSubtype = '1CH_2TP';
		} else if (Product_id == 10) {
			vehicleInsuranceSubtype = '1CH_4TP';
		} else if (Product_id == 12) {
			vehicleInsuranceSubtype = "1CH_0TP"
		}
		policyExpiryDate = null;
		Breakin_status = "no";
	}
	//vehicle_ncb_current
	/*
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
	}*/
	if (ageDiff <= 1) {
		vehicleNcbCurrent = "0";
	} else if (ageDiff == 2) {
		vehicleNcbCurrent = "20";
	} else if (ageDiff == 3) {
		vehicleNcbCurrent = "25";
	} else if (ageDiff == 4) {
		vehicleNcbCurrent = "35";
	} else if (ageDiff == 5) {
		vehicleNcbCurrent = "45";
	} else if (ageDiff >= 5) {
		vehicleNcbCurrent = "50";
	}
	if ((ProductTypeNewrenew === 'renew' && vehicleInsuranceSubtype === '0CH_1TP') || ProductTypeNewrenew === 'new') {
		NoClaimBonusStat = 'yes';
	} else {
		NoClaimBonusStat = 'no';
	}
	var DateOfRegistration = $('.DateOfRegistration').val() + '-' + moment().format('MM-DD');
	if($('.DateOfRegistration').val() === moment().format('YYYY') && ProductTypeNewrenew === 'renew'){
		DateOfRegistration = $('.DateOfRegistration').val() + '-' + moment().subtract(6, 'months').format('MM-DD');
	}
	if (IsFastLane.toLowerCase() === 'yes') {
		if (fastlaneRegistrationDate && fastlaneRegistrationDate.split('-')[2] && fastlaneRegistrationDate.split('-')[2] == moment(DateOfRegistration,'YYYY-MM-DD').format('YYYY')) {
			DateOfRegistration = fastlaneRegistrationDate.split('-')[2] + '-' + fastlaneRegistrationDate.split('-')[1] + '-' + fastlaneRegistrationDate.split('-')[0];
		}
	}
	var vehicleManfDate = $('.DateOfRegistration').val() + '-' + moment().format('MM') + '-01';
	if($('.DateOfRegistration').val() === moment().format('YYYY') && ProductTypeNewrenew === 'renew'){
		vehicleManfDate = $('.DateOfRegistration').val() + '-' + moment().subtract(6, 'months').format('MM') + '-01';
	}
	if (IsFastLane.toLowerCase() === 'yes') {
		if (fastlaneManfDate) {
		   vehicleManfDate = fastlaneManfDate;
		}
	}
	if (RTO_Id && IsFastLane === "yes") {

	} else {
		RTO_Id = $('#rtoHidden').val() - 0;
	}
	if (Breakin_desc === "Expired for more than 90 days") {
		vehicleNcbCurrent = "0";
		NoClaimBonusStat = 'yes';
	}
	var obj = {
		'product_id': Product_id, //dynamic
		'vehicle_id': Vehicle_ID, //dynamic
		'rto_id': RTO_Id,//$('#rtoHidden').val() -0, //dynamic
		'vehicle_insurance_type': ProductTypeNewrenew, //dynamic for renew
		'vehicle_registration_date': DateOfRegistration,//$('.DateOfRegistration').val()+'-'+ (new Date().getMonth() +1) +'-'+ new Date().getDate(),//this.dateofmanf, //not available
		'vehicle_manf_date': vehicleManfDate,//$('.DateOfRegistration').val()+'-'+ (new Date().getMonth() +1) +'-01',//moment((this.manufact_year + " " + this.manufact_month), 'YYYY MMM').format('YYYY-MM') + "-01", //not available
		'policy_expiry_date': policyExpiryDate,//this.PolicyExpDate, //not available
		'prev_insurer_id': "2",//this.PreviousINS, //not available
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
		'external_bifuel_value': is_external_bifuel === 'yes' ? "10000" : "",//$('#externalFuelTypevalue').val(),// this.externalFuelTypevalue, //not available
		'pa_owner_driver_si': "1500000",
		'is_pa_od': "no",//RegisterintheName === "corporate" ? "no" : Product_id === 10 ? "no" : "yes", //incomplete
		'is_having_valid_dl': "no",
		'is_opted_standalone_cpa': "yes",
		'pa_paid_driver_si': "0",
		'first_name': 'NO',//this.First_name, //not available
		'middle_name': '',// this.Middle_name, //not available
		'mobile': '9999999999',// this.MobileNo, //not available
		'email': 'abc@gmail.com',//this.Email, //not available
		'crn': 0,
		'ss_id': ss_id, //dynamic
		'sub_fba_id': sub_fba_id ? sub_fba_id : 0, //dynamic
		'client_id': client_id,
		'fba_id': fba_id, //dynamic
		'geo_lat': geo_lat ? geo_lat : 0, //dynamic
		'geo_long': geo_long ? geo_long : 0, //dynamic
		'agent_source': "",
		'app_version': app_version && app_version.includes('policyboss-') ? app_version :  "PolicyBoss.com",
		'vehicle_insurance_subtype': vehicleInsuranceSubtype, //mainplantype, //incomplete
		'secret_key': "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
		'client_key': "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
		'is_breakin': Breakin_status, //Different 
		'is_inspection_done': "no",
		//'is_policy_exist': 'yes',//this.ClaimStatus, //not available
		'client_name': 'PolicyBoss',
		'udid': udid, //dynamic
		'last_name': 'NAME',// this.Last_name, //not available
		'ui_source': 'UI22',
		'is_financed': 'no',
		'is_oslc': 'no',
		'oslc_si': 0,
		'ip_address': ip_address ? ip_address : "", //dynamic
		'ip_city_state': ip_city_state ? ip_city_state : "", //dynamic
		"is_helmet_cover": "no",
		"helmet_cover_si": 0,
		"search_from": "diy",//
		"is_quick_quote": "yes",
		"chassis_number": (fastlane_data && fastlane_data.Chassis_Number) ? Chassis_Number : "",
        "engin_number": (fastlane_data && fastlane_data.Engin_Number)  ? Engin_Number : "",
		"is_fastlane_manufacture":'no',
		"is_fastlane_registration":'no',
	}
	if(IsFastLane.toLowerCase() === 'yes'){
		if (fastlaneManfDate) {
			obj['is_fastlane_manufacture'] = 'yes';
		}
		if(is_fastlane_registration === 'yes'){
			obj['is_fastlane_registration'] = 'yes';
		}
	}
	console.log(obj);
	if (Product_id == 12) {
		vehicleClassData = vehClass;//$('#vehClass').val();
		var namearray = vehicleClassData.split('_');
		vehicleClassCode = vehicleClassData.split('_')[0];
		vehicleClassValue = namearray.length == 1 ? "" : namearray[namearray.length - 1];
		obj["imt23"] = "no";
		obj["pa_owner_driver_si"] = "100000";
		obj["non_fairing_paying_passenger"] = "no";
		obj["fairing_paying_passenger"] = "no";
		obj["other_use"] = "no";
		obj["own_premises"] = "no";
		obj["emp_pa"] = "no";
		obj["conductor_ll"] = "no";
		obj["coolie_ll"] = "no";
		obj["cleaner_ll"] = "no";
		obj["geographicalareaext"] = "no";
		obj["additionaltowing"] = "no";
		obj["fibreglasstankfitted"] = "no";
		obj["vehicle_sub_class"] = vehSubClass;//$('#vehSubClass').val();
		obj["vehicle_class"] = vehicleClassValue;
		obj["vehicle_class_code"] = parseInt(vehicleClassCode);
	}
	if (vehicleInsuranceSubtype === '1OD_0TP') {
		obj["tp_insurer_id"] = "2";// TPPreviousINS; //not available
	}
	if (vehicleInsuranceSubtype != '1OD_0TP' && ProductTypeNewrenew === 'renew') {
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
	if (ibuddy == true) {
		obj["mobile"] = buddyMobile;
		obj["search_from"] = "ibuddy";
	}
	if (ProductTypeNewrenew !== 'new') {
		obj['is_policy_exist'] = 'yes';
	}else{
		obj['prev_insurer_id'] = "0";
	}
	if (app_version && app_version.includes('policyboss-')) {
		obj['mac_address'] = (mac_address === undefined) ? "1.1.1.1" : mac_address;
	}
	if (IsFastLane === "yes"){
		if (Owner_Name && Owner_Name !== '' && Owner_Name !== undefined && Owner_Name !== null ) {
			obj['customer_name'] = Owner_Name;
		}
		if (Permanent_Pincode && Permanent_Pincode !== '' && Permanent_Pincode !== undefined && Permanent_Pincode !== null ) {
			obj['permanent_pincode'] = Permanent_Pincode;
		}
		if(ProductTypeNewrenew === 'renew' && PUCC_date && PUCC_date !== '' && PUCC_date !== undefined && PUCC_date !== null && moment(moment(PUCC_date, 'DD/MM/YYYY').format('YYYY-MM-DD')).diff(moment().format('YYYY-MM-DD'), 'days') >= 0){
			if(ProductTypeNewrenew === 'renew' && Puc_Number && Puc_Number !== '' && Puc_Number !== undefined && Puc_Number !== null){
				obj['pucc_number'] = Puc_Number;
			}
			obj['pucc_end_date'] = moment(PUCC_date, 'DD/MM/YYYY').format('DD-MM-YYYY');
		}
	}
	$.ajax({
		type: "POST",
		url: GetUrl() + "/quote/premium_initiate",
		data: JSON.stringify(obj),
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		success: function (data) {
			$('.loading').hide();
			console.log(data);
			if (data.hasOwnProperty('Status') && data['Status'] === "VALIDATION") {
				$('#POSP_ValidationTitle').html('Hey,');
				if (IsFastLane === "yes"){
					if (Owner_Name && Owner_Name !== '' && Owner_Name !== undefined && Owner_Name !== null ) {
						$('#POSP_ValidationTitle').html('Hey '+Owner_Name+',')
					}
				}
				$('#div_errorvalidation').html(data['Details']);
				$('#triggerPOSP_Validation').trigger('click');
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
				if (Product_id == 1) {
					var url = '/car-insurance';
				} else if (Product_id == 10) {
					var url = '/two-wheeler-insurance';
				} else if (Product_id == 12) {
					var url = '/commercial-vehicle-insurance';
				}
				if ((app_version && app_version.includes('policyboss-')) && (ss_id !=="" && ss_id !=="undefined" && ss_id !=="0" && fba_id !== "" && fba_id !== undefined && fba_id !== "0" && app_version !== "" && app_version !== undefined && app_version !== "0")) {
					window.location.href = getWebsiteUrl() + url + '/quotes?SID=' + srn + '&ClientID=' + client_id + "&ss_id=" + ss_id + "&fba_id=" + fba_id + "&sub_fba_id=" + sub_fba_id + "&ip_address=" + ip_address + "&mac_address=" + mac_address + "&app_version=" + app_version + "&product_id=" + Product_id;
				} else {
					window.location.href = getWebsiteUrl() + url + '/quotes?SID=' + srn + '&ClientID=' + client_id;
				}

			}
		},
		error: function (err) {
			$('.loading').hide();
			console.log(err);
		}
	});
}
function horizon_get_session() {
	$.ajax({
		type: "GET",
		url: getWebsiteUrl() + "/get_session",
		success: function (data) {
			if(data && data.hasOwnProperty('User_Type') && data.User_Type == 'POSP' && data.hasOwnProperty('Is_Posp_Certified') && data.Is_Posp_Certified == 'N'){
				$('.posp_onboarding_note').show();
			}else{
				$('.posp_onboarding_note').hide();
			}
			if (data.hasOwnProperty('agent_id')) {
				show_agent = true;
				ss_id = + data['agent_id'];
				agent_name = data['agent_name'];
				agent_email = data['agent_email'];
				agent_mobile = data['agent_mobile'];
				fba_id = data['fba_id'];
				sub_fba_id = data.hasOwnProperty('sub_fba_id') ? data['sub_fba_id'] : 0;
				Is_Employee = data["Is_Employee"] == "Y" ? true : false;
				utm_source = data.hasOwnProperty('utm_source') ? data['utm_source'] : '';
				utm_medium = data.hasOwnProperty('utm_medium') ? data['utm_medium'] : '';
				utm_campaign = data.hasOwnProperty('utm_campaign') ? data['utm_campaign'] : '';
				campaign_id = data.hasOwnProperty('campaign_id') ? data['campaign_id'] : '';
				UID = data['UID'];
				session_id = data['session_id'];
				$(".Car a").attr('href', '/car-insurance');
				$(".Bike a").attr('href', '/two-wheeler-insurance');
				$(".CV a").attr('href', '/commercial-vehicle-insurance');
				$(".Health a").attr('href', '/health-insurance');
				/* start for header */
				if (device_type === "mobile") {
					agentNameDeskMob = data['agent_name'].split(" ")[0];
				} else {
					agentNameDeskMob = data['agent_name'];
					
				}
				$('.agentNameDeskMob').html(agentNameDeskMob);
				$('#login').attr('href', 'javascript:return false;');
				$('#login').attr('onclick', 'javascript:return false;');
				$('a[title="Login"]').attr('href', 'https://horizon.policyboss.com/sign-out');
				/* end for header */
				
				if (data.hasOwnProperty('role_detail')) {
					if (data['role_detail'].hasOwnProperty('channel') && data['role_detail']['channel'] === "MISP") {
						is_misp = data['role_detail']['channel'];
						make_allowed = data['role_detail']['allowed_make'];
					}
				}
				if (ss_id > 0) {
					$('li[title="Term Insurance"]').attr('onclick', "window.open('https://term.policyboss.com/term-insurance','_self');");
					$('.dashboardIcon').show();
					$('.agentName').html(agent_name);
					$('.agentSsid').html('SS_ID : ' + ss_id);
					$('.agentUid').html('ERP_Code : ' + UID);
				}
				$('.loginButton').hide();
				$('.profileDropdown').show();
			}
			else {
				ss_id = 0;
				$('.loginButton').show();
				$('.profileDropdown').hide();
				$('.agentNameDeskMob').html('Login');
				$('.agentSsid').html('');
				$('.agentUid').html('');
				/* start for header */
				$('a[title="Login"]').attr('href', 'https://horizon.policyboss.com/sign-in?ref_login=' + window.location.href);
				$(".term-insurance-visible,.logged-agent-only").hide();
				$('.profile-popup').remove();
				/* end for header */
			}
			console.log('session data', data);

		},
		error: function (err) {
			ss_id = 0;
			$('.loginButton').show();
			$('.profileDropdown').hide();
			$('.agentNameDeskMob').html('Login');
			$('.agentSsid').html('');
			$('.agentUid').html('');
			$('.profile-popup').remove();
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
function setBreakinStatus(status) {
	let ExpiryDate = new Date();
	PreviousPolicyStatus = status;
	if (status === 'Not Expired') {
		Breakin_status = 'no';
		Breakin_desc = "Not Expired";
		policyExpiryDate = moment().add('days', 10).format('YYYY-MM-DD'); 
		ExpiryDate.setDate(ExpiryDate.getDate() + 10);
		//policyExpiryDate = moment(ExpiryDate).format('YYYY-MM-DD')
	}
	if (status === 'Expired within last 90 days') {
		Breakin_status = 'yes';
		Breakin_desc = "Expired within last 90 days";
		ExpiryDate.setDate(ExpiryDate.getDate() - 30);
		policyExpiryDate = moment().subtract(30, "days").format('YYYY-MM-DD');
		if (Product_id == 1 || Product_id == 12) {
			$('.error_message').show();
			$('.ErrpopupSection2').html('Your Policy will not be issued instantly. It will be issued after inspection');
			//alert("Your Policy will not be issued instantly. It will be issued after inspection");
		}
	}
	if (status === 'Expired for more than 90 days') {
		Breakin_status = 'yes';
		Breakin_desc = "Expired for more than 90 days";
		ExpiryDate.setDate(ExpiryDate.getDate() - 91);
		policyExpiryDate = moment().subtract(91, "days").format('YYYY-MM-DD');
		if (Product_id == 1 || Product_id == 12) {
			$('.error_message').show();
			$('.ErrpopupSection2').html('Your Policy will not be issued instantly. It will be issued after inspection');
			//alert("Your Policy will not be issued instantly. It will be issued after inspection.");
		}
	}
}
function onChangeFunctionNew(event, source, urlParam) {
	let id = event.id;
	if (source === 'make') {
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
		$('#nav-model-tab-2').attr('data-bs-toggle', 'tab');
		$('#nav-model-tab-2').trigger('click');
		if ($('#' + id).is(":checked")) {
			var val = $('#' + id).parent().find('.radio-name-text').text();
			newCarBrand = val;
			$('#nav-make-tab-2').addClass('visited');
		}
		if ($(window).width() > 768) {
			if ($('#' + id).is(":checked")) {
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
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
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
	$('.loading').show();
	$.ajax({
		type: "POST",
		url: GetUrl() + "/quote/vehicle_info",
		data: JSON.stringify(objRequest),
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		success: function (data) {
			$('.loading').hide();
			fastlane_data = data
			if (Product_id == 12) {
				if ((fastlane_data['Variant_Id'] != '0' && fastlane_data['Variant_Id'] !== "") && (fastlane_data['RTO_Code'] != '0' && fastlane_data['RTO_Code'] !== "")) {
					ProductType("fastlane", "renew");
				} else {
					ProductType("renew", "renew");
					openSelectCarModal('not_hidden');
				}
			} else {
				if (fastlane_data['status'] === "Success" && fastlane_data.hasOwnProperty('Product_Id') && fastlane_data['Product_Id'] > 0 && (Product_id !== fastlane_data['Product_Id'])) {
					// fastlane_notification_popup = true;
					var product_name = { '1': 'Car', '10': 'Bike' }
					fastlane_product_name = product_name[fastlane_data['Product_Id'].toString()];
					if(fastlaneThroughIbuddy == true){
						$('#fastlane_notification_errorIbuddy').html('The vehicle number you have entered belongs to product ' + fastlane_product_name);
					}else{
						$('#fastlane_notification_error').html('The vehicle number you have entered belongs to product ' + fastlane_product_name);
					}
					Fastlane = false;
				} else if (fastlane_data['status'] === "Success" && (fastlane_data['VariantId'] != '0' && fastlane_data['VariantId'] !== "") && (fastlane_data['CityofRegitrationId'] != '0' && fastlane_data['CityofRegitrationId'] !== "")) {
					ProductType("fastlane", "renew");
					// loading = false;
				} else {
					ProductType("renew", "renew");
					openSelectCarModal('not_hidden');
					if (Product_id === 10) {
						$('.changeProductNameRenew').html('Continue with bike number');
					}else if (Product_id === 1) {
						$('.changeProductNameRenew').html('Continue with car number');
					}else if (Product_id === 12) {
						$('.changeProductNameRenew').html('Continue with cv number');
					}
					if($('.ibuddyPopup').is(':visible')){
						$("#triggerStaticBackdropModal").trigger("click");
					}
					if($('#doItYourself').is(':visible')){
					$("#triggerDoItYourselfModal").trigger("click");
				}
					// loading = false;
				}
			}
		},
		error: function (err) {
			$('.loading').hide();
			console.log(err);
		}
	});
}
function setVehicleData(vehicle_class_data) {
	vehClass = vehicle_class_data;
	$("#MakeModelVarientFuel").attr("disabled", true);
	if(vehicle_class_short_name && vehicle_class_short_name!==vehicle_class_data.split('_')[1]){
		$('#vehSubClass').val('');
		vehSubClass = '';
	}
	selected_vehicle_class = vehicle_class_data ? vehicle_class_data.split('_')[0] : "";
	vehicle_class_short_name = vehicle_class_data ? vehicle_class_data.split('_')[1] : "";
	/*
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
	*/
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
			{ "ID": "1", "vehClass": "gcv", "Text": "Public Other than 3 Wheeler", "value": "gcv_public_otthw" },
			//{ "ID": "2", "vehClass": "gcv", "Text": "Private Carrier (Other Than Three Wheelers)", "value": "gcv_private_otthw" },
			{ "ID": "3", "vehClass": "gcv", "Text": "Public 3 Wheeler", "value": "gcv_public_thwpc" },
			//{ "ID": "4", "vehClass": "gcv", "Text": "Private Carrier (Three Wheelers And Pedal Cycles)", "value": "gcv_private_thwpc" },
		]
	}
	else if (vehicle_class_data == "41_pcv") {
		VehicleSubClass = [
			{ "ID": "5", "vehClass": "pcv", "Text": "4 Wheeler LESS THAN OR EQUAL TO 6 PASSENGERS", "value": "pcv_fw_lt6pass" },
			{ "ID": "6", "vehClass": "pcv", "Text": "3 Wheeler LESS THAN OR EQUAL TO 6 PASSENGERS", "value": "pcv_thw_lt6pass" },
			{ "ID": "7", "vehClass": "pcv", "Text": "4 Wheeler MORE THAN 6 PASSENGERS", "value": "pcv_fw_gt6pass" },
			{ "ID": "8", "vehClass": "pcv", "Text": "3 Wheeler BETWEEN 6 TO 17 PASSENGERS", "value": "pcv_thw_between6to17pass" },
			{ "ID": "9", "vehClass": "pcv", "Text": "2 Wheeler LESS THAN OR EQUAL TO 2 PASSENGERS", "value": "pcv_tw" },
		]
	}
	else if (vehicle_class_data = "35_mcv") {
		$('.mcvAlert,.mcvAlert_msg').show();
		VehicleSubClass = [
			{ "ID": "10", "vehClass": "msc", "Text": "Miscellaneous And Special Type", "value": "msc" }
		]
	}
	if (VehicleSubClass) {
		// $('#vehSubClass').append("<option value='' disabled  selected>Select Vehicle Sub Class</option>");
		$('#vehSubClassList').empty();
		for (var i = 0; i < VehicleSubClass.length; i++) {
			// $('#vehSubClass').append("<option value='" + VehicleSubClass[i]['value'] + "'>" + VehicleSubClass[i]['Text'] + "</option>");
			$('#vehSubClassList').append("<li class='dropdown-list-col select-dropdown-box-li'><a href='javascript:void(0)' class='dropdown-list-link select-dropdown-box-link'"+ "onclick='selectDropdown(this,`vehicleSubClass`,`" + VehicleSubClass[i]['value'] + "`)'>" + VehicleSubClass[i]['Text'] + "</a></li>");
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
function getMakePopup(vehicle_subclass_code) {
	$("#MakeModelVarientFuel").attr("disabled", true);
	if (Product_id == 12) {
		if (!($('#vehSubClass').val() === '' || $('#vehSubClass').val() === undefined || $('#vehSubClass').val() === null || vehSubClass === '' || vehSubClass === undefined || vehSubClass === null)) {
			$("#MakeModelVarientFuel").removeAttr("disabled");

			$.ajax({
				type: "GET",
				url: GetUrl() + '/vehicles/make_list_cv?product_id=12&vehicle_class=' + selected_vehicle_class + '_' + vehicle_class_short_name + '&vehicle_subclass_name=' + vehicle_subclass_code,
				success: function (data) {
					console.log(data);
					vehicleMake = data;
					$.ajax({
						type: "GET",
						url: GetUrl() + '/vehicles/model_list_cv?product_id=12&vehicle_class=' + selected_vehicle_class + '_' + vehicle_class_short_name + '&vehicle_subclass_name=' + vehicle_subclass_code,
						success: function (data) {
							console.log(data);
							//SubClass_list = data;
							vehicleMake = data;
						},
						error: function (err) {
							console.log(err);
						}
					});
				},
				error: function (err) {
					console.log(err);
				}
			});
		}
    } else if (Product_id == 1 || Product_id == 10) {
        $("#MakeModelVarientFuel").attr("disabled", false);
        $.ajax({
            type: "GET",
            url: GetUrl() + '/vehicles/model_list?product_id=' + Product_id,
            success: function (data) {
                vehicleMake = data;
				
				var suggested_vehicleMake=[];
				var suggested_makes =[];
				$.ajax({
					type: "GET",
					url: GetUrl() + '/vehicles/get_preferred/make_model?ss_id='+ss_id+'&product_id=' + Product_id,
					success: function (data) {
						for(i=0;i<data.length;i++){
							if(suggested_makes.length <6 && (!suggested_makes.includes(data[i]['Model_ID']))){
								suggested_makes.push(data[i]['Model_ID']);
							}
						}
						/*
				if(Product_id == 1){
					suggested_makes = [71,6,49,78,778,58];
				}
				if(Product_id == 10){
					suggested_makes = [1141,942,983,1159,1083,1117];
						}*/
				var remove_items = [];
				for (var i in suggested_makes) {
					$.each(vehicleMake,function(index,value){
						if(vehicleMake[index]['Model_ID']== suggested_makes[i]){
							suggested_vehicleMake.push(vehicleMake[index]);
							remove_items.push(index);//vehicleMake.splice(index,1);
						}
					})
				}
				remove_items= remove_items.sort(function(a, b){return a - b});
				for(var i=0;i<remove_items.length;i++){
					vehicleMake.splice(remove_items[i] - i,1);
				}
				vehicleMake = suggested_vehicleMake.concat(vehicleMake);
					
            },
            error: function (result) {

            }
        });
					
            },
            error: function (result) {

            }
        });
	} else {
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
function hideOTPpopup() {
	$('#ModelOTP').hide();
}
function close_notifictn_popup() {
	$('.error_message').hide();
}
function getRtos() {
	$.ajax({
		type: "GET",
		url: GetUrl() + "/vehicles/getrto/",//GetUrl() + "/get_session",
		success: function (data) {
			var rtoData = data;
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
			Get_RTO = FilterRTO;
			// console.log('FilterRTO', FilterRTO);

			console.log('RTOdata', Get_RTO);

		}, error: function (err) {
			console.log(err)
		}
	})
}
function CheckRTOValidationFromDB(regNo) {
	$('#fastlane_notification_error').html('');
	var RtoList = [];
	var Fastlane_Rto_List_Temp = [];
	var Rto_No = regNo.toUpperCase();
	for (let i in Get_RTO) {
		RtoList.push(Get_RTO[i].Rtolist);
	}
	console.log(RtoList);
	if (RtoList.length > 0) {
		RTO_count = 0;
		for (var q in RtoList) {
			for (var r in RtoList[q]) {
				var RTO_State_Name = "";
				if (RtoList[q][r].hasOwnProperty('VehicleCity_RTOCode')) {
					RTO_State_Name = RtoList[q][r]['VehicleCity_RTOCode'].toUpperCase();
					if (RTO_State_Name == Rto_No) {
						RTO_count++;
						getRtoStatus = true;
						var rtoName = RtoList[q][r];
						RTO_Id = rtoName.VehicleCity_Id;
						$('#rtoHidden').val(RTO_Id);
						var rtoFullName = rtoName.VehicleCity_RTOCode + ' - ' + rtoName.RTO_City;
						$('#tag2').val(rtoFullName);
						if ($('#tag2').val() === '' || $('#tag2').val() === undefined || $('#rtoHidden').val() === '' || $('#rtoHidden').val() === undefined) {
							$('#tag2').attr('disabled',false);
						}else{
							$('#tag2').attr('disabled','disabled');
						}
						Fastlane_Rto_List_Temp.push(RtoList[q][r]);
						Fastlane_Rto_List = Get_RTO[q];
					}
				}
			}
		}
		if (RTO_count === 0) {
			$('#fastlane_notification_error').html('Invalid RTO');
			$('.ErrMsg').show();
			valid_RTO = true;
		} else if (RTO_count > 1 && Fastlane_Rto_List && Fastlane_Rto_List_Temp) {
			Fastlane_Rto_List['Rtolist'] = Fastlane_Rto_List_Temp;
			Get_RTO = [];
			Get_RTO.push(Fastlane_Rto_List);
		} else {
			$('.ErrMsg').hide();
			valid_RTO = false;
		}
	}
}
function camelize(text) {
	text = text.replace(/[-_\s.]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
	var newtxt = text.substring(0, 1).toLowerCase() + text.substr(1);
	var value = newtxt
	if (!value.includes('-')) {
		value = newtxt.replace(/([A-Z ])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
	}
	return value;
}

// $('.increament-btn').click(function (e) {
//      e.preventDefault();
//       var currentVal = parseInt($(this).prev(".number-count-input").val());
//        if (currentVal != NaN)
//        {
//            $(this).prev(".number-count-input").val(currentVal + 1);
//        }
//    });

function FuncAdult(adult) {
	if (adult === -1 && cnt_adult !== 0) {
		cnt_adult--;
		$('#adult_count').val(cnt_adult);
	}
	//cnt_adult = $('#adult_count').val();
	else if (adult === 1 && cnt_adult !== 2) {
		cnt_adult++;
		$('#adult_count').val(cnt_adult);
	}
	if (cnt_adult === 0) {
		$("#Eldest_mem_gen").val('Gender');
	}
	if (adult === 1 && cnt_adult === 1 && ageDropdownActive) {
		if(age_val <= 18){
           $('.eldest_age').val(18);
		}
		else {
			$('.eldest_age').val(age_val);
		}
	}
	else if (adult === -1 && cnt_adult === 0 && ageDropdownActive) {
		if(age_val >25){
			$('.eldest_age').val(1);
		}
		else if(age_val <= 25){
			$('.eldest_age').val(age_val);
		}
	}
	AgeBoxDropdown();
}
function FuncChild(child) {

	if (child === -1 && selected_child_count !== 0) {
		selected_child_count--;
		$('#child_count').val(selected_child_count);
	}
	else if (child === 1 && selected_child_count !== 4) {
		selected_child_count++;
		$('#child_count').val(selected_child_count);
	}
	cnt_child = selected_child_count;

}

function AgeBoxDropdown() {
	$('#mem_age_list').empty();
	if (cnt_adult > 0) {
		for (var i = 18; i < 83; i++) {
			$('#mem_age_list').append("<li class='dropdown-list-col select-dropdown-box-li'>"
				+ "<a href='javascript:void(0)' class='dropdown-list-link select-dropdown-box-link' id='age_" + i + "'  data-value='" + i + "' onclick='select_age(this);'>" + i + "</a></li>");
		}
	} else {
		for (var j = 1; j <= 25; j++) {
			$('#mem_age_list').append("<li class='dropdown-list-col select-dropdown-box-li'>"
				+ "<a href='javascript:void(0)' class='dropdown-list-link select-dropdown-box-link' id='age_" + j + "' onclick='select_age(this);' data-value='" + j + "'>" + j + "</a></li>");
		}
	}
}

//Click active
function select_age(event) {
	//$('.dropdown-list-col').click(function () {
	age_val = $(event).text();
	$('.dropdown-list-col').removeClass('active');
	$(this).addClass('active');
	$('.sort-dropdown-box').removeClass('show');
	$('.sort-dropdown-toggle').removeClass('show');
	$('.eldest_age').val(age_val);
	$('.eldest_age').addClass('value-added');
	$("#memAgeDropdown").toggle();
	//$('.spnElderAge').css({'transform': 'translateY(0px)', 'top':'0px;'});   //style="transform: translateY(0px);top:0px;"
	// });
}

$(".eldest_age").click(() => {
	$("#memAgeDropdown").toggle();
	// 		$("#memAgeDropdown").show();
	// 		// $(".eldest_age").toggle();
})
$("#memAgeDropdown").click(() => {
	ageDropdownActive = true;
})

function validatePIN(pin) {
	const regex = "[1-9][0-9]{5}";
	if (regex.match(pin)) {
		return true;
	} else {
		return false;
	}
}

// Health Pincode Validation
function forceNumeric(e) {
	e.target.value = e.target.value.replace(/[^\d]/g, '');
	return false;
}
function KeyPressEvent(event, type) {
	let pattern;
	pattern = /[0-9]/;
	const inputChar = String.fromCharCode(event.charCode);
	if (event.keyCode !== 8 && !pattern.test(inputChar)) { event.preventDefault(); }
}

function validateForm() {

	getPincode();   // Check pincode data   
	var name = "Test Test"; //document.forms["myForm"]["Name"];
	var city = "Mumbai"; //document.forms["myForm"]["City"];
	var phone = "9999999999"; // document.forms["myForm"]["Mobile"];
	ElderGender = "Male";//$("Eldest_mem_gen");
	var ElderAge = $('.eldest_age').val();
	var Pincode = $('#pincode').val();
	var testMemberValidation = false;

	var err = 0;
	var _rex = /^[a-zA-Z ]+$/;

	var sminsured = "500000"; //parseInt(amount.value);

	if (cnt_adult == 1 && cnt_child > 0) {
		new_mem_count_child = true;
	}
	if (cnt_adult === 0 && selected_child_count === 0) {
		err++;
		$('.member-count-input-field').addClass('has-error');
		$('#dropdownMenuButton12-error').css('display', 'block');
		$('#dropdownMenuButton12-error').html('Select Atleast one member');
		$('#errorTxt').css('display', 'none');
	}
	if (ElderAge === '' || ElderAge == undefined || ElderAge == null) {
		err++;
		$('.eldest_age').addClass('has-error');
		$('#dropdownMenuButton12-error').css('display', 'block');
		$('#dropdownMenuButton12-error').html('Member Age is required.');
		$('#errorTxt').css('display', 'none');
	}
	if (cnt_adult > 0 || selected_child_count > 0) {
		if (ElderAge == "" || ElderAge == null || ElderAge == undefined) {
			err++;
			$('.eldest_age').addClass('has-error');
			$('#dropdownMenuButton12-error').css('display', 'block');
			$('#dropdownMenuButton12-error').html('Member Age is required.');
			$('#errorTxt').css('display', 'none');
		} else {
			member1age = parseInt(ElderAge);
			$('.eldest_age').removeClass('has-error');
			$('#dropdownMenuButton12-error').css('display', 'none');
		}
	}

	if (Pincode == "") {
		err++;
		$('#pincode').addClass('has-error');
		$('#pincode_number_field-error').css('display', 'block');
		$('#errorTxt').css('display', 'none');
		$('#pincode_number_field-error').html('Pincode is required.');
	}
	else {
		$('#pincode').removeClass('has-error');
		$('#pincode_number_field-error').css('display', 'none');

	if ($("#hdCity_ID").val() == "") {
		err++;
		$('#pincode').addClass('has-error');
			$('#pincode_number_field-error').css('display', 'block');
			$('#pincode_number_field-error').html('Please Enter valid Pincode');
			$('#errorTxt').css('display', 'none');
	}

	if (Pincode.length > 0) {
		if (!(($('#pincode').val()).match(/^[0-9]{1}[0-9]{5}$/))) {
			err++;
			$('#pincode').addClass('has-error');
				$('#pincode_number_field-error').css('display', 'block');
				$('#pincode_number_field-error').html('Please Enter valid Pincode');
				$('#errorTxt').css('display', 'none');
		}
	}
	}

	if (cnt_adult > 0) {
		member1gender = ElderGender;
		$("#gen_1_input").val(member1gender);
	}

	if (cnt_adult > 0) {
		member1age = parseInt(ElderAge);
		$("#mem_1_input").val(parseInt(member1age));
	} else {
		member3age = parseInt(ElderAge);
		$("#mem_3_input").val(parseInt(member3age));
	}

	member_count = cnt_adult + selected_child_count;
	member1gender = ElderGender == "Male" ? "M" : "F";
	member3gender = "M";
		if ((member_count > 1 || member_count == 1) && cnt_adult > 0) {
		setDummyValues(member1age, member1gender);
	}
		if ((member_count > 1 || member_count == 1) && cnt_adult == 0) {
		setChildDummyValues(member3age, member3gender);
	}
	if (cnt_adult > 0) {
		if (member1gender === 'TM' || member1gender === 'TF' || member2gender === 'TM' || member2gender === 'TF') {
			insurer_selected = "42,10";
		}
	}
	if (cnt_adult == 0 && selected_child_count > 0) {
		if (member3gender === 'TM' || member3gender === 'TF') {
			insurer_selected = "42,10";
		}
	}
	if ((err > 2 || err == 2)) {
		if (Pincode.length == 0 && (ElderAge === '' || ElderAge == undefined || ElderAge == null)) {
			$('#pincode_number_field-error').css('display', 'none');
			$('#dropdownMenuButton12-error').css('display', 'none');
			$('#errorTxt').css('display', 'block');
		}
		else {

		}
	}
	if (err == 0) {
		$('#errorTxt').css('display', 'none');
		getStart();
	} else {
		//        $('.ErrMsgTxt').html('Please fill required data');
		//        $('.ErrMsg').show();
	}
}

function setDummyValues(mem1age, mem1gender) {
	var youngerAdult = 0;
	if (cnt_adult > 1) {
		member2gender = (mem1gender == "M" || mem1gender == "TM") ? "F" : "M";

		member2age = (mem1age - 2) <= 18 ? mem1age : mem1age - 1;
		//member2age = parseInt(member1age - 2);

		youngerAdult = (mem1gender == "M" || mem1gender == "TM") ? member2age : mem1age;
		$("#gen_2_input").val(member2gender);
		$("#mem_2_input").val(member2age);
	} else {
		youngerAdult = mem1age;
	}

	if (selected_child_count > 0) {
		for (var i = 3; i <= selected_child_count + 2; i++) {
			if (i == 3) {
				member3gender = "M";
				member3age = (youngerAdult - 18) < 1 ? 1 : (youngerAdult - 18);
				if (member3age >= 18) {
					member3age = 17;
				}
				if (member3age < 0) {
					member3age = 0;
				}
				$("#gen_3_input").val(member3gender);
				$("#mem_3_input").val(parseInt(member3age));

			} else {
				var j = i - 1;
				$("#gen_" + i + "_input").val($("#gen_" + j + "_input").val() == "M" ? "F" : "M");
				$("#mem_" + i + "_input").val(parseInt($("#mem_" + j + "_input").val()) - 2);
				if ($("#mem_" + i + "_input").val < 0) {
					$("#mem_" + i + "_input").val = 0;
				}
			}
		}
	}
}

function setChildDummyValues(member3age, member3gender) {
	for (var i = 3; i <= selected_child_count + 2; i++) {
		if (i == 3) {
			$("#gen_3_input").val(member3gender);
			$("#mem_3_input").val(parseInt(member3age));
			if (parseInt(member3age) >= 18) {
				$("#mem_3_input").val(17);
			}
		} else {
			var j = i - 1;
			$("#gen_" + i + "_input").val($("#gen_" + j + "_input").val() == "M" ? "F" : "M");
			$("#mem_" + i + "_input").val(parseInt($("#mem_" + j + "_input").val()) - 2);
			if ($("#mem_" + i + "_input").val() < 0) {
				$("#mem_" + i + "_input").val = 0;
			}
		}
	}
	$("#gen_1_input").val("");
	$("#mem_1_input").val("");
	$("#gen_2_input").val("");
	$("#mem_2_input").val("");
}

var getStart = function () {
	//validateForm();
	var srn = "";
	$('.loading').show();
	//var mainUrl = "quote/premium_initiate";

	//    mac_address = getParameterByName('mac_address');
	//    ss_id = getParameterByName('ss_id');
	//    fba_id = getParameterByName('fba_id');
	//    ip_address = getParameterByName('ip_address');
	//    app_version = getParameterByName('app_version');
	//    if (getParameterByName('mobile_no') == "" || getParameterByName('mobile_no') == null) {
	//        mobile_no = 0;
	//    } else {
	//        mobile_no = getParameterByName('mobile_no');
	//    }

	var member1Age = -1;
	var member2Age = -1;
	var member3Age = -1;
	var member4Age = -1;
	var member5Age = -1;
	var member6Age = -1;
	member1Age = $("#mem_1_input").val()=='' ? member1Age:  parseInt($("#mem_1_input").val());
	member2Age = $("#mem_2_input").val()=='' ? member2Age:  parseInt($("#mem_2_input").val());
	member3Age = $("#mem_3_input").val()=='' ? member3Age:  parseInt($("#mem_3_input").val());
	member4Age = $("#mem_4_input").val()=='' ? member4Age:  parseInt($("#mem_4_input").val());
	member5Age = $("#mem_5_input").val()=='' ? member5Age:  parseInt($("#mem_5_input").val());
	member6Age = $("#mem_6_input").val()=='' ? member6Age:  parseInt($("#mem_6_input").val());

	var str = {
		"product_id": 2,
		"ui_source": "UI22",
		"source": "desktop",
		"multi_individual": (cnt_adult == 0 && selected_child_count > 1) ? 'yes' : 'no',
		"contact_name": "NO NAME",
		"PremiumwithAddon": 0,
		"addon_uar": "no",
		"addon_ncb": "no",
		"addon_dsi": "no",
		"addon_cbb": "no",
		"addon_rmw": "no",
		"addon_hdc": "no",
		"addon_aru": "no",
		"addon_ursi": "no",
		"addon_sncp": "no",
		"addon_ca": "no",
		"addon_ci": "no",
		"addon_Hdc": "no",
		"addon_Pa": "no",
		"addon_protector": "no",
		"addon_cover": "no",
		"addon_time": "no",
		"addon_global": "no",
		"freeAddOnCover": "no",
		"mobile": 9999999999,
		"email": "abc@gmail.com",
		"adult_count": cnt_adult,
		"child_count": selected_child_count,
		"city_id": parseInt($("#hdCity_ID").val()),
		"city_name": $("#hdCity_name").val(),
		"permanent_pincode": parseInt($('#pincode').val()),
		"state_name": $("#hdState_name").val(),
		"health_insurance_si": "1000000",
		"member_2_gender": $("#gen_2_input").val(),
		"member_3_gender": $("#gen_3_input").val(),
		"member_4_gender": $("#gen_4_input").val(),
		"member_5_gender": $("#gen_5_input").val(),
		"member_6_gender": $("#gen_6_input").val(),
		"member_1_age": isNaN(member1Age) == true ? "" : parseInt(member1Age),
		"member_2_age": isNaN(member2Age) == true ? "" : parseInt(member2Age),
		"member_3_age": isNaN(member3Age) == true ? "" : parseInt(member3Age),
		"member_4_age": isNaN(member4Age) == true ? "" : parseInt(member4Age),
		"member_5_age": isNaN(member5Age) == true ? "" : parseInt(member5Age),
		"member_6_age": isNaN(member6Age) == true ? "" : parseInt(member6Age),
		"policy_tenure": policy_tenure,
		"method_type": "Premium",
		"health_insurance_type": member_count > 1 ? "floater" : "individual",
		"execution_async": "yes",
		"crn": 0,
		"ss_id": ss_id,
		"agent_source": "0",
		"secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
		"client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
		"fba_id": fba_id,
		"sub_fba_id": sub_fba_id,
		"ip_address": ip_address ? ip_address : "",
		"geo_lat": geo_lat ? geo_lat : 0,
		"geo_long": geo_long ? geo_long : 0,
		"ip_city_state": ip_city_state ? ip_city_state : "",
		"app_version": app_version && app_version.includes('policyboss-') ? app_version : "PolicyBoss.com",
		//"mac_address": mac_address,
		"quick_quote": true,
		"insurer_selected": insurer_selected,
		"topup_applied": "none",
		"eldest_mem_gender": null,
		"contact_name_mob": null,
		"mobile_mob": null,
		"member_1_gender_mob": null,
		"is_quick_quote" : "yes"
	};

	if (utm_source != '' && utm_source != null) { post["utm_source"] = utm_source; }
	if (utm_medium != '' && utm_medium != null) { post["utm_medium"] = utm_medium; }
	if (utm_campaign != '' && utm_campaign != null) { post["utm_campaign"] = utm_campaign; }
	if (campaign_id != '' && campaign_id != null) { post["campaign_id"] = campaign_id; }
	if ($('#gen_1_input').val() == 'Male' || $('#gen_1_input').val() == 'M') {
		str['member_1_gender'] = 'M';
	}
	else if ($('#gen_1_input').val() == 'FeMale' || $('#gen_1_input').val() == 'F') {
		str['member_1_gender'] = 'F';
	}
	else {
		str['member_1_gender'] = '';
	}


	if (app_version && app_version.includes('policyboss-')) {
		str['mac_address'] = (mac_address === undefined) ? "1.1.1.1" : mac_address;
	}
	let checkEldestMemberAge = parseInt($('.eldest_age').val());
	if (isNaN(checkEldestMemberAge)) {
		console.log('Please Enter valid Eldest Member Age');
		str["elder_mem_age"] = '';
	}
	else if (!isNaN(checkEldestMemberAge)) {
		str["elder_mem_age"] = checkEldestMemberAge;
	}

	console.log(str);
	console.log(JSON.stringify(str));
	$.ajax({
		type: "POST",
		data: JSON.stringify(str),
		url: GetUrl() + "/quote/premium_initiate",
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		success: function (data) {
			console.log(data);
			$('.loading').hide();
			if (data.hasOwnProperty('Status') && data['Status'] === "VALIDATION") {
				let validationMsg = '';
                validationMsg = data['Details'].join('</br>');
				$("#div_errorvalidation").html("");
				$("#div_errorvalidation").html(validationMsg);
				$('#POSP_Validation').show();
				$('#POSP_Validation').modal('show');
			} else {
				Premium_initiate = data;
				console.log('premium_initiate data', Premium_initiate);
				srn = data['Summary']['Request_Unique_Id'];
				console.log(data['Summary']['Request_Unique_Id']);
				udid = (srn).split("_")[1];
				console.log("UDID 1", udid);
				if (client_id === undefined) {
					client_id = 2;
				}
			}
			if ((app_version && app_version.includes('policyboss-')) && (ss_id !=="" && ss_id !=="undefined" && ss_id !=="0" && fba_id !== "" && fba_id !== undefined && fba_id !== "0" && app_version !== "" && app_version !== undefined && app_version !== "0")) {
				window.location.href = getWebsiteUrl() + '/health-insurance-UI22/quotes?SID=' + srn + '&ClientID=' + client_id + "&ss_id=" + ss_id + "&fba_id=" + fba_id + "&sub_fba_id=" + sub_fba_id + "&ip_address=" + ip_address + "&mac_address=" + mac_address + "&app_version=" + app_version + "&product_id=" + Product_id;
			} else {
				window.location.href = getWebsiteUrl() + '/health-insurance/quotes?SID=' + srn + '&ClientID=' + client_id;
			}
			// window.location.href = getWebsiteUrl() + '/health-insurance/quotes?SID=' + srn + '&client_id=2';
			// window.location.href = 'https://qa-www.policyboss.com/health-insurance/quotes?SID=' + srn + '&client_id=2';           
		},
		error: function (result) {
			$('.loading').hide();
		}
	});
};

function getPincode() {
	for (var i = 0; i < pincode_data.length; i++) {
		if (pincode_data[i]["Pincode"] == $("#pincode").val()) {
			$('#City').val(pincode_data[i]['City']);
			$('#hdState_name').val(pincode_data[i]['State']);
			$('#hdCity_ID').val(pincode_data[i]['City_Id']);
			$('#hdPincode').val(pincode_data[i]['Pincode']);
			$('#hdState_Code').val(pincode_data[i]['State_Code']);
			$('#hdCity_name').val(pincode_data[i]['City']);
		}

	}
}

function pincodes() {
	$.ajax({
		type: "GET",
		url: GetUrl() + "/quote/getPincodes", //https://horizon.policyboss.com:5443/quote/getPincodes
		success: function (data) {
			pincode_data = data;
			console.log(pincode_data);
		},
		error: function (result) {

		}
	});
}
function selectDropdown(obj,src,value) {
	var selText = $(obj).text().trim();
	$(obj).closest('.input-field-box').find('.select-dropdown').val(selText);
	$(obj).closest('.input-field-box').find('.select-dropdown').removeClass('show');
	$(obj).closest('.input-field-box').find('.select-dropdown-box').removeClass('show');
	if(src=='vehicleSubClass'){
		if(vehSubClass !== value){
			$("#MakeModelVarientFuel").val('');
		}
		vehSubClass = value;
		getMakePopup(value);
	}
}
function isNumber(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if ((charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
};
/*function navDashBoard(){
	window.location.href = 'https://www.policyboss.com/UI22/dashboard.html?ss_id=' + ss_id + '&fba_id=' + fba_id + '&sub_fba_id=' + sub_fba_id + '&ip_address=' + ip_address + '&mac_address=' + mac_address + '&app_version=' + app_version + '&product_id=' + Product_id;
}*/
function navDashBoard(){
	if (app_version && app_version.includes('policyboss-')) {
		window.location.href = 'https://www.policyboss.com/UI22/dashboard.html?ss_id=' + ss_id + '&fba_id=' + fba_id + '&sub_fba_id=' + sub_fba_id + '&ip_address=' + ip_address + '&mac_address=' + mac_address + '&app_version=' + app_version + '&product_id=' + Product_id;
	} else {
	let dashboard_prod_id = "";
	if (window.location.href.includes('car-insurance')) {
		dashboard_prod_id = 1;
	} else if (window.location.href.includes('two-wheeler-insurance')) {
		dashboard_prod_id = 10;
	} else if (window.location.href.includes('commercial-vehicle-insurance')) {
		dashboard_prod_id = 12;
	} else if (window.location.href.includes('health-insurance')) {
		dashboard_prod_id = 2;
	}
    window.location.href = (window.location.href.includes("https") ? "https:" : "http:") + ("//www.policyboss.com/dashboard/?product_id=" + dashboard_prod_id);
	}
}
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
function contactus_save_data() {
    var res = validation();
    if (res == true) {
        SaveData();
    } else {
        return false;
    }
}
function validation() {
    var value = 0;
    var $ContactMobile = $("#ContactMobile");
    var $ContactCity = $("#ContactCity");
    var $ContactName = $("#ContactName");

    if ($("#ContactName").val() == "" || $("#ContactName").val() == null) {
        $('#ContactName').addClass('has-error');
        value = 1;
    } else {
        $('#ContactName').removeClass('has-error');
    }

    if ($("#ContactMobile").val() == "" || checkMobile($ContactMobile) == false) {
        $('#ContactMobile').addClass('has-error');
        value = 1;
    } else {
        $('#ContactMobile').removeClass('has-error');
    }

    if ($("#ContactCity").val() == "" || $("#ContactCity").val() == null) {
        $('#ContactCity').addClass('has-error');
        value = 1;
    } else {
        $('#ContactCity').removeClass('has-error');
    }

    if ($("#ContactselectCity").val() == "I would like to know about.." || $("#ContactselectCity").val() == null) {

        $('#ContactselectCity').addClass('has-error');
        value = 1;
    } else {
        $('#ContactselectCity').removeClass('has-error');
    }

    if ($("#Contactcomment").val() == "" || $("#Contactcomment").val() == null) {

        $('#Contactcomment').addClass('has-error');
        value = 1;
    } else {
        $('#Contactcomment').removeClass('has-error');
    }
	if ($("#ContactselectCity").val() == "Select Product" || $("#ContactselectCity").val() == null) {
        $('#ContactselectCity').addClass('has-error');
        value = 1;
    } else {
        $('#ContactselectCity').removeClass('has-error');
    }

    if (value == 0) {
        return true;
    } else {
        return false;
    }

}

function SaveData() {
    var Data = {
        "ContactName": $("#ContactName").val(),
        "ContactMobile": $("#ContactMobile").val(),
        "ContactCity": $("#ContactCity").val(),
        "ContactselectCity": $("#ContactselectCity").val(),
        "Contactcomment": $("#Contactcomment").val()
    };
    $.ajax({
        url: GetUrl() + '/postservicecall/ContactUs',
        async: false,
        type: "POST",
        data: JSON.stringify(Data),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response['Msg'] >= 1) {

                alert("Your inquiry has been submitted. One of our team members will get in touch with you shortly.");
                $("#ContactName").val("").attr("placeholder", "Full Name");
                $("#ContactMobile").val("").attr("placeholder", "Mobile Number");
                $("#ContactCity").val("").attr("placeholder", "City");
                $("#ContactselectCity").val("").attr("placeholder", "selectCity ");
                $("#Contactcomment").val("").attr("placeholder", "Comments");
                if(window.location.href.includes("contact-us")){
                window.location.href = '/contact-us';
                }
            } else {
                alert("Error occured on sending inquiry.");
            }

        }
    });
}
function checkMobile(input) {
    var pattern = new RegExp("^[6-9]{1}[0-9]{9}$");
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) {
        $('#' + dvid).addClass('has-error');
        return false;
    } else {
        $('#' + dvid).removeClass('has-error');
        return true;
    }
}
function stringparam() {
	app_version = getUrlVars()["app_version"];
	if (app_version && app_version.startsWith('1.0')) {
		app_version = "ios-policyboss-" + app_version;
	}
	if (app_version && app_version.includes('policyboss-')) {
		ss_id = getUrlVars()["ss_id"]  === undefined ? "" :getUrlVars()["ss_id"];
		fba_id = getUrlVars()["fba_id"] === undefined ? "" : getUrlVars()["fba_id"];
		ip_address = getUrlVars()["ip_address"] === undefined ? "" : getUrlVars()["ip_address"];
		mac_address = getUrlVars()["mac_address"];
		client_id = getUrlVars()["ClientID"] === undefined ? 2 : getUrlVars()["ClientID"];
		Product_id = getUrlVars()["product_id"];
		sub_fba_id = getUrlVars()["sub_fba_id"] === undefined ? 0 : getUrlVars()["sub_fba_id"];
		utm_source = getUrlVars()["utm_source"];
		utm_campaign = getUrlVars()["utm_campaign"];
		utm_medium = getUrlVars()["utm_medium"];
		
		if (ss_id !=="" && ss_id !==undefined && ss_id !=="0" && fba_id !== "" && fba_id !== undefined && fba_id !== "0" && app_version !== "" && app_version !== undefined && app_version !== "0") {
			$('.divHeaderSection, .divFooterSection, .warningmsg').hide();
			$('.dashboardIcon').show();
		} else if (ss_id ==="" || ss_id ===undefined || ss_id ==="0" || fba_id === "" || fba_id === undefined || fba_id === "0" || app_version === "" || app_version === undefined || app_version === "0") {
			$('.divHeaderSection, .divFooterSection, .dashboardIcon, .home-bg').hide();
			$(".warningmsg").show();
			$("#error_query_str").text(window.location.href.split('?')[1]);
		}
	}else if(getUrlVars()["ss_id"]  !=="" && getUrlVars()["ss_id"]  !== undefined && getUrlVars()["ss_id"] !== "0" && getUrlVars()["fba_id"] !== "" && getUrlVars()["fba_id"] !== 		undefined && getUrlVars()["fba_id"] !== "0" && (getUrlVars()["app_version"] === "" || getUrlVars()["app_version"] === undefined || getUrlVars()["app_version"] === "0")){
			$('.divHeaderSection, .divFooterSection, .dashboardIcon, .home-bg').hide();
			$(".warningmsg").show();
			$("#error_query_str").text(window.location.href.split('?')[1]);
	} else {
		horizon_get_session();
	}
}
function validateAlphabets(e) {
	var regex = new RegExp("^[a-zA-Z ]*$");
	var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
	if (regex.test(str)) {
		return true;
	} else {
		e.preventDefault();
		return false;
	}
}