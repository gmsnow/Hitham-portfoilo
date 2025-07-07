const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Only one pool using env var
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    await pool.query(
      'INSERT INTO contact_messages(name, email, subject, message) VALUES($1, $2, $3, $4)',
      [name, email, subject, message]
    );
    res.status(200).json({ message: 'Message saved successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error. Message not saved.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
