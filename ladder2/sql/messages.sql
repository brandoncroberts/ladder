DROP TABLE if EXISTS messages;

CREATE TABLE messages(
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    messages TEXT NOT NULL CHECK (messages <> ''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);