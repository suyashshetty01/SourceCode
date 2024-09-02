String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
var rowHtmlCore;
var port = '3000';
var HorizonDomain = location.protocol + '//' + location.hostname;
var SubDomainName = location.hostname.split('.')[0];
if (SubDomainName === 'localhost' || SubDomainName === 'dev-horizon' || SubDomainName === 'qa-horizon') {
    HorizonDomain += ':3000';
} else if (SubDomainName === 'uat-horizon') {
    HorizonDomain += ':4000';
} else if (SubDomainName === 'horizon') {
    HorizonDomain += ':5000';
}

function FormToJson()
{
    var jsonCore = {
        "product_id": 1,
        "vehicle_id": 325,
        "rto_id": 100,
        "vehicle_insurance_type": "renew",
        "vehicle_manf_date": "2016-05-15",
        "vehicle_registration_date": "2016-06-24",
        "policy_expiry_date": "2017-06-23",
        "vehicle_registration_type": "individual",
        "vehicle_ncb_current": "0",
        "is_claim_exists": "no",
        "birth_date": "1981-12-07",
        "method_type": "Premium",
        "execution_async": "yes",
        "electrical_accessory": "10000",
        "non_electrical_accessory": "10000",
        "registration_no": "MH-01-PA-1234",
        "is_llpd": "no",
        "is_external_bifuel": "no",
        "first_name": "",
        "last_name": "",
        "middle_name": "",
        "external_bifuel_value": "0",
        "secret_key": "SECRET-YK369FTE-AO4J-DHW1-U2VS-BV2LWSDVWIDD",
        "client_key": "CLIENT-KNEWWLUO-E4TQ-HJGT-VDCL-UEYLOIIYYUZS"
    };
    var updateJsonObj = jsonCore;
    $.each($('#frmRequest').serializeArray(), function (index, value) {
        if (updateJsonObj.hasOwnProperty(value['name'])) {
            updateJsonObj[value['name']] = value['value'];
        }
    });
    $('#txtServiceRequestJson').val(JSON.stringify(updateJsonObj, undefined, 2));

}
var QuoteTimeSummary = {};
var master_quote_list = [];
var start = new Date();
var insurer_logo = {
    "Insurer_1": "BajajAllianzGeneral.png",
    "Insurer_9": "reliance.png",
    "Insurer_4": "Future_Generali_General.png",
    "Insurer_7": "Iffco_Tokio_General.png",
    "Insurer_33": "lvgi.png",
    "Insurer_5": "hdfc.png",
    "Insurer_2": "Bharti_Axa_General.png",
    "Insurer_12": "new_india.png",
    "Insurer_11": "tata_aig.png",
    "Insurer_19": "universal_sompo.png",
    "Insurer_30": "kotak.png",
    "Insurer_10": "royal.png"
};
function ResetSearch() {
    start = new Date();
    $('#insurer_cnt').html('');
    $('#request_cnt').html('');
    $('#avgidv_cnt').html('');
    $('#avgprem_cnt').html('');
    $('#quote_progress_data').attr('aria-valuenow', 5);
    $('#quote_progress_data').attr('style', 'width:' + 5 + '%;');


    QuoteTimeSummary = {
        '0_to_5': [],
        '5_to_10': [],
        '10_to_15': [],
        '15_to_200': []
    };
    master_quote_list = [];
    //$('.count-to').countTo();
    $('.calling img').show();
    $('.calling img').animateCss('bounceInUp');
    $('.0_to_5 img,.5_to_10 img,.10_to_15 img,.15_to_200 img,.quote_na img').hide();
//$('.preloader').hide();
    $('html, body').animate({
        scrollTop: $("#quote_widget").offset().top - 100
    }, 'slow');
}
var TimeOutRetriveCall;
function ServiceCall()
{
    ResetSearch();
    var jsonRequest = JSON.parse($('#txtServiceRequestJson').val());


    $.ajax({
        type: 'POST',
        url: HorizonDomain + "/quote/premium_initiate", // json datasource
        dataType: 'json',
        data: jsonRequest,
        //cache: false,
        success: function (serviceResponse) {


            console.log(serviceResponse);
            if (jsonRequest['execution_async'] == 'yes') {
                TimeOutRetriveCall = window.setTimeout(function () {
                    retriveQuote(serviceResponse.Summary.Request_Unique_Id);
                }, 3000);

            } else {
                loadQuote(serviceResponse);
            }
            $('#quote_progress').show();
        },
        error: function () {
            $('#quote_progress').hide();
            $('.preloader').hide();
            alert("Connection Is Not Available");
        }
    });

    return false;
}
function cancelRetriveTimeout() {
    clearTimeout(TimeOutRetriveCall);
}
function retriveQuote(srn) {
    var jsonRequest = JSON.parse($('#txtServiceRequestJson').val());
    var jsonRequest = {
        "search_reference_number": srn,
        "secret_key": jsonRequest.secret_key,
        "client_key": jsonRequest.client_key
    };
    $.ajax({
        type: 'POST',
        url: HorizonDomain + "/quote/premium_list_db", // json datasource
        dataType: 'json',
        data: jsonRequest,
        //cache: false,
        success: function (serviceResponse) {
            //if (serviceResponse.Summary.Complete < serviceResponse.Summary.Total || serviceResponse.Summary.Total === 0) {
            loadQuote(serviceResponse);
            if (serviceResponse.Summary.Status === 'complete') {
                //$('.count-to').countTo();
                $('#quote_progress').hide();
                console.log('master_quote_list', master_quote_list.length, master_quote_list);

                console.log('master_quote', master_quote_list.join('|'));

                jQuery.each(insurer_logo, function (i, val) {
                    var insurer_id = parseInt(i.split('_')[1]);
                    console.log('index', insurer_id, master_quote_list.indexOf(i));

                    if (master_quote_list.indexOf(i) < 0) {
                        $("#calling_" + insurer_id).fadeOut("slow");

                        $("#quote_na_" + insurer_id).fadeIn("slow");
                        $("#quote_na_" + insurer_id).animateCss('bounceInUp');
                    }
                });


                /* for (var k in QuoteTimeSummary) {
                 if (QuoteTimeSummary[k] == '') {
                 $('#' + k).html('NA');
                 } else {
                 $('#' + k).html(QuoteTimeSummary[k].join('<br>'));
                 }
                 }
                 */
                //$('#mdModal .modal-content').removeAttr('class').addClass('modal-content modal-col-orange');
                //$('#mdModal').modal('show');
                //alert(JSON.stringify(QuoteTimeSummary, undefined, 2));
            }
            if (serviceResponse.Summary.Status === 'pending') {
                window.setTimeout(function () {
                    retriveQuote(serviceResponse.Summary.Request_Unique_Id);
                }, 3000);
            }

        },
        error: function () {
            $('.preloader').hide();
            alert("Connection Is Not Available");
        }
    });
}
var coreLogModelHtml = $('#mdLog').html();
function ServiceLogView(Service_Log_Id) {
    var logHtml = coreLogModelHtml;
    logHtml = logHtml.replaceAll('___Service_Log_Id___', Service_Log_Id);
    logHtml = logHtml.replaceAll('___HorizonDomain___', HorizonDomain);
    $('#mdLog').html(logHtml);
//    $('#ifr_request').attr('src', HorizonDomain+':3000/service_logs/' + Service_Log_Id + '/Insurer_Request');
//    $('#ifr_response').attr('src', HorizonDomain+':3000/service_logs/' + Service_Log_Id + '/Insurer_Response_Core');
    $('#mdLog .modal-content').removeAttr('class').addClass('modal-content modal-col-orange');
    $('#mdLog').modal('show');
}
function loadQuote(serviceResponse) {
    $('#rowTemplate').html('');
    $('#txtServiceResponseJson').val(JSON.stringify(serviceResponse, undefined, 2));

    $('#Request_Id').html(serviceResponse.Summary.Request_Id);
    $('#lblSrn').html(serviceResponse.Summary.Request_Unique_Id);
    $('#Total').html(serviceResponse.Summary.Total);
    $('#Pending').html(serviceResponse.Summary.Pending);
    $('#Complete').html(serviceResponse.Summary.Complete);
    $('#Success').html(serviceResponse.Summary.Success);
    $('#Fail').html(serviceResponse.Summary.Fail);
    $('#Total_Execution_Time').html(serviceResponse.Summary.Total_Execution_Time);
    $('#Actual_Time').html(Math.round(serviceResponse.Summary.Actual_Time));

    var progress = Math.round((serviceResponse.Summary.Complete / serviceResponse.Summary.Total) * 100);
    if (progress > 5) {
        $('#quote_progress_data').attr('aria-valuenow', progress);
        $('#quote_progress_data').attr('style', 'width:' + progress + '%;');
    }
    var cnt_widget_data = {
        'insurer': [],
        'request': 0,
        'idv': [],
        'prem': []
    };

    var insurer_cnt = 0;
    for (var k in serviceResponse.Response) {


        var objRes = serviceResponse.Response[k];
        if (cnt_widget_data.insurer.indexOf(objRes['Insurer_Id']) < 0) {
            insurer_cnt++;
            cnt_widget_data.insurer.push(objRes['Insurer_Id']);
        }
        if (objRes['Status'] === 'pending') {
            continue;
        }
        if (objRes['Status'] === 'complete') {
            var end = new Date();
            var diff_sec = (end - start) / 100;
            for (var k in QuoteTimeSummary) {
                var arr_rang = k.split('_to_');
                if (master_quote_list.indexOf('Insurer_' + objRes['Insurer']['Insurer_ID']) < 0 &&
                        (objRes['Call_Execution_Time'] - 0) > (arr_rang[0] - 0) &&
                        (objRes['Call_Execution_Time'] - 0) < (arr_rang[1] - 0) &&
                        objRes['Error_Code'] === '') {
                    QuoteTimeSummary[k].push(objRes['Insurer']['Insurer_Code']);
                    master_quote_list.push('Insurer_' + objRes['Insurer']['Insurer_ID']);
                    //console.log('iteration',master_quote_list,'Insurer_' + objRes['Insurer']['Insurer_ID']);
                    $("#calling_" + objRes['Insurer']['Insurer_ID']).fadeOut("slow");
                    $("#" + k + "_" + objRes['Insurer']['Insurer_ID']).fadeIn("slow");
                    $("#" + k + "_" + objRes['Insurer']['Insurer_ID']).animateCss('bounceInUp');
                    //$("#" + k + "_" + objRes['Insurer']['Insurer_ID']).bounce({times: 6}, "slow");
                }
            }

        }

        var rowHtmlUpdate = rowHtmlCore;

        cnt_widget_data.request++;
        if (objRes['LM_Custom_Request']['vehicle_expected_idv'] !== null) {
            cnt_widget_data.idv.push(objRes['LM_Custom_Request']['vehicle_expected_idv']);
        }
        if (objRes['Premium_Breakup'] !== null) {
            var prem = Math.round(objRes['Premium_Breakup']['final_premium'] - 0);
            if (!isNaN(prem)) {
                console.log('PremPush', prem);
                cnt_widget_data.prem.push(prem);
            }
        }

        var Error = '';


        var jsonData = {
            "___Service_Log_Id___": objRes['Service_Log_Id'],
            "___Insurer_Name___": objRes['Insurer']['Insurer_Code'],
            "___Status___": (objRes['Error_Code'] === '') ? 'Success' : objRes['Error_Code'],
            "___Row_Color___": (objRes['Error_Code'] === '') ? 'bg-green' : 'bg-orange',
            "___Error___": Error,
            "___Plan_Name___": objRes['Plan_Name']
        };
        if (objRes['Premium_Breakup'] !== null) {
            var od_breakup = JSON.stringify(objRes['Premium_Breakup']['own_damage'], undefined, 2);
            od_breakup = od_breakup.replace(/"/g, "").replace(/{/g, "").replace(/}/g, "");

            var tp_breakup = JSON.stringify(objRes['Premium_Breakup']['liability'], undefined, 2);
            tp_breakup = tp_breakup.replace(/"/g, "").replace(/{/g, "").replace(/}/g, "");

            var addon_breakup = JSON.stringify(objRes['Premium_Breakup']['addon'], undefined, 2);
            addon_breakup = addon_breakup.replace(/"/g, "").replace(/{/g, "").replace(/}/g, "");


            var jsonDataPrem = {
                "___IDV___": objRes['LM_Custom_Request']['vehicle_expected_idv'],
                "___OD___": Math.round(objRes['Premium_Breakup']['own_damage']['od_final_premium']),
                "___TP___": Math.round(objRes['Premium_Breakup']['liability']['tp_final_premium']),
                "___Addon___": Math.round(objRes['Premium_Breakup']['addon']['addon_final_premium']),
                "___Net___": Math.round(objRes['Premium_Breakup']['net_premium']),
                "___Tax___": Math.round(objRes['Premium_Breakup']['service_tax']),
                "___Final___": Math.round(objRes['Premium_Breakup']['final_premium']),
                "___Time___": Math.round(objRes['Call_Execution_Time'])
            };
        } else {
            var err_breakup = JSON.stringify(objRes['Error'], undefined, 2);
            if (typeof err_breakup == 'String') {
                err_breakup = err_breakup.replace(/"/g, "'");
            }
            var jsonDataPrem = {
                "___IDV___": objRes['LM_Custom_Request']['vehicle_expected_idv'],
                "___OD___": 'NA',
                "___TP___": 'NA',
                "___Addon___": 'NA',
                "___Net___": 'NA',
                "___Tax___": 'NA',
                "___Final___": 'NA',
                "___Time___": Math.round(objRes['Call_Execution_Time'])
            };
        }

//                for (var j  in objRes['Premium_Breakup']['addon']) {
//                    var addon_prem = Math.round(objRes['Premium_Breakup']['addon'][j]);
//                    if (addon_prem > 0) {
//                        jsonData['>___' + j + '___'] = ' class="bg-purple" >'+addon_prem;
//                    } else {
//                        jsonData['>___' + j + '___'] = ' class="bg-orange" >NA';
//                    }
//                }
        //console.log(jsonData);

        for (var j in jsonData) {
            rowHtmlUpdate = rowHtmlUpdate.replaceAll(j, jsonData[j]);
        }
        for (var j in jsonDataPrem) {
            rowHtmlUpdate = rowHtmlUpdate.replaceAll(j, jsonDataPrem[j]);
        }
        var objRow = $(rowHtmlUpdate);
        objRow.show();
        $('#rowTemplate').append(objRow);
        $('#btn_od_' + objRes['Service_Log_Id']).attr('data-content', od_breakup);
        $('#btn_tp_' + objRes['Service_Log_Id']).attr('data-content', tp_breakup);
        $('#btn_addon_' + objRes['Service_Log_Id']).attr('data-content', addon_breakup);
        $('#btn_err_' + objRes['Service_Log_Id']).attr('data-content', err_breakup);
        $(function () {
            //Tooltip
            $('[data-toggle="tooltip"]').tooltip({
                container: 'body'
            });

            //Popover
            $('[data-toggle="popover"]').popover();
        })
    }

    if (cnt_widget_data.request > 0) {
        var avgPrem = 0, avgIdv = 0;
        if (cnt_widget_data.prem.length > 0) {
            var sum = 0, len = 0;
            for (var i = 0; i < cnt_widget_data.prem.length; i++) {
                sum += Math.round(cnt_widget_data.prem[i] - 0);
                //don't forget to add the base
            }
            len = cnt_widget_data.prem.length;
            var avgPrem = Math.round(sum / len);
            $('#avgprem_cnt').attr('data-to', avgPrem);
        }
        if (cnt_widget_data.idv.length > 0) {
            var sum = 0, len = 0;
            for (var i = 0; i < cnt_widget_data.idv.length; i++) {
                sum += Math.round(cnt_widget_data.idv[i] - 0); //don't forget to add the base
            }
            len = cnt_widget_data.idv.length;
            var avgIdv = Math.round(sum / len);

            $('#avgidv_cnt').attr('data-to', avgIdv);
        }
        console.log(avgIdv, avgPrem, cnt_widget_data);

        $('#insurer_cnt').attr('data-to', insurer_cnt);
        $('#request_cnt').attr('data-to', serviceResponse.Summary.Total);
        if (!isNaN(avgIdv)) {

        }
        if (!isNaN(avgPrem)) {

        }
        $('.count-to').countTo();
    }
}
function PopulateMakeModel()
{
    //$('#Col_Make').get(0).options.length = 0;
    // $('#Col_Make').get(0).options[0] = new Option("Loading..", "");

    $.ajax({
        type: 'GET',
        url: HorizonDomain + "/vehicles/make_model_list", // json datasource
        //dataType: 'json',
        //data: {rollNumber: $('#txtSearchRoll').val()},
        //cache: false,
        success: function (aData) {

            $('#vehicle_make_model').get(0).options.length = 0;
            $('#vehicle_make_model').get(0).options[0] = new Option("Select Vehicle", "");

            $.each(aData, function (i, item) {
                console.log(i, item);
                $('#vehicle_make_model').get(0).options[$('#vehicle_make_model').get(0).options.length] = new Option(item['Make_Name'] + ' ' + item['Model_Name'], item['Make_Name'] + '|' + item['Model_Name']);
                // Display      Value
            });
            $('#vehicle_make_model').selectpicker('refresh');
        },
        error: function () {
            alert("Connection Is Not Available");
        }
    });

    return false;
}
var ConstVehicle = [];
function PopulateVehicle()
{
    //$('#Col_Make').get(0).options.length = 0;
    // $('#Col_Make').get(0).options[0] = new Option("Loading..", "");

    $.ajax({
        type: 'GET',
        url: HorizonDomain + "/vehicles/list", // json datasource
        //dataType: 'json',
        //data: {rollNumber: $('#txtSearchRoll').val()},
        //cache: false,
        success: function (aData) {

            //$('#vehicle_id').get(0).options.length = 0;
            //$('#vehicle_id').get(0).options[0] = new Option("Select Vehicle", "");

            $.each(aData, function (i, item) {
                var objtext = '{"Vehicle_ID": ' + item['Vehicle_ID'] + ',"Combine":"' + item['Make_Name'] + ' ' + item['Model_Name'] + ' ' + item['Variant_Name'] + '(Fuel: ' + item['Fuel_Name'] + ', CC:' + item['Cubic_Capacity'] + ', ID:' + item['Vehicle_ID'] + ')"}';
                console.log(objtext);
                var objJson = JSON.parse(objtext);
                ConstVehicle.push(objJson);

                //console.log(i, item);
                //$('#vehicle_id').get(0).options[$('#vehicle_id').get(0).options.length] = new Option( item['Make_Name'] + ' ' + item['Model_Name']+ ' ' + item['Variant_Name'] + '(Fuel: ' + item['Fuel_Name']+', CC:'+item['Cubic_Capacity']+')',item['Vehicle_ID']);
                // Display      Value
            });
            //$('#vehicle_id').selectpicker('refresh');
        },
        error: function () {
            alert("Connection Is Not Available");
        }
    });

    return false;
}
function SearchVehicle() {


    var txt = $('#vehicle_id').text();
    console.log(txt);
    if (txt.length > 3) {
        $('#vehicle_id').get(0).options.length = 0;
        $('#vehicle_id').get(0).options[0] = new Option("Select Vehicle", "");
        $.each(ConstVehicle, function (i, item) {
            var HackStack = Object.values(item).join();
            console.log(i, Object.values(item));
            if (HackStack.indexOf(txt) > -1) {
                $('#vehicle_id').get(0).options[$('#vehicle_id').get(0).options.length] = new Option(item['Make_Name'] + ' ' + item['Model_Name'] + ' ' + item['Variant_Name'] + '(Fuel: ' + item['Fuel_Name'] + ', CC:' + item['Cubic_Capacity'] + ', ID:' + item['Vehicle_ID'] + ')', item['Vehicle_ID']);
            }
        });
        $('#vehicle_id').selectpicker('refresh');
    }
}

$(function () {
//    $(".datepicker").datepicker({ 
//        format: 'yyyy-mm-dd'
//    });
    $('#vehicle_manf_date, #vehicle_registration_date , #vehicle_expiry_date').bootstrapMaterialDatePicker
            ({
                time: false,
                clearButton: true
            });


    $('#btnServiceCall').click(function () {
        ServiceCall();

    });
    $('#btnFormToJson').click(function () {
        FormToJson();

    });
    $('#btnCancelTO').click(function () {
        cancelRetriveTimeout();

    });
    $('#btnDB').click(function () {
        var srn = $('#search_reference_number').val();
        ResetSearch();
        retriveQuote(srn);
    });

    $('#claim_ncb').change(function () {
        console.log('claim_ncb', $(this).val());
        if ($(this).val() == 'yes') {
            $('#is_claim_exists').val('yes');
            $('#vehicle_ncb_current').val('0');
        } else {
            $('#is_claim_exists').val('no');
            $('#vehicle_ncb_current').val($(this).val());
        }

    });
    $('#switch_vehicle_insurance_type').change(function () {

        if ($(this).checked()) {
            $('#vehicle_insurance_type').val('new');

        } else {
            $('#vehicle_insurance_type').val('renew');
        }

    });
//    $('#vehicle_id').bootcomplete({
//        url: HorizonDomain+':3000/vehicles/list',
//        dataParams: {
//            'Product_ID': product_id
//        }
//    });

    var options = {
        ajax: {
            url: HorizonDomain + '/vehicles/list',
            data: function () {
                var params = {
                    q: '{{{q}}}',
                    'product_id': $('#product_id').val()
                };
                return params;
            }
        },
        locale: {
            emptyTitle: 'Search for contact...'
        },
        preprocessData: function (data) {
            var vehicles = [];
            for (var k in data) {
                vehicles.push({'disabled': false, 'value': data[k]['Vehicle_ID'], 'text': data[k]['Make_Name'] + ' ' + data[k]['Model_Name'] + ' ' + data[k]['Variant_Name'] + '( Fuel: ' + data[k]['Fuel_Name'] + ', CC:' + data[k]['Cubic_Capacity'] + ',ID:' + data[k]['Vehicle_ID'] + ')'})
            }

            return vehicles;

        },
        preserveSelected: false
    };
    $('#vehicle_id').selectpicker().filter('.with-ajax').ajaxSelectPicker(options);

    var optionsRto = {
        ajax: {
            url: HorizonDomain + '/rtos/list',
            data: function () {
                var params = {
                    q: '{{{q}}}'
                };
                return params;
            }
        },
        locale: {
            emptyTitle: 'Search for RTO...'
        },
        preprocessData: function (data) {
            var vehicles = [];
            for (var k in data) {
                vehicles.push({'disabled': false, 'value': data[k]['VehicleCity_Id'], 'text': data[k]['VehicleCity_RTOCode'] + ' :: ' + data[k]['RTO_City']})
            }

            return vehicles;

        },
        preserveSelected: false
    };
    $('#rto_id').selectpicker().filter('.with-ajax').ajaxSelectPicker(optionsRto);
    $('select').trigger('change');

    var addonList = {
        "addon_zero_dep_cover": 0,
        "addon_road_assist_cover": 0,
        "addon_ncb_protection_cover": 0,
        "addon_engine_protector_cover": 0,
        "addon_invoice_price_cover": 0,
        "addon_key_lock_cover": 0,
        "addon_consumable_cover": 0,
        "addon_daily_allowance_cover": 0,
        "addon_windshield_cover": 0,
        "addon_passenger_assistance_cover": 0,
        "addon_tyre_coverage_cover": 0,
        "addon_personal_belonging_loss_cover": 0,
        "addon_inconvenience_allowance_cover": 0,
        "addon_medical_expense_cover": 0,
        "addon_hospital_cash_cover": 0,
        "addon_ambulance_charge_cover": 0,
        "addon_rodent_bite_cover": 0,
        "addon_losstime_protection_cover": 0,
        "addon_hydrostatic_lock_cover": 0
    };
//    for (var k in addonList) {
//        var addonShort = k.split('_');
//        var addShortName = addonShort[1][0] + addonShort[2][0];
//        addShortName = addShortName.toString().toUpperCase();
//        $('#quotelistheader').append('<th title="' + k + '">' + addShortName + '</th>');
//    }
//
//    for (var k in addonList) {
//        $('#rowTemplate tr').append('<td>___' + k + '___</td>');
//    }
    rowHtmlCore = $('#rowTemplate').html();


});
$(function () {
    jQuery.each(insurer_logo, function (i, val) {
        var insurer_id = i.split('_')[1];
        $(".calling").append('<img class="js-animating-object img-responsive" id="calling_' + insurer_id + '" src="http://d31mtwejsmvzyu.cloudfront.net/Images/insurer_logo/' + val + '">');
        $(".0_to_5").append('<img class="js-animating-object img-responsive" id="0_to_5_' + insurer_id + '" src="http://d31mtwejsmvzyu.cloudfront.net/Images/insurer_logo/' + val + '">');
        $(".5_to_10").append('<img class="js-animating-object img-responsive" id="5_to_10_' + insurer_id + '" src="http://d31mtwejsmvzyu.cloudfront.net/Images/insurer_logo/' + val + '">');
        $(".10_to_15").append('<img class="js-animating-object img-responsive" id="10_to_15_' + insurer_id + '" src="http://d31mtwejsmvzyu.cloudfront.net/Images/insurer_logo/' + val + '">');
        $(".15_to_200").append('<img class="js-animating-object img-responsive" id="15_to_200_' + insurer_id + '" src="http://d31mtwejsmvzyu.cloudfront.net/Images/insurer_logo/' + val + '">');
        $(".quote_na").append('<img class="js-animating-object img-responsive" id="quote_na_' + insurer_id + '" src="http://d31mtwejsmvzyu.cloudfront.net/Images/insurer_logo/' + val + '">');
    });
    $('.calling img,.0_to_5 img,.5_to_10 img,.10_to_15 img,.15_to_200 img,.quote_na img').hide();
//Copied from https://github.com/daneden/animate.css
    $.fn.extend({
        animateCss: function (animationName) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            $(this).addClass('animated ' + animationName).one(animationEnd, function () {
                $(this).removeClass('animated ' + animationName);
            });
        }
    });
    //Widgets count
    //$('.count-to').countTo();

//    //Sales count to
//    $('.sales-count-to').countTo({
//        formatter: function (value, options) {
//            return '$' + value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, ' ').replace('.', ',');
//        }
//    });
//
//    initRealTimeChart();
//    initDonutChart();
//    initSparkline();
});
