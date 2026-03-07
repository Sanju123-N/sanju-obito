const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static HTML/CSS/JS

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'natarajan_mobile_db'
});

db.connect((err) => {
  if (err) { 
    console.log('❌ Failed:', err.message); 
  } else { 
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

// API Routes

// Register a customer
app.post('/api/register', (req, res) => {
  const { name, phone, email, address, device_model, service_type } = req.body;
  if (!name || !phone) return res.status(400).json({ success: false, message: 'Name and Phone required!' });

  const query = `INSERT INTO customers (name, phone, email, address, device_model, service_type) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(query, [name, phone, email, address, device_model, service_type], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error!' });
    res.json({ success: true, message: 'Registration successful!', customerId: result.insertId });
  });
});

// Get all customers
app.get('/api/customers', (req, res) => {
  db.query('SELECT * FROM customers ORDER BY registered_at DESC', (err, results) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true, data: results });
  });
});

// Delete a customer
app.delete('/api/customers/:id', (req, res) => {
  db.query('DELETE FROM customers WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true });
  });
});

// Optional: explicitly serve register.html (not needed if in public/)
app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Root route (optional)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📁 Public folder: ${path.join(__dirname, 'public')}`);
});
