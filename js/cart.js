/**
 * Created by liuli on 2017/05/03 0003.
 */


/*// -------------------------------------------------*/

//	订单详情
$('.js-orderDetail').click(function () {
    $('.orderDetail > table').toggleClass('active');
})
//支付方式
$(document).on('click','.js-payWay li',function () {
    $(this).addClass('on').siblings('li').removeClass('on');
})
//	同意协议
$('.js-agreement > span').click(function () {
    $(this).toggleClass('on');
})
