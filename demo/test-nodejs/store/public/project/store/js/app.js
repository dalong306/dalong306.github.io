var snStore = (function(win, doc, $, snStore) {

    var cache = win.store && win.store.cache,
        _s = snStore || {},
        domain = sn.cookieDomain || location.host,
        resDomain = sn.resDomain;

    _s.getItems = function(arr, fn, isfilter) {
        if (Object.prototype.toString.call(arr) !== '[object Array]') {
            return;
        };

        var cityId, districtId, page, size, labels, fn, opts;

        cityId = arr[0] || '';
        districtId = arr[1] || '';
        page = arr[2] || '1';
        size = arr[3] || '10';
        lables = arr[4] || '';
        fn = fn || $.noop;
        opts = opts || {};
        $.ajax({
            url: '//' + domain + '/api/stores/' + cityId + '-' + districtId + '-' + page + '-' + size + '-' + lables + '.json ',
            success: function(data) {
                fn(data)
            }
        })
    }

    _s.render = function(data, fn) {
        var fn = fn || $.noop;
        if (win.store && win.store.template && win.store.template.storeTemplate) {
            fn(template.compile(win.store.template.storeTemplate)(data))
        } else {
            $.ajax({
                url: resDomain + '/project/store/template/storeTemplate.html',
                success: function(temp) {
                    win.store = win.store || {}
                    win.store.template = win.store.template || {};
                    win.store.template.storeTemplate = temp;
                    fn(template.compile(temp)(data))
                }
            })
        }
    }

    _s.filter = function(arr, fn) {
        var fn = fn || $.noop;
        $('.stor-filter label input').on('click', function() {
            window.store = window.store || {};
            window.store.cache = window.store.cache || {};
            $.cookie = $.cookie || $.noop;
            var cityId = window.ctx.cid || '';
            var districtId = $.cookie('storeCity') == 1 ? '' : window.ctx.did;
            var data = [cityId, districtId,'','',arr.join(',')];
            if (this.checked == true) {
                arr.push($(this).data('id'))
            } else {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] == $(this).data('id')) {
                        arr.splice(i, 1)
                    }
                };
            }
            if(arr[0]==''){
               arr =  arr.slice(1)
            }
            data[4] = arr.join(',')
            _s.getItems(data, function(data) {
                _s.render(data, function(data) {
                    fn(data)
                })
            })
        })
    }

    _s.change = function(data, fn) {
        _s.getItems(data, function(data) {
            _s.render(data, function(d) {
                fn(d)
            })
        })
        win.store.isChanged = true;
    }

    _s.paging = function(data, fn) {
        var fn = fn || $.noop;
        var _this = this;

        $('#main').on('click', '.sn-page-item, .sn-page-prev, .sn-page-next', function() {
            var lables = [];
            lables.concat(data[4])
            $('.stor-filter label input').each(function(){
                if (this.checked==true) {
                    lables.push($(this).data('id'))
                }else{
                    for (var i = 0; i < lables.length; i++) {
                        if (lables[i] == $(this).data('id')) {
                            lables.splice(i, 1)
                        }
                    };
                }
            })
            window.store = window.store || {};
            window.store.cache = window.store.cache || {};
            data[0] = window.ctx.cid || '';
            data[1] = $.cookie('storeCity') == 1 ? '' : window.ctx.did;
            data[4] = lables.join(',')
            var $this = $(this);
            var num = $this.html();
            if ($this.is('.sn-page-current') || $this.is('.sn-page-prev-disable') || $this.is('.sn-page-next-disable')) {
                return this;
            };
            if ($this.is('.sn-page-item')) {
                // 调整参数
                data[2] = num;
                render.call(_this, data)
            }
            if ($this.is('.sn-page-next')) {
                data[2] = data[2] ? -(-data[2] - 1) : 2;
                render.call(_this, data)
            }

            if ($this.is('.sn-page-prev')) {
                data[2] = data[2] - 1;
                render.call(_this, data)
            }

            function render(data) {
                _s.getItems(data, function(data) {
                    _s.render(data, function(data) {
                        fn(data)
                    })
                })
                return this;
            }
            
            $('html,body').animate({'scrollTop':'0'})
        })
    }

    _s.renderService = function(data, fn) {
        var fn = fn || $.noop;
        if (win.store && win.store.template && win.store.template.serviceTemplate) {
            var len = data.length;
            fn(template.compile(win.store.template.serviceTemplate)(data))
        } else {
            $.ajax({
                url:  resDomain + '/project/store/template/serviceTemplate.html',
                success: function(temp) {
                    win.store = win.store || {}
                    win.store.template = win.store.template || {};
                    win.store.template.serviceTemplate = temp;
                    fn(template.compile(temp)(data))
                }
            })
        }
    }

    _s.getServices = function(cityId, fn) {

        fn = fn || $.noop;
        $.ajax({
            url: '//' + domain + '/api/services/' + cityId + '.json ',
            success: function(data) {
                fn(data)
            }
        })
    }

    _s.pagingService = function(){

        $('body').on('click', '.sn-page-item, .sn-page-prev, .sn-page-next', function() {
            var $this = $(this);
            var $page = $('.sn-page')
            var $item = $('.sn-page-item');
            var size = $item.size();
            var index = $this.attr('data-num');
            if ($this.is('.sn-page-current') || $this.is('.sn-page-prev-disable') || $this.is('.sn-page-next-disable')) {
                return this;
            };
            $page.attr('data-num',index)

            var start = (index-1)*10, end = index*10,cityId = store.cache.cityId;
            _s.getServices(cityId, function(data) {
                data.data = data.data.slice(start,end);
                _s.renderService(data,function(data){
                    $('#main').html(data)
                })
            })
            if($this.is('.sn-page-item')){
                $this.addClass('sn-page-current').siblings().removeClass('sn-page-current')
            }else if($this.is('.sn-page-prev')){
                $this.addClass('sn-page-prev-disable');
                $('.sn-page-next').removeClass('sn-page-next-disable')
                $('.sn-page-current').prev().addClass('sn-page-current').end().removeClass('sn-page-current')
            }else{
                $this.addClass('sn-page-next-disable');
                $('.sn-page-prev').removeClass('sn-page-prev-disable')
                $('.sn-page-current').next().addClass('sn-page-current').end().removeClass('sn-page-current')
            }
            

            if (index==1) {
                $('.sn-page-prev').addClass('sn-page-prev-disable')
                $('.sn-page-next').removeClass('sn-page-next-disable')
            }else if(index == size){
                $('.sn-page-next').addClass('sn-page-next-disable')
                $('.sn-page-prev').removeClass('sn-page-prev-disable')
            };

            $('.sn-page-prev').attr('data-num',index-1)
            $('.sn-page-next').attr('data-num',-(-index-1))

            $('html,body').animate({'scrollTop':'0'})

        })

    }

    return _s;

})(window, document, jQuery, snStore)
