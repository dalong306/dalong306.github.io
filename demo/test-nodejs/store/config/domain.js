/**
 * 全局域名配置
 */

var domain = {};

// 主站域名
domain.snDomain = {
	'prd': 'http://www.suning.com',
	'pre': 'http://b2cpre.cnsuning.com',
	'sit': 'http://b2csit.cnsuning.com',
	'dev': 'http://www.suning.com'
};

// 资源文件域名
domain.resDomain = {
	// 'prd': 'http://css.suning.cn',
    'prd': 'http://store.suning.com',
    'pre': 'http://precss.suning.cn',
	// 'pre': 'http://storepre.cnsuning.com',
	'sit': 'http://sit1css.suning.cn',
	'dev': 'http://storedev.cnsuning.com:3000'
};

// CMS图片文件域名
domain.cmsImgDomain = {
	'prd': 'http://image5.suning.cn',
	'pre': 'http://10.19.95.100',
	'sit': 'http://10.19.95.100',
	'dev': 'http://image5.suning.cn'
};

// 门店前台域名
domain.apiDomain = {
	'prd':'http://store.suning.com',
    'pre':'http://storepre.cnsuning.com',
    'sit':'http://storesit.cnsuning.com',
	'dev':'http://storedev.cnsuning.com:3000'
};

// 门店中台接口域名
domain.storeApiDomain = {
    'prd':'http://store.suning.com',
    'pre':'http://storepre.cnsuning.com',
    'sit':'http://storesit.cnsuning.com',
    'dev':'http://store.suning.com'
};

domain.serviceApiDomain = {
    'prd':'http://www.suning.com',
    'pre':'http://b2csit.cnsuning.com',
    'sit':'http://b2csit.cnsuning.com',
    'dev':'http://b2csit.cnsuning.com'
};

// 向系统赋值，方便在模板中使用
module.exports = function (app) {
	var env = app.get('env');
	for(var name in domain) {
		app.set(name, domain[name][env]);
	}
};
