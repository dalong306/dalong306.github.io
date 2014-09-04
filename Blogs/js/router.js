define(function(require, exports, module) {

    var AppRouter = Backbone.Router.extend({
        baseUrl: './views/',
        initialize: function(options) {

            this.route(/(.*)/, "defAction", function(path) {
                require.async(this.baseUrl + 'home/comment', function(view) {
                    view.render();
                })
            });


        }
    });


    var initialize = function() {
        new AppRouter;
        Backbone.history.start(); 
    }

    return {
        initialize: initialize
    };
});
