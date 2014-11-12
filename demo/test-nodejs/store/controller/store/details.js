module.exports = function (req, res, app) {


	var EventProxy = require('eventproxy');
	var ep = new EventProxy();
	var f = require('node-fetch-url');
	var errPage = require('error-page');

	// 输出页面
	ep.all("prfs", "store", function (prfs, store) {

			// 门店图片
			var thumb, picDir = app.get('resDomain') + '/project/store/images/';
			if (store.storeClass == 2) { // 乐购仕
				thumb = picDir + 'sn_loax.jpg';
			} else { // 其他类型门店
				thumb = picDir + 'sn_store.jpg';
			}

			var data = {
				prfs_resources: prfs.prfs_resources,
				prfs_header: prfs.prfs_header,
				prfs_footer: prfs.prfs_footer,
				store: store,
				thumb: thumb,
				pageTitle: '苏宁' + store.storeName + '【地址、电话、活动、营业时间】-' + store.adminCity + store.region + '苏宁门店—苏宁易购',
				pageKeywords: '苏宁' + store.storeName +'，苏宁'+ store.storeName +'旗舰店，苏宁'+ store.storeName +'电话，苏宁'+ store.storeName +'地址',
				pageDescription: '苏宁云商'+ store.storeName +'为您提供苏宁' + store.storeName +'活动、营业时间、电话、地址、招聘等信息，省钱放心上苏宁' + store.storeName +'网上商城,尽享购物乐趣'
			};
			res.render('store/details', data);
		}
	);

	// 拉取店铺信息
	var storeId = req.params.storeId;  // 102727
	f.request({
		url: app.get('storeApiDomain') + '/store-web/storeshow/storedetail.do?bwStroeNo=' + storeId
	}, function (err, data) {
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
					errPage(app, res, '[详情接口返回错误, resultCode: ' + storeData.resultCode + ']');
				} else {
					ep.emit('store', storeData.data);
				}
			} catch (err) {
				errPage(app, res, err);
			}
		}
	});

	// 调用公共头尾，模块内部会自动缓存
	require('prfs')(app, function (data) {
		ep.emit('prfs', data);
	});

}