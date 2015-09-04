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
    getAllPid: 'select pid from product',//获取当前所存在的所有pid用于随机抽取3件
    threeRandomGood: 'select pid,pname,price,picture1 from product where pid=? or pid=? or pid=?',
    addGood: 'insert into product(sellerid,pname,ptext,price,amount,picture1,picture2,picture3,introduction) values(?,?,?,?,?,?,?,?,?)'
}
// 使用连接池，提升性能
var pool = mysql.createPool($conf.mysql);
/**
 * md5加密
 * @param text{string}  加密的字符串
 * @returns {string} 加密完成的字符串
 */
function md5(text) {                                   //md5加密
    return crypto.createHash('md5').update(text).digest('hex');
    // Encode each byte as two hexadecimal characters
}
/**
 * 随机产生3个不重复的 不大于max的数字 数组   随机性待优化
 * 并且需要确保 所选出的数字x  result[x]['pid']不等于num
 * @param max
 */
function threeRandomNotRepeat(result, num, max) {
    var rand = [];
    rand[0] = Math.round(Math.random() * max);
    while (result[rand[0]]['pid'] == num) {
        rand[0] = Math.round(Math.random() * max);
    }
    rand[1] = Math.round(Math.random() * max);
    while (rand[1] === rand[0] || result[rand[1]]['pid'] == num) {
        rand[1] = Math.round(Math.random() * max);
    }
    rand[2] = Math.round(Math.random() * max);
    while (rand[2] === rand[0] || rand[2] === rand[1] || result[rand[2]]['pid'] == num) {
        rand[2] = Math.round(Math.random() * max);
    }
    return rand;
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
            else res.end('database error ' + err);
        });
    },
    threeRandomGood: function (req, res, next) {
        var para = url.parse(req.url, true);
        var num = para.query.pid;
        pool.getConnection(function (err, connection) {
            if (!err) {
                connection.query($sql.getAllPid, function (err, result) {
                    if (!err) {
                        //这里的result是这样的东西[ { pid: 39 }, { pid: 40 }, { pid: 41 }, { pid: 42 }, { pid: 43 } ]
                        //下面随机抽取3个 请求所需数据
                        var rand = threeRandomNotRepeat(result, num, result.length - 1);
                        //console.log([result[rand[0]]['pid'] + ' ' + result[rand[1]]['pid'] + ' ' + result[rand[2]]['pid']])
                        connection.query($sql.threeRandomGood, [result[rand[0]]['pid'], result[rand[1]]['pid'], result[rand[2]]['pid']], function (err, result) {
                            if (!err) {
                                res.end(JSON.stringify(result));
                            }
                            else {
                                res.end('database error ' + err);
                            }
                        })
                    } else {
                        res.end('database error' + err)
                    }
                    connection.release();
                })
            }
            else res.end('database error ' + err);
        })
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

