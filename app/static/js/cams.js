$(document).ready(function(){
	fillCams();
	$('.grid').isotope({
		itemSelector: '.grid-item',
		layoutMode: 'masonry',
		masonry: {
			columnWidth: '.grid-item',
			gutter: 5
		}
	});
});

function fillCams() {
	$.each( [1,2,3,4,5,6,7,8,9,10,11,12], function(i,v) {
		var item = $('<a class="grid-item"/>').attr({href:"/cam/"+i});
		var img = $('<img/>').attr({src: "/static/images/no_signal.png"});
		var cap = $('<div class="caption"/>').text("Camera "+v);
		$('<div class="thumbnail"/>').append(img).append(cap).appendTo(item);
		$('.grid').append(item);
	});
}
