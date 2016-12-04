var isDrawing, lines = [];
var curpt, curname = "";

$(document).ready(function(){
	$('canvas').mouseup(clickHandler);
	$('#linename').keyup(clearError);
	$('#newline').click(newLine);
	window.h = 540/$('#geometryCanvas').height();
	window.w = 960/$('#geometryCanvas').width();
});

function clearError() {
	$('#namegroup').removeClass('has-error');
	$('#status').attr({style:'display:none'});
}

function showAlert( style, message ){
	$('#status').html(message).attr({style:'','class':'alert alert-'+style});
}

function clickHandler(e){
	var x = e.offsetX*window.h, y = e.offsetY*window.w;
	if ( isDrawing ) {
		linePoint(x,y);
	} else {
		$.each( lines, function(i,v) {
			var l = v.data;
			var d = Math.hypot(v.x1-x,v.y1-y) + Math.hypot(v.x2-x,v.y2-y);
			if ( Math.abs(x-l.x) <= l.w/2 && Math.abs(y-l.y) <= l.h/2 && d < l.l*1.005 ) {
				clickLine(v.name);
				return false;
			}
		});
	}
}

function newLine() {
	curname = $('#linename').val();
	if ( curname == "" ) {
		$('#namegroup').addClass('has-error');
		showAlert('warning','<strong>Error:</strong> Please give your line a name.');
	} else {
		isDrawing = true;
		curpt = null;
	}
}

function linePoint(x,y) {
	if ( !curpt ) {
		curpt = { x1: x , y1: y, name: curname };
		toggleMarker(curpt);
	} else {
		toggleMarker(false);
		curpt.x2 = x; curpt.y2 = y;
		drawLine(curpt);
	}
}

function drawLine(line) {
	$('#linename').val("");
	isDrawing = false;
	lines.push(line);
	setTimeout(function(){$("#status").attr({style:'display:none'});}, 1000);
	showAlert('success', '<strong>Success!</strong> Added line '+line.name);
	
	line.layer = true;
	line.groups = [line.name, 'line'];
	delete line.name;
	line.rounded = true;
	line.strokeStyle = "#FFF";
	line.strokeWidth = 6;
	$('canvas').drawLine(line);
	line.strokeStyle = "#F00";
	line.strokeWidth = 3;
	$('canvas').drawLine(line);
	line.name = line.groups[0];
	line.data = {
		x: (line.x1+line.x2)/2,
		y: (line.y1+line.y2)/2,
		w: Math.abs(line.x1-line.x2),
		h: Math.abs(line.y1-line.y2),
	};
	line.data.l = Math.hypot(line.data.w,line.data.h);
	line.strokeStyle = "#000";
	line.strokeWidth = 3;
	$('canvas').drawLine(line);
}

function clickLine(line) {
	var v = $('canvas').getLayer(line).visible;
	$('canvas').setLayer(line, {visible: !v}).drawLayers();
}

function toggleMarker(pt) {
	if ( pt ) {
		$('canvas').drawEllipse({
			layer: true,
			name: 'startcircle',
			strokeStyle: '#FFF',
			strokeWidth: 3,
			fillStyle: '#000',
			x: pt.x1, y: pt.y1,
			width: 10, height: 10
		});
	} else {
		$('canvas').removeLayer('startcircle').drawLayers();
	}
}
