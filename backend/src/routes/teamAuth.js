const express = require('express');
const router = express.Router();
const { teams, teamUsers, sessions } = require('../db/models');
const { generateToken, getTokenExpiry } = require('../middleware/auth');

// Mijn plan, 2 step login, maak eerst een request naar de server om te kijken of het team bestaat en daarna kan je een username er bij toevoegen.

// Stap 1: Req naar server /check-team met team_token in body
// Stap 2: Als dat lukt, req naar /login met team_token en username in body. (misschien leuke transition tussen stap 1 en 2 ofzo?)

router.use(express.json());

router.post('/check-team', (req, res) => {
  const { team_token } = req.body;
  if (!team_token) {
    return res.status(400).json({ error: 'Team token required' });
  }
  const team = teams.findByToken(team_token);
  if (!team) {
    return res.status(404).json({ error: 'Team not found or token expired' });
  }
  res.json({ message: 'Team token valid', teamId: team.ID, teamName: team.name });
});

router.post('/login', async (req, res) => {
  try {
    const { team_token, username } = req.body;
    if (!team_token || !username) {
      return res.status(400).json({ error: 'Team token and username required' });
    }
    const team = teams.findByToken(team_token);
    if (!team) {
      return res.status(401).json({ error: 'Invalid or expired team token' });
    }
    const teamUserResult = teamUsers.create(team.ID, username);
    const teamUserId = teamUserResult.lastInsertRowid;
    const token = generateToken({ teamUserId, teamId: team.ID, username, team_token }, '24h');
    const expiresAt = getTokenExpiry(token);
    sessions.createTeamUserSession(teamUserId, token, expiresAt);
    res.json({
      message: 'Team user login successful',
      token,
      teamUser: {
        id: teamUserId,
        username,
        teamId: team.ID
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/logout', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const token = authHeader.split(' ')[1];
    sessions.deleteTeamUserSession(token);
    res.json({ message: 'Team user logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
