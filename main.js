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
  placeholder: "Search"
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
    data: 'https://divi.io/api/features/NDMx.j-b6eeBbyTAnH06LmbJXveYBHcA',
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50
  });

}

addCrashes = function () {
  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "crashes",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": [

        "step",
        ["get", "point_count"],
        "#F2F2F2",
        20,
        "#cccccc",
        100,
        "#969696",
        750,
        "#525252"
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
      "circle-color": "#636363",
      "circle-radius": 4,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#636363"
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
    let coordinates = e.features[0].geometry.coordinates.slice();
    e.features.forEach((feature, index) => {
      for(let poperty in feature.properties) {
        if(feature.properties[poperty] == "null")
          feature.properties[poperty] = "no data"
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
                  Localization:
                  ${feature.properties.location}
                  </li>
                  </ul>`
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(html)
        .addTo(map);
    })
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
    name: "New York, US",
    center: {
      lat: 40.87352503538958,
      lng: -73.79312415240315
    },
    zoom: 8
  },
  {
    name: "Warsaw, Poland",
    center: {
      lat: 52.235599300392096,
      lng: 21.010378897190094
    },
    zoom: 8
  },
  {
    name: "Rio Grande, Argentina",
    center: {
      lat: -53.76456066769579,
      lng: -67.74444402065035
    },
    zoom: 10
  },
  {
    name: "Tokyo, Japan",
    center: {
      lat: 35.68335197721953,
      lng: 139.7570453434081
    },
    zoom: 10
  }
]

$(document).ready(flyTo = function () {
  let selectBookmarks = $("#select")
  selectBookmarks[0].onchange = function () {
    let bookmarkData = $("#select").find(":selected").data()
    map.flyTo({
      center: [
        bookmarkData.center.lng,
        bookmarkData.center.lat
      ],
      zoom: bookmarkData.zoom
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
        center: map.getCenter(),
        zoom: map.getZoom()
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
  let firstOption = "<option id='firstSelected' value='seleceted' disabled hidden selected>Bookmarks</option>"
  select.append(firstOption)
  bookmarks.forEach(bookmark => {
    let option = document.createElement("OPTION");
    option.text = bookmark.name
    jQuery.data(option, bookmark)
    select.append(option);
  })
});

$(document).ready(toggleHillshade = function () {
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

$(document).ready(toggleGrid = function () {
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


// $(document).ready(toggleWatershade = function () {
//   $("#watershade__button")[0].onclick = function () {
//     if(map.getLayer("10m-bathymetry-81bsvj") == undefined) {
//       map.addLayer({
//         "id": "10m-bathymetry-81bsvj",
//         "type": "fill",
//         "source": "10m-bathymetry-81bsvj",
//         "source-layer": "10m-bathymetry-81bsvj",
//         "layout": {},
//         "paint": {
//           "fill-outline-color": "hsla(337, 82%, 62%, 0)",
//           "fill-color": ["interpolate",
//             ["cubic-bezier",
//               0, 0.5,
//               1, 0.5],
//             ["get", "DEPTH"],
//             200, "#78bced",
//             9000, "#15659f"
//           ]
//         }
//       });
//     }
//     else {
//       map.removeLayer("10m-bathymetry-81bsvj")
//     }
//   }
// })

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



{
  document.addEventListener('DOMContentLoaded', function () {

    function zoomTo(data) {
      console.log(data)
      map.flyTo({
        center: [
          data.data.geometry.coordinates[0],
          data.data.geometry.coordinates[1]
        ],
        zoom: 10
      })
    }

    var gridDiv = document.querySelector('#myGrid');

    var gridOptions = {
      enableColResize: "true",
      enableSorting: "true",
      enableFilter: "true",
      onRowDoubleClicked: zoomTo,
      columnDefs: [
        {headerName: 'Date', field: 'properties.date'},
        {headerName: 'Aboard', field: 'properties.aboard'},
        {headerName: 'Fatalities', field: 'properties.fatalities'},
        {headerName: 'Operator', field: 'properties.operator'},
        {headerName: 'Route', field: 'properties.route'},
        {headerName: 'Location', field: 'properties.location'},
        {headerName: 'Type', field: 'properties.type'},
        {headerName: 'Flight', field: 'properties.flight'},
        {headerName: 'Summary', field: 'properties.summary'}
      ]
    };
    new agGrid.Grid(gridDiv, gridOptions);

    fetch("https://divi.io/api/features/NDMx.j-b6eeBbyTAnH06LmbJXveYBHcA")
      .then((resp) => resp.json()
        .then(function (data) {
          gridOptions.api.setRowData(data.features);
        }))
      .catch(function (error) {
        alert(error);
      });
  });


};




