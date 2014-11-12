var EventProxy = require('eventproxy');
var ep = new EventProxy();
var fetch = require('node-fetch-url');
var errPage = require('error-page');
module.exports = function(req, res, app) {
    var data, uri, host, cityId, districtId, serviceNo, domain, seo, total, arr = [],
        page = {};

    domain = app.get('apiDomain');
    cityId = req.params.cityId || '';
    districtId = req.params.districtId || '';
    ep.all("prfs", "items", function(prfs, items) {
        if (items.data.length != 0) {
            seo = items.data[0].provenCen + items.data[0].adminCity + (districtId ? items.data[0].region : '');
        } else {
            seo = ''
        }

        data = {
            prfs_resources: prfs.prfs_resources,
            prfs_header: prfs.prfs_header,
            prfs_footer: prfs.prfs_footer,
            port: app.get('port'),
            server_ip: require('ip').address(),
            items: items,
            data: items.data,
            page: items.page,
            param: items.param,
            pageTitle: seo + '苏宁门店【地址、电话、活动、营业时间】—苏宁易购',
            pageKeywords: seo + '苏宁门店，' + seo + '苏宁旗舰店，' + seo + '苏宁电话，' + seo + '苏宁地址',
            pageDescription: seo + '苏宁门店查询频道为您提供江苏南京市苏宁门店活动、营业时间、电话、地址、活动等信息，省钱放心上' + seo + '苏宁网上商城,尽享购物乐趣！',
            cityId: cityId,
            districtId: districtId || 'false'
        };
        res.render('store/stores', data);
    });

    /*
     * 调用公共头尾，模块内部会自动缓存
     * */
    require('prfs')(app, function(data) {
        ep.emit('prfs', data);
    });

    uri = domain + '/api/stores/' + cityId + '-' + districtId + '---.json'

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
