define(function(require, exports, module){

	var commentModel = require("../models/comment"),
	commentCollection = Backbone.Collection.extend({
		model: commentModel,
		initialize: function(){
			this.add(commentModel);
		}
	});
	var comment = new commentCollection;
	comment.fetch({
		url: "../js/data/comment.json", 
		success: function(collection, response){
             alert(1)
		},
		error: function(){
			alert("error")
		}
	});
	comment.bind('reset',function(){
		alert(3)
	});

	return commentCollection;
});