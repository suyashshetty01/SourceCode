var app_visitor_id = "";
$(document).ready(function () {
    let app_ss_id = "";
    let app_fba_id = "";
    let update_Count = 0;
    let insert_Count = 0;
    let device_type = "";
    let user_agent = "";
    $.get('https://www.policyboss.com/get-session', function (data) {
        if (data.hasOwnProperty('user') && data['user']) {
            app_ss_id = data['user'].hasOwnProperty('ss_id') ? data['user']['ss_id'] : "";
            app_fba_id = data['user'].hasOwnProperty('fba_id') ? data['user']['fba_id'] : "";
			horizon_get_session();
        }
        if (data.hasOwnProperty('transaction') && data['transaction']) {
            if (data['transaction'].hasOwnProperty('visitor_id') && data['transaction']['visitor_id']) {
                app_visitor_id = data['transaction']['visitor_id'];
                saveVisitorData('update');
                setInterval(() => {
                    saveVisitorData('update');
                }, 30000);
            }
        } else {
            saveVisitorData('insert');
            setInterval(() => {
                saveVisitorData('update');
            }, 30000);
        }
    });

    function saveVisitorData(operation) {
        var ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            device_type = "TABLET";
        }
        else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            device_type = "MOBILE";
        }
        else {
            device_type = 'DESKTOP'
        }
        user_agent = navigator.userAgent;
        let url = window.location.href;
        let ipAddress = '';
        let temp_visit_id = (app_visitor_id ? app_visitor_id : '');
        let methodName = (operation === 'update' ? ('/postservicecall/app_visitor/update_data/' + temp_visit_id) : ('/postservicecall/app_visitor/save_data'));
        $.ajax({
            url: 'https://api.ipify.org/?format=json',
            type: 'GET',
            success: function (ip_data) {
                console.log("IP Address Response", ip_data);
                if (ip_data.hasOwnProperty('ip') && ip_data.ip) {
                    ipAddress = ip_data['ip'];
                    let visitor_data = {};
                    if (operation === 'insert') {
                        insert_Count++;
                        visitor_data = {
                            "app_type": 'Travel_Website',
                            "ss_id": app_ss_id ? app_ss_id : 0,
                            "fba_id": app_fba_id ? app_fba_id : 0,
                            "IP_Address": ipAddress,
                            "query_string": window.location.href.split("?")[1] ? window.location.href.split("?")[1] : '',
                            "Last_Visited_Url": window.location.href,
                            "device_type": device_type ? device_type : '',
                            "user_agent": user_agent ? user_agent : ''
                        };
                    }
                    else if (operation === 'update') {
                        update_Count++;
                        visitor_data = {
                            "app_type": 'Travel_Website',
                            "ss_id": app_ss_id ? app_ss_id : 0,
                            "fba_id": app_fba_id ? app_fba_id : 0,
                            "Last_Visited_Url": window.location.href,
                            "device_type": device_type ? device_type : '',
                            "user_agent": user_agent ? user_agent : ''
                        };
                    }
                    $.ajax({
                        url: GetUrl() + methodName,
                        type: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(visitor_data),
                        dataType: "json",
                        success: function (data) {
                            if (operation === 'insert') {
                                app_visitor_id = data['visitor_Id']; // data get from DB
                                let db_visitor_Data = {
                                    "visitor_id": app_visitor_id
                                };
                                $.ajax({
                                    url: "/set-session",
                                    type: "POST",
                                    //crossDomain: true,
                                    data: db_visitor_Data,
                                    dataType: "json",
                                    success: function (data) {
                                        console.log('set-session:', data);
                                        if (data.hasOwnProperty('transaction')) {
                                            console.log("Session set");
                                        }
                                    },
                                    error: function (e) {
                                        console.log("set session error :", e);
                                        //saveVisitorData('insert');
                                    }
                                });
                            } else {
                                console.log(data['Msg']);
                            }
                            if (update_Count === 1 && operation === "update" && insert_Count === 0) {
                                saveVisitorHistory();
                            }
                        },
                        error: function (e) {
                            console.log("set session error :", e);
                        }
                    });
                } else {
                    console.log("IP address is not available");
                }
            },
            error: function (error) {
                console.log("IP service not working");
                //saveVisitorData('insert');
            }
        });
    }

    function saveVisitorHistory() {
        let visitor_history_data = {
            "visited_url": window.location.href,
            "visitor_Id": app_visitor_id,
            "device_type": device_type,
            "user_agent": user_agent
        };
        let methodName = '/postservicecall/app_visitor_history/save_data';
        $.ajax({
            url: GetUrl() + methodName,
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify(visitor_history_data),
            dataType: "json",
            success: function (data) {
                if (data['visitor_Id']) {
                    console.log('visitor updated against visitor id', data['visitor_Id']);
                }
            },
            error: function (e) {
                console.log('Error in visitor_history  service call');
            }
        })
    }
    function GetUrl() {
        var url = window.location.href;
        var newurl;
        if (url.includes("request_file")) {
            newurl = "http://localhost:3000";
        } else if (url.includes("qa.")) {
            newurl = url.includes('https') ? "https://qa-horizon.policyboss.com:3443" : "http://qa-horizon.policyboss.com:3000";
        } else if (url.includes("www.") || url.includes("cloudfront") || url.includes("origin-cdnh") || url.includes("policyboss")) {
            newurl = url.includes('https') ? "https://horizon.policyboss.com:5443" : "http://horizon.policyboss.com:5000";
        }
        return newurl;
    }
});