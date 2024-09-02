

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

    $(".Addon_pane").click(function (e) {

        var currenShow = $(this).parent().find(".show");
        var currentSection1 = $(this).parent().find(".section_pane1");
        $(this).parent().find(".section_pane1").slideToggle(function () {

            if (currentSection1.is(":visible") == true) {
                currenShow.text("Hide");
            } else {

                currenShow.text("Show");

            }

        });

    });

    $(".hidepane").click(function () {

        $(this).parent().parent().hide();
        $(".rightSide_Panel").css("width", "100%")


    })


    //    tooltip
    var getCurrentText = "";
    $(".infoTag").mouseover(function () {
        var getCurrentText = $(this).parent().find(".tooltext_detail").text();
        var getParentWidth = $(this).parent().width() - 20;
        var getPos = $(this).position();
        var pickerleftpos = getPos.left;
        var pickertoppos = getPos.top
        if (!getCurrentText) {
            return true;
        } else {
            $(this).append("<div class='toolTipBox'>" + getCurrentText + "</div>")
            //console.log(getParentWidth);
            console.log(pickerleftpos);
            $(".toolTipBox").css({ "width": getParentWidth, "margin-top": "8px" });

        }
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

});


// Minimize SidePane 
$(".minimize").click(function (e) {



})

// $(document).on('click','.slideRighttoLeft',function(){
//  alert("ddd");
// });


