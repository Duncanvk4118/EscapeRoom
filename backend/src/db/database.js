const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../../database.sqlite');
const db = new Database(dbPath, { verbose: console.log });

// Ensure foreign key constraints are enforced in SQLite
db.pragma('foreign_keys = ON');

// Initialize the database schema. This mirrors the new schema requested by the user
// while keeping sensible foreign keys for SQLite.
const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      session_token TEXT UNIQUE,
      expires_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS er_game_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      er_id INTEGER,
      name TEXT,
      start_date DATETIME,
      end_time DATETIME
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS escape_rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      er_game_id INTEGER,
      name TEXT,
      token TEXT UNIQUE,
      valid BOOLEAN DEFAULT 1,
      expires_at DATETIME,
      shift INTEGER DEFAULT 0,
      FOREIGN KEY (er_game_id) REFERENCES er_game_sessions(id)
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS team_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_id INTEGER,
      username TEXT,
      FOREIGN KEY (team_id) REFERENCES teams(id)
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS team_user_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_user_id INTEGER,
      session_token TEXT UNIQUE,
      expires_at DATETIME,
      FOREIGN KEY (team_user_id) REFERENCES team_users(id)
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      type INTEGER,
      question TEXT,
      description TEXT,
      location TEXT,
      lat REAL,
      long REAL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS questions_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER,
      answer TEXT,
      correct BOOLEAN DEFAULT 0,
      FOREIGN KEY (question_id) REFERENCES questions(id)
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS er_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      er_id INTEGER,
      question_id INTEGER,
      FOREIGN KEY (er_id) REFERENCES escape_rooms(id),
      FOREIGN KEY (question_id) REFERENCES questions(id)
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS er_session_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_id INTEGER,
      question_id INTEGER,
      answer TEXT,
      correct BOOLEAN DEFAULT 0,
      hints_used INTEGER DEFAULT 0,
      points INTEGER DEFAULT 0,
      state INTEGER DEFAULT 0,
      FOREIGN KEY (team_id) REFERENCES teams(id),
      FOREIGN KEY (question_id) REFERENCES questions(id)
    );
  `);
};

initDb();

module.exports = db;