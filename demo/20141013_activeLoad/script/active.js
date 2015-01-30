/* 
 * @Author: 13011924
 * @Date:   2014-10-13
 * @Update: 2014-10-13
 */
 (function(w, d, $, M){
    M.getEl = function(p, el){
      return p.querySelectorAll(el);
    }
   /*
    *列表title展开收起
    */
    M.expandOption = function(){
          var self = this,
              wrap = self.getEl(d, ".ac-instroduce")[0],
              em =  self.getEl(wrap, "em")[0],
              i = self.getEl(wrap, "i")[0],
              emH = em.offsetHeight;
           if(emH <= 36) return;
           i.style.display = "block";
           em.style.width = "95%";
           i.onclick = function(){
              $(i).toggleClass("arrow-up")
              .parent().toggleClass("max-auto");

           }

         }
    /*
    *首页焦点图
    */
   M.flashSlide = (function(){
           var trigger = $("#J_index_slide").find(".index-slide-trigger"),
              li = trigger.find("li"),
              _length = li.length;
           if(_length >= 1){
               trigger.css("marginLeft", -(trigger.width() / 2) + "px");
               $(".slide_ul").find("img")[0].onload = function(){
                  $("#J_index_slide").find(".index-slide-box").css("height",$(this).height()+"px");
              }

            var mySwipe = Swipe(document.getElementById('mySwipe'), {
                speed: 400,
                auto: 5000,
                callback: function(index, elem) {
                  if(_length == 2){
                    index = index%2;
                  }
                   
                  $(elem).find("img").attr("data-src") && $(elem).find("img").attr("src", $(elem).find("img").attr("data-src"));
                  $("#J_index_slide").find(".index-slide-trigger").find("li").eq(index).addClass("cur").siblings().removeClass("cur");
                  
     


                }
              });
        }
   })();

    /*
    *tab切option
    */

    M.slideTab = function(opts){
               function Tab(opts){
                    this.opts = opts || {};
                    this.tab = this.opts.el || d.querySelector(".ac-tab");
                    this.tabBox = this.opts.el || d.querySelector(".ac-tab-box");
                    this.floor = this.opts.floor || d.querySelectorAll(".ac-floor");
               }

               Tab.prototype = {
                   constructor: Tab,
                   getEl: function(supEl, el){
                       return supEl.querySelectorAll(el);
                    },
                   init: function(){
                     var self = this;
                        self.ul = self.tab.querySelector("ul");
                        self.li = self.ul.querySelectorAll("li");
                        self.len = self.li.length;
                        if(!self.len) return;
                        self.liW = self.li[0].offsetWidth;
                        self.current = 0;//标识符判断向左向右方向
                        self.scrollY = 0;//滚动判断向上向下方向 
                        self.scrolling = undefined;//是否滚动状态
                        self.moveDis = 0;
                        self.wW = w.innerWidth;
                        self.k = -1;
                        self.n = Math.floor(self.wW / self.liW),//li一屏个数
                        self.ulW = self.n >= self.len ? self.len * self.liW : self.len * self.liW + 50;
                        self.wVal = self.wW - self.ulW;//差值宽度
                        self.appNav = self.getEl(d, ".sn-nav")[0] !== undefined ? self.getEl(d, ".sn-nav")[0].offsetHeight : 0;//nav高度
                        self.fixedOption();//固定层方法
                        self.tab.addEventListener("touchstart", this, false);
                        self.arrOffsetTop(); //记录索引offsetTop值 
                        self.ul.style.width = self.ulW + "px";
                        self.setTransform(this.moveDis);
                        setTimeout(scrollTo,0,0, 0);
                        self.extendList();

                   },
                   handleEvent: function(e){
                      var self =  this;
                      switch(e.type){
                        case "touchstart":
                              self.touchstart(e);
                              break;
                        case "touchmove":
                              self.touchmove(e);
                              break;
                        case "touchend":
                              self.touchend(e);
                              break;
                      }
                   },
                   getPos: function(e, t){
                        return e.changedTouches ? e.changedTouches[0][t] : e[t];
                    },
                   touchstart: function(e){
                          var self = this;
                              self.tab.addEventListener("touchmove", this, false);
                              self.tab.addEventListener("touchend", this, false);
                              self.x = self.getPos(e, "pageX");
                              self.y = self.getPos(e, "pageY");
                              self.baseX = self.x;
                              self.isMove = false;//是否滑动
                              self.moveReady = false;
                              self.scrolling = undefined;
                   },
                   touchmove: function(e){
                          var self = this;
                              self.px = self.getPos(e, "pageX");
                              self.py = self.getPos(e, "pageY");
                              self.dx = self.px - self.baseX;
                              self.dy = self.py - self.y;
                              //判断X,Y方向,Y方向滚动阻止移动tab操作
                              if(typeof self.scrolling == "undefined"){
                                   self.scrolling = !! (self.scrolling || Math.abs(self.px-self.x) < Math.abs(self.dy));
                              }
                              if(self.scrolling) return;
                              e.preventDefault();
                              self.isMove = true;
                              if(self.ulW <= self.wW)  return;
                              //滑动方向
                              self.direction = self.dx > 0 ? 1: -1 ;
                              //滑动距离
                              if(self.moveDis >= 0 || self.moveDis <= self.wVal){
                                  //滑动临界值减小
                                   self.dx = Math.round(self.direction * Math.abs(self.dx)  / 3 + self.moveDis);
                              }else{
                                   self.dx = self.direction * Math.abs(self.dx) + self.moveDis;
                              }
                             
                              //记录滑动的值
                              self.moveDis = self.dx;
                              //判断最小值与最大值 
                              self.moveReady = self.moveDis >= 0 || self.moveDis <= self.wVal ? true : false;
                              self.setTransform(self.moveDis, 0);
                              //记录滑动的差值
                              self.baseX = self.px;

                           
                         
                   },
                   touchend: function(e){
                      var self = this;
                          if(self.scrolling) return;
                          if(!self.isMove){//点击触发操作
                                  e.preventDefault();
                                  var index = Math.floor((self.x + Math.abs(self.moveDis)) / self.liW);
                                  self.itemOption(index);
                                   //索引定位 
                                  setTimeout(scrollTo,0,0, self.eachIndex(index) - 42);

                          }else{
                                if(self.ulW <= self.wW)  return;
                                 //避免滑动太僵硬
                                if(!self.moveReady){
                                 //滑动距离/li宽度取到索引
                                  var point = self.direction > 0 ? Math.floor(-self.moveDis / self.liW) : Math.ceil(-self.moveDis / self.liW);
                                      self.moveDis = - point  * self.liW;
                                }  
                                //滑动临界值结束回归位置
                                 self.moveDis = self.moveDis > 0 ? 0 : self.moveDis < self.wVal ? self.wVal : self.moveDis;
                                 self.setTransform(self.moveDis, 350);
                          }
                          self.tab.removeEventListener("touchmove", this, false);
                          self.tab.removeEventListener("touchend", this, false);
                        
                   },
                   eachIndex: function(index){
                        var self = this,
                            n;
                        for(var i = 0, len =self.arr.length ; i < len; i++){
                            if(i == index){
                              n = self.arr[i];
                              break;
                            }
                        }
                        return n;
                   },
                   arrOffsetTop: function(){
                       
                         var self = this;
                            self.arr = [];
                            for(var i = 0, len = self.getEl(d, ".ac-floor").length; i < len;i++){
                               self.arr.push(self.getEl(d, ".ac-floor")[i].offsetTop);
                            }

                   },
                   itemOption: function(index){
                              var self = this;
                                  self.curCss(self.li, index);
                                    
                                  //宽度小于浏览器宽度不执行操作
                                   if(self.ulW <= self.wW ) return;
                                   
                                   if(index == 0){
                                      self.moveDis = 0;

                                   }else if(index == self.len - 1){
                                      self.moveDis = self.wVal;

                                   }else if(index < self.current ){//向左点击

                                      var s = self.wVal + (self.len-index-2) * self.liW + self.liW/2;
                                      s = s > 0 ? 0: s;
                                      self.moveDis = s;

                                   }else{//向右点击
                                       var s = self.k * index * self.liW + self.liW/2;
                                       s = s > self.wVal ? s : self.wVal;
                                       self.moveDis = s;

                                   }
                                   //赋值比较点击方向 index > current 向右 < 向左
                                    self.current = index;
                                    self.setTransform(self.moveDis, 350);
                                

                   },
                   //获取高度值
                   getTopHeight: function(){
                      var self = this;
                          self.appH = !self.appH ? ( (self.getEl(d, ".detail-fi-xed")[0] !== undefined && $(".detail-fi-xed").is(":visible")) ? self.getEl(d, ".detail-fi-xed")[0].offsetHeight : 0) : self.appH;//融合框高度  
                          self.topH = $(".ac-top-box")[0] !== undefined ? $(".ac-top-box").height() : 0;
                          return {
                              appH : self.appH,
                              topH: self.topH
                          }
                   },
                  //滚动到指定位置选中tab切索引
                  checkTabCur: function(){
                        var self = this,
                            body = self.getEl(d, "body"),
                            tabH = self.tab.offsetHeight,
                            index = 0,
                            floorH,
                            sY = w.scrollY;
                            self.arrOffsetTop(); 
                         //置顶初始化
                          if(sY <= self.arr[0] - 42){
                                index = 0;
                          }else if(sY + window.innerHeight >= M.scrollArg().docH ){
                                index = self.arr.length - 1;
                          }else{
                                 //索引top值对比取索引
                                 for(var i = 0, len = self.arr.length; i < len;i++){
                                       if(sY >= self.arr[i] - 42 && sY < self.arr[i+1] - 42 && i+1 < self.arr.length){
                                             index = i;
                                             break;                                            
                                       }else{
                                            index = self.arr.length - 1;
                                       }

                                  }

                                if(index < 0 || index > self.len - 1) return;
                                //判断滚动向上还是向下 self.scrollY > 0 向右点击 < 0 向左点击
                                self.scrollY = sY - self.scrollY;
                                self.current = self.scrollY > 0 ? index == 0 ? 0 : index - 1 : index == self.len - 1 ? index : index + 1;
                          }
                          self.itemOption(index);
                          self.scrollY = sY;
                 
                  },
                  setTransform: function(m, s){
                       var self = this;
                           self.ul.style.webkitTransform = "translateX("+ m + "px)";
                           self.ul.style.webkitTransitionDuration = s + "ms";
                  },
                  curCss: function(o, i){
                       var self = this;
                           o[i].className = "cur";
                            self.sibling(o[i].parentNode.firstChild,o[i]).forEach(function(item){
                                        item.className = "";
                              });

                  },
                  sibling: function( n, elem ) {
                    var matched = [];
                    for ( ; n; n = n.nextSibling ) {
                        if ( n.nodeType === 1 && n !== elem ) {
                            matched.push( n );
                        }
                    }
                    return matched;
                 },
                 fixedOption: function(){
                    var self = this;
                        ios6 = navigator.userAgent.match(/(iPhone\sOS)\s([\d_]+)/);
                        version = ios6 ? ios6[2].split("_")[0] : 7;
                        if(!self.supportSticky() || (ios6 && version < 7)  ){
                            self.check()
                            window.addEventListener("scroll", function(e) {
                                self.check();
                            });
                            window.addEventListener("orientationchange", function(e) {
                                self.check();
                            });
                        } 
                          window.addEventListener("scroll", function(e) {
                                self.checkTabCur();
                          });
                 },
               //检测是否支持属性
                supportSticky: function(){
                    var e = document.createElement("i"),
                        n = "-webkit-sticky";
                        e.style.position = n;
                        var t = e.style.position;
                        e = null;
                        return t === n
                },
                //滚动操作
                check: function(){

                  var self = this,
                      h = self.getTopHeight().topH + self.appNav + self.getTopHeight().appH;
                      //锚点定位
                      w.scrollY > h ? $(".ac-space").css({"height": 42+ "px","display": "block"}) : $(".ac-space").css({"display": "none"}) ;
                      self.tabBox.style.cssText =  w.scrollY > h ? "position:fixed!important;left:0;width:100%;" : "position:relative;";
                },
                //展开右侧tab列表功能
                extendList:function(){
                  
                  var self = this,
                      acTab = $(".ac-tab"),
                      acRight = $(".ac-right"),
                      acRightBox = $(".ac-right-box"),
                      acRightList = $(".ac-right-list");
                      self.n >= self.len && acRight.hide();

                    
                      acRight.on("click", function(){
                           self.curCss(acRightList.find("li"), acTab.find("li.cur").index());
                           self.boxShow();
                         //  self.verticalSilder();
                         

                           
                      });

                      acRightBox.on("click", function(){
                          self.boxHide();
                      })

                      acRightList.on("click", function(e){
                         e.stopPropagation();

                      }).find("li").on("click", function(){

                          var index = $(this).index();
                           self.boxHide();
                           self.itemOption(index);
                           setTimeout(scrollTo,0,0, self.eachIndex(index) - 42);
                    });

                   

                },
                eventMove: function(e){
                     e.preventDefault();
                },
                boxShow: function(){
                    var self = this;
                    $(".ac-right-box").height(w.innerHeight+"px").show();
                    $(".ac-right-mask").show();
                    $("body").on("touchmove",self.eventMove);
                },
                boxHide: function(){
                    var self = this;
                    $(".ac-right-list").removeAttr("style");
                    $(".ac-right-box").hide();
                   $(".ac-right-mask").hide();
                    $("body").off("touchmove",self.eventMove);
                     
                },
               //右侧竖向滑屏
                verticalSilder: function(){

                  if($(".ac-right-box")[0] == undefined) return;
                  $(".ac-right-box").each(function(){
                    var self = $(this),
                        startX,
                        startY,
                        moveX, 
                        moveX,
                        dx = 0,//标记移动距离
                        dis = 0,//标记距离
                        scrolling = undefined,//是否滚动状态
                        h = window.innerHeight,
                        wrap = self.find("ul"),
                        hA = wrap.find("li").height(),//li height
                        len = wrap.find("li").length,
                        wrapH = len * hA ;//ul width
                        wrap.height(wrapH+ "px");

                        wrap.off("touchstart", touchstart);
                        wrap.off("touchmove", touchmove);
                        wrap.off("touchend", touchend);

                        wrap.on("touchstart", touchstart);
                        wrap.on("touchmove", touchmove);
                        wrap.on("touchend", touchend);
                          function touchstart(e){
                                    if(wrapH <= h) return;
                                    startX = e.touches[0].pageX;
                                    startY = e.touches[0].pageY;
                                    scrolling = undefined;
                         }
                         function touchmove(e){
                                    e.preventDefault();
                                    e.stopPropagation();
                                    moveX = e.touches[0].pageX;
                                    moveY = e.touches[0].pageY;
                                    var x = startX - moveX,
                                        y = startY - moveY;
                                    dx >= 0 && (dis = 0);
                                    dx <= (h - wrapH) && (dis = h - wrapH);
                                    y = y / ((dx >= 0 || dx <= (h - wrapH)) ? (Math.abs(y) / h + 2) : 1);//增加阻力
                                    dx = (y > 0 ? -1 : 1) * Math.abs(y) + dis;//x > 0方向
                                    setTransform(this, dx, 0);
                         }
                         function touchend(e){
                                   if(dx >= 0){
                                      dis = 0;
                                      setTransform(this, dis, 350);
                                   }else if(dx <= h-wrapH){
                                     dis = h-wrapH;
                                      setTransform(this, dis, 350);
                                   }else{
                                         dis = dx;
                                   }
                         }

                         function setTransform(el, m, s){
                                  el.style.webkitTransform = "translate3d(0px, "+ m + "px,  0px)";
                                  el.style.webkitTransitionDuration = s + "ms";
                            }
                    });
                    


                     
                }


             }

           new Tab(opts).init();

    };
     /*
    *图片懒加载
    */
    M.lazyload = (function(el){
              if(!document.querySelector(el)){return;}
              var delay = null;
              $(el).find("img").each(function(){

                   var _this = $(this)[0];
                   this.onerror = function(){
                      this.src = "http://script.suning.cn/images/ShoppingArea/Common/blank.gif";
                    }

                  if($(this).offset().top < window.innerHeight){
                              _this.src = _this.getAttribute("data-src");
                              _this.setAttribute("data-src","done");
                          }
                      });
                      window.addEventListener("scroll", function(){
                          delay = setTimeout(function(){
                              $(el).find("img").each(function(){
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
                         
                                      _this.src = _this.getAttribute("data-src");
                                      _this.setAttribute("data-src","done");
                                  }
                                  })
                          },300);
      }, false)
  })(".ac-floor");
    
   //文档高度与滚动距离
    M.scrollArg = function(){
        return {
            docH: d.documentElement.offsetHeight || d.body.offsetHeight,
            scrollTop: w.pageYOffset || d.documentElement.scrollTop
        }
    }
  //加载更多
    M.listLoadMore = function(){
       window.addEventListener("scroll", scrollMore, false);

       function scrollMore(){
                 var scrollArg = M.scrollArg(),
                     docH = scrollArg.docH,
                     scrollTop = scrollArg.scrollTop;
                  if((scrollTop + w.innerHeight) >= docH - 45){
                         $.ajax({
                              url: "../data/list.html",
                              type: "get", 
                              beforeSend:function(){
                                  $("#ac-btn").find(".ac-btn").removeClass().addClass("ac-btn ac-btn-b").html("正在加载");
                               },
                               success: function(data){
                                  $("#ac-list").append(data);  
                                 // 加载结束操作
                                 // $("#ac-btn").find(".ac-btn").removeClass().addClass("ac-btn ac-btn-c").html("已经看完了");
                                 //window.removeEventListener("scroll", scrollMore, false);//
                               },
                               error: function(data){
                                 
                               }
                             });
              }
       }
       

    }




  $(function(){
        
        try{
           M.expandOption();
        }catch(e){
          console.log(e.message);
        }


       try{
            M.slideTab();
       }catch(e){
         console.log(e.message);
        }


         
  });

 })(window, document, Zepto, window.Active = window.Active || {});

 

