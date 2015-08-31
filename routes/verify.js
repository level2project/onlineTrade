var express = require('express');
var app = express.Router();
var usingmysql = require('../handlers/db/usingmysql');

/**
 * 本js文件处理一切与数据库关联的信息！！！
 */


/**
 * 响应登录
 */
app.post('/', function (req, res, next) {
    req.on('data', function (data) {
        usingmysql.verifyByNamePassword(data, res, next);
    })
});
/**
 * 注册
 */
app.post('/register', function (req, res, next) {
    req.on('data', function (data) {
        usingmysql.register(data, res, next);
    })
});
/**
 * 读取商品信息 （响应home.html）
 */
app.get('/getGoods', function (req, res, next) {
    usingmysql.getGoods(res, next);
});
module.exports = app;