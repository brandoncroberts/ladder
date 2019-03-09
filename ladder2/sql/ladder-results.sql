DROP TABLE IF EXISTS ladder_results;

CREATE TABLE ladder_results
(
    id SERIAL PRIMARY KEY,
    winner_first VARCHAR(200) NOT NULL,
    winner_id INTEGER NOT NULL REFERENCES users(id),
    loser_id INTEGER NOT NULL REFERENCES users(id),
    company_id INTEGER NOT NULL,
    winner_score INTEGER NOT NULL,
    loser_score INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

