addEventListener("load", function () {
    setTimeout(hideURLbar, 0);
}, false);
function hideURLbar() {
    window.scrollTo(0, 1);
}
$(document).ready(function () {
    $(".memenu").memenu();

//        删除单件商品
    $('.close span').on('click', function () {
        $(this).parent().fadeOut('slow', function () {
            $(this).parent().remove();
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