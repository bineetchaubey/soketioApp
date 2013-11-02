var app					= require('http').createServer(handler),
	io					= require('socket.io').listen(app),
	fs					= require('fs'),
	// mysql				= require('mysql'),
	connectionsArray	= [];
	/*connection			= mysql.createConnection({
		host		: 'localhost',
		user		: 'root',
		password	: '',
		database	: 'nodejs'
	}),
	POLLING_INTERVAL = 3000,
	pollingTimer;

// If there is an error connecting to the database
connection.connect(function(err) {
  // connected! (unless `err` is set)
  console.log( err );
});*/
var host = "10.2.2.45";
// creating the server ( localhost:8000 )
app.listen(8123,host);

// on server started we can load our client.html page
function handler ( req, res ) {
	fs.readFile( __dirname + '/client.html' , function ( err, data ) {
		if ( err ) {
			console.log( err );
			res.writeHead(500);
			return res.end( 'Error loading client.html' );
		}
		res.writeHead( 200 );
		res.end( data );
	});
}



// creating a new websocket to keep the content updated without any AJAX request
/*io.sockets.on( 'connection', function ( socket ) {
	console.log('Number of connections:' + connectionsArray.length);
	// starting the loop only if at least there is one user connected
	if (!connectionsArray.length) {
		pollingLoop();
	}
	socket.on('disconnect', function () {
		var socketIndex = connectionsArray.indexOf( socket );
		console.log('socket = ' + socketIndex + ' disconnected');
		if (socketIndex >= 0) {
			connectionsArray.splice( socketIndex, 1 );
		}
	});
	console.log( 'A new socket is connected!' );
	connectionsArray.push( socket );
});*/


var connections = {};
 
io.sockets.on('connection', function(socket) {
	
	socket.on('message', function(data){
		newuser = connections[data.selfname];
		if(!newuser){
			// console.log(connections);
			
			for(var tmpSocket in connections){				
				connections[tmpSocket].emit('joinnew', data );
			}
		  connections[data.selfname] = socket; 
	    }

		target = connections[data.username];
		if (target) {
		   connections[data.username].emit( 'notification' , data );
		}

 	});
});








