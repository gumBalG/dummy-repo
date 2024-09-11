var express = require('express');
var cookieParser = require('cookie-parser');
var xss = require('xss');
var app = express();
app.use(cookieParser())

app.get('/', function(req, res) {
  if (req.cookies.profile) {
    try {
      var str = Buffer.from(req.cookies.profile, 'base64').toString();
      var obj = JSON.parse(str);
      if (obj.username) {
        // Use xss() function to sanitize the username
        res.send("Hello " + xss(obj.username));
      } else {
        res.send("Hello Guest");
      }
    } catch (error) {
      console.error('Error parsing profile:', error);
      res.status(400).send("Invalid profile data");
    }
  } else {
    var profile = {
      username: "guest",
      country: "unknown",
      city: "unknown"
    };
    var encodedProfile = Buffer.from(JSON.stringify(profile)).toString('base64');
    res.cookie('profile', encodedProfile, {
      maxAge: 900000,
      httpOnly: true,
      secure: true, // Only send cookie over HTTPS
      sameSite: 'strict' // Protect against CSRF
    });
    res.send("Hello Guest");
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});