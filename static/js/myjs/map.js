    var marker;

    function initMap() {
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: {lat: 23.550627, lng: 45.225587}
      });

      marker = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: {lat: 25.377294, lng: 46.653974}
      });
      marker.addListener('click', toggleBounce);

    //   marker.addListener('dragend',function(evt){
    //     document.getElementById('latitude').innerHTML="s";
    // //    document.getElementById('longitude').innerHTML=evt.latLng.lng();
    //   });
      
      google.maps.event.addListener(marker, 'dragend', function (evt) {
          ;
       document.getElementById('latitude').value =evt.latLng.lat();
       document.getElementById('longitude').value =evt.latLng.lng();
      });

    }

    function toggleBounce() {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      }
    }