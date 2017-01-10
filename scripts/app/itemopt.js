define(["util", "websites", "modal"], function(util, websites, modal) {
	var tplItemOpt = document.getElementById("tpl-itemopt").innerHTML;
	var Action = {
		clickModify: function(e, index) {
			modal.open({
				tplModule: "mform",
				data: {
					title: "",
					button: {
						text: "修改",
						action: "clickModify"
					},
					targetIndex: index
				}
			});
		},

		clickDelete: function(e, index) {
			websites.delData(index);
			modal.close();
		}
	};

	return {
		/**
		 * 生成网址选项
		 * @param  {Object} data 选项数据
		 * @return {[type]}      [description]
		 */
		create: function(data) {
			var div = document.createElement("div"),
				elem = null;

			div.insertAdjacentHTML("beforeend", tplItemOpt);
			elem = div.firstElementChild;

			util.addClickTapEventListener(elem, function(e) {
				var action = e.target.dataset.action;

				if (action !== "closeModal") {
					Action[action](e, data.targetIndex);
				}
			});

			return elem;
		}
	};
});