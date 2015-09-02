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
    $.post('/verify', data, function (text, status) {
        if (/登录成功/.test(JSON.stringify(text))) {
            document.cookie = 'userName=' + (/=.+&/.exec(data)).toString().slice(1, -1);
            document.cookie = 'id=' + text.substr(4);
            location.href = '/';
        } else {
            alert(JSON.stringify(text).slice(1, -1));
        }
    })
    event.preventDefault();//阻止默认行为
})
