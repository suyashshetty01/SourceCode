$(document).ready(function(){
	$('.popbox').popbox();
	
	//input script
	var flag=0;
			$("input").focus(function(){
				flag=1;
			});
			
		$("input").blur(function(){
				//alert("hello");
			if(flag==1){
			if ($(this).val()!=""){$(this).next().next().css("background","#009ee3");}
				
			else {$(this).next().next().css("background","#ccc");}
			flag=0;
		}
				
	});
	
	//cover required script
	$('.health-insurance > div button').click(function(){
				var ssVal = $(this).text();
				var cval;
				if(ssVal.indexOf(" ")!= -1)
				{
				cval=ssVal.substr(0,ssVal.indexOf(" "));
				}
				else
				{
				cval=ssVal;
				}
				if(eval(cval)>=100)
				{
				cval=cval[0]+","+cval.substr(1,cval.length-1);
				}
				$('.cirle-price input').val(cval + ',00,000');
				
				$('.cirle-price input').next().next().css("background","#009ee3");
				
				$('.cirle-price input').addClass("used");
			});
			
			$('.health-insurance > div button').on('click', function(){
				$('.health-insurance > div button').removeClass('active');
				$(this).addClass('active');
			});
				
			$(".thumbnail").on ("click", function(){
				$(".thumbnail").removeClass("active");
				$(this).addClass("active");
				
			});	
			
			$('#media').carousel({
				pause: true,
				interval: 5000,
			 });
						
			$('#roomrent,#icurent,#prehosp,#posthosp,#daycare,#healthcheck,#ambulance,#ncb,#autorestore').click (function(){
				$(".tab1default,.tab2default,.tab3default,.tab4default,.tab5default,.tab6default,.tab7default,.tab8default,.tab9default").hide();
				$(".tab1default,.tab2default,.tab3default,.tab4default,.tab5default,.tab6default,.tab7default,.tab8default,.tab9default").removeClass("active in");
					$(".tab12default").hide();
					$(".tab11default").hide();
					$("#babycover1").parent().parent().removeClass("active");
				var id=$(this).attr("id");
				id=id+"1";
				$("#"+id).addClass("active in");
				$("#"+id).show();
				//alert("id: "+id);
			});	
			
			$("#babycover1,#bornbaby1").click(function(){
				if($(this).attr("id")=="babycover1")
				{
					$(".tab1default,.tab2default,.tab3default,.tab4default,.tab5default,.tab6default,.tab7default,.tab8default,.tab9default").hide();
					$(".tab12default").hide();
					$(".tab11default").show();
					$(".tab11default").addClass("active in");
					$(".tab12default").removeClass("active in");
				}
				else
				{
					$(".tab1default,.tab2default,.tab3default,.tab4default,.tab5default,.tab6default,.tab7default,.tab8default,.tab9default").hide();
					$(".tab12default").show();
					$(".tab11default").hide();
					$(".tab12default").addClass("active in");
					$(".tab11default").removeClass("active in");
				}
				$("#babycover1").parent().parent().addClass("active");
		
			});
	
	
	
	//input on blur script
	$('input,textarea').blur(function () {
				var $this = $(this);
				if ($this.val())
					$this.addClass('used');
				else
					$this.removeClass('used');
			});

			var $ripples = $('.ripples');

			$ripples.on('click.Ripples', function (e) {

				var $this = $(this);
				var $offset = $this.parent().offset();
				var $circle = $this.find('.ripplesCircle');

				var x = e.pageX - $offset.left;
				var y = e.pageY - $offset.top;

				$circle.css({
					top: y + 'px',
					left: x + 'px'
				});

				$this.addClass('is-active');

			});

		$ripples.on('animationend webkitAnimationEnd mozAnimationEnd oanimationend MSAnimationEnd', function (e) {
			$(this).removeClass('is-active');
	});
	
	
	
	
		//dropdown script 
		$('select.form-control').css({
					'font-size':'13px','padding-top':'8px','border-bottom': '1px solid #aaabab','background':'url(images/dropdown-img.png) transparent right no-repeat','background-position':'bottom right'
				});
			
				$('.selectbox-highlight').hide();
				$('select').on('change', function(){
					//debugger;
					var ThisValue = $('option:selected', this).html();
					
					if(ThisValue == "RELATION" || ThisValue == "CNG / LPG KIT") {
						$(this).prev('.selectbox-highlight').hide();
					}
					else {
						$(this).prev('.selectbox-highlight').show();
					}
				});
				
				
			var windowWidth = $(window).width();
				
				if (windowWidth < 1920){
					$('select.form-control').on('change', function(){
					
						var ThisValue = $('option:selected', this).html();
						if (ThisValue == "RELATION" || ThisValue == "CNG / LPG KIT") {
							$(this).css({
								'font-size':'13px','padding-top':'8px','border-bottom': '1px solid #aaabab','background':'url(images/dropdown-img.png) transparent right no-repeat','background-position':'bottom right'
							});
						}
						
						else {
							$(this).css({
								'font-size':'15px','padding-top':'20px','border-bottom': '1px solid #009ee3','background':'url(images/dropdown-img-hover.png) transparent right no-repeat','background-position':'bottom right','box-shadow':'none'
							});
						}						
					});
				}

			
			
		//datepicker active span class
		$('.date-img-activity').on('click', function () {
			var thisVal = $(this).val();
			if (thisVal == "") {
				return false;
			} else {
				$(this).siblings('span').addClass('active');
			}
		});
		
		$('span').on('click', function(){
			$(this).siblings('input').trigger('click');
		});
		
		$('.time-img-activity').on('click', function(){
			
			$(this).siblings('span').addClass('active');			
		});
		
		$('#datepicker,#datepicker1').on('click', function(){
			
			$(this).siblings('div.clearer').show();
	
			$(this).siblings('span').addClass('active');
			
			$(this).data('holdDate', $(this).val());
		})
		.on('dp.show', function() {
			
			$(this).val($(this).data('holdDate'));
			//useCurrent:true;
			//viewDate: true;
			//$('.bootstrap-datetimepicker-widget .datepicker-days td.active').trigger('click');
		});
		
			
			
		// on click add & remove same block
		$('.blank').click(function(){
				//$('.offline-quote > div').removeClass('offline-quote-active');
				if ($(this).hasClass('offline-quote-active')==false) {
				$(this).addClass('offline-quote-active');
				$(this).removeClass('offline-quote');
				}
				
				else {
				$(this).removeClass('offline-quote-active');
				$(this).addClass('offline-quote');
				}
		});
			
			
			
			
		//on click div change color style
		$('.scenario > div').click(function(){
			$('.scenario > div').removeClass('scenario-active');
			$(this).toggleClass('scenario-active');
		});
		
		
		
		
		
		
		
		//android mobile input value place up on keyboard 
		var origHeight = parseInt($(window).height());
        var changeHeight, keyboardHeight;
        $(window).on('resize', function (e) {
            if ($(document.activeElement).attr('type') === 'text' || $(document.activeElement).attr('type') === 'tel') {
 
                changeHeight = parseInt($(window).height());
                keyboardHeight = origHeight - changeHeight;
 
                var elePos = $(document.activeElement).parents().offset();
                var eleTopPos = elePos.top + 60;
 
                var eleBotPos = origHeight - eleTopPos;
 
                if (eleBotPos <= keyboardHeight) {
                    var toScroll = (keyboardHeight - eleBotPos) + 100;
                    $('body').animate({ scrollTop: toScroll + 'px' }, 800);
                }
            }
        });
		
		
		//switch button script
		$('.switch input').on('change', function() {
					var ischecked = $(this).is(':checked');
					if (ischecked == true) {
						$(this).parent().siblings().last().toggleClass('active');
						$(this).parent().siblings().first().toggleClass('active');
					} else {
						$(this).parent().siblings().last().toggleClass('active');
						$(this).parent().siblings().first().toggleClass('active');
					}
				});
				
				$('.buy-insurance > div button').on('click', function(){
					$('.buy-insurance > div button').removeClass('active');
					$(this).addClass('active');
				});
				
				
			
				
				
	});

	
	
	
	
	
	
	//datepicker
	$(function () {
			$( '#datepicker,#datepicker1,#datepicker2' ).datepicker({
				changeMonth:true,
				changeYear:true,
				dateFormat: 'dd-mm-yy',
				//yearRange: 'c-82:c',
			
				onSelect:function(date){
					
					if($("#datepicker").val()!= ""){
						$("#datepicker").next().next().css("background", "rgb(0, 158, 227)");
					}
					else {
						$("#datepicker").next().next().css("background", "#ccc");
					}
					
					if($("#datepicker1").val()!= ""){
						$("#datepicker1").next().next().css("background", "rgb(0, 158, 227)");
					}
					else {
						$("#datepicker1").next().next().css("background", "#ccc");
					}
				
				} 
			
			});
			//datepicker end
			
			//scrollbar start
			$(window).on("load",function(){
				
				$("#list .listtable").mCustomScrollbar({
					//setHeight:300,
					//setHeight: eval($("footer").offset().top - $("#list .listtable").offset().top) - 10,
					setHeight:340,
					theme:"minimal-dark"
					//theme:"dark-3"
					//theme:"inset-2-dark"
				});
				
				$("#myModal .modal-body").mCustomScrollbar({
					setHeight:340,
					theme:"minimal-dark"
				});
					
				//$("#accordion .panel-body").mCustomScrollbar({
				//	setHeight:300,
				//	theme:"dark-3"
				//});
					
				//$("#myTab .tab-pane").mCustomScrollbar({
				//	setHeight:180,
				//	theme:"inset-2-dark"
				//});
				
				
			});
			//scrollbar end
			
			//accordion panel icon change 
			function toggleChevron(e) {
			$(e.target)
				.prev('.panel-heading,.panel-heading1,.panel-heading2')
				.find("i.indicator")
				.toggleClass('glyphicon-triangle-top glyphicon-triangle-bottom');
		}
		$('#accordion').on('shown.bs.collapse', toggleChevron);
		$('#accordion').on('hidden.bs.collapse', toggleChevron);
		
		// Ripple-effect animation
				(function($) {
					$(".ripple-effect").click(function(e){
						var rippler = $(this);

						// create .ink element if it doesn't exist
						if(rippler.find(".ink").length == 0) {
							rippler.append("<span class='ink'></span>");
						}

						var ink = rippler.find(".ink");

						// prevent quick double clicks
						ink.removeClass("animate");

						// set .ink diametr
						if(!ink.height() && !ink.width())
						{
							var d = Math.max(rippler.outerWidth(), rippler.outerHeight());
							ink.css({height: d, width: d});
						}

						// get click coordinates
						var x = e.pageX - rippler.offset().left - ink.width()/2;
						var y = e.pageY - rippler.offset().top - ink.height()/2;

						// set .ink position and add class .animate
						ink.css({
						  top: y+'px',
						  left:x+'px'
						}).addClass("animate");
					})
				})(jQuery);	
	
		
	});

