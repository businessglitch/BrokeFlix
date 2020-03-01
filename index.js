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

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('event', function(msg){
    io.emit('event', msg)
  });
});