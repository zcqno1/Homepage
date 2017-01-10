define(["search", "util", "configdata"], function(search, util, configdata) {
	var menu = document.querySelector("[data-settings=menu]"),
		tags = menu.getElementsByTagName("li"),
		form = document.querySelector("[data-settings=form]"),
		inputs = form.querySelectorAll("input"),
		content = document.querySelector("[data-settings=content]"),
		i;

	/**
	 * 保存设置到localStorage
	 * @param  {Object} notStoredSettings 未保存的设置对象
	 * @return {NULL}                   无
	 */
	function saveSettings(notStoredSettings) {
		localStorage.settings = JSON.stringify(notStoredSettings);
		localStorage.lastUpdate = util.getFmtDate();
	}


	/**
	 * 获取元素高度
	 * @param  {HTMLElement(List)} elem   HTML元素（列表），元素（如form等）不能有length属性
	 * @param  {Number} offset 弥补偏差
	 * @return {Number}        返回高度
	 */
	function getElemHeight(elem, offset) {
		var height = 0,
			len, i;

		if (elem) {
			len = elem.length;
			if (len) {
				for (i = 0; i < len; i++) {
					height += elem[i].getBoundingClientRect().height;
				}
			} else {
				height = elem.getBoundingClientRect().height;
			}
		}

		return height + (offset || 0);
	}


	/**
	 * 高度跟随
	 * @param  {HTMLElement} ctrlElem  控制元素
	 * @param  {HTMLElement} refElem   高度参考元素
	 * @param  {HTMLElement} traceElem 跟随元素
	 * @return {NULL}
	 */
	function traceHeight(ctrlElem, refElem, traceElem) {
		var changeH, currentH, lastOffset;

		currentH = getElemHeight(refElem); //变化前获取当前变化元素的高度
		lastOffset = (refElem.nextElementSibling ? 20 : 0); //是否是列表最后一个

		ctrlElem.dataset.toggle = this.checked ? "on" : "off"; //refElem.children的display变化

		changeH = getElemHeight(refElem.children); //dd的高度

		if (!(traceElem instanceof Array) && refElem.parentElement.dataset.settings === "options") { //如果是一级选项
			changeH += (this.checked ? refElem.querySelectorAll("[data-toggle=on]").length * 20 : 0); //加上margin-bottom补偿
		}

		//设置内容高度，实现展开收起动画
		refElem.style.height = changeH + "px";

		if (traceElem instanceof Array) {
			for (var i = 0; i < traceElem.length; i++) {
				traceElem[i].style.height = getElemHeight(traceElem[i], this.checked ?  changeH + 20: -currentH - 20) +
						(traceElem[i].style.height === "auto" ? currentH + 20 : 0) + "px";
						//跟随元素高度原本是auto的时候，在上面设置了refElem的高度后，跟随元素现在高度计算值已经减去refElem原来的高度，所以这里考虑加回来
			}
		} else {
			traceElem.style.height = getElemHeight(traceElem, this.checked ? changeH + lastOffset : -currentH - lastOffset) + "px";
		}

		//此处offset前面的20是弥补content的padding-bottom
		//通过下面的console可以看到getBoundingClientRect()得到的高度是动画前的高度，
		//而上面设置的style.height是动画后的高度
		//console.log("nextElem.getBoundingClientRect().height = ", getElemHeight(nextElem) +
		//			"px\nnextElem.style.height = ", nextElem.style.height);
	}


	/**
	 * 设置元素背景颜色及图片
	 * @param {HTMLElement} elem 目标元素
	 * @param {String} bgc  背景颜色值"#ffffff"
	 * @param {String} bgi  背景图片链接
	 */
	function setBackground(elem, bgi, bgc) {
		elem.style.backgroundImage = bgi ? "url(" + bgi + ")" : "";
		elem.style.backgroundColor = bgc || "";
	}


	/**
	 * 根据设置获取背景图片采取的方式
	 * @param  {Object} settings 设置数据
	 * @return {String}          背景图片属性
	 */
	function getBgMode(settings) {
		return settings.useBgImg ? (settings.useOnlineImg ? "onlineImg" : (settings.useSearchImg ? "searchImg" :
				(settings.useLocalImg ? "localImg" : ""))) : "";
	}


	/**
	 * 获取搜索的图片
	 * @param  {String}   keyword  关键词
	 * @param  {Function} callback 对获取结果执行的回调函数
	 * @param  {Number}   width    图片宽度
	 * @param  {Number}   height   图片高度
	 * @return {NULL}            无
	 */
	function getSearchImg(keyword, callback, width, height) {
		var rn, url;

		//如果jsonp回调函数不存在，则全局定义之
		if (!window.searchImgResult) {
			window.searchImgResult = function(returnData) {
				var oData = returnData.data, //数组
					i;

				document.querySelector("#baiduimg").remove(); //将jsonp请求增加的script标签清除，id根据下面添加时传递的id参数
				searchImgResult.data = []; //将缓存器清空，否则更改搜索关键字时可能残留之前的结果
				searchImgResult.max = returnData.displayNum; //搜索结果条目数量

				//将返回图片数据提取到函数的data属性中
				for (i = 0; i < oData.length - 1; i++) {
					if (oData[i] && oData[i].hoverURL) {
						searchImgResult.data.push(oData[i].hoverURL);
					}
				}

				//如果本次返回结果没有有效数据，再次获取，否则执行回调函数
				if (searchImgResult.data.length === 0) {
					getSearchImg(keyword, callback, width, height);
				} else {
					callback(searchImgResult.data.pop()); //调用设置背景回调函数
				}
			};
			window.searchImgResult.keyword = keyword; //记录本次结果对应的关键词
			window.searchImgResult.data = [];
			window.searchImgResult.pn = 0; //记录当前返回结果在搜索结果中的位置
		}

		//如果搜索关键词不变，且上次搜索结果缓存容器不为空
		if (keyword === searchImgResult.keyword && searchImgResult.data.length > 0) {
			callback(searchImgResult.data.pop());
			return;
		}

		rn = 20;
		searchImgResult.pn = searchImgResult.pn + rn;

		//如果超出搜索结果，重头开始
		if (searchImgResult.pn > searchImgResult.max) {
			searchImgResult.pn = 0;
		}

		url = configdata.searchApi.baiduImg.replace("%s", keyword).replace("%pn", searchImgResult.pn).replace("%rn", rn).
			 	replace("%w", width || "").replace("%h", height || "");

		util.getJsonp(url, "searchImgResult", "baiduimg"); //发起跨源脚本请求
		window.searchImgResult.keyword = keyword; //给jsonp回调函数设置keyword属性，因为闭包的关系且无法给该回调函数传参，固在此设置
	}


	/**
	 * 根据数据设置背景图片
	 * @param {Object} settings 设置数据
	 */
	function setBgImg(settings) {
		var mode = getBgMode(settings),
			header = document.querySelector("body>header");

		header.style.backgroundImage = mode ? "url(" + settings[mode] + ")" : ""; //打开某个背景图片时，检测
		settings.bgImgMode = mode ? configdata.bgImgModes[mode] : "";
		header.querySelector("[data-settings=bgImgMode]").innerHTML = settings.bgImgMode;
	}


	/**
	 * 检测设置
	 * @param  {EventObject} event 事件对象
	 * @return {NULL}       无
	 */
	function checkSettings(event) {
		var newSettings = JSON.parse(localStorage.settings),
			header = document.querySelector("body>header"),
			elem, nextElem;

		if (this.name in newSettings) {
			newSettings[this.name] = this.type === "checkbox" ? this.checked : this.value;
		}

		//如果是搜索引擎
		if(this.name === "engine") {
			newSettings.engineName = configdata.engineNames[this.value];
			header.querySelector("[data-settings=engineName]").innerHTML = newSettings.engineName;
			search.set(newSettings.engine, newSettings.engineName);
		}

		//如果是背景颜色
		if (this.name === "bgColor") {
			newSettings.bgColorTag = "<i style='background-color:" + this.value + ";'></i>";
			header.querySelector("[data-settings=bgColorTag]").innerHTML = newSettings.bgColorTag;
			header.style.backgroundColor = this.value;

			if (this.type === "color") {
				var prevSibling = this.previousElementSibling;
				while (prevSibling) {
					prevSibling.children[0].checked = false;
					prevSibling = prevSibling.previousElementSibling;
				}
			}
		}

		// //如果是设置开启与否选项
		if (this.type === "checkbox") {
			elem = this.parentElement.parentElement; //获取input控件外的dt
			nextElem = elem.nextElementSibling;

			//如果是可展开的设置选项，则根据checked值展开或收起选项内容
			if (elem.dataset.settings === "option" && nextElem) {

				if (nextElem.dataset.settings === "option-content" && elem.parentElement.dataset.settings === "options" ||
						nextElem.dataset.settings === "subOptions") {
					traceHeight.call(this, elem, nextElem, content);
				} else if (nextElem.dataset.settings === "option-content" && elem.parentElement.dataset.settings === "subOptions") {
					traceHeight.call(this, elem, nextElem, [elem.parentElement, content]);
				}
			}

			//是否打开刷新btn
			if (this.name === "showRefreshBtn" || this.name === "useSearchImg") {
				tags[tags.length - 1].style.display = this.checked && newSettings.showRefreshBtn ? "inline-block" : "";
			}
		}

		//载入本地图片做背景
		if (this.name === "loadImg") {
			util.useLocalFile(this, function(imgUrl, file) {
				newSettings.localImg = imgUrl;
				newSettings.localImgName = file.name;
				header.querySelector("[data-settings=localImgName]").innerHTML = file.name;
				setBgImg(newSettings);
				saveSettings(newSettings);
			});

			return; //上面onload函数是异步回调函数，所以要在里面更新数据并应用背景，然后在这里返回，不执行下面的操作
		}

		//如果是提交按钮
		if (this.type === "submit") {
			event.preventDefault();

			//如果是API搜索图片
			if (this.name === "searchImgBtn") {
				//获取搜索关键词，如果搜索关键词为空，则使用placeholder建议值，若placeholder也不存在，则搜索”龙珠“
				newSettings.imgKeyword = this.previousElementSibling.value.trim() || this.previousElementSibling.placeholder.split("：")[1] || "龙珠";

				//在getSearchImg的回调函数中保存设置前保存本次设置，以免出现嵌套设置
				saveSettings(newSettings);

				// getSearchImg的回调函数不能直接使用newSettings，异步回调时会有闭包的副作用
				getSearchImg(newSettings.imgKeyword, function(url) {
					var localSettings = JSON.parse(localStorage.settings);

					localSettings.searchImg = url;
					setBgImg(localSettings);
					saveSettings(localSettings);
				});

				return;
			}

			//如果是在线图片或在线图片api
			if (this.name === "onlineImgBtn") {
				newSettings.onlineImg = this.previousElementSibling.value;
			}
		}

		setBgImg(newSettings);
		saveSettings(newSettings);
	}


	//绑定菜单点击事件，使用事件路由
	util.addClickTapEventListener(menu, function(e) {
		var target = e.target,
			targetContent = null;

		//将target定位到li
		target = target.parentElement.nodeName === "LI" ? target.parentElement : target;

		//如果点击在tag上
		if (target.nodeName === "LI") {
			targetContent = document.querySelector("[data-settings=" + target.dataset.settings + "-content]");

			//如果时刷新按钮，则调用更新图片函数
			if (target.dataset.settings === "refresh") {
				var localSettings = JSON.parse(localStorage.settings);

				getSearchImg(localSettings.imgKeyword, function(url){
					localSettings.searchImg = url;
					setBgImg(localSettings);
					saveSettings(localSettings);
				});

				return;
			}

			//菜单按钮反应切换
			if (target.classList.contains("active")) {
				target.classList.remove("active");
				targetContent.classList.remove("active");
				content.style.height = 0;
				setTimeout(function() {
					content.style.display = "none";
				}, 500); //等收起动效完成再隐藏, 500ms根据css中的持续时间决定
			} else {

				for (var j = 0; j < tags.length; j++) {
					tags[j].classList.remove("active");
					content.children[j].classList.remove("show", "active");
				}

				target.classList.add("active");
				content.style.display = "block"; //加载内容前显示容器
				targetContent.classList.add("active"); //然后加载内容，以便下面获取内容高度，此处的active与target的active不同
				content.style.height = getElemHeight(targetContent, 20) + "px"; //设置选项容器高度，20是考虑padding
				targetContent.classList.add("show"); //内容出现动效，不能紧接add("active")，否则无效果
			}
		}
	});


	//设置表单元素绑定onchange事件，触发检测设置函数
	for (i = 0; i < inputs.length; i++) {

		//跳过文本框
		if (inputs[i].type !== "text") {
			var event = inputs[i].type === "submit" ? "click" : "change"; //如果是submit按钮则为click事件，否则为change事件
			inputs[i].addEventListener(event, checkSettings.bind(inputs[i]), false);
		}
	}


	return {

		/**
		 * 获取本地设置数据
		 * @return {Object} 设置数据对象
		 */
		getData: function() {

			//如果本地没有相关数据，则返回预设数据，并保存到本地储存
			if (!localStorage.settings) {
				localStorage.settings = JSON.stringify(configdata.presettings);
				return configdata.presettings;
			}

			return JSON.parse(localStorage.settings);
		},


		/**
		 * 根据本地数据进行初始化
		 * @param  {Object} settings 本地设置数据对象
		 * @return {NULL}          无
		 */
		init: function(settings) {
			var	key, option, len, span, i;

			for (key in settings) {

				//如果数据值为布尔类型，对应控件为checkbox
				if (typeof settings[key] === "boolean") {
					form[key].checked = settings[key];

					//如果是属于二级列表
					if (key.indexOf("use") === 0 && key !== "useBgImg" && settings[key] === true) {
						elem = form[key].parentElement.parentElement;
						nextElem = elem.nextElementSibling;
						elem.dataset.toggle = "on";
						nextElem.style.height = "auto";
					}

					//刷新按钮是否显示
					if (settings.useSearchImg && key === "showRefreshBtn" && settings[key]) {
						tags[tags.length - 1].style.display = "inline-block";
					}

				} else if (form[key]) { //如果存在对应input控件
					len = form[key].length; //key对应控件只有一个时，len为undefined，不影响下面逻辑

					//如果同一个name对应多个控件
					if (len > 1) {

						//检测是否存在控件值与之相同
						for (i = 0; i < len; i++) {
							if (form[key][i].value === settings[key]) {
								form[key].value = settings[key];
								break;
							}
						}

						//如果不存在等值控件，则最后一个应为自定义控件
						if (i === len) {
							[].forEach.call(form[key], function(e) {e.checked = false;});
							form[key][len - 1].checked = true;
							form[key][len - 1].value = settings[key];
						}

					} else {
						form[key].value = settings[key];
					}

				} else { //其余的为相关显示数据，如果存在则设置
					span = form.querySelector("[data-settings=" + key + "]");

					if (span) {
						span.innerHTML = settings[key];
					}
				}
			}

			//如果使用图片背景为真
			if (settings.useBgImg) {
				nextElem = document.querySelector("[data-settings=subOptions]");
				elem = nextElem.previousElementSibling;
				elem.dataset.toggle = "on";
				nextElem.style.height = "auto"; //将次级列表高度打开，打开设置项的时候保持可见
			}

			//设置背景及搜索引擎设置
			setBackground(document.querySelector("body>header"), settings.useBgImg ? settings[getBgMode(settings)] : "", settings.bgColor);
			search.set(settings.engine, settings.engineName);
		}
	};
});
