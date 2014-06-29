var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs'),
    sys = require('sys'),
	Twit = require('twit'); 
 
app.listen(process.env.PORT || 5000);
 
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

//The function grabs the search term trough ricerca parameter and the client.id trough the id paramenter.

function streamSearched(ricerca, id) {
	var stream = T.stream('statuses/filter', { track: ricerca })
	
	console.log(id);
	console.log(ricerca + " tweet");
		stream.on('tweet', function (tweet) {
		    console.log(tweet.text);
		    io.sockets.in(id).emit('tweet', tweet.text);
		});
	
};

//Opens the connection with the client, gets ready to recive a search term (trough prompt on client-side) and passes search-termn and client-id to the streamSearched function.

io.sockets.on('connection', function(client) {
		client.on('search', function(searchterm) {
				console.log(searchterm);
					console.log(client.id);
						streamSearched(searchterm, client.id);
	});
});