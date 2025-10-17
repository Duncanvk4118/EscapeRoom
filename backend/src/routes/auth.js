const express = require('express');
const router = express.Router();
const { users, sessions } = require('../db/models');
const { generateToken, getTokenExpiry, authMiddleware } = require('../middleware/auth');

router.use(express.json());

// Admin registration, currently disabled, admin accounts shouldnt be able to be created freely probably will add some weird shit later to make admin accs :thumbs_up:
// router.post('/register', async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const existingUser = users.findByEmail(email);
//     if (existingUser) {
//       return res.status(400).json({ error: 'User already exists' });
//     }

//     const result = await users.create(name, email, password);
//     const user = users.findById(result.lastInsertRowid);

//     const token = generateToken({ id: user.ID, email: user.email });
//     const expiresAt = getTokenExpiry(token);
//     sessions.createUserSession(user.ID, token, expiresAt);

//     res.status(201).json({
//       message: 'User created successfully',
//       token,
//       user: {
//         id: user.ID,
//         name: user.name,
//         email: user.email
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await users.verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ id: user.ID, email: user.email });

    const expiresAt = getTokenExpiry(token);
    sessions.createUserSession(user.ID, token, expiresAt);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.ID,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/logout', authMiddleware, (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    sessions.deleteUserSession(token);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;