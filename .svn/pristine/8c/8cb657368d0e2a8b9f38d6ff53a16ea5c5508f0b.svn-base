var ss_id, udid, crn, merchant_id, premiumAmount = 0, wallet_acc_ammount = 0, wallet_total_trf_amount = 0, daily_limit_amount = 0, wallet_otp_number = 0;
var proposal_request, insurer_id, proposal_id, customer_mobile_no, customer_email_id;
var wallet_history = [];
function getBalanceDetails(session_data, user_data_response) {
    ss_id = session_data["agent_id"];
    udid = user_data_response["User_Data_Id"];
	crn = user_data_response["PB_CRN"];
	proposal_request = user_data_response['Proposal_Request_Core'];
	insurer_id = proposal_request['insurer_id'];
	proposal_id = proposal_request['proposal_id'];
	customer_mobile_no = proposal_request['mobile'];
	customer_email_id = proposal_request['email'];
	premiumAmount = ([7582, 8067, 819].indexOf(ss_id) > -1) ? 1 : Math.round(proposal_request['final_premium']);
    $.ajax({
        type: "GET",
        url: GetUrl() + '/wallets/rzp_getAccountDetail/' + ss_id,
        success: function (response) {
            res = response.replace("<pre>", "");
            res = res.replace("</pre>", "");
            res = JSON.parse(res);
            console.log(res);
            if (res.hasOwnProperty('wallet_amount')) {
                console.log(res.wallet_amount);
                $("#balance").text(res.wallet_amount);
				daily_limit_amount = res.daily_limit ? res.daily_limit : 50000;
				$("#daily_limit").val(daily_limit_amount);
				wallet_acc_ammount = res.wallet_amount;
				wallet_otp_number = res.wallet_otp_number ? res.wallet_otp_number : res.agent_mobile;
				var txt_otp_number = wallet_otp_number.replace(/\d(?=\d{4})/g, "*");
				$(".txt_otp_number").html("<span style='color:red;'>Note : </span>OTP will be send to " + txt_otp_number);
                merchant_id = res.Merchant_Id;
				$.ajax({
					type: "GET",
					url: GetUrl() + "/wallets/rzp_wallet_histories/" + merchant_id,
					success: function (data) {
						//console.log(JSON.stringify(data));
						if (data['msg'] === "success") {
							wallet_total_trf_amount = 0;
							if (data.hasOwnProperty('rzp_wallet_history') && data.rzp_wallet_history.length > 0) {
								wallet_history = data.rzp_wallet_history;
								wallet_history.forEach(wallet_data => {
									wallet_total_trf_amount += wallet_data.transaction_amount;
								});
							}
							$("#trf_amount").val(wallet_total_trf_amount);
							var avil_daily_limit_amount = (daily_limit_amount - wallet_total_trf_amount);
							$("#available_daily_limit").val(avil_daily_limit_amount);
							if (wallet_total_trf_amount > daily_limit_amount) {
								$("#available_daily_limit").val(0);	
								$(".proceed").hide();
								$(".error_message_popup").show();
								$(".error_msg").html("<p style='text-align:center;font-weight:700'>Your payment could not be processed. Due to daily limit exceeded</p>");
							} else {
								if (parseInt(wallet_acc_ammount) >= parseInt(premiumAmount)) {
									if(parseInt(avil_daily_limit_amount) >= parseInt(premiumAmount)) {
										generateOTP();
										var customerName = proposal_request['middle_name'] === "" ? (proposal_request['first_name'] + " " + proposal_request['last_name']) : (proposal_request['first_name'] + " " + proposal_request['middle_name'] + " " + proposal_request['last_name']);
										if (proposal_request["product_id"] === "1") {
											productName = "Car";
										} else if (proposal_request["product_id"] === "10") {
											productName = "Bike";
										} else if (proposal_request["product_id"] === "12") {
											productName = "CV";
										} else {
											productName = "Health";
										}
										$("#username").val(customerName);
										$("#crn").val(crn);
										$("#product").val(productName);
										$("#amount").val(premiumAmount);
									//if (parseInt(wallet_acc_ammount) > parseInt(premiumAmount)) {
										$(".proceed").show();
									} else {
										if((parseInt(wallet_acc_ammount)) > 0) {
											$("#available_daily_limit").val(avil_daily_limit_amount);
										} else {
											$("#available_daily_limit").val(0);
										}
										$(".proceed").hide();
										$(".error_message_popup").show();
										$(".error_msg").html("<p style='text-align:center;font-weight:700'>Your today's limit for payment is exceeded. Please try again tomorrow.</p>");
									}
								} else {
									if((parseInt(wallet_acc_ammount)) > 0) {
										$("#available_daily_limit").val(avil_daily_limit_amount);
									} else {
										$("#available_daily_limit").val(0);
									}
									$(".proceed").hide();
									$(".error_message_popup").show();
									$(".error_msg").html("<p style='text-align:center;font-weight:700'>Your payment could not be completed due to insufficient wallet balance. Please recharger your wallet account</p>");
								} 
							}
						} else {
							$(".proceed").hide();
							$(".error_message_popup").show();
							$(".error_msg").html("<p style='text-align:center;font-weight:700'>No data available by Customer ID</p>");
						}
					},
					error: function (result) {
						console.log(result);
					}
				});
            } else {
                //console.log('Not enough balance');
				$(".proceed").hide();
				$(".error_message_popup").show();
				$(".error_msg").html("<p style='text-align:center;font-weight:700'>Your payment could not be completed due to insufficient wallet balance. Please recharger your wallet account</p>");
            }
        },
        error: function (result) {
            console.log(result);
        }
    });
}

var getUrlVars = function () {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
};
function GetUrl() {
    var url = window.location.href;
    var newurl;
    if (url.includes("request_file")) {
        newurl = "http://localhost:3000";
    } else if (url.includes("qa.")) {
        newurl = url.includes('https') ? "https://qa-horizon.policyboss.com:3443" : "http://qa-horizon.policyboss.com:3000";
    } else if (url.includes("www.") || url.includes("cloudfront") || url.includes("origin-cdnh") || url.includes("policyboss")) {
        newurl = url.includes('https') ? "https://horizon.policyboss.com:5443" : "http://horizon.policyboss.com:5000";
    }
    return newurl;
}
function submitForm() {
	$.ajax({
    type: "GET",
    url: GetUrl() + "/wallets/rzp_order/" + udid + "/" + ss_id + "/" + premiumAmount + "/" + insurer_id + "/" + crn + "/" + proposal_id,
    success: function (res) {
        console.log(JSON.stringify(res));
			if (res['Msg'] !== "Fail") {
				var transfer_id = "";
				if (res.Response.hasOwnProperty('transfers')) {
					transfer_id = res.Response.transfers[0]['id'];
				}
				submitPayment(res.Customer_Id, res.Response.id, res.Response.amount, res.User_Data_Id, transfer_id);
			}
		},
		error: function (result) {
			console.log(result);
		}
	});
}
function cancelForm(udid) {
	$.ajax({
        type: "GET",
        url: GetUrl() + "/user_datas/view/" + udid,
        success: function (res) {
            console.log(JSON.stringify(res));
            if (res.length > 0) {
				window.location.href = res[0]['Proposal_Request_Core'].proposal_url;
            } else {
				console.log("No Data Found");
			}
        },
        error: function (result) {
            console.log(result);
        }
    });
}
function submitPayment(cust_id, order_id, amount, udid, transfers_id) {
    $.ajax({
        type: "GET",
        url: GetUrl() + '/wallets/rzp_payment/' + cust_id + '/' + order_id + '/' + amount + '/' + udid + '/' + transfers_id + '/' + customer_mobile_no + '/' + customer_email_id,
        success: function (res) {
            console.log(JSON.stringify(res));
            if (res.pg_post['status'] !== "Fail") {
                var form = $('<form action="' + res.pg_url + '" method="post" style="display:none;">' +
                        '<input type="text" name="status" value="' + res.pg_post.status + '" />' +
                        '<input type="text" name="amount" value="' + res.pg_post.amount + '" />' +
                        '<input type="text" name="order_id" value="' + res.pg_post.razorpay_order_id + '" />' +
                        '<input type="text" name="txnid" value="' + res.pg_post.razorpay_payment_id + '" />' +
                        '<input type="text" name="hash" value="' + res.pg_post.razorpay_signature + '" />' +
						'<input type="text" name="transfer_id" value="' + res.pg_post.razorpay_transfer_id + '" />' +
                        '</form>');
                $('body').append(form);
            } else {
                var form = $('<form action="' + res.pg_url + '" method="post" style="display:none;">' +
                        '<input type="text" name="status" value="' + res.pg_post.status + '" />' +
                        '<input type="text" name="amount" value="' + res.pg_post.amount + '" />' +
                        '<input type="text" name="txnid" value="' + res.pg_post.txn_id + '" />' +
						'<input type="text" name="order_id" value="' + res.pg_post.order_id + '" />' +
                        '</form>');
                $('body').append(form);
            }
            form.submit();
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function generateOTP() {
    $.ajax({
		type: "GET",
		url: GetUrl() + '/generateOTP/' + wallet_otp_number + '/wallet',
		success: function (res) {
			console.log("Generate OTP" + JSON.stringify(res));
		},
		error: function (err) {
			console.log(err);
		}
	});
}
function resendOTP() {
    $.ajax({
		type: "GET",
		url: GetUrl() + '/resendOTP/' + wallet_otp_number + '/wallet',
		success: function (res) {
			console.log("Resend OTP" + JSON.stringify(res));
		},
		error: function (err) {
			console.log(err);
		}
	});
}
function verifyOTP() {
    var otp = $("#otp").val();
	$.ajax({
		type: "GET",
		url: GetUrl() + '/verifyOTP/' + otp,
		success: function (res) {
			if (res['Msg'] == 'Success') {
				$('#otp').removeClass("error_border");
				$("#loader").show();
				submitForm();
			} else {
				$("#otp").addClass("error_border");
				$(".span_otp_err").show().text("Please enter valid OTP");
				$(".resend").show().text("Re-send");
			}
		},
		error: function (err) {
			console.log(err);
		}
	});
}
function forceNumeric(e) {
    e.target.value = e.target.value.replace(/[^\d]/g, '');
    return false;
}
function verify(){
	verifyOTP();
}
function resend(){
	resendOTP();
}