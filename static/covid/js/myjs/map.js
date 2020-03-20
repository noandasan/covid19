var map;
var a


function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); 
    xmlHttp.send(null);
}

function initMap() {
    map = new google.maps.Map(document.getElementById('content'), {
    zoom: 5,
    center: { lat: 23.550627, lng: 45.225587 },
    mapTypeId: 'terrain',
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false
    });

    httpGetAsync('/mapping',function(callback){
        a=JSON.parse(callback);
        for (x in a) {
            map.data.addGeoJson(a[x]);
        }
    });
  
    map.data.setStyle(function (feature) {
    var magnitude = feature.getProperty('mag');
        return {
            icon: getCircle(magnitude)
        };
    });
}

function getCircle(magnitude) {
    if(magnitude==0){
        magnitude=magnitude;
    }else{
        magnitude=magnitude * 2 +2;
    }
    return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: 'red',
    fillOpacity: .3,
    scale: magnitude,
    strokeColor: 'white',
    strokeWeight: .5
    };
}
