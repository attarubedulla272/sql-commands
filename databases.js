const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const methodOverride = require('method-override');

const app = express();

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Database Connection
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '123456789',
  database: 'ubedulla'
});

// Home route with total user count
app.get('/', (req, res) => {
  const q = "SELECT COUNT(*) AS count FROM user";
  connection.query(q, (err, results) => {
    if (err) throw err;
    res.render('home', { userCount: results[0].count });
  });
});

// Display all users
app.get('/data', (req, res) => {
  const q = "SELECT * FROM user";
  connection.query(q, (err, results) => {
    if (err) throw err;
    res.render('datatable', { users: results });
  });
});

// Render form to edit a specific user by ID
app.get('/data/:id/edit', (req, res) => {
  const q = "SELECT * FROM user WHERE id = ?";
  connection.query(q, [req.params.id], (err, results) => {
    if (err) throw err;
    if (results.length === 0) return res.send("User not found");
    res.render('edit', { user: results[0] });
  });
});

// Update user by ID
app.put('/data/:id', (req, res) => {
  const { username, email, password } = req.body;
  const q = "UPDATE user SET username = ?, email = ?, password = ? WHERE id = ?";
  connection.query(q, [username, email, password, req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/data');
  });
});

// Delete user by ID
app.delete('/data/:id', (req, res) => {
  const q = "DELETE FROM user WHERE id = ?";
  connection.query(q, [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/data');
  });
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
