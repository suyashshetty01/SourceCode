var _salutations = {
    "0": "TITLE",
    "1": "Mr.",
    "2": "Mrs.",
    "3": "M/S.",
    "4": "Miss.",
    "5": "Dr."
};

var _MaritalStatus = {
    "0": "MARITAL STATUS",
    "Married": "Married",
    "UnMarried": "UnMarried",
    "Divorced": "Divorced",
    "Widowed": "Widowed"
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
    "0": "Select Occupation",
    "Businessman": "Businessman",
    "Student": "Student",
    "Service": "Service",
    "Unemployed": "Unemployed",
    "Other": "Other"
};

var _nominee = {
0: "Select Occupation",
"Spouse":"Spouse",
"Son":"Son",
"Daughter":"Daughter",
"Brother":"Brother",
"Sister":"Sister",
"Father":"Father",
"Mother":"Mother",
"Father-in-Law":"Father-in-Law",
"Mother-in-Law":"Mother-in-Law",
"OTHERS":"OTHERS"
};

$("#RegisteredCityName").removeAttr('readonly');
$("#ContactCityName").removeAttr('readonly');
$('#divInstitutionCity').show();

