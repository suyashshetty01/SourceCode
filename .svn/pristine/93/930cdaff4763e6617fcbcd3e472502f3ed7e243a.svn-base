var _salutations = {
    "0": "TITLE",
    "1": "Mr",
    "2": "Mrs",
    "3": "Miss"
};

var _MaritalStatus = {
    "0": "MARITAL STATUS",
    "D": "Divorced",
    "M": "Married",
    "S": "Single",
    "W": "Widow"
};

var _financiertype = {
    "0": "Select Financier Type",
    "HYPO": "Hypothecation Agreement",
    "LEASE": "Lease Agreement",
    "HIRE": "Hire Purchase Agreement(HPA)",
    "GOV": "Financed by Government",
    "COMPANY": "Limited Company",
    "TRUST": "Trust / Charitable Institution"
};

$('#FinancerAgreementType').empty();
$.each(_financiertype, function (val, text) {
    $('#FinancerAgreementType').append(new Option(text, val));
});
function GetCityCityIdState(Pincode, State, City, CityID, Locality,FnCallBack) {
    $(Locality).empty();
    $(State).addClass('used');
    $(City).addClass('used');
    $.get('/CarInsuranceIndia/GetNewIndiacity?Pincode=' + Pincode, function (response) {
        var _response = $.parseJSON(response);
        console.log(_response);
        $(City).val(_response.Locality[0].Geo_City_Name);
        $(State).val(_response.Locality[0].Geo_State_Name);
        $(CityID).val(_response.Locality[0].Geo_City_Code);
        $('#State_Id').val(_response.Locality[0].Geo_State_Code);
        
        if (parseInt("0") > 0) { $('#' + Locality).val("0"); }
        if (typeof FnCallBack !== 'undefined') {
            eval(FnCallBack);
        }
    });
}

$('.divLocality').hide();
$('#divMaritalStatus').hide();
$('.divContactOccupationId').hide();
