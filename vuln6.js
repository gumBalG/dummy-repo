var express = require('express');
var cookieParser = require('cookie-parser');
var escape = require('escape-html');
var app = express();
app.use(cookieParser())

app.get('/', function(req, res) {
 if (req.cookies.profile) {
   try {
     var str = Buffer.from(req.cookies.profile, 'base64').toString();
     var obj = JSON.parse(str);
     if (obj.username && typeof obj.username === 'string') {
       res.send("Hello " + escape(obj.username));
     } else {
       throw new Error('Invalid username');
     }
   } catch (error) {
     res.status(400).send("Invalid profile data");
   }
 } else {
     res.cookie('profile', "eyJ1c2VybmFtZSI6ImFqaW4iLCJjb3VudHJ5IjoiaW5kaWEiLCJjaXR5IjoiYmFuZ2Fsb3JlIn0=", {
       maxAge: 900000,
       httpOnly: true
     });
     res.send("Hello World");
 }
});

app.listen(3000);