/**
 * node核心模块
 */
var express = require('express');
var path = require('path');
var ejs = require('ejs');
var app = express();
/**
 * 我们的处理模块 依次是 主页 文档服务器相关 权限服务器相关
 */
var index = require('./routes/index');

/* 视图模板配置 */
//app.set('views', __dirname + '/views');   //jade写法
//app.set('views engine', 'jade');

app.engine('.html', ejs.__express);        //html写法
app.set('view engine', 'html');
/**
 * 中间件配置
 */
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/')));
app.use('/', index);



/* 端口监听 */
app.listen(3000, function () {
    console.log("listening on 3000")
});
