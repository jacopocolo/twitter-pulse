var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs'),
    sys = require('sys'),
	Twit = require('twit'); 
 
app.listen(5000);
 
var T = new Twit({
    consumer_key: 'z0eohrJHpzuN8Ollf4SmgJyPV'
  , consumer_secret: '9x7UQYJPBBKNUZ32nJydD4qi8NogRtFYZBJqC55JLRfqodh0K3'
  , access_token: '2555415415-ipzTiOcHMpOyK6NuYa5SFURxR9OjjbZcGgPyDU8'
  , access_token_secret: 'hyFYm6kY16CMVFtPI6miOS137wkMV3tod6XlSMn6EIXCQ'
});
 
function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
 
    res.writeHead(200);
    res.end(data);
  });
}
 
/*var tweet = io.of('tweet');*/
 
var stream = T.stream('statuses/filter', { track: 'nutella' })

stream.on('tweet', function (tweet) {
    io.sockets.emit('tweet', tweet.text);
    console.log(tweet.text);
});

/*twit.stream('statuses/filter', { track: 'nutella' }, function(stream) {
  stream.on('data', function (data) {
    io.sockets.emit('tweet', data.text);
    console.log('.');
  });
});*/