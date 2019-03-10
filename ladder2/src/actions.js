import axios from "./axios";

export async function receiveFriendsWannabes(id) {
    console.log("request happening");

    const friendsAndWannabes = await axios.get("/friends-and-wannabes");
    console.log("friendsandw", friendsAndWannabes);

    return {
        type: "FRIENDS_AND_WANNABES",
        friendsAndWannabes: friendsAndWannabes.data
    };
}

export async function unfriend(id) {
    await axios.post("/get-initial-status/" + id + "/unfriend");
    return {
        type: "UNFRIEND",
        id
    };
}

export async function acceptFriendship(id) {
    await axios.post("/get-initial-status/" + id + "/confirm");
    return {
        type: "ACCEPT_FRIEND",
        id
    };
}

export async function receiveOnlineUsers(users) {
    console.log("usersactionjs", users);

    return {
        type: "ONLINE_USERS",
        onlineUsers: users.onlineUsers
    };
}

export async function receiveJoinedUser(user) {
    return {
        type: "JOINED_USER",
        onlineUsers: user
    };
}

export async function removeUser(user) {
    console.log("userLEFT!!", user);

    return {
        type: "USER_LEFT",
        onlineUsers: user
    };
}

export async function receiveChatMessages(data) {
    return {
        type: "CHAT_MESSAGES",
        chatMessages: data.messages
    };
}

export async function chatMessage(message) {
    return {
        type: "CHAT_MESSAGE",
        chatMessage: message
    };
}
