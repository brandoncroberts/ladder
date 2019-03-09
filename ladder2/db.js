const spicedPg = require("spiced-pg");
const bcrypt = require("./bcrypt.js");

let db;

if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { dbUser, dbPass } = require("./secrets.json");
    db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/social`);
}

module.exports.createUser = function(first, last, email, password) {
    return bcrypt.hash(password).then(hash => {
        return db.query(
            `INSERT INTO users (first, last, email, password)
            VALUES ($1, $2, $3 , $4) RETURNING *`,
            [first, last, email, hash]
        );
    });
};

module.exports.getPassword = function(email) {
    return db.query(
        `SELECT id, password
        FROM users WHERE email = $1`,
        [email]
    );
};

module.exports.getUserData = function(email) {
    return db.query(
        `SELECT id, first, last, url, bio
FROM users WHERE email = $1`,
        [email]
    );
};

module.exports.getOtherUserData = function(id) {
    return db.query(
        `SELECT id, first, last, url, bio
  FROM users WHERE id = $1`,
        [id]
    );
};

module.exports.addImage = function(file, email) {
    return db.query(
        `UPDATE users SET url = $1
WHERE email = $2
RETURNING url`,
        [file, email]
    );
};

module.exports.updateBio = function(bio, email) {
    return db.query(
        `UPDATE users SET bio = $1
WHERE email = $2
RETURNING bio`,
        [bio, email]
    );
};

module.exports.getInitialFriendship = function(loggedInId, otherUserId) {
    return db.query(
        `
      SELECT * FROM friendships
      WHERE (recipient_id = $1 AND sender_id = $2)
      OR (recipient_id = $2 AND sender_id = $1)
  `,
        [loggedInId, otherUserId]
    );
};

module.exports.addFriend = function(loggedInId, otherUserId) {
    return db.query(
        `
  INSERT INTO friendships (sender_id, recipient_id)
  VALUES($1, $2)
  `,
        [loggedInId, otherUserId]
    );
};

module.exports.unfriend = function(loggedInId, otherUserId) {
    return db.query(
        `
  DELETE FROM friendships WHERE (recipient_id = $1 AND sender_id = $2)
  OR (recipient_id = $2 AND sender_id = $1)
  `,
        [loggedInId, otherUserId]
    );
};

module.exports.cancelFriendRequest = function(loggedInId, otherUserId) {
    return db.query(
        `
  DELETE FROM friendships WHERE (recipient_id = $1 AND sender_id = $2)
  OR (recipient_id = $2 AND sender_id = $1)
  `,
        [loggedInId, otherUserId]
    );
};

module.exports.confirm = function(loggedInId, otherUserId) {
    return db.query(
        `
UPDATE friendships SET accepted = true
WHERE (sender_id=$1 AND recipient_id=$2)
OR (recipient_id =$1 AND sender_id =$2)

  `,
        [loggedInId, otherUserId]
    );
};

module.exports.getFriendList = function(loggedInId) {
    return db.query(
        `
    SELECT users.id, first, last, url, accepted
    FROM friendships
    JOIN users
    ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)
`,
        [loggedInId]
    );
};

//req session userId is loggedinUser
//req params id is the user we sent request to

module.exports.getUsersByIds = function(arrayOfIds) {
    const query = `SELECT id, first, last, url FROM users WHERE id = ANY($1)`;
    return db.query(query, [arrayOfIds]);
};

module.exports.getUserDataById = function(id) {
    return db.query(
        `SELECT id, first, last, url
  FROM users WHERE id = $1`,
        [id]
    );
};

// module.exports.getMessages = function(){
//   return db.query(`SELECT id, sender_id, messages
//   FROM messages
//   ORDER BY messages.id DESC
//       LIMIT 12
//   `)
// }

module.exports.getMessages = () => {
    return db.query(`
    SELECT messages.messages, messages.id, messages.created_at, users.first, users.last, users.url
    FROM messages
    JOIN users
    ON users.id = messages.sender_id
    ORDER BY messages.id DESC
    LIMIT 10

    `);
};

module.exports.insertMessage = (senderId, message) => {
    return db.query(
        `
    INSERT INTO messages (sender_id, messages)
    VALUES($1,$2)
    `,
        [senderId, message]
    );
};

module.exports.insertLadderUser = (
    users_id,
    company_id,
    ranking,
    first,
    last
) => {
    return db.query(
        `INSERT INTO ladder (users_id, company_id, ranking, first, last)
  VALUES ($1,$2,$3, $4,$5)
  `[(users_id, company_id, ranking, first, last)]
    );
};

module.exports.postScore = (
    winnerFirst,
    winnerId,
    loserId,
    companyId,
    winnerScore,
    loserScore
) => {
    return db.query(
        `
    INSERT INTO ladder_results (winner_first,winner_id,loser_id,company_id,winner_score,loser_score)
    VALUES($1,$2,$3, $4,$5, $6)
    `,
        [winnerFirst, winnerId, loserId, companyId, winnerScore, loserScore]
    );
};

module.exports.getLadderData1 = () => {
    return db.query(`
    SELECT users_id, company_id, ranking, ladder.first, ladder.last, url
    FROM ladder
    LEFT JOIN users
    ON users.id = ladder.users_id
    WHERE company_id = 1
    ORDER BY ranking ASC;
`);
};

module.exports.getResultData1 = (user1, user2) => {
    return db.query(
        `
  SELECT winner_first, winner_id, loser_id, winner_score, loser_score
  FROM ladder_results
  WHERE (company_id = 1 AND winner_id = $1 AND loser_id = $2)
  OR (company_id = 1 AND winner_id = $2 AND loser_id = $1)
`,
        [user1, user2]
    );
};

module.exports.getUserLadderWinsData = userId => {
    return db.query(
        `
  SELECT winner_id
  FROM ladder_results
  WHERE winner_id = $1
`,
        [userId]
    );
};

module.exports.getUserLadderLossesData = userId => {
    return db.query(
        `
  SELECT loser_id
  FROM ladder_results
  WHERE loser_id = $1
`,
        [userId]
    );
};

module.exports.getUserLadderRankingData = userId => {
    return db.query(
        `
  SELECT ranking, first, last
  FROM ladder
  WHERE users_id = $1
  ORDER BY ranking ASC
`,
        [userId]
    );
};

module.exports.getLadderUserPicture = () => {
    return db.query(`
  SELECT url
  FROM ladder
  LEFT JOIN users
  ON users.id = ladder.users_id
  WHERE users_id = $1
`);
};

// SELECT users_id, company_id, ranking, ladder.first, ladder.last, url
// FROM ladder
// LEFT JOIN users
// ON users.id = ladder.users_id
// WHERE company_id = 1
// ORDER BY ranking ASC;

// SELECT url
// FROM ladder
// LEFT JOIN users
// ON users.id = ladder.users_id
// WHERE users_id = 1;

// SELECT winner_id
// FROM ladder_results
// WHERE winner_id = 1
// OR loser_id = 1

// INSERT INTO ladder (users_id, company_id, ranking, first, last)
// VALUES (1, 1, 1, 'Roger', 'Federer');
// INSERT INTO ladder (users_id, company_id, ranking, first, last)
// VALUES (2, 1, 2, 'Rafael', 'Nadal');
// INSERT INTO ladder (users_id, company_id, ranking, first, last)
// VALUES (3, 1, 3, 'Novak', 'Djokovic');
// INSERT INTO ladder (users_id, company_id, ranking, first, last)
// VALUES (4, 1 , 4, 'Alexander', 'Zverev');
// INSERT INTO ladder (users_id, company_id, ranking, first, last)
// VALUES (5, 1, 5, 'John', 'Isner');
// INSERT INTO ladder (users_id, company_id, ranking, first, last)
// VALUES (6, 1, 6, 'Kevin', 'Anderson');
// INSERT INTO ladder (users_id, company_id, ranking, first, last)
// VALUES (7, 1 , 7, 'Marin', 'Cilic');
// INSERT INTO ladder (users_id, company_id, ranking, first, last)
// VALUES (8, 1, 8, 'Maria', 'Sharapova');
// INSERT INTO ladder (users_id, company_id, ranking, first, last)
// VALUES (9, 1 , 9, 'Serena', 'Williams');
// INSERT INTO ladder (users_id, company_id, ranking, first, last)
// VALUES (10, 1, 10, 'Milos', 'Raonic');

//   INSERT INTO ladder (users_id, company_id, ranking, first, last)
//   VALUES (1, 1, 5, 'paris', 'hilton');
//   INSERT INTO ladder (users_id, company_id, ranking, first, last)
//   VALUES (2, 1, 6, 'jim', 'hilton');
//   INSERT INTO ladder (users_id, company_id, ranking, first, last)
//   VALUES (3, 1, 7, 'john', 'hilton');
//   INSERT INTO ladder (users_id, company_id, ranking, first, last)
//   VALUES (4, 1 , 8, 'chris', 'hilton');

// INSERT INTO ladder_results (winner_first,winner_id,loser_id,company_id,winner_score,loser_score)
// VALUES('a', 1, 2, 1, 22, 11);

// INSERT INTO ladder_results (winner_first,winner_id,loser_id,company_id,winner_score,loser_score)
// VALUES('John', 5, 6, 1, 22, 11);
// INSERT INTO ladder_results (winner_first,winner_id,loser_id,company_id,winner_score,loser_score)
// VALUES('John', 5, 6, 1, 22, 11);
// INSERT INTO ladder_results (winner_first,winner_id,loser_id,company_id,winner_score,loser_score)
// VALUES('John', 5, 6, 1, 22, 11);
// INSERT INTO ladder_results (winner_first,winner_id,loser_id,company_id,winner_score,loser_score)
// VALUES('John', 5, 6, 1, 22, 11);
// INSERT INTO ladder_results (winner_first,winner_id,loser_id,company_id,winner_score,loser_score)
// VALUES('John', 5, 6, 1, 22, 11);
// INSERT INTO ladder_results (winner_first,winner_id,loser_id,company_id,winner_score,loser_score)
// VALUES('John', 5, 6, 1, 22, 11);
// INSERT INTO ladder_results (winner_first,winner_id,loser_id,company_id,winner_score,loser_score)
// VALUES('John', 5, 6, 1, 22, 11);
// INSERT INTO ladder_results (winner_first,winner_id,loser_id,company_id,winner_score,loser_score)
// VALUES('John', 5, 6, 1, 22, 11);

// INSERT INTO ladder_results (winner_first,winner_id,loser_id,company_id,winner_score,loser_score)
// VALUES('John', 6,5, 1, 22, 11);
// INSERT INTO ladder_results (winner_first,winner_id,loser_id,company_id,winner_score,loser_score)
// VALUES('John', 6,5, 1, 22, 11);
// INSERT INTO ladder_results (winner_first,winner_id,loser_id,company_id,winner_score,loser_score)
// VALUES('John', 6,5, 1, 22, 11);
// INSERT INTO ladder_results (winner_first,winner_id,loser_id,company_id,winner_score,loser_score)
// VALUES('John', 6,5, 1, 22, 11);
// INSERT INTO ladder_results (winner_first,winner_id,loser_id,company_id,winner_score,loser_score)
// VALUES('John', 6,5, 1, 22, 11);
// INSERT INTO ladder_results (winner_first,winner_id,loser_id,company_id,winner_score,loser_score)
// VALUES('John', 6,5, 1, 22, 11);
// INSERT INTO ladder_results (winner_first,winner_id,loser_id,company_id,winner_score,loser_score)
// VALUES('John', 6,5, 1, 22, 11);
// INSERT INTO ladder_results (winner_first,winner_id,loser_id,company_id,winner_score,loser_score)
// VALUES('John', 6,5, 1, 22, 11);
// INSERT INTO ladder_results (winner_first,winner_id,loser_id,company_id,winner_score,loser_score)
// VALUES('John', 6,5, 1, 22, 11);
// INSERT INTO ladder_results (winner_first,winner_id,loser_id,company_id,winner_score,loser_score)
// VALUES('John', 6,5, 1, 22, 11);

// INSERT INTO ladder_results (winner_first,winner_id,loser_id,company_id,winner_score,loser_score)
// VALUES('a', 1, 2, 1, 22, 11);
// INSERT INTO ladder_results (winner_first,winner_id,loser_id,company_id,winner_score,loser_score)
// VALUES('a', 1, 2, 1, 22, 11);
// INSERT INTO ladder_results (winner_first,winner_id,loser_id,company_id,winner_score,loser_score)
// VALUES('a', 2, 1, 1, 22, 11);

// INSERT INTO ladder_results (winner_first,winner_id,loser_id,company_id,winner_score,loser_score)
// VALUES('a', 2, 1, 1, 22, 11);

// INSERT INTO ladder_results (winner_first,winner_id,loser_id,company_id,winner_score,loser_score)
// VALUES('a', 2, 1, 1, 22, 11);
// INSERT INTO ladder_results (winner_first,winner_id,loser_id,company_id,winner_score,loser_score)
// VALUES('a', 2, 1, 1, 22, 11);
// INSERT INTO ladder_results (winner_first,winner_id,loser_id,company_id,winner_score,loser_score)
// VALUES('a', 2, 1, 1, 22, 11);
