addEventListener("load", function () {
    setTimeout(hideURLbar, 0);
}, false);
function hideURLbar() {
    window.scrollTo(0, 1);
}
$(document).ready(function () {
    $(".memenu").memenu();
});

var rest = null;
// Can also be used with $(document).ready()
$(window).load(function () {
    var flag = true;
    $('div.fixW>span').first().addClass('not-allow');
    $('div.fixW>span').last().addClass('allow');
    $('a[tabindex]').on('click', function () {
        var alreadyLogin = document.cookie;
        if (alreadyLogin.indexOf('userName=') == -1) {
            if (confirm('请先登录')) {
                window.location.href = 'login.html';
            } else {
                $('a[tabindex]').popover('hide');
            }
        } else {
            $('a[tabindex]').attr('href','#rest');
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
/**
 * ajax获取对应商品信息 并渲染
 */
$.get('/verify/goodDetail', {pid: pid}, function (text, status) {
    console.log(text);
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
        slideshowSpeed: 2500,
        mousewheel: true
    });


    //下面添加商品的额外信息  后面要考虑重构。。。（未实现。。）
    $('#rest').html('(还剩 ' + (Data.amount - Data.soldamount) + ' 件)');

    if (Data.pcstyle)
        $('#pcstyle').html(Data.pcstyle);
    if (Data.pcname)
        $('#good-type').html(Data.pcname);
    if(Data.username)
        $('#owner :eq(0)').html(Data.username);
    if(Data.email){
        $('#owner :eq(1)').html(Data.email);
    }
});

$('.review a').on('click', function () {
    $('.cd-tabs-navigation li>a').removeClass('selected');
    $('.cd-tabs-content li').removeClass('selected');
    $('#review').addClass('selected');
    console.log($('.cd-tabs-content>li:last').html());
    $('.cd-tabs-content>li:last').addClass('selected');
});


$('div.fixW>span:first').on('click', function () {
    var val = $('#pCount').val();
    if (val <= 2) {
        $('#pCount').val(1);
        $('#pCount').trigger('change');
        $('div.fixW>span').first().removeClass('allow');
        $('div.fixW>span').first().addClass('not-allow');
        $('div.fixW>span').last().removeClass('not-allow');
        $('div.fixW>span').last().addClass('allow');
        return;
    }
    val--;
    $('#pCount').val(val);
    $('#pCount').trigger('change');
});
$('div.fixW>span:last').on('click', function () {
    rest = $('#rest').text().substring(4);
    var len = rest.length - 3;
    rest = rest.substr(0, len);
    var val = $('#pCount').val();
    if (val >= +rest - 1) {
        $('#pCount').val(rest);
        $('#pCount').trigger('change');
        $('div.fixW>span').first().removeClass('not-allow');
        $('div.fixW>span').first().addClass('allow');
        $('div.fixW>span').last().removeClass('allow');
        $('div.fixW>span').last().addClass('not-allow');
        return;
    }
    val++;
    $('#pCount').val(val);
    $('#pCount').trigger('change');
});
$('#pCount').on('change', function () {
    rest = $('#rest').text().substring(4);
    var len = rest.length - 3;
    rest = rest.substr(0, len);
    var val = $('#pCount').val();
    if (val <= 1) {
        $('#pCount').val(1);
        $('div.fixW>span').first().removeClass('allow');
        $('div.fixW>span').first().addClass('not-allow');
        $('div.fixW>span').last().removeClass('not-allow');
        $('div.fixW>span').last().addClass('allow');
    } else if (val > 1 && val < +rest) {
        $('div.fixW>span').first().removeClass('not-allow');
        $('div.fixW>span').first().addClass('allow');
        $('div.fixW>span').last().removeClass('not-allow');
        $('div.fixW>span').last().addClass('allow');
    } else if (val >= +rest) {
        $('#pCount').val(rest);
        $('div.fixW>span').first().removeClass('not-allow');
        $('div.fixW>span').first().addClass('allow');
        $('div.fixW>span').last().removeClass('allow');
        $('div.fixW>span').last().addClass('not-allow');
    }
});


/**
 * ajax获取 在下面的三个 其他商品 随机抽取3个商品显示 并用handlebar渲染
 * 传递一个pid过去 确保下面三个与当前不同
 */
$.get('/verify/threeRandomGood?pid=' + pid, function (text, status) {
    var Data = JSON.parse(text);
    $.each(Data, function (i, obj) {      //对象good 遍历
        fill("good-template", "fill-before", obj);  // 参数为模板id 最终加入DOM结构ID 需添加的数据
    });
});
function fill(template_id, fill_id) {     //  获取指定元素template_id模板 填充数据data后 插回到到fill_id前
    var source = $("#" + template_id).html();                 //取得模板
    //console.log(source);
    var template = Handlebars.compile(source);
    var result = template(arguments[2]);           //将数据 填充到模板
    $("#" + fill_id).before(result);//整个模块显示的地方
};

/**
 * 添加商品到购物车事件
 */
$('#add-good').on('click', function () {
    //获取uid 从cookie中拿  pid之前获取过了全局变量 直接用
    var getUid = document.cookie,
        uid = '';
    for (i = getUid.indexOf('id=') + 3; i < getUid.length && (getUid[i] != ';' && getUid[i] != '&'); i++) {
        uid += getUid[i];
    }
    $.get('/verify/addToCar', {'pid': pid, 'amount': $('#pCount').val(), 'uid': uid}, function (text, err) {
        if (/添加成功/.test(text)) {
            //..这里能不能才跳出那个小框框呢？
        } else {
            if (/该商品已经在购物车/.test(text)) {
                alert('该商品已经在购物车了');
            }
            else {
                alert(JSON.stringify(text).slice(1, -1));
            }
        }
    });
});

