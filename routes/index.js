var express = require('express');
var app = express.Router();

app.get('/', function (req, res) {
    console.log('someone is visiting the home.html');
    res.render('login');
});
app.get('/home.html', function (req, res) {
    //console.log('someone is visiting the home.html');
    res.render('home');
});
module.exports = app;