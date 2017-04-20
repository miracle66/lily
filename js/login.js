/******************************
** 文件描述 :  先之2.0 登录/注册 login/reg
** 时    间 ： 2015.01.15
** 作    者 ： wangweimin
** E-mail： malcolm.Wang@veryeast.com
*******************************/
(function($, w) {
    var Login = {

        init: function() {
            this.tab();
            this.operate();
            this.initSso();
        },

        tab: function() {
            var me = this,
                $wrap = $('.login-bar'),
                $tabhead = $wrap.find('.tabhead'),
                $tabcon = $wrap.find('.login-wrap .login-con');

            $tabhead.on('click', 'a', function() {
                var $this = $(this);

                $this.addClass('cur').siblings().removeClass('cur');
                $tabcon.eq($this.index()).show().siblings().hide();

                if ($this.index()) {
                    me.regEnter();
                } else {
                    me.loginEnter();
                }
            });
        },
    
        operate: function() {
            var me = this,
                $wrap = $('.login-bar'),
                $bg = $('.fbg'),
                $ietip = $('.ie-tips');

            $bg.css({height: $(document).height() + 'px'});
	       	 $('.first-wrap').on('click', '.js-user-return', function() {
	             me.sso.logout('script');
	             //alert(5)才能退出cookie
	             me.initSso();
	          });
            $wrap.on('click', '.close', function() {
                $('.fbg').hide();
                $wrap.hide();
            });

            $ietip.on('click', '.js-tip-close', function() {
                $ietip.remove();
            });
        },

        //数据
        initSso: function() {
            var me = this, sso = new SSO_Controller();
            sso.init({
                name:'sso',
                encoding:'utf-8',
                is_check_login_state:false,
                custom_login_state_callback: function(cookieinfo) {
                    var _GET = sso.get_GET();
                    if(cookieinfo){
                        window.location.href = window.location.href;
                    }
                }
            });
            this.sso = window.sso = sso;
        },

        loginShow: function(cookieinfo) {
            var $bar = $('.js-login-show');
            if (cookieinfo) {
                $bar.find('.first-user').text(cookieinfo.username);
                $bar.show().prev('.js-login-no').hide();
            }
        },

        loginEnter: function(callback) {
            var me = this,
                $wrap = $('.login-bar'),
                $bg = $('.fbg'),
                $form = $('.login-form'),
                $user = $form.find('.user'),
                $pwd = $form.find('.pwd');

            var initLogin = function() {
                me.init();
                $wrap.show();
                $bg.show();
                $form.find('.user,.pwd').removeClass('error');
                $('.tips').hide();
            }

            initLogin();

            $form.on('click', '.user,.pwd', function() {
                $(this).removeClass('error');
            }).on('blur', '.user,.pwd', function() {
                var $this = $(this);;

                if ($this.val() == '') {
                    $this.addClass('error');

                    if ($this.hasClass('user')) {
                        me.tips('用户名不能为空！');
                    } else {
                        me.tips('密码不能为空！');
                    }
                } else {
                    me.tips('');
                }
            });

            $form.on('keydown', '.user', function(e) {
                if (e.keyCode == 13) {
                    $pwd.eq(0).focus();
                }
            });

            $form.on('keydown', '.pwd', function(e) {
                if (e.keyCode == 13) {
                    $form.find('.btn-login').trigger('click');
                }
            });

            $form.on('click', '.checkbox', function() {
                $(this).attr({ 'checked': this.checked });
            });

            $form.on('click', '.btn-login', function() {
                var $this = $(this),
                    user = $form.find('.user').val(),
                    pwd = $form.find('.pwd').val();

                if ($this.hasClass('disabled')) return;

                $form.find('.user,.pwd').trigger('blur');

                if ($form.find('.error').length > 0) {
                    return;
                }
                $this.addClass('disabled');

                var obj = {};

                if ($('.checkbox:visible:checked').length > 0) {
                    obj = {'username': user, 'password': pwd, 'store_login_time': 7, 'is_store_login': 1};
                } else {
                    obj = {'username': user, 'password': pwd};
                }

                me.sso.login(obj, function(data){
                    $this.removeClass('disabled');
                    if( data.flag == 0 ){
                        if (callback) {
                            me.loginShow(data);
                            callback();
                        } else {
                            me.sso.login_state_callback(data);
                        }
                        $wrap.hide();
                        $bg.hide();
                    }else{
                        me.tips($VE_MSG[data.flag]);
                    }
                },'script');
            });
        },

        regEnter: function(callback) {
            var me = this,
                $wrap = $('.login-bar'),
                $bg = $('.fbg'),
                $form = $('.reg-form'),
                $user = $form.find('.user'),
                $email = $form.find('.email'),
                $pwd = $form.find('.pwd');

            var initReg = function() {
                me.init();
                $wrap.show();
                $bg.show();
                $form.find('.user,.pwd,.email').removeClass('error');
                $('.tips').hide();
            }

            initReg();

            $form.on('click', '.user,.pwd,.email', function() {
                $(this).removeClass('error');
            })

            $form.on('blur', '.user', function() {
                var $this = $(this);
                if ( ! /^\w{3,15}$/.test($this.val()) ) {
                    me.tips('3-15个字符，由字母、数字、下划线组成！');
                    $this.addClass('error');
                }
            });

            $form.on('blur', '.pwd', function() {
                var $this = $(this);
                if ( ! /^\w{6,16}$/.test($this.val()) ) {
                    me.tips('6-16个字符，字母区分大小写！');
                    $this.addClass('error');
                }
            });

            if ($email[0]) {
                seajs.use('autoemail', function() {
                    $email.autoemail({limit:7});
                });
                $email.blur(function() {
                    if ( ! /^\w([\.\-\w])*@[a-zA-Z0-9]([\.\w])*$/.test($(this).val()) ) {
                        me.tips('请输入正确的邮箱！');
                        $(this).addClass('error');
                        return;
                    }
                });
            }

            $form.on('keydown', '.user', function(e) {
                if (e.keyCode == 13) {
                    $email.eq(0).focus();
                }
            });

            $form.on('keydown', '.email', function(e) {
                if (e.keyCode == 13) {
                    $pwd.eq(0).focus();
                }
            });

            $form.on('keydown', '.pwd', function(e) {
                if (e.keyCode == 13) {
                    $form.find('.btn-reg').trigger('click');
                }
            });

            $form.on('click', '.btn-reg', function() {
                var $this = $(this);

                if ($this.hasClass('disabled')) return;

                $form.find('.user,.pwd,.email').trigger('blur');

                if ( $form.find('.error').length > 0 ) {
                    return;
                }

                $this.addClass('disabled');

                var obj = {};
                obj = {'username': $form.find('.user').val(), 'password': $form.find('.pwd').val(), 'email': $form.find('.email').val(), 'user_type': 2};
                me.sso.register(obj, function(data){
                    $this.removeClass('disabled');
                    if( data.flag == 0 ){
                        if (callback) {
                            me.loginShow(data);
                            callback();
                        } else {
                            me.sso.login_state_callback(data);
                        }
                        $wrap.hide();
                        $bg.hide();
                    } else {
                        me.tips($VE_MSG[data.flag]);
                    }
                });
            });
        },

        tips: function(msg) {
            var $form = $('.login-con:visible'),
                $tips = $form.find('.tips');

            if (msg == '') {
                return $tips.fadeOut(1000);
            }

            $form.find('.text').val('');

            /*$tips.html(msg).fadeIn(1000, function() {
                $tips.fadeOut(1000);
            });*/
            $tips.html(msg).fadeIn(100);
        },
        check: function(callback) {
            if ( !this.cookieRead('username') ) {
            	 htmls = 'http://home.9first.com/user/login?redirect='+encodeURIComponent(window.location.href);
            	this.alert('登陆',htmls,'确定')
            } else {
                callback();
            }
        },
        alert:function(title,tmp,btn) {
            var me = this;
            C.popup({
                title: "系统提示",
                content: template.render('Login-template', {list: tmp}),
                btns: '<a class="btn-blue btn-sure">'+btn+'</a>',
                cancelBtn: true,
                completeCallback: function($div, art) {
                    $div.on('click', '.create-brain', function(type) {
                        art.close();
                    });
                    $('.create-favorite').hide(); 
                },
                beforeConfirm: function($div, art) {
                	 window.location ='http://home.9first.com/user/login?redirect='+encodeURIComponent(window.location.href);
              		  $('.read-money').hide(); 
              	  //C.alert('1');            	  
              	  //window.location.href = "http://www.baidu.com";
                    art.close();
                }
            });
       },
        cookieRead: function(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
    };

    Login.init();
    w.L = Login;
}(jQuery, window))