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

           if(_length > 1){
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
                        self.liW = self.li[0].offsetWidth;
                        self.len = self.li.length;
                        self.ulW = self.len * self.liW;
                        self.current = 0;//标识符判断向左向右方向
                        self.scrollY = 0;//滚动判断向上向下方向 
                        self.scrolling = undefined;//是否滚动状态
                        self.moveDis = 0;
                        self.wW = w.innerWidth;
                        self.k = -1;
                        self.n = Math.floor(self.wW / self.liW),//li一屏个数
                        self.wVal = self.wW - self.ulW;//差值宽度
                        this.fixedOption();//固定层方法
                        this.tab.addEventListener("touchstart", this, false);
                        self.ul.style.width = self.ulW + "px";
                        self.setTransform(this.moveDis);
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
                    // e.preventDefault();
                          var self = this;
                              self.tab.addEventListener("touchmove", this, false);
                              self.tab.addEventListener("touchend", this, false);
                              self.x = self.getPos(e, "pageX");
                              self.y = self.getPos(e, "pageY");
                              self.isMove = false;//是否移动
                              self.moveReady = false;
                              self.scrolling = undefined;
                   },
                   touchmove: function(e){
                          e.preventDefault();
                          var self = this;
                              self.px = self.getPos(e, "pageX");
                              self.py = self.getPos(e, "pageY");
                              self.dx = self.x - self.px;
                              self.dy = self.y - self.py;

                               //判断X,Y方向
                              if(typeof self.scrolling == "undefined"){
                                   self.scrolling = !! (self.scrolling || Math.abs(self.dx) < Math.abs(self.dy));
                              }
                              if(self.scrolling) return;
                              self.isMove = true;
                              //移动距离
                              self.dx = self.dx > 0 ? - Math.abs(self.dx) + self.moveDis: Math.abs(self.dx) + self.moveDis;
                             //判断最小值 与最大值 
                              self.moveReady = self.dx > 0 || self.dx < self.wVal ? true : false;
                              self.setTransform(self.dx, 0)
                           
                         
                   },
                   touchend: function(e){
                      var self = this;
                          if(self.scrolling) return;
                          if(!self.isMove){//点击触发操作
                             e.preventDefault();
                                  var index = Math.floor((self.x + Math.abs(self.moveDis)) / self.liW);
                                  self.itemOption(index);
                                  //奇偶高度值定位
                                  setTimeout(scrollTo, 0, 0, 
                                    index * self.floorEvenH + (Math.floor(index/2) 
                                      * (self.floorOddH - self.floorEvenH)) + self.tabTop + 2 );

                          }else{
                                self.moveDis = self.dx;
                                if(self.moveReady){//移动到左边极限与右边极限回归位置
                                    self.moveDis = self.moveDis > 0 ? 0 : self.moveDis < self.wVal ? self.wVal : self.moveDis;
                                    self.setTransform(self.moveDis, 350)
                                }   
                          }
                          self.tab.removeEventListener("touchmove", this, false);
                          self.tab.removeEventListener("touchend", this, false);
                        
                   },
                   itemOption: function(index){
                              var self = this;
                                  self.li[index].className = "cur";
                                  self.sibling(self.li[index].parentNode.firstChild,self.li[index]).forEach(function(item){
                                          item.className = "";
                                      });
                                    
                                  //宽度小于浏览器宽度不执行操作
                                   if(self.ulW < self.wW ) return;

                                   if(index < self.n - 1){//向左点击第一排数值固定不动

                                      self.moveDis = 0;

                                   }else if( index > self.len- self.n - 1 && index > self.current ){//向右点击最后一排数值固定不动
                                      
                                      self.moveDis = self.wVal;

                                   }else if(  index < self.current ){//向左点击

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
                  //滚动到指定位置选中tab切索引
                  checkTabCur: function(){
                        var self = this,
                            body = self.getEl(d, "body"),
                            tabH = self.tab.offsetHeight,
                            index = 0,
                            floorH,
                            sY = w.scrollY;
                            self.tabTop = $(".ac-top-box").height() + 44;

                            self.floorEvenH = self.floor[0].offsetHeight;//偈数高度
                            self.floorOddH = self.floor[1].offsetHeight;//奇数高度
                          
                         //置顶初始化
                          if(sY < self.tabTop){
                                index = 0;
                          }else{
                                //将大小高度看成一个整体
                                floorH = self.floorEvenH + self.floorOddH;
                                index = Math.floor((sY - self.tabTop) / floorH) * 2  + 
                                ((sY - self.tabTop) % floorH > self.floorEvenH ? 1 : 0);
                              
                                if(index < 0 || index > self.len - 1) return;
                                //判断滚动向上还是向下 self.scrollY > 0 向右点击 < 0 向左点击
                                self.scrollY = sY - self.scrollY;
                                self.current = self.scrollY > 0 ? index - 1: index == self.len - 1 ? index : index + 1;
                          }
                          
                          self.itemOption(index);
                          self.scrollY = sY;
                 
                  },
                  setTransform: function(m, s){
                       var self = this;
                            self.ul.style.webkitTransform = "translateX("+ m + "px)";
                            self.ul.style.webkitTransitionDuration = s + "ms";

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
                        
                        if(!self.supportSticky()){
                            self.check()
                            window.addEventListener("scroll", function(e) {
                                self.check();
                            });
                            window.addEventListener("orientationchange", function(e) {
                                self.check()
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
                      h = self.tabTop;
                      //锚点定位
                      w.scrollY > h ? $(".ac-space").css({"height": 42+ "px","display": "block"}) : $(".ac-space").css({"display": "none"}) ;
                      self.tab.style.cssText =  w.scrollY > h ? "position:fixed;top:0;left:0;right:0;zIndex:998;" : "position:static;";
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
  })(".ac-floor,.ac-img");
    
   //文档高度与滚动距离
    M.scrollArg = function(){
        return {
            docH: d.documentElement.offsetHeight || d.body.offsetHeight,
            scrollTop: w.pageYOffset || d.documentElement.scrollTop
        }
    }

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
          console.log(e.message);
           M.expandOption();
        }catch(e){
        }


      try{
            M.slideTab();
        }catch(e){
          console.log(e.message);
        }


      
            
        

        
      
 

         
  });

 })(window, document, Zepto, window.Active = window.Active || {});

 

