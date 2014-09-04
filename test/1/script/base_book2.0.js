/**
 * @author 12050231
 *
 */
/*
    a simple JavaScript library for bookshop by PPanda
    my sametime： 12050231
    for ios 4.35+
*/



//only for SNCarousel()
jQuery.easing['jswing'] = jQuery.easing['swing'];
jQuery.extend(jQuery.easing, {
    def: 'easeOutQuad',
    easeOutExpo: function(x, t, b, c, d) {
        return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    easeOutQuad: function (x, t, b, c, d) {return c*((t=t/d-1)*t*t + 1) + b;}
});

//a simple JavaScript library by ppanda
(function(w, S, undefined){
	if(w[S] === undefined){
		w[S] = {};
	}
	ST = w[S];
    var doc = w.document;
    //一些常用方法
	ST = {
        //get Element
		D: function(el){
            return typeof el == "string" ? doc.querySelector(el) : el;
        },
        //get Tags and className as a array
        DA: function(el){
            return typeof el == "string" ? doc.querySelectorAll(el) : el;
        },
        each: function(el, Fn){
            for(var i = 0,l = el.length; i < l; i++){
                (function(index){
                    Fn(index)
                })(i)
            }
        },
        dEach: function(){
            if(arguments.length == 0){return}
            if(typeof arguments[0] == "string"){
                if(arguments[0].indexOf(",") > -1){
                    var str = arguments[0].split(",");
                    var arr = [];
                    for(var i = 0; i < str.length; i++){
                        arr.push(doc.querySelector(str[i]));
                    }
                    return arr;
                }else{
                    return doc.querySelectorAll(arguments[0]);
                }
            }else{
                return arguments[0]
            }
        },
        // 安卓透光问题
        rBlur: function(){
        if(this.checkDetect().system == "android"){
            var style = document.createElement("style");
            style.type = "text/css";
            style.id = "rBlur";
            style.innerHTML = "*{-webkit-tap-highlight-color:rgba(0,0,0,0)}";
            document.body.appendChild(style);
        }
        },
        find: function(el,tag){
            var a = arguments[0], t = null;
            if(typeof a == "string"){
                t = document.querySelector(el).querySelectorAll(tag);
            }else{
               if(a.length == null){
                  return a.querySelectorAll(tag);
               }
               for(var k = 0;k < a.length; k++){
                    for(var j = 0; j < a[k].querySelectorAll(tag).length; j++){
                        t.push(a[k].querySelectorAll(tag)[j]);
                    }
                }
            }
            return t;
        },
        eq: function(el, i){
            return S.DA(el)[i]
        },
        bind: function(el, type, Fn){
            el.addEventListener(type, Fn, false);
        }
	}
    //
	ST.EVA = function(o, r){
		var p;
		for(p in r){
			o[p] = r[p]
		}
	}
    ST.DOM = function(p, Fn){
        HTMLElement.prototype[p] = Fn;
    }
    //
    ST.DeviceMotionEvent = function(Fn){
        var SHAKE_THRESHOLD = 1800;
        var lastUpdate = 0;
        var end = false;
        var x, y, z, last_x, last_y, last_z;
        if(window.DeviceMotionEvent){
            ST.bind(window, "devicemotion", shakeHandler)
        }
        function shakeHandler(eventData) {
          var acceleration = eventData.accelerationIncludingGravity;
          var curTime = new Date().getTime();
          if ((curTime - lastUpdate) > 100) {
              var diffTime = (curTime - lastUpdate);
              lastUpdate = curTime;
              x = acceleration.x;
              y = acceleration.y;
              z = acceleration.z;
              var speed = Math.abs(x+y+z-last_x-last_y-last_z) / diffTime * 10000;
              //
              if (speed > SHAKE_THRESHOLD && !end) {
                    end = true;
                    if(Object.prototype.toString.call(Fn) === "[object Function]"){
                        Fn();
                    }
                    setTimeout(function(){
                        end = false;
                    },800);
                    return;
              }
              last_x = x;
              last_y = y;
              last_z = z;
            }
        }
    }
    //shortcut
	window.S = ST;
})(window, "S");

;(function(S){
    ST.DOM("show", function(){
        this.style.display = "block";
    });
    ST.DOM("hide", function(){
        this.style.display = "none";
    });
    ST.DOM("css", function(p){
        var tmp = ""
        for(i in p){
            if(p.hasOwnProperty(i)){
                tmp += i + ":" + p[i] + ";";
            }
        }
        this.style.cssText = " " + tmp;
    })
})(ST);

//书城专用方法
ST.Widget = Object.create({
    SNCarousel : function(settings){
        /**
         * 默认参数
         * depend on jquery
         * @type {Object}
         * @by PPanda
         * @version 1.0
         * @example
         * SNTouch.Widget.SNSlide({
         *     hook: "#id"
         * })
         * @兼容多种浏览器，未使用webkitAnimationEvent
         * 
         */
        //var S = this;
        var defaults = {
            hook : "#J_index_slide",
            direction: "X",
            slideBox: ".index-slide-box",
            slideUl: ".slide_ul",
            slideLi: ".slide_ul li",
            prev: ".prev",
            next: ".next",
            disable: "disabled",
            counter: ".trigger",
            effect: "scroll",
            current: 1,
            timer: 450,
            autoplay: 1,
            cycle: 1,
            touch : true,
            asyncLoad: false
        };
        //继承参数
        if (settings) {
            $.extend(defaults, settings);
        }
        if(!S.D(defaults.hook)){
            return;
        }
        function N(defaults){
            var c = defaults;
            var p = $(c.hook);
            var uid = c.hook;
            var cur = c.current;
            var w = 0,
                h = 0,
                width = 0,
                height = 0,
                //var len = Math.ceil(p.find(c.slideLi).length);
                len = Math.ceil(S.DA(uid + " " +c.slideLi).length),
                //var Li = p.find(c.slideLi);
                Li = S.DA(uid + " " +c.slideLi),
                Ul = S.DA(uid + " " +c.slideUl),
                $Li = $(Li),
                $Ul = $(Ul),
                width = p.find(c.slideBox).width(),
                height = p.find(c.slideBox).height(),
                //判断横屏
                X = c.direction == "X" ? true : false,
                autoplay = c.autoplay,
                flag = false,
                N = null;
            //end var
            $Li.find(".wideImg").width(document.documentElement.offsetWidth);
            if(len == 1){
                Ul[0].onmousedown = Ul[0].ontouchstart = null;
                trig();
                return;
            }
            if(c.cycle == 1){
                var lastLi = $(Li[len - 1]).clone();
                var fstLi = $(Li[0]).clone();
                $Ul.append(fstLi);
                $Ul.append(lastLi);
                //Ul.width(width * (len + 2))
                Ul[0].style.width = width * (len + 2) + "px";
                //lastLi.css("left", -width * (len + 2));
                lastLi.get(0).style.left = -width *(len + 2) + "px";
            }
            if (X) {
                for (var i = 0; i < len; i++) {
                    //计算图片总宽度
                    w += $Li.eq(i).width();
                }
                //Ul.width(w);
                //设置图片当前位置
                //p.find(c.slideUl).css("left", -(width * (cur - 1)));
            } else {
                for (var i = 0; i < len; i++) {
                    h += $Li.eq(i).height();
                }
                //Ul.height(h);
               // p.find(c.slideUl).css("top", -(height * (cur - 1)));
            }
            trig();
            switch (c.effect) {
            case "ctrl":
                ctrl();
                break;
            case "scroll":
                Scroll();
                break;
            case "both":
                ctrl();
                Scroll();
            }
            function Scroll() {
                if (X) {
                    //剩余移动距离
                    var dis = -w + width;
                } else {
                    var dis = -h + height;
                }
                //绑定开始事件
                if(c.touch){
                    Ul[0].onmousedown = Ul[0].ontouchstart = Start;
                }else{
                    Ul.hover(function(){
                        auto.dispose();
                    },function(){
                        auto.process();
                    })
                }

                function Start(para) {
                    
                    //para.preventDefault();
                    
                    //初始位置、移动位置、
                    var sPos, mPos;
                    // if (autoplay) {
                    //     auto.process()
                    // }
                    //双击可能失效
                    auto.dispose();
                    //初始容器静止坐标
                    //获取匹配元素相对父元素的偏移坐标
                    var pos = [$Ul.position().left, $Ul.position().top];
                    //点击初始坐标位置
                    sPos = setPos(para);
                    Ul[0].ontouchmove = Ul[0].onmousemove = Move;
                    
                    function Move(e) {

                        //移动坐标位置
                        mPos = setPos(e);
                        if (X) {
                            //移动的距离差
                            
                            var ePos = (mPos[0] - sPos[0]) + pos[0];

                            if (Math.abs(mPos[0] - sPos[0]) - Math.abs(mPos[1] - sPos[1]) > 0) {
                                e.preventDefault();
                                getPos();
                                Ul[0].ontouchend = document.onmouseup = EndMove;
                            }
                        } else {
                            var ePos = (mPos[1] - sPos[1]) + pos[1];
                            e.preventDefault();
                            getPos();
                            Ul[0].ontouchend = document.onmouseup = EndMove;
                        }
                        //移动位置
                        function getPos() {
                            //排除头尾
                            //if (ePos <= 0 && ePos >= dis) {
                                if (X) {
                                    Ul[0].style.left = ePos + "px";
                                } else {
                                    Ul[0].style.top = ePos + "px";
                                }
                            //} //else {}
                        }
                        if(flag){Ul[0].ontouchmove = Ul[0].ontouchend = Ul[0].onmousemove = document.onmouseup = null;}
                    }
                    //事件完毕执行
                    function EndMove(e) {
                        //e.preventDefault();
                        //方向位移
                        var dirPos, ePos = setPos(e);
                        if (autoplay) {
                            auto.process();
                        }
                        if (X) {
                            dirPos = ePos[0] - sPos[0];
                            adjustPos(e);
                        } else {
                            dirPos = ePos[1] - sPos[1];
                            adjustPos(e);
                        }
                        //移动方向调整
                        function adjustPos() {
                            if (dirPos < -width/6) {
                                dirLeft();
                                //go.process(dirLeft);
                            } else {
                                if(dirPos < 0 && dirPos > -width/5){
                                    resetPos();
                                }else{
                                    if (dirPos > width/5) {
                                        dirRight();
                                        //go.process(dirRight);
                                    }else{
                                        resetPos();
                                    }   
                                }
                                
                            }
                        }
                        trig();
                        Ul[0].ontouchmove = Ul[0].ontouchend = Ul[0].onmousemove = document.onmouseup = null;
                    }
                }
                //获取touchend坐标
                function setPos(e) {
                    var pos = [];
                    pos[0] = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
                    pos[1] = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
                    return pos;
                }
            }
            var resetPos = function(){
                $Ul.animate({
                    left: [-(width * (cur - 1)),"easeOutQuad"]
                })
                if(c.cycle == 1){

                }else{

                }
            }
            //判断向右移动
            var dirRight = function() {
                    if (autoplay) {
                        auto.process();
                    }   
                    //无缝滚动
                    if (c.cycle == 1) {
                        if (cur != 1) {
                            r();
                            return false;
                        } else {
                            r();
                            //Li.eq(len - 1).css("left", -(width * len));
                            Li[len - 1].style.left = -(width * len) + "px";
                            Li[0].style.left = 0;
                            //Li[0].style.left = 0;
                            //Li.eq(0).css("left", 0);
                            return false;
                        }
                    } else {
                        if (cur != 1) {
                            r();
                            return false;
                        }else{
                            resetPos();
                        }
                    }
                };
            //向右移动
            function r() {
                if(flag){return}
                if (X) {
                    p.find(c.slideUl).animate({
                        left: [-(width * (cur - 2)), "easeOutQuad"]
                    }, c.timer, function() {
                        trig();
                        Ul[0].style.left = -(width * (cur - 1)) + "px";
                        //p.find(c.slideBox).find("ul").css("left", -(width * (cur - 1)));
                        Li[len - 1].style.left = 0;
                        //Li.eq(len - 1).css("left", 0);
                        flag = false;
                    })
                } else {
                    $Ul.animate({
                        top: -(height * (cur - 2))
                    }, c.timer, function() {
                        flag = false;
                    })
                }
                cur == 1 ? cur = len : cur--;
                flag = true;
                if(!c.touch || c.asyncLoad){
                    asyncLoad();
                }
                
            }
            //判断向左移动
            var dirLeft = function() {
                    if (c.autoplay == 1) {
                        auto.process();
                    }
                    if (c.cycle == 1) {
                        if (cur != len) {
                            l();
                            return false;
                        } else {
                            l();
                            Li[0].style.left = width * len + "px";
                            //Li.eq(0).css("left", width * len);
                            //p.find(c.slideBox).css("left", 0);
                            return false;
                        }
                    } else {
                        if (cur != len) {
                            l();
                            return false;
                        }else{
                            resetPos();
                        }
                    }
                };
            //向左移动
            function l() {
                if(flag){return}

                if (c.direction == "X") {
                    p.find(c.slideUl).animate({
                        left: [-(width * cur), "easeOutQuad"]
                    }, c.timer, function() {

                        trig();
                        Ul[0].style.left = -(width * (cur - 1));
                        //p.find(c.slideBox).find("ul").css("left", -(width * (cur - 1)));
                        Li[0].style.left = 0;
                        //Li.eq(0).css("left", 0);
                        flag = false;
                    })
                } else {
                    $Ul.animate({
                        top: -(height * cur)
                    }, c.timer, function(){
                        flag = false;
                    });
                }

                flag = true;
                cur == len ? cur = 1 : cur++;
                if(!c.touch || c.asyncLoad){
                    asyncLoad();
                }
            }
            //简单异步加载
            var asyncLoad = function(){
                try{
                    $Li.eq(cur - 1).find("img").attr("src", $Li.eq(cur - 1).find("img").attr("data-src")).removeAttr("data-src");
                }catch(e){
                    //alert(e);
                }
                
            }
            //执行移动
            var go = {
                timerid: null,
                //回调执行方法
                action: function(x) {
                    try{
                        x()
                    }catch(e){

                    }
                },
                //
                process: function(x) {
                    clearTimeout(this.timerid);
                    this.timerid = setTimeout(function() {
                        go.action(x)
                    }, 0)
                }
            };
            //如果可控
            function ctrl() {
                p.find(c.prev).click(function(x) {
                    if (c.cycle == 1) {
                        go.process(dirRight)
                    } else {
                        if (cur != 1) {
                            go.process(dirRight)
                        }
                    }
                });
                p.find(c.next).click(function(x) {
                    if (c.cycle == 1) {
                        go.process(dirLeft);
                    } else {
                        if (cur != len) {
                            go.process(dirLeft);
                        }
                    }
                })

            }
            
            //控制索引
            function trig() {

                var x = p.find(c.counter);
                if (x.length > 0) {
                    x.find("li").eq(cur - 1).addClass("cur").siblings().removeClass("cur");
                    //Li.eq(cur - 1).addClass("cur").siblings().removeClass("cur");
                }else{
                    if (c.cycle != 1) {
                        var B = p.find(c.prev),
                            A = p.find(c.next);
                        B.removeClass(c.disable);
                        A.removeClass(c.disable);
                        if(len == 1){
                            B.addClass(c.disable);
                            A.addClass(c.disable);
                            return;
                        }
                        if (cur == 1) {
                            B.addClass(c.disable);
                        } else {
                            if (cur == len) {
                                A.addClass(c.disable);
                            }
                        }
                    }
                }

            }
            //自动执行方法
            var auto = {
                timeoutId: null,
                //自动执行
                performProcessing: function() {
                    try{
                        dirLeft();
                    }catch(e){

                    }
                },
                process: function() {
                    clearInterval(this.timeoutId);
                    
                    this.timeoutId = setInterval(function() {
                            auto.performProcessing();
                        
                    }, 3000)
                },
                //中断执行
                dispose: function() {
                    clearInterval(this.timeoutId);
                    return;
                }
            };
            if (c.autoplay == 1) {
                auto.process();
            }
        };
        
        return N(defaults); 
    
    },
    //滚动加载方法，未做延迟载入，需要一个id="#load_placeholder"的标签在页面底部,书城简易版
    ScrollLoad: function(Fn){
        var placeholder = S.D("#load_placeholder");
        var flag = true;
        var timer = null;
        S.bind(window, "scroll", function(){
            if (window.pageYOffset < placeholder.offsetTop) {
                flag = true;
                placeholder.innerHTML = '<a href="#" class="btn gray-btn">向上滑动查看更多</a>';
                clearTimeout(timer);
            };
            //
            if(window.pageYOffset > placeholder.offsetTop){
                flag = false;
            }else{
                if(window.pageYOffset + window.innerHeight > placeholder.offsetTop - 2 && flag){
                    placeholder.innerHTML = '<a href="#" class="btn gray-btn">正在加载...</a>';
                    timer = setTimeout(function(){
                        if(Object.prototype.toString.call(Fn) === "[object Function]"){
                            Fn();
                            flag = false;
                        }
                    },100);
                }
            }
        })
    },
    //搜索框随机排序功能
    
    SearchPop: function(boxEl, subEl){
        var box = ST.D(boxEl);
        var a = ST.find(box,subEl);
        var randomColorArr = ["#da422c","#7340a1","#b9a419","#1e97a8","#258fbf","#c27317","#de5db5"];
        var arrTmp = [];
        var offline_html = document.createDocumentFragment();
        ST.each(a, function(i){
            var randomColor = parseInt(Math.random() * 7);
            a[i].style.color = randomColorArr[randomColor];
            arrTmp.push(a[i])
        })
        
        function showList(){
            box.innerHTML = "";
            arrTmp.sort(function(){return (Math.random()<0.5?1:-1)});
            for(var i =0,l = arrTmp.length; i < l; i++){
                offline_html.appendChild(arrTmp[i]);
            }
            box.appendChild(offline_html);
            box.style.display = "block";
        }
        showList();
            
    },
    //搜索框异步获取数据随机排序功能
    Shake: function(Fn){
        // ST.DeviceMotionEvent(getData);
        // function getData(){
            ST.D("#hotSearch").innerHTML = "<img width='9' height='9' src='images/loading.gif' style='vertical-align:middle;' /> 正在加载";
            $.get("data/search_data.json", function(data){
                var data = data;
                var list = data.data.wordList;
                var tmpHtml = "";
                for(var i = 0, l = list.length; i < list.length; i++){
                    //客户端原生实现触摸监听事件,不需要加链接
                    tmpHtml += "<a href='#'>" + list[i] + "</a>" 
                }
                ST.D("#hotSearch").innerHTML = tmpHtml;
                ST.Widget.SearchPop("#hotSearch","a");
                if(Object.prototype.toString.call(Fn) === "[object Function]"){
                    Fn();
                }
            });
        // }  
    },
    removeDockBook: function(){
        var book = ST.D('#MyBook');
        var _book = ST.find(book, "li");
        var editBtn = ST.D('#edit-mybook');
        var _close = ST.find(book, '.top-close');
        ST.bind(editBtn, 'click', function(){
            ST.each(_book, function(i){
                _book[i].className = 'wobble';
                ST.bind(_close[i], 'click', function(){
                    _book[i].className = _book[i].className + ' hide';
                    _book[i].hide();
                    if(_book[i].parentNode.querySelectorAll('li.hide').length >= 1){
                        if(_book[i].parentNode.querySelectorAll('li.hide').length == _book[i].parentNode.querySelectorAll('li').length){
                            _book[i].parentNode.parentNode.removeChild(_book[i].parentNode);
                        }
                        $(_book[i].parentNode).append($(_book[i]).parent().next().find("li:visible").eq(0)); 
                    }
                    $('.book-floor').each(function(){
                        if($(this).find('li:visible').length < 3){
                           $(this).append($(this).next().find("li").eq(0));
                           $('.book-floor').each(function(){
                                if($(this).find('li:visible').length < 3){
                                   $(this).append($(this).next().find("li").eq(0));
                                }
                                if($(this).find('li:visible').length == 0){
                                    $(this).remove();
                                }
                            })
                        }
                        if($(this).find('li:visible').length == 0){
                            $(this).remove();
                        }
                    })
                    return false;
                })
            });
            
            // ST.bind(_close, 'click', function(){
            // ST.each(_close, function(i){

            // });  
            // });
        });
        // ST.each(_book, function(i){
        //     ST.bind(_book[i], 'click', function(){
        //         this.className = 'wobble'
        //     })
        // })

    },
    //a simple tab
    Touch_tab: function(settings){
        function Tabs(settings){
            this.settings = settings || {};
            this.trigger = this.settings.trigger || "#fl_tab";
            this.triggerEl = this.settings.triggerEl || "a";
            this.box = this.settings.box || "#tab_box";
            this.boxEl = this.settings.boxEl || "ul";
            this.Fn = this.settings.Fn || function(){};
            //
            this.init();
        }
        Tabs.prototype = {
            init: function(){
                this.bind();
            },
            bind: function(){
                var that = this;
                var ctrlBox = ST.D(this.trigger);
                var ctrlEl = ST.find(ctrlBox, this.triggerEl);
                var contentBox = ST.find(ST.D(this.box), this.boxEl)
                ST.each(ctrlEl, function(i){
                   ST.bind(ctrlEl[i], "click", function(){
                        var _this = this;
                        ST.each(ctrlEl, function(k){
                            if(k == i){
                                _this.className += " cur";
                                contentBox[i].show();
                            }else{
                                ctrlEl[k].className = "";
                                contentBox[k].hide();
                            }
                        });
                        // ST.D(that.box).css({
                        //     left: -320*i + "px"
                        // });
                        
                        that.Fn(i);
                    }) 
                })
            }
        }
        return new Tabs(settings);
    }

});


/* @author 13011924*/
ST.tabHandle = function(opt,callback){ //tab
    var def = {
        event: "click",
        wrap: "",
        tabWrap: "",
        class:"cur"

    };
    $.extend(def, opt);
    $(def.wrap).bind(def.event, function(){
        var $this = $(this),
            index = $this.index();
        $this.addClass(def.class).siblings().removeClass(def.class);
        $(def.tabWrap).eq(index).show().siblings(def.tabWrap).hide();
        if(callback && typeof(callback) === "function") {
            callback(this);
        }
    });
}
/* 弹出层*/
ST.PopupBox = function(opts){
    function Popup(opts){
        this.box = $(opts.box) || "";
        this.title = opts.title || "";
        this.type = opts.type || "default";
        this.init();
    }
    Popup.prototype = {
        init: function(){
            var html,arr,mask,self = this;
            switch(self.type){
                case "default" :
                        html =  self.getAlertHtml(self.box.html());
                        mask = self.getMask();
                        $("body").append(mask);
                        break;
                case "mini" :
                        html =  self.getAlertMinHtml(self.title);
                        break;

            }
                arr = self.getPos(html);
                $("body").append(html);
                html.css({width: arr[0] - (40*2)+"px" , top: (arr[2] + window.innerHeight/2 - html.height()/2) + "px"});
                self.type == "mini" &&  self.removeMini(html);
        },
        getAlertHtml: function(data){
            var html = '<div class="popup-box" id="popup"><div class="popup-title">'+this.title+'</div>' +
                ' <div class="popup-content">'+data+' </div></div> ';
            return $(html);

        },
        getAlertMinHtml:function(data){
            var html = '<div class="alertBox" >'+data+'</div>';
            return $(html);
        },
        getPos: function(){
            var w = document.documentElement.offsetWidth || document.body.offsetWidth,
                h = document.documentElement.offsetHeight || document.body.offsetHeight,
                s = document.documentElement.scrollTop || document.body.scrollTop;
            if(window.innerHeight > h){
                h = window.innerHeight;
            }
            return [w,h,s];
        },
        getMask: function(){
            var self = this,
                w = self.getPos()[0],
                h = self.getPos()[1],
                mask = document.createElement("div");
            mask.id = "tMask";
            mask.style.cssText = "position:absolute;left:0;top:0;width:"+ w +"px;height:" + h + "px;background:rgba(0,0,0,0.3);z-index:2";
            return $(mask);

        },
        removeMini: function(obj){
            setTimeout(function(){
                obj.fadeOut(500, function(){
                  //  obj.remove();
                });
            },2000);
        }
    }
    new Popup(opts);
}









