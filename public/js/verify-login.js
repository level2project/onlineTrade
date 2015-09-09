/**
 * Created by joe on 15-9-1.
 */
/**
 * 如果已经登录过了
 */
$().ready(function () {
    var alreadyLogin = document.cookie;
    if (alreadyLogin.indexOf('userName=') != -1) {
        var name = '';
        for (i = alreadyLogin.indexOf('userName=') + 9; i < alreadyLogin.length && (alreadyLogin[i] != ';' && alreadyLogin[i] != '&' ); i++) {
            name += alreadyLogin[i];
        }
        $('#login-before').html('welcome, ' + decodeURI(name));
        $('#login-before').attr('href', '#')
        $('#register').hide();
        $('#log-out').removeClass('hide');

        //本来所有需要登录的页面的跳转href都是login.html 全部修改到正常页面
        $('#shopping-car a').attr('href', 'checkout.html');             //购物车的href修正
        //console.log($('#seller *').first().html())
        $('#seller *').first().children(1).attr('href', 'upload.html');         //上传宝贝的href修正
        $('#custom').attr('href', 'custom.html');
    }

})
//退出登录 删除登录状态
$('#log-out').on('click', function (event) {
    //删除cookie
    var date = new Date();
    date.setTime(date.getTime() - 10);
    document.cookie = 'userName=abc;expires=' + date.toGMTString();

    //如果在需要登录的页面退出登录 那么需要跳回主页
    var a = document.createElement('a');
    a.href = window.location.href;
    //alert(a.pathname)
    if (a.pathname !== '/' && a.pathname !== '/home.html' && a.pathname !== '/single.html') {
        //不等于所有不需要登录的页面
        window.location.href = '/home.html';
        event = event || window.event;
        event.preventDefault();
    }

});
