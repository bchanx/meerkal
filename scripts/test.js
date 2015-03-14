


$(function () {	

	$('#liveButton').bind('click', function(e){
		$('div.live').css('visibility', 'visible');
		$('div.schedule').css('visibility', 'hidden');
	});

	$('#comingButton').bind('click', function(e){
		$('div.live').css('visibility', 'hidden');
		$('div.schedule').css('visibility', 'visible');
	});

});