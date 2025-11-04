const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { questions, answers, teams, erSessionQuestions } = require('../db/models');
const { JWT_SECRET, teamAuthMiddleware } = require('../middleware/auth');

router.use(express.json());

// GET /game/get-question/:jwt_token
// Verifies the token and returns question + answers
router.get('/get-question/:jwt_token', teamAuthMiddleware, (req, res) => {
  const token = req.params.jwt_token;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // token payload expected to contain { er_question_id, question_id, title }
    const erQuestionId = decoded && (decoded.er_question_id || decoded.erQuestionId) ? Number(decoded.er_question_id || decoded.erQuestionId) : null;
    const questionId = decoded && (decoded.question_id || decoded.questionId) ? Number(decoded.question_id || decoded.questionId) : null;
    const title = decoded && decoded.title ? decoded.title : null;

    if (!questionId) return res.status(400).json({ error: 'Invalid token payload' });

    const q = questions.findById(questionId);
    if (!q) return res.status(404).json({ error: 'Question not found' });

    // teamAuthMiddleware sets req.team_user - require that here
    const teamId = req.team_user && (req.team_user.teamId || req.team_user.team_id) ? Number(req.team_user.teamId || req.team_user.team_id) : null;
    if (!teamId) return res.status(400).json({ error: 'Team id not found in session' });

    const sessionRows = erSessionQuestions.findByTeamId(teamId) || [];
    const erRow = sessionRows.find((r) => Number(r.question_id) === Number(questionId));
    if (!erRow) return res.status(403).json({ error: 'This question is not assigned to your team' });

    // mark scanned state when QR is scanned inside the app
    if (erRow.state !== 3) {
      erSessionQuestions.updateAnswer(erRow.id, null, 0, null, null, 2);
      erRow.state = 2;
    }

    const ans = answers.getByQuestionId(questionId) || [];
    return res.json({ er_question_id: erRow.id, question_id: questionId, title, question: q, answers: ans });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// GET /game/get-question
// Returns the next question preview for the authenticated team user
router.get('/get-question', teamAuthMiddleware, (req, res) => {
  try {
    const teamId = req.team_user && (req.team_user.teamId || req.team_user.team_id) ? Number(req.team_user.teamId || req.team_user.team_id) : null;
    if (!teamId) return res.status(400).json({ error: 'Team id not found in session' });

    const team = teams.findById(teamId);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    const erGameId = team.er_game_id;
    if (!erGameId) return res.status(404).json({ error: 'No active game for team' });

    const sessionRows = erSessionQuestions.findByTeamId(teamId) || [];
      // If there's a scanned question (state === 2), promote it to in-progress and return full data
      let scanned = sessionRows.find((r) => r.state === 2);
      if (scanned) {
        // set to in-progress
        erSessionQuestions.updateAnswer(scanned.id, null, 0, null, null, 1);
        const q = questions.findById(scanned.question_id);
        const ans = answers.getByQuestionId(scanned.question_id) || [];
        const refreshed = erSessionQuestions.findById(scanned.id);
        return res.json({ er_question_id: refreshed.id, question_id: refreshed.question_id, title: q.question, question: q, answers: ans });
      }

      let inProgress = sessionRows.find((r) => r.state === 1);
      if (inProgress) {
        const q = questions.findById(inProgress.question_id);
        return res.json({ er_question_id: inProgress.id, question_id: inProgress.question_id, title: q.question, location: q.location || null, description: q.description || null });
      }

    const next = sessionRows.find((r) => r.state === 0);
    if (!next) return res.status(204).json({ message: 'No more questions' });

    erSessionQuestions.updateAnswer(next.id, null, 0, null, null, 1);
    const q = questions.findById(next.question_id);
    return res.json({ er_question_id: next.id, question_id: next.question_id, title: q.question, location: q.location || null, description: q.description || null });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


// POST /game/answer-question (team authenticated)
// body: { er_session_question_id, answer_id }
router.post('/answer-question', teamAuthMiddleware, (req, res) => {
  try {
    const teamId = req.team_user && (req.team_user.teamId || req.team_user.team_id) ? Number(req.team_user.teamId || req.team_user.team_id) : null;
    if (!teamId) return res.status(400).json({ error: 'Team id not found in session' });

    const { er_session_question_id, answer_id } = req.body;
    if (!er_session_question_id || !answer_id) return res.status(400).json({ error: 'er_session_question_id and answer_id required' });

    const erRow = erSessionQuestions.findById(Number(er_session_question_id));
    if (!erRow) return res.status(404).json({ error: 'er session question not found' });
    if (Number(erRow.team_id) !== Number(teamId)) return res.status(403).json({ error: 'This question does not belong to your team' });
    if (erRow.state !== 1) return res.status(400).json({ error: 'Question is not in progress' });

    const answerRow = answers.findById(Number(answer_id));
    if (!answerRow) return res.status(404).json({ error: 'Answer not found' });
    if (Number(answerRow.question_id) !== Number(erRow.question_id)) return res.status(400).json({ error: 'Answer does not belong to this question' });

    const correct = answerRow.correct ? 1 : 0;
    const points = correct ? 4 : 0;

  // store the selected answer id as the answer text (string) and mark finished (state 3)
  erSessionQuestions.updateAnswer(erRow.id, String(answer_id), correct, null, points, 3);

    return res.json({ correct: !!correct, points });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;