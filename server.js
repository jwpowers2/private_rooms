var express = require('express'),
  app = express(),
  http = require('http'),
  socketIO = require('socket.io'),
  md5 = require('MD5'),
  server, io;

app.get('/', function (req,res){
	res.sendFile(__dirname + '/index.html');
});

server = http.Server(app);
server.listen(5000);

io = socketIO(server);

io.on('connection', function(socket){

    var privatePassword = md5("password");

    socket.on('join.group', function(data){
    	if(md5(data.password) !== privatePassword){
    		socket.emit('message.posted', {
    			type:'danger',
    			message:'Invalid password'
    		});
    	} else {
    	    socket.join('secret group');
    	    socket.emit('join.group.success');
        }
    });

    socket.on('message.post', function(data){
    	io.to('secret group').emit('message.posted',{
    		type:'muted',
    		message:data.message
    	});
    });

	setInterval(function(){
		
		socket.emit('seconds.update', {
			time: new Date()
		});
	},2000);
});