const express = require("express");
const app = express();
const server = require("http").Server(app);
// change origin when you want to put this online
const io = require("socket.io")(server, { origins: "localhost:8080" });
const compression = require("compression");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const db = require("./db");
var csurf = require("csurf");
const bcrypt = require("./bcrypt.js");
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");
const s3 = require("./s3.js");
const config = require("./config");

app.use((req, res, next) => {
    console.log(req.url);
    next();
});

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(bodyParser.json());
app.use(express.static("./public"));
// app.use(
//     cookieSession({
//       secret: `I'm always angry.`,
//       maxAge: 1000 * 60 * 60 * 24 * 14
//     })
//   );

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(compression());
app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

//add all of your other routes on top of this * route
// react router

app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/register", (req, res) => {
    console.log(req.body);
    const first = req.body.first;
    const last = req.body.last;
    const email = req.body.email;
    const password = req.body.password;

    db.createUser(first, last, email, password).then(({ rows }) => {
        req.session.userId = rows[0].id;
        req.session.email = email;
        console.log("reqsessionemail", req.session.email);
        res.json({ success: true });
    });
});

app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.getPassword(email).then(creds => {
        bcrypt.compare(password, creds.rows[0].password).then(bool => {
            if (bool == true) {
                console.log("userPassword", creds.rows[0]);
                req.session.email = email;
                console.log("reqsessionemail", req.session.email);

                req.session.userId = creds.rows[0].id;
                res.json({ success: true });
            }
        });
    });
});

app.get("/user", (req, res) => {
    const email = req.session.email;
    db.getUserData(email).then(data => {
        res.json(data.rows);
    });
});

app.get("/other/:id", (req, res) => {
    let userId = req.params.id;
    db.getOtherUserData(userId).then(data => {
        res.json(data.rows);
    });
});

app.get("/get-initial-status/:id", (req, res) => {
    db.getInitialFriendship(req.session.userId, req.params.id).then(data => {
        res.json({ data: data.rows, user: req.session.userId });
    });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const file = config.s3Url + req.file.filename;
    const email = req.session.email;

    db.addImage(file, email).then(({ rows }) => {
        res.json(rows[0]);
        console.log(rows[0]);
    });
});

app.post("/updatebio", (req, res) => {
    const bio = req.body.biodraft;
    const email = req.session.email;

    db.updateBio(bio, email).then(({ rows }) => {
        console.log(rows[0]);
        res.json(rows[0]);
    });
});

app.post("/get-initial-status/:id/add-friend", (req, res) => {
    db.addFriend(req.session.userId, req.params.id);
});

app.post("/get-initial-status/:id/unfriend", (req, res) => {
    console.log("params!!", req.params.id);

    db.unfriend(req.session.userId, req.params.id).then(() => {
        res.json({ success: true });
    });
});

app.post("/get-initial-status/:id/cancel-friend-request", (req, res) => {
    console.log("params!!", req.params.id);

    db.cancelFriendRequest(req.session.userId, req.params.id);
});

app.post("/get-initial-status/:id/confirm", (req, res) => {
    console.log("params!!", req.params.id);

    db.confirm(req.session.userId, req.params.id).then(() => {
        res.json({ success: true });
    });
});

app.get("/friends-and-wannabes", (req, res) => {
    db.getFriendList(req.session.userId)
        .then(data => {
            console.log("data!", data);

            res.json(data.rows);
        })
        .catch(error => {
            console.log(error);
        });
});

app.get("/ladder-data-1", (req, res) => {
    db.getLadderData1().then(data => {
        res.json(data.rows);
    });
});

app.get("/user-ladder-wins-data", (req, res) => {
    db.getUserLadderWinsData(req.session.userId).then(data => {
        res.json(data.rows);
    });
});

app.get("/user-ladder-losses-data", (req, res) => {
    db.getUserLadderLossesData(req.session.userId).then(data => {
        res.json(data.rows);
    });
});

app.get("/user-ladder-ranking-data", (req, res) => {
    db.getUserLadderRankingData(req.session.userId).then(data => {
        res.json(data.rows);
    });
});

app.get("/result-data-1/:user1/:user2", (req, res) => {
    db.getResultData1(req.params.user1, req.params.user2).then(data => {
        res.json(data.rows);
    });
});

app.post("/post-score", (req, res) => {
    db.postScore(
        req.body.winnerFirst,
        req.body.winnerId,
        req.body.loserId,
        req.body.companyId,
        req.body.winnerScore,
        req.body.loserScore
    );
});

app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, function() {
    console.log("I'm listening.");
});

// index.js

let onlineUsers = {};
// this object will keep track of who's online right now

io.on("connection", function(socket) {
    onlineUsers[socket.id] = socket.request.session.userId;

    console.log("socket.request.session: ", socket.request.session.userId);

    // Object.values takes all values out of an object
    // and puts them in an array
    console.log("onlineUsers", onlineUsers);

    let userIds = Object.values(onlineUsers);

    db.getUsersByIds(userIds).then(results => {
        // results then should be the first, last, and profile pics of every user in the userIds array
        // our end goal is to put results in redux

        socket.emit("onlineUsers", {
            onlineUsers: results.rows
        });
    });

    let filteredUsers = userIds.filter(
        id => id == socket.request.session.userId
    );
    console.log("filteredUsers~~~!!", filteredUsers);

    if (filteredUsers.length === 1) {
        db.getUserDataById(socket.request.session.userId).then(data => {
            console.log("newuser!!", data.rows);

            socket.broadcast.emit("userJoined", {
                joinedUser: data.rows
            });
        });
    }

    db.getMessages()
        .then(data => {
            socket.emit("chatMessages", {
                messages: data.rows.reverse()
            });
        })
        .catch(err => {
            console.log(err.message);
        });

    socket.on("disconnect", () => {
        var userLeft = onlineUsers[socket.id];
        delete onlineUsers[socket.id];
        userIds.splice(userIds.indexOf(userLeft), 1);
        if (userIds.indexOf(userLeft) == -1) {
            console.log("that just happpened! user left");

            io.sockets.emit("userLeft", {
                id: userLeft
            });
        }
    });

    // broadcast sends message to every connected socket
    // EXCEPT the one that just connected
    socket.broadcast.emit("myBroadcast", {
        food: "sirnica"
    });

    // io.sockets.emit sends a message to EVERYONE
    io.sockets.emit("everyPleaseReadThis", {
        message: "you are loved"
    });

    socket.on("messageSubmitted", message => {
        db.insertMessage(socket.request.session.userId, message.message).then(
            () => {
                io.sockets.emit("chatMessage", {
                    messages: message.message,
                    id: socket.request.session.userId
                });
            }
        );
    });
});
