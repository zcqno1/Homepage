define(["util", "require"], function(util, require) {
	var modalBox = document.getElementById("modal-box");

	//通过事件路由绑定关闭模态窗口事件
	util.addClickTapEventListener(modalBox, function(e) {

		//如果点击的地方是模态窗口本身（遮罩）或取消按钮
		if (e.target === modalBox || e.target.dataset.action === "closeModal") {
			close();
		}
	}, false);

	/**
	 * 关闭模态窗口
	 * @return {NULL} 无
	 */
	function close() {
		modalBox.classList.remove("modal--active");
		modalBox.classList.add("modal--inactive");
		empty();
	}

	/**
	 * 清空模态窗口内容
	 * @return {NULL} 无
	 */
	function empty() {
		modalBox.innerHTML = "";
	}

	return {

		/**
		 * 根据配置项打开响应模态窗口
		 * @param  {Object}	config	配置对象
		 * @return {NULL}			无
		 */
		open: function(config) {
			this.empty(); //先清空模态窗口内容
			config = config || {
				tplModule: "mform", //内容模板
				data: {
					title: "", //内容窗口标题
					button: { //按钮名称及对应事件
						text: "添加",
						action: "clickAdd"
					},
					targetIndex: ""
				}
			};

			//根据配置选择加载模块
			require([config.tplModule], function(mod) {
				modalBox.appendChild(mod.create(config.data));
				modalBox.classList.remove("modal--inactive");
				modalBox.classList.add("modal--active");
			});
		},

		close: close,
		empty: empty
	};
});