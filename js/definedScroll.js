(function(win, doc, $) {
	function cusScrollBar(opitions) {
		this._init(opitions);
	}
	$.extend(cusScrollBar.prototype, {
		_init: function(opitions) {
			// console.log('hello world');
			var self = this;
			self.opitions = {
				scrollDir: "y",
				contSelector: "",
				barSelector: "",
				sliderSelector: "",
				tabItemSelector: "",
				tabActiveClass: "",
				anchorSelector: "",
				correctSelector: "", 
				articleSelector: "",
				wheelStep: 10
			}
			$.extend(true, self.opitions, opitions || {});
			self._initDomEvent();
			
			return self;
		},

		_initDomEvent: function() {
			var opts = this.opitions;
			this.$cont = $(opts.contSelector);
			
			this.$slider = $(opts.sliderSelector);
			this.$bar = opts.barSelector ? $(opts.barSelector) : self.$slider.parent();
			this.$doc = $(doc);
			this.$tabItem = $(opts.tabItemSelector);
			this.$anchor = $(opts.anchorSelector);
			this.$correct = $(opts.correctSelector);
			this.$article = $(opts.articleSelector);
			// console.log(this.$slider)
			this._initSliderEvent()
				._bindContScroll()
				._bindMousewheel()
				._initTabEvent()
				._initArticleHeight();
		},

		_initSliderEvent: function() {
			var slider = this.$slider,
				sliderEl = slider[0],
				self = this;
				// console.log(sliderEl);
				if(sliderEl) {
					var doc = this.$doc,
						dragStartPagePosition,
						dragStartScrollPosition,
						dragContBarRate;

					function mousemoveHandler(e) {
						e.preventDefault();
						if(dragStartPagePosition == null) {
							return;
						}
						self.scrollTo(dragStartScrollPosition + (e.pageY - dragStartPagePosition) * dragContBarRate);
					}
					slider.on("mousedown", function(e) {
						e.preventDefault();
						dragStartPagePosition = e.pageY;
						dragStartScrollPosition = self.$cont[0].scrollTop;
						dragContBarRate = self.getMaxScrollPosition()/self.getMaxSliderPosition();
						doc.on("mousemove.scroll", mousemoveHandler)
						.on("mouseup.scroll", function(e) {
							doc.off(".scroll");
						})
					});
				}
				return self;
		},

		getMaxScrollPosition: function() {
			var self = this;
			return Math.max(self.$cont.height(), self.$cont[0].scrollHeight - self.$cont.height());
		},

		getMaxSliderPosition: function() {
			var self = this;
			return self.$bar.height() - self.$slider.height();
		},

		getAllAnchorHeight: function() {
			var self = this,
				allPositionArr = [];
			for(var i=0; i<self.$anchor.length; i++) {
				
				allPositionArr.push(self.$cont[0].scrollTop + self.getAnchorPosition(i));
				// console.log(allPositionArr[i]);
			}

			return allPositionArr;
		},

		getAnchorPosition: function(index) {
			var self = this;
			var top = self.$anchor.eq(index).position().top;
			// console.log(top);
			return top;
		},

		scrollTo: function(val) {
			var self = this;
			// console.log(val);
			var posArr = self.getAllAnchorHeight();
			function getIndex(val) {
				for(var i=posArr.length-1; i>=0; i--) {
					if(posArr[i] <= val) {
						return i;
					} else {
						continue;
					}
				}
			}

			if(self.$anchor.length == self.$tabItem.length) {
				self.changeTabSelector(getIndex(val));
			}
			self.$cont.scrollTop(val);
			// var top = self.$cont.scrollTop();
			// console.log(self.$cont.scrollTop());
		},

		_bindContScroll: function() {
			var self = this;
			self.$cont.on("scroll", function() {
				var sliderEl = self.$slider && self.$slider[0];
				if(sliderEl) {
					sliderEl.style.top = self.getSliderPosition() + 'px';
				}
			});

			return self;
		},

		getSliderPosition: function() {
			var self = this,
				maxSliderPosition = self.getMaxSliderPosition();
				return Math.min(maxSliderPosition, maxSliderPosition * self.$cont[0].scrollTop / self.getMaxScrollPosition());
		},

		_bindMousewheel: function() {
			var self = this;
			self.$cont.on("mousewheel DOMMouseScroll",
				function(e) {
					e.preventDefault();
					var oEv = e.originalEvent,
						wheelRange = oEv.wheelDelta ? - oEv.wheelDelta/120 : (oEv.detail || 0)/3;

					self.scrollTo(self.$cont[0].scrollTop + wheelRange * self.opitions.wheelStep);
				});

			return self;
		},

		_initTabEvent: function() {
			var self = this;
			self.$tabItem.on("click", function(e) {
				e.preventDefault();
				var index = $(this).index();
				self.changeTabSelector(index);
				self.scrollTo(self.$cont[0].scrollTop + self.getAnchorPosition(index));
			});

			return self;
		},

		_initArticleHeight: function() {
			var self = this,
				lastArticle = self.$article.last();
			var lastArticleHeight = lastArticle.height(),
				contHeight = self.$cont.height();

			if(lastArticleHeight < contHeight) {
				self.$correct[0].style.height = contHeight - lastArticleHeight - self.$anchor.outerHeight() + 'px';
			}

			return self;
		},

		changeTabSelector: function(index) {
			var self = this,
				active = self.opitions.tabActiveClass;

			return self.$tabItem.eq(index).addClass(active).siblings().removeClass(active);
		},

	});

	win.cusScrollBar = cusScrollBar;
})(window, document, jQuery);