define(function(require, exports, module) {

    var commentTemplate = require('tmpl/home/comment.html'),
         commentCollection = require('js/collections/comment'),
     commentView = Backbone.View.extend({
         el: $("#comment"),
         initialize: function(){
         	this.collection = new commentCollection();
         },
         render: function() {
               var data = { data: this.collection.toJSON() };

             this.$el.html(Mustache.render(commentTemplate, data)); 
         }
     });
     
    return new commentView;
});