// Set constraints for the video 
var front = false;
var constraints = { video: { facingMode: (front? "user" : "environment") } };
/* var constraints = { video: { facingMode: "user" }, audio: false }; */

// Define constants
const cameraView = document.querySelector("#camera--view"),
	saveDIV = document.querySelector("#saveDIV"),
	cameraDIV = document.querySelector("#cameraDIV"),
	cameraOutput = document.querySelector("#camera--output"),
    cameraOutput1 = document.querySelector("#camera--output1"),
	cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger"),
    cameraTrigger1 = document.querySelector("#camera--trigger1"),
    flipButton = document.querySelector("#flip--button"),
	uploadButton = document.querySelector("#upload--button")
	saveButton = document.querySelector("#upload")
//cameraSaveImg = document.querySelector("#camera--image")

//Upload Image - Start
function isUploadSupported() {
    if (navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
        return false;
    }
    var elem = document.createElement('input');
    elem.type = 'file';
    return !elem.disabled;
};



if (window.File && window.FileReader && window.FormData) {
	var $inputField = $('#file');

	$inputField.on('change', function (e) {
		var file = e.target.files[0];

		if (file) {
			if (/^image\//i.test(file.type)) {
				readFile(file);
			} else {
				alert('Not a valid image!');
			}
		}
	});
} else {
	alert("File upload is not supported!");
}
function readFile(file) {
	var reader = new FileReader();

	reader.onloadend = function () {
		processFile(reader.result, file.type);
	}

	reader.onerror = function () {
		alert('There was an error reading the file!');
	}

	reader.readAsDataURL(file);
}


function processFile(dataURL, fileType) {
	var maxWidth = 800;
	var maxHeight = 800;

	var image = new Image();
	image.src = dataURL;

	image.onload = function () {
		var width = image.width;
		var height = image.height;
		var shouldResize = (width > maxWidth) || (height > maxHeight);

		if (!shouldResize) {
			sendFile(dataURL);
			return;
		}

		var newWidth;
		var newHeight;

		if (width > height) {
			newHeight = height * (maxWidth / width);
			newWidth = maxWidth;
		} else {
			newWidth = width * (maxHeight / height);
			newHeight = maxHeight;
		}

		var canvas = document.createElement('canvas');

		canvas.width = newWidth;
		canvas.height = newHeight;

		var context = canvas.getContext('2d');

		context.drawImage(this, 0, 0, newWidth, newHeight);

		dataURL = canvas.toDataURL(fileType);
		var append = '<img id="output_upload" src="'+dataURL+'">';
		document.getElementById('output').innerHTML = append;
		var img1 = encodeURIComponent(dataURL);
		 if(img1 =='data%3A%2C')
        {}
    else{
		var save_Upload= '<button id="upload">Upload</button>';
		document.getElementById('upload').innerHTML = save_Upload;
		
	}
		//var parent = document.getElementById('camera--output1');
		//parent.insertAdjacentHTML('beforeend', append);
		//var img1 = encodeURIComponent(dataURL);
		//uploadFile(img1);
	};

	image.onerror = function () {
		alert('There was an error processing your file!');
	};
}
function uploadFile(img1) {
	var uid = window.location.href.split("?")[1].split("=")[1];
        
var imgobj = {
            "uid": uid,
            "img1": img1
        };
        /*if(img1 =='data%3A%2C' && crn == '' && crn == 0 && crn == undefined)
        {}
    else{*/
        console.log(JSON.stringify(imgobj));
        var client_id = 2;
        var obj_horizon_data = Horizon_Method_Convert("/quote/photos_upload_hr",imgobj,"POST");
        //var returnurl = GetUrl() + '/quote/photos_upload_hr';
        client_id = 2;
        $.ajax({
            type: "POST",
            //data: JSON.stringify(imgobj),
            //url: returnurl,
            data: JSON.stringify(obj_horizon_data['data']),
            url: obj_horizon_data['url'],
            contentType: "application/json;charset=utf-8",
            dataType: "json",

            success: function (data) {
                console.log("success");
                console.log(data);
            },
            error: function (data) {
                console.log("fail");
                console.log(data);
            }
        });
       $("#successDIV").show();
		$("#cameraDIV").hide();
}

//Upload Image - End

// Access the device camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
            track = stream.getTracks()[0];
            cameraView.srcObject = stream;
        })
    .catch(function (error) {
        console.log("Oops. Something is broken.");
    });
}
// Take a picture when cameraTrigger is tapped
var count = 0;
cameraTrigger.onclick = function () {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.classList.add("taken");
    count++;
    if (count === 1) {
        $("#camera--trigger").text("Save");
        cameraOutput1.src = cameraSensor.toDataURL("image/webp");
        cameraOutput1.classList.add("taken1");
    } 
	else if (count > 1) {
        var img1 = encodeURIComponent(cameraOutput.src);
        uploadFile(img1); 
	}		 

}
saveButton.onclick = function () { 
   $("#uploadDIV").hide();
   var img1 = encodeURIComponent(document.getElementById("output_upload").src);
	uploadFile(img1);
};
flipButton.onclick = function () { 
    front = !front; 
};
uploadButton.onclick = function () { 
    //code 
$("#uploadDIV").show();
                    $("#cameraDIV").hide();	
};
function GetUrl() {
	var url = window.location.href;
	var newurl;
	//newurl = "http://qa.policyboss.com";
	if (url.includes("CameraTest")) {
		newurl = "http://localhost:3000";
		//newurl = "http://qa-horizon.policyboss.com:3000";
	} else if (url.includes("qa")) {
		newurl = "http://qa-horizon.policyboss.com:3000";
	} else if (url.includes("www") || url.includes("cloudfront")) {
		newurl = "https://horizon.policyboss.com:5000";
	}
	return newurl;
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
// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);
//Hosting