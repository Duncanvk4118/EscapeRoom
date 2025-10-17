const { users, teams } = require('./src/db/models');

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

  // Add team
  const teamName = 'Test Team';
  const teamToken = 'testteamtoken';
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 1 week from now
  if (!teams.findByToken(teamToken)) {
    teams.create(teamName, teamToken, expiresAt);
    console.log('Team created:', teamName, teamToken);
  } else {
    console.log('Team already exists:', teamName);
  }
}

seed();
