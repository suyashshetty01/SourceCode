 $(document).ready(function () {
 //alert('Clicked header');
		$('ul.navigation li').click(function(e){
		 debugger;
		  $('ul.navigation li').removeClass("Active");
		  var ss_id = getUrlVars()["ss_id"];
            var fba_id = getUrlVars()["fba_id"];
            var ip_address = getUrlVars()["ip_address"];
            var app_version = getUrlVars()["app_version"];
            var mac_address = getUrlVars()["mac_address"];

           

                $(this).addClass("Active");
				if ($('li.Active').text() == 'INPUT') {
				
				   location.reload(true);
				}else if ($('li.Active').text() == 'QUOTE'){
					//window.location.href = './health_quote.html?client_id=2&ss_id=' + ss_id + '&fba_id=' + fba_id + '&ip_address=' + ip_address + '&mac_address=' + mac_address + '&app_version=' + app_version;
				}else if ($('li.Active').text() == 'BUY'){
				
				}
		 })
		 
		 var getUrlVars = function () {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        }
        var stringparam = function () {

            var arr = ["ss_id", "fba_id", "ip_address", "app_version"];
            for (var i = 0; i < arr.length; i++) {
                var qs_val = getParameterByName(arr[i]);
                var fba_id = getParameterByName('fba_id');
                var ip_address = getParameterByName('ip_address');
                var app_version = getParameterByName('app_version');
                if (qs_val == null || qs_val == '' || qs_val == '0') {

                    $(".healthmaindiv").hide();
                    $(".warningmsg").show();
                }
                else {

                    $(".healthmaindiv").show();
                    $(".warningmsg").hide();
                }
            }
        }
        var getParameterByName = function (name) {
            var url = window.location.href;
            name = name.replace(/[\[\]]/g, '\\$&');
            var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
			results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        }
		
		
 });