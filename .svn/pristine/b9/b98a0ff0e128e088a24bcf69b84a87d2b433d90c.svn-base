if ($("#Product_Name") != null) {
    var Product_Name = $("#Product_Name").val();
    
    function SetToolTipContent(current_elememt) {
        var FieldName = current_elememt.attr("id");
        if (FieldName == "CarType") {
            FieldName = FieldName + "_" + current_elememt.val();
        }
        $.get('/Home/GetToolTip?FieldName=' + FieldName + "&Product=" + Product_Name, function (response) {
            var _content = $.evalJSON(response);
            if (_content.length > 0) {
                current_elememt.qtip({
                    content: _content,
                    position: { adjust: { screen: true }, corner: { target: 'topRight', tooltip: 'bottomLeft'} },
                    // Effects
                    show: {
                        when: {
                            target: false,
                            event: 'mouseover'
                        },
                        effect: {
                            type: 'slide',
                            length: 100
                        },
                        delay: 250,
                        solo: false,
                        ready: false
                    },
                    hide: {
                        when: {
                            target: false,
                            event: 'mouseout'
                        },
                        effect: {
                            type: 'slide',
                            length: 100
                        },
                        delay: 200,
                        fixed: false
                    },
                    style: { border: { width: 2, radius: 5 }, padding: 10, textAlign: 'left', tip: true, name: 'dark' }
                });
            }
        });
    }
    $('input[type=text]').each(function () {
        SetToolTipContent($(this));
    });
    $("select").each(function () {
        SetToolTipContent($(this));
    });
    $("input[type=radio]").each(function () {
        SetToolTipContent($(this));
    });
    $("input[type=checkbox]").each(function () {
        SetToolTipContent($(this));
    });
}