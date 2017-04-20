/******************************
** 文件描述 :  先之新头部+登录
** 时    间 ： 2014.10.08
** 作    者 ： wangweimin
** E-mail： malcolm.Wang@veryeast.cn
*******************************/
(function($) {
    var First = {
        parameter: null,

        init: function() {
            this.initSso();
            this.operate();
        },

        //数据
        initSso: function() {
            var me = this, sso = new SSO_Controller();
            sso.init({
                name:'sso',
                encoding:'utf-8',
                is_check_login_state:false,
                custom_login_state_callback: function(cookieinfo) {
                    me.loginEnter(cookieinfo);
                }
            });
            this.sso = window.sso = sso;
            sso.custom_login_state_callback(sso.cookieinfo);
        },

        //登录操作
        loginEnter: function(data) {
            var me = this,
                $wrap = $('.first-wrap'),
                $no = $wrap.find('.js-login-no'),
                $show = $wrap.find('.js-login-show'),
                htmls = '<p>您好，欢迎来到先之！<a href="http://home.9first.com/user/login?redirect='+ encodeURIComponent(window.location.href) +'">登录</a><a href="http://home.9first.com/user/register?redirect='+ encodeURIComponent(window.location.href) +'">注册</a></p>';

            if (data && (data.username)) {
                $wrap.find('.first-user').html(data.username);
                $no.hide();
                $show.show();
            } else {
                $show.hide();
                $no.html(htmls);
                $no.show();
            }
        },

        //操作
        operate: function() {
            var me = this,
                $wrap = $('.first-top'),
                $nav = $('#wrap .nav,header .nav,.header_box3'),
                $dynamic = $('.js-dynamic-show');

            $wrap.on('mouseenter', '.weibo', function() {
                if ($(this).find('.followme').html() == '') {
                    $('<iframe src="http://widget.weibo.com/relationship/followbutton.php?btn=light&style=2&uid=1851955334&width=136&height=24&language=zh_cn" width="136" height="24" frameborder="0" scrolling="no" marginheight="0"></iframe>').appendTo(".followme");
                }
                $(this).find('.followme').show();
            });

            $wrap.on('mouseleave', '.weibo', function() {
                $(this).find('.followme').hide();
            });

            $wrap.on('mouseenter', '.weixin', function() {
                $(this).find('.qr-code').show();
            });

            $wrap.on('mouseleave', '.weixin', function() {
                $(this).find('.qr-code').hide();
            });

            $wrap.on('mouseenter', '.first-list', function() {
                $(this).find('.first-ul').show();
            });

            $wrap.on('mouseleave', '.first-list', function() {
                $(this).find('.first-ul').hide();
            });

            $wrap.on('click', '.js-user-return', function() {

				$('body').css('cursor','wait');
				$('a').css('cursor','wait');
				me.sso.logout('script');
				setTimeout(function () {
					window.location.reload();
				}, 1200);
				
            });

            $('.js-tip-close')[0] && $('.js-tip-close').click(function() {
                $(this).closest('.ie-tips').remove();
            });

            $('nav').on({
                'mouseover': function(){
                    var $show = $(this).find('.list-dynamic');

                    $show.removeClass('hide');
                },
                'mouseout': function(){
                    var $show = $(this).find('.list-dynamic');

                    $show.addClass('hide');
                }
            },'.js-dynamic-show');

            $nav[0] && (function() {
                if (!ie67) {
                    var $header = $nav.closest('header'),
                    topOffset = $header.outerHeight() - $nav.outerHeight();

                    $(window).scroll(function() {
                        if ($(this).scrollTop() > topOffset) {
                            $nav.css({'position': 'fixed', 'top': '0px', 'z-index': '999', 'width': '100%'});
                        } else {
                            $nav.removeAttr('style');
                        }
                    });

                    $(window).scrollTop() > 0 && $(window).scroll();
                }
            })();
        }
    };

    First.init();
}(jQuery))