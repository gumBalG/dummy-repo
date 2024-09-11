const express = require('express');
const cookieParser = require('cookie-parser');
const escape = require('escape-html');
const app = express();
app.use(cookieParser());

app.get('/', function(req, res) {
  if (req.cookies.profile) {
    try {
      const profileData = JSON.parse(Buffer.from(req.cookies.profile, 'base64').toString());
      
      if (profileData && typeof profileData === 'object' && typeof profileData.username === 'string') {
        const sanitizedUsername = escape(profileData.username);
        res.send(`Hello ${sanitizedUsername}`);
      } else {
        throw new Error('Invalid profile data');
      }
    } catch (error) {
      console.error('Error processing profile:', error);
      res.status(400).json({ error: 'Invalid profile data' });
    }
  } else {
    const defaultProfile = {
      username: 'ajin',
      country: 'india',
      city: 'bangalore'
    };
    
    res.cookie('profile', Buffer.from(JSON.stringify(defaultProfile)).toString('base64'), {
      maxAge: 900000,
      httpOnly: true,
      secure: true, // Ensure the cookie is only sent over HTTPS
      sameSite: 'strict' // Protect against CSRF
    });
    
    res.send('Hello World');
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});