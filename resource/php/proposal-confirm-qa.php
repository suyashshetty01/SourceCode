<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
        <title>PolicyBoss - Proposal Confirm Page</title>
        <!-- Favicon-->
        <link rel="icon" href="/favicon.ico" type="image/x-icon">
        <link rel="shortcut icon" size="119x119" href="/Horizon-App-Logo.png">

        <!-- Google Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Roboto:400,700&subset=latin,cyrillic-ext" rel="stylesheet" type="text/css">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" type="text/css">

        <!-- Bootstrap Core Css -->
        <link href="http://di8vsggi846z0.cloudfront.net/horizon/public/plugins/bootstrap/css/bootstrap.css" rel="stylesheet">

        <!-- Waves Effect Css -->
        <link href="http://di8vsggi846z0.cloudfront.net/horizon/public/plugins/node-waves/waves.css" rel="stylesheet" />

        <!-- Animation Css -->
        <link href="http://di8vsggi846z0.cloudfront.net/horizon/public/plugins/animate-css/animate.css" rel="stylesheet" />

        <!-- Custom Css -->
        <link href="http://di8vsggi846z0.cloudfront.net/horizon/public/css/style.css" rel="stylesheet">
    </head>

    <body class="login-page">
        <div class="login-box">
            <div class="logo">
                <a href="javascript:void(0);"><img style="width:80%;height:80%" src="/images/Horizon-Logo.png"></a>
                <!--<small>Admin BootStrap Based - Material Design</small>-->
            </div>
            <div class="card">
                <div class="body" style="text-align:center;">

                    <div class="preloader pl-size-xl">
                        <div class="spinner-layer">
                            <div class="circle-clipper left">
                                <div class="circle"></div>
                            </div>
                            <div class="circle-clipper right">
                                <div class="circle"></div>
                            </div>
                        </div>
                    </div>
                    <h4>Please Wait...<br><br>Payment Gateway Redirection in Progress...</h4>
                </div>
            </div>
            <div class="logo">

                <a href="javascript:void(0);"><img style="width:80%;height:80%" src="/images/insurance.png"></a>
                <!--<small>Admin BootStrap Based - Material Design</small>-->
            </div>
        </div>

        <!-- Jquery Core Js -->
        <script src="http://di8vsggi846z0.cloudfront.net/horizon/public/plugins/jquery/jquery.min.js"></script>

        <!-- Bootstrap Core Js -->
        <script src="http://di8vsggi846z0.cloudfront.net/horizon/public/plugins/bootstrap/js/bootstrap.js"></script>

        <!-- Waves Effect Plugin Js -->
        <script src="http://di8vsggi846z0.cloudfront.net/horizon/public/plugins/node-waves/waves.js"></script>

        <!-- Validation Plugin Js -->
        <script src="http://di8vsggi846z0.cloudfront.net/horizon/public/plugins/jquery-validation/jquery.validate.js"></script>


        <script>
            var CONST_HORIZON_URL = '';
            if (window.location.hostname === 'qa-horizon.policyboss.com') {
                CONST_HORIZON_URL = 'http://qa-horizon.policyboss.com:3000';
            }
            if (window.location.hostname === 'horizon.policyboss.com') {
                CONST_HORIZON_URL = 'http://horizon.policyboss.com:5000';
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
            function post(path, params, method) {
                if (method.toString().toLowerCase() == 'get' && jQuery.isEmptyObject(params)) {
                    window.location.href = path;
                } else {
                    method = method || "post"; // Set method to post by default if not specified.

                    // The rest of this code assumes you are not using a library.
                    // It can be made less wordy if you use one.
                    var form = document.createElement("form");
                    form.setAttribute("method", method);
                    form.setAttribute("action", path);

                    for (var key in params) {
                        if (params.hasOwnProperty(key)) {
                            var hiddenField = document.createElement("input");
                            hiddenField.setAttribute("type", "hidden");
                            hiddenField.setAttribute("name", key);
                            hiddenField.setAttribute("value", params[key]);
                            form.appendChild(hiddenField);
                        }
                    }

                    document.body.appendChild(form);
                    form.submit();
                }
            }
            function GetPGData(User_Data_Id) {
                var obj_horizon_data = Horizon_Method_Convert('/user_datas/view/' + User_Data_Id, '', "GET");
                $.get(obj_horizon_data['url'], function (res) {
                    var pg_data = res[0].Payment_Request;                                       
                    post(pg_data.pg_url, pg_data.pg_data, pg_data.pg_redirect_mode);
                });
            }
            function getUrlParameter(name) {
                name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
                var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
                var results = regex.exec(location.search);
                return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
            }
            $(function () {
                var User_Data_Id = getUrlParameter('udid');
                GetPGData(User_Data_Id);
            });
        </script>
    </body>

</html>