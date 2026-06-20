const { google } = require('googleapis');
const creds = require('./backend/google-credentials.json');

const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function testSheet(id) {
  try {
    const res = await sheets.spreadsheets.get({ spreadsheetId: id });
    console.log(`Success! Found sheet: ${res.data.properties.title}`);
  } catch (err) {
    console.error(`Failed for ${id}: ${err.message}`);
  }
}

const possibleIds = [
  '1wHwEzo_bAbjBhYPedAlx8OMCjgsKA3rO5nSGqclgOhg',
  '1wHwEzo_bAbjBhYPedAIx8OMCjgsKA3rO5nSGqclgOhg',
  '1wHwEzo_bAbjBhYPedAix8OMCjgsKA3rO5nSGqclgOhg'
];

async function run() {
  for (let id of possibleIds) {
    await testSheet(id);
  }
}
run();
