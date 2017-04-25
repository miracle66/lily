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


// 课程首页 顶部分类点击样式
$('.js-top > a').click(function(){
	$(this).addClass('active').siblings().removeClass('active');
})
// 公共顶部筛选 点击添加样式
$(document).on('click','.js-select > .single > span',function () {
	$(this).addClass('active').siblings().removeClass('active');
})


  // 课程首页
  //设置 综合排序 一栏 第一个tab左边框无线
  $('.js-tabClick a:first').css({'border-left':'none'});
  $('.js-tabClick a.fr').css({'border-right':'none'});

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

	// 简介 笔记 评价 样式切换
	$('.js-tabs > a').click(function () {
		$(this).find('span').addClass('active');
		$(this).siblings('a').children().removeClass('active');
	})




// 个人中心 - 我的精品课 -  笔记切换 js
$(document).on('click','.notes-single .js-collapse',function () {
	$(this).siblings('.notes').toggleClass('show');
	$(this).parents().siblings('.notes-single').children('.notes').removeClass('show');
})

// 个人中心 - 我的课程包 -  笔记切换 js
var $num = $('.note-detail').find('.package-desc');
$num.each(function (i,k) {
	$(k).find('.toggle:last').css({'border-bottom':'none'});
})


$('.package-desc .toggle:last').css({'border-bottom':"none"});
$(document).on('click','.toggle .js-title',function () {
	$(this).parents().siblings('.contents').toggleClass('show');
	$(this).parents().siblings('.toggle').children('.contents').removeClass('show');
})