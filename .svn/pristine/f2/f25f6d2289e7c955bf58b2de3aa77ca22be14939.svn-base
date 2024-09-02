SetInsurerData(id,qrCodeData)
{
    switch(id) {
        case 41:
            setKotakJsonData(qrCodeData);
            break;
        case 35:
            setMagmahdiJsonData(qrCodeData);
            break;
        case 13:
            setOrientalJsonData(qrCodeData);
            break;
        case 5:
            setHdfcergoJsonData(qrCodeData);
            break;
        case 17:
            setSbiJsonData(qrCodeData);
            break;
        case 1:
            setBajajAllianzJsonData(qrCodeData);
            break;
        case 9:
            setRelianceJsonData(qrCodeData);
                break;
        case 2:
            setBhartiJsonData(qrCodeData);
                break;
        case 12:
            setNewindiaJsonData(qrCodeData);
            break;
        case 33:
            setLibertyvideoconJsonData(qrCodeData);
            break;
        case 11:
            setTataaigJsonData(qrCodeData);
            break;
        case 19:
            setUniversalSompoJsonData(qrCodeData);
            break;
        case 4:
            setFuturegeneraliJsonData(qrCodeData);
            break;
        case 10:
            setRoyalSundaramJsonData(qrCodeData);
            break;
        case 6:
            setIcicilombardJsonData(qrCodeData);
            break;
    }
    function setKotakJsonData(qrCodeData)
    {
        var string =qrCodeData;
        //var string = 'Policy Number: 1023066900 Registration Number: DL08CAL6660 Chassis Number: MALA851CLFM396468 Policy Start Date: 12/01/2018 00:00 Policy End Date: 11/01/2019 Midnight';
        var insurerKey = ['Policy Number','Registration Number','Chassis Number','Policy Start Date','Policy End Date'];
        var newString = string.split(/:(?!\d\d)/);
        var insurerKeyRepl = [];
        var output = [];

        var final="{";
        for(var i in newString)
        {
            if ((newString[i].indexOf(insurerKey[i]))>-1)
            {
                insurerKeyRepl[i]=insurerKey[i]+":"+newString[parseInt(i)+1].replace(insurerKey[parseInt(i)+1],'');
            }
        }
        for(var i in insurerKeyRepl)
        {
            output =insurerKeyRepl[i].split(":");
            final =final+"\""+output[0].trim()+"\""+":"+"\""+output[1].trim()+"\"";
            if(i!=insurerKeyRepl.length-1){final=final+",";}
            if(i==insurerKeyRepl.length-1){final=final+"}";}
        }
        var jsonString = JSON.parse(final);
        var RegistrationNumber = [];
        if(jsonString["Registration Number"].length===9 || jsonString["Registration Number"].length===10)
        {
            RegistrationNumber = jsonString["Registration Number"].match(/[a-z]+|[^a-z]+/gi); 
        }
        if(jsonString["Registration Number"].length===11)
        {
            RegistrationNumber = jsonString["Registration Number"].match(/[a-z]+|[^a-z]+/gi);
            //var temp = RegistrationNumber[2][0];
            var temp1 = RegistrationNumber[2][1]+RegistrationNumber[2][2];

            RegistrationNumber[0] = RegistrationNumber[0];
            RegistrationNumber[1] = RegistrationNumber[1];
            RegistrationNumber[2] = RegistrationNumber[2].replace(RegistrationNumber[2],temp1)
            RegistrationNumber[3] = RegistrationNumber[3];
        }
        var RequiredObj = JSON.parse('{"ContactName":"","ContactMiddleName":"","ContactLastName":"","RegistrationNumberPart1":"","RegistrationNumberPart1A":"","RegistrationNumberPart2":"","RegistrationNumberPart3":"","EngineNumber":"","ChasisNumber":"","PolicyNumber":""}');
        for(var i in RequiredObj)
        {
            RequiredObj["PolicyNumber"]= jsonString["Policy Number"];
            RequiredObj["ChasisNumber"]= jsonString["Chassis Number"];
            RequiredObj["RegistrationNumberPart1"]= RegistrationNumber[0];
            RequiredObj["RegistrationNumberPart1A"]= RegistrationNumber[1];
            RequiredObj["RegistrationNumberPart2"]= RegistrationNumber[2];
            RequiredObj["RegistrationNumberPart3"]= RegistrationNumber[3];
        }
        $("#PolicyNumber").val(["Policy Number"]);
        $("#ChasisNumber").val(["Chassis Number"]);
        $("#RegistrationNumberPart1").val(["Registration Number"]);
        console.log(RequiredObj);
        return RequiredObj;
    }
    function setMagmahdiJsonData(qrCodeData)
    {
        var string =qrCodeData;
        //var Mystring = "Insurance Company:Magma_Hdi_Gic_Ltd;Web:www.magma-hdi.co.in;Policy No:P0018200002/4101/100500;Insured: Mr ARNAV AMAR PATRA;Policy_Period: 05/03/2018-04/03/2019;Registration No.: MH02CH7673;Engine No.:L15A73204679;Chassis No.:MAKGM266BCN300632";
        var NewString = Mystring.split(";")
		
        var final = "";
        for (i = 0; i < NewString.length; i++) {
            if (i == 0) { final = "{"; }
            var b = NewString[i].split(":")
            final = final + "\"" + b[0] + "\"" + ":" + "\"" + b[1] + "\"";
            if (i != NewString.length - 1) { final = final + ","; }
            if (i == NewString.length - 1) {
                final = final + "}";
            }
        }
		
        var jsonString = JSON.parse(final);
        var RegistrationNumber = [];
        if(jsonString["Registration No."].length===9 || jsonString["Registration No."].length===10)
        {
            RegistrationNumber = jsonString["Registration No."].match(/[a-z]+|[^a-z]+/gi); 
        }
        if(jsonString["Registration No."].length===11)
        {
            RegistrationNumber = jsonString["Registration No."].match(/[a-z]+|[^a-z]+/gi);
            //var temp = RegistrationNumber[2][0];
            var temp1 = RegistrationNumber[2][1]+RegistrationNumber[2][2];

            RegistrationNumber[0] = RegistrationNumber[0];
            RegistrationNumber[1] = RegistrationNumber[1];
            RegistrationNumber[2] = RegistrationNumber[2].replace(RegistrationNumber[2],temp1)
            RegistrationNumber[3] = RegistrationNumber[3];
        }
        var fullName=jsonString["Insured"].trim().split(" ");
        var RequiredObj = JSON.parse('{"ContactName":"","ContactMiddleName":"","ContactLastName":"","RegistrationNumberPart1":"","RegistrationNumberPart1A":"","RegistrationNumberPart2":"","RegistrationNumberPart3":"","EngineNumber":"","ChasisNumber":"","PolicyNumber":""}');

        RequiredObj["ContactName"]= fullName[1];
        RequiredObj["ContactMiddleName"]= fullName[2];
        RequiredObj["ContactLastName"]= fullName[3];
        RequiredObj["PolicyNumber"]= jsonString["Policy No"];
        RequiredObj["ChasisNumber"]= jsonString["Chassis No."];
        RequiredObj["RegistrationNumberPart1"]= RegistrationNumber[0];
        RequiredObj["RegistrationNumberPart1A"]= RegistrationNumber[1];
        RequiredObj["RegistrationNumberPart2"]= RegistrationNumber[2];
        RequiredObj["RegistrationNumberPart3"]= RegistrationNumber[3];
        RequiredObj["EngineNumber"]= jsonString["Engine No."];

        $("#ContactName").val(fullName[1]);
        $("#ContactMiddleName").val(fullName[2]);
        $("#ContactLastName").val(fullName[3]);
        $("#PolicyNumber").val(jsonString["Policy No"]);
        $("#ChasisNumber").val(jsonString["Chassis No."]);
        $("#RegistrationNumberPart1").val(jsonString["Registration No."]);
        $("#EngineNumber").val(jsonString["Engine No."]);

        console.log(RequiredObj);
        return RequiredObj;
    }
    function setHdfcergoJsonData(qrCodeData)
    {
        var string =qrCodeData;
        //var string = "https://netinsure.hdfcergo.com/mOnlineProducts/mIPO/Renew/PolicySummary.aspx?PolicyNo=2311201891689000000"; 
        var PolicyNo = string.split("=");
        var RequiredObj = JSON.parse('{"ContactName":"","ContactMiddleName":"","ContactLastName":"","RegistrationNumberPart1":"","RegistrationNumberPart1A":"","RegistrationNumberPart2":"","RegistrationNumberPart3":"","EngineNumber":"","ChasisNumber":"","PolicyNumber":""}');

        RequiredObj["PolicyNumber"]= PolicyNo[1];
        console.log(RequiredObj);
        return RequiredObj;
    }
    function setOrientalJsonData(qrCodeData)
    {
        //var string =qrCodeData;
        var string = 'Policy Number: 124501/31/2018/856 Policy Type: PRIVATE CAR - PACKAGE POLICY From Date: 24-JAN-18 To Date: 22-JAN-19 Customer Name: 84140011 - SURENDRA SINGH SAJWAN Model: Wagon R LXi Regn No: UP30M6810 Engine No: 703392 Chassis No: 878547 CC: 1061 URL: http://www.orientalinsurance.org.in/web/guest/policy-download?isSelected=policyDownload&isRefresh=true';
        var insurerKey = ['Policy Number','Policy Type','From Date','To Date','Customer Name','Model','Regn No','Engine No','Chassis No','CC','URL'];
        var newString = string.split(":");
        console.log(newString);
        var insurerKeyRepl = [];
        var output = [];

        var final="{";
        for(var i in newString)
        {
            if ((newString[i].indexOf(insurerKey[i]))>-1)
            {
                insurerKeyRepl[i]=insurerKey[i]+":"+newString[parseInt(i)+1].replace(insurerKey[parseInt(i)+1],'');
            }
        }
        console.log(insurerKeyRepl);
        for(var i in insurerKeyRepl)
        {
            output =insurerKeyRepl[i].split(":");
            final =final+"\""+output[0].trim()+"\""+":"+"\""+output[1].trim()+"\"";
            if(i!=insurerKeyRepl.length-1){final=final+",";}
            if(i==insurerKeyRepl.length-1){final=final+"}";}
        }
        var jsonString = JSON.parse(final);
        var fullName = jsonString['Customer Name'].split(" ");
        var RegistrationNumber = [];
        if(jsonString["Regn No"].length===9 || jsonString["Regn No"].length===10)
        {
            RegistrationNumber = jsonString["Regn No"].match(/[a-z]+|[^a-z]+/gi); 
        }
        if(jsonString["Regn No"].length===11)
        {
            RegistrationNumber = jsonString["Regn No"].match(/[a-z]+|[^a-z]+/gi);
            //var temp = RegistrationNumber[2][0];
            var temp1 = RegistrationNumber[2][1]+RegistrationNumber[2][2];

            RegistrationNumber[0] = RegistrationNumber[0];
            RegistrationNumber[1] = RegistrationNumber[1];
            RegistrationNumber[2] = RegistrationNumber[2].replace(RegistrationNumber[2],temp1)
            RegistrationNumber[3] = RegistrationNumber[3];
        }
        var RequiredObj = JSON.parse('{"ContactName":"","ContactMiddleName":"","ContactLastName":"","RegistrationNumberPart1":"","RegistrationNumberPart1A":"","RegistrationNumberPart2":"","RegistrationNumberPart3":"","EngineNumber":"","ChasisNumber":"","PolicyNumber":""}');
        RequiredObj["ContactName"]= fullName[2];
        RequiredObj["ContactMiddleName"]= fullName[3];
        RequiredObj["ContactLastName"]= fullName[4];
        RequiredObj["PolicyNumber"]= jsonString["Policy Number"];
        RequiredObj["EngineNumber"]= jsonString["Engine No"];
        RequiredObj["ChasisNumber"]= jsonString["Chassis No"];
        RequiredObj["RegistrationNumberPart1"]= RegistrationNumber[0];
        RequiredObj["RegistrationNumberPart1A"]= RegistrationNumber[1];
        RequiredObj["RegistrationNumberPart2"]= RegistrationNumber[2];
        RequiredObj["RegistrationNumberPart3"]= RegistrationNumber[3];
        $("#ContactName").val(fullName[2]);
        $("#ContactMiddleName").val(fullName[3]);
        $("#ContactLastName").val(fullName[4]);
        $("#ContactLastName").val(jsonString["Policy Number"]);
        $("#ContactLastName").val(jsonString["Engine No"]);
        $("#ContactLastName").val(jsonString["Chassis No"]);
        $("#ContactLastName").val(jsonString["Regn No"]);

        console.log(RequiredObj);
        return RequiredObj;
    }
    function setSbiJsonData(qrCodeData)
    {
        var string =qrCodeData;
        //var string ="SBI GENERAl INSURANCE || Policy: #0000000005960925 | Policy Type: Package Policy  | Validity: 21-03-2018 | PH Name: VIKAS  KATOCH | Reg. No: CH 01 AS 6812 |Make: Honda | Model: City | Eng: #25938 |Chassis: #02387 | RTO Location: Chandigarh |URL: https://secure.sbigeneral.in/confpol?p=0000000005960925";
        var insurer = "Insurance Company";
        var newString= string.split("|");
        var final = "{";
        var string1 = insurer +":"+newString[0];
        newString[0]=string1;
	
        for(i=0;i<newString.length;i++)
        {
            if(newString[i]!="")
            {
                var b =newString[i].split(":");
                final =final+"\""+b[0].trim()+"\""+":"+"\""+b[1].trim()+"\"";
                if(i!=newString.length-1){final=final+",";}
                if(i==newString.length-1){final=final+"}";}
            }
        }
        var jsonString = JSON.parse(final);
        var fullName = jsonString["PH Name"].split(" ");
        var RegistrationNumber = [];
        if(jsonString["Reg. No"].replace(/ /g,'').length===9 || jsonString["Reg. No"].replace(/ /g,'').length===10)
        {
            RegistrationNumber = jsonString["Reg. No"].replace(/ /g,'').match(/[a-z]+|[^a-z]+/gi); 
        }
        if(jsonString["Reg. No"].replace(/ /g,'').length===11)
        {
            RegistrationNumber = jsonString["Reg. No"].replace(/ /g,'').match(/[a-z]+|[^a-z]+/gi);
            //var temp = RegistrationNumber[2][0];
            var temp1 = RegistrationNumber[2][1]+RegistrationNumber[2][2];

            RegistrationNumber[0] = RegistrationNumber[0];
            RegistrationNumber[1] = RegistrationNumber[1];
            RegistrationNumber[2] = RegistrationNumber[2].replace(RegistrationNumber[2],temp1)
            RegistrationNumber[3] = RegistrationNumber[3];
        }
        var RequiredObj = JSON.parse('{"ContactName":"","ContactMiddleName":"","ContactLastName":"","RegistrationNumberPart1":"","RegistrationNumberPart1A":"","RegistrationNumberPart2":"","RegistrationNumberPart3":"","EngineNumber":"","ChasisNumber":"","PolicyNumber":""}');
        RequiredObj["ContactName"]= fullName[0];
        RequiredObj["ContactLastName"]= fullName[2];
        RequiredObj["PolicyNumber"]= jsonString["Policy"];
        RequiredObj["EngineNumber"]= jsonString["Eng"];
        RequiredObj["ChasisNumber"]= jsonString["Chassis"];
        RequiredObj["RegistrationNumberPart1"]= RegistrationNumber[0];
        RequiredObj["RegistrationNumberPart1A"]= RegistrationNumber[1];
        RequiredObj["RegistrationNumberPart2"]= RegistrationNumber[2];
        RequiredObj["RegistrationNumberPart3"]= RegistrationNumber[3];
        console.log(RequiredObj);
        return RequiredObj;
    }

    function setBajajAllianzJsonData(qrCodeData)
    {
        var string =qrCodeData;
        //var string = "http://general.bajajallianz.com/Insurance/PolicyInfo/PolicyDtlsMot.do?p_pol_no=A777794CBBE3938B25A63E23B74168DD4A02D9AB2AA82C86FAB4FFF07CFCC129"; 
        var PolicyNo = string.split("=");
        var RequiredObj = JSON.parse('{"ContactName":"","ContactMiddleName":"","ContactLastName":"","RegistrationNumberPart1":"","RegistrationNumberPart1A":"","RegistrationNumberPart2":"","RegistrationNumberPart3":"","EngineNumber":"","ChasisNumber":"","PolicyNumber":""}');

        RequiredObj["PolicyNumber"]= PolicyNo[1];
        console.log(RequiredObj);
        return RequiredObj;
    }
    function setRelianceJsonData(qrCodeData)
    {
        var string =qrCodeData;
        //	var string = "http://rgiclservices.reliancegeneral.co.in/PDFDownload/ViewPDF.aspx?PolicyNo=110821823120028689 &|PolicyNo:110821823120028689 |Salutation:Mrs. |CustName:MAMTA GOEL GOEL |Prod:2312 |RSD:27-Mar-2018 |RED:26-Mar-2019 |PREM:1357.00 |SI:35434.00 |RegNo:CH01BG7651 |EngineNo:JF50E83068593 |ChassisNo:ME4JF505CG8069241 |PID:08-Mar-2018 |ProposalNo:R08031815895 |BusinessType:Rollover";
	
        var newString = string.split("|");
        var final = "{";
	
        for(i=1;i<newString.length;i++)
        {
            if(newString[i]!="")
            {
                var b =newString[i].split(":");
                final =final+"\""+b[0]+"\""+":"+"\""+b[1]+"\"";
                if(i!=newString.length-1){final=final+",";}
                if(i==newString.length-1){final=final+"}";}
            }
        }
        var jsonString = JSON.parse(final);
        var fullName = jsonString["CustName"].split(" ");
	
        var RegistrationNumber = [];
        if(jsonString["RegNo"].trim().length===9 || jsonString["RegNo"].trim().length===10)
        {
            RegistrationNumber = jsonString["RegNo"].trim().match(/[a-z]+|[^a-z]+/gi); 
        }
        if(jsonString["RegNo"].trim().length===11)
        {
            RegistrationNumber = jsonString["RegNo"].trim().match(/[a-z]+|[^a-z]+/gi);
            //var temp = RegistrationNumber[2][0];
            var temp1 = RegistrationNumber[2][1]+RegistrationNumber[2][2];

            RegistrationNumber[0] = RegistrationNumber[0];
            RegistrationNumber[1] = RegistrationNumber[1];
            RegistrationNumber[2] = RegistrationNumber[2].replace(RegistrationNumber[2],temp1)
            RegistrationNumber[3] = RegistrationNumber[3];
        }
        var RequiredObj = JSON.parse('{"ContactName":"","ContactMiddleName":"","ContactLastName":"","RegistrationNumberPart1":"","RegistrationNumberPart1A":"","RegistrationNumberPart2":"","RegistrationNumberPart3":"","EngineNumber":"","ChasisNumber":"","PolicyNumber":""}');
        RequiredObj["ContactName"]= fullName[0];
        RequiredObj["ContactMiddleName"]= fullName[1];
        RequiredObj["ContactLastName"]= fullName[2];
        RequiredObj["PolicyNumber"]= jsonString["PolicyNo"];
        RequiredObj["EngineNumber"]= jsonString["EngineNo"];
        RequiredObj["ChasisNumber"]= jsonString["ChassisNo"];
        RequiredObj["RegistrationNumberPart1"]= RegistrationNumber[0];
        RequiredObj["RegistrationNumberPart1A"]= RegistrationNumber[1];
        RequiredObj["RegistrationNumberPart2"]= RegistrationNumber[2];
        RequiredObj["RegistrationNumberPart3"]= RegistrationNumber[3];
        console.log(RequiredObj);
        return RequiredObj;
    }
    function setBhartiJsonData(qrCodeData)
    {
        var string =qrCodeData;
        //var string = "PolicyNo:S8682802|ClientName:PRAMOD RAMCHANDRA SURWADE|IncepDate:2018-03-08T00:00:00.0|ExpDate:2019-03-07T23:59:59.0|Prem:1257.00|SI:41440.00|RegNo:MH05CR6640|EngineNo:JFE0E72253981|ChassisNo:ME4JF504HF7253900|TxnDate:2018-03-07T23:03:31.170000000";
        var newString = string.split("|");
        var final = "{";
		
        for(i=0;i<newString.length;i++)
        {
            if(newString[i]!="")
            {
                var b =newString[i].split(":");
                final =final+"\""+b[0]+"\""+":"+"\""+b[1]+"\"";
                if(i!=newString.length-1){final=final+",";}
                if(i==newString.length-1){final=final+"}";}
            }
        }
        var jsonString = JSON.parse(final);
        var fullName = jsonString["ClientName"].split(" ");
	
        var RegistrationNumber = [];
        if(jsonString["RegNo"].trim().length===9 || jsonString["RegNo"].trim().length===10)
        {
            RegistrationNumber = jsonString["RegNo"].trim().match(/[a-z]+|[^a-z]+/gi); 
        }
        if(jsonString["RegNo"].trim().length===11)
        {
            RegistrationNumber = jsonString["RegNo"].trim().match(/[a-z]+|[^a-z]+/gi);
            //var temp = RegistrationNumber[2][0];
            var temp1 = RegistrationNumber[2][1]+RegistrationNumber[2][2];

            RegistrationNumber[0] = RegistrationNumber[0];
            RegistrationNumber[1] = RegistrationNumber[1];
            RegistrationNumber[2] = RegistrationNumber[2].replace(RegistrationNumber[2],temp1)
            RegistrationNumber[3] = RegistrationNumber[3];
        }
        var RequiredObj = JSON.parse('{"ContactName":"","ContactMiddleName":"","ContactLastName":"","RegistrationNumberPart1":"","RegistrationNumberPart1A":"","RegistrationNumberPart2":"","RegistrationNumberPart3":"","EngineNumber":"","ChasisNumber":"","PolicyNumber":""}');
        RequiredObj["ContactName"]= fullName[0];
        RequiredObj["ContactMiddleName"]= fullName[1];
        RequiredObj["ContactLastName"]= fullName[2];
        RequiredObj["PolicyNumber"]= jsonString["PolicyNo"];
        RequiredObj["EngineNumber"]= jsonString["EngineNo"];
        RequiredObj["ChasisNumber"]= jsonString["ChassisNo"];
        RequiredObj["RegistrationNumberPart1"]= RegistrationNumber[0];
        RequiredObj["RegistrationNumberPart1A"]= RegistrationNumber[1];
        RequiredObj["RegistrationNumberPart2"]= RegistrationNumber[2];
        RequiredObj["RegistrationNumberPart3"]= RegistrationNumber[3];
        console.log(RequiredObj);
        return RequiredObj;
    }
    function setNewindiaJsonData(qrCodeData)
    {
        var string =qrCodeData;
        //var string = "AMIT  GAUR(PO57892124)_13140031170300012197_02-Mar-2018  12:00:01 AM_01-Mar-19  11:59:59 PM_352288_KA-51-MH-8252_G4HGFM918654_MALAM51BLFM662075K_9747_http://online.newindia.co.in";
        var insurerKey = ['Customer Name','Policy Number','Start Date','End Date','IDV','Reg. No','Eng No','Chassis No','premium','URL'];
        var newString = string.split("_");
        console.log(newString);
        console.log(insurerKey);
        var final = "{";
	
	
	
        for(i=0;i<newString.length;i++)
        {
            if(newString[i]!="")
            {
                //var b =newString[i].split(":");
                final =final+"\""+insurerKey[i]+"\""+":"+"\""+newString[i]+"\"";
                if(i!=newString.length-1){final=final+",";}
                if(i==newString.length-1){final=final+"}";}
            }
        }
	
        var jsonString = JSON.parse(final);
        console.log(jsonString);
        var fullName = (jsonString["Customer Name"].split('('))[0].split(' ');
	
        var RegistrationNumber = [];
        if(jsonString["Reg. No"].replace(/-/g,'').length===9 || jsonString["Reg. No"].replace(/-/g,'').length===10)
        {
            RegistrationNumber = jsonString["Reg. No"].replace(/-/g,'').match(/[a-z]+|[^a-z]+/gi); 
        }
        if(jsonString["Reg. No"].replace(/-/g,'').length===11)
        {
            RegistrationNumber = jsonString["Reg. No"].replace(/-/g,'').match(/[a-z]+|[^a-z]+/gi);
            //var temp = RegistrationNumber[2][0];
            var temp1 = RegistrationNumber[2][1]+RegistrationNumber[2][2];

            RegistrationNumber[0] = RegistrationNumber[0];
            RegistrationNumber[1] = RegistrationNumber[1];
            RegistrationNumber[2] = RegistrationNumber[2].replace(RegistrationNumber[2],temp1)
            RegistrationNumber[3] = RegistrationNumber[3];
        }
        var RequiredObj = JSON.parse('{"ContactName":"","ContactMiddleName":"","ContactLastName":"","RegistrationNumberPart1":"","RegistrationNumberPart1A":"","RegistrationNumberPart2":"","RegistrationNumberPart3":"","EngineNumber":"","ChasisNumber":"","PolicyNumber":""}');
        RequiredObj["ContactName"]= fullName[0];
        //RequiredObj["ContactMiddleName"]= fullName[1];
        RequiredObj["ContactLastName"]= fullName[2];
        RequiredObj["PolicyNumber"]= jsonString["Policy Number"];
        RequiredObj["EngineNumber"]= jsonString["Eng No"];
        RequiredObj["ChasisNumber"]= jsonString["Chassis No"];
        RequiredObj["RegistrationNumberPart1"]= RegistrationNumber[0];
        RequiredObj["RegistrationNumberPart1A"]= RegistrationNumber[1];
        RequiredObj["RegistrationNumberPart2"]= RegistrationNumber[2];
        RequiredObj["RegistrationNumberPart3"]= RegistrationNumber[3];
        console.log(RequiredObj);
        return RequiredObj;
    }
    function setLibertyvideoconJsonData(qrCodeData)
    {
        var string =qrCodeData;
        //var string = "Vehicle No: MH 05 DE 0172;Product Name: Private Car Policy ; Policy Period: 16/03/2018-15/03/2019;Coverage Type: Package Policy;Engine No:K14BN4052276;Chassis No:MA3ELMG1S00440773";
	
        var newString = string.split(";");
        var final = "{";
        for(i=0;i<newString.length;i++)
        {
            if(newString[i]!="")
            {
                var b =newString[i].split(":");
                final =final+"\""+b[0]+"\""+":"+"\""+b[1]+"\"";
                if(i!=newString.length-1){final=final+",";}
                if(i==newString.length-1){final=final+"}";}
            }
        }
        var jsonString = JSON.parse(final);
	
        var RegistrationNumber = [];
        if(jsonString["Vehicle No"].trim().replace(/ /g,'').length===9 || jsonString["Vehicle No"].trim().replace(/ /g,'').length===10)
        {
            RegistrationNumber = jsonString["Vehicle No"].trim().replace(/ /g,'').match(/[a-z]+|[^a-z]+/gi); 
        }
        if(jsonString["Vehicle No"].trim().replace(/ /g,'').length===11)
        {
            RegistrationNumber = jsonString["Vehicle No"].trim().replace(/ /g,'').match(/[a-z]+|[^a-z]+/gi);
            //var temp = RegistrationNumber[2][0];
            var temp1 = RegistrationNumber[2][1]+RegistrationNumber[2][2];

            RegistrationNumber[0] = RegistrationNumber[0];
            RegistrationNumber[1] = RegistrationNumber[1];
            RegistrationNumber[2] = RegistrationNumber[2].replace(RegistrationNumber[2],temp1)
            RegistrationNumber[3] = RegistrationNumber[3];
        }
        var RequiredObj = JSON.parse('{"ContactName":"","ContactMiddleName":"","ContactLastName":"","RegistrationNumberPart1":"","RegistrationNumberPart1A":"","RegistrationNumberPart2":"","RegistrationNumberPart3":"","EngineNumber":"","ChasisNumber":"","PolicyNumber":""}');


        RequiredObj["EngineNumber"]= jsonString["Engine No"];
        RequiredObj["ChasisNumber"]= jsonString["Chassis No"];
        RequiredObj["RegistrationNumberPart1"]= RegistrationNumber[0];
        RequiredObj["RegistrationNumberPart1A"]= RegistrationNumber[1];
        RequiredObj["RegistrationNumberPart2"]= RegistrationNumber[2];
        RequiredObj["RegistrationNumberPart3"]= RegistrationNumber[3];
        console.log(RequiredObj);
        return RequiredObj;
    }
    function setTataaigJsonData(qrCodeData)
    {
        var string =qrCodeData;
        //var string = "Policy Number: 0158063630 00;Policy Start Date: 03/03/2018;Policy End Date: 02/03/2019;Chassis number: MALAM51BLFM655071;Engine number: G4HGFM909084;Registration number : GJ 01 RN 8684;Insured Name: MRS POOJA VAIBHAV MARU";
        var newString = string.split(";");
        var final = "{";
		
        for(i=0;i<newString.length;i++)
        {
            if(newString[i]!="")
            {
                var b =newString[i].split(":");
                final =final+"\""+b[0].trim()+"\""+":"+"\""+b[1].trim()+"\"";
                if(i!=newString.length-1){final=final+",";}
                if(i==newString.length-1){final=final+"}";}
            }
        }
        var jsonString = JSON.parse(final);
        var fullName = jsonString['Insured Name'].split(" ");
        var RegistrationNumber = [];
        if(jsonString["Registration number"].replace(/ /g,'').length===9 || jsonString["Registration number"].replace(/ /g,'').length===10)
        {
            RegistrationNumber = jsonString["Registration number"].replace(/ /g,'').match(/[a-z]+|[^a-z]+/gi); 
        }
        if(jsonString["Registration number"].replace(/ /g,'').length===11)
        {
            RegistrationNumber = jsonString["Registration number"].replace(/ /g,'').match(/[a-z]+|[^a-z]+/gi);
            //var temp = RegistrationNumber[2][0];
            var temp1 = RegistrationNumber[2][1]+RegistrationNumber[2][2];

            RegistrationNumber[0] = RegistrationNumber[0];
            RegistrationNumber[1] = RegistrationNumber[1];
            RegistrationNumber[2] = RegistrationNumber[2].replace(RegistrationNumber[2],temp1)
            RegistrationNumber[3] = RegistrationNumber[3];
        }
        var RequiredObj = JSON.parse('{"ContactName":"","ContactMiddleName":"","ContactLastName":"","RegistrationNumberPart1":"","RegistrationNumberPart1A":"","RegistrationNumberPart2":"","RegistrationNumberPart3":"","EngineNumber":"","ChasisNumber":"","PolicyNumber":""}');
        RequiredObj["ContactName"]= fullName[1];
        RequiredObj["ContactMiddleName"]= fullName[2];
        RequiredObj["ContactLastName"]= fullName[3];
        RequiredObj["PolicyNumber"]= jsonString["Policy Number"];
        RequiredObj["EngineNumber"]= jsonString["Engine number"];
        RequiredObj["ChasisNumber"]= jsonString["Chassis number"];
        RequiredObj["RegistrationNumberPart1"]= RegistrationNumber[0];
        RequiredObj["RegistrationNumberPart1A"]= RegistrationNumber[1];
        RequiredObj["RegistrationNumberPart2"]= RegistrationNumber[2];
        RequiredObj["RegistrationNumberPart3"]= RegistrationNumber[3];
        console.log(RequiredObj);
        return RequiredObj;
    }
    function setUniversalSompoJsonData(qrCodeData)
    {
        var string =qrCodeData;
        //var string = "PolNo=USGI/WEBAG/0145685/00/000, PolType= PVTCAR      , Insurance Period =FROM 00:01 AM OF 09/03/2018 TO MIDNIGHT OF 08/03/2019,CustName=G, Vehicle Sub Model =  MAGNA1.1, RegNo = AP-25-Q-2324, EngineNo= G4HG7M286411, ChassisNo= MALAN51BR7M006120F, CC=1086, IDV =193450.00, HP =, ODPremium = 2853.00, TPPremium = 2963.00, TotalPremium = 6863.00 , http://www.usgi.co.in/usgi/QRPolicy.aspx?PolNo=USGI/WEBAG/0145685/00/000&AuthCode=d2ac4bb85d773093176fc45b9b58f8d6";
	
        var newString = string.split(",");
        var final = "{";
	
        for(i=0;i<newString.length-1;i++)
        {
            if(newString[i]!="")
            {
                var b =newString[i].split("=");
                final =final+"\""+b[0].trim()+"\""+":"+"\""+b[1].trim()+"\"";
                if(i!=newString.length-2){final=final+",";}
                if(i==newString.length-2){final=final+"}";}
            }
        }
        var jsonString = JSON.parse(final);
        var fullName = jsonString['CustName'].split(" ");
        var RegistrationNumber = [];
        if(jsonString["RegNo"].replace(/-/g,'').length===9 || jsonString["RegNo"].replace(/-/g,'').length===10)
        {
            RegistrationNumber = jsonString["RegNo"].replace(/-/g,'').match(/[a-z]+|[^a-z]+/gi); 
        }
        if(jsonString["RegNo"].replace(/-/g,'').length===11)
        {
            RegistrationNumber = jsonString["RegNo"].replace(/-/g,'').match(/[a-z]+|[^a-z]+/gi);
            //var temp = RegistrationNumber[2][0];
            var temp1 = RegistrationNumber[2][1]+RegistrationNumber[2][2];

            RegistrationNumber[0] = RegistrationNumber[0];
            RegistrationNumber[1] = RegistrationNumber[1];
            RegistrationNumber[2] = RegistrationNumber[2].replace(RegistrationNumber[2],temp1)
            RegistrationNumber[3] = RegistrationNumber[3];
        }
        var RequiredObj = JSON.parse('{"ContactName":"","ContactMiddleName":"","ContactLastName":"","RegistrationNumberPart1":"","RegistrationNumberPart1A":"","RegistrationNumberPart2":"","RegistrationNumberPart3":"","EngineNumber":"","ChasisNumber":"","PolicyNumber":""}');
        RequiredObj["ContactName"]= fullName[0];
        RequiredObj["ContactMiddleName"]= fullName[1];
        RequiredObj["ContactLastName"]= fullName[2];
        RequiredObj["PolicyNumber"]= jsonString["PolNo"];
        RequiredObj["EngineNumber"]= jsonString["EngineNo"];
        RequiredObj["ChasisNumber"]= jsonString["ChassisNo"];
        RequiredObj["RegistrationNumberPart1"]= RegistrationNumber[0];
        RequiredObj["RegistrationNumberPart1A"]= RegistrationNumber[1];
        RequiredObj["RegistrationNumberPart2"]= RegistrationNumber[2];
        RequiredObj["RegistrationNumberPart3"]= RegistrationNumber[3];
        console.log(RequiredObj);
        return RequiredObj;
    }
    function setFuturegeneraliJsonData(qrCodeData)
    {
        var string =qrCodeData;
        //var string = 'Insured Name : PRIYANKAR NAINWAL                                 Policy No. : 2018-V5491103-FPV                                   Policy Period From :   25/02/2018                                Policy Period To :   24/02/2019                                  Registration No. :  UK07AH8382                                  Engine No. :  2NRV005060                                         Chassis No. :  MBJB29BT300004003                                 Cover Type :   COMPREHENSIVE POLICY';
        var insurerKey = ['Insured Name','Policy No.','Policy Period From','Policy Period To','Registration No.','Engine No.','Chassis No.','Cover Type'];
        var newString = string.split(":");
        console.log(newString);
        var insurerKeyRepl = [];
        var output = [];

        var final="{";
        for(var i in newString)
        {
            if ((newString[i].indexOf(insurerKey[i]))>-1)
            {
                insurerKeyRepl[i]=insurerKey[i]+":"+newString[parseInt(i)+1].replace(insurerKey[parseInt(i)+1],'');
            }
        }

        for(var i in insurerKeyRepl)
        {
            output =insurerKeyRepl[i].split(":");
            final =final+"\""+output[0].trim()+"\""+":"+"\""+output[1].trim()+"\"";
            if(i!=insurerKeyRepl.length-1){final=final+",";}
            if(i==insurerKeyRepl.length-1){final=final+"}";}
        }
        var jsonString = JSON.parse(final);
        var fullName = jsonString['Insured Name'].split(" ");
        var RegistrationNumber = [];
        if(jsonString["Registration No."].length===9 || jsonString["Registration No."].length===10)
        {
            RegistrationNumber = jsonString["Registration No."].match(/[a-z]+|[^a-z]+/gi); 
        }
        if(jsonString["Registration No."].length===11)
        {
            RegistrationNumber = jsonString["Registration No."].match(/[a-z]+|[^a-z]+/gi);
            //var temp = RegistrationNumber[2][0];
            var temp1 = RegistrationNumber[2][1]+RegistrationNumber[2][2];

            RegistrationNumber[0] = RegistrationNumber[0];
            RegistrationNumber[1] = RegistrationNumber[1];
            RegistrationNumber[2] = RegistrationNumber[2].replace(RegistrationNumber[2],temp1)
            RegistrationNumber[3] = RegistrationNumber[3];
        }
        var RequiredObj = JSON.parse('{"ContactName":"","ContactMiddleName":"","ContactLastName":"","RegistrationNumberPart1":"","RegistrationNumberPart1A":"","RegistrationNumberPart2":"","RegistrationNumberPart3":"","EngineNumber":"","ChasisNumber":"","PolicyNumber":""}');
        RequiredObj["ContactName"]= fullName[0];
        //RequiredObj["ContactMiddleName"]= fullName[1];
        RequiredObj["ContactLastName"]= fullName[1];
        RequiredObj["PolicyNumber"]= jsonString["Policy No."];
        RequiredObj["EngineNumber"]= jsonString["Engine No."];
        RequiredObj["ChasisNumber"]= jsonString["Chassis No."];
        RequiredObj["RegistrationNumberPart1"]= RegistrationNumber[0];
        RequiredObj["RegistrationNumberPart1A"]= RegistrationNumber[1];
        RequiredObj["RegistrationNumberPart2"]= RegistrationNumber[2];
        RequiredObj["RegistrationNumberPart3"]= RegistrationNumber[3];
        console.log(RequiredObj);
        return RequiredObj;
    }
    function setRoyalSundaramJsonData(qrCodeData)
    {
        var string =qrCodeData;
        //var string = "https://direct.royalsundaram.in/Policy/details.do?policyNumber=VPCL000028000100&endorsementCode=000"; 
        var PolicyNo = string.split("=");
        var RequiredObj = JSON.parse('{"ContactName":"","ContactMiddleName":"","ContactLastName":"","RegistrationNumberPart1":"","RegistrationNumberPart1A":"","RegistrationNumberPart2":"","RegistrationNumberPart3":"","EngineNumber":"","ChasisNumber":"","PolicyNumber":""}');

        RequiredObj["PolicyNumber"]= PolicyNo[1].split('&')[0];
        console.log(RequiredObj);
        return RequiredObj;
    }
    function setIcicilombardJsonData(qrCodeData)
    {
        var string =qrCodeData;
        //var string = "CustName: MR   CHIRAGKUMAR S MODI | PolNum: 3001/119137511/01/000 | EngineNo: L15A30055140 | ChasisNo: MAKGD852G5N229657 | RegNo: MH-01-PA-3659 | PolStadate: Jul 21, 2017 | PolEnddate: Jul 20, 2018 | Policy Certificate: https://www.icicilombard.com/WebPages/NWSearchForPolicy.aspx";
	
        var newString = string.split("|");
	
        var final = "{";
	
	
	
        for(i=0;i<newString.length;i++)
        {
            if(newString[i]!="")
            {
                var b = newString[i].split(":");
                final = final+"\""+b[0].trim()+"\""+":"+"\""+b[1].trim()+"\"";
	
                if(i!=newString.length-1){final=final+",";}
                if(i==newString.length-1){final=final+"}";}
            }
        }
        var jsonString = JSON.parse(final);
        var fullName = jsonString['CustName'].split(" ");
        var RegistrationNumber = [];
        if(jsonString["RegNo"].replace(/-/g,'').length===9 || jsonString["RegNo"].replace(/-/g,'').length===10)
        {
            RegistrationNumber = jsonString["RegNo"].replace(/-/g,'').match(/[a-z]+|[^a-z]+/gi); 
        }
        if(jsonString["RegNo"].replace(/-/g,'').length===11)
        {
            RegistrationNumber = jsonString["RegNo"].replace(/-/g,'').match(/[a-z]+|[^a-z]+/gi);
            //var temp = RegistrationNumber[2][0];
            var temp1 = RegistrationNumber[2][1]+RegistrationNumber[2][2];

            RegistrationNumber[0] = RegistrationNumber[0];
            RegistrationNumber[1] = RegistrationNumber[1];
            RegistrationNumber[2] = RegistrationNumber[2].replace(RegistrationNumber[2],temp1)
            RegistrationNumber[3] = RegistrationNumber[3];
        }
        var RequiredObj = JSON.parse('{"ContactName":"","ContactMiddleName":"","ContactLastName":"","RegistrationNumberPart1":"","RegistrationNumberPart1A":"","RegistrationNumberPart2":"","RegistrationNumberPart3":"","EngineNumber":"","ChasisNumber":"","PolicyNumber":""}');
        RequiredObj["ContactName"]= fullName[3];
        RequiredObj["ContactMiddleName"]= fullName[4];
        RequiredObj["ContactLastName"]= fullName[5];
        RequiredObj["PolicyNumber"]= jsonString["PolNum"];
        RequiredObj["EngineNumber"]= jsonString["EngineNo"];
        RequiredObj["ChasisNumber"]= jsonString["ChasisNo"];
        RequiredObj["RegistrationNumberPart1"]= RegistrationNumber[0];
        RequiredObj["RegistrationNumberPart1A"]= RegistrationNumber[1];
        RequiredObj["RegistrationNumberPart2"]= RegistrationNumber[2];
        RequiredObj["RegistrationNumberPart3"]= RegistrationNumber[3];
        console.log(RequiredObj);
        return RequiredObj;
    }

}