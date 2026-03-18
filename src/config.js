const config = {
	//网页元数据
	metaData: {
		title: 'Yuoooka的个人主页',
		description: '欢迎来到Yuoooka的奇妙世界！',
		keywords: 'Yuoooka,Yuoooka,个人主页,个人网站',
		icon: '/favicon.ico'   //网页图标，支持外链
	},

	avatar: "/img/avatar.jpg", // 头像
	welcometitle: "Hi, I'm Yuoooka", // 标题

	// 颜色配置
	color: {
		themecolor: "#D1FFEC", // 主题颜色，推荐趋于亮白可带有轻微色调，例： #D1FFEC
		welcometitlecolor: "#FFFFFF", // 标题颜色 例： #7BFFC9
		turntablecolor1: "#bebeaf",  // 转盘渐变色一
		turntablecolor2: "#00FFFF"   // 转盘渐变色二
	},

	brightness: 85, // 背景亮度 --%
	blur: 5, // 毛玻璃模糊效果

	// 我的标签
	tags: [],

	// 默认背景壁纸
	background: {
		"pc": {   //pc端
			"type": "pic",   //"pic":静态壁纸;"video":动态壁纸
			"datainfo": {
				"title": "默认PC",
				"preview": "/img/wallpaper/static/default/bg.jpg",
				"url": "/img/wallpaper/static/default/bg.jpg",     //当然，也可填写网络地址或壁纸api，如随机PC壁纸api："url":"https://t.mwm.moe/pc"
			},
		},
		"mobile": {   //移动端
			"type": "pic",
			"datainfo": {
				"title": "默认移动端",
				"preview": "/img/wallpaper/static/default/bg2.png",
				"url": "/img/wallpaper/static/default/bg2.png"  //同理，随机移动端壁纸："url":"https://t.mwm.moe/mp"
			}
		}

	},

	//极坐标图数据
	polarChart: {
		skills: ['Vue.js', 'React', 'JavaScript', 'Node', 'Java', 'Python', 'linux', 'Docker', 'MySQL', 'MongoDB', 'AWS'],
		skillPoints: [85, 78, 88, 90, 80, 78, 85, 65, 82, 78, 70],
	},

	//社交按钮
	socialPlatformIcons: [
		{ icon: "mdi-github", link: "https://www.github.com/Yuoooka" },
		{ icon: "mdi-email", link: "mailto:Yuoooka@foxmail.com" },
		{ icon: "mdi-qqchat", link: "https://im.qq.com/" },
		{ icon: "mdi-wechat", link: "https://wx.qq.com/" },
		{ icon: "mdi-youtube", link: "https://www.youtube.com" },
		{ icon: "mdi-facebook", link: "https://www.facebook.com" }
	],

	//打字机
	typeWriterStrings: [
		"no game no life",
		"顶峰的少年，给了你所有细节，你却说我不是迪迦，给不了你想要的光。",
		"心简单，世界就简单，幸福才会生长；心自由，生活就自由，到哪都有快乐。",
		"生命太短，没有时间留给遗憾，若不是终点，请微笑一直向前。"
	],

	//音乐播放配置，采用MetingJS Api(https://github.com/metowolf/MetingJS)
	musicPlayer: {
		server: 'netease',  //服务提供商 --网易云音乐
		type: 'playlist',   //歌单类型
		id: '2028178887'  //歌单id ---> music.163.com/#/playlist?id=2028178887
	},

	//壁纸数据 -----可以将壁纸文件上传到图床获取网络直链。若想调用api，请前往脚本自行修改逻辑
	wallpaper: {
		pic: [
			{ "title": "默认PC", "preview": "/img/wallpaper/static/default/bg.jpg", "url": "/img/wallpaper/static/default/bg.jpg" },
		],
		picMobile: [
			{ "title": "默认移动端", "preview": "/img/wallpaper/static/default/bg2.png", "url": "/img/wallpaper/static/default/bg2.png" },
		],
		video: [],
		videoMobile: [],
	},

	//项目卡片 其中 字段"show"控制初始卡片的text是否展开
	projectcards: [
		{ go: "🚀 前往", img: "/img/default-cover.png", title: "博客", subtitle: "Record of life", text: "记录生活点滴与技术积累", url: "internal:blog", show: false },
		{ go: "🗂️ 前往", img: "/img/default-cover.png", title: "标签", subtitle: "Tags of articles", text: "按标签分类查找文章", url: "internal:tags", show: false },
		{ go: "📝 前往", img: "/img/default-cover.png", title: "归档", subtitle: "Timeline of posts", text: "按时间归档查看所有文章", url: "internal:archives", show: false },
		{ go: "👍 前往", img: "/img/default-cover.png", title: "友链", subtitle: "Friends links", text: "友情链接与互访", url: "internal:links", show: false },
		{ go: "📊 前往", img: "/img/default-cover.png", title: "技术栈", subtitle: "Tech Stack", text: "我的技术栈分布", url: "internal:skills", show: false },
		{ go: "📚 前往", img: "/img/default-cover.png", title: "系列", subtitle: "Series of articles", text: "系列文章专栏", url: "internal:series", show: false },
		{ go: "💬 前往", img: "/img/default-cover.png", title: "留言板", subtitle: "Guestbook & Comments", text: "欢迎留下你的足迹", url: "internal:guestbook", show: false },
		{ go: "👤 前往", img: "/img/default-cover.png", title: "关于我", subtitle: "About Me", text: "了解更多关于我的信息", url: "internal:about", show: false },
	],

	statement: ["2026 Yuoooka"],
}

export default config