$(document).ready(function () {
    $("#InsuredDOB").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-82:c',
        dateFormat: 'dd-mm-yy',
        minDate: new Date((new Date()).getFullYear() - 85, (new Date()).getMonth(), 1),
        maxDate: '-18y'
    });
    $("#OccupationCategoryId").change(function () {
        var _selectedItem = $("#OccupationCategoryId option:selected").val();

        Abc(_selectedItem);
    });
   

    function ShowHidePolicyFor(_value) {
        if (_value == "Parents") {
            $("#trMaritalStatus").hide('slow', function () { })
            $(".trFather").show('slow', function () { })
            $(".trMother").show('slow', function () { })
            $(".trSelf").hide('slow', function () { })
            $(".trSpouse").hide('slow', function () { })
            $("#trChild").hide('slow', function () { })
            ShowHideChilds(0);
        }
        else {
            $("#trMaritalStatus").show('slow', function () { })
            $(".trFather").hide('slow', function () { })
            $(".trMother").hide('slow', function () { })
            $(".trSelf").show('slow', function () { })

            ShowHideChilds($("#NumberOfChild").val());
            ShowHideChildSpouse(GetRadioButtonSelectedValue($("input[name=MaritalStatus]")));
        }
        if (_value == "Parents" || GetRadioButtonSelectedValue($("input[name=MaritalStatus]")) == "Single") {
            FillPriority("Parents");
        }
        else {
            FillPriority("");
        }
    }
    $("input[name=MaritalStatus]").click(function () {
        ShowHideChildSpouse($(this).val());

        if ($(this).val() == "Single") {
            SetRadioButton($("input[name=PolicyFor]"), "Self");
            FillPriority("Parents");
        }
        else {
            FillPriority("");
        }
        $("#trError").hide('slow', function () { });
    });
    function ShowHideChildSpouse(_val) {
        //        alert(_val);
        if (_val == "") {
            _val = "Married";
        }
        if (_val == "Married") {
            if (GetRadioButtonSelectedValue($("input[name=SelfGender]")) == "M") {
                SetRadioButton($("input[name=SpouseGender]"), "F");
            }
            else if (GetRadioButtonSelectedValue($("input[name=SelfGender]")) == "F") {
                SetRadioButton($("input[name=SpouseGender]"), "M");
            }
            if (GetRadioButtonSelectedValue($("input[name=PolicyFor]")) != "Self" && GetRadioButtonSelectedValue($("input[name=PolicyFor]")) != "Parents") {
                $(".trSpouse").show('slow', function () { });
            }
        }
        else {
            $(".trSpouse").hide('slow', function () { })
            $("#SpouseSelect").removeAttr('checked');
        }
        if ((_val == "Married" || _val == "Divorced" || _val == "Widow") && GetRadioButtonSelectedValue($("input[name=PolicyFor]")) != "Self") {
            $("#trChild").show('slow', function () { })
            ShowHideChilds($("#NumberOfChild").val());
        }
        else {
            $("#trChild").hide('slow', function () { })
            ShowHideChilds(0);
        }
    }


    function ShowHideChilds(_child) {
        if (_child == 0) {
            $("#NumberOfChild").val(0);
        }
        for (var i = 1; i <= 4; i++) {
            if (i <= _child) {
                $(".trKid" + i).show('slow', function () { })
            }
            else {
                $(".trKid" + i).hide('slow', function () { })
                $("#Kid" + i + "Select").removeAttr('checked');
            }
        }
    }
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
function Abc(_selectedItem) {
    if (_selectedItem == 0) {
        $("#trAnnual").hide();
    }
    else if (_selectedItem == 1) {
        $("#trAnnual").show();
    }
    else if (_selectedItem == 4) {
        $("div#divAnnualIncomeLabel").text("Father's Annual Income");
        $("#trAnnual").show();
    }
    else if (_selectedItem == 2 || _selectedItem == 3 || _selectedItem == 5 || _selectedItem == 6) {
        $("div#divAnnualIncomeLabel").text("Annual Income");
        $("#trAnnual").show();
    }
    else {
        $("#trAnnual").hide();
    }
}