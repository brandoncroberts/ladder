DROP TABLE IF EXISTS users;

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  first VARCHAR(200) NOT NULL CHECK (first <> ''),
  last VARCHAR(200) NOT NULL CHECK (last <> ''),
  email  VARCHAR(200) UNIQUE NOT NULL CHECK (email <> ''),
  password VARCHAR(200) NOT NULL CHECK (password <> ''),
      url VARCHAR(300),
      bio TEXT
);



