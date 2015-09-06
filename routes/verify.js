var express = require('express');
var app = express.Router();
var usingmysql = require('../handlers/db/usingmysql');

/**
 * 本js文件处理一切与数据库关联的信息！！！
 */


/**
 * 登录(响应login.html)
 * 返回 帐号或密码错误/ 登录成功(以及用户uid)
 */
app.post('/', function (req, res, next) {
    req.on('data', function (data) {
        usingmysql.verifyByNamePassword(data, res, next);
    })
});
/**
 * 注册(响应register.html)
 */
app.post('/register', function (req, res, next) {
    req.on('data', function (data) {
        usingmysql.register(data, res, next);
    })
});
/**
 * 读取商品信息 (响应home.html)
 */
app.get('/getGoods', function (req, res, next) {
    usingmysql.getGoods(req, res, next);
});
/**
 * 读取商品详细信息 (响应single.html)
 */
app.get('/goodDetail', function (req, res, next) {
    usingmysql.goodDetail(req, res, next);
});
/**
 * 随机返回3个商品信息 (放在single.html下方的)
 * 需要的信息有pid、pname、price、picture1
 */
app.get('/threeRandomGood', function (req, res, next) {
    usingmysql.threeRandomGood(req, res, next);
});
/**
 * 添加商品(响应upload.html)
 */
app.post('/addGood', function (req, res, next) {
    req.on('data', function (data) {
        usingmysql.addGood(data, res, next);
    })
});
/**
 * 添加商品到购物车(响应single.html)
 */
app.get('/addToCar', function (req, res, next) {
    usingmysql.addToCar(req, res, next);
});
/**
 * 删除购物车中商品(响应single.html)
 */
app.get('/removeFromCar', function (req, res, next) {
    usingmysql.removeFromCar(req, res, next);
});
/**
 * 获取购物车内容(响应checkout.html)
 * 参数是当前用户uid  需返回pid、picture1、pname、price、amount、[addDate]
 */
app.get('/getCarItem', function (req, res, next) {
    usingmysql.getCarItem(req, res, next);
});
module.exports = app;