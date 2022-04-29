(function() {
  var CompositeDisposable, DoubleTag, Point, Range, ref;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Range = ref.Range, Point = ref.Point;

  module.exports = DoubleTag = (function() {
    var getScopes;

    function DoubleTag(editor) {
      this.editor = editor;
      this.subscriptions = new CompositeDisposable;
      this.foundTag = false;
      this.foundEndTag = false;
      this.watchForTag();
    }

    DoubleTag.prototype.destroy = function() {
      var ref1;
      return (ref1 = this.subscriptions) != null ? ref1.dispose() : void 0;
    };

    DoubleTag.prototype.watchForTag = function() {
      return this.subscriptions.add(this.editor.onDidChangeCursorPosition((function(_this) {
        return function(event) {
          if (_this.foundTag && _this.cursorLeftMarker(_this.startMarker)) {
            _this.reset();
          }
          if (_this.foundEndTag && _this.cursorLeftMarker(_this.endMarker)) {
            _this.reset();
          }
          if (_this.foundTag || _this.foundEndTag) {
            return;
          }
          return _this.findTag(event.cursor);
        };
      })(this)));
    };

    DoubleTag.prototype.reset = function() {
      this.foundTag = false;
      this.foundEndTag = false;
      this.startMarker.destroy();
      this.endMarker.destroy();
      this.startMaker = null;
      return this.endMaker = null;
    };

    DoubleTag.prototype.findTag = function(cursor1) {
      this.cursor = cursor1;
      if (this.editor.hasMultipleCursors()) {
        return;
      }
      if (!(this.cursorInHtmlTag() || this.cursorInTreeSitterTag())) {
        return;
      }
      if (this.findStartTag()) {
        if (this.tagShouldBeIgnored()) {
          return;
        }
        this.startMarker = this.editor.markBufferRange(this.startTagRange, {});
        if (!this.findMatchingEndTag()) {
          return;
        }
        this.endMarker = this.editor.markBufferRange(this.endTagRange, {});
        this.foundTag = true;
        return this.subscriptions.add(this.startMarker.onDidChange((function(_this) {
          return function(event) {
            return _this.copyNewTagToEnd();
          };
        })(this)));
      } else if (atom.config.get('double-tag.allowEndTagSync') && this.findEndTag()) {
        if (this.tagShouldBeIgnored()) {
          return;
        }
        this.endMarker = this.editor.markBufferRange(this.endTagRange, {});
        if (!this.findMatchingStartTag()) {
          return;
        }
        this.startMarker = this.editor.markBufferRange(this.startTagRange, {});
        this.foundEndTag = true;
        return this.subscriptions.add(this.endMarker.onDidChange((function(_this) {
          return function(event) {
            return _this.copyNewTagToStart();
          };
        })(this)));
      }
    };

    DoubleTag.prototype.copyNewTagToEnd = function() {
      var matches, newTag, newTagLength, oldTag, origTagLength;
      if (this.editor.hasMultipleCursors()) {
        return;
      }
      newTag = this.editor.getTextInBufferRange(this.startMarker.getBufferRange());
      oldTag = this.editor.getTextInBufferRange(this.endMarker.getBufferRange());
      if (newTag === oldTag) {
        return this.reset();
      }
      origTagLength = newTag.length;
      if (origTagLength) {
        matches = newTag.match(/^[\w-]+/);
        if (!matches) {
          return this.reset();
        }
        newTag = matches[0];
      }
      newTagLength = newTag.length;
      this.editor.setTextInBufferRange(this.endMarker.getBufferRange(), newTag);
      this.editor.buffer.groupLastChanges();
      if (!(origTagLength !== null && newTagLength !== null && origTagLength === newTagLength)) {
        return this.reset();
      }
    };

    DoubleTag.prototype.copyNewTagToStart = function() {
      var matches, newTag, newTagLength, origTagLength;
      if (this.editor.hasMultipleCursors()) {
        return;
      }
      newTag = this.editor.getTextInBufferRange(this.endMarker.getBufferRange());
      origTagLength = newTag.length;
      if (origTagLength) {
        matches = newTag.match(/^[\w-]+/);
        if (!matches) {
          return this.reset();
        }
        newTag = matches[0];
      }
      newTagLength = newTag.length;
      this.editor.setTextInBufferRange(this.startMarker.getBufferRange(), newTag);
      this.editor.buffer.groupLastChanges();
      if (!(origTagLength !== null && newTagLength !== null && origTagLength === newTagLength)) {
        return this.reset();
      }
    };

    DoubleTag.prototype.setFrontOfStartTag = function() {
      var frontOfStartTag, frontRegex;
      frontRegex = /<[a-z]+/i;
      frontOfStartTag = this.cursor.getBeginningOfCurrentWordBufferPosition({
        wordRegex: frontRegex
      });
      if (!frontOfStartTag) {
        return;
      }
      return this.frontOfStartTag = new Point(frontOfStartTag.row, frontOfStartTag.column + 1);
    };

    DoubleTag.prototype.setFrontOfEndTag = function() {
      var endRegex, frontOfEndTag;
      endRegex = new RegExp("</", "i");
      frontOfEndTag = this.cursor.getBeginningOfCurrentWordBufferPosition({
        wordRegex: endRegex
      });
      return this.frontOfEndTag = new Point(frontOfEndTag.row, frontOfEndTag.column + 2);
    };

    DoubleTag.prototype.setBackOfStartTag = function() {
      var backOfStartTag, backRegex, endOfLine, row, rowLength, scanRange;
      row = this.frontOfStartTag.row;
      rowLength = this.editor.buffer.lineLengthForRow(row);
      backRegex = /[^\w-]/;
      endOfLine = new Point(row, rowLength);
      scanRange = new Range(this.frontOfStartTag, endOfLine);
      backOfStartTag = null;
      this.editor.buffer.scanInRange(backRegex, scanRange, function(obj) {
        backOfStartTag = obj.range.start;
        return obj.stop();
      });
      return this.backOfStartTag = backOfStartTag || endOfLine;
    };

    DoubleTag.prototype.setBackOfEndTag = function() {
      var backOfEndTag, backRegex, endOfLine, row, rowLength, scanRange;
      row = this.frontOfEndTag.row;
      rowLength = this.editor.buffer.lineLengthForRow(row);
      backRegex = /[^\w-]/;
      endOfLine = new Point(row, rowLength);
      scanRange = new Range(this.frontOfEndTag, endOfLine);
      backOfEndTag = null;
      this.editor.buffer.scanInRange(backRegex, scanRange, function(obj) {
        backOfEndTag = obj.range.start;
        return obj.stop();
      });
      return this.backOfEndTag = backOfEndTag || endOfLine;
    };

    DoubleTag.prototype.findStartTag = function() {
      this.setFrontOfStartTag();
      if (!this.frontOfStartTag) {
        return;
      }
      this.setBackOfStartTag();
      if (!(this.backOfStartTag && this.tagIsComplete())) {
        return;
      }
      this.startTagRange = new Range(this.frontOfStartTag, this.backOfStartTag);
      if (!this.cursorIsInStartTag()) {
        return;
      }
      this.tagText = this.editor.getTextInBufferRange(this.startTagRange);
      return true;
    };

    DoubleTag.prototype.findMatchingEndTag = function() {
      var endTagRange, nestedTagCount, regexSafeTagText, scanRange, tagRegex;
      regexSafeTagText = this.tagText.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&');
      tagRegex = new RegExp("<\\/?" + regexSafeTagText + "[>\\s]", 'gi');
      endTagRange = null;
      nestedTagCount = 0;
      scanRange = new Range(this.backOfStartTag, this.editor.buffer.getEndPosition());
      this.editor.buffer.scanInRange(tagRegex, scanRange, function(obj) {
        if (obj.matchText.match(/^<\w/)) {
          nestedTagCount++;
        } else {
          nestedTagCount--;
        }
        if (nestedTagCount < 0) {
          endTagRange = obj.range;
          return obj.stop();
        }
      });
      if (!endTagRange) {
        return;
      }
      this.endTagRange = new Range([endTagRange.start.row, endTagRange.start.column + 2], [endTagRange.end.row, endTagRange.end.column - 1]);
      return true;
    };

    DoubleTag.prototype.findMatchingStartTag = function() {
      var nestedTagCount, rangeEnd, rangeStart, regexSafeTagText, scanRange, startTagRange, tagRegex;
      regexSafeTagText = this.tagText.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&');
      tagRegex = new RegExp("<\\/?" + regexSafeTagText + "([> ]|(?=\\n))", 'gi');
      startTagRange = null;
      nestedTagCount = 0;
      scanRange = new Range([0, 0], this.frontOfEndTag);
      this.editor.buffer.backwardsScanInRange(tagRegex, scanRange, function(obj) {
        if (obj.matchText.match(/^<\//)) {
          nestedTagCount++;
        } else {
          nestedTagCount--;
        }
        if (nestedTagCount < 0) {
          startTagRange = obj.range;
          return obj.stop();
        }
      });
      if (!startTagRange) {
        return;
      }
      rangeStart = [startTagRange.start.row, startTagRange.start.column + 1];
      if (/\w$/.test(this.editor.getTextInBufferRange(startTagRange))) {
        rangeEnd = startTagRange.end;
      } else {
        rangeEnd = [startTagRange.end.row, startTagRange.end.column - 1];
      }
      this.startTagRange = new Range(rangeStart, rangeEnd);
      return true;
    };

    DoubleTag.prototype.findEndTag = function() {
      this.setFrontOfEndTag();
      if (!this.frontOfEndTag) {
        return;
      }
      this.setBackOfEndTag();
      if (!this.backOfEndTag) {
        return;
      }
      this.endTagRange = new Range(this.frontOfEndTag, this.backOfEndTag);
      this.tagText = this.editor.getTextInBufferRange(this.endTagRange);
      return true;
    };

    DoubleTag.prototype.cursorInHtmlTag = function() {
      var scopes, tagScopeRegex;
      scopes = getScopes(this.cursor);
      if (!(scopes != null ? scopes.length : void 0)) {
        return;
      }
      tagScopeRegex = /meta\.tag|tag\.\w+(\.\w+)?\.html/;
      return scopes.some(function(scope) {
        return tagScopeRegex.test(scope);
      });
    };

    DoubleTag.prototype.cursorInTreeSitterTag = function() {
      var htmlScope, leftPosition, scopeDescriptor, scopes;
      htmlScope = /entity\.name\.tag/;
      scopes = getScopes(this.cursor);
      if (!(scopes != null ? scopes.length : void 0)) {
        return;
      }
      if (htmlScope.test(scopes[scopes.length - 1])) {
        return true;
      }
      leftPosition = [this.cursor.getBufferRow(), this.cursor.getBufferColumn() - 1];
      scopeDescriptor = this.editor.scopeDescriptorForBufferPosition(leftPosition);
      if (!scopeDescriptor) {
        return;
      }
      scopes = scopeDescriptor.getScopesArray();
      if (!(scopes != null ? scopes.length : void 0)) {
        return;
      }
      if (htmlScope.test(scopes[scopes.length - 1])) {
        return true;
      }
    };

    DoubleTag.prototype.cursorIsInStartTag = function() {
      var cursorPosition;
      cursorPosition = this.cursor.getBufferPosition();
      if (!this.startTagRange.containsPoint(cursorPosition)) {
        return;
      }
      return true;
    };

    DoubleTag.prototype.cursorIsInEndTag = function() {
      var cursorPosition;
      cursorPosition = this.cursor.getBufferPosition();
      if (!this.endTagRange.containsPoint(cursorPosition)) {
        return;
      }
      return true;
    };

    DoubleTag.prototype.cursorLeftMarker = function(marker) {
      var cursorPosition;
      cursorPosition = this.cursor.getBufferPosition();
      return !marker.getBufferRange().containsPoint(cursorPosition);
    };

    DoubleTag.prototype.tagShouldBeIgnored = function() {
      var ref1;
      return ((ref1 = atom.config.get('double-tag.ignoredTags')) != null ? ref1.indexOf(this.tagText) : void 0) >= 0;
    };

    DoubleTag.prototype.tagIsComplete = function() {
      var nextCharacter, ref1, regex, scanRange, tagIsComplete;
      tagIsComplete = false;
      scanRange = new Range(this.backOfStartTag, this.editor.buffer.getEndPosition());
      nextCharacter = (ref1 = this.editor.getTextInBufferRange(scanRange)) != null ? ref1[0] : void 0;
      if (nextCharacter === '>') {
        return true;
      }
      regex = new RegExp('<[^?%]|[^?%/]>', 'i');
      this.editor.buffer.scanInRange(regex, scanRange, function(obj) {
        return tagIsComplete = />$/.test(obj.matchText);
      });
      return tagIsComplete;
    };

    getScopes = function(cursor) {
      var scopeDescriptor;
      scopeDescriptor = cursor != null ? cursor.getScopeDescriptor() : void 0;
      if (!scopeDescriptor) {
        return;
      }
      return scopeDescriptor.getScopesArray();
    };

    return DoubleTag;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdHVua2VydC8uYXRvbS9wYWNrYWdlcy9kb3VibGUtdGFnL2xpYi9kb3VibGUtdGFnLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBc0MsT0FBQSxDQUFRLE1BQVIsQ0FBdEMsRUFBQyw2Q0FBRCxFQUFzQixpQkFBdEIsRUFBNkI7O0VBRTdCLE1BQU0sQ0FBQyxPQUFQLEdBRU07QUFDSixRQUFBOztJQUFhLG1CQUFDLE1BQUQ7TUFBQyxJQUFDLENBQUEsU0FBRDtNQUNaLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFDckIsSUFBQyxDQUFBLFFBQUQsR0FBWTtNQUNaLElBQUMsQ0FBQSxXQUFELEdBQWU7TUFDZixJQUFDLENBQUEsV0FBRCxDQUFBO0lBSlc7O3dCQU1iLE9BQUEsR0FBUyxTQUFBO0FBQ1AsVUFBQTt1REFBYyxDQUFFLE9BQWhCLENBQUE7SUFETzs7d0JBR1QsV0FBQSxHQUFhLFNBQUE7YUFDWCxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyx5QkFBUixDQUFrQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRDtVQUNuRCxJQUFZLEtBQUMsQ0FBQSxRQUFELElBQWMsS0FBQyxDQUFBLGdCQUFELENBQWtCLEtBQUMsQ0FBQSxXQUFuQixDQUExQjtZQUFBLEtBQUMsQ0FBQSxLQUFELENBQUEsRUFBQTs7VUFDQSxJQUFZLEtBQUMsQ0FBQSxXQUFELElBQWlCLEtBQUMsQ0FBQSxnQkFBRCxDQUFrQixLQUFDLENBQUEsU0FBbkIsQ0FBN0I7WUFBQSxLQUFDLENBQUEsS0FBRCxDQUFBLEVBQUE7O1VBQ0EsSUFBVSxLQUFDLENBQUEsUUFBRCxJQUFhLEtBQUMsQ0FBQSxXQUF4QjtBQUFBLG1CQUFBOztpQkFDQSxLQUFDLENBQUEsT0FBRCxDQUFTLEtBQUssQ0FBQyxNQUFmO1FBSm1EO01B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QixDQUFDLE1BQU0sQ0FBQyxjQUFQLENBQUEsQ0FBdUIsQ0FBQyxhQUF4QixDQUFzQyxjQUF0QztJQUZlOzt3QkFJbEIsa0JBQUEsR0FBb0IsU0FBQTtBQUNsQixVQUFBOytFQUF5QyxDQUFFLE9BQTNDLENBQW1ELElBQUMsQ0FBQSxPQUFwRCxXQUFBLElBQWdFO0lBRDlDOzt3QkFHcEIsYUFBQSxHQUFlLFNBQUE7QUFDYixVQUFBO01BQUEsYUFBQSxHQUFnQjtNQUNoQixTQUFBLEdBQVksSUFBSSxLQUFKLENBQVUsSUFBQyxDQUFBLGNBQVgsRUFBMkIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBZixDQUFBLENBQTNCO01BQ1osYUFBQSxzRUFBeUQsQ0FBQSxDQUFBO01BQ3pELElBQWUsYUFBQSxLQUFpQixHQUFoQztBQUFBLGVBQU8sS0FBUDs7TUFDQSxLQUFBLEdBQVEsSUFBSSxNQUFKLENBQVcsZ0JBQVgsRUFBNkIsR0FBN0I7TUFDUixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFmLENBQTJCLEtBQTNCLEVBQWtDLFNBQWxDLEVBQTZDLFNBQUMsR0FBRDtlQUMzQyxhQUFBLEdBQWlCLElBQUssQ0FBQyxJQUFQLENBQVksR0FBRyxDQUFDLFNBQWhCO01BRDJCLENBQTdDO2FBRUE7SUFSYTs7SUFVZixTQUFBLEdBQVksU0FBQyxNQUFEO0FBQ1YsVUFBQTtNQUFBLGVBQUEsb0JBQWtCLE1BQU0sQ0FBRSxrQkFBUixDQUFBO01BQ2xCLElBQUEsQ0FBYyxlQUFkO0FBQUEsZUFBQTs7YUFDQSxlQUFlLENBQUMsY0FBaEIsQ0FBQTtJQUhVOzs7OztBQXRRZCIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlLCBSYW5nZSwgUG9pbnR9ID0gcmVxdWlyZSAnYXRvbSdcblxubW9kdWxlLmV4cG9ydHMgPVxuXG5jbGFzcyBEb3VibGVUYWdcbiAgY29uc3RydWN0b3I6IChAZWRpdG9yKSAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAZm91bmRUYWcgPSBmYWxzZVxuICAgIEBmb3VuZEVuZFRhZyA9IGZhbHNlXG4gICAgQHdhdGNoRm9yVGFnKClcblxuICBkZXN0cm95OiAtPlxuICAgIEBzdWJzY3JpcHRpb25zPy5kaXNwb3NlKClcblxuICB3YXRjaEZvclRhZzogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQGVkaXRvci5vbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uIChldmVudCkgPT5cbiAgICAgIEByZXNldCgpIGlmIEBmb3VuZFRhZyBhbmQgQGN1cnNvckxlZnRNYXJrZXIoQHN0YXJ0TWFya2VyKVxuICAgICAgQHJlc2V0KCkgaWYgQGZvdW5kRW5kVGFnIGFuZCBAY3Vyc29yTGVmdE1hcmtlcihAZW5kTWFya2VyKVxuICAgICAgcmV0dXJuIGlmIEBmb3VuZFRhZyB8fCBAZm91bmRFbmRUYWdcbiAgICAgIEBmaW5kVGFnKGV2ZW50LmN1cnNvcilcblxuICByZXNldDogLT5cbiAgICBAZm91bmRUYWcgPSBmYWxzZVxuICAgIEBmb3VuZEVuZFRhZyA9IGZhbHNlXG4gICAgQHN0YXJ0TWFya2VyLmRlc3Ryb3koKVxuICAgIEBlbmRNYXJrZXIuZGVzdHJveSgpXG4gICAgQHN0YXJ0TWFrZXIgPSBudWxsXG4gICAgQGVuZE1ha2VyID0gbnVsbFxuXG4gICMgcHJpdmF0ZVxuXG4gIGZpbmRUYWc6IChAY3Vyc29yKSAtPlxuICAgIHJldHVybiBpZiBAZWRpdG9yLmhhc011bHRpcGxlQ3Vyc29ycygpXG4gICAgcmV0dXJuIHVubGVzcyBAY3Vyc29ySW5IdG1sVGFnKCkgfHwgQGN1cnNvckluVHJlZVNpdHRlclRhZygpXG5cbiAgICBpZiBAZmluZFN0YXJ0VGFnKClcbiAgICAgIHJldHVybiBpZiBAdGFnU2hvdWxkQmVJZ25vcmVkKClcblxuICAgICAgQHN0YXJ0TWFya2VyID0gQGVkaXRvci5tYXJrQnVmZmVyUmFuZ2UoQHN0YXJ0VGFnUmFuZ2UsIHt9KVxuXG4gICAgICByZXR1cm4gdW5sZXNzIEBmaW5kTWF0Y2hpbmdFbmRUYWcoKVxuICAgICAgQGVuZE1hcmtlciA9IEBlZGl0b3IubWFya0J1ZmZlclJhbmdlKEBlbmRUYWdSYW5nZSwge30pXG4gICAgICBAZm91bmRUYWcgPSB0cnVlXG5cbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAc3RhcnRNYXJrZXIub25EaWRDaGFuZ2UgKGV2ZW50KSA9PlxuICAgICAgICBAY29weU5ld1RhZ1RvRW5kKClcbiAgICBlbHNlIGlmIGF0b20uY29uZmlnLmdldCgnZG91YmxlLXRhZy5hbGxvd0VuZFRhZ1N5bmMnKSBhbmQgQGZpbmRFbmRUYWcoKVxuICAgICAgcmV0dXJuIGlmIEB0YWdTaG91bGRCZUlnbm9yZWQoKVxuXG4gICAgICBAZW5kTWFya2VyID0gQGVkaXRvci5tYXJrQnVmZmVyUmFuZ2UoQGVuZFRhZ1JhbmdlLCB7fSlcblxuICAgICAgcmV0dXJuIHVubGVzcyBAZmluZE1hdGNoaW5nU3RhcnRUYWcoKVxuICAgICAgQHN0YXJ0TWFya2VyID0gQGVkaXRvci5tYXJrQnVmZmVyUmFuZ2UoQHN0YXJ0VGFnUmFuZ2UsIHt9KVxuICAgICAgQGZvdW5kRW5kVGFnID0gdHJ1ZVxuXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQGVuZE1hcmtlci5vbkRpZENoYW5nZSAoZXZlbnQpID0+XG4gICAgICAgIEBjb3B5TmV3VGFnVG9TdGFydCgpXG5cbiAgY29weU5ld1RhZ1RvRW5kOiAtPlxuICAgIHJldHVybiBpZiBAZWRpdG9yLmhhc011bHRpcGxlQ3Vyc29ycygpXG4gICAgbmV3VGFnID0gQGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShAc3RhcnRNYXJrZXIuZ2V0QnVmZmVyUmFuZ2UoKSlcbiAgICBvbGRUYWcgPSBAZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKEBlbmRNYXJrZXIuZ2V0QnVmZmVyUmFuZ2UoKSlcbiAgICAjIHJhbiB1bmRvXG4gICAgcmV0dXJuIEByZXNldCgpIGlmIG5ld1RhZyA9PSBvbGRUYWdcbiAgICAjIHJlbW92ZSBzcGFjZSBhZnRlciBuZXcgdGFnLCBidXQgYWxsb3cgYmxhbmsgbmV3IHRhZ1xuICAgIG9yaWdUYWdMZW5ndGggPSBuZXdUYWcubGVuZ3RoXG4gICAgaWYgb3JpZ1RhZ0xlbmd0aFxuICAgICAgbWF0Y2hlcyA9IG5ld1RhZy5tYXRjaCgvXltcXHctXSsvKVxuICAgICAgcmV0dXJuIEByZXNldCgpIHVubGVzcyBtYXRjaGVzXG4gICAgICBuZXdUYWcgPSBtYXRjaGVzWzBdXG4gICAgbmV3VGFnTGVuZ3RoID0gbmV3VGFnLmxlbmd0aFxuICAgIEBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UoQGVuZE1hcmtlci5nZXRCdWZmZXJSYW5nZSgpLCBuZXdUYWcpXG4gICAgQGVkaXRvci5idWZmZXIuZ3JvdXBMYXN0Q2hhbmdlcygpXG4gICAgIyByZXNldCBpZiBhIHNwYWNlIHdhcyBhZGRlZFxuICAgIEByZXNldCgpIHVubGVzcyBvcmlnVGFnTGVuZ3RoICE9IG51bGwgYW5kIG5ld1RhZ0xlbmd0aCAhPSBudWxsIGFuZFxuICAgICAgICAgICAgICAgICAgICBvcmlnVGFnTGVuZ3RoID09IG5ld1RhZ0xlbmd0aFxuXG4gIGNvcHlOZXdUYWdUb1N0YXJ0OiAtPlxuICAgIHJldHVybiBpZiBAZWRpdG9yLmhhc011bHRpcGxlQ3Vyc29ycygpXG4gICAgbmV3VGFnID0gQGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShAZW5kTWFya2VyLmdldEJ1ZmZlclJhbmdlKCkpXG4gICAgIyByZW1vdmUgc3BhY2UgYWZ0ZXIgbmV3IHRhZywgYnV0IGFsbG93IGJsYW5rIG5ldyB0YWdcbiAgICBvcmlnVGFnTGVuZ3RoID0gbmV3VGFnLmxlbmd0aFxuICAgIGlmIG9yaWdUYWdMZW5ndGhcbiAgICAgIG1hdGNoZXMgPSBuZXdUYWcubWF0Y2goL15bXFx3LV0rLylcbiAgICAgIHJldHVybiBAcmVzZXQoKSB1bmxlc3MgbWF0Y2hlc1xuICAgICAgbmV3VGFnID0gbWF0Y2hlc1swXVxuICAgIG5ld1RhZ0xlbmd0aCA9IG5ld1RhZy5sZW5ndGhcbiAgICBAZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKEBzdGFydE1hcmtlci5nZXRCdWZmZXJSYW5nZSgpLCBuZXdUYWcpXG4gICAgQGVkaXRvci5idWZmZXIuZ3JvdXBMYXN0Q2hhbmdlcygpXG4gICAgIyByZXNldCBpZiBhIHNwYWNlIHdhcyBhZGRlZFxuICAgIEByZXNldCgpIHVubGVzcyBvcmlnVGFnTGVuZ3RoICE9IG51bGwgYW5kIG5ld1RhZ0xlbmd0aCAhPSBudWxsIGFuZFxuICAgICAgICAgICAgICAgICAgICBvcmlnVGFnTGVuZ3RoID09IG5ld1RhZ0xlbmd0aFxuXG4gIHNldEZyb250T2ZTdGFydFRhZzogLT5cbiAgICBmcm9udFJlZ2V4ID0gLzxbYS16XSsvaVxuICAgIGZyb250T2ZTdGFydFRhZyA9IEBjdXJzb3IuZ2V0QmVnaW5uaW5nT2ZDdXJyZW50V29yZEJ1ZmZlclBvc2l0aW9uKFxuICAgICAge3dvcmRSZWdleDogZnJvbnRSZWdleH1cbiAgICApXG4gICAgcmV0dXJuIHVubGVzcyBmcm9udE9mU3RhcnRUYWdcblxuICAgICMgZG9uJ3QgaW5jbHVkZSA8XG4gICAgQGZyb250T2ZTdGFydFRhZyA9IG5ldyBQb2ludChcbiAgICAgIGZyb250T2ZTdGFydFRhZy5yb3csIGZyb250T2ZTdGFydFRhZy5jb2x1bW4gKyAxXG4gICAgKVxuXG4gIHNldEZyb250T2ZFbmRUYWc6IC0+XG4gICAgZW5kUmVnZXggPSBuZXcgUmVnRXhwKFwiPC9cIiwgXCJpXCIpXG4gICAgZnJvbnRPZkVuZFRhZyA9XG4gICAgICBAY3Vyc29yLmdldEJlZ2lubmluZ09mQ3VycmVudFdvcmRCdWZmZXJQb3NpdGlvbih7d29yZFJlZ2V4OiBlbmRSZWdleH0pXG5cbiAgICAjIGRvbid0IGluY2x1ZGUgPFxuICAgIEBmcm9udE9mRW5kVGFnID0gbmV3IFBvaW50KFxuICAgICAgZnJvbnRPZkVuZFRhZy5yb3csIGZyb250T2ZFbmRUYWcuY29sdW1uICsgMlxuICAgIClcblxuICBzZXRCYWNrT2ZTdGFydFRhZzogLT5cbiAgICByb3cgPSBAZnJvbnRPZlN0YXJ0VGFnLnJvd1xuICAgIHJvd0xlbmd0aCA9IEBlZGl0b3IuYnVmZmVyLmxpbmVMZW5ndGhGb3JSb3cocm93KVxuXG4gICAgYmFja1JlZ2V4ID0gL1teXFx3LV0vXG4gICAgZW5kT2ZMaW5lID0gbmV3IFBvaW50KHJvdywgcm93TGVuZ3RoKVxuICAgIHNjYW5SYW5nZSA9IG5ldyBSYW5nZShAZnJvbnRPZlN0YXJ0VGFnLCBlbmRPZkxpbmUpXG4gICAgYmFja09mU3RhcnRUYWcgPSBudWxsXG4gICAgQGVkaXRvci5idWZmZXIuc2NhbkluUmFuZ2UgYmFja1JlZ2V4LCBzY2FuUmFuZ2UsIChvYmopIC0+XG4gICAgICBiYWNrT2ZTdGFydFRhZyA9IG9iai5yYW5nZS5zdGFydFxuICAgICAgb2JqLnN0b3AoKVxuICAgIEBiYWNrT2ZTdGFydFRhZyA9IGJhY2tPZlN0YXJ0VGFnIHx8IGVuZE9mTGluZVxuXG4gIHNldEJhY2tPZkVuZFRhZzogLT5cbiAgICByb3cgPSBAZnJvbnRPZkVuZFRhZy5yb3dcbiAgICByb3dMZW5ndGggPSBAZWRpdG9yLmJ1ZmZlci5saW5lTGVuZ3RoRm9yUm93KHJvdylcblxuICAgIGJhY2tSZWdleCA9IC9bXlxcdy1dL1xuICAgIGVuZE9mTGluZSA9IG5ldyBQb2ludChyb3csIHJvd0xlbmd0aClcbiAgICBzY2FuUmFuZ2UgPSBuZXcgUmFuZ2UoQGZyb250T2ZFbmRUYWcsIGVuZE9mTGluZSlcbiAgICBiYWNrT2ZFbmRUYWcgPSBudWxsXG4gICAgQGVkaXRvci5idWZmZXIuc2NhbkluUmFuZ2UgYmFja1JlZ2V4LCBzY2FuUmFuZ2UsIChvYmopIC0+XG4gICAgICBiYWNrT2ZFbmRUYWcgPSBvYmoucmFuZ2Uuc3RhcnRcbiAgICAgIG9iai5zdG9wKClcbiAgICBAYmFja09mRW5kVGFnID0gYmFja09mRW5kVGFnIHx8IGVuZE9mTGluZVxuXG4gIGZpbmRTdGFydFRhZzogLT5cbiAgICBAc2V0RnJvbnRPZlN0YXJ0VGFnKClcbiAgICByZXR1cm4gdW5sZXNzIEBmcm9udE9mU3RhcnRUYWdcblxuICAgIEBzZXRCYWNrT2ZTdGFydFRhZygpXG4gICAgcmV0dXJuIHVubGVzcyBAYmFja09mU3RhcnRUYWcgYW5kIEB0YWdJc0NvbXBsZXRlKClcblxuICAgIEBzdGFydFRhZ1JhbmdlID0gbmV3IFJhbmdlKEBmcm9udE9mU3RhcnRUYWcsIEBiYWNrT2ZTdGFydFRhZylcbiAgICByZXR1cm4gdW5sZXNzIEBjdXJzb3JJc0luU3RhcnRUYWcoKVxuXG4gICAgQHRhZ1RleHQgPSBAZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKEBzdGFydFRhZ1JhbmdlKVxuICAgIHRydWVcblxuICBmaW5kTWF0Y2hpbmdFbmRUYWc6IC0+XG4gICAgcmVnZXhTYWZlVGFnVGV4dCA9XG4gICAgICBAdGFnVGV4dC5yZXBsYWNlKC9bLVtcXF17fSgpKishPD06Py5cXC9cXFxcXiR8I1xccyxdL2csICdcXFxcJCYnKVxuICAgIHRhZ1JlZ2V4ID0gbmV3IFJlZ0V4cChcIjxcXFxcLz8je3JlZ2V4U2FmZVRhZ1RleHR9Wz5cXFxcc11cIiwgJ2dpJylcbiAgICBlbmRUYWdSYW5nZSA9IG51bGxcbiAgICBuZXN0ZWRUYWdDb3VudCA9IDBcbiAgICBzY2FuUmFuZ2UgPSBuZXcgUmFuZ2UoQGJhY2tPZlN0YXJ0VGFnLCBAZWRpdG9yLmJ1ZmZlci5nZXRFbmRQb3NpdGlvbigpKVxuICAgIEBlZGl0b3IuYnVmZmVyLnNjYW5JblJhbmdlIHRhZ1JlZ2V4LCBzY2FuUmFuZ2UsIChvYmopIC0+XG4gICAgICBpZiBvYmoubWF0Y2hUZXh0Lm1hdGNoKC9ePFxcdy8pXG4gICAgICAgIG5lc3RlZFRhZ0NvdW50KytcbiAgICAgIGVsc2VcbiAgICAgICAgbmVzdGVkVGFnQ291bnQtLVxuICAgICAgaWYgbmVzdGVkVGFnQ291bnQgPCAwXG4gICAgICAgIGVuZFRhZ1JhbmdlID0gb2JqLnJhbmdlXG4gICAgICAgIG9iai5zdG9wKClcbiAgICByZXR1cm4gdW5sZXNzIGVuZFRhZ1JhbmdlXG4gICAgIyBkb24ndCBpbmNsdWRlIDxcXCwgPlxuICAgIEBlbmRUYWdSYW5nZSA9IG5ldyBSYW5nZShcbiAgICAgIFtlbmRUYWdSYW5nZS5zdGFydC5yb3csIGVuZFRhZ1JhbmdlLnN0YXJ0LmNvbHVtbiArIDJdLFxuICAgICAgW2VuZFRhZ1JhbmdlLmVuZC5yb3csIGVuZFRhZ1JhbmdlLmVuZC5jb2x1bW4gLSAxXVxuICAgIClcbiAgICB0cnVlXG5cbiAgZmluZE1hdGNoaW5nU3RhcnRUYWc6IC0+XG4gICAgIyBUT0RPOiBtb3ZlIHJlZ2V4IHRvIHN0cmluZ1xuICAgIHJlZ2V4U2FmZVRhZ1RleHQgPVxuICAgICAgQHRhZ1RleHQucmVwbGFjZSgvWy1bXFxde30oKSorITw9Oj8uXFwvXFxcXF4kfCNcXHMsXS9nLCAnXFxcXCQmJylcbiAgICB0YWdSZWdleCA9IG5ldyBSZWdFeHAoXCI8XFxcXC8/I3tyZWdleFNhZmVUYWdUZXh0fShbPiBdfCg/PVxcXFxuKSlcIiwgJ2dpJylcbiAgICBzdGFydFRhZ1JhbmdlID0gbnVsbFxuICAgIG5lc3RlZFRhZ0NvdW50ID0gMFxuICAgIHNjYW5SYW5nZSA9IG5ldyBSYW5nZShbMCwgMF0sIEBmcm9udE9mRW5kVGFnKVxuICAgIEBlZGl0b3IuYnVmZmVyLmJhY2t3YXJkc1NjYW5JblJhbmdlIHRhZ1JlZ2V4LCBzY2FuUmFuZ2UsIChvYmopIC0+XG4gICAgICBpZiBvYmoubWF0Y2hUZXh0Lm1hdGNoKC9ePFxcLy8pXG4gICAgICAgIG5lc3RlZFRhZ0NvdW50KytcbiAgICAgIGVsc2VcbiAgICAgICAgbmVzdGVkVGFnQ291bnQtLVxuICAgICAgaWYgbmVzdGVkVGFnQ291bnQgPCAwXG4gICAgICAgIHN0YXJ0VGFnUmFuZ2UgPSBvYmoucmFuZ2VcbiAgICAgICAgb2JqLnN0b3AoKVxuICAgIHJldHVybiB1bmxlc3Mgc3RhcnRUYWdSYW5nZVxuICAgICMgZG9uJ3QgaW5jbHVkZSA8XG4gICAgcmFuZ2VTdGFydCA9IFtzdGFydFRhZ1JhbmdlLnN0YXJ0LnJvdywgc3RhcnRUYWdSYW5nZS5zdGFydC5jb2x1bW4gKyAxXVxuICAgIGlmIC9cXHckLy50ZXN0KEBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2Uoc3RhcnRUYWdSYW5nZSkpXG4gICAgICByYW5nZUVuZCA9IHN0YXJ0VGFnUmFuZ2UuZW5kXG4gICAgZWxzZVxuICAgICAgIyBkb24ndCBpbmNsdWRlID5cbiAgICAgIHJhbmdlRW5kID0gW3N0YXJ0VGFnUmFuZ2UuZW5kLnJvdywgc3RhcnRUYWdSYW5nZS5lbmQuY29sdW1uIC0gMV1cbiAgICBAc3RhcnRUYWdSYW5nZSA9IG5ldyBSYW5nZShyYW5nZVN0YXJ0LCByYW5nZUVuZClcbiAgICB0cnVlXG5cbiAgZmluZEVuZFRhZzogLT5cbiAgICBAc2V0RnJvbnRPZkVuZFRhZygpXG4gICAgcmV0dXJuIHVubGVzcyBAZnJvbnRPZkVuZFRhZ1xuXG4gICAgQHNldEJhY2tPZkVuZFRhZygpXG4gICAgcmV0dXJuIHVubGVzcyBAYmFja09mRW5kVGFnXG5cbiAgICBAZW5kVGFnUmFuZ2UgPSBuZXcgUmFuZ2UoQGZyb250T2ZFbmRUYWcsIEBiYWNrT2ZFbmRUYWcpXG5cbiAgICBAdGFnVGV4dCA9IEBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UoQGVuZFRhZ1JhbmdlKVxuICAgIHRydWVcblxuICBjdXJzb3JJbkh0bWxUYWc6IC0+XG4gICAgc2NvcGVzID0gZ2V0U2NvcGVzKEBjdXJzb3IpXG4gICAgcmV0dXJuIHVubGVzcyBzY29wZXM/Lmxlbmd0aFxuICAgIHRhZ1Njb3BlUmVnZXggPSAvbWV0YVxcLnRhZ3x0YWdcXC5cXHcrKFxcLlxcdyspP1xcLmh0bWwvXG4gICAgc2NvcGVzLnNvbWUgKHNjb3BlKSAtPiB0YWdTY29wZVJlZ2V4LnRlc3Qoc2NvcGUpXG5cbiAgY3Vyc29ySW5UcmVlU2l0dGVyVGFnOiAtPlxuICAgIGh0bWxTY29wZSA9IC9lbnRpdHlcXC5uYW1lXFwudGFnL1xuICAgIHNjb3BlcyA9IGdldFNjb3BlcyhAY3Vyc29yKVxuICAgIHJldHVybiB1bmxlc3Mgc2NvcGVzPy5sZW5ndGhcbiAgICByZXR1cm4gdHJ1ZSBpZiBodG1sU2NvcGUudGVzdChzY29wZXNbc2NvcGVzLmxlbmd0aCAtIDFdKVxuXG4gICAgbGVmdFBvc2l0aW9uID0gW0BjdXJzb3IuZ2V0QnVmZmVyUm93KCksIEBjdXJzb3IuZ2V0QnVmZmVyQ29sdW1uKCkgLSAxXVxuICAgIHNjb3BlRGVzY3JpcHRvciA9IEBlZGl0b3Iuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24obGVmdFBvc2l0aW9uKVxuICAgIHJldHVybiB1bmxlc3Mgc2NvcGVEZXNjcmlwdG9yXG4gICAgc2NvcGVzID0gc2NvcGVEZXNjcmlwdG9yLmdldFNjb3Blc0FycmF5KClcbiAgICByZXR1cm4gdW5sZXNzIHNjb3Blcz8ubGVuZ3RoXG4gICAgcmV0dXJuIHRydWUgaWYgaHRtbFNjb3BlLnRlc3Qoc2NvcGVzW3Njb3Blcy5sZW5ndGggLSAxXSlcblxuICBjdXJzb3JJc0luU3RhcnRUYWc6IC0+XG4gICAgY3Vyc29yUG9zaXRpb24gPSBAY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgICByZXR1cm4gdW5sZXNzIEBzdGFydFRhZ1JhbmdlLmNvbnRhaW5zUG9pbnQoY3Vyc29yUG9zaXRpb24pXG4gICAgdHJ1ZVxuXG4gIGN1cnNvcklzSW5FbmRUYWc6IC0+XG4gICAgY3Vyc29yUG9zaXRpb24gPSBAY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgICByZXR1cm4gdW5sZXNzIEBlbmRUYWdSYW5nZS5jb250YWluc1BvaW50KGN1cnNvclBvc2l0aW9uKVxuICAgIHRydWVcblxuICBjdXJzb3JMZWZ0TWFya2VyOiAobWFya2VyKSAtPlxuICAgIGN1cnNvclBvc2l0aW9uID0gQGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgIW1hcmtlci5nZXRCdWZmZXJSYW5nZSgpLmNvbnRhaW5zUG9pbnQoY3Vyc29yUG9zaXRpb24pXG5cbiAgdGFnU2hvdWxkQmVJZ25vcmVkOiAtPlxuICAgIGF0b20uY29uZmlnLmdldCgnZG91YmxlLXRhZy5pZ25vcmVkVGFncycpPy5pbmRleE9mKEB0YWdUZXh0KSA+PSAwXG5cbiAgdGFnSXNDb21wbGV0ZTogLT5cbiAgICB0YWdJc0NvbXBsZXRlID0gZmFsc2VcbiAgICBzY2FuUmFuZ2UgPSBuZXcgUmFuZ2UoQGJhY2tPZlN0YXJ0VGFnLCBAZWRpdG9yLmJ1ZmZlci5nZXRFbmRQb3NpdGlvbigpKVxuICAgIG5leHRDaGFyYWN0ZXIgPSBAZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKHNjYW5SYW5nZSk/WzBdXG4gICAgcmV0dXJuIHRydWUgaWYgbmV4dENoYXJhY3RlciA9PSAnPidcbiAgICByZWdleCA9IG5ldyBSZWdFeHAoJzxbXj8lXXxbXj8lL10+JywgJ2knKVxuICAgIEBlZGl0b3IuYnVmZmVyLnNjYW5JblJhbmdlIHJlZ2V4LCBzY2FuUmFuZ2UsIChvYmopIC0+XG4gICAgICB0YWdJc0NvbXBsZXRlID0gKC8+JC8pLnRlc3Qob2JqLm1hdGNoVGV4dClcbiAgICB0YWdJc0NvbXBsZXRlXG5cbiAgZ2V0U2NvcGVzID0gKGN1cnNvcikgLT5cbiAgICBzY29wZURlc2NyaXB0b3IgPSBjdXJzb3I/LmdldFNjb3BlRGVzY3JpcHRvcigpXG4gICAgcmV0dXJuIHVubGVzcyBzY29wZURlc2NyaXB0b3JcbiAgICBzY29wZURlc2NyaXB0b3IuZ2V0U2NvcGVzQXJyYXkoKVxuIl19
