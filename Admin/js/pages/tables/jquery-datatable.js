var user_data_grid;
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
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
var ArrPostProposal = [
    'PROPOSAL_SUBMIT',
    'PROPOSAL_EXCEPTION',
    'VERIFICATION_EXCEPTION',
    'TRANS_FAIL',
    'TRANS_SUCCESS_WO_POLICY'
];
var ObjStatus = {
    'SEARCH': 'SEARCH',
    'RECALC': 'RECALCULATE',
    'ADDON': 'ADDON_APPLY',
    'BUY_AGENT': 'BUY_NOW_AGENT',
    'BUY_CUST': 'BUY_NOW_CUSTOMER',
    'SAVE_AGENT': 'PROPOSAL_SAVE_AGENT',
    'SAVE_CUST': 'PROPOSAL_SAVE_CUSTOMER',
    'LINK_SENT': 'PROPOSAL_LINK_SENT',
    'PROPOSAL_SUB': 'PROPOSAL_SUBMIT',
    'PROPOSAL_ERR': 'PROPOSAL_EXCEPTION',
    'VERIFY_ERR': 'VERIFICATION_EXCEPTION',
    'TRANS_FAIL': 'TRANS_FAIL',
    'TRANS_WO_POLICY': 'TRANS_SUCCESS_WO_POLICY',
    'TRANS_WITH_POLICY': 'TRANS_SUCCESS_WITH_POLICY',
    'TRANS_PAYPASS': 'TRANS_PAYPASS'
};
function PopulateStatus() {
    $('#Col_Transaction_Status').get(0).options.length = 0;
    $('#Col_Transaction_Status').get(0).options[0] = new Option("Select Status", "");
    for (var k in  ObjStatus) {
        $('#Col_Transaction_Status').get(0).options[$('#Col_Transaction_Status').get(0).options.length] = new Option(ObjStatus[k], ObjStatus[k]);
    }
    $('#Col_Transaction_Status').selectpicker('refresh');
}

function sel_status_change() {
    $('#dropoff_section').hide();
    $('#policy_section').hide();
    $('#btnLastStatus').hide();
    if ($('#Last_Status').val() == 'TRANS_SUCCESS_WO_POLICY' || $('#Last_Status').val() == 'TRANS_SUCCESS_WITH_POLICY') {
        $('#policy_section').show();
        $('#dropoff_section').hide();
        $('#transaction_status').val('SUCCESS');
        $('#pg_status').val('SUCCESS');
        $('#btnLastStatus').show();
    } else if ($('#Last_Status').val() == 'TRANS_PAYPASS') {
        $('#policy_section').show();
        $('#dropoff_section').hide();
        $('#transaction_status').val('FAIL');
        $('#pg_status').val('SUCCESS');
    } else if ($('#Last_Status').val() == 'DROPOFF' || $('#Last_Status').val() == 'TRANS_FAIL') {
        $('#dropoff_section').show();
        $('#policy_section').hide();
        $('#btnLastStatus').show();
        $('#transaction_status').val('FAIL');
        $('#pg_status').val('FAIL');
    }
}
function view_status_history(data_index) {
    console.log('view_status', data_index);
    $('#uploadForm input').val('');
    $('#btnLastStatus').hide();
    user_data_grid.rows().every(function (rowIdx, tableLoop, rowLoop) {
        if (data_index == rowIdx) {
            var d = this.data();
            $('#tbody_status_log').html('');
            console.log('select', d);
            var is_proposal_submit = false;
            $('#User_Data_Id').val(d.User_Data_Id);
            if (d.hasOwnProperty('Insurer_Id')) {
                $('#insurer_id').val(d.Insurer_Id);
            } else {
                $('#insurer_id').val(0);
            }
            for (var k in d.Status_History) {
                var rhtml = '<tr><td>' + d.Status_History[k].Status + '</td><td>' + (new Date(d.Status_History[k].StatusOn)).toLocaleString() + '</td></tr>'
                $('#tbody_status_log').append(rhtml);
                if (ArrPostProposal.indexOf(d.Status_History[k].Status) > -1) {
                    is_proposal_submit = true;
                }
            }
            if (is_proposal_submit) {
                $('#divTransaction').show();
            } else {
                $('#divTransaction').hide();
            }
            if (['TRANS_FAIL',
                'TRANS_SUCCESS_WO_POLICY',
                'TRANS_SUCCESS_WITH_POLICY',
                'TRANS_PAYPASS'].indexOf(d.Last_Status) > -1 && d.hasOwnProperty('Transaction_Data')) {
                for (var k in d.Transaction_Data) {
                    if (d.Transaction_Data[k]) {
                        $('#' + k).val(d.Transaction_Data[k]);
                    }
                }
                $('#btnLastStatus').html('UPDATE');
                if (['PROPOSAL_SUBMIT', 'TRANS_PAYPASS', 'TRANS_SUCCESS_WITH_POLICY'].indexOf(d.Last_Status) > -1) {
                    $('#btnLastStatus').hide();
                    $('#policy_section').show();
                }
            } else {
                $('#btnLastStatus').html('ADD');
            }

            $('#Last_Status').val(d.Last_Status);
            $('#Last_Status').selectpicker('refresh');
            //sel_status_change();
            $('#mdStatus .modal-content').removeAttr('class').addClass('modal-content');
            $('#mdStatus').modal('show');
        }

    });
}
/*
 * 
 * {
 "policy_url": null,
 "policy_number": null,
 "policy_id": null,
 "transaction_status": null,
 "pg_status": null,
 "transaction_id": null,
 "transaction_amount": null,
 "pg_reference_number_1": null,
 "pg_reference_number_2": null,
 "pg_reference_number_3": null
 }
 */
function validate_transaction_data() {
    var arr_invalid = [];
    var arr_mandate_field = [];
    if ($('#Last_Status').val() === 'TRANS_SUCCESS_WO_POLICY') {
        arr_mandate_field = ['transaction_id', 'policy_number', 'transaction_status', 'pg_status', 'transaction_amount'];
    } else if ($('#Last_Status').val() === 'TRANS_SUCCESS_WITH_POLICY') {
        arr_mandate_field = ['transaction_id', 'policy_number', 'transaction_status', 'pg_status', 'transaction_amount', 'policy_file'];
    } else if ($('#Last_Status').val() === 'TRANS_PAYPASS') {
        arr_mandate_field = ['transaction_id', 'transaction_status', 'pg_status', 'transaction_amount'];
    } else if ($('#Last_Status').val() === 'DROPOFF') {

    }
    for (var k in arr_mandate_field) {
        if ($('#' + arr_mandate_field[k]).val() == "") {
            arr_invalid.push(arr_mandate_field[k]);
        }
    }
    return arr_invalid;
}
function add_transaction_status() {
    var arr_invalid = validate_transaction_data();
    if (arr_invalid.length < 1) {
        $('#err_validate').html('');
        $("#status").empty().text('Please wait..');
        if (confirm('Sure to Change Transaction Data?')) {
            $('#uploadForm').ajaxSubmit({
                error: function (xhr) {
                    status('Error: ' + xhr.status);
                },
                success: function (response) {
                    $("#status").empty().text('');
                    console.log(response);
                }
            });
        }
    } else {
        $('#err_validate').html(arr_invalid.join(' , ') + ' are mandatory.');
    }
//Very important line, it disable the page refresh.
    return false;
}
var coreLogModelHtml = $('#mdLog').html();
function ServiceLogView(Service_Log_Id) {
    var logHtml = coreLogModelHtml;
    logHtml = logHtml.replaceAll('___Service_Log_Id___', Service_Log_Id);
    logHtml = logHtml.replaceAll('___HorizonDomain___', '');
    $('#mdLog').html(logHtml);
//    $('#ifr_request').attr('src', HorizonDomain+':3000/service_logs/' + Service_Log_Id + '/Insurer_Request');
//    $('#ifr_response').attr('src', HorizonDomain+':3000/service_logs/' + Service_Log_Id + '/Insurer_Response_Core');
    $('#mdLog .modal-content').removeAttr('class').addClass('modal-content modal-col-light-green');
    $('#mdLog').modal('show');
}

function view_service_log(data_index) {
    console.log('view_status', data_index);
    user_data_grid.rows().every(function (rowIdx, tableLoop, rowLoop) {
        if (data_index == rowIdx) {
            var d = this.data();
            $('#tbody_status_log').html('');
            console.log('select', d);
            var srn = d.Request_Unique_Id;
            var secret_key = d.Premium_Request.secret_key;
            var client_key = d.Premium_Request.client_key;
            retriveApiLog(srn, secret_key, client_key);
            //$('#mdServiceLog .modal-content').removeAttr('class').addClass('modal-content');
            $('#mdServiceLog').modal('show');
        }
    });
}
function retriveApiLog(srn, secret_key, client_key) {
    var jsonRequest = {
        "search_reference_number": srn,
        "secret_key": secret_key,
        "client_key": client_key
    };
    $.ajax({
        type: 'POST',
        url: "/quote/premium_list_db", // json datasource
        dataType: 'json',
        data: jsonRequest,
        //cache: false,
        success: function (serviceResponse) {
            loadApiLog(serviceResponse);
        },
        error: function () {
            $('.preloader').hide();
            alert("Connection Is Not Available");
        }
    });
}
function view_email_log(data_index) {
    console.log('view_email_log', data_index);
    user_data_grid.rows().every(function (rowIdx, tableLoop, rowLoop) {
        if (data_index == rowIdx) {
            var d = this.data();
            $('#tbody_status_log').html('');
            console.log('select', d);
            var crn = d.PB_CRN;
            retrive_email_log(crn);
            //$('#mdServiceLog .modal-content').removeAttr('class').addClass('modal-content');
            $('#mdEmail').modal('show');
        }
    });
}

var Const_Email_Data = null;
function retrive_email_log(crn) {
    var jsonRequest = {
        "PB_CRN": crn
    };
    $.ajax({
        type: 'POST',
        url: "/emails/search", // json datasource
        dataType: 'json',
        data: jsonRequest,
        //cache: false,
        success: function (emailResponse) {
            Const_Email_Data = emailResponse;
            loadEmailLog(emailResponse);
        },
        error: function () {
            $('.preloader').hide();
            alert("Connection Is Not Available");
        }
    });
}
var tbody_email_list = $('#tbody_email_list').html();
function loadEmailLog(emailResponse) {
    console.log('loadEmailLog', emailResponse);
    $('#tbody_email_list').html('');
    var insurer_cnt = 0;
    for (var k in emailResponse) {
        var ind = emailResponse[k];
        var trow_email_single = tbody_email_list;
        ind['Last_Event_Status'] = (ind.hasOwnProperty('Last_Event_Status')) ? ind['Last_Event_Status'] : 'pending';
        ind['Created_On'] = (new Date(ind.Created_On)).toLocaleString();
        ind['Modified_On'] = (new Date(ind.Modified_On)).toLocaleString();
        if (ind.Sub.indexOf('Successful online payment transaction') > -1) {
            ind['Type'] = 'Success';
        }
        if (ind.Sub.indexOf('Payment Request For Customer Reference Number') > -1) {
            ind['Type'] = 'PaymentLink';
        }
        if (ind.Sub.indexOf('Policyboss Online Payment Transaction Success but Policy Authorization fail') > -1) {
            ind['Type'] = 'Paypass';
        }
        for (var k1 in ind) {
            var rep_key = '___' + k1 + '___';
            console.log('loadEmailLog', k1, rep_key, ind[k1]);
            trow_email_single = trow_email_single.replaceAll(rep_key, ind[k1]);
            if (trow_email_single.toString().indexOf(rep_key) > -1) {

            }
        }
        console.log('loadEmailLog', trow_email_single);
        $('#tbody_email_list').append(trow_email_single);
    }
}
function email_preview(Msg_Id, PB_CRN) {
    console.log('email_preview', Msg_Id, PB_CRN);
    retrive_email_event_log(Msg_Id, PB_CRN);
    //$('#tbody_email_preview').html('');
    //$('#mdServiceLog .modal-content').removeAttr('class').addClass('modal-content');
    $('#mdEmailEvent').modal('show');
}


function retrive_email_event_log(Msg_Id, PB_CRN) {
    var jsonRequest = {
        "Msg_Id": Msg_Id
    };
    $.ajax({
        type: 'POST',
        url: "/email_events/search", // json datasource
        dataType: 'json',
        data: jsonRequest,
        //cache: false,
        success: function (emaileventResponse) {
            loadEmailEventLog(emaileventResponse, Msg_Id);
        },
        error: function () {
            $('.preloader').hide();
            alert("Connection Is Not Available");
        }
    });
}
function loadEmailEventLog(emaileventResponse, Msg_Id) {
    console.log('loadEmailEventLog', emaileventResponse);
    $('#tbody_email_event_log').html('');
    var insurer_cnt = 0;
    var arrEvent = [];
    for (var k in emaileventResponse) {
        var ind = emaileventResponse[k];
        var ts = ind.Created_On.toString().split('.');
        delete ts[ts.length - 1];
        ts = ts.join('.');
        console.log('event', ind.Event.toString(), ts, ind.Created_On.toString());
        if (arrEvent.indexOf(ind.Event.toString() + ts) < 0) {
            var singleEventLog = "<tr><td>" + ind.Event + "</td><td>" + (new Date(ind.Created_On)).toLocaleString() + '</td><td><button  id="btn_email_' + k + '" type="button" class="btn btn-primary btn-block waves-effect" data-trigger="focus" \
                                            data-container="body" data-toggle="popover" data-placement="bottom" title="Email Event Full" data-content="">Full</button></td></tr>';
            $('#tbody_email_event_log').append(singleEventLog);
            $('#btn_email_' + k).attr('data-content', JSON.stringify(ind.Full, undefined, 2));
            arrEvent.push(ind.Event.toString() + ts);
            console.log('loadEmailLog', singleEventLog, arrEvent);
        }
    }
    for (var k in Const_Email_Data) {
        if (Const_Email_Data[k]['Msg_Id'] == Msg_Id) {
            $('#Sub').html(Const_Email_Data[k]['Sub']);
            $('#Content').html(Const_Email_Data[k]['Content']);
        }
    }
    $(function () {
//Tooltip
        $('[data-toggle="tooltip"]').tooltip({
            container: 'body'
        });
        //Popover
        $('[data-toggle="popover"]').popover();
    })

}
var rowHtmlCore = $('#rowTemplate').html();
function loadApiLog(serviceResponse) {
    $('#rowTemplate').html('');
    var insurer_cnt = 0;
    for (var k in serviceResponse.Response) {

        var objRes = serviceResponse.Response[k];
        console.log('loadApiLog', objRes['Service_Log_Id']);
        var rowHtmlUpdate = rowHtmlCore;
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

}
function erp_cs_doc_process(data_index) {
    console.log('view_status', data_index);
    user_data_grid.rows().every(function (rowIdx, tableLoop, rowLoop) {
        if (data_index == rowIdx) {
            var d = this.data();
            $('#tbody_status_log').html('');
            console.log('select', d.Request_Unique_Id);
            if (d.hasOwnProperty('Erp_Qt_Request_Core')) {
                $.ajax({
                    method: "POST",
                    url: "/quote/erp_pdf",
                    data: {
                        "search_reference_number": d.Request_Unique_Id
                    }
                }).done(function (msg) {
                    alert("ERP CS DOC  : " + msg.Msg);
                });
            }
        }

    });
}
coreErpProcessHtml = $('#erp_model_body').html();
function erp_cs_popup(srn) {
    $('#cs_xml').html('');
    $('#hdnsrn').val(srn);
    console.log('erp_cs_popup', srn);
    $.ajax({
        method: "POST",
        url: "/quote/erp_cs",
        data: {
            "op": 'preview',
            "search_reference_number": srn
        }
    }).done(function (msg) {
        msg = msg.replace(/</g, '<span style="color:red;">&lt;');
        msg = msg.replace(/>/g, '&gt;</span>');
        msg = '<span style="color:green;">' + msg + '</span>';
        $('#cs_xml').html(msg);
        // $('#ifr_cs_xml').attr('src', 'view-source:/tmp/log/cs_request_' + srn + '.xml');
        //alert("ERP Doc Push: " + msg.Msg);
    });
    $('#mdErpProcess .modal-content').removeAttr('class').addClass('modal-content modal-col-orange');
    $('#mdErpProcess').modal('show');
}
function erp_cs_execute(srn) {
    if (confirm('Sure to create ERP CS?')) {
        console.log('erp_cs_execute', srn);
        $.ajax({
            method: "POST",
            url: "/quote/erp_cs",
            data: {
                "op": 'execute',
                "search_reference_number": srn
            }
        }).done(function (msg) {
            alert('ERP CS Pushed. Please check Email Log');
            //alert("ERP Doc Push: " + msg.Msg);
        });
    }
}

/*function view_user_data(User_Data_Id) {
 console.log('view_user_data', User_Data_Id);
 $.ajax({
 method: "GET",
 url: "/user_datas/view/" + User_Data_Id
 }).done(function (dbUserData) {
 console.log('user_data', dbUserData);
 
 });
 $('#mdErpProcess .modal-content').removeAttr('class').addClass('modal-content modal-col-orange');
 $('#mdErpProcess').modal('show');
 }
 */
function save_user_data(User_Data_Id, field_db_key) {
    console.log('save_user_data', User_Data_Id, field_db_key);
    if (confirm('Sure to update?')) {
        if ($('#txtarea-' + field_db_key).length > 0) {
            var objData = {
                "User_Data_Id": User_Data_Id
            };
            objData[field_db_key] = $('#txtarea-' + field_db_key).val();
            console.log('save_user_data', objData);
            $.ajax({
                method: "POST",
                url: "/user_datas/save",
                data: objData
            }).done(function (msg) {
                alert("Data Saved : " + msg.Msg);
                console.log('save_user_data', msg);
            });
        }
    }
}
var objColor = ["red",
    "pink",
    "purple",
    "deep-purple",
    "indigo",
    "blue",
    "light-blue",
    "cyan",
    "teal",
    "green",
    "light-green",
    "lime",
    "yellow",
    "amber",
    "orange",
    "deep-orange",
    "brown",
    "grey",
    "blue-grey",
    "black"];
var coreUserDataModelHtml = '';
var coreUserDataActionModelHtml = '';
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}
function view_user_data(data_index, data_key, arr_data_key) {
    console.log('view_user_data', data_index);
    if (coreUserDataModelHtml === '') {
        coreUserDataModelHtml = $('#divUserData').html();
    }
    user_data_grid.rows().every(function (rowIdx, tableLoop, rowLoop) {
        if (data_index == rowIdx) {
            var d = this.data();
            console.log('view_user_data', d, coreUserDataModelHtml);
            $('#divUserData').html('');
            $('#largeModalLabel').html('User Data :: ' + data_key);
            for (var k in arr_data_key) {
                if (d.hasOwnProperty(arr_data_key[k])) {
                    var tmpHtml = coreUserDataModelHtml;
                    tmpHtml = tmpHtml.replace(/___user_data_key___/g, arr_data_key[k]);
                    tmpHtml = tmpHtml.replace(/___data_index___/g, data_index);
                    tmpHtml = tmpHtml.replace(/___User_Data_Id___/g, d['User_Data_Id']);
                    tmpHtml = tmpHtml.replace(/___srn___/g, d['Request_Unique_Id']);
                    $('#divUserData').append(tmpHtml);
                    $('#txtarea-' + arr_data_key[k]).val(JSON.stringify(d[arr_data_key[k]], undefined, 2));
                }
            }
            var col = objColor[getRandomIntInclusive(0, 19)];
            $('#mdUserData .modal-content').removeAttr('class').addClass('modal-content modal-col-' + col);
            $('#mdUserData').modal('show');
        }

    });
}
function swap(json) {
    var ret = {};
    for (var key in json) {
        ret[json[key]] = key;
    }
    return ret;
}
$(function () {
    $('.js-basic-example').DataTable({
//responsive: true,
        "bProcessing": true,
        "serverSide": true,
        "ajax": {
            url: "/clients", // json datasource
            type: "post", // type of method  , by default would be get
            error: function (e, settings, techNote, message) {  // error handling code
                //$(".js-basic-example").css("display", "none");
                //$(".employee-grid-error").html("");
                console.log(e, settings, techNote, message);
                $(".js-basic-example").append('<tbody class="employee-grid-error"><tr><th colspan="3">No data found in the server</th></tr></tbody>');
                //$("#employee_grid_processing").css("display","none");
            }
        },
        "columns": [
            {"data": "Client_Id"},
            {"data": "Client_Name"},
            {"data": "Client_Unique_Id"},
            {"data": "Platform"},
            {"data": "Role"},
            {"data": "Integration_Type"},
            {"data": "Premium_Source"},
            {"data": "Is_Active"},
            {"data": "Modified_On"}
        ]
    });
    var vehicle_grid = $('.vehicle_grid').DataTable({
        responsive: true,
        "bProcessing": true,
        "serverSide": true,
        "ajax": {
            url: "/vehicles", // json datasource
            type: "post", // type of method  , by default would be get    
            dataFilter: function (data) {
                var json = jQuery.parseJSON(data);
                json.recordsTotal = json.total;
                json.recordsFiltered = json.total;
                json.data = json.docs;
                return JSON.stringify(json); // return JSON string
            }
        },
        "columns": [
            {"data": "Vehicle_ID"},
            {"data": "Make_Name"},
            {"data": "Model_Name"},
            {"data": "Variant_Name"},
            {"data": "Cubic_Capacity"},
            {"data": "Seating_Capacity"},
            {"data": "ExShoroomPrice"},
            {"data": "Fuel_Name"}
        ]
    });
    user_data_grid = $('.user_data_grid').DataTable({
        responsive: true,
        "bProcessing": true,
        "serverSide": true,
        "ajax": {
            url: "/user_datas", // json datasource
            type: "post", // type of method  , by default would be get    
            dataFilter: function (data) {
                var objProduct = {
                    '1': 'CAR',
                    '2': 'HEALTH',
                    '10': 'TW'
                };
                var objClient = {
                    "SelfAdmin": "BV2LWSDVWIDD",
                    "PB": "J0RWP3DYRACW",
                    "FINMART": "PE7XIQ8DV4GY",
                    "PB_App": "DNRTXRWMRTAL"
                };
                var json = jQuery.parseJSON(data);
                json.recordsTotal = json.total;
                json.recordsFiltered = json.total;
                if (coreUserDataActionModelHtml === '') {
                    coreUserDataActionModelHtml = $('#user_data_action').html();
                }
                var objStatusSwap = swap(ObjStatus);
                for (var k = 0; k < json.docs.length; k++) {
                    if (json.docs[k].hasOwnProperty('Last_Status') === false) {
                        json.docs[k]['Last_Status'] = 'SEARCH';
                    }

                    json.docs[k]['Last_Status'] = objStatusSwap[json.docs[k]['Last_Status']];
                    if (json.docs[k].hasOwnProperty('ERP_CS') && json.docs[k]['ERP_CS_DOC'] != '') {
                        if (json.docs[k].hasOwnProperty('ERP_CS_DOC') && json.docs[k]['ERP_CS_DOC'] === 'Success') {
                            json.docs[k]['ERP_CS'] = '<span style="color:green;font-weight:bold;">' + json.docs[k]['ERP_CS'] + '</span>';
                        } else {
                            json.docs[k]['ERP_CS'] = '<span style="color:red;font-weight:bold;">' + json.docs[k]['ERP_CS'] + '</span>';
                        }
                    } else {
                        json.docs[k]['ERP_CS'] = '';
                    }


                    //json.docs[k]['Request_Unique_Id'] = '****' + json.docs[k]['Request_Unique_Id'].toString().substr(35);
                    json.docs[k]['SRN'] = '**' + json.docs[k]['Request_Unique_Id'].toString().substr(36);
                    //for date
                    var strDate = json.docs[k]['Modified_On'];
                    var ltzDate = (new Date(strDate)).toLocaleString();
                    json.docs[k]['Modified_On'] = ltzDate;
                    json.docs[k]['Product_Name'] = objProduct[json.docs[k]['Product_Id']];
                    var tmpActionHtml = coreUserDataActionModelHtml;
                    tmpActionHtml = tmpActionHtml.replace(/___index___/g, k);
                    tmpActionHtml = tmpActionHtml.replace(/___User_Data_Id___/g, k);
                    tmpActionHtml = tmpActionHtml.replace(/___srn___/g, json.docs[k]['Request_Unique_Id']);
                    json.docs[k]['Action'] = tmpActionHtml;
                    for (var k1 in objClient) {
                        if (json.docs[k]['Premium_Request']['secret_key'].indexOf(objClient[k1]) > -1) {
                            json.docs[k]['Client'] = k1;
                            break;
                        }
                    }
                    json.docs[k]['Agent'] = 'NA';
                    if (json.docs[k]['Client'] === 'PB') {
                        if ((json.docs[k]['Premium_Request']['ss_id'] - 0) > 0) {
                            /*
                             * 5: 'Posp-I',
                             2: 'Camp-SM',
                             3: 'Camp-Nochiket',
                             6: 'MISP-Dealership',
                             4: 'Camp-Sagar'
                             * 
                             */
                            if ((json.docs[k]['Premium_Request']['agent_source'] - 0) == 2) {
                                json.docs[k]['Client'] = 'PB_Camp-SM';
                            } else if ((json.docs[k]['Premium_Request']['agent_source'] - 0) == 3) {
                                json.docs[k]['Client'] = 'PB_Camp-Nochiket';
                            } else if ((json.docs[k]['Premium_Request']['agent_source'] - 0) == 3) {
                                json.docs[k]['Client'] = 'PB_Posp-I';
                            } else {
                                json.docs[k]['Client'] = 'PB_ASSIST';
                            }

                        } else {
                            json.docs[k]['Client'] = 'PB_DIRECT';
                        }
                    }

                    if (json.docs[k]['Client'] !== 'PB_DIRECT' && isNaN(json.docs[k]['Premium_Request']['posp_first_name'])) {
                        json.docs[k]['Agent'] = capitalize(json.docs[k]['Premium_Request']['posp_first_name'] + ' ' + json.docs[k]['Premium_Request']['posp_last_name']);
                    }
                    json.docs[k]['Premium'] = '';
                    json.docs[k]['Idv'] = '';
                    if (json.docs[k].hasOwnProperty('Erp_Qt_Request_Core')) {
                        json.docs[k]['Premium'] = json.docs[k]['Erp_Qt_Request_Core']['___final_premium___'];
                        json.docs[k]['Idv'] = json.docs[k]['Erp_Qt_Request_Core']['___vehicle_expected_idv___'];
                    }
                }
                json.data = json.docs;
                return JSON.stringify(json); // return JSON string
            }
        },
        "columns": [
            {"data": "User_Data_Id"},
            {"data": "Action"},
            {"data": "Client"},
            {"data": "Product_Name"},
            {"data": "Agent"},
            {"data": "PB_CRN"},
            {"data": "SRN"},
            {"data": "ERP_CS"},
            {"data": "Last_Status"},
            {"data": "Premium"},
            {"data": "Modified_On"}
        ]
    });
//    $('.vehicle_grid_search tbody td').each(function () {
//        var title = $(this).text();
//        var classname = $(this).attr('class');
//        console.log(title, classname);
//        if (classname === 'text') {
//            $(this).html('<input name="Col_' + title + '"  id="Col_' + title + '" class="form-control input-sm" type="text" placeholder="Select ' + title + '" />');
//        } else {
//            //var select = $('<select><option value=""></option></select>');
//            $(this).html('<select name="Col_' + title + '" id="Col_' + title + '"  class="form-control input-sm"><option value="">Select ' + title + '</option></select>');
//        }
//    });
//$('.Col_Product').html('<select id="Col_Product" name="Col_Product" class="form-control input-sm" ><option value="1">Car</option><option value="10">Two Wheeler</option></select>');
//$('.Col_Make').html('<select id="Col_Make" name="Col_Make" class="form-control show-tick" ><option value="">Select Make</option></select>');
//$('.Col_Model').html('<select id="Col_Model" name="Col_Model" class="form-control show-tick"><option value="">Select Model</option></select>');
//$('.Col_Variant').html('<select id="Col_Variant" name="Col_Variant"  class="form-control show-tick"><option value="">Select Variant</option></select>');
//$('.Col_Insurer').html('<select id="Col_Insurer" name="Col_Insurer" class="form-control show-tick"><option value="">Select Insurer</option></select>');
//$('.Col_Status').html('<select id="Col_Status" name="Col_Status" class="form-control show-tick"><option>Select Status</option></select>');
    // $('#Col_Product').attr('onchange', 'PopulateMake()');
    //$('#Col_Make').attr('onchange', 'PopulateModel()');
    //$('#Col_Model').attr('onchange', 'PopulateVariant()');



//    // Apply the search
//    vehicle_grid.columns().every(function () {
//        var that = this;
//        $('input', this.footer()).on('keyup change', function () {
//            if (that.search() !== this.value) {
//                that.search(this.value).draw();
//            }
//        });
//    });
    /*
     * {
     "_id" : ObjectId("591c42ec1cc1042aec9ee6c8"),
     "Client_Id" : 1,
     "Client_Name" : "SelfAdmin",
     "Secret_Key" : "SECRET-YK369FTE-AO4J-DHW1-U2VS-BV2LWSDVWIDD",
     "Client_Unique_Id" : "CLIENT-KNEWWLUO-E4TQ-HJGT-VDCL-UEYLOIIYYUZS",
     "Platform" : "Website",
     "Role" : "Admin",
     "Integration_Type" : "NonPOSP",
     "Premium_Source" : "Real",
     "Is_Active" : true,
     "Created_On" : ISODate("2017-05-17T12:32:44.039Z"),
     "Modified_On" : ISODate("2017-05-17T12:32:44.039Z"),
     "__v" : 0
     }
     * 
     */
    //Exportable table
    $('.js-exportable').DataTable({
        dom: 'Bfrtip',
        responsive: true,
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    });
});
var capitalize = function (str) {
    var strArr = str.split(' ');
    var newArr = [];
    for (var i = 0; i < strArr.length; i++) {
        newArr.push(strArr[i].charAt(0).toUpperCase() + strArr[i].slice(1).toLowerCase())
    }
    ;
    return newArr.join(' ');
}
