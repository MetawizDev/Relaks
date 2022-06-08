const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const { getUser } = require('../services/auth.service');
const roles = require('../models/roles');

let io;

exports.connect = (server) => {
  try {    
    io = socketIO(server, {
      cors: {
        origin: '*',
      }
    });
  
    io.use((socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        socket.user = jwt.verify(token, process.env.SECRET);
        next();
      } catch (error) {
        console.log(error);
        next(error);
      }
    });
  
    io.on('connection', async (socket) => {
      const username = socket.user.username;
      console.log('New user connected: ', username);

      try {        
        const { role } = await getUser("username", username);
        if(role === roles.OWNER || role === roles.MANAGER) {
          socket.join(role);
        }
      } catch (error) {
        console.log(error);
      }
  
      socket.join(username); 
      io.to(username).emit('join', {rooms: socket.rooms});
  
      socket.on('disconnect', () => {
        console.log('disconnected from socket'); 
      });
    });
  } catch (error) {
    console.log(error);
  }
}

exports.emit = (event, data) => {
  if(io) {
    io.sockets.emit(event, data);
    console.log('[SENT TO ALL] ', event.toString());
  } else {
    console.log('io not initialized');
  }
}

exports.emitToRoom = (room, event, data) => {
  if(io) {
    io.to(room).emit(event, data);
    console.log('[SENT TO ROOM] ', room);
  } else {
    console.log('io not initialized');
  }
}