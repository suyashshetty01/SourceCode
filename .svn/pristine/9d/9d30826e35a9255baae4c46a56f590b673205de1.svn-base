function GetUrl() {
	var url = window.location.href;
	var newurl;
	if (url.includes("file:")) {
		 newurl = "http://horizon.policyboss.com:5000";
	} else if (url.includes("qa")) {
		if (url.includes("https")) {
			newurl = "https://qa-horizon.policyboss.com:3443";
		} else {
			newurl = "http://qa-horizon.policyboss.com:3000";
		}
	} else if (url.includes("www") || url.includes("cloudfront")) {
		newurl = "http://horizon.policyboss.com:5000";
	} else if (url.includes("https")) {
		newurl = "https://horizon.policyboss.com:5443";
	}
	return newurl;
}

function getWebsiteUrl() {
    var url = window.location.href;
    var newurl = url.includes("https") ? "https://qa-www.policyboss.com" : "http://qa-www.policyboss.com";
    if ((url.includes("www") || url.includes("origin-cdnh") || url.includes("cloudfront")) && (!url.includes("qa"))) {
        newurl = "https://www.policyboss.com";
    }
    return newurl;
}