export default function(state = {}, action) {
    console.log("action", action.id);

    if (action.type == "FRIENDS_AND_WANNABES") {
        state = {
            ...state,
            friendsAndWannabes: action.friendsAndWannabes
        };
    }

    if (action.type == "UNFRIEND") {
        state = {
            ...state,
            friendsAndWannabes: state.friendsAndWannabes.filter(friend => {
                return friend.id !== action.id;
            })
        };
    }

    if (action.type == "ACCEPT_FRIEND") {
        state = {
            ...state,
            friendsAndWannabes: state.friendsAndWannabes.map(friend => {
                if (friend.id == action.id) {
                    console.log("hello");

                    friend.accepted = true;
                }
                return friend;
            })
        };
    }

    if (action.type == "ONLINE_USERS") {
        console.log("action.onlineUsers", action.onlineUsers.onlineUsers);

        state = {
            ...state,
            onlineUsers: action.onlineUsers
            // onlineUsers: action.onlineUsers.onlineUsers[0].url
        };
    }

    if (action.type == "JOINED_USER") {
        console.log("action", action);

        state = {
            ...state,
            onlineUsers: state.onlineUsers.concat(
                action.onlineUsers.joinedUser[0]
            )
        };
    }

    if (action.type == "USER_LEFT") {
        console.log("actionuserleft", action);

        state = {
            ...state,
            onlineUsers: state.onlineUsers.filter(
                user => user.id != action.onlineUsers.id
            )
        };
    }

    if (action.type == "CHAT_MESSAGES") {
        state = {
            ...state,
            chatMessages: action.chatMessages
        };
    }

    if (action.type == "CHAT_MESSAGE") {
        console.log("action.chatmessage", action.chatMessage);

        state = {
            ...state,

            chatMessages: state.chatMessages.concat(action.chatMessage)
        };
    }

    return state;
}
