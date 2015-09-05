addEventListener("load", function () {
    setTimeout(hideURLbar, 0);
}, false);
function hideURLbar() {
    window.scrollTo(0, 1);
}
$(document).ready(function () {
    $(".memenu").memenu();

//        删除单件商品
    $('#item-lists').on('click', 'div div span', function () {
        //$('.close span').on('click', function () {
        $(this).parent().fadeOut('slow', function () {
            $(this).parent().remove();
            updateInformation();
            var num = $('.cart-header').length;
            $('.check h1').html('我的购物车 (' + num + ')');
            if (!num) {
                $('.total_price span').html('0.00');
                $('.total1:even').html('0.00');
                $('.total1:odd').html('---');
                $('#empty').removeClass('hide');
            }
        });
    });
//        清空购物车
    $('.cpns').on('click', function () {
        if (confirm('waring: 您将清空购物车!')) {
            $('#item-lists :first-child~div').remove();
            $('.check h1').html('我的购物车 (0)');
            $('.total_price span').html('0.00');
            $('.total1:even').html('0.00');
            $('.total1:odd').html('---');
            $('#empty').removeClass('hide');
        }
    })
});

/**
 * ajax获取当前用户对应购物车内的信息  并用handlebarjs渲染
 */
//先获取uid 从cookie中拿
var getUid = document.cookie,
    uid = '';
for (i = getUid.indexOf('id=') + 3; i < getUid.length && getUid[i] != ';'; i++) {
    uid += getUid[i];
}
$.get('/verify/getCarItem?uid=' + uid, function (text, status) {
    myData = JSON.parse(text);
    $.each(myData, function (i, obj) {      //对象good 遍历
        fill("good-template", "fill-good", obj);  // 参数为模板id 最终加入DOM结构ID 需添加的数据
    });
    updateInformation();
    //joe add 暴力解决 开始不显示empty问题 在购物车商品渲染完后 判断其兄弟节点个数
    if ($('#empty').siblings().length === 1) {
        $('#empty').removeClass('hide');
    }
    $('#good-num').html('我的购物车 (' + ($('#empty').siblings().length - 1) + ')');
});


function fill(template_id, fill_id) {    //  获取指定元素template_id模板 填充数据data后 插回到到fill_id前
    var source = $("#" + template_id).html();                 //取得模板
    //console.log(source);
    var template = Handlebars.compile(source);
    var result = template(arguments[2]);           //将数据 填充到模板
    $("#" + fill_id).before(result);//整个模块显示的地方
};

/**
 * 更新右边的信息 价格清单
 */
function updateInformation() {
    var toto = 0,
        goodsHtml = ($('.cart-header'));
    for (var i = 0; i < goodsHtml.length; i++) {
        var num = Number($(goodsHtml[i]).find(".qty").children().children().html().slice(7));
        var dan = Number($(goodsHtml[i]).find(".delivery").children().html().slice(5));
        toto += num * dan;
    }
    $('.money').html(toto.toFixed(2));
}