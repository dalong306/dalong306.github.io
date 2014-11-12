var fetch = require('node-fetch-url');
var errPage = require('error-page');
module.exports = function(req, res, app) {
    var params, cityId, districtId, page, size, labels, uri, domain, logger = app.get('logger');

    domain = app.get('storeApiDomain')
    params = req.params.params.split('-');

    cityId = params[0] || '';
    districtId = params[1] || '';
    page = params[2] || '1';
    size = params[3] || '10';
    lables = params[4] || '';

    uri = domain + '/store-web/storeshow/storelist.do?cityId=' + cityId + '&regionId=' + districtId + '&pageNum=' + page + '&pageSize=' + size + '&labelNo=' + lables;
    fetch.request({
        url: uri
    }, function(err, response) {
        if (err) {
            errPage(app, res, err);
        } else {
            try {
                // 拼接需要的分页数据
                var items, total, i, arr = [];
                items = JSON.parse(response.body);
                total = items.data.length == 0 ? 0 : Math.ceil(items.total / size)
                for (i = 2; i < total + 1; i++) {
                    arr.push(i)
                };
                items.page = {
                    total: total,
                    list: arr,
                    current: page,
                    prev: page - 1,
                    next: -(-page - 1),
                    params: params
                }
                // items.param = districtId ? cityId + '-' + districtId : cityId;
                items.param = cityId
                res.json(items)

            } catch (err) {
                errPage(app, res, err);
            }
        }

    })
}
