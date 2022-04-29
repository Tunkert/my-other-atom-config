(function() {
  module.exports = function(colorPicker) {
    return {
      Emitter: (require('../modules/Emitter'))(),
      element: null,
      control: null,
      canvas: null,
      getHue: function() {
        if ((this.control && this.control.selection) && this.element) {
          return this.control.selection.y / this.element.getHeight() * 360;
        } else {
          return 0;
        }
      },
      emitSelectionChanged: function() {
        return this.Emitter.emit('selectionChanged', this.control.selection);
      },
      onSelectionChanged: function(callback) {
        return this.Emitter.on('selectionChanged', callback);
      },
      emitColorChanged: function() {
        return this.Emitter.emit('colorChanged', this.control.selection.color);
      },
      onColorChanged: function(callback) {
        return this.Emitter.on('colorChanged', callback);
      },
      activate: function() {
        var Body;
        Body = colorPicker.getExtension('Body');
        this.element = {
          el: (function() {
            var _classPrefix, _el;
            _classPrefix = Body.element.el.className;
            _el = document.createElement('div');
            _el.classList.add(_classPrefix + "-hue");
            return _el;
          })(),
          width: 0,
          height: 0,
          getWidth: function() {
            return this.width || this.el.offsetWidth;
          },
          getHeight: function() {
            return this.height || this.el.offsetHeight;
          },
          rect: null,
          getRect: function() {
            return this.rect || this.updateRect();
          },
          updateRect: function() {
            return this.rect = this.el.getClientRects()[0];
          },
          add: function(element) {
            this.el.appendChild(element);
            return this;
          }
        };
        Body.element.add(this.element.el, 2);
        colorPicker.onOpen((function(_this) {
          return function() {
            var _rect;
            if (!(_this.element.updateRect() && (_rect = _this.element.getRect()))) {
              return;
            }
            _this.width = _rect.width;
            return _this.height = _rect.height;
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var Hue, _context, _elementHeight, _elementWidth, _gradient, _hex, _hexes, _i, _step, i, len;
            Hue = _this;
            _elementWidth = _this.element.getWidth();
            _elementHeight = _this.element.getHeight();
            _hexes = ['#f00', '#ff0', '#0f0', '#0ff', '#00f', '#f0f', '#f00'];
            _this.canvas = {
              el: (function() {
                var _el;
                _el = document.createElement('canvas');
                _el.width = _elementWidth;
                _el.height = _elementHeight;
                _el.classList.add(Hue.element.el.className + "-canvas");
                return _el;
              })(),
              context: null,
              getContext: function() {
                return this.context || (this.context = this.el.getContext('2d'));
              },
              getColorAtPosition: function(y) {
                return colorPicker.SmartColor.HSVArray([y / Hue.element.getHeight() * 360, 100, 100]);
              }
            };
            _context = _this.canvas.getContext();
            _step = 1 / (_hexes.length - 1);
            _gradient = _context.createLinearGradient(0, 0, 1, _elementHeight);
            for (_i = i = 0, len = _hexes.length; i < len; _i = ++i) {
              _hex = _hexes[_i];
              _gradient.addColorStop(_step * _i, _hex);
            }
            _context.fillStyle = _gradient;
            _context.fillRect(0, 0, _elementWidth, _elementHeight);
            return _this.element.add(_this.canvas.el);
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var Hue, hasChild;
            hasChild = function(element, child) {
              var _parent;
              if (child && (_parent = child.parentNode)) {
                if (child === element) {
                  return true;
                } else {
                  return hasChild(element, _parent);
                }
              }
              return false;
            };
            Hue = _this;
            _this.control = {
              el: (function() {
                var _el;
                _el = document.createElement('div');
                _el.classList.add(Hue.element.el.className + "-control");
                return _el;
              })(),
              isGrabbing: false,
              selection: {
                y: 0,
                color: null
              },
              setSelection: function(e, y, offset) {
                var _height, _position, _rect, _width, _y;
                if (y == null) {
                  y = null;
                }
                if (offset == null) {
                  offset = null;
                }
                if (!(Hue.canvas && (_rect = Hue.element.getRect()))) {
                  return;
                }
                _width = Hue.element.getWidth();
                _height = Hue.element.getHeight();
                if (e) {
                  _y = e.pageY - _rect.top;
                } else if (typeof y === 'number') {
                  _y = y;
                } else if (typeof offset === 'number') {
                  _y = this.selection.y + offset;
                } else {
                  _y = this.selection.y;
                }
                _y = this.selection.y = Math.max(0, Math.min(_height, _y));
                this.selection.color = Hue.canvas.getColorAtPosition(_y);
                _position = {
                  y: Math.max(3, Math.min(_height - 6, _y))
                };
                requestAnimationFrame((function(_this) {
                  return function() {
                    return _this.el.style.top = _position.y + "px";
                  };
                })(this));
                return Hue.emitSelectionChanged();
              },
              refreshSelection: function() {
                return this.setSelection();
              }
            };
            _this.control.refreshSelection();
            colorPicker.onInputColor(function(smartColor) {
              var _hue;
              _hue = smartColor.toHSVArray()[0];
              return _this.control.setSelection(null, (_this.element.getHeight() / 360) * _hue);
            });
            Hue.onSelectionChanged(function() {
              return Hue.emitColorChanged();
            });
            colorPicker.onOpen(function() {
              return _this.control.refreshSelection();
            });
            colorPicker.onOpen(function() {
              return _this.control.isGrabbing = false;
            });
            colorPicker.onClose(function() {
              return _this.control.isGrabbing = false;
            });
            colorPicker.onMouseDown(function(e, isOnPicker) {
              if (!(isOnPicker && hasChild(Hue.element.el, e.target))) {
                return;
              }
              e.preventDefault();
              _this.control.isGrabbing = true;
              return _this.control.setSelection(e);
            });
            colorPicker.onMouseMove(function(e) {
              if (!_this.control.isGrabbing) {
                return;
              }
              return _this.control.setSelection(e);
            });
            colorPicker.onMouseUp(function(e) {
              if (!_this.control.isGrabbing) {
                return;
              }
              _this.control.isGrabbing = false;
              return _this.control.setSelection(e);
            });
            colorPicker.onMouseWheel(function(e, isOnPicker) {
              if (!(isOnPicker && hasChild(Hue.element.el, e.target))) {
                return;
              }
              e.preventDefault();
              return _this.control.setSelection(null, null, e.wheelDeltaY * .33);
            });
            return _this.element.add(_this.control.el);
          };
        })(this));
        return this;
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdHVua2VydC8uYXRvbS9wYWNrYWdlcy9jb2xvci1waWNrZXIvbGliL2V4dGVuc2lvbnMvSHVlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFLSTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsV0FBRDtXQUNiO01BQUEsT0FBQSxFQUFTLENBQUMsT0FBQSxDQUFRLG9CQUFSLENBQUQsQ0FBQSxDQUFBLENBQVQ7TUFFQSxPQUFBLEVBQVMsSUFGVDtNQUdBLE9BQUEsRUFBUyxJQUhUO01BSUEsTUFBQSxFQUFRLElBSlI7TUFTQSxNQUFBLEVBQVEsU0FBQTtRQUNKLElBQUcsQ0FBQyxJQUFDLENBQUEsT0FBRCxJQUFhLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBdkIsQ0FBQSxJQUFzQyxJQUFDLENBQUEsT0FBMUM7QUFDSSxpQkFBTyxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFuQixHQUF1QixJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsQ0FBQSxDQUF2QixHQUE4QyxJQUR6RDtTQUFBLE1BQUE7QUFFSyxpQkFBTyxFQUZaOztNQURJLENBVFI7TUFrQkEsb0JBQUEsRUFBc0IsU0FBQTtlQUNsQixJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxrQkFBZCxFQUFrQyxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQTNDO01BRGtCLENBbEJ0QjtNQW9CQSxrQkFBQSxFQUFvQixTQUFDLFFBQUQ7ZUFDaEIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksa0JBQVosRUFBZ0MsUUFBaEM7TUFEZ0IsQ0FwQnBCO01Bd0JBLGdCQUFBLEVBQWtCLFNBQUE7ZUFDZCxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxjQUFkLEVBQThCLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQWpEO01BRGMsQ0F4QmxCO01BMEJBLGNBQUEsRUFBZ0IsU0FBQyxRQUFE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QXNCO3FCQUN0QixLQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBc0IsQ0FBdEI7WUFIa0IsQ0FBdEI7WUFLQSxXQUFXLENBQUMsWUFBWixDQUF5QixTQUFDLENBQUQsRUFBSSxVQUFKO2NBQ3JCLElBQUEsQ0FBQSxDQUFjLFVBQUEsSUFBZSxRQUFBLENBQVMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFyQixFQUF5QixDQUFDLENBQUMsTUFBM0IsQ0FBN0IsQ0FBQTtBQUFBLHVCQUFBOztjQUNBLENBQUMsQ0FBQyxjQUFGLENBQUE7cUJBQ0EsS0FBQyxDQUFBLE9BQU8sQ0FBQyxZQUFULENBQXNCLElBQXRCLEVBQTRCLElBQTVCLEVBQW1DLENBQUMsQ0FBQyxXQUFGLEdBQWdCLEdBQW5EO1lBSHFCLENBQXpCO21CQU1BLEtBQUMsQ0FBQSxPQUFPLENBQUMsR0FBVCxDQUFhLEtBQUMsQ0FBQSxPQUFPLENBQUMsRUFBdEI7VUF0Rk87UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVg7QUF1RkEsZUFBTztNQXZLRCxDQWhDVjs7RUFEYTtBQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIiMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyAgQ29sb3IgUGlja2VyL2V4dGVuc2lvbnM6IEh1ZVxuIyAgQ29sb3IgSHVlIGNvbnRyb2xsZXJcbiMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSAoY29sb3JQaWNrZXIpIC0+XG4gICAgICAgIEVtaXR0ZXI6IChyZXF1aXJlICcuLi9tb2R1bGVzL0VtaXR0ZXInKSgpXG5cbiAgICAgICAgZWxlbWVudDogbnVsbFxuICAgICAgICBjb250cm9sOiBudWxsXG4gICAgICAgIGNhbnZhczogbnVsbFxuXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyAgVXRpbGl0eSBmdW5jdGlvbiB0byBnZXQgdGhlIGN1cnJlbnQgaHVlXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIGdldEh1ZTogLT5cbiAgICAgICAgICAgIGlmIChAY29udHJvbCBhbmQgQGNvbnRyb2wuc2VsZWN0aW9uKSBhbmQgQGVsZW1lbnRcbiAgICAgICAgICAgICAgICByZXR1cm4gQGNvbnRyb2wuc2VsZWN0aW9uLnkgLyBAZWxlbWVudC5nZXRIZWlnaHQoKSAqIDM2MFxuICAgICAgICAgICAgZWxzZSByZXR1cm4gMFxuXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyAgU2V0IHVwIGV2ZW50cyBhbmQgaGFuZGxpbmdcbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgIyBTZWxlY3Rpb24gQ2hhbmdlZCBldmVudFxuICAgICAgICBlbWl0U2VsZWN0aW9uQ2hhbmdlZDogLT5cbiAgICAgICAgICAgIEBFbWl0dGVyLmVtaXQgJ3NlbGVjdGlvbkNoYW5nZWQnLCBAY29udHJvbC5zZWxlY3Rpb25cbiAgICAgICAgb25TZWxlY3Rpb25DaGFuZ2VkOiAoY2FsbGJhY2spIC0+XG4gICAgICAgICAgICBARW1pdHRlci5vbiAnc2VsZWN0aW9uQ2hhbmdlZCcsIGNhbGxiYWNrXG5cbiAgICAgICAgIyBDb2xvciBDaGFuZ2VkIGV2ZW50XG4gICAgICAgIGVtaXRDb2xvckNoYW5nZWQ6IC0+XG4gICAgICAgICAgICBARW1pdHRlci5lbWl0ICdjb2xvckNoYW5nZWQnLCBAY29udHJvbC5zZWxlY3Rpb24uY29sb3JcbiAgICAgICAgb25Db2xvckNoYW5nZWQ6IChjYWxsYmFjaykgLT5cbiAgICAgICAgICAgIEBFbWl0dGVyLm9uICdjb2xvckNoYW5nZWQnLCBjYWxsYmFja1xuXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyAgQ3JlYXRlIGFuZCBhY3RpdmF0ZSBIdWUgY29udHJvbGxlclxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBhY3RpdmF0ZTogLT5cbiAgICAgICAgICAgIEJvZHkgPSBjb2xvclBpY2tlci5nZXRFeHRlbnNpb24gJ0JvZHknXG5cbiAgICAgICAgIyAgQ3JlYXRlIHRoZSBlbGVtZW50XG4gICAgICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBAZWxlbWVudCA9XG4gICAgICAgICAgICAgICAgZWw6IGRvIC0+XG4gICAgICAgICAgICAgICAgICAgIF9jbGFzc1ByZWZpeCA9IEJvZHkuZWxlbWVudC5lbC5jbGFzc05hbWVcbiAgICAgICAgICAgICAgICAgICAgX2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnZGl2J1xuICAgICAgICAgICAgICAgICAgICBfZWwuY2xhc3NMaXN0LmFkZCBcIiN7IF9jbGFzc1ByZWZpeCB9LWh1ZVwiXG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9lbFxuICAgICAgICAgICAgICAgICMgVXRpbGl0eSBmdW5jdGlvbnNcbiAgICAgICAgICAgICAgICB3aWR0aDogMFxuICAgICAgICAgICAgICAgIGhlaWdodDogMFxuICAgICAgICAgICAgICAgIGdldFdpZHRoOiAtPiByZXR1cm4gQHdpZHRoIG9yIEBlbC5vZmZzZXRXaWR0aFxuICAgICAgICAgICAgICAgIGdldEhlaWdodDogLT4gcmV0dXJuIEBoZWlnaHQgb3IgQGVsLm9mZnNldEhlaWdodFxuXG4gICAgICAgICAgICAgICAgcmVjdDogbnVsbFxuICAgICAgICAgICAgICAgIGdldFJlY3Q6IC0+IHJldHVybiBAcmVjdCBvciBAdXBkYXRlUmVjdCgpXG4gICAgICAgICAgICAgICAgdXBkYXRlUmVjdDogLT4gQHJlY3QgPSBAZWwuZ2V0Q2xpZW50UmVjdHMoKVswXVxuXG4gICAgICAgICAgICAgICAgIyBBZGQgYSBjaGlsZCBvbiB0aGUgSHVlIGVsZW1lbnRcbiAgICAgICAgICAgICAgICBhZGQ6IChlbGVtZW50KSAtPlxuICAgICAgICAgICAgICAgICAgICBAZWwuYXBwZW5kQ2hpbGQgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgICAgICAgQm9keS5lbGVtZW50LmFkZCBAZWxlbWVudC5lbCwgMlxuXG4gICAgICAgICMgIFVwZGF0ZSBlbGVtZW50IHJlY3Qgd2hlbiBDb2xvciBQaWNrZXIgb3BlbnNcbiAgICAgICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIGNvbG9yUGlja2VyLm9uT3BlbiA9PlxuICAgICAgICAgICAgICAgIHJldHVybiB1bmxlc3MgQGVsZW1lbnQudXBkYXRlUmVjdCgpIGFuZCBfcmVjdCA9IEBlbGVtZW50LmdldFJlY3QoKVxuICAgICAgICAgICAgICAgIEB3aWR0aCA9IF9yZWN0LndpZHRoXG4gICAgICAgICAgICAgICAgQGhlaWdodCA9IF9yZWN0LmhlaWdodFxuXG4gICAgICAgICMgIENyZWF0ZSBhbmQgZHJhdyBjYW52YXNcbiAgICAgICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIHNldFRpbWVvdXQgPT4gIyB3YWl0IGZvciB0aGUgRE9NXG4gICAgICAgICAgICAgICAgSHVlID0gdGhpc1xuXG4gICAgICAgICAgICAgICAgIyBQcmVwYXJlIHNvbWUgdmFyaWFibGVzXG4gICAgICAgICAgICAgICAgX2VsZW1lbnRXaWR0aCA9IEBlbGVtZW50LmdldFdpZHRoKClcbiAgICAgICAgICAgICAgICBfZWxlbWVudEhlaWdodCA9IEBlbGVtZW50LmdldEhlaWdodCgpXG5cbiAgICAgICAgICAgICAgICAjIFJlZCB0aHJvdWdoIGFsbCB0aGUgbWFpbiBjb2xvcnMgYW5kIGJhY2sgdG8gcmVkXG4gICAgICAgICAgICAgICAgX2hleGVzID0gWycjZjAwJywgJyNmZjAnLCAnIzBmMCcsICcjMGZmJywgJyMwMGYnLCAnI2YwZicsICcjZjAwJ11cblxuICAgICAgICAgICAgICAgICMgQ3JlYXRlIGNhbnZhcyBlbGVtZW50XG4gICAgICAgICAgICAgICAgQGNhbnZhcyA9XG4gICAgICAgICAgICAgICAgICAgIGVsOiBkbyAtPlxuICAgICAgICAgICAgICAgICAgICAgICAgX2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnY2FudmFzJ1xuICAgICAgICAgICAgICAgICAgICAgICAgX2VsLndpZHRoID0gX2VsZW1lbnRXaWR0aFxuICAgICAgICAgICAgICAgICAgICAgICAgX2VsLmhlaWdodCA9IF9lbGVtZW50SGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgICAgICBfZWwuY2xhc3NMaXN0LmFkZCBcIiN7IEh1ZS5lbGVtZW50LmVsLmNsYXNzTmFtZSB9LWNhbnZhc1wiXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfZWxcbiAgICAgICAgICAgICAgICAgICAgIyBVdGlsaXR5IGZ1bmN0aW9uc1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiBudWxsXG4gICAgICAgICAgICAgICAgICAgIGdldENvbnRleHQ6IC0+IEBjb250ZXh0IG9yIChAY29udGV4dCA9IEBlbC5nZXRDb250ZXh0ICcyZCcpXG5cbiAgICAgICAgICAgICAgICAgICAgZ2V0Q29sb3JBdFBvc2l0aW9uOiAoeSkgLT4gcmV0dXJuIGNvbG9yUGlja2VyLlNtYXJ0Q29sb3IuSFNWQXJyYXkgW1xuICAgICAgICAgICAgICAgICAgICAgICAgeSAvIEh1ZS5lbGVtZW50LmdldEhlaWdodCgpICogMzYwXG4gICAgICAgICAgICAgICAgICAgICAgICAxMDBcbiAgICAgICAgICAgICAgICAgICAgICAgIDEwMF1cblxuICAgICAgICAgICAgICAgICMgRHJhdyBncmFkaWVudFxuICAgICAgICAgICAgICAgIF9jb250ZXh0ID0gQGNhbnZhcy5nZXRDb250ZXh0KClcblxuICAgICAgICAgICAgICAgIF9zdGVwID0gMSAvIChfaGV4ZXMubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgICAgICBfZ3JhZGllbnQgPSBfY29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudCAwLCAwLCAxLCBfZWxlbWVudEhlaWdodFxuICAgICAgICAgICAgICAgIF9ncmFkaWVudC5hZGRDb2xvclN0b3AgKF9zdGVwICogX2kpLCBfaGV4IGZvciBfaGV4LCBfaSBpbiBfaGV4ZXNcblxuICAgICAgICAgICAgICAgIF9jb250ZXh0LmZpbGxTdHlsZSA9IF9ncmFkaWVudFxuICAgICAgICAgICAgICAgIF9jb250ZXh0LmZpbGxSZWN0IDAsIDAsIF9lbGVtZW50V2lkdGgsIF9lbGVtZW50SGVpZ2h0XG5cbiAgICAgICAgICAgICAgICAjIEFkZCB0byBIdWUgZWxlbWVudFxuICAgICAgICAgICAgICAgIEBlbGVtZW50LmFkZCBAY2FudmFzLmVsXG5cbiAgICAgICAgIyAgQ3JlYXRlIEh1ZSBjb250cm9sIGVsZW1lbnRcbiAgICAgICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIHNldFRpbWVvdXQgPT4gIyB3YWl0IGZvciB0aGUgRE9NXG4gICAgICAgICAgICAgICAgaGFzQ2hpbGQgPSAoZWxlbWVudCwgY2hpbGQpIC0+XG4gICAgICAgICAgICAgICAgICAgIGlmIGNoaWxkIGFuZCBfcGFyZW50ID0gY2hpbGQucGFyZW50Tm9kZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgY2hpbGQgaXMgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBoYXNDaGlsZCBlbGVtZW50LCBfcGFyZW50XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgICAgICAgICAgICAgIyBDcmVhdGUgZWxlbWVudFxuICAgICAgICAgICAgICAgIEh1ZSA9IHRoaXNcblxuICAgICAgICAgICAgICAgIEBjb250cm9sID1cbiAgICAgICAgICAgICAgICAgICAgZWw6IGRvIC0+XG4gICAgICAgICAgICAgICAgICAgICAgICBfZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50ICdkaXYnXG4gICAgICAgICAgICAgICAgICAgICAgICBfZWwuY2xhc3NMaXN0LmFkZCBcIiN7IEh1ZS5lbGVtZW50LmVsLmNsYXNzTmFtZSB9LWNvbnRyb2xcIlxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2VsXG4gICAgICAgICAgICAgICAgICAgIGlzR3JhYmJpbmc6IG5vXG5cbiAgICAgICAgICAgICAgICAgICAgIyBTZXQgY29udHJvbCBzZWxlY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uOlxuICAgICAgICAgICAgICAgICAgICAgICAgeTogMFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgc2V0U2VsZWN0aW9uOiAoZSwgeT1udWxsLCBvZmZzZXQ9bnVsbCkgLT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmxlc3MgSHVlLmNhbnZhcyBhbmQgX3JlY3QgPSBIdWUuZWxlbWVudC5nZXRSZWN0KClcblxuICAgICAgICAgICAgICAgICAgICAgICAgX3dpZHRoID0gSHVlLmVsZW1lbnQuZ2V0V2lkdGgoKVxuICAgICAgICAgICAgICAgICAgICAgICAgX2hlaWdodCA9IEh1ZS5lbGVtZW50LmdldEhlaWdodCgpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGUgdGhlbiBfeSA9IGUucGFnZVkgLSBfcmVjdC50b3BcbiAgICAgICAgICAgICAgICAgICAgICAgICMgU2V0IHRoZSB5IGRpcmVjdGx5XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgeSBpcyAnbnVtYmVyJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfeSA9IHlcbiAgICAgICAgICAgICAgICAgICAgICAgICMgSGFuZGxlIHNjcm9sbFxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIG9mZnNldCBpcyAnbnVtYmVyJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfeSA9IEBzZWxlY3Rpb24ueSArIG9mZnNldFxuICAgICAgICAgICAgICAgICAgICAgICAgIyBEZWZhdWx0IHRvIHRvcFxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBfeSA9IEBzZWxlY3Rpb24ueVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBfeSA9IEBzZWxlY3Rpb24ueSA9IE1hdGgubWF4IDAsIChNYXRoLm1pbiBfaGVpZ2h0LCBfeSlcbiAgICAgICAgICAgICAgICAgICAgICAgIEBzZWxlY3Rpb24uY29sb3IgPSBIdWUuY2FudmFzLmdldENvbG9yQXRQb3NpdGlvbiBfeVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBfcG9zaXRpb24gPSB5OiBNYXRoLm1heCAzLCAoTWF0aC5taW4gKF9oZWlnaHQgLSA2KSwgX3kpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBlbC5zdHlsZS50b3AgPSBcIiN7IF9wb3NpdGlvbi55IH1weFwiXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gSHVlLmVtaXRTZWxlY3Rpb25DaGFuZ2VkKClcblxuICAgICAgICAgICAgICAgICAgICByZWZyZXNoU2VsZWN0aW9uOiAtPiBAc2V0U2VsZWN0aW9uKClcbiAgICAgICAgICAgICAgICBAY29udHJvbC5yZWZyZXNoU2VsZWN0aW9uKClcblxuICAgICAgICAgICAgICAgICMgSWYgdGhlIENvbG9yIFBpY2tlciBpcyBmZWQgYSBjb2xvciwgc2V0IGl0XG4gICAgICAgICAgICAgICAgY29sb3JQaWNrZXIub25JbnB1dENvbG9yIChzbWFydENvbG9yKSA9PlxuICAgICAgICAgICAgICAgICAgICBfaHVlID0gc21hcnRDb2xvci50b0hTVkFycmF5KClbMF1cbiAgICAgICAgICAgICAgICAgICAgQGNvbnRyb2wuc2V0U2VsZWN0aW9uIG51bGwsIChAZWxlbWVudC5nZXRIZWlnaHQoKSAvIDM2MCkgKiBfaHVlXG5cbiAgICAgICAgICAgICAgICAjIFdoZW4gdGhlIHNlbGVjdGlvbiBjaGFuZ2VzLCB0aGUgY29sb3IgaGFzIGNoYW5nZWRcbiAgICAgICAgICAgICAgICBIdWUub25TZWxlY3Rpb25DaGFuZ2VkIC0+IEh1ZS5lbWl0Q29sb3JDaGFuZ2VkKClcblxuICAgICAgICAgICAgICAgICMgUmVzZXRcbiAgICAgICAgICAgICAgICBjb2xvclBpY2tlci5vbk9wZW4gPT4gQGNvbnRyb2wucmVmcmVzaFNlbGVjdGlvbigpXG4gICAgICAgICAgICAgICAgY29sb3JQaWNrZXIub25PcGVuID0+IEBjb250cm9sLmlzR3JhYmJpbmcgPSBub1xuICAgICAgICAgICAgICAgIGNvbG9yUGlja2VyLm9uQ2xvc2UgPT4gQGNvbnRyb2wuaXNHcmFiYmluZyA9IG5vXG5cbiAgICAgICAgICAgICAgICAjIEJpbmQgY29udHJvbGxlciBldmVudHNcbiAgICAgICAgICAgICAgICBjb2xvclBpY2tlci5vbk1vdXNlRG93biAoZSwgaXNPblBpY2tlcikgPT5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBpc09uUGlja2VyIGFuZCBoYXNDaGlsZCBIdWUuZWxlbWVudC5lbCwgZS50YXJnZXRcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgICAgIEBjb250cm9sLmlzR3JhYmJpbmcgPSB5ZXNcbiAgICAgICAgICAgICAgICAgICAgQGNvbnRyb2wuc2V0U2VsZWN0aW9uIGVcblxuICAgICAgICAgICAgICAgIGNvbG9yUGlja2VyLm9uTW91c2VNb3ZlIChlKSA9PlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5sZXNzIEBjb250cm9sLmlzR3JhYmJpbmdcbiAgICAgICAgICAgICAgICAgICAgQGNvbnRyb2wuc2V0U2VsZWN0aW9uIGVcblxuICAgICAgICAgICAgICAgIGNvbG9yUGlja2VyLm9uTW91c2VVcCAoZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBAY29udHJvbC5pc0dyYWJiaW5nXG4gICAgICAgICAgICAgICAgICAgIEBjb250cm9sLmlzR3JhYmJpbmcgPSBub1xuICAgICAgICAgICAgICAgICAgICBAY29udHJvbC5zZXRTZWxlY3Rpb24gZVxuXG4gICAgICAgICAgICAgICAgY29sb3JQaWNrZXIub25Nb3VzZVdoZWVsIChlLCBpc09uUGlja2VyKSA9PlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5sZXNzIGlzT25QaWNrZXIgYW5kIGhhc0NoaWxkIEh1ZS5lbGVtZW50LmVsLCBlLnRhcmdldFxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICAgICAgQGNvbnRyb2wuc2V0U2VsZWN0aW9uIG51bGwsIG51bGwsIChlLndoZWVsRGVsdGFZICogLjMzKSAjIG1ha2UgaXQgYSBiaXQgc29mdGVyXG5cbiAgICAgICAgICAgICAgICAjIEFkZCB0byBIdWUgZWxlbWVudFxuICAgICAgICAgICAgICAgIEBlbGVtZW50LmFkZCBAY29udHJvbC5lbFxuICAgICAgICAgICAgcmV0dXJuIHRoaXNcbiJdfQ==
