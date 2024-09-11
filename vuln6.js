const express = require('express');
const cookieParser = require('cookie-parser');
const escape = require('escape-html');
const app = express();

app.use(cookieParser());

// Helper function to validate username
function isValidUsername(username) {
  return typeof username === 'string' && username.length > 0 && username.length <= 50 && /^[a-zA-Z0-9_]+$/.test(username);
}

app.use((req, res, next) => {
  // Set security headers
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

app.get('/', function(req, res) {
  if (req.cookies.profile) {
    try {
      const profileData = JSON.parse(Buffer.from(req.cookies.profile, 'base64').toString());
      
      if (profileData.username && isValidUsername(profileData.username)) {
        const safeUsername = escape(profileData.username);
        res.json({ message: `Hello ${safeUsername}` });
      } else {
        res.json({ message: 'Invalid username' });
      }
    } catch (error) {
      res.status(400).json({ error: 'Invalid profile data' });
    }
  } else {
    const defaultProfile = {
      username: 'guest',
      country: 'unknown',
      city: 'unknown'
    };
    
    res.cookie('profile', Buffer.from(JSON.stringify(defaultProfile)).toString('base64'), {
      maxAge: 900000,
      httpOnly: true,
      secure: true, // Ensure the cookie is only sent over HTTPS
      sameSite: 'strict' // Protect against CSRF
    });
    
    res.json({ message: 'Hello World' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});