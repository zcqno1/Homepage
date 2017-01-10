define(["util", "configdata"], function(util, configdata) {
	var searchForm = document.querySelector("[data-action=submitSearch]"),
		searchBar = document.querySelector("#search-bar"),
		Action = {
			submitSearch: function(e) {
				e.preventDefault();
				window.location = configdata.searchApi[searchForm.dataset.engine].replace("%s", searchBar.value);
			}
		};

	//搜索框提交事件
	searchForm.addEventListener("submit", Action[searchForm.dataset.action], false);


	return {
		set: function(engine, engineName) {
			searchForm.dataset.engine = engine;
			searchBar.placeholder = engineName + "搜索";
		}
	};
});