/**
 * 路由规则
 */

var routes = {
	'/': 'store/index',  // 首页

	'/stores.html': 'store/storeList',  // 门店列表
	'/stores/:cityId([0-9]+).html': 'store/storeList',  // 城市门店列表
	'/stores/:cityId([0-9]+)-:districtId([0-9]+).html': 'store/storeList',  // 城市区县门店列表

	'/events/:eventName([0-9a-zA-Z-_]+).html': 'store/eventList',  // 活动门店列表

	'/services.html': 'store/serviceList',  // 服务网点列表
	'/services/:cityId([0-9]+).html': 'store/serviceList',  // 城市服务网点列表
	'/services/:cityId([0-9]+)-:districtId([0-9]+).html': 'store/serviceList',  // 城市区县服务网点列表

	'/:storeId([0-9a-zA-Z]+).html': 'store/details',  // 门店详情

    '/api/stores/:params([0-9a-zA-Z-_,]+).json': 'store/storeapi',  // 门店异步请求接口
    '/api/services/:params([0-9]+).json':'store/serviceapi'  //
};

module.exports = routes;
