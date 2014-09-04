define(function(require, exports, module) {

    var picModel = require('../models/pic'),

     picsCollection = Backbone.Collection.extend({
         model: picModel,
         initialize: function() {
             for (var i = 1; i < 6; i++) {
                 this.add(new picModel({ info_data: 'I am Pic' + i, url: '/backbone/img/pic' + i + ".jpg" }));
             }
         }

     });

    return picsCollection;
});
