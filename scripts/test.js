
var tweets = [];

var now = Date.now();

var timer;


$(function () { 

    $('#liveButton').bind('click', function(e){
        $('div.live').css('display', 'block');
        $('div.schedule').css('display', 'none');
    });

    $('#comingButton').bind('click', function(e){
        $('div.live').css('display', 'none');
        $('div.schedule').css('display', 'block');
    });


    loadTweets();



});






function loadTweets() {

    $.ajax({
        url: 'http://whatsonmeerkat.com/api/twitter/recent',
        jsonp: 'callback',
        dataType: 'jsonp',
        success: function( data ) {

            
            for (var i in data.data) {

                var streamItem = data.data[i];

                streamItem.created_at = Date.parse(streamItem.created_at);
                tweets.push(streamItem);
                addStreamItemToHtml(streamItem, i);
            }

            timer = setInterval(refreshAllTimes, 1000);

        }
    });

    console.log('22222');


    // $.getJSON('http://whatsonmeerkat.com/api/twitter/recent?callback=abc', 
    //     {format: 'jsonp'}
    // );


}





function addStreamItemToHtml(streamItem, index) {

    // console.log(streamItem, 'sdfdsfdsf');
    
    var outputString = '';
    var timeDiff = Math.round((now - streamItem.created_at)/1000);
    var profileImgURL = streamItem.user.profile_image_url;

    outputString += '<a href="'+ streamItem.entities.urls[0].expanded_url +'">';
    outputString += '<div class="oneStream">';
    outputString += '<span class="time" id="time'+ index +'">'+ hMSString(timeDiff, false) +'</span>';
    outputString += '<img class="twitterProfileImage" src="'+ profileImgURL +'" />';
    // outputString += '<span class="name">'+ streamItem.user.name +'</span>';
    outputString += '<span class="text"><b>' + streamItem.user.name + '</b> ' + streamItem.text +'</span>';
    outputString += '</div>';
    outputString += '</a>';

    $(outputString).appendTo('div.live');

}




function hMSString(totalSec, hoursToggle) {
    var hours = parseInt( totalSec / 3600 ) % 24;
    var minutes = parseInt( totalSec / 60 ) % 60;
    var seconds = totalSec % 60;

    var lS = (seconds < 10) ? '0' : '';
    var lM = (minutes < 10) ? '0' : '';
    var lH = (hours < 10) ? '0' : '';

    if (!hoursToggle) {
        return lM + minutes + ':' + lS + seconds;
    } else {
        return lH + hours + ':' + lM + minutes + ':' + lS + seconds;
    }

}




function refreshAllTimes() {
    now = Date.now();
    tweets.forEach(function(streamItem, i) {
        var timeDiff = Math.round((now - streamItem.created_at)/1000);
        $('#time' + i).text(hMSString(timeDiff, false));
    });
}








