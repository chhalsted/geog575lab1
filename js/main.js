//Christian Halsted 2019
//GEOG575 Lab 1

var map = L.map('map').setView([45.375, -69.0], 7);

//tried for a couple hours to move the slider onto the map but couldn't figure that out??!!
//still want to add a base with county polygons or maybe do the Interactive Choropleth Map
//still want to add a point layer with popup box listing all data for all getYears

//create base map layers
//Open Street Map
var baseLayerOSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(map);
//Stamen Terrain
var baseLayerStamen = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
  ,subdomains: 'abcd',minZoom: 0,maxZoom: 20
})
//MapBox gray scale
var mbAttr = '<a href="http://openstreetmap.org">OpenStreetMap</a> |' +' <a href="http://mapbox.com">Mapbox</a> | Christian Halsted';
var apitoken = 'pk.eyJ1IjoiY2hoYWxzdGVkIiwiYSI6ImNqbDJ5NTI1aDF2a2szcW41dGFvcnlsMDUifQ.VwB2q6vg1Z6ORVv4Myyrhg'
var mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={token}';
var baseLayerMBGrayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', token: apitoken, attribution: mbAttr});
//Esri imagery
var baseLayerEsri = L.esri.basemapLayer('Imagery');
var baseLayerEsriLabels = L.esri.basemapLayer('ImageryLabels');

map.createPane('counties');
map.createPane('wells');

//import GeoJSON data
function getData(map){
  $.ajax("data/MaineWellsByCounty.geojson", {
    dataType: "json",
    success: function(response){
      var layerCounties = L.esri.featureLayer({
          url: 'https://gis.maine.gov/arcgis/rest/services/Boundaries/Maine_Boundaries_County/MapServer/2'
          ,pane: 'counties'
        });
      var layerWells = createPropSymbols(response, map, processData(response));
      //add layer control for base map and geoJSON layers
      L.control.layers(
        {
          "Open Street Map":baseLayerOSM
          ,"Stamen Terrain":baseLayerStamen
          ,"MapBox Grayscalse":baseLayerMBGrayscale
          ,"Esri Imagery":baseLayerEsri
        },
        {
          "Wells":layerWells
          //,"Esri Labels":baseLayerEsriLabels
          ,"Counties":layerCounties
        },
        {
          sortLayers: false,
          collapsed: false,
          autoZIndex: true,
        }).addTo(map);
      createSequenceControls(map, response, processData(response));
      L.control.scale({position: 'bottomright'}).addTo(map);
    }
  });
};

//create proportional symbols
function createPropSymbols(data, map, attributes){
  //create a Leaflet GeoJSON layer and add it to the map
  wellLayer = L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return pointToLayer(feature, latlng, attributes);
    }
  }).addTo(map);
  return wellLayer;
};

function pointToLayer(feature, latlng, attributes) {
  //loop through each feature in the geoJSON file
  //attribute to use for proportional symbols
  var attribute = attributes[0];
  //console.log(attribute);
  //create marker options
  var optionsMarkers = {
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
    pane: 'wells'
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
  // //event listeners to open popup on hover
  // layer.on({
  //   mouseover: function(){
  //     this.openPopup();
  //   },
  //   mouseout: function(){
  //     this.closePopup();
  //   },
  //   click: function(){
  //      $("#panelData").html(popupContent);
  //   }
  // });
  return layer;
}

function calcPropRadius(attValue) {
  //scale factor to adjust symbol size evenly
  var scaleFactor = 10;
  //area based on attribute value and scale factor
  var area = attValue * scaleFactor;
  //radius calculated based on area
  var radius = Math.sqrt(area/Math.PI);
  return radius;
};


function createSequenceControls(map, response, attributes){
  //create range input element (slider)
  // $('#panel').append('<input class="range-slider" type="range">');
  $('#panelSeq').html('<input class="range-slider" type="range">');
  //set slider attributes
  $('.range-slider').attr({
      max: getYears(response)-1,
      min: 0,
      value: 0,
      step: 1
  });
  $('#panelSeq').append('<button class="skip" id="reverse">Reverse</button>');
  $('#panelSeq').append('<button class="skip" id="forward">Skip</button>');
  $('#reverse').html('<img src="img/reverse.png">');
  $('#forward').html('<img src="img/forward.png">');
  //Step 5: click listener for buttons
  $('.skip').click(function(){
    //get the old index value
    var index = $('.range-slider').val();

    //Step 6: increment or decrement depending on button clicked
    if ($(this).attr('id') == 'forward'){
        index++;
        //Step 7: if past the last attribute, wrap around to first attribute
        index = index > getYears(response)-1 ? 0 : index;
    } else if ($(this).attr('id') == 'reverse'){
        index--;
        //Step 7: if past the first attribute, wrap around to last attribute
        index = index < 0 ? getYears(response)-1 : index;
    };
    //Step 8: update slider
    $('.range-slider').val(index);
    // console.log(index);
    updatePropSymbols(map, attributes[index]);
  });

  //Step 5: input listener for slider
  $('.range-slider').on('input', function(){
      var index = $(this).val();
      // console.log(index);
      updatePropSymbols(map, attributes[index]);
  });
};

//Step 10: Resize proportional symbols according to new attribute values
function updatePropSymbols(map, attribute){
  map.eachLayer(function(layer){
    if (layer.feature && layer.feature.properties[attribute]){
      //access feature properties
      var props = layer.feature.properties;
      // console.log(props);
      //update each feature's radius based on new attribute values
      var radius = calcPropRadius(props[attribute]);
      layer.setRadius(radius);

      var popupContent = "<p><b>County:</b> " + props.COUNTY + "</p><p><b>"
          + attribute.replace("y","Year ") + ":</b> " + props[attribute]
      //replace the layer popup
      layer.bindPopup(popupContent, {
          offset: new L.Point(0,-radius + 5)
      });
    };
  });
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

function processData(data){
  var attributes = [];
  //properties of the first feature in the dataset
  var properties = data.features[0].properties;
  //push each attribute name into attributes array
  for (var attribute in properties){
    //only take attributes with values for yearly data
    if (attribute.indexOf("y20") > -1){
      attributes.push(attribute);
    };
  };
  return attributes;
};

$(document).ready(getData(map));




// // load GeoJSON from an external file
// $.getJSON("data/MaineWellsByCounty.geojson",function(data){
//   // add GeoJSON layer to the map once the file is loaded
//   L.geoJson(data).addTo(map);
// });
// load GeoJSON from an external file
// $.getJSON("https://opendata.arcgis.com/datasets/142145d2158a474cbd54e743811f629d_0.geojson",function(data){
//   // add GeoJSON layer to the map once the file is loaded
//   L.geoJson(data).addTo(map);
// });

// L.Control.Watermark = L.Control.extend({
// 	onAdd: function(map) {
// 		var img = L.DomUtil.create('img');
//
// 		img.src = 'https://leafletjs.com/docs/images/logo.png';
// 		img.style.width = '200px';
//
// 		return img;
// 	},
//
// 	onRemove: function(map) {
// 		// Nothing to do here
// 	}
// });
//
// L.control.watermark = function(opts) {
// 	return new L.Control.Watermark(opts);
// }
//
// L.control.watermark({ position: 'bottomleft' }).addTo(map);
