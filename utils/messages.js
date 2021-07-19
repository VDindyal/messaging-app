// Importing moment module to get current time for messages
const moment = require('moment');

// This function is to create a message object with hour and minute, AM or PM
function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
}

module.exports = formatMessage;