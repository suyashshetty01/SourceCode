$(document).ready(function () {


    var InsuredName = $("#InsuredFirstName").val() + " " + $("#InsuredLastName").val();
    $("#AccountHolderName").val(InsuredName);

    //var countfatca = $("#FatcaCount").val();
    $('#TATAAIAContactCityID').change(function () {
        $("#ContactCityName").val($("#TATAAIAContactCityID option:selected").text());
    })

    $('#TATAAIAPermanentCityID').change(function () {
        $("#PermanentCityName").val($("#TATAAIAPermanentCityID option:selected").text());
    })
    var countfatca;
    $("#Beneficiary1RelationshipWithInsured").change(function () {
        $("#Beneficiary1RelationshipText").val($("#Beneficiary1RelationshipWithInsured option:selected").text());
    })

    $("#Beneficiary2RelationshipWithInsured").change(function () {
        $("#Beneficiary2RelationshipText").val($("#Beneficiary2RelationshipWithInsured option:selected").text());
    })

    $("#Beneficiary3RelationshipWithInsured").change(function () {
        $("#Beneficiary3RelationshipText").val($("#Beneficiary3RelationshipWithInsured option:selected").text());
    })

    $("#Beneficiary1RelationshipText").val($("#Beneficiary1RelationshipWithInsured option:selected").text());
    $("#Beneficiary2RelationshipText").val($("#Beneficiary2RelationshipWithInsured option:selected").text());
    $("#Beneficiary3RelationshipText").val($("#Beneficiary3RelationshipWithInsured option:selected").text());

    //$("#TermDeclaration").val("");
    //if ($("#QuestionId93").val() == 'Y' || $("#QuestionId93").val() == 'Yes') {
    //    $("#FamilyMemberCount").val(2);
    //}
    $("#FamilyMember1").val("96");
    $("#FamilyMember1").addClass('used');
    $("#FamilyMember2").val("97");
    $("#FamilyMember2").addClass('used');
    //Onload Setting Occupation Details Values
    var cardiojson = "";
    var Harmonaljson = "";
    var Respiratoryjson = "";
    var BloodCellularjson = "";
    var DigestiveRegulatoryjson = "";
    var MPNAjson = "";
    var NSMjson = "";
    var InfectiousContagiousjson = "";


    if ($("#TaxResidentofIndia").val() != "" || $("#TaxResidentofIndia").val() != null) {
        TaxResidentIndiaPerson($("#TaxResidentofIndia").val());
    }

    var NatureOfWork = $("#NatureOfWorkVal").val();
    if (NatureOfWork != "" || NatureOfWork != null) {
        //alert(NatureOfWork);
        //$("#NatureOfWork").val(NatureOfWork).html(NatureOfWork);
        $("#NatureOfWork option[value='" + NatureOfWork + "']").attr("selected", "selected");
    }
    $("#NatureOfWork").change(function () {
        if ($("#NatureOfWork").val() == "air rescue service" || $("#NatureOfWork").val() == "FIREMAN" || $("#NatureOfWork").val() == "handling hazardous chemical or explosive materials" || $("#NatureOfWork").val() == "Security Guard - Armed" || $("#NatureOfWork").val() == "Under water Diving (Deep Sea and Others)" || $("#NatureOfWork").val() == "Underground mining") {
            // $("#QuestionId1").val("Y");
            LifeStyleQuestionAns("QuestionId1", "Yes");
            $(".armforce").css("pointer-events", "none");
            // $("#Defence").show();
        } else {
            // $("#QuestionId1").val("N");
            LifeStyleQuestionAns("QuestionId1", "N");
            $(".armforce").css("pointer-events", "auto");
            // $("#Defence").hide();
        }
    })

    $(".chkCardio").click(function () {
        //
        $("#CardioTotalCheckbox").val("");
        var TotalCardioChk = $("#CardioTotalCheckbox").val();
        if ($("#HighBloodPressure").prop("checked") == true) {
            $("#HighBloodPressure").val(true);
            $("#HyperTension").show();
            TotalCardioChk = TotalCardioChk + "HighBloodPressure,";
            cardiojson = '{"HighBloodPressure":"true"},';
        } else {
            $("#HighBloodPressure").val(false);
            $("#HyperTension").hide();
            TotalCardioChk = TotalCardioChk.replace("HighBloodPressure,", "");
            cardiojson = '{"HighBloodPressure":"false"},';
        }

        if ($("#LowBloodPressure").prop("checked") == true) {
            $("#LowBloodPressure").val(true);
            TotalCardioChk = TotalCardioChk + "LowBloodPressure,";
            cardiojson = cardiojson + '{"LowBloodPressure":"true"},';
        } else {
            $("#LowBloodPressure").val(false);
            TotalCardioChk = TotalCardioChk.replace("LowBloodPressure,", "");
            cardiojson = cardiojson + '{"LowBloodPressure":"false"},';
        }

        if ($("#RaisedCholestrol").prop("checked") == true) {
            $("#RaisedCholestrol").val(true);
            TotalCardioChk = TotalCardioChk + "RaisedCholestrol,";
            cardiojson = cardiojson + '{"RaisedCholestrol":"true"},';
        } else {
            $("#RaisedCholestrol").val(false);
            TotalCardioChk = TotalCardioChk.replace("RaisedCholestrol,", "");
            cardiojson = cardiojson + '{"RaisedCholestrol":"false"},';
        }

        if ($("#ChestPain").prop("checked") == true) {
            $("#ChestPain").val(true);
            TotalCardioChk = TotalCardioChk + "ChestPain,";
            cardiojson = cardiojson + '{"ChestPain":"true"},';
        } else {
            $("#ChestPain").val(false);
            TotalCardioChk = TotalCardioChk.replace("ChestPain,", "");
            cardiojson = cardiojson + '{"ChestPain":"false"},';
        }

        if ($("#Palpitation").prop("checked") == true) {
            $("#Palpitation").val(true);
            TotalCardioChk = TotalCardioChk + "Palpitation,";
            cardiojson = cardiojson + '{"Palpitation":"true"},';
        } else {
            $("#Palpitation").val(false);
            TotalCardioChk = TotalCardioChk.replace("Palpitation,", "");
            cardiojson = cardiojson + '{"Palpitation":"false"},';
        }

        if ($("#RheumaticFever").prop("checked") == true) {
            $("#RheumaticFever").val(true);
            TotalCardioChk = TotalCardioChk + "RheumaticFever,";
            cardiojson = cardiojson + '{"RheumaticFever":"true"},';
        } else {
            $("#RheumaticFever").val(false);
            TotalCardioChk = TotalCardioChk.replace("RheumaticFever,", "");
            cardiojson = cardiojson + '{"RheumaticFever":"false"},';
        }

        if ($("#HeartMurmur").prop("checked") == true) {
            $("#HeartMurmur").val(true);
            TotalCardioChk = TotalCardioChk + "HeartMurmur,";
            cardiojson = cardiojson + '{"HeartMurmur":"true"},';
        } else {
            $("#HeartMurmur").val(false);
            TotalCardioChk = TotalCardioChk.replace("HeartMurmur", "");
            cardiojson = cardiojson + '{"HeartMurmur":"false"},';
        }
        if ($("#ShortnessofBreath").prop("checked") == true) {
            $("#ShortnessofBreath").val(true);
            TotalCardioChk = TotalCardioChk + "ShortnessofBreath,";
            cardiojson = cardiojson + '{"ShortnessofBreath":"true"},';
        } else {
            $("#ShortnessofBreath").val(false);
            TotalCardioChk = TotalCardioChk.replace("ShortnessofBreath", "");
            cardiojson = cardiojson + '{"ShortnessofBreath":"false"},';
        }
        if ($("#HeartAttack").prop("checked") == true) {
            $("#HeartAttack").val(true);
            TotalCardioChk = TotalCardioChk + "HeartAttack,";
            cardiojson = cardiojson + '{"HeartAttack":"true"},';
        } else {
            $("#HeartAttack").val(false);
            TotalCardioChk = TotalCardioChk.replace("HeartAttack", "");
            cardiojson = cardiojson + '{"HeartAttack":"false"},';
        }
        if ($("#Stroke").prop("checked") == true) {
            $("#Stroke").val(true);
            TotalCardioChk = TotalCardioChk + "Stroke,";
            cardiojson = cardiojson + '{"Stroke":"true"},';
        } else {
            $("#Stroke").val(false);
            TotalCardioChk = TotalCardioChk.replace("Stroke", "");
            cardiojson = cardiojson + '{"Stroke":"false"},';
        }
        if ($("#Anyotherheartcondition").prop("checked") == true) {
            $("#Anyotherheartcondition").val(true);
            TotalCardioChk = TotalCardioChk + "Anyotherheartcondition";
            cardiojson = cardiojson + '{"Anyotherheartcondition":"true"},';
        } else {
            $("#Anyotherheartcondition").val(false);
            TotalCardioChk = TotalCardioChk.replace("Anyotherheartcondition", "");
            cardiojson = cardiojson + '{"Anyotherheartcondition":"false"},';
        }
        $("#CardioTotalCheckbox").val(TotalCardioChk);
        $("#Cardiojson").val(cardiojson);
        console.log(TotalCardioChk);
        console.log(cardiojson);
        if ($("#LowBloodPressure").prop("checked") == true || $("#RaisedCholestrol").prop("checked") == true || $("#ChestPain").prop("checked") == true || $("#Palpitation").prop("checked") == true || $("#RheumaticFever").prop("checked") == true || $("#HeartMurmur").prop("checked") == true || $("#ShortnessofBreath").prop("checked") == true || $("#ShortnessofBreath").prop("checked") == true || $("#HeartAttack").prop("checked") == true || $("#Stroke").prop("checked") == true || $("#Stroke").prop("checked") == true || $("#Anyotherheartcondition").prop("checked") == true) {
            $(".CardioSub").show();
        } else {
            $(".CardioSub").hide();
        }
    });



    $(".chkHarmonal").click(function () {
        $("#HarmonalTotalCheckbox").val("");
        var TotalHarmonalChk = $("#HarmonalTotalCheckbox").val();
        if ($("#HighBloodSugar").prop("checked") == true && $("#QuestionId73").val() == "Y") {
            $("#HighBloodSugar").val(true);
            //$("#DiabetesReflexive").show();
            TotalHarmonalChk = TotalHarmonalChk + "HighBloodSugar,";
            Harmonaljson = '{"HighBloodSugar":"true"},';
        } else {
            $("#HighBloodSugar").val(false);
            //$("#DiabetesReflexive").hide();
            TotalHarmonalChk = TotalHarmonalChk.replace("HighBloodSugar,", "");
            Harmonaljson = '{"HighBloodSugar":"false"},';
        }

        if ($("#Diabetes").prop("checked") == true) {
            $("#Diabetes").val(true);
            TotalHarmonalChk = TotalHarmonalChk + "Diabetes,";
            Harmonaljson = Harmonaljson + '{"Diabetes":"true"},';
            $("#DiabetesReflexive").show();
        } else {
            $("#Diabetes").val(false);
            TotalHarmonalChk = TotalHarmonalChk.replace("Diabetes,", "");
            Harmonaljson = Harmonaljson + '{"Diabetes":"false"},';
            $("#DiabetesReflexive").hide();
        }

        if ($("#Thyroidorendocrinedisorder").prop("checked") == true) {
            $("#Thyroidorendocrinedisorder").val(true);
            TotalHarmonalChk = TotalHarmonalChk + "Thyroidorendocrinedisorder,";
            Harmonaljson = Harmonaljson + '{"Thyroidorendocrinedisorder":"true"},';
        } else {
            $("#Thyroidorendocrinedisorder").val(false);
            TotalHarmonalChk = TotalHarmonalChk.replace("Thyroidorendocrinedisorder,", "");
            Harmonaljson = Harmonaljson + '{"Thyroidorendocrinedisorder":"false"},';
        }

        if ($("#SugarInUrine").prop("checked") == true) {
            $("#SugarInUrine").val(true);
            TotalHarmonalChk = TotalHarmonalChk + "SugarInUrine,";
            Harmonaljson = Harmonaljson + '{"SugarInUrine":"true"},';
        } else {
            $("#SugarInUrine").val(false);
            TotalHarmonalChk = TotalHarmonalChk.replace("SugarInUrine,", "");
            Harmonaljson = Harmonaljson + '{"SugarInUrine":"false"},';
        }

        if ($("#AnyOtherHarmonalDisorder").prop("checked") == true) {
            $("#AnyOtherHarmonalDisorder").val(true);
            TotalHarmonalChk = TotalHarmonalChk + "AnyOtherHarmonalDisorder";
            Harmonaljson = Harmonaljson + '{"AnyOtherHarmonalDisorder":"true"}';
        } else {
            $("#AnyOtherHarmonalDisorder").val(false);
            TotalHarmonalChk = TotalHarmonalChk.replace("AnyOtherHarmonalDisorder", "");
            Harmonaljson = Harmonaljson + '{"AnyOtherHarmonalDisorder":"false"}';
        }
        $("#HarmonalTotalCheckbox").val(TotalHarmonalChk);
        $("#Harmonaljson").val(Harmonaljson);
        console.log(TotalHarmonalChk);
        console.log(Harmonaljson);
        if ($("#HighBloodSugar").prop("checked") == true || $("#Thyroidorendocrinedisorder").prop("checked") == true || $("#SugarInUrine").prop("checked") == true || $("#AnyOtherHarmonalDisorder").prop("checked") == true) {
            $(".HARMONALSub").show();
        } else {
            $(".HARMONALSub").hide();
        }
    });



    $(".chkRespiratory").click(function () {

        $("#RespiratoryTotalCheckbox").val("");
        var TotalRespiratoryChk = $("#RespiratoryTotalCheckbox").val();
        if ($("#Asthama").prop("checked") == true) {
            $("#Asthama").val(true);

            TotalRespiratoryChk = TotalRespiratoryChk + "Asthama,";
            Respiratoryjson = '{"Asthama":"true"},';
        } else {
            $("#Asthama").val(false);

            TotalRespiratoryChk = TotalRespiratoryChk.replace("Asthama,", "");
            Respiratoryjson = '{"Asthama":"false"},';
        }

        if ($("#Tuberculosis").prop("checked") == true) {
            $("#Tuberculosis").val(true);
            TotalRespiratoryChk = TotalRespiratoryChk + "Tuberculosis,";
            Respiratoryjson = Respiratoryjson + '{"Tuberculosis":"true"},';
        } else {
            $("#Tuberculosis").val(false);
            TotalRespiratoryChk = TotalRespiratoryChk.replace("Tuberculosis,", "");
            Respiratoryjson = Respiratoryjson + '{"Tuberculosis":"false"},';
        }

        if ($("#chronic").prop("checked") == true) {
            $("#chronic").val(true);
            TotalRespiratoryChk = TotalRespiratoryChk + "chronic,";
            Respiratoryjson = Respiratoryjson + '{"chronic":"true"},';
        } else {
            $("#chronic").val(false);
            TotalRespiratoryChk = TotalRespiratoryChk.replace("chronic,", "");
            Respiratoryjson = Respiratoryjson + '{"chronic":"false"},';
        }

        if ($("#AnyOtherRespiratoryDisorder").prop("checked") == true) {
            $("#AnyOtherRespiratoryDisorder").val(true);
            TotalRespiratoryChk = TotalRespiratoryChk + "AnyOtherRespiratoryDisorder";
            Respiratoryjson = Respiratoryjson + '{"AnyOtherRespiratoryDisorder":"true"}';
        } else {
            $("#AnyOtherRespiratoryDisorder").val(false);
            TotalRespiratoryChk = TotalRespiratoryChk.replace("AnyOtherRespiratoryDisorder", "");
            Respiratoryjson = Respiratoryjson + '{"AnyOtherRespiratoryDisorder":"false"}';
        }
        $("#RespiratoryTotalCheckbox").val(TotalRespiratoryChk);
        $("#Respiratoryjson").val(Respiratoryjson);
        console.log(TotalRespiratoryChk);
        console.log(Respiratoryjson);
        if ($("#Asthama").prop("checked") == true || $("#Tuberculosis").prop("checked") == true || $("#chronic").prop("checked") == true || $("#AnyOtherRespiratoryDisorder").prop("checked") == true) {
            $(".RespiratorySub").show();
        } else {
            $(".RespiratorySub").hide();
        }
    });



    $(".chkBloodCellular").click(function () {
        $("#BloodCellularTotalCheckbox").val("");
        var TotalBloodCellularChk = $("#BloodCellularTotalCheckbox").val();
        if ($("#Cancer").prop("checked") == true) {
            $("#Cancer").val(true);

            TotalBloodCellularChk = TotalBloodCellularChk + "Cancer,";
            BloodCellularjson = '{"Cancer":"true"},';
        } else {
            $("#Cancer").val(false);
            TotalBloodCellularChk = TotalBloodCellularChk.replace("Cancer,", "");
            BloodCellularjson = '{"Cancer":"false"},';
        }

        if ($("#TumororMaligantGrowth").prop("checked") == true) {
            $("#TumororMaligantGrowth").val(true);
            TotalBloodCellularChk = TotalBloodCellularChk + "TumororMaligantGrowth,";
            BloodCellularjson = BloodCellularjson + '{"TumororMaligantGrowth":"true"},';
        } else {
            $("#TumororMaligantGrowth").val(false);
            TotalBloodCellularChk = TotalBloodCellularChk.replace("TumororMaligantGrowth,", "");
            BloodCellularjson = BloodCellularjson + '{"TumororMaligantGrowth":"false"},';
        }

        if ($("#Lukemia").prop("checked") == true) {
            $("#Lukemia").val(true);
            TotalBloodCellularChk = TotalBloodCellularChk + "Lukemia,";
            BloodCellularjson = BloodCellularjson + '{"Lukemia":"true"},';
        } else {
            $("#Lukemia").val(false);
            TotalBloodCellularChk = TotalBloodCellularChk.replace("Lukemia,", "");
            BloodCellularjson = BloodCellularjson + '{"Lukemia":"false"},';
        }

        if ($("#Anemia").prop("checked") == true) {
            $("#Anemia").val(true);
            TotalBloodCellularChk = TotalBloodCellularChk + "Anemia,";
            BloodCellularjson = BloodCellularjson + '{"Anemia":"true"},';
        } else {
            $("#Anemia").val(false);
            TotalBloodCellularChk = TotalBloodCellularChk.replace("Anemia,", "");
            BloodCellularjson = BloodCellularjson + '{"Anemia":"false"},';
        }

        if ($("#Enlargelymphnodes").prop("checked") == true) {
            $("#Enlargelymphnodes").val(true);
            TotalBloodCellularChk = TotalBloodCellularChk + "Enlargelymphnodes,";
            BloodCellularjson = BloodCellularjson + '{"Enlargelymphnodes":"true"},';
        } else {
            $("#Enlargelymphnodes").val(false);
            TotalBloodCellularChk = TotalBloodCellularChk.replace("Enlargelymphnodes,", "");
            BloodCellularjson = BloodCellularjson + '{"Enlargelymphnodes":"false"},';
        }

        if ($("#AnyBloodDisorder").prop("checked") == true) {
            $("#AnyBloodDisorder").val(true);
            TotalBloodCellularChk = TotalBloodCellularChk + "AnyBloodDisorder";
            BloodCellularjson = BloodCellularjson + '{"AnyBloodDisorder":"true"}';
        } else {
            $("#AnyBloodDisorder").val(false);
            TotalBloodCellularChk = TotalBloodCellularChk.replace("AnyBloodDisorder", "");
            BloodCellularjson = BloodCellularjson + '{"AnyBloodDisorder":"false"}';
        }
        $("#BloodCellularTotalCheckbox").val(TotalBloodCellularChk);
        $("#BloodCellularjson").val(BloodCellularjson);
        console.log(TotalBloodCellularChk);
        console.log(BloodCellularjson);
        if ($("#Cancer").prop("checked") == true || $("#TumororMaligantGrowth").prop("checked") == true || $("#Lukemia").prop("checked") == true || $("#Anemia").prop("checked") == true || $("#Enlargelymphnodes").prop("checked") == true || $("#AnyBloodDisorder").prop("checked") == true) {
            $(".BloodCellularSub").show();
        } else {
            $(".BloodCellularSub").hide();
        }
    });



    $(".chkDigestiveRegulatory").click(function () {
        $("#DigestiveRegulatoryTotalCheckbox").val("");
        var TotalDigestiveRegulatoryChk = $("#DigestiveRegulatoryTotalCheckbox").val();
        if ($("#Recurrentindigestion").prop("checked") == true) {
            $("#Recurrentindigestion").val(true);
            TotalDigestiveRegulatoryChk = TotalDigestiveRegulatoryChk + "Recurrentindigestion,";
            DigestiveRegulatoryjson = '{"Recurrentindigestion":"true"},';
        } else {
            $("#Recurrentindigestion").val(false);
            TotalDigestiveRegulatoryChk = TotalDigestiveRegulatoryChk.replace("Recurrentindigestion,", "");
            DigestiveRegulatoryjson = '{"Recurrentindigestion":"false"},';
        }

        if ($("#Gastritis").prop("checked") == true) {
            $("#Gastritis").val(true);
            TotalDigestiveRegulatoryChk = TotalDigestiveRegulatoryChk + "Gastritis,";
            DigestiveRegulatoryjson = DigestiveRegulatoryjson + '{"Gastritis":"true"},';
        } else {
            $("#Gastritis").val(false);
            TotalDigestiveRegulatoryChk = TotalDigestiveRegulatoryChk.replace("Gastritis,", "");
            DigestiveRegulatoryjson = DigestiveRegulatoryjson + '{"Gastritis":"false"},';
        }

        if ($("#StomachorDuodenalUlcer").prop("checked") == true) {
            $("#StomachorDuodenalUlcer").val(true);
            TotalDigestiveRegulatoryChk = TotalDigestiveRegulatoryChk + "StomachorDuodenalUlcer,";
            DigestiveRegulatoryjson = DigestiveRegulatoryjson + '{"StomachorDuodenalUlcer":"true"},';
        } else {
            $("#StomachorDuodenalUlcer").val(false);
            TotalDigestiveRegulatoryChk = TotalDigestiveRegulatoryChk.replace("StomachorDuodenalUlcer,", "");
            DigestiveRegulatoryjson = DigestiveRegulatoryjson + '{"StomachorDuodenalUlcer":"false"},';
        }

        if ($("#Harnia").prop("checked") == true) {
            $("#Harnia").val(true);
            TotalDigestiveRegulatoryChk = TotalDigestiveRegulatoryChk + "Harnia,";
            DigestiveRegulatoryjson = DigestiveRegulatoryjson + '{"Harnia":"true"},';
        } else {
            $("#Harnia").val(false);
            TotalDigestiveRegulatoryChk = TotalDigestiveRegulatoryChk.replace("Harnia,", "");
            DigestiveRegulatoryjson = DigestiveRegulatoryjson + '{"Harnia":"false"},';
        }

        if ($("#Jaundice").prop("checked") == true) {
            $("#Jaundice").val(true);
            TotalDigestiveRegulatoryChk = TotalDigestiveRegulatoryChk + "Jaundice,";
            DigestiveRegulatoryjson = DigestiveRegulatoryjson + '{"Jaundice":"true"},';
        } else {
            $("#Jaundice").val(false);
            TotalDigestiveRegulatoryChk = TotalDigestiveRegulatoryChk.replace("Jaundice,", "");
            DigestiveRegulatoryjson = DigestiveRegulatoryjson + '{"Jaundice":"false"},';
        }

        if ($("#Disorderoftheliver").prop("checked") == true) {
            $("#Disorderoftheliver").val(true);
            TotalDigestiveRegulatoryChk = TotalDigestiveRegulatoryChk + "Disorderoftheliver,";
            DigestiveRegulatoryjson = DigestiveRegulatoryjson + '{"Disorderoftheliver":"true"},';
        } else {
            $("#Disorderoftheliver").val(false);
            TotalDigestiveRegulatoryChk = TotalDigestiveRegulatoryChk.replace("Disorderoftheliver,", "");
            DigestiveRegulatoryjson = DigestiveRegulatoryjson + '{"Disorderoftheliver":"false"},';
        }

        if ($("#CirrhosisandGastrointestinalSystem").prop("checked") == true) {
            $("#CirrhosisandGastrointestinalSystem").val(true);
            TotalDigestiveRegulatoryChk = TotalDigestiveRegulatoryChk + "CirrhosisandGastrointestinalSystem,";
            DigestiveRegulatoryjson = DigestiveRegulatoryjson + '{"CirrhosisandGastrointestinalSystem":"true"},';
        } else {
            $("#CirrhosisandGastrointestinalSystem").val(false);
            TotalDigestiveRegulatoryChk = TotalDigestiveRegulatoryChk.replace("CirrhosisandGastrointestinalSystem,", "");
            DigestiveRegulatoryjson = DigestiveRegulatoryjson + '{"CirrhosisandGastrointestinalSystem":"false"},';
        }

        if ($("#AnyOtherDisease").prop("checked") == true) {
            $("#AnyOtherDisease").val(true);
            TotalDigestiveRegulatoryChk = TotalDigestiveRegulatoryChk + "AnyOtherDisease";
            DigestiveRegulatoryjson = DigestiveRegulatoryjson + '{"AnyOtherDisease":"true"}';
        } else {
            $("#AnyOtherDisease").val(false);
            TotalDigestiveRegulatoryChk = TotalDigestiveRegulatoryChk.replace("AnyOtherDisease", "");
            DigestiveRegulatoryjson = DigestiveRegulatoryjson + '{"AnyOtherDisease":"false"}';
        }
        $("#DigestiveRegulatoryTotalCheckbox").val(TotalDigestiveRegulatoryChk);
        $("#DigestiveRegulatoryjson").val(DigestiveRegulatoryjson);
        console.log(TotalDigestiveRegulatoryChk);
        console.log(DigestiveRegulatoryjson);
        if ($("#Recurrentindigestion").prop("checked") == true || $("#Gastritis").prop("checked") == true || $("#StomachorDuodenalUlcer").prop("checked") == true || $("#Harnia").prop("checked") == true || $("#Jaundice").prop("checked") == true || $("#Disorderoftheliver").prop("checked") == true || $("#CirrhosisandGastrointestinalSystem").prop("checked") == true || $("#CirrhosisandGastrointestinalSystem").prop("checked") == true || $("#AnyOtherDisease").prop("checked") == true) {
            $(".DigestiveRegulatorySub").show();
        } else {
            $(".DigestiveRegulatorySub").hide();
        }
    });



    $(".chkMPNA").click(function () {
        $("#MPNATotalCheckbox").val("");
        var TotalMPNAChk = $("#MPNATotalCheckbox").val();
        if ($("#BrainDepression").prop("checked") == true) {
            $("#BrainDepression").val(true);
            TotalMPNAChk = TotalMPNAChk + "BrainDepression,";
            MPNAjson = '{"BrainDepression":"true"},';
        } else {
            $("#BrainDepression").val(false);
            TotalMPNAChk = TotalMPNAChk.replace("BrainDepression,", "");
            MPNAjson = '{"BrainDepression":"false"},';
        }

        if ($("#Anixtey").prop("checked") == true) {
            $("#Anixtey").val(true);
            TotalMPNAChk = TotalMPNAChk + "Anixtey,";
            MPNAjson = MPNAjson + '{"Anixtey":"true"},';
        } else {
            $("#Anixtey").val(false);
            TotalMPNAChk = TotalMPNAChk.replace("Anixtey,", "");
            MPNAjson = MPNAjson + '{"Anixtey":"false"},';
        }

        if ($("#BrainDisorder").prop("checked") == true) {
            $("#BrainDisorder").val(true);
            TotalMPNAChk = TotalMPNAChk + "BrainDisorder,";
            MPNAjson = MPNAjson + '{"BrainDisorder":"true"},';
        } else {
            $("#BrainDisorder").val(false);
            TotalMPNAChk = TotalMPNAChk.replace("BrainDisorder,", "");
            MPNAjson = MPNAjson + '{"BrainDisorder":"false"},';
        }

        if ($("#Mental").prop("checked") == true) {
            $("#Mental").val(true);
            TotalMPNAChk = TotalMPNAChk + "Mental,";
            MPNAjson = MPNAjson + '{"Mental":"true"},';
        } else {
            $("#Mental").val(false);
            TotalMPNAChk = TotalMPNAChk.replace("Mental,", "");
            MPNAjson = MPNAjson + '{"Mental":"false"},';
        }

        if ($("#Phychiatric").prop("checked") == true) {
            $("#Phychiatric").val(true);
            TotalMPNAChk = TotalMPNAChk + "Phychiatric,";
            MPNAjson = MPNAjson + '{"Phychiatric":"true"},';
        } else {
            $("#Phychiatric").val(false);
            TotalMPNAChk = TotalMPNAChk.replace("Phychiatric,", "");
            MPNAjson = MPNAjson + '{"Phychiatric":"false"},';
        }

        if ($("#Transientischemicattack").prop("checked") == true) {
            $("#Transientischemicattack").val(true);
            TotalMPNAChk = TotalMPNAChk + "Transientischemicattack,";
            MPNAjson = MPNAjson + '{"Transientischemicattack":"true"},';
        } else {
            $("#Transientischemicattack").val(false);
            TotalMPNAChk = TotalMPNAChk.replace("Transientischemicattack,", "");
            MPNAjson = MPNAjson + '{"Transientischemicattack":"false"},';
        }

        if ($("#ParkinsonsDieases").prop("checked") == true) {
            $("#ParkinsonsDieases").val(true);
            TotalMPNAChk = TotalMPNAChk + "ParkinsonsDieases,";
            MPNAjson = MPNAjson + '{"ParkinsonsDieases":"true"},';
        } else {
            $("#ParkinsonsDieases").val(false);
            TotalMPNAChk = TotalMPNAChk.replace("ParkinsonsDieases,", "");
            MPNAjson = MPNAjson + '{"ParkinsonsDieases":"false"},';
        }

        if ($("#MultipleScierosis").prop("checked") == true) {
            $("#MultipleScierosis").val(true);
            TotalMPNAChk = TotalMPNAChk + "MultipleScierosis,";
            MPNAjson = MPNAjson + '{"MultipleScierosis":"true"},';
        } else {
            $("#MultipleScierosis").val(false);
            TotalMPNAChk = TotalMPNAChk.replace("MultipleScierosis,", "");
            MPNAjson = MPNAjson + '{"MultipleScierosis":"false"},';
        }

        if ($("#Paralysis").prop("checked") == true) {
            $("#Paralysis").val(true);
            TotalMPNAChk = TotalMPNAChk + "Paralysis,";
            MPNAjson = MPNAjson + '{"Paralysis":"true"},';
        } else {
            $("#Paralysis").val(false);
            TotalMPNAChk = TotalMPNAChk.replace("Paralysis,", "");
            MPNAjson = MPNAjson + '{"Paralysis":"false"},';
        }

        if ($("#Epilepsy").prop("checked") == true) {
            $("#Epilepsy").val(true);
            TotalMPNAChk = TotalMPNAChk + "Epilepsy,";
            MPNAjson = MPNAjson + '{"Epilepsy":"true"},';
        } else {
            $("#Epilepsy").val(false);
            TotalMPNAChk = TotalMPNAChk.replace("Epilepsy,", "");
            MPNAjson = MPNAjson + '{"Epilepsy":"false"},';
        }

        if ($("#phychiatricailment").prop("checked") == true) {
            $("#phychiatricailment").val(true);
            TotalMPNAChk = TotalMPNAChk + "phychiatricailment";
            MPNAjson = MPNAjson + '{"phychiatricailment":"true"}';
        } else {
            $("#phychiatricailment").val(false);
            TotalMPNAChk = TotalMPNAChk.replace("phychiatricailment", "");
            MPNAjson = MPNAjson + '{"phychiatricailment":"false"}';
        }
        $("#MPNATotalCheckbox").val(TotalMPNAChk);
        $("#MPNAjson").val(MPNAjson);
        console.log(TotalMPNAChk);
        console.log(MPNAjson);
        if ($("#BrainDepression").prop("checked") == true || $("#Anixtey").prop("checked") == true || $("#BrainDisorder").prop("checked") == true || $("#Mental").prop("checked") == true || $("#Phychiatric").prop("checked") == true || $("#Transientischemicattack").prop("checked") == true || $("#ParkinsonsDieases").prop("checked") == true || $("#MultipleScierosis").prop("checked") == true || $("#Paralysis").prop("checked") == true || $("#Epilepsy").prop("checked") == true || $("#phychiatricailment").prop("checked") == true) {
            $(".MPNASub").show();
        } else {
            $(".MPNASub").hide();
        }
    });



    $(".chkNSM").click(function () {
        //
        $("#NSMTotalCheckbox").val("");
        var TotalNSMChk = $("#NSMTotalCheckbox").val();
        if ($("#Musculoskeletaldisorder").prop("checked") == true) {
            $("#Musculoskeletaldisorder").val(true);
            TotalNSMChk = TotalNSMChk + "Musculoskeletaldisorder,";
            NSMjson = '{"Musculoskeletaldisorder":"true"},';
        } else {
            $("#Musculoskeletaldisorder").val(false);
            TotalNSMChk = TotalNSMChk.replace("Musculoskeletaldisorder,", "");
            NSMjson = '{"Musculoskeletaldisorder":"false"},';
        }
        if ($("#RecurrentBackPain").prop("checked") == true) {
            $("#RecurrentBackPain").val(true);
            TotalNSMChk = TotalNSMChk + "RecurrentBackPain,";
            NSMjson = NSMjson + '{"RecurrentBackPain":"true"},';
        } else {
            $("#RecurrentBackPain").val(false);
            TotalNSMChk = TotalNSMChk.replace("RecurrentBackPain,", "");
            NSMjson = NSMjson + '{"RecurrentBackPain":"false"},';
        }
        if ($("#Musculardystrophies").prop("checked") == true) {
            $("#Musculardystrophies").val(true);
            TotalNSMChk = TotalNSMChk + "Musculardystrophies,";
            NSMjson = NSMjson + '{"Musculardystrophies":"true"},';
        } else {
            $("#Musculardystrophies").val(false);
            TotalNSMChk = TotalNSMChk.replace("Musculardystrophies,", "");
            NSMjson = NSMjson + '{"Musculardystrophies":"false"},';
        }
        if ($("#Musculoskeletaldeformities").prop("checked") == true) {
            $("#Musculoskeletaldeformities").val(true);
            TotalNSMChk = TotalNSMChk + "Musculoskeletaldeformities,";
            NSMjson = NSMjson + '{"Musculoskeletaldeformities":"true"},';
        } else {
            $("#Musculoskeletaldeformities").val(false);
            TotalNSMChk = TotalNSMChk.replace("Musculoskeletaldeformities,", "");
            NSMjson = NSMjson + '{"Musculoskeletaldeformities":"false"},';
        }
        if ($("#Slippeddisc").prop("checked") == true) {
            $("#Slippeddisc").val(true);
            TotalNSMChk = TotalNSMChk + "Slippeddisc,";
            NSMjson = NSMjson + '{"Slippeddisc":"true"},';
        } else {
            $("#Slippeddisc").val(false);
            TotalNSMChk = TotalNSMChk.replace("Slippeddisc,", "");
            NSMjson = NSMjson + '{"Slippeddisc":"false"},';
        }
        if ($("#DisordersofEyeEarNoseThroat").prop("checked") == true) {
            $("#DisordersofEyeEarNoseThroat").val(true);
            TotalNSMChk = TotalNSMChk + "DisordersofEyeEarNoseThroat,";
            NSMjson = NSMjson + '{"DisordersofEyeEarNoseThroat":"true"},';
        } else {
            $("#DisordersofEyeEarNoseThroat").val(false);
            TotalNSMChk = TotalNSMChk.replace("DisordersofEyeEarNoseThroat,", "");
            NSMjson = NSMjson + '{"DisordersofEyeEarNoseThroat":"false"},';
        }
        if ($("#Disordersofspeech").prop("checked") == true) {
            $("#Disordersofspeech").val(true);
            TotalNSMChk = TotalNSMChk + "Disordersofspeech,";
            NSMjson = NSMjson + '{"Disordersofspeech":"true"},';
        } else {
            $("#Disordersofspeech").val(false);
            TotalNSMChk = TotalNSMChk.replace("Disordersofspeech,", "");
            NSMjson = NSMjson + '{"Disordersofspeech":"false"},';
        }
        if ($("#AnyOtherDisorder").prop("checked") == true) {
            $("#AnyOtherDisorder").val(true);
            TotalNSMChk = TotalNSMChk + "AnyOtherDisorder,";
            NSMjson = NSMjson + '{"AnyOtherDisorder":"true"},';
        } else {
            $("#AnyOtherDisorder").val(false);
            TotalNSMChk = TotalNSMChk.replace("AnyOtherDisorder,", "");
            NSMjson = NSMjson + '{"AnyOtherDisorder":"false"},';
        }

        $("#NSMTotalCheckbox").val(TotalNSMChk);
        $("#NSMjson").val(NSMjson);
        console.log(TotalNSMChk);
        console.log(NSMjson);
        if ($("#Musculoskeletaldisorder").prop("checked") == true || $("#RecurrentBackPain").prop("checked") == true || $("#Musculardystrophies").prop("checked") == true || $("#Musculoskeletaldeformities").prop("checked") == true || $("#Slippeddisc").prop("checked") == true || $("#DisordersofEyeEarNoseThroat").prop("checked") == true || $("#Disordersofspeech").prop("checked") == true || $("#AnyOtherDisorder").prop("checked") == true) {
            $(".NSMSub").show();
        } else {
            $(".NSMSub").hide();
        }
    });



    $(".chkInfectiousContagious").click(function () {
        //
        $("#InfectiousContagiousTotalCheckbox").val("");
        var TotalInfectiousContagiousChk = $("#InfectiousContagiousTotalCheckbox").val();
        if ($("#WereyouoryourspouseevertestedforHepatitisB").prop("checked") == true) {
            $("#WereyouoryourspouseevertestedforHepatitisB").val(true);
            TotalInfectiousContagiousChk = TotalInfectiousContagiousChk + "WereyouoryourspouseevertestedforHepatitisB,";
            InfectiousContagiousjson = '{"WereyouoryourspouseevertestedforHepatitisB":"true"},';
        } else {
            $("#WereyouoryourspouseevertestedforHepatitisB").val(false);
            TotalInfectiousContagiousChk = TotalInfectiousContagiousChk.replace("WereyouoryourspouseevertestedforHepatitisB,", "");
            InfectiousContagiousjson = '{"WereyouoryourspouseevertestedforHepatitisB":"false"},';
        }
        if ($("#WereyouoryourspouseevertestedforHepatitisC").prop("checked") == true) {
            $("#WereyouoryourspouseevertestedforHepatitisC").val(true);
            TotalInfectiousContagiousChk = TotalInfectiousContagiousChk + "WereyouoryourspouseevertestedforHepatitisC,";
            InfectiousContagiousjson = InfectiousContagiousjson + '{"WereyouoryourspouseevertestedforHepatitisC":"true"},';
        } else {
            $("#WereyouoryourspouseevertestedforHepatitisC").val(false);
            TotalInfectiousContagiousChk = TotalInfectiousContagiousChk.replace("WereyouoryourspouseevertestedforHepatitisC,", "");
            InfectiousContagiousjson = InfectiousContagiousjson + '{"WereyouoryourspouseevertestedforHepatitisC":"false"},';
        }
        if ($("#chkInfectiousContagious").prop("checked") == true) {
            $("#chkInfectiousContagious").val(true);
            TotalInfectiousContagiousChk = TotalInfectiousContagiousChk + "chkInfectiousContagious,";
            InfectiousContagiousjson = InfectiousContagiousjson + '{"chkInfectiousContagious":"true"},';
        } else {
            $("#chkInfectiousContagious").val(false);
            TotalInfectiousContagiousChk = TotalInfectiousContagiousChk.replace("chkInfectiousContagious,", "");
            InfectiousContagiousjson = InfectiousContagiousjson + '{"chkInfectiousContagious":"false"},';
        }
        if ($("#HIV").prop("checked") == true) {
            $("#HIV").val(true);
            TotalInfectiousContagiousChk = TotalInfectiousContagiousChk + "HIV,";
            InfectiousContagiousjson = InfectiousContagiousjson + '{"HIV":"true"},';
        } else {
            $("#HIV").val(false);
            TotalInfectiousContagiousChk = TotalInfectiousContagiousChk.replace("HIV,", "");
            InfectiousContagiousjson = InfectiousContagiousjson + '{"HIV":"false"},';
        }
        if ($("#AnyOtherDisorderInfectiousContagious").prop("checked") == true) {
            $("#AnyOtherDisorderInfectiousContagious").val(true);
            TotalInfectiousContagiousChk = TotalInfectiousContagiousChk + "AnyOtherDisorderInfectiousContagious,";
            InfectiousContagiousjson = InfectiousContagiousjson + '{"AnyOtherDisorderInfectiousContagious":"true"},';
        } else {
            $("#AnyOtherDisorderInfectiousContagious").val(false);
            TotalInfectiousContagiousChk = TotalInfectiousContagiousChk.replace("AnyOtherDisorderInfectiousContagious,", "");
            InfectiousContagiousjson = InfectiousContagiousjson + '{"AnyOtherDisorderInfectiousContagious":"false"},';
        }
        $("#InfectiousContagiousTotalCheckbox").val(TotalInfectiousContagiousChk);
        $("#InfectiousContagiousjson").val(InfectiousContagiousjson);
        console.log(TotalInfectiousContagiousChk);
        console.log(InfectiousContagiousjson);
        if ($("#WereyouoryourspouseevertestedforHepatitisB").prop("checked") == true || $("#WereyouoryourspouseevertestedforHepatitisC").prop("checked") == true || $("#chkInfectiousContagious").prop("checked") == true || $("#AnyOtherDisorderInfectiousContagious").prop("checked") == true || $("#HIV").prop("checked") == true) {
            $(".InfectiousContagiousSub").show();
        } else {
            $(".InfectiousContagiousSub").hide();
        }
    })



    $(".chkGenitourinary").click(function () {
        //
        $("#GenitourinaryTotalCheckbox").val("");
        var TotalGenitourinaryChk = $("#GenitourinaryTotalCheckbox").val();
        if ($("#Hydrocele").prop("checked") == true) {
            $("#Hydrocele").val(true);
            TotalGenitourinaryChk = TotalGenitourinaryChk + "Hydrocele,";
            Genitourinaryjson = '{"Hydrocele":"true"},';
        } else {
            $("#Hydrocele").val(false);
            TotalGenitourinaryChk = TotalGenitourinaryChk.replace("Hydrocele,", "");
            Genitourinaryjson = '{"Hydrocele":"false"},';
        }
        if ($("#Fistula").prop("checked") == true) {
            $("#Fistula").val(true);
            TotalGenitourinaryChk = TotalGenitourinaryChk + "Fistula,";
            Genitourinaryjson = Genitourinaryjson + '{"Fistula":"true"},';
        } else {
            $("#Fistula").val(false);
            TotalGenitourinaryChk = TotalGenitourinaryChk.replace("Fistula,", "");
            Genitourinaryjson = Genitourinaryjson + '{"Fistula":"false"},';
        }
        if ($("#Piles").prop("checked") == true) {
            $("#Piles").val(true);
            TotalGenitourinaryChk = TotalGenitourinaryChk + "Piles,";
            Genitourinaryjson = Genitourinaryjson + '{"Piles":"true"},';
        } else {
            $("#Piles").val(false);
            TotalGenitourinaryChk = TotalGenitourinaryChk.replace("Piles,", "");
            Genitourinaryjson = Genitourinaryjson + '{"Piles":"false"},';
        }
        if ($("#Sysmptomsorailmentrealtingofkidney").prop("checked") == true) {
            $("#Sysmptomsorailmentrealtingofkidney").val(true);
            TotalGenitourinaryChk = TotalGenitourinaryChk + "Sysmptomsorailmentrealtingofkidney,";
            Genitourinaryjson = Genitourinaryjson + '{"Sysmptomsorailmentrealtingofkidney":"true"},';
        } else {
            $("#Sysmptomsorailmentrealtingofkidney").val(false);
            TotalGenitourinaryChk = TotalGenitourinaryChk.replace("Sysmptomsorailmentrealtingofkidney,", "");
            Genitourinaryjson = Genitourinaryjson + '{"Sysmptomsorailmentrealtingofkidney":"false"},';
        }
        if ($("#KidneyStones").prop("checked") == true) {
            $("#KidneyStones").val(true);
            TotalGenitourinaryChk = TotalGenitourinaryChk + "KidneyStones,";
            Genitourinaryjson = Genitourinaryjson + '{"KidneyStones":"true"},';
        } else {
            $("#KidneyStones").val(false);
            TotalGenitourinaryChk = TotalGenitourinaryChk.replace("KidneyStones,", "");
            Genitourinaryjson = Genitourinaryjson + '{"KidneyStones":"false"},';
        }
        if ($("#ProsateUrinarySystemorReproductiveSystem").prop("checked") == true) {
            $("#ProsateUrinarySystemorReproductiveSystem").val(true);
            TotalGenitourinaryChk = TotalGenitourinaryChk + "ProsateUrinarySystemorReproductiveSystem,";
            Genitourinaryjson = Genitourinaryjson + '{"ProsateUrinarySystemorReproductiveSystem":"true"},';
        } else {
            $("#ProsateUrinarySystemorReproductiveSystem").val(false);
            TotalGenitourinaryChk = TotalGenitourinaryChk.replace("ProsateUrinarySystemorReproductiveSystem,", "");
            Genitourinaryjson = Genitourinaryjson + '{"ProsateUrinarySystemorReproductiveSystem":"false"},';
        }
        if ($("#AnyOtherDisorderGenitourinary").prop("checked") == true) {
            $("#AnyOtherDisorderGenitourinary").val(true);
            TotalGenitourinaryChk = TotalGenitourinaryChk + "AnyOtherDisorderGenitourinary,";
            Genitourinaryjson = Genitourinaryjson + '{"AnyOtherDisorderGenitourinary":"true"},';
        } else {
            $("#AnyOtherDisorderGenitourinary").val(false);
            TotalGenitourinaryChk = TotalGenitourinaryChk.replace("AnyOtherDisorderGenitourinary,", "");
            Genitourinaryjson = Genitourinaryjson + '{"AnyOtherDisorderGenitourinary":"false"},';
        }
        $("#GenitourinaryTotalCheckbox").val(TotalGenitourinaryChk);
        $("#Genitourinaryjson").val(Genitourinaryjson);
        console.log(TotalGenitourinaryChk);
        console.log(Genitourinaryjson);
        if ($("#Hydrocele").prop("checked") == true || $("#Fistula").prop("checked") == true || $("#Fistula").prop("checked") == true || $("#Piles").prop("checked") == true || $("#Sysmptomsorailmentrealtingofkidney").prop("checked") == true || $("#KidneyStones").prop("checked") == true || $("#ProsateUrinarySystemorReproductiveSystem").prop("checked") == true || $("#AnyOtherDisorderGenitourinary").prop("checked") == true) {
            $(".GenitourinarySub").show();
        } else {
            $(".GenitourinarySub").hide();
        }
    })




    if ($("#QuestionId3").val() == "Hobbies") {
        $("#HobbiesDiv").show();
    } else {
        $("#HobbiesDiv").hide();
    }

    if ($("#QuestionId3").val() == "Occupation") {
        $("#OccupationReflexive").show();
    } else {
        $("#OccupationReflexive").hide();
    }

    if ($("#ContactPinCode").val() != "") {
        GetPincodeDetails($("#ContactPinCode").val());


    }




    $("#Cardio").val(null);
    $("#HARMONAL").val(null);
    $("#RESPIRATORY").val(null);
    $("#BLOODCELLULAR").val(null);
    $("#MPNA").val(null);
    $("#NSM").val(null);
    $("#GENITOURINARY").val(null);



    $('input:radio[name=NatureOfJobVal]').click(function () {
        var val = $(this).attr('id');
        $("#NatureOfJob").val(val)

    });

    $("#BranchOfArmedServices").change(function () {

        if ($("#BranchOfArmedServices").val() == "Others") {
            $("#BranchOfArmedServicesOthers").show();
        } else {
            $("#BranchOfArmedServicesOthers").hide();
        }
    });

    $('input:radio[name=JobNatureVal]').click(function () {
        var val = $(this).attr('id');
        $("#JobNature").val(val)

    });

    $('input:radio[name=FamilyMemberStatus1]').change(function () {
        $("#FamilyMemberHealthStatus1").prop('selectedIndex', 0);
        $("#FamilyMemberDeacesed1").prop('selectedIndex', 0);

        var val = $("input:radio[name=FamilyMemberStatus1]:checked").val();
        $("#FamilyMember1Status").val(val);
        if (val == "Alive") {
            $("#alive1").show();
            $("#deceased1").hide();
        } else {
            $("#alive1").hide();
            $("#deceased1").show();
        }

    });

    $('input:radio[name=FamilyMemberStatus2]').click(function () {
        $("#FamilyMemberHealthStatus2").prop('selectedIndex', 0);
        $("#FamilyMemberDeacesed2").prop('selectedIndex', 0);
        var val = $("input:radio[name=FamilyMemberStatus2]:checked").val();
        $("#FamilyMember2Status").val(val)
        if (val == "Alive") {
            $("#alive2").show();
            $("#deceased2").hide();
        } else {
            $("#alive2").hide();
            $("#deceased2").show();
        }

    });

    $('input:radio[name=FamilyMemberStatus3]').click(function () {
        $("#FamilyMemberHealthStatus3").prop('selectedIndex', 0);
        $("#FamilyMemberDeacesed3").prop('selectedIndex', 0);
        var val = $("input:radio[name=FamilyMemberStatus3]:checked").val();
        $("#FamilyMember3Status").val(val)
        if (val == "Alive") {
            $("#alive3").show();
            $("#deceased3").hide();
        } else {
            $("#alive3").hide();
            $("#deceased3").show();
        }
    });

    $('input:radio[name=FamilyMemberStatus4]').click(function () {
        $("#FamilyMemberHealthStatus4").prop('selectedIndex', 0);
        $("#FamilyMemberDeacesed4").prop('selectedIndex', 0);
        var val = $("input:radio[name=FamilyMemberStatus4]:checked").val();
        $("#FamilyMember4Status").val(val)
        if (val == "Alive") {
            $("#alive4").show();
            $("#deceased4").hide();
        } else {
            $("#alive4").hide();
            $("#deceased4").show();
        }
    });

    $('input:radio[name=FamilyMemberStatus5]').click(function () {
        $("#FamilyMemberHealthStatus5").prop('selectedIndex', 0);
        $("#FamilyMemberDeacesed5").prop('selectedIndex', 0);
        var val = $("input:radio[name=FamilyMemberStatus5]:checked").val();
        $("#FamilyMember5Status").val(val)
        if (val == "Alive") {
            $("#alive5").show();
            $("#deceased5").hide();
        } else {
            $("#alive5").hide();
            $("#deceased5").show();
        }
    });


    $('input:radio[name=QuestionId3RDB]').click(function () {

        var val = $(this).attr('id');
        $("#QuestionId3").val(val)
        if (val == "Hobbies") {
            $("#HobbiesDiv").show();
        } else {
            $("#HobbiesDiv").hide();
        }

        if (val == "Occupation") {
            $("#OccupationReflexive").show();
        } else {
            $("#OccupationReflexive").hide();
        }

    });




    $('input:radio[name=QuestionId4RDB]').click(function () {

        var val = $(this).attr('id');
        $("#QuestionId4").val(val)
        switch (val) {
            case 'Yachting': $("#HobbiesIdproof").val('1017010259');
                break;

            case 'Parachuting': $("#HobbiesIdproof").val('1017010260');
                break;
                 
            case 'HandGliding': $("#HobbiesIdproof").val('1017010261');
                break;
                 
            case 'Diving': $("#HobbiesIdproof").val('1017010262');
                break;
                 
            case 'Gliding': $("#HobbiesIdproof").val('1017010263');
                break;
                 
            case 'HazardousSports': $("#HobbiesIdproof").val('1017010264');
                break;
                 
            case 'Microlighting': $("#HobbiesIdproof").val('1017010265');
                break;
                 
            case 'ScubaDiving': $("#HobbiesIdproof").val('1017010266');
                break;
                 
            case 'Climbingandmountaineering': $("#HobbiesIdproof").val('1017010258');
                break;

           
        }
        
    })


    $('input:radio[name=JobNature]').click(function () {
        var val = $(this).attr('id');
        $("#JobNature").val(val)
    })

    $('input:radio[name=CurrentIncome]').click(function () {
        var val = $(this).attr('value');
        $("#SuitabilityMatrixQuestion1").val(val)
    })

    $('input:radio[name=CurrentLifeStyle]').click(function () {
        var val = $(this).attr('value');
        $("#SuitabilityMatrixQuestion2").val(val)
    })

    $('input:radio[name=InvestmentObjectivie]').click(function () {
        var val = $(this).attr('value');
        $("#SuitabilityMatrixQuestion3").val(val)
    })

    $('input:radio[name=Riskappetite]').click(function () {
        var val = $(this).attr('value');
        $("#SuitabilityMatrixQuestion4").val(val)
    })

    $('input:radio[name=InvestmentHorizon]').click(function () {
        var val = $(this).attr('value');
        $("#SuitabilityMatrixQuestion5").val(val)
    })

    $('input:radio[name=InsurancePortfolio]').click(function () {
        var val = $(this).attr('value');
        $("#SuitabilityMatrixQuestion6").val(val);
        
        //$("#SuitabilityMatrixQuestion6").val(val)
    })


   

    $("#ProposerOccupationalDetailsText").val($("#ProposerOccupationalDetails option:selected").text());
    if ($("#ProposerOccupationalDetails").val() == "8" || $("#OccupationalDetails").val() == "5")//Agri and Retired
    {
        $("#ProposerAgri-Retired").show();
        $("#ProposerOCCOthers").hide();
        $("#ProposerStudent").hide();
        $("#ProposerSelfedEmployed").hide();
        $("#ProposerSalaried").hide();
        $("#ProposerBusinessdiv").hide();
    } else if ($("#ProposerOccupationalDetails").val() == "3")//Business
    {
        $("#ProposerBusinessdiv").show();
        $("#ProposerAgri-Retired").hide();
        $("#ProposerOCCOthers").hide();
        $("#ProposerStudent").hide();
        $("#ProposerSelfedEmployed").hide();
        $("#ProposerSalaried").hide();
    }
    else if ($("#ProposerOccupationalDetails").val() == "1")//Salaried
    {
        $("#ProposerSalaried").show();
        $("#ProposerBusinessdiv").hide();
        $("#ProposerAgri-Retired").hide();
        $("#ProposerOCCOthers").hide();
        $("#ProposerStudent").hide();
        $("#ProposerSelfedEmployed").hide();
    }
    else if ($("#ProposerOccupationalDetails").val() == "2")//SelfedEmployee
    {
        $("#ProposerSelfedEmployed").show();
        $("#ProposerSalaried").hide();
        $("#ProposerBusinessdiv").hide();
        $("#ProposerAgri-Retired").hide();
        $("#ProposerOCCOthers").hide();
        $("#ProposerStudent").hide();
    }
    else if ($("#ProposerOccupationalDetails").val() == "6")//Student/Juvenile
    {
        $("#ProposerStudent").show();
        $("#ProposerSelfedEmployed").hide();
        $("#ProposerSalaried").hide();
        $("#ProposerBusinessdiv").hide();
        $("#ProposerAgri-Retired").hide();
        $("#ProposerOCCOthers").hide();
    }
    else if ($("#ProposerOccupationalDetails").val() == "7")//Others
    {
        $("#ProposerOCCOthers").show();
        $("#ProposerStudent").hide();
        $("#ProposerSelfedEmployed").hide();
        $("#ProposerSalaried").hide();
        $("#ProposerBusinessdiv").hide();
        $("#ProposerAgri-Retired").hide();
    }
    else if ($("#ProposerOccupationalDetails").val() == "4")//Housewife
    {
        $("#ProposerOCCOthers").hide();
        $("#ProposerStudent").hide();
        $("#ProposerSelfedEmployed").hide();
        $("#ProposerSalaried").hide();
        $("#ProposerBusinessdiv").hide();
        $("#ProposerAgri-Retired").hide();
    }

    $("#OccupationalDetailsText").val($("#OccupationalDetails option:selected").text());
    if ($("#OccupationalDetails").val() == "8" || $("#OccupationalDetails").val() == "5")//Agri and Retired
    {
        $("#Agri-Retired").show();
        $("#OCCOthers").hide();
        $("#Student").hide();
        $("#SelfedEmployed").hide();
        $("#Salaried").hide();
        $("#Businessdiv").hide();
    } else if ($("#OccupationalDetails").val() == "3")//Business
    {
        $("#Businessdiv").show();
        $("#Agri-Retired").hide();
        $("#OCCOthers").hide();
        $("#Student").hide();
        $("#SelfedEmployed").hide();
        $("#Salaried").hide();
    }
    else if ($("#OccupationalDetails").val() == "1")//Salaried
    {
        $("#Salaried").show();
        $("#Businessdiv").hide();
        $("#Agri-Retired").hide();
        $("#OCCOthers").hide();
        $("#Student").hide();
        $("#SelfedEmployed").hide();
    }
    else if ($("#OccupationalDetails").val() == "2")//SelfedEmployee
    {
        $("#SelfedEmployed").show();
        $("#Salaried").hide();
        $("#Businessdiv").hide();
        $("#Agri-Retired").hide();
        $("#OCCOthers").hide();
        $("#Student").hide();
    }
    else if ($("#OccupationalDetails").val() == "6")//Student/Juvenile
    {
        $("#Student").show();
        $("#SelfedEmployed").hide();
        $("#Salaried").hide();
        $("#Businessdiv").hide();
        $("#Agri-Retired").hide();
        $("#OCCOthers").hide();
    }
    else if ($("#OccupationalDetails").val() == "7")//Others
    {
        $("#Agri-Retired").show();
        // $("#OCCOthers").show();
        $("#Student").hide();
        $("#SelfedEmployed").hide();
        $("#Salaried").hide();
        $("#Businessdiv").hide();
        // $("#Agri-Retired").hide();
    } else if ($("#OccupationalDetails").val() == "4")//Housewife
    {
        $("#OCCOthers").hide();
        $("#Student").hide();
        $("#SelfedEmployed").hide();
        $("#Salaried").hide();
        $("#Businessdiv").hide();
        $("#Agri-Retired").hide();
    }

    $("#InsuredResidentStatusTextTATAAIA").val($("#InsuredResidentStatus option:selected").text());
    if ($("#InsuredResidentStatus").val() == "NRI" || $("#InsuredResidentStatus").val() == "OCI" || $("#InsuredResidentStatus").val() == "PIO" || $("#InsuredResidentStatus").val() == "FN") {
        $("#MobileNumberNonRI").show();
        $("#MobileNumberRI").hide();
    } else {
        $("#MobileNumberNonRI").hide();
        $("#MobileNumberRI").show();
    }
    $("#InsuredEducationQuatlifiactionTextTATAAIA").val($("#InsuredEducationQualification option:selected").text());
    $("#InsuredMaritalStatusTextTATAAIA").val($("#InsuredMaritalStatus option:selected").text());
    $("#InsuredAgeProofTextTATAAIA").val($("#InsuredAgeProof option:selected").text());
    $("#InsuredAddressProofTextTATAAIA").val($("#InsuredAddressProof option:selected").text());
    $("#InsuredIncomeProofTextTATAAIA").val($("#InsuredIncomeProof option:selected").text());
    $("#InsuredEducationQualificationTextTATAAIA").val($("#InsuredEducationQualification option:Selected").text());


    if ($("#naddress").val() != "" || $("#naddress").val() != null) {
        naddress($("#naddress").val())
    }

    if ($("#paddress").val() != "" || $("#paddress").val() != null) {
        paddress($("#paddress").val());
    }

    if ($("#EIA").val() != "" || $("#EIA").val() != null) {

        EIA($("#EIA").val());
    }

    if ($("#ConsiderSecondary").val() != "" || $("#ConsiderSecondary").val() != null) {

        ConsiderSecondary($("#ConsiderSecondary").val());
    }



    if ($("#CKYC").val() != "" || $("#CKYC").val() != null) {
        CKYC($("#CKYC").val());
    }


    if ($("#politicalexposedperson").val() != "" || $("#politicalexposedperson").val() != null) {
        politicalexposedperson($("#politicalexposedperson").val());
    }

    if ($("#ExistingPolicy").val() != "" || $("#ExistingPolicy").val() != null) {
        ExistingPolicy($("#ExistingPolicy").val());
    }

    if ($("#InsuredMaritalStatus").val() == "M") {
        var ProductPlanId = $("#ProductPlanId").val();
        if ($("#InsuredGender").val() == "Female" || $("#InsuredGender").val() == "F") {
            $("#HusbandName").show();
            $("#FatherName").hide();
            $("#divMaidenName").show();
           
        } else {
            $("#HusbandName").hide();
            $("#divMaidenName").hide();
            $("#FatherName").show();
            
        }
        if (ProductPlanId == "420") {
            $("#dvInsuredNoOfChildern").show();
        }
        else {
            $("#dvInsuredNoOfChildern").hide();
        }
    } else {
        $("#divMaidenName").hide();
        $("#HusbandName").hide();
        $("#FatherName").show();
        $("#dvInsuredNoOfChildern").hide();
    } 
    $("#InsuredMaritalStatus").change(function () {
        var ProductPlanId = $("#ProductPlanId").val();
        if ($("#InsuredMaritalStatus").val() == "M") {
            if ($("#InsuredGender").val() == "F") {
                $("#divMaidenName").show();
                $("#HusbandName").show();
                $("#FatherName").hide();
            }
            else {

                $("#divMaidenName").hide();
                $("#HusbandName").hide();
                $("#FatherName").show();
            }

            if (ProductPlanId == "420") {
                $("#dvInsuredNoOfChildern").show();
            }
            else {
                $("#dvInsuredNoOfChildern").hide();
            }
           
        } else {
            $("#divMaidenName").hide();
            $("#HusbandName").hide();
            $("#FatherName").show();
            $("#dvInsuredNoOfChildern").hide();
        }
    })

    //Existing Policy Add and Remove
    $("#add_policy").click(function () {
        $("#dvadd_policy").hide();
        $("#dvadd_policy1").show();
        $("#dvadd_policy2").hide();
        $("#dvadd_policy3").hide();
        $("#dvRemove_policy").show();
        $("#dvRemove_policy1").hide();
        $("#dvRemove_policy2").hide();
        $("#dvRemove_policy3").hide();
        var ExistingInsuranceCount = $("#ExistingInsuranceCount").val();
        ExistingInsuranceCount++;
        $("#ExistingInsuranceCount").val(ExistingInsuranceCount);
        $("#ExistingPolicyDetails1").show();

    })

    $("#add_policy1").click(function () {
        $("#dvadd_policy1").hide();
        $("#dvadd_policy2").show();
        $("#dvadd_policy3").hide();
        $("#dvadd_policy").hide();
        $("#dvRemove_policy").hide();
        $("#dvRemove_policy1").show();
        $("#dvRemove_policy2").hide();
        $("#dvRemove_policy3").hide();
        $("#ExistingPolicyDetails2").show();
        var ExistingInsuranceCount = $("#ExistingInsuranceCount").val();
        ExistingInsuranceCount++;
        $("#ExistingInsuranceCount").val(ExistingInsuranceCount);

    })


    $("#add_policy2").click(function () {
        $("#dvadd_policy2").hide();
        $("#dvadd_policy3").show();
        $("#dvadd_policy1").hide();
        $("#dvadd_policy").hide();
        $("#dvRemove_policy").hide();
        $("#dvRemove_policy1").hide();
        $("#dvRemove_policy2").show();
        $("#dvRemove_policy3").hide();
        var ExistingInsuranceCount = $("#ExistingInsuranceCount").val();
        ExistingInsuranceCount++;
        $("#ExistingInsuranceCount").val(ExistingInsuranceCount);
        $("#ExistingPolicyDetails3").show();

    })


    $("#add_policy3").click(function () {
        $("#dvadd_policy3").hide();
        $("#dvadd_policy2").hide();
        $("#dvadd_policy").hide();
        $("#dvadd_policy4").show();
        $("#dvRemove_policy").hide();
        $("#dvRemove_policy1").hide();
        $("#dvRemove_policy2").hide();
        $("#dvRemove_policy3").show();
        var ExistingInsuranceCount = $("#ExistingInsuranceCount").val();
        ExistingInsuranceCount++;
        $("#ExistingInsuranceCount").val(ExistingInsuranceCount);
        $("#ExistingPolicyDetails4").show();

    })




    $("#Remove_policy").click(function () {
        $("#ExistingPolicyDetails1").hide();
        $("#dvRemove_policy").hide();
        $("#dvadd_policy").show();
        $("#dvadd_policy1").hide();
        $("#dvadd_policy2").hide();
        $("#dvadd_policy3").hide();
        var ExistingInsuranceCount = $("#ExistingInsuranceCount").val();
        ExistingInsuranceCount--
        $("#ExistingInsuranceCount").val(ExistingInsuranceCount);
    })


    $("#Remove_policy1").click(function () {
        $("#ExistingPolicyDetails2").hide();
        $("#dvadd_policy1").show();
        $("#dvRemove_policy").show();
        $("#dvadd_policy").hide();
        $("#dvadd_policy2").hide();
        $("#dvadd_policy3").hide();
        var ExistingInsuranceCount = $("#ExistingInsuranceCount").val();
        ExistingInsuranceCount--
        $("#ExistingInsuranceCount").val(ExistingInsuranceCount);
    })


    $("#Remove_policy2").click(function () {
        $("#ExistingPolicyDetails3").hide();
        $("#dvadd_policy2").show();
        $("#dvRemove_policy1").show();
        $("#dvadd_policy1").hide();
        $("#dvadd_policy").hide();
        $("#dvadd_policy3").hide();
        var ExistingInsuranceCount = $("#ExistingInsuranceCount").val();
        ExistingInsuranceCount--
        $("#ExistingInsuranceCount").val(ExistingInsuranceCount);
    })


    $("#Remove_policy3").click(function () {
        //$("#ExistingPolicyDetails1").hide();
        $("#ExistingPolicyDetails4").hide();
        $("#dvRemove_policy2").show();
        $("#dvadd_policy3").show();
        $("#dvadd_policy1").hide();
        $("#dvadd_policy2").hide();
        $("#dvadd_policy").hide();
        var ExistingInsuranceCount = $("#ExistingInsuranceCount").val();
        ExistingInsuranceCount--
        $("#ExistingInsuranceCount").val(ExistingInsuranceCount);
    })

    //Beneficiary Add and Remove
    $("#add_Beneficiary2").click(function () {
        $("#dvadd_Beneficiary2").hide();
        $("#dvadd_Beneficiary3").show();

        $("#dvRemove_Beneficiary2").show();
        $("#dvRemove_Beneficiary3").hide();
        var BeneficiaryCount = $("#BeneficiaryCount").val();
        BeneficiaryCount++;
        $("#BeneficiaryCount").val(BeneficiaryCount);
        $("#Beneficiary2").show();
    })

    $("#add_Beneficiary3").click(function () {
        $("#dvadd_Beneficiary2").hide();
        $("#dvadd_Beneficiary3").hide();
        //$("#dvRemove_Beneficiary2").hide();
        $("#dvRemove_Beneficiary3").show();
        var BeneficiaryCount = $("#BeneficiaryCount").val();
        BeneficiaryCount++;
        $("#BeneficiaryCount").val(BeneficiaryCount);
        $("#Beneficiary3").show();

    })


    $("#Remove_Beneficiary2").click(function () {
        $("#Beneficiary2").hide();
        $("#dvRemove_Beneficiary2").hide();
        $("#dvadd_Beneficiary2").show();
        $("#dvadd_Beneficiary3").hide();
        //$("#dvadd_policy").show();
        //$("#dvadd_policy1").hide();
        //$("#dvadd_policy2").hide();
        //$("#dvadd_policy3").hide();
        var BeneficiaryCount = $("#BeneficiaryCount").val();
        BeneficiaryCount--
        $("#BeneficiaryCount").val(BeneficiaryCount);
    })

    $("#Remove_Beneficiary3").click(function () {
        $("#Beneficiary3").hide();
        $("#dvadd_Beneficiary3").show();
        $("#dvRemove_Beneficiary3").hide();
        $("#dvadd_Beneficiary2").hide();
        $("#dvadd_Beneficiary3").hide();
        var BeneficiaryCount = $("#BeneficiaryCount").val();
        BeneficiaryCount--
        $("#BeneficiaryCount").val(BeneficiaryCount);
    })

    //Trustee Add and Remove 

    $("#add_Trustee2").click(function () {
        $("#dvadd_Trustee2").hide();
        $("#dvadd_Trustee3").show();

        $("#dvRemove_Trustee2").show();
        $("#dvRemove_Trustee3").hide();
        var TrusteeCount = $("#TrusteeCount").val();
        TrusteeCount++;
        $("#TrusteeCount").val(TrusteeCount);
        $("#Trustee2").show();
    })

    $("#add_Trustee3").click(function () {
        $("#dvadd_Trustee2").hide();
        $("#dvadd_Trustee3").hide();
        //$("#dvRemove_Beneficiary2").hide();
        $("#dvRemove_Trustee3").show();
        var TrusteeCount = $("#TrusteeCount").val();
        TrusteeCount++;
        $("#TrusteeCount").val(TrusteeCount);
        $("#Trustee3").show();

    })


    $("#Remove_Trustee2").click(function () {
        $("#Trustee2").hide();
        $("#dvRemove_Trustee2").hide();
        $("#dvadd_Trustee2").show();
        $("#dvadd_Trustee3").hide();
        //$("#dvadd_policy").show();
        //$("#dvadd_policy1").hide();
        //$("#dvadd_policy2").hide();
        //$("#dvadd_policy3").hide();
        var TrusteeCount = $("#TrusteeCount").val();
        TrusteeCount--
        $("#TrusteeCount").val(TrusteeCount);
    })

    $("#Remove_Trustee3").click(function () {
        $("#Trustee3").hide();
        $("#dvadd_Trustee3").show();
        $("#dvRemove_Trustee3").hide();
        $("#dvadd_Trustee2").hide();
        var TrusteeCount = $("#TrusteeCount").val();
        TrusteeCount--
        $("#TrusteeCount").val(TrusteeCount);
    })



    $("#InsuredEducationQualification").change(function () {
        $("#InsuredEducationQuatlifiactionTextTATAAIA").val($("#InsuredEducationQualification option:selected").text());
    })

    $("#ProposerEducationQualification").change(function () {
        $("#ProposerEducationQuatlifiactionTextTATAAIA").val($("#ProposerEducationQualification option:selected").text());
    })

    $("#ProposerRelationship").change(function () {

        $("#ProposerRelationshipText").val($("#ProposerRelationship option:Selected").text());
        if ($("#ProposerRelationship").val() == "20") {
            $("#InsuredTitle").val($("#ContactTitle").val());

            $("#InsuredFirstName").val($("#ContactFirstName").val());
            $("#InsuredMiddleName").val($("#ContactMiddleName").val()).addClass('used');
            $("#InsuredLastName").val($("#ContactLastName").val());
            $("#ContactDOB").val($("#InsuredDOB").val());
            $("#ProposerGender").val($("#InsuredGender").val());
            $("#InsuredEmail").val($("#ContactEmail").val()).addClass('used');
            $("#InsuredMaritalStatus option[value='" + $("#ProposerMaritalStatus").val() + "']").text($("#ProposerMaritalStatus option:Selected").text()).attr('selected', 'selected');
            $("#InsuredEducationQualification").val($("#ProposerEducationQualification").val());
            $("#InsuredIDProof").val($("#").val($("#ProposerIDProof").val()));
            $("#InsuredAgeProof").val($("#ProposerAgeProof").val());
            $("#InsuredAddressProof").val($("#ProposerAddressProof").val());
            $("#InsuredIncomeProof").val($("#ProposerIncomeProof").val());
            $("#InsuredAadharNo").val($("#ProposerAadharNo").val()).addClass('used');
            $("#InsuredPANNo").val($("#ProposerPANNo").val()).addClass('used');
            $("#InsuredIDProof").val($("#ProposerIDProof").val());
            $("#InsuredResidentStatus").val($("#ProposerResidentStatus").val());
            $("#InsuredResidentStatusTextTATAAIA").val($("#InsuredResidentStatus option:selected").text());
            if ($("#InsuredResidentStatus").val() == "NRI" || $("#InsuredResidentStatus").val() == "OCI" || $("#InsuredResidentStatus").val() == "PIO" || $("#InsuredResidentStatus").val() == "FN") {
                $("#MobileNumberNonRI").show();
                $("#MobileNumberRI").hide();
            } else {
                $("#MobileNumberNonRI").hide();
                $("#MobileNumberRI").show();
            }
            if ($("#InsuredMaritalStatus").val() == "M") {
                $("#HusbandName").show();
                $("#FatherName").hide();
            } else {
                $("#HusbandName").hide();
                $("#FatherName").show();
            }
            $("#InsuredEducationQuatlifiactionTextTATAAIA").val($("#InsuredEducationQualification option:selected").text());
            $("#InsuredMaritalStatusTextTATAAIA").val($("#InsuredMaritalStatus option:selected").text());
            $("#InsuredAgeProofTextTATAAIA").val($("#InsuredAgeProof option:selected").text());
            $("#ProposerAgeProofTextTATAAIA").val($("#ProposerAgeProof option:selected").text());
            $("#InsuredAddressProofTextTATAAIA").val($("#InsuredAddressProof option:selected").text());
            $("#InsuredIncomeProofTextTATAAIA").val($("#InsuredIncomeProof option:selected").text());
            $("#ProposerAddressProofTextTATAAIA").val($("#InsuredAddressProof option:selected").text());
            $("#ProposerIncomeProofTextTATAAIA").val($("#InsuredIncomeProof option:selected").text());
            $("#InsuredEducationQualificationTextTATAAIA").val($("#InsuredEducationQualification option:Selected").text());

            $("#OccupationalDetails").val($("#ProposerOccupationalDetails").val()).addClass('used');;
            $("#AnnualIncome").val($("#ProposerAnnualIncome").val()).addClass('used');
            $("#Other").val($("#ProposerOther").val()).addClass('used');
            $("#ProposerCompanyName").val($("#CompanyNameTATAAIA").val()).addClass('used');
            $("#EmpName").val($("#ProposerEmpName").val()).addClass('used');
            $("#StudentStandard").val($("#ProposerStudentStandard").val()).addClass('used');
            $("#OccupationQuestionnaire").val($("#ProposerOccupationQuestionnaire").val()).addClass('used');
            $("#Business").val($("#ProposerBusiness").val()).addClass('used');
            if ($("#ProposerOccupationalDetails").val() == "8" || $("#OccupationalDetails").val() == "5")//Agri and Retired
            {
                $("#Agri-Retired").show();
                $("#OCCOthers").hide();
                $("#Student").hide();
                $("#SelfedEmployed").hide();
                $("#Salaried").hide();
                $("#Businessdiv").hide();
            } else if ($("#ProposerOccupationalDetails").val() == "3")//Business
            {
                $("#Businessdiv").show();
                $("#Agri-Retired").hide();
                $("#OCCOthers").hide();
                $("#Student").hide();
                $("#SelfedEmployed").hide();
                $("#Salaried").hide();
            }
            else if ($("#ProposerOccupationalDetails").val() == "1")//Salaried
            {
                $("#Salaried").show();
                $("#Businessdiv").hide();
                $("#Agri-Retired").hide();
                $("#OCCOthers").hide();
                $("#Student").hide();
                $("#SelfedEmployed").hide();
            }
            else if ($("#ProposerOccupationalDetails").val() == "2")//SelfedEmployee
            {
                $("#SelfedEmployed").show();
                $("#Salaried").hide();
                $("#Businessdiv").hide();
                $("#Agri-Retired").hide();
                $("#OCCOthers").hide();
                $("#Student").hide();
            }
            else if ($("#ProposerOccupationalDetails").val() == "6")//Student/Juvenile
            {
                $("#Student").show();
                $("#SelfedEmployed").hide();
                $("#Salaried").hide();
                $("#Businessdiv").hide();
                $("#Agri-Retired").hide();
                $("#OCCOthers").hide();
            }
            else if ($("#ProposerOccupationalDetails").val() == "7")//Others
            {
                $("#OCCOthers").show();
                $("#Student").hide();
                $("#SelfedEmployed").hide();
                $("#Salaried").hide();
                $("#Businessdiv").hide();
                $("#Agri-Retired").hide();
            }
            else if ($("#ProposerOccupationalDetails").val() == "4")//Housewife
            {
                $("#OCCOthers").hide();
                $("#Student").hide();
                $("#SelfedEmployed").hide();
                $("#Salaried").hide();
                $("#Businessdiv").hide();
                $("#Agri-Retired").hide();
            }
            $("#InsuredFirstName").attr('readonly', true);
            $("#InsuredLastName").attr('readonly', true);
            $("#InsuredDOB").attr('readonly', true);
            $("#InsuredEmail").attr('readonly', true);
            $("#InsuredPANNo").attr('readonly', true);
            $("#InsuredAadharNo").attr('readonly', true);
        } else {
            $("#InsuredFirstName").removeAttr('readonly', true);
            $("#InsuredLastName").removeAttr('readonly', true);
            $("#InsuredDOB").removeAttr('readonly', true);
            $("#InsuredEmail").removeAttr('readonly', true);
            $("#InsuredPANNo").removeAttr('readonly', true);
            $("#InsuredAadharNo").removeAttr('readonly', true);
        }
    })

    $("#ProposerMaritalStatus").change(function () {

        $("#ProposerMaritalStatusTextTATAAIA").val($("#ProposerMaritalStatus option:selected").text());
    })

    if ($("#QuestionId94").val() == 'Y') {
        $("#subquetion43").show();
    } else {
        $("#subquetion43").hide();
    }

    //Onload Set Medical Question value
    var MedicalQuestion = ["QuestionId54", "QuestionId19", "QuestionId20", "QuestionId72", "QuestionId73", "QuestionId74",
        "QuestionId76", "QuestionId78", "QuestionId80", "QuestionId82", "QuestionId84", "QuestionId86", "QuestionId88",
        "QuestionId90", "QuestionId92", "QuestionId93", "QuestionId44", "QuestionId94", "QuestionId95", "QuestionId49",
        "QuestionId50", "QuestionId51"];

    var SubMedicalQuestion = ["subquetion26", "subquetion30", "subquetion5", "subquetion31", "subquetion32",
        "subquetion33", "subquetion34", "subquetion35", "subquetion36", "subquetion37",
        "subquetion38", "subquetion39", "subquetion40", "subquetion41", "subquetion42",
        "subquetion19", "subquetion43", "subquetion44", "subquetion22", "subquetion23",
        "subquetion24"];

    for (var i = 0; i < MedicalQuestion.length; i++) {
        MedicalQuestion[i];
        if ($("#" + MedicalQuestion[i]).val() != "" || $("#" + MedicalQuestion[i]).val() != null) {
            for (var j = i; j <= i; j++) {
                if ($("#" + MedicalQuestion[i]).val() == "Y") {
                    $("#" + MedicalQuestion[i] + "Y").addClass('active');
                    $("#" + MedicalQuestion[i] + "N").removeClass('active');
                    $("#" + SubMedicalQuestion[j]).show();

                } else if ($("#" + MedicalQuestion[i]).val() == "N") {
                    $("#" + MedicalQuestion[i] + "N").addClass('active');
                    $("#" + MedicalQuestion[i] + "Y").removeClass('active');
                    $("#" + SubMedicalQuestion[j]).hide();
                }

                if ($("#QuestionId93").val() == "Y" || $("#QuestionId93").val() == "Yes") {
                    $("#subquetion42").show();
                } else {
                    $("#subquetion42").hide();
                }
                //if ($("#QuestionId44").val() == "Y") {
                //    $("#subquetion19").show();
                //   // $("#subquetion19N").hide();
                //} else if ($("#QuestionId44").val() == "N") {
                //    //$("#subquetion19N").show();
                //    $("#subquetion19").hide();

                //}

                if ($("#QuestionId73").val() == "Y") {
                    $("#SubQuestion73").find('input,checkbox').attr('disabled', false);
                    $("#Cardio").val(null);
                    $("#HARMONAL").val(null);
                    $("#RESPIRATORY").val(null);
                    $("#BLOODCELLULAR").val(null);
                    $("#MPNA").val(null);
                    $("#NSM").val(null);
                    $("#GENITOURINARY").val(null);
                } else {
                    $("#SubQuestion73").find('input,checkbox').attr('disabled', 'disabled');
                    $("#Cardio").val(null);
                    $("#HARMONAL").val(null);
                    $("#RESPIRATORY").val(null);
                    $("#BLOODCELLULAR").val(null);
                    $("#MPNA").val(null);
                    $("#NSM").val(null);
                    $("#GENITOURINARY").val(null);
                    $("#HighBloodPressure").prop("checked", false);
                    $("#HyperTension").hide();
                    $("#DiabetesReflexive").hide();
                }
            }
        }
    }

    var LifeStyleQuestion = ["QuestionId1", "QuestionId11", "QuestionId9", "QuestionId15", "QuestionId2", "QuestionId5", "QuestionId7"];
    for (var i = 0; i <= LifeStyleQuestion.length; i++) {
        if ($("#" + LifeStyleQuestion[i]).val() != "" || $("#" + LifeStyleQuestion[i]).val() != null) {
            if ($("#" + LifeStyleQuestion[i]).val() == "Y" || $("#" + LifeStyleQuestion[i]).val() == "Yes") {
                $("#" + LifeStyleQuestion[i] + "Y").addClass('active');
                $("#" + LifeStyleQuestion[i] + "N").removeClass('active');
            } else if ($("#" + LifeStyleQuestion[i]).val() == "N" || $("#" + LifeStyleQuestion[i]).val() == "No") {
                $("#" + LifeStyleQuestion[i] + "N").addClass('active');
                $("#" + LifeStyleQuestion[i] + "Y").removeClass('active');
            }

            if ($("#QuestionId11").val() == 'Y' || $("#QuestionId11").val() == 'Yes') {
                $("#TobacoConsume").show();
            } else {
                $("#TobacoConsume").hide();
            }



            if ($("#QuestionId9").val() == 'Y' || $("#QuestionId9").val() == 'Yes') {
                $("#AlcoholConsume").show();
            } else {
                $("#AlcoholConsume").hide();
            }

            if ($("#QuestionId15").val() == 'Y' || $("#QuestionId15").val() == 'Yes') {
                $("#NarcoticsConsume").show();
            } else {
                $("#NarcoticsConsume").hide();
            }

            if ($("#QuestionId2").val() == "Y" || $("#QuestionId2").val() == 'Yes') {

                $("#subquetion3").show();
                $("#subquetion4").show();
            } else {
                $("#subquetion3").hide();
                $("#subquetion4").hide();
            }

            if ($("#QuestionId5").val() == "Y" || $("#QuestionId5").val() == 'Yes') {
                $("#subquetion6").show();
            } else {
                $("#subquetion6").hide();
            }

            if ($("#QuestionId7").val() == "Y" || $("#QuestionId7").val() == 'Yes') {
                $("#subquetion8").show();
            } else {
                $("#subquetion8").hide();
            }
        }
    }

    $('input[type=text]').each(function () {

        if ($(this).val() == "" || $(this).val() == null) {
            $(this).removeClass('used');
        }
        else {
            $(this).addClass('used');
        }
    })

    $('input[type=number]').each(function () {

        if ($(this).val() == "" || $(this).val() == null) {
            $(this).removeClass('used');
        }
        else {
            $(this).addClass('used');
        }
    })

    $("#ProposerOccupationalDetails").change(function () {

        $("#ProposerOccupationalDetailsText").val($("#ProposerOccupationalDetails option:selected").text());
        if ($("#ProposerOccupationalDetails").val() == "8" || $("#OccupationalDetails").val() == "5")//Agri and Retired
        {
            $("#ProposerAgri-Retired").show();
            $("#ProposerOCCOthers").hide();
            $("#ProposerStudent").hide();
            $("#ProposerSelfedEmployed").hide();
            $("#ProposerSalaried").hide();
            $("#ProposerBusinessdiv").hide();
        } else if ($("#ProposerOccupationalDetails").val() == "3")//Business
        {
            $("#ProposerBusinessdiv").show();
            $("#ProposerAgri-Retired").hide();
            $("#ProposerOCCOthers").hide();
            $("#ProposerStudent").hide();
            $("#ProposerSelfedEmployed").hide();
            $("#ProposerSalaried").hide();
        }
        else if ($("#ProposerOccupationalDetails").val() == "1")//Salaried
        {
            $("#ProposerSalaried").show();
            $("#ProposerBusinessdiv").hide();
            $("#ProposerAgri-Retired").hide();
            $("#ProposerOCCOthers").hide();
            $("#ProposerStudent").hide();
            $("#ProposerSelfedEmployed").hide();
        }
        else if ($("#ProposerOccupationalDetails").val() == "2")//SelfedEmployee
        {
            $("#ProposerSelfedEmployed").show();
            $("#ProposerSalaried").hide();
            $("#ProposerBusinessdiv").hide();
            $("#ProposerAgri-Retired").hide();
            $("#ProposerOCCOthers").hide();
            $("#ProposerStudent").hide();
        }
        else if ($("#ProposerOccupationalDetails").val() == "6")//Student/Juvenile
        {
            $("#ProposerStudent").show();
            $("#ProposerSelfedEmployed").hide();
            $("#ProposerSalaried").hide();
            $("#ProposerBusinessdiv").hide();
            $("#ProposerAgri-Retired").hide();
            $("#ProposerOCCOthers").hide();
        }
        else if ($("#ProposerOccupationalDetails").val() == "7")//Others
        {
            $("#ProposerOCCOthers").show();
            $("#ProposerStudent").hide();
            $("#ProposerSelfedEmployed").hide();
            $("#ProposerSalaried").hide();
            $("#ProposerBusinessdiv").hide();
            $("#ProposerAgri-Retired").hide();
        } else if ($("#ProposerOccupationalDetails").val() == "4")//housewife
        {
            $("#ProposerOCCOthers").hide();
            $("#ProposerStudent").hide();
            $("#ProposerSelfedEmployed").hide();
            $("#ProposerSalaried").hide();
            $("#ProposerBusinessdiv").hide();
            $("#ProposerAgri-Retired").hide();
        }


    })

    $("#TobaccoConsumeAs").change(function () {
        if ($("#TobaccoConsumeAs").val() == "" || $("#TobaccoConsumeAs").val() == null) {
            $("#TobaccoConsumeAs_txt").val("");
        } else {
            $("#TobaccoConsumeAs_txt").val($("#TobaccoConsumeAs option:selected").text());
        }
    })
    $("#NarcoticsConsumeAs").change(function () {
        if ($("#NarcoticsConsumeAs").val() == "" || $("#NarcoticsConsumeAs").val() == null) {
            $("#NarcoticsConsumeAs_txt").val("");
        } else {
            $("#NarcoticsConsumeAs_txt").val($("#NarcoticsConsumeAs option:selected").text());
        }
    })
    $("#AlcoholConsumeAs").change(function () {
        if ($("#AlcoholConsumeAs").val() == "" || $("#AlcoholConsumeAs").val() == null) {
            $("#AlcoholConsumeAs_txt").val("");
        } else {
            $("#AlcoholConsumeAs_txt").val($("#AlcoholConsumeAs option:selected").text());
        }
    })
    $("#OccupationalDetails").change(function () {
        $("#OccupationalDetailsText").val($("#OccupationalDetails option:selected").text());
        if ($("#OccupationalDetails").val() == "8" || $("#OccupationalDetails").val() == "5")//Agri and Retired
        {
            $("#Agri-Retired").show();
            $("#OCCOthers").hide();
            $("#Student").hide();
            $("#SelfedEmployed").hide();
            $("#Salaried").hide();
            $("#Businessdiv").hide();
        } else if ($("#OccupationalDetails").val() == "3")//Business
        {
            $("#Businessdiv").show();
            $("#Agri-Retired").hide();
            $("#OCCOthers").hide();
            $("#Student").hide();
            $("#SelfedEmployed").hide();
            $("#Salaried").hide();
        }
        else if ($("#OccupationalDetails").val() == "1")//Salaried
        {
            $("#Salaried").show();
            $("#Businessdiv").hide();
            $("#Agri-Retired").hide();
            $("#OCCOthers").hide();
            $("#Student").hide();
            $("#SelfedEmployed").hide();
        }
        else if ($("#OccupationalDetails").val() == "2")//SelfedEmployee
        {
            $("#SelfedEmployed").show();
            $("#Salaried").hide();
            $("#Businessdiv").hide();
            $("#Agri-Retired").hide();
            $("#OCCOthers").hide();
            $("#Student").hide();
        }
        else if ($("#OccupationalDetails").val() == "6")//Student/Juvenile
        {
            $("#Student").show();
            $("#SelfedEmployed").hide();
            $("#Salaried").hide();
            $("#Businessdiv").hide();
            $("#Agri-Retired").hide();
            $("#OCCOthers").hide();
        }
        else if ($("#OccupationalDetails").val() == "7")//Others
        {
            //$("#OCCOthers").show();
            $("#Agri-Retired").show();
            $("#Student").hide();
            $("#SelfedEmployed").hide();
            $("#Salaried").hide();
            $("#Businessdiv").hide();
            // $("#Agri-Retired").hide();
        }
        else if ($("#OccupationalDetails").val() == "4")//housewife
        {
            $("#OCCOthers").hide();
            $("#Student").hide();
            $("#SelfedEmployed").hide();
            $("#Salaried").hide();
            $("#Businessdiv").hide();
            $("#Agri-Retired").hide();
        }

    })


    //TATAAIA CoutryList AutoComplete
    $("#NomineeRelationship").change(function () {
        $("#NomineeRelationshipText").val($("#NomineeRelationship option:selected").text())
    });
    $("#Nominee2Relationship").change(function () {
        $("#Nominee2RelationshipText").val($("#Nominee2Relationship option:selected").text())
    });
    $("#Nominee3Relationship").change(function () {
        $("#Nominee3RelationshipText").val($("#Nominee3Relationship option:selected").text())
    });
    $("#AppointeeRelationship").change(function () {
        $("#AppointeeRelationshipText").val($("#AppointeeRelationship option:selected").text())
    });
    $("#Appointee2Relationship").change(function () {
        $("#Appointee2RelationshipText").val($("#Appointee2Relationship option:selected").text())
    });
    $("#Appointee3Relationship").change(function () {
        $("#Appointee3RelationshipText").val($("#Appointee3Relationship option:selected").text())
    });
    $("#ProposerResidentStatus").change(function () {
        $("#ProposerResidentStatusTextTATAAIA").val($("#ProposerResidentStatus option:selected").text());
        //if ($("#InsuredResidentStatus").val() == "NRI" || $("#InsuredResidentStatus").val() == "OCI" || $("#InsuredResidentStatus").val() == "PIO" || $("#InsuredResidentStatus").val() == "FN") {
        //    $("#MobileNumberNonRI").show();
        //    $("#MobileNumberRI").hide();
        //} else {
        //    $("#MobileNumberNonRI").hide();
        //    $("#MobileNumberRI").show();
        //}
    });

    $("#ProposerMaritalStatus").change(function () {

        $("#ProposerMaritalStatusTextTATAAIA").val($("#ProposerMaritalStatus option:selected").text());
    });

    $("#InsuredMaritalStatus").change(function () {

        $("#InsuredMaritalStatusTextTATAAIA").val($("#InsuredMaritalStatus option:selected").text());
    });

    $("#ContactAgeProof").change(function () {
        $("#ContactAgeProofTextTATAAIA").val($("#ContactAgeProofs option:selected").text());
    });

    $("#InsuredAgeProof").change(function () {
        $("#InsuredAgeProofTextTATAAIA").val($("#InsuredAgeProof option:selected").text());
    });

    $("#ProposerAgeProof").change(function () {
        $("#ProposerAgeProofTextTATAAIA").val($("#ProposerAgeProof option:selected").text());
    });

    $("#InsuredAddressProof").change(function () {
        $("#InsuredAddressProofTextTATAAIA").val($("#InsuredAddressProof option:selected").text());
    });

    $("#ProposerAddressProof").change(function () {
        $("#ProposerAddressProofTextTATAAIA").val($("#ProposerAddressProof option:selected").text());
    });

    $("#InsuredIncomeProof").change(function () {
        $("#InsuredIncomeProofTextTATAAIA").val($("#InsuredIncomeProof option:selected").text());
    });

    $("#ProposerIncomeProof").change(function () {
        $("#ProposerIncomeProofTextTATAAIA").val($("#ProposerIncomeProof option:selected").text());
    });

    $("#InsuredIDProof").change(function () {
        $("#InsuredIDProofTextTATAAIA").val($("#InsuredIDProof option:selected").text());

        if ($("#InsuredIDProof").val() == "1018010075" || $("#InsuredIDProof").val() == "1018010078") {

            //$("#divIDProofNo").show();
            $("#divInsuredIDProofIssueDate").show();
            $("#divInsuredIDProofExpiryDate").show();
        }
        else {
            //$("#divIDProofNo").hide();
            $("#divInsuredIDProofIssueDate").hide();
            $("#divInsuredIDProofExpiryDate").hide();
        }

    });

    $("#ProposerIDProof").change(function () {
        $("#ProposerIDProofTextTATAAIA").val($("#ProposerIDProof option:selected").text());
    });


    $("#ProposerEducationQualification").change(function () {
        $("#ProposerEducationQuatlifiactionTextTATAAIA").val($("#ProposerEducationQualification option:selected").text());
    });

    $("#InsuredEducationQualification").change(function () {
        $("#InsuredEducationQualificationTextTATAAIA").val($("#InsuredEducationQualification option:Selected").text());
    });

    $("#ProposerResidentStatus").change(function () {
        $("#ProposerResidentStatusTextTATAAIA").val($("#ProposerResidentStatus option:selected").text());
    });

    //if ($("#InsuredResidentStatus").val() == "NRI" || $("#InsuredResidentStatus").val() == "OCI" || $("#InsuredResidentStatus").val() == "PIO" || $("#InsuredResidentStatus").val() == "FN") {
    //    $("#MobileNumberNonRI").show();
    //    $("#MobileNumberRI").hide();
    //} else {
    //    $("#MobileNumberNonRI").hide();
    //    $("#MobileNumberRI").show();
    //}

    //$("#InsuredResidentStatus").change(function () {
    //    $("#InsuredResidentStatusTextTATAAIA").val($("#InsuredResidentStatus option:selected").text());
    //    if ($("#InsuredResidentStatus").val() == "NRI" || $("#InsuredResidentStatus").val() == "OCI" || $("#InsuredResidentStatus").val() == "PIO" || $("#InsuredResidentStatus").val() == "FN") {
    //        $("#MobileNumberNonRI").show();
    //        $("#MobileNumberRI").hide();
    //    } else {
    //        $("#MobileNumberNonRI").hide();
    //        $("#MobileNumberRI").show();
    //    }
    //});



    //$("#PermanentCountry").autocomplete({
    //    source: function (request, response) {

    //        $.ajax({

    //            url: '/TermInsuranceIndia/GetCountryListTATAAIA?searchPrefix=' + request.term,

    //            data: "{ 'searchPrefix': '" + request.term + "'}",
    //            dataType: "json",
    //            type: "GET",
    //            contentType: "application/json; charset=utf-8",
    //            success: function (data) {

    //                response($.map(data, function (i) {
    //                    return {
    //                        label: i.split('-')[0],
    //                        val: i.split('-')[1]
    //                    }
    //                }))

    //            },
    //            error: function (response) {
    //                // alert("error :- " + response.responseText);
    //            },
    //            failure: function (response) {
    //                //  alert("failure :- " + response.responseText);
    //            }
    //        });
    //    },
    //    select: function (e, i) {
    //        if (i.item.value !== "No Result Found") {
    //            var text = this.value.split(/\s/);
    //            text.pop();
    //            text.push(i.item.value);
    //            // text.push("");
    //            this.value = text.join("");
    //            text.pop();
    //            text.push("");
    //            $("#PermanentCountryID").val(i.item.val);
    //        }
    //        return false;

    //    },
    //    minLength: 1
    //});

    //$("#Country").autocomplete({
    //    source: function (request, response) {

    //        $.ajax({

    //            url: '/TermInsuranceIndia/GetCountryListTATAAIA?searchPrefix=' + request.term,

    //            data: "{ 'searchPrefix': '" + request.term + "'}",
    //            dataType: "json",
    //            type: "GET",
    //            contentType: "application/json; charset=utf-8",
    //            success: function (data) {

    //                response($.map(data, function (i) {
    //                    return {
    //                        label: i.split('-')[0],
    //                        val: i.split('-')[1]
    //                    }
    //                }))

    //            },
    //            error: function (response) {
    //                // alert("error :- " + response.responseText);
    //            },
    //            failure: function (response) {
    //                //  alert("failure :- " + response.responseText);
    //            }
    //        });
    //    },
    //    select: function (e, i) {
    //        if (i.item.value !== "No Result Found") {
    //            var text = this.value.split(/\s/);
    //            text.pop();
    //            text.push(i.item.value);
    //            // text.push("");
    //            this.value = text.join("");
    //            text.pop();
    //            text.push("");
    //            $("#CountryID").val(i.item.val);
    //        }
    //        return false;

    //    },
    //    minLength: 1
    //});


    //$("#CountryOfResidence").autocomplete({
    //    source: function (request, response) {

    //        $.ajax({

    //            url: '/TermInsuranceIndia/GetCountryListTATAAIA?searchPrefix=' + request.term,

    //            data: "{ 'searchPrefix': '" + request.term + "'}",
    //            dataType: "json",
    //            type: "GET",
    //            contentType: "application/json; charset=utf-8",
    //            success: function (data) {

    //                response($.map(data, function (i) {
    //                    return {
    //                        label: i.split('-')[0],
    //                        val: i.split('-')[1]
    //                    }
    //                }))

    //            },
    //            error: function (response) {
    //                // alert("error :- " + response.responseText);
    //            },
    //            failure: function (response) {
    //                //  alert("failure :- " + response.responseText);
    //            }
    //        });
    //    },
    //    select: function (e, i) {
    //        if (i.item.value !== "No Result Found") {
    //            var text = this.value.split(/\s/);
    //            text.pop();
    //            text.push(i.item.value);
    //            // text.push("");
    //            this.value = text.join("");
    //            text.pop();
    //            text.push("");
    //            $("#CountryOfResidenceID").val(i.item.val);
    //        }
    //        return false;

    //    },
    //    minLength: 1
    //});


    //For TataAIA Medical Female Questionaire
    $("#InsuredGender").change(function () {
        //
        if ($("#InsuredGender").val() == 'F' || $("#InsuredGender").val() == 'Female') {
            $("#FemaleQuestionaire").show();
        } else {
            $("#FemaleQuestionaire").hide();
        }
    })

    $("#NomineeDOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '0',
        //onSelect: function () { $('#dvNomineeDOB').removeClass('Error'); },
        onSelect: function (value, ui) {

            var tdate = new Date();
            var currentyear = tdate.getFullYear(); //yields year

            //  var nDOB = $("#NomineeDOB").val();
            // var tdate1 = new Date(nDOB);
            var age = (currentyear - ui.selectedYear);
            // var date = $("#datetimepicker1").data("datetimepicker").getDate()
            // var age = (currentyear - year)*12;
            $("#agenominee1").val(age);
            if (age < 18) {
                $("#appointee").show();

            }
            else {
                $("#appointee").hide();
            }
            $('#dvNomineeDOB').removeClass('Error');
        }
    });
    $('#NomineeDOB').datepicker({ dateFormat: 'dd-mm-yy' }).datepicker('setDate', new Date('1990', (new Date()).getMonth(), new Date().getDate()));
    $("#divNomineeDOB").click(function () { $("#NomineeDOB").datepicker("show"); if ($('#NomineeDOB').val() != "") { $('#dvNomineeDOB').removeClass('Error'); } });
    $("#Nominee2DOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '0',
        //onSelect: function () { $('#dvNominee2DOB').removeClass('Error'); },
        onSelect: function (value, ui) {

            var tdate = new Date();
            var currentyear = tdate.getFullYear(); //yields year

            //  var nDOB = $("#Nominee2DOB").val();
            // var tdate1 = new Date(nDOB);
            var age = (currentyear - ui.selectedYear);
            // var date = $("#datetimepicker1").data("datetimepicker").getDate()
            // var age = (currentyear - year)*12;
            $("#agenominee2").val(age);
            if (age < 18) {
                $("#appointee2").show();

            }
            else {
                $("#appointee2").hide();
            }
            $('#dvNominee2DOB').removeClass('Error');
        }
    });
    $("#divNominee2DOB").click(function () { $("#Nominee2DOB").datepicker("show"); if ($('#Nominee2DOB').val() != "") { $('#dvNominee2DOB').removeClass('Error'); } });
    $("#Nominee3DOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-83:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '0',
        //onSelect: function () { $('#dvNominee3DOB').removeClass('Error'); },
        onSelect: function (value, ui) {

            var tdate = new Date();
            var currentyear = tdate.getFullYear(); //yields year

            //  var nDOB = $("#Nominee3DOB").val();
            // var tdate1 = new Date(nDOB);
            var age = (currentyear - ui.selectedYear);
            // var date = $("#datetimepicker1").data("datetimepicker").getDate()
            // var age = (currentyear - year)*13;
            $("#agenominee3").val(age);
            if (age < 18) {
                $("#appointee3").show();

            }
            else {
                $("#appointee3").hide();
            }
            $('#dvNominee3DOB').removeClass('Error');
        }
    });
    $("#divNominee3DOB").click(function () { $("#Nominee3DOB").datepicker("show"); if ($('#Nominee3DOB').val() != "") { $('#dvNominee3DOB').removeClass('Error'); } });

    $("#ContactDOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvContactDOB').removeClass('Error'); }
    });
    $("#dvContactDOB").click(function () { $("#ContactDOB").datepicker("show"); if ($('#ContactDOB').val() != "") { $('#dvContactDOB').removeClass('Error'); } });


    $("#AppointeeDOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvAppointeeDOB').removeClass('Error'); }
    });
    $("#dvAppointeeDOB").click(function () { $("#AppointeeDOB").datepicker("show"); if ($('#AppointeeDOB').val() != "") { $('#dvAppointeeDOB').removeClass('Error'); } });
    $("#Appointee2DOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvAppointee2DOB').removeClass('Error'); }
    });
    $("#dvAppointee2DOB").click(function () { $("#Appointee2DOB").datepicker("show"); if ($('#Appointee2DOB').val() != "") { $('#dvAppointee2DOB').removeClass('Error'); } });
    $("#Appointee3DOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y',
        onSelect: function () { $('#dvAppointee3DOB').removeClass('Error'); }
    });
    $("#dvAppointee3DOB").click(function () { $("#Appointee3DOB").datepicker("show"); if ($('#Appointee3DOB').val() != "") { $('#dvAppointee3DOB').removeClass('Error'); } });

    $("#BloodPressureFirstRoundDate").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '',
        onSelect: function () { $('#dvBloodPressureFirstRoundDate').removeClass('Error'); }
    });

    $("#dvBloodPressureFirstRoundDate").click(function () { $("#BloodPressureFirstRoundDate").datepicker("show"); if ($('#BloodPressureFirstRoundDate').val() != "") { $('#dvBloodPressureFirstRoundDate').removeClass('Error'); } });


    $("#BPReadingDate").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '',
        onSelect: function () { $('#dvBPReadingDate').removeClass('Error'); }
    });

    $("#dvBPReadingDate").click(function () { $("#BPReadingDate").datepicker("show"); if ($('#BPReadingDate').val() != "") { $('#dvBPReadingDate').removeClass('Error'); } });


    $("#AreYouOnTreatementNowDtl").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '',
        onSelect: function () { $('#dvcomplicationsdtl').removeClass('Error'); }
    });

    $("#dvAreYouOnTreatementNowDtl").click(function () { $("#AreYouOnTreatementNowDtl").datepicker("show"); if ($('#AreYouOnTreatementNowDtl').val() != "") { $('#dvAreYouOnTreatementNowDtl').removeClass('Error'); } });

    $("#Past12MonthBPReadingDate").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-1Y',
        onSelect: function () { $('#dvPast12MonthBPReadingDate').removeClass('Error'); }
    });

    $("#dvPast12MonthBPReadingDate").click(function () { $("#Past12MonthBPReadingDate").datepicker("show"); if ($('#Past12MonthBPReadingDate').val() != "") { $('#dvPast12MonthBPReadingDate').removeClass('Error'); } });


    $("#DateOfFirstDignosis").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '',
        onSelect: function () { $('#dvDateOfFirstDignosis').removeClass('Error'); }
    });

    $("#dvDateOfFirstDignosis").click(function () { $("#DateOfFirstDignosis").datepicker("show"); if ($('#DateOfFirstDignosis').val() != "") { $('#dvDateOfFirstDignosis').removeClass('Error'); } });

    $("#DateOfLastAttendedDoctor").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '',
        onSelect: function () { $('#dvDateOfLastAttendedDoctor').removeClass('Error'); }
    });

    $("#dvDateOfLastAttendedDoctor").click(function () { $("#DateOfLastAttendedDoctor").datepicker("show"); if ($('#DateOfLastAttendedDoctor').val() != "") { $('#dvDateOfLastAttendedDoctor').removeClass('Error'); } });

    $("#AlcoholStopConsumptionYearMonth").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '0',
        onSelect: function () { $('#dvAlcoholStopConsumptionYearMonth').removeClass('Error'); }
    });
    $("#dvAlcoholStopConsumptionYearMonth").click(function () { $("#AlcoholStopConsumptionYearMonth").datepicker("show"); if ($('#AlcoholStopConsumptionYearMonth').val() != "") { $('#dvAlcoholStopConsumptionYearMonth').removeClass('Error'); } });

    $("#StopConsumptionYearMonth").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '0',
        onSelect: function () { $('#dvStopConsumptionYearMonth').removeClass('Error'); }
    });
    $("#dvStopConsumptionYearMonth").click(function () { $("#StopConsumptionYearMonth").datepicker("show"); if ($('#StopConsumptionYearMonth').val() != "") { $('#dvStopConsumptionYearMonth').removeClass('Error'); } });

    $("#NarcoticsStopConsumptionYearMonth").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '0',
        onSelect: function () { $('#dvNarcoticsStopConsumptionYearMonth').removeClass('Error'); }
    });
    $("#dvNarcoticsStopConsumptionYearMonth").click(function () { $("#NarcoticsStopConsumptionYearMonth").datepicker("show"); if ($('#NarcoticsStopConsumptionYearMonth').val() != "") { $('#dvNarcoticsStopConsumptionYearMonth').removeClass('Error'); } });


    $("#QuestionId48").datepicker({
        changeMonth: true,
        changeYear: true,
        //yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: 0,
        maxDate: '+1y',
        onSelect: function () { $('#dvQuestionId48').removeClass('Error'); }
    });
    $("#dvQuestionId48").click(function () { $("#QuestionId48").datepicker("show"); if ($('#QuestionId48').val() != "") { $('#dvQuestionId48').removeClass('Error'); } });

    $("#InsuredIDProofIssueDate").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-1',

        onSelect: function () { $('#dvInsuredIDProofIssueDate').removeClass('Error'); }
    });
    $("#dvInsuredIDProofIssueDate").click(function () { $("#InsuredIDProofIssueDate").datepicker("show"); if ($('#InsuredIDProofIssueDate').val() != "") { $('#dvInsuredIDProofIssueDate').removeClass('Error'); } });


    $("#InsuredIDProofExpiryDate").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: "-100:+20",
        dateFormat: 'dd-mm-yy',
        minDate: '+1',
        maxDate: '20y',
        onSelect: function () { $('#dvInsuredIDProofExpiryDate').removeClass('Error'); }
    });
    $("#dvInsuredIDProofExpiryDate").click(function () { $("#InsuredIDProofExpiryDate").datepicker("show"); if ($('#InsuredIDProofExpiryDate').val() != "") { $('#dvInsuredIDProofExpiryDate    ').removeClass('Error'); } });

    var contactpincode = $("#ContactPinCode").val();
    if (contactpincode != null) {
        $("#ContactPinCode").focusout(function () {
            if (checkPincode($(this)) == false) {
                $('#dvContactPinCode').addClass('Error');
                $('#PostOfficeId').empty();
                $('#ContactCityName').removeClass('used').val("");
                $('#ContactState').removeClass('used').val("");
            }
            else {
                GetPincodeDetails($(this).val());
                $('#dvContactPinCode').removeClass('Error');
                $('#dvCity').removeClass('Error');
                $('#dvStateName').removeClass('Error');
                $('#ContactCityName').addClass('used');
                $('#ContactState').addClass('used');
            }
        });
    }

    var permanentpincode = $("#PermanentPinCode").val();
    if (permanentpincode != null) {
        $("#PermanentPinCode").focusout(function () {
            if (checkPincode($(this)) == false) {
                $('#dvPermanentPinCode').addClass('Error');
                // $('#PermanentPostOfficeId').empty();
                $('#PermanentCityName').removeClass('used').val("");
                $('#PermanentState').removeClass('used').val("");
            }
            else {
                GetPermanentPincodeDetails($(this).val());
                $('#dvPermanentPinCode').removeClass('Error');
                $('#dvPermanentCityName').removeClass('Error');
                $('#dvPermanentStateName').removeClass('Error');
                $('#PermanentCityName').addClass('used');
                $('#PermanentStateName').addClass('used');
            }
        });
    }



    var nomineepincode = $("#NomineePinCode").val();
    if (nomineepincode != null) {
        $("#NomineePinCode").focusout(function () {
            if (checkPincode($(this)) == false) {
                $('#dvNomineePinCode').addClass('Error');
                //  $('#NomineePostOfficeId').empty();
                $('#NomineeCityName').removeClass('used').val("");
                $('#NomineeState').removeClass('used').val("");
            }
            else {
                GetHDFCLifeNomineePincodeDetails($(this).val());
                $('#dvNomineePinCode').removeClass('Error');
                $('#dvNomineeCity').removeClass('Error');
                $('#dvNomineeState').removeClass('Error');
                $('#NomineeCityName').addClass('used');
                $('#NomineeState').addClass('used');
            }
        });
    }
    var nominee2pincode = $("#Nominee2PinCode").val();
    if (nominee2pincode != null) {
        $("#Nominee2PinCode").focusout(function () {
            if (checkPincode($(this)) == false) {
                $('#dvNominee2PinCode').addClass('Error');
                //  $('#NomineePostOfficeId').empty();
                $('#Nominee2CityName').removeClass('used').val("");
                $('#Nominee2State').removeClass('used').val("");
            }
            else {
                GetHDFCLifeNominee2PincodeDetails($(this).val());
                $('#dvNominee2PinCode').removeClass('Error');
                $('#dvNominee2City').removeClass('Error');
                $('#dvNominee2State').removeClass('Error');
                $('#Nominee2CityName').addClass('used');
                $('#Nominee2State').addClass('used');
            }
        });
    }
    var nomineepincode = $("#Nominee3PinCode").val();
    if (nomineepincode != null) {
        $("#Nominee3PinCode").focusout(function () {
            if (checkPincode($(this)) == false) {
                $('#dvNominee3PinCode').addClass('Error');
                //  $('#NomineePostOfficeId').empty();
                $('#Nominee3CityName').removeClass('used').val("");
                $('#Nominee3State').removeClass('used').val("");
            }
            else {
                GetHDFCLifeNominee3PincodeDetails($(this).val());
                $('#dvNominee3PinCode').removeClass('Error');
                $('#dvNominee3City').removeClass('Error');
                $('#dvNominee3State').removeClass('Error');
                $('#Nominee3CityName').addClass('used');
                $('#Nominee3State').addClass('used');
            }
        });
    }
    var appointeepincode = $("#AppointeePinCode").val();
    if (appointeepincode != null) {

        $("#AppointeePinCode").focusout(function () {
            if (checkPincode($(this)) == false) {
                $('#dvAppointeePinCode').addClass('Error');
                //  $('#NomineePostOfficeId').empty();
                $('#AppointeeCityName').removeClass('used').val("");
                $('#AppointeeState').removeClass('used').val("");
            }
            else {
                GetHDFCLifeAppointeePincodeDetails($(this).val());
                $('#dvAppointeePinCode').removeClass('Error');
                $('#dvAppointeeCity').removeClass('Error');
                $('#dvAppointeeState').removeClass('Error');
                $('#AppointeeCityName').addClass('used');
                $('#AppointeeState').addClass('used');
            }
        });
    }
    var appointee2pincode = $("#Appointee2PinCode").val();
    if (appointee2pincode != null) {

        $("#Appointee2PinCode").focusout(function () {
            if (checkPincode($(this)) == false) {
                $('#dvAppointee2PinCode').addClass('Error');
                //  $('#NomineePostOfficeId').empty();
                $('#Appointee2CityName').removeClass('used').val("");
                $('#Appointee2State').removeClass('used').val("");
            }
            else {
                GetHDFCLifeAppointee2PincodeDetails($(this).val());
                $('#dvAppointee2PinCode').removeClass('Error');
                $('#dvAppointee2City').removeClass('Error');
                $('#dvAppointee2State').removeClass('Error');
                $('#Appointee2CityName').addClass('used');
                $('#Appointee2State').addClass('used');
            }
        });
    }
    var appointee3pincode = $("#Appointee3PinCode").val();
    if (appointee3pincode != null) {

        $("#Appointee3PinCode").focusout(function () {
            if (checkPincode($(this)) == false) {
                $('#dvAppointee3PinCode').addClass('Error');
                //  $('#NomineePostOfficeId').empty();
                $('#Appointee3CityName').removeClass('used').val("");
                $('#Appointee3State').removeClass('used').val("");
            }
            else {
                GetHDFCLifeAppointee3PincodeDetails($(this).val());
                $('#dvAppointee3PinCode').removeClass('Error');
                $('#dvAppointee3City').removeClass('Error');
                $('#dvAppointee3State').removeClass('Error');
                $('#Appointee3CityName').addClass('used');
                $('#Appointee3State').addClass('used');
            }
        });
    }
    //Nominee CITY STATE
    $("#NomineePinCode").focusout(function () {
        if (checkPincode($(this)) == false) {
            $('#dvNomineePinCode').addClass('Error');
            //  $('#NomineePostOfficeId').empty();
            $('#NomineeCityName').removeClass('used').val("");
            $('#NomineeState').removeClass('used').val("");
        }
        else {
            GetHDFCLifeNomineePincodeDetails($(this).val());
            $('#dvNomineePinCode').removeClass('Error');
            $('#dvNomineeCity').removeClass('Error');
            $('#dvNomineeState').removeClass('Error');
            $('#NomineeCityName').addClass('used');
            $('#NomineeState').addClass('used');
        }
    });

    $("#CountryID").val("IN");
    $("#Country").val("INDIA");
    $("#Country").addClass('used');

    $("#PermanentCountryID").val("IN");
    $("#PermanentCountry").val("INDIA");
    $("#PermanentCountry").addClass('used');

    $('#TaxIdentificationNumber1').keypress(function (e) {
        var regex = new RegExp("^[A-Za-z0-9\/.,()':-]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            return true;
        }
        else {
            e.preventDefault();
            return false;
        }
    });
    $('#TaxIdentificationNumber2').keypress(function (e) {
        var regex = new RegExp("^[A-Za-z0-9\/.,()':-]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            return true;
        }
        else {
            e.preventDefault();
            return false;
        }
    });

    $('#TaxIdentificationNumber3').keypress(function (e) {
        var regex = new RegExp("^[A-Za-z0-9\/.,()':-]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            return true;
        }
        else {
            e.preventDefault();
            return false;
        }
    });
    $('#Identificationno').keypress(function (e) {
        var regex = new RegExp("^[A-Za-z0-9\/.,()':-]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            return true;
        }
        else {
            e.preventDefault();
            return false;
        }
    });
    $('#FatherName2').keypress(function (e) {
        var regex = new RegExp("^[A-Za-z0-9\/ .,()':-]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            return true;
        }
        else {
            e.preventDefault();
            return false;
        }
    });
    $('#PlaceOfBirth').keypress(function (e) {
        var regex = new RegExp("^[A-Za-z0-9\/ .,()':-]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            return true;
        }
        else {
            e.preventDefault();
            return false;
        }
    });

    $('#IdentificationTypeOthers').keypress(function (e) {
        var regex = new RegExp("^[A-Za-z0-9\/.,()':-]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            return true;
        }
        else {
            e.preventDefault();
            return false;
        }
    });

    $("#IdentificationType").change(function () {

        if ($("#IdentificationType").val() == "Others") {
            $("#divIdentificationTypeOthers").show();
        } else {
            $("#divIdentificationTypeOthers").hide();
        }
    });

    $("#addfatca").click(function () {
        $("#divaddfatca").hide();
        $("#divremfatca").show();
        $("#divaddfatca1").show();
        $("#Fatca2").show();

        countfatca = $("#FatcaCount").val();
        countfatca++;
        $("#FatcaCount").val(countfatca);
        console.log(countfatca);
    });
    $("#remfatca").click(function () {
        $("#Fatca2").hide();
        $("#divaddfatca1").hide();
        $("#divaddfatca").show();
        $("#divremfatca").hide();
        countfatca = $("#FatcaCount").val();
        countfatca--;
        $("#FatcaCount").val(countfatca);
        console.log(countfatca);
    });

    $("#addfatca1").click(function () {
        $("#divaddfatca1").hide();
        $("#divremfatca").hide();
        $("#divremfatca1").show();
        $("#Fatca3").show()
        countfatca = $("#FatcaCount").val();
        countfatca++;
        $("#FatcaCount").val(countfatca);
        console.log(countfatca);
    });
    $("#remfatca1").click(function () {
        $("#Fatca3").hide();
        $("#divaddfatca1").show();
        $("#divremfatca").show();
        $("#divremfatca1").hide();
        countfatca = $("#FatcaCount").val();
        countfatca--;
        $("#FatcaCount").val(countfatca);
        console.log(countfatca);
    });

    $("#txtNomineeAllocation1").keyup(function () {
        total();
    });

    $("#txtNominee2Allocation1").keyup(function () {
        total();
    });

    $("#txtNominee3Allocation1").keyup(function () {
        total();
    });
    $("#txtNomineeAllocation1").keypress(function () {

        return isNumber(event);
    });

    $("#txtNominee2Allocation1").keypress(function () {

        return isNumber(event);
    });

    $("#txtNominee3Allocation1").keypress(function () {

        return isNumber(event);
    });

    $("#nomineepercentagetotal").keypress(function () {

        return isNumber(event);
    });
});
function total() {

    var n1 = 0, n2 = 0, n3 = 0;
    n1 = $("#txtNomineeAllocation1").val();
    n2 = $("#txtNominee2Allocation1").val();
    n3 = $("#txtNominee3Allocation1").val();
    var total = 0
    total = total + parseInt(n1);
    if (n2 != "") {
        total = total + parseInt(n2);
    }

    $("#nomineepercentagetotal").val(total);
    if (n3 != "") {
        total = total + parseInt(n3);
    }
    
    $("#nomineepercentagetotal").val(total);
    //if (total > 100 || total < 100)
    //{
    //    alert("please enter valid percentage");
    //}
    
}
function GetPincodeDetails(Pincode) {//Mohini

    $.get('/TermInsuranceIndia/GetTATAAIAPincodeDetails?Pincode=' + Pincode, function (response) {
        var _response = $.parseJSON(response);
        //$("#ContactCityName").val(_response.District);
        $("#ContactState").val(_response.State);
        //$("#TATAAIAContactCityID").val(_response.DistrictID);
        $("#ContactStateID").val(_response.StateID);
        $("#ContactState").addClass('used');
        console.log($("#ContactStateID").val());
        $.ajax({
            url: "/TermInsuranceIndia/GetTATAAIACityMaster?ContactStateID=" + _response.StateID,
            type: "POST",
            dataType: "json",
            contentType: 'application/json;',
            //data: JSON.stringify(data1),
            success: function (data) {
                console.log(data);
                //$("#TATAAIAContactCityID").val(data);
                $("#TATAAIAContactCityID").empty();
                $("#TATAAIAContactCityID").append($('<option></option>').val("").html("Select"));
                for (var i = 0; i < data.length; i++) {
                    $("#TATAAIAContactCityID").append($('<option></option>').val(data[i].Value).html(data[i].Text));
                }
                
               
            },
            error: function (data) {
            }
        });
        
    });
}

function GetPermanentPincodeDetails(Pincode) {//Mohini
    //
    $.get('/TermInsuranceIndia/GetTATAAIAPincodeDetails?Pincode=' + Pincode, function (response) {
        var _response = $.parseJSON(response);
        $("#PermanentCityName").val(_response.District);
        $("#PermanentStateName").val(_response.State);
        $("#TATAAIAPermanentCityID").val(_response.DistrictID);
        $("#PermanentStateID").val(_response.StateID);
        $.ajax({
            url: "/TermInsuranceIndia/GetTATAAIACityMaster?ContactStateID=" + $("#PermanentStateID").val(),
            type: "POST",
            dataType: "json",
            contentType: 'application/json;',
            //data: JSON.stringify(data1),
            success: function (data) {
                console.log(data);
                //$("#TATAAIAContactCityID").val(data);
                $("#TATAAIAPermanentCityID").empty();
                $("#TATAAIAPermanentCityID").append($('<option></option>').val("").html("Select"));
                for (var i = 0; i < data.length; i++) {
                    $("#TATAAIAPermanentCityID").append($('<option></option>').val(data[i].Value).html(data[i].Text))
                }
            },
            error: function (data) {
            }
        });
       

    });
}



function GetHDFCLifeNomineePincodeDetails(Pincode) {//Mohini

    $.get('/TermInsuranceIndia/GetTATAAIAPincodeDetails?Pincode=' + Pincode, function (response) {
        var _response = $.parseJSON(response);


        $("#NomineeCityName").val(_response.District);
        $("#NomineeState").val(_response.State);
        $("#HDFCNomineeCityID").val(_response.DistrictID);
        $("#NomineeStateID").val(_response.StateID);
        $("#PBNomineeCityID").val(_response.PBCityId);
        //var listItems = "";
        //listItems = " <option value=\"0\">Select Area</option>";
        //for (var i = 0; i < _response.Locality.length; i++)
        //{ listItems += "<option value='" + _response.Locality[i].Pincode_Id + "'>" + _response.Locality[i].Pin_code + "</option>"; }
        //$("#NomineePostOfficeId").html(listItems);
        //$('#NomineePostOfficeId').val("0");
    });
}

function GetHDFCLifeNominee2PincodeDetails(Pincode) {

    $.get('/TermInsuranceIndia/GetTATAAIAPincodeDetails?Pincode=' + Pincode, function (response) {
        var _response = $.parseJSON(response);
        $("#Nominee2CityName").val(_response.District);
        $("#Nominee2State").val(_response.State);
        $("#HDFCNominee2CityID").val(_response.DistrictID);
        $("#Nominee2StateID").val(_response.StateID);
        $("#PBNominee2CityID").val(_response.PBCityId);
        
    });
}
function GetHDFCLifeNominee3PincodeDetails(Pincode) {

    $.get('/TermInsuranceIndia/GetTATAAIAPincodeDetails?Pincode=' + Pincode, function (response) {
        var _response = $.parseJSON(response);
        $("#Nominee3CityName").val(_response.District);
        $("#Nominee3State").val(_response.State);
        $("#HDFCNominee3CityID").val(_response.DistrictID);
        $("#Nominee3StateID").val(_response.StateID);
        $("#PBNominee3CityID").val(_response.PBCityId);

    });
}

function MedicalQuestionAns(ID, value) {
    if (value == 'Yes') {
        $("#" + ID).val("Y");
        $("#" + ID + "Y").addClass('active');
        $("#" + ID + "N").removeClass('active');

    }
    else {
        $("#" + ID).val("N");
        $("#" + ID + "N").addClass('active');
        $("#" + ID + "Y").removeClass('active');
        if ($("#QuestionId73").val() == "N") {
            $("#HighBloodPressure").val(false);
            $("#Dibetes").val(false);
        }
    }
    if ($("#QuestionId47").val() == "Y") {
        $("#DeliveryDate").show();
    } else {
        $("#DeliveryDate").hide();
    }
    if ($("#QuestionId54").val() == "Y") {
        $("#subquetion26").show();
    } else {
        $("#subquetion26").hide();
    }

    if ($("#QuestionId19").val() == "Y") {
        $("#subquetion30").show();
    } else {
        $("#subquetion30").hide();
    }

    if ($("#QuestionId20").val() == "Y") {
        $("#subquetion5").show();
    } else {
        $("#subquetion5").hide();
    }

    if ($("#QuestionId72").val() == "Y") {
        $("#subquetion31").show();
    } else {
        $("#subquetion31").hide();
    }

    if ($("#QuestionId74").val() == "Y") {
        $("#subquetion32").show();
    } else {
        $("#subquetion32").hide();
    }

    if ($("#QuestionId76").val() == "Y") {
        $("#subquetion33").show();
    } else {
        $("#subquetion33").hide();
    }

    if ($("#QuestionId78").val() == "Y") {
        $("#subquetion34").show();
    } else {
        $("#subquetion34").hide();
    }

    if ($("#QuestionId80").val() == "Y") {
        $("#subquetion35").show();
    } else {
        $("#subquetion35").hide();
    }

    if ($("#QuestionId82").val() == "Y") {
        $("#subquetion36").show();
    } else {
        $("#subquetion36").hide();
    }

    if ($("#QuestionId84").val() == "Y") {
        $("#subquetion37").show();
    } else {
        $("#subquetion37").hide();
    }

    if ($("#QuestionId86").val() == "Y") {
        $("#subquetion38").show();
    } else {
        $("#subquetion38").hide();
    }

    if ($("#QuestionId88").val() == "Y") {
        $("#subquetion39").show();
    } else {
        $("#subquetion39").hide();
    }

    if ($("#QuestionId90").val() == "Y") {
        $("#subquetion40").show();
    } else {
        $("#subquetion40").hide();
    }

    if ($("#QuestionId92").val() == "N") {

        $("#subquetion41").show();
    } else {
        $("#subquetion41").hide();
    }

    if ($("#QuestionId93").val() == "Y") {
        $("#subquetion42").show();
    } else {
        $("#subquetion42").hide();
    }

    if ($("#QuestionId44").val() == "Y") {
        $("#subquetion19").show();
        // $("#subquetion19N").hide();
    } else {
        //$("#subquetion19N").show();
        $("#subquetion19").hide();

    }

    //if ($("#QuestionId44").val() == "N") {

    //    $("#subquetion19N").show();
    //} else {
    //    $("#subquetion19N").hide();


    //}

    if ($("#QuestionId94").val() == "Y") {
        $("#subquetion43").show();
    } else {
        $("#subquetion43").hide();
    }

    if ($("#QuestionId95").val() == "Y") {
        $("#subquetion44").show();
    } else {
        $("#subquetion44").hide();
    }

    if ($("#QuestionId49").val() == "Y") {
        $("#subquetion22").show();
    } else {
        $("#subquetion22").hide();
    }

    if ($("#QuestionId50").val() == "Y") {
        $("#subquetion23").show();
    } else {
        $("#subquetion23").hide();
    }

    if ($("#QuestionId51").val() == "Y") {
        $("#subquetion24").show();
    } else {
        $("#subquetion24").hide();
    }
    if ($("#QuestionId93").val() == "Y") {
        $("#subquetion42").show();

        $("#FamilyMemberCount").val(2);
        $("#FamilyDetailsReflexive").show();
        var val1 = $("input:radio[name=FamilyMemberStatus1]:checked").val();
        //alert(val1);
        $("#FamilyMember1Status").val(val1);

        var val2 = $("input:radio[name=FamilyMemberStatus2]:checked").val();
        $("#FamilyMember2Status").val(val2);
        var val3 = $("input:radio[name=FamilyMemberStatus3]:checked").val();
        $("#FamilyMember3Status").val(val3);
        var val4 = $("input:radio[name=FamilyMemberStatus4]:checked").val();
        $("#FamilyMember4Status").val(val4);
        var val5 = $("input:radio[name=FamilyMemberStatus5]:checked").val();
        $("#FamilyMember5Status").val(val5);
    }
    else {
        $("#subquetion42").hide();
        $("#FamilyDetailsReflexive").hide();
    }

    if ($("#QuestionId73").val() == "Y") {

        $("#SubQuestion73").find('input,checkbox').attr('disabled', false);
        $("#Cardio").val(null);
        $("#HARMONAL").val(null);
        $("#RESPIRATORY").val(null);
        $("#BLOODCELLULAR").val(null);
        $("#MPNA").val(null);
        $("#NSM").val(null);
        $("#GENITOURINARY").val(null);
        //  $("#SubQuestion73").find('input,checkbox').removeAttr('disabled');
    } else {
        $("#SubQuestion73").find('input,checkbox').attr('disabled', 'disabled');
        $("#Cardio").val(null);
        $("#HARMONAL").val(null);
        $("#RESPIRATORY").val(null);
        $("#BLOODCELLULAR").val(null);
        $("#MPNA").val(null);
        $("#NSM").val(null);
        $("#GENITOURINARY").val(null);
        $("#HighBloodPressure").prop("checked", false);
        $("#HighBloodSugar").prop("checked", false);

        $("#HighBloodPressure").val(false);
        $("#HighBloodSugar").val(false);

        $("#HyperTension").hide();
        $("#DiabetesReflexive").hide();
        $("#SubQuestion73").find('input,checkbox').prop('checked', false);
    }
}

function LifeStyleQuestionAns(ID, value) {

    if (value == 'Yes') {
        $("#" + ID).val("Y");
        $("#" + ID + "Y").val("Y");
        $("#" + ID + "Y").addClass('active');
        $("#" + ID + "N").removeClass('active');
    }
    else {
        $("#" + ID).val("N");
        $("#" + ID + "N").val("N");
        $("#" + ID + "N").addClass('active');
        $("#" + ID + "Y").removeClass('active');
    }

    if ($("#QuestionId1").val() == 'Y') {
        $("#Defence").show();
        $("#defencetxt").show();
    } else {
        $("#Defence").hide();
        $("#defencetxt").hide();
    }


    if ($("#QuestionId11").val() == 'Y') {
        $("#TobacoConsume").show();
    } else {
        $("#TobacoConsume").hide();
    }



    if ($("#QuestionId9").val() == 'Y') {
        $("#AlcoholConsume").show();
    } else {
        $("#AlcoholConsume").hide();
    }

    if ($("#QuestionId15").val() == 'Y') {
        $("#NarcoticsConsume").show();
    } else {
        $("#NarcoticsConsume").hide();
    }

    if ($("#QuestionId2").val() == "Y") {

        //$("#subquetion3").show();
        $("#subquetion4").show();
    } else {
        // $("#subquetion3").hide();
        $("#subquetion4").hide();
    }

    if ($("#QuestionId5").val() == "Y") {
        $("#subquetion6").show();
    } else {
        $("#subquetion6").hide();
        $("#SubQuetionId6").val("");
    }

    if ($("#QuestionId7").val() == "Y") {
        $("#subquetion8").show();

    } else {
        $("#subquetion8").hide();
        $("#SubQuetionId8").val("");
    }
}
function CovidQuestionAns(ID, value) {

    if (value == 'Yes') {
        $("#" + ID).val("Y");
        $("#" + ID + "Y").val("Y");
        $("#" + ID + "Y").addClass('active');
        $("#" + ID + "N").removeClass('active');
    }
    else {
        $("#" + ID).val("N");
        $("#" + ID + "N").val("N");
        $("#" + ID + "N").addClass('active');
        $("#" + ID + "Y").removeClass('active');
    }
    if ($("#CovidQuestionId1").val() == 'Y' || $("#CovidQuestionId2").val() == 'Y' || $("#CovidQuestionId3").val()=='N') {
        $("#CovidReflexivediv").show();
    }
    else {
        $("#CovidReflexivediv").hide();
        $("#CovidSubQuestionId1").val("N");
        $("#CovidSubQuestionId2").val("N");
        $("#CovidSubQuestionId3").val("N");
        $("#CovidSubQuestionId4").val("N");
        $("#CovidSubQuestionId5").val("N");
        $("#CovidSubQuestionId6a").val("N");
        $("#CovidSubQuestionId6b").val("N");
        $("#CovidSubQuestionId6c").val("N");
    }
    if ($("#CovidSubQuestionId1").val() == 'Y') {
        $("#dvCovidSubQuestionId1Ans").show();
    }
    else {
        $("#dvCovidSubQuestionId1Ans").hide();
    }
    if ($("#CovidSubQuestionId2").val() == 'Y') {
        $("#dvCovidSubQuestionId2Ans").show();
    }
    else {
        $("#dvCovidSubQuestionId2Ans").hide();
    }
    if ($("#CovidSubQuestionId4").val() == 'Y') {
        $("#dvCovidSubQuestionId4Ans").show();
        $('#dvCovidSubQuestionId4Date').show();
    }
    else {
        $("#dvCovidSubQuestionId4Ans").hide();
        $('#dvCovidSubQuestionId4Date').hide();
    }
    if ($("#CovidSubQuestionId5").val() == 'Y') {
        $("#dvCovidSubQuestionId5Ans").show();
    }
    else {
        $("#dvCovidSubQuestionId5Ans").hide();
    }
    if ($("#CovidSubQuestionId6a").val() == 'Y') {
        $("#dvCovidSubQuestionId6a").show();
    }
    else {
        $("#dvCovidSubQuestionId6a").hide();
    }
    if ($("#CovidSubQuestionId6b").val() == 'Y') {
        $("#dvCovidSubQuestionId6b").show();
    }
    else {
        $("#dvCovidSubQuestionId6b").hide();
    }
    if ($("#CovidSubQuestionId6c").val() == 'Y') {
        $("#dvCovidSubQuestionId6c").show();
    }
    else {
        $("#dvCovidSubQuestionId6c").hide();
    }
}


function naddress(ID) {
    if (ID == 'Yes') {
        $('#naddress').val('Yes');
        $("#naddressY").addClass('active');
        $("#naddressN").removeClass('active');
        $("#NomineeAddress").hide();

    }
    else if (ID == 'No') {
        $('#naddress').val('No');
        $("#naddressN").addClass('active');
        $("#naddressY").removeClass('active');
        $("#NomineeAddress").show();
    }
}


function DominantHand(ID) {
    if (ID == 'Left') {
        $('#DominantHand').val('Left');
        $("#DominantHandL").addClass('active');
        $("#DominantHandR").removeClass('active');
        // $("#padd").hide();

    }
    else if (ID == 'Right') {
        $('#DominantHand').val('Right');
        $("#DominantHandR").addClass('active');
        $("#DominantHandL").removeClass('active');
        // $("#padd").show();

    }
}

function paddress(ID) {
    if (ID == 'Yes') {
        $('#paddress').val('Yes');
        $("#paddressY").addClass('active');
        $("#paddressN").removeClass('active');
        $("#padd").hide();

    }
    else if (ID == 'No') {
        $('#paddress').val('No');
        $("#paddressN").addClass('active');
        $("#paddressY").removeClass('active');
        $("#padd").show();
    }
}

function politicalexposedperson(ID) {

    if (ID == 'Yes') {
        $('#politicalexposedperson').val('Yes');
        $("#politicalexposedpersonY").addClass('active');
        $("#politicalexposedpersonN").removeClass('active');
        $("#PoliticallyExposedYes").show();
    }
    else {
        $("#PoliticallyExposedYes").hide();
        $('#politicalexposedperson').val('No');
        $("#politicalexposedpersonN").addClass('active');
        $("#politicalexposedpersonY").removeClass('active');
    }

}

function TaxResidentIndiaPerson(ID) {

    if (ID == 'Yes') {
        $('#TaxResidentofIndia').val('Yes');
        $("#TaxResidentY").addClass('active');
        $("#TaxResidentN").removeClass('active');
        $("#TaxResidentofIndiaYes").show();
        $("#FATCAReflexive").show();
        $("#FatcaCount").val(1);
    }
    else {
        $('#TaxResidentofIndia').val('No');
        $("#TaxResidentN").addClass('active');
        $("#TaxResidentY").removeClass('active');
        $("#TaxResidentofIndiaYes").hide();
        $("#FATCAReflexive").hide();
        $("#FatcaCount").val(0);
    }

}

function CommunicationAddress(ID) {
    if (ID == 'Yes') {
        $('#CommunicationAddress').val('Current');
        $("#CommunicationAddressY").addClass('active');
        $("#CommunicationAddressN").removeClass('active');

    }
    else {
        $('#CommunicationAddress').val('Permanent');
        $("#CommunicationAddressN").addClass('active');
        $("#CommunicationAddressY").removeClass('active');
    }
}
function EIA(ID) {
    if (ID == 'Yes' || ID == 'Y') {
        $('#EIA').val('Y');
        $("#EIAY").addClass('active');
        $("#EIAN").removeClass('active');
        $("#EIANoYes").show();
        $("#EIANoNew").hide();
    }
    else if (ID == 'No' || ID == 'N') {
        $('#EIA').val('N');
        $("#EIAN").addClass('active');
        $("#EIAY").removeClass('active');
        $("#EIANoYes").hide();
        $("#EIANoNew").show();
    }
}


function ConsiderSecondary(ID) {
    if (ID == 'Yes' || ID == 'Y') {
        $('#ConsiderSecondary').val('Yes');
        $("#ConsiderSecondaryY").addClass('active');
        $("#ConsiderSecondaryN").removeClass('active');
        $("#ConsiderSecondaryYes").show();
    }
    else if (ID == 'No' || ID == 'N') {
        $('#ConsiderSecondary').val('No');
        $("#ConsiderSecondaryN").addClass('active');
        $("#ConsiderSecondaryY").removeClass('active');
        $("#ConsiderSecondaryYes").hide();
    }
}


function complications(ID) {

    if (ID == 'Yes' || ID == 'Y') {
        $('#complications').val('Yes');
        $("#complicationsY").addClass('active');
        $("#complicationsN").removeClass('active');
        $("#complicationsYes").show();

    }
    else if (ID == 'No' || ID == 'N') {
        $('#complications').val('No');
        $("#complicationsN").addClass('active');
        $("#complicationsY").removeClass('active');
        $("#complicationsYes").hide();
    }
}


function AreYouOnTreatementNow(ID) {

    if (ID == 'Yes' || ID == 'Y') {
        $('#AreYouOnTreatementNow').val('Yes');
        $("#AreYouOnTreatementNowY").addClass('active');
        $("#AreYouOnTreatementNowN").removeClass('active');
        $("#AreYouOnTreatementNowYes").show();

    }
    else if (ID == 'No' || ID == 'N') {
        $('#AreYouOnTreatementNow').val('No');
        $("#AreYouOnTreatementNowN").addClass('active');
        $("#AreYouOnTreatementNowY").removeClass('active');
        $("#AreYouOnTreatementNowYes").hide();
    }
}


function FollowupFail(ID) {

    if (ID == 'Yes' || ID == 'Y') {
        $('#FollowupFail').val('Yes');
        $("#FollowupFailY").addClass('active');
        $("#FollowupFailN").removeClass('active');
        $("#FollowupFailYes").show();

    }
    else if (ID == 'No' || ID == 'N') {
        $('#FollowupFail').val('No');
        $("#FollowupFailN").addClass('active');
        $("#FollowupFailY").removeClass('active');
        $("#FollowupFailYes").hide();
    }
}


function AreYouOnTreatement(ID) {

    if (ID == 'Yes' || ID == 'Y') {
        $('#AreYouOnTreatement').val('Yes');
        $("#AreYouOnTreatementY").addClass('active');
        $("#AreYouOnTreatementN").removeClass('active');
        $("#AreYouOnTreatementYes").show();

    }
    else if (ID == 'No' || ID == 'N') {
        $('#AreYouOnTreatement').val('No');
        $("#AreYouOnTreatementN").addClass('active');
        $("#AreYouOnTreatementY").removeClass('active');
        $("#AreYouOnTreatementYes").hide();
    }
}

function AreYouUndergoneAnyInvestigation(ID) {

    if (ID == 'Yes' || ID == 'Y') {
        $('#AreYouUndergoneAnyInvestigation').val('Yes');
        $("#AreYouUndergoneAnyInvestigationY").addClass('active');
        $("#AreYouUndergoneAnyInvestigationN").removeClass('active');
        $("#AreYouUndergoneAnyInvestigationYes").show();

    }
    else if (ID == 'No' || ID == 'N') {
        $('#AreYouUndergoneAnyInvestigation').val('No');
        $("#AreYouUndergoneAnyInvestigationN").addClass('active');
        $("#AreYouUndergoneAnyInvestigationY").removeClass('active');
        $("#AreYouUndergoneAnyInvestigationYes").hide();
    }
}
function IsYourBPNormal(ID) {

    if (ID == 'Yes' || ID == 'Y') {
        $('#IsYourBPNormal').val('Yes');
        $("#IsYourBPNormalY").addClass('active');
        $("#IsYourBPNormalN").removeClass('active');
        $("#IsYourBPNormalYes").show();

    }
    else if (ID == 'No' || ID == 'N') {
        $('#IsYourBPNormal').val('No');
        $("#IsYourBPNormalN").addClass('active');
        $("#IsYourBPNormalY").removeClass('active');
        $("#IsYourBPNormalYes").hide();
    }
}


function IsAnyAbnormalities(ID) {

    if (ID == 'Yes' || ID == 'Y') {
        $('#IsAnyAbnormalities').val('Yes');
        $("#IsAnyAbnormalitiesY").addClass('active');
        $("#IsAnyAbnormalitiesN").removeClass('active');
        $("#IsAnyAbnormalitiesYes").show();

    }
    else if (ID == 'No' || ID == 'N') {
        $('#IsAnyAbnormalities').val('No');
        $("#IsAnyAbnormalitiesN").addClass('active');
        $("#IsAnyAbnormalitiesY").removeClass('active');
        $("#IsAnyAbnormalitiesYes").hide();
    }
}

function IsNormalOrRaise(ID) {

    if (ID == 'Yes' || ID == 'Y') {
        $('#NormalOrRaise').val('Yes');
        $("#IsNormalOrRaiseY").addClass('active');
        $("#IsNormalOrRaiseN").removeClass('active');
        //$("#IsAnyAbnormalitiesYes").show();

    }
    else if (ID == 'No' || ID == 'N') {
        $('#NormalOrRaise').val('No');
        $("#IsNormalOrRaiseN").addClass('active');
        $("#IsNormalOrRaiseY").removeClass('active');
        //$("#IsAnyAbnormalitiesYes").hide();
    }
}

function HaveYouLostSignificant(ID) {

    if (ID == 'Yes' || ID == 'Y') {
        $('#HaveYouLostSignificant').val('Yes');
        $("#HaveYouLostSignificantY").addClass('active');
        $("#HaveYouLostSignificantN").removeClass('active');
        $("#HaveYouLostSignificantYes").show();

    }
    else if (ID == 'No' || ID == 'N') {
        $('#HaveYouLostSignificant').val('No');
        $("#HaveYouLostSignificantN").addClass('active');
        $("#HaveYouLostSignificantY").removeClass('active');
        $("#HaveYouLostSignificantYes").hide();
    }
}


function DoYouStillReceivedTreatement(ID) {

    if (ID == 'Yes' || ID == 'Y') {
        $('#DoYouStillReceivedTreatement').val('Yes');
        $("#DoYouStillReceivedTreatementY").addClass('active');
        $("#DoYouStillReceivedTreatementN").removeClass('active');
        $("#DoYouStillReceivedTreatementNo").hide();

    }
    else if (ID == 'No' || ID == 'N') {
        $('#DoYouStillReceivedTreatement').val('No');
        $("#DoYouStillReceivedTreatementN").addClass('active');
        $("#DoYouStillReceivedTreatementY").removeClass('active');
        $("#DoYouStillReceivedTreatementNo").show();
    }
}


function Areyouengagedanyhazardous(ID) {

    if (ID == 'Yes' || ID == 'Y') {
        $('#Areyouengagedanyhazardous').val('Yes');
        $("#AreyouengagedanyhazardousY").addClass('active');
        $("#AreyouengagedanyhazardousN").removeClass('active');
        $("#AreyouengagedanyhazardousYes").show();

    }
    else if (ID == 'No' || ID == 'N') {
        $('#Areyouengagedanyhazardous').val('No');
        $("#AreyouengagedanyhazardousN").addClass('active');
        $("#AreyouengagedanyhazardousY").removeClass('active');
        $("#AreyouengagedanyhazardousYes").hide();
    }
}


function Areyoucurrentlyservingtroubledarea(ID) {

    if (ID == 'Yes' || ID == 'Y') {
        $('#Areyoucurrentlyservingtroubledarea').val('Yes');
        $("#AreyoucurrentlyservingtroubledareaY").addClass('active');
        $("#AreyoucurrentlyservingtroubledareaN").removeClass('active');
        $("#AreyoucurrentlyservingtroubledareaYes").show();

    }
    else if (ID == 'No' || ID == 'N') {
        $('#Areyoucurrentlyservingtroubledarea').val('No');
        $("#AreyoucurrentlyservingtroubledareaN").addClass('active');
        $("#AreyoucurrentlyservingtroubledareaY").removeClass('active');
        $("#AreyoucurrentlyservingtroubledareaYes").hide();
    }
}
function DoYouHandeledWeapons(ID) {

    if (ID == 'Yes' || ID == 'Y') {
        $('#DoYouHandeledWeapons').val('Yes');
        $("#DoYouHandeledWeaponsY").addClass('active');
        $("#DoYouHandeledWeaponsN").removeClass('active');
        $("#DoYouHandeledWeaponsYes").show();

    }
    else if (ID == 'No' || ID == 'No') {
        $('#DoYouHandeledWeapons').val('N');
        $("#DoYouHandeledWeaponsN").addClass('active');
        $("#DoYouHandeledWeaponsY").removeClass('active');
        $("#DoYouHandeledWeaponsYes").hide();
    }
}


function DoYouDriveAsapartofjob(ID) {

    if (ID == 'Yes' || ID == 'Y') {
        $('#DoYouDriveAsapartofjob').val('Yes');
        $("#DoYouDriveAsapartofjobY").addClass('active');
        $("#DoYouDriveAsapartofjobN").removeClass('active');
        $("#DoYouDriveAsapartofjobYes").show();

    }
    else if (ID == 'No' || ID == 'N') {
        $('#DoYouDriveAsapartofjob').val('No');
        $("#DoYouDriveAsapartofjobN").addClass('active');
        $("#DoYouDriveAsapartofjobY").removeClass('active');
        $("#DoYouDriveAsapartofjobYes").hide();
    }
}


function DoYouOccupationHazardous(ID) {

    if (ID == 'Yes' || ID == 'Y') {
        $('#DoYouOccupationHazardous').val('Yes');
        $("#DoYouOccupationHazardousY").addClass('active');
        $("#DoYouOccupationHazardousN").removeClass('active');
        $("#DoYouOccupationHazardousYes").show();

    }
    else if (ID == 'No' || ID == 'N') {
        $('#DoYouOccupationHazardous').val('No');
        $("#DoYouOccupationHazardousN").addClass('active');
        $("#DoYouOccupationHazardousY").removeClass('active');
        $("#DoYouOccupationHazardousYes").hide();
    }
}
function HighCholestrol(ID) {

    if (ID == 'Yes' || ID == 'Y') {
        $('#HighCholestrol').val('Yes');
        $("#HighCholestrolY").addClass('active');
        $("#HighCholestrolN").removeClass('active');
        $("#HighCholestrolYes").show();
    }
    else if (ID == 'No' || ID == 'N') {
        $('#HighCholestrol').val('No');
        $("#HighCholestrolN").addClass('active');
        $("#HighCholestrolY").removeClass('active');
        $("#HighCholestrolYes").hide();
    }
}

function DoYouUseInsulinInjection(ID) {

    if (ID == 'Yes' || ID == 'Y') {
        $('#DoYouUseInsulinInjection').val('Yes');
        $("#DoYouUseInsulinInjectionY").addClass('active');
        $("#DoYouUseInsulinInjectionN").removeClass('active');
        $("#DoYouUseInsulinInjectionYes").show();
    }
    else if (ID == 'No' || ID == 'N') {
        $('#DoYouUseInsulinInjection').val('No');
        $("#DoYouUseInsulinInjectionN").addClass('active');
        $("#DoYouUseInsulinInjectionY").removeClass('active');
        $("#DoYouUseInsulinInjectionYes").hide();
    }
}


function DoYouTakeOralMedication(ID) {

    if (ID == 'Yes' || ID == 'Y') {
        $('#DoYouTakeOralMedication').val('Yes');
        $("#DoYouTakeOralMedicationY").addClass('active');
        $("#DoYouTakeOralMedicationN").removeClass('active');
        $("#DoYouTakeOralMedicationYes").show();

    }
    else if (ID == 'No' || ID == 'N') {
        $('#DoYouTakeOralMedication').val('No');
        $("#DoYouTakeOralMedicationN").addClass('active');
        $("#DoYouTakeOralMedicationY").removeClass('active');
        $("#DoYouTakeOralMedicationYes").hide();
    }
}


function DoYouUndergoTest(ID) {

    if (ID == 'Yes' || ID == 'Y') {
        $('#DoYouUndergoTest').val('Yes');
        $("#DoYouUndergoTestY").addClass('active');
        $("#DoYouUndergoTestN").removeClass('active');
        $("#DoYouUndergoTestYes").show();

    }
    else if (ID == 'No' || ID == 'N') {
        $('#DoYouUndergoTest').val('No');
        $("#DoYouUndergoTestN").addClass('active');
        $("#DoYouUndergoTestY").removeClass('active');
        $("#DoYouUndergoTestYes").hide();
    }
}


function EyeProblemRelatedToDiabetes(ID) {

    if (ID == 'Yes' || ID == 'Y') {
        $('#EyeProblemRelatedToDiabetes').val('Yes');
        $("#EyeProblemRelatedToDiabetesY").addClass('active');
        $("#EyeProblemRelatedToDiabetesN").removeClass('active');
        $("#EyeProblemRelatedToDiabetesYes").show();

    }
    else if (ID == 'No' || ID == 'N') {
        $('#EyeProblemRelatedToDiabetes').val('No');
        $("#EyeProblemRelatedToDiabetesN").addClass('active');
        $("#EyeProblemRelatedToDiabetesY").removeClass('active');
        $("#EyeProblemRelatedToDiabetesYes").hide();
    }
}


function KidneyOrUrineDisease(ID) {

    if (ID == 'Yes' || ID == 'Y') {
        $('#KidneyOrUrineDisease').val('Yes');
        $("#KidneyOrUrineDiseaseY").addClass('active');
        $("#KidneyOrUrineDiseaseN").removeClass('active');
        $("#KidneyOrUrineDiseaseYes").show();

    }
    else if (ID == 'No' || ID == 'N') {
        $('#KidneyOrUrineDisease').val('No');
        $("#KidneyOrUrineDiseaseN").addClass('active');
        $("#KidneyOrUrineDiseaseY").removeClass('active');
        $("#KidneyOrUrineDiseaseYes").hide();
    }
}


function NerveDisorder(ID) {

    if (ID == 'Yes' || ID == 'Y') {
        $('#NerveDisorder').val('Yes');
        $("#NerveDisorderY").addClass('active');
        $("#NerveDisorderN").removeClass('active');
        $("#NerveDisorderYes").show();
    }
    else if (ID == 'No' || ID == 'N') {
        $('#NerveDisorder').val('No');
        $("#NerveDisorderN").addClass('active');
        $("#NerveDisorderY").removeClass('active');
        $("#NerveDisorderYes").hide();
    }
}


function NonHealingUlcers(ID) {

    if (ID == 'Yes' || ID == 'Y') {
        $('#NonHealingUlcers').val('Yes');
        $("#NonHealingUlcersY").addClass('active');
        $("#NonHealingUlcersN").removeClass('active');
        $("#NonHealingUlcersYes").show();
    }
    else if (ID == 'No' || ID == 'N') {
        $('#NonHealingUlcers').val('No');
        $("#NonHealingUlcersN").addClass('active');
        $("#NonHealingUlcersY").removeClass('active');
        $("#NonHealingUlcersYes").hide();
    }
}


function HighBloodPressure(ID) {

    if (ID == 'Yes' || ID == 'Y') {
        $('#HighBloodPressuretxt').val("Yes");
        $("#HighBloodPressureY").addClass('active');
        $("#HighBloodPressureN").removeClass('active');
        $("#HighBloodPressureYes").show();
    }
    else if (ID == 'No' || ID == 'N') {
        $('#HighBloodPressuretxt').val("No");
        $("#HighBloodPressureN").addClass('active');
        $("#HighBloodPressureY").removeClass('active');
        $("#HighBloodPressureYes").hide();
    }
}


function HeartCondition(ID) {

    if (ID == 'Yes' || ID == 'Y') {
        $('#HeartCondition').val('Yes');
        $("#HeartConditionY").addClass('active');
        $("#HeartConditionN").removeClass('active');
        $("#HeartConditionYes").show();
    }
    else if (ID == 'No' || ID == 'No') {
        $('#HeartCondition').val('N');
        $("#HeartConditionN").addClass('active');
        $("#HeartConditionY").removeClass('active');
        $("#HeartConditionYes").hide();
    }
}


function HospitalizedForDibetesCntrol(ID) {

    if (ID == 'Yes' || ID == 'Y') {
        $('#HospitalizedForDibetesCntrol').val('Yes');
        $("#HospitalizedForDibetesCntrolY").addClass('active');
        $("#HospitalizedForDibetesCntrolN").removeClass('active');
        $("#HospitalizedForDibetesCntrolYes").show();
    }
    else if (ID == 'No' || ID == 'N') {
        $('#HospitalizedForDibetesCntrol').val('No');
        $("#HospitalizedForDibetesCntrolN").addClass('active');
        $("#HospitalizedForDibetesCntrolY").removeClass('active');
        $("#HospitalizedForDibetesCntrolYes").hide();
    }
}

function HaveYouBeenHospitalized(ID) {

    if (ID == 'Yes' || ID == 'Y') {
        $('#HaveYouBeenHospitalized').val('Yes');
        $("#HaveYouBeenHospitalizedY").addClass('active');
        $("#HaveYouBeenHospitalizedN").removeClass('active');
        $("#HaveYouBeenHospitalizedYes").show();
    }
    else if (ID == 'No' || ID == 'N') {
        $('#HaveYouBeenHospitalized').val('No');
        $("#HaveYouBeenHospitalizedN").addClass('active');
        $("#HaveYouBeenHospitalizedY").removeClass('active');
        $("#HaveYouBeenHospitalizedYes").hide();
    }
}


function CKYC(ID) {

    if (ID == 'Yes' || ID == 'Y') {
        $('#CKYC').val('Y');
        $("#CKYCY").addClass('active');
        $("#CKYCN").removeClass('active');
        $("#CKYCNoYes").show();

    }
    else if (ID == 'No' || ID == 'N') {
        $('#CKYC').val('N');
        $("#CKYCN").addClass('active');
        $("#CKYCY").removeClass('active');
        $("#CKYCNoYes").hide();

    }
}



function ExistingPolicy(ID) {
    if (ID == 'Yes' || ID == 'Y') {
        $("#NoExistingPolicy").show();
        $('#ExistingPolicy').val('Y');
        $("#ExistingPolicyY").addClass('active');
        $("#ExistingPolicyN").removeClass('active');
        $("#ExistingPolicyDetails").show();
        if ($("#ExistingInsuranceCount").val() == 0 || $("#ExistingInsuranceCount").val=="") {
            $("#ExistingInsuranceCount").val(1);
        }
        $("#add_policy").removeAttr('disabled');
    }
    else if (ID == 'No' || ID == 'N') {
        $('#ExistingPolicy').val('N');
        $("#NoExistingPolicy").hide();
        $("#ExistingPolicyN").addClass('active');
        $("#ExistingPolicyY").removeClass('active');
        $("#ExistingPolicyDetails").hide();
        $("#ExistingPolicyDetails1").hide();
        $("#ExistingPolicyDetails2").hide();
        $("#ExistingPolicyDetails3").hide();
        $("#ExistingPolicyDetails4").hide();
        $("#ExistingInsuranceCount").val(0);
        $("#add_policy").removeAttr('disabled');
        $("#add_policy1").removeAttr('disabled');
        $("#add_policy2").removeAttr('disabled');
        $("#add_policy3").removeAttr('disabled');
    }
}

function MarriedWomensAct(ID) {
    if (ID == 'Yes') {
        $('#MarriedWomensAct').val('Yes');
        $("#MarriedWomensActY").addClass('active');
        $("#MarriedWomensActN").removeClass('active');
        //$("#Beneficiary1").show();
        //$("#BeneficiaryCount").val(1);
        //$("#MWP").show();
        //$("#dvMWP").show();
        //$("#Trustee1").show();
        //$("#TrusteeCount").val(1);

        //$("#Trustee").show();
        //$("#nominee").hide();
    }
    else {
        $('#MarriedWomensAct').val('No');
        $("#MarriedWomensActN").addClass('active');
        $("#MarriedWomensActY").removeClass('active');
        //$("#Beneficiary1").hide();
        //$("#MWP").hide();
        //$("#dvMWP").hide();
        //$("#BeneficiaryCount").val(0);
        //$("#Trustee1").hide();
        //$("#TrusteeCount").val(0);

        //$("#Benificiary").hide();
        //$("#Trustee").hide();
        //$("#nominee").show();

    }
}

function MarriedWomensAct2(ID) {
    if (ID == 'Yes') {
        $('#MarriedWomensAct2').val('Yes');
        $("#MarriedWomensAct2Y").addClass('active');
        $("#MarriedWomensAct2N").removeClass('active');
        
    }
    else {
        $('#MarriedWomensAct2').val('No');
        $("#MarriedWomensAct2N").addClass('active');
        $("#MarriedWomensAct2Y").removeClass('active');
       

    }
}
function MarriedWomensAct3(ID) {
    if (ID == 'Yes') {
        $('#MarriedWomensAct3').val('Yes');
        $("#MarriedWomensAct3Y").addClass('active');
        $("#MarriedWomensAct3N").removeClass('active');
       
    }
    else {
        $('#MarriedWomensAct3').val('No');
        $("#MarriedWomensAct3N").addClass('active');
        $("#MarriedWomensAct3Y").removeClass('active');
       

    }
}
//function politicalexposedperson(ID) {
//    if (ID == 'Yes') {
//        $('#politicalexposedperson').val('Yes');
//        $("#politicalexposedpersonY").addClass('active');
//        $("#politicalexposedpersonN").removeClass('active');
//    }
//    else {
//        $('#politicalexposedperson').val('No');
//        $("#politicalexposedpersonN").addClass('active');
//        $("#politicalexposedpersonY").removeClass('active');
//    }

//}

//Validation

function ValidateSuitablityMatrix() {
    
    var isValid = 0;
    if ($("#SuitabilityMatrixQuestion1").val() == "" || $("#SuitabilityMatrixQuestion1").val() == null) {
        isValid = 1;
        $("#error_SuitabilityMatrixQuestion1").html("Please Select Current Income");
    } else {
        
        $("#error_SuitabilityMatrixQuestion1").html("");
    }

    if ($("#SuitabilityMatrixQuestion2").val() == "" || $("#SuitabilityMatrixQuestion2").val() == null) {
        isValid = 1;
        $("#error_SuitabilityMatrixQuestion2").html("Please Select Current LifeStyle");
    } else {
       
        $("#error_SuitabilityMatrixQuestion2").html("");
    }

    if ($("#SuitabilityMatrixQuestion3").val() == "" || $("#SuitabilityMatrixQuestion3").val() == null) {
        isValid = 1;
        $("#error_SuitabilityMatrixQuestion3").html("Please Select Investment Objective");
    } else {
       
        $("#error_SuitabilityMatrixQuestion3").html("");
    }

    if ($("#SuitabilityMatrixQuestion4").val() == "" || $("#SuitabilityMatrixQuestion4").val() == null) {
        isValid = 1;
        $("#error_SuitabilityMatrixQuestion4").html("Please Select Riskappetite");
    } else {
        
        $("#error_SuitabilityMatrixQuestion4").html("");
    }

    if ($("#SuitabilityMatrixQuestion5").val() == "" || $("#SuitabilityMatrixQuestion5").val() == null) {
        isValid = 1;
        $("#error_SuitabilityMatrixQuestion5").html("Please Select Investment Horizon");
    } else {
        
        $("#error_SuitabilityMatrixQuestion5").html("");
    }

    if ($("#SuitabilityMatrixQuestion6").val() == "" || $("#SuitabilityMatrixQuestion6").val() == null) {
        isValid = 1;
        $("#error_SuitabilityMatrixQuestion6").html("Please Select Insurance Portfolio");
    } else {
       
        $("#error_SuitabilityMatrixQuestion6").html("");
    }
   
    if (isValid == 0) {
        return true;
    } else {
        return false;
    }
}

function ValidateSection(id) {

    switch (id) {

        case 'hrefViewInput':
            return true;
            break;
        case 'hrefProposalInfo':
            return ValidateControls('0');
            break;
        case 'hrefPersonalInfo':
            return ValidateControls('1');
            break;
        case 'hrefEducationalInfo':
            return ValidateControls('2');
            break;
        case 'hrefDocumentInfo':
            return ValidateControls('3');
            break;
        case 'hrefEIAInfo':
            return ValidateControls('4');
            break;

        case 'hrefExistingPolicy':
            return ValidateControls('15');
            break;
        //case 'hrefPersonalInfoFifth':
        //    return ValidateControls('5');
        //    break;
        //case 'hrefPersonalInfoSixth':
        //    return ValidateControls('6');
        //    break;

        case 'hrefContactInfo':
            return ValidateControls('7');
            break;
        case 'hrefHealthHistoryTravelDetails':
            return ValidateControls('8');
            break;
        case 'hrefnominee':
            return ValidateControls('9');
            break;

        case 'hrefMedicalQuestionnaire':
            return ValidateControls('10');
            break;

        case 'hrefonline':
            return ValidateControls('11');
            break;

        case 'hrefCKYC':
            return ValidateControls('12');
            break;

        case 'submitSendPaymentlink':
            return ValidateControls('13');
            break;

        case 'hrefLifeStyleQuestionnaire':
            return ValidateControls('14');
            break;



        case 'hrefHypertensionReflexive':
            return ValidateControls('16');
            break;

        case 'hrefDiabetesReflexive':
            return ValidateControls('17');
            break;

        case 'hrefDefenceReflexive':
            return ValidateControls('18');
            break;

        case 'hrefOccupationReflexive':
            return ValidateControls('19');
            break;

        case 'hrefBankDetails':
            return ValidateControls('20');
            break;

        case 'hrefFamilyDetails':
            return ValidateControls('21');
            break;

        case 'hrefFatcaReflexive':
            return ValidateControls('22');
            break;

        case 'hrefCovidDetails':
            return ValidateControls('23');
            break;


        case 'hrefSuitabilityMatrix':
            return ValidateControls('24');
            break;
        //case 'hrefMWP':
        //    return ValidateControls('23');
        //    break;

        default:
            return true;
            break;
    }
}
function ValidateControls(Opt) {

    var is_valid = 0;
    var $DisabledPerson = $("#DisabledPerson");
    var $Criminal = $("#Criminal");
    var $politicalexposedperson = $("#politicalexposedperson");
    var $ContactTitle = $("#ContactTitle");
    // var $ContactName = $("#ContactFirstName");
    var $ContactFirstName = $("#ContactFirstName")
    var $ContactLastName = $("#ContactLastName");
    var $ContactMiddleName = $("#ContactMiddleName");
    var $ContactGender = $("#ContactGender");
    var $ContactMobile = $("#ContactMobile");
    var $ContactEmail = $("#ContactEmail");
    var $ContactDOB = $("#ContactDOB");
    var $EmployeeJoining = $("#EmployeeJoining");
    var $InsuredTitle = $("#InsuredTitle");
    var $InsuredFirstName = $("#InsuredFirstName");
    var $InsuredLastName = $("#InsuredLastName");
    var $InsuredMiddleName = $("#InsuredMiddleName");
    var $InsuredFatherName = $("#InsuredFatherName");
    var $InsuredFatherFirstName = $("#InsuredFatherFirstName");
    var $InsuredFatherLastName = $("#InsuredFatherLastName");
    var $InsuredHusbandFirstName = $("#InsuredHusbandFirstName");
    var $InsuredHusbandLastName = $("#InsuredHusbandLastName");
    var $InsuredMotherFirstName = $("#InsuredMotherFirstName");
    var $InsuredMotherLastName = $("#InsuredMotherLastName");
    var $InsuredPANNo = $("#InsuredPANNo");
    var $InsuredLandline = $("#InsuredLandline");
    var $InsuredStdCode = $("#InsuredStdCode");
    var $InsuredAadharNo = $("#InsuredAadharNo");
    var $AnnualIncome = $("#AnnualIncome");
    var $Other = $("#Other");
    var $InsuredGender = $("#InsuredGender");
    var $InsuredIDProof = $("#InsuredIDProof");

    var $InsuredIDProofNumber = $("#InsuredIDProofNumber");
    var $InsuredIDProofIssueDate = $("#InsuredIDProofIssueDate");
    var $InsuredIDProofExpiryDate = $("#InsuredIDProofExpiryDate");

    var $InsuredAgeProof = $("#InsuredAgeProof");
    var $InsuredAddressProof = $("#InsuredAddressProof");
    var $InsuredIncomeProof = $("#InsuredIncomeProof");
    var $OccupationalDetails = $("#OccupationalDetails");
    var $EIA = $("#EIA");
    var $EIANo = $("#EIANo");
    var $CKYC = $("#CKYC");
    var $CKYCNo = $("#CKYCNo");
    var $InsuredMaritalStatus = $("#InsuredMaritalStatus");
    var $ProposerMaritalStatus = $("#ProposerMaritalStatus");
    var $ProposerEducationQualification = $("#ProposerEducationQualification");
    var $InsuredEducationQualification = $("#InsuredEducationQualification");
    var $TaxResidentofIndia = $("#TaxResidentofIndia");
    var $ProposerIDProof = $("#ProposerIDProof");
    var $ProposerAgeProof = $("#ProposerAgeProof");
    var $ProposerAddressProof = $("#ProposerAddressProof");
    var $ProposerIncomeProof = $("#ProposerIncomeProof");
    var $ProposerAadharNo = $("#ProposerAadharNo");
    var $ProposerPANNo = $("#ProposerPANNo");

    var $InsuredNationality = $("#InsuredNationality");
    var $InsuredResidentStatus = $("#InsuredResidentStatus");
    var $ProposerResidentStatus = $("#ProposerResidentStatus");
    var $InsuredBirthPlace = $("#InsuredBirthPlace");
    var $NRI = $("#InsuredNRI");
    var $InsuredMobile = $("#InsuredMobile");
    var $InsuredNRIMobile = $("#InsuredNRIMobile");
    var $InsuredEmail = $("#InsuredEmail");
    var $InsuredDOB = $("#InsuredDOB");
    var $PassportNumber = $("#InsuredPassport");
    var $ContactSTREETBUILDING = $("#ContactSTREETBUILDING");
    var $ContactHOUSEFLATNUMBER = $("#ContactHOUSEFLATNUMBER");
    var $ContactLandmark = $("#ContactLandmark");
    var $ContactCityName = $("#ContactCityName");
    var $TATAAIAContactCityID = $("#TATAAIAContactCityID");
    
    var $ContactState = $("#ContactState");
    var $ContactPinCode = $("#ContactPinCode");
    var $PostOfficeId = $("#PostOfficeId");
    var $Country = $("#Country");
    var $CountryOfResidence = $("#CountryOfResidence");

    //var $OccupationalDetails = $('#OccupationalDetails');
    var $DistrictName = $("#DistrictName");
    var $StateName = $("#StateName");

    var $PermanentContactHOUSEFLATNUMBER = $("#PermanentContactHOUSEFLATNUMBER");
    var $PermanentContactSTREETBUILDING = $("#PermanentContactSTREETBUILDING");
    var $PermanentLandmark = $("#PermanentLandmark");
    var $PermanentCityName = $("#PermanentCityName");
    var $TATAAIAPermanentCityID = $("#TATAAIAPermanentCityID");
    
    var $PermanentStateName = $("#PermanentStateName");
    var $PermanentCountry = $("#PermanentCountry");
    var $PermanentPinCode = $("#PermanentPinCode");
    var $PermanentPostOfficeId = $("#PermanentPostOfficeId");
    var $NomineeTitle = $("#NomineeTitle");
    var $NomineeFirstName = $("#NomineeFirstName");
    var $NomineeMiddleName = $("#NomineeMiddleName");
    var $NomineeLastName = $("#NomineeLastName");
    var $NomineeGender = $("#NomineeGender");
    var $NomineeMaritalStatus = $("#NomineeMaritalStatus");
    var $NomineeDOB = $("#NomineeDOB");
    var $NomineeRelation = $("#NomineeRelationship");
    var $MarriedWomensAct = $("#MarriedWomensAct");
    var $NomineeHOUSEFLATNUMBER = $("#NomineeHOUSEFLATNUMBER");
    var $NomineeSTREETBUILDING = $("#NomineeSTREETBUILDING");
    var $NomineeLandmark = $("#NomineeLandmark");
    var $NomineePinCode = $("#NomineePinCode");
    var $NomineeState = $("#NomineeState");
    var $NomineeCityName = $("#NomineeCityName");
    var $NomineePostOfficeId = $("#NomineePostOfficeId");
    //var $NomineeMobile = $("#NomineeMobile");
    //var $NomineeEmail = $("#NomineeEmail");
    var $ProposerRelationship = $("#ProposerRelationship");
    //Appointee fields
    var $AppointeeTitle = $("#AppointeeTitle");
    var $AppointeeFirstName = $("#AppointeeFirstName");
    var $AppointeeLastName = $("#AppointeeLastName");
    var $AppointeeGender = $("#AppointeeGender");
    var $AppointeeMaritalStatus = $("#AppointeeMaritalStatus");
    var $AppointeeDOB = $("#AppointeeDOB");
    var $AppointeeRelation = $("#AppointeeRelationship");
    var $AppointeeHOUSEFLATNUMBER = $("#AppointeeHOUSEFLATNUMBER");
    var $AppointeeSTREETBUILDING = $("#AppointeeSTREETBUILDING");
    var $AppointeeLandmark = $("#AppointeeLandmark");
    var $AppointeePinCode = $("#AppointeePinCode");
    var $AppointeeState = $("#AppointeeState");
    var $AppointeeCityName = $("#AppointeeCityName");
    var $AppointeePostOfficeId = $("#AppointeePostOfficeId");

    //Appointee fields
    var $Appointee2Title = $("#Appointee2Title");
    var $Appointee2FirstName = $("#Appointee2FirstName");
    var $Appointee2LastName = $("#Appointee2LastName");
    var $Appointee2Gender = $("#Appointee2Gender");
    var $Appointee2MaritalStatus = $("#Appointee2MaritalStatus");
    var $Appointee2DOB = $("#Appointee2DOB");
    var $Appointee2Relation = $("#Appointee2Relationship");
    var $Appointee2HOUSEFLATNUMBER = $("#Appointee2HOUSEFLATNUMBER");
    var $Appointee2STREETBUILDING = $("#Appointee2STREETBUILDING");
    var $Appointee2Landmark = $("#Appointee2Landmark");
    var $Appointee2PinCode = $("#Appointee2PinCode");
    var $Appointee2State = $("#Appointee2State");
    var $Appointee2CityName = $("#Appointee2CityName");
    var $Appointee2PostOfficeId = $("#Appointee2PostOfficeId");

    //Appointee fields
    var $Appointee3Title = $("#Appointee3Title");
    var $Appointee3FirstName = $("#Appointee3FirstName");
    var $Appointee3LastName = $("#Appointee3LastName");
    var $Appointee3Gender = $("#Appointee3Gender");
    var $Appointee3MaritalStatus = $("#Appointee3MaritalStatus");
    var $Appointee3DOB = $("#Appointee3DOB");
    var $Appointee3Relation = $("#Appointee3Relationship");
    var $Appointee3HOUSEFLATNUMBER = $("#Appointee3HOUSEFLATNUMBER");
    var $Appointee3STREETBUILDING = $("#Appointee3STREETBUILDING");
    var $Appointee3Landmark = $("#Appointee3Landmark");
    var $Appointee3PinCode = $("#Appointee3PinCode");
    var $Appointee3State = $("#Appointee3State");
    var $Appointee3CityName = $("#Appointee3CityName");
    var $Appointee3PostOfficeId = $("#Appointee3PostOfficeId");

    //Nominee2 fields
    var $isnominee2added = $("#isnominee2added");
    var $Nominee2Title = $("#Nominee2Title");
    var $Nominee2FirstName = $("#Nominee2FirstName");
    var $Nominee2LastName = $("#Nominee2LastName");
    var $Nominee2Gender = $("#Nominee2Gender");
    var $Nominee2MaritalStatus = $("#Nominee2MaritalStatus");
    var $Nominee2DOB = $("#Nominee2DOB");
    var $Nominee2Relation = $("#Nominee2Relationship");
    var $Nominee2HOUSEFLATNUMBER = $("#Nominee2HOUSEFLATNUMBER");
    var $Nominee2STREETBUILDING = $("#Nominee2STREETBUILDING");
    var $Nominee2Landmark = $("#Nominee2Landmark");
    var $Nominee2PinCode = $("#Nominee2PinCode");
    var $Nominee2State = $("#Nominee2State");
    var $Nominee2CityName = $("#Nominee2CityName");
    var $Nominee2PostOfficeId = $("#Nominee2PostOfficeId");
    var $Nominee2Mobile = $("#Nominee2Mobile");
    var $Nominee2Email = $("#Nominee2Email");

    //Nominee2 Fields
    var $isnominee3added = $("#isnominee3added");
    var $Nominee3Title = $("#Nominee3Title");
    var $Nominee3FirstName = $("#Nominee3FirstName");
    var $Nominee3LastName = $("#Nominee3LastName");
    var $Nominee3Gender = $("#Nominee3Gender");
    var $Nominee3MaritalStatus = $("#Nominee3MaritalStatus");
    var $Nominee3DOB = $("#Nominee3DOB");
    var $Nominee3Relation = $("#Nominee3Relationship");
    var $Nominee3HOUSEFLATNUMBER = $("#Nominee3HOUSEFLATNUMBER");
    var $Nominee3STREETBUILDING = $("#Nominee3STREETBUILDING");
    var $Nominee3Landmark = $("#Nominee3Landmark");
    var $Nominee3PinCode = $("#Nominee3PinCode");
    var $Nominee3State = $("#Nominee3State");
    var $Nominee3CityName = $("#Nominee3CityName");
    var $Nominee3PostOfficeId = $("#Nominee3PostOfficeId");
    var $Nominee3Mobile = $("#Nominee3Mobile");
    var $Nominee3Email = $("#Nominee3Email");

    var $ProposerRelation = $("#ProposerRelationship");
    var $ProposerRelationId = $("#ProposerRelationId");
    // var $TermsAndConditions = $("input[name=TermCondition]:checked");
    var $TermsAndConditions = $("#TermsAndConditions");
    var $IsMediQuestionSelf = $("input[name=IsMediQuestionSelf]:checked");
    var $NomineeRelationId = $("#NomineeRelationID");
    var $NomineeRelation = $("#NomineeRelationship");
    var $Member1OccupationID = $("#Member1OccupationID");
    var $MemberNomineeName1 = $("#MemberNomineeName1");
    var $Member1MobileNumber = $("#Member1MobileNumber");
    var $RelianceSalutation = $("#RelianceSalutation");
    var $gstIdNumber = $("#GSTIN");
    var $OccupationalDetailsOthers = $("#OccupationalDetailsOthers");
    var $OccupationalDetailsemployeeof = $("#OccupationalDetailsemployeeof");
    var $OccupationalDetailsBusiness = $("#OccupationalDetailsBusiness");
    var $SelfEmployeeDesignation = $("#SelfEmployeeDesignation");
    var $EducationLoan = $("#EducationLoan");
    var $EmployeeID = $("#EmployeeID");
    var $DateOfJoining = $("#EmployeeJoining");
    var $EmployeeLocation = $("#EmployeeLocation");
    var $EmployeeDesignation = $("#EmployeeDesignation");
    var $NameOfPresentEmployer = $("#NameOfPresentEmployer");
    var $AddressOfPresentEmployer = $("#AddressOfPresentEmployer");

    var $CKYCOccupationType = $("#CKYCOccupationType");
    var $CKYCOccupationalDetails = $("#CKYCOccupationalDetails");
    var $CKYCFatherTitle = $("#CKYCFatherTitle");
    var $CKYCFatherFirstName = $("#CKYCFatherFirstName");
    var $CKYCFatherMiddleName = $("#CKYCFatherMiddleName");
    var $CKYCFatherLastName = $("#CKYCFatherLastName");
    var $CKYCMotherTitle = $("#CKYCMotherTitle");
    var $CKYCMotherFirstName = $("#CKYCMotherFirstName");
    var $CKYCMotherMiddleName = $("#CKYCMotherMiddleName");
    var $CKYCMotherLastName = $("#CKYCMotherLastName");
    var $CKYCMaritalStatus = $("#CKYCMaritalStatus");
    var $CKYCSpouseTitle = $("#CKYCSpouseTitle");
    var $CKYCSpouseFirstName = $("#CKYCSpouseFirstName");
    var $CKYCSpouseMiddleName = $("#CKYCSpouseMiddleName");
    var $CKYCSpouseLastName = $("#CKYCSpouseLastName");
    var $CKYCOccupationType = $("#CKYCOccupationType");
    var $CKYCCountryOfBirth = $("#CKYCCountryOfBirth");
    var $YearlyIncome = $("#YearlyIncome");
    var $YearlyIncomeOhters = $("#YearlyIncomeOhters");
    var $Height = $("#Height");
    var $Weight = $("#Weight");
    var $PMH = $("#PMH");
    var $HDFCBankEmployeeID = $("#HDFCBankEmployeeID");
    var $HDFCBankEmployeeJoining = $("#HDFCBankEmployeeJoining");
    var $HDFCBankEmployeeLocation = $("#HDFCBankEmployeeLocation");
    var $HDFCBankEmployeeDesignation = $("#HDFCBankEmployeeDesignation");
    var $HDFCBankEmployeePanNo = $("#HDFCBankEmployeePanNo");
    var $PanNo = $("#PanNo");
    var $CommPreference = $("#CommPreference");
    var $QuestionId1 = $("#QuestionId1");
    var $InsurerGST = $("#Gstno");

    //Reflexive Questionnaire Fields
    $BloodPressureFirstRoundDate = $("#BloodPressureFirstRoundDate");
    $BPLevel = $("#BPLevel");
    $NameOfHyperTensionDoctor = $("#NameOfHyperTensionDoctor");
    $NameAndAddressOfClinicDoctor = $("#NameAndAddressOfClinicDoctor");
    $follow_upWithDoctor = $("#follow_upWithDoctor");
    $ConsiderSecondary = $("#ConsiderSecondary");
    $complications = $("#complications");
    $AreYouOnTreatementNow = $("#AreYouOnTreatementNow");
    $FollowupFail = $("#FollowupFail");
    $AreYouOnTreatement = $("#AreYouOnTreatement");
    $AreYouUndergoneAnyInvestigation = $("#AreYouUndergoneAnyInvestigation");
    $BPReadingDate = $("#BPReadingDate");
    $BPReading = $("#BPReading");
    $Past12MonthBPReadingDate = $("#Past12MonthBPReadingDate");
    $Past12MonthBPReading = $("#Past12MonthBPReading");
    $IsYourBPNormal = $("#IsYourBPNormal");
    $IsAnyAbnormalities = $("#IsAnyAbnormalities");
    $HaveYouLostSignificant = $("#HaveYouLostSignificant");
    $DateOfFirstDignosis = $("#DateOfFirstDignosis");
    $NameOfDiabetesDoctor = $("#NameOfDiabetesDoctor");
    $DateOfLastAttendedDoctor = $("#DateOfLastAttendedDoctor");
    $DoYouStillReceivedTreatement = $("#DoYouStillReceivedTreatement");
    $DoYouUseInsulinInjection = $("#DoYouUseInsulinInjection");
    $InjectionPerDay = $("#InjectionPerDay");
    $UnitsPerDay = $("#UnitsPerDay");
    $DoYouTakeOralMedication = $("#DoYouTakeOralMedication");
    $DoYouUndergoTest = $("#DoYouUndergoTest");
    $EyeProblemRelatedToDiabetes = $("#EyeProblemRelatedToDiabetes");
    $KidneyOrUrineDisease = $("#KidneyOrUrineDisease");
    $NerveDisorder = $("#NerveDisorder");
    $NonHealingUlcers = $("#NonHealingUlcers");
    $HighBloodPressure = $("#HighBloodPressuretxt");
    $HeartCondition = $("#HeartCondition");
    $HaveYouBeenHospitalized = $("#HaveYouBeenHospitalized");
    $HospitalizedForDibetesCntrol = $("#HospitalizedForDibetesCntrol");
    $HighCholestrol = $("#HighCholestrol");
    $ConsiderSecondarydtl = $("#ConsiderSecondarydtl");
    $complicationsdtl = $("#complicationsdtl");
    $AreYouOnTreatementNowDtl = $("#AreYouOnTreatementNowDtl");
    $FollowupFaildtl = $("#FollowupFaildtl");
    $AreYouOnTreatementdtl = $("#AreYouOnTreatementdtl");
    $TypesOfInvestigation = $("#TypesOfInvestigation");
    $ResultOfInvestigation = $("#ResultOfInvestigation");
    $IsAnyAbnormalitiesdtl = $("#IsAnyAbnormalitiesdtl");
    $HaveYouLostSignificantdtl = $("#HaveYouLostSignificantdtl");
    $DoYouStillReceivedTreatementdtl = $("#DoYouStillReceivedTreatementdtl");
    $NameOfTabletordose = $("#NameOfTabletordose");
    $DoYouUndergoTestdtl = $("#DoYouUndergoTestdtl");
    $HaveYouBeenHospitalizeddtl = $("#HaveYouBeenHospitalizeddtl");
    $HospitalizedForDibetesCntroldtl = $("#HospitalizedForDibetesCntroldtl");
    $BranchOfArmedServices = $("#BranchOfArmedServices");
    $BranchOfArmedServicesOtherstxt = $("#BranchOfArmedServicesOtherstxt");
    $RankAndDesignation = $("#RankAndDesignation");
    $PostingLocation = $("#PostingLocation");
    $Administrative = $("#Administrative");
    $Combat = $("#Combat");
    $NonCombat = $("#NonCombat");
    $NatureOfJob = $("#NatureOfJob");
    $Areyouengagedanyhazardous = $("#Areyouengagedanyhazardous");
    $Areyouengagedanyhazardousdtl = $("#Areyouengagedanyhazardousdtl");
    $Areyoucurrentlyservingtroubledarea = $("#Areyoucurrentlyservingtroubledarea");
    $Areyoucurrentlyservingtroubledareadtl = $("#Areyoucurrentlyservingtroubledareadtl");
    $DoYouHandeledWeapons = $("#DoYouHandeledWeapons");
    $DoYouHandeledWeaponsdtl = $("#DoYouHandeledWeaponsdtl");
    $ExactOccupation = $("#ExactOccupation");
    $dailyexactnatureofduties = $("#dailyexactnatureofduties");
    $EngagedInOccupation = $("#EngagedInOccupation");
    $Administration = $("#Administration");
    $Supervisor = $("#Supervisor");
    $ManualLabor = $("#ManualLabor");
    $Travel = $("#Travel");
    $JobNature = $("#JobNature");
    $AccidentWithYourDuties = $("#AccidentWithYourDuties");
    $Howmanykmperday = $("#Howmanykmperday");
    $DoYouDriveAsapartofjob = $("#DoYouDriveAsapartofjob");
    $DoYouOccupationHazardous = $("#DoYouOccupationHazardous");
    $DoYouOccupationHazardousdtl = $("#DoYouOccupationHazardousdtl");
    $NormalOrRaise = $("#NormalOrRaise");
    $AccountHolderName = $("#AccountHolderName");
    $BankBranchName = $("#BankBranchName");
    // $IsAnyAbnormalities = $("#IsAnyAbnormalities");
    //$IsAnyAbnormalitiesdt1 = $("#IsAnyAbnormalitiesdtl");
    $TaxResidencyCountry1 = $("#TaxResidencyCountry1");
    $TaxResidencyCountry2 = $("#TaxResidencyCountry2");
    $FunctionEquivalentNumber1 = $("#FunctionEquivalentNumber1");
    $FunctionEquivalentNumber2 = $("#FunctionEquivalentNumber2");
    $ValidityofDocumentry = $("#ValidityofDocumentry");
    $ValidityofDocumentry1 = $("#ValidityofDocumentry1");
    $address01 = $("#address01");
    $address02 = $("#address02");
    $address03 = $("#address03");
    $address04 = $("#address04");
    $address05 = $("#address05");
    $address06 = $("#address06");
    $address07 = $("#address07");
    $address08 = $("#address08");
    $address09 = $("#address09");
    $address10 = $("#address10");
    $TaxIdentificationNumber1 = $("#TaxIdentificationNumber1");
    $TaxIdentificationNumber2 = $("#TaxIdentificationNumber2");
    $TaxResidencyCountry3 = $("#TaxResidencyCountry3");
    $FunctionEquivalentNumber3 = $("#FunctionEquivalentNumber3");
    $ValidityofDocumentry2 = $("#ValidityofDocumentry2");
    $Address11 = $("#Address11");
    $Address12 = $("#Address12");
    $Address13 = $("#Address13");
    $Address14 = $("#Address14");
    $Address15 = $("#Address15");
    $TaxIdentificationNumber3 = $("#TaxIdentificationNumber3");
    $FatherName2 = $("#FatherName2");
    $PlaceOfBirth = $("#PlaceOfBirth");
    $CountryOfBirth = $("#CountryOfBirth");
    $OccupationType = $("#OccupationType");
    $IdentificationType = $("#IdentificationType");
    $IdentificationTypeOthers = $("#IdentificationTypeOthers");
    $Identificationno = $("#Identificationno");
    $MaidenName = $("#MaidenName");


    /*------------------------------Proposal Details Client Validations -------------------------------*/

    if (Opt == 0) {

        if ($ContactTitle.val() == 0) {
            $ContactTitle.addClass('Error'); is_valid = 1;
            $("#error_ContactTitle").html("Please Select Title");
        }
        else {
            $("#error_ContactTitle").html("");
            $ContactTitle.removeClass('Error');
        }

        if ($ContactFirstName.val() == "" || checkTextWithSpace($ContactFirstName) == false) {

            $('#dvContactFirstName').addClass('Error'); is_valid = 1;
            $("#error_ContactFirstName").html("Please Enter First Name");
        }
        else {
            $("#error_ContactFirstName").html("");
            $("#dvContactFirstName").removeClass('Error');
        }

        if ($ContactMiddleName.val() == "" || checkTextWithSpace($ContactMiddleName) == false) {
            $('#dvContactMiddleName').addClass('Error'); is_valid = 1;
            $("#error_ContactMiddleName").html("Please Enter Middle Name");
        }
        else {
            $("#error_ContactMiddleName").html("");
            $("#dvContactMiddleName").removeClass('Error');
        }

        if ($ContactLastName.val() == "" || checkTextWithSpace($ContactLastName) == false) {
            $('#dvContactLastName').addClass('Error'); is_valid = 1;
            $("#error_ContactLastName").html("Please Enter Last Name");
        }
        else {
            $("#error_ContactLastName").html("");
            $("#dvContactLastName").removeClass('Error');
        }

        if ($ProposerMaritalStatus.val() == "" || $ProposerMaritalStatus.val() == null) {
            $('#ProposerMaritalStatus').addClass('Error'); is_valid = 1;
            $("#error_ProposerMaritalStatus").html("Please select an option.");
        }
        else {
            $("#error_ProposerMaritalStatus").html("");
            $('#ProposerMaritalStatus').removeClass('Error');

        }

        if ($("#ProposerGender").val() == '' || $("#ProposerGender").val() == null) {
            $('#ProposerGender').addClass('Error'); is_valid = 1;
            $("#error_ProposerGender").html("Please Select Gender");
        }
        else {
            $("#error_ProposerGender").html("");
            $('#ProposerGender').removeClass('Error');
        }

        if ($ContactDOB.val() == "") {
            $('#dvContactDOB').addClass('Error'); is_valid = 1;
            $("#error_ContactDOB").html("Please Select DOB.");
        }
        else {
            $("#error_ContactDOB").html("");
            $('#dvContactDOB').removeClass('Error');
        }

        if ($ContactMobile.val() == "" || checkMobile($ContactMobile) == false) {
            $('#dvContactMobile').addClass('Error'); is_valid = 1;
            $("#error_ContactMobile").html("Please Enter Mobile Number.");
        }
        else {
            $("#error_ContactMobile").html("");
            $('#dvContactMobile').removeClass('Error');
        }

        if ($ContactEmail.val() == '' || checkEmail($ContactEmail) == false) {
            $('#dvContactEmail').addClass('Error'); is_valid = 1;
            $("#error_ContactEmail").html("Please Enter Valid Email.");
        }
        else {
            $("#error_ContactEmail").html("");
            $('#dvContactEmail').removeClass('Error');
        }

        if ($ProposerEducationQualification.val() == "" || $ProposerEducationQualification.val() == null) {
            $('#ProposerducationQualification').addClass('Error'); is_valid = 1;
            $("#error_ProposerEducationQualification").html("Please select an option.");
        }
        else {
            $("#error_ProposerEducationQualification").html("");
            $('#ProposerEducationQualification').removeClass('Error');
        }


        if ($ProposerResidentStatus.val() == "" || $ProposerResidentStatus.val() == null) {
            $('#ProposerResidentStatus').addClass('Error'); is_valid = 1;
            $("#error_ProposerResidentStatus").html("Please select an option.");
        }
        else {
            $("#error_ProposerResidentStatus").html("");
            $('#ProposerResidentStatus').removeClass('Error');
        }

        if ($ProposerPANNo.val() == "" || checkPAN($ProposerPANNo) == false) {
            $('#dvProposerPANNo').addClass('Error'); is_valid = 1;
            $("#error_ProposerPANNo").html("Please Valid PAN No.");
        }
        else {
            $("#error_ProposerPANNo").html("");
            $("#ProposerPANNo").removeClass('Error');
        }

        if ($ProposerAadharNo.val() == "") {
            $("#dvProposerAadharNo").addClass('Error');
            is_valid = 1;
            $("#error_ProposerAadharNo").html("Please Enter Aadhar Number.");
        }
        else {
            if ($ProposerAadharNo.val().length >= 12) {
                $("#dvProposerAadharNo").removeClass('Error');
                $("#error_ProposerAadharNo").html("");


            } else {
                $("#dvProposerAadharNo").addClass('Error'); is_valid = 1;
                $("#error_ProposerAadharNo").html("Please Enter Valid Aadhar Number.");
            }
        }

        if ($ProposerIDProof.val() == "" || $ProposerIDProof.val() == 0) {
            $("#ProposerIDProof").addClass('Error');
            $("#error_ProposerIDProof").html("Please select an option.");
            is_valid = 1;

        } else {
            $("#ProposerIDProof").removeClass('Error');
            $("#error_ProposerIDProof").html("");
        }


        if ($ProposerAgeProof.val() == "" || $ProposerAgeProof.val() == 0) {
            $("#ProposerAgeProof").addClass('Error');
            $("#error_ProposerAgeProof").html("Please select an option.");
            is_valid = 1;

        } else {
            $("#ProposerAgeProof").removeClass('Error');
            $("#error_ProposerAgeProof").html("");
        }


        if ($ProposerAddressProof.val() == "" || $ProposerAddressProof.val() == 0) {
            $("#ProposerAddressProof").addClass('Error');
            $("#error_ProposerAddressProof").html("Please select an option.");
            is_valid = 1;

        } else {
            $("#ProposerAddressProof").removeClass('Error');
            $("#error_ProposerAddressProof").html("");
        }

        if ($ProposerIncomeProof.val() == "" || $ProposerIncomeProof.val() == 0) {
            $("#ProposerIncomeProof").addClass('Error');
            $("#error_ProposerIncomeProof").html("Please select an option.");
            is_valid = 1;

        } else {
            $("#ProposerIncomeProof").removeClass('Error');
            $("#error_ProposerIncomeProof").html("");
        }

        if ($("#ProposerOccupationalDetails").val() == "" || $("#ProposerOccupationalDetails").val() == 0 || $("#ProposerOccupationalDetails").val() == null) {

            $("#ProposerOccupationalDetails").addClass('Error');
            $("#error_ProposerOccupationalDetails").html("Please select an option.");
            is_valid = 1;

        } else {
            $("#ProposerOccupationalDetails").removeClass('Error');
            $("#error_ProposerOccupationalDetails").html("");
            if ($("#ProposerOccupationalDetails").val() == "8" || $("#ProposerOccupationalDetails").val() == "5")//Agri and Retired
            {
                if ($("#ProposerOther").val() == "") {
                    $("#dvProposerOther").addClass('Error');
                    $("#error_ProposerOther").html("Please Enter Details.");
                    is_valid = 1;
                } else {
                    $("#ProposerOther").removeClass('Error');
                    $("#error_ProposerOther").html("");
                }
            } else if ($("#ProposerOccupationalDetails").val() == "3")//Business
            {

                if ($("#ProposerBusiness").val() == "") {
                    $("#dvProposerBusiness").addClass('Error');
                    $("#error_ProposerBusiness").html("Please Enter Details.");
                    is_valid = 1;
                } else {
                    $("#dvProposerBusiness").removeClass('Error');
                    $("#error_ProposerBusiness").html("");
                }
            }
            else if ($("#ProposerOccupationalDetails").val() == "1")//Salaried
            {

                if ($("#ProposerCompanyName").val() == "" || $("#ProposerCompanyName").val() == 0) {
                    $("#ProposerCompanyName").addClass('Error');
                    $("#error_ProposerCompanyName").html("Please select an option.");
                    is_valid = 1;
                } else {
                    $("#ProposerCompanyName").removeClass('Error');
                    $("#error_ProposerCompanyName").html("");
                }
            }
            else if ($("#ProposerOccupationalDetails").val() == "2")//SelfedEmployee
            {

                if ($("#ProposerEmpName").val() == "") {
                    $("#dvProposerEmpName").addClass('Error');
                    $("#error_ProposerEmpName").html("Please Enter Employee Name.");
                    is_valid = 1;
                } else {
                    $("#ProposerEmpName").removeClass('Error');
                    $("#error_ProposerEmpName").html("");
                }
            }
            else if ($("#ProposerOccupationalDetails").val() == "6")//Student/Juvenile
            {

                if ($("#ProposerStudentStandard").val() == "") {
                    $("#dvProposerStudentStandard").addClass('Error');
                    $("#error_ProposerStudentStandard").html("Please Enter Student Standard.");
                    is_valid = 1;
                } else {
                    $("#ProposerStudentStandard").removeClass('Error');
                    $("#error_ProposerStudentStandard").html("");
                }
            }
            else if ($("#ProposerOccupationalDetails").val() == "7")//Others
            {

                if ($("#ProposerOccupationQuestionnaire").val() == "" || $("#ProposerOccupationQuestionnaire").val() == 0) {
                    $("#ProposerOccupationQuestionnaire").addClass('Error');
                    $("#error_ProposerOccupationQuestionnaire").html("Please select an option.");
                    is_valid = 1;
                } else {
                    $("#ProposerOccupationQuestionnaire").removeClass('Error');
                    $("#error_ProposerOccupationQuestionnaire").html("");
                }
            }
        }

        //if (($gstIdNumber).val() != '') {
        //    
        //    var gstVal = $gstIdNumber.val();
        //    gstVal = gstVal.toUpperCase();
        //    var gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}Z[0-9]{1}/;
        //    var patternArray = gstVal.match(gstPattern);
        //    if (patternArray == null) {
        //        $('#dvGSTIN').addClass('Error');
        //        is_valid = 1;
        //    }
        //    else {
        //        $('#dvGSTIN').removeClass('Error');
        //    }
        //}
        //else {
        //    $('#dvGSTIN').removeClass('Error');
        //}

        if (is_valid == 0) { return true; }
        else { return false; }
    }


    /*------------------------------Insured Details Client Validations start-------------------------------*/
    if (Opt == 1) {

        //if ($ProposerRelationship.val() == 0 || $ProposerRelationship.val() == null) {
        //    $ProposerRelationship.addClass('Error'); is_valid = 1;
        //    $("#error_ProposerRelationship").html("Please select an option.");
        //}
        //else {
        //    $("#error_ProposerRelationship").html("");
        //    $ProposerRelationship.removeClass('Error');
        //}
        if ($InsuredTitle.val() == 0 || $InsuredTitle.val() == null) {
            $InsuredTitle.addClass('Error'); is_valid = 1;
            $("#error_InsuredTitle").html("Please select an option.");
        }
        else {
            $("#error_InsuredTitle").html("");
            $InsuredTitle.removeClass('Error');
        }

        if ($InsuredFirstName.val() == "" || checkTextWithSpaceFirstName($InsuredFirstName) == false) {

            $('#dvInsuredFirstName').addClass('Error'); is_valid = 1;
            $("#error_InsuredFirstName").html("Please Enter First Name");
        }
        else {
            $("#error_InsuredFirstName").html("");
            $("#dvInsuredFirstName").removeClass('Error');
        }

        if ($InsuredMiddleName.val() != "") {
            if (checkTextWithSpace($InsuredMiddleName) == false) {
                $('#dvInsuredMiddleName').addClass('Error'); is_valid = 1;
                $("#error_InsuredMiddleName").html("Please Enter valid  Middle Name");
            }
            else {
                $("#error_InsuredMiddleName").html("");
                $("#dvInsuredMiddleName").removeClass('Error');
            }

        }
        else {
            $("#error_InsuredMiddleName").html("");
            $("#dvInsuredMiddleName").removeClass('Error');
        }

        if ($InsuredLastName.val() == "" || checkTextWithSpaceLastName($InsuredLastName) == false) {
            $('#dvInsuredLastName').addClass('Error'); is_valid = 1;
            $("#error_InsuredLastName").html("Please Enter Last Name");
        }
        else {
            $("#error_InsuredLastName").html("");
            $("#dvInsuredLastName").removeClass('Error');
        }

        if ($InsuredGender.val() == "" || $InsuredGender.val() == null) {
            $('#InsuredGender').addClass('Error'); is_valid = 1;
            $("#error_InsuredGender").html("Please Select Gender");
        }
        else {
            $("#error_InsuredGender").html("");
            $('#InsuredGender').removeClass('Error');
        }

        if ($InsuredDOB.val() == "") {
            $('#dvInsuredDOB').addClass('Error'); is_valid = 1;
            $("#error_InsuredDOB").html("Please Enter DOB.");
        }
        else {
            $("#error_InsuredDOB").html("");
            $('#dvInsuredDOB').removeClass('Error');
        }

        if ($InsuredMaritalStatus.val() == "M") {
            if ($("#InsuredGender").val() == "Female" || $("#InsuredGender").val() == "F") {
                if ($InsuredHusbandFirstName.val() == "") {
                    $('#dvInsuredHusbandFirstName').addClass('Error'); is_valid = 1;
                    $("#error_InsuredHusbandFirstName").html("Please Enter Husband First Name.");
                }
                else {
                    $("#error_InsuredHusbandFirstName").html("");
                    $("#dvInsuredHusbandFirstName").removeClass('Error');
                }

                if ($InsuredHusbandLastName.val() == "") {
                    $('#dvInsuredHusbandLastName').addClass('Error'); is_valid = 1;
                    $("#error_InsuredHusbandLastName").html("Please Enter Husband Last Name.");
                }
                else {
                    $("#error_InsuredHusbandLastName").html("");
                    $("#dvInsuredHusbandLastName").removeClass('Error');
                }
            } else {
                if ($InsuredFatherFirstName.val() == "") {
                    $('#dvInsuredFatherFirstName').addClass('Error'); is_valid = 1;
                    $("#error_InsuredFatherFirstName").html("Please Enter Father First Name.");
                }
                else {
                    $("#error_InsuredFatherFirstName").html("");
                    $("#dvInsuredFatherFirstName").removeClass('Error');
                }

                if ($InsuredFatherLastName.val() == "") {
                    $('#dvInsuredFatherLastName').addClass('Error'); is_valid = 1;
                    $("#error_InsuredFatherLastName").html("Please Enter Father Last Name.");
                }
                else {
                    $("#error_InsuredFatherLastName").html("");
                    $("#dvInsuredFatherLastName").removeClass('Error');
                }
            }
            
            if ($InsuredGender.val() == "F") {
                if ($MaidenName.val() == "") {
                    $('#dvMaidenName').addClass('Error'); is_valid = 1;
                    //$("#error_MaidenName").html("Please Enter Maiden Name.");
                }
                else {
                    $("#error_MaidenName").html("");
                    $("#dvMaidenName").removeClass('Error');
                }
            }
            else {
                $("#error_MaidenName").html("");
                $("#dvMaidenName").removeClass('Error');
            }

        } else {
            if ($InsuredFatherFirstName.val() == "") {
                $('#dvInsuredFatherFirstName').addClass('Error'); is_valid = 1;
                $("#error_InsuredFatherFirstName").html("Please Enter Father First Name.");
            }
            else {
                $("#error_InsuredFatherFirstName").html("");
                $("#dvInsuredFatherFirstName").removeClass('Error');
            }

            if ($InsuredFatherLastName.val() == "") {
                $('#dvInsuredFatherLastName').addClass('Error'); is_valid = 1;
                $("#error_InsuredFatherLastName").html("Please Enter Father Last Name.");
            }
            else {
                $("#error_InsuredFatherLastName").html("");
                $("#dvInsuredFatherLastName").removeClass('Error');
            }
        }

        if ($InsuredMotherFirstName.val() == "") {
            $('#dvInsuredMotherFirstName').addClass('Error'); is_valid = 1;
            $("#error_InsuredMotherFirstName").html("Please Enter Mother First Name.");
        }
        else {
            $("#error_InsuredMotherFirstName").html("");
            $("#dvInsuredMotherFirstName").removeClass('Error');
        }

        if ($InsuredMotherLastName.val() == "") {
            $('#dvInsuredMotherLastName').addClass('Error'); is_valid = 1;
            $("#error_InsuredMotherLastName").html("Please Enter Mother Last Name.");
        }
        else {

            $("#error_InsuredMotherLastName").html("");
            $("#InsuredMotherLastName").removeClass('Error');
        }

        


        if ($InsuredMaritalStatus.val() == "" || $InsuredMaritalStatus.val() == null) {
            $('#InsuredMaritalStatus').addClass('Error'); is_valid = 1;
            $("#error_InsuredMaritalStatus").html("Please select an option.");
        }
        else {
            $("#error_InsuredMaritalStatus").html("");
            $('#InsuredMaritalStatus').removeClass('Error');

        }

        if ($InsuredNationality.val() == "" || $InsuredNationality.val() == null) {
            $('#InsuredNationality').addClass('Error'); is_valid = 1;
            $("#error_InsuredNationality").html("Please select an option.");
        }
        else {
            $("#error_InsuredNationality").html("");
            $('#InsuredNationality').removeClass('Error');
        }


        if ($InsuredPANNo.val() == "" || checkPAN($InsuredPANNo) == false) {
            $('#dvInsuredPANNo').addClass('Error'); is_valid = 1;
            //$("#error_InsuredPANNo").html("Please Valid PAN No.");
        }
        else {
            $("#error_InsuredPANNo").html("");
          //  $("#InsuredPANNo").removeClass('Error');
        }

        if ($InsuredEmail.val() == '' || checkEmail($InsuredEmail) == false) {
            $('#dvInsuredEmail').addClass('Error'); is_valid = 1;
            $("#error_InsuredEmail").html("Please Enter Valid Email.");

        }
        else {
            $("#error_InsuredEmail").html("");
            $('#dvInsuredEmail').removeClass('Error');
        }

        if ($InsurerGST.val() == '') {
            $("#error_Gstno").html("");
            $('#dvGstno').removeClass('Error');

        }
        else {


            if (($InsurerGST).val() != '') {

                var gstVal = $InsurerGST.val();
                gstVal = gstVal.toUpperCase();
                var gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[0-9]{1}/;
                var patternArray = gstVal.match(gstPattern);
                if (patternArray == null) {
                    $('#dvGstno').addClass('Error');
                    $("#error_Gstno").html("Please Enter Valid GST No.");
                    is_valid = 1;
                }
                else {
                    $('#dvGstno').removeClass('Error');
                    $("#error_Gstno").html("");
                }
            }
            else {
                $('#dvGstno').removeClass('Error');
                $("#error_Gstno").html("");
            }

        }

        //if ($InsuredResidentStatus.val() == "RI") {
        if ($InsuredMobile.val() == "" || checkMobile($InsuredMobile) == false) {
            $('#dvInsuredMobile').addClass('Error'); is_valid = 1;
            $("#error_InsuredMobile").html("Please Enter Valid Mobile Number.");
        }
        else {
            $("#error_InsuredMobile").html("");
            $('#dvInsuredMobile').removeClass('Error');
        }
        //}


        if ($("#IsRiderSelected").val() == "True") {
            if ($("#DominantHand").val() == "") {
               /* $('#divDominantHand').addClass('Error');*/ is_valid = 1;
                $("#error_DominantHand").html("Please Select Dominant Hand.");
            } else {
                //$('#divDominantHand').removeClass('Error'); 
                $("#error_DominantHand").html("");
            }

        }

        if ($("#InsuredPreferedLanguage").val() == "" || $("#InsuredPreferedLanguage").val() == "0" || $("#InsuredPreferedLanguage").val() == null) {
            $('#InsuredPreferedLanguage').addClass('Error'); is_valid = 1;
            $("#error_InsuredPreferedLanguage").html("Please Select Language.");
        }
        else {
            $("#error_InsuredPreferedLanguage").html("");
            $("#InsuredPreferedLanguage").removeClass('Error');
        }

        if ($("#InsuredPreferedTime").val() == "" || $("#InsuredPreferedTime").val() == "0" || $("#InsuredPreferedTime").val() == null) {
            $('#InsuredPreferedTime').addClass('Error'); is_valid = 1;
            $("#error_InsuredPreferedTime").html("Please Select Language.");
        }
        else {
            $("#error_InsuredPreferedTime").html("");
            $("#InsuredPreferedTime").removeClass('Error');
        }
        if ($("#ProductPlanId").val() == "420" && $("#InsuredMaritalStatus").val() == "M") {
            if ($("#InsuredNoOfChildern").val() == "" || $("#InsuredNoOfChildern").val() == null) {
                $('#InsuredNoOfChildern').addClass('Error'); is_valid = 1;
                $("#error_InsuredNoOfChildern").html("Please Select No of Children.");
            }
            else {
                if ($("#InsuredNoOfChildern").val() == ">1") {
                    $('#InsuredNoOfChildern').addClass('Error'); is_valid = 1;
                    $("#error_InsuredNoOfChildern").html("If you have more than one child you are not allowed to select this plan.");
                }
                else {
                    $("#error_InsuredNoOfChildern").html("");
                    $("#InsuredNoOfChildern").removeClass('Error');
                }
            }
        }
        else {
            $("#error_InsuredNoOfChildern").html("");
            $("#InsuredNoOfChildern").removeClass('Error');
        }
       
        
        if (is_valid == 0) {

            return true;
        }
        else { return false; }
    }

    if (Opt == 2) {
        if ($OccupationalDetails.val() == "" || $OccupationalDetails.val() == 0 || $OccupationalDetails.val() == null) {

            $("#OccupationalDetails").addClass('Error');
            $("#error_OccupationalDetails").html("Please select an option.");
            is_valid = 1;

        } else {
            $("#OccupationalDetails").removeClass('Error');
            $("#error_OccupationalDetails").html("");
            if ($("#OccupationalDetails").val() == "8" || $("#OccupationalDetails").val() == "5")//Agri and Retired
            {
                if ($("#Other").val() == "") {
                    $("#dvOther").addClass('Error');
                    $("#error_Other").html("Please Enter Details.");
                    is_valid = 1;
                } else {
                    $("#Other").removeClass('Error');
                    $("#error_Other").html("");
                }
            } else if ($("#OccupationalDetails").val() == "3")//Business
            {

                if ($("#Business").val() == "") {
                    $("#dvBusiness").addClass('Error');
                   // $("#error_Business").html("Please Enter Details.");
                    is_valid = 1;
                } else {
                    $("#dvBusiness").removeClass('Error');
                    $("#error_Business").html("");
                }
            }
            else if ($("#OccupationalDetails").val() == "1")//Salaried
            {

                if ($("#CompanyNameTATAAIA").val() == "" || $("#CompanyNameTATAAIA").val() == null) {
                    $("#CompanyNameTATAAIA").addClass('Error');
                    $("#error_CompanyNameTATAAIA").html("Please select an option.");
                    is_valid = 1;
                } else {
                    $("#CompanyNameTATAAIA").removeClass('Error');
                    $("#error_CompanyNameTATAAIA").html("");
                }
            }
            else if ($("#OccupationalDetails").val() == "2")//SelfedEmployee
            {
                if ($("#EmpName").val() == "") {
                    $("#dvEmpName").addClass('Error');
                    $("#error_EmpName").html("Please Enter Employee Name.");
                    is_valid = 1;
                } else {
                    $("#dvEmpName").removeClass('Error');
                    $("#error_EmpName").html("");
                }
            }
            else if ($("#OccupationalDetails").val() == "6")//Student/Juvenile
            {

                if ($("#StudentStandard").val() == "") {
                    $("#dvStudentStandard").addClass('Error');
                    $("#error_StudentStandard").html("Please Enter Student Standard.");
                    is_valid = 1;
                } else {
                    $("#StudentStandard").removeClass('Error');
                    $("#error_StudentStandard").html("");
                }
            }
            else if ($("#OccupationalDetails").val() == "7")//Others
            {

                if ($("#OccupationQuestionnaire").val() == "" || $("#OccupationQuestionnaire").val() == 0) {
                    $("#OccupationQuestionnaire").addClass('Error');
                    $("#error_OccupationQuestionnaire").html("Please select an option.");
                    is_valid = 1;
                } else {
                    $("#OccupationQuestionnaire").removeClass('Error');
                    $("#error_OccupationQuestionnaire").html("");
                }
            }
        }

        if ($AnnualIncome.val() == "" || $AnnualIncome.val() == 0) {
            $("#dvAnnualIncome").addClass('Error');
           // $("#error_AnnualIncome").html("Please Enter Valid Annual Income.");
            is_valid = 1;

        } else {
            $("#dvAnnualIncome").removeClass('Error');
            $("#error_AnnualIncome").html("");
        }

        if ($("#OraganizationType").val() == "" || $("#OraganizationType").val() == null) {
            $("#OraganizationType").addClass('Error');
            //$("#error_OraganizationType").html("Please select an option.");
            is_valid = 1;
        } else {
            $("#OraganizationType").removeClass('Error');
            $("#error_OraganizationType").html("");
        }

        if ($("#IndustryType").val() == "" || $("#IndustryType").val() == null) {
            $("#IndustryType").addClass('Error');
            $("#error_IndustryType").html("Please select an option.");
            is_valid = 1;
        } else {
            if ($("#IndustryType").val() == "Other") {
                if ($("#IndustryOther").val() == "") {
                    $("#dvIndustryOther").addClass('Error');
                    //$("#error_IndustryOther").html("Please enter Other Industry value.");
                }
                else {
                    $("#dvIndustryOther").removeClass('Error');
                    $("#error_IndustryOther").html("");
                }
            }

            $("#IndustryType").removeClass('Error');
            $("#error_IndustryType").html("");
        }


        if ($("#NatureOfWork").val() == "" || $("#NatureOfWork").val() == null) {
            $("#NatureOfWork").addClass('Error');
            $("#error_NatureOfWork").html("Please select an option.");
            is_valid = 1;
        } else {
            $("#NatureOfWork").removeClass('Error');
            $("#error_NatureOfWork").html("");
        }


        if ($InsuredEducationQualification.val() == "" || $InsuredEducationQualification.val() == null) {
            $('#InsuredEducationQualification').addClass('Error'); is_valid = 1;
            $("#error_InsuredEducationQualification").html("Please select an option.");
        }
        else {
            $("#error_InsuredEducationQualification").html("");
            $('#InsuredEducationQualification').removeClass('Error');
        }

        if ($TaxResidentofIndia.val() == "") {

            $("divTaxResidentofIndia").addClass('Error');
            $("#error_TaxResidentofIndia").html("Please Select Option.");
            is_valid = 1;

        } else {
            $("#divTaxResidentofIndia").removeClass('Error');
            $("#error_TaxResidentofIndia").html("");
        }

        if (is_valid == 0) {

            return true;
        }
        else { return false; }
    }

    if (Opt == 3) {
        if ($InsuredIDProof.val() == "" || $InsuredIDProof.val() == 0) {

            $("#InsuredIDProof").addClass('Error');
            $("#error_InsuredIDProof").html("Please select an option.");
            is_valid = 1;

        } else {

            if ($InsuredIDProof.val() == "1018010075" || $InsuredIDProof.val() == "1018010078") {

                

                if ($InsuredIDProofIssueDate.val() == "") {
                    $("#dvInsuredIDProofIssueDate").addClass('Error');
                    $("#error_InsuredIDProofIssueDate").html("Please select Issue Date");
                    is_valid = 1;
                }
                else {
                    $("#dvInsuredIDProofIssueDate").removeClass('Error');
                    $("#error_InsuredIDProofIssueDate").html("");

                }

                if ($InsuredIDProofExpiryDate.val() == "") {
                    $("#dvInsuredIDProofExpiryDate").addClass('Error');
                    $("#error_InsuredIDProofExpiryDate").html("Please select Expiry Date.");
                    is_valid = 1;
                }
                else {
                    $("#dvInsuredIDProofExpiryDate").removeClass('Error');
                    $("#error_InsuredIDProofExpiryDate").html("");

                }
            }

            $("#InsuredIDProof").removeClass('Error');
            $("#error_InsuredIDProof").html("");
        }

        if ($InsuredIDProofNumber.val() == "" || $InsuredIDProofNumber.val() == 0) {
            $("#dvInsuredIDProofNumber").addClass('Error');
            //$("#error_InsuredIDProofNumber").html("Please Enter ID Proof Number.");
            is_valid = 1;
        }
        else {
            $("#dvInsuredIDProofNumber").removeClass('Error');
            $("#error_InsuredIDProofNumber").html("");

        }

        if ($InsuredAgeProof.val() == "" || $InsuredAgeProof.val() == 0) {
            $("#InsuredAgeProof").addClass('Error');
            $("#error_InsuredAgeProof").html("Please select an option.");
            is_valid = 1;

        } else {
            $("#InsuredAgeProof").removeClass('Error');
            $("#error_InsuredAgeProof").html("");
        }

        if ($InsuredAddressProof.val() == "" || $InsuredAddressProof.val() == 0) {
            $("#InsuredAddressProof").addClass('Error');
            $("#error_InsuredAddressProof").html("Please select an option.");
            is_valid = 1;

        } else {
            $("#InsuredAddressProof").removeClass('Error');
            $("#error_InsuredAddressProof").html("");
        }

        if ($InsuredIncomeProof.val() == "" || $InsuredIncomeProof.val() == 0 || $InsuredIncomeProof.val() == null) {
            $("#InsuredIncomeProof").addClass('Error');
            $("#error_InsuredIncomeProof").html("Please select an option.");
            is_valid = 1;

        } else {
            $("#InsuredIncomeProof").removeClass('Error');
            $("#error_InsuredIncomeProof").html("");
        }

        if (is_valid == 0) {

            return true;
        }
        else { return false; }
    }

    if (Opt == 4) {
        if ($DisabledPerson.val() == "") {
            $('#divDisabledPerson').addClass('Error'); is_valid = 1;
            $("#error_DisabledPerson").html("Please Select Yes/No.");
        }
        else {
            $("#error_DisabledPerson").html("");
            $('#divDisabledPerson').removeClass('Error');
        }

        if ($Criminal.val() == "") {
            $('#divCriminal').addClass('Error'); is_valid = 1;
            $("#error_Criminal").html("Please Select Yes/No.");
        }
        else {
            $("#error_Criminal").html("");
            $('#divCriminal').removeClass('Error');
        }


        if ($politicalexposedperson.val() == "") {
            $('#divpoliticalexposedperson').addClass('Error'); is_valid = 1;
            $("#error_politicalexposedperson").html("Please Select Yes/No.");
        }
        else {
            $("#error_politicalexposedperson").html("");
            $('#divpoliticalexposedperson').removeClass('Error');
            if ($politicalexposedperson.val() == "Yes") {
                if ($("#politicallyexposedesc").val() == "" || $("#politicallyexposedesc").val() == null) {
                    $('#dvpoliticallyexposedesc').addClass('Error'); is_valid = 1;
                    //$("#error_politicallyexposedesc").html("Please Enter Details.");
                }
                else {
                    $("#error_politicallyexposedesc").html("");
                    $('#dvpoliticallyexposedesc').removeClass('Error');
                }
            }
        }

        if ($EIA.val() == "") {

            $("#dvEIA").addClass('Error');
            $("#error_EIA").html("Please Select Option.");
            is_valid = 1;

        } else {
            $("#dvEIA").removeClass('Error');
            $("#error_EIA").html("");
            if ($EIA.val() == "Y") {

                if ($EIANo.val() == "" || $EIANo.val() == "0") {

                    $("#dvEIANo").addClass('Error');
                   // $("#error_EIANo").html("Please Enter EIA No.");
                    is_valid = 1;

                } else {
                    if ($EIANo.val().length < 13) {
                        $("#dvEIANo").addClass('Error');
                       // $("#error_EIANo").html("Please Enter Valid EIA No.");
                        is_valid = 1;
                    } else {
                        $("#dvEIANo").removeClass('Error');
                        $("#error_EIANo").html("");
                    }

                }
            } else {
                if ($("#chk_EIA").val() == "" || $("#chk_EIA").val() == "false") {
                    $('#chk_EIA').addClass('Error'); is_valid = 1;
                    $("#error_chk_EIA").html("Please select disclaimer");
                }
                else {
                    $("#error_chk_EIA").html("");
                    $('#chk_EIA').removeClass('Error');
                }
            }
        }

        if ($CKYC.val() == "") {

            $("#dvCKYCNo").addClass('Error');
            $("#error_CKYC").html("Please Select Option.");
            is_valid = 1;

        } else {
            $("#dvCKYCNo").removeClass('Error');
            $("#error_CKYC").html("");
            if ($CKYC.val() == "Y") {

                if ($CKYCNo.val() == "" || $CKYCNo.val() == "0") {

                    $("#dvCKYCNo").addClass('Error');
                 //   $("#error_CKYCNo").html("Please Enter Valid CKYC No.");
                    is_valid = 1;

                } else {
                    if ($CKYCNo.val().length < 13) {
                        $("#dvCKYCNo").addClass('Error');
                       // $("#error_CKYCNo").html("Please Enter Valid CKYC No.");
                        is_valid = 1;
                    } else {
                        $("#dvCKYCNo").removeClass('Error');
                        $("#error_CKYCNo").html("");
                    }

                }
            }
        }
        if (is_valid == 0) {

            return true;
        }
        else { return false; }
    }


    //}   /*-----------------Current/Communication Address Client Validations--------------------*/
    else if (Opt == 7) {

        if ($ContactHOUSEFLATNUMBER.val() == '' || checkAddressStreetBuilding($ContactHOUSEFLATNUMBER) == false) {
            $('#dvContactHOUSEFLATNUMBER').addClass('Error'); is_valid = 1;
           // $("#error_ContactHOUSEFLATNUMBER").html("Please Enter Valid Address.");
        }
        else {
            $("#error_ContactHOUSEFLATNUMBER").html("");
            $('#dvContactHOUSEFLATNUMBER').removeClass('Error');
            CheckAtleastTwoCharacter($ContactHOUSEFLATNUMBER);
        }


        if ($ContactSTREETBUILDING.val() == '' || checkAddress1($ContactSTREETBUILDING) == false) {
            $('#dvContactSTREETBUILDING').addClass('Error'); is_valid = 1;
           //$("#error_ContactSTREETBUILDING").html("Please Enter Valid Address.");
        }
        else {
            $("#error_ContactSTREETBUILDING").html("");
            $('#dvContactSTREETBUILDING').removeClass('Error');
            // $('#dvContactHOUSEFLATNUMBER').removeClass('Error');
        }

        //if ($ContactSTREETBUILDING.val() == '' || checkAddress($ContactSTREETBUILDING) == false) { $('#dvContactSTREETBUILDING').addClass('Error'); is_valid = 1; }
        //else { $('#dvContactSTREETBUILDING').removeClass('Error'); }

        if ($ContactPinCode.val() == "" || $ContactPinCode.val().length != 6 || $ContactPinCode.val() < 110000 || checkPincode($ContactPinCode) == false) {

            $('#dvContactPinCode').addClass('Error'); is_valid = 1;
            $("#error_ContactPinCode").html("Please Enter Valid PinCode.");
        }
        else {
            $("#error_ContactPinCode").html("");
            $('#dvContactPinCode').removeClass('Error');
        }

        if ($ContactLandmark.val() == '' || checkAddress1($ContactLandmark) == false) {
            $('#dvContactLandmark').addClass('Error'); is_valid = 1;
          //  $("#error_ContactLandmark").html("Please Enter Valid Address.");
        }
        else {

            $("#error_ContactLandmark").html("");
            $('#dvContactLandmark').removeClass('Error');
            // $('#dvContactHOUSEFLATNUMBER').removeClass('Error');
        }

        //if ($ContactLandmark.val() == '') { $('#dvContactLandmark').addClass('Error'); is_valid = 1; }
        //else { $('#dvContactLandmark').removeClass('Error'); }

        if ($TATAAIAContactCityID.val() == '') {
            $('#TATAAIAContactCityID').addClass('Error'); is_valid = 1;
            $("#error_TATAAIAContactCityID").html("Please select an option.");
        }
        else {
            $("#error_TATAAIAContactCityID").html("");
            $('#TATAAIAContactCityID').removeClass('Error');
        }

        if ($ContactState.val() == '') {
            $('#dvContactState').addClass('Error'); is_valid = 1;
            $("#error_ContactState").html("Please select an option.");
        }
        else {
            $("#error_ContactState").html("");
            $('#dvContactState').removeClass('Error');
        }

        if ($Country.val() == '') {
            $('#dvCountry').addClass('Error'); is_valid = 1;
            $("#error_Country").html("Please select an option");
        }
        else {
            $("#error_Country").html("");
            $('#dvCountry').removeClass('Error');
        }

        if ($CountryOfResidence.val() == '') {
            $('#dvCountryOfResidence').addClass('Error'); is_valid = 1;
            $("#error_CountryOfResidence").html("Please select an option.");
        }
        else {
            $("#error_CountryOfResidence").html("");
            $('#dvCountryOfResidence').removeClass('Error');
        }



        if ($("#paddress").val() == '') {
            //$('#divpaddress').addClass('Error'); 
            is_valid = 1;
            $("#error_paddress").html("Please Select Yes/No.");
        }
        else {
            $("#error_paddress").html("");
            //$('#divpaddress').removeClass('Error');
            if ($("#paddress").val() == "No") {

                if ($PermanentContactHOUSEFLATNUMBER.val() == '' || checkAddressStreetBuilding($PermanentContactHOUSEFLATNUMBER) == false) {
                    $('#dvPermanentContactHOUSEFLATNUMBER').addClass('Error'); is_valid = 1;
                   // $("#error_PermanentContactHOUSEFLATNUMBER").html("Please Enter Valid Address.");
                }
                else {
                    //CheckAddressHDFC($PermanentContactHOUSEFLATNUMBER);
                    $("#error_PermanentContactHOUSEFLATNUMBER").html("");
                    $('#dvPermanentContactHOUSEFLATNUMBER').removeClass('Error');
                }

                //if ($PermanentContactHOUSEFLATNUMBER.val() == '' || checkAddress($PermanentContactHOUSEFLATNUMBER) == false) { $('#dvPermanentContactHOUSEFLATNUMBER').addClass('Error'); is_valid = 1; }
                //else { $('#dvPermanentContactHOUSEFLATNUMBER').removeClass('Error'); }

                //if ($PermanentContactSTREETBUILDING.val() == '' || checkAddress($PermanentContactSTREETBUILDING) == false) { $('#dvPermanentContactSTREETBUILDING').addClass('Error'); is_valid = 1; }
                //else { $('#dvPermanentContactSTREETBUILDING').removeClass('Error'); }

                if ($PermanentContactSTREETBUILDING.val() == '' || checkPermanentAddress1($PermanentContactSTREETBUILDING) == false) {
                    $('#dvPermanentContactSTREETBUILDING').addClass('Error'); is_valid = 1;
                    //$("#error_PermanentContactSTREETBUILDING").html("Please Enter Valid Address.");
                }

                else {
                    //CheckAddressHDFC($PermanentContactSTREETBUILDING);
                    $("#error_PermanentContactSTREETBUILDING").html("");
                    $('#dvPermanentContactSTREETBUILDING').removeClass('Error');
                }

                if ($PermanentPinCode.val() == "" || $PermanentPinCode.val().length != 6 || $PermanentPinCode.val() < 110000 || checkPincode($PermanentPinCode) == false) {
                    $('#dvPermanentPinCode').addClass('Error'); is_valid = 1;
                   // $("#error_PermanentPinCode").html("Please Enter Valid Pincode.");
                }
                else {
                    $("#error_PermanentPinCode").html("");
                    $('#dvPermanentPinCode').removeClass('Error');
                }

                //if ($PermanentLandmark.val() == '' || checkAddress1($PermanentLandmark) == false) {
                //    $('#dvPermanentLandmark').addClass('Error'); is_valid = 1;
                //    $("#error_PermanentLandmark").html("Please Enter Valid Address.");
                //}
                //else {
                //    //CheckAddressHDFC($PermanentLandmark);
                //    $("#error_PermanentLandmark").html("");
                //    $('#dvPermanentLandmark').removeClass('Error');
                //}


                if ($PermanentLandmark.val() == '') {
                    $('#dvPermanentLandmark').addClass('Error'); is_valid = 1;
                    //$("#error_PermanentLandmark").html("Please Enter Valid Address.");
                }
                else {
                    $("#error_PermanentLandmark").html("");
                    $('#dvPermanentLandmark').removeClass('Error');
                }

                if ($TATAAIAPermanentCityID.val() == '') {
                    $('#TATAAIAPermanentCityID').addClass('Error'); is_valid = 1;
                   // $("#error_PermanentCityName").html("Please select an option.");
                }
                else {
                    $("#error_TATAAIAPermanentCityID").html("");
                    $('#TATAAIAPermanentCityID').removeClass('Error');
                }

                if ($PermanentStateName.val() == '') {
                    $('#dvPermanentStateName').addClass('Error'); is_valid = 1;
                    //$("#error_PermanentStateName").html("Please select an option.");
                }
                else {
                    $("#error_PermanentStateName").html("");
                    $('#dvPermanentStateName').removeClass('Error');
                }


                if ($PermanentCountry.val() == '') {
                    $('#dvPermanentCountry').addClass('Error'); is_valid = 1;
                   // $("#error_PermanentCountry").html("Please select an option.");
                }
                else {
                    $("#error_PermanentCountry").html("");
                    $('#dvPermanentCountry').removeClass('Error');
                }
                if ($("#CommunicationAddress").val() == '') {
                    //$('#divcaddress').addClass('Error');
                    is_valid = 1;
                    $("#error_CommunicationAddress").html("Please Select Current/Permanent.");
                }
                else {
                    $("#error_CommunicationAddress").html("");
                    //$('#divcaddress').removeClass('Error');
                }
                //if ($PermanentPostOfficeId.val() == 0 || checkAddress($PermanentPostOfficeId) == false || $PermanentPostOfficeId.val() == "") { $PermanentPostOfficeId.addClass('Error'); is_valid = 1; }
                //else { $PermanentPostOfficeId.removeClass('Error'); }
            }


        }

        //if ($CommPreference.val() == '' || $CommPreference.val() == null) {
        //    $('#CommPreference').addClass('Error'); is_valid = 1;
        //    $("#error_CommPreference").html("Please Enter Communication Preference.");
        //}
        //else {
        //    $("#error_CommPreference").html("");
        //    $('#CommPreference').removeClass('Error');
        //}



        if (is_valid == 0) { return true; }
        else { return false; }
    }
    /*-----------------Health History And Travel Details Client Validations--------------------*/
    else if (Opt == 8) {

        var chkSelf = $('#IsMediQuestionSelf').is(':checked');
        if (!chkSelf) { $('#IsMediQuestionSelf').addClass('errorcheckbox'); is_valid = 1; }
        else { $('#IsMediQuestionSelf').removeClass('errorcheckbox'); }

        var medicalSelf = $("input[name='MedicalQuestionSelf']:checked").val();

        if (medicalSelf == 'Yes') {
            var $PEDdisease = $("#PEDdisease");
            var $PEDsufferingDate = $("#PEDsufferingDate");
            var $UnderMedication = $("input[name='UnderMedication']:checked").val();

            if ($PEDdisease.val() == '') { $PEDdisease.addClass('Error'); is_valid = 1; }
            else { $PEDdisease.removeClass('Error'); }

            if ($PEDsufferingDate.val() == '') { $PEDsufferingDate.addClass('Error'); is_valid = 1; }
            else { $PEDsufferingDate.removeClass('Error'); }

            if ($UnderMedication == '' || $UnderMedication === undefined) { $('#radioGroupUnderMedication').addClass('Error'); is_valid = 1; }
            else { $('#radioGroupUnderMedication').removeClass('Error'); }
        }

        if (is_valid == 0) { return true; }
        else { return false; }
    }
    //    /*------------------------------Nominee Details Validations ---------------------------*/
    //else if (Opt == 9) {
    //    if ($NomineeName.val() == "" || checkTextWithSpace($NomineeName) == false) { $("#dvNomineeName").addClass('Error'); is_valid = 1; }
    //    else {
    //        var data = $NomineeName.val();
    //        var arr = data.split(' ');
    //        if (arr[1] != null && arr[1] != "") { $("#dvNomineeName").removeClass('Error'); }
    //        else { $("#dvNomineeName").addClass('Error'); is_valid = 1; }
    //    }

    //    if ($NomineeDOB.val() == "") { $('#dvNomineeDOB').addClass('Error'); is_valid = 1; }
    //    else { $('#dvNomineeDOB').removeClass('Error'); }
    //}
    /*------------------------------End Policy Client Validations ---------------------------*/
    else if (Opt == 9) {


        //if ($NomineeTitle.val() == 0 || $NomineeTitle.val() == null) {
        //    $('#NomineeTitle').addClass('Error'); is_valid = 1;
        //    $("#error_NomineeTitle").html("Please select an option");
        //}
        //else {
        //    $("#error_NomineeTitle").html("");
        //    $('#NomineeTitle').removeClass('Error');
        //}

        if ($NomineeFirstName.val() == "" || checkTextWithSpace($NomineeFirstName) == false) {

            $('#dvNomineeFirstName').addClass('Error'); is_valid = 1;
            //$("#error_NomineeFirstName").html("Please Enter First Name");
        }
        else {
            $("#error_NomineeFirstName").html("");
            $('#dvNomineeFirstName').removeClass('Error');
        }


        //if ($NomineeMiddleName.val() == "" || checkTextWithSpace($NomineeMiddleName) == false) {

        //    $('#dvNomineeMiddleName').addClass('Error'); is_valid = 1;
        //    $("#error_NomineeMiddleName").html("Please Enter Middle Name");
        //}
        //else {
        //    $("#error_NomineeMiddleName").html("");
        //    $('#dvNomineeMiddleName').removeClass('Error');
        //}



        if ($NomineeLastName.val() == "" || checkTextWithSpace($NomineeLastName) == false) {
            $('#dvNomineeLastName').addClass('Error'); is_valid = 1;
           // $("#error_NomineeLastName").html("Please Enter Last Name");
        }
        else {
            $("#error_NomineeLastName").html("");
            $('#dvNomineeLastName').removeClass('Error');
        }

        if ($NomineeDOB.val() == "") {
            $('#dvNomineeDOB').addClass('Error'); is_valid = 1;
            $("#error_NomineeDOB").html("Please Enter DOB.");
        }
        else {
            $("#error_NomineeDOB").html("");
            $('#dvNomineeDOB').removeClass('Error');
        }

        //if ($("#txtNomineeAllocation1").val() == "100") {
        //    $('#dvtxtNomineeAllocation1').removeClass('Error'); 
        //}
        //else {
        //    $('#dvtxtNomineeAllocation1').removeClass('Error');
        //}

        if ($MarriedWomensAct.val() == "") {
            //$('#divMarriedWomensAct').addClass('Error');
            is_valid = 1;
            $("#error_MarriedWomensAct").html("Please Select Yes/No.");
        }
        else {
            $("#error_MarriedWomensAct").html("");
            //$('#divMarriedWomensAct').removeClass('Error');
        }


        if ($("#agenominee1").val() < 18 && $("#agenominee1").val() != "") {
            if ($AppointeeTitle.val() == 0) {
                $('#AppointeeTitle').addClass('Error'); is_valid = 1;
                $("#error_AppointeeTitle").html("Please Select Title");
            }
            else {
                $("#error_AppointeeTitle").html("");
                $('#AppointeeTitle').removeClass('Error');
            }


            if ($AppointeeFirstName.val() == "" || checkTextWithSpace($AppointeeFirstName) == false) {

                $('#dvAppointeeFirstName').addClass('Error'); is_valid = 1;
                //$("#error_AppointeeFirstName").html("Please Enter First Name");
            }
            else {
                $("#error_AppointeeFirstName").html("");
                $('#dvAppointeeFirstName').removeClass('Error');
                var result = CheckAtleastTwoCharacter($AppointeeFirstName);
                if (result == true) {
                    //onlyonespace($AppointeeFirstName);
                }
            }

            if ($AppointeeLastName.val() == "" || checkTextWithSpace($AppointeeLastName) == false) {
                $('#dvAppointeeLastName').addClass('Error'); is_valid = 1;
                //$("#error_AppointeeLastName").html("Please Enter Last Name");
            }
            else {
                $("#error_AppointeeLastName").html("");
                $('#dvAppointeeLastName').removeClass('Error');
                var result = CheckAtleastTwoCharacter($AppointeeLastName);
                if (result == true) {
                    //onlyonespace($AppointeeLastName);
                }
            }

            if ($AppointeeDOB.val() == "") {
                $('#dvAppointeeDOB').addClass('Error'); is_valid = 1;
                $("#error_AppointeeDOB").html("Please Select DOB.");
            }
            else {
                $("#error_AppointeeDOB").html("");
                $('#dvAppointeeDOB').removeClass('Error');
            }

            if ($AppointeeGender.val() == '' || $AppointeeGender.val() == null || $("#AppointeeGender").val()==null) {
                $('#AppointeeGender').addClass('Error'); is_valid = 1;
                $("#error_AppointeeGender").html("Please Select Gender");
            }
            else {
                $("#error_AppointeeGender").html("");
                $('#AppointeeGender').removeClass('Error');
            }

            if ($AppointeeMaritalStatus.val() == '') {
                $('#AppointeeMaritalStatus').addClass('Error'); is_valid = 1;
                $("#error_AppointeeMaritalStatus").html("Please Select Marital Status");
            }
            else {
                $("#error_AppointeeMaritalStatus").html("");
                $('#AppointeeMaritalStatus').removeClass('Error');
            }

            if ($("#AppointeeRelationship").val() == '' || $("#AppointeeRelationship").val() == null) {
                $('#AppointeeRelationship').addClass('Error'); is_valid = 1;
                $("#error_AppointeeRelationship").html("Please Select Marital Status");
            }
            else {
                $("#error_AppointeeRelationship").html("");
                $('#AppointeeRelationship').removeClass('Error');
            }



            if ($("#appointeeaddress").val() == '') {
                $('#divappointeeaddress').addClass('Error'); is_valid = 1;
                $("#error_appointeeaddress").html("Please Select Yes/No.");
            }
            else {
                $("#error_appointeeaddress").html("");
                $('#divappointeeaddress').removeClass('Error');
                if ($("#appointeeaddress").val() == "No") {

                    if ($AppointeeHOUSEFLATNUMBER.val() == '' || checkAddress1($AppointeeHOUSEFLATNUMBER) == false) {
                        $('#dvAppointeeHOUSEFLATNUMBER').addClass('Error'); is_valid = 1;
                        $("#error_AppointeeHOUSEFLATNUMBER").html("Please Enter HOUSE/FLAT NUMBER.");
                    }
                    else {
                        CheckAddressHDFC($AppointeeHOUSEFLATNUMBER);
                        $("#error_AppointeeHOUSEFLATNUMBER").html("");
                        $('#dvAppointeeHOUSEFLATNUMBER').removeClass('Error');
                    }

                    //if ($NomineeHOUSEFLATNUMBER.val() == '' || checkAddress($NomineeHOUSEFLATNUMBER) == false) { $('#dvNomineeHOUSEFLATNUMBER').addClass('Error'); is_valid = 1; }
                    //else { $('#dvNomineeHOUSEFLATNUMBER').removeClass('Error'); }

                    if ($AppointeeSTREETBUILDING.val() == '' || checkAddress1($AppointeeSTREETBUILDING) == false) {
                        $('#dvAppointeeSTREETBUILDING').addClass('Error'); is_valid = 1;
                        $("#error_AppointeeSTREETBUILDING").html("Please Enter STREET BUILDING.");
                    }
                    else {
                        CheckAddressHDFC($AppointeeSTREETBUILDING);
                        $("#error_AppointeeSTREETBUILDING").html("");
                        $("#dvAppointeeSTREETBUILDING").removeClass('Error');
                    }

                    //if ($NomineeSTREETBUILDING.val() == '' || checkAddress($NomineeSTREETBUILDING) == false) { $('#dvNomineeSTREETBUILDING').addClass('Error'); is_valid = 1; }
                    //else { $('#dvNomineeSTREETBUILDING').removeClass('Error'); }

                    if ($AppointeePinCode.val() == "" || $AppointeePinCode.val().length != 6 || $AppointeePinCode.val() < 110000 || checkPincode($AppointeePinCode) == false) {
                        $('#dvAppointeePinCode').addClass('Error'); is_valid = 1;
                        $("#error_AppointeePinCode").html("Please Enter PinCode.");
                    }
                    else {
                        $("#error_AppointeePinCode").html("");
                        $('#dvAppointeePinCode').removeClass('Error');
                    }

                    if ($AppointeeLandmark.val() == '' || checkAddress1($AppointeeLandmark) == false) {
                        $('#dvAppointeeLandmark').addClass('Error'); is_valid = 1;
                        $("#error_AppointeeLandmark").html("Please Enter Landmark.");
                    }
                    else {
                        CheckAddressHDFC($AppointeeLandmark);
                        $("#error_AppointeeLandmark").html("");
                        $('#dvAppointeeLandmark').removeClass('Error');
                    }

                    //if ($NomineeLandmark.val() == '') { $('#dvNomineeLandmark').addClass('Error'); is_valid = 1; }
                    //else { $('#dvNomineeLandmark').removeClass('Error'); }

                    if ($AppointeeCityName.val() == '') {
                        $('#dvAppointeeCityName').addClass('Error'); is_valid = 1;
                        $("#error_AppointeeCityName").html("Please Enter City.");
                    }
                    else {
                        $("#error_AppointeeCityName").html("");
                        $('#dvAppointeeCityName').removeClass('Error');
                    }

                    if ($AppointeeState.val() == '') {
                        $('#dvAppointeeState').addClass('Error'); is_valid = 1;
                        $("#error_AppointeeState").html("Please Enter State.");
                    }
                    else {
                        $("#error_AppointeeState").html("");
                        $('#dvAppointeeState').removeClass('Error');
                    }

                    if ($AppointeePostOfficeId.val() == 0 || checkAddress($AppointeePostOfficeId) == false || $AppointeePostOfficeId.val() == "") { $AppointeePostOfficeId.addClass('Error'); is_valid = 1; }
                    else { $AppointeePostOfficeId.removeClass('Error'); }
                }

            }


        }

        //if ($NomineeMobile.val() == "" || checkMobile($NomineeMobile) == false) {
        //    $('#dvNomineeMobile').addClass('Error'); is_valid = 1;
        //    $("#error_NomineeMobile").html("Please Enter Valid Mobile Number.");
        //}
        //else {
        //    $("#error_NomineeMobile").html("");
        //    $('#dvNomineeMobile').removeClass('Error');
        //}

        if ($NomineeGender.val() == '' || $NomineeGender.val() == null) {
            $('#NomineeGender').addClass('Error'); is_valid = 1;
            $("#error_NomineeGender").html("Please Select Gender.");
        }
        else {
            $("#error_NomineeGender").html("");
            $('#NomineeGender').removeClass('Error');
        }

        //if ($NomineeMaritalStatus.val() == '' || $NomineeMaritalStatus.val() == null) {
        //    $('#NomineeMaritalStatus').addClass('Error'); is_valid = 1;
        //    $("#error_NomineeMaritalStatus").html("Please select an option.");
        //}
        //else {
        //    $("#error_NomineeMaritalStatus").html("");
        //    $('#NomineeMaritalStatus').removeClass('Error');
        //}

        if ($NomineeRelation.val() == '' || $NomineeRelation.val() == null) {
            $('#NomineeRelationship').addClass('Error'); is_valid = 1;
            $("#error_NomineeRelationship").html("Please Select Relationship");
        }
        else {
            $("#error_NomineeRelationship").html("");
            $('#NomineeRelationship').removeClass('Error');
        }
        if ($("#txtNomineeAllocation1").val() == "0" || $("#txtNomineeAllocation1").val() == "") {
            $('#dvtxtNomineeAllocation1').addClass('Error'); is_valid = 1;
            if ($("#txtNomineeAllocation1").val() == "0") {
                $("#error_txtNomineeAllocation1").html("Percentage cannot be 0.");
            }
        }
        else {
            $('#dvtxtNomineeAllocation1').removeClass('Error');
            $("#error_txtNomineeAllocation1").html("");
        }
        if ($("#naddress").val() == '') {
            $('#divnaddress').addClass('Error'); is_valid = 1;
            $("#error_naddress").html("Please Select Yes/No.");
        }
        else {
            $("#error_naddress").html("");
            $('#divnaddress').removeClass('Error');
            if ($("#naddress").val() == "No") {

                if ($NomineeHOUSEFLATNUMBER.val() == '' || checkAddress1($NomineeHOUSEFLATNUMBER) == false) {
                    $('#dvNomineeHOUSEFLATNUMBER').addClass('Error'); is_valid = 1;
                    $("#error_NomineeHOUSEFLATNUMBER").html("Please Enter Valid Address.");
                }
                else {
                    CheckAddressHDFC($NomineeHOUSEFLATNUMBER);
                    $("#error_NomineeHOUSEFLATNUMBER").html("");
                    $('#dvNomineeHOUSEFLATNUMBER').removeClass('Error');
                }

                //if ($NomineeHOUSEFLATNUMBER.val() == '' || checkAddress($NomineeHOUSEFLATNUMBER) == false) { $('#dvNomineeHOUSEFLATNUMBER').addClass('Error'); is_valid = 1; }
                //else { $('#dvNomineeHOUSEFLATNUMBER').removeClass('Error'); }

                if ($NomineeSTREETBUILDING.val() == '' || checkAddress1($NomineeSTREETBUILDING) == false) {
                    $('#dvNomineeSTREETBUILDING').addClass('Error'); is_valid = 1;
                    $("#error_NomineeSTREETBUILDING").html("Please Enter Valid Address.");

                }
                else {
                    CheckAddressHDFC($NomineeSTREETBUILDING);
                    $("#error_NomineeSTREETBUILDING").html("");
                    $("#dvNomineeSTREETBUILDING").removeClass('Error');
                }

                //if ($NomineeSTREETBUILDING.val() == '' || checkAddress($NomineeSTREETBUILDING) == false) { $('#dvNomineeSTREETBUILDING').addClass('Error'); is_valid = 1; }
                //else { $('#dvNomineeSTREETBUILDING').removeClass('Error'); }

                if ($NomineePinCode.val() == "" || $NomineePinCode.val().length != 6 || $NomineePinCode.val() < 110000 || checkPincode($NomineePinCode) == false) {
                    $('#dvNomineePinCode').addClass('Error'); is_valid = 1;
                    $("#error_NomineePinCode").html("Please Enter Valid PinCode.");
                }
                else {
                    $("#error_NomineePinCode").html("");
                    $('#dvNomineePinCode').removeClass('Error');
                }

                if ($NomineeLandmark.val() == '' || checkAddress1($NomineeLandmark) == false) {
                    $('#dvNomineeLandmark').addClass('Error'); is_valid = 1;
                    $("#error_NomineeLandmark").html("Please Enter Valid Address.");
                }
                else {
                    CheckAddressHDFC($NomineeLandmark);
                    $("#error_NomineeLandmark").html("");
                    $('#dvNomineeLandmark').removeClass('Error');
                }

                //if ($NomineeLandmark.val() == '') { $('#dvNomineeLandmark').addClass('Error'); is_valid = 1; }
                //else { $('#dvNomineeLandmark').removeClass('Error'); }

                if ($NomineeCityName.val() == '') {
                    $('#dvNomineeCityName').addClass('Error'); is_valid = 1;
                    $("#error_NomineeCityName").html("Please select an option.");
                }
                else {
                    $("#error_NomineeCityName").html("");
                    $('#dvNomineeCityName').removeClass('Error');
                }

                if ($NomineeState.val() == '') {
                    $('#dvNomineeState').addClass('Error'); is_valid = 1;
                    $("#error_NomineeState").html("Please select an option.");
                }
                else {
                    $("#error_NomineeState").html("");
                    $('#dvNomineeState').removeClass('Error');
                }
                
                //if ($NomineePostOfficeId.val() == 0 || checkAddress($NomineePostOfficeId) == false || $NomineePostOfficeId.val() == "") { $NomineePostOfficeId.addClass('Error'); is_valid = 1; }
                //else { $NomineePostOfficeId.removeClass('Error'); }
            }

        }
        
        if ($isnominee2added.val() == "yes") {
            if ($Nominee2FirstName.val() == "" || checkTextWithSpace($Nominee2FirstName) == false) {

                $('#dvNominee2FirstName').addClass('Error'); is_valid = 1;
                //$("#error_NomineeFirstName").html("Please Enter First Name");
            }
            else {
                $("#error_Nominee2FirstName").html("");
                $('#dvNominee2FirstName').removeClass('Error');
            }


            //if ($NomineeMiddleName.val() == "" || checkTextWithSpace($NomineeMiddleName) == false) {

            //    $('#dvNomineeMiddleName').addClass('Error'); is_valid = 1;
            //    $("#error_NomineeMiddleName").html("Please Enter Middle Name");
            //}
            //else {
            //    $("#error_NomineeMiddleName").html("");
            //    $('#dvNomineeMiddleName').removeClass('Error');
            //}



            if ($Nominee2LastName.val() == "" || checkTextWithSpace($Nominee2LastName) == false) {
                $('#dvNominee2LastName').addClass('Error'); is_valid = 1;
                // $("#error_NomineeLastName").html("Please Enter Last Name");
            }
            else {
                $("#error_Nominee2LastName").html("");
                $('#dvNominee2LastName').removeClass('Error');
            }

            if ($Nominee2DOB.val() == "") {
                $('#dvNominee2DOB').addClass('Error'); is_valid = 1;
                $("#error_Nominee2DOB").html("Please Enter DOB.");
            }
            else {
                $("#error_Nominee2DOB").html("");
                $('#dvNominee2DOB').removeClass('Error');
            }
            if ($Nominee2Gender.val() == '' || $Nominee2Gender.val() == null) {
                $('#Nominee2Gender').addClass('Error'); is_valid = 1;
               //$("#error_Nominee2Gender").html("Please Select Gender");

            }
            else {
                $("#error_Nominee2Gender").html("");
                $('#Nominee2Gender').removeClass('Error');

            }
            if ($Nominee2Relation.val() == '' || $Nominee2Relation.val() == null) {
                $('#Nominee2Relationship').addClass('Error'); is_valid = 1;
                //$("#error_Nominee2Relationship").html("Please Select Relationship");
            }
            else {
                $("#error_Nominee2Relationship").html("");
                $('#Nominee2Relationship').removeClass('Error');
            }
            if ($("#txtNominee2Allocation1").val() == "0" || $("#txtNominee2Allocation1").val() == "") {
                $('#dvtxtNominee2Allocation1').addClass('Error'); is_valid = 1;
                if ($("#txtNominee2Allocation1").val() == "0") {
                    $("#error_txtNominee2Allocation1").html("Percentage cannot be 0");
                }
            }
            else {
                $('#dvtxtNominee2Allocation1').removeClass('Error');
                $("#error_txtNominee2Allocation1").html("");
            }
            //if ($MarriedWomensAct2.val() == "") {
            //    //$('#divMarriedWomensAct').addClass('Error');
            //    is_valid = 1;
            //    $("#error_MarriedWomensAct2").html("Please Select Yes/No.");
            //}
            //else {
            //    $("#error_MarriedWomensAct2").html("");
            //    //$('#divMarriedWomensAct').removeClass('Error');
            //}


            if ($("#agenominee2").val() < 18 && $("#agenominee2").val() != "") {
                if ($Appointee2Title.val() == 0) {
                    $('#Appointee2Title').addClass('Error'); is_valid = 1;
                    $("#error_Appointee2Title").html("Please Select Title");
                }
                else {
                    $("#error_Appointee2Title").html("");
                    $('#Appointee2Title').removeClass('Error');
                }


                if ($Appointee2FirstName.val() == "" || checkTextWithSpace($Appointee2FirstName) == false) {

                    $('#dvAppointee2FirstName').addClass('Error'); is_valid = 1;
                    //$("#error_AppointeeFirstName").html("Please Enter First Name");
                }
                else {
                    $("#error_Appointee2FirstName").html("");
                    $('#dvAppointee2FirstName').removeClass('Error');
                    var result = CheckAtleastTwoCharacter($Appointee2FirstName);
                    if (result == true) {
                        //onlyonespace($AppointeeFirstName);
                    }
                }

                if ($Appointee2LastName.val() == "" || checkTextWithSpace($Appointee2LastName) == false) {
                    $('#dvAppointee2LastName').addClass('Error'); is_valid = 1;
                    //$("#error_AppointeeLastName").html("Please Enter Last Name");
                }
                else {
                    $("#error_Appointee2LastName").html("");
                    $('#dvAppointee2LastName').removeClass('Error');
                    var result = CheckAtleastTwoCharacter($Appointee2LastName);
                    if (result == true) {
                        //onlyonespace($AppointeeLastName);
                    }
                }

                if ($Appointee2DOB.val() == "") {
                    $('#dvAppointee2DOB').addClass('Error'); is_valid = 1;
                    $("#error_Appointee2DOB").html("Please Select DOB.");
                }
                else {
                    $("#error_Appointee2DOB").html("");
                    $('#dvAppointee2DOB').removeClass('Error');
                }

                if ($Appointee2Gender.val() == '' || $Appointee2Gender.val() == null || $("#Appointee2Gender").val() == null) {
                    $('#Appointee2Gender').addClass('Error'); is_valid = 1;
                    $("#error_Appointee2Gender").html("Please Select Gender");
                }
                else {
                    $("#error_Appointee2Gender").html("");
                    $('#Appointee2Gender').removeClass('Error');
                }

                if ($Appointee2MaritalStatus.val() == '') {
                    $('#Appointee2MaritalStatus').addClass('Error'); is_valid = 1;
                    $("#error_Appointee2MaritalStatus").html("Please Select Marital Status");
                }
                else {
                    $("#error_Appointee2MaritalStatus").html("");
                    $('#Appointee2MaritalStatus').removeClass('Error');
                }

                if ($("#Appointee2Relationship").val() == '' || $("#Appointee2Relationship").val() == null) {
                    $('#Appointee2Relationship').addClass('Error'); is_valid = 1;
                    $("#error_Appointee2Relationship").html("Please Select Marital Status");
                }
                else {
                    $("#error_Appointee2Relationship").html("");
                    $('#Appointee2Relationship').removeClass('Error');
                }
            }
        }
        if ($isnominee3added.val() == "yes") {
            if ($Nominee3FirstName.val() == "" || checkTextWithSpace($Nominee3FirstName) == false) {

                $('#dvNominee3FirstName').addClass('Error'); is_valid = 1;
                //$("#error_NomineeFirstName").html("Please Enter First Name");
            }
            else {
                $("#error_Nominee3FirstName").html("");
                $('#dvNominee3FirstName').removeClass('Error');
            }


            //if ($NomineeMiddleName.val() == "" || checkTextWithSpace($NomineeMiddleName) == false) {

            //    $('#dvNomineeMiddleName').addClass('Error'); is_valid = 1;
            //    $("#error_NomineeMiddleName").html("Please Enter Middle Name");
            //}
            //else {
            //    $("#error_NomineeMiddleName").html("");
            //    $('#dvNomineeMiddleName').removeClass('Error');
            //}



            if ($Nominee3LastName.val() == "" || checkTextWithSpace($Nominee3LastName) == false) {
                $('#dvNominee3LastName').addClass('Error'); is_valid = 1;
                // $("#error_NomineeLastName").html("Please Enter Last Name");
            }
            else {
                $("#error_Nominee3LastName").html("");
                $('#dvNominee3LastName').removeClass('Error');
            }

            if ($Nominee3DOB.val() == "") {
                $('#dvNominee3DOB').addClass('Error'); is_valid = 1;
                //$("#error_Nominee3DOB").html("Please Enter DOB.");
            }
            else {
                $("#error_Nominee3DOB").html("");
                $('#dvNominee3DOB').removeClass('Error');
            }
            if ($Nominee3Gender.val() == '' || $Nominee3Gender.val() == null) {
                $('#Nominee3Gender').addClass('Error'); is_valid = 1;
                //$("#error_Nominee3Gender").html("Please Select Gender");

            }
            else {
                $("#error_Nominee3Gender").html("");
                $('#Nominee3Gender').removeClass('Error');

            }
            if ($Nominee3Relation.val() == '' || $Nominee3Relation.val() == null) {
                $('#Nominee3Relationship').addClass('Error'); is_valid = 1;
               // $("#error_Nominee3Relationship").html("Please Select Relationship");
            }
            else {
                $("#error_Nominee3Relationship").html("");
                $('#Nominee3Relationship').removeClass('Error');
            }
            if ($("#txtNominee3Allocation1").val() == "0" || $("#txtNominee3Allocation1").val() == "") {
                $('#dvtxtNominee3Allocation1').addClass('Error'); is_valid = 1;
                if ($("#txtNominee3Allocation1").val() == "0") {
                    $("#error_txtNominee3Allocation1").html("Percentage cannot be 0");
                }
            }
            else {
                $('#dvtxtNominee3Allocation1').removeClass('Error');
                $("#error_txtNominee3Allocation1").html("");
            }
            //if ($("#txtNomineeAllocation1").val() == "100") {
            //    $('#dvtxtNomineeAllocation1').removeClass('Error'); 
            //}
            //else {
            //    $('#dvtxtNomineeAllocation1').removeClass('Error');
            //}

            //if ($MarriedWomensAct3.val() == "") {
            //    //$('#divMarriedWomensAct').addClass('Error');
            //    is_valid = 1;
            //    $("#error_MarriedWomensAct3").html("Please Select Yes/No.");
            //}
            //else {
            //    $("#error_MarriedWomensAct3").html("");
            //    //$('#divMarriedWomensAct').removeClass('Error');
            //}


            if ($("#agenominee3").val() < 18 && $("#agenominee3").val() != "") {
                if ($Appointee3Title.val() == 0) {
                    $('#Appointee3Title').addClass('Error'); is_valid = 1;
                    $("#error_Appointee3Title").html("Please Select Title");
                }
                else {
                    $("#error_Appointee3Title").html("");
                    $('#Appointee3Title').removeClass('Error');
                }


                if ($Appointee3FirstName.val() == "" || checkTextWithSpace($Appointee3FirstName) == false) {

                    $('#dvAppointee3FirstName').addClass('Error'); is_valid = 1;
                    //$("#error_AppointeeFirstName").html("Please Enter First Name");
                }
                else {
                    $("#error_Appointee3FirstName").html("");
                    $('#dvAppointee3FirstName').removeClass('Error');
                    var result = CheckAtleastTwoCharacter($Appointee3FirstName);
                    if (result == true) {
                        //onlyonespace($AppointeeFirstName);
                    }
                }

                if ($Appointee3LastName.val() == "" || checkTextWithSpace($Appointee3LastName) == false) {
                    $('#dvAppointee3LastName').addClass('Error'); is_valid = 1;
                    //$("#error_AppointeeLastName").html("Please Enter Last Name");
                }
                else {
                    $("#error_Appointee3LastName").html("");
                    $('#dvAppointee3LastName').removeClass('Error');
                    var result = CheckAtleastTwoCharacter($Appointee3LastName);
                    if (result == true) {
                        //onlyonespace($AppointeeLastName);
                    }
                }

                if ($Appointee3DOB.val() == "") {
                    $('#dvAppointee3DOB').addClass('Error'); is_valid = 1;
                    //$("#error_Appointee3DOB").html("Please Select DOB.");
                }
                else {
                    $("#error_Appointee3DOB").html("");
                    $('#dvAppointee3DOB').removeClass('Error');
                }

                if ($Appointee3Gender.val() == '' || $Appointee3Gender.val() == null || $("#Appointee3Gender").val() == null) {
                    $('#Appointee3Gender').addClass('Error'); is_valid = 1;
                    //$("#error_Appointee3Gender").html("Please Select Gender");
                }
                else {
                    $("#error_Appointee3Gender").html("");
                    $('#Appointee3Gender').removeClass('Error');
                }

                if ($Appointee3MaritalStatus.val() == '') {
                    $('#Appointee3MaritalStatus').addClass('Error'); is_valid = 1;
                    //$("#error_Appointee3MaritalStatus").html("Please Select Marital Status");
                }
                else {
                    $("#error_Appointee3MaritalStatus").html("");
                    $('#Appointee3MaritalStatus').removeClass('Error');
                }

                if ($("#Appointee3Relationship").val() == '' || $("#Appointee3Relationship").val() == null) {
                    $('#Appointee3Relationship').addClass('Error'); is_valid = 1;
                    $("#error_Appointee3Relationship").html("Please Select Marital Status");
                }
                else {
                    $("#error_Appointee3Relationship").html("");
                    $('#Appointee3Relationship').removeClass('Error');
                }
                
            }
        }
        //if ($("#nomineepercentagetotal").val() == '' || $("#nomineepercentagetotal").val() == null) {
        //    $('#nomineepercentagetotal').addClass('Error'); is_valid = 1;
        //    $("#error_nomineepercentagetotal").html("Please enter valid percentage/Allocation");
        //}
        //else {
        //    $("#error_nomineepercentagetotal").html("");
        //    $('#nomineepercentagetotal').removeClass('Error');
        //}
        total();
        if ($("#nomineepercentagetotal").val() > 100 || $("#nomineepercentagetotal").val() < 100)
        {
            is_valid = 1;
            alert("Please enter valid percentage/Allocation \n(Total percentage should be 100)");
        }
        if (is_valid < 1) { return true; }
        else { return false; }

    }

    else if (Opt == 10) {

        if ($Height.val() == '' || $Height.val() == null) {
            $('#Height').addClass('Error'); is_valid = 1;
            $("#error_Height").html("Please Enter Height.");
        }
        else {
            $("#error_Height").html("");
            $('#Height').removeClass('Error');
        }

        if ($Weight.val() == '') {
            $('#dvWeight').addClass('Error'); is_valid = 1;
            //$("#error_Weight").html("Please Enter Weight.");
        }
        else {
            $("#error_Weight").html("");
            $('#dvWeight').removeClass('Error');
        }

        // var MedicalQuestion = ["QuestionId54", "QuestionId19", "QuestionId20", "QuestionId72","QuestionId73", "QuestionId74",
        //"QuestionId76", "QuestionId78", "QuestionId80", "QuestionId82", "QuestionId84", "QuestionId86", "QuestionId88",
        //"QuestionId90", "QuestionId92", "QuestionId93", "QuestionId44", "QuestionId94", "QuestionId95"];

        // var SubMedicalQuestion = ["SubQuetionId26", "SubQuetionId30", "SubQuetionId5", "SubQuetionId31", "SubQuetionId32",
        //                           "SubQuetionId33", "SubQuetionId34", "SubQuetionId35", "SubQuetionId36", "SubQuetionId37",
        //                           "SubQuetionId38", "SubQuetionId39", "SubQuetionId40", "SubQuetionId41", "SubQuetionId42",
        //                           "SubQuetionId19", "SubQuetionId43", "SubQuetionId44", "SubQuetionId22", "SubQuetionId23",
        //                           "SubQuetionId24"];

        //var MedicalQuestion = ["QuestionId54", "QuestionId19", "QuestionId20", "QuestionId72", "QuestionId73", "QuestionId92", "QuestionId93", "QuestionId44","QuestionId44", "QuestionId94", "QuestionId95"];

        //var SubMedicalQuestion = ["SubQuetionId26", "SubQuetionId30", "SubQuetionId5", "SubQuetionId31","SubQuetionId41", "SubQuetionId42",
        //                          "SubQuetionId19", "SubQuetionId43", "SubQuetionId44", "SubQuetionId22", "SubQuetionId23",
        //                          "SubQuetionId24"];

        //for (var i = 0; i < MedicalQuestion.length; i++) {
        //    MedicalQuestion[i];
        //    if ($("#" + MedicalQuestion[i]).val() != "" || $("#" + MedicalQuestion[i]).val() != null) {
        //        for (var j = i; j <= i; j++) {
        //            if ($("#" + MedicalQuestion[i]).val() == "") {
        //                $("#dv" + MedicalQuestion[i]).addClass('active');
        //                is_valid = 1;
        //                $("#error_" + MedicalQuestion[i]).html("Please Select Option.");
        //            } else
        //            {
        //                $("#dv" + MedicalQuestion[i]).removeClass('active');
        //                $("#error_" + MedicalQuestion[i]).html("");
        //                if ($("#" + MedicalQuestion[i]).val() == "Y" || $("#" + MedicalQuestion[i]).val() == "Yes") {
        //                    if ($("#QuestionId73").val() == "Y")
        //                    {

        //                    } else
        //                    {
        //                        if ($("#" + SubMedicalQuestion[j]).val() == "")
        //                        {
        //                        $("#dv" + SubMedicalQuestion[j]).addClass('active');
        //                        is_valid = 1;
        //                        $("#error_" + SubMedicalQuestion[j]).html("Please Enter Details.");
        //                    } else {
        //                        $("#dv" + SubMedicalQuestion[j]).removeClass('active');
        //                        $("#error_" + SubMedicalQuestion[j]).html("");
        //                    }
        //                    }

        //                }
        //            }

        //            if ($("#QuestionId44").val() == "N") {

        //                if ($("#SubQuetionId19N").val() == "") {
        //                    $("#dvSubQuetionId19N").addClass('active');
        //                    is_valid = 1;
        //                    $("#error_SubQuetionId19N").html("Please Enter Details.");
        //                } else {
        //                    $("#dvSubQuetionId19N").removeClass('active');
        //                    $("#error_SubQuetionId19N").html("");
        //                }
        //            }

        //            if ($("#QuestionId73").val() == "") {
        //                
        //                $("#divQuestionId73").addClass('active');
        //                is_valid = 1;
        //                $("#error_QuestionId73").html("Please Select Option.");
        //            } else {
        //                $("#divQuestionId73").removeClass('active');
        //                $("#error_QuestionId73").html("");
        //            }
        //        }
        //    }
        //}

        if ($("#QuestionId54").val() == '') {
            //  $('#dvQuestionId54').addClass('Error');
            $("#error_QuestionId54").html("Please Select Option."); is_valid = 1;
        }
        else {
            $("#error_QuestionId54").html("");
            $('#dvQuestionId54').removeClass('Error');
            if ($("#QuestionId54").val() == 'Y') {
                if ($("#SubQuetionId26").val() == "") {
                    $('#dvSubQuetionId26').addClass('Error'); is_valid = 1;
                   // $("#error_SubQuetionId26").html("Please Enter Details.");
                }
                else {
                    $("#error_SubQuetionId26").html("");
                    $('#dvSubQuetionId26').removeClass('Error');
                }
            }
        }

        if ($("#QuestionId19").val() == '') {
            $('#dvQuestionId19').addClass('Error'); is_valid = 1;
            $("#error_QuestionId19").html("Please Select Option.");
        }
        else {
            $("#error_QuestionId19").html("");
            $('#dvQuestionId19').removeClass('Error');
            if ($("#QuestionId19").val() == 'Y') {
                if ($("#SubQuetionId30").val() == "") {
                    $('#dvSubQuetionId30').addClass('Error'); is_valid = 1;
                   // $("#error_SubQuetionId30").html("Please Enter Details.");
                }
                else {
                    $("#error_SubQuetionId30").html("");
                    $('#dvSubQuetionId30').removeClass('Error');
                }
            }

        }

        if ($("#QuestionId72").val() == '') {
            //$('#divQuestionId72').addClass('Error');
            is_valid = 1;
            $("#error_QuestionId72").html("Please Select Option.");
        }
        else {
            $("#error_QuestionId72").html("");
            //$('#divQuestionId72').removeClass('Error');
            if ($("#QuestionId72").val() == 'Y') {
                if ($("#SubQuetionId31").val() == "") {
                    $('#dvSubQuetionId31').addClass('Error'); is_valid = 1;
                    //$("#error_SubQuetionId31").html("Please Enter Details.");
                }
                else {
                    $("#error_SubQuetionId31").html("");
                    $('#dvSubQuetionId31').removeClass('Error');
                }
            }

        }

        if ($("#QuestionId20").val() == '') {
            $('#dvQuestionId20').addClass('Error'); is_valid = 1;
            $("#error_QuestionId20").html("Please Select Option.");
        }
        else {
            $("#error_QuestionId20").html("");
            $('#dvQuestionId20').removeClass('Error');

            if ($("#QuestionId20").val() == 'Y') {
                if ($("#SubQuetionId5").val() == "") {
                    $('#dvSubQuetionId5').addClass('Error'); is_valid = 1;
                    //$("#error_SubQuetionId5").html("Please Enter Details.");
                }
                else {
                    $("#error_SubQuetionId5").html("");
                    $('#dvSubQuetionId5').removeClass('Error');
                }
            }

        }

        //if ($("#QuestionId72").val() == '') {
        //    $('#dvQuestionId72').addClass('Error'); is_valid = 1;
        //    $("#error_QuestionId72").html("Please Select Option.");
        //}
        //else {
        //    $("#error_QuestionId72").html("");
        //    $('#dvQuestionId72').removeClass('Error');

        //    if ($("#QuestionId72").val() == 'Y') {
        //        if ($("#SubQuetionId31").val() == "") {
        //            $('#dvSubQuetionId31').addClass('Error'); is_valid = 1;
        //            $("#error_SubQuetionId31").html("Please Enter Details.");
        //        }
        //        else {
        //            $("#error_SubQuetionId31").html("");
        //            $('#dvSubQuetionId31').removeClass('Error');
        //        }
        //    }

        //}

        if ($InsuredGender.val() == 'F') {
            if ($("#QuestionId49").val() == '') {
               // $('#divQuestionId49').addClass('Error');
                is_valid = 1;
                $("#error_QuestionId49").html("Please Select Option.");
            }
            else {
                $("#error_QuestionId49").html("");
                $('#divQuestionId49').removeClass('Error');

                if ($("#QuestionId49").val() == 'Y') {
                    //if ($("#SubQuetionId31").val() == "") {
                    if ($("#QuestionId48").val() == "") {
                        $('#dvQuestionId48').addClass('Error'); is_valid = 1;
                       // $("#error_QuestionId48").html("Please Enter Details.");
                    }
                    else {
                        $("#error_QuestionId48").html("");
                        $('#dvQuestionId48').removeClass('Error');
                    }
                }
            }
        }


        if ($("#QuestionId73").val() == '') {
            $('#dvQuestionId73').addClass('Error'); is_valid = 1;
            $("#error_QuestionId73").html("Please Select Option.");
        }
        else {
            $("#error_QuestionId73").html("");
            $('#dvQuestionId73').removeClass('Error');
        }

        if ($("#QuestionId44").val() == '') {
            $('#dvQuestionId44').addClass('Error'); is_valid = 1;
            $("#error_QuestionId44").html("Please Select Option.");
        }
        else {
            $("#error_QuestionId44").html("");
            $('#dvQuestionId44').removeClass('Error');

            if ($("#QuestionId44").val() == 'Y') {
                if ($("#SubQuetionId19").val() == "") {
                    $('#dvSubQuetionId19').addClass('Error'); is_valid = 1;
                   // $("#error_SubQuetionId19").html("Please Enter Details.");
                }
                else {
                    $("#error_SubQuetionId19").html("");
                    $('#dvSubQuetionId19').removeClass('Error');
                }
            }

            //if ($("#QuestionId44").val() == 'N') {
            //    if ($("#SubQuetionId19N").val() == "") {
            //        $('#dvSubQuetionId19N').addClass('Error'); is_valid = 1;
            //        $("#error_SubQuetionId19N").html("Please Enter Details.");
            //    }
            //    else {
            //        $("#error_SubQuetionId19N").html("");
            //        $('#dvSubQuetionId19N').removeClass('Error');
            //    }
            //}

        }

        if ($("#QuestionId92").val() == '') {
            $('#divQuestionId92').addClass('Error'); is_valid = 1;
            $("#error_QuestionId92").html("Please Select Option.");
        }
        else {
            $("#error_QuestionId92").html("");
            $('#divQuestionId92').removeClass('Error');

            if ($("#QuestionId92").val() == 'N') {
                if ($("#SubQuetionId41").val() == "") {
                    $('#dvSubQuetionId41').addClass('Error'); is_valid = 1;
                   // $("#error_SubQuetionId41").html("Please Enter Details.");
                }
                else {
                    $("#error_SubQuetionId41").html("");
                    $('#dvSubQuetionId41').removeClass('Error');
                }
            }

        }


        if ($("#QuestionId93").val() == '') {
            $('#dvQuestionId93').addClass('Error'); is_valid = 1;
            $("#error_QuestionId93").html("Please Select Option.");
        }
        else {
            $("#error_QuestionId93").html("");
            $('#dvQuestionId93').removeClass('Error');
            if ($("#QuestionId93").val() == 'Y') {
                if ($("#SubQuetionId42").val() == "") {
                    $('#dvSubQuetionId42').addClass('Error'); is_valid = 1;
                   // $("#error_SubQuetionId42").html("Please Enter Details.");
                }
                else {
                    $("#error_SubQuetionId42").html("");
                    $('#dvSubQuetionId42').removeClass('Error');
                }
            }

        }

        if ($("#QuestionId94").val() == '') {
            //$('#divQuestionId94').addClass('Error');
            is_valid = 1;
            $("#error_QuestionId94").html("Please Select Option.");
        }
        else {
            $("#error_QuestionId94").html("");
            //$('#divQuestionId94').removeClass('Error');

            if ($("#QuestionId94").val() == 'Y') {
                if ($("#SubQuetionId43").val() == "") {
                    $('#dvSubQuetionId43').addClass('Error'); is_valid = 1;
                   // $("#error_SubQuetionId43").html("Please Enter Details.");
                }
                else {
                    $("#error_SubQuetionId43").html("");
                    $('#dvSubQuetionId43').removeClass('Error');
                }
            }

        }

        if ($("#QuestionId95").val() == '') {
            $('#dvQuestionId95').addClass('Error'); is_valid = 1;
            $("#error_QuestionId95").html("Please Select Option.");
        }
        else {
            $("#error_QuestionId95").html("");
            $('#dvQuestionId95').removeClass('Error');
            if ($("#QuestionId95").val() == 'Y') {
                if ($("#SubQuetionId44").val() == "") {
                    $('#dvSubQuetionId44').addClass('Error'); is_valid = 1;
                   // $("#error_SubQuetionId44").html("Please Enter Details.");
                }
                else {
                    $("#error_SubQuetionId44").html("");
                    $('#dvSubQuetionId44').removeClass('Error');
                }
            }

        }

        if ($InsuredGender.val() == 'F') {
            if ($("#QuestionId49").val() == "") {
                $("#dvQuestionId49").addClass('Error');
                is_valid = 1;
                $("#error_QuestionId49").html("Please Enter Details.");
            } else {
                $("#dvQuestionId49").removeClass('Error');
                $("#error_QuestionId49").html("");
                if ($("#QuestionId49").val() == "Y") {
                    if ($("#SubQuetionId22").val() == "") {
                        $("#dvSubQuetionId22").addClass('Error');
                        is_valid = 1;
                        //$("#error_SubQuetionId22").html("Please Enter Details.");
                    } else {
                        $("#dvSubQuetionId22").removeClass('Error');
                        $("#error_SubQuetionId22").html("");
                    }

                }
            }

            if ($("#QuestionId50").val() == "") {
               // $("#divQuestionId50").addClass('active');
                is_valid = 1;
                $("#error_QuestionId50").html("Please Enter Details.");
            } else {
                $("#divQuestionId50").removeClass('active');
                $("#error_QuestionId50").html("");
                if ($("#QuestionId50").val() == "Y") {
                    if ($("#SubQuetionId23").val() == "") {
                        $("#dvSubQuetionId23").addClass('Error');
                        is_valid = 1;
                       // $("#error_SubQuetionId23").html("Please Enter Details.");
                    } else {
                        $("#dvSubQuetionId23").removeClass('Error');
                        $("#error_SubQuetionId23").html("");
                    }

                }
            }

            if ($("#QuestionId51").val() == "") {
               // $("#divQuestionId51").addClass('Error');
                is_valid = 1;
                $("#error_QuestionId51").html("Please Enter Details.");
            } else {
                $("#divQuestionId51").removeClass('Error');
                $("#error_QuestionId51").html("");
                if ($("#QuestionId51").val() == "Y") {
                    if ($("#SubQuetionId24").val() == "") {
                        $("#dvSubQuetionId24").addClass('Error');
                        is_valid = 1;
                       // $("#error_SubQuetionId24").html("Please Enter Details.");
                    } else {
                        $("#dvSubQuetionId24").removeClass('Error');
                        $("#error_SubQuetionId24").html("");
                    }

                }
            }

            if ($("#QuestionId47").val() == "") {
               // $("#dvQuestionId47").addClass('Error');
                is_valid = 1;
                $("#error_QuestionId47").html("Please Enter Details.");
            } else {
                $("#dvQuestionId47").removeClass('Error');
                $("#error_QuestionId47").html("");
                if ($("#QuestionId47").val() == "Y") {
                    if ($("#QuestionId48").val() == "") {
                        $("#dvQuestionId48").addClass('Error');
                        is_valid = 1;
                       // $("#error_QuestionId48").html("Please Enter Details.");
                    } else {
                        $("#dvQuestionId48").removeClass('Error');
                        $("#error_QuestionId48").html("");
                    }
                }
                else {
                    $("#dvQuestionId48").removeClass('Error');
                    $("#error_QuestionId48").html("");
                }
            }



        }





        //if ($("#PMH").val() == '') {
        //    $('#divPMH').addClass('Error'); is_valid = 1;
        //    $("#error_PMH").html("Please Select Yes/No.");
        //}
        //else {
        //    $("#error_PMH").html("");
        //    $('#divPMH').removeClass('Error');
        //}


        if (is_valid < 1) { return true; }
        else { return false; }
    }

    //else if (Opt == 11) {


    //    if ($TermsAndConditions.val() == "undefined" || $TermsAndConditions.val() == "" || $TermsAndConditions.val() == null) {
    //        is_valid = 1;
    //        $("#TermsAndConditions").addClass('Error');
    //        $("#error_TermsAndConditions").html("Please Accept Terms & Conditions");
    //    }
    //    else {
    //        $("#error_TermsAndConditions").html("");
    //        $("#TermsAndConditions").removeClass('Error');
    //    }

    //    if (is_valid == 0) {

    //        //  $("#FinalSubmit").val("1");
    //        return true;
    //    }
    //    else { return false; }

    //}

    else if (Opt == 14) {


        if ($QuestionId1.val() == "") {
            $("#dvQuestionId1").addClass('active');
            is_valid = 1;
            $("#error_QuestionId1").html("Please Enter Details.");
        } else {
            $("#dvQuestionId1").removeClass('active');
            $("#error_QuestionId1").html("");
        }


        var LifeStyleQuestion = ["QuestionId1", "QuestionId2", "QuestionId5", "QuestionId7", "QuestionId11", "QuestionId9", "QuestionId15"];

        var LifeStyleSubQuestion = [];
        for (var i = 0; i <= LifeStyleQuestion.length; i++) {
            if ($("#" + LifeStyleQuestion[i]).val() != "" || $("#" + LifeStyleQuestion[i]).val() != null) {
                if ($("#" + LifeStyleQuestion[i]).val() == "") {
                    $("#dv" + LifeStyleQuestion[i]).addClass('active');
                    is_valid = 1;
                    $("#error_" + LifeStyleQuestion[i]).html("Please Select Option.");
                } else {
                    $("#dv" + LifeStyleQuestion[i]).removeClass('active');
                    $("#error_" + LifeStyleQuestion[i]).html("");
                    if ($("#QuestionId2").val() == 'Y') {
                        if ($("#QuestionId3").val() == "" || $("#QuestionId3").val() == null) {
                            $("#error_subquetion4").html("Please Select Anyone Option.");
                            is_valid = 1;
                        } else {
                            $("#error_subquetion4").html("");
                            if ($("#QuestionId3").val() == "Hobbies") {
                                if ($("#QuestionId4").val() == "" || $("#QuestionId4").val() == null) {
                                    $("#error_subquetion4").html("Please Select Anyone Option.");
                                } else {
                                    $("#error_subquetion4").html("");
                                }
                            }
                        }
                        if ($("#SubQuetionId4").val() == "") {
                            $("#dvSubQuetionId4").addClass('active');
                            is_valid = 1;
                            $("#error_SubQuetionId4").html("Please Enter Details.");
                        } else {
                            $("#dvSubQuetionId4").removeClass('active');
                            $("#error_SubQuetionId4").html("");
                        }

                    }

                    if ($("#QuestionId5").val() == 'Y') {
                        if ($("#SubQuetionId6").val() == "") {
                            $("#dvSubQuetionId6").addClass('Error');
                            is_valid = 1;
                            //$("#error_SubQuetionId6").html("Please Enter Details.");
                        } else {
                            $("#dvSubQuetionId6").removeClass('Error');
                            $("#error_SubQuetionId6").html("");
                        }

                    }

                    if ($("#QuestionId7").val() == 'Y') {
                        if ($("#SubQuetionId8").val() == "") {
                            $("#dvSubQuetionId8").addClass('Error');
                            is_valid = 1;
                            //$("#error_SubQuetionId8").html("Please Enter Details.");
                        } else {
                            $("#dvSubQuetionId8").removeClass('Error');
                            $("#error_SubQuetionId8").html("");
                        }

                    }

                    if ($("#QuestionId11").val() == 'Y') {
                        if ($("#TobaccoConsumeAs").val() == "" || $("#TobaccoConsumeAs").val() == 0 || $("#TobaccoConsumeAs").val() == null) {
                            $("#TobaccoConsumeAs").addClass('Error');
                            is_valid = 1;
                            $("#error_TobaccoConsumeAs").html("Please Select Option.");
                        } else {
                            $("#dvTobaccoConsumeAs").removeClass('Error');
                            $("#error_TobaccoConsumeAs").html("");
                        }


                        if ($("#TobaccoQuantity").val() == "" || $("#TobaccoQuantity").val() == 0 || $("#TobaccoQuantity").val() == null) {
                            $("#dvTobaccoQuantity").addClass('Error');
                            is_valid = 1;
                           // $("#error_TobaccoQuantity").html("Please Select Option.");
                        } else {
                            $("#dvTobaccoQuantity").removeClass('Error');
                            $("#error_TobaccoQuantity").html("");
                        }


                        if ($("#TobaccoYears").val() == "" || $("#TobaccoYears").val() == 0) {
                            $("#dvTobaccoYears").addClass('Error');
                            is_valid = 1;
                            //$("#error_TobaccoYears").html("Please Enter Years.");
                        } else {
                            $("#dvTobaccoYears").removeClass('Error');
                            $("#error_TobaccoYears").html("");
                        }


                        //if ($("#StopConsumptionYearMonth").val() == "" || $("#StopConsumptionYearMonth").val() == 0) {
                        //    $("#dvStopConsumptionYearMonth").addClass('Error');
                        //    is_valid = 1;
                        //    $("#error_StopConsumptionYearMonth").html("Please Select Date.");
                        //} else {
                        //    $("#dvStopConsumptionYearMonth").removeClass('Error');
                        //    $("#error_StopConsumptionYearMonth").html("");
                        //}
                    }
                    //else {
                    //    $("#error_QuestionId11").html("");
                    //    is_valid = 0;
                    //}

                    if ($("#QuestionId9").val() == 'Y') {
                        if ($("#AlcoholConsumeAs").val() == "" || $("#AlcoholConsumeAs").val() == 0 || $("#AlcoholConsumeAs").val() == null) {
                            $("#AlcoholConsumeAs").addClass('Error');
                            is_valid = 1;
                            $("#error_AlcoholConsumeAs").html("Please Select Option.");
                        } else {
                            $("#dvAlcoholConsumeAs").removeClass('Error');
                            $("#error_AlcoholConsumeAs").html("");
                        }


                        if ($("#AlcoholQuantity").val() == "" || $("#AlcoholQuantity").val() == 0 || $("#AlcoholQuantity").val() == null) {
                            $("#dvAlcoholQuantity").addClass('Error');
                            is_valid = 1;
                           // $("#error_AlcoholQuantity").html("Please Select Option.");
                        } else {
                            $("#dvAlcoholQuantity").removeClass('Error');
                            $("#error_AlcoholQuantity").html("");
                        }


                        if ($("#AlcoholYears").val() == "" || $("#AlcoholYears").val() == 0) {
                            $("#dvAlcoholYears").addClass('Error');
                            is_valid = 1;
                            //$("#error_AlcoholYears").html("Please Enter Years.");
                        } else {
                            $("#dvAlcoholYears").removeClass('Error');
                            $("#error_AlcoholYears").html("");
                        }


                        //if ($("#AlcoholStopConsumptionYearMonth").val() == "" || $("#AlcoholStopConsumptionYearMonth").val() == 0) {
                        //    $("#dvAlcoholStopConsumptionYearMonth").addClass('Error');
                        //    is_valid = 1;
                        //    $("#error_AlcoholStopConsumptionYearMonth").html("Please Select Date.");
                        //} else {
                        //    $("#dvAlcoholStopConsumptionYearMonth").removeClass('Error');
                        //    $("#error_AlcoholStopConsumptionYearMonth").html("");
                        //}
                    }
                    //else {
                    //    $("#error_QuestionId9").html("");
                    //    is_valid = 0;
                    //}

                    if ($("#QuestionId15").val() == 'Y') {
                        if ($("#NarcoticsConsumeAs").val() == "" || $("#NarcoticsConsumeAs").val() == 0 || $("#NarcoticsConsumeAs").val() == null) {
                            $("#NarcoticsConsumeAs").addClass('Error');
                            is_valid = 1;
                            $("#error_NarcoticsConsumeAs").html("Please Select Option.");
                        } else {
                            $("#dvNarcoticsConsumeAs").removeClass('Error');
                            $("#error_NarcoticsConsumeAs").html("");
                        }


                        if ($("#NarcoticsQuantity").val() == "" || $("#NarcoticsQuantity").val() == 0 || $("#NarcoticsQuantity").val() == null) {
                            $("#dvNarcoticsQuantity").addClass('Error');
                            is_valid = 1;
                           // $("#error_NarcoticsQuantity").html("Please Select Option.");
                        } else {
                            $("#dvNarcoticsQuantity").removeClass('Error');
                            $("#error_NarcoticsQuantity").html("");
                        }


                        if ($("#NarcoticsYears").val() == "" || $("#NarcoticsYears").val() == 0) {
                            $("#dvNarcoticsYears").addClass('Error');
                            is_valid = 1;
                           // $("#error_NarcoticsYears").html("Please Enter Years.");
                        } else {
                            $("#dvNarcoticsYears").removeClass('Error');
                            $("#error_NarcoticsYears").html("");
                        }


                        //if ($("#NarcoticsStopConsumptionYearMonth").val() == "" || $("#NarcoticsStopConsumptionYearMonth").val() == 0) {
                        //    $("#dvNarcoticsDOB").addClass('Error');
                        //    is_valid = 1;
                        //    $("#error_NarcoticsStopConsumptionYearMonth").html("Please Select Date.");
                        //} else {
                        //    $("#dvNarcoticsDOB").removeClass('Error');
                        //    $("#error_NarcoticsStopConsumptionYearMonth").html("");
                        //}
                    }
                    //else {
                    //    $("#error_QuestionId15").html("");
                    //    is_valid = 0;
                    //}

                }
                //if ($("#" + LifeStyleQuestion[i]).val() == "Y") {
                //    $("#" + LifeStyleQuestion[i] + "Y").addClass('active');
                //    $("#" + LifeStyleQuestion[i] + "N").removeClass('active');
                //} else if ($("#" + LifeStyleQuestion[i]).val() == "N") {
                //    $("#" + LifeStyleQuestion[i] + "N").addClass('active');
                //    $("#" + LifeStyleQuestion[i] + "Y").removeClass('active');
                //}

                //if ($("#QuestionId11").val() == 'Y') {
                //    $("#TobacoConsume").show();
                //} else {
                //    $("#TobacoConsume").hide();
                //}



                //if ($("#QuestionId9").val() == 'Y') {
                //    $("#AlcoholConsume").show();
                //} else {
                //    $("#AlcoholConsume").hide();
                //}

                //if ($("#QuestionId15").val() == 'Y') {
                //    $("#NarcoticsConsume").show();
                //} else {
                //    $("#NarcoticsConsume").hide();
                //}

                //if ($("#QuestionId2").val() == "Y") {
                //    $("#subquetion3").show();
                //    $("#subquetion4").show();
                //} else {
                //    $("#subquetion3").hide();
                //    $("#subquetion4").hide();
                //}

                //if ($("#QuestionId5").val() == "Y") {
                //    $("#subquetion6").show();
                //} else {
                //    $("#subquetion6").hide();
                //}

                //if ($("#QuestionId7").val() == "Y") {
                //    $("#subquetion8").show();
                //} else {
                //    $("#subquetion8").hide();
                //}
            }
        }

        //for (var i = 0; i < MedicalQuestion.length; i++) {
        //    MedicalQuestion[i];
        //    if ($("#" + MedicalQuestion[i]).val() != "" || $("#" + MedicalQuestion[i]).val() != null) {
        //        for (var j = i; j <= i; j++) {
        //            if ($("#" + MedicalQuestion[i]).val() == "") {
        //                $("#dv" + MedicalQuestion[i]).addClass('active');
        //                is_valid = 1;
        //                $("#error_" + MedicalQuestion[i]).html("Please Select Option.");
        //            } else {
        //                $("#dv" + MedicalQuestion[i]).removeClass('active');
        //                $("#error_" + MedicalQuestion[i]).html("");
        //                if ($("#" + MedicalQuestion[i]).val() == "Y") {

        //                    if ($("#" + SubMedicalQuestion[j]).val() == "") {
        //                        $("#dv" + SubMedicalQuestion[j]).addClass('active');
        //                        is_valid = 1;
        //                        $("#error_" + SubMedicalQuestion[j]).html("Please Enter Details.");
        //                    } else {
        //                        $("#dv" + SubMedicalQuestion[j]).removeClass('active');
        //                        $("#error_" + SubMedicalQuestion[j]).html("");
        //                    }

        //                }

        //            }
        //        }
        //    }
        //}

        //if ($("#PMH").val() == '') {
        //    $('#divPMH').addClass('Error'); is_valid = 1;
        //    $("#error_PMH").html("Please Select Yes/No.");
        //}
        //else {
        //    $("#error_PMH").html("");
        //    $('#divPMH').removeClass('Error');
        //}


        if (is_valid < 1) { return true; }
        else { return false; }
    }

    else if (Opt == 12) {


        if ($CKYCOccupationType.val() == '' || $CKYCOccupationType.val() == null) {

            $('#CKYCOccupationType').addClass('Error'); is_valid = 1;
            $("#error_CKYCOccupationType").html("Please Select Occupation Type.");
        }
        else {

            if ($CKYCOccupationType.val() == 'OCCT_SALR') {
                if ($CKYCOccupationalDetails.val() == '' || $CKYCOccupationalDetails.val() == null) {
                    $('#CKYCOccupationalDetails').addClass('Error'); is_valid = 1;
                    $("#error_CKYCOccupationalDetails").html("Please Select Occupation Type.");
                }
                else {
                    $("#error_CKYCOccupationalDetails").html("");
                    $('#CKYCOccupationalDetails').removeClass('Error');
                }
            }
            else {
                $("#error_CKYCOccupationType").html("");
                $('#CKYCOccupationType').removeClass('Error');
            }
        }

        if ($CKYCFatherTitle.val() == '' || $CKYCFatherTitle.val() == null) {
            $('#CKYCFatherTitle').addClass('Error'); is_valid = 1;
            $("#error_CKYCFatherTitle").html("Please Select Title");
        }
        else {
            $("#error_CKYCFatherTitle").html("");
            $('#CKYCFatherTitle').removeClass('Error');
        }

        if ($CKYCFatherFirstName.val() == "" || checkText($CKYCFatherFirstName) == false) {

            $('#dvCKYCFatherFirstName').addClass('Error'); is_valid = 1;
            $("#error_CKYCFatherFirstName").html("Please Enter Father First Name");
        }
        else {
            $("#error_CKYCFatherFirstName").html("");
            $('#dvCKYCFatherFirstName').removeClass('Error');
        }

        //if ($CKYCFatherMiddleName.val() == "" || checkText($CKYCFatherMiddleName) == false) {
        //     $('#dvCKYCFatherMiddleName').addClass('Error'); is_valid = 1;
        //    $("#error_CKYCFatherMiddleName").html("Please Enter Middle Name");
        //}
        //else {
        //    $("#error_CKYCFatherMiddleName").html("");
        //    $('#dvCKYCFatherMiddleName').removeClass('Error');
        //}

        if ($CKYCFatherLastName.val() == "" || checkText($CKYCFatherLastName) == false) {
            $('#dvCKYCFatherLastName').addClass('Error'); is_valid = 1;
            $("#error_CKYCFatherLastName").html("Please Enter Father Last Name");
        }
        else {
            $("#error_CKYCFatherLastName").html("");
            $('#dvCKYCFatherLastName').removeClass('Error');
        }

        if ($CKYCMotherTitle.val() == '' || $CKYCMotherTitle.val() == null) {
            $('#CKYCMotherTitle').addClass('Error'); is_valid = 1;
            $("#error_CKYCMotherTitle").html("Please Select Title");
        }
        else {
            $("#error_CKYCMotherTitle").html("");
            $('#CKYCMotherTitle').removeClass('Error');
        }

        if ($CKYCMotherFirstName.val() == "" || checkText($CKYCMotherFirstName) == false) {
            $('#dvCKYCMotherFirstName').addClass('Error'); is_valid = 1;
            $("#error_CKYCMotherFirstName").html("Please Enter Mother First Name");
        }
        else {
            $("#error_CKYCMotherFirstName").html("");
            $('#dvCKYCMotherFirstName').removeClass('Error');
        }

        //if ($CKYCMotherMiddleName.val() == "" || checkText($CKYCMotherMiddleName) == false) {

        //    $('#dvCKYCMotherMiddleName').addClass('error'); is_valid = 1;
        //    $("#error_CKYCMotherMiddleName").html("Please Enter Middle Name");
        //}
        //else {
        //    $("#error_CKYCMotherMiddleName").html("");
        //    $('#dvCKYCMotherMiddleName').removeClass('error');
        //}

        if ($CKYCMotherLastName.val() == "" || checkText($CKYCMotherLastName) == false) {
            $('#dvCKYCMotherLastName').addClass('Error'); is_valid = 1;
            $("#error_CKYCMotherLastName").html("Please Enter Mother Last Name");
        }
        else {
            $("#error_CKYCMotherLastName").html("");
            $('#dvCKYCMotherLastName').removeClass('Error');
        }

        if ($("#InsuredMaritalStatus").val() == "MAR_MRD" || $("#InsuredMaritalStatus").val() == null) {

            if ($CKYCSpouseTitle.val() == '' || $CKYCSpouseTitle.val() == null) {
                $('#CKYCSpouseTitle').addClass('Error'); is_valid = 1;
                $("#error_CKYCSpouseTitle").html("Please Select Title");
            }
            else {
                $("#error_CKYCSpouseTitle").html("");
                $('#CKYCSpouseTitle').removeClass('Error');
            }

            if ($CKYCSpouseFirstName.val() == "" || checkText($CKYCSpouseFirstName) == false) {
                $('#dvCKYCSpouseFirstName').addClass('Error'); is_valid = 1;
                $("#error_CKYCSpouseFirstName").html("Please Enter Spouse First Name");
            }
            else {
                $("#error_CKYCSpouseFirstName").html("");
                $('#dvCKYCSpouseFirstName').removeClass('Error');
            }

            //if ($CKYCSpouseMiddleName.val() == "" || checkText($CKYCSpouseMiddleName) == false) {
            //     $('#dvCKYCSpouseMiddleName').addClass('Error'); is_valid = 1;
            //    $("#error_CKYCSpouseMiddleName").html("Please Enter Middle Name");
            //}
            //else {
            //    $("#error_CKYCSpouseMiddleName").html("");
            //    $('#dvCKYCSpouseMiddleName').removeClass('Error');
            //}

            if ($CKYCSpouseLastName.val() == "" || checkText($CKYCSpouseLastName) == false) {
                $('#dvCKYCSpouseLastName').addClass('Error'); is_valid = 1;
                $("#error_CKYCSpouseLastName").html("Please Enter Spouse Last Name");
            }
            else {
                $("#error_CKYCSpouseLastName").html("");
                $('#dvCKYCSpouseLastName').removeClass('Error');
            }
        }

        //if ($CKYCSpouseTitle.val() == '') { $('#CKYCSpouseTitle').addClass('Error'); is_valid = 1; }
        //else { $('#CKYCSpouseTitle').removeClass('Error'); }

        //if ($CKYCSpouseFirstName.val() == "" || checkText($CKYCSpouseFirstName) == false) {  $('#dvCKYCSpouseFirstName').addClass('Error'); is_valid = 1; }
        //else { $('#dvCKYCSpouseFirstName').removeClass('Error'); }

        //if ($CKYCSpouseMiddleName.val() == "" || checkText($CKYCSpouseMiddleName) == false) {  $('#dvCKYCSpouseMiddleName').addClass('Error'); is_valid = 1; }
        //else { $('#dvCKYCSpouseMiddleName').removeClass('Error'); }

        //if ($CKYCSpouseLastName.val() == "" || checkText($CKYCSpouseLastName) == false) {  $('#dvCKYCSpouseLastName').addClass('Error'); is_valid = 1; }
        //else { $('#dvCKYCSpouseLastName').removeClass('Error'); }

        if ($CKYCOccupationType.val() == '' || $CKYCOccupationType.val() == null) {

            $('#CKYCOccupationType').addClass('Error'); is_valid = 1;
            $("#error_CKYCOccupationType").html("Please Select Occupation");
        }
        else {
            $("#error_CKYCOccupationType").html("");
            $('#CKYCOccupationType').removeClass('Error');
        }

        if ($CKYCCountryOfBirth.val() == '') {
            $('#dvCKYCCountryOfBirth').addClass('Error'); is_valid = 1;
            $("#error_CKYCCountryOfBirth").html("Please Enter Country.");
        }
        else {
            $("#error_CKYCCountryOfBirth").html("");
            $('#dvCKYCCountryOfBirth').removeClass('Error');
        }

        if (is_valid == 0) {
            $("#FinalSubmit").val("1");
            return true;
        }
        else { return false; }

    }
    else if (Opt == 16) {

        if ($("#HighBloodPressure").val() == "true") {

            if ($BloodPressureFirstRoundDate.val() == '') {
                $('#dvBloodPressureFirstRoundDate').addClass('Error'); is_valid = 1;
                $("#error_BloodPressureFirstRoundDate").html("Please Select Date.");
            }
            else {
                $("#error_BloodPressureFirstRoundDate").html("");
                $('#dvBloodPressureFirstRoundDate').removeClass('Error');
            }

            if ($BPLevel.val() == 0 || $BPLevel.val() == "0" || $("#BPLevel").val() == "0") {
                $('#dvBPLevel').addClass('Error'); is_valid = 1;
                //$("#error_BPLevel").html("Please Enter BP Level.");
            }
            else {
                $("#error_BPLevel").html("");
                $('#dvBPLevel').removeClass('Error');
            }


            if ($NameOfHyperTensionDoctor.val() == "") {
                $('#dvNameOfHyperTensionDoctor').addClass('Error'); is_valid = 1;
                $("#error_NameOfHyperTensionDoctor").html("Please Enter Name Of Doctor");
            }
            else {
                $("#error_NameOfHyperTensionDoctor").html("");
                $('#dvNameOfHyperTensionDoctor').removeClass('Error');
            }


            if ($NameAndAddressOfClinicDoctor.val() == "") {
                $('#dvNameAndAddressOfClinicDoctor').addClass('Error'); is_valid = 1;
               // $("#error_NameAndAddressOfClinicDoctor").html("Please Enter Name & Address Of Doctor");
            }
            else {
                $("#error_NameAndAddressOfClinicDoctor").html("");
                $('#dvNameAndAddressOfClinicDoctor').removeClass('Error');
            }

            if ($follow_upWithDoctor.val() == "") {
                $('#dvfollow_upWithDoctor').addClass('Error'); is_valid = 1;
               // $("#error_follow_upWithDoctor").html("Please Enter Details");
            }
            else {
                $("#error_follow_upWithDoctor").html("");
                $('#dvfollow_upWithDoctor').removeClass('Error');
            }


            if ($ConsiderSecondary.val() == "") {
                // $('#dvConsiderSecondary').addClass('Error');
                is_valid = 1;
                $("#error_ConsiderSecondary").html("Please Select Option");
            }
            else {
                $("#error_ConsiderSecondary").html("");
                $('#dvConsiderSecondary').removeClass('Error');
                if ($ConsiderSecondary.val() == "Yes" || $ConsiderSecondary.val() == "Y") {

                    if ($ConsiderSecondarydtl.val() == "") {
                        $('#dvConsiderSecondarydtl').addClass('Error'); is_valid = 1;
                       // $("#error_ConsiderSecondarydtl").html("Please Enter Details");
                    }
                    else {
                        $("#error_ConsiderSecondarydtl").html("");
                        $('#dvConsiderSecondarydtl').removeClass('Error');
                    }
                }

            }


            if ($complications.val() == "") {
                // $('#dvcomplications').addClass('Error'); 
                is_valid = 1;
                $("#error_complications").html("Please Select Option");
            }
            else {
                $("#error_complications").html("");
                $('#dvcomplications').removeClass('Error');
                if ($complications.val() == "Yes" || $complications.val() == "Y") {

                    if ($complicationsdtl.val() == "") {
                        $('#dvcomplicationsdtl').addClass('Error'); is_valid = 1;
                       // $("#error_complicationsdtl").html("Please Enter Details");
                    }
                    else {
                        $("#error_complicationsdtl").html("");
                        $('#dvcomplicationsdtl').removeClass('Error');
                    }
                }
            }


            if ($AreYouOnTreatementNow.val() == "") {
                // $('#dvAreYouOnTreatementNow').addClass('Error'); 
                is_valid = 1;
                $("#error_AreYouOnTreatementNow").html("Please Select Option");
            }
            else {
                $("#error_AreYouOnTreatementNow").html("");
                $('#dvAreYouOnTreatementNow').removeClass('Error');
                if ($AreYouOnTreatementNow.val() == "Yes" || $AreYouOnTreatementNow.val() == "Y") {

                    if ($AreYouOnTreatementNowDtl.val() == "") {
                        $('#dvAreYouOnTreatementNowDtl').addClass('Error'); is_valid = 1;
                        $("#error_AreYouOnTreatementNowDtl").html("Please Select Date");
                    }
                    else {
                        $("#error_AreYouOnTreatementNowDtl").html("");
                        $('#dvAreYouOnTreatementNowDtl').removeClass('Error');
                    }
                }
            }


            if ($FollowupFail.val() == "") {
                // $('#dvFollowupFail').addClass('Error'); 
                is_valid = 1;
                $("#error_FollowupFail").html("Please Select Option");
            }
            else {
                $("#error_FollowupFail").html("");
                $('#dvFollowupFail').removeClass('Error');
                if ($FollowupFail.val() == "Yes" || $FollowupFail.val() == "Y") {

                    if ($FollowupFaildtl.val() == "") {
                        $('#dvFollowupFaildtl').addClass('Error'); is_valid = 1;
                       // $("#error_FollowupFaildtl").html("Please Enter Deatils.");
                    }
                    else {
                        $("#error_FollowupFaildtl").html("");
                        $('#dvFollowupFaildtl').removeClass('Error');
                    }
                }
            }


            if ($AreYouOnTreatement.val() == "") {
                //  $('#dvAreYouOnTreatement').addClass('Error'); 
                is_valid = 1;
                $("#error_AreYouOnTreatement").html("Please Select Option");
            }
            else {
                $("#error_AreYouOnTreatement").html("");
                $('#dvAreYouOnTreatement').removeClass('Error');
                if ($AreYouOnTreatement.val() == "Yes" || $AreYouOnTreatement.val() == "Y") {

                    if ($AreYouOnTreatementdtl.val() == "") {
                        $('#dvAreYouOnTreatementdtl').addClass('Error'); is_valid = 1;
                        //$("#error_AreYouOnTreatementdtl").html("Please Enter Deatils.");
                    }
                    else {
                        $("#error_AreYouOnTreatementdtl").html("");
                        $('#dvAreYouOnTreatementdtl').removeClass('Error');
                    }
                }
            }
            if ($AreYouUndergoneAnyInvestigation.val() == "") {
                // $('#dvAreYouUndergoneAnyInvestigation').addClass('Error'); 
                is_valid = 1;
                $("#error_AreYouUndergoneAnyInvestigation").html("Please Select Option");
            }
            else {
                $("#error_AreYouUndergoneAnyInvestigation").html("");
                $('#dvAreYouUndergoneAnyInvestigation').removeClass('Error');
                if ($AreYouUndergoneAnyInvestigation.val() == "Yes" || $AreYouUndergoneAnyInvestigation.val() == "Y") {
                    if ($TypesOfInvestigation.val() == "") {
                        $('#dvTypesOfInvestigation').addClass('Error'); is_valid = 1;
                       // $("#error_TypesOfInvestigation").html("Please Enter Deatils.");
                    }
                    else {
                        $("#error_TypesOfInvestigation").html("");
                        $('#dvTypesOfInvestigation').removeClass('Error');
                    }

                    if ($ResultOfInvestigation.val() == "") {
                        $('#dvResultOfInvestigation').addClass('Error'); is_valid = 1;
                        //$("#error_ResultOfInvestigation").html("Please Enter Deatils.");
                    }
                    else {
                        $("#error_ResultOfInvestigation").html("");
                        $('#dvResultOfInvestigation').removeClass('Error');
                    }
                }
            }
            if ($BPReadingDate.val() == "") {
                $('#dvBPReadingDate').addClass('Error'); is_valid = 1;
                $("#error_BPReadingDate").html("Please Select Date.");
            }
            else {
                $("#error_BPReadingDate").html("");
                $('#dvBPReadingDate').removeClass('Error');
            }

            if ($BPReading.val() == 0) {
                $('#dvBPReading').addClass('Error'); is_valid = 1;
               // $("#error_BPReading").html("Please Enter BP Reading.");
            }
            else {
                $("#error_BPReading").html("");
                $('#dvBPReading').removeClass('Error');
            }

            if ($Past12MonthBPReadingDate.val() == "") {
                $('#dvPast12MonthBPReadingDate').addClass('Error'); is_valid = 1;
                $("#error_Past12MonthBPReadingDate").html("Please Select Date.");
            }
            else {
                $("#error_Past12MonthBPReadingDate").html("");
                $('#dvPast12MonthBPReadingDate').removeClass('Error');
            }

            if ($Past12MonthBPReading.val() == 0) {
                $('#dvPast12MonthBPReading').addClass('Error'); is_valid = 1;
                //$("#error_Past12MonthBPReading").html("Please Enter BP Reading.");
            }
            else {
                $("#error_Past12MonthBPReading").html("");
                $('#dvPast12MonthBPReading').removeClass('Error');
            }

            if ($IsYourBPNormal.val() == "") {
                //$('#dvIsYourBPNormal').addClass('Error'); 
                is_valid = 1;
                $("#error_IsYourBPNormal").html("Please Select Option");
            }
            else {
                $("#error_IsYourBPNormal").html("");
                $('#dvIsYourBPNormal').removeClass('Error');
            }


            if ($IsAnyAbnormalities.val() == "") {
                //$('#dvIsAnyAbnormalities').addClass('Error'); 
                is_valid = 1;
                $("#error_IsAnyAbnormalities").html("Please Select Option");
            }
            else {
                $("#error_IsAnyAbnormalities").html("");
                $('#dvIsAnyAbnormalities').removeClass('Error');
                if ($IsAnyAbnormalities.val() == "Yes" || $IsAnyAbnormalities.val() == "Y") {

                    if ($IsAnyAbnormalitiesdtl.val() == "") {
                        $('#dvIsAnyAbnormalitiesdtl').addClass('Error'); is_valid = 1;
                       // $("#error_IsAnyAbnormalitiesdtl1").html("Please Enter Deatils.");
                    }
                    else {
                        $("#error_IsAnyAbnormalitiesdtl1").html("");
                        $('#dvIsAnyAbnormalitiesdtl').removeClass('Error');
                    }
                }
            }


            if ($HaveYouLostSignificant.val() == "") {
                // $('#dvHaveYouLostSignificant').addClass('Error'); 
                is_valid = 1;
                $("#error_HaveYouLostSignificant").html("Please Select Option");
            }
            else {
                $("#error_HaveYouLostSignificant").html("");
                $('#dvHaveYouLostSignificant').removeClass('Error');
                if ($HaveYouLostSignificant.val() == "Yes" || $HaveYouLostSignificant.val() == "Y") {

                    if ($HaveYouLostSignificantdtl.val() == "") {
                        $('#dvHaveYouLostSignificantdtl').addClass('Error'); is_valid = 1;
                        //$("#error_HaveYouLostSignificantdtl").html("Please Enter Deatils.");
                    }
                    else {
                        $("#error_HaveYouLostSignificantdtl").html("");
                        $('#dvHaveYouLostSignificantdtl').removeClass('Error');
                    }
                }
            }

            if ($NormalOrRaise.val() == "" || $NormalOrRaise.val() == "0") {
                $('#divIsAnyAbnormalitiesdtl').addClass('Error'); is_valid = 1;
               // $("#error_IsAnyAbnormalitiesdtl").html("Please Enter Deatils.");
            }
            else {
                $("#error_IsAnyAbnormalitiesdtl").html("");
                $('#divIsAnyAbnormalitiesdtl').removeClass('Error');
            }

        }

        if (is_valid == 0) { return true; }
        else { return false; }
    }
    else if (Opt == 17) {

        if ($("#Diabetes").prop('checked') == true) {

            if ($DateOfFirstDignosis.val() == "") {
                $('#dvDateOfFirstDignosis').addClass('Error'); is_valid = 1;
                $("#error_DateOfFirstDignosis").html("Please Select Date.");
            }
            else {
                $("#error_DateOfFirstDignosis").html("");
                $('#dvDateOfFirstDignosis').removeClass('Error');
            }

            if ($NameOfDiabetesDoctor.val() == "") {
                $('#dvNameOfDiabetesDoctor').addClass('Error'); is_valid = 1;
              //  $("#error_NameOfDiabetesDoctor").html("Please Enter Deatils.");
            }
            else {
                $("#error_NameOfDiabetesDoctor").html("");
                $('#dvNameOfDiabetesDoctor').removeClass('Error');
            }

            if ($DateOfLastAttendedDoctor.val() == "") {
                $('#dvDateOfLastAttendedDoctor').addClass('Error'); is_valid = 1;
                $("#error_DateOfLastAttendedDoctor").html("Please Select Date.");
            }
            else {
                $("#error_DateOfLastAttendedDoctor").html("");
                $('#dvDateOfLastAttendedDoctor').removeClass('Error');
            }


            if ($DoYouStillReceivedTreatement.val() == "") {
                // $('#dvHaveYouLostSignificant').addClass('Error'); 
                is_valid = 1;
                $("#error_DoYouStillReceivedTreatement").html("Please Select Option");
            }
            else {
                $("#error_DoYouStillReceivedTreatement").html("");
                $('#dvDoYouStillReceivedTreatement').removeClass('Error');
                if ($DoYouStillReceivedTreatement.val() == "No") {

                    if ($DoYouStillReceivedTreatementdtl.val() == "") {
                        $('#dvDoYouStillReceivedTreatementdtl').addClass('Error'); is_valid = 1;
                        $("#error_DoYouStillReceivedTreatementdtl").html("Please Enter Deatils.");
                    }
                    else {
                        $("#error_DoYouStillReceivedTreatementdtl").html("");
                        $('#dvDoYouStillReceivedTreatementdtl').removeClass('Error');
                    }
                }
            }

            if ($DoYouUseInsulinInjection.val() == "") {
                // $('#dvHaveYouLostSignificant').addClass('Error'); 
                is_valid = 1;
                $("#error_DoYouUseInsulinInjection").html("Please Select Option");
            }
            else {
                $("#error_DoYouUseInsulinInjection").html("");
                $('#dvDoYouUseInsulinInjection').removeClass('Error');
                if ($DoYouUseInsulinInjection.val() == "Yes" || $DoYouUseInsulinInjection.val() == "Y") {

                    if ($InjectionPerDay.val() == "" || $InjectionPerDay.val() == null) {
                        $('#InjectionPerDay').addClass('Error'); is_valid = 1;
                        $("#error_InjectionPerDay").html("Please Select Option.");
                    }
                    else {
                        $("#error_InjectionPerDay").html("");
                        $('#dvInjectionPerDay').removeClass('Error');
                    }

                    if ($UnitsPerDay.val() == "" || $UnitsPerDay.val() == null) {
                        $('#UnitsPerDay').addClass('Error'); is_valid = 1;
                        $("#error_UnitsPerDay").html("Please Select Option.");
                    }
                    else {
                        $("#error_UnitsPerDay").html("");
                        $('#UnitsPerDay').removeClass('Error');
                    }
                }
            }

            if ($DoYouTakeOralMedication.val() == "") {
                // $('#dvHaveYouLostSignificant').addClass('Error'); 
                is_valid = 1;
                $("#error_DoYouTakeOralMedication").html("Please Select Option");
            }
            else {
                $("#error_DoYouTakeOralMedication").html("");
                $('#dvDoYouTakeOralMedication').removeClass('Error');
                if ($DoYouTakeOralMedication.val() == "Yes" || $DoYouTakeOralMedication.val() == "Y") {

                    if ($NameOfTabletordose.val() == "") {
                        $('#dvNameOfTabletordose').addClass('Error'); is_valid = 1;
                       // $("#error_NameOfTabletordose").html("Please Enter Deatils.");
                    }
                    else {
                        $("#error_NameOfTabletordose").html("");
                        $('#dvNameOfTabletordose').removeClass('Error');
                    }
                }
            }

            if ($DoYouUndergoTest.val() == "") {
                // $('#dvHaveYouLostSignificant').addClass('Error'); 
                is_valid = 1;
                $("#error_DoYouUndergoTest").html("Please Select Option");
            }
            else {
                $("#error_DoYouUndergoTest").html("");
                $('#dvDoYouUndergoTest').removeClass('Error');
                if ($DoYouUndergoTest.val() == "Yes" || $DoYouUndergoTest.val() == "Y") {

                    if ($DoYouUndergoTestdtl.val() == 0) {
                        $('#dvDoYouUndergoTestdtl').addClass('Error'); is_valid = 1;
                       // $("#error_DoYouUndergoTestdtl").html("Please Enter Deatils.");
                    }
                    else {
                        $("#error_DoYouUndergoTestdtl").html("");
                        $('#dvDoYouUndergoTestdtl').removeClass('Error');
                    }
                }
            }

            if ($EyeProblemRelatedToDiabetes.val() == "") {
                // $('#dvHaveYouLostSignificant').addClass('Error'); 
                is_valid = 1;
                $("#error_EyeProblemRelatedToDiabetes").html("Please Select Option");
            }
            else {
                $("#error_EyeProblemRelatedToDiabetes").html("");
                $('#dvEyeProblemRelatedToDiabetes').removeClass('Error');
            }

            if ($KidneyOrUrineDisease.val() == "") {
                // $('#dvHaveYouLostSignificant').addClass('Error'); 
                is_valid = 1;
                $("#error_KidneyOrUrineDisease").html("Please Select Option");
            }
            else {
                $("#error_KidneyOrUrineDisease").html("");
                $('#dvKidneyOrUrineDisease').removeClass('Error');
            }

            if ($NerveDisorder.val() == "") {
                // $('#dvHaveYouLostSignificant').addClass('Error'); 
                is_valid = 1;
                $("#error_NerveDisorder").html("Please Select Option");
            }
            else {
                $("#error_NerveDisorder").html("");
                $('#dvNerveDisorder').removeClass('Error');
            }

            if ($HighCholestrol.val() == "") {
                // $('#dvHaveYouLostSignificant').addClass('Error'); 
                is_valid = 1;
                $("#error_HighCholestrol").html("Please Select Option");
            }
            else {
                $("#error_HighCholestrol").html("");
                $('#dvHighCholestrol').removeClass('Error');
            }

            if ($NonHealingUlcers.val() == "") {
                // $('#dvHaveYouLostSignificant').addClass('Error'); 
                is_valid = 1;
                $("#error_NonHealingUlcers").html("Please Select Option");
            }
            else {
                $("#error_NonHealingUlcers").html("");
                $('#dvNonHealingUlcers').removeClass('Error');
            }

            if ($NonHealingUlcers.val() == "") {
                // $('#dvHaveYouLostSignificant').addClass('Error'); 
                is_valid = 1;
                $("#error_NonHealingUlcers").html("Please Select Option");
            }
            else {
                $("#error_NonHealingUlcers").html("");
                $('#dvNonHealingUlcers').removeClass('Error');
            }


            if ($HighBloodPressure.val() == "") {
                // $('#dvHaveYouLostSignificant').addClass('Error'); 
                is_valid = 1;
                $("#error_HighBloodPressure").html("Please Select Option");
            }
            else {
                $("#error_HighBloodPressure").html("");
                $('#dvHighBloodPressure').removeClass('Error');
            }


            if ($HeartCondition.val() == "") {
                // $('#dvHaveYouLostSignificant').addClass('Error'); 
                is_valid = 1;
                $("#error_HeartCondition").html("Please Select Option");
            }
            else {
                $("#error_HeartCondition").html("");
                $('#dvHeartCondition').removeClass('Error');
            }


            if ($HaveYouBeenHospitalized.val() == "") {
                // $('#dvHaveYouLostSignificant').addClass('Error'); 
                is_valid = 1;
                $("#error_HaveYouBeenHospitalized").html("Please Select Option");
            }
            else {
                $("#error_HaveYouBeenHospitalized").html("");
                $('#dvHaveYouBeenHospitalized').removeClass('Error');
                if ($HaveYouBeenHospitalized.val() == "Yes" || $HaveYouBeenHospitalized.val() == "Y") {

                    if ($HaveYouBeenHospitalizeddtl.val() == "") {
                        $('#dvHaveYouBeenHospitalizeddtl').addClass('Error'); is_valid = 1;
                       // $("#error_HaveYouBeenHospitalizeddtl").html("Please Enter Deatils.");
                    }
                    else {
                        $("#error_HaveYouBeenHospitalizeddtl").html("");
                        $('#dvHaveYouBeenHospitalizeddtl').removeClass('Error');
                    }
                }
            }

            if ($HospitalizedForDibetesCntrol.val() == "") {
                // $('#dvHaveYouLostSignificant').addClass('Error'); 
                is_valid = 1;
                $("#error_HospitalizedForDibetesCntrol").html("Please Select Option");
            }
            else {
                $("#error_HospitalizedForDibetesCntrol").html("");
                $('#dvHospitalizedForDibetesCntrol').removeClass('Error');
                if ($HospitalizedForDibetesCntrol.val() == "Yes" || $HospitalizedForDibetesCntrol.val() == "Y") {

                    if ($HospitalizedForDibetesCntroldtl.val() == "") {
                        $('#dvHospitalizedForDibetesCntroldtl').addClass('Error'); is_valid = 1;
                        //$("#error_HospitalizedForDibetesCntroldtl").html("Please Enter Deatils.");
                    }
                    else {
                        $("#error_HospitalizedForDibetesCntroldtl").html("");
                        $('#dvHospitalizedForDibetesCntroldtl').removeClass('Error');
                    }
                }
            }
        }
        if (is_valid == 0) { return true; }
        else { return false; }

    }
    else if (Opt == 18) {

        if ($("#QuestionId1").val() == "Y") {

            if ($BranchOfArmedServices.val() == "" || $BranchOfArmedServices.val() == null) {
                $('#BranchOfArmedServices').addClass('Error'); is_valid = 1;
                $("#error_BranchOfArmedServices").html("Please Enter Deatils.");
            }
            else {
                $("#error_BranchOfArmedServices").html("");
                $('#BranchOfArmedServices').removeClass('Error');
                if ($BranchOfArmedServices.val() == "Others") {
                    if ($BranchOfArmedServicesOtherstxt.val() == "" || $BranchOfArmedServicesOtherstxt.val() == null) {
                        $('#dvBranchOfArmedServicesOtherstxt').addClass('Error'); is_valid = 1;
                        //$("#error_BranchOfArmedServicesOtherstxt").html("Please Enter Deatils.");
                    }
                    else {
                        $("#error_BranchOfArmedServicesOtherstxt").html("");
                        $('#dvBranchOfArmedServicesOtherstxt').removeClass('Error');
                    }
                }

            }

            if ($RankAndDesignation.val() == "" || $RankAndDesignation.val() == null) {
                $('#dvRankAndDesignation').addClass('Error'); is_valid = 1;
               // $("#error_RankAndDesignation").html("Please Enter Deatils.");
            }
            else {
                $("#error_RankAndDesignation").html("");
                $('#dvRankAndDesignation').removeClass('Error');
            }


            if ($PostingLocation.val() == "" || $PostingLocation.val() == null) {
                $('#dvPostingLocation').addClass('Error'); is_valid = 1;
               // $("#error_PostingLocation").html("Please Enter Deatils.");
            }
            else {
                $("#error_PostingLocation").html("");
                $('#dvPostingLocation').removeClass('Error');
            }


            if ($("#NatureOfJob").val() == "") {
                is_valid = 1;
                $("#error_NatureOfJob").html("Please Select Nature Of Job.");
            } else {
                $("#error_NatureOfJob").html("");
            }

            if ($Areyouengagedanyhazardous.val() == "") {
                // $('#dvHaveYouLostSignificant').addClass('Error'); 
                is_valid = 1;
                $("#error_Areyouengagedanyhazardous").html("Please Select Option");
            }
            else {
                $("#error_Areyouengagedanyhazardous").html("");
                $('#dvAreyouengagedanyhazardous').removeClass('Error');
                if ($Areyouengagedanyhazardous.val() == "Yes" || $Areyouengagedanyhazardous.val() == "Y") {

                    if ($Areyouengagedanyhazardousdtl.val() == "") {
                        $('#dvAreyouengagedanyhazardousdtl').addClass('Error'); is_valid = 1;
                       // $("#error_Areyouengagedanyhazardousdtl").html("Please Enter Deatils.");
                    }
                    else {
                        $("#error_Areyouengagedanyhazardousdtl").html("");
                        $('#dvAreyouengagedanyhazardousdtl').removeClass('Error');
                    }
                }
            }

            if ($Areyoucurrentlyservingtroubledarea.val() == "") {
                // $('#dvHaveYouLostSignificant').addClass('Error'); 
                is_valid = 1;
                $("#error_Areyoucurrentlyservingtroubledarea").html("Please Select Option");
            }
            else {
                $("#error_Areyoucurrentlyservingtroubledarea").html("");
                $('#dvAreyoucurrentlyservingtroubledarea').removeClass('Error');
                if ($Areyoucurrentlyservingtroubledarea.val() == "Yes" || $Areyoucurrentlyservingtroubledarea.val() == "Y") {

                    if ($Areyoucurrentlyservingtroubledareadtl.val() == "") {
                        $('#dvAreyoucurrentlyservingtroubledareadtl').addClass('Error'); is_valid = 1;
                       // $("#error_Areyoucurrentlyservingtroubledareadtl").html("Please Enter Deatils.");
                    }
                    else {
                        $("#error_Areyoucurrentlyservingtroubledareadtl").html("");
                        $('#dvAreyoucurrentlyservingtroubledareadtl').removeClass('Error');
                    }
                }
            }

            if ($DoYouHandeledWeapons.val() == "") {
                // $('#dvHaveYouLostSignificant').addClass('Error'); 
                is_valid = 1;
                $("#error_DoYouHandeledWeapons").html("Please Select Option");
            }
            else {
                $("#error_DoYouHandeledWeapons").html("");
                $('#dvDoYouHandeledWeapons').removeClass('Error');
                if ($DoYouHandeledWeapons.val() == "Yes" || $DoYouHandeledWeapons.val() == "Y") {
                    if ($DoYouHandeledWeaponsdtl.val() == "") {
                        $('#dvDoYouHandeledWeaponsdtl').addClass('Error'); is_valid = 1;
                       // $("#error_DoYouHandeledWeaponsdtl").html("Please Enter Deatils.");
                    }
                    else {
                        $("#error_DoYouHandeledWeaponsdtl").html("");
                        $('#dvDoYouHandeledWeaponsdtl').removeClass('Error');
                    }
                }
            }
        }
        if (is_valid == 0) { return true; }
        else { return false; }
    }
    else if (Opt == 19) {
        if ($("#QuestionId2").val() == "Y" || $("#QuestionId2").val() == "Yes") {
            if ($("#QuestionId3").val() == "Occupation") {
                if ($ExactOccupation.val() == "") {
                    $('#dvExactOccupation').addClass('Error'); is_valid = 1;
                   // $("#error_ExactOccupation").html("Please Enter Deatils.");
                }
                else {
                    $("#error_ExactOccupation").html("");
                    $('#dvExactOccupation').removeClass('Error');
                }


                if ($dailyexactnatureofduties.val() == "") {
                    $('#dvdailyexactnatureofduties').addClass('Error'); is_valid = 1;
                   // $("#error_dailyexactnatureofduties").html("Please Enter Deatils.");
                }
                else {
                    $("#error_dailyexactnatureofduties").html("");
                    $('#dvdailyexactnatureofduties').removeClass('Error');
                }

                if ($EngagedInOccupation.val() == "") {
                    $('#dvEngagedInOccupation').addClass('Error'); is_valid = 1;
                   // $("#error_EngagedInOccupation").html("Please Enter Deatils.");
                }
                else {
                    $("#error_EngagedInOccupation").html("");
                    $('#dvEngagedInOccupation').removeClass('Error');
                }

                if ($Administration.val() == 0) {
                    $('#dvAdministration').addClass('Error'); is_valid = 1;
                    //$("#error_Administration").html("Please Enter Deatils.");
                }
                else {
                    $("#error_Administration").html("");
                    $('#dvAdministration').removeClass('Error');
                }

                if ($Administration.val() == "") {
                    $('#dvAdministration').addClass('Error'); is_valid = 1;
                    //$("#error_Administration").html("Please Enter Percentage.");
                }
                else {
                    $("#error_Administration").html("");
                    $('#dvAdministration').removeClass('Error');
                }

                if ($Supervisor.val() == "") {
                    $('#dvSupervisor').addClass('Error'); is_valid = 1;
                    $("#error_Supervisor").html("Please Enter Percentage.");
                }
                else {
                    $("#error_Supervisor").html("");
                    $('#dvSupervisor').removeClass('Error');
                }

                if ($ManualLabor.val() == "") {
                    $('#dvManualLabor').addClass('Error'); is_valid = 1;
                    $("#error_ManualLabor").html("Please Enter Percentage.");
                }
                else {
                    $("#error_ManualLabor").html("");
                    $('#dvManualLabor').removeClass('Error');
                }

                if ($Travel.val() == "") {
                    $('#dvTravel').addClass('Error'); is_valid = 1;
                    $("#error_Travel").html("Please Enter Percentage.");
                }
                else {
                    $("#error_Travel").html("");
                    $('#dvTravel').removeClass('Error');
                }

                var PercentageOfWorking = parseInt($Administration.val()) + parseInt($Supervisor.val()) + parseInt($ManualLabor.val()) + parseInt($Travel.val());
                if (PercentageOfWorking > 100 || PercentageOfWorking < 100) {
                    $('#dvAdministration').addClass('Error');
                    $('#dvSupervisor').addClass('Error');
                    $('#dvManualLabor').addClass('Error');
                    $('#dvTravel').addClass('Error');
                    is_valid = 1;
                    alert("Percentage Should be 100");
                }


                if ($AccidentWithYourDuties.val() == "") {
                    $('#dvAccidentWithYourDuties').addClass('Error'); is_valid = 1;
                    //$("#error_AccidentWithYourDuties").html("Please Enter Percentage.");
                }
                else {
                    $("#error_AccidentWithYourDuties").html("");
                    $('#dvAccidentWithYourDuties').removeClass('Error');
                }


                if ($DoYouDriveAsapartofjob.val() == "") {
                    // $('#dvHaveYouLostSignificant').addClass('Error'); 
                    is_valid = 1;
                    $("#error_DoYouDriveAsapartofjob").html("Please Select Option");
                }
                else {
                    $("#error_DoYouDriveAsapartofjob").html("");
                    $('#dvDoYouDriveAsapartofjob').removeClass('Error');
                    if ($DoYouDriveAsapartofjob.val() == "Yes" || $DoYouDriveAsapartofjob.val() == "Y") {
                        if ($Howmanykmperday.val() == 0) {
                            $('#dvHowmanykmperday').addClass('Error'); is_valid = 1;
                           // $("#error_Howmanykmperday").html("Please Enter Deatils.");
                        }
                        else {
                            $("#error_Howmanykmperday").html("");
                            $('#dvHowmanykmperday').removeClass('Error');
                        }
                    }
                }

                if ($DoYouOccupationHazardous.val() == "") {
                    // $('#dvHaveYouLostSignificant').addClass('Error'); 
                    is_valid = 1;
                    $("#error_DoYouOccupationHazardous").html("Please Select Option");
                }
                else {
                    $("#error_DoYouOccupationHazardous").html("");
                    $('#dvDoYouOccupationHazardous').removeClass('Error');
                    if ($DoYouOccupationHazardous.val() == "Yes" || $DoYouOccupationHazardous.val() == "Y") {
                        if ($DoYouOccupationHazardousdtl.val() == "") {
                            $('#dvDoYouOccupationHazardousdtl').addClass('Error'); is_valid = 1;
                            //$("#error_DoYouOccupationHazardousdtl").html("Please Enter Deatils.");
                        }
                        else {
                            $("#error_DoYouOccupationHazardousdtl").html("");
                            $('#dvDoYouOccupationHazardousdtl').removeClass('Error');
                        }
                    }
                }

                if ($("#TermDeclaration").val() == "" || $("#TermDeclaration").val() == false || $("#TermDeclaration").prop("checked") == false) {
                    $('#TermDeclaration').addClass('Error'); is_valid = 1;
                    $("#error_TermDeclaration").html("Please Agree Terms and Conditions.");
                }
                else {
                    $("#error_TermDeclaration").html("");
                    $('#TermDeclaration').removeClass('Error');
                }

                if ($JobNature.val() == "") {
                    $('#dvJobNature').addClass('Error'); is_valid = 1;
                    $("#error_JobNature").html("Please Select Job Nature.");
                }
                else {
                    $("#error_JobNature").html("");
                    $('#dvJobNature').removeClass('Error');
                }
            }
        }


        //if ($("#QuestionId2").val() == "") {
        //    $('#divQuestionId2').addClass('Error'); is_valid = 1;
        //    $("#error_QuestionId2").html("Please Enter Deatils.");
        //}
        //else {
        //    $("#error_QuestionId2").html("");
        //    $('#divQuestionId2').removeClass('Error');
        //}




        if (is_valid == 0) { return true; }
        else { return false; }
    }

    else if (Opt == 15) {

        if ($("#ExistingPolicy").val() == "" || $("#ExistingPolicy").val() == null) {
            //$('#divExistingPolicy').addClass('Error');
            is_valid = 1;
            $("#error_ExistingPolicy").html("Please Select Option.");
        }
        else {
            $("#error_ExistingPolicy").html("");
            //$('#divExistingPolicy').removeClass('Error');

            if ($("#ExistingInsuranceCount").val() == 1) {
                if ($("#TypeOfInsurance").val() == "" || $("#TypeOfInsurance").val() == null) {
                    $('#TypeOfInsurance').addClass('Error'); is_valid = 1;
                    $("#error_TypeOfInsurance").html("Please Select Type of Insurance.");
                }
                else {
                    $("#error_TypeOfInsurance").html("");
                    $('#TypeOfInsurance').removeClass('Error');
                }
                if ($("#NameOfInsurer").val() == "" || $("#NameOfInsurer").val() == null) {
                    $('#NameOfInsurer').addClass('Error'); is_valid = 1;
                    $("#error_NameOfInsurer").html("Please Select Name Of Insurer.");
                }
                else {
                    $("#error_NameOfInsurer").html("");
                    $('#NameOfInsurer').removeClass('Error');
                }

                if ($("#BasicSumAssured").val() == 0 || $("#BasicSumAssured").val() == null || $("#BasicSumAssured").val() == "") {
                    $('#dvBasicSumAssured').addClass('Error'); is_valid = 1;
                    //$("#error_BasicSumAssured").html("Please Enter Sum Assured Value.");
                }
                else {
                    $("#error_BasicSumAssured").html("");
                    $('#dvBasicSumAssured').removeClass('Error');
                }
            }


            if ($("#ExistingInsuranceCount").val() == 2) {

                if ($("#TypeOfInsurance").val() == "" || $("#TypeOfInsurance").val() == null) {
                    $('#TypeOfInsurance').addClass('Error'); is_valid = 1;
                    $("#error_TypeOfInsurance").html("Please Select Type of Insurance.");
                }
                else {
                    $("#error_TypeOfInsurance").html("");
                    $('#TypeOfInsurance').removeClass('Error');
                }
                if ($("#NameOfInsurer").val() == "" || $("#NameOfInsurer").val() == null) {
                    $('#NameOfInsurer').addClass('Error'); is_valid = 1;
                    $("#error_NameOfInsurer").html("Please Select Name Of Insurer.");
                }
                else {
                    $("#error_NameOfInsurer").html("");
                    $('#NameOfInsurer').removeClass('Error');
                }

                if ($("#BasicSumAssured").val() == 0 || $("#BasicSumAssured").val() == null || $("#BasicSumAssured").val() == "") {
                    $('#dvBasicSumAssured').addClass('Error'); is_valid = 1;
                   // $("#error_BasicSumAssured").html("Please Enter Sum Assured Value.");
                }
                else {
                    $("#error_BasicSumAssured").html("");
                    $('#dvBasicSumAssured').removeClass('Error');
                }




                if ($("#TypeOfInsurance1").val() == "" || $("#TypeOfInsurance1").val() == null) {
                    $('#TypeOfInsurance1').addClass('Error'); is_valid = 1;
                    $("#error_TypeOfInsurance1").html("Please Select Type of Insurance.");
                }
                else {
                    $("#error_TypeOfInsurance1").html("");
                    $('#TypeOfInsurance1').removeClass('Error');
                }
                if ($("#NameOfInsurer1").val() == "" || $("#NameOfInsurer1").val() == null) {
                    $('#NameOfInsurer1').addClass('Error'); is_valid = 1;
                    $("#error_NameOfInsurer1").html("Please Select Name Of Insurer.");
                }
                else {
                    $("#error_NameOfInsurer1").html("");
                    $('#NameOfInsurer1').removeClass('Error');
                }

                if ($("#BasicSumAssured1").val() == 0 || $("#BasicSumAssured1").val() == null || $("#BasicSumAssured1").val() == "") {
                    $('#dvBasicSumAssured1').addClass('Error'); is_valid = 1;
                   // $("#error_BasicSumAssured1").html("Please Enter Sum Assured Value.");
                }
                else {
                    $("#error_BasicSumAssured1").html("");
                    $('#dvBasicSumAssured1').removeClass('Error');
                }

            }


            if ($("#ExistingInsuranceCount").val() == 3) {

                if ($("#TypeOfInsurance").val() == "" || $("#TypeOfInsurance").val() == null) {
                    $('#TypeOfInsurance').addClass('Error'); is_valid = 1;
                    $("#error_TypeOfInsurance").html("Please Select Type of Insurance.");
                }
                else {
                    $("#error_TypeOfInsurance").html("");
                    $('#TypeOfInsurance').removeClass('Error');
                }
                if ($("#NameOfInsurer").val() == "" || $("#NameOfInsurer").val() == null) {
                    $('#NameOfInsurer').addClass('Error'); is_valid = 1;
                    $("#error_NameOfInsurer").html("Please Select Name Of Insurer.");
                }
                else {
                    $("#error_NameOfInsurer").html("");
                    $('#NameOfInsurer').removeClass('Error');
                }

                if ($("#BasicSumAssured").val() == 0 || $("#BasicSumAssured").val() == null || $("#BasicSumAssured").val() == "") {
                    $('#dvBasicSumAssured').addClass('Error'); is_valid = 1;
                    //$("#error_BasicSumAssured").html("Please Enter Sum Assured Value.");
                }
                else {
                    $("#error_BasicSumAssured").html("");
                    $('#dvBasicSumAssured').removeClass('Error');
                }

                if ($("#TypeOfInsurance1").val() == "" || $("#TypeOfInsurance1").val() == null) {
                    $('#TypeOfInsurance1').addClass('Error'); is_valid = 1;
                    $("#error_TypeOfInsurance1").html("Please Select Type of Insurance.");
                }
                else {
                    $("#error_TypeOfInsurance1").html("");
                    $('#TypeOfInsurance1').removeClass('Error');
                }
                if ($("#NameOfInsurer1").val() == "" || $("#NameOfInsurer1").val() == null) {
                    $('#NameOfInsurer1').addClass('Error'); is_valid = 1;
                    $("#error_NameOfInsurer1").html("Please Select Name Of Insurer.");
                }
                else {
                    $("#error_NameOfInsurer1").html("");
                    $('#NameOfInsurer1').removeClass('Error');
                }

                if ($("#BasicSumAssured1").val() == 0 || $("#BasicSumAssured1").val() == null || $("#BasicSumAssured1").val() == "") {
                    $('#dvBasicSumAssured1').addClass('Error'); is_valid = 1;
                   // $("#error_BasicSumAssured1").html("Please Enter Sum Assured Value.");
                }
                else {
                    $("#error_BasicSumAssured1").html("");
                    $('#dvBasicSumAssured1').removeClass('Error');
                }

                if ($("#TypeOfInsurance2").val() == "" || $("#TypeOfInsurance2").val() == null) {
                    $('#TypeOfInsurance2').addClass('Error'); is_valid = 1;
                    $("#error_TypeOfInsurance2").html("Please Select Type of Insurance.");
                }
                else {
                    $("#error_TypeOfInsurance2").html("");
                    $('#TypeOfInsurance2').removeClass('Error');
                }
                if ($("#NameOfInsurer2").val() == "" || $("#NameOfInsurer2").val() == null) {
                    $('#NameOfInsurer2').addClass('Error'); is_valid = 1;
                    $("#error_NameOfInsurer2").html("Please Select Name Of Insurer.");
                }
                else {
                    $("#error_NameOfInsurer2").html("");
                    $('#NameOfInsurer2').removeClass('Error');
                }

                if ($("#BasicSumAssured2").val() == 0 || $("#BasicSumAssured2").val() == null || $("#BasicSumAssured2").val() == "") {
                    $('#dvBasicSumAssured2').addClass('Error'); is_valid = 1;
                   // $("#error_BasicSumAssured2").html("Please Enter Sum Assured Value.");
                }
                else {
                    $("#error_BasicSumAssured2").html("");
                    $('#dvBasicSumAssured2').removeClass('Error');
                }
            }
            if ($("#ExistingInsuranceCount").val() == 4) {

                if ($("#TypeOfInsurance").val() == "" || $("#TypeOfInsurance").val() == null) {
                    $('#TypeOfInsurance').addClass('Error'); is_valid = 1;
                    $("#error_TypeOfInsurance").html("Please Select Type of Insurance.");
                }
                else {
                    $("#error_TypeOfInsurance").html("");
                    $('#TypeOfInsurance').removeClass('Error');
                }
                if ($("#NameOfInsurer").val() == "" || $("#NameOfInsurer").val() == null) {
                    $('#NameOfInsurer').addClass('Error'); is_valid = 1;
                    $("#error_NameOfInsurer").html("Please Select Name Of Insurer.");
                }
                else {
                    $("#error_NameOfInsurer").html("");
                    $('#NameOfInsurer').removeClass('Error');
                }

                if ($("#BasicSumAssured").val() == 0 || $("#BasicSumAssured").val() == null || $("#BasicSumAssured").val() == "") {
                    $('#dvBasicSumAssured').addClass('Error'); is_valid = 1;
                    //$("#error_BasicSumAssured").html("Please Enter Sum Assured Value.");
                }
                else {
                    $("#error_BasicSumAssured").html("");
                    $('#dvBasicSumAssured').removeClass('Error');
                }

                if ($("#TypeOfInsurance1").val() == "" || $("#TypeOfInsurance1").val() == null) {
                    $('#TypeOfInsurance1').addClass('Error'); is_valid = 1;
                    $("#error_TypeOfInsurance1").html("Please Select Type of Insurance.");
                }
                else {
                    $("#error_TypeOfInsurance1").html("");
                    $('#TypeOfInsurance1').removeClass('Error');
                }
                if ($("#NameOfInsurer1").val() == "" || $("#NameOfInsurer1").val() == null) {
                    $('#NameOfInsurer1').addClass('Error'); is_valid = 1;
                    $("#error_NameOfInsurer1").html("Please Select Name Of Insurer.");
                }
                else {
                    $("#error_NameOfInsurer1").html("");
                    $('#NameOfInsurer1').removeClass('Error');
                }

                if ($("#BasicSumAssured1").val() == 0 || $("#BasicSumAssured1").val() == null || $("#BasicSumAssured1").val() == "") {
                    $('#dvBasicSumAssured1').addClass('Error'); is_valid = 1;
                   // $("#error_BasicSumAssured1").html("Please Enter Sum Assured Value.");
                }
                else {
                    $("#error_BasicSumAssured1").html("");
                    $('#dvBasicSumAssured1').removeClass('Error');
                }

                if ($("#TypeOfInsurance2").val() == "" || $("#TypeOfInsurance2").val() == null) {
                    $('#TypeOfInsurance2').addClass('Error'); is_valid = 1;
                    $("#error_TypeOfInsurance2").html("Please Select Type of Insurance.");
                }
                else {
                    $("#error_TypeOfInsurance2").html("");
                    $('#TypeOfInsurance2').removeClass('Error');
                }
                if ($("#NameOfInsurer2").val() == "" || $("#NameOfInsurer2").val() == null) {
                    $('#NameOfInsurer2').addClass('Error'); is_valid = 1;
                    $("#error_NameOfInsurer2").html("Please Select Name Of Insurer.");
                }
                else {
                    $("#error_NameOfInsurer2").html("");
                    $('#NameOfInsurer2').removeClass('Error');
                }

                if ($("#BasicSumAssured2").val() == 0 || $("#BasicSumAssured2").val() == null || $("#BasicSumAssured2").val() == "") {
                    $('#dvBasicSumAssured2').addClass('Error'); is_valid = 1;
                    //$("#error_BasicSumAssured2").html("Please Enter Sum Assured Value.");
                }
                else {
                    $("#error_BasicSumAssured2").html("");
                    $('#dvBasicSumAssured2').removeClass('Error');
                }

                if ($("#TypeOfInsurance3").val() == "" || $("#TypeOfInsurance3").val() == null) {
                    $('#TypeOfInsurance3').addClass('Error'); is_valid = 1;
                    $("#error_TypeOfInsurance3").html("Please Select Type of Insurance.");
                }
                else {
                    $("#error_TypeOfInsurance3").html("");
                    $('#TypeOfInsurance3').removeClass('Error');
                }
                if ($("#NameOfInsurer3").val() == "" || $("#NameOfInsurer3").val() == null) {
                    $('#NameOfInsurer3').addClass('Error'); is_valid = 1;
                    $("#error_NameOfInsurer3").html("Please Select Name Of Insurer.");
                }
                else {
                    $("#error_NameOfInsurer3").html("");
                    $('#NameOfInsurer3').removeClass('Error');
                }

                if ($("#BasicSumAssured3").val() == 0 || $("#BasicSumAssured3").val() == null || $("#BasicSumAssured3").val() == "") {
                    $('#dvBasicSumAssured3').addClass('Error'); is_valid = 1;
                   // $("#error_BasicSumAssured3").html("Please Enter Sum Assured Value.");
                }
                else {
                    $("#error_BasicSumAssured3").html("");
                    $('#dvBasicSumAssured3').removeClass('Error');
                }
            }

            if ($("#ExistingInsuranceCount").val() == 5) {

                if ($("#TypeOfInsurance").val() == "" || $("#TypeOfInsurance").val() == null) {
                    $('#TypeOfInsurance').addClass('Error'); is_valid = 1;
                    $("#error_TypeOfInsurance").html("Please Select Type of Insurance.");
                }
                else {
                    $("#error_TypeOfInsurance").html("");
                    $('#TypeOfInsurance').removeClass('Error');
                }
                if ($("#NameOfInsurer").val() == "" || $("#NameOfInsurer").val() == null) {
                    $('#NameOfInsurer').addClass('Error'); is_valid = 1;
                    $("#error_NameOfInsurer").html("Please Select Name Of Insurer.");
                }
                else {
                    $("#error_NameOfInsurer").html("");
                    $('#NameOfInsurer').removeClass('Error');
                }

                if ($("#BasicSumAssured").val() == 0 || $("#BasicSumAssured").val() == null || $("#BasicSumAssured").val() == "") {
                    $('#dvBasicSumAssured').addClass('Error'); is_valid = 1;
                   // $("#error_BasicSumAssured").html("Please Enter Sum Assured Value.");
                }
                else {
                    $("#error_BasicSumAssured").html("");
                    $('#dvBasicSumAssured').removeClass('Error');
                }

                if ($("#TypeOfInsurance1").val() == "" || $("#TypeOfInsurance1").val() == null) {
                    $('#TypeOfInsurance1').addClass('Error'); is_valid = 1;
                    $("#error_TypeOfInsurance1").html("Please Select Type of Insurance.");
                }
                else {
                    $("#error_TypeOfInsurance1").html("");
                    $('#TypeOfInsurance1').removeClass('Error');
                }
                if ($("#NameOfInsurer1").val() == "" || $("#NameOfInsurer1").val() == null) {
                    $('#NameOfInsurer1').addClass('Error'); is_valid = 1;
                    $("#error_NameOfInsurer1").html("Please Select Name Of Insurer.");
                }
                else {
                    $("#error_NameOfInsurer1").html("");
                    $('#NameOfInsurer1').removeClass('Error');
                }

                if ($("#BasicSumAssured1").val() == 0 || $("#BasicSumAssured1").val() == null || $("#BasicSumAssured1").val() == "") {
                    $('#dvBasicSumAssured1').addClass('Error'); is_valid = 1;
                   // $("#error_BasicSumAssured1").html("Please Enter Sum Assured Value.");
                }
                else {
                    $("#error_BasicSumAssured1").html("");
                    $('#dvBasicSumAssured1').removeClass('Error');
                }

                if ($("#TypeOfInsurance2").val() == "" || $("#TypeOfInsurance2").val() == null) {
                    $('#TypeOfInsurance2').addClass('Error'); is_valid = 1;
                    $("#error_TypeOfInsurance2").html("Please Select Type of Insurance.");
                }
                else {
                    $("#error_TypeOfInsurance2").html("");
                    $('#TypeOfInsurance2').removeClass('Error');
                }
                if ($("#NameOfInsurer2").val() == "" || $("#NameOfInsurer2").val() == null) {
                    $('#NameOfInsurer2').addClass('Error'); is_valid = 1;
                    $("#error_NameOfInsurer2").html("Please Select Name Of Insurer.");
                }
                else {
                    $("#error_NameOfInsurer2").html("");
                    $('#NameOfInsurer2').removeClass('Error');
                }

                if ($("#BasicSumAssured2").val() == 0 || $("#BasicSumAssured2").val() == null || $("#BasicSumAssured2").val() == "") {
                    $('#dvBasicSumAssured2').addClass('Error'); is_valid = 1;
                    //$("#error_BasicSumAssured2").html("Please Enter Sum Assured Value.");
                }
                else {
                    $("#error_BasicSumAssured2").html("");
                    $('#dvBasicSumAssured2').removeClass('Error');
                }

                if ($("#TypeOfInsurance3").val() == "" || $("#TypeOfInsurance3").val() == null) {
                    $('#TypeOfInsurance3').addClass('Error'); is_valid = 1;
                    $("#error_TypeOfInsurance3").html("Please Select Type of Insurance.");
                }
                else {
                    $("#error_TypeOfInsurance3").html("");
                    $('#TypeOfInsurance3').removeClass('Error');
                }
                if ($("#NameOfInsurer3").val() == "" || $("#NameOfInsurer3").val() == null) {
                    $('#NameOfInsurer3').addClass('Error'); is_valid = 1;
                    $("#error_NameOfInsurer3").html("Please Select Name Of Insurer.");
                }
                else {
                    $("#error_NameOfInsurer3").html("");
                    $('#NameOfInsurer3').removeClass('Error');
                }

                if ($("#BasicSumAssured3").val() == 0 || $("#BasicSumAssured3").val() == null || $("#BasicSumAssured3").val() == "") {
                    $('#dvBasicSumAssured3').addClass('Error'); is_valid = 1;
                   // $("#error_BasicSumAssured3").html("Please Enter Sum Assured Value.");
                }
                else {
                    $("#error_BasicSumAssured3").html("");
                    $('#dvBasicSumAssured3').removeClass('Error');
                }

                if ($("#TypeOfInsurance4").val() == "" || $("#TypeOfInsurance4").val() == null) {
                    $('#TypeOfInsurance4').addClass('Error'); is_valid = 1;
                    $("#error_TypeOfInsurance4").html("Please Select Type of Insurance.");
                }
                else {
                    $("#error_TypeOfInsurance4").html("");
                    $('#TypeOfInsurance4').removeClass('Error');
                }
                if ($("#NameOfInsurer4").val() == "" || $("#NameOfInsurer4").val() == null) {
                    $('#NameOfInsurer4').addClass('Error'); is_valid = 1;
                    $("#error_NameOfInsurer4").html("Please Select Name Of Insurer.");
                }
                else {
                    $("#error_NameOfInsurer4").html("");
                    $('#NameOfInsurer4').removeClass('Error');
                }

                if ($("#BasicSumAssured4").val() == 0 || $("#BasicSumAssured4").val() == null || $("#BasicSumAssured4").val() == "") {
                    $('#dvBasicSumAssured4').addClass('Error'); is_valid = 1;
                    //$("#error_BasicSumAssured4").html("Please Enter Sum Assured Value.");
                }
                else {
                    $("#error_BasicSumAssured4").html("");
                    $('#dvBasicSumAssured4').removeClass('Error');
                }
            }
        }


        if (is_valid == 0) { return true; }
        else { return false; }
    }
    else if (Opt == 23) {

        if ($('#CovidQuestionId1').val() == null || $('#CovidQuestionId1').val() == "") {
            $("#divCovidQuestionId1").addClass('Error'); is_valid = 1;
            $("#error_CovidQuestionId1").html("Please Select any one");
        }
        else {
            $("#divCovidQuestionId1").removeClass('Error');
            $("#error_CovidQuestionId1").html('');
        }
        if ($('#CovidQuestionId2').val() == null || $('#CovidQuestionId2').val() == "") {
            $("#divCovidQuestionId2").addClass('Error'); is_valid = 1;
            $("#error_CovidQuestionId2").html("Please Select any one");
        }
        else {
            $("#divCovidQuestionId2").removeClass('Error');
            $("#error_CovidQuestionId2").html('');
        }
        if ($('#CovidQuestionId3').val() == null || $('#CovidQuestionId3').val() == "") {
            $("#divCovidQuestionId3").addClass('Error'); is_valid = 1;
            $("#error_CovidQuestionId3").html('Please Select any one');
        }
        else {
            $("#divCovidQuestionId3").removeClass('Error');
            $("#error_CovidQuestionId3").html('');
        }
        if ($('#CovidQuestionId1').val() == 'Y' || $('#CovidQuestionId2').val() == 'Y' || $("#CovidQuestionId3").val() == 'N')
        {
            if ($('#CovidSubQuestionId1').val() == "" || $('#CovidSubQuestionId1').val() == null) {
                $("#divCovidSubQuestionId1").addClass('Error'); is_valid = 1;
                $("#error_CovidSubQuestionId1").html('Please Select any one');
            }
            else {
                $("#divCovidSubQuestionId1").removeClass('Error');
                $("#error_CovidSubQuestionId1").html('');
                if ($('#CovidSubQuestionId1').val() == 'Y') {
                    if ($("#CovidSubQuestionId1Ans").val() == null || $("#CovidSubQuestionId1Ans").val() == "") {
                        $("#dvCovidSubQuestionId1Ans").addClass('Error'); is_valid = 1;
                        $("#error_CovidSubQuestionId1Ans").html('Please Enter Text.');
                    }
                    else {
                        $("#dvCovidSubQuestionId1Ans").removeClass('Error');
                        $("#error_CovidSubQuestionId1Ans").html('');
                    }
                }

            }
            if ($('#CovidSubQuestionId2').val() == "" || $('#CovidSubQuestionId2').val() == null) {
                $("#divCovidSubQuestionId2").addClass('Error'); is_valid = 1;
                $("#error_CovidSubQuestionId2").html('Please Select any one');
            }
            else {
                $("#divCovidSubQuestionId2").removeClass('Error');
                $("#error_CovidSubQuestionId2").html('');
                if ($('#CovidSubQuestionId2').val() == 'Y') {
                    if ($("#CovidSubQuestionId2Ans").val() == null || $("#CovidSubQuestionId2Ans").val() == "") {
                        $("#dvCovidSubQuestionId2Ans").addClass('Error'); is_valid = 1;
                        $("#error_CovidSubQuestionId2Ans").html('Please Enter Text.');
                    }
                    else {
                        $("#dvCovidSubQuestionId2Ans").removeClass('Error');
                        $("#error_CovidSubQuestionId2Ans").html('');
                    }
                }

            }
            if ($('#CovidSubQuestionId3').val() == "" || $('#CovidSubQuestionId3').val() == null) {
                $("#divCovidSubQuestionId3").addClass('Error'); is_valid = 1;
                $("#error_CovidSubQuestionId3").html('Please Select any one');
            }
            else {
                $("#divCovidSubQuestionId3").removeClass('Error');
                $("#error_CovidSubQuestionId3").html('');
            }
            if ($('#CovidSubQuestionId4').val() == "" || $('#CovidSubQuestionId4').val() == null) {
                $("#divCovidSubQuestionId4").addClass('Error'); is_valid = 1;
                $("#error_CovidSubQuestionId4").html('Please Select any one');
            }
            else {
                $("#divCovidSubQuestionId4").removeClass('Error');
                $("#error_CovidSubQuestionId4").html('');
                if ($('#CovidSubQuestionId4').val() == 'Y') {
                    if ($("#CovidSubQuestionId4Ans").val() == null || $("#CovidSubQuestionId4Ans").val() == "") {
                        $("#dvCovidSubQuestionId4Ans").addClass('Error'); is_valid = 1;
                        $("#error_CovidSubQuestionId4Ans").html('Please Enter Text.');
                    }
                    else {
                        $("#dvCovidSubQuestionId4Ans").removeClass('Error');
                        $("#error_CovidSubQuestionId4Ans").html('');
                    }
                    if ($("#CovidSubQuestionId4Date").val() == "" || $("#CovidSubQuestionId4Date").val() == null) {
                        $("#dvCovidSubQuestionId4Date").addClass('Error'); is_valid = 1;
                        $("#error_CovidSubQuestionId4Date").html('Please Select Date.');
                    } else {
                        $("#dvCovidSubQuestionId4Date").removeClass('Error');
                        $("#error_CovidSubQuestionId4Date").html('');
                    }
                }

            }
            if ($('#CovidSubQuestionId5').val() == "" || $('#CovidSubQuestionId5').val() == null) {
                $("#divCovidSubQuestionId5").addClass('Error'); is_valid = 1;
                $("#error_CovidSubQuestionId5").html('Please Select any one');
            }
            else {
                $("#divCovidSubQuestionId5").removeClass('Error');
                $("#error_CovidSubQuestionId5").html('');
                if ($('#CovidSubQuestionId5').val() == 'Y') {
                    if ($("#CovidSubQuestionId5Ans").val() == null || $("#CovidSubQuestionId5Ans").val() == "") {
                        $("#dvCovidSubQuestionId5Ans").addClass('Error'); is_valid = 1;
                        $("#error_CovidSubQuestionId5Ans").html('Please Enter Text.');
                    }
                    else {
                        $("#dvCovidSubQuestionId5Ans").removeClass('Error');
                        $("#error_CovidSubQuestionId5Ans").html('');
                    }
                }

            }
            if ($("#CovidSubQuestionId6a").val() == "" || $("#CovidSubQuestionId6a").val() == null) {
                $("#divCovidSubQuestionId6a").addClass('Error'); is_valid = 1;
                $("#error_CovidSubQuestionId6a").html('Please Select any one');
            } else {
                $("#divCovidSubQuestionId6a").removeClass('Error');
                $("#error_CovidSubQuestionId6a").html('');
                if ($('#CovidSubQuestionId6a').val() == 'Y') {
                    if ($("#CovidSubQuestionId6aCountry").val() == null || $("#CovidSubQuestionId6aCountry").val() == "") {
                        $("#CovidSubQuestionId6aCountry").addClass('Error'); is_valid = 1;
                        $("#error_CovidSubQuestionId6aCountry").html('Please Enter Text.');
                    }
                    else {
                        $("#CovidSubQuestionId6aCountry").removeClass('Error');
                        $("#error_CovidSubQuestionId6aCountry").html('');
                    }
                    if ($("#CovidSubQuestionId6aCity").val() == null || $("#CovidSubQuestionId6aCity").val() == "") {
                        $("#dvCovidSubQuestionId6aCity").addClass('Error'); is_valid = 1;
                        $("#error_CovidSubQuestionId6aCity").html('Please Enter Text.');
                    }
                    else {
                        $("#dvCovidSubQuestionId6aCity").removeClass('Error');
                        $("#error_CovidSubQuestionId6aCity").html('');
                    }
                    if ($("#CovidSubQuestionId6aDate").val() == null || $("#CovidSubQuestionId6aDate").val() == "") {
                        $("#dvCovidSubQuestionId6aDate").addClass('Error'); is_valid = 1;
                        $("#error_CovidSubQuestionId6aDate").html('Please Select Date.');
                    }
                    else {
                        $("#dvCovidSubQuestionId6aDate").removeClass('Error');
                        $("#error_CovidSubQuestionId6aDate").html('');
                    }
                    if ($("#CovidSubQuestionId6aDuration").val() == null || $("#CovidSubQuestionId6aDuration").val() == "") {
                        $("#dvCovidSubQuestionId6aDuration").addClass('Error'); is_valid = 1;
                        $("#error_CovidSubQuestionId6aDuration").html('Please Enter Details.');
                    }
                    else {
                        $("#dvCovidSubQuestionId6aDuration").removeClass('Error');
                        $("#error_CovidSubQuestionId6aDuration").html('');
                    }
                }

            }

            if ($("#CovidSubQuestionId6b").val() == "" || $("#CovidSubQuestionId6b").val() == null) {
                $("#divCovidSubQuestionId6b").addClass('Error'); is_valid = 1;
                $("#error_CovidSubQuestionId6b").html('Please Select any one');
            } else {
                $("#divCovidSubQuestionId6b").removeClass('Error');
                $("#error_CovidSubQuestionId6b").html('');
                if ($('#CovidSubQuestionId6b').val() == 'Y') {
                    if ($("#CovidSubQuestionId6bCountry").val() == null || $("#CovidSubQuestionId6bCountry").val() == "") {
                        $("#CovidSubQuestionId6bCountry").addClass('Error'); is_valid = 1;
                        $("#error_CovidSubQuestionId6bCountry").html('Please Enter Text.');
                    }
                    else {
                        $("#CovidSubQuestionId6bCountry").removeClass('Error');
                        $("#error_CovidSubQuestionId6bCountry").html('');
                    }
                    if ($("#CovidSubQuestionId6bCity").val() == null || $("#CovidSubQuestionId6bCity").val() == "") {
                        $("#dvCovidSubQuestionId6bCity").addClass('Error'); is_valid = 1;
                        $("#error_CovidSubQuestionId6bCity").html('Please Enter Text.');
                    }
                    else {
                        $("#dvCovidSubQuestionId6bCity").removeClass('Error');
                        $("#error_CovidSubQuestionId6bCity").html('');
                    }
                    if ($("#CovidSubQuestionId6bDateArrived").val() == null || $("#CovidSubQuestionId6bDateArrived").val() == "") {
                        $("#dvCovidSubQuestionId6bDateArrived").addClass('Error'); is_valid = 1;
                        $("#error_CovidSubQuestionId6bDateArrived").html('Please Enter Text.');
                    }
                    else {
                        $("#dvCovidSubQuestionId6bDateArrived").removeClass('Error');
                        $("#error_CovidSubQuestionId6bDateArrived").html('');
                    }
                    if ($("#CovidSubQuestionId6bDateDeparted").val() == null || $("#CovidSubQuestionId6bDateDeparted").val() == "") {
                        $("#dvCovidSubQuestionId6bDateDeparted").addClass('Error'); is_valid = 1;
                        $("#error_CovidSubQuestionId6bDateDeparted").html('Please Enter Text.');
                    }
                    else {
                        $("#dvCovidSubQuestionId6bDateDeparted").removeClass('Error');
                        $("#error_CovidSubQuestionId6bDateDeparted").html('');
                    }
                }

            }

            if ($("#CovidSubQuestionId6c").val() == "" || $("#CovidSubQuestionId6c").val() == null) {
                $("#divCovidSubQuestionId6c").addClass('Error'); is_valid = 1;
                $("#error_CovidSubQuestionId6c").html('Please Select any one');
            } else {
                $("#divCovidSubQuestionId6c").removeClass('Error');
                $("#error_CovidSubQuestionId6c").html('');
                if ($('#CovidSubQuestionId6c').val() == 'Y') {
                    if ($("#CovidSubQuestionId6cCountry").val() == null || $("#CovidSubQuestionId6cCountry").val() == "") {
                        $("#CovidSubQuestionId6cCountry").addClass('Error'); is_valid = 1;
                        $("#error_CovidSubQuestionId6cCountry").html('Please Enter Text.');
                    }
                    else {
                        $("#CovidSubQuestionId6cCountry").removeClass('Error');
                        $("#error_CovidSubQuestionId6cCountry").html('');
                    }
                    if ($("#CovidSubQuestionId6cCity").val() == null || $("#CovidSubQuestionId6cCity").val() == "") {
                        $("#dvCovidSubQuestionId6cCity").addClass('Error'); is_valid = 1;
                        $("#error_CovidSubQuestionId6cCity").html('Please Enter Text.');
                    }
                    else {
                        $("#dvCovidSubQuestionId6cCity").removeClass('Error');
                        $("#error_CovidSubQuestionId6cCity").html('');
                    }
                    if ($("#CovidSubQuestionId6cDate").val() == null || $("#CovidSubQuestionId6cDate").val() == "") {
                        $("#dvCovidSubQuestionId6cDate").addClass('Error'); is_valid = 1;
                        $("#error_CovidSubQuestionId6cDate").html('Please Select Date.');
                    }
                    else {
                        $("#dvCovidSubQuestionId6cDate").removeClass('Error');
                        $("#error_CovidSubQuestionId6cDate").html('');
                    }
                    if ($("#CovidSubQuestionId6cDuration").val() == null || $("#CovidSubQuestionId6cDuration").val() == "") {
                        $("#dvCovidSubQuestionId6cDuration").addClass('Error'); is_valid = 1;
                        $("#error_CovidSubQuestionId6cDuration").html('Please Enter Text.');
                    }
                    else {
                        $("#dvCovidSubQuestionId6cDuration").removeClass('Error');
                        $("#error_CovidSubQuestionId6cDuration").html('');
                    }
                }

            }
            if ($("#CovidDeclaration1").val() == "" || $("#CovidDeclaration1").val() == false || $("#CovidDeclaration1").prop("checked") == false) {
                $('#CovidDeclaration1').addClass('Error'); is_valid = 1;
                $("#error_CovidDeclaration1").html("Please Agree Terms and Conditions.");
            }
            else {
                $("#error_CovidDeclaration1").html("");
                $('#CovidDeclaration1').removeClass('Error');
            }
            if ($("#CovidDeclaration2").val() == "" || $("#CovidDeclaration2").val() == false || $("#CovidDeclaration2").prop("checked") == false) {
                $('#CovidDeclaration2').addClass('Error'); is_valid = 1;
                $("#error_CovidDeclaration2").html("Please Agree Terms and Conditions.");
            }
            else {
                $("#error_CovidDeclaration2").html("");
                $('#CovidDeclaration2').removeClass('Error');
            }

            if ($('#CovidQuestionId1').val() == 'Y') {
                if ($('#CovidSubQuestionId1').val() != 'Y' && $('#CovidSubQuestionId2').val() != 'Y' && $('#CovidSubQuestionId3').val() != 'Y' && $('#CovidSubQuestionId4').val() != 'Y') {
                    alert("Atleast one must be Yes from 1 to 4 questions");
                    is_valid = 1;
                }
            }
            if ($('#CovidQuestionId3').val() == 'N') {
                if ($('#CovidSubQuestionId6a').val() != 'Y' && $('#CovidSubQuestionId6b').val() != 'Y' && $('#CovidSubQuestionId6c').val() != 'Y') {
                    alert("Atleast one must be Yes from 6a,6b and 6c questions");
                    is_valid = 1;
                }
            }
        }
        if (is_valid == 0) { return true; }
        else { return false; }
    }

   
    else if (Opt == 20) {
        if ($AccountHolderName.val() == "" || checkTextWithSpace($AccountHolderName) == false) {

            $('#dvAccountHolderName').addClass('Error'); is_valid = 1;
            $("#error_AccountHolderName").html("Please Enter Name");
        }
        else {
            $("#error_AccountHolderName").html("");
            $("#dvAccountHolderName").removeClass('Error');
        }

        if ($BankBranchName.val() == "" || checkTextWithSpace($BankBranchName) == false) {

            $('#dvBankBranchName').addClass('Error'); is_valid = 1;
          //  $("#error_BankBranchName").html("Please Enter Bank Branch Name");
        }
        else {
            $("#error_BankBranchName").html("");
            $("#dvBankBranchName").removeClass('Error');
        }

        if ($("#txtBankName").val() == "" || $("#txtBankName").val() == null) {
            $('#txtBankName').addClass('Error'); is_valid = 1;
            //$("#error_txtBankName").html("Please Select Bank Name.");
        }
        else {
            $("#error_txtBankName").html("");
            $('#txtBankName').removeClass('Error');
        }


        if ($("#AccountNumber").val() == "" || $("#AccountNumber").val() == null) {
            $('#dvAccountNumber').addClass('Error'); is_valid = 1;
           // $("#error_AccountNumber").html("Please Enter Account Number.");
        }
        else {

            if ($("#AccountNumber").val().length == $("#AccountNumberLength").val() || $("#AccountNumberLength").val() == 0) {
                $("#AccountNumberVal").val($("#AccountNumber").val())
                $("#error_AccountNumber").html("");
                $('#dvAccountNumber').removeClass('Error');
            } else {
                $('#dvAccountNumber').addClass('Error'); is_valid = 1;
                $("#error_AccountNumber").html("Please Enter" + $("#AccountNumberLength").val() + " digit Account Number.");
            }

        }

        if ($("#ReEnterAccountNumber").val() == "" || $("#ReEnterAccountNumber").val() == null) {
            $('#dvReEnterAccountNumber').addClass('Error'); is_valid = 1;
           // $("#error_ReEnterAccountNumber").html("Please Re-Enter Account Number.");
        }
        else {
            if ($("#ReEnterAccountNumber").val() != $("#AccountNumber").val()) {
                $('#dvReEnterAccountNumber').addClass('Error'); is_valid = 1;
                $("#error_ReEnterAccountNumber").html("Please Re-Enter the same Account Number.");
            } else {
                $("#error_ReEnterAccountNumber").html("");
                $('#dvReEnterAccountNumber').removeClass('Error');
            }

        }   

        if ($("#txtBankIFSC").val() == "" || $("#txtBankIFSC").val() == null) {
            $('#dvtxtBankIFSC').addClass('Error'); is_valid = 1;
            //$("#error_txtBankIFSC").html("Please Enter IFSC Code.");
        }
        else {
            $("#error_txtBankIFSC").html("");
            $('#dvtxtBankIFSC').removeClass('Error');
        }

        if ($("#ReEntertxtBankIFSC").val() == "" || $("#ReEntertxtBankIFSC").val() == null) {
            $('#dvReEntertxtBankIFSC').addClass('Error'); is_valid = 1;
            //$("#error_ReEntertxtBankIFSC").html("Please Enter IFSC Code.");
        }
        else {

            if ($("#ReEntertxtBankIFSC").val().toLowerCase() != $("#txtBankIFSC").val().toLowerCase()) {
                $('#dvReEntertxtBankIFSC').addClass('Error'); is_valid = 1;
                $("#error_ReEntertxtBankIFSC").html("Please Enter IFSC Code Properly.");
            } else {
                $("#error_ReEntertxtBankIFSC").html("");
                $('#dvReEntertxtBankIFSC').removeClass('Error');
            }
        }


        if ($("#AccountType").val() == "" || $("#AccountType").val() == null) {
            $('#AccountType').addClass('Error'); is_valid = 1;
           // $("#error_AccountType").html("Please Select Account Type.");
        }
        else {
            $("#error_AccountType").html("");
            $('#AccountType').removeClass('Error');
        }

        if ($("#NEFTProof").val() == "" || $("#NEFTProof").val() == null) {
            $('#NEFTProof').addClass('Error'); is_valid = 1;
           // $("#error_NEFTProof").html("Please NEFT Proof");
        }
        else {
            $("#error_NEFTProof").html("");
            $('#NEFTProof').removeClass('Error');
        }

        if (is_valid < 1) { return true; }
        else { return false; }

    }
    else if (Opt == 13) {
        if (is_valid < 1) { return true; }
        else { return false; }
    }
    else if (Opt == 21) {
        if ($("#QuestionId93").val() == 'Y' || $("#QuestionId93").val() == 'Yes') {
            if ($("#FamilyMember1").val() == "") {
                $('#dvFamilyMember1').addClass('Error'); is_valid = 1;
                $("#error_FamilyMember1").html("Please Select Family Member.");
            }
            else {
                $("#error_FamilyMember1").html("");
                $('#FamilyMember1').removeClass('Error');
            }

            if ($('input:radio[name=FamilyMemberStatus1]').val() == "") {
                $('#dvFamilyMember1Status').addClass('Error'); is_valid = 1;
                //$("#error_FamilyMember1Status").html("Please Select Status.");
            }
            else {
                $("#error_FamilyMember1Status").html("");
                $('#dvFamilyMember1Status').removeClass('Error');
            }

            if ($("#CurrrentAgeOrDeathOfFamilyMember1").val() == "") {
                $('#dvCurrrentAgeOrDeathOfFamilyMember1').addClass('Error'); is_valid = 1;
                // $("#error_CurrrentAgeOrDeathOfFamilyMember1").html("Please Select Status.");
            }
            else {
                $("#error_CurrrentAgeOrDeathOfFamilyMember1").html("");
                $('#dvCurrrentAgeOrDeathOfFamilyMember1').removeClass('Error');
            }

            if ($("#FamilyMember1Status").val() == "Alive") {
                if (($("#FamilyMemberHealthStatus1").val() == "" || $("#FamilyMemberHealthStatus1").val() == null)) {
                    $('#FamilyMemberHealthStatus1').addClass('Error'); is_valid = 1;
                    //$("#error_FamilyMemberHealthStatus1").html("Please Select Status.");
                }
                else {
                    $("#error_FamilyMemberHealthStatus1").html("");
                    $('#FamilyMemberHealthStatus1').removeClass('Error');
                }
            }
            else {
                if (($("#FamilyMemberDeacesed1").val() == "" || $("#FamilyMemberDeacesed1").val() == null)) {
                    $('#FamilyMemberDeacesed1').addClass('Error'); is_valid = 1;
                } else {
                    $('#FamilyMemberDeacesed1').removeClass('Error');
                }
            }

            if ($("#FamilyMember2").val() == "") {
                $('#dvFamilyMember2').addClass('Error'); is_valid = 1;
                $("#error_FamilyMember2").html("Please Select Family Member.");
            }
            else {
                $("#error_FamilyMember2").html("");
                $('#FamilyMember2').removeClass('Error');
            }

            if ($("#FamilyMember2Status").val() == "") {
                $('#dvFamilyMember2Status').addClass('Error'); is_valid = 1;
                // $("#error_FamilyMember2Status").html("Please Select Status.");
            }
            else {
                $("#error_FamilyMember2Status").html("");
                $('#dvFamilyMember2Status').removeClass('Error');
            }

            if ($("#CurrrentAgeOrDeathOfFamilyMember2").val() == "") {
                $('#dvCurrrentAgeOrDeathOfFamilyMember2').addClass('Error'); is_valid = 1;
                //$("#error_CurrrentAgeOrDeathOfFamilyMember2").html("Please Select Status.");
            }
            else {
                $("#error_CurrrentAgeOrDeathOfFamilyMember2").html("");
                $('#dvCurrrentAgeOrDeathOfFamilyMember2').removeClass('Error');
            }

            if ($("#FamilyMember2Status").val() == "Alive") {
                if (($("#FamilyMemberHealthStatus2").val() == "" || $("#FamilyMemberHealthStatus2").val() == null)) {
                    $('#FamilyMemberHealthStatus2').addClass('Error'); is_valid = 1;
                    //$("#error_FamilyMemberHealthStatus2").html("Please Select Status.");
                }
                else {
                    $("#error_FamilyMemberHealthStatus2").html("");
                    $('#FamilyMemberHealthStatus2').removeClass('Error');
                }
            }
            else {
                if (($("#FamilyMemberDeacesed2").val() == "" || $("#FamilyMemberDeacesed2").val() == null)) {
                    $('#FamilyMemberDeacesed2').addClass('Error'); is_valid = 1;
                } else {
                    $('#FamilyMemberDeacesed2').removeClass('Error');
                }
            }

            if ($("#FamilyMemberCount").val() > 2) {
                if ($("#FamilyMember3").val() == "" || $("#FamilyMember3").val() == null) {
                    $('#FamilyMember3').addClass('Error'); is_valid = 1;
                    $("#error_FamilyMember3").html("Please Select Family Member.");
                }
                else {
                    $("#error_FamilyMember3").html("");
                    $('#FamilyMember3').removeClass('Error');
                }

                if ($("#FamilyMember3Status").val() == "") {
                    $('#dvFamilyMember3Status').addClass('Error'); is_valid = 1;
                    //$("#error_FamilyMember3Status").html("Please Select Status.");
                }
                else {
                    $("#error_FamilyMember3Status").html("");
                    $('#dvFamilyMember3Status').removeClass('Error');
                }

                if ($("#CurrrentAgeOrDeathOfFamilyMember3").val() == "") {
                    $('#dvCurrrentAgeOrDeathOfFamilyMember3').addClass('Error'); is_valid = 1;
                    // $("#error_CurrrentAgeOrDeathOfFamilyMember3").html("Please Select Status.");
                }
                else {
                    $("#error_CurrrentAgeOrDeathOfFamilyMember3").html("");
                    $('#dvCurrrentAgeOrDeathOfFamilyMember3').removeClass('Error');
                }

                if ($("#FamilyMember3Status").val() == "Alive") {
                    if (($("#FamilyMemberHealthStatus3").val() == "" || $("#FamilyMemberHealthStatus3").val() == null)) {
                        $('#FamilyMemberHealthStatus3').addClass('Error'); is_valid = 1;
                        //$("#error_FamilyMemberHealthStatus3").html("Please Select Status.");
                    }
                    else {
                        $("#error_FamilyMemberHealthStatus3").html("");
                        $('#FamilyMemberHealthStatus3').removeClass('Error');
                    }
                }
                else {
                    if (($("#FamilyMemberDeacesed3").val() == "" || $("#FamilyMemberDeacesed3").val() == null)) {
                        $('#FamilyMemberDeacesed3').addClass('Error'); is_valid = 1;
                    } else {
                        $('#FamilyMemberDeacesed3').removeClass('Error');
                    }
                }
            }
            if ($("#FamilyMemberCount").val() > 3) {

                if ($("#FamilyMember4").val() == "" || $("#FamilyMember4").val() == null) {
                    $('#FamilyMember4').addClass('Error'); is_valid = 1;
                    $("#error_FamilyMember4").html("Please Select Family Member.");
                }
                else {
                    $("#error_FamilyMember4").html("");
                    $('#FamilyMember4').removeClass('Error');
                }

                if ($("#FamilyMember4Status").val() == "") {
                    $('#dvFamilyMember4Status').addClass('Error'); is_valid = 1;
                    // $("#error_FamilyMember4Status").html("Please Select Status.");
                }
                else {
                    $("#error_FamilyMember4Status").html("");
                    $('#dvFamilyMember4Status').removeClass('Error');
                }

                if ($("#CurrrentAgeOrDeathOfFamilyMember4").val() == "") {
                    $('#dvCurrrentAgeOrDeathOfFamilyMember4').addClass('Error'); is_valid = 1;
                    ///$("#error_CurrrentAgeOrDeathOfFamilyMember4").html("Please Select Status.");
                }
                else {
                    $("#error_CurrrentAgeOrDeathOfFamilyMember4").html("");
                    $('#dvCurrrentAgeOrDeathOfFamilyMember4').removeClass('Error');
                }

                if ($("#FamilyMember4Status").val() == "Alive") {
                    if (($("#FamilyMemberHealthStatus4").val() == "" || $("#FamilyMemberHealthStatus4").val() == null)) {
                        $('#FamilyMemberHealthStatus4').addClass('Error'); is_valid = 1;
                        //$("#error_FamilyMemberHealthStatus4").html("Please Select Status.");
                    }
                    else {
                        $("#error_FamilyMemberHealthStatus4").html("");
                        $('#FamilyMemberHealthStatus4').removeClass('Error');
                    }
                }
                else {
                    if (($("#FamilyMemberDeacesed4").val() == "" || $("#FamilyMemberDeacesed4").val() == null)) {
                        $('#FamilyMemberDeacesed4').addClass('Error'); is_valid = 1;
                    } else {
                        $('#FamilyMemberDeacesed4').removeClass('Error');
                    }
                }
            }
            if ($("#FamilyMemberCount").val() > 4) {

                if ($("#FamilyMember5").val() == "" || $("#FamilyMember5").val() == null) {
                    $('#FamilyMember5').addClass('Error'); is_valid = 1;
                    $("#error_FamilyMember5").html("Please Select Family Member.");
                }
                else {
                    $("#error_FamilyMember5").html("");
                    $('#FamilyMember5').removeClass('Error');
                }

                if ($("#FamilyMember5Status").val() == "") {
                    $('#dvFamilyMember5Status').addClass('Error'); is_valid = 1;
                    // $("#error_FamilyMember5Status").html("Please Select Status.");
                }
                else {
                    $("#error_FamilyMember5Status").html("");
                    $('#dvFamilyMember5Status').removeClass('Error');
                }

                if ($("#CurrrentAgeOrDeathOfFamilyMember5").val() == "") {
                    $('#dvCurrrentAgeOrDeathOfFamilyMember5').addClass('Error'); is_valid = 1;
                    //$("#error_CurrrentAgeOrDeathOfFamilyMember5").html("Please Select Status.");
                }
                else {
                    $("#error_CurrrentAgeOrDeathOfFamilyMember5").html("");
                    $('#dvCurrrentAgeOrDeathOfFamilyMember5').removeClass('Error');
                }
                if ($("#FamilyMember5Status").val() == "Alive") {
                    if (($("#FamilyMemberHealthStatus5").val() == "" || $("#FamilyMemberHealthStatus5").val() == null)) {
                        $('#FamilyMemberHealthStatus5').addClass('Error'); is_valid = 1;
                        //$("#error_FamilyMemberHealthStatus5").html("Please Select Status.");
                    }
                    else {
                        $("#error_FamilyMemberHealthStatus5").html("");
                        $('#FamilyMemberHealthStatus5').removeClass('Error');
                    }
                }
                else {
                    if (($("#FamilyMemberDeacesed5").val() == "" || $("#FamilyMemberDeacesed5").val() == null)) {
                        $('#FamilyMemberDeacesed5').addClass('Error'); is_valid = 1;
                    } else {
                        $('#FamilyMemberDeacesed5').removeClass('Error');
                    }
                }

            }
        }
        if (is_valid == 0) { return true; }
        else { return false; }

    }
    // Added by Durgesh on 30-12-2019

    else if (Opt == 22) {

        if ($("#TaxResidentofIndia").val() == "Y" || $("#TaxResidentofIndia").val() == "Yes") {


            if ($FatherName2.val() == "" || checkTextWithSpace($FatherName2) == false) {
                $('#dvFatherName2').addClass('Error'); is_valid = 1;
               // $("#error_FatherName2").html("Please Enter Valid Name.");
            }
            else {
                $("#error_FatherName2").html("");
                $('#dvFatherName2').removeClass('Error');
            }
            if ($PlaceOfBirth.val() == '' || checkAddressStreetBuilding($PlaceOfBirth) == false) {
                $('#dvPlaceOfBirth').addClass('Error'); is_valid = 1;
               // $("#error_PlaceOfBirth").html("Please Enter Valid Place Of Birth.");
            }
            else {
                $("#error_PlaceOfBirth").html("");
                $('#dvPlaceOfBirth').removeClass('Error');
            }

            if ($CountryOfBirth.val() == '' || $CountryOfBirth.val() == null) {
                $('#CountryOfBirth').addClass('Error'); is_valid = 1;
                //$("#error_CountryOfBirth").html("Please Enter Country Of Birth.");
            }
            else {
                $("#error_CountryOfBirth").html("");
                $('#CountryOfBirth').removeClass('Error');
            }


            if ($("#OccupationType").val() == "" || $("#OccupationType").val() == null) {
                $('#OccupationType').addClass('Error');
                //$("#error_OccupationType").html("Please Enter Valid  Occuption Type.");
                is_valid = 1;
            }
            else {
                $("#error_OccupationType").html("");
                $('#OccupationType').removeClass('Error');
            }

            if ($("#IdentificationType").val() == "" || $("#IdentificationType").val() == null) {
                $('#IdentificationType').addClass('Error');
                //$("#error_IdentificationType").html("Please Enter Valid  Identification Type.");
                is_valid = 1;
            }
            else {
                $("#error_IdentificationType").html("");
                $('#IdentificationType').removeClass('Error');
                if ($IdentificationType.val() == "Others") {
                    if ($IdentificationTypeOthers.val() == "" || checkAddressStreetBuilding($IdentificationTypeOthers) == false) {
                        $('#dvIdentificationTypeOthers').addClass('Error'); is_valid = 1;
                        //$("#error_IdentificationTypeOthers").html("Please Enter Other Identification Type.");
                    }
                    else {
                        $("#error_IdentificationTypeOthers").html("");
                        $('#dvIdentificationTypeOthers').removeClass('Error');
                    }
                }
            }

            if ($Identificationno.val() == '' || checkAddressStreetBuilding($Identificationno) == false) {
                $('#dvIdentificationno').addClass('Error'); is_valid = 1;
               // $("#error_Identificationno").html("Please Enter Valid  Identification No.");
            }
            else {
                $("#error_Identificationno").html("");
                $('#dvIdentificationno').removeClass('Error');
            }




            if ($TaxResidencyCountry1.val() == '' || $TaxResidencyCountry1.val() == null) {
                $('#TaxResidencyCountry1').addClass('Error'); is_valid = 1;
                //$("#error_TaxResidencyCountry1").html("Please Enter Country Name.");
            }
            else {
                $("#error_TaxResidencyCountry1").html("");
                $('#TaxResidencyCountry1').removeClass('Error');
            }

            if ($TaxIdentificationNumber1.val() == '' || checkAddressStreetBuilding($TaxIdentificationNumber1) == false) {
                $('#dvTaxIdentificationNumber1').addClass('Error'); is_valid = 1;
                //$("#error_TaxIdentificationNumber1").html("Please Enter Valid Tax Identification Number.");
            }
            else {
                $("#error_TaxIdentificationNumber1").html("");
                $('#dvTaxIdentificationNumber1').removeClass('Error');
            }

            if ($FunctionEquivalentNumber1.val() == '' || $FunctionEquivalentNumber1.val() == null) {
                $('#FunctionEquivalentNumber1').addClass('Error'); is_valid = 1;
                //$("#error_FunctionEquivalentNumber1").html("Please Enter Country Name.");
            }
            else {
                $("#error_FunctionEquivalentNumber1").html("");
                $('#FunctionEquivalentNumber1').removeClass('Error');
            }

            if ($ValidityofDocumentry.val() == "" || $ValidityofDocumentry.val() == null) {
                $('#dvValidityofDocumentry').addClass('Error'); is_valid = 1;
                //$("#error_ValidityofDocumentry").html("Please Enter Valid Date.");
            }
            else {
                $("#error_ValidityofDocumentry").html("");
                $('#dvValidityofDocumentry').removeClass('Error');
            }




            if ($address01.val() == "" || checkAddressStreetBuilding($address01) == false) {
                $('#dvaddress01').addClass('Error'); is_valid = 1;
               // $("#error_address01").html("Please Enter Valid Address.");
            }
            else {
                $("#error_address01").html("");
                $('#dvaddress01').removeClass('Error');
            }


            if ($address02.val() == "" || checkFlat($address02) == false) {

                $('#dvaddress02').addClass('Error'); is_valid = 1;
               // $("#error_address02").html("Please Enter Valid Address.");
            }
            else {
                $("#error_address02").html("");
                $('#dvaddress02').removeClass('Error');
            }


            if ($address03.val() == "" || checkTextWithSpace($address03) == false) {
                $('#dvaddress03').addClass('Error'); is_valid = 1;
               // $("#error_address03").html("Please Enter Valid Address.");
            }
            else {
                $("#error_address03").html("");
                $('#dvaddress03').removeClass('Error');
            }
            if ($address04.val() == "" || checkTextWithSpace($address04) == false) {
                $('#dvaddress04').addClass('Error'); is_valid = 1;
               // $("#error_address04").html("Please Enter Valid Address.");
            }
            else {
                $("#error_address04").html("");
                $('#dvaddress04').removeClass('Error');
            }

            if ($("#TaxResidencyCountry1").val() == "INDIA") {
                var add = $address05.val();
                if (add.length == 6) {
                    $("#error_address05").html("");
                    $('#dvaddress05').removeClass('Error');
                }
                else {
                    $('#dvaddress05').addClass('Error'); is_valid = 1;
                    //$("#error_address05").html("Please Enter Valid PinCode.");
                }
            }


            if ($("#FatcaCount").val() > 1) {
                if ($TaxResidencyCountry2.val() == '' || $TaxResidencyCountry2.val() == null) {
                    $('#TaxResidencyCountry2').addClass('Error'); is_valid = 1;
                    //$("#error_TaxResidencyCountry2").html("Please Enter Country Name.");
                }
                else {
                    $("#error_TaxResidencyCountry2").html("");
                    $('#TaxResidencyCountry2').removeClass('Error');
                }


                if ($FunctionEquivalentNumber2.val() == '' || $FunctionEquivalentNumber2.val() == null) {
                    $('#FunctionEquivalentNumber2').addClass('Error'); is_valid = 1;
                    //$("#error_FunctionEquivalentNumber2").html("Please Enter Country Name.");
                }
                else {
                    $("#error_FunctionEquivalentNumber2").html("");
                    $('#FunctionEquivalentNumber2').removeClass('Error');
                }
                if ($ValidityofDocumentry1.val() == "" || $ValidityofDocumentry1.val() == null) {
                    $('#dvValidityofDocumentry1').addClass('Error'); is_valid = 1;
                    //$("#error_ValidityofDocumentry1").html("Please Enter Valid Date.");
                }
                else {
                    $("#error_ValidityofDocumentry1").html("");
                    $('#dvValidityofDocumentry1').removeClass('Error');
                }
                if ($address06.val() == "" || checkAddressStreetBuilding($address06) == false) {
                    $('#dvaddress06').addClass('Error'); is_valid = 1;
                    //$("#error_address06").html("Please Enter Valid Address.");
                }
                else {
                    $("#error_address06").html("");
                    $('#dvaddress06').removeClass('Error');
                }
                if ($address07.val() == "" || checkFlat($address07) == false) {
                    $('#dvaddress07').addClass('Error'); is_valid = 1;
                    //$("#error_address07").html("Please Enter Valid Address.");
                }
                else {
                    $("#error_address07").html("");
                    $('#dvaddress07').removeClass('Error');
                }
                if ($address08.val() == "" || checkTextWithSpace($address08) == false) {
                    $('#dvaddress08').addClass('Error'); is_valid = 1;
                    //$("#error_address08").html("Please Enter Valid Address.");
                }
                else {
                    $("#error_address08").html("");
                    $('#dvaddress08').removeClass('Error');
                }
                if ($address09.val() == "" || checkTextWithSpace($address09) == false) {
                    $('#dvaddress09').addClass('Error'); is_valid = 1;
                    //$("#error_address09").html("Please Enter Valid Address.");
                }
                else {
                    $("#error_address09").html("");
                    $('#dvaddress09').removeClass('Error');
                }

                if ($("#TaxResidencyCountry2").val() == "INDIA") {
                    var add = $address10.val();
                    if (add.length == 6) {
                        $("#error_address10").html("");
                        $('#dvaddress10').removeClass('Error');
                    }
                    else {
                        $('#dvaddress10').addClass('Error'); is_valid = 1;
                        //$("#error_address10").html("Please Enter Valid PinCode.");
                    }
                }


                if ($TaxIdentificationNumber2.val() == '' || checkAddressStreetBuilding($TaxIdentificationNumber2) == false) {
                    $('#dvTaxIdentificationNumber2').addClass('Error'); is_valid = 1;
                    //$("#error_TaxIdentificationNumber2").html("Please Enter Valid Tax Identification Number.");
                }
                else {
                    $("#error_TaxIdentificationNumber2").html("");
                    $('#dvTaxIdentificationNumber2').removeClass('Error');
                }
            }

            if ($("#FatcaCount").val() > 2) {
                if ($TaxResidencyCountry3.val() == '' || $TaxResidencyCountry3.val() == null) {
                    $('#TaxResidencyCountry3').addClass('Error'); is_valid = 1;
                    //$("#error_TaxResidencyCountry3").html("Please Enter Country Name.");
                }
                else {
                    $("#error_TaxResidencyCountry3").html("");
                    $('#TaxResidencyCountry3').removeClass('Error');
                }

                if ($FunctionEquivalentNumber3.val() == '' || $FunctionEquivalentNumber3.val() == null) {
                    $('#FunctionEquivalentNumber3').addClass('Error'); is_valid = 1;
                    //$("#error_FunctionEquivalentNumber3").html("Please Enter Country Name.");
                }
                else {
                    $("#error_FunctionEquivalentNumber3").html("");
                    $('#FunctionEquivalentNumber3').removeClass('Error');
                }

                if ($ValidityofDocumentry2.val() == "" || $ValidityofDocumentry2.val() == null) {
                    $('#dvValidityofDocumentry2').addClass('Error'); is_valid = 1;
                    //$("#error_ValidityofDocumentry2").html("Please Enter Valid Date.");
                }
                else {
                    $("#error_ValidityofDocumentry2").html("");
                    $('#dvValidityofDocumentry2').removeClass('Error');
                }
                if ($TaxIdentificationNumber3.val() == '' || checkAddressStreetBuilding($TaxIdentificationNumber3) == false) {
                    $('#dvTaxIdentificationNumber3').addClass('Error'); is_valid = 1;
                    //$("#error_TaxIdentificationNumber3").html("Please Enter Valid Tax Identification Number.");
                }
                else {
                    $("#error_TaxIdentificationNumber3").html("");
                    $('#dvTaxIdentificationNumber3').removeClass('Error');
                }

                if ($Address11.val() == "" || checkAddressStreetBuilding($Address11) == false) {
                    $('#dvAddress11').addClass('Error'); is_valid = 1;
                    //$("#error_Address11").html("Please Enter Valid Address.");
                }
                else {
                    $("#error_Address11").html("");
                    $('#dvaAddress11').removeClass('Error');
                }


                if ($Address12.val() == "" || checkFlat($Address12) == false) {

                    $('#dvAddress12').addClass('Error'); is_valid = 1;
                    //$("#error_Address12").html("Please Enter Valid Address.");
                }
                else {
                    $("#error_Address12").html("");
                    $('#dvAddress12').removeClass('Error');
                }

                if ($Address13.val() == "" || checkTextWithSpace($Address13) == false) {
                    $('#dvAddress13').addClass('Error'); is_valid = 1;
                    //$("#error_Address13").html("Please Enter Valid Address.");
                }
                else {
                    $("#error_Address13").html("");
                    $('#dvAddress13').removeClass('Error');
                }
                if ($Address14.val() == "" || checkTextWithSpace($Address14) == false) {
                    $('#dvAddress14').addClass('Error'); is_valid = 1;
                    //$("#error_Address14").html("Please Enter Valid Address.");
                }
                else {
                    $("#error_Address14").html("");
                    $('#dvAddress14').removeClass('Error');
                }

                if ($("#TaxResidencyCountry3").val() == "INDIA") {
                    var add = $Address15.val();
                    if (add.length == 6) {
                        $("#error_Address15").html("");
                        $('#dvAddress15').removeClass('Error');
                    }
                    else {
                        $('#dvAddress15').addClass('Error'); is_valid = 1;
                        //$("#error_Address15").html("Please Enter Valid PinCode.");
                    }

                }
            }
        }
        if (is_valid == 0) { return true; }
        else { return false; }
    }
    else if (Opt == 24) {
        if ($("#SuitabilityMatrixQuestion1").val() == "" || $("#SuitabilityMatrixQuestion1").val() == null) {
            is_valid = 1;
            $("#error_SuitabilityMatrixQuestion1").html("Please Select Current Income");
        } else {
            is_valid = 0;
            $("#error_SuitabilityMatrixQuestion1").html("");
        }

        if ($("#SuitabilityMatrixQuestion2").val() == "" || $("#SuitabilityMatrixQuestion2").val() == null) {
            is_valid = 1;
            $("#error_SuitabilityMatrixQuestion2").html("Please Select Current LifeStyle");
        } else {
            is_valid = 0;
            $("#error_SuitabilityMatrixQuestion2").html("");
        }

        if ($("#SuitabilityMatrixQuestion3").val() == "" || $("#SuitabilityMatrixQuestion3").val() == null) {
            is_valid = 1;
            $("#error_SuitabilityMatrixQuestion3").html("Please Select Investment Objective");
        } else {
            is_valid = 0;
            $("#error_SuitabilityMatrixQuestion3").html("");
        }

        if ($("#SuitabilityMatrixQuestion4").val() == "" || $("#SuitabilityMatrixQuestion4").val() == null) {
            is_valid = 1;
            $("#error_SuitabilityMatrixQuestion4").html("Please Select Riskappetite");
        } else {
            is_valid = 0;
            $("#error_SuitabilityMatrixQuestion4").html("");
        }

        if ($("#SuitabilityMatrixQuestion5").val() == "" || $("#SuitabilityMatrixQuestion5").val() == null) {
            is_valid = 1;
            $("#error_SuitabilityMatrixQuestion5").html("Please Select Investment Horizon");
        } else {
            is_valid = 0;
            $("#error_SuitabilityMatrixQuestion5").html("");
        }

        if ($("#SuitabilityMatrixQuestion6").val() == "" || $("#SuitabilityMatrixQuestion6").val() == null) {
            is_valid = 1;
            $("#error_SuitabilityMatrixQuestion6").html("Please Select Insurance Portfolio");
        } else {
            is_valid = 0;
            $("#error_SuitabilityMatrixQuestion6").html("");
        }

        if (is_valid == 0) { return true; }
        else { return false; }
    }

    //else if (Opt == 23) {
    //    if ($("#MarriedWomensAct").val() == "Y" || $("#MarriedWomensAct").val() == "Yes") {
    //        if ($("#Beneficiary1Name").val() == "" || checkTextWithSpaceFirstName($("#Beneficiary1Name")) == false) {
    //            $('#dvBeneficiary1Name').addClass('Error'); is_valid = 1;
    //        } else {
    //            $("#error_Beneficiary1Name").html("");
    //            $('#dvBeneficiary1Name').removeClass('Error');
    //        }

    //        if ($("#Beneficiary1RelationshipWithInsured").val() == "" || $("#Beneficiary1RelationshipWithInsured").val() == null) {
    //            $('#Beneficiary1RelationshipWithInsured').addClass('Error'); is_valid = 1;
    //        } else {
    //            $("#error_Beneficiary1Name").html("");
    //            $('#Beneficiary1RelationshipWithInsured').removeClass('Error');
    //        }

    //        if ($("#Beneficiary1Age").val() == "" || $("#Beneficiary1Age").val() == "0") {
    //            $('#dvBeneficiary1Age').addClass('Error'); is_valid = 1;
    //        } else {
    //            $("#error_Beneficiary1Age").html("");
    //            $('#dvBeneficiary1Age').removeClass('Error');
    //        }

    //        if ($("#BeneficiaryCount").val() == 2) {
    //            if ($("#Beneficiary2Name").val() == "" || checkTextWithSpaceFirstName($("#Beneficiary2Name")) == false) {
    //                $('#dvBeneficiary2Name').addClass('Error'); is_valid = 1;
    //            } else {
    //                $("#error_Beneficiary2Name").html("");
    //                $('#dvBeneficiary2Name').removeClass('Error');
    //            }

    //            if ($("#Beneficiary2RelationshipWithInsured").val() == "" || $("#Beneficiary2RelationshipWithInsured").val() == null) {
    //                $('#Beneficiary2RelationshipWithInsured').addClass('Error'); is_valid = 1;
    //            } else {
    //                $("#error_Beneficiary2Name").html("");
    //                $('#Beneficiary2RelationshipWithInsured').removeClass('Error');
    //            }

    //            if ($("#Beneficiary2Age").val() == "" || $("#Beneficiary2Age").val() == "0") {
    //                $('#dvBeneficiary2Age').addClass('Error'); is_valid = 1;
    //            } else {
    //                $("#error_Beneficiary2Age").html("");
    //                $('#dvBeneficiary2Age').removeClass('Error');
    //            }
    //        }

    //        if ($("#BeneficiaryCount").val() == 3) {
    //            if ($("#Beneficiary2Name").val() == "" || checkTextWithSpaceFirstName($("#Beneficiary2Name")) == false) {
    //                $('#dvBeneficiary2Name').addClass('Error'); is_valid = 1;
    //            } else {
    //                $("#error_Beneficiary2Name").html("");
    //                $('#dvBeneficiary2Name').removeClass('Error');
    //            }

    //            if ($("#Beneficiary2RelationshipWithInsured").val() == "" || $("#Beneficiary2RelationshipWithInsured").val() == null) {
    //                $('#Beneficiary2RelationshipWithInsured').addClass('Error'); is_valid = 1;
    //            } else {
    //                $("#error_Beneficiary2Name").html("");
    //                $('#Beneficiary2RelationshipWithInsured').removeClass('Error');
    //            }

    //            if ($("#Beneficiary2Age").val() == "" || $("#Beneficiary2Age").val() == "0") {
    //                $('#dvBeneficiary2Age').addClass('Error'); is_valid = 1;
    //            } else {
    //                $("#error_Beneficiary2Age").html("");
    //                $('#dvBeneficiary2Age').removeClass('Error');
    //            }

    //            if ($("#Beneficiary3Name").val() == "" || checkTextWithSpaceFirstName($("#Beneficiary3Name")) == false) {
    //                $('#dvBeneficiary3Name').addClass('Error'); is_valid = 1;
    //            } else {
    //                $("#error_Beneficiary3Name").html("");
    //                $('#dvBeneficiary3Name').removeClass('Error');
    //            }

    //            if ($("#Beneficiary3RelationshipWithInsured").val() == "" || $("#Beneficiary3RelationshipWithInsured").val() == null) {
    //                $('#Beneficiary3RelationshipWithInsured').addClass('Error'); is_valid = 1;
    //            } else {
    //                $("#error_Beneficiary3Name").html("");
    //                $('#Beneficiary3RelationshipWithInsured').removeClass('Error');
    //            }

    //            if ($("#Beneficiary3Age").val() == "" || $("#Beneficiary3Age").val() == "0") {
    //                $('#dvBeneficiary3Age').addClass('Error'); is_valid = 1;
    //            } else {
    //                $("#error_Beneficiary3Age").html("");
    //                $('#dvBeneficiary3Age').removeClass('Error');
    //            }
    //        }


    //        if ($("#Trustee1Name").val() == "" || checkTextWithSpaceFirstName($("#Trustee1Name")) == false) {
    //            $('#dvTrustee1Name').addClass('Error'); is_valid = 1;
    //        } else {
    //            $("#error_Trustee1Name").html("");
    //            $('#dvTrustee1Name').removeClass('Error');
    //        }

    //        if ($("#Trustee1Address").val() == "" || checkAddressStreetBuilding($("#Trustee1Address")) == false) {
    //            $('#dvTrustee1Address').addClass('Error'); is_valid = 1;
    //        } else {
    //            $("#error_Trustee1Address").html("");
    //            $('#dvTrustee1Address').removeClass('Error');
    //        }

    //        if ($("#SignatureForSpecialTrustee1").val() == "") {
    //            $('#dvSignatureForSpecialTrustee1').addClass('Error'); is_valid = 1;
    //        } else {
    //            $("#error_SignatureForSpecialTrustee1").html("");
    //            $('#dvSignatureForSpecialTrustee1').removeClass('Error');
    //        }

    //        if ($("#TrusteeCount").val() == 2) {
    //            if ($("#Trustee2Name").val() == "" || checkTextWithSpaceFirstName($("#Trustee2Name")) == false) {
    //                $('#dvTrustee2Name').addClass('Error'); is_valid = 1;
    //            } else {
    //                $("#error_Trustee2Name").html("");
    //                $('#dvTrustee2Name').removeClass('Error');
    //            }

    //            if ($("#Trustee2Address").val() == "" || checkAddressStreetBuilding($("#Trustee2Address")) == false) {
    //                $('#dvTrustee2Address').addClass('Error'); is_valid = 1;
    //            } else {
    //                $("#error_Trustee2Address").html("");
    //                $('#dvTrustee2Address').removeClass('Error');
    //            }

    //            if ($("#SignatureForSpecialTrustee2").val() == "") {
    //                $('#dvSignatureForSpecialTrustee2').addClass('Error'); is_valid = 1;
    //            } else {
    //                $("#error_SignatureForSpecialTrustee2").html("");
    //                $('#dvSignatureForSpecialTrustee2').removeClass('Error');
    //            }
    //        }

    //        if ($("#TrusteeCount").val() == 3) {
    //            if ($("#Trustee2Name").val() == "" || checkTextWithSpaceFirstName($("#Trustee2Name")) == false) {
    //                $('#dvTrustee2Name').addClass('Error'); is_valid = 1;
    //            } else {
    //                $("#error_Trustee2Name").html("");
    //                $('#dvTrustee2Name').removeClass('Error');
    //            }

    //            if ($("#Trustee2Address").val() == "" || checkAddressStreetBuilding($("#Trustee2Address")) == false) {
    //                $('#dvTrustee2Address').addClass('Error'); is_valid = 1;
    //            } else {
    //                $("#error_Trustee2Address").html("");
    //                $('#dvTrustee2Address').removeClass('Error');
    //            }

    //            if ($("#SignatureForSpecialTrustee2").val() == "") {
    //                $('#dvSignatureForSpecialTrustee2').addClass('Error'); is_valid = 1;
    //            } else {
    //                $("#error_SignatureForSpecialTrustee2").html("");
    //                $('#dvSignatureForSpecialTrustee2').removeClass('Error');
    //            }

    //            if ($("#Trustee3Name").val() == "" || checkTextWithSpaceFirstName($("#Trustee3Name")) == false) {
    //                $('#dvTrustee3Name').addClass('Error'); is_valid = 1;
    //            } else {
    //                $("#error_Trustee3Name").html("");
    //                $('#dvTrustee3Name').removeClass('Error');
    //            }

    //            if ($("#Trustee3Address").val() == "" || checkAddressStreetBuilding($("#Trustee3Address")) == false) {
    //                $('#dvTrustee3Address').addClass('Error'); is_valid = 1;
    //            } else {
    //                $("#error_Trustee3Address").html("");
    //                $('#dvTrustee3Address').removeClass('Error');
    //            }

    //            if ($("#SignatureForSpecialTrustee3").val() == "") {
    //                $('#dvSignatureForSpecialTrustee3').addClass('Error'); is_valid = 1;
    //            } else {
    //                $("#error_SignatureForSpecialTrustee3").html("");
    //                $('#dvSignatureForSpecialTrustee3').removeClass('Error');
    //            }
    //        }

    //    }
    //    if (is_valid == 0) { return true; }
    //    else { return false; }
    //}
    else if (Opt == 13) {
        if ($('#FinalSubmit').val() == "1") {
            //window.location.href = "/TermInsuranceIndia/Intermediatepagelife";
            is_valid = 0;
            return true;
        }
        else { return false; }

    }
}

function ExpandSection(HID, CID) {

    var HeaderId = $('#' + HID);
    var ContentId = $('#' + CID);
    $('.Heading1').removeClass('collapsed').attr("aria-expanded", false).find("i.indicator").removeClass('glyphicon-minus').addClass('glyphicon-plus');//Adding Default
    $('.panel-collapse').removeClass('in').attr("style", "height: 0px;").attr("aria-expanded", false);//Adding Default
    //ContentId.toggleClass('collapsing');
    HeaderId.removeClass('collapsed').attr("aria-expanded", true).find("i.indicator").removeClass('glyphicon-plus').addClass('glyphicon-minus');
    ContentId.addClass('in').attr("aria-expanded", true).attr("style", "");
}
function checkCustomerValidation() {

    $('.Heading1').click(function (e) {

        var IDs = [], ContentIDs = [], i = 0;
        var thisval = $(this).attr('id');
        $("#accordion1").find('.Heading1').each(function (n, i) { IDs.push(this.id); });
        $("#accordion1").find('.panel-collapse').each(function (n, i) { ContentIDs.push(this.id); });
        var thislength = IDs.indexOf(thisval);
        //for (var i = 0; i < thislength; i++) {
        //    if (ValidateSection(IDs[i]) == true) {
        //        $('#' + IDs[i]).find("i.indicator").removeClass('glyphs');
        //    }
        //    else {
        //        $('#' + IDs[i]).find("i.indicator").addClass('glyphs');
        //        ExpandSection(IDs[i], ContentIDs[i]);//$('#'+ContentIDs[i]).collapse('show');
        //        e.preventDefault(); e.stopPropagation();
        //        return false;
        //    }
        //}

        for (var i = 0; i < thislength; i++) {
            if (ValidateSection(IDs[i]) == true) {
                $('#' + IDs[i]).find("i.indicator").removeClass('glyphs');
            }
            else {
                $('#' + IDs[i]).find("i.indicator").addClass('glyphs');
                if (IDs[i] == "hrefViewInput") {
                    ExpandSection(IDs[i], "collapseOne");
                } else if (IDs[i] == "hrefPersonalInfo") {
                    ExpandSection(IDs[i], "collapsefour");
                } else if (IDs[i] == "hrefEducationalInfo") {
                    ExpandSection(IDs[i], "collapsefive");
                } else if (IDs[i] == "hrefDocumentInfo") {
                    ExpandSection(IDs[i], "collapsesix");
                } else if (IDs[i] == "hrefEIAInfo") {
                    ExpandSection(IDs[i], "collapseseven");
                } else if (IDs[i] == "hrefExistingPolicy") {
                    ExpandSection(IDs[i], "collapseTwo");
                } else if (IDs[i] == "hrefContactInfo") {
                    ExpandSection(IDs[i], "collapseThree");
                } else if (IDs[i] == "hrefnominee") {
                    ExpandSection(IDs[i], "collapseeight");
                } else if (IDs[i] == "hrefMedicalQuestionnaire") {
                    ExpandSection(IDs[i], "collapsenine");
                } else if (IDs[i] == "hrefLifeStyleQuestionnaire") {
                    ExpandSection(IDs[i], "collapseten");
                } else if (IDs[i] == "hrefCovidDetails") {
                    ExpandSection(IDs[i], "collapsetwentythree"); 
                }
                //else if (IDs[i] == "hrefSuitabilityMatrix") {
                //    ExpandSection(IDs[i], "collapsetwentyfour"); 
                //}
                else if (IDs[i] == "hrefHypertensionReflexive") {
                    ExpandSection(IDs[i], "collapseTwelve");
                } else if (IDs[i] == "hrefDiabetesReflexive") {
                    ExpandSection(IDs[i], "collapseThirteen");
                } else if (IDs[i] == "hrefDefenceReflexive") {
                    ExpandSection(IDs[i], "collapseFourteen");
                } else if (IDs[i] == "hrefOccupationReflexive") {
                    ExpandSection(IDs[i], "collapseFifteen");
                } else if (IDs[i] == "hrefBankDetails") {
                    ExpandSection(IDs[i], "collapseSixteen");
                } else if (IDs[i] == "hrefFamilyDetails") {
                    ExpandSection(IDs[i], "collapseSeventeen");
                }
                else if (IDs[i] == "hrefMWP") {
                    ExpandSection(IDs[i], "collapseEighteen");
                }
                else if (IDs[i] == "hrefFatcaReflexive") {
                    ExpandSection(IDs[i], "collapsetwentytwo");
                } else if (IDs[i] == "hrefSuitabilityMatrix") {
                    ExpandSection(IDs[i], "collapsetwentyfour");
                }
                else {
                    ExpandSection(IDs[i], "collapseeleven");//$('#'+ContentIDs[i]).collapse('show');
                }
                //ExpandSection(IDs[i], ContentIDs[i]);//$('#'+ContentIDs[i]).collapse('show');
                e.preventDefault(); e.stopPropagation();
                return false;
            }
        }
        if ($('#FinalSubmit').val() == "1" && $(this).attr('id') == "submitSendPaymentlink") { $('#submitSendPaymentlink').attr("disabled", "disabled"); document.forms[0].submit(); }
    });
}

function CheckFocusOut(id, check) {
    var Customer;
    var divid = "dv" + id;
    if (Customer == 1) {
        if ($('#' + id).hasClass('NotRequired')) { $('#' + divid).removeClass('Error'); }
        else {
            if (check == false) { $('#' + divid).addClass('Error'); }
            else { $('#' + divid).removeClass('Error'); }
        }
    }
    else if ($('#' + id).hasClass('Required') == true) {
        if ($('#' + id).val() == "") { $('#' + divid).addClass('Error'); }
        else {
            if (check == false) { $('#' + divid).addClass('Error'); }
            else { $('#' + divid).removeClass('Error'); }
        }
    }
    else {
        if (check == false && $('#' + id).val() != "") { $('#' + divid).addClass('Error'); return false; }
        else { $('#' + divid).removeClass('Error'); }
    }
}

function checkPincode(input) {
    var pattern = new RegExp('^([1-9]{1}[0-9]{5})$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}

function checkText(input) {

    var pattern = new RegExp('^[a-zA-Z]+$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
//function checkTextWithSpace(input) {
//    var pattern = new RegExp('^[a-zA-Z ]+$');
//    var dvid = "dv" + input[0].id;
//    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
//    else { $('#' + dvid).removeClass('Error'); return true; }
//}



function checkTextWithSpace(input) {

    var pattern = new RegExp('^[a-zA-Z ]+$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}

//function checkTextWithSpaceFirstName(input) {
//    var pattern = new RegExp("^[a-zA-Z' ]+$");
//    var dvid = "dv" + input[0].id;
//    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
//    else { $('#' + dvid).removeClass('Error'); return true; }
//}

function checkTextWithSpaceFirstName(input) {

    var pattern = new RegExp("^[a-zA-Z' ]+$");
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}

function checkTextWithSpaceLastName(input) {

    var pattern = new RegExp('^[a-zA-Z. ]+$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkNumeric(input) {
    var pattern = new RegExp('^[0-9]*$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkAlphaNumeric(input) {
    var pattern = new RegExp('^[a-zA-Z0-9]+$'); //var pattern = new RegExp('^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkAlphaNumericWithSpace(input) {
    var pattern = new RegExp('^[a-zA-Z0-9 ]+$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkPolicyNumber(input) {
    var pattern = new RegExp('^[a-zA-Z0-9-/]+$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
//function checkAddress(input) {
//    var pattern = new RegExp('^[a-zA-Z0-9-,./ ]+$');
//    var dvid = "dv" + input[0].id;
//    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
//    else { $('#' + dvid).removeClass('Error'); return true; }
//}

function checkAddress1(input) {

    var pattern = new RegExp('^[a-zA-Z0-9-. ]+$');
    // var pattern = new RegExp('^[a-zA-Z0-9-.,-:/()]+$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}

function checkAddressStreetBuilding(input) {

    var pattern = new RegExp("^[a-zA-Z0-9-./,'(): ]+$");
    // var pattern = new RegExp('^[a-zA-Z0-9-.,-:/()]+$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}

function checkPermanentAddress1(input) {

    var pattern = new RegExp('^[A-Za-z0-9\/.,():  -]+$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}

function checkPincode(input) {
    var pattern = new RegExp('^([1-9]{1}[0-9]{5})$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkMobile(input) {
    var pattern = new RegExp('^([7-9]{1}[0-9]{9})$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}

function checkMobileNRI(input) {

    var pattern = new RegExp('^([6-9]{1}[0-9]{9,14})$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}


function checkEmail(input) {
    //var pattern = new RegExp('');//('/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/');
    //var lower = input.val().toLowerCase();
    //var result = pattern.test(lower);
    //var dvid = "dv" + input[0].id;
    //if (result == false) { $('#' + dvid).addClass('Error'); return false; }
    //else { $('#' + dvid).removeClass('Error'); return true; }


    //(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test('mayuri.tikal@gmail.com.in'))

    var dvid = "dv" + input[0].id;
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input.val().toLowerCase())) {
        $('#' + dvid).removeClass('Error'); //return true;
        return (true)
    }
    $('#' + dvid).addClass('Error'); //return false;
    return (false)


}

function checkGSTValue(input) {

    var pattern = new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9]{1}$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkCity1(input) {
    var pattern = new RegExp('^[a-zA-Z ,]+$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkFlat(input) {
    var pattern = new RegExp('^[0-9a-zA-Z ,/-]+$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkPassport(input) {

    var pattern = new RegExp('^[A-Z]{1}(?!0+$)[0-9]{7}$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val().toUpperCase()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function checkPAN(input) {

    var pattern = new RegExp('^[A-Z]{5}[0-9]{4}[A-Z]{1}$');
    var dvid = "dv" + input[0].id;
    // var inputupp = input.val().toUpperCase()
    if (pattern.test(input.val().toUpperCase()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}
function TermAndCondition(id, IsCustomer) {
    if ($(id).prop('checked') == false) {
        $("#IOnline").addClass('glyphs');
        if (IsCustomer.toLowerCase() == "true" || IsCustomer == 1) { $(id).addClass('errorCheckBox'); }
    }
    else {
        $("#IOnline").removeClass('glyphs');
        $(id).removeClass('errorCheckBox');
    }
}
function ValidatePersonalInformation() {

    var is_valid = 0;
    var $InsuredTitle = $("#InsuredTitle");
    var $InsuredEmail = $("#InsuredEmail");
    var $InsuredFirstName = $("#InsuredFirstName")
    var $InsuredLastName = $("#InsuredLastName");
    var $InsuredMobile = $("#InsuredMobile");
    var $InsuredEmail = $("#InsuredEmail");
    var $InsuredDOB = $("#InsuredDOB");
    //var $OccupationalDetailsOthers = $("#OccupationalDetailsOthers");
    //var $OccupationalDetails = $("#OccupationalDetails");

    if ($InsuredTitle.val() == 0 || $InsuredTitle.val() == "" || $InsuredTitle.val() == null) {
        $InsuredTitle.addClass('Error'); is_valid = 1;
    }
    else {
        $("#error_InsuredTitle").html("");
        $InsuredTitle.removeClass('Error');
    }

    if ($InsuredFirstName.val() == "" || checkTextWithSpaceFirstName($InsuredFirstName) == false) {
        $('#dvInsuredFirstName').addClass('Error'); is_valid = 1;
        $("#error_InsuredFirstName").html("Please Enter First Name");
    }
    else {
        $("#error_InsuredFirstName").html("");
        $("#dvInsuredFirstName").removeClass('Error');
    }

    if ($InsuredLastName.val() == "" || checkTextWithSpaceLastName($InsuredLastName) == false) {
        $('#dvInsuredLastName').addClass('Error'); is_valid = 1;
        $("#error_InsuredLastName").html("Please Enter Last Name");
    }
    else {
        $("#error_InsuredLastName").html("");
        $("#dvInsuredLastName").removeClass('Error');
    }

    if ($InsuredDOB.val() == "") {
        $('#dvInsuredDOB').addClass('Error'); is_valid = 1;
        $("#error_InsuredDOB").html("Please Select DOB.");
    }
    else {
        $("#error_InsuredDOB").html("");
        $('#dvInsuredDOB').removeClass('Error');
    }

    if ($InsuredMobile.val() == "" || checkMobile($InsuredMobile) == false) {
        $('#dvInsuredMobile').addClass('Error'); is_valid = 1;
        $("#error_InsuredMobile").html("Please Enter Mobile Number.");
    }
    else {
        $("#error_InsuredMobile").html("");
        $('#dvInsuredMobile').removeClass('Error');
    }

    if ($InsuredEmail.val() == '' || checkEmail($InsuredEmail) == false) {

        $('#dvInsuredEmail').addClass('Error'); is_valid = 1;
    }
    else { $('#dvInsuredEmail').removeClass('Error'); }

    if (is_valid == 0) { $("#FinalSubmit").val("1"); return true; }
    else { return false; }
}
function ValidateNominee() {
    is_valid = 0;
    if ($("#nomineepercentagetotal").val() > 100 || $("#nomineepercentagetotal").val() < 100) {
        alert("Enter correct nominee percentage."); is_valid = 1;
    }

    if (is_valid == 0) { $("#FinalSubmit").val("1"); return true; }
    else { return false; }
}
function CheckAtleastTwoCharacter(input) {

    var pattern = new RegExp('[a-zA-Z]{2,}');

    var input1 = input.val();
    var dvid = "dv" + input[0].id;
    var dvid1 = "error_" + input[0].id;
    if (pattern.test(input.val()) == false) {
        $('#' + dvid).addClass('Error');
        $('#' + dvid1).html("Please Enter Atleast Two Character");
        return false;
    }
    else {
        $('#' + dvid).removeClass('Error');
        $('#' + dvid1).html("");
        return true;
    }
}


$('.OnlyText').focusout(function () {
    CheckFocusOut($(this).attr('id'), checkText($(this)));
});

//$('.ConsecutiveChar').focusout(function () {
//    CheckFocusOut($(this).attr('id'), CheckThreeIChar($(this)));
//});

$('.OnlyTextWithSpace').focusout(function () {
    CheckFocusOut($(this).attr('id'), checkTextWithSpace($(this)));
});
$('.OnlyNumber').focusout(function () {
    CheckFocusOut($(this).attr('id'), checkNumeric($(this)));
});
$('.AlphaNumeric').focusout(function () {
    CheckFocusOut($(this).attr('id'), checkAlphaNumeric($(this)));
});
$('.Mobile').focusout(function () {
    CheckFocusOut($(this).attr('id'), checkMobile($(this)));
});
$('.Email').focusout(function () {
    CheckFocusOut($(this).attr('id'), checkEmail($(this)));
});
$('.Pincode').focusout(function () {
    CheckFocusOut($(this).attr('id'), checkPincode($(this)));
});
$('.Address').focusout(function () {
    CheckFocusOut($(this).attr('id'), checkAddress1($(this)));
});
$('.City').focusout(function () {
    CheckFocusOut($(this).attr('id'), checkCity1($(this)));
});
$('.Passport').focusout(function () {
    CheckFocusOut($(this).attr('id'), checkPassport($(this)));
});

//$('.addresshouse').focusout(function () {
//    CheckFocusOut($(this).attr('id'), CheckAddressHDFC1($(this)));
//});


$('.Number').keyup(function () {
    this.value = this.value.replace(/[^0-9\.]/g, '');
});

$('#OccupationalDetailsOthers').focusout(function () {
    CheckFocusOut($(this).attr('id'), ValidateOccupation($(this)));
});

$('#QuestionId2N').click(function () {
    if ($("#QuestionId2").val() == "N") {
        $("#Occupation").prop("checked", false);
        $("#OccupationReflexive").hide();
    }
});

//on click of no all uncheck
$('#QuestionId73').click(function () {
    if ($('#QuestionId73').val() == "N") {
        $('.unchk').each(function () {
            $(this).attr("checked", false);
            $("#HighBloodPressure").val(false);
            $("#HighBloodSugar").val(false);
        });
    }

});


$(".CheckName").keypress(function (e) {
    var regex = new RegExp("^[a-zA-Z' ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }
});

$("#PermanentContactHOUSEFLATNUMBER").keypress(function (e) {

    var regex = new RegExp("^[A-Za-z0-9\/ .,()':-]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});

$("#InsuredFatherFirstName").keypress(function (e) {

    var regex = new RegExp("^[A-Za-z]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});
$("#InsuredFatherLastName").keypress(function (e) {

    var regex = new RegExp("^[A-Za-z]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});
$("#InsuredMotherFirstName").keypress(function (e) {

    var regex = new RegExp("^[A-Za-z]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});
$("#InsuredMotherLastName").keypress(function (e) {

    var regex = new RegExp("^[A-Za-z]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});
$("#InsuredHusbandFirstName").keypress(function (e) {

    var regex = new RegExp("^[A-Za-z]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});
$("#InsuredHusbandLastName").keypress(function (e) {

    var regex = new RegExp("^[A-Za-z]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});

$("#ContactHOUSEFLATNUMBER").keypress(function (e) {

    var regex = new RegExp("^[A-Za-z0-9 \/.,()':-]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }

});
var count = 2;

$("#addmem").click(function () {

    $("#divaddmem3").hide();
    $("#divremmem3").show();
    $("#divaddmem4").show();
    //$("#remmem").show();
    $("#dvFamilyMember3").show();
    count++;
    $("#FamilyMemberCount").val(count);
    console.log(count);
})

$("#remmem").click(function () {
    $("#dvFamilyMember3").hide();
    $("#divaddmem4").hide();
    $("#divaddmem3").show();
    $("#divremmem3").hide();
    count--;
    $("#FamilyMemberCount").val(count);
    console.log(count);
})

$("#addmem2").click(function () {
    $("#divaddmem3").hide();
    $("#divaddmem4").hide();
    $("#divremmem3").hide();
    $("#divremmem4").show();
    $("#divaddmem5").show();
    $("#dvFamilyMember4").show();
    count++;
    $("#FamilyMemberCount").val(count);
    console.log(count);
})

$("#remmem2").click(function () {
    $("#dvFamilyMember4").hide();
    $("#divremmem4").hide();
    $("#divaddmem5").hide();
    $("#divremmem3").show();
    $("#divaddmem4").show();
    count--;
    $("#FamilyMemberCount").val(count);
    console.log(count);
})

$("#remmem3").click(function () {
    $("#dvFamilyMember5").hide();
    $("#divremmem5").hide();
    $("#divremmem4").show();
    $("#divaddmem5").show();
    count--;
    $("#FamilyMemberCount").val(count);
    console.log(count);
})

$("#addmem3").click(function () {
    $("#divaddmem4").hide();
    $("#divremmem4").hide();
    $("#divaddmem5").hide();
    $("#divremmem5").show();
    $("#dvFamilyMember5").show();
    count++;
    $("#FamilyMemberCount").val(count);
    console.log(count);
})

$('#TermDeclaration').click(function () {
    if ($("#TermDeclaration").prop("checked") == true) {
        $("#TermDeclaration").val(true);
    }
    else if ($("#TermDeclaration").prop("checked") == false) {
        $("#TermDeclaration").val(false);
    }
});
$('#CovidDeclaration1').click(function () {
    if ($("#CovidDeclaration1").prop("checked") == true) {
        $("#CovidDeclaration1").val(true);
    }
    else if ($("#CovidDeclaration1").prop("checked") == false) {
        $("#CovidDeclaration1").val(false);
    }
});
$('#CovidDeclaration2').click(function () {
    if ($("#CovidDeclaration2").prop("checked") == true) {
        $("#CovidDeclaration2").val(true);
    }
    else if ($("#CovidDeclaration2").prop("checked") == false) {
        $("#CovidDeclaration2").val(false);
    }
});
$('#chk_EIA').click(function () {
    if ($("#chk_EIA").prop("checked") == true) {
        $("#chk_EIA").val(true);
    }
    else if ($("#chk_EIA").prop("checked") == false) {
        $("#chk_EIA").val(false);
    }
});

$("#ValidityofDocumentry").datepicker({
    changeMonth: true,
    changeYear: true,
    yearRange: 'c-82:c',
    dateFormat: 'dd-mm-yy',
    minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
    maxDate: '0',
    onSelect: function () { $('#ValidityofDocumentry').removeClass('Error'); }
});
$("#ValidityofDocumentry").click(function () { $("#ValidityofDocumentry").datepicker("show"); if ($('#ValidityofDocumentry').val() != "") { $('#ValidityofDocumentry').removeClass('Error'); } });

$("#ValidityofDocumentry1").datepicker({
    changeMonth: true,
    changeYear: true,
    yearRange: 'c-82:c',
    dateFormat: 'dd-mm-yy',
    minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
    maxDate: '0',
    onSelect: function () { $('#ValidityofDocumentry1').removeClass('Error'); }
});
$("#ValidityofDocumentry1").click(function () { $("#ValidityofDocumentry1").datepicker("show"); if ($('#ValidityofDocumentry1').val() != "") { $('#ValidityofDocumentry1').removeClass('Error'); } });

$("#ValidityofDocumentry2").datepicker({
    changeMonth: true,
    changeYear: true,
    yearRange: 'c-82:c',
    dateFormat: 'dd-mm-yy',
    minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
    maxDate: '0',
    onSelect: function () { $('#ValidityofDocumentry2').removeClass('Error'); }
});
$("#ValidityofDocumentry2").click(function () { $("#ValidityofDocumentry2").datepicker("show"); if ($('#ValidityofDocumentry2').val() != "") { $('#ValidityofDocumentry2').removeClass('Error'); } });
$("#CovidSubQuestionId4Date").datepicker({
    changeMonth: true,
    changeYear: true,
    yearRange: 'c-82:c',
    dateFormat: 'dd-mm-yy',
    minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
    maxDate: '0',
    onSelect: function () { $('#CovidSubQuestionId4Date').removeClass('Error'); }
});
$("#CovidSubQuestionId4Date").click(function () { $("#CovidSubQuestionId4Date").datepicker("show"); if ($('#CovidSubQuestionId4Date').val() != "") { $('#CovidSubQuestionId4Date').removeClass('Error'); } });
$("#CovidSubQuestionId6aDate").datepicker({
    changeMonth: true,
    changeYear: true,
    yearRange: 'c-82:c',
    dateFormat: 'dd-mm-yy',
    minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
    maxDate: '0',
    onSelect: function () { $('#CovidSubQuestionId6aDate').removeClass('Error'); }
});
$("#CovidSubQuestionId6aDate").click(function () { $("#CovidSubQuestionId6aDate").datepicker("show"); if ($('#CovidSubQuestionId6aDate').val() != "") { $('#CovidSubQuestionId6aDate').removeClass('Error'); } });
$("#CovidSubQuestionId6bDateDeparted").datepicker({
    changeMonth: true,
    changeYear: true,
    yearRange: 'c-82:c',
    dateFormat: 'dd-mm-yy',
    minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
    maxDate: '0',
    onSelect: function () { $('#CovidSubQuestionId6bDateDeparted').removeClass('Error'); }
});
$("#CovidSubQuestionId6bDateDeparted").click(function () { $("#CovidSubQuestionId6bDateDeparted").datepicker("show"); if ($('#CovidSubQuestionId6bDateDeparted').val() != "") { $('#CovidSubQuestionId6bDateDeparted').removeClass('Error'); } });
$("#CovidSubQuestionId6bDateArrived").datepicker({
    changeMonth: true,
    changeYear: true,
    yearRange: 'c-82:c',
    dateFormat: 'dd-mm-yy',
    minDate: -14,
    maxDate: '0',
    onSelect: function () { $('#CovidSubQuestionId6bDateArrived').removeClass('Error'); }
});
$("#CovidSubQuestionId6bDateArrived").click(function () { $("#CovidSubQuestionId6bDateArrived").datepicker("show"); if ($('#CovidSubQuestionId6bDateArrived').val() != "") { $('#CovidSubQuestionId6bDateArrived').removeClass('Error'); } });
$("#CovidSubQuestionId6cDate").datepicker({
    changeMonth: true,
    changeYear: true,
    yearRange: 'c-82:c',
    dateFormat: 'dd-mm-yy',
    minDate: 0,
    maxDate: '+2Y',
    onSelect: function () { $('#CovidSubQuestionId6cDate').removeClass('Error'); }
});
$("#CovidSubQuestionId6cDate").click(function () { $("#CovidSubQuestionId6cDate").datepicker("show"); if ($('#CovidSubQuestionId6cDate').val() != "") { $('#CovidSubQuestionId6cDate').removeClass('Error'); } });

$("#divQuestionId47").change(function () {
    if ($("#QuestionId47").val() == "Y") {
        $("#DeliveryDate").show();
    } else {
        $("#DeliveryDate").hide();
    }
})
$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

//$("#FamilyMember3").change(function () {
//    var a = $("#FamilyMember3").val();
//    if (a == '95') {
//        $("#FamilyMember4 option[value='95']").css("pointer-events", "none");
//    }
//    else {
//        $("#FamilyMember4 option[value='95']").css("pointer-events", "auto");
//    }
//    if (a == '98') {
//        $("#FamilyMember4 option[value='" + a + "']").prop('disabled', true);
//    }
//    else {
//        $("#FamilyMember4 option[value='" + a + "']").prop('disabled', false);
//    }
//    if (a == '99') {
//        $("#FamilyMember4 option[value='" + a + "']").prop('disabled', true);
//    }
//    else {
//        $("#FamilyMember4 option[value='" + a + "']").prop('disabled', false);
//    } 
//})

//$("#FamilyMember4").change(function () {
//    var a = $("#FamilyMember3").val();
//    var b = $("#FamilyMember4").val();
//    //$("#FamilyMember4 option[value='" + a + "']").css("pointer-events", "none");
//    //$("#FamilyMember4 option[value='" + b + "']").css("pointer-events", "none");
//    if (a == '95' || b=='98') {
//        $("#FamilyMember4 option[value='" + a + "']").prop('disabled', true);
//        $("#FamilyMember4 option[value='" + b + "']").prop('disabled', true);
//    }
//    else {
//        $("#FamilyMember4 option[value='" + a + "']").prop('disabled', false);
//        $("#FamilyMember4 option[value='" + b + "']").prop('disabled', false);
//    }
//    if (a == '98' || b=='99') {
//        $("#FamilyMember4 option[value='" + a + "']").prop('disabled', true);
//        $("#FamilyMember4 option[value='" + b + "']").prop('disabled', true);
//    }
//    else {
//        $("#FamilyMember4 option[value='" + a + "']").prop('disabled', false);
//        $("#FamilyMember4 option[value='" + b + "']").prop('disabled', false);
//    }
//    if (a == '99'|| b=='95') {
//        $("#FamilyMember4 option[value='" + a + "']").prop('disabled', true);
//        $("#FamilyMember4 option[value='" + b + "']").prop('disabled', true);
//    }
//    else {
//        $("#FamilyMember4 option[value='" + a + "']").prop('disabled', false);
//        $("#FamilyMember4 option[value='" + b + "']").prop('disabled', false);
//    } 
//})
$("#AddNominee").click(function () {

    AddNominee2();

});

$("#AddNominee1").click(function () {

    AddNominee3();
});
$("#RemoveNominee").click(function () {

    RemoveNominee2();
});

$("#RemoveNominee1").click(function () {

    RemoveNominee3();
});
$("#divCovidQuestionId2").click(function () {
    if ($("#CovidQuestionId2").val() == 'Y') {
        CovidQuestionAns('CovidSubQuestionId5', 'Yes');
        $("#CovidSubQuestionId5Y").css("pointer-events", "none");
        $("#CovidSubQuestionId5N").css("pointer-events", "none");
    } else {
        CovidQuestionAns('CovidSubQuestionId5', 'No');
        $("#CovidSubQuestionId5Y").css("pointer-events", "auto");
        $("#CovidSubQuestionId5N").css("pointer-events", "auto");
    }
});



$("#divCovidQuestionId1").click(function () {
    if ($("#CovidQuestionId1").val() == 'N') {
        CovidQuestionAns('CovidSubQuestionId1', 'No');
        CovidQuestionAns('CovidSubQuestionId2', 'No');
        CovidQuestionAns('CovidSubQuestionId3', 'No');
        CovidQuestionAns('CovidSubQuestionId4', 'No');
        $("#CovidSubQuestionId1").val("");
        $("#CovidSubQuestionId2").val("");
        $("#CovidSubQuestionId3").val("");
        $("#CovidSubQuestionId4").val("");
        //$("#CovidSubQuestionId1Y").removeClass('active');
        $("#CovidSubQuestionId1N").removeClass('active');
        //$("#CovidSubQuestionId2Y").removeClass('active');
        $("#CovidSubQuestionId2N").removeClass('active');
        //$("#CovidSubQuestionId3Y").removeClass('active');
        $("#CovidSubQuestionId3N").removeClass('active');
        //$("#CovidSubQuestionId4Y").removeClass('active');
        $("#CovidSubQuestionId4N").removeClass('active');
    }
});
$('#divCovidQuestionId3').click(function () {
    if ($('#CovidQuestionId3').val() == 'Y') {
        CovidQuestionAns('CovidSubQuestionId6a', 'No');
        CovidQuestionAns('CovidSubQuestionId6b', 'No');
        CovidQuestionAns('CovidSubQuestionId6c', 'No');
        $("#CovidSubQuestionId6a").val("");
        $("#CovidSubQuestionId6b").val("");
        $("#CovidSubQuestionId6c").val("");
        //$("#CovidSubQuestionId6aY").removeClass('active');
        $("#CovidSubQuestionId6aN").removeClass('active');
        //$("#CovidSubQuestionId6bY").removeClass('active');
        $("#CovidSubQuestionId6bN").removeClass('active');
        //$("#CovidSubQuestionId6cY").removeClass('active');
        $("#CovidSubQuestionId6cN").removeClass('active');
    }
});
function AddNominee2() {

    $("#n2").show();
    $("#AddNominee").prop("disabled", true);
    $("#RemoveNominee").removeAttr('disabled');
    $("#isnominee2added").val("yes");
}

function AddNominee3() {

    $("#n3").show();
    $("#AddNominee1").prop("disabled", true);
    $("#RemoveNominee1").removeAttr('disabled');
    $("#isnominee3added").val("yes");
}
function RemoveNominee2() {

    $("#n2").hide();
    $("#AddNominee").removeAttr('disabled');
    $("#RemoveNominee").prop("disabled", true);
    $("#isnominee2added").val("");
}

function RemoveNominee3() {
    $("#n3").hide();
    $("#AddNominee1").removeAttr('disabled');
    $("#RemoveNominee1").prop("disabled", true);
    $("#isnominee3added").val("");

}

$("#NomineeGender").change(function () {
    NomineeRelationship1();
    $("#MaleRel").val("");
    $("#FeMaleRel").val("");
    $("#NomineeRelationship").val("");
    if ($("#NomineeGender").val() == "M") {
        $('select[name="MaleRel"]').show();
        $('#FeMaleRel').hide();
        $('#MaleRel').show();
    } else {
        $('select[name="FeMaleRel"]').show();
        $('#MaleRel').hide();
        $('#FeMaleRel').show();
    }
})
$("#Nominee2Gender").change(function () {
    NomineeRelationship2();
    $("#MaleRel2").val("");
    $("#FeMaleRel2").val("");
    $("#Nominee2Relationship").val("");
    if ($("#Nominee2Gender").val() == "M") {
        $('select[name="MaleRel2"]').show();
        $('#FeMaleRel2').hide();
        $('#MaleRel2').show();
    } else {
        $('select[name="FeMaleRel2"]').show();
        $('#MaleRel2').hide();
        $('#FeMaleRel2').show();
    }
})
$("#Nominee3Gender").change(function () {
    NomineeRelationship3();
    $("#MaleRel3").val("");
    $("#FeMaleRel3").val("");
    $("#Nominee3Relationship").val("");
    if ($("#Nominee3Gender").val() == "M") {
        $('select[name="MaleRel3"]').show();
        $('#FeMaleRel3').hide();
        $('#MaleRel3').show();
    } else {
        $('select[name="FeMaleRel3"]').show();
        $('#MaleRel3').hide();
        $('#FeMaleRel3').show();
    }
})
$("#MaleRel").change(function () {
    NomineeRelationship1();
})
$("#FeMaleRel").change(function () {
    NomineeRelationship1();
})
$("#MaleRel2").change(function () {
    NomineeRelationship2();
})
$("#FeMaleRel2").change(function () {
    NomineeRelationship2();
})

$("#MaleRel3").change(function () {
    NomineeRelationship3();
})
$("#FeMaleRel3").change(function () {
    NomineeRelationship3();
})
function NomineeRelationship1() {
    if ($("#NomineeGender").val() == "M") {
        $("#NomineeRelationship").val($("#MaleRel").val())
        $("#NomineeRelationshipText").val($("#MaleRel option:selected").text())
    } else {
        $("#NomineeRelationship").val($("#FeMaleRel").val())
        $("#NomineeRelationshipText").val($("#FeMaleRel option:selected").text())
    }
   
}
function NomineeRelationship2() {
    if ($("#Nominee2Gender").val() == "M") {
        $("#Nominee2Relationship").val($("#MaleRel2").val())
        $("#Nominee2RelationshipText").val($("#MaleRel2 option:selected").text())
    } else {
        $("#Nominee2Relationship").val($("#FeMaleRel2").val())
        $("#Nominee2RelationshipText").val($("#FeMaleRel2 option:selected").text())
    }

}
function NomineeRelationship3() {
    if ($("#Nominee3Gender").val() == "M") {
        $("#Nominee3Relationship").val($("#MaleRel3").val())
        $("#Nominee3RelationshipText").val($("#MaleRel3 option:selected").text())
    } else {
        $("#Nominee3Relationship").val($("#FeMaleRel3").val())
        $("#Nominee3RelationshipText").val($("#FeMaleRel3 option:selected").text())
    }

}

//$("#AppointeeGender").change(function () {
//    AppointeeRelationship1();
//    $("#AppMaleRel").val("");
//    $("#AppFeMaleRel").val("");
//    $("#AppointeeRelationship").val("");
//    if ($("#AppointeeGender").val() == "GEN_M") {
//        $('select[name="AppMaleRel"]').show();
//        $('#AppFeMaleRel').hide();
//        $('#AppMaleRel').show();
//    } else {
//        $('select[name="AppFeMaleRel"]').show();
//        $('#AppMaleRel').hide();
//        $('#AppFeMaleRel').show();
//    }
//})
//$("#AppMaleRel").change(function () {
//    AppointeeRelationship1();
//})
//$("#AppFeMaleRel").change(function () {
//    AppointeeRelationship1();
//})
//function AppointeeRelationship1() {
//    if ($("#AppointeeGender").val() == "GEN_M") {
//        $("#AppointeeRelationship").val($("#AppMaleRel").val())
//        $("#AppointeeRelationshipText").val($("#MaleRel option:selected").text())
//    } else {
//        $("#AppointeeRelationship").val($("#AppFeMaleRel").val())
//        $("#AppointeeRelationshipText").val($("#FeMaleRel option:selected").text())
//    }
//}

//$("#Appointee2Gender").change(function () {
//    AppointeeRelationship2();
//    $("#AppMaleRel2").val("");
//    $("#AppFeMaleRel2").val("");
//    $("#Appointee2Relationship").val("");
//    if ($("#Appointee2Gender").val() == "GEN_M") {
//        $('select[name="AppMaleRel2"]').show();
//        $('#AppFeMaleRel2').hide();
//        $('#AppMaleRel2').show();
//    } else {
//        $('select[name="AppFeMaleRel2"]').show();
//        $('#AppMaleRel2').hide();
//        $('#AppFeMaleRel2').show();
//    }
//})
//$("#AppMaleRel2").change(function () {
//    AppointeeRelationship2();
//})
//$("#AppFeMaleRel2").change(function () {
//    AppointeeRelationship2();
//})
//function AppointeeRelationship2() {
//    if ($("#Appointee2Gender").val() == "GEN_M") {
//        $("#Appointee2Relationship").val($("#AppMaleRel2").val())
//        $("#Appointee2RelationshipText").val($("#MaleRel2 option:selected").text())
//    } else {
//        $("#Appointee2Relationship").val($("#AppFeMaleRel2").val())
//        $("#Appointee2RelationshipText").val($("#FeMaleRel2 option:selected").text())
//    }
//}

//$("#Appointee3Gender").change(function () {
//    AppointeeRelationship3();
//    $("#AppMaleRel3").val("");
//    $("#AppFeMaleRel3").val("");
//    $("#Appointee3Relationship").val("");
//    if ($("#Appointee3Gender").val() == "GEN_M") {
//        $('select[name="AppMaleRel3"]').show();
//        $('#AppFeMaleRel3').hide();
//        $('#AppMaleRel3').show();
//    } else {
//        $('select[name="AppFeMaleRel3"]').show();
//        $('#AppMaleRel3').hide();
//        $('#AppFeMaleRel3').show();
//    }
//})
//$("#AppMaleRel3").change(function () {
//    AppointeeRelationship3();
//})
//$("#AppFeMaleRel3").change(function () {
//    AppointeeRelationship3();
//})
//function AppointeeRelationship3() {
//    if ($("#Appointee3Gender").val() == "GEN_M") {
//        $("#Appointee3Relationship").val($("#AppMaleRel3").val())
//        $("#Appointee3RelationshipText").val($("#MaleRel3 option:selected").text())
//    } else {
//        $("#Appointee3Relationship").val($("#AppFeMaleRel3").val())
//        $("#Appointee3RelationshipText").val($("#FeMaleRel3 option:selected").text())
//    }
//}