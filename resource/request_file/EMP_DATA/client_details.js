$(document).ready(function () {
	employee_gmc();
});

function getEmployee_details(){
	var obj = [{ "UID": "107602", "Emp_Name": "Chirag Modi", "agent_name": "Pramod Kumar", "fba_id": "305", "agent_source": "5", "AgentClientFBAID": "305,2,305", "agent_email": "pramod.parit@policyboss.com", "agent_mobile": "9619833708", "VisitorID": "447700" }]
};

function  employee_gmc(){
	var obj = [{ "UID": "107602", "Company": "Landmark", "Joining Date": "17-08-2016", "Year": "2016-2017", "Insured_Name": "Richa Maithani Ramola", "Relationship": "Employee", "DOB": "23-09-1975", "Cover_Amount": "500000 ", "Policy_Number": "25110/46/100000111"
, "TPA": "Health India"	}]
	
	for (var i in obj) {
		$('#tbl_quote_list').append('<tr>'
                        +'<td align="center">1</td>'
                        +'<td>'+obj[i]['Insured_Name']+'</td>'
                        +'<td>'+obj[i]['Relationship']+'</td>'
                        +'<td>'+obj[i]['Joining Date']+'</td>'
                        +'<td>'+obj[i]['Cover_Amount']+'</td>'
                        +'<td>'+obj[i]['Policy_Number']+'</td>'
                        +'<td>'+obj[i]['TPA']+'</td>'
                        +'<td>'+obj[i]['Insured_Name']+'</td>'
                        +'<td>'+obj[i]['Insured_Name']+'</td>'
                        +'<td>'+obj[i]['Insured_Name']+'</td>'
                        +'<td>'+obj[i]['Insured_Name']+'</td>'
                    +'</tr>')
	}
	
}

function employee_gmc_claim(){
	
}