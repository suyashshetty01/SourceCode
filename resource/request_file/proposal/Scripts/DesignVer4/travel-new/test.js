var ins_name, imgName, po, cs, cu, pn, pd, cover, feature, bamt, period, indexNum;
var ins_name, imgName, po, pn, pd, cover, feature, bamt, period, indexNum;
    var CompareList = [];
    var DummyData = [{
            "id": "1",
            "ins": "Aditya Birla",
            "short": "AB",
            "po": "75",
            //"cs": "97.9",
            //"cu": "60",
            "SF": [
                "weaver of premium", "Early Claim on Terminal of illness", "Extra Payout on Accidental Death"
            ],
            "base": "711.08",
            "by": "8532",
            "pn": "Golden Plan",

        },
        {
            "id": "2",
            "ins": "Apollo Munich",
            "short": "AM",
            "po": "90",
            "cs": "93.9",
            "cu": "65",
            "SF": [
                "weaver of premium", "Early Claim on Terminal of illness", "Extra Payout on Accidental Death"
            ],
            "base": "961.08",
            "pn": "Silver Plan"

        },
        {
            "id": "3",
            "ins": "Aditya Birla",
            "short": "AB",
            "po": "75",
            "cs": "97.9",
            "cu": "60",
            "SF": [
                "weaver of premium", "Early Claim on Terminal of illness", "Extra Payout on Accidental Death"
            ],
            "base": "888.08",
            "pn": "Golden Life Plan"
        },
        {
            "id": "4",
            "ins": "Aditya Birla",
            "short": "AM",
            "po": "75",
            "cs": "97.9",
            "cu": "60",
            "SF": [
                "weaver of premium", "Early Claim on Terminal of illness", "Extra Payout on Accidental Death"
            ],
            "base": "999.08",
            "pn": "Golden Jublee Plan"
        },
        {
            "id": "5",
            "ins": "HDFC LIFE",
            "short": "hl",
            "po": "75",
            "cs": "97.9",
            "cu": "60",
            "SF": [
                "weaver of premium", "Early Claim on Terminal of illness", "Extra Payout on Accidental Death"
            ],
            "base": "999.08",
            "pn": "Golden Jublee Plan"
        },
    ]



    //function dynamism() {
    //    if (CompareList.length == 0) {
    //        $(".compare_wrap").hide(0);
    //    }

    //    for (i = 0; i < DummyData.length; i++) {

    //        ins_name = DummyData[i].ins;
    //        imgName = DummyData[i].short + ".png";
    //        pd = DummyData[i].po + " Lacs";
    //        claim = DummyData[i].cs + "%";
    //        cover = DummyData[i].cu + "Yrs";
    //        feature = DummyData[i].SF;
    //        bamt = Math.round(DummyData[i].base);
    //        pn = DummyData[i].pn;
    //        period = "month";
    //        var newStr;
    //        var spfeStr = feature.map(feature=>  "<li>"+feature+"</li>").toString();
            
    //        newStr = spfeStr.replace( ","," " );


    //        console.log(pn.length);
    //        if(pn.length < 15){

    //          var PlanName = pn.substring(0,15)  
    //          console.log(PlanName)

    //        }
    //        // Quote list

    //        $('.QuoteWrapper').append(
    //            //" <div class='quoteBox'><div class='inpl_det'><img src='./images/ins_logo/" + imgName + "'><span class='plan_name'>" + pn + "</span> <span class='comp'><label class='cb_cont'> <input type='checkbox'  class='cb'  title=" + i + "> <span class='tickmark'></span> </label></span> </div> <div class='pay_det' ><span>" + pd + "</span></div> <div class='clse_det'><span>" + claim + "<span class='mob'>Claims Setteled</span></div> <div class='coup_det'><span>" + cover + "</span></div> <div class='spfe_det'>" + newStr+ " </div> <div class='prem_det'> <span class='btn_box'> <span class='buytag'>BUY NOW</span> <span class='quote_val'>₹" + bamt + "</span> <span class='val_ins'>PREMIUM / " + period + "(INCL.TAX)</span> </span> <span class='more_info'>More Info</span> </div>"
    //            "<div class='quoteBox'><div class='inpl_det'><img src='./images/ins_logo/" + imgName + "'><span class='plan_name'>" + pn + "</span> <span class='comp'><label class='cb_cont'> <input type='checkbox'  class='cb'  title=" + i + "> <span class='tickmark'></span> </label></span> </div> <div class='pay_det' ><span>" + pd + "</span></div> <div class='clse_det'><span>" + claim + "<span class='mob'>Claims Setteled</span></div> <div class='coup_det'><span>" + cover + "</span></div> <div class='spfe_det'>" + newStr + " </div> <div class='prem_det'> <span class='btn_box'> <span class='buytag'>BUY NOW</span> <span class='quote_val'>₹" + bamt + "</span> <span class='val_ins'>PREMIUM / " + period + "(INCL.TAX)</span> </span> <span class='more_info'>More Info</span> </div>"
    //        )

    //    }

    //    $(".cb").click(function(e) {
    //        dataindex = $(this).attr("title");
    //        if ($(this).is(":checked")) {

    //            if (CompareList.length >= 3) {

    //                alert("Not More than 3")
    //                return false;

    //            } else {
    //                $(".compare_wrap").show(300)
    //                var listData = DummyData[dataindex];
    //                var cImg;
    //                var cpn;
    //                CompareList.push(listData);
    //                $(".cins_wrap").html("");
    //                for (i = 0; i < CompareList.length; i++) {

    //                    cImg = CompareList[i].short + ".png";
    //                    cpn = CompareList[i].pn;
    //                    $(".cins_wrap").append("<div class='cins'><span class='delete'><i class='fa fa-remove'></i></span><img src='./images/ins_logo/" + cImg + "' alt=''><span class='plan_name'>" + cpn + "</span></div>");
    //                }

    //            }

    //        } else if ($(this).is(":checked") == false) {
    //            if (CompareList.length - 1 == 0) {
    //                $(".compare_wrap").hide(300);
    //            }

    //            console.log(CompareList.length)

    //            //console.log("removing data from Comparelist"+dataindex)
    //            var serchID = DummyData[dataindex].id;
    //            var compInd = CompareList.findIndex(dataID => dataID.id === serchID);
    //            CompareList.splice(compInd, 1);
    //            console.log(CompareList);
    //            $(".cins_wrap").html("");
    //            for (i = 0; i < CompareList.length; i++) {

    //                cImg = CompareList[i].short + ".png";
    //                cpn = CompareList[i].pn;
    //                $(".cins_wrap").append("<div class='cins'><span class='delete'><i class='fa fa-remove'></i></span><img src='./images/ins_logo/" + cImg + "' alt=''><span class='plan_name'>" + cpn + "</span></div>");
    //            }

    //        }



    //    })


    //    $(".more_info").click(function(){

    //        // $(".compare_wrap").before("<div class='ovl'><div class='popupContainer'><div class='popupHeading'>Customize Quote<span class='popClose'>&times;</span></div><div class='popupSection'>Customize Your Quote.</div></div></div>")
    //        $(".ovl").show(100);
            

    //        $(".popClose").click(function(){

    //            $(".ovl").hide(100  );
    
    //        })

    //    })

        


    //}

