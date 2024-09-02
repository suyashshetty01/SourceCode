var _salutations = {
    "0": "TITLE",
    "MR": "Mr",
    "MRS": "Mrs",
    "MS": "Miss"
};
var _MaritalStatus = {
    "0": "MARITAL STATUS",
    "M": "Married",
    "S": "UnMarried"
};
var _nominee = {
    "0":"NOMINEE RELATION",
    "Spouse": "Spouse",
    "Father": "Father",
    "Mother": "Mother",
    "Son": "Son",
    "Sister": "Sister",
    "Daughter": "Daughter",
    "Brother": "Brother"
};
var _occupation = {
    0: "OCCUPATION",
    "MSAF": "Media / Sports / Armed forces",
    "Govt": "Government employees",
    "Prof": "Professionals (CA, Doctor, lawyer)",
    "Sales": "Private (Sales and marketing)",
    "Priv": "Private (other than Sales / marketing)",
    "Self": "Self employed / self business",
    "Other": "Others"
};

function GetCityCityIdState(Pincode, State, City, CityID, Locality, FnCallBack) {
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
}

function Horizon_Method_Convert(method_action, data, type) {
    var calling_action = "";
    var method_type = "";
    method_type = (type == "POST") ? "/TwoWheelerInsurance/call_horizon_post" : "/TwoWheelerInsurance/call_horizon_get";
    calling_action = window.location.href.indexOf('https') == 0 ? "/horizon-method.php" : method_type;
    var obj_horizon_method = {
        "url": (type == "POST") ? calling_action : calling_action + "?method_name=" + method_action,
        "data": {
            request_json: JSON.stringify(data),
            method_name: method_action,
            client_id: "2"
        }
    };
    return obj_horizon_method;
}

// financier data autocomplete
var data = [];
$('#FinancerAgreementType').change(function () {
    GetFinancerDetails();
});

function GetFinancerDetails() {
    var Insurer_Id = summary.Summary['Insurer_Id'];
    if (Insurer_Id === 46 || Insurer_Id === 10) {
        data = [];
    }
    if (Insurer_Id != 14 && Insurer_Id != 5 && Insurer_Id != 30 && Insurer_Id != 3) {
        Insurer_Id = 33;
    }
    if (data.length == 0) {
        console.log("click");
        var obj_horizon_data = Horizon_Method_Convert("/get_finance_master/" + +Insurer_Id, '', "GET");
        $.ajax({
            type: "GET",
            //url: "/TwoWheelerInsurance/Get_Financier_Details?Insurer_Id=" + Insurer_Id, // because liberty has maximum data in financier master 
            url: obj_horizon_data['url'],
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                console.log('Financier Data', response);
                data = response;
            },
            error: function (response) {
                console.log('Error in Financier Data Call!')
            }
        });
    }
}

$("#InstitutionName").autocomplete({
    source: function (request, response) {
        if (data.length == 0) {
            $('#IsFinancedYes').click();
        }
        var append_data = [];
        var str = $("#InstitutionName").val();
        append_data = data.filter(function (name) {
            return ((name.Financier_Name).toLowerCase()).indexOf(str.toLowerCase()) >= 0;
        });
        response($.map(append_data, function (index, val) {
            return { label: index.Financier_Name, value: index.Financier_Code };
        }));
    },
    minLength: 3,
    select: function (event, ui) {
        if (ui.item.label == null || ui.item.value == null) return false;
        $("#InstitutionName").val(ui.item.label); //ui.item is your object from the array
        $("#FinancierCode").val(ui.item.value);
        return false;
    },
    change: function (event, ui) {
        if (ui.item == null) { $("#FinancierCode").val(""); return false; }
}
    //change: function () { $("#FinancierCode").val(""); } 
});
