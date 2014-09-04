define(function(require, exports, module){
	var commentModel = Backbone.Model.extend({
		url: "../data/comment.json",
		default: {

		}
	});
	/*var list = new commentModel({
		imgUrl: "images/1.jpg",
		comText: "11111",
		tags: 111
	})*/
	
	return new commentModel();
});