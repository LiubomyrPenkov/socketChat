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
            //display that you are online only for other users(not for you)
            if (user.id === socket.id) return;
            list += '<p>' + user.username + '</p>';
        });
        $('#online').html(list);
    })
    $('#main form').submit(function () {
        if(!$('#message').val()) return;
        socket.emit('submit message', $('#message').val());
        //append message(to avoid sending it to the user that sent it himself )
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
