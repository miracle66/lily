/******************************
** 文件描述 :  JS Seajs Config + Common
** 时    间 ： 2014.10
** 作    者 ： wangweimin
** E-mail： malcolm.Wang@veryeast.cn
*******************************/
(function($) {

    var $config = $('#confignode'),
        base = $config.attr('base-path'),
        gallery = $config.attr('gallery-path'),
        plugins = $config.attr('plugins-path'),
        css = $config.attr('css-path'),
        version = $config.attr('version');

    var Config = {
            alias: {
                'artdialog': 'gallery/artdialog/4.1.7/jquery.artdialog.min',
                'artdialog-skin': css+'/popup.css',
                'art-template': 'gallery/art-template/2.0.3/template.min',
                'pagination': 'plugins/pagination/pagination',
                'dropdown': 'plugins/dropdown/dropdown',
                'autoemail': 'plugins/email-autocomplete.min',
                'plupload': 'plugins/plupload/plupload.full.min.js',
                'type-data': 'data/type-data',
            },
            base: base,
            paths: {
                'gallery': gallery,
                'app': base + '/app',
                'plugins': base + '/plugins',
                'data': base + '/data',
                'css': css
            },
            charset: 'utf-8',
            map: [
                ['.css', '.css?v=' + version],
                ['.js', '.js?v=' + version]
            ],
            debug: true
        };

    seajs.config(Config);

}(jQuery));

(function($, w) {

    var Common = {

        init: function() {
            this.browser();
            this.hover();
        },

        browser: function() {
            //ie6
            if(!-[1,]) {
                this.isIe = true;
                if (!window.XMLHttpRequest) {
                    $('html').addClass('ie6');
                    this.isIe6 = true;
                }
            }
        },

        createUrl: function(path, params) {
            path = path || '';
            var url = (path.indexOf('http') === 0) ? path : 'http://' + window.location.host + (path.indexOf('/') === 0 ? '' : '/') + path;
            //alert(path);/brain/detail/31
            if (params) {
                var get = $.param(params);
                if (get) url += (/\?/.test(url) ? "&" : "?") + get;
            }
            return url;
        },

        ajax: function(opts) {
            var me = this;
            var o = $.extend({}, {
                url: '',
                type: 'get',
                data: {},
                dataType: 'json',
                cache: false,
                success: function() {},
                fail: function(response) {
                    typeof(this.onFail) == 'function' && this.onFail(response);
                    me.alert(response.errMsg);
                }
            }, opts);

            $.ajax({
                url: o.url,
                type: o.type,
                data: o.data,
                dataType: o.dataType,
                cache: o.cache,
                success: function(response) {
                    if (response.status === 1) {
                        o.success(response.data);
                    } else {
                        if (response.errCode === 8001) {
                            me.alert('登录超时', function() {
                                window.location.href = window.location.href;
                            });
                            return;
                        }
                        o.fail(response);
                    }
                }
            });
        },

        substring: function (str, len, flow) {
            if ( ! str) return '';
            str = str.toString();
            var newStr = "",
                strLength = str.replace(/[^\x00-\xff]/g, "**").length,
                flow = typeof(flow) == 'undefined' ? '...' : flow;

            if (strLength <= len + (strLength % 2 == 0 ? 2 : 1)) return str;

            for (var i = 0, newLength = 0, singleChar; i < strLength; i++) {
                singleChar = str.charAt(i).toString();
                if (singleChar.match(/[^\x00-\xff]/g) != null) newLength += 2;
                else newLength++;

                if (newLength > len) break;
                newStr += singleChar;
            }

            if (strLength > len) newStr = $.trim(newStr) + flow;
            return newStr;
        },

        escape: function (content) {
            return typeof content === 'string'
                ? content.replace(/&(?![\w#]+;)|[<>"']/g, function (s) {
                    return {
                        "<": "&#60;",
                        ">": "&#62;",
                        '"': "&#34;",
                        "'": "&#39;",
                        "&": "&#38;"
                    }[s];
                })
                : content;
        },

        script: function(content) {
            return typeof content === 'string'
                ? content.replace(/&(?![\w#]+;)/g, function(s) {
                    return {
                        "<script>": "&#60;script&#62",
                        "</script>": "&#60;/script&#62"
                    }[s];
                })
                : content;
        },

        dateMap: {'Y': [0, 4], 'y': [2, 2], 'm': [5, 2], 'd': [8, 2], 'H': [11, 2], 'i': [14, 2], 's': [17, 2]},

        /*str: 2014-01-01 12:20:30*/
        date:  function(str, format) {
            if (typeof str !== 'string' || !str) return '';
            format = format || 'Y-m-d';
            var dateMap = this.dateMap;
            return format.replace(/[a-zA-Z]+/g, function(key) {
                return String.prototype.substr.apply(str, dateMap[key]);
            });
        },

        popup: function(o) {
            var opts = {
                beforeConfirm: function() {return true;},
                close: function() {
                    if (this.undoClose) return true;
                    (typeof (o.beforeClose) == 'function') && o.beforeClose();
                },
                cancelBtn: true,
                lock: true,
                ok: null,
                opacity: 0.5,
                fixed: true
            };

            $.extend(opts, o);

            if (opts.btns) {
                if (opts.cancelBtn) opts.btns += '<a class="btn-gray btn-cancel">取消</a>';
                if (opts.btnsCancel) opts.btns += opts.btnsCancel;
            }

            seajs.use(['artdialog', 'artdialog-skin'], function() {
                var art = artDialog(opts),
                    $wrap = art.DOM.content,
                    $buttons = art.DOM.buttons;

                opts.btns && $buttons.html(opts.btns).show();
                opts.btns && (opts.classes ? $buttons.addClass(' popup-btn-center') : $buttons.removeClass('popup-btn-center'));

                typeof(opts.completeCallback) == 'function' && opts.completeCallback($wrap, art);
                $buttons.find('a.btn-sure').on('click', function() {
                    art.undoClose = true;
                    if (opts.beforeConfirm($wrap, art)) {
                        art.close();
                        (typeof(opts.callback) == 'function') && opts.callback($wrap, art);
                    }
                });

                $buttons.find('a.btn-cancel').on('click', function() {
                    art.close();
                });
            });
        },

        alert: function() {
            var o = {title: '系统提示', message: '', okValue: '确&nbsp;定', beforeClose: null, width: 430};

            if (typeof(arguments[0]) == 'object') $.extend(o, arguments[0]);
            else {
                o.message = arguments[0];
                o.beforeClose = arguments[1];
            }

            o.buttons = '<a class="btn-icon2 btn-blue btn-sure">'+o.okValue+'</a>';

            var opts = {
                title: o.title,
                content: '<div class="popup-con popup-alert">'+o.message+'</div>',
                btns: o.buttons,
                width: o.width,
                cancelBtn: false,
                beforeClose: o.beforeClose,
                beforeConfirm: function () {
                    o.beforeClose && o.beforeClose.apply(this, arguments);
                    return true;
                },
                classes: true
            };

            this.popup(opts);
        },
        alertTip: function() {
            var o = {title: '系统提示', message: '',width: 430,height:120};

            if (typeof(arguments[0]) == 'object') $.extend(o, arguments[0]);
            else {
                o.message = arguments[0];
            }
            var opts = {
                title: o.title,
                content: '<div class="popup-con popup-alert">'+o.message+'</div>',
                width: o.width,
                height:o.height,
                cancelBtn: false,
                beforeClose: o.beforeClose,
                classes: true
            };
            this.popup(opts);
        },

        confirm: function() {
            var o = {title: '系统提示', message: '', okValue: '确&nbsp;定', cancelValue: '取&nbsp;消', callback: null, cancelCallback: null, width: 430};

            if (typeof(arguments[0]) == 'object') $.extend(o, arguments[0]);
            else o.message = arguments[0];

            (typeof(arguments[1]) == 'function') && (o.callback = arguments[1]);
            o.buttons || (o.buttons = '<a class="btn-icon2 btn-blue btn-sure"><i class="icon-true"></i>'+o.okValue+'</a><a class="btn-icon2 btn-gray btn-cancel"><i class="icon-false"></i>'+o.cancelValue+'</a>');

            this.popup({
                title: o.title,
                content: '<div class="popup-con popup-confirm">'+o.message+'</div>',
                btns: o.buttons,
                width: o.width,
                cancelBtn: false,
                callback: o.callback,
                beforeClose: o.cancelCallback,
                classes: true
            });
        },

        template: function(callback) {
            var me = this;
            seajs.use('art-template', function(template) {
                template.helper('substring', function() {return me.escape(me.substring.apply(me, arguments))});
                template.helper('createUrl', function(){return me.createUrl.apply(me, arguments)});
                template.helper('charCode', me.charCode);

                var dateMap = {'Y': [0, 4], 'y': [2, 2], 'm': [5, 2], 'd': [8, 2], 'H': [11, 2], 'i': [14, 2], 's': [17, 2]};
                template.helper('date', function(str, format) {
                    if (typeof str !== 'string' || !str) return '';
                    format = format || 'Y-m-d';
                    return format.replace(/[a-zA-Z]+/g, function(key) {
                        return String.prototype.substr.apply(str, dateMap[key]);
                    });
                });

                template.helper('strtotime', function(str) {
                    return Math.round(Date.parse(str) / 1000);
                });
                (typeof(callback) == 'function') && callback(template);
            });
        },

        selectAll: function($selectAll, $wrap, selector) {
            $selectAll.on('click', function() {
                var $selector = $wrap.find(selector);
                $selector.prop("checked", this.checked);
                $selectAll.prop("checked", this.checked);
            });

            $wrap.each(function() {
                var $this = $(this);
                $this.on('click', selector, function(e) {
                    $selectAll.prop('checked', $this.find(selector+':checked').length == $this.find(selector).length);
                });
            });
        },

        textareaLimit: function($textarea, $show, limit) {
            limit = limit || parseInt($show.text());
            var isIe = !-[1,];
            var limitEvent = function(event) {
                var val = $(this).val(), count = val.length;
                if (count > limit) {
                    $(this).val(val.substring(0, limit));
                    $show.text(0);
                } else $show.text(limit-count);
            };

            $textarea.on(isIe ? 'propertychange' : 'input', limitEvent);
            if (isIe && navigator.userAgent.match(/msie (\d)/i)[1] > 8) $textarea.on('keydown', function(event) {if (event.which == 8 || event.which == 46) limitEvent.apply(this, arguments);});
            limitEvent.apply($textarea[0]);
        },

        placeholder: function($input, $parent) {
            var placeholder = 'placeholder' in document.createElement('input');
            $parent = $parent || $input.offsetParent();

            ! placeholder && $input.each(function() {
                var $this =  $(this),
                    tip = $this.attr('placeholder'),
                    $placeholder;

                if (tip) {
                    $placeholder = $.data(this, 'placeholder');
                    if (!$placeholder) {
                        $placeholder = $('<span class="placeholder"></span>').appendTo($parent);
                        $placeholder.html(tip);
                        $.data(this, 'placeholder', $placeholder);
                    }

                    $placeholder.css('left', $this.offset().left - $parent.offset().left + parseInt($this.css('padding-left')));
                    $placeholder.css('top', $this.offset().top - $parent.offset().top);
                    if (this.tagName == 'INPUT') $placeholder.css('line-height', $this.height() + 'px');

                    $placeholder.toggleClass('hide', $this.val() !== '');
                    $placeholder.on('click', function() {$this.focus()});
                    $this.on('focus', function() {
                        $placeholder.toggleClass('hide', true);
                    }).on('blur', function() {
                        $placeholder.toggleClass('hide', $this.val() !== '');
                    });
                }
            });
        },

        _cache: {},

        hover: function() {
            if (this.isIe6) {
                $('body').on('mouseenter mouseleave', '.hovered', function(target) {
                    $(this).toggleClass('hover', target.type == 'mouseenter');
                });
            }
        },

    	cache: function(key, value) {
    		if (typeof(value) == 'undefined') return this._cache[key] || null;
    		else this._cache[key] = value;
    	},

    	log: function(errMsg) {
    		window.console && window.console.log(errMsg);
    	},

        serializeObject: function($form) {
            var arr = $form.serializeArray(),
                obj = {};

            $.each(arr, function(index, param){
                obj[param.name] = param.value || '';
            });
            return obj;
        },

        /** 业务部分 **/
        star: function($star) {
            var index;

            var starAjax = function($this) {
                var score = ($this.index() + 1) * 2;
                var content=$('.document-evaluate').find('.textarea').val();
            
                C.ajax({
                    url: $this.closest('.js-star').data('src'),
                    data: {rate: score,content:content},
                    success: function(response) {
                    	
                        C.alert('评分成功！');
                        $star.unbind();
                        C.refresh();
                        $this.addClass('star-on');
                        $this.prevAll('.star-off').addClass('star-on');
                    }
                });
            }

            $star.on('mouseover', '.star-off', function() {
                var $this = $(this);
                $this.addClass('star-on');
                $this.prevAll('.star-off').addClass('star-on');
                $this.nextAll('.star-off').removeClass('star-on');
            });

            $star.mouseout(function() {
                $(this).find('.star-off').removeClass('star-on');
                index = null;
            });

            $star.on('click', '.star-off', function() {
                var $this = $(this);

                L.check(function() {
                    starAjax($this);
                });
            });
        },

        time: function(t, flag) {
            if (flag == 'date') {
                return t.split(" ")[0];
            }

            var t = new Date(t * 1000),
                time,
                month = t.getMonth() + 1,
                day = t.getDate(),
                minutes = t.getMinutes(),
                seconds = t.getSeconds();

            time = t.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);

            if (flag == 'all') {
                time += ' ' + t.getHours() + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
            }

            return time;
        },

        checkId: function(id) {
            if (/^\d+$/.test(id)) {
                return id;
            }
            return false;
        },

        refresh: function() {
            $('.js-list').pagination('refresh');
        },
        score: function(n) {
            n = n.toString();
            if (n.length <= 2) {
                return n + '.0';
            } else if (n.length > 3) {
                return n.substr(0, 3);
            }
            return n;
        },

        scoreRate: function(n) {
            return Math.floor(n * 10);
        },

        tags: function($wrap) {
            $wrap.on('click', '.b-title', function() {
                $(this).removeClass('error').siblings('.tip').hide();
            });

            $wrap.on('blur', '.b-title', function() {
                var $this = $(this),
                    val = $.trim( $this.val() ),
                    arr;

                val = val.replace(/[，,\s]+/g, ',');
                arr = val.split(',');
                if (arr.length > 5) {
                    $this.addClass('error');
                    $this.siblings('.tip').show();
                } else {
                    var index = val.lastIndexOf(','),
                        len = val.length - 1;

                    if (index == len) {
                        val = val.substr(0, len);
                    }
                    $this.val(val);
                }
            });
        },

        byteToKB: function(n) {
            n = (n / 1024).toString();
            return n.substr(0, n.lastIndexOf('.') + 3);
        },
        delExtension: function(s){
            var reg = /\.\w+$/;
            return s.replace(reg,'');
        }
    };

    Common.init();

    w.C = Common;

}(jQuery, window));