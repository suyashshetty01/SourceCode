
function _ReligareMedicalDetails(question_id, current_element, member_number) {

    // alert(current_element.id);
    //Created By Pramod for Religare on 01.09.2015 for select 'Yes' for 1st Question 
    //when any of the preexisting disease is selected Yes.
    //alert($("#HiddenPlan_ID").val());
    if ($("#HiddenPlan_ID").val() == 81) {
        if (member_number == 1) {
            $('input[name=MedicalQuestionSelf_241][value=Yes]').prop('checked', true);
        }
        if (member_number == 2) {
            $('input[name=MedicalQuestionSpouse_241][value=Yes]').prop('checked', true);
        }
        if (member_number == 3) {
            $('input[name=MedicalQuestionFather_241][value=Yes]').prop('checked', true);
        }
        if (member_number == 4) {
            $('input[name=MedicalQuestionMother_241][value=Yes]').prop('checked', true);
        }
        if (member_number == 5) {
            $('input[name=MedicalQuestionKid1_241][value=Yes]').prop('checked', true);
        }
        if (member_number == 6) {
            $('input[name=MedicalQuestionKid2_241][value=Yes]').prop('checked', true);
        }
        if (member_number == 7) {
            $('input[name=MedicalQuestionKid3_241][value=Yes]').prop('checked', true);
        }
        if (member_number == 8) {
            $('input[name=MedicalQuestionKid4_241][value=Yes]').prop('checked', true);
        }
    }
    else if ($("#HiddenPlan_ID").val() == 189) {
        if (member_number == 1) {

            $('input[name=MedicalQuestionSelf_323][value=Yes]').prop('checked', true);
            //$('#lblNoMedicalQuestionSelf_323').removeClass('active');
            //$('#lblYesMedicalQuestionSelf_323').addClass('active');
        }
        if (member_number == 2) {
            $('input[name=MedicalQuestionSpouse_323][value=Yes]').prop('checked', true);
        }
        if (member_number == 3) {
            $('input[name=MedicalQuestionFather_323][value=Yes]').prop('checked', true);
        }
        if (member_number == 4) {
            $('input[name=MedicalQuestionMother_323][value=Yes]').prop('checked', true);
        }
        if (member_number == 5) {
            $('input[name=MedicalQuestionKid1_323][value=Yes]').prop('checked', true);
        }
        if (member_number == 6) {
            $('input[name=MedicalQuestionKid2_323][value=Yes]').prop('checked', true);
        }
        if (member_number == 7) {
            $('input[name=MedicalQuestionKid3_323][value=Yes]').prop('checked', true);
        }
        if (member_number == 8) {
            $('input[name=MedicalQuestionKid4_323][value=Yes]').prop('checked', true);
        }
    }
        //Added by Ajit on 12-01-2016 for Religare Care V2
    else if ($("#HiddenPlan_ID").val() == 230) {
        if (member_number == 1) {
            $('input[name=MedicalQuestionSelf_438][value=Yes]').prop('checked', true);
        }
        if (member_number == 2) {
            $('input[name=MedicalQuestionSpouse_438][value=Yes]').prop('checked', true);
        }
        if (member_number == 3) {
            $('input[name=MedicalQuestionFather_438][value=Yes]').prop('checked', true);
        }
        if (member_number == 4) {
            $('input[name=MedicalQuestionMother_438][value=Yes]').prop('checked', true);
        }
        if (member_number == 5) {
            $('input[name=MedicalQuestionKid1_438][value=Yes]').prop('checked', true);
        }
        if (member_number == 6) {
            $('input[name=MedicalQuestionKid2_438][value=Yes]').prop('checked', true);
        }
        if (member_number == 7) {
            $('input[name=MedicalQuestionKid3_438][value=Yes]').prop('checked', true);
        }
        if (member_number == 8) {
            $('input[name=MedicalQuestionKid4_438][value=Yes]').prop('checked', true);
        }
    }
        //End of Religare Care V2
        //Added by Priyank for Religare Care+DSI+NCBS
    else if ($("#HiddenPlan_ID").val() == 236) {

        if (member_number == 1) {

            $('input[name=MedicalQuestionSelf_755][value=Yes]').prop('checked', true);
        }
        if (member_number == 2) {
            $('input[name=MedicalQuestionSpouse_755][value=Yes]').prop('checked', true);
        }
        if (member_number == 3) {
            $('input[name=MedicalQuestionFather_755][value=Yes]').prop('checked', true);
        }
        if (member_number == 4) {
            $('input[name=MedicalQuestionMother_755][value=Yes]').prop('checked', true);
        }
        if (member_number == 5) {
            $('input[name=MedicalQuestionKid1_755][value=Yes]').prop('checked', true);
        }
        if (member_number == 6) {
            $('input[name=MedicalQuestionKid2_755][value=Yes]').prop('checked', true);
        }
        if (member_number == 7) {
            $('input[name=MedicalQuestionKid3_755][value=Yes]').prop('checked', true);
        }
        if (member_number == 8) {
            $('input[name=MedicalQuestionKid4_755][value=Yes]').prop('checked', true);
        }
    }
        //end of Priyank for Religare Care+DSI+NCBS
        //Added by amol For Care + DSI + NCB + UAR
    else if ($("#HiddenPlan_ID").val() == 244) {
        if (member_number == 1) {
            $('input[name=MedicalQuestionSelf_936][value=Yes]').prop('checked', true);
        }
        if (member_number == 2) {
            $('input[name=MedicalQuestionSpouse_936][value=Yes]').prop('checked', true);
        }
        if (member_number == 3) {
            $('input[name=MedicalQuestionFather_936][value=Yes]').prop('checked', true);
        }
        if (member_number == 4) {
            $('input[name=MedicalQuestionMother_936][value=Yes]').prop('checked', true);
        }
        if (member_number == 5) {
            $('input[name=MedicalQuestionKid1_936][value=Yes]').prop('checked', true);
        }
        if (member_number == 6) {
            $('input[name=MedicalQuestionKid2_936][value=Yes]').prop('checked', true);
        }
        if (member_number == 7) {
            $('input[name=MedicalQuestionKid3_936][value=Yes]').prop('checked', true);
        }
        if (member_number == 8) {
            $('input[name=MedicalQuestionKid4_936][value=Yes]').prop('checked', true);
        }
    }

        //Added by amol For Care + DSI + NCB + PA
    else if ($("#HiddenPlan_ID").val() == 245) {
        if (member_number == 1) {
            $('input[name=MedicalQuestionSelf_957][value=Yes]').prop('checked', true);
        }
        if (member_number == 2) {
            $('input[name=MedicalQuestionSpouse_957][value=Yes]').prop('checked', true);
        }
        if (member_number == 3) {
            $('input[name=MedicalQuestionFather_957][value=Yes]').prop('checked', true);
        }
        if (member_number == 4) {
            $('input[name=MedicalQuestionMother_957][value=Yes]').prop('checked', true);
        }
        if (member_number == 5) {
            $('input[name=MedicalQuestionKid1_957][value=Yes]').prop('checked', true);
        }
        if (member_number == 6) {
            $('input[name=MedicalQuestionKid2_957][value=Yes]').prop('checked', true);
        }
        if (member_number == 7) {
            $('input[name=MedicalQuestionKid3_957][value=Yes]').prop('checked', true);
        }
        if (member_number == 8) {
            $('input[name=MedicalQuestionKid4_957][value=Yes]').prop('checked', true);
        }
    }
        //Added by amol For Care + NCB
    else if ($("#HiddenPlan_ID").val() == 259) {
        if (member_number == 1) {
            $('input[name=MedicalQuestionSelf_1201][value=Yes]').prop('checked', true);
        }
        if (member_number == 2) {
            $('input[name=MedicalQuestionSpouse_1201][value=Yes]').prop('checked', true);
        }
        if (member_number == 3) {
            $('input[name=MedicalQuestionFather_1201][value=Yes]').prop('checked', true);
        }
        if (member_number == 4) {
            $('input[name=MedicalQuestionMother_1201][value=Yes]').prop('checked', true);
        }
        if (member_number == 5) {
            $('input[name=MedicalQuestionKid1_1201][value=Yes]').prop('checked', true);
        }
        if (member_number == 6) {
            $('input[name=MedicalQuestionKid2_1201][value=Yes]').prop('checked', true);
        }
        if (member_number == 7) {
            $('input[name=MedicalQuestionKid3_1201][value=Yes]').prop('checked', true);
        }
        if (member_number == 8) {
            $('input[name=MedicalQuestionKid4_1201][value=Yes]').prop('checked', true);
        }
    }
        //for Care + PA
    else if ($("#HiddenPlan_ID").val() == 260) {
        if (member_number == 1) {
            $('input[name=MedicalQuestionSelf_1180][value=Yes]').prop('checked', true);
        }
        if (member_number == 2) {
            $('input[name=MedicalQuestionSpouse_1180][value=Yes]').prop('checked', true);
        }
        if (member_number == 3) {
            $('input[name=MedicalQuestionFather_1180][value=Yes]').prop('checked', true);
        }
        if (member_number == 4) {
            $('input[name=MedicalQuestionMother_1180][value=Yes]').prop('checked', true);
        }
        if (member_number == 5) {
            $('input[name=MedicalQuestionKid1_1180][value=Yes]').prop('checked', true);
        }
        if (member_number == 6) {
            $('input[name=MedicalQuestionKid2_1180][value=Yes]').prop('checked', true);
        }
        if (member_number == 7) {
            $('input[name=MedicalQuestionKid3_1180][value=Yes]').prop('checked', true);
        }
        if (member_number == 8) {
            $('input[name=MedicalQuestionKid4_1180][value=Yes]').prop('checked', true);
        }
    }
        //for Care + UAR + PA
    else if ($("#HiddenPlan_ID").val() == 261) {
        if (member_number == 1) {
            $('input[name=MedicalQuestionSelf_1159][value=Yes]').prop('checked', true);
        }
        if (member_number == 2) {
            $('input[name=MedicalQuestionSpouse_1159][value=Yes]').prop('checked', true);
        }
        if (member_number == 3) {
            $('input[name=MedicalQuestionFather_1159][value=Yes]').prop('checked', true);
        }
        if (member_number == 4) {
            $('input[name=MedicalQuestionMother_1159][value=Yes]').prop('checked', true);
        }
        if (member_number == 5) {
            $('input[name=MedicalQuestionKid1_1159][value=Yes]').prop('checked', true);
        }
        if (member_number == 6) {
            $('input[name=MedicalQuestionKid2_1159][value=Yes]').prop('checked', true);
        }
        if (member_number == 7) {
            $('input[name=MedicalQuestionKid3_1159][value=Yes]').prop('checked', true);
        }
        if (member_number == 8) {
            $('input[name=MedicalQuestionKid4_1159][value=Yes]').prop('checked', true);
        }
    }
        //for Care + NCB +PA
    else if ($("#HiddenPlan_ID").val() == 262) {
        if (member_number == 1) {
            $('input[name=MedicalQuestionSelf_1138][value=Yes]').prop('checked', true);
        }
        if (member_number == 2) {
            $('input[name=MedicalQuestionSpouse_1138][value=Yes]').prop('checked', true);
        }
        if (member_number == 3) {
            $('input[name=MedicalQuestionFather_1138][value=Yes]').prop('checked', true);
        }
        if (member_number == 4) {
            $('input[name=MedicalQuestionMother_1138][value=Yes]').prop('checked', true);
        }
        if (member_number == 5) {
            $('input[name=MedicalQuestionKid1_1138][value=Yes]').prop('checked', true);
        }
        if (member_number == 6) {
            $('input[name=MedicalQuestionKid2_1138][value=Yes]').prop('checked', true);
        }
        if (member_number == 7) {
            $('input[name=MedicalQuestionKid3_1138][value=Yes]').prop('checked', true);
        }
        if (member_number == 8) {
            $('input[name=MedicalQuestionKid4_1138][value=Yes]').prop('checked', true);
        }
    }
        //for Care + NCB +UAR
    else if ($("#HiddenPlan_ID").val() == 263) {
        if (member_number == 1) {
            $('input[name=MedicalQuestionSelf_1117][value=Yes]').prop('checked', true);
        }
        if (member_number == 2) {
            $('input[name=MedicalQuestionSpouse_1117][value=Yes]').prop('checked', true);
        }
        if (member_number == 3) {
            $('input[name=MedicalQuestionFather_1117][value=Yes]').prop('checked', true);
        }
        if (member_number == 4) {
            $('input[name=MedicalQuestionMother_1117][value=Yes]').prop('checked', true);
        }
        if (member_number == 5) {
            $('input[name=MedicalQuestionKid1_1117][value=Yes]').prop('checked', true);
        }
        if (member_number == 6) {
            $('input[name=MedicalQuestionKid2_1117][value=Yes]').prop('checked', true);
        }
        if (member_number == 7) {
            $('input[name=MedicalQuestionKid3_1117][value=Yes]').prop('checked', true);
        }
        if (member_number == 8) {
            $('input[name=MedicalQuestionKid4_1117][value=Yes]').prop('checked', true);
        }
    }
        //for Care + UAR
    else if ($("#HiddenPlan_ID").val() == 264) {
        if (member_number == 1) {
            $('input[name=MedicalQuestionSelf_1096][value=Yes]').prop('checked', true);
        }
        if (member_number == 2) {
            $('input[name=MedicalQuestionSpouse_1096][value=Yes]').prop('checked', true);
        }
        if (member_number == 3) {
            $('input[name=MedicalQuestionFather_1096][value=Yes]').prop('checked', true);
        }
        if (member_number == 4) {
            $('input[name=MedicalQuestionMother_1096][value=Yes]').prop('checked', true);
        }
        if (member_number == 5) {
            $('input[name=MedicalQuestionKid1_1096][value=Yes]').prop('checked', true);
        }
        if (member_number == 6) {
            $('input[name=MedicalQuestionKid2_1096][value=Yes]').prop('checked', true);
        }
        if (member_number == 7) {
            $('input[name=MedicalQuestionKid3_1096][value=Yes]').prop('checked', true);
        }
        if (member_number == 8) {
            $('input[name=MedicalQuestionKid4_1096][value=Yes]').prop('checked', true);
        }
    }
        //for Care + DSI +PA
    else if ($("#HiddenPlan_ID").val() == 265) {
        if (member_number == 1) {
            $('input[name=MedicalQuestionSelf_1075][value=Yes]').prop('checked', true);
        }
        if (member_number == 2) {
            $('input[name=MedicalQuestionSpouse_1075][value=Yes]').prop('checked', true);
        }
        if (member_number == 3) {
            $('input[name=MedicalQuestionFather_1075][value=Yes]').prop('checked', true);
        }
        if (member_number == 4) {
            $('input[name=MedicalQuestionMother_1075][value=Yes]').prop('checked', true);
        }
        if (member_number == 5) {
            $('input[name=MedicalQuestionKid1_1075][value=Yes]').prop('checked', true);
        }
        if (member_number == 6) {
            $('input[name=MedicalQuestionKid2_1075][value=Yes]').prop('checked', true);
        }
        if (member_number == 7) {
            $('input[name=MedicalQuestionKid3_1075][value=Yes]').prop('checked', true);
        }
        if (member_number == 8) {
            $('input[name=MedicalQuestionKid4_1075][value=Yes]').prop('checked', true);
        }
    }
        //for Care + DSI + UAR + PA
    else if ($("#HiddenPlan_ID").val() == 266) {
        if (member_number == 1) {
            $('input[name=MedicalQuestionSelf_1054][value=Yes]').prop('checked', true);
        }
        if (member_number == 2) {
            $('input[name=MedicalQuestionSpouse_1054][value=Yes]').prop('checked', true);
        }
        if (member_number == 3) {
            $('input[name=MedicalQuestionFather_1054][value=Yes]').prop('checked', true);
        }
        if (member_number == 4) {
            $('input[name=MedicalQuestionMother_1054][value=Yes]').prop('checked', true);
        }
        if (member_number == 5) {
            $('input[name=MedicalQuestionKid1_1054][value=Yes]').prop('checked', true);
        }
        if (member_number == 6) {
            $('input[name=MedicalQuestionKid2_1054][value=Yes]').prop('checked', true);
        }
        if (member_number == 7) {
            $('input[name=MedicalQuestionKid3_1054][value=Yes]').prop('checked', true);
        }
        if (member_number == 8) {
            $('input[name=MedicalQuestionKid4_1054][value=Yes]').prop('checked', true);
        }
    }
        //for Care + DSI + UAR
    else if ($("#HiddenPlan_ID").val() == 267) {
        if (member_number == 1) {
            $('input[name=MedicalQuestionSelf_1033][value=Yes]').prop('checked', true);
        }
        if (member_number == 2) {
            $('input[name=MedicalQuestionSpouse_1033][value=Yes]').prop('checked', true);
        }
        if (member_number == 3) {
            $('input[name=MedicalQuestionFather_1033][value=Yes]').prop('checked', true);
        }
        if (member_number == 4) {
            $('input[name=MedicalQuestionMother_1033][value=Yes]').prop('checked', true);
        }
        if (member_number == 5) {
            $('input[name=MedicalQuestionKid1_1033][value=Yes]').prop('checked', true);
        }
        if (member_number == 6) {
            $('input[name=MedicalQuestionKid2_1033][value=Yes]').prop('checked', true);
        }
        if (member_number == 7) {
            $('input[name=MedicalQuestionKid3_1033][value=Yes]').prop('checked', true);
        }
        if (member_number == 8) {
            $('input[name=MedicalQuestionKid4_1033][value=Yes]').prop('checked', true);
        }
    }

    else {
        if (member_number == 1) {
            $('input[name=MedicalQuestionSelf_413][value=Yes]').prop('checked', true);
        }
        if (member_number == 2) {
            $('input[name=MedicalQuestionSpouse_413][value=Yes]').prop('checked', true);
        }
        if (member_number == 3) {
            $('input[name=MedicalQuestionFather_413][value=Yes]').prop('checked', true);
        }
        if (member_number == 4) {
            $('input[name=MedicalQuestionMother_413][value=Yes]').prop('checked', true);
        }
        if (member_number == 5) {
            $('input[name=MedicalQuestionKid1_413][value=Yes]').prop('checked', true);
        }
        if (member_number == 6) {
            $('input[name=MedicalQuestionKid2_413][value=Yes]').prop('checked', true);
        }
        if (member_number == 7) {
            $('input[name=MedicalQuestionKid3_413][value=Yes]').prop('checked', true);
        }
        if (member_number == 8) {
            $('input[name=MedicalQuestionKid4_413][value=Yes]').prop('checked', true);
        }
    }

    //end of Reliagre Selection
    $.get('/HealthInsuranceIndia/GetMedicalSubQuestion?Question_Id=' + question_id + '&Member_Number=' + member_number, function (response) {
        var _content = $.parseJSON(response);
        $("#tdMedicalQuestion").html(_content);
        $('#popup').bPopup(
            {
                onClose: function (event) {
                    var tmp1 = $("#txtMedicalSubQuestionAnswer").val();
                    var tmp2 = $("#hdnMedicalSubQuestionId").val();
                    if (tmp1 == "") {
                        $('input:radio[name=' + current_element.id + '][value=' + 'No' + ']').prop('checked', true);
                    }
                }
            });
    });
}


function _ReligareOtherMedicalDetails(question_id, current_element, member_number) {
    //Created By Pramod for Religare on 01.09.2015 for select 'Yes' for 1st Question 
    //when any of the preexisting disease is selected Yes.
    if ($("#HiddenPlan_ID").val() == 81) {
        if (member_number == 1) {
            $('input[name=MedicalQuestionSelf_241][value=Yes]').prop('checked', true);
        }
        if (member_number == 2) {
            $('input[name=MedicalQuestionSpouse_241][value=Yes]').prop('checked', true);
        }
        if (member_number == 3) {
            $('input[name=MedicalQuestionFather_241][value=Yes]').prop('checked', true);
        }
        if (member_number == 4) {
            $('input[name=MedicalQuestionMother_241][value=Yes]').prop('checked', true);
        }
        if (member_number == 5) {
            $('input[name=MedicalQuestionKid1_241][value=Yes]').prop('checked', true);
        }
        if (member_number == 6) {
            $('input[name=MedicalQuestionKid2_241][value=Yes]').prop('checked', true);
        }
        if (member_number == 7) {
            $('input[name=MedicalQuestionKid3_241][value=Yes]').prop('checked', true);
        }
        if (member_number == 8) {
            $('input[name=MedicalQuestionKid4_241][value=Yes]').prop('checked', true);
        }
    }
    else if ($("#HiddenPlan_ID").val() == 189) {
        if (member_number == 1) {
            $('input[name=MedicalQuestionSelf_323][value=Yes]').prop('checked', true);
        }
        if (member_number == 2) {
            $('input[name=MedicalQuestionSpouse_323][value=Yes]').prop('checked', true);
        }
        if (member_number == 3) {
            $('input[name=MedicalQuestionFather_323][value=Yes]').prop('checked', true);
        }
        if (member_number == 4) {
            $('input[name=MedicalQuestionMother_323][value=Yes]').prop('checked', true);
        }
        if (member_number == 5) {
            $('input[name=MedicalQuestionKid1_323][value=Yes]').prop('checked', true);
        }
        if (member_number == 6) {
            $('input[name=MedicalQuestionKid2_323][value=Yes]').prop('checked', true);
        }
        if (member_number == 7) {
            $('input[name=MedicalQuestionKid3_323][value=Yes]').prop('checked', true);
        }
        if (member_number == 8) {
            $('input[name=MedicalQuestionKid4_323][value=Yes]').prop('checked', true);
        }
    }
          
    else {
        if (member_number == 1) {
            $('input[name=MedicalQuestionSelf_413][value=Yes]').prop('checked', true);
        }
        if (member_number == 2) {
            $('input[name=MedicalQuestionSpouse_413][value=Yes]').prop('checked', true);
        }
        if (member_number == 3) {
            $('input[name=MedicalQuestionFather_413][value=Yes]').prop('checked', true);
        }
        if (member_number == 4) {
            $('input[name=MedicalQuestionMother_413][value=Yes]').prop('checked', true);
        }
        if (member_number == 5) {
            $('input[name=MedicalQuestionKid1_413][value=Yes]').prop('checked', true);
        }
        if (member_number == 6) {
            $('input[name=MedicalQuestionKid2_413][value=Yes]').prop('checked', true);
        }
        if (member_number == 7) {
            $('input[name=MedicalQuestionKid3_413][value=Yes]').prop('checked', true);
        }
        if (member_number == 8) {
            $('input[name=MedicalQuestionKid4_413][value=Yes]').prop('checked', true);
        }
    }
    //end of Reliagre Selection
    $.get('/HealthInsuranceIndia/GetOtherMedicalSubQuestion?Question_Id=' + question_id + '&Member_Number=' + member_number, function (response) {
        var _content = $.parseJSON(response);
        //alert(_content);
        $("#tdOtherMedicalQuestion").html(_content);
        $('#popup2').bPopup({
            onClose: function (event) {
                var tmp1 = $("#txtSubQuestionAnswer").val();
                var tmp2 = $("#hdnOtherMedicalSubQuestionId").val();
                var tmp3 = $("#txtOtherMedicalSubQuestionAnswer").val();
                //alert(tmp2);
                if (tmp1 == "") {
                    $('input:radio[name=' + current_element.id + '][value=' + 'No' + ']').prop('checked', true);
                }
            }
        });
    });
}


//Added by Pramod on 27.06.2016 for changes as per religare changes in PED Question
function _ReligareOtherSmokeMedicalDetails(question_id, current_element, member_number) {
    //Created By Pramod for Religare on 01.09.2015 for select 'Yes' for 1st Question 
    //when any of the preexisting disease is selected Yes.
    if ($("#HiddenPlan_ID").val() == 81) {
        if (member_number == 1) {
            $('input[name=MedicalQuestionSelf_241][value=Yes]').prop('checked', true);
        }
        if (member_number == 2) {
            $('input[name=MedicalQuestionSpouse_241][value=Yes]').prop('checked', true);
        }
        if (member_number == 3) {
            $('input[name=MedicalQuestionFather_241][value=Yes]').prop('checked', true);
        }
        if (member_number == 4) {
            $('input[name=MedicalQuestionMother_241][value=Yes]').prop('checked', true);
        }
        if (member_number == 5) {
            $('input[name=MedicalQuestionKid1_241][value=Yes]').prop('checked', true);
        }
        if (member_number == 6) {
            $('input[name=MedicalQuestionKid2_241][value=Yes]').prop('checked', true);
        }
        if (member_number == 7) {
            $('input[name=MedicalQuestionKid3_241][value=Yes]').prop('checked', true);
        }
        if (member_number == 8) {
            $('input[name=MedicalQuestionKid4_241][value=Yes]').prop('checked', true);
        }
    }
    else {
        if (member_number == 1) {
            $('input[name=MedicalQuestionSelf_323][value=Yes]').prop('checked', true);
        }
        if (member_number == 2) {
            $('input[name=MedicalQuestionSpouse_323][value=Yes]').prop('checked', true);
        }
        if (member_number == 3) {
            $('input[name=MedicalQuestionFather_323][value=Yes]').prop('checked', true);
        }
        if (member_number == 4) {
            $('input[name=MedicalQuestionMother_323][value=Yes]').prop('checked', true);
        }
        if (member_number == 5) {
            $('input[name=MedicalQuestionKid1_323][value=Yes]').prop('checked', true);
        }
        if (member_number == 6) {
            $('input[name=MedicalQuestionKid2_323][value=Yes]').prop('checked', true);
        }
        if (member_number == 7) {
            $('input[name=MedicalQuestionKid3_323][value=Yes]').prop('checked', true);
        }
        if (member_number == 8) {
            $('input[name=MedicalQuestionKid4_323][value=Yes]').prop('checked', true);
        }
    }
    //end of Reliagre Selection
    $.get('/HealthInsuranceIndia/GetOtherSmokeMedicalSubQuestion?Question_Id=' + question_id + '&Member_Number=' + member_number, function (response) {
        var _content = $.parseJSON(response);
        //alert(_content);
        $("#tdOtherSmokeMedicalQuestion").html(_content);
        $('#popup3').bPopup({
            onClose: function (event) {
                var tmp1 = $("#txtSmokeSubQuestionAnswer").val();
                var tmp2 = $("#hdnOtherSmokeMedicalSubQuestionId").val();
                var tmp3 = $("#txtOtherSmokeMedicalSubQuestionAnswer").val();
                //alert(tmp2);
                if (tmp1 == "") {
                    $('input:radio[name=' + current_element.id + '][value=' + 'No' + ']').prop('checked', true);
                }
            }
        });
    });
}


//Created By Pramod for Religare on 01.09.2015 for select 'No' for 1st Question 
//when all of the preexisting disease is selected No.
$('input[name=MedicalQuestionSelf_241]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 242; i <= 253; i++) {
            $('input[name=MedicalQuestionSelf_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionSpouse_241]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 242; i <= 253; i++) {
            $('input[name=MedicalQuestionSpouse_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionFather_241]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 242; i <= 253; i++) {
            $('input[name=MedicalQuestionFather_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionMother_241]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 242; i <= 253; i++) {
            $('input[name=MedicalQuestionMother_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid1_241]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 242; i <= 253; i++) {
            $('input[name=MedicalQuestionKid1_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid2_241]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 242; i <= 253; i++) {
            $('input[name=MedicalQuestionKid2_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid3_241]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 242; i <= 253; i++) {
            $('input[name=MedicalQuestionKid3_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid4_241]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 242; i <= 253; i++) {
            $('input[name=MedicalQuestionKid4_' + i + '][value=No]').prop('checked', true);
        }
    }
});


$('input[name=MedicalQuestionSelf_323]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 324; i <= 335; i++) {
            $('input[name=MedicalQuestionSelf_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionSpouse_323]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 324; i <= 335; i++) {
            $('input[name=MedicalQuestionSpouse_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionFather_323]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 324; i <= 335; i++) {
            $('input[name=MedicalQuestionFather_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionMother_323]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 324; i <= 335; i++) {
            $('input[name=MedicalQuestionMother_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid1_323]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 324; i <= 335; i++) {
            $('input[name=MedicalQuestionKid1_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid2_323]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 324; i <= 335; i++) {
            $('input[name=MedicalQuestionKid2_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid3_323]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 324; i <= 335; i++) {
            $('input[name=MedicalQuestionKid3_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid4_323]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 324; i <= 335; i++) {
            $('input[name=MedicalQuestionKid4_' + i + '][value=No]').prop('checked', true);
        }
    }
});


// Created by Manish Anand on 09.09.2016 
// to put "No" in all preexisting questions when FirstQuestion is selected "No"

$('input[name=MedicalQuestionSelf_413]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 414; i <= 424; i++) {
            $('input[name=MedicalQuestionSelf_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionSpouse_413]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 414; i <= 424; i++) {
            $('input[name=MedicalQuestionSpouse_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionFather_413]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 414; i <= 424; i++) {
            $('input[name=MedicalQuestionFather_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionMother_413]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 414; i <= 424; i++) {
            $('input[name=MedicalQuestionMother_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid1_413]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 414; i <= 424; i++) {
            $('input[name=MedicalQuestionKid1_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid2_413]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 414; i <= 424; i++) {
            $('input[name=MedicalQuestionKid2_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid3_413]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 414; i <= 424; i++) {
            $('input[name=MedicalQuestionKid3_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid4_413]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 414; i <= 424; i++) {
            $('input[name=MedicalQuestionKid4_' + i + '][value=No]').prop('checked', true);
        }
    }
});
//End of Religare Selection



//Added by Ajit on 12-01-2016 for Religare Care V2
$('input[name=MedicalQuestionSelf_438]').click(function () {
    //alert("inside AJIT Code");
    if ($(this).val() == 'No') {
        for (var i = 443; i <= 455; i++) {
            $('input[name=MedicalQuestionSelf_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionSpouse_438]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 443; i <= 455; i++) {
            $('input[name=MedicalQuestionSpouse_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionFather_438]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 443; i <= 455; i++) {
            $('input[name=MedicalQuestionFather_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionMother_438]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 443; i <= 455; i++) {
            $('input[name=MedicalQuestionMother_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid1_438]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 443; i <= 455; i++) {
            $('input[name=MedicalQuestionKid1_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid2_438]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 443; i <= 455; i++) {
            $('input[name=MedicalQuestionKid2_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid3_438]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 443; i <= 455; i++) {
            $('input[name=MedicalQuestionKid3_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid4_438]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 443; i <= 455; i++) {
            $('input[name=MedicalQuestionKid4_' + i + '][value=No]').prop('checked', true);
        }
    }
});
// End of Religare Care V2
//Added by Priyank for Religare Care+DSI+NCBS
$('input[name=MedicalQuestionSelf_755]').click(function () {
    //alert("inside Priyank code");
    if ($(this).val() == 'No') {
        for (var i = 760; i <= 771; i++) {
            $('input[name=MedicalQuestionSelf_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionSpouse_755]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 760; i <= 771; i++) {
            $('input[name=MedicalQuestionSpouse_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionFather_755]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 760; i <= 771; i++) {
            $('input[name=MedicalQuestionFather_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionMother_755]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 760; i <= 771; i++) {
            $('input[name=MedicalQuestionMother_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid1_755]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 760; i <= 771; i++) {
            $('input[name=MedicalQuestionKid1_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid2_755]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 760; i <= 771; i++) {
            $('input[name=MedicalQuestionKid2_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid3_755]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 760; i <= 771; i++) {
            $('input[name=MedicalQuestionKid3_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid4_755]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 760; i <= 771; i++) {
            $('input[name=MedicalQuestionKid4_' + i + '][value=No]').prop('checked', true);
        }
    }
});
//End of Priyank 
//Start 244
$('input[name=MedicalQuestionSelf_936]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 941; i <= 952; i++) {
            $('input[name=MedicalQuestionSelf_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionSpouse_936]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 941; i <= 952; i++) {
            $('input[name=MedicalQuestionSpouse_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionFather_936]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 941; i <= 952; i++) {
            $('input[name=MedicalQuestionFather_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionMother_936]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 941; i <= 952; i++) {
            $('input[name=MedicalQuestionMother_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid1_936]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 941; i <= 952; i++) {
            $('input[name=MedicalQuestionKid1_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid2_936]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 941; i <= 952; i++) {
            $('input[name=MedicalQuestionKid2_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid3_936]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 941; i <= 952; i++) {
            $('input[name=MedicalQuestionKid3_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid4_936]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 941; i <= 952; i++) {
            $('input[name=MedicalQuestionKid4_' + i + '][value=No]').prop('checked', true);
        }
    }
});
//End 244

//Start 245
$('input[name=MedicalQuestionSelf_957]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 963; i <= 973; i++) {
            $('input[name=MedicalQuestionSelf_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionSpouse_957]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 963; i <= 973; i++) {
            $('input[name=MedicalQuestionSpouse_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionFather_957]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 963; i <= 973; i++) {
            $('input[name=MedicalQuestionFather_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionMother_957]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 963; i <= 973; i++) {
            $('input[name=MedicalQuestionMother_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid1_957]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 963; i <= 973; i++) {
            $('input[name=MedicalQuestionKid1_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid2_957]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 963; i <= 973; i++) {
            $('input[name=MedicalQuestionKid2_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid3_957]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 963; i <= 973; i++) {
            $('input[name=MedicalQuestionKid3_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid4_957]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 963; i <= 973; i++) {
            $('input[name=MedicalQuestionKid4_' + i + '][value=No]').prop('checked', true);
        }
    }
});
//End 245

//Start 259
$('input[name=MedicalQuestionSelf_1201]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1206; i <= 1217; i++) {
            $('input[name=MedicalQuestionSelf_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionSpouse_1201]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1206; i <= 1217; i++) {
            $('input[name=MedicalQuestionSpouse_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionFather_1201]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1206; i <= 1217; i++) {
            $('input[name=MedicalQuestionFather_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionMother_1201]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1206; i <= 1217; i++) {
            $('input[name=MedicalQuestionMother_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid1_1201]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1206; i <= 1217; i++) {
            $('input[name=MedicalQuestionKid1_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid2_1201]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1206; i <= 1217; i++) {
            $('input[name=MedicalQuestionKid2_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid3_1201]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1206; i <= 1217; i++) {
            $('input[name=MedicalQuestionKid3_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid4_1201]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1206; i <= 1217; i++) {
            $('input[name=MedicalQuestionKid4_' + i + '][value=No]').prop('checked', true);
        }
    }
});
//End 259

//Start 260
$('input[name=MedicalQuestionSelf_1180]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1185; i <= 1196; i++) {
            $('input[name=MedicalQuestionSelf_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionSpouse_1180]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1185; i <= 1196; i++) {
            $('input[name=MedicalQuestionSpouse_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionFather_1180]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1185; i <= 1196; i++) {
            $('input[name=MedicalQuestionFather_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionMother_1180]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1185; i <= 1196; i++) {
            $('input[name=MedicalQuestionMother_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid1_1180]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1185; i <= 1196; i++) {
            $('input[name=MedicalQuestionKid1_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid2_1180]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1185; i <= 1196; i++) {
            $('input[name=MedicalQuestionKid2_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid3_1180]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1185; i <= 1196; i++) {
            $('input[name=MedicalQuestionKid3_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid4_1180]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1185; i <= 1196; i++) {
            $('input[name=MedicalQuestionKid4_' + i + '][value=No]').prop('checked', true);
        }
    }
});
//End 260

//Start 261
$('input[name=MedicalQuestionSelf_1159]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1164; i <= 1175; i++) {
            $('input[name=MedicalQuestionSelf_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionSpouse_1159]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1164; i <= 1175; i++) {
            $('input[name=MedicalQuestionSpouse_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionFather_1159]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1164; i <= 1175; i++) {
            $('input[name=MedicalQuestionFather_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionMother_1159]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1164; i <= 1175; i++) {
            $('input[name=MedicalQuestionMother_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid1_1159]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1164; i <= 1175; i++) {
            $('input[name=MedicalQuestionKid1_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid2_1159]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1164; i <= 1175; i++) {
            $('input[name=MedicalQuestionKid2_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid3_1159]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1164; i <= 1175; i++) {
            $('input[name=MedicalQuestionKid3_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid4_1159]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1164; i <= 1175; i++) {
            $('input[name=MedicalQuestionKid4_' + i + '][value=No]').prop('checked', true);
        }
    }
});
//End 261

//Start 262
$('input[name=MedicalQuestionSelf_1138]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1143; i <= 1154; i++) {
            $('input[name=MedicalQuestionSelf_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionSpouse_1138]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1143; i <= 1154; i++) {
            $('input[name=MedicalQuestionSpouse_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionFather_1138]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1143; i <= 1154; i++) {
            $('input[name=MedicalQuestionFather_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionMother_1138]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1143; i <= 1154; i++) {
            $('input[name=MedicalQuestionMother_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid1_1138]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1143; i <= 1154; i++) {
            $('input[name=MedicalQuestionKid1_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid2_1138]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1143; i <= 1154; i++) {
            $('input[name=MedicalQuestionKid2_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid3_1138]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1143; i <= 1154; i++) {
            $('input[name=MedicalQuestionKid3_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid4_1138]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1143; i <= 1154; i++) {
            $('input[name=MedicalQuestionKid4_' + i + '][value=No]').prop('checked', true);
        }
    }
});
//End 262

//Start 263
$('input[name=MedicalQuestionSelf_1117]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1122; i <= 1133; i++) {
            $('input[name=MedicalQuestionSelf_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionSpouse_1117]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1122; i <= 1133; i++) {
            $('input[name=MedicalQuestionSpouse_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionFather_1117]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1122; i <= 1133; i++) {
            $('input[name=MedicalQuestionFather_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionMother_1117]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1122; i <= 1133; i++) {
            $('input[name=MedicalQuestionMother_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid1_1117]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1122; i <= 1133; i++) {
            $('input[name=MedicalQuestionKid1_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid2_1117]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1122; i <= 1133; i++) {
            $('input[name=MedicalQuestionKid2_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid3_1117]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1122; i <= 1133; i++) {
            $('input[name=MedicalQuestionKid3_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid4_1117]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1122; i <= 1133; i++) {
            $('input[name=MedicalQuestionKid4_' + i + '][value=No]').prop('checked', true);
        }
    }
});
//End 263

//Start 264
$('input[name=MedicalQuestionSelf_1096]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1101; i <= 1112; i++) {
            $('input[name=MedicalQuestionSelf_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionSpouse_1096]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1101; i <= 1112; i++) {
            $('input[name=MedicalQuestionSpouse_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionFather_1096]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1101; i <= 1112; i++) {
            $('input[name=MedicalQuestionFather_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionMother_1096]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1101; i <= 1112; i++) {
            $('input[name=MedicalQuestionMother_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid1_1096]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1101; i <= 1112; i++) {
            $('input[name=MedicalQuestionKid1_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid2_1096]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1101; i <= 1112; i++) {
            $('input[name=MedicalQuestionKid2_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid3_1096]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1101; i <= 1112; i++) {
            $('input[name=MedicalQuestionKid3_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid4_1096]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1101; i <= 1112; i++) {
            $('input[name=MedicalQuestionKid4_' + i + '][value=No]').prop('checked', true);
        }
    }
});
//End 264

//Start 265
$('input[name=MedicalQuestionSelf_1075]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1080; i <= 1091; i++) {
            $('input[name=MedicalQuestionSelf_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionSpouse_1075]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1080; i <= 1091; i++) {
            $('input[name=MedicalQuestionSpouse_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionFather_1075]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1080; i <= 1091; i++) {
            $('input[name=MedicalQuestionFather_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionMother_1075]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1080; i <= 1091; i++) {
            $('input[name=MedicalQuestionMother_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid1_1075]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1080; i <= 1091; i++) {
            $('input[name=MedicalQuestionKid1_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid2_1075]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1080; i <= 1091; i++) {
            $('input[name=MedicalQuestionKid2_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid3_1075]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1080; i <= 1091; i++) {
            $('input[name=MedicalQuestionKid3_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid4_1075]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1080; i <= 1091; i++) {
            $('input[name=MedicalQuestionKid4_' + i + '][value=No]').prop('checked', true);
        }
    }
});
//End 265
//Start 266
$('input[name=MedicalQuestionSelf_1054]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1059; i <= 1070; i++) {
            $('input[name=MedicalQuestionSelf_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionSpouse_1054]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1059; i <= 1070; i++) {
            $('input[name=MedicalQuestionSpouse_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionFather_1054]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1059; i <= 1070; i++) {
            $('input[name=MedicalQuestionFather_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionMother_1054]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1059; i <= 1070; i++) {
            $('input[name=MedicalQuestionMother_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid1_1054]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1059; i <= 1070; i++) {
            $('input[name=MedicalQuestionKid1_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid2_1054]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1059; i <= 1070; i++) {
            $('input[name=MedicalQuestionKid2_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid3_1054]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1059; i <= 1070; i++) {
            $('input[name=MedicalQuestionKid3_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid4_1054]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1059; i <= 1070; i++) {
            $('input[name=MedicalQuestionKid4_' + i + '][value=No]').prop('checked', true);
        }
    }
});
//End 266

//Start 267
$('input[name=MedicalQuestionSelf_1033]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1038; i <= 1049; i++) {
            $('input[name=MedicalQuestionSelf_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionSpouse_1033]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1038; i <= 1049; i++) {
            $('input[name=MedicalQuestionSpouse_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionFather_1033]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1038; i <= 1049; i++) {
            $('input[name=MedicalQuestionFather_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionMother_1033]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1038; i <= 1049; i++) {
            $('input[name=MedicalQuestionMother_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid1_1033]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1038; i <= 1049; i++) {
            $('input[name=MedicalQuestionKid1_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid2_1033]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1038; i <= 1049; i++) {
            $('input[name=MedicalQuestionKid2_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid3_1033]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1038; i <= 1049; i++) {
            $('input[name=MedicalQuestionKid3_' + i + '][value=No]').prop('checked', true);
        }
    }
});
$('input[name=MedicalQuestionKid4_1033]').click(function () {
    if ($(this).val() == 'No') {
        for (var i = 1038; i <= 1049; i++) {
            $('input[name=MedicalQuestionKid4_' + i + '][value=No]').prop('checked', true);
        }
    }
});
//End 267
$("#ReligareMedicalQuestionOK").click(function () {

    // alert('reli');
    var qid = $("#hdnMedicalQuestionId").val();
    var member_number = $("#hdnMemberNumber").val();
    var txt_element = $("input[name=txtMedicalSubQuestionAnswer]");
    var hdn_element = $("input[name=hdnMedicalSubQuestionId]");

    var _error = "";
    $.each($("input[name=txtMedicalSubQuestionAnswer]"), function (index, value) {
        if ($(this).val().trim() != "" && $("input[name=txtMedicalSubQuestionAnswer]").val().length==7) {
            if (!validateDate($(this).val().trim())) {
                _error += "- Please enter value in (MM/YYYY) format ? " + "\n";
                $("#txtMedicalSubQuestionAnswer").val('');
            }
        }
        else { _error += "- Existing since in (MM/YYYY) ? " + "\n"; }
    });

    if (_error.length == 0) {
        for (var i = 0; i < txt_element.length; i++) {
            var sqid = hdn_element[i].value;
            var ans = txt_element[i].value.trim();
            if (ans.length > 0) {
                $.get('/HealthInsuranceIndia/SetMedicalSubAnswer?Question_Id=' + qid + '&SubQuestion_Id=' + sqid + '&Anwer=' + ans + '&Member_Number=' + member_number, function (response) {
                    var _content = $.parseJSON(response);
                });
            }
        }
        $("#popup").bPopup().close();
        // $("#dialog").dialog('destroy');
    }
    else {

        alert(_error);
    }
});

$("#ReligareOtherMedicalQuestionOK").click(function () {
    //alert('other');
    var qid = $("#hdnOtherMedicalQuestionId").val();
    var member_number = $("#hdnOtherMemberNumber").val();
    var txt_element = $("input[name=txtSubQuestionAnswer]");
    var txt_Otherelement = $("input[name=txtOtherMedicalSubQuestionAnswer]");
    var hdn_element = $("input[name=hdnOtherMedicalSubQuestionId]");
    var hdn_element = $("input[name=hdnOtherMedicalSubQuestionId]");
    //alert(qid + ',' + member_number + ',' + txt_element.length + ',' + txt_Otherelement.length + ',' + hdn_element.length);
    var _error = "";
    var sVal = $("#txtSubQuestionAnswer").val();
    //alert(sVal);
    if (sVal != "") {
        if (!validateDate($("#txtSubQuestionAnswer").val())) {
            _error += "- Please enter value in (MM/YYYY) format ? " + "\n";
            $("#txtSubQuestionAnswer").val('');
        }
    }
    else { _error += "- Existing since in (MM/YYYY) ? " + "\n"; }

    if ($("input[name=txtOtherMedicalSubQuestionAnswer]").val().trim() == "") {
        _error += "-  Please enter Other diseases description " + "\n";
    }

    //alert(_error.length);
    if (_error.length == 0) {
        for (var i = 0; i < txt_element.length; i++) {
            var sqid = hdn_element[i].value;
            var ans = txt_element[i].value.trim() + "," + txt_Otherelement[i].value.trim();
            if (ans.length > 0) {
                $.get('/HealthInsuranceIndia/SetMedicalSubAnswer?Question_Id=' + qid + '&SubQuestion_Id=' + sqid + '&Anwer=' + ans + '&Member_Number=' + member_number, function (response) {
                    var _content = $.parseJSON(response);
                });
            }
        }
        $("#popup2").bPopup().close();
    }
    else {
        alert(_error);
    }
});

$("#ReligareOtherSmokeMedicalQuestionOK").click(function () {
    //alert('other');
    var qid = $("#hdnOtherSmokeMedicalQuestionId").val();
    var member_number = $("#hdnOtherSmokeMemberNumber").val();
    var txt_element = $("input[name=txtSmokeSubQuestionAnswer]");
    var txt_Otherelement = $("input[name=txtOtherSmokeMedicalSubQuestionAnswer]");
    var hdn_element = $("input[name=hdnOtherSmokeMedicalSubQuestionId]");

    //alert(qid + ',' + member_number + ',' + txt_element.length + ',' + txt_Otherelement.length + ',' + hdn_element.length);
    var _error = "";
    var sVal = $("#txtSmokeSubQuestionAnswer").val();
    //alert(sVal);
    if (sVal != "") {
        if (!validateDate($("#txtSmokeSubQuestionAnswer").val())) {
            _error += "- Please enter value in (MM/YYYY) format ? " + "\n";
            $("#txtSmokeSubQuestionAnswer").val('');
        }
    }
    else { _error += "- Existing since in (MM/YYYY) ? " + "\n"; }

    if ($("input[name=txtOtherSmokeMedicalSubQuestionAnswer]").val().trim() == "") {
        _error += "-  Please enter other smoke details  " + "\n";
    }

    //alert(_error.length);
    if (_error.length == 0) {
        for (var i = 0; i < txt_element.length; i++) {
            var sqid = hdn_element[i].value;
            var ans = txt_element[i].value.trim() + "," + txt_Otherelement[i].value.trim();
            if (ans.length > 0) {
                $.get('/HealthInsuranceIndia/SetMedicalSubAnswer?Question_Id=' + qid + '&SubQuestion_Id=' + sqid + '&Anwer=' + ans + '&Member_Number=' + member_number, function (response) {
                    var _content = $.parseJSON(response);
                });
            }
        }
        $("#popup3").bPopup().close();
    }
    else {
        alert(_error);
    }
});

$("#nextSelfSelect").click(function () {
    if ($("#HiddenPlan_ID").val() == 259) {

        for (var i = 1206; i <= 1217; i++) {
            //alert($('input[name=MedicalQuestionSelf_' + i + ']').val());
            //$('input[name=MedicalQuestionSelf_1201]:checked').val() = 'No';
            if($('input:radio[name=MedicalQuestionSelf_'+ i +']:checked').val()=='No')
            {
                $("input[name=MedicalQuestionSelf_1201][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionSpouse_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionSpouse_1201][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionFather_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionFather_1201][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionMother_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionMother_1201][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid1_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid1_1201][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid2_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid2_1201][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid3_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid3_1201][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid4_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid4_1201][value='No']").prop("checked", true);
            }
        }
    }

    if ($("#HiddenPlan_ID").val() == 260) {

        for (var i = 1185; i <= 1196; i++) {
            //alert($('input[name=MedicalQuestionSelf_' + i + ']').val());
            //$('input[name=MedicalQuestionSelf_1201]:checked').val() = 'No';
            if ($('input:radio[name=MedicalQuestionSelf_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionSelf_1180][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionSpouse_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionSpouse_1180][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionFather_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionFather_1180][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionMother_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionMother_1180][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid1_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid1_1180][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid2_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid2_1180][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid3_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid3_1180][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid4_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid4_1180][value='No']").prop("checked", true);
            }
        }
    }


    if ($("#HiddenPlan_ID").val() == 261) {
        for (var i = 1164; i <= 1175; i++) {
            //alert($('input[name=MedicalQuestionSelf_' + i + ']').val());
            //$('input[name=MedicalQuestionSelf_1201]:checked').val() = 'No';
            if ($('input:radio[name=MedicalQuestionSelf_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionSelf_1159][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionSpouse_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionSpouse_1159][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionFather_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionFather_1159][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionMother_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionMother_1159][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid1_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid1_1159][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid2_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid2_1159][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid3_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid3_1159][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid4_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid4_1159][value='No']").prop("checked", true);
            }
        }
    }

    if ($("#HiddenPlan_ID").val() == 262) {
        for (var i = 1143; i <= 1154; i++) {
            //alert($('input[name=MedicalQuestionSelf_' + i + ']').val());
            //$('input[name=MedicalQuestionSelf_1201]:checked').val() = 'No';
            if ($('input:radio[name=MedicalQuestionSelf_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionSelf_1138][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionSpouse_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionSpouse_1138][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionFather_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionFather_1138][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionMother_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionMother_1138][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid1_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid1_1138][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid2_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid2_1138][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid3_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid3_1138][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid4_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid4_1138][value='No']").prop("checked", true);
            }
        }
    }

    if ($("#HiddenPlan_ID").val() == 263) {
        for (var i = 1122; i <= 1133; i++) {
            //alert($('input[name=MedicalQuestionSelf_' + i + ']').val());
            //$('input[name=MedicalQuestionSelf_1201]:checked').val() = 'No';
            if ($('input:radio[name=MedicalQuestionSelf_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionSelf_1117][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionSpouse_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionSpouse_1117][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionFather_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionFather_1117][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionMother_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionMother_1117][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid1_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid1_1117][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid2_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid2_1117][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid3_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid3_1117][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid4_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid4_1117][value='No']").prop("checked", true);
            }
        }
    }
    if ($("#HiddenPlan_ID").val() == 264) {
        for (var i = 1101; i <= 1112; i++) {
            //alert($('input[name=MedicalQuestionSelf_' + i + ']').val());
            //$('input[name=MedicalQuestionSelf_1201]:checked').val() = 'No';
            if ($('input:radio[name=MedicalQuestionSelf_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionSelf_1096][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionSpouse_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionSpouse_1096][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionFather_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionFather_1096][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionMother_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionMother_1096][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid1_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid1_1096][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid2_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid2_1096][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid3_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid3_1096][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid4_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid4_1096][value='No']").prop("checked", true);
            }
        }
    }

    if ($("#HiddenPlan_ID").val() == 265) {
        for (var i = 1080; i <= 1091; i++) {
            //alert($('input[name=MedicalQuestionSelf_' + i + ']').val());
            //$('input[name=MedicalQuestionSelf_1201]:checked').val() = 'No';
            if ($('input:radio[name=MedicalQuestionSelf_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionSelf_1075][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionSpouse_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionSpouse_1075][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionFather_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionFather_1075][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionMother_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionMother_1075][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid1_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid1_1075][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid2_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid2_1075][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid3_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid3_1075][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid4_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid4_1075][value='No']").prop("checked", true);
            }
        }
    }
    if ($("#HiddenPlan_ID").val() == 266) {
        for (var i = 1059; i <= 1070; i++) {
            //alert($('input[name=MedicalQuestionSelf_' + i + ']').val());
            //$('input[name=MedicalQuestionSelf_1201]:checked').val() = 'No';
            if ($('input:radio[name=MedicalQuestionSelf_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionSelf_1054][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionSpouse_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionSpouse_1054][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionFather_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionFather_1054][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionMother_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionMother_1054][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid1_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid1_1054][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid2_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid2_1054][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid3_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid3_1054][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid4_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid4_1054][value='No']").prop("checked", true);
            }
        }
    }
    if ($("#HiddenPlan_ID").val() == 267) {
        for (var i = 1059; i <= 1070; i++) {
            //alert($('input[name=MedicalQuestionSelf_' + i + ']').val());
            //$('input[name=MedicalQuestionSelf_1201]:checked').val() = 'No';
            if ($('input:radio[name=MedicalQuestionSelf_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionSelf_1054][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionSpouse_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionSpouse_1054][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionFather_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionFather_1054][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionMother_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionMother_1054][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid1_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid1_1054][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid2_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid2_1054][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid3_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid3_1054][value='No']").prop("checked", true);
            }
            if ($('input:radio[name=MedicalQuestionKid4_' + i + ']:checked').val() == 'No') {
                $("input[name=MedicalQuestionKid4_1054][value='No']").prop("checked", true);
            }
        }
    }
});

//$(document).ready(function () {
//    $('#txtMedicalSubQuestionAnswer').attr('maxlength', '7');
//});