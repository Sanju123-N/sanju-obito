const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 5000;
const ngrok = require('@ngrok/ngrok');

(async function startNgrok() {
  try {
    const url = await ngrok.connect({
      addr: '127.0.0.1:5000',
      proto: 'http',
      authtoken: '3AcSWDqoQcG93KmSe5ZSnbNRIdR_7hzTaf6mbp3pbXzSzg4Es' // your real token here
    });
    console.log("🔥 Your public URL:", url.url());
  } catch (err) {
    console.error('❌ Ngrok failed:', err);
  }
})();
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'natarajan_mobile_db'
});

db.connect((err) => {
  if (err) console.log('❌ Failed:', err.message);
  else {
    console.log('✅ MySQL connected!');
    createTable();
  }
});

// Create customers table if not exists
function createTable() {
  const query = `CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100),
    address TEXT,
    device_model VARCHAR(100),
    service_type VARCHAR(100),
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;
  db.query(query, (err) => {
    if (!err) console.log('✅ Customers table ready!');
  });
}

// API routes here ...

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📁 Public folder: ${path.join(__dirname, 'public')}`);
});

// 🔹 Ngrok tunnel async function
(async function startNgrok() {
  try {
    const url = await ngrok.connect({
      addr: PORT,
      proto: 'http'
      // authtoken added via CLI, so no need here
    });
    console.log(`🔥 Your public URL: ${url}`);
  } catch (err) {
    console.error('❌ Ngrok failed:', err);
  }
})();