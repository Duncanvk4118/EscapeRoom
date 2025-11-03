const express = require('express');
const router = express.Router();
const {
  users,
  sessions,
  escapeRooms,
  erSessions,
  questions: questionsModel,
  answers: answersModel,
  erQuestions: erQuestionsModel,
  erSessionQuestions,
  teams,
  teamUsers
} = require('../db/models');
const { authMiddleware } = require('../middleware/auth');
const { escape } = require('querystring');

router.use(express.json());

// POST /api/admin/escape-rooms
// body: { name }
router.post('/escape-rooms', authMiddleware, (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const result = escapeRooms.create(req.user.id || null, name);
    return res.status(201).json({ message: 'Escape room created', id: result.lastInsertRowid });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// List escape rooms
router.get('/escape-rooms', authMiddleware, (req, res) => {
  res.json(escapeRooms.findAll());
});

// Get/patch/delete escape room
router.get('/escape-rooms/:id', authMiddleware, (req, res) => {
  const e = escapeRooms.findById(Number(req.params.id));
  if (!e) return res.status(404).json({ error: 'Escape room not found' });
  res.json(e);
});

router.patch('/escape-rooms/:id', authMiddleware, (req, res) => {
  res.json(escapeRooms.update(Number(req.params.id), req.body));
});

router.delete('/escape-rooms/:id', authMiddleware, (req, res) => {
  res.json(escapeRooms.delete(Number(req.params.id)));
});

// Create a session within an escape room
// POST /api/admin/escape-rooms/:id/sessions
// body: { name, start_date, end_time }
router.post('/escape-rooms/:id/sessions', authMiddleware, (req, res) => {
  try {
    const escapeRoomId = Number(req.params.id);
    const { name, start_date, end_time } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const result = erSessions.create(escapeRoomId, name, start_date || new Date().toISOString(), end_time || null);
    return res.status(201).json({ message: 'Session created', id: result.lastInsertRowid });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Create a question
// POST /api/admin/questions
// body: { type, question, description, location, lat, long }
router.post('/questions', authMiddleware, (req, res) => {
  try {
    const { type, question, description, location, lat, long } = req.body;
    if (!question) return res.status(400).json({ error: 'question text required' });
    const userId = req.user && req.user.id ? req.user.id : null;
    const result = questionsModel.create(userId, type || 0, question, description || null, location || null, lat || null, long || null);
    return res.status(201).json({ message: 'Question created', id: result.lastInsertRowid });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Update an answer for a question
// POST /api/admin/questions/:id/answers
// body: { answer, correct }

// need to finish
router.patch('/questions/:id/answers', authMiddleware, (req, res) => {
  try {
    const questionId = Number(req.params.id);
    const { answer, correct } = req.body;
    if (!answer) return res.status(400).json({ error: 'answer required' });
    const result = answersModel.createForQuestion(questionId, answer, correct ? 1 : 0);
    return res.status(201).json({ message: 'Answer created', id: result.lastInsertRowid });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Link an existing question to an escape room (er_questions)
// POST /api/admin/escape-rooms/:escapeRoomId/questions
// body: { question_id }
router.post('/escape-rooms/:escapeRoomId/questions', authMiddleware, (req, res) => {
  try {
    const escapeRoomId = Number(req.params.escapeRoomId);
    const { question_id } = req.body;
    if (!question_id) return res.status(400).json({ error: 'question_id required' });
    const result = erQuestionsModel.create(escapeRoomId, question_id);
    return res.status(201).json({ message: 'Question linked to escape room', id: result.lastInsertRowid });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


// create game session with teams
// POST /api/admin/escape-rooms/id/create-session
// body: {escapeRoomId, teams_count, session_name, start_date, end_date}
router.post('/escape-rooms/:escapeRoomId/create-session', authMiddleware, (req, res) => {
  try {
    const escapeRoomId = Number(req.params.escapeRoomId);
    const { session_name, teams_count, start_date, end_date } = req.body;
    if (!teams_count || Number(teams_count) <= 0) return res.status(400).json({ error: 'Teams must be a positive number' });
    const crypto = require('crypto');
    const session = erSessions.create(escapeRoomId, session_name, Date.now(), Date.now())
    const created = [];
    const erSessionId = session.lastInsertRowid;
    for (let i = 1; i <= Number(teams_count); i++) {
      const token = crypto.randomBytes(2).toString('hex').toUpperCase();
      const name = `Team ${i}`;
      const resTeam = teams.create(name, token, null, erSessionId, 0);
      created.push({ id: resTeam.lastInsertRowid, name, token });
    }
    return res.status(201).json({ message: 'Teams created', teams: created });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


// --- Users CRUD ---
router.get('/users', authMiddleware, (req, res) => {
  res.json(users.findAll());
});

router.get('/users/:id', authMiddleware, (req, res) => {
  const u = users.findById(Number(req.params.id));
  if (!u) return res.status(404).json({ error: 'User not found' });
  res.json(u);
});

router.post('/users', authMiddleware, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'name, email and password required' });
    const r = await users.create(name, email, password);
    res.status(201).json({ id: r.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/users/:id', authMiddleware, (req, res) => {
  res.json(users.update(Number(req.params.id), req.body));
});

router.delete('/users/:id', authMiddleware, (req, res) => {
  res.json(users.delete(Number(req.params.id)));
});

// --- Sessions CRUD ---
router.get('/sessions', authMiddleware, (req, res) => res.json(erSessions.findAll()));
router.get('/sessions/:id', authMiddleware, (req, res) => {
  const s = erSessions.findById(Number(req.params.id));
  if (!s) return res.status(404).json({ error: 'Session not found' });
  res.json(s);
});
router.patch('/sessions/:id', authMiddleware, (req, res) => res.json(erSessions.update(Number(req.params.id), req.body)));
router.delete('/sessions/:id', authMiddleware, (req, res) => res.json(erSessions.delete(Number(req.params.id))));

// --- Teams CRUD ---
router.get('/teams', authMiddleware, (req, res) => res.json(teams.findAll()));
router.get('/teams/:id', authMiddleware, (req, res) => {
  const t = teams.findById(Number(req.params.id));
  if (!t) return res.status(404).json({ error: 'Team not found' });
  res.json(t);
});
router.patch('/teams/:id', authMiddleware, (req, res) => res.json(teams.update(Number(req.params.id), req.body)));
router.delete('/teams/:id', authMiddleware, (req, res) => res.json(teams.delete(Number(req.params.id))));

// --- Team users CRUD ---
router.get('/team-users', authMiddleware, (req, res) => res.json(teamUsers.findAll()));
router.get('/team-users/:id', authMiddleware, (req, res) => {
  const tu = teamUsers.findById(Number(req.params.id));
  if (!tu) return res.status(404).json({ error: 'Team user not found' });
  res.json(tu);
});
router.post('/team-users', authMiddleware, (req, res) => {
  const { team_id, username } = req.body;
  if (!team_id || !username) return res.status(400).json({ error: 'team_id and username required' });
  const r = teamUsers.create(team_id, username);
  res.status(201).json({ id: r.lastInsertRowid });
});
router.patch('/team-users/:id', authMiddleware, (req, res) => res.json(teamUsers.update(Number(req.params.id), req.body)));
router.delete('/team-users/:id', authMiddleware, (req, res) => res.json(teamUsers.delete(Number(req.params.id))));

// --- Questions CRUD ---
router.get('/questions', authMiddleware, (req, res) => res.json(questionsModel.findAll()));
router.get('/questions/:id', authMiddleware, (req, res) => {
  const q = questionsModel.findById(Number(req.params.id));
  if (!q) return res.status(404).json({ error: 'Question not found' });
  res.json(q);
});
router.patch('/questions/:id', authMiddleware, (req, res) => res.json(questionsModel.update(Number(req.params.id), req.body)));
router.delete('/questions/:id', authMiddleware, (req, res) => res.json(questionsModel.delete(Number(req.params.id))));

// --- Answers CRUD ---
router.get('/questions/:id/answers', authMiddleware, (req, res) => res.json(answersModel.getByQuestionId(Number(req.params.id))));
router.get('/answers/:id', authMiddleware, (req, res) => res.json(answersModel.findById(Number(req.params.id))));
router.patch('/answers/:id', authMiddleware, (req, res) => res.json(answersModel.update(Number(req.params.id), req.body)));
router.delete('/answers/:id', authMiddleware, (req, res) => res.json(answersModel.delete(Number(req.params.id))));

// --- ER question links ---
router.get('/escape-rooms/:id/questions', authMiddleware, (req, res) => res.json(erQuestionsModel.findByErId(Number(req.params.id))));
router.delete('/escape-rooms/:escapeRoomId/questions/:questionId', authMiddleware, (req, res) => res.json(erQuestionsModel.deleteLink(Number(req.params.escapeRoomId), Number(req.params.questionId))));

// --- ER session questions (admin management) ---
router.get('/er-session-questions', authMiddleware, (req, res) => res.json(erSessionQuestions.findAll()));
router.get('/er-session-questions/:id', authMiddleware, (req, res) => {
  const r = erSessionQuestions.findById(Number(req.params.id));
  if (!r) return res.status(404).json({ error: 'Not found' });
  res.json(r);
});
router.patch('/er-session-questions/:id', authMiddleware, (req, res) => {
  const { answer, correct, hints_used, points } = req.body;
  res.json(erSessionQuestions.updateAnswer(Number(req.params.id), answer, correct ? 1 : 0, hints_used, points));
});
router.delete('/er-session-questions/:id', authMiddleware, (req, res) => res.json(erSessionQuestions.delete(Number(req.params.id))));

module.exports = router;