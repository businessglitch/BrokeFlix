const express = require('express')
let app = express();
const path = require('path')
const PORT = process.env.PORT || 5000
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);



app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('index'))
server.listen(PORT, () => console.log(`Listening on ${ PORT }`))

let userNames = {};
let player = {
  time: 0
};

io.on('connection', function(socket){
  	// sending to the client


	//console.log('a user connected');
	socket.on('event', function(msg){
		console.log('msg', msg)
		io.emit('event', msg)
	});

	socket.on('disconnect', function(){
		//console.log('user disconnected', socket.id);
		delete userNames[socket.id]
	});

	socket.on('updateTime', function(data){
		console.log('data', data);
		player.time = data.time;
		
		io.to(data.id).emit('welcome', player);
	});

	socket.on('message', function(data){
		let name = userNames[data.id];
		//console.log("here",name);

		socket.broadcast.emit('all-messages', {name, message:data.message})
	});

	socket.on("register", function(data) {
		let userName = data.name;
		let userId = data.id;
		userNames[userId] = userName;

		socket.broadcast.emit('register', {name:userName, users:userNames, id: userId});

		return true;
	});

});