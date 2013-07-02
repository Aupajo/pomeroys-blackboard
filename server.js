var util = require('util'),
    twitter = require('twitter'),
    http = require('http'),
    url = require("url"),
    path = require("path"),
    fs = require("fs");

var account = process.env.TWITTER_ACCOUNT,
    port = process.env.PORT,
    public_dir = 'public';

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

http.createServer(function (request, response) {
  
  var uri = url.parse(request.url).pathname,
      filename = path.join([process.cwd(), public_dir].join('/'), uri);
  
  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }
 
    if (fs.statSync(filename).isDirectory()) {
      filename += '/index.html';
    }
 
    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }
 
      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });

}).listen(port);

console.log('Server running on port', port);