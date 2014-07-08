var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs'),
    sys = require('sys'),
	Twit = require('twit'); 
 
app.listen(process.env.PORT || 5000);
 
var T = new Twit({
    consumer_key: '1bvvNuNE6x2rcfjD6LdZIIgK2'
  , consumer_secret: 'mL0eexKsDEvGacZyYRvWESFkDYNK20PO5Dn4kjio4CsnYee00a'
  , access_token: '2555415415-1af8frPHZMXTjEM5GSNXF0lOoQ6gFAG8l4cX5ad'
  , access_token_secret: 'ZE82pyIZjeksmIHP6G32QfJlJeBtYM5COWtUTZoihreYS'
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
var stream; //defined here so I cann call it to stop later
var skippabletweets = [];

function streamSearched(ricerca, id) {
	stream = T.stream('statuses/filter', { track: ricerca })
		
	stream.on('connected', function (response) {
	  io.sockets.in(id).emit('connected');
	  console.log("CONNESSO");
	});
	
	console.log(id);
	console.log(ricerca + " tweet");
		
		
		stream.on('tweet', function (tweet) {
		   		    
		    io.sockets.in(id).emit('tweet', tweet.text, tweet.user.followers_count, tweet.user.profile_link_color);
		});
		
		stream.on('limit', function (limitMessage) {
		  console.log('Limit message: '+limitMessage);
		})
	
	
};

//Opens the connection with the client, gets ready to recive a search term (trough prompt on client-side) and passes search-termn and client-id to the streamSearched function.

io.sockets.on('connection', function(client) {
		client.on('search', function(searchterm) {
				console.log(searchterm);
					console.log(client.id);
						streamSearched(searchterm, client.id);
		
		client.on('disconnect', function () {
			console.log('client disconnected');
			stream.stop();
			//Trova un modo di fermare lo stream per lo specifico client
			//var stream = T.stream();
			//stream.stop();
			});					
		
	});


});