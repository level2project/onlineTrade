var express = require('express');
var app = express.Router();

app.get('/', function (req, res) {
    console.log('someone is visiting the home.html');
    res.render('home');
});
app.get('/login.html', function (req, res) {
    //console.log('someone is visiting the home.html');
    res.render('login');
});
module.exports = app;