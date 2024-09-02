function openSelectCVModal(displayType) {
    
    $('#triggerSelectCVDetails').trigger('click');
    $('.SelectCarDetail-modal').hide();
    if (displayType == 'hidden') {
        $('.WithoutVehicleNumber-modal').hide();
        $('.NewVehicle-modal').show();
        $('.after-submit-vehicle-modal').hide();
    }if (displayType == 'not_hidden'){
        $('.NewVehicle-modal').hide();
        $('.WithoutVehicleNumber-modal').show();
        $('.after-submit-vehicle-modal').hide();
    }
    if (displayType == 'ibuddy') {
        $('.NewVehicle-modal').hide();
        $('.WithoutVehicleNumber-modal').hide();
        $('.after-submit-vehicle-modal').show();
    }
}

function openPrevSelectVehicleModal() {
    $('.SelectCarDetail-modal').hide();
    var modalName = $('#selectVehicleModalBackBtn').attr('data-modal-name');
    $('.'+modalName).show("slide", {direction:"left"}, 500);
}

function showSelectCommercialVehicalDetails(modal) {
    $('.'+modal).hide();
    if (modal == 'WithoutVehicleNumber-modal') {
        console.log(modal);
        $('#vehicle-detail-form').show();
        $('#new-vehicle-detail-form').hide();
        $('#after-submit-vehicle-detail-form').hide();
    }
    if (modal == 'NewVehicle-modal') {
        $('#new-vehicle-detail-form').show();
        $('#vehicle-detail-form').hide();
        $('#after-submit-vehicle-detail-form').hide();
    }
    if (modal == 'after-submit-vehicle-modal') {
        console.log('ibuddy clicked');
        // $('#my_iBuddy').hide()
        // $('.WithoutCarNumber-modal').hide();
        // $('.NewCar-modal').hide()
        $('#vehicle-detail-form').hide();
        $('#new-vehicle-detail-form').hide();
        $('#after-submit-vehicle-detail-form').show();
    }
    $('.SelectCarDetail-modal').find('.nav-tabs').each(function () {
        if ($(this).attr('data-for-modal') != modal){
            $(this).hide();
        }else{
            $(this).show();
        }
    })
    var tempNavLinkCounter = 0;
    
    $('#selectCVDetails').find('.'+modal+'-nav-tabs').find('.nav-link').each(function () {
        tempNavLinkCounter = tempNavLinkCounter+1;
        console.log("temp = " + tempNavLinkCounter);
        if (tempNavLinkCounter == 1) {
            $(this).addClass('active');
        }else{
            $(this).removeClass('active');
        }
    })
    if (modal == 'WithoutVehicleNumber-modal') {
        $('#vehicle-detail-form').find('.tab-pane').each(function () {
            $(this).removeClass('active');
        });
        $('#vehicle-detail-form').find('#nav-make-vehicle').addClass('active');
    }
    if (modal == 'NewVehicle-modal') {
        $('#new-vehicle-detail-form').find('.tab-pane').each(function () {
            $(this).removeClass('active');
        });
        $('#new-vehicle-detail-form').find('#nav-make-vehicle-2').addClass('active');
    }
    if (modal == 'after-submit-vehicle-modal') {
        $('#after-submit-vehicle-detail-form').find('.tab-pane').each(function () {
            $(this).removeClass('active');
        });
        $('#after-submit-vehicle-detail-form').find('#nav-make-vehicle-3').addClass('active');

        var tempValues = $('#after-submit-modal-prefiled-input').val()
            var tempValuesArr = tempValues.split(', ');
            var CarBran = tempValuesArr[0]
            var CarMode = tempValuesArr[1]
            var CarFuelType = tempValuesArr[2]
            var CarVariant = tempValuesArr[3]

        if($( window ).width() > 768){
            
            $('#nav-make-vehicle-tab-3').text(CarBran);
            $('#nav-model-vehicle-tab-3').text(CarMode);
            $('#nav-fuel-vehicle-tab-3').text(CarFuelType);
            $('#nav-variant-vehicle-tab-3').text(CarVariant);
            
        }

        $('#nav-make-vehicle-tab-3').addClass('visited');
        $('#nav-model-vehicle-tab-3').addClass('visited');
        $('#nav-fuel-vehicle-tab-3').addClass('visited');
        $('#nav-variant-vehicle-tab-3').addClass('visited');

        $('#nav-make-vehicle-3').find('.select-brand-listing-col').each(function(){
            var tempInpVal = $(this).find('.form-check-input').attr('data-value')
            if (tempInpVal == CarBran) {
                $(this).find('.form-check-input').prop('checked', true);
            }
        })
        $('#nav-model-vehicle-3').find('.select-model-listing-col').each(function(){
            var tempInpVal = $(this).find('.form-check-input').attr('data-value')
            if (tempInpVal == CarMode) {
                $(this).find('.form-check-input').prop('checked', true);
            }
        })
        $('#nav-fuel-vehicle-3').find('.select-fuel-listing-col').each(function(){
            var tempInpVal = $(this).find('.form-check-input').attr('data-value')
            if (tempInpVal == CarFuelType) {
                $(this).find('.form-check-input').prop('checked', true);
            }
        })
        $('#nav-variant-vehicle-3').find('.select-variant-listing-col').each(function(){
            var tempInpVal = $(this).find('.form-check-input').attr('data-value')
            if (tempInpVal == CarVariant) {
                $(this).find('.form-check-input').prop('checked', true);
            }
        })
    }
    
    $('.SelectCarDetail-modal').show("slide", {direction:"right"}, 500);
    $('#selectVehicleModalBackBtn').attr('data-modal-name',modal);
    // $('#nav-make-tab-3').removeClass('active');
    // $('#nav-make-3').removeClass('active'); 
}
function openPrevSelectVehicleModal() {
    $('.SelectCarDetail-modal').hide();
    var modalName = $('#selectCarModalBackBtn').attr('data-modal-name');
    $('.'+modalName).show("slide", {direction:"left"}, 500);
}