// Access the chat window, messages, room name, and user names by bringing in the dom elements
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from url using qs cdn from chat.html
const {username, room} = Qs.parse(location.search, {
    //Ignore characters that are not username or room
    ignoreQueryPrefix: true
});

// Allow socket.io to be used to catch and emit data from client side
const socket = io();

// Event to capture username and room joined to send to server.js
socket.emit('joinRoom', {username, room});

// Get room and users from server to create functions for display the room name and users in it
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
})

// Catch message event sent from server.js and send to client side
socket.on('message', message => {
    outputMessage(message);
    // Scroll the chatroom down every time there is a new message based on the height
    chatMessages.scrollTop = chatMessages.scrollHeight
});

// Submitting a message event listener
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //Getting the message based on it's ID and storing it's value
    const msg = e.target.elements.msg.value

    // Emitting a message to the server
    socket.emit('chatMessage', msg);

    // Clear the message typing area after user sends a message
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Function to handle changing the div every time a user sends a message, which will display it in the chat room box
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    // Dom manipulation
    div.innerHTML = `	<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div)
}

// Add the room name through dom manipulation
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users through dom manipulation by mapping out and looping through all users and displaying them
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}