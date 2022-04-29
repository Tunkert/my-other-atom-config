(function() {
  module.exports = function(colorPicker) {
    return {
      Emitter: (require('../modules/Emitter'))(),
      element: null,
      color: null,
      emitOutputFormat: function(format) {
        return this.Emitter.emit('outputFormat', format);
      },
      onOutputFormat: function(callback) {
        return this.Emitter.on('outputFormat', callback);
      },
      activate: function() {
        var _isClicking, hasChild;
        this.element = {
          el: (function() {
            var _classPrefix, _el;
            _classPrefix = colorPicker.element.el.className;
            _el = document.createElement('div');
            _el.classList.add(_classPrefix + "-color");
            return _el;
          })(),
          addClass: function(className) {
            this.el.classList.add(className);
            return this;
          },
          removeClass: function(className) {
            this.el.classList.remove(className);
            return this;
          },
          height: function() {
            return this.el.offsetHeight;
          },
          add: function(element) {
            this.el.appendChild(element);
            return this;
          },
          previousColor: null,
          setColor: function(smartColor) {
            var _color;
            _color = smartColor.toRGBA();
            if (this.previousColor && this.previousColor === _color) {
              return;
            }
            this.el.style.backgroundColor = _color;
            return this.previousColor = _color;
          }
        };
        colorPicker.element.add(this.element.el);
        setTimeout((function(_this) {
          return function() {
            var _newHeight;
            _newHeight = colorPicker.element.height() + _this.element.height();
            return colorPicker.element.setHeight(_newHeight);
          };
        })(this));
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
        _isClicking = false;
        colorPicker.onMouseDown((function(_this) {
          return function(e, isOnPicker) {
            if (!(isOnPicker && hasChild(_this.element.el, e.target))) {
              return;
            }
            e.preventDefault();
            return _isClicking = true;
          };
        })(this));
        colorPicker.onMouseMove(function(e) {
          return _isClicking = false;
        });
        colorPicker.onMouseUp((function(_this) {
          return function(e) {
            if (!_isClicking) {
              return;
            }
            colorPicker.replace(_this.color);
            return colorPicker.element.close();
          };
        })(this));
        colorPicker.onKeyDown((function(_this) {
          return function(e) {
            if (e.which !== 13) {
              return;
            }
            e.stopPropagation();
            return colorPicker.replace(_this.color);
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var Alpha;
            Alpha = colorPicker.getExtension('Alpha');
            Alpha.onColorChanged(function(smartColor) {
              _this.element.setColor((function() {
                if (smartColor) {
                  return smartColor;
                } else {
                  return colorPicker.SmartColor.HEX('#f00');
                }
              })());
            });
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var Alpha, Format, Return, _currentColor, _formatFormat, _inputColor, _text, setColor;
            Alpha = colorPicker.getExtension('Alpha');
            Return = colorPicker.getExtension('Return');
            Format = colorPicker.getExtension('Format');
            _text = document.createElement('p');
            _text.classList.add(_this.element.el.className + "-text");
            colorPicker.onBeforeOpen(function() {
              return _this.color = null;
            });
            _inputColor = null;
            colorPicker.onInputColor(function(smartColor, wasFound) {
              return _inputColor = wasFound ? smartColor : null;
            });
            _formatFormat = null;
            Format.onFormatChanged(function(format) {
              return _formatFormat = format;
            });
            colorPicker.onInputColor(function() {
              return _formatFormat = null;
            });
            setColor = function(smartColor) {
              var _format, _function, _outputColor, _preferredFormat;
              _preferredFormat = atom.config.get('color-picker.preferredFormat');
              _format = _formatFormat || (_inputColor != null ? _inputColor.format : void 0) || _preferredFormat || 'RGB';
              _function = smartColor.getAlpha() < 1 || atom.config.get('color-picker.alphaChannelAlways') ? smartColor["to" + _format + "A"] || smartColor["to" + _format] : smartColor["to" + _format];
              _outputColor = (function() {
                if (_inputColor && (_inputColor.format === _format || _inputColor.format === (_format + "A"))) {
                  if (smartColor.equals(_inputColor)) {
                    return _inputColor.value;
                  }
                }
                return _function.call(smartColor);
              })();
              if (_outputColor === _this.color) {
                return;
              }
              if (_inputColor && atom.config.get('color-picker.automaticReplace')) {
                colorPicker.replace(_outputColor);
              }
              _this.color = _outputColor;
              _text.innerText = _outputColor;
              return _this.emitOutputFormat(_format);
            };
            _currentColor = null;
            Alpha.onColorChanged(function(smartColor) {
              setColor(_currentColor = (function() {
                if (smartColor) {
                  return smartColor;
                } else {
                  return colorPicker.SmartColor.HEX('#f00');
                }
              })());
            });
            Format.onFormatChanged(function() {
              return setColor(_currentColor);
            });
            Return.onVisibility(function(visibility) {
              if (visibility) {
                return _this.element.addClass('is--returnVisible');
              } else {
                return _this.element.removeClass('is--returnVisible');
              }
            });
            return _this.element.add(_text);
          };
        })(this));
        return this;
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdHVua2VydC8uYXRvbS9wYWNrYWdlcy9jb2xvci1waWNrZXIvbGliL2V4dGVuc2lvbnMvQ29sb3IuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUtJO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxXQUFEO1dBQ2I7TUFBQSxPQUFBLEVBQVMsQ0FBQyxPQUFBLENBQVEsb0JBQVIsQ0FBRCxDQUFBLENBQUEsQ0FBVDtNQUVBLE9BQUEsRUFBUyxJQUZUO01BR0EsS0FBQSxFQUFPLElBSFA7TUFTQSxnQkFBQSxFQUFrQixTQUFDLE1BQUQ7ZUFDZCxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxjQUFkLEVBQThCLE1BQTlCO01BRGMsQ0FUbEI7TUFXQSxjQUFBLEVBQWdCLFNBQUMsUUFBRDtlQUNaLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLGNBQVosRUFBNEIsUUFBNUI7TUFEWSxDQVhoQjtNQWlCQSxRQUFBLEVBQVUsU0FBQTtBQUNOLFlBQUE7UUFBQSxJQUFDLENBQUEsT0FBRCxHQUNJO1VBQUEsRUFBQSxFQUFPLENBQUEsU0FBQTtBQUNILGdCQUFBO1lBQUEsWUFBQSxHQUFlLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQ3RDLEdBQUEsR0FBTSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QjtZQUNOLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBZCxDQUFzQixZQUFGLEdBQWdCLFFBQXBDO0FBRUEsbUJBQU87VUFMSixDQUFBLENBQUgsQ0FBQSxDQUFKO1VBT0EsUUFBQSxFQUFVLFNBQUMsU0FBRDtZQUFlLElBQUMsQ0FBQSxFQUFFLENBQUMsU0FBUyxDQUFDLEdBQWQsQ0FBa0IsU0FBbEI7QUFBNkIsbUJBQU87VUFBbkQsQ0FQVjtVQVFBLFdBQUEsRUFBYSxTQUFDLFNBQUQ7WUFBZSxJQUFDLENBQUEsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFkLENBQXFCLFNBQXJCO0FBQWdDLG1CQUFPO1VBQXRELENBUmI7VUFVQSxNQUFBLEVBQVEsU0FBQTttQkFBRyxJQUFDLENBQUEsRUFBRSxDQUFDO1VBQVAsQ0FWUjtVQWFBLEdBQUEsRUFBSyxTQUFDLE9BQUQ7WUFDRCxJQUFDLENBQUEsRUFBRSxDQUFDLFdBQUosQ0FBZ0IsT0FBaEI7QUFDQSxtQkFBTztVQUZOLENBYkw7VUFrQkEsYUFBQSxFQUFlLElBbEJmO1VBbUJBLFFBQUEsRUFBVSxTQUFDLFVBQUQ7QUFDTixnQkFBQTtZQUFBLE1BQUEsR0FBUyxVQUFVLENBQUMsTUFBWCxDQUFBO1lBQ1QsSUFBVSxJQUFDLENBQUEsYUFBRCxJQUFtQixJQUFDLENBQUEsYUFBRCxLQUFrQixNQUEvQztBQUFBLHFCQUFBOztZQUVBLElBQUMsQ0FBQSxFQUFFLENBQUMsS0FBSyxDQUFDLGVBQVYsR0FBNEI7QUFDNUIsbUJBQU8sSUFBQyxDQUFBLGFBQUQsR0FBaUI7VUFMbEIsQ0FuQlY7O1FBeUJKLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBcEIsQ0FBd0IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFqQztRQUlBLFVBQUEsQ0FBVyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO0FBQ1AsZ0JBQUE7WUFBQSxVQUFBLEdBQWEsV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFwQixDQUFBLENBQUEsR0FBK0IsS0FBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQUE7bUJBQzVDLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBcEIsQ0FBOEIsVUFBOUI7VUFGTztRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWDtRQU1BLFFBQUEsR0FBVyxTQUFDLE9BQUQsRUFBVSxLQUFWO0FBQ1AsY0FBQTtVQUFBLElBQUcsS0FBQSxJQUFVLENBQUEsT0FBQSxHQUFVLEtBQUssQ0FBQyxVQUFoQixDQUFiO1lBQ0ksSUFBRyxLQUFBLEtBQVMsT0FBWjtBQUNJLHFCQUFPLEtBRFg7YUFBQSxNQUFBO0FBRUsscUJBQU8sUUFBQSxDQUFTLE9BQVQsRUFBa0IsT0FBbEIsRUFGWjthQURKOztBQUlBLGlCQUFPO1FBTEE7UUFPWCxXQUFBLEdBQWM7UUFFZCxXQUFXLENBQUMsV0FBWixDQUF3QixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLENBQUQsRUFBSSxVQUFKO1lBQ3BCLElBQUEsQ0FBQSxDQUFjLFVBQUEsSUFBZSxRQUFBLENBQVMsS0FBQyxDQUFBLE9BQU8sQ0FBQyxFQUFsQixFQUFzQixDQUFDLENBQUMsTUFBeEIsQ0FBN0IsQ0FBQTtBQUFBLHFCQUFBOztZQUNBLENBQUMsQ0FBQyxjQUFGLENBQUE7bUJBQ0EsV0FBQSxHQUFjO1VBSE07UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhCO1FBS0EsV0FBVyxDQUFDLFdBQVosQ0FBd0IsU0FBQyxDQUFEO2lCQUNwQixXQUFBLEdBQWM7UUFETSxDQUF4QjtRQUdBLFdBQVcsQ0FBQyxTQUFaLENBQXNCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsQ0FBRDtZQUNsQixJQUFBLENBQWMsV0FBZDtBQUFBLHFCQUFBOztZQUNBLFdBQVcsQ0FBQyxPQUFaLENBQW9CLEtBQUMsQ0FBQSxLQUFyQjttQkFDQSxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQXBCLENBQUE7VUFIa0I7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRCO1FBT0EsV0FBVyxDQUFDLFNBQVosQ0FBc0IsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxDQUFEO1lBQ2xCLElBQWMsQ0FBQyxDQUFDLEtBQUYsS0FBVyxFQUF6QjtBQUFBLHFCQUFBOztZQUNBLENBQUMsQ0FBQyxlQUFGLENBQUE7bUJBQ0EsV0FBVyxDQUFDLE9BQVosQ0FBb0IsS0FBQyxDQUFBLEtBQXJCO1VBSGtCO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0QjtRQU9BLFVBQUEsQ0FBVyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO0FBQ1AsZ0JBQUE7WUFBQSxLQUFBLEdBQVEsV0FBVyxDQUFDLFlBQVosQ0FBeUIsT0FBekI7WUFFUixLQUFLLENBQUMsY0FBTixDQUFxQixTQUFDLFVBQUQ7Y0FDakIsS0FBQyxDQUFBLE9BQU8sQ0FBQyxRQUFULENBQXFCLENBQUEsU0FBQTtnQkFDakIsSUFBRyxVQUFIO0FBQW1CLHlCQUFPLFdBQTFCO2lCQUFBLE1BQUE7QUFFSyx5QkFBTyxXQUFXLENBQUMsVUFBVSxDQUFDLEdBQXZCLENBQTJCLE1BQTNCLEVBRlo7O2NBRGlCLENBQUEsQ0FBSCxDQUFBLENBQWxCO1lBRGlCLENBQXJCO1VBSE87UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVg7UUFhQSxVQUFBLENBQVcsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTtBQUNQLGdCQUFBO1lBQUEsS0FBQSxHQUFRLFdBQVcsQ0FBQyxZQUFaLENBQXlCLE9BQXpCO1lBQ1IsTUFBQSxHQUFTLFdBQVcsQ0FBQyxZQUFaLENBQXlCLFFBQXpCO1lBQ1QsTUFBQSxHQUFTLFdBQVcsQ0FBQyxZQUFaLENBQXlCLFFBQXpCO1lBR1QsS0FBQSxHQUFRLFFBQVEsQ0FBQyxhQUFULENBQXVCLEdBQXZCO1lBQ1IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFoQixDQUF3QixLQUFDLENBQUEsT0FBTyxDQUFDLEVBQUUsQ0FBQyxTQUFkLEdBQXlCLE9BQS9DO1lBR0EsV0FBVyxDQUFDLFlBQVosQ0FBeUIsU0FBQTtxQkFBRyxLQUFDLENBQUEsS0FBRCxHQUFTO1lBQVosQ0FBekI7WUFHQSxXQUFBLEdBQWM7WUFFZCxXQUFXLENBQUMsWUFBWixDQUF5QixTQUFDLFVBQUQsRUFBYSxRQUFiO3FCQUNyQixXQUFBLEdBQWlCLFFBQUgsR0FDVixVQURVLEdBRVQ7WUFIZ0IsQ0FBekI7WUFNQSxhQUFBLEdBQWdCO1lBQ2hCLE1BQU0sQ0FBQyxlQUFQLENBQXVCLFNBQUMsTUFBRDtxQkFBWSxhQUFBLEdBQWdCO1lBQTVCLENBQXZCO1lBQ0EsV0FBVyxDQUFDLFlBQVosQ0FBeUIsU0FBQTtxQkFBRyxhQUFBLEdBQWdCO1lBQW5CLENBQXpCO1lBR0EsUUFBQSxHQUFXLFNBQUMsVUFBRDtBQUNQLGtCQUFBO2NBQUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDhCQUFoQjtjQUNuQixPQUFBLEdBQVUsYUFBQSwyQkFBaUIsV0FBVyxDQUFFLGdCQUE5QixJQUF3QyxnQkFBeEMsSUFBNEQ7Y0FHdEUsU0FBQSxHQUFlLFVBQVUsQ0FBQyxRQUFYLENBQUEsQ0FBQSxHQUF3QixDQUF4QixJQUE2QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaUNBQWhCLENBQWhDLEdBQ1AsVUFBVyxDQUFBLElBQUEsR0FBTSxPQUFOLEdBQWUsR0FBZixDQUFYLElBQWlDLFVBQVcsQ0FBQSxJQUFBLEdBQU0sT0FBTixDQURyQyxHQUVQLFVBQVcsQ0FBQSxJQUFBLEdBQU0sT0FBTjtjQUtoQixZQUFBLEdBQWtCLENBQUEsU0FBQTtnQkFDZCxJQUFHLFdBQUEsSUFBZ0IsQ0FBQyxXQUFXLENBQUMsTUFBWixLQUFzQixPQUF0QixJQUFpQyxXQUFXLENBQUMsTUFBWixLQUFzQixDQUFJLE9BQUYsR0FBVyxHQUFiLENBQXhELENBQW5CO2tCQUNJLElBQUcsVUFBVSxDQUFDLE1BQVgsQ0FBa0IsV0FBbEIsQ0FBSDtBQUNJLDJCQUFPLFdBQVcsQ0FBQyxNQUR2QjttQkFESjs7QUFHQSx1QkFBTyxTQUFTLENBQUMsSUFBVixDQUFlLFVBQWY7Y0FKTyxDQUFBLENBQUgsQ0FBQTtjQVFmLElBQWMsWUFBQSxLQUFrQixLQUFDLENBQUEsS0FBakM7QUFBQSx1QkFBQTs7Y0FLQSxJQUFHLFdBQUEsSUFBZ0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLCtCQUFoQixDQUFuQjtnQkFDSSxXQUFXLENBQUMsT0FBWixDQUFvQixZQUFwQixFQURKOztjQUlBLEtBQUMsQ0FBQSxLQUFELEdBQVM7Y0FDVCxLQUFLLENBQUMsU0FBTixHQUFrQjtBQUVsQixxQkFBTyxLQUFDLENBQUEsZ0JBQUQsQ0FBa0IsT0FBbEI7WUFoQ0E7WUFtQ1gsYUFBQSxHQUFnQjtZQUVoQixLQUFLLENBQUMsY0FBTixDQUFxQixTQUFDLFVBQUQ7Y0FDakIsUUFBQSxDQUFTLGFBQUEsR0FBbUIsQ0FBQSxTQUFBO2dCQUN4QixJQUFHLFVBQUg7QUFBbUIseUJBQU8sV0FBMUI7aUJBQUEsTUFBQTtBQUVLLHlCQUFPLFdBQVcsQ0FBQyxVQUFVLENBQUMsR0FBdkIsQ0FBMkIsTUFBM0IsRUFGWjs7Y0FEd0IsQ0FBQSxDQUFILENBQUEsQ0FBekI7WUFEaUIsQ0FBckI7WUFRQSxNQUFNLENBQUMsZUFBUCxDQUF1QixTQUFBO3FCQUFHLFFBQUEsQ0FBUyxhQUFUO1lBQUgsQ0FBdkI7WUFJQSxNQUFNLENBQUMsWUFBUCxDQUFvQixTQUFDLFVBQUQ7Y0FDaEIsSUFBRyxVQUFIO3VCQUFtQixLQUFDLENBQUEsT0FBTyxDQUFDLFFBQVQsQ0FBa0IsbUJBQWxCLEVBQW5CO2VBQUEsTUFBQTt1QkFDSyxLQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsQ0FBcUIsbUJBQXJCLEVBREw7O1lBRGdCLENBQXBCO21CQUdBLEtBQUMsQ0FBQSxPQUFPLENBQUMsR0FBVCxDQUFhLEtBQWI7VUE5RU87UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVg7QUErRUEsZUFBTztNQWhLRCxDQWpCVjs7RUFEYTtBQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIiMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyAgQ29sb3IgUGlja2VyL2V4dGVuc2lvbnM6IENvbG9yXG4jICBUaGUgZWxlbWVudCBzaG93aW5nIHRoZSBjdXJyZW50IGNvbG9yXG4jIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1vZHVsZS5leHBvcnRzID0gKGNvbG9yUGlja2VyKSAtPlxuICAgICAgICBFbWl0dGVyOiAocmVxdWlyZSAnLi4vbW9kdWxlcy9FbWl0dGVyJykoKVxuXG4gICAgICAgIGVsZW1lbnQ6IG51bGxcbiAgICAgICAgY29sb3I6IG51bGxcblxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICMgIFNldCB1cCBldmVudHMgYW5kIGhhbmRsaW5nXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICMgT3V0cHV0IGZvcm1hdCBldmVudFxuICAgICAgICBlbWl0T3V0cHV0Rm9ybWF0OiAoZm9ybWF0KSAtPlxuICAgICAgICAgICAgQEVtaXR0ZXIuZW1pdCAnb3V0cHV0Rm9ybWF0JywgZm9ybWF0XG4gICAgICAgIG9uT3V0cHV0Rm9ybWF0OiAoY2FsbGJhY2spIC0+XG4gICAgICAgICAgICBARW1pdHRlci5vbiAnb3V0cHV0Rm9ybWF0JywgY2FsbGJhY2tcblxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICMgIENyZWF0ZSBhbmQgYWN0aXZhdGUgQ29sb3IgZWxlbWVudFxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBhY3RpdmF0ZTogLT5cbiAgICAgICAgICAgIEBlbGVtZW50ID1cbiAgICAgICAgICAgICAgICBlbDogZG8gLT5cbiAgICAgICAgICAgICAgICAgICAgX2NsYXNzUHJlZml4ID0gY29sb3JQaWNrZXIuZWxlbWVudC5lbC5jbGFzc05hbWVcbiAgICAgICAgICAgICAgICAgICAgX2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnZGl2J1xuICAgICAgICAgICAgICAgICAgICBfZWwuY2xhc3NMaXN0LmFkZCBcIiN7IF9jbGFzc1ByZWZpeCB9LWNvbG9yXCJcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2VsXG4gICAgICAgICAgICAgICAgIyBVdGlsaXR5IGZ1bmN0aW9uc1xuICAgICAgICAgICAgICAgIGFkZENsYXNzOiAoY2xhc3NOYW1lKSAtPiBAZWwuY2xhc3NMaXN0LmFkZCBjbGFzc05hbWU7IHJldHVybiB0aGlzXG4gICAgICAgICAgICAgICAgcmVtb3ZlQ2xhc3M6IChjbGFzc05hbWUpIC0+IEBlbC5jbGFzc0xpc3QucmVtb3ZlIGNsYXNzTmFtZTsgcmV0dXJuIHRoaXNcblxuICAgICAgICAgICAgICAgIGhlaWdodDogLT4gQGVsLm9mZnNldEhlaWdodFxuXG4gICAgICAgICAgICAgICAgIyBBZGQgYSBjaGlsZCBvbiB0aGUgQ29sb3IgZWxlbWVudFxuICAgICAgICAgICAgICAgIGFkZDogKGVsZW1lbnQpIC0+XG4gICAgICAgICAgICAgICAgICAgIEBlbC5hcHBlbmRDaGlsZCBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzXG5cbiAgICAgICAgICAgICAgICAjIFNldCB0aGUgQ29sb3IgZWxlbWVudCBiYWNrZ3JvdW5kIGNvbG9yXG4gICAgICAgICAgICAgICAgcHJldmlvdXNDb2xvcjogbnVsbFxuICAgICAgICAgICAgICAgIHNldENvbG9yOiAoc21hcnRDb2xvcikgLT5cbiAgICAgICAgICAgICAgICAgICAgX2NvbG9yID0gc21hcnRDb2xvci50b1JHQkEoKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaWYgQHByZXZpb3VzQ29sb3IgYW5kIEBwcmV2aW91c0NvbG9yIGlzIF9jb2xvclxuXG4gICAgICAgICAgICAgICAgICAgIEBlbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBfY29sb3JcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEBwcmV2aW91c0NvbG9yID0gX2NvbG9yXG4gICAgICAgICAgICBjb2xvclBpY2tlci5lbGVtZW50LmFkZCBAZWxlbWVudC5lbFxuXG4gICAgICAgICMgIEluY3JlYXNlIENvbG9yIFBpY2tlciBoZWlnaHRcbiAgICAgICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIHNldFRpbWVvdXQgPT5cbiAgICAgICAgICAgICAgICBfbmV3SGVpZ2h0ID0gY29sb3JQaWNrZXIuZWxlbWVudC5oZWlnaHQoKSArIEBlbGVtZW50LmhlaWdodCgpXG4gICAgICAgICAgICAgICAgY29sb3JQaWNrZXIuZWxlbWVudC5zZXRIZWlnaHQgX25ld0hlaWdodFxuXG4gICAgICAgICMgIFNldCBvciByZXBsYWNlIENvbG9yIG9uIGNsaWNrXG4gICAgICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBoYXNDaGlsZCA9IChlbGVtZW50LCBjaGlsZCkgLT5cbiAgICAgICAgICAgICAgICBpZiBjaGlsZCBhbmQgX3BhcmVudCA9IGNoaWxkLnBhcmVudE5vZGVcbiAgICAgICAgICAgICAgICAgICAgaWYgY2hpbGQgaXMgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gaGFzQ2hpbGQgZWxlbWVudCwgX3BhcmVudFxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgICAgICAgICBfaXNDbGlja2luZyA9IG5vXG5cbiAgICAgICAgICAgIGNvbG9yUGlja2VyLm9uTW91c2VEb3duIChlLCBpc09uUGlja2VyKSA9PlxuICAgICAgICAgICAgICAgIHJldHVybiB1bmxlc3MgaXNPblBpY2tlciBhbmQgaGFzQ2hpbGQgQGVsZW1lbnQuZWwsIGUudGFyZ2V0XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgX2lzQ2xpY2tpbmcgPSB5ZXNcblxuICAgICAgICAgICAgY29sb3JQaWNrZXIub25Nb3VzZU1vdmUgKGUpIC0+XG4gICAgICAgICAgICAgICAgX2lzQ2xpY2tpbmcgPSBub1xuXG4gICAgICAgICAgICBjb2xvclBpY2tlci5vbk1vdXNlVXAgKGUpID0+XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBfaXNDbGlja2luZ1xuICAgICAgICAgICAgICAgIGNvbG9yUGlja2VyLnJlcGxhY2UgQGNvbG9yXG4gICAgICAgICAgICAgICAgY29sb3JQaWNrZXIuZWxlbWVudC5jbG9zZSgpXG5cbiAgICAgICAgIyAgU2V0IG9yIHJlcGxhY2UgQ29sb3Igb24ga2V5IHByZXNzIGVudGVyXG4gICAgICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBjb2xvclBpY2tlci5vbktleURvd24gKGUpID0+XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBlLndoaWNoIGlzIDEzXG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgIGNvbG9yUGlja2VyLnJlcGxhY2UgQGNvbG9yXG5cbiAgICAgICAgIyAgU2V0IGJhY2tncm91bmQgZWxlbWVudCBjb2xvciBvbiBBbHBoYSBjaGFuZ2VcbiAgICAgICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIHNldFRpbWVvdXQgPT4gIyB3YWl0IGZvciB0aGUgRE9NXG4gICAgICAgICAgICAgICAgQWxwaGEgPSBjb2xvclBpY2tlci5nZXRFeHRlbnNpb24gJ0FscGhhJ1xuXG4gICAgICAgICAgICAgICAgQWxwaGEub25Db2xvckNoYW5nZWQgKHNtYXJ0Q29sb3IpID0+XG4gICAgICAgICAgICAgICAgICAgIEBlbGVtZW50LnNldENvbG9yIGRvIC0+XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBzbWFydENvbG9yIHRoZW4gcmV0dXJuIHNtYXJ0Q29sb3JcbiAgICAgICAgICAgICAgICAgICAgICAgICMgRGVmYXVsdCB0byAjZjAwIHJlZFxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gY29sb3JQaWNrZXIuU21hcnRDb2xvci5IRVggJyNmMDAnXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICMgIENyZWF0ZSBDb2xvciB0ZXh0IGVsZW1lbnRcbiAgICAgICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIHNldFRpbWVvdXQgPT5cbiAgICAgICAgICAgICAgICBBbHBoYSA9IGNvbG9yUGlja2VyLmdldEV4dGVuc2lvbiAnQWxwaGEnXG4gICAgICAgICAgICAgICAgUmV0dXJuID0gY29sb3JQaWNrZXIuZ2V0RXh0ZW5zaW9uICdSZXR1cm4nXG4gICAgICAgICAgICAgICAgRm9ybWF0ID0gY29sb3JQaWNrZXIuZ2V0RXh0ZW5zaW9uICdGb3JtYXQnXG5cbiAgICAgICAgICAgICAgICAjIENyZWF0ZSB0ZXh0IGVsZW1lbnRcbiAgICAgICAgICAgICAgICBfdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ3AnXG4gICAgICAgICAgICAgICAgX3RleHQuY2xhc3NMaXN0LmFkZCBcIiN7IEBlbGVtZW50LmVsLmNsYXNzTmFtZSB9LXRleHRcIlxuXG4gICAgICAgICAgICAgICAgIyBSZXNldCBiZWZvcmUgY29sb3IgcGlja2VyIG9wZW5cbiAgICAgICAgICAgICAgICBjb2xvclBpY2tlci5vbkJlZm9yZU9wZW4gPT4gQGNvbG9yID0gbnVsbFxuXG4gICAgICAgICAgICAgICAgIyBLZWVwIHRyYWNrIG9mIHRoZSBpbnB1dCBjb2xvciAoZm9yIGl0cyBmb3JtYXQpXG4gICAgICAgICAgICAgICAgX2lucHV0Q29sb3IgPSBudWxsXG5cbiAgICAgICAgICAgICAgICBjb2xvclBpY2tlci5vbklucHV0Q29sb3IgKHNtYXJ0Q29sb3IsIHdhc0ZvdW5kKSAtPlxuICAgICAgICAgICAgICAgICAgICBfaW5wdXRDb2xvciA9IGlmIHdhc0ZvdW5kXG4gICAgICAgICAgICAgICAgICAgICAgICBzbWFydENvbG9yXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgbnVsbFxuXG4gICAgICAgICAgICAgICAgIyBLZWVwIHRyYWNrIG9mIHRoZSBGb3JtYXQgZWxlbWVudCBmb3JtYXRcbiAgICAgICAgICAgICAgICBfZm9ybWF0Rm9ybWF0ID0gbnVsbFxuICAgICAgICAgICAgICAgIEZvcm1hdC5vbkZvcm1hdENoYW5nZWQgKGZvcm1hdCkgLT4gX2Zvcm1hdEZvcm1hdCA9IGZvcm1hdFxuICAgICAgICAgICAgICAgIGNvbG9yUGlja2VyLm9uSW5wdXRDb2xvciAtPiBfZm9ybWF0Rm9ybWF0ID0gbnVsbFxuXG4gICAgICAgICAgICAgICAgIyBTZXQgdGhlIHRleHQgZWxlbWVudCB0byBjb250YWluIHRoZSBDb2xvciBkYXRhXG4gICAgICAgICAgICAgICAgc2V0Q29sb3IgPSAoc21hcnRDb2xvcikgPT5cbiAgICAgICAgICAgICAgICAgICAgX3ByZWZlcnJlZEZvcm1hdCA9IGF0b20uY29uZmlnLmdldCAnY29sb3ItcGlja2VyLnByZWZlcnJlZEZvcm1hdCdcbiAgICAgICAgICAgICAgICAgICAgX2Zvcm1hdCA9IF9mb3JtYXRGb3JtYXQgb3IgX2lucHV0Q29sb3I/LmZvcm1hdCBvciBfcHJlZmVycmVkRm9ybWF0IG9yICdSR0InXG5cbiAgICAgICAgICAgICAgICAgICAgIyBUT0RPOiBUaGlzIGlzIHZlcnkgZnJhZ2lsZVxuICAgICAgICAgICAgICAgICAgICBfZnVuY3Rpb24gPSBpZiBzbWFydENvbG9yLmdldEFscGhhKCkgPCAxIHx8IGF0b20uY29uZmlnLmdldCAnY29sb3ItcGlja2VyLmFscGhhQ2hhbm5lbEFsd2F5cydcbiAgICAgICAgICAgICAgICAgICAgICAgIChzbWFydENvbG9yW1widG8jeyBfZm9ybWF0IH1BXCJdIG9yIHNtYXJ0Q29sb3JbXCJ0byN7IF9mb3JtYXQgfVwiXSlcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBzbWFydENvbG9yW1widG8jeyBfZm9ybWF0IH1cIl1cblxuICAgICAgICAgICAgICAgICAgICAjIElmIGEgY29sb3Igd2FzIGlucHV0LCBhbmQgdGhlIHZhbHVlIGhhc24ndCBjaGFuZ2VkIHNpbmNlLFxuICAgICAgICAgICAgICAgICAgICAjIHNob3cgdGhlIGluaXRhbCB2YWx1ZSBub3QgdG8gY29uZnVzZSB0aGUgdXNlciwgYnV0IG9ubHlcbiAgICAgICAgICAgICAgICAgICAgIyBpZiB0aGUgaW5wdXQgY29sb3IgZm9ybWF0IGlzIHN0aWxsIHRoZSBzYW1lXG4gICAgICAgICAgICAgICAgICAgIF9vdXRwdXRDb2xvciA9IGRvIC0+XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBfaW5wdXRDb2xvciBhbmQgKF9pbnB1dENvbG9yLmZvcm1hdCBpcyBfZm9ybWF0IG9yIF9pbnB1dENvbG9yLmZvcm1hdCBpcyBcIiN7IF9mb3JtYXQgfUFcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBzbWFydENvbG9yLmVxdWFscyBfaW5wdXRDb2xvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2lucHV0Q29sb3IudmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfZnVuY3Rpb24uY2FsbCBzbWFydENvbG9yXG5cbiAgICAgICAgICAgICAgICAgICAgIyBGaW5pc2ggaGVyZSBpZiB0aGUgX291dHB1dENvbG9yIGlzIHRoZSBzYW1lIGFzIHRoZVxuICAgICAgICAgICAgICAgICAgICAjIGN1cnJlbnQgY29sb3JcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBfb3V0cHV0Q29sb3IgaXNudCBAY29sb3JcblxuICAgICAgICAgICAgICAgICAgICAjIEF1dG9tYXRpY2FsbHkgcmVwbGFjZSBjb2xvciBpbiBlZGl0b3IgaWZcbiAgICAgICAgICAgICAgICAgICAgIyBgYXV0b21hdGljUmVwbGFjZWAgaXMgdHJ1ZSwgYnV0IG9ubHkgaWYgdGhlcmUgd2FzIGFuXG4gICAgICAgICAgICAgICAgICAgICMgaW5wdXQgY29sb3IgYW5kIGlmIGl0IGlzIGRpZmZlcmVudCBmcm9tIGJlZm9yZVxuICAgICAgICAgICAgICAgICAgICBpZiBfaW5wdXRDb2xvciBhbmQgYXRvbS5jb25maWcuZ2V0ICdjb2xvci1waWNrZXIuYXV0b21hdGljUmVwbGFjZSdcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yUGlja2VyLnJlcGxhY2UgX291dHB1dENvbG9yXG5cbiAgICAgICAgICAgICAgICAgICAgIyBTZXQgYW5kIHNhdmUgdGhlIG91dHB1dCBjb2xvclxuICAgICAgICAgICAgICAgICAgICBAY29sb3IgPSBfb3V0cHV0Q29sb3JcbiAgICAgICAgICAgICAgICAgICAgX3RleHQuaW5uZXJUZXh0ID0gX291dHB1dENvbG9yXG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEBlbWl0T3V0cHV0Rm9ybWF0IF9mb3JtYXRcblxuICAgICAgICAgICAgICAgICMgVXBkYXRlIG9uIGFscGhhIGNoYW5nZSwga2VlcCB0cmFjayBvZiBjdXJyZW50IGNvbG9yXG4gICAgICAgICAgICAgICAgX2N1cnJlbnRDb2xvciA9IG51bGxcblxuICAgICAgICAgICAgICAgIEFscGhhLm9uQ29sb3JDaGFuZ2VkIChzbWFydENvbG9yKSA9PlxuICAgICAgICAgICAgICAgICAgICBzZXRDb2xvciBfY3VycmVudENvbG9yID0gZG8gLT5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIHNtYXJ0Q29sb3IgdGhlbiByZXR1cm4gc21hcnRDb2xvclxuICAgICAgICAgICAgICAgICAgICAgICAgIyBEZWZhdWx0IHRvICNmMDAgcmVkXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBjb2xvclBpY2tlci5TbWFydENvbG9yLkhFWCAnI2YwMCdcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgICAgICAjIFdoZW4gRm9ybWF0IGlzIGNoYW5nZWQsIHVwZGF0ZSBjb2xvclxuICAgICAgICAgICAgICAgIEZvcm1hdC5vbkZvcm1hdENoYW5nZWQgLT4gc2V0Q29sb3IgX2N1cnJlbnRDb2xvclxuXG4gICAgICAgICAgICAgICAgIyBXaGVuIHRoZSBgUmV0dXJuYCBlbGVtZW50IGlzIHZpc2libGUsIGFkZCBhIGNsYXNzIHRvIGFsbG93XG4gICAgICAgICAgICAgICAgIyB0aGUgdGV4dCB0byBiZSBwdXNoZWQgdXAgb3IgZG93biBhIGJpdFxuICAgICAgICAgICAgICAgIFJldHVybi5vblZpc2liaWxpdHkgKHZpc2liaWxpdHkpID0+XG4gICAgICAgICAgICAgICAgICAgIGlmIHZpc2liaWxpdHkgdGhlbiBAZWxlbWVudC5hZGRDbGFzcyAnaXMtLXJldHVyblZpc2libGUnXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgQGVsZW1lbnQucmVtb3ZlQ2xhc3MgJ2lzLS1yZXR1cm5WaXNpYmxlJ1xuICAgICAgICAgICAgICAgIEBlbGVtZW50LmFkZCBfdGV4dFxuICAgICAgICAgICAgcmV0dXJuIHRoaXNcbiJdfQ==
