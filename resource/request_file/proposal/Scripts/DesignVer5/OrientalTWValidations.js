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

var _nominee = {
    "0": "SELECT RELATION",
    "Spouse": "Spouse",
    "Father": "Father",
    "Mother": "Mother",
    "Son": "Son",
    "Sister": "Sister",
    "Daughter": "Daughter",
    "Brother": "Brother"
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


var _colour = {
    "0": "SELECT COLOUR",
    "ARTICSILVER": "Artic Silver",
    "BEIGE": "Beige",
    "BLACK": "Black",
    "BLUE": "Blue",
    "BROWN": "Brown",
    "CHAMPAIGNE": "Champaigne",
    "DARK RED": "DARK RED",
    "DARKBLUE": "Dark Blue",
    "DARKGREEN": "Dark Green",
    "FORESTDEW": "FOREST DEW",
    "GOLD": "Gold",
    "GRAPHINE": "GRAPHINE", 
    "GREEN": "GREEN",
    "GREY": "Grey",
    "IVORY": "IVORY",
    "LEMON YELL": "LEMON YELLOW",
    "LIGHTBLUE": "Light Blue",
    "LIGHTGREEN": "Light Green",
    "MAROON": "Maroon",
    "MAUVE": "MAUVE",
    "Metallic": "Metallic",
    "Non-metallic": "Non-metallic",
    "ORANGE": "Orange",
    "PEACH": "PEACH",
    "PEARL": "Pearl White",
    "PINK": "PINK",
    "PLATINUM": "PLATINUM",
    "PURPLE": "PURPLE",
    "REAL EARTH": "REAL EARTH",
    "RED": "Red",
    "SANDAL": "SANDAL",
    "SILVER": "SILVER",
    "SIM RED": "SIMPSON RED",
    "SUPER WITE": "Super White",
    "VIOLET": "VIOLET",
    "WARM SLVR": "Warm Silver",
    "WHITE": "White",
    "YELLOW": "Yellow",
    "OTHER": "OTHER COLOR"
};

$('#VehicleColor').empty();
$.each(_colour, function (val, text) {
    $('#VehicleColor').append(new Option(text, val));
});

$(".divLocality").hide();