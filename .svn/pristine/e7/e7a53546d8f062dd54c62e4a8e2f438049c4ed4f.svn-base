
$('#Salutation').focusout(function () {
    $("#Gender").val("F");
    if ($("#Salutation").val() == "0" || $("#Salutation").val() == "TITLE" || $("#Salutation").val() == "MR") {
        $("#MaritalStatus").val("0");
        $("#Gender").val("M");
    }
    else if ($("#Salutation").val() == "MS")
        $("#MaritalStatus").val("M");
    else if ($("#Salutation").val() == "MRS")
        $("#MaritalStatus").val("S");
});

var _MaritalStatus = {
    "0": "MARITAL STATUS",
    "M": "Married",
    "S": "UnMarried"
};

$('.divGender').hide();
$('.divContactOccupationId').hide();

function GetCityCityIdState(Pincode, State, City, CityID, Locality,FnCallBack) {
    $(Locality).empty();//$("#ddlContactCityID").empty();
    $(State).addClass('used');//$('#StateName').addClass('used');
    $(City).addClass('used');//$('#CityName').addClass('used');
    $.get('/CarInsuranceIndia/Get_Hdfc_City?Pincode=' + Pincode, function (response) {
        var _response = $.parseJSON(response);
        $(City).val(_response.District);//$("#DistrictName").val(_response.District);
        $(State).val(_response.State);//$("#StateName").val(_response.State);
        $(CityID).val(_response.CityId);//$("#ContactCityID").val(_response.CityId);
        $(Locality).append("<option value='0'>LOCALITY</option>");
        for (var i = 0; i < _response.Locality.length; i++) {
            $(Locality).append("<option value='" + (i + 1 )+ "'>" + _response.Locality[i].PINCODE_LOCALITY + "</option>");
            //$("#ddlContactCityID").append("<option value='" + _response.Locality[i].LV_Contact_City_PK + "'>" + _split[0] + "</option>");
        }
        if (parseInt("0") > 0) { $('#' + Locality).val("0"); }
        if (typeof FnCallBack !== 'undefined') {
            eval(FnCallBack);
        }
    });
}

var _nominee = {
    "0": "SELECT RELATION",
    "2": "Son",
    "3": "Spouse",
    "6": "Daughter",
    "8": "Father",
    "16": "Mother",
    "25": "Guardian",
    "27": "Others"
};
$('#NomineeRelationID').empty();
$.each(_nominee, function (val, text) {
    $('#NomineeRelationID').append(new Option(text, val));
});