/**
 * 帐号验证
 */
$('#loginBtn').on('click', function (event) {
    var event = event || window.event;
    var data = $('#login-form').serialize();
    if (data.indexOf("=&") != -1 || data[data.length - 1] == '=') { //如果没填帐号或者密码 直接返回
        alert("帐号或密码不能为空");
        return;
    }
    $.post('verify', data, function (text, status) {
        if (JSON.stringify(text) === '"登录成功"') {
            location.href='home.html';
        } else {
            alert(JSON.stringify(text).slice(1,-1));
        }
    })
    event.preventDefault();//阻止默认行为
})
