/******************************
** 文件描述 :  先之智库3.0 文档/智囊 搜索
** 时    间 ： 2015.01.10
** 作    者 ： wangweimin
** E-mail： malcolm.Wang@veryeast.com
*******************************/
define(function(require) {
	//var ROOTT='http://me.9first.com';
	var Search = {

		init: function() {
            var me = this;
            me.CATEGORY_ID = 0;
            me.SUB_CATEGORY_ID = 0;
            this.hover();
            me.pagination();	//生成分页页码	
            //require.async(['art-template', 'pagination'], function() {
                me.tab();
                me.drop();
                me.searchs();
                me.goSearch();
           // });
		},

        hover: function() {
            $('.tablist .item').on('mouseover', function() {
                $(this).addClass('cur');
            }).on('mouseout', function() {
                $(this).removeClass('cur');
            });
        },

        tab: function() {
            var me = this,
                $tab = $('.tab'),
                $tabhead = $tab.find('.tabhead'),
                $tabbox = $tab.find('.tabbody .tablist'),
                $sort = $tab.find('.sort'),
                $rightTab = $('.right-tab');

            $tabhead.on('click', 'a', function() {
                var $this = $(this);

                $this.addClass('cur').siblings().removeClass('cur');
                $sort.eq($this.index()).show().siblings('.sort').hide();
                $tabbox.eq($this.index()).show().siblings().hide();
                me.sort();
            });

            $rightTab.on('click', '.right-tabhead a', function() {
            
                var $this = $(this),
                    $rightTabbox = $this.closest('.right-tab').find('.right-tabbox');

                $this.addClass('cur').siblings().removeClass('cur');
                $rightTabbox.eq($this.index()).show().siblings().hide();
            });
			if(window.location.pathname.indexOf('brain')>0){
				var $tabbrain	=	$tabhead.find('a').eq(1);
				$tabbrain.addClass('cur').siblings().removeClass('cur');
				$sort.eq($tabbrain.index()).show().siblings('.sort').hide();
				$tabbox.eq($tabbrain.index()).show().siblings().hide();
                me.sort();
			}
        },

        drop: function() {
            var me = this,
                $drop = $('.drop-ext');

            $drop[0] && require.async('dropdown', function() {
                $('.drop-ext').dropdown({
                    onChange: function(o) {
                        me.submitForm();
						$('.document-form').submit();
                    }
                });
            });
        },

        sort: function() {
            $('.sort:visible').find('.sort-a .cur').trigger('click');
        },

        goSearch: function() {
            var me = this,
                url = window.location.search,
                url = url.substr(1, url.length),
                category_id, sub_id, key,
                val = 0;

            if (/^\w[\w\=\&]+$/.test(url)) {

                category_id = url.indexOf("category_id=");
                if (category_id != -1) {
                    val = parseInt(url.split("=")[1]) ? parseInt(url.split("=")[1]) : 0;
                    $('.js-level').val(val);
                    $('.search-ability').find('li a[data-id="'+val+'"]').trigger('click');
                    return me.submitForm();
                }

                sub_id = url.indexOf("sub_id=");
                if (sub_id != -1) {
                    val = parseInt(url.split("=")[1]) ? parseInt(url.split("=")[1]) : 0;
                    $('.js-sub').val(val);
                    $('.search-type').find('li a[data-id="'+val+'"]').trigger('click');
                    return me.submitForm();
                }
            }

            key = url.indexOf('key=');
            if (key != -1) {
                val = url.split("=")[1];
                $('.key-input').val(decodeURIComponent(val));
                return me.submitForm();
            }
        },

        searchs: function() {
            var me = this,
                $sort = $('.sort'),
                $searchAbility = $('.search-ability'),
                $typeList = $('.js-type-list'),
                $search = $('.search-bar'),
                $no = $search.find('.jc-no')
                $ability = $search.find('.jc-ability'),
                $type = $search.find('.jc-type'),
                $box = $('.search-box');
            me.downlist();
            $sort.on('click', '.sort-a', function() {            	
                var $this = $(this),
                    val = $this.data('sort');
                //交互
                $('.tab').find('.sort-input').val(val);                
                var post = C.serializeObject($('.document-form')),
		       		category_id=post['category_id'],
		       		sub_category_id=post['sub_category_id'],
		       		sort=post['sort'],
		       		type=post['typee'];
		       		var v=post['keyword'].replace(/[~'!<>@#$%^&*?()-+_=:]/g, "");
		       		if(v){
		       			window.location.href ='/search/'+type+'-'+category_id+'-'+sub_category_id+'.html?sort='+sort+'&keyword=' + v;
		       		}else{
		       			window.location.href ='/search/'+type+'-'+category_id+'-'+sub_category_id+'.html?sort='+sort;
		       		}
                	
                	//me.submitForm();
            });
            $box.on('click', '.js-search-box-btn', function() {
            	var post = C.serializeObject($('.document-form')),
		       		category_id=post['category_id'],
		       		sub_category_id=post['sub_category_id'],
		       		sort=post['sort'],
		       		type=post['typee'];
            	var v=post['keyword'].replace(/[~'!<>@#$%^&*?()-+_=:]/g, "");
            	if(v){
            		window.location.href ='/search/'+type+'-'+category_id+'-'+sub_category_id+'.html?sort='+sort+'&keyword=' + v;
            	}else{
            		window.location.href ='/search/'+type+'-'+category_id+'-'+sub_category_id+'.html';
            	}
                //me.submitForm();
            });
            $box.on('keydown', '.key-input', function(e) {
                if (e.keyCode == 13 && $(this).val() != '') {
                    me.submitForm();
                }
            });

            var condition = function() {
                if ($('.jc-ability').html() == '') {
                    if ($('.jc-type').html() == '') {
                        $no.show();
                    } else {
                        $no.hide();
                    }
                } else {
                    $no.hide();
                }
            }

  /*          list = $.parseJSON($searchAbility.find('.cur').attr('children'));
            html = [];
            html.push('<li><a class="cur" data-id="0" >全部</a><em>|</em></li>');
            $.each(list, function(k, v) {
                if (k != list.length - 1) {
                    html.push('<li><a data-id="'+v.id+'">'+C.escape(v.name)+'</a><em>|</em></li>');
                } else {
                    html.push('<li><a data-id="'+v.id+'">'+C.escape(v.name)+'</a></li>');
                }
            });

            $typeList.find('.search-type').html(html.join('</li>'));*/
            $searchAbility.on('click', 'li a', function() {
                var $this = $(this),
                    children = $this.attr('children'),
                    text = $this.text(),
                    list, html;

                $this.addClass('cur');
                $this.closest('li').siblings().find('a').removeClass('cur');
                $('.js-level').val($this.data('id'));
                
            /*    list = $.parseJSON(children);
                html = [];
                if (list.length <= 1) {
                    html.push('<li><a data-id="0" class="cur">全部</a></li>');
                } else {
                    html.push('<li><a data-id="0" class="cur">全部</a><em>|</em></li>');
                }
                $.each(list, function(k, v) {
                    if (k != list.length - 1) {
                        html.push('<li><a data-id="'+v.id+'">'+C.escape(v.name)+'</a><em>|</em></li>');
                    } else {
                        html.push('<li><a data-id="'+v.id+'">'+C.escape(v.name)+'</a></li>');
                    }
                });

                $typeList.find('.search-type').html(html.join('</li>'));*/
                
                //搜索条件
                $type.html('');
                if (text != '全部') {
                    $ability.html('<span>'+ text +'<i class="iconfont"></i></span>');
                } else {
                    $ability.html('');
                    $('.js-sub').val(0);
                }
                condition();
           
                //me.submitForm();
                
                //me.downlist();
                //me.Course();
            });

            $typeList.on('click', 'li a', function() {
                alert(1)
                var $this = $(this),
                    text = $this.text();

                $this.addClass('cur');
                $this.closest('li').siblings().find('a').removeClass('cur');
                $('.js-sub').val($this.data('id'));

                if (text != '全部') {
                    $type.html('<span>'+ text +'<i class="iconfont"></i></span>');
                } else {
                    $type.html('');
                }
                condition();

                me.submitForm();
            });

            $ability.on('click', 'span', function() {
                $(this).remove();
                $searchAbility.find('li a').eq(0).trigger('click');
                condition();
            });

            $type.on('click', 'span', function() {
                $(this).remove();
                $typeList.find('li a').eq(0).trigger('click');
                condition();
            });

            $search.on('click', '.js-clear-btn', function() {
				if(window.location.pathname.indexOf('brain')>0)
					window.location.href	=	'/search/brain';
				else
					window.location.href	=	'/search/document';
                $ability.html('');
                $type.html('');
                $search.find('.key-input').val('');
                $searchAbility.find('li a').eq(0).trigger('click');
                $no.show();
            });
         
        },
        downlist: function(){
        	var post = C.serializeObject($('.document-form'));
        	var category_id=post['category_id'];
        	  C.ajax({
        		  url: C.createUrl('/web/Search/GetDownTopList'),
	               	data: {category_id: category_id},
	               	 type:'post',
	               	 success:function(result){
	               	    $.each(result, function(k, v) {
	               	    	if(k=='0' ){
	               	    		var htmll ='';
	               	    	   $.each(v, function(v2, vl) {
							    if(v2==0){
		               	    			classs='one';
		               	    		  }else{
		               	    			classs='';
		               	    		  }
	               	    		htmll +='<tr><td><i class='+classs+'>'+(v2+1)+'</i></td><td><a href="/document_detail-'+vl.document_id+'"  target="_blank" title="'+vl.title+'">'+C.escape(vl.title)+'</a></td><td class="right"><b>'+C.escape(vl.num)+'</b></td></tr>'; 
	  	               	     });
	  	               	    	 $('.dow1').html(htmll);
	               	    	}else{
	               	    		var html2='';
	               	    	  $.each(v, function(v2, vl) {
							  if(v2==0){
	               	    			classs='one';
	               	    		  }else{
	               	    			classs='';
	               	    		  }
		               	    		html2 +='<tr><td><i  class='+classs+'>'+(v2+1)+'</i></td><td><a href="/document_detail-'+vl.document_id+'"  target="_blank" title="'+vl.title+'">'+C.escape(vl.title)+'</a></td><td class="right"><b>'+C.escape(vl.num)+'</b></td></tr>';
		  	               	    	 
		  	               	     });
	               	    	$('.dow2').html(html2);
	               	    	}
	                    });
	               		
	               	 }
	               })
        },
        Course: function(){
        	var post = C.serializeObject($('.document-form'));
        	var category_id=post['category_id'];
        	  C.ajax({
        		  url: C.createUrl('/web/Search/Course'),
	               	data: {category_id: category_id},
	               	 type:'post',
	               	 success:function(result){
	               		var html2='';
	               		 $.each(result, function(k, vl) {
			               	    		html2 +='<li><i  class="iconfont">&#xe601;</i><a title="'+vl.title+'" href="'+vl.url+'" target="_blank">'+C.escape(vl.title)+'</a></li>';
		               		 })
		               		$('.video-list').html(html2);
	               	 }
        	  })
        },
        submitForm: function() {
            var $searchForm = $('.document-form'),
                $list = $('.tablist:visible'),
                post = C.serializeObject($searchForm);

            $list.data('searched', true);
            //$list.pagination('submit', post);
        },

        pagination: function() {
			var pageindex	=	window.location.pathname.indexOf('brain')>0?1:0,
				tmp			=	[],
				allPages	=	$('#allPages').val();
				cur			=	$('#cur').val();
				$page		=	$('.js-pages').eq(pageindex);
			if(cur==1){
				tmp.push('<span class="page-info"><span class="prev prev-disabled"><i></i>上一页</span><ul class="page-list">');
			}
			else{
				tmp.push('<span class="page-info"><span class="prev"><i></i>上一页</span><ul class="page-list">');
			}
			if(cur<6){
				for(var i=1;i<cur;i++)
					tmp.push('<li class="num min" data-page="'+i+'">'+i+'</li>');					
			}
			else{
				tmp.push('<li class="num min" data-page="1">1</li><li class="num min" data-page="2">2</li><li class="pagination-break">...</li>');
				tmp.push('<li class="num min" data-page="'+(cur-2)+'">'+(cur-2)+'</li>');
				tmp.push('<li class="num min" data-page="'+(cur-1)+'">'+(cur-1)+'</li>');	
			}
			tmp.push('<li class="num min cur" data-page="'+cur+'">'+cur+'</li>');
			var flag=0;
				for(var i=parseInt(cur)+1;i<=allPages;i++)
				{
					flag++;
					if(flag==3)
						break;
					tmp.push('<li class="num min" data-page="'+i+'">'+i+'</li>');					
				}
				if(flag>2)
				{
					if(parseInt(allPages)-parseInt(cur)>3)
						tmp.push('<li class="pagination-break">...</li><li class="num min" data-page="'+allPages+'">'+allPages+'</li>');
					else
						tmp.push('<li class="num min" data-page="'+allPages+'">'+allPages+'</li>');		
				}

			if(cur==allPages){
				tmp.push('</ul><span class="next next-disabled">下一页<i></i></span><span class="page-sum">共'+allPages+'页</span></span>');
			}
			else{
				tmp.push('</ul><span class="next">下一页<i></i></span><span class="page-sum">共'+allPages+'页</span></span>');
			}	
			$page.html(tmp.join(''));

	
			function newUrl(curId){
				//window.location.href	=	location.search?window.location.href + '&cur=' + curId:window.location.pathname + '?cur=' + curId;
				if(location.href.indexOf('cur=')>0)
					window.location.href	=	location.href.replace(/cur=\d{1,6}/,'cur=' + curId);
				else
				{
					if(location.search)
						window.location.href	=	window.location.href + '&cur=' + curId;
					else
						window.location.href	=	window.location.pathname + '?cur=' + curId;
				}
					
			}
			$page.find('li.num').click(function(){
				var	me					=	$(this);
					newUrl(me.data('page'));
			});
			$('.prev').click(function(){
				if(cur>1)
					newUrl(parseInt(cur)-1);
			});
			$('.next').click(function(){
				if(parseInt(allPages)>parseInt(cur))
					newUrl(parseInt(cur)+1);
			});

        }
	};

	return Search;
})