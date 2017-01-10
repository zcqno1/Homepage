define({

	/**
	 * 获取格式化的日期
	 * @param  {String} seperator 分隔符
	 * @return {String}           格式化的日期
	 */
	getFmtDate: function(seperator) {
		var now = new Date();

		seperator = seperator || "-";

		return now.getFullYear() + seperator + (now.getMonth() + 1) +
				seperator + now.getDate();
	},

	/**
	 * 获取格式化的时间
	 * @param  {String} seperator 分隔符
	 * @return {String}           格式化的时间
	 */
	getFmtTime: function(seperator) {
		var now = new Date();

		seperator = seperator || ":";

		return now.getHours() + seperator + now.getMinutes() +
				seperator + now.getSeconds();
	},

	/**
	 * 获取格式化的当前时间
	 * @param  {String} dateSeperator 日期分隔符
	 * @param  {String} timeSeperator 时间分隔符
	 * @return {String}          	  格式化的时间
	 */
	getFmtNow: function(dateSeperator, timeSeperator) {
		return this.getFmtDate(dateSeperator) + " " + this.getFmtTime(timeSeperator);
	},

	/**
	 * 判断两个对象是否相同
	 * @param  {Object}  obj1 对象1
	 * @param  {Object}  obj2 对象2
	 * @return {Boolean}
	 */
	isObjEqual: function(obj1, obj2) {

		if (obj1.length !== obj2.length) {
			return false;
		}

		for (var prop in obj1) {
			if (!obj2.hasOwnProperty(prop)) {
				return false;
			}
		}

		return true;
	},

	/**
	 * 分析网址
	 * @param  {String} url 网址
	 * @return {Object}     分析后的数据对象
	 */
	analyzeUrl: function(url) {
		var pattern = /(\w+)\:\/\/([\w.]+)(:\d+)?([\/\w.]+)?(\?[\w\=\-\&\%]*)?(#[\w\S]*)?/,
			result = url.match(pattern),
			detail = {}, hostarr;

		detail.href = url;
		detail.protocol = result[1];
		detail.host = result[2];
		detail.port = result[3] ? result[3].slice(1) : "";
		detail.pathname = result[4] || "";
		detail.search = result[5] || "";
		detail.hash = result[6] || "";

		hostarr = result[2].split(".");

		if (hostarr.length === 2) {
			detail.hostname = hostarr[0];
		} else if (hostarr.length === 3) {
			detail.hostname = hostarr[1].length > 3 ? hostarr[1] : hostarr[0];
		} else {
			detail.hostname = hostarr[1];
		}

		return detail;
	},


	/**
	 * 添加（触屏）点击事件监听器
	 * @param {EventTartet}   elem       事件目标对象
	 * @param {Function} callback   回调函数
	 * @param {Boolean}   useCapture 是否捕获阶段触发
	 */
	addTapEventListener: function(elem, callback, useCapture) {
		var isTimeout = false,
			timeout;

		elem.addEventListener("touchstart", function(e) {
			e.preventDefault();
			e.stopPropagation();
			isTimeout = false;
			timeout = setTimeout(function() {
				isTimeout = true; //如果超时，设置超时状态为true
				clearTimeout(timeout);
			}, 800);
		}, useCapture || false);

		elem.addEventListener("touchend", function(e) {
			e.preventDefault();
			clearTimeout(timeout); //最后清除超时检测延时器
			if (!isTimeout) { //如果超时状态为false时执行回调函数
				callback(e);
			}
		}, useCapture || false);
	},

	/**
	 * 添加（触屏）长按事件监听器
	 * @param {EventTarget}   elem       事件目标对象
	 * @param {Function} callback   回调函数
	 * @param {Boolean}   useCapture 是否捕获阶段触发
	 */
	addLongpressEventListener: function(elem, callback, useCapture) {
		var timeout, startEvent = "touchstart", endEvent = "touchend";

		if (!window.navigator.userAgent.match("Mobile")) {
			startEvent = "mousedown";
			endEvent = "mouseup";
		}

		//下面两个事件监听器的绑定没有对事件进行preventDefault()，是为了保持原来的点击事件
		elem.addEventListener(startEvent, function(e) {
			timeout = setTimeout((function(evt) {
				return function() { //利用闭包将事件对象传给回调函数
					clearTimeout(timeout);
					callback(evt);
				};
			}(e)), 800); //长按超过800ms后执行回调函数
		}, useCapture || false);

		elem.addEventListener(endEvent, function(e) {
			clearTimeout(timeout); //松手后清除延时器，如果触屏未超过800ms，回调函数不会执行
		}, useCapture || false);
	},

	/**
	 * 根据客户端决定绑定点击或轻击事件
	 * @param {HTMLElement}   elem       绑定对象
	 * @param {Function} callback   事件监听响应函数
	 * @param {Boolean}   useCapture 捕获模式
	 */
	addClickTapEventListener: function(elem, callback, useCapture) {
		if (!!window.navigator.userAgent.match("Mobile")) {
			this.addTapEventListener(elem, callback, useCapture);
		} else {
			elem.addEventListener("click", function(e) {
				callback(e);
				// e.stopPropagation();
			}, useCapture);
		}
	},

	/**
	 * 获取当前元素在其父元素中的序号
	 * @param  {HTMLElement} child 子元素
	 * @return {Number}       序号
	 */
	getChildIndex: function(child) {
		return [].indexOf.call(child.parentElement.children, child);
	},

	/**
	 * 随机生成背景颜色值
	 * @return {String} rgba颜色值
	 */
	randomBGC: function(alpha) {
		var rgb = [],
			i;

		for (i = 0; i < 3; i++) {
			rgb[i] = parseInt(Math.random() * 225); //此处用225是为了避免颜色过白
		}

		return "rgba(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ", " + alpha + ")";

		// return "rgba(" + parseInt(Math.random() * 256) + ", " + parseInt(Math.random() * 256) + ", " + parseInt(Math.random() * 256) + ", 0.6)";
	},

	/**
	 * 发起ajax请求
	 * @param  {String}   method   请求方式
	 * @param  {String}   url      请求地址
	 * @param  {Function} callback 回调函数
	 * @param  {String}   data     请求主体
	 * @return {NULL}            无
	 */
	ajax: function(method, url, callback, mime, data) {
		var request = new XMLHttpRequest();

		request.open(method, url);

		if (mime) {
			request.setRequestHeader("Content-Type", mime);
		}

		request.onreadystatechange = function() {
			if (request.readyState === 4 && request.status === 200) {
				var type = request.getResponseHeader("Content-Type");

				if (!mime || (mime && type.indexOf(mime.split("/")[0]) === 0)) {
						callback(request.responseText);
				}

			} else {
				console.log(request.statusText);
			}
		};

		request.send(data);
	},

	/**
	 * 通过JSONP发起跨源请求
	 * @param  {String} url          请求地址
	 * @param  {String} callbackName 回调函数名称
	 * @param  {String} id           请求script元素id
	 * @return {Object}              若未指定callbackName则返回请求得到的json数据
	 */
	getJsonp: function(url, callbackName, id) {
		var newScript = document.createElement("script");

		if (id) {
			newScript.id = id;
		}

		//如果指定了回调函数的名称，则检查是否定义了对应的全局函数
		if (callbackName) {

			//如果存在并正确定义
			if (window[callbackName] && typeof window[callbackName] === "function") {
				newScript.src = url + "&callback=" + callbackName;
				document.body.appendChild(newScript);
			} else { //如果没正确定义，则自定义抛出错误函数
				var _callback_ = window[callbackName];

				window[callbackName] = function() {
					window[callbackName] = _callback_;
					throw new Error("JSONP回调函数" + callbackName + "未正确定义，请检查重试。");
				};
			}

		} else { //如果没指定回调函数名称，则指定一个回调函数，调用之后返回参数数据，并随即删除该回调函数
			if (!window.hasOwnProperty("_jsonp_")) {
				window._jsonp_ = function(data) {
					delete window._jsonp_;
					return data;
				};
			}
		}
	},

	/**
	 * 读取本地文件（图片）
	 * @param  {HTMLElement}   	fileElem 	文件输入控件
	 * @param  {Function} 		callback 	加载成功后回调函数
	 * @return {NULL}            		 	无
	 */
	useLocalFile: function(fileElem, callback) {
		if (fileElem.files.length === 0) { return; } //如果没有选择文件，则直接返回

		var file = fileElem.files[0], //获取第一个文件
			fReader = new FileReader(); //调用文件API创建阅读器实例

		fReader.readAsDataURL(file); //将文件读取为DataURL

		fReader.onload = function(event) {
			callback(event.target.result, file);
		};
	}
});