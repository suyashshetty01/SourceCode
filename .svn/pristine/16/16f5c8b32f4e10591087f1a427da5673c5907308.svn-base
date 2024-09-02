/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var leadId = window.location.href.split('/')[4];
var occpancyArray = [];
var occpancyFlag = false;
var occpancyMaster = {};
var ss_id = "", fba_id = "", app_version = "", sub_fba_id = "", lead_id = "";
$(document).ready(function () {


    stringparam();
    if (lead_id !== undefined) {
        setFormUsingLead();
    } else {
        GetProductTypes();
    }



});

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
function onkeydownEvent(event) {
    if ($("#" + event.name).val().length >= 3) {
        occpancyFlag = true;
        autocomplete(document.getElementById(event.name), occpancyArray);
    }
}
function checkText(input) {
    var pattern = new RegExp('^[a-zA-Z]+$');
    var dvid = "Er" + $(input).attr('id');
    if (pattern.test(input.value) === false) {
        $('#' + dvid).show().text("Please enter proper value");
        return false;
    } else {
        $('#' + dvid).hide().text("");
        return true;
    }
}
function checkTextWithSpace(input) {
    var pattern = new RegExp('^[a-zA-Z ]+$');
    var dvid = "Er" + $(input).attr('id');
    if (pattern.test(input.value) === false) {
        $('#' + dvid).show().text("Please enter proper value");
        return false;
    } else {
        $('#' + dvid).hide().text("");
        return true;
    }
}
function checkMobile(input) {
    var pattern = new RegExp('^([6-9]{1}[0-9]{9})$');
    var dvid = "Er" + $(input).attr('id');
    if (pattern.test(input.value) === false) {
        $('#' + dvid).show().text("Please enter mobile number.");
        return false;
    } else {
        $('#' + dvid).hide().text("");
        return true;
    }
}

function checkEmail(input) {
    var dvid = "Er" + $(input).attr('id');
    var re = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (!re.test(input.value)) {
        $('#' + dvid).show().text("Please enter valid email.");
        return false;
    } else {
        $('#' + dvid).hide().text("");
        return true;
    }
}
function checkempty(input) {
    var dvid = "Er" + $(input).attr('id');
    if (input.value !== "") {
        $('#' + dvid).hide().text("");
        return true;
    } else {

        $('#' + dvid).show().text("Please enter value.");
        return false;
    }
}

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

function onsubProductselect() {
    GetForm_Master();

}
function GetForm_Master(formData) {
    var ProductType = document.getElementById('Product_type').value;
    var SubProduct_Type = document.getElementById('SubProduct_type').value;
    $.ajax({
        method: "GET",
        url: GetUrl() + "/corp_forms_master/" + ProductType + "/" + SubProduct_Type

    }).done(function (dbFormData) {
        console.log('dbFormData', dbFormData);
        $('#mainbasic').empty();
        $('#mainfull').empty();
        $('#main_global').empty();
        for (var i in dbFormData) {
            if (dbFormData[i].length > 0) {
                for (var j in dbFormData[i]) {
                    var html = "";
                    if (dbFormData[i][j]["form_category"] === i) {
                        var class_name = "";
                        if (dbFormData[i][j]["class_name"] !== undefined && dbFormData[i][j]["class_name"] !== null && dbFormData[i][j]["class_name"] !== "") {
                            class_name = dbFormData[i][j]["class_name"];
                        }
                        if (dbFormData[i][j]["field_type"] === "text" || dbFormData[i][j]["field_type"] === "date" || dbFormData[i][j]["field_type"] === "textarea") {
                            html = ('<div class="' + class_name + ' marg">'
                                    + '<label>' + dbFormData[i][j]["field_label"] + '</label>'
                                    + '<input mandatory="' + dbFormData[i][j]["mandatory"] + '" type="' + dbFormData[i][j]["field_type"] + '" class="form-control" id="' + dbFormData[i][j]["field_name"] + '" name="' + dbFormData[i][j]["field_name"] + '" placeholder="' + dbFormData[i][j]["field_label"] + '" validation="' + dbFormData[i][j]["validation"] + '">'
                                    + '<div id="Er' + dbFormData[i][j]["field_name"] + '" class="ErrorMsg" style="display:none;"></div>'
                                    + '</div>');
                        }
                        if (dbFormData[i][j]["field_type"] === "textbox") {
                            html = ('<div class="' + class_name + ' marg">'
                                    + '<label>' + dbFormData[i][j]["field_label"] + '</label>'
                                    + '<input mandatory="' + dbFormData[i][j]["mandatory"] + '" type="textarea" class="form-control" id="' + dbFormData[i][j]["field_name"] + '" name="' + dbFormData[i][j]["field_name"] + '" placeholder="' + dbFormData[i][j]["field_label"] + '" validation="' + dbFormData[i][j]["validation"] + '">'
                                    + '<div id="Er' + dbFormData[i][j]["field_name"] + '" class="ErrorMsg" style="display:none;"></div>'
                                    + '</div>');
                        }

                        if (dbFormData[i][j]["field_type"] === "file") {
                            html = ('<div class="' + class_name + ' marg" id="parent_' + dbFormData[i][j]["parent_field"] + '" parent_field_value="' + dbFormData[i][j]["parent_field_value"] + '">'
                                    + '<label>' + dbFormData[i][j]["field_label"] + '</label>'
                                    + '<input parent_id="' + dbFormData[i][j]["parent_field"] + '"  parent_field_value="' + dbFormData[i][j]["parent_field_value"] + '" mandatory="' + dbFormData[i][j]["mandatory"] + '" type="' + dbFormData[i][j]["field_type"] + '" class="form-control" id="' + dbFormData[i][j]["field_name"] + '" name="' + dbFormData[i][j]["field_name"] + '" placeholder="' + dbFormData[i][j]["field_label"] + '" validation="' + dbFormData[i][j]["validation"] + '">'
                                    + '<div id="Er' + dbFormData[i][j]["field_name"] + '" class="ErrorMsg" style="display:none;"></div>'
                                    + '</div>');
                        }
                        if (dbFormData[i][j]["field_type"] === "autocomplete") {
                            occpancyArray = dbFormData[i][j]["custom_tag"];
                            html = ('<div class="' + class_name + 'marg">'
                                    + '<label>' + dbFormData[i][j]["field_label"] + '</label>'
                                    + '<input autocomplete="off" onkeydown="onkeydownEvent(this)" mandatory="' + dbFormData[i][j]["mandatory"] + '" type="text" class="form-control" id="' + dbFormData[i][j]["field_name"] + '" name="' + dbFormData[i][j]["field_name"] + '" placeholder="' + dbFormData[i][j]["field_label"] + '" validation="' + dbFormData[i][j]["validation"] + '">'
                                    + '<div id="Er' + dbFormData[i][j]["field_name"] + '" class="ErrorMsg" style="display:none;"></div>'
                                    + '</div>');
                        }

                        if (dbFormData[i][j]["field_type"] === "dropdown") {
                            var options = '<option value=""><strong>---Select---</strong></option>'; //create your "title" option
                            if (dbFormData[i][j]['custom_tag'] === "") {

                            } else {
                                $(dbFormData[i][j]['custom_tag']).each(function (index, value) { //loop through your elements

                                    options += '<option value="' + value['key'] + '">' + value['value'] + '</option>'; //add the option element as a string

                                });
                            }
                            html = ('<div class="' + class_name + ' marg">'

                                    + '<label>' + dbFormData[i][j]["field_label"] + '</label>'
                                    + '<select  mandatory="' + dbFormData[i][j]["mandatory"] + '" onchange="ondropdownChange(this)" class="form-control"  id="' + dbFormData[i][j]["field_name"] + '" name="' + dbFormData[i][j]["field_name"] + '">'
                                    + options
                                    + '</select>'
                                    + '<div id="Er' + dbFormData[i][j]["field_name"] + '" class="ErrorMsg" style="display:none;"></div>'
                                    + '</div>');
                        }
                        if (dbFormData[i][j]["field_type"] === "label_with_input") {

                            var options = "";
                            $(dbFormData[i][j]['custom_tag']).each(function (index, value) { //loop through your elements

                                options += '<div class="' + class_name + ' marg">'
                                        + ' <label>' + value + '</label>'
                                        + ' <input  mandatory="' + dbFormData[i][j]["mandatory"] + '" type="text"   id="' + dbFormData[i][j]["field_name"] + '"  name="' + value + '" placeholder="' + value + '">'
                                        + '</div>';
                            });
                            //console.log(options);
                            html = ('<div class="' + class_name + ' ' + dbFormData[i][j]["field_type"] + '">'
                                    + '<label>' + dbFormData[i][j]["field_label"] + '</label>'
                                    + options
                                    + '<div id="Er' + dbFormData[i][j]["field_name"] + '" class="ErrorMsg" style="display:none;"></div>'
                                    + '</div>'
                                    );

                        }


                        $('.' + i).append(html);



                    }
                }
            }
        }

        $('.btnSubmit').show();
        $(".sub_section").show();
        $(".form-control").change(function () {

            var dvid = $(this).attr('id');
            var value = $(this).val().trim();
            if (value !== "") {
                $('#Er' + dvid).hide().text("");
            }

        });
        if (lead_id !== undefined) {
            setFormData(formData);
        }

    });
}

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
     the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    //console.log($("#pincodeId").val());
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, c, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();

        if (!val) {
            return false;
        } else if (occpancyFlag) {
            // if (val.length > 3) {
            // currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            var k = 0;
            for (var i in arr) {
                /*check if the item starts with the same letters as the text field value:*/
                c = document.createElement("DIV");
                a.setAttribute("id", i + "autocomplete-list");
                c.setAttribute("class", "autocomplete-items");
                c.innerHTML = "<strong>" + i + "</strong>";
                for (var j in arr[i]) {

                    if ((occpancyFlag && (arr[i][j].Description ? arr[i][j].Description.toString().substr(0, val.length).toLowerCase() === val.toLowerCase() : ""))) {
                        k = k + 1;
                        if (k < 4) {
                            /*create a DIV element for each matching element:*/
                            b = document.createElement("DIV");
                            if (occpancyFlag) {
                                /*make the matching letters bold:*/
                                b.innerHTML = "<strong>" + (arr[i][j].Description ? arr[i][j].Description.toString().substr(0, val.length) : "") + "</strong>";
                                b.innerHTML += (arr[i][j].Description ? arr[i][j].Description.toString().substr(val.length) : "");

                                /*insert a input field that will hold the current array item's value:*/
                                b.innerHTML += "<input type='hidden' value='" + arr[i][j].Description + "'>";
                                b.innerHTML += "<input type='hidden' class='risk_code' value='" + arr[i].Risk_code + "'>";
                                b.innerHTML += "<input type='hidden' class='rate_code' value='" + arr[i].Rate_code + "'>";
                                b.innerHTML += "<input type='hidden' class='sr_no' value='" + arr[i].Sr_no + "'>";
                                b.innerHTML += "<input type='hidden' id='myField' value='" + JSON.stringify(arr[i][j]) + "'/>";
                            }


                            /*execute a function when someone clicks on the item value (DIV element):*/
                            b.addEventListener("click", function (e) {
                                if (occpancyFlag) {

                                    /*insert the value for the autocomplete text field:*/
                                    //occpancyMaster = JSON.parse(this.getElementsByTagName("input")[0].value);
                                    inp.value = this.getElementsByTagName("input")[0].value;
                                    //xx`$('#hdn_UID').val(this.getElementsByClassName("UID")[0].value);
                                    //console.log("occpancyMaster - ", occpancyMaster);
                                }


                            });
                            c.appendChild(b);

                        }
                        a.appendChild(c);
                    }

                }

            }

            // }
        }

    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x)
            x = x.getElementsByTagName("div");
        if (e.keyCode === 40) {
            /*If the arrow DOWN key is pressed,
             increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode === 38) { //up
            /*If the arrow UP key is pressed,
             decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode === 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x)
                    x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x)
            return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length)
            currentFocus = 0;
        if (currentFocus < 0)
            currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    ;
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
         except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt !== x[i] && elmnt !== inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    ;
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

function ondropdownChange(event) {

    var id = event.name;
    var parentfieldvalue = $("#parent_" + id).attr('parent_field_value');
    if (event.value === parentfieldvalue) {
        $("#parent_" + id).removeClass('hidden');
    } else {
        $("#parent_" + id).addClass('hidden');
    }
}

function formValidation() {
    console.log('formValidation');
    let error_cnt = 0;
    var basicdetails = $("#form_basicdetails :input");
    $(basicdetails).each(function (index, value) {
        let obj = value;
        if (obj.attributes.validation !== undefined) {
            if (obj.value) {
                let validatename = obj.attributes.validation.value;
                if (validatename !== "undefined") {
                    let result = window[validatename](obj);
                    console.log(result + "------" + obj.placeholder);
                    if (!result) {
                        error_cnt++;
                    }
                }
            }
        }

        if (obj.attributes['mandatory'] !== undefined) {
            if (obj.attributes['mandatory'].value !== undefined && obj.attributes['mandatory'].value === "yes") {
                let result = window["checkempty"](obj);
                console.log(result + "------" + obj.placeholder);
                if (obj.value === "") {
                   
                    if (obj.attributes.parent_id) {
                         debugger;
                        var id = obj.attributes.parent_id.value;
                       if( $('#'+id).val() === obj.attributes.parent_field_value.value){
                           if (!result) {
                            error_cnt++;
                        }
                       }
                    } else {
                        if (!result) {
                            error_cnt++;
                        }
                    }
                }
            }
        }

    });
    if (error_cnt === 0) {
        //alert(error_cnt);
        OnSubmitForm();
        //$(".basicDet_section").hide();
        // $(".AllDet_section").show();
    }

}

function redirectDashboard(){
        window.location.href = '../LMS/dashboard.html?ss_id='+ss_id+'&fba_id='+fba_id+'&sub_fba_id='+sub_fba_id+'&app_version='+app_version;

}
function redirect(){
        window.location.href = '../LMS/index.html?ss_id='+ss_id+'&fba_id='+fba_id+'&sub_fba_id='+sub_fba_id+'&app_version='+app_version;

}

function OnSubmitForm() {

    var objdata = {
        "Corp_Product_Id": document.getElementById('Product_type').value,
        "Corp_Product_Name": document.getElementById('Product_type').options[document.getElementById('Product_type').selectedIndex].innerHTML,
        "Corp_Sub_Product_Id": document.getElementById('SubProduct_type').value,
        "Corp_Sub_Product_Name": document.getElementById('SubProduct_type').options[document.getElementById('SubProduct_type').selectedIndex].innerHTML,
        "Customer_name": $('#Name_Insured').val(),
        "Created_by": ss_id,
        "Mobile_no": $('#Mobile').val(),
        "Email": $("#Email_id").val(),
        "Status": "Created",
        "Lead_Request": {},
        "Source": "finmart",
        //"Basic_details": {},
        //"Full_details": {},
        "Created_On": new Date(),
        "Modified_On": new Date()
    };

    var basicdetails = $("#form_basicdetails .form-control").serializeArray();
    // var fulldetails = $("#form_fulldetails :input").serializeArray();
    var basicdata = {};
    //var fulldata = {};
    $(basicdetails).each(function (index, value) {
        basicdata[value.name] = value.value;
    });
    //$(fulldetails).each(function (index, value) {
    // fulldata[value.name] = value.value;
    //});
    //objdata['Basic_details'] = basicdata;
    //objdata['Full_details'] = fulldata;
    var material = $("#form_basicdetails #Material_used").serializeArray();
    var materialdata = {};
    $(material).each(function (index, value) {
        materialdata[value.name] = value.value;
    });

    var SI_details = $("#form_basicdetails #Sum_Insured_details").serializeArray();
    var SIdata = {};
    $(SI_details).each(function (index, value) {
        SIdata[value.name] = value.value;
    });


    basicdata["Material_used"] = materialdata;
    basicdata["Sum_Insured_details"] = SIdata;
    basicdata["files"] = "";
    console.log(basicdata);
    objdata['Lead_Request'] = JSON.stringify(basicdata);

    console.log(objdata);
    /*$.ajax({
     method: "POST",
     data: objdata,
     url: CONST_HORIZON_URL + "/corp_lead_save"
     }).done(function (dbResponseData) {
     $('.popupmain').show();
     if (dbResponseData["Status"] === "Success") {
     $('#txt_msg').text(dbResponseData["Msg"]);
     } else {
     $('#txt_msg').text("Failed.");
     }
     });*/
    objdata['Corporate_Lead_Id'] = lead_id;
    $('#form_basicdetails').ajaxSubmit({
        data: objdata,
        error: function (xhr) {
            //status('Error: ' + xhr.status);
        },
        success: function (response) {
            $('.popupmain').show();
            $('.crossSell_popup').show();
            if (response["Status"] === "Success") {
                $('#txt_msg').text(response["Msg"]);
            } else {
                $('#txt_msg').text("Failed.");
            }

        }
    });

}

function setFormUsingLead() {
    if (leadId !== '') {
        $.ajax({
            method: "GET",
            url: GetUrl() + "/get_corp_lead_data/" + lead_id
                    //	url: "http://localhost:3000/get_corp_lead_data/" + leadId
        }).done(function (corpLeadData) {
            console.log('corpLeadData', corpLeadData);
            $("#Product_type").empty();
            var optionhtml1 = '<option value="' + corpLeadData[0].Corp_Product_Id + '">' + corpLeadData[0].Corp_Product_Name + '</option>';
            $("#Product_type").append(optionhtml1);
            //$('#Product_type').selectpicker('refresh');

            $("#SubProduct_type").empty();
            var optionhtml2 = '<option value="' + corpLeadData[0].Corp_Sub_Product_Id + '">' + corpLeadData[0].Corp_Sub_Product_Name + '</option>';
            $("#SubProduct_type").append(optionhtml2);
            //$('#SubProduct_type').selectpicker('refresh');
            GetForm_Master(corpLeadData);
            $(".basicDet_section").show();
        });
    }
}
function setFormData(formData) {
    for (var i in formData) {
        for (var j in formData[i].Lead_Request) {
            if (j === "Material_used" || j === "Sum_Insured_details") {
                for (var k in formData[i].Lead_Request[j]) {
                    $("input[name='" + k + "']").val(formData[i].Lead_Request[j][k]);
                }
            }
            if (j !== "Material_used" && j !== "Sum_Insured_details") {
                $('#' + j).val(formData[i].Lead_Request[j]);
            }
            if (j === "Stocks_on_Floater_Basis") {
                if (formData[i].Lead_Request[j] === "Yes") {
                    $("#parent_" + j).removeClass('hidden');
                } else {
                    $("#parent_" + j).addClass('hidden');
                }
            }
        }
    }
}