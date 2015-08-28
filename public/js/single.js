addEventListener("load", function () {
    setTimeout(hideURLbar, 0);
}, false);
function hideURLbar() {
    window.scrollTo(0, 1);
}
$(document).ready(function () {
    $(".memenu").memenu();
});

//如果已经登录过了
var alreadyLogin = document.cookie;
if (alreadyLogin.indexOf('userName=') != -1) {
    var name = '';
    for (i = alreadyLogin.indexOf('userName=') + 9; i < alreadyLogin.length && alreadyLogin[i] != ';'; i++) {
        name += alreadyLogin[i];
    }
    $('#login-before').html('welcome, '+decodeURI(name));
    $('#login-before').attr('href','')
    $('#register').hide();
    $('#log-out').removeClass('hide');
}
$('#log-out').on('click',function(){
    //删除cookie
    var date = new Date();
    date.setTime(date.getTime() - 10);
    document.cookie = 'userName=abc;expires=' + date.toGMTString();
})