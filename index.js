const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

const users = [];

io.on('connection', function (socket) {
    socket.on('add user', function (username) {
        var user = {
            username,
            id: socket.id
        }
        users.push(user);
        
        //display online users
        io.emit('online users', users);
        
        //broadcast a message when user connects
        socket.broadcast.emit('display message', "<strong>" + user.username + "</strong>" + " connected");

        socket.on('submit message', function (msg) {
            //check if it is the private message
            for (var i = 0; i < users.length; i++) {
                if (!msg.toLowerCase().indexOf( "(" + users[i].username.toLowerCase() +")")) {
                    msg = msg.slice(users[i].username.toLowerCase().length+2)
                    socket.to(users[i].id).emit('display message', "<strong>" + user.username + "</strong>" + ": " + msg);
                    return;
                }
            }
            //if not -> send to all users
            socket.broadcast.emit('display message', "<strong>" + user.username + "</strong>" + ": " + msg);
        })
        //broadcast a message who is typing. Delete it in ${time} ms after last keyup
        socket.on('type', (time) => {
            clearTimeout(timer);
            socket.broadcast.emit("typing", "<strong>" + user.username + "</strong>");
            var timer = setTimeout(() => {
                socket.broadcast.emit("stop typing")
            }, time);
        })


        socket.on('disconnect', function () {
            //broadcast a message when user disconnect + delete from online users list
            socket.broadcast.emit('display message', "<strong>" + user.username + "</strong>" + " disconnected");
            users.splice(users.indexOf(user.username), 1);
            io.emit('online users', users);
        })
    })

})

app.use(express.static(__dirname + "/private"));
app.get('/', (req, res, next) => {
    res.sendFile(__dirname + "/private/index.html");
});

server.listen(3000, () => {
    console.log('Running...')
})
