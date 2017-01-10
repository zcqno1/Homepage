define(["util"], function(util) {
	return {
		/**
		 * 填充新项
		 * @param  {String} tplString 模板字符串
		 * @param  {Object} data      填充的数据
		 * @return {String}           返回填充了数据的字符串
		 */
		fillNewItem: function(tplString, data) {

			for (var prop in data) {
				tplString = tplString.replace("{{" + prop + "}}", data[prop]);
			}

			return tplString;
		},

		/**
		 * 修改项
		 * @param  {HTMLElement} item 项目元素
		 * @param  {Object} data 修改后的数据
		 * @return {NULL}      无
		 */
		modifyItem: function(item, data) {
			item.dataset.website = util.analyzeUrl(data.url).hostname;
			item.children[1].children[0].innerText = data.title;
			item.children[1].children[0].href = data.url;
			item.children[0].src = data.icon;
		},

		/**
		 * 提取项数据
		 * @param  {HTMLElement} item 待提取数据的项
		 * @return {Object}      提取到的数据
		 */
		getItem: function(item) {
			var data = {};

			data.title = item.children[1].children[0].innerText;
			data.url = item.children[1].children[0].href;
			data.icon = item.children[0].src;

			return data;
		}
	};
});