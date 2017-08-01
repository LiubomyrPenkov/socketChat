$(function () {
    var socket = io();
    $('#auth form').submit(function () {
        if (!$('#user').val()) { return }
        socket.emit("add user", $('#user').val());
        $('#auth').hide();
        $('#main').show();
        $('#online').show();
        $('#typing').show();
        $('#info').show();
        return false;
    })

    socket.on("online users", (users) => {
        var list = '<p> Online users: </p>'
        users.forEach(function (user) {
            if (user.id === socket.id) return;
            list += '<div title = "send private message" id = `${user.id}`>' + user.username + '</div>';
        });
        $('#online').html(list);
    })
    $('#main form').submit(function () {
        if(!$('#message').val()) return;
        socket.emit('submit message', $('#message').val());
        $('#messages').append($('<li>').html('<strong>You: </strong>' + $('#message').val()))
        $('#message').val('');
        return false;
    });

    $("#main form input").keyup(() => {
        socket.emit('type', 5000);
    })

    socket.on('stop typing' , ()=>{
        $('#typing').html("");
    })

    socket.on('typing', (user) => {
        $('#typing').html(user + " is typing... ")
    })

    socket.on('display message', function (msg) {
        $('#messages').append($('<li>').html(msg));
    })
});
