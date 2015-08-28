addEventListener("load", function () {
    setTimeout(hideURLbar, 0);
}, false);
function hideURLbar() {
    window.scrollTo(0, 1);
}

$(document).ready(function () {
    $(".memenu").memenu();
    $("#toTop").hide();
});

window.addEventListener('scroll', function () {
    var scrollTop = $(document).scrollTop();
    var scrollHeight = $(document).height();
    //console.log('H: '+scrollHeight*0.3 +';T: '+scrollTop);
    if (scrollTop >= scrollHeight * 0.3) {
        $('#toTop').show();
    } else {
        $('#toTop').hide();
    }
});
$('#toTop').on('click', function () {
    scroll(0, 0);
})
$('#serverList').on('click', function () {
    location.href = '#serverList';
    $(document).scrollTop($(document).scrollTop() - 50);
})

//如果已经登录过了
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
$('#log-out').on('click', function () {
    //删除cookie
    var date = new Date();
    date.setTime(date.getTime() - 10);
    document.cookie = 'userName=abc;expires=' + date.toGMTString();
})