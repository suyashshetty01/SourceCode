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
    "SINGLE": "Unmarried",
};

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
}
$('.divLocality').hide();
$('#divPANNo').hide();
$('.divContactOccupationId').hide();
