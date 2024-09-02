$(document).ready(function () {

    //$("#SelfDOB").val("");
    //$("#SpouseDOB").val("");
    //$("#FatherDOB").val("");
    //$("#MotherDOB").val("");
    //$("#Kid1DOB").val("");
    //$("#Kid2DOB").val("");
    //$("#Kid3DOB").val("");
    //$("#Kid4DOB").val("");
    //$("#NumberOfChild").val(0);
    //$("#Kid1Gender").removeAttr("checked");
    //$("#Kid2Gender").removeAttr("checked");
    //$("#Kid3Gender").removeAttr("checked");
    //$("#Kid4Gender").removeAttr("checked");
    //$("#AddPolicySpouse").removeAttr('checked');
    //$("#AddPolicyFather").removeAttr('checked');
    //$("#AddPolicyMother").removeAttr('checked');
    //$("#AddPolicyKids").removeAttr('checked');
    $("#SelfDOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y'
    });
    $("#SpouseDOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y'
    });
    $("#FatherDOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y'
    });
    $("#MotherDOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y'
    });
    for (var i = 1; i <= 4; i++) {
        var _kid = "#Kid" + i + "DOB";
        $(_kid).datepicker({
            changeMonth: true,
            changeYear: true,
            yearRange: 'c-20:c',
            minDate: new Date((new Date()).getFullYear() - 20, (new Date()).getMonth(), 1),
            maxDate: '-25d',
            dateFormat: 'dd-mm-yy'
        });
    }
    SetRadioButton($("input[name=PolicyFor]"), $("#HiddenPolicyFor").val());
   // alert($("#HiddenPolicyFor").val());
   // SetRadioButton($("input[name=PolicyFor]"), true);
    ShowHidePolicyFor($("#HiddenPolicyFor").val());

    $("input[name=PolicyFor]").click(function () {
        if ($(this).val() == "Family Floater") {
            $("#AddPolicySpouse").attr('checked');
            //alert($("#AddPolicyKids").val());
            ShowHideChilds($("#AddPolicyKids").val());
            $("#trChild").hide();

        }
        else if ($(this).val() == "Self") {
            $("#AddPolicySpouse").removeAttr('checked');
            $("#AddPolicyFather").removeAttr('checked');
            $("#AddPolicyMother").removeAttr('checked');
            $("#AddPolicyKids").removeAttr('checked');
            $("#trChild").hide();
            $("#NumberOfChild").val(0);
            $(".trKid1").hide();
            $(".trKid2").hide();
            $(".trKid3").hide();
            $(".trKid4").hide();
            $(".trFather").hide('slow', function () { })
            $(".trMother").hide('slow', function () { })
        }
        ShowHidePolicyFor($(this).val());
        $("#trError").hide('slow', function () { });
    });

    // For Checked box show hide

    $("#AddPolicySpouse").click(function () {
        if (MemberCountInPolicy() > 6) {
            alert("Only Six People Are Allowed For This Insurance");
            $("#AddPolicySpouse").removeAttr('checked');
            
        }
        else {
            ShowHideSpouse($("#AddPolicySpouse").attr('checked'));
        }
    });
    $("#AddPolicyFather").click(function () {
        if (MemberCountInPolicy() > 6) {
            alert("Only Six People Are Allowed For This Insurance");
            $("#AddPolicyFather").removeAttr('checked');
            
        }
        else {
            ShowHideFather($("#AddPolicyFather").attr('checked'));
        }
    });
    $("#AddPolicyMother").click(function () {
        if (MemberCountInPolicy() > 6) {
            alert("Only Six People Are Allowed For This Insurance");
            $("#AddPolicyMother").removeAttr('checked');
           
        }
        else {
            ShowHideMother($("#AddPolicyMother").attr('checked'));
        }
    });
    $("#AddPolicyKids").click(function () {
        ShowHideKids($("#AddPolicyKids").attr('checked'));
    });
    $("#NumberOfChild").change(function () {
       
        if (MemberCountInPolicy() > 6)
        {
            alert("Only Six People Are Allowed For This Insurance");
            $("#NumberOfChild").val(0);
            
        }
    });
    function MemberCountInPolicy()
    {
        var iMem = 1;
        if ($("#AddPolicySpouse").attr('checked'))
        {
            iMem = iMem + 1;
        }
        if ($("#AddPolicyFather").attr('checked')) {
            iMem = iMem + 1;
        }
        if ($("#AddPolicyMother").attr('checked')) {
            iMem = iMem + 1;
        }
        if ($("#AddPolicyKids").attr('checked')) {
            iMem = iMem + parseInt($("#NumberOfChild").val());
        }
        return iMem;
    }
    function ShowHidePolicyFor(_value) {
        if (_value == "Family Floater") {
            $("#AddPolicySpouse").attr('checked', true);
            $(".trAddMoreMember").show('slow', function () { })
            $(".trSpouse").show('slow', function () { })
            ShowHideChilds($("#NumberOfChild").val());
        }
        else {
            $("#AddPolicySpouse").removeAttr('checked');
            $(".trSpouse").hide('slow', function () { })
            $(".trAddMoreMember").hide('slow', function () { })
            $("#trChild").hide('slow', function () { })
           
        }
    }

    $("#NumberOfChild").change(function () {
        ShowHideChilds($(this).val());
        $("#trError").hide('slow', function () { });
    });
    $("input[name=SelfGender]").click(function () {
        if ($(this).val() == "M") {
            SetRadioButton($("input[name=SpouseGender]"), "F");
        }
        else {
            SetRadioButton($("input[name=SpouseGender]"), "M");
        }
    });
    $("input[name=SpouseGender]").click(function () {
        if ($(this).val() == "M") {
            SetRadioButton($("input[name=SelfGender]"), "F");
        }
        else {
            SetRadioButton($("input[name=SelfGender]"), "M");
        }
    });
    $("#btnSubmit").click(function () {
      //  return Validation();
        $("#HiddenPolicyFor").val(GetRadioButtonSelectedValue($("input[name=PolicyFor]")));
       
    });

    function GetRadioButtonSelectedValue(current_element) {
        for (var i = 0; i < current_element.length; i++) {
            if (current_element[i].checked) {
                return current_element[i].value;
            }
        }
    }
    function SetRadioButton(current_element, match_value) {
        for (var i = 0; i < current_element.length; i++) {
            if (current_element[i].value == match_value) {
                current_element[i].checked = true;
            }
        }
    }
});
function ShowHideChilds(_child) {
    if (_child == 0) {
        $("#NumberOfChild").val(0);
    }
    for (var i = 1; i <= 4; i++) {
        if (i <= _child) {
            $(".trKid" + i).show('slow', function () { })
            //alert($(".trKid" + i).val("poo"));
        }
        else {
            $(".trKid" + i).hide('slow', function () { })
            $("#Kid" + i + "Select").removeAttr('checked');
           // alert($(".trKid" + i).val("poo"));
        }
    }
}

function ShowHideFather(sValue) {
    if (sValue == true || sValue == "True" || sValue == "true") {
        $(".trFather").show('slow', function () { })
    }
    else { $(".trFather").hide('slow', function () { }) }
}

function ShowHideMother(sValue) {
    if (sValue == true || sValue == "True" || sValue == "true") {
        $(".trMother").show('slow', function () { })
    }
    else { $(".trMother").hide('slow', function () { }) }
}

function ShowHideSpouse(sValue) {
    if (sValue == true || sValue == "True" || sValue == "true") {
        $(".trSpouse").show('slow', function () { })
    }
    else { $(".trSpouse").hide('slow', function () { }) }
}
function ShowHideKids(sValue) {
    if (sValue == true || sValue == "True" || sValue == "true") {
        $("#trChild").show('slow', function () { })
    }
    else {
        $("#NumberOfChild").val(0);
        ShowHideChilds(0);
        $("#trChild").hide('slow', function () { }) 
    }
}
//function Validation()
//{
//    var _error = "";
//  //  alert("khkhsdk");
//    if ($("#SelfDOB").val() == null || $("#SelfDOB").val() == 0)
//    {
//        //alert("pooja");
//        _error += "Please Select Self Date Of Birth.\n ";
//    }
//  //  alert($("input[type='radio'][name='SelfDOB']:checked").val());
//    //if ($("input[type='radio'][name='SelfDOB']:checked").val() != 'M'
//    //               || $("input[type='radio'][name='SelfDOB']:checked").val() != 'F') {
//    //    alert($("input[type='radio'][name='SelfDOB']:checked").text());
//    //    _error += "Please Self Gender\n";
//    //}
//    if ($("#AddPolicySpouse").attr('checked')) {
//      //  alert("poojaaa");
//        if ($("#SpouseDOB").val() == null || $("#SpouseDOB").val() == 0) {
//            _error += "Please Select Spouse Date Of Birth.\n ";
//        }
//        if ($("input[type='radio'][name='SpouseGender']:checked").val() != 'M'
//                  && $("input[type='radio'][name='SpouseGender']:checked").val() != 'F') {
//            alert("pppppppp");
//            _error += "Please Select Spouse Gender\n";
//        }
//    }
//    if ($("#AddPolicyFather").attr('checked')) {
//       // alert("ghgjgjghjgjghjhg");
//        if ($("#FatherDOB").val() == null || $("#FatherDOB").val() == 0) {
//            _error += "Please Select Father Date Of Birth.\n ";
//        }
        
//    }
//    if ($("#AddPolicyMother").attr('checked')) {
//        if ($("#MotherDOB").val() == null || $("#MotherDOB").val() == 0) {
//            _error += "Please Select Mother Date Of Birth.\n ";
//        }
//    }
    
//    if ($("#AddPolicyKids").attr('checked')) {
//        var noschild = $("#NumberOfChild option:selected").val();
//        if (noschild > 0) {
           
//            if ($("#Kid1DOB").val() == null || $("#Kid1DOB").val() == 0) {
//                _error += "Please Select Kid1 Date Of Birth.\n ";
//            }
//            if ($("input[type='radio'][name='Kid1Gender']:checked").val() != 'M'
//                 && $("input[type='radio'][name='Kid1Gender']:checked").val() != 'F') {
//                // alert("shdksh");
//                _error += "Please Select Kid1 Gender\n";
//            }
//        }
//        if (noschild > 1) {
//            if ($("#Kid2DOB").val() == null || $("#Kid2DOB").val() == 0) {
//                _error += "Please Select Kid2 Date Of Birth.\n ";
//            }
//            if ($("input[type='radio'][name='Kid2Gender']:checked").val() != 'M'
//                 && $("input[type='radio'][name='Kid2Gender']:checked").val() != 'F') {
//                // alert("shdksh");
//                _error += "Please Select Kid2 Gender\n";
//            }
//        }
//        if (noschild > 2) {
//            if ($("#Kid3DOB").val() == null || $("#Kid3DOB").val() == 0) {
//                _error += "Please Select Kid3 Date Of Birth.\n ";
//            }
//            if ($("input[type='radio'][name='Kid3Gender']:checked").val() != 'M'
//                 && $("input[type='radio'][name='Kid3Gender']:checked").val() != 'F') {
//                // alert("shdksh");
//                _error += "Please Select Kid3 Gender\n";
//            }
//        }

//        if (noschild > 3) {
//            if ($("#Kid4DOB").val() == null || $("#Kid4DOB").val() == 0) {
//                _error += "Please Select Kid4 Date Of Birth.\n ";
//            }
//            if ($("input[type='radio'][name='Kid4Gender']:checked").val() != 'M'
//                 && $("input[type='radio'][name='Kid4Gender']:checked").val() != 'F') {
//                // alert("shdksh");
//                _error += "Please Select Kid4 Gender\n";
//            }
//        }

//    }
//    if (_error.length > 0) {
//        alert(_error);
//        return false;
//    }
//    else {
//        return true;
//    }
//}