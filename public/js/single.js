addEventListener("load", function () {
    setTimeout(hideURLbar, 0);
}, false);
function hideURLbar() {
    window.scrollTo(0, 1);
}
$(document).ready(function () {
    $(".memenu").memenu();
});

/**
 * 如果已经登录过了
 */
$().ready(function () {
    var alreadyLogin = document.cookie;
    if (alreadyLogin.indexOf('userName=') != -1) {
        var name = '';
        for (i = alreadyLogin.indexOf('userName=') + 9; i < alreadyLogin.length && alreadyLogin[i] != ';'; i++) {
            name += alreadyLogin[i];
        }
        $('#login-before').html('welcome, ' + decodeURI(name));
        $('#login-before').attr('href', '')
        $('#register').hide();
        $('#log-out').removeClass('hide');
    }
})
//退出登录 删除登录状态
$('#log-out').on('click', function () {
    //删除cookie
    var date = new Date();
    date.setTime(date.getTime() - 10);
    document.cookie = 'userName=abc;expires=' + date.toGMTString();
});

/**
 * 从locantion中获取商品的pid
 */
var a = document.createElement('a')
a.setAttribute('href', window.location.href);
console.log((a.search.substr(6)));
/**
 * 请求、渲染对应商品信息
 */
$.get('/verify/goodDetail', {pid: a.search.substr(6)}, function (text, status) {
    console.log(text);
    var Data = JSON.parse(text)[0];
    if (Data.pname)
        $('#pname').html(Data.pname);
    if (Data.ptext)
        $('#ptext').html(Data.ptext);
    if (Data.price)
        $('#price').html('￥' + Data.price);
    if (Data.introduction)
        $('#introduction').html(Data.introduction);
    if (Data.picture1)
        $('#picture1').attr('src', Data.picture1).parent().attr('data-thumb', Data.picture1);
    if (Data.picture2)
        $('#picture2').attr('src', Data.picture2).parent().attr('data-thumb', Data.picture2);
    if (Data.picture3)
        $('#picture3').attr('src', Data.picture3).parent().attr('data-thumb', Data.picture3);

    //下面添加商品的额外信息  后面要考虑重构。。。（未实现。。）
    if (Data.soldamount)
        $('#rest').html(Data.amount - Data.soldamount);
    if (Data.pcstyle)
        $('#pcstyle').html(Data.pcstyle);
    if (Data.pcname)
        $('#good-type').html(Data.pcname);

});

