var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var log4js = require('log4js');
log4js.configure({
	appenders: { chat: { type: 'file', filename: 'logs/server.log'} },
	categories: { default: {	appenders: ['chat'], level: 'error'}},
	categories: { default: {	appenders: ['chat'], level: 'info'}},
	categories: { default: {	appenders: ['chat'], level: 'warn'}},
	categories: { default: {	appenders: ['chat'], level: 'debug'}}
});
var logger = log4js.getLogger('chat');
let users = 0;
let user = null;




app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});


app.get('/socket.io/socket.io.js', function(req, res){
	res.sendFile(__dirname + '/socket.io/socket.io.js');
});

io.on('connection', function(socket){
	logger.info('A user Connected to Socket');
	users++;
	console.log('A user Connected to Socket Online Users  : ' + users);
	socket.on('chat message', function(msg){
		let mssg = {"text": msg, "user": user};
		console.log('message : ' + mssg);
		io.emit('chat message', mssg);
		io.emit('online users', users);
	});
	socket.on('username', function(username){
		io.emit('username', username);
		console.log('username : ' + username);
		user = username;
		io.emit('online users', users);
	});
	socket.on('user_code', function(user_code){
		console.log('user_code : ' + user_code);
	});

	socket.on('disconnect', function(){
		users--;
		logger.info('user disconnected to Socket');
		console.log('user disconnected to Socket Online Users  : ' + users);
		io.emit('online users', users);
	});


})




http.listen(3000, function(){
	logger.info('Server Started');
	console.log('Server Started');
});

// app.listen(3000, '192.168.43.255');