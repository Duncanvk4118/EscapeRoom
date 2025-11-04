const { users, teams, questions, answers, escapeRooms, erQuestions, erSessions, erSessionQuestions } = require('./src/db/models');

async function seed() {
  // Add admin account
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123';
  const adminName = 'Admin';
  if (!users.findByEmail(adminEmail)) {
    await users.create(adminName, adminEmail, adminPassword);
    console.log('Admin account created:', adminEmail, adminPassword);
  } else {
    console.log('Admin account already exists:', adminEmail);
  }

  const admin = users.findByEmail(adminEmail);
  const adminId = admin && admin.id;
  if (!adminId) {
    console.error('Could not resolve admin user id, aborting seed.');
    return;
  }

  // Create an example escape room
  const erName = 'Demo Escape Room';
  const existing = escapeRooms.findAll().find((e) => e.name === erName && e.user_id === adminId);
  let erId;
  if (existing) {
    erId = existing.id;
    console.log('Escape room already exists:', erName, erId);
  } else {
    const r = escapeRooms.create(adminId, erName);
    erId = r.lastInsertRowid || r.lastInsertRowId || r.ID || r.id;
    console.log('Created escape room:', erName, erId);
  }

  // Create 12 questions, link them to the escape room, and add mock answers
  for (let i = 1; i <= 12; i++) {
    const qText = `Question ${i}: What is ${i} + ${i}?`;
    const description = `This is a mock description for question ${i}.`;
    const location = `Location ${i}`;
    const qRes = questions.create(adminId, 1, qText, description, location, null, null);
    const qId = qRes.lastInsertRowid || qRes.lastInsertRowId || qRes.ID || qRes.id;
    console.log('Created question', qId, qText);

    // Add four answers, one correct
    const correctIndex = (i % 4) + 1; // 1..4
    for (let a = 1; a <= 4; a++) {
      const ansText = `Choice ${a} for question ${i}`;
      const correct = a === correctIndex ? 1 : 0;
      answers.createForQuestion(qId, ansText, correct);
    }

    // Link question to escape room
    erQuestions.create(erId, qId);
    console.log('Linked question', qId, 'to escape room', erId);
  }

  console.log('Seeding complete.');

  try {
    const sessionName = 'Demo Session';
    const existingSession = erSessions.findAll().find((s) => s.er_id === erId && s.name === sessionName);
    let sessionId;
    if (existingSession) {
      sessionId = existingSession.id || existingSession.ID || existingSession.lastInsertRowid;
      console.log('Session already exists:', sessionId);
    } else {
      const s = erSessions.create(erId, sessionName, new Date().toISOString(), null);
      sessionId = s.lastInsertRowid || s.lastInsertRowId || s.ID || s.id;
      console.log('Created session', sessionId);
    }

    const links = erQuestions.findByErId(erId) || [];
    const Q = links.length;
    if (Q === 0) {
      console.log('No linked questions found for session population.');
    } else {
      const crypto = require('crypto');
      const teamsCount = 4;
      const createdTeams = [];
      for (let t = 0; t < teamsCount; t++) {
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
      console.log('Created session with teams:', createdTeams);
    }
  } catch (err) {
    console.error('Error creating demo session:', err.message);
  }
}

seed();
