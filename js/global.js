/******************************
** 文件描述 :  先之智库3.0 全局
** 时    间 ： 2017.04
** 作    者 ： lily
** E-mail： Lily.liu@veryeast.com
*******************************/
(function($) {
    var Global = {

        init: function() {
            this.operate();
        },

        operate: function() {
            var me = this,
                $ietip = $('.ie-tips'),
                $sidebar = $('.f-sidebar'),
                $nums = $('.papers-nums'),
                nums;

            $ietip && $ietip.on('click', '.js-tip-close', function() {
                $ietip.remove();
            });

            //导航
          /*  $('.nav').on('click', '.my-papers a', function(event) {
                var $this = $(this);
                L.check(function() {
                    window.location.href = $this.attr('href');
                });
            });*/

            //发布资料求助
            $('.js-send-help').click(function() {
                var $this = $(this);
                L.check(function() {
                    window.location.href = $this.data('href');
                });
            });

            //访问他人信息
            $('.js-to-others').click(function() {
                var $this = $(this);
                L.check(function() {
                    //window.location.href = $this.data('href');
					window.open($this.data('href'));
                });
            });			
			
            //创建智囊
            $('.js-add-brain').click(function() {
                var $this = $(this);
                L.check(function() {
					window.location.href = $this.data('href');
                });
            });				
			
            //回到顶部
            $sidebar.on('click', '.btn-top', function() {
                $('body,html').animate({scrollTop:0},1000);
            });

            //文档数数字动画
            $nums[0] && $nums.find('.num').each(function() {
                nums = $(this).data('num') * 30;
                if(navigator.userAgent.indexOf("Firefox")!=-1)
                    $(this).css('backgroundPosition','0px '+'-'+ nums +'px');//火狐浏览器不支持backgroundPositionX和backgroundPositionY
                $(this).animate({'backgroundPositionX': '0px', 'backgroundPositionY': '-'+ nums +'px'}, 1500);
            });

            //顶部搜索
            var $form = $('.search-top');

            $form.on('click', '.js-search-top', function() {
                var v=$(this).prev('.search-input').val().replace(/[~'!<>@#$%^&*?()-+_=:]/g, "");
                if(v){
                	 window.location.href ='/search/document?keyword=' + v;
                }
               
            });

            $form.on('keydown', '.search-input', function(e) {
                if (e.keyCode == 13) {
                    $form.find('.js-search-top').trigger('click');
                }
            });
        }
    };

    Global.init();
}(jQuery))