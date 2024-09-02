
$('#Salutation').focusout(function () {
    //$("#Gender").val("F");
    if ($("#Salutation").val() == "0" || $("#Salutation").val() == "TITLE" || $("#Salutation").val() == "Mr") {
        $("#MaritalStatus").val("0");
        $("#Gender").val("M");
    }
    else if ($("#Salutation").val() == "Miss") {
        $("#MaritalStatus").val("S");
        $("#Gender").val("F");
    }
    else if ($("#Salutation").val() == "Mrs") {
        $("#MaritalStatus").val("M");
        $("#Gender").val("F");
    }
    else if ($("#Salutation").val() == "Lady") {
        $("#Gender").val("F");
    }
    else if ($("#Salutation").val() == "Mast") {
        $("#MaritalStatus").val("S");
        $("#Gender").val("M");
    }
    else if ($("#Salutation").val() == "Shri") {
        $("#Gender").val("M");
    }
    else if ($("#Salutation").val() == "Mis") {
        $("#Gender").val("F");
    }
    else if ($("#Salutation").val() == "Mst") {
        $("#Gender").val("M");
    }
});

var _salutations = {
    "0": "TITLE",
    "Mr": "Mr",
    "Miss": "Miss",
    "Mrs": "Mrs",
    "Prof": "Prof",
    "Dr": "Dr",
    "Lady": "Lady",
    "Rev": "Rev",
    "CA": "CA",
    "Lt": "Lt",
    "Mast": "Mast",
    "Phd": "Phd",
    "Maj": "Maj",
    "Gen": "Gen",
    "Sist": "Sist",
    "Capt": "Capt",
    "Hon": "Hon",
    "Justice": "Justice",
    "Col": "Col",
    "Shri": "Shri",
    "Adv": "Adv",
    "Mis": "Mis",
    "Cust": "Cust",
    "Mst": "Mst",
    "Md": "Md",
    "Major": "Major",
    "Wing Cdr": "Wing Cdr",
    "Brig": "Brig",
    "Mstr": "Mstr",
    "Wing Commander": "Wing Commander"
};

var _MaritalStatus = {
    "0":"MARITAL STATUS",
    "M": "Married",
    "S": "Single",
    "D": "Divorced",
    "W": "Widowed"
};

var _occupation = {
        0: "Select Occupation",
         "BUSINESS": "BUSINESS",
         "SALARIED": "SALARIED",
         "PROFESSIONAL": "PROFESSIONAL",
         "STUDENT": "STUDENT",
         "HOUSEWIFE": "HOUSEWIFE",
         "RETIRED": "RETIRED",
         "OTHERS": "OTHERS"
};

var _nominee = {
    "0": "SELECT RELATION",
    "Aunt": "Aunt",
    "Brother": "Brother",
    "Brother-In-law": "Brother-In-law",
    "CHAUFFEUR": "CHAUFFEUR",
    "chaffeur": "chaffeur",
    "Daughter": "Daughter",
    "Daughter-In-law": "Daughter-In-law",
    "Employee": "Employee",
    "Employer": "Employer",
    "FRIEND": "FRIEND",
    "Father": "Father",
    "Father-In-law": "Father-In-law",
    "Fiance": "Fiance",
    "Friend": "Friend",
    "Granddaughter": "Granddaughter",
    "Grandfather": "Grandfather",
    "GrandMother": "GrandMother",
    "Grandson": "Grandson",
    "Husband": "Husband",
    "INSURED (SELF-DRIVING)": "INSURED (SELF-DRIVING)",
    "Insured": "Insured",
    "Insured Estate": "Insured Estate",
    "Mother": "Mother",
    "Mother-In-law": "Mother-In-law",
    "Nephew": "Nephew",
    "Niece": "Niece",
    "OTHERS": "OTHERS",
    "Owner": "Owner",
    "Partner": "Partner",
    "RELATIVE": "RELATIVE",
    "Relatives": "Relatives",
    "Self": "Self",
    "Sister": "Sister",
    "Sister-In-law": "Sister-In-law",
    "Son": "Son",
    "Son-In-law": "Son-In-law",
    "Spouse": "Spouse",
    "Uncle": "Uncle",
    "Wife": "Wife"
};
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
$('#divPANNo').hide();