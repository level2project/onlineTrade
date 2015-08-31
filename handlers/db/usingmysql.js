/**
 * Created by joe on 15-8-2.
 */
// 实现与MySQL交互
var mysql = require('mysql');
var url = require('url')
var crypto = require('crypto');
var $conf = require('../db/conf');             //ridiculous!!!
var $sql = {               //数据库的操作
    queryByNamePassword: 'select * from user where username=? and password=? ',
    register: ' insert into user(username,password,email) values(?,?,?);',
    getGoods: ' select pname,ptext,picture1 from product'
}
// 使用连接池，提升性能
var pool = mysql.createPool($conf.mysql);
function md5(text) {                                   //md5加密
    return crypto.createHash('md5').update(text).digest('hex');
    // Encode each byte as two hexadecimal characters
}
module.exports = {
    verifyByNamePassword: function (req, res, next) {
        var query = url.parse('?' + req.toString(), true).query;
        var userName = query.userName;
        var password = query.password;
        if (userName == '' || password == '') {//正常是不会这样的 因为前面有判断
            res.end('请填写帐号/密码');
            return;
        }
        password = md5(password);
        pool.getConnection(function (err, connection) {
            if (!err) {
                connection.query($sql.queryByNamePassword, [userName, password], function (err, result) {
                    if (!err) {
                        if (result.length == 0) {
                            console.log('帐号或密码错误')
                            res.end('帐号或密码错误');
                        } else {
                            console.log('帐号验证成功');
                            res.end('登录成功');
                        }
                    } else {
                        res.end('database error 2');
                    }
                    connection.release();
                });
            }
            else res.end('database error 1')
        });
    },
    register: function (req, res, next) {
        var query = url.parse('?' + req.toString(), true).query;
        var userName = query.userName;
        var password = query.password;
        var email = query.email;
        //console.log(userName+' '+password+' '+email)
        if (userName == '' || password == '') {//正常是不会这样的 因为前面有判断
            res.end('请填写帐号/密码');
            return;
        }
        password = md5(password);
        pool.getConnection(function (err, connection) {
            if (!err) {
                connection.query($sql.register, [userName, password,email], function (err, result) {
                    if (!err) {
                        res.end('注册成功');
                    } else {  //如果出错了 是帐号已被注册
                        res.end('该帐号已被注册');
                    }
                    connection.release();
                });
            }
            else res.end('database error')
        });
    },
    getGoods: function (res, next) {
        pool.getConnection(function (err, connection) {
            if (!err) {
                connection.query($sql.getGoods, function (err, result) {
                    if (!err) {
                        res.end(JSON.stringify(result));
                    } else {  //如果出错了 是帐号已被注册
                        res.end('database error '+err);
                    }
                    connection.release();
                });
            }
            else res.end('database error '+err)
        });
    }
};

