define({
	engineNames:  {
		google: "谷歌",
		baidu: "百度",
		bing: "必应"
	},

	bgImgModes: {
		localImg: "本地图片",
		searchImg: "API搜索图片",
		onlineImg: "在线图片"
	},

	presettings: {
		engine: "baidu",
		engineName: "百度",
		bgColor: "#22B2D1",
		bgColorTag: "<i style='background-color:#22B2D1;'></i>",
		useBgImg: false,
		useLocalImg: false,
		useSearchImg: false,
		useOnlineImg: false,
		bgImgMode: "API搜索图片",
		localImg: "",
		localImgName: "",
		searchImg: "",
		onlineImg: "",
		imgKeyword: "",
		showRefreshBtn: false
	},

	searchApi: {
		google: "https://www.google.com/webhp#q=%s",
		baidu: "https://www.baidu.com/s?wd=%s",
		bing: "https://www.bing.com/search?q=%s",
		baiduImg: "http://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&fp=result&ie=utf-8&oe=utf-8&word=%s&width=%w&height=%h&pn=%pn&rn=%rn",
		bingHPCN: "http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&nc=1483613362423&pid=hp&video=1", //idx以今天为0往前数，如idx=1获取前一天的数据；n指返回几天的数据
		bingHPGlobal: "http://global.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&nc=1483648245183&pid=hp&FORM=HPCNEN&setmkt=en-us&setlang=en-us&video=1&fav=1",
		mbingHPCN: "http://cn.bing.com/ImageResolution.aspx?w=%w&h=%h&t=%t", //移动端。t是日期，如t=201716；会根据w和h返回合适规格（不完全一致）的图片
		mbingHPGlobal: "http://cn.bing.com/ImageResolution.aspx?w=%w&h=%h&hash=791a86d5b792015effc20ef0208a2989&FORM=HPCNEN&setmkt=en-us&setlang=en-us", //移动端
		ihuanJson: "http://tu.ihuan.me/tu/api/me_all_pic_json/",
		ihuanPic: "http://tu.ihuan.me/api/me_all_pic_go",
	},

	dataPreset: [
		{
			title: "Dribbble",
			url: "http://dribbble.com/",
			icon: ""
		},
		{
			title: "知乎",
			url: "https://www.zhihu.com/",
			icon: ""
		},
		{
			title: "海绵",
			url: "http://cqzone.ga/",
			icon: ""
		},
		{
			title: "Pinterest",
			url: "https://www.pinterest.com/",
			icon: ""
		},
		{
			title: "简书",
			url: "http://www.jianshu.com/",
			icon: ""
		},
		{
			title: "Stack Overflow",
			url: "http://stackoverflow.com/",
			icon: ""
		},
		{
			title: "Github",
			url: "https://github.com/",
			icon: ""
		}
	]

});