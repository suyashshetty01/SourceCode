/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var ss_id = "", fba_id = "", app_version = "", sub_fba_id = "", lead_id = "";
var pageIndex = 1;
var pageCount;
var iScrollPos = 0;

var getUrlVars = function () {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
};
$(document).ready(function () {
    stringparam();
    GetLeadData();
});
function GetUrl() {
    var url = window.location.href;
    //alert(url.includes("health"));
    var newurl;
    newurl = "http://qa.policyboss.com";
    if (url.includes("request_file")) {
        //newurl = "http://qa-horizon.policyboss.com:3000";
        newurl = "http://localhost:3000";
    } else if (url.includes("qa")) {
        newurl = "http://qa-horizon.policyboss.com:3000";
    } else if (url.includes("www") || url.includes("cloudfront")) {
        newurl = "http://horizon.policyboss.com:5000";
    }
    return newurl;
}
function stringparam() {
    ss_id = getUrlVars()["ss_id"];
    fba_id = getUrlVars()["fba_id"];
    sub_fba_id = getUrlVars()["sub_fba_id"];
    app_version = getUrlVars()["app_version"];
    lead_id = getUrlVars()["lead_id"];

    if (fba_id === "" || fba_id === undefined || fba_id === "0" || app_version === "" || app_version === "0" || app_version === undefined || ss_id === "" || ss_id === undefined || ss_id === "0") {
        $('.warningmsg').show();
        $('.Main_Panel').hide();
        $("#error_query_str").text(window.location.href.split('?')[1]);
    } else {
        $('.warningmsg').hide();
        $('.Main_Panel').show();
    }

}

function GetLeadData(type) {
    var filter ={};
    if(type === 'search'){
        $('.searchPopup').hide()
        if($('#Product_type').val() !== "0"){
            filter['Product_Name'] =  $('#Product_type').val();
        }
        if($('#SubProduct_type').val() !== "0"){
            filter['SubProduct_Name'] =  $("#SubProduct_type" ).val();
        }
         if($('#srch_Name').val() !== ""){
            filter['Customer_name'] =  $("#srch_Name" ).val();
        }
    }
    var filter_data = {
        "Created_by": ss_id,
        "Page": pageIndex,
        "filter" :filter

    };
    $.ajax({
        method: "POST",
        data: filter_data,
        url: GetUrl() + "/finmart_corp_lead_datas"

    }).done(function (dbFormData) {
        
        var objdata = dbFormData;
        console.log(objdata);
        var html = "";
		if(dbFormData.length>0){
			$('#lead_data').empty();
        for (var i in dbFormData) {
            $('#lead_data').append('<div class="content_grid" lead_id="' + dbFormData[i]['Corporate_Lead_Id'] + '">'
                    + '<div class="lead_edit">' + dbFormData[i]['Corporate_Lead_Id'] + '</div>'
                    + '<div class="lead_edit">' + dbFormData[i]['Customer_name'] + '</div>'
                    + '<div class="lead_edit">' + dbFormData[i]['Corp_Product_Name'] + '</div>'
                    + '<div class="lead_edit">' + dbFormData[i]['Corp_Sub_Product_Name'] + '</div>'
                    + '<div class="info_icon" id="view_info_'+dbFormData[i]['Corporate_Lead_Id'] +'"><i class="fa fa-info-circle" aria-hidden="true"></i></div>'
                    + '</div>');
            $('#view_info_'+dbFormData[i]['Corporate_Lead_Id']).click(function (e) {
            $('.information_Popup').show();
            var lead_id = $(this).parent().attr('lead_id');
            view_basic_data(lead_id);

        });
		 $('.lead_edit').click(function (e) {
            
            var lead_id = $(this).parent().attr('lead_id');
            lead_edit(lead_id);

        });
        }
	}else{
		$('#lead_data').empty();
		$('#lead_data').append('<div class="norecord" style="font-size: 20px;font-weight: 600;text-align: center;padding-top: 173px;">No Record Found</div>');
	}
        
    });
}

$(document.body).on('touchmove', onScroll); // for mobile
$(window).on('scroll', onScroll);

function onScroll() {
    if ($(window).scrollTop() + window.innerHeight >= document.body.scrollHeight) {
        pageIndex++;
        GetLeadData();
    }
}

function view_basic_data(lead_id) {


    $.ajax({
        method: "GET",
        //url:  "http://localhost:3000/view_corp_lead_data/" + Lead_Id
        url: GetUrl() + "/view_corp_lead_data/" + lead_id
    }).done(function (dbFormData) {
        console.log('dbFormData', dbFormData);
        $('.basicdiv').empty();
        for (var j in dbFormData) {
            var html = "";
            var fieldName = j.replace(/_/g, ' ');
            if (j !== "Floater_Location_list" && j !== "Material_used" && j !== "Sum_Insured_details") {
                html = ('<div>'
                        +'<span class="detail_txt">' + fieldName+' &nbsp; : &nbsp;&nbsp;</span>'
                        +'<span id="' + dbFormData[j] + '">'+dbFormData[j]+' </span>'
                    +'</div>');
             
            }
            
            if (j === "Floater_Location_list") {
                if (dbFormData[j] !== "") {
                    html = ('<div>'
                        +'<span class="detail_txt">' + fieldName+' &nbsp; : &nbsp;&nbsp;</span>'
                        +'<a target="_blank",  href="' + dbFormData[j] + '" style="color: #fff !important;"> <button type="button" class="btn btn-primary m-1">Download File</button></a>'
                    +'</div>');
                    
                }
            }
            if (j == "Material_used" || j == "Sum_Insured_details") {
               
                 var html2 = "";
                for (var i in dbFormData[j]) {
                   
                    html2 += ('<span id="' + i + '">'
                            + i + " - "
                            + '</span>'
                            + '<span id="' + dbFormData[j][i] + '">'
                            + dbFormData[j][i]
                            + '</span>');
                    
                   
                }
                 html = ('<div>'
                        +'<span class="detail_txt">' + fieldName+' &nbsp; : &nbsp;&nbsp;</span>'
                        +'<span id="' + dbFormData[j] + '">'+html2+' </span>'
                    +'</div>');
            }
            $('.basicdiv').append(html);
        }
    });
}

$('.close_btn, .ok_btn').click(function(e){
    $('.information_Popup').hide();
    
});

function GetProductTypes() {
    $.ajax({
        method: "GET",
        url: GetUrl() + "/corp_product_types"
    }).done(function (dbProductData) {
        //console.log('dbProductData', dbProductData);
        $("#Product_type").empty();
        var optionhtml1 = '<option value="' + 0 + '">' + "-- Select Product Type --" + '</option>';
        $("#Product_type").append(optionhtml1);
        $.each(dbProductData, function (i) {
            $('#Product_type').get(0).options[$('#Product_type').get(0).options.length] = new Option(dbProductData[i].Product_Name, dbProductData[i].Product_Id);
        });

    });
}

function onProductselect() {
    var ProductType = document.getElementById('Product_type').value;
    if (ProductType !== '') {
        $.ajax({
            method: "GET",
            url: GetUrl() + "/corp_sub_product_types/" + ProductType

        }).done(function (dbProductData) {
            // console.log('dbProductData', dbProductData);
            $("#SubProduct_type").empty();
            var optionhtml1 = '<option value="' + 0 + '">' + "-- Select Sub-Product Type --" + '</option>';
            $("#SubProduct_type").append(optionhtml1);
            $.each(dbProductData, function (i) {
                $('#SubProduct_type').get(0).options[$('#SubProduct_type').get(0).options.length] = new Option(dbProductData[i].Sub_Product_Name, dbProductData[i].Sub_Product_Id);
            });

        });
    }

}

function SearchRest(){
    $('#Product_type').val("0");
    $('#SubProduct_type').val("0");
    $("#srch_Name").val("");
}

function CreateLead(){
     window.location.href = '../LMS/index.html?ss_id='+ss_id+'&fba_id='+fba_id+'&sub_fba_id='+sub_fba_id+'&app_version='+app_version;
}
function lead_edit(leadID){
     window.location.href = '../LMS/index.html?ss_id='+ss_id+'&fba_id='+fba_id+'&sub_fba_id='+sub_fba_id+'&app_version='+app_version+'&lead_id='+leadID;
}

function reloadPage(){
        location.reload(true);
    }