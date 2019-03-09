// socket.js
import * as io from "socket.io-client";
import {
    receiveOnlineUsers,
    receiveJoinedUser,
    removeUser,
    receiveChatMessages,
    chatMessage
} from "./actions";
let socket;

export function initSocket(store) {
    if (!socket) {
        socket = io.connect();

        // part 8 stuff
        socket.on("onlineUsers", users => {
            store.dispatch(receiveOnlineUsers(users));

            console.log("userssocket.js", users);
        });

        socket.on("userJoined", user => {
            console.log("user_jouined", user);

            store.dispatch(receiveJoinedUser(user));
        });

        socket.on("userLeft", user => {
            store.dispatch(removeUser(user));
        });

        socket.on("chatMessages", messages => {
            store.dispatch(receiveChatMessages(messages));
        });

        socket.on("messageSubmitted", function(data) {
            console.log("messageSubmitted!!!!!!");

            store.dispatch(messageSubmitted(data));
        });

        socket.on("chatMessage", function(data) {
            console.log("chatMessage!!!", data);
            store.dispatch(chatMessage(data));
        });
    } // close if
    return socket;
}
