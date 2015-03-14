
var tweets = [];

var now = Date.now();


$(function () { 

    $('#liveButton').bind('click', function(e){
        $('div.live').css('visibility', 'visible');
        $('div.schedule').css('visibility', 'hidden');
    });

    $('#comingButton').bind('click', function(e){
        $('div.live').css('visibility', 'hidden');
        $('div.schedule').css('visibility', 'visible');
    });


    loadTweets();



});




function loadTweets() {

    $.getJSON( "api/twitter/recent", function( data ) {
        // data.data;

        var i = 0;
        for (var i in data.data) {

            var streamItem = data.data[i];

            streamItem.created_at = Date.parse(streamItem.created_at);
            tweets.push(streamItem);
            addStreamItemToHtml(streamItem, i);
        }

        // console.log(data.data[0]); 

        // var tweetTS = Date.parse(data.data[0].created_at);

        // console.log(hoursMinutesSecondsString(Math.round((now - tweetTS)/1000), true));

    });

}





function addStreamItemToHtml(streamItem, index) {

    console.log(streamItem);
    
    var outputString = '';
    var timeDiff = Math.round((now - streamItem.created_at)/1000);
    var profileImgURL = streamItem.user.profile_image_url;

    outputString += '<div class="oneStream">';
    outputString += '<span class="time" id="time'+ index +'">'+ hMSString(timeDiff, false) +'</span>';
    outputString += '<img class="twitterProfileImage" src="'+ profileImgURL +'" />';
    outputString += '</div>';

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













