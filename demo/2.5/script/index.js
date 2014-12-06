/* 
* @Author: 12050231
* @Date:   2014-11-18 21:03:57
* @Last Modified by:   sweetiy
* @Last Modified time: 2014-11-28 18:12:41
*/


// 前端交互效果
;(function(){
	// ;(function(callback){
		$("#Sn_Loading").remove();
		$("#indexWrap").show();
		// callback();
	// })();
})();





// 通用方法

;(function(S,M){
	function isObject(obj){return Object.prototype.toString.call(obj) === '[object Object]'}
    function __setProto__(obj){
        if(isObject(obj)){
            obj = Object.create(obj);
            return obj;
        }
    }
    var W = window;
    var Module = M;

    S.require = function(module,value){
    	if(arguments.length > 1){
    		// module need return, like SUI.Use();
    		return SUI.Use(module,value);
    	}else{
    		return Module[module];
    	}
    };
    // 后期使用requireJS取代
    S.load = {
    	mod: {},
        opts: {
            baseUrl: "script/"
        },
        config: function(opts){
            if(isObject(opts)){
                this.opts = opts;
            }
        },
    	define: function(name, object){
    		this.mod[name] = typeof object == 'function' ? object() : object;
    	},
    	// 目前只支持单个文件引入
    	require: function(name, object){
    		var _file = [], _script,_name;
    		var self = this;
    		if(name.constructor === Array){
    			name.forEach(function(item){
    				_file.push(item);
    			});
    		}else if(name.constructor === String){
    			_file = name = [name];
    		};
    		if(self.mod[name]){return;}
    		for(var i = 0, len = _file.length; i < len; i++){
    			var temp = _file[i].split("/");
    			temp = temp[temp.length - 1];
    			var script = _script;
    			script = document.createElement("script");
    			script.src = self.opts.baseUrl + _file[i] + ".js";
    			script.type = "text/javascript";
    			document.querySelector("head").appendChild(script);
    			script.onload = function(){
    				object && object.call(object,self.mod[temp]);
    			}
    		}
    	}
    };
    
    S.exports = function(module, value){
    	var arr = module.split(".");
    	var ns = S.pub = {};
    	for(var i = 0,len = arr.length;i < len; i++){
    		if(typeof ns[arr[i]] == "undefined"){
    			ns[arr[i]] = {}
    		}
    		if(i == len - 1){
				ns[arr[i]] = value;
			}
    		ns = ns[arr[i]];
    	}
    }

	S.Use = function(fnName, options, FnAttr){
        if(arguments.length > 2){
            return S.UI[fnName](options, FnAttr);
        }else{
            return S.UI[fnName](options);
        }
		
	}
	S.UI = {};
	S = __setProto__(S);
	W.SUI = S;
})(window.SUI = window.SUI || {},{
	position: {
		getHeight: function(){
			var height = document.documentElement.offsetHeight || document.body.offsetHeight;
			if(window.innerHeight > height){
				height = window.innerHeight;
			}
			return height;
		},
	    scrollTop: function(){
	    	return document.documentElement.scrollTop || document.body.scrollTop;
	    }
	},
	checkDevice: {
		isMobile: function(){
			return (navigator.userAgent.match(/Win/i) 
				|| navigator.userAgent.match(/MacIntel/i) 
				|| navigator.userAgent.match(/Linux/i)
			) ? false : true;
		},

	},
    remove: function(){
    	return this.parentNode.removeChild(this);
    },
    tmpl2: function (str, data) {
	    var $ = '$' + (+ new Date)
	        , fn = function (data) {
	            var i, variable = [$], value = [[]];
	            for (i in data) {
	                variable.push(i);
	                value.push(data[i]);
	            }
	            return (new Function(variable, fn.$))
	                .apply(data, value).join("");
	        };
	    //将模板解析成函数
	    fn.$ = fn.$ || $ + ".push('"
	        + str.replace(/\\/g, "\\\\")
	        .replace(/[\r\t\n]/g, " ")
	        .split("<%").join("\t")
	        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
	        .replace(/\t=(.*?)%>/g, "',$1,'")
	        .split("\t").join("');")
	        .split("%>").join($ + ".push('")
	        .split("\r").join("\\'")
	        + "');return " + $;

	    //如果未定义data则返回编译好的函数，使用时直接传入数据即可，
	    //省去每次解析成函数的时间
	    return data ? fn(data) : fn;
	},
	main: {
		selectBind: function(){
			$(".sn-show-optiton").each(function(){
				var $this = $(this);
				var _showBox = $this.next(".sn-show-option-box");
				$this.click(function(){
					$this.find(".show-option-view").toggleClass("showview");
					_showBox.toggle();
				});
				_showBox.find(".block").on("click",function(){
				//	$this.find(".show-option-view").html($(this).find("a").html());
					$(this).addClass("sn-btn-c").removeClass("sn-btn-b").siblings().removeClass("sn-btn-c").addClass("sn-btn-b");
					_showBox.hide();
					$this.find(".show-option-view").removeClass("showview");
				});
			})
			if(!document.querySelectorAll(".sn-select")){return;}
			Array.prototype.slice.call(document.querySelectorAll(".sn-select")).forEach(function(item){
				if(item.querySelector("select")){
					item.querySelector("select").addEventListener("change", function(){
						var _index = this.selectedIndex;
						item.querySelector(".select-view").innerHTML = (this.options[_index].text || this.options[_index].value);
					}, false);
				}
			});
		}
	}
	
});


SUI.UI.HTMLTemplate = function(opts) {
    var o = opts.para || {};
    var html = [opts.string].join('');
    if (o) {
        for (var i in o) {
            //替换${var}变量
            var re = new RegExp('\\$\\{' + i + '\\}', 'g');
            html = html.replace(re, o[i]);
        }
        return html;
    }
    return html;
};




/**
 * [弹窗]
 * @return {[type]} [description]
 */
SUI.UI.AlertBox = function(opts){


      var alertHtml = '<div id="alertBox" class="alertBox alertBoxBlack"><div class="msg">'+ opts.msg+'</div></div>',
		  maskHtml = '<div id="tempMask" ></div>';
		  $("body").append($(alertHtml)).append($(maskHtml));
		  $("#tempMask").css({"width": document.documentElement.offsetWidth,"height": SUI.require("position").getHeight(), "opacity": 0});
		  $("#alertBox").css({"top": (SUI.require("position").scrollTop() + window.innerHeight/2 - $("#alertBox")[0].offsetHeight/2) + "px"
		  				,"left": + (document.documentElement.offsetWidth/2 - $("#alertBox")[0].offsetWidth/2) + "px"});

		  setTimeout(function(){
		  	       if (navigator.userAgent.match(/iPhone/i)) {
                            $("#alertBox").fadeOut(500, function(){
                                  $(this).remove();
                             });
                    } else{
                         $("#alertBox").remove();
                    }

                    $("#tempMask").remove();
                  
    			},2000);

};





;(function(root, factory){
    if (typeof module !== 'undefined' && module.exports) { // CommonJS
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) { // AMD / RequireJS
        define(factory);
    } else {
        root.lazyload = factory.call(root);
    }
})(this, function(){
	'use strict';
	function lazyload(el){
	    var delay = null;
	    $(el).find("img").each(function(){
	    	//!$(el).hasClass("lazyimg") && $(el).addClass("lazyimg");
	        var _this = $(this)[0];

	        if(_this.getAttribute("data-src") == null){
	                    return;
	        }
	        
	        if($(this).offset().top < window.innerHeight){
	        	_this.onerror = function(){
                 	this.src = "http://script.suning.cn/images/ShoppingArea/Common/blank.gif";
                }
	            _this.src = _this.getAttribute("data-src");
	            _this.setAttribute("data-src","done");
	        }
	    });
	    window.addEventListener("scroll", function(){
	        delay = setTimeout(function(){
	            $(el).find("img").each(function(){
	            	//!$(el).hasClass("lazyimg") && $(el).addClass("lazyimg");
	                var _this = $(this)[0];
					if(_this.getAttribute("data-src") == null){
	                    return;
	                }
	                var top = $(this).offset().top;
	                var h = window.innerHeight || window.screen.height;
	                if(window.pageYOffset > top + h || window.pageYOffset < top - h && _this.getAttribute("data-src") != "done"){
	                    clearTimeout(delay);
	                    return;
	                }
	                if(window.pageYOffset > top - h && _this.getAttribute("data-src") != "done"){
	                	_this.onerror = function(){
	                     	this.src = "http://script.suning.cn/images/ShoppingArea/Common/blank.gif";
	                    }
	                    _this.src = _this.getAttribute("data-src");
	                    _this.setAttribute("data-src","done");
	                }
	            })
	        },100)
	    }, false)
	};
	if (window.Zepto || window.jQuery) {
        (function($) {
            $.fn.lazyload = function() {
                return this.each(function() {
                    lazyload($(this));
                });
            }
        })(window.Zepto || window.jQuery);
    }
    return lazyload;
})




// 首页焦点图
;(function(){
	if($("#J_index_slide")[0] == undefined) return;

	var res = $("#J_index_slide")[0].dataset.res,
		_length = JSON.parse(res).modulelist.length;
	if( _length > 1){
		$("#J_index_slide").removeAttr("data-res");
		var _html = '<ul class="slide_ul">'
		+	'{{each modulelist as value index}}'
		+	'{{if index == 0}}'
		+		'<li><a href="{{value.targeturl}}"><img data-src="{{value.bgimg}}" /></a></li>'
		+ 	'{{else}}'
		+		'<li><a href="{{value.targeturl}}"><img data-src2="{{value.bgimg}}" /></a></li>'
		+	'{{/if}}'
		+	'{{/each}}'
		+	'</ul>'
		+	'<ul class="index-slide-trigger nav-slide-trigger trigger">'
		+	'{{each modulelist as value index}}'
		+	'{{if index == 0}}'
		+		'<li class="cur"></li>'
		+ 	'{{else}}'
		+		'<li></li>'
		+	'{{/if}}'
		+	'{{/each}}'
		+	'</ul>';
		var render = template.compile(_html);
		var html = '<div class="index-slide-box lazyimg" id="mySwipe">' + render(JSON.parse(res)) + '</div>';
		$("#J_index_slide").html(html);

		var mySwipe = Swipe(document.getElementById('mySwipe'), {
			speed: 400,
			auto: 5000,
			callback: function(index, elem){
				if(_length == 2){
					index = index%2;
				}
				$(elem).find("img").each(function(){
					
						if($(this).attr("data-src2")){
							$(this).attr("src", $(this).attr("data-src2"));
							$(this).removeAttr("data-src2");
						}	
				});
			    //$(elem).find("img").attr("data-src") && $(elem).find("img").attr("src", $(elem).find("img").attr("data-src"));
				$("#J_index_slide").find(".nav-slide-trigger").find("li").eq(index).addClass("cur").siblings().removeClass("cur");
			}
		});
	}

})();

var _loadHTML_ = '	<div id="Sn_Loading" class="sn-html5-loading fixedLoading">'
+				 '<div class="blueball"></div>'
+                '<div class="orangeball"></div>'
+                '</div>';



var _navHTML_ = '<div class="nav-carousel-box" id="navCarousel">'
+				'<ul class="slide_ul">'
+					'{{each modulelist as value i}}'
+					'{{if i % 8 == 0}}'
+					'<li>'
+						'{{each modulelist as value j}}'
+                       '{{if j >= i && j < (i + 8)}}'
+                              '{{if j < 8}}'
+						            '<a href="{{value.targeturl}}"><img data-src="{{value.bgimg}}" alt=""><span>{{value.modulename}}</span></a>'                   
+                              '{{else}}'
+                                   '<a href="{{value.targeturl}}"><img data-src2="{{value.bgimg}}" alt=""><span>{{value.modulename}}</span></a>'
+                       		'{{/if}}'
+                       '{{/if}}'
+						'{{/each}}'
+					'</li>'
+					'{{/if}}'
+					'{{/each}}'
+				'</ul>'
+			'</div>'
+			'{{if modulelist.length > 8}}'
+			'<div class="triggerBox pr">'
+				'<ul class="nav-slide-trigger trigger">'
+					'{{each modulelist as value index}}'
+		             '{{if index % 8 == 0 }}'
+					'{{if index == 0}}'
+					'<li class="cur"></li>'
+					'{{else}}'
+					'<li></li>'
+					'{{/if}}'
+					'{{/if}}'
+					'{{/each}}'
+				'</ul>'
+			'</div>'
+			'{{/if}}';




var _brandHTML_ = '<div class="brand-recommend-box"  >'
+	              '<ul class="slide_ul">'
+		             '{{each modulelist as value i}}'
+		             '{{if i % 8 == 0}}'
+		             '<li>'
+		                  '{{each modulelist as value j}}'
+                         '{{if j >= i && j < (i + 8)}}'
+                              '{{if j < 8}}'
+		                           '<a href="{{value.targeturl}}"><img data-src="{{value.bgimg}}" alt=""></a>'
+ 		                       '{{else}}'
+		                           '<a href="{{value.targeturl}}"><img data-src2="{{value.bgimg}}" alt=""></a>'
+                              '{{/if}}'
+                         '{{/if}}'
+		                  '{{/each}}'
+		            '</li>'
+		            '{{/if}}'
+		            '{{/each}}'
+	              '</ul>'
+                 '</div>'
+               '{{if modulelist.length > 8}}'
+               '<div class="triggerBox pr">'
+	            '<ul class="nav-slide-trigger trigger">'
+		              '{{each modulelist as value index}}'
+		              '{{if index % 8 == 0 }}'
+                     '{{if index == 0}}'
+		              '<li class="cur"></li>'
+		              '{{else}}'
+		              '<li></li>'
+		              '{{/if}}'
+		              '{{/if}}'
+		              '{{/each}}'
+	           '</ul>'
+              '</div>'
+              '{{/if}}';




var _dianpuHTML_ = '<div class="store-recommend-box " >'
+						'<ul class="slide_ul">'
+							'{{each modulelist as value i}}'
+							'{{if i % 3 == 0}}'
+							'<li>'
+								'<div class="wbox">'
+								'{{each modulelist as value j}}'
+                               '{{if j >= i && j < (i + 3)}}'
+                                   '{{if j < 3}}'
+									'<a href="{{value.targeturl}}" class="pr store-pic">'
+										'<img data-src="{{value.bgimg}}" alt="">'
+										'<span class="of">{{value.modulename}}</span>'
+									'</a>'
+                                   '{{else}}'
+                                   '<a href="{{value.targeturl}}" class="pr store-pic">'
+										'<img data-src2="{{value.bgimg}}" alt="">'
+										'<span class="of">{{value.modulename}}</span>'
+									'</a>'
+	                               '{{/if}}'                      
+                               '{{/if}}'
+								'{{/each}}'
+							'</li>'
+							'{{/if}}'
+							'{{/each}}'
+						'</ul>'
+					'</div>'
+					'{{if modulelist.length > 3}}'
+					'<div class="triggerBox pr">'
+						'<ul class="nav-slide-trigger trigger">'
+							'{{each modulelist as value index}}'
+							'{{if index % 3 == 0}}'
+                           '{{if index == 0}}'
+							'<li class="cur"></li>'
+							'{{else}}'
+							'<li></li>'
+							'{{/if}}'
+							'{{/if}}'
+							'{{/each}}'
+						'</ul>'
+					'</div>'
+					'{{/if}}';




// 首页所有联版
;(function(opts){


	var dfd = $.Deferred();
	var i = 0,j = 0;

	 opts.forEach(function(item, index){
	 	 j += $("."+ item.id).length;
	 });
	    
    
	 opts.forEach(function(item, index){

       if($("."+ item.id)[0] == undefined){
				if(i == j && index!=2 && j > 1){
				  lazyload("#floor");
				}
				return;
			}



      	$("."+ item.id).each(function(){
                i++;
      		    var self = $(this);
				var res = self[0].dataset.res;
				var	_length = JSON.parse(res).modulelist.length;
		         
				var render = template.compile(item.html);
				var html = render(JSON.parse(res));
				self.html(html).removeAttr("data-res");

				if(i == j){
					dfd.resolve(self);
				}
				if( ((index == 0 || index == 1) && _length > 8) || (index == 2 && _length > 3)  ){
					var mySwipe = Swipe(self.find("."+item.id+"-box")[0], {
						speed: 400,
						continuous: false,
						callback: function(index, elem) {
							if(_length == 2){
								index = index%2;
							}
							$(elem).find("img").each(function(){
								if($(this).attr("data-src2")){
									$(this).attr("src", $(this).attr("data-src2"));
									$(this).removeAttr("data-src2");
								}
							})
							self.find(".nav-slide-trigger").find("li").eq(index).addClass("cur").siblings().removeClass("cur");
						}
					});

				}

 
	   

      	});
		
	});
	$.when(dfd).done(function(){
		lazyload("#floor");

	})

})([{id: "nav-carousel", html: _navHTML_},{id: "brand-recommend", html: _brandHTML_},{id: "store-recommend", html: _dianpuHTML_}]);
		

//楼层图片滑屏
;(function(){

	   if($(".app12-pic")[0] == undefined) return;

	  $(".app12-pic").each(function(){
		  	var self = $(this),
		  		startX,
				startY,
				moveX, 
				moveX,
				dx = 0,//标记移动距离
				dis = 0,//标记距离
				scrolling = undefined,//是否滚动状态
				w = window.innerWidth,
				wrap = self.find("li"),
				wA = wrap.find("a").width(),//a width
				len = wrap.find("a").length,//a length
				wrapW = len * wA ;//ul width
				wrap.width(wrapW+ "px");


	         wrap.on("touchstart", function(e){

	                   if(wrapW <= w) return;
	                   startX = e.touches[0].pageX;
	               	   startY = e.touches[0].pageY;
	               	   scrolling = undefined;
	               	     


	         }).on("touchmove", function(e){
	         	 	   moveX = e.touches[0].pageX;
	               	   moveY = e.touches[0].pageY;
	               	   var x = startX - moveX,
	               	       y = startY - moveY;
	           	      if(typeof scrolling == "undefined"){
	                   		scrolling = !! (scrolling || Math.abs(x) < Math.abs(y));
	                  }
	                  if(scrolling) return;
	               	   e.preventDefault();
	               	   x = x / ((dis >= 0 || dis <= (w-wrapW)) ? (Math.abs(x) / w + 1) : 1);//增加阻力
	               	   dx = (x > 0 ? -1 : 1) * Math.abs(x) + dis;//x > 0方向
	               	   setTransform(this, dx, 0);
	         	

	         }).on("touchend", function(e){
	         	    if(scrolling) return;
		         	if(dx >= 0){
		         		 dis = 0;
		         		 setTransform(this, dis, 350);
		         	}else if(dx <= w-wrapW){
		         		dis = w-wrapW;
		         		 setTransform(this, dis, 350);
		         	}else{
		                dis = dx;
		         	}
	               

	         });


	  });
	   function setTransform(el, m, s){
	                el.style.webkitTransform = "translate3d("+ m + "px, 0px, 0px)";
	                el.style.webkitTransitionDuration = s + "ms";
	          }
		
	})();





  //搜索功能
  ;(function(){

        
        var search =  $("#searchFixed"),
            searchBar =  $(".search-bar"),
            searchBox = $("#searchBox"),
            searchClose = $(".sn-search-close"),
            cls = "sn-list-change",
            wh = window.innerHeight,
	   	 	searchTop = search.offset().top;

  	       setTimeout(scrollTo, 0, 0, 0);
		   searchBar.find("input").eq(0).on("focus", function(){
		   			$(this).blur();
		   			//search.removeClass("sticky");
		   			searchBox.show().find("input").eq(0).focus();

		   		    $(".sn-search-hots, .sn-search-item").height((wh - 2*44) + "px");
		   		    $("html").addClass("sn-active");
		   		    $("body,.sn-search-box").height(wh+"px");
		   		    $(".fix-wrap").hide();

		   		 
		   });

		   searchBox.find("input").eq(0).on("focus keyup input", function(){

		   	  
		     	setTimeout(scrollTo, 0, 0, 0);
		     	// if(search.css("position").indexOf("sticky") < 0){
        //         	alert(window.scrollY+":"+searchTop+":"+search[0].outerHTML)
        //         	   window.scrollY > searchTop ? search.css("position","fixed") : search.css("position","static");
        //         }
		     	  //$(this).val().length > 0 ? searchBox.addClass(cls) : searchBox.removeClass(cls);
			   if($(this).val().length ==0  ){
				   searchBox.removeClass(cls);
			   }

			   
		   }).on("blur", function(){
		   	    $(".fix-wrap").show();

		   });

		   searchClose.on("click", function(){
		   	     //search.addClass("sticky").removeAttr("style");
		   		 searchBox.hide().removeClass(cls).find("input").eq(0).val("");
		   		 $("html").removeClass("sn-active");
		   		 $("body").removeAttr("style");
		   		 
		   });
        
        //搜索固定滚动功能
  		
		    window.addEventListener("scroll",function(){
				//alert(1);
                if(search.css("position").indexOf("sticky") < 0){
                	//alert(window.scrollY+":"+searchTop+":"+search[0].outerHTML)
                	   window.scrollY > searchTop ? search.css("position","fixed") : search.css("position","static");
                }

		   });


			/**
			 * 格式化url将特殊字符转义
			 * @param str
			 * @returns 转义后的字符串
			 */
			function wapFormatURL(str) {
					str = hasAndRepalceSpecialCharater(str,/\%/g,"%25");
					str = hasAndRepalceSpecialCharater(str,/\+/g,"%2B");
					str = hasAndRepalceSpecialCharater(str,/\#/g,"%23");
					str = hasAndRepalceSpecialCharater(str,/\&/g,"%26");
					str = hasAndRepalceSpecialCharater(str,/\?/g,"%3F");
					str = hasAndRepalceSpecialCharater(str,/\ /g,"%20");
					str = hasAndRepalceSpecialCharater(str,/\//g,"%2F");
				return str;
			}

			/**
			 * 将字符串中指定字符转换成目标字符
			 * @param {源字符串} str
			 * @param {需要转换的字符正则表达式} reg
			 * @param {目标字符} target
			 */
			function hasAndRepalceSpecialCharater (str,reg, target){
				if (reg.test(str)) 
			        return str.replace(reg,target);
			    return str;
			}

			/**
			 * 去除前后空格
			 * @param {待格式化的字符串} str
			 */
			function trim(str){
			    var reg = /(^\s*)|(\s*$)/g;
			    if (reg.test(str)) {
			        return str.replace(reg, "");
			    }
			    return str;
			}


			/*
			 * 搜索的index页面js
			 */
			function queryHotWrods(){
				$('.otherProBox').hide();
			    $.ajax({
			        url: "${app-root}/queryHotWords/jsonp.html",
			        type: "post",
			        async: false,
			    
			        success: function(result){

			            if (result.errorCode == "" && result.hotWords.length > 0) {
			                //热词div
			                $('#hotwordsBox').show();
			                constructHotWrods(result.hotWords);
			            }
			        },
			        error: function(){
			            
			        }
			    });
			}
			
			window.queryHotWrods = queryHotWrods;

			function constructHotWrods(hotWords){//构建热词
			    var $hotwordsBox = $('#hotwordsBox');
				$hotwordsBox.empty();
			    //$hotwordsBox.show();
			    var builderDom = '';
				
			    $.each(hotWords, function(i, item){
			    	builderDom += ('<a href="'+'${app-root}/search/result.html?keyword=' + wapFormatURL(trim(item.value)) +'">' + item.value + '</a>');
			    	
			    });
			    $hotwordsBox.html(builderDom);
			}



			// 监听软键盘 搜索事件
			document.onkeydown =function(event){
				var e = event || window.event || arguments.callee.caller.arguments[0];
				if(e && e.keyCode==13){
					 searchclick();
				}
			}; 

			function searchclick(){
				var kwVal = $("#wapSearchInput").val();
				if (!trim(kwVal)) {
					return;
				}
				location.href="${app-root}/search/result.html?keyword=" + wapFormatURL(trim(kwVal));
			}

			window.searchclick = searchclick;
			
			
			/**
			 * 联想词js
			 *  搜索输入框联想词
			 */

			var suggest = true; // 触发标志
			//监听input输入改变
			function OnInput(event){
				if(suggest == true){
					suggest = false;
				    window.setTimeout(function(){
						if(!!trim(event.srcElement.value)){
					        showSuggestBox(event.srcElement.value);
						}
						$("#suggestList").empty();
						 
						 suggest = true;
				    }, 1000);
				}    
			}

			window.OnInput = OnInput;

			//接口需要的参数
			var sugParams = {
			    "keyword": "",
			};
			//根据输入获取联想词
			function showSuggestBox(kw){
			    sugParams.keyword = kw;
			    $.ajax({
			        url: "${app-root}/queryAssociateWords/jsonp/" + sugParams.keyword + ".html",
			        type: "post",
		            beforeSend: function(){
			        	$("body").append(_loadHTML_);
			        },
			        success: function(result){
			            $("#suggestList").empty();
			            if (result.errorCode =="" && result.associateWords.length > 0) {
			            	 $("#searchBox").addClass("sn-list-change");
			                constructSuggest(result.associateWords);
			            }else{
			            	 $("#searchBox").removeClass("sn-list-change");
			            }
			            
			            	
			        },
			        error: function(){
						
			        },
			        complete: function(){
			        	$("#Sn_Loading").remove();
			        }
			    });
			}
			/**
			 * 是否包含+
			 * @param {Object} str
			 */
			function hasPlus(str){
			}
			//构造联想词dom结构
			function constructSuggest(result){
			    var $suggestList = $("#suggestList");
			    $.each(result, function(i, item){
			        var $liDom = $('<li></li>');
					var link = "${app-root}/search/result.html?keyword=" + wapFormatURL(trim(item.keyword));
					var $aDom = $('<a href="'+link+'">' + item.keyword + '</a>');
			        $liDom.on("click", function(){
			            $("#wapSearchInput").val(item.keyword);
						location.href=link;
			            $suggestList.empty();//清空联想词dom内容
			        });
					$liDom.append($aDom);
			        $suggestList.append($liDom);
			    });
			}




  })();





///////////////////////////////////////////////////// 业务逻辑 ////////////////////////////////////////
// 城市定位
	;(function(){
		//1.加载城市
		SUI.load.opts.baseUrl = (_baseConfig_._base_) + "/RES/wap/product/script/";
		var defaultCity={};
		defaultCity.cityNo= $.cookie("cityId") || "9173";
		defaultCity.provinceCode= $.cookie("provinceCode") || '100';
		defaultCity.distNo= $.cookie("districtId") || "11365";
		//cookie 过期时间
		var date = new Date();
		date.setTime(date.getTime() + (12*60*60*1000));

		var firstFlag = false;
		if($.cookie("provinceCode")){
			firstFlag = true;
		}else{
			var a = new Date();
			a.setTime(a.getTime() + 24 * 60 * 60 * 1000 * 365);
			document.cookie = "ucFlag=ucFlag;domain=" + sn['cookieDomain'] + ";path=/;expires=" + a.toGMTString();
		}
		SUI.load.require("getCity", function(getCity){
			getCity({
		        uid: "#city1",
		        defaultCity: defaultCity,
		        firstFlag: firstFlag,
		        distShowFlag: true,
		        getCityIdFirst: function(initCityHtml){
		        	//$.cookie("provinceCode",meta.provinceCode,{path: '/',domain:sn['cookieDomain'],expires: date});
		            //$.cookie("cityId",meta.cityNo,{path: '/',domain:sn['cookieDomain'],expires: date});
		            initCityHtml(defaultCity);
		        },
		        done: function(meta){
		        	$.cookie("cityId",meta.cityNo,{path: '/',domain:sn['cookieDomain'],expires: date});
		        	$.cookie("provinceCode",meta.provinceCode,{path: '/',domain:sn['cookieDomain'],expires: date});
		        	$.cookie("districtId",meta.distNo,{path: '/',domain:sn['cookieDomain'],expires: date});
		        }
			});
		});
		
		//2.加载搜索热词
		queryHotWrods();

	     var $wapSearchInput = $("#wapSearchInput");
	 	$wapSearchInput.focus();
	 	$wapSearchInput.attr("value",$("#keyword").val());
	 	$wapSearchInput.keypress(function(e){
	 		var key = e.which;
	 		if(key ==13){
	 			 searchclick();
	 		}
	 	});
	 	
	})();


	// 购物车数量    
	var cnum =$.cookie('totalProdQtyv3') ;
	if(typeof cnum === 'undefined' || cnum ==0){
		$("#cartnum").html("") ;
	}else{
		if(cnum >= 100){
			$("#cartnum").html("<span class='count'><em>99<i>+<\/i><\/em><\/span>") ;
		}else{
			$("#cartnum").html("<span class='count'><em>"+cnum+"<\/em><\/span>") ;
		}
	}


	

