const jwt = require('jsonwebtoken');
const { sessions } = require('../db/models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const session = sessions.findUserSession(token);
    if (!session) {
      return res.status(401).json({ error: 'Session expired or invalid' });
    }
    req.user = decoded;
    req.session = session;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const teamAuthMiddleware = (req, res, next) => {
  const auth_header = req.headers.authorization;
  if (!auth_header || !auth_header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const token = auth_header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const session = sessions.findTeamUserSession(token);
    if (!session) {
      return res.status(401).json({ error: 'Session expired or invalid' });
    }
    req.team_user = decoded;
    req.session = session;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const generateToken = (payload, expiresIn = '24h') => {
  // If expiresIn is explicitly null, create a token without an exp claim (non-expiring)
  if (expiresIn === null) {
    return jwt.sign(payload, JWT_SECRET);
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

const getTokenExpiry = (token) => {
  const decoded = jwt.decode(token);
  if (!decoded || !decoded.exp) return null;
  return new Date(decoded.exp * 1000).toISOString();
};

module.exports = {
  authMiddleware,
  teamAuthMiddleware,
  generateToken,
  getTokenExpiry,
  JWT_SECRET
};