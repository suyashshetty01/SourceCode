var _salutations = {
    "0": "TITLE",
    "MR": "MR",
    "MRS": "MRS",
    "MS": "MS",
    "MISS":"MISS",
    "M/s":"M/s"
};
var _MaritalStatus = {
    "0": "MARITAL STATUS",
    "M": "Married",
    "S": "UnMarried",
    "D": "Divorced",
    "W": "Widowed"
};
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

var _occupation = {
    0: "Select Occupation",
    "8": "Self employed Professional",
    "9": "Businessman/Industrialist Large Scale",
    "24": "Service",
    "20": "Others",
};

var _nominee = {
    "0": "SELECT RELATION",
    "Self": "Self",
    "Wife": "Wife",
    "Husband": "Husband",
    "Father": "Father",
    "Mother": "Mother",
    "Daughter": "Daughter",
    "Brother": "Brother",
    "Son":"Son"
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

$("#RegisteredCityName").removeAttr('readonly');
$("#ContactCityName").removeAttr('readonly');
$('.divLocality').hide();
$('#divInstitutionCity').show();

