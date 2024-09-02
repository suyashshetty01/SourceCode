  var ss_id, fba_id, ip_address, app_version, mac_address, mobile_no;
  var pageIndex = 1;
  var pageCount;
  var iScrollPos = 0;
  var isSearchCheck=false;
  var quoteSearch_url="";
  var appSearch_url="";
  var sellSearch_url="";
  
 function activeTab(){
	
	var activetab;
	if ($('li.Active').text() == 'QUOTE'){
		activetab="SEARCH"
	}else if ($('li.Active').text() == 'APPLICATIONS'){
		activetab="APPLICATION"
	}else if ($('li.Active').text() == 'COMPLETE'){
		 activetab="SELL"
	}
	
	return activetab
}
 function Reset(){
	      $('#tbl_quote_list').empty();
		  $('.app_mainlist').empty();
		  $('.sellDiv').empty();
		  quoteSearch_url="";
		  appSearch_url="";
		  sellSearch_url="";
		  GetQuoteList();
		  GetApplication();
		  GetSellList();
  }
  $(document).ready(function() {
      stringparam();
      GetQuoteList();
      GetApplication();
	  GetSellList();
	  $("#SearchQuote").val(0);
	  $("#SearchQuoteInput").hide();
	  
    
	   $('ul.qlist li').click(function (e) {
		        $("#SearchQuote").val(0);
		        $("#SearchQuoteInput").hide();
				//Reset();
				
                $('ul.qlist li').removeClass("Active");
                $(this).addClass("Active");

                if ($('li.Active').text() == 'APPLICATIONS') {
                   $(".quoteList_container").hide();
				   $(".appquote_list").show();
				   $(".motor_maindiv").children('.menuBox').hide();
				   $(".sell_list").hide();
				   
				   $('.app_mainlist').empty();
				   appSearch_url="";
				   GetApplication();
				   
                } else if ($('li.Active').text() == 'QUOTE') {

                   $(".quoteList_container").show();
                   $(".appquote_list").hide();
		           $(".appquote_list").children('.menuBox').hide();
		           $('qlist').removeClass('Active');
				   $(".sell_list").hide();
				   
				   $('#tbl_quote_list').empty();
				   quoteSearch_url="";
				   GetQuoteList();
                }
				else if ($('li.Active').text() == 'COMPLETE')
				{
				   $(".quoteList_container").hide();
                   $(".appquote_list").hide();
				   $(".sell_list").show();		           
		           $('qlist').removeClass('Active');	
					
				   $('.sellDiv').empty();
				   sellSearch_url="";	
				   GetSellList();				   
				}

            });

  });

  function GetQuoteList() {
      //
      //var url = GetUrl()+"/user_datas/quicklist/10/SEARCH/" + ss_id + "/" + fba_id + "/" + pageIndex + "/" + mobile_no;
	  
	  var url;
	  if(quoteSearch_url==""){
		   url = GetUrl()+"/user_datas/quicklist/10/SEARCH/" + ss_id + "/" + fba_id + "/" + pageIndex + "/" + mobile_no;
	  }else{
		  url=quoteSearch_url;
	  }
      

      $.ajax({
          type: "GET",
          url: url,
          dataType: "json",
          success: function(data) {
              console.log(data);
              for (var i in data) {
                  $('#tbl_quote_list').append('<tr class="quoteDiv" id="tr_lst" srn="'+ data[i].SRN +'" udid="'+ data[i].User_Data_Id +'">' +
                      '<td><div class="ApplicantName">' + data[i].Customer_Name + '</div>' +
                      '<div class="ApplicantName">CRN:<span class="crn_span">' + data[i].CRN + '</div>' +
                      '</td>' +
                     
                      '<td><div class="title">QUOTE DATE</div><div class="desc quote_date">' + data[i].Quote_Date_Mobile + '</div></td>' +
                      '<td style="text-align:right"><span class="glyphicon glyphicon-option-vertical mb" style="padding-top:10px;font-size:20px;visibility:hidden"></span></td>' +
                      '</tr>'
                  )
				var $menubox=$(".motor_maindiv").children('.menuBox')
				  $(".mb").click(function (e) {
                            var mbtoppos = $(this).position().top + (-13) + "px";
                            //console.log(mbtoppos);
                            if ($menubox.is(":visible")) {

                                $menubox.hide()
                                $menubox.slideDown();
                            }
                            $menubox.slideDown().css({ "top": mbtoppos });
                        });

						$(".ApplicantName,.si_amt,.quote_date").click(function (e) {
							var SRN =  $( this ).parent().parent().attr('srn');	
							var udid =  $( this ).parent().parent().attr('udid');								
                            window.location.href = './quotepage.html?SRN=' +SRN+'&client_id=2';

                        });
						$("#CallFuncId").click(function (e) {
							
							//$('a[href*="tel:+91"]' + data[i].Customer_Mobil);
							$(".CallFuncClass").attr('href', 'tel:' + data[i].Customer_Mobile);
						});
						
						$("#SmsFuncId").click(function (e) {
							//$('a[href*="tel:+91"]' + data[i].Customer_Mobil);
							$(".SmsFuncClass").attr('href', 'sms:' + data[i].Customer_Mobile);
						});
              }

          },
          error: function(result) {

          }
      });

  }

// '<td style="width:21%"><div class="ApplicantName" style="align:center">IDV</div> <div  class="IDV">' + data[i].Sum_Insured + ' </div> </td>' +
// '<td style="width:32%"><div class=""><div class="ApplicantName">Make & Model</div><div class="make_model">BAJAJ PULSAR 180 CC</div></div></td>' +  
  
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
  }

  function GetUrl() {
    var url = window.location.href;
    //alert(url.includes("health"));
    var newurl;
    //newurl = "http://qa-horizon.policyboss.com:3000";
    if (url.includes("request_file")) {
       //newurl = "http://qa-horizon.policyboss.com:3000";
       newurl = "http://localhost:3000";
	  
    } else if (url.includes("qa")) {
        newurl = "http://qa-horizon.policyboss.com:3000";
    } else if (url.includes("www") || url.includes("cloudfront")) {
        newurl = "http://horizon.policyboss.com:5000";
    }
    return newurl;
}
 

  function Redirect(input) {
      //
      if (input == "QUOTE") {
          $(".quoteList_container").show();
		  $(".searchbar").show();
          $(".appquote_list").hide();
      } else if (input == "APPLICATIONS") {
          $(".quoteList_container").hide();
		  $(".searchbar").hide();
          $(".appquote_list").show();
      }

  }

  // Get Application Data 
  function GetApplication() {
      var const_insurerlogo = {
          "21": "apollo_munich.png",
          "42": "aditya_birla.png",
          "9" : "Reliance_new.png",
          "34": "religare_health.png",
          "26": "star_health.png",
          "38": "Cigna.png",
          "33": "Liberty.png",
          "6" : "ICICI.png",
		  "12": "NewIndia.png",
		  "44": "digit.png",
		  "45": "Acko_General.png",
		  "19": "Universal.png",
		  "1" : "bajaj-allianz.png",
		  "4" : "Future.png",
		  "7" : "Iffco.png",
		  "10": "Royal.png",
		  "11": "TataAIG.png",
		  "5" : "HDFC.png",
		  "14"  :"United.png",
		  "2"	:"BharatiAxa.png",
		  "47"	:"edelweiss.png",
		  "41"	:"Kotak.png",
		  "35"	:"magma.png",
		  "13"	:"Oriental.png"
      };

      //var url = GetUrl()+"/user_datas/quicklist/10/APPLICATION/" + ss_id + "/" + fba_id + "/" + pageIndex + "/" + mobile_no
	  
	  var url;
	  if(appSearch_url==""){
		   url = GetUrl()+"/user_datas/quicklist/10/APPLICATION/" + ss_id + "/" + fba_id + "/" + pageIndex + "/" + mobile_no;
	  }else{
		  url=appSearch_url;
	  }

      $.ajax({
          type: "GET",
          url: url,
          dataType: "json",
          success: function(data) {
              console.log(data);
              for (var i in data) {
                  $(".app_mainlist").append("<div class='app_quoteDiv' id='app_quote_id'" + data[i].CRN + ">" + "<div class='ins_logo'>" + "<img src='./images/InsurerLogo/" + const_insurerlogo[data[i].Insurer] + "' class='img-responsive'>" + "</div>" + "<div class='content_container'>" + "<div class='con parta'>" + "<div class='uname'>" + data[i].Customer_Name + "</div>" + "<div class='menu'><span class='glyphicon glyphicon-option-vertical amb' style='visibility:hidden'></span>" + "</div>" + "</div>" + "<div class='con partb'>" + "<div class='app_num'>" + "<div class='title'>APP NUMBER</div>" + "<div class='num'>" + data[i].CRN + "</div>" + "</div>" + "<div class='app_status'>" + "<div class='title'>APP STATUS</div>" + "<div class='progress'>" + "<div class='progress-bar' role='progressbar' aria-valuenow='70' aria-valuemin='0' aria-valuemax='100' style='width:" + data[i].Progress + "%'>" + data[i].Progress + "</div>" + "</div>" + "</div>" + "</div>" + "<div class='con partc'>" + "<div class='SUM_a'>" + "<div class='title'>IDV</div>" + data[i].Sum_Insured + "</div>" + "<div class='a_date'>" + "<div class='title'>APP DATE</div>"+ data[i].Quote_Date_Mobile +"</div>" + "</div>" + "<input type='hidden' id='hd_app_SRN' value='" + data[i].SRN + "'/>" + "<input type='hidden' id='hd_app_Insurer' value='" + data[i].Insurer + "'/>" + "</div>" + "</div>");
                   $(".amb").click(function(e) {

                      var mbtoppos = $(this).position().top + "px";
                      //console.log(mbtoppos);
					  var $menubox=$(".appquote_list").children('.menuBox')
                      if ($menubox.is(":visible")) {

                          $menubox.hide()
                          $menubox.slideDown()
                      }
                      $menubox.slideDown().css({
                          "top": mbtoppos,
                          
                      });
                  });
                  

              }
          },
          error: function(result) {
              console.log(result)
          }
      });

  }

  function GetSellList() {
     
	  
	var const_insurerlogo = {
          "21": "apollo_munich.png",
          "42": "aditya_birla.png",
          "9" : "Reliance_new.png",
          "34": "religare_health.png",
          "26": "star_health.png",
          "38": "Cigna.png",
          "33": "Liberty.png",
          "6" : "ICICI.png",
		  "12": "NewIndia.png",
		  "44": "digit.png",
		  "45": "Acko_General.png",
		  "19": "Universal.png",
		  "1" : "bajaj-allianz.png",
		  "4" : "Future.png",
		  "7" : "Iffco.png",
		  "10": "Royal.png",
		  "11": "TataAIG.png",
		  "5" : "HDFC.png",
		  "14"  :"United.png",
		  "2"	:"BharatiAxa.png",
		  "47"	:"edelweiss.png",
		  "41"	:"Kotak.png",
		  "35"	:"magma.png",
		  "13"	:"Oriental.png"	  
		  
      };
	 
      //var url = GetUrl()+"/user_datas/quicklist/10/SELL/" + ss_id + "/" + fba_id + "/1/" + mobile_no
	 
	 var url;
	  if(sellSearch_url == ""){
		   url = GetUrl()+"/user_datas/quicklist/10/SELL/" + ss_id + "/" + fba_id + "/" + pageIndex + "/" + mobile_no;
	  }else{
		  url=sellSearch_url;
	  }

      $.ajax({
          type: "GET",
          url: url,
          dataType: "json",
          success: function(data) {
              console.log(data);
              for (var i in data) {
                  $(".sellDiv").append("<div class='app_quoteDiv' status='"+data[i].Last_Status+"' id='selldiv_id' CRN='"+ data[i].CRN + "'>" + "<div class='ins_logo'>" + "<img src='./images/InsurerLogo/" 
				  + const_insurerlogo[data[i].Insurer] + "' class='img-responsive'>" + "</div>" + "<div class='content_container'>" 
				  + "<div class='con parta' style='grid-template-columns: 1fr 100px !important;'>" 
				  + "<div class='uname'>" + data[i].Customer_Name + "</div>"
				  + "<div class='crossSell' onclick='showCrossSellFunc()'><button  id='cross_Sell'>Cross Sell</button></div>"
				  /* + "<div class='menu'><span class='glyphicon glyphicon-option-vertical amb' style='visibility:hidden'></span>" 
				  + "</div>" */ 
				  + "</div>" + "<div class='con partb'>" + "<div class='app_num'>" 
				  + "<div class='title'>APP NUMBER</div>" + "<div class='num'>" + data[i].CRN + "</div>" + "</div>" 
				  + "<div class='app_status'>" + "<div class='title'>APP STATUS</div>" + "<div class='progress'>" 
				  + "<div class='progress-bar' role='progressbar' aria-valuenow='70' aria-valuemin='0' aria-valuemax='100' style='width:"
				  + data[i].Progress + "%'>" + data[i].Progress + "</div>" + "</div>" + "</div>"
				  + "</div>" 
				  + "<div class='con1 partc'>" 
					+ "<div class='SUM_a'>"
						+ "<div class='title'>IDV</div>" 
							+ data[i].Sum_Insured 
						+ "</div>" 
					+ "<div class='a_date'>"
						+ "<div class='title'>APP DATE</div>"  
						+ data[i].Quote_Date_Mobile
					+ "</div>"
					+"<div class='downloadpolicy' id='div_downloadPolicy_"+i+"'>"
                       +"<div class='dwn_policy' pdflink='"+data[i].policy_url+"' id='download_policy'><i class='fa fa-download' aria-hidden='true'></i></div>"                      
                    +"</div>"
					+ "</div>" 
				 
				  + "<input type='hidden' id='hd_app_SRN' value='" + data[i].SRN + "'/>" + "<input type='hidden' id='hd_app_Insurer' value='" + data[i].Insurer + "'/>" + "</div>" + "</div>");             
				  
				  $('#download_policy').click(function(e){				
					  var fileUrl =  $(this).attr('pdflink');
					  var filename=	 $(this).parent().parent().parent().attr('CRN');
					  SaveToDisk(fileUrl, filename+"policy.pdf");
				  });

				  
				  var Status =  data[i].Last_Status;	
				  if(Status=="TRANS_SUCCESS_WITH_POLICY")
				  {
					  $('#div_downloadPolicy_'+i).show();
				  }else{
					  $('#div_downloadPolicy_'+i).hide();
				  }
                 
              }
          },
          error: function(result) {
              console.log(result)
          }
      });
	 

  }

  function showCrossSellFunc(){
        $('.crossSell_popup').show();
    }

    $(document).ready(function () {  
        $('.crossSell_popup').on('click', function(){
            $('.crossSell_popup').hide();
        })
    });
 
  
  var getUrlVars = function() {

      var vars = [],
          hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for (var i = 0; i < hashes.length; i++) {
          hash = hashes[i].split('=');
          vars.push(hash[0]);
          vars[hash[0]] = hash[1];
      }
      return vars;
  }



  function stringparam() {
      //
      ss_id = getUrlVars()["ss_id"];
      fba_id = getUrlVars()["fba_id"];
      ip_address = getUrlVars()["ip_address"];
      app_version = getUrlVars()["app_version"];
      mac_address = getUrlVars()["mac_address"];
      if (getUrlVars()["mobile_no"] == "" || getUrlVars()["mobile_no"] == undefined) {
          mobile_no = 0;
      } else {
          mobile_no = getUrlVars()["mobile_no"];
      }
      //// 
      if (fba_id == "" || fba_id == undefined || fba_id == "0" || ip_address == '' || ip_address == '0' || ip_address == undefined || app_version == "" || app_version == "0" || app_version == undefined || ss_id == "" || ss_id == undefined || ss_id == "0") {

          $(".motor_maindiv").hide();
          $(".warningmsg").show();
      } else if (app_version == 'FinPeace' && (mobile_no == "" || mobile_no == null || mobile_no == 0)) {
          $(".motor_maindiv").hide();
          $(".warningmsg").show();
      } else {

          $(".motor_maindiv").show();
          $(".warningmsg").hide();
      }
  }

  function AddQuote() {
    
	$('.divlist').show();
	$('#quotelist').hide();
	// if(app_version=="FinPeace"){
		// window.location.href = './tw-main-page.html?ss_id=' + ss_id + '&fba_id=' + fba_id + '&ip_address=' + ip_address + '&mac_address=' + mac_address + '&app_version=' + app_version +'&mobile_no='+ mobile_no;
	 // }
	 // else{
		 // window.location.href = './tw-main-page.html?ss_id=' + ss_id + '&fba_id=' + fba_id + '&ip_address=' + ip_address + '&mac_address=' + mac_address + '&app_version=' + app_version;
	 // }
  }

 

  $(window).scroll(function() {
      var iCurScrollPos = $(this).scrollTop();
      if (iCurScrollPos > iScrollPos) {
          //Scrolling Down
          if ($(window).scrollTop() == $(document).height() - $(window).height()) {
			  if(!isSearchCheck){
				   pageIndex++;
				 if (activeTab() == 'SEARCH'){
					 GetQuoteList();
				 }else if (activeTab() == 'APPLICATIONS'){
					 GetApplication();
				 }else if (activeTab() == 'SELL'){
					 GetSellList();
				 }				  
			  }              
          }
      }

  });

  function Reload() {
      location.reload(true)
  };

  function myFunction1() {
      var input, filter, table, tr, td, i, txtValue;
      input = document.getElementById("myInput");
      filter = input.value.toUpperCase();
      table = document.getElementById("tbl_quote_list");
      tr = table.getElementsByTagName("tr");
      for (i = 0; i < tr.length; i++) {
          td = tr[i].getElementsByTagName("td")[0];
          if (td) {
              txtValue = td.textContent || td.innerText;
              if (txtValue.toUpperCase().indexOf(filter) > -1) {
                  tr[i].style.display = "";
              } else {
                  tr[i].style.display = "none";
              }
          }
      }
  }
  function myFunction(){
	 //
	  var searchOption = $("#SearchQuote").val();
	  var input = document.getElementById("myInput").value;
	  var valuelength;
	  valuelength =document.getElementById("myInput").value.length;
	 
	  if((searchOption=="CRN" && valuelength=="6")||(searchOption=="Name" && valuelength >=3))
	  {
		 isSearchCheck=true;
	  }
	  
	  if(valuelength==0){
		  Reset();
	  }
	  
	 if(isSearchCheck){		
		var type=activeTab();				
        switch (type) {
			
				case 'SEARCH':
					$('#tbl_quote_list').empty();
					quoteSearch_url = GetUrl()+"/user_datas/search/10/"+type+"/" + ss_id + "/" + fba_id + "/"+searchOption+"/"+input+ "/" + mobile_no;
					GetQuoteList();
					break;
				case 'APPLICATION': 
				
					$('.app_mainlist').empty();
					appSearch_url = GetUrl()+"/user_datas/search/10/"+type+"/" + ss_id + "/" + fba_id + "/"+searchOption+"/"+input+ "/" + mobile_no;
					GetApplication();
					break;
				case 'SELL':  
					$('.sellDiv').empty();
					sellSearch_url = GetUrl()+"/user_datas/search/10/"+type+"/" + ss_id + "/" + fba_id + "/"+searchOption+"/"+input+ "/" + mobile_no;
					GetSellList();				
					break;
			}
	  }
  }
     function SearchQuote() {
        if ($("#SearchQuote").val() != 0) {
            $("#SearchQuoteInput").show();
			$('#myInput').val('');
            var option = $("#SearchQuote").val();
            switch (option) {
                case 'Name':
                    $('#myInput').attr('placeholder', 'Name');
                    break;
                case 'CRN':
                    $('#myInput').attr('placeholder', 'CRN');
                    break;
                case 'RegNo':
                    $('#myInput').attr('placeholder', 'Registration Number');
                    break;
            }
        }
        else {$("#SearchQuoteInput").hide();}
               
    }
	
	  function SaveToDisk(fileURL, fileName) {
    // for non-IE
    if (!window.ActiveXObject) {
        var save = document.createElement('a');
        save.href = fileURL;
        save.target = '_blank';
        save.download = fileName || fileURL;
        var evt = document.createEvent('MouseEvents');
        evt.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0,
            false, false, false, false, 0, null);
        save.dispatchEvent(evt);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    }

    // for IE
    else if ( !! window.ActiveXObject && document.execCommand)     {
        var _window = window.open(fileURL, "_blank");
        _window.document.close();
        _window.document.execCommand('SaveAs', true, fileName || fileURL)
        _window.close();
    }
}