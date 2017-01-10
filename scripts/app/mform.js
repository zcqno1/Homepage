define(["modal", "util", "websites"], function(modal, util, websites) {
	var tplMform = document.getElementById("tpl-mform").innerHTML,
		Action = {
			clickAdd: function(e) {
				websites.addData(getData(e.target.parentElement.parentElement));
				modal.close();
			},

			clickModify: function(e, index) {
				websites.modifyData(getData(e.target.parentElement.parentElement), index);
				modal.close();
			}
		};

	/**
	 * 获取模态窗口表格数据
	 * @param  {HTMLElement} elem 	表单容器
	 * @return {Object}      		表单数据
	 */
	function getData(elem) {
		var data = {title: "", url: "", icon: ""};

		for (var prop in data) {
			if (prop !== "icon") {
				data[prop] = elem.querySelector("#input-" + prop).value;
			}
		}

		return data;
	}

	/**
	 * 填充数据到模态窗口表单
	 * @param  {HTMLElement}	elem 	表单元素容器
	 * @param  {Object} 		data 	填充的数据
	 * @return {NULL}      				无
	 */
	function fillData(elem, data) {

		for (var prop in data) {
			if (prop !== "icon") {
				elem.querySelector("#input-" + prop).value = data[prop];
			}
		}
	}

	return {
		/**
		 * 填充按钮模板
		 * @param  {Object} button 按钮配置数据
		 * @return {String}        填充数据后的内容字符串
		 */
		fillTpl: function(button) {
			return tplMform.replace("{{clickAction}}", button.action).
					replace("{{ok}}", button.text);
		},

		getData: getData,

		fillData: fillData,

		/**
		 * 创建模态表单
		 * @param  {Object} 		data 	表单数据
		 * @return {HTMLElement}      		表单节点
		 */
		create: function(data) {
			var tplStr = this.fillTpl(data.button),
				div = document.createElement("div"),
				elem;

			div.insertAdjacentHTML("beforeend", tplStr);
			elem = div.firstElementChild;

			//如果表单对应某个网址元素，则用相应数据填充
			if (data.targetIndex !== "") {
				this.fillData(elem, websites.data[data.targetIndex]);
			}

			//通过事件路由，绑定表单的相关事件
			util.addClickTapEventListener(elem, function(e) {

				if (e.target.nodeName === "INPUT") {
					e.target.focus();
				} else if (e.target.nodeName === "BUTTON" &&
					e.target.dataset.action !== "closeModal") {
					Action[e.target.dataset.action](e, data.targetIndex);
				}
			}, false);

			return elem;
		}
	};
});