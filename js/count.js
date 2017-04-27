/*by lily*/

/**
 *计算当前输入的字符数，并返回字符数
 * @param Str 当前已输入的字符数
 * @returns
 */

// 个人设置 - 基本信息 计算还可以输入的字数
$(' #doc ').keyup(function() {
    //输入字符后键盘up时触发事件
    var txtLeng = $(' #doc ').val().length; //把输入字符的长度赋给txtLeng
    //拿输入的值做判断
    if (txtLeng > 300) {
        //输入长度大于300时span显示0
        $(' #count ').text(' 0 ');
        //截取输入内容的前300个字符，赋给fontsize
        var fontsize = $('#doc').val().substring(0, 300);
        //显示到textarea上
        $(' #doc ').val(fontsize);
    } else {
        //输入长度小于300时span显示300减去长度
        $('#count').text(300 - txtLeng);
    }
});

// 个人设置 -账户信息 绑定手机号
$('.js-bindPhone').click(function () {
    $('.cover').show();
    $('.bindPhone').show();
})

// 个人设置 - 绑定手机号 前端验证
$.idcode.setCode();   //加载生成验证码方法
$(".js-save").click(function(){
    var phone = $('#phone').val();
    var Txtidcode = $('#Txtidcode').val();
    console.log(phone)
    if(phone == '' || Txtidcode == ''){
        console.log('请完整填写信息');
    }else{
        var IsBy = $.idcode.validateCode();  //调用返回值，返回值结果为true或者false
        console.log(IsBy)
        if(IsBy){
            console.log('验证码输入正确');
            $('.bindSuccess').show();
            $('.bindPhone').hide();

            var wait = $(".second").html();
            console.log(wait)
            timeOut();
            /**
             * 实现倒计时
             */
            function timeOut() {
                if(wait != 0) {
                    setTimeout(function() {
                        $('.second').text(--wait);
                        timeOut();

                    }, 1000);
                }
                if(wait == 0){
                    $('.bindSuccess').hide();
                    $('.cover').hide();
                }
            }
        }else {
            console.log('验证码输入错误');
        }
    }
})

// 个人设置 - 账户信息 实名认证
$(".js-authen").click(function () {
    $('.cover').show();
    $('.nameAuthen').show();
})

// 认证 开始
$('.js-authenBtn').click(function () {
    $('.step2').addClass('active').siblings().removeClass('active');
    setTimeout(function(){
        $('.step3').addClass('active').siblings().removeClass('active');
    },3000)
})


// 关闭弹层
$('.js-close').click(function () {
    $(this).parents('.js-close-box').hide();
    $('.cover').hide();
})