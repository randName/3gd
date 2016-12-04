var isDrawing, lines = {};
var selected = [];
var linecount = 0;
var curpt, curname = "";

$(document).ready(function(){
	window.h = 540/$('#geometryCanvas').height();
	window.w = 960/$('#geometryCanvas').width();
	$('canvas').mouseup(clickHandler);
	$('#newline').click(newLine);
	$('#delline').click(deleteSelected);
	/*
	$('#linesel').select2({
		allowClear: true,
		placeholder: '  Line name...',
		tags: true
	}).on('change',nameChange);;
	*/
});

function nameChange(e) {
	console.log($(e.target).val());	
}

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
		$.each( lines, function(k,v) {
			var l = v.data, d = Math.hypot(v.x1-x,v.y1-y) + Math.hypot(v.x2-x,v.y2-y);
			if ( Math.abs(x-l.x) <= l.w/2 && Math.abs(y-l.y) <= l.h/2 && d <= l.l*1.005 ) {
				clickLine(k);
				return false;
			}
		});
	}
}

function newLine() {
	curname = 'line' + linecount;
	linecount++;
	showAlert('info','Please indicate the start and end of the line.');
	isDrawing = true;
	curpt = null;
	/*
	if ( $('#linesel').val().length == 1 ) {
		curname = $('#linesel').val()[0];
		if (curname in lines){
			$('#namegroup').addClass('has-error');
			showAlert('warning','<strong>Error:</strong> This name is already taken.');
		} else {
			
		}
	} else {
		$('#namegroup').addClass('has-error');
		showAlert('warning','<strong>Error:</strong> Please give your line a name.');
	}
	*/
}

function clickLine(line) {
	var idx = $.inArray( line, selected ), v;
	if ( idx == -1 ) {
		selected.push(line);
	} else {
		selected.splice(idx,1);
	}
	$('canvas').setLayer(line, {visible: ( idx != -1 )}).drawLayers();
}

function deleteSelected() {
	console.log(selected);
	$.each( selected, deleteLine );
	selected = [];
}

function deleteLine(i,line) {
	$('canvas').removeLayerGroup(line);
	$('canvas').drawLayers();
	delete lines[line];
}

function linePoint(x,y) {
	if ( !curpt ) {
		curpt = { x1: x , y1: y, name: curname };
		toggleMarker(curpt);
	} else {
		toggleMarker(false);
		curpt.x2 = x; curpt.y2 = y;
		drawLine(curpt);
		isDrawing = false;
	}
}

function drawLine(line) {
	line.data = {
		x: (line.x1+line.x2)/2,
		y: (line.y1+line.y2)/2,
		w: Math.abs(line.x1-line.x2),
		h: Math.abs(line.y1-line.y2),
	};
	line.data.l = Math.hypot(line.data.w,line.data.h);
	lines[line.name] = JSON.parse(JSON.stringify(line));
	
	var newline = new Option(line.name, line.name, true, true);
	setTimeout(function(){$("#status").attr({style:'display:none'});}, 1000);
	showAlert('success', '<strong>Success!</strong> Added new line.');
	//$('#linensel').append(newline).val(null).trigger('change');
	
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
	line.strokeStyle = "#000";
	line.strokeWidth = 3;
	$('canvas').drawLine(line);
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
