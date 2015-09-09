addEventListener("load", function () {
    setTimeout(hideURLbar, 0);
}, false);
function hideURLbar() {
    window.scrollTo(0, 1);
}


//先获取uid 从cookie中拿 备用
var getUid = document.cookie,
    uid = '';
for (i = getUid.indexOf('id=') + 3; i < getUid.length && (getUid[i] != ';' && getUid[i] != '&'); i++) {
    uid += getUid[i];
}
/**
 * ajax获取当前用户购买的商品 并用handlebarjs渲染
 */
$.get('/verify/getOrderItem?uid=' + uid, function (text, status) {
    var myData = JSON.parse(text);
    $.each(myData, function (i, obj) {      //对象good 遍历
        fill("good-template", "fill-good", obj);  // 参数为模板id 最终加入DOM结构ID 需添加的数据
    });
    //joe add 暴力解决 开始不显示empty问题 在购物车商品渲染完后 判断其兄弟节点个数
    if ($('#empty').siblings().length === 1) {
        $('#empty').removeClass('hide');
    }
    $('#good-num').html('我的宝贝 (' + ($('#empty').siblings().length - 1) + ')');
});

function fill(template_id, fill_id) {    //  获取指定元素template_id模板 填充数据data后 插回到到fill_id前
    var source = $("#" + template_id).html();                 //取得模板
    //console.log(source);
    var template = Handlebars.compile(source);
    arguments[2]['stime']=arguments[2]['stime'].substr(0,10);//这样处理时间会不会很暴力？
    var result = template(arguments[2]);           //将数据 填充到模板
    $("#" + fill_id).before(result);//整个模块显示的地方
};
