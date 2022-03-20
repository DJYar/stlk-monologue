var oldVol = 1.0;

this.imagePreview = function(){	
	/* CONFIG */
		
		xOffset = 10;
		yOffset = 30;
		
		// these 2 variable determine popup's distance from the cursor
		// you might want to adjust to get the right result
		
	/* END CONFIG */
	$(".tip").hover(function(e){
		var tipData = ($(this).attr('tip') != "" ? $(this).attr('tip') : "");
		$("body").append("<div id='preview'>"+tipData+"</div>");								 
		$("#preview")
			.css("top",(e.pageY - xOffset) + "px")
			.css("left",(e.pageX + yOffset) + "px")
			.fadeIn("fast");						
    },
	function(){
		$("#preview").remove();
    });	
	$(".tip").mousemove(function(e){
		$("#preview")
			.css("top",(e.pageY - xOffset) + "px")
			.css("left",(e.pageX + yOffset) + "px");
	});			
};

function ChangeTheme( themeName, ambientVolume = 1 ) {
	console.log('Switching theme to', themeName);
	
	if ($.isNumeric(ambientVolume) == false)
	{
		ambientVolume = oldVol;
	}
	
	$('#bgVideo').animate(
			{
				opacity: 0,
				volume: 0
			},
			{
				duration: 3000,
				complete: function() {
					var video = $('#bgVideo');
					var videoPath = "https://github.com/DJYar/stlk-monologue/blob/master/video/"+themeName+".mp4?raw=true";
					$("#bgVideoSrc").attr("src", videoPath);
					video[0].pause();
					video[0].load();
					video[0].oncanplaythrough = function() {
						video[0].play();
						$('#bgVideo').animate(
							{
								opacity: 1,
								volume: ambientVolume
							},
							{
								duration: 3000
							}
						);
					}
				}
			}
		);
	
	$('#bgAudio').animate(
			{
				volume: 0
			}, 
			{
				duration: 3000,
				complete: function() {
					var audio = $('#bgAudio');
					var audioPath = "music/"+themeName+".mp3";
					$("#bgAudioSrc").attr("src", audioPath);
					audio[0].pause();
					audio[0].load();
					audio[0].oncanplaythrough = function() {
						audio[0].play();
						$('#bgAudio').animate(
							{
								volume: oldVol
							}, 
							{
								duration: 3000
							}
						);
					};
				}
			}
		);
}

$(function() {
	
	// initial volumes
	$('#bgVideo')[0].volume = 0.8;
	$('#bgAudio')[0].volume = 0.8;
	
	// init sliders
	$("#music_vol").simpleSlider("setValue", 0.8);
	$("#bg_opacity").simpleSlider("setValue", 1.0);
	
	// fade in on start
	$(".content_wrapper").animate({ opacity: 1.0 }, { duration: 3000 });
	
	// music volume changed event handler
	$("#music_vol").bind("slider:changed", function (event, data) {
		$('#bgAudio').animate({ volume: data.ratio }, { duration: 125 });
		oldVol = data.ratio;
	});
	
	// opacity changed event handler
	$("#bg_opacity").bind("slider:changed", function (event, data) {
		
		if (data.ratio == 0) {			/* disable scroll on full transparency */
			$(window).disablescroll();
		} else {
			$(window).disablescroll("undo");
		}
		
		$(".content_wrapper").animate({ opacity: data.ratio }, { duration: 100 });
	});
	
	$('.switch').bind('appear', function(e) {
		if (window.current_theme != $(this).attr('theme'))
		{
			window.current_theme = $(this).attr('theme');
			ChangeTheme(window.current_theme, $(this).attr('vol'));
		}
	});
	
	$('#compare').twentytwenty(
		{
			no_overlay: true,
			move_with_handle_only: false,
			click_to_move: true
		});
		
	sp_content = $('.sp_content');
	sp_title = $('.sp_title');
	sp_content.hide();
	sp_title.on('click',function() {
		inx = $('.sp_title').index(this);
		$(sp_content[inx]).slideToggle(100);
	});

	imagePreview();
});