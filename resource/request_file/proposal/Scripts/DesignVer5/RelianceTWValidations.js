var _salutations = {
    "0": "TITLE",
    "Mr.": "Mr",
    "Mrs.": "Mrs",
    "Miss.": "Miss",
    "Ms.": "Ms",
    "Dr.": "Dr",
    "M/S": "M/S"
};

$(".divGender").show();

var _MaritalStatus = {
    "0": "MARITAL STATUS",
    "1951": "Married",
    "1952": "Single",
    "1953": "Divorcee",
    "1954": "Widow",
    "1994": "Widower"
};

var _occupation = {
    "0": "OCCUPATION",
    "6": "A/C DUCTMAN",
    "7": "Advocate / Lawyer",
    "8": "Businessman/Industrialist Large Scale",
    "9": "Businessman/Industrialist Medium Scale",
    "10": "Businessman/Industrialist Small Scale",
    "11": "Carpenter",
    "12": "Chartered Accountants",
    "13": "Clerical",
    "14": "Cook",
    "15": "ELECTRIC ARC WELDER",
    "16": "Executive - Middle Level",
    "17": "Executive - Senior Level",
    "18": "Executive Junior Level",
    "19": "Farming",
    "20": "Housemaid",
    "21": "HouseWife",
    "22": "INDUSTRIAL WIRING ELECTRICIAN",
    "23": "Labourer",
    "24": "Mason",
    "25": "Not Working",
    "26": "Others",
    "27": "OXYGEN WELDER",
    "28": "Reinforcing Fitter",
    "29": "Retired",
    "30": "Salesperson",
    "31": "Self employed Professional",
    "32": "Service",
    "33": "Shop owner",
    "34": "Software Professional",
    "35": "Steel Fixer",
    "36": "Student",
    "37": "Supervisor",
    "2047": "Business Man Medium Scale",
    "2048": "BUSINESS",
    "2049": "Agriculturist",
    "2050": "Business Owner",
    "2051": "Doctor",
    "2052": "Lawyer",
    "2053": "Professional",
    "2054": "Retired/Pensioner",
    "2055": "Salaried",
    "2056": "Self Employed"
}

/*
function GetCityCityIdState(Pincode, State, City, CityID, Locality, FnCallBack) {
    $(Locality).empty();//$("#ddlContactCityID").empty();
    $(State).addClass('used');//$('#StateName').addClass('used');
    $(City).addClass('used');//$('#CityName').addClass('used');
    $.get('/CarInsuranceIndia/GetReliancecity?Pincode=' + Pincode, function (response) {
        var _response = $.parseJSON(response);
        $(City).val(_response.District);//$("#DistrictName").val(_response.District);
        $(State).val(_response.State);//$("#StateName").val(_response.State);
        $(CityID).val(_response.Locality[0].City_or_Village_ID_PK);//$("#ContactCityID").val(_response.CityId);
        $('#State_Id').val(_response.Locality[0].State_ID_PK);
        $('#District_Id').val(_response.Locality[0].District_ID_PK);
        $(Locality).append("<option value='0'>LOCALITY</option>");
        for (var i = 0; i < _response.Locality.length; i++) {
            $(Locality).append("<option value='" + _response.Locality[i].Area_ID_PK + "'>" + _response.Locality[i].Area_Name + "</option>");
        }
        if (parseInt("0") > 0) { $('#' + Locality).val("0"); }
        if (typeof FnCallBack !== 'undefined') {
            eval(FnCallBack);
        }
    });
}*/


$('#divPANNo').hide();
$('.divVehicleColor').hide();
$('#divInstitutionCity').show();