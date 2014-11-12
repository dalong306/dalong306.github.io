module.exports = function (req, res, app) {


	var EventProxy = require('eventproxy');
	var ep = new EventProxy();
	var f = require("node-fetch-url");
	var errPage = require('error-page');

	ep.all("prfs","index", function (prfs,result) {
			var data = {
				prfs_resources: prfs.prfs_resources,
				prfs_header: prfs.prfs_header,
				prfs_footer: prfs.prfs_footer,
				port: app.get('port'),
				server_ip: require('ip').address(),

				pageTitle: "苏宁门店查询【地址、电话、活动、营业时间】—苏宁易购",
				pageKeywords: "苏宁门店，苏宁旗舰店，苏宁门店电话，苏宁门店地址",
				pageDescription: "苏宁门店查询频道为您提供苏宁门店活动、营业时间、电话、地址、招聘等信息，省钱放心上苏宁易购网上商城,尽享购物乐趣！",

				resultCode: result.resultCode,
				result: result,
				slide: result.slide,
				serviceList: result.serviceList
			};
			res.render('store/index', data);
		}
	);

	
	/*
	 * 调用公共头尾，模块内部会自动缓存
	 * */
	require('prfs')(app, function (data) {
		ep.emit('prfs', data);
	});

	//请求首页数据输出给前台
	f.request({
		"url": app.get('storeApiDomain') + "/store-web/storeshow/storehome.do"
	},function(err, data){
		if (err) {
			errPage(app, res, err);
		} else {
			/*
			 * 解析数据
			 * 如果 storeData.resultCode 不为 1，则同样显示404页面
			 * */
			try {
				var storeData = JSON.parse(data.body);
				if (typeof storeData.resultCode == 'undefined' || storeData.resultCode != 1) {
					errPage(app, res, '[首页接口返回错误, resultCode: ' + storeData.resultCode + ']');
				} else {
					ep.emit('index', storeData);
				}
			} catch (err) {
				errPage(app, res, err);
			}
		}
	});	
}