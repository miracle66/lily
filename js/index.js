/**
 * Created by liuli on 2017/05/04 0004.
 */

var intDiff = parseInt(259200);//倒计时总秒数量
function timer(intDiff){
    window.setInterval(function(){
        var day=0,
            hour=0,
            minute=0,
            second=0;//时间默认值
        if(intDiff > 0){
//                day = Math.floor(intDiff / (60 * 60 * 24));
            hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
            minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        }else{
            window.location.href = 'index.html';
        }
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
//            $('#day_show').html(day+"天");
        $('#hour_show').html(hour);
        $('#minute_show').html(minute);
        $('#second_show').html(second);
        intDiff--;
    }, 1000);
}
$(function(){
    timer(intDiff);
    console.log(intDiff);
    // 读取 cookie );
});
$('.timer').on('click',function () {
    console.log(intDiff);
})


$(function(){
    $('#Marquee_x').jcMarquee({ 'marquee':'x','margin_right':'10px','speed':20 });
    //获取轮播图个数 多于一个 轮播
    var $itemSize = $('.header-banner .carousel-inner .item').length;
    if($itemSize == 1){
        $('.carousel-indicators').hide();
    }else{
        $('#bannerCarousel').attr('data-ride','carousel');
    }
    // DIVCSS5提示：10px代表间距，第二个20代表滚动速度
});