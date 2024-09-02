var device_type;
var agentName;
$(document).ready(function () {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        device_type = "mobile";
    } else {
        device_type = "desktop";
    }
    horizon_get_session()
})
function horizon_get_session() {
    $.ajax({
        type: "GET",
        url: getWebsiteUrl() + "/get-session",
        success: function (data) {
            if (data && data.hasOwnProperty('user')) {
                ss_id = (data.user && data.user.hasOwnProperty('ss_id')) ? data.user.ss_id : 0;
                fba_id = (data.user && data.user.hasOwnProperty('fba_id')) ? data.user.fba_id : 0;
                $('#profileAgentName').html(data['user']['fullname'] ? data['user']['fullname'] : '');
                $('#profileAgentSsid').html(ss_id);
                $('#profileErp_id').html(data['user']['erp_id'] ? data['user']['erp_id'] : '');
                $('#profileAgent_rm_name').html(data['user']['website_session']['agent_rm_name'] ? data['user']['website_session']['agent_rm_name'] : '');
                $('#profileAgentMobile').html(data['user']['mobile'] ? data['user']['mobile']: '');
                //$('#profileAgentDOB').html(data['user']['dob']);
                $('#profileAgentEmail').html(data['user']['email'] ? data['user']['email'] : '');
                $('#profileAgentCity').html(data['user']['website_session']['agent_city'] ? data['user']['website_session']['agent_city'] : '');
                if (ss_id !== 0) {
					get_Merchant_Id();
                    /* start for header */
                    var agentNameDeskMob;
                    if (device_type === "mobile") {
                        agentNameDeskMob = data['user']['fullname'].split(" ")[0];
                    } else {
                        agentNameDeskMob = data['user']['fullname'];

                    }
                    $('.agentNameDeskMob').html(agentNameDeskMob);
                    $('#login').attr('href', 'javascript:return false;');
                    $('#login').attr('onclick', 'javascript:return false;');
                    $('a[title="Login"]').attr('href', 'https://horizon.policyboss.com/sign-out');
                    $('li[title="Term Insurance"]').attr('onclick', "window.open('https://term.policyboss.com/term-insurance','_self');");
                    $('.agentName').html(agentNameDeskMob);
                    $('.agentSsid').html('SS_ID : ' + ss_id);
                    //$('.agentUid').html('ERP_Code : ' + UID);
                    $('.loginButton').hide();
                    $('.profileDropdown').show();
                    /* end for header */
                } else {
                    /* start for header */
                    $('.loginButton').show();
                    $('.profileDropdown').hide();
                    $('.agentNameDeskMob').html('Login');
                    $('.agentSsid').html('');
                    $('.agentUid').html('');
                    $('a[title="Login"]').attr('href', 'https://horizon.policyboss.com/sign-in?ref_login=' + window.location.href);
                    $(".term-insurance-visible").hide();
                    $('.profile-popup').remove();
                    /* end for header */
                }
            }

        },
        error: function (err) {
            /* start for header */
            $('.loginButton').show();
            $('.profileDropdown').hide();
            $('.agentNameDeskMob').html('Login');
            $('.agentSsid').html('');
            $('.agentUid').html('');
            /* end for header */
        }
    });
}
function get_Merchant_Id() {
    if (ss_id && ss_id !== 0) {
        $.ajax({
            type: "GET",
            url: GetUrl() + "/wallets/getMerchantId/" + ss_id,
            dataType: "json",
            success: function (MerchantData) {
                console.log(MerchantData);
                if (MerchantData.length > 0) {
					$("#profile_account").html(MerchantData[0].bank_account_no ? MerchantData[0].bank_account_no : '');
					$("#profile_bank").html(MerchantData[0].virtual_acnt_response.receivers[0].bank_name ? MerchantData[0].virtual_acnt_response.receivers[0].bank_name : '');
					$("#profile_ifsc").html(MerchantData[0].ifsc ? MerchantData[0].ifsc : '');
				}
            },
            error: function (err) {
				console.log(err);
			}
        });
    }
}
