/**
 * Created by joe on 15-8-2.
 */
// 实现与MySQL交互
var mysql = require('mysql');
var url = require('url')
var crypto = require('crypto');
var $conf = require('../db/conf');             //ridiculous!!!
var $sql = {               //数据库的操作
    queryByNamePassword: 'select * from user where username=? and password=?',
    register: 'insert into user(username,password,email) values(?,?,?);',
    askForUid: 'select uid from user where username=?',
    getGoods: 'select pid,pname,ptext,picture1 from product',
    goodDetail: 'select * from product,pcategory where product.pid=? && product.pcid=pcategory.pcid',
    addGood: 'insert into product(sellerid,pname,ptext,price,amount,picture1,picture2,picture3,introduction) values(?,?,?,?,?,?,?,?,?)'
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
                            console.log('用户：' + result[0].uid + result[0].username + '帐号验证成功')
                            res.end('登录成功' + result[0].uid);
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
                connection.query($sql.register, [userName, password, email], function (err, result) {
                    if (!err) {//注册成功了 再查询返回用户的uid以备使用
                        connection.query($sql.askForUid, [userName], function (err, result) {
                            if (!err) {
                                console.log(userName + '注册成功');
                                res.end('注册成功' + JSON.stringify(result));
                            } else {
                                res.end('database error');//一般不会有这个问题
                            }
                        })
                    } else {  //如果出错了 是帐号已被注册
                        res.end('该帐号已被注册');
                    }
                    connection.release();
                });
            }
            else res.end('database error');
        });
    },
    getGoods: function (res, next) {
        pool.getConnection(function (err, connection) {
            if (!err) {
                connection.query($sql.getGoods, function (err, result) {
                    if (!err) {
                        res.end(JSON.stringify(result));
                    } else {  //如果出错了 是帐号已被注册
                        res.end('database error ' + err);
                    }
                    connection.release();
                });
            }
            else res.end('database error ' + err)
        });
    },
    goodDetail: function (req, res, next) {
        var para = url.parse(req.url, true);
        var num = para.query.pid;
        pool.getConnection(function (err, connection) {
            if (!err) {
                connection.query($sql.goodDetail, [num], function (err, result) {
                    if (!err) {
                        res.end(JSON.stringify(result));
                    } else {
                        res.end('database error ' + err);
                    }
                    connection.release();
                });
            }
            else res.end('database error ' + err)
        });
    },
    addGood: function (req, res, next) {
        var query = url.parse('?' + req.toString(), true).query;
        var sellerid = query.sellerid,
            pname = query.pname,
            ptext = query.ptext,
            price = query.price,
            amount = query.amount,
            picture1 = query.picture1,
            picture2 = query.picture2,
            picture3 = query.picture3,
            introduction = query.introduction;
        pool.getConnection(function (err, connection) {
            if (!err) {
                connection.query($sql.addGood, [sellerid, pname, ptext, price, amount, picture1, picture2, picture3, introduction], function (err, result) {
                    if (!err) {
                        res.end('添加成功');
                    } else {  //如果出错了 是?
                        console.log(err);
                        res.end('添加失败？？？');
                    }
                    connection.release();
                });
            }
            else res.end('database error')
        });
    }
};

