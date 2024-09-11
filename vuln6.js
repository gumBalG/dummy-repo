var express = require('express');
var cookieParser = require('cookie-parser');
var escapeHtml = require('escape-html');
var serialize = require('node-serialize');
var app = express();
app.use(cookieParser())

app.get('/', function(req, res) {
    if (req.cookies.profile) {
        var str = Buffer.from(req.cookies.profile, 'base64').toString();
        var obj = serialize.unserialize(str);
        if (obj.username) {
            const sanitizedUsername = escapeHtml(obj.username); // Ensuring username is safely escaped.
            res.send("Hello " + sanitizedUsername);
            return; // Ensure to properly handle response termination to avoid sending multiple responses.
        }
    } else {
        res.cookie('profile', "eyJ1c2VybmFtZSI6ImFqaW4iLCJjb3VudHJ5IjoiaW5kaWEiLCJjaXR5IjoiYmFuZ2Fsb3JlIn0=", {
            maxAge: 900000,
            httpOnly: true
        });
        // Note: You might need to send a response after setting the cookie
        // like, res.send("Cookie set, please reload to see the changes.");
    }
    res.send("Hello World");
});

app.listen(3000);