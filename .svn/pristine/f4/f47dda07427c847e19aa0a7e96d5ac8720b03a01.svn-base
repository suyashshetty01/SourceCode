var config = require('config');
var mongoose = require('mongoose');
var Base = require('../libs/Base');
var path = require('path');
var fs = require('fs');
var pdf = require('html-pdf');
//const date = require('date-and-time');
var moment = require('moment');
var appRoot = path.dirname(path.dirname(require.main.filename));
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database
module.exports.controller = function (app) {
    app.post('/finmart_quotes_share', function (req, res) {
        //res.send(req.body);
        var fileshare = appRoot + "/resource/request_file/Finmart/TW_Web/Quote_Share.html";
        var formatted = moment(new Date()).format('DD-MM-YYYYh:mm:ss');
        var datetime = formatted.replace(/-/g, "");
        datetime = datetime.replace(/:/g, "");
        const now = new Date();
        var quotedate = moment(new Date()).format('YYYY-MM-DD');
        var pdf_file_path_policy = appRoot + '/tmp/fm_quoteshare/' + req.body.PB_CRN + '_' + req.body.product_id + '_' + datetime + '.pdf';
        var sharePdfLink = config.environment.weburl + '/tmp/fm_quoteshare/' + req.body.PB_CRN + '_' + req.body.product_id + '_' + datetime + '.pdf';
        var HTML_pdf_file_path_policy = appRoot + '/tmp/fm_quoteshare/' + req.body.PB_CRN + '_' + req.body.product_id + '_' + datetime + '.html';
        //var html = fs.readFileSync('./resource/request_file/Finmart/TW_Web/Quote_Share.html', 'utf8');     //local path
        var html = fs.readFileSync(fileshare, 'utf8');                             //Qa path
        var options = {format: 'Letter'};
        var share_div = "";
        req.body = JSON.parse(JSON.stringify(req.body));
        var objresposne = req.body;
        var quotes = JSON.parse(objresposne['quotes']);
        var data_response = quotes;
        var with_addons_checked = req.body.with_addons_checked;
        var addon_list_labels = JSON.parse(req.body.addon_list_labels);

        var custom_add_on = req.body.custom_add_on !== undefined ? JSON.parse(objresposne['custom_add_on']) : "";
        var premium_amount = parseInt(0);
        var responseData = '';
        for (var key in data_response) {
            responseData = data_response[key];
            if (with_addons_checked === "checked" && responseData.hasOwnProperty("Addon_List")) {
                if (Object.keys(responseData.Addon_List).length > 0) {

                    premium_amount = parseInt(responseData.Premium_Breakup.net_premium);

                    for (var key in responseData.Addon_List) {
                        if (custom_add_on.includes(key)) {
                            premium_amount += parseInt(responseData.Addon_List[key]);
                        }
                    }

                    gst = premium_amount * 0.18;
                    premium_amount = parseFloat(premium_amount) + parseFloat(gst);
                } else {
                    premium_amount = responseData.Premium_Breakup.final_premium;
                }
            } else {
                premium_amount = responseData.Premium_Breakup.final_premium;
            }


            share_div += '<div>'
                    + '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #c9c9c9">'
                    + '<tr>'
                    + '<td style="text-align:left;width:140px;">'
                    + '<img src="https://www.policyboss.com/Images/insurer_logo/' + responseData.Insurer.Insurer_Logo_Name + '" style="width:110px">'
                    + '</td>'
                    + '<td style="text-align:center;">'
                    + '<div>IDV</div>'
                    + '<div id="IDVDisplayShare"><i class="fa fa-rupee"></i> ' + responseData.LM_Custom_Request.vehicle_expected_idv + '</div>'
                    + '</td>'
                    + '<td>'
                    + '<div>PREMIUM</div>'
                    + '<div class="btnWrap">'
                    + '<div class="buybtn"><i class="fa fa-rupee"></i> ' + Math.ceil(premium_amount) + '</div>'
                    + '</div>'
                    + '</td>'
                    + '</tr></table>';

            if (with_addons_checked === "checked" && responseData.hasOwnProperty("Addon_List")) {
                if (Object.keys(responseData.Addon_List).length > 0) {

                    share_div += '<table style="width:100%;margin-top:-2px;"><tr style="display: grid;grid-template-columns: 1fr 1fr;background-color:#ededed;text-align:left;"><div style="display: grid;grid-template-columns: 1fr 1fr;background-color:#ededed;text-align:left;">';
                    for (var key in responseData.Addon_List) {
                        if (custom_add_on.includes(key)) {
                            share_div += '<div style="padding:5px;">' + addon_list_labels[key] + ' <i class="fa fa-rupee"></i> ' + responseData.Addon_List[key] + '</div>';
                        }
                    }
                    share_div += '</div></tr></table>';
                }
            }

            share_div += '</div><br><br>';
            premium_amount = parseInt(0);
        }

        var replacedata = {
            '___Name___': req.body.Name,
            '___CRN___': req.body.PB_CRN,
            '___PolicyExpDate___': req.body.policy_expiry_date,
            '___PresentNCB___': req.body.NCB,
            '___ClaiminPresentYear___': req.body.is_claim_exists,
            '___POSPName___': req.body.Pospname,
            '___98XXXXXXXXX___': req.body.posp_mobile_no,
            '___XXXXXX@finmart.com___': req.body.posp_email_id,
            '___share_div___': share_div
        };
        html = html.toString().replaceJson(replacedata);
        //console.log(html);
        var options = {
            format: 'A4',
            timeout: 50000
        };

        pdf.create(html, options).toFile(pdf_file_path_policy, function (err, result) {
            if (err)
                res.json({"Status": "Error", "Htmldata": "", "Url": ""});
            else {
                //res.send(sharePdfLink);
                res.json({"Status": "Success", "Htmldata": html, "Url": sharePdfLink});
            }
        });
    });
	app.post('/compare_quotes_pdf', function (req, res) {
		 var fileshare = appRoot + "/resource/request_file/compare_quote.html";
        var formatted = moment(new Date()).format('DD-MM-YYYYh:mm:ss');
        var datetime = formatted.replace(/-/g, "");
        datetime = datetime.replace(/:/g, "");
        const now = new Date();
        var quotedate = moment(new Date()).format('YYYY-MM-DD');
        var pdf_file_path_policy = appRoot + '/tmp/fm_quoteshare/' + req.body.PB_CRN + '_' + req.body.product_id + '_' + datetime + '.pdf';
        var sharePdfLink = config.environment.weburl + '/tmp/fm_quoteshare/' + req.body.PB_CRN + '_' + req.body.product_id + '_' + datetime + '.pdf';
        var HTML_pdf_file_path_policy = appRoot + '/tmp/fm_quoteshare/' + req.body.PB_CRN + '_' + req.body.product_id + '_' + datetime + '.html';
        //var html = fs.readFileSync('./resource/request_file/Finmart/TW_Web/Quote_Share.html', 'utf8');     //local path
        var html = fs.readFileSync(fileshare, 'utf8'); 
	});
};
