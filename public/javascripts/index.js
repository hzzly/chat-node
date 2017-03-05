const socket = io();

const vue = new Vue({
	el: "#chatApp",
	data() {
		return {
			username: '',
			sendMsg: '',
			onlineUser: [],
			msgList: [],
			loginState: false
		}
	},
	mounted() {
		socket.on('post', (say) => {
			this.msgList.push(say)
		})
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
		checkUser(val) {
			if (val == sessionStorage.username) {
				return 'me'
			} else {
				return val
			}
		}
	},
	computed: {
		user() {
			return sessionStorage.username
		}
	},
	methods: {
		doSendMsg() {
			let say = {
				username: this.username,
				msg: this.sendMsg,
				time: new Date()
			}
			socket.emit('post', say)
			this.sendMsg = ''
		},
		confirm() {
			this.loginState = true
			sessionStorage.username = this.username
		}
	}
})