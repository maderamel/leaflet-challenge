// Store API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request on url
d3.json(queryUrl).then(function (data) { // send the data.features object to the createFeatures function.
    createFeatures(data.features);
});

// Function for features
function createFeatures(earthquakeData) { // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${
            feature.properties.mag
        }</h3><hr><p>${
            feature.properties.place
        }</p><hr><p>${
            feature.geometry.coordinates[2]
        }<p>`);
    }

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    let earthquakes = L.geoJSON(earthquakeData, {onEachFeature: onEachFeature});

    // Send our earthquakes layer to the createMap function/
    //createMap(earthquakes);


    // Create the tile layer that will be the background of our map.
    let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});

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

    L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);

}
