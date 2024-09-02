﻿
var _MaritalStatus = {
    "0": "MARITAL STATUS",
    "M": "Married",
    "S": "UnMarried",
    "D": "Divorced",
    "W": "Widowed"
};

var _Salutation = {
    "0": "TITLE",
    "Ms": "MISS",
    "Mr": "MR",
    "Mrs": "MRS"
};

$('#Salutation').focusout(function () {
    $("#Gender").val("M");
    if ($("#Salutation").val() == "0" || $("#Salutation").val() == "TITLE" || $("#Salutation").val() == "MR") {
        $("#MaritalStatus").val("0");
        $("#Gender").val("M");
    }
    else if ($("#Salutation").val() == "MISS") {
        $("#MaritalStatus").val("S");
        $("#Gender").val("F");
    }
    else if ($("#Salutation").val() == "MRS") {
        $("#MaritalStatus").val("M");
        $("#Gender").val("F");
    }
});

var _occupation = {
    0: "Select Occupation",
    "Armed Forces": "Armed Forces",
    "Business / Sales Profession": "Business / Sales Profession",
    "Central / State Government Employee": "Central / State Government Employee",
    "Corporate Executive": "Corporate Executive",
    "Engineering Profession": "Engineering Profession",
    "Financial Services Profession": "Financial Services Profession",
    "Heads of Government": "Heads of Government",
    "Heads of State": "Heads of State",
    "Home Maker / Housewife": "Home Maker / Housewife",
    "IT Profession": "IT Profession",
    "Medical Profession": "Medical Profession",
    "Musician / Artist": "Musician / Artist",
    "Sports Person": "Sports Person",
    "Student": "Student",
    "Teaching Profession": "Teaching Profession",
    "Political Party Official": "Political Party Official",
    "Politician": "Politician",
    "Senior Government Official": "Senior Government Official",
    "Senior Judicial Official": "Senior Judicial Official",
    "Senior Military Official": "Senior Military Official",
    "State-owned Corporation Official": "State-owned Corporation Official",
    "Others": "Others"
};

var _nominee = {
    "0": "SELECT RELATION",
    "Spouse": "Spouse",
    "Father": "Father",
    "Mother": "Mother",
    "Son": "Son",
    "Sister": "Sister",
    "Daughter": "Daughter",
    "Brother": "Brother",
    "Grand Son": "Grand Son",
    "Grand Daughter": "Grand Daughter",
    "Grand Father": "Grand Father",
    "Grand Mother": "Grand Mother",
    "Father-in-Law": "Father-in-Law",
    "Mother-in-Law": "Mother-in-Law",
    "Son-in-Law": "Son-in-Law",
    "Daughter-in-Law": "Daughter-in-Law",
    "Brother-in-Law": "Brother-in-Law",
    "Sister-in-Law": "Sister-in-Law",
    "Uncle": "Uncle",
    "Aunt": "Aunt",
    "Cousin": "Cousin",
    "Nephew": "Nephew",
    "Niece": "Niece",
    "Legal Guardian": "Legal Guardian"
};
/*
function GetCityCityIdState(Pincode, State, City, CityID, Locality, FnCallBack) {
    
}


var data = [];
function GetRoyalCityData() {
    $.ajax({
        type: "GET",
        url: "/TwoWheelerInsurance/Get_Royal_CityDetails", // because liberty has maximum data in financier master 
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            console.log('City Data', response);
            data = response;
        },
        error: function (response) {
            console.log('Error in City Data Call!')
        }
    });
}
GetRoyalCityData();*/
$("#RegisteredCityName").click(function () {
    $("#RegisteredStateName").val('');
    $("#RegisteredStateName").removeClass('used');
});
$("#RegisteredCityName").autocomplete({
    source: function (request, response) {
        $("#RegisteredStateName").val('');
        $("#RegisteredStateName").removeClass('used');
        var append_data = [];
        var str = $("#RegisteredCityName").val();
        var count = 0;
        append_data = RegPincodeData.filter(function (name) {
            if(((name.City).toLowerCase()).indexOf(str.toLowerCase()) >= 0)
            {
                count++;
            }
            return ((name.City).toLowerCase()).indexOf(str.toLowerCase()) >= 0 && count <= 15;
        });
        if (count == 0) {
            append_data = [{ 'CITY': 'NO SUCH CITY', 'STATE': ' ' }];
        }
        response($.map(append_data, function (index, val) {
            return { label: index.City, value: index.State };
        }));
    },

    minLength: 1,
    select: function (event, ui) {
        $("#RegisteredCityName").val(ui.item.label); //ui.item is your object from the array
        $("#RegisteredStateName").val(RegPincodeData[0].State);
        $("#RegisteredStateName").addClass('used');
        return false;
    }
});
$("#ContactCityName").autocomplete({
    source: function (request, response) {
        var append_data = [];
        var str = $("#ContactCityName").val();
        append_data = ConPincodeData.filter(function (name) {
            return ((name.City).toLowerCase()).indexOf(str.toLowerCase()) >= 0;
        });
        response($.map(append_data, function (index, val) {
            return { label: index.City, value: index.State };
        }));
    },

    minLength: 3,
    select: function (event, ui) {
        $("#ContactCityName").val(ui.item.label); //ui.item is your object from the array
        $("#StateName").val(ConPincodeData[0].State);
        $("#StateName").addClass('used');
        return false;
    }
});

$("#RegisteredCityName").removeAttr('readonly');
$("#ContactCityName").removeAttr('readonly');
$('.divLocality').hide();

