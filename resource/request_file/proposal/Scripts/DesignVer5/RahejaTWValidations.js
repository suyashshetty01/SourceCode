var _salutations = {
    "0": "TITLE",
    "MR": "MR",
    "MRS": "MRS",
    "MS": "MS",
    "DR": "DR"
};

var _MaritalStatus = {
    "0": "MARITAL STATUS",
    "M": "Married",
    "U": "UnMarried",
    "D": "Divorced",
    "W": "Widowed"
};


$('#Salutation').focusout(function () {
    $("#Gender").val("M");
    if ($("#Salutation").val() == "0" || $("#Salutation").val() == "TITLE" || $("#Salutation").val() == "MR") {
        $("#MaritalStatus").val("0");
        $("#Gender").val("M");
    }else if ($("#Salutation").val() == "MS"){
        $("#MaritalStatus").val("0");
    } else if ($("#Salutation").val() == "MRS") {
        $("#MaritalStatus").val("0");
    }
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
    "0": "SELECT RELATION",
    /*"Spouse": "Spouse",
    "Mother": "Mother",
    "Father": "Father",
    "Son": "Son",
    "Daughter": "Daughter"*/
    "1311": "Other Relation",
    "1312": "Employer",
    "1527": "Brother",
    "1528": "Sister",
    "1529": "Others",
    "1539": "Husband",
    "1540": "Wife",
    "1541": "Father in law",
    "1542": "Mother in Law",
    "1543": "Cousin",
    "1544": "Friend",
    "1545": "Sister in law",
    "1546": "Uncle",
    "1547": "Aunty",
    "1548": "Other close relations"

};

$("#RegisteredCityName").removeAttr('readonly');
$("#ContactCityName").removeAttr('readonly');
$('.divVehicleColor').show();

