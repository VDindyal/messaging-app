// Creating array of all users
const users = [];

// Joining user to chat
function userJoin(id, username, room) {
    const user = {id, username, room};
    // Pushing user into users array
    users.push(user)
    return user
}

// Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// Remove user from the array when they leave
function userLeave(id) {
    // Get index where user is located in array of users
    const index = users.findIndex(user => user.id === id);

    // Check to see if user exists and then remove only that one user from array by splicing a new array
    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Function to get all users in that specific room
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};
