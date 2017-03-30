// var map = L.map('map', { zoomControl: false }).setView([37.32212, -122.045], 15);
var map = L.map('map', { zoomControl: false });

new L.Control.Zoom({ position: 'topright' }).addTo(map);

// baselayers
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
var boundStyle = {
    "color": "black",
    "weight": 3,
    "fillOpacity": 0
};

var cu_bound = L.geoJson(cpbd, { style: boundStyle }).addTo(map);

//set the bounds to the CU extent, not static xyz
map.fitBounds(cu_bound.getBounds());

//Geocoder from Esri
var searchControl = L.esri.Geocoding.geosearch({ position: 'topright' }).addTo(map);
var results = L.layerGroup().addTo(map);

searchControl.on('results', function (data) {
    results.clearLayers();
    for (var i = data.results.length - 1; i >= 0; i--) {
        results.addLayer(L.marker(data.results[i].latlng).bindPopup("Here!!"));
    }
});



//circle is kind of a selection tool. when an item on the side panel is clicked, circle is placed on the map
var circle;

var circleMarkerOption = {
    color: 'orange',
    fillColor: 'yellow',
    fillOpacity: 0.5,
    radius: 25
};



var cu_list = [];
var xy_list = [];
var cu_xy = [];


var animeIcon = new L.icon.pulse({
    iconSize: [15, 15]
});


var cuEvent;
var polyline;

var cuev = { "type": "FeatureCollection", "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } }, "features": [{ "type": "Feature", "properties": { "Id": 2, "Title": "Safe Routes 2 School", "Detail": "A strategy session for creating safer routes to school", "phone": "N/A", "url": "http://www.cupertino.org/?page=18&recordid=7799&returnURL=%2findex.aspx", "eDate": "2/8/2017", "eTime": "3:00 pm - 5:00 pm", "showmap": true }, "geometry": { "type": "Point", "coordinates": [-122.028225, 37.318381] } }, { "type": "Feature", "properties": { "Id": 3, "Title": "Big Bunny 5K", "Detail": "Family Fun Run!", "phone": "N/A", "url": "http://www.bigbunny5k.com/", "eDate": "4/15/2017", "eTime": "7:15 am - 11:15 am", "showmap": true }, "geometry": { "type": "Point", "coordinates": [-122.029213, 37.318386] } }, { "type": "Feature", "properties": { "Id": 1, "Title": "Farmer's Market", "Detail": "", "phone": "N/A", "url": "http://www.wcfma.org/", "eDate": "Every Sunday", "eTime": "9:30 am - 1:00 pm", "showmap": true }, "geometry": { "type": "Point", "coordinates": [-122.0492, 37.32361] } }] }

// create menu items for CueV
for (let eventIndex in cuev.features) {
    if (isTimeRelevant(cuev.features[eventIndex].properties.eDate)) {
        $('#eventsTable').append('<tr><td><small class="indented" onclick="firePopup(' + cuev.features[eventIndex].properties.Id + ')">' + cuev.features[eventIndex].properties.Title + ', ' + cuev.features[eventIndex].properties.eDate + '</small></td></tr>')

    }
}

var bigBunnyPath = [[37.31837089427468, -122.02921830159892], [37.316225011339355, -122.02921171257506], [37.31620652921515, -122.0288008429234], [37.316055066322356, -122.02807378853969], [37.316066838003266, -122.02717094983416], [37.315363721834174, -122.02714911956294], [37.31537954140263, -122.02318638050764], [37.32069056596608, -122.02320505892098], [37.32067583407001, -122.01974896452289], [37.319757402428486, -122.01978253496321], [37.31973706472365, -122.0181326168978], [37.31844334606085, -122.01860640485901], [37.31831221142091, -122.01768570791069], [37.32153021021485, -122.0163776830859], [37.32155438973507, -122.01543024585654], [37.317379026066895, -122.0170174261578], [37.31639011328493, -122.01743023576498], [37.31616903395912, -122.01747052796593], [37.31593336185735, -122.01725676669851], [37.31571827267894, -122.01683444888864], [37.315487979334755, -122.0166655804489], [37.31512261781523, -122.01679997014477], [37.31485077167983, -122.01707805980485], [37.31462476433991, -122.01749888092287], [37.31441405749428, -122.01765879517988], [37.314049468091355, -122.01773348777918], [37.31382693869619, -122.01788569682161], [37.31342684747652, -122.01839999492842], [37.31540769949465, -122.0223958346141], [37.3154705384487, -122.02260608979184], [37.315469903021466, -122.02311358805876], [37.31529111981873, -122.02310994466607], [37.31527931714382, -122.02722202880358], [37.31598223877557, -122.02725878267533], [37.31598092541927, -122.02827378606834], [37.31609045585983, -122.02855963759403], [37.31615622480667, -122.02900132780502], [37.31615809409507, -122.02931483208414], [37.31836992036855, -122.02929291865219]];

// polyline.bindPopup("Big Bunny 5K course").openPopup();


var evName = [];
var evDate = [];
var evTime = [];
var ev_xy = [];
var difference;
var polyLine;
function showEvents() {

    // events toggle
    if (!map.hasLayer(cuEvent)) {
        cuEvent = L.geoJson(cuev, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: animeIcon });
            },
            filter: function (feature, layer) {
                return isTimeRelevant(feature.properties.eDate)
            },
            onEachFeature: function (feature, layer) {
                layer._leaflet_id = feature.properties.Id;

                // layer.bindTooltip('<b>' + feature.properties.Title + '</br>' + feature.properties.eDate + '<br><small>' + difference + '</br>click icon for info</small>', { permanent: true, direction: 'top' });
                layer.bindPopup('<b>' + feature.properties.Title + '</b></br>' + feature.properties.Detail + '<br>' + feature.properties.eDate + '</br>' + feature.properties.eTime + '</br>Tel: ' + feature.properties.phone + '</br><a href=' + feature.properties.url + ' target="_blank">more info</a>');

                evName.push(feature.properties.Title);
                evDate.push(feature.properties.eDate);
                evTime.push(feature.properties.eTime);
                ev_xy.push(feature.geometry.coordinates);
            }
        }).addTo(map);
    }
    else {
        map.removeLayer(cuEvent);
    }

    // polyline toggle
    if(!map.hasLayer(polyLine)){
        polyLine = L.polyline(bigBunnyPath, {
            color: 'red', 
            weight: 5, 
            opacity: 0.6,
            lineJoin: 'round'
        }).addTo(map);
    }
    else {
        map.removeLayer(polyLine)
    }

}


function isTimeRelevant(dataEDate) {
    var today = new Date();
    var evdate = new Date(dataEDate);
    difference = Math.floor((evdate - today) / (1000 * 60 * 60 * 24)) + 1;
    if (isNaN(difference) == true) {
        difference = "";
    }
    else if (difference == 0) {
        difference = "Today!!"
    }
    else if (difference < 0) {
        return false
    }
    else {
        difference = 'in ' + difference + ' Day(s)';
    }
    return true;
}

function firePopup(id) {
    var intId = parseInt(id);

    //get target layer by it's id
    var layer = cuEvent.getLayer(intId);
    //fire event 'click' on target layer 
    layer.fireEvent('click');
    // console.log(layer)
}

var evnode = [];
var evtextnode = [];

// function selectEV(a) {

//     var ev_coord = a.id;

//     var earry = [];
//     earry = ev_coord.split(",");

//     var ex = parseFloat(earry[0]);
//     var ey = parseFloat(earry[1]);


//     map.setView([ey, ex], 18);
// }

//Park Layer start here
//pIcon is for park(tree) icon 
var parkID = [];
var coords = [];
var name_coor = [];

var mynode = [];
var textnode = [];

var pIcon = new L.icon({
    iconUrl: 'IconImg/tree.png',
    iconSize: [20, 20]
});
var geojsonMarkerOptions = {
    icon: pIcon
};

//getting park points data from GeoJson in park.js	
var pk;


function showParks(){
    if(!map.hasLayer(pk)){
        pk = L.geoJson(park, {


            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, geojsonMarkerOptions);

            }

            , onEachFeature: function (feature, layer) {
                layer.options.title = feature.properties.Name;
                // layer.bindPopup('<b>' + feature.properties.Name + '</b><hr>Open: ' + feature.properties.OPERHOURS + '<hr><li>Restroom: ' + feature.properties.RESTROOM + '</li><li>Play Ground: ' + feature.properties.PLAYGROUND + '</li><li>Golf: ' + feature.properties.GOLF + '</li><li>Soccer: ' + feature.properties.SOCCER + '</li><li>Baseball: ' + feature.properties.BASEBALL + '</li><li>Basketball: ' + feature.properties.BASKETBALL + '</li><li>Tennis Court: ' + feature.properties.TENNISCOURT + '</li><li>BBQ Pit: ' + feature.properties.BBQPIT + '</li><li>Bocceball: ' + feature.properties.BOCCEBALL + '</li><li>Volleyball: ' + feature.properties.VOLLEYBALL + '</li><a href=' + feature.properties.PARKURL + ' target="_blank">more info</a>');
            var parkFeatures = '';
            if(feature.properties.RESTROOM === 'Yes'){
                parkFeatures = parkFeatures + '<li>Bathrooms</li>'
            }
            if(feature.properties.PLAYGROUND === 'Yes'){
                parkFeatures = parkFeatures + '<li>Playground</li>'
            }
            if(feature.properties.GOLF === 'Yes'){
                parkFeatures = parkFeatures + '<li>Golf</li>'
            }
            if(feature.properties.SOCCER === 'Yes'){
                parkFeatures = parkFeatures + '<li>Soccer</li>'
            }
            if(feature.properties.BASEBALL === 'Yes'){
                parkFeatures = parkFeatures + '<li>Baseball</li>'
            }
            if(feature.properties.BASKETBALL === 'Yes'){
                parkFeatures = parkFeatures + '<li>Basketball</li>'
            }
            if(feature.properties.TENNISCOURT === 'Yes'){
                parkFeatures = parkFeatures + '<li>Tennis Court</li>'
            }
            if(feature.properties.BBQPIT === 'Yes'){
                parkFeatures = parkFeatures + '<li>BBQ Pit</li>'
            }
            if(feature.properties.BOCCEBALL === 'Yes'){
                parkFeatures = parkFeatures + '<li>Bocceball</li>'
            }
            if(feature.properties.VOLLEYBALL === 'Yes'){
                parkFeatures = parkFeatures + '<li>Volleyball</li>'
            }
            layer.options.title = feature.properties.Name;
            layer.bindPopup('<h5>' + feature.properties.Name + '</h5>' +
                '<b>Open:</b> ' + feature.properties.OPERHOURS + '</br>' +
                '<ul style="list-style: circle;">' + parkFeatures + '</ul>' +
                '<a href=' + feature.properties.PARKURL + 
                ' target="_blank">more info</a>'
            );


                layer.on('click', function (e) {


                    // map.setView(e.latlng, 16);
                    if (map.hasLayer(circle))
                    { map.removeLayer(circle); }



                    circle = L.circleMarker(e.latlng, circleMarkerOption).addTo(map);

                })

                //creating list for park name, park coordintes, and  name+coordinate   
                parkID.push(feature.properties.Name);
                coords.push(feature.geometry.coordinates);

                name_coor.push(parkID, coords);
            }
        }).addTo(map);
    }
    else {
        map.removeLayer(pk)
    }
}
var parkIndex= 0;
//this function is filtering Park geojson
function activityselect(acttype) {
    if (map.hasLayer(circle)){ 
        map.removeLayer(circle); 
    }
    $('#itemlist').html('')
    parkID = [];//reset parkID list

    if (map.hasLayer(pk)) {
        map.removeLayer(pk);
    }

    
    pk = L.geoJson(park, {


        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, geojsonMarkerOptions);

        }
        ,
        filter: function (feature, layer) {
            
            if (acttype == "BASEBALL") {

                var a = feature.properties.BASEBALL;
                if (a == "No") {
                    a = false;
                }
                else {
                    $('#itemlist').append('<tr><td onClick="selectPK(this, `parkID' + parkIndex + '`)" id="' + feature.properties.Name + '">' + feature.properties.Name + '</td></tr>');
                    parkIndex ++;
                }
                
            }

            else if (acttype == "BASKETBALL") {
                a = feature.properties.BASKETBALL;
                if (a == "No") {
                    a = false;
                }
                else {
                    $('#itemlist').append('<tr><td onClick="selectPK(this)" id="' + feature.properties.Name + '">' + feature.properties.Name + '</td></tr>');
                }
            }
            else if (acttype == "BBQPIT") {
                a = feature.properties.BBQPIT;
                if (a == "No") {
                    a = false;
                }
                else {
                    $('#itemlist').append('<tr><td onClick="selectPK(this)" id="' + feature.properties.Name + '">' + feature.properties.Name + '</td></tr>');
                }
            }
            else if (acttype == "SOCCER") {
                a = feature.properties.SOCCER;
                if (a == "No") {
                    a = false;
                }
                else {
                    $('#itemlist').append('<tr><td onClick="selectPK(this)" id="' + feature.properties.Name + '">' + feature.properties.Name + '</td></tr>');
                }
            }
            else if (acttype == "TENNISCOURT") {
                a = feature.properties.TENNISCOURT;
                if (a == "No") {
                    a = false;
                }
                else {
                    $('#itemlist').append('<tr><td onClick="selectPK(this)" id="' + feature.properties.Name + '">' + feature.properties.Name + '</td></tr>');
                }
            }
            else {
                $('#itemlist').append('<tr><td onClick="selectPK(this)" id="' + feature.properties.Name + '">' + feature.properties.Name + '</td></tr>');
                a = feature.geometry.type;
                if (a == "Point") {
                    a = true;
                }
            }
            // $('#itemlist').html(listHTML)
            return a;


        }, onEachFeature: function (feature, layer) {
           var parkFeatures = '';
            if(feature.properties.RESTROOM === 'Yes'){
                parkFeatures = parkFeatures + '<li>Bathrooms</li>'
            }
            if(feature.properties.PLAYGROUND === 'Yes'){
                parkFeatures = parkFeatures + '<li>Playground</li>'
            }
            if(feature.properties.GOLF === 'Yes'){
                parkFeatures = parkFeatures + '<li>Golf</li>'
            }
            if(feature.properties.SOCCER === 'Yes'){
                parkFeatures = parkFeatures + '<li>Soccer</li>'
            }
            if(feature.properties.BASEBALL === 'Yes'){
                parkFeatures = parkFeatures + '<li>Baseball</li>'
            }
            if(feature.properties.BASKETBALL === 'Yes'){
                parkFeatures = parkFeatures + '<li>Basketball</li>'
            }
            if(feature.properties.TENNISCOURT === 'Yes'){
                parkFeatures = parkFeatures + '<li>Tennis Court</li>'
            }
            if(feature.properties.BBQPIT === 'Yes'){
                parkFeatures = parkFeatures + '<li>BBQ Pit</li>'
            }
            if(feature.properties.BOCCEBALL === 'Yes'){
                parkFeatures = parkFeatures + '<li>Bocceball</li>'
            }
            if(feature.properties.VOLLEYBALL === 'Yes'){
                parkFeatures = parkFeatures + '<li>Volleyball</li>'
            }
            layer.options.title = feature.properties.Name;
            layer.bindPopup('<h5>' + feature.properties.Name + '</h5>' +
                '<b>Open:</b> ' + feature.properties.OPERHOURS + '</br>' +
                '<ul style="list-style: circle;">' + parkFeatures + '</ul>' +
                '<a href=' + feature.properties.PARKURL + 
                ' target="_blank">more info</a>'
            );
            layer.on('click', function (e) {
                if (map.hasLayer(circle)){ 
                    map.removeLayer(circle); 
                }

                circle = L.circleMarker(e.latlng, circleMarkerOption).addTo(map);

            })
            // console.warn('lyr\n\n', layer.id)
            // feature.properties.layerId = layer
            // coords.push(feature.geometry.coordinates);


        }
    }).addTo(map);

    parkIndex = 0;
    pk.on("featureparse", function (e){

            e.layer._leaflet_id = 'parkID' + parkIndex;
            parkIndex ++;
    });
}


function getIndexAry(arry, n) {

    for (var i = 0; i, arry.length; i++) {
        if (arry[0][i] == n)

            return arry[1][i];
    }
}
$('#activity').on('change', function(){
    activityselect(this.value);
})

// var parkNumber = 1;


function selectPK(ele, ind) {
    console.warn('parkID', ind)
    pk._layers['parkID' + ind].fire('click');
    // console.warn(pk.getLayer(ind))
    // pk.getLayer(ind).fire('click')
    var myid = ele.id;

    var xy = getIndexAry(name_coor, myid).toString();

    var arr = xy.split(",");
    var x = parseFloat(arr[0]);
    var y = parseFloat(arr[1]);


    if (map.hasLayer(circle)){ 
        map.removeLayer(circle); 
    }


    // map.setView([y, x], 16);
    circle = L.circleMarker([y, x], circleMarkerOption).addTo(map);

}


// function setAttributes(el, attrs) {
//     for (var key in attrs) {
//         el.setAttribute(key, attrs[key]);
//     }
// }

// function makeList4sidePanel(mylist, eleID) {

//     for (var i in mylist) {

//         mynode = [];
//         textnode = [];
//         mynode[i] = document.createElement("LI");

//         setAttributes(mynode[i], { "id": mylist[i], "onClick": "selectPK(this)" });
//         var num = Number(i) + 1;
//         textnode[i] = document.createTextNode("" + num + "." + " " + mylist[i]);
//         mynode[i].appendChild(textnode[i]);
//         document.getElementById(eleID).appendChild(mynode[i]);
//     }


// }




//garbage layer starts here
var garbage;

function showGarbage() {
    if (!map.hasLayer(garbage)) {
        garbage = L.geoJson(gbgsc, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);
    }
    else {
        map.removeLayer(garbage);
    }
}

function getColor(d) {
    return d === "Monday" ? '#9966ff' :
        d === "Tuesday" ? '#3366ff' :
            d === "Wednesday" ? '#00cc99' :
                d === "Thursday" ? '#ff9933' :
                    '#ffff4d';

}
function style(feature) {
    return {
        fillColor: getColor(feature.properties.Day),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.3
    };
}


function highliteFeature(e) {
    var layer = e.target;
    layer.bindPopup("<b>" + layer.feature.properties.Day + "</b>").openPopup();
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });


}

var highlightedLayer;
//mouseover function!! when item(day) in side panel is mouseovered, highlight layer cooresponding to day
function highlightFeature(da) {

    highlightedLayer = L.geoJSON(gbgsc, {
        style: {
            weight: 5,
            color: 'yellow',
            dashArray: '',
            fillOpacity: .2
        },
        filter: function (feature) {
            if (feature.properties.Day === da) {
                return true;
            }
            // else {
            return false;
            // }
        }
    }).addTo(map);
    highlightedLayer.bindPopup("<b>" + da + "</b>").openPopup();
}

//when mouseout, reset hightlight     
function resetHighlight(dat) {
    map.removeLayer(highlightedLayer)
}

function resetHighlite(e) {
    garbage.resetStyle(e.target);

}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

let newid = 0;
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highliteFeature,
        mouseout: resetHighlite,
        click: zoomToFeature
    });

}
