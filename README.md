
### 一个Node的socket.io简单聊天室

##### [点击查看效果](http://hjingren.cn:3000/)

> * Socket.IO用于浏览器与Node.js之间实现实时通信。
> * Socket.IO设计的目标是支持任何的浏览器，任何Mobile设备。
> * 支持主流的PC浏览器 (IE,Safari,Chrome,Firefox,Opera等)，
> * Mobile浏览器(iphone Safari/ipad Safari/Android WebKit/WebOS WebKit等)。
>
> * Socket.IO解决了实时的通信问题，并统一了服务端与客户端的编程方式。
> * 启动了socket以后，就像建立了一条客户端与服务端的管道，两边可以互通有无。

## 一、初始化一个Express项目

通过应用生成器工具 express 可以快速创建一个应用的骨架。

```Node
// 全局安装express 脚手架
$ npm install express-generator -g

//在当前工作目录创建一个命名为 chat-node 的应用
$ express -e chat-node

//安装所有依赖
$ cd chat-node 
$ npm install

//启动这个应用（MacOS 或 Linux 平台）：
$ npm start
```

然后在浏览器中打开 http://localhost:3000/ 网址就可以看到这个应用了

## 二、安装Socket.IO

这里使用 npm 安装到项目依赖中
 
```Node
$ npm install socket.io --save
```

<!--more-->

## 三、整合Socket.IO到项目中

找到服务开启的www文件

>根目录 > bin > www

```JavaScript
//在创建服务器(var server = http.createServer(app))之后添加如下代码

var io = require('socket.io')(server);

// 在线用户
var onlineUser = {};
// 在线人数
var onlineCount = 0;

io.on('connection', (socket) => {

  // 监听新用户加入
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  //监听post数据加入
  socket.on('post', function(say) {
    io.emit('post', say)   //通过io的emit把数据发送到前台
  });
});
```

通过传递server(HTTP服务器)来初始化socket.io的一个新实例，然后监听连接sockets的connection事件，并将其记录到控制台。

## 三、修改前台代码

在 views 目录下新建一个index.html

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
	<title>聊天室</title>
</head>
<body>
<div class="chat" id="chatApp" v-cloak>
    <ul class="room-list">
    	<li v-for="item in msgList">
    		<div class="msg-detail">{{item}}</div>
    	</li>
    </ul>
    <div class="send-box">
    	<input type="text" placeholder="写点什么喃..." v-model="sendMsg">
    	<button type="button" @click="doSendMsg">发送</button>
    </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.7.3/socket.io.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.1.3/vue.js"></script>
<script src="/javascripts/index.js"></script>
</body>
</html>
```

我在里面引入了socket.io以及vue(更好的渲染数据)

## 四、编写业务代码

>在 public > javascripts 下新建一个index.js

```JavaScript
const socket = io();  //加载socket.io-client会暴露一个全局io并连接。

const vue = new Vue({  //实例化一个Vue实例
	el: "#chatApp",
	data() {
		return {        //数据驱动
			sendMsg: '',
			msgList: []
		}
	},
	mounted() {             
		socket.on('post', (say) => {   //接收服务端的 post 命令
			this.msgList.push(say)       //添加到msgList中给前台渲染出来
		})
	},
	methods: {
		doSendMsg() {                  //监听按钮发送的事件
			socket.emit('post', this.sendMsg)    //把要发送的数据emit到服务端
			this.sendMsg = ''
		}
	}
})
```

## 五、在对应路由中打开index.html

>在 routes > index.js 修改如下代码

```JavaScript
/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views', 'index.html'));
});
```
然后在浏览器中打开 http://localhost:3000/ 网址就可以看到这个应用de效果了

![chat-node1](https://hzzly.github.io/img/chat-node1.gif)

