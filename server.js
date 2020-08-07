const express = require('express')
const dotenv = require('dotenv');
const colors = require('colors')
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json())
dotenv.config({path: './config/config.env'})

if (process.env.NODE_ENV == "development") {
    app.use(morgan('dev'))
}

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold))
const io = require('socket.io').listen(server);

let userNames = {};
let messages = [];

let playerDetails = {
	time: 0,
	videoID: 'euy6ZoFLIqA'
};

const playerOptions = {
	height: '360',
	width: '640',
	playerVars: {
		'autoplay': 0, 
		'controls': 0,
		'disablekb': 1,
		'modestbranding': 0,
		'rel': 0
	}
}

io.on('connection', function(socket){
  	// sending to the client
	socket.on('event', function(msg){
		const {time, value} = msg
		playerDetails.time = time
		playerDetails.videoID = value

		socket.broadcast.emit('event', msg)
	});

	socket.on('disconnect', function(){
		delete userNames[socket.id]
	});

	socket.on('updateTime', function(data){
		playerDetails.time = data.time;
	});

	socket.on('send-message', function(data){
		const {message,id} = data;
		let name = userNames[id];
		messages.push({name, message, id})

		io.emit('recieve-message', messages)
	});

	socket.on("register", function(data) {
		console.log('registered', data)
		const {name, id} = data;
		userNames[id] = name;

		socket.emit('all-messages', {messages})
		socket.emit('send-player-configs', {options: playerOptions, playerDetails})
		socket.broadcast.emit('register', {name,id, users:userNames});

		return true;
	});

	socket.on('get-messages', function() {
		socket.emit('all-messages', {message})
	})

});