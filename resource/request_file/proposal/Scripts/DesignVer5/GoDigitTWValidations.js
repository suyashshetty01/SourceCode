/*function GetCityCityIdState(Pincode, State, City, CityID, Locality, FnCallBack) {
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


        
    });
}
*/
$('#Salutation').focusout(function () {
    $("#Gender").val("F");
    if ($("#Salutation").val() == "0" || $("#Salutation").val() == "TITLE" || $("#Salutation").val() == "MR") {
        $("#MaritalStatus").val("0");
        $("#Gender").val("M");
    }
    else if ($("#Salutation").val() == "MS")
        $("#MaritalStatus").val("S");
    else if ($("#Salutation").val() == "MRS")
        $("#MaritalStatus").val("M");
});
if (parseInt("0") > 0) { $('#' + Locality).val("0"); }
if (typeof FnCallBack !== 'undefined') {
    eval(FnCallBack);
}

$('#divPANNo').hide();
$('#divContactOccupationId').hide();
//$('.divLocality').hide();


var _occupation = {
    0: "Select Occupation",
    "0001": "Media / Sports / Armed forces",
    "0002": "Government employees",
    "0003": "Professionals (CA, Doctor, lawyer)",
    "0004": "Private (Sales and marketing)",
    "0005": "Private (other than Sales / marketing)",
    "0006": "Self employed / self business",
    "0007": "Others"
};

var _nominee = {
    "0": "SELECT RELATION",
    "DAUGHTER": "daughter",
    "DAUGHTER_IN_LAW": "daughter in Law",
    "GRAND_CHILD": "grand Child",
    "HEAD": "head",
    "MOTHER": "mother",
    "SON": "son",
    "SPOUSE": "spouse",
    "HUSBAND": "husband",
    "OTHER": "other",
    "LONGTIME_PARTNER": "longtime Partner",
    "CHILD": "child",
    "FATHER":"father"
};


