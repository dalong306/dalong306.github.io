## 环境相关

下载安装 node.js， Linux需要编译安装，过程略。下载地址：http://nodejs.org/download/


设置代理 

	npm config set proxy=http://10.19.110.31:8080
	npm config set https-proxy=http://10.19.110.31:8080

安装开发环境必须的全局模块	

	npm install supervisor -g
	npm install forever -g

添加环境变量

	NODE_ENV=prd 或 pre 或 sit

*开发环境可以不添加该环境变量，默认为dev*

开发环境启动服务

	supervisor -e js,html,css app


## 开发过程相关


在控制器内如何获取传递的各类参数

	路由传递的参数：req.params
	post的参数：req.body
	get的参数：req.query

设置 cookie

	res.cookie('name', 'tobi', { path: '/', expires: new Date(Date.now() + 900000), httpOnly: true });
	res.cookie('name', 'tobi', { signed: true }); // 设置签名的cookie，防止客户端篡改


读取 cookie

	req.cookies.name;
	req.signedCookies.name;

删除 cookie

	res.clearCookie('name', { path: '/' });

设置 session

	req.session.user = {name : 'pangnate'};

读取 session

	req.session.user;

删除 session
	
	req.session.destroy(function(){});  // 清空 session
	req.session.destroy(key, function(){});  // 删除单个 session

