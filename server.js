const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const ngrok = require('@ngrok/ngrok');

const app = express();
const PORT = 5000;

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
  if (err) {
    console.log('❌ MySQL Failed:', err.message);
  } else {
    console.log('✅ MySQL connected!');
    createTable();
  }
});

// Create customers table
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
    if (err) console.log('❌ Table error:', err);
    else console.log('✅ Customers table ready!');
  });
}

// 🔹 Save customer API
app.post('/api/customers', (req, res) => {

  const { name, phone, email, address, device_model, service_type } = req.body;

  const sql = `
    INSERT INTO customers 
    (name, phone, email, address, device_model, service_type)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, phone, email, address, device_model, service_type],
    (err, result) => {
      if (err) {
        console.log('❌ DB Error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ message: '✅ Customer saved successfully!' });
    }
  );
});

// Start server
app.listen(PORT, '0.0.0.0', async () => {

  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📁 Public folder: ${path.join(__dirname, 'public')}`);

  try {

    const url = await ngrok.connect({
      addr: PORT,
      proto: 'http',
      authtoken: '3AcSWDqoQcG93KmSe5ZSnbNRIdR_7hzTaf6mbp3pbXzSzg4Es'
    });

    console.log(`🔥 Your public URL: ${url}`);

  } catch (err) {
    console.error('❌ Ngrok failed:', err);
  }

});