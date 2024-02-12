// Define the map
// creates a Leaflet map object (myMap) 
// sets its initial view to center at coordinates [0, 0] with a zoom level of 2
var myMap = L.map('map').setView([0, 0], 2);

// Add the base tile layer
// adds a base tile layer to the map. It uses tiles from OpenStreetMap (OSM) and specifies the URL pattern for fetching the tiles. 
// The attribution gives credit to OSM contributors
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Function to determine marker size based on magnitude
// takes  magnitude of  earthquake as input and returns the marker size based on magnitude
function getMarkerSize(magnitude) {
    return magnitude * 5;
}

// Function to determine marker color based on depth
// takes  depth of an earthquake as input and returns  marker color based on depth ranges
function getMarkerColor(depth) {
    if (depth >= -10 && depth <= 10) {
        // (#00ff00) = Green for shallow earthquakes
        return '#00ff00';
    } else if (depth > 10 && depth <= 30) {
        // (#80ff00) = Light green for shallow-medium earthquakes
        return '#80ff00';
    } else if (depth > 30 && depth <= 50) {
        // (#ffff00) = Yellow for medium earthquakes
        return '#ffff00';
    } else if (depth > 50 && depth <= 70) {
        // (#ffbf00) = Orange for medium-deep earthquakes
        return '#ffbf00'; 
    } else if (depth > 70 && depth <= 90) {
        // (#ff8000) = Dark orange for deep earthquakes
        return '#ff8000'; 
    } else {
        // (#ff0000) = Red for very deep earthquakes
        return '#ff0000';
    }
}

// Function to create marker style
// takes a GeoJSON feature representing an earthquake as input and returns an object 
// It uses (getMarkerSize) and (getMarkerColor)
function createMarkerStyle(feature) {
    return {
        radius: getMarkerSize(feature.properties.mag),
        fillColor: getMarkerColor(feature.geometry.coordinates[2]),
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
}

// Function to bind popup content
// binds a popup to each marker layer.
// displays information about the earthquake, including its title, magnitude, and depth
function bindPopupContent(feature, layer) {
    layer.bindPopup(`<b>${feature.properties.title}</b><br>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]} km`);
}

// Function to create legend
// creates a legend control and adds it to the map.
function createLegend() {
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend');
        var depths = [-10, 10, 30, 50, 70, 90]; // Define the depth ranges
        var colors = ['#00ff00', '#80ff00', '#ffff00', '#ffbf00', '#ff8000', '#ff0000']; // Corresponding colors for each range

        div.innerHTML += '<b>Depth Legend</b><br>';

        for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + (depths[i + 1] - 1) + ' km<br>' : '+ km');
        }

        return div;
    };

    legend.addTo(myMap);
}

// Load and visualize earthquake data
// fetches earthquake data from the specified URL using D3.js
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(function (data) {
    // creates a Leaflet GeoJSON layer to visualize the earthquakes on the map
    L.geoJSON(data, {
        // pointToLayer option defines how each GeoJSON point feature  converted into Leaflet layer
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, createMarkerStyle(feature));
        },
        // onEachFeature option binds popup content to each marker using the bindPopupContent function
        onEachFeature: bindPopupContent
    // layer is added to the map
    }).addTo(myMap);
    // createLegend function is called to add the legend control
    createLegend();
});
