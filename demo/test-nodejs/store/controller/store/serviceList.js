var EventProxy = require('eventproxy');
var ep = new EventProxy();
var fetch = require('node-fetch-url');
var errPage = require('error-page');
module.exports = function(req, res, app) {
    var data, uri, host, cityId, districtId, serviceNo, domain, seo, total, arr = [],
        page = {};

    domain = app.get('apiDomain');
    cityId = req.params.cityId || '';
    ep.all("prfs", "items", function(prfs, items) {

        seo = items.seo;
        data = {
            prfs_resources: prfs.prfs_resources,
            prfs_header: prfs.prfs_header,
            prfs_footer: prfs.prfs_footer,
            port: app.get('port'),
            server_ip: require('ip').address(),
            items: items,
            data: items.data,
            page: items.page,
            pageTitle: seo + '苏宁售后维修服务网点【地址、电话、活动、营业时间】-苏宁易购',
            pageKeywords: seo + '苏宁售后，' + seo + '苏宁维修电话，' + seo + '苏宁维修地址，' + seo + '苏宁维修中心',
            pageDescription: seo + '苏宁售后维修服务网点为您提供' + seo + '苏宁售后服务网点活动、营业时间、电话、地址等信息，省钱放心上' + seo + '苏宁网上商城,尽享购物乐趣！',
            cityId: cityId,
            districtId: districtId || 'false'
        };
        res.render('store/services', data);

    });

    /*
     * 调用公共头尾，模块内部会自动缓存
     * */
    require('prfs')(app, function(data) {
        ep.emit('prfs', data);
    });

    uri = domain + '/api/services/' + cityId + '.json'

    fetch.request({
        url: uri
    }, function(err, response) {
        if (err) {
            errPage(app, res, err);
        } else {
            try {
                ep.emit('items', JSON.parse(response.body));
            } catch (err) {
                errPage(app, res, err);
            }
        }
    })
}
