/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
function PopulateMotorInsurer()
{
    for (var k in arr_insurer) {
        var Insurer_Id = k.replace('Ins_', '');
        $('#Col_Insurer').get(0).options[$('#Col_Insurer').get(0).options.length] = new Option(arr_insurer[k], Insurer_Id);
    }
    $('#Col_Insurer').selectpicker('refresh');
    return false;
}
function Mapping_Proceed(Status_Id) {
    if ((Status_Id == 2 || Status_Id == 4) && !selected) {
        alert('Please select Insurer Vehicle');
        return false;
    }
    var obj_status = {
        '1': 'to remove Mapping',
        '2': 'to map exactly',
        '3': 'to mark as UnSupported',
        '4': 'to map closely'
    };
    if (Status_Id == 2 || Status_Id == 4) {
        var msg = 'Confirm ' + obj_status[Status_Id] + ' for\n"' + $('#defaultModalLabel').html() + '"\n with \n"' + $('#Insurer_Vehicle_' + selected).attr('Insurer_Vehicle_Make_Name') + ' :: ' + $('#Insurer_Vehicle_' + selected).attr('Insurer_Vehicle_Model_Name') + ' :: ' + $('#Insurer_Vehicle_' + selected).attr('Insurer_Vehicle_Variant_Name') + '" ?';
    } else {
        var msg = 'Confirm ' + obj_status[Status_Id] + ' for\n"' + $('#defaultModalLabel').html() + '" ?';
    }

    if (confirm(msg)) {
        $.ajax({
            type: 'POST',
            url: "/vehicles_insurers_mappings/mapping", // json datasource
            dataType: 'json',
            data: {
                "Insurer_ID": $('#Insurer_ID').val(),
                "Insurer_Vehicle_ID": $('#Insurer_Vehicle_ID').val(),
                "Vehicle_ID": $('#Vehicle_ID').val(),
                "Status_Id": Status_Id
            },
            cache: false,
            success: function (aData) {
                alert(aData.Msg);
            },
            error: function () {
                alert("Connection Is Not Available");
            }
        });
    }
    return false;
}
function PopulateMake()
{
    //$('#Col_Make').get(0).options.length = 0;
    // $('#Col_Make').get(0).options[0] = new Option("Loading..", "");

    $.ajax({
        type: 'GET',
        url: "/vehicles/make/" + $('#Col_Product').val(), // json datasource
        //dataType: 'json',
        //data: {rollNumber: $('#txtSearchRoll').val()},
        //cache: false,
        success: function (aData) {

            $('#Col_Make').get(0).options.length = 0;
            $('#Col_Make').get(0).options[0] = new Option("Select Make", "");

            $.each(aData, function (i, item) {
                console.log(i, item);
                $('#Col_Make').get(0).options[$('#Col_Make').get(0).options.length] = new Option(item['Make_Name'] + " (Vehicle : " + item['VehicleCount'] + ')', item['Make_Name']);
                // Display      Value
            });
            $('#Col_Make').selectpicker('refresh');
        },
        error: function () {
            alert("Connection Is Not Available");
        }
    });

    return false;
}
function PopulateModel()
{
    $('#Col_Model').get(0).options.length = 0;
    $('#Col_Model').get(0).options[0] = new Option("Loading..", "");
    $.ajax({
        type: 'GET',
        url: "/vehicles/model/" + $('#Col_Product').val() + "/" + $('#Col_Make').val(), // json datasource
        //dataType: 'json',
        //data: {rollNumber: $('#txtSearchRoll').val()},
        // cache: false,
        success: function (aData) {

            $('#Col_Model').get(0).options.length = 0;
            $('#Col_Model').get(0).options[0] = new Option("Select Model", "");

            $.each(aData, function (i, item) {
                console.log(i, item);
                //          $('#Col_Model').get(0).options[$('#Col_Model').get(0).options.length] = new Option(item, item);
                $('#Col_Model').get(0).options[$('#Col_Model').get(0).options.length] = new Option(item['Model_Name'] + " (Vehicle : " + item['VehicleCount'] + ')', item['Model_Name']);
                ;
                // Display      Value
            });
            $('#Col_Model').selectpicker('refresh');

        },
        error: function () {
            alert("Connection Is Not Available");
        }
    });

    return false;
}
function PopulateVariant()
{
    $('#Col_Variant').get(0).options.length = 0;
    $('#Col_Variant').get(0).options[0] = new Option("Loading..", "");
    $.ajax({
        type: 'GET',
        url: "/vehicles/variant/" + $('#Col_Make').val() + '/' + $('#Col_Model').val(), // json datasource
        //dataType: 'json',
        //data: {rollNumber: $('#txtSearchRoll').val()},
        cache: false,
        success: function (aData) {

            $('#Col_Variant').get(0).options.length = 0;
            $('#Col_Variant').get(0).options[0] = new Option("Select Variant", "");

            $.each(aData, function (i, item) {
                console.log(i, item);
                $('#Col_Variant').get(0).options[$('#Col_Variant').get(0).options.length] = new Option(item['Variant_Name'] + ' :: ' + item['Cubic_Capacity'] + ' :: ' + item['Fuel_Name'], item['Vehicle_ID']);
                // Display      Value
            });

            $('#Col_Variant').selectpicker('refresh');

        },
        error: function () {
            alert("Connection Is Not Available");
        }
    });

    return false;
}
function retriveApiLog() {
    var jsonRequest = {
        "search_reference_number": $('#hdnsrn').val(),
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

var arr_insurer = {
    "Ins_11": "TataAIG",
    "Ins_2": "Bharti",
    "Ins_4": "FutureGenerali",
    "Ins_7": "IffcoTokio",
    "Ins_9": "Reliance",
    "Ins_10": "RoyalSundaram",
    "Ins_12": "NewIndia",
    "Ins_19": "UniversalSompo",
    "Ins_33": "LibertyVideocon",
    "Ins_1": "Bajaj",
    "Ins_5": "HdfcErgo",
    "Ins_6": "IciciLombard",
    "Ins_30": "Kotak",
    "Ins_100": "FastLane"
};
var arr_status = {
    0: 'Pending',
    1: 'No Mapp',
    2: 'Mapped',
    3: 'No Support',
    4: 'Nearer',
    5: 'Premium Avail',
    6: 'Premium Not Avail',
    7: 'De-activate'
};
var arr_status_color = {
    0: 'yellow',
    1: 'red',
    2: 'green',
    3: 'orange',
    4: 'blue',
    5: 'Premium Avail',
    6: 'Premium Not Avail',
    7: 'De-activate'
};
function Search_Vehicle() {
    /* {"data": "Vehicle_ID"},
     {"data": "Make_Name"},
     {"data": "Model_Name"},
     {"data": "Variant_Name"},
     {"data": "Fuel_Name"},
     {"data": "Cubic_Capacity"},
     {"data": "Seating_Capacity"},
     {"data": "ExShoroomPrice"}, 
     */
    /*var obj_filter = {};
     if ($('#Col_Variant').val() !== '') {
     vehicle_grid.column(0).search($('#Col_Variant').val()).draw();
     } else if ($('#Col_Model').val() !== '') {
     vehicle_grid.column(3).search($('#Col_Model').val()).draw();
     } else if ($('#Col_Make').val() !== '') {
     vehicle_grid.column(2).search($('#Col_Make').val()).draw();
     }*/
    Default_Vehicle();
    //console.log('search', obj_filter);
    // vehicle_grid.fnMultiFilter(obj_filter);
}
var vehicle_grid = null;
var coreVehicleActionModelHtml = $('#vehicle_action').html();
var obj_vehicle_count = {
    "Car": 0,
    "TW": 0,
    "Insurer": {
        "Car": {},
        "TW": {}
    }
};
function Default_Vehicle() {
    if (vehicle_grid) {
        vehicle_grid.destroy();
        $('#tr_top_vehicle').html('');
        $('.vehicle_grid tbody').html('');
    }
    var vehicle_grid_cols = [
        {"data": "Vehicle_ID"},
        {"data": "Action"},
        {"data": "Make_Name"},
        {"data": "Model_Name"},
        {"data": "Variant_Name"},
        {"data": "Fuel_Name"},
        {"data": "Cubic_Capacity"},
        {"data": "Seating_Capacity"},
        {"data": "ExShoroomPrice"}
    ];
    $('#tr_top_vehicle').append('<th class="bg-teal">ID</th><th class="bg-teal">#</th><th class="bg-teal">Make</th><th class="bg-teal">Model</th><th class="bg-teal">Variant</th><th class="bg-teal">Fuel</th><th class="bg-teal">Cubic</th><th class="bg-teal">Seating</th><th class="bg-teal">Exshowroom</th>');
    var i = 0;
    for (var k in arr_insurer) {
        i++;
        var Insurer_Id = k.replace('Ins_', '');
        var color = (i > 9) ? 'indigo' : 'pink';
        $('#tr_top_vehicle').append('<th class="bg-' + color + '">' + arr_insurer[k] + '(' + Insurer_Id + ')</th>');
        $('#tr_bottom_vehicle').append('<th class="bg-' + color + '">' + arr_insurer[k] + '(' + Insurer_Id + ')</th>');
        vehicle_grid_cols.push({"data": arr_insurer[k] + '(' + Insurer_Id + ')'});
    }
    var filter = {
        'Product_Id_New': $('#Col_Product').val() - 0,
        'Make_Name': $('#Col_Make').val(),
        'Model_Name': $('#Col_Model').val(),
        'Vehicle_Id': $('#Col_Variant').val()
    };
    if ($('#Col_Insurer').val()) {
        filter['Insurer'] = $('#Col_Insurer').val().join('|');
        filter['Status'] = $('#Col_Status').val();
    }


    vehicle_grid = $('.vehicle_grid').DataTable({
        responsive: true,
        "bProcessing": true,
        "serverSide": true,
        scrollY: false,
        scrollX: true,
        scrollCollapse: true,
        fixedColumns: {
            leftColumns: 9
        },
        "ajax": {
            url: "/vehicles/mapping", // json datasource
            type: "post", // type of method  , by default would be get     
            data: filter,
            dataFilter: function (data) {
                var json = jQuery.parseJSON(data);
                json.recordsTotal = json.total;
                json.recordsFiltered = json.total;
                for (var k in json.docs) {
                    for (var k1 in arr_insurer) {
                        var Insurer_Id = k1.replace('Ins_', '');
                        json.docs[k][arr_insurer[k1] + '(' + Insurer_Id + ')'] = json.docs[k]['Vehicle_ID'] + '_' + Insurer_Id;
                        //json.docs[k][arr_insurer[k1] + '(' + k1 + ')'] = '<span class="bg-' + arr_status_color[status_id] + '">' + arr_status[status_id] + '</span>';

                    }
                    var tmpVehicleAction = coreVehicleActionModelHtml;
                    tmpVehicleAction = tmpVehicleAction.replace(/___index___/g, k);
                    json.docs[k]['Action'] = tmpVehicleAction;
                }
                json.data = json.docs;

                return JSON.stringify(json); // return JSON string
            }
        },
        initComplete: function () {

        },
        "columns": vehicle_grid_cols,
        /*"aoColumns": [
         {"sName": "Vehicle_ID"},
         {"sName": "Make_Name"},
         {"sName": "Model_Name"},
         {"sName": "Variant_Name"},
         {"sName": "Fuel_Name"}
         ],*/
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            console.log('callback', nRow, aData, iDisplayIndex, iDisplayIndexFull);
            var Vehicle_Id = aData['Vehicle_ID'];
            var Vehicle_Name = aData['Make_Name'] + '::' + aData['Model_Name'] + '::' + aData['Variant_Name'];
            var thtml = $(nRow).html();
            var arr_Veh = [
                "Vehicle_ID",
                "Make_Name",
                "Model_Name",
                "Variant_Name",
                "Fuel_Name",
                "Cubic_Capacity",
                "Seating_Capacity",
                "ExShoroomPrice"
            ]
            for (var k in aData) {
                if (arr_Veh.indexOf(k) > -1) {
                    thtml = thtml.replace('<td>' + aData[k] + '</td>', '<td id="' + Vehicle_Id + '_' + k + '">' + aData[k] + '</td>');
                }
            }
            for (var k1 in arr_insurer) {
                var Insurer_Id = k1.replace('Ins_', '');
                thtml = thtml.replace('<td>' + Vehicle_Id + '_' + Insurer_Id + '</td>', '<td id="' + Vehicle_Id + '_' + Insurer_Id + '">' + Vehicle_Id + '_' + Insurer_Id + '</td>');
            }
            $(nRow).html(thtml);
            //$('th', nRow).addClass('bg-pink');
            //$('td', nRow).addClass('bg-lime');


            for (var k1 in arr_insurer) {
                var Insurer_Id = k1.replace('Ins_', '');
                var keymatch = Vehicle_Id + '_' + Insurer_Id;
                var Mapp_Data = {};
                if (aData.hasOwnProperty('Insurer_' + Insurer_Id)) {
                    Mapp_Data = aData['Insurer_' + Insurer_Id];
                    for (var j in Mapp_Data) {
                        $('#' + keymatch, nRow).attr(j, Mapp_Data[j]);
                    }
                }
                var status_id = (Mapp_Data.hasOwnProperty('Status_Id')) ? Mapp_Data['Status_Id'] : 0;
                var class_name = arr_status_color[status_id];
                if (status_id == 2 || status_id == 4) {
                    var status_name = Mapp_Data['Insurer_Vehicle_Id'];
                } else {
                    var status_name = arr_status[status_id];
                }
                var status_name = arr_status[status_id];


                //console.log('Inner', Mapp_Data, keymatch, $('#' + keymatch, nRow));
                $('#' + keymatch, nRow).html(status_name).addClass('bg-' + class_name).css('cursor', 'pointer');
                $('#' + keymatch, nRow).attr('onclick', "Mapping_Action('" + keymatch + "');");
            }
        }
    });
}
var vehicle_mapping_grid = null;
function Default_Mapping_Vehicle_List_1() {
    //console.log(Insurer_ID, PB_Make_Name);
    var objMapping = {
        "Insurer_Vehicle_ID": '',
        "Insurer_ID": '',
        "Insurer_Vehicle_Code": "CMH1105",
        "Insurer_Vehicle_Make_Name": "MAHINDRA",
        "Insurer_Vehicle_Make_Code": 0,
        "Insurer_Vehicle_Model_Name": "GIO",
        "Insurer_Vehicle_Model_Code": "CMH1105",
        "Insurer_Vehicle_Variant_Name": "GIO",
        "Insurer_Vehicle_Variant_Code": 0,
        "Insurer_Vehicle_FuelType": "Diesel",
        "Insurer_Vehicle_CubicCapacity": 442,
        "Insurer_Vehicle_SeatingCapacity": 7,
        "Insurer_Vehicle_ExShowRoom": 220500,
        "PB_Make_Name": "Mahindra"
    };
    var arrColumns = [];
    for (var k in objMapping) {
        arrColumns.push({'data': k});
        $('#mapping_tr').append('<th class="bg-pink">' + k.toString().replace('Insurer_Vehicle_', '') + '</th>');
    }
    vehicle_mapping_grid = $('.vehicle_mapping_grid').DataTable({
        responsive: true,
        scrollX: true,
        scrollCollapse: true,
        "bProcessing": true,
        "serverSide": true,
        "ajax": {
            url: "/vehicles_insurers/list", // json datasource
            type: "post", // type of method  , by default would be get
            data: {
                'Product_Id_New': $('#Col_Product').val() - 0,
                'Insurer_ID': Insurer_ID
            },
            dataFilter: function (data) {
                var json = jQuery.parseJSON(data);
                json.recordsTotal = json.total;
                json.recordsFiltered = json.total;
                json.data = json.docs;

                return JSON.stringify(json); // return JSON string
            }
        },
        initComplete: function () {
        },
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            console.log('callback', nRow, aData, iDisplayIndex, iDisplayIndexFull);
        },
        "columns": arrColumns
    });
    //vehicle_mapping_grid.column(1).search(Insurer_ID).column(13).search(PB_Make_Name).draw();
}
function Default_Mapping_Vehicle_List(Insurer_ID, PB_Make_Name, Insurer_Vehicle_ID) {
    $('#Insurer_Vehicle_ID').val('');
    selected = 0;
    if (vehicle_mapping_grid) {
        vehicle_mapping_grid.destroy();
    }
    $('.vehicle_mapping_grid').html('');
    //console.log(Insurer_ID, PB_Make_Name);
    var objMapping = {
        "Insurer_Vehicle_ID": '',
        "Insurer_Vehicle_Make_Name": "MAHINDRA",
        "Insurer_Vehicle_Model_Name": "GIO",
        "Insurer_Vehicle_Variant_Name": "GIO",
        "Insurer_Vehicle_FuelType": "Diesel",
        "Insurer_Vehicle_CubicCapacity": 442,
        "Insurer_Vehicle_SeatingCapacity": 7,
        "Insurer_Vehicle_ExShowRoom": 220500,
        "Insurer_ID": '',
        "Insurer_Vehicle_Code": "CMH1105",
        "Insurer_Vehicle_Make_Code": 0,
        "Insurer_Vehicle_Model_Code": "CMH1105",
        "Insurer_Vehicle_Variant_Code": 0,
        "PB_Make_Name": "Mahindra",
        "Product_Id_New": "Mahindra"
    };
    $('.vehicle_mapping_grid').append('<thead><tr id="mapping_tr"></tr></thead>');
    var arrColumns = [];
    for (var k in objMapping) {
        arrColumns.push({'data': k});
        $('#mapping_tr').append('<th class="bg-pink">' + k.toString().replace('Insurer_Vehicle_', '') + '</th>');
    }
    vehicle_mapping_grid = $('.vehicle_mapping_grid').DataTable({
        responsive: true,
        scrollX: true,
        scrollCollapse: true,
        //"bProcessing": true,
        //"serverSide": true,
        "ajax": {
            url: "/vehicles_insurers/list", // json datasource
            type: "post", // type of method  , by default would be get
            data: {
                'Product_Id_New': $('#Col_Product').val() - 0,
                'Insurer_ID': Insurer_ID
            } /*,
             dataFilter: function (data) {
             var json = jQuery.parseJSON(data);               
             json.data = json;
             return JSON.stringify(json); // return JSON string
             }*/
        },
        initComplete: function () {
            console.log('Mapping Grid Complete');
            if (Insurer_Vehicle_ID != '') {
                $('#DataTables_Table_1_filter label input[type=search]').val(Insurer_Vehicle_ID).trigger($.Event("keyup", {keyCode: 13}));
            }
        },
        "rowCallback": function (row, data) {
//            if (data.DT_RowId ==  selected) {
//                $(row).addClass('bg-purple');
//            }
        },
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            for (var k in aData) {
                if (['_id'].indexOf(k) < 0) {
                    $(nRow).attr(k, aData[k]);
                }
            }
            $(nRow).attr('id', 'Insurer_Vehicle_' + aData['Insurer_Vehicle_ID']);
        },
        "columns": arrColumns
    });
    $('.vehicle_mapping_grid tbody').on('click', 'tr', function () {
        $('.vehicle_mapping_grid tbody tr').removeClass('bg-purple');
        var id = $(this).attr('Insurer_Vehicle_ID');
        selected = id;
        console.log('rowsel', id);
        $(this).toggleClass('bg-purple');
        $('#Insurer_Vehicle_ID').val(id);
    });
    //vehicle_mapping_grid.column(1).search(Insurer_ID).column(13).search(PB_Make_Name).draw();
}
var selected = 0;
function Insurer_Mapping_Vehicle_List(Insurer_ID, PB_Make_Name) {
    //vehicle_mapping_grid.column(1).search(Insurer_ID).column(13).search(PB_Make_Name).draw();
    vehicle_mapping_grid.column(1).search(Insurer_ID).draw();
}
$(function () {
    Default_Vehicle();
    //Default_Mapping_Vehicle_List();

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
    $('#Col_Make').attr('onchange', 'PopulateModel()');
    $('#Col_Model').attr('onchange', 'PopulateVariant()');



//    // Apply the search
//    vehicle_grid.columns().every(function () {
//        var that = this;
//        $('input', this.footer()).on('keyup change', function () {
//            if (that.search() !== this.value) {
//                that.search(this.value).draw();
//            }
//        });
//    });

    //Exportable table
    $('.js-exportable').DataTable({
        dom: 'Bfrtip',
        responsive: true,
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    });
});
/*
 * {
 "_id" : ObjectId("5a45d838fa6d351cf0bc9219"),
 "Insurer_Vehicle_Mapping_ID" : 38721,
 "Insurer_ID" : 2,
 "Insurer_Vehicle_ID" : 48209,
 "Vehicle_ID" : 1451,
 "Is_Active" : 1,
 "Created_On" : 1487700889473.0,
 "Status_Id" : 2,
 "Premium_Status" : 2
 }
 */
function Mapping_Action(_id) {
    var arr_d = _id.split('_');
    var Vehicle_ID = arr_d[0];
    var Insurer_ID = arr_d[1];
    $('#Vehicle_ID').val(Vehicle_ID);
    $('#Insurer_ID').val(Insurer_ID);
    var insurer_vehicle_id = '';
    if ($('#' + _id).length > 0) {
        //alert($('#' + _id).attr('insurer_vehicle_id') + '--' + $('#' + _id).attr('Insurer_ID'));
        insurer_vehicle_id = $('#' + _id).attr('insurer_vehicle_id');
    }
    $('#mdMapping .modal-content').removeAttr('class').addClass('modal-content');
    $('#mdMapping').modal('show');
    //var Vehicle_ID = $('#' + _id).attr('vehicle_id');
    $('#defaultModalLabel').html(' :: ' + $('#' + Vehicle_ID + '_Make_Name').html() + ' :: ' + $('#' + Vehicle_ID + '_Model_Name').html() + ' :: ' + $('#' + Vehicle_ID + '_Variant_Name').html() + ' :: ' + $('#' + Vehicle_ID + '_Fuel_Name').html() + ' :: ' + $('#' + Vehicle_ID + '_Cubic_Capacity').html());
    $('#Insurer_Name').html(arr_insurer['Ins_' + Insurer_ID]);
    Default_Mapping_Vehicle_List(Insurer_ID, $('#' + Vehicle_ID + '_Make_Name').html(), insurer_vehicle_id);
}
var secret_key = "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW";
var client_key = "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9";
function Validate_Premium(_index)
{
    var selected_vehicle = null;
    vehicle_grid.rows().every(function (rowIdx, tableLoop, rowLoop) {
        if (_index == rowIdx) {
            selected_vehicle = this.data();
        }
    });
    if (!selected_vehicle) {
        alert('Vehicle not selected');
        return false;
    }
    var today = new Date();
    var policy_expiry_date = today.toISOString().split('T')[0];
    today.setMonth(today.getMonth() - 24);
    today.setDate(today.getDate() + 1);
    var vehicle_registration_date = today.toISOString().split('T')[0];

    //new Date().toISOString().split('T')[0];
//"2016-02-18"
    var Premium_Request = {
        "client_key": client_key,
        "secret_key": secret_key,
        "ss_id": 0,
        "email": "test@test.com",
        "mobile": "7021776321",
        "last_name": "Test",
        "middle_name": "Test ",
        "first_name": "Test",
        "pa_paid_driver_si": "0",
        "pa_unnamed_passenger_si": "0",
        "pa_named_passenger_si": "0",
        "pa_owner_driver_si": "100000",
        "external_bifuel_value": 0,
        "external_bifuel_type": null,
        "is_aai_member": "no",
        "is_external_bifuel": "no",
        "voluntary_deductible": 0,
        "is_antitheft_fit": "no",
        "is_llpd": "no",
        "registration_no": "MH-01-AB-3659",
        "non_electrical_accessory": "0",
        "electrical_accessory": "0",
        "execution_async": "yes",
        "method_type": "Premium",
        "is_claim_exists": "no",
        "vehicle_ncb_current": "20",
        "vehicle_registration_type": "individual",
        "prev_insurer_id": 2,
        "policy_expiry_date": policy_expiry_date,
        "vehicle_registration_date": vehicle_registration_date,
        "vehicle_manf_date": vehicle_registration_date,
        "vehicle_insurance_type": "renew",
        "rto_id": 579,
        "vehicle_id": selected_vehicle.Vehicle_ID,
        "product_id": $('#Col_Product').val() - 0
    };

    //var jsonRequest = JSON.parse($('#txtServiceRequestJson').val());


    $.ajax({
        type: 'POST',
        url: "/quote/premium_initiate", // json datasource
        dataType: 'json',
        data: Premium_Request,
        //cache: false,
        success: function (serviceResponse) {
            console.log(serviceResponse);
            var url = '';
            $('#hdnsrn').val(serviceResponse.Summary.Request_Unique_Id);
            if (Premium_Request.product_id == 1) {
                url = 'http://www.policyboss.com/CarInsuranceIndia/QuotePageNew?SID=' + serviceResponse.Summary.Request_Unique_Id + '&ClientID=2';

            }
            if (Premium_Request.product_id == 10) {
                url = 'http://www.policyboss.com/TwoWheelerInsurance/QuotePageNew?SID=' + serviceResponse.Summary.Request_Unique_Id + '&ClientID=1';

            }
            $('#mdPremiumPop .modal-content').removeAttr('class').addClass('modal-content');
            $('#mdPremiumPop').modal('show');
            $('#ifrpremium').attr('src', url);

            //window.open(url);
        },
        error: function () {
            alert("Connection Is Not Available");
        }
    });

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
function Vehicle_Add_Edit(_index) {
    $('#mdAddEditVehiclePop .modal-content').removeAttr('class').addClass('modal-content');
    $('#mdAddEditVehiclePop').modal('show');
    $('#Edit_Vehicle_ID').val(-1);
    var obj_vehicle = {
        'Product_Id_New': 0,
        "Variant_Name": "Coupe",
        "Model_ID": 1,
        "Cubic_Capacity": 5935,
        "Vehicle_Image": 0,
        "Fuel_ID": 1,
        "Seating_Capacity": 2,
        "ExShoroomPrice": 19000000,
        "Make_Name": "Aston Martin",
        "Model_Name": "DB9",
        "Fuel_Name": "Petrol"
    };
    $('#actionVehicle').html('Add');
    if (_index > -1) {

        var selected_vehicle = null;
        vehicle_grid.rows().every(function (rowIdx, tableLoop, rowLoop) {
            if (_index == rowIdx) {
                selected_vehicle = this.data();
            }
        });
        if (!selected_vehicle) {
            alert('Vehicle not selected');
            return false;
        }
        for (var k in selected_vehicle) {
            if (k.indexOf('(') < 0) {
                console.log(k, selected_vehicle[k]);
                if ($('#' + k).length > 0) {
                    console.log('Exists', k, selected_vehicle[k]);
                    $('#' + k).val(selected_vehicle[k]);
                    $('#' + k).blur();
                    $('#' + k).selectpicker('refresh');
                }
            }
        }
        $('#Edit_Vehicle_ID').val(selected_vehicle["Vehicle_ID"]);
        $('#actionVehicle').html('Edit(Vehicle_ID :: ' + selected_vehicle["Vehicle_ID"] + ')');
    }

}
function AddEditVehicle() {
    $('#Product_Id_New').val();
    var obj_vehicle = {
        'Vehicle_ID': -1,
        "Variant_Name": '',
        "Cubic_Capacity": 5935,
        "Seating_Capacity": 2,
        "ExShoroomPrice": 19000000,
        "Make_Name": "Aston Martin",
        "Model_Name": "DB9",
        "Fuel_Name": "Petrol",
        'Product_Id_New': 0
    };
    for (var k in obj_vehicle) {
        obj_vehicle[k] = $('#' + k).val();
    }
    console.log('AddEditVehicle', obj_vehicle);
    var Action = ($('#Edit_Vehicle_ID').val() == -1) ? 'Add' : 'Edit';
    if (confirm('Confirm to ' + Action + ' ?')) {
        $.ajax({
            type: 'POST',
            url: "/vehicles/save", // json datasource
            dataType: 'json',
            data: obj_vehicle,
            //cache: false,
            success: function (serviceResponse) {
                console.log(serviceResponse);
                alert(serviceResponse.Msg);
            },
            error: function () {
                alert("Connection Is Not Available");
            }
        });
    }

    return false;
}
//var dtable = $(".datatable").dataTable().api();

// Grab the datatables input box and alter how it is bound to events
$("#DataTables_Table_0_wrapper .dataTables_filter input")
        .unbind() // Unbind previous default bindings
        .bind("input", function (e) { // Bind our desired behavior
            // If the length is 3 or more characters, or the user pressed ENTER, search
            if (this.value.length >= 3 || e.keyCode == 13) {
                // Call the API search function
                vehicle_grid.search(this.value).draw();
            }
            // Ensure we clear the search if they backspace far enough
            if (this.value == "") {
                vehicle_grid.search("").draw();
            }
            return;
        });
function Reset_Search() {
    $("select").val('default').selectpicker("refresh");
    $("input").empty();
    Default_Vehicle();
}
function Summary(MappSummaryData, ReportType) {
    //console.log("Pending count",PendingVehicleCount);
    //var PendingVehicleCount = getPendingVehicleCount();
    var arr_data = [];
    var arr_ins = [];
    var sum = 0;
    var obj_mapp_tmp = {};
    for (var k in MappSummaryData) {
        if (typeof arr_insurer['Ins_' + MappSummaryData[k].Insurer_ID] !== 'undefined') {
            //console.log('loop', MappSummaryData[k], arr_insurer['Ins_' + MappSummaryData[k].Insurer_ID]);
            if (obj_mapp_tmp.hasOwnProperty(MappSummaryData[k].Insurer_ID) === false) {
                var TotalVehicle = 0;
                if (ReportType == "PB_Vehicle") {
                    TotalVehicle = ($('#Col_Product').val() == 1) ? obj_vehicle_count.Car : obj_vehicle_count.TW;
                    obj_mapp_tmp[MappSummaryData[k].Insurer_ID] = {"Insurer": arr_insurer['Ins_' + MappSummaryData[k].Insurer_ID].replace(/ /g, '_')};
                } else {
                    TotalVehicle = ($('#Col_Product').val() == 1) ? obj_vehicle_count.Insurer.Car[MappSummaryData[k].Insurer_ID] : obj_vehicle_count.Insurer.TW[MappSummaryData[k].Insurer_ID];
                    obj_mapp_tmp[MappSummaryData[k].Insurer_ID] = {"Insurer": arr_insurer['Ins_' + MappSummaryData[k].Insurer_ID].replace(/ /g, '_') + "<br>(" + TotalVehicle + ")"};
                }

                for (var i = 2; i < 5; i++) {
                    if (ReportType != "PB_Vehicle" && i == 3) {
                        continue;
                    }
                    obj_mapp_tmp[MappSummaryData[k].Insurer_ID][arr_status[i].replace(/ /g, '_')] = 0;
                }
            }
            if (ReportType != "PB_Vehicle" && MappSummaryData[k].Status_Id == 3) {
                continue;
            }
            obj_mapp_tmp[MappSummaryData[k].Insurer_ID][arr_status[MappSummaryData[k].Status_Id].replace(/ /g, '_')] = parseInt(MappSummaryData[k]['InsurerStatusCount']);
        }
    }

    for (var k in obj_mapp_tmp) {
        console.log('Loop', obj_mapp_tmp[k]);
        var TotalVehicle = 0;
        if (ReportType == "PB_Vehicle") {
            TotalVehicle = ($('#Col_Product').val() == 1) ? obj_vehicle_count.Car : obj_vehicle_count.TW;
        } else {
            TotalVehicle = ($('#Col_Product').val() == 1) ? obj_vehicle_count.Insurer.Car[k] : obj_vehicle_count.Insurer.TW[k];
        }
        TotalVehicle = TotalVehicle - 0;
        TotalProcessed = 0;
        for (var i = 2; i < 5; i++) {
            if (ReportType != "PB_Vehicle" && i == 3) {
                continue;
            }
            if (obj_mapp_tmp[k].hasOwnProperty(arr_status[i].replace(/ /g, '_'))) {
                TotalProcessed += obj_mapp_tmp[k][arr_status[i].replace(/ /g, '_')] - 0;
            }
        }
        obj_mapp_tmp[k][arr_status[0].replace(/ /g, '_')] = TotalVehicle - TotalProcessed;

    }
    console.log(obj_mapp_tmp);


//    for(var x in )
//    obj_mapp_tmp[MappSummaryData[k].Insurer_ID][arr_status[0].replace(/ /g, '_')]=
//    


    for (var k in obj_mapp_tmp) {
        arr_data.push(obj_mapp_tmp[k]);
    }
    //console.log(obj_mapp_tmp, arr_data);

    var chart = AmCharts.makeChart("chartdiv", {
        "type": "serial",
        "theme": "light",
        "depth3D": 20,
        "angle": 30,
        "legend": {
            "horizontalGap": 10,
            "useGraphSettings": true,
            "markerSize": 10
        },
        "dataProvider": arr_data,
        "valueAxes": [{
                "stackType": "regular",
                "axisAlpha": 0,
                "gridAlpha": 0
            }],
        "graphs": [{
                "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
                "fillAlphas": 0.8,
                "labelText": "[[value]]",
                "lineAlpha": 0.3,
                "title": "Mapped",
                "type": "column",
                "color": "#000000",
                "valueField": "Mapped"
            }, {
                "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
                "fillAlphas": 0.8,
                "labelText": "[[value]]",
                "lineAlpha": 0.3,
                "title": "Nearer",
                "type": "column",
                "color": "#000000",
                "valueField": "Nearer"
            }, {
                "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
                "fillAlphas": 0.8,
                "labelText": "[[value]]",
                "lineAlpha": 0.3,
                "title": "No Support",
                "type": "column",
                "color": "#000000",
                "valueField": "No_Support"
            }, {
                "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
                "fillAlphas": 0.8,
                "labelText": "[[value]]",
                "lineAlpha": 0.3,
                "title": "Pending",
                "type": "column",
                "color": "#000000",
                "valueField": "Pending"
            }],
        "categoryField": "Insurer",
        "categoryAxis": {
            "gridPosition": "start",
            "axisAlpha": 0,
            "gridAlpha": 0,
            "position": "left"
        },
        "export": {
            "enabled": true
        },
        "listeners": [{
                "event": "clickGraphItem",
                "method": function (event) {
                    console.log('Clicked', event.item);
                    var Clicked_Insurer_Id = 0;
                    for (var k in arr_insurer) {
                        if (arr_insurer[k] == event.item.category) {
                            Clicked_Insurer_Id = k.replace('Ins_', '');
                            break;
                        }
                    }
                    var Clicked_Status_Id = 0;
                    var Clicked_Status_Name = "";
                    var Clicked_Count = event.item.values.value;

                    for (var k in  event.item.dataContext) {
                        if (Clicked_Count == event.item.dataContext[k]) {
                            Clicked_Status_Name = k;
                            break;
                        }
                    }
                    Clicked_Status_Name = Clicked_Status_Name.replace('_', ' ');
                    for (var k in arr_status) {
                        if (arr_status[k] == Clicked_Status_Name) {
                            Clicked_Status_Id = k;
                            break;
                        }
                    }
                    alert(Clicked_Insurer_Id + '======' + Clicked_Status_Id);
                }
            }]

    });

}

function GetInsurerStatusCount(ReportType) {
    $('#mdSummaryPop .modal-content').removeAttr('class').addClass('modal-content');
    $('#mdSummaryPop').modal('show');
    //console.log($('#Col_Product').val());
    $.ajax({
        type: 'GET',
        url: "/vehicles_insurers_mappings/summary/" + $('#Col_Product').val(), // json datasource

        success: function (aData) {
            var MappSummaryData = aData;
            Summary(MappSummaryData, ReportType);
            //getPendingVehicleCount(MappSummaryData);
        },
        error: function () {
            alert("Connection Is Not Available");
        }
    });
}

function getTotalInsurerVehicleCount(Product_Id) {
    $.ajax({
        type: 'GET',
        url: "/vehicles_insurers/total_vehicles/" + Product_Id, // json datasource

        success: function (aData) {
            var total_vehicles = aData;
            var Product = (Product_Id == 1) ? "Car" : "TW";
            obj_vehicle_count[Product] = total_vehicles['PB'] - 0;
            for (var k in total_vehicles['Insurer']) {
                obj_vehicle_count.Insurer[Product][total_vehicles['Insurer'][k]['Insurer_ID']] = total_vehicles['Insurer'][k]['Insurer_Vehicle_Count'] - 0;
            }
            console.log('getTotalInsurerVehicleCount', obj_vehicle_count);
        },
        error: function () {
            alert("Connection Is Not Available");
        }
    });

}
