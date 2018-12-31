// Imports

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
var bookmarks = [
	{
		name: "Zakładka1",
		center: [66.5, 12]
	},
	{
		name: "Zakładka2",
		center: [72.5, 12]
	},
	{
		name: "Zakładka3",
		center: [72.5, 12]
	},
	{
		name: "Zakładka4",
		center: [72.5, 12]
	}
]

$(document).ready(flyTo = function() {
	let selectBookmarks = $("#select")
		selectBookmarks[0].onchange = function() {
			let bookmarkData = $("#select").find(":selected").data("value")
			map.flyTo({
				center: [
					bookmarkData.center[0] + (Math.random() - 0.5) * 10,
					bookmarkData.center[1] + (Math.random() - 0.5) * 10]
			})
	}
})

$(document).ready(removeBookmark = function() {
	$("#group__button--remove")[0].onclick = function() {
		let removedBookmarkData = $("#select").find(":selected").data("value")
		for(let i = 0; i < bookmarks.length; i++) {
			if(bookmarks[i].name === removedBookmarkData.name) {
				$("#select").find(":selected").remove()
				bookmarks.splice(i, 1)
			}
		}
	}
})

$(document).ready(buildBookmarkSelect = function() {
	let firstOption = "<option id='firstSelected' disabled selected>Zakładki</option>"
	$("#select").append(firstOption) 
	bookmarks.forEach(bookmark => {
		let option = "<option label='" + bookmark.name + "' data-value='{" + '"' + "name" + '"' + ":" + '"' + bookmark.name + '"' + ' ,"' + "center" +'"'+ ":[" + bookmark.center + "]}'></option>"
		$("#select").append(option)
	})
})
