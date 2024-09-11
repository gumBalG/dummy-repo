const express = require('express');
const cookieParser = require('cookie-parser');
const escape = require('escape-html');
const app = express();
app.use(cookieParser())

app.get('/', function(req, res) {
  if (req.cookies.profile) {
    try {
      const profileData = JSON.parse(Buffer.from(req.cookies.profile, 'base64').toString());
      
      // Validate and sanitize the username
      const username = typeof profileData.username === 'string' ? profileData.username.trim() : '';
      
      if (username) {
        // Use res.json() to ensure proper encoding
        res.json({ message: `Hello ${escape(username)}` });
      } else {
        res.json({ message: "Invalid username" });
      }
    } catch (error) {
      console.error('Error parsing profile data:', error);
      res.status(400).json({ error: 'Invalid profile data' });
    }
  } else {
    const defaultProfile = {
      username: "guest",
      country: "unknown",
      city: "unknown"
    };
    
    res.cookie('profile', Buffer.from(JSON.stringify(defaultProfile)).toString('base64'), {
      maxAge: 900000,
      httpOnly: true,
      secure: true, // Only send cookie over HTTPS
      sameSite: 'strict' // Protect against CSRF
    });
    
    res.json({ message: "Hello World" });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});