var util = require('util'),
    twitter = require('twitter'),
    url = require('url'),
    ejs = require('ejs'),
    express = require("express");

// Persistence
var redis;

if (process.env.REDISTOGO_URL) {
  var redisOptions = url.parse(process.env.REDISTOGO_URL);
  redis = require("redis").createClient(redisOptions.port, redisOptions.hostname);
} else {
  redis = require("redis").createClient();
}

redis.on("error", function (err) {
  console.log("Error " + err);
});

// Twitter
var twitterAccount = process.env.TWITTER_ACCOUNT;

var twit = new twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

twit.stream('user', { track: twitterAccount }, function(stream) {
  stream.on('data', function(data) {
    redis.set('lastTweet', JSON.stringify(data));
  });
});

// HTTP
var port = process.env.PORT || 5000;

var app = express();
app.engine('html', ejs.renderFile);
app.use(express.logger());
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  var locals = {
    lastTweet: redis.get('lastTweet'),
    inspect: util.inspect
  };

  response.render('index.ejs', locals);
});

app.listen(port, function() {
  console.log('Listening on ' + port);
});