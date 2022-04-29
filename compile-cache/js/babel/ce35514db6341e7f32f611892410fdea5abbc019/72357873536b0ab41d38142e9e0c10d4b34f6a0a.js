Object.defineProperty(exports, '__esModule', {
  value: true
});

var _atomTernjsHelper = require('../atom-ternjs-helper');

'use babel';

var index = 0;
var checkpoints = [];

function set(data) {

  checkpoints.length = 0;

  var editor = atom.workspace.getActiveTextEditor();
  var buffer = editor.getBuffer();
  var cursor = editor.getLastCursor();

  if (!cursor) {

    return false;
  }

  var marker = buffer.markPosition(cursor.getBufferPosition(), {});

  add(editor, marker);

  return true;
}

function append(editor, buffer, position) {

  var marker = buffer.markPosition(position, {});

  add(editor, marker);
}

function add(editor, marker) {

  index = checkpoints.push({

    marker: marker,
    editor: editor

  }) - 1;
}

function goTo(value) {

  var checkpoint = checkpoints[index + value];

  if (!checkpoint) {

    return;
  }

  index += value;

  (0, _atomTernjsHelper.openFileAndGoToPosition)(checkpoint.marker.getRange().start, checkpoint.editor.getURI());
}

function reset() {

  index = 0;
  checkpoints = [];
}

exports['default'] = {

  set: set,
  append: append,
  goTo: goTo,
  reset: reset
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3R1bmtlcnQvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL3NlcnZpY2VzL25hdmlnYXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztnQ0FJTyx1QkFBdUI7O0FBSjlCLFdBQVcsQ0FBQzs7QUFNWixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZCxJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7O0FBRXJCLFNBQVMsR0FBRyxDQUFDLElBQUksRUFBRTs7QUFFakIsYUFBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7O0FBRXZCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztBQUNwRCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDbEMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDOztBQUV0QyxNQUFJLENBQUMsTUFBTSxFQUFFOztBQUVYLFdBQU8sS0FBSyxDQUFDO0dBQ2Q7O0FBRUQsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQzs7QUFFbkUsS0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFcEIsU0FBTyxJQUFJLENBQUM7Q0FDYjs7QUFFRCxTQUFTLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTs7QUFFeEMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7O0FBRWpELEtBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7Q0FDckI7O0FBRUQsU0FBUyxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRTs7QUFFM0IsT0FBSyxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUM7O0FBRXZCLFVBQU0sRUFBRSxNQUFNO0FBQ2QsVUFBTSxFQUFFLE1BQU07O0dBRWYsQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUNSOztBQUVELFNBQVMsSUFBSSxDQUFDLEtBQUssRUFBRTs7QUFFbkIsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQzs7QUFFOUMsTUFBSSxDQUFDLFVBQVUsRUFBRTs7QUFFZixXQUFPO0dBQ1I7O0FBRUQsT0FBSyxJQUFJLEtBQUssQ0FBQzs7QUFFZixpREFBd0IsVUFBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0NBQ3pGOztBQUVELFNBQVMsS0FBSyxHQUFHOztBQUVmLE9BQUssR0FBRyxDQUFDLENBQUM7QUFDVixhQUFXLEdBQUcsRUFBRSxDQUFDO0NBQ2xCOztxQkFFYzs7QUFFYixLQUFHLEVBQUgsR0FBRztBQUNILFFBQU0sRUFBTixNQUFNO0FBQ04sTUFBSSxFQUFKLElBQUk7QUFDSixPQUFLLEVBQUwsS0FBSztDQUNOIiwiZmlsZSI6Ii9ob21lL3R1bmtlcnQvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL3NlcnZpY2VzL25hdmlnYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHtcbiAgb3BlbkZpbGVBbmRHb1RvUG9zaXRpb25cbn0gZnJvbSAnLi4vYXRvbS10ZXJuanMtaGVscGVyJztcblxubGV0IGluZGV4ID0gMDtcbmxldCBjaGVja3BvaW50cyA9IFtdO1xuXG5mdW5jdGlvbiBzZXQoZGF0YSkge1xuXG4gIGNoZWNrcG9pbnRzLmxlbmd0aCA9IDA7XG5cbiAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICBjb25zdCBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKCk7XG4gIGNvbnN0IGN1cnNvciA9IGVkaXRvci5nZXRMYXN0Q3Vyc29yKCk7XG5cbiAgaWYgKCFjdXJzb3IpIHtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IG1hcmtlciA9IGJ1ZmZlci5tYXJrUG9zaXRpb24oY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKCksIHt9KTtcblxuICBhZGQoZWRpdG9yLCBtYXJrZXIpO1xuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBhcHBlbmQoZWRpdG9yLCBidWZmZXIsIHBvc2l0aW9uKSB7XG5cbiAgY29uc3QgbWFya2VyID0gYnVmZmVyLm1hcmtQb3NpdGlvbihwb3NpdGlvbiwge30pO1xuXG4gIGFkZChlZGl0b3IsIG1hcmtlcik7XG59XG5cbmZ1bmN0aW9uIGFkZChlZGl0b3IsIG1hcmtlcikge1xuXG4gIGluZGV4ID0gY2hlY2twb2ludHMucHVzaCh7XG5cbiAgICBtYXJrZXI6IG1hcmtlcixcbiAgICBlZGl0b3I6IGVkaXRvclxuXG4gIH0pIC0gMTtcbn1cblxuZnVuY3Rpb24gZ29Ubyh2YWx1ZSkge1xuXG4gIGNvbnN0IGNoZWNrcG9pbnQgPSBjaGVja3BvaW50c1tpbmRleCArIHZhbHVlXTtcblxuICBpZiAoIWNoZWNrcG9pbnQpIHtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIGluZGV4ICs9IHZhbHVlO1xuXG4gIG9wZW5GaWxlQW5kR29Ub1Bvc2l0aW9uKGNoZWNrcG9pbnQubWFya2VyLmdldFJhbmdlKCkuc3RhcnQsIGNoZWNrcG9pbnQuZWRpdG9yLmdldFVSSSgpKTtcbn1cblxuZnVuY3Rpb24gcmVzZXQoKSB7XG5cbiAgaW5kZXggPSAwO1xuICBjaGVja3BvaW50cyA9IFtdO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgc2V0LFxuICBhcHBlbmQsXG4gIGdvVG8sXG4gIHJlc2V0XG59O1xuIl19