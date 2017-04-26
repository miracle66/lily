/**
 *计算当前输入的字符数，并返回字符数
 * @param Str 当前已输入的字符数
 * @returns
 */

$(function() {
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
}); 