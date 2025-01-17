function Horizon_Method_Convert(method_action, data, type) {
    var obj_horizon_method = {
        'url': (type === "POST") ? "/horizon-method.php" : "/horizon-method.php?method_name=" + method_action,
        "data": {
            request_json: JSON.stringify(data),
            method_name: method_action,
            client_id: "2"
        }
    };
    return obj_horizon_method;
}

function GetUrl() {
    var url = window.location.href;
    var newurl;
    if (url.includes("request_file")) {
        newurl = "http://localhost:3000";
    } else if (url.includes("qa")) {
        newurl = url.includes("https") ? "https://qa-horizon.policyboss.com:3443" : "http://qa-horizon.policyboss.com:3000";
    } else if (url.includes("www") || url.includes("origin-cdnh") || url.includes("cloudfront")) {
        newurl = "https://horizon.policyboss.com:5443";
    }
    return newurl;
}

function getEditUrl() {
    var url = window.location.href;
    var newurl = url.includes("https") ? "https://qa.policyboss.com" : "http://qa.policyboss.com";
    if (url.includes("www") || url.includes("origin-cdnh") || url.includes("cloudfront")) {
        newurl = "https://www.policyboss.com";
    }
    return newurl;
}

function BuyNowUrl() {
    var url = window.location.href;
    var newurl;
    if (url.includes("request_file")) {
        newurl = "http://localhost:6200";
    } else if (url.includes("qa")) {
        newurl = url.includes("https") ? "https://qa.policyboss.com/Travel" : "http://qa.policyboss.com/Travel";
    } else if (url.includes("www") || url.includes("origin-cdnh") || url.includes("cloudfront")) {
        newurl = "https://www.policyboss.com/Travel";
    }
    return newurl;
}

var getUrlVars = function () {
    var vars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
};