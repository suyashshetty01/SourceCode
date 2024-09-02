$(function () {

    $('#top_content').load('/adminpanel/pages/layout/top.html');
    $('#left_right_content').load('/adminpanel/pages/layout/left_right.html');

    $('.loadPage').click(function () {

        //var type = $(this).href();
        //console.log($(this));
        alert('hi');
        //$('#main_content').load('/adminpanel/pages/' + type + '.html');
        ///adminpanel/pages/layout/default.html
    });
    var type = window.location.hash.substr(1);
    $('#main_content').load('/adminpanel/pages/' + type + '.html');

});