(function(win, doc, $) {
	function anchorScroll(opitions) {
		this._init(opitions);
	}
	$.extend(anchorScroll.prototype, {
		_init: function(opitions) {
			var self = this;
			self.opitions = {
				container: "",
				menu: "",
				currentId: "",
				currentClass: ""
			}

			$.extend(true, self.opitions, opitions || {});
			// console.log("hello");
			self._initDOMEvents();
			return self;
		},
		_initDOMEvents: function() {
			var self = this;
			this.$cont = $(self.opitions.container);
			this.$menu = $(self.opitions.menu);
			this.$win = $(win);
			this.$doc = $(doc);	
			this._winScrollEvent()

		},
		_winScrollEvent: function() {
			var self = this;
			var win = self.$win;
			var doc = self.$doc;
			win.scroll(function() {
				var _scrollTop = doc.scrollTop();
				self.floorsTop(_scrollTop);
				self.changeTabStatus();
				
			})
			return self;
		},
		floorsTop: function(sltop) {
			var self = this;
			var floorsClass = self.opitions.floorsClass;
			var floors = self.$cont.find(floorsClass);
			// console.log(floors);
			floors.each(function() {
				var floorTop = $(this).offset().top;
				if(sltop > floorTop - 100) {
					self.opitions.currentId = "#" + $(this).attr("id");
				} else {
					return false;
				}
			})
		},
		changeTabStatus: function() {
			var self = this;
			var tagClass = self.opitions.tagClass;
			var activeClass = self.opitions.activeClass;
			self.opitions.currentClass = self.$menu.find(tagClass);
			if(self.opitions.currentId && self.opitions.currentClass != self.opitions.currentId) {
				self.opitions.currentClass.removeClass(activeClass);
				self.$menu.find("[href=" + self.opitions.currentId + "]").addClass(activeClass);
			}
		}
	})
	win.anchorScroll = anchorScroll;
})(window, document, jQuery);