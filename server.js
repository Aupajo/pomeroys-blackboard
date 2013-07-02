var util = require('util'),
    twitter = require('twitter');

var account = process.env.TWITTER_ACCOUNT;

var twit = new twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

twit.stream('user', { track: account }, function(stream) {
  stream.on('data', function(data) {
    console.log(util.inspect(data));
  });
});