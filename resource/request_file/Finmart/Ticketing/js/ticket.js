
    var is_CRN = false;
    var Is_NoCRN = false;
    var filePicker_1 = "";
    var filePicker_2 = "";
    var filePicker_3 = "";
    var filePicker_4 = "";
    var extension_1 = "";
    var extension_2 = "";
    var extension_3 = "";
    var extension_4 = "";
    var radiobtnchked = false;
    var CRN_chk = true;
    var categoryproduct = [];
	var Name = "Khushbu Vipul Gite";
	var UDID = "111162";
	var Supportagentid = 813;
	var ss_id = 813;
	var fba_id = 813;
	var agent_email = "khushbu.gite@policyboss.com";
	var client_id = 2;
	var role ="tickets";
	var siteURL = "";
	var productid = 0;

    $(document).ready(function (e) {
		siteURL =  window.location.href;
        $(".fa-ticket").click(function (e) {
            $(".linkbox").toggle(100);
            console.log(e.target);
            e.stopPropagation();
            $('#ticketicondropdwn').hide();
        })
        $(".linkbox").click(function (e) {
            e.stopPropagation();
        });


        $(document).click(function (e) {
            $(".linkbox").hide();
        });

        $("#target2").click(function (e) {
            $(".Iconlinkbox").toggle(100);
            console.log(e.target);
            e.stopPropagation();
            $('#ticketmenudropdwn').hide();
        });
        $(".Iconlinkbox").click(function (e) {
            e.stopPropagation();
        });


        $(document).click(function (e) {
            $(".Iconlinkbox").hide();
        });
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
    function urlCheck() {
        var url = window.location.href;
        if (url.includes('quotes')) {
            $('.ihavecrn').hide();
            $('.donthavrcrn').hide();
            $('#IhaveCRNdiv').show();
            $('#DonthaveCRNdiv').show();
            $('#Category').val('2');
            GetSubCategory(2);
            $('#Category').prop('disabled', true);
            $('.disablefield').prop('disabled', true);
            radiobtnchked = true;
        } else if (url.includes('buynow')) {
            $('.ihavecrn').hide();
            $('.donthavrcrn').hide();
            $('#IhaveCRNdiv').show();
            $('#DonthaveCRNdiv').show();
            $('#Category').val('3');
            GetSubCategory(3);
            $('#Category').prop('disabled', true);
            $('.disablefield').prop('disabled', true);
            radiobtnchked = true;
        } else {
            radiobtnchked = false;
        }

    }

    //function myTicketFunction() {
    //    $(".ticketdropdownMenu").fadeIn(100, function () { $(this).focus(); });

    //    $('#ticketicondropdwn').hide();
    //}

    //window.onclick = function () {
    //    if ($(".ticketdropdownMenu").fadeIn(100, function () { $(this).focus(); })) {
    //        $(".ticketdropdownMenu").hide();
    //    }
    //}



    function createticket() {
        $('.ovl').show();
        // $('.ovl').show();
        $('#ticketmenudropdwn').hide();
        $('#ticketicondropdwn').hide();
        $('body').css('overflow', 'hidden');
    }
    function ticketdashboard1() {
        window.location.href = '/Home/MyDashboard?role=tickets';
    }

    function closepopup() {

        $('.ovl').hide();
        $('body').css('overflow', 'auto');
        location.reload();
    }
    //function ticketIcon() {
    //$('#ticketicondropdwn').toggle();
    // $('#ticketmenudropdwn').hide();
    // }






    function HAVECRN() {
        radiobtnchked = true;
        $('#ErradioSelect').hide();
        $('#ErradioSelect').text("");
        $("#IhaveCRNdiv").show();
        $("#DonthaveCRNdiv").show();
        $('#Vehicle_No').val();
        $('#Mobile_No').val();
        $('#Vehicle_No').attr('readonly', true);
        $('#Mobile_No').attr('readonly', true);
        is_CRN = true;
        Is_NoCRN = false;
        $('#txt_CRN').val('');
        $('#Product').attr("disabled", true);
        $('#Product').val(0);

    }
    function DONTHAVECRN() {
        radiobtnchked = true;
        $('#ErradioSelect').hide();
        $('#ErradioSelect').text("");
        $('#IhaveCRNdiv').hide();
        $("#DonthaveCRNdiv").show();
        $('#txt_CRN').val('');
        $('#CRN_owner').val('');
        $('#CRN_fba_id').val('');
        $('#channel').val('');
        $('#subchannel').val('');
        $('#Vehicle_No').val('');
        $('#Mobile_No').val('');
        $('#Vehicle_No').attr('readonly', false);
        $('#Mobile_No').attr('readonly', false);
        Is_NoCRN = true;
        is_CRN = false;
        $('#Product').attr("disabled", false);
        $('#Product').val(0);
    }
    function FileUpload() {
        if ($('input.chkfileupload').is(':checked')) {
            $("dynamic_fileup").css('display', 'flex');
            $('#uploadFile').css('display', 'flex');
            $('#uploadFile').css({'width': '100%', 'margin': '0px auto'});

        } else {
            $('#uploadFile').hide();
        }
    }

    function okbtn() {
        location.reload();
    }
    //$('#formSubmit').click(function () {
    //    $('#mypopup').show();
    //});
    //$('#okbtn').click(function () {
    //    $('.Popup').hide();
    //});


    $(document).ready(function () {
        GetCategory();

        if (UDID !== 0) {
            UserTicketCategory();
        }


        $("#SubCategory").change(function () {
            var e = document.getElementById("SubCategory");
            var subcategory = e.options[e.selectedIndex].outerText;
            var url = window.location.href;
            if (url.includes('quotes')) {
                if (subcategory === "0 CRN" && $('#Category').val() === "2") {
                    $('#ErSubCategory').show();
                    $('#ErSubCategory').text("For 0 CRN if you want to raised ticket go to home page. ");
                    $('.0CRN').show();
                    is_CRN = true;
                    //Is_NoCRN =true;
                    $('#IhaveCRNdiv').hide();
                    $('#DonthaveCRNdiv').hide();
                } else {
                    is_CRN = true;
                    $('#IhaveCRNdiv').show();
                    $('#DonthaveCRNdiv').show();
                    $('#ErSubCategory').hide();
                    $('#ErSubCategory').text("");
                    $('.0CRN').hide();
                }
            }
            if (url.includes('buynow')) {
                is_CRN = true;
            }
			
			 var SubCategory = $('#SubCategory').val();
        if (SubCategory !== "0") {
             categoryproduct = $('#SubCategory').val().split(':')[1];
        }
        var drpProduct = document.getElementById("Product");
        $(drpProduct.options).each(function (index, value) {
            if (categoryproduct.includes(value.value) && value.value !== 0) {
                drpProduct.options[index].style.display = "block";
            } else {
                drpProduct.options[index].style.display = "none";
            }
        });
        });
    });

    function productChange() {
        var Product = $('#Product').val();
        if (Product !== 0) {
            $('#ErProduct').hide();
            $('#ErProduct').text("");
        }
        if (Product === 2) {
            $('#ErVehicle_No').hide();
            $('#ErVehicle_No').text("");
            $('#Vehicle_No').hide();
        } else {
            $('#Vehicle_No').show();
        }
    }
//        window.onload = function () {
//            GetCategory();
//            if (UDID != 0) {
//                UserTicketCategory();
//            }
//        };

    function Horizon_Method_Convert(method_action, data, type) {
        var obj_horizon_method = {
            'url': (type === "POST") ? "/TwoWheelerInsurance/call_horizon_post" : "/TwoWheelerInsurance/call_horizon_get?method_name=" + method_action,
            "data": {
                request_json: JSON.stringify(data),
                method_name: method_action,
                client_id: "2"
            }
        };
        return obj_horizon_method;
    }

    function GetCategory() {

        var obj_horizon_data = Horizon_Method_Convert("/tickets/getticketing_category/" + productid, '', "GET");
        $.ajax({
            type: "GET",
            //url: obj_horizon_data['url'],
			//data: siteURL.indexOf("https") == 0 ?  { method_name: '/tickets/getticketing_category/' + productid , client_id: "2" } : ""				
			//url : siteURL.indexOf("https") == 0 ? GeteditUrl()+'/TwoWheelerInsurance/call_horizon_get' : GetUrl()+ '/tickets/getticketing_category/' + productid  ,
			
			data: siteURL.indexOf("https") == 0 ?  { method_name: '/report/getticketing_category' + productid , client_id: "2" } : "",				
			url : siteURL.indexOf("https") == 0 ? GeteditUrl()+'/TwoWheelerInsurance/call_horizon_get' : GetUrl()+ '/report/getticketing_category/' + productid  ,
            dataType: "json",
            success: function (data) {

                $("#Category").empty();
                console.log(data);
                var optionhtml1 = '<option value="' + 0 + '">' + "--Select Category--" + '</option>';
                $("#Category").append(optionhtml1);

                $.each(data, function (i) {
                    //var optionhtml = '<option value="' + data[i].split(':')[0] + '">' + data[i].split(':')[1] + '</option>';
                    var optionhtml = '<option value="' + data[i]["key"] + '">' + data[i]["value"] + '</option>';
                    $("#Category").append(optionhtml);
                });

                urlCheck();
                //application_cnt <20?  $('#next_page').hide():  $('#next_page').show();
            },
            error: function (result) {
                console.log(result);
            }
        });
    }

    function MainCategory() {
        
        var category = $('#Category').val();

        if (category !== "0") {

            category = $('#Category').val().split(':')[0];
            categoryproduct = $('#Category').val().split(':')[1];
            GetSubCategory(category);
            if (category === "1") {
                radiobtnchked = true;
                $('.ihavecrn').hide();
                //$("#donthavrcrn").prop("checked", true);
                document.getElementById("donthavrcrn").checked = true;
                $("#DonthaveCRNdiv").show();
                Is_NoCRN = true;
                is_CRN = false;
                CRN_chk = false;
            } else {

                $('.ihavecrn').show();
                //$("#donthavrcrn").prop("checked", false);
                document.getElementById("donthavrcrn").checked = false;
                $("#DonthaveCRNdiv").hide();
            }
        }
  
        var drpProduct = document.getElementById("Product");
        $(drpProduct.options).each(function (index, value) {
            if (categoryproduct.includes(value.value) && value.value !== 0) {
                drpProduct.options[index].style.display = "block";
            } else {
                drpProduct.options[index].style.display = "none";
            }
        });

    }

    function GetSubCategory(Category_id) {
        var obj_horizon_data = Horizon_Method_Convert("/tickets/getticketingSubCategory/" + Category_id + "/" + productid, '', "GET");
        $.ajax({
            type: "GET",
            //url: obj_horizon_data['url'],
				//data: siteURL.indexOf("https") == 0 ?  { method_name: '/tickets/getticketingSubCategory/' + Category_id + '/' + productid , client_id: "2" } : "",				
			//url : siteURL.indexOf("https") == 0 ? GeteditUrl()+'/TwoWheelerInsurance/call_horizon_get' : GetUrl()+ '/tickets/getticketingSubCategory/' + Category_id + '/' + productid  ,
				data: siteURL.indexOf("https") == 0 ?  { method_name: '/report/getticketingSubCategory' + Category_id + '/' + productid ,  client_id: "2" } : "",				
			url : siteURL.indexOf("https") == 0 ? GeteditUrl()+'/TwoWheelerInsurance/call_horizon_get' : GetUrl()+ '/report/getticketingSubCategory/'+ Category_id + '/' + productid  ,
            dataType: "json",
            success: function (data) {
                $("#SubCategory").empty();
                console.log(data);
                if (data.length > 1) {
                    var optionhtml1 = '<option value="' + 0 + '">' + "--Select SubCategory--" + '</option>';
                    $("#SubCategory").append(optionhtml1);
                }

                $.each(data, function (i) {
                    var optionhtml = '<option value="' + data[i]["key"] + '">' + data[i]["value"] + '</option>';
                    $("#SubCategory").append(optionhtml);
                });

            },
            error: function (result) {
                console.log(result);
            }
        });
    }

    function GetCRN() {
        var CRN = $('#txt_CRN').val();
        var Reg = /^[0-9]+$/;
        if (Reg.test(CRN)) {//&& CRN.length == 7

            $("#ErProduct").hide().html("");
            $("#ErMobile_No").hide().html("");
            $("#ErVehicle_No").hide().html("");
            $('#ErCRN').hide().html("");

            var obj_horizon_data = Horizon_Method_Convert("/tickets/getCRNdetails/" + CRN, '', "GET");
            $.ajax({
                type: "GET",
                //url: obj_horizon_data['url'],
				
				//data: siteURL.indexOf("https") == 0 ?  { method_name: '/tickets/getCRNdetails' + CRN ,  client_id: "2" } : "",				
				//url : siteURL.indexOf("https") == 0 ? GeteditUrl()+'/TwoWheelerInsurance/call_horizon_get' : GetUrl()+ '/tickets/getCRNdetails/'+ CRN,
				
				data: siteURL.indexOf("https") == 0 ?  { method_name: '/report/getCRNdetails' + CRN ,  client_id: "2" } : "",				
				url : siteURL.indexOf("https") == 0 ? GeteditUrl()+'/TwoWheelerInsurance/call_horizon_get' : GetUrl()+ '/report/getCRNdetails/'+ CRN,
				
                dataType: "json",
                success: function (data) {

                    console.log(data);

                    if (data !== "") {
                        CRN_chk = true;
                        is_CRN = true;
                        $('#Product').val(data[0]['Product']);
                        if (data[0]['Product'] === 2) {
                            $('#Vehicle_No').val("");
                            $('#Vehicle_No').hide();
                        } else {
                            $('#Vehicle_No').val(data[0]["Vehicle_No"]);
                            $('#Vehicle_No').show();
                        }
                        $('#CRN_owner').val(data[0]['ss_id']);
                        $('#CRN_fba_id').val(data[0]['fba_id']);
                        $('#channel').val(data[0]['channel']);
                        $('#subchannel').val(data[0]['subchannel']);
                        $('#Mobile_No').val(data[0]["Mobile_No"]);
                    } else {
                        CRN_chk = false;
                        //is_CRN = false;
                        $('#ErCRN').show().html("No details.");
                        $('#Vehicle_No').val("");
                        $('#Product').val("");
                        $('#Mobile_No').val("");
                    }
                },
                error: function (result) {
                    console.log(result);
                }
            });
        } else {
            $('#ErCRN').show().html("Enter valid CRN.");
            $('#Vehicle_No').val("");
            $('#Product').val("");
            $('#Mobile_No').val("");
        }

    }



    function btn_Submit() {
        var Error_count = 0;
        if ($("#Category").val() === null || $("#Category").val() === "" || $("#Category").val() === "0") {
            Error_count++;
            $('#ErCategory').show();
            $('#ErCategory').text("Please select Category.");
        } else {
            $("#ErCategory").hide().html("");
        }

        if ($("#SubCategory").val() === null || $("#SubCategory").val() === "" || $("#SubCategory").val() === "0") {
            Error_count++;
            $('#ErSubCategory').show();
            $('#ErSubCategory').text("Please select SubCategory.");
        } else {
            $("#ErSubCategory").hide().html("");
        }

        //if ($("input:radio[name='crn']").is(":checked")) {
        if (radiobtnchked) {
            if (is_CRN) {
                var regex2 = /^[0-9]+$/;
                if (($("#txt_CRN").val() === null || $("#txt_CRN").val() === "" || $("#txt_CRN").val() === "0" || !regex2.test($("#txt_CRN").val()) || !CRN_chk)) {
                    Error_count++;
                    $('#ErCRN').show();
                    $('#ErCRN').text("Please valid enter CRN.");

                } else {
                    $("#ErCRN").hide().html("");
                }
            }
//                else{
//                        Error_count++;
//                        $('#ErCRN').show();
//                        $('#ErCRN').text("Please valid enter CRN.");
//                }

            if (Is_NoCRN) {
                if ($("#Product").val() === null || $("#Product").val() === "" || $("#Product").val() === "0") {
                    Error_count++;
                    $('#ErProduct').show();
                    $('#ErProduct').text("Please select product.");
                } else {
                    $("#ErProduct").hide().html("");
                }
                if ($("#Mobile_No").val() === null || $("#Mobile_No").val() === "" || $("#Mobile_No").val() === "0") {
                    Error_count++;
                    $('#ErMobile_No').show();
                    $('#ErMobile_No').text("Please enter mobile no.");
                } else {
                    var pattern = new RegExp('^([6-9]{1}[0-9]{9})$');
                    if ($("#Mobile_No").val() !== null || $("#Mobile_No").val() !== "") {
                        if (pattern.test($("#Mobile_No").val()) === false) {
                            Error_count++;
                            $('#ErMobile_No').show();
                            $('#ErMobile_No').text("Please enter valid mobile no.");
                        } else {
                            $("#ErMobile_No").hide().html("");
                        }
                    } else {
                        $("#ErMobile_No").hide().html("");
                    }
                }
                if ($("#Product").val() !== 2) {
                    if ($("#Vehicle_No").val() === null || $("#Vehicle_No").val() === "" || $("#Vehicle_No").val() === "0") {
                        Error_count++;
                        $('#ErVehicle_No').show();
                        $('#ErVehicle_No').text("Please enter vehicle no.");
                    } else {
                        var regex1 = /^[A-Za-z]+$/;
                        var regex2 = /^[0-9]+$/;
                        if ($("#Vehicle_No").val() !== null || $("#Vehicle_No").val() !== "") {
                            if (regex1.test($("#Vehicle_No").val()) || regex2.test($("#Vehicle_No").val())) {
                                Error_count++;
                                $('#ErVehicle_No').show();
                                $('#ErVehicle_No').text("Please enter valid vehicle no.");
                            } else {
                                $("#ErVehicle_No").hide().html("");
                            }
                        } else {
                            $("#ErVehicle_No").hide().html("");
                        }
                    }
                }
            }

        } else {
            Error_count++;
            $('#ErradioSelect').show();
            $('#ErradioSelect').text("Please select option.");

        }


        if (document.getElementById('chk_UploadFile').checked) {
            if ($('#hdfilePicker_1').val() === "" && $('#hdfilePicker_2').val() === "" && $('#hdfilePicker_3').val() === "" && $('#hdfilePicker_3').val() === "") {
                Error_count++;
                $('#EruploadFile').show();
                $('#EruploadFile').text("Please select atleast one file.");
            } else {
                $("#EruploadFile").hide().html("");
            }
        }

        if (Error_count === 0) {
            RaiseTicket();
        } else {
            return false;
        }
    }

    function RaiseTicket() {
		var e = document.getElementById("SubCategory");
        var subcategory = e.options[e.selectedIndex].outerText;
        var objdata = {
            "Ticket_Id": "",
            "Product": $("#Product option:selected").text(),
            "Category": $("#Category option:selected").text(),
            "SubCategory": subcategory,
            "SubCategory_level2": "",
            "From": Name + "(" + UDID + ")",
            "To": Name + "(" + UDID + ")",
            "Status": "Open",
            "Created_By": Name + "(" + UDID + ")",
            "Created_On": "",
            "file_1": $('#hdfilePicker_1').val(),
            "file_2": $('#hdfilePicker_2').val(),
            "file_3": $('#hdfilePicker_3').val(),
            "file_4": $('#hdfilePicker_4').val(),
            "file_ext_1": file_extention[$('#hdfile_ext_1').val()],
            "file_ext_2": file_extention[$('#hdfile_ext_2').val()],
            "file_ext_3": file_extention[$('#hdfile_ext_3').val()],
            "file_ext_4": file_extention[$('#hdfile_ext_4').val()],
            "CRN": $("#txt_CRN").val(),
            "Mobile_No": $('#Mobile_No').val(),
            "Vehicle_No": $('#Vehicle_No').val(),
            "Remark": $('#txt_remark').val(),
            "ss_id": ss_id === undefined ? supportagentid : ss_id,
            "CRN_owner": $("#CRN_owner").val(),
            "Agent_Email": agent_email,
            "fba_id": fba_id,
            "CRN_fba_id": $("#CRN_fba_id").val(),
            "channel": $("#channel").val(),
            "subchannel": $("#subchannel").val()
        };
        //console.log('Limit file size: '+limit);
        console.log(JSON.stringify(objdata));
       
        //var obj_horizon_data = Horizon_Method_Convert("/tickets/raiseticket", objdata, "POST");
        var obj_horizon_data = Horizon_Method_Convert("/report/raiseticket", objdata, "POST");
        $.ajax({
            type: "POST",
            //data: JSON.stringify(obj_horizon_data['data']),
            //url: obj_horizon_data['url'],
			data : siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) :  JSON.stringify(objdata),
			    url :  siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/report/raiseticket" ,
				//data : siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) :  JSON.stringify(objdata),
			    //url :  siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/tickets/raiseticket" ,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (response) {
                console.log(response);

                if (response["Status"] === "Success") {


                    $('.ovl').hide();
                    $('#mypopup').show();
                    $('.mainpopupcont').text(response["Msg"]);
                } else {
                    $('.mainpopupcont').text(response["Msg"]);
                }
            }
        });

    }
    var userticket_category = "";
    function UserTicketCategory() {

        var obj_horizon_data = Horizon_Method_Convert("/tickets/CheckTickitingCategory/" + UDID, '', "GET");
        $.ajax({
            type: "GET",
            //url: obj_horizon_data['url'],
			//data: siteURL.indexOf("https") == 0 ?  { method_name: '/tickets/CheckTickitingCategory?UID=' + UID , client_id: "2" } : "",				
			//url : siteURL.indexOf("https") == 0 ? GeteditUrl()+'/TwoWheelerInsurance/call_horizon_get' : GetUrl()+ '/tickets/CheckTickitingCategory/' + UID  ,
			
			data: siteURL.indexOf("https") == 0 ?  { method_name: '/report/CheckTickitingCategory?UID=' + UDID , client_id: "2" } : "",				
			url : siteURL.indexOf("https") == 0 ? GeteditUrl()+'/TwoWheelerInsurance/call_horizon_get' : GetUrl()+ '/report/CheckTickitingCategory/' + UDID  ,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (response) {
                console.log(response);
                if (response.length > 0) {
                    userticket_category = response.join();
                }
            }
        });
    }
    var file_extention = {
        "application/pdf": "pdf",
        "text/plain": "txt",
        "image/png": "png",
        "image/jpeg": "jpg"
    };
    var handleFileSelect = function (evt) {
		debugger;
       // var files = evt.target.files;
		var files = evt.files;
        var file = files[0];

        var file_id =evt.id; //evt.target.id;
        var i = evt.id.split('_')[1]//evt.target.id.split('_')[1];
        $('#hdfile_ext_' + i).val(files[0]["type"]);

        if (files && file) {
            var reader = new FileReader();

            reader.onload = function (readerEvt) {
                var binaryString = readerEvt.target.result;
                $('#hd' + file_id).val(encodeURIComponent(btoa(binaryString)));
            };

            reader.readAsBinaryString(file);
        }
    };

   
    function CheckVehicle(e) {
        var keyCode = e.keyCode || e.which;
        var ret = true;
        //Regex for Valid Characters i.e. Alphabets and Numbers.
        var regex = /^[A-Za-z0-9]+$/;
        //Validate TextBox value against the Regex.
        var isValid = regex.test(String.fromCharCode(keyCode));
        if (!isValid || e.target.value.length === 11) {
            ret = false;
        }
        return ret;
    }
    function CheckCRN(e) {

        var keyCode = e.keyCode || e.which;
        var ret = true;
        //Regex for Valid Characters i.e. Alphabets and Numbers.
        var regex = /^[0-9]+$/;
        //Validate TextBox value against the Regex.
        var isValid = regex.test(String.fromCharCode(keyCode));
        if (!isValid || e.target.value.length === 11) {
            ret = false;
        }
        return ret;
    }
    function onblurCheckCRN() {
        //var value =
    }

    $(".closebtn").click(function (e) {
        $(".ovl").hide(500);
    });

