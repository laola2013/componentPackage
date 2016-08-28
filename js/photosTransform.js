(function(win, doc, $) {
    function photosTransform(opitions) {
        this._init(opitions);
    }

    $.extend(photosTransform.prototype, {
        _init: function(opitions) {
            var self = this;
            self.index = 1;
            self.opitions = {
                container: "",
                list: "",
                buttons: "",
                next: "",
                prev: "",
                timer: null,
                index: 1
            }

            $.extend(true, self.opitions, opitions || {});
            self._initDOMEvents();
            return self;
        },

        _initDOMEvents: function() {
            var self = this;
            var opts = this.opitions;
            this.$cont = $(opts.container);
            this.$list = $(opts.list);
            this.$buttons = $(opts.buttons);
            this.$next = $(opts.next);
            this.$prev = $(opts.prev);
            this.$len = $(opts.len);
            this.$active = $(opts.activeClass);
            this.nextPhoto()
                .prevPhoto()
                .showButton();
        },

        nextPhoto: function() {
            var self = this;
            var next = self.$next;
            var width = self.opitions.photoWidth;
            var len = self.opitions.len;
            var container = self.$cont;
            var interval = self.opitions.interval;
            next.on("click", function(e) {
                var index = self.opitions.index;
                if(self.$list.is(":animated")) {
                    return;
                }
                if(index == len) {
                    self.opitions.index = 1;
                } else {
                    self.opitions.index += 1;
                }
                e.preventDefault();
                self.animated(- width);
                self.changeButton(self.opitions.index - 1);
            });

            function autoPlay() {
                self.opitions.timer = setTimeout(function() {
                    next.trigger("click");
                    autoPlay();
                }, interval);
            }
            
            function stopPlay() {
                clearTimeout(self.opitions.timer);
            }

            autoPlay();
            container.hover(stopPlay, autoPlay);

            return self;
        },

        prevPhoto: function() {
            var self = this;
            var prev = self.$prev;
            var width = self.opitions.photoWidth;
            var len = self.opitions.len;
            
            prev.on("click", function(e) {
                var index = self.opitions.index;
                if(self.$list.is(":animated")) {
                    return;
                }
                if(index == 1) {
                    self.opitions.index = len;
                } else {
                    self.opitions.index -= 1;
                }
                e.preventDefault();
                self.animated(width);
                self.changeButton(self.opitions.index - 1);
            });

            return self;
        },

        animated: function(offset) {
            var self = this;
            var newLeft = parseInt(self.$list.css("left")) + offset;
            var width = self.opitions.photoWidth;
            var len = self.opitions.len;
            var speed = self.opitions.speed;

            self.$list.animate({
                left: newLeft
            }, speed, function() {
                if(newLeft > - width) {
                    self.$list.css("left", - width * len);
                } 
                if(newLeft < (- width * len)) {
                    self.$list.css("left", - width);
                }
            });

        },

        showButton: function() {
            var self = this;
            var buttons = self.$buttons;
            var width = self.opitions.photoWidth;
            buttons.on("click", function() {
                if(self.$list.is(":animated") || $(this).attr("class") == "active") {
                    return;
                }
                var index = $(this).index() + 1;
                var nowIndex = self.opitions.index;
                self.opitions.index = index;
                var offset = (nowIndex - index) * width;
                self.changeButton(index - 1);
                self.animated(offset);
            })
            return self;
        },

        changeButton: function(index) {
            var self = this;
            var buttons = self.$buttons;
            var _index = index;
            
            var active = self.opitions.activeClass;
            buttons.eq(_index).addClass(active).siblings().removeClass(active);
        }

    });
    
    win.photosTransform = photosTransform;

})(window, document, jQuery);