var _MaritalStatus = {
    "0": "MARITAL STATUS",
    "M": "Married",
    "U": "UnMarried"
};

var _nominee = {
    "0": "SELECT RELATION",
    "Cleaner": "Cleaner",
    "Conductor": "Conductor",
    "Employee": "Employee",
    "Father": "Father",
    "Father-in-Law": "Father-in-Law",
    "Grand Daughter": "Grand Daughter",
    "Grand Son": "Grand Son",
    "Mother": "Mother",
    "Mother-in-Law": "Mother-in-Law",
    "Own Children": "Own Children",
    "Owner Driver": "Owner Driver",
    "Paid Driver": "Paid Driver",
    "Spouse": "Spouse",
    "Unmarried Brother": "Unmarried Brother",
    "Unmarried Sister": "Unmarried Sister"
};

var _occupation = {
    "0": "Select Occupation",
    "STDN": "STUDENT",
    "RETD": "RETIRED",
    "HSWF": "HOUSEWIFE",
    "BCON": "BUSINESSMAN",
    "SWPR": "SOFTWARE PROFESSIONAL",
    "SHOP": "SHOP OWNER",
    "DOCT": "DOCTOR",
    "OTHR": "OTHER",  
};

/*
function GetCityCityIdState(Pincode, State, City, CityID, Locality,FnCallBack) {
    $(Locality).empty();
    $(State).addClass('used');
    $(City).addClass('used');
    $.get('/CarInsuranceIndia/Get_Iffco_Contact_City?Pincode=' + Pincode, function (response) {
        var _response = $.parseJSON(response);
        $(City).val(_response.District);
        $(State).val(_response.State);
        $(CityID).val(_response.CityId);//citycode
        $('#State_Id').val(_response.StateId);//statecode
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
    });*/

$('#divPANNo').hide();
