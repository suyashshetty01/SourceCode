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
	cameraOutput2 = document.querySelector("#camera--output2"),
	cameraOutput3 = document.querySelector("#camera--output3"),
    cameraOutput4 = document.querySelector("#camera--output4"),
	cameraOutput5 = document.querySelector("#camera--output5"),
	cameraOutput6 = document.querySelector("#camera--output6"),
	cameraOutput7 = document.querySelector("#camera--output7"),
	cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger"),
	flipButton = document.querySelector("#flip--button"),
	cameraTrigger1 = document.querySelector("#camera--trigger1")
	//cameraSaveImg = document.querySelector("#camera--image")
// Access the device camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
        track = stream.getTracks()[0];
        cameraView.srcObject = stream;
    })
    .catch(function(error) {
        //console.log("Oops. Something is broken.");
    });
}
// Take a picture when cameraTrigger is tapped
var count = 0;
cameraTrigger.onclick = function() {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
	cameraOutput.src = cameraSensor.toDataURL("image/webp");
	cameraOutput.classList.add("taken");
	count++;
	if(count === 1){
	$("#camera--trigger").text("Vehicle Right Side");
	//cameraOutput1.src = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUA AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO 9TXL0Y4OHwAAAABJRU5ErkJggg==";
    cameraOutput1.src = cameraSensor.toDataURL("image/webp");
	cameraOutput1.classList.add("taken1");
	} else if(count === 2){
	$("#camera--trigger").text("Vehicle Back Side");
	cameraOutput2.src = cameraSensor.toDataURL("image/webp");
    cameraOutput2.classList.add("taken2");
	} else if(count === 3){
	$("#camera--trigger").text("Vehicle Left side");
    cameraOutput3.src = cameraSensor.toDataURL("image/webp");
	cameraOutput3.classList.add("taken3");
	} else if(count === 4){
	$("#camera--trigger").text("Vehicle Under hood with Engine");
	cameraOutput4.src = cameraSensor.toDataURL("image/webp");
    cameraOutput4.classList.add("taken4");
	} else if(count === 5){
	$("#camera--trigger").text("Chassis Number");
	cameraOutput5.src = cameraSensor.toDataURL("image/webp");
    cameraOutput5.classList.add("taken5");
	} else if(count === 6){
    $("#camera--trigger").text("Vehicle Odometer");
	cameraOutput6.src = cameraSensor.toDataURL("image/webp");
	cameraOutput6.classList.add("taken6");
	} else if(count === 7){
	$("#camera--trigger").text("Save");
	cameraOutput7.src = cameraSensor.toDataURL("image/webp");
    cameraOutput7.classList.add("taken7");
	} else if(count > 7) {
	$("#saveDIV").show();
	$("#cameraDIV").hide();
	
	}  	
var buttonTxt = $('#camera--trigger1').text();
cameraTrigger1.onclick = function(){
	/*var r = confirm("Are you sure you want to continue?");
	if (r == true) {
    txt = "You pressed OK!";
	} else {
    txt = "You pressed Cancel!";
	}*/
	//const cameraOutputsrc = document.getElementById("camera--output"+i).getAttribute("src");
	var img1 = encodeURIComponent(cameraOutput1.src);
	var img2 = encodeURIComponent(cameraOutput2.src);
	var img3 = encodeURIComponent(cameraOutput3.src);
	var img4 = encodeURIComponent(cameraOutput4.src);
	var img5 = encodeURIComponent(cameraOutput5.src);
	var img6 = encodeURIComponent(cameraOutput6.src);
	var img7 = encodeURIComponent(cameraOutput7.src);
	var crn = window.location.href.split("=")[1];
	//var crn = 123456;
	var imgobj = { 	"crn":crn,
					"img1":img1,
					"img2":img2,
					"img3":img3,
					"img4":img4,
					"img5":img5,
					"img6":img6,
					"img7":img7
				};
	/*if(img1 =='data%3A%2C' && img2 =='data%3A%2C' && img3 =='data%3A%2C' && img4 =='data%3A%2C' && img5 =='data%3A%2C' && img6 =='data%3A%2C' && img7 =='data%3A%2C' && crn == '' && crn == 0 && crn == undefined)
	{}
else{*/
		console.log(JSON.stringify(imgobj));
        var client_id = 2;
		//var obj_horizon_data = Horizon_Method_Convert("/quote/save_img",imgobj,"POST");
        var returnurl = GetUrl() + '/quote/save_img';
        client_id = 2;
            $.ajax({
                type: "POST",
				data: JSON.stringify(imgobj),
                url: returnurl,
				//data: JSON.stringify(obj_horizon_data['data']),
				//url: obj_horizon_data['url'],
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                
                success: function (data) {
                    console.log("success");
					$("#successDIV").show();
					$("#cameraDIV").hide();  
					console.log(data);
                },
                error: function (data) {
					console.log("fail");
					$("#failDIV").show();
					$("#cameraDIV").hide();  
                    console.log(data);
				}
            });
/* } */
};
flipButton.onclick = function () { 
    front = !front; 
};
function GetUrl(){
            var url = window.location.href;
            var newurl;
            //newurl = "http://qa.policyboss.com";
            if (url.includes("Desktop")) {
				newurl = "http://localhost:3000";
				//newurl = "http://qa-horizon.policyboss.com:3000";
            } else if (url.includes("qa")) {
                newurl = "http://qa-horizon.policyboss.com:3000";
            } else if (url.includes("www") || url.includes("cloudfront")) {
                newurl = "http://horizon.policyboss.com:5000";
            }
            return newurl;
        };
};
function GeteditUrl() {
        var url = window.location.href;
        //alert(url.includes("health"));
        var newurl;
        newurl = "http://qa.policyboss.com";
        if (url.includes("localhost")) {
            newurl = "http://localhost:3000";
        } else if (url.includes("qa")) {
            newurl = "http://qa.policyboss.com";
        } else if (url.includes("www") || url.includes("cloudfront")) {
            newurl = "https://www.policyboss.com";
        }
        return newurl;
    };
function Horizon_Method_Convert(method_action,data,type){
        var obj_horizon_method = {
            'url': (type=="POST")?"/TwoWheelerInsurance/call_horizon_post":"/TwoWheelerInsurance/call_horizon_get?method_name="+method_action,
            "data":{
                request_json: JSON.stringify(data),
                method_name: method_action,
                client_id:"2"
            }
        };
        return obj_horizon_method;
    }
// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);
//Hosting