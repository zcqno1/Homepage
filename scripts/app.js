require.config({
	baseUrl: "scripts/app/",
	paths: {
		lib: "../lib"
	}
});

require(["websites", "navbox", "settings", "modal", "util"],
	function(websites, navbox, settings, modal, util) {

		var	btnAdd = document.querySelector("[data-action=clickModal]"),
			isMobile = !!window.navigator.userAgent.match("Mobile");

		var Action = {
			clickModal: function(e) {
				modal.open({
					tplModule: "mform",
					target: e.target,
					data: {
						button: {
							title: "",
							text: "添加",
							action: "clickAdd"
						}
					}
				});
			}
		};


		websites.getData();

		navbox.render(websites.data, function(item) {
			item.style.backgroundColor = util.randomBGC(0.6);
		});

		settings.init(settings.getData());

		util.addClickTapEventListener(btnAdd, Action[btnAdd.dataset.action], false);

});






