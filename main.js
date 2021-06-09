// Imports

// MAP
// Map - instance
mapboxgl.accessToken =
  "pk.eyJ1IjoicGplemllcnNraTI0IiwiYSI6ImNqbXJ6NW04dTI1d3kzcHBkM3djbGwwMGoifQ.UlrhKR6v9F7glTdNQXRL1g";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/basic-v9",
  center: [0, 0],
  zoom: 0.933690634494243,
});

// Map - options

const options = {
  showCompass: true,
  showZoom: true,
};

// Map - features

const scale = new mapboxgl.ScaleControl({
  maxWidth: 200,
  unit: "metric",
});

// Map - addFeature

map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    placeholder: "Search",
  }),
  "top-left"
);
map.addControl(scale);

map.addControl(new mapboxgl.NavigationControl(options), "top-left");

map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true,
  }),
  "top-left"
);

// Map - functions

// Map - change style

$(document).ready(
  (changeBaseMap = function () {
    const layerList = $("#layerOptions").children().filter(".basemap__option");
    const lastOption = $("#layerOptions")
      .children()
      .filter(".basemap__option--last")[0];
    layerList.push(lastOption);
    for (let i = 0; i < layerList.length; i++) {
      layerList[i].onclick = function () {
        map.setStyle("mapbox://styles/mapbox/" + layerList[i].id + "-v9", {
          diff: false,
        });
      };
    }
  })
);

loadSources = function () {
  map.addSource("dem", {
    type: "raster-dem",
    url: "mapbox://mapbox.terrain-rgb",
  });

  map.addSource("10m-bathymetry-81bsvj", {
    type: "vector",
    url: "mapbox://mapbox.9tm8dx88",
  });

  map.addSource("crashes", {
    type: "geojson",
    data: "https://divi.io/api/features/NDUx.7Axfr_pmJUMuy1xH7UqKfBfZu08",
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  });
};

addCrashes = function () {
  if (
    map.getStyle().name == "Bright" ||
    map.getStyle().name == "Mapbox Light"
  ) {
    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "crashes",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#fc9272",
          20,
          "#fb6a4a",
          100,
          "#ef3b2c",
          750,
          "#cb181d",
        ],
        "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
      },
    });
    map.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "crashes",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "#cb181d",
        "circle-radius": 4,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#cb181d",
      },
    });
  } else {
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
          "#525252",
        ],
        "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
      },
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
        "circle-stroke-color": "#636363",
      },
    });
  }

  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "crashes",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
  });
};

map.on("style.load", function () {
  loadSources();
  addCrashes();
});

map.on("load", function () {
  $(".loader__wrapper")[0].style.display = "none";
  map.on("click", "clusters", function (e) {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["clusters"],
    });
    const clusterId = features[0].properties.cluster_id;
    map
      .getSource("crashes")
      .getClusterExpansionZoom(clusterId, function (err, zoom) {
        if (err) return;

        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom,
        });
      });
  });

  map.on("click", "unclustered-point", function (e) {
    const coordinates = e.features[0].geometry.coordinates.slice();
    e.features.forEach((feature, index) => {
      for (let poperty in feature.properties) {
        if (feature.properties[poperty] == "null")
          feature.properties[poperty] = "no data";
      }
      const html = `<div class="popup__counter">
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
                  </ul>`;
      new mapboxgl.Popup().setLngLat(coordinates).setHTML(html).addTo(map);
    });
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
  });

  map.on("mouseenter", "unclustered-point", function () {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", "unclustered-point", function () {
    map.getCanvas().style.cursor = "";
  });

  map.on("mouseenter", "clusters", function () {
    map.getCanvas().style.cursor = "zoom-in";
  });
  map.on("mouseleave", "clusters", function () {
    map.getCanvas().style.cursor = "";
  });
});

// DATA

// Data - bookmarks
const bookmarks = [
  {
    name: "New York, US",
    center: {
      lat: 40.87352503538958,
      lng: -73.79312415240315,
    },
    zoom: 8,
  },
  {
    name: "Warsaw, Poland",
    center: {
      lat: 52.235599300392096,
      lng: 21.010378897190094,
    },
    zoom: 8,
  },
  {
    name: "Rio Grande, Argentina",
    center: {
      lat: -53.76456066769579,
      lng: -67.74444402065035,
    },
    zoom: 10,
  },
  {
    name: "Tokyo, Japan",
    center: {
      lat: 35.68335197721953,
      lng: 139.7570453434081,
    },
    zoom: 10,
  },
];

$(document).ready(
  (flyTo = function () {
    const selectBookmarks = $("#select");
    selectBookmarks[0].onchange = function () {
      const bookmarkData = $("#select").find(":selected").data();
      map.flyTo({
        center: [bookmarkData.center.lng, bookmarkData.center.lat],
        zoom: bookmarkData.zoom,
      });
      // $("#firstSelected").prop('selected', true);
    };
  })
);

$(document).ready(
  (removeBookmark = function () {
    $("#bookmarks__button--remove")[0].onclick = function () {
      const removedBookmarkData = $("#select").find(":selected").data();
      for (let i = 0; i < bookmarks.length; i++) {
        if (bookmarks[i].name === removedBookmarkData.name) {
          $("#select").find(":selected").remove();
          $("#select").val("seleceted");
          bookmarks.splice(i, 1);
        }
      }
    };
  })
);

$(document).ready(
  (addBookmark = function () {
    $("#bookmarks__button--add")[0].onclick = function () {
      $(".modal").on("shown.bs.modal", function () {
        $(this).find("[autofocus]").focus();
      });
      $("#bookmarks__button--save")[0].onclick = function () {
        bookmark = {
          name: $("#bookmark-name").val(),
          center: map.getCenter(),
          zoom: map.getZoom(),
        };
        bookmarks.push(bookmark);
        buildBookmarkSelect();
        $("#bookmark-name").val("");
        $(".modal").modal("hide");
      };
    };
  })
);

$(document).ready(
  (buildBookmarkSelect = function () {
    const select = $("#select");
    select.empty();
    const firstOption =
      "<option id='firstSelected' value='seleceted' disabled hidden selected>Bookmarks</option>";
    select.append(firstOption);
    bookmarks.forEach((bookmark) => {
      const option = document.createElement("OPTION");
      option.text = bookmark.name;
      jQuery.data(option, bookmark);
      select.append(option);
    });
  })
);

$(document).ready(
  (toggleHillshade = function () {
    $("#hillshade__button")[0].onclick = function () {
      if (map.getLayer("hillshading") == undefined) {
        map.addLayer({
          id: "hillshading",
          source: "dem",
          type: "hillshade",
        });
      } else {
        map.removeLayer("hillshading");
      }
    };
  })
);

$(document).ready(
  (toggleGrid = function () {
    $("#hillshade__button")[0].onclick = function () {
      if (map.getLayer("hillshading") == undefined) {
        map.addLayer({
          id: "hillshading",
          source: "dem",
          type: "hillshade",
        });
      } else {
        map.removeLayer("hillshading");
      }
    };
  })
);

{
  document.addEventListener("DOMContentLoaded", function () {
    function zoomTo(data) {
      map.flyTo({
        center: [
          data.data.geometry.coordinates[0],
          data.data.geometry.coordinates[1],
        ],
        zoom: 17,
      });
    }

    const gridDiv = document.querySelector("#myGrid");

    const gridOptions = {
      enableColResize: "true",
      enableSorting: "true",
      enableFilter: "true",
      onRowDoubleClicked: zoomTo,
      columnDefs: [
        { headerName: "ID", field: "properties.id", sort: "asc" },
        { headerName: "Date", field: "properties.date" },
        { headerName: "Aboard", field: "properties.aboard" },
        { headerName: "Fatalities", field: "properties.fatalities" },
        { headerName: "Operator", field: "properties.operator" },
        { headerName: "Route", field: "properties.route" },
        { headerName: "Location", field: "properties.location" },
        { headerName: "Type", field: "properties.type" },
        { headerName: "Flight", field: "properties.flight" },
        { headerName: "Summary", field: "properties.summary" },
      ],
    };
    new agGrid.Grid(gridDiv, gridOptions);

    fetch("https://divi.io/api/features/NDUx.7Axfr_pmJUMuy1xH7UqKfBfZu08")
      .then((resp) =>
        resp.json().then(function (data) {
          gridOptions.api.setRowData(data.features);
        })
      )
      .catch(function (error) {
        alert("Failed to fetch data");
      });
  });
}
