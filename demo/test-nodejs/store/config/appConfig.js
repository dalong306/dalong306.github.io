/**
 * APP 配置
 */

var config = {
	port: 3000,  // 监听端口
	timeout: 10000 , // 超时时间，毫秒
	session: false, // 是否使用 session，开启会增加一个 cookie
	sessionTimeout: 20 * 60 * 1000,  // 会话超时时间，毫秒
	template: {
		'openTag': '{{',  // 逻辑语法开始标签
		'closeTag': '}}',  // 逻辑语法结束标签
		'compress': false  // 是否压缩 HTML 多余空白字符
	}
};

module.exports = config;