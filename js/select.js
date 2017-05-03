/**
 * Created by liuli on 2017/05/03 0003.
 */

// 购物车 选框选择事件
var obox = document.getElementById ("selectAll");
var odiv = document.getElementById ("paneAll");
var ach = odiv.getElementsByTagName ("input");
//		console.log(obox)
//		console.log(odiv)
//		console.log(ach)
obox.onclick = function ()
{
    for ( var i = 0; i < ach.length; i++)
    {
//				console.log(ach[i].checked);
        ach[i].checked = this.checked;
//				console.log(this.checked)
        if(this.checked == false){
            $(ach[i]).parent('.chk-style').removeClass('on');
            $('#selectAll').parent('.chk-style').removeClass('on');
            $('.allSum .deleteSelect').hide();
            $('.allSum').find('.f-pa').removeClass('chekout')
        }
        if(this.checked == true){
            $(ach[i]).parent('.chk-style').addClass('on');
            $('#selectAll').parent('.chk-style').addClass('on');
            $('.allSum .deleteSelect').show();
            $('.allSum').find('.f-pa').addClass('chekout')
        }

    }
};

for ( var i = 0; i < ach.length; i++)
{
    ach[i].onclick = function (e)
    {
//				console.log($(this).attr('id'));
//				console.log(!this);
        $(this).parent('.chk-style').addClass('on');
        $('.allSum .deleteSelect').hide();
        if ( !this.checked )
        {
//					console.log(this);
            obox.checked = false;
            $(this).parent('.chk-style').removeClass('on');
            $('.allSum .deleteSelect').hide();
        }

        var flag = true;
        for ( var i = 0; i < ach.length; i++)
        {
            console.log(!ach[i].checked)
            if (!ach[i].checked)
            {
                flag = false;
                $('#selectAll').parent('.chk-style').removeClass('on');
                $('.allSum .deleteSelect').show();
                $('.allSum').find('.f-pa').addClass('chekout')
                break;
            }
        }
        if (flag)
        {
            obox.checked = true;
            $('#selectAll').parent('.chk-style').addClass('on');
            $('.allSum .deleteSelect').show();
            $('.allSum').find('.f-pa').addClass('chekout')
        }
    };
}