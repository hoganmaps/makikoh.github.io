$('[data-toggle=offcanvas]').click(function () {
    $('#sidebar').toggle();
    // $('.row-offcanvas').toggleClass('active');
    // $('.collapse').toggleClass('in').toggleClass('hidden-xs').toggleClass('visible-xs');
});

$(document).ready(function () {

    $('#disclaimerModal').modal('show');

});










var evnode = [];
var evtextnode = [];



var eNode = document.getElementById("evlist");

for (var i = 0; i < evName.length; i++) {

    evnode[i] = document.createElement("LI");

    setAttributes(evnode[i], { "id": ev_xy[i], "onClick": "selectEV(this)" });

    evtextnode[i] = document.createTextNode(evName[i] + ": " + evDate[i]);
    evnode[i].appendChild(evtextnode[i]);


    eNode.appendChild(evnode[i]);

}



function selectEV(a) {

    var ev_coord = a.id;

    var earry = [];
    earry = ev_coord.split(",");

    var ex = parseFloat(earry[0]);
    var ey = parseFloat(earry[1]);


    map.setView([ey, ex], 18);
}



function showCuEvent() {
    map.setView([37.32212, -122.045], 14);
    if (!map.hasLayer(cuEvent)) {
        cuEvent.addTo(map);
        polyline.addTo(map);
    }
    else {
        map.removeLayer(cuEvent);
        map.removeLayer(polyline);
    }
}

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
var pk = L.geoJson(park, {


    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, geojsonMarkerOptions);

    }

    , onEachFeature: function (feature, layer) {
        layer.options.title = feature.properties.Name;
        layer.bindPopup('<b>' + feature.properties.Name + '</b><hr>Open: ' + feature.properties.OPERHOURS + '<hr><li>Restroom: ' + feature.properties.RESTROOM + '</li><li>Play Ground: ' + feature.properties.PLAYGROUND + '</li><li>Golf: ' + feature.properties.GOLF + '</li><li>Soccer: ' + feature.properties.SOCCER + '</li><li>Baseball: ' + feature.properties.BASEBALL + '</li><li>Basketball: ' + feature.properties.BASKETBALL + '</li><li>Tennis Court: ' + feature.properties.TENNISCOURT + '</li><li>BBQ Pit: ' + feature.properties.BBQPIT + '</li><li>Bocceball: ' + feature.properties.BOCCEBALL + '</li><li>Volleyball: ' + feature.properties.VOLLEYBALL + '</li><a href=' + feature.properties.PARKURL + ' target="_blank">more info</a>');

        layer.on('click', function (e) {


            map.setView(e.latlng, 16);
            if (map.hasLayer(circle))
            { map.removeLayer(circle); }



            circle = L.circleMarker(e.latlng, circleMarkerOption).addTo(map);

        })

        //creating list for park name, park coordintes, and  name+coordinate   
        parkID.push(feature.properties.Name);
        coords.push(feature.geometry.coordinates);

        name_coor.push(parkID, coords);
    }
});


function showParks() {
    map.setView([37.32212, -122.045], 13);

    //if browser is IE, hide dropdown selection (meaning show only "All") because dropdown is not properly working
    if (navigator.appName == 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv 11/)) || (typeof $.browser !== "undefined" && $.browser.msie == 1)) {

        $("#activity option[value='BASEBALL']").remove();
        $("#activity option[value='basketball']").remove();
        $("#activity option[value='bbq']").remove();
        $("#activity option[value='soccer']").remove();
        $("#activity option[value='tennis']").remove();

    }
    //user click. if park layer is not on the map, make sure no park list in side panel
    if (!map.hasLayer(pk)) {
        var mNode = document.getElementById("itemlist");
        while (mNode.firstChild) {
            mNode.removeChild(mNode.firstChild);
        }

        pk.addTo(map);

        makeList4sidePanel(parkID, "itemlist");//insert park list in side panel	
    }
    else //user clidk. if park layer is on the map, remove park layer and park list from side panel

    {
        if (map.hasLayer(pk)) {
            map.removeLayer(pk);
            mynode = [];
            textnode = [];
        }
        map.removeLayer(circle);


        var mNode = document.getElementById("itemlist");
        while (mNode.firstChild) {
            mNode.removeChild(mNode.firstChild);


        }
    }
}


//dropdown --activity selection
function actselect() {

    if (map.hasLayer(circle))
    { map.removeLayer(circle); }
    map.setView([37.32212, -122.045], 13);
    if (document.getElementById("activity").value == "BASEBALL") { //alert(selectedString);
        activityselect("BASEBALL");
    }
    else if (document.getElementById("activity").value == "basketball") {
        activityselect("BASKETBALL");
    }
    else if (document.getElementById("activity").value == "bbq") {
        activityselect("BBQPIT");
    }
    else if (document.getElementById("activity").value == "soccer") {
        activityselect("SOCCER");
    }
    else if (document.getElementById("activity").value == "tennis")//(selectedString=="basketball")
    {
        activityselect("TENNISCOURT");
    }
    else {
        activityselect("ALL");
    }
}

//this function is filtering Park geojson
function activityselect(acttype) {
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
            }
            // return a;

            else if (acttype == "BASKETBALL") {
                a = feature.properties.BASKETBALL;
                if (a == "No") {
                    a = false;
                }
            }
            else if (acttype == "BBQPIT") {
                a = feature.properties.BBQPIT;
                if (a == "No") {
                    a = false;
                }
            }
            else if (acttype == "SOCCER") {
                a = feature.properties.SOCCER;
                if (a == "No") {
                    a = false;
                }
            }
            else if (acttype == "TENNISCOURT") {
                a = feature.properties.TENNISCOURT;
                if (a == "No") {
                    a = false;
                }
            }
            else {
                a = feature.geometry.type;
                if (a == "Point") {
                    a = true;
                }
            }
            return a;


        }



        , onEachFeature: function (feature, layer) {
            layer.options.title = feature.properties.Name;
            layer.bindPopup('<b>' + feature.properties.Name + '</b><hr>Open: ' + feature.properties.OPERHOURS + '<hr><li>Restroom: ' + feature.properties.RESTROOM + '</li><li>Play Ground: ' + feature.properties.PLAYGROUND + '</li><li>Golf: ' + feature.properties.GOLF + '</li><li>Soccer: ' + feature.properties.SOCCER + '</li><li>Baseball: ' + feature.properties.BASEBALL + '</li><li>Basketball: ' + feature.properties.BASKETBALL + '</li><li>Tennis Court: ' + feature.properties.TENNISCOURT + '</li><li>BBQ Pit: ' + feature.properties.BBQPIT + '</li><li>Bocceball: ' + feature.properties.BOCCEBALL + '</li><li>Volleyball: ' + feature.properties.VOLLEYBALL + '</li><a href=' + feature.properties.PARKURL + ' target="_blank">more info</a>');
            ;
            layer.on('click', function (e) {


                map.setView(e.latlng, 16);
                if (map.hasLayer(circle))
                { map.removeLayer(circle); }



                circle = L.circleMarker(e.latlng, circleMarkerOption
                ).addTo(map);

            })

            parkID.push(feature.properties.Name);
            coords.push(feature.geometry.coordinates);


        }
    }).addTo(map);




    var mNode = document.getElementById("itemlist");
    while (mNode.hasChildNodes())
    { mNode.removeChild(mNode.firstChild); }

    for (var i = 0; i < parkID.length; i++) {

        mynode[i] = document.createElement("LI");

        setAttributes(mynode[i], { "id": parkID[i], "onClick": "selectPK(this)" });
        var num = Number(i) + 1;

        textnode[i] = document.createTextNode("" + num + "." + " " + parkID[i]);
        mynode[i].appendChild(textnode[i]);

        mNode = document.getElementById("itemlist");
        mNode.appendChild(mynode[i]);

    }


}

function getIndexAry(arry, n) {

    for (var i = 0; i, arry.length; i++) {
        if (arry[0][i] == n)

            return arry[1][i];
    }
}

function selectPK(ele) {

    var myid = ele.id;

    var xy = getIndexAry(name_coor, myid).toString();

    var arr = xy.split(",");
    var x = parseFloat(arr[0]);
    var y = parseFloat(arr[1]);


    if (map.hasLayer(circle))
    { map.removeLayer(circle); }


    map.setView([y, x], 16);
    circle = L.circleMarker([y, x], circleMarkerOption).addTo(map);

}


function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

function makeList4sidePanel(mylist, eleID) {

    for (var i in mylist) {

        mynode = [];
        textnode = [];
        mynode[i] = document.createElement("LI");

        setAttributes(mynode[i], { "id": mylist[i], "onClick": "selectPK(this)" });
        var num = Number(i) + 1;
        textnode[i] = document.createTextNode("" + num + "." + " " + mylist[i]);
        mynode[i].appendChild(textnode[i]);
        document.getElementById(eleID).appendChild(mynode[i]);
    }


}




//garbage layer starts here
var garbage;

function showGabage() {
    map.setView([37.32212, -122.045], 13);
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
    if (d == "Monday") { return '#9966ff'; }
    else if (d == "Tuesday") { return '#3366ff'; }
    else if (d == "Wednesday") { return '#00cc99'; }
    else if (d == "Thursday") { return '#ff9933'; }
    else { return '#ffff4d'; }

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

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

}

//mouseover function!! when item(day) in side panel is mouseovered, highlight layer cooresponding to day
function highlightFeature(da) {
    var gdate = da.id;

    var layer_num = [];

    var layer = [];

    if (gdate == 'mon') {
        layer_num = [8, 11];
    }

    else if (gdate == 'tue') {
        layer_num = [7, 10, 12];
    }

    else if (gdate == 'wed')
    { layer_num = [1, 6]; }
    else if (gdate == 'thur')
    { layer_num = [2, 4, 5, 15]; }
    else {
        layer_num = [3, 9, 13, 14];
    }


    for (var i = 0; i < layer_num.length; i++) {

        layer[i] = garbage.getLayer(layer_num[i]);
        layer[i].setStyle({
            weight: 5,
            color: 'yellow',
            dashArray: '',
            fillOpacity: 0.7
        });

    }
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer[i].bringToFront();
    }
}

//when mouseout, reset hightlight     
function resetHighlight(dat) {
    var gdate = dat.id;

    var layer_num = [];
    //alert(gdate);
    var layer = [];

    if (gdate == 'mon') {
        layer_num = [8, 11];
    }

    else if (gdate == 'tue') {
        layer_num = [7, 10, 12];
    }

    else if (gdate == 'wed')
    { layer_num = [1, 6]; }
    else if (gdate == 'thur')
    { layer_num = [2, 4, 5, 15]; }
    else {
        layer_num = [3, 9, 13, 14];
    }


    for (var i = 0; i < layer_num.length; i++) {

        layer[i] = garbage.getLayer(layer_num[i]);
        garbage.resetStyle(layer[i]);
    }
}

function resetHighlite(e) {
    garbage.resetStyle(e.target);

}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}
function onEachFeature(feature, layer) {
    layer._leaflet_id = feature.properties.OBJECTID;
    layer.on({
        mouseover: highliteFeature,
        mouseout: resetHighlite,
        click: zoomToFeature

    });

}

//side panel open and close 
$(".btn-minimize").click(function () {
    $(this).toggleClass('btn-plus');
    $(this).find('i').toggleClass('glyphicon-triangle-top').toggleClass('glyphicon-triangle-bottom');

    $("#container").slideToggle();
});