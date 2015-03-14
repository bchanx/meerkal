var express = require('express');
var router = express.Router();
var url = require('url');
var Twitter = require('twitter');

var client = null;

var getClient = function() {
  if (!client) {
    client = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });
  }
};

var TWEETS = [];
var SINCE_ID = 0;

router.get('/search-fake', function(req, res) {
  res.json({
    error: null,
    data: [{
      created_at: "Sat Mar 14 06:36:04 +0000 2015",
      id: "576632869646290944",
      text: "#Meerkat foundr talks abt his apps meteoric rise his crazy sle... #BenRubin #twitter #Twitters http://t.co/qzsHuNoawR",
      retweet_count: 0,
      favorite_count: 0,
      entities: {
        hashtags: [{
          text: "Meerkat",
          indices: [0, 8]
        }, { 
          text: "BenRubin",
          indices: [66, 75]
        }, { 
          text: "twitter",
          indices: [76, 84]
        }, { 
          text: "Twitters",
          indices: [85, 94]
        }],
        symbols: [],
        user_mentions: [],
        urls: [{
          url: "http://t.co/qzsHuNoawR",
          expanded_url: "http://gkgk.us/1Bgq5tE",
          display_url: "gkgk.us/1Bgq5tE",
          indices: [95, 117]
        }]
      },
      user: {
        id: "558793567",
        name: "Geek Gawk",
        screen_name: "GeekGawk",
        followers_count: 1600,
        friends_count: 154,
        profile_image_url: "http://pbs.twimg.com/profile_images/477245104193679360/hIcZs-ya_normal.png"
      }
    }]
  });
});

router.get('/search', function(req, res) {
  getClient();
  var params = {
    q: '#meerkat',
    count: 25,
    since_id: SINCE_ID
  };
  console.log("-->> PARAMS: ", params);
  client.get('/search/tweets', params, function(error, tweets, response) {
    if (error) {
      console.log(error);
      return res.json({
        error: error.message || 'Failed to search tweets for: ' + JSON.stringify(params)
      });
    }
    if (tweets.statuses) {
      var newTweets = [];
      tweets.statuses.forEach(function(t) {
        newTweets.push({
          created_at: t.created_at,
          id: t.id_str,
          text: t.text,
          retweet_count: t.retweet_count,
          favorite_count: t.favorite_count,
          entities: t.entities,
          user: {
            id: t.user.id_str,
            name: t.user.name,
            screen_name: t.user.screen_name,
            followers_count: t.user.followers_count,
            friends_count: t.user.friends_count,
            profile_image_url: t.user.profile_image_url
          }
        });
      });
      // Sort by most to least recent
      newTweets.sort(function(a, b) {
        if (a.created_at > b.created_at) {
          return -1;
        }
        if (a.created_at < b.created_at) {
          return 1;
        }
        return 0;
      });
      TWEETS = TWEETS.concat(newTweets);
    }
    console.log("-->> TWEETS LENGTH: ", TWEETS.length);

    // Update our since ID for the next query
    console.log(tweets.search_metadata);
    if (tweets.search_metadata && tweets.search_metadata.max_id_str) {
      SINCE_ID = tweets.search_metadata.max_id_str;
    }

    return res.json({
      error: null,
      data: TWEETS
    });
  })
});

module.exports = router;
