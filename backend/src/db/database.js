const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../../database.sqlite');
const db = new Database(dbPath, { verbose: console.log });

// Create tables if they don't exist, migration type shit but then in express woo! (totally not copied from the croatia project)
const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS teams (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      token TEXT UNIQUE,
      valid BOOLEAN DEFAULT true,
      expires_at DATETIME
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS team_users (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      team_id INTEGER,
      username TEXT,
      FOREIGN KEY (team_id) REFERENCES teams(ID)
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS team_user_sessions (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      team_user_id INTEGER,
      session_token TEXT UNIQUE,
      expires_at DATETIME,
      FOREIGN KEY (team_user_id) REFERENCES team_users(ID)
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      session_token TEXT UNIQUE,
      expires_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(ID)
    );
  `);
};

initDb();

module.exports = db;