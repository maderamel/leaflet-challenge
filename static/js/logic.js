// Store API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request on url
d3.json(queryUrl).then(function(data) {
  // send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

// Function for features
function createFeatures(earthquakeData) {
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(
      `<h3>${feature.properties.mag}</h3><hr><p>${feature.properties.place}</p><hr><p>${feature.geometry.coordinates[2]}</p>`
    );
  }

  // Function for marker
  function circleMarker(feature, latlng) {
    let circle = {
      radius: feature.properties.mag * 5,
      color: chooseColor(feature),
      fillColor: chooseColor(feature),
      weight: 1,
      opacity: 1,
      fillOpacity: 0.5
    };
    return L.circleMarker(latlng, circle);
  }

  // Color of circles based on depth
  function chooseColor(feature) {
    let color = "#E2FFAE";
    switch (true) {
      case feature.geometry.coordinates[2] < 10:
        color = "#0071BC";
        break;
      case feature.geometry.coordinates[2] < 30:
        color = "#35BC00";
        break;
      case feature.geometry.coordinates[2] < 50:
        color = "#BCBC00";
        break;
      case feature.geometry.coordinates[2] < 70:
        color = "#BC0000";
        break;
    }
    return color;
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: circleMarker
  });

  // Create the tile layer that will be the background of our map.
  let streetMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": streetMap
  };

  // Create an overlay object
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [40.7, -94.5],
    zoom: 5,
    layers: [streetMap, earthquakes]
  });

// Create a legend control received help from tutor & LAs for this.
let legend = L.control({ position: "bottomright" });

// Define the legend content
legend.onAdd = function(map) {
  let div = L.DomUtil.create("div", "legend");
  let labels = [];
  let categories = ["<10", "10-30", "30-50", "50-70"];

  // Loop through the categories and generate labels with corresponding colors
  for (let i = 0; i < categories.length; i++) {
    div.innerHTML +=
      labels.push(
        '<i class="circle" style="background:' +
          chooseColor({ geometry: { coordinates: [0, 0, i * 20] } }) +
          '"></i> ' +
          categories[i]
      );
  }
  div.innerHTML = labels.join("<br>");
  return div;
};

// Add the legend to the map
legend.addTo(myMap);


  L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(myMap);
}

