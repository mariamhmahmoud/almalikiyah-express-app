-- Users --
CREATE DATABASE almalikiyah;
USE almalikiyah;

CREATE TABLE users (
  userid INT PRIMARY KEY AUTO_INCREMENT,
  firstName VARCHAR(20) NOT NULL,
  lastName VARCHAR(20) NOT NULL,
  email VARCHAR(40),
  phoneNumber VARCHAR(20) NOT NULL,
  address VARCHAR(256),
  birthday VARCHAR(20)
);

-- Spouses --

CREATE TABLE spouses (
  spouseid INT PRIMARY KEY AUTO_INCREMENT,
  userid INT NOT NULL,
  firstName VARCHAR(20) NOT NULL,
  lastName VARCHAR(20) NOT NULL,
  birthday VARCHAR(20),
  FOREIGN KEY(userid) REFERENCES users(userid) ON DELETE CASCADE
);

-- Children  --

CREATE TABLE children (
  childid INT PRIMARY KEY AUTO_INCREMENT,
  userid INT NOT NULL,
  firstName VARCHAR(20) NOT NULL,
  lastName VARCHAR(20) NOT NULL,
  birthday VARCHAR(20),
  FOREIGN KEY(userid) REFERENCES users(userid) ON DELETE CASCADE
);

-- Administrators --

CREATE TABLE admin (
  adminid INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255)
);

INSERT INTO ADMIN (username, password) VALUES ("username", "$2b$10$/i3dnGhDPavYsZ68UBo7P./3VrARhTrd80fCelZBqzltB0CxhhP.a");

