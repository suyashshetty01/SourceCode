var _nominee = {
    "0": "SELECT RELATION",
    "Son": "Son",
    "Spouse": "Spouse",
    "Brother": "Brother",
    "Daughter": "Daughter",
    "Father": "Father",
    "Mother": "Mother"
};
var _colour = {
    "0" : "SELECT COLOUR",
    "Metallic" : "Metallic",
    "Non-metallic" : "Non-metallic",
    "Others" : "Others"
};
$('#VehicleColor').empty();
$.each(_colour, function (val, text) {
    $('#VehicleColor').append(new Option(text, val));
});
/*
function GetCityCityIdState(Pincode, State, City, CityID, Locality,FnCallBack) {
    $(Locality).empty();//$("#ddlContactCityID").empty();
    $(State).addClass('used');//$('#StateName').addClass('used');
    $(City).addClass('used');//$('#CityName').addClass('used');
    $.get('/CarInsuranceIndia/GetLibartycity?Pincode=' + Pincode, function (response) {
        var _response = $.parseJSON(response);
        $(City).val(_response.District);//$("#DistrictName").val(_response.District);
        $(State).val(_response.State);//$("#StateName").val(_response.State);
        $(CityID).val(_response.CityId);//$("#ContactCityID").val(_response.CityId);
        $(Locality).append("<option value='0'>LOCALITY</option>");
        for (var i = 0; i < _response.Locality.length; i++) {
            var _split = (_response.Locality[i].TXT_PINCODE_LOCALITY).split(",");
            $(Locality).append("<option value='" + _response.Locality[i].LV_Contact_City_PK + "'>" + _split[0] + "</option>");
            //$("#ddlContactCityID").append("<option value='" + _response.Locality[i].LV_Contact_City_PK + "'>" + _split[0] + "</option>");
        }
        if (parseInt("0") > 0) { $('#' + Locality).val("0"); }
        if (typeof FnCallBack !== 'undefined') {
            eval(FnCallBack);
        }
    });
}*/

$('.divContactOccupationId').hide();
$('.divGender').hide();
$('#divMaritalStatus').hide();
$('#divPANNo').hide();
