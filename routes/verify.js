var express = require('express');
var app = express.Router();
var usingmysql = require('../handlers/db/usingmysql');

/**
 * 响应登录
 */
app.post('/', function (req, res, next) {
    req.on('data', function (data) {
        usingmysql.verifyByNamePassword(data, res, next);
    })
});
module.exports = app;