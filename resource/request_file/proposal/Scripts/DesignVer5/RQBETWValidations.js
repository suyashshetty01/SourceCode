var _salutations = {
    "0": "TITLE",
    "MR": "MR",
    "MRS": "MRS",
    "MS": "MS",
    "MISS": "MISS",
    "M/s": "M/s"
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
    "0": "SELECT RELATION",
    "Spouse": "Spouse",
    "Mother": "Mother",
    "Father": "Father",
    "Son": "Son",
    "Daughter": "Daughter"
};

var _colour ={
	"0": "SELECT COLOUR",
	"Black": "Black",
	"White": "White",
	"Metallic": "Metallic",
	"Voilet": "Voilet",
	"Indigo": "Indigo",
	"Blue": "Blue",
	"Green": "Green",
	"Yellow": "Yellow",
	"Orange": "Orange",
	"Red": "Red",
	"Others": "Others",
	"Non Metallic": "Non Metallic"
};

$("#RegisteredCityName").removeAttr('readonly');
$("#ContactCityName").removeAttr('readonly');

