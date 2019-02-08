// Imports

// MAP
// Map - instance
mapboxgl.accessToken = 'pk.eyJ1Ijoic3BpZGVyaGFybmFzIiwiYSI6ImNqbmN2aHlxcjBvYzkzcHBrbzVhcnE1d2YifQ.ekC72cbJYJKTvQFRDJjfEw';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/spiderharnas/cjrwamwzc26ce1fqinwxis1mi',
  center: [0, 20],
  zoom: 1.3
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

loadSources = function () {
  map.addSource('dem', {
    "type": "raster-dem",
    "url": "mapbox://mapbox.terrain-rgb"
  });

  map.addSource('10m-bathymetry-81bsvj', {
    type: 'vector',
    url: 'mapbox://mapbox.9tm8dx88'
  });

  map.addSource("crashes", {
    type: "geojson",
    // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
    // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
    data: 'https://divi.io/api/features/NDMx.j-b6eeBbyTAnH06LmbJXveYBHcA',
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
  });

}

addCrashes = function () {
  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "crashes",
    filter: ["has", "point_count"],
    paint: {
      // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
      // with three steps to implement three types of circles:
      //   * Blue, 20px circles when point count is less than 100
      //   * Yellow, 30px circles when point count is between 100 and 750
      //   * Pink, 40px circles when point count is greater than or equal to 750
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#51bbd6",
        100,
        "#f1f075",
        750,
        "#f28cb1"
      ],
      "circle-radius": [
        "step",
        ["get", "point_count"],
        20,
        100,
        30,
        750,
        40
      ]
    }
  });

  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "crashes",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12
    }
  });

  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "crashes",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#11b4da",
      "circle-radius": 4,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff"
    }
  });
}

map.on("style.load", function () {
  loadSources()
  addCrashes()
})

map.on('load', function () {

  map.on('click', 'clusters', function (e) {
    var features = map.queryRenderedFeatures(e.point, {layers: ['clusters']});
    var clusterId = features[0].properties.cluster_id;
    map.getSource('crashes').getClusterExpansionZoom(clusterId, function (err, zoom) {
      if(err)
        return;

      map.easeTo({
        center: features[0].geometry.coordinates,
        zoom: zoom
      });
    });
  });

  map.on('click', 'unclustered-point', function (e) {
    console.log()
    let coordinates = e.features[0].geometry.coordinates.slice();

    e.features.forEach((feature, index) => {

      console.log(feature)
      if(feature.properties.route == "null") {
        feature.properties.route = "no data"
      }

      let html = `<div class="popup__counter">
                  Accident in location:
                  ${e.features.length - index}/${e.features.length}
                  </div>
                  <ul class="popup__list">
                  <li class="popup__list--el">
                  Operator:
                  ${feature.properties.operator}
                  </li>
                  <li class="popup__list--el">
                  Date:
                  ${feature.properties.date}
                  </li>
                  <li class="popup__list--el">
                  Aboard:
                  ${feature.properties.aboard}
                  </li>
                  <li class="popup__list--el">
                  Fatalities:
                  ${feature.properties.fatalities}
                  </li>
                  <li class="popup__list--el">
                  Plane type:
                  ${feature.properties.type}
                  </li>
                  <li class="popup__list--el">
                  Route:
                  ${feature.properties.route}
                  </li>
                  <li class="popup__list--el">
                  Lokalizacja:
                  ${feature.properties.location}
                  </li>
                  </ul>`
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(html)
        .addTo(map);
    })

    // var coordinates = e.features[0].geometry.coordinates.slice();
    // var description = e.features[0].properties.type;
    // var coordinates1 = e.features[1].geometry.coordinates.slice();
    // var description1 = e.features[1].properties.type;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while(Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

  });

  map.on('mouseenter', 'unclustered-point', function () {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'unclustered-point', function () {
    map.getCanvas().style.cursor = '';
  });

  map.on('mouseenter', 'clusters', function () {
    map.getCanvas().style.cursor = 'zoom-in';
  });
  map.on('mouseleave', 'clusters', function () {
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





