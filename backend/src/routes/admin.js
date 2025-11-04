const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const {
  users,
  escapeRooms,
  erSessions,
  questions: questionsModel,
  answers: answersModel,
  erQuestions: erQuestionsModel,
  erSessionQuestions,
  teams,
  teamUsers
} = require('../db/models');
const { authMiddleware, generateToken, getTokenExpiry } = require('../middleware/auth');

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

// Generate a signed JWT for a question (to embed in a QR-code)
// POST /api/admin/questions/:id/token

router.post('/er-question/:erQuestionId/token', authMiddleware, (req, res) => {
  try {
    const erQuestionId = Number(req.params.erQuestionId);
    if (!erQuestionId) return res.status(400).json({ error: 'question id required' });
    const erq = erQuestionsModel.findById(erQuestionId);
    if (!erq) return res.status(404).json({ error: 'er_question not found' });
    const questionId = erq.question_id;
    const q = questionsModel.findById(questionId);
    const title = q && q.question ? q.question : null;
    const payload = { er_question_id: erQuestionId, question_id: questionId, title };
    const token = generateToken(payload, null);
    const expiresAt = getTokenExpiry(token);
    return res.json({ token, expiresAt });
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
    // create session
    const session = erSessions.create(escapeRoomId, session_name, start_date || new Date().toISOString(), end_date || null);
    const created = [];
    const erSessionId = session.lastInsertRowid;

    // load questions linked to this escape room
    const links = erQuestionsModel.findByErId(escapeRoomId) || [];
    const Q = links.length;
    if (Q === 0) return res.status(400).json({ error: 'Escape room has no questions linked' });

    // Create teams and populate er_session_questions for each team with an even shift
    for (let t = 0; t < Number(teams_count); t++) {
      const token = crypto.randomBytes(2).toString('hex').toUpperCase();
      const name = `Team ${t + 1}`;
      // compute shift so teams start evenly spaced through the question list
      const shift = Math.floor((t * Q) / Number(teams_count));
      const resTeam = teams.create(name, token, null, erSessionId, shift);
      const teamId = resTeam.lastInsertRowid;

      // for each question index, add question to team with shifted
      for (let qi = 0; qi < Q; qi++) {
        const effIndex = (qi + shift) % Q;
        const questionId = links[effIndex].question_id;
        const state = qi === 0 ? 1 : 0;
        erSessionQuestions.create(teamId, questionId, null, 0, 0, 0, state);
      }

      created.push({ id: teamId, name, token, shift });
    }

    return res.status(201).json({ message: 'Session and teams created', sessionId: erSessionId, teams: created });
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

// Teams crud
router.get('/teams', authMiddleware, (req, res) => res.json(teams.findAll()));
router.get('/teams/:id', authMiddleware, (req, res) => {
  const t = teams.findById(Number(req.params.id));
  if (!t) return res.status(404).json({ error: 'Team not found' });
  res.json(t);
});
router.patch('/teams/:id', authMiddleware, (req, res) => res.json(teams.update(Number(req.params.id), req.body)));
router.delete('/teams/:id', authMiddleware, (req, res) => res.json(teams.delete(Number(req.params.id))));

// Team users crud
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

// Questions crud
router.get('/questions', authMiddleware, (req, res) => res.json(questionsModel.findAll()));
router.get('/questions/:id', authMiddleware, (req, res) => {
  const q = questionsModel.findById(Number(req.params.id));
  if (!q) return res.status(404).json({ error: 'Question not found' });
  res.json(q);
});
router.patch('/questions/:id', authMiddleware, (req, res) => res.json(questionsModel.update(Number(req.params.id), req.body)));
router.delete('/questions/:id', authMiddleware, (req, res) => res.json(questionsModel.delete(Number(req.params.id))));

// Answers crud
router.get('/questions/:id/answers', authMiddleware, (req, res) => res.json(answersModel.getByQuestionId(Number(req.params.id))));
router.get('/answers/:id', authMiddleware, (req, res) => res.json(answersModel.findById(Number(req.params.id))));
router.patch('/answers/:id', authMiddleware, (req, res) => res.json(answersModel.update(Number(req.params.id), req.body)));
router.delete('/answers/:id', authMiddleware, (req, res) => res.json(answersModel.delete(Number(req.params.id))));

// get all questions per escape room
router.get('/escape-rooms/:id/questions', authMiddleware, (req, res) => {
  try {
    const erId = Number(req.params.id);
    const links = erQuestionsModel.findByErId(erId);
    const result = links.map((link) => {
      const q = questionsModel.findById(link.question_id);
      const title = q && q.question ? q.question : null;
      const payload = { er_question_id: link.id, question_id: link.question_id, title };
      const token = generateToken(payload, null);
      const expiresAt = getTokenExpiry(token);
      return {
        er_question_id: link.id,
        question_id: link.question_id,
        question: q,
        token,
        expiresAt,
      };
    });
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
router.delete('/escape-rooms/:escapeRoomId/questions/:questionId', authMiddleware, (req, res) => res.json(erQuestionsModel.deleteLink(Number(req.params.escapeRoomId), Number(req.params.questionId))));

// Not needed in admin panel ( i think ) but functionality is there!
router.get('/er-session-questions', authMiddleware, (req, res) => res.json(erSessionQuestions.findAll()));
router.get('/er-session-questions/:id', authMiddleware, (req, res) => {
  const r = erSessionQuestions.findById(Number(req.params.id));
  if (!r) return res.status(404).json({ error: 'Not found' });
  res.json(r);
});

// nice to check progress
router.get('/er-session-questions/team/:teamId', authMiddleware, (req, res) => {
  const r = erSessionQuestions.findByTeamId(Number(req.params.teamId));
  if (!r) return res.status(404).json({ error: 'Not found' });
  res.json(r);
});

router.patch('/er-session-questions/:id', authMiddleware, (req, res) => {
  const { answer, correct, hints_used, points } = req.body;
  res.json(erSessionQuestions.updateAnswer(Number(req.params.id), answer, correct ? 1 : 0, hints_used, points));
});
router.delete('/er-session-questions/:id', authMiddleware, (req, res) => res.json(erSessionQuestions.delete(Number(req.params.id))));



module.exports = router;