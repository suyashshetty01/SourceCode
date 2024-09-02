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

    // tooltip
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
                //console.log(pickerleftpos);
                $(".toolTipBox").css({
                    "width": getParentWidth,
                    "margin-top": "8px"
                });

            }
    })

    $(".infoTag").mouseout(function () {

        $(".toolTipBox").remove();

    })

    // Minimize SidePane
    $(".minimize").click(function (e) {})

    // $(document).on('click','.slideRighttoLeft',function(){
    //  alert("ddd");
    // });

    // navbar
    // $(".mobicon").click(function (e) {
    // $(".nav_links").toggle();
    // alert("greem")

    // });
    $(".mobicon").click(function (e) {
        document.getElementById("navLink").style.width = "50%";
        $('#navLink').css('box-shadow', '0px 5px 3px 2px rgba(51,51,51,0.5)');
        $('.quote_container').addClass('fullscreen-container');
    });
    $(".closeNavbtn").click(function (e) {
        document.getElementById("navLink").style.width = "0px";
        $('#navLink').css('box-shadow', 'none');
        $('.quote_container').removeClass('fullscreen-container');
    });

});