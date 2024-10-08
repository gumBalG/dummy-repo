var express = require('express');
var cookieParser = require('cookie-parser');
var serialize = require('node-serialize');
var createDOMPurify = require('dompurify');
var { JSDOM } = require('jsdom');

var app = express();
app.use(cookieParser());

// Initialize DOMPurify
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );
  next();
});

app.get('/', function(req, res) {
 if (req.cookies.profile) {
   var str = Buffer.from(req.cookies.profile, 'base64').toString();
   var obj = serialize.unserialize(str);
   if (obj.username) {
     // Sanitize the username using DOMPurify
     var sanitizedUsername = DOMPurify.sanitize(obj.username);
     res.send("Hello " + sanitizedUsername);
   }
 } else {
     res.cookie('profile', "eyJ1c2VybmFtZSI6ImFqaW4iLCJjb3VudHJ5IjoiaW5kaWEiLCJjaXR5IjoiYmFuZ2Fsb3JlIn0=", {
       maxAge: 900000,
       httpOnly: true,
       secure: true,
       sameSite: 'strict'
     });
 }
 res.send("Hello World");
});

app.listen(3000);