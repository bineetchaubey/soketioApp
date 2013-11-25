var	app = require('http').createServer(handler),
	io   = require('socket.io').listen(app),
	fs   = require('fs'),
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
var host = "localhost";
// creating the server ( localhost:8000 )
app.listen(8000,host);

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




var connections = {};
 
io.sockets.on('connection', function(socket) {
	
	socket.on('message', function(data){
		/**
		* First check that comming request is form new user  or exiting  user 
		* if comming request are form new user then push that user soket id in 
		* connections array with his name 
		* selfname (user name)
		*/
		newuser = connections[data.selfname];
		if(!newuser){
			// console.log(connections);
			
			for(var tmpSocket in connections){				
				connections[tmpSocket].emit('joinnew', data );
			}
		  connections[data.selfname] = socket; 
	    }
	    	/**  if username soket id  exist(ie user have active with his browser) send user(username) to that message 
		*  
		*   first check receiver(username) have a soket id available in then send that message to him
		*/

		target = connections[data.username];
		if (target) {
		   connections[data.username].emit( 'notification' , data );
		}

 	});
});








