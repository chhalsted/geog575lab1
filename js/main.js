//Christian Halsted 2019

var map = L.map('mapid').setView([45.375, -69.0], 7);

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(map);

//add geoJSON points to the map as image icons only
// $.ajax("data/MaineWellsByCounty.geojson", {
//   dataType: "json",
//   success: function(response){
//     L.geoJson(response).addTo(map);
//   }
// });

function calcPropRadius(attValue) {
  //scale factor to adjust symbol size evenly
  var scaleFactor = 5;
  //area based on attribute value and scale factor
  var area = attValue * scaleFactor;
  //radius calculated based on area
  var radius = Math.sqrt(area/Math.PI);
  return radius;
};

function pointToLayer(feature, latlng) {
  //loop through each feature in the geoJSON file
  //attribute to use for proportional symbols
  var attribute = "y2010";
  //create marker options
  var optionsMarkers = {
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };
  //For each feature, determine its value for the selected attribute
  var attValue = Number(feature.properties[attribute]);
  //console.log(feature.properties, attValue);
  //Give each feature's circle marker a radius based on its attribute value
  optionsMarkers.radius = calcPropRadius(attValue);
  //create circle marker layer
  var layer = L.circleMarker(latlng, optionsMarkers);
  //build popup content string
  var popupContent = "<p><b>County:</b> " + feature.properties.COUNTY + "</p><p><b>"
      + attribute.replace("y","Year ") + ":</b> " + feature.properties[attribute] + "</p>";
  //bind the popup to the circle marker
  layer.bindPopup(popupContent,{
    offset: new L.Point(0, -optionsMarkers.radius + 5)  //offset the popup box
  });
  //event listeners to open popup on hover
  layer.on({
      mouseover: function(){
        this.openPopup();
      },
      mouseout: function(){
        this.closePopup();
      },
      click: function(){
        // $("#panel").html(popupContent);
        //$("#panelData").append(popupContent);
         $("#panelData").html(popupContent);
      }
  });

  //return the circle marker to the L.geoJson pointToLayer option
  return layer;
}
function createPropSymbols(data, map){
  //create a Leaflet GeoJSON layer and add it to the map
  L.geoJson(data, {
    pointToLayer: pointToLayer
  }).addTo(map);
};

function createSequenceControls(map, response){
  //create range input element (slider)
  // $('#panel').append('<input class="range-slider" type="range">');
  $('#panelSeq').html('<input class="range-slider" type="range">');
  //set slider attributes
  $('.range-slider').attr({
      max: getYears(response),
      min: 0,
      value: 0,
      step: 1
  });
  $('#panelSeq').append('<button class="skip" id="reverse">Reverse</button>');
  $('#panelSeq').append('<button class="skip" id="forward">Skip</button>');
  $('#reverse').html('<img src="img/reverse.png">');
  $('#forward').html('<img src="img/forward.png">');

};

//function to get the number of year fields included in the geoJSON data
function getYears(data) {
  var countYears=0;
  $.each(data.features[0].properties, function(k, v){
    if(k[0]=="y") {
      countYears += 1;
    }
  })
  return countYears;
}
//import GeoJSON data
function getData(map){
  //load the data
  $.ajax("data/MaineWellsByCounty.geojson", {
    dataType: "json",
    success: function(response){
      //call function to create proportional symbols
      createPropSymbols(response, map);
      //console.log(response.features.length);
      //console.log(getYears(response));
      createSequenceControls(map, response);
    }
  });
};

$(document).ready(getData(map));

// function onEachFeature(feature, layer) {
//   var popupContent = "<p>2010: " + feature.properties["y2010"] + "</p>";
//   if (feature.properties) {
//     layer.bindPopup(popupContent);
//   };
// };
//
// //import geoJSON data from file
// $.ajax("data/MaineWellsByCounty.geojson", {
//   dataType: "json",
//   success: function(response){
//     var geojsonMarkerOptions = {
//     	radius: 8,
//     	fillColor: "#ff7800",
//     	color: "#000",
//     	weight: 1,
//     	opacity: 1,
//     	fillOpacity: 0.6
//     };
//
//     //create a Leaflet GeoJSON layer and add it to the map
//     L.geoJson(response, {
//       pointToLayer: function (feature, latlng){
//         return L.circleMarker(latlng, geojsonMarkerOptions);
//       },
//       onEachFeature: onEachFeature
//     }).addTo(map);
//   }
// });
