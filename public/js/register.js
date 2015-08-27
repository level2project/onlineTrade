/**
 * 帐号注册
 */
$('#registerBtn').on('click', function (event) {
    var event = event || window.event;
    var data = $('#register-form').serialize();
    //console.log(data)
    if (data.indexOf("=&") != -1 || data[data.length - 1] == '=') { //如果没填帐号或者密码 直接返回
        event.preventDefault();//阻止默认行为
        alert("帐号或密码不能为空");
        return;
    }
    if(!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test($('#email').val()))){
        event.preventDefault();//阻止默认行为
        alert('请输入正确的邮箱');
        return;
    }
    $.post('/verify/register', data, function (text, status) {
        if (JSON.stringify(text) === '"注册成功"') {
            //userName=22333&email=admin&password=admin
            document.cookie = 'userName=' + (/=.+?&/.exec(data)).toString().slice(1,-1);
            location.href='/';
        } else {
            alert(JSON.stringify(text).slice(1,-1));
        }
    })
    event.preventDefault();//阻止默认行为
})

