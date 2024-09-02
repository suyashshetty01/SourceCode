$(document).ready(function () {
    $(".titile_pane").click(function (e) {
        var currenHide = $(this).parent().find(".hide");
        var currentSection = $(this).parent().find(".section_pane");
        $(this).parent().find(".section_pane").slideToggle(function () {
            if (currentSection.is(":visible") == true) {
                currenHide.text("Hide")
            } else {
                currenHide.text("Show")
            }
        });
    })

    $(".hidepane").click(function () {
        $(this).parent().parent().hide();
        $(".rightSide_Panel").css("width", "100%")
    })

    //    tooltip
    var getCurrentText = "";
    $(".infoTag").mouseup(function () {
        $('.Load_sec').show();
        var note = ['25000', '30000', '50000', '100000', '250000', '300000', '500000'];
        var tpslide = document.getElementById("tpslide");
        var tooltiptext = document.getElementById("tooltiptext");
        tooltiptext.innerHTML = note[tpslide.value];
        $("#SumInsured").val(note[tpslide.value]);
        tpslide.oninput = function () {
            tooltiptext.value = tpslide.text;
        }
        var getCurrentText = $(this).parent().find(".tooltext_detail").text();
        var getParentWidth = $(this).parent().width() - 20;
        var getPos = $(this).position();
        var pickerleftpos = getPos.left;
        var pickertoppos = getPos.top
        if (!getCurrentText) {
            return true;
        } else {
            $(this).append("<div class='toolTipBox'>" + getCurrentText + "</div>")
            console.log(pickerleftpos);
            $(".toolTipBox").css({ "width": getParentWidth, "margin-top": "8px" });

        }
        eventsubmmision(3, 'SumInsured', 'USD ' + $('#SumInsured').val(), 'event Sum Insured', null);
        ;
        var parm = document.getElementById("SumInsured");
        var SumInsuredText = parm.value;
        $("#SumInsuredtxt").append(SumInsuredText);
        
        document.forms[0].submit();
      
    })

    $(".infoTag").mouseout(function () {
        $(".toolTipBox").remove();
    })

    /*Range Slider*/
    $("input[Type='range']").change(function (e) {
        var currVal = $(this).val();
        console.log(currVal)
        $(this).parent().find(".tooltext_detail").text(currVal);
    })


    // Minimize SidePane 
    $(".minimize").click(function (e) {
    })

    // navbar 
    $(".mobicon").click(function (e) {
        $(".nav_links").toggle();
        alert("greem")
    });

    $("#btnContniue").click(function () {
        $("#M2DOB").val($("#Member2DOB").val());
        if (Validatediv1_Continue()==true)
        {
            document.forms[0].submit();
            return true;
        } else {
            return false;
        }
        //Validatediv1_Continue();
    });
});

function checkTextWithSpace(input) {
    
    var pattern = new RegExp('^[a-zA-Z ]+$');
    var dvid = "dv" + input[0].id;
    if (pattern.test(input.val()) == false) { $('#' + dvid).addClass('Error'); return false; }
    else { $('#' + dvid).removeClass('Error'); return true; }
}

function Validatediv1_Continue() {
   
    var Err = 0;
    var _ContactFirstName = $("#ContactFirstName").val();
    var _ContactFirstName1 = $("#ContactFirstName");
    var _ContactLastName = $("#ContactLastName").val();
    var _ContactMobile = $("#ContactMobile").val();

    if ($('#TripType').val() == "") {
        $('#dvTrip_type').addClass('inpErr');
        Err++;
    } else
    {
        $('#dvTrip_type').removeClass('inpErr');
    }

    if ($("#GeographicalAreaId").val() =="0") {
        $('#dvGeographicalAreaId').html('Please Select Geographical Area');
        $('#dvGeographicalAreaId').css('color', 'red');
        Err++;
    } else {
        $('#dvGeographicalAreaId').html('');
    }

    if (($("#DateofTravelStart").val() == "")) 
    {
        $("#dvDateofTravelStart").addClass('inpErr');
        Err++;
    } else {
        $("#dvDateofTravelStart").removeClass('inpErr');
    }

   
  
    if ($('#TripType').val() == "Single" || $('#TripType').val() =="")
    {
        if (($("#DateofTravelEND").val() == "")) {
            $("#dvDateofTravelEND").addClass('inpErr'); Err++;
        } else {
            $("#dvDateofTravelEND").removeClass('inpErr');
        }
    } 
        
        

    if (_ContactFirstName == "" || checkTextWithSpace(_ContactFirstName1) == false)
    { $("#ContactFirstName").addClass('inpErr'); Err++; }
    else {

        $("#ContactFirstName").removeClass('inpErr');
    }

    if (_ContactLastName == "") { $("#ContactLastName").addClass('inpErr'); Err++; }
    else { $("#ContactLastName").removeClass('inpErr');  }

    if (_ContactMobile == "" || !mobileValid(_ContactMobile)) {
        $("#ContactMobile").addClass('inpErr');
        Err++;
    } else { $("#ContactMobile").removeClass('inpErr'); }

    
    if($('#TripType').val() == "MULTI")
    {
        if (($("#MaximumDuration").val() == "0" || $("#MaximumDuration").val() == null)) {
            $("#maxdurationdiv").addClass('inpErr'); Err++;
        }else
        {
            $("#maxdurationdiv").removeClass('inpErr');
        }
    }

    var MemCount = $("#TravelMemberCount").val();
    for(var i=1; i<=MemCount;i++)
    {
        if($("#Member"+i+"DOB").val()=="")
        {
            $("#Member" + i + "DOB").addClass('inpErr');
            Err++;
        } else {
            $("#Member" + i + "DOB").removeClass('inpErr');
        }
    }

    if (Err > 0)
    {
        return false;
    } else {
        return true;
    }
  

}


function mobileValid(_Mobile) {
    var regMobile = new RegExp("^[1-9]{1}[0-9]{9}$");
    return regMobile.test(_Mobile);
}
function emailValid(_email) {
    var regEmail = /^[_\.0-9a-zA-Z-]+@([0-9a-zA-Z][0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}$/i;
    return regEmail.test(_email);
}
function nameValid(_str) {
    var reg = /^[a-zA-Z ]+$/;
    return reg.test(_str);
}
function passportValid(_number) {
    var reg = new RegExp("^[A-Z][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$");
    return reg.test(_number);
}


