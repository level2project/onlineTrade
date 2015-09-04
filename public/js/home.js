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
        $('#login-before').attr('href', '#')
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
 * ajax获取商品列表 并用handlebarjs 渲染  (注意后面还要处理图片问题)
 */
var myData = null;
$.get('/verify/getGoods', function (text, status) {
    myData = JSON.parse(text);
    $.each(myData, function (i, obj) {      //对象good 遍历
        fill("good-template", "fill-good", obj);  // 参数为模板id 最终加入DOM结构ID 需添加的数据
    });
    /**
     * 处理图片 对应div>div（隐藏）已经填补了图片的地址 直接往img标签 div下个标（a标签）的第一个子标签 添加src
     */
    var temp = $('#goods>div>div');
    for (var i = 0; i < temp.length; i++) {
        if ($(temp[i]).html()) {
            //console.log($(temp[i]).html());
            $(temp[i]).next().children(1).attr('src', $(temp[i]).html());
        }
    }
    var w = $('#goods img').width();
    $('#goods img').height(w);
});
window.addEventListener('resize', function () {
    var w = $('#goods img').width();
    $('#goods img').height(w);
});
function fill(template_id, fill_id) {     //  获取指定元素id模板 填充数据data后 插回到到id前
    var source = $("#" + template_id).html();                 //取得模板
    //console.log(source);
    var template = Handlebars.compile(source);
    var result = template(arguments[2]);           //将数据 填充到模板
    $("#" + fill_id).before(result);//整个模块显示的地方
};

/**
 * 跳转到商品详细页  在对应div内有一个包含商品pid的p标签 直接通过它判断是哪件商品
 */
$('#goods').on('click','div',function(event){
    var event = event || window.event;
    event. stopPropagation();
    event.preventDefault();
    window.open('single.html?good='+$(this.childNodes[1]).html(),'_self');
});