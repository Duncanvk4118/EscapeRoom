const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const { users } = require('./db/models');
const { authMiddleware, teamAuthMiddleware } = require('./middleware/auth');
const adminAuthRoutes = require('./routes/auth');
const teamAuthRoutes = require('./routes/teamAuth');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

// ROUTSE
// Admin:
//   POST   /api/admin/login      - Login as admin
//   POST   /api/admin/logout     - Logout admin
// Team:
//   POST   /api/team/login       - Login as team user (with team token and username)
//   POST   /api/team/logout      - Logout team user

// Test routes, /api/protected and /api/team/protected to test auth middleware and if login works
// all routes are tested with postman :thumbs_up:

app.use('/api/admin', adminAuthRoutes);
app.use('/api/team', teamAuthRoutes);

app.get('/api/test', async (req, res) => {
  try {
    const result = users.create('Test User', 'test@example.com', 'password123');
    const user = users.findByEmail('test@example.com');
    res.json({ message: 'Database working!', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You have accessed a protected route!', user: req.user });
});

app.get('/api/team/protected', teamAuthMiddleware, (req, res) => {
  res.json({ message: 'You have accessed a protected team user route!', team_user: req.team_user });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});