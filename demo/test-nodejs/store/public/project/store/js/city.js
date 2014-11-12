(function ($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch(e) {}
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function (key, value, options) {

        // Write

        if (arguments.length > 1 && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) === undefined) {
            return false;
        }

        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', $.extend({}, options, { expires: -1 }));
        return !$.cookie(key);
    };

})(jQuery);


var ECity=ECity||{};ECity.setting={};ECity.setting.data={cookie:{cookieKey:"SN_CITY",cookieVale:"",hostName:"",cityOuterSepatator:"|",cityInnerSeparator:"_",cookiePath:"; path = ",cookieTime:"; max-age = ",cookieDomain:"; domain = ",oldCookieCityKey:"cityId",oldCookieDistrictKey:"districtId",oldCookieCityValue:"",oldCookieDistrictValue:""},url:{cookieUrl:"",cityArrayUrl:"",districtArrayUrl:"",districtUrl:""},flag:{user:"1",sys:"2",sys_user:"3"},type:{pc:"pc",pcd:"pcd"},city:{cityArray:[],cityType:"",cityInfo:{}},init:function(e){var d=ECity.setting.data;var b=d.cookie;var a=d.url;var f=d.city;var c=d.type;b.hostName=document.location.hostname;b.cookieTime+=365*24*60*60;b.cookiePath+="/";if(b.hostName.indexOf(".suning.com")!=-1){b.cookieDomain+=".suning.com";b.hostName="http://ipservice.suning.com"}else{if(b.hostName.indexOf(".cnsuning.com")!=-1){b.cookieDomain+=".cnsuning.com";b.hostName="http://ipservicesit.cnsuning.com"}else{b.cookieDomain+=b.hostName;b.hostName="http://localhost:8080/snf-ipinfo-web"}}a.cookieUrl=b.hostName+"/ipQuery.do?";a.provinceArrayUrl=b.hostName+"/provinceList-";a.cityArrayUrl=b.hostName+"/cityList-";a.districtArrayUrl=b.hostName+"/districtList-";a.districtUrl=b.hostName+"/districtDetail-";f.cityType=e?c.pc:c.pcd}};ECity.setting.util={equalsByPCD:function(a,b){if(!a||!b){return false}if(a.provinceMDMId==b.provinceMDMId&&a.cityMDMId==b.cityMDMId&&a.districtMDMId==b.districtMDMId){return true}return false},equalsByPC:function(a,b){if(!a||!b){return false}if(a.provinceMDMId==b.provinceMDMId&&a.cityMDMId==b.cityMDMId){return true}return false},isEmpty:function(b){if(!b){return true}for(var a in b){if(typeof b[a]!="undefined"){return false}}return true},equalsByCD:function(d,c,a){if(!d){return null}if(!c){return null}if(!a||a.length==0){return null}for(var b in a){if(d===a[b].cityCommerceId&&c===a[b].districtCommerceId){return a[b]}}return null},equalsByC:function(c,a){if(!c){return null}if(!a||a.length==0){return null}for(var b in a){if(c===a[b].cityCommerceId){return a[b]}}return null},convertToOut:function(b){if(!b||this.isEmpty(b)){return null}var a={};a.province={};a.city={};a.district={};a.province.id=b.provinceMDMId;a.province.cid=b.provinceCommerceId;a.province.name=b.provinceName;a.city.id=b.cityMDMId;a.city.cid=b.cityCommerceId;a.city.name=b.cityName;a.district.id=b.districtMDMId;a.district.cid=b.districtCommerceId;a.district.name=b.districtName;return a},convertToIn:function(a){if(!a||this.isEmpty(a)){return null}var b={};if(a.province&&!this.isEmpty(a.province)){b.provinceMDMId=a.province.id;b.provinceCommerceId=a.province.cid;b.provinceName=a.province.name}if(a.city&&!this.isEmpty(a.city)){b.cityMDMId=a.city.id;b.cityCommerceId=a.city.cid;b.cityName=a.city.name}if(a.district&&!this.isEmpty(a.district)){b.districtMDMId=a.district.id;b.districtCommerceId=a.district.cid;b.districtName=a.district.name}return b}};ECity.IPCookie=(function(){var F=ECity.setting.data;var b=ECity.setting.util;var B=F.cookie;var v=F.flag;var e=F.type;var t=F.city;var g=F.url;var j=F.sortType;var d=[];function w(G){d=d.concat(G)}var x=[];function C(G){x=x.concat(G)}var s=[];function D(G){s=s.concat(G)}var h=[];function r(G){h=h.concat(G)}var i=function(H){c();if(B.cookieValue){n()}var G={};if(B.oldCookieCityValue){if(B.oldCookieDistrictValue){G=b.equalsByCD(B.oldCookieCityValue,B.oldCookieDistrictValue,t.cityArray);if(G){t.cityInfo=G;if(!b.equalsByPCD(G,t.cityArray[0])){m();o()}if(typeof H=="function"){H(b.convertToOut(t.cityInfo))}}else{z(H)}}else{G=b.equalsByC(B.oldCookieCityValue,t.cityArray);if(G){t.cityInfo=G;q();if(!b.equalsByPCD(G,t.cityArray[0])){m();o()}if(typeof H=="function"){H(b.convertToOut(t.cityInfo))}}else{z(H)}}}else{if(t.cityArray&&t.cityArray.length!=0){t.cityInfo=t.cityArray[0];q();if(typeof H=="function"){H(b.convertToOut(t.cityInfo))}}else{z(H)}}};var f=function(G,H){if(G&&!b.isEmpty(G)){t.cityInfo=b.convertToIn(G)}m();q();o();if(typeof H=="function"){H(b.convertToOut(t.cityInfo))}};var c=function(){var G=document.cookie;if(!G){return}var J=G.match(RegExp("(^| )"+B.oldCookieCityKey+"=([^;]*)(;|$)"));var I=G.match(RegExp("(^| )"+B.oldCookieDistrictKey+"=([^;]*)(;|$)"));var H=G.match(RegExp("(^| )"+B.cookieKey+"=([^;]*)(;|$)"));if(J&&J[2]&&J[2].length!=0){B.oldCookieCityValue=decodeURIComponent(J[2])}if(I&&I[2]&&I[2].length!=0){B.oldCookieDistrictValue=decodeURIComponent(I[2])}if(H&&H[2]&&H[2].length!=0){B.cookieValue=decodeURIComponent(H[2])}};var z=function(G){w(G);if(d.length==1){A(G)}};var A=function(H){var G=g.cookieUrl;if(B.oldCookieCityValue){G+=B.oldCookieCityKey+"="+B.oldCookieCityValue;if(B.oldCookieDistrictValue){G+="&"+B.oldCookieDistrictKey+"="+B.oldCookieDistrictValue}}$.ajax({type:"GET",url:G,cache:true,async:false,dataType:"jsonp",jsonpCallback:"cookieCallback",success:function(I){var K=[];if(B.oldCookieCityValue){if(B.oldCookieDistrictValue){I.flag=v.user;I.count=1}else{I.flag=v.sys_user;I.count=0}}else{I.flag=v.sys;I.count=0}t.cityInfo=I;if(t.cityArray&&t.cityArray.length!=0){m()}else{K.push(I);t.cityArray=K}o();if(B.oldCookieCityValue&&B.oldCookieDistrictValue&&B.oldCookieDistrictValue!=I.districtCommerceId){q()}if(!B.oldCookieCityValue||!B.oldCookieDistrictValue){q()}if(typeof H=="function"){for(var J in d){d[J](b.convertToOut(t.cityInfo))}d=[]}}})};var n=function(){var M=B.cookieValue;if(!M){return}var I=M.split(B.cityOuterSepatator);var L=[];var J=I.length;for(var H=0;H<J;H++){var K=I[H].split(B.cityInnerSeparator);var G={};G.provinceMDMId=K[0];G.provinceCommerceId=K[1];G.provinceName=scriptData.provinces[K[0]];G.cityMDMId=K[2];G.cityCommerceId=K[3];G.cityName=scriptData.cities[K[2]];G.districtMDMId=K[4];G.districtCommerceId=K[5];G.districtName=scriptData.districts[K[4]];G.flag=K[6];G.count=K[7];L.push(G)}t.cityArray=L};var q=function(){var H=t.cityArray;if(!H||H.length==0){return}B.oldCookieCityValue=H[0].cityCommerceId;B.oldCookieDistrictValue=H[0].districtCommerceId;var G="";var I="";G=B.oldCookieCityKey+"="+encodeURIComponent(B.oldCookieCityValue);G+=B.cookieTime;G+=B.cookiePath;G+=B.cookieDomain;document.cookie=G;I=B.oldCookieDistrictKey+"="+encodeURIComponent(B.oldCookieDistrictValue);I+=B.cookieTime;I+=B.cookiePath;I+=B.cookieDomain;document.cookie=I};var o=function(){var I=t.cityArray;var K="";var J="";if(!I||I.length==0){return}var H=I.length;for(var G=0;G!=H;G++){J+=I[G].provinceMDMId;J+=B.cityInnerSeparator;J+=I[G].provinceCommerceId;J+=B.cityInnerSeparator;J+=I[G].cityMDMId;J+=B.cityInnerSeparator;J+=I[G].cityCommerceId;J+=B.cityInnerSeparator;J+=I[G].districtMDMId;J+=B.cityInnerSeparator;J+=I[G].districtCommerceId;J+=B.cityInnerSeparator;J+=I[G].flag;J+=B.cityInnerSeparator;J+=I[G].count;if(G==H-1){break}J+=B.cityOuterSepatator}B.cookieValue=J;K=B.cookieKey+"="+encodeURIComponent(B.cookieValue);K+=B.cookieTime;K+=B.cookiePath;K+=B.cookieDomain;document.cookie=K};var m=function(){var M=t.cityArray;var J=t.cityType;var L=t.cityInfo;if(b.isEmpty(L)||!M||b.isEmpty(M[0])){return}var I=[];var K=M[0];var H=M[1];var G=M[2];if(J==e.pc){if(K.flag==v.sys){L.flag=v.sys_user;L.count=0;I.push(L);t.cityArray=I;return}if(K.flag==v.sys_user){if(b.equalsByPC(L,K)){return}else{if(b.equalsByPC(L,H)){I.push(H);if(!b.isEmpty(G)){I.push(G)}t.cityArray=I;return}else{if(b.equalsByPC(L,G)){I.push(G);I.push(H);t.cityArray=I;return}else{L.flag=v.sys_user;L.count=0;I.push(L);if(!b.isEmpty(H)){I.push(H);if(!b.isEmpty(G)){I.push(G)}}t.cityArray=I;return}}}}if(K.flag==v.user){if(b.equalsByPC(L,K)){return}else{if(b.equalsByPC(L,H)){I.push(H);I.push(K);if(!b.isEmpty(G)){I.push(G)}t.cityArray=I;return}else{if(b.equalsByPC(L,G)){I.push(G);I.push(K);I.push(H);t.cityArray=I;return}else{L.flag=v.sys_user;L.count=0;I.push(L);I.push(K);if(!b.isEmpty(H)){I.push(H)}t.cityArray=I;return}}}}}else{if(K.flag==v.sys){L.flag=v.user;L.count=1;I.push(L);t.cityArray=I;return}if(K.flag==v.sys_user){if(b.equalsByPCD(L,K)){K.count++;K.flag=v.user;return}else{if(b.equalsByPCD(L,H)){H.count++;I.push(H);if(!b.isEmpty(G)){I.push(G)}t.cityArray=I;return}else{if(b.equalsByPCD(L,G)){G.count++;I.push(G);I.push(H);t.cityArray=I;return}else{L.flag=v.user;L.count=1;I.push(L);if(!b.isEmpty(H)){I.push(H);if(!b.isEmpty(G)){I.push(G)}}t.cityArray=I;return}}}}if(K.flag==v.user){if(b.equalsByPCD(L,K)){K.count++;return}else{if(b.equalsByPCD(L,H)){H.count++;I.push(H);I.push(K);if(!b.isEmpty(G)){I.push(G)}t.cityArray=I;return}else{if(b.equalsByPCD(L,G)){G.count++;I.push(G);I.push(K);I.push(H);t.cityArray=I;return}else{L.flag=v.user;L.count=1;I.push(L);I.push(K);if(!b.isEmpty(H)){I.push(H)}t.cityArray=I;return}}}}}};var y=function(G,H){D(H);if(s.length==1){u(G,H)}};var u=function(H,I){var G=g.cityArrayUrl+H+"-cityListCallback.htm";$.ajax({type:"GET",url:G,cache:true,async:true,dataType:"jsonp",jsonp:false,jsonpCallback:"cityListCallback",success:function(O){var M=[];M=O.cities;var P=[];var N=M.length;for(var L=0;L!=N;L++){var J={};J.name=M[L].name;J.id=M[L].mdmId;J.cid=M[L].commerceId;J.pinyin=M[L].pinyin.charAt(0);J.defaultId=M[L].defaultDistrictMdmId;P.push(J)}if(typeof I=="function"){for(var K in s){s[K](P)}s=[]}}})};var a=function(G,H){r(H);if(h.length==1){p(G,H)}};var p=function(H,I){var G=g.districtArrayUrl+H+"-districtListCallback.htm";$.ajax({type:"GET",url:G,cache:true,async:true,dataType:"jsonp",jsonp:false,jsonpCallback:"districtListCallback",success:function(K){var N=[];N=K.districts;var P=[];var O=N.length;for(var M=0;M!=O;M++){var J={};J.name=N[M].name;J.id=N[M].mdmId;J.cid=N[M].commerceId;J.pinyin=N[M].pinyin.charAt(0);P.push(J)}if(typeof I=="function"){for(var L in h){h[L](P)}h=[]}}})};var E=function(G){C(G);if(x.length==1){k(G)}};var k=function(H){var G=g.provinceArrayUrl+"provinceListCallback.htm";$.ajax({type:"GET",url:G,cache:true,async:true,dataType:"jsonp",jsonp:false,jsonpCallback:"provinceListCallback",success:function(L){var M=[];M=L.provinces;var O=[];var N=M.length;for(var K=0;K!=N;K++){var I={};I.name=M[K].name;I.id=M[K].mdmId;I.cid=M[K].commerceId;I.pinyin=M[K].pinyin.charAt(0);I.defaultId=M[K].defaultCityMdmId;O.push(I)}if(typeof H=="function"){for(var J in x){x[J](O)}x=[]}}})};var l=function(H,I){var G=g.districtUrl+H+"-districtCallback.htm";$.ajax({type:"GET",url:G,cache:true,async:true,dataType:"jsonp",jsonp:false,jsonpCallback:"districtCallback",success:function(J){var K={};if(typeof I=="function"){K.id=J.mdmId;K.cid=J.commerceId;K.name=J.name;I(K)}}})};return{showCity:i,setCity:f,getRemoteDistrict:l,getRemoteDistrictArray:a,getRemoteCityArray:y,getRemoteProvinceArray:E}}());ECity.API={init:function(a){ECity.setting.data.init(a)},ipCookie:ECity.IPCookie,util:ECity.setting.util,getCity:function(a){this.ipCookie.showCity(a)},setCity:function(a,b){this.ipCookie.setCity(a,b)},getDataCity:function(){var b=ECity.setting.data.city.cityArray;var a={};if(b&&!this.util.isEmpty(b[0])){a=this.util.convertToOut(b[0])}return a},getLastUsedCities:function(){var c=ECity.setting.data.city.cityArray;var b=[];if(c){for(var a in c){b.push(this.util.convertToOut(c[a]))}}return b},getCityId:function(){var a=ECity.setting.data.city.cityArray;if(a&&!this.util.isEmpty(a[0])){return a[0].cityCommerceId}return""},getDistrictId:function(){var a=ECity.setting.data.city.cityArray;if(a&&!this.util.isEmpty(a[0])){return a[0].districtCommerceId}return""},getDistrict:function(a,b){this.ipCookie.getRemoteDistrict(a,b)},getDistrictList:function(b,a){this.ipCookie.getRemoteDistrictArray(b,a)},getCityList:function(a,b){this.ipCookie.getRemoteCityArray(a,b)},getProvinceList:function(a){this.ipCookie.getRemoteProvinceArray(a)}};

(function(win, doc, $) {

    function getCity(fn) {
        ECity.API.getCity(function(d) {
            return fn(d);
        })
    }

    function getProvinces(fn) {
        ECity.API.getProvinceList(function(d) {
            return fn(d);
        })
    }

    function getCitiesById(id, fn) {
        ECity.API.getCityList(id, function(d) {
            return fn(d);
        })
    }

    function getDistrictsById(id, fn) {
        ECity.API.getDistrictList(id, function(d) {
            return fn(d);
        })
    }

    function setCityInfo(obj, fn) {
        ECity.API.setCity(obj, function(obj) {
            return fn(obj);
        })
    }

    function getDefaultDistrict(id, fn) {
        ECity.API.getDistrict(id, function(d) {
            return fn(d)
        })
    }


    function SnCity(el, opts) {
        var _this = this;
        this.el = el;
        this.$el = $(el);
        this.opts = opts;
        win.store = win.store || {};
        win.store.ctx = win.store.ctx || {};
        win.store.temp = this.temp = {
            province: {},
            city: {},
            district: {}
        };
        win.store.isAll = true;
        this.setDom();
        this.open();
        this.defaultRender();
        _this.provincesRender(function(){
            _this.citiesRender(null,function(){
                _this.setCity();
                _this.districtRender(null,function(){
                    _this.setDistrict();
                });
            });
            _this.setProvince();
        });
    }

    SnCity.prototype.setDom = function() {
        var dom = '<a href="javascript:void(0)" title="" class="drop-head"><div class="head-inner"><span class="drop-head-txt js-province"></span><i class="arrow"></i></div></a>' +
            '<a href="javascript:void(0)" title="" class="drop-head drop-border"><div class="head-inner"><span class="drop-head-txt js-city"></span><i class="arrow"></i></div></a>' +
            '<a href="javascript:void(0)" title="" class="drop-head drop-border"><div class="head-inner"><span class="drop-head-txt js-district"></span><i class="arrow"></i></div></a>' +
            '<div class="area-menu"><ul class="js-provinceList"></ul><ul class="js-cityList"></ul><ul class="js-districtList"></ul></div>';
        this.$el.append(dom)
        this.$province = this.$el.find('.js-province');
        this.$city = this.$el.find('.js-city');
        this.$district = this.$el.find('.js-district');
        this.$provinceList = this.$el.find('.js-provinceList');
        this.$cityList = this.$el.find('.js-cityList');
        this.$districtList = this.$el.find('.js-districtList');

    }

    SnCity.prototype.open = function() {

        var $el = this.$el,
            opts = this.opts,
            _this = this,
            $menu = $el.find('.area-menu'),
            store = window.store,
            t;

        switch (opts.eventType) {
            case 'click':
                $el.on('click', '.drop-head ', function(e) {
                    var $this = $(this),
                        i = $this.index(),
                        e = e || event;
                    if($this.is('.drop-head-disable')){return;}
                    open.call(this,i);
                    e.stopPropagation()
                })

                $el.on('click', '.area-menu', function(e) {
                    var e = e || event;
                    e.stopPropagation();
                })

                $(doc).on('click', function() {
                    _this.close()

                    _this.$province.html(_this.$province.attr('data-name'));
                    _this.$city.html(_this.$city.attr('data-name'));
                    _this.$district.html(_this.$district.attr('data-name'));

                })
                break;
            case 'hover':
                $el.on('mouseenter', '.drop-head', function() {
                    var $this = $(this),
                        i = $this.index();
                    if($this.is('.drop-head-disable')){return;}
                    open(i);
                    clearTimeout(t);

                }).on('mouseleave', '.drop-head', function() {
                    $el.on('mouseenter', '.area-menu', function() {
                        clearTimeout(t);
                    }).on('mouseleave', '.area-menu', function() {
                        _this.close();
                    })

                    t = setTimeout(function() {
                        _this.close();
                    }, 50)

                })
                break;
        }

        function open(i) {
            $menu.children().eq(i).show().siblings().hide();
            $(this).addClass('area-drop-open').siblings().removeClass('area-drop-open');
        }
    }

    SnCity.prototype.close = function() {
        var $el = this.$el,
            $menu = $el.find('.area-menu'),
            $head = $el.find('.drop-head');
        $head.removeClass('area-drop-open');
        $menu.children().hide();
    }

    SnCity.prototype.toggle = function(i, o, isMucity,$ele) {
        var $el = this.$el,
            _this = this,
            $menu = $el.find('.area-menu'),
            cache;
        if (isMucity) {
            // 如果是直辖市,自动获取市cookie信息,并写入
            cache = this.$cityList.find('li').first().data('cache').split('|');
            
            getDefaultDistrict(cache[3], function(o) {
                _this.temp.district = o;
            })
            _this.districtRender(o[0].id, function(t) {
                _this.$city.text(_this.temp.province.name);
                _this.$district.text('请选择');
                // 只有当选择市不一样的时候,才会触发callback;
                _this.temp.city = {
                    cid: cache[0],
                    id: cache[1],
                    name: cache[2]
                }
                
                if (_this.opts.isOnlyCity == true) {
                    _this.setCookie(_this.temp, function(){
                        if (!$ele.is('.js-selected') || _this.opts.alwaysFire) {
                            _this.opts.cityFn(_this.temp);
                        };
                    })
                }else{
                    if (!$ele.is('.js-selected') || _this.opts.alwaysFire) {
                        _this.opts.cityFn(_this.temp);
                    };
                }
                
                $ele.addClass('js-selected').siblings().removeClass('js-selected');
            })
            
            $menu.children().eq(i + 2).show();
            $el.find(".drop-head").removeClass('area-drop-open').eq(i + 2).addClass('area-drop-open');
            $.cookie('storeCity','1',{path:'/'});
        } else {
            $menu.children().eq(i + 1).show();

            $el.find(".drop-head").removeClass('area-drop-open').eq(i + 1).addClass('area-drop-open').removeClass('drop-head-disable').end().eq(i+2).addClass('drop-head-disable');
        }
    }

    SnCity.prototype.defaultRender = function() {
        var _this = this;
        getCity(function(o) {
            if (_this.opts.alwaysAll) {
                $.cookie('storeCity','1',{path:'/'});
            }
            _this.$province.text(o.province.name).attr('data-name',o.province.name);
            _this.$city.text(o.city.name).attr('data-name',o.city.name);
            if (_this.opts.alwaysAll) {
                _this.$district.text('全部').attr('data-name','全部');
            }else{
                if ($.cookie('storeCity') == '1') {
                    _this.$district.text('全部').attr('data-name','全部');
                }else{
                    _this.$district.text(o.district.name).attr('data-name',o.district.name);
                }
            }
            win.ctx = win.ctx ||  {};
            win.ctx.cid = o.city.cid;
            win.ctx.pid = o.province.cid;
            win.ctx.did = o.district.cid;
            win.store.temp = _this.temp = o;
            _this.opts.fn(o)
            if(_this.opts.isHiddenDistrict){
                $(".drop-head").eq(2).addClass('drop-head-disable')
                $.cookie('storeCity','1',{path:'/'})
            }
        })
    }

    SnCity.prototype.provincesRender = function(fn) {
        var _this = this,
            $frag = $('<div></div>');
        getProvinces(function(o) {
            $.each(o, function(k, v) {
                $frag.append('<li data-cache=' + v.cid + '|' + v.id + '|' + v.name + '|' + v.pinyin + '><a href="javascript:void(0)" title=' + v.name + '>' + v.name + '</a></li>')
            })
            _this.$provinceList.html($frag.html())
            fn = !fn ? $.noop : fn;
            fn(o);
        })

    }

    SnCity.prototype.citiesRender = function(id, fn) {
        var _this = this,
            id = id || _this.temp.province.id,
            $frag = $('<div></div>');
        getCitiesById(id, function(o) {
            $.each(o, function(k, v) {
                $frag.append('<li data-cache=' + v.cid + '|' + v.id + '|' + v.name + '|' + v.defaultId + '|' + v.pinyin + '><a href="javascript:void(0)" title=' + v.name + '>' + v.name + '</a></li>')
            })
            _this.$cityList.html($frag.html())
            fn = !fn ? $.noop : fn;
            fn(o);
        })
    }

    SnCity.prototype.districtRender = function(id, fn) {
        var _this = this,
            id = id || _this.temp.city.id,
            $frag = $('<div></div>'),
            $all;
        getDistrictsById(id, function(o) {
            $.each(o, function(k, v) {
                $frag.append('<li data-cache=' + v.cid + '|' + v.id + '|' + v.name + '|' + v.pinyin + '><a href="###" title=' + v.name + '>' + v.name + '</a></li>')
            })
            // 添加在区县添加全部
            $all = $frag.children().first().clone()
            $all.find('a').text('全部').attr('title','全部')
            $frag.prepend($all)
            _this.$districtList.html($frag.html())
            fn = !fn ? $.noop : fn;
            fn(o);
        })
    }

    SnCity.prototype.setProvince = function() {
        var _this = this,
            i = this.$provinceList.index();
        
        this.$provinceList.on('click', 'li', function() {
            var $this = $(this),
                cache = $this.data('cache').split('|');
            // 禁用区选择;
            _this.citiesRender(cache[1], function(o) {
                _this.$province.text(cache[2]);
                _this.$city.text('请选择')
                _this.$district.text('全部')
                _this.temp.province = {
                    cid: cache[0],
                    id: cache[1],
                    name: cache[2]
                }
                var cid = o[0].cid;
                if(cid == 9264 || cid == 9017 || cid ==9281 || cid == 9325){
                    _this.opts.provinceFn(o);
                }
                _this.close();
                _this.toggle(i, o, o.length == 1, $this)
            })
        })
    }

    SnCity.prototype.setCity = function() {
        var _this = this,
            i = this.$cityList.index();
        
        this.$cityList.on('click', 'li', function() {
            var $this = $(this),
                cache = $this.data('cache').split('|');
                // _this.setCookie(_this.temp);
            _this.temp.city = {
                cid: cache[0],
                id: cache[1],
                name: cache[2]
            }
            _this.districtRender(cache[1], function(o) {
                _this.$city.text(cache[2]);
                _this.$district.text('请选择');
                // 同时设置默认区,当只选择城市的时候.
                getDefaultDistrict(cache[3], function(o) {
                    _this.temp.district = o;
                    // 只有当选择的市不一样的时候才会触发callback;
                    if(_this.opts.isOnlyCity == true){
                        _this.setCookie(_this.temp)
                    }

                    if (!$this.is('.js-selected') || _this.opts.alwaysFire) {
                        _this.opts.cityFn(_this.temp);
                    };
                    
                    $this.addClass('js-selected').siblings().removeClass('js-selected');
                })
                
                _this.close();
                _this.toggle(i, o, false, $this);
                
            })
        })
    }

    SnCity.prototype.setDistrict = function() {
        var _this = this,
            i = this.$districtList.index();
        this.$districtList.on('click', 'li', function() {
            var $this = $(this),
                cache = $this.data('cache').split('|'),
                districtCache;
                // 缓存上一次的区县信息;
            districtCache = _this.temp.district;
            _this.temp.district = {
                cid: cache[0],
                id: cache[1],
                name: cache[2]
            }
            _this.close();
            // 选择全部的时候,设置唯一cookie.
            if ($this.index() == 0) {
                window.store.isAll = true;
                $.cookie('storeCity', '1',{ path:'/'})
                //如果是全部,用缓存的区县信息,代替默认的区县信息;
                _this.$district.text('全部');
                _this.temp.district = districtCache;
                _this.opts.districtFn(_this.temp);
            }else{
                window.store.isAll = false;
                $.removeCookie('storeCity',{path:'/'})
                _this.$district.text(cache[2]);
                // 只有当选择区县不一样的时候,才会触发callback
                if (!$this.is('.js-selected') || _this.opts.alwaysFire) {
                    _this.opts.districtFn(_this.temp)
                };
            }
            $this.addClass('js-selected').siblings().removeClass('js-selected');
            _this.setCookie(_this.temp)
            _this.$province.attr('data-name',_this.$province.text())
            _this.$city.attr('data-name',_this.$city.text())
            _this.$district.attr('data-name',_this.$district.text())
        })
    }

    SnCity.prototype.setCookie = function(obj, fn) {
        ECity.API.setCity(obj, function(obj) {
            fn = !fn ? $.noop : fn;
            return fn(obj)
        })
    }

    win.snCity = win.snCity ||  {};
    snCity.API = snCity.API || {};

    snCity.API.setCookie = function(obj, fn){
        ECity.API.setCity(obj, function(obj) {
            fn = !fn ? $.noop : fn;
            return fn(obj)
        })
    }

    var dfts = {
        eventType: 'click',
        provinceFn:$.noop,
        cityFn: $.noop,  // 选择城市后的fn;
        districtFn: $.noop, // 选择区县后的fn;
        fn: $.noop,
        alwaysFire: false,
        alwaysAll: true,
        isonlyCity: false,
        isHiddenDistrict: false // 是否总是触发选择城市和选择区县的fn,不管是否是同一城市或区县
    }

    $.fn.snCity = function(opt) {
        var _this = this,
            opts;
        $.when($.ajax({
            url: '//' + (sn.cityDomain || 'ipservice.suning.com') + '/cityMap.jsonp',
            dataType: 'script',
            cache: true
        })).then(function() {
            try {
                ECity.API.init(false);
            } catch (e) {};
            return _this.each(function() {
                opts = $.extend({}, dfts, opt)
                new SnCity(this, opts)
            })
        })
    }

})(window, document, jQuery)


