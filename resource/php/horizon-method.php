<?php

try {
    $post_data = "{}";
    $request_mode = "GET";
    $method_name = '';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $post_data = file_get_contents('php://input');
        $request_mode = "POST";
        $post_data = json_decode($post_data, true);
        $request_json = json_decode($post_data['request_json'], true);
        $request_json['secret_key'] = 'SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW';
        $request_json['client_key'] = 'CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9';
        $method_name = $post_data['method_name'];
        $ch = curl_init("http://horizon.policyboss.com:5000" . $post_data['method_name']);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($request_json));
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
    } else {
        $post_data = json_encode($_GET);
        $method_name = $post_data['method_name'];
        $ch = curl_init("http://horizon.policyboss.com:5000" . $_GET['method_name']);
    }
    if ($_GET['dbg'] === 'yes') {
        echo "<pre>";
        echo 'GET';
        print_r($_GET);
        echo 'POST';
        print_r($_POST);
        echo 'DATA';
        print_r($post_data);
        print_r($request_json);
        echo "</pre>";
    }
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $output = curl_exec($ch);
    $ob = json_decode($output);
    if ($ob === null) {
        // $ob is null because the json cannot be decoded
    } else {
        header('Content-Type: application/json');
    }
    echo $output;
    curl_close($ch);
} catch (Exception $e) {
    echo "<pre>";
    print_r($e);
    echo "</pre>";
    die();
}
?>
