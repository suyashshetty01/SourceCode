var ip_address;
$(document).ready(function () {
	siteURL = window.location.href;
	getClientBrowserDetails();
	$(window).bind('scroll', function () {
		if ($(window).scrollTop() > 31) {
			$('.Navigation').addClass('fixed');
		}
		else {
			$('.Navigation').removeClass('fixed');
		}
	});
	$('#menuBar').click(function () {
		$('.sideMenu').show();
	});
	$('.Menuclose').click(function () {
		$('.sideMenu').hide();
	});
	$('.Navigation li').click(function () {
		$('.sideMenu').hide();
	});
	$('.moreText').click(function () {
		$('.ReadMore').show();
		$('.moreText').hide();
	});
	$('#Products .col-md-6').click(function () {
		$('.moreText').show();
		$('.ReadMore').hide();
		var name = $(this).attr('class');
		var className = name.split(" ");
		console.log(className);
		var Class = className[1];
		console.log(Class);
		$('.popup').show();
		$('.popup .' + Class).show();
	})
	$('.close').click(function () {
		var parent = $(this).parents().find('.popup');
		//var id = $(parent +'div').attr('id');
		//console.log(id);
		$(parent).hide();
		$('.popup .trade_Credit').hide();
		$('.popup .Business').hide();
		$('.popup .ShopORoffice').hide();
		$('.popup .cyber').hide();
		$('.popup .director').hide();
		$('.popup .commercial').hide();
		$('.popup .professional').hide();
		$('.popup .employee').hide();
	});
});
function forceText(e) {
	e.target.value = e.target.value.replace(/[^a-zA-Z ]+/g, '');
	return false;
}
function forceNumeric(e) {
	e.target.value = e.target.value.replace(/[^\d]/g, '');
	return false;
}
function getClientBrowserDetails() {
	if (window.navigator && window.navigator.geolocation) {
		window.navigator.geolocation.getCurrentPosition(
			position => {
				this.showPosition(position)
			},
			error => {
				console.log('Position Unavailable');
			});
	}
}
function showPosition(position) {
	// geo_lat = position.coords.latitude;
	// geo_long = position.coords.longitude;
	$.getJSON('https://api.ipify.org?format=json', function (data) {
		ip_address = data.ip;
	});
}
function validateForm() {
	var err = 0;
	var namePattern = new RegExp('^[a-zA-Z ]+$');
	var mobilePattern = new RegExp('^[7-9]{1}[0-9]{9}$');
	var emailPattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
	var contact_name = $('#contact_name').val();
	var mobile = $('#mobile').val();
	var email = $('#email').val();
	var product = $('#product').val();
	var message = $('#message').val();

	$("#contact_name").removeClass('Error');
	$("#mobile").removeClass('Error');
	$("#email").removeClass('Error');
	$("#product").removeClass('Error');
	$("#message").removeClass('Error');

	if (contact_name !== '') {
		if (!namePattern.test(contact_name)) {
			err++;
			$("#contact_name").addClass('Error');
		} else {
			var namearray = contact_name.split(" ");
			if (namearray[1] === "" || namearray[0] === "" || namearray[1] === undefined) {
				err++;
				$("#contact_name").addClass('Error');
			}
		}
	} else {
		err++;
		$("#contact_name").addClass('Error');
	}

	if (mobile === '' || !mobilePattern.test(mobile)) {
		err++;
		$("#mobile").addClass('Error');
	}

	if (email !== '') {
		if (!emailPattern.test(email)) {
			err++;
			$("#email").addClass('Error');
		}
	} else {
		err++;
		$("#email").addClass('Error');
	}

	if (product === '' || product === null) {
		err++;
		$("#product").addClass('Error');
	}

	if (message === '') {
		err++;
		$("#message").addClass('Error');
	}

	if (err > 0) {
		document.getElementById("req_field").innerHTML = "Highlighted fields are mandatory";
	} else {
		document.getElementById("req_field").innerHTML = "";
		getStart();
	}
}

function getStart(){
	var dataVars = {}, hash;
	if(window.location.href.includes('?')) {
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for (var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			if(hash.length > 1 && hash[1].includes('#')) {
				dataVars[hash[0]] = hash[1].split('#')[0];
			} else {
				dataVars[hash[0]] = hash[1];
			}
		}
	}
	// console.log(dataVars);
	var str = {
		'contact_name' : $('#contact_name').val(),
		'mobile' : $('#mobile').val(),
		'email' : $('#email').val(),
		'product' : $('#product').val(),
		'message' : $('#message').val(),
		'ip_address' : ip_address,
		'search_parameter': dataVars
	}
	console.log(str);
	var obj_horizon_data = Horizon_Method_Convert("/add_corp_lead", str, "POST");
	$.ajax({
		type: "POST",
		// data: JSON.stringify(str),
		// url: siteURL.includes('www') ? GetUrl() + "/add_corp_lead" : GetUrl() + "/postservicecall/add_corp_lead",
		data: siteURL.indexOf('https') == 0 ? JSON.stringify(obj_horizon_data['data']) : JSON.stringify(str),
		url: siteURL.indexOf('https') == 0 ? obj_horizon_data['url'] : GetUrl() + "/postservicecall/add_corp_lead",
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		success: function (data) {
			console.log(data);
			if(data['Status'] === "Success") {
				window.location.href = "https://www.policyboss.com/commerciallines/ThankYou.html";
			} else {
				alert("Please try again after sometime");
			}
			$('#contact_name,#mobile,#email,#product,#message').val('');
		},
		error: function (result) {
			// alert("Please try again after sometime");
		}
	});
}
var GetUrl = function () {
	var url = window.location.href;
	var newurl = "";
	if (url.includes("request_file")) {
		newurl = "http://localhost:3000";
	} else if (url.includes("qa.")) {
		newurl = "http://qa-horizon.policyboss.com:3000";
	} else if (url.includes("www")) {
		newurl = "https://horizon.policyboss.com:5443";
	}
	return newurl;
}

function Horizon_Method_Convert(method_action, data, type) {
	var obj_horizon_method = {
		'url': (type === "POST") ? "/TwoWheelerInsurance/call_horizon_post" : "/TwoWheelerInsurance/call_horizon_get?method_name=" + method_action,
		"data": {
			request_json: JSON.stringify(data),
			method_name: method_action,
			client_id: "2"
		}
	};
	return obj_horizon_method;
}