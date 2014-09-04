define(function(require, exports, module) {

    var img1Template = require('tmpl/pic/img1.htm'),
        picsCollection = require('js/collections/pics'),

     img1View = Backbone.View.extend({//创建视图类
         el: "#page",
         initialize: function() {
             this.collection = new picsCollection;
         },
         render: function() {

             var data = { data: this.collection.toJSON() };//得到集合类的json数据

             this.$el.html(Mustache.render(img1Template, data)); //Mustache模版渲染
         },
         events: {
             "click img": "imgSay"//委托事件执行相应函数
         },
         imgSay: function(e) {
             alert($(e.target).siblings().css("border-color", "#fff").end()
                        .css("border-color", "red").attr("info_data") || 'nothing');
         }
     });
    return new img1View;
});