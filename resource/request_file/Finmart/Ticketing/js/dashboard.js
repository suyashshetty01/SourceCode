 
    var role_type = "tickets";
    //var Supportagentid = '@Session["agent_id"]' != '' ? '@Session["agent_id"]' : 0;
   // var UID = '@Session["UID"]' != '' ? '@Session["UID"]' : 0;
    //var fbaid = '@Session["fba_id"]' != "" ? '@Session["fba_id"]' : null;
    //var client_id = '@Session["client_id"]' != "" ? '@Session["client_id"]' : 2;
    //var ss_id = '@Session["agent_id"]' != '' ? '@Session["agent_id"]' : 0;
    //var agent_email = '@Session["agent_email"]' != '' ? '@Session["agent_email"]' : "";
    var productid = 0;
    //var fba_id = '@Session["fba_id"]' != '' ? '@Session["fba_id"]' : 0;
	
	var Name = "Khushbu Vipul Gite";
	var UID = "111162";
	var Supportagentid = 813;
	var ss_id = 813;
	var fba_id = 813;
	var agent_email = "khushbu.gite@policyboss.com";
	var client_id = 2;
	var role ="tickets";
	var siteURL = "";

    var Reg = /^[a-zA-Z ]+$/;

    if (role == "tickets") {
        $('.maindiv_tickiting').show();
        $('.RM_dashboard').hide();
    } else {
        $('.maindiv_tickiting').hide();
        $('.RM_dashboard').show();
    }
    function okbtn() {
        location.reload();
    }
    function showtofromDiv() {
        $('.tofromDiv').slideToggle(500, function () {
            $('.tofromDiv').show();
        })
    }
    function hidetofromDiv() {
        $('.tofromDiv').hide();
    }
	function CreateTicket(){
		window.location.href='./ticket.html'
	}
    //function showticketIdInput() {
    //    if ($('input.ticketIdcheckbx').is(':checked')) {
    //        $('.headerSearchFilter').css("grid-template-columns", "20% 1fr 25%");
    //        $('.ticketIdInput').show();
    //    }
    //    else {
    //        $('.headerSearchFilter').css("grid-template-columns", "20% 1fr 35%");
    //        $('.ticketIdInput').hide();
    //    }
    //}

    function Ticket_switcher(input) {
        role_type = input;
        //GetTicketlist();
        ApplyFilter();
        if (input == 'tickets') {
            $('.ticketnavlist').addClass('bottomBordr');
            $('.ticketnavlist1').removeClass('bottomBordr');
        }
        else if (input == 'mytickets') {
            $('.ticketnavlist1').addClass('bottomBordr');
            $('.ticketnavlist').removeClass('bottomBordr');
        }
    }

    function Horizon_Method_Convert(method_action, data, type) {

        var obj_horizon_method = {
            'url': (type == "POST") ? "/TwoWheelerInsurance/call_horizon_post" : "/TwoWheelerInsurance/call_horizon_get?method_name=" + method_action,
            "data": {
                request_json: JSON.stringify(data),
                method_name: method_action,
                client_id: "2"
            }
        };
        return obj_horizon_method;
    }
    $(document).ready(function () {
		siteURL =  window.location.href;
        if (UID != 0) {
            if (role == "tickets") {
                $('#QuoteLoader').show();
                UserTicketCategory();
            } else {
                $('#QuoteLoader_RM').show();
                $('#switchrole_id').val(role);
                GetList();
            }
        } else {
            window.location.href = "/Sales/Login";
        }


    });
    function SetUrl() {
        var url = window.location.href;
        var newurl;
        if (url.includes("local")) {
            newurl = "http://localhost:3000";
        } else if (url.includes("qa")) {
            newurl = "http://qa-horizon.policyboss.com:3000";
        } else if (url.includes("www") || url.includes("cloudfront")) {
            newurl = "http://horizon.policyboss.com:5000";
        }
        return newurl;
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
	
    function GeteditUrl() {
        var url = window.location.href;
        //alert(url.includes("health"));
        var newurl;
        newurl = "http://qa.policyboss.com";
        if (url.includes("localhost")) {
            newurl = "http://localhost:3000";
        } else if (url.includes("qa")) {
            newurl = "http://qa.policyboss.com";
        } else if (url.includes("www") || url.includes("cloudfront")) {
            newurl = "https://www.policyboss.com";
        }
        return newurl;
    }

    var userticket_category = "";
    function UserTicketCategory() {
		
       
        $.ajax({
            type: "GET",
            dataType: "json",
			//data: siteURL.indexOf("https") == 0 ?  { method_name: '/tickets/CheckTickitingCategory?UID=' + UID , client_id: "2" } : "",				
			//url : siteURL.indexOf("https") == 0 ? GeteditUrl()+'/TwoWheelerInsurance/call_horizon_get' : GetUrl()+ '/tickets/CheckTickitingCategory/' + UID  ,
			
			data: siteURL.indexOf("https") == 0 ?  { method_name: '/report/CheckTickitingCategory?UID=' + UID , client_id: "2" } : "",				
			url : siteURL.indexOf("https") == 0 ? GeteditUrl()+'/TwoWheelerInsurance/call_horizon_get' : GetUrl()+ '/report/CheckTickitingCategory/' + UID  ,
            success: function (response) {
                console.log(response);
                userticket_category = response.join();
                if (response.length > 0) {

                    role_type = "mytickets";
                    $('.ticketnavlist1').addClass('bottomBordr');
                    $('.ticketnavlist').removeClass('bottomBordr');
                }
                // GetTicketlist();
                ApplyFilter();
            }
        });
    }

   

    function openMoreInfo(ticketid) {

        var obj_horizon_data = Horizon_Method_Convert("/tickets/getticket/" + ticketid, '', "GET");
        $.ajax({
            type: "GET",
            //url: obj_horizon_data['url'],
			//data: siteURL.indexOf("https") == 0 ?  { method_name: '/tickets/getticket/' + ticketid , client_id: "2" } : "",				
			//url : siteURL.indexOf("https") == 0 ? GeteditUrl()+'/TwoWheelerInsurance/call_horizon_get' : GetUrl()+ '/tickets/getticket/' + ticketid ,
			data: siteURL.indexOf("https") == 0 ?  { method_name: '/tickets/getticket/' + ticketid , client_id: "2" } : "",				
			url : siteURL.indexOf("https") == 0 ? GeteditUrl()+'/TwoWheelerInsurance/call_horizon_get' : GetUrl()+ '/report/getticket/' + ticketid ,
			
            dataType: "json",
            success: function (response) {

                console.log(response);
                $('.MoreInfopopup').show();
                $('body').css('overflow', 'hidden');
                $('#txt_Category').text(response[0]['Category']);
                $('#txt_SubCategory').text(response[0]['SubCategory']);
                $('#txt_from').text(response[0]['From']);
                $('#txt_to').text(response[0]['To']);
                $('#txt_Status').text(response[0]['Status']);
                $('#txt_Modified_on').text(response[0]['Modified_On']);
                $('#txt_CRN1').text(response[0]['CRN']);
                $('#txt_Ticket_id').text(response[0]['Ticket_Id']);
                $('#txt_Product').text(response[0]['Product']);
                $('#txt_Remark').text(response[0]['Remark']);
                $('#txt_Mobile').text(response[0]['Mobile_No']);
                $('#txt_Vehicle').text(response[0]['Vehicle_No']);
                $('#txt_Created_by').text(response[0]['Created_By']);
                $('#txt_Created_on').text(response[0]['Created_On']);


            }
        });

    }
    function openActionInfo(ticketid, status, action) {
		debugger;
        if (status == "Open" && action == "Start") {
            var div = $('#' + ticketid);
            var product = div.children('.product')[0].innerHTML;
            var Category = div.children('.category')[0].innerHTML;
            var SubCategory = div.children('.subcategory')[0].innerHTML;
            var remark = div.children('.Remark')[0].innerHTML;
            var CRN = div.children('.infocrn')[0].innerHTML;
            var objdata = {
                "Ticket_Id": ticketid,
                "Status": "InProgress",
                "ss_id": ss_id,
                "Remark": remark,
                "Agent_Email": agent_email,
                "Product": product,
                "Category": Category,
                "SubCategory": SubCategory,
                "CRN": CRN
            };

           // var obj_horizon_data = Horizon_Method_Convert("/tickets/raiseticket", objdata, "POST");
            var obj_horizon_data = Horizon_Method_Convert("/report/raiseticket", objdata, "POST");
            $.ajax({
                type: "POST",
				data : siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) :  JSON.stringify(objdata),
			    url :  siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/report/raiseticket" ,
				//data : siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) :  JSON.stringify(objdata),
			    //url :  siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/tickets/raiseticket" ,
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (response) {
                    console.log(response);
                    if (response["Status"] == "Success") {
                        var obj_horizon_data = Horizon_Method_Convert("/tickets/getticket/" + ticketid, '', "GET");
                        $.ajax({
                            type: "GET",
							//data: siteURL.indexOf("https") == 0 ?  { method_name: '/tickets/getticket?ticketid=' + ticketid , client_id: "2" } : "",				
							//url : siteURL.indexOf("https") == 0 ? GeteditUrl()+'/TwoWheelerInsurance/call_horizon_get' : GetUrl()+ '/tickets/getticket/' + ticketid ,
							
							data: siteURL.indexOf("https") == 0 ?  { method_name: '/report/getticket?ticketid=' + ticketid , client_id: "2" } : "",			
							url : siteURL.indexOf("https") == 0 ? GeteditUrl()+'/TwoWheelerInsurance/call_horizon_get' : GetUrl()+ '/report/getticket/' + ticketid ,
							
                            dataType: "json",
                            success: function (response) {
                                //debugger;
                                console.log(response);
                                $('.Actnpopup').show();
                                $('body').css('overflow', 'hidden');
                                $('#txtAct_Category').text(response[0]['Category']);
                                $('#txtAct_SubCategory').text(response[0]['SubCategory']);
                                $('#txtAct_from').text(response[0]['From']);
                                $('#txtAct_to').text(response[0]['To']);
                                $('#drpStatus').val(response[0]['Status']);
                                $('#txtAct_Modified_on').text(response[0]['Modified_On']);
                                $('#txtAct_CRN').text(response[0]['CRN']);
                                $('#txtAct_Ticket_id').text(response[0]['Ticket_Id']);
                                $('#txtAct_Product').text(response[0]['Product']);
                                $('#txtAct_Remark').text(response[0]['Remark']);
                                $('#txtAct_Mobile').text(response[0]['Mobile_No']);
                                $('#txtAct_Vehicle').text(response[0]['Vehicle_No']);
                                $('#txtAct_ss_id').text(response[0]['ss_id']);
                                $('#txtAct_Created_by').text(response[0]['Created_By']);
                                $('#txtAct_Created_on').text(response[0]['Created_On']);

                                //debugger;
                                if (role_type != "mytickets") {  // Reported by me
                                    if (ss_id == $('#txtAct_ss_id').text()) {
                                        var drop = document.getElementById("drpStatus");
                                        $(drop.options).each(function (index, value) {
                                           // if (value.text != "Closed" && value.text != "Reopened" && value.text != "Cancel" && value.text != "Select Status") {
                                                if (value.text != "Closed"  && value.text != "Cancel" && value.text != "Select Status") {
                                                drop.options[index].style.display = "none";
                                            }
                                        })
                                        //drop.options[1].style.visibility = "hidden";
                                    }
                                } else {  // My tickets
                                    var drop = document.getElementById("drpStatus");
                                    $(drop.options).each(function (index, value) {

                                        if (value.text == "Closed" || value.text == "Reopened" || value.text == "Open" || value.text == "Cancel") {
                                            drop.options[index].style.display = "none";
                                        }
                                    })
                                }
                            }
                        });
                    }

                }
            });

        } else if ((status == "Resolved" && role_type == "mytickets") || (status == "Closed" && role_type == "mytickets") || (status == "Cancel")) {
            return false;
        } else {
            var obj_horizon_data = Horizon_Method_Convert("/tickets/getticket/" + ticketid, '', "GET");
            $.ajax({
                type: "GET",
				//data: siteURL.indexOf("https") == 0 ?  { method_name: '/tickets/getticket?ticketid=' + ticketid , client_id: "2" } : "",				
							//url : siteURL.indexOf("https") == 0 ? GeteditUrl()+'/TwoWheelerInsurance/call_horizon_get' : GetUrl()+ '/tickets/getticket/' + ticketid ,
							
							data: siteURL.indexOf("https") == 0 ?  { method_name: '/report/getticket?ticketid=' + ticketid , client_id: "2" } : "",			
							url : siteURL.indexOf("https") == 0 ? GeteditUrl()+'/TwoWheelerInsurance/call_horizon_get' : GetUrl()+ '/report/getticket/' + ticketid ,
                //url: obj_horizon_data['url'],
                dataType: "json",
                success: function (response) {
                    //debugger;
                    console.log(response);
                    $('.Actnpopup').show();
                    $('body').css('overflow', 'hidden');
                    $('#txtAct_Category').text(response[0]['Category']);
                    $('#txtAct_SubCategory').text(response[0]['SubCategory']);
                    $('#txtAct_from').text(response[0]['From']);
                    $('#txtAct_to').text(response[0]['To']);
                    $('#drpStatus').val(response[0]['Status']);
                    $('#txtAct_Modified_on').text(response[0]['Modified_On']);
                    $('#txtAct_CRN').text(response[0]['CRN']);
                    $('#txtAct_Ticket_id').text(response[0]['Ticket_Id']);
                    $('#txtAct_Product').text(response[0]['Product']);
                    $('#txtAct_Remark').text(response[0]['Remark']);
                    $('#txtAct_Mobile').text(response[0]['Mobile_No']);
                    $('#txtAct_Vehicle').text(response[0]['Vehicle_No']);
                    $('#txtAct_ss_id').text(response[0]['ss_id']);
                    $('#txtAct_Created_by').text(response[0]['Created_By']);
                    $('#txtAct_Created_on').text(response[0]['Created_On']);
                    
                    if (role_type != "mytickets") {  // Reported by me
                        if (ss_id == $('#txtAct_ss_id').text()) {
                            var drop = document.getElementById("drpStatus");
                            var statusvalue = response[0]['Status'];
                            //debugger;
                            $(drop.options).each(function (index, value) {
                                if (statusvalue == "Resolved" || statusvalue == "Closed" ) {
                                    if (value.text != "Closed" && value.text != "Reopened" && value.text != "Cancel" && value.text != "Select Status") {

                                        drop.options[index].style.display = "none";
                                    }
                                }
                                else {
                                    if (value.text != "Closed" && value.text != "Cancel" && value.text != "Select Status") {
                                        drop.options[index].style.display = "none";
                                    } else {
                                        drop.options[index].style.display = "block";
                                    }
                                }
                            })
                            //drop.options[1].style.visibility = "hidden";
                        }
                    } else {  // My tickets
                        var drop = document.getElementById("drpStatus");
                        $(drop.options).each(function (index, value) {

                            if (value.text == "Closed" || value.text == "Reopened" || value.text == "Open" || value.text == "Cancel") {
                                drop.options[index].style.display = "none";
                            }
                            else {
                                drop.options[index].style.display = "block";
                            }
                        })
                    }
                }
            });
        }

    }

    function btn_submitForm() {
        //var objdata = {
        //    "Ticket_Id": $("#txtAct_Ticket_id").text(),
        //    "Product": $("#txtAct_Product").text(),
        //    "Category": $('#txtAct_Category').text(),
        //    "SubCategory": $('#txtAct_SubCategory').text(),
        //    "SubCategory_level2": $('#drpSubCategorylevel2').val(),
        //    "From": $('#txtAct_from').text(),
        //    "To": $('#txtAct_from').text(),
        //    "Status": $('#drpStatus').val(),
        //    "Created_By": $('#txtAct_Created_by').text(),
        //    "Created_On":( $('#txtAct_Created_on').val()),
        //    "file_1": "",
        //    "file_2": "",
        //    "file_3": "",
        //    "file_4": "",
        //    "file_ext_1": "",
        //    "file_ext_2": "",
        //    "file_ext_3": "",
        //    "file_ext_4": "",
        //    "CRN": $("#txtAct_CRN").text(),
        //    "Mobile_No": $('#txtAct_Mobile').text(),
        //    "Vehicle_No": $('#txtAct_Vehicle').text(),
        //    "Remark": $('#txtAct_remark').val(),
        //    "ss_id": ss_id
        //};
        var status = $('#drpStatus').val();
        var objdata = {
            "Ticket_Id": $("#txtAct_Ticket_id").text(),
            "Product": $("#txtAct_Product").text(),
            "Category": $('#txtAct_Category').text(),
            "SubCategory": $('#txtAct_SubCategory').text(),
            "SubCategory_level2": $('#drpSubCategorylevel2').val(),
            "Status": status == "Release" ? "Open" : status,
            "ss_id": ss_id,
            "Remark": $('#txtAct_remark').val(),
            "Agent_Email": agent_email,
            "CRN": $('#txtAct_CRN').val()
        };

        console.log(objdata)
        //var obj_horizon_data = Horizon_Method_Convert("/tickets/raiseticket", objdata, "POST");
        var obj_horizon_data = Horizon_Method_Convert("/report/raiseticket", objdata, "POST");
        $.ajax({
            type: "POST",
            //data: JSON.stringify(obj_horizon_data['data']),
           // url: obj_horizon_data['url'],
		   // data : siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) :  JSON.stringify(objdata),
			//url :  siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/tickets/raiseticket" ,
		   data : siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) :  JSON.stringify(objdata),
			url :  siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/report/raiseticket" ,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (response) {
                console.log(response);

                if (response["Status"] == "Success") {
                    $('.Actnpopup').hide();
                    $('#ResultPopup').show();

                    $('.mainpopupresult').text(response["Msg"]);

                    //alert("Ticket raise successfully. Kindly please find the Ticket Id: " +response["Ticket_Id"]+" for reference");
                } else {
                    $('.mainpopupresult').text(response["Msg"]);
                }
            }
        });
    }

    $('.openPopup').click(function () {
        $('.Actnpopup').show();
    });
    $('.closepopup').click(function () {

        //$('.Actnpopup').hide();
        //$('.MoreInfopopup').hide();
        //$('body').css('overflow', 'auto');
        //location.reload();
		//location.reload(true);
    });
	function Closepopup(){
		location.reload();
		//$('.Actnpopup').hide();
        //$('.MoreInfopopup').hide();
	}
    $('.openMoreInfo').click(function () {
        $('.MoreInfopopup').show();
    });

    $('.OpenFiltPopup').click(function () {
        $('.FilterPop').show();
    });
    $('.CloseFiltpop').click(function () {
        $('.FilterPop').hide();
    });


    function StatusUpdate() {
        var status = $('#drpStatus').val();

        if (status == "Assigned") {
            $('.divSubCatlevel2').show();
            var objdata = {
                "subcategory": $('#txtAct_SubCategory').text(),
                "level": "2"
            }

            //var obj_horizon_data = Horizon_Method_Convert("/tickets/getSubCategoryLevel", objdata, "POST");
            var obj_horizon_data = Horizon_Method_Convert("/report/tickets/getSubCategoryLevel", objsearch, "POST");
            $.ajax({
                type: "POST",
                data: JSON.stringify(obj_horizon_data['data']),
                url: obj_horizon_data['url'],
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (response) {
                    console.log(response);
                    if (response.length > 0) {
                        if (response.length > 1) {
                            var optionhtml1 = '<option value="' + 0 + '">' + "--Select SubCategory--" + '</option>';
                            $("#drpSubCategorylevel2").append(optionhtml1);
                        }

                        $.each(response, function (i) {
                            var optionhtml = '<option value="' + response[i] + '">' + response[i] + '</option>';
                            $("#drpSubCategorylevel2").append(optionhtml);
                        });
                    }

                }
            });
        } else {
            $('.divSubCatlevel2').hide();
        }
    }

    var searchby = "CurrentDate";
    $(function () {
        $('#Fromdatepicker').datepicker({ dateFormat: 'yy-mm-dd' });
        $('#Todatepicker').datepicker({ dateFormat: 'yy-mm-dd' });
    });
    $(function () {
        $('#Fromdatepickermbl').datepicker({ dateFormat: 'yy-mm-dd' });
        $('#Todatepickermbl').datepicker({ dateFormat: 'yy-mm-dd' });
    });
    $(function () {
        $('#Fromdatepicker_RM').datepicker({ dateFormat: 'yy-mm-dd' });
        $('#Todatepicker_RM').datepicker({ dateFormat: 'yy-mm-dd' });
    });

    function showticketIdInput1() {
        //debugger;
        if ($('input#chk_ticket').is(':checked')) {
            $('#chk_CRN').attr('checked', false);
            $('.readonly').attr('disabled', true);
            document.getElementsByClassName("readonly").readOnly = false;
            $('.headerSearchFilter').css("grid-template-columns", "20% 1fr 25%");
            $('.ticketIdInput').show().attr('placeholder', 'Enter Ticket Id');       
        }
        else {
            $('#chk_ticket').attr('checked', false);
            $('.ticketIdInput').show().attr('placeholder', 'Enter CRN');
            $('.srh_ticketid').text("");
            $('.headerSearchFilter').css("grid-template-columns", "20% 1fr 35%"); 
            $('.readonly').attr('disabled', false);
            document.getElementsByClassName("readonly").readOnly = true;
        }
    }

    function showticketIdInput() {
       
        $('.srh_ticketid').text("");
        if ($('input#chk_ticket').is(':checked')) {
            searchby = "ticketid";
            $('input[id=chk_CRN]').attr('checked', false);
            $('#chk_CRN').attr('checked', false);
            $('.readonly').attr('disabled', true);
            document.getElementsByClassName("readonly").readOnly = false;
            $('.headerSearchFilter').css("grid-template-columns", "20% 1fr 25%");
            $('.ticketIdInput').show().attr('placeholder', 'Enter Ticket Id');
            $('#Fromdatepicker').val("");
            $('#Todatepicker').val("");
            $('#drpsrhStatus').val("");
        }
        else {
            searchby = "";
            $('.srh_ticketid').text("");
            
            $('.headerSearchFilter').css("grid-template-columns", "20% 1fr 30%"); $('.ticketIdInput').hide();
            $('.readonly').attr('disabled', false);
            document.getElementsByClassName("readonly").readOnly = true;
        }
    }
    function showCRNInput() {
       
        $('.srh_ticketid').text("");
        if ($('input#chk_CRN').is(':checked')) {
            searchby = "CRN";
            $('input[id=chk_ticket]').attr('checked', false);
            $('.readonly').attr('disabled', true);
            document.getElementsByClassName("readonly").readOnly = false;
            $('.headerSearchFilter').css("grid-template-columns", "20% 1fr 25%");
            $('.ticketIdInput').show().attr('placeholder', 'Enter CRN');
            $('#Fromdatepicker').val("");
            $('#Todatepicker').val("");
            $('#drpsrhStatus').val("");
        }
        else {
            searchby = "";
            $('.srh_ticketid').text("");
            $('.headerSearchFilter').css("grid-template-columns", "20% 1fr 30%"); $('.ticketIdInput').hide();
            $('.readonly').attr('disabled', false);
            document.getElementsByClassName("readonly").readOnly = true;
        }
    }

    function showticketIdInputmbl() {
       
        $('.srh_ticketidmbl').text("");
        if ($('input#chk_ticketmbl').is(':checked')) {
            searchby = "ticketid";
            $('input[id=chk_CRNmbl]').attr('checked', false);
            $('#Fromdatepickermbl').val("");
            $('#Todatepickermbl').val("");
            $('#drpsrhStatusmbl').val("");
            $('.readonly').attr('disabled', true);
            document.getElementsByClassName("readonly").readOnly = false;
            $('.headerSearchFilter').css("grid-template-columns", "20% 1fr 25%");
            $('.ticketIdInput').show().attr('placeholder', 'Enter Ticket Id');
        }
        else {
            searchby = "";
            $('.srh_ticketid').text("");
            $('.headerSearchFilter').css("grid-template-columns", "20% 1fr 30%"); $('.ticketIdInput').hide();
            $('.readonly').attr('disabled', false);
            document.getElementsByClassName("readonly").readOnly = true;
        }
    }
    function showCRNInputmbl() {
        $('.srh_ticketidmbl').text("");
        if ($('input#chk_CRNmbl').is(':checked')) {
            searchby = "CRN";
            $('input[id=chk_ticketmbl]').attr('checked', false);
            $('.readonly').attr('disabled', true);
            document.getElementsByClassName("readonly").readOnly = false;
            $('.headerSearchFilter').css("grid-template-columns", "20% 1fr 25%");
            $('.ticketIdInput').show().attr('placeholder', 'Enter CRN');
            $('#Fromdatepickermbl').val("");
            $('#Todatepickermbl').val("");
            $('#drpsrhStatusmbl').val("");
        }
        else {
            searchby = "";
            $('.srh_ticketid').text("");
            $('.headerSearchFilter').css("grid-template-columns", "20% 1fr 30%"); $('.ticketIdInput').hide();
            $('.readonly').attr('disabled', false);
            document.getElementsByClassName("readonly").readOnly = true;
        }
    }


    function showtofromDiv() {
        searchby = "";
        $('.tofromDiv').slideToggle(500, function () {
            $('.tofromDiv').show();
        })
    }
    function hidetofromDiv() {
        searchby = "CurrentDate";
        $('#Fromdatepicker_RM').val("");
        $('#Todatepicker_RM').val("");
        $('#Fromdatepicker').val("");
        $('#Todatepicker').val("");
        $('.tofromDiv').hide();
    }

    function ApplyFilter() {
        
        var objsearch = {};
        var fromdate = "";
        var todate = "";
        var status = "";
        var searchvalue = "";
        fromdate = $('#Fromdatepicker').val() == "" ? $('#Fromdatepickermbl').val() : $('#Fromdatepicker').val();
        todate = $('#Todatepicker').val() == "" ? $('#Todatepickermbl').val() : $('#Todatepicker').val();
        status = $('#drpsrhStatus').val() == "" ? $('#drpsrhStatusmbl').val() : $('#drpsrhStatus').val();

        searchvalue = $('#srh_ticketid').val() == "" ? $('#srh_ticketidmbl').val() : $('#srh_ticketid').val();

        var chkvalue = checkinput(searchvalue, searchby);
        if (chkvalue) {
            if ($('input.ticketIdcheckbx').is(':checked')) {

                // if ($('#srh_ticketid').val() != null && $('#srh_ticketid').val() != "") {
                if (searchvalue != null && searchvalue != "") {
                    objsearch = {
                        "search_by": searchby,
                        //"ticket_id": ticketid.toUpperCase(),
                        "search_byvalue": searchvalue,
                        "from_date": "",
                        "to_date": "",
                        "status": "",
                        "ss_id": ss_id,
                        "Category": userticket_category,
                        "role_type": role_type
                    }
                } else { $('.srh_ticketid').text("Please enter Ticket Id"); return false; }

            } else {
                objsearch = {
                    "search_by": searchby == "CurrentDate" ? "CurrentDate" : "",
                    //"ticket_id": "",
                    "search_byvalue": "",
                    "from_date": searchby == "CurrentDate" ? "" : fromdate,
                    "to_date": searchby == "CurrentDate" ? "" : todate,
                    "status": status,
                    "ss_id": ss_id,
                    "Category": userticket_category,
                    "role_type": role_type
                }
            }
            $('#QuoteLoader').show();
            $('.tickitlist').hide();

            if (true) {
                
                //var obj_horizon_data = Horizon_Method_Convert("/tickets/search", objsearch, "POST");
                var obj_horizon_data = Horizon_Method_Convert("/report/ticket/search", objsearch, "POST");
                $.ajax({
                    type: "POST",
                    //data: JSON.stringify(objsearch),
                    //url : "http://localhost:3000/tickets/search",
                    //data: JSON.stringify(obj_horizon_data['data']),
                    //url: obj_horizon_data['url'],
					// data : siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) :  JSON.stringify(objsearch),
					//url :  siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/tickets/search" ,
					data : siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) :  JSON.stringify(objsearch),
					url :  siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/report/ticket/search" ,
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        
                        console.log(response);
                        $('.FilterPop').hide();
                        if (response.length > 0) {
                            $('#QuoteLoader').hide();
                            $('.tickitlist').show();
                            $('.tickitlist').empty();
                            $('.tickit_error').hide();
                            $('.dashboardcontnr').show();

                            //mobile 
                            $('.mblticketlst').show();
                            $('.mblticketlst').empty();

                            for (var i in response) {
                                $('.tickitlist').append('<div class="displaygriddata" id="' + response[i]["Ticket_Id"] + '"  ticket_id="' + response[i]["Ticket_Id"] + '">'
                                                     + '<div class="openMoreInfo" onClick="openMoreInfo(\'' + response[i]["Ticket_Id"] + '\')" >' + response[i]["Ticket_Id"] + '</div>'
                                                     + '<div class="product">' + response[i]["Product"] + '</div>'
                                                     + '<div class="category">' + response[i]["Category"] + '</div>'
                                                     + '<div class="subcategory">' + response[i]["SubCategory"] + '</div>'
                                                     + '<div>' + response[i]["From"] + '</div>'
                                                     + '<div>' + response[i]["Created_On_UI"] + '</div>'
                                                     + '<div class="infocrn">' + response[i]["CRN"] + '</div>'
                                                     + '<div>' + response[i]["Mobile_No"] + '</div>'
                                                     + '<div class="Remark">' + response[i]["Remark"] + '</div>'
                                                     + '<div>' + response[i]["Status"] + '</div>'
                                                     + '<div class="openPopup" onClick="openActionInfo(\'' + response[i]["Ticket_Id"] + '\',\'' + response[i]["Status"] + '\',\'' + response[i]["Action_name"] + '\'  )">' + response[i]["Action_name"] + '</div>'
                                                     + '</div>');
                                $('.mblticketlst').append('<div class="card_col">'
                                                                + '<div class="data_left">'
                                                                + '<div class="Id_data" onClick="openMoreInfo(\'' + response[i]["Ticket_Id"] + '\')">' + response[i]["Ticket_Id"] + '</div>'
                                                                + '<div class="Actn_data openPopup" onClick="openActionInfo(\'' + response[i]["Ticket_Id"] + '\',\'' + response[i]["Status"] + '\',\'' + response[i]["Action_name"] + '\'  )">' + response[i]["Action_name"] + '</div>'
                                                                + '</div>'
                                                                + '<div>CRN : ' + response[i]["CRN"] + '</div>'
                                                                + '<div>Status : ' + response[i]["Status"] + '</div>'
                                                           + '</div>')

                            }
                        } else {

                            $('.tickit_error').show();
                            $('.dashboardcontnr').hide();
                            $('.mblticketlst').hide();
                        }
                    }
                });
            }
        }

        
    }

    function Checkalphanumeric(e) {

        var keyCode = e.keyCode || e.which;
        var ret = true;
        //Regex for Valid Characters i.e. Alphabets and Numbers.
        var regex = /^[A-Za-z0-9]+$/;
        //Validate TextBox value against the Regex.
        var isValid = regex.test(String.fromCharCode(keyCode));
        if (!isValid || e.target.value.length == 11) {
            ret = false
        }
        return ret;
    }

    function checkinput(value, type) {
        
        var ret = true;    
        if (type == "ticketid") {
            var regex = /^[A-Za-z0-9]+$/;
            var isValid = regex.test(value);
            if (!isValid) {
                ret = false
                $('.srh_ticketid').text("Enter valid ticket");
            } else {
                $('.srh_ticketid').text("");
            }
        } else if (type == "CRN") {
            var regex = /^[0-9]+$/;
            var isValid = regex.test(value);
            if (!isValid) {
                ret = false;
                $('.srh_ticketid').text("Enter valid CRN");
            } else { $('.srh_ticketid').text(""); }
        } else {
        }
        return ret;
    }