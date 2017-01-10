define(["util", "navbox", "configdata"], function(util, navbox, configdata){
	return {
		data: [],

		dataPreset: configdata.dataPreset,

		reset: function() {
			window.localStorage.websites = JSON.stringify(this.dataPreset);
			window.localStorage.lastUpdate = util.getFmtNow();
		},

		getData: function(){

			//如果localStorage没有数据，则用预设数据对其进行初始化
			if(window.localStorage.length === 0){
				this.reset();
				this.dataPreset.forEach(function(data) {
					data.icon = data.url + "favicon.ico";
				});
				this.data = this.dataPreset;
			} else {
				this.data = JSON.parse(window.localStorage.websites);
			}
		},

		updateLocalStorage: function() {
			window.localStorage.websites = JSON.stringify(this.data);
			window.localStorage.lastUpdate = util.getFmtNow();
		},

		delData: function(index) {
			this.data.splice(index, 1);
			this.updateLocalStorage();
			navbox.delItem(index);
		},

		modifyData: function(website, index) {
			for (var prop in website) {
				this.data[index][prop] = website[prop];
			}
			this.updateLocalStorage();
			navbox.renderAt(index, website);
		},

		addData: function(website) {
			this.data.push(website);
			this.updateLocalStorage();
			navbox.renderAll([website]);
		}

	};

});