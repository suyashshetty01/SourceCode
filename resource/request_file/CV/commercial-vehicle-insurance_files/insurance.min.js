$('#fuel li').on('click', function(){
    $('#fueltext').empty().append('Fuel Type :', $(this).text());
});

$('#variant li').on('click', function(){
    $('#varianttext').empty().append('Car Variant :', $(this).text());
});

$('#year li').on('click', function(){
    $('#yeartext').empty().append('Manufacturing Year :', $(this).text());
});

 

/*$(document).ready(function() {

	$('.tabs.slider .tab-links a').on('click', function(e)  {
		var currentAttrValue = $(this).attr('href');

    	// Show/Hide Tabs
		$('.tabs ' + currentAttrValue).slideDown(400).siblings().slideUp(400);
        $('.tab-content').show();

		// Change/remove current tab to active
		$(this).parent('li').addClass('active').siblings().removeClass('active');
		e.preventDefault();
	});

}); */


$(document).ready(function() {
    //variable where currentAnchor is stored
    var currentSection = 0;
    // hides the slickbox as soon as the DOM is ready
    $('.tab-content1 , .tab-content2 , .tab-content3').hide();
    // toggles the slickbox on clicking the noted link
    $('.tabs.slider .tab-links a').click(function() {

        $('.tabs.slider .tab-links a').removeClass('active');
        $(this).addClass('active');

        var href = $(this).attr('href');
        //hide all submenus
        $('.tab-content1>div , .tab-content2>div , .tab-content3>div').hide();

        //show one particular menu
        $(href).show();

        //logic for hiding and showing submenu
        if(currentSection == 0){
            $('.tab-content1 , .tab-content2 , .tab-content3').slideToggle(200);
            currentSection = href;
        }else if(currentSection == href){
             $('.tab-content1 , .tab-content2 , .tab-content3').slideToggle(200);
             currentSection = 0;
        }else{
            currentSection = href;
        }
        return false;
    });
});
