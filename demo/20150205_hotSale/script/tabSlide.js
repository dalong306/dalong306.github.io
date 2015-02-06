;(function(root, factory, d){
    if(typeof module !== "undefined" && module.exports){
    	module.exports = factory(root, d);
    }else if(typeof define === "function" && defined.amd){
    	define(factory(root,d));
    }else{
    	root.tabSlide = factory.call(root, root, d);
    }
})(this, function(w, d){
	"use strict";
	 function Slide(opts){

           if(!(this instanceof Slide)){
           	   return new Slide(opts).init();
           }
           this.opts = opts || {};
           this.tab = this.opts.el || d.querySelector(".tab");
           this.callback = this.opts.callback || "";

	 }
	  Slide.prototype = {
	    	  constructor: Slide,
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
	                self.scrolling = undefined;//是否滚动状态
	                self.moveDis = 0;
	                self.wW = w.innerWidth;
	                self.k = -1;
	                self.n = Math.floor(self.wW / self.liW);//li一屏个数
	                self.ulW =  self.len * self.liW ;
	                self.wVal = self.wW - self.ulW;//差值宽度
	                self.tab.addEventListener("touchstart", this, false);
	                self.ul.style.width = self.ulW + "px";
	                self.setTransform(this.moveDis);
	                setTimeout(scrollTo,0,0, 0);
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
	            setTransform: function(m, s){
	                 var self = this;
	                     self.ul.style.webkitTransform = "translateX("+ m + "px)";
	                     self.ul.style.webkitTransitionDuration = s + "ms";
	            },
	           	 curCss: function(o, i){
                       var self = this;
                           [].forEach.call(o, function(item){
                                     item.className = "";
                           });
                           o[i].className = "cur";
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
	                          self.clickOption(index);

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
	           clickOption: function(index){
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
	           	         self.callback && typeof self.callback === "function" && self.callback(index);
	           }
            }
	 return Slide;
}, document);