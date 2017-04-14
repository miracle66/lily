// created by lily on 2017.04.12

//IE兼容placeholder
if( !('placeholder' in document.createElement('input')) ){
	$('input[placeholder],textarea[placeholder]').each(function(){
		var that = $(this),
		text= that.attr('placeholder');
		if(that.val()===""){
			that.val(text).addClass('placeholder');
		}
		that.focus(function(){
			if(that.val()===text){
				that.val("").removeClass('placeholder');
			}
		})
		.blur(function(){
			if(that.val()===""){
				that.val(text).addClass('placeholder');
			}
		})
		.closest('form').submit(function(){
			if(that.val() === text){
				that.val('');
			}
		});
	});
}


  // 课程首页
  //设置 综合排序 一栏 第一个tab左边框无线
  $('.js-tabClick a:first').css({'border-left':'none'});

	// 排序筛选 js
	$('.js-tabClick a').on('click',function(){
		$('.js-tabClick a:first').css({'border-left':'none'});
		var hasClas = $(this).hasClass('bgs');
		console.log(hasClas);
		if(hasClas){
			$(this).removeClass('bgs');
			return false;
		}else{
			$(this).addClass('bgs').siblings('a').removeClass('bgs');
			return false;
		}
	})

	
	/*// 单门课程 评论区 最后一个无底边框*/
	$('.course-right-bot .assess:last').css({'border-bottom':'none'});

	// 关注
	$('.js-follow').click(function(){
		$(this).toggleClass('follows');
	})