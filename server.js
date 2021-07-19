// Importing path module to use to link folders, import http to setup server, import express to create app, and socket.io for real time messaging
const path  = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

// Assigning express to a variable, use http module to create server that is running the express app, set io variable to pass in server
const app = express();
const server = http.createServer(app);
const io = socketio(server)

// Set static public folder
app.use(express.static(path.join(__dirname, 'public')));

// Create bot for server messages

const botName = 'Admin Bot'

// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {
        // Create new user object using the socket id as id, and username/room from url
        const user = userJoin(socket.id, username, room);

        // User joins the room
        socket.join(user.room)

        // Welcome a new user when they join
        socket.emit('message', formatMessage(botName, 'Welcome to my Messaging App!'));

        // Broadcast is used to emit everyone except the user that is connecting to a specific room
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat!`));

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // Listen for user's messages in the specific chat room
    socket.on('chatMessage', (msg) => {
        // Use function from users file to get current user to display their name in chat room
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Run when a user disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has disconnected from chat!`));

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    });
});

// If there's an environment variable called PORT, use that variable else us 3000 as default
const PORT = process.env.PORT || 3000;

// Listening for port using express. Log it if the server is running.
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



