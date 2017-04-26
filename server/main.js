var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// insialisasi folder app
app.use(express.static('app'));

var messages = [
    {
        userId: 1,
        messageId: 10,
        userName: "Holowaychuck",
        content: {
            text: 'Hello world',
            link: 'http://google.com'
        }
    },
    {
        userId: 2,
        messageId: 11,
        userName: "SindraSornus",
        content: {
            text: 'Awesome Github',
            link: 'http://github.com'
        }
    },    
];

// buat rooting ke index untuk tes server
app.get('/', function(req, res) {
    res.send('hello world');
    console.log("Connected to express");
});

// buat koneksi ke socket.io
io.on('connection', function(socket) {
    console.log("connected to socket.io");
    // kirim message ke main.js - app
    socket.emit('messages', messages);
    // tambahkan data dari array message yg sdh ada
    socket.on('new-message', function(data) {
        messages.push(data);
        // kirim event ke main.js app
        io.sockets.emit("messages", messages)
    });
});

// set server berjalan di port 8000
server.listen(8000);