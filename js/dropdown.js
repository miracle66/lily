/**
 *  @author wuhaidong
 *
 *  @date  2013/11/26
 *  @edit  2015/01/12
 *
 *  @desc  dropdown
 *
 */

define(function(require) {

	var initialized = false;

	var DROP_NAME = 'dropdown';

	var dropdownBind = function() {

		$('body').on('click', function(e) {
            var tag = $(e.target);
            if( ! tag.hasClass('dropdown') && !tag.parent().hasClass('dropdown')) {
                $('div.dropdown-focus').removeClass('dropdown-focus');
            }
        });

        $('body').on('click', '.drop-btn', function() {
            if(!$(this).parent().hasClass('dropdown-focus')) {
            	if ($(this).hasClass('disabled')) return false;
                $('.dropdown-focus').removeClass('dropdown-focus');
            }
            $(this).parent().toggleClass('dropdown-focus');
        });
	};

    var Dropdown = {

        opts: {
            width: null,
            height: null,
            show: 10,
            overflowScroll : true,
            onChange: null,
            data: null,
            filterValue: function(val) { return val; },
            showValue: function(val) { return val.replace(/^[　]+/gm, ''); },
            disable: false
        },

        _attachDropdown: function(target, options) {
        	var opts = this._newOpts(target, options);

        	if ($.data(target, DROP_NAME)) return;
        	$.data(target, DROP_NAME, opts);
        	this.initDrop(target);

        	opts.disable && this._disableDropdown(target);
        },

        _newOpts: function(target, options) {
        	var opts = $.extend({}, this.opts, options);
        	if (typeof(opts.input) == 'undefined') opts.input = $(target).find('input');
        	(!opts.data) && (opts.data = this.parseData($(target).attr('data')));
        	$(target).attr('data', '');

        	return opts;
        },

        _getOpts: function(target) {
        	return $.data(target, DROP_NAME);
        },

        initDrop: function(target) {
            this.createDrop(target);
            this.dropEvents(target);
            this.initValue(target, false);
        },

        createDrop: function(target) {
            var me = this,
            	$e = $(target),
            	opts = this._getOpts(target), $ul;

            $e.addClass('dropdown-focus');

            ( ! $e.find('.drop-btn')[0]) && $e.append('<div class="drop-btn"></div>');

            $ul = $e.find('.drop-list');
            if ($ul[0]) $ul.html('');
            else $ul = $('<ul class="drop-list" ></ul>').appendTo($e);

            $.each(opts.data, function(key, value) {
            	me.appendLi(opts, $ul, value);
            });

            $e.addClass('dropdown');
            this.initPosition(target);
            $e.removeClass('dropdown-focus');
        },

        appendLi: function(opts, $ul, data) {
        	var key = data[0],
        		txt = opts.filterValue(data[1]);

        	$('<li id="dp_'+key+'" code="'+key+'" ></li>').appendTo($ul).text(txt);
        },

        parseData: function(data) {
        	try{ return $.parseJSON(data);}
        	catch(err){ return [];}
        },

        initValue: function(target, trigger) {
        	var $e = $(target),
        		val = this._valueDropdown(target),
        		li = $e.find('li[id="dp_'+val+'"]'),
        		trigger = (typeof(trigger) == 'undefined') ? true : false,
        		opts = this._getOpts(target);

        	if ( ! li[0]) li = $e.find('li').first();

        	if (trigger) {
        		li.trigger('click');
        	} else {
        		li.addClass('current');
        		opts.input.val(li.attr('code'));
                if (opts.showValue(li.text()) == '选择职能' || opts.showValue(li.text()) == '选择类别') {
                    $e.find('.drop-btn').text(opts.showValue(li.text())).addClass('gray');
                } else {
                    $e.find('.drop-btn').text(opts.showValue(li.text()));
                }
        	}

        	$e.removeClass('dropdown-focus');
        },

        initPosition: function(target) {
        	var $e = $(target),
        		opts = this._getOpts(target),
        		$ul = $e.find('.drop-list'),
        		btn = $e.find('.drop-btn'), w , h;

        	if ( ! opts.width) {
                if (opts.f != 'ability') {
                    var outer = $e.outerWidth();
                    opts.width = outer ? (outer - 2) : (btn.outerWidth() - 2);
                    btn.width(opts.width - (btn.outerWidth() - btn.width()) + 2);
                }
        	}

            w = opts.width;
            h = opts.height || (btn.height()+1);

            if (opts.f != 'ability') {
                $ul.css({width: w, top: h});
            }

            if (opts.show && ($ul.find('li').length > opts.show))
            	$e.addClass('scrolldrop');
            else
            	$e.removeClass('scrolldrop');
        },

        dropEvents: function(target) {
            var me = this,
            	$e = $(target),
            	opts = this._getOpts(target);

            $e.find('ul').on('click', 'li', function() {
                var $this = $(this);
                if(!$this.hasClass('current')) {
                	opts.input.val($this.attr('code'));
                    if (opts.showValue($this.text()) == '选择职能' || opts.showValue($this.text()) == '选择类别') {
                        $e.find('.drop-btn').text(opts.showValue($this.text())).addClass('gray');
                    } else {
                        $e.find('.drop-btn').text(opts.showValue($this.text())).removeClass('gray');
                    }

                    $e.find('.current').removeClass('current');
                    $this.addClass('current');

                    (typeof(opts.onChange) == 'function') && opts.onChange({
                        parent: $e,
                        obj: $this,
                        val: $this.attr('code'),
                        text: $this.text()
                    });
                }

                $e.find('div.drop-btn').click();
            });

            if($('html').hasClass('ie6')) {
            	$e.find('ul').on('mouseenter mouseleave', 'li', function() {
            		$(this).toggleClass('hover');
            	});
            }
        },

        _disableDropdown: function(target) {
        	$(target).find('.drop-btn').addClass('disabled');
        	$(target).removeClass('dropdown-focus');
        },

        _enableDropdown: function(target) {
        	$(target).find('.drop-btn').removeClass('disabled');
        },

        _valueDropdown: function(target, val, trigger) {
        	var $e = $(target),
        		opts = this._getOpts(target),
        		trigger = (typeof(trigger) == 'undefined') ? true : false,
        		value;

        	if (typeof (val) == 'undefined') return opts.input.val();

        	if (trigger) {
        		$e.find('li[code='+val+']').trigger('click');
            	$e.removeClass('dropdown-focus');
        	} else {
        		value = opts.input.val();
        		if (value != val) {
        			$e.find('.current').removeClass('current');
        			var text = $e.find('li[code='+val+']').addClass('current').html();
        			opts.input.val(val);
        			$e.find('.drop-btn').text(opts.showValue(text));
        		}
        	}
        },

        _refreshDropdown: function(target, data) {
        	var me = this,
	        	$e = $(target),
	        	opts = this._getOpts(target);

        	if (typeof(data) != 'undefined') opts.data = data;
        	else opts.data = this.parseData($e.attr('data'));
        	$e.attr('data', '');

        	me.createDrop(target);
        	me.initValue(target, false);
        },

        _appendDropdown: function(target) {
        	var data = typeof (arguments[1]) != 'object' ? ([arguments[1], arguments[2]]) : arguments[1],
        		opts = this._getOpts(target),
        		me = this;

        	var datas = (typeof (data[0]) != 'object') ? [data] : data;
        	$.each(datas, function(k, v) {
        		me.appendLi(opts, $(target).find('ul.drop-list'), v);
        	});
        },

        _deleteDropdown: function(target, key) {
        	var keys = (typeof (key) == 'string') ? [key] : key;
        	$.each(keys, function(k, v) {
        		$(target).find('ul.drop-list').find('li[id=dp_'+v+']').remove();
        	})

        	this.initValue(target);
        },

        _editDropdown: function(target, key, value) {
        	var data = typeof (arguments[1]) == 'string' ? ([arguments[1], arguments[2]]) : arguments[1],
            		opts = this._getOpts(target);

        	var datas = (typeof (data[0]) == 'string') ? [data] : data;

        	$.each(datas, function(k, v) {
        		$(target).find('ul.drop-list').find('li[id=dp_'+v[0]+']').html(opts.filterValue(v[1]));
        	});

        	this.initValue(target);
        },

        _triggerDropdown: function(target) {
        	var $e = $(target),
	    		opts = this._getOpts(target);

    		$e.find('.current').removeClass('current').trigger('click');
        	$e.removeClass('dropdown-focus');
        }

    };

	$.fn.dropdown = function(options) {
		if ( ! this.length) return this;

		if ( ! initialized) {

			dropdownBind();
			initialized = true;
		}

		var otherArgs = Array.prototype.slice.call(arguments, 1);

		return this.each(function() {
			typeof options === "string" ?
				Dropdown["_" + options + "Dropdown"].apply(Dropdown, [this].concat(otherArgs)) :
				Dropdown._attachDropdown(this, options);

			return this;
		});

	};

});