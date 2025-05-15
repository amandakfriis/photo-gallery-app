// ✅ BACKEND: app.js

const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'photo-gallery-secret',
  resave: false,
  saveUninitialized: false
}));

const db = mysql.createConnection({
  host: '34.60.230.173',
  user: 'photo_user',
  password: 'Photo@1234',
  database: 'photo_gallery'
});

db.connect(err => {
  if (err) return console.error('❌ DB connection failed:', err);
  console.log('✅ Connected to MySQL!');
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, '/tmp'), // Temporary storage location
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

/******************************************************** */
// Serve React build (frontend)
const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));

// Catch-all to send React index.html (for React Router)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.startsWith('/download')) {
    return next(); // Skip for API or static files
  }
  res.sendFile(path.join(buildPath, 'index.html'));
});

const uploadsPath = '/tmp'; // GAE allows writing here

const uploadDir = '/tmp';  // Use the writable '/tmp' directory
app.use('/uploads', express.static('/tmp'));

/******************************************************** */

app.get('/api/', (req, res) => res.send('📸 Photo Gallery Backend is working!'));

// 🔐 Signup
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.query('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hash], (err) => {
    if (err) {
      console.error('Signup error:', err);

      // Check if the error is related to a duplicate username
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ success: false, message: 'Username already exists' });
      }

      return res.status(400).json({ success: false, message: 'An error occurred during signup' });
    }
    res.json({ success: true, message: 'User registered successfully!' });
  });
});

// 🔑 Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid username' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ success: false, message: 'Incorrect password' });

    req.session.userId = user.id;
    res.json({ success: true, userId: user.id, message: 'Login successful' });
  });
});

// 🚪 Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.send('Logged out');
});

// 📤 Upload
app.post('/api/upload', upload.single('photo'), (req, res) => {
  if (!req.session.userId) return res.status(401).send('Unauthorized');

  const tempPath = req.file.path; // File saved to /tmp
  const filename = req.file.originalname;
  const finalPath = path.join(uploadsPath, filename); // /uploads/filename

  // Move the file from /tmp to /uploads
  fs.rename(tempPath, finalPath, (err) => {
    if (err) return res.status(500).send('Failed to move file');

    const photoUrl = `/uploads/${filename}`;
    db.query('INSERT INTO photos (user_id, photo_url) VALUES (?, ?)', [req.session.userId, photoUrl], (err) => {
      if (err) return res.status(500).send('Failed to save photo to DB');
      res.send('Upload successful!');
    });
  });
});

// 🖼️ Fetch Photos
app.get('/api/photos', (req, res) => {
  if (!req.session.userId) return res.status(401).send('Unauthorized');

  const search = req.query.search || '';
  db.query(
    'SELECT * FROM photos WHERE user_id = ? AND photo_url LIKE ? ORDER BY uploaded_at DESC',
    [req.session.userId, `%${search}%`],
    (err, results) => {
      if (err) return res.status(500).send('Failed to fetch photos');
      res.json(results);
    }
  );
});

// 🗑️ Delete Photo
app.delete('/api/photos/:id', (req, res) => {
  const userId = req.session.userId;
  const photoId = req.params.id;

  db.query('SELECT * FROM photos WHERE id = ? AND user_id = ?', [photoId, userId], (err, results) => {
    if (err || results.length === 0) return res.status(404).send('Photo not found or access denied');

    const filePath = path.join(__dirname, results[0].photo_url);
    db.query('DELETE FROM photos WHERE id = ?', [photoId], (err) => {
      if (err) return res.status(500).send('Failed to delete photo');
      fs.unlink(filePath, () => res.send('Photo deleted successfully'));
    });
  });
});

// ⬇️ Download Photo
app.get('/api/download/:filename', (req, res) => {
  const filePath = path.join(uploadsPath, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).send('File not found');
  res.download(filePath);
});


app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});