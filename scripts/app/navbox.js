define(["navitem", "modal", "util"], function(navitem, modal, util) {
	var navBox = document.querySelector("#navbox");
		tplItem = document.querySelector("#tpl-item").innerHTML.trim();

	return {
		/**
		 * 填入网址数据并添加到dom
		 * @param  {Object}   datas    网址数据对象
		 * @param  {Function} callback 对每个网址的回调函数
		 * @return {HTMLElementList}            网址元素列表
		 */
		render: function(datas, callback) {
			datas.forEach(function(data) {
				var div = document.createElement("div"),
					elem;

				//将数据填充到模板，并提取为dom节点
				div.innerHTML = navitem.fillNewItem(tplItem, data);
				elem = div.firstElementChild;

				//给每个网址添加长按事件监听器
				util.addLongpressEventListener(elem, function() {
					modal.open({
						tplModule: "itemopt",
						data: {
							targetIndex: util.getChildIndex(elem)
						}
					});
				}, false);

				callback(elem);
				navBox.appendChild(elem);
			});

			return navBox.children;
		},

		/**
		 * 更新网址
		 * @param  {Number} index 要修改的元素的序号
		 * @param  {Object} data  更改后的数据
		 * @return {NULL}       无
		 */
		renderAt: function(index, data) {
			navitem.modifyItem(navBox.children[index], data);
		},

		/**
		 * 删除网址
		 * @param  {Number} index 网址元素序号
		 * @return {NULL}       无
		 */
		delItem: function(index) {
			navBox.removeChild(navBox.children[index]);
		}
	};

});