(function() {
  var CompositeDisposable, DoubleTag;

  CompositeDisposable = require('atom').CompositeDisposable;

  DoubleTag = require('./double-tag');

  module.exports = {
    subscriptions: null,
    config: {
      enabledScopes: {
        description: 'Language scopes that are active',
        type: 'array',
        "default": ['text.html', 'text.html.basic', 'text.xml', 'text.marko', 'source.js.jsx', 'source.tsx', 'text.html.erb', 'text.html.php', 'text.html.php.blade']
      },
      ignoredTags: {
        description: 'These HTML tags will be skipped',
        type: 'array',
        "default": ['area', 'base', 'body', 'br', 'col', 'command', 'embed', 'head', 'hr', 'html', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'title', 'track', 'wbr']
      },
      allowEndTagSync: {
        description: 'Editing the end tag will change the start tag',
        type: 'boolean',
        "default": false
      }
    },
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.workspace.observeTextEditors(function(editor) {
        var doubleTag, editorScope, scopeEnabled;
        editorScope = typeof editor.getRootScopeDescriptor === "function" ? editor.getRootScopeDescriptor().getScopesArray() : void 0;
        if (!(editorScope != null ? editorScope.length : void 0)) {
          return;
        }
        scopeEnabled = atom.config.get('double-tag.enabledScopes').includes(editorScope[0]);
        if (!scopeEnabled) {
          return;
        }
        doubleTag = new DoubleTag(editor);
        return editor.onDidDestroy(function() {
          return doubleTag != null ? doubleTag.destroy() : void 0;
        });
      }));
    },
    deactivate: function() {
      var ref;
      return (ref = this.subscriptions) != null ? ref.dispose() : void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdHVua2VydC8uYXRvbS9wYWNrYWdlcy9kb3VibGUtdGFnL2xpYi9tYWluLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVI7O0VBRVosTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLGFBQUEsRUFBZSxJQUFmO0lBQ0EsTUFBQSxFQUNFO01BQUEsYUFBQSxFQUNFO1FBQUEsV0FBQSxFQUFhLGlDQUFiO1FBQ0EsSUFBQSxFQUFNLE9BRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBQ1AsV0FETyxFQUNNLGlCQUROLEVBQ3lCLFVBRHpCLEVBQ3FDLFlBRHJDLEVBRVAsZUFGTyxFQUVVLFlBRlYsRUFFd0IsZUFGeEIsRUFFeUMsZUFGekMsRUFHUCxxQkFITyxDQUZUO09BREY7TUFRQSxXQUFBLEVBQ0U7UUFBQSxXQUFBLEVBQWEsaUNBQWI7UUFDQSxJQUFBLEVBQU0sT0FETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FDUCxNQURPLEVBQ0MsTUFERCxFQUNTLE1BRFQsRUFDaUIsSUFEakIsRUFDdUIsS0FEdkIsRUFDOEIsU0FEOUIsRUFDeUMsT0FEekMsRUFDa0QsTUFEbEQsRUFDMEQsSUFEMUQsRUFFUCxNQUZPLEVBRUMsS0FGRCxFQUVRLE9BRlIsRUFFaUIsUUFGakIsRUFFMkIsTUFGM0IsRUFFbUMsTUFGbkMsRUFFMkMsT0FGM0MsRUFFb0QsUUFGcEQsRUFHUCxPQUhPLEVBR0UsT0FIRixFQUdXLEtBSFgsQ0FGVDtPQVRGO01BZ0JBLGVBQUEsRUFDRTtRQUFBLFdBQUEsRUFBYSwrQ0FBYjtRQUNBLElBQUEsRUFBTSxTQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUZUO09BakJGO0tBRkY7SUF1QkEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUNSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7YUFFckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsU0FBQyxNQUFEO0FBQ25ELFlBQUE7UUFBQSxXQUFBLHlEQUFjLE1BQU0sQ0FBQyx3QkFBeUIsQ0FBQyxjQUFqQyxDQUFBO1FBQ2QsSUFBQSx3QkFBYyxXQUFXLENBQUUsZ0JBQTNCO0FBQUEsaUJBQUE7O1FBRUEsWUFBQSxHQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEIsQ0FBMkMsQ0FBQyxRQUE1QyxDQUFxRCxXQUFZLENBQUEsQ0FBQSxDQUFqRTtRQUNGLElBQUEsQ0FBYyxZQUFkO0FBQUEsaUJBQUE7O1FBRUEsU0FBQSxHQUFZLElBQUksU0FBSixDQUFjLE1BQWQ7ZUFDWixNQUFNLENBQUMsWUFBUCxDQUFvQixTQUFBO3FDQUFHLFNBQVMsQ0FBRSxPQUFYLENBQUE7UUFBSCxDQUFwQjtNQVRtRCxDQUFsQyxDQUFuQjtJQUhRLENBdkJWO0lBcUNBLFVBQUEsRUFBWSxTQUFBO0FBQUcsVUFBQTtxREFBYyxDQUFFLE9BQWhCLENBQUE7SUFBSCxDQXJDWjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5Eb3VibGVUYWcgPSByZXF1aXJlICcuL2RvdWJsZS10YWcnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgc3Vic2NyaXB0aW9uczogbnVsbFxuICBjb25maWc6XG4gICAgZW5hYmxlZFNjb3BlczpcbiAgICAgIGRlc2NyaXB0aW9uOiAnTGFuZ3VhZ2Ugc2NvcGVzIHRoYXQgYXJlIGFjdGl2ZSdcbiAgICAgIHR5cGU6ICdhcnJheSdcbiAgICAgIGRlZmF1bHQ6IFtcbiAgICAgICAgJ3RleHQuaHRtbCcsICd0ZXh0Lmh0bWwuYmFzaWMnLCAndGV4dC54bWwnLCAndGV4dC5tYXJrbycsXG4gICAgICAgICdzb3VyY2UuanMuanN4JywgJ3NvdXJjZS50c3gnLCAndGV4dC5odG1sLmVyYicsICd0ZXh0Lmh0bWwucGhwJyxcbiAgICAgICAgJ3RleHQuaHRtbC5waHAuYmxhZGUnXG4gICAgICBdXG4gICAgaWdub3JlZFRhZ3M6XG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZXNlIEhUTUwgdGFncyB3aWxsIGJlIHNraXBwZWQnXG4gICAgICB0eXBlOiAnYXJyYXknXG4gICAgICBkZWZhdWx0OiBbXG4gICAgICAgICdhcmVhJywgJ2Jhc2UnLCAnYm9keScsICdicicsICdjb2wnLCAnY29tbWFuZCcsICdlbWJlZCcsICdoZWFkJywgJ2hyJyxcbiAgICAgICAgJ2h0bWwnLCAnaW1nJywgJ2lucHV0JywgJ2tleWdlbicsICdsaW5rJywgJ21ldGEnLCAncGFyYW0nLCAnc291cmNlJyxcbiAgICAgICAgJ3RpdGxlJywgJ3RyYWNrJywgJ3dicidcbiAgICAgIF1cbiAgICBhbGxvd0VuZFRhZ1N5bmM6XG4gICAgICBkZXNjcmlwdGlvbjogJ0VkaXRpbmcgdGhlIGVuZCB0YWcgd2lsbCBjaGFuZ2UgdGhlIHN0YXJ0IHRhZydcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGVkaXRvcikgLT5cbiAgICAgIGVkaXRvclNjb3BlID0gZWRpdG9yLmdldFJvb3RTY29wZURlc2NyaXB0b3I/KCkuZ2V0U2NvcGVzQXJyYXkoKVxuICAgICAgcmV0dXJuIHVubGVzcyBlZGl0b3JTY29wZT8ubGVuZ3RoXG5cbiAgICAgIHNjb3BlRW5hYmxlZCA9XG4gICAgICAgIGF0b20uY29uZmlnLmdldCgnZG91YmxlLXRhZy5lbmFibGVkU2NvcGVzJykuaW5jbHVkZXMoZWRpdG9yU2NvcGVbMF0pXG4gICAgICByZXR1cm4gdW5sZXNzIHNjb3BlRW5hYmxlZFxuXG4gICAgICBkb3VibGVUYWcgPSBuZXcgRG91YmxlVGFnKGVkaXRvcilcbiAgICAgIGVkaXRvci5vbkRpZERlc3Ryb3kgLT4gZG91YmxlVGFnPy5kZXN0cm95KClcblxuICBkZWFjdGl2YXRlOiAtPiBAc3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG4iXX0=
