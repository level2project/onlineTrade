var express = require('express');
var app = express.Router();

app.get('/', function (req, res) {
    console.log('someone is visiting the home.html');
    res.render('home');
});
app.get('/home.html', function (req, res) {
    res.render('home');
});
app.get('/login.html', function (req, res) {
    res.render('login');
});
app.get('/register.html', function (req, res) {
    res.render('register');
});
app.get('/single.html', function (req, res) {
    res.render('single');
});
app.get('/checkout.html', function (req, res) {
    res.render('checkout');
});
module.exports = app;