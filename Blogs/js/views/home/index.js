define(function(require, exports, module) {

    var indexTemplate = require('tmpl/home/index.htm'),
     indexView = Backbone.View.extend({
         el: $("#page"),
         render: function() {
             this.$el.html(indexTemplate);
         }
     });
     
     
     

    return new indexView;
});