const db = require('./database');
const bcrypt = require('bcrypt');

// Export models for users, teams, teamUsers, and sessions. Basically my db wrapper i did for the croatia project but cleaner :P


const usersModel = {
  create: async (name, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 12);
    const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    return stmt.run(name, email, hashedPassword);
  },

  findByEmail: (email) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM users WHERE ID = ?');
    return stmt.get(id);
  },

  verifyPassword: async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  }
};

const teamsModel = {
  create: (name, token, expiresAt) => {
    const stmt = db.prepare('INSERT INTO teams (name, token, expires_at) VALUES (?, ?, ?)');
    return stmt.run(name, token, expiresAt);
  },

  findByToken: (token) => {
    const stmt = db.prepare("SELECT * FROM teams WHERE token = ? AND valid = TRUE AND expires_at > datetime('now')");
    return stmt.get(token);
  }
};

const teamUsersModel = {
  create: (teamId, username) => {
    const stmt = db.prepare('INSERT INTO team_users (team_id, username) VALUES (?, ?)');
    return stmt.run(teamId, username);
  },

  findByTeamId: (teamId) => {
    const stmt = db.prepare('SELECT * FROM team_users WHERE team_id = ?');
    return stmt.all(teamId);
  }
};

const sessionsModel = {
  createUserSession: (userId, sessionToken, expiresAt) => {
    const stmt = db.prepare('INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)');
    return stmt.run(userId, sessionToken, expiresAt);
  },

  createTeamUserSession: (teamUserId, sessionToken, expiresAt) => {
    const stmt = db.prepare('INSERT INTO team_user_sessions (team_user_id, session_token, expires_at) VALUES (?, ?, ?)');
    return stmt.run(teamUserId, sessionToken, expiresAt);
  },

  findUserSession: (sessionToken) => {
    const stmt = db.prepare("SELECT * FROM user_sessions WHERE session_token = ? AND expires_at > datetime('now')");
    return stmt.get(sessionToken);
  },

  findTeamUserSession: (sessionToken) => {
    const stmt = db.prepare("SELECT * FROM team_user_sessions WHERE session_token = ? AND expires_at > datetime('now')");
    return stmt.get(sessionToken);
  },

  deleteUserSession: (sessionToken) => {
    const stmt = db.prepare('DELETE FROM user_sessions WHERE session_token = ?');
    return stmt.run(sessionToken);
  },
  deleteTeamUserSession: (sessionToken) => {
    const stmt = db.prepare('DELETE FROM team_user_sessions WHERE session_token = ?');
    return stmt.run(sessionToken);
  }
};

module.exports = {
  users: usersModel,
  teams: teamsModel,
  teamUsers: teamUsersModel,
  sessions: sessionsModel
};