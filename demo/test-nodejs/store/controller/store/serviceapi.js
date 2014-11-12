var fetch = require('node-fetch-url');
var fs = require('fs')
var errPage = require('error-page');
var map = require('../../common/map.json');
module.exports = function(req, res, app) {
    var param, cityId, districtId, page, size, labels, uri, domain, len, seo, logger = app.get('logger');

    domain = app.get('serviceApiDomain')

    // 根据城市编码映射表找出邮政编码;
    param = req.params.params;
    len = map.length;
    for (var i = 0; i < len; i++) {
        if (map[i]['key'] == param) {
            cityId = map[i]['code'];
            seo = map[i]['city'];
        };
    };

    uri = domain + '/emall/SNServiceNetworkCmd?storeId=10052&catalogId=10051&citycode=' + cityId;
    fetch.request({
        url: uri
    }, function(err, response) {
        if (err) {
            errPage(app, res, err);
        } else {
            try {
                // 拼接需要的分页数据
                var items, total, page, i, arr = [];
                items = JSON.parse(response.body);
                total = items.length == 0 ? 0 : Math.ceil(items.length / 10)
                for (i = 2; i < -(-total - 1); i++) {
                    arr.push(i)
                };
                page = {
                    total: items.length,
                    list: arr
                }

                res.json({
                        'data': items,
                        'page': page,
                        'cityId': param,
                        'seo':seo
                    }
                )
            } catch (err) {
                errPage(app, res, err);
            }
        }

    })
}
