$(function () {
    var content = $('#content');
    var status = $('#status');
    var input = $('#input');

    var myColor = false;
    var myName = false;

    //var ws = new WebSocket('ws:' + window.location.href.substring(window.location.protocol.length));
    var ws = new WebSocket('ws:127.0.0.1:3000');

    ws.onopen = function () {
        status.text('username:');
    };

    ws.onmessage = function (message) {
        var json = JSON.parse(message.data);

        if (json.type === 'color') {
            myColor = json.data;
            status.text(myName + ': ').css('color', myColor);
        } else if (json.type === 'message') {
            addMessage(json.data.author, json.data.text, json.data.color, new Date(json.data.time));
        } 
    };

    input.keydown(function(e) {

        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (!msg) return;
            ws.send(msg);
            $(this).val('');
            if (myName === false) {
                myName = msg;
            } else {
                addMessageToDOM(msg);
            }

        }
    });


    function addMessage(author, message, color, date) {
        content.append('<div><img src="img/vincent.jpg" width="32"> </img>'
            + '<p class="name" style="color:' + color + '">' + author + '</p> '
            + '<p class="message">'
            + ' ---- ' + message + '</p>' + '<p class="time">' + date.getHours() + ':'
            + (date.getMinutes()<10 ? ('0'+ date.getMinutes()) : date.getMinutes()) + ':'
            + (date.getSeconds()<10 ? ('0' + date.getSeconds()) : date.getSeconds()) + '</p></div>'
        );
    }

    function addMessageToDOM(msg) {
        var date = new Date();
        content.append('<div><img src="img/vincent.jpg" width="32"> </img>'
            + '<p style="color:' + myColor + '">' + myName + '</p> '
            + '<p">'
            + ' ---- ' + msg + '</p>' + '<p class="time">' + date.getHours() + ':'
            + (date.getMinutes()<10 ? ('0'+ date.getMinutes()) : date.getMinutes()) + ':'
            + (date.getSeconds()<10 ? ('0' + date.getSeconds()) : date.getSeconds()) + '</p></div>')
    }
});
