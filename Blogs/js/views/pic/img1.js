define(function(require, exports, module) {

    var img1Template = require('tmpl/pic/img1.htm'),
        picsCollection = require('js/collections/pics'),

     img1View = Backbone.View.extend({//������ͼ��
         el: "#page",
         initialize: function() {
             this.collection = new picsCollection;
         },
         render: function() {

             var data = { data: this.collection.toJSON() };//�õ��������json����

             this.$el.html(Mustache.render(img1Template, data)); //Mustacheģ����Ⱦ
         },
         events: {
             "click img": "imgSay"//ί���¼�ִ����Ӧ����
         },
         imgSay: function(e) {
             alert($(e.target).siblings().css("border-color", "#fff").end()
                        .css("border-color", "red").attr("info_data") || 'nothing');
         }
     });
    return new img1View;
});