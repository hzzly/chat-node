const socket = io();

const vue = new Vue({
	el: "#chatApp",
	data() {
		return {
			msg: {
			    msgId: "m9d74e60b8c94418aa53b51ce160153b4",  //消息ID，"m" + 去了-的UUID
			    source: "u123456",          // 消息来源方用户ID
			    destination: "u567890",  // 消息接收方用户ID
			    roomId: "r1001",               // 聊天室ID
			    messageType: "MSG",           // 消息类型，CONN-建立连接
			    date: new Date(),           // 消息发生的时间，UTC，单位ms
			    category: "HISTORY",              // 消息类别，NEW-常规消息，HISTORY-历史消息
			    tenantId: 12324324,                // 租户ID
			    payload: {
			        code: 200,                                        // 200-正常，其他值-错误
			        content: this.sendMsg ? this.sendMsg : '客户收到客服上线的欢迎语 (转人工/转接其他客服)',                  // 消息内容（正常返回的内容或者错误的描述信息）
			        contentType: 103,                             // 消息内容类型，103-客户收到客服上线
			        ext: {                                                  // 扩展字段，值可能为空
			            "dummy": "",
			        }
			    }
			},
			sendMsg: '',
			msgList: [],
		}
	},
	mounted() {
		socket.on('chatevent', (data) => {
			console.log(data)
			this.msgList.push(data)
		})
	},
	watch: {
		msgList() {
			this.$nextTick(() => {
				window.scrollTo(0,this.$refs.chatBodyEle.scrollHeight)
			})
		}
	},
	filters: {
		formatDate(str) {
			if (!str) return ''
		    var date = new Date(str)
		    var time = new Date().getTime() - date.getTime() //现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
		    if (time < 0) {
		        return ''
		    } else if ((time / 1000 < 30)) {
		        return '刚刚'
		    } else if (time / 1000 < 60) {
		        return parseInt((time / 1000)) + '秒前'
		    } else if ((time / 60000) < 60) {
		        return parseInt((time / 60000)) + '分钟前'
		    } else if ((time / 3600000) < 24) {
		        return parseInt(time / 3600000) + '小时前'
		    } else if ((time / 86400000) < 31) {
		        return parseInt(time / 86400000) + '天前'
		    } else if ((time / 2592000000) < 12) {
		        return parseInt(time / 2592000000) + '月前'
		    } else {
		        return parseInt(time / 31536000000) + '年前'
		    }
		},
	},
	computed: {
	},
	methods: {
		// doSendMsg() {
		// 	let msg = {
		// 		msg: this.sendMsg,
		// 		time: new Date()
		// 	}
		// 	socket.emit('chatevent', msg)
		// 	this.sendMsg = ''
		// },
		send100() {
			this.msg.payload.content = this.sendMsg ? `100${this.sendMsg}` : '100聊天发送的文字消息，欢迎语'
			this.msg.payload.contentType = 100
			socket.emit('chatevent', this.msg)
			this.sendMsg = ''
		},
		send103() {
			this.msg.payload.content = this.sendMsg ? `103${this.sendMsg}` : '103客户收到客服上线的欢迎语 (转人工/转接其他客服)'
			this.msg.payload.contentType = 103
			socket.emit('chatevent', this.msg)
			this.sendMsg = ''
		},
		send651() {
			this.msg.messageType = 'NTF'
			this.msg.payload.content = this.sendMsg ? `651${this.sendMsg}` : '651客服收到新客户转接进来的通知 (主动分配，转接)'
			this.msg.payload.contentType = 651
			socket.emit('chatevent', this.msg)
			this.sendMsg = ''
		},
		send653() {
			this.msg.messageType = 'NTF'
			this.msg.payload.content = this.sendMsg ? `653${this.sendMsg}` : '653排队人数变化'
			this.msg.payload.contentType = 653
			socket.emit('chatevent', this.msg)
			this.sendMsg = ''
		},
		send604() {
			this.msg.messageType = 'NTF'
			this.msg.payload.content = this.sendMsg ? `604${this.sendMsg}` : '604邀请评价'
			this.msg.payload.contentType = 604
			socket.emit('chatevent', this.msg)
			this.sendMsg = ''
		}
	}
})
