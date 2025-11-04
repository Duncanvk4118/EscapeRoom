const db = require('./database');
const bcrypt = require('bcrypt');

// Users model
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
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  },

  verifyPassword: async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  }
  ,
  findAll: () => {
    const stmt = db.prepare('SELECT * FROM users');
    return stmt.all();
  },

  update: (id, fields) => {
    const sets = [];
    const values = [];
    for (const k of Object.keys(fields)) {
      sets.push(`${k} = ?`);
      values.push(fields[k]);
    }
    if (!sets.length) return null;
    values.push(id);
    const stmt = db.prepare(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`);
    return stmt.run(...values);
  },

  delete: (id) => {
    const tx = db.transaction(() => {
      db.prepare('DELETE FROM user_sessions WHERE user_id = ?').run(id);
      db.prepare('DELETE FROM users WHERE id = ?').run(id);
    });
    return tx();
  }
};

// Teams
const teamsModel = {
  create: (name, token, expiresAt, erSessionId = null, shift = 0) => {
    const stmt = db.prepare('INSERT INTO teams (name, token, expires_at, er_game_id, shift) VALUES (?, ?, ?, ?, ?)');
    return stmt.run(name, token, expiresAt, erSessionId, shift);
  },

  findByToken: (token) => {
    const stmt = db.prepare("SELECT * FROM teams WHERE token = ? AND valid = 1 AND (expires_at IS NULL OR expires_at > datetime('now'))");
    return stmt.get(token);
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM teams WHERE id = ?');
    return stmt.get(id);
  }
  ,
  findAll: () => {
    const stmt = db.prepare('SELECT * FROM teams');
    return stmt.all();
  },

  findBySessionId: (sessionId) => {
    const stmt = db.prepare('SELECT * FROM teams WHERE er_game_id = ?');
    return stmt.all(sessionId);
  },

  update: (id, fields) => {
    const sets = [];
    const values = [];
    for (const k of Object.keys(fields)) {
      sets.push(`${k} = ?`);
      values.push(fields[k]);
    }
    if (!sets.length) return null;
    values.push(id);
    const stmt = db.prepare(`UPDATE teams SET ${sets.join(', ')} WHERE id = ?`);
    return stmt.run(...values);
  },

  delete: (id) => {
    const tx = db.transaction(() => {
      db.prepare('DELETE FROM er_session_questions WHERE team_id = ?').run(id);
      db.prepare('DELETE FROM team_users WHERE team_id = ?').run(id);
      db.prepare('DELETE FROM teams WHERE id = ?').run(id);
    });
    return tx();
  }
};

// Team users
const teamUsersModel = {
  create: (teamId, username) => {
    const stmt = db.prepare('INSERT INTO team_users (team_id, username) VALUES (?, ?)');
    return stmt.run(teamId, username);
  },

  findByTeamId: (teamId) => {
    const stmt = db.prepare('SELECT * FROM team_users WHERE team_id = ?');
    return stmt.all(teamId);
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM team_users WHERE id = ?');
    return stmt.get(id);
  }
  ,
  findAll: () => {
    const stmt = db.prepare('SELECT * FROM team_users');
    return stmt.all();
  },

  update: (id, fields) => {
    const sets = [];
    const values = [];
    for (const k of Object.keys(fields)) {
      sets.push(`${k} = ?`);
      values.push(fields[k]);
    }
    if (!sets.length) return null;
    values.push(id);
    const stmt = db.prepare(`UPDATE team_users SET ${sets.join(', ')} WHERE id = ?`);
    return stmt.run(...values);
  },

  delete: (id) => {
    const stmt = db.prepare('DELETE FROM team_users WHERE id = ?');
    return stmt.run(id);
  }
};

// Sessions
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
    const stmt = db.prepare("SELECT * FROM user_sessions WHERE session_token = ? AND (expires_at IS NULL OR expires_at > datetime('now'))");
    return stmt.get(sessionToken);
  },

  findTeamUserSession: (sessionToken) => {
    const stmt = db.prepare("SELECT * FROM team_user_sessions WHERE session_token = ? AND (expires_at IS NULL OR expires_at > datetime('now'))");
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
  ,

  findAllUserSessions: () => {
    const stmt = db.prepare('SELECT * FROM user_sessions');
    return stmt.all();
  },
  findAllTeamUserSessions: () => {
    const stmt = db.prepare('SELECT * FROM team_user_sessions');
    return stmt.all();
  }
};

// Questions and answers
const questionsModel = {
  // accepts userId first so we store who created the question
  create: (userId, type, question, description = null, location = null, lat = null, longVal = null) => {
    const stmt = db.prepare('INSERT INTO questions (user_id, type, question, description, location, lat, long) VALUES (?, ?, ?, ?, ?, ?, ?)');
    return stmt.run(userId, type, question, description, location, lat, longVal);
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM questions WHERE id = ?');
    return stmt.get(id);
  }
  ,
  findAll: () => {
    const stmt = db.prepare('SELECT * FROM questions');
    return stmt.all();
  },

  update: (id, fields) => {
    const sets = [];
    const values = [];
    for (const k of Object.keys(fields)) {
      sets.push(`${k} = ?`);
      values.push(fields[k]);
    }
    if (!sets.length) return null;
    values.push(id);
    const stmt = db.prepare(`UPDATE questions SET ${sets.join(', ')} WHERE id = ?`);
    return stmt.run(...values);
  },

  delete: (id) => {
    const tx = db.transaction(() => {
      db.prepare('DELETE FROM questions_answers WHERE question_id = ?').run(id);
      db.prepare('DELETE FROM er_questions WHERE question_id = ?').run(id);
      db.prepare('DELETE FROM questions WHERE id = ?').run(id);
    });
    return tx();
  }
};

const answersModel = {
  createForQuestion: (questionId, answer, correct = 0) => {
    const stmt = db.prepare('INSERT INTO questions_answers (question_id, answer, correct) VALUES (?, ?, ?)');
    return stmt.run(questionId, answer, correct);
  },

  getByQuestionId: (questionId) => {
    const stmt = db.prepare('SELECT * FROM questions_answers WHERE question_id = ?');
    return stmt.all(questionId);
  }
  ,
  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM questions_answers WHERE id = ?');
    return stmt.get(id);
  },

  update: (id, fields) => {
    const sets = [];
    const values = [];
    for (const k of Object.keys(fields)) {
      sets.push(`${k} = ?`);
      values.push(fields[k]);
    }
    if (!sets.length) return null;
    values.push(id);
    const stmt = db.prepare(`UPDATE questions_answers SET ${sets.join(', ')} WHERE id = ?`);
    return stmt.run(...values);
  },

  delete: (id) => {
    const stmt = db.prepare('DELETE FROM questions_answers WHERE id = ?');
    return stmt.run(id);
  }
};

// Escape room / ER game sessions and relations
const erGameSessionModel = {
  create: (escapeRoomId = null, name = null, startDate = null, endTime = null) => {
    const stmt = db.prepare('INSERT INTO er_game_sessions (er_id, name, start_date, end_time) VALUES (?, ?, ?, ?)');
    return stmt.run(escapeRoomId, name, startDate, endTime);
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM er_game_sessions WHERE id = ?');
    return stmt.get(id);
  }
  ,
  findAll: () => {
    const stmt = db.prepare('SELECT * FROM er_game_sessions');
    return stmt.all();
  },

  update: (id, fields) => {
    const sets = [];
    const values = [];
    for (const k of Object.keys(fields)) {
      sets.push(`${k} = ?`);
      values.push(fields[k]);
    }
    if (!sets.length) return null;
    values.push(id);
    const stmt = db.prepare(`UPDATE er_game_sessions SET ${sets.join(', ')} WHERE id = ?`);
    return stmt.run(...values);
  },

  delete: (id) => {
    const tx = db.transaction(() => {
      db.prepare('DELETE FROM er_session_questions WHERE team_id IN (SELECT ID FROM teams WHERE er_game_id = ?)').run(id);
      db.prepare('DELETE FROM teams WHERE er_game_id = ?').run(id);
      db.prepare('DELETE FROM er_game_sessions WHERE id = ?').run(id);
    });
    return tx();
  }
};

const erQuestionsModel = {
  create: (erId, questionId) => {
    const stmt = db.prepare('INSERT INTO er_questions (er_id, question_id) VALUES (?, ?)');
    return stmt.run(erId, questionId);
  },

  findByErId: (erId) => {
    const stmt = db.prepare('SELECT * FROM er_questions WHERE er_id = ?');
    return stmt.all(erId);
  }
  ,
  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM er_questions WHERE id = ?');
    return stmt.get(id);
  },
  findAll: () => {
    const stmt = db.prepare('SELECT * FROM er_questions');
    return stmt.all();
  },

  deleteLink: (erId, questionId) => {
    const stmt = db.prepare('DELETE FROM er_questions WHERE er_id = ? AND question_id = ?');
    return stmt.run(erId, questionId);
  }
};

const erSessionQuestionsModel = {
  // state: 0 = unanswered, 1 = answering, 2 = scanned, 3 = finished
  create: (teamId, questionId, answer = null, correct = 0, hintsUsed = 0, points = 0, state = 0) => {
    const stmt = db.prepare('INSERT INTO er_session_questions (team_id, question_id, answer, correct, hints_used, points, state) VALUES (?, ?, ?, ?, ?, ?, ?)');
    return stmt.run(teamId, questionId, answer, correct, hintsUsed, points, state);
  },

  updateAnswer: (id, answer, correct, hintsUsed = null, points = null, state = null) => {
    const stmt = db.prepare('UPDATE er_session_questions SET answer = ?, correct = ?, hints_used = COALESCE(?, hints_used), points = COALESCE(?, points), state = COALESCE(?, state) WHERE id = ?');
    return stmt.run(answer, correct, hintsUsed, points, state, id);
  },

  findByTeamId: (teamId) => {
    const stmt = db.prepare('SELECT * FROM er_session_questions WHERE team_id = ?');
    return stmt.all(teamId);
  }
  ,
  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM er_session_questions WHERE id = ?');
    return stmt.get(id);
  },

  delete: (id) => {
    const stmt = db.prepare('DELETE FROM er_session_questions WHERE id = ?');
    return stmt.run(id);
  },

  findAll: () => {
    const stmt = db.prepare('SELECT * FROM er_session_questions');
    return stmt.all();
  }
};


const escapeRoomsModel = {
  create: (userId, name) => {
    const stmt = db.prepare('INSERT INTO escape_rooms (user_id, name) VALUES (?, ?)');
    return stmt.run(userId, name);
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM escape_rooms WHERE id = ?');
    return stmt.get(id);
  }
  ,
  findAll: () => {
    const stmt = db.prepare('SELECT * FROM escape_rooms');
    return stmt.all();
  },

  update: (id, fields) => {
    const sets = [];
    const values = [];
    for (const k of Object.keys(fields)) {
      sets.push(`${k} = ?`);
      values.push(fields[k]);
    }
    if (!sets.length) return null;
    values.push(id);
    const stmt = db.prepare(`UPDATE escape_rooms SET ${sets.join(', ')} WHERE id = ?`);
    return stmt.run(...values);
  },

  delete: (id) => {
    const tx = db.transaction(() => {
      db.prepare('DELETE FROM er_questions WHERE er_id = ?').run(id);

      // delete sessions attached to this escape room
      const sessions = db.prepare('SELECT ID FROM er_game_sessions WHERE er_id = ?').all(id);
      for (const s of sessions) {
        db.prepare('DELETE FROM er_session_questions WHERE team_id IN (SELECT ID FROM teams WHERE er_game_id = ?)').run(s.ID);
        db.prepare('DELETE FROM teams WHERE er_game_id = ?').run(s.ID);
        db.prepare('DELETE FROM er_game_sessions WHERE id = ?').run(s.ID);
      }
      db.prepare('DELETE FROM escape_rooms WHERE id = ?').run(id);
    });
    return tx();  
  }
};

module.exports = {
  users: usersModel,
  teams: teamsModel,
  teamUsers: teamUsersModel,
  sessions: sessionsModel,
  questions: questionsModel,
  answers: answersModel,
  erSessions: erGameSessionModel,
  erQuestions: erQuestionsModel,
  erSessionQuestions: erSessionQuestionsModel,
  escapeRooms: escapeRoomsModel
};