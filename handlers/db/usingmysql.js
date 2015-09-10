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
    giveCar: 'insert into shoppingcart(uid) values(?)',
    getGoods: 'select pid,pname,ptext,picture1 from product',
    getSearchGoods: 'select pid,pname,ptext,picture1 from product where pname like ?',
    goodDetail: 'select * from product,pcategory,user where product.pid=? && product.pcid=pcategory.pcid && user.uid=product.sellerid',
    getAllPid: 'select pid from product',//获取当前所存在的所有pid用于随机抽取3件
    threeRandomGood: 'select pid,pname,price,picture1 from product where pid=? or pid=? or pid=?',
    addGood: 'insert into product(sellerid,pname,ptext,price,amount,picture1,picture2,picture3,introduction) values(?,?,?,?,?,?,?,?,?)',
    addToCar: 'insert into cartitem(scid,pid,amount)  select scid,?,? from shoppingcart where uid=?;',
    checkGood: 'select * from product where sellerid=? && pid=?',
    //判断是不是正在买自己的商品
    removeFromCar: 'delete from cartitem where pid=? and scid= (select scid from shoppingcart where uid=?)',
    getCarItem: 'select cartitem.pid,picture1,pname,price,cartitem.amount,addtime from shoppingcart,cartitem,product where shoppingcart.uid = ? && shoppingcart.scid = cartitem.scid && cartitem.pid = product.pid',
    verifyPayDo1: 'insert into salesorder(sellerid,buyerid,aid,statue) select sellerid,?,1,"未完成" from shoppingcart,cartitem,product ' +
        'where (shoppingcart.uid = ? && shoppingcart.scid=cartitem.scid && cartitem.pid=product.pid) group by sellerid;',
    verifyPayDo2: 'insert into orderitem(sid,pid,amount) select sid,product.pid,cartitem.amount from shoppingcart,cartitem,product,salesorder ' +
        'where (shoppingcart.uid = ? && shoppingcart.scid=cartitem.scid && cartitem.pid=product.pid  && salesorder.buyerid = ? && ' + 'salesorder.sellerid=product.sellerid && salesorder.statue="未完成"); ',
    verifyPayDo3: 'delete from cartitem where scid =  (select scid from shoppingcart where uid=?);',
    changeToFinish: 'update salesorder set statue="已完成" where buyerid=?',
    //这句是要先收到货 才执行的 这里直接执行
    getOrderItem: 'select product.pid,picture1,pname,price,orderitem.amount,stime from product,salesorder,orderitem where buyerid=? && salesorder.sid = orderitem.sid && orderitem.pid = product.pid'
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
                            console.log('帐号或密码错误');
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
            else res.end('database error 1');
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
                                //注册成功后 分配购物车
                                connection.query($sql.giveCar, [result[0]['uid']], function (err) {
                                    if (!err) {
                                        console.log(userName + '注册成功');
                                        res.end('注册成功' + JSON.stringify(result));
                                    } else {
                                        console.log('不是把？');
                                        res.end('您无法购买商品,请与管理员联系！');
                                    }
                                });
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
    getGoods: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            if (!err) {
                connection.query($sql.getGoods, function (err, result) {
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
    getSearchGoods: function (req, res, next) {
        var para = url.parse(req.url, true);
        var searchStr = '%';
        searchStr += para.query.searchStr;
        searchStr += '%';
        console.log('我来知道有人用过搜索功能没' + searchStr);
        pool.getConnection(function (err, connection) {
            if (!err) {
                connection.query($sql.getSearchGoods, [searchStr], function (err, result) {
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
                        res.end('database error' + err);
                    }
                    connection.release();
                });
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
            else res.end('database error');
        });
    },
    addToCar: function (req, res, next) {
        var para = url.parse(req.url, true);
        var uid = para.query.uid;
        var amount = para.query.amount;
        var pid = para.query.pid;
        pool.getConnection(function (err, connection) {
            if (!err) {
                connection.query($sql.checkGood, [uid, pid], function (err, result) {
                    if (!err) {
                        if (result.length !== 0) {//如果有返回值，证明是正在买自己的商品
                            res.end('不能购买自己的商品！！');
                        } else {
                            connection.query($sql.addToCar, [pid, amount, uid], function (err, result) {
                                if (!err) {
                                    res.end('添加成功');
                                } else {
                                    res.end('该商品已经在购物车了。' + err);
                                }
                                connection.release();
                            });
                        }
                    } else {
                        res.end('这是什么错误？' + err);
                    }
                });
            }
            else res.end('database error ' + err);
        })
    },
    removeFromCar: function (req, res, next) {
        var para = url.parse(req.url, true);
        var uid = para.query.uid;
        var pid = para.query.pid;
        pool.getConnection(function (err, connection) {
            if (!err) {
                connection.query($sql.removeFromCar, [pid, uid], function (err, result) {
                    if (!err) {
                        res.end('删除成功');
                    } else {
                        res.end('删除失败？' + err);
                    }
                    connection.release();
                });
            }
            else res.end('database error ' + err);
        })
    },
    getCarItem: function (req, res, next) {
        var para = url.parse(req.url, true);
        var uid = para.query.uid;
        pool.getConnection(function (err, connection) {
            if (!err) {
                connection.query($sql.getCarItem, [uid], function (err, result) {
                    if (!err) {
                        res.end(JSON.stringify(result));
                    } else {
                        res.end('database error' + err);
                    }
                    connection.release();
                });
            }
            else res.end('database error ' + err);
        })
    },
    verifyPay: function (req, res, next) {
        var para = url.parse(req.url, true);
        var uid = para.query.uid;
        //console.log(uid);
        pool.getConnection(function (err, connection) {
            if (!err) {
                connection.query($sql.verifyPayDo1, [uid, uid], function (err, result) {
                    if (!err) {
                        connection.query($sql.verifyPayDo2, [uid, uid], function (err, result) {
                            if (!err) {
                                connection.query($sql.verifyPayDo3, [uid], function (err, result) {
                                    if (!err) {//直接把订单状态改为已完成
                                        connection.query($sql.changeToFinish, [uid], function (err, result) {
                                            if (!err) {
                                                res.end('付款成功。');
                                            } else {
                                                res.end('database error at finish order  ' + err);
                                            }
                                        });
                                    } else {
                                        res.end('database error at delete from cartitem  ' + err);
                                    }
                                });
                            } else {
                                res.end('购买同一商家商品还有问题 待解决。。。database error at insert into orderitem ' + err);
                            }
                        });
                    } else {
                        res.end('database error at insert into salesorder ' + err);
                    }
                    connection.release();
                });
            }
            else res.end('database error ' + err);
        })
    },
    getOrderItem: function (req, res, next) {
        var para = url.parse(req.url, true);
        var uid = para.query.uid;
        pool.getConnection(function (err, connection) {
            if (!err) {
                connection.query($sql.getOrderItem, [uid], function (err, result) {
                    if (!err) {
                        res.end(JSON.stringify(result));
                    } else {
                        res.end('database error' + err);
                    }
                    connection.release();
                });
            }
            else res.end('database error ' + err);
        })
    }
};

