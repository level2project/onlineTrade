addEventListener("load", function () {
    setTimeout(hideURLbar, 0);
}, false);
function hideURLbar() {
    window.scrollTo(0, 1);
}
$(document).ready(function () {
    $(".memenu").memenu();
});


// Can also be used with $(document).ready()
$(window).load(function () {
    var flag = true;

    $('a[tabindex]').on('click', function () {
        var alreadyLogin = document.cookie;
        if (alreadyLogin.indexOf('userName=') == -1) {
            if (confirm('请先登录')) {
                window.location.href = 'login.html';
            } else {
                $('a[tabindex]').popover('hide');
            }
        } else {
            $('a[tabindex]').popover({
                animation: true,
                delay: { "show": 200, "hide": 100 },
                html: true
            });
            if (flag) {
                $('a[tabindex]').popover('show');
                flag = false;
            }

        }
    });
});


/**
 * 从locantion中获取商品的pid
 */
var a = document.createElement('a')
a.setAttribute('href', window.location.href);
var pid = a.search.substr(6);
//console.log((a.search.substr(6)));
/**
 * 请求、渲染对应商品信息
 */
$.get('/verify/goodDetail', {pid: pid}, function (text, status) {
    //console.log(text);
    var Data = JSON.parse(text)[0];
    if (!Data) {//如果返回商品信息是空的 那么跳到404页面 这个主要是应对用户直接修改location的情况
        window.location.href = '/error.html';
        return;
    }
    if (Data.pname)
        $('#pname').html(Data.pname);
    if (Data.ptext)
        $('#ptext').html(Data.ptext);
    if (Data.price)
        $('#price').html('￥' + Data.price);
    if (Data.introduction)
        $('#introduction').html(Data.introduction);
    if (Data.picture1) {
        $('#picture1').attr('src', Data.picture1).parent().attr('data-thumb', Data.picture1);
        $('.flex-control-nav :eq(0)>img').attr('src', $('#picture1').attr('src'));
    }

    if (Data.picture2) {
        $('#picture2').attr('src', Data.picture2).parent().attr('data-thumb', Data.picture2);
        $('.flex-control-nav :eq(1)>img').attr('src', $('#picture2').attr('src'));
    }
    if (Data.picture3) {
        $('#picture3').attr('src', Data.picture3).parent().attr('data-thumb', Data.picture3);
        $('.flex-control-nav :eq(2)>img').attr('src', $('#picture3').attr('src'));
    }
    if (typeof ($('#picture2').attr('src')) == 'undefined') {
        $('#picture2').parent().remove();
    }
    if (typeof ($('#picture3').attr('src')) == 'undefined') {
        $('#picture3').parent().remove();
    }
    //图片加载完毕 开始幻灯片渲染播放
    $('.flexslider').flexslider({
        minItems: 1,
        animation: "fade",
        controlNav: "thumbnails",
        pauseOnHover: true,
        keyboard: false,
        slideshowSpeed: 25000,
        mousewheel: true
    });


    //下面添加商品的额外信息  后面要考虑重构。。。（未实现。。）
    $('#rest').html('(还剩 ' + (Data.amount - Data.soldamount) + ' 件)');

    if (Data.pcstyle)
        $('#pcstyle').html(Data.pcstyle);
    if (Data.pcname)
        $('#good-type').html(Data.pcname);

});

$('.review a').on('click', function () {
    $('.cd-tabs-navigation li>a').removeClass('selected');
    $('.cd-tabs-content li').removeClass('selected');
    $('#review').addClass('selected');
    console.log($('.cd-tabs-content>li:last').html());
    $('.cd-tabs-content>li:last').addClass('selected');
});

//在下面的三个 其他商品 随机抽取3个商品显示   传递一个pid过去 确保下面三个与当前不同
$.get('/verify/threeRandomGood?pid=' + pid, function (text, status) {
    var Data = JSON.parse(text);
    $.each(Data, function (i, obj) {      //对象good 遍历
        fill("good-template", "fill-before", obj);  // 参数为模板id 最终加入DOM结构ID 需添加的数据
    });
});
function fill(template_id, fill_id) {     //  获取指定元素id模板 填充数据data后 插回到到id前
    var source = $("#" + template_id).html();                 //取得模板
    //console.log(source);
    var template = Handlebars.compile(source);
    var result = template(arguments[2]);           //将数据 填充到模板
    $("#" + fill_id).before(result);//整个模块显示的地方
};

