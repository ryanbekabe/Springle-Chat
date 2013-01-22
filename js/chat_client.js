$(document).ready(function () {
    var socket;
    var server_url = 'ws://localhost:8080/'
    var protocol_identifier = 'chat';
    var nickname = 'Guest-' + Math.floor(Math.random()*100);
    
    $('#nickname-submit').click(function () {
        nickname = $('#nickname').val() !== '' ? $('#nickname').val() : nickname;
        openConnection();
        $('#chat-nickname-form').slideUp();
        $('#chat-container').fadeIn();
    });
    
    
    $('#send-btn').click(function () {
        var message = $('#msg-box').val();
        send_message(message);
        $('#msg-box').val('');
    });
    
    function openConnection() {
        socket = new WebSocket(server_url, protocol_identifier);

        socket.addEventListener("open", connection_established);
    }
    
    function connection_established(event) {
        introduce(nickname);
        socket.addEventListener('message', function (event) {
            message_received(event.data)
        });
    }
    
    function introduce(nickname) {
        var intro = {
            type: 'intro',
            nickname: nickname
        }
        
        socket.send(JSON.stringify(intro));
    }
    
    function message_received(message) {
        var message;
        
        message = JSON.parse(message);
        
        if (message.type === 'message') {
            var msg_string;
            
            msg_string  = '<div class="message">';
            msg_string += '    <span class="msg-from">' + message.nickname + '</span>';
            msg_string += '    <span class="msg-text">' + message.message + '</span>';
            msg_string += '</div>';
            
            $('#chat-log').append(msg_string);
            $("#chat-log").animate({
                scrollTop: $("#chat-log")[0].scrollHeight
            }, 1000);
        } else if (message.type === 'nicklist') {
            var chatter_list_html = '';
            
            for(var i in message.nicklist) {
                chatter_list_html += '<li>' + message.nicklist[i] + '</li>';
            }
            
            chatter_list_html = '<ul>' + chatter_list_html + '</ul>';
            
            $('#people-list-data').html(chatter_list_html);
        }
        
    }
    
    function send_message(message) {
        var message_to_send = {
            type: 'message',
            nickname: nickname,
            message: message
        };
        
        socket.send(JSON.stringify(message_to_send));
    }
});
