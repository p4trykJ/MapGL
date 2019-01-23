// Imports

// MAP
// Map - instance
mapboxgl.accessToken = 'pk.eyJ1IjoicGplemllcnNraTI0IiwiYSI6ImNqbXJ6NW04dTI1d3kzcHBkM3djbGwwMGoifQ.UlrhKR6v9F7glTdNQXRL1g';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/pjezierski24/cjo3bh5q138xl2smpcvv05n7l',
  center: [16.887609339307232, 52.40536031499309],
  zoom: 9.80908506743856
});

// Map - options

let options = {
  showCompass: true,
  showZoom: true
};

// Map - features

let scale = new mapboxgl.ScaleControl({
  maxWidth: 200,
  unit: 'metric'
});


// Map - addFeature

map.addControl(new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  placeholder: "Czego szukasz?"
}), 'top-left');
map.addControl(scale);
map.addControl(new mapboxgl.NavigationControl(options), 'top-left');
map.addControl(new mapboxgl.GeolocateControl({
  positionOptions: {enableHighAccuracy: true},
  trackUserLocation: true
}), 'top-left');

let symbole = {
  "id": "symbole",
  "type": "symbol",
  "source": {
    "type": "geojson",
    "data": {
      "type": "FeatureCollection",
      "features": [{
        "type": "Feature",
        "properties": {
          "description": "<strong>Make it Mount Pleasant</strong><p><a href=\"http://www.mtpleasantdc.com/makeitmtpleasant\" target=\"_blank\" title=\"Opens in a new window\">Make it Mount Pleasant</a> is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>",
          "icon": "theatre"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [16.5, 52.5]
        }
      }, {
        "type": "Feature",
        "properties": {
          "description": "<strong>Mad Men Season Five Finale Watch Party</strong><p>Head to Lounge 201 (201 Massachusetts Avenue NE) Sunday for a <a href=\"http://madmens5finale.eventbrite.com/\" target=\"_blank\" title=\"Opens in a new window\">Mad Men Season Five Finale Watch Party</a>, complete with 60s costume contest, Mad Men trivia, and retro food and drink. 8:00-11:00 p.m. $10 general admission, $20 admission and two hour open bar.</p>",
          "icon": "theatre"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [16.2, 52.2]
        }
      }, {
        "type": "Feature",
        "properties": {
          "description": "<strong>Big Backyard Beach Bash and Wine Fest</strong><p>EatBar (2761 Washington Boulevard Arlington VA) is throwing a <a href=\"http://tallulaeatbar.ticketleap.com/2012beachblanket/\" target=\"_blank\" title=\"Opens in a new window\">Big Backyard Beach Bash and Wine Fest</a> on Saturday, serving up conch fritters, fish tacos and crab sliders, and Red Apron hot dogs. 12:00-3:00 p.m. $25.grill hot dogs.</p>",
          "icon": "bar"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [16.3, 52.3]
        }
      }, {
        "type": "Feature",
        "properties": {
          "description": "<strong>Ballston Arts & Crafts Market</strong><p>The <a href=\"http://ballstonarts-craftsmarket.blogspot.com/\" target=\"_blank\" title=\"Opens in a new window\">Ballston Arts & Crafts Market</a> sets up shop next to the Ballston metro this Saturday for the first of five dates this summer. Nearly 35 artists and crafters will be on hand selling their wares. 10:00-4:00 p.m.</p>",
          "icon": "art-gallery"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [16.4, 52.4]
        }
      }, {
        "type": "Feature",
        "properties": {
          "description": "<strong>Seersucker Bike Ride and Social</strong><p>Feeling dandy? Get fancy, grab your bike, and take part in this year's <a href=\"http://dandiesandquaintrelles.com/2012/04/the-seersucker-social-is-set-for-june-9th-save-the-date-and-start-planning-your-look/\" target=\"_blank\" title=\"Opens in a new window\">Seersucker Social</a> bike ride from Dandies and Quaintrelles. After the ride enjoy a lawn party at Hillwood with jazz, cocktails, paper hat-making, and more. 11:00-7:00 p.m.</p>",
          "icon": "bicycle"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [16.9, 52.9]
        }
      }, {
        "type": "Feature",
        "properties": {
          "description": "<strong>Capital Pride Parade</strong><p>The annual <a href=\"http://www.capitalpride.org/parade\" target=\"_blank\" title=\"Opens in a new window\">Capital Pride Parade</a> makes its way through Dupont this Saturday. 4:30 p.m. Free.</p>",
          "icon": "star"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [16.7, 52.7]
        }
      }, {
        "type": "Feature",
        "properties": {
          "description": "<strong>Muhsinah</strong><p>Jazz-influenced hip hop artist <a href=\"http://www.muhsinah.com\" target=\"_blank\" title=\"Opens in a new window\">Muhsinah</a> plays the <a href=\"http://www.blackcatdc.com\">Black Cat</a> (1811 14th Street NW) tonight with <a href=\"http://www.exitclov.com\" target=\"_blank\" title=\"Opens in a new window\">Exit Clov</a> and <a href=\"http://godsilla.bandcamp.com\" target=\"_blank\" title=\"Opens in a new window\">Gods’illa</a>. 9:00 p.m. $12.</p>",
          "icon": "music"
        }
      }]
    }
  },
  "layout": {
    "icon-image": "{icon}-15",
    "icon-allow-overlap": true
  }
}

// Map - functions

// Map - change style

$(document).ready(changeBaseMap = function () {
  let layerList = $("#layerOptions").children().filter(".basemap__option")
  let lastOption = $("#layerOptions").children().filter(".basemap__option--last")[0]
  layerList.push(lastOption)
  for(let i = 0; i < layerList.length; i++) {
    layerList[i].onclick = function () {
      map.setStyle('mapbox://styles/mapbox/' + layerList[i].id + '-v9', {diff: false})
    }
  }
})

map.on("style.load", function () {
  map.addSource('dem', {
    "type": "raster-dem",
    "url": "mapbox://mapbox.terrain-rgb"
  });
  map.addSource('10m-bathymetry-81bsvj', {
    type: 'vector',
    url: 'mapbox://mapbox.9tm8dx88'
  });

  if(map.getLayer("symbole") === undefined) {
    map.addLayer(symbole)
  }
  else {
    map.addLayer(symbole)
    map.removeLayer("sybmole")
  }
})


map.on('load', function () {



  // Map - addLayer
  //Map - popout
  map.on('click', 'Flickr', function (e) {
    new mapboxgl.Popup().setLngLat(e.lngLat).setHTML(e.features[0].properties.jpt_nazwa_).addTo(map);
  });

  map.on('click', 'symbole', function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    map.flyTo({center: e.features[0].geometry.coordinates});
    var description = e.features[0].properties.description;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while(Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(description)
      .addTo(map);
  });

  // Change the cursor to a pointer when the mouse is over the states layer.
  map.on('mouseenter', 'states-layer', function () {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'states-layer', function () {
    map.getCanvas().style.cursor = '';
  });

});

// DATA

// Data - bookmarks
var bookmarks = [
  {
    name: "Zakładka1",
    center: {
      lat: 61.81490583215361,
      lng: 55.954416392710925
    }
  },
  {
    name: "Zakładka2",
    center: {
      lat: 61.81490583215361,
      lng: 55.954416392710925
    }
  },
  {
    name: "Zakładka3",
    center: {
      lat: 61.81490583215361,
      lng: 55.954416392710925
    }
  },
  {
    name: "Zakładka4",
    center: {
      lat: 61.81490583215361,
      lng: 55.954416392710925
    }
  }
]

$(document).ready(flyTo = function () {
  let selectBookmarks = $("#select")
  selectBookmarks[0].onchange = function () {
    let bookmarkData = $("#select").find(":selected").data().center
    map.flyTo({
      center: [
        bookmarkData.lng,
        bookmarkData.lat
      ]
    })
  }
})

$(document).ready(removeBookmark = function () {
  $("#bookmarks__button--remove")[0].onclick = function () {
    let removedBookmarkData = $("#select").find(":selected").data()
    for(let i = 0; i < bookmarks.length; i++) {
      if(bookmarks[i].name === removedBookmarkData.name) {
        $("#select").find(":selected").remove()
        $('#select').val("seleceted")
        bookmarks.splice(i, 1)
      }
    }
  }
})

$(document).ready(addBookmark = function () {
  $("#bookmarks__button--add")[0].onclick = function () {
    $('.modal').on('shown.bs.modal', function () {
      $(this).find('[autofocus]').focus();
    });
    $("#bookmarks__button--save")[0].onclick = function () {
      bookmark = {
        name: $("#bookmark-name").val(),
        center: map.getCenter()
      }
      bookmarks.push(bookmark)
      buildBookmarkSelect()
      $("#bookmark-name").val("")
      $('.modal').modal('hide')
    }
  }
})

$(document).ready(buildBookmarkSelect = function () {
  let select = $("#select")
  select.empty()
  let firstOption = "<option id='firstSelected' value='seleceted' disabled hidden selected>Zakładki</option>"
  select.append(firstOption)
  bookmarks.forEach(bookmark => {
    let option = document.createElement("OPTION");
    option.text = bookmark.name
    jQuery.data(option, bookmark)
    select.append(option);
  })
});

$(document).ready(toogleHillshade = function () {
  $("#hillshade__button")[0].onclick = function () {
    if(map.getLayer("hillshading") == undefined) {
      map.addLayer({
        "id": "hillshading",
        "source": "dem",
        "type": "hillshade"
      });
    }
    else {
      map.removeLayer("hillshading")
    }
  }
})

$(document).ready(toogleWatershade = function () {
  $("#watershade__button")[0].onclick = function () {
    if(map.getLayer("10m-bathymetry-81bsvj") == undefined) {
      map.addLayer({
        "id": "10m-bathymetry-81bsvj",
        "type": "fill",
        "source": "10m-bathymetry-81bsvj",
        "source-layer": "10m-bathymetry-81bsvj",
        "layout": {},
        "paint": {
          "fill-outline-color": "hsla(337, 82%, 62%, 0)",
          // cubic bezier is a four point curve for smooth and precise styling
          // adjust the points to change the rate and intensity of interpolation
          "fill-color": ["interpolate",
            ["cubic-bezier",
              0, 0.5,
              1, 0.5],
            ["get", "DEPTH"],
            200, "#78bced",
            9000, "#15659f"
          ]
        }
      }, 'barrier_line-land-polygon');
    }
    else {
      map.removeLayer("10m-bathymetry-81bsvj")
    }
  }
})




/*
$(document).ready(createSocialIcons = function() {
	let socialIconsParent = $('div.mapboxgl-control-container').children(".mapboxgl-ctrl-bottom-left");
	console.log("rodzic", socialIconsParent);
	let socialIcons = document.createElement("div");
	socialIcons.className = "socialIcons__wrapper";
	var html = `
		<a class="socialIcon__wrapper--github btn btn-social-icon btn-github">
			<span class="socialIcons__icon fab fa-github"></span>
		</a>
	`;
	console.log("przed", socialIcons)
	$('a.socialIcon__wrapper--github').html(html)
	console.log(html)
	console.log("po",socialIcons)
	let url = "https://github.com/p4trykJ";
	$(".socialIcon__wrapper--github").attr("href", url).attr("target", "_blank")[0].click();
	socialIconsParent.append(socialIcons)
})

*/





