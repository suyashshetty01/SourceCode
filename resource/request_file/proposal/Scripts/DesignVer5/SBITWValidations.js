var _salutations = {
    "0": "TITLE",
    "MR": "MR",
    "MRS": "MRS",
    "MS": "MS",
    "MISS": "MISS",
    "M/s": "M/s"
};

var _salutations_car = {
    "0": "TITLE",
    "Col":"Col",
    "Major":"Major",
    "Mr":"Mr",
    "Miss":"Miss",
    "Ms":"Ms",
    "Mrs":"Mrs",
    "Ch":"Ch",
    "Kr":"Kr",
    "Kum":"Kum",
    "Sri":"Sri",
    "Shri":"Shri",
    "Smt":"Smt",
    "Dr": "Dr",
    "Er": "Er",
    "The": "The",
    "Prof": "Prof",
    "Capt.": "Capt.",
    "Lt.":"Lt.",
    "Master":"Master",
    "Sqn Ldr":"Sqn Ldr",
    "Cdr":"Cdr",
    "Lt.Col": "Lt.Col"
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

var _occupation_car = {
    "0": "Select Occupation",
    "1": "Civil Service officers, Adminisatrative, Finance and Accounts Professional",
    "2": "News, Media and Entertainment Professional and Technicians",
    "3": "Banking, Financial Service and Insurance Professional and Intermediaries",
    "4": "Arbitrators, Mediators, Legal and Other such Professional",
    "5": "Animal Care, Veterinary Professional",
    "6": "Any Engineering Professional and Technicians including Data, Software and Telecom",
    "7": "Branding, Sales and Marketing Professional",
    "8": "Education and Teaching Professional",
    "9": "Fine Art Professional including Fashion designers, Art collectors, Owners etc",
    "10": "Fitness, Leisure and Sports Professional and Worker",
    "11": "Food and Agriculture Professional and Worker",
    "12": "Health Care Professional",
    "13": "Homeamaker,Student, Retirees, Pensioners and other dependents",
    "14": "Industrial Workers",
    "15": "Manufactured Food / Restauraunt / Hotel Business Professional and worker",
    "16": "News, Media and Entertainment Professional and Technicians",
    "17": "Non Profit, Religion and Social Service Professional and Worker",
    "18": "Occupation Category",
    "19": "Private security, Police, Customs, Law enforcers  Fireforce and Armed Force related Professional",
    "20": "Real Estate, Architecture and Construction Professional and worker",
    "21": "Retail establishment and Other General Workers",
    "22": "Self Employed General Service",
    "23": "Social / Natural Science Professional / Scientist and other Acadamicians",
    "24": "Transportation (Road / Rail / Air / Marine) Professional & Worker including postal and Courier"
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

var _nominee_car = {
    "0": "SELECT RELATION",
    "1": "Self",
    "2": "Husband",
    "3": "Wife",
    "4": "Son",
    "5": "Daughter",
    "6": "Father",
    "7": "Mother",
    "8": "Father in law",
    "9": "Mother in law",
    "10": "Cousin",
    "11": "Friend",
    "12": "Employed Driver",
    "13": "Employee",
    "14": "Sister",
    "15": "Sister in law",
    "16": "Uncle",
    "17": "Aunty",
    "18": "Employed Driver other close relations"
};
var _colour = {
	"0" : 'SELECT COLOUR',
    "Black": "Black",
    "Blue":"Blue",
    "Yellow": "Blue",
    "Ivory": "Ivory",
    "Red": "Red",
    "White": "White",
    "Green": "Green",
    "Purple": "Purple",
    "Violet": "Violet",
    "Maroon": "Maroon",
    "Silver": "Silver",
    "Gold": "Gold",
    "Beige": "Beige",
    "Orange": "Orange",
    "Still Grey": "Still Grey"
    };

$("#RegisteredCityName").removeAttr('readonly');
$("#ContactCityName").removeAttr('readonly');
$('#divInstitutionCity').show();
$('.divVehicleColor').show();
