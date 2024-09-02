<?php
try {
    $post_data = "{}";
    $request_mode = "GET";
    if (!empty($_POST) || !empty($_GET)) {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $post_data = json_encode($_POST);
            $request_mode = "POST";
        } else {
            $post_data = json_encode($_GET);
        }
    }
} catch (Exception $e) {
    echo "<pre>";
    print_r($e);
    echo "</pre>";
    die();
}
?>
<html>
    <head>
        <title>PolicyBoss Transaction Process</title>
        <script>
            function isEmpty(obj) {
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        return false;
                    }
                }

                return JSON.stringify(obj) === JSON.stringify({});
            }
            function post(path, params, method) {
                if (method.toString().toLowerCase() == 'get' && isEmpty(params)) {
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
            var CONST_HORIZON_URL = '';
            if (window.location.hostname === 'qa.policyboss.com') {
                CONST_HORIZON_URL = 'http://qa-horizon.policyboss.com/transaction-status';
            }
            if (window.location.hostname === 'www.policyboss.com') {
                CONST_HORIZON_URL = 'http://horizon.policyboss.com/transaction-status';
            }
            document.addEventListener('DOMContentLoaded', function () {
                // do something

                var pg_data = {
                    "return_url": CONST_HORIZON_URL,
                    "return_data": <?php echo $post_data; ?>,
                    "return_redirect_mode": "<?php echo $request_mode; ?>"

                }
                console.log(pg_data);
                post(pg_data.return_url, pg_data.return_data, pg_data.return_redirect_mode);
            });
        </script>
    </head>
    <body></body>
</html>