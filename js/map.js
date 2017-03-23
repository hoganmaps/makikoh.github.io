var map = L.map('map', { zoomControl: false }).setView([37.32212, -122.045], 15);

new L.Control.Zoom({ position: 'topright' }).addTo(map);


var imagery = L.esri.basemapLayer('Imagery');
var streets = L.esri.basemapLayer('Streets');
var topography = L.esri.basemapLayer('Topographic').addTo(map);
var openstreetmap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
});

var baseMaps = {
    "Streets": streets,
    "Imagery": imagery,
    "Topographic": topography,
    "OpenStreetMap": openstreetmap
};


   
new L.control.layers(baseMaps).addTo(map);

//Cupertino City boundary
var boundStyle={
   "color": "black" ,
   "weight":3,
   "fillOpacity": 0
   };

var cu_bound=L.geoJson(cpbd,{style: boundStyle}).addTo(map);

//Geocoder from Esri
var searchControl = L.esri.Geocoding.geosearch({position:'topright'}).addTo(map);
var results = L.layerGroup().addTo(map);

  searchControl.on('results', function(data){
    results.clearLayers();
    for (var i = data.results.length - 1; i >= 0; i--) {
      results.addLayer(L.marker(data.results[i].latlng).bindPopup("Here!!"));
    }
  });
 
 
 
//circle is kind of a selection tool. when an item on the side panel is clicked, circle is placed on the map
var circle;
	
var circleMarkerOption={
color: 'orange',
    fillColor: 'yellow',
    fillOpacity: 0.5,
    radius: 25
};

var cu_list=[];
var xy_list=[];
var cu_xy=[];


 var animeIcon=new L.icon.pulse({
	
	iconSize: [15,15]
	});
	
	
var cuEvent;
var polyline;

var cuev={"type":"FeatureCollection","crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:OGC:1.3:CRS84"}},"features":[{"type":"Feature","properties":{"Id":2,"Title":"Safe Routes 2 School","Detail":"A strategy session for creating safer routes to school","phone":"N/A","url":"http://www.cupertino.org/?page=18&recordid=7799&returnURL=%2findex.aspx","eDate":"2/8/2017","eTime":"3:00 pm - 5:00 pm","showmap":true},"geometry":{"type":"Point","coordinates":[-122.028225,37.318381]}},{"type":"Feature","properties":{"Id":3,"Title":"Big Bunny 5K","Detail":"Family Fun Run!","phone":"N/A","url":"http://www.bigbunny5k.com/","eDate":"4/15/2017","eTime":"7:15 am - 11:15 am","showmap":true},"geometry":{"type":"Point","coordinates":[-122.029213,37.318386]}},{"type":"Feature","properties":{"Id":1,"Title":"Farmer's Market","Detail":"","phone":"N/A","url":"http://www.wcfma.org/","eDate":"Every Sunday","eTime":"9:30 am - 1:00 pm","showmap":true},"geometry":{"type":"Point","coordinates":[-122.0492,37.32361]}}]}


var latlngs = [
    [37.31837089427468, -122.02921830159892],
    [37.316225011339355, -122.02921171257506],
    [37.31620652921515, -122.0288008429234],
	[37.316055066322356,-122.02807378853969],
	[37.316066838003266,-122.02717094983416],[37.315363721834174,-122.02714911956294],[37.31537954140263,-122.02318638050764],[37.32069056596608,-122.02320505892098],[37.32067583407001,-122.01974896452289],[37.319757402428486,-122.01978253496321],[37.31973706472365,-122.0181326168978],[37.31844334606085,-122.01860640485901],[37.31831221142091,-122.01768570791069],[37.32153021021485,-122.0163776830859],[37.32155438973507,-122.01543024585654],[37.317379026066895,-122.0170174261578],[37.31639011328493,-122.01743023576498],[37.31616903395912,-122.01747052796593],[37.31593336185735,-122.01725676669851],[37.31571827267894,-122.01683444888864],[37.315487979334755,-122.0166655804489],[37.31512261781523,-122.01679997014477],[37.31485077167983,-122.01707805980485],[37.31462476433991,-122.01749888092287],[37.31441405749428,-122.01765879517988],[37.314049468091355,-122.01773348777918],[37.31382693869619,-122.01788569682161],[37.31342684747652,-122.01839999492842],[37.31540769949465,-122.0223958346141],[37.3154705384487,-122.02260608979184],[37.315469903021466,-122.02311358805876],[37.31529111981873,-122.02310994466607],[37.31527931714382,-122.02722202880358],[37.31598223877557,-122.02725878267533],[37.31598092541927,-122.02827378606834],[37.31609045585983,-122.02855963759403],[37.31615622480667,-122.02900132780502],[37.31615809409507,-122.02931483208414],[37.31836992036855,-122.02929291865219]
];
var polyline = L.polyline(latlngs, {color: 'red', weight: 5, opacity:0.6, 
                lineJoin: 'round'}).addTo(map);
polyline.bindPopup("Big Bunny 5K course").openPopup();


var evName = [];
var evDate = [];
var evTime = [];
var ev_xy = [];
var difference;
cuEvent = L.geoJson(cuev, {


    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: animeIcon });

    }

    , filter: function (feature, layer) {
        var today = new Date();
        var evdate = new Date(feature.properties.eDate);
        difference = Math.floor((evdate - today) / (1000 * 60 * 60 * 24)) + 1;
        if (isNaN(difference) == true)
        { difference = ""; }
        else if (difference == 0)
        { difference = "Today!!" }
        else if (difference < 0)
        { return feature.properties.showmap = false }
        else
        { difference = 'in ' + difference + ' Day(s)'; }
        return feature.properties.showmap;
    }


    , onEachFeature: function (feature, layer) {
        layer.bindTooltip('<b>' + feature.properties.Title + '</br>' + feature.properties.eDate + '<br><small>' + difference + '</br>click icon for info</small>', { permanent: true, direction: 'top' });
        layer.bindPopup('<b>' + feature.properties.Title + '</b></br>' + feature.properties.Detail + '<br>' + feature.properties.eDate + '</br>' + feature.properties.eTime + '</br>Tel: ' + feature.properties.phone + '</br><a href=' + feature.properties.url + ' target="_blank">more info</a>');

        evName.push(feature.properties.Title);
        evDate.push(feature.properties.eDate);
        evTime.push(feature.properties.eTime);
        ev_xy.push(feature.geometry.coordinates);
    }

}).addTo(map);