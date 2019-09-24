//Christian Halsted 2019

var map = L.map('mapid').setView([51.505, -0.09], 13);

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(map);

// //add tile layer...replace project id and accessToken with your own
// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
//    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery   <a href="http://mapbox.com">Mapbox</a>',
//    maxZoom: 18,
//    id: 'chhalsted/ck0eghgrm1o031dr0elweyxc0',
//    accessToken: 'pk.eyJ1IjoiY2hoYWxzdGVkIiwiYSI6ImNqbDJ5NTI1aDF2a2szcW41dGFvcnlsMDUifQ.VwB2q6vg1Z6ORVv4Myyrhg'
// }).addTo(map);

var marker = L.marker([51.5, -0.09]).addTo(map);

var circle = L.circle([51.508, -0.11], 500, {
   color: 'red',
   fillColor: '#f03',
   fillOpacity: 0.5
}).addTo(map);

var polygon = L.polygon([
   [51.509, -0.08],
   [51.503, -0.06],
   [51.51, -0.047]
]).addTo(map);

marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
circle.bindPopup("I am a circle BLAH.");
polygon.bindPopup("I am a polygon.");

var popup = L.popup()
   .setLatLng([51.5, -0.09])
   .setContent("I am a standalone popup.")
   .openOn(map);

var popup = L.popup();

function onMapClick(e) {
   popup
       .setLatLng(e.latlng)
       .setContent("You clicked the map at " + e.latlng.toString())
       .openOn(map);
}

map.on('click', onMapClick);


	// var mymap = L.map('mapid').setView([51.505, -0.09], 13);
  //
	// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	// 	maxZoom: 18,
	// 	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
	// 		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
	// 		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	// 	id: 'mapbox.streets'
	// }).addTo(mymap);

var geojsonFeature = {
  	"type": "Feature",
  	"properties": {
  		"name": "Coors Field",
  		"amenity": "Baseball Stadium",
  		"popupContent": "This is where the Rockies play!"
  	},
  	"geometry": {
  		"type": "Point",
  		"coordinates": [-104.99404, 39.75621]
  	}
  };
  L.geoJSON(geojsonFeature).addTo(map);

var myLines = [{
	"type": "LineString",
	"coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
	"type": "LineString",
	"coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];

var myStyle = {
	"color": "#ff7800",
	"weight": 5,
	"opacity": 0.65
};

L.geoJSON(myLines, {
	style: myStyle
}).addTo(map);

var states = [{
	"type": "Feature",
	"properties": {"party": "Republican"},
	"geometry": {
		"type": "Polygon",
		"coordinates": [[
			[-104.05, 48.99],
			[-97.22,  48.98],
			[-96.58,  45.94],
			[-104.03, 45.94],
			[-104.05, 48.99]
		]]
	}
}, {
	"type": "Feature",
	"properties": {"party": "Democrat"},
	"geometry": {
		"type": "Polygon",
		"coordinates": [[
			[-109.05, 41.00],
			[-102.06, 40.99],
			[-102.03, 36.99],
			[-109.04, 36.99],
			[-109.05, 41.00]
		]]
	}
}];

L.geoJSON(states, {
	style: function(feature) {
		switch (feature.properties.party) {
			case 'Republican': return {color: "#ff0000"};
			case 'Democrat':   return {color: "#0000ff"};
		}
	}
}).addTo(map);
