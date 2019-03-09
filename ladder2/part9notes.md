part9notes
1. Server
    1. In connection event, send list of 10 most recent chat messages to the socket that just connected
        * list may be kept in a db table or in an array
        * if messages are in an array, make sure the length of the array never exceeds 10
    2. In connection event, listen for the chatMessage event that will be sent by the client
        * When the event is received, add the message to the list of messages (i.e., either do INSERT or `push` into array)
        * send the message (emits chatMessage event) including sender info to ALL sockets (`io.emit` or `io.sockets.emit`)
2. Client
    1. add listener for chatMessages event
        * dispatch action that causes the array of messages to be put into the state (similar to "RECEIVE_FRIENDS_WANNABES" and "ONLINE_USERS")
    2. add listener for chatMessage event
        * dispatch action that causes the new message to be added to the array of messages (similar to "USER_JOINED")
    3. `Chat` component
        * is connected and gets the chatMessages from Redux state
        * renders the chat messages
        * renders a textarea with a mechanism for sending message
        * when user sends the message
            * gets the socket using the function exported by ./socket.js
            * emits the event with the text from the textarea in it
            * [OPTIONAL] scrolls down to last message when message is added