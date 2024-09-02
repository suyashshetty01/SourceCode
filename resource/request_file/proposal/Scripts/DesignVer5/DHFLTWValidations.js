var _salutations = {
    "0": "TITLE",
    "1": "Mr.",
    "2": "Mrs.",
    "3": "Miss",
    "1000000": "Ms",
    "1000001": "Dr"
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
    "1": "Businessman",
    "2": "Student",
    "3": "Service",
    "4": "Unemployed",
    "5": "Other"
};

var _nominee = {
    "0": "SELECT RELATION",
    "1000001": "Spouse",
    "1000002": "Father",
    "1000003": "Mother",
    "1000004": "Son",
    "1000005": "Daughter",
    "1000022": "Brother",
    "1000023": "Father in law",
    "1000024": "Mother in law",
    "1000025": "Others",
    "1000026": "Sister"

};

$(".divLocality").hide();
$("#RegisteredCityName").removeAttr('readonly');
$("#ContactCityName").removeAttr('readonly');

