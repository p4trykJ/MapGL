// Map

mapboxgl.accessToken = 'pk.eyJ1IjoicGplemllcnNraTI0IiwiYSI6ImNqbXJ6NW04dTI1d3kzcHBkM3djbGwwMGoifQ.UlrhKR6v9F7glTdNQXRL1g';
const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/pjezierski24/cjo3bh5q138xl2smpcvv05n7l',
	center: [16.887609339307232, 52.40536031499309],
	zoom: 9.80908506743856
});

var options = {
	showCompass: true,
	showZoom: true
};
var scale = new mapboxgl.ScaleControl({
	maxWidth: 200,
	unit: 'metric'
});

map.addControl(scale);
map.addControl(new mapboxgl.NavigationControl(options), 'top-right');

// Bookmarks

var Bookmarks = [
	{
		name: "Zakładka31",
		center: [66.5, 12]
	},
	{
		name: "Zakładka21",
		center: [72.5, 12]
	},
	{
		name: "Zakładka3",
		center: [72.5, 12]
	},
	{
		name: "Zakładka11",
		center: [72.5, 12]
	}
]

$(document).ready(function flyTo() {
	let selectBookmarks = $("#select")
	selectBookmarks[0].onchange = function() {
		let bookmarkData = $(this).find(":selected").data("value")
		map.flyTo({
			center: [
				bookmarkData.center[0] + (Math.random() - 0.5) * 10,
				bookmarkData.center[1] + (Math.random() - 0.5) * 10]
		})
	}
})

$(document).ready(function buildBookmarksList() {
	Bookmarks.forEach(bookmark => {
		let option = "<option label='" + bookmark.name + "' data-value='{" + '"' + "center" +'"'+ ":[" + bookmark.center + "]}'></option>"
		$("#select").append(option)
	})
})
