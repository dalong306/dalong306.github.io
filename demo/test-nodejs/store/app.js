/*
 * Node.js 中间层采用 Express 4.0 开发
 * 实际部署后，此入口文件不允许开发人员修改
 * 系统配置位于 /config/appConfig.js 内
 * */

var express = require('express');
var app = express();

/*
 * 设置当前运行环境
 * */
app.set('env', process.env.NODE_ENV || 'dev');
var env = app.get('env');

/*
 * 加载配置文件
 * */
var cfg = require('./config/appConfig');

/*
 * 设置端口
 * */
app.set('port', cfg.port || 3000);

/*
 * 关闭 x-powered-by
 * */
app.disable('x-powered-by');

/*
 * 自定义 Server 类型及编码
 * 如果前面有一层 Nginx 则 Server 无效
 * */
var package = require('./package.json');
var AppName = package.name;
var Version = package.version;
app.use(function (req, res, next) {
	res.setHeader('Server', AppName + '/' + Version);
	next();
});


/*
 * 统一设置cdn及varnish缓存时间
 * */
if(env == 'prd'){
	app.use(function (req, res, next) {
		res.setHeader('Cache-Control', 'max-age=3600, s-maxage=3600');
		next();
	});
}

/*
 * 记录系统启动的时间戳，格式为 201408180747
 * 一般作为版本号使用
 * */
require("date-format-lite");
var now = new Date();
app.set('timestamp', now.format('UTC:YYYYMMDDhhmm'));

/*
 * 引入中间件压缩返回的数据
 * 3.x 中这个模块叫做 compress
 * */
var compress = require('compression');
app.use(compress());

/*
 * 引入中间件处理 post 数据
 * 3.x 中这个模块叫做 bodyParser
 * */
var bodyParser = require('body-parser');
app.use(bodyParser());

/*
 * 引入中间件处理 cookie
 * 3.x 中这个模块叫做 cookieParser
 * */
var cookieParser = require('cookie-parser');
app.use(cookieParser('SVNF_COOKIE_SECRET_PLEASE_NOT_MODIFY'));

/*
 * 引入中间件处理 session
 * 默认 session 是保存在内存中
 * app.use(session({ key: 'SVNF_SSID', secret: "SVNF_SESSION_SECRET_PLEASE_NOT_MODIFY", cookie: {maxAge: sessionTimeout}}));
 * 如果需要使用 redis 共享 session，参考 https://github.com/visionmedia/connect-redis
 * var options = {host: '127.0.0.1', port: 6379};
 * app.use(session({ key: 'SVNF_SSID', store: new redisStore(options), secret: "SVNF_SESSION_SECRET_PLEASE_NOT_MODIFY", cookie: {maxAge: sessionTimeout}}));
 * */
if (cfg.session) {
	var session = require('express-session'), 
	redisStore = require('connect-redis')(session);
	var sessionTimeout = cfg.sessionTimeout || 20 * 60 * 1000; // session 过期时间，毫秒
	if (cfg.redis) {
		var options = {host: cfg.redis.host || '127.0.0.1', port: cfg.redis.port || 6379, namespace: "FEX", wipe: sessionTimeout};
		app.use(session({ key: 'SVNF_SSID', store: new redisStore(options), secret: "SVNF_SESSION_SECRET_PLEASE_NOT_MODIFY", cookie: {maxAge: sessionTimeout}}));
	} else {
		app.use(session({ key: 'SVNF_SSID', secret: "SVNF_SESSION_SECRET_PLEASE_NOT_MODIFY", cookie: {maxAge: sessionTimeout}}));
	}
}

/*
 * 本地静态资源文件目录
 * 实际发布前会先构建此目录，然后发布至静态资源服务器
 * */
app.use(express.static(__dirname + '/public'));

/*
 * 模板引擎
 * */
var template = require('art-template');
for (var key in cfg.template) {
	template.config(key, cfg.template[key]);
}
app.engine('html', template.__express);
app.set('view engine', 'html');

/*
 * 定义模板默认目录
 * 实际发布前会先构建此目录
 * */
app.set('views', __dirname + '/views');

/*
 * prd / pre / sit 环境开启模板缓存
 * app.configure 在 4.0 中已不存在
 * */
if ('prd' == env || 'pre' == env || 'sit' == env) {
	app.set('view cache', true);
}

/*
 * 加载域名配置
 * */
require('./config/domain')(app);

/*
 * 引入中间件记录日志
 * */
var log4js = require('log4js');
var logAppenders = [
	{
		type: 'dateFile',
		absolute: true,
		filename: __dirname + '/logs/error',
		maxLogSize: 1024,
		backup: 4,
		pattern: "-yyyy-MM-dd.log",
		alwaysIncludePattern: true,
		category: 'storeFront'
	}
];
log4js.configure({
	appenders: logAppenders
});
var logger = log4js.getLogger('storeFront');
logger.setLevel('ERROR');
log4js.connectLogger(logger, {level: log4js.levels.INFO});
app.set('logger', logger);

/*
 * 404页面统一处理
 *  */
var errPage = require('error-page');

/*
 * 路由规则
 * */
var routingRules = require('./config/routes');
for (var key in routingRules) {
	(function (rule) {
		var modulePath = routingRules[rule];
		if ('undefined' == typeof modulePath || null == modulePath || "" == modulePath) {
			return false;
		}

		// 路由至具体文件
		app.all(rule, function (req, res) {
			try {
				require('./controller/' + modulePath)(req, res, app);
				var timeoutHandle = setTimeout(function () {
					app.emit('timeout', req, res);
				}, cfg.timeout || 5000);
				req.on('end', function () {
					clearTimeout(timeoutHandle);
				});
			} catch (err) {
				/*
				 * 输出错误日志
				 * */
				var errMsg = '';
				if (err.stack) {  // 堆栈错误
					errMsg = err.stack.toString();
					logger.error(errMsg);

				} else { // 自定义错误
					errMsg = err.toString();
					logger.error(err);
				}

				/*
				 * 如果是生产环境返回一个500错误，其他环境则直接抛出错误
				 * */
				if (env == 'prd') {
					errPage(app, res, errMsg);
				} else {
					throw errMsg;
				}
				res.end();
			}
		});
	})(key);
}

/*
 * 超时处理
 * */

var errPage = require('error-page');
app.on('timeout', function (req, res) {
	var url = req.url;
	logger.error('[Error: Response timeout] [' + url + ']');
	res.end('Not found');
});

/*
 * 未匹配到路由规则，则输出404页面
 * */
app.get('*', function (req, res) {
	var url = req.url;
	errPage(app, res, '[Error: Not found] [' + url + ']');
});

/*
 * 启动应用
 * */
app.listen(app.get('port'), function () {
	console.log(AppName + ' server listening on port %d', app.get('port'));
});