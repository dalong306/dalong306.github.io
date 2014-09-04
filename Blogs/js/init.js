seajs.config({
    alias: {
        js: '/js',
        tmpl: '/templates'
    },
    preload: ['plugin-text']
});

define(function(require, exports, module) {

    $(function() {

        var Router = require('./router');

        Router.initialize();

    });

});