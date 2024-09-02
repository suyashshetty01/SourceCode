var _nominee = {
    "0": "SELECT RELATION",
    "Spouse":"Spouse",
    "Brother": "Brother",
    "Father": "Father",
    "Mother": "Mother",
    "Son": "Son",
    "OTHERS": "OTHERS"
};

var _MaritalStatus = {
    "0": "MARITAL STATUS",
    "MARRIED": "Married",
    "SINGLE": "Single",
    "DIVORCED": "Divorced",
    "WIDOW": "Widow"
};

var _ReasonforCPA = {
    "0": "Reason for no opting CPA",
    "valid_driving_license": "No valid driving license",
    "other_motor_policy": "Other motor policy with CPA Cover",
    "is_standalone_cpa": "Have standalone CPA with SI>=15 lakh",
};
/*
function GetCityCityIdState(Pincode, State, City, CityID, Locality, FnCallBack) {
    $(Locality).empty();//$("#ddlContactCityID").empty();
    $(State).addClass('used');//$('#StateName').addClass('used');
    $(City).addClass('used');//$('#CityName').addClass('used');
    $.get('/CarInsuranceIndia/Get_Tata_City?Pincode=' + Pincode, function (response) {
        var _response = $.parseJSON(response);
        $(City).val(_response.District);//$("#DistrictName").val(_response.District);
        $(State).val(_response.State);//$("#StateName").val(_response.State);
        $(CityID).val(_response.Locality[0].NUM_CITY_CD);//$("#ContactCityID").val(_response.CityId);
        $('#State_Id').val(_response.Locality[0].NUM_STATE_CD);
        $('#District_Id').val(_response.Locality[0].NUM_CITYDISTRICT_CD);
        if (parseInt("0") > 0) { $('#' + Locality).val("0"); }
        if (typeof FnCallBack !== 'undefined') {
            eval(FnCallBack);
        }
    });
}*/
$('.divLocality').hide();
$('#divPANNo').hide();
$('.divContactOccupationId').hide();

//$('#ChasisNumber').focusout(function () {
    
//    var ValidationArray = [];
//    $ChasisNumber = $('#ChasisNumber');
//    if ($ChasisNumber.val() == "" || $ChasisNumber.val().length !== 17 || pattern.test($ChasisNumber.val()) == false || checkText($('#ChasisNumber')) == true)

//    { $('#dvChasisNumber').addClass('Error'); ValidationArray.push('ChasisNumber'); ValidateError++; }
//    else { $('#dvChasisNumber').removeClass('Error'); }

//});


