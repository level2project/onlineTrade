//先获取uid 从cookie中拿 备用
var getUid = document.cookie,
    uid = '';
for (i = getUid.indexOf('id=') + 3; i < getUid.length && (getUid[i] != ';' && getUid[i] != '&'); i++) {
    uid += getUid[i];
}

addEventListener("load", function () {
    setTimeout(hideURLbar, 0);
}, false);
function hideURLbar() {
    window.scrollTo(0, 1);
}
/**
 * ajax获取当前用户对应购物车内的信息  并用handlebarjs渲染
 */
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
    $('#good-num').html('我买到的宝贝 (' + ($('#empty').siblings().length - 1) + ')');
});


function fill(template_id, fill_id) {    //  获取指定元素template_id模板 填充数据data后 插回到到fill_id前
    var source = $("#" + template_id).html();                 //取得模板
    //console.log(source);
    var template = Handlebars.compile(source);
    arguments[2]['addtime']=arguments[2]['addtime'].substr(0,10);//这样处理时间会不会很暴力？
    var result = template(arguments[2]);           //将数据 填充到模板
    $("#" + fill_id).before(result);//整个模块显示的地方
};

/**
 * 更新右边的信息 价格清单
 */
function updateInformation() {
    var toto = 0,
        goodsHtml = ($('.cart-header'));
    //console.log(goodsHtml.length);
    for (var i = 0; i < goodsHtml.length; i++) {
        var num = Number($(goodsHtml[i]).find(".qty").children().children().html().slice(7));
        var dan = Number($(goodsHtml[i]).find(".delivery").children().html().slice(5));
        toto += num * dan;
    }
    $('.money').html(toto.toFixed(2));
}