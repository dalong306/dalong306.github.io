;(function(W, M, D){
   		/*
		*设置fontSize
		 */
		 M.setFontSize();
		 var timer = null;
		 window.addEventListener("resize", function(){
               clearTimeout(timer);
               timer = setTimeout(function(){
               	   M.setFontSize();
               }, 300);
		 });


	$(function(){
		
		/*
		*tab滑动
		 */
       try{
       	    tabSlide({
       	    	el: M.getEL(D, ".sale-tab")[0],
       	    	callback: function(index){

       	    		M.setCur(M.getEL(D, ".sale-count"), index);

       	   		 }
       			});

       }catch(e){
       	   console.log(e.message);
       }
       /*
		* tab切
		*/
     		document.addEventListener("click", function(e){
     			
     			if(e.target.className === "sale-text"){
     				  var index = $(e.target.parentNode).index();
                        M.setCur(M.getEL($(e.target).parents("ul")[0], "li"), index, "cur");
                        M.setCur(M.getEL($(e.target).parents(".sale-count")[0], ".sale-son-count"), index);
     			}
     		}, false);
       	    

       
       	/*
		*图片懒加载
		*/
       try{

	       	lazyload(".sale-son-count");
       }catch(e){
       	   console.log(e.message);
       }
       

       /*
	   *加载列表更多
	    */
	   function loadMoreList(){
	        var h = M.getDocH(),
	           iH = window.innerHeight;
	             if( window.pageYOffset + iH >= h){
	                  $.ajax({
	                    url: "data/lianban.html",
	                    type: "get",
	                    beforeSend: function(){

	                          $("#loadMore").show();     
	                    },
	                    success: function(data){
	                          //正在加载
	                            // $(".sn-active-list").append(data);
	                            // $("#loadMore").hide();  
	                           //暂无数据
	                           //$("#noData").show(); 
	                            // 已经看完了
	                           // $("#noMore").show(); 
	                           //window.removeEventListener("scroll", loadMoreList, false);//
	                    }
	                  });
	             }else{
	               
	             }
	   }
	  
	   window.addEventListener("scroll", loadMoreList, false);
      
	});

})(this, {
		minWidth: 320,
		maxWidth: 640,
		baseFontSize: 16,
		getEL: function(sup, el){
			return sup.querySelectorAll(el);
		},
		getDocH: function(){
			return document.documentElement.offsetHeight || document.body.offsetHeight;
		},
		getScreenW: function(){
			var newWidth = Math.min(window.innerWidth, document.documentElement.offsetWidth);
			return  newWidth > this.maxWidth ? this.maxWidth : newWidth ;
		},
		setFontSize: function(){
            document.documentElement.style.fontSize = (this.getScreenW() / this.minWidth) * this.baseFontSize + "px";
		},
		setCur: function(el, index, cls){
			  [].forEach.call(el, function(item){
					!cls ? (item.style.display = "none") : (item.className = "");
			  }); 
			 !cls ? (el[index].style.display = "block") : (el[index].className = cls);  
		}
}, document);