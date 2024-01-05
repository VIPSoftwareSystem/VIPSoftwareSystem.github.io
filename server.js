
// server.js

const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const session = require('express-session');
const platesDBController = require('./platesDBController');

const app = express();
const PORT = 3000;

// Connect to the SQLite database
const db = new sqlite3.Database('userbase.db');

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Middleware for session management
app.use(session({
  secret: 'your_secret_key', // Change this to a secure secret
  resave: false,
  saveUninitialized: true,
}));

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static('public'));

// Set front.html as the default file for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Example endpoint for user login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  // Query the database to check user credentials
  db.get(
    'SELECT * FROM userbase WHERE Username = ? AND UserPassword = ?',
    [username, password],
    (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Internal server error.' });
      }

      if (row) {
        const { UserID, AccessLevel, Username } = row;

        // Set session variables to indicate user is authenticated and store the username
        req.session.authenticated = true;
        req.session.username = Username;

        // Redirect to the front.html page after successful login
        res.redirect('/front.html');
      } else {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }
    }
  );
});
// Recent Change 02/02/2024


// Route to check authentication status
app.get('/check-auth', (req, res) => {
  if (req.session && req.session.authenticated) {
    // If authenticated, send JSON response with user information
    res.json({
      authenticated: true,
      username: req.session.username,
    });
  } else {
    // If not authenticated, send JSON response with authenticated set to false
    res.json({
      authenticated: false,
    });
  }
});

// Route to handle logout
app.post('/logout', (req, res) => {
  // Clear session variables to indicate the user is not authenticated
  req.session.authenticated = false;
  req.session.username = null;

  // Redirect to the login page after successful logout
  res.redirect('/');
});

// Use platesDBController for plates-related routes
app.use('/', platesDBController);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});