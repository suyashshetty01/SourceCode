
var _MaritalStatus = {
    "0": "MARITAL STATUS",
    "Married": "Married",
    "Single": "Single",
    "Divorced": "Divorced",
    "Widowed": "Widowed",
    "Separated": "Separated"
};


$('#Salutation').focusout(function () {
    $("#Gender").val("F");
    if ($("#Salutation").val() == "0" || $("#Salutation").val() == "TITLE" || $("#Salutation").val() == "Mr.") {
        $("#MaritalStatus").val("0");
        $("#Gender").val("M");
    }
    else if ($("#Salutation").val() == "Miss")
        $("#MaritalStatus").val("S");
    else if ($("#Salutation").val() == "Mrs.")
        $("#MaritalStatus").val("M");
});

var _salutations = {
    "0": "TITLE",
    "Mrs.": "Mrs.",
    "Mr.": "Mr.",
    "Dr.": "Dr.",
    "Madam": "Madam",
    "Prof.": "Prof.",
    "Miss": "Miss",
    "Major": "Major",
    "Captain": "Captain"
};

var _occupation = {
    0: "Select Occupation",
    "Edelweiss Group Employee": "Edelweiss Group Employee",
    "Farmer": "Farmer",
    "Heavy Metal Industry (Full time and part time)": "Heavy Metal Industry (Full time and part time)",
    "Salaried": "Salaried",
    "Self-Employed": "Self-Employed",
    "Others": "Others"
};

var _nominee = {
    "0": "SELECT RELATION",
    "Father": "Father",
    "Mother": "Mother",
    "Son": "Son",
    "Daughter": "Daughter",
    "Spouse": "Spouse",
    "Self": "Self",
    "Brother": "Brother",
    "Sister": "Sister",
    "Father-in-law": "Father-in-law",
    "Mother-in-law": "Mother-in-law",
    "Others": "Others"
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
$('#divInstitutionCity').show();
